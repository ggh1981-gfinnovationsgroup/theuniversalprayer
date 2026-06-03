/* =====================================================
   THE UNIVERSAL PRAYER — Service Worker
   Cache-first strategy: works fully offline after first load
   ===================================================== */

const CACHE = 'tup-v4';

// All files to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/intercesor/',
  '/intercesor/index.html',
  '/404.html',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/images/icon.svg',
  // Intercessor images
  '/assets/images/angelguarda.svg',
  '/assets/images/divinaprovidencia.svg',
  '/assets/images/fatima.svg',
  '/assets/images/guadalupe.svg',
  '/assets/images/inmaculadocorazon.svg',
  '/assets/images/juanpablo.svg',
  '/assets/images/misericordia.svg',
  '/assets/images/padrepio.svg',
  '/assets/images/providencia.svg',
  '/assets/images/sagradocorazon.svg',
  '/assets/images/sanantonio.svg',
  '/assets/images/sanbrendan.svg',
  '/assets/images/sancarlos.svg',
  '/assets/images/sanfelipeneri.svg',
  '/assets/images/sangabriel.svg',
  '/assets/images/sanguillermo.svg',
  '/assets/images/sanjose.svg',
  '/assets/images/sanjuanapostol.svg',
  '/assets/images/sanjudas.svg',
  '/assets/images/sanmiguel.svg',
  '/assets/images/sanrafael.svg',
  '/assets/images/santabarbara.svg',
  '/assets/images/santacatalina.svg',
  '/assets/images/santacelina.svg',
  '/assets/images/santaclara.svg',
  '/assets/images/santadymphna.svg',
  '/assets/images/santafabiola.svg',
  '/assets/images/santarita.svg',
  '/assets/images/santateresita.svg',
  '/assets/images/sanvicente.svg',
  '/assets/images/schoenstatt.svg',
  '/assets/images/teresacalcuta.svg',
  '/assets/images/sanfrancisco.svg',
  '/assets/images/santamonica.svg',
  '/assets/images/sanagustin.svg',
  '/assets/images/santalucia.svg',
  '/assets/images/perpetuosocorro.svg',
  '/assets/images/sanexpedito.svg',
  '/assets/images/sanlorenzo.svg',
  '/assets/images/santaines.svg',
  '/assets/images/sannicolas.svg',
  '/assets/images/sancristobal.svg',
  // Intercessor data (JSON)
  '/data/angelguarda.json',
  '/data/divinaprovidencia.json',
  '/data/fatima.json',
  '/data/guadalupe.json',
  '/data/inmaculadocorazon.json',
  '/data/juanpablo.json',
  '/data/misericordia.json',
  '/data/padrepio.json',
  '/data/providencia.json',
  '/data/sagradocorazon.json',
  '/data/sanantonio.json',
  '/data/sanbrendan.json',
  '/data/sancarlos.json',
  '/data/sanfelipeneri.json',
  '/data/sangabriel.json',
  '/data/sanguillermo.json',
  '/data/sanjose.json',
  '/data/sanjuanapostol.json',
  '/data/sanjudas.json',
  '/data/sanmiguel.json',
  '/data/sanrafael.json',
  '/data/santabarbara.json',
  '/data/santacatalina.json',
  '/data/santacelina.json',
  '/data/santaclara.json',
  '/data/santadymphna.json',
  '/data/santafabiola.json',
  '/data/santarita.json',
  '/data/santateresita.json',
  '/data/sanvicente.json',
  '/data/schoenstatt.json',
  '/data/teresacalcuta.json',
  '/data/sanfrancisco.json',
  '/data/santamonica.json',
  '/data/sanagustin.json',
  '/data/santalucia.json',
  '/data/perpetuosocorro.json',
  '/data/sanexpedito.json',
  '/data/sanlorenzo.json',
  '/data/santaines.json',
  '/data/sannicolas.json',
  '/data/sancristobal.json',
];

// ── INSTALL: pre-cache everything ─────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: remove old caches ───────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: stale-while-revalidate for core assets ─
// Serve from cache instantly; always refresh cache in background.
// Max staleness = 1 page load. Images/JSON: cache-first (rarely change).
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isCore = /\.(html|js|css)$/.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/');
  const isStatic = /\.(svg|png|ico|webp|json|woff2?)$/.test(url.pathname);

  if (isCore) {
    // Stale-while-revalidate: return cache immediately, update in background
    event.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          const networkFetch = fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => null);

          return cached || networkFetch;
        })
      )
    );
  } else if (isStatic) {
    // Cache-first for images and data: serve from cache, fetch if missing
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          if (event.request.mode === 'navigate') return caches.match('/');
        });
      })
    );
  } else {
    // Everything else: network-first
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
