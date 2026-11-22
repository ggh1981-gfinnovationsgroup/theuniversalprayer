const { test, expect } = require('@playwright/test');

// Corrección de datos de Carlo Acutis (2026-11-22): la canonización la celebró
// León XIV el 7 de septiembre de 2025, no Francisco el 27 de abril de 2025.
// Los nombres de los milagros son Mattheus Vianna y Valeria Vargas Valverde.

async function getJson(page, url) {
  const resp = await page.request.get(url);
  expect(resp.ok()).toBeTruthy();
  return resp.json();
}

test('carlo acutis: la historia muestra la canonización por León XIV del 7 de septiembre de 2025', async ({ page }) => {
  const c = await getJson(page, '/data/sancarlosacutis.json');
  expect(c.history.es).toContain('León XIV');
  expect(c.history.es).toContain('7 de septiembre de 2025');
  expect(c.history.es).toContain('Pier Giorgio Frassati');
  expect(c.history.en).toContain('Leo XIV');
  expect(c.history.en).toContain('September 7, 2025');
  expect(c.history.en).toContain('Pier Giorgio Frassati');
});

test('carlo acutis: el 27 de abril de 2025 ya no aparece como fecha de canonización celebrada', async ({ page }) => {
  const c = await getJson(page, '/data/sancarlosacutis.json');
  const todo = JSON.stringify(c);
  expect(todo).not.toContain('Francisco lo canonizó');
  expect(todo).not.toContain('Francis canonized him');
  expect(todo).not.toContain('canonización celebrada el 27 de abril de 2025');
  expect(todo).not.toContain('canonization celebrated on April 27, 2025');
  expect(todo).not.toContain('homilía de canonización');
  expect(todo).not.toContain('canonization homily');
});

test('carlo acutis: los milagros llevan los nombres verificados', async ({ page }) => {
  const c = await getJson(page, '/data/sancarlosacutis.json');
  const todo = JSON.stringify(c);
  expect(todo).not.toContain('Mathaeus Rios');
  expect(todo).not.toContain('Valentina Fidelis');
  expect(c.miracles.es).toContain('Mattheus Vianna');
  expect(c.miracles.es).toContain('Valeria Vargas Valverde');
  expect(c.miracles.es).toContain('23 de mayo de 2024');
  expect(c.miracles.en).toContain('Mattheus Vianna');
  expect(c.miracles.en).toContain('Valeria Vargas Valverde');
  expect(c.miracles.en).toContain('May 23, 2024');
});

test('carlo acutis: el cuerpo ya no se afirma incorrupto', async ({ page }) => {
  const c = await getJson(page, '/data/sancarlosacutis.json');
  const todo = JSON.stringify(c).toLowerCase();
  expect(todo).not.toContain('incorrupto');
  expect(todo).not.toContain('incorrupt');
  expect(c.history.es).toContain('Sorrentino');
  expect(c.history.en).toContain('Sorrentino');
});

test('carlo acutis: el cuento de niños cierra con la canonización de 2025', async ({ page }) => {
  const d = await getJson(page, '/data/ninos-cuentos.json');
  const items = d.cuentos || d;
  const carlo = items.find((x) => x.id === 'carlo');
  expect(carlo).toBeTruthy();
  expect(carlo.story.es).toContain('León XIV lo declaró santo');
  expect(carlo.story.es).toContain('primer santo millennial');
  expect(carlo.story.en).toContain('Leo XIV declared him a saint');
  expect(carlo.story.en).toContain('first millennial saint');
});
