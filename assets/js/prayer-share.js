(function () {
  'use strict';

  let initialized = false;

  function initialLanguage(key) {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested === 'es' || requested === 'en') {
      localStorage.setItem(key, requested);
      return requested;
    }
    if (requested !== null) console.warn('Idioma compartido no reconocido:', requested);
    return localStorage.getItem(key) === 'en' ? 'en' : 'es';
  }

  function init() {
    if (initialized) return;
    const prayers = document.querySelectorAll('[data-share-prayer][data-lang="es"]');
    const controls = [];
    if (!prayers.length) {
      console.error('No se encontraron oraciones para compartir.');
      return;
    }
    initialized = true;

    prayers.forEach(spanish => {
      const key = spanish.dataset.sharePrayer;
      const matches = /^[a-z0-9-]+$/.test(key)
        ? document.querySelectorAll(`[data-share-prayer="${key}"][data-lang="en"]`)
        : [];
      const english = matches[0];
      if (matches.length !== 1 || !spanish.id || !english.id || spanish.parentElement !== english.parentElement) {
        console.error('No se pudo preparar una oración bilingüe para compartir:', key);
        const warning = document.createElement('p');
        warning.className = 'tup-prayer-share-status';
        warning.setAttribute('role', 'status');
        warning.textContent = document.documentElement.lang === 'en'
          ? 'Sharing is unavailable for this prayer.'
          : 'No se puede compartir esta oración.';
        spanish.insertAdjacentElement('afterend', warning);
        return;
      }

      const wrap = document.createElement('div');
      wrap.className = 'tup-prayer-share';
      wrap.dataset.shareControl = key;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tup-prayer-share-button';
      button.innerHTML = '<span data-lang="es">Compartir esta oración</span><span data-lang="en">Share this prayer</span>';
      const status = document.createElement('p');
      status.className = 'tup-prayer-share-status';
      status.id = `share-status-${key}`;
      status.setAttribute('role', 'status');
      button.setAttribute('aria-describedby', status.id);
      wrap.append(button, status);
      english.insertAdjacentElement('afterend', wrap);
      controls.push({ button, status });

      button.addEventListener('click', () => {
        const language = document.documentElement.lang === 'en' ? 'en' : 'es';
        const prayer = language === 'en' ? english : spanish;
        const section = prayer.closest('.emerg-details, .maria-card, .maria-mantle, .nov-panel');
        const heading = section && section.querySelector(
          `.emerg-summary-title[data-lang="${language}"], h2 [data-lang="${language}"], h3 [data-lang="${language}"]`
        );
        const title = prayer.dataset.shareTitle || (heading && heading.textContent.trim());
        if (!title || !window.tupNativeShare || typeof window.tupNativeShare.share !== 'function') {
          console.error('No se pudo preparar el contenido para compartir:', key);
          status.textContent = language === 'en'
            ? 'Could not prepare this prayer for sharing. Please reload and try again.'
            : 'No se pudo preparar esta oración para compartir. Recarga la página e inténtalo de nuevo.';
          return;
        }

        const url = new URL(window.location.pathname, window.location.origin);
        url.searchParams.set('lang', language);
        url.hash = prayer.id;
        window.tupNativeShare.share({
          button,
          status,
          language,
          kind: 'prayer',
          isCurrent: () => wrap.isConnected && document.documentElement.lang === language,
          payload: {
            title,
            text: [
              title,
              prayer.textContent.trim(),
              language === 'en' ? 'Read this prayer on The Universal Prayer:' : 'Lee esta oración en The Universal Prayer:',
            ].join('\n\n'),
            url: url.href,
          },
        });
      });
    });

    function updateLabels() {
      const language = document.documentElement.lang === 'en' ? 'en' : 'es';
      controls.forEach(({ button, status }) => {
        button.querySelectorAll('[data-lang]').forEach(label => {
          label.style.display = label.dataset.lang === language ? '' : 'none';
        });
        status.textContent = '';
      });
    }

    function openLinkedPrayer() {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target || !target.dataset.sharePrayer) return;
      let visibleTarget = target;
      if (target.dataset.lang !== document.documentElement.lang) {
        visibleTarget = document.querySelector(
          `[data-share-prayer="${target.dataset.sharePrayer}"][data-lang="${document.documentElement.lang}"]`
        ) || target;
      }
      for (let parent = visibleTarget.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
      requestAnimationFrame(() => visibleTarget.scrollIntoView({ block: 'start' }));
    }

    function synchronizeSharedAddress() {
      const url = new URL(window.location.href);
      const target = document.getElementById(url.hash.slice(1));
      const prayerKey = target && target.dataset.sharePrayer;
      if (!url.searchParams.has('lang') && !prayerKey) return;

      const language = document.documentElement.lang === 'en' ? 'en' : 'es';
      url.searchParams.set('lang', language);
      if (prayerKey) {
        const translated = document.querySelector(`[data-share-prayer="${prayerKey}"][data-lang="${language}"]`);
        if (translated) url.hash = translated.id;
      }
      window.history.replaceState(window.history.state, '', url.href);
    }

    updateLabels();
    openLinkedPrayer();
    window.addEventListener('tup:langchange', () => {
      updateLabels();
      synchronizeSharedAddress();
    });
    window.addEventListener('hashchange', openLinkedPrayer);
  }

  window.tupPrayerShare = { initialLanguage, init };
})();
