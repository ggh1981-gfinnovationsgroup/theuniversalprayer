// @ts-check
const { test, expect } = require('@playwright/test');

const NUEVOS = [
  { slug: 'misericordia', tituloEs: 'Jesús Misericordioso', tituloEn: 'Divine Mercy', total: '5' },
  { slug: 'san-judas', tituloEs: 'San Judas Tadeo', tituloEn: 'Saint Jude Thaddeus', total: '3' },
  { slug: 'divino-nino', tituloEs: 'Divino Niño Jesús', tituloEn: 'Divine Child Jesus', total: '3' },
  { slug: 'inmaculado-corazon', tituloEs: 'Inmaculado Corazón de María', tituloEn: 'Immaculate Heart of Mary', total: '5' },
  { slug: 'sagrado-corazon', tituloEs: 'Sagrado Corazón de Jesús', tituloEn: 'Sacred Heart of Jesus', total: '5' },
];

async function overflowX(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test('el catálogo muestra los siete juegos y cambia de idioma', async ({ page }) => {
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/');
  await expect(page.locator('.games-card')).toHaveCount(7);
  for (const juego of NUEVOS) {
    await expect(page.locator(`.games-card[href="/juegos/${juego.slug}/"]`)).toHaveCount(1);
  }
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await page.click('#langToggle');
  await expect(page.locator('.games-card[href="/juegos/misericordia/"] strong[data-lang="en"]')).toHaveText('Divine Mercy');
  await expect(page.locator('.games-card[href="/juegos/sagrado-corazon/"] strong[data-lang="en"]')).toHaveText('Sacred Heart of Jesus');
  expect(errores).toEqual([]);
});

for (const juego of NUEVOS) {
  test(`el juego ${juego.slug} carga a 320px, sin desborde y comienza`, async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(`/juegos/${juego.slug}/`);
    await expect(page.locator('#gameTitle')).toHaveText(juego.tituloEs);
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(100);
    expect(await overflowX(page)).toBeLessThanOrEqual(0);
    await expect(page.locator('.quest-counter')).toContainText(juego.total);
    await page.click('#playButton');
    await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowUp');
    expect(errores).toEqual([]);
  });
}

test('el juego de misericordia cambia a inglés con el botón del encabezado', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/juegos/misericordia/');
  await page.click('#languageToggle');
  await expect(page.locator('#gameTitle')).toHaveText('Divine Mercy');
  await expect(page.locator('#overlayTitle')).toHaveText('The rays of mercy');
});

for (const ruta of ['/juego/', '/juegos/felipe-neri/']) {
  test(`sin desborde a 320px en el juego anterior ${ruta}`, async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(ruta);
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(100);
    expect(await overflowX(page)).toBeLessThanOrEqual(0);
    expect(errores).toEqual([]);
  });
}
