const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'ninos-cuentos.json');

const INTRO_ES = [
  'Esta noche, en calma, vamos a escuchar un cuento de amistad con Dios.',
  'Acomodate, respira suave y recuerda que Dios te cuida con mucho amor.',
  'Esta historia te ayudara a conocer mejor a Jesus y a sus amigos santos.'
];

const INTRO_EN = [
  'Tonight, in peace, we will listen to a story about friendship with God.',
  'Get comfortable, breathe slowly, and remember that God cares for you with great love.',
  'This story will help you know Jesus and his saint friends a little better.'
];

const BAD_ES = [
  /esta historia te ayudara/i,
  /un cuento para dormir sobre/i,
  /paso importante/i,
  /telecom/i,
  /abraham/i,
  /deuterocan/i,
  /dogm/i,
  /hagiograf/i,
  /santoral/i,
  /contrarreforma/i,
  /dispar|sangre|quemad|ejecut|ataqu|atac|mutil|tortur/i,
  /Ã|Â|â/,
  /por eso, muchas familias/i
];

const BAD_EN = [
  /this story will help you know jesus/i,
  /a bedtime story about/i,
  /important moment/i,
  /telecom/i,
  /abraham/i,
  /deuterocanon/i,
  /dogma/i,
  /hagiograph/i,
  /counter-reformation/i,
  /shot|blood|burned|execut|attack|mutil|tortur/i,
  /Ã|Â|â/,
  /that is why many families love/i
];

function fixMojibake(text) {
  return String(text || '')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã/g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã/g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/Â/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€\x9d/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSpanishLexicon(text) {
  let t = String(text || '');
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
    [/\bcorazon\b/gi, 'corazón'],
    [/\boracion\b/gi, 'oración'],
    [/\bmision\b/gi, 'misión'],
    [/\bconversion\b/gi, 'conversión'],
    [/\btambien\b/gi, 'también'],
    [/\bdespues\b/gi, 'después'],
    [/\bademas\b/gi, 'además'],
    [/\bmas\b/gi, 'más'],
    [/\bjesus\b/gi, 'Jesús'],
    [/\bmaria\b/gi, 'María']
  ];
  for (const [rx, repl] of rules) t = t.replace(rx, repl);
  return t;
}

function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const s of arr) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function isBadFact(text, lang) {
  const t = fixMojibake(text);
  const badList = lang === 'es' ? BAD_ES : BAD_EN;
  if (!t || t.length < 24 || t.length > 170) return true;
  if ((t.match(/,/g) || []).length > 2) return true;
  if (/\b(no\.|sin\.|con\.|de\.|del\.|la\.|el\.)$/i.test(t)) return true;
  return badList.some(rx => rx.test(t));
}

function isTemplateLine(text, lang) {
  const t = fixMojibake(text).toLowerCase();
  if (!t) return true;

  if (lang === 'es') {
    return (
      t.startsWith('esta noche, en calma') ||
      t.startsWith('acomodate, respira') ||
      t.startsWith('acomodate y respira') ||
      t.startsWith('esta historia te ayudara') ||
      t.startsWith('hoy vamos a conocer') ||
      t.startsWith('hoy vamos a aprender') ||
      t.startsWith('recuerda esta idea:') ||
      t.startsWith('por eso, muchas familias') ||
      t.startsWith('antes de dormir') ||
      t.startsWith('este santo, con su ejemplo')
    );
  }

  return (
    t.startsWith('tonight, in peace') ||
    t.startsWith('get comfortable, breathe') ||
    t.startsWith('this story will help you know jesus') ||
    t.startsWith('today we are going to learn') ||
    t.startsWith('remember this idea:') ||
    t.startsWith('that is why many families') ||
    t.startsWith('before sleeping') ||
    t.startsWith('this saint, through his or her example')
  );
}

function normalizeFact(text, lang) {
  let t = fixMojibake(text)
    .replace(/^[-:;,\s]+/, '')
    .replace(/["“”«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return '';
  if (!/[.!?]$/.test(t)) t += '.';
  if (isBadFact(t, lang)) return '';
  return t;
}

function extractFacts(story, lang) {
  const paras = String(story || '').split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const facts = [];

  for (const p of paras) {
    if (isTemplateLine(p, lang)) continue;

    const m = p.match(/^[^:]{1,40}:\s*(.+)$/);
    const body = m ? m[1] : p;

    if (isTemplateLine(body, lang)) continue;
    const clean = normalizeFact(body, lang);
    if (clean) facts.push(clean);
  }

  return uniq(facts).slice(0, 2);
}

function sanitizeHookEs(hook, title) {
  let h = normalizeSpanishLexicon(fixMojibake(hook || '')).trim();
  if (!h || /un cuento para dormir sobre/i.test(h)) {
    const t = fixMojibake(title || 'este santo');
    return `Dios nos ensena con la vida de ${t}`;
  }
  if (/^dios nos ensena/i.test(h)) return h;
  return h.replace(/\.+$/, '');
}

function sanitizeHookEn(hook, title) {
  let h = fixMojibake(hook || '').trim();
  if (!h || /a bedtime story about/i.test(h)) {
    const t = fixMojibake(title || 'this saint');
    return `God teaches us through the life of ${t}`;
  }
  if (/^god teaches us/i.test(h)) return h;
  return h.replace(/\.+$/, '');
}

function buildStoryEs(cuento, facts) {
  const name = cuento.title?.es ? cuento.title.es.replace(/^La\s+|^El\s+/i, '').trim() : 'este santo';
  const hook = sanitizeHookEs(cuento.hook?.es, cuento.title?.es || name);
  const lines = [
    ...INTRO_ES,
    `Hoy vamos a conocer a ${name}.`,
    `Recuerda esta idea: ${hook}.`
  ];

  if (facts.length) {
    if (facts[0]) lines.push(`Un dia paso algo importante: ${facts[0]}`);
    if (facts[1]) lines.push(`Con el tiempo: ${facts[1]}`);
  } else {
    lines.push('Un dia paso algo importante: con su ejemplo, muchas personas aprendieron a confiar en Dios.');
  }

  lines.push(`Por eso, muchas familias quieren a ${name} y le piden ayuda para seguir a Jesus.`);
  lines.push(`Antes de dormir, dile a Dios: "Quiero amar como ${name}".`);
  return normalizeSpanishLexicon(lines.join('\n\n'));
}

function buildStoryEn(cuento, facts) {
  const name = cuento.title?.en ? cuento.title.en.replace(/^The\s+/i, '').trim() : 'this saint';
  const hook = sanitizeHookEn(cuento.hook?.en, cuento.title?.en || name);
  const lines = [
    ...INTRO_EN,
    `Today we are going to learn about ${name}.`,
    `Remember this idea: ${hook}.`
  ];

  if (facts.length) {
    if (facts[0]) lines.push(`One day, something important happened: ${facts[0]}`);
    if (facts[1]) lines.push(`As time went on: ${facts[1]}`);
  } else {
    lines.push('One day, something important happened: many people learned to trust God through this example.');
  }

  lines.push(`That is why many families love ${name} and ask for help to follow Jesus.`);
  lines.push(`Before sleeping, tell God: "I want to love like ${name}."`);
  return lines.join('\n\n');
}

function main() {
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const cuento of json.cuentos) {
    cuento.hook = {
      es: normalizeSpanishLexicon(sanitizeHookEs(cuento.hook?.es, cuento.title?.es || '')),
      en: sanitizeHookEn(cuento.hook?.en, cuento.title?.en || '')
    };

    const factsEs = extractFacts(cuento.story?.es || '', 'es');
    const factsEn = extractFacts(cuento.story?.en || '', 'en');

    cuento.story = {
      es: normalizeSpanishLexicon(buildStoryEs(cuento, factsEs)),
      en: buildStoryEn(cuento, factsEn)
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log('Polished cuentos:', json.cuentos.length);
}

main();
