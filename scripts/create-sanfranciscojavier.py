import json, pathlib

data = {
  "id": "sanfranciscojavier",
  "name": { "es": "San Francisco Javier", "en": "Saint Francis Xavier" },
  "feast_day": { "es": "3 de diciembre", "en": "December 3" },
  "image": "/assets/images/sanfranciscojavier.svg",
  "prayer": {
    "es": "San Francisco Javier, Apóstol de las Indias y del Japón, patrono de las misiones: intercede por nosotros. Tú que dejaste todo por anunciar el Evangelio a los confines de la tierra, que bautizaste a cientos de miles de almas, que moriste en las puertas de China anhelando aún más misión: enciende en nuestros corazones el fuego misionero que ardía en el tuyo. Intercede por los misioneros del mundo, por las Iglesias jóvenes de Asia y África, y por todos los que llevan el nombre de Francisco. San Francisco Javier, ruega por nosotros. Amén.",
    "en": "Saint Francis Xavier, Apostle of the Indies and Japan, patron of missions: intercede for us. You who left everything to proclaim the Gospel to the ends of the earth, who baptized hundreds of thousands of souls, who died at the gates of China still yearning for more mission: kindle in our hearts the missionary fire that burned in yours. Intercede for the missionaries of the world, for the young Churches of Asia and Africa, and for all who bear the name Francis. Saint Francis Xavier, pray for us. Amen."
  },
  "history": {
    "es": "San Francisco Javier nació el 7 de abril de 1506 en el castillo de Javier, en el Reino de Navarra (actual España), en el seno de una familia de la nobleza vasca. Estudió filosofía en la Universidad de París, donde en 1529 conoció a Ignacio de Loyola, quien lo transformó profundamente. Junto a Ignacio y otros cinco compañeros, pronunció en Montmartre (1534) los votos que dieron origen a la Compañía de Jesús. Fue ordenado sacerdote en Venecia en 1537. En 1540, cuando el rey Juan III de Portugal solicitó al Papa misioneros para las Indias Orientales, Ignacio eligió a Francisco Javier. Partió de Lisboa en 1541 y llegó a Goa, en la India, en 1542. Durante once años recorrió un territorio inmenso: recorrió las costas de India (Cabo Comorín, Pescadores), las islas de la Malásia (Maluco, Amboina), y en 1549 llegó a Japón, donde permaneció más de dos años, aprendiendo el idioma y fundando las primeras comunidades cristianas. De regreso a Goa, planeó una misión de gran envergadura a China, el Imperio más poderoso de Oriente. Navegó hacia las costas chinas y llegó a la isla de Sancián (Shangchuan), frente a las costas de Cantón, pero no logró entrar en el continente. Enfermó gravemente y murió el 3 de diciembre de 1552, solo y en la pobreza, a los 46 años, en aquella pequeña isla a las puertas de un mundo que había soñado evangelizar. Se calcula que bautizó a más de 700,000 personas durante su vida misionera —un récord sin precedentes en la historia de las misiones. Su cuerpo fue sepultado provisionalmente en Sancián, pero fue trasladado a Goa, donde se conserva incorrupto en la Basílica del Buen Jesús. Fue beatificado por Paulo V en 1619 y canonizado por Gregorio XV el 12 de marzo de 1622, junto con Ignacio de Loyola, en la que fue conocida como la 'gran canonización'. Fue declarado Patrono de las Misiones por Pío X en 1904 y Patrón Universal de las Misiones por Pío XI en 1927.",
    "en": "Saint Francis Xavier was born on April 7, 1506, at the Castle of Xavier in the Kingdom of Navarre (present-day Spain), in a Basque noble family. He studied philosophy at the University of Paris, where in 1529 he met Ignatius of Loyola, who profoundly transformed him. Together with Ignatius and five other companions, he pronounced at Montmartre (1534) the vows that gave rise to the Society of Jesus. He was ordained a priest in Venice in 1537. In 1540, when King John III of Portugal requested missionaries from the Pope for the East Indies, Ignatius chose Francis Xavier. He departed from Lisbon in 1541 and arrived in Goa, India, in 1542. Over eleven years he covered an immense territory: the coasts of India (Cape Comorin, the Fisheries), the islands of Malasia (Maluku, Ambon), and in 1549 he reached Japan, where he remained for more than two years, learning the language and founding the first Christian communities. Returning to Goa, he planned a major mission to China, the most powerful empire of the East. He sailed toward the Chinese coast and reached the island of Shangchuan, off the coast of Canton, but could not enter the continent. He fell gravely ill and died on December 3, 1552, alone and in poverty, at the age of 46, on that small island at the gates of a world he had dreamed of evangelizing. It is estimated that he baptized more than 700,000 people during his missionary life — an unprecedented record in the history of missions. His body was provisionally buried in Shangchuan, but was transferred to Goa, where it is preserved incorrupt in the Basilica of the Good Jesus. He was beatified by Paul V in 1619 and canonized by Gregory XV on March 12, 1622, together with Ignatius of Loyola, in what was known as the 'great canonization.' He was declared Patron of the Missions by Pius X in 1904 and Universal Patron of the Missions by Pius XI in 1927."
  },
  "novena_prayers": {
    "es": "Dios Padre, que en San Francisco Javier nos diste el más grande misionero de los tiempos modernos: enciende en nosotros el mismo fuego apostólico que lo consumió, para que toda nuestra vida sea proclamación del Evangelio, de palabra y de obra. Por su intercesión, concede vocaciones misioneras a tu Iglesia y lleva la fe de Cristo a todos los rincones de la tierra. Amén.",
    "en": "God the Father, who in Saint Francis Xavier gave us the greatest missionary of modern times: kindle in us the same apostolic fire that consumed him, so that our whole life may be a proclamation of the Gospel in word and deed. Through his intercession, grant missionary vocations to your Church and bring the faith of Christ to every corner of the earth. Amen."
  },
  "novena": [
    { "day": 1, "es": "San Francisco Javier, que dejaste una brillante carrera académica en París para seguir la llamada de Dios: intercede por los universitarios y profesionales a quienes Dios llama a una vida de mayor entrega, para que tengan la valentía de responder como tú.", "en": "Saint Francis Xavier, who left a brilliant academic career in Paris to follow God's call: intercede for the university students and professionals whom God calls to a life of greater dedication, that they may have the courage to respond as you did." },
    { "day": 2, "es": "San Francisco Javier, misionero de India: intercede por la Iglesia en la India y por todos los pueblos de ese inmenso país, para que continúe creciendo la semilla de fe que sembraste y que los misioneros que te siguieron cultivaron.", "en": "Saint Francis Xavier, missionary of India: intercede for the Church in India and for all the peoples of that immense country, that the seed of faith you planted and the missionaries who followed you cultivated may continue to grow." },
    { "day": 3, "es": "San Francisco Javier, apóstol del Japón: intercede por los cristianos de Japón —hoy una pequeña comunidad en una gran nación— y por todos los misioneros en Asia, para que encuentren en tu ejemplo el ánimo para perseverar.", "en": "Saint Francis Xavier, apostle of Japan: intercede for the Christians of Japan — today a small community in a great nation — and for all missionaries in Asia, that they may find in your example the encouragement to persevere." },
    { "day": 4, "es": "San Francisco Javier, que moriste a las puertas de China sin poder entrar: intercede por la Iglesia en China, por los católicos que viven su fe en la clandestinidad y la dificultad, para que Dios les conceda libertad y florecimiento.", "en": "Saint Francis Xavier, who died at the gates of China without being able to enter: intercede for the Church in China, for Catholics who live their faith in secrecy and difficulty, that God may grant them freedom and flourishing." },
    { "day": 5, "es": "San Francisco Javier, que bautizaste a cientos de miles de personas: intercede por todos los que aún no conocen a Cristo, para que encuentren el Evangelio, y por los catequistas y evangelizadores del mundo entero.", "en": "Saint Francis Xavier, who baptized hundreds of thousands of people: intercede for all who do not yet know Christ, that they may encounter the Gospel, and for catechists and evangelizers throughout the world." },
    { "day": 6, "es": "San Francisco Javier, patrono universal de las misiones: intercede por todas las obras misioneras de la Iglesia, por las congregaciones misioneras, por los Pontificios Institutos Misioneros, y por los misioneros laicos que dan su vida por el Evangelio.", "en": "Saint Francis Xavier, universal patron of the missions: intercede for all the missionary works of the Church, for missionary congregations, for the Pontifical Mission Institutes, and for the lay missionaries who give their lives for the Gospel." },
    { "day": 7, "es": "San Francisco Javier, que aprendiste el japonés para predicar el Evangelio en la lengua del pueblo: intercede por los traductores de la Biblia, por los que trabajan en inculturación del Evangelio, y por todos los que superan barreras lingüísticas y culturales para anunciar a Cristo.", "en": "Saint Francis Xavier, who learned Japanese to preach the Gospel in the language of the people: intercede for Bible translators, for those working in the inculturation of the Gospel, and for all who overcome linguistic and cultural barriers to proclaim Christ." },
    { "day": 8, "es": "San Francisco Javier, cuyo cuerpo permanece incorrupto en Goa: intercede por todos los enfermos y moribundos, especialmente los que mueren lejos de casa o en soledad, como tú moriste en Sancián, para que sientan la cercanía de Dios.", "en": "Saint Francis Xavier, whose body remains incorrupt in Goa: intercede for all the sick and dying, especially those who die far from home or in solitude, as you died on Shangchuan, that they may feel God's nearness." },
    { "day": 9, "es": "San Francisco Javier, cierro esta novena con la oración que más te gustaba: 'Te amo, Señor, no por el cielo que me prometiste ni por el infierno que temo, sino porque eres mi Dios.' Inflama mi corazón con ese amor puro. Amén.", "en": "Saint Francis Xavier, I close this novena with the prayer you loved most: 'I love you, Lord, not for the heaven you promised nor for the hell I fear, but because you are my God.' Inflame my heart with that pure love. Amen." }
  ],
  "chaplet": { "available": False, "es": "", "en": "" },
  "litany": {
    "available": True,
    "es": "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad.\nCristo, óyenos. Cristo, escúchanos.\nDios Padre celestial, ten misericordia de nosotros.\nDios Hijo, Redentor del mundo, ten misericordia de nosotros.\nDios Espíritu Santo, ten misericordia de nosotros.\nSantísima Trinidad, un solo Dios, ten misericordia de nosotros.\nSanta María, Estrella de la evangelización, ruega por nosotros.\nSan Francisco Javier, Apóstol de las Indias y el Japón, ruega por nosotros.\nSan Francisco Javier, Patrono Universal de las Misiones, ruega por nosotros.\nSan Francisco Javier, cofundador de la Compañía de Jesús, ruega por nosotros.\nSan Francisco Javier, que bautizaste a más de setecientas mil almas, ruega por nosotros.\nSan Francisco Javier, misionero incansable de Asia, ruega por nosotros.\nSan Francisco Javier, que moriste anhelando evangelizar China, ruega por nosotros.\nSan Francisco Javier, cuyo cuerpo permanece incorrupto, ruega por nosotros.\nSan Francisco Javier, patrono de los misioneros y evangelizadores, ruega por nosotros.\nSan Francisco Javier, modelo de amor a Dios por Dios mismo, ruega por nosotros.\nCordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.\nOremos. Señor nuestro Dios, que en San Francisco Javier encendiste un fuego misionero que transformó pueblos y continentes: por su intercesión, renueva en tu Iglesia el ardor del primer anuncio y suscita nuevos misioneros para nuestra época. Por Cristo nuestro Señor. Amén.",
    "en": "Lord, have mercy. Christ, have mercy. Lord, have mercy.\nChrist, hear us. Christ, graciously hear us.\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, one God, have mercy on us.\nHoly Mary, Star of Evangelization, pray for us.\nSaint Francis Xavier, Apostle of the Indies and Japan, pray for us.\nSaint Francis Xavier, Universal Patron of the Missions, pray for us.\nSaint Francis Xavier, co-founder of the Society of Jesus, pray for us.\nSaint Francis Xavier, who baptized more than seven hundred thousand souls, pray for us.\nSaint Francis Xavier, tireless missionary of Asia, pray for us.\nSaint Francis Xavier, who died yearning to evangelize China, pray for us.\nSaint Francis Xavier, whose body remains incorrupt, pray for us.\nSaint Francis Xavier, patron of missionaries and evangelizers, pray for us.\nSaint Francis Xavier, model of love for God for God's own sake, pray for us.\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\nLet us pray. Lord our God, who in Saint Francis Xavier kindled a missionary fire that transformed peoples and continents: through his intercession, renew in your Church the ardor of the first proclamation and raise up new missionaries for our times. Through Christ our Lord. Amen."
  },
  "miracles": {
    "available": True,
    "es": "Los testimonios de milagros atribuidos a San Francisco Javier son extraordinariamente numerosos y bien documentados. Ya durante su vida se reportaron resurrecciones de muertos, curaciones de enfermos y la conversación en lenguas que él desconocía. En los procesos de beatificación y canonización, los promotores de la fe analizaron decenas de milagros documentados. Su cuerpo, fallecido en 1552, fue enterrado provisionalmente en Sancián y desenterrado meses después encontrándolo incorrupto, con los colores naturales de la piel intactos —lo que fue certificado por numerosos testigos. Al ser trasladado a Goa, el cuerpo continuó en estado de incorrupción y sigue siendo venerado en ese estado hoy, más de cuatro siglos y medio después de su muerte, en la Basílica del Buen Jesús. Este es considerado uno de los casos de incorrupción más célebres y verificados de la historia hagiográfica. Además, se documenta el caso del pescador japonés que fue rescatado de la tormenta al rezar ante el crucifijo de Javier, y el de la mujer de Goa curada de una enfermedad incurable tras aplicar tierra de su tumba. El milagro aprobado para su canonización fue la curación instantánea en 1620 de una mujer desahuciada en Roma, curación que los médicos confirmaron sin explicación natural.",
    "en": "The testimonies of miracles attributed to Saint Francis Xavier are extraordinarily numerous and well documented. Already during his lifetime, resurrections of the dead, cures of the sick, and conversations in languages he did not know were reported. In the beatification and canonization processes, the promoters of the faith analyzed dozens of documented miracles. His body, having died in 1552, was provisionally buried in Shangchuan and exhumed months later found incorrupt, with the natural skin colors intact — certified by numerous witnesses. When transferred to Goa, the body continued in a state of incorruption and is still venerated in that state today, more than four and a half centuries after his death, in the Basilica of the Good Jesus. This is considered one of the most celebrated and verified cases of incorruption in hagiographic history. Also documented is the case of a Japanese fisherman rescued from a storm by praying before Xavier's crucifix, and that of a woman in Goa cured of an incurable disease after applying earth from his tomb. The miracle approved for his canonization was the instantaneous cure in 1620 of a terminally ill woman in Rome, a cure that doctors confirmed had no natural explanation."
  }
}

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="fj-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#060a12"/><stop offset="100%" stop-color="#020306"/>
    </radialGradient>
    <radialGradient id="fj-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#1a3a6a" stop-opacity="0.26"/><stop offset="100%" stop-color="#1a3a6a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fj-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#2848a0" stop-opacity="1"/><stop offset="100%" stop-color="#080c20" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="fj-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="fj-cassock" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#080808"/>
    </linearGradient>
    <filter id="fj-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fj-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#fj-bg)"/>
  <rect width="400" height="600" fill="url(#fj-atm)"/>
  <!-- Stars -->
  <circle cx="50"  cy="30"  r="1.5" fill="#b0c0e0" opacity="0.70"/>
  <circle cx="116" cy="18"  r="1"   fill="#b0c0e0" opacity="0.55"/>
  <circle cx="302" cy="24"  r="1"   fill="#b0c0e0" opacity="0.52"/>
  <circle cx="358" cy="46"  r="1.5" fill="#b0c0e0" opacity="0.65"/>
  <circle cx="38"  cy="78"  r="1"   fill="#b0c0e0" opacity="0.48"/>
  <circle cx="378" cy="72"  r="1"   fill="#b0c0e0" opacity="0.52"/>
  <!-- Faint Asian coastal map silhouette (India / Japan coast) -->
  <path d="M20,520 Q60,480 90,440 Q100,420 120,400 Q140,380 160,390 Q180,395 195,380" fill="none" stroke="#1a3060" stroke-width="2" opacity="0.20"/>
  <path d="M380,520 Q360,488 340,456 Q320,428 300,400 Q280,380 260,390" fill="none" stroke="#1a3060" stroke-width="2" opacity="0.20"/>
  <!-- Small ship silhouette (bottom right) -->
  <path d="M308,480 L308,460 Q320,455 332,460 L332,480 Z" fill="#0e1830" opacity="0.28"/>
  <line x1="320" y1="460" x2="320" y2="440" stroke="#0e1830" stroke-width="2" opacity="0.28"/>
  <path d="M310,448 L320,440 L330,448 Z" fill="#0e1830" opacity="0.22"/>
  <!-- Rays: navy left, gold right -->
  <polygon points="198,264 -20,610 112,610" fill="url(#fj-r1)" filter="url(#fj-gl)" opacity="0.72"/>
  <polygon points="198,264  25,600  88,600" fill="#2848a0" opacity="0.34"/>
  <polygon points="202,264 420,610 288,610" fill="url(#fj-r2)" filter="url(#fj-gl)" opacity="0.70"/>
  <polygon points="202,264 372,600 312,600" fill="#f5e060" opacity="0.32"/>
  <!-- Black Jesuit cassock (main body, simple and austere) -->
  <path d="M154,162 Q122,216 120,492 L280,492 Q278,216 246,162 Q222,178 200,180 Q178,178 154,162 Z" fill="url(#fj-cassock)" opacity="0.90"/>
  <!-- Cassock button line (Jesuit: single row of buttons down front) -->
  <line x1="200" y1="162" x2="200" y2="492" stroke="#282828" stroke-width="2" opacity="0.50"/>
  <circle cx="200" cy="210" r="3" fill="#2a2a2a" opacity="0.70"/>
  <circle cx="200" cy="248" r="3" fill="#2a2a2a" opacity="0.70"/>
  <circle cx="200" cy="286" r="3" fill="#2a2a2a" opacity="0.70"/>
  <!-- White collar (Jesuit collar band) -->
  <rect x="188" y="154" width="24" height="10" rx="4" fill="#e8e8e0" opacity="0.82"/>
  <!-- Left arm raised — holds large crucifix upright (primary symbol) -->
  <path d="M154,192 Q110,226 102,310 Q118,324 136,318 Q138,274 158,216 Z" fill="url(#fj-cassock)" opacity="0.90"/>
  <ellipse cx="108" cy="320" rx="14" ry="10" fill="#d4a878" opacity="0.88"/>
  <!-- Crucifix (prominent, held upright by left hand) -->
  <!-- Cross shaft -->
  <line x1="104" y1="490" x2="104" y2="168" stroke="#8a6020" stroke-width="8" stroke-linecap="round"/>
  <!-- Cross beam -->
  <line x1="76"  y1="226" x2="132" y2="226" stroke="#8a6020" stroke-width="7" stroke-linecap="round"/>
  <!-- Corpus Christi (Christ on the cross) -->
  <ellipse cx="104" cy="210" rx="7" ry="8" fill="#d4a878" opacity="0.90"/>
  <line x1="96"  y1="220" x2="90"  y2="240" stroke="#d4a878" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
  <line x1="112" y1="220" x2="118" y2="240" stroke="#d4a878" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
  <line x1="104" y1="218" x2="104" y2="258" stroke="#d4a878" stroke-width="4" stroke-linecap="round" opacity="0.80"/>
  <!-- Right arm — holds baptismal shell (symbol of mass baptisms) -->
  <path d="M246,192 Q282,226 290,302 Q274,316 258,310 Q260,268 248,218 Z" fill="url(#fj-cassock)" opacity="0.90"/>
  <ellipse cx="286" cy="306" rx="14" ry="10" fill="#d4a878" opacity="0.88"/>
  <!-- Baptismal shell (scallop) -->
  <path d="M268,360 Q286,340 304,360 Q303,382 286,390 Q269,382 268,360 Z" fill="#d8c898" opacity="0.85"/>
  <line x1="278" y1="362" x2="280" y2="388" stroke="#a89060" stroke-width="1.2" opacity="0.60"/>
  <line x1="286" y1="360" x2="286" y2="390" stroke="#a89060" stroke-width="1.2" opacity="0.60"/>
  <line x1="294" y1="362" x2="292" y2="388" stroke="#a89060" stroke-width="1.2" opacity="0.60"/>
  <!-- Water drops from shell (baptism) -->
  <ellipse cx="278" cy="395" rx="2" ry="3" fill="#a0c0e0" opacity="0.55"/>
  <ellipse cx="286" cy="398" rx="2" ry="3" fill="#a0c0e0" opacity="0.50"/>
  <ellipse cx="294" cy="395" rx="2" ry="3" fill="#a0c0e0" opacity="0.48"/>
  <!-- Neck -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4a878" opacity="0.88"/>
  <!-- Head (Xavier: Basque nobleman, strong features, dark hair) -->
  <ellipse cx="200" cy="108" rx="27" ry="30" fill="#d4a878" opacity="0.92"/>
  <!-- Dark Basque hair (medium length, swept back) -->
  <path d="M173,100 Q174,63 200,57 Q226,63 227,100 Q218,74 200,72 Q182,74 173,100 Z" fill="#100808" opacity="0.92"/>
  <!-- Eyes (intense, apostolic gaze — missionary fervor) -->
  <ellipse cx="189" cy="108" rx="5" ry="4" fill="#0e0808"/>
  <ellipse cx="211" cy="108" rx="5" ry="4" fill="#0e0808"/>
  <circle cx="190" cy="107" r="1.5" fill="#ffffff" opacity="0.42"/>
  <circle cx="212" cy="107" r="1.5" fill="#ffffff" opacity="0.42"/>
  <!-- Strong brow -->
  <path d="M181,100 Q188,96 195,100" stroke="#100808" stroke-width="2" fill="none"/>
  <path d="M205,100 Q212,96 219,100" stroke="#100808" stroke-width="2" fill="none"/>
  <!-- Short beard / mustache (Xavier is often shown with beard) -->
  <path d="M188,122 Q200,128 212,122 Q210,132 200,134 Q190,132 188,122 Z" fill="#100808" opacity="0.72"/>
  <!-- Halo rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#fj-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6"  y="6"  width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#020306" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">S. FRANCISCO JAVIER \u00b7 ST. FRANCIS XAVIER</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#6888d0" font-style="italic">\u00abAp\u00f3stol de las Indias y el Jap\u00f3n\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abApostle of the Indies and Japan\u00bb</text>
</svg>
"""

base = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer")
(base / "data" / "sanfranciscojavier.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
(base / "assets" / "images" / "sanfranciscojavier.svg").write_text(svg, encoding="utf-8")
print(f"Francisco Javier: JSON {(base/'data'/'sanfranciscojavier.json').stat().st_size}B, SVG {(base/'assets'/'images'/'sanfranciscojavier.svg').stat().st_size}B")
