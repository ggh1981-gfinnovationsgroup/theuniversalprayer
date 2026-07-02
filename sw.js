/* =====================================================
   THE UNIVERSAL PRAYER — Service Worker
   Cache-first strategy: works fully offline after first load
   ===================================================== */

const CACHE = 'tup-v7';

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
  '/assets/js/menu.js',
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
  '/assets/images/preciosisimasangre.svg',
  '/assets/images/divinonino.svg',
  '/assets/images/mariaauxiliadora.svg',
  '/assets/images/nuestrasenoracarmen.svg',
  '/assets/images/reydavid.svg',
  '/assets/images/sanalejandro.svg',
  '/assets/images/sanbarnabes.svg',
  '/assets/images/sanbenito.svg',
  '/assets/images/sanblas.svg',
  '/assets/images/sanbonifacio.svg',
  '/assets/images/sancamilo.svg',
  '/assets/images/sancarlosacutis.svg',
  '/assets/images/sancarloslwanga.svg',
  '/assets/images/sancharbel.svg',
  '/assets/images/sandaniel.svg',
  '/assets/images/sandavidgales.svg',
  '/assets/images/sanefren.svg',
  '/assets/images/sanfranciscojavier.svg',
  '/assets/images/sangerardo.svg',
  '/assets/images/sanireneolyon.svg',
  '/assets/images/sanismael.svg',
  '/assets/images/sanjorge.svg',
  '/assets/images/sanjuanbautista.svg',
  '/assets/images/sanjuandedios.svg',
  '/assets/images/sanjuandiego.svg',
  '/assets/images/sanluisgonzaga.svg',
  '/assets/images/sanoliverplunkett.svg',
  '/assets/images/sanpedro.svg',
  '/assets/images/sanperegrino.svg',
  '/assets/images/santaalejandra.svg',
  '/assets/images/santaana.svg',
  '/assets/images/santaapolonia.svg',
  '/assets/images/santadelia.svg',
  '/assets/images/santaelena.svg',
  '/assets/images/santaemma.svg',
  '/assets/images/santagema.svg',
  '/assets/images/santagianna.svg',
  '/assets/images/santagwendolina.svg',
  '/assets/images/santaisabel.svg',
  '/assets/images/santaleticia.svg',
  '/assets/images/santanoemi.svg',
  '/assets/images/santarosa.svg',
  '/assets/images/santaroxana.svg',
  '/assets/images/santasilvia.svg',
  '/assets/images/santomamoro.svg',
  '/assets/images/santomasapostol.svg',
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
  '/data/preciosisimasangre.json',
  '/data/divinonino.json',
  '/data/mariaauxiliadora.json',
  '/data/nuestrasenoracarmen.json',
  '/data/reydavid.json',
  '/data/sanalejandro.json',
  '/data/sanbarnabes.json',
  '/data/sanbenito.json',
  '/data/sanblas.json',
  '/data/sanbonifacio.json',
  '/data/sancamilo.json',
  '/data/sancarlosacutis.json',
  '/data/sancarloslwanga.json',
  '/data/sancharbel.json',
  '/data/sandaniel.json',
  '/data/sandavidgales.json',
  '/data/sanefren.json',
  '/data/sanfranciscojavier.json',
  '/data/sangerardo.json',
  '/data/sanireneolyon.json',
  '/data/sanismael.json',
  '/data/sanjorge.json',
  '/data/sanjuanbautista.json',
  '/data/sanjuandedios.json',
  '/data/sanjuandiego.json',
  '/data/sanluisgonzaga.json',
  '/data/sanoliverplunkett.json',
  '/data/sanpedro.json',
  '/data/sanperegrino.json',
  '/data/santaalejandra.json',
  '/data/santaana.json',
  '/data/santaapolonia.json',
  '/data/santadelia.json',
  '/data/santaelena.json',
  '/data/santaemma.json',
  '/data/santagema.json',
  '/data/santagianna.json',
  '/data/santagwendolina.json',
  '/data/santaisabel.json',
  '/data/santaleticia.json',
  '/data/santanoemi.json',
  '/data/santarosa.json',
  '/data/santaroxana.json',
  '/data/santasilvia.json',
  '/data/santomamoro.json',
  '/data/santomasapostol.json',
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

// ── FETCH: stale-while-revalidate for core assets and JSON ─
// Serve from cache instantly; always refresh cache in background.
// Max staleness = 1 page load. Images/fonts stay cache-first.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isCore = /\.(html|js|css)$/.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/');
  const isJson = /\.json$/.test(url.pathname);
  const isStatic = /\.(svg|png|ico|webp|woff2?)$/.test(url.pathname);

  if (isCore || isJson) {
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
    // Cache-first for images/fonts: serve from cache, fetch if missing
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
