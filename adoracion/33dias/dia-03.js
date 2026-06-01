/* ─────────────────────────────────────────────────────
   DÍA 3 — LA COPA DE SALVACIÓN
   La Sangre de Cristo bajo la especie del vino:
   el cáliz que cambia el destino eterno del hombre.
   ───────────────────────────────────────────────────── */
DIAS_33.push({
  n: 3,

  theme: {
    es: 'La Copa de Salvación',
    en: 'The Cup of Salvation'
  },

  verse: {
    es: '«Alzaré la copa de la salvación e invocaré el nombre del Señor.»',
    en: '"I will lift up the cup of salvation and call on the name of the Lord."',
    ref: 'Sal 116, 13'
  },

  /* SVG: cáliz eucarístico con rayos y uvas */
  svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="d3glow" cx="50%" cy="42%" r="45%">
      <stop offset="0%" stop-color="#8b1a1a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8b1a1a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="d3chalice" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#e8c97a"/>
      <stop offset="55%" stop-color="#c9a84c"/>
      <stop offset="100%" stop-color="#8a6e2f"/>
    </linearGradient>
    <linearGradient id="d3wine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c0392b" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#6b0f0f" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <!-- Ambient glow -->
  <circle cx="50" cy="44" r="40" fill="url(#d3glow)"/>
  <!-- Chalice bowl -->
  <path d="M30,22 Q28,42 35,52 Q42,60 50,61 Q58,60 65,52 Q72,42 70,22 Z"
        fill="url(#d3chalice)" opacity="0.95"/>
  <!-- Wine inside -->
  <path d="M35,42 Q36,54 42,57 Q50,60 58,57 Q64,54 65,42 Z"
        fill="url(#d3wine)"/>
  <!-- Wine shimmer -->
  <ellipse cx="47" cy="43" rx="5" ry="1.5" fill="#fff" opacity="0.15" transform="rotate(-15 47 43)"/>
  <!-- Chalice stem -->
  <rect x="47" y="61" width="6" height="14" rx="2" fill="url(#d3chalice)"/>
  <!-- Chalice base -->
  <ellipse cx="50" cy="77" rx="14" ry="4" fill="url(#d3chalice)"/>
  <!-- Small cross on chalice -->
  <line x1="50" y1="26" x2="50" y2="20" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
  <line x1="47" y1="23" x2="53" y2="23" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
  <!-- Grape cluster left -->
  <circle cx="22" cy="58" r="4.5" fill="#6b0f0f" opacity="0.7"/>
  <circle cx="26" cy="53" r="4"   fill="#8b1a1a" opacity="0.75"/>
  <circle cx="21" cy="50" r="3.5" fill="#6b0f0f" opacity="0.65"/>
  <circle cx="27" cy="62" r="3.5" fill="#8b1a1a" opacity="0.65"/>
  <!-- Leaf left -->
  <path d="M16,46 Q22,38 30,44" fill="none" stroke="#4a7c3f" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <!-- Grape cluster right -->
  <circle cx="78" cy="58" r="4.5" fill="#6b0f0f" opacity="0.7"/>
  <circle cx="74" cy="53" r="4"   fill="#8b1a1a" opacity="0.75"/>
  <circle cx="79" cy="50" r="3.5" fill="#6b0f0f" opacity="0.65"/>
  <circle cx="73" cy="62" r="3.5" fill="#8b1a1a" opacity="0.65"/>
  <!-- Leaf right -->
  <path d="M84,46 Q78,38 70,44" fill="none" stroke="#4a7c3f" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <!-- Light rays from chalice top -->
  <line x1="50" y1="20" x2="44" y2="10" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
  <line x1="50" y1="20" x2="56" y2="10" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
  <line x1="50" y1="20" x2="50" y2="8"  stroke="#c9a84c" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>
</svg>`,

  reflection: {
    es: [
      'En la Última Cena, después de tomar el pan, Jesús tomó la copa. La miró. La alzó. Y pronunció las palabras que cambiarían la historia para siempre: "Esta copa es la Nueva Alianza en mi Sangre, que se derrama por vosotros." (Lc 22,20). En ese instante, el vino ordinario de Palestina se convirtió en algo que ningún ojo humano podía ver pero que toda fe verdadera abraza: la Sangre del Hijo de Dios.',

      'El salmo 116 es una canción de acción de gracias después de haber sido librado de la muerte. El salmista, desbordando de gratitud, grita: "¿Cómo pagaré al Señor todo el bien que me ha hecho? Alzaré la copa de la salvación." La copa de la salvación no era solo un gesto litúrgico; era el reconocimiento de que la vida misma es un regalo que viene de Dios y que solo puede devolverse con alabanza.',

      'Jesús tomó esa imagen milenaria y la llenó de un nuevo contenido radical: Él mismo es la copa. Su Sangre, derramada en la Cruz y presente en el cáliz eucarístico, es el precio de nuestra salvación. Cuando el sacerdote alza el cáliz en la Misa, no está repitiendo un gesto simbólico — está haciendo presente, aquí y ahora, el mismo sacrificio del Calvario. El mismo.',

      'Hay algo que necesitamos entender bien sobre la Sangre de Cristo: en la teología católica, "sangre" no es solo un elemento biológico. En la Biblia hebrea, la sangre es la vida misma — "la sangre es la vida" (Dt 12,23). Cuando Jesús dice "Esta es mi Sangre", está diciendo: "Esta es mi vida entregada." No a medias. No con reservas. Toda su vida, hasta la última gota, derramada por ti.',

      'Santa Faustina Kowalska, la gran apóstol de la Divina Misericordia, escribió en su Diario que en una visión vio cómo la Sangre y el Agua que brotaron del costado de Cristo son la fuente de toda misericordia para la humanidad. La Sangre es la Eucaristía — el don de la vida eterna. El Agua es el Bautismo — el nacimiento a la vida nueva. Ambos nacen del mismo costado traspasado.',

      'Cuando ves el cáliz elevado en la Consagración, estás mirando el corazón de la historia humana. Toda la Biblia — desde el sacrificio de Abel hasta el Cordero de Apocalipsis — converge en ese cáliz. Es el punto donde el tiempo y la eternidad se tocan.',

      'Hoy, ante el Santísimo, contempla no solo la Hostia sino lo que ella implica: que hay una Sangre derramada por ti. Que tu nombre estaba en la mente de Jesús en el Calvario. Que aquella copa no fue bebida en vano. Y que tú — con toda tu historia, tus caídas, tus miedos — eres parte de la razón por la que esa copa fue alzada.'
    ],
    en: [
      'At the Last Supper, after taking the bread, Jesus took the cup. He looked at it. He raised it. And he pronounced the words that would change history forever: "This cup is the new covenant in my blood, which is poured out for you." (Lk 22:20). In that instant, the ordinary wine of Palestine became something no human eye could see but every true faith embraces: the Blood of the Son of God.',

      'Psalm 116 is a song of thanksgiving after having been delivered from death. The psalmist, overflowing with gratitude, cries out: "How can I repay the Lord for all the good he has done for me? I will lift up the cup of salvation." The cup of salvation was not merely a liturgical gesture — it was the recognition that life itself is a gift that comes from God and can only be returned with praise.',

      'Jesus took that ancient image and filled it with a radically new content: He himself is the cup. His Blood, poured out on the Cross and present in the Eucharistic chalice, is the price of our salvation. When the priest raises the chalice at Mass, he is not repeating a symbolic gesture — he is making present, here and now, the very same sacrifice of Calvary. The very same.',

      'There is something we need to understand clearly about the Blood of Christ: in Catholic theology, "blood" is not merely a biological element. In the Hebrew Bible, blood is life itself — "the blood is the life" (Dt 12:23). When Jesus says "This is my Blood," he is saying: "This is my life given." Not halfway. Not with reservations. His entire life, to the last drop, poured out for you.',

      'Saint Faustina Kowalska, the great apostle of Divine Mercy, wrote in her Diary that in a vision she saw how the Blood and Water that flowed from Christ\'s side are the source of all mercy for humanity. The Blood is the Eucharist — the gift of eternal life. The Water is Baptism — birth into new life. Both are born from the same pierced side.',

      'When you see the chalice elevated at the Consecration, you are looking at the heart of human history. The entire Bible — from Abel\'s sacrifice to the Lamb of Revelation — converges in that chalice. It is the point where time and eternity touch.',

      'Today, before the Blessed Sacrament, contemplate not only the Host but what it implies: that there is a Blood poured out for you. That your name was in the mind of Jesus on Calvary. That that cup was not raised in vain. And that you — with all your history, your falls, your fears — are part of the reason why that cup was lifted up.'
    ]
  },

  prayer: {
    es: 'Señor Jesús, cuando el sacerdote alza el cáliz y dice "Esta es mi Sangre", yo creo — con toda la fe que tengo — que esa es Tu vida entregada por mí. Por mí, con mi nombre, con mi historia, con mis pecados y mis miedos. No me dejes contemplar esa copa con indiferencia. Que cada Misa a la que asista sea para mí un encuentro con la profundidad de Tu amor, no un rito vacío. Purifica mi alma con Tu Sangre preciosa. Donde haya herida, sana. Donde haya mancha, limpia. Donde haya muerte, siembra vida. Alzo hoy contigo, Señor, mi propia copa — la de mi vida — y la pongo en Tus manos. Haz con ella lo que quieras. Amén.',
    en: 'Lord Jesus, when the priest raises the chalice and says "This is my Blood," I believe — with all the faith I have — that it is Your life given for me. For me, with my name, with my history, with my sins and my fears. Do not let me contemplate that cup with indifference. May every Mass I attend be for me an encounter with the depth of Your love, not an empty rite. Purify my soul with Your precious Blood. Where there is wound, heal. Where there is stain, cleanse. Where there is death, sow life. Today I raise with You, Lord, my own cup — the cup of my life — and I place it in Your hands. Do with it as You will. Amen.'
  },

  act: {
    es: 'En la próxima Misa a la que vayas — hoy, mañana o el domingo — cuando el sacerdote alce el cáliz en la Consagración, haz una pausa interior. No mires el reloj ni pienses en lo que sigue. Solo mira el cáliz y di en tu corazón: "Gracias, Señor, por Tu Sangre derramada por mí." Un segundo de atención consciente puede transformar toda la Misa.',
    en: 'At the next Mass you attend — today, tomorrow, or on Sunday — when the priest raises the chalice at the Consecration, make an interior pause. Do not look at the clock or think about what comes next. Just look at the chalice and say in your heart: "Thank You, Lord, for Your Blood poured out for me." One second of conscious attention can transform the entire Mass.'
  }
});
