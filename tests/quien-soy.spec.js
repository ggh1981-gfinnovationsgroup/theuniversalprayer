// Quién soy: identidad en Cristo con declaración personalizable y compartir por WhatsApp.
// La página trae Efesios 2,10 e Isaías 43,1 completos en los dos idiomas,
// nueve declaraciones, y una herramienta donde la persona escribe su nombre,
// ve su declaración y la comparte por WhatsApp con el enlace de la página.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('tup_lang', 'es'); } catch (e) {}
  });
});

test('quien soy: Efesios e Isaías completos en español con sus citas', async ({ page }) => {
  await page.goto('/quien-soy/');
  await expect(page.locator('h1:visible')).toHaveText('Quién soy');
  await expect(page.getByText('Somos, pues, obra suya. Dios nos ha creado en Cristo Jesús, para que nos dediquemos a las buenas obras')).toBeVisible();
  await expect(page.getByText('Efesios 2,10 (Biblia CEE, vatican.va)')).toBeVisible();
  await expect(page.getByText('te he llamado por tu nombre, tú eres mío')).toBeVisible();
  await expect(page.getByText('Isaías 43,1 (Biblia CEE, vatican.va)')).toBeVisible();
});

test('quien soy: las nueve declaraciones en español', async ({ page }) => {
  await page.goto('/quien-soy/');
  for (const t of ['Soy amado por Dios', 'Soy escogido', 'Soy perdonado', 'Soy libre',
    'Soy obra maestra de Dios', 'Soy fuerte', 'Soy capaz', 'Soy hijo de Dios', 'Nunca estoy solo']) {
    await expect(page.getByText(t, { exact: true })).toBeVisible();
  }
});

test('quien soy: el nombre personaliza la declaración y el enlace de WhatsApp', async ({ page }) => {
  await page.goto('/quien-soy/');
  await expect(page.locator('#qs-name')).toHaveAttribute('placeholder', 'Escribe tu nombre');
  await page.fill('#qs-name', 'Guillermo');
  await expect(page.locator('#qs-preview')).toContainText('• Nunca estoy solo');
  await expect(page.locator('#qs-preview')).toContainText('• Soy Guillermo');
  await expect(page.locator('#qs-final-name')).toHaveText('Soy Guillermo');
  await expect(page.locator('#qs-preview')).toContainText('Nunca estoy solo');
  await expect(page.locator('#qs-share-main')).toContainText('Crear imagen y compartir en WhatsApp');
});

test('quien soy: en inglés la declaración y el botón cambian de idioma', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#langToggle').click();
  await expect(page.getByText('For we are his handiwork, created in Christ Jesus for the good works')).toBeVisible();
  await page.fill('#qs-name', 'William');
  await expect(page.locator('#qs-preview')).toContainText('• I am William');
  await expect(page.locator('#qs-preview')).toContainText('I am never alone');
  await expect(page.getByText('Create image and share on WhatsApp')).toBeVisible();
});

test('quien soy: cada declaración se expande en su propio cuadro con la explicación personalizada', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'Guillermo');
  await page.getByRole('button', { name: 'Soy libre' }).click();
  const card4 = page.locator('.qs-aff-card[data-card="4"]');
  await expect(card4.locator('.qs-aff-explain')).toBeVisible();
  await expect(card4.locator('.qs-aff-explain')).toContainText('Guillermo, esto quiere decir');
  await expect(card4.locator('.qs-aff-explain')).toContainText('ninguna cadena define tu futuro');
  await page.getByRole('button', { name: 'Soy fuerte' }).click();
  await expect(card4.locator('.qs-aff-explain')).toBeHidden();
  await expect(page.locator('.qs-aff-card[data-card="6"] .qs-aff-explain')).toBeVisible();
});

test('quien soy: el nombre se guarda en el dispositivo y se recuerda al volver', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'Guillermo');
  await page.reload();
  await expect(page.locator('#qs-name')).toHaveValue('Guillermo');
  await expect(page.locator('#qs-preview')).toContainText('• Nunca estoy solo');
  await expect(page.locator('#qs-preview')).toContainText('• Soy Guillermo');
  await expect(page.locator('#qs-final-name')).toHaveText('Soy Guillermo');
});

test('quien soy: si es mujer, la declaración sale en femenino y se guarda', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'María');
  await page.locator('#qs-gf').click();
  await expect(page.locator('#qs-preview')).toContainText('Soy amada por Dios');
  await expect(page.locator('#qs-preview')).toContainText('• Nunca estoy sola');
  await expect(page.locator('#qs-preview')).toContainText('• Soy María');
  await expect(page.getByRole('button', { name: 'Soy amada por Dios' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Soy hija de Dios' })).toBeVisible();
  await page.reload();
  await expect(page.locator('#qs-preview')).toContainText('Soy amada por Dios');
});

test('quien soy: la imagen de la declaración se crea en la página', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'Guillermo');
  await page.locator('#qs-share-main').click();
  await expect(page.locator('#qs-img-preview')).toBeVisible();
  const w = await page.locator('#qs-img-preview').evaluate(img => img.naturalWidth);
  expect(w).toBe(1080);
  const href = await page.locator('#qs-img-download').getAttribute('href');
  expect(href).toContain('blob:');
});

test('quien soy: la imagen rediseñada conserva el formato vertical completo', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'Guillermo');
  await page.locator('#qs-share-main').click();
  await expect(page.locator('#qs-img-preview')).toBeVisible();
  const dims = await page.locator('#qs-img-preview').evaluate(img => ({ w: img.naturalWidth, h: img.naturalHeight }));
  expect(dims.w).toBe(1080);
  expect(dims.h).toBe(1350);
});

test('quien soy: el menú incluye la página', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#hamburgerBtn').click();
  await expect(page.locator('#sideNav a[href="/quien-soy/"]')).toBeVisible();
});
