// Manejadores de retos del RPG «El Camino del Espíritu» (Espíritu Santo).
// Define window.RpgChallenges con los ocho tipos de reto del DISENO.md:
// choices, collectOrder, arena, find, deliver, tiles, sequence y prayerLines.
// Cada manejador recibe (ctx, challenge, done) y llama done({ ok: true })
// una sola vez al superar el reto. Cuando un intento falla y el reto permite
// reintento, llama ctx.fail(mensaje) y reinicia el reto por dentro, sin
// llamar done. Todo el estado vive en la clausura de cada llamada.
//
// Supuestos del contrato (según DISENO.md):
// - ctx.say(lines, cb) y ctx.choose(prompt, options, cb) reciben los textos
//   como objetos { es, en } (líneas con { speaker, text } y opciones con
//   { text, ... }); el motor los presenta en el idioma actual. La respuesta
//   de choose puede ser el objeto de la opción elegida o su índice.
// - ctx.toast, ctx.banner, ctx.setObjective y ctx.fail reciben cadenas ya
//   localizadas (se resuelven aquí con ctx.t).
// - ctx.onFrame(fn) devuelve una función para cancelar; fn recibe (dt, time)
//   con dt en segundos y time en milisegundos, como los demás motores.
// - ctx.waitInteract(cb) pide una pulsación de interactuar; se vuelve a pedir
//   tras cada pulsación por si el registro fuera de un solo uso.
// - Las campanas están en ctx.bell y ctx.chime (con respaldo en ctx.fx).
// - ctx.renderer es la instancia de Game3DRenderer; si falta, los retos
//   siguen funcionando sin dibujos.
(() => {
  'use strict';

  // ---------- Utilidades sobre el ctx ----------

  function noop() {}

  function langOf(ctx) {
    try {
      const value = typeof ctx.lang === 'function' ? ctx.lang() : ctx.lang;
      return value === 'en' ? 'en' : 'es';
    } catch (error) {
      return 'es';
    }
  }

  // Texto localizado de un objeto { es, en } (o la cadena tal cual).
  function tt(ctx, obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    if (typeof ctx.t === 'function') {
      const resolved = ctx.t(obj);
      if (typeof resolved === 'string') return resolved;
    }
    return obj[langOf(ctx)] || obj.es || obj.en || '';
  }

  // Cadena cruda en un idioma, para interpolar dentro de frases bilingües.
  function raw(obj, lang) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.es || obj.en || '';
  }

  function say(ctx, lines, cb) {
    const next = typeof cb === 'function' ? cb : noop;
    if (typeof ctx.say !== 'function') { next(); return; }
    ctx.say(lines, next);
  }

  function narr(ctx, textObj, cb) {
    say(ctx, [{ speaker: 'narrator', text: textObj }], cb);
  }

  function choose(ctx, prompt, options, cb) {
    const list = Array.isArray(options) ? options : [];
    if (typeof ctx.choose !== 'function') { cb(list[0]); return; }
    ctx.choose(prompt, list, (res) => {
      let opt = res;
      if (typeof res === 'number') opt = list[res];
      else if (typeof res === 'string' && res.trim() !== '' && !Number.isNaN(Number(res))) opt = list[Number(res)];
      cb(opt);
    });
  }

  function toast(ctx, obj) {
    if (typeof ctx.toast === 'function') ctx.toast(tt(ctx, obj));
  }

  function banner(ctx, html) {
    if (typeof ctx.banner === 'function') ctx.banner(html);
  }

  function objective(ctx, obj) {
    if (typeof ctx.setObjective === 'function') ctx.setObjective(tt(ctx, obj));
  }

  function failMsg(ctx, obj) {
    if (typeof ctx.fail === 'function') ctx.fail(tt(ctx, obj));
  }

  function bell(ctx, n) {
    const fn = (ctx.fx && ctx.fx.bell) || ctx.bell;
    if (typeof fn === 'function') fn(n);
  }

  function chime(ctx, n) {
    const fn = (ctx.fx && ctx.fx.chime) || ctx.chime;
    if (typeof fn === 'function') fn(n);
  }

  function isPaused(ctx) {
    try {
      return typeof ctx.isPaused === 'function' ? !!ctx.isPaused() : !!ctx.isPaused;
    } catch (error) {
      return false;
    }
  }

  function rendererOf(ctx) {
    const r = ctx.renderer;
    return r && typeof r.draw === 'function' ? r : null;
  }

  function dist2d(ax, az, bx, bz) {
    return Math.hypot(ax - bx, az - bz);
  }

  // Registra un callback por frame ya protegido contra la pausa y con dt
  // saneado. Devuelve la función para cancelarlo.
  function addFrame(ctx, fn) {
    if (typeof ctx.onFrame !== 'function') return noop;
    const cancel = ctx.onFrame((dt, time) => {
      if (isPaused(ctx)) return;
      const step = typeof dt === 'number' && dt > 0 ? Math.min(0.05, dt) : 0.016;
      fn(step, typeof time === 'number' ? time : Date.now());
    });
    return typeof cancel === 'function' ? cancel : noop;
  }

  // ---------- 1. choices: rondas de elección con respuesta ----------

  function choices(ctx, challenge, done) {
    const rounds = Array.isArray(challenge.rounds) ? challenge.rounds : [];
    const need = typeof challenge.need === 'number'
      ? challenge.need
      : Math.max(1, Math.ceil(rounds.length * 0.8));
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      done({ ok: true });
    }

    function run() {
      let score = 0;
      let index = 0;
      function step() {
        if (finished) return;
        if (index >= rounds.length) {
          if (score >= need) { finish(); return; }
          failMsg(ctx, {
            es: 'El Espíritu sigue contigo. Mira cada situación otra vez, con calma, e inténtalo de nuevo.',
            en: 'The Spirit is still with you. Look at each situation again, calmly, and try once more.',
          });
          run();
          return;
        }
        const round = rounds[index];
        const options = Array.isArray(round.options) ? round.options : [];
        if (!options.length) { index += 1; step(); return; }
        choose(ctx, round.prompt, options, (opt) => {
          if (finished) return;
          if (!opt) { step(); return; }
          if (opt.good) score += 1;
          index += 1;
          if (opt.reply) narr(ctx, opt.reply, step);
          else step();
        });
      }
      step();
    }

    if (!rounds.length) { finish(); return; }
    run();
  }

  // ---------- 2. collectOrder: pergaminos en orden y pregunta final ----------

  function collectOrder(ctx, challenge, done) {
    const items = Array.isArray(challenge.items) ? challenge.items : [];
    const R = rendererOf(ctx);
    let finished = false;
    let next = 0;
    let busy = false;
    let hintCooldown = 0;
    let cancelFrame = noop;

    function finish() {
      if (finished) return;
      finished = true;
      cancelFrame();
      done({ ok: true });
    }

    function renderObjective() {
      objective(ctx, {
        es: `Pergaminos: ${next} de ${items.length}`,
        en: `Scrolls: ${next} of ${items.length}`,
      });
    }

    function drawItems(time) {
      if (!R) return;
      items.forEach((item, i) => {
        if (i < next) return;
        const isNext = i === next;
        const bob = Math.sin(time / 300 + item.x * 1.7 + item.z) * 0.12;
        const glow = isNext ? 0.65 + Math.sin(time / 180) * 0.2 : 0.3;
        const spin = time / 900 + i;
        R.draw('cube', [item.x, 0.78 + bob, item.z], [0.34, 0.46, 0.08], '#f2cc63', [0, spin, 0], glow);
        R.draw('cube', [item.x, 0.78 + bob, item.z], [0.2, 0.3, 0.11], '#fff6d8', [0, spin, 0], glow * 0.8);
        R.draw('cylinder', [item.x, 0.05, item.z], [isNext ? 1.5 : 1.1, 0.06, isNext ? 1.5 : 1.1], '#ffd23c', [0, 0, 0], isNext ? 0.4 : 0.15);
      });
    }

    function askQuestion(attempt) {
      const q = challenge.finalQuestion;
      if (!q) { finish(); return; }
      choose(ctx, q.prompt, q.options || [], (opt) => {
        if (finished) return;
        if (opt && opt.good) {
          if (opt.reply) narr(ctx, opt.reply, finish);
          else finish();
          return;
        }
        if (attempt < 1) {
          if (opt && opt.reply) narr(ctx, opt.reply, () => askQuestion(attempt + 1));
          else askQuestion(attempt + 1);
          return;
        }
        failMsg(ctx, {
          es: 'La Palabra se entiende volviendo a caminarla. Recoge los pergaminos otra vez, con el corazón abierto.',
          en: 'The Word is understood by walking it again. Gather the scrolls once more, with an open heart.',
        });
        next = 0;
        busy = false;
        hintCooldown = 0;
        renderObjective();
      });
    }

    function collect() {
      const item = items[next];
      busy = true;
      chime(ctx, next + 1);
      next += 1;
      renderObjective();
      narr(ctx, item.text, () => {
        busy = false;
        if (finished) return;
        if (next >= items.length) askQuestion(0);
      });
    }

    function update(dt) {
      if (busy || finished) return;
      if (hintCooldown > 0) hintCooldown -= dt;
      const p = ctx.player;
      if (!p || next >= items.length) return;
      const item = items[next];
      if (dist2d(p.x, p.z, item.x, item.z) <= 1.3) { collect(); return; }
      if (hintCooldown <= 0) {
        for (let i = next + 1; i < items.length; i += 1) {
          if (dist2d(p.x, p.z, items[i].x, items[i].z) <= 1.3) {
            hintCooldown = 3.5;
            toast(ctx, {
              es: `Ese pergamino va más adelante. Primero busca: ${raw(item.label, 'es')}`,
              en: `That scroll comes later. First look for: ${raw(item.label, 'en')}`,
            });
            break;
          }
        }
      }
    }

    cancelFrame = addFrame(ctx, (dt, time) => { drawItems(time); update(dt); });
    renderObjective();
    if (!items.length) askQuestion(0);
  }

  // ---------- 3. arena: pulso de luz contra las sombras ----------

  function arena(ctx, challenge, done) {
    const total = typeof challenge.total === 'number' ? challenge.total : 10;
    const heartsStart = typeof challenge.hearts === 'number' ? challenge.hearts : 3;
    const center = challenge.center && typeof challenge.center.x === 'number'
      ? { x: challenge.center.x, z: challenge.center.z }
      : { x: ctx.player ? ctx.player.x : 0, z: ctx.player ? ctx.player.z : 0 };
    const radius = typeof challenge.radius === 'number' ? challenge.radius : 15;
    const maxShadows = typeof challenge.maxShadows === 'number' ? challenge.maxShadows : 6;
    const R = rendererOf(ctx);
    const PALETTE = ['#c96a4a', '#5a7fb0', '#7a9a5b', '#b0623f', '#8a5a7a'];
    let finished = false;
    let active = false;
    let hearts = heartsStart;
    let conversions = 0;
    let figures = [];
    let spawnTimer = 0.8;
    let spawnInterval = 2.4;
    let spawnCounter = 0;
    let pulseTime = 0;
    let pulseCooldown = 0;
    let needRearm = false;
    let cancelFrame = noop;
    const interactCancels = [];

    function finish() {
      if (finished) return;
      finished = true;
      active = false;
      cancelFrame();
      interactCancels.forEach((cancel) => cancel());
      done({ ok: true });
    }

    function renderObjective() {
      objective(ctx, {
        es: `Luz que vence: ${conversions} de ${total} · Corazones ${'♥'.repeat(Math.max(0, hearts))}`,
        en: `Light that wins: ${conversions} of ${total} · Hearts ${'♥'.repeat(Math.max(0, hearts))}`,
      });
    }

    function pulse() {
      if (!active || finished || pulseCooldown > 0) return;
      pulseCooldown = 1.1;
      pulseTime = 0.35;
      const p = ctx.player;
      if (!p) return;
      figures.forEach((f) => {
        if (f.state === 'shadow' && dist2d(f.x, f.z, p.x, p.z) <= 4.6) {
          f.state = 'converted';
          f.robe = PALETTE[f.index % PALETTE.length];
        }
      });
    }

    function armInteract() {
      if (typeof ctx.waitInteract !== 'function') return;
      const cancel = ctx.waitInteract(() => {
        if (finished) return;
        pulse();
        needRearm = true;
      });
      if (typeof cancel === 'function') interactCancels.push(cancel);
    }

    function spawnShadow() {
      const angle = Math.random() * Math.PI * 2;
      const index = spawnCounter;
      spawnCounter += 1;
      figures.push({
        x: center.x + Math.cos(angle) * radius,
        z: center.z + Math.sin(angle) * radius,
        state: 'shadow',
        index,
        robe: '#3c4148',
        skin: '#9aa0a8',
        hair: '#23262b',
      });
    }

    function restart() {
      failMsg(ctx, {
        es: 'La lamparita sigue encendida. Respira, pide fortaleza y vuelve a defenderla.',
        en: 'The little lamp is still burning. Breathe, ask for strength, and defend it again.',
      });
      hearts = heartsStart;
      conversions = 0;
      figures = [];
      spawnTimer = 0.8;
      spawnInterval = 2.4;
      pulseTime = 0;
      pulseCooldown = 0;
      renderObjective();
    }

    function draw(time) {
      if (!R) return;
      if (typeof R.drawCollectible === 'function') {
        R.drawCollectible({ x: center.x, z: center.z, type: 'flame' }, time);
      }
      R.draw('cylinder', [center.x, 0.05, center.z], [2.6, 0.06, 2.6], '#ffd23c', [0, 0, 0], 0.3);
      const p = ctx.player;
      if (pulseTime > 0 && p) {
        const r = Math.max(0.2, 4.6 * (1 - pulseTime / 0.35));
        R.draw('cylinder', [p.x, 0.06, p.z], [r * 2, 0.07, r * 2], '#ffd23c', [0, 0, 0], 0.8);
      }
      if (typeof R.drawFigure === 'function') {
        figures.forEach((f) => {
          R.drawFigure({
            robe: f.robe, skin: f.skin, hair: f.hair,
            x: f.x, z: f.z, y: 0, index: f.index + 20,
            singing: f.state === 'converted',
          }, time);
        });
      }
    }

    function update(dt) {
      if (!active || finished) return;
      if (pulseCooldown > 0) pulseCooldown -= dt;
      if (pulseTime > 0) pulseTime -= dt;
      if (needRearm) { needRearm = false; armInteract(); }
      if (typeof ctx.waitInteract !== 'function' && pulseCooldown <= 0) {
        const p = ctx.player;
        if (p && figures.some((f) => f.state === 'shadow' && dist2d(f.x, f.z, p.x, p.z) <= 4.6)) pulse();
      }
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        if (figures.filter((f) => f.state === 'shadow').length < maxShadows) {
          spawnShadow();
          spawnTimer = spawnInterval;
        } else {
          spawnTimer = 0.4;
        }
      }
      for (let i = figures.length - 1; i >= 0; i -= 1) {
        const f = figures[i];
        const d = dist2d(f.x, f.z, center.x, center.z) || 1;
        const dx = (center.x - f.x) / d;
        const dz = (center.z - f.z) / d;
        if (f.state === 'shadow') {
          if (d < 1.4) {
            figures.splice(i, 1);
            hearts -= 1;
            renderObjective();
            toast(ctx, {
              es: 'Una sombra llegó a la lamparita. Defiéndela con tu luz.',
              en: 'A shadow reached the little lamp. Defend it with your light.',
            });
            if (hearts <= 0) { restart(); return; }
            continue;
          }
          const speed = Math.min(1.9, 1.15 + conversions * 0.02);
          f.x += dx * speed * dt;
          f.z += dz * speed * dt;
        } else {
          if (d < 1.1) {
            figures.splice(i, 1);
            conversions += 1;
            spawnInterval = Math.max(1.4, 2.4 - conversions * 0.05);
            chime(ctx, conversions);
            renderObjective();
            if (conversions >= total) { finish(); return; }
            continue;
          }
          f.x += dx * 2.2 * dt;
          f.z += dz * 2.2 * dt;
        }
      }
    }

    cancelFrame = addFrame(ctx, (dt, time) => { draw(time); update(dt); });
    renderObjective();
    armInteract();
    if (challenge.phrase) narr(ctx, challenge.phrase, () => { active = true; });
    else active = true;
  }

  // ---------- 4. find: huellas luminosas escondidas ----------

  function find(ctx, challenge, done) {
    const spots = Array.isArray(challenge.spots) ? challenge.spots : [];
    const R = rendererOf(ctx);
    const found = spots.map(() => false);
    let finished = false;
    let busy = false;
    let foundCount = 0;
    let cancelFrame = noop;

    function finish() {
      if (finished) return;
      finished = true;
      cancelFrame();
      done({ ok: true });
    }

    function renderObjective() {
      objective(ctx, {
        es: `Huellas de Dios: ${foundCount} de ${spots.length}`,
        en: `Traces of God: ${foundCount} of ${spots.length}`,
      });
    }

    function draw(time) {
      if (!R) return;
      spots.forEach((spot, i) => {
        const glow = found[i] ? 0.55 : 0.1 + Math.sin(time / 700 + i * 1.3) * 0.04;
        R.draw('cylinder', [spot.x, 0.05, spot.z], [1.6, 0.06, 1.6], found[i] ? '#ffd23c' : '#ffe9a0', [0, 0, 0], glow);
        if (found[i] && typeof R.drawCollectible === 'function') {
          R.drawCollectible({ x: spot.x, z: spot.z, type: 'ray', color: '#ffd23c' }, time);
        }
      });
    }

    function update() {
      if (busy || finished) return;
      const p = ctx.player;
      if (!p) return;
      for (let i = 0; i < spots.length; i += 1) {
        if (found[i]) continue;
        if (dist2d(p.x, p.z, spots[i].x, spots[i].z) <= 2.2) {
          found[i] = true;
          foundCount += 1;
          busy = true;
          bell(ctx, i + 1);
          renderObjective();
          narr(ctx, spots[i].line, () => {
            busy = false;
            if (!finished && foundCount >= spots.length) finish();
          });
          return;
        }
      }
    }

    cancelFrame = addFrame(ctx, (dt, time) => { draw(time); update(); });
    renderObjective();
    if (!spots.length) finish();
  }

  // ---------- 5. deliver: encargos de caridad en cadena ----------

  function deliver(ctx, challenge, done) {
    const steps = Array.isArray(challenge.steps) ? challenge.steps : [];
    const R = rendererOf(ctx);
    let finished = false;
    let busy = false;
    let stepIndex = 0;
    let carrying = false;
    let cancelFrame = noop;

    function finish() {
      if (finished) return;
      finished = true;
      cancelFrame();
      done({ ok: true });
    }

    function pointOf(value) {
      if (!value) return null;
      if (typeof value === 'string') {
        const npcs = (ctx.world && (ctx.world.npcs || ctx.world.figures)) || [];
        const npc = Array.isArray(npcs) ? npcs.find((n) => n.id === value) : null;
        return npc ? { x: npc.x, z: npc.z, label: npc.name } : null;
      }
      if (typeof value.x === 'number') return { x: value.x, z: value.z, label: value.label || value.name };
      if (value.point && typeof value.point.x === 'number') {
        return { x: value.point.x, z: value.point.z, label: value.label || value.name };
      }
      return null;
    }

    function fromOf(step) { return pointOf(step.fromPoint || step.fromNpc); }
    function toOf(step) { return pointOf(step.toPoint || step.toNpc); }

    function renderObjective() {
      const step = steps[stepIndex];
      if (!step) return;
      if (!carrying) {
        objective(ctx, {
          es: `Recoge: ${raw(step.item, 'es')}`,
          en: `Pick up: ${raw(step.item, 'en')}`,
        });
      } else {
        const to = toOf(step);
        const labelEs = to ? raw(to.label, 'es') : '';
        const labelEn = to ? raw(to.label, 'en') : '';
        objective(ctx, labelEs || labelEn
          ? { es: `Lleva ${raw(step.item, 'es')} a ${labelEs}`, en: `Take ${raw(step.item, 'en')} to ${labelEn}` }
          : { es: `Lleva ${raw(step.item, 'es')} hasta la columna de luz`, en: `Take ${raw(step.item, 'en')} to the column of light` });
      }
    }

    function draw(time) {
      if (!R || finished) return;
      const step = steps[stepIndex];
      if (!step) return;
      const p = ctx.player;
      if (!carrying) {
        const from = fromOf(step) || (p ? { x: p.x, z: p.z } : null);
        if (!from) return;
        R.draw('cube', [from.x, 0.32, from.z], [0.52, 0.42, 0.52], '#d7ad50', [0, time / 800, 0], 0.5);
        R.draw('cylinder', [from.x, 0.05, from.z], [1.4, 0.06, 1.4], '#ffd23c', [0, 0, 0], 0.45);
      } else {
        const to = toOf(step) || (p ? { x: p.x, z: p.z } : null);
        if (!to) return;
        R.draw('cylinder', [to.x, 2.1, to.z], [0.55, 4.2, 0.55], '#ffe9a0', [0, 0, 0], 0.22);
        R.draw('cylinder', [to.x, 0.05, to.z], [1.6, 0.06, 1.6], '#ffd23c', [0, 0, 0], 0.5);
      }
    }

    function update() {
      if (busy || finished) return;
      const step = steps[stepIndex];
      if (!step) { finish(); return; }
      const p = ctx.player;
      if (!p) return;
      if (!carrying) {
        const from = fromOf(step) || { x: p.x, z: p.z };
        if (dist2d(p.x, p.z, from.x, from.z) <= 1.3) {
          carrying = true;
          chime(ctx, 1);
          toast(ctx, {
            es: `Llevas: ${raw(step.item, 'es')}`,
            en: `You carry: ${raw(step.item, 'en')}`,
          });
          renderObjective();
        }
      } else {
        const to = toOf(step) || { x: p.x, z: p.z };
        if (dist2d(p.x, p.z, to.x, to.z) <= 1.3) {
          busy = true;
          narr(ctx, step.line, () => {
            busy = false;
            carrying = false;
            stepIndex += 1;
            if (stepIndex >= steps.length) finish();
            else renderObjective();
          });
        }
      }
    }

    cancelFrame = addFrame(ctx, (dt, time) => { draw(time); update(); });
    renderObjective();
    if (!steps.length) finish();
  }

  // ---------- 6. tiles: el puente de losas sobre la oscuridad ----------

  function tiles(ctx, challenge, done) {
    const from = challenge.from || { x: 0, z: 0 };
    const to = challenge.to || { x: 0, z: -16 };
    const steps = typeof challenge.steps === 'number' ? challenge.steps : 10;
    const tileSize = typeof challenge.tileSize === 'number' ? challenge.tileSize : 1.6;
    const offsets = Array.isArray(challenge.pathOffsets) ? challenge.pathOffsets : [];
    const distractors = Array.isArray(challenge.distractors) ? challenge.distractors : [];
    const R = rendererOf(ctx);
    const totalDist = dist2d(from.x, from.z, to.x, to.z) || 1;
    const dir = { x: (to.x - from.x) / totalDist, z: (to.z - from.z) / totalDist };
    const perp = { x: -dir.z, z: dir.x };
    const stepLen = totalDist / steps;
    const angle = Math.atan2(dir.x, dir.z);
    const maxOff = offsets.reduce((m, o) => Math.max(m, Math.abs(o || 0)), 0);
    const voidWidth = tileSize * 2 + maxOff * 2 + 1.2;
    let finished = false;
    let current = 0;
    let started = false;
    let voidTimer = 0;
    let cancelFrame = noop;

    function finish() {
      if (finished) return;
      finished = true;
      cancelFrame();
      done({ ok: true });
    }

    function tileCenter(i) {
      const off = offsets[i] || 0;
      const along = (i + 0.5) * stepLen;
      return {
        x: from.x + dir.x * along + perp.x * off,
        z: from.z + dir.z * along + perp.z * off,
      };
    }

    function pathFrame(p) {
      const rx = p.x - from.x;
      const rz = p.z - from.z;
      return { along: rx * dir.x + rz * dir.z, lateral: rx * perp.x + rz * perp.z };
    }

    function onTile(p, i) {
      const f = pathFrame(p);
      const off = offsets[i] || 0;
      return f.along >= i * stepLen - 0.12
        && f.along <= (i + 1) * stepLen + 0.12
        && Math.abs(f.lateral - off) <= tileSize / 2 + 0.12;
    }

    function renderObjective() {
      objective(ctx, {
        es: `Losas seguras: ${current} de ${steps}`,
        en: `Safe tiles: ${current} of ${steps}`,
      });
    }

    function restart() {
      failMsg(ctx, {
        es: 'El camino seguro se enciende paso a paso. Vuelve a la primera losa y avanza con calma.',
        en: 'The safe path lights up step by step. Return to the first tile and walk calmly.',
      });
      current = 0;
      started = false;
      voidTimer = 0;
      renderObjective();
    }

    function draw(time) {
      if (!R) return;
      const mid = { x: (from.x + to.x) / 2, z: (from.z + to.z) / 2 };
      R.draw('cube', [mid.x, -0.06, mid.z], [voidWidth, 0.1, totalDist + tileSize * 2], '#101018', [0, angle, 0], 0);
      for (let i = 0; i < steps; i += 1) {
        const c = tileCenter(i);
        let color = '#2a2f38';
        let glow = 0;
        if (i < current) { color = '#8a6a42'; glow = 0.25; }
        else if (i === current) { color = '#ffd23c'; glow = 0.65 + Math.sin(time / 200) * 0.2; }
        R.draw('cube', [c.x, 0.05, c.z], [tileSize, 0.12, tileSize], color, [0, angle, 0], glow);
      }
      distractors.forEach((d, i) => {
        const bob = Math.sin(time / 350 + i * 1.7) * 0.1;
        R.draw('sphere', [d.x, 0.62 + bob, d.z], [0.46, 0.46, 0.46], '#1c1f26', [0, 0, 0], 0);
        R.draw('sphere', [d.x, 0.62 + bob, d.z], [0.2, 0.2, 0.2], '#e5484d', [0, 0, 0], 0.7);
      });
      if (typeof R.drawCollectible === 'function') {
        R.drawCollectible({ x: to.x, z: to.z, type: 'flame' }, time);
      }
    }

    function update(dt) {
      if (finished) return;
      const p = ctx.player;
      if (!p) return;
      for (let i = 0; i < distractors.length; i += 1) {
        if (dist2d(p.x, p.z, distractors[i].x, distractors[i].z) <= 0.9) { restart(); return; }
      }
      if (current < steps && onTile(p, current)) {
        started = true;
        current += 1;
        chime(ctx, current);
        voidTimer = 0;
        renderObjective();
        if (current >= steps) finish();
        return;
      }
      if (!started) { voidTimer = 0; return; }
      let safe = false;
      for (let i = 0; i <= Math.min(current, steps - 1); i += 1) {
        if (onTile(p, i)) { safe = true; break; }
      }
      if (safe) { voidTimer = 0; return; }
      const f = pathFrame(p);
      const inVoid = f.along >= -tileSize && f.along <= totalDist + tileSize
        && Math.abs(f.lateral) <= voidWidth / 2;
      const atEntry = f.along < 0.3 && Math.abs(f.lateral - (offsets[0] || 0)) <= tileSize;
      if (inVoid && !atEntry) {
        voidTimer += dt;
        if (voidTimer > 0.6) restart();
      } else {
        voidTimer = 0;
      }
    }

    cancelFrame = addFrame(ctx, (dt, time) => { draw(time); update(dt); });
    renderObjective();
  }

  // ---------- 7. sequence: repetir la melodía de notas luminosas ----------

  function sequence(ctx, challenge, done) {
    const count = typeof challenge.notes === 'number' ? challenge.notes : 4;
    const at = challenge.at && typeof challenge.at.x === 'number'
      ? { x: challenge.at.x, z: challenge.at.z }
      : { x: ctx.player ? ctx.player.x : 0, z: ctx.player ? ctx.player.z : 0 };
    let order;
    if (Array.isArray(challenge.order) && challenge.order.length) {
      order = challenge.order.slice();
    } else if (typeof challenge.seed === 'number') {
      let s = (challenge.seed >>> 0) || 1;
      const len = typeof challenge.length === 'number' ? challenge.length : 4;
      order = [];
      for (let i = 0; i < len; i += 1) {
        s = (s * 1103515245 + 12345) % 2147483648;
        order.push(s % count);
      }
    } else {
      order = [0, 2, 1, 3].filter((n) => n < count);
    }
    if (!order.length) order = [0];
    const COLORS = ['#e5484d', '#f2cc63', '#4a9d68', '#5a7fb0', '#b07cd8', '#ff8a3c'];
    const orbs = [];
    for (let i = 0; i < count; i += 1) {
      const a = count === 1 ? 0 : -0.9 + (1.8 * i) / (count - 1);
      orbs.push({
        x: at.x + Math.sin(a) * 2.8,
        z: at.z - Math.cos(a) * 2.8,
        color: COLORS[i % COLORS.length],
      });
    }
    const inside = orbs.map(() => false);
    const R = rendererOf(ctx);
    let finished = false;
    let phase = 'show';
    let showIndex = -1;
    let showTimer = 0.7;
    let litIndex = -1;
    let litTimer = 0;
    let progress = 0;
    let cancelFrame = noop;

    function finish() {
      if (finished) return;
      finished = true;
      cancelFrame();
      done({ ok: true });
    }

    function renderObjective() {
      if (phase === 'show') {
        objective(ctx, {
          es: 'Escucha y mira la secuencia de notas',
          en: 'Listen and watch the note sequence',
        });
      } else {
        objective(ctx, {
          es: `Repite la secuencia: ${progress} de ${order.length}`,
          en: `Repeat the sequence: ${progress} of ${order.length}`,
        });
      }
    }

    function startShow() {
      phase = 'show';
      showIndex = -1;
      showTimer = 0.7;
      litIndex = -1;
      litTimer = 0;
      progress = 0;
      renderObjective();
    }

    function draw(time) {
      if (!R) return;
      orbs.forEach((orb, i) => {
        const lit = i === litIndex;
        const bob = Math.sin(time / 320 + i * 1.4) * 0.1;
        const size = lit ? 0.44 : 0.34;
        R.draw('cylinder', [orb.x, 0.3, orb.z], [0.22, 0.6, 0.22], '#8a6a42', [0, 0, 0], 0);
        R.draw('sphere', [orb.x, 1.05 + bob, orb.z], [size, size, size], orb.color, [0, 0, 0], lit ? 0.9 : 0.45);
      });
    }

    function touch(i) {
      if (finished || phase !== 'repeat') return;
      litIndex = i;
      litTimer = 0.4;
      bell(ctx, i);
      if (i === order[progress]) {
        progress += 1;
        renderObjective();
        if (progress >= order.length) finish();
      } else {
        failMsg(ctx, {
          es: 'Esa nota no seguía. Escucha la secuencia otra vez, con calma.',
          en: 'That note was not next. Listen to the sequence again, calmly.',
        });
        startShow();
      }
    }

    function update(dt) {
      if (finished) return;
      if (litTimer > 0) {
        litTimer -= dt;
        if (litTimer <= 0) litIndex = -1;
      }
      if (phase === 'show') {
        showTimer -= dt;
        if (showTimer <= 0) {
          showIndex += 1;
          if (showIndex >= order.length) {
            phase = 'repeat';
            progress = 0;
            litIndex = -1;
            renderObjective();
          } else {
            litIndex = order[showIndex];
            litTimer = 0.5;
            bell(ctx, order[showIndex]);
            showTimer = 0.78;
          }
        }
        return;
      }
      const p = ctx.player;
      if (!p) return;
      orbs.forEach((orb, i) => {
        const isIn = dist2d(p.x, p.z, orb.x, orb.z) <= 1.1;
        if (isIn && !inside[i]) {
          inside[i] = true;
          touch(i);
        } else if (!isIn) {
          inside[i] = false;
        }
      });
    }

    cancelFrame = addFrame(ctx, (dt, time) => { draw(time); update(dt); });
    startShow();
  }

  // ---------- 8. prayerLines: ordenar las líneas de la oración ----------

  function prayerLines(ctx, challenge, done) {
    const lines = Array.isArray(challenge.lines) ? challenge.lines : [];
    const prompt = challenge.prompt || {
      es: 'Toca las líneas en orden',
      en: 'Tap the lines in order',
    };
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      done({ ok: true });
    }

    function run() {
      const placed = [];
      function showQuote() {
        banner(ctx, placed.map((i) => tt(ctx, lines[i])).join('<br>'));
      }
      function step() {
        if (finished) return;
        if (placed.length >= lines.length) {
          const full = {
            es: lines.map((l) => raw(l, 'es')).join(' '),
            en: lines.map((l) => raw(l, 'en')).join(' '),
          };
          narr(ctx, full, finish);
          return;
        }
        const remaining = [];
        for (let i = 0; i < lines.length; i += 1) {
          if (!placed.includes(i)) remaining.push(i);
        }
        // Orden revuelto, distinto en cada ronda.
        for (let i = remaining.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = remaining[i];
          remaining[i] = remaining[j];
          remaining[j] = tmp;
        }
        const options = remaining.map((i) => ({ text: lines[i], lineIndex: i }));
        choose(ctx, prompt, options, (opt) => {
          if (finished) return;
          let idx = -1;
          if (opt && typeof opt.lineIndex === 'number') idx = opt.lineIndex;
          else if (opt && opt.text) idx = lines.indexOf(opt.text);
          else if (opt) idx = lines.indexOf(opt);
          if (idx === placed.length) {
            placed.push(idx);
            chime(ctx, placed.length);
            showQuote();
            step();
          } else {
            failMsg(ctx, {
              es: 'La oración se aprende repitiéndola. Empezamos de nuevo, línea a línea.',
              en: 'A prayer is learned by repeating it. We start again, line by line.',
            });
            run();
          }
        });
      }
      step();
    }

    if (!lines.length) { finish(); return; }
    run();
  }

  window.RpgChallenges = {
    choices,
    collectOrder,
    arena,
    find,
    deliver,
    tiles,
    sequence,
    prayerLines,
  };
})();
