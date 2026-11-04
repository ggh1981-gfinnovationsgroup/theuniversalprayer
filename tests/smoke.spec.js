// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDED_DIRS = new Set(['node_modules', 'tests', 'test-results', 'playwright-report', 'assets', 'data', 'privado']);

const REDIRECT_RE = /<meta\s+http-equiv="refresh"\s+content="\d+;\s*url=([^"]+)"/i;

function discoverPages() {
  const pages = [{ path: '/', redirect: null }];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || EXCLUDED_DIRS.has(entry.name)) continue;
    const file = path.join(ROOT, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const match = fs.readFileSync(file, 'utf8').match(REDIRECT_RE);
    pages.push({ path: `/${entry.name}/`, redirect: match ? match[1] : null });
  }
  return pages;
}

const PAGE_QUERIES = { '/intercesor/': '?intercesor=guadalupe' };
const ALL_PAGES = discoverPages();
const PAGES = ALL_PAGES.filter(p => !p.redirect).map(p => p.path);
const REDIRECTS = ALL_PAGES.filter(p => p.redirect);

async function blockExternal(page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
}

async function openPage(page, pagePath) {
  const errors = [];
  const missing = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('response', res => {
    if (res.url().startsWith('http://127.0.0.1') && res.status() >= 400) missing.push(`${res.status()} ${res.url()}`);
  });
  await blockExternal(page);
  const response = await page.goto(pagePath + (PAGE_QUERIES[pagePath] || ''), { waitUntil: 'load' });
  return { response, errors, missing };
}

test.describe('Smoke: todas las páginas', () => {
  for (const pagePath of PAGES) {
    test.describe(pagePath, () => {
      test('carga sin errores de JavaScript ni recursos locales rotos', async ({ page }) => {
        const { response, errors, missing } = await openPage(page, pagePath);
        expect(response?.status(), 'HTTP status').toBe(200);
        await expect(page).toHaveTitle(/\S/);
        expect(errors, 'errores de JavaScript').toEqual([]);
        expect(missing, 'recursos locales con error').toEqual([]);
      });

      test('cada <details> tiene un único <summary>', async ({ page }) => {
        await openPage(page, pagePath);
        const bad = await page.$$eval('details', list => list
          .map((d, i) => ({ i, n: d.querySelectorAll(':scope > summary').length, text: (d.textContent || '').trim().slice(0, 60) }))
          .filter(d => d.n !== 1));
        expect(bad).toEqual([]);
      });

      test('el idioma elegido se guarda en la clave compartida tup_lang', async ({ page }) => {
        await openPage(page, pagePath);
        const toggle = page.locator('#langToggle');
        test.skip(await toggle.count() === 0, 'La página no tiene selector de idioma');
        await page.evaluate(() => {
          localStorage.clear();
          localStorage.setItem('tup_lang', 'es');
        });
        await page.reload();
        await toggle.click();
        expect(await page.evaluate(() => localStorage.getItem('tup_lang'))).toBe('en');
      });

      test('el botón de idioma cambia a inglés y oculta el español', async ({ page }) => {
        await openPage(page, pagePath);
        const toggle = page.locator('#langToggle');
        test.skip(await toggle.count() === 0, 'La página no tiene selector de idioma');
        await page.evaluate(() => {
          localStorage.clear();
          localStorage.setItem('tup_lang', 'es');
        });
        await page.reload();
        await toggle.click();
        await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
        const visibleSpanish = await page.$$eval('[data-lang="es"]', els => els
          .filter(el => el.checkVisibility())
          .map(el => (el.textContent || '').trim().slice(0, 60)));
        expect(visibleSpanish, 'bloques en español visibles tras cambiar a inglés').toEqual([]);
      });
    });
  }
});

for (const { path: from, redirect } of REDIRECTS) {
  test(`redirección ${from} → ${redirect}`, async ({ page }) => {
    await blockExternal(page);
    await page.goto(from);
    await page.waitForURL(url => url.pathname === redirect);
    expect((await page.request.get(redirect)).status()).toBe(200);
  });
}

test('el menú lateral se abre y contiene la página de María', async ({ page }) => {
  await blockExternal(page);
  await page.goto('/oraciones/');
  await page.locator('#hamburgerBtn').click();
  await expect(page.locator('#sideNav')).toHaveClass(/open/);
  await expect(page.locator('#sideNav a[href="/maria/"]')).toBeVisible();
});
