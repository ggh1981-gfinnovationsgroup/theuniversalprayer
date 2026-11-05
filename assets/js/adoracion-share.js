(function () {
  'use strict';

  function clearStatus(overlay) {
    const status = overlay.querySelector('.a33-share-status');
    if (status) status.textContent = '';
  }

  function verseSource(series, language) {
    if (series === 'enemigos') {
      return language === 'en'
        ? 'Bible text: New American Bible (Vatican).'
        : 'Texto bíblico: Biblia CEE (Vaticano).';
    }
    return language === 'en'
      ? 'Bible passage edition: not identified.'
      : 'Edición del fragmento bíblico: no identificada.';
  }

  function attach({ series, overlay, getDay, getLang, getTitle }) {
    const source = document.createElement('p');
    source.className = 'a33-verse-source';
    ['es', 'en'].forEach(language => {
      const label = document.createElement('span');
      label.dataset.lang = language;
      label.textContent = verseSource(series, language);
      label.style.display = language === getLang() ? '' : 'none';
      source.append(label);
    });
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
    overlay.querySelector('.a33-modal-verse').insertAdjacentElement('afterend', source);
    source.insertAdjacentElement('afterend', wrap);

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
      if (!window.tupNativeShare || typeof window.tupNativeShare.share !== 'function') {
        console.error('No se pudo preparar el contenido para compartir.');
        status.textContent = english
          ? 'Could not prepare this day for sharing. Please reload and try again.'
          : 'No se pudo preparar este día para compartir. Recarga la página e inténtalo de nuevo.';
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
          verseSource(series, language),
          `${english ? 'Prayer of the Day' : 'Oración del Día'}\n${day.prayer[language] || day.prayer.es}`,
          english ? 'Read the full day on The Universal Prayer:' : 'Lee el día completo en The Universal Prayer:',
        ].join('\n\n'),
        url: url.href,
      };
      await window.tupNativeShare.share({
        button,
        status,
        language,
        payload,
        kind: 'day',
        isCurrent: () => getDay() === day && getLang() === language,
      });
    });
  }

  window.tup33Share = { attach, clearStatus };
})();
