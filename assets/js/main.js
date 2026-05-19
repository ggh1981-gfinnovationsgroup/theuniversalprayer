/* =====================================================
   THE UNIVERSAL PRAYER — main.js
   Subdomain detection · Language toggle · Content loader
   ===================================================== */

'use strict';

// ── TRANSLATIONS (UI strings) ──────────────────────
const i18n = {
  en: {
    site_title:         'The Universal Prayer',
    hero_title:         'The Universal Prayer',
    hero_subtitle:      'Novenas, chaplets and prayers for every intercessor — free, always.',
    choose_intercessor: 'Choose your intercessor',
    feast_day:          'Feast Day:',
    tab_prayer:         'Prayer',
    tab_history:        'History',
    tab_novena:         'Novena',
    tab_chaplet:        'Chaplet',
    day:                'Day',
    no_chaplet:         'No chaplet available for this intercessor.',
    novena_prayers:     '📿 Prayers to pray',
    chaplet_lbl:        'Chaplet',
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
    hero_title:         'La Oración Universal',
    hero_subtitle:      'Novenas, coronillas y oraciones para cada intercesor — gratis, siempre.',
    choose_intercessor: 'Elige tu intercesor',
    feast_day:          'Día festivo:',
    tab_prayer:         'Oración',
    tab_history:        'Historia',
    tab_novena:         'Novena',
    tab_chaplet:        'Coronilla',
    day:                'Día',
    no_chaplet:         'No hay coronilla disponible para este intercesor.',
    novena_prayers:     '📿 Oraciones para rezar',
    chaplet_lbl:        'Coronilla',
    not_found_title:    'Intercesor no encontrado',
    not_found_text:     'No pudimos encontrar este intercesor. Por favor regresa a la página principal.',
    go_home:            'Ir al inicio',
    footer_text:             'Un recurso devocional católico gratuito. Sin anuncios. Sin rastreo.',
    universal_prayer_title:  'La Oración Universal y Definitiva',
    universal_prayer_dedication: 'Para toda persona que la rece — solo, en pareja, en familia o en grupo',
    menu_title:              'Intercesores',
  },
};

// ── PRAYER TEXTS (for novena support panel) ────────
const PRAYERS = {
  es: {
    pn_title:    'Padre Nuestro',
    pn:          'Padre nuestro, que estás en el cielo,\nsantificado sea tu nombre;\nvenga a nosotros tu reino;\nhágase tu voluntad\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo también nosotros perdonamos\na los que nos ofenden;\nno nos dejes caer en tentación,\ny líbranos del mal. Amén.',
    am_title:    'Ave María',
    am:          'Dios te salve, María,\nllena eres de gracia,\nel Señor es contigo;\nbendita tú eres entre todas las mujeres,\ny bendito es el fruto de tu vientre, Jesús.\nSanta María, Madre de Dios,\nruega por nosotros, pecadores,\nahora y en la hora de nuestra muerte. Amén.',
    gloria_title:'Gloria',
    gloria:      'Gloria al Padre,\ny al Hijo,\ny al Espíritu Santo.\nComo era en el principio,\nahora y siempre,\npor los siglos de los siglos. Amén.',
    credo_title: 'Credo de los Apóstoles',
    credo:       'Creo en Dios,\nPadre todopoderoso,\nCreador del cielo y de la tierra.\nCreo en Jesucristo, su único Hijo,\nNuestro Señor,\nque fue concebido por obra y gracia\ndel Espíritu Santo,\nnació de Santa María Virgen,\npadeció bajo el poder de Poncio Pilato,\nfue crucificado, muerto y sepultado,\ndescendió a los infiernos,\nal tercer día resucitó de entre los muertos,\nsubió a los cielos y está sentado\na la derecha de Dios Padre todopoderoso.\nDesde allí ha de venir a juzgar\na vivos y muertos.\nCreo en el Espíritu Santo,\nla santa Iglesia católica,\nla comunión de los santos,\nel perdón de los pecados,\nla resurrección de la carne\ny la vida eterna. Amén.',
  },
  en: {
    pn_title:    'Our Father',
    pn:          'Our Father, who art in heaven,\nhallowed be Thy name;\nThy kingdom come;\nThy will be done\non earth as it is in heaven.\nGive us this day our daily bread;\nand forgive us our trespasses,\nas we forgive those\nwho trespass against us;\nand lead us not into temptation,\nbut deliver us from evil. Amen.',
    am_title:    'Hail Mary',
    am:          'Hail Mary, full of grace,\nthe Lord is with thee;\nblessed art thou among women,\nand blessed is the fruit\nof thy womb, Jesus.\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour\nof our death. Amen.',
    gloria_title:'Glory Be',
    gloria:      'Glory be to the Father,\nand to the Son,\nand to the Holy Spirit.\nAs it was in the beginning,\nis now, and ever shall be,\nworld without end. Amen.',
    credo_title: "Apostles' Creed",
    credo:       'I believe in God,\nthe Father almighty,\nCreator of heaven and earth,\nand in Jesus Christ,\nhis only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nhe descended into hell;\non the third day he rose again;\nhe ascended into heaven,\nand is seated at the right hand\nof God the Father almighty;\nfrom there he will come\nto judge the living and the dead.\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting. Amen.',
  },
};

// ── ALL KNOWN INTERCESSORS ─────────────────────────
const INTERCESSORS = [
  { id: 'misericordia',      subdomain: 'misericordia',      chaplet: true,  novena: true,  color: '#a01818', short: { es: 'D. Misericordia', en: 'Divine Mercy'     }, name: { en: 'Divine Mercy',                          es: 'Divina Misericordia'                      } },
  { id: 'inmaculadocorazon', subdomain: 'inmaculadocorazon', chaplet: false, novena: true,  color: '#1a5fa0', short: { es: 'Inm. Corazón',    en: 'Imm. Heart'       }, name: { en: 'Immaculate Heart of Mary',               es: 'Inmaculado Corazón de María'               } },
  { id: 'sagradocorazon',    subdomain: 'sagradocorazon',    chaplet: true,  novena: true,  color: '#7a1515', short: { es: 'S. Corazón',      en: 'Sacred Heart'     }, name: { en: 'Sacred Heart',                          es: 'Sagrado Corazón'                          } },
  { id: 'providencia',       subdomain: 'providencia',       chaplet: false, novena: true,  color: '#6b4800', short: { es: 'Div. Providencia', en: 'Div. Providence'  }, name: { en: 'Divine Providence',                     es: 'La Divina Providencia'                    } },
  { id: 'guadalupe',         subdomain: 'guadalupe',         chaplet: false, novena: true,  color: '#7a6010', short: { es: 'Guadalupe',        en: 'Guadalupe'        }, name: { en: 'Our Lady of Guadalupe',                 es: 'Virgen de Guadalupe'                      } },
  { id: 'fatima',            subdomain: 'fatima',            chaplet: true,  novena: true,  color: '#1a4a7a', short: { es: 'Fátima',           en: 'Fátima'           }, name: { en: 'Our Lady of Fatima',                    es: 'Virgen de Fátima'                         } },
  { id: 'padrepio',          subdomain: 'padrepio',          chaplet: true,  novena: true,  color: '#5a3828', short: { es: 'Padre Pío',        en: 'Padre Pio'        }, name: { en: 'Padre Pio',                             es: 'Padre Pío'                                } },
  { id: 'sanjose',           subdomain: 'sanjose',           chaplet: false, novena: true,  color: '#7a5e18', short: { es: 'San José',         en: 'St. Joseph'       }, name: { en: 'Saint Joseph',                          es: 'San José'                                 } },
  { id: 'sanjudas',          subdomain: 'sanjudas',          chaplet: true,  novena: true,  color: '#1a6a3a', short: { es: 'San Judas',        en: 'St. Jude'         }, name: { en: 'Saint Jude Thaddaeus',                  es: 'San Judas Tadeo'                          } },
  { id: 'juanpablo',         subdomain: 'juanpablo',         chaplet: false, novena: true,  color: '#2a3a5a', short: { es: 'Juan Pablo II',    en: 'John Paul II'     }, name: { en: 'Saint John Paul II',                    es: 'San Juan Pablo II'                        } },
  { id: 'sanantonio',        subdomain: 'sanantonio',        chaplet: true,  novena: true,  color: '#6a3018', short: { es: 'San Antonio',      en: 'St. Anthony'      }, name: { en: 'Saint Anthony of Padua',                es: 'San Antonio de Padua'                     } },
  { id: 'teresacalcuta',     subdomain: 'teresacalcuta',     chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'Sta. Teresa',      en: 'St. Teresa'       }, name: { en: 'Saint Teresa of Calcutta',              es: 'Santa Teresa de Calcuta'                  } },
  { id: 'sanmiguel',         subdomain: 'sanmiguel',         chaplet: true,  novena: true,  color: '#253070', short: { es: 'San Miguel',       en: 'St. Michael'      }, name: { en: 'Saint Michael the Archangel',           es: 'San Miguel Arcángel'                      } },
  { id: 'divinaprovidencia', subdomain: 'divinaprovidencia', chaplet: false, novena: true,  color: '#7a5a00', short: { es: 'N.S. Providencia', en: 'Lady Providence'  }, name: { en: 'Our Lady of Divine Providence',         es: 'Nuestra Señora de la Divina Providencia'  } },
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

  // Re-render quick nav labels in new language
  if (window._renderQuickNav) window._renderQuickNav();

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
  if (meta.chaplet) badges.push(`<span class="badge">${lang === 'en' ? 'Chaplet' : 'Coronilla'}</span>`);

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
  return `/intercesor/?intercesor=${subdomain}`;
}

// ── QUICK NAV ──────────────────────────────────────
function renderQuickNav() {
  const nav = document.getElementById('quickNav');
  if (!nav) return;

  const inner = document.createElement('div');
  inner.className = 'quick-nav-inner';

  for (const m of INTERCESSORS) {
    const item = document.createElement('a');
    item.className = 'quick-nav-item';
    item.href = buildIntercessorUrl(m.subdomain);
    if (m.color) item.style.setProperty('--item-color', m.color);

    const circle = document.createElement('div');
    circle.className = 'quick-nav-circle';
    circle.style.backgroundImage = `url('/assets/images/${m.id}.svg')`;
    if (m.color) circle.style.backgroundColor = m.color;

    const label = document.createElement('span');
    label.className = 'quick-nav-label';
    label.textContent = (m.short && m.short[currentLang]) || m.name[currentLang];

    item.appendChild(circle);
    item.appendChild(label);
    inner.appendChild(item);
  }

  nav.innerHTML = '';
  nav.appendChild(inner);
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

  // Novena support panel (prayers accordion)
  renderNovenaSupportPanel(data);
}

function paragraphify(text) {
  return text
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

// ── NOVENA SUPPORT PANEL ───────────────────────────
function renderNovenaSupportPanel(data) {
  const panel   = document.getElementById('novenaSupportPanel');
  const toggle  = document.getElementById('novenaSupportToggle');
  const content = document.getElementById('novenaSupportContent');
  const arrow   = document.getElementById('novenaSupportArrow');
  if (!panel || !toggle || !content) return;

  const lang = currentLang;
  const p    = PRAYERS[lang];
  const t    = i18n[lang];

  // Update toggle label text
  toggle.querySelector('.support-label-es').style.display = lang === 'es' ? '' : 'none';
  toggle.querySelector('.support-label-en').style.display = lang === 'en' ? '' : 'none';

  function prayerBlock(title, text) {
    return `<div class="support-prayer">
      <div class="support-prayer-title">${title}</div>
      <div class="support-prayer-text">${text.replace(/\n/g, '<br>')}</div>
    </div>`;
  }

  let html = prayerBlock(p.pn_title, p.pn)
    + '<hr class="support-prayer-divider">'
    + prayerBlock(p.am_title, p.am)
    + '<hr class="support-prayer-divider">'
    + prayerBlock(p.gloria_title, p.gloria)
    + '<hr class="support-prayer-divider">'
    + prayerBlock(p.credo_title, p.credo);

  if (data.chaplet && data.chaplet.available && data.chaplet[lang]) {
    const chapletTitle = `${data.name[lang]} — ${t.chaplet_lbl}`;
    html += '<hr class="support-prayer-divider">'
      + `<div class="support-prayer support-chaplet">`
      + `<div class="support-prayer-title">${chapletTitle}</div>`
      + `<div class="support-prayer-text">${paragraphify(data.chaplet[lang])}</div>`
      + `</div>`;
  }

  content.innerHTML = html;

  // Wire toggle (only once — replace to avoid duplicates)
  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);
  document.getElementById('novenaSupportToggle').addEventListener('click', function() {
    const isOpen = !content.hidden;
    content.hidden = isOpen;
    this.setAttribute('aria-expanded', String(!isOpen));
    const ar = document.getElementById('novenaSupportArrow');
    if (ar) ar.style.transform = isOpen ? '' : 'rotate(180deg)';
  });
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
    const homeHref   = isIntercessorPage() ? '/' : '#top';
    const prayerHref = isIntercessorPage() ? '/#oracion-universal' : '#oracion-universal';
    const homeLabel   = currentLang === 'es' ? '← Inicio' : '← Home';
    const prayerLabel = currentLang === 'es' ? '✝ Oración Universal' : '✝ Universal Prayer';
    const dividerLabel = currentLang === 'es' ? 'Intercesores' : 'Intercessors';

    const topLinks = `
      <li><a class="side-nav-link side-nav-home" href="${homeHref}">${homeLabel}</a></li>
      <li><a class="side-nav-link side-nav-prayer" href="${prayerHref}">${prayerLabel}</a></li>
      <li class="side-nav-divider"><span>${dividerLabel}</span></li>`;

    list.innerHTML = topLinks + INTERCESSORS.map(m => `
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
      renderQuickNav();
    }
  });

  if (isIntercessorPage()) {
    initIntercessorPage();
  } else {
    renderQuickNav();
    window._renderQuickNav = renderQuickNav;
    initHomePage();
  }

  initMenu();
})();
