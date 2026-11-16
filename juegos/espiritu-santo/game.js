// El Camino del Espíritu: arranque de la página.
// Cablea el botón de idioma del encabezado (textos estáticos con
// data-es y data-en, como en las demás páginas de juegos), fusiona el
// contenido cargado por los scripts content-*.js (cada global puede
// faltar sin romper la página) y llama al motor window.RpgGame.
(() => {
  'use strict';

  const languageToggle = document.getElementById('languageToggle');
  let language = localStorage.getItem('tup_lang') === 'en' ? 'en' : 'es';

  function applyStaticLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-es][data-en]').forEach((element) => {
      element.innerHTML = element.dataset[language];
    });
    if (languageToggle) {
      languageToggle.textContent = language === 'es' ? 'EN' : 'ES';
      languageToggle.setAttribute('aria-label', language === 'es' ? 'Switch language' : 'Cambiar idioma');
    }
  }

  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      language = language === 'es' ? 'en' : 'es';
      localStorage.setItem('tup_lang', language);
      applyStaticLanguage();
      window.dispatchEvent(new CustomEvent('tup:langchange', { detail: language }));
    });
  }
  applyStaticLanguage();

  const config = {
    world: window.RPG_WORLD || null,
    gifts: Array.isArray(window.RPG_GIFTS) ? window.RPG_GIFTS : [],
    charisms: Array.isArray(window.RPG_CHARISMS) ? window.RPG_CHARISMS : [],
    prayers: window.RPG_PRAYERS || null,
    playerFigure: {
      robe: '#7a5a34',
      skin: '#d9a77f',
      hair: '#3a2a1c',
      accessory: 'cross',
    },
  };

  if (typeof window.RpgGame === 'function') {
    window.RpgGame(config);
  }
})();
