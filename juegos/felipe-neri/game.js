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
  const childrenCount = document.getElementById('childrenCount');
  const childName = document.getElementById('childName');
  const childDialogue = document.getElementById('childDialogue');
  const interactButton = document.getElementById('interactButton');
  const interactTouch = document.getElementById('interactTouch');
  const choirBanner = document.getElementById('choirBanner');
  const gameStatus = document.getElementById('gameStatus');
  const toast = document.getElementById('toast');
  const languageToggle = document.getElementById('languageToggle');

  const strings = {
    es: {
      startTitle: 'Un camino hacia el Oratorio',
      startMessage: 'Camina con Felipe. Comparte pan, ofrece una Biblia y una oración, y deja que cada niño decida si quiere acompañarte.',
      start: 'Comenzar',
      finishTitle: '¡La alegría se comparte!',
      finishMessage: 'Los niños llegaron por su propia voluntad. Ahora todos cantan juntos en el Oratorio.',
      restart: 'Volver a jugar',
      breadAction: 'Compartir pan',
      bibleAction: 'Ofrecer una Biblia y rezar',
      approach: 'Acércate para conversar.',
      allJoined: 'Todos llegaron. Sigue caminando hasta el Oratorio.',
      breadShared: (name) => `Felipe comparte el pan con ${name}.`,
      bibleOffered: (name) => `Felipe ofrece una Biblia y le invita a rezar, sin obligarle.`,
      joined: (name) => `${name}: «Gracias por compartir conmigo. Sí, quiero ir al Oratorio contigo».`,
      status: (count) => `Niños que eligieron acompañar a Felipe: ${count} de 3`,
      children: [
        { name: 'Tomás', greeting: 'Tengo hambre y hace rato que no como.', response: 'Gracias, Felipe. Me gustaría conocer el Oratorio.', color: '#5891a6', hair: '#514035' },
        { name: 'Luca', greeting: '¿Puedo aprender una oración contigo?', response: 'Sí, quiero ir con ustedes y aprender a rezar.', color: '#be8554', hair: '#393238' },
        { name: 'Rosa', greeting: 'Me gusta cantar, pero no conozco el camino.', response: '¡Sí! Me encantaría cantar con los demás.', color: '#8e719d', hair: '#593e36' },
      ],
      actionHint: 'Pulsa E o el botón para acercarte y ayudar.',
      helpFirst: (name) => `Comparte pan con ${name}.`,
    },
    en: {
      startTitle: 'A walk to the Oratory',
      startMessage: 'Walk with Philip. Share bread, offer a Bible and a prayer, and let each child decide whether to join you.',
      start: 'Begin',
      finishTitle: 'Joy is meant to be shared!',
      finishMessage: 'The children came by their own choice. Now everyone is singing together at the Oratory.',
      restart: 'Play again',
      breadAction: 'Share bread',
      bibleAction: 'Offer a Bible and pray',
      approach: 'Come closer to talk.',
      allJoined: 'Everyone is together. Keep walking to the Oratory.',
      breadShared: (name) => `Philip shares bread with ${name}.`,
      bibleOffered: (name) => `Philip offers a Bible and an invitation to pray, with no pressure.`,
      joined: (name) => `${name}: “Thank you for sharing with me. Yes, I would like to visit the Oratory with you.”`,
      status: (count) => `Children who chose to join Philip: ${count} of 3`,
      children: [
        { name: 'Thomas', greeting: "I'm hungry; I haven't eaten in a while.", response: "Thank you, Philip. I'd like to see the Oratory.", color: '#5891a6', hair: '#514035' },
        { name: 'Luca', greeting: 'Could you teach me a prayer?', response: 'Yes, I would like to come and learn to pray.', color: '#be8554', hair: '#393238' },
        { name: 'Rosa', greeting: "I like to sing, but I don't know the way.", response: "Yes! I'd love to sing with everyone.", color: '#8e719d', hair: '#593e36' },
      ],
      actionHint: 'Press E or the button to greet and help.',
      helpFirst: (name) => `Share bread with ${name}.`,
    },
  };

  const startingChildren = [
    { x: 1.6, z: -5.2 },
    { x: -1.6, z: -11.2 },
    { x: 1.5, z: -17.2 },
  ];
  const player = { x: 0, z: 0, y: 0, vy: 0, vx: 0, vz: 0, grounded: true, facing: 0 };
  const keys = new Set();
  let children = [];
  let running = false;
  let finished = false;
  let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
  let lastTime = 0;
  let toastTimer;
  let nearbyChild = null;
  let greetingChild = null;

  function text() { return strings[language]; }

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
    if (greetingChild) renderNearby(greetingChild);
    gameStatus.textContent = text().status(children.filter((child) => child.joined).length);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1900);
  }

  function renderNearby(child) {
    if (!child) {
      childName.textContent = '';
      childDialogue.textContent = greetingChild ? text().allJoined : text().actionHint;
      return;
    }
    const story = text().children[child.index];
    childName.textContent = story.name;
    if (child.joined) {
      childDialogue.textContent = text().joined(story.name);
      interactButton.hidden = true;
      interactTouch.hidden = true;
      return;
    }
    childDialogue.textContent = child.step === 0 ? story.greeting : text().helpFirst(story.name);
    const action = child.step === 0 ? text().breadAction : text().bibleAction;
    interactButton.textContent = action;
    interactTouch.textContent = child.step === 0 ? 'PAN' : 'BIBLIA';
    interactButton.hidden = false;
    interactTouch.hidden = false;
  }

  function updateNearby() {
    const candidate = children.find((child) => !child.joined &&
      Math.hypot(player.x - child.x, player.z - child.z) < 2.65);
    nearbyChild = candidate || null;
    if (nearbyChild) {
      greetingChild = nearbyChild;
      renderNearby(nearbyChild);
      return;
    }
    interactButton.hidden = true;
    interactTouch.hidden = true;
    if (greetingChild) {
      renderNearby(children.every((child) => child.joined) ? null : greetingChild);
    } else {
      childName.textContent = '';
      childDialogue.textContent = '';
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
    children = startingChildren.map((position, index) => ({
      ...position,
      index,
      y: 0,
      step: 0,
      joined: false,
      singing: false,
    }));
    greetingChild = null;
    nearbyChild = null;
    running = false;
    finished = false;
    keys.clear();
    childrenCount.textContent = '0';
    gameStatus.textContent = text().status(0);
    interactButton.hidden = true;
    interactTouch.hidden = true;
    choirBanner.hidden = true;
    childName.textContent = '';
    childDialogue.textContent = '';
    overlayTitle.textContent = text().startTitle;
    overlayMessage.textContent = text().startMessage;
    playButton.textContent = text().start;
    overlay.classList.remove('is-hidden');
  }

  function startGame() {
    if (finished) resetGame();
    running = true;
    overlay.classList.add('is-hidden');
    canvas.focus({ preventScroll: true });
  }

  function completeGame() {
    finished = true;
    running = false;
    keys.clear();
    children.forEach((child) => { child.singing = true; });
    choirBanner.hidden = false;
    overlayTitle.textContent = text().finishTitle;
    overlayMessage.textContent = text().finishMessage;
    playButton.textContent = text().restart;
    overlay.classList.remove('is-hidden');
    gameStatus.textContent = text().finishTitle;
  }

  function helpChild() {
    if (!running || !nearbyChild) return;
    const child = nearbyChild;
    const story = text().children[child.index];
    player.vx = 0;
    player.vz = 0;
    if (child.step === 0) {
      child.step = 1;
      childDialogue.textContent = text().breadShared(story.name);
      showToast(text().breadShared(story.name));
      renderNearby(child);
      return;
    }
    child.joined = true;
    greetingChild = child;
    nearbyChild = null;
    const joinedCount = children.filter((item) => item.joined).length;
    childrenCount.textContent = String(joinedCount);
    gameStatus.textContent = text().status(joinedCount);
    childName.textContent = story.name;
    childDialogue.textContent = text().joined(story.name);
    showToast(text().bibleOffered(story.name));
    interactButton.hidden = true;
    interactTouch.hidden = true;
  }

  function moveFollowers(delta) {
    children.forEach((child) => {
      if (!child.joined) return;
      const side = child.index % 2 === 0 ? -1 : 1;
      const targetX = player.x + side * (0.8 + Math.floor(child.index / 2) * 0.25);
      const targetZ = player.z + 1.45 + child.index * 0.58;
      const follow = 1 - Math.exp(-delta * 2.8);
      child.x += (targetX - child.x) * follow;
      child.z += (targetZ - child.z) * follow;
    });
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
    player.x += player.vx * delta;
    player.z += player.vz * delta;
    player.x = Math.max(-4.2, Math.min(4.2, player.x));
    player.z = Math.max(-27, Math.min(2, player.z));
    player.vy -= 22 * delta;
    player.y += player.vy * delta;
    if (player.y <= 0) {
      player.y = 0;
      player.vy = 0;
      player.grounded = true;
    }
    moveFollowers(delta);
    updateNearby();
    if (children.every((child) => child.joined) && player.z < -23.2 && Math.abs(player.x) < 7) {
      completeGame();
    }
  }

  function frame(time) {
    const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
    lastTime = time;
    update(delta);
    renderer.renderFelipeNeri(player, children, time, finished);
    window.requestAnimationFrame(frame);
  }

  function keyDown(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
    if (event.code === 'KeyR') {
      resetGame();
      startGame();
      return;
    }
    if ((event.code === 'KeyE' || event.code === 'Enter') && nearbyChild) {
      event.preventDefault();
      helpChild();
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
  interactButton.addEventListener('click', helpChild);
  interactTouch.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    helpChild();
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
})();
