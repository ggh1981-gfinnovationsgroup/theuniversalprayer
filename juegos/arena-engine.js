// Motor de arena para San Judas Tadeo: defiende la esperanza.
// Las sombras de la desesperanza avanzan hacia la iglesia del pueblo y el
// jugador, caminando con san Judas, las convierte con pulsos de luz.
// Cada juego define su configuración (tema, figura, melodía y textos en
// dos idiomas) y llama a window.ArenaGame(config).
(() => {
  'use strict';

  const DOOR = { x: 0, z: -28.4 };
  const GOAL = { x: 0, z: -30 };
  const TOTAL = 12;
  const HOPE_START = 5;
  const MAX_SHADOWS = 7;
  const PALETTE = ['#c96a4a', '#5a7fb0', '#7a9a5b', '#b0623f', '#8a5a7a'];
  const SHADOW_FIGURE = { robe: '#3c4148', skin: '#9aa0a8', hair: '#23262b' };

  window.ArenaGame = function ArenaGame(config) {
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

    const theme = config.theme;
    const strings = config.strings;
    const player = { x: 0, z: -8, y: 0, vx: 0, vz: 0, vy: 0, facing: Math.PI };
    const playerFigure = { ...config.playerFigure, x: player.x, z: player.z, y: 0, index: 99 };
    const keys = new Set();
    let figures = [];
    let spawnCounter = 0;
    let hope = HOPE_START;
    let conversions = 0;
    let spawnInterval = 2.6;
    let spawnTimer = 0.8;
    let pulseTime = 0;
    let pulseCooldown = 0;
    let running = false;
    let finished = false;
    let over = false;
    let completed = false;
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let lastTime = 0;
    let toastTimer;
    let hintTimer;
    let audioContext = null;
    let melodyCloseTimer;

    function text() { return strings[language]; }

    function shadowCount() {
      return figures.filter((figure) => figure.state === 'shadow').length;
    }

    function renderHope() {
      npcName.textContent = `${text().hopeLabel} ${'♥'.repeat(Math.max(0, hope))}`;
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
      interactTouch.textContent = text().pulse;
      if (finished) {
        overlayTitle.textContent = text().finishTitle;
        overlayMessage.textContent = text().finishMessage;
        playButton.textContent = text().restart;
      } else if (over) {
        overlayTitle.textContent = text().loseTitle;
        overlayMessage.textContent = text().loseMessage;
        playButton.textContent = text().retry;
      } else if (!running) {
        overlayTitle.textContent = text().startTitle;
        overlayMessage.textContent = text().startMessage;
        playButton.textContent = text().start;
      }
      if (!finished) renderHope();
      gameStatus.textContent = text().status(conversions, TOTAL);
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

    function playPulseTone() {
      if (!audioContext) return;
      const start = audioContext.currentTime + 0.02;
      playTone(88, start, 0.16, 0.04);
      playTone(93, start + 0.08, 0.2, 0.035);
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
      player.x = 0;
      player.z = -8;
      player.y = 0;
      player.vx = 0;
      player.vz = 0;
      player.vy = 0;
      player.facing = Math.PI;
      figures = [];
      spawnCounter = 0;
      hope = HOPE_START;
      conversions = 0;
      spawnInterval = 2.6;
      spawnTimer = 0.8;
      pulseTime = 0;
      pulseCooldown = 0;
      running = false;
      finished = false;
      over = false;
      completed = false;
      keys.clear();
      progressCount.textContent = '0';
      gameStatus.textContent = text().status(0, TOTAL);
      interactButton.hidden = true;
      interactTouch.hidden = false;
      interactTouch.textContent = text().pulse;
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      renderHope();
      npcDialogue.textContent = text().hint;
      overlayTitle.textContent = text().startTitle;
      overlayMessage.textContent = text().startMessage;
      playButton.textContent = text().start;
      overlay.classList.remove('is-hidden');
    }

    function startGame() {
      if (finished || over) resetGame();
      prepareAudio();
      running = true;
      overlay.classList.add('is-hidden');
      canvas.focus({ preventScroll: true });
    }

    function completeGame() {
      finished = true;
      running = false;
      completed = true;
      keys.clear();
      figures.forEach((figure) => { figure.figure.singing = true; });
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

    function loseGame() {
      over = true;
      running = false;
      keys.clear();
      overlayTitle.textContent = text().loseTitle;
      overlayMessage.textContent = text().loseMessage;
      playButton.textContent = text().retry;
      overlay.classList.remove('is-hidden');
      gameStatus.textContent = text().loseTitle;
    }

    function spawnShadow() {
      const edge = Math.floor(Math.random() * 3);
      let x;
      let z;
      if (edge === 0) {
        x = -14 + Math.random() * 28;
        z = 1.5;
      } else if (edge === 1) {
        x = 15.5;
        z = -28 + Math.random() * 28;
      } else {
        x = -15.5;
        z = -28 + Math.random() * 28;
      }
      const index = spawnCounter;
      spawnCounter += 1;
      figures.push({
        x,
        z,
        state: 'shadow',
        index,
        figure: { ...SHADOW_FIGURE, x, z, y: 0, index, singing: false },
      });
    }

    function pulse() {
      if (!running || finished || over || pulseCooldown > 0) return;
      pulseCooldown = 1.1;
      pulseTime = 0.35;
      playPulseTone();
      figures.forEach((figure) => {
        if (figure.state !== 'shadow') return;
        if (Math.hypot(figure.x - player.x, figure.z - player.z) <= 4.6) {
          figure.state = 'converted';
          figure.figure.robe = PALETTE[figure.index % PALETTE.length];
          figure.figure.singing = true;
        }
      });
    }

    function updateFigures(delta) {
      for (let i = figures.length - 1; i >= 0; i--) {
        const figure = figures[i];
        const dx = DOOR.x - figure.x;
        const dz = DOOR.z - figure.z;
        const dist = Math.hypot(dx, dz) || 1;
        if (figure.state === 'shadow') {
          if (dist < 1.7) {
            figures.splice(i, 1);
            hope -= 1;
            renderHope();
            showToast(text().shadowReached);
            if (hope <= 0) {
              loseGame();
              return;
            }
            continue;
          }
          const speed = Math.min(1.9, 1.15 + conversions * 0.02);
          figure.x += dx / dist * speed * delta;
          figure.z += dz / dist * speed * delta;
        } else {
          if (dist < 1.1) {
            figures.splice(i, 1);
            conversions += 1;
            spawnInterval = Math.max(1.5, 2.6 - conversions * 0.05);
            progressCount.textContent = String(conversions);
            gameStatus.textContent = text().status(conversions, TOTAL);
            playChime();
            npcDialogue.textContent = text().converted(conversions);
            clearTimeout(hintTimer);
            hintTimer = setTimeout(() => {
              if (running && !finished) npcDialogue.textContent = text().hint;
            }, 2600);
            if (conversions >= TOTAL) {
              completeGame();
              return;
            }
            continue;
          }
          figure.x += dx / dist * 2.2 * delta;
          figure.z += dz / dist * 2.2 * delta;
        }
        figure.figure.x = figure.x;
        figure.figure.z = figure.z;
      }
    }

    function update(delta) {
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
      if (player.x < -15.5) { player.x = -15.5; player.vx = 0; }
      if (player.x > 15.5) { player.x = 15.5; player.vx = 0; }
      if (player.z < -31) { player.z = -31; player.vz = 0; }
      if (player.z > 1.5) { player.z = 1.5; player.vz = 0; }

      if (pulseCooldown > 0) pulseCooldown -= delta;
      if (pulseTime > 0) pulseTime -= delta;

      spawnTimer -= delta;
      if (spawnTimer <= 0) {
        if (shadowCount() < MAX_SHADOWS) {
          spawnShadow();
          spawnTimer = spawnInterval;
        } else {
          spawnTimer = 0.4;
        }
      }
      updateFigures(delta);
    }

    function render(time) {
      const playerObj = {
        x: player.x, y: 0, z: player.z,
        vx: player.vx, vz: player.vz, vy: 0, facing: player.facing,
      };
      renderer.beginScene(playerObj, time, Math.PI);
      renderer.draw('cube', [0, -0.5, -14], [70, 1, 70], theme.ground);
      renderer.draw('cube', [-17, 0.45, -15], [1, 0.9, 36], theme.wall);
      renderer.draw('cube', [17, 0.45, -15], [1, 0.9, 36], theme.wall);
      renderer.draw('cube', [0, 0.45, 3], [35, 0.9, 1], theme.wall);
      renderer.drawShrine(GOAL, theme, time, completed);
      renderer.drawTree(-14.5, 0, -29, 1);
      renderer.drawTree(14.5, 0, -29, 1);
      renderer.drawTree(-14.5, 0, 0, 0.9);
      renderer.drawTree(14.5, 0, 0, 0.9);
      if (pulseTime > 0) {
        const radius = Math.max(0.2, 4.6 * (1 - pulseTime / 0.35));
        renderer.draw('cylinder', [player.x, 0.06, player.z], [radius * 2, 0.07, radius * 2], '#ffd23c', [0, 0, 0], 0.8);
      }
      for (const figure of figures) renderer.drawFigure(figure.figure, time);
      playerFigure.x = player.x;
      playerFigure.z = player.z;
      renderer.drawFigure(playerFigure, time);
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
      if (event.code === 'KeyE' || event.code === 'Space') {
        pulse();
        return;
      }
      keys.add(event.code);
      if (event.code === 'Enter' && !running) startGame();
    }

    function keyUp(event) { keys.delete(event.code); }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
    interactTouch.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      pulse();
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
