const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cuentosPath = path.join(root, 'data', 'ninos-cuentos.json');
const dataDir = path.join(root, 'data');

const GENERIC_PARAS_ES = [
  'Esta noche, en calma, vamos a escuchar un cuento de amistad con Dios.',
  'Acomodate, respira suave y recuerda que Dios te cuida con mucho amor.',
  'Esta historia te ayudara a conocer mejor a Jesus y a sus amigos santos.'
];

const GENERIC_PARAS_EN = [
  'Tonight, in peace, we will listen to a story about friendship with God.',
  'Get comfortable, breathe slowly, and remember that God cares for you with great love.',
  'This story will help you know Jesus and his saint friends a little better.'
];

const FILTER_ES = [
  'Esta noche, cuando las luces de la casa se van apagando una a una',
  'Acomodate bien bajo las mantas',
  'Fuera, el mundo respira despacio',
  'Este cuento es largo, a proposito',
  'No hay prisa',
  'Tu angel de la guarda',
  'Asi lo contaban las abuelas',
  'En el silencio de la noche',
  'Nadie corre. Nadie grita.',
  'Imagina la escena',
  'El cuento respira un momento',
  'Nada te apura',
  'Escucha con calma',
  'Has visto alguna vez a alguien hacer algo asi por amor',
  'Te imaginas como seria estar alli',
  'A veces lo mas pequeno es lo que mas luce en la oscuridad'
];

const FILTER_EN = [
  'Tonight, as the house lights go out one by one',
  'Get cozy under the blankets',
  'Outside, the world breathes slowly',
  'This story is long on purpose',
  'There is no hurry',
  'Your guardian angel is here',
  'Grandmothers told it by the fire',
  'In the quiet of night',
  'No one runs. No one shouts.',
  'Picture the scene',
  'The story breathes a moment',
  'Nothing rushes you',
  'Listen calmly',
  'Have you ever seen someone do something like that out of love',
  'Can you imagine being there',
  'Sometimes the smallest thing shines brightest in the dark'
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function readJsonSafe(p) {
  try {
    return readJson(p);
  } catch (err) {
    return null;
  }
}

function normalizeSpaces(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function splitSentences(text) {
  const cleaned = normalizeSpaces(text).replace(/\n/g, ' ');
  if (!cleaned) return [];
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function dedupePreserveOrder(arr) {
  const out = [];
  const seen = new Set();
  for (const item of arr) {
    const k = item.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function cleanupSentence(s) {
  return s
    .replace(/^\d+\.?\s*/, '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/["“”«»]/g, '')
    .replace(/\s*[:;]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fixMojibake(text) {
  return String(text || '')
    .replace(/Ã¡/g, 'a')
    .replace(/Ã©/g, 'e')
    .replace(/Ã­/g, 'i')
    .replace(/Ã³/g, 'o')
    .replace(/Ãº/g, 'u')
    .replace(/Ã±/g, 'n')
    .replace(/Â/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€\x9d/g, '"');
}

function isHeadlineLike(s) {
  const t = s.trim();
  if (!t) return true;
  if (t.length < 35) return true;
  if (t.length > 220) return true;
  if (/^[A-ZÁÉÍÓÚÑ0-9\s\-,'\.]+$/.test(t) && /\s/.test(t)) return true;
  if (/\b(day|dia|pray|reza|litany|letania|opening|cierre|misterio|mystery)\b/i.test(t)) return true;
  if (/\b\d+\.?\s*[A-ZÁÉÍÓÚÑ]/.test(t)) return true;
  if ((t.match(/,/g) || []).length >= 5) return true;
  return false;
}

function isNoisySentence(s) {
  const t = String(s || '').trim();
  if (!t) return true;
  if (/[_{}<>]/.test(t)) return true;
  if (/\b[A-ZÁÉÍÓÚÑ]{2,}\s+[A-ZÁÉÍÓÚÑ]{1,2}\s+[A-ZÁÉÍÓÚÑ]{2,}\b/.test(t)) return true;
  if ((t.match(/[0-9]/g) || []).length > 8) return true;
  const letters = (t.match(/[A-Za-zÁÉÍÓÚáéíóúÑñ]/g) || []).length;
  const caps = (t.match(/[A-ZÁÉÍÓÚÑ]/g) || []).length;
  if (letters > 0 && (caps / letters) > 0.45) return true;
  return false;
}

function isKidFriendlyFact(sentence, lang) {
  const t = String(sentence || '').toLowerCase();
  if (!t) return false;

  const hardBlockEs = /(dogm|contrarreforma|deuterocan|patrist|liturg|abrahamic|telecom|santoral|hagiograf|canon romano|proceso de beatif|prefecto|imperio|ortodoxa celebra|calendario romano general)/;
  const hardBlockEn = /(dogma|counter-reformation|deuterocanon|patrist|liturg|abrahamic|telecom|martyrology|hagiograph|roman canon|beatification process|prefect|empire)/;
  if (lang === 'es' && hardBlockEs.test(t)) return false;
  if (lang === 'en' && hardBlockEn.test(t)) return false;

  const verbsEs = /(naci|creci|vivio|murio|rezo|ayud|cuido|enseñ|enseno|aprendi|aprendio|fundo|sirvio|trabaj|acompa|proteg|apareci|confi|perdon|comparti|camin|siguio|evangeliz|escribio)/;
  const verbsEn = /(born|grew|lived|died|prayed|helped|cared|taught|learned|founded|served|worked|accompanied|protected|appeared|trusted|forgave|shared|walked|followed|evangelized|wrote)/;
  return lang === 'es' ? verbsEs.test(t) : verbsEn.test(t);
}

function scoreSentence(s, lang) {
  const low = s.toLowerCase();
  let score = 0;
  if (/\b\d{3,4}\b/.test(low)) score += 3;
  if (lang === 'es') {
    if (/(nacio|murio|canonizo|fundo|aparecio|vivio|evangelio|roma|nazaret|jerusalen|mexico|portugal|italia|francia)/.test(low)) score += 2;
    if (/(pobre|caridad|familia|iglesia|maria|jesus|rosario|angel|obispo)/.test(low)) score += 1;
  } else {
    if (/(born|died|canonized|founded|appeared|lived|gospel|rome|nazareth|jerusalem|mexico|portugal|italy|france)/.test(low)) score += 2;
    if (/(poor|charity|family|church|mary|jesus|rosary|angel|bishop)/.test(low)) score += 1;
  }
  if (s.length < 40) score -= 1;
  if (s.length > 230) score -= 2;
  return score;
}

function isFiltered(sentence, lang) {
  const low = sentence.toLowerCase();
  const filters = lang === 'es' ? FILTER_ES : FILTER_EN;
  return filters.some(f => low.includes(f.toLowerCase()));
}

function extractFromHistory(saint, lang) {
  const sources = [];
  if (saint && saint.history && saint.history[lang]) sources.push(saint.history[lang]);
  if (!sources.length && saint && saint.miracles && saint.miracles.available && saint.miracles[lang]) {
    sources.push(saint.miracles[lang]);
  }
  if (saint && saint.jaculatoria && saint.jaculatoria[lang]) sources.push(saint.jaculatoria[lang]);

  const allSentences = dedupePreserveOrder(
    splitSentences(sources.join(' ')).map(cleanupSentence).filter(Boolean)
  );

  const filtered = allSentences.filter(
    s => !isFiltered(s, lang) && !isHeadlineLike(s) && !isNoisySentence(s) && isKidFriendlyFact(s, lang)
  );
  const ranked = filtered
    .map((s, i) => ({ s, i, score: scoreSentence(s, lang) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map(x => x.s);

  return dedupePreserveOrder(ranked).slice(0, 5);
}

function extractFallbackFromOld(oldStory, lang) {
  const paras = normalizeSpaces(oldStory)
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .filter(p => !isFiltered(p, lang));

  const candidate = [];
  for (const p of paras) {
    const sents = splitSentences(p).map(cleanupSentence).filter(Boolean);
    for (const s of sents) {
      if (!isFiltered(s, lang) && !isNoisySentence(s) && isKidFriendlyFact(s, lang)) candidate.push(s);
    }
  }
  const ranked = dedupePreserveOrder(candidate)
    .filter(s => !isHeadlineLike(s) && !isNoisySentence(s))
    .map((s, i) => ({ s, i, score: scoreSentence(s, lang) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map(x => x.s);

  return ranked.slice(0, 5);
}

function shortName(fullName, lang) {
  if (!fullName) return lang === 'es' ? 'este santo' : 'this saint';
  return String(fullName).replace(/^San\s+/i, '').replace(/^Santa\s+/i, '').replace(/^Saint\s+/i, '').trim() || fullName;
}

function ensurePeriod(text) {
  const t = String(text || '').trim();
  if (!t) return '';
  if (/[.!?]$/.test(t)) return t;
  return t + '.';
}

function simpleClause(text, maxLen) {
  let t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  const cutters = [', y ', ', pero ', ', aunque ', ';', ' - ', ' — ', ':'];
  for (const c of cutters) {
    const i = t.toLowerCase().indexOf(c);
    if (i > 40) {
      t = t.slice(0, i);
      break;
    }
  }
  if (t.length > maxLen) {
    return '';
  }
  t = t.replace(/\b(en|de|del|la|el|y|a|con|para|por|que|sin|and|of|to|in|with|for|without)\s*$/i, '').trim();
  t = t.replace(/[,:;]\s*$/g, '').trim();
  if (t.length < 28) return '';
  return ensurePeriod(t);
}

function childifyFact(lang, sentence) {
  let t = fixMojibake(cleanupSentence(sentence))
    .replace(/\b\d+\)\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (isNoisySentence(t)) return '';

  if (lang === 'es') {
    if (/(dispar|asesin|sangre|ejecut|quemad|tortur|ataqu|atac|apuñal|apuñ|mutil)/i.test(t)) return '';
    const replacements = [
      [/canonizad[oa]/gi, 'declarado santo por la Iglesia'],
      [/martirizad[oa]/gi, 'fiel a Jesus hasta el final'],
      [/apostolad[oa]/gi, 'mision'],
      [/contrarreforma/gi, 'renovacion de la Iglesia'],
      [/patristic[ao]/gi, 'antigua tradicion cristiana'],
      [/diocleciano/gi, 'un emperador de ese tiempo'],
      [/beatificad[oa]/gi, 'reconocido por la Iglesia'],
      [/declarado santo por la Iglesia por/gi, 'declarado santo por'],
      [/fue reconocido por la Iglesia/gi, 'fue reconocido por la Iglesia'],
      [/doctora de la iglesia/gi, 'maestra de fe en la Iglesia']
    ];
    for (const [rx, repl] of replacements) t = t.replace(rx, repl);
    t = simpleClause(t, 125);
  } else {
    if (/(shot|shoot|blood|execut|burned|tortur|attack|stab|mutil|killed|murder)/i.test(t)) return '';
    const replacements = [
      [/canonized/gi, 'recognized as a saint by the Church'],
      [/martyred/gi, 'faithful to Jesus until the end'],
      [/apostolate/gi, 'mission'],
      [/counter-reformation/gi, 'renewal of the Church'],
      [/patristic/gi, 'early Christian tradition'],
      [/diocletian/gi, 'an emperor of that time'],
      [/beatified/gi, 'recognized by the Church']
    ];
    for (const [rx, repl] of replacements) t = t.replace(rx, repl);
    t = simpleClause(t, 130);
  }

  if (!t) return '';
  if ((t.match(/,/g) || []).length > 2) return '';
  if ((t.match(/'/g) || []).length % 2 === 1) return '';
  if (/\b(no\.|sin\.|con\.|de\.|del\.|la\.|el\.)$/i.test(t)) return '';
  if (/\b(categor[ií]a|dogm[aá]tica|abrah[aá]micas?|deuterocan[oó]nico|hagiograf[ií]a|santoral|telecomunic)/i.test(t)) return '';
  if (/\b(EL|THE)\b\s+[A-ZÁÉÍÓÚÑ]{1,2}\b/.test(t)) return '';
  return t;
}

function buildStory(lang, saintName, facts, hook) {
  const intro = lang === 'es'
    ? GENERIC_PARAS_ES
    : GENERIC_PARAS_EN;

  const nameLine = lang === 'es'
    ? `Hoy vamos a conocer a ${saintName}.`
    : `Today we are going to learn about ${saintName}.`;

  const hookLine = hook
    ? (lang === 'es' ? `Recuerda esta idea: ${hook}.` : `Remember this idea: ${hook}.`)
    : null;

  const safeFacts = facts
    .map(f => f.replace(/\s+/g, ' ').trim())
    .filter(f => f && !isHeadlineLike(f))
    .slice(0, 4);
  const startersEs = [
    'Un dia paso algo importante',
    'Con el tiempo',
    'Despues',
    'Tambien recordamos que'
  ];
  const startersEn = [
    'One day, something important happened',
    'As time went on',
    'Later',
    'We also remember that'
  ];
  const factParas = safeFacts.map((f, idx) => {
    const fact = childifyFact(lang, f);
    if (!fact) return '';
    if (lang === 'es') return (startersEs[idx] || 'Otro momento importante') + ': ' + fact;
    return (startersEn[idx] || 'Another important moment') + ': ' + fact;
  });

  const end = lang === 'es'
    ? [
        `Por eso, muchas familias quieren a ${shortName(saintName, lang)} y le piden ayuda para seguir a Jesus.`,
        `Antes de dormir, dile a Dios: "Quiero amar como ${shortName(saintName, lang)}".`
      ]
    : [
        `That is why many families love ${shortName(saintName, lang)} and ask for help to follow Jesus.`,
        `Before sleeping, tell God: "I want to love like ${shortName(saintName, lang)}."`
      ];

  const parts = [
    intro[0],
    intro[1],
    intro[2],
    nameLine,
    hookLine,
    ...(factParas.filter(Boolean).length ? factParas.filter(Boolean) : (lang === 'es'
      ? ['Este santo, con su ejemplo, acerco muchos corazones a Dios.']
      : ['This saint, through his or her example, brought many hearts closer to God.'])),
    ...end
  ].filter(Boolean);

  return parts.join('\n\n');
}

function moralFromFacts(lang, facts) {
  const text = facts.join(' ').toLowerCase();
  if (lang === 'es') {
    if (/(pobre|caridad|necesitad|hambr)/.test(text)) return 'Amar a Jesus es ayudar al que mas lo necesita.';
    if (/(familia|padre|madre|hogar)/.test(text)) return 'En la familia tambien se aprende a amar a Dios.';
    if (/(maria|virgen|rosario)/.test(text)) return 'Con Maria caminamos mas cerca de Jesus.';
    if (/(trabaj|oficio|carpinter)/.test(text)) return 'El trabajo bien hecho tambien puede ser oracion.';
    return 'La santidad se vive cada dia con amor, fe y obediencia a Dios.';
  }
  if (/(poor|charity|need|hungry)/.test(text)) return 'Loving Jesus means helping those who need it most.';
  if (/(family|father|mother|home)/.test(text)) return 'Family life is also a school of love for God.';
  if (/(mary|our lady|rosary|virgin)/.test(text)) return 'With Mary, we walk closer to Jesus.';
  if (/(work|craft|carpenter|trade)/.test(text)) return 'Work done with love can also be prayer.';
  return 'Holiness is lived daily with love, faith, and obedience to God.';
}

function activityFromFacts(lang, facts) {
  const text = facts.join(' ').toLowerCase();
  if (lang === 'es') {
    if (/(pobre|caridad|necesitad|hambr)/.test(text)) return 'Comparte hoy algo con una persona que lo necesite.';
    if (/(familia|padre|madre|hogar)/.test(text)) return 'Haz una tarea en casa con alegria y sin quejarte.';
    if (/(maria|virgen|rosario)/.test(text)) return 'Reza hoy un Ave Maria por tu familia.';
    if (/(trabaj|oficio|carpinter)/.test(text)) return 'Haz bien una tarea pequena y ofrecela a Dios.';
    return 'Haz hoy una obra buena en silencio y ofrecela a Jesus.';
  }
  if (/(poor|charity|need|hungry)/.test(text)) return 'Share something today with a person in need.';
  if (/(family|father|mother|home)/.test(text)) return 'Do one chore at home with joy and no complaints.';
  if (/(mary|our lady|rosary|virgin)/.test(text)) return 'Pray one Hail Mary today for your family.';
  if (/(work|craft|carpenter|trade)/.test(text)) return 'Do one small task well and offer it to God.';
  return 'Do one hidden act of kindness today and offer it to Jesus.';
}

function main() {
  const cuentosJson = readJson(cuentosPath);
  const saintFiles = new Set(
    fs.readdirSync(dataDir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  );

  let fullHistoryCount = 0;
  let fallbackCount = 0;
  const missing = [];
  const invalid = [];

  for (const c of cuentosJson.cuentos) {
    const saintFile = c.saintId;
    let saint = null;
    if (saintFiles.has(saintFile)) {
      const saintPath = path.join(dataDir, saintFile + '.json');
      saint = readJsonSafe(saintPath);
      if (!saint) invalid.push(c.saintId);
    } else {
      missing.push(c.saintId);
    }

    const nameEs = (saint && saint.name && saint.name.es) || c.title?.es || 'este santo';
    const nameEn = (saint && saint.name && saint.name.en) || c.title?.en || 'this saint';

    let factsEs = extractFromHistory(saint, 'es');
    let factsEn = extractFromHistory(saint, 'en');

    if (!factsEs.length) {
      factsEs = extractFallbackFromOld((c.story && c.story.es) || '', 'es');
    }
    if (!factsEn.length) {
      factsEn = extractFallbackFromOld((c.story && c.story.en) || '', 'en');
    }

    if (factsEs.length && factsEn.length && saint) fullHistoryCount += 1;
    if (!saint || !factsEs.length || !factsEn.length) fallbackCount += 1;

    const storyEs = buildStory('es', nameEs, factsEs, c.hook && c.hook.es);
    const storyEn = buildStory('en', nameEn, factsEn, c.hook && c.hook.en);

    c.story = { es: storyEs, en: storyEn };
    c.moral = {
      es: moralFromFacts('es', factsEs),
      en: moralFromFacts('en', factsEn)
    };
    c.activity = {
      es: activityFromFacts('es', factsEs),
      en: activityFromFacts('en', factsEn)
    };

    if (!c.readMin || typeof c.readMin !== 'number') c.readMin = 8;
    c.bedtime = true;
  }

  fs.writeFileSync(cuentosPath, JSON.stringify(cuentosJson, null, 2) + '\n', 'utf8');

  const uniqueMissing = [...new Set(missing)];
  const uniqueInvalid = [...new Set(invalid)];
  console.log('Regenerated cuentos:', cuentosJson.cuentos.length);
  console.log('Full history sources used:', fullHistoryCount);
  console.log('Fallback used:', fallbackCount);
  console.log('Missing saint files:', uniqueMissing.length);
  if (uniqueMissing.length) {
    for (const m of uniqueMissing) console.log('-', m);
  }
  console.log('Invalid saint JSON files:', uniqueInvalid.length);
  if (uniqueInvalid.length) {
    for (const m of uniqueInvalid) console.log('-', m);
  }
}

main();
