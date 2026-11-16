// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Haz fructificar tus talentos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/talentos/');
  });

  test('presenta la parábola completa en español con su cita de la Biblia CEE', async ({ page }) => {
    await expect(page).toHaveTitle(/Haz fructificar tus talentos/);
    await expect(page.getByRole('heading', { name: 'Haz fructificar tus talentos' })).toBeVisible();
    await expect(page.locator('.tal-intro')).toContainText('Biblia CEE');
    await expect(page.locator('.tal-intro')).toContainText('New American Bible');
    const parable = page.locator('.tal-parable[data-lang="es"]');
    await expect(parable).toBeVisible();
    await expect(parable).toContainText('Quitadle el talento y dádselo al que tiene diez');
    await expect(parable).toContainText('el llanto y el rechinar de dientes');
    await expect(parable.locator('cite')).toContainText('Mateo 25, 14-30 (Biblia CEE, vatican.va)');
  });

  test('incluye tres claves con su texto bíblico en español e inglés', async ({ page }) => {
    const cards = page.locator('.tal-card');
    await expect(cards).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) {
      await expect(cards.nth(index).locator('.tal-verse[data-lang="es"]')).toHaveCount(1);
      await expect(cards.nth(index).locator('.tal-verse[data-lang="en"]')).toHaveCount(1);
    }
    await cards.first().locator('summary').click();
    await expect(cards.first().locator('.tal-verse[data-lang="es"]')).toContainText('multiforme gracia de Dios');
  });

  test('muestra el camino de cuatro pasos y la oración', async ({ page }) => {
    await expect(page.locator('.tal-step')).toHaveCount(4);
    await expect(page.locator('.tal-prayer')).toContainText('entra en el gozo de tu señor');
  });

  test('cambia al inglés y muestra la parábola en ese idioma', async ({ page }) => {
    await page.locator('#langToggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Make your talents bear fruit' })).toBeVisible();
    const parable = page.locator('.tal-parable[data-lang="en"]');
    await expect(parable).toBeVisible();
    await expect(parable).toContainText('share your master’s joy');
    await expect(parable).toContainText('wailing and grinding of teeth');
    await expect(parable.locator('cite')).toContainText('Matthew 25:14-30 (New American Bible, vatican.va)');
  });

  test('incluye la sección en el menú lateral', async ({ page }) => {
    await page.locator('#hamburgerBtn').click();
    await expect(page.locator('#sideNav a[href="/talentos/"]')).toBeVisible();
  });
});
