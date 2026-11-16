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
  await expect(page.locator('#qs-preview')).toContainText('Yo soy Guillermo.');
  await expect(page.locator('#qs-preview')).toContainText('Nunca estoy solo');
  const href = await page.locator('#qs-wa').getAttribute('href');
  expect(href).toContain('https://wa.me/?text=');
  expect(href).toContain('Guillermo');
  expect(href).toContain('theuniversalprayer.com%2Fquien-soy');
  await expect(page.getByText('Compartir por WhatsApp')).toBeVisible();
});

test('quien soy: en inglés la declaración y el botón cambian de idioma', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#langToggle').click();
  await expect(page.getByText('For we are his handiwork, created in Christ Jesus for the good works')).toBeVisible();
  await page.fill('#qs-name', 'William');
  await expect(page.locator('#qs-preview')).toContainText('I am William.');
  await expect(page.locator('#qs-preview')).toContainText('I am never alone');
  await expect(page.getByText('Share on WhatsApp')).toBeVisible();
});

test('quien soy: tocar una declaración muestra su explicación personalizada', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'Guillermo');
  await page.getByRole('button', { name: 'Soy libre' }).click();
  await expect(page.locator('#qs-explain')).toBeVisible();
  await expect(page.locator('#qs-explain-title')).toHaveText('Soy libre');
  await expect(page.locator('#qs-explain-body')).toContainText('Guillermo, esto quiere decir');
  await expect(page.locator('#qs-explain-body')).toContainText('ninguna cadena define tu futuro');
});

test('quien soy: el nombre se guarda en el dispositivo y se recuerda al volver', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.fill('#qs-name', 'Guillermo');
  await page.reload();
  await expect(page.locator('#qs-name')).toHaveValue('Guillermo');
  await expect(page.locator('#qs-preview')).toContainText('Yo soy Guillermo.');
});

test('quien soy: el menú incluye la página', async ({ page }) => {
  await page.goto('/quien-soy/');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#hamburgerBtn').click();
  await expect(page.locator('#sideNav a[href="/quien-soy/"]')).toBeVisible();
});
