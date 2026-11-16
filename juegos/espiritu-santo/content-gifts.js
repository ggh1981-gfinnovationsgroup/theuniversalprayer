// El Camino del Espíritu: las siete misiones de los dones.
// Las descripciones de los dones en los cierres son las de data/espiritu.json, palabra por palabra.
// La línea de cada don es su frase de la oración de cierre de data/espiritu.json.
// Sin guion largo en la prosa en español.
window.RPG_GIFTS = [
  {
    id: "sabiduria",
    giftIndex: 0,
    zoneId: "sabiduria",
    npcId: "sabio",
    intro: [
      { speaker: "npc", text: { es: "Bienvenido al Mirador, peregrino. Desde aquí arriba todo se ve distinto, ¿verdad? Así actúa el don que buscas.", en: "Welcome to the Lookout, pilgrim. From up here everything looks different, does it not? That is how the gift you seek works." } },
      { speaker: "npc", text: { es: "La sabiduría es el don de ver las cosas como las ve Dios: con amor, eternidad y verdad.", en: "Wisdom is the gift of seeing things as God sees them: with love, eternity, and truth." } },
      { speaker: "player", text: { es: "Quiero aprender a mirar así, maestro.", en: "I want to learn to see that way, master." } },
      { speaker: "npc", text: { es: "Entonces escucha cinco situaciones de la vida diaria. En cada una hay dos miradas: la inmediata y la de Dios. Elige la mirada de Dios al menos cuatro veces y el don se encenderá en ti.", en: "Then listen to five situations from daily life. In each one there are two ways of seeing: the immediate one and God's. Choose God's way of seeing at least four times, and the gift will be kindled in you." } }
    ],
    challenge: {
      type: "choices",
      need: 4,
      rounds: [
        {
          prompt: { es: "Tu amigo te corrigió delante de todos y sentiste vergüenza. ¿Con qué mirada respondes?", en: "Your friend corrected you in front of everyone and you felt ashamed. With which way of seeing do you respond?" },
          options: [
            { text: { es: "Le respondo con la misma moneda, para que aprenda.", en: "I answer him in the same coin, so he learns." }, good: false, reply: { es: "Esa es la mirada inmediata: defiende el orgullo, pero rompe al hermano. La sabiduría pregunta primero qué herida lleva el otro.", en: "That is the immediate way of seeing: it defends pride, but it breaks the brother. Wisdom first asks what wound the other person carries." } },
            { text: { es: "Veo a un hermano que también sufre y le respondo con mansedumbre.", en: "I see a brother who also suffers, and I answer him with meekness." }, good: true, reply: { es: "Esa es la mirada de Dios: detrás de la ofensa ves a una persona amada. Así mira la sabiduría, con amor y con verdad.", en: "That is God's way of seeing: behind the offense you see a beloved person. That is how wisdom looks, with love and with truth." } }
          ]
        },
        {
          prompt: { es: "Te ofrecen ganar mucho más dinero, pero lejos de tu familia y de tu comunidad de fe. ¿Qué pesa más en tu mirada?", en: "You are offered much more money, but far from your family and your faith community. What weighs more in your eyes?" },
          options: [
            { text: { es: "Acepto sin pensarlo: lo que cuenta es ganar más.", en: "I accept without thinking: what counts is earning more." }, good: false, reply: { es: "La mirada inmediata solo cuenta monedas. La sabiduría cuenta lo que dura para la eternidad, y ahí las personas pesan más que el sueldo.", en: "The immediate way of seeing only counts coins. Wisdom counts what lasts for eternity, and there people weigh more than a salary." } },
            { text: { es: "Pienso en lo eterno: mi familia y mi vocación valen más que el dinero.", en: "I think of what is eternal: my family and my vocation are worth more than money." }, good: true, reply: { es: "Exacto. La sabiduría orienta la vida hacia lo que verdaderamente importa, y el dinero queda en su lugar: un medio, no un fin.", en: "Exactly. Wisdom orients life toward what truly matters, and money stays in its place: a means, not an end." } }
          ]
        },
        {
          prompt: { es: "Una compañera recibe el reconocimiento que tú esperabas, y la envidia te visita. ¿Cómo la miras?", en: "A coworker receives the recognition you were hoping for, and envy comes to visit you. How do you look at her?" },
          options: [
            { text: { es: "Me comparo con ella todo el día y me amargo.", en: "I compare myself with her all day and grow bitter." }, good: false, reply: { es: "Compararte es mirar con los ojos del mundo. La sabiduría se alegra del bien ajeno, porque sabe que el Padre reparte sus dones con amor.", en: "Comparing yourself is looking with the eyes of the world. Wisdom rejoices in another's good, because it knows the Father hands out His gifts with love." } },
            { text: { es: "Doy gracias a Dios por su bien y recuerdo que mi valor está en Él.", en: "I thank God for her good and remember that my worth is in Him." }, good: true, reply: { es: "Mirada de cielo. Quien ve como Dios ve descubre que el bien del otro nunca le quita nada.", en: "A heavenly way of seeing. Whoever sees as God sees discovers that another's good never takes anything away from them." } }
          ]
        },
        {
          prompt: { es: "Una enfermedad cambia de golpe todos tus planes del año. ¿Cómo miras lo que viene?", en: "An illness suddenly changes all your plans for the year. How do you look at what is coming?" },
          options: [
            { text: { es: "Todo está perdido: mis planes eran lo único que importaba.", en: "Everything is lost: my plans were the only thing that mattered." }, good: false, reply: { es: "La mirada inmediata se queda en el plan roto. La sabiduría, que ve con eternidad, confía en que Dios sigue escribiendo la historia.", en: "The immediate way of seeing stays with the broken plan. Wisdom, which sees with eternity, trusts that God is still writing the story." } },
            { text: { es: "Confío en Dios y busco el bien escondido en este nuevo camino.", en: "I trust in God and look for the hidden good in this new path." }, good: true, reply: { es: "Así ve la sabiduría: ni el dolor tiene la última palabra. Dios convierte incluso lo que no entendemos en camino de vida.", en: "That is how wisdom sees: not even pain has the last word. God turns even what we do not understand into a path of life." } }
          ]
        },
        {
          prompt: { es: "Alguien que te hirió viene a pedirte perdón, de corazón. ¿Con qué mirada lo recibes?", en: "Someone who hurt you comes to ask your forgiveness, sincerely. With which way of seeing do you receive him?" },
          options: [
            { text: { es: "Que sufra un poco más: todavía no se lo merece.", en: "Let him suffer a little more: he does not deserve it yet." }, good: false, reply: { es: "Guardar el rencor es la mirada de la carne. La sabiduría mira como mira el Padre, que perdona antes de que terminemos de pedirlo.", en: "Holding a grudge is the way of the flesh. Wisdom looks as the Father looks, who forgives before we finish asking." } },
            { text: { es: "Lo perdono como Dios me perdona a mí, y empezamos de nuevo.", en: "I forgive him as God forgives me, and we begin again." }, good: true, reply: { es: "Perdonar así es ver con los ojos de Dios. El don se reconoce en esto: el amor llega antes que la cuenta de la deuda.", en: "To forgive like that is to see with God's eyes. The gift is known by this: love arrives before the reckoning of the debt." } }
          ]
        }
      ]
    },
    outro: [
      { speaker: "npc", text: { es: "Ya miras distinto, peregrino. El don de la sabiduría se ha encendido en ti, y en el Árbol de la plaza ha brotado un fruto nuevo.", en: "You already see differently, pilgrim. The gift of wisdom has been kindled in you, and on the Tree in the plaza a new fruit has grown." } },
      { speaker: "narrator", text: { es: "El don de ver las cosas como las ve Dios: con amor, eternidad y verdad. Nos hace gustar las cosas divinas y orientar la vida hacia lo que verdaderamente importa.", en: "The gift of seeing things as God sees them: with love, eternity, and truth. It makes us savor divine things and orient our lives toward what truly matters." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. Quiero mirar siempre como Tú miras.", en: "Thank You, Holy Spirit. I want to always see as You see." } }
    ],
    giftLine: { es: "Dame sabiduría para conocerte.", en: "Give me wisdom to know You." },
    fruit: { es: "caridad", en: "charity" }
  },
  {
    id: "entendimiento",
    giftIndex: 1,
    zoneId: "entendimiento",
    npcId: "maestra",
    intro: [
      { speaker: "npc", text: { es: "Bienvenido al Laberinto de la Palabra, peregrino. Aquí nadie se pierde si camina con el corazón abierto.", en: "Welcome to the Labyrinth of the Word, pilgrim. Here no one gets lost who walks with an open heart." } },
      { speaker: "npc", text: { es: "El entendimiento no es solo conocer la doctrina: es captarla con el corazón y dejarse transformar por ella.", en: "Understanding is not merely knowing doctrine: it is grasping it with the heart and allowing oneself to be transformed by it." } },
      { speaker: "player", text: { es: "¿Qué debo hacer entre estos setos, maestra?", en: "What must I do among these hedges, teacher?" } },
      { speaker: "npc", text: { es: "Cinco pergaminos de la parábola del sembrador están escondidos en el laberinto. Recógelos en el orden de la historia, lee cada uno al tomarlo, y al final responde una pregunta. El laberinto solo te dejará tomar el pergamino que sigue.", en: "Five scrolls of the Parable of the Sower are hidden in the labyrinth. Gather them in the order of the story, read each one as you take it, and at the end answer one question. The labyrinth will only let you take the scroll that comes next." } }
    ],
    challenge: {
      type: "collectOrder",
      items: [
        { x: -56, z: -2, label: { es: "Primer pergamino: junto al camino", en: "First scroll: by the path" }, text: { es: "Un sembrador salió a sembrar su semilla. Al sembrar, una parte cayó junto al camino, y vinieron las aves y se la comieron.", en: "A sower went out to sow his seed. As he sowed, some fell by the path, and the birds came and ate it up." } },
        { x: -72, z: -6, label: { es: "Segundo pergamino: el terreno pedregoso", en: "Second scroll: the rocky ground" }, text: { es: "Otra parte cayó en terreno pedregoso, donde no tenía mucha tierra. Brotó pronto, pero al salir el sol se quemó y, por no tener raíz, se secó.", en: "Some fell on rocky ground, where it had little soil. It sprang up quickly, but when the sun rose it was scorched and, having no root, it withered." } },
        { x: -64, z: -10, label: { es: "Tercer pergamino: entre espinas", en: "Third scroll: among thorns" }, text: { es: "Otra parte cayó entre espinas. Las espinas crecieron con ella y la ahogaron, y no dio fruto.", en: "Some fell among thorns. The thorns grew up with it and choked it, and it bore no fruit." } },
        { x: -72, z: 6, label: { es: "Cuarto pergamino: la tierra buena", en: "Fourth scroll: the good soil" }, text: { es: "Otra parte cayó en tierra buena y dio fruto: una ciento, otra sesenta y otra treinta por uno.", en: "Some fell on good soil and bore fruit: one a hundredfold, another sixty, another thirty." } },
        { x: -60, z: 10, label: { es: "Quinto pergamino: Jesús lo explica", en: "Fifth scroll: Jesus explains it" }, text: { es: "Y Jesús explicó: la semilla es la Palabra de Dios. La de la tierra buena son los que escuchan la Palabra con un corazón bueno y generoso, la conservan y dan fruto con perseverancia.", en: "And Jesus explained: the seed is the Word of God. The seed on the good soil are those who hear the Word with a good and generous heart, hold on to it, and bear fruit with perseverance." } }
      ],
      finalQuestion: {
        prompt: { es: "¿Qué significa la semilla que cayó en tierra buena?", en: "What does the seed that fell on good soil mean?" },
        options: [
          { text: { es: "Escuchar la Palabra con un corazón bueno, conservarla y dar fruto con perseverancia.", en: "To hear the Word with a good heart, hold on to it, and bear fruit with perseverance." }, good: true },
          { text: { es: "Entender la Palabra solo con la cabeza, sin dejar que cambie la vida.", en: "To understand the Word only with the head, without letting it change your life." }, good: false },
          { text: { es: "Tener buena suerte, para que todo salga bien sin esfuerzo.", en: "To have good luck, so that everything turns out well without effort." }, good: false }
        ]
      }
    },
    outro: [
      { speaker: "npc", text: { es: "Recorriste la parábola entera y la guardaste en el corazón. El don del entendimiento se ha encendido en ti, y un fruto nuevo crece en el Árbol.", en: "You walked the whole parable and kept it in your heart. The gift of understanding has been kindled in you, and a new fruit grows on the Tree." } },
      { speaker: "narrator", text: { es: "La capacidad de penetrar más profundamente en las verdades de la fe. No es solo conocer la doctrina, sino captarla con el corazón y dejarse transformar por ella.", en: "The capacity to penetrate more deeply into the truths of faith. Not merely knowing doctrine, but grasping it with the heart and allowing oneself to be transformed by it." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. Que tu Palabra eche raíz en mí.", en: "Thank You, Holy Spirit. May Your Word take root in me." } }
    ],
    giftLine: { es: "Dame entendimiento para amarte.", en: "Give me understanding to love You." },
    fruit: { es: "gozo", en: "joy" }
  },
  {
    id: "consejo",
    giftIndex: 2,
    zoneId: "consejo",
    npcId: "peregrino",
    intro: [
      { speaker: "npc", text: { es: "Detente un momento en la encrucijada, peregrino. Todo viajero llega hasta aquí con una duda en el bolsillo.", en: "Pause a moment at the crossroads, pilgrim. Every traveler arrives here with a doubt in his pocket." } },
      { speaker: "npc", text: { es: "El consejo es la luz práctica del Espíritu: discernir con rectitud qué hacer en cada situación, sin decidir por miedo ni por impulso.", en: "Counsel is the practical light of the Spirit: discerning rightly what to do in every situation, without deciding out of fear or impulse." } },
      { speaker: "player", text: { es: "Yo también traigo mis dudas, anciano.", en: "I carry my own doubts too, elder." } },
      { speaker: "npc", text: { es: "Entonces ayuda primero a cinco viajeros. Escucha su dilema y elige el consejo recto. Si aciertas cuatro de cinco, el don se encenderá en ti.", en: "Then help five travelers first. Listen to their dilemma and choose the right counsel. If you choose rightly four times out of five, the gift will be kindled in you." } }
    ],
    challenge: {
      type: "choices",
      need: 4,
      rounds: [
        {
          prompt: { es: "Una joven viajera te pregunta: «Me ofrecen trabajo en otra ciudad y no sé si irme. Tengo miedo.» ¿Qué le aconsejas?", en: "A young traveler asks you: 'I have been offered a job in another city and I do not know whether to go. I am afraid.' What do you counsel her?" },
          options: [
            { text: { es: "Quédate. Todo cambio es peligroso y lo seguro es no moverse.", en: "Stay. Every change is dangerous, and the safe thing is not to move." }, good: false, reply: { es: "Eso no es consejo: es el miedo disfrazado. El miedo cierra puertas que Dios quizá quiere abrir.", en: "That is not counsel: it is fear in disguise. Fear closes doors that God may want to open." } },
            { text: { es: "Vete hoy mismo, sin pensarlo. La vida es corta.", en: "Leave today, without thinking. Life is short." }, good: false, reply: { es: "Eso es impulso, no discernimiento. Decidir en caliente suele cobrarnos caro después.", en: "That is impulse, not discernment. Deciding in the heat of the moment usually costs us dearly later." } },
            { text: { es: "Ora, pide consejo a personas sabias, mira los frutos de cada opción y decide en paz.", en: "Pray, ask wise people for counsel, look at the fruits of each option, and decide in peace." }, good: true, reply: { es: "Eso es el don de consejo: luz práctica para discernir con rectitud, ni por miedo ni por impulso.", en: "That is the gift of counsel: practical light to discern rightly, neither out of fear nor out of impulse." } }
          ]
        },
        {
          prompt: { es: "Un padre de familia duda: «Un amigo me pide prestado el dinero de la renta. Nunca lo devuelve, pero me da pena negarme.» ¿Qué le aconsejas?", en: "A father hesitates: 'A friend asks to borrow the rent money. He never pays it back, but I feel bad refusing.' What do you counsel him?" },
          options: [
            { text: { es: "Dale todo ahora mismo, para que no piense mal de ti.", en: "Give him everything right now, so he does not think badly of you." }, good: false, reply: { es: "Ayudar para quedar bien es impulso y vanidad. La caridad verdadera también cuida la propia casa.", en: "Helping in order to look good is impulse and vanity. True charity also cares for one's own house." } },
            { text: { es: "No ayudes nunca a nadie: cada quien que se arregle como pueda.", en: "Never help anyone: let each person manage as they can." }, good: false, reply: { es: "Cerrar el corazón por miedo tampoco es consejo. El Espíritu no apaga la caridad: la ordena.", en: "Closing the heart out of fear is not counsel either. The Spirit does not put out charity: He orders it." } },
            { text: { es: "Ayúdale con lo que sí puedes dar sin desproteger a tu familia, con claridad y sin resentimiento.", en: "Help him with what you truly can give without leaving your family unprotected, with clarity and without resentment." }, good: true, reply: { es: "Consejo recto: generosidad con prudencia. Así se obra bien sin romper nada.", en: "Right counsel: generosity with prudence. That is how one does good without breaking anything." } }
          ]
        },
        {
          prompt: { es: "Una madre te confía: «Mi hijo adolescente se está alejando y no sé si corregirlo.» ¿Qué le aconsejas?", en: "A mother confides in you: 'My teenage son is drifting away and I do not know whether to correct him.' What do you counsel her?" },
          options: [
            { text: { es: "Regáñalo ahora mismo, delante de quien sea, para que aprenda.", en: "Scold him right now, in front of whoever is there, so he learns." }, good: false, reply: { es: "Corregir en caliente y con vergüenza hiere más de lo que sana. El impulso no es buen maestro.", en: "Correcting in the heat of the moment and with shame wounds more than it heals. Impulse is not a good teacher." } },
            { text: { es: "Mejor no digas nada: si se enoja, será peor.", en: "Better say nothing: if he gets angry, it will be worse." }, good: false, reply: { es: "Callar por miedo deja al hijo sin la luz que necesita. El temor no es consejero.", en: "Staying silent out of fear leaves the son without the light he needs. Fear is no counselor." } },
            { text: { es: "Espera un momento de calma y corrígele con amor y firmeza, en privado.", en: "Wait for a calm moment and correct him with love and firmness, in private." }, good: true, reply: { es: "Eso discierne el consejo: el momento justo, la palabra justa y el corazón en paz.", en: "That is what counsel discerns: the right moment, the right word, and a heart at peace." } }
          ]
        },
        {
          prompt: { es: "Un peregrino que acompaña a un enfermo duda entre el camino corto y peligroso y el camino largo y seguro. ¿Qué le aconsejas?", en: "A pilgrim accompanying a sick man hesitates between the short, dangerous road and the long, safe one. What do you counsel him?" },
          options: [
            { text: { es: "Vayan por el corto: Dios proveerá, no hay que dudar.", en: "Take the short one: God will provide, there is no room for doubt." }, good: false, reply: { es: "Confundir la fe con tentar a Dios es un impulso peligroso. La prudencia también es obra del Espíritu.", en: "Confusing faith with putting God to the test is a dangerous impulse. Prudence is also the Spirit's work." } },
            { text: { es: "Quédense aquí: viajar así es demasiado riesgo.", en: "Stay here: traveling like this is too risky." }, good: false, reply: { es: "El miedo que paraliza no viene del buen consejo. Hay un camino: solo hay que elegirlo bien.", en: "Paralyzing fear does not come from good counsel. There is a road: it only needs to be chosen well." } },
            { text: { es: "Vayan por el camino largo y seguro: la vida del enfermo vale más que las horas ahorradas.", en: "Take the long, safe road: the sick man's life is worth more than the hours saved." }, good: true, reply: { es: "Discernimiento recto: el consejo protege la vida y llega a la meta sin soberbia.", en: "Right discernment: counsel protects life and reaches the goal without pride." } }
          ]
        },
        {
          prompt: { es: "Una mujer ofendida te pregunta: «¿Hablo con quien me ofendió o me callo?» ¿Qué le aconsejas?", en: "An offended woman asks you: 'Should I speak with the one who offended me, or stay silent?' What do you counsel her?" },
          options: [
            { text: { es: "Cuéntaselo a todo el pueblo, para que sepan quién es esa persona.", en: "Tell the whole village, so they know who that person is." }, good: false, reply: { es: "Eso busca venganza, no paz. El impulso de desahogarse rompe más de lo que repara.", en: "That seeks revenge, not peace. The impulse to vent breaks more than it mends." } },
            { text: { es: "Cállate y aguanta, aunque el rencor te coma por dentro.", en: "Stay silent and bear it, even if resentment eats you inside." }, good: false, reply: { es: "Callar guardando rencor no es paz: es una herida cerrada en falso.", en: "Staying silent while holding a grudge is not peace: it is a wound closed over, unhealed." } },
            { text: { es: "Habla con esa persona en privado, con verdad y caridad, buscando la reconciliación.", en: "Speak with that person in private, with truth and charity, seeking reconciliation." }, good: true, reply: { es: "Ese es el consejo del Espíritu: verdad con amor, cara a cara, para sanar la relación.", en: "That is the Spirit's counsel: truth with love, face to face, to heal the relationship." } }
          ]
        }
      ]
    },
    outro: [
      { speaker: "npc", text: { es: "Cinco viajeros siguen su camino en paz gracias a tu palabra. El don de consejo se ha encendido en ti, y un fruto nuevo crece en el Árbol.", en: "Five travelers go on their way in peace thanks to your word. The gift of counsel has been kindled in you, and a new fruit grows on the Tree." } },
      { speaker: "narrator", text: { es: "El don de discernir con rectitud qué hacer en cada situación, especialmente ante las encrucijadas morales de la vida. Es la luz práctica del Espíritu para obrar bien.", en: "The gift of discerning rightly what to do in every situation, especially at the moral crossroads of life. It is the Spirit's practical light for acting well." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. Sé mi luz en cada encrucijada.", en: "Thank You, Holy Spirit. Be my light at every crossroads." } }
    ],
    giftLine: { es: "Dame consejo para seguirte.", en: "Give me counsel to follow You." },
    fruit: { es: "paz", en: "peace" }
  },
  {
    id: "fortaleza",
    giftIndex: 3,
    zoneId: "fortaleza",
    npcId: "centinela",
    intro: [
      { speaker: "npc", text: { es: "El desierto quema, peregrino, y la noche trae sombras. Pero nadie camina solo si invoca al Espíritu.", en: "The desert burns, pilgrim, and the night brings shadows. But no one walks alone who calls upon the Spirit." } },
      { speaker: "npc", text: { es: "La fortaleza es la valentía sobrenatural para mantenerse firme en el bien y no rendirse, aunque cueste.", en: "Fortitude is the supernatural courage to remain firm in goodness and not surrender, even when it costs." } },
      { speaker: "player", text: { es: "Mi lamparita es pequeña, centinela.", en: "My little lamp is small, sentinel." } },
      { speaker: "npc", text: { es: "Basta, si la cuidas. Diez sombras de tentación vendrán por ella. Repite la oración de la tentación y pulsa tu luz cuando se acerquen: «Espíritu Santo, ven ahora. Esto me supera. Dame tu fortaleza para esta hora.» Sentir la tentación no es pecar: rendirse, sí sería perder la lámpara.", en: "It is enough, if you guard it. Ten shadows of temptation will come for it. Repeat the prayer for temptation and release your light when they draw near: 'Holy Spirit, come now. This is too much for me. Give me Your strength for this hour.' Feeling temptation is not sinning: surrendering would be losing the lamp." } }
    ],
    challenge: {
      type: "arena",
      total: 10,
      hearts: 3,
      phrase: { es: "Espíritu Santo, ven ahora. Esto me supera. Dame tu fortaleza para esta hora.", en: "Holy Spirit, come now. This is too much for me. Give me Your strength for this hour." }
    },
    outro: [
      { speaker: "npc", text: { es: "La lámpara sigue encendida y las sombras se fueron. El don de fortaleza se ha encendido en ti, y un fruto nuevo crece en el Árbol.", en: "The lamp is still burning and the shadows are gone. The gift of fortitude has been kindled in you, and a new fruit grows on the Tree." } },
      { speaker: "narrator", text: { es: "La valentía sobrenatural para mantenerse firme en el bien, afrontar las dificultades sin rendirse y testimoniar la fe aunque cueste. Es el don de los mártires y los perseverantes.", en: "The supernatural courage to remain firm in goodness, face difficulties without surrendering, and witness to the faith even when it costs. It is the gift of martyrs and the perseverant." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. No quiero abandonarte jamás.", en: "Thank You, Holy Spirit. I never want to forsake You." } }
    ],
    giftLine: { es: "Dame fortaleza para no abandonarte.", en: "Give me fortitude never to forsake You." },
    fruit: { es: "paciencia", en: "patience" }
  },
  {
    id: "ciencia",
    giftIndex: 4,
    zoneId: "ciencia",
    npcId: "jardinera",
    intro: [
      { speaker: "npc", text: { es: "Pasea despacio por el jardín, peregrino. Aquí todo habla, si sabes mirar.", en: "Walk slowly through the garden, pilgrim. Here everything speaks, if you know how to look." } },
      { speaker: "npc", text: { es: "La ciencia del Espíritu nos enseña a juzgar las cosas del mundo a la luz de Dios: ver las criaturas como caminos hacia el Creador, y no como fines en sí mismas.", en: "The Spirit's knowledge teaches us to judge the things of the world in the light of God: to see creatures as paths toward the Creator, and not as ends in themselves." } },
      { speaker: "player", text: { es: "A veces solo veo cosas, jardinera.", en: "Sometimes I only see things, gardener." } },
      { speaker: "npc", text: { es: "Busca las siete huellas de luz escondidas junto a la creación: el árbol, el río, la roca, las flores, el manantial, la montaña y una rama alta. Acércate a cada una y escucha lo que te dice de Dios.", en: "Look for the seven traces of light hidden beside creation: the tree, the river, the rock, the flowers, the spring, the mountain, and a high branch. Draw near to each one and listen to what it tells you about God." } }
    ],
    challenge: {
      type: "find",
      spots: [
        { x: 43, z: 43, near: "tree", line: { es: "En el árbol veo la paciencia de Dios: crece en silencio, día tras día, y da sombra y fruto sin hacer ruido.", en: "In the tree I see God's patience: it grows in silence, day after day, and gives shade and fruit without making noise." } },
        { x: 50, z: 60, near: "river", line: { es: "El río nunca se detiene y siempre llega. Así es el Espíritu, agua viva: busca sin cansarse el corazón de cada persona.", en: "The river never stops and always arrives. So is the Spirit, living water: He seeks the heart of every person without tiring." } },
        { x: 57, z: 52, near: "rock", line: { es: "La roca no se mueve con el viento. Así es la fidelidad de Dios: firme ayer, hoy y siempre.", en: "The rock does not move with the wind. So is God's faithfulness: firm yesterday, today, and forever." } },
        { x: 46, z: 54, near: "flower", line: { es: "La flor no se preocupa por su belleza: simplemente se abre al sol. Así el alma que se abre a Dios florece sin esfuerzo.", en: "The flower does not worry about its beauty: it simply opens to the sun. So the soul that opens to God blooms without striving." } },
        { x: 59, z: 55, near: "spring", line: { es: "El manantial brota de lo escondido y da su agua a todos. Así actúa el Espíritu en lo secreto del corazón, y lo renueva todo.", en: "The spring flows from what is hidden and gives its water to everyone. So the Spirit acts in the secret of the heart, and renews everything." } },
        { x: 39, z: 43, near: "mountain", line: { es: "La montaña apunta al cielo sin decir una palabra. Toda la creación, si la miras bien, señala a su Creador.", en: "The mountain points to heaven without saying a word. All creation, if you look at it well, points to its Creator." } },
        { x: 58, z: 43, near: "tree", line: { es: "Desde la rama alta, el pájaro ve todo el jardín. Así levanta el don de ciencia mi mirada: ver cada criatura como un camino hacia el Creador.", en: "From the high branch, the bird sees the whole garden. So the gift of knowledge lifts my gaze: to see every creature as a path toward the Creator." } }
      ]
    },
    outro: [
      { speaker: "npc", text: { es: "Encontraste las siete huellas y el jardín entero te habló de Dios. El don de ciencia se ha encendido en ti, y un fruto nuevo crece en el Árbol.", en: "You found the seven traces, and the whole garden spoke to you of God. The gift of knowledge has been kindled in you, and a new fruit grows on the Tree." } },
      { speaker: "narrator", text: { es: "El don que nos permite juzgar rectamente las realidades del mundo a la luz de Dios: ver las criaturas como caminos hacia el Creador y no como fines en sí mismas.", en: "The gift that enables us to judge the realities of the world rightly in the light of God: to see creatures as paths toward the Creator and not as ends in themselves." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. Quiero encontrarte en todo.", en: "Thank You, Holy Spirit. I want to find You in all things." } }
    ],
    giftLine: { es: "Dame ciencia para encontrarte en todo.", en: "Give me knowledge to find You in all things." },
    fruit: { es: "longanimidad", en: "kindness" }
  },
  {
    id: "piedad",
    giftIndex: 5,
    zoneId: "piedad",
    npcId: "madre",
    intro: [
      { speaker: "npc", text: { es: "Bienvenido a la aldea, peregrino. Aquí la piedad se vive con las manos y con los pies.", en: "Welcome to the village, pilgrim. Here piety is lived with the hands and with the feet." } },
      { speaker: "npc", text: { es: "Este don nos hace tratar a Dios con ternura de hijos y a los demás con amor de hermanos.", en: "This gift makes us approach God with a child's tenderness and others with brotherly love." } },
      { speaker: "player", text: { es: "¿Por dónde empiezo, madre?", en: "Where do I begin, mother?" } },
      { speaker: "npc", text: { es: "Por los vecinos que esperan: un anciano sin pan, una madre sin agua, un enfermo con frío, una viuda sin leña y un niño que quiere llegar a la capilla. Cinco encargos, uno tras otro, y la aldea entera respirará.", en: "With the neighbors who are waiting: an old man without bread, a mother without water, a sick man who is cold, a widow without firewood, and a child who wants to reach the chapel. Five errands, one after another, and the whole village will breathe." } }
    ],
    challenge: {
      type: "deliver",
      steps: [
        {
          fromPoint: { x: 64, z: 3, label: { es: "El puesto de pan", en: "The bread stall" } },
          toPoint: { x: 61, z: -7, label: { es: "La casa del anciano", en: "The old man's house" } },
          item: { es: "una hogaza de pan", en: "a loaf of bread" },
          line: { es: "El anciano sonríe y se santigua despacio: «Que Dios te pague, hijo. Hoy comeré en paz.»", en: "The old man smiles and slowly makes the sign of the cross: 'May God repay you, son. Today I will eat in peace.'" }
        },
        {
          fromPoint: { x: 68, z: 0, label: { es: "El pozo de la aldea", en: "The village well" } },
          toPoint: { x: 75, z: 6, label: { es: "La casa de la madre", en: "The mother's house" } },
          item: { es: "un cántaro de agua", en: "a jar of water" },
          line: { es: "La madre recibe el cántaro con las dos manos y suspira aliviada: «Mis hijos tendrán agua fresca esta noche.»", en: "The mother receives the jar with both hands and sighs with relief: 'My children will have fresh water tonight.'" }
        },
        {
          fromPoint: { x: 68, z: -12, label: { es: "La casa grande", en: "The big house" } },
          toPoint: { x: 61, z: 6, label: { es: "La casa del enfermo", en: "The sick man's house" } },
          item: { es: "una manta tejida", en: "a woven blanket" },
          line: { es: "El enfermo se cubre con la manta y dice bajito: «Ya no tengo frío. Gracias por acordarte de mí.»", en: "The sick man covers himself with the blanket and says softly: 'I am not cold anymore. Thank you for remembering me.'" }
        },
        {
          fromPoint: { x: 72, z: -3, label: { es: "La pila de leña", en: "The woodpile" } },
          toPoint: { x: 75, z: -7, label: { es: "La casa de la viuda", en: "The widow's house" } },
          item: { es: "un haz de leña", en: "a bundle of firewood" },
          line: { es: "La viuda abre la puerta con lágrimas de gozo: «Esta noche mi casa estará caliente, y rezaré por ti.»", en: "The widow opens the door with tears of joy: 'Tonight my house will be warm, and I will pray for you.'" }
        },
        {
          fromPoint: { x: 66, z: -2, label: { es: "El niño que espera", en: "The waiting child" } },
          toPoint: { x: 68, z: 12, label: { es: "La capilla de la aldea", en: "The village chapel" } },
          item: { es: "el niño de la aldea", en: "the village child" },
          line: { es: "El niño entra en la capilla de tu mano y susurra: «Aquí se está bien. Aquí vive Dios.»", en: "The child enters the chapel holding your hand and whispers: 'It is good here. God lives here.'" }
        }
      ]
    },
    outro: [
      { speaker: "npc", text: { es: "La aldea entera ha recibido tu caridad, peregrino. El don de piedad se ha encendido en ti, y un fruto nuevo crece en el Árbol.", en: "The whole village has received your charity, pilgrim. The gift of piety has been kindled in you, and a new fruit grows on the Tree." } },
      { speaker: "narrator", text: { es: "El don de la filial devoción a Dios Padre y de la caridad fraterna hacia todos los hombres. Nos hace tratar a Dios con ternura de hijos y a los demás con amor de hermanos.", en: "The gift of filial devotion to God the Father and fraternal charity toward all people. It makes us approach God with a child's tenderness and others with brotherly love." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. Quiero servirte con amor en cada hermano.", en: "Thank You, Holy Spirit. I want to serve You with love in every brother and sister." } }
    ],
    giftLine: { es: "Dame piedad para servirte con amor.", en: "Give me piety to serve You with love." },
    fruit: { es: "bondad", en: "goodness" }
  },
  {
    id: "temor",
    giftIndex: 6,
    zoneId: "temor",
    npcId: "guardian",
    intro: [
      { speaker: "npc", text: { es: "Habla en voz baja, peregrino. Estás ante el templo, y la noche es honda.", en: "Speak softly, pilgrim. You are before the temple, and the night is deep." } },
      { speaker: "npc", text: { es: "El temor de Dios no es el miedo que esclaviza: es la reverencia filial ante su grandeza y el horror al pecado que nos separa de Él.", en: "The fear of the Lord is not the fear that enslaves: it is the filial reverence before His greatness and the horror of sin that separates us from Him." } },
      { speaker: "player", text: { es: "El puente sobre la oscuridad me impone, guardián.", en: "The bridge over the darkness awes me, guardian." } },
      { speaker: "npc", text: { es: "Crúzalo losa a losa. Solo la siguiente losa estará encendida: pisa donde hay luz y no sigas los orbes que distraen, porque te harían volver al inicio. Al otro lado te espera el altar del Temor.", en: "Cross it tile by tile. Only the next tile will be lit: step where there is light and do not follow the orbs that distract, for they would send you back to the start. On the other side, the altar of the Fear of the Lord awaits you." } }
    ],
    challenge: {
      type: "tiles",
      from: { x: 41, z: -41 },
      to: { x: 53, z: -55 },
      steps: 10,
      tileSize: 1.6,
      pathOffsets: [0, 0.4, 0.8, 0.6, 0.2, -0.3, -0.6, -0.3, 0.1, 0],
      distractors: [
        { x: 46, z: -43 },
        { x: 45, z: -50 },
        { x: 52, z: -50 }
      ]
    },
    outro: [
      { speaker: "npc", text: { es: "Cruzaste en reverencia, paso a paso, sin apartar los ojos de la luz. El don del temor de Dios se ha encendido en ti, y un fruto nuevo crece en el Árbol.", en: "You crossed in reverence, step by step, without taking your eyes off the light. The gift of the fear of the Lord has been kindled in you, and a new fruit grows on the Tree." } },
      { speaker: "narrator", text: { es: "No el miedo que esclaviza, sino la reverencia filial ante la grandeza de Dios y el horror al pecado que nos separa de Él. Es el comienzo de la sabiduría y la raíz de la santidad.", en: "Not the fear that enslaves, but the filial reverence before God's greatness and the horror of sin that separates us from Him. It is the beginning of wisdom and the root of holiness." } },
      { speaker: "player", text: { es: "Gracias, Espíritu Santo. No quiero ofenderte jamás: quiero quedarme siempre en tu luz.", en: "Thank You, Holy Spirit. I never want to offend You: I want to remain always in Your light." } }
    ],
    giftLine: { es: "Dame temor santo para no ofenderte jamás.", en: "Give me holy fear never to offend You." },
    fruit: { es: "benignidad", en: "generosity" }
  }
];
