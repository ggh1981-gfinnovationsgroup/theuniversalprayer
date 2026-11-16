// Encabezado: los tres botones de la derecha (correo, idioma y menú)
// comparten el mismo formato: misma altura, mismo radio de borde y
// el mismo espacio entre ellos, para que la barra se vea profesional.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('tup_lang', 'es'); } catch (e) {}
  });
});

for (const ruta of ['/', '/quien-soy/']) {
  test(`header: botones de correo, idioma y menú uniformes en ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    const fab = page.locator('#contactFab');
    const lang = page.locator('#langToggle');
    const burger = page.locator('#hamburgerBtn');
    await expect(fab).toBeVisible();
    await expect(lang).toBeVisible();
    await expect(burger).toBeVisible();

    const boxes = {};
    for (const [key, loc] of [['fab', fab], ['lang', lang], ['burger', burger]]) {
      boxes[key] = await loc.evaluate(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return { x: r.x, width: r.width, height: r.height, radius: cs.borderTopLeftRadius };
      });
    }

    // Misma altura en los tres botones.
    expect(Math.abs(boxes.fab.height - boxes.lang.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(boxes.lang.height - boxes.burger.height)).toBeLessThanOrEqual(1);
    // Mismo radio de borde (formato píldora en los tres).
    expect(boxes.fab.radius).toBe(boxes.lang.radius);
    expect(boxes.lang.radius).toBe(boxes.burger.radius);
    // Mismo espacio entre botones consecutivos.
    const gap1 = boxes.lang.x - (boxes.fab.x + boxes.fab.width);
    const gap2 = boxes.burger.x - (boxes.lang.x + boxes.lang.width);
    expect(Math.abs(gap1 - gap2)).toBeLessThanOrEqual(1);
  });
}
