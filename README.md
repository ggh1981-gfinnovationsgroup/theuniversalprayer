# The Universal Prayer

Sitio web catolico bilingue (ES/EN) publicado en GitHub Pages.

## Estado Actual

- Produccion activa en `main`.
- Sitio estatico con PWA (`sw.js`) y contenido en JSON.
- Cache actual del Service Worker: `tup-v114`.
- Version de app en cliente: `v2026.07.11-1`.
- Version de datos en cliente: `20260708-2`.
- Archivos de datos JSON: 103 en `data/`.
- Historias para ninos: fuente principal en `data/ninos-cuentos.json`.

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
