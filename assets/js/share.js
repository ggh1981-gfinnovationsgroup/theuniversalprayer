/**
 * share.js — Shared page share button for The Universal Prayer
 * Inserts one share control right before the page footer on any page that
 * loads it (menu.js loads it from the same directory on every menu page).
 * Uses the native share menu when available and falls back to direct links
 * for WhatsApp, Facebook, X and Telegram, plus a copy link option.
 * Language follows localStorage (tup_lang) and the 'tup:langchange' event.
 * The quien-soy page keeps its own special share and is skipped here.
 */
(function () {
  'use strict';

  var initialized = false;

  function currentLang() {
    var docLang = document.documentElement.lang;
    if (docLang === 'en' || docLang === 'es') return docLang;
    try {
      return localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';
    } catch (error) {
      return 'es';
    }
  }

  function pageUrl() {
    return window.location.href;
  }

  function pageTitle() {
    return document.title || 'The Universal Prayer';
  }

  function refreshLinks(links) {
    var url = encodeURIComponent(pageUrl());
    var text = encodeURIComponent(pageTitle());
    links.whatsapp.href = 'https://wa.me/?text=' + encodeURIComponent(pageTitle() + ' ' + pageUrl());
    links.facebook.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    links.x.href = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url;
    links.telegram.href = 'https://t.me/share/url?url=' + url + '&text=' + text;
  }

  function init() {
    if (initialized) return;
    if (document.querySelector('.tup-page-share')) return;
    // quien-soy has its own special share (image and WhatsApp): do not duplicate it.
    if (document.getElementById('qs-share-main')) return;
    if (!document.body) return;
    initialized = true;

    var wrap = document.createElement('div');
    wrap.className = 'tup-page-share';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'tup-page-share-button';
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML =
      '<span data-lang="es">Compartir esta p\u00e1gina</span>' +
      '<span data-lang="en">Share this page</span>';

    var panel = document.createElement('div');
    panel.className = 'tup-page-share-panel';
    panel.hidden = true;

    function makeLink(network, label) {
      var a = document.createElement('a');
      a.className = 'tup-page-share-link';
      a.dataset.shareNetwork = network;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = label;
      return a;
    }

    var links = {
      whatsapp: makeLink('whatsapp', 'WhatsApp'),
      facebook: makeLink('facebook', 'Facebook'),
      x: makeLink('x', 'X'),
      telegram: makeLink('telegram', 'Telegram'),
    };

    var copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'tup-page-share-copy';
    copyButton.innerHTML =
      '<span data-lang="es">Copiar el enlace</span>' +
      '<span data-lang="en">Copy the link</span>';

    var status = document.createElement('p');
    status.className = 'tup-page-share-status';
    status.setAttribute('role', 'status');

    panel.append(links.whatsapp, links.facebook, links.x, links.telegram, copyButton);
    wrap.append(button, panel, status);

    var footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(wrap, footer);
    } else {
      var main = document.querySelector('main');
      if (main) main.appendChild(wrap);
      else document.body.appendChild(wrap);
    }

    refreshLinks(links);

    function updateLabels(lang) {
      var language = lang === 'en' ? 'en' : 'es';
      wrap.querySelectorAll('[data-lang]').forEach(function (label) {
        label.style.display = label.dataset.lang === language ? '' : 'none';
      });
      status.textContent = '';
    }

    function setPanel(open) {
      panel.hidden = !open;
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) refreshLinks(links);
    }

    button.addEventListener('click', function () {
      if (typeof navigator.share === 'function') {
        var payload = { title: pageTitle(), text: pageTitle(), url: pageUrl() };
        navigator.share(payload).catch(function (error) {
          if (error && error.name === 'AbortError') return;
          setPanel(true);
        });
      } else {
        setPanel(panel.hidden);
      }
    });

    copyButton.addEventListener('click', function () {
      var lang = currentLang();
      var done = function () {
        status.textContent = lang === 'en' ? 'Link copied.' : 'Enlace copiado.';
      };
      var fallbackCopy = function () {
        var area = document.createElement('textarea');
        area.value = pageUrl();
        area.setAttribute('readonly', '');
        area.style.position = 'absolute';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand('copy');
          done();
        } catch (error) {
          status.textContent = lang === 'en'
            ? 'Copy this link: ' + pageUrl()
            : 'Copia este enlace: ' + pageUrl();
        }
        document.body.removeChild(area);
      };
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(pageUrl()).then(done, fallbackCopy);
      } else {
        fallbackCopy();
      }
    });

    updateLabels(currentLang());

    window.addEventListener('tup:langchange', function (event) {
      updateLabels((event && event.detail) || currentLang());
    });

    // Some pages update the document language without emitting tup:langchange.
    new MutationObserver(function () {
      updateLabels(currentLang());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
