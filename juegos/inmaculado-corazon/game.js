// Inmaculado Corazón de María: el jardín de las rosas de Fátima.
// Lucía camina por el jardín recogiendo las rosas que nacen para el
// Corazón de María antes de que se marchiten, sin pisar las espinas:
// hay que recoger 22 rosas en tres rondas, una por cada momento
// grande de las apariciones de 1917.
window.GardenGame({
  playerFigure: {
    size: 'child',
    robe: '#7fb2d9',
    dress: '#7fb2d9',
    skin: '#eec39a',
    hair: '#5a4030',
  },
  theme: {
    floor: '#e4ecd9',
    floorAlt: '#d8e4c6',
    wall: '#7a9a5b',
    trim: '#cfe0b8',
    ground: '#9db98a',
    shrineWall: '#f4efe2',
    shrineRoof: '#7a9a5b',
    shrineWindow: '#a8c8d8',
    pedestal: '#8a9a7a',
    emblem: 'immaculateHeart',
    particle: 'petal',
    trees: [[-12.5, -15, 1], [12.5, -15, 0.9], [-12.5, 1, 1.1], [12.5, 1, 0.85], [-9, -7, 0.8], [10, -10, 0.95]],
  },
  melody: [
    [74, 0.4], [78, 0.4], [81, 0.55], [78, 0.4],
    [76, 0.4], [74, 0.55], [71, 0.4], [74, 0.9],
  ],
  strings: {
    es: {
      startTitle: 'El jardín de las rosas',
      startMessage: 'En 1917, la Virgen se apareció en Fátima a Lucía, Francisco y Jacinta, y les mostró su Corazón rodeado de espinas. Cuida su jardín: camina con Lucía hasta cada rosa antes de que se marchite y no pises las espinas. Junta 22 rosas o más para su Inmaculado Corazón.',
      start: 'Comenzar',
      finishTitle: '«Inmaculado Corazón de María, sé la salvación de mi alma»',
      finishMessage: 'El Corazón de María, limpio y lleno de amor, es un refugio seguro para sus hijos.',
      restart: 'Volver a jugar',
      hint: 'Camina con Lucía hasta cada rosa antes de que se marchite y no pises las espinas.',
      heartsLabel: 'Corazones',
      comboLabel: 'Racha',
      thornHit: '¡Una espina! Su Corazón está rodeado de espinas: ten cuidado.',
      comboMsg: (combo) => `¡Racha de ${combo}! El jardín florece para María.`,
      loseTitle: 'El jardín se marchitó',
      loseDetail: (roses) => `Juntaste ${roses} rosas y hacían falta 22. María espera con paciencia: inténtalo otra vez.`,
      retry: 'Intentar de nuevo',
      status: (roses, goal) => `Rosas para el Corazón de María: ${roses} de ${goal}`,
      rounds: [
        {
          title: '13 de mayo de 1917',
          text: 'La Virgen se aparece a Lucía, Francisco y Jacinta en Fátima y les pide rezar el rosario todos los días por la paz.',
        },
        {
          title: '13 de julio de 1917',
          text: 'La Virgen les muestra su Inmaculado Corazón rodeado de espinas y pide su consagración y la comunión de reparación.',
        },
        {
          title: '13 de octubre de 1917',
          text: 'Ante la multitud ocurre el milagro del sol: el sol gira y se acerca, y muchos creen.',
        },
      ],
      audioUnavailable: 'Este dispositivo no pudo reproducir el sonido.',
    },
    en: {
      startTitle: 'The garden of roses',
      startMessage: 'In 1917, Our Lady appeared at Fatima to Lucia, Francisco and Jacinta, and showed them her Heart surrounded by thorns. Tend her garden: walk with Lucia to each rose before it wilts and do not step on the thorns. Gather 22 roses or more for her Immaculate Heart.',
      start: 'Begin',
      finishTitle: '"Immaculate Heart of Mary, be the salvation of my soul"',
      finishMessage: 'The Heart of Mary, pure and full of love, is a safe refuge for her children.',
      restart: 'Play again',
      hint: 'Walk with Lucia to each rose before it wilts and do not step on the thorns.',
      heartsLabel: 'Hearts',
      comboLabel: 'Streak',
      thornHit: 'A thorn! Her Heart is surrounded by thorns: be careful.',
      comboMsg: (combo) => `Streak of ${combo}! The garden blooms for Mary.`,
      loseTitle: 'The garden wilted',
      loseDetail: (roses) => `You gathered ${roses} roses and 22 were needed. Mary waits patiently: try again.`,
      retry: 'Try again',
      status: (roses, goal) => `Roses for the Heart of Mary: ${roses} of ${goal}`,
      rounds: [
        {
          title: 'May 13, 1917',
          text: 'Our Lady appears to Lucia, Francisco and Jacinta at Fatima and asks them to pray the rosary every day for peace.',
        },
        {
          title: 'July 13, 1917',
          text: 'Our Lady shows them her Immaculate Heart surrounded by thorns and asks for its consecration and the communion of reparation.',
        },
        {
          title: 'October 13, 1917',
          text: 'Before the crowd, the miracle of the sun takes place: the sun spins and draws near, and many believe.',
        },
      ],
      audioUnavailable: 'This device could not play the sound.',
    },
  },
});
