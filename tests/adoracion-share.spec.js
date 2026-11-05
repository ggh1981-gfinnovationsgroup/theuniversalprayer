// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const JOURNEYS = [
  { id: 'adoracion', folder: '33dias', prefix: 'a33', content: 'md', toggle: 'ador33Toggle' },
  { id: 'sangre', folder: '33dias-sangre', prefix: 'ps33', content: 'ps33', toggle: 'adorSangre33Toggle' },
  { id: 'misericordia', folder: '33dias-misericordia', prefix: 'dm33', content: 'dm33', toggle: 'adorMis33Toggle' },
  { id: 'familia', folder: '33dias-familia', prefix: 'fam33', content: 'fam33', toggle: 'adorFam33Toggle' },
  { id: 'salud', folder: '33dias-salud', prefix: 'sal33', content: 'sal33', toggle: 'adorSalud33Toggle' },
  { id: 'conversion', folder: '33dias-conversion', prefix: 'conv33', content: 'conv33', toggle: 'adorConv33Toggle' },
  { id: 'enemigos', folder: '33dias-enemigos', prefix: 'ene33', content: 'ene33', toggle: 'adorEne33Toggle' },
];

/** @param {string} folder @param {number} day */
function loadDay(folder, day) {
  const file = path.join(__dirname, '..', 'adoracion', folder, `dia-${String(day).padStart(2, '0')}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

/** @param {import('@playwright/test').Page} page @param {string} mode @param {string} language */
async function mockSharing(page, mode, language) {
  await page.addInitScript(({ mode, language }) => {
    if (window !== window.top || window.location.hostname !== '127.0.0.1') return;
    localStorage.setItem('tup_lang', language);
    sessionStorage.removeItem('shared-day');
    sessionStorage.removeItem('copied-day');
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: ['native', 'cancel', 'share-error'].includes(mode)
        ? async data => {
          if (mode === 'cancel') throw new DOMException('Cancelled', 'AbortError');
          if (mode === 'share-error') throw new DOMException('Share denied', 'NotAllowedError');
          sessionStorage.setItem('shared-day', JSON.stringify(data));
        }
        : undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: mode.startsWith('legacy') ? undefined : {
        writeText: async text => {
          if (mode === 'clipboard-error') throw new DOMException('Copy denied', 'NotAllowedError');
          sessionStorage.setItem('copied-day', text);
        },
      },
    });
    if (mode.startsWith('legacy')) {
      document.execCommand = command => {
        if (mode === 'legacy-error') return false;
        const input = document.querySelector('.a33-share-wrap textarea');
        if (command !== 'copy' || !(input instanceof HTMLTextAreaElement)) return false;
        sessionStorage.setItem('copied-day', input.value);
        return true;
      };
    }
  }, { mode, language });
}

/** @param {import('@playwright/test').Page} page */
async function getPayload(page) {
  const stored = await page.evaluate(() => sessionStorage.getItem('shared-day'));
  if (!stored) throw new Error('No se recibió el contenido para compartir');
  return JSON.parse(stored);
}

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

for (const journey of JOURNEYS) {
  for (const language of ['es', 'en']) {
    test(`compartir los 33 días de ${journey.id} y abrir cada enlace (${language})`, async ({ page, context }) => {
      test.setTimeout(180_000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await mockSharing(page, 'native', language);
      await page.goto('/adoracion/');
      await page.locator(`#${journey.toggle}`).click();
      const heading = await page.locator(`#${journey.toggle} .ador-33dias-title[data-lang="${language}"]`).innerText();
      const cards = page.locator(`#${journey.prefix}List .a33-card`);
      const overlay = page.locator(`#${journey.prefix}ModalOverlay`);
      await expect(cards).toHaveCount(33);

      const recipient = await context.newPage();
      recipient.on('pageerror', error => errors.push(error.message));
      await recipient.addInitScript(value => {
        if (window === window.top && window.location.hostname === '127.0.0.1') localStorage.setItem('tup_lang', value);
      }, language === 'es' ? 'en' : 'es');

      for (let day = 1; day <= 33; day++) {
        await test.step(`día ${day}: cita, oración y enlace directo`, async () => {
          const data = loadDay(journey.folder, day);
          await cards.nth(day - 1).click();
          const shareButton = overlay.getByRole('button', { name: language === 'en' ? 'Share verse and prayer' : 'Compartir cita y oración' });
          await expect(shareButton).toBeInViewport();
          await shareButton.click();
          await expect(overlay.getByRole('status')).toHaveText(language === 'en' ? 'Shared.' : 'Compartido.');
          const payload = await getPayload(page);
          const title = `${heading.trim()} — ${language === 'en' ? 'Day' : 'Día'} ${day}: ${data.theme[language]}`;
          const url = new URL('/adoracion/', page.url());
          url.searchParams.set('jornada', journey.id);
          url.searchParams.set('dia', String(day));
          url.searchParams.set('lang', language);
          expect(payload).toEqual({
            title,
            text: [
              title,
              `${data.verse[language]}\n(${data.verse.ref})`,
              `${language === 'en' ? 'Prayer of the Day' : 'Oración del Día'}\n${data.prayer[language]}`,
              language === 'en' ? 'Read the full day on The Universal Prayer:' : 'Lee el día completo en The Universal Prayer:',
            ].join('\n\n'),
            url: url.href,
          });
          await expect(page.locator(`#${journey.content}DoneCheck`)).not.toBeChecked();

          await recipient.goto(payload.url);
          await expect(recipient.locator(`#${journey.toggle}`)).toHaveAttribute('aria-expanded', 'true');
          await expect(recipient.locator('.a33-modal-overlay:visible')).toHaveCount(1);
          await expect(recipient.locator('html')).toHaveAttribute('lang', language);
          await expect(recipient.locator(`#${journey.content}DayNum`)).toHaveText(`${language === 'en' ? 'Day' : 'Día'} ${day}`);
          await expect(recipient.locator(`#${journey.content}Title`)).toHaveText(data.theme[language]);
          await expect(recipient.locator(`#${journey.content}Verse .a33-verse-text`)).toHaveText(data.verse[language]);
          await expect(recipient.locator(`#${journey.content}Verse .a33-verse-ref`)).toHaveText(data.verse.ref);
          await expect(recipient.locator(`#${journey.content}Prayer`)).toHaveText(data.prayer[language]);
          await expect(recipient.locator(`#${journey.content}DoneCheck`)).not.toBeChecked();
          await expect(recipient.locator(`#${journey.prefix}ModalClose`)).toBeFocused();
          await page.locator(`#${journey.prefix}ModalClose`).click();
        });
      }

      await expect(page.locator(`#${journey.prefix}DoneCount`)).toHaveText('0');
      expect(errors).toEqual([]);
      await recipient.close();
    });
  }
}

for (const language of ['es', 'en']) {
  test(`la vista independiente permite compartir sus 33 días (${language})`, async ({ page }) => {
    test.setTimeout(90_000);
    await mockSharing(page, 'native', language);
    await page.goto('/adoracion/33dias/');
    const cards = page.locator('#a33List .a33-card');
    await expect(cards).toHaveCount(33);
    for (let day = 1; day <= 33; day++) {
      const data = loadDay('33dias', day);
      await cards.nth(day - 1).click();
      await page.locator('.a33-share-btn').click();
      const payload = await getPayload(page);
      expect(payload.text).toContain(data.verse[language]);
      expect(payload.text).toContain(data.verse.ref);
      expect(payload.text).toContain(data.prayer[language]);
      expect(new URL(payload.url).pathname).toBe('/adoracion/');
      expect(new URL(payload.url).searchParams.get('jornada')).toBe('adoracion');
      expect(new URL(payload.url).searchParams.get('dia')).toBe(String(day));
      expect(new URL(payload.url).searchParams.get('lang')).toBe(language);
      await page.locator('#a33ModalClose').click();
    }
  });

  test(`sin menú nativo copia cita, oración y enlace (${language})`, async ({ page }) => {
    await mockSharing(page, 'clipboard', language);
    await page.goto(`/adoracion/?jornada=enemigos&dia=7&lang=${language}`);
    const overlay = page.locator('#ene33ModalOverlay');
    const data = loadDay('33dias-enemigos', 7);
    await overlay.locator('.a33-share-btn').click();
    await expect(overlay.getByRole('status')).toHaveText(language === 'en' ? 'Verse, prayer, and link copied.' : 'Cita, oración y enlace copiados.');
    const text = await page.evaluate(() => sessionStorage.getItem('copied-day'));
    expect(text).toContain(data.verse[language]);
    expect(text).toContain(data.verse.ref);
    expect(text).toContain(data.prayer[language]);
    expect(text).toContain(`/adoracion/?jornada=enemigos&dia=7&lang=${language}`);
  });
}

test('cancelar Compartir no copia ni informa un error', async ({ page }) => {
  await mockSharing(page, 'cancel', 'es');
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/adoracion/?jornada=enemigos&dia=1&lang=es');
  const button = page.locator('#ene33ModalOverlay .a33-share-btn');
  await button.click();
  await expect(button).toBeEnabled();
  await expect(page.locator('#ene33ModalOverlay .a33-share-status')).toBeEmpty();
  expect(await page.evaluate(() => sessionStorage.getItem('copied-day'))).toBeNull();
  expect(errors.filter(message => message.includes('compartir') || message.includes('copiar'))).toEqual([]);
});

test('un fallo del menú nativo se informa y permite copiar el contenido', async ({ page }) => {
  await mockSharing(page, 'share-error', 'es');
  await page.goto('/adoracion/?jornada=enemigos&dia=1&lang=es');
  const overlay = page.locator('#ene33ModalOverlay');
  await overlay.locator('.a33-share-btn').click();
  await expect(overlay.getByRole('status')).toHaveText('No se pudo abrir Compartir. Se copiaron la cita, la oración y el enlace.');
  expect(await page.evaluate(() => sessionStorage.getItem('copied-day'))).toContain(loadDay('33dias-enemigos', 1).prayer.es);
  await expect(overlay.locator('.a33-share-btn')).toBeEnabled();
});

for (const mode of ['clipboard-error', 'legacy', 'legacy-error']) {
  test(`portapapeles: ${mode}`, async ({ page }) => {
    await mockSharing(page, mode, 'es');
    await page.goto('/adoracion/?jornada=enemigos&dia=1&lang=es');
    const overlay = page.locator('#ene33ModalOverlay');
    const button = overlay.locator('.a33-share-btn');
    await button.click();
    await expect(button).toBeEnabled();
    await expect(overlay.locator('textarea')).toHaveCount(0);
    const copied = await page.evaluate(() => sessionStorage.getItem('copied-day'));
    if (mode === 'legacy') {
      await expect(overlay.getByRole('status')).toHaveText('Cita, oración y enlace copiados.');
      expect(copied).toContain(loadDay('33dias-enemigos', 1).prayer.es);
      expect(copied).toContain('/adoracion/?jornada=enemigos&dia=1&lang=es');
      await expect(button).toBeFocused();
    } else {
      await expect(overlay.getByRole('status')).toHaveText('No se pudo compartir ni copiar. Inténtalo de nuevo o copia el texto manualmente.');
      expect(copied).toBeNull();
    }
  });
}

test('compartir otro día no reutiliza los parámetros del enlace recibido', async ({ page }) => {
  await mockSharing(page, 'native', 'es');
  await page.goto('/adoracion/?jornada=enemigos&dia=1&lang=es&tracking=privado');
  await page.locator('#ene33ModalClose').click();
  await page.locator('#ene33List .a33-card').nth(32).click();
  await page.locator('#ene33ModalOverlay .a33-share-btn').click();
  const payload = await getPayload(page);
  const url = new URL('/adoracion/', page.url());
  url.search = '?jornada=enemigos&dia=33&lang=es';
  expect(payload.url).toBe(url.href);
  expect(payload.text).not.toContain('privado');
  expect(payload.text).toContain(loadDay('33dias-enemigos', 33).prayer.es);
});

test('el cambio de idioma mantiene el contenido visible y compartido sincronizado', async ({ page }) => {
  await mockSharing(page, 'native', 'es');
  await page.goto('/adoracion/');
  for (const journey of JOURNEYS) {
    await page.locator(`#${journey.toggle}`).click();
    await page.locator(`#${journey.prefix}List .a33-card`).nth(16).click();
    const overlay = page.locator(`#${journey.prefix}ModalOverlay`);
    await overlay.locator('.a33-share-btn').click();
    await expect(overlay.getByRole('status')).toHaveText('Compartido.');
    await page.locator('#langToggle').dispatchEvent('click');
    await expect(overlay.locator('.a33-share-status')).toBeEmpty();
    await expect(overlay.getByRole('status')).toBeAttached();
    const data = loadDay(journey.folder, 17);
    await expect(page.locator(`#${journey.content}Prayer`)).toHaveText(data.prayer.en);
    await overlay.getByRole('button', { name: 'Share verse and prayer' }).click();
    const payload = await getPayload(page);
    expect(payload.text).toContain(data.verse.en);
    expect(payload.text).toContain(data.prayer.en);
    expect(new URL(payload.url).searchParams.get('lang')).toBe('en');
    await page.locator(`#${journey.prefix}ModalClose`).click();
    await page.locator('#langToggle').click();
    await expect(page.locator(`#${journey.prefix}List .a33-card-title`).nth(16)).toHaveText(data.theme.es);
  }
});

test('los enlaces malformados no abren ni solicitan un día arbitrario', async ({ page }) => {
  const messages = [];
  const dayRequests = [];
  page.on('dialog', async dialog => { messages.push(dialog.message()); await dialog.accept(); });
  page.on('request', request => {
    if (/\/dia-.*\.json/.test(request.url())) dayRequests.push(request.url());
  });
  await page.addInitScript(() => {
    if (window === window.top && window.location.hostname === '127.0.0.1') localStorage.setItem('tup_lang', 'es');
  });
  const queries = [
    'jornada=desconocida&dia=1', 'jornada=enemigos&dia=0', 'jornada=enemigos&dia=34',
    'jornada=enemigos&dia=1.5', 'jornada=enemigos&dia=-1', 'jornada=enemigos',
    'dia=2', 'jornada=enemigos&dia=1&lang=fr',
  ];
  for (const query of queries) {
    await page.goto(`/adoracion/?${query}`);
    await expect(page.locator('.a33-modal-overlay:visible')).toHaveCount(0);
  }
  expect(messages).toHaveLength(queries.length);
  expect(messages.every(message => message.includes('no es válido'))).toBe(true);
  expect(dayRequests).toEqual([]);
});

test('un día no disponible muestra el error y puede abrirse al recargar', async ({ page }) => {
  const messages = [];
  page.on('dialog', async dialog => { messages.push(dialog.message()); await dialog.accept(); });
  const unavailable = '**/adoracion/33dias-enemigos/dia-17.json';
  await page.route(unavailable, route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/adoracion/?jornada=enemigos&dia=17&lang=es');
  await expect.poll(() => messages.length).toBe(1);
  expect(messages[0]).toContain('No se pudo cargar el día compartido');
  await expect(page.locator('.a33-modal-overlay:visible')).toHaveCount(0);
  await expect(page.locator('#ene33List .a33-card').nth(16)).toBeDisabled();
  await page.unroute(unavailable);
  await page.reload();
  await expect(page.locator('#ene33ModalOverlay')).toBeVisible();
  await expect(page.locator('#ene33DayNum')).toHaveText('Día 17');
});

test('cerrar la jornada mientras carga no deja la página bloqueada', async ({ page }) => {
  /** @type {() => void} */
  let release = () => { throw new Error('La espera de la prueba no se ha inicializado'); };
  const waiting = new Promise(resolve => { release = () => resolve(undefined); });
  await page.route('**/adoracion/33dias-enemigos/dia-17.json', async route => {
    await waiting;
    await route.continue();
  });
  await page.goto('/adoracion/?jornada=enemigos&dia=17&lang=es');
  await expect(page.locator('#adorEne33Toggle')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#adorEne33Toggle').click();
  release();
  await expect(page.locator('#ene33List .a33-card').nth(16)).toBeEnabled();
  await expect(page.locator('#ene33ModalOverlay')).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await page.locator('#adorEne33Toggle').click();
  await page.locator('#ene33List .a33-card').nth(16).click();
  await expect(page.locator('#ene33ModalOverlay')).toBeVisible();
});

for (const { width, language } of [{ width: 320, language: 'es' }, { width: 390, language: 'en' }]) {
  test(`compartir en móvil mantiene el botón y la confirmación dentro de la pantalla (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await mockSharing(page, 'clipboard', language);
    await page.goto(`/adoracion/?jornada=salud&dia=33&lang=${language}`);
    const wrap = page.locator('#sal33ModalOverlay .a33-share-wrap');
    const button = wrap.locator('.a33-share-btn');
    await button.click();
    await expect(wrap.getByRole('status')).toHaveText(language === 'en'
      ? 'Verse, prayer, and link copied.' : 'Cita, oración y enlace copiados.');
    const box = await button.boundingBox();
    if (!box) throw new Error('El botón Compartir no tiene dimensiones visibles');
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.height).toBeGreaterThanOrEqual(44);
    const overflow = await wrap.evaluate(element => element.scrollWidth > element.clientWidth);
    expect(overflow).toBe(false);
  });
}
