const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cuentosPath = path.join(root, 'data', 'ninos-cuentos.json');
const dataDir = path.join(root, 'data');
const batchStatePath = path.join(root, 'scripts', 'ninos-batch-state.json');
const checklistPath = path.join(root, 'scripts', 'ninos-systematic-checklist.json');

const curatedFactsBySaintId = {
  sanmartindelporres: [
    'Martin de Porres nacio en Lima en 1579 y desde pequeno mostro un gran amor por los pobres y los enfermos.',
    'En el convento dominico sirvio como hermano humilde, cuidando a los enfermos con paciencia y alegria.',
    'Compartia su comida y su tiempo con quienes no tenian nada, y por eso en Lima lo llamaban amigo de todos.',
    'La Iglesia lo canonizo en 1962 y hoy es patrono de la paz y de la caridad concreta.'
  ],
  sanmartin: [
    'San Martin de Tours nacio alrededor del ano 316 y fue soldado antes de responder al llamado de Dios.',
    'Siendo joven compartio su capa con un hombre pobre que temblaba de frio, gesto que lo hizo muy querido.',
    'Despues se hizo monje y obispo de Tours, guiando a su pueblo con sencillez y misericordia.',
    'Su fiesta se celebra el 11 de noviembre y su capa partida recuerda que el amor se demuestra con obras.'
  ],
  sanmaximiliano: [
    'San Maximiliano Kolbe nacio en Polonia en 1894 y desde joven quiso amar a Jesus por medio de Maria.',
    'Fundo la Milicia de la Inmaculada para anunciar el Evangelio con valentia y medios modernos.',
    'Durante la Segunda Guerra Mundial fue llevado a Auschwitz y ofrecio su vida para salvar a otro prisionero.',
    'Murio el 14 de agosto de 1941 y fue canonizado en 1982 como martir de la caridad.'
  ],
  santacoleta: [
    'Santa Coleta de Corbie nacio en 1381 y busco a Dios con una vida de oracion y sencillez.',
    'Con gran valentia ayudo a reformar comunidades de Clarisas para volver a la pobreza del Evangelio.',
    'Viajo por distintas regiones fundando y renovando conventos con un espiritu de paz y humildad.',
    'Murio en 1447 y hoy es recordada como una gran reformadora franciscana llena de ternura y firmeza.'
  ]
};

function parseArgs(argv) {
  const opts = {
    batchSize: 99,
    batchIndex: 0,
    next: false,
    status: false,
    ids: []
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--batch-size' || a === '-n') {
      opts.batchSize = Number(argv[i + 1] || 99);
      i += 1;
      continue;
    }
    if (a === '--batch-index' || a === '-i') {
      opts.batchIndex = Number(argv[i + 1] || 0);
      i += 1;
      continue;
    }
    if (a === '--next') {
      opts.next = true;
      continue;
    }
    if (a === '--status') {
      opts.status = true;
      continue;
    }
    if (a === '--ids') {
      const raw = String(argv[i + 1] || '');
      opts.ids = raw.split(',').map(x => x.trim()).filter(Boolean);
      i += 1;
      continue;
    }
  }

  if (!Number.isFinite(opts.batchSize) || opts.batchSize < 1) opts.batchSize = 3;
  if (!Number.isFinite(opts.batchIndex) || opts.batchIndex < 0) opts.batchIndex = 0;
  opts.batchSize = Math.floor(opts.batchSize);
  opts.batchIndex = Math.floor(opts.batchIndex);
  return opts;
}

function readBatchCursor() {
  const state = readJsonSafe(batchStatePath);
  const cursor = Number(state?.nextIndex || 0);
  if (!Number.isFinite(cursor) || cursor < 0) return 0;
  return Math.floor(cursor);
}

function writeBatchCursor(nextIndex, total) {
  const safeNext = Math.max(0, Math.floor(nextIndex));
  const payload = {
    nextIndex: safeNext,
    total,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(batchStatePath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function simpleHash(text) {
  const str = normalizeText(text).slice(0, 1200);
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(16);
}

function hashNumber(text) {
  const str = normalizeText(text);
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h << 5) + h) + str.charCodeAt(i);
  }
  return Math.abs(h >>> 0);
}

function pickBySeed(arr, seed, offset = 0) {
  if (!Array.isArray(arr) || !arr.length) return '';
  return arr[(seed + offset) % arr.length];
}

function loadChecklist(cuentosList) {
  const existing = readJsonSafe(checklistPath);
  const map = new Map();

  if (existing && Array.isArray(existing.items)) {
    for (const it of existing.items) {
      if (it && it.id) map.set(it.id, it);
    }
  }

  for (const c of cuentosList) {
    if (!map.has(c.id)) {
      map.set(c.id, {
        id: c.id,
        saintId: c.saintId,
        titleEs: c?.title?.es || c.id,
        status: 'pending',
        processedBatches: [],
        lastProcessedAt: null,
        factsUsed: 0,
        source: 'none',
        storyHash: null,
        factPreview: []
      });
    }
  }

  return {
    version: 1,
    total: cuentosList.length,
    updatedAt: new Date().toISOString(),
    items: cuentosList.map(c => map.get(c.id))
  };
}

function writeChecklist(checklist) {
  checklist.updatedAt = new Date().toISOString();
  fs.writeFileSync(checklistPath, JSON.stringify(checklist, null, 2) + '\n', 'utf8');
}

function printChecklistStatus(checklist, cursor) {
  const done = checklist.items.filter(x => x.status === 'done').length;
  const pending = checklist.items.filter(x => x.status !== 'done').length;
  const nextByCursor = checklist.items.slice(cursor, cursor + 6).map(x => x.id);
  const nextPending = checklist.items.filter(x => x.status !== 'done').slice(0, 6).map(x => x.id);
  console.log('Checklist status');
  console.log('Done:', done);
  console.log('Pending:', pending);
  console.log('Cursor:', cursor);
  console.log('Next IDs by cursor:', nextByCursor.join(', '));
  console.log('Next pending IDs:', nextPending.join(', '));
}

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function fixMojibake(text) {
  return String(text || '')
    .replace(/Ã¡/g, 'a')
    .replace(/Ã©/g, 'e')
    .replace(/Ã­/g, 'i')
    .replace(/Ã³/g, 'o')
    .replace(/Ãº/g, 'u')
    .replace(/Ã±/g, 'n')
    .replace(/Ã/g, 'A')
    .replace(/Ã‰/g, 'E')
    .replace(/Ã/g, 'I')
    .replace(/Ã“/g, 'O')
    .replace(/Ãš/g, 'U')
    .replace(/Â/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€\x9d/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  const cleaned = fixMojibake(text).replace(/\r/g, '\n').replace(/\n+/g, ' ');
  if (!cleaned) return [];
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function isHeadlineLike(s) {
  if (!s) return true;
  if (s.length < 35 || s.length > 200) return true;
  if (/^[A-Z0-9\s\-:,.'()]+$/.test(s) && s.length > 50) return true;
  if (/\b(dia|day|letania|litany|novena|misterio|mystery|oracion final|final prayer)\b/i.test(s)) return true;
  if (/^\d+\./.test(s)) return true;
  return false;
}

function isNoisy(s) {
  const t = String(s || '');
  if (!t) return true;
  if ((t.match(/[0-9]/g) || []).length > 10) return true;
  if (/[_{}<>]/.test(t)) return true;
  if (/\b[A-ZÁÉÍÓÚÑ]{3,}(?:\s+[A-ZÁÉÍÓÚÑ]{3,}){2,}\b/.test(t)) return true;
  if (/\b(telecom|deuterocan|hagiograf|contrarreforma|patrist|martyrology|dogma)\b/i.test(t)) return true;
  if (/\b(dispar|sangre|mutil|tortur|shot|blood|mutilat|tortur)\b/i.test(t)) return true;
  return false;
}

function scoreFact(s) {
  let score = 0;
  const low = s.toLowerCase();
  if (/\b\d{3,4}\b/.test(low)) score += 3;
  if (/\b(nacio|murio|canoniz|fundo|vivio|predic|aparec|naci[oó]|born|died|founded|preach|appeared|lived)\b/.test(low)) score += 2;
  if (/\b(italia|francia|mexico|portugal|roma|asis|padua|lisboa|nazaret|jerusalen|lycia|syracuse)\b/i.test(low)) score += 1;
  return score;
}

function dedupe(arr) {
  const out = [];
  const seen = new Set();
  for (const a of arr) {
    const k = a.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a);
  }
  return out;
}

function extractFactsFromSaint(saint) {
  const sources = [];
  if (saint?.history?.es) sources.push(saint.history.es);
  if (saint?.miracles?.available && saint?.miracles?.es) sources.push(saint.miracles.es);
  if (saint?.jaculatoria?.es) sources.push(saint.jaculatoria.es);

  const facts = [];
  for (const src of sources) {
    for (const s of splitSentences(src)) {
      const clean = fixMojibake(s).replace(/["“”]/g, '').trim();
      if (isHeadlineLike(clean)) continue;
      if (isNoisy(clean)) continue;
      if (clean.length < 35 || clean.length > 180) continue;
      if (!/[.!?]$/.test(clean)) continue;
      facts.push(clean);
    }
  }

  // Keep source order to preserve the saint's real timeline as much as possible.
  const ordered = dedupe(facts).slice(0, 6);
  return ordered;
}

function sanitizeFactForStory(text) {
  let t = fixMojibake(text || '');
  t = t.replace(/^\s*[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,}){2,}\s*/g, '');
  t = t.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function extractFallbackFacts(oldStory) {
  const facts = [];
  const parts = String(oldStory || '').split(/\n\n+/).map(x => x.trim()).filter(Boolean);
  for (const p of parts) {
    const m = p.match(/^(Un dia paso algo importante|Con el tiempo|Despues|Tambien recordamos que):\s*(.+)$/i);
    const body = m ? m[2].trim() : p;
    const clean = fixMojibake(body);
    if (isHeadlineLike(clean) || isNoisy(clean)) continue;
    if (clean.length < 35 || clean.length > 180) continue;
    if (!/[.!?]$/.test(clean)) continue;
    facts.push(clean);
  }
  return dedupe(facts).slice(0, 4);
}

function buildStoryEs(title, hook, facts) {
  const safeTitle = fixMojibake(title || 'este amigo de Dios');
  const safeHook = fixMojibake(hook || 'Dios siempre nos cuida').replace(/\.+$/, '');
  const f = (facts.length ? facts : ['Con su ejemplo, muchas personas aprendieron a confiar en Dios.'])
    .map(sanitizeFactForStory)
    .filter(Boolean);
  const seed = hashNumber(`${safeTitle}|${safeHook}|${f.join('|')}`);

  const openings = [
    'Esta noche, en calma, vamos a escuchar un cuento para descansar el corazon.',
    'Cuando el dia termina, llega este momento tranquilo para escuchar una historia que da paz.',
    'Baja un poco la voz del mundo y abre el corazon: hoy toca un cuento para dormir con esperanza.',
    'Haz una respiracion lenta y suelta el cansancio: empieza un cuento de fe para esta noche.'
  ];
  const settle = [
    'Acomodate, respira despacio, y deja que el dia se vaya quedando en silencio.',
    'Pon tus manos en calma y deja que cada respiracion te ayude a descansar.',
    'Cierra los ojos un momento y siente como la noche te abraza con suavidad.',
    'Deja a un lado las preocupaciones: ahora todo puede ir entrando en paz.'
  ];
  const timeLinks = [
    'Al principio',
    'Despues',
    'Con el paso del tiempo',
    'Mas adelante',
    'En otro momento de su vida',
    'Al final de su camino en la tierra'
  ];
  const reflections = [
    `La historia de ${safeTitle} nos ensena que la fe se demuestra con decisiones concretas.`,
    `Escuchar la vida de ${safeTitle} nos recuerda que Dios puede hacer mucho con un corazon disponible.`,
    `${safeTitle} nos deja una leccion sencilla y profunda: amar de verdad incluso cuando cuesta.`,
    `El ejemplo de ${safeTitle} sigue vivo porque muestra que la santidad se construye dia a dia.`
  ];
  const practicals = [
    'Tu tambien puedes vivir algo parecido en pequeno: ayudar en casa, hablar con respeto y rezar con confianza.',
    'Hoy puedes empezar con pasos concretos: obedecer con alegria, pedir perdon y compartir con quien necesita.',
    'Manana puedes imitar este ejemplo con actos simples: decir la verdad, cuidar a otros y confiar en Dios.',
    'El camino empieza en lo cotidiano: paciencia, bondad y una oracion sincera antes de dormir.'
  ];
  const nightClosings = [
    'Respira una vez mas. Tu cuerpo descansa, tu mente se calma, y la noche te cuida.',
    'Ahora deja que el sueno llegue despacio: Dios te acompana y tu corazon puede descansar.',
    'Todo esta bien por esta noche: reposa con paz y confia en que Dios va contigo.',
    'Con una respiracion suave, entrega este dia a Dios y descansa bajo su cuidado.'
  ];
  const finalBlessings = [
    'Que tu angel de la guarda te acompane, que Maria te cubra con su ternura y que Jesus te regale paz.',
    'Que Jesus bendiga tu sueno, que Maria te abrace y que los angeles cuiden tu descanso.',
    'Que Dios llene de paz tu noche y te despierte con alegria para hacer el bien manana.',
    'Que la luz de Dios cuide tu descanso y te de un corazon valiente para el nuevo dia.'
  ];

  const p = [];
  p.push(pickBySeed(openings, seed, 0));
  p.push(pickBySeed(settle, seed, 1));
  p.push(`Hoy conoceremos a ${safeTitle}.`);
  p.push(`Recuerda esta idea: ${safeHook}.`);
  p.push(`${safeTitle} tuvo una vida real y diferente, con hechos que marcaron su camino con Dios.`);
  p.push('Escuchemos su historia en orden, como un viaje que fue creciendo paso a paso.');

  const factLines = [];
  for (let i = 0; i < f.length; i += 1) {
    const link = pickBySeed(timeLinks, seed, i + 2);
    factLines.push(`${link}, ${f[i].charAt(0).toLowerCase()}${f[i].slice(1)}`);
  }
  p.push(factLines.join(' '));

  p.push(pickBySeed(reflections, seed, 9));
  p.push(pickBySeed(practicals, seed, 10));
  p.push(`Por eso, cuando pensamos en ${safeTitle}, recordamos que la santidad no copia historias: responde al llamado personal de Dios.`);
  p.push('Si hoy algo te costo, manana puedes volver a intentarlo con mas amor y mas paciencia.');
  p.push(`Si hoy te sentiste cansado o preocupado, puedes rezar: "Jesus, ensename a amar como ${safeTitle}".`);
  p.push('Ahora imagina que la noche se vuelve suave y que tu corazon guarda esta historia como una luz pequena.');
  p.push('Mañana, esa luz puede ayudarte a hacer el bien en casa, en la escuela y con tus amigos.');
  p.push(pickBySeed(nightClosings, seed, 11));
  p.push(pickBySeed(finalBlessings, seed, 12));
  p.push(`Antes de dormir, dile a Dios: "Quiero amar como ${safeTitle}".`);
  p.push('Buenas noches. Manana sera un nuevo dia para hacer el bien con alegria y esperanza.');

  return p.join('\n\n');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const cuentos = readJsonSafe(cuentosPath);
  if (!cuentos || !Array.isArray(cuentos.cuentos)) {
    throw new Error('No se pudo leer data/ninos-cuentos.json');
  }
  const checklist = loadChecklist(cuentos.cuentos);
  const cursorFromState = readBatchCursor();

  // Keep checklist compatible with prior runs done before checklist existed.
  if (cursorFromState > 0) {
    for (let i = 0; i < Math.min(cursorFromState, checklist.items.length); i += 1) {
      const it = checklist.items[i];
      if (it.status !== 'done') {
        it.status = 'done';
        it.source = it.source === 'none' ? 'bootstrap' : it.source;
      }
    }
  }

  if (opts.status) {
    writeChecklist(checklist);
    printChecklistStatus(checklist, cursorFromState);
    return;
  }

  const total = cuentos.cuentos.length;
  const baseIndex = opts.next ? readBatchCursor() : opts.batchIndex * opts.batchSize;
  const start = Math.min(Math.max(0, baseIndex), total);
  const end = Math.min(total, start + opts.batchSize);

  const targets = opts.ids.length
    ? cuentos.cuentos.filter(c => opts.ids.includes(c.id))
    : cuentos.cuentos.slice(start, end);

  const batchLabel = opts.ids.length
    ? `ids:${targets.map(x => x.id).join(',')}`
    : `${start}-${Math.max(start, end) - 1}`;

  let withSaintFacts = 0;
  let withFallbackFacts = 0;
  let genericFallback = 0;
  let processed = 0;

  for (const c of targets) {
    const saintPath = path.join(dataDir, `${c.saintId}.json`);
    const saint = readJsonSafe(saintPath);

    let facts = saint ? extractFactsFromSaint(saint) : [];
    let source = 'saint';
    if (facts.length >= 2) {
      withSaintFacts += 1;
    } else {
      const curated = curatedFactsBySaintId[c.saintId] || [];
      if (curated.length >= 2) {
        facts = curated.slice(0, 6);
        withSaintFacts += 1;
        source = 'curated';
      } else {
        const fallback = extractFallbackFacts(c.story?.es || '');
        if (fallback.length) {
          facts = dedupe([...facts, ...fallback]).slice(0, 4);
          withFallbackFacts += 1;
          source = 'fallback';
        } else {
          genericFallback += 1;
          source = 'generic';
        }
      }
    }

    c.story = c.story || {};
    c.story.es = buildStoryEs(c.title?.es || c.id, c.hook?.es || '', facts);
    c.readMin = 15;
    c.bedtime = true;

    const entry = checklist.items.find(x => x.id === c.id);
    if (entry) {
      entry.status = 'done';
      entry.lastProcessedAt = new Date().toISOString();
      entry.factsUsed = facts.length;
      entry.source = source;
      entry.storyHash = simpleHash(c.story.es);
      entry.factPreview = facts.slice(0, 3);
      if (!Array.isArray(entry.processedBatches)) entry.processedBatches = [];
      entry.processedBatches.push(batchLabel);
      entry.processedBatches = dedupe(entry.processedBatches).slice(-20);
    }

    processed += 1;
  }

  fs.writeFileSync(cuentosPath, JSON.stringify(cuentos, null, 2) + '\n', 'utf8');
  if (!opts.ids.length) {
    writeBatchCursor(end, total);
  }
  writeChecklist(checklist);

  const done = checklist.items.filter(x => x.status === 'done').length;
  const pending = checklist.items.filter(x => x.status !== 'done').length;

  console.log('Systematic correction batch complete:', batchLabel);
  console.log('Batch size processed:', targets.length);
  console.log('Total stories:', total);
  if (!opts.ids.length) {
    console.log('Next cursor index:', end);
  }
  console.log('Stories with saint facts:', withSaintFacts);
  console.log('Stories with fallback facts:', withFallbackFacts);
  console.log('Stories with generic fallback:', genericFallback);
  console.log('Checklist processed this run:', processed);
  console.log('Checklist done:', done);
  console.log('Checklist pending:', pending);
  console.log('Processed IDs:', targets.map(x => x.id).join(', '));
  console.log('Run next batch:', 'node scripts/systematic-correct-ninos-cuentos.js --next --batch-size 3');
  console.log('Check status:', 'node scripts/systematic-correct-ninos-cuentos.js --status');
}

main();
