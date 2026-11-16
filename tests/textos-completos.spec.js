const { test, expect } = require('@playwright/test');

test('textos completos: reconciliación trae el Salmo 27 entero, no solo versículos escogidos', async ({ page }) => {
  await page.goto('/reconciliacion/');
  const bloque = page.locator('details.rec-verse', { hasText: 'Ver Salmo 27' }).first();
  await expect(bloque).toContainText('Escúchame, Señor');
  await expect(bloque).toContainText('Si mi padre y mi madre me abandonan');
  await expect(bloque).toContainText('ten ánimo, espera en el Señor');
  await expect(bloque).toContainText('Salmo 27, 1-14');
});

test('textos completos: reconciliación trae el Salmo 51 hasta el último versículo', async ({ page }) => {
  await page.goto('/reconciliacion/');
  const bloque = page.locator('details.rec-verse', { hasText: 'Ver Salmo 51 (oración de arrepentimiento)' }).first();
  await expect(bloque).toContainText('sobre tu altar se inmolarán novillos');
  await expect(bloque).toContainText('Salmo 51, 1-21');
});

test('textos completos: reconciliación trae Mateo 6 con el pasaje de los lirios', async ({ page }) => {
  await page.goto('/reconciliacion/');
  const bloque = page.locator('details.rec-verse', { hasText: 'Ver Mateo 6,25-34' }).first();
  await expect(bloque).toContainText('ni Salomón, en todo su fasto');
  await expect(bloque).toContainText('Mateo 6, 25-34');
});

test('textos completos: reconciliación trae el Salmo 130 con la línea de Israel', async ({ page }) => {
  await page.goto('/reconciliacion/');
  const bloque = page.locator('details.rec-verse', { hasText: 'Ver Salmo 130' }).first();
  await expect(bloque).toContainText('Aguarde Israel al Señor');
  await expect(bloque).toContainText('Salmo 130, 1-8');
});

test('textos completos: misericordia en inglés trae el Salmo 27 entero', async ({ page }) => {
  await page.goto('/misericordia/');
  const bloque = page.locator('details.mer-verse', { hasText: 'Psalm 27' }).first();
  await expect(bloque).toContainText('malicious and lying witnesses have risen against me');
  await expect(bloque).toContainText('Psalm 27:1-14');
});

test('textos completos: salmos diarios trae el Salmo 27 entero en la tarjeta del miedo', async ({ page }) => {
  await page.goto('/salmos-diarios/');
  await expect(page.locator('#miedo-es')).toContainText('Escúchame, Señor');
  await expect(page.locator('#miedo-es')).toContainText('Salmo 27, 1-14');
  await expect(page.locator('#miedo-en')).toContainText('Hear my voice, LORD, when I call');
  await expect(page.locator('#miedo-en')).toContainText('Psalm 27:1-14');
});
