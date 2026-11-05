// @ts-check
const { test, expect } = require('@playwright/test');

// Each referenced prayer or verse must be readable on the page in a collapsible block.
const CASES = [
  { path: '/reconciliacion/', count: 2, es: 'me pesa de todo corazón', en: 'O my God, I am heartily sorry' },
  { path: '/difuntos/', count: 1, es: 'Gloria al Padre', en: 'Glory be to the Father' },
  { path: '/insiste-y-liberate/', count: 1, es: 'santificado sea tu nombre', en: 'hallowed be Thy name' },
  { path: '/jovenes/', count: 2, es: 'santificado sea tu nombre', en: 'hallowed be Thy name' },
  { path: '/maria/', count: 2, es: 'Creo en Dios, Padre Todopoderoso', en: 'I believe in God' },
  { path: '/viacrucis/', count: 1, es: 'me pesa de todo corazón', en: 'O my God, I am heartily sorry' },
  { path: '/cuaresma-san-miguel/', count: 1, es: 'Dios te salve, María', en: 'Hail Mary, full of grace' },
  { path: '/control-y-confianza/', count: 1, es: 'descansó el día séptimo', en: 'he rested on the seventh day' },
  { path: '/gloria-suprema/', count: 1, es: 'un par de gorriones', en: 'two sparrows' },
  { path: '/medalla-milagrosa/', count: 1, es: 'corona de doce estrellas', en: 'crown of twelve stars' },
  { path: '/nomascastigo/', count: 2, es: 'no me castigues con cólera', en: 'do not chastise me' },
  { path: '/vuelvo-al-padre/', count: 1, es: 'Ni este pecó ni sus padres', en: 'Neither he nor his parents sinned' },
  { path: '/salud/', count: 1, es: 'sacrificio vivo, santo', en: 'living sacrifice' },
  { path: '/tentaciones/', count: 1, es: 'Dios es fiel', en: 'God is faithful' },
];

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
});

for (const lang of ['es', 'en']) {
  for (const c of CASES) {
    test(`referencias desplegables ${lang} ${c.path}`, async ({ page }) => {
      await page.goto(c.path);
      await page.evaluate(l => localStorage.setItem('tup_lang', l), lang);
      await page.reload();

      const refs = page.locator(`details.tup-ref[data-lang="${lang}"]`);
      expect(await refs.count()).toBeGreaterThanOrEqual(c.count);

      const target = refs.filter({ hasText: c[lang] }).first();
      await expect(target).not.toHaveAttribute('open', '');
      // Open any enclosing collapsibles so the reference itself becomes reachable.
      await target.evaluate(el => {
        for (let p = el.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
      });
      await target.locator('summary').click();
      await expect(target).toHaveAttribute('open', '');
      await expect(target.locator('.tup-ref-body')).toContainText(c[lang]);
      await expect(target.locator('.tup-ref-body')).toBeVisible();
      await expect(page.locator(`details.tup-ref[data-lang="${lang === 'es' ? 'en' : 'es'}"]`).first()).toBeHidden();
    });
  }
}
