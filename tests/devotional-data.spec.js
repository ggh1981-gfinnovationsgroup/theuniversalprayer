// @ts-check
const { test, expect } = require('@playwright/test');

const SERIES = [
  'conversion',
  'familia',
  'misericordia',
  'salud',
  'sangre',
];

for (const series of SERIES) {
  test(`los 33 días de ${series} tienen datos bilingües válidos`, async ({ request }) => {
    for (let day = 1; day <= 33; day++) {
      await test.step(`día ${day}`, async () => {
        const url = `/adoracion/33dias-${series}/dia-${String(day).padStart(2, '0')}.json`;
        const response = await request.get(url);
        expect(response.status(), url).toBe(200);
        const data = JSON.parse((await response.text()).replace(/^\uFEFF/, ''));

        expect(data.n, url).toBe(day);
        for (const lang of ['es', 'en']) {
          for (const field of ['theme', 'verse', 'prayer', 'act']) {
            expect(data[field]?.[lang], `${url}: ${field}.${lang}`).toMatch(/\S/);
          }
          expect(Array.isArray(data.reflection?.[lang]), `${url}: reflection.${lang}`).toBe(true);
          expect(data.reflection[lang].length, `${url}: reflection.${lang}`).toBeGreaterThan(0);
          for (const paragraph of data.reflection[lang]) {
            expect(paragraph, `${url}: reflection.${lang}`).toMatch(/\S/);
          }
        }
      });
    }
  });
}

test('Nuestra Señora del Carmen tiene datos bilingües válidos', async ({ request }) => {
  const response = await request.get('/data/nuestrasenoracarmen.json');
  expect(response.status()).toBe(200);
  const data = JSON.parse((await response.text()).replace(/^\uFEFF/, ''));

  expect(data.id).toBe('nuestrasenoracarmen');
  for (const lang of ['es', 'en']) {
    for (const field of ['name', 'prayer', 'history']) {
      expect(data[field]?.[lang], `${field}.${lang}`).toMatch(/\S/);
    }
  }
});
