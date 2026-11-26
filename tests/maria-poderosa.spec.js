// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  await page.goto('/maria/');
  await page.evaluate(() => localStorage.setItem('tup_lang', 'es'));
  await page.reload();
});

test('la sección sobre el poder de María existe y el índice lleva a ella', async ({ page }) => {
  await expect(page.locator('#poderosa')).toHaveCount(1);
  await expect(page.locator('.maria-index a[href="#poderosa"]')).toHaveCount(1);
  await expect(page.locator('#poderosaTitle [data-lang="es"]')).toContainText('¿Por qué decimos que María es poderosa?');
});

test('el título y los textos cambian con el idioma', async ({ page }) => {
  const section = page.locator('#poderosa');
  await expect(section.locator('p[data-lang="es"]').first()).toBeVisible();
  await page.locator('#langToggle').click();
  await expect(page.locator('#poderosaTitle [data-lang="en"]')).toContainText('Why do we say that Mary is powerful?');
  await expect(section.locator('p[data-lang="en"]').first()).toBeVisible();
  await expect(section.locator('p[data-lang="es"]').first()).toBeHidden();
});

test('la sección trae completos los pasajes bíblicos y el Catecismo 970', async ({ page }) => {
  const section = page.locator('#poderosa');
  const verses = section.locator('details.tup-ref[data-lang="es"] .tup-ref-verse');
  await expect(verses.filter({ hasText: 'único también el mediador entre Dios y los hombres' })).toHaveCount(1);
  await expect(verses.filter({ hasText: 'Mujer, ahí tienes a tu hijo' })).toHaveCount(1);
  await expect(verses.filter({ hasText: 'Haced lo que él os diga' })).toHaveCount(1);
  await expect(verses.filter({ hasText: 'has guardado el vino bueno hasta ahora' })).toHaveCount(1);
  await expect(verses.filter({ hasText: 'La misión maternal de María para con los hombres' })).toHaveCount(1);
  const versesEn = section.locator('details.tup-ref[data-lang="en"] .tup-ref-verse');
  await expect(versesEn.filter({ hasText: 'one mediator between God and the human race' })).toHaveCount(1);
  await expect(versesEn.filter({ hasText: 'you have kept the good wine until now' })).toHaveCount(1);
});

test('sin desborde horizontal a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.reload();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
