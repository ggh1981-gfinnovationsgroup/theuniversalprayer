(function () {
  'use strict';

  async function digest(value) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('La verificación requiere un contexto seguro y Web Crypto.');
    }
    const bytes = new TextEncoder().encode(value);
    const hash = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function reportFailure(locked, error) {
    console.error('No se pudo verificar el acceso a la página:', error);
    if (!locked) return;
    const es = locked.querySelector('p[data-lang="es"]');
    const en = locked.querySelector('p[data-lang="en"]');
    if (es) es.textContent = 'No se pudo verificar el acceso. Recarga la página e inténtalo de nuevo.';
    if (en) en.textContent = 'Could not verify access. Reload the page and try again.';
  }

  async function unlock(value, expected, locked, content) {
    if (!value) return;
    try {
      if (await digest(value) === expected) {
        if (locked) locked.style.display = 'none';
        if (content) content.style.display = '';
      }
    } catch (error) {
      reportFailure(locked, error);
    }
  }

  // This preserves old links; client-side checks do not make static pages private.
  window.tupPrivateAccess = { digest, unlock };
})();
