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
      startMessage: 'Encuentra la salida del laberinto con Felipe. Comparte pan, ofrece una Biblia y una oración, y deja que cada niño o niña decida si quiere acompañarte.',
      start: 'Comenzar',
      finishTitle: '¡La alegría se comparte!',
      finishMessage: 'Los niños y las niñas llegaron por su propia voluntad. Ahora cantan juntos en el Oratorio.',
      audioUnavailable: 'El canto sigue en el Oratorio, aunque este dispositivo no pudo reproducir la melodía.',
      restart: 'Volver a jugar',
      breadAction: 'Compartir pan',
      bibleAction: 'Ofrecer una Biblia y rezar',
      approach: 'Acércate para conversar.',
      allJoined: 'Todos llegaron. Sigue caminando hasta el Oratorio.',
      breadShared: (name) => `Felipe comparte el pan con ${name}.`,
      bibleOffered: (name) => `Felipe ofrece una Biblia y le invita a rezar, sin obligarle.`,
      joined: (name) => `${name}: «Gracias por compartir conmigo. Sí, quiero ir al Oratorio contigo».`,
      status: (count) => `Niños y niñas que eligieron acompañar a Felipe: ${count} de 3`,
      children: [
        { name: 'Tomás', greeting: 'Tengo hambre y hace rato que no como.', response: 'Gracias, Felipe. Me gustaría conocer el Oratorio.', color: '#5891a6', hair: '#514035', gender: 'boy' },
        { name: 'Lucía', greeting: '¿Puedo aprender una oración contigo?', response: 'Sí, quiero ir con ustedes y aprender a rezar.', color: '#be8554', hair: '#393238', gender: 'girl', dress: '#c76f75' },
        { name: 'Rosa', greeting: 'Me gusta cantar, pero no conozco el camino.', response: '¡Sí! Me encantaría cantar con los demás.', color: '#8e719d', hair: '#593e36', gender: 'girl', dress: '#9472a2' },
      ],
      actionHint: 'Pulsa E o el botón para acercarte y ayudar.',
      helpFirst: (name) => `Comparte pan con ${name}.`,
    },
    en: {
      startTitle: 'A walk to the Oratory',
      startMessage: 'Find your way through the maze with Philip. Share bread, offer a Bible and a prayer, and let each child decide whether to join you.',
      start: 'Begin',
      finishTitle: 'Joy is meant to be shared!',
      finishMessage: 'The children came by their own choice. Now everyone is singing together at the Oratory.',
      audioUnavailable: 'The choir is still singing at the Oratory, but this device could not play the melody.',
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
        { name: 'Thomas', greeting: "I'm hungry; I haven't eaten in a while.", response: "Thank you, Philip. I'd like to see the Oratory.", color: '#5891a6', hair: '#514035', gender: 'boy' },
        { name: 'Lucia', greeting: 'Could you teach me a prayer?', response: 'Yes, I would like to come and learn to pray.', color: '#be8554', hair: '#393238', gender: 'girl', dress: '#c76f75' },
        { name: 'Rosa', greeting: "I like to sing, but I don't know the way.", response: "Yes! I'd love to sing with everyone.", color: '#8e719d', hair: '#593e36', gender: 'girl', dress: '#9472a2' },
      ],
      actionHint: 'Press E or the button to greet and help.',
      helpFirst: (name) => `Share bread with ${name}.`,
    },
  };

  const maze = {
    columns: 7,
    rows: 8,
    cells: new Set([
      '3,0', '3,1', '3,2', '2,2', '1,2',
      '1,3', '2,3', '3,3', '4,3', '5,3',
      '5,4', '5,5', '4,5', '3,5', '2,5',
      '2,6', '3,6', '4,6', '5,6', '5,7',
      '4,1', '5,1', '5,2',
      '1,4', '1,5',
    ]),
  };
  const startingChildren = [
    { x: -8, z: -8 },
    { x: 8, z: -12 },
    { x: -4, z: -20 },
  ];
  const oratory = { x: 8, z: -28 };
  const player = { x: 0, z: 0, y: 0, vy: 0, vx: 0, vz: 0, grounded: true, facing: Math.PI };
  const keys = new Set();
  let children = [];
  let running = false;
  let finished = false;
  let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
  let lastTime = 0;
  let toastTimer;
  let audioContext = null;
  let choirCloseTimer;
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

  function prepareAudio() {
    if (audioContext || !window.AudioContext) return;
    try {
      audioContext = new window.AudioContext();
      audioContext.resume().catch((error) => {
        console.error('No se pudo iniciar el audio del Oratorio.', error);
        showToast(text().audioUnavailable);
      });
    } catch (error) {
      console.error('No se pudo preparar el audio del Oratorio.', error);
    }
  }

  function playOriginalChoir() {
    if (!audioContext) {
      showToast(text().audioUnavailable);
      return;
    }
    const melody = [
      [60, 0.32], [64, 0.32], [67, 0.56], [72, 0.32], [71, 0.32], [69, 0.56],
      [67, 0.32], [69, 0.32], [71, 0.56], [72, 0.32], [76, 0.32], [74, 0.56],
      [72, 0.32], [71, 0.32], [69, 0.56], [67, 0.32], [69, 0.32], [72, 0.56],
      [71, 0.32], [69, 0.32], [67, 0.8],
    ];
    const context = audioContext;
    const startAt = context.currentTime + 0.12;
    let offset = 0;

    melody.forEach(([midi, duration]) => {
      const start = startAt + offset;
      const end = start + duration * 0.92;
      for (const [pitch, volume, type] of [[midi, 0.055, 'triangle'], [midi - 5, 0.022, 'sine']]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = type;
        oscillator.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.06);
        gain.gain.setValueAtTime(volume, Math.max(start + 0.06, end - 0.08));
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(end + 0.03);
      }
      offset += duration;
    });

    clearTimeout(choirCloseTimer);
    choirCloseTimer = setTimeout(() => {
      if (audioContext === context) {
        context.close().catch((error) => console.error('No se pudo cerrar el audio del Oratorio.', error));
        audioContext = null;
      }
    }, (offset + 1) * 1000);
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
    player.facing = Math.PI;
    children = startingChildren.map((position, index) => ({
      ...position,
      index,
      y: 0,
      step: 0,
      joined: false,
      singing: false,
      gender: strings.es.children[index].gender,
      dress: strings.es.children[index].dress,
      hair: strings.es.children[index].hair,
      color: strings.es.children[index].color,
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
    prepareAudio();
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
    playOriginalChoir();
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
    if (children.every((child) => child.joined) &&
      Math.hypot(player.x - oratory.x, player.z - oratory.z) < 2.2) {
      completeGame();
    }
  }

  function frame(time) {
    const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
    lastTime = time;
    update(delta);
    renderer.renderFelipeNeri(player, children, time, finished, maze);
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
