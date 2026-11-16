// Motor del RPG «El Camino del Espíritu»: mundo 3D abierto con la
// plaza y el Cenáculo, siete regiones con guardianes y retos para los
// siete dones, nueve altares de carismas, la paloma guía, el tutorial
// de los cinco pasos para hablarle al Espíritu Santo, el Libro de
// Oración y el final de Pentecostés. Cada página define su contenido
// (window.RPG_WORLD, RPG_GIFTS, RPG_CHARISMS, RPG_PRAYERS) y llama a
// window.RpgGame(config). Los retos viven en window.RpgChallenges y se
// despachan con el contexto ctx descrito en DISENO.md.
(() => {
  'use strict';

  const SAVE_KEY = 'tup_espiritu_rpg';
  const WORLD_RADIUS = 100;
  const CULL_DIST = 70;
  const GIFT_POINTS = 100;

  const GIFT_NAMES = [
    { es: 'Sabiduría', en: 'Wisdom' },
    { es: 'Entendimiento', en: 'Understanding' },
    { es: 'Consejo', en: 'Counsel' },
    { es: 'Fortaleza', en: 'Fortitude' },
    { es: 'Ciencia', en: 'Knowledge' },
    { es: 'Piedad', en: 'Piety' },
    { es: 'Temor de Dios', en: 'Fear of the Lord' },
  ];
  const CHARISM_NAMES = [
    { es: 'Palabra de Sabiduría', en: 'Word of Wisdom' },
    { es: 'Palabra de Conocimiento', en: 'Word of Knowledge' },
    { es: 'Fe Extraordinaria', en: 'Gift of Faith' },
    { es: 'Dones de Sanación', en: 'Gifts of Healing' },
    { es: 'Obrar Milagros', en: 'Working of Miracles' },
    { es: 'Profecía', en: 'Prophecy' },
    { es: 'Discernimiento de Espíritus', en: 'Discernment of Spirits' },
    { es: 'Don de Lenguas', en: 'Gift of Tongues' },
    { es: 'Interpretación de Lenguas', en: 'Interpretation of Tongues' },
  ];
  const FRUIT_COLORS = ['#e5484d', '#f2a541', '#f7e463', '#7ab648', '#4a9d8f', '#5a7fb0', '#9a6ab0'];

  // Pasos de respaldo: solo se usan si el archivo de contenido con los
  // textos exactos de la página no está disponible.
  const FALLBACK_STEPS = [
    { title: { es: 'Adóralo', en: 'Worship Him' }, phrase: { es: 'Ven, Espíritu Santo.', en: 'Come, Holy Spirit.' } },
    { title: { es: 'Háblale de tú', en: 'Speak to Him closely' }, phrase: { es: 'Espíritu Santo, háblame.', en: 'Holy Spirit, speak to me.' } },
    { title: { es: 'Recuerda dónde vive', en: 'Remember where He lives' }, phrase: { es: 'Tú vives en mi corazón.', en: 'You live in my heart.' } },
    { title: { es: 'Déjate llevar al Padre', en: 'Let Him lead you to the Father' }, phrase: { es: 'Llévame al Padre.', en: 'Lead me to the Father.' } },
    { title: { es: 'Agradécele y pídele perdón', en: 'Thank Him and ask forgiveness' }, phrase: { es: 'Gracias, Espíritu Santo. Perdóname.', en: 'Thank you, Holy Spirit. Forgive me.' } },
  ];
  const FALLBACK_PRAYERS = {
    steps: FALLBACK_STEPS,
    moments: [],
    short: [],
    prayer: { es: 'Ven, Espíritu Santo, llena los corazones de tus fieles y enciende en ellos el fuego de tu amor.', en: 'Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.' },
    invocation: { es: 'Ven, Espíritu Santo.', en: 'Come, Holy Spirit.' },
    closing: { es: 'Ven, Espíritu Santo, y dame tus dones.', en: 'Come, Holy Spirit, and give me your gifts.' },
  };

  const OPENING_LINES = [
    {
      speaker: 'narrator',
      text: {
        es: 'El Espíritu Santo no es una fuerza ni un símbolo: es una Persona y es Dios, igual al Padre y al Hijo. Es el Paráclito, el Consolador, el Dulce huésped del alma.',
        en: 'The Holy Spirit is not a force or a symbol: He is a Person and He is God, equal to the Father and to the Son. He is the Paraclete, the Comforter, the sweet Guest of the soul.',
      },
    },
    {
      speaker: 'narrator',
      text: {
        es: 'Jesús lo prometió: «Cuando venga el Espíritu de la verdad, él os guiará hasta la verdad plena» (Jn 16,13). Hoy la Paloma te enseñará a hablarle, paso a paso.',
        en: 'Jesus promised it: "When the Spirit of truth comes, he will guide you into all the truth" (Jn 16:13). Today the Dove will teach you to speak to Him, step by step.',
      },
    },
  ];
  const FINALE_LINES = [
    {
      speaker: 'narrator',
      text: {
        es: 'Están todos reunidos en el Cenáculo, con María, cuando de repente viene del cielo un ruido como de viento impetuoso que llena toda la casa.',
        en: 'They are all gathered in the Upper Room, with Mary, when suddenly a sound comes from heaven like a mighty rushing wind, and it fills the whole house.',
      },
    },
    {
      speaker: 'narrator',
      text: {
        es: 'Y aparecen lenguas como de fuego que se posan sobre cada uno de ellos. Todos quedan llenos del Espíritu Santo (Hch 2). Su fuego también es para ti.',
        en: 'And tongues as of fire appear and rest on each one of them. All are filled with the Holy Spirit (Acts 2). His fire is for you too.',
      },
    },
  ];

  const STR = {
    es: {
      startTitle: 'El Camino del Espíritu',
      startMessage: 'El Espíritu Santo es una Persona y Dios, igual al Padre y al Hijo. Recorre las siete regiones, aprende a hablarle como le hablas a Jesús y al Padre, y recibe sus siete dones. Los altares de los carismas esconden puntos extra.',
      start: 'Comenzar',
      continueLabel: 'Continuar',
      newGame: 'Nueva partida',
      newGameConfirm: '¿Seguro? Toca otra vez para borrar la partida',
      welcomeBack: 'El Espíritu te espera. Sigue a la paloma de luz.',
      you: 'Tú',
      next: 'Seguir',
      talk: 'HABLAR',
      prayTouch: 'ORAR',
      talkWith: (name) => `Hablar con ${name}`,
      trialWith: (title) => `Prueba: ${title}`,
      stepOf: 'Paso',
      sayIt: 'Decirlo',
      stepPrompt: 'Dila en voz alta, de corazón, como le hablas a un amigo.',
      tutorialDone: 'Ya sabes hablarle. El Libro de Oración quedó desbloqueado: ábrelo con la tecla P o con el botón del libro.',
      bookLocked: 'El Libro de Oración se desbloquea al aprender los cinco pasos en el Cenáculo.',
      lockedLine: 'Antes de partir, aprende a hablarle al Espíritu en el Cenáculo. La paloma de luz te espera en la plaza.',
      blessing: 'El don ya arde en ti. Que su llama te acompañe en todo el camino.',
      reminder: 'El reto sigue en pie. La paloma marca el lugar: vuelve cuando quieras.',
      objTutorial: 'Ve al Cenáculo y aprende a hablarle',
      objGift: (gift) => `Recibe el don de ${gift}`,
      objSeek: (gift, zone) => `Busca el don de ${gift}: ${zone}`,
      objFinale: 'Vuelve al Cenáculo: Pentecostés te espera',
      objFree: 'Explora el mundo: los altares de los carismas dan puntos extra',
      giftReceived: '¡Don recibido!',
      fruitGrows: (fruit) => `En el Árbol de los Frutos crece ahora: ${fruit}.`,
      charismDone: '¡Prueba superada! Insignia ganada.',
      readBonus: '+5 puntos de gracia por rezar en este lugar santo',
      prayButton: 'Rezar',
      prayedButton: '✓ Rezada',
      bookSteps: 'Los cinco pasos para hablarle',
      bookMoments: 'Momentos del día',
      bookShort: 'Frases breves',
      bookPrayer: 'Ven, Espíritu Santo',
      bookInvocation: 'Invocación',
      bookClosing: 'Oración de cierre',
      altarPrompt: 'Rezar en el Cenáculo',
      finalePrompt: 'Vivir Pentecostés',
      treePrompt: 'Contemplar el Árbol de los Frutos',
      treeLine: (list) => (list.length
        ? `En el Árbol ya crecen estos frutos del Espíritu: ${list}. Cada don recibido hace crecer uno nuevo.`
        : 'El Árbol de los Frutos espera junto al Cenáculo: cada don que recibas hará crecer un fruto aquí.'),
      failRetry: 'No pasa nada: puedes intentarlo de nuevo cuando quieras.',
      endStats: (g, c, p) => `Dones: ${g} de 7 · Carismas: ${c} de 9 · Puntos de gracia: ${p}`,
      status: (g, c, p) => `El Camino del Espíritu. Dones ${g} de 7, carismas ${c} de 9, ${p} puntos de gracia.`,
      freeHint: 'Camina con WASD o las flechas. Acércate a las personas y a los altares para hablar.',
      audioUnavailable: 'Este dispositivo no pudo reproducir el sonido.',
      amen: 'Amén',
    },
    en: {
      startTitle: 'The Way of the Spirit',
      startMessage: 'The Holy Spirit is a Person and God, equal to the Father and to the Son. Walk the seven regions, learn to speak to Him as you speak to Jesus and to the Father, and receive His seven gifts. The charism altars hide extra points.',
      start: 'Begin',
      continueLabel: 'Continue',
      newGame: 'New game',
      newGameConfirm: 'Are you sure? Tap again to erase the saved game',
      welcomeBack: 'The Spirit is waiting for you. Follow the dove of light.',
      you: 'You',
      next: 'Continue',
      talk: 'TALK',
      prayTouch: 'PRAY',
      talkWith: (name) => `Talk with ${name}`,
      trialWith: (title) => `Trial: ${title}`,
      stepOf: 'Step',
      sayIt: 'Say it',
      stepPrompt: 'Say it out loud, from the heart, as you would speak to a friend.',
      tutorialDone: 'Now you know how to speak to Him. The Prayer Book is unlocked: open it with the P key or the book button.',
      bookLocked: 'The Prayer Book unlocks when you learn the five steps at the Upper Room.',
      lockedLine: 'Before you set out, learn to speak to the Spirit at the Upper Room. The dove of light waits for you in the plaza.',
      blessing: 'The gift already burns in you. May its flame go with you all the way.',
      reminder: 'The challenge still stands. The dove marks the place: come back whenever you wish.',
      objTutorial: 'Go to the Upper Room and learn to speak to Him',
      objGift: (gift) => `Receive the gift of ${gift}`,
      objSeek: (gift, zone) => `Seek the gift of ${gift}: ${zone}`,
      objFinale: 'Return to the Upper Room: Pentecost awaits you',
      objFree: 'Explore the world: the charism altars give extra points',
      giftReceived: 'Gift received!',
      fruitGrows: (fruit) => `On the Tree of the Fruits there now grows: ${fruit}.`,
      charismDone: 'Trial passed! Badge earned.',
      readBonus: '+5 grace points for praying in this holy place',
      prayButton: 'Pray',
      prayedButton: '✓ Prayed',
      bookSteps: 'The five steps to speak to Him',
      bookMoments: 'Moments of the day',
      bookShort: 'Short phrases',
      bookPrayer: 'Come, Holy Spirit',
      bookInvocation: 'Invocation',
      bookClosing: 'Closing prayer',
      altarPrompt: 'Pray at the Upper Room',
      finalePrompt: 'Live Pentecost',
      treePrompt: 'Behold the Tree of the Fruits',
      treeLine: (list) => (list.length
        ? `These fruits of the Spirit already grow on the Tree: ${list}. Each gift you receive grows a new one.`
        : 'The Tree of the Fruits waits by the Upper Room: each gift you receive will grow a fruit here.'),
      failRetry: 'It is all right: you can try again whenever you wish.',
      endStats: (g, c, p) => `Gifts: ${g} of 7 · Charisms: ${c} of 9 · Grace points: ${p}`,
      status: (g, c, p) => `The Way of the Spirit. Gifts ${g} of 7, charisms ${c} of 9, ${p} grace points.`,
      freeHint: 'Walk with WASD or the arrow keys. Come near people and altars to speak.',
      audioUnavailable: 'This device could not play the sound.',
      amen: 'Amen',
    },
  };

  window.RpgGame = function RpgGame(config) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas || typeof window.Game3DRenderer !== 'function') {
      throw new Error('No se pudo iniciar el motor 3D del juego.');
    }
    const renderer = new window.Game3DRenderer(canvas);
    const $ = (id) => document.getElementById(id);
    const overlay = $('gameOverlay');
    const overlayTitle = $('overlayTitle');
    const overlayMessage = $('overlayMessage');
    const playButton = $('playButton');
    const newGameButton = $('newGameButton');
    const progressCount = $('progressCount');
    const flamesHud = $('flamesHud');
    const bookButton = $('bookButton');
    const pauseButton = $('pauseButton');
    const objectiveText = $('objectiveText');
    const npcName = $('npcName');
    const npcDialogue = $('npcDialogue');
    const interactButton = $('interactButton');
    const dialogueNext = $('dialogueNext');
    const choiceBox = $('choiceBox');
    const dialogueBox = $('dialogueBox');
    const stepCard = $('stepCard');
    const stepCount = $('stepCount');
    const stepTitle = $('stepTitle');
    const stepLine = $('stepLine');
    const stepPhrase = $('stepPhrase');
    const sayItButton = $('sayItButton');
    const bannerCard = $('bannerCard');
    const bannerContent = $('bannerContent');
    const bannerClose = $('bannerClose');
    const pauseOverlay = $('pauseOverlay');
    const resumeButton = $('resumeButton');
    const restartButton = $('restartButton');
    const bookOverlay = $('bookOverlay');
    const bookContent = $('bookContent');
    const bookCloseButton = $('bookCloseButton');
    const endOverlay = $('endOverlay');
    const endStats = $('endStats');
    const endPrayButton = $('endPrayButton');
    const endExploreButton = $('endExploreButton');
    const gameStatus = $('gameStatus');
    const toast = $('toast');
    const interactTouch = $('interactTouch');
    const gameFrame = document.querySelector('.game-frame');
    // El marco tiene overflow oculto: enfocar un botón de un overlay
    // puede desplazar su contenido; se devuelve a su sitio al cerrar.
    function resetFrameScroll() {
      if (gameFrame) {
        gameFrame.scrollTop = 0;
        gameFrame.scrollLeft = 0;
      }
    }

    const world = (config && config.world) || {};
    const zones = Array.isArray(world.zones) && world.zones.length ? world.zones : [
      { id: 'plaza', cx: 0, cz: 0, r: 16, ground: '#8fae6a', path: '#d8c29a', name: { es: 'La Plaza', en: 'The Plaza' }, landmark: 'cenaculo', props: [] },
    ];
    const npcs = Array.isArray(world.npcs) ? world.npcs : [];
    const gifts = (Array.isArray(config && config.gifts) ? config.gifts : []).slice();
    const charisms = (Array.isArray(config && config.charisms) ? config.charisms : []).slice();
    const prayers = (config && config.prayers) || FALLBACK_PRAYERS;
    const steps = Array.isArray(prayers.steps) && prayers.steps.length ? prayers.steps : FALLBACK_STEPS;
    const plazaZone = zones.find((zone) => zone.id === 'plaza') || zones[0];
    const cenaculo = world.cenaculo || { x: plazaZone.cx, z: plazaZone.cz - plazaZone.r * 0.55 };
    const treePos = world.tree || { x: cenaculo.x + 8, z: cenaculo.z + 2 };
    const altarPoint = { x: cenaculo.x, z: cenaculo.z - 0.2 };

    const giftByNpc = new Map();
    gifts.forEach((quest) => { if (quest && quest.npcId) giftByNpc.set(quest.npcId, quest); });
    const npcById = new Map();
    npcs.forEach((npc) => { if (npc && npc.id) npcById.set(npc.id, npc); });
    const zoneById = new Map();
    zones.forEach((zone) => zoneById.set(zone.id, zone));

    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    function text() { return STR[language]; }
    function t(obj) {
      if (obj === null || obj === undefined) return '';
      if (typeof obj === 'string') return obj;
      return obj[language] || obj.es || obj.en || '';
    }

    function freshSave() {
      return {
        gifts: [false, false, false, false, false, false, false],
        charisms: [false, false, false, false, false, false, false, false, false],
        points: 0,
        tutorialDone: false,
        readPrayers: [],
        playerPos: null,
        finaleSeen: false,
      };
    }
    function loadSave() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const base = freshSave();
        if (Array.isArray(parsed.gifts)) parsed.gifts.slice(0, 7).forEach((v, i) => { base.gifts[i] = !!v; });
        if (Array.isArray(parsed.charisms)) parsed.charisms.slice(0, 9).forEach((v, i) => { base.charisms[i] = !!v; });
        base.points = Number.isFinite(parsed.points) ? parsed.points : 0;
        base.tutorialDone = !!parsed.tutorialDone;
        base.readPrayers = Array.isArray(parsed.readPrayers) ? parsed.readPrayers.slice() : [];
        base.playerPos = parsed.playerPos && Number.isFinite(parsed.playerPos.x) ? parsed.playerPos : null;
        base.finaleSeen = !!parsed.finaleSeen;
        return base;
      } catch (error) {
        return null;
      }
    }
    let save = loadSave() || freshSave();
    function saveGame() {
      try {
        save.playerPos = { x: Math.round(player.x * 10) / 10, z: Math.round(player.z * 10) / 10 };
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      } catch (error) { /* el guardado es opcional */ }
    }

    const player = { x: 0, z: 7, y: 0, vx: 0, vz: 0, vy: 0, facing: Math.PI };
    if (save.tutorialDone && save.playerPos) {
      player.x = save.playerPos.x;
      player.z = save.playerPos.z;
    }
    const playerFigure = { ...((config && config.playerFigure) || {}), x: player.x, z: player.z, y: 0, index: 99 };
    if (!playerFigure.robe) playerFigure.robe = '#7a5a34';

    const keys = new Set();
    let gameStarted = false;
    let overlayOpen = 'start';
    let sayQueue = null;
    let choiceActive = false;
    let stepActive = false;
    let bannerOpen = false;
    let bannerCallback = null;
    let pendingInteract = null;
    let activeQuest = null;
    let activeCharism = null;
    let activeNpcName = null;
    let challengeFrameCallbacks = [];
    let challengeResolved = true;
    let currentInteractable = null;
    let objectivePoint = { x: cenaculo.x, z: cenaculo.z };
    let objectiveOverride = null;
    let finaleActive = false;
    let newGameArmed = false;
    let lastTime = 0;
    let toastTimer;
    let posSaveTimer = 0;
    let lastSavedPos = { x: player.x, z: player.z };
    let audioContext = null;

    const isPaused = () => overlayOpen === 'book' || overlayOpen === 'pause';
    const giftsDoneCount = () => save.gifts.filter(Boolean).length;
    const charismsDoneCount = () => save.charisms.filter(Boolean).length;
    const allGiftsDone = () => giftsDoneCount() >= 7;

    // ---------- Audio: campanas y viento, como los demás motores ----------
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
      if (!audioContext) return;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
      const end = start + duration * 0.92;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.05);
      gain.gain.setValueAtTime(volume, Math.max(start + 0.05, end - 0.09));
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(end + 0.03);
    }
    function bell(n) {
      if (!audioContext) return;
      const count = Math.max(1, Math.min(6, n || 1));
      const start = audioContext.currentTime + 0.03;
      for (let i = 0; i < count; i++) {
        const at = start + i * 0.38;
        playTone(88, at, 1.05, 0.05);
        playTone(100, at, 0.7, 0.016);
      }
    }
    function chime(n) {
      if (!audioContext) return;
      const count = Math.max(1, Math.min(8, n || 1));
      const start = audioContext.currentTime + 0.03;
      for (let i = 0; i < count; i++) {
        playTone(76 + i * 3, start + i * 0.09, 0.32, 0.045);
      }
    }
    function playWind() {
      if (!audioContext) return;
      try {
        const ctx = audioContext;
        const duration = 5;
        const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 420;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 1.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        source.stop(ctx.currentTime + duration);
      } catch (error) { /* sin viento no pasa nada */ }
    }

    // ---------- HUD ----------
    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
    }
    function giftName(index) {
      const quest = gifts.find((q) => q && q.giftIndex === index);
      if (quest && quest.name) return t(quest.name);
      return t(GIFT_NAMES[index]);
    }
    function renderFlames() {
      flamesHud.innerHTML = '';
      for (let i = 0; i < 7; i++) {
        const slot = document.createElement('div');
        slot.className = 'flame-slot' + (save.gifts[i] ? ' is-lit' : '');
        slot.title = giftName(i);
        const glyph = document.createElement('span');
        glyph.className = 'flame-glyph';
        glyph.setAttribute('aria-hidden', 'true');
        glyph.textContent = '🔥';
        const label = document.createElement('span');
        label.className = 'flame-name';
        label.textContent = giftName(i);
        slot.appendChild(glyph);
        slot.appendChild(label);
        flamesHud.appendChild(slot);
      }
    }
    function renderPoints() {
      progressCount.textContent = String(save.points);
      gameStatus.textContent = text().status(giftsDoneCount(), charismsDoneCount(), save.points);
    }
    function renderObjective() {
      objectiveText.textContent = objectiveOverride || computedObjectiveText();
    }
    function zoneName(zoneId) {
      const zone = zoneById.get(zoneId);
      return zone ? t(zone.name) : '';
    }
    function firstIncompleteGift() {
      const ordered = gifts.slice().sort((a, b) => (a.giftIndex || 0) - (b.giftIndex || 0));
      return ordered.find((q) => q && !save.gifts[q.giftIndex]) || null;
    }
    function computedObjectiveText() {
      if (!save.tutorialDone) return text().objTutorial;
      if (activeQuest) return text().objGift(giftName(activeQuest.giftIndex));
      const next = firstIncompleteGift();
      if (next) return text().objSeek(giftName(next.giftIndex), zoneName(next.zoneId));
      if (!allGiftsDone()) return text().objFree;
      return text().objFinale;
    }
    function refreshObjective() {
      if (!save.tutorialDone) {
        objectivePoint = { x: altarPoint.x, z: altarPoint.z };
      } else if (activeQuest) {
        const npc = npcById.get(activeQuest.npcId);
        objectivePoint = npc ? { x: npc.x, z: npc.z } : objectivePoint;
      } else if (!allGiftsDone()) {
        const next = firstIncompleteGift();
        if (next) {
          const npc = npcById.get(next.npcId);
          const zone = zoneById.get(next.zoneId);
          if (npc) objectivePoint = { x: npc.x, z: npc.z };
          else if (zone) objectivePoint = { x: zone.cx, z: zone.cz };
        } else {
          objectivePoint = { x: player.x, z: player.z };
        }
      } else {
        objectivePoint = { x: altarPoint.x, z: altarPoint.z };
      }
      renderObjective();
    }
    function setObjective(newText, point) {
      objectiveOverride = newText === null || newText === undefined ? null : t(newText);
      if (point && Number.isFinite(point.x) && Number.isFinite(point.z)) {
        objectivePoint = { x: point.x, z: point.z };
      }
      renderObjective();
    }
    function addPoints(n) {
      if (!Number.isFinite(n) || n === 0) { renderPoints(); return; }
      save.points += n;
      renderPoints();
      saveGame();
    }

    // ---------- Diálogos y elecciones ----------
    function speakerName(line) {
      if (!line || line.speaker === undefined || line.speaker === 'narrator') return '';
      if (line.speaker === 'npc') return activeNpcName ? t(activeNpcName) : '';
      if (line.speaker === 'player') return text().you;
      return t(line.speaker);
    }
    function currentZone() {
      let best = null;
      let bestDist = Infinity;
      for (const zone of zones) {
        const d = Math.hypot(player.x - zone.cx, player.z - zone.cz);
        if (d < zone.r + 6 && d < bestDist) { best = zone; bestDist = d; }
      }
      return best;
    }
    function restoreFreeHud() {
      const zone = currentZone();
      npcName.textContent = zone ? t(zone.name) : text().startTitle;
      npcDialogue.textContent = text().freeHint;
      dialogueNext.hidden = true;
      updateInteractPrompt();
    }
    function showSayLine() {
      if (!sayQueue) return;
      const line = sayQueue.lines[sayQueue.index];
      npcName.textContent = speakerName(line);
      npcDialogue.textContent = t(line && line.text !== undefined ? line.text : line);
      choiceBox.hidden = true;
      interactButton.hidden = true;
      dialogueNext.hidden = false;
      dialogueNext.textContent = text().next;
    }
    function say(lines, cb) {
      const list = (Array.isArray(lines) ? lines : [lines]).filter((line) => line !== null && line !== undefined && line !== '');
      if (!list.length) { if (cb) cb(); return; }
      sayQueue = { lines: list, index: 0, cb: cb || null };
      showSayLine();
    }
    function advanceSay() {
      if (!sayQueue) return;
      sayQueue.index += 1;
      if (sayQueue.index >= sayQueue.lines.length) {
        const cb = sayQueue.cb;
        sayQueue = null;
        dialogueNext.hidden = true;
        restoreFreeHud();
        if (cb) cb();
      } else {
        showSayLine();
      }
    }
    function choose(prompt, options, cb) {
      choiceActive = true;
      const promptText = prompt && prompt.text !== undefined ? prompt.text : prompt;
      if (prompt && prompt.speaker) npcName.textContent = speakerName(prompt);
      npcDialogue.textContent = t(promptText);
      dialogueNext.hidden = true;
      interactButton.hidden = true;
      choiceBox.innerHTML = '';
      choiceBox.hidden = false;
      (options || []).forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'choice-button';
        button.textContent = t(option && option.text !== undefined ? option.text : option);
        button.addEventListener('click', () => {
          choiceBox.hidden = true;
          choiceBox.innerHTML = '';
          choiceActive = false;
          if (cb) cb(index, option);
        });
        choiceBox.appendChild(button);
      });
    }

    // ---------- Tarjeta de anuncio ----------
    function showBanner(build, cb) {
      bannerContent.innerHTML = '';
      if (typeof build === 'string') bannerContent.innerHTML = build;
      else if (typeof build === 'function') build(bannerContent);
      bannerCallback = cb || null;
      bannerOpen = true;
      bannerCard.hidden = false;
      bannerClose.textContent = text().amen;
    }
    function closeBanner() {
      if (!bannerOpen) return;
      bannerOpen = false;
      bannerCard.hidden = true;
      const cb = bannerCallback;
      bannerCallback = null;
      if (cb) cb();
    }
    function prayerBanner(prayerText, cb) {
      showBanner((box) => {
        const glyph = document.createElement('div');
        glyph.className = 'banner-glyph';
        glyph.textContent = '🕊';
        const body = document.createElement('p');
        body.className = 'banner-prayer';
        body.textContent = t(prayerText);
        box.appendChild(glyph);
        box.appendChild(body);
      }, cb);
    }

    // ---------- Tutorial: los cinco pasos ----------
    function runStep(index) {
      if (index >= steps.length) {
        stepActive = false;
        stepCard.hidden = true;
        save.tutorialDone = true;
        saveGame();
        bell(2);
        showToast(text().tutorialDone);
        refreshObjective();
        restoreFreeHud();
        return;
      }
      const step = steps[index];
      stepActive = true;
      stepCount.textContent = `${text().stepOf} ${index + 1} / ${steps.length}`;
      stepTitle.textContent = t(step.title);
      stepLine.textContent = step.line ? t(step.line) : text().stepPrompt;
      stepPhrase.textContent = t(step.phrase);
      sayItButton.textContent = text().sayIt;
      stepCard.hidden = false;
      sayItButton.onclick = () => {
        chime(2);
        stepCard.hidden = true;
        runStep(index + 1);
      };
    }
    function runTutorial() {
      refreshObjective();
      say(OPENING_LINES, () => runStep(0));
    }

    // ---------- Libro de oración ----------
    function atHolyPlace() {
      if (Math.hypot(player.x - altarPoint.x, player.z - altarPoint.z) < 10) return true;
      if (Math.hypot(player.x - plazaZone.cx, player.z - plazaZone.cz) < plazaZone.r + 2) return true;
      return charisms.some((trial) => trial && Math.hypot(player.x - trial.x, player.z - trial.z) < 5);
    }
    function markRead(id, entryEl, button) {
      chime(1);
      if (!save.readPrayers.includes(id)) {
        save.readPrayers.push(id);
        if (atHolyPlace()) {
          addPoints(5);
          showToast(text().readBonus);
        }
        saveGame();
      }
      if (entryEl) entryEl.classList.add('is-read');
      if (button) button.textContent = text().prayedButton;
    }
    function bookEntry(id, title, phrase, sub) {
      const entry = document.createElement('div');
      entry.className = 'book-entry' + (save.readPrayers.includes(id) ? ' is-read' : '');
      if (title) {
        const h = document.createElement('h4');
        h.textContent = t(title);
        entry.appendChild(h);
      }
      const p = document.createElement('p');
      p.className = 'book-phrase';
      p.textContent = t(phrase);
      entry.appendChild(p);
      if (sub) {
        const s = document.createElement('p');
        s.className = 'book-sub';
        s.textContent = t(sub);
        entry.appendChild(s);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'read-button';
      button.textContent = save.readPrayers.includes(id) ? text().prayedButton : text().prayButton;
      button.addEventListener('click', () => markRead(id, entry, button));
      entry.appendChild(button);
      return entry;
    }
    function bookSection(titleKey) {
      const h = document.createElement('h3');
      h.className = 'book-section-title';
      h.textContent = text()[titleKey];
      return h;
    }
    function renderBook() {
      bookContent.innerHTML = '';
      bookContent.appendChild(bookSection('bookSteps'));
      steps.forEach((step, i) => bookContent.appendChild(bookEntry(`step-${i}`, step.title, step.phrase)));
      const moments = Array.isArray(prayers.moments) ? prayers.moments : [];
      if (moments.length) {
        bookContent.appendChild(bookSection('bookMoments'));
        moments.forEach((moment, i) => bookContent.appendChild(bookEntry(`moment-${i}`, moment.title, moment.phrase)));
      }
      const shorts = Array.isArray(prayers.short) ? prayers.short : [];
      if (shorts.length) {
        bookContent.appendChild(bookSection('bookShort'));
        shorts.forEach((item, i) => bookContent.appendChild(bookEntry(`short-${i}`, null, item.phrase, item.sub)));
      }
      bookContent.appendChild(bookSection('bookPrayer'));
      bookContent.appendChild(bookEntry('prayer', null, prayers.prayer || FALLBACK_PRAYERS.prayer));
      bookContent.appendChild(bookSection('bookInvocation'));
      bookContent.appendChild(bookEntry('invocation', null, prayers.invocation || FALLBACK_PRAYERS.invocation));
      bookContent.appendChild(bookSection('bookClosing'));
      bookContent.appendChild(bookEntry('closing', null, prayers.closing || FALLBACK_PRAYERS.closing));
    }
    function openBook() {
      if (!gameStarted) return;
      if (overlayOpen !== null && overlayOpen !== 'book') return;
      if (!save.tutorialDone) {
        showToast(text().bookLocked);
        return;
      }
      renderBook();
      overlayOpen = 'book';
      bookOverlay.classList.remove('is-hidden');
      keys.clear();
    }
    function closeBook() {
      if (overlayOpen !== 'book') return;
      overlayOpen = null;
      bookOverlay.classList.add('is-hidden');
      resetFrameScroll();
    }

    // ---------- Pausa ----------
    function openPause() {
      if (!gameStarted || overlayOpen !== null) return;
      overlayOpen = 'pause';
      pauseOverlay.classList.remove('is-hidden');
      keys.clear();
    }
    function closePause() {
      if (overlayOpen !== 'pause') return;
      overlayOpen = null;
      pauseOverlay.classList.add('is-hidden');
      resetFrameScroll();
    }
    function restartGame() {
      try { localStorage.removeItem(SAVE_KEY); } catch (error) { /* nada */ }
      save = freshSave();
      player.x = 0;
      player.z = 7;
      player.vx = 0;
      player.vz = 0;
      activeQuest = null;
      activeCharism = null;
      finaleActive = false;
      objectiveOverride = null;
      challengeFrameCallbacks = [];
      challengeResolved = true;
      sayQueue = null;
      choiceActive = false;
      choiceBox.hidden = true;
      stepActive = false;
      stepCard.hidden = true;
      bannerOpen = false;
      bannerCard.hidden = true;
      bookOverlay.classList.add('is-hidden');
      endOverlay.classList.add('is-hidden');
      closePause();
      gameStarted = false;
      overlayOpen = 'start';
      renderFlames();
      renderPoints();
      refreshObjective();
      renderStartOverlay();
      overlay.classList.remove('is-hidden');
      restoreFreeHud();
    }

    // ---------- Contexto para los retos ----------
    function cleanupChallenge() {
      challengeFrameCallbacks.forEach((entry) => { entry.active = false; });
      challengeFrameCallbacks = [];
      pendingInteract = null;
    }
    function makeCtx(owner, onDone) {
      let resolved = false;
      const resolve = (success, points) => {
        if (resolved) return;
        resolved = true;
        challengeResolved = true;
        cleanupChallenge();
        if (success) addPoints(points || 0);
        onDone(success);
      };
      const ctx = {
        lang: () => language,
        t,
        say,
        choose,
        toast: (msg) => showToast(t(msg)),
        banner: (html, cb) => showBanner(html, cb),
        setObjective,
        addPoints,
        player,
        onFrame: (fn) => {
          const entry = { fn, active: true };
          challengeFrameCallbacks.push(entry);
          return () => { entry.active = false; };
        },
        waitInteract: (cb) => { pendingInteract = cb; },
        bell,
        chime,
        complete: (points) => resolve(true, points),
        fail: (msg) => {
          // Reintento amable: el módulo de retos se reinicia por dentro tras el aviso;
          // el reto solo termina cuando el módulo llama a done o a ctx.complete.
          showToast(t(msg) || text().failRetry);
        },
        isPaused,
        renderer,
        hud: { setObjective, addPoints, refresh: () => { renderPoints(); renderObjective(); } },
        world: { zones, npcs, props: allProps() },
        fx: { bell, chime },
      };
      ctx._resolve = resolve;
      return ctx;
    }
    function dispatchChallenge(owner, challenge, onDone) {
      cleanupChallenge();
      challengeResolved = false;
      const ctx = makeCtx(owner, onDone);
      const handler = (typeof window !== 'undefined' && window.RpgChallenges && challenge && challenge.type)
        ? window.RpgChallenges[challenge.type]
        : null;
      if (typeof handler !== 'function') {
        // Sin módulo de retos, completar la introducción cuenta como reto superado.
        ctx._resolve(true, 0);
        return;
      }
      try {
        handler(ctx, challenge, () => ctx._resolve(true, 0));
      } catch (error) {
        ctx._resolve(true, 0);
      }
    }

    // ---------- Misiones de dones y pruebas de carismas ----------
    function giftCeremony(quest) {
      const gi = quest.giftIndex;
      save.gifts[gi] = true;
      addPoints(GIFT_POINTS);
      bell(3);
      renderFlames();
      saveGame();
      const name = giftName(gi);
      const desc = quest.desc || quest.description || null;
      const fruit = quest.fruit ? t(quest.fruit) : '';
      showBanner((box) => {
        const glyph = document.createElement('div');
        glyph.className = 'banner-glyph';
        glyph.textContent = '🔥';
        const title = document.createElement('h3');
        title.textContent = `${text().giftReceived} ${name}`;
        box.appendChild(glyph);
        box.appendChild(title);
        if (desc) {
          const p = document.createElement('p');
          p.textContent = t(desc);
          box.appendChild(p);
        }
        if (quest.giftLine) {
          const line = document.createElement('p');
          line.className = 'banner-line';
          line.textContent = t(quest.giftLine);
          box.appendChild(line);
        }
        if (fruit) {
          const f = document.createElement('p');
          f.textContent = text().fruitGrows(fruit);
          box.appendChild(f);
        }
      }, () => {
        activeQuest = null;
        objectiveOverride = null;
        refreshObjective();
        restoreFreeHud();
      });
    }
    function startGiftQuest(quest, npc) {
      activeQuest = quest;
      activeNpcName = npc ? npc.name : null;
      objectiveOverride = null;
      refreshObjective();
      say(quest.intro, () => {
        dispatchChallenge(quest, quest.challenge, (success) => {
          if (!success) {
            activeQuest = null;
            refreshObjective();
            restoreFreeHud();
            return;
          }
          activeNpcName = npc ? npc.name : null;
          say(quest.outro, () => giftCeremony(quest));
        });
      });
    }
    function startCharism(trial) {
      activeCharism = trial;
      activeNpcName = trial.title || null;
      say(trial.intro, () => {
        dispatchChallenge(trial, trial.challenge, (success) => {
          if (!success) {
            activeCharism = null;
            restoreFreeHud();
            return;
          }
          activeNpcName = trial.title || null;
          say(trial.outro, () => {
            const ci = Number.isInteger(trial.charismIndex) ? trial.charismIndex : charisms.indexOf(trial);
            if (ci >= 0 && ci < 9) save.charisms[ci] = true;
            addPoints(Number.isFinite(trial.points) ? trial.points : 50);
            chime(3);
            renderPoints();
            saveGame();
            showBanner((box) => {
              const glyph = document.createElement('div');
              glyph.className = 'banner-glyph';
              glyph.textContent = '✦';
              const title = document.createElement('h3');
              title.textContent = t(trial.title) || t(CHARISM_NAMES[ci] || CHARISM_NAMES[0]);
              const line = document.createElement('p');
              line.textContent = text().charismDone;
              box.appendChild(glyph);
              box.appendChild(title);
              box.appendChild(line);
            }, () => {
              activeCharism = null;
              restoreFreeHud();
            });
          });
        });
      });
    }
    function talkToNpc(npc) {
      activeNpcName = npc.name || null;
      if (!save.tutorialDone) {
        say([{ speaker: 'npc', text: { es: STR.es.lockedLine, en: STR.en.lockedLine } }]);
        return;
      }
      const quest = giftByNpc.get(npc.id);
      if (!quest) {
        if (Array.isArray(npc.lines) && npc.lines.length) say(npc.lines);
        return;
      }
      if (save.gifts[quest.giftIndex]) {
        say([{ speaker: 'npc', text: quest.doneLine || { es: STR.es.blessing, en: STR.en.blessing } }]);
        return;
      }
      if (activeQuest === quest) {
        say([{ speaker: 'npc', text: { es: STR.es.reminder, en: STR.en.reminder } }], () => {
          dispatchChallenge(quest, quest.challenge, (success) => {
            if (!success) { activeQuest = null; refreshObjective(); restoreFreeHud(); return; }
            activeNpcName = npc.name || null;
            say(quest.outro, () => giftCeremony(quest));
          });
        });
        return;
      }
      startGiftQuest(quest, npc);
    }
    function treeDialogue() {
      const grown = [];
      gifts.forEach((quest) => {
        if (quest && save.gifts[quest.giftIndex] && quest.fruit) grown.push(t(quest.fruit));
      });
      say([{ speaker: 'narrator', text: text().treeLine(grown.join(', ')) }]);
    }

    // ---------- Final: Pentecostés ----------
    function showEndOverlay() {
      endStats.textContent = text().endStats(giftsDoneCount(), charismsDoneCount(), save.points);
      overlayOpen = 'end';
      endOverlay.classList.remove('is-hidden');
    }
    function startFinale() {
      if (save.finaleSeen) {
        prayerBanner(prayers.closing || FALLBACK_PRAYERS.closing);
        return;
      }
      finaleActive = true;
      playWind();
      bell(3);
      say(FINALE_LINES, () => {
        prayerBanner(prayers.closing || FALLBACK_PRAYERS.closing, () => {
          save.finaleSeen = true;
          saveGame();
          showEndOverlay();
        });
      });
    }

    // ---------- Mundo: props, colisiones y dibujo ----------
    function allProps() {
      const list = [];
      zones.forEach((zone) => {
        (zone.props || []).forEach((prop) => list.push({ ...prop, zone }));
      });
      return list;
    }
    const PROP_RADIUS = {
      tree: 0.7, rock: 1.1, house: 2.6, fence: 0.5, shrine: 2.4, well: 1.3,
      stall: 1.6, hedge: 1.2, dune: 1.6, cactus: 0.6, column: 0.8, signpost: 0.5,
      table: 1.0, lamp: 0.5,
    };
    function buildColliders() {
      const circles = [];
      const boxes = [];
      allProps().forEach((prop) => {
        if (!prop.solid) return;
        if (prop.shape === 'box') {
          boxes.push({
            x: prop.x, z: prop.z,
            hw: (prop.w || 2) / 2, hd: (prop.d || 2) / 2,
          });
        } else {
          circles.push({ x: prop.x, z: prop.z, r: prop.r || PROP_RADIUS[prop.kind] || 1 });
        }
      });
      npcs.forEach((npc) => circles.push({ x: npc.x, z: npc.z, r: 0.8 }));
      charisms.forEach((trial) => { if (trial) circles.push({ x: trial.x, z: trial.z, r: 0.7 }); });
      circles.push({ x: cenaculo.x, z: cenaculo.z - 4, r: 3.8 });
      circles.push({ x: treePos.x, z: treePos.z, r: 1.0 });
      zones.forEach((zone) => {
        const anchor = landmarkAnchor(zone);
        if (zone.landmark === 'mirador') circles.push({ x: anchor.x, z: anchor.z, r: 2.3 });
        if (zone.landmark === 'templo') circles.push({ x: anchor.x, z: anchor.z, r: 4.2 });
        if (zone.landmark === 'jardin') circles.push({ x: anchor.x, z: anchor.z, r: 1.7 });
      });
      return { circles, boxes };
    }
    function landmarkAnchor(zone) {
      if (zone.landmarkPos) return zone.landmarkPos;
      if (zone.landmark === 'cenaculo') return { x: cenaculo.x, z: cenaculo.z };
      return { x: zone.cx, z: zone.cz };
    }
    let colliders = { circles: [], boxes: [] };

    function drawHouse(x, z, wall, roof) {
      renderer.draw('cube', [x, 1.1, z], [3.4, 2.2, 3], wall);
      renderer.draw('cube', [x, 0.75, z + 1.53], [0.9, 1.5, 0.08], '#654a38');
      renderer.draw('cone', [x, 2.85, z], [4.4, 1.5, 4], roof);
    }
    function drawProp(prop, time) {
      const { x, z } = prop;
      switch (prop.kind) {
        case 'tree': renderer.drawTree(x, 0, z, prop.size || 1); break;
        case 'rock':
          renderer.draw('sphere', [x, 0.32, z], [1.15, 0.65, 0.95], prop.color || '#8d9299');
          break;
        case 'house': drawHouse(x, z, prop.color || '#e6d3ac', prop.roof || '#a84e40'); break;
        case 'fence': {
          const len = prop.len || 4;
          const yaw = prop.yaw || 0;
          const dx = Math.sin(yaw);
          const dz = Math.cos(yaw);
          for (let i = -1; i <= 1; i++) {
            renderer.draw('cube', [x + dx * i * len / 2, 0.45, z + dz * i * len / 2], [0.16, 0.9, 0.16], '#8a6844');
          }
          renderer.draw('cube', [x, 0.55, z], [Math.abs(dx) > 0.5 ? len : 0.14, 0.12, Math.abs(dz) > 0.5 ? len : 0.14], '#a07a4e');
          renderer.draw('cube', [x, 0.28, z], [Math.abs(dx) > 0.5 ? len : 0.14, 0.12, Math.abs(dz) > 0.5 ? len : 0.14], '#a07a4e');
          break;
        }
        case 'shrine':
          renderer.drawShrine({ x, z: z + 2.5 }, {
            shrineWall: prop.color || '#f0e6ce', shrineRoof: prop.roof || '#b0563a',
            shrineWindow: '#a8c8d8', pedestal: '#9a8a72', emblem: prop.emblem || 'flame',
            particle: 'flame',
          }, time, false);
          break;
        case 'well':
          renderer.draw('cylinder', [x, 0.5, z], [1.7, 1, 1.7], '#9a958c');
          renderer.draw('cylinder', [x, 0.95, z], [1.3, 0.25, 1.3], '#3d6a86');
          renderer.draw('cube', [x - 0.95, 1.15, z], [0.14, 1.3, 0.14], '#8a6844');
          renderer.draw('cube', [x + 0.95, 1.15, z], [0.14, 1.3, 0.14], '#8a6844');
          renderer.draw('cone', [x, 2.15, z], [2.6, 0.8, 2.6], '#a84e40');
          break;
        case 'stall':
          renderer.draw('cube', [x, 0.5, z], [2.6, 0.9, 1.4], '#a07a4e');
          renderer.draw('cube', [x - 1.2, 1.2, z - 0.6], [0.13, 1.5, 0.13], '#8a6844');
          renderer.draw('cube', [x + 1.2, 1.2, z - 0.6], [0.13, 1.5, 0.13], '#8a6844');
          renderer.draw('cube', [x - 1.2, 1.2, z + 0.6], [0.13, 1.5, 0.13], '#8a6844');
          renderer.draw('cube', [x + 1.2, 1.2, z + 0.6], [0.13, 1.5, 0.13], '#8a6844');
          renderer.draw('cube', [x, 2.05, z], [3, 0.14, 2], prop.color || '#c95f4a');
          break;
        case 'hedge':
          renderer.draw('cube', [x, (prop.h || 1.5) / 2, z], [prop.w || 3, prop.h || 1.5, prop.d || 0.9], prop.color || '#4a7a3a');
          break;
        case 'dune':
          renderer.draw('sphere', [x, -0.4, z], [3.4, 1.5, 2.6], prop.color || '#e3c88f');
          break;
        case 'cactus':
          renderer.draw('cylinder', [x, 0.9, z], [0.42, 1.8, 0.42], '#3e7d46');
          renderer.draw('cylinder', [x - 0.55, 0.75, z], [0.26, 0.9, 0.26], '#3e7d46');
          renderer.draw('cylinder', [x + 0.55, 1.05, z], [0.26, 1.3, 0.26], '#479152');
          break;
        case 'column':
          renderer.draw('cylinder', [x, 1.7, z], [0.65, 3.4, 0.65], prop.color || '#efe7d4');
          renderer.draw('cube', [x, 3.55, z], [1, 0.35, 1], prop.color || '#e2d7bf');
          renderer.draw('cube', [x, 0.12, z], [1.05, 0.25, 1.05], prop.color || '#e2d7bf');
          break;
        case 'signpost':
          renderer.draw('cylinder', [x, 1, z], [0.16, 2, 0.16], '#8a6844');
          renderer.draw('cube', [x + 0.4, 1.55, z], [1.1, 0.3, 0.08], '#a07a4e', [0, 0.5, 0]);
          renderer.draw('cube', [x - 0.4, 1.2, z], [1.1, 0.3, 0.08], '#a07a4e', [0, -0.4, 0]);
          break;
        case 'table':
          renderer.draw('cube', [x, 0.75, z], [2.2, 0.12, 1.2], '#a07a4e');
          renderer.draw('cube', [x - 0.9, 0.37, z], [0.14, 0.75, 1], '#8a6844');
          renderer.draw('cube', [x + 0.9, 0.37, z], [0.14, 0.75, 1], '#8a6844');
          break;
        case 'lamp':
          renderer.draw('cylinder', [x, 1.2, z], [0.11, 2.4, 0.11], '#4c4238');
          renderer.draw('sphere', [x, 2.6, z], [0.3, 0.34, 0.3], '#ffd873', [0, 0, 0], 0.75);
          break;
        default:
          renderer.draw('cube', [x, 0.5, z], [1, 1, 1], prop.color || '#999999');
      }
    }
    function drawLandmark(zone, time) {
      const anchor = landmarkAnchor(zone);
      const ax = anchor.x;
      const az = anchor.z;
      switch (zone.landmark) {
        case 'cenaculo': {
          renderer.drawShrine({ x: ax, z: az }, {
            shrineWall: '#f2e3c2', shrineRoof: '#9a4a3a', shrineWindow: '#f4cd75',
            pedestal: '#a08b62', emblem: 'flame', particle: 'flame',
          }, time, allGiftsDone());
          drawHouse(ax - 8.5, az - 2, '#e6d3ac', '#a84e40');
          drawHouse(ax + 8.5, az - 2, '#dfc9a0', '#96503f');
          break;
        }
        case 'mirador':
          renderer.draw('cylinder', [ax, 3, az], [2.4, 6, 2.4], '#a89a83');
          renderer.draw('cylinder', [ax, 6.3, az], [3.8, 0.6, 3.8], '#8a6844');
          renderer.draw('cone', [ax, 7.9, az], [4.6, 2.6, 4.6], '#7a4a30');
          renderer.draw('sphere', [ax, 6.9, az], [0.34, 0.38, 0.34], '#ffd873', [0, 0, 0], 0.8);
          break;
        case 'laberinto': {
          const hedge = (x, z, w, d) => renderer.draw('cube', [x, 0.85, z], [w, 1.7, d], '#4a7a3a');
          hedge(ax, az - 9, 19, 1);
          hedge(ax - 9, az, 1, 17);
          hedge(ax + 9, az, 1, 17);
          hedge(ax - 5.5, az + 9, 8, 1);
          hedge(ax + 5.5, az + 9, 8, 1);
          hedge(ax, az - 4.5, 10, 1);
          hedge(ax - 4.5, az + 1, 1, 10);
          hedge(ax + 4.5, az + 3.5, 1, 5);
          renderer.draw('cube', [ax, 0.5, az + 4.5], [1.6, 1, 0.7], '#9a8a72');
          break;
        }
        case 'encrucijada':
          drawProp({ kind: 'signpost', x: ax, z: az }, time);
          [[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(([dx, dz]) => drawProp({ kind: 'lamp', x: ax + dx, z: az + dz }, time));
          break;
        case 'desierto':
          drawProp({ kind: 'dune', x: ax - 7, z: az - 5 }, time);
          drawProp({ kind: 'dune', x: ax + 8, z: az + 3 }, time);
          drawProp({ kind: 'dune', x: ax + 2, z: az - 9 }, time);
          renderer.draw('cube', [ax - 3.4, 1.7, az], [1.1, 3.4, 1.1], '#9a8a76');
          renderer.draw('cube', [ax + 3.4, 1.7, az], [1.1, 3.4, 1.1], '#9a8a76');
          renderer.draw('cube', [ax, 3.6, az], [8.4, 1, 1.2], '#8d7c64');
          break;
        case 'jardin': {
          renderer.draw('cylinder', [ax, 0.45, az], [3.2, 0.9, 3.2], '#b9c4c9');
          renderer.draw('cylinder', [ax, 0.95, az], [2.7, 0.15, 2.7], '#4a90b8');
          renderer.draw('sphere', [ax, 1.5, az], [0.5, 0.7, 0.5], '#bfe0f2', [0, 0, 0], 0.4);
          renderer.draw('cube', [ax, 0.03, az + 8], [3.2, 0.06, 12], '#4a90b8');
          const flowerColors = ['#e86a8a', '#f2a541', '#f7e463', '#b07ac9'];
          for (let i = 0; i < 10; i++) {
            const fx = ax - 9 + (i % 5) * 4.5;
            const fz = az - 7 + Math.floor(i / 5) * 3;
            renderer.draw('sphere', [fx, 0.3, fz], [0.34, 0.3, 0.34], flowerColors[i % 4], [0, 0, 0], 0.3);
          }
          break;
        }
        case 'aldea':
          drawHouse(ax - 6, az - 4, '#e6d3ac', '#a84e40');
          drawHouse(ax + 6, az - 4, '#dfc9a0', '#7a6a9a');
          drawHouse(ax, az - 10, '#ead9b4', '#96503f');
          break;
        case 'templo':
          renderer.draw('cube', [ax, 0.3, az], [11, 0.6, 8], '#d9cfb6');
          renderer.draw('cube', [ax, 0.75, az], [9.6, 0.3, 6.8], '#e6dcc2');
          [[-4.2, -2.8], [4.2, -2.8], [-4.2, 2.8], [4.2, 2.8], [0, -2.8], [0, 2.8]].forEach(([dx, dz]) => {
            renderer.draw('cylinder', [ax + dx, 2.7, az + dz], [0.62, 3.6, 0.62], '#efe7d4');
          });
          renderer.draw('cube', [ax, 4.8, az], [11, 0.7, 8], '#e2d7bf');
          renderer.draw('cone', [ax, 5.9, az], [11.5, 1.6, 8.5], '#b0563a');
          break;
        default:
          break;
      }
    }
    function drawTreeOfFruits(time) {
      const { x, z } = treePos;
      renderer.drawTree(x, 0, z, 1.7);
      gifts.forEach((quest) => {
        if (!quest || !save.gifts[quest.giftIndex]) return;
        const i = quest.giftIndex;
        const angle = i / 7 * Math.PI * 2;
        const fx = x + Math.cos(angle) * 1.5;
        const fz = z + Math.sin(angle) * 1.5;
        const fy = 3.1 + Math.sin(i * 2.3) * 0.5 + Math.sin(time / 400 + i) * 0.06;
        renderer.draw('sphere', [fx, fy, fz], [0.3, 0.3, 0.3], FRUIT_COLORS[i % FRUIT_COLORS.length], [0, 0, 0], 0.45);
      });
    }
    function drawDove(time) {
      const ox = objectivePoint.x;
      const oz = objectivePoint.z;
      renderer.draw('cylinder', [ox, 7, oz], [1.5, 14, 1.5], '#ffedb0', [0, 0, 0], 0.85);
      renderer.draw('cylinder', [ox, 0.06, oz], [4.6, 0.1, 4.6], '#ffd873', [0, 0, 0], 0.5);
      const y = 3.2 + Math.sin(time / 480) * 0.3;
      const flap = Math.sin(time / 120) * 0.55;
      renderer.draw('sphere', [ox, y, oz], [0.62, 0.5, 0.8], '#ffffff', [0, 0, 0], 0.85);
      renderer.draw('sphere', [ox, y + 0.3, oz - 0.45], [0.3, 0.3, 0.3], '#ffffff', [0, 0, 0], 0.85);
      renderer.draw('cube', [ox - 0.58, y + 0.2, oz], [0.8, 0.07, 0.36], '#ffffff', [0, 0, 0.45 + flap], 0.65);
      renderer.draw('cube', [ox + 0.58, y + 0.2, oz], [0.8, 0.07, 0.36], '#ffffff', [0, 0, -0.45 - flap], 0.65);
      renderer.draw('cone', [ox, y - 0.05, oz + 0.55], [0.3, 0.5, 0.14], '#f2ede2', [Math.PI / 2.4, 0, 0], 0.5);
      for (let i = 0; i < 3; i++) {
        const a = time / 550 + i * 2.1;
        renderer.draw('sphere', [ox + Math.cos(a) * 1, y - 0.4 + Math.sin(time / 320 + i) * 0.25, oz + Math.sin(a) * 1], [0.09, 0.09, 0.09], '#fff3b0', [0, 0, 0], 0.9);
      }
    }

    // ---------- Movimiento y colisiones ----------
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
      const distCenter = Math.hypot(player.x, player.z);
      if (distCenter > WORLD_RADIUS) {
        player.x = player.x / distCenter * WORLD_RADIUS;
        player.z = player.z / distCenter * WORLD_RADIUS;
      }
      for (const circle of colliders.circles) {
        const dx = player.x - circle.x;
        const dz = player.z - circle.z;
        const d = Math.hypot(dx, dz);
        const min = circle.r + 0.55;
        if (d > 0.001 && d < min) {
          player.x = circle.x + dx / d * min;
          player.z = circle.z + dz / d * min;
        }
      }
      for (const box of colliders.boxes) {
        const dx = player.x - box.x;
        const dz = player.z - box.z;
        if (Math.abs(dx) < box.hw + 0.55 && Math.abs(dz) < box.hd + 0.55) {
          const pushX = box.hw + 0.55 - Math.abs(dx);
          const pushZ = box.hd + 0.55 - Math.abs(dz);
          if (pushX < pushZ) player.x = box.x + (dx >= 0 ? 1 : -1) * (box.hw + 0.55);
          else player.z = box.z + (dz >= 0 ? 1 : -1) * (box.hd + 0.55);
        }
      }
    }
    const movementLocked = () => !gameStarted || !!sayQueue || choiceActive || stepActive || bannerOpen || !!overlayOpen;

    // ---------- Interacción ----------
    function computeInteractable() {
      if (movementLocked()) return null;
      let best = null;
      let bestDist = Infinity;
      const consider = (x, z, data, radius) => {
        const d = Math.hypot(x - player.x, z - player.z);
        if (d < (radius || 3.4) && d < bestDist) {
          best = data;
          bestDist = d;
        }
      };
      npcs.forEach((npc) => {
        consider(npc.x, npc.z, {
          kind: 'npc', npc,
          label: text().talkWith(t(npc.name)),
          touch: text().talk,
        }, 3);
      });
      charisms.forEach((trial) => {
        if (!trial) return;
        const ci = Number.isInteger(trial.charismIndex) ? trial.charismIndex : charisms.indexOf(trial);
        if (ci >= 0 && save.charisms[ci]) return;
        consider(trial.x, trial.z, {
          kind: 'charism', trial,
          label: text().trialWith(t(trial.title)),
          touch: text().prayTouch,
        }, 3.2);
      });
      consider(altarPoint.x, altarPoint.z, {
        kind: 'altar',
        label: allGiftsDone() ? text().finalePrompt : text().altarPrompt,
        touch: text().prayTouch,
      }, 3.8);
      consider(treePos.x, treePos.z, {
        kind: 'tree',
        label: text().treePrompt,
        touch: text().talk,
      }, 3.4);
      return best;
    }
    function updateInteractPrompt() {
      currentInteractable = computeInteractable();
      if (currentInteractable && !sayQueue && !choiceActive) {
        interactButton.hidden = false;
        interactButton.textContent = currentInteractable.label;
        interactTouch.textContent = currentInteractable.touch;
        interactTouch.hidden = false;
      } else if (!sayQueue && !choiceActive && !stepActive) {
        interactButton.hidden = true;
        interactTouch.textContent = text().talk;
      }
    }
    function pressInteract() {
      if (sayQueue) { advanceSay(); return; }
      if (choiceActive || stepActive || bannerOpen) {
        if (bannerOpen) closeBanner();
        return;
      }
      if (overlayOpen) return;
      if (pendingInteract) {
        const cb = pendingInteract;
        pendingInteract = null;
        cb();
        return;
      }
      if (!currentInteractable) currentInteractable = computeInteractable();
      if (!currentInteractable) return;
      const target = currentInteractable;
      if (target.kind === 'npc') talkToNpc(target.npc);
      else if (target.kind === 'charism') startCharism(target.trial);
      else if (target.kind === 'altar') {
        if (allGiftsDone()) startFinale();
        else openBook();
      } else if (target.kind === 'tree') treeDialogue();
    }

    // ---------- Render ----------
    function render(time) {
      const playerObj = {
        x: player.x, y: 0, z: player.z,
        vx: player.vx, vz: player.vz, vy: 0, facing: player.facing,
      };
      renderer.beginScene(playerObj, time, Math.PI);
      renderer.draw('cylinder', [0, -0.16, 0], [216, 0.12, 216], '#5f7a48');
      renderer.drawCloud(-24, 16, -30, 6);
      renderer.drawCloud(28, 19, -12, 7);
      renderer.drawCloud(-8, 15, 34, 5);
      renderer.drawCloud(18, 21, 30, 6);

      for (const zone of zones) {
        const distZone = Math.hypot(player.x - zone.cx, player.z - zone.cz);
        if (distZone > CULL_DIST + zone.r) continue;
        renderer.draw('cylinder', [zone.cx, -0.05, zone.cz], [zone.r * 2, 0.1, zone.r * 2], zone.ground || '#7d9a5c');
        if (zone.id !== 'plaza') {
          const dx = zone.cx - plazaZone.cx;
          const dz = zone.cz - plazaZone.cz;
          const len = Math.hypot(dx, dz);
          const yaw = Math.atan2(dx, dz);
          for (let d = plazaZone.r - 2; d < len - zone.r + 3; d += 4.2) {
            const px = plazaZone.cx + dx / len * d;
            const pz = plazaZone.cz + dz / len * d;
            if (Math.hypot(player.x - px, player.z - pz) > CULL_DIST) continue;
            renderer.draw('cube', [px, 0.03, pz], [3.4, 0.07, 4.6], zone.path || '#d8c29a', [0, yaw, 0]);
          }
        }
        drawLandmark(zone, time);
        (zone.props || []).forEach((prop) => {
          if (Math.hypot(player.x - prop.x, player.z - prop.z) > CULL_DIST) return;
          drawProp(prop, time);
        });
      }

      drawTreeOfFruits(time);

      charisms.forEach((trial) => {
        if (!trial) return;
        if (Math.hypot(player.x - trial.x, player.z - trial.z) > CULL_DIST) return;
        const ci = Number.isInteger(trial.charismIndex) ? trial.charismIndex : charisms.indexOf(trial);
        renderer.draw('cube', [trial.x, 0.22, trial.z], [1.1, 0.45, 1.1], '#8a6a42');
        if (!(ci >= 0 && save.charisms[ci])) {
          renderer.drawCollectible({ x: trial.x, z: trial.z, type: 'flame', taken: false }, time);
        }
      });

      if (finaleActive) {
        const gathered = [];
        npcs.forEach((npc, i) => gathered.push({ figure: npc.figure, seed: i }));
        const apostleRobes = ['#a0522d', '#5a7fb0', '#7a9a5b', '#8a5a7a', '#b0623f'];
        apostleRobes.forEach((robe, i) => gathered.push({
          figure: { robe, skin: '#d9a77f', hair: '#4a3423' }, seed: 20 + i,
        }));
        gathered.slice(0, 12).forEach((entry, i) => {
          const angle = (-66 + i * 12) * Math.PI / 180;
          const gx = cenaculo.x + Math.sin(angle) * 5.2;
          const gz = cenaculo.z + 1.5 + Math.cos(angle) * 3.4;
          const fig = { ...(entry.figure || {}), x: gx, z: gz, y: 0, index: i + 1, singing: true };
          const accessories = Array.isArray(fig.accessory) ? fig.accessory.slice() : (fig.accessory ? [fig.accessory] : []);
          if (!accessories.includes('flame')) accessories.push('flame');
          fig.accessory = accessories;
          renderer.drawFigure(fig, time);
        });
        renderer.drawEndingFx({ particle: 'flame' }, { x: cenaculo.x, z: cenaculo.z }, time);
      } else {
        npcs.forEach((npc, i) => {
          if (Math.hypot(player.x - npc.x, player.z - npc.z) > CULL_DIST) return;
          renderer.drawFigure({ ...(npc.figure || {}), x: npc.x, z: npc.z, y: 0, index: i + 1 }, time);
        });
      }

      if (gameStarted) drawDove(time);

      playerFigure.x = player.x;
      playerFigure.z = player.z;
      renderer.drawFigure(playerFigure, time);
    }
    function frame(time) {
      const delta = Math.min(0.035, (time - (lastTime || time)) / 1000);
      lastTime = time;
      if (gameStarted && !isPaused()) {
        if (!movementLocked()) updatePlayer(delta);
        if (!challengeResolved) {
          challengeFrameCallbacks.slice().forEach((entry) => {
            if (entry.active) {
              try { entry.fn(delta, time); } catch (error) { entry.active = false; }
            }
          });
        }
        updateInteractPrompt();
        posSaveTimer += delta;
        if (posSaveTimer > 5) {
          posSaveTimer = 0;
          if (Math.hypot(player.x - lastSavedPos.x, player.z - lastSavedPos.z) > 0.5) {
            lastSavedPos = { x: player.x, z: player.z };
            saveGame();
          }
        }
      }
      render(time);
      window.requestAnimationFrame(frame);
    }

    // ---------- Inicio, idioma y controles ----------
    function renderStartOverlay() {
      overlayTitle.textContent = text().startTitle;
      overlayMessage.textContent = text().startMessage;
      const hasProgress = save.tutorialDone || save.points > 0 || giftsDoneCount() > 0;
      playButton.textContent = hasProgress ? text().continueLabel : text().start;
      newGameButton.hidden = !hasProgress;
      newGameButton.textContent = text().newGame;
      newGameArmed = false;
    }
    function startGame() {
      prepareAudio();
      gameStarted = true;
      overlayOpen = null;
      overlay.classList.add('is-hidden');
      resetFrameScroll();
      canvas.focus({ preventScroll: true });
      if (!save.tutorialDone) {
        player.x = 0;
        player.z = 7;
        runTutorial();
      } else {
        showToast(text().welcomeBack);
        refreshObjective();
        restoreFreeHud();
      }
    }
    function setLanguage(next) {
      language = next === 'en' ? 'en' : 'es';
      renderFlames();
      renderPoints();
      renderObjective();
      dialogueNext.textContent = text().next;
      sayItButton.textContent = text().sayIt;
      bannerClose.textContent = text().amen;
      if (overlayOpen === 'start') renderStartOverlay();
      if (sayQueue) showSayLine();
      else if (!choiceActive) restoreFreeHud();
      if (overlayOpen === 'book') renderBook();
      if (overlayOpen === 'end') {
        endStats.textContent = text().endStats(giftsDoneCount(), charismsDoneCount(), save.points);
      }
      updateInteractPrompt();
    }

    playButton.addEventListener('click', startGame);
    newGameButton.addEventListener('click', () => {
      if (!newGameArmed) {
        newGameArmed = true;
        newGameButton.textContent = text().newGameConfirm;
        return;
      }
      try { localStorage.removeItem(SAVE_KEY); } catch (error) { /* nada */ }
      save = freshSave();
      player.x = 0;
      player.z = 7;
      renderFlames();
      renderPoints();
      startGame();
    });
    dialogueNext.addEventListener('click', advanceSay);
    dialogueBox.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      if (sayQueue) advanceSay();
    });
    interactButton.addEventListener('click', pressInteract);
    interactTouch.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      pressInteract();
    });
    bannerClose.addEventListener('click', closeBanner);
    bookButton.addEventListener('click', () => {
      if (overlayOpen === 'book') closeBook();
      else openBook();
    });
    bookCloseButton.addEventListener('click', closeBook);
    pauseButton.addEventListener('click', () => {
      if (overlayOpen === 'pause') closePause();
      else openPause();
    });
    resumeButton.addEventListener('click', closePause);
    restartButton.addEventListener('click', restartGame);
    endExploreButton.addEventListener('click', () => {
      if (overlayOpen === 'end') {
        overlayOpen = null;
        endOverlay.classList.add('is-hidden');
        restoreFreeHud();
      }
    });
    endPrayButton.addEventListener('click', () => {
      if (overlayOpen === 'end') {
        overlayOpen = null;
        endOverlay.classList.add('is-hidden');
      }
      prayerBanner(prayers.closing || FALLBACK_PRAYERS.closing);
    });
    window.addEventListener('tup:langchange', (event) => {
      setLanguage(event.detail || (localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es'));
    });
    window.addEventListener('keydown', (event) => {
      if (overlayOpen === 'book') {
        if (event.code === 'Escape' || event.code === 'KeyP') {
          event.preventDefault();
          closeBook();
        }
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      if (event.code === 'Escape') {
        if (overlayOpen === 'pause') closePause();
        else openPause();
        return;
      }
      if (event.code === 'KeyP') {
        if (overlayOpen === 'book') closeBook();
        else openBook();
        return;
      }
      if (event.code === 'KeyE' || event.code === 'Space') {
        if (!event.repeat) pressInteract();
        return;
      }
      if (event.code === 'Enter' && stepActive && sayItButton.onclick) {
        sayItButton.onclick();
        return;
      }
      keys.add(event.code);
    });
    window.addEventListener('keyup', (event) => keys.delete(event.code));
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

    colliders = buildColliders();
    renderFlames();
    renderPoints();
    refreshObjective();
    renderStartOverlay();
    restoreFreeHud();
    renderer.resize();
    window.requestAnimationFrame(frame);
  };
})();
