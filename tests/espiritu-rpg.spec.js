// @ts-check
// Automation permanente del RPG «El Camino del Espíritu» (/juegos/espiritu-santo/):
// arranque, tutorial de los cinco pasos con los textos reales de la página,
// libro de oración, y la misión completa de Sabiduría con el motor y los
// retos reales (caminar hasta el Sabio, responder las cinco situaciones
// eligiendo la mirada de Dios y recibir el don).
const { test, expect } = require('@playwright/test');

async function sinErrores(page) {
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  return errores;
}

async function overflowX(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function completarTutorial(page) {
  await page.click('#playButton');
  await expect(page.locator('#gameOverlay')).toHaveClass(/is-hidden/);
  for (let i = 0; i < 14; i++) {
    if (await page.locator('#stepCard').isVisible()) break;
    if (await page.locator('#dialogueNext').isVisible()) {
      await page.click('#dialogueNext');
    } else {
      await page.waitForTimeout(250);
    }
  }
  await expect(page.locator('#stepCard')).toBeVisible();
  await expect(page.locator('#stepTitle')).toHaveText('Adóralo');
  await expect(page.locator('#stepPhrase')).toContainText('te adoro');
  for (let i = 0; i < 5; i++) {
    await page.click('#sayItButton');
    await page.waitForTimeout(350);
  }
  await expect(page.locator('#stepCard')).toBeHidden();
  await expect(page.locator('#objectiveText')).toContainText('Sabiduría');
}

test('rpg: arranque, tutorial real, libro de oración y sin desborde a 320px', async ({ page }) => {
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/juegos/espiritu-santo/');
  await expect(page.locator('#gameTitle')).toHaveText('El Camino del Espíritu');
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.locator('#flamesHud .flame-slot')).toHaveCount(7);
  await expect(page.locator('#playButton')).toBeVisible();

  await completarTutorial(page);

  // El libro trae los textos reales de la página del Espíritu Santo.
  await page.click('#bookButton');
  await expect(page.locator('#bookOverlay')).toBeVisible();
  await expect(page.locator('#bookContent')).toContainText('Dulce huésped de mi alma');
  await expect(page.locator('#bookContent')).toContainText('temor santo para no ofenderte jamás');
  await page.click('#bookCloseButton');
  await expect(page.locator('#bookOverlay')).toBeHidden();

  // Caminar un poco sin errores.
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(600);
  await page.keyboard.up('ArrowUp');
  expect(errores).toEqual([]);

  // Sin desborde horizontal a 320px.
  await page.setViewportSize({ width: 320, height: 640 });
  await page.waitForTimeout(400);
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  expect(errores).toEqual([]);
});

test('rpg: el idioma cambia en caliente, en el tutorial y en una elección', async ({ page }) => {
  test.setTimeout(240000);
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/juegos/espiritu-santo/');
  await page.click('#playButton');
  for (let i = 0; i < 14; i++) {
    if (await page.locator('#stepCard').isVisible()) break;
    if (await page.locator('#dialogueNext').isVisible()) await page.click('#dialogueNext');
    else await page.waitForTimeout(250);
  }
  await expect(page.locator('#stepTitle')).toHaveText('Adóralo');

  // Cambio en caliente a mitad del tutorial: la tarjeta se re-renderiza.
  await page.click('#languageToggle');
  await expect(page.locator('#stepTitle')).toHaveText('Adore Him');
  await expect(page.locator('#stepPhrase')).toContainText('I adore You');
  await expect(page.locator('#gameTitle')).toHaveText('The Way of the Spirit');
  await page.click('#languageToggle');
  await expect(page.locator('#stepTitle')).toHaveText('Adóralo');
  for (let i = 0; i < 5; i++) {
    await page.click('#sayItButton');
    await page.waitForTimeout(350);
  }
  await expect(page.locator('#stepCard')).toBeHidden();

  // Ir al altar de Interpretación de Lenguas (-8, -10) y abrir su elección.
  const etiquetaVisible = async () => {
    const boton = page.locator('#interactButton');
    if (!(await boton.isVisible().catch(() => false))) return '';
    return (await boton.textContent()) || '';
  };
  const leerPos = async () => page.evaluate(() => {
    try {
      const s = JSON.parse(localStorage.getItem('tup_espiritu_rpg') || '{}');
      return s.playerPos || null;
    } catch { return null; }
  });
  let pos = null;
  for (let i = 0; i < 20 && !pos; i++) {
    pos = await leerPos();
    if (!pos) await page.waitForTimeout(1000);
  }
  const destino = { x: -8, z: -10 };
  for (let tramo = 0; tramo < 30; tramo++) {
    if ((await etiquetaVisible()).includes('Interpretación')) break;
    const leida = await leerPos();
    if (leida) pos = leida;
    const dx = destino.x - (pos ? pos.x : 0);
    const dz = destino.z - (pos ? pos.z : 7);
    if (Math.hypot(dx, dz) < 1.2) break;
    const teclas = [];
    if (dx < -1.2) teclas.push('ArrowLeft'); else if (dx > 1.2) teclas.push('ArrowRight');
    if (dz < -1.2) teclas.push('ArrowUp'); else if (dz > 1.2) teclas.push('ArrowDown');
    if (!teclas.length) break;
    for (const k of teclas) await page.keyboard.down(k);
    await page.waitForTimeout(900);
    for (const k of teclas) await page.keyboard.up(k);
    await page.waitForTimeout(150);
  }
  await expect(page.locator('#interactButton')).toContainText('Interpretación');
  await page.keyboard.press('e');
  for (let i = 0; i < 14; i++) {
    if (await page.locator('#choiceBox').isVisible()) break;
    if (await page.locator('#dialogueNext').isVisible()) await page.click('#dialogueNext');
    else await page.waitForTimeout(250);
  }
  await expect(page.locator('#choiceBox')).toBeVisible();
  const opcionesEs = await page.locator('#choiceBox .choice-button').allTextContents();
  expect(opcionesEs.length).toBeGreaterThan(1);

  // Cambio en caliente con la elección abierta: los botones se re-renderizan.
  await page.click('#languageToggle');
  const esperadasEn = await page.evaluate(() =>
    window.RPG_CHARISMS[8].challenge.rounds[0].options.map((o) => o.text.en));
  await expect(page.locator('#choiceBox .choice-button')).toHaveCount(esperadasEn.length);
  const opcionesEn = await page.locator('#choiceBox .choice-button').allTextContents();
  expect(opcionesEn).toEqual(esperadasEn);
  expect(opcionesEn).not.toEqual(opcionesEs);
  expect(errores).toEqual([]);
});

test('rpg: la misión de Sabiduría se completa y enciende la primera llama', async ({ page }) => {
  test.setTimeout(240000);
  const errores = await sinErrores(page);
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/juegos/espiritu-santo/');
  await completarTutorial(page);

  // Caminar hasta el Sabio del Mirador (-50, -46) con navegación cerrada:
  // el motor guarda la posición del jugador en el save cada pocos segundos,
  // así que la prueba lee la posición guardada y corrige el rumbo por
  // tramos. La etiqueta solo vale si el botón está visible (su texto queda
  // viejo cuando se oculta).
  const etiquetaVisible = async () => {
    const boton = page.locator('#interactButton');
    if (!(await boton.isVisible().catch(() => false))) return '';
    return (await boton.textContent()) || '';
  };
  const leerPos = async () => page.evaluate(() => {
    try {
      const s = JSON.parse(localStorage.getItem('tup_espiritu_rpg') || '{}');
      return s.playerPos || null;
    } catch { return null; }
  });
  let pos = null;
  for (let i = 0; i < 20 && !pos; i++) {
    pos = await leerPos();
    if (!pos) await page.waitForTimeout(1000);
  }
  const destino = { x: -50, z: -46 };
  for (let tramo = 0; tramo < 45; tramo++) {
    if ((await etiquetaVisible()).includes('Sabio')) break;
    const leida = await leerPos();
    if (leida) pos = leida;
    const dx = destino.x - (pos ? pos.x : 0);
    const dz = destino.z - (pos ? pos.z : 7);
    const dist = Math.hypot(dx, dz);
    if (dist < 1.2) break;
    const teclas = [];
    if (dx < -1.2) teclas.push('ArrowLeft'); else if (dx > 1.2) teclas.push('ArrowRight');
    if (dz < -1.2) teclas.push('ArrowUp'); else if (dz > 1.2) teclas.push('ArrowDown');
    if (!teclas.length) break;
    for (const k of teclas) await page.keyboard.down(k);
    await page.waitForTimeout(dist > 10 ? 2200 : 700);
    for (const k of teclas) await page.keyboard.up(k);
    await page.waitForTimeout(150);
  }
  await expect(page.locator('#interactButton')).toContainText('Sabio');
  await page.keyboard.press('e');

  // Diálogo de introducción del Sabio y arranque del reto de elecciones.
  await expect(page.locator('#npcName')).toContainText('Sabio');
  for (let i = 0; i < 12; i++) {
    if (await page.locator('#choiceBox').isVisible()) break;
    if (await page.locator('#dialogueNext').isVisible()) await page.click('#dialogueNext');
    else await page.waitForTimeout(250);
  }
  await expect(page.locator('#choiceBox')).toBeVisible();

  // Cinco rondas: elegir siempre la opción marcada como buena en los datos.
  for (let ronda = 0; ronda < 5; ronda++) {
    const buena = await page.evaluate((r) => {
      const reto = window.RPG_GIFTS[0].challenge;
      return reto.rounds[r].options.findIndex((o) => o.good);
    }, ronda);
    await page.locator('#choiceBox .choice-button').nth(buena).click();
    // Tras elegir viene la respuesta del Sabio; avanzar hasta la siguiente ronda o el cierre.
    for (let i = 0; i < 12; i++) {
      if (ronda < 4 && (await page.locator('#choiceBox').isVisible())) break;
      if (ronda === 4 && (await page.locator('#bannerCard').isVisible())) break;
      if (await page.locator('#dialogueNext').isVisible()) await page.click('#dialogueNext');
      else await page.waitForTimeout(250);
    }
  }

  // Ceremonia del don: la tarjeta trae la línea de la oración de cierre.
  await expect(page.locator('#bannerCard')).toBeVisible();
  await expect(page.locator('#bannerContent')).toContainText('Dame sabiduría para conocerte');
  await page.click('#bannerClose');
  await expect(page.locator('#flamesHud .flame-slot.is-lit')).toHaveCount(1);
  const guardado = await page.evaluate(() => JSON.parse(localStorage.getItem('tup_espiritu_rpg') || '{}'));
  expect(guardado.gifts && guardado.gifts[0]).toBe(true);
  expect(errores).toEqual([]);
});
