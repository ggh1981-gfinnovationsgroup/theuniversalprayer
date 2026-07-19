const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cuentosPath = path.join(root, 'data', 'ninos-cuentos.json');
const dataDir = path.join(root, 'data');

const ES_WORDS_PER_MINUTE = 90;
const TARGET_MIN_WORDS = 1350;
const TARGET_MAX_WORDS = 1650;

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function fixMojibake(text) {
  return String(text || '')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ãí|Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã/g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã/g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/\?/g, 'ñ')
    .replace(/Â/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€\x9d/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSpanishLexicon(text) {
  let t = fixMojibake(text || '');
  const rules = [
    [/\bninos\b/gi, 'niños'],
    [/\bnino\b/gi, 'niño'],
    [/\bpequenos\b/gi, 'pequeños'],
    [/\bpequeno\b/gi, 'pequeño'],
    [/\banos\b/gi, 'años'],
    [/\bano\b/gi, 'año'],
    [/\bsenora\b/gi, 'señora'],
    [/\bsenor\b/gi, 'señor'],
    [/\bmanana\b/gi, 'mañana'],
    [/\bcompaneros\b/gi, 'compañeros'],
    [/\bcompanero\b/gi, 'compañero'],
    [/\bcompania\b/gi, 'compañía'],
    [/\bensenanza\b/gi, 'enseñanza'],
    [/\benseno\b/gi, 'enseñó'],
    [/\bensena\b/gi, 'enseña'],
    [/\bensenar\b/gi, 'enseñar'],
    [/\bnacio\b/gi, 'nació'],
    [/\bmurio\b/gi, 'murió'],
    [/\bcanonizo\b/gi, 'canonizó'],
    [/\bbeatifico\b/gi, 'beatificó'],
    [/\bcorazon\b/gi, 'corazón'],
    [/\boracion\b/gi, 'oración'],
    [/\bmision\b/gi, 'misión'],
    [/\bconversion\b/gi, 'conversión'],
    [/\btambien\b/gi, 'también'],
    [/\bdespues\b/gi, 'después'],
    [/\bademas\b/gi, 'además'],
    [/\bmas\b/gi, 'más'],
    [/\bsi\b(?=\s+te\s+parece\b)/gi, 'sí'],
    [/\bjesus\b/gi, 'Jesús'],
    [/\bmaria\b/gi, 'María'],
    [/\bdia\b/gi, 'día'],
    [/\bdias\b/gi, 'días']
  ];
  for (const [rx, repl] of rules) t = t.replace(rx, repl);
  return t;
}

function splitSentences(text) {
  const cleaned = normalizeSpanishLexicon(text)
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return [];
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function isUsableFact(sentence) {
  const s = sentence.trim();
  if (!s) return false;
  if (s.length < 45 || s.length > 220) return false;
  if (/^\d+\./.test(s)) return false;
  if (/\b(día|day|novena|litany|letanía|intercesión en la vida de los fieles)\b/i.test(s)) return false;
  if (/^[A-ZÁÉÍÓÚÑ\s\-:]+$/.test(s) && s.length > 30) return false;
  return true;
}

function softenForChildren(sentence) {
  let s = sentence;
  s = s.replace(/\bfue ejecutad[oa]\b/gi, 'entregó su vida por su fe');
  s = s.replace(/\bfue martirizad[oa]\b/gi, 'permaneció fiel a Jesús hasta el final');
  s = s.replace(/\bmartirio\b/gi, 'testimonio de fe');
  s = s.replace(/\bpersecuci[oó]n\b/gi, 'tiempo difícil');
  s = s.replace(/\basesinad[oa]\b/gi, 'atacado por su fe');
  s = s.replace(/\bsangr[eé]\b/gi, 'dolor');
  s = s.replace(/\bdecapitad[oa]\b/gi, 'llevado al final de su testimonio');
  s = s.replace(/\btorturad[oa]\b/gi, 'muy probado');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function dedupe(arr) {
  const out = [];
  const seen = new Set();
  for (const item of arr) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function seedFromId(id) {
  let h = 2166136261;
  for (const ch of id) {
    h ^= ch.charCodeAt(0);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
}

function pick(arr, seed, offset) {
  return arr[(seed + offset) % arr.length];
}

function extractFactsFromSaint(saint) {
  const sourceBlocks = [
    saint?.history?.es || '',
    saint?.miracles?.available ? (saint?.miracles?.es || '') : '',
    saint?.specialty?.es ? `Su servicio principal fue: ${saint.specialty.es}.` : '',
    saint?.feast_day?.es ? `Su fiesta se celebra el ${saint.feast_day.es}.` : ''
  ].filter(Boolean);

  const sentences = [];
  for (const block of sourceBlocks) {
    for (const s of splitSentences(block)) {
      if (!isUsableFact(s)) continue;
      sentences.push(softenForChildren(s));
    }
  }

  return dedupe(sentences).slice(0, 14);
}

function wordsCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function estimateReadMin(storyEs) {
  return Math.max(1, Math.ceil(wordsCount(storyEs) / ES_WORDS_PER_MINUTE));
}

function shortSaintName(fullTitle) {
  return String(fullTitle || '')
    .replace(/^San\s+/i, '')
    .replace(/^Santa\s+/i, '')
    .replace(/^Santo\s+/i, '')
    .replace(/^Nuestra Señora del?\s+/i, '')
    .trim();
}

function buildLongStory(cuento, saintFacts) {
  const seed = seedFromId(cuento.id || cuento.saintId || cuento.title?.es || 'historia');
  const title = normalizeSpanishLexicon(cuento.title?.es || 'este amigo de Dios');
  const hook = normalizeSpanishLexicon(cuento.hook?.es || 'una historia para aprender a amar a Dios');
  const saintShort = shortSaintName(title) || 'este santo';

  const openings = [
    'La noche está tranquila. Respira despacio, acomódate en tu cama y deja que el día se vuelva suave como una manta tibia. Esta historia está hecha para que descanses en paz mientras tu corazón aprende algo bueno.',
    'Antes de dormir, vamos a bajar el ruido del día. Inhala profundo, suelta el aire despacito, y escucha: hoy conocerás una historia real que puede llenarte de esperanza.',
    'Cuando llega la noche, el mundo parece hablar más bajito. Este es un buen momento para escuchar una historia verdadera, una de esas historias que te ayudan a dormir con el corazón en calma.'
  ];

  const transitions = [
    'Ahora vamos paso a paso, como quien camina sin prisa por un sendero seguro.',
    'Escucha con atención: cada parte de esta historia tiene una luz para tu vida.',
    'No hace falta correr; iremos despacio para entender lo que Dios hizo en esta persona.'
  ];

  const reflectiveBlocks = [
    'A veces creemos que para hacer el bien hay que hacer cosas enormes, pero no siempre es así. Muchas veces el bien empieza en detalles pequeños: una palabra amable, una ayuda silenciosa, una disculpa sincera, una oración corta hecha con fe.',
    'Quizá tú también has tenido días difíciles: días en que algo no sale, en que alguien te hiere, o en que te cuesta obedecer. Esta historia te recuerda que Dios no se aleja en esos momentos; al contrario, se acerca con más ternura.',
    'Las personas santas no nacieron perfectas. Tuvieron cansancio, dudas, errores y pruebas. Lo que las hizo diferentes fue que no se rindieron: volvieron a empezar, confiaron en Dios y eligieron amar una vez más.',
    'Cuando alguien vive para Dios, también aprende a mirar a los demás con compasión. Eso significa no burlarse, no humillar, no pasar de largo cuando otro sufre. Significa construir paz, aun cuando nadie esté aplaudiendo.',
    'Si miras bien, esta historia no trata solo del pasado. También habla de ti: de cómo puedes crecer por dentro, de cómo puedes ser valiente para hacer lo correcto y de cómo puedes cuidar a quienes te rodean.'
  ];

  const bedtimeClosings = [
    `Antes de cerrar los ojos, dile a Jesús en tu interior: "Quiero aprender a amar como ${saintShort}". No necesitas palabras perfectas; Dios escucha la sinceridad de tu corazón.`,
    `Esta noche, guarda una promesa pequeña: mañana harás un acto de bondad en silencio. Así, poco a poco, tu vida también se vuelve una historia bonita para Dios.`,
    `Si algo te preocupa, entrégaselo a Jesús ahora mismo. Pídele paz para descansar y fuerza para mañana. Tu ángel de la guarda te acompaña, y Dios no te suelta de la mano.`
  ];

  const paragraphs = [];
  paragraphs.push(`Esta noche vamos a escuchar la historia de ${title}.`);
  paragraphs.push(pick(openings, seed, 0));
  paragraphs.push(`La idea central de hoy es esta: ${hook}.`);
  paragraphs.push(pick(transitions, seed, 1));

  const factLeadins = [
    'Primero',
    'Después',
    'Más adelante',
    'Con el paso del tiempo',
    'En otro momento importante',
    'También recordamos que',
    'Hacia el final de su camino',
    'Y todo esto dejó una huella'
  ];

  const facts = saintFacts.length ? saintFacts : [
    `${title} vivió una vida real, con decisiones valientes y una fe que ayudó a muchas personas.`,
    `Su ejemplo sigue vivo porque enseña a amar a Dios y a servir a los demás con alegría.`
  ];

  for (let i = 0; i < facts.length; i += 1) {
    const lead = factLeadins[i % factLeadins.length];
    const sentence = facts[i];
    paragraphs.push(`${lead}, ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`);
    if (i % 2 === 1) {
      paragraphs.push(pick(reflectiveBlocks, seed, i + 2));
    }
  }

  paragraphs.push(`Lo más bonito de ${title} es que su historia no se queda en libros antiguos: sigue inspirando a niños, familias, educadores y comunidades enteras a vivir con más fe y más amor.`);
  paragraphs.push(`Piensa un momento en tu propio día: ¿dónde puedes parecerte a ${saintShort}? Puede ser en la escuela, en casa, con tus hermanos, con tus amigos o con alguien que se sienta solo.`);

  while (wordsCount(paragraphs.join('\n\n')) < TARGET_MIN_WORDS) {
    paragraphs.push(pick(reflectiveBlocks, seed, paragraphs.length + 7));
    paragraphs.push(`Cuando recuerdes a ${saintShort}, recuerda también esto: la santidad crece en lo cotidiano, en actos humildes repetidos con amor, paciencia y confianza en Dios.`);
    if (wordsCount(paragraphs.join('\n\n')) > TARGET_MAX_WORDS) break;
  }

  paragraphs.push(`Para mañana, puedes hacer algo concreto: escoger una obra buena sencilla, cumplirla con alegría y ofrecérsela a Jesús por alguien que necesite ayuda.`);
  paragraphs.push(pick(bedtimeClosings, seed, 13));
  paragraphs.push('Buenas noches. Descansa en paz. Mañana será un nuevo día para amar mejor.');

  return normalizeSpanishLexicon(paragraphs.join('\n\n'));
}

function deriveMoral(storyEs) {
  const text = storyEs.toLowerCase();
  if (/(pobre|necesit|caridad|servir a los dem[aá]s)/.test(text)) return 'Amar a Jesús se demuestra cuidando al que más lo necesita.';
  if (/(virgen|maría|rosario)/.test(text)) return 'Con María aprendemos a confiar más en Jesús cada día.';
  if (/(familia|madre|padre|hogar)/.test(text)) return 'La santidad también se aprende en casa, con amor y paciencia.';
  return 'La santidad crece paso a paso, con fe, bondad y perseverancia.';
}

function deriveActivity(storyEs) {
  const text = storyEs.toLowerCase();
  if (/(pobre|necesit|caridad)/.test(text)) return 'Comparte hoy algo tuyo con alegría y en silencio.';
  if (/(virgen|maría|rosario)/.test(text)) return 'Reza hoy un Ave María por una persona que esté sufriendo.';
  if (/(familia|hogar)/.test(text)) return 'Haz una tarea en casa sin quejarte y ofrécela a Dios.';
  return 'Haz hoy una obra buena en secreto y entrégasela a Jesús.';
}

function main() {
  const cuentosJson = readJsonSafe(cuentosPath);
  if (!cuentosJson || !Array.isArray(cuentosJson.cuentos)) {
    throw new Error('No se pudo leer data/ninos-cuentos.json');
  }

  const report = [];

  for (const cuento of cuentosJson.cuentos) {
    const saintPath = path.join(dataDir, `${cuento.saintId}.json`);
    const saint = readJsonSafe(saintPath);
    const facts = saint ? extractFactsFromSaint(saint) : [];

    const longStoryEs = buildLongStory(cuento, facts);

    cuento.story = cuento.story || {};
    cuento.story.es = longStoryEs;
    cuento.moral = cuento.moral || {};
    cuento.activity = cuento.activity || {};
    cuento.moral.es = deriveMoral(longStoryEs);
    cuento.activity.es = deriveActivity(longStoryEs);
    cuento.readMin = estimateReadMin(longStoryEs);
    cuento.bedtime = true;

    report.push({
      id: cuento.id,
      words: wordsCount(longStoryEs),
      readMin: cuento.readMin,
      factsUsed: facts.length
    });
  }

  fs.writeFileSync(cuentosPath, JSON.stringify(cuentosJson, null, 2) + '\n', 'utf8');

  const mins = report.map(r => r.readMin);
  const words = report.map(r => r.words);
  const below15 = report.filter(r => r.readMin < 15);
  console.log('Expanded stories:', report.length);
  console.log('Min words:', Math.min(...words));
  console.log('Max words:', Math.max(...words));
  console.log('Avg words:', Math.round(words.reduce((a, b) => a + b, 0) / words.length));
  console.log('Min readMin:', Math.min(...mins));
  console.log('Max readMin:', Math.max(...mins));
  console.log('Below 15 min:', below15.length);
  if (below15.length) {
    for (const item of below15.slice(0, 12)) {
      console.log(`- ${item.id}: words=${item.words}, readMin=${item.readMin}`);
    }
  }
}

main();
