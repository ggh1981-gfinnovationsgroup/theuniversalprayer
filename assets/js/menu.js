/**
 * menu.js — Shared site navigation menu for The Universal Prayer
 * Injects the side-nav panel and wires up the hamburger button on any page.
 * Language is read from localStorage (tup_lang) and updates on 'tup:langchange' event.
 */
(function () {
  'use strict';

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
    const homeHref   = isRoot ? '#top'                 : '/';
    const familyHref = isRoot ? '#oraciones-familia'   : '/#oraciones-familia';
    const interHref  = isRoot ? '#intercessorsGrid'    : '/#intercessorsGrid';

    list.innerHTML =
      '<li><a class="side-nav-link side-nav-home"       href="' + homeHref   + '">' + (L ? '\u2190 Inicio'                : '\u2190 Home')              + '</a></li>' +
      '<li><a class="side-nav-link side-nav-family"     href="' + familyHref + '">' + (L ? '\uD83D\uDE4F Oraciones en Familia' : '\uD83D\uDE4F Family Prayers')   + '</a></li>' +
      '<li><a class="side-nav-link side-nav-saints"     href="' + interHref  + '">' + (L ? '\u2728 Intercesores'          : '\u2728 Intercessors')      + '</a></li>' +
      '<li><a class="side-nav-link side-nav-oraciones"  href="/oraciones/">'  + (L ? '\uD83D\uDCDC Oraciones B\u00e1sicas'  : '\uD83D\uDCDC Basic Prayers')     + '</a></li>' +
      '<li><a class="side-nav-link side-nav-rosario"    href="/rosario/">'    + (L ? '\uD83D\uDCFF Rosario Interactivo'   : '\uD83D\uDCFF Interactive Rosary') + '</a></li>' +
      '<li><a class="side-nav-link side-nav-adoracion"  href="/adoracion/">'  + (L ? '\u271D Adoraci\u00f3n'             : '\u271D Adoration')          + '</a></li>' +
      '<li><a class="side-nav-link side-nav-espiritu"   href="/espiritu/">'   + (L ? '\uD83D\uDC4A Esp\u00edritu Santo'  : '\uD83D\uDC4A Holy Spirit')   + '</a></li>' +
      '<li><a class="side-nav-link side-nav-matrimonio" href="/matrimonio/">' + (L ? '\uD83D\uDC8D Matrimonio'           : '\uD83D\uDC8D Marriage')      + '</a></li>' +
      '<li><a class="side-nav-link side-nav-difuntos"   href="/difuntos/">'   + (L ? '\uD83D\uDD6F Difuntos'             : '\uD83D\uDD6F Departed')      + '</a></li>';

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
