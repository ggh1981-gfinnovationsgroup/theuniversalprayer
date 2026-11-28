// @ts-check
const { test, expect } = require('@playwright/test');

const PAGES = [
  { path: '/', name: 'la principal' },
  { path: '/maria/', name: 'maria' },
  { path: '/talentos/', name: 'talentos' },
  { path: '/ezequiel-16/', name: 'ezequiel-16' },
];

for (const { path, name } of PAGES) {
  test.describe(`Botón de compartir en ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('muestra el botón con la etiqueta del idioma activo', async ({ page }) => {
      const button = page.locator('.tup-page-share-button');
      await expect(button).toBeVisible();
      await expect(button.locator('span[data-lang="es"]')).toHaveText('Compartir esta página');
      await expect(button.locator('span[data-lang="en"]')).toHaveText('Share this page');
      const lang = await page.locator('html').getAttribute('lang');
      const active = lang === 'en' ? 'en' : 'es';
      const inactive = active === 'en' ? 'es' : 'en';
      await expect(button.locator(`span[data-lang="${active}"]`)).toBeVisible();
      await expect(button.locator(`span[data-lang="${inactive}"]`)).toBeHidden();
    });

    test('los enlaces de respaldo llevan la URL real de la página', async ({ page }) => {
      const encoded = encodeURIComponent(page.url());
      const whatsapp = page.locator('.tup-page-share-link[data-share-network="whatsapp"]');
      const facebook = page.locator('.tup-page-share-link[data-share-network="facebook"]');
      const x = page.locator('.tup-page-share-link[data-share-network="x"]');
      const telegram = page.locator('.tup-page-share-link[data-share-network="telegram"]');
      await expect(whatsapp).toHaveCount(1);
      await expect(facebook).toHaveCount(1);
      await expect(x).toHaveCount(1);
      await expect(telegram).toHaveCount(1);
      expect(await whatsapp.getAttribute('href')).toContain('https://wa.me/?text=');
      expect(await whatsapp.getAttribute('href')).toContain(encoded);
      expect(await facebook.getAttribute('href')).toBe(
        'https://www.facebook.com/sharer/sharer.php?u=' + encoded
      );
      expect(await x.getAttribute('href')).toContain('https://twitter.com/intent/tweet?');
      expect(await x.getAttribute('href')).toContain('url=' + encoded);
      expect(await telegram.getAttribute('href')).toContain('https://t.me/share/url?url=' + encoded);
      await expect(page.locator('.tup-page-share-copy')).toHaveCount(1);
    });

    test('sin menú nativo, el botón despliega los enlaces de respaldo', async ({ page }) => {
      const hasNativeShare = await page.evaluate(() => typeof navigator.share === 'function');
      test.skip(hasNativeShare, 'Este navegador sí ofrece el menú nativo de compartir');
      await page.locator('.tup-page-share-button').click();
      await expect(page.locator('.tup-page-share-link[data-share-network="whatsapp"]')).toBeVisible();
      await expect(page.locator('.tup-page-share-link[data-share-network="facebook"]')).toBeVisible();
      await expect(page.locator('.tup-page-share-copy')).toBeVisible();
    });

    test('la etiqueta cambia con el toggle de idioma', async ({ page }) => {
      const button = page.locator('.tup-page-share-button');
      await expect(button).toBeVisible();
      const before = (await page.locator('html').getAttribute('lang')) === 'en' ? 'en' : 'es';
      const after = before === 'en' ? 'es' : 'en';
      await page.locator('#langToggle').click();
      await expect(page.locator('html')).toHaveAttribute('lang', after);
      await expect(button.locator(`span[data-lang="${after}"]`)).toBeVisible();
      await expect(button.locator(`span[data-lang="${before}"]`)).toBeHidden();
    });
  });
}

test.describe('Convivencia con el compartir especial de quien-soy', () => {
  test('quien-soy conserva solo su compartir propio', async ({ page }) => {
    await page.goto('/quien-soy/');
    await expect(page.locator('#qs-share-main')).toBeVisible();
    await expect(page.locator('.tup-page-share')).toHaveCount(0);
  });
});

test.describe('Compartir en pantalla angosta', () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test('no desborda horizontalmente a 320 px con el panel abierto', async ({ page }) => {
    await page.goto('/talentos/');
    await expect(page.locator('.tup-page-share-button')).toBeVisible();
    const hasNativeShare = await page.evaluate(() => typeof navigator.share === 'function');
    if (!hasNativeShare) {
      await page.locator('.tup-page-share-button').click();
      await expect(page.locator('.tup-page-share-link[data-share-network="whatsapp"]')).toBeVisible();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
