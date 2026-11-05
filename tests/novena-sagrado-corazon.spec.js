// @ts-check
const fs = require('fs');
const http = require('http');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const NOVENA = '/novena-sagrado-corazon/';
const STEP_IDS = ['primera-peticion', 'segunda-peticion', 'tercera-peticion'];

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

for (const { lang, start, label, title } of [
  { lang: 'es', start: '/', label: 'Novena del Sagrado Corazón (Padre Pío)', title: 'Novena al Sagrado Corazón de Jesús' },
  { lang: 'en', start: '/oraciones/', label: 'Sacred Heart Novena (Padre Pio)', title: 'Novena to the Sacred Heart of Jesus' },
]) {
  test(`el menú lleva a la novena en ${lang}`, async ({ page }) => {
    await page.goto(start);
    await page.evaluate(value => localStorage.setItem('tup_lang', value), lang);
    await page.reload();
    await page.locator('#hamburgerBtn').click();
    const link = page.locator(`#sideNav a[href="${NOVENA}"]`);
    await expect(link).toBeVisible();
    await expect(link).toContainText(label);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${NOVENA}$`));
    await expect(page.locator(`h1 [data-lang="${lang}"]`)).toHaveText(title);
  });
}

for (const { lang, prayers, petition, response, final, promises } of [
  {
    lang: 'es',
    prayers: ['Padre nuestro', 'Ave María', 'Gloria'],
    petition: 'Aquí di tu petición',
    response: 'Sagrado Corazón de Jesús, en vos confío',
    final: 'San José, padre adoptivo de Jesús, ruega por nosotros',
    promises: ['Pidan, y se les dará', 'Si piden algo al Padre en mi nombre', 'mis palabras no pasarán'],
  },
  {
    lang: 'en',
    prayers: ['Our Father', 'Hail Mary', 'Glory Be'],
    petition: 'Here say your intention',
    response: 'Sacred Heart of Jesus, in you I trust',
    final: 'Saint Joseph, foster father of Jesus, pray for us',
    promises: ['Ask, and it shall be given you', 'If you ask the Father any thing in my name', 'my words shall not pass'],
  },
]) {
  test(`cada parte incluye la petición, las tres oraciones y la respuesta en ${lang}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('tup_lang', value), lang);
    await page.goto(NOVENA);
    await expect(page.locator('.nov-step')).toHaveCount(3);

    const commonPrayers = await page.locator(`#nov-common-prayers > [data-lang="${lang}"] .nov-prayer-text`).allTextContents();
    for (const [index, id] of STEP_IDS.entries()) {
      const step = page.locator(`#${id}`);
      await expect(step.locator(`.nov-prayer[data-lang="${lang}"]`)).toContainText(promises[index]);
      await expect(step.locator(`.nov-petition[data-lang="${lang}"]`)).toContainText(petition);
      const details = step.locator('details:not([data-lang])');
      await expect(step.locator(`details.tup-ref[data-lang="${lang}"] .tup-ref-verse`)).not.toBeEmpty();
      await expect(details).not.toHaveAttribute('open', '');
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(details).toHaveJSProperty('open', true);
      await expect(details.locator(`[data-lang="${lang}"] h3`)).toHaveText(prayers);
      await expect(details.locator(`[data-lang="${lang}"] .nov-prayer-text`)).toHaveCount(3);
      expect(await details.locator(`[data-lang="${lang}"] .nov-prayer-text`).allTextContents()).toEqual(commonPrayers);
      await expect(details.locator(`[data-lang="${lang}"] .nov-prayer-text`).first()).toBeVisible();
      await expect(step.locator(`.nov-response[data-lang="${lang}"]`)).toContainText(response);
      expect(await step.evaluate(el => {
        const petitionEl = el.querySelector('.nov-petition');
        const detailsEl = el.querySelector('details:not([data-lang])');
        const responseEl = el.querySelector('.nov-response');
        if (!petitionEl || !detailsEl || !responseEl) return false;
        return Boolean(petitionEl.compareDocumentPosition(detailsEl) & Node.DOCUMENT_POSITION_FOLLOWING)
          && Boolean(detailsEl.compareDocumentPosition(responseEl) & Node.DOCUMENT_POSITION_FOLLOWING);
      })).toBe(true);
    }

    const closing = page.locator('#oracion-final');
    await closing.locator('summary').click();
    await expect(closing.locator(`.nov-prayer-text[data-lang="${lang}"]`)).toBeVisible();
    await expect(closing.locator(`p[data-lang="${lang}"]`).filter({ hasText: final })).toBeVisible();
    await expect(page.locator(`#como-rezar [data-lang="${lang}"]`).filter({
      hasText: lang === 'es' ? 'nueve días seguidos' : 'nine consecutive days',
    }).first()).toBeVisible();
  });
}

test('las oraciones comunes coinciden con las que ya ofrece el sitio', async ({ page }) => {
  const normalize = value => (value || '').replace(/\s+/g, ' ').trim();
  await page.goto(NOVENA);
  for (const lang of ['es', 'en']) {
    const prayers = await page.locator(`#nov-common-prayers > [data-lang="${lang}"] .nov-prayer-text`).allTextContents();
    const salve = await page.locator(`#oracion-final .nov-prayer-text[data-lang="${lang}"]`).textContent();
    await page.goto('/oraciones/');
    const originals = [];
    for (const id of ['or-pn', 'or-am', 'or-gloria', 'or-salve']) {
      originals.push(await page.locator(`#${id} .or-prayer-text[data-lang="${lang}"]`).textContent());
    }
    expect([...prayers, salve].map(normalize)).toEqual(originals.map(normalize));
    await page.goto(NOVENA);
  }
});

test('el idioma cambia también en las oraciones desplegadas y se conserva', async ({ page }) => {
  await page.goto(NOVENA);
  await page.evaluate(() => localStorage.setItem('tup_lang', 'es'));
  await page.reload();
  const first = page.locator('#primera-peticion details:not([data-lang])');
  await first.locator('summary').click();
  await page.locator('#langToggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(first.locator('[data-lang="en"] h3').first()).toHaveText('Our Father');
  await expect(first.locator('[data-lang="en"] h3').first()).toBeVisible();
  await expect(first.locator('[data-lang="es"] h3').first()).toBeHidden();
  await page.locator('#hamburgerBtn').click();
  await expect(page.locator(`#sideNav a[href="${NOVENA}"]`)).toContainText('Sacred Heart Novena');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => localStorage.getItem('tup_lang'))).toBe('en');
  const visibleSpanish = await page.$$eval('[data-lang="es"]', els => els.filter(el => el.checkVisibility()).length);
  expect(visibleSpanish).toBe(0);
});

test('la página está registrada en el sitemap y en ambas rutas del service worker', async ({ page }) => {
  const worker = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  expect(worker).toContain(`'${NOVENA}'`);
  expect(worker).toContain(`'${NOVENA}index.html'`);
  expect(sitemap).toContain(`https://www.theuniversalprayer.com${NOVENA}`);
  await page.goto(NOVENA);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.theuniversalprayer.com${NOVENA}`);
  await expect(page.locator('#fuentes a[href^="http"]')).toHaveCount(0);
  await expect(page.locator('#fuentes')).toContainText('Centro Nacional del Padre Pío');
  await expect(page.locator('#fuentes details.tup-ref[data-lang="es"] .tup-ref-verse')).toHaveCount(3);
  for (const link of await page.locator('#fuentes a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('las oraciones siguen disponibles desde cada petición', async ({ page }) => {
    await page.goto(NOVENA);
    for (const id of STEP_IDS) {
      const details = page.locator(`#${id} details:not([data-lang])`);
      await details.locator('summary').click();
      await expect(details.locator('a[href="#oraciones-comunes"]').first()).toBeVisible();
    }
    await page.locator('#primera-peticion a[href="#oraciones-comunes"]').first().click();
    await expect(page.locator('#oraciones-comunes h3').first()).toHaveText('Padre nuestro');
    await expect(page.locator('#nov-common-prayers [data-lang="es"] .nov-prayer-text')).toHaveCount(3);
  });
});

test('los accesos rápidos dejan las secciones bajo el encabezado en móvil y escritorio', async ({ page }) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(NOVENA);
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('#primera-peticion details:not([data-lang])')).toHaveCSS('border-top-style', 'solid');
    for (const id of ['como-rezar', ...STEP_IDS, 'oracion-final']) {
      await page.locator(`.nov-index a[href="#${id}"]`).click();
      const geometry = await page.evaluate(targetId => ({
        headerBottom: document.querySelector('header').getBoundingClientRect().bottom,
        targetTop: document.getElementById(targetId).getBoundingClientRect().top,
      }), id);
      expect(geometry.targetTop, `${width}px #${id}`).toBeGreaterThanOrEqual(geometry.headerBottom - 1);
    }
  }
});

test.describe('sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('la novena y su menú se pueden usar después de instalar la caché', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      localStorage.setItem('tup_lang', 'es');
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async data => sessionStorage.setItem('offline-prayer-share', JSON.stringify(data)),
      });
    });
    await page.goto(NOVENA);
    await expect.poll(
      () => page.evaluate(() => navigator.serviceWorker.controller !== null),
      { timeout: 30_000, message: 'El service worker no llegó a controlar la página' },
    ).toBe(true);
    expect(await page.evaluate(async url => Boolean(await caches.match(url)), NOVENA)).toBe(true);
    expect(await page.evaluate(async url => Boolean(await caches.match(url)), `${NOVENA}index.html`)).toBe(true);
    expect(await page.evaluate(async () => Boolean(await caches.match('/assets/js/native-share.js')))).toBe(true);
    expect(await page.evaluate(async () => Boolean(await caches.match('/assets/js/prayer-share.js')))).toBe(true);

    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('h1 [data-lang="es"]')).toBeVisible();
    await page.locator('#primera-peticion details:not([data-lang]) > summary').click();
    await expect(page.locator('#primera-peticion details:not([data-lang]) [data-lang="es"] h3').first()).toBeVisible();
    const share = page.locator('[data-share-control="novena-primera"]');
    await share.getByRole('button', { name: 'Compartir esta oración' }).click();
    await expect(share.getByRole('status')).toHaveText('Se abrió el menú para compartir.');
    const shared = await page.evaluate(() => JSON.parse(sessionStorage.getItem('offline-prayer-share')));
    expect(new URL(shared.url).hash).toBe('#oracion-novena-primera-es');
    await page.locator('#hamburgerBtn').click();
    await expect(page.locator(`#sideNav a[href="${NOVENA}"]`)).toBeVisible();
  });
});

test.describe('actualización de recursos compartidos', () => {
  test.use({ serviceWorkers: 'allow' });

  test('el menú y los estilos nuevos sustituyen a una caché HTTP antigua y siguen disponibles offline', async ({ page, context }) => {
    test.setTimeout(60_000);
    const worker = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    /** @type {'old' | 'fresh' | 'latest'} */
    let revision = 'old';
    const colors = { old: 'rgb(255, 0, 0)', fresh: 'rgb(0, 128, 0)', latest: 'rgb(0, 0, 255)' };
    const server = http.createServer((req, res) => {
      const pathname = new URL(req.url || '/', 'http://127.0.0.1').pathname;
      res.setHeader('Connection', 'close');
      if (pathname === '/sw.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-cache' });
        res.end(worker);
      } else if (pathname === '/assets/js/menu.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'public, max-age=3600' });
        res.end(`document.documentElement.dataset.menuRevision = '${revision}';`);
      } else if (pathname === '/assets/css/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css', 'Cache-Control': 'public, max-age=3600' });
        res.end(`#probe { color: ${colors[revision]}; }`);
      } else if (pathname === '/adoracion/33dias/dia-01.json') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' });
        res.end(JSON.stringify({ revision }));
      } else if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=3600' });
        res.end(`<!doctype html><link rel="stylesheet" href="/assets/css/styles.css"><p id="probe">probe</p><p id="shell-version">${revision}</p><script src="/assets/js/menu.js"></script>`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('cached');
      }
    });

    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('No se pudo iniciar el servidor de prueba');

    try {
      await page.goto(`http://127.0.0.1:${address.port}/`);
      await expect(page.locator('html')).toHaveAttribute('data-menu-revision', 'old');
      await expect(page.locator('#probe')).toHaveCSS('color', colors.old);
      expect(await page.evaluate(() => fetch('/adoracion/33dias/dia-01.json').then(response => response.json())))
        .toEqual({ revision: 'old' });

      revision = 'fresh';
      await page.evaluate(() => navigator.serviceWorker.register('/sw.js'));
      await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
      const cached = await page.evaluate(async () => {
        const menu = await caches.match('/assets/js/menu.js');
        const css = await caches.match('/assets/css/styles.css');
        const html = await caches.match('/');
        const day = await caches.match('/adoracion/33dias/dia-01.json');
        if (!menu || !css || !html || !day) throw new Error('Faltan recursos en la caché');
        return { menu: await menu.text(), css: await css.text(), html: await html.text(), day: await day.json() };
      });
      expect(cached.menu).toContain("'fresh'");
      expect(cached.css).toContain(colors.fresh);
      expect(cached.html).toContain('<p id="shell-version">fresh</p>');
      expect(cached.day).toEqual({ revision: 'fresh' });

      revision = 'latest';
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-menu-revision', 'latest');
      await expect(page.locator('#probe')).toHaveCSS('color', colors.latest);
      await expect.poll(() => page.evaluate(async () => {
        const response = await caches.match('/assets/js/menu.js');
        return response ? response.text() : '';
      })).toContain("'latest'");
      await expect.poll(() => page.evaluate(async () => {
        const response = await caches.match('/assets/css/styles.css');
        return response ? response.text() : '';
      })).toContain(colors.latest);

      await context.setOffline(true);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-menu-revision', 'latest');
      await expect(page.locator('#probe')).toHaveCSS('color', colors.latest);
    } finally {
      await context.setOffline(false);
      await new Promise(resolve => server.close(resolve));
    }
  });
});
