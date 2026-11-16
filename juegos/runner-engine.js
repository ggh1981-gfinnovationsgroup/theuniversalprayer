// Motor de carrera sin fin en 3D (estilo Subway Surfers).
// La protagonista corre sola hacia adelante: el jugador cambia de
// carril, salta los obstáculos y reúne los objetos del camino.
// Cada juego define su configuración y llama a window.RunnerGame(config).
(() => {
  'use strict';

  const LANES = [-2.4, 0, 2.4];
  const TOTAL = 5;
  const FINISH_Z = -210;
  const RAYS = [
    { z: -40, x: 0, color: '#f5f0dc' },
    { z: -80, x: -2.4, color: '#d43a2f' },
    { z: -120, x: 2.4, color: '#f5f0dc' },
    { z: -160, x: -2.4, color: '#d43a2f' },
    { z: -195, x: 0, color: '#f5f0dc' },
  ];
  const OBSTACLES = [
    { type: 'puddle', z: -24, x: 0 },
    { type: 'puddle', z: -64, x: -2.4 },
    { type: 'puddle', z: -104, x: 2.4 },
    { type: 'puddle', z: -144, x: 0 },
    { type: 'puddle', z: -176, x: -2.4 },
    { type: 'block', z: -52, x: 2.4 },
    { type: 'block', z: -92, x: -2.4 },
    { type: 'block', z: -132, x: 0 },
    { type: 'block', z: -168, x: 2.4 },
    { type: 'block', z: -200, x: -2.4 },
  ];
  const SHRINE_GOAL = { x: 0, z: -212 };
  const TREES = [];
  for (let i = 0; i < 16; i++) {
    TREES.push({ x: i % 2 ? 6.5 : -6.5, z: -7 - i * 14, size: 0.85 + ((i * 29) % 40) / 100 });
  }

  window.RunnerGame = function RunnerGame(config) {
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
    const theme = config.theme;
    const player = { x: 0, z: 0, y: 0, vy: 0, grounded: true };
    let rays = [];
    let laneIndex = 1;
    let speed = 7;
    let lives = 3;
    let count = 0;
    let invulnerable = 0;
    let completed = false;
    let state = 'ready';
    let running = false;
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let lastTime = 0;
    let toastTimer;
    let hintTimer;
    let audioContext = null;
    let melodyCloseTimer;
    let swipeStart = null;

    function text() { return strings[language]; }

    function updateHearts() {
      npcName.textContent = `${text().heartsLabel} ${'♥'.repeat(Math.max(0, lives))}`;
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
      interactTouch.textContent = text().jump;
      updateHearts();
      if (state === 'ready') {
        overlayTitle.textContent = text().startTitle;
        overlayMessage.textContent = text().startMessage;
        playButton.textContent = text().start;
        npcDialogue.textContent = text().hint;
      } else if (state === 'finished') {
        const message = count === TOTAL ? text().finishMessage : text().finishMessageShort;
        overlayTitle.textContent = text().finishTitle;
        overlayMessage.textContent = message;
        playButton.textContent = text().restart;
        npcDialogue.textContent = message;
      } else if (state === 'over') {
        overlayTitle.textContent = text().gameOverTitle;
        overlayMessage.textContent = text().gameOverMessage;
        playButton.textContent = text().retry;
      }
      gameStatus.textContent = text().status(count, TOTAL);
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

    function resetGame() {
      player.x = 0;
      player.z = 0;
      player.y = 0;
      player.vy = 0;
      player.grounded = true;
      laneIndex = 1;
      speed = 7;
      lives = 3;
      count = 0;
      invulnerable = 0;
      completed = false;
      rays = RAYS.map((ray) => ({ ...ray, type: 'ray', taken: false }));
      running = false;
      state = 'ready';
      progressCount.textContent = '0';
      gameStatus.textContent = text().status(0, TOTAL);
      interactButton.hidden = true;
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      updateHearts();
      npcDialogue.textContent = text().hint;
      overlayTitle.textContent = text().startTitle;
      overlayMessage.textContent = text().startMessage;
      playButton.textContent = text().start;
      overlay.classList.remove('is-hidden');
    }

    function startGame() {
      if (state === 'finished' || state === 'over') resetGame();
      prepareAudio();
      running = true;
      state = 'running';
      overlay.classList.add('is-hidden');
      canvas.focus({ preventScroll: true });
    }

    function finishRun() {
      state = 'finished';
      running = false;
      completed = true;
      endBanner.hidden = false;
      gameFrame.classList.add('is-finished');
      playMelody();
      const message = count === TOTAL ? text().finishMessage : text().finishMessageShort;
      overlayTitle.textContent = text().finishTitle;
      overlayMessage.textContent = message;
      playButton.textContent = text().restart;
      npcDialogue.textContent = message;
      gameStatus.textContent = text().finishTitle;
    }

    function gameOver() {
      state = 'over';
      running = false;
      overlayTitle.textContent = text().gameOverTitle;
      overlayMessage.textContent = text().gameOverMessage;
      playButton.textContent = text().retry;
      overlay.classList.remove('is-hidden');
      npcDialogue.textContent = text().gameOverMessage;
      gameStatus.textContent = text().gameOverTitle;
    }

    function onHit() {
      lives -= 1;
      updateHearts();
      speed = 7;
      invulnerable = 1.3;
      showToast(text().hit);
      npcDialogue.textContent = text().hit;
      if (lives <= 0) gameOver();
    }

    function laneLeft() {
      if (running && laneIndex > 0) laneIndex -= 1;
    }

    function laneRight() {
      if (running && laneIndex < LANES.length - 1) laneIndex += 1;
    }

    function jump() {
      if (!running || !player.grounded) return;
      player.vy = 8.5;
      player.grounded = false;
    }

    function checkRays() {
      for (const ray of rays) {
        if (ray.taken) continue;
        if (Math.abs(player.z - ray.z) < 1.3 &&
          Math.abs(player.x - ray.x) < 1.15 &&
          player.y < 1.3) {
          ray.taken = true;
          count += 1;
          playChime();
          progressCount.textContent = String(count);
          gameStatus.textContent = text().status(count, TOTAL);
          const message = text().itemFound(count, TOTAL);
          npcDialogue.textContent = message;
          showToast(message);
          clearTimeout(hintTimer);
          hintTimer = setTimeout(() => {
            if (state === 'running') npcDialogue.textContent = text().hint;
          }, 2600);
        }
      }
    }

    function checkObstacles() {
      if (invulnerable > 0) return;
      for (const obstacle of OBSTACLES) {
        if (Math.abs(player.x - obstacle.x) >= 1.15) continue;
        if (Math.abs(player.z - obstacle.z) >= 1.0) continue;
        const yLimit = obstacle.type === 'puddle' ? 0.35 : 1.0;
        if (player.y < yLimit) {
          onHit();
          return;
        }
      }
    }

    function update(delta) {
      if (!running) return;
      speed = Math.min(10.5, speed + 0.12 * delta);
      player.z -= speed * delta;
      const targetX = LANES[laneIndex];
      player.x += (targetX - player.x) * (1 - Math.exp(-delta * 11));
      if (!player.grounded) {
        player.vy -= 22 * delta;
        player.y += player.vy * delta;
        if (player.y <= 0) {
          player.y = 0;
          player.vy = 0;
          player.grounded = true;
        }
      }
      if (invulnerable > 0) invulnerable -= delta;
      checkRays();
      if (state === 'running') checkObstacles();
      if (state === 'running' && player.z <= FINISH_Z) finishRun();
    }

    function drawObstacle(obstacle) {
      if (obstacle.type === 'puddle') {
        renderer.draw('cylinder', [obstacle.x, 0.04, obstacle.z], [1.9, 0.08, 1.9], '#2c3440');
      } else {
        renderer.draw('cube', [obstacle.x, 0.575, obstacle.z], [1.7, 1.15, 0.6], '#6a7078');
        renderer.draw('cube', [obstacle.x, 1.24, obstacle.z], [1.8, 0.18, 0.7], '#4c5157');
      }
    }

    function drawArch() {
      const gold = '#d7ad50';
      renderer.draw('cube', [-3.3, 1.7, FINISH_Z], [0.35, 3.4, 0.35], gold, [0, 0, 0], 0.3);
      renderer.draw('cube', [3.3, 1.7, FINISH_Z], [0.35, 3.4, 0.35], gold, [0, 0, 0], 0.3);
      renderer.draw('cube', [0, 3.5, FINISH_Z], [7.0, 0.35, 0.35], gold, [0, 0, 0], 0.3);
    }

    function drawScene(time) {
      renderer.beginScene(
        { x: player.x, y: player.y, z: player.z, vx: 0, vz: -speed, vy: player.vy, facing: Math.PI },
        time,
        Math.PI,
      );
      renderer.draw('cube', [0, -0.62, player.z - 70], [160, 1, 220], theme.ground);
      for (let i = 0; i <= 18; i++) {
        const z = -12 * i;
        if (z > player.z + 16 || z < player.z - 130) continue;
        renderer.draw('cube', [0, -0.05, z], [7.6, 0.1, 12], i % 2 ? theme.floorAlt : theme.floor);
        renderer.draw('cube', [-3.95, 0.1, z], [0.28, 0.44, 12], theme.wall);
        renderer.draw('cube', [3.95, 0.1, z], [0.28, 0.44, 12], theme.wall);
      }
      for (const tree of TREES) {
        if (tree.z > player.z + 16 || tree.z < player.z - 130) continue;
        renderer.drawTree(tree.x, 0, tree.z, tree.size);
      }
      for (const ray of rays) {
        if (!ray.taken) renderer.drawCollectible(ray, time);
      }
      for (const obstacle of OBSTACLES) {
        if (obstacle.z > player.z + 16 || obstacle.z < player.z - 130) continue;
        drawObstacle(obstacle);
      }
      drawArch();
      renderer.drawShrine(SHRINE_GOAL, theme, time, completed);
      const blinkOff = invulnerable > 0 && Math.floor(time / 90) % 2 === 0;
      if (!blinkOff) {
        renderer.drawFigure(
          { ...config.playerFigure, x: player.x, z: player.z, y: player.y, index: 99 },
          time,
        );
      }
      if (completed) renderer.drawEndingFx(theme, SHRINE_GOAL, time);
    }

    function frame(time) {
      const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
      lastTime = time;
      update(delta);
      drawScene(time);
      window.requestAnimationFrame(frame);
    }

    function keyDown(event) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      if (event.code === 'KeyR') {
        resetGame();
        startGame();
        return;
      }
      if (event.code === 'Enter' && !running) {
        startGame();
        return;
      }
      if (event.repeat) return;
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') laneLeft();
      else if (event.code === 'ArrowRight' || event.code === 'KeyD') laneRight();
      else if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') jump();
    }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
    interactTouch.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      jump();
    });
    languageToggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
    window.addEventListener('keydown', keyDown);
    window.addEventListener('resize', () => renderer.resize());

    document.querySelectorAll('[data-key]').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        const key = button.dataset.key;
        if (key === 'ArrowLeft') laneLeft();
        else if (key === 'ArrowRight') laneRight();
        else if (key === 'ArrowUp') jump();
      });
    });

    gameFrame.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) {
        swipeStart = null;
        return;
      }
      swipeStart = { x: event.clientX, y: event.clientY };
    });
    gameFrame.addEventListener('pointerup', (event) => {
      if (!swipeStart) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (!running) return;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) laneRight();
        else laneLeft();
      } else if (dy < 0) {
        jump();
      }
    });
    gameFrame.addEventListener('pointercancel', () => { swipeStart = null; });

    resetGame();
    setLanguage(language);
    renderer.resize();
    window.requestAnimationFrame(frame);
  };
})();
