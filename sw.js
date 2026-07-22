/* =====================================================
   THE UNIVERSAL PRAYER — Service Worker
   Cache-first strategy: works fully offline after first load
   ===================================================== */

const CACHE = 'tup-v135';

// All files to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/intercesor/',
  '/intercesor/index.html',
  '/misericordia/',
  '/misericordia/index.html',
  '/salud/',
  '/salud/index.html',
  '/desierto/',
  '/desierto/index.html',
  '/ninos/',
  '/ninos/index.html',
  '/jovenes/',
  '/jovenes/index.html',
  '/tentaciones/',
  '/tentaciones/index.html',
  '/viacrucis/',
  '/viacrucis/index.html',
  '/assets/images/ninos.svg',
  '/assets/images/ninos-angel.svg',
  '/assets/js/ninos.js',
  '/data/ninos-cuentos.json',
  '/assets/images/sanjudas-simbolo.svg',
  '/assets/images/guadalupe-simbolo.svg',
  '/assets/images/schoenstatt-simbolo.svg',
  '/assets/images/lourdes-simbolo.svg',
  '/assets/images/social-home.png',
  '/assets/images/social-desierto.png',
  '/assets/images/social-enemigos.png',
  '/assets/images/social-espiritu.png',
  '/espiritu/',
  '/espiritu/index.html',
  '/assets/images/espiritu.svg',
  '/data/espiritu.json',
  '/diospadre/',
  '/diospadre/index.html',
  '/assets/images/diospadre.svg',
  '/data/diospadre.json',
  '/data/diospadre-deep.json',
  '/enemigos/',
  '/enemigos/index.html',
  '/meses/',
  '/meses/index.html',
  '/musica/',
  '/musica/index.html',
  '/reconciliacion/',
  '/reconciliacion/index.html',
  '/404.html',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/js/menu.js',
  '/assets/js/private-image-modal.js',
  '/assets/images/icon.svg',
  '/assets/images/misericordia-hero.svg',
  '/assets/images/reconciliacion-hero.svg',
  '/assets/images/enemigos-misericordia.svg',
  '/assets/images/enemigos-perdon.svg',
  '/assets/images/enemigos-conversion.svg',
  // Intercessor images
  '/assets/images/misericordia.svg',
  '/assets/images/inmaculadocorazon.svg',
  '/assets/images/sagradocorazon.svg',
  '/assets/images/providencia.svg',
  '/assets/images/guadalupe.svg',
  '/assets/images/fatima.svg',
  '/assets/images/padrepio.svg',
  '/assets/images/sanjose.svg',
  '/assets/images/sanjudas.svg',
  '/assets/images/juanpablo.svg',
  '/assets/images/sanjuanbosco.svg',
  '/assets/images/sanantonio.svg',
  '/assets/images/teresacalcuta.svg',
  '/assets/images/sanmiguel.svg',
  '/assets/images/sangabriel.svg',
  '/assets/images/sanrafael.svg',
  '/assets/images/angelguarda.svg',
  '/assets/images/divinaprovidencia.svg',
  '/assets/images/santarita.svg',
  '/assets/images/sanfelipeneri.svg',
  '/assets/images/schoenstatt.svg',
  '/assets/images/santadymphna.svg',
  '/assets/images/santateresita.svg',
  '/assets/images/sanvicente.svg',
  '/assets/images/santafabiola.svg',
  '/assets/images/sanjuanapostol.svg',
  '/assets/images/santacatalina.svg',
  '/assets/images/santaclara.svg',
  '/assets/images/santabarbara.svg',
  '/assets/images/sanbrendan.svg',
  '/assets/images/sanguillermo.svg',
  '/assets/images/sanguillermogellone.svg',
  '/assets/images/sanguillermoaquitania.svg',
  '/assets/images/sancarlos.svg',
  '/assets/images/santacelina.svg',
  '/assets/images/sanagustin.svg',
  '/assets/images/sancristobal.svg',
  '/assets/images/sanexpedito.svg',
  '/assets/images/sanfrancisco.svg',
  '/assets/images/sanlorenzo.svg',
  '/assets/images/sannicolas.svg',
  '/assets/images/santaines.svg',
  '/assets/images/santalucia.svg',
  '/assets/images/santamonica.svg',
  '/assets/images/perpetuosocorro.svg',
  '/assets/images/mariaauxiliadora.svg',
  '/assets/images/santarosa.svg',
  '/assets/images/santaalejandra.svg',
  '/assets/images/santaroxana.svg',
  '/assets/images/santagwendolina.svg',
  '/assets/images/sanmaximiliano.svg',
  '/assets/images/santaangeladefoligno.svg',
  '/assets/images/santacoleta.svg',
  '/assets/images/santanoemi.svg',
  '/assets/images/sanperegrino.svg',
  '/assets/images/sancamilo.svg',
  '/assets/images/sanblas.svg',
  '/assets/images/sancharbel.svg',
  '/assets/images/santaana.svg',
  '/assets/images/sanjuandedios.svg',
  '/assets/images/santaapolonia.svg',
  '/assets/images/santagema.svg',
  '/assets/images/sangerardo.svg',
  '/assets/images/santagianna.svg',
  '/assets/images/sandavidgales.svg',
  '/assets/images/reydavid.svg',
  '/assets/images/santaemma.svg',
  '/assets/images/sanismael.svg',
  '/assets/images/santadelia.svg',
  '/assets/images/sanjorge.svg',
  '/assets/images/santaisabel.svg',
  '/assets/images/sandaniel.svg',
  '/assets/images/santaelena.svg',
  '/assets/images/sanjuandiego.svg',
  '/assets/images/sanalejandro.svg',
  '/assets/images/sanoliverplunkett.svg',
  '/assets/images/santasilvia.svg',
  '/assets/images/santaleticia.svg',
  '/assets/images/sanpedro.svg',
  '/assets/images/sanfranciscojavier.svg',
  '/assets/images/sancarloslwanga.svg',
  '/assets/images/sanbonifacio.svg',
  '/assets/images/sanefren.svg',
  '/assets/images/sanbarnabes.svg',
  '/assets/images/sanluisgonzaga.svg',
  '/assets/images/santomamoro.svg',
  '/assets/images/sanjuanbautista.svg',
  '/assets/images/sanireneolyon.svg',
  '/assets/images/santomasapostol.svg',
  '/assets/images/santotomasdeaquino.svg',
  '/assets/images/sancarlosacutis.svg',
  '/assets/images/sanbenito.svg',
  '/assets/images/nuestrasenoracarmen.svg',
  '/assets/images/divinonino.svg',
  '/assets/images/lourdes.svg',
  '/assets/images/santamariagoretti.svg',
  '/assets/images/preciosisimasangre.svg',
  '/assets/images/cabrini.svg',
  '/desierto/33dias/',
  '/desierto/33dias/index.html',
  '/assets/images/desierto-33-hero.svg',
  '/desierto/33dias/svgs/silencio.svg',
  '/desierto/33dias/svgs/palabra.svg',
  '/desierto/33dias/svgs/oracion.svg',
  '/desierto/33dias/svgs/vida.svg',
  '/desierto/33dias/svgs/fruto.svg',
  '/assets/images/private-search/dreams.svg',
  '/assets/images/private-search/barbara.svg',
  '/assets/images/private-search/fabiola.svg',
  '/assets/images/private-search/brandon.svg',
  '/assets/images/private-search/katherine.svg',
  '/assets/images/private-search/clarissa.svg',
  '/assets/images/private-search/ian.svg',
  // Intercessor data (JSON)
  '/data/misericordia.json',
  '/data/inmaculadocorazon.json',
  '/data/sagradocorazon.json',
  '/data/providencia.json',
  '/data/guadalupe.json',
  '/data/fatima.json',
  '/data/padrepio.json',
  '/data/sanjose.json',
  '/data/sanjudas.json',
  '/data/juanpablo.json',
  '/data/sanjuanbosco.json',
  '/data/sanantonio.json',
  '/data/teresacalcuta.json',
  '/data/sanmiguel.json',
  '/data/sangabriel.json',
  '/data/sanrafael.json',
  '/data/angelguarda.json',
  '/data/divinaprovidencia.json',
  '/data/santarita.json',
  '/data/sanfelipeneri.json',
  '/data/schoenstatt.json',
  '/data/santadymphna.json',
  '/data/santateresita.json',
  '/data/sanvicente.json',
  '/data/santafabiola.json',
  '/data/sanjuanapostol.json',
  '/data/santacatalina.json',
  '/data/santaclara.json',
  '/data/santabarbara.json',
  '/data/sanbrendan.json',
  '/data/sanguillermo.json',
  '/data/sanguillermogellone.json',
  '/data/sanguillermoaquitania.json',
  '/data/sancarlos.json',
  '/data/santacelina.json',
  '/data/sanagustin.json',
  '/data/sancristobal.json',
  '/data/sanexpedito.json',
  '/data/sanfrancisco.json',
  '/data/sanlorenzo.json',
  '/data/sannicolas.json',
  '/data/santaines.json',
  '/data/santalucia.json',
  '/data/santamonica.json',
  '/data/perpetuosocorro.json',
  '/data/mariaauxiliadora.json',
  '/data/santarosa.json',
  '/data/santaalejandra.json',
  '/data/santaroxana.json',
  '/data/santagwendolina.json',
  '/data/sanmaximiliano.json',
  '/data/santaangeladefoligno.json',
  '/data/santacoleta.json',
  '/data/santanoemi.json',
  '/data/sanperegrino.json',
  '/data/sancamilo.json',
  '/data/sanblas.json',
  '/data/sancharbel.json',
  '/data/santaana.json',
  '/data/sanjuandedios.json',
  '/data/santaapolonia.json',
  '/data/santagema.json',
  '/data/sangerardo.json',
  '/data/santagianna.json',
  '/data/sandavidgales.json',
  '/data/reydavid.json',
  '/data/santaemma.json',
  '/data/sanismael.json',
  '/data/santadelia.json',
  '/data/sanjorge.json',
  '/data/santaisabel.json',
  '/data/sandaniel.json',
  '/data/santaelena.json',
  '/data/sanjuandiego.json',
  '/data/sanalejandro.json',
  '/data/sanoliverplunkett.json',
  '/data/santasilvia.json',
  '/data/santaleticia.json',
  '/data/sanpedro.json',
  '/data/sanfranciscojavier.json',
  '/data/sancarloslwanga.json',
  '/data/sanbonifacio.json',
  '/data/sanefren.json',
  '/data/sanbarnabes.json',
  '/data/sanluisgonzaga.json',
  '/data/santomamoro.json',
  '/data/sanjuanbautista.json',
  '/data/sanireneolyon.json',
  '/data/santomasapostol.json',
  '/data/santotomasdeaquino.json',
  '/data/sancarlosacutis.json',
  '/data/sanbenito.json',
  '/data/nuestrasenoracarmen.json',
  '/data/divinonino.json',
  '/data/lourdes.json',
  '/data/santamariagoretti.json',
  '/data/preciosisimasangre.json',
  '/data/cabrini.json',
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
  const isCriticalCore = url.pathname === '/assets/js/main.js' || url.pathname === '/assets/css/styles.css';
  const isCore = /\.(html|js|css)$/.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/');
  const isJson = /\.json$/.test(url.pathname);
  const isStatic = /\.(svg|png|ico|webp|woff2?)$/.test(url.pathname);

  if (isCriticalCore) {
    // Network-first for critical UI assets so deploys reflect immediately.
    event.respondWith(
      caches.open(CACHE).then(cache =>
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cache.match(event.request))
      )
    );
    return;
  }

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
