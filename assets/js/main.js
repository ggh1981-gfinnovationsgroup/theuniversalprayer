/* =====================================================
   THE UNIVERSAL PRAYER — main.js
   Subdomain detection · Language toggle · Content loader
   ===================================================== */

'use strict';

// ── TRANSLATIONS (UI strings) ──────────────────────
const i18n = {
  en: {
    site_title:         'The Universal Prayer',
    hero_title:         'Pray with the Saints',
    hero_subtitle:      'Novenas, chaplets and prayers for every intercessor — free, always.',
    choose_intercessor: 'Choose your intercessor',
    feast_day:          'Feast Day:',
    tab_prayer:         'Prayer',
    tab_history:        'History',
    tab_novena:         'Novena',
    tab_chaplet:        'Chaplet',
    day:                'Day',
    no_chaplet:         'No chaplet available for this intercessor.',
    not_found_title:    'Intercessor not found',
    not_found_text:     'We could not find this intercessor. Please return to the home page.',
    go_home:            'Go Home',
    footer_text:             'A free Catholic devotional resource. No ads. No tracking.',
    universal_prayer_title:  'The Universal and Definitive Prayer',
    universal_prayer_dedication: 'For every person who prays it — alone, as a couple, as a family or in a group',
    menu_title:              'Intercessors',
  },
  es: {
    site_title:         'La Oración Universal',
    hero_title:         'Reza con los Santos',
    hero_subtitle:      'Novenas, chaplets y oraciones para cada intercesor — gratis, siempre.',
    choose_intercessor: 'Elige tu intercesor',
    feast_day:          'Día festivo:',
    tab_prayer:         'Oración',
    tab_history:        'Historia',
    tab_novena:         'Novena',
    tab_chaplet:        'Chaplet',
    day:                'Día',
    no_chaplet:         'No hay chaplet disponible para este intercesor.',
    not_found_title:    'Intercesor no encontrado',
    not_found_text:     'No pudimos encontrar este intercesor. Por favor regresa a la página principal.',
    go_home:            'Ir al inicio',
    footer_text:             'Un recurso devocional católico gratuito. Sin anuncios. Sin rastreo.',
    universal_prayer_title:  'La Oración Universal y Definitiva',
    universal_prayer_dedication: 'Para toda persona que la rece — solo, en pareja, en familia o en grupo',
    menu_title:              'Intercesores',
  },
};

// ── ALL KNOWN INTERCESSORS ─────────────────────────
const INTERCESSORS = [
  { id: 'padrepio',      subdomain: 'padrepio',      chaplet: true,  novena: true,  name: { en: 'Padre Pio',          es: 'Padre Pío'            } },
  { id: 'misericordia',  subdomain: 'misericordia',  chaplet: true,  novena: true,  name: { en: 'Divine Mercy',       es: 'Divina Misericordia'  } },
  { id: 'guadalupe',     subdomain: 'guadalupe',     chaplet: false, novena: true,  name: { en: 'Our Lady of Guadalupe', es: 'Virgen de Guadalupe' } },
  { id: 'sagradocorazon',subdomain: 'sagradocorazon',chaplet: true,  novena: true,  name: { en: 'Sacred Heart',       es: 'Sagrado Corazón'      } },
  { id: 'sanjose',       subdomain: 'sanjose',       chaplet: false, novena: true,  name: { en: 'Saint Joseph',       es: 'San José'             } },
  { id: 'fatima',        subdomain: 'fatima',        chaplet: true,  novena: true,  name: { en: 'Our Lady of Fatima', es: 'Virgen de Fátima'     } },
];

// ── STATE ──────────────────────────────────────────
let currentLang = 'en';
let intercessorData = null;
let currentDay = 1;

// ── LANGUAGE DETECTION ─────────────────────────────
function detectLanguage() {
  const saved = localStorage.getItem('tup_lang');
  if (saved) return saved;
  // Detect from browser
  const browserLang = navigator.language || navigator.userLanguage || '';
  return browserLang.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tup_lang', lang);
  document.documentElement.lang = lang;

  // Update toggle button label
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'en' ? 'ES' : 'EN';

  // Apply static UI strings
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
  });

  // Toggle bilingual prayer blocks
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });

  // Re-render menu items in new language
  if (window._renderMenuItems) window._renderMenuItems();

  // If intercessor is loaded, refresh dynamic content
  if (intercessorData) renderIntercessorContent(intercessorData);
}

// ── SUBDOMAIN DETECTION ────────────────────────────
function getSubdomain() {
  // Primary: query param ?intercesor=padrepio (GitHub Pages compatible)
  const params = new URLSearchParams(window.location.search);
  const param = params.get('intercesor');
  if (param) return param.toLowerCase();
  // Fallback: true subdomain (e.g. padrepio.theuniversalprayer.com)
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3) return parts[0].toLowerCase();
  return null;
}

// ── PAGE DETECTION ────────────────────────────────
function isIntercessorPage() {
  return document.body.classList.contains('intercessor-page');
}

// ── FETCH INTERCESSOR DATA ─────────────────────────
async function loadIntercessorData(id) {
  const basePath = isIntercessorPage() ? '../data/' : 'data/';
  const url = `${basePath}${id}.json`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Not found: ${url}`);
  return resp.json();
}

// ── HOME PAGE ──────────────────────────────────────
async function initHomePage() {
  const grid = document.getElementById('intercessorsGrid');
  if (!grid) return;

  for (const meta of INTERCESSORS) {
    try {
      const data = await loadIntercessorData(meta.id);
      grid.appendChild(buildCard(data, meta));
    } catch {
      // Skip intercessors whose JSON isn't ready yet
    }
  }
}

function buildCard(data, meta) {
  const lang = currentLang;
  const card = document.createElement('a');
  card.className = 'intercessor-card';
  card.href = buildIntercessorUrl(meta.subdomain);

  const imgHtml = data.image
    ? `<img src="${data.image}" alt="${data.name[lang]}" loading="lazy" />`
    : `<div class="card-image-placeholder">✝</div>`;

  const badges = [];
  if (meta.novena)  badges.push(`<span class="badge">${lang === 'en' ? 'Novena' : 'Novena'}</span>`);
  if (meta.chaplet) badges.push(`<span class="badge">${lang === 'en' ? 'Chaplet' : 'Chaplet'}</span>`);

  card.innerHTML = `
    <div class="card-image-wrap">${imgHtml}</div>
    <div class="card-body">
      <div class="card-name">${data.name[lang]}</div>
      <div class="card-feast">${i18n[lang].feast_day} ${data.feast_day[lang]}</div>
      <div class="card-badges">${badges.join('')}</div>
    </div>`;
  return card;
}

function buildIntercessorUrl(subdomain) {
  const host = window.location.hostname;
  // Local dev: use query params
  if (host === 'localhost' || host === '127.0.0.1') {
    return `/intercesor/?intercesor=${subdomain}`;
  }
  // Production: use subdomains (proxied via Cloudflare Worker with SSL)
  const parts = host.split('.');
  const baseDomain = parts.length >= 3 ? parts.slice(1).join('.') : host;
  return `https://${subdomain}.${baseDomain}`;
}

// ── INTERCESSOR PAGE ───────────────────────────────
async function initIntercessorPage() {
  const subdomain = getSubdomain();

  if (!subdomain) {
    showNotFound();
    return;
  }

  const knownMeta = INTERCESSORS.find(i => i.subdomain === subdomain);
  if (!knownMeta) {
    showNotFound();
    return;
  }

  try {
    intercessorData = await loadIntercessorData(subdomain);
    renderIntercessorContent(intercessorData);
    initTabs(knownMeta);
    initNovena(intercessorData);

    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('intercessorWrapper').style.display = 'block';
  } catch {
    showNotFound();
  }
}

function renderIntercessorContent(data) {
  const lang = currentLang;

  // Page title & meta
  document.title = `${data.name[lang]} | The Universal Prayer`;
  const metaDesc = document.getElementById('pageDesc');
  if (metaDesc) metaDesc.setAttribute('content', data.prayer[lang].substring(0, 150));

  // Hero
  const nameEl = document.getElementById('intercessorName');
  if (nameEl) nameEl.textContent = data.name[lang];

  const feastEl = document.getElementById('feastDay');
  if (feastEl) feastEl.textContent = data.feast_day[lang];

  const imgEl = document.getElementById('intercessorImg');
  if (imgEl && data.image) {
    imgEl.src = data.image;
    imgEl.alt = data.name[lang];
  }

  // Prayer
  const prayerEl = document.getElementById('prayerText');
  if (prayerEl) prayerEl.innerHTML = paragraphify(data.prayer[lang]);

  // History
  const historyEl = document.getElementById('historyText');
  if (historyEl) historyEl.innerHTML = paragraphify(data.history[lang]);

  // Novena
  if (data.novena && data.novena.length > 0) {
    renderNovenaDay(data, currentDay);
  }

  // Chaplet
  const chapletTextEl  = document.getElementById('chapletText');
  const noChapletEl    = document.getElementById('noChaplet');
  if (chapletTextEl && noChapletEl) {
    if (data.chaplet && data.chaplet.available && data.chaplet[lang]) {
      chapletTextEl.innerHTML = paragraphify(data.chaplet[lang]);
      chapletTextEl.style.display = 'block';
      noChapletEl.style.display = 'none';
    } else {
      chapletTextEl.style.display = 'none';
      noChapletEl.style.display = 'block';
    }
  }
}

function paragraphify(text) {
  return text
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

// ── TABS ───────────────────────────────────────────
function initTabs(meta) {
  const chapletBtn = document.querySelector('.chaplet-tab');
  if (chapletBtn && meta.chaplet) chapletBtn.classList.add('visible');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });
}

// ── NOVENA ─────────────────────────────────────────
function initNovena(data) {
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'), 10);
      setNovenaDay(data, day);
    });
  });

  document.getElementById('prevDay')?.addEventListener('click', () => {
    if (currentDay > 1) setNovenaDay(data, currentDay - 1);
  });
  document.getElementById('nextDay')?.addEventListener('click', () => {
    if (currentDay < 9) setNovenaDay(data, currentDay + 1);
  });
}

function setNovenaDay(data, day) {
  currentDay = day;
  document.querySelectorAll('.day-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.getAttribute('data-day'), 10) === day)
  );
  renderNovenaDay(data, day);
}

function renderNovenaDay(data, day) {
  const dayLabel = document.getElementById('currentDay');
  if (dayLabel) dayLabel.textContent = day;
  const dayData = data.novena.find(d => d.day === day);
  const novenaEl = document.getElementById('novenaText');
  if (novenaEl && dayData) novenaEl.innerHTML = paragraphify(dayData[currentLang]);
}

function showNotFound() {
  const loading = document.getElementById('loadingScreen');
  const notFound = document.getElementById('notFound');
  if (loading) loading.style.display = 'none';
  if (notFound) notFound.style.display = 'flex';
}

// ── HAMBURGER MENU ────────────────────────────────
function initMenu() {
  const btn     = document.getElementById('hamburgerBtn');
  const nav     = document.getElementById('sideNav');
  const overlay = document.getElementById('sideNavOverlay');
  const close   = document.getElementById('sideNavClose');
  const list    = document.getElementById('sideNavList');
  if (!btn || !nav || !list) return;

  // Populate list
  function renderMenuItems() {
    list.innerHTML = INTERCESSORS.map(m => `
      <li>
        <a class="side-nav-link" href="${buildIntercessorUrl(m.subdomain)}">
          ${m.name[currentLang]}
        </a>
      </li>`).join('');
  }
  renderMenuItems();

  // Re-render when language changes (called from setLanguage)
  window._renderMenuItems = renderMenuItems;

  const open  = () => { nav.classList.add('open'); overlay.classList.add('open'); };
  const close_ = () => { nav.classList.remove('open'); overlay.classList.remove('open'); };

  btn.addEventListener('click', open);
  close.addEventListener('click', close_);
  overlay.addEventListener('click', close_);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close_(); });
}

// ── BOOT ───────────────────────────────────────────
(function init() {
  currentLang = detectLanguage();
  setLanguage(currentLang);

  // Language toggle
  document.getElementById('langToggle')?.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
    // Reload home grid in new language
    if (!isIntercessorPage()) {
      const grid = document.getElementById('intercessorsGrid');
      if (grid) { grid.innerHTML = ''; initHomePage(); }
    }
  });

  if (isIntercessorPage()) {
    initIntercessorPage();
  } else {
    initHomePage();
  }

  initMenu();
})();
