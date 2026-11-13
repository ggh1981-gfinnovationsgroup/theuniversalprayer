// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Sabiduría para cada situación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sabiduria/');
  });

  test('presenta los libros sapienciales y orientaciones para distintas situaciones', async ({ page }) => {
    await expect(page).toHaveTitle(/Sabiduría para cada situación/);
    await expect(page.getByRole('heading', { name: 'Sabiduría para cada situación' })).toBeVisible();
    await expect(page.locator('.wis-intro')).toContainText('Proverbios, Sabiduría y Eclesiástico');
    await expect(page.locator('.wis-intro')).toContainText('Sirácida');
    await expect(page.locator('.wis-card')).toHaveCount(12);
  });

  test('filtra situaciones ignorando tildes y muestra sus referencias', async ({ page }) => {
    await page.locator('#wisSearch').fill('decisión');
    await expect(page.locator('.wis-card:visible')).toHaveCount(1);
    await expect(page.locator('.wis-card:visible')).toContainText('Proverbios 3,5-6');
    await page.locator('#wisSearch').fill('no existe');
    await expect(page.locator('.wis-card:visible')).toHaveCount(0);
    await expect(page.locator('#wisEmpty')).toBeVisible();
  });

  test('cambia al inglés y permite buscar una situación en ese idioma', async ({ page }) => {
    await page.locator('#langToggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Biblical wisdom for every situation' })).toBeVisible();
    await page.locator('#wisSearch').fill('grief');
    const griefCard = page.locator('.wis-card:visible');
    await expect(griefCard).toHaveCount(1);
    await griefCard.locator('summary').click();
    await expect(griefCard.locator('.wis-refs span[data-lang="en"]')).toContainText('Wisdom 3:1-9');
  });

  test('incluye la sección en el menú lateral', async ({ page }) => {
    await page.locator('#hamburgerBtn').click();
    await expect(page.locator('#sideNav a[href="/sabiduria/"]')).toBeVisible();
  });
});
