// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

/** @type {Record<string, number>} */
const BIBLE_CHAPTER_VERSES = require('./devotional-bible-chapters.json');
/** @type {Record<string, Record<string, number>>} */
const BIBLE_EDITION_CHAPTER_VERSES = {
  'CEE/NABRE': { psa004: 9, psa013: 6, psa034: 23, psa046: 12, psa051: 21, psa056: 14, psa085: 14 },
  NRSVCE: { psa004: 8, psa013: 6, psa034: 22, psa046: 11, psa051: 19, psa056: 13, psa085: 13 },
};
/** @type {Record<string, string>} */
const BIBLE_BOOK_IDS = {
  '1 Pe': '1pe', Stg: 'jam', '2 Tim': '2ti', Mt: 'mat', Jn: 'joh',
  '2 Co': '2co', Prov: 'pro', Sant: 'jam', Sal: 'psa', '1 Jn': '1jo',
  '1 Cor': '1co', Ef: 'eph', 'Gál': 'gal', Lc: 'luk', Rom: 'rom',
  '2 Cor': '2co', Flp: 'phi', Jos: 'jos', Col: 'col', Dt: 'deu',
  Hch: 'act', 'Núm': 'num', Sir: 'sir', '1 Tes': '1th', Mc: 'mar',
  Heb: 'heb', Hb: 'heb', Lm: 'lam', '1 Co': '1co', Gn: 'gen',
  Eclo: 'sir', Ga: 'gal', Neh: 'neh', 'Éx': 'exo', Is: 'isa',
  Rm: 'rom', Ap: 'rev', Matthew: 'mat', Mark: 'mar', Luke: 'luk',
  John: 'joh', '1 John': '1jo', Romans: 'rom', Eph: 'eph', Rev: 'rev',
  Mk: 'mar', Lk: 'luk',
};

const INLINE_BIBLE_REFERENCE = new RegExp(
  `(?<![\\p{L}\\d])(${Object.keys(BIBLE_BOOK_IDS).sort((a, b) => b.length - a.length).join('|')})\\s+([1-9]\\d*)\\s*[:,]\\s*([1-9]\\d*(?:[-–][1-9]\\d*)?(?:\\.[1-9]\\d*(?:[-–][1-9]\\d*)?)*)`,
  'gu'
);

/** @param {string} text */
function inlineBibleReferences(text) {
  return Array.from(text.matchAll(INLINE_BIBLE_REFERENCE), match =>
    `${match[1]} ${match[2]}, ${match[3].replace(/–/g, '-')}`);
}

/** @param {string} reference */
function assertBibleReference(reference) {
  if (typeof reference !== 'string' || !reference.trim()) {
    throw new Error('Falta la referencia bíblica');
  }

  for (const part of reference.split(';')) {
    const match = part.trim().match(/^((?:[1-3]\s+)?[\p{L}]+)\s+([1-9]\d*),\s*([1-9]\d*(?:-[1-9]\d*)?(?:\.[1-9]\d*(?:-[1-9]\d*)?)*)(?:\s+\(num\. (CEE\/NABRE|NRSVCE)\))?$/u);
    if (!match) throw new Error(`Formato bíblico no reconocido: ${part}`);
    const [, book, chapter, verses, edition] = match;
    const bookId = BIBLE_BOOK_IDS[book];
    if (!bookId) throw new Error(`Libro bíblico no reconocido: ${book}`);
    const chapterId = `${bookId}${chapter.padStart(3, '0')}`;
    const maxVerse = edition ? BIBLE_EDITION_CHAPTER_VERSES[edition]?.[chapterId] : BIBLE_CHAPTER_VERSES[chapterId];
    if (!maxVerse) throw new Error(`Capítulo sin límite verificado: ${part}`);

    for (const range of verses.split('.')) {
      const [first, last = first] = range.split('-').map(Number);
      if (first > last || last > maxVerse) {
        throw new Error(`Versículos fuera de rango para ${part}: ${range}`);
      }
    }
  }
}

const SERIES = [
  { id: 'conversion', prefix: 'conv33', toggle: 'adorConv33Toggle' },
  { id: 'familia', prefix: 'fam33', toggle: 'adorFam33Toggle' },
  { id: 'misericordia', prefix: 'dm33', toggle: 'adorMis33Toggle' },
  { id: 'salud', prefix: 'sal33', toggle: 'adorSalud33Toggle' },
  { id: 'sangre', prefix: 'ps33', toggle: 'adorSangre33Toggle' },
];

for (const { id: series } of SERIES) {
  test(`los 33 días de ${series} tienen datos bilingües válidos`, async ({ request }) => {
    for (let day = 1; day <= 33; day++) {
      await test.step(`día ${day}`, async () => {
        const url = `/adoracion/33dias-${series}/dia-${String(day).padStart(2, '0')}.json`;
        const response = await request.get(url);
        expect(response.status(), url).toBe(200);
        const data = JSON.parse((await response.text()).replace(/^\uFEFF/, ''));

        expect(data.n, url).toBe(day);
        expect(() => assertBibleReference(data.verse?.ref), url).not.toThrow();
        for (const lang of ['es', 'en']) {
          for (const field of ['theme', 'verse', 'prayer', 'act']) {
            expect(data[field]?.[lang], `${url}: ${field}.${lang}`).toMatch(/\S/);
          }
          expect(Array.isArray(data.reflection?.[lang]), `${url}: reflection.${lang}`).toBe(true);
          expect(data.reflection[lang].length, `${url}: reflection.${lang}`).toBeGreaterThan(0);
          for (const paragraph of data.reflection[lang]) {
            expect(paragraph, `${url}: reflection.${lang}`).toMatch(/\S/);
          }
          const texts = [data.theme[lang], data.verse[lang], ...data.reflection[lang], data.prayer[lang], data.act[lang]];
          for (const text of texts) {
            for (const reference of inlineBibleReferences(text)) {
              expect(() => assertBibleReference(reference), `${url}: ${lang}, ${reference}`).not.toThrow();
            }
          }
        }
      });
    }
  });
}

test('Nuestra Señora del Carmen tiene datos bilingües válidos', async ({ request }) => {
  const response = await request.get('/data/nuestrasenoracarmen.json');
  expect(response.status()).toBe(200);
  const data = JSON.parse((await response.text()).replace(/^\uFEFF/, ''));

  expect(data.id).toBe('nuestrasenoracarmen');
  expect(data.miracles?.available).toBe(true);
  expect(data.novena).toHaveLength(9);
  for (const lang of ['es', 'en']) {
    for (const field of ['name', 'feast_day', 'prayer', 'history', 'miracles']) {
      expect(data[field]?.[lang], `${field}.${lang}`).toMatch(/\S/);
    }
    for (let day = 1; day <= 9; day++) {
      expect(data.novena[day - 1].day).toBe(day);
      expect(data.novena[day - 1][lang], `novena ${day}.${lang}`).toMatch(/\S/);
    }
  }
});

test('el validador admite citas compuestas y rechaza rangos imposibles', () => {
  expect(() => assertBibleReference('Sant 5, 14-15; Col 1, 24')).not.toThrow();
  expect(() => assertBibleReference('Mc 14, 22.24')).not.toThrow();
  expect(() => assertBibleReference('Sal 4, 9 (num. CEE/NABRE); Sal 4, 8 (num. NRSVCE)')).not.toThrow();
  expect(() => assertBibleReference('Mt 5, 49')).toThrow(/fuera de rango/);
  expect(() => assertBibleReference('Mt 5, 8-7')).toThrow(/fuera de rango/);
  expect(() => assertBibleReference('Desconocido 1, 1')).toThrow(/no reconocido/);
  expect(() => assertBibleReference('Mt 5, 0')).toThrow(/no reconocido/);
  expect(() => assertBibleReference('Jn 2, 26')).toThrow(/fuera de rango/);
  expect(() => assertBibleReference('Sal 4, 9 (num. NRSVCE)')).toThrow(/fuera de rango/);
  expect(inlineBibleReferences('Jn 19:26–27; 1 Pe 2, 24')).toEqual(['Jn 19, 26-27', '1 Pe 2, 24']);
  expect(inlineBibleReferences('Matthew 5:7; Rev 7:13-14')).toEqual(['Matthew 5, 7', 'Rev 7, 13-14']);
  expect(inlineBibleReferences('Día 2, 24 horas')).toEqual([]);
});

test('se conservan las correcciones revisadas de contenido', () => {
  const loadDay = (series, day) => {
    const file = path.join(__dirname, '..', 'adoracion', `33dias-${series}`, `dia-${day}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  };
  const carmen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'nuestrasenoracarmen.json'), 'utf8'));
  expect(loadDay('conversion', '02').prayer.en).toContain('without hiding or condemning myself');
  expect(loadDay('conversion', '23').reflection.en[0]).toContain('not necessarily pride');
  expect(loadDay('conversion', '25').reflection.es[0]).toContain('por analogía');
  expect(loadDay('conversion', '30').reflection.en[2]).not.toContain('carry every piece at once');
  expect(loadDay('conversion', '12').verse.ref).toBe('Sal 51, 3-4 (num. CEE/NABRE); Sal 51, 1-2 (num. NRSVCE)');
  expect(loadDay('misericordia', '22').verse.ref).toBe('Sal 56, 4 (num. CEE/NABRE); Sal 56, 3 (num. NRSVCE)');
  expect(loadDay('misericordia', '31').verse.ref).toBe('Sal 85, 11 (num. CEE/NABRE); Sal 85, 10 (num. NRSVCE)');
  expect(loadDay('misericordia', '02').reflection.es[0]).toContain('en Varsovia');
  expect(loadDay('misericordia', '02').reflection.en[0]).toContain('in Warsaw');
  expect(loadDay('misericordia', '02').reflection.en[1]).toContain('private revelation');
  expect(loadDay('misericordia', '05').reflection.es[0]).toContain('Lucas narra');
  expect(loadDay('misericordia', '05').reflection.en[0]).toContain('Matthew describes');
  expect(loadDay('misericordia', '18').verse.ref).toBe('Sant 5, 14');
  expect(loadDay('misericordia', '18').reflection.es[4]).toContain('Col 1, 24');
  expect(loadDay('salud', '14').verse.ref).toBe('Sal 4, 9 (num. CEE/NABRE); Sal 4, 8 (num. NRSVCE)');
  expect(loadDay('salud', '15').verse.ref).toBe('Sal 34, 19 (num. CEE/NABRE); Sal 34, 18 (num. NRSVCE)');
  expect(loadDay('salud', '16').verse.ref).toBe('Sal 46, 11 (num. CEE/NABRE); Sal 46, 10 (num. NRSVCE)');
  expect(loadDay('salud', '27').verse.ref).toBe('Sal 13, 2 (num. CEE/NABRE); Sal 13, 1 (num. NRSVCE)');
  expect(loadDay('sangre', '07').verse.ref).toBe('Sal 51, 9 (num. CEE/NABRE); Sal 51, 7 (num. NRSVCE)');
  expect(loadDay('sangre', '10').reflection.es[1]).toContain('Mateo, Marcos y Lucas');
  expect(loadDay('sangre', '10').reflection.en[1]).toContain('Matthew, Mark and Luke');
  expect(loadDay('misericordia', '32').reflection.es[2]).toContain('del libro de las Lamentaciones');
  expect(loadDay('misericordia', '32').reflection.en[2]).toContain('from the book of Lamentations');
  expect(carmen.history.es).toContain('16 de julio');
  expect(carmen.history.es).toContain('santa Teresa Benedicta de la Cruz');
  expect(carmen.history.en).toContain('Saint Teresa Benedicta of the Cross');
  expect(carmen.novena[7].es).toContain('No es un dogma ni una garantía automática');
  expect(carmen.novena[7].en).toContain('not a dogma or an automatic guarantee');
  expect(carmen.novena[8].es).toContain('No es una garantía automática de salvación');
  expect(carmen.miracles.es).toContain('no se afirma que un caso concreto');
});

for (const lang of ['es', 'en']) {
  test(`Nuestra Señora del Carmen muestra la oración, la historia y los nueve días (${lang})`, async ({ page }) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'nuestrasenoracarmen.json'), 'utf8'));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
    await page.addInitScript(value => localStorage.setItem('tup_lang', value), lang);
    await page.goto('/intercesor/?intercesor=nuestrasenoracarmen');
    await expect(page.locator('#intercessorName')).toHaveText(data.name[lang]);
    await expect(page.locator('#feastDay')).toHaveText(data.feast_day[lang]);

    const normalize = value => value.replace(/\s+/g, ' ').trim();
    const checkText = async (selector, expected) => {
      await expect(page.locator(selector)).toBeVisible();
      expect(normalize(await page.locator(selector).innerText())).toBe(normalize(expected));
    };

    await checkText('#prayerText', data.prayer[lang]);
    await page.locator('[data-tab="history"]').click();
    await checkText('#historyText', data.history[lang]);
    await page.locator('[data-tab="miracles"]').click();
    const miracleBlocks = data.miracles[lang].split('\n\n');
    await expect(page.locator('#miraclesText .miracle-item')).toHaveCount(miracleBlocks.length);
    for (let index = 0; index < miracleBlocks.length; index++) {
      const [heading, ...body] = miracleBlocks[index].split('\n');
      const item = page.locator('#miraclesText .miracle-item').nth(index);
      await expect(item.locator('.miracle-title')).toHaveText(heading.replace(/^\d+\.\s*/, ''));
      await expect(item.locator('.miracle-body')).toHaveText(body.join(' '));
    }

    await page.locator('[data-tab="novena"]').click();
    for (const day of data.novena) {
      await test.step(`día ${day.day}`, async () => {
        await page.locator(`.day-btn[data-day="${day.day}"]`).click();
        await expect(page.locator('#currentDay')).toHaveText(String(day.day));
        await checkText('#novenaText', day[lang]);
      });
    }
    expect(errors).toEqual([]);
  });
}

for (const { id: series, prefix, toggle } of SERIES) {
  for (const lang of ['es', 'en']) {
    test(`cada día de ${series} se abre y muestra su contenido (${lang})`, async ({ page }) => {
      test.setTimeout(180_000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
      await page.goto('/adoracion/');
      await page.evaluate(value => localStorage.setItem('tup_lang', value), lang);
      await page.reload();
      await page.locator(`#${toggle}`).click();

      const cards = page.locator(`#${prefix}List .a33-card`);
      const overlay = page.locator(`#${prefix}ModalOverlay`);
      await expect(cards).toHaveCount(33);
      for (let day = 1; day <= 33; day++) {
        await test.step(`día ${day}`, async () => {
          const file = path.join(__dirname, '..', 'adoracion', `33dias-${series}`, `dia-${String(day).padStart(2, '0')}.json`);
          const data = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
          const card = cards.nth(day - 1);
          await expect(card).toBeEnabled();
          await expect(card.locator('.a33-card-title')).toHaveText(data.theme[lang]);
          await card.click();
          await expect(overlay).toBeVisible();

          const actual = await page.evaluate(id => {
            const text = selector => {
              const element = document.querySelector(selector);
              if (!element || element.textContent === null) throw new Error(`Missing content: ${selector}`);
              return element.textContent.trim();
            };
            return {
              day: text(`#${id}DayNum`),
              title: text(`#${id}Title`),
              verse: text(`#${id}Verse .a33-verse-text`),
              reference: text(`#${id}Verse .a33-verse-ref`),
              reflection: Array.from(document.querySelectorAll(`#${id}Reflection p`), p => {
                if (p.textContent === null) throw new Error(`Missing reflection: ${id}`);
                return p.textContent.trim();
              }),
              prayer: text(`#${id}Prayer`),
              act: text(`#${id}Act`),
            };
          }, prefix);
          expect(actual).toEqual({
            day: `${lang === 'en' ? 'Day' : 'Día'} ${day}`,
            title: data.theme[lang].trim(),
            verse: data.verse[lang].trim(),
            reference: data.verse.ref.trim(),
            reflection: data.reflection[lang].map(paragraph => paragraph.trim()),
            prayer: data.prayer[lang].trim(),
            act: data.act[lang].trim(),
          });
          await page.locator(`#${prefix}ModalClose`).click();
          await expect(overlay).toBeHidden();
        });
      }
      expect(errors).toEqual([]);
    });
  }
}

test('las referencias con dos numeraciones se muestran completas en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  await page.goto('/adoracion/');

  const selections = [
    { series: 'conversion', days: [12] },
    { series: 'misericordia', days: [22, 31] },
    { series: 'salud', days: [14, 15, 16, 27] },
    { series: 'sangre', days: [7] },
  ];
  for (const { series, days } of selections) {
    const config = SERIES.find(item => item.id === series);
    if (!config) throw new Error(`Serie no reconocida: ${series}`);
    await page.locator(`#${config.toggle}`).click();
    for (const day of days) {
      await page.locator(`#${config.prefix}List .a33-card`).nth(day - 1).click();
      const reference = page.locator(`#${config.prefix}Verse .a33-verse-ref`);
      await expect(reference).toBeVisible();
      await reference.scrollIntoViewIfNeeded();
      const dimensions = await reference.evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, width: element.clientWidth, contentWidth: element.scrollWidth };
      });
      expect(dimensions.left, `${series}, día ${day}`).toBeGreaterThanOrEqual(0);
      expect(dimensions.right, `${series}, día ${day}`).toBeLessThanOrEqual(320);
      expect(dimensions.contentWidth, `${series}, día ${day}`).toBeLessThanOrEqual(dimensions.width);
      await page.locator(`#${config.prefix}ModalClose`).click();
    }
  }
});

test.describe('caché de lecturas', () => {
  test.use({ serviceWorkers: 'allow' });

  test('una lectura visitada vuelve a abrirse sin conexión', async ({ page, context }) => {
    test.setTimeout(60_000);
    const file = path.join(__dirname, '..', 'adoracion', '33dias-conversion', 'dia-02.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    const worker = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
    const version = worker.match(/const CACHE = '([^']+)'/)?.[1];
    expect(version).toBeTruthy();

    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
    await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
    await page.goto('/adoracion/');
    await expect.poll(
      () => page.evaluate(() => navigator.serviceWorker.controller !== null),
      { timeout: 30_000, message: 'El service worker no llegó a controlar la página' },
    ).toBe(true);
    expect(await page.evaluate(() => caches.keys())).toContain(version);

    const url = '/adoracion/33dias-conversion/dia-02.json';
    const online = await page.evaluate(async value => {
      const response = await fetch(value);
      if (!response.ok) throw new Error(`No se pudo cargar ${value}: ${response.status}`);
      return response.json();
    }, url);
    expect(online.prayer.es).toBe(data.prayer.es);
    await page.waitForFunction(async value => Boolean(await caches.match(value)), url);

    await context.setOffline(true);
    await page.reload();
    await page.locator('#adorConv33Toggle').click();
    const card = page.locator('#conv33List .a33-card').nth(1);
    await expect(card).toBeEnabled();
    await card.click();
    await expect(page.locator('#conv33ModalOverlay')).toBeVisible();
    await expect(page.locator('#conv33Prayer')).toHaveText(data.prayer.es);
  });
});
