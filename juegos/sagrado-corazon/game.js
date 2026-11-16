// Sagrado Corazón: santa Margarita María levanta la capilla soltando
// cada pieza en el momento justo hasta encender el Corazón en lo alto.
window.StackGame({
  theme: {
    floor: '#ecd9b8',
    floorAlt: '#e3cb9e',
    wall: '#8e3b2f',
    trim: '#e0b184',
    ground: '#b3906c',
    shrineWall: '#f2e3c2',
    shrineRoof: '#8e3b2f',
    shrineWindow: '#a8c8d8',
    pedestal: '#9a7a5c',
    emblem: 'sacredHeart',
    particle: 'flame',
    trees: [[-17, -6, 1], [13, -4, 0.9], [-17, -26, 1.1], [14, -31, 0.85], [-7, 5, 0.8]],
  },
  melody: [
    [69, 0.4], [72, 0.4], [76, 0.55], [72, 0.4],
    [74, 0.4], [76, 0.55], [79, 0.4], [76, 0.9],
  ],
  strings: {
    es: {
      startTitle: 'Levanta la capilla del Corazón',
      startMessage: 'Entre 1673 y 1675, en Paray-le-Monial, Jesús se apareció a santa Margarita María, una joven monja, y le mostró su Corazón ardiendo de amor, coronado de espinas y con una cruz. Le pidió que ese Corazón fuera honrado. Levanta la capilla pieza a pieza y escucha sus promesas.',
      start: 'Comenzar',
      finishTitle: '«Sagrado Corazón de Jesús, en Vos confío»',
      finishMessage: 'El Corazón de Jesús arde de amor por cada persona y desea ser correspondido con amor. Es el mismo Corazón rodeado de llamas y coronado de espinas que Margarita María contempló en Paray-le-Monial.',
      restart: 'Volver a jugar',
      hint: 'Toca la pantalla o pulsa Espacio para soltar la pieza justo sobre la anterior.',
      perfect: '¡Perfecta! La pieza cayó justo en su lugar.',
      miss: (candles) => `La pieza se cayó. Te quedan ${candles} velas.`,
      candlesLabel: 'Velas',
      drop: 'SOLTAR',
      loseTitle: 'La torre se detuvo',
      loseMessage: 'Sin velas no se puede seguir por ahora. Respira y vuelve a intentarlo.',
      retry: 'Intentar de nuevo',
      status: (level, total) => `Piezas colocadas: ${level} de ${total}`,
      audioUnavailable: 'Este dispositivo no pudo reproducir el sonido.',
    },
    en: {
      startTitle: 'Raise the chapel of the Heart',
      startMessage: 'Between 1673 and 1675, in Paray-le-Monial, Jesus appeared to Saint Margaret Mary, a young nun, and showed her his Heart burning with love, crowned with thorns and topped with a cross. He asked that this Heart be honored. Raise the chapel piece by piece and listen to his promises.',
      start: 'Begin',
      finishTitle: '"Sacred Heart of Jesus, in You I trust"',
      finishMessage: 'The Heart of Jesus burns with love for every person and longs to be loved in return. It is the same Heart surrounded by flames and crowned with thorns that Margaret Mary contemplated at Paray-le-Monial.',
      restart: 'Play again',
      hint: 'Tap the screen or press Space to drop the piece right over the previous one.',
      perfect: 'Perfect! The piece landed exactly in place.',
      miss: (candles) => `The piece fell. You have ${candles} candles left.`,
      candlesLabel: 'Candles',
      drop: 'DROP',
      loseTitle: 'The tower stopped',
      loseMessage: 'With no candles left the work pauses. Take a breath and try again.',
      retry: 'Try again',
      status: (level, total) => `Pieces placed: ${level} of ${total}`,
      audioUnavailable: 'This device could not play the sound.',
    },
    promises: [
      {
        es: 'Pondré paz en sus familias.',
        en: 'I will give peace to their families.',
      },
      {
        es: 'Los consolaré en todas sus penas.',
        en: 'I will comfort them in all their sorrows.',
      },
      {
        es: 'Seré su refugio seguro durante la vida.',
        en: 'I will be their safe refuge during life.',
      },
      {
        es: 'Seré su refugio en la hora de la muerte.',
        en: 'I will be their refuge at the hour of death.',
      },
      {
        es: 'Derramaré bendiciones sobre todos sus trabajos.',
        en: 'I will pour blessings upon all their works.',
      },
      {
        es: 'Los pecadores hallarán en mi Corazón la gracia de la conversión.',
        en: 'Sinners will find in my Heart the grace of conversion.',
      },
      {
        es: 'Las almas tibias se volverán fervorosas.',
        en: 'Lukewarm souls will become fervent.',
      },
      {
        es: 'Daré a los sacerdotes el don de tocar los corazones más endurecidos.',
        en: 'I will give priests the gift of touching the most hardened hearts.',
      },
      {
        es: 'Bendeciré los hogares donde se honre la imagen de mi Corazón.',
        en: 'I will bless the homes where the image of my Heart is honored.',
      },
      {
        es: 'Quien comulgue nueve primeros viernes seguidos recibirá la perseverancia final y no morirá sin los sacramentos.',
        en: 'Whoever receives Communion on nine consecutive First Fridays will receive final perseverance and will not die without the sacraments.',
      },
    ],
  },
});
