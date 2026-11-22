const { test, expect } = require('@playwright/test');

// Alta de Cristo Rey (2026-11-22): registro completo en datos, buscador,
// calendario de fiestas, grupos temáticos, precache y cuento de niños.

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

test('cristorey: el archivo de datos carga completo en ambos idiomas', async ({ page }) => {
  const c = await getJson(page, '/data/cristorey.json');
  expect(c.id).toBe('cristorey');
  expect(c.image).toBe('/assets/images/cristorey.svg');
  expect(c).not.toHaveProperty('chaplet');
  for (const field of ['name', 'jaculatoria', 'feast_day', 'prayer', 'history', 'novena_prayers', 'litany', 'consecration', 'miracles']) {
    expect(c[field].es, `${field}.es`).toMatch(/\S/);
    expect(c[field].en, `${field}.en`).toMatch(/\S/);
  }
  expect(c.litany.available).toBe(true);
  expect(c.consecration.available).toBe(true);
  expect(c.miracles.available).toBe(true);
  expect(c.novena).toHaveLength(9);
  for (let day = 1; day <= 9; day++) {
    expect(c.novena[day - 1].day).toBe(day);
    expect(c.novena[day - 1].es).toMatch(/\S/);
    expect(c.novena[day - 1].en).toMatch(/\S/);
  }
});

test('cristorey: la historia trae los hechos y la Escritura completa verificada', async ({ page }) => {
  const c = await getJson(page, '/data/cristorey.json');
  expect(c.history.es).toContain('Pío XI');
  expect(c.history.es).toContain('1925');
  expect(c.history.es).toContain('Quas Primas');
  expect(c.history.es).toContain('Pablo VI');
  expect(c.history.es).toContain('1969');
  expect(c.history.es).toContain('Mi reino no es de este mundo');
  expect(c.history.es).toContain('Todo el que es de la verdad escucha mi voz');
  expect(c.history.es).toContain('Biblia CEE');
  expect(c.history.es).toContain('¡Viva Cristo Rey!');
  expect(c.history.es).toContain('Miguel Pro');
  expect(c.history.es).toContain('José Sánchez del Río');
  expect(c.history.en).toContain('Pius XI');
  expect(c.history.en).toContain('Quas Primas');
  expect(c.history.en).toContain('Paul VI');
  expect(c.history.en).toContain('My kingdom does not belong to this world');
  expect(c.history.en).toContain('Everyone who belongs to the truth listens to my voice');
  expect(c.history.en).toContain('New American Bible');
  expect(c.history.en).toContain('Long live Christ the King!');
});

test('cristorey: registro, palabras clave, calendario y grupo temático en main.js', async ({ page }) => {
  const main = await getText(page, '/assets/js/main.js');
  expect(main).toContain("id: 'cristorey'");
  expect(main).toContain("subdomain: 'cristorey'");
  expect(main).toContain('chaplet: false, novena: true');
  expect(main).toContain("color: '#5a2a82'");
  expect(main).toContain("es: 'Cristo Rey'");
  expect(main).toContain("en: 'Christ the King'");
  expect(main).toContain('Cristo Rey del Universo');
  expect(main).toContain('Christ the King of the Universe');
  expect(main).toContain('Reino de paz y justicia');
  expect(main).toContain('Kingdom of peace and justice');
  expect(main).toContain('cristorey:');
  expect(main).toContain('quas primas');
  expect(main).toContain('viva cristo rey');
  expect(main).toContain('miguel pro');
  expect(main).toContain('ultimo domingo');
  expect(main).toContain('fiesta movible');
  expect(main).toContain("'11-22': ['cristorey']");
  expect(main).toContain("'santotomasdeaquino', 'cristorey'");
});

test('cristorey: limpieza de palabras clave de Carlo Acutis', async ({ page }) => {
  const main = await getText(page, '/assets/js/main.js');
  const carloLine = main.split('\n').find((line) => line.includes('sancarlosacutis:'));
  expect(carloLine).toBeTruthy();
  expect(carloLine).not.toContain('mathaeus rios');
  expect(carloLine).not.toContain('valentina fidelis');
  expect(carloLine).not.toContain('cuerpo incorrupto');
  expect(carloLine).not.toContain('incorrupt body');
  expect(carloLine).toContain('mattheus vianna');
  expect(carloLine).toContain('valeria vargas valverde');
  expect(carloLine).toContain('leon xiv');
  expect(carloLine).toContain('leo xiv');
  expect(carloLine).toContain('7 de septiembre');
  expect(carloLine).toContain('september 7');
});

test('cristorey: imagen y precache en sw.js', async ({ page }) => {
  const svg = await getText(page, '/assets/images/cristorey.svg');
  expect(svg).toContain('<svg');
  expect(svg).toContain('viewBox="0 0 400 560"');
  const sw = await getText(page, '/sw.js');
  expect(sw).toContain("const CACHE = 'tup-v335';");
  expect(sw).toContain("'/data/cristorey.json'");
  expect(sw).toContain("'/assets/images/cristorey.svg'");
});

test('cristorey: el cuento quedó agregado al final sin alterar los anteriores', async ({ page }) => {
  const d = await getJson(page, '/data/ninos-cuentos.json');
  const items = d.cuentos || d;
  expect(items).toHaveLength(103);
  expect(items[101].id).toBe('santasofia');
  const last = items[items.length - 1];
  expect(last.id).toBe('cristorey');
  expect(last.saintId).toBe('cristorey');
  expect(last.icon).toBe('/assets/images/cristorey.svg');
  expect(items.slice(0, -1).some((x) => x.id === 'cristorey')).toBe(false);
  expect(last.story.es).toContain('¡Viva Cristo Rey!');
  expect(last.story.es).toContain('Mi reino no es de este mundo');
  expect(last.story.en).toContain('Long live Christ the King!');
  expect(last.story.en).toContain('My kingdom does not belong to this world');
  expect(last.title.es).toMatch(/\S/);
  expect(last.title.en).toMatch(/\S/);
  expect(last.moral.es).toMatch(/\S/);
  expect(last.moral.en).toMatch(/\S/);
  expect(last.activity.es).toMatch(/\S/);
  expect(last.activity.en).toMatch(/\S/);
});
