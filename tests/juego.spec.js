// @ts-check
const { test, expect } = require('@playwright/test');

test('el juego inicia, responde a los controles y cambia de idioma', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/juego/');
  await expect(page).toHaveTitle(/Camino de la esperanza/);
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.locator('#overlayTitle')).toHaveText('Camino de la esperanza');
  expect(await page.locator('#gameCanvas').evaluate(canvas => canvas.getContext('webgl') !== null)).toBe(true);

  await page.locator('#playButton').click();
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.keyboard.down('ArrowUp');
  await page.keyboard.down('Space');
  await page.waitForTimeout(450);
  await page.keyboard.up('ArrowUp');
  await page.keyboard.up('Space');
  await expect(page.locator('#starCount')).toHaveText(/^[1-5]$/);

  await page.locator('#languageToggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#gameTitle')).toHaveText('Path of Hope');
  expect(errors).toEqual([]);
});

test('abajo retrocede y arriba avanza hacia la capilla', async ({ page }) => {
  await page.goto('/juego/');
  await page.locator('#playButton').click();

  await page.keyboard.down('ArrowDown');
  await page.keyboard.down('Space');
  await page.waitForTimeout(350);
  await page.keyboard.up('ArrowDown');
  await page.keyboard.up('Space');
  await expect(page.locator('#starCount')).toHaveText('0');

  await page.keyboard.press('KeyR');
  await page.keyboard.down('ArrowUp');
  await page.keyboard.down('Space');
  await page.waitForTimeout(450);
  await page.keyboard.up('ArrowUp');
  await page.keyboard.up('Space');
  await expect(page.locator('#starCount')).toHaveText(/^[1-5]$/);
});

test('la cámara acompaña el movimiento sostenido sin perder el contexto 3D', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/juego/');
  await page.locator('#playButton').click();

  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1400);
  await page.keyboard.up('ArrowUp');
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  expect(await page.locator('#gameCanvas').evaluate(canvas => canvas.getContext('webgl')?.getError())).toBe(0);
  expect(errors).toEqual([]);
});

test('el menú del sitio incluye el catálogo de juegos', async ({ page }) => {
  await page.goto('/');
  await page.locator('#hamburgerBtn').click();
  await expect(page.locator('#sideNav a[href="/juegos/"]')).toHaveText(/Games|Juegos/);
});

test('el botón táctil de salto se traduce con el idioma del juego', async ({ page }) => {
  await page.goto('/juego/');
  await expect(page.locator('#jumpButton')).toHaveText('SALTAR');
  await expect(page.locator('#jumpButton')).toHaveAttribute('aria-label', 'Saltar');
  await page.locator('#languageToggle').click();
  await expect(page.locator('#jumpButton')).toHaveText('JUMP');
  await expect(page.locator('#jumpButton')).toHaveAttribute('aria-label', 'Jump');
  await expect(page.locator('[data-key="ArrowUp"]')).toHaveAttribute('aria-label', 'Move forward');
});

test('el catálogo muestra Camino de la esperanza y enlaza al juego', async ({ page }) => {
  await page.goto('/juegos/');
  await expect(page).toHaveTitle(/Juegos/);
  const gameCard = page.locator('.games-card[href="/juego/"]');
  await expect(gameCard).toHaveAttribute('href', '/juego/');
  await expect(gameCard).toContainText('Camino de la esperanza');
  await page.locator('#langToggle').click();
  await expect(gameCard).toContainText('Path of Hope');
});

test('el catálogo incluye la aventura de Felipe Neri', async ({ page }) => {
  await page.goto('/juegos/');
  const gameCard = page.locator('.games-card[href="/juegos/felipe-neri/"]');
  await expect(gameCard).toContainText('Felipe y el Oratorio');
  await page.locator('#langToggle').click();
  await expect(gameCard).toContainText('Philip and the Oratory');
});

test('Felipe acompaña a los niños hasta el Oratorio y todos cantan', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/juegos/felipe-neri/');
  await expect(page).toHaveTitle(/Felipe y el Oratorio/);
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await page.locator('#playButton').click();

  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1000);
  await page.keyboard.up('ArrowUp');
  await expect(page.locator('#interactButton')).toBeVisible();
  await expect(page.locator('#interactButton')).toHaveText('Compartir pan');
  await page.locator('#interactButton').click();
  await expect(page.locator('#interactButton')).toHaveText('Ofrecer una Biblia y rezar');
  await page.locator('#interactButton').click();
  await expect(page.locator('#childrenCount')).toHaveText('1');
  await expect(page.locator('#childDialogue')).toContainText('Sí, quiero ir al Oratorio contigo');
  await page.locator('#languageToggle').click();
  await expect(page.locator('#childDialogue')).toContainText('Yes, I would like to visit the Oratory with you.');
  await page.locator('#languageToggle').click();
  await expect(page.locator('#childDialogue')).toContainText('Sí, quiero ir al Oratorio contigo');

  for (const expectedCount of ['2', '3']) {
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(1300);
    await page.keyboard.up('ArrowUp');
    await expect(page.locator('#interactButton')).toBeVisible();
    await expect(page.locator('#childName')).toHaveText(expectedCount === '2' ? 'Luca' : 'Rosa');
    await expect(page.locator('#interactButton')).toHaveText('Compartir pan');
    await page.locator('#interactButton').click();
    await expect(page.locator('#interactButton')).toHaveText('Ofrecer una Biblia y rezar');
    await page.locator('#interactButton').click();
    await expect(page.locator('#childrenCount')).toHaveText(expectedCount);
  }

  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(2200);
  await page.keyboard.up('ArrowUp');
  await expect(page.locator('#choirBanner')).toBeVisible();
  await expect(page.locator('#choirBanner')).toContainText('¡Todos cantan en el Oratorio!');
  expect(await page.locator('#gameCanvas').evaluate(canvas => canvas.getContext('webgl')?.getError())).toBe(0);
  expect(errors).toEqual([]);
});

for (const section of ['ninos', 'jovenes']) {
  test(`${section} enlaza al catálogo de juegos`, async ({ page }) => {
    await page.goto(`/${section}/`);
    await expect(page.locator('.games-promo[href="/juegos/"]')).toBeVisible();
    await page.locator('#langToggle').click();
    await expect(page.locator('.games-promo')).toContainText(/Games|games/);
  });
}

test('el juego 3D se adapta a pantallas móviles y muestra los controles táctiles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/juego/');
  await expect(page.locator('.touch-controls')).toBeVisible();
  await page.locator('#playButton').click();
  await expect(page.locator('#gameCanvas')).toBeVisible();
  expect(await page.locator('#gameCanvas').evaluate(canvas => canvas.getContext('webgl')?.getError())).toBe(0);
});
