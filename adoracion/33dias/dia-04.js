/* ─────────────────────────────────────────────────────
   DÍA 4 — EL CUERPO ENTREGADO
   "Tomad y comed, esto es mi Cuerpo":
   la entrega total de Jesús como acto libre de amor.
   ───────────────────────────────────────────────────── */
DIAS_33.push({
  n: 4,

  theme: {
    es: 'El Cuerpo Entregado',
    en: 'The Body Given'
  },

  verse: {
    es: '«Tomad y comed todos de él, porque esto es mi Cuerpo, que será entregado por vosotros.»',
    en: '"Take this, all of you, and eat of it, for this is my Body, which will be given up for you."',
    ref: 'Mt 26, 26 / Rito de la Misa'
  },

  /* SVG: manos abiertas ofreciendo una hostia — el don total */
  svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="d4halo" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="d4skin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8c97a"/>
      <stop offset="100%" stop-color="#c9a84c"/>
    </linearGradient>
  </defs>
  <!-- Halo -->
  <circle cx="50" cy="38" r="36" fill="url(#d4halo)"/>
  <!-- Host disc above hands -->
  <circle cx="50" cy="28" r="13" fill="#fffde8" opacity="0.92"/>
  <circle cx="50" cy="28" r="13" fill="none" stroke="#c9a84c" stroke-width="1.3" opacity="0.7"/>
  <!-- Cross on host -->
  <line x1="50" y1="19" x2="50" y2="37" stroke="#c9a84c" stroke-width="1.2" opacity="0.5"/>
  <line x1="41" y1="28" x2="59" y2="28" stroke="#c9a84c" stroke-width="1.2" opacity="0.5"/>
  <!-- Left hand (open, palm up) -->
  <path d="M20,70 Q18,58 26,52 Q30,50 34,52 L38,54 Q42,50 46,55 L46,72 Q38,76 28,74 Z"
        fill="url(#d4skin)" opacity="0.85"/>
  <!-- Left fingers -->
  <path d="M34,52 Q33,44 35,42 Q37,40 38,43 L38,54" fill="url(#d4skin)" opacity="0.8"/>
  <path d="M38,51 Q37,43 39,41 Q41,39 42,42 L42,53" fill="url(#d4skin)" opacity="0.8"/>
  <path d="M42,52 Q41,44 43,42 Q45,40 46,43 L46,54" fill="url(#d4skin)" opacity="0.8"/>
  <!-- Right hand (open, palm up) -->
  <path d="M80,70 Q82,58 74,52 Q70,50 66,52 L62,54 Q58,50 54,55 L54,72 Q62,76 72,74 Z"
        fill="url(#d4skin)" opacity="0.85"/>
  <!-- Right fingers -->
  <path d="M66,52 Q67,44 65,42 Q63,40 62,43 L62,54" fill="url(#d4skin)" opacity="0.8"/>
  <path d="M62,51 Q63,43 61,41 Q59,39 58,42 L58,53" fill="url(#d4skin)" opacity="0.8"/>
  <path d="M58,52 Q59,44 57,42 Q55,40 54,43 L54,54" fill="url(#d4skin)" opacity="0.8"/>
  <!-- Small rays from host -->
  <line x1="50" y1="15" x2="50" y2="10" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
  <line x1="58" y1="18" x2="62" y2="13" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
  <line x1="42" y1="18" x2="38" y2="13" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
  <line x1="63" y1="28" x2="68" y2="28" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
  <line x1="37" y1="28" x2="32" y2="28" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
</svg>`,

  reflection: {
    es: [
      'Hay una palabra en las palabras de la Consagración que la mayoría de las personas no escucha porque la liturgia ya la conoce de memoria: "entregado". "Este es mi Cuerpo, que será entregado por vosotros." No solamente dado. No solamente ofrecido. Entregado. En griego, el verbo es paradídōmi — el mismo verbo que se usa para decir que Judas lo "traicionó", que Pilato lo "entregó" a los soldados. Es el verbo del sacrificio total, sin retorno.',

      'En la cultura del primer siglo, el cuerpo de una persona era el símbolo de toda su existencia — no solo la carne y los huesos, sino la vida entera, la voluntad, la historia. Cuando Jesús dijo "esto es mi Cuerpo entregado", estaba diciendo: "Esto soy yo — todo yo — puesto completamente en tus manos." No entregó solo su dolor físico en la Cruz. Entregó su voluntad, su libertad, su fama, sus amigos, su futuro terreno. Lo entregó todo.',

      'Y lo que hace a este don absolutamente único en la historia es que fue libre. Nadie obligó a Jesús. Él mismo lo dijo: "Nadie me quita la vida, sino que yo la entrego por mi propia voluntad." (Jn 10,18). La Cruz no fue un accidente ni una derrota política. Fue un acto soberano del amor más puro que el mundo haya visto jamás. Un Dios que elige — libremente — hacerse vulnerable, hacerse pan, hacerse silencio en un sagrario, para que tú puedas acercarte sin miedo.',

      'San Juan Crisóstomo, uno de los grandes Padres de la Iglesia del siglo IV, predicaba a sus fieles sobre la Eucaristía con una intensidad que todavía hoy resulta difícil de asimilar: "No te acerques a la mesa del Señor como si fuera una mesa ordinaria. Esta mesa es el cuerpo de Cristo. Este cáliz es su sangre. ¿Qué ángel puede hacer tal cosa? ¿Qué arcángel? ¿Qué serafín? Solo Cristo." La entrega eucarística supera todo lo que el cielo mismo conoce porque es el amor de Dios hecho carne, hecho pan, hecho don perpetuo.',

      'Pero hay algo más que quiero que notes hoy. Jesús dijo "por vosotros" — no "por la humanidad en abstracto". Las palabras de la Consagración son en plural porque la Misa es comunitaria, pero el amor que las sostiene es absolutamente personal. Cuando Jesús pronunció esas palabras en el Cenáculo, te conocía a ti — tu nombre, tu rostro, el peso exacto de tu carga — y aun así eligió entregarse. No pese a ti. Por ti.',

      'Muchas personas viven años de práctica católica sintiendo la Misa como un deber cumplido. Van, rezan, comulgan y salen. Todo correcto, todo puntual, todo vacío. Eso no es culpa de la liturgia — es que no nos hemos detenido lo suficiente a escuchar esa palabra: "entregado". Un cuerpo entregado no es una estadística. Es una persona que te amó tanto que se quedó.',

      'Siéntate hoy ante la Hostia Santa y deja que esa realidad te atraviese: el Cuerpo que está ahí, en ese pequeño disco de pan consagrado, es el mismo Cuerpo que fue entregado en la Cruz. Por ti. No hay mayor acto de amor en toda la historia del universo. Quédate con eso.'
    ],
    en: [
      'There is a word in the words of the Consecration that most people do not hear because the liturgy is already known by heart: "given." "This is my Body, which will be given up for you." Not merely offered. Not merely donated. Given up. In Greek, the verb is paradídōmi — the same verb used to say that Judas "betrayed" him, that Pilate "handed him over" to the soldiers. It is the verb of total sacrifice, with no return.',

      'In first-century culture, a person\'s body was the symbol of their entire existence — not just flesh and bones, but the whole life, the will, the history. When Jesus said "this is my Body given up," he was saying: "This is me — all of me — placed completely in your hands." He did not hand over only his physical pain on the Cross. He handed over his will, his freedom, his reputation, his friends, his earthly future. He gave it all.',

      'And what makes this gift absolutely unique in history is that it was free. No one forced Jesus. He himself said it: "No one takes my life from me, but I lay it down on my own." (Jn 10:18). The Cross was not an accident or a political defeat. It was a sovereign act of the purest love the world has ever seen. A God who chooses — freely — to make himself vulnerable, to make himself bread, to make himself silence in a tabernacle, so that you can draw near without fear.',

      'Saint John Chrysostom, one of the great Church Fathers of the fourth century, preached to his faithful about the Eucharist with an intensity that is still difficult to absorb today: "Do not approach the table of the Lord as if it were an ordinary table. This table is the body of Christ. This cup is his blood. What angel can do such a thing? What archangel? What seraph? Only Christ." The Eucharistic gift surpasses everything heaven itself knows, because it is the love of God made flesh, made bread, made perpetual gift.',

      'But there is something more I want you to notice today. Jesus said "for you" — not "for humanity in the abstract." The words of the Consecration are plural because the Mass is communal, but the love that sustains them is absolutely personal. When Jesus spoke those words in the Upper Room, he knew you — your name, your face, the exact weight of your burden — and still he chose to give himself. Not in spite of you. For you.',

      'Many people spend years of Catholic practice experiencing Mass as a duty fulfilled. They go, they pray, they receive Communion and leave. Everything correct, everything punctual, everything empty. That is not the liturgy\'s fault — it is that we have not stopped long enough to hear that word: "given up." A body given up is not a statistic. It is a person who loved you so much they stayed.',

      'Sit today before the Sacred Host and let that reality pierce you: the Body that is there, in that small disc of consecrated bread, is the same Body that was given up on the Cross. For you. There is no greater act of love in the entire history of the universe. Stay with that.'
    ]
  },

  prayer: {
    es: 'Señor Jesús, Cuerpo entregado por amor: no sé cómo corresponder a lo que has hecho. Tú que eres Dios, sin límite y sin necesidad de nadie, quisiste ser partido, distribuido, consumido — por amor a mí. Hoy quiero devolverte algo de lo que me has dado: me entrego a Ti. No perfectamente — no sé hacerlo. Pero sí libremente. Toma mi voluntad donde se resiste. Toma mis manos donde no quieren servir. Toma mi corazón donde aún no te ha dejado entrar del todo. Que como Tú te entregaste por mí, yo aprenda cada día a entregarme un poco más por los demás. Amén.',
    en: 'Lord Jesus, Body given up out of love: I do not know how to respond to what You have done. You who are God, without limit and without need of anyone, chose to be broken, distributed, consumed — out of love for me. Today I want to give back something of what You have given me: I give myself to You. Not perfectly — I do not know how. But freely. Take my will where it resists. Take my hands where they do not wish to serve. Take my heart where it has not yet let You fully in. May as You gave Yourself up for me, I learn each day to give myself a little more for others. Amen.'
  },

  act: {
    es: 'Esta semana, elige una cosa concreta en la que normalmente pongas tu voluntad primero — una conversación difícil, una tarea que evitas, un servicio que cuesta — y hazla ofreciéndola. Di antes de empezar: "Señor, esto lo entrego contigo." No necesita ser grande. El Cuerpo Entregado se aprende en los pequeños dones cotidianos.',
    en: 'This week, choose one concrete thing where you normally put your will first — a difficult conversation, a task you avoid, a service that costs you — and do it as an offering. Say before you begin: "Lord, I give this together with You." It does not need to be great. The Body Given is learned in the small daily gifts.'
  }
});
