import pathlib

# San Alejandro de Bérgamo — martyr soldier, Theban Legion
# Color: #2a4a8a (deep Roman military blue/indigo)
# Figure: Roman soldier in tunic + military cloak (paludamentum), palm of martyrdom
#         in left hand, sword at side, helmet on ground at feet

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="sa-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#0a0e1a"/><stop offset="100%" stop-color="#020408"/>
    </radialGradient>
    <radialGradient id="sa-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#2a4a8a" stop-opacity="0.28"/><stop offset="100%" stop-color="#2a4a8a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sa-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#3060b0" stop-opacity="1"/><stop offset="100%" stop-color="#102040" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sa-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sa-tunic" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c03030"/><stop offset="100%" stop-color="#701818"/>
    </linearGradient>
    <linearGradient id="sa-cloak" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3060b0"/><stop offset="100%" stop-color="#102040"/>
    </linearGradient>
    <filter id="sa-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sa-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sa-gm"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#sa-bg)"/>
  <rect width="400" height="600" fill="url(#sa-atm)"/>
  <!-- Stars -->
  <circle cx="48"  cy="30"  r="1.5" fill="#c0d0e8" opacity="0.75"/>
  <circle cx="108" cy="18"  r="1"   fill="#c0d0e8" opacity="0.65"/>
  <circle cx="295" cy="24"  r="1"   fill="#c0d0e8" opacity="0.55"/>
  <circle cx="360" cy="44"  r="1.5" fill="#c0d0e8" opacity="0.70"/>
  <circle cx="35"  cy="80"  r="1"   fill="#c0d0e8" opacity="0.55"/>
  <circle cx="378" cy="72"  r="1"   fill="#c0d0e8" opacity="0.60"/>
  <!-- Bergamo basilica silhouette (very subtle) -->
  <rect x="148" y="355" width="104" height="165" fill="#0e1830" opacity="0.28"/>
  <rect x="138" y="305" width="30" height="215"  fill="#0e1830" opacity="0.22"/>
  <rect x="232" y="305" width="30" height="215"  fill="#0e1830" opacity="0.22"/>
  <polygon points="138,305 153,272 168,305" fill="#0e1830" opacity="0.22"/>
  <polygon points="232,305 247,272 262,305" fill="#0e1830" opacity="0.22"/>
  <!-- Rays: blue-steel left, gold right -->
  <polygon points="198,264 -25,610 115,610" fill="url(#sa-r1)" filter="url(#sa-gl)" opacity="0.74"/>
  <polygon points="198,264  20,600  85,600" fill="#3060b0" opacity="0.36"/>
  <polygon points="202,264 425,610 285,610" fill="url(#sa-r2)" filter="url(#sa-gl)" opacity="0.72"/>
  <polygon points="202,264 375,600 315,600" fill="#f5e060" opacity="0.34"/>
  <!-- Military cloak (paludamentum, blue, draped over left shoulder) -->
  <path d="M110,225 Q130,208 162,202 L156,460 Q120,474 106,444 Z" fill="url(#sa-cloak)" opacity="0.85"/>
  <path d="M110,225 Q130,208 162,202" stroke="#6090d0" stroke-width="2" fill="none" opacity="0.60"/>
  <!-- Red soldier tunic (paenula) -->
  <path d="M162,162 Q138,212 126,464 Q162,480 200,482 Q238,480 274,464 Q262,212 238,162 Q220,176 200,178 Q180,176 162,162 Z" fill="url(#sa-tunic)" opacity="0.88"/>
  <!-- Tunic belt (military cincture) -->
  <rect x="152" y="286" width="96" height="10" rx="4" fill="#c9a020" opacity="0.85"/>
  <!-- Tunic fold lines -->
  <path d="M176,168 Q158,226 150,448" stroke="#e04040" stroke-width="0.8" fill="none" opacity="0.30"/>
  <path d="M224,168 Q242,226 250,448" stroke="#e04040" stroke-width="0.8" fill="none" opacity="0.30"/>
  <!-- Left arm — holds palm of martyrdom upright -->
  <path d="M162,192 Q128,238 116,302 Q128,312 142,306 Q150,270 166,224 Z" fill="url(#sa-tunic)" opacity="0.88"/>
  <!-- Palm branch (martyr's palm) -->
  <line x1="124" y1="480" x2="118" y2="170" stroke="#5a8020" stroke-width="5" stroke-linecap="round"/>
  <!-- Palm leaves -->
  <ellipse cx="108" cy="186" rx="14" ry="6" fill="#6aaa28" opacity="0.88" transform="rotate(-30,108,186)"/>
  <ellipse cx="122" cy="178" rx="14" ry="5" fill="#7ac030" opacity="0.85" transform="rotate(-10,122,178)"/>
  <ellipse cx="132" cy="182" rx="13" ry="5" fill="#6aaa28" opacity="0.80" transform="rotate(15,132,182)"/>
  <ellipse cx="114" cy="198" rx="12" ry="4" fill="#88c838" opacity="0.75" transform="rotate(-50,114,198)"/>
  <ellipse cx="105" cy="198" rx="11" ry="4" fill="#7ac030" opacity="0.70" transform="rotate(-65,105,198)"/>
  <!-- Left hand -->
  <ellipse cx="120" cy="306" rx="13" ry="9" fill="#d4a878" opacity="0.88"/>
  <!-- Right arm — raised, open (testimony / preaching gesture) -->
  <path d="M238,192 Q274,232 284,290 Q272,300 258,295 Q252,262 240,218 Z" fill="url(#sa-tunic)" opacity="0.88"/>
  <!-- Right hand (open, raised) -->
  <ellipse cx="280" cy="295" rx="13" ry="9" fill="#d4a878" opacity="0.88"/>
  <!-- Roman helmet on ground (at feet, left side — he has laid down arms for Christ) -->
  <g transform="translate(104,468)">
    <ellipse cx="26" cy="20" rx="26" ry="12" fill="#8a7020" opacity="0.82"/>
    <path d="M0,20 Q26,4 52,20" stroke="#c9a030" stroke-width="1.5" fill="none" opacity="0.60"/>
    <rect x="18" y="1" width="16" height="16" rx="2" fill="#a08030" opacity="0.70"/>
    <line x1="26" y1="0" x2="26" y2="16" stroke="#c9a030" stroke-width="1" opacity="0.50"/>
    <ellipse cx="26" cy="28" rx="22" ry="8" fill="#6a5818" opacity="0.50"/>
  </g>
  <!-- Neck -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4a878" opacity="0.88"/>
  <!-- Head -->
  <ellipse cx="200" cy="108" rx="27" ry="30" fill="#d4a878" opacity="0.92"/>
  <!-- Short dark Roman hair -->
  <path d="M173,100 Q175,62 200,56 Q225,62 227,100 Q220,74 200,72 Q180,74 173,100 Z" fill="#1a1008" opacity="0.90"/>
  <!-- Eyes (dark, direct, resolute gaze) -->
  <ellipse cx="189" cy="109" rx="5" ry="4" fill="#0e0808"/>
  <ellipse cx="211" cy="109" rx="5" ry="4" fill="#0e0808"/>
  <circle cx="190" cy="108" r="1.5" fill="#ffffff" opacity="0.40"/>
  <circle cx="212" cy="108" r="1.5" fill="#ffffff" opacity="0.40"/>
  <!-- Brow -->
  <path d="M182,101 Q189,98 195,101" stroke="#1a1008" stroke-width="1.8" fill="none"/>
  <path d="M205,101 Q211,98 218,101" stroke="#1a1008" stroke-width="1.8" fill="none"/>
  <!-- Halo: two thin gold rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#sa-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6"  y="6"  width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#020408" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SAN ALEJANDRO \u00b7 SAINT ALEXANDER</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#7090d8" font-style="italic">\u00abM\u00e1rtir de B\u00e9rgamo, Legi\u00f3n Tebana\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abMartyr of Bergamo, Theban Legion\u00bb</text>
</svg>
"""

p = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer\assets\images\sanalejandro.svg")
p.write_text(svg, encoding="utf-8")
print(f"Written {p} ({p.stat().st_size} bytes)")
