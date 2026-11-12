// @ts-check
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const JOURNEYS = [
  { folder: '33dias', toggle: 'ador33Toggle', list: 'a33List', icon: 'mdIcon', close: 'a33ModalClose' },
  { folder: '33dias-sangre', toggle: 'adorSangre33Toggle', list: 'ps33List', icon: 'ps33Icon', close: 'ps33ModalClose' },
  { folder: '33dias-familia', toggle: 'adorFam33Toggle', list: 'fam33List', icon: 'fam33Icon', close: 'fam33ModalClose' },
  { folder: '33dias-misericordia', toggle: 'adorMis33Toggle', list: 'dm33List', icon: 'dm33Icon', close: 'dm33ModalClose' },
  { folder: '33dias-salud', toggle: 'adorSalud33Toggle', list: 'sal33List', icon: 'sal33Icon', close: 'sal33ModalClose' },
  { folder: '33dias-conversion', toggle: 'adorConv33Toggle', list: 'conv33List', icon: 'conv33Icon', close: 'conv33ModalClose' },
  { folder: '33dias-enemigos', toggle: 'adorEne33Toggle', list: 'ene33List', icon: 'ene33Icon', close: 'ene33ModalClose' },
];

function dayData(folder, day) {
  const file = path.join(ROOT, 'adoracion', folder, `dia-${String(day).padStart(2, '0')}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

test('cada día de las siete jornadas tiene una ilustración propia, válida y precargada', () => {
  const worker = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const seen = new Set();
  const hashes = new Set();
  for (const { folder } of JOURNEYS) {
    for (let day = 1; day <= 33; day++) {
      const data = dayData(folder, day);
      const expected = `/adoracion/${folder}/svgs/dia-${String(day).padStart(2, '0')}.svg`;
      expect(data.svg, `${folder} día ${day}`).toBe(expected);
      expect(seen.has(data.svg), `${folder} día ${day} reutiliza SVG`).toBe(false);
      seen.add(data.svg);
      const file = path.join(ROOT, ...data.svg.split('/').filter(Boolean));
      const svg = fs.readFileSync(file, 'utf8');
      expect(svg, data.svg).toMatch(/^\s*<svg\b/);
      expect(svg, data.svg).toMatch(/viewBox=["']0 0 100 100["']/);
      expect(svg, data.svg).toContain('</svg>');
      expect(svg, data.svg).not.toMatch(/<animate|<script|<foreignObject|href=["']https?:|@keyframes/i);
      expect(Buffer.byteLength(svg), data.svg).toBeLessThan(5 * 1024);
      const hash = crypto.createHash('sha256').update(svg).digest('hex');
      expect(hashes.has(hash), `${data.svg} repite otra ilustración`).toBe(false);
      hashes.add(hash);
      expect(worker, data.svg).toContain(`'${data.svg}'`);
    }
  }
  expect(seen.size).toBe(231);
  expect(hashes.size).toBe(231);
});

test('las ilustraciones aparecen en las tarjetas y en el día abierto', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
  await page.goto('/adoracion/');

  for (const journey of JOURNEYS) {
    await page.locator(`#${journey.toggle}`).click();
    const cards = page.locator(`#${journey.list} .a33-card`);
    await expect(cards).toHaveCount(33);
    await expect.poll(() => cards.locator('img').count()).toBe(33);
    await expect.poll(() => cards.locator('img').evaluateAll(images =>
      images.every(image => /** @type {HTMLImageElement} */ (image).complete && /** @type {HTMLImageElement} */ (image).naturalWidth > 0)), {
      timeout: 20_000,
      message: `No cargaron todas las ilustraciones de ${journey.folder}`,
    }).toBe(true);

    for (const day of [1, 17, 33]) {
      await cards.nth(day - 1).click();
      const image = page.locator(`#${journey.icon} img`);
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('src', `/adoracion/${journey.folder}/svgs/dia-${String(day).padStart(2, '0')}.svg`);
      await page.locator(`#${journey.close}`).click();
    }
  }
});

test.describe('ilustraciones de las jornadas sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('las imágenes están precargadas y se ven offline', async ({ page, context }) => {
    test.setTimeout(90_000);
    await page.goto('/adoracion/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    const cached = await page.evaluate(async () => {
      const cache = await caches.open('tup-v304');
      return Promise.all([
        cache.match('/adoracion/33dias-sangre/svgs/dia-17.svg'),
        cache.match('/adoracion/33dias-familia/svgs/dia-03.svg'),
        cache.match('/adoracion/33dias-misericordia/svgs/dia-29.svg'),
        cache.match('/adoracion/33dias-salud/svgs/dia-11.svg'),
        cache.match('/adoracion/33dias-conversion/svgs/dia-22.svg'),
        cache.match('/adoracion/33dias-enemigos/svgs/dia-33.svg'),
        cache.match('/adoracion/33dias-salud/dia-17.json'),
      ]).then(responses => responses.every(Boolean));
    });
    expect(cached).toBe(true);

    await context.setOffline(true);
    try {
      await page.locator('#adorSalud33Toggle').click();
      const card = page.locator('#sal33List .a33-card').nth(16);
      await expect(card).toBeEnabled();
      await card.click();
      const image = page.locator('#sal33Icon img');
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('src', '/adoracion/33dias-salud/svgs/dia-17.svg');
      await expect.poll(() => image.evaluate(el => /** @type {HTMLImageElement} */ (el).naturalWidth)).toBeGreaterThan(0);
    } finally {
      await context.setOffline(false);
    }
  });
});
