// Motor de apilar con tiempo justo en 3D (estilo Stack).
// Una pieza se desliza de un lado a otro sobre la torre: el jugador
// la suelta en el momento justo y la parte que sobra se cae.
// Cada juego define su configuración y llama a window.StackGame(config).
(() => {
  'use strict';

  const TOTAL = 10;
  const BLOCK_H = 0.55;
  const BLOCK_D = 3.2;
  const BASE_TOP = 0.5;
  const TOWER_Z = 8;
  const SLIDE_LIMIT = 4.4;
  const PALETTE = ['#e8d9b0', '#dfc493', '#e5bf68', '#d9a441'];

  window.StackGame = function StackGame(config) {
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
    let level = 0;
    let candles = 3;
    let prevSpan = { center: 0, width: 3.2 };
    let blocks = [];
    let debris = [];
    let current = null;
    let cameraY = BASE_TOP;
    let completed = false;
    let state = 'ready';
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let lastTime = 0;
    let toastTimer;
    let audioContext = null;
    let melodyCloseTimer;

    function text() { return strings[language]; }

    function blockY(lvl) { return BASE_TOP + (lvl + 0.5) * BLOCK_H; }

    function towerTop() { return BASE_TOP + level * BLOCK_H; }

    function updateCandles() {
      npcName.textContent = `${text().candlesLabel} ${Math.max(0, candles)}`;
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
      interactTouch.textContent = text().drop;
      updateCandles();
      if (state === 'ready') {
        overlayTitle.textContent = text().startTitle;
        overlayMessage.textContent = text().startMessage;
        playButton.textContent = text().start;
        npcDialogue.textContent = text().hint;
      } else if (state === 'finished') {
        overlayTitle.textContent = text().finishTitle;
        overlayMessage.textContent = text().finishMessage;
        playButton.textContent = text().restart;
        npcDialogue.textContent = text().finishMessage;
      } else if (state === 'over') {
        overlayTitle.textContent = text().loseTitle;
        overlayMessage.textContent = text().loseMessage;
        playButton.textContent = text().retry;
      }
      gameStatus.textContent = text().status(level, TOTAL);
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

    function spawnCurrent() {
      const fromLeft = level % 2 === 0;
      current = {
        x: fromLeft ? -SLIDE_LIMIT : SLIDE_LIMIT,
        dir: fromLeft ? 1 : -1,
        width: prevSpan.width,
        y: blockY(level),
        color: PALETTE[level % PALETTE.length],
      };
    }

    function resetGame() {
      level = 0;
      candles = 3;
      prevSpan = { center: 0, width: 3.2 };
      blocks = [];
      debris = [];
      completed = false;
      cameraY = BASE_TOP;
      state = 'ready';
      spawnCurrent();
      progressCount.textContent = '0';
      gameStatus.textContent = text().status(0, TOTAL);
      interactButton.hidden = true;
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      updateCandles();
      npcDialogue.textContent = text().hint;
      overlayTitle.textContent = text().startTitle;
      overlayMessage.textContent = text().startMessage;
      playButton.textContent = text().start;
      overlay.classList.remove('is-hidden');
    }

    function startGame() {
      if (state === 'finished' || state === 'over') resetGame();
      prepareAudio();
      state = 'running';
      overlay.classList.add('is-hidden');
      canvas.focus({ preventScroll: true });
    }

    function winGame() {
      state = 'finished';
      completed = true;
      current = null;
      endBanner.hidden = false;
      gameFrame.classList.add('is-finished');
      playMelody();
      overlayTitle.textContent = text().finishTitle;
      overlayMessage.textContent = text().finishMessage;
      playButton.textContent = text().restart;
      npcDialogue.textContent = text().finishMessage;
      gameStatus.textContent = text().finishTitle;
    }

    function loseGame() {
      state = 'over';
      current = null;
      overlayTitle.textContent = text().loseTitle;
      overlayMessage.textContent = text().loseMessage;
      playButton.textContent = text().retry;
      overlay.classList.remove('is-hidden');
      npcDialogue.textContent = text().loseMessage;
      gameStatus.textContent = text().loseTitle;
    }

    function drop() {
      if (state !== 'running' || !current) return;
      const curLo = current.x - current.width / 2;
      const curHi = current.x + current.width / 2;
      const prevLo = prevSpan.center - prevSpan.width / 2;
      const prevHi = prevSpan.center + prevSpan.width / 2;
      const lo = Math.max(curLo, prevLo);
      const hi = Math.min(curHi, prevHi);
      const overlap = hi - lo;
      if (overlap <= 0) {
        debris.push({ center: current.x, width: current.width, y: current.y, color: current.color, age: 0 });
        current = null;
        candles -= 1;
        updateCandles();
        if (candles <= 0) {
          loseGame();
          return;
        }
        const message = text().miss(candles);
        npcDialogue.textContent = message;
        showToast(message);
        spawnCurrent();
        return;
      }
      const offset = Math.abs(current.x - prevSpan.center);
      let keptCenter = (lo + hi) / 2;
      let keptWidth = overlap;
      let perfect = false;
      if (offset < 0.09) {
        keptCenter = prevSpan.center;
        keptWidth = prevSpan.width;
        perfect = true;
      } else {
        if (curLo < lo) {
          debris.push({ center: (curLo + lo) / 2, width: lo - curLo, y: current.y, color: current.color, age: 0 });
        }
        if (curHi > hi) {
          debris.push({ center: (hi + curHi) / 2, width: curHi - hi, y: current.y, color: current.color, age: 0 });
        }
      }
      blocks.push({ center: keptCenter, width: keptWidth, y: current.y, color: current.color });
      prevSpan = { center: keptCenter, width: keptWidth };
      level += 1;
      progressCount.textContent = String(level);
      gameStatus.textContent = text().status(level, TOTAL);
      if (perfect) {
        playChime();
        showToast(text().perfect);
        npcDialogue.textContent = text().perfect;
      }
      if (level >= TOTAL) {
        winGame();
        return;
      }
      spawnCurrent();
    }

    function update(delta) {
      debris = debris.filter((piece) => {
        piece.age += delta;
        piece.y -= 6 * delta;
        return piece.age < 0.55;
      });
      const targetCameraY = towerTop();
      cameraY += (targetCameraY - cameraY) * (1 - Math.exp(-delta * 3));
      if (state !== 'running' || !current) return;
      const slideSpeed = 2.1 + level * 0.28;
      current.x += current.dir * slideSpeed * delta;
      if (current.x > SLIDE_LIMIT) {
        current.x = SLIDE_LIMIT;
        current.dir = -1;
      }
      if (current.x < -SLIDE_LIMIT) {
        current.x = -SLIDE_LIMIT;
        current.dir = 1;
      }
    }

    function drawHeart(time) {
      const cx = prevSpan.center;
      const hy = towerTop() + 1.1;
      const glow = 0.75 + Math.sin(time / 300) * 0.1;
      renderer.draw('sphere', [cx - 0.28, hy, TOWER_Z], [0.5, 0.48, 0.18], '#c62f3b', [0, 0, 0], glow);
      renderer.draw('sphere', [cx + 0.28, hy, TOWER_Z], [0.5, 0.48, 0.18], '#c62f3b', [0, 0, 0], glow);
      renderer.draw('cone', [cx, hy - 0.52, TOWER_Z], [1.0, 1.1, 0.38], '#c62f3b', [Math.PI, 0, 0], glow);
      renderer.draw('cone', [cx, hy + 0.55, TOWER_Z], [0.26, 0.5, 0.26], '#ff8a3c', [0, 0, 0], 0.6);
      renderer.draw('cube', [cx, hy + 0.92, TOWER_Z], [0.08, 0.4, 0.08], '#d7ad50');
      renderer.draw('cube', [cx, hy + 0.98, TOWER_Z], [0.28, 0.08, 0.08], '#d7ad50');
    }

    function drawScene(time) {
      renderer.beginScene(
        { x: 0, y: cameraY, z: TOWER_Z, vx: 0, vz: 0, vy: 0, facing: Math.PI },
        time,
        Math.PI,
      );
      renderer.draw('cube', [0, -0.5, TOWER_Z], [70, 1, 70], theme.ground);
      renderer.drawShrine({ x: 0, z: 6 }, theme, time, completed);
      renderer.draw('cube', [0, 0.25, TOWER_Z], [3.4, 0.5, 3.4], '#9a8a72');
      for (const block of blocks) {
        renderer.draw('cube', [block.center, block.y, TOWER_Z], [block.width, BLOCK_H, BLOCK_D], block.color);
      }
      for (const piece of debris) {
        renderer.draw('cube', [piece.center, piece.y, TOWER_Z], [piece.width, BLOCK_H, BLOCK_D], piece.color);
      }
      if (current) {
        renderer.draw('cube', [current.x, current.y, TOWER_Z], [current.width, BLOCK_H, BLOCK_D], current.color);
      }
      if (completed) {
        drawHeart(time);
        renderer.drawEndingFx(theme, { x: 0, z: 6 }, time);
      }
    }

    function frame(time) {
      const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
      lastTime = time;
      update(delta);
      drawScene(time);
      window.requestAnimationFrame(frame);
    }

    function keyDown(event) {
      if (event.code === 'Space') event.preventDefault();
      if (event.code === 'KeyR') {
        resetGame();
        startGame();
        return;
      }
      if (event.code === 'Enter' && state !== 'running') {
        startGame();
        return;
      }
      if (event.code === 'Space' && !event.repeat) drop();
    }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
    interactTouch.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      drop();
    });
    languageToggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
    window.addEventListener('keydown', keyDown);
    window.addEventListener('resize', () => renderer.resize());

    gameFrame.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      drop();
    });

    resetGame();
    setLanguage(language);
    renderer.resize();
    window.requestAnimationFrame(frame);
  };
})();
