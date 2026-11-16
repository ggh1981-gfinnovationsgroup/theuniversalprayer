'use strict';
/*
 * content-charisms.js — Libro de Oración y pruebas de carismas de
 * «El Camino del Espíritu» / «The Way of the Spirit».
 *
 * window.RPG_PRAYERS: textos EXACTOS de la página /espiritu/ (los cinco pasos,
 * los cuatro momentos, las frases breves) y de data/espiritu.json (la oración
 * «Ven, Espíritu Santo», la invocación en verso y la oración de cierre).
 * Cada entrada lleva un id estable para los puntos de lectura única.
 *
 * window.RPG_CHARISMS: las nueve pruebas de carismas (50 puntos de gracia
 * cada una), en el orden de data/espiritu.json (charismIndex 0..8).
 */

window.RPG_PRAYERS = {
  steps: [
    {
      id: 'step-1',
      title: { es: 'Adóralo', en: 'Adore Him' },
      phrase: {
        es: '«Espíritu Santo, te adoro. Eres mi Dios y mi Señor, igual al Padre y al Hijo.»',
        en: 'Holy Spirit, I adore You. You are my God and my Lord, equal to the Father and the Son.'
      }
    },
    {
      id: 'step-2',
      title: { es: 'Háblale de tú', en: 'Speak to Him personally' },
      phrase: {
        es: '«Espíritu Santo, Tú estás aquí. Quiero hablar contigo, no solo de Ti.»',
        en: 'Holy Spirit, You are here. I want to speak with You, not only about You.'
      }
    },
    {
      id: 'step-3',
      title: { es: 'Recuerda dónde vive', en: 'Remember where He dwells' },
      phrase: {
        es: '«Dulce huésped de mi alma, gracias por quedarte en mí, aun cuando yo no te recuerdo.»',
        en: 'Sweet guest of my soul, thank You for staying in me, even when I forget You.'
      }
    },
    {
      id: 'step-4',
      title: { es: 'Déjate llevar al Padre', en: 'Let Him lead you to the Father' },
      phrase: {
        es: '«Espíritu de mi Padre, enséñame a decir “Abba” con confianza y a decir “Jesús es Señor” con el corazón.»',
        en: 'Spirit of my Father, teach me to say “Abba” with trust and to say “Jesus is Lord” with my heart.'
      }
    },
    {
      id: 'step-5',
      title: { es: 'Agradécele y pídele perdón', en: 'Thank Him and ask forgiveness' },
      phrase: {
        es: '«Gracias por todo lo que haces en mí sin que yo lo note. Perdóname por las veces que te he entristecido.»',
        en: 'Thank You for all You do in me without my noticing. Forgive me for the times I have grieved You.'
      }
    }
  ],
  moments: [
    {
      id: 'moment-1',
      title: { es: 'En la mañana', en: 'In the morning' },
      phrase: {
        es: '«Espíritu Santo, toma mi mente, mis palabras y mis decisiones. Guíame hoy para no apartarme de la voluntad de Dios.»',
        en: "Holy Spirit, take my mind, my words, and my decisions. Guide me today so I do not turn away from God's will."
      }
    },
    {
      id: 'moment-2',
      title: { es: 'Cuando no sabes qué hacer', en: 'When you do not know what to do' },
      phrase: {
        es: '«Espíritu de consejo, muéstrame el camino correcto. No quiero decidir solo por miedo o impulsos.»',
        en: 'Spirit of counsel, show me the right way. I do not want to decide only from fear or impulse.'
      }
    },
    {
      id: 'moment-3',
      title: { es: 'Cuando estás cansado o tentado', en: 'When you are tired or tempted' },
      phrase: {
        es: '«Espíritu Santo, fortalece mi corazón. Dame firmeza para resistir el mal y amor para volver al bien.»',
        en: 'Holy Spirit, strengthen my heart. Give me firmness to resist evil and love to return to good.'
      }
    },
    {
      id: 'moment-4',
      title: { es: 'Cuando no sientes nada', en: 'When you feel nothing' },
      phrase: {
        es: '«Espíritu de Dios, aunque no te sienta, quédate conmigo. Ora en mí, suspira en mí y lléname de paz.»',
        en: 'Spirit of God, even when I do not feel You, stay with me. Pray in me, sigh in me, and fill me with peace.'
      }
    }
  ],
  short: [
    {
      id: 'short-1',
      phrase: { es: 'Ven, Espíritu Santo.', en: 'Come, Holy Spirit.' },
      sub: { es: 'No quiero ir solo.', en: 'I do not want to go alone.' }
    },
    {
      id: 'short-2',
      phrase: { es: 'Ilumíname.', en: 'Enlighten me.' },
      sub: { es: 'Muéstrame lo que viene de Dios.', en: 'Show me what comes from God.' }
    },
    {
      id: 'short-3',
      phrase: { es: 'Dame paz.', en: 'Give me peace.' },
      sub: { es: 'Ordena lo que está agitado dentro de mí.', en: 'Order what is restless within me.' }
    },
    {
      id: 'short-4',
      phrase: { es: 'Fortaléceme.', en: 'Strengthen me.' },
      sub: { es: 'No dejes que me rinda ante el mal.', en: 'Do not let me surrender to evil.' }
    }
  ],
  prayer: {
    es: 'Ven, Espíritu Santo, llena los corazones de Tus fieles y enciende en ellos el fuego de Tu amor. Envía Tu Espíritu y serán creadas todas las cosas, y renovarás la faz de la tierra.',
    en: 'Come, Holy Spirit, fill the hearts of Your faithful and kindle in them the fire of Your love. Send forth Your Spirit and they shall be created, and You shall renew the face of the earth.'
  },
  invocation: {
    es: 'Ven, Espíritu Santo,\nrayo de luz celestial;\nDios de amor, en Ti confío,\nguía mis pasos en verdad.\n\nEres el Consolador prometido,\nDefensor del alma fiel,\nfuego que purifica y renueva,\nagua viva de todo bien.\n\nVen a mí con Tus siete dones,\nabre mi mente y mi corazón,\nconcédeme la gracia santa\nde vivir en Tu comunión.\n\nAmén.',
    en: 'Come, Holy Spirit,\nray of heavenly light;\nGod of love, in You I trust,\nguide my steps in truth and right.\n\nYou are the promised Consoler,\nDefender of the faithful soul,\nfire that purifies and renews,\nliving water making whole.\n\nCome to me with Your seven gifts,\nopen my mind and heart to Thee,\ngrant me the holy grace to live\nin Your communion, ever free.\n\nAmen.'
  },
  closing: {
    es: 'Espíritu Santo, Señor y dador de vida:\nconcédeme los dones que necesito para cumplir Tu voluntad.\nDame sabiduría para conocerte,\nentendimiento para amarte,\nconsejo para seguirte,\nfortaleza para no abandonarte,\nciencia para encontrarte en todo,\npiedad para servirte con amor\ny temor santo para no ofenderte jamás.\n\nEnciende en mí el fuego de Tu amor.\nHaz de mí una morada digna de Tu presencia.\nAmén.',
    en: 'Holy Spirit, Lord and giver of life:\ngrant me the gifts I need to fulfill Your will.\nGive me wisdom to know You,\nunderstanding to love You,\ncounsel to follow You,\nfortitude never to forsake You,\nknowledge to find You in all things,\npiety to serve You with love,\nand holy fear never to offend You.\n\nKindle in me the fire of Your love.\nMake of me a dwelling worthy of Your presence.\nAmen.'
  }
};

window.RPG_CHARISMS = [
  {
    id: 'carisma-palabra-de-sabiduria',
    charismIndex: 0,
    x: -42, z: -40,
    zoneId: 'sabiduria',
    title: { es: 'Palabra de Sabiduría', en: 'Word of Wisdom' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'En el camino hacia el Mirador, una viuda está sentada junto a una piedra. Llora a su esposo, muerto hace pocos días, y nadie se ha detenido a consolarla.',
          en: 'On the road to the Lookout, a widow sits beside a stone. She mourns her husband, who died a few days ago, and no one has stopped to console her.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'Espíritu Santo, este es el momento de la Palabra de Sabiduría: no la que se alcanza estudiando, sino la que Tú revelas en el momento preciso para iluminar y consolar.',
          en: 'Holy Spirit, this is the moment for the Word of Wisdom: not the kind reached by studying, but the kind You reveal at the precise moment to enlighten and console.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'Dame la palabra justa para esta mujer.',
          en: 'Give me the right word for this woman.'
        }
      }
    ],
    challenge: {
      type: 'choices',
      need: 1,
      rounds: [
        {
          prompt: {
            es: 'La viuda levanta la mirada y te dice entre lágrimas: “Dios me ha abandonado. Ya no me queda nada”. ¿Qué palabra le das?',
            en: 'The widow looks up and says to you through her tears: “God has abandoned me. I have nothing left.” What word do you give her?'
          },
          options: [
            {
              text: {
                es: 'Dios no la ha abandonado: Él está cerca de los que tienen el corazón roto. Su esposo vive en la esperanza de la resurrección, y usted no caminará sola: el Señor la sostiene hoy.',
                en: 'God has not abandoned you: He is close to the brokenhearted. Your husband lives in the hope of the resurrection, and you will not walk alone: the Lord sustains you today.'
              },
              good: true,
              reply: {
                es: 'La viuda respira hondo y, por primera vez en días, una paz pequeña aparece en su rostro. Era la palabra que iluminaba su noche.',
                en: 'The widow breathes deeply and, for the first time in days, a small peace appears on her face. It was the word that lit up her night.'
              }
            },
            {
              text: {
                es: 'Ya no llore. Tiene que ser fuerte y olvidar pronto, porque la vida sigue.',
                en: 'Stop crying. You must be strong and forget soon, because life goes on.'
              },
              good: false,
              reply: {
                es: 'La viuda baja la cabeza. La frase era verdadera a medias, pero llegó sin amor y sin luz: no consoló.',
                en: 'The widow lowers her head. The sentence was half true, but it came without love and without light: it did not console.'
              }
            },
            {
              text: {
                es: 'Quizá esto le pasa porque en su casa no se rezaba lo suficiente.',
                en: 'Perhaps this happened to you because your household did not pray enough.'
              },
              good: false,
              reply: {
                es: 'La viuda se encoge, herida. Una palabra que acusa no viene de la sabiduría de Dios.',
                en: 'The widow shrinks back, wounded. A word that accuses does not come from the wisdom of God.'
              }
            }
          ]
        }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'La viuda se levanta y sigue su camino con el corazón más ligero. La llamita del altar se apaga: la Palabra quedó sembrada.',
          en: 'The widow stands and continues on her way with a lighter heart. The little flame on the altar goes out: the Word has been sown.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-palabra-de-conocimiento',
    charismIndex: 1,
    x: -60, z: 10,
    zoneId: 'entendimiento',
    title: { es: 'Palabra de Conocimiento', en: 'Word of Knowledge' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'Cerca del Laberinto de la Palabra, un desconocido se acerca por el camino. No lo conoces de nada, y sin embargo el Espíritu quiere mostrarte algo de su vida interior.',
          en: 'Near the Labyrinth of the Word, a stranger approaches along the road. You do not know him at all, and yet the Spirit wants to show you something about his interior life.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'La Palabra de Conocimiento no se adivina: se recibe. Espíritu Santo, abre mis ojos a lo que solo Tú conoces de este hombre.',
          en: 'The Word of Knowledge is not guessed: it is received. Holy Spirit, open my eyes to what only You know about this man.'
        }
      }
    ],
    challenge: {
      type: 'choices',
      need: 1,
      rounds: [
        {
          prompt: {
            es: 'El desconocido saluda: “La paz esté contigo, peregrino”. Al hablar, tose y se lleva una mano al pecho; la otra mano, herida y vendada, la esconde detrás de la espalda y baja la mirada, avergonzado. ¿Qué necesita de verdad?',
            en: 'The stranger greets you: “Peace be with you, pilgrim.” As he speaks, he coughs and presses one hand to his chest; the other hand, wounded and bandaged, he hides behind his back and lowers his eyes, ashamed. What does he truly need?'
          },
          options: [
            {
              text: {
                es: 'Necesita sanación y consuelo: está enfermo, su mano herida le duele y la vergüenza lo hace esconderla. Hay que orar por él y ayudarlo sin humillarlo.',
                en: 'He needs healing and comfort: he is ill, his wounded hand pains him, and shame makes him hide it. You must pray for him and help him without humiliating him.'
              },
              good: true,
              reply: {
                es: 'Al oírlo, el hombre se detiene asombrado: nadie podía saberlo. Muestra su mano y deja que oren por él.',
                en: 'Hearing this, the man stops in amazement: no one could have known. He shows his hand and lets you pray for him.'
              }
            },
            {
              text: {
                es: 'Necesita que lo dejen en paz: quien esconde algo detrás de la espalda no trae nada bueno.',
                en: 'He needs to be left alone: whoever hides something behind his back is up to no good.'
              },
              good: false,
              reply: {
                es: 'El hombre sigue su camino, tosiendo. La sospecha cerró la puerta que el Espíritu quería abrir.',
                en: 'The man walks on, coughing. Suspicion closed the door the Spirit wanted to open.'
              }
            },
            {
              text: {
                es: 'Necesita una corrección firme: seguro que su herida es castigo de algún pecado oculto.',
                en: 'He needs a firm correction: surely his wound is punishment for some hidden sin.'
              },
              good: false,
              reply: {
                es: 'El desconocido aprieta la mano sana y se aleja. Juzgar sin conocer no es la Palabra de Conocimiento.',
                en: 'The stranger clenches his healthy hand and walks away. Judging without knowing is not the Word of Knowledge.'
              }
            }
          ]
        }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'El desconocido se marcha erguido, con la mano vendada ya sin esconder. El Espíritu te mostró lo que ningún ojo podía ver.',
          en: 'The stranger walks away upright, his bandaged hand no longer hidden. The Spirit showed you what no eye could see.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-fe-extraordinaria',
    charismIndex: 2,
    x: 48, z: 44,
    zoneId: 'ciencia',
    title: { es: 'Fe Extraordinaria', en: 'Gift of Faith' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'En el camino hacia el Jardín de la Creación, un arroyo crecido se ha llevado el puente. Solo quedan las piedras de las dos orillas y el agua corriendo.',
          en: 'On the road to the Garden of Creation, a swollen stream has carried away the bridge. Only the stones of the two banks and the running water remain.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'No es la fe de todos los días: es la confianza que actúa ahora mismo, sin dudar ante lo imposible. Señor, creo; caminaré sobre tu palabra.',
          en: 'This is not everyday faith: it is the trust that acts right now, without doubting before the impossible. Lord, I believe; I will walk on Your word.'
        }
      }
    ],
    challenge: {
      type: 'tiles',
      from: { x: 48, z: 44 },
      to: { x: 48, z: 35 },
      steps: 6,
      tileSize: 1.5,
      distractors: []
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'Desde la otra orilla miras atrás: las tablas ya no están. Estuvieron bajo tus pies justo cuando las necesitaste. Eso es la Fe Extraordinaria.',
          en: 'From the other bank you look back: the planks are gone. They were under your feet exactly when you needed them. That is the Gift of Faith.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-dones-de-sanacion',
    charismIndex: 3,
    x: 60, z: -2,
    zoneId: 'piedad',
    title: { es: 'Dones de Sanación', en: 'Gifts of Healing' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'A la entrada de la Aldea, un hombre enfermo yace junto al camino, temblando de fiebre. Su familia ya no sabe qué hacer por él.',
          en: 'At the entrance of the Village, a sick man lies beside the road, trembling with fever. His family no longer knows what to do for him.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'Los dones de sanación son la compasión de Cristo que sigue actuando en su Iglesia. Espíritu Santo, hazme tu instrumento: pon en orden, en mis labios, la oración por este hermano.',
          en: 'The gifts of healing are the compassion of Christ still at work in His Church. Holy Spirit, make me Your instrument: put in order, on my lips, the prayer for this brother.'
        }
      }
    ],
    challenge: {
      type: 'prayerLines',
      lines: [
        { es: 'Espíritu Santo, Consolador, ven sobre este hermano enfermo.', en: 'Holy Spirit, Consoler, come upon this sick brother.' },
        { es: 'Pon tu mano de amor sobre su cuerpo y sobre su corazón.', en: 'Lay Your hand of love upon his body and upon his heart.' },
        { es: 'Sana lo que está herido y renueva lo que está débil.', en: 'Heal what is wounded and renew what is weak.' },
        { es: 'Que tu paz lo llene y tu fuego le devuelva la vida.', en: 'May Your peace fill him and Your fire restore his life.' }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'El enfermo abre los ojos y pide agua, sereno. La fiebre cede y su familia llora de alegría: Cristo sigue sanando.',
          en: 'The sick man opens his eyes and calmly asks for water. The fever breaks and his family weeps for joy: Christ is still healing.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-obrar-milagros',
    charismIndex: 4,
    x: 12, z: 14,
    zoneId: 'plaza',
    title: { es: 'Obrar Milagros', en: 'Working of Miracles' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'En la plaza hay una multitud cansada y con hambre, y junto al altar solo una canasta con cinco panes. Humanamente, no alcanza para nadie.',
          en: 'In the square there is a tired, hungry crowd, and beside the altar only a basket with five loaves. Humanly speaking, it is not enough for anyone.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'Los milagros son señales del Reino: Cristo ha vencido, y su victoria tiene consecuencias hoy. Tomaré la canasta y repartiré el pan.',
          en: 'Miracles are signs of the Kingdom: Christ has conquered, and His victory has consequences today. I will take the basket and share the bread.'
        }
      }
    ],
    challenge: {
      type: 'deliver',
      steps: [
        {
          fromPoint: { x: 12, z: 14, label: { es: 'La canasta de los cinco panes', en: 'The basket of the five loaves' } },
          toPoint: { x: 18, z: 10, label: { es: 'La familia junto al pozo', en: 'The family by the well' } },
          item: { es: 'pan', en: 'bread' },
          line: {
            es: 'Entregas pan a la familia del pozo. La madre lo parte y sonríe: alcanza para todos sus hijos.',
            en: 'You give bread to the family by the well. The mother breaks it and smiles: there is enough for all her children.'
          }
        },
        {
          fromPoint: { x: 12, z: 14, label: { es: 'La canasta de los cinco panes', en: 'The basket of the five loaves' } },
          toPoint: { x: 6, z: 20, label: { es: 'La familia bajo el olivo', en: 'The family under the olive tree' } },
          item: { es: 'pan', en: 'bread' },
          line: {
            es: 'Bajo el olivo, el anciano recibe el pan con las dos manos. Miras la canasta: el pan no disminuye.',
            en: 'Under the olive tree, the old man receives the bread with both hands. You glance at the basket: the bread has not diminished.'
          }
        },
        {
          fromPoint: { x: 12, z: 14, label: { es: 'La canasta de los cinco panes', en: 'The basket of the five loaves' } },
          toPoint: { x: 20, z: 18, label: { es: 'La familia de la casa de adobe', en: 'The family of the mud-brick house' } },
          item: { es: 'pan', en: 'bread' },
          line: {
            es: 'En la casa de adobe comparten el pan con los vecinos que van llegando. La canasta sigue llena, como al principio.',
            en: 'In the mud-brick house they share the bread with the neighbors who keep arriving. The basket is still full, as at the beginning.'
          }
        },
        {
          fromPoint: { x: 12, z: 14, label: { es: 'La canasta de los cinco panes', en: 'The basket of the five loaves' } },
          toPoint: { x: 4, z: 8, label: { es: 'La familia junto al camino', en: 'The family beside the road' } },
          item: { es: 'pan', en: 'bread' },
          line: {
            es: 'La familia del camino come y da gracias en voz alta. El pan de la canasta parece no tener fin.',
            en: 'The family beside the road eats and gives thanks aloud. The bread in the basket seems endless.'
          }
        },
        {
          fromPoint: { x: 12, z: 14, label: { es: 'La canasta de los cinco panes', en: 'The basket of the five loaves' } },
          toPoint: { x: 16, z: 22, label: { es: 'La familia cerca de la capilla', en: 'The family near the chapel' } },
          item: { es: 'pan', en: 'bread' },
          line: {
            es: 'La última familia come junto a la capilla y la multitud entera queda saciada. Cinco panes, y la canasta nunca se vació.',
            en: 'The last family eats near the chapel and the whole crowd is satisfied. Five loaves, and the basket never emptied.'
          }
        }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'Devuelves la canasta al altar: todavía tiene pan. Y la multitud no habla de la canasta, sino de Dios.',
          en: 'You return the basket to the altar: it still holds bread. And the crowd speaks not of the basket, but of God.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-profecia',
    charismIndex: 5,
    x: -10, z: 12,
    zoneId: 'plaza',
    title: { es: 'Profecía', en: 'Prophecy' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'La comunidad está reunida en la plaza, cansada y dividida por una discusión larga. Todos esperan una palabra que venga de Dios.',
          en: 'The community is gathered in the square, tired and divided by a long argument. Everyone awaits a word that comes from God.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'La profecía no es adivinar el futuro: es proclamar tu Palabra viva para edificar, consolar y exhortar. Espíritu Santo, habla por mí.',
          en: 'Prophecy is not guessing the future: it is proclaiming Your living Word to build up, console, and exhort. Holy Spirit, speak through me.'
        }
      }
    ],
    challenge: {
      type: 'choices',
      need: 1,
      rounds: [
        {
          prompt: {
            es: 'Te levantas en medio de la plaza y la gente guarda silencio. ¿Qué proclamación haces?',
            en: 'You stand up in the middle of the square and the people fall silent. What proclamation do you make?'
          },
          options: [
            {
              text: {
                es: 'Así dice el Señor: levanten el corazón, porque estoy en medio de ustedes. Perdónense como hermanos, ámense hoy y perseveren en la esperanza: yo no los he abandonado.',
                en: 'Thus says the Lord: lift up your hearts, for I am in your midst. Forgive one another as brothers and sisters, love today, and persevere in hope: I have not abandoned you.'
              },
              good: true,
              reply: {
                es: 'La plaza queda en silencio, y luego se abrazan los que discutían. La palabra edificó, consoló y exhortó: eso es profecía.',
                en: 'The square falls silent, and then those who were arguing embrace one another. The word built up, consoled, and exhorted: that is prophecy.'
              }
            },
            {
              text: {
                es: 'El Señor me reveló la fecha exacta de los grandes sucesos que vienen, y solo yo puedo interpretarlos.',
                en: 'The Lord revealed to me the exact date of the great events to come, and only I can interpret them.'
              },
              good: false,
              reply: {
                es: 'La gente se inquieta y te rodea con preguntas ansiosas. Anunciar fechas para lucirse no edifica a la comunidad.',
                en: 'The people grow restless and crowd around you with anxious questions. Announcing dates to show off does not build up the community.'
              }
            },
            {
              text: {
                es: 'Dios está harto de este pueblo: vienen castigos, y cada uno pagará por lo suyo.',
                en: 'God is fed up with this people: punishments are coming, and each one will pay for their own deeds.'
              },
              good: false,
              reply: {
                es: 'La multitud se dispersa con miedo. Una palabra que solo amenaza y divide no es la voz del Paráclito.',
                en: 'The crowd scatters in fear. A word that only threatens and divides is not the voice of the Paraclete.'
              }
            }
          ]
        }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'La comunidad vuelve a sus casas reconciliada. La profecía cumplió su obra: el Cuerpo de Cristo quedó más unido.',
          en: 'The community returns home reconciled. The prophecy did its work: the Body of Christ was left more united.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-discernimiento-de-espiritus',
    charismIndex: 6,
    x: 44, z: -48,
    zoneId: 'temor',
    title: { es: 'Discernimiento de Espíritus', en: 'Discernment of Spirits' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'Junto al Puente de la Noche hay un pequeño santuario. Esta semana llegaron a la comunidad tres mensajes, y no todos vienen del mismo espíritu.',
          en: 'Beside the Bridge of Night there is a small shrine. This week three messages reached the community, and not all of them come from the same spirit.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'El discernimiento es el carisma del centinela: reconocer si un movimiento viene de ti, Espíritu Santo, del corazón humano o del mal. Dame tu luz para juzgar cada mensaje.',
          en: 'Discernment is the charism of the sentinel: recognizing whether a movement comes from You, Holy Spirit, from the human heart, or from evil. Give me Your light to judge each message.'
        }
      }
    ],
    challenge: {
      type: 'choices',
      need: 3,
      rounds: [
        {
          prompt: {
            es: 'Primer mensaje. Un hermano dice con sencillez y con paz: “Jesús es Señor. Yo no busco nada para mí; solo quiero que hagamos la voluntad del Padre”. ¿Viene del Espíritu?',
            en: 'First message. A brother says with simplicity and with peace: “Jesus is Lord. I seek nothing for myself; I only want us to do the will of the Father.” Does it come from the Spirit?'
          },
          options: [
            {
              text: { es: 'Viene del Espíritu', en: 'It comes from the Spirit' },
              good: true,
              reply: {
                es: 'Bien discernido: hay humildad, hay paz y confiesa que Jesús es Señor. Esas son las huellas del Espíritu Santo.',
                en: 'Well discerned: there is humility, there is peace, and it confesses that Jesus is Lord. Those are the marks of the Holy Spirit.'
              }
            },
            {
              text: { es: 'No viene del Espíritu', en: 'It does not come from the Spirit' },
              good: false,
              reply: {
                es: 'Míralo otra vez: humildad, paz y la confesión “Jesús es Señor”. Nadie puede decir eso sino por el Espíritu Santo.',
                en: 'Look at it again: humility, peace, and the confession “Jesus is Lord.” No one can say that except by the Holy Spirit.'
              }
            }
          ]
        },
        {
          prompt: {
            es: 'Segundo mensaje. Alguien proclama con orgullo: “Yo soy el único que entiende lo que Dios está haciendo. Si no me siguen a mí, se pierden su obra”. ¿Viene del Espíritu?',
            en: 'Second message. Someone proclaims with pride: “I am the only one who understands what God is doing. If you do not follow me, you will miss His work.” Does it come from the Spirit?'
          },
          options: [
            {
              text: { es: 'Viene del Espíritu', en: 'It comes from the Spirit' },
              good: false,
              reply: {
                es: 'El Espíritu no se anuncia a sí mismo ni divide: señala a Jesús. El orgullo que busca seguidores propios no es su huella.',
                en: 'The Spirit does not announce himself or divide: he points to Jesus. The pride that seeks its own followers is not his mark.'
              }
            },
            {
              text: { es: 'No viene del Espíritu', en: 'It does not come from the Spirit' },
              good: true,
              reply: {
                es: 'Bien discernido: el Espíritu glorifica a Jesús y une a su pueblo; quien se pone a sí mismo en el centro habla desde su propio espíritu.',
                en: 'Well discerned: the Spirit glorifies Jesus and unites His people; whoever places himself at the center speaks from his own spirit.'
              }
            }
          ]
        },
        {
          prompt: {
            es: 'Tercer mensaje. Una voz acusa sin descanso: “Dios está enojado con ustedes y los ha abandonado. No hay esperanza para este grupo”. ¿Viene del Espíritu?',
            en: 'Third message. A voice accuses without rest: “God is angry with you and has abandoned you. There is no hope for this group.” Does it come from the Spirit?'
          },
          options: [
            {
              text: { es: 'Viene del Espíritu', en: 'It comes from the Spirit' },
              good: false,
              reply: {
                es: 'El Espíritu es Consolador: convence del pecado, sí, pero para llevar al arrepentimiento y a la esperanza, nunca para aplastar.',
                en: 'The Spirit is the Consoler: he convicts of sin, yes, but to lead to repentance and hope, never to crush.'
              }
            },
            {
              text: { es: 'No viene del Espíritu', en: 'It does not come from the Spirit' },
              good: true,
              reply: {
                es: 'Bien discernido: la acusación sin esperanza no viene del Paráclito, que es Defensor y Consolador de su pueblo.',
                en: 'Well discerned: accusation without hope does not come from the Paraclete, who is Defender and Consoler of His people.'
              }
            }
          ]
        }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'El santuario queda en calma. La comunidad ya sabe qué voces escuchar: eres el centinela que el Espíritu puso a su puerta.',
          en: 'The shrine is left in calm. The community now knows which voices to heed: you are the sentinel the Spirit placed at its door.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-don-de-lenguas',
    charismIndex: 7,
    x: 12, z: 62,
    zoneId: 'fortaleza',
    title: { es: 'Don de Lenguas', en: 'Gift of Tongues' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'En el Desierto, junto al altar de la Fortaleza, cuatro notas de luz flotan sobre la arena. No son palabras de hombre: son la alabanza que el Espíritu mismo formula.',
          en: 'In the Desert, beside the altar of Fortitude, four notes of light float above the sand. They are not human words: they are the praise the Spirit himself forms.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'El don de lenguas es mi espíritu orando más allá de las palabras. Espíritu Santo, déjame escuchar la secuencia de tu alabanza y ayúdame a repetirla.',
          en: 'The gift of tongues is my spirit praying beyond words. Holy Spirit, let me hear the sequence of Your praise and help me repeat it.'
        }
      }
    ],
    challenge: {
      type: 'sequence',
      notes: 4,
      order: [0, 2, 1, 3]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'Las cuatro notas se apagan en orden y un silencio lleno de paz cubre el desierto. Oraste sin palabras, y el Padre te escuchó.',
          en: 'The four notes fade in order and a silence full of peace covers the desert. You prayed without words, and the Father heard you.'
        }
      }
    ],
    points: 50
  },
  {
    id: 'carisma-interpretacion-de-lenguas',
    charismIndex: 8,
    x: -8, z: -10,
    zoneId: 'plaza',
    title: { es: 'Interpretación de Lenguas', en: 'Interpretation of Tongues' },
    intro: [
      {
        speaker: 'narrator',
        text: {
          es: 'Junto al Cenáculo, en plena reunión, una hermana ora en voz alta en lenguas: un canto alegre que nadie entiende. La comunidad espera en silencio.',
          en: 'Beside the Upper Room, in the middle of the gathering, a sister prays aloud in tongues: a joyful song that no one understands. The community waits in silence.'
        }
      },
      {
        speaker: 'player',
        text: {
          es: 'Sin interpretación, el don de lenguas se queda en la oración privada. Espíritu Santo, dame el carisma que lo convierte en alimento para todos.',
          en: 'Without interpretation, the gift of tongues stays in private prayer. Holy Spirit, give me the charism that turns it into nourishment for all.'
        }
      }
    ],
    challenge: {
      type: 'choices',
      need: 1,
      rounds: [
        {
          prompt: {
            es: 'La hermana canta: “Shalama, koré adonái, alaba, shalama, ría koré”. En tu corazón sientes tres posibles interpretaciones. ¿Cuál es la que edifica a la comunidad?',
            en: 'The sister sings: “Shalama, kore adonai, alaba, shalama, ria kore.” In your heart you sense three possible interpretations. Which one builds up the community?'
          },
          options: [
            {
              text: {
                es: 'Dice: “El Señor consuela a su pueblo. No tengan miedo: Él está en medio de ustedes, los ama y renueva su esperanza”.',
                en: 'It says: “The Lord consoles His people. Do not be afraid: He is in your midst, He loves you, and He renews your hope.”'
              },
              good: true,
              reply: {
                es: 'La comunidad responde “Amén” y varios lloran de consuelo. La interpretación convirtió el canto en profecía que nutre y une.',
                en: 'The community answers “Amen” and several weep with consolation. The interpretation turned the song into prophecy that nourishes and unites.'
              }
            },
            {
              text: {
                es: 'Dice: “Pronto uno de ustedes será muy conocido y todos lo aplaudirán”.',
                en: 'It says: “Soon one of you will be very famous and everyone will applaud him.”'
              },
              good: false,
              reply: {
                es: 'La gente mira alrededor buscando al afortunado. Esa interpretación sembró vanidad, no edificación.',
                en: 'The people look around searching for the lucky one. That interpretation sowed vanity, not edification.'
              }
            },
            {
              text: {
                es: 'Dice: “El Señor está decepcionado y se alejará de esta comunidad por un tiempo”.',
                en: 'It says: “The Lord is disappointed and will withdraw from this community for a while.”'
              },
              good: false,
              reply: {
                es: 'Un murmullo de temor recorre la reunión. El canto era alegre; esa interpretación trajo tristeza y división.',
                en: 'A murmur of fear runs through the gathering. The song was joyful; that interpretation brought sadness and division.'
              }
            }
          ]
        }
      ]
    },
    outro: [
      {
        speaker: 'narrator',
        text: {
          es: 'La hermana termina su canto y abraza a los que tiene cerca. Gracias a la interpretación, lo que era de una sola quedó para todos.',
          en: 'The sister ends her song and embraces those near her. Thanks to the interpretation, what belonged to one alone was left for all.'
        }
      }
    ],
    points: 50
  }
];
