(function () {
  'use strict';

  const entries = window.tupPrivateSearchEntries;
  const access = window.tupPrivateAccess;
  const fields = [document.getElementById('quickNavSearch'), document.getElementById('cardsSearch')].filter(Boolean);
  const targets = [document.getElementById('quickSecretSearchResult'), document.getElementById('secretSearchResult')].filter(Boolean);
  if (!fields.length || !targets.length) return;

  let generation = 0;
  let activeQuery = '';

  function normalize(value) {
    return value.toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function language() {
    return document.documentElement.lang === 'en' ? 'en' : 'es';
  }

  function clearResults() {
    targets.forEach(target => {
      target.replaceChildren();
      target.hidden = true;
    });
  }

  function reportFailure(error) {
    console.error('No se pudo completar la búsqueda personal:', error);
    targets.forEach(target => {
      target.textContent = language() === 'en'
        ? 'The personal search is unavailable. Reload the page and try again.'
        : 'La búsqueda personal no está disponible. Recarga la página e inténtalo de nuevo.';
      target.hidden = false;
    });
  }

  async function findMatches(query, current) {
    if (!Array.isArray(entries) || !access || typeof access.digest !== 'function') {
      throw new Error('Faltan los recursos de la búsqueda personal.');
    }
    const text = normalize(query);
    const lengths = [...new Set(entries.map(entry => entry.length))];
    const found = new Map();
    for (const length of lengths) {
      const candidates = entries.filter(entry => entry.length === length);
      for (let i = 0; i <= text.length - length; i++) {
        if (current !== generation) return null;
        const key = text.slice(i, i + length);
        const hash = await access.digest(key);
        for (const entry of candidates) {
          if (entry.digest === hash && !found.has(entry)) found.set(entry, key);
        }
      }
    }
    return entries.filter(entry => found.has(entry)).map(entry => ({ entry, key: found.get(entry) }));
  }

  function displayMatches(matches) {
    if (!matches.length) {
      clearResults();
      return;
    }
    document.querySelectorAll('.quick-nav-item, #intercessorsGrid .intercessor-card').forEach(item => {
      item.style.display = 'none';
    });
    targets.forEach(target => {
      target.replaceChildren();
      matches.forEach(({ entry, key }) => {
        const link = document.createElement('a');
        const url = new URL(entry.href, window.location.origin);
        url.searchParams.set('clave', key);
        link.href = url.href;
        const icon = document.createElement('img');
        icon.className = 'secret-result-icon';
        icon.src = entry.icon;
        icon.alt = '';
        link.append(icon, document.createTextNode(entry.text[language()]));
        target.appendChild(link);
      });
      target.hidden = false;
    });
  }

  async function update(query) {
    activeQuery = query;
    const current = ++generation;
    clearResults();
    try {
      const matches = await findMatches(query, current);
      if (current === generation && matches) displayMatches(matches);
    } catch (error) {
      if (current === generation) reportFailure(error);
    }
  }

  fields.forEach(field => field.addEventListener('input', () => update(field.value.trim())));
  window.addEventListener('tup:langchange', () => update(activeQuery));
})();
