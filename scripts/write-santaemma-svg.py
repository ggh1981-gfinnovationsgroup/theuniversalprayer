import pathlib

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="sem-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#120818"/><stop offset="100%" stop-color="#040206"/>
    </radialGradient>
    <radialGradient id="sem-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#8a2a5a" stop-opacity="0.26"/><stop offset="100%" stop-color="#8a2a5a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sem-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#a03070" stop-opacity="1"/><stop offset="100%" stop-color="#501030" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sem-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="sem-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sem-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="sem-robe" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5a1a60"/><stop offset="100%" stop-color="#2a0830"/>
    </linearGradient>
    <linearGradient id="sem-mantle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a5a10"/><stop offset="100%" stop-color="#5a3800"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#sem-bg)"/>
  <rect width="400" height="600" fill="url(#sem-atm)"/>
  <!-- Stars -->
  <circle cx="55" cy="35" r="1.5" fill="#e8c0d0" opacity="0.75"/>
  <circle cx="110" cy="20" r="1" fill="#e8c0d0" opacity="0.65"/>
  <circle cx="290" cy="28" r="1" fill="#e8c0d0" opacity="0.55"/>
  <circle cx="355" cy="48" r="1.5" fill="#e8c0d0" opacity="0.70"/>
  <circle cx="38" cy="82" r="1" fill="#e8c0d0" opacity="0.55"/>
  <circle cx="375" cy="76" r="1" fill="#e8c0d0" opacity="0.60"/>
  <!-- Cathedral silhouette (background, very subtle) -->
  <rect x="145" y="360" width="110" height="160" fill="#1a0828" opacity="0.30"/>
  <rect x="136" y="310" width="32" height="210" fill="#1a0828" opacity="0.25"/>
  <rect x="232" y="310" width="32" height="210" fill="#1a0828" opacity="0.25"/>
  <polygon points="136,310 152,275 168,310" fill="#1a0828" opacity="0.25"/>
  <polygon points="232,310 248,275 264,310" fill="#1a0828" opacity="0.25"/>
  <!-- Rays: rose-crimson left, gold right -->
  <polygon points="198,264 -25,610 115,610" fill="url(#sem-r1)" filter="url(#sem-gl)" opacity="0.72"/>
  <polygon points="198,264 20,600  85,600"  fill="#a03070" opacity="0.36"/>
  <polygon points="202,264 425,610 285,610" fill="url(#sem-r2)" filter="url(#sem-gl)" opacity="0.70"/>
  <polygon points="202,264 375,600 315,600" fill="#f5e060" opacity="0.34"/>
  <!-- Gold mantle (royal, draped) -->
  <path d="M114,235 Q134,215 164,210 L160,460 Q124,472 110,442 Z" fill="url(#sem-mantle)" opacity="0.82"/>
  <path d="M286,235 Q266,215 236,210 L240,460 Q276,472 290,442 Z" fill="url(#sem-mantle)" opacity="0.82"/>
  <!-- Mantle trim -->
  <path d="M114,235 Q134,215 164,210" stroke="#c8a020" stroke-width="2" fill="none" opacity="0.70"/>
  <path d="M286,235 Q266,215 236,210" stroke="#c8a020" stroke-width="2" fill="none" opacity="0.70"/>
  <!-- Purple noble robe -->
  <path d="M164,162 Q140,212 128,462 Q164,478 200,480 Q236,478 272,462 Q260,212 236,162 Q218,176 200,178 Q182,176 164,162 Z" fill="url(#sem-robe)" opacity="0.90"/>
  <!-- Robe fold -->
  <path d="M177,165 Q157,220 149,444 Q173,460 200,462 Q186,226 181,168 Z" fill="#7a2a80" opacity="0.22"/>
  <!-- Gold belt -->
  <rect x="154" y="284" width="92" height="10" rx="4" fill="#c8a020" opacity="0.85"/>
  <!-- Church model in left hand (iconographic attribute of foundresses) -->
  <g transform="translate(90,265)">
    <rect x="0" y="38" width="46" height="30" fill="#4a2a50" opacity="0.88"/>
    <polygon points="0,38 23,20 46,38" fill="#6a4a70" opacity="0.88"/>
    <rect x="16" y="8" width="14" height="42" fill="#5a3a60" opacity="0.88"/>
    <polygon points="16,8 23,-4 30,8" fill="#7a5a7a" opacity="0.88"/>
    <line x1="23" y1="-4" x2="23" y2="5" stroke="#c8a020" stroke-width="1.5"/>
    <line x1="19" y1="1" x2="27" y2="1" stroke="#c8a020" stroke-width="1.5"/>
    <path d="M19 20 Q23 15 27 20 L27 30 L19 30 Z" fill="#120818" opacity="0.55"/>
  </g>
  <!-- Left arm holding church -->
  <path d="M164,192 Q126,236 108,302 Q120,312 134,306 Q142,272 158,224 Z" fill="url(#sem-robe)" opacity="0.90"/>
  <ellipse cx="112" cy="306" rx="13" ry="9" fill="#d4b898" opacity="0.88"/>
  <!-- Scroll in right hand (foundation deed) -->
  <g transform="translate(250,280)">
    <rect x="0" y="0" width="48" height="55" rx="3" fill="#e8d8a8" opacity="0.90"/>
    <rect x="-4" y="-3" width="56" height="7" rx="3" fill="#c8a060" opacity="0.90"/>
    <rect x="-4" y="51" width="56" height="7" rx="3" fill="#c8a060" opacity="0.90"/>
    <line x1="6" y1="13" x2="42" y2="13" stroke="#5a3010" stroke-width="1" opacity="0.5"/>
    <line x1="6" y1="20" x2="42" y2="20" stroke="#5a3010" stroke-width="1" opacity="0.4"/>
    <line x1="6" y1="27" x2="42" y2="27" stroke="#5a3010" stroke-width="1" opacity="0.4"/>
    <line x1="6" y1="34" x2="42" y2="34" stroke="#5a3010" stroke-width="1" opacity="0.35"/>
  </g>
  <!-- Right arm holding scroll -->
  <path d="M236,192 Q268,230 278,282 Q266,292 252,286 Q248,256 238,216 Z" fill="url(#sem-robe)" opacity="0.90"/>
  <ellipse cx="274" cy="286" rx="13" ry="9" fill="#d4b898" opacity="0.88"/>
  <!-- Neck -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4b898" opacity="0.88"/>
  <!-- Head -->
  <ellipse cx="200" cy="108" rx="26" ry="30" fill="#d4b898" opacity="0.90"/>
  <!-- Noble veil (white, draped) -->
  <path d="M174,90 Q172,70 200,64 Q228,70 226,90 Q218,82 200,80 Q182,82 174,90 Z" fill="#f0e8f0" opacity="0.88"/>
  <ellipse cx="172" cy="108" rx="8" ry="20" fill="#f0e8f0" opacity="0.75"/>
  <ellipse cx="228" cy="108" rx="8" ry="20" fill="#f0e8f0" opacity="0.75"/>
  <!-- Halo: two thin unfilled gold rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#sem-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6" y="6" width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#040206" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SANTA EMMA \u00b7 SAINT EMMA</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#e8a0c8" font-style="italic">\u00abFundadora de Gurk, Carintia\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abFoundress of Gurk, Carinthia\u00bb</text>
</svg>
"""

p = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer\assets\images\santaemma.svg")
p.write_text(svg, encoding="utf-8")
print(f"Written {p} ({p.stat().st_size} bytes)")
