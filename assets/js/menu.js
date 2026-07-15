/**
 * menu.js — Shared site navigation menu for The Universal Prayer
 * Injects the side-nav panel and wires up the hamburger button on any page.
 * Language is read from localStorage (tup_lang) and updates on 'tup:langchange' event.
 */
(function () {
  'use strict';

  const MENU_ITEMS = [
    {
      id: 'home',
      href: function (path) {
        return path === '/' || path === '/index.html' || path.endsWith('/theuniversalprayer/') ? '#top' : '/';
      },
      labels: { es: 'Inicio', en: 'Home' },
      icon: '🏠',
      order: 0,
    },
    {
      id: 'family',
      href: function (path) {
        return path === '/' || path === '/index.html' || path.endsWith('/theuniversalprayer/') ? '#oraciones-familia' : '/#oraciones-familia';
      },
      labels: { es: 'Oraciones en Familia', en: 'Family Prayers' },
      icon: '🙏',
    },
    {
      id: 'saints',
      href: function (path) {
        return path === '/' || path === '/index.html' || path.endsWith('/theuniversalprayer/') ? '#intercessorsGrid' : '/#intercessorsGrid';
      },
      labels: { es: 'Intercesores', en: 'Intercessors' },
      icon: '✨',
    },
    {
      id: 'discernment',
      href: '/discernimiento/',
      labels: { es: 'Discernimiento católico', en: 'Catholic discernment' },
      icon: '🕯️',
    },
    { id: 'adoracion', href: '/adoracion/', labels: { es: 'Adoración', en: 'Adoration' }, icon: '✝' },
    { id: 'desierto', href: '/desierto/', labels: { es: 'Silencio y Escucha', en: 'Silence & Listening' }, icon: '🏕️' },
    { id: 'difuntos', href: '/difuntos/', labels: { es: 'Difuntos', en: 'Departed' }, icon: '🕯️' },
    { id: 'diospadre', href: '/diospadre/', labels: { es: 'Dios Padre', en: 'God the Father' }, icon: '☁️' },
    { id: 'enemigos', href: '/enemigos/', labels: { es: 'Bendecir enemigos', en: 'Bless enemies' }, icon: '🤍' },
    { id: 'espiritu', href: '/espiritu/', labels: { es: 'Espíritu Santo', en: 'Holy Spirit' }, icon: '🕊️' },
    { id: 'llamados', href: '/llamados/', labels: { es: 'Altar de Llamados', en: 'Call Altar' }, icon: '🌟' },
    { id: 'jovenes', href: '/jovenes/', labels: { es: 'Jóvenes en Cristo', en: 'Young in Christ' }, icon: '🔥' },
    { id: 'matrimonio', href: '/matrimonio/', labels: { es: 'Matrimonio', en: 'Marriage' }, icon: '💍' },
    { id: 'meses', href: '/meses/', labels: { es: 'Meses Devocionales', en: 'Devotional Months' }, icon: '📅' },
    { id: 'musica', href: '/musica/', labels: { es: 'Música', en: 'Music' }, icon: '🎵' },
    { id: 'misericordia', href: '/misericordia/', labels: { es: 'Perdón y Misericordia', en: 'Mercy & Repentance' }, icon: '🕯️' },
    { id: 'oraciones', href: '/oraciones/', labels: { es: 'Oraciones Básicas', en: 'Basic Prayers' }, icon: '📜' },
    { id: 'reconciliacion', href: '/reconciliacion/', labels: { es: 'Reconciliación', en: 'Reconciliation' }, icon: '🙏' },
    { id: 'rosario', href: '/rosario/', labels: { es: 'Rosario Interactivo', en: 'Interactive Rosary' }, icon: '📿' },
    { id: 'salud', href: '/salud/', labels: { es: 'Salud integral', en: 'Whole-person health' }, icon: '💚' },
  ];

  function getLang() {
    return localStorage.getItem('tup_lang') || 'es';
  }

  function injectNav() {
    if (document.getElementById('sideNav')) return; // already in page HTML

    const overlay = document.createElement('div');
    overlay.className = 'side-nav-overlay';
    overlay.id = 'sideNavOverlay';

    const nav = document.createElement('nav');
    nav.className = 'side-nav';
    nav.id = 'sideNav';
    nav.setAttribute('aria-label', 'Site menu');
    nav.innerHTML =
      '<div class="side-nav-header">' +
        '<span class="side-nav-title" id="sideNavTitleEs">Men\u00fa</span>' +
        '<span class="side-nav-title" id="sideNavTitleEn" style="display:none">Menu</span>' +
        '<button class="side-nav-close" id="sideNavClose" aria-label="Close menu">\u2715</button>' +
      '</div>' +
      '<ul class="side-nav-list" id="sideNavList"></ul>';

    // Insert right after <header>
    const header = document.querySelector('header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(nav, header.nextSibling);
      header.parentNode.insertBefore(overlay, nav);
    } else {
      document.body.appendChild(overlay);
      document.body.appendChild(nav);
    }
  }

  function renderItems(lang) {
    const list = document.getElementById('sideNavList');
    if (!list) return;

    const L = lang === 'es';
    const path = window.location.pathname;
    const isRoot = path === '/' || path === '/index.html' || path.endsWith('/theuniversalprayer/');

    const items = MENU_ITEMS
      .slice()
      .sort(function (a, b) {
        if (a.id === 'home' && b.id !== 'home') return -1;
        if (a.id !== 'home' && b.id === 'home') return 1;

        const aLabel = L ? a.labels.es : a.labels.en;
        const bLabel = L ? b.labels.es : b.labels.en;
        return aLabel.localeCompare(bLabel, L ? 'es' : 'en', { sensitivity: 'base' });
      });

    list.innerHTML = items.map(function (item) {
      var href = typeof item.href === 'function' ? item.href(path) : item.href;
      var label = L ? item.labels.es : item.labels.en;
      return '<li><a class="side-nav-link side-nav-' + item.id + '" href="' + href + '">' + item.icon + ' ' + label + '</a></li>';
    }).join('');

    // Update panel header title
    var es = document.getElementById('sideNavTitleEs');
    var en = document.getElementById('sideNavTitleEn');
    if (es) es.style.display = L ? '' : 'none';
    if (en) en.style.display = L ? 'none' : '';
  }

  function initSiteMenu() {
    injectNav();
    renderItems(getLang());

    var btn      = document.getElementById('hamburgerBtn');
    var nav      = document.getElementById('sideNav');
    var overlay  = document.getElementById('sideNavOverlay');
    var closeBtn = document.getElementById('sideNavClose');

    if (!btn || !nav) return;

    var openNav  = function () { nav.classList.add('open'); overlay.classList.add('open'); };
    var closeNav = function () { nav.classList.remove('open'); overlay.classList.remove('open'); };

    btn.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay)  overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

    // Re-render on language change dispatched by any page
    window.addEventListener('tup:langchange', function (e) {
      renderItems((e && e.detail) || getLang());
    });
  }

  // Expose so main.js can delegate to this instead of its own initMenu()
  window.initSiteMenu = initSiteMenu;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteMenu);
  } else {
    initSiteMenu();
  }
})();
