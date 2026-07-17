(function() {
  'use strict';
  const LANG_KEY = 'tup_lang';
  const STAR_KEY = 'ninosStarsWeek';
  const WEEK_KEY = 'ninosStarsWeekId';
  const READ_KEY = 'ninosCuentosRead';
  let lang = localStorage.getItem(LANG_KEY) || 'es';
  let cuentos = [];
  let currentCuento = null;
  let ttsSpeaking = false;
  let readFilter = 'all';

  const STARS = [
    { id: 'gracias', es: 'Decir «gracias, Dios» al despertar', en: 'Say "thank you, God" when you wake up' },
    { id: 'ayuda', es: 'Ayudar en casa sin que me lo pidan', en: 'Help at home without being asked' },
    { id: 'amable', es: 'Ser amable con un hermano, amigo o compañero', en: 'Be kind to a sibling, friend, or classmate' },
    { id: 'angel', es: 'Rezar el Ángel de la Guarda', en: 'Pray the Guardian Angel prayer' },
    { id: 'compartir', es: 'Compartir algo (juguete, snack, tiempo)', en: 'Share something (toy, snack, time)' },
    { id: 'abrazo', es: 'Decir «te quiero» a mamá, papá o quien me cuida', en: 'Say "I love you" to mom, dad, or whoever cares for me' },
    { id: 'misa', es: 'Ir a Misa con la familia (o rezar si no puedo ir)', en: 'Go to Mass with family (or pray if I cannot go)' },
    { id: 'cuento', es: 'Contar un cuento de santo a alguien', en: 'Tell a saint story to someone' },
  ];

  function weekId() {
    const d = new Date();
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + week;
  }

  function loadStars() {
    const current = weekId();
    if (localStorage.getItem(WEEK_KEY) !== current) {
      localStorage.setItem(WEEK_KEY, current);
      localStorage.setItem(STAR_KEY, '[]');
      return new Set();
    }
    try { return new Set(JSON.parse(localStorage.getItem(STAR_KEY) || '[]')); }
    catch (_) { return new Set(); }
  }

  function saveStars(done) {
    localStorage.setItem(STAR_KEY, JSON.stringify([...done]));
    localStorage.setItem(WEEK_KEY, weekId());
  }

  let doneStars = loadStars();

  function loadRead() {
    try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); }
    catch (_) { return new Set(); }
  }

  function saveRead(read) {
    localStorage.setItem(READ_KEY, JSON.stringify([...read]));
  }

  let readCuentos = loadRead();

  function toggleRead(id, checked) {
    if (checked) readCuentos.add(id); else readCuentos.delete(id);
    saveRead(readCuentos);
    updateReadCount();
    syncReadUi(id);
  }

  function syncReadUi(id) {
    const isRead = readCuentos.has(id);
    document.querySelectorAll('.ninos-cuento-card[data-id="' + id + '"]').forEach(card => {
      card.classList.toggle('is-read', isRead);
      const cb = card.querySelector('.ninos-read-check input');
      if (cb) cb.checked = isRead;
    });
    const modalCb = document.getElementById('ninosModalRead');
    if (modalCb && currentCuento && currentCuento.id === id) modalCb.checked = isRead;
  }

  function updateReadCount() {
    const countEl = document.getElementById('ninosReadCount');
    if (countEl) countEl.textContent = readCuentos.size + ' / ' + cuentos.length;
  }

  function applyLang(l) {
    lang = l;
    localStorage.setItem(LANG_KEY, l);
    document.documentElement.lang = l === 'en' ? 'en' : 'es';
    const label = document.getElementById('langLabel');
    if (label) label.textContent = l === 'en' ? 'ES' : 'EN';
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.style.display = el.dataset.lang === l ? '' : 'none';
    });
    renderCuentos();
    renderStars();
    if (currentCuento) openCuento(currentCuento, false);
    updateTtsBtn();
    updateFilterLabels();
  }

  function updateFilterLabels() {
    document.querySelectorAll('[data-read-filter]').forEach(btn => {
      const f = btn.dataset.readFilter;
      btn.classList.toggle('is-active', f === readFilter);
      if (f === 'all') btn.textContent = lang === 'en' ? 'All' : 'Todos';
      else btn.textContent = lang === 'en' ? 'Not read yet' : 'Sin leer';
    });
  }

  function renderStars() {
    const list = document.getElementById('ninosStarList');
    if (!list) return;
    list.innerHTML = '';
    STARS.forEach(s => {
      const row = document.createElement('div');
      row.className = 'ninos-star-item' + (doneStars.has(s.id) ? ' is-done' : '');
      row.innerHTML =
        '<label class="ninos-star-check">' +
          '<input type="checkbox"' + (doneStars.has(s.id) ? ' checked' : '') + ' />' +
          '<span class="ninos-star-box">★</span>' +
        '</label>' +
        '<span class="ninos-star-label">' + (lang === 'en' ? s.en : s.es) + '</span>';
      const cb = row.querySelector('input');
      cb.addEventListener('change', () => {
        if (cb.checked) doneStars.add(s.id); else doneStars.delete(s.id);
        row.classList.toggle('is-done', cb.checked);
        saveStars(doneStars);
        updateStarCount();
      });
      list.appendChild(row);
    });
    updateStarCount();
  }

  function updateStarCount() {
    const countEl = document.getElementById('ninosStarsCount');
    if (countEl) countEl.textContent = doneStars.size + ' / ' + STARS.length + ' ★';
  }

  function renderCuentos() {
    const grid = document.getElementById('ninosCuentosGrid');
    if (!grid || !cuentos.length) return;
    grid.innerHTML = '';
    const list = readFilter === 'unread'
      ? cuentos.filter(c => !readCuentos.has(c.id))
      : cuentos;
    if (!list.length) {
      grid.innerHTML = '<p class="ninos-cuentos-sub">' +
        (lang === 'en' ? 'You read all the stories! 🎉' : '¡Leíste todos los cuentos! 🎉') + '</p>';
      updateReadCount();
      return;
    }
    list.forEach(c => {
      const card = document.createElement('article');
      card.className = 'ninos-cuento-card' + (readCuentos.has(c.id) ? ' is-read' : '');
      card.dataset.id = c.id;
      if (c.accent) card.style.borderColor = c.accent + '33';
      card.innerHTML =
        '<div class="ninos-cuento-top">' +
          '<img class="ninos-cuento-icon" src="' + c.icon + '" alt="" />' +
          '<h3 class="ninos-cuento-title">' + c.title[lang] + '</h3>' +
        '</div>' +
        '<p class="ninos-cuento-hook">' + c.hook[lang] + '</p>' +
        (c.readMin ? '<span class="ninos-cuento-time">🌙 ~' + c.readMin + ' ' + (lang === 'en' ? 'min' : 'min') + '</span>' : '') +
        '<div class="ninos-cuento-foot">' +
          '<label class="ninos-read-check" title="' + (lang === 'en' ? 'Mark as read' : 'Marcar como leído') + '">' +
            '<input type="checkbox"' + (readCuentos.has(c.id) ? ' checked' : '') + ' />' +
            '<span class="ninos-read-box">✓</span>' +
            '<span class="ninos-read-label">' + (lang === 'en' ? 'I read it' : 'Ya lo leí') + '</span>' +
          '</label>' +
          '<button type="button" class="ninos-cuento-open">' + (lang === 'en' ? 'Open →' : 'Abrir →') + '</button>' +
        '</div>';
      const openBtn = card.querySelector('.ninos-cuento-open');
      openBtn.addEventListener('click', e => { e.stopPropagation(); openCuento(c, true); });
      card.querySelector('.ninos-cuento-top')?.addEventListener('click', () => openCuento(c, true));
      card.querySelector('.ninos-cuento-hook')?.addEventListener('click', () => openCuento(c, true));
      const cb = card.querySelector('.ninos-read-check input');
      cb.addEventListener('change', e => {
        e.stopPropagation();
        toggleRead(c.id, cb.checked);
      });
      card.querySelector('.ninos-read-check')?.addEventListener('click', e => e.stopPropagation());
      grid.appendChild(card);
    });
    updateReadCount();
  }

  function openCuento(c, showModal) {
    currentCuento = c;
    const img = document.getElementById('ninosModalImg');
    const title = document.getElementById('ninosModalTitle');
    const body = document.getElementById('ninosModalBody');
    const saintLink = document.getElementById('ninosModalSaint');
    if (img) { img.src = c.icon; img.alt = c.title[lang]; }
    if (title) title.textContent = c.title[lang];
    if (body) {
      const paras = c.story[lang].split('\n\n').map(p => '<p>' + p + '</p>').join('');
      body.innerHTML = paras +
        '<div class="ninos-modal-moral">' + c.moral[lang] + '</div>' +
        '<div class="ninos-modal-act"><strong>' + (lang === 'en' ? 'Your mission: ' : 'Tu misión: ') + '</strong>' + c.activity[lang] + '</div>';
    }
    if (saintLink) {
      saintLink.href = '/intercesor/?intercesor=' + c.saintId;
      saintLink.textContent = lang === 'en' ? '→ Full saint page' : '→ Página del santo';
    }
    const modalCb = document.getElementById('ninosModalRead');
    if (modalCb) modalCb.checked = readCuentos.has(c.id);
    updateTtsBtn();
    if (showModal) {
      const modal = document.getElementById('ninosModal');
      modal.classList.add('is-open');
      modal.classList.add('ninos-modal--bedtime');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    stopTts();
    const modal = document.getElementById('ninosModal');
    modal.classList.remove('is-open');
    modal.classList.remove('ninos-modal--bedtime');
    document.body.style.overflow = '';
  }

  function updateTtsBtn() {
    const btn = document.getElementById('ninosModalTts');
    if (!btn) return;
    if (!window.speechSynthesis) { btn.style.display = 'none'; return; }
    btn.style.display = '';
    btn.textContent = ttsSpeaking
      ? (lang === 'en' ? '⏹ Stop' : '⏹ Detener')
      : (lang === 'en' ? '🌙 Read for sleep' : '🌙 Leer para dormir');
  }

  function speakCuento() {
    if (!currentCuento || !window.speechSynthesis) return;
    if (ttsSpeaking) { stopTts(); return; }
    const text = currentCuento.story[lang];
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'es' ? 'es-MX' : 'en-US';
    utt.rate = 0.68;
    utt.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang === 'es' ? 'es' : 'en'));
    if (voice) utt.voice = voice;
    utt.onend = utt.onerror = () => { ttsSpeaking = false; updateTtsBtn(); };
    window.speechSynthesis.speak(utt);
    ttsSpeaking = true;
    updateTtsBtn();
  }

  function stopTts() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    ttsSpeaking = false;
    updateTtsBtn();
  }

  document.getElementById('ninosModalClose')?.addEventListener('click', closeModal);
  document.getElementById('ninosModal')?.addEventListener('click', e => {
    if (e.target.id === 'ninosModal') closeModal();
  });
  document.getElementById('ninosModalTts')?.addEventListener('click', speakCuento);
  document.getElementById('ninosModalRead')?.addEventListener('change', e => {
    if (currentCuento) {
      toggleRead(currentCuento.id, e.target.checked);
      if (readFilter === 'unread' && e.target.checked) renderCuentos();
    }
  });
  document.querySelectorAll('[data-read-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      readFilter = btn.dataset.readFilter;
      updateFilterLabels();
      renderCuentos();
    });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.getElementById('langToggle')?.addEventListener('click', () => {
    applyLang(lang === 'es' ? 'en' : 'es');
    window.dispatchEvent(new CustomEvent('tup:langchange', { detail: lang }));
  });

  fetch('/data/ninos-cuentos.json')
    .then(r => r.json())
    .then(data => { cuentos = data.cuentos || []; renderCuentos(); updateFilterLabels(); })
    .catch(() => {
      const grid = document.getElementById('ninosCuentosGrid');
      if (grid) grid.innerHTML = '<p class="ninos-cuentos-sub">' + (lang === 'en' ? 'Could not load stories.' : 'No se pudieron cargar los cuentos.') + '</p>';
    });

  if (window.speechSynthesis) window.speechSynthesis.getVoices();
  applyLang(lang);
  renderStars();
})();
