// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const MAIN_JS = fs.readFileSync(path.resolve(__dirname, '..', 'assets', 'js', 'main.js'), 'utf8');
const INTERCESSOR_IDS = new Set([...MAIN_JS.matchAll(/\{\s*id:\s*'([a-z0-9]+)'/g)].map(m => m[1]));

const DEVOTIONS = [
  'dev-rosario',
  'dev-angelus',
  'dev-amparo',
  'dev-acordaos',
  'dev-inmaculado',
  'dev-desatanudos',
  'dev-totus',
  'dev-escapulario',
  'dev-encarnacion',
];

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  await page.goto('/maria/');
  await page.evaluate(() => localStorage.setItem('tup_lang', 'es'));
  await page.reload();
});

test('muestra el título y todas las devociones', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
  for (const id of DEVOTIONS) {
    await expect(page.locator(`#${id}`), id).toHaveCount(1);
  }
});

test('el índice rápido lleva a las devociones y al acompañamiento', async ({ page }) => {
  const hrefs = await page.locator('.maria-index a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs.sort()).toEqual([...DEVOTIONS.map(id => `#${id}`), '#acompanamiento'].sort());
});

test('ofrece acompañamiento breve y enlaza a las guías completas', async ({ page }) => {
  const section = page.locator('#acompanamiento');
  for (const [lang, title] of [['es', 'Si la lucha vuelve'], ['en', 'If the struggle returns']]) {
    if (lang === 'en') await page.locator('#langToggle').click();
    await expect(section.locator(`#acompanamientoTitle [data-lang="${lang}"]`)).toContainText(title);
    await expect(section.locator(`p[data-lang="${lang}"]`)).toBeVisible();
    await expect(section.locator('ol, h3')).toHaveCount(0);
    await expect(section.locator(`a[href="/tentaciones/"] span[data-lang="${lang}"]`)).toBeVisible();
    await expect(section.locator(`a[href="/reconciliacion/"] span[data-lang="${lang}"]`)).toBeVisible();
  }
  for (const href of [
    'https://www.vatican.va/archive/catechism_sp/p2s2c2a4_sp.html',
    'https://www.vatican.va/archive/catechism_sp/p3s1c1a3_sp.html',
    'https://www.vatican.va/archive/catechism_sp/p3s1c3a2_sp.html',
    'https://www.vatican.va/archive/catechism_sp/p4s2a3_sp.html',
  ]) {
    await expect(page.locator(`.maria-sources a[href="${href}"]`)).toHaveCount(1);
  }
});

test('cada devoción incluye cómo rezarla y una oración', async ({ page }) => {
  for (const id of DEVOTIONS) {
    const card = page.locator(`#${id}`);
    await expect(card.locator('.maria-how[data-lang="es"] li').first(), `${id}: pasos`).toBeAttached();
    await expect(card.locator('.maria-prayer[data-lang="es"]').first(), `${id}: oración`).toBeAttached();
    await expect(card.locator('.maria-how[data-lang="en"] li').first(), `${id}: steps (en)`).toBeAttached();
    await expect(card.locator('.maria-prayer[data-lang="en"]').first(), `${id}: prayer (en)`).toBeAttached();
  }
});

test('la oración breve al manto aparece en ambos idiomas', async ({ page }) => {
  const spanish = page.getByText('Mamita, ayúdame, cúbreme con tu manto.', { exact: true });
  const english = page.getByText('Mama Mary, help me, cover me with your mantle.', { exact: true });
  await expect(spanish).toBeVisible();
  await expect(english).toBeHidden();
  await page.locator('#langToggle').click();
  await expect(spanish).toBeHidden();
  await expect(english).toBeVisible();
});

test('los acordeones se abren en español y en inglés', async ({ page }) => {
  // Reference collapsibles (.tup-ref) are per-language and covered by reference-collapsibles.spec.js.
  const details = page.locator('details:not(.tup-ref)');
  const count = await details.count();
  expect(count).toBeGreaterThan(0);
  for (const lang of ['es', 'en']) {
    if (lang === 'en') await page.locator('#langToggle').click();
    for (let i = 0; i < count; i++) {
      const item = details.nth(i);
      await item.evaluate(el => { el.open = false; });
      const summary = item.locator(':scope > summary');
      await expect(summary).toHaveCount(1);
      await expect(summary.locator(`[data-lang="${lang}"]`)).toBeVisible();
      await summary.click();
      await expect(item).toHaveJSProperty('open', true);
    }
  }
});

test('cambia de idioma, lo recuerda y no deja texto en español visible', async ({ page }) => {
  await page.locator('#langToggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#langToggle')).toHaveText('ES');
  expect(await page.evaluate(() => localStorage.getItem('tup_lang'))).toBe('en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const visibleSpanish = await page.$$eval('[data-lang="es"]', els => els.filter(el => el.checkVisibility()).length);
  expect(visibleSpanish).toBe(0);
  await expect(page.locator('h1 [data-lang="en"]')).toBeVisible();
});

test('los enlaces a intercesores usan slugs existentes', async ({ page }) => {
  const slugs = await page.locator('a[href*="/intercesor/?intercesor="]').evaluateAll(as =>
    as.map(a => new URL(a.getAttribute('href') || '', location.href).searchParams.get('intercesor')));
  expect(slugs.length).toBeGreaterThanOrEqual(9);
  for (const slug of slugs) expect(INTERCESSOR_IDS.has(slug || ''), `slug ${slug}`).toBe(true);
});

test('todos los enlaces internos responden 200', async ({ page }) => {
  const hrefs = await page.locator('main a[href^="/"]').evaluateAll(as => [...new Set(as.map(a => a.getAttribute('href')))]);
  expect(hrefs.length).toBeGreaterThan(10);
  for (const href of hrefs) {
    const res = await page.request.get(href.split('#')[0]);
    expect(res.status(), href).toBe(200);
  }
});

test('las anclas a otras páginas existen en su destino', async ({ page }) => {
  const anchored = await page.locator('main a[href^="/"][href*="#"]').evaluateAll(as => [...new Set(as.map(a => a.getAttribute('href')))]);
  for (const href of anchored) {
    const [url, hash] = href.split('#');
    const html = await (await page.request.get(url)).text();
    expect(html.includes(`id="${hash}"`), href).toBe(true);
  }
});

test('los enlaces externos son seguros y apuntan a fuentes https', async ({ page }) => {
  const links = await page.locator('a[href^="http"]').evaluateAll(as => as.map(a => ({
    href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel') || '',
  })));
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) {
    expect(link.href, 'https').toMatch(/^https:\/\//);
    if (link.target === '_blank') expect(link.rel, link.href).toContain('noopener');
  }
  expect(links.some(l => /vatican\.va/.test(l.href || ''))).toBe(true);
});

test('está registrada en menú, sitemap y service worker', async ({ page }) => {
  const root = path.resolve(__dirname, '..');
  expect(fs.readFileSync(path.join(root, 'assets', 'js', 'menu.js'), 'utf8')).toContain("href: '/maria/'");
  expect(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8')).toContain('https://www.theuniversalprayer.com/maria/');
  expect(fs.readFileSync(path.join(root, 'sw.js'), 'utf8')).toContain("'/maria/'");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.theuniversalprayer.com/maria/');
});

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

for (const viewport of VIEWPORTS) {
  test(`los accesos rápidos no quedan bajo el header (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const hrefs = await page.locator('.maria-index a').evaluateAll(links => links.map(a => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.locator(`.maria-index a[href="${href}"]`).focus();
      await page.keyboard.press('Enter');

      const gap = await page.evaluate(async selector => {
        let last = -1;
        let stable = 0;
        while (stable < 5) {
          await new Promise(r => setTimeout(r, 60));
          if (window.scrollY === last) stable++;
          else { stable = 0; last = window.scrollY; }
        }
        const target = document.querySelector(selector);
        const header = document.querySelector('.site-header');
        return target.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
      }, href);

      expect(gap, `${href} queda tapado por el header`).toBeGreaterThanOrEqual(0);
    }
  });
}
