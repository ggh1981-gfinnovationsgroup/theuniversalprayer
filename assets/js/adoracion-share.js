(function () {
  'use strict';

  function clearStatus(overlay) {
    const status = overlay.querySelector('.a33-share-status');
    if (status) status.textContent = '';
  }

  async function copyText(text, container) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const previousFocus = document.activeElement;
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    container.appendChild(input);
    try {
      input.select();
      if (!document.execCommand('copy')) throw new Error('Clipboard copy was rejected');
    } finally {
      input.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    }
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
    overlay.querySelector('.a33-modal-prayer').insertAdjacentElement('afterend', wrap);

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

      const previousFocus = document.activeElement;
      button.disabled = true;
      let nativeShareFailed = false;
      try {
        if (navigator.share) {
          try {
            await navigator.share(payload);
            showStatus(english ? 'Shared.' : 'Compartido.');
            return;
          } catch (error) {
            if (error && error.name === 'AbortError') return;
            console.error('No se pudo abrir el menú para compartir:', error);
            nativeShareFailed = true;
          }
        }

        try {
          await copyText(`${payload.text}\n\n${payload.url}`, wrap);
          showStatus(nativeShareFailed
            ? (english ? 'The share menu could not open. Verse, prayer, and link copied.' : 'No se pudo abrir Compartir. Se copiaron la cita, la oración y el enlace.')
            : (english ? 'Verse, prayer, and link copied.' : 'Cita, oración y enlace copiados.'));
        } catch (error) {
          console.error('No se pudieron copiar la cita, la oración y el enlace:', error);
          showStatus(english
            ? 'Could not share or copy. Try again or copy the text manually.'
            : 'No se pudo compartir ni copiar. Inténtalo de nuevo o copia el texto manualmente.');
        }
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
