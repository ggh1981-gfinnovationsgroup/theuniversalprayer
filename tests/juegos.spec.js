// @ts-check
const { test, expect } = require('@playwright/test');

async function overflowX(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function sinErrores(page) {
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));
  return errores;
}

test('el catálogo muestra los ocho juegos con su género y cambia de idioma', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/');
  await expect(page.locator('.games-card')).toHaveCount(8);
  for (const slug of ['misericordia', 'san-judas', 'divino-nino', 'inmaculado-corazon', 'sagrado-corazon', 'espiritu-santo']) {
    await expect(page.locator(`.games-card[href="/juegos/${slug}/"]`)).toHaveCount(1);
  }
  await expect(page.locator('.games-card[href="/juegos/espiritu-santo/"] .games-card-label[data-lang="es"]')).toHaveText('RPG 3D · AVENTURA COMPLETA');
  await expect(page.locator('.games-card[href="/juegos/misericordia/"] .games-card-label[data-lang="es"]')).toHaveText('CORREDOR 3D');
  await expect(page.locator('.games-card[href="/juegos/san-judas/"] .games-card-label[data-lang="es"]')).toHaveText('SUPERVIVENCIA 3D');
  await expect(page.locator('.games-card[href="/juegos/divino-nino/"] .games-card-label[data-lang="es"]')).toHaveText('PUZZLE');
  await expect(page.locator('.games-card[href="/juegos/inmaculado-corazon/"] .games-card-label[data-lang="es"]')).toHaveText('JARDÍN 3D');
  await expect(page.locator('.games-card[href="/juegos/sagrado-corazon/"] .games-card-label[data-lang="es"]')).toHaveText('PRECISIÓN 3D');
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await page.click('#langToggle');
  await expect(page.locator('.games-card[href="/juegos/misericordia/"] strong[data-lang="en"]')).toHaveText('Divine Mercy');
  expect(errores).toEqual([]);
});

test('misericordia corredor: carga a 320px, sin desborde, corre y cambia de carril', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/misericordia/');
  await expect(page.locator('#gameTitle')).toHaveText('Jesús Misericordioso');
  const box = await page.locator('#gameCanvas').boundingBox();
  expect(box.width).toBeGreaterThan(100);
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await expect(page.locator('.quest-counter')).toContainText('5');
  await page.click('#playButton');
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  await expect(page.locator('#npcName')).toContainText('♥');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  expect(errores).toEqual([]);
});

test('san judas supervivencia: carga a 320px, sin desborde y pulsa su luz', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/san-judas/');
  await expect(page.locator('#gameTitle')).toHaveText('San Judas Tadeo');
  const box = await page.locator('#gameCanvas').boundingBox();
  expect(box.width).toBeGreaterThan(100);
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await expect(page.locator('.quest-counter')).toContainText('12');
  await page.click('#playButton');
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  await expect(page.locator('#npcName')).toContainText('Esperanza del pueblo');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(400);
  await page.keyboard.up('ArrowUp');
  await page.keyboard.press('e');
  expect(errores).toEqual([]);
});

test('divino niño puzzle: escena 3D y tablero de 56 fichas a 320px, sin desborde y selecciona', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/divino-nino/');
  await expect(page.locator('#gameTitle')).toHaveText('Divino Niño Jesús');
  const escena = await page.locator('#gameCanvas').boundingBox();
  expect(escena.width).toBeGreaterThan(100);
  expect(escena.height).toBeGreaterThan(80);
  await expect(page.locator('#gameStage .tile')).toHaveCount(56);
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await page.click('#playButton');
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  await page.locator('#gameStage .tile').first().click();
  await expect(page.locator('#gameStage .tile.is-selected')).toHaveCount(1);
  await expect(page.locator('#npcName')).toContainText('Movimientos: 22');
  expect(errores).toEqual([]);
});

test('inmaculado jardín 3D: tarjeta de historia a 320px, sin desborde y Lucía camina', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/inmaculado-corazon/');
  await expect(page.locator('#gameTitle')).toHaveText('Inmaculado Corazón de María');
  const box = await page.locator('#gameCanvas').boundingBox();
  expect(box.width).toBeGreaterThan(100);
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await expect(page.locator('.quest-counter')).toContainText('22');
  await page.click('#playButton');
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  await expect(page.locator('#npcName')).toContainText('13 de mayo de 1917');
  await page.waitForTimeout(4200);
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowUp');
  expect(errores).toEqual([]);
});

test('sagrado precisión: carga a 320px, sin desborde y suelta una pieza', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/juegos/sagrado-corazon/');
  await expect(page.locator('#gameTitle')).toHaveText('Sagrado Corazón de Jesús');
  const box = await page.locator('#gameCanvas').boundingBox();
  expect(box.width).toBeGreaterThan(100);
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await expect(page.locator('.quest-counter')).toContainText('10');
  await page.click('#playButton');
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  await page.waitForTimeout(900);
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  expect(errores).toEqual([]);
});

test('el corredor de misericordia cambia a inglés con el botón del encabezado', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/juegos/misericordia/');
  await page.click('#languageToggle');
  await expect(page.locator('#gameTitle')).toHaveText('Divine Mercy');
  await expect(page.locator('#overlayTitle')).toHaveText('Run toward the light');
});

for (const ruta of ['/juego/', '/juegos/felipe-neri/']) {
  test(`sin desborde a 320px en el juego anterior ${ruta}`, async ({ page }) => {
    const errores = await sinErrores(page);
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
