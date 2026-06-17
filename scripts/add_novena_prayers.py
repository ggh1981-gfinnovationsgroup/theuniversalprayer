import json, os

os.chdir(r'c:\Users\ggh19\Documents\theuniversalprayer\data')

specific = {
  'angelguarda': {
    'es': 'Cada día de la novena:\n1. Reza un Padre Nuestro, un Ave María y un Gloria.\n2. Lee la meditación del día.\n3. Recita la Oración al Ángel de la Guarda: «Ángel de mi guarda, dulce compañía, no me desampares ni de noche ni de día.»\n4. Pide protección para ti y tus seres queridos.',
    'en': 'Each day of the novena:\n1. Pray an Our Father, a Hail Mary, and a Gloria.\n2. Read the day\'s meditation.\n3. Recite the Guardian Angel Prayer: "Angel of God, my guardian dear, to whom God\'s love commits me here..."\n4. Ask for protection for yourself and your loved ones.'
  },
  'divinaprovidencia': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza el Acto de Confianza: «Señor, me abandono en Tus manos; haz de mí lo que quieras.»\n4. Confía una necesidad concreta a la Providencia de Dios.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Act of Trust: "Lord, I abandon myself into Your hands; do with me what You will."\n4. Entrust a specific need to God\'s Providence.'
  },
  'fatima': {
    'es': 'Cada día de la novena:\n1. Reza el Santo Rosario (los 5 misterios del día).\n2. Después de cada decena, reza la Oración de Fátima: «Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al Cielo a todas las almas, especialmente a las más necesitadas de Tu misericordia.»\n3. Lee la meditación del día.\n4. Concluye con la Salve Regina.',
    'en': 'Each day of the novena:\n1. Pray the Holy Rosary (5 mysteries of the day).\n2. After each decade, pray the Fatima Prayer: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Your mercy."\n3. Read the day\'s meditation.\n4. Close with the Salve Regina.'
  },
  'guadalupe': {
    'es': 'Cada día de la novena:\n1. Reza el Santo Rosario o al menos 5 decenas.\n2. Lee la meditación del día.\n3. Reza la Oración a Nuestra Señora de Guadalupe: «Bendita seas, Virgen de Guadalupe, Madre de todos los pueblos de América...»\n4. Concluye con la Salve Regina.',
    'en': 'Each day of the novena:\n1. Pray the Holy Rosary or at least 5 decades.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Our Lady of Guadalupe: "Blessed are you, Virgin of Guadalupe, Mother of all the peoples of the Americas..."\n4. Close with the Salve Regina.'
  },
  'inmaculadocorazon': {
    'es': 'Cada día de la novena:\n1. Reza el Santo Rosario (los 5 misterios del día).\n2. Lee la meditación del día.\n3. Reza el Acto de Consagración al Inmaculado Corazón de María.\n4. Concluye con la Salve Regina.',
    'en': 'Each day of the novena:\n1. Pray the Holy Rosary (5 mysteries of the day).\n2. Read the day\'s meditation.\n3. Pray the Act of Consecration to the Immaculate Heart of Mary.\n4. Close with the Salve Regina.'
  },
  'juanpablo': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reflexiona sobre una de las enseñanzas de San Juan Pablo II y reza con la frase que él popularizó: «¡No tengáis miedo! Abrid de par en par las puertas a Cristo.»\n4. Formula tu intención personal.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Reflect on a teaching of Saint John Paul II and pray with his famous phrase: "Be not afraid! Open wide the doors to Christ."\n4. State your personal intention.'
  },
  'mariaauxiliadora': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Recita la jaculatoria de Don Bosco: «María Auxiliadora, ruega por nosotros» — repítela 3 veces con fe.\n4. Concluye con la Salve Regina.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Recite Don Bosco\'s invocation: "Mary Help of Christians, pray for us" — repeat it 3 times with faith.\n4. Close with the Salve Regina.'
  },
  'misericordia': {
    'es': 'Esta es la novena de la Divina Misericordia revelada a Santa Faustina. Cada día:\n1. Reza la Coronilla de la Divina Misericordia.\n   — En las cuentas del Padre Nuestro: «Eterno Padre, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de Tu amadísimo Hijo, Nuestro Señor Jesucristo, en expiación de nuestros pecados y los del mundo entero.»\n   — En las cuentas del Ave María: «Por Su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.»\n   — Al final (3 veces): «Santo Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.»\n2. Lee la meditación e intención del día.\n3. Reza 3 veces: «Jesús, en Ti confío.»',
    'en': 'This is the Novena of Divine Mercy revealed to Saint Faustina. Each day:\n1. Pray the Chaplet of Divine Mercy.\n   — On the Our Father beads: "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world."\n   — On the Hail Mary beads: "For the sake of His sorrowful Passion, have mercy on us and on the whole world."\n   — At the end (3 times): "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world."\n2. Read the day\'s meditation and intention.\n3. Pray 3 times: "Jesus, I trust in You."'
  },
  'padrepio': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la oración favorita del Padre Pío: «Quédate conmigo, Señor, porque necesito Tu presencia para no olvidarte. Ya sabes cuán fácilmente Te abandono.»\n4. Confía tu intención a la intercesión del Padre Pío.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray Padre Pio\'s favorite prayer: "Stay with me, Lord, because I need Your presence so as not to forget You. You know how easily I abandon You."\n4. Entrust your intention to the intercession of Padre Pio.'
  },
  'perpetuosocorro': {
    'es': 'Cada día de la novena:\n1. Reza 3 Ave Marías y 1 Salve Regina.\n2. Lee la meditación del día.\n3. Reza la invocación tradicional redentorista: «Oh Madre del Perpetuo Socorro, cuya admirable imagen está confiada a nuestra veneración, ruega por nosotros siempre.»\n4. Pide la gracia que necesitas con confianza filial.',
    'en': 'Each day of the novena:\n1. Pray 3 Hail Marys and 1 Salve Regina.\n2. Read the day\'s meditation.\n3. Pray the traditional Redemptorist invocation: "O Mother of Perpetual Help, whose wonderful image is entrusted to our veneration, pray for us always."\n4. Ask the grace you need with filial trust.'
  },
  'providencia': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza el Salmo 23: «El Señor es mi pastor, nada me faltará...» y el versículo de Mateo 6,26: «Mirad las aves del cielo...»\n4. Abandona una preocupación concreta en manos de Dios.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray Psalm 23: "The Lord is my shepherd; I shall not want..." and Matthew 6:26: "Look at the birds of the air..."\n4. Surrender a specific worry into God\'s hands.'
  },
  'sagradocorazon': {
    'es': 'Cada día de la novena:\n1. Reza 1 Padre Nuestro, 1 Ave María y 1 Gloria.\n2. Lee la meditación del día.\n3. Reza el Acto de Consagración al Sagrado Corazón de Jesús.\n4. Concluye con la jaculatoria: «Sagrado Corazón de Jesús, en Vos confío» — repítela 3 veces.',
    'en': 'Each day of the novena:\n1. Pray 1 Our Father, 1 Hail Mary, and 1 Gloria.\n2. Read the day\'s meditation.\n3. Pray the Act of Consecration to the Sacred Heart of Jesus.\n4. Close with the invocation: "Sacred Heart of Jesus, I trust in You" — repeat it 3 times.'
  },
  'sanantonio': {
    'es': 'Novena según la tradición de los Trece Martes de San Antonio. Cada día:\n1. Reza 13 Padre Nuestros, 13 Ave Marías y 13 Glorias (en memoria de sus 13 años de vida religiosa).\n2. Lee la meditación del día.\n3. Reza la oración clásica: «Si buscas milagros, mira: muerte y error desterrados, miseria y demonio huidos, leprosos y enfermos sanos...»\n4. Presenta tu intención concreta al santo.',
    'en': 'Novena according to the tradition of the Thirteen Tuesdays of Saint Anthony. Each day:\n1. Pray 13 Our Fathers, 13 Hail Marys, and 13 Glorias (in memory of his 13 years of religious life).\n2. Read the day\'s meditation.\n3. Pray the classic prayer: "If you seek miracles, death and error banished, misery and demon fleeing, lepers and sick made whole..."\n4. Present your specific intention to the saint.'
  },
  'sanjose': {
    'es': 'Cada día de la novena:\n1. Reza 1 Padre Nuestro, 1 Ave María y 1 Gloria.\n2. Lee la meditación del día.\n3. Recita las Letanías de San José (o al menos los primeros 7 invocaciones).\n4. Concluye: «San José, patrono de la Iglesia Universal, ruega por nosotros.»',
    'en': 'Each day of the novena:\n1. Pray 1 Our Father, 1 Hail Mary, and 1 Gloria.\n2. Read the day\'s meditation.\n3. Recite the Litany of Saint Joseph (or at least the first 7 invocations).\n4. Close: "Saint Joseph, patron of the Universal Church, pray for us."'
  },
  'sanjudas': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Judas Tadeo: «Oh glorioso Apóstol San Judas Tadeo, siervo fiel y amigo de Jesús, el nombre del traidor ha hecho que muchos te olvidaran, pero la Iglesia te honra como Patrón de los casos difíciles y desesperados.»\n4. Reza 3 veces: «San Judas Tadeo, ruega por nosotros y por todos los que invocan tu nombre.»',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Jude: "O glorious Apostle Saint Jude Thaddeus, faithful servant and friend of Jesus, the name of the traitor has caused many to forget you, but the Church honors you as Patron of difficult and desperate cases."\n4. Pray 3 times: "Saint Jude Thaddeus, pray for us and for all who invoke your name."'
  },
  'sanmiguel': {
    'es': 'Cada día de la novena:\n1. Reza la Coronilla de San Miguel (9 saludos a los coros angélicos con 1 Padre Nuestro y 3 Ave Marías por coro).\n2. Lee la meditación del día.\n3. Reza la Oración de León XIII: «San Miguel Arcángel, defiéndenos en la batalla; sé nuestro amparo contra la perversidad y asechanzas del demonio...»\n4. Pide protección espiritual para ti y tu familia.',
    'en': 'Each day of the novena:\n1. Pray the Chaplet of Saint Michael (9 salutations to the angelic choirs with 1 Our Father and 3 Hail Marys per choir).\n2. Read the day\'s meditation.\n3. Pray the Prayer of Leo XIII: "Saint Michael the Archangel, defend us in battle; be our protection against the wickedness and snares of the devil..."\n4. Ask for spiritual protection for yourself and your family.'
  },
  'sanfrancisco': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración de la Paz atribuida a San Francisco: «Señor, hazme instrumento de Tu paz. Donde haya odio, que yo lleve el amor; donde haya ofensa, el perdón; donde haya discordia, la unión...»\n4. Realiza un acto de misericordia o generosidad como ofrenda del día.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Peace Prayer attributed to Saint Francis: "Lord, make me an instrument of Your peace. Where there is hatred, let me sow love; where there is injury, pardon; where there is discord, union..."\n4. Perform an act of mercy or generosity as an offering for the day.'
  },
  'sanrafael': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Rafael: «San Rafael Arcángel, medicina de Dios, que guiaste a Tobías sano y salvo, guía también mis pasos y sana lo que en mí necesita ser sanado.»\n4. Confía a San Rafael a los enfermos que llevas en el corazón.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Raphael: "Saint Raphael the Archangel, medicine of God, who guided Tobias safe and sound, guide my steps as well and heal what in me needs to be healed."\n4. Entrust to Saint Raphael the sick people you carry in your heart.'
  },
  'santateresita': {
    'es': 'Novena según la tradición devocional de Santa Teresita. Cada día:\n1. Reza 24 Glorias en honor a sus 24 años de vida.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Teresita: «Oh Santa Teresita del Niño Jesús, que dijiste que después de tu muerte harías caer una lluvia de rosas, envíame una rosa como señal de tu intercesión.»\n4. Espera con fe la señal que el cielo te enviará.',
    'en': 'Novena according to the devotional tradition of Saint Thérèse. Each day:\n1. Pray 24 Glorias in honor of her 24 years of life.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Thérèse: "O Saint Thérèse of the Child Jesus, who said that after your death you would let fall a shower of roses, send me a rose as a sign of your intercession."\n4. Wait with faith for the sign heaven will send you.'
  },
  'santamonica': {
    'es': 'Cada día de la novena:\n1. Reza 1 Rosario completo o al menos 5 decenas, ofreciéndolo por la conversión de un ser querido.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Mónica: «Santa Mónica, madre que no te rendiste, intercede por los hijos e hijas que se han alejado de Dios. Como Tú lloraste por Agustín, acoge las lágrimas de todos los que hoy lloran por los suyos.»\n4. Confía a Dios con confianza la persona que más te preocupa.',
    'en': 'Each day of the novena:\n1. Pray 1 full Rosary or at least 5 decades, offering it for the conversion of a loved one.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Monica: "Saint Monica, mother who never gave up, intercede for the sons and daughters who have drifted from God. As you wept for Augustine, receive the tears of all who weep for their loved ones today."\n4. Entrust with confidence to God the person who concerns you most.'
  },
  'santarita': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Rita: «Santa Rita de Cascia, abogada de lo imposible, Tú que en vida tocaste lo imposible con tu fe y tu paciencia, intercede hoy por esta causa que traigo delante de Dios.»\n4. Nombra en voz alta (o en silencio) la causa que parece imposible.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Rita: "Saint Rita of Cascia, advocate of the impossible, you who in life touched the impossible with your faith and patience, intercede today for this cause I bring before God."\n4. Name aloud (or in silence) the cause that seems impossible.'
  },
  'schoenstatt': {
    'es': 'Cada día de la novena:\n1. Reza el Santo Rosario o al menos 3 decenas.\n2. Lee la meditación del día.\n3. Reza la Oración de Consagración a la Virgen de Schoenstatt: «Madre mía, me consagro a ti, te entrego mi corazón, todo lo mío; y te pido que seas siempre mi Madre, mi Reina y mi Aliada.»\n4. Renueva tu alianza de amor con la Virgen de Schoenstatt.',
    'en': 'Each day of the novena:\n1. Pray the Holy Rosary or at least 3 decades.\n2. Read the day\'s meditation.\n3. Pray the Consecration Prayer to Our Lady of Schoenstatt: "My Mother, I consecrate myself to you, I give you my heart, all that is mine; and I ask you to always be my Mother, my Queen and my Ally."\n4. Renew your covenant of love with Our Lady of Schoenstatt.'
  },
  'teresacalcuta': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración de la Madre Teresa: «Querido Jesús, ayúdame a esparcir Tu fragancia dondequiera que vaya. Inunda mi alma con Tu espíritu y Tu vida. Penetra y posee todo mi ser tan completamente que toda mi vida no sea más que un irradiar la Tuya.»\n4. Realiza un acto de servicio al más pobre o necesitado de tu entorno.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray Mother Teresa\'s Prayer: "Dear Jesus, help me to spread Your fragrance everywhere I go. Flood my soul with Your spirit and life. Penetrate and possess my whole being so utterly that all my life may only be a radiance of Yours."\n4. Perform an act of service for the poorest or most needy person in your surroundings.'
  },
  'sanbrendan': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración del Navegante Celta: «Cristo delante de mí, Cristo detrás de mí, Cristo en mi derecha, Cristo en mi izquierda, Cristo en la anchura, Cristo en la longitud, Cristo en la altura.»\n4. Confía a San Brendan tus viajes y peregrinaciones, visibles e invisibles.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Celtic Navigator\'s Prayer: "Christ before me, Christ behind me, Christ on my right, Christ on my left, Christ in breadth, Christ in length, Christ in height."\n4. Entrust to Saint Brendan your journeys and pilgrimages, visible and invisible.'
  },
  'sancarlos': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Carlos Borromeo: «San Carlos, pastor solícito que no dudaste en exponer tu vida por tu rebaño en tiempos de peste, intercede por la Iglesia y por todos los que la guían.»\n4. Ora por tu párroco, tu obispo y por el Papa.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Charles Borromeo: "Saint Charles, dedicated shepherd who did not hesitate to risk your life for your flock in times of plague, intercede for the Church and for all who lead her."\n4. Pray for your parish priest, your bishop, and the Pope.'
  },
  'sancristobal': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración del Viajero a San Cristóbal: «San Cristóbal, que cargaste al Niño Jesús sobre tus espaldas a través del río impetuoso, protege a todos los que viajan y a quienes cada día cargan pesadas responsabilidades.»\n4. Pide protección para todos tus trayectos del día.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Traveler\'s Prayer to Saint Christopher: "Saint Christopher, who carried the Christ Child on your shoulders across the rushing river, protect all who travel and those who carry heavy responsibilities each day."\n4. Ask for protection on all your journeys of the day.'
  },
  'sanexpedito': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración de Urgencia a San Expedito: «San Expedito, patrón de las causas urgentes, tú que aplastaste la tentación de dilatar con el grito ¡Hoy! intercede para que esta necesidad sea atendida en el tiempo de Dios.»\n4. Presenta tu causa urgente con confianza.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Urgent Prayer to Saint Expedite: "Saint Expedite, patron of urgent causes, you who crushed the temptation to delay with the cry \'Today!\', intercede so that this need may be addressed in God\'s time."\n4. Present your urgent cause with confidence.'
  },
  'sanfelipeneri': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Felipe Neri: «San Felipe Neri, apóstol de la alegría que decías que la tristeza es el peor mal espiritual, contagianos tu gozo y tu amor desbordante a Dios.»\n4. Haz un acto de alegría: ríe, canta, da gracias, sirve con humor.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Philip Neri: "Saint Philip Neri, apostle of joy who said sadness is the worst spiritual evil, infect us with your joy and your overflowing love for God."\n4. Perform an act of joy: laugh, sing, give thanks, serve with humor.'
  },
  'sangabriel': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Salutación Angélica lentamente, meditando el «Dios te salve, María» como el mensajero Gabriel lo pronunció: con profundo respeto y admiración.\n4. Pide al Arcángel Gabriel que lleve tus oraciones ante el trono de Dios.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Angelic Salutation slowly, meditating on the "Hail Mary" as the messenger Gabriel pronounced it: with deep reverence and wonder.\n4. Ask the Archangel Gabriel to carry your prayers before the throne of God.'
  },
  'sanguillermo': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Guillermo: «San Guillermo, duque que abandonaste el poder mundano para buscar a Dios en la soledad, intercede por los que están en posiciones de autoridad para que la ejerzan con justicia y humildad.»\n4. Ora por los líderes políticos, económicos y religiosos de tu país.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint William: "Saint William, duke who abandoned worldly power to seek God in solitude, intercede for those in positions of authority that they may exercise it with justice and humility."\n4. Pray for the political, economic, and religious leaders of your country.'
  },
  'sanjuanapostol': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Lee en voz alta el versículo de Juan 13,34: «Os doy un mandamiento nuevo: que os améis los unos a los otros como yo os he amado.» Medita un minuto en silencio.\n4. Formula un acto de amor concreto hacia alguien que te cuesta amar.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Read aloud John 13:34: "A new commandment I give you: Love one another as I have loved you." Meditate for one minute in silence.\n4. Commit to a concrete act of love toward someone you find difficult to love.'
  },
  'sanlorenzo': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Lorenzo: «San Lorenzo, diácono que serviste a los pobres como al mismo Cristo y que en la hoguera no perdiste la paz del alma, enséñanos a servir con alegría y a sufrir con serenidad.»\n4. Realiza un acto de servicio hacia alguien necesitado.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Lawrence: "Saint Lawrence, deacon who served the poor as Christ Himself and who on the gridiron did not lose the peace of your soul, teach us to serve with joy and to suffer with serenity."\n4. Perform an act of service toward someone in need.'
  },
  'sannicolas': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Nicolás: «San Nicolás de Bari, obispo generoso que dabas en secreto sin buscar recompensa, intercede por los niños del mundo, los pobres y los que están injustamente encarcelados.»\n4. Realiza un acto de generosidad anónima.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Nicholas: "Saint Nicholas of Bari, generous bishop who gave in secret without seeking reward, intercede for the children of the world, the poor, and those unjustly imprisoned."\n4. Perform an act of anonymous generosity.'
  },
  'santaalejandra': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Alejandra: «Santa Alejandra, que en medio de la persecución mantuviste la fe con serenidad heroica, intercede por los que hoy sufren por su fe en el mundo.»\n4. Ora por los cristianos perseguidos en el mundo.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Alexandra: "Saint Alexandra, who in the midst of persecution maintained your faith with heroic serenity, intercede for those who today suffer for their faith in the world."\n4. Pray for persecuted Christians throughout the world.'
  },
  'santabarbara': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Bárbara: «Santa Bárbara, virgen y mártir protegida por su torre, intercede por nosotros ante los peligros repentinos y la muerte imprevista, y obtennos la gracia de recibir los sacramentos antes de morir.»\n4. Renueva tu fe en la vida eterna.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Barbara: "Saint Barbara, virgin and martyr protected by your tower, intercede for us against sudden dangers and unprovided death, and obtain for us the grace to receive the sacraments before dying."\n4. Renew your faith in eternal life.'
  },
  'santacatalina': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Catalina de Siena: «Santa Catalina, Doctora de la Iglesia que bebías la misma sangre de Cristo, ilumina nuestra mente para conocer a Dios y nuestra voluntad para amarlo sin límites.»\n4. Ora por los estudiantes, teólogos e intelectuales.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Catherine of Siena: "Saint Catherine, Doctor of the Church who drank the very blood of Christ, illuminate our minds to know God and our wills to love Him without limits."\n4. Pray for students, theologians, and intellectuals.'
  },
  'santacelina': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Celina: «Santa Celina, madre cristiana que educaste a tus hijos en la fe con paciencia y amor, intercede por todas las familias y por los hijos que más necesitan dirección.»\n4. Ora por las familias de tu entorno.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Celine: "Saint Celine, Christian mother who raised your children in the faith with patience and love, intercede for all families and for the children who most need direction."\n4. Pray for the families in your surroundings.'
  },
  'santaclara': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Clara: «Santa Clara de Asís, que aprendiste de Francisco a contemplar a Cristo en los pobres, obtennos la gracia de la pobreza de espíritu y la alegría de quien solo posee a Dios.»\n4. Haz un acto de desapego de algo material.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Clare: "Saint Clare of Assisi, who learned from Francis to contemplate Christ in the poor, obtain for us the grace of poverty of spirit and the joy of one who possesses only God."\n4. Perform an act of detachment from something material.'
  },
  'santadymphna': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Dymphna: «Santa Dymphna, que en tu martirio mantuviste la pureza del alma ante el mal que te acechaba, intercede por todos los que sufren enfermedades mentales, depresión y traumas profundos.»\n4. Ora por alguien que conozcas que esté sufriendo interiormente.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Dymphna: "Saint Dymphna, who in your martyrdom kept the purity of your soul before the evil that threatened you, intercede for all who suffer from mental illness, depression, and deep trauma."\n4. Pray for someone you know who is suffering interiorly.'
  },
  'santafabiola': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Fabiola: «Santa Fabiola, que después de una vida difícil te convertiste en instrumento de misericordia para los enfermos y los más pobres, intercede por los que buscan un nuevo comienzo.»\n4. Ora por alguien que necesite una segunda oportunidad.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Fabiola: "Saint Fabiola, who after a difficult life became an instrument of mercy for the sick and the poorest, intercede for those who seek a new beginning."\n4. Pray for someone who needs a second chance.'
  },
  'santagwendolina': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Gwendolina: «Santa Gwendolina, que en la fragilidad de una vida entregada hallaste la fortaleza de Dios, intercede por las madres, las familias rotas y los que cargan solos con demasiado peso.»\n4. Ora por las familias de tu comunidad.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Gwendoline: "Saint Gwendoline, who in the fragility of a surrendered life found the strength of God, intercede for mothers, broken families, and those who carry too much alone."\n4. Pray for the families of your community.'
  },
  'santaines': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Inés: «Santa Inés, virgen de trece años que elegiste la muerte antes que traicionar a Cristo, intercede por los jóvenes del mundo y guarda la pureza de corazón de los que te invocan.»\n4. Reza por los adolescentes y jóvenes de tu familia.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Agnes: "Saint Agnes, thirteen-year-old virgin who chose death rather than betray Christ, intercede for the young people of the world and guard the purity of heart of those who invoke you."\n4. Pray for the teenagers and young people in your family.'
  },
  'santalucia': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Lucía: «Santa Lucía, portadora de luz en las tinieblas, intercede por los que sufren enfermedades de la vista y por los que están ciegos en el alma, para que la luz de Cristo ilumine su camino.»\n4. Ora por los enfermos que conoces.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Lucy: "Saint Lucy, bearer of light in the darkness, intercede for those who suffer from eye diseases and for those who are blind in soul, that the light of Christ may illuminate their path."\n4. Pray for the sick people you know.'
  },
  'santanoemi': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Medita en el versículo de Rut 1,16: «Tu pueblo será mi pueblo, y tu Dios será mi Dios.» Es la fidelidad de Rut a Noemí como imagen de la fidelidad de Dios.\n4. Ora por los ancianos, las viudas y los que viven la soledad del duelo.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Meditate on Ruth 1:16: "Your people shall be my people, and your God my God." It is Ruth\'s fidelity to Naomi as an image of God\'s faithfulness.\n4. Pray for the elderly, widows, and those living the loneliness of grief.'
  },
  'santarosa': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Rosa de Lima: «Santa Rosa de Lima, primera santa americana, que aceptaste los sufrimientos como flores que ofrendar a Cristo, intercede por América Latina y por todos los que cargan cruces invisibles.»\n4. Ofrece un sacrificio pequeño unido a los sufrimientos de Cristo.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Rose of Lima: "Saint Rose of Lima, first American saint, who accepted sufferings as flowers to offer Christ, intercede for Latin America and for all who carry invisible crosses."\n4. Offer a small sacrifice united to the sufferings of Christ.'
  },
  'santaroxana': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a Santa Roxana: «Santa Roxana, que viviste tu fe en medio de un mundo hostil con dignidad y esperanza, intercede por los que hoy se sienten solos en su camino de fe.»\n4. Ora por alguien que se siente solo en su fe.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Roxana: "Saint Roxana, who lived your faith in a hostile world with dignity and hope, intercede for those who today feel alone on their journey of faith."\n4. Pray for someone who feels alone in their faith.'
  },
  'sanvicente': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración a San Vicente de Paúl: «San Vicente de Paúl, apóstol de la caridad que veías el rostro de Cristo en cada pobre, enséñanos a servir con las manos y con el corazón, sin esperar reconocimiento.»\n4. Realiza una obra de caridad concreta hoy.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer to Saint Vincent de Paul: "Saint Vincent de Paul, apostle of charity who saw the face of Christ in every poor person, teach us to serve with our hands and our heart, without seeking recognition."\n4. Perform a concrete act of charity today.'
  },
  'sanagustin': {
    'es': 'Cada día de la novena:\n1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n2. Lee la meditación del día.\n3. Reza la Oración de las Confesiones de San Agustín: «Nos hiciste para Ti, Señor, y nuestro corazón está inquieto hasta que descanse en Ti.»\n4. Ora por los intelectuales, los que dudan de la fe y los que están en un proceso de conversión.',
    'en': 'Each day of the novena:\n1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n2. Read the day\'s meditation.\n3. Pray the Prayer from Saint Augustine\'s Confessions: "You have made us for Yourself, O Lord, and our heart is restless until it rests in You."\n4. Pray for intellectuals, those who doubt their faith, and those in a process of conversion.'
  },
}

def default_es(name_es):
    return (
        'Cada día de la novena:\n'
        '1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n'
        '2. Lee la meditación del día.\n'
        '3. Formula tu intención personal.\n'
        f'4. Concluye con la oración propia a {name_es}.'
    )

def default_en(name_en):
    return (
        'Each day of the novena:\n'
        '1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n'
        '2. Read the day\'s meditation.\n'
        '3. State your personal intention.\n'
        f'4. Close with the proper prayer to {name_en}.'
    )

updated = 0
for fname in sorted(os.listdir('.')):
    if not fname.endswith('.json'):
        continue
    with open(fname, encoding='utf-8-sig') as fh:
        d = json.load(fh)
    if not d.get('novena'):
        continue
    if d.get('novena_prayers'):
        print(f'SKIP (already has novena_prayers): {fname}')
        continue

    sid = d.get('id', fname.replace('.json', ''))
    name_es = d.get('name', {}).get('es', sid)
    name_en = d.get('name', {}).get('en', sid)

    np = specific.get(sid, {'es': default_es(name_es), 'en': default_en(name_en)})

    # Rebuild JSON inserting novena_prayers just before novena
    final_d = {}
    for k, v in d.items():
        if k == 'novena':
            final_d['novena_prayers'] = np
        final_d[k] = v

    with open(fname, 'w', encoding='utf-8') as fh:
        json.dump(final_d, fh, ensure_ascii=False, indent=2)
    updated += 1
    print(f'OK: {fname}')

print(f'Total updated: {updated}')
