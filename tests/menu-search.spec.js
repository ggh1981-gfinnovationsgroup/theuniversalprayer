// @ts-check
const { test, expect } = require('@playwright/test');

const PAGES = ['/', '/maria/', '/tentaciones/', '/intercesor/?intercesor=guadalupe', '/historias/'];

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

for (const path of PAGES) {
  test(`el menú busca secciones por palabras y sin acentos en ${path}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
    await page.goto(path);

    const toggle = page.locator('#hamburgerBtn');
    const nav = page.locator('#sideNav');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.locator('.side-nav-title:visible')).toHaveText('Menú');
    const search = nav.getByRole('searchbox', { name: 'Buscar en el menú' });
    await expect(search).toHaveAttribute('aria-controls', 'sideNavList');
    const total = await nav.locator('#sideNavList li').count();
    expect(total).toBeGreaterThan(30);

    await search.fill('corazon novena sagrado');
    await expect(nav.locator('#sideNavList li:visible')).toHaveCount(1);
    await expect(nav.locator('.side-nav-novenasagradocorazon')).toBeVisible();
    await expect(nav.locator('.side-nav-saints')).toBeHidden();

    await search.fill('maria');
    await expect(nav.locator('.side-nav-maria')).toBeVisible();

    await search.fill('sin-coincidencias-xyz');
    await expect(nav.locator('#sideNavList li:visible')).toHaveCount(0);
    await expect(nav.getByRole('status')).toHaveText('No se encontraron elementos del menú.');

    await search.fill('');
    await expect(nav.getByRole('status')).toBeHidden();
    await expect(nav.locator('#sideNavList li:visible')).toHaveCount(total);
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(errors).toEqual([]);
  });
}

for (const path of PAGES) {
  test(`el idioma y la búsqueda del menú se mantienen sincronizados en ${path}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
    await page.goto(path);
    await page.locator('#hamburgerBtn').click();
    await page.getByRole('searchbox', { name: 'Buscar en el menú' }).fill('novena');
    await page.locator('#sideNavClose').click();
    await page.locator('#langToggle').click();
    await page.locator('#hamburgerBtn').click();

    const nav = page.locator('#sideNav');
    await expect(nav.locator('.side-nav-title:visible')).toHaveText('Menu');
    const search = nav.getByRole('searchbox', { name: 'Search the menu' });
    await expect(search).toHaveValue('novena');
    await expect(nav.locator('.side-nav-novenasagradocorazon')).toBeVisible();
    await expect(nav.locator('.side-nav-novenasagradocorazon')).toContainText('Sacred Heart Novena');

    await search.fill('nothing-matches-xyz');
    await expect(nav.getByRole('status')).toHaveText('No menu items found.');
    await search.fill('mercy');
    const result = nav.locator('.side-nav-misericordia');
    await expect(result).toBeVisible();
    await result.click();
    await expect(page).toHaveURL(/\/misericordia\/$/);
  });
}

test('el buscador del menú cabe y funciona en una pantalla pequeña', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
  await page.goto('/');
  await page.locator('#hamburgerBtn').click();
  const search = page.getByRole('searchbox', { name: 'Buscar en el menú' });
  await search.focus();
  await page.keyboard.type('rosario');
  await expect(page.locator('#sideNav .side-nav-rosario')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test.describe('menú sin conexión', () => {
  test.use({ serviceWorkers: 'allow' });

  test('el buscador funciona después de instalar la caché', async ({ page, context }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null), { timeout: 30_000 }).toBe(true);
    await context.setOffline(true);
    try {
      await page.goto('/tentaciones/');
      await page.locator('#hamburgerBtn').click();
      await page.getByRole('searchbox', { name: 'Buscar en el menú' }).fill('reconciliacion');
      await expect(page.locator('#sideNav .side-nav-reconciliacion')).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
