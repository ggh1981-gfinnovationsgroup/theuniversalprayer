// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Ezequiel 16: Dios te dice «¡Vive!»', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ezequiel-16/');
  });

  test('presenta la apertura con el «¡Vive!» y la nota del papa Francisco', async ({ page }) => {
    await expect(page).toHaveTitle(/Ezequiel 16/);
    await expect(page.getByRole('heading', { name: 'Dios te encontró y te dijo: «¡Vive!»' })).toBeVisible();
    const intro = page.locator('.ezq-intro');
    await expect(intro).toContainText('¡Vive!');
    await expect(intro).toContainText('papa Francisco');
    await expect(intro).toContainText('Víctor Manuel Fernández');
    await expect(intro).toContainText('Miserando atque eligendo');
    await expect(intro).toContainText('los 63 versículos');
  });

  test('incluye el capítulo completo en seis partes con su cita en español', async ({ page }) => {
    const cards = page.locator('.ezq-card');
    await expect(cards).toHaveCount(6);
    for (let index = 0; index < 6; index += 1) {
      await expect(cards.nth(index).locator('.ezq-scripture[data-lang="es"]')).toHaveCount(1);
      await expect(cards.nth(index).locator('.ezq-scripture[data-lang="en"]')).toHaveCount(1);
    }
    await cards.nth(0).locator('summary').click();
    await expect(cards.nth(0).locator('.ezq-scripture[data-lang="es"]')).toContainText('Sigue viviendo, tú que yaces en tu sangre, sigue viviendo');
    await expect(cards.nth(0).locator('.ezq-scripture[data-lang="es"]')).toContainText('extendí mi manto sobre ti');
    await expect(cards.nth(0).locator('.ezq-scripture[data-lang="es"] cite')).toContainText('Ezequiel 16, 1-14 (Biblia CEE, vatican.va)');
    await cards.nth(5).locator('summary').click();
    await expect(cards.nth(5).locator('.ezq-scripture[data-lang="es"]')).toContainText('yo me acordaré de mi alianza contigo en los días de tu juventud');
    await expect(cards.nth(5).locator('.ezq-scripture[data-lang="es"]')).toContainText('cuando yo te perdone todo lo que hiciste');
  });

  test('muestra la oración y las fuentes con el diario del papa Francisco', async ({ page }) => {
    await expect(page.locator('.ezq-prayer')).toContainText('tú pasaste junto a mí cuando estaba en el suelo');
    await expect(page.locator('.ezq-note')).toContainText('El diario personal del papa Francisco');
    await expect(page.locator('.ezq-note')).toContainText('Libreria Editrice Vaticana, 2026');
  });

  test('cambia al inglés y muestra el capítulo en ese idioma', async ({ page }) => {
    await page.locator('#langToggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'God found you and said: “Live!”' })).toBeVisible();
    const cards = page.locator('.ezq-card');
    await cards.nth(0).locator('summary').click();
    const first = cards.nth(0).locator('.ezq-scripture[data-lang="en"]');
    await expect(first).toBeVisible();
    await expect(first).toContainText('“Live!”');
    await expect(first).toContainText('I spread the corner of my cloak over you');
    await expect(first.locator('cite')).toContainText('Ezekiel 16:1-14 (New American Bible, USCCB)');
    await cards.nth(5).locator('summary').click();
    await expect(cards.nth(5).locator('.ezq-scripture[data-lang="en"]')).toContainText('I will remember the covenant I made with you when you were young');
    await expect(cards.nth(5).locator('.ezq-scripture[data-lang="en"]')).toContainText('when I pardon you for all you have done');
  });

  test('incluye la sección en el menú lateral', async ({ page }) => {
    await page.locator('#hamburgerBtn').click();
    await expect(page.locator('#sideNav a[href="/ezequiel-16/"]')).toBeVisible();
  });

  test('enlaza a misericordia y reconciliación', async ({ page }) => {
    await expect(page.locator('.ezq-footer-links a[href="/misericordia/"][data-lang="es"]')).toBeVisible();
    await expect(page.locator('.ezq-footer-links a[href="/reconciliacion/"][data-lang="es"]')).toBeVisible();
  });
});

test.describe('Ezequiel 16 en pantalla angosta', () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test('no desborda horizontalmente a 320 px', async ({ page }) => {
    await page.goto('/ezequiel-16/');
    for (const card of await page.locator('.ezq-card summary').all()) {
      await card.click();
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
