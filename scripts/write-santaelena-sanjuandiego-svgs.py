import pathlib

BASE = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer\assets\images")

# ── Santa Elena ───────────────────────────────────────────────────────────────
# Prefix: se-  |  Color: #8a5a10 (imperial gold/bronze)
# Figure: empress in purple-gold robes, crown, holding the True Cross upright
elena = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="se-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#160e04"/><stop offset="100%" stop-color="#060200"/>
    </radialGradient>
    <radialGradient id="se-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#8a5a10" stop-opacity="0.28"/><stop offset="100%" stop-color="#8a5a10" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="se-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#c09030" stop-opacity="1"/><stop offset="100%" stop-color="#603010" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="se-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="se-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="se-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#se-bg)"/>
  <rect width="400" height="600" fill="url(#se-atm)"/>
  <!-- Rays: amber-gold left, bright gold right -->
  <polygon points="198,264 -25,610 115,610" fill="url(#se-r1)" filter="url(#se-gl)" opacity="0.74"/>
  <polygon points="198,264 20,600  85,600"  fill="#c09030" opacity="0.38"/>
  <polygon points="202,264 425,610 285,610" fill="url(#se-r2)" filter="url(#se-gl)" opacity="0.72"/>
  <polygon points="202,264 375,600 315,600" fill="#f5e060" opacity="0.36"/>
  <!-- Imperial robe (deep purple) -->
  <path d="M162,160 Q138,210 126,460 Q162,476 200,478 Q238,476 274,460 Q262,210 238,160 Q220,174 200,176 Q180,174 162,160 Z" fill="#5a1060" opacity="0.88"/>
  <!-- Gold brocade overlay on robe -->
  <path d="M175,165 Q160,220 154,440 Q176,458 200,460 Q186,226 180,167 Z" fill="#c09030" opacity="0.22"/>
  <path d="M225,165 Q240,220 246,440 Q224,458 200,460 Q214,226 220,167 Z" fill="#c09030" opacity="0.22"/>
  <!-- Imperial gold belt -->
  <rect x="154" y="282" width="92" height="11" rx="5" fill="#c9a030" opacity="0.88"/>
  <!-- Left arm (at side, slightly extended) -->
  <path d="M162,190 Q130,238 120,300 Q132,310 146,304 Q153,268 168,220 Z" fill="#5a1060" opacity="0.88"/>
  <!-- Left hand -->
  <ellipse cx="124" cy="304" rx="13" ry="9" fill="#d4b898" opacity="0.88"/>
  <!-- Right arm holds large cross upright -->
  <path d="M238,190 Q265,220 272,265 Q262,276 250,270 Q246,240 238,210 Z" fill="#5a1060" opacity="0.88"/>
  <!-- True Cross (large, held in right hand) -->
  <line x1="262" y1="460" x2="262" y2="160" stroke="#c9a030" stroke-width="8" stroke-linecap="round"/>
  <line x1="234" y1="245" x2="290" y2="245" stroke="#c9a030" stroke-width="6" stroke-linecap="round"/>
  <!-- Cross shine -->
  <line x1="262" y1="160" x2="262" y2="460" stroke="#f5e080" stroke-width="2" stroke-opacity="0.40" stroke-linecap="round"/>
  <!-- Right hand gripping cross -->
  <ellipse cx="256" cy="270" rx="13" ry="9" fill="#d4b898" opacity="0.88"/>
  <!-- Neck -->
  <rect x="193" y="143" width="14" height="18" rx="4" fill="#d4b898" opacity="0.88"/>
  <!-- Head -->
  <ellipse cx="200" cy="108" rx="26" ry="30" fill="#d4b898" opacity="0.90"/>
  <!-- Hair (dark, pinned up under crown) -->
  <path d="M174,106 Q176,66 200,60 Q224,66 226,106 Q220,80 200,78 Q180,80 174,106 Z" fill="#2a1808" opacity="0.85"/>
  <!-- Imperial crown (above head) -->
  <rect x="172" y="66" width="56" height="12" rx="3" fill="#c9a030" opacity="0.92"/>
  <polygon points="178,66 183,52 188,66" fill="#c9a030" opacity="0.92"/>
  <polygon points="195,66 200,48 205,66" fill="#c9a030" opacity="0.92"/>
  <polygon points="212,66 217,52 222,66" fill="#c9a030" opacity="0.92"/>
  <!-- Crown gems -->
  <circle cx="183" cy="52" r="3" fill="#e03030" opacity="0.85"/>
  <circle cx="200" cy="48" r="3.5" fill="#4050e0" opacity="0.85"/>
  <circle cx="217" cy="52" r="3" fill="#30a030" opacity="0.85"/>
  <!-- Halo: two thin gold rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#se-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double frame -->
  <rect x="6" y="6" width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#060200" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SANTA ELENA \u00b7 SAINT HELENA</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#d4a840" font-style="italic">\u00abDescubridora de la Santa Cruz\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abDiscoverer of the True Cross\u00bb</text>
</svg>
"""

# ── San Juan Diego ────────────────────────────────────────────────────────────
# Prefix: sjd-  |  Color: #8a1a2a (deep Guadalupe rose)
# Figure: indigenous man in ayate/tilma, roses at feet/chest, Guadalupe glow
juandiego = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="sjd-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#140408"/><stop offset="100%" stop-color="#060002"/>
    </radialGradient>
    <radialGradient id="sjd-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#8a1a2a" stop-opacity="0.26"/><stop offset="100%" stop-color="#8a1a2a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sjd-glow" cx="50%" cy="45%" r="35%">
      <stop offset="0%" stop-color="#f8d060" stop-opacity="0.22"/><stop offset="100%" stop-color="#f8d060" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sjd-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#c03040" stop-opacity="1"/><stop offset="100%" stop-color="#601020" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sjd-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="sjd-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sjd-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sjd-rg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#sjd-bg)"/>
  <rect width="400" height="600" fill="url(#sjd-atm)"/>
  <!-- Guadalupe golden glow (chest area / tilma) -->
  <rect width="400" height="600" fill="url(#sjd-glow)"/>
  <!-- Rays: rose-red left, gold right -->
  <polygon points="198,264 -25,610 115,610" fill="url(#sjd-r1)" filter="url(#sjd-gl)" opacity="0.72"/>
  <polygon points="198,264 20,600  85,600"  fill="#c03040" opacity="0.36"/>
  <polygon points="202,264 425,610 285,610" fill="url(#sjd-r2)" filter="url(#sjd-gl)" opacity="0.72"/>
  <polygon points="202,264 375,600 315,600" fill="#f5e060" opacity="0.34"/>
  <!-- Tilma/ayate (rough woven maguey cloak, draped over shoulders) -->
  <path d="M148,155 Q112,205 100,465 Q148,480 200,482 Q252,480 300,465 Q288,205 252,155 Q230,175 200,177 Q170,175 148,155 Z" fill="#c8b078" opacity="0.80"/>
  <!-- Tilma texture / weave lines (subtle) -->
  <path d="M148,155 Q120,260 112,440" stroke="#a09050" stroke-width="0.8" fill="none" opacity="0.35"/>
  <path d="M252,155 Q280,260 288,440" stroke="#a09050" stroke-width="0.8" fill="none" opacity="0.35"/>
  <!-- White tunic under tilma (collar visible) -->
  <path d="M178,165 Q170,195 166,270 Q182,278 200,279 Q218,278 234,270 Q230,195 222,165 Q212,175 200,177 Q188,175 178,165 Z" fill="#e8e4d8" opacity="0.85"/>
  <!-- Guadalupe image on tilma (small, luminous, chest area) -->
  <ellipse cx="200" cy="310" rx="22" ry="30" fill="#f8e8c8" opacity="0.35" filter="url(#sjd-g2)"/>
  <ellipse cx="200" cy="310" rx="14" ry="20" fill="#f0d8a0" opacity="0.28"/>
  <!-- Roses falling from tilma (left arm) -->
  <!-- Arm gathering roses -->
  <path d="M148,195 Q112,240 102,308 Q116,318 130,312 Q137,274 154,225 Z" fill="#c8b078" opacity="0.80"/>
  <!-- Several roses: deep red -->
  <circle cx="110" cy="315" r="8" fill="#c03040" opacity="0.88" filter="url(#sjd-rg)"/>
  <circle cx="118" cy="330" r="7" fill="#d04050" opacity="0.80" filter="url(#sjd-rg)"/>
  <circle cx="98"  cy="326" r="6" fill="#b02030" opacity="0.78" filter="url(#sjd-rg)"/>
  <circle cx="124" cy="318" r="5" fill="#c83850" opacity="0.75"/>
  <circle cx="104" cy="340" r="5" fill="#d84858" opacity="0.70"/>
  <!-- Rose petals (falling) -->
  <ellipse cx="132" cy="348" rx="4" ry="7" fill="#e05060" opacity="0.55" transform="rotate(20,132,348)"/>
  <ellipse cx="92"  cy="350" rx="3" ry="6" fill="#c03040" opacity="0.50" transform="rotate(-15,92,350)"/>
  <!-- Right arm (slightly raised, open hand — presenting) -->
  <path d="M252,195 Q286,235 296,295 Q283,306 269,300 Q263,268 250,228 Z" fill="#c8b078" opacity="0.80"/>
  <ellipse cx="292" cy="299" rx="13" ry="9" fill="#b8906a" opacity="0.88"/>
  <!-- Left hand holding tilma fold -->
  <ellipse cx="106" cy="312" rx="12" ry="8" fill="#b8906a" opacity="0.88"/>
  <!-- Neck -->
  <rect x="193" y="143" width="14" height="18" rx="4" fill="#b8906a" opacity="0.88"/>
  <!-- Head (indigenous features) -->
  <ellipse cx="200" cy="108" rx="27" ry="31" fill="#b8906a" opacity="0.92"/>
  <!-- Dark straight hair -->
  <path d="M173,102 Q175,62 200,56 Q225,62 227,102 Q220,76 200,74 Q180,76 173,102 Z" fill="#140808" opacity="0.92"/>
  <ellipse cx="172" cy="116" rx="7" ry="19" fill="#140808" opacity="0.80"/>
  <ellipse cx="228" cy="116" rx="7" ry="19" fill="#140808" opacity="0.80"/>
  <!-- Eyes (dark, devout, downward gaze) -->
  <ellipse cx="189" cy="109" rx="5" ry="4" fill="#0a0606"/>
  <ellipse cx="211" cy="109" rx="5" ry="4" fill="#0a0606"/>
  <circle cx="190" cy="108" r="1.5" fill="#ffffff" opacity="0.35"/>
  <circle cx="212" cy="108" r="1.5" fill="#ffffff" opacity="0.35"/>
  <!-- Halo: two thin gold rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#sjd-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double frame -->
  <rect x="6" y="6" width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#060002" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="2" opacity="0.9">SAN JUAN DIEGO \u00b7 SAINT JUAN DIEGO</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#e08090" font-style="italic">\u00abMensajero de Nuestra Se\u00f1ora\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abMessenger of Our Lady\u00bb</text>
</svg>
"""

files = {
    "santaelena.svg": elena,
    "sanjuandiego.svg": juandiego,
}

for name, content in files.items():
    p = BASE / name
    p.write_text(content, encoding="utf-8")
    print(f"Written {p} ({p.stat().st_size} bytes)")
