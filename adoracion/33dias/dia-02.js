/* ─────────────────────────────────────────────────────
   DÍA 2 — EL PAN DEL CIELO
   La Eucaristía como alimento del alma:
   Jesús que se entrega como sustento eterno.
   ───────────────────────────────────────────────────── */
DIAS_33.push({
  n: 2,

  theme: {
    es: 'El Pan del Cielo',
    en: 'The Bread of Heaven'
  },

  verse: {
    es: '«Nuestros padres comieron el maná en el desierto… pero el pan que yo daré es mi carne, para la vida del mundo.»',
    en: '"Our ancestors ate manna in the desert… but the bread that I will give is my flesh, for the life of the world."',
    ref: 'Jn 6, 31.51'
  },

  /* SVG: espiga de trigo con aureola dorada y partícula de pan */
  svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="d2bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="d2stem" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8c97a"/>
      <stop offset="100%" stop-color="#8a6e2f"/>
    </linearGradient>
  </defs>
  <!-- Glow -->
  <circle cx="50" cy="50" r="44" fill="url(#d2bg)"/>
  <!-- Wheat stem -->
  <line x1="50" y1="80" x2="50" y2="22" stroke="url(#d2stem)" stroke-width="2" stroke-linecap="round"/>
  <!-- Grain head — center spikelet -->
  <ellipse cx="50" cy="22" rx="5" ry="10" fill="#c9a84c" opacity="0.9"/>
  <!-- Left-side spikelets -->
  <ellipse cx="42" cy="32" rx="4.5" ry="9" fill="#c9a84c" opacity="0.8" transform="rotate(-22 42 32)"/>
  <ellipse cx="40" cy="44" rx="4" ry="8.5" fill="#c9a84c" opacity="0.7" transform="rotate(-18 40 44)"/>
  <ellipse cx="41" cy="56" rx="3.5" ry="7.5" fill="#c9a84c" opacity="0.6" transform="rotate(-14 41 56)"/>
  <!-- Right-side spikelets -->
  <ellipse cx="58" cy="32" rx="4.5" ry="9" fill="#c9a84c" opacity="0.8" transform="rotate(22 58 32)"/>
  <ellipse cx="60" cy="44" rx="4" ry="8.5" fill="#c9a84c" opacity="0.7" transform="rotate(18 60 44)"/>
  <ellipse cx="59" cy="56" rx="3.5" ry="7.5" fill="#c9a84c" opacity="0.6" transform="rotate(14 59 56)"/>
  <!-- Awns (barbs) top -->
  <line x1="50" y1="12" x2="47" y2="6"  stroke="#e8c97a" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
  <line x1="50" y1="12" x2="53" y2="6"  stroke="#e8c97a" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
  <line x1="50" y1="12" x2="50" y2="5"  stroke="#e8c97a" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
  <!-- Small host disc at base -->
  <circle cx="50" cy="84" r="7" fill="none" stroke="#c9a84c" stroke-width="1.4" opacity="0.55"/>
  <circle cx="50" cy="84" r="4.5" fill="#fffde8" opacity="0.18"/>
  <text x="50" y="87" text-anchor="middle" font-family="Georgia,serif" font-size="5.5"
        font-style="italic" fill="#c9a84c" opacity="0.7">IHS</text>
</svg>`,

  reflection: {
    es: [
      'Ayer contemplaste la realidad de la Presencia de Jesús. Hoy vas más profundo: contemplas el porqué. ¿Por qué eligió el Señor quedarse entre nosotros bajo la forma de pan? La respuesta es una sola palabra: alimento. Porque el hombre no puede vivir sin comer, y el alma tampoco.',

      'Cuando el pueblo de Israel caminaba por el desierto durante cuarenta años, Dios los alimentó con el maná — un pan blanco y suave que caía del cielo cada mañana, imposible de guardar para el día siguiente porque obligaba a depender de Dios día a día. Era una lección disfrazada de comida: "No vives de pan solo, sino de toda palabra que sale de la boca de Dios." (Dt 8,3). Ese maná era una sombra, un anticipo, una promesa de algo mucho mayor que estaba por venir.',

      'Jesús lo dijo sin rodeos en el capítulo sexto de Juan, el discurso eucarístico más largo del Evangelio: "Yo soy el pan de vida. El que venga a mí no tendrá hambre, y el que crea en mí no tendrá sed jamás." No estaba hablando de hambre de comida. Estaba hablando del hambre más profunda del ser humano: el hambre de sentido, de amor, de eternidad. El hambre que no calma ninguna riqueza, ningún éxito, ningún placer.',

      'El maná que los israelitas comieron en el desierto los alimentó, pero todos esos hombres murieron con el tiempo. La Eucaristía es un pan diferente. Jesús lo dijo explícitamente: "Este es el pan que baja del cielo, para que quien lo coma no muera." La Eucaristía no es solo un alimento para el cuerpo sino un principio de vida eterna plantado en el alma del que comulga con fe y amor. El que come este Pan lleva dentro de sí una semilla de resurrección.',

      'Santa Catalina de Siena, mística del siglo XIV, vivió varios años alimentándose casi exclusivamente de la Eucaristía. No lo hacía por ascetismo extremo, sino porque en la Comunión encontraba el único alimento capaz de saciar su alma. Escribió a su confesor: "El alma que se alimenta de este Pan no puede permanecer fría, porque el Amor mismo es su alimento." No tenemos que imitar su ascesis, pero sí podemos aprender su hambre: esa sed de Dios que hace del sagrario el lugar más necesario del mundo.',

      'Hoy quizás llegas cansado. Con el alma árida, con preguntas sin respuesta, con el corazón pesado por alguna carga que no puedes soltar. La buena noticia es esta: el Pan del Cielo no exige que llegues lleno. Exige que llegues con hambre. El mendigo que llega con las manos vacías recibe más que el satisfecho que llega por costumbre.',

      'Siéntate hoy ante el Santísimo como alguien que tiene hambre. No de gestos perfectos ni de oraciones elaboradas. Hambre del único Pan que puede llenarte. Y deja que Él te alimente.'
    ],
    en: [
      'Yesterday you contemplated the reality of Jesus\'s Presence. Today you go deeper: you contemplate the why. Why did the Lord choose to remain among us under the form of bread? The answer is a single word: nourishment. Because man cannot live without eating — and neither can the soul.',

      'When the people of Israel walked through the desert for forty years, God fed them with manna — a white, soft bread that fell from the sky each morning, impossible to store for the next day because it forced total daily dependence on God. It was a lesson disguised as food: "Man does not live on bread alone, but on every word that comes from the mouth of God." (Dt 8:3). That manna was a shadow, a foreshadowing, a promise of something far greater yet to come.',

      'Jesus said it plainly in the sixth chapter of John, the longest Eucharistic discourse in the Gospel: "I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty." He was not talking about hunger for food. He was talking about the deepest hunger of the human being: the hunger for meaning, for love, for eternity. The hunger that no wealth, no success, no pleasure can satisfy.',

      'The manna that the Israelites ate in the desert fed them, but all those men eventually died. The Eucharist is a different bread. Jesus said it explicitly: "This is the bread that comes down from heaven, so that one may eat it and not die." The Eucharist is not only food for the body but a principle of eternal life planted in the soul of whoever receives it with faith and love. Whoever eats this Bread carries within them a seed of resurrection.',

      'Saint Catherine of Siena, the fourteenth-century mystic, lived for several years sustained almost exclusively by the Eucharist. She did not do this out of extreme asceticism, but because in Communion she found the only food capable of satisfying her soul. She wrote to her confessor: "The soul that feeds on this Bread cannot remain cold, for Love itself is its nourishment." We are not called to imitate her asceticism, but we can learn her hunger: that thirst for God that makes the tabernacle the most necessary place in the world.',

      'Today perhaps you arrive tired. With a dry soul, with unanswered questions, with a heart heavy from some burden you cannot let go. The good news is this: the Bread of Heaven does not require you to arrive full. It requires you to arrive hungry. The beggar who comes with empty hands receives more than the satisfied person who comes out of habit.',

      'Sit today before the Blessed Sacrament as someone who is hungry. Not for perfect gestures or elaborate prayers. Hungry for the only Bread that can fill you. And let Him feed you.'
    ]
  },

  prayer: {
    es: 'Señor Jesús, Pan del Cielo, tú que te hiciste alimento por amor: aquí estoy, con hambre. No el hambre del cuerpo, sino el hambre más honda — la que solo Tú puedes saciar. He intentado llenarme con tantas cosas: con ruido, con trabajo, con afecto humano, con distracciones sin fin. Y sin embargo, el vacío regresa. Porque solo Tú eres el pan que no pasa, el alimento que no engaña, la mesa que nunca se levanta. Aliméntame hoy, Señor. Que cada vez que me acerque a Ticomo hicieron los discípulos en Emaús — mi corazón se encienda al reconocerte en el pan partido. Amén.',
    en: 'Lord Jesus, Bread of Heaven, you who made yourself food out of love: here I am, hungry. Not the hunger of the body, but the deepest hunger — the one only You can satisfy. I have tried to fill myself with so many things: with noise, with work, with human affection, with endless distractions. And yet, the emptiness returns. Because only You are the bread that does not pass away, the food that does not deceive, the table that is never taken down. Feed me today, Lord. May every time I draw near to You — as the disciples did at Emmaus — my heart burn within me as I recognize You in the breaking of the bread. Amen.'
  },

  act: {
    es: 'Antes de comer hoy — desayuno, almuerzo o cena — haz una pausa de 30 segundos. Mira el alimento frente a ti y di en silencio: "Este pan alimenta mi cuerpo. Señor, tú alimentas mi alma. Gracias." Ese pequeño gesto convierte una comida ordinaria en una oración eucarística.',
    en: 'Before eating today — breakfast, lunch, or dinner — pause for 30 seconds. Look at the food in front of you and say silently: "This bread feeds my body. Lord, You feed my soul. Thank you." That small gesture turns an ordinary meal into a Eucharistic prayer.'
  }
});
