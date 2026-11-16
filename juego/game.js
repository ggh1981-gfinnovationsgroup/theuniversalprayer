(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  if (!canvas || typeof window.Game3DRenderer !== 'function') {
    throw new Error('No se pudo iniciar el motor 3D del juego.');
  }
  const renderer = new window.Game3DRenderer(canvas);
  const overlay = document.getElementById('gameOverlay');
  const playButton = document.getElementById('playButton');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayMessage = document.getElementById('overlayMessage');
  const starCount = document.getElementById('starCount');
  const gameStatus = document.getElementById('gameStatus');
  const toast = document.getElementById('toast');
  const languageToggle = document.getElementById('languageToggle');
  const jumpButton = document.getElementById('jumpButton');

  const strings = {
    es: {
      title: 'Camino de la esperanza',
      intro: 'Acompaña al peregrino, reúne las 5 luces de esperanza y llega a la capilla.',
      play: 'Jugar',
      restart: 'Jugar otra vez',
      winTitle: '¡Lo lograste!',
      winMessage: 'Reuniste las luces del camino y llegaste a la capilla. ¡Sigue caminando con esperanza!',
      collected: '¡Luz de esperanza conseguida!',
      fall: '¡Ups! Vuelve a intentarlo.',
      needStars: 'Aún faltan luces. Sigue el camino hasta reunirlas todas.',
      allStars: 'Ya reuniste todas las luces. Sigue el sendero hasta la capilla.',
      status: (count) => `Luces de esperanza: ${count} de 5`,
    },
    en: {
      title: 'Path of Hope',
      intro: 'Join the pilgrim, gather all 5 lights of hope and reach the chapel.',
      play: 'Play',
      restart: 'Play again',
      winTitle: 'You made it!',
      winMessage: 'You gathered the lights along the path and reached the chapel. Keep walking in hope!',
      collected: 'Light of hope collected!',
      fall: 'Oops! Give it another try.',
      needStars: 'There are more lights to find. Keep following the path.',
      allStars: 'You gathered every light. Follow the path to the chapel.',
      status: (count) => `Lights of hope: ${count} of 5`,
    },
  };

  const platforms = [
    { x: 0, z: 0, w: 6, d: 6, h: 0, color: '#62c89d' },
    { x: 0, z: -5.7, w: 4.2, d: 4.2, h: 1.15, color: '#70d4a0' },
    { x: 3.2, z: -9.4, w: 4.2, d: 4.2, h: 2.3, color: '#8bd18a' },
    { x: 4.2, z: -13.8, w: 4.4, d: 4.2, h: 3.45, color: '#8bd18a' },
    { x: 0.8, z: -17.3, w: 4.4, d: 4.2, h: 4.6, color: '#a4ce7c' },
    { x: -3.2, z: -20.7, w: 5.4, d: 5.2, h: 5.75, color: '#b7cc72' },
  ];
  const stars = [
    { x: 0, z: -1.4, h: 1.45, collected: false },
    { x: 0, z: -5.7, h: 2.6, collected: false },
    { x: 3.2, z: -9.4, h: 3.75, collected: false },
    { x: 4.2, z: -13.8, h: 4.9, collected: false },
    { x: -3.2, z: -20.7, h: 7.15, collected: false },
  ];
  const goal = { x: -3.2, z: -20.7, h: 5.75 };
  const player = { x: 0, z: 0, y: 0, vy: 0, vx: 0, vz: 0, grounded: true, facing: 0 };
  const keys = new Set();
  let running = false;
  let won = false;
  let collected = 0;
  let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
  let lastTime = 0;
  let toastTimer;

  function currentLanguageStrings() {
    return strings[language];
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language;
    localStorage.setItem('tup_lang', language);
    document.querySelectorAll('[data-es][data-en]').forEach((element) => {
      element.innerHTML = element.dataset[language];
    });
    document.querySelectorAll('[data-aria-es][data-aria-en]').forEach((element) => {
      element.setAttribute('aria-label', element.dataset[`aria${language === 'es' ? 'Es' : 'En'}`]);
    });
    languageToggle.textContent = language === 'es' ? 'EN' : 'ES';
    languageToggle.setAttribute('aria-label', language === 'es' ? 'Switch language' : 'Cambiar idioma');
    if (!running && !won) {
      overlayTitle.textContent = currentLanguageStrings().title;
      overlayMessage.textContent = currentLanguageStrings().intro;
      playButton.textContent = currentLanguageStrings().play;
    }
    starCount.textContent = String(collected);
    gameStatus.textContent = currentLanguageStrings().status(collected);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1500);
  }

  function resetGame() {
    player.x = 0;
    player.z = 0;
    player.y = 0;
    player.vx = 0;
    player.vz = 0;
    player.vy = 0;
    player.grounded = true;
    collected = 0;
    won = false;
    stars.forEach((star) => { star.collected = false; });
    starCount.textContent = '0';
    gameStatus.textContent = currentLanguageStrings().status(collected);
    overlayTitle.textContent = currentLanguageStrings().title;
    overlayMessage.textContent = currentLanguageStrings().intro;
    playButton.textContent = currentLanguageStrings().play;
    overlay.classList.remove('is-hidden');
  }

  function startGame() {
    if (won) resetGame();
    running = true;
    overlay.classList.add('is-hidden');
    canvas.focus({ preventScroll: true });
  }

  function finishGame() {
    won = true;
    running = false;
    keys.clear();
    overlayTitle.textContent = currentLanguageStrings().winTitle;
    overlayMessage.textContent = currentLanguageStrings().winMessage;
    playButton.textContent = currentLanguageStrings().restart;
    overlay.classList.remove('is-hidden');
    gameStatus.textContent = currentLanguageStrings().winTitle;
  }

  function update(delta) {
    if (!running) return;
    const up = keys.has('ArrowUp') || keys.has('KeyW');
    const down = keys.has('ArrowDown') || keys.has('KeyS');
    const left = keys.has('ArrowLeft') || keys.has('KeyA');
    const right = keys.has('ArrowRight') || keys.has('KeyD');
    let inputX = (right ? 1 : 0) - (left ? 1 : 0);
    let inputZ = (down ? 1 : 0) - (up ? 1 : 0);
    const inputLength = Math.hypot(inputX, inputZ) || 1;
    inputX /= inputLength;
    inputZ /= inputLength;
    const acceleration = player.grounded ? 24 : 12;
    player.vx += inputX * acceleration * delta;
    player.vz += inputZ * acceleration * delta;
    const drag = Math.pow(player.grounded ? 0.001 : 0.3, delta);
    if (!inputX) player.vx *= drag;
    if (!inputZ) player.vz *= drag;
    const maxSpeed = 5.8;
    const speed = Math.hypot(player.vx, player.vz);
    if (speed > maxSpeed) {
      player.vx = player.vx / speed * maxSpeed;
      player.vz = player.vz / speed * maxSpeed;
    }
    if (inputX || inputZ) player.facing = Math.atan2(inputX, inputZ);

    const previousY = player.y;
    player.x += player.vx * delta;
    player.z += player.vz * delta;
    player.vy -= 23 * delta;
    player.y += player.vy * delta;
    player.grounded = false;

    if (player.vy <= 0) {
      for (const platform of platforms) {
        const overlaps = player.x > platform.x - platform.w / 2 - 0.18 &&
          player.x < platform.x + platform.w / 2 + 0.18 &&
          player.z > platform.z - platform.d / 2 - 0.18 &&
          player.z < platform.z + platform.d / 2 + 0.18;
        if (overlaps && previousY >= platform.h && player.y <= platform.h) {
          player.y = platform.h;
          player.vy = 0;
          player.grounded = true;
          break;
        }
      }
    }

    if (player.y < -7) {
      player.x = 0;
      player.z = 0;
      player.y = 0;
      player.vx = 0;
      player.vz = 0;
      player.vy = 0;
      player.grounded = true;
      showToast(currentLanguageStrings().fall);
    }

    for (const star of stars) {
      if (!star.collected && Math.hypot(player.x - star.x, player.z - star.z) < 0.85 && Math.abs(player.y - star.h) < 1.65) {
        star.collected = true;
        collected++;
        starCount.textContent = String(collected);
        gameStatus.textContent = currentLanguageStrings().status(collected);
        showToast(currentLanguageStrings().collected);
      }
    }

    if (Math.hypot(player.x - goal.x, player.z - goal.z) < 1.05 && player.y >= goal.h - 0.25) {
      if (collected === stars.length) finishGame();
      else if (!toast.classList.contains('is-visible')) showToast(currentLanguageStrings().needStars);
    } else if (collected === stars.length && collected > 0 && !toast.classList.contains('is-visible')) {
      showToast(currentLanguageStrings().allStars);
    }
  }

  function frame(time) {
    const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
    lastTime = time;
    update(delta);
    renderer.render(player, platforms, stars, goal, time, collected);
    window.requestAnimationFrame(frame);
  }

  function keyDown(event) {
    const key = event.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(key)) event.preventDefault();
    if (key === 'KeyR') {
      resetGame();
      running = true;
      overlay.classList.add('is-hidden');
      return;
    }
    if (key === 'Space' && running && player.grounded) {
      player.vy = 10.2;
      player.grounded = false;
    }
    keys.add(key);
    if (key === 'Enter' && !running) startGame();
  }

  function keyUp(event) {
    keys.delete(event.code);
  }

  playButton.addEventListener('click', startGame);
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

  jumpButton.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if (running && player.grounded) {
      player.vy = 10.2;
      player.grounded = false;
    }
  });

  renderer.resize();
  setLanguage(language);
  window.requestAnimationFrame(frame);
})();
