// @ts-check
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['tentaciones', 'dopamina', 'insiste-y-liberate', 'vuelvo-al-padre', 'nomascastigo', 'emergencias', 'control-y-confianza',
  'maria', 'rosario', 'medalla-milagrosa', 'medalla-san-benito', 'novena-sagrado-corazon', 'viacrucis', 'salmos-diarios',
  'diablo', 'renacer-en-cristo', 'oraciones', 'musica', 'meses', 'bella-virtud', 'talentos', 'quien-soy', 'ezequiel-16'];
const SW = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');

test('cada ilustración es un SVG estático, ligero y precacheado', () => {
  for (const name of PAGES) {
    const file = `assets/images/${name}-hero.svg`;
    const svg = fs.readFileSync(path.join(ROOT, file), 'utf8');
    expect(svg, file).toMatch(/^\s*(<\?xml[^>]*>\s*)?<svg[\s>]/);
    expect(svg, file).not.toMatch(/<animate|<script|<style|@keyframes|<foreignObject|href="https?:/i);
    expect(Buffer.byteLength(svg), file).toBeLessThan(7 * 1024);
    expect(SW, file).toContain(`'/${file}'`);
    const html = fs.readFileSync(path.join(ROOT, name, 'index.html'), 'utf8');
    expect(html.match(new RegExp(`src="/${file}"`, 'g')), name).toHaveLength(1);
  }
});

test.describe('ilustraciones de cabecera', () => {
  test.use({ viewport: { width: 320, height: 720 } });

  for (const name of PAGES) {
    test(`${name} muestra su ilustración sin desbordar a 320 px`, async ({ page }) => {
      await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
      if (name === 'diablo') await page.route('**/diablo/', async route => {
        const res = await route.fetch();
        await route.fulfill({ response: res, body: (await res.text()).replace(/<meta http-equiv="refresh"[^>]*>/i, '').replace(/location\.(replace|href)\s*\(?[^;]*;?/g, '') });
      });
      await page.addInitScript(() => localStorage.setItem('tup_lang', 'es'));
      await page.goto(`/${name}/`);
      const img = page.locator(`img.tup-hero-art[src="/assets/images/${name}-hero.svg"]`);
      await expect(img).toBeVisible();
      await expect.poll(() => img.evaluate(el => /** @type {HTMLImageElement} */ (el).complete && /** @type {HTMLImageElement} */ (el).naturalWidth)).toBeGreaterThan(0);
      expect(await img.getAttribute('alt')).toMatch(/\S.*·.*\S/);
      const box = await img.boundingBox();
      expect(box && box.width).toBeGreaterThan(150);
      expect(box && box.x).toBeGreaterThanOrEqual(0);
      expect(box && box.x + box.width).toBeLessThanOrEqual(320);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
