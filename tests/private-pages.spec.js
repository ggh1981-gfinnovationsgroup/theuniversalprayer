// @ts-check
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(ROOT, 'assets', 'js', 'private-search-data.js'), 'utf8'),
  sandbox,
);
const entries = sandbox.window.tupPrivateSearchEntries;

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

test('las seis páginas y sus recursos coinciden con el inventario restaurado', () => {
  expect(entries).toHaveLength(6);
  const hashes = new Set();
  for (const entry of entries) {
    expect(entry.digest).toMatch(/^[a-f0-9]{64}$/);
    expect(entry.length).toBeGreaterThan(0);
    hashes.add(entry.digest);
    const pagePath = path.join(ROOT, ...entry.href.split('/').filter(Boolean), 'index.html');
    const iconPath = path.join(ROOT, ...new URL(entry.icon, 'https://example.invalid').pathname.split('/').filter(Boolean));
    const html = fs.readFileSync(pagePath, 'utf8');
    expect(html).toContain('/assets/js/private-access.js');
    expect(html).toContain(entry.digest);
    expect(html).not.toMatch(/qp\.get\('clave'\)[\s\S]{0,80}===\s*'[^']+'/);
    expect(fs.existsSync(iconPath)).toBe(true);
  }
  expect(hashes.size).toBe(6);
  expect(fs.readdirSync(path.join(ROOT, 'assets', 'images', 'private-search'))).toHaveLength(7);
});

for (const [index, entry] of entries.entries()) {
  test(`página personal ${index + 1}: control de acceso y contenido restaurados`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
    await page.goto(entry.href);
    await expect(page.locator('#lockedState')).toBeVisible();
    await expect(page.locator('#mensajePrivado')).toBeHidden();

    await page.goto(`${entry.href}?clave=invalid-automation-key`);
    await expect(page.locator('#lockedState')).toBeVisible();
    await expect(page.locator('#mensajePrivado')).toBeHidden();

    await page.addInitScript(hash => {
      const bytes = new Uint8Array(hash.match(/../g).map(part => parseInt(part, 16)));
      Object.defineProperty(window.crypto.subtle, 'digest', {
        configurable: true,
        value: async () => bytes.buffer,
      });
    }, entry.digest);
    await page.goto(`${entry.href}?clave=synthetic-automation-key`);
    await expect(page.locator('#lockedState')).toBeHidden();
    await expect(page.locator('#mensajePrivado')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('la verificación usa SHA-256 sin depender de claves de producción', async ({ page }) => {
  await page.goto('/');
  const input = 'automation-fixture-only';
  const expected = crypto.createHash('sha256').update(input).digest('hex');
  const actual = await page.evaluate(value => window.tupPrivateAccess.digest(value), input);
  expect(actual).toBe(expected);
});

test('el buscador anterior encuentra resultados, conserva el idioma y descarta búsquedas obsoletas', async ({ page }) => {
  const key = 'pruebamenu123';
  const fixture = [{
    digest: crypto.createHash('sha256').update(key).digest('hex'),
    length: key.length,
    href: '/oraciones/',
    icon: '/assets/images/icon.svg',
    text: { es: 'Resultado de prueba', en: 'Example result' },
  }];
  await page.route('**/assets/js/private-search-data.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `window.tupPrivateSearchEntries = ${JSON.stringify(fixture)};`,
  }));
  await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
  await page.goto('/');
  const quick = page.locator('#quickNavSearch');
  const result = page.locator('#quickSecretSearchResult');
  await quick.fill('texto PRUEBA MÉNU123 extra');
  await expect(result).toBeVisible();
  await expect(result.locator('a')).toHaveText('Resultado de prueba');
  const href = await result.locator('a').getAttribute('href');
  expect(new URL(href).pathname).toBe('/oraciones/');
  expect(new URL(href).searchParams.get('clave')).toBe(key);

  await page.locator('#langToggle').click();
  await expect(result.locator('a')).toHaveText('Example result');

  const cards = page.locator('#cardsSearch');
  await cards.fill(key);
  await expect(page.locator('#secretSearchResult a')).toHaveText('Example result');

  await page.evaluate(() => {
    const original = window.tupPrivateAccess.digest;
    window.tupPrivateAccess.digest = async value => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return original(value);
    };
  });
  await quick.fill(key);
  await quick.fill('misericordia');
  await page.waitForTimeout(250);
  await expect(result).toBeHidden();
  await expect(page.locator('.quick-nav-item[data-intercessor-id="misericordia"]')).toBeVisible();
});

test('un fallo del verificador se comunica de forma explícita', async ({ page }) => {
  await page.route('**/assets/js/private-access.js', route => route.abort());
  await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
  await page.goto(`${entries[0].href}?clave=automation-fixture`);
  await expect(page.locator('#lockedState p[data-lang="es"]')).toHaveText(/No se pudo verificar el acceso/);
  await expect(page.locator('#mensajePrivado')).toBeHidden();
});

test.describe('página personal sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('el acceso sigue funcionando tras una visita y la instalación de la caché', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.addInitScript(hash => {
      const bytes = new Uint8Array(hash.match(/../g).map(part => parseInt(part, 16)));
      Object.defineProperty(window.crypto.subtle, 'digest', {
        configurable: true,
        value: async () => bytes.buffer,
      });
    }, entries[0].digest);
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    const url = `${entries[0].href}?clave=synthetic-automation-key`;
    await page.goto(url);
    await expect(page.locator('#mensajePrivado')).toBeVisible();
    await expect.poll(() => page.evaluate(async value => Boolean(await caches.match(value)), url)).toBe(true);
    await context.setOffline(true);
    try {
      await page.reload();
      await expect(page.locator('#mensajePrivado')).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
