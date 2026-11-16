// Motor de ritmo para el Inmaculado Corazón de María: el rosario de Fátima.
// Cada cuenta que cruza la pista es una Ave María; si el jugador la pulsa
// justo cuando cruza el aro dorado, la cuenta se vuelve una rosa para el
// Corazón de María. Cada juego define su configuración (tema, figura,
// melodía y textos en dos idiomas) y llama a window.RhythmGame(config).
(() => {
  'use strict';

  const TOTAL = 15;
  const WIN_ROSES = 10;
  const GOAL = { x: 0, z: -6 };
  const CAMERA = { x: 0, y: 0, z: 7, vx: 0, vz: 0, vy: 0, facing: Math.PI };

  window.RhythmGame = function RhythmGame(config) {
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
    const track = document.querySelector('.rhythm-track');
    const ring = track ? track.querySelector('.rhythm-ring') : null;
    if (!track || !ring) {
      throw new Error('No se encontró la pista del rosario.');
    }

    const theme = config.theme;
    const strings = config.strings;
    const lucia = { ...config.playerFigure, x: 2.6, z: -2, y: 0, index: 1 };
    const jacinta = {
      x: -2.6, z: -2, y: 0, size: 'child',
      robe: '#c76f75', dress: '#c76f75', skin: '#eec39a', hair: '#4a3423', index: 2,
    };
    const francisco = {
      x: -3.6, z: -1.2, y: 0, size: 'child',
      robe: '#5891a6', skin: '#d9a77f', hair: '#3a2a1c', index: 3,
    };
    let beads = [];
    let spawned = 0;
    let resolved = 0;
    let roses = 0;
    let misses = 0;
    let spawnTimer = 0.8;
    let running = false;
    let finished = false;
    let over = false;
    let completed = false;
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let lastTime = 0;
    let toastTimer;
    let hintTimer;
    let endTimer;
    let audioContext = null;
    let melodyCloseTimer;

    function text() { return strings[language]; }

    function updateHud() {
      progressCount.textContent = String(roses);
      npcName.textContent = text().rosesLabel(roses);
      gameStatus.textContent = text().status(roses, TOTAL);
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
      interactTouch.textContent = text().tap;
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
      if (!finished) updateHud();
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

    function playPerfectChime() {
      if (!audioContext) return;
      const start = audioContext.currentTime + 0.03;
      playTone(79, start, 0.2, 0.05);
      playTone(86, start + 0.11, 0.24, 0.05);
      playTone(91, start + 0.22, 0.36, 0.05);
    }

    function playMissTone() {
      if (!audioContext) return;
      playTone(55, audioContext.currentTime + 0.03, 0.3, 0.06);
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

    function clearBeads() {
      beads.forEach((bead) => bead.el.remove());
      beads = [];
      track.querySelectorAll('.rhythm-bead').forEach((el) => el.remove());
    }

    function resetGame() {
      clearTimeout(endTimer);
      clearBeads();
      spawned = 0;
      resolved = 0;
      roses = 0;
      misses = 0;
      spawnTimer = 0.8;
      running = false;
      finished = false;
      over = false;
      completed = false;
      interactButton.hidden = true;
      interactTouch.hidden = false;
      interactTouch.textContent = text().tap;
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      updateHud();
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
      completed = true;
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
      overlayTitle.textContent = text().loseTitle;
      overlayMessage.textContent = text().loseDetail(roses);
      playButton.textContent = text().retry;
      overlay.classList.remove('is-hidden');
      gameStatus.textContent = text().loseTitle;
    }

    function finishRun() {
      clearBeads();
      if (roses >= WIN_ROSES) completeGame();
      else loseGame();
    }

    function checkEnd() {
      if (resolved < TOTAL || finished || over) return;
      running = false;
      clearTimeout(endTimer);
      endTimer = setTimeout(finishRun, 450);
    }

    function scheduleHintRestore() {
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => {
        if (running && !finished && !over) npcDialogue.textContent = text().hint;
      }, 2400);
    }

    function ringCenter() {
      return ring.offsetLeft + 27;
    }

    function spawnBead() {
      const width = track.clientWidth || 600;
      const el = document.createElement('div');
      el.className = 'rhythm-bead';
      el.textContent = '✿';
      track.appendChild(el);
      const bead = { el, cx: width + 22, speed: width / 3.4 };
      el.style.transform = `translateX(${bead.cx - 22}px)`;
      beads.push(bead);
      spawned += 1;
    }

    function missBead(bead) {
      misses += 1;
      resolved += 1;
      bead.el.classList.add('is-missed');
      bead.el.style.transform = `translateX(${bead.cx - 22}px) translateY(30px)`;
      bead.el.style.opacity = '0';
      setTimeout(() => bead.el.remove(), 400);
      playMissTone();
      npcDialogue.textContent = text().missed;
      scheduleHintRestore();
      updateHud();
      checkEnd();
    }

    function press() {
      if (!running || finished || over) return;
      const center = ringCenter();
      let best = null;
      let bestDx = Infinity;
      for (const bead of beads) {
        const dx = Math.abs(bead.cx - center);
        if (dx < bestDx) {
          bestDx = dx;
          best = bead;
        }
      }
      if (!best || bestDx > 54) {
        ring.classList.remove('is-shake');
        void ring.offsetWidth;
        ring.classList.add('is-shake');
        setTimeout(() => ring.classList.remove('is-shake'), 350);
        return;
      }
      beads.splice(beads.indexOf(best), 1);
      resolved += 1;
      roses += 1;
      if (bestDx <= 26) {
        best.el.classList.add('is-perfect', 'is-pop');
        playPerfectChime();
        npcDialogue.textContent = text().perfect;
      } else {
        best.el.classList.add('is-pop');
        playChime();
        npcDialogue.textContent = text().good;
      }
      setTimeout(() => best.el.remove(), 150);
      scheduleHintRestore();
      updateHud();
      checkEnd();
    }

    function update(delta) {
      if (spawned < TOTAL) {
        spawnTimer -= delta;
        if (spawnTimer <= 0) {
          spawnBead();
          spawnTimer = 1.25;
        }
      }
      const center = ringCenter();
      for (let i = beads.length - 1; i >= 0; i--) {
        const bead = beads[i];
        bead.cx -= bead.speed * delta;
        bead.el.style.transform = `translateX(${bead.cx - 22}px)`;
        if (bead.cx < center - 54) {
          beads.splice(i, 1);
          missBead(bead);
        }
      }
    }

    function render(time) {
      renderer.beginScene({ ...CAMERA }, time, Math.PI);
      renderer.draw('cube', [0, -0.5, -14], [80, 1, 80], theme.ground);
      renderer.drawShrine(GOAL, theme, time, completed);
      (theme.trees || []).forEach(([x, z, size]) => renderer.drawTree(x, 0, z, size || 0.9));
      renderer.drawFigure({ ...jacinta, singing: completed }, time);
      renderer.drawFigure({ ...francisco, singing: completed }, time);
      renderer.drawFigure({ ...lucia, singing: completed }, time);
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
      if (event.code === 'Space') {
        press();
        return;
      }
      if (event.code === 'Enter' && !running) startGame();
    }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
    interactTouch.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      press();
    });
    track.addEventListener('pointerdown', () => press());
    languageToggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
    window.addEventListener('keydown', keyDown);
    window.addEventListener('resize', () => renderer.resize());

    resetGame();
    setLanguage(language);
    renderer.resize();
    window.requestAnimationFrame(frame);
  };
})();
