// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

for (const language of ['es', 'en']) {
  test(`la entrada de ayuda y los cinco minutos son accesibles en ${language}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('tup_lang', value), language);
    await page.goto('/');
    const help = page.locator('#necesito-ayuda');
    const guide = page.locator('#cinco-minutos');
    const entry = page.getByRole('link', {
      name: language === 'es' ? 'Señor, necesito ayuda ahora' : 'Lord, I need help now',
      exact: true,
    });
    await entry.click();
    await expect(page).toHaveURL(/#necesito-ayuda$/);
    await expect(help.locator(`#helpGuideTitle [data-lang="${language}"]`)).toBeVisible();
    await expect(help.locator('input, textarea, form')).toHaveCount(0);

    await page.evaluate(() => {
      const writes = [];
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (this === localStorage) writes.push(key);
        return original.call(this, key, value);
      };
      window.helpStorageWrites = writes;
    });

    const details = help.locator('.help-options > details');
    await expect(details).toHaveCount(5);
    const expectedLinks = ['/tentaciones/', '/vuelvo-al-padre/', '/emergencias/#ansiedad', '/enemigos/', '#cinco-minutos'];
    for (let index = 0; index < expectedLinks.length; index++) {
      const item = details.nth(index);
      await item.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(item).toHaveJSProperty('open', true);
      await expect(item.locator(`.help-prayer[data-lang="${language}"]`)).toBeVisible();
      await expect(item.locator('a')).toHaveAttribute('href', expectedLinks[index]);
      await expect(item.locator(`a [data-lang="${language}"]`)).toBeVisible();
      if (expectedLinks[index].startsWith('/')) {
        const response = await page.request.get(expectedLinks[index].split('#')[0]);
        expect(response.status(), expectedLinks[index]).toBe(200);
      }
    }

    await expect(help.locator(`.help-safety[data-lang="${language}"]`)).toBeVisible();
    await expect(help.locator(`.help-source[data-lang="${language}"]`)).toBeVisible();
    await expect(guide.locator(`#quietGuideTitle [data-lang="${language}"]`)).toBeVisible();
    await expect(guide.locator('.quiet-steps > li')).toHaveCount(5);
    await expect(guide.locator(`.quiet-steps p[data-lang="${language}"]`)).toHaveCount(5);
    await expect(guide.locator('input, textarea, form')).toHaveCount(0);
    await expect(guide.locator(`.quiet-steps a[href^="http"]`)).toHaveCount(0);
    const verse = guide.locator(`.quiet-steps details.tup-ref[data-lang="${language}"]`);
    await verse.locator('summary').click();
    await expect(verse.locator('.tup-ref-verse')).toContainText(language === 'es' ? 'Venid a mí todos los que estáis cansados' : 'Come to me, all you who labor');
    await expect(guide.locator(`.help-source[data-lang="${language}"]`)).toBeVisible();
    expect(await page.evaluate(() => window.helpStorageWrites)).toEqual([]);
  });
}

test('la guía y los controles caben en pantallas pequeñas', async ({ page }) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await expect(page.locator('#necesito-ayuda')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const summary = page.locator('#necesito-ayuda summary').first();
    const box = await summary.boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe('guía sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('la oración y las opciones siguen disponibles', async ({ page }) => {
    await page.goto('/');
    const details = page.locator('#necesito-ayuda details').first();
    await details.locator('summary').click();
    await expect(details.locator('.help-prayer[data-lang="es"]')).toBeVisible();
    await expect(page.locator('#cinco-minutos .quiet-steps > li')).toHaveCount(5);
  });
});

test('el texto pastoral evita atribuciones y garantías que aumentan la angustia', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
  await page.goto('/vuelvo-al-padre/');
  const content = page.locator('.vuelvo-content');
  await expect(content).toContainText('Dios no deja de buscarte ni de amarte');
  await expect(content).toContainText('una recaída, por sí sola, no demuestra');
  await expect(content).toContainText('pensamiento que llega o persiste involuntariamente');
  await expect(content).toContainText('su traducción aún no está identificada');
  await expect(content).not.toContainText('Se cansa del que no regresa');
  await expect(content).not.toContainText('el ciclo continuará');
  await expect(content).not.toContainText('CCC n. 1456');
  await expect(content).not.toContainText('San Pablo tuvo el mismo problema que tú');
  await expect(content.locator('a[href^="http"]')).toHaveCount(0);
  await expect(content.locator('.vuelvo-ccc[data-lang="es"] details.tup-ref').first()).toContainText('contrición');
  await page.locator('#langToggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(content).toContainText('a relapse alone does not prove');
  await expect(content).toContainText('a trusted confessor');
  await expect(content).not.toContainText('the cycle will continue');
  await expect(content.locator('.vuelvo-ccc[data-lang="en"] details.tup-ref').first()).toContainText('contrition');
});

test('un fallo al registrar la caché en María se informa explícitamente', async ({ page }) => {
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.addInitScript(() => {
    Object.defineProperty(navigator.serviceWorker, 'register', {
      configurable: true,
      value: () => Promise.reject(new Error('registration failed')),
    });
  });
  await page.goto('/maria/');
  await expect.poll(() => errors.some(message => message.includes('No se pudo registrar el service worker'))).toBe(true);
});

test('el buscador público sigue encontrando intercesores', async ({ page }) => {
  await page.goto('/');
  const quickSearch = page.locator('#quickNavSearch');
  await quickSearch.fill('misericordia');
  await expect(page.locator('.quick-nav-item[data-intercessor-id="misericordia"]')).toBeVisible();
  await quickSearch.fill('zzzzzzzz');
  await expect(page.locator('.quick-nav-item:visible')).toHaveCount(0);

  const cardsSearch = page.locator('#cardsSearch');
  await cardsSearch.scrollIntoViewIfNeeded();
  await expect(page.locator('.intercessor-card').first()).toBeAttached();
  await cardsSearch.fill('misericordia');
  await expect(page.locator('.intercessor-card[data-intercessor-id="misericordia"]')).toBeVisible();
});

test('las páginas personales restauradas conservan sus recursos y controles de acceso', () => {
  const personalRoot = path.join(ROOT, 'privado');
  const pages = fs.readdirSync(personalRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(personalRoot, entry.name, 'index.html')));
  expect(pages).toHaveLength(6);
  for (const page of pages) {
    const html = fs.readFileSync(path.join(personalRoot, page.name, 'index.html'), 'utf8');
    expect(html).toContain('/assets/js/private-access.js');
    expect(html).toContain('tupPrivateAccess.unlock(');
  }
  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const worker = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  expect(home).toContain('secretSearchResult');
  expect(home).toContain('/js/private-search.js');
  expect(worker).toContain('/assets/images/private-search/');
  expect(worker).toContain("'/assets/js/private-access.js'");
  expect(worker).toContain("'/assets/js/native-share.js'");
  expect(worker).toContain("'/assets/js/prayer-share.js'");
});
