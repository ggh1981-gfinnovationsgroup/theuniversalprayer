const { test, expect } = require('@playwright/test');

// Alta de San Martín de Tours (2026-11-22): archivo de datos completo,
// registro, buscador, calendario de fiestas y precache.
// Su cuento de niños (sanmartincapa) ya existía con saintId sanmartin.

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

test('sanmartin: el archivo de datos carga completo en ambos idiomas', async ({ page }) => {
  const c = await getJson(page, '/data/sanmartin.json');
  expect(c.id).toBe('sanmartin');
  expect(c.image).toBe('/assets/images/sanmartin.svg');
  for (const field of ['name', 'jaculatoria', 'feast_day', 'prayer', 'history', 'miracles']) {
    expect(c[field].es, `${field}.es`).toMatch(/\S/);
    expect(c[field].en, `${field}.en`).toMatch(/\S/);
  }
  expect(c.name.es).toBe('San Martín de Tours');
  expect(c.name.en).toBe('Saint Martin of Tours');
  expect(c.feast_day.es).toContain('11 de noviembre');
  expect(c.feast_day.en).toContain('November 11');
  // Novena, coronilla, letanía y consagración quedaron como no disponibles,
  // patrón respetado del borrador aprobado.
  expect(c.novena).toHaveLength(0);
  expect(c.novena_prayers.es).toBe('');
  expect(c.chaplet.available).toBe(false);
  expect(c.litany.available).toBe(false);
  expect(c.consecration.available).toBe(false);
  expect(c.miracles.available).toBe(true);
});

test('sanmartin: historia y milagros con los datos verificados', async ({ page }) => {
  const c = await getJson(page, '/data/sanmartin.json');
  expect(c.history.es).toContain('Amiens');
  expect(c.history.es).toContain('Hilario de Poitiers');
  expect(c.history.es).toContain('Ligugé');
  expect(c.history.es).toContain('371');
  expect(c.history.es).toContain('8 de noviembre de 397');
  expect(c.history.es).toContain('Candes');
  expect(c.history.es).toContain('Sulpicio Severo');
  expect(c.history.en).toContain('Amiens');
  expect(c.history.en).toContain('Hilary of Poitiers');
  expect(c.history.en).toContain('November 8, 397');
  expect(c.history.en).toContain('Sulpicius Severus');
  expect(c.miracles.es).toContain('LA CAPA PARTIDA EN AMIENS');
  expect(c.miracles.es).toContain('EL CATECÚMENO QUE VOLVIÓ A LA VIDA EN LIGUGÉ');
  expect(c.miracles.es).toContain('EL LEPROSO DE PARÍS SANADO CON UN BESO');
  expect(c.miracles.en).toContain('THE CLOAK SHARED AT AMIENS');
  expect(c.miracles.en).toContain('THE LEPER OF PARIS HEALED WITH A KISS');
});

test('sanmartin: registro, palabras clave y calendario en main.js', async ({ page }) => {
  const main = await getText(page, '/assets/js/main.js');
  expect(main).toContain("id: 'sanmartin'");
  expect(main).toContain("subdomain: 'sanmartin'");
  expect(main).toContain('chaplet: false, novena: false');
  expect(main).toContain("color: '#7a1f1f'");
  expect(main).toContain("es: 'S. Martín Tours'");
  expect(main).toContain("en: 'St. Martin of Tours'");
  expect(main).toContain('San Martín de Tours');
  expect(main).toContain('Saint Martin of Tours');
  expect(main).toContain('Compartir con el pobre');
  expect(main).toContain('Sharing with the poor');
  expect(main).toContain('sanmartin:');
  expect(main).toContain('martin de tours');
  expect(main).toContain('sulpicio severo');
  expect(main).toContain('amiens');
  expect(main).toContain("'11-11': ['sanmartin']");
});

test('sanmartin: imagen existente y precache en sw.js', async ({ page }) => {
  const svg = await getText(page, '/assets/images/sanmartin.svg');
  expect(svg).toContain('<svg');
  const sw = await getText(page, '/sw.js');
  expect(sw).toContain("const CACHE = 'tup-v337';");
  expect(sw).toContain("'/data/sanmartin.json'");
  expect(sw).toContain("'/assets/images/sanmartin.svg'");
});

test('sanmartin: su cuento de niños apunta a este santo', async ({ page }) => {
  const d = await getJson(page, '/data/ninos-cuentos.json');
  const items = d.cuentos || d;
  const story = items.find((x) => x.saintId === 'sanmartin');
  expect(story).toBeTruthy();
  expect(story.id).toBe('sanmartincapa');
  expect(story.icon).toBe('/assets/images/sanmartin.svg');
});
