// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const KEYS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MAX_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DATA = Object.fromEntries(KEYS.map(key => [key, JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'meses', `${key}.json`), 'utf8'))]));
const FIELDS = ['title', 'ref', 'verse', 'reflection', 'prayer', 'action'];
const EASTER = { 2025: '04-20', 2026: '04-05', 2027: '03-28', 2028: '04-16', 2029: '04-01', 2030: '04-21', 2031: '04-13', 2032: '03-28' };
const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

async function blockExternal(page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
}

async function openMonth(page, key, lang = 'es') {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await blockExternal(page);
  await page.addInitScript(value => {
    localStorage.setItem('tup_lang', value);
    if (!sessionStorage.getItem('keep')) localStorage.removeItem('tup_meses_done');
  }, lang);
  await page.goto(`/meses/?mes=${key}`);
  await expect(page.locator('#daysList .day-item').first()).toBeVisible();
  return errors;
}

test.describe('datos de los meses devocionales', () => {
  test('cada mes tiene todos sus días completos en ambos idiomas', () => {
    KEYS.forEach((key, index) => {
      const month = DATA[key];
      expect(month.key).toBe(key);
      expect(month.days, key).toHaveLength(MAX_DAYS[index]);
      for (const lang of ['es', 'en']) {
        expect(month[lang].intro.length, `${key}.${lang}.intro`).toBeGreaterThan(100);
        expect(month[lang].method.steps.length, `${key}.${lang}.method`).toBeGreaterThanOrEqual(4);
        expect(month[lang].method.prayer.trim(), `${key}.${lang}.prayer`).not.toBe('');
        expect(month[lang].method.closing.trim(), `${key}.${lang}.closing`).not.toBe('');
      }
      month.days.forEach((day, i) => {
        expect(day.day, `${key} ${i + 1}`).toBe(i + 1);
        for (const lang of ['es', 'en']) {
          for (const field of FIELDS) {
            expect(typeof day[lang][field] === 'string' && day[lang][field].trim().length > 0, `${key} ${i + 1} ${lang}.${field}`).toBe(true);
          }
        }
        if (day.feast !== null) {
          expect(day.feast.es && day.feast.en, `${key} ${i + 1} feast`).toBeTruthy();
        }
      });
    });
  });

  test('ningún día repite título, reflexión, oración ni acción en el año, ni cita dentro del mes', () => {
    for (const lang of ['es', 'en']) {
      for (const field of ['title', 'reflection', 'prayer', 'action']) {
        const seen = new Map();
        const repeated = [];
        for (const key of KEYS) {
          DATA[key].days.forEach(day => {
            const value = day[lang][field].toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
            if (seen.has(value)) repeated.push(`${key} ${day.day} = ${seen.get(value)}: ${day[lang][field]}`);
            else seen.set(value, `${key} ${day.day}`);
          });
        }
        expect(repeated, `${lang}.${field} repetidos`).toEqual([]);
      }
    }
    for (const key of KEYS) {
      const refs = DATA[key].days.map(day => day.es.ref);
      expect(new Set(refs).size, `${key}: citas repetidas en el mes`).toBe(refs.length);
    }
  });

  test('el español lleva tildes y el inglés no contiene texto en español', () => {
    const noAccent = /\b(Senor|Jesus|oracion|accion|corazon|Maria|tambien|dia|dias|ano|Jose|Espiritu)\b/;
    const spanish = /[ñáéíóú¿¡]|\b(Señor|oración|corazón|también|Amén)\b/;
    const problems = [];
    for (const key of KEYS) {
      const month = DATA[key];
      const esTexts = [month.es.intro, ...month.es.method.steps, month.es.method.prayer, month.es.method.closing];
      const enTexts = [month.en.intro, ...month.en.method.steps, month.en.method.prayer, month.en.method.closing];
      month.days.forEach(day => {
        esTexts.push(day.es.title, day.es.reflection, day.es.prayer, day.es.action);
        enTexts.push(day.en.title, day.en.reflection, day.en.prayer, day.en.action);
      });
      esTexts.forEach(text => { if (noAccent.test(text)) problems.push(`${key} es: ${text.match(noAccent)?.[0]}`); });
      enTexts.forEach(text => { if (spanish.test(text)) problems.push(`${key} en: ${text.match(spanish)?.[0]}`); });
    }
    expect(problems).toEqual([]);
  });

  test('no hay garantías, castigos, enlaces externos ni plantillas antiguas', () => {
    const banned = /garantiz|guarantee|castig|punish|https?:|\bD[ií]a \d+ de\b|\bDay \d+ of\b|nunca m[aá]s|never again|infierno|\bhell\b/i;
    const problems = [];
    for (const key of KEYS) {
      for (const lang of ['es', 'en']) {
        DATA[key].days.forEach(day => {
          for (const field of ['title', 'reflection', 'prayer', 'action']) {
            if (banned.test(day[lang][field])) problems.push(`${key} ${day.day} ${lang}.${field}: ${day[lang][field].match(banned)?.[0]}`);
          }
        });
      }
    }
    expect(problems).toEqual([]);
  });

  test('las fiestas fijas principales están en su fecha', () => {
    const fixed = [
      ['enero', 1, /Madre de Dios/], ['febrero', 2, /Presentación/], ['marzo', 19, /San José/], ['marzo', 25, /Anunciación/],
      ['mayo', 31, /Visitación/], ['junio', 29, /Pedro y Pablo/], ['agosto', 6, /Transfiguración/], ['agosto', 15, /Asunción/],
      ['septiembre', 15, /Dolores/], ['octubre', 7, /Rosario/], ['noviembre', 1, /Todos los Santos/], ['noviembre', 2, /difuntos/i],
      ['diciembre', 8, /Inmaculada/], ['diciembre', 12, /Guadalupe/], ['diciembre', 25, /Natividad/]
    ];
    for (const [key, day, re] of fixed) {
      expect(DATA[key].days[day - 1].feast?.es, `${key} ${day}`).toMatch(re);
    }
  });

  test('el service worker guarda los doce meses para usarlos sin conexión', () => {
    const worker = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    for (const key of KEYS) expect(worker).toContain(`'/data/meses/${key}.json'`);
  });
});

test.describe('página de meses', () => {
  for (const key of KEYS) {
    test(`${key} se muestra completo en español e inglés`, async ({ page }) => {
      const errors = await openMonth(page, key, 'es');
      const year = Number(await page.locator('#yearSelect').inputValue());
      const index = KEYS.indexOf(key);
      const expected = new Date(year, index + 1, 0).getDate();
      await expect(page.locator('#daysList .day-item')).toHaveCount(expected);
      await expect(page.locator('#dia-1 .day-title')).toHaveText(DATA[key].days[0].es.title);
      await page.locator('#dia-3 .day-toggle').click();
      await expect(page.locator('#dia-3 .day-panel')).toBeVisible();
      await expect(page.locator('#dia-3 .day-verse p')).toHaveText(DATA[key].days[2].es.verse);
      await expect(page.locator('#dia-3 .day-action p')).toHaveText(DATA[key].days[2].es.action);
      await expect(page.locator('#methodSteps li')).toHaveCount(DATA[key].es.method.steps.length);

      await page.locator('#langToggle').click();
      await expect(page.locator('#dia-1 .day-title')).toHaveText(DATA[key].days[0].en.title);
      await expect(page.locator('#dia-3 .day-panel')).toBeVisible();
      await expect(page.locator('#dia-3 .day-reflection')).toHaveText(DATA[key].days[2].en.reflection);
      await expect(page.locator('#plannerIntro')).toHaveText(DATA[key].en.intro);
      const visibleText = await page.locator('main').innerText();
      expect(visibleText).not.toMatch(/Paso de hoy|Oración\b|Marcar como/);
      expect(errors).toEqual([]);
    });
  }

  test('febrero muestra 29 días solo en años bisiestos', async ({ page }) => {
    await openMonth(page, 'febrero');
    const years = await page.locator('#yearSelect option').evaluateAll(options => options.map(o => Number(o.value)));
    const leap = years.find(isLeap);
    const common = years.find(y => !isLeap(y));
    expect(leap && common).toBeTruthy();
    await page.locator('#yearSelect').selectOption(String(leap));
    await expect(page.locator('#daysList .day-item')).toHaveCount(29);
    await expect(page.locator('#dia-29 .day-title')).toHaveText(DATA.febrero.days[28].es.title);
    await page.locator('#yearSelect').selectOption(String(common));
    await expect(page.locator('#daysList .day-item')).toHaveCount(28);
  });

  test('calcula la Pascua y las fiestas móviles del año elegido', async ({ page }) => {
    await openMonth(page, 'abril');
    const years = await page.locator('#yearSelect option').evaluateAll(options => options.map(o => Number(o.value)));
    for (const year of years.filter(y => EASTER[y])) {
      const [month, day] = EASTER[year].split('-').map(Number);
      await page.goto(`/meses/?mes=${KEYS[month - 1]}`);
      await page.locator('#yearSelect').selectOption(String(year));
      await expect(page.locator(`#dia-${day} .chip.movable`, { hasText: 'Domingo de Resurrección' })).toBeVisible();
      await expect(page.locator('#movableList')).toContainText('Domingo de Resurrección');
    }
  });

  test('marcar un día como vivido se guarda y actualiza el progreso', async ({ page }) => {
    await openMonth(page, 'octubre');
    const total = await page.locator('#daysList .day-item').count();
    await page.locator('#dia-5 .day-toggle').click();
    const button = page.locator('#dia-5 .done-btn');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#dia-5')).toHaveClass(/done/);
    await expect(page.locator('#progressLabel')).toHaveText(`1 de ${total} días vividos este mes`);
    await page.evaluate(() => sessionStorage.setItem('keep', '1'));
    await page.reload();
    await expect(page.locator('#dia-5')).toHaveClass(/done/);
  });

  test('los días de fiesta enlazan con la página del santo', async ({ page, request }) => {
    await openMonth(page, 'diciembre');
    await page.locator('#dia-12 .day-toggle').click();
    const link = page.locator('#dia-12 .day-saint-link');
    await expect(link).toHaveAttribute('href', '/intercesor/?intercesor=guadalupe');
    const html = fs.readFileSync(path.join(ROOT, 'meses', 'index.html'), 'utf8');
    const pages = [...new Set([...html.matchAll(/'\d+-\d+': '([a-z]+)'/g)].map(m => m[1]))];
    for (const name of pages) {
      expect((await request.get(`/data/${name}.json`)).status(), name).toBe(200);
    }
  });

  test('en móvil un día abierto no desborda la pantalla', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await openMonth(page, 'noviembre');
    await page.locator('#dia-2 .day-toggle').click();
    await expect(page.locator('#dia-2 .day-panel')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const box = await page.locator('#dia-2').boundingBox();
    expect(box && box.x >= 0 && box.x + box.width <= 320).toBe(true);
  });
});

test.describe('meses sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('los meses se abren sin conexión después de la primera visita', async ({ page, context }) => {
    test.setTimeout(90_000);
    await openMonth(page, 'enero');
    await expect.poll(
      () => page.evaluate(() => navigator.serviceWorker.controller !== null),
      { timeout: 30_000, message: 'El service worker no llegó a controlar la página' },
    ).toBe(true);
    await page.waitForFunction(async () => Boolean(await caches.match('/data/meses/diciembre.json')), null, { timeout: 30_000 });
    await context.setOffline(true);
    await page.reload();
    await page.locator('.month-btn[data-month="diciembre"]').click();
    await expect(page.locator('#dia-25 .day-title')).toHaveText(DATA.diciembre.days[24].es.title);
    await expect(page.locator('#daysStatus')).toHaveText('');
  });
});
