// Divino Niño: el padre Juan del Rizzo llena una canasta de alegría para
// los vecinos de la capillita combinando fichas iguales (match-3).
window.MatchGame({
  melody: [
    [76, 0.35], [74, 0.35], [72, 0.5], [74, 0.35],
    [76, 0.35], [79, 0.5], [76, 0.35], [74, 0.9],
  ],
  strings: {
    es: {
      startTitle: 'La canasta del barrio',
      startMessage: 'Bogotá, 1935. El padre Juan quiere llenar una canasta de alegría para compartir con los vecinos que llegan a la capillita del Divino Niño. Junta tres o más fichas iguales para sumar puntos: llega a 700 en 22 movimientos.',
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
      startMessage: 'Bogotá, 1935. Father Juan wants to fill a basket of joy to share with the neighbors who come to the little chapel of the Divine Child. Match three or more tiles to score: reach 700 in 22 moves.',
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
  },
});
