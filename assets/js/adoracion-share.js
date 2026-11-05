(function () {
  'use strict';

  function clearStatus(overlay) {
    const status = overlay.querySelector('.a33-share-status');
    if (status) status.textContent = '';
  }

  function attach({ series, overlay, getDay, getLang, getTitle }) {
    const wrap = document.createElement('div');
    wrap.className = 'a33-share-wrap';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'a33-tts-btn a33-share-btn';
    button.innerHTML = '<span data-lang="es">Compartir cita y oración</span><span data-lang="en">Share verse and prayer</span>';
    button.querySelectorAll('[data-lang]').forEach(label => {
      label.style.display = label.dataset.lang === getLang() ? '' : 'none';
    });
    const status = document.createElement('p');
    status.className = 'a33-share-status';
    status.setAttribute('role', 'status');
    wrap.append(button, status);
    overlay.querySelector('.a33-modal-verse').insertAdjacentElement('afterend', wrap);

    button.addEventListener('click', async () => {
      clearStatus(overlay);
      const day = getDay();
      const language = getLang();
      const english = language === 'en';
      if (!day) {
        console.error('No hay un día abierto para compartir.');
        status.textContent = english ? 'Open a day before sharing.' : 'Abre un día antes de compartir.';
        return;
      }

      const title = `${getTitle(language).trim()} — ${english ? 'Day' : 'Día'} ${day.n}: ${day.theme[language] || day.theme.es}`;
      const url = new URL('/adoracion/', window.location.origin);
      url.searchParams.set('jornada', series);
      url.searchParams.set('dia', String(day.n));
      url.searchParams.set('lang', language);
      const payload = {
        title,
        text: [
          title,
          `${day.verse[language] || day.verse.es}\n(${day.verse.ref})`,
          `${english ? 'Prayer of the Day' : 'Oración del Día'}\n${day.prayer[language] || day.prayer.es}`,
          english ? 'Read the full day on The Universal Prayer:' : 'Lee el día completo en The Universal Prayer:',
        ].join('\n\n'),
        url: url.href,
      };
      const showStatus = message => {
        if (getDay() === day && getLang() === language) status.textContent = message;
      };

      if (typeof navigator.share !== 'function') {
        showStatus(english
          ? 'This browser does not support native sharing. Open this day in a compatible browser, such as Chrome or Safari on your phone.'
          : 'Este navegador no admite el menú nativo para compartir. Abre este día en un navegador compatible, como Chrome o Safari en tu teléfono.');
        return;
      }

      const previousFocus = document.activeElement;
      button.disabled = true;
      try {
        await navigator.share(payload);
        showStatus(english ? 'Share menu opened.' : 'Se abrió el menú para compartir.');
      } catch (error) {
        if (error && error.name === 'AbortError') return;
        console.error('No se pudo abrir el menú para compartir:', error);
        showStatus(english
          ? 'Could not open the share menu. Try again or open this day in a compatible browser.'
          : 'No se pudo abrir el menú para compartir. Inténtalo de nuevo o abre este día en un navegador compatible.');
      } finally {
        button.disabled = false;
        if (previousFocus === button && document.activeElement === document.body && getDay() === day) {
          button.focus({ preventScroll: true });
        }
      }
    });
  }

  window.tup33Share = { attach, clearStatus };
})();
