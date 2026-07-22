# The Universal Prayer

Sitio web catolico bilingue (ES/EN) publicado en GitHub Pages.

## Estado Actual

- Produccion activa en `main`.
- Sitio estatico con PWA (`sw.js`) y contenido en JSON.
- Cache actual del Service Worker: `tup-v139`.
- Archivos de datos JSON: 103 en `data/`.
- Historias para ninos: fuente principal en `data/ninos-cuentos.json`.
- Wake Lock API activo en todas las paginas con TTS (evita standby durante audio).

## Cuentos para Ninos — Progreso de Reescritura Artesanal

Cada cuento debe ser una narrativa real con escena concreta, personaje, dialogo y cierre para dormir.
**31 / 101 completados.**

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
| 14 | carlo | Carlo de 11 años construye la base de datos de milagros eucarísticos |
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

`sanantonio` · `sanmiguel` · `sanmiguel` · `sangabriel` · `sanrafael` · `luisgonzaga` · `padrepio` · `teresacalcuta` · `sanvicente` · `sanjudas` · `sancharbel` · `sanjorge` · `sancamilo` · `sanperegrino` · `sanexpedito` · `sanpedro` · `santaclara` · `santacatalina` · `lourdes` · `sanfranciscojavier` · `sanfranciscodesales` · `sanjuanapostol` · `sanefren` · `santaapolonia` · `sanjuandedios` · `juanpablo` · `sanbonifacio` · `sanbrendan` · `santotomas` · `sangerardo` · `sanmartindelporres` · `santarosa` · `misericordia` · `sagradocorazon` · `schoenstatt` · `santacoleta` · `santaemma` · `santanoemi` · `sanmartincapa` · `inmaculadocorazon` · `providencia` · `divinaprovidencia` · `santafabiola` · `sanguillermo` · `sanguillermogellone` · `sanguillermoaquitania` · `sancarlos` · `santacelina` · `sanagustin` · `perpetuosocorro` · `mariaauxiliadora` · `santaalejandra` · `santaroxana` · `santagwendolina` · `santagema` · `santagianna` · `sandavidgales` · `sanismael` · `santadelia` · `santaisabel` · `santaelena` · `sanalejandro` · `santasilvia` · `santaleticia` · `sanbarnabes` · `santomamoro` · `sanireneolyon` · `santomasapostol` · `nuestrasenoracarmen` · `preciosisimasangre` · `cabrini`

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

  intercesor/
  historias/
  oraciones/
  rosario/
  misericordia/
  reconciliacion/
  salud/
  matrimonio/
  jovenes/
  difuntos/
  adoracion/
  espiritu/
  meses/
  llamados/
  discernimiento/
  desierto/
  enemigos/
  privado/
  workers/
```

Nota: el directorio `scripts/` ya no forma parte del repo runtime.

## Arquitectura de Runtime

- Frontend estatico (HTML/CSS/JS) servido por GitHub Pages.
- Carga de contenido por intercesor desde `data/{id}.json`.
- Navegacion y comportamiento en cliente desde `assets/js/`.
- Service Worker en `sw.js` con estrategias de cache para mejorar rendimiento/offline.

## Contenido y Datos

- Cada intercesor usa un JSON en `data/` con campos bilingues.
- Existe contenido especializado para multiples secciones del sitio (oraciones, historias, meses, etc.).
- `data/ninos-cuentos.json` contiene cuentos infantiles con narrativa extendida y metadatos de lectura.

## Despliegue

- Rama de despliegue: `main`.
- Hosting: GitHub Pages.
- Dominio configurado mediante `CNAME`.
- Cada `git push origin main` dispara redeploy automatico.

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
- Probar paginas clave: home, intercesor, historias y secciones principales.

## Mantenimiento

- Evitar dejar utilidades temporales dentro del repo runtime.
- Mantener README alineado con el estado real del codigo y de despliegue.
- Si se agrega nueva seccion, documentar ruta y fuente de datos correspondiente.
