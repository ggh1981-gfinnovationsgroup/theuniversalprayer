// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const SECTIONS = ['es-dios', 'persona', 'hablarle-como-dios', 'oraciones-iglesia', 'saludo-diario', 'en-la-biblia', 'sacramentos', 'frutos', 'en-la-tentacion', 'papas', 'pecado-contra', 'dones', 'sequedad'];

async function open(page, lang) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  await page.addInitScript(value => localStorage.setItem('tup_lang', value), lang);
  await page.goto('/espiritu/');
  return errors;
}

async function readRef(page, sectionId, lang, text) {
  const ref = page.locator(`#${sectionId} details.tup-ref[data-lang="${lang}"]`).filter({ hasText: text }).first();
  await ref.locator('summary').click();
  await expect(ref.locator('.tup-ref-verse').first()).toBeVisible();
  return ref;
}

test('el HTML del Espíritu Santo no tiene enlaces externos ni barras escapadas', () => {
  const html = fs.readFileSync(path.join(ROOT, 'espiritu', 'index.html'), 'utf8');
  expect(html).not.toMatch(/<a [^>]*href="https?:\/\//);
  expect(html).not.toContain('\\"');
  expect(html).not.toMatch(/[!?]\.<|adoración en la noche|adorns You/);
  expect(html).toContain("navigator.serviceWorker.register('/sw.js')");
  for (const id of SECTIONS) {
    expect(html.match(new RegExp(`id="${id}"`, 'g')), id).toHaveLength(1);
    expect(html, `índice → ${id}`).toContain(`href="#${id}"`);
  }
  expect(html).toContain('El Espíritu Santo no es un ayudante subordinado: es Dios');
  expect(html).toContain('When He helps you, God Himself is personally at work in you');
  expect(html).toContain('La Trinidad no son tres dioses, sino un solo Dios en tres Personas');
});

for (const lang of ['es', 'en']) {
  test(`todas las secciones se ven en ${lang} sin mezclar idiomas`, async ({ page }) => {
    const errors = await open(page, lang);
    const other = lang === 'es' ? 'en' : 'es';
    for (const id of SECTIONS) {
      const section = page.locator(`#${id}`);
      await expect(section, id).toBeVisible();
      await expect(section.locator(`h2[data-lang="${lang}"]`).first(), id).toBeVisible();
      await expect(section.locator(`h2[data-lang="${other}"]`).first(), id).toBeHidden();
    }
    const subtitle = page.locator(`.esp-subtitle[data-lang="${lang}"]`);
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText(lang === 'es' ? 'no es un ayudante subordinado' : 'not a subordinate assistant');
    await expect(subtitle).toContainText(lang === 'es' ? 'Los tres son un solo Dios' : 'The three are one God');
    await expect(page.locator(`.esp-toc-links a[data-lang="${lang}"]`)).toHaveCount(SECTIONS.length);
    await expect(page.locator(`#sequedad div[data-lang="${lang}"]`).first()).toBeVisible();
    await expect(page.locator(`#sequedad div[data-lang="${other}"]`).first()).toBeHidden();
    await expect(page.locator('#frutos .esp-fruits').filter({ visible: true }).locator('li')).toHaveCount(12);
    expect(errors).toEqual([]);
  });
}

test('las citas clave se abren con su texto en español', async ({ page }) => {
  await open(page, 'es');
  await expect(await readRef(page, 'papas', 'es', 'Dominum')).toContainText('Persona-amor');
  await expect(await readRef(page, 'pecado-contra', 'es', '1864')).toContainText('No hay límites a la misericordia');
  await expect(await readRef(page, 'es-dios', 'es', 'Hechos 5')).toContainText('No has engañado a hombres, sino a Dios');
  await expect(page.locator('#oraciones-iglesia')).toContainText('Veni, Creator Spiritus');
});

test('las citas clave se abren con su texto en inglés', async ({ page }) => {
  await open(page, 'en');
  await expect(await readRef(page, 'papas', 'en', 'Dominum')).toContainText('Person-Love');
  await expect(await readRef(page, 'pecado-contra', 'en', '1864')).toContainText('no limits to the mercy of God');
  await expect(page.locator('#oraciones-iglesia')).toContainText('Veni, Creator Spiritus');
});

test('el índice lleva a la sección y cambia de idioma', async ({ page }) => {
  await open(page, 'es');
  await page.locator('.esp-toc-links a[data-lang="es"][href="#frutos"]').click();
  await expect(page).toHaveURL(/#frutos$/);
  await expect(page.locator('#frutos')).toBeInViewport();
  await page.locator('#langToggle').click();
  await expect(page.locator('#frutos h2[data-lang="en"]')).toBeVisible();
  await expect(page.locator('#frutos h2[data-lang="es"]')).toBeHidden();
});

test('no hay desbordamiento horizontal a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const lang of ['es', 'en']) {
    await open(page, lang);
    await page.locator(`details.tup-ref[data-lang="${lang}"]`).evaluateAll(list => list.forEach(d => { d.open = true; }));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, lang).toBeLessThanOrEqual(1);
  }
});

test.describe('Espíritu Santo sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('las secciones y citas se leen offline', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.goto('/espiritu/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    await context.setOffline(true);
    try {
      await page.goto('/espiritu/?lang=es#papas');
      const ref = await readRef(page, 'papas', 'es', 'Dominum');
      await expect(ref).toContainText('Persona-don');
    } finally {
      await context.setOffline(false);
    }
  });
});
