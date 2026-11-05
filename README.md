# The Universal Prayer

Sitio web catolico bilingue (ES/EN) publicado en GitHub Pages.

## Estado Actual

- Produccion activa en `main`.
- Sitio estatico con PWA (`sw.js`) y contenido en JSON.
- Cache actual del Service Worker: `tup-v298`.
- Adoración: 7 jornadas de 33 días en `adoracion/33dias-*/` (la más reciente: `33dias-enemigos`, para bendecir a los enemigos y entregarlos a Dios).
- `vuelvo-al-padre/#oseas-14`: Oseas 14 completo (Biblia CEE / New American Bible), los pasos para volver (vv. 2-4), la respuesta de Dios (v. 5), una meditación y una oración propia que se puede compartir.
- Fuentes sin conexión: las páginas no enlazan a fuentes externas (Vaticano, etc.); los pasajes bíblicos, párrafos del Catecismo y extractos de documentos de la Iglesia citados se incluyen en desplegables `details.tup-ref`, marcados como «selección» cuando solo se reproduce una parte.
- Archivos de datos JSON: 106 en `data/`.
- Historias para ninos: fuente principal en `data/ninos-cuentos.json`.
- Wake Lock API activo en todas las paginas con TTS (evita standby durante audio).

## Cuentos para Ninos — Progreso de Reescritura Artesanal

Cada cuento debe ser una narrativa real con escena concreta, personaje, dialogo y cierre para dormir.
**54 / 101 completados.**

### ✅ Completados (narrativa artesanal)

| # | ID | Escena central |
|---|---|---|
| 0 | juanbosco | Giovanni de 9 años sueña con lobos que se vuelven corderos |
| 1 | teresita | Thérèse de 14 años descubre el Caminito con un pétalo de rosa |
| 2 | nicolas | Nicolás lanza bolsas de oro por la ventana de noche; el padre lo atrapa |
| 3 | francisco | El lobo de Gubbio, los pájaros, el abrazo al leproso (~14 min) |
| 4 | juandiego | Cuauhtlatoatzin y sus tres encuentros en el Tepeyac (~14 min) |
| 5 | lucia | La corona de velas en las catacumbas de Siracusa (~12 min) |
| 6 | fatima | La mañana del 13 de mayo: la Señora sobre la encina |
| 7 | divinonino | El Padre Juan recibe la imagen en un barrio pobre de Bogotá |
| 8 | sanjose | La noche del sueño del ángel; José decide quedarse |
| 9 | guadalupe | Juan Diego en el Tepeyac antes del amanecer; el tilma |
| 10 | sanantonio | La mula que se arrodilló ante la Eucaristía en Rimini (~18 min) |
| 11 | sanmiguel | Monte Gargano: el pastor, la cueva y la voz (~18 min) |
| 12 | sangabriel | La Anunciación desde la perspectiva de María (~18 min) |
| 13 | sanrafael | Tobías y Azarías: la aventura del pez y el padre ciego (~18 min) |
| 14 | carlo | Carlo de 11 años construye la base de datos de milagros eucarísticos |
| 15 | luisgonzaga | El marquesito que renunció al título y fue al hospital de la peste (~13 min) |
| 16 | mariagoretti | Infancia bondadosa + sueño de las flores de Alessandro (sin violencia) |
| 17 | santaines | Fe tranquila ante la presión; sin detalles de martirio |
| 18 | carloslwanga | Alegría y liderazgo con los pajes; "Dios primero" |
| 25 | sanbenito | El silencio de la cueva; el cuervo y el pan |
| 26 | sanblas | Milagro del hueso de pescado |
| 30 | sancristobal | Ofero carga al niño en el río; el niño es Jesús |
| 31 | santaana | La abuela de Jesús; oración esperada 9 años |
| 32 | santamonica | 32 años rezando; el jardín de Milán; el abrazo |
| 34 | sanjuanbautista | Vida en el desierto; voz en el Jordán; sin decapitación |
| 35 | sanmaximiliano | El niño Raimundo y las dos coronas; la radio de paz |
| 36 | sanlorenzo | El tesoro son los pobres; sin la parrilla |
| 40 | santarita | La espina y las puertas cerradas; sin el marido asesinado |
| 41 | santadymphna | Paz interior; el pueblo de Geel; sin el padre violento |
| 45 | sandaniel | El foso de los leones; Daniel sigue rezando |
| 46 | reydavid | David y Goliat; sin corte de cabeza |
| 49 | santabarbara | La tercera ventana; protección en tormentas |
| 60 | angelguarda | Diego le confiesa a su abuela que le teme a la oscuridad |
| 69 | sanfelipeneri | Felipe llega a Roma sin nada; malabares en la plaza |
| 90 | sanoliverplunkett | El obispo de la paz en Irlanda; perdona a sus jueces |
| 100 | saneduardo | Rey humilde; sueño de las dos coronas; Westminster |

### ⏳ Pendientes (aún en formato plantilla — reescritura en progreso)

`francisco` y `juandiego` y `lucia` completados — quedan pendientes:

`sanantonio` y `sanmiguel` y `sangabriel` y `sanrafael` y `luisgonzaga` completados — quedan pendientes:

`padrepio` · `teresacalcuta` · `sanvicente` · `sanmiguel` · `sangabriel` · `sanrafael` · `luisgonzaga` · `padrepio` · `teresacalcuta` · `sanvicente` · `sanjudas` · `sancharbel` · `sanjorge` · `sancamilo` · `sanperegrino` · `sanexpedito` · `sanpedro` · `santaclara` · `santacatalina` · `lourdes` · `sanfranciscojavier` · `sanfranciscodesales` · `sanjuanapostol` · `sanefren` · `santaapolonia` · `sanjuandedios` · `juanpablo` · `sanbonifacio` · `sanbrendan` · `santotomas` · `sangerardo` · `sanmartindelporres` · `santarosa` · `misericordia` · `sagradocorazon` · `schoenstatt` · `santacoleta` · `santaemma` · `santanoemi` · `sanmartincapa` · `inmaculadocorazon` · `providencia` · `divinaprovidencia` · `santafabiola` · `sanguillermo` · `sanguillermogellone` · `sanguillermoaquitania` · `sancarlos` · `santacelina` · `sanagustin` · `perpetuosocorro` · `mariaauxiliadora` · `santaalejandra` · `santaroxana` · `santagwendolina` · `santagema` · `santagianna` · `sandavidgales` · `sanismael` · `santadelia` · `santaisabel` · `santaelena` · `sanalejandro` · `santasilvia` · `santaleticia` · `sanbarnabes` · `santomamoro` · `sanireneolyon` · `santomasapostol` · `nuestrasenoracarmen` · `preciosisimasangre` · `cabrini`

## Estructura Real del Proyecto

```text
theuniversalprayer/
  index.html
  404.html
  CNAME
  manifest.json
  robots.txt
  sitemap.xml
  sw.js
  README.md

  assets/
    css/
    images/
    js/

  data/
    *.json

  bella-virtud/
  control-y-confianza/
  cuaresma-san-miguel/
  desierto/
  diablo/
  difuntos/
  diospadre/
  dopamina/
  adoracion/
  emergencias/
  enemigos/
  espiritu/
  gloria-suprema/
  insiste-y-liberate/
  intercesor/
  historias/
  jovenes/
  maria/
  matrimonio/
  medalla-milagrosa/
  medalla-san-benito/
  meses/
  misericordia/
  musica/
  ninos/
  nomascastigo/
  novena-sagrado-corazon/
  oraciones/
  reconciliacion/
  renacer-en-cristo/
  rosario/
  salmos-diarios/
  salud/
  tentaciones/
  viacrucis/
  vuelvo-al-padre/
  workers/
```

Nota: el directorio `scripts/` ya no forma parte del repo runtime.

## Arquitectura de Runtime

- Frontend estatico (HTML/CSS/JS) servido por GitHub Pages.
- Carga de contenido por intercesor desde `data/{id}.json`.
- Navegacion y comportamiento en cliente desde `assets/js/`.
- Service Worker en `sw.js` con estrategias de cache para mejorar rendimiento/offline.
- El menu y otros recursos esenciales de interfaz se actualizan desde la red sin reutilizar una cache HTTP antigua y conservan copia para uso offline.
- El menu compartido incluye un buscador bilingue de sus secciones, que ignora acentos y permite escribir varias palabras.
- Al instalar una nueva version del Service Worker se renuevan tambien los documentos precargados. Los enlaces a oraciones con idioma y los 33 dias de la jornada principal de Adoracion pueden abrirse sin conexion despues de una visita que haya activado y completado la cache.

## Contenido y Datos

- Cada intercesor usa un JSON en `data/` con campos bilingues.
- Existe contenido especializado para multiples secciones del sitio (oraciones, historias, meses, etc.).
- Las siete jornadas de Adoracion y la vista independiente `adoracion/33dias/` permiten compartir la cita biblica, su referencia, la oracion y un enlace directo mediante el menu nativo del navegador. Se identifica la fuente CEE/NAB en la jornada de enemigos y se indica cuando la edicion de las otras citas no esta identificada. Si el menu no esta disponible, se muestra un aviso sin copiar al portapapeles. Los enlaces `/adoracion/?jornada=enemigos&dia=1&lang=es` abren la jornada y el dia indicados, conservando el idioma compartido.
- Las oraciones principales de Maria, Emergencias y la novena tambien pueden compartirse mediante el menu nativo, con un enlace directo que conserva el idioma y abre la seccion necesaria. Si la funcion no esta disponible, se muestra un aviso sin copiar al portapapeles.
- La portada ofrece una entrada de ayuda por necesidades y una guia opcional de cinco minutos con Jesus, sin rachas ni registro de intenciones. Las oraciones nuevas se identifican como textos propios y el pasaje biblico como parafrasis con enlace a una fuente catolica.
- `novena-sagrado-corazon/` ofrece una guia bilingue, adaptada y paso a paso de la novena asociada al Padre Pio, accesible desde el menu y sin guardar las intenciones.
- `data/ninos-cuentos.json` contiene cuentos infantiles con narrativa extendida y metadatos de lectura.

## Despliegue

- Rama de despliegue: `main`.
- Hosting: GitHub Pages.
- Dominio configurado mediante `CNAME`.
- Cada `git push origin main` dispara redeploy automatico.
- Las seis paginas personales y sus recursos anteriores vuelven a publicarse; se conservan las reglas de exclusion para otros archivos nuevos de esas carpetas. Los enlaces anteriores siguen funcionando sin volver a incluir las claves literales en el codigo. El contenido de un sitio estatico publico puede leerse sin autenticacion real: la comprobacion en el navegador no garantiza privacidad y el historial anterior sigue accesible.

## Flujo de Actualizacion (Cache + Datos)

Cuando se hagan cambios de frontend o contenido relevante:

1. Actualizar versiones en cliente:
   - `APP_VERSION` en `assets/js/main.js`
   - `DATA_VER` en `assets/js/main.js` (si cambian JSON)
2. Bump de cache en `sw.js`:
   - `const CACHE = 'tup-vXXX'`
3. Validar sintaxis de archivos tocados.
4. Commit y push a `main`.

## Verificacion Rapida Recomendada

- Abrir la web y confirmar que carga la version esperada.
- Forzar recarga del navegador para comprobar invalidacion de cache.
- Revisar que los JSON de `data/` cargan sin errores en consola.
- Probar paginas clave: home, intercesor, historias, adoracion, dopamina, control-y-confianza, gloria-suprema y secciones principales.

## Pruebas automatizadas (Playwright)

Requiere Node.js (el servidor estatico local `tests/server.js` se levanta solo en el puerto 8765).

```bash
npm install
npx playwright install chromium
npm test                # todas las pruebas
npx playwright test tests/maria.spec.js   # solo la pagina de Maria
npx playwright test devotional-data.spec.js --project=chromium
npm run test:report     # abrir el reporte HTML
```

- `tests/smoke.spec.js`: recorre todas las carpetas con `index.html` y verifica carga sin errores JS ni recursos locales rotos, un unico `<summary>` por `<details>`, cambio de idioma y uso de la clave compartida `tup_lang`, y redirecciones.
- `tests/maria.spec.js`: pruebas detalladas de `/maria/` (devociones, acordeones en ES/EN, slugs de intercesores, enlaces internos y externos, registro en menu/sitemap/SW).
- `tests/adoracion-share.spec.js`: comprueba los 231 dias de las siete jornadas y la vista independiente en ambos idiomas, los enlaces directos, el menu nativo simulado y los errores de compartir.
- `tests/prayer-share.spec.js`: comprueba las oraciones compartibles de Maria, Emergencias y la novena, la conservacion del idioma, el acceso offline y la ausencia de copia automatica.
- `tests/pastoral-improvements.spec.js`: verifica la guia de ayuda, el lenguaje pastoral, la busqueda publica y la presencia de las paginas personales.
- `tests/menu-search.spec.js`: valida la busqueda del menu, los idiomas, las pantallas pequeñas y el uso offline.
- `tests/private-pages.spec.js`: comprueba los recursos, el acceso, la busqueda anterior y sus fallos y funcionamiento offline con datos de prueba.
- `tests/novena-sagrado-corazon.spec.js`: valida la novena y la actualizacion y disponibilidad offline de recursos compartidos.
- `tests/devotional-data.spec.js`: valida los 165 dias y los datos del Carmen, comprueba los limites de las referencias de los capitulos consultados, incluidas las citas con abreviaturas reconocidas en el texto, y abre cada dia en español e ingles. Tambien comprueba las referencias con dos numeraciones en una pantalla de 320 px, las secciones y los nueve dias de la novena del Carmen, y que una lectura descargada se pueda volver a abrir sin conexion. Las 165 lecturas no se precargan todas automaticamente.
- `tests/devotional-bible-chapters.json` contiene limites de los capitulos ya consultados, no un indice completo de la Biblia. Al incorporar una cita de otro capitulo, verificarla en una edicion catolica apropiada antes de ampliar el archivo. La numeracion de los Salmos puede variar incluso entre ediciones catolicas; cuando se indican las numeraciones de la CEE/NABRE y la NRSVCE, las etiquetas se refieren a los numeros y no identifican necesariamente la fuente literal de la cita.
- Las peticiones externas (fuentes, YouTube, etc.) se bloquean durante las pruebas.

Las pruebas automaticas no certifican la interpretacion doctrinal, la literalidad de las citas, la calidad profesional de las traducciones ni los permisos de reproduccion. Entre las fuentes consultadas para la revision catolica estan la [Biblia de la Conferencia Episcopal Española](https://www.conferenciaepiscopal.es/biblia/salmos/), la [New American Bible, Revised Edition (NABRE)](https://www.biblegateway.com/versions/New-American-Bible-Revised-Edition-NABRE-Bible/) y la [New Revised Standard Version Catholic Edition (NRSVCE)](https://www.biblegateway.com/versions/New-Revised-Standard-Version-Catholic-Edition-NRSVCE-Bible/) en Bible Gateway, la [Biblia de New Advent](https://www.newadvent.org/bible/gen001.htm), el [Catecismo](https://www.vatican.va/archive/catechism_sp/p2s2c2a4_sp.html) y la [Orden del Carmen](https://ocarm.org/en/our-way-of-life/the-brown-scapular). La NABRE y la NRSVCE figuran en la [lista de traducciones aprobadas por la USCCB](https://www.usccb.org/offices/new-american-bible/approved-translations-bible). Las citas del sitio deben identificarse con su propia edicion y contar con los permisos que correspondan.

## Mantenimiento

- Evitar dejar utilidades temporales dentro del repo runtime.
- Mantener README alineado con el estado real del codigo y de despliegue.
- Si se agrega nueva seccion, documentar ruta y fuente de datos correspondiente.
