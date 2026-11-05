// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PAGES = ['index.html', 'vuelvo-al-padre/index.html', 'maria/index.html', 'novena-sagrado-corazon/index.html', 'tentaciones/index.html'];

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

test('las páginas no enlazan a fuentes externas y conservan el texto citado', () => {
  for (const file of SOURCE_PAGES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    expect(html, file).not.toMatch(/<a [^>]*href="https?:\/\/(?:www\.vatican\.va|www\.drbo\.org|www\.padrepio\.org|es\.aleteia\.org)/);
    expect(html, file).toContain('class="tup-ref"');
  }
});

for (const language of ['es', 'en']) {
  test(`Oseas 14 se lee completo y enseña cómo volver en ${language}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(value => localStorage.setItem('tup_lang', value), language);
    await page.goto('/vuelvo-al-padre/#oseas-14');
    const card = page.locator('#oseas-14');
    await expect(card.locator(`h2[data-lang="${language}"]`)).toBeVisible();
    await expect(card.locator(`.oseas-steps`).filter({ visible: true }).locator('li')).toHaveCount(5);
    const full = card.locator(`details.tup-ref[data-lang="${language}"]`);
    await full.locator('summary').click();
    await expect(full.locator('.oseas-text sup')).toHaveCount(10);
    await expect(full.locator('.oseas-v-how')).toHaveCount(3);
    await expect(full.locator('.oseas-v-answer')).toContainText(language === 'es' ? 'Curaré su deslealtad' : 'I will heal their defection');
    await expect(full.locator('.oseas-note')).toBeVisible();
    await expect(card.locator(`#oracion-oseas-14-${language}`)).toBeVisible();
    await expect(card.locator('[data-share-control="oseas-14"]')).toHaveCount(1);
    await expect(card.locator('a[href^="http"]')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('la oración de Oseas 14 se comparte con el menú nativo y su enlace', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('tup_lang', 'es');
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: data => { sessionStorage.setItem('oseas-share', JSON.stringify(data)); return Promise.resolve(); },
    });
  });
  await page.goto('/vuelvo-al-padre/');
  await page.locator('[data-share-control="oseas-14"] button').click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('oseas-share'))).not.toBeNull();
  const data = JSON.parse(await page.evaluate(() => sessionStorage.getItem('oseas-share') || '{}'));
  expect(data.title).toBe('Oración con Oseas 14');
  expect(data.text).toContain('Curaré su deslealtad');
  expect(data.url).toMatch(/\/vuelvo-al-padre\/\?lang=es#oracion-oseas-14-es$/);

  await page.locator('#langToggle').click();
  await page.locator('[data-share-control="oseas-14"] button').click();
  await expect.poll(async () => JSON.parse(await page.evaluate(() => sessionStorage.getItem('oseas-share') || '{}')).title).toBe('Prayer with Hosea 14');
});

test.describe('fuentes sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('Oseas 14 y los textos del Catecismo se leen offline', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.goto('/vuelvo-al-padre/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    await context.setOffline(true);
    try {
      await page.goto('/vuelvo-al-padre/?lang=en#oseas-14');
      await expect(page.locator('#oseas-14 h2[data-lang="en"]')).toBeVisible();
      const full = page.locator('#oseas-14 details.tup-ref[data-lang="en"]');
      await full.locator('summary').click();
      await expect(full).toContainText('I will love them freely');
      await page.goto('/maria/?lang=es');
      const ref = page.locator('.maria-sources details.tup-ref[data-lang="es"]').first();
      await ref.locator('summary').click();
      await expect(ref.locator('.tup-ref-verse').first()).toContainText('María');
    } finally {
      await context.setOffline(false);
    }
  });
});
