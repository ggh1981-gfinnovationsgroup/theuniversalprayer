import json, pathlib

data = {
  "id": "sanpedro",
  "name": { "es": "San Pedro Apóstol", "en": "Saint Peter the Apostle" },
  "feast_day": { "es": "29 de junio", "en": "June 29" },
  "image": "/assets/images/sanpedro.svg",
  "prayer": {
    "es": "San Pedro Apóstol, Príncipe de los Apóstoles, primer Vicario de Cristo en la tierra: intercede por nosotros. Tú que fuiste llamado de tus redes y constituido roca sobre la que se edifica la Iglesia; tú que negaste al Señor y fuiste perdonado y confirmado en el amor; tú que diste tu vida crucificado en Roma por la gloria de Cristo: intercede por el Papa, por la unidad de la Iglesia, y por todos los que llevan el nombre de Pedro. San Pedro, abre para nosotros las puertas de la misericordia de Dios. San Pedro Apóstol, ruega por nosotros. Amén.",
    "en": "Saint Peter the Apostle, Prince of the Apostles, first Vicar of Christ on earth: intercede for us. You who were called from your nets and made a rock upon which the Church is built; you who denied the Lord and were forgiven and confirmed in love; you who gave your life crucified in Rome for the glory of Christ: intercede for the Pope, for the unity of the Church, and for all who bear the name Peter. Saint Peter, open for us the gates of God's mercy. Saint Peter the Apostle, pray for us. Amen."
  },
  "history": {
    "es": "Simón Pedro, hijo de Jonás, nació en Betsaida, junto al lago de Galilea, y vivía como pescador en Cafarnaún cuando fue llamado por Jesús: 'Sígueme, y te haré pescador de hombres' (Mt 4,19). Su hermano Andrés lo llevó primero ante el Señor, quien al verle le dijo: 'Tú eres Simón, hijo de Juan; tú te llamarás Cefas, que quiere decir Piedra' (Jn 1,42). Impulsivo, generoso, a veces temerario, Pedro fue siempre el portavoz del grupo apostólico. Fue el primero en confesar a Jesús como el Mesías: 'Tú eres el Cristo, el Hijo del Dios vivo' (Mt 16,16), y ante esa confesión Jesús le prometió: 'Sobre esta piedra edificaré mi Iglesia'. En la Última Cena, Pedro prometió dar su vida por Jesús y, pocas horas después, lo negó tres veces. Sin embargo, ese mismo Pedro fue el primero en correr al sepulcro vacío en la mañana de Pascua, y el primero al que Jesús se apareció personalmente según la tradición. Junto al lago, el Resucitado restauró a Pedro con la triple pregunta del amor: '¿Me amas?', confiándole el cuidado de toda la grey: 'Apacienta mis corderos, apacienta mis ovejas' (Jn 21,15-17). En Pentecostés, Pedro pronunció el primer discurso apostólico y bautizó a unas tres mil personas. Realizó numerosos milagros: curó al cojo de nacimiento en la puerta del Templo (Hch 3), resucitó a Tabita (Hch 9), y su sombra sanaba a los enfermos (Hch 5). Fue el primero en abrir el Evangelio a los gentiles al bautizar al centurión Cornelio (Hch 10). Presidió el primer Concilio de Jerusalén (Hch 15). Fundó la Iglesia de Antioquía y finalmente fue a Roma, donde presidió la comunidad cristiana como primer obispo de la ciudad. Bajo la persecución del emperador Nerón, fue arrestado y condenado a muerte. Según la tradición universal de la Iglesia, fue crucificado con la cabeza hacia abajo —por petición propia, por no considerarse digno de morir como su Señor— entre los años 64 y 68 en el circo de Nerón, en el lugar donde se levanta actualmente la Basílica de San Pedro en el Vaticano. Sus restos fueron hallados bajo el altar mayor de la Basílica por excavaciones arqueológicas realizadas entre 1939 y 1949, confirmando la antiquísima tradición que los situaba allí. Es el primer Papa, cabeza visible de la Iglesia Católica, y su sucesor es el Papa reinante. Es patrono de los pescadores, de los papas, de los porteros, y de numerosas ciudades y diócesis en todo el mundo. Su fiesta, el 29 de junio, es compartida con San Pablo Apóstol.",
    "en": "Simon Peter, son of Jonah, was born in Bethsaida, beside the Sea of Galilee, and lived as a fisherman in Capernaum when Jesus called him: 'Follow me, and I will make you fishers of men' (Mt 4:19). His brother Andrew first brought him to the Lord, who said upon seeing him: 'You are Simon, son of John; you shall be called Cephas, which means Rock' (Jn 1:42). Impulsive, generous, sometimes rash, Peter was always the spokesman of the apostolic group. He was the first to confess Jesus as the Messiah: 'You are the Christ, the Son of the living God' (Mt 16:16), and before that confession Jesus promised him: 'Upon this rock I will build my Church.' At the Last Supper, Peter promised to give his life for Jesus and, a few hours later, denied him three times. Yet that same Peter was the first to run to the empty tomb on Easter morning, and the first to whom Jesus appeared personally according to tradition. By the lake, the Risen Lord restored Peter with the triple question of love: 'Do you love me?', entrusting him with the care of the whole flock: 'Feed my lambs, feed my sheep' (Jn 21:15–17). At Pentecost, Peter delivered the first apostolic discourse and baptized about three thousand people. He performed numerous miracles: he healed the man lame from birth at the Temple gate (Acts 3), raised Tabitha from the dead (Acts 9), and his very shadow healed the sick (Acts 5). He was the first to open the Gospel to the Gentiles by baptizing the centurion Cornelius (Acts 10). He presided over the first Council of Jerusalem (Acts 15). He founded the Church of Antioch and finally went to Rome, where he presided over the Christian community as the first bishop of the city. Under the persecution of Emperor Nero, he was arrested and condemned to death. According to the universal tradition of the Church, he was crucified head downward — at his own request, because he did not consider himself worthy to die as his Lord — between the years 64 and 68 in the circus of Nero, on the site where the Basilica of Saint Peter in the Vatican now stands. His remains were found under the main altar of the Basilica by archaeological excavations carried out between 1939 and 1949, confirming the ancient tradition that placed them there. He is the first Pope, visible head of the Catholic Church, and his successor is the reigning Pope. He is patron of fishermen, popes, gatekeepers, and numerous cities and dioceses throughout the world. His feast, on June 29, is shared with Saint Paul the Apostle."
  },
  "novena_prayers": {
    "es": "Señor Jesucristo, que elegiste a Simón Pedro como roca y fundamento de tu Iglesia y le encomendaste el cuidado de tu grey: por la intercesión de San Pedro Apóstol, guarda a tu Iglesia en la unidad, fortalece al Papa en su ministerio, y ayúdanos a todos a confesar con Pedro: 'Tú eres el Cristo, el Hijo del Dios vivo.' Amén.",
    "en": "Lord Jesus Christ, who chose Simon Peter as rock and foundation of your Church and entrusted him with the care of your flock: through the intercession of Saint Peter the Apostle, keep your Church in unity, strengthen the Pope in his ministry, and help us all to confess with Peter: 'You are the Christ, the Son of the living God.' Amen."
  },
  "novena": [
    { "day": 1, "es": "San Pedro, que dejaste tus redes al primer llamado de Jesús: intercede por los que aún no han respondido a la llamada de Cristo, y ayúdame a mí a renovar hoy mi 'sí' definitivo al Señor.", "en": "Saint Peter, who left your nets at Jesus's first call: intercede for those who have not yet responded to Christ's call, and help me to renew today my definitive 'yes' to the Lord." },
    { "day": 2, "es": "San Pedro, que caminaste sobre el agua con la mirada puesta en Jesús y comenzaste a hundirte cuando miraste las olas: ayúdame a mantener la mirada en Cristo en los momentos de duda, miedo o crisis de fe, y a clamar como tú: 'Señor, sálvame'.", "en": "Saint Peter, who walked on water with your gaze fixed on Jesus and began to sink when you looked at the waves: help me to keep my gaze on Christ in moments of doubt, fear, or faith crisis, and to cry out as you did: 'Lord, save me.'" },
    { "day": 3, "es": "San Pedro, que confesaste a Jesús como el Cristo y recibiste las llaves del Reino: intercede por el Papa, sucesor tuyo en la cátedra de Roma, para que guíe a la Iglesia con sabiduría, valentía y fidelidad al Evangelio.", "en": "Saint Peter, who confessed Jesus as the Christ and received the keys of the Kingdom: intercede for the Pope, your successor on the chair of Rome, that he may guide the Church with wisdom, courage, and fidelity to the Gospel." },
    { "day": 4, "es": "San Pedro, que negaste a Jesús tres veces y fuiste perdonado y confirmado en el amor: intercede por todos los que han renegado de su fe, para que, como tú, encuentren la misericordia de Dios que restaura y no condena.", "en": "Saint Peter, who denied Jesus three times and were forgiven and confirmed in love: intercede for all who have denied their faith, that, like you, they may find God's mercy that restores and does not condemn." },
    { "day": 5, "es": "San Pedro, que en Pentecostés proclamaste la Resurrección y bautizaste a tres mil personas en un solo día: intercede por la nueva evangelización, para que la Iglesia proclame a Cristo Resucitado con frescura, valentía y poder del Espíritu.", "en": "Saint Peter, who at Pentecost proclaimed the Resurrection and baptized three thousand people in a single day: intercede for the new evangelization, that the Church may proclaim the Risen Christ with freshness, courage, and the power of the Spirit." },
    { "day": 6, "es": "San Pedro, que fuiste el primero en abrir el Evangelio a los gentiles: intercede por la unidad de la Iglesia y por el diálogo ecuménico e interreligioso, para que todos los hombres encuentren su camino hacia el único Dios.", "en": "Saint Peter, who were the first to open the Gospel to the Gentiles: intercede for the unity of the Church and for ecumenical and interreligious dialogue, that all people may find their way to the one God." },
    { "day": 7, "es": "San Pedro, que fuiste liberado de la prisión por un ángel: intercede por todos los que están presos —en cárceles físicas o en prisiones del alma, de la adicción o del pecado— para que el poder de Dios rompa sus cadenas.", "en": "Saint Peter, who were freed from prison by an angel: intercede for all who are imprisoned — in physical jails or in the prisons of the soul, of addiction, or of sin — that the power of God may break their chains." },
    { "day": 8, "es": "San Pedro, que pediste ser crucificado con la cabeza hacia abajo por humildad: enséñame la humildad del servicio. Ayúdame a servir a los demás sin buscar reconocimiento, a ser el último para poder ser instrumento de Cristo en el mundo.", "en": "Saint Peter, who asked to be crucified head downward out of humility: teach me the humility of service. Help me to serve others without seeking recognition, to be last in order to be an instrument of Christ in the world." },
    { "day": 9, "es": "San Pedro, Príncipe de los Apóstoles, portero del cielo: como tú recibiste las llaves del Reino, intercede por mí para que las puertas de la misericordia de Dios estén abiertas para mí y para todos los que amo. Lleva mis intenciones al Señor. Amén.", "en": "Saint Peter, Prince of the Apostles, keeper of the gates of heaven: as you received the keys of the Kingdom, intercede for me that the gates of God's mercy may be open for me and for all those I love. Carry my intentions to the Lord. Amen." }
  ],
  "chaplet": { "available": False, "es": "", "en": "" },
  "litany": {
    "available": True,
    "es": "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad.\nCristo, óyenos. Cristo, escúchanos.\nDios Padre celestial, ten misericordia de nosotros.\nDios Hijo, Redentor del mundo, ten misericordia de nosotros.\nDios Espíritu Santo, ten misericordia de nosotros.\nSantísima Trinidad, un solo Dios, ten misericordia de nosotros.\nSanta María, Reina de los Apóstoles, ruega por nosotros.\nSan Pedro Apóstol, Príncipe de los Apóstoles, ruega por nosotros.\nSan Pedro, primera roca de la Iglesia de Cristo, ruega por nosotros.\nSan Pedro, a quien Jesús confió las llaves del Reino, ruega por nosotros.\nSan Pedro, primer Papa y Obispo de Roma, ruega por nosotros.\nSan Pedro, que caminaste sobre el agua hacia Cristo, ruega por nosotros.\nSan Pedro, que fuiste perdonado y confirmado en el amor, ruega por nosotros.\nSan Pedro, que proclamaste la Resurrección en Pentecostés, ruega por nosotros.\nSan Pedro, que realizaste milagros en nombre de Jesucristo, ruega por nosotros.\nSan Pedro, que fuiste crucificado por Cristo en Roma, ruega por nosotros.\nSan Pedro, patrono de los pescadores y los marineros, ruega por nosotros.\nSan Pedro, portero del cielo, ruega por nosotros.\nCordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.\nOremos. Señor nuestro Dios, que sobre San Pedro, el pescador de Galilea, edificaste tu santa Iglesia: por su intercesión, confirma nuestra fe, fortalece la unidad de tu Iglesia y guía al Papa en el camino de la verdad y el amor. Por Cristo nuestro Señor. Amén.",
    "en": "Lord, have mercy. Christ, have mercy. Lord, have mercy.\nChrist, hear us. Christ, graciously hear us.\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, one God, have mercy on us.\nHoly Mary, Queen of the Apostles, pray for us.\nSaint Peter the Apostle, Prince of the Apostles, pray for us.\nSaint Peter, first rock of the Church of Christ, pray for us.\nSaint Peter, to whom Jesus entrusted the keys of the Kingdom, pray for us.\nSaint Peter, first Pope and Bishop of Rome, pray for us.\nSaint Peter, who walked on water toward Christ, pray for us.\nSaint Peter, who were forgiven and confirmed in love, pray for us.\nSaint Peter, who proclaimed the Resurrection at Pentecost, pray for us.\nSaint Peter, who performed miracles in the name of Jesus Christ, pray for us.\nSaint Peter, who were crucified for Christ in Rome, pray for us.\nSaint Peter, patron of fishermen and sailors, pray for us.\nSaint Peter, keeper of the gates of heaven, pray for us.\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\nLet us pray. Lord our God, who upon Saint Peter, the fisherman of Galilee, built your holy Church: through his intercession, confirm our faith, strengthen the unity of your Church, and guide the Pope in the way of truth and love. Through Christ our Lord. Amen."
  },
  "miracles": {
    "available": True,
    "es": "Los Hechos de los Apóstoles narran los milagros de San Pedro con detalle notable. En la puerta del Templo de Jerusalén llamada 'la Hermosa', Pedro curó a un hombre que llevaba más de cuarenta años lisiado de nacimiento, con las palabras: 'No tengo plata ni oro; pero lo que tengo te doy: en nombre de Jesucristo de Nazaret, levántate y camina' (Hch 3,6). En Lida curó a Eneas, quien llevaba ocho años postrado en cama por una parálisis. En Jafa resucitó a Tabita (Dorcas), una discípula conocida por sus obras de caridad, quien había muerto —poniéndose de rodillas, rezó, y le dijo: 'Tabita, levántate' (Hch 9,40). Tal era la fama de sus milagros que la gente sacaba a los enfermos a las plazas para que al pasar Pedro, su sombra cayera sobre ellos y los sanara (Hch 5,15). Fue liberado de la cárcel milagrosamente dos veces: una por el ángel que le abrió las puertas de la prisión de Herodes (Hch 12). El descubrimiento arqueológico de sus restos bajo el altar mayor de la Basílica de San Pedro (confirmado por el Papa Pablo VI en 1968 tras estudios minuciosos) es considerado por muchos como una confirmación histórica de la autenticidad de la tradición que lo llevó a Roma y al martirio. A lo largo de la historia, la tumba de San Pedro ha sido escenario de innumerables gracias, conversiones y curaciones atribuidas a su intercesión.",
    "en": "The Acts of the Apostles narrate the miracles of Saint Peter with remarkable detail. At the gate of the Jerusalem Temple called 'the Beautiful Gate,' Peter healed a man who had been lame from birth for more than forty years, with the words: 'Silver and gold I have none; but what I have I give you: in the name of Jesus Christ of Nazareth, rise up and walk' (Acts 3:6). In Lydda he healed Aeneas, who had been bedridden for eight years with paralysis. In Joppa he raised Tabitha (Dorcas) from the dead — a disciple known for her works of charity, who had died — kneeling in prayer and saying to her: 'Tabitha, arise' (Acts 9:40). Such was the fame of his miracles that people would bring the sick out to the squares so that as Peter passed by, his shadow might fall on them and heal them (Acts 5:15). He was miraculously freed from prison twice: once by the angel who opened the doors of Herod's prison (Acts 12). The archaeological discovery of his remains beneath the main altar of Saint Peter's Basilica (confirmed by Pope Paul VI in 1968 after meticulous studies) is considered by many as a historical confirmation of the authenticity of the tradition that brought him to Rome and martyrdom. Throughout history, the tomb of Saint Peter has been the setting for countless graces, conversions, and healings attributed to his intercession."
  }
}

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="spt-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#080c14"/><stop offset="100%" stop-color="#020306"/>
    </radialGradient>
    <radialGradient id="spt-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#1a3a7a" stop-opacity="0.26"/><stop offset="100%" stop-color="#1a3a7a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="spt-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#2a50a0" stop-opacity="1"/><stop offset="100%" stop-color="#080e28" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="spt-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="spt-mantle" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c87020"/><stop offset="100%" stop-color="#603008"/>
    </linearGradient>
    <linearGradient id="spt-robe" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a50a0"/><stop offset="100%" stop-color="#0a1840"/>
    </linearGradient>
    <filter id="spt-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="spt-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#spt-bg)"/>
  <rect width="400" height="600" fill="url(#spt-atm)"/>
  <!-- Stars -->
  <circle cx="48"  cy="28"  r="1.5" fill="#b8c8e8" opacity="0.70"/>
  <circle cx="112" cy="16"  r="1"   fill="#b8c8e8" opacity="0.55"/>
  <circle cx="298" cy="22"  r="1"   fill="#b8c8e8" opacity="0.52"/>
  <circle cx="356" cy="44"  r="1.5" fill="#b8c8e8" opacity="0.65"/>
  <circle cx="36"  cy="76"  r="1"   fill="#b8c8e8" opacity="0.48"/>
  <circle cx="376" cy="70"  r="1"   fill="#b8c8e8" opacity="0.52"/>
  <!-- Subtle water / Sea of Galilee background -->
  <path d="M0,410 Q100,390 200,408 Q300,388 400,408 L400,525 L0,525 Z" fill="#0a1428" opacity="0.45"/>
  <path d="M0,430 Q60,418 130,428 Q200,412 270,425 Q340,414 400,426 L400,525 L0,525 Z" fill="#0e1c38" opacity="0.30"/>
  <!-- Inverted cross (very subtle, Peter's martyrdom symbol) -->
  <line x1="200" y1="400" x2="200" y2="500" stroke="#1a3070" stroke-width="4" opacity="0.18"/>
  <line x1="172" y1="420" x2="228" y2="420" stroke="#1a3070" stroke-width="4" opacity="0.18"/>
  <!-- Rays: blue left, gold right -->
  <polygon points="198,264 -20,610 112,610" fill="url(#spt-r1)" filter="url(#spt-gl)" opacity="0.72"/>
  <polygon points="198,264  25,600  88,600" fill="#2a50a0" opacity="0.34"/>
  <polygon points="202,264 420,610 288,610" fill="url(#spt-r2)" filter="url(#spt-gl)" opacity="0.70"/>
  <polygon points="202,264 372,600 312,600" fill="#f5e060" opacity="0.32"/>
  <!-- Orange-ochre outer mantle (Peter's traditional outer cloak) -->
  <path d="M110,216 Q128,206 160,200 L158,492 Q120,478 108,446 Z" fill="url(#spt-mantle)" opacity="0.80"/>
  <path d="M290,216 Q272,206 240,200 L242,492 Q280,478 292,446 Z" fill="url(#spt-mantle)" opacity="0.80"/>
  <!-- Blue apostle robe (chiton) -->
  <path d="M158,162 Q132,214 130,492 L270,492 Q268,214 242,162 Q220,178 200,180 Q180,178 158,162 Z" fill="url(#spt-robe)" opacity="0.86"/>
  <!-- Left arm — holds large scroll (Gospel/Epistles) -->
  <path d="M158,192 Q118,232 114,308 Q128,320 144,314 Q148,272 164,220 Z" fill="url(#spt-mantle)" opacity="0.80"/>
  <ellipse cx="120" cy="318" rx="14" ry="10" fill="#d4a878" opacity="0.88"/>
  <!-- Scroll in left hand -->
  <rect x="94" y="302" width="36" height="52" rx="8" fill="#d8c898" opacity="0.88"/>
  <rect x="94" y="302" width="36" height="6" rx="3" fill="#a89060" opacity="0.80"/>
  <rect x="94" y="348" width="36" height="6" rx="3" fill="#a89060" opacity="0.80"/>
  <line x1="106" y1="308" x2="106" y2="348" stroke="#8a7040" stroke-width="0.8" opacity="0.50"/>
  <line x1="114" y1="308" x2="114" y2="348" stroke="#8a7040" stroke-width="0.8" opacity="0.50"/>
  <line x1="122" y1="308" x2="122" y2="348" stroke="#8a7040" stroke-width="0.8" opacity="0.45"/>
  <!-- Right arm raised — holding two crossed gold keys (THE Peter symbol) -->
  <path d="M242,192 Q276,226 282,300 Q268,312 254,306 Q258,264 244,216 Z" fill="url(#spt-mantle)" opacity="0.80"/>
  <ellipse cx="278" cy="306" rx="14" ry="10" fill="#d4a878" opacity="0.88"/>
  <!-- KEY 1: gold, blade upper right, shaft lower left (foreground) -->
  <line x1="252" y1="380" x2="296" y2="248" stroke="#c9a030" stroke-width="9" stroke-linecap="round"/>
  <circle cx="298" cy="244" r="16" fill="none" stroke="#c9a030" stroke-width="8"/>
  <line x1="284" y1="278" x2="296" y2="268" stroke="#c9a030" stroke-width="6" stroke-linecap="round"/>
  <line x1="276" y1="294" x2="288" y2="284" stroke="#c9a030" stroke-width="6" stroke-linecap="round"/>
  <!-- KEY 2: silver-gold, blade upper left, shaft lower right (background) -->
  <line x1="248" y1="380" x2="204" y2="248" stroke="#e8d880" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
  <circle cx="202" cy="244" r="14" fill="none" stroke="#e8d880" stroke-width="7" opacity="0.85"/>
  <line x1="214" y1="278" x2="202" y2="268" stroke="#e8d880" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
  <line x1="222" y1="294" x2="210" y2="284" stroke="#e8d880" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
  <!-- Neck -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4a878" opacity="0.88"/>
  <!-- Head (Peter: older fisherman, strong features, curly/wavy grey-dark hair) -->
  <ellipse cx="200" cy="108" rx="27" ry="30" fill="#d4a878" opacity="0.92"/>
  <!-- Wavy hair (mix of grey-dark: fisherman aged ~50-60) -->
  <path d="M173,100 Q174,63 200,57 Q226,63 227,100 Q218,74 200,72 Q182,74 173,100 Z" fill="#302820" opacity="0.85"/>
  <!-- Short beard (Peter traditionally shown with full beard) -->
  <path d="M178,128 Q186,140 200,143 Q214,140 222,128 Q216,136 200,138 Q184,136 178,128 Z" fill="#302820" opacity="0.82"/>
  <!-- Eyes (resolute, experienced gaze) -->
  <ellipse cx="189" cy="109" rx="5" ry="4" fill="#0e0808"/>
  <ellipse cx="211" cy="109" rx="5" ry="4" fill="#0e0808"/>
  <circle cx="190" cy="108" r="1.5" fill="#ffffff" opacity="0.40"/>
  <circle cx="212" cy="108" r="1.5" fill="#ffffff" opacity="0.40"/>
  <!-- Strong brow -->
  <path d="M181,100 Q188,96 195,100" stroke="#302820" stroke-width="2.2" fill="none"/>
  <path d="M205,100 Q212,96 219,100" stroke="#302820" stroke-width="2.2" fill="none"/>
  <!-- Halo rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#spt-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6"  y="6"  width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#020306" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SAN PEDRO AP\u00d3STOL \u00b7 SAINT PETER</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#6888d0" font-style="italic">\u00abPr\u00edncipe de los Ap\u00f3stoles, Primer Papa\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abPrince of the Apostles, First Pope\u00bb</text>
</svg>
"""

base = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer")
(base / "data" / "sanpedro.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
(base / "assets" / "images" / "sanpedro.svg").write_text(svg, encoding="utf-8")
print(f"San Pedro: JSON {(base/'data'/'sanpedro.json').stat().st_size}B, SVG {(base/'assets'/'images'/'sanpedro.svg').stat().st_size}B")
