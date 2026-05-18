# 🙏 The Universal Prayer — Handoff para GitHub Copilot

## Contexto del Proyecto

Este es un sitio web devocional católico bilingüe (inglés/español) llamado **The Universal Prayer**.
El objetivo es ofrecer oraciones, novenas, chaplets e historias de intercesores (santos y advocaciones
marianas) en una sola plataforma web elegante, gratuita y accesible para todos.

---

## ✅ Lo que ya está hecho

| Elemento | Estado | Detalle |
|---|---|---|
| Dominio inglés | ✅ Comprado | `theuniversalprayer.com` |
| Dominio español | ✅ Comprado | `laoracionuniversal.com` |
| Registrar | ✅ | Namecheap — Orden #202778451 |
| Cuenta GitHub | ✅ | `ggh1981-gfinnovationsgroup` |
| Hosting | ⏳ Pendiente | GitHub Pages (gratis) |

---

## 🏗️ Arquitectura del Sitio

### Dominios
- `theuniversalprayer.com` → dominio principal (inglés por default)
- `laoracionuniversal.com` → redirige a `theuniversalprayer.com`

### Subdominios por intercesor
```
padrepio.theuniversalprayer.com
misericordia.theuniversalprayer.com
guadalupe.theuniversalprayer.com
sagradocorazon.theuniversalprayer.com
# (y más que se irán agregando)
```

### Hosting
- **GitHub Pages** — gratuito, conectado al repositorio de GitHub
- Un solo repositorio, un solo código base
- El código detecta el subdominio y carga el contenido del intercesor correspondiente

### Stack tecnológico recomendado
- **HTML + CSS + Vanilla JS** (o React si se prefiere más dinámico)
- Archivos de contenido en **JSON** por intercesor (fácil de escalar)
- **Bilingüe**: toggle ES / EN en la misma página
- Sin backend por ahora — todo estático

---

## 📁 Estructura de Archivos Propuesta

```
theuniversalprayer/
│
├── index.html                  # Página principal
├── 404.html                    # Página de error
├── CNAME                       # Apunta a theuniversalprayer.com
│
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js             # Detecta subdominio, carga intercesor, maneja idioma
│   └── images/
│
├── data/                       # Contenido por intercesor en JSON
│   ├── padrepio.json
│   ├── misericordia.json
│   ├── guadalupe.json
│   └── sagradocorazon.json
│
└── intercesor/
    └── index.html              # Template reutilizable para todos los intercesores
```

---

## 📄 Estructura de cada archivo JSON de intercesor

```json
{
  "id": "padrepio",
  "name": {
    "es": "Padre Pío",
    "en": "Padre Pio"
  },
  "feast_day": {
    "es": "23 de septiembre",
    "en": "September 23"
  },
  "image": "assets/images/padrepio.jpg",
  "prayer": {
    "es": "Texto de la oración en español...",
    "en": "Prayer text in English..."
  },
  "history": {
    "es": "Breve historia en español...",
    "en": "Brief history in English..."
  },
  "novena": [
    {
      "day": 1,
      "es": "Oración del día 1 en español...",
      "en": "Day 1 prayer in English..."
    }
  ],
  "chaplet": {
    "available": true,
    "es": "Instrucciones del chaplet en español...",
    "en": "Chaplet instructions in English..."
  }
}
```

---

## 🎨 Diseño / UI

- Fondo oscuro (negro o azul marino profundo)
- Letras doradas / blancas
- Tipografía elegante y serena (ej. Georgia, Playfair Display)
- Toggle de idioma ES / EN visible en todo momento
- Imagen del intercesor prominente
- Navegación: Oración | Historia | Novena | Chaplet
- Responsive (mobile-first)

---

## 🔧 Pasos Pendientes — En Orden

### PASO 1 — Crear el repositorio en GitHub
```
Nombre del repo:   theuniversalprayer
Visibilidad:       Public (requerido para GitHub Pages gratis)
Inicializar con:   README.md
```

### PASO 2 — Activar GitHub Pages
1. Ir a Settings del repositorio
2. Sección **Pages**
3. Source: `Deploy from a branch`
4. Branch: `main` / `root`
5. Guardar

### PASO 3 — Conectar dominio en GitHub Pages
1. En Settings → Pages → Custom domain
2. Escribir: `theuniversalprayer.com`
3. GitHub genera un archivo `CNAME` automáticamente
4. Activar **Enforce HTTPS**

### PASO 4 — Configurar DNS en Namecheap para `theuniversalprayer.com`
Ir a Namecheap → Domain List → `theuniversalprayer.com` → Manage → Advanced DNS

Agregar estos registros:

| Type | Host | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | Auto |
| A | @ | 185.199.109.153 | Auto |
| A | @ | 185.199.110.153 | Auto |
| A | @ | 185.199.111.153 | Auto |
| CNAME | www | ggh1981-gfinnovationsgroup.github.io | Auto |

### PASO 5 — Configurar redirect en Namecheap para `laoracionuniversal.com`
Ir a Namecheap → Domain List → `laoracionuniversal.com` → Manage → Advanced DNS

Agregar:

| Type | Host | Value |
|---|---|---|
| URL Redirect | @ | https://theuniversalprayer.com |
| URL Redirect | www | https://theuniversalprayer.com |

### PASO 6 — Configurar subdominios en Namecheap (cuando estén listos)
Por cada subdominio, agregar en Advanced DNS de `theuniversalprayer.com`:

| Type | Host | Value |
|---|---|---|
| CNAME | padrepio | ggh1981-gfinnovationsgroup.github.io |
| CNAME | misericordia | ggh1981-gfinnovationsgroup.github.io |
| CNAME | guadalupe | ggh1981-gfinnovationsgroup.github.io |

### PASO 7 — Construir el código del sitio
Pedirle a GitHub Copilot que construya:
1. `index.html` — página principal con lista de intercesores
2. `intercesor/index.html` — template para cada intercesor
3. `assets/js/main.js` — lógica de detección de subdominio e idioma
4. `data/*.json` — archivos de contenido por intercesor
5. `assets/css/styles.css` — estilos oscuros y dorados

---

## ✝️ Intercesores Iniciales Planeados

| Intercesor | Subdominio | Chaplet | Novena |
|---|---|---|---|
| Padre Pío | `padrepio` | Sí | Sí |
| Divina Misericordia | `misericordia` | Sí (Coronilla) | Sí |
| Virgen de Guadalupe | `guadalupe` | No | Sí |
| Sagrado Corazón | `sagradocorazon` | Sí | Sí |
| San José | `sanjose` | No | Sí |
| Virgen de Fátima | `fatima` | Sí (Rosario) | Sí |

---

## 📌 Notas Importantes

- El sitio es **100% devocional y católico** — sin anuncios, sin monetización
- Todo el contenido debe ser **teológicamente fiel** a la enseñanza católica
- Prioridad: **móvil primero** (la mayoría rezará desde el celular)
- El idioma default se puede detectar por el dominio:
  - `theuniversalprayer.com` → inglés
  - `laoracionuniversal.com` (redirect) → español
  - O simplemente dejar el toggle manual visible siempre
- GitHub Pages **no soporta server-side rendering** — todo debe ser estático o client-side

---

## 🔗 Referencias

- Cuenta GitHub: `ggh1981-gfinnovationsgroup`
- Namecheap Order: `#202778451`
- Dominio principal: `theuniversalprayer.com`
- Dominio español: `laoracionuniversal.com`
- IPs de GitHub Pages: `185.199.108-111.153`
- Documentación GitHub Pages: https://docs.github.com/en/pages

---

*Documento generado el 17 de mayo de 2026 — Continuar desarrollo en GitHub Copilot* 🙏
