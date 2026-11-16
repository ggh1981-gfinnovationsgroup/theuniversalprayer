// Motor del jardín para el Inmaculado Corazón de María: Fátima en 3D.
// Lucía camina libre por el jardín de Fátima recogiendo las rosas que
// nacen para el Corazón de María antes de que se marchiten, y evitando
// las plantas de espinas. El juego avanza por tres rondas, cada una
// precedida por una tarjeta con un momento de las apariciones de 1917.
// Cada juego define su configuración (tema, figura, melodía y textos en
// dos idiomas) y llama a window.GardenGame(config).
(() => {
  'use strict';

  const GOAL_ROSES = 22;
  const HEARTS_START = 3;
  const SPAWNS_PER_ROUND = 12;
  const CARD_SECONDS = 3.6;
  const ROUND_INTERVAL = [0.95, 0.8, 0.68];
  const ROUND_LIFE = [6, 5, 4];
  const ROUND_THORN = [0.15, 0.25, 0.35];
  const GOAL = { x: 0, z: -14 };
  const BOUNDS = { x: 13, zMin: -16, zMax: 2 };
  const ROSE_COLORS = ['#f2789f', '#f7f3e8'];

  window.GardenGame = function GardenGame(config) {
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
    const endBanner = document.getElementById('endBanner');
    const endRestartButton = document.getElementById('endRestartButton');
    const gameFrame = document.querySelector('.game-frame');
    const gameStatus = document.getElementById('gameStatus');
    const toast = document.getElementById('toast');
    const languageToggle = document.getElementById('languageToggle');

    const theme = config.theme;
    const strings = config.strings;
    const player = { x: 0, z: 0, y: 0, vx: 0, vz: 0, vy: 0, facing: Math.PI };
    const lucia = { ...config.playerFigure, x: player.x, z: player.z, y: 0, index: 1 };
    const jacinta = {
      x: -2.6, z: -13.2, y: 0, size: 'child',
      robe: '#c76f75', dress: '#c76f75', skin: '#eec39a', hair: '#4a3423', index: 2,
    };
    const francisco = {
      x: -3.8, z: -12.4, y: 0, size: 'child',
      robe: '#5891a6', skin: '#d9a77f', hair: '#3a2a1c', index: 3,
    };
    const keys = new Set();
    let items = [];
    let roses = 0;
    let hearts = HEARTS_START;
    let streak = 0;
    let round = 0;
    let spawnedInRound = 0;
    let roseCounter = 0;
    let spawnTimer = 0;
    let cardTimer = 0;
    let invuln = 0;
    let phase = 'idle';
    let running = false;
    let finished = false;
    let over = false;
    let completed = false;
    let dialogueState = { kind: 'hint' };
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let lastTime = 0;
    let toastTimer;
    let hintTimer;
    let audioContext = null;
    let melodyCloseTimer;

    function text() { return strings[language]; }

    function updateHud() {
      progressCount.textContent = String(roses);
      gameStatus.textContent = text().status(roses, GOAL_ROSES);
      if (phase !== 'card' && !finished) {
        npcName.textContent = `${text().heartsLabel} ${'♥'.repeat(Math.max(0, hearts))} · ${text().comboLabel} ${streak}`;
      }
    }

    function renderDialogue() {
      if (dialogueState.kind === 'combo') {
        npcDialogue.textContent = text().comboMsg(dialogueState.streak);
      } else if (dialogueState.kind === 'thorn') {
        npcDialogue.textContent = text().thornHit;
      } else if (dialogueState.kind === 'finish') {
        npcDialogue.textContent = text().finishMessage;
      } else {
        npcDialogue.textContent = text().hint;
      }
    }

    function renderCard() {
      const card = text().rounds[round];
      if (!card) return;
      npcName.textContent = card.title;
      npcDialogue.textContent = card.text;
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
      if (finished) {
        overlayTitle.textContent = text().finishTitle;
        overlayMessage.textContent = text().finishMessage;
        playButton.textContent = text().restart;
      } else if (over) {
        overlayTitle.textContent = text().loseTitle;
        overlayMessage.textContent = text().loseDetail(roses);
        playButton.textContent = text().retry;
      } else if (!running) {
        overlayTitle.textContent = text().startTitle;
        overlayMessage.textContent = text().startMessage;
        playButton.textContent = text().start;
      }
      if (!finished) {
        updateHud();
        if (phase === 'card') renderCard();
        else renderDialogue();
      }
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

    function playChime(currentStreak) {
      if (!audioContext) return;
      const start = audioContext.currentTime + 0.03;
      const base = 74 + Math.min(currentStreak, 10);
      playTone(base, start, 0.2, 0.05);
      playTone(base + 7, start + 0.09, 0.3, 0.05);
    }

    function playThornTone() {
      if (!audioContext) return;
      playTone(47, audioContext.currentTime + 0.03, 0.35, 0.07);
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

    function resetGame() {
      items = [];
      roses = 0;
      hearts = HEARTS_START;
      streak = 0;
      round = 0;
      spawnedInRound = 0;
      roseCounter = 0;
      spawnTimer = 0;
      cardTimer = 0;
      invuln = 0;
      phase = 'idle';
      running = false;
      finished = false;
      over = false;
      completed = false;
      dialogueState = { kind: 'hint' };
      player.x = 0;
      player.z = 0;
      player.vx = 0;
      player.vz = 0;
      player.facing = Math.PI;
      keys.clear();
      interactButton.hidden = true;
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      updateHud();
      npcDialogue.textContent = text().hint;
      overlayTitle.textContent = text().startTitle;
      overlayMessage.textContent = text().startMessage;
      playButton.textContent = text().start;
      overlay.classList.remove('is-hidden');
    }

    function startRound(index) {
      round = index;
      spawnedInRound = 0;
      spawnTimer = 0;
      cardTimer = CARD_SECONDS;
      phase = 'card';
      clearTimeout(hintTimer);
      dialogueState = { kind: 'hint' };
      renderCard();
      const card = text().rounds[round];
      if (card) showToast(card.title);
    }

    function startGame() {
      if (finished || over) resetGame();
      prepareAudio();
      running = true;
      overlay.classList.add('is-hidden');
      canvas.focus({ preventScroll: true });
      startRound(0);
    }

    function completeGame() {
      finished = true;
      running = false;
      phase = 'over';
      completed = true;
      keys.clear();
      endBanner.hidden = false;
      gameFrame.classList.add('is-finished');
      playMelody();
      overlayTitle.textContent = text().finishTitle;
      overlayMessage.textContent = text().finishMessage;
      playButton.textContent = text().restart;
      gameStatus.textContent = text().finishTitle;
      dialogueState = { kind: 'finish' };
      npcName.textContent = '';
      npcDialogue.textContent = text().finishMessage;
    }

    function loseGame() {
      over = true;
      running = false;
      phase = 'over';
      keys.clear();
      items = [];
      overlayTitle.textContent = text().loseTitle;
      overlayMessage.textContent = text().loseDetail(roses);
      playButton.textContent = text().retry;
      overlay.classList.remove('is-hidden');
      gameStatus.textContent = text().loseTitle;
    }

    function finishRun() {
      running = false;
      if (roses >= GOAL_ROSES && hearts >= 1) completeGame();
      else loseGame();
    }

    function scheduleHintRestore() {
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => {
        if (running && phase === 'play') {
          dialogueState = { kind: 'hint' };
          renderDialogue();
        }
      }, 2400);
    }

    function spawnItem() {
      const isThorn = Math.random() < ROUND_THORN[round];
      let x = 0;
      let z = 0;
      for (let attempt = 0; attempt < 8; attempt++) {
        x = -12 + Math.random() * 24;
        z = -15 + Math.random() * 16;
        const farPlayer = Math.hypot(x - player.x, z - player.z) > 3;
        const farItems = items.every((item) => Math.hypot(item.x - x, item.z - z) > 1.8);
        if ((farPlayer && farItems) || attempt === 7) break;
      }
      const item = { thorn: isThorn, x, z, age: 0, color: null };
      if (!isThorn) {
        item.color = ROSE_COLORS[roseCounter % ROSE_COLORS.length];
        roseCounter += 1;
      }
      items.push(item);
      spawnedInRound += 1;
    }

    function collectRose(index) {
      items.splice(index, 1);
      roses += 1;
      streak += 1;
      playChime(streak);
      if (streak >= 4) {
        dialogueState = { kind: 'combo', streak };
        renderDialogue();
        scheduleHintRestore();
      }
      updateHud();
    }

    function hitThorn(index) {
      items.splice(index, 1);
      hearts -= 1;
      streak = 0;
      invuln = 1.2;
      playThornTone();
      dialogueState = { kind: 'thorn' };
      renderDialogue();
      scheduleHintRestore();
      updateHud();
      if (hearts <= 0) loseGame();
    }

    function updatePlayer(delta) {
      const up = keys.has('ArrowUp') || keys.has('KeyW');
      const down = keys.has('ArrowDown') || keys.has('KeyS');
      const left = keys.has('ArrowLeft') || keys.has('KeyA');
      const right = keys.has('ArrowRight') || keys.has('KeyD');
      let inputX = (right ? 1 : 0) - (left ? 1 : 0);
      let inputZ = (down ? 1 : 0) - (up ? 1 : 0);
      const length = Math.hypot(inputX, inputZ) || 1;
      inputX /= length;
      inputZ /= length;
      player.vx += inputX * 20 * delta;
      player.vz += inputZ * 20 * delta;
      const drag = Math.pow(0.002, delta);
      if (!inputX) player.vx *= drag;
      if (!inputZ) player.vz *= drag;
      const speed = Math.hypot(player.vx, player.vz);
      if (speed > 5.4) {
        player.vx = player.vx / speed * 5.4;
        player.vz = player.vz / speed * 5.4;
      }
      if (speed > 0.4) player.facing = Math.atan2(player.vx, player.vz);
      player.x += player.vx * delta;
      player.z += player.vz * delta;
      if (player.x < -BOUNDS.x) { player.x = -BOUNDS.x; player.vx = 0; }
      if (player.x > BOUNDS.x) { player.x = BOUNDS.x; player.vx = 0; }
      if (player.z < BOUNDS.zMin) { player.z = BOUNDS.zMin; player.vz = 0; }
      if (player.z > BOUNDS.zMax) { player.z = BOUNDS.zMax; player.vz = 0; }
    }

    function update(delta) {
      if (phase === 'card') {
        cardTimer -= delta;
        if (cardTimer <= 0) {
          phase = 'play';
          spawnTimer = 0.35;
          updateHud();
          npcDialogue.textContent = text().hint;
        }
        return;
      }
      if (phase !== 'play') return;
      updatePlayer(delta);
      if (invuln > 0) invuln -= delta;
      if (spawnedInRound < SPAWNS_PER_ROUND) {
        spawnTimer -= delta;
        if (spawnTimer <= 0) {
          spawnItem();
          spawnTimer = ROUND_INTERVAL[round];
        }
      }
      const life = ROUND_LIFE[round];
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.age += delta;
        if (item.age >= life) {
          items.splice(i, 1);
          if (!item.thorn) {
            streak = 0;
            updateHud();
          }
          continue;
        }
        const dist = Math.hypot(item.x - player.x, item.z - player.z);
        if (!item.thorn && dist < 1.15) {
          collectRose(i);
          if (!running) return;
        } else if (item.thorn && dist < 1.0 && invuln <= 0) {
          hitThorn(i);
          if (!running) return;
        }
      }
      if (spawnedInRound >= SPAWNS_PER_ROUND && items.length === 0) {
        if (round < 2) startRound(round + 1);
        else finishRun();
      }
    }

    function drawThorn(item) {
      renderer.draw('sphere', [item.x, 0.32, item.z], [0.85, 0.7, 0.85], '#39413c');
      renderer.draw('cube', [item.x, 0.78, item.z], [0.07, 0.55, 0.07], '#5a4632');
      renderer.draw('cube', [item.x, 0.88, item.z], [0.36, 0.07, 0.07], '#5a4632');
    }

    function render(time) {
      const playerObj = {
        x: player.x, y: 0, z: player.z,
        vx: player.vx, vz: player.vz, vy: 0, facing: player.facing,
      };
      renderer.beginScene(playerObj, time, Math.PI);
      renderer.draw('cube', [0, -0.5, -7], [80, 1, 80], theme.ground);
      renderer.draw('cube', [-13.5, 0.45, -7], [1, 0.9, 19], theme.wall);
      renderer.draw('cube', [13.5, 0.45, -7], [1, 0.9, 19], theme.wall);
      renderer.draw('cube', [0, 0.45, 2.5], [28, 0.9, 1], theme.wall);
      renderer.draw('cube', [0, 0.45, -16.5], [28, 0.9, 1], theme.wall);
      renderer.drawShrine(GOAL, theme, time, completed);
      (theme.trees || []).forEach(([x, z, size]) => renderer.drawTree(x, 0, z, size || 0.9));
      const life = ROUND_LIFE[round];
      for (const item of items) {
        if (item.thorn) {
          drawThorn(item);
        } else {
          const remaining = life - item.age;
          if (remaining > 1 || Math.floor(time / 120) % 2 === 0) {
            renderer.drawCollectible({ x: item.x, z: item.z, type: 'rose', color: item.color, taken: false }, time);
          }
        }
      }
      renderer.drawFigure({ ...jacinta, singing: completed }, time);
      renderer.drawFigure({ ...francisco, singing: completed }, time);
      const blinkOff = invuln > 0 && Math.floor(time / 90) % 2 === 0;
      if (!blinkOff) {
        lucia.x = player.x;
        lucia.z = player.z;
        renderer.drawFigure({ ...lucia, singing: completed }, time);
      }
      if (completed) renderer.drawEndingFx(theme, GOAL, time);
    }

    function frame(time) {
      const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
      lastTime = time;
      if (running) update(delta);
      render(time);
      window.requestAnimationFrame(frame);
    }

    function keyDown(event) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      if (event.code === 'KeyR') {
        resetGame();
        startGame();
        return;
      }
      keys.add(event.code);
      if (event.code === 'Enter' && !running && phase === 'idle') startGame();
    }

    function keyUp(event) { keys.delete(event.code); }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
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
