// El Camino del Espíritu: mundo (zonas, props, NPC fijos y el Árbol de los Frutos).
// Todo texto visible es un objeto {es, en}. Sin guion largo en la prosa en español.
window.RPG_WORLD = {
  zones: [
    {
      id: "plaza",
      cx: 0,
      cz: 0,
      r: 16,
      ground: "#cbb98a",
      path: "#e8dcae",
      name: { es: "La Plaza del Cenáculo", en: "The Upper Room Plaza" },
      landmark: "cenaculo",
      props: [
        { kind: "house", x: 0, z: -14, w: 11, d: 6 },
        { kind: "well", x: -6, z: 4 },
        { kind: "lamp", x: -4, z: -6 },
        { kind: "lamp", x: 4, z: -6 },
        { kind: "lamp", x: -4, z: 8 },
        { kind: "lamp", x: 4, z: 8 },
        { kind: "tree", x: -11, z: -8 },
        { kind: "tree", x: 12, z: 7 },
        { kind: "fence", x: -13, z: 0 },
        { kind: "fence", x: 13, z: -2 },
        { kind: "table", x: -3, z: -9 }
      ]
    },
    {
      id: "sabiduria",
      cx: -50,
      cz: -50,
      r: 15,
      ground: "#8d8578",
      path: "#b5ab98",
      name: { es: "El Mirador de la Sabiduría", en: "The Lookout of Wisdom" },
      landmark: "mirador",
      props: [
        { kind: "shrine", x: -50, z: -56 },
        { kind: "rock", x: -58, z: -44 },
        { kind: "rock", x: -43, z: -57 },
        { kind: "rock", x: -57, z: -59 },
        { kind: "tree", x: -43, z: -43 },
        { kind: "lamp", x: -47, z: -46 },
        { kind: "lamp", x: -53, z: -46 },
        { kind: "fence", x: -60, z: -50 },
        { kind: "fence", x: -40, z: -50 }
      ]
    },
    {
      id: "entendimiento",
      cx: -66,
      cz: 0,
      r: 17,
      ground: "#7fae6d",
      path: "#c9bd8f",
      name: { es: "El Laberinto de la Palabra", en: "The Labyrinth of the Word" },
      landmark: "laberinto",
      props: [
        { kind: "hedge", x: -70, z: -10, len: 8, rot: 0, solid: true },
        { kind: "hedge", x: -60, z: -10, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -68, z: -6, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -60, z: -6, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -76, z: -2, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -68, z: -2, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -76, z: 2, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -58, z: 2, len: 8, rot: 0, solid: true },
        { kind: "hedge", x: -68, z: 6, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -56, z: 6, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -76, z: 10, len: 4, rot: 0, solid: true },
        { kind: "hedge", x: -66, z: 10, len: 8, rot: 0, solid: true },
        { kind: "shrine", x: -53, z: 3 },
        { kind: "lamp", x: -53, z: -5 }
      ]
    },
    {
      id: "consejo",
      cx: -48,
      cz: 48,
      r: 15,
      ground: "#b39b6d",
      path: "#d8c493",
      name: { es: "La Encrucijada del Consejo", en: "The Crossroads of Counsel" },
      landmark: "encrucijada",
      props: [
        { kind: "signpost", x: -48, z: 48 },
        { kind: "signpost", x: -43, z: 53 },
        { kind: "tree", x: -58, z: 55 },
        { kind: "tree", x: -38, z: 41 },
        { kind: "rock", x: -53, z: 58 },
        { kind: "fence", x: -57, z: 41 },
        { kind: "fence", x: -39, z: 55 },
        { kind: "lamp", x: -46, z: 45 },
        { kind: "table", x: -51, z: 44 }
      ]
    },
    {
      id: "fortaleza",
      cx: 0,
      cz: 66,
      r: 16,
      ground: "#e0c184",
      path: "#cda968",
      name: { es: "El Desierto de la Fortaleza", en: "The Desert of Fortitude" },
      landmark: "desierto",
      props: [
        { kind: "dune", x: -9, z: 60 },
        { kind: "dune", x: 9, z: 61 },
        { kind: "dune", x: -11, z: 73 },
        { kind: "dune", x: 11, z: 74 },
        { kind: "dune", x: 0, z: 77 },
        { kind: "cactus", x: -6, z: 70 },
        { kind: "cactus", x: 7, z: 64 },
        { kind: "cactus", x: -13, z: 65 },
        { kind: "cactus", x: 13, z: 70 },
        { kind: "rock", x: 4, z: 73 }
      ]
    },
    {
      id: "ciencia",
      cx: 50,
      cz: 50,
      r: 17,
      ground: "#79b657",
      path: "#a8c686",
      name: { es: "El Jardín de la Creación", en: "The Garden of Creation" },
      landmark: "jardin",
      props: [
        { kind: "tree", x: 42, z: 42 },
        { kind: "tree", x: 58, z: 44 },
        { kind: "tree", x: 44, z: 58 },
        { kind: "tree", x: 62, z: 50 },
        { kind: "river", x: 50, z: 63, len: 28, rot: 0 },
        { kind: "rock", x: 56, z: 52 },
        { kind: "rock", x: 38, z: 42 },
        { kind: "well", x: 60, z: 56 },
        { kind: "shrine", x: 50, z: 38 },
        { kind: "lamp", x: 46, z: 46 }
      ]
    },
    {
      id: "piedad",
      cx: 68,
      cz: 0,
      r: 16,
      ground: "#a9bd7a",
      path: "#d3c491",
      name: { es: "La Aldea de la Piedad", en: "The Village of Piety" },
      landmark: "aldea",
      props: [
        { kind: "house", x: 61, z: -7 },
        { kind: "house", x: 75, z: -7 },
        { kind: "house", x: 61, z: 6 },
        { kind: "house", x: 75, z: 6 },
        { kind: "house", x: 68, z: -12 },
        { kind: "well", x: 68, z: 0 },
        { kind: "stall", x: 64, z: 3 },
        { kind: "stall", x: 72, z: -3 },
        { kind: "shrine", x: 68, z: 12 },
        { kind: "tree", x: 63, z: -11 },
        { kind: "lamp", x: 71, z: 4 }
      ]
    },
    {
      id: "temor",
      cx: 52,
      cz: -52,
      r: 15,
      ground: "#5d5a75",
      path: "#8f8aa8",
      name: { es: "El Templo del Temor de Dios", en: "The Temple of the Fear of the Lord" },
      landmark: "templo",
      props: [
        { kind: "shrine", x: 54, z: -57 },
        { kind: "column", x: 48, z: -50 },
        { kind: "column", x: 56, z: -50 },
        { kind: "column", x: 48, z: -57 },
        { kind: "column", x: 56, z: -57 },
        { kind: "lamp", x: 44, z: -44 },
        { kind: "lamp", x: 60, z: -44 },
        { kind: "rock", x: 44, z: -59 },
        { kind: "rock", x: 61, z: -58 },
        { kind: "fence", x: 42, z: -48 }
      ]
    }
  ],
  npcs: [
    {
      id: "hermana",
      name: { es: "La Hermana del Cenáculo", en: "The Sister of the Upper Room" },
      figure: { robe: "#5b6fb5", skin: "#e8b98d", hair: "#5a3a22", accessory: "book" },
      x: 2,
      z: -8,
      zone: "plaza"
    },
    {
      id: "nino",
      name: { es: "El niño de la plaza", en: "The child of the plaza" },
      figure: { robe: "#c96a3a", skin: "#c98d64", hair: "#2f2118", accessory: "none" },
      x: -4,
      z: 2,
      zone: "plaza"
    },
    {
      id: "sabio",
      name: { es: "El Sabio del Mirador", en: "The Sage of the Lookout" },
      figure: { robe: "#6b4f9e", skin: "#e8b98d", hair: "#e3e0d8", accessory: "book" },
      x: -50,
      z: -46,
      zone: "sabiduria"
    },
    {
      id: "maestra",
      name: { es: "La Maestra de la Palabra", en: "The Teacher of the Word" },
      figure: { robe: "#2e6f8e", skin: "#c98d64", hair: "#2f2a26", accessory: "book" },
      x: -52,
      z: -3,
      zone: "entendimiento"
    },
    {
      id: "peregrino",
      name: { es: "El Peregrino Mayor", en: "The Elder Pilgrim" },
      figure: { robe: "#8a6d3b", skin: "#a06a42", hair: "#4a3626", accessory: "cross" },
      x: -46,
      z: 50,
      zone: "consejo"
    },
    {
      id: "centinela",
      name: { es: "El Centinela del Desierto", en: "The Sentinel of the Desert" },
      figure: { robe: "#7a2e2e", skin: "#8a5632", hair: "#1e1a16", accessory: "cross" },
      x: 0,
      z: 58,
      zone: "fortaleza"
    },
    {
      id: "jardinera",
      name: { es: "La Jardinera", en: "The Gardener" },
      figure: { robe: "#3f7a3a", skin: "#e8b98d", hair: "#7a4a21", accessory: "none" },
      x: 47,
      z: 52,
      zone: "ciencia"
    },
    {
      id: "madre",
      name: { es: "La Madre de la Aldea", en: "The Mother of the Village" },
      figure: { robe: "#a34d68", skin: "#c98d64", hair: "#3a2a20", accessory: "medallon" },
      x: 66,
      z: 1,
      zone: "piedad"
    },
    {
      id: "guardian",
      name: { es: "El Guardián del Templo", en: "The Guardian of the Temple" },
      figure: { robe: "#3a3f6b", skin: "#e8b98d", hair: "#e3e0d8", accessory: "medallon" },
      x: 45,
      z: -45,
      zone: "temor"
    }
  ],
  tree: { x: 6, z: -4 }
};
