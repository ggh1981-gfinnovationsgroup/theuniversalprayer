(function () {
  'use strict';

  async function share({ button, status, language, payload, isCurrent, kind }) {
    const english = language === 'en';
    const prayer = kind === 'prayer';
    const showStatus = message => {
      if (isCurrent()) status.textContent = message;
    };

    status.textContent = '';
    if (typeof navigator.share !== 'function') {
      showStatus(english
        ? `This browser does not support native sharing. Open this ${prayer ? 'prayer' : 'day'} in a compatible browser, such as Chrome or Safari on your phone.`
        : `Este navegador no admite el menú nativo para compartir. Abre ${prayer ? 'esta oración' : 'este día'} en un navegador compatible, como Chrome o Safari en tu teléfono.`);
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
        ? `Could not open the share menu. Try again or open this ${prayer ? 'prayer' : 'day'} in a compatible browser.`
        : `No se pudo abrir el menú para compartir. Inténtalo de nuevo o abre ${prayer ? 'esta oración' : 'este día'} en un navegador compatible.`);
    } finally {
      button.disabled = false;
      if (previousFocus === button && document.activeElement === document.body && isCurrent()) {
        button.focus({ preventScroll: true });
      }
    }
  }

  window.tupNativeShare = { share };
})();
