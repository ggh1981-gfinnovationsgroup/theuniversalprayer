// Motor compartido de los juegos de búsqueda en laberinto 3D.
// Cada juego define su configuración (tema, laberinto, personajes o
// objetos, textos en dos idiomas) y llama a window.QuestGame(config).
(() => {
  'use strict';

  function cellToWorld(cell) {
    return { x: -12 + cell[0] * 4, z: -cell[1] * 4 };
  }

  window.QuestGame = function QuestGame(config) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas || typeof window.Game3DRenderer !== 'function') {
      throw new Error('No se pudo iniciar el motor 3D del juego.');
    }
    const renderer = new window.Game3DRenderer(canvas);
    const overlay = document.getElementById('gameOverlay');
    const playButton = document.getElementById('playButton');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayMessage = document.getElementById('overlayMessage');
    const progressCount = document.getElementById('progressCount');
    const npcName = document.getElementById('npcName');
    const npcDialogue = document.getElementById('npcDialogue');
    const interactButton = document.getElementById('interactButton');
    const interactTouch = document.getElementById('interactTouch');
    const endBanner = document.getElementById('endBanner');
    const endRestartButton = document.getElementById('endRestartButton');
    const gameFrame = document.querySelector('.game-frame');
    const gameStatus = document.getElementById('gameStatus');
    const toast = document.getElementById('toast');
    const languageToggle = document.getElementById('languageToggle');

    const strings = config.strings;
    const maze = { columns: 7, rows: 8, cells: new Set(config.mazeCells) };
    const goal = config.goal || { x: 8, z: -28 };
    const total = config.mode === 'help' ? config.npcs.length : config.items.length;
    const player = { x: 0, z: 0, y: 0, vy: 0, vx: 0, vz: 0, grounded: true, facing: Math.PI };
    const keys = new Set();
    let npcs = [];
    let items = [];
    let running = false;
    let finished = false;
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let lastTime = 0;
    let toastTimer;
    let hintTimer;
    let audioContext = null;
    let melodyCloseTimer;
    let nearbyNpc = null;
    let greetingNpc = null;

    const world = {
      goal,
      items: [],
      npcs: [],
      playerFigure: { ...config.playerFigure, x: 0, z: 0, index: 99 },
      completed: false,
    };

    function text() { return strings[language]; }

    function progress() {
      return config.mode === 'help'
        ? npcs.filter((npc) => npc.joined).length
        : items.filter((item) => item.taken).length;
    }

    function setLanguage(nextLanguage) {
      language = nextLanguage === 'en' ? 'en' : 'es';
      document.documentElement.lang = language;
      localStorage.setItem('tup_lang', language);
      document.querySelectorAll('[data-es][data-en]').forEach((element) => {
        element.innerHTML = element.dataset[language];
      });
      languageToggle.textContent = language === 'es' ? 'EN' : 'ES';
      languageToggle.setAttribute('aria-label', language === 'es' ? 'Switch language' : 'Cambiar idioma');
      if (!running && !finished) {
        overlayTitle.textContent = text().startTitle;
        overlayMessage.textContent = text().startMessage;
        playButton.textContent = text().start;
      }
      if (config.mode === 'help' && greetingNpc) renderNearby(greetingNpc);
      if (config.mode === 'collect' && !finished) npcDialogue.textContent = text().hint;
      gameStatus.textContent = text().status(progress(), total);
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1900);
    }

    function prepareAudio() {
      if (audioContext || !window.AudioContext) return;
      try {
        audioContext = new window.AudioContext();
        audioContext.resume().catch(() => showToast(text().audioUnavailable));
      } catch (error) {
        audioContext = null;
      }
    }

    function playTone(midi, start, duration, volume) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
      const end = start + duration * 0.92;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.05);
      gain.gain.setValueAtTime(volume, Math.max(start + 0.05, end - 0.07));
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(end + 0.03);
    }

    function playChime() {
      if (!audioContext) return;
      const start = audioContext.currentTime + 0.03;
      playTone(76, start, 0.22, 0.05);
      playTone(84, start + 0.13, 0.34, 0.05);
    }

    function playMelody() {
      if (!audioContext) {
        showToast(text().audioUnavailable);
        return;
      }
      const context = audioContext;
      const startAt = context.currentTime + 0.12;
      let offset = 0;
      (config.melody || []).forEach(([midi, duration]) => {
        playTone(midi, startAt + offset, duration, 0.055);
        offset += duration;
      });
      clearTimeout(melodyCloseTimer);
      melodyCloseTimer = setTimeout(() => {
        if (audioContext === context) {
          context.close().catch(() => {});
          audioContext = null;
        }
      }, (offset + 1) * 1000);
    }

    function renderNearby(npc) {
      if (config.mode !== 'help') return;
      if (!npc) {
        npcName.textContent = '';
        npcDialogue.textContent = npcs.every((item) => item.joined) ? text().allDone : text().hint;
        return;
      }
      const data = config.npcs[npc.index];
      npcName.textContent = data.name[language];
      if (npc.joined) {
        npcDialogue.textContent = data.response[language];
        interactButton.hidden = true;
        interactTouch.hidden = true;
        return;
      }
      npcDialogue.textContent = npc.step === 0 ? data.greeting[language] : data.afterFirst[language];
      interactButton.textContent = data.actions[language][npc.step];
      interactTouch.textContent = data.touch[npc.step];
      interactButton.hidden = false;
      interactTouch.hidden = false;
    }

    function updateNearby() {
      if (config.mode !== 'help') return;
      const candidate = npcs.find((npc) => !npc.joined &&
        Math.hypot(player.x - npc.x, player.z - npc.z) < 2.65);
      nearbyNpc = candidate || null;
      if (nearbyNpc) {
        greetingNpc = nearbyNpc;
        renderNearby(nearbyNpc);
        return;
      }
      interactButton.hidden = true;
      interactTouch.hidden = true;
      if (greetingNpc) {
        renderNearby(npcs.every((npc) => npc.joined) ? null : greetingNpc);
      } else {
        npcName.textContent = '';
        npcDialogue.textContent = text().hint;
      }
    }

    function resetGame() {
      player.x = 0;
      player.z = 0;
      player.y = 0;
      player.vx = 0;
      player.vz = 0;
      player.vy = 0;
      player.grounded = true;
      player.facing = Math.PI;
      npcs = (config.npcs || []).map((data, index) => {
        const position = cellToWorld(data.cell);
        return {
          ...position,
          index,
          y: 0,
          step: 0,
          joined: false,
          figure: { ...data.figure, x: position.x, z: position.z, index },
        };
      });
      items = (config.items || []).map((data) => {
        const position = cellToWorld(data.cell);
        return { ...position, type: data.type, color: data.color, taken: false };
      });
      world.npcs = npcs;
      world.items = items;
      world.completed = false;
      world.playerFigure.x = 0;
      world.playerFigure.z = 0;
      greetingNpc = null;
      nearbyNpc = null;
      running = false;
      finished = false;
      keys.clear();
      progressCount.textContent = '0';
      gameStatus.textContent = text().status(0, total);
      interactButton.hidden = true;
      interactTouch.hidden = true;
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      npcName.textContent = '';
      npcDialogue.textContent = config.mode === 'collect' ? text().hint : '';
      overlayTitle.textContent = text().startTitle;
      overlayMessage.textContent = text().startMessage;
      playButton.textContent = text().start;
      overlay.classList.remove('is-hidden');
    }

    function startGame() {
      if (finished) resetGame();
      prepareAudio();
      running = true;
      overlay.classList.add('is-hidden');
      canvas.focus({ preventScroll: true });
    }

    function completeGame() {
      finished = true;
      running = false;
      keys.clear();
      world.completed = true;
      npcs.forEach((npc) => { npc.figure.singing = true; });
      endBanner.hidden = false;
      gameFrame.classList.add('is-finished');
      playMelody();
      overlayTitle.textContent = text().finishTitle;
      overlayMessage.textContent = text().finishMessage;
      playButton.textContent = text().restart;
      gameStatus.textContent = text().finishTitle;
      npcName.textContent = '';
      npcDialogue.textContent = text().finishMessage;
    }

    function helpNpc() {
      if (!running || !nearbyNpc) return;
      const npc = nearbyNpc;
      const data = config.npcs[npc.index];
      player.vx = 0;
      player.vz = 0;
      if (npc.step === 0) {
        npc.step = 1;
        playChime();
        npcDialogue.textContent = data.afterFirst[language];
        showToast(data.afterFirst[language]);
        renderNearby(npc);
        return;
      }
      npc.joined = true;
      greetingNpc = npc;
      nearbyNpc = null;
      playChime();
      const count = progress();
      progressCount.textContent = String(count);
      gameStatus.textContent = text().status(count, total);
      npcName.textContent = data.name[language];
      npcDialogue.textContent = data.response[language];
      showToast(data.response[language]);
      interactButton.hidden = true;
      interactTouch.hidden = true;
    }

    function collectNearby() {
      if (config.mode !== 'collect') return;
      const item = items.find((entry) => !entry.taken &&
        Math.hypot(player.x - entry.x, player.z - entry.z) < 1.2);
      if (!item) return;
      item.taken = true;
      playChime();
      const count = progress();
      progressCount.textContent = String(count);
      gameStatus.textContent = text().status(count, total);
      const message = count === total ? text().allDone : text().itemFound(count, total);
      npcDialogue.textContent = message;
      showToast(message);
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => {
        if (!finished) npcDialogue.textContent = text().hint;
      }, 2600);
    }

    function moveFollowers(delta) {
      npcs.forEach((npc) => {
        if (!npc.joined) return;
        const side = npc.index % 2 === 0 ? -1 : 1;
        const targetX = player.x + side * (0.8 + Math.floor(npc.index / 2) * 0.25);
        const targetZ = player.z + 1.45 + npc.index * 0.58;
        const follow = 1 - Math.exp(-delta * 2.8);
        npc.x += (targetX - npc.x) * follow;
        npc.z += (targetZ - npc.z) * follow;
        npc.figure.x = npc.x;
        npc.figure.z = npc.z;
      });
    }

    function cellAt(x, z) {
      return {
        column: Math.floor((x + 14) / 4),
        row: Math.floor((2 - z) / 4),
      };
    }

    function canOccupy(x, z) {
      const { column, row } = cellAt(x, z);
      if (!maze.cells.has(`${column},${row}`)) return false;
      const localX = x - (-12 + column * 4);
      const localZ = z - (-row * 4);
      const clearance = 0.42;
      return (localX >= -2 + clearance || maze.cells.has(`${column - 1},${row}`)) &&
        (localX <= 2 - clearance || maze.cells.has(`${column + 1},${row}`)) &&
        (localZ >= -2 + clearance || maze.cells.has(`${column},${row + 1}`)) &&
        (localZ <= 2 - clearance || maze.cells.has(`${column},${row - 1}`));
    }

    function movePlayer(delta) {
      const steps = Math.max(1, Math.ceil(Math.max(Math.abs(player.vx), Math.abs(player.vz)) * delta / 0.12));
      const stepX = player.vx * delta / steps;
      const stepZ = player.vz * delta / steps;
      for (let step = 0; step < steps; step++) {
        const nextX = player.x + stepX;
        if (canOccupy(nextX, player.z)) player.x = nextX;
        else player.vx = 0;
        const nextZ = player.z + stepZ;
        if (canOccupy(player.x, nextZ)) player.z = nextZ;
        else player.vz = 0;
      }
    }

    function update(delta) {
      if (!running) return;
      const up = keys.has('ArrowUp') || keys.has('KeyW');
      const down = keys.has('ArrowDown') || keys.has('KeyS');
      const left = keys.has('ArrowLeft') || keys.has('KeyA');
      const right = keys.has('ArrowRight') || keys.has('KeyD');
      let inputX = (right ? 1 : 0) - (left ? 1 : 0);
      let inputZ = (down ? 1 : 0) - (up ? 1 : 0);
      const length = Math.hypot(inputX, inputZ) || 1;
      inputX /= length;
      inputZ /= length;
      const acceleration = player.grounded ? 20 : 10;
      player.vx += inputX * acceleration * delta;
      player.vz += inputZ * acceleration * delta;
      const drag = Math.pow(player.grounded ? 0.002 : 0.35, delta);
      if (!inputX) player.vx *= drag;
      if (!inputZ) player.vz *= drag;
      const speed = Math.hypot(player.vx, player.vz);
      if (speed > 5.2) {
        player.vx = player.vx / speed * 5.2;
        player.vz = player.vz / speed * 5.2;
      }
      if (inputX || inputZ) player.facing = Math.atan2(inputX, inputZ);
      movePlayer(delta);
      player.vy -= 22 * delta;
      player.y += player.vy * delta;
      if (player.y <= 0) {
        player.y = 0;
        player.vy = 0;
        player.grounded = true;
      }
      moveFollowers(delta);
      updateNearby();
      collectNearby();
      world.playerFigure.x = player.x;
      world.playerFigure.z = player.z;
      world.playerFigure.y = player.y;
      if (progress() === total &&
        Math.hypot(player.x - goal.x, player.z - goal.z) < 2.2) {
        completeGame();
      }
    }

    function frame(time) {
      const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
      lastTime = time;
      update(delta);
      renderer.renderMazeQuest(player, world, time, maze, config.theme);
      window.requestAnimationFrame(frame);
    }

    function keyDown(event) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      if (event.code === 'KeyR') {
        resetGame();
        startGame();
        return;
      }
      if ((event.code === 'KeyE' || event.code === 'Enter') && nearbyNpc) {
        event.preventDefault();
        helpNpc();
        return;
      }
      if (event.code === 'Space' && running && player.grounded) {
        player.vy = 7.5;
        player.grounded = false;
      }
      keys.add(event.code);
      if (event.code === 'Enter' && !running) startGame();
    }

    function keyUp(event) { keys.delete(event.code); }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
    interactButton.addEventListener('click', helpNpc);
    interactTouch.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      helpNpc();
    });
    languageToggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', () => keys.clear());
    window.addEventListener('resize', () => renderer.resize());

    document.querySelectorAll('[data-key]').forEach((button) => {
      const key = button.dataset.key;
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        keys.add(key);
      });
      const release = () => keys.delete(key);
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
    });

    resetGame();
    setLanguage(language);
    renderer.resize();
    window.requestAnimationFrame(frame);
  };
})();
