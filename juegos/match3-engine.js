// Motor compartido de los juegos de combinar fichas (match-3).
// Cada juego define su configuración (melodía y textos en dos idiomas)
// y llama a window.MatchGame(config). El tablero es de 7 columnas por
// 8 filas; se gana al llegar a 700 puntos en 22 movimientos.
(() => {
  'use strict';

  const COLS = 7;
  const ROWS = 8;
  const CELLS = COLS * ROWS;
  const GOAL_SCORE = 700;
  const START_MOVES = 22;
  const TYPES = [
    { g: '♥' },
    { g: '★' },
    { g: '✿' },
    { g: '☀' },
    { g: '✚' },
    { g: '♦' },
  ];

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  window.MatchGame = function MatchGame(config) {
    const stage = document.getElementById('gameStage');
    if (!stage) {
      throw new Error('No se encontró el tablero del juego.');
    }
    const overlay = document.getElementById('gameOverlay');
    const playButton = document.getElementById('playButton');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayMessage = document.getElementById('overlayMessage');
    const progressCount = document.getElementById('progressCount');
    const npcName = document.getElementById('npcName');
    const npcDialogue = document.getElementById('npcDialogue');
    const endBanner = document.getElementById('endBanner');
    const endRestartButton = document.getElementById('endRestartButton');
    const gameFrame = document.querySelector('.game-frame');
    const gameStatus = document.getElementById('gameStatus');
    const toast = document.getElementById('toast');
    const languageToggle = document.getElementById('languageToggle');

    const strings = config.strings;
    let board = [];
    let tileButtons = [];
    let score = 0;
    let moves = START_MOVES;
    let selected = -1;
    let running = false;
    let animating = false;
    let finished = false;
    let lost = false;
    let overlayState = 'start';
    let dialogueState = { kind: 'hint' };
    let shownMilestones = new Set();
    let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    let toastTimer;
    let audioContext = null;
    let melodyCloseTimer;

    // Escena 3D opcional: si la página trae un lienzo #gameCanvas y la
    // configuración trae tema, el barrio vive sobre el tablero y recibe
    // un vecino nuevo con cada hito de la historia. Sin lienzo o sin
    // tema, el motor sigue funcionando solo con el tablero.
    const theme = config.theme || null;
    const sceneCanvas = document.getElementById('gameCanvas');
    let renderer = null;
    let neighbors = [];
    let sceneCompleted = false;
    let lastSceneTime = 0;
    const SHRINE_GOAL = { x: 0, z: -6 };
    const NEIGHBOR_ROBES = ['#c96a4a', '#5a7fb0', '#7a9a5b', '#b0623f', '#8a5a7a', '#4a7a8a'];
    const NEIGHBOR_SKINS = ['#eec39a', '#c98d64', '#8a5a3b', '#6b4230'];
    const NEIGHBOR_HAIRS = ['#2e2019', '#4a3423', '#17120e', '#5a4030'];
    const NEIGHBOR_SPOTS = [
      [-1.6, -3.2], [1.6, -3.2], [-2.6, -2.4],
      [2.6, -2.4], [-0.8, -2.2], [0.8, -2.2],
    ];

    function syncNeighborCount() {
      stage.dataset.neighbors = String(neighbors.length);
    }

    function spawnNeighbor() {
      const n = neighbors.length;
      const spot = NEIGHBOR_SPOTS[n % NEIGHBOR_SPOTS.length];
      neighbors.push({
        x: n % 2 === 0 ? -10 : 10,
        z: 2,
        tx: spot[0],
        tz: spot[1],
        robe: NEIGHBOR_ROBES[n % NEIGHBOR_ROBES.length],
        skin: NEIGHBOR_SKINS[n % NEIGHBOR_SKINS.length],
        hair: NEIGHBOR_HAIRS[n % NEIGHBOR_HAIRS.length],
        index: 60 + n,
        arrived: false,
      });
      syncNeighborCount();
    }

    function resetScene() {
      neighbors = [];
      sceneCompleted = false;
      syncNeighborCount();
    }

    function drawHouse(x, z, w, h, d) {
      renderer.draw('cube', [x, h / 2, z], [w, h, d], theme.wall);
      renderer.draw('cone', [x, h + 0.8, z], [w + 0.9, 1.6, d + 0.9], theme.roof);
      renderer.draw('cube', [x, 0.8, z + d / 2 + 0.04], [0.85, 1.6, 0.08], theme.door || '#7a4a30');
    }

    function drawScene(time) {
      if (!renderer) return;
      const delta = lastSceneTime ? Math.min(0.05, (time - lastSceneTime) / 1000) : 0;
      lastSceneTime = time;
      renderer.beginScene({ x: 0, y: 0, z: 7, vx: 0, vz: 0, vy: 0, facing: Math.PI }, time, Math.PI);
      renderer.draw('cube', [0, -0.5, -8], [70, 1, 70], theme.ground);
      renderer.draw('cube', [0, 0.02, 1], [6, 0.04, 10], theme.floor);
      drawHouse(-7, -4, 3.6, 2.2, 3.2);
      drawHouse(7.5, -5, 3.4, 2.2, 3);
      drawHouse(-8, 1, 3.2, 2.0, 2.8);
      renderer.drawTree(-11, 0, -2, 1);
      renderer.drawTree(11.5, 0, -3, 0.9);
      renderer.drawTree(-5.5, 0, 3.5, 0.8);
      renderer.drawTree(6, 0, 4, 0.85);
      renderer.drawTree(12, 0, 2, 1.1);
      renderer.drawShrine(SHRINE_GOAL, theme, time, sceneCompleted);
      renderer.drawFigure(
        { x: 2.8, z: -3.4, robe: '#2e2a26', skin: '#c98d64', hair: '#3a3a3a', accessory: 'cross', index: 50 },
        time,
      );
      for (const neighbor of neighbors) {
        if (!neighbor.arrived && delta > 0) {
          const dx = neighbor.tx - neighbor.x;
          const dz = neighbor.tz - neighbor.z;
          const dist = Math.hypot(dx, dz);
          const step = 2.0 * delta;
          if (dist <= step) {
            neighbor.x = neighbor.tx;
            neighbor.z = neighbor.tz;
            neighbor.arrived = true;
          } else {
            neighbor.x += (dx / dist) * step;
            neighbor.z += (dz / dist) * step;
          }
        }
        renderer.drawFigure(
          {
            x: neighbor.x, z: neighbor.z,
            robe: neighbor.robe, skin: neighbor.skin, hair: neighbor.hair,
            index: neighbor.index, singing: sceneCompleted,
          },
          time,
        );
      }
      if (sceneCompleted) renderer.drawEndingFx(theme, SHRINE_GOAL, time);
      window.requestAnimationFrame(drawScene);
    }

    if (theme && sceneCanvas && typeof window.Game3DRenderer === 'function') {
      try {
        renderer = new window.Game3DRenderer(sceneCanvas);
        window.requestAnimationFrame(drawScene);
      } catch (error) {
        renderer = null;
      }
    }
    syncNeighborCount();

    function text() { return strings[language]; }

    function index(row, col) { return row * COLS + col; }
    function rowOf(i) { return Math.floor(i / COLS); }
    function colOf(i) { return i % COLS; }
    function areAdjacent(a, b) {
      return Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1;
    }
    function randomType() { return Math.floor(Math.random() * TYPES.length); }

    function findMatches(b) {
      const tiles = new Set();
      const runs = [];
      for (let r = 0; r < ROWS; r++) {
        let runStart = 0;
        for (let c = 1; c <= COLS; c++) {
          if (c < COLS && b[index(r, c)] !== null && b[index(r, c)] === b[index(r, runStart)]) continue;
          const length = c - runStart;
          if (b[index(r, runStart)] !== null && length >= 3) {
            runs.push(length);
            for (let k = runStart; k < c; k++) tiles.add(index(r, k));
          }
          runStart = c;
        }
      }
      for (let c = 0; c < COLS; c++) {
        let runStart = 0;
        for (let r = 1; r <= ROWS; r++) {
          if (r < ROWS && b[index(r, c)] !== null && b[index(r, c)] === b[index(runStart, c)]) continue;
          const length = r - runStart;
          if (b[index(runStart, c)] !== null && length >= 3) {
            runs.push(length);
            for (let k = runStart; k < r; k++) tiles.add(index(k, c));
          }
          runStart = r;
        }
      }
      return { tiles, runs };
    }

    function hasPossibleMove(b) {
      for (let i = 0; i < CELLS; i++) {
        const r = rowOf(i);
        const c = colOf(i);
        const neighbors = [];
        if (c + 1 < COLS) neighbors.push(i + 1);
        if (r + 1 < ROWS) neighbors.push(i + COLS);
        for (const j of neighbors) {
          const copy = b.slice();
          const tmp = copy[i];
          copy[i] = copy[j];
          copy[j] = tmp;
          if (findMatches(copy).tiles.size > 0) return true;
        }
      }
      return false;
    }

    function generateBoard() {
      let candidate;
      do {
        candidate = Array.from({ length: CELLS }, randomType);
      } while (findMatches(candidate).tiles.size > 0 || !hasPossibleMove(candidate));
      return candidate;
    }

    function render(newCells) {
      const fresh = newCells || new Set();
      for (let i = 0; i < CELLS; i++) {
        const button = tileButtons[i];
        const type = board[i];
        button.textContent = type === null ? '' : TYPES[type].g;
        button.className = 'tile' +
          (type === null ? '' : ` tile-${type}`) +
          (i === selected ? ' is-selected' : '') +
          (fresh.has(i) ? ' is-new' : '');
      }
    }

    function updateHud() {
      progressCount.textContent = String(score);
      npcName.textContent = `${text().movesLabel}: ${moves}`;
      gameStatus.textContent = text().status(score, moves);
    }

    function milestoneText(milestone) {
      return language === 'en' ? milestone.en : milestone.es;
    }

    function checkMilestones() {
      const milestones = strings.milestones || [];
      let highest = -1;
      let freshCount = 0;
      milestones.forEach((milestone, i) => {
        if (!shownMilestones.has(i) && score >= milestone.at) {
          shownMilestones.add(i);
          freshCount++;
          if (i > highest) highest = i;
        }
      });
      if (highest >= 0) {
        dialogueState = { kind: 'milestone', milestoneIndex: highest };
        renderDialogue();
        showToast(milestoneText(milestones[highest]));
        for (let k = 0; k < freshCount; k++) spawnNeighbor();
      }
    }

    function renderDialogue() {
      if (dialogueState.kind === 'chain') {
        npcDialogue.textContent = text().chain(dialogueState.chain);
      } else if (dialogueState.kind === 'milestone') {
        const milestones = strings.milestones || [];
        const milestone = milestones[dialogueState.milestoneIndex];
        npcDialogue.textContent = milestone ? milestoneText(milestone) : text().hint;
      } else if (dialogueState.kind === 'finish') {
        npcDialogue.textContent = text().finishMessage;
      } else if (dialogueState.kind === 'lose') {
        npcDialogue.textContent = text().loseDetail(score);
      } else {
        npcDialogue.textContent = text().hint;
      }
    }

    function renderOverlay() {
      if (overlayState === 'finish') {
        overlayTitle.textContent = text().finishTitle;
        overlayMessage.textContent = text().finishMessage;
        playButton.textContent = text().restart;
      } else if (overlayState === 'lose') {
        overlayTitle.textContent = text().loseTitle;
        overlayMessage.textContent = text().loseDetail(score);
        playButton.textContent = text().retry;
      } else {
        overlayTitle.textContent = text().startTitle;
        overlayMessage.textContent = text().startMessage;
        playButton.textContent = text().start;
      }
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
      renderOverlay();
      updateHud();
      renderDialogue();
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

    function playMatchChime(chain) {
      if (!audioContext) return;
      const start = audioContext.currentTime + 0.02;
      const base = 72 + Math.min(chain - 1, 6) * 2;
      playTone(base, start, 0.16, 0.05);
      playTone(base + 7, start + 0.07, 0.24, 0.05);
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
      score = 0;
      moves = START_MOVES;
      selected = -1;
      running = false;
      animating = false;
      finished = false;
      lost = false;
      overlayState = 'start';
      dialogueState = { kind: 'hint' };
      shownMilestones = new Set();
      resetScene();
      board = generateBoard();
      endBanner.hidden = true;
      gameFrame.classList.remove('is-finished');
      renderOverlay();
      overlay.classList.remove('is-hidden');
      render();
      updateHud();
      renderDialogue();
    }

    function startGame() {
      if (finished || lost) resetGame();
      prepareAudio();
      running = true;
      overlay.classList.add('is-hidden');
    }

    function winGame() {
      finished = true;
      running = false;
      selected = -1;
      render();
      endBanner.hidden = false;
      gameFrame.classList.add('is-finished');
      overlayState = 'finish';
      renderOverlay();
      dialogueState = { kind: 'finish' };
      renderDialogue();
      gameStatus.textContent = text().finishTitle;
      playMelody();
      sceneCompleted = true;
      spawnNeighbor();
      spawnNeighbor();
    }

    function loseGame() {
      lost = true;
      running = false;
      selected = -1;
      render();
      overlayState = 'lose';
      renderOverlay();
      overlay.classList.remove('is-hidden');
      dialogueState = { kind: 'lose' };
      renderDialogue();
      updateHud();
    }

    function collapseAndRefill() {
      const fresh = new Set();
      for (let c = 0; c < COLS; c++) {
        const kept = [];
        for (let r = ROWS - 1; r >= 0; r--) {
          const value = board[index(r, c)];
          if (value !== null) kept.push(value);
        }
        let r = ROWS - 1;
        for (const value of kept) {
          board[index(r, c)] = value;
          r--;
        }
        while (r >= 0) {
          board[index(r, c)] = randomType();
          fresh.add(index(r, c));
          r--;
        }
      }
      return fresh;
    }

    async function resolveBoard() {
      let chain = 0;
      let matches = findMatches(board);
      while (matches.tiles.size > 0) {
        chain++;
        let gained = matches.tiles.size * 10 * chain;
        matches.runs.forEach((length) => {
          if (length >= 5) gained += 100;
          else if (length === 4) gained += 40;
        });
        score += gained;
        updateHud();
        playMatchChime(chain);
        if (chain >= 2) {
          dialogueState = { kind: 'chain', chain };
          renderDialogue();
        }
        checkMilestones();
        matches.tiles.forEach((i) => tileButtons[i].classList.add('is-clearing'));
        await wait(180);
        matches.tiles.forEach((i) => { board[i] = null; });
        const fresh = collapseAndRefill();
        render(fresh);
        await wait(140);
        matches = findMatches(board);
      }
      moves--;
      updateHud();
      if (score >= GOAL_SCORE) {
        winGame();
        return;
      }
      if (moves <= 0) {
        loseGame();
        return;
      }
      if (!hasPossibleMove(board)) {
        showToast(text().shuffle);
        board = generateBoard();
        render(new Set(board.keys()));
        await wait(200);
      }
      animating = false;
    }

    async function swapTiles(a, b) {
      animating = true;
      const tmp = board[a];
      board[a] = board[b];
      board[b] = tmp;
      render();
      if (findMatches(board).tiles.size === 0) {
        await wait(160);
        const back = board[a];
        board[a] = board[b];
        board[b] = back;
        render();
        tileButtons[a].classList.add('is-shake');
        tileButtons[b].classList.add('is-shake');
        await wait(280);
        tileButtons[a].classList.remove('is-shake');
        tileButtons[b].classList.remove('is-shake');
        animating = false;
        return;
      }
      await resolveBoard();
    }

    function onTileClick(i) {
      if (!running || animating || finished || lost) return;
      if (selected === -1) {
        selected = i;
        render();
        return;
      }
      if (selected === i) {
        selected = -1;
        render();
        return;
      }
      if (!areAdjacent(selected, i)) {
        selected = i;
        render();
        return;
      }
      const first = selected;
      selected = -1;
      swapTiles(first, i);
    }

    function buildTiles() {
      stage.innerHTML = '';
      tileButtons = [];
      for (let i = 0; i < CELLS; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tile';
        button.setAttribute('aria-label', `Ficha ${i + 1}`);
        button.addEventListener('click', () => onTileClick(i));
        stage.appendChild(button);
        tileButtons.push(button);
      }
    }

    function keyDown(event) {
      if (event.code === 'KeyR') {
        resetGame();
        startGame();
        return;
      }
      if (event.code === 'Enter' && !running && !finished) startGame();
    }

    playButton.addEventListener('click', startGame);
    endRestartButton.addEventListener('click', startGame);
    languageToggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
    window.addEventListener('keydown', keyDown);

    buildTiles();
    resetGame();
    setLanguage(language);
  };
})();
