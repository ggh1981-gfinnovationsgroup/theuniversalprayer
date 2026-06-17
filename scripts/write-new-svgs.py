import pathlib

BASE = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer\assets\images")

# ── Santa Selene ────────────────────────────────────────────────────────────
selene = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="ss-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#100c1a"/><stop offset="100%" stop-color="#04020a"/>
    </radialGradient>
    <radialGradient id="ss-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#4a3a8a" stop-opacity="0.26"/><stop offset="100%" stop-color="#4a3a8a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ss-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#7060b8" stop-opacity="1"/><stop offset="100%" stop-color="#2a1a60" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="ss-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="ss-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="ss-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#ss-bg)"/>
  <rect width="400" height="600" fill="url(#ss-atm)"/>
  <!-- Stars (night sky) -->
  <circle cx="55" cy="38" r="1.5" fill="#e8d8ff" opacity="0.75"/>
  <circle cx="110" cy="22" r="1" fill="#f0e8ff" opacity="0.65"/>
  <circle cx="290" cy="28" r="1" fill="#f0e8ff" opacity="0.55"/>
  <circle cx="355" cy="48" r="1.5" fill="#e8d8ff" opacity="0.70"/>
  <circle cx="38" cy="82" r="1" fill="#f0e8ff" opacity="0.55"/>
  <circle cx="375" cy="76" r="1" fill="#f0e8ff" opacity="0.60"/>
  <circle cx="340" cy="148" r="0.8" fill="#e8d8ff" opacity="0.55"/>
  <circle cx="68" cy="155" r="0.8" fill="#e8d8ff" opacity="0.50"/>
  <!-- Crescent moon (upper right) -->
  <circle cx="338" cy="72" r="22" fill="#d8c8f0" opacity="0.18" filter="url(#ss-g2)"/>
  <circle cx="348" cy="68" r="18" fill="#100c1a" opacity="0.95"/>
  <!-- Rays: violet left, gold right -->
  <polygon points="198,262 -25,610 115,610" fill="url(#ss-r1)" filter="url(#ss-gl)" opacity="0.72"/>
  <polygon points="198,262 20,600  85,600"  fill="#7060b8" opacity="0.38"/>
  <polygon points="202,262 425,610 285,610" fill="url(#ss-r2)" filter="url(#ss-gl)" opacity="0.70"/>
  <polygon points="202,262 375,600 315,600" fill="#f5e060" opacity="0.34"/>
  <!-- Figure in prayer: white robe -->
  <path d="M164,158 Q140,208 128,458 Q162,474 200,476 Q238,474 272,458 Q260,208 236,158 Q218,172 200,174 Q182,172 164,158 Z" fill="#e8e4f0" opacity="0.88"/>
  <!-- Robe shadow -->
  <path d="M176,162 Q156,218 148,440 Q172,458 200,460 Q186,224 180,165 Z" fill="#c8c0d8" opacity="0.38"/>
  <!-- White veil -->
  <path d="M170,110 Q162,132 158,165 Q180,172 200,174 Q220,172 242,165 Q238,132 230,110 Q218,118 200,120 Q182,118 170,110 Z" fill="#f0eef8" opacity="0.92"/>
  <!-- Arms folded in prayer -->
  <path d="M164,195 Q130,232 118,295 Q130,305 144,298 Q152,260 166,218 Z" fill="#e8e4f0" opacity="0.88"/>
  <path d="M236,195 Q270,232 282,295 Q270,305 256,298 Q248,260 234,218 Z" fill="#e8e4f0" opacity="0.88"/>
  <!-- Hands joined -->
  <ellipse cx="126" cy="298" rx="13" ry="9" fill="#d4c0e8" opacity="0.85"/>
  <ellipse cx="272" cy="298" rx="13" ry="9" fill="#d4c0e8" opacity="0.85"/>
  <!-- Neck -->
  <rect x="193" y="142" width="14" height="18" rx="4" fill="#d4c0c8" opacity="0.88"/>
  <!-- Head -->
  <ellipse cx="200" cy="108" rx="26" ry="30" fill="#d4c0c8" opacity="0.90"/>
  <!-- Hair under veil (dark) -->
  <path d="M174,104 Q176,68 200,62 Q224,68 226,104" fill="#2a1830" opacity="0.78"/>
  <!-- Halo: two thin rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#ss-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Frame -->
  <rect x="6" y="6" width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#04020a" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SANTA SELENE \u00b7 SAINT SELENE</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#c8b8f0" font-style="italic">\u00abFiel en la oscuridad\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abFaithful in the dark\u00bb</text>
</svg>
"""

# ── San Gabriel ──────────────────────────────────────────────────────────────
gabriel = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="sgb-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#080e1a"/><stop offset="100%" stop-color="#020408"/>
    </radialGradient>
    <radialGradient id="sgb-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#1a3a8a" stop-opacity="0.28"/><stop offset="100%" stop-color="#1a3a8a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sgb-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#4060d0" stop-opacity="1"/><stop offset="100%" stop-color="#1a2860" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sgb-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="sgb-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sgb-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#sgb-bg)"/>
  <rect width="400" height="600" fill="url(#sgb-atm)"/>
  <!-- Rays: blue left, gold right -->
  <polygon points="198,262 -25,610 115,610" fill="url(#sgb-r1)" filter="url(#sgb-gl)" opacity="0.75"/>
  <polygon points="198,262 20,600  85,600"  fill="#4060d0" opacity="0.38"/>
  <polygon points="202,262 425,610 285,610" fill="url(#sgb-r2)" filter="url(#sgb-gl)" opacity="0.72"/>
  <polygon points="202,262 375,600 315,600" fill="#f5e060" opacity="0.34"/>
  <!-- Wings (large, white-blue feathers, behind figure) -->
  <!-- Left wing -->
  <path d="M178,145 Q90,120 42,200 Q55,280 88,320 Q120,280 145,220 Q158,185 172,162 Z" fill="#d8e4f8" opacity="0.70"/>
  <path d="M178,145 Q100,148 68,225 Q90,248 115,238 Q140,210 162,172 Z" fill="#b8ccf0" opacity="0.45"/>
  <!-- Right wing -->
  <path d="M222,145 Q310,120 358,200 Q345,280 312,320 Q280,280 255,220 Q242,185 228,162 Z" fill="#d8e4f8" opacity="0.70"/>
  <path d="M222,145 Q300,148 332,225 Q310,248 285,238 Q260,210 238,172 Z" fill="#b8ccf0" opacity="0.45"/>
  <!-- Angel robe (white/light blue) -->
  <path d="M165,158 Q142,208 132,458 Q164,475 200,477 Q236,475 268,458 Q258,208 235,158 Q218,172 200,174 Q182,172 165,158 Z" fill="#e8f0fc" opacity="0.92"/>
  <!-- Robe fold -->
  <path d="M178,162 Q158,218 150,440 Q174,460 200,462 Q186,225 182,165 Z" fill="#c8d8f0" opacity="0.38"/>
  <!-- Gold belt -->
  <rect x="155" y="280" width="90" height="9" rx="4" fill="#c9a84c" opacity="0.78"/>
  <!-- Left arm (holds lily) -->
  <path d="M165,195 Q128,235 118,298 Q130,308 144,302 Q150,265 166,215 Z" fill="#e8f0fc" opacity="0.92"/>
  <!-- Lily (left hand) -->
  <line x1="118" y1="302" x2="105" y2="248" stroke="#3a6820" stroke-width="2.5"/>
  <ellipse cx="104" cy="244" rx="6" ry="10" fill="#f0f8e8" opacity="0.90" transform="rotate(-15,104,244)"/>
  <ellipse cx="96" cy="238" rx="5" ry="8" fill="#f0f8e8" opacity="0.75" transform="rotate(20,96,238)"/>
  <ellipse cx="112" cy="235" rx="5" ry="8" fill="#f0f8e8" opacity="0.75" transform="rotate(-30,112,235)"/>
  <!-- Right arm (raised, pointing up — annunciation gesture) -->
  <path d="M235,195 Q272,228 285,275 Q274,285 260,279 Q254,248 238,215 Z" fill="#e8f0fc" opacity="0.92"/>
  <!-- Right hand open upward -->
  <ellipse cx="284" cy="278" rx="13" ry="9" fill="#d4c8b8" opacity="0.88"/>
  <!-- Left hand -->
  <ellipse cx="122" cy="302" rx="13" ry="9" fill="#d4c8b8" opacity="0.88"/>
  <!-- Neck -->
  <rect x="193" y="142" width="14" height="18" rx="4" fill="#d4c8b8" opacity="0.88"/>
  <!-- Head -->
  <ellipse cx="200" cy="108" rx="26" ry="30" fill="#d8c8b0" opacity="0.92"/>
  <!-- Hair (light, angelic) -->
  <path d="M174,104 Q176,68 200,62 Q224,68 226,104 Q220,82 200,80 Q180,82 174,104 Z" fill="#c8a858" opacity="0.75"/>
  <ellipse cx="172" cy="112" rx="7" ry="16" fill="#c8a858" opacity="0.58"/>
  <ellipse cx="228" cy="112" rx="7" ry="16" fill="#c8a858" opacity="0.58"/>
  <!-- Halo: two thin gold rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#sgb-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Frame -->
  <rect x="6" y="6" width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#020408" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SAN GABRIEL ARC\u00c1NGEL \u00b7 SAINT GABRIEL</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#a8c0f0" font-style="italic">\u00abMensajero del Alt\u00edsimo\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abMessenger of the Most High\u00bb</text>
</svg>
"""

# ── San Axayacatl ────────────────────────────────────────────────────────────
axayacatl = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="sax-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#08140e"/><stop offset="100%" stop-color="#020604"/>
    </radialGradient>
    <radialGradient id="sax-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#1a5a4a" stop-opacity="0.26"/><stop offset="100%" stop-color="#1a5a4a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sax-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#2a8060" stop-opacity="1"/><stop offset="100%" stop-color="#0a3020" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sax-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="sax-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sax-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sax-wg"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#sax-bg)"/>
  <rect width="400" height="600" fill="url(#sax-atm)"/>
  <!-- Water reflection glow at bottom -->
  <ellipse cx="200" cy="540" rx="170" ry="55" fill="#1a5a4a" opacity="0.22" filter="url(#sax-wg)"/>
  <!-- Rays: teal left, gold right -->
  <polygon points="198,262 -25,610 115,610" fill="url(#sax-r1)" filter="url(#sax-gl)" opacity="0.72"/>
  <polygon points="198,262 20,600  85,600"  fill="#2a8060" opacity="0.38"/>
  <polygon points="202,262 425,610 285,610" fill="url(#sax-r2)" filter="url(#sax-gl)" opacity="0.70"/>
  <polygon points="202,262 375,600 315,600" fill="#f5e060" opacity="0.34"/>
  <!-- White robe (catechumen / baptismal) -->
  <path d="M164,158 Q140,208 128,458 Q162,475 200,477 Q238,475 272,458 Q260,208 236,158 Q218,172 200,174 Q182,172 164,158 Z" fill="#eaece8" opacity="0.90"/>
  <!-- Robe fold -->
  <path d="M176,162 Q156,218 148,440 Q172,458 200,460 Q186,224 180,165 Z" fill="#c8cec0" opacity="0.38"/>
  <!-- Teal sash / belt -->
  <rect x="158" y="278" width="84" height="10" rx="4" fill="#2a8060" opacity="0.75"/>
  <!-- Outer mantle (jade/teal, draped) -->
  <path d="M165,160 Q118,200 108,338 Q124,350 144,342 Q150,286 166,228 Z" fill="#1a6050" opacity="0.55"/>
  <!-- Cross (right hand, raised) -->
  <path d="M236,195 Q268,228 278,272 Q268,282 256,276 Q250,252 238,218 Z" fill="#eaece8" opacity="0.90"/>
  <line x1="275" y1="260" x2="275" y2="215" stroke="#c9a84c" stroke-width="6" stroke-linecap="round"/>
  <line x1="258" y1="238" x2="292" y2="238" stroke="#c9a84c" stroke-width="5" stroke-linecap="round"/>
  <!-- Left arm (holds jade vessel / water jar) -->
  <path d="M164,195 Q126,232 115,295 Q128,306 142,299 Q150,262 166,215 Z" fill="#eaece8" opacity="0.90"/>
  <!-- Water jar (jade vessel) -->
  <ellipse cx="108" cy="308" rx="18" ry="22" fill="#3a8068" opacity="0.82"/>
  <ellipse cx="108" cy="296" rx="12" ry="8" fill="#4a9078" opacity="0.78"/>
  <ellipse cx="108" cy="330" rx="14" ry="6" fill="#2a6050" opacity="0.72"/>
  <!-- Water flow from jar -->
  <path d="M104,322 Q96,335 98,350" stroke="#80d0c0" stroke-width="2" fill="none" opacity="0.62" stroke-linecap="round"/>
  <path d="M112,326 Q106,340 108,355" stroke="#80d0c0" stroke-width="1.5" fill="none" opacity="0.50" stroke-linecap="round"/>
  <!-- Hands -->
  <ellipse cx="118" cy="299" rx="12" ry="8" fill="#b8906a" opacity="0.88"/>
  <ellipse cx="278" cy="274" rx="12" ry="8" fill="#b8906a" opacity="0.88"/>
  <!-- Neck -->
  <rect x="193" y="142" width="14" height="18" rx="4" fill="#c09870" opacity="0.88"/>
  <!-- Head (indigenous features) -->
  <ellipse cx="200" cy="108" rx="27" ry="31" fill="#b8906a" opacity="0.92"/>
  <!-- Dark hair -->
  <path d="M173,102 Q175,64 200,58 Q225,64 227,102 Q220,78 200,76 Q180,78 173,102 Z" fill="#1a1008" opacity="0.90"/>
  <ellipse cx="172" cy="115" rx="7" ry="18" fill="#1a1008" opacity="0.75"/>
  <ellipse cx="228" cy="115" rx="7" ry="18" fill="#1a1008" opacity="0.75"/>
  <!-- Eyes (dark, expressive) -->
  <ellipse cx="189" cy="106" rx="5" ry="4" fill="#0a0808"/>
  <ellipse cx="211" cy="106" rx="5" ry="4" fill="#0a0808"/>
  <circle cx="190" cy="105" r="1.5" fill="#ffffff" opacity="0.45"/>
  <circle cx="212" cy="105" r="1.5" fill="#ffffff" opacity="0.45"/>
  <!-- Halo: two thin gold rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#sax-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Frame -->
  <rect x="6" y="6" width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#020604" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SAN AXAYACATL \u00b7 SAINT AXAYACATL</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#80d8b8" font-style="italic">\u00abCara de agua, imagen del cielo\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abFace of water, image of heaven\u00bb</text>
</svg>
"""

files = {
    "santaselene.svg": selene,
    "sangabriel.svg": gabriel,
    "sanaxayacatl.svg": axayacatl,
}

for name, content in files.items():
    p = BASE / name
    p.write_text(content, encoding="utf-8")
    print(f"Written {p} ({p.stat().st_size} bytes)")
