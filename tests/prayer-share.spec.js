// @ts-check
const { test, expect } = require('@playwright/test');

const PAGES = [
  { path: '/maria/', count: 12, anchor: 'oracion-maria-amparo' },
  { path: '/emergencias/', count: 16, anchor: 'pray-ansiedad' },
  { path: '/novena-sagrado-corazon/', count: 5, anchor: 'oracion-novena-salve' },
];

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

async function mockSharing(page, mode, language) {
  await page.addInitScript(({ mode, language }) => {
    if (window !== window.top || location.hostname !== '127.0.0.1') return;
    localStorage.setItem('tup_lang', language);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: mode === 'unsupported' ? undefined : data => {
        sessionStorage.setItem('prayer-share-activation', String(navigator.userActivation.isActive));
        if (mode === 'cancel') return Promise.reject(new DOMException('Cancelled', 'AbortError'));
        if (mode === 'error') return Promise.reject(new DOMException('Share denied', 'NotAllowedError'));
        sessionStorage.setItem('prayer-share-payload', JSON.stringify(data));
        if (mode === 'pending') return new Promise(resolve => { window.completePrayerShare = resolve; });
        return Promise.resolve();
      },
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => sessionStorage.setItem('prayer-clipboard', 'attempted') },
    });
    document.execCommand = command => {
      if (command === 'copy') sessionStorage.setItem('prayer-legacy-copy', 'attempted');
      return true;
    };
  }, { mode, language });
}

async function openAncestors(locator) {
  await locator.evaluate(element => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
  });
}

for (const item of PAGES) {
  for (const language of ['es', 'en']) {
    test(`comparte cada oración de ${item.path} y abre su enlace exacto en ${language}`, async ({ page, context }) => {
      test.setTimeout(120_000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await mockSharing(page, 'native', language);
      await page.goto(item.path);
      const prayers = page.locator(`[data-share-prayer][data-lang="${language}"]`);
      await expect(prayers).toHaveCount(item.count);
      await expect(page.locator('[data-share-control]')).toHaveCount(item.count);
      const keys = await prayers.evaluateAll(elements => elements.map(element => element.dataset.sharePrayer));
      const ids = await prayers.evaluateAll(elements => elements.map(element => element.id));
      expect(new Set(keys).size).toBe(item.count);
      expect(new Set(ids).size).toBe(item.count);

      const recipient = await context.newPage();
      recipient.on('pageerror', error => errors.push(error.message));
      await recipient.addInitScript(value => {
        if (window === window.top && location.hostname === '127.0.0.1') localStorage.setItem('tup_lang', value);
      }, language === 'es' ? 'en' : 'es');

      for (const key of keys) {
        await test.step(`oración ${key}`, async () => {
          const prayer = page.locator(`[data-share-prayer="${key}"][data-lang="${language}"]`);
          await openAncestors(prayer);
          const data = await prayer.evaluate(element => {
            const lang = element.dataset.lang;
            const section = element.closest('.emerg-details, .maria-card, .maria-mantle, .nov-panel');
            const heading = section.querySelector(
              `.emerg-summary-title[data-lang="${lang}"], h2 [data-lang="${lang}"], h3 [data-lang="${lang}"]`
            );
            return {
              id: element.id,
              text: element.textContent.trim(),
              title: element.dataset.shareTitle || heading.textContent.trim(),
            };
          });
          const wrap = page.locator(`[data-share-control="${key}"]`);
          await expect(wrap).toHaveCount(1);
          const button = wrap.getByRole('button', { name: language === 'es' ? 'Compartir esta oración' : 'Share this prayer' });
          await button.click();
          await expect(wrap.getByRole('status')).toHaveText(language === 'es' ? 'Se abrió el menú para compartir.' : 'Share menu opened.');
          const payload = await page.evaluate(() => JSON.parse(sessionStorage.getItem('prayer-share-payload')));
          const url = new URL(payload.url);
          expect(url.pathname).toBe(item.path);
          expect(url.searchParams.get('lang')).toBe(language);
          expect(url.hash).toBe(`#${data.id}`);
          expect(payload).toEqual({
            title: data.title,
            text: [
              data.title,
              data.text,
              language === 'en' ? 'Read this prayer on The Universal Prayer:' : 'Lee esta oración en The Universal Prayer:',
            ].join('\n\n'),
            url: url.href,
          });

          await recipient.goto(payload.url);
          await expect(recipient.locator('html')).toHaveAttribute('lang', language);
          const target = recipient.locator(`[id="${data.id}"]`);
          await expect(target).toBeVisible();
          expect((await target.textContent()).trim()).toBe(data.text);
          expect(await target.evaluate(element => {
            for (let parent = element.parentElement; parent; parent = parent.parentElement) {
              if (parent.tagName === 'DETAILS' && !parent.open) return false;
            }
            return true;
          })).toBe(true);
        });
      }

      expect(await page.evaluate(() => sessionStorage.getItem('prayer-share-activation'))).toBe('true');
      expect(await page.evaluate(() => sessionStorage.getItem('prayer-clipboard'))).toBeNull();
      expect(await page.evaluate(() => sessionStorage.getItem('prayer-legacy-copy'))).toBeNull();
      expect(errors).toEqual([]);
      await recipient.close();
    });
  }

  for (const { mode, language } of [
    { mode: 'unsupported', language: 'es' },
    { mode: 'unsupported', language: 'en' },
    { mode: 'cancel', language: 'es' },
    { mode: 'error', language: 'en' },
  ]) {
    test(`${item.path}: ${mode} no copia ni oculta errores (${language})`, async ({ page }) => {
      const logged = [];
      page.on('console', message => { if (message.type() === 'error') logged.push(message.text()); });
      await mockSharing(page, mode, language);
      await page.goto(item.path);
      const wrap = page.locator('[data-share-control]').first();
      await openAncestors(wrap);
      const button = wrap.locator('button');
      await button.click();
      const status = wrap.getByRole('status');
      if (mode === 'unsupported') {
        await expect(status).toContainText(language === 'es' ? 'no admite el menú nativo' : 'does not support native sharing');
      } else if (mode === 'cancel') {
        await expect(status).toBeEmpty();
      } else {
        await expect(status).toContainText('Could not open the share menu');
        expect(logged.some(message => message.includes('No se pudo abrir'))).toBe(true);
      }
      await expect(button).toBeEnabled();
      expect(await page.evaluate(() => sessionStorage.getItem('prayer-clipboard'))).toBeNull();
      expect(await page.evaluate(() => sessionStorage.getItem('prayer-legacy-copy'))).toBeNull();
    });
  }

  test(`${item.path}: compartir funciona con teclado en móvil`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await mockSharing(page, 'native', 'es');
    await page.goto(item.path);
    const wrap = page.locator('[data-share-control]').first();
    await openAncestors(wrap);
    const button = wrap.locator('button');
    await button.scrollIntoViewIfNeeded();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(wrap.getByRole('status')).toHaveText('Se abrió el menú para compartir.');
    await expect(button).toBeFocused();
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    expect(await page.evaluate(() => sessionStorage.getItem('prayer-share-activation'))).toBe('true');
  });

  test(`${item.path}: cambiar de idioma durante el diálogo no muestra un aviso obsoleto`, async ({ page }) => {
    await mockSharing(page, 'pending', 'es');
    await page.goto(item.path);
    const wrap = page.locator('[data-share-control]').first();
    await openAncestors(wrap);
    const button = wrap.locator('button');
    await button.click();
    await expect(button).toBeDisabled();
    await page.locator('#langToggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(button).toHaveAccessibleName('Share this prayer');
    await expect(button.locator('[data-lang="es"]')).toBeHidden();
    await page.evaluate(() => window.completePrayerShare());
    await expect(button).toBeEnabled();
    await expect(wrap.getByRole('status')).toBeEmpty();
  });

  test(`${item.path}: el idioma elegido desde un enlace se conserva al recargar`, async ({ page }) => {
    await page.goto(`${item.path}?lang=es&ref=keep#${item.anchor}-es`);
    await expect(page.locator(`[id="${item.anchor}-es"]`)).toBeVisible();
    await page.locator('#langToggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const url = new URL(page.url());
    expect(url.searchParams.get('lang')).toBe('en');
    expect(url.searchParams.get('ref')).toBe('keep');
    expect(url.hash).toBe(`#${item.anchor}-en`);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator(`[id="${item.anchor}-en"]`)).toBeVisible();
  });
}

test('el enlace compartido no arrastra parámetros ajenos a la oración', async ({ page }) => {
  await mockSharing(page, 'native', 'es');
  await page.goto('/maria/?lang=es&tracking=not-part-of-prayer#oracion-maria-amparo-es');
  await page.locator('[data-share-control="maria-amparo"] button').click();
  const payload = await page.evaluate(() => JSON.parse(sessionStorage.getItem('prayer-share-payload')));
  const url = new URL(payload.url);
  expect([...url.searchParams.keys()]).toEqual(['lang']);
  expect(url.hash).toBe('#oracion-maria-amparo-es');
  expect(payload.text).not.toContain('not-part-of-prayer');
});

test('las anclas anteriores de emergencias siguen abriendo sus secciones', async ({ page }) => {
  await page.goto('/emergencias/#ansiedad');
  await expect(page.locator('#sec-ansiedad')).toHaveJSProperty('open', true);
  await page.evaluate(() => { location.hash = '#ira'; });
  await expect(page.locator('#sec-ira')).toHaveJSProperty('open', true);
});

test.describe('enlaces de oraciones sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('una visita directa instala la caché y abre enlaces nuevos en las tres páginas', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.goto('/maria/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    expect(await page.evaluate(async () => Boolean(await caches.match('/maria/?lang=en')))).toBe(false);
    await context.setOffline(true);
    try {
      for (const item of PAGES) {
        await page.goto(`${item.path}?lang=en#${item.anchor}-en`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        const target = page.locator(`[id="${item.anchor}-en"]`);
        await expect(target).toBeVisible();
        await expect(page.locator('[data-share-control]')).toHaveCount(item.count);
      }
    } finally {
      await context.setOffline(false);
    }
  });

  test('la jornada principal funciona offline sin ignorar parámetros de otros recursos', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.goto('/maria/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    await context.setOffline(true);
    try {
      await page.goto('/adoracion/33dias/');
      const cards = page.locator('#a33List .a33-card');
      await expect(cards).toHaveCount(33);
      await expect(cards.first()).toBeEnabled();
      await cards.first().click();
      await expect(page.locator('#a33ModalOverlay')).toBeVisible();
      await expect(page.locator('#mdDayNum')).toHaveText('Día 1');

      await page.goto('/adoracion/?jornada=adoracion&dia=1&lang=en');
      await expect(page.locator('#a33ModalOverlay')).toBeVisible();
      await expect(page.locator('#mdDayNum')).toHaveText('Day 1');
      await expect(page.evaluate(() => fetch('/data/misericordia.json?offline-query=1'))).rejects.toThrow();
    } finally {
      await context.setOffline(false);
    }
  });
});
