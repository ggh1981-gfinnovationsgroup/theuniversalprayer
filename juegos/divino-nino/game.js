// Divino Niño: el padre Juan del Rizzo llena una canasta de alegría para
// los vecinos de la capillita combinando fichas iguales (match-3).
// Al subir el marcador, la partida recorre la historia de la devoción:
// la imagen llega al barrio, los vecinos acuden, los favores se cuentan
// por Bogotá y la capillita se convierte en santuario.
window.MatchGame({
  theme: {
    ground: '#7d6248',
    floor: '#c8a06a',
    floorAlt: '#bb9059',
    wall: '#a9765a',
    roof: '#b0563a',
    shrine: '#f0e0cc',
    door: '#7a4a30',
    shrineWall: '#f0e0cc',
    shrineRoof: '#b0563a',
    emblem: 'divinoNino',
    particle: 'note',
  },
  melody: [
    [76, 0.35], [74, 0.35], [72, 0.5], [74, 0.35],
    [76, 0.35], [79, 0.5], [76, 0.35], [74, 0.9],
  ],
  strings: {
    es: {
      startTitle: 'La canasta del barrio',
      startMessage: 'Bogotá, 1935. El padre Juan del Rizzo, salesiano italiano, llevó una imagen pequeña del Niño Jesús de pie y con los brazos abiertos al barrio Veinte de Julio, uno de los más pobres de la ciudad. Ese Niño, Dios hecho pequeño, prometía cercanía a todos, y bajo la imagen se leía: «Yo reinaré». Ayúdalo a llenar la canasta de alegría para los vecinos que llegan a la capillita: junta tres o más fichas iguales para sumar puntos, llega a 700 en 22 movimientos.',
      start: 'Comenzar',
      finishTitle: '«Yo reinaré»',
      finishMessage: 'Como en la historia, la capillita se llenó de vecinos que encontraron paz. El Divino Niño sigue recibiendo a quien llega con confianza.',
      restart: 'Volver a jugar',
      hint: 'Toca una ficha y luego una vecina para intercambiarlas y juntar tres iguales.',
      movesLabel: 'Movimientos',
      chain: (c) => `¡Cadena por ${c}! El barrio celebra.`,
      shuffle: 'No quedaban jugadas: la canasta se revolvió.',
      loseTitle: 'La canasta quedó a medias',
      loseDetail: (score) => `Juntaste ${score} puntos y hacían falta 700. El padre Juan vuelve a intentarlo contigo.`,
      retry: 'Intentar de nuevo',
      status: (score, moves) => `Puntos: ${score}. Movimientos restantes: ${moves}`,
      audioUnavailable: 'Este dispositivo no pudo reproducir el sonido.',
    },
    en: {
      startTitle: 'The neighborhood basket',
      startMessage: 'Bogotá, 1935. Father Juan del Rizzo, an Italian Salesian, brought a small image of the Child Jesus, standing with open arms, to the Veinte de Julio neighborhood, one of the poorest in the city. That Child, God made small, promised closeness to everyone, and beneath the image were the words: "I will reign". Help him fill the basket of joy for the neighbors who come to the little chapel: match three or more tiles to score, reach 700 in 22 moves.',
      start: 'Begin',
      finishTitle: '"I will reign"',
      finishMessage: 'Just like in the story, the little chapel filled with neighbors who found peace. The Divine Child still welcomes everyone who comes with trust.',
      restart: 'Play again',
      hint: 'Tap a tile and then a neighbor to swap them and match three.',
      movesLabel: 'Moves',
      chain: (c) => `Chain x${c}! The neighborhood celebrates.`,
      shuffle: 'No moves were left: the basket was shuffled.',
      loseTitle: 'The basket was left half full',
      loseDetail: (score) => `You gathered ${score} points and 700 were needed. Father Juan will try again with you.`,
      retry: 'Try again',
      status: (score, moves) => `Score: ${score}. Moves left: ${moves}`,
      audioUnavailable: 'This device could not play the sound.',
    },
    milestones: [
      {
        at: 150,
        es: 'El padre Juan coloca la imagen del Niño en la capillita del barrio, y los vecinos empiezan a llegar.',
        en: 'Father Juan places the image of the Child in the little chapel of the neighborhood, and the neighbors begin to arrive.',
      },
      {
        at: 300,
        es: 'Llega gente con hijos enfermos, sin trabajo y con miedo, y cada uno se va consolado.',
        en: 'People come with sick children, without work and full of fear, and each one leaves consoled.',
      },
      {
        at: 450,
        es: 'Los favores se cuentan por todo Bogotá: un niño enfermo sanó, un obrero encontró trabajo, y la devoción crece.',
        en: 'The favors are told all over Bogotá: a sick child was healed, a worker found a job, and the devotion grows.',
      },
      {
        at: 600,
        es: 'La capillita ya no basta y se levanta un santuario. Sobre la imagen se escucha de nuevo: «Yo reinaré».',
        en: 'The little chapel is no longer enough and a sanctuary rises. Above the image the promise sounds again: "I will reign".',
      },
    ],
  },
});
