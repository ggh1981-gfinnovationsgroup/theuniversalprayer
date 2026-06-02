import json, pathlib

data = {
  "id": "santasilvia",
  "name": { "es": "Santa Silvia de Roma", "en": "Saint Sylvia of Rome" },
  "feast_day": { "es": "3 de noviembre", "en": "November 3" },
  "image": "/assets/images/santasilvia.svg",
  "prayer": {
    "es": "Santa Silvia, madre del gran Papa Gregorio, patrona de las madres y de las familias santas: intercede por nosotros. Tú que criaste a tus hijos en la fe, que después de enviudar elegiste una vida de oración y penitencia, y cuya santidad floreció en silencio al servicio de Dios: ayúdanos a ser fieles a nuestra vocación familiar. Ruega por todas las madres que educan a sus hijos en la fe, por las viudas que enfrentan la soledad, y por todos los que llevan el nombre de Silvia. Santa Silvia, ruega por nosotros. Amén.",
    "en": "Saint Sylvia, mother of the great Pope Gregory, patron of mothers and holy families: intercede for us. You who raised your children in the faith, who after widowhood chose a life of prayer and penance, and whose holiness blossomed in silence at God's service: help us to be faithful to our family vocation. Pray for all mothers who raise their children in the faith, for widows who face loneliness, and for all who bear the name Sylvia. Saint Sylvia, pray for us. Amen."
  },
  "history": {
    "es": "Santa Silvia de Roma nació hacia el año 520, en el seno de una familia de la nobleza romana. Se casó con Gordiano, senador romano de la familia Gordiani —también venerado como santo por algunos— y de esta unión nacieron al menos dos hijos: Gregorio y Palatino. Silvia educó a sus hijos en la fe cristiana con esmero y devoción, y su influencia espiritual en la formación de Gregorio fue profunda y decisiva. El propio Gregorio, en sus escritos, hace referencia a la santidad de su madre y a su hogar como un ambiente propicio para la oración y el servicio a Dios. Tras la muerte de su esposo, Silvia abrazó una vida de recogimiento y ascesis. Se estableció en una pequeña celda o habitación junto a la iglesia de San Pablo Extramuros, en Roma, dedicando el resto de su vida a la oración, al ayuno y a la penitencia. La tradición cuenta que allí, en su pequeña morada, llevaba una vida de extrema austeridad. Su hijo Gregorio, convertido ya en monje y luego en papa (590-604), la mencionó con amor y veneración. Su imagen fue incluida en un antiguo mosaico de la iglesia de Sant'Andrea in Clivio Scauri, construida sobre la casa familiar de los Gordiani, donde se muestra a Silvia ofreciendo una bandeja de verduras a su hijo —símbolo de su austeridad. Santa Silvia murió alrededor del año 592, poco antes o durante el pontificado de su hijo. Su fiesta se celebra el 3 de noviembre y es reconocida en el Martirologio Romano. Es patrona de las madres que crían hijos consagrados al servicio de Dios, de las viudas, y de todos los que llevan el nombre de Silvia.",
    "en": "Saint Sylvia of Rome was born around the year 520, into a family of Roman nobility. She married Gordianus, a Roman senator of the Gordiani family — also venerated as a saint by some — and from this union were born at least two sons: Gregory and Palatinus. Sylvia raised her children in the Christian faith with care and devotion, and her spiritual influence on Gregory's formation was profound and decisive. Gregory himself, in his writings, refers to his mother's holiness and to his home as an environment conducive to prayer and service to God. After her husband's death, Sylvia embraced a life of recollection and asceticism. She settled in a small cell or room next to the Church of Saint Paul Outside the Walls, in Rome, devoting the rest of her life to prayer, fasting, and penance. Tradition recounts that there, in her small dwelling, she lived a life of extreme austerity. Her son Gregory, already a monk and later a pope (590–604), mentioned her with love and veneration. Her image was included in an ancient mosaic of the Church of Sant'Andrea in Clivio Scauri, built on the family home of the Gordiani, which depicts Sylvia offering a tray of vegetables to her son — a symbol of her austerity. Saint Sylvia died around the year 592, shortly before or during her son's pontificate. Her feast is celebrated on November 3 and she is recognized in the Roman Martyrology. She is patron of mothers who raise children consecrated to God's service, of widows, and of all who bear the name Sylvia."
  },
  "novena_prayers": {
    "es": "Dios padre y madre de todo bien, que en Santa Silvia nos diste un modelo de maternidad cristiana, de vida contemplativa y de entrega silenciosa: por su intercesión, concede a todas las madres la sabiduría de educar a sus hijos en la fe, y a todas las familias la gracia de ser espacios donde Dios sea amado. Amén.",
    "en": "God, father and mother of all goodness, who in Saint Sylvia gave us a model of Christian motherhood, of contemplative life, and of silent self-giving: through her intercession, grant all mothers the wisdom to raise their children in the faith, and all families the grace of being spaces where God is loved. Amen."
  },
  "novena": [
    { "day": 1, "es": "Santa Silvia, que dedicaste tu vida a formar a tus hijos en la fe: intercede por todos los padres y madres del mundo, para que descubran en su vocación familiar la más alta forma de santidad.", "en": "Saint Sylvia, who dedicated your life to forming your children in the faith: intercede for all fathers and mothers in the world, that they may discover in their family vocation the highest form of holiness." },
    { "day": 2, "es": "Santa Silvia, cuyo hijo Gregorio se convirtió en uno de los más grandes papas y doctores de la Iglesia: ruega por los hijos de todos nosotros, para que Dios los llame a cumplir con plenitud su vocación, cualquiera que ella sea.", "en": "Saint Sylvia, whose son Gregory became one of the greatest popes and doctors of the Church: pray for all our children, that God may call them to fulfill their vocation fully, whatever it may be." },
    { "day": 3, "es": "Santa Silvia, que tras enviudar elegiste la oración y la austeridad: intercede por todas las viudas y los viudos, para que encuentren en Dios su apoyo y su consuelo, y en la oración su nuevo propósito.", "en": "Saint Sylvia, who after widowhood chose prayer and austerity: intercede for all widows and widowers, that they may find in God their support and consolation, and in prayer their new purpose." },
    { "day": 4, "es": "Santa Silvia, que vivías en simplicidad y austeridad mientras tu hijo gobernaba la Iglesia: ayúdame a vivir con sencillez, a no apegar mi corazón a las cosas materiales, y a buscar lo esencial.", "en": "Saint Sylvia, who lived in simplicity and austerity while your son governed the Church: help me to live simply, not to attach my heart to material things, and to seek what is essential." },
    { "day": 5, "es": "Santa Silvia, cuya influencia en Gregorio fue profunda aunque silenciosa: intercede por todos los educadores, catequistas y padres espirituales que forman en la fe a niños y jóvenes, muchas veces sin ver los frutos de su trabajo.", "en": "Saint Sylvia, whose influence on Gregory was profound though silent: intercede for all educators, catechists, and spiritual directors who form children and young people in faith, often without seeing the fruits of their work." },
    { "day": 6, "es": "Santa Silvia, que viviste cerca de la basílica de San Pablo para estar próxima a la oración: enséñame a hacer de la liturgia y los sacramentos el centro de mi vida, y a buscar la presencia de Dios en los lugares sagrados.", "en": "Saint Sylvia, who lived near the Basilica of Saint Paul to remain close to prayer: teach me to make the liturgy and sacraments the center of my life, and to seek God's presence in sacred places." },
    { "day": 7, "es": "Santa Silvia, patrona de las familias cristianas: ruega para que en los hogares del mundo se viva la oración familiar, se lea la Escritura y los padres sean los primeros evangelizadores de sus hijos.", "en": "Saint Sylvia, patron of Christian families: pray that in homes throughout the world family prayer may be lived, Scripture read, and parents may be the first evangelizers of their children." },
    { "day": 8, "es": "Santa Silvia, cuya santidad floreció en el silencio y la vida ordinaria: ayúdame a encontrar la santidad precisamente donde estoy, en mi vida de cada día, y a no buscar grandeza visible sino fidelidad invisible.", "en": "Saint Sylvia, whose holiness blossomed in silence and ordinary life: help me to find holiness precisely where I am, in my daily life, and not to seek visible greatness but invisible faithfulness." },
    { "day": 9, "es": "Santa Silvia, cierro esta novena confiándote a mi familia y a todos los que amo. Intercede por nuestros hogares para que sean lugares de amor, fe y oración. Lleva mis intenciones ante el Señor. Amén.", "en": "Saint Sylvia, I close this novena entrusting my family and all those I love to you. Intercede for our homes that they may be places of love, faith, and prayer. Carry my intentions before the Lord. Amen." }
  ],
  "chaplet": { "available": False, "es": "", "en": "" },
  "litany": {
    "available": True,
    "es": "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad.\nCristo, óyenos. Cristo, escúchanos.\nDios Padre celestial, ten misericordia de nosotros.\nDios Hijo, Redentor del mundo, ten misericordia de nosotros.\nDios Espíritu Santo, ten misericordia de nosotros.\nSantísima Trinidad, un solo Dios, ten misericordia de nosotros.\nSanta María, Madre de Dios, ruega por nosotros.\nSanta Silvia, madre de San Gregorio el Grande, ruega por nosotros.\nSanta Silvia, modelo de maternidad cristiana, ruega por nosotros.\nSanta Silvia, que criaste a tus hijos en la fe, ruega por nosotros.\nSanta Silvia, que abrazaste la austeridad y la penitencia, ruega por nosotros.\nSanta Silvia, viuda consagrada a Dios, ruega por nosotros.\nSanta Silvia, patrona de las madres y las familias santas, ruega por nosotros.\nSanta Silvia, patrona de las que llevan tu nombre, ruega por nosotros.\nCordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.\nOremos. Señor Dios, que en Santa Silvia nos diste un ejemplo de vida familiar santa y de entrega silenciosa: concédenos, por su intercesión, crecer en la santidad de vida cotidiana y ayudar a que nuestra familia sea camino hacia Ti. Por Cristo nuestro Señor. Amén.",
    "en": "Lord, have mercy. Christ, have mercy. Lord, have mercy.\nChrist, hear us. Christ, graciously hear us.\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, one God, have mercy on us.\nHoly Mary, Mother of God, pray for us.\nSaint Sylvia, mother of Saint Gregory the Great, pray for us.\nSaint Sylvia, model of Christian motherhood, pray for us.\nSaint Sylvia, who raised your children in the faith, pray for us.\nSaint Sylvia, who embraced austerity and penance, pray for us.\nSaint Sylvia, widow consecrated to God, pray for us.\nSaint Sylvia, patron of mothers and holy families, pray for us.\nSaint Sylvia, patron of those who bear your name, pray for us.\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\nLet us pray. Lord God, who in Saint Sylvia gave us an example of holy family life and silent self-giving: grant us, through her intercession, to grow in holiness in daily life and to help our family be a path toward you. Through Christ our Lord. Amen."
  },
  "miracles": {
    "available": True,
    "es": "Aunque el registro hagiográfico de Santa Silvia no incluye milagros extraordinarios individuales documentados con la misma precisión que los mártires, la tradición reconoce que su mayor milagro fue la santidad de su hijo Gregorio, quien se convirtió en uno de los cuatro grandes Doctores de la Iglesia latina y en el papa que transformó la liturgia, la evangelización y la organización de la Iglesia en un momento crucial de la historia. Las oraciones y el ejemplo de Silvia son considerados por la tradición el suelo espiritual en que creció esa santidad. Además, numerosos testimonios a lo largo de los siglos, especialmente de madres que llevan el nombre de Silvia y de familias que enfrentan dificultades en la educación de sus hijos, reportan gracias, consolaciones espirituales y situaciones de reconciliación familiar atribuidas a su intercesión. La antigua iglesia de Sant'Andrea in Clivio Scauri en Roma —transformada por Gregorio a partir de la casa familiar— ha sido lugar de veneración a su memoria desde el siglo VI.",
    "en": "Although the hagiographic record of Saint Sylvia does not include individually documented extraordinary miracles with the same precision as martyrs, tradition recognizes that her greatest miracle was the holiness of her son Gregory, who became one of the four great Doctors of the Latin Church and the pope who transformed the liturgy, evangelization, and organization of the Church at a crucial moment in history. Sylvia's prayers and example are considered by tradition the spiritual soil in which that holiness grew. In addition, numerous testimonies over the centuries, especially from mothers who bear the name Sylvia and from families facing difficulties in raising their children, report graces, spiritual consolations, and situations of family reconciliation attributed to her intercession. The ancient Church of Sant'Andrea in Clivio Scauri in Rome — transformed by Gregory from the family home — has been a place of veneration to her memory since the sixth century."
  }
}

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="sv-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#0b0812"/><stop offset="100%" stop-color="#020205"/>
    </radialGradient>
    <radialGradient id="sv-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#5a3a7a" stop-opacity="0.28"/><stop offset="100%" stop-color="#5a3a7a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sv-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#7a50a8" stop-opacity="1"/><stop offset="100%" stop-color="#1a0a30" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sv-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="sv-stola" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a50a8"/><stop offset="100%" stop-color="#2e1050"/>
    </linearGradient>
    <linearGradient id="sv-palla" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a2870"/><stop offset="100%" stop-color="#1a0830"/>
    </linearGradient>
    <filter id="sv-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sv-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#sv-bg)"/>
  <rect width="400" height="600" fill="url(#sv-atm)"/>
  <!-- Stars -->
  <circle cx="55"  cy="32"  r="1.5" fill="#c8b8e0" opacity="0.65"/>
  <circle cx="118" cy="20"  r="1"   fill="#c8b8e0" opacity="0.55"/>
  <circle cx="308" cy="26"  r="1"   fill="#c8b8e0" opacity="0.50"/>
  <circle cx="362" cy="46"  r="1.5" fill="#c8b8e0" opacity="0.60"/>
  <!-- Roman arch background (faint) -->
  <path d="M100,520 L100,300 Q100,220 200,220 Q300,220 300,300 L300,520" fill="none" stroke="#2a1842" stroke-width="28" opacity="0.45"/>
  <path d="M100,520 L100,300 Q100,220 200,220 Q300,220 300,300 L300,520" fill="none" stroke="#3a2252" stroke-width="14" opacity="0.30"/>
  <!-- Rays: violet left, gold right -->
  <polygon points="198,264 -20,610 112,610" fill="url(#sv-r1)" filter="url(#sv-gl)" opacity="0.72"/>
  <polygon points="198,264  25,600  88,600" fill="#7a50a8" opacity="0.34"/>
  <polygon points="202,264 420,610 288,610" fill="url(#sv-r2)" filter="url(#sv-gl)" opacity="0.70"/>
  <polygon points="202,264 372,600 312,600" fill="#f5e060" opacity="0.32"/>
  <!-- Palla (outer mantle, draped over head and shoulders) -->
  <path d="M136,138 Q100,180 98,492 L302,492 Q300,180 264,138 Q232,182 200,184 Q168,182 136,138 Z" fill="url(#sv-palla)" opacity="0.82"/>
  <!-- Stola (inner tunic, violet) -->
  <path d="M156,162 Q138,216 136,480 L264,480 Q262,216 244,162 Q222,178 200,180 Q178,178 156,162 Z" fill="url(#sv-stola)" opacity="0.80"/>
  <!-- Head covering (palla over head) -->
  <path d="M158,126 Q170,98 200,92 Q230,98 242,126 Q228,148 200,150 Q172,148 158,126 Z" fill="url(#sv-palla)" opacity="0.75"/>
  <!-- Closed book held in both hands at chest (dark leather cover, gold clasp) -->
  <rect x="160" y="292" width="80" height="58" rx="5" fill="#2a1808" opacity="0.92"/>
  <rect x="162" y="294" width="76" height="54" rx="4" fill="none" stroke="#c9a84c" stroke-width="1.5" stroke-opacity="0.70"/>
  <!-- Book spine -->
  <line x1="200" y1="292" x2="200" y2="350" stroke="#3a2210" stroke-width="6" opacity="0.60"/>
  <!-- Book clasp (golden) -->
  <rect x="196" y="318" width="8" height="6" rx="2" fill="#c9a84c" opacity="0.90"/>
  <!-- Gold letter on book cover (Scriptura / monogram) -->
  <text x="200" y="332" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="#c9a84c" opacity="0.55" font-style="italic">S</text>
  <!-- Left hand visible holding book -->
  <ellipse cx="152" cy="325" rx="14" ry="9" fill="#d4a878" opacity="0.82"/>
  <!-- Right hand visible holding book -->
  <ellipse cx="248" cy="325" rx="14" ry="9" fill="#d4a878" opacity="0.82"/>
  <!-- Neck area -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4a878" opacity="0.88"/>
  <!-- Face (slightly older, serene matron) -->
  <ellipse cx="200" cy="108" rx="26" ry="29" fill="#d4a878" opacity="0.92"/>
  <!-- Simple head covering line -->
  <path d="M175,95 Q200,84 225,95" stroke="#3a1a58" stroke-width="8" fill="none" opacity="0.45"/>
  <!-- Eyes (serene, downcast slightly — contemplative) -->
  <ellipse cx="189" cy="110" rx="5" ry="3.5" fill="#0e0808"/>
  <ellipse cx="211" cy="110" rx="5" ry="3.5" fill="#0e0808"/>
  <circle cx="190" cy="109" r="1.5" fill="#ffffff" opacity="0.35"/>
  <circle cx="212" cy="109" r="1.5" fill="#ffffff" opacity="0.35"/>
  <!-- Gentle smile lines -->
  <path d="M190,120 Q200,124 210,120" stroke="#c09070" stroke-width="1" fill="none" opacity="0.50"/>
  <!-- Halo rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#sv-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6"  y="6"  width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#030205" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SANTA SILVIA \u00b7 SAINT SYLVIA OF ROME</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#a080d0" font-style="italic">\u00abMadre de San Gregorio el Grande\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abMother of Saint Gregory the Great\u00bb</text>
</svg>
"""

base = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer")
(base / "data" / "santasilvia.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
(base / "assets" / "images" / "santasilvia.svg").write_text(svg, encoding="utf-8")
print(f"Santa Silvia: JSON {(base/'data'/'santasilvia.json').stat().st_size}B, SVG {(base/'assets'/'images'/'santasilvia.svg').stat().st_size}B")
