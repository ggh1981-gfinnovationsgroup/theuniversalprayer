const { test, expect } = require('@playwright/test');

// Alta de San Martín de Porres (2026-11-22): archivo de datos completo,
// registro, buscador, calendario de fiestas, grupo temático y precache.
// Su cuento de niños ya existía; faltaba su archivo de santo.

async function getJson(page, url) {
  const resp = await page.request.get(url);
  expect(resp.ok()).toBeTruthy();
  return resp.json();
}

async function getText(page, url) {
  const resp = await page.request.get(url);
  expect(resp.ok()).toBeTruthy();
  return resp.text();
}

test('sanmartindeporres: el archivo de datos carga completo en ambos idiomas', async ({ page }) => {
  const c = await getJson(page, '/data/sanmartindelporres.json');
  expect(c.id).toBe('sanmartindelporres');
  expect(c.image).toBe('/assets/images/sanmartin.svg');
  for (const field of ['name', 'jaculatoria', 'feast_day', 'prayer', 'history', 'miracles']) {
    expect(c[field].es, `${field}.es`).toMatch(/\S/);
    expect(c[field].en, `${field}.en`).toMatch(/\S/);
  }
  expect(c.name.es).toBe('San Martín de Porres');
  expect(c.name.en).toBe('Saint Martin de Porres');
  expect(c.feast_day.es).toContain('3 de noviembre');
  expect(c.feast_day.en).toContain('November 3');
  // Novena, coronilla, letanía y consagración quedaron como no disponibles,
  // patrón respetado del borrador aprobado.
  expect(c.novena).toHaveLength(0);
  expect(c.novena_prayers.es).toBe('');
  expect(c.chaplet.available).toBe(false);
  expect(c.litany.available).toBe(false);
  expect(c.consecration.available).toBe(false);
  expect(c.miracles.available).toBe(true);
});

test('sanmartindeporres: historia y milagros con los datos verificados', async ({ page }) => {
  const c = await getJson(page, '/data/sanmartindelporres.json');
  expect(c.history.es).toContain('9 de diciembre de 1579');
  expect(c.history.es).toContain('Ana Velázquez');
  expect(c.history.es).toContain('3 de noviembre de 1639');
  expect(c.history.es).toContain('Gregorio XVI');
  expect(c.history.es).toContain('Juan XXIII');
  expect(c.history.es).toContain('6 de mayo de 1962');
  expect(c.history.en).toContain('December 9, 1579');
  expect(c.history.en).toContain('November 3, 1639');
  expect(c.history.en).toContain('John XXIII');
  expect(c.miracles.es).toContain('LA PIERNA DEL FRAILE QUE NO SE AMPUTÓ');
  expect(c.miracles.es).toContain('EL PERRO, EL GATO Y EL RATÓN');
  expect(c.miracles.es).toContain('Dorotea Caballero Escalante');
  expect(c.miracles.es).toContain('Antonio Cabrera Pérez');
  expect(c.miracles.en).toContain('Dorotea Caballero Escalante');
  expect(c.miracles.en).toContain('Antonio Cabrera Perez');
});

test('sanmartindeporres: registro, palabras clave, calendario y grupo temático en main.js', async ({ page }) => {
  const main = await getText(page, '/assets/js/main.js');
  expect(main).toContain("id: 'sanmartindelporres'");
  expect(main).toContain("subdomain: 'sanmartindelporres'");
  expect(main).toContain('chaplet: false, novena: false');
  expect(main).toContain("color: '#4a2c14'");
  expect(main).toContain("es: 'S. Martín Porres'");
  expect(main).toContain("en: 'St. Martin de Porres'");
  expect(main).toContain('San Martín de Porres');
  expect(main).toContain('Saint Martin de Porres');
  expect(main).toContain('Caridad y justicia social');
  expect(main).toContain('Charity & social justice');
  expect(main).toContain('sanmartindelporres:');
  expect(main).toContain('martin de la caridad');
  expect(main).toContain('bilocacion');
  expect(main).toContain('dorotea caballero');
  expect(main).toContain("'11-03': ['santasilvia', 'sanmartindelporres']");
  expect(main).toContain("'santaapolonia', 'sanmartindelporres'");
});

test('sanmartindeporres: imagen existente y precache en sw.js', async ({ page }) => {
  const svg = await getText(page, '/assets/images/sanmartin.svg');
  expect(svg).toContain('<svg');
  const sw = await getText(page, '/sw.js');
  expect(sw).toContain("const CACHE = 'tup-v336';");
  expect(sw).toContain("'/data/sanmartindelporres.json'");
  expect(sw).toContain("'/assets/images/sanmartin.svg'");
});

test('sanmartindeporres: su cuento de niños apunta a este santo', async ({ page }) => {
  const d = await getJson(page, '/data/ninos-cuentos.json');
  const items = d.cuentos || d;
  const story = items.find((x) => x.id === 'sanmartindelporres');
  expect(story).toBeTruthy();
  expect(story.saintId).toBe('sanmartindelporres');
  expect(story.icon).toBe('/assets/images/sanmartin.svg');
});
