/* ─────────────────────────────────────────────────────
   DÍA 1 — LA PRESENCIA REAL
   El misterio central de la fe eucarística:
   Jesús verdaderamente presente en la Hostia Santa.
   ───────────────────────────────────────────────────── */
DIAS_33.push({
  n: 1,

  theme: {
    es: 'La Presencia Real',
    en: 'The Real Presence'
  },

  verse: {
    es: '«Yo soy el pan vivo que bajó del cielo. El que coma de este pan vivirá para siempre.»',
    en: '"I am the living bread that came down from heaven. Whoever eats this bread will live forever."',
    ref: 'Jn 6, 51'
  },

  /* SVG: Hostia consagrada con rayos de luz y corona */
  svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="d1host" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffde8"/>
      <stop offset="70%" stop-color="#f5e49a"/>
      <stop offset="100%" stop-color="#c9a84c"/>
    </radialGradient>
    <radialGradient id="d1glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Ambient glow -->
  <circle cx="50" cy="50" r="46" fill="url(#d1glow)"/>
  <!-- 12 long rays -->
  <g transform="translate(50,50)">
    <line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
    <g transform="rotate(30)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(60)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(90)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(120)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(150)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(180)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(210)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(240)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(270)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(300)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
    <g transform="rotate(330)"><line y2="-42" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/></g>
  </g>
  <!-- Host disc -->
  <circle cx="50" cy="50" r="26" fill="url(#d1host)"/>
  <circle cx="50" cy="50" r="26" fill="none" stroke="#c9a84c" stroke-width="1.2" opacity="0.6"/>
  <!-- IHS monogram -->
  <text x="50" y="48" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-size="11" font-style="italic"
        fill="#8a6e2f" opacity="0.85">IHS</text>
  <!-- Small cross above IHS -->
  <line x1="50" y1="35" x2="50" y2="29" stroke="#8a6e2f" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
  <line x1="47" y1="32" x2="53" y2="32" stroke="#8a6e2f" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
  <!-- Three nails below -->
  <circle cx="46" cy="56" r="1.2" fill="#8a6e2f" opacity="0.5"/>
  <circle cx="50" cy="57" r="1.2" fill="#8a6e2f" opacity="0.5"/>
  <circle cx="54" cy="56" r="1.2" fill="#8a6e2f" opacity="0.5"/>
</svg>`,

  reflection: {
    es: [
      'Hoy comienzas una jornada de 33 días en la que cada día te detendrás ante el Santísimo con un tema diferente, una escritura, una reflexión y una oración. Treinta y tres días — los mismos años que vivió el Señor en la tierra antes de entregarse por ti.',

      'El primer misterio que necesitas contemplar, el fundamento de todo lo que sigue, es este: Jesús está aquí. No como símbolo. No como recuerdo. No como imagen poética de algo que pasó hace dos mil años. Jesús — su Cuerpo, su Sangre, su Alma, su Divinidad — está real y verdaderamente presente en la Hostia consagrada.',

      'Esto es lo que la Iglesia llama la Presencia Real. Y es el corazón latente detrás de cada tabernáculo en cada iglesia del mundo. En este momento, en miles de sagrarios a lo largo y ancho de la tierra, Jesucristo, el Hijo de Dios, está presente. No dormido. No ausente. Presente, vivo, y esperando.',

      'Santo Tomás de Aquino, el gran Doctor de la Eucaristía, escribió en su himno Adoro te devote: "Te adoro devotamente, Dios escondido, que bajo estas apariencias estás verdaderamente oculto." La fe eucarística no es fe en una idea sino en una persona. Cuando te arrodillas ante el Santísimo, te arrodillas ante Jesús mismo.',

      'Tal vez hoy esto te resulte difícil de creer del todo. Tal vez hay una parte de ti que lo acepta con la mente pero no lo siente en el corazón. Eso es normal. La fe no siempre viene acompañada de sentimientos. Pero la fe actúa: se arrodilla, espera, escucha. Y en ese acto humilde, Jesús hace el resto.',

      'San Juan Vianney, el cura de Ars, vio un día a un campesino que pasaba horas sentado en la iglesia frente al sagrario sin hacer nada aparente. El cura le preguntó qué hacía. El hombre respondió simplemente: "Yo le miro a Él. Él me mira a mí." Eso es la adoración eucarística en su forma más pura.',

      'Hoy, el primer día, no necesitas palabras perfectas ni sentimientos profundos. Solo necesitas creer — aunque sea con la fe más pequeña — que Él está ahí. Y quedarte. Un momento. En silencio. Mirándole. Sabiendo que Él también te mira a ti.'
    ],
    en: [
      'Today you begin a 33-day journey in which each day you will pause before the Blessed Sacrament with a different theme, a scripture passage, a reflection, and a prayer. Thirty-three days — the same years the Lord lived on earth before giving himself for you.',

      'The first mystery you need to contemplate — the foundation of everything that follows — is this: Jesus is here. Not as a symbol. Not as a memory. Not as a poetic image of something that happened two thousand years ago. Jesus — his Body, his Blood, his Soul, his Divinity — is truly and really present in the consecrated Host.',

      'This is what the Church calls the Real Presence. And it is the beating heart behind every tabernacle in every church in the world. At this very moment, in thousands of tabernacles across the earth, Jesus Christ, the Son of God, is present. Not asleep. Not absent. Present, alive, and waiting.',

      'Saint Thomas Aquinas, the great Doctor of the Eucharist, wrote in his hymn Adoro te devote: "I devoutly adore you, O hidden God, who truly lies hidden beneath these appearances." Eucharistic faith is not faith in an idea but in a person. When you kneel before the Blessed Sacrament, you kneel before Jesus himself.',

      'Perhaps today this is difficult for you to believe fully. Perhaps part of you accepts it with the mind but does not feel it in the heart. That is normal. Faith does not always come with feeling. But faith acts: it kneels, it waits, it listens. And in that humble act, Jesus does the rest.',

      'Saint John Vianney, the Curé of Ars, once saw a peasant who spent hours sitting in the church before the tabernacle without apparently doing anything. The priest asked what he was doing. The man answered simply: "I look at Him. He looks at me." That is Eucharistic adoration in its purest form.',

      'Today, on the first day, you do not need perfect words or deep feelings. You only need to believe — even with the smallest faith — that He is there. And to stay. A moment. In silence. Looking at Him. Knowing that He is also looking at you.'
    ]
  },

  prayer: {
    es: 'Señor Jesucristo, creo con fe firme que estás verdadera, real y sustancialmente presente en el Santísimo Sacramento del altar. Creo que en este momento Tu Cuerpo, Tu Sangre, Tu Alma y Tu Divinidad están aquí — no porque lo sienta, sino porque Tú mismo lo dijiste, y Tú eres la Verdad que no puede engañar ni ser engañada. Hoy comienzo estos 33 días contigo. No vengo con grandes méritos. Vengo con las manos vacías y el corazón abierto. Recíbeme, Señor. Enséñame a adorarte. Que al término de esta jornada, mi fe en Tu Presencia sea más viva, más profunda y más real que antes. Amén.',
    en: 'Lord Jesus Christ, I firmly believe that You are truly, really, and substantially present in the Most Blessed Sacrament of the altar. I believe that at this moment Your Body, Your Blood, Your Soul, and Your Divinity are here — not because I feel it, but because You yourself said it, and You are the Truth that cannot deceive or be deceived. Today I begin these 33 days with You. I do not come with great merits. I come with empty hands and an open heart. Receive me, Lord. Teach me to adore You. May by the end of this journey my faith in Your Presence be more alive, deeper, and more real than before. Amen.'
  },

  act: {
    es: 'Hoy, en algún momento del día, detente frente a una iglesia o capilla donde esté el Santísimo — aunque sea solo un minuto — y di en voz baja: "Señor, creo que estás aquí." Si no puedes ir físicamente, haz una visita espiritual: cierra los ojos, imagínate ante el sagrario, y repite esas mismas palabras.',
    en: 'Today, at some point during the day, stop before a church or chapel where the Blessed Sacrament is present — even if only for one minute — and say quietly: "Lord, I believe You are here." If you cannot go in person, make a spiritual visit: close your eyes, picture yourself before the tabernacle, and repeat those same words.'
  }
});
