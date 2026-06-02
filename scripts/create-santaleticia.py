import json, pathlib

data = {
  "id": "santaleticia",
  "name": { "es": "Santa Leticia (Laetitia)", "en": "Saint Laetitia (Leticia)" },
  "feast_day": { "es": "22 de marzo", "en": "March 22" },
  "image": "/assets/images/santaleticia.svg",
  "prayer": {
    "es": "Santa Leticia, mártir de Cristo, cuyo nombre mismo proclama la alegría del Evangelio: intercede por nosotros. Tú que diste tu vida antes que renunciar a la fe que era tu tesoro: ayúdanos a encontrar en Cristo la alegría verdadera que ninguna tribulación puede arrebatar. Patrona de todos los que llevan el nombre de Leticia, ruega por quienes viven tiempos de tristeza, de prueba o de persecución, para que descubran en la cruz la fuente de la alegría pascual. Santa Leticia, ruega por nosotros. Amén.",
    "en": "Saint Laetitia, martyr of Christ, whose very name proclaims the joy of the Gospel: intercede for us. You who gave your life rather than renounce the faith that was your treasure: help us to find in Christ the true joy that no tribulation can take away. Patron of all who bear the name Leticia, pray for those who live times of sadness, trial, or persecution, that they may discover in the cross the source of paschal joy. Saint Laetitia, pray for us. Amen."
  },
  "history": {
    "es": "Santa Leticia (Laetitia en latín, que significa alegría o felicidad) es una mártir cristiana de la Iglesia primitiva, cuyos restos de vida hagiográfica, como ocurre con la mayoría de los mártires de los primeros siglos, son escasos, pero cuya veneración es antigua y auténtica. Su nombre figura en el Martirologio Romano, el catálogo oficial de los santos de la Iglesia Católica, donde es conmemorada el 22 de marzo junto a otros mártires de la primitiva Iglesia. El nombre Laetitia era común entre los primeros cristianos, que lo adoptaron como expresión de la alegría espiritual que les daba la fe en Cristo Resucitado —la laetitia pascalis de la que hablan San Pablo y los Padres de la Iglesia. Según la tradición, Santa Leticia fue una virgen cristiana que sufrió el martirio durante una de las grandes persecuciones del Imperio Romano —posiblemente bajo Diocleciano o en el contexto de la persecución del siglo III— por negarse a renunciar a la fe cristiana y a los votos de castidad que había consagrado a Dios. Fue venerada desde tiempos muy tempranos en diferentes regiones del mundo cristiano. En los países de habla hispana, su fiesta ha sido celebrada con especial devoción popular, siendo patrona de todas las personas que llevan el nombre de Leticia o Laetitia. El Martirologio Romano reconoce su culto como legítimo y antiguo. Su figura representa la paradoja cristiana: la alegría más profunda florece precisamente en el momento del mayor sacrificio, porque la vida entregada a Cristo no se pierde sino que se transforma en vida eterna.",
    "en": "Saint Laetitia (Laetitia in Latin, meaning joy or happiness) is a Christian martyr of the primitive Church whose hagiographic records, as with most martyrs of the early centuries, are scarce, but whose veneration is ancient and authentic. Her name appears in the Roman Martyrology, the official catalogue of saints of the Catholic Church, where she is commemorated on March 22 along with other martyrs of the early Church. The name Laetitia was common among the first Christians, who adopted it as an expression of the spiritual joy given to them by faith in the Risen Christ — the laetitia pascalis of which Saint Paul and the Church Fathers speak. According to tradition, Saint Laetitia was a Christian virgin who suffered martyrdom during one of the great persecutions of the Roman Empire — possibly under Diocletian or in the context of the third-century persecution — for refusing to renounce the Christian faith and the vows of chastity she had consecrated to God. She was venerated from very early times in different regions of the Christian world. In Spanish-speaking countries, her feast has been celebrated with special popular devotion, serving as patron of all persons bearing the name Leticia or Laetitia. The Roman Martyrology recognizes her cult as legitimate and ancient. Her figure represents the Christian paradox: the deepest joy blossoms precisely at the moment of greatest sacrifice, because life given to Christ is not lost but transformed into eternal life."
  },
  "novena_prayers": {
    "es": "Dios de toda alegría y consolación, que en Santa Leticia nos mostraste que la entrega total a Cristo es fuente de la alegría más profunda: por su intercesión, concede a todos los que llevan su nombre y a todos los que sufren, descubrir en Tu amor la laetitia pascual que supera todo dolor y toda prueba. Amén.",
    "en": "God of all joy and consolation, who in Saint Laetitia showed us that total self-giving to Christ is the source of the deepest joy: through her intercession, grant all who bear her name and all who suffer, to discover in your love the paschal joy that surpasses all pain and all trial. Amen."
  },
  "novena": [
    { "day": 1, "es": "Santa Leticia, tu nombre es alegría: intercede por todos los que viven en tristeza, depresión o desesperanza, para que descubran que la alegría cristiana no es superficialidad sino la paz profunda que viene de Dios.", "en": "Saint Laetitia, your name is joy: intercede for all who live in sadness, depression, or despair, that they may discover that Christian joy is not superficiality but the deep peace that comes from God." },
    { "day": 2, "es": "Santa Leticia, mártir virgen: intercede por todos los jóvenes y jóvenes que buscan vivir su fe con integridad en un mundo que ridiculiza los valores del Evangelio. Dales tu misma valentía.", "en": "Saint Laetitia, virgin martyr: intercede for all young people who seek to live their faith with integrity in a world that ridicules Gospel values. Give them your same courage." },
    { "day": 3, "es": "Santa Leticia, que te negaste a apostatar bajo presión: ayúdame a ser fiel a mis convicciones cuando el entorno me presiona a callar mi fe, a avergonzarme de Cristo o a ceder ante lo que sé que está mal.", "en": "Saint Laetitia, who refused to apostatize under pressure: help me to be faithful to my convictions when my environment pressures me to silence my faith, to be ashamed of Christ, or to yield to what I know is wrong." },
    { "day": 4, "es": "Santa Leticia, que hallaste la alegría en la entrega total: enséñame que la renuncia hecha por amor a Dios no empobrece sino que enriquece, que el sacrificio cristiano es fuente de plenitud y no de vacío.", "en": "Saint Laetitia, who found joy in total self-giving: teach me that renunciation made out of love for God does not impoverish but enriches, that Christian sacrifice is a source of fullness and not emptiness." },
    { "day": 5, "es": "Santa Leticia, patrona de quienes llevan tu nombre: sé la intercesora especial de todas las Leticias y Laetitias del mundo, que encuentren en ti una amiga cercana que presenta sus necesidades ante Dios.", "en": "Saint Laetitia, patron of those who bear your name: be the special intercessor of all the Leticias and Laetitias in the world, that they may find in you a close friend who presents their needs before God." },
    { "day": 6, "es": "Santa Leticia, cuya memoria la Iglesia conserva aunque poco sepamos de tu vida: enséñame que la santidad no requiere ser conocida ni recordada por el mundo, sino únicamente fiel a Dios en el lugar donde uno está.", "en": "Saint Laetitia, whose memory the Church preserves though we know little of your life: teach me that holiness does not require being known or remembered by the world, but only being faithful to God where one is." },
    { "day": 7, "es": "Santa Leticia, mártir del siglo III o IV: intercede por los mártires de hoy, por los miles de cristianos que en el siglo XXI dan su vida por la fe en Asia, África y Medio Oriente. Que su sangre sea semilla de nuevos cristianos.", "en": "Saint Laetitia, martyr of the third or fourth century: intercede for today's martyrs, for the thousands of Christians in the twenty-first century who give their lives for the faith in Asia, Africa, and the Middle East. May their blood be the seed of new Christians." },
    { "day": 8, "es": "Santa Leticia, cuyo nombre evoca la laetitia pascual del Resucitado: que tu intercesión ayude a los que atraviesan el 'Viernes Santo' de sus vidas —el duelo, la enfermedad, la ruptura— a creer que el Domingo de Resurrección también llegará para ellos.", "en": "Saint Laetitia, whose name evokes the paschal joy of the Risen One: may your intercession help those going through the 'Good Friday' of their lives — grief, illness, breakdown — to believe that Easter Sunday will also come for them." },
    { "day": 9, "es": "Santa Leticia, cierro esta novena pidiendo la gracia de vivir con alegría cristiana. No la alegría fácil de quien no sufre, sino la tuya: la que viene de amar a Cristo más que a la vida misma. Intercede por mí. Amén.", "en": "Saint Laetitia, I close this novena asking for the grace to live with Christian joy. Not the easy joy of one who does not suffer, but yours: the joy that comes from loving Christ more than life itself. Intercede for me. Amen." }
  ],
  "chaplet": { "available": False, "es": "", "en": "" },
  "litany": {
    "available": True,
    "es": "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad.\nCristo, óyenos. Cristo, escúchanos.\nDios Padre celestial, ten misericordia de nosotros.\nDios Hijo, Redentor del mundo, ten misericordia de nosotros.\nDios Espíritu Santo, ten misericordia de nosotros.\nSantísima Trinidad, un solo Dios, ten misericordia de nosotros.\nSanta María, Reina de los Mártires, ruega por nosotros.\nSanta Leticia, virgen y mártir de Cristo, ruega por nosotros.\nSanta Leticia, que elegiste la muerte antes que renegar de la fe, ruega por nosotros.\nSanta Leticia, cuyo nombre proclama la alegría del Evangelio, ruega por nosotros.\nSanta Leticia, modelo de valentía y pureza, ruega por nosotros.\nSanta Leticia, patrona de todas las Leticias, ruega por nosotros.\nSanta Leticia, intercesora de los que viven en tristeza, ruega por nosotros.\nSanta Leticia, que hallaste la alegría en el sacrificio, ruega por nosotros.\nCordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.\nOremos. Señor nuestro Dios, que en Santa Leticia nos revelaste que el martirio es la más alta expresión de la alegría del Evangelio: por su intercesión, concédenos esa laetitia pascual que no depende de las circunstancias sino del amor a Ti. Por Cristo nuestro Señor. Amén.",
    "en": "Lord, have mercy. Christ, have mercy. Lord, have mercy.\nChrist, hear us. Christ, graciously hear us.\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, one God, have mercy on us.\nHoly Mary, Queen of Martyrs, pray for us.\nSaint Laetitia, virgin and martyr of Christ, pray for us.\nSaint Laetitia, who chose death rather than deny the faith, pray for us.\nSaint Laetitia, whose name proclaims the joy of the Gospel, pray for us.\nSaint Laetitia, model of courage and purity, pray for us.\nSaint Laetitia, patron of all the Leticias, pray for us.\nSaint Laetitia, intercessor for those who live in sadness, pray for us.\nSaint Laetitia, who found joy in sacrifice, pray for us.\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\nLet us pray. Lord our God, who in Saint Laetitia revealed to us that martyrdom is the highest expression of Gospel joy: through her intercession, grant us that paschal joy which does not depend on circumstances but on love for you. Through Christ our Lord. Amen."
  },
  "miracles": {
    "available": True,
    "es": "Como sucede con muchos mártires de los primeros siglos, los testimonios hagiográficos concretos sobre milagros atribuidos a Santa Leticia son limitados. Sin embargo, su culto ha persistido a lo largo de los siglos, lo que en la tradición católica es ya un signo de la autenticidad de su intercesión ante Dios. Numerosas personas que llevan el nombre de Leticia reportan haber encontrado en su intercesión fuerza en momentos de crisis, paz en situaciones de angustia, y el regalo de la alegría en circunstancias que humanamente parecían no tener salida. En particular, la devoción a Santa Leticia como patrona de la alegría cristiana ha florecido en comunidades de vida consagrada y entre personas que atraviesan períodos de oscuridad espiritual, quienes reportan que la invocación de su nombre les recuerda la promesa del Evangelio: que la alegría de Dios puede sostenerse incluso en medio del sufrimiento más profundo.",
    "en": "As with many martyrs of the early centuries, specific hagiographic testimonies of miracles attributed to Saint Laetitia are limited. However, her cult has persisted over the centuries, which in Catholic tradition is itself a sign of the authenticity of her intercession before God. Numerous people bearing the name Leticia report having found in her intercession strength in moments of crisis, peace in situations of anguish, and the gift of joy in circumstances that humanly seemed to have no way out. In particular, devotion to Saint Laetitia as patroness of Christian joy has flourished in communities of consecrated life and among people passing through periods of spiritual darkness, who report that the invocation of her name reminds them of the Gospel promise: that the joy of God can be sustained even in the midst of the deepest suffering."
  }
}

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="ltc-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#120509"/><stop offset="100%" stop-color="#040103"/>
    </radialGradient>
    <radialGradient id="ltc-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#8a2a5a" stop-opacity="0.28"/><stop offset="100%" stop-color="#8a2a5a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ltc-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#a83878" stop-opacity="1"/><stop offset="100%" stop-color="#2a0818" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="ltc-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="ltc-tunic" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c83870"/><stop offset="100%" stop-color="#680830"/>
    </linearGradient>
    <linearGradient id="ltc-him" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8e4d8"/><stop offset="100%" stop-color="#b8b4a8"/>
    </linearGradient>
    <filter id="ltc-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="ltc-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#ltc-bg)"/>
  <rect width="400" height="600" fill="url(#ltc-atm)"/>
  <!-- Stars -->
  <circle cx="44"  cy="26"  r="1.5" fill="#e8b8d0" opacity="0.70"/>
  <circle cx="108" cy="18"  r="1"   fill="#e8b8d0" opacity="0.58"/>
  <circle cx="294" cy="22"  r="1"   fill="#e8b8d0" opacity="0.50"/>
  <circle cx="356" cy="44"  r="1.5" fill="#e8b8d0" opacity="0.62"/>
  <circle cx="32"  cy="72"  r="1"   fill="#e8b8d0" opacity="0.48"/>
  <circle cx="376" cy="68"  r="1"   fill="#e8b8d0" opacity="0.52"/>
  <!-- Gentle rose-gold ambient glow behind figure -->
  <ellipse cx="200" cy="300" rx="120" ry="220" fill="#8a2a5a" opacity="0.08"/>
  <!-- Rays: rose-crimson left, gold right -->
  <polygon points="198,264 -20,610 112,610" fill="url(#ltc-r1)" filter="url(#ltc-gl)" opacity="0.72"/>
  <polygon points="198,264  26,600  86,600" fill="#a83878" opacity="0.34"/>
  <polygon points="202,264 420,610 288,610" fill="url(#ltc-r2)" filter="url(#ltc-gl)" opacity="0.70"/>
  <polygon points="202,264 372,600 312,600" fill="#f5e060" opacity="0.32"/>
  <!-- Himation / outer mantle (white-ivory, draped from left shoulder) -->
  <path d="M110,215 Q132,205 164,200 L156,492 Q120,480 108,448 Z" fill="url(#ltc-him)" opacity="0.72"/>
  <!-- Tunic (rose-crimson, early Christian) -->
  <path d="M160,162 Q136,212 130,492 L270,492 Q264,212 240,162 Q220,178 200,180 Q180,178 160,162 Z" fill="url(#ltc-tunic)" opacity="0.84"/>
  <!-- Tunic fold lines (subtle) -->
  <path d="M176,168 Q158,228 152,488" stroke="#e04078" stroke-width="1" fill="none" opacity="0.28"/>
  <path d="M224,168 Q242,228 248,488" stroke="#e04078" stroke-width="1" fill="none" opacity="0.28"/>
  <!-- Left arm — holds white lily (purity) -->
  <path d="M160,192 Q124,238 116,306 Q128,316 142,310 Q150,272 166,224 Z" fill="url(#ltc-tunic)" opacity="0.84"/>
  <!-- Left hand -->
  <ellipse cx="122" cy="310" rx="13" ry="9" fill="#d4a878" opacity="0.88"/>
  <!-- Lily stem -->
  <line x1="120" y1="490" x2="116" y2="200" stroke="#4a7018" stroke-width="4" stroke-linecap="round"/>
  <!-- Lily bloom (three petals, white) -->
  <ellipse cx="110" cy="196" rx="12" ry="5" fill="#f0ece0" opacity="0.90" transform="rotate(-35,110,196)"/>
  <ellipse cx="124" cy="191" rx="12" ry="5" fill="#f0ece0" opacity="0.90" transform="rotate(-10,124,191)"/>
  <ellipse cx="118" cy="186" rx="11" ry="5" fill="#f0ece0" opacity="0.85" transform="rotate(20,118,186)"/>
  <!-- Lily center stamens -->
  <circle cx="118" cy="192" r="4" fill="#f5e090" opacity="0.80"/>
  <!-- Right arm — holds palm of martyrdom upright -->
  <path d="M240,192 Q276,232 282,294 Q270,306 256,300 Q252,268 242,220 Z" fill="url(#ltc-tunic)" opacity="0.84"/>
  <!-- Right hand -->
  <ellipse cx="278" cy="300" rx="13" ry="9" fill="#d4a878" opacity="0.88"/>
  <!-- Palm branch (right) -->
  <line x1="276" y1="490" x2="272" y2="172" stroke="#5a8020" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="262" cy="186" rx="14" ry="5" fill="#6aaa28" opacity="0.88" transform="rotate(-28,262,186)"/>
  <ellipse cx="274" cy="179" rx="14" ry="5" fill="#7ac030" opacity="0.84" transform="rotate(-6,274,179)"/>
  <ellipse cx="284" cy="183" rx="13" ry="5" fill="#6aaa28" opacity="0.78" transform="rotate(18,284,183)"/>
  <ellipse cx="268" cy="198" rx="12" ry="4" fill="#88c838" opacity="0.72" transform="rotate(-45,268,198)"/>
  <!-- Neck -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4a878" opacity="0.88"/>
  <!-- Head (young martyr, serene expression) -->
  <ellipse cx="200" cy="108" rx="26" ry="29" fill="#d4a878" opacity="0.92"/>
  <!-- Dark wavy hair with part in center -->
  <path d="M174,101 Q176,64 200,58 Q224,64 226,101 Q218,76 200,74 Q182,76 174,101 Z" fill="#140808" opacity="0.90"/>
  <!-- Eyes (young, serene, slightly raised — toward heaven) -->
  <ellipse cx="189" cy="106" rx="5" ry="3.8" fill="#0e0808"/>
  <ellipse cx="211" cy="106" rx="5" ry="3.8" fill="#0e0808"/>
  <circle cx="190" cy="105" r="1.5" fill="#ffffff" opacity="0.42"/>
  <circle cx="212" cy="105" r="1.5" fill="#ffffff" opacity="0.42"/>
  <!-- Brow -->
  <path d="M182,98 Q189,95 195,98"  stroke="#140808" stroke-width="1.8" fill="none"/>
  <path d="M205,98 Q211,95 218,98" stroke="#140808" stroke-width="1.8" fill="none"/>
  <!-- Serene young smile -->
  <path d="M192,119 Q200,122 208,119" stroke="#c09070" stroke-width="1" fill="none" opacity="0.55"/>
  <!-- Halo rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#ltc-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6"  y="6"  width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#040103" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SANTA LETICIA \u00b7 SAINT LAETITIA</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#d060a0" font-style="italic">\u00abVirgen y M\u00e1rtir, Alegr\u00eda del Evangelio\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abVirgin and Martyr, Joy of the Gospel\u00bb</text>
</svg>
"""

base = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer")
(base / "data" / "santaleticia.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
(base / "assets" / "images" / "santaleticia.svg").write_text(svg, encoding="utf-8")
print(f"Santa Leticia: JSON {(base/'data'/'santaleticia.json').stat().st_size}B, SVG {(base/'assets'/'images'/'santaleticia.svg').stat().st_size}B")
