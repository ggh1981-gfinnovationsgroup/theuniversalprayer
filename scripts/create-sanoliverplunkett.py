import json, pathlib

data = {
  "id": "sanoliverplunkett",
  "name": { "es": "San Oliver Plunkett", "en": "Saint Oliver Plunkett" },
  "feast_day": { "es": "1 de julio", "en": "July 1" },
  "image": "/assets/images/sanoliverplunkett.svg",
  "prayer": {
    "es": "San Oliver Plunkett, arzobispo mártir de Irlanda, patrón de la paz y de la unidad: intercede por nosotros ante Dios. Tú que gobernaste tu diócesis en tiempos de persecución, que reconstruiste la Iglesia con valentía, y que diste tu vida antes que traicionar la fe: ayúdanos a ser fieles a Cristo sin importar el costo. Ruega por la paz en Irlanda, en la Iglesia y en el mundo entero. Patrono de todos los Oliver y de quienes sufren por su fe, intercede por nosotros. San Oliver Plunkett, ruega por nosotros. Amén.",
    "en": "Saint Oliver Plunkett, martyr Archbishop of Ireland, patron of peace and unity: intercede for us before God. You who governed your diocese in times of persecution, who rebuilt the Church with courage, and who gave your life rather than betray the faith: help us to be faithful to Christ no matter the cost. Pray for peace in Ireland, in the Church, and throughout the world. Patron of all the Olivers and of those who suffer for their faith, intercede for us. Saint Oliver Plunkett, pray for us. Amen."
  },
  "history": {
    "es": "San Oliver Plunkett nació el 1 de noviembre de 1625 en Loughcrew, condado de Meath, Irlanda, en el seno de una familia noble angloirlandesa. Desde joven mostró una vocación sacerdotal profunda y fue enviado a Roma para estudiar en el Colegio Irlandés, donde se ordenó sacerdote en 1654. Permaneció en Roma por más de una década, ejerciendo como profesor de teología y apología. En 1669, el Papa Clemente IX lo nombró Arzobispo de Armagh y Primado de toda Irlanda, cargo que aceptó con humildad y que ejerció en condiciones extraordinariamente difíciles. Irlanda vivía bajo la persecución protestante inglesa, que prohibía la práctica del catolicismo, la ordenación de sacerdotes y el ejercicio episcopal. Oliver viajó de incógnito, a menudo con nombre falso, para ordenar sacerdotes, confirmar a miles de fieles, convocar sínodos y reorganizar la Iglesia irlandesa. Se calcula que confirmó a más de cien mil personas durante su ministerio clandestino. En 1678 estalló el llamado 'complot papista' de Titus Oates, que acusó falsamente a los católicos de conspirar para asesinar al rey Carlos II. La histeria que siguió fue aprovechada para arrestar a Oliver Plunkett en 1679, acusado de traición por supuestamente organizar una invasión francesa de Irlanda. A pesar de la absoluta falsedad de los cargos —incluso los testigos protestantes irlandeses se negaron a testificar contra él—, fue trasladado a Londres donde el ambiente era más favorable a su condena. Tras un juicio profundamente injusto, fue declarado culpable y sentenciado a muerte. El 1 de julio de 1681 fue arrastrado, ahorcado y descuartizado en Tyburn, Londres. Fue el último católico ejecutado por su fe en Inglaterra. Sus restos fueron venerados como reliquias. Su cabeza es conservada como reliquia en la iglesia de San Pedro en Drogheda, Irlanda. Fue beatificado por Benedicto XV en 1920 y canonizado por el Papa Pablo VI el 12 de octubre de 1975, convirtiéndose en el primer irlandés en ser canonizado en más de seis siglos.",
    "en": "Saint Oliver Plunkett was born on November 1, 1625, in Loughcrew, County Meath, Ireland, into a noble Anglo-Irish family. From a young age he showed a deep priestly vocation and was sent to Rome to study at the Irish College, where he was ordained a priest in 1654. He remained in Rome for more than a decade, serving as a professor of theology and apologetics. In 1669, Pope Clement IX appointed him Archbishop of Armagh and Primate of All Ireland, a position he accepted with humility and exercised under extraordinarily difficult conditions. Ireland lived under English Protestant persecution, which prohibited the practice of Catholicism, the ordination of priests, and the exercise of episcopal office. Oliver traveled in disguise, often under a false name, to ordain priests, confirm thousands of the faithful, convene synods, and reorganize the Irish Church. It is estimated that he confirmed more than one hundred thousand people during his clandestine ministry. In 1678 the so-called 'Popish Plot' of Titus Oates erupted, which falsely accused Catholics of conspiring to assassinate King Charles II. The hysteria that followed was used to arrest Oliver Plunkett in 1679, charged with treason for supposedly organizing a French invasion of Ireland. Despite the absolute falsity of the charges — even Protestant Irish witnesses refused to testify against him — he was transferred to London where the atmosphere was more favorable to his conviction. After a profoundly unjust trial, he was found guilty and sentenced to death. On July 1, 1681, he was dragged, hanged, and quartered at Tyburn, London. He was the last Catholic executed for his faith in England. His remains were venerated as relics. His head is preserved as a relic in the Church of Saint Peter in Drogheda, Ireland. He was beatified by Benedict XV in 1920 and canonized by Pope Paul VI on October 12, 1975, becoming the first Irish person canonized in more than six centuries."
  },
  "novena_prayers": {
    "es": "Dios misericordioso, que diste a San Oliver Plunkett la gracia de pastorear a tu pueblo con valentía en tiempos de persecución y de morir como mártir por la fe: por su intercesión, concede a tu Iglesia fortaleza en los momentos de prueba, y a todos nosotros la fidelidad que no cede ante ninguna presión del mundo. Amén.",
    "en": "Merciful God, who gave Saint Oliver Plunkett the grace to shepherd your people with courage in times of persecution and to die as a martyr for the faith: through his intercession, grant your Church strength in times of trial, and all of us the faithfulness that yields to no worldly pressure. Amen."
  },
  "novena": [
    { "day": 1, "es": "San Oliver Plunkett, que recientemente fuiste enviado desde Roma para reconstruir la Iglesia en Irlanda: intercede por la Iglesia en todos los lugares donde está perseguida o debilitada, para que encuentre pastores valientes y fieles que la conduzcan con amor.", "en": "Saint Oliver Plunkett, sent from Rome to rebuild the Church in Ireland: intercede for the Church in all the places where it is persecuted or weakened, that it may find courageous and faithful shepherds who will lead it with love." },
    { "day": 2, "es": "San Oliver, que confirmaste a más de cien mil fieles en condiciones clandestinas: ruega por todos los que no han recibido los sacramentos, y por los que trabajan para llevar la fe a quienes la desconocen.", "en": "Saint Oliver, who confirmed more than one hundred thousand faithful under clandestine conditions: pray for all who have not received the sacraments, and for those who work to bring the faith to those who do not know it." },
    { "day": 3, "es": "San Oliver, que siempre trabajaste por la reconciliación entre comunidades en conflicto en Irlanda: intercede por la paz en todas las naciones divididas por el odio, la violencia o la historia, para que encuentren el camino del diálogo y la reconciliación.", "en": "Saint Oliver, who always worked for reconciliation between conflicting communities in Ireland: intercede for peace in all nations divided by hatred, violence, or history, that they may find the path of dialogue and reconciliation." },
    { "day": 4, "es": "San Oliver, que fuiste arrestado por denuncias falsas y juzgado injustamente: intercede por los presos injustamente encarcelados, por los que han sido víctimas de calumnia, y por todos los que buscan justicia ante sistemas corruptos.", "en": "Saint Oliver, arrested on false accusations and judged unjustly: intercede for the unjustly imprisoned, for those who have been victims of slander, and for all who seek justice before corrupt systems." },
    { "day": 5, "es": "San Oliver, que mantuviste la serenidad y la dignidad durante tu injusto proceso: ayúdame a mantener la paz interior y la confianza en Dios cuando enfrento situaciones injustas, conflictos no resueltos o angustias que no puedo controlar.", "en": "Saint Oliver, who maintained serenity and dignity throughout your unjust trial: help me to maintain inner peace and trust in God when I face unjust situations, unresolved conflicts, or anxieties I cannot control." },
    { "day": 6, "es": "San Oliver, que dijiste al enfrentar la muerte: 'Bendito sea Dios en todas sus disposiciones': enséñame a aceptar con fe la voluntad de Dios también en los momentos más oscuros y dolorosos de mi vida.", "en": "Saint Oliver, who said when facing death: 'Blessed be God in all his dispositions': teach me to accept God's will with faith even in the darkest and most painful moments of my life." },
    { "day": 7, "es": "San Oliver, que perdonaste públicamente a tus acusadores antes de morir: dame la gracia del perdón. Ayúdame a librarme del rencor, la amargura y la sed de venganza, siguiendo el ejemplo de Cristo en la cruz.", "en": "Saint Oliver, who publicly forgave your accusers before dying: give me the grace of forgiveness. Help me to free myself from resentment, bitterness, and the desire for revenge, following the example of Christ on the cross." },
    { "day": 8, "es": "San Oliver, último mártir católico de Inglaterra: ruega por la unidad de los cristianos, para que las divisiones históricas sean sanadas y todos los discípulos de Cristo encuentren el camino hacia la plena comunión.", "en": "Saint Oliver, last Catholic martyr of England: pray for the unity of Christians, that the historical divisions may be healed and all of Christ's disciples may find the path to full communion." },
    { "day": 9, "es": "San Oliver Plunkett, concluyo esta novena depositando en tus manos mi intención más profunda. Como tú confiaste en Dios hasta el final, ayúdame a confiar también yo. Ruega por Irlanda, por la Iglesia y por mí. Amén.", "en": "Saint Oliver Plunkett, I conclude this novena placing in your hands my deepest intention. As you trusted in God to the very end, help me to trust as well. Pray for Ireland, for the Church, and for me. Amen." }
  ],
  "chaplet": { "available": False, "es": "", "en": "" },
  "litany": {
    "available": True,
    "es": "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad.\nCristo, óyenos. Cristo, escúchanos.\nDios Padre celestial, ten misericordia de nosotros.\nDios Hijo, Redentor del mundo, ten misericordia de nosotros.\nDios Espíritu Santo, ten misericordia de nosotros.\nSantísima Trinidad, un solo Dios, ten misericordia de nosotros.\nSanta María, Madre de la Iglesia, ruega por nosotros.\nSan Oliver Plunkett, glorioso mártir de Irlanda, ruega por nosotros.\nSan Oliver Plunkett, Arzobispo de Armagh, ruega por nosotros.\nSan Oliver Plunkett, Primado de toda Irlanda, ruega por nosotros.\nSan Oliver Plunkett, pastor de la Iglesia perseguida, ruega por nosotros.\nSan Oliver Plunkett, que confirmaste a miles de fieles en la clandestinidad, ruega por nosotros.\nSan Oliver Plunkett, defensor de la fe en tierra hostil, ruega por nosotros.\nSan Oliver Plunkett, que perdonaste a tus enemigos desde el patíbulo, ruega por nosotros.\nSan Oliver Plunkett, patrono de la paz en Irlanda, ruega por nosotros.\nSan Oliver Plunkett, último mártir católico de Inglaterra, ruega por nosotros.\nSan Oliver Plunkett, intercede por todos los Olivers, ruega por nosotros.\nCordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.\nCordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.\nOremos. Dios todopoderoso, que coronaste a San Oliver Plunkett con la palma del martirio: por su intercesión, concede a tu Iglesia la fortaleza para perseverar en la fe y trabajar sin descanso por la unidad y la paz. Por Cristo nuestro Señor. Amén.",
    "en": "Lord, have mercy. Christ, have mercy. Lord, have mercy.\nChrist, hear us. Christ, graciously hear us.\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, one God, have mercy on us.\nHoly Mary, Mother of the Church, pray for us.\nSaint Oliver Plunkett, glorious martyr of Ireland, pray for us.\nSaint Oliver Plunkett, Archbishop of Armagh, pray for us.\nSaint Oliver Plunkett, Primate of All Ireland, pray for us.\nSaint Oliver Plunkett, shepherd of the persecuted Church, pray for us.\nSaint Oliver Plunkett, who confirmed thousands in secret, pray for us.\nSaint Oliver Plunkett, defender of the faith in hostile land, pray for us.\nSaint Oliver Plunkett, who forgave your enemies from the scaffold, pray for us.\nSaint Oliver Plunkett, patron of peace in Ireland, pray for us.\nSaint Oliver Plunkett, last Catholic martyr of England, pray for us.\nSaint Oliver Plunkett, intercede for all the Olivers, pray for us.\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\nLet us pray. Almighty God, who crowned Saint Oliver Plunkett with the palm of martyrdom: through his intercession, grant your Church the strength to persevere in faith and work tirelessly for unity and peace. Through Christ our Lord. Amen."
  },
  "miracles": {
    "available": True,
    "es": "Para la canonización de San Oliver Plunkett, la Santa Sede aceptó el milagro atribuido a su intercesión del caso de la hermana Mary Reginald Lyons, monja dominica irlandesa, quien en 1961 fue curada instantánea e inexplicablemente de una grave enfermedad pulmonar crónica tras implorar la intercesión del entonces beato Oliver Plunkett. Los médicos no pudieron ofrecer ninguna explicación natural para la curación, y la Comisión Médica de la Santa Sede la declaró inexplicable desde el punto de vista científico. Este milagro fue aceptado por la Congregación para las Causas de los Santos y por el Papa Pablo VI, lo que permitió la canonización en 1975. Además, la cabeza de San Oliver, conservada como reliquia en la iglesia de San Pedro en Drogheda, ha sido lugar de peregrinación durante siglos, y son numerosos los testimonios de gracias obtenidas por su intercesión, especialmente conversiones, curaciones y reconciliaciones. Durante los peores años del conflicto en Irlanda del Norte en el siglo XX, muchos fieles atribuyeron a su intercesión situaciones de paz y de reconciliación en circunstancias humanamente imposibles.",
    "en": "For the canonization of Saint Oliver Plunkett, the Holy See accepted the miracle attributed to his intercession in the case of Sister Mary Reginald Lyons, an Irish Dominican nun, who in 1961 was instantly and inexplicably cured of a serious chronic lung disease after imploring the intercession of the then-Blessed Oliver Plunkett. The doctors could offer no natural explanation for the cure, and the Medical Commission of the Holy See declared it scientifically inexplicable. This miracle was accepted by the Congregation for the Causes of Saints and by Pope Paul VI, enabling the canonization in 1975. In addition, Oliver's head, preserved as a relic in the Church of Saint Peter in Drogheda, has been a place of pilgrimage for centuries, and there are numerous testimonies of graces obtained through his intercession, especially conversions, healings, and reconciliations. During the worst years of conflict in Northern Ireland in the twentieth century, many faithful attributed to his intercession situations of peace and reconciliation in humanly impossible circumstances."
  }
}

svg = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <radialGradient id="op-bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#070e07"/><stop offset="100%" stop-color="#020502"/>
    </radialGradient>
    <radialGradient id="op-atm" cx="50%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#1a5a28" stop-opacity="0.28"/><stop offset="100%" stop-color="#1a5a28" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="op-r1" x1="50%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#2a7838" stop-opacity="1"/><stop offset="100%" stop-color="#0a2010" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="op-r2" x1="50%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f5e060" stop-opacity="1"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="op-cope" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6a2a90"/><stop offset="100%" stop-color="#2e0a50"/>
    </linearGradient>
    <filter id="op-gl"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="op-g2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="400" height="600" fill="url(#op-bg)"/>
  <rect width="400" height="600" fill="url(#op-atm)"/>
  <!-- Stars -->
  <circle cx="52"  cy="28"  r="1.5" fill="#a0c8a0" opacity="0.70"/>
  <circle cx="112" cy="16"  r="1"   fill="#a0c8a0" opacity="0.55"/>
  <circle cx="300" cy="22"  r="1"   fill="#a0c8a0" opacity="0.50"/>
  <circle cx="358" cy="42"  r="1.5" fill="#a0c8a0" opacity="0.65"/>
  <circle cx="38"  cy="75"  r="1"   fill="#a0c8a0" opacity="0.50"/>
  <!-- Irish rolling hills silhouette -->
  <path d="M0,380 Q80,345 170,368 Q260,342 340,362 Q370,352 400,370 L400,525 L0,525 Z" fill="#0a1a0a" opacity="0.38"/>
  <path d="M0,400 Q60,382 140,395 Q220,375 300,390 Q350,382 400,396 L400,525 L0,525 Z" fill="#0d200d" opacity="0.28"/>
  <!-- Rays: green left, gold right -->
  <polygon points="198,264 -20,610 110,610" fill="url(#op-r1)" filter="url(#op-gl)" opacity="0.72"/>
  <polygon points="198,264  25,600  85,600" fill="#2a7838" opacity="0.34"/>
  <polygon points="202,264 420,610 290,610" fill="url(#op-r2)" filter="url(#op-gl)" opacity="0.70"/>
  <polygon points="202,264 370,600 310,600" fill="#f5e060" opacity="0.32"/>
  <!-- Cope/chasuble (episcopal outer vestment, purple) -->
  <path d="M144,164 Q104,228 102,492 L298,492 Q296,228 256,164 Q228,182 200,184 Q172,182 144,164 Z" fill="url(#op-cope)" opacity="0.88"/>
  <!-- Orphrey (gold vertical band on cope) -->
  <rect x="196" y="164" width="8" height="300" rx="3" fill="#c9a84c" opacity="0.40"/>
  <!-- Orphrey horizontal band (across chest) -->
  <rect x="130" y="228" width="140" height="10" rx="3" fill="#c9a84c" opacity="0.35"/>
  <!-- White alb visible at collar -->
  <path d="M182,162 Q200,170 218,162 Q210,182 200,186 Q190,182 182,162 Z" fill="#e8e8e0" opacity="0.72"/>
  <!-- Left arm holding crozier -->
  <path d="M144,164 Q100,202 112,316 Q128,328 144,322 Q136,248 160,200 Z" fill="url(#op-cope)" opacity="0.88"/>
  <ellipse cx="118" cy="322" rx="13" ry="9" fill="#d4a878" opacity="0.88"/>
  <!-- Crozier shaft (gold) -->
  <line x1="114" y1="492" x2="114" y2="196" stroke="#c9a030" stroke-width="7" stroke-linecap="round"/>
  <!-- Crozier crook -->
  <path d="M114,196 Q114,166 134,156 Q158,146 163,166 Q167,184 148,190 Q134,194 128,202" stroke="#c9a030" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Crozier cross-band (decorative) -->
  <line x1="106" y1="380" x2="122" y2="380" stroke="#c9a030" stroke-width="3" stroke-opacity="0.60"/>
  <!-- Right arm holding palm of martyrdom -->
  <path d="M256,164 Q296,202 288,296 Q274,308 260,302 Q262,256 244,200 Z" fill="url(#op-cope)" opacity="0.88"/>
  <ellipse cx="284" cy="302" rx="13" ry="9" fill="#d4a878" opacity="0.88"/>
  <!-- Palm branch -->
  <line x1="282" y1="492" x2="276" y2="172" stroke="#5a8020" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="266" cy="186" rx="14" ry="5" fill="#6aaa28" opacity="0.88" transform="rotate(-28,266,186)"/>
  <ellipse cx="278" cy="178" rx="14" ry="5" fill="#7ac030" opacity="0.85" transform="rotate(-8,278,178)"/>
  <ellipse cx="288" cy="183" rx="13" ry="5" fill="#6aaa28" opacity="0.80" transform="rotate(18,288,183)"/>
  <ellipse cx="270" cy="198" rx="12" ry="4" fill="#88c838" opacity="0.75" transform="rotate(-45,270,198)"/>
  <ellipse cx="262" cy="200" rx="11" ry="4" fill="#7ac030" opacity="0.70" transform="rotate(-62,262,200)"/>
  <!-- Pectoral cross on cope -->
  <rect x="197" y="282" width="7" height="20" rx="2" fill="#c9a84c" opacity="0.90"/>
  <rect x="191" y="289" width="19" height="6" rx="2" fill="#c9a84c" opacity="0.90"/>
  <!-- Neck -->
  <rect x="193" y="144" width="14" height="18" rx="4" fill="#d4a878" opacity="0.88"/>
  <!-- Head -->
  <ellipse cx="200" cy="108" rx="27" ry="30" fill="#d4a878" opacity="0.92"/>
  <!-- Short dark hair (17th century priestly style) -->
  <path d="M173,100 Q174,63 200,57 Q226,63 227,100 Q220,76 200,74 Q180,76 173,100 Z" fill="#180c04" opacity="0.90"/>
  <!-- Eyes (dark, steady gaze) -->
  <ellipse cx="189" cy="109" rx="5" ry="4" fill="#0e0808"/>
  <ellipse cx="211" cy="109" rx="5" ry="4" fill="#0e0808"/>
  <circle cx="190" cy="108" r="1.5" fill="#ffffff" opacity="0.40"/>
  <circle cx="212" cy="108" r="1.5" fill="#ffffff" opacity="0.40"/>
  <!-- Brow -->
  <path d="M182,101 Q189,98 195,101" stroke="#180c04" stroke-width="1.8" fill="none"/>
  <path d="M205,101 Q211,98 218,101" stroke="#180c04" stroke-width="1.8" fill="none"/>
  <!-- Halo rings -->
  <circle cx="200" cy="108" r="53" fill="none" stroke="#e8c97a" stroke-width="1.8" stroke-opacity="0.65" filter="url(#op-g2)"/>
  <circle cx="200" cy="108" r="47" fill="none" stroke="#e8c97a" stroke-width="0.5" stroke-opacity="0.22"/>
  <!-- Double golden frame -->
  <rect x="6"  y="6"  width="388" height="588" rx="8" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-opacity="0.5"/>
  <rect x="12" y="12" width="376" height="576" rx="5" fill="none" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.18"/>
  <!-- Name panel -->
  <rect x="18" y="528" width="364" height="66" rx="6" fill="#020502" opacity="0.88"/>
  <line x1="46" y1="535" x2="354" y2="535" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.28"/>
  <text x="200" y="548" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" letter-spacing="3" opacity="0.9">SAN OLIVER PLUNKETT \u00b7 ST. OLIVER PLUNKETT</text>
  <text x="200" y="567" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#70ba88" font-style="italic">\u00abM\u00e1rtir, Arzobispo de Armagh, Irlanda\u00bb</text>
  <text x="200" y="585" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#f5e060" font-style="italic" opacity="0.8">\u00abMartyr, Archbishop of Armagh, Ireland\u00bb</text>
</svg>
"""

base = pathlib.Path(r"C:\Users\ggh19\Documents\theuniversalprayer")
(base / "data" / "sanoliverplunkett.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
(base / "assets" / "images" / "sanoliverplunkett.svg").write_text(svg, encoding="utf-8")
print(f"Oliver Plunkett: JSON {(base/'data'/'sanoliverplunkett.json').stat().st_size}B, SVG {(base/'assets'/'images'/'sanoliverplunkett.svg').stat().st_size}B")
