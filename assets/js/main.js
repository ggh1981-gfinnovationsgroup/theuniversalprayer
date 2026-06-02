/* =====================================================
   THE UNIVERSAL PRAYER — main.js
   Subdomain detection · Language toggle · Content loader
   ===================================================== */

'use strict';

// ── TRANSLATIONS (UI strings) ──────────────────────
const i18n = {
  en: {
    site_title:         'The Universal Prayer',
    hero_title:         'The Universal Prayer',
    hero_subtitle:      'Novenas, chaplets and prayers for every intercessor — free, always.',
    choose_intercessor: 'Choose your intercessor',
    feast_day:          'Feast Day:',
    tab_prayer:         'Prayer',
    tab_history:        'History',
    tab_miracles:       'Miracles',
    tab_novena:         'Novena',
    tab_story:          '📖 Story',
    tab_chaplet:        'Chaplet',
    tab_litany:         'Litany',
    tab_consecration:   'Consecration',
    day:                'Day',
    no_chaplet:         'No chaplet available for this intercessor.',
    no_litany:          'No litany available for this intercessor.',
    no_consecration:    'No consecration available for this intercessor.',
    novena_prayers:     '📿 Prayers to pray',
    chaplet_lbl:        'Chaplet',
    not_found_title:    'Intercessor not found',
    not_found_text:     'We could not find this intercessor. Please return to the home page.',
    go_home:            'Go Home',
    footer_text:             'A free Catholic devotional resource. No ads. No tracking.',
    universal_prayer_title:  'The Universal and Definitive Prayer',
    universal_prayer_dedication: 'For every person who prays it — alone, as a couple, as a family or in a group',
    menu_title:              'Intercessors',
  },
  es: {
    site_title:         'La Oración Universal',
    hero_title:         'La Oración Universal',
    hero_subtitle:      'Novenas, coronillas y oraciones para cada intercesor — gratis, siempre.',
    choose_intercessor: 'Elige tu intercesor',
    feast_day:          'Día festivo:',
    tab_prayer:         'Oración',
    tab_history:        'Historia',
    tab_miracles:       'Milagros',
    tab_novena:         'Novena',
    tab_story:          '📖 Cuento',
    tab_chaplet:        'Coronilla',
    tab_litany:         'Letanías',
    tab_consecration:   'Consagración',
    day:                'Día',
    no_chaplet:         'No hay coronilla disponible para este intercesor.',
    no_litany:          'No hay letanías disponibles para este intercesor.',
    no_consecration:    'No hay consagración disponible para este intercesor.',
    novena_prayers:     '📿 Oraciones para rezar',
    chaplet_lbl:        'Coronilla',
    not_found_title:    'Intercesor no encontrado',
    not_found_text:     'No pudimos encontrar este intercesor. Por favor regresa a la página principal.',
    go_home:            'Ir al inicio',
    footer_text:             'Un recurso devocional católico gratuito. Sin anuncios. Sin rastreo.',
    universal_prayer_title:  'La Oración Universal y Definitiva',
    universal_prayer_dedication: 'Para toda persona que la rece — solo, en pareja, en familia o en grupo',
    menu_title:              'Intercesores',
  },
};

// ── PRAYER TEXTS (for novena support panel) ────────
const PRAYERS = {
  es: {
    pn_title:    'Padre Nuestro',
    pn:          'Padre nuestro, que estás en el cielo,\nsantificado sea tu nombre;\nvenga a nosotros tu reino;\nhágase tu voluntad\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo también nosotros perdonamos\na los que nos ofenden;\nno nos dejes caer en tentación,\ny líbranos del mal. Amén.',
    am_title:    'Ave María',
    am:          'Dios te salve, María,\nllena eres de gracia,\nel Señor es contigo;\nbendita tú eres entre todas las mujeres,\ny bendito es el fruto de tu vientre, Jesús.\nSanta María, Madre de Dios,\nruega por nosotros, pecadores,\nahora y en la hora de nuestra muerte. Amén.',
    gloria_title:'Gloria',
    gloria:      'Gloria al Padre,\ny al Hijo,\ny al Espíritu Santo.\nComo era en el principio,\nahora y siempre,\npor los siglos de los siglos. Amén.',
    credo_title: 'Credo de los Apóstoles',
    credo:       'Creo en Dios,\nPadre todopoderoso,\nCreador del cielo y de la tierra.\nCreo en Jesucristo, su único Hijo,\nNuestro Señor,\nque fue concebido por obra y gracia\ndel Espíritu Santo,\nnació de Santa María Virgen,\npadeció bajo el poder de Poncio Pilato,\nfue crucificado, muerto y sepultado,\ndescendió a los infiernos,\nal tercer día resucitó de entre los muertos,\nsubió a los cielos y está sentado\na la derecha de Dios Padre todopoderoso.\nDesde allí ha de venir a juzgar\na vivos y muertos.\nCreo en el Espíritu Santo,\nla santa Iglesia católica,\nla comunión de los santos,\nel perdón de los pecados,\nla resurrección de la carne\ny la vida eterna. Amén.',
    senial_title: 'Señal de la Cruz',
    senial:       'En el nombre del Padre,\ny del Hijo,\ny del Espíritu Santo.\nAmén.',
    salve_title:  'Salve Regina',
    salve:        'Dios te salve, Reina y Madre\nde misericordia,\nvida, dulzura y esperanza nuestra;\nDios te salve.\nA Ti llamamos los desterrados\nhijos de Eva;\na Ti suspiramos, gimiendo y llorando\nen este valle de lágrimas.\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos\nmisericordiosos;\ny después de este destierro,\nmuéstranos a Jesús,\nfruto bendito de tu vientre.\n¡Oh clementísima, oh piadosa,\noh dulce Virgen María!',
  },
  en: {
    pn_title:    'Our Father',
    pn:          'Our Father, who art in heaven,\nhallowed be Thy name;\nThy kingdom come;\nThy will be done\non earth as it is in heaven.\nGive us this day our daily bread;\nand forgive us our trespasses,\nas we forgive those\nwho trespass against us;\nand lead us not into temptation,\nbut deliver us from evil. Amen.',
    am_title:    'Hail Mary',
    am:          'Hail Mary, full of grace,\nthe Lord is with thee;\nblessed art thou among women,\nand blessed is the fruit\nof thy womb, Jesus.\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour\nof our death. Amen.',
    gloria_title:'Glory Be',
    gloria:      'Glory be to the Father,\nand to the Son,\nand to the Holy Spirit.\nAs it was in the beginning,\nis now, and ever shall be,\nworld without end. Amen.',
    credo_title: "Apostles' Creed",
    credo:       'I believe in God,\nthe Father almighty,\nCreator of heaven and earth,\nand in Jesus Christ,\nhis only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nhe descended into hell;\non the third day he rose again;\nhe ascended into heaven,\nand is seated at the right hand\nof God the Father almighty;\nfrom there he will come\nto judge the living and the dead.\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting. Amen.',
    senial_title: 'Sign of the Cross',
    senial:       'In the name of the Father,\nand of the Son,\nand of the Holy Spirit.\nAmen.',
    salve_title:  'Hail, Holy Queen',
    salve:        'Hail, Holy Queen,\nMother of Mercy,\nour life, our sweetness\nand our hope.\nTo thee do we cry,\npoor banished children of Eve.\nTo thee do we send up our sighs,\nmourning and weeping\nin this valley of tears.\nTurn then, most gracious advocate,\nthine eyes of mercy toward us,\nand after this our exile,\nshow unto us the blessed fruit\nof thy womb, Jesus.\nO clement, O loving,\nO sweet Virgin Mary.',
  },
};

// ── BASE PRAYERS CONFIG ───────────────────────────
const BASE_PRAYERS = [
  { id: 'senial', titleKey: 'senial_title', textKey: 'senial' },
  { id: 'pn',     titleKey: 'pn_title',     textKey: 'pn'     },
  { id: 'am',     titleKey: 'am_title',     textKey: 'am'     },
  { id: 'gloria', titleKey: 'gloria_title', textKey: 'gloria' },
  { id: 'credo',  titleKey: 'credo_title',  textKey: 'credo'  },
  { id: 'salve',  titleKey: 'salve_title',  textKey: 'salve'  },
];

// ── ALL KNOWN INTERCESSORS ─────────────────────────
const INTERCESSORS = [
  { id: 'misericordia',      subdomain: 'misericordia',      chaplet: true,  novena: true,  color: '#a01818', short: { es: 'D. Misericordia', en: 'Divine Mercy'     }, name: { en: 'Divine Mercy',                          es: 'Divina Misericordia'                      }, specialty: { es: 'Misericordia y perdón',       en: 'Mercy & forgiveness'         } },
  { id: 'inmaculadocorazon', subdomain: 'inmaculadocorazon', chaplet: true,  novena: true,  color: '#1a5fa0', short: { es: 'Inm. Corazón',    en: 'Imm. Heart'       }, name: { en: 'Immaculate Heart of Mary',               es: 'Inmaculado Corazón de María'               }, specialty: { es: 'Consagración y refugio',      en: 'Consecration & refuge'       } },
  { id: 'sagradocorazon',    subdomain: 'sagradocorazon',    chaplet: true,  novena: true,  color: '#7a1515', short: { es: 'S. Corazón',      en: 'Sacred Heart'     }, name: { en: 'Sacred Heart',                          es: 'Sagrado Corazón'                          }, specialty: { es: 'Amor y reparación',           en: 'Love & reparation'           } },
  { id: 'providencia',       subdomain: 'providencia',       chaplet: false, novena: true,  color: '#6b4800', short: { es: 'Div. Providencia', en: 'Div. Providence'  }, name: { en: 'Divine Providence',                     es: 'La Divina Providencia'                    }, specialty: { es: 'Confianza y provisión',       en: 'Trust & provision'           } },
  { id: 'guadalupe',         subdomain: 'guadalupe',         chaplet: true,  novena: true,  color: '#7a6010', short: { es: 'Guadalupe',        en: 'Guadalupe'        }, name: { en: 'Our Lady of Guadalupe',                 es: 'Virgen de Guadalupe'                      }, specialty: { es: 'Pueblos y familias',          en: 'Peoples & families'          } },
  { id: 'fatima',            subdomain: 'fatima',            chaplet: true,  novena: true,  color: '#1a4a7a', short: { es: 'Fátima',           en: 'Fátima'           }, name: { en: 'Our Lady of Fatima',                    es: 'Virgen de Fátima'                         }, specialty: { es: 'Paz y conversión',            en: 'Peace & conversion'          } },
  { id: 'padrepio',          subdomain: 'padrepio',          chaplet: true,  novena: true,  color: '#5a3828', short: { es: 'Padre Pío',        en: 'Padre Pio'        }, name: { en: 'Padre Pio',                             es: 'Padre Pío'                                }, specialty: { es: 'Confesión y sanación',        en: 'Confession & healing'        } },
  { id: 'sanjose',           subdomain: 'sanjose',           chaplet: true,  novena: true,  color: '#7a5e18', short: { es: 'San José',         en: 'St. Joseph'       }, name: { en: 'Saint Joseph',                          es: 'San José'                                 }, specialty: { es: 'Hogares y trabajadores',      en: 'Homes & workers'             } },
  { id: 'sanjudas',          subdomain: 'sanjudas',          chaplet: true,  novena: true,  color: '#1a6a3a', short: { es: 'San Judas',        en: 'St. Jude'         }, name: { en: 'Saint Jude Thaddaeus',                  es: 'San Judas Tadeo'                          }, specialty: { es: 'Causas imposibles',           en: 'Impossible causes'           } },
  { id: 'juanpablo',         subdomain: 'juanpablo',         chaplet: false, novena: true,  color: '#2a3a5a', short: { es: 'Juan Pablo II',    en: 'John Paul II'     }, name: { en: 'Saint John Paul II',                    es: 'San Juan Pablo II'                        }, specialty: { es: 'Jóvenes y familias',          en: 'Youth & families'            } },
  { id: 'sanantonio',        subdomain: 'sanantonio',        chaplet: true,  novena: true,  color: '#6a3018', short: { es: 'San Antonio',      en: 'St. Anthony'      }, name: { en: 'Saint Anthony of Padua',                es: 'San Antonio de Padua'                     }, specialty: { es: 'Lo perdido y los pobres',     en: 'Lost things & the poor'      } },
  { id: 'teresacalcuta',     subdomain: 'teresacalcuta',     chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'Sta. Teresa',      en: 'St. Teresa'       }, name: { en: 'Saint Teresa of Calcutta',              es: 'Santa Teresa de Calcuta'                  }, specialty: { es: 'Los más pobres',              en: 'The poorest of the poor'     } },
  { id: 'sanmiguel',         subdomain: 'sanmiguel',         chaplet: true,  novena: true,  color: '#253070', short: { es: 'San Miguel',       en: 'St. Michael'      }, name: { en: 'Saint Michael the Archangel',           es: 'San Miguel Arcángel'                      }, specialty: { es: 'Protección espiritual',       en: 'Spiritual protection'        } },
  { id: 'sangabriel',        subdomain: 'sangabriel',        chaplet: true,  novena: true,  color: '#1a3a6b', short: { es: 'San Gabriel',      en: 'St. Gabriel'      }, name: { en: 'Saint Gabriel the Archangel',           es: 'San Gabriel Arcángel'                     }, specialty: { es: 'Mensajes divinos',            en: 'Divine messages'             } },
  { id: 'sanrafael',         subdomain: 'sanrafael',         chaplet: true,  novena: true,  color: '#1a5c3a', short: { es: 'San Rafael',       en: 'St. Raphael'      }, name: { en: 'Saint Raphael the Archangel',           es: 'San Rafael Arcángel'                      }, specialty: { es: 'Sanación y viajeros',         en: 'Healing & travelers'         } },
  { id: 'angelguarda',       subdomain: 'angelguarda',       chaplet: false, novena: true,  color: '#4a4a70', short: { es: 'Ángel Custodio',   en: 'Guardian Angel'   }, name: { en: 'Guardian Angel',                        es: 'Ángel de la Guarda'                       }, specialty: { es: 'Custodia personal',           en: 'Personal guardian'           } },
  { id: 'divinaprovidencia', subdomain: 'divinaprovidencia', chaplet: false, novena: true,  color: '#7a5a00', short: { es: 'N.S. Providencia', en: 'Lady Providence'  }, name: { en: 'Our Lady of Divine Providence',         es: 'Nuestra Señora de la Divina Providencia'  }, specialty: { es: 'Necesidades cotidianas',      en: 'Daily needs & trust'         } },
  { id: 'santarita',         subdomain: 'santarita',         chaplet: true,  novena: true,  color: '#7a1520', short: { es: 'Santa Rita',       en: 'St. Rita'         }, name: { en: 'Saint Rita of Cascia',                  es: 'Santa Rita de Casia'                      }, specialty: { es: 'Causas imposibles',           en: 'Impossible causes'           } },
  { id: 'sanfelipeneri',     subdomain: 'sanfelipeneri',     chaplet: true,  novena: true,  color: '#8a4a10', short: { es: 'S. Felipe Neri',   en: 'St. Philip Neri'  }, name: { en: 'Saint Philip Neri',                     es: 'San Felipe Neri'                          }, specialty: { es: 'Alegría y conversión',        en: 'Joy & conversion'            } },
  { id: 'schoenstatt',       subdomain: 'schoenstatt',       chaplet: false, novena: true,  color: '#1a3070', short: { es: 'Schoenstatt',      en: 'Schoenstatt'      }, name: { en: 'Our Lady of Schoenstatt',                es: 'Virgen de Schoenstatt'                    }, specialty: { es: 'Alianza de amor y familia',   en: 'Covenant of love & family'   } },
  { id: 'santadymphna',      subdomain: 'santadymphna',      chaplet: false, novena: true,  color: '#4a2a7a', short: { es: 'Sta. Dymphna',     en: 'St. Dymphna'      }, name: { en: 'Saint Dymphna',                         es: 'Santa Dymphna'                            }, specialty: { es: 'Salud mental y paz',          en: 'Mental health & peace'       } },
  { id: 'santateresita',     subdomain: 'santateresita',     chaplet: true,  novena: true,  color: '#8a2050', short: { es: 'Sta. Teresita',    en: 'St. Thérèse'      }, name: { en: 'Saint Thérèse of the Child Jesus',      es: 'Santa Teresita del Niño Jesús'            }, specialty: { es: 'El camino pequeño',           en: 'The Little Way'              } },
  { id: 'sanvicente',        subdomain: 'sanvicente',        chaplet: true,  novena: true,  color: '#1a3a6a', short: { es: 'S. Vicente',       en: 'St. Vincent'      }, name: { en: 'Saint Vincent de Paul',                 es: 'San Vicente de Paúl'                      }, specialty: { es: 'Caridad y los pobres',        en: 'Charity and the poor'        } },
  { id: 'santafabiola',     subdomain: 'santafabiola',     chaplet: false, novena: true,  color: '#8a5010', short: { es: 'Sta. Fabiola',    en: 'St. Fabiola'      }, name: { en: 'Saint Fabiola of Rome',                 es: 'Santa Fabiola de Roma'                    }, specialty: { es: 'Enfermos y penitentes',       en: 'Sick & penitents'            } },
  { id: 'sanjuanapostol',   subdomain: 'sanjuanapostol',   chaplet: true,  novena: true,  color: '#1a3a6a', short: { es: 'San Juan Ap.',    en: 'St. John Ap.'     }, name: { en: 'Saint John the Apostle',                es: 'San Juan Apóstol'                         }, specialty: { es: 'Amor y contemplación',        en: 'Love & contemplation'        } },
  { id: 'santacatalina',    subdomain: 'santacatalina',    chaplet: true,  novena: true,  color: '#5a1a8a', short: { es: 'Sta. Catalina',  en: 'St. Catherine'    }, name: { en: 'Saint Catherine of Siena',              es: 'Santa Catalina de Siena'                  }, specialty: { es: 'Paz y reforma de la Iglesia', en: 'Peace & Church reform'       } },
  { id: 'santaclara',       subdomain: 'santaclara',       chaplet: true,  novena: true,  color: '#8a6020', short: { es: 'Sta. Clara',     en: 'St. Clare'        }, name: { en: 'Saint Clare of Assisi',                 es: 'Santa Clara de Asís'                      }, specialty: { es: 'Pobreza evangélica',          en: 'Evangelical poverty'         } },
  { id: 'santabarbara',     subdomain: 'santabarbara',     chaplet: false, novena: true,  color: '#8a1a1a', short: { es: 'Sta. Bárbara',   en: 'St. Barbara'      }, name: { en: 'Saint Barbara',                         es: 'Santa Bárbara'                            }, specialty: { es: 'Muerte repentina y mineros',  en: 'Sudden death & miners'       } },
  { id: 'sanbrendan',       subdomain: 'sanbrendan',       chaplet: false, novena: true,  color: '#1a4a6a', short: { es: 'San Brendán',    en: 'St. Brendan'      }, name: { en: 'Saint Brendan the Navigator',           es: 'San Brendán Navegante'                    }, specialty: { es: 'Navegantes y viajeros',       en: 'Sailors & travelers'         } },
  { id: 'sanguillermo',     subdomain: 'sanguillermo',     chaplet: false, novena: true,  color: '#1a5a2a', short: { es: 'San Guillermo',  en: 'St. William'      }, name: { en: 'Saint William of Vercelli',             es: 'San Guillermo de Vercelli'                }, specialty: { es: 'Ermitaños y peregrinos',      en: 'Hermits & pilgrims'          } },
  { id: 'sancarlos',        subdomain: 'sancarlos',        chaplet: false, novena: true,  color: '#8a2a1a', short: { es: 'San Carlos',     en: 'St. Charles'      }, name: { en: 'Saint Charles Borromeo',                es: 'San Carlos Borromeo'                      }, specialty: { es: 'Reforma de la Iglesia',       en: 'Church reform & seminaries'  } },
  { id: 'santacelina',      subdomain: 'santacelina',      chaplet: false, novena: true,  color: '#2a4a7a', short: { es: 'Sta. Celina',    en: 'St. Céline'       }, name: { en: 'Saint Céline',                          es: 'Santa Celina'                             }, specialty: { es: 'Madres y familias',           en: 'Mothers & families'          } },
  { id: 'sanagustin',        subdomain: 'sanagustin',        chaplet: false, novena: true,  color: '#5a3010', short: { es: 'San Agustín',      en: 'St. Augustine'    }, name: { en: 'Saint Augustine of Hippo',               es: 'San Agustín de Hipona'                    }, specialty: { es: 'Conversión y sabiduría',       en: 'Conversion & wisdom'         } },
  { id: 'sancristobal',      subdomain: 'sancristobal',      chaplet: false, novena: true,  color: '#1a5a3a', short: { es: 'San Cristóbal',    en: 'St. Christopher'  }, name: { en: 'Saint Christopher',                      es: 'San Cristóbal'                            }, specialty: { es: 'Viajeros y conductores',       en: 'Travelers & drivers'         } },
  { id: 'sanexpedito',       subdomain: 'sanexpedito',       chaplet: false, novena: true,  color: '#8a2010', short: { es: 'San Expedito',     en: 'St. Expeditus'    }, name: { en: 'Saint Expeditus',                        es: 'San Expedito'                             }, specialty: { es: 'Causas urgentes',              en: 'Urgent causes'               } },
  { id: 'sanfrancisco',      subdomain: 'sanfrancisco',      chaplet: true,  novena: true,  color: '#6b4226', short: { es: 'San Francisco',    en: 'St. Francis'      }, name: { en: 'Saint Francis of Assisi',                es: 'San Francisco de Asís'                    }, specialty: { es: 'Paz y creación',               en: 'Peace & creation'            } },
  { id: 'sanlorenzo',        subdomain: 'sanlorenzo',        chaplet: false, novena: true,  color: '#8a4a00', short: { es: 'San Lorenzo',      en: 'St. Lawrence'     }, name: { en: 'Saint Lawrence',                         es: 'San Lorenzo'                              }, specialty: { es: 'Pobres y libreros',            en: 'Poor & librarians'           } },
  { id: 'sannicolas',        subdomain: 'sannicolas',        chaplet: false, novena: true,  color: '#1a3a8a', short: { es: 'San Nicolás',      en: 'St. Nicholas'     }, name: { en: 'Saint Nicholas',                         es: 'San Nicolás'                              }, specialty: { es: 'Niños y generosidad',          en: 'Children & generosity'       } },
  { id: 'santaines',         subdomain: 'santaines',         chaplet: false, novena: true,  color: '#8a1a5a', short: { es: 'Santa Inés',      en: 'St. Agnes'        }, name: { en: 'Saint Agnes',                            es: 'Santa Inés'                               }, specialty: { es: 'Pureza y jóvenes',             en: 'Purity & youth'              } },
  { id: 'santalucia',        subdomain: 'santalucia',        chaplet: false, novena: true,  color: '#8a1a3a', short: { es: 'Santa Lucía',     en: 'St. Lucy'         }, name: { en: 'Saint Lucy',                             es: 'Santa Lucía'                              }, specialty: { es: 'Vista y enfermos',             en: 'Eyesight & the sick'         } },
  { id: 'santamonica',       subdomain: 'santamonica',       chaplet: false, novena: true,  color: '#1a3a6a', short: { es: 'Santa Mónica',    en: 'St. Monica'       }, name: { en: 'Saint Monica',                           es: 'Santa Mónica'                             }, specialty: { es: 'Madres y conversión',          en: 'Mothers & conversion'        } },
  { id: 'perpetuosocorro',   subdomain: 'perpetuosocorro',   chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'P. Socorro',      en: 'Perp. Help'       }, name: { en: 'Our Lady of Perpetual Help',              es: 'Virgen del Perpetuo Socorro'               }, specialty: { es: 'Auxilio y esperanza',          en: 'Help & hope'                 } },
  { id: 'mariaauxiliadora',  subdomain: 'mariaauxiliadora',  chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'M. Auxiliadora',  en: 'Mary Help'        }, name: { en: 'Mary Help of Christians',               es: 'María Auxiliadora'                        }, specialty: { es: 'Auxilio y juventud salesiana', en: 'Help & Salesian youth'       } },
  { id: 'santarosa',         subdomain: 'santarosa',         chaplet: false, novena: true,  color: '#7a1a3a', short: { es: 'Sta. Rosa',       en: 'St. Rose'         }, name: { en: 'Saint Rose of Lima',                    es: 'Santa Rosa de Lima'                       }, specialty: { es: 'Primera santa de América',     en: 'First saint of the Americas' } },
  { id: 'santaalejandra',    subdomain: 'santaalejandra',    chaplet: false, novena: true,  color: '#3a1a6a', short: { es: 'Sta. Alejandra',  en: 'St. Alexandra'    }, name: { en: 'Saint Alexandra of Rome',               es: 'Santa Alejandra de Roma'                  }, specialty: { es: 'Fe y valentía ante el mundo',  en: 'Faith & courage before the world' } },
  { id: 'santaroxana',       subdomain: 'santaroxana',       chaplet: false, novena: true,  color: '#7a4800', short: { es: 'Sta. Roxana',    en: 'St. Roxana'       }, name: { en: 'Saint Roxana of Persia',                es: 'Santa Roxana de Persia'                   }, specialty: { es: 'Mártir persa, estrella brillante', en: 'Persian martyr, bright star' } },
  { id: 'santagwendolina',   subdomain: 'santagwendolina',   chaplet: false, novena: true,  color: '#1a5a3a', short: { es: 'Sta. Gwendolina', en: 'St. Gwendoline'   }, name: { en: 'Saint Gwendoline',                      es: 'Santa Gwendolina'                         }, specialty: { es: 'Mártir galesa, pureza y fe celta', en: 'Welsh martyr, Celtic faith and purity' } },
  { id: 'santanoemi',        subdomain: 'santanoemi',        chaplet: false, novena: true,  color: '#5a3800', short: { es: 'Sta. Noemí',     en: 'St. Naomi'        }, name: { en: 'Saint Naomi',                           es: 'Santa Noemí'                              }, specialty: { es: 'Matrona bíblica del Libro de Rut', en: 'Biblical matriarch from the Book of Ruth' } },
  { id: 'sanperegrino',      subdomain: 'sanperegrino',      chaplet: false, novena: true,  color: '#8a1a3a', short: { es: 'San Peregrino',   en: 'St. Peregrine'    }, name: { en: 'Saint Peregrine Laziosi',               es: 'San Peregrino Laziosi'                    }, specialty: { es: 'Enfermos de cáncer',          en: 'Cancer patients'             } },
  { id: 'sancamilo',          subdomain: 'sancamilo',          chaplet: false, novena: true,  color: '#8a0010', short: { es: 'San Camilo',      en: 'St. Camillus'     }, name: { en: 'Saint Camillus de Lellis',              es: 'San Camilo de Lelis'                      }, specialty: { es: 'Enfermos y personal sanitario', en: 'Sick & healthcare workers'   } },
  { id: 'sanblas',            subdomain: 'sanblas',            chaplet: false, novena: true,  color: '#1828a0', short: { es: 'San Blas',        en: 'St. Blaise'       }, name: { en: 'Saint Blaise of Sebaste',              es: 'San Blas de Sebaste'                      }, specialty: { es: 'Garganta y vías respiratorias', en: 'Throat & airways'            } },
  { id: 'sancharbel',         subdomain: 'sancharbel',         chaplet: false, novena: true,  color: '#1a2a5a', short: { es: 'San Charbel',     en: 'St. Charbel'      }, name: { en: 'Saint Charbel Makhlouf',               es: 'San Charbel Makhlouf'                     }, specialty: { es: 'Sanación y milagros',         en: 'Healing & miracles'          } },
  { id: 'santaana',            subdomain: 'santaana',            chaplet: false, novena: true,  color: '#8a5a00', short: { es: 'Santa Ana',       en: 'St. Anne'         }, name: { en: 'Saint Anne',                           es: 'Santa Ana'                                }, specialty: { es: 'Infertilidad y maternidad',      en: 'Infertility & motherhood'    } },
  { id: 'sanjuandedios',       subdomain: 'sanjuandedios',       chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'San Juan de Dios', en: 'St. John of God'  }, name: { en: 'Saint John of God',                    es: 'San Juan de Dios'                         }, specialty: { es: 'Corazón y hospitales',         en: 'Heart & hospitals'           } },
  { id: 'santaapolonia',       subdomain: 'santaapolonia',       chaplet: false, novena: true,  color: '#a03060', short: { es: 'Santa Apolonia',  en: 'St. Apollonia'    }, name: { en: 'Saint Apollonia of Alexandria',        es: 'Santa Apolonia de Alejandría'             }, specialty: { es: 'Dolores dentales',                en: 'Dental pain'                 } },
];

// ── KEYWORD MAP — synonyms for prayer-intent search ──────
// Each value is a space-separated string of extra search terms (ES + EN)
const KEYWORD_MAP = {
  misericordia:      'misericordia divina divine mercy faustina kowalska coronilla chaplet pecado culpa vergüenza arrepentimiento remordimiento confesion reconciliacion perdon segunda oportunidad conversion retorno volver a dios sin guilt shame repentance remorse confession reconciliation forgiveness second chance conversion returning to god estres angustia desesperacion sufrimiento dolor duelo muerte purgatorio moribundos agonia hora muerte stress anguish despair suffering pain grief death purgatory dying agony hour of death consuelo esperanza paz interior consolacion consolation hope inner peace lujuria soberbia envidia ira pereza avaricia gula tentaciones pecados capitales lust pride envy wrath sloth greed gluttony deadly sins capital sins temptation',
  santadymphna:      'dymphna salud mental mental health depresion depression ansiedad anxiety panico panic attacks ataques de panico trastorno bipolar bipolar disorder esquizofrenia schizophrenia psicosis psychosis neurosis OCD trastorno obsesivo compulsivo PTSD trauma estres postraumatico burnout agotamiento nervioso nervous breakdown estres cronico chronic stress fobia phobia agorafobia agoraphobia fobie phobias autismo autism TDAH ADHD insomnio insomnia pesadillas nightmares autolesion self harm ideacion suicida suicidal thoughts soledad extrema extreme loneliness crisis nerviosa nervous crisis psiquiatria psychiatry terapia therapy consejeria counseling hospitalizacion psiquiatrica psychiatric hospitalization familia de enfermos mentales families of mentally ill cuidadores caretakers',
  sanfelipeneri:     'felip neri alegria gozo felicidad risa humor jovialidad joy laughter happiness cheerfulness comunidad community amistad friendship depresion tristeza melancolia depression sadness melancholy agotamiento espiritual spiritual exhaustion burnout rutina mundana mundane routine falta de motivacion lack of motivation seccion juvenil youth oratorio rome roma sacerdote priest fundador founder carisma charisma musica music canto singing vida espiritual alegre joyful spiritual life',
  providencia:       'providencia divina provision dinero deudas economia facturas renta alquiler hipoteca bills rent mortgage debt finances necesidad extrema extreme need desempleo desocupacion unemployment sin trabajo without work comida food hambre hunger ropa clothing pobreza poverty confiar en dios trust in god sustento sustenance provision diaria daily provision angustia economica financial anxiety quiebra bankruptcy crisis economica financial crisis cuentas accounts gastos expenses',
  divinaprovidencia: 'providencia divina provision necesidades cotidianas daily needs dinero deudas economia financiera facturas renta alquiler hipoteca bills rent mortgage debt finances desempleo unemployment trabajo work comida food hambre hunger pobreza poverty confianza en dios trust in god sustento sustenance angustia economica financial anxiety quiebra bankruptcy gastos expenses recursos limitados limited resources familia numerosa large family hijos children crianza upbringing',
  sanjudas:          'judas tadeo causas imposibles hopeless causes impossible causes desesperacion total total desperation ultimo recurso last resort situacion sin salida no way out crisis extrema extreme crisis deudas imposibles impossible debts enfermedad terminal terminal illness relacion imposible impossible relationship adiccion severa severe addiction alcoholismo severo severe alcoholism situacion critica critical situation borde del abismo edge of the abyss milagro urgente urgent miracle intervencion divina divine intervention',
  santarita:         'rita cascia imposible impossible matrimonio marriage violencia domestica domestic violence abuso fisico emocional physical emotional abuse divorcio divorce separacion separation viuda widow estigmas stigmata rosa rose herida wound sufrimiento silencioso silent suffering causa dificil difficult cause esposo dificil difficult husband reconciliacion marital marital reconciliation violencia familiar family violence adiccion del esposo husband addiction alcoholismo en el hogar alcoholism at home mal trato mistreatment hijos en peligro children in danger',
  sanjose:           'jose obrero trabajo empleo desempleo laboral carpintero artesano worker job unemployment work carpenter artisan padre esposo protector father husband protector casa hogar home familia family sustento provision dinero money estabilidad stability seguridad security refugio refuge patrono patrones patron workers artesanos oficios trades obreros laborers economia economy salario wage sustento livelihood casa propia own home hipoteca mortgage crisis laboral work crisis jubilacion retirement',
  sanmiguel:         'miguel arcangel proteccion espiritual spiritual protection mal evil demonio demon espiritu maligno evil spirit tentacion temptation miedo fear opresion espiritual spiritual oppression liberacion deliverance exorcismo exorcism guerra espiritual spiritual warfare batalla espiritual spiritual battle maldicion curse brujeria witchcraft magia negra black magic ataque espiritual spiritual attack pesadillas nightmares presencia oscura dark presence ansiedad espiritual spiritual anxiety lujuria soberbia envidia ira pereza avaricia gula pecados capitales tentaciones lust pride envy wrath sloth greed gluttony deadly sins temptation proteccion familia family protection ninos children seguridad policia military fuerzas armadas police armed forces',
  angelguarda:       'angel guardian proteccion protection ninos children viaje travel peligro danger miedo fear accidentes accidents seguridad safety custodia custody cuidado care guia guidance pesadillas nightmares suenos dreams perdido lost miedo nocturno nighttime fear ninos pequeños small children adolescentes teenagers estudiantes students soledad loneliness proteccion en carretera road protection ciclistas cyclists conductores drivers peatones pedestrians',
  sanrafael:         'rafael arcangel sanacion curacion healing enfermedad illness salud health medicina medicine hospital medicos doctors enfermeros nurses operacion surgery cirugia surgery recuperacion recovery cancer tumor oncologia oncology enfermedad grave serious illness terminal illness viaje travel Tobias Tobiah matrimonio marriage amor love encuentro de pareja finding a partner depresion depression mental health salud mental problemas digestivos digestive problems artritis arthritis diabetes enfermedades cronicas chronic diseases rehabilitacion rehabilitation fisioterapia physical therapy',
  padrepio:          'padre pio pio pietrelcina estigmas stigmata sanacion curacion healing confesion confession direction espiritual spiritual direction enfermedad illness cancer tumor oncologia oncology enfermedad grave serious illness milagros miracles bilocation bilocacion rosas roses olor fragancia perfume supernatural aroma culpa guilt conversion conversion sacerdote confesor confessor priest alma soul purgatorio purgatory intercesion intercession sanacion espiritual spiritual healing adiccion addiction alcoholismo alcoholism',
  santafabiola:      'fabiola roma divorciados divorced enfermos sick hospital enfermedad illness sanacion healing fundadora hospitales founder of hospitals viudas widows reconciliacion reconciliation segunda oportunidad second chance errores pasados past mistakes conversion comeback regreso a la fe returning to faith vida nueva new life pecado sin arrepentimiento repentance cancer tumor oncologia oncology enfermedad grave serious illness terminal illness cuidado de enfermos care of the sick',
  fatima:            'fatima portugal rosario rosary paz peace guerra war conflicto conflict conversion del mundo world conversion rusia russia consagracion consecration corazon inmaculado immaculate heart mensaje message tres pastores three shepherds lucia jacinta francisco vision apparition aparicion nuestra señora our lady virgen virgin profecia prophecy primera sabado first saturday cinco primeros sabados five first saturdays oracion prayer penitencia penance reparacion reparation fin de guerra end of war familia en peligro family in danger mundo en caos world in chaos',
  guadalupe:         'guadalupe juan diego mexico tilma manto aparicion apparition virgen morena brown virgin america latina latin america hispanos hispanics inmigrantes immigrants indocumentados undocumented naciones nations pueblo people humildes humble tonatzin azteca aztec ninos no nacidos unborn abortion aborto mujer woman dignidad dignity embarazo pregnancy refugio shelter esperanza hope marginados marginalized cultura culture identidad identity patria homeland',
  sanantonio:        'antonio padova padua perdido lost objetos objects cosas things encontrar find misplaced keys llaves billetera wallet documentos documents milagros miracles pobres poor pan bread matrimonio marriage pareja partner novio novio boyfriend girlfriend amor love predicador preacher doctor iglesia church milagros de antonio miracles franciscano franciscan',
  teresacalcuta:     'teresa calcula madre teresa pobres poor abandono abandonment soledad loneliness pobreza poverty marginados marginalized moribundos dying desechados discarded misioneras de la caridad missionaries of charity calcuta calcutta india servicio service caridad charity generosidad generosity dar giving voluntariado volunteering indigentes homeless hambre hunger miseria misery dignidad dignity amor incondicional unconditional love oracion prayer accion action fe activa active faith',
  juanpablo:         'juan pablo ii karol wojtyla jovenes youth universitarios university adolescentes teenagers vocacion vocation juventud world youth day jornada mundial sacerdocio priesthood matrimonio marriage familia family trabajo work filosofia philosophy teologia theology fenomenologia phenomenology evangelizacion evangelization nueva evangelizacion new evangelization solidaridad solidarity Polonia Poland',
  sagradocorazon:    'sagrado corazon jesus amor love consagracion consecration reparacion reparation consolacion consolation primer viernes first friday nueve primeros viernes nine first fridays margarita maria alacoque doce promesas twelve promises tristeza sadness pecado sin consuelo comfort pecados capitales capital sins lujuria soberbia envidia ira pereza avaricia gula tentaciones lust pride envy wrath sloth greed gluttony temptation familia family hogar home escuela school pais country abandono de la fe abandonment of faith retorno a la fe return to faith frialdad espiritual spiritual coldness tibieza lukewarmness',
  inmaculadocorazon: 'inmaculado corazon maria refugio refuge proteccion protection miedo fear angustia anguish estres stress amparo shelter devocion mariana marian devotion sabados saturdays cinco primeros sabados five first saturdays consagracion a maria consecration to mary esclavitud espiritual spiritual slavery luis grignon montfort total dependence conversion of sinners conversion de pecadores fatima rosario rosary novena familia family hijos children paz peace',
  santacatalina:     'catalina siena estudios studies examenes exams universidad university teologia theology filosofia philosophy doctora de la iglesia doctor of the church inteligencia intelligence sabiduria wisdom enfermedad illness anorexia estigmas stigmata cartas letters politica politics papa pope reforma church reform vocacion vocation discernimiento discernment mistica mystic union with god union con dios',
  santacelina:       'celina madre mother maternidad motherhood embarazo pregnancy infertilidad infertility hijos children familia family parto birth bebe baby aborto involuntario miscarriage perdida de bebe loss of baby complicaciones pregnancy complications lactancia breastfeeding crianza parenting madre soltera single mother familia numerosa large family hermana de santa teresa de lisieux sister of st therese lisieux',
  schoenstatt:       'schoenstatt familia family consagracion consecration matrimonio marriage amor conyugal conjugal love educacion education hijos children santificacion sanctification kentenich padre kentenich movimiento movement apostolado apostolate renovacion familiar family renewal crisis matrimonial marriage crisis comunicacion familiar family communication jovenes youth vocacion vocation',
  sangabriel:        'gabriel arcangel anunciacion annunciation comunicacion communication mensajes messages revelacion revelation buenas noticias good news vocacion vocation discernimiento discernment oracion prayer llamado calling dios te llama god is calling you miedo al futuro fear of the future incertidumbre uncertainty periodistas journalists comunicadores communicators medios media tecnologia technology',
  sanvicente:        'vicente paul san vicente de paul pobres poor caridad charity obras sociales social work voluntarios volunteers vincentinos vincentians misericordia mercy dar giving servicio service hambre hunger necesitados needy desempleados unemployed presos prisoners enfermos sick ancianos elderly homeless sin hogar misiones missions evangelizacion evangelization',
  sanjuanapostol:    'juan apostol amor love contemplacion contemplation teologia theology mistica mysticism evangelio gospel discipulo amado beloved disciple eucaristia eucharist ultima cena last supper cruz cross soledad loneliness union con dios union with god vida interior interior life oracion contemplativa contemplative prayer virgen maria virgin mary',
  santaclara:        'clara asis pobreza poverty sencillez simplicity milagros miracles television clausura cloistered monjas nuns vida contemplativa contemplative life consagracion consecration ayuno fasting penitencia penance obediencia obedience hermanas poor clares clarisa franciscana franciscan ojos eyes vision',
  santabarbara:      'barbara mártir rayo lightning tormenta storm trueno thunder muerte repentina sudden death militares military mineros miners artilleria artillery bomberos firefighters peligro extremo extreme danger proteccion protection conversion en la muerte conversion at death sacramentos last rites últimos sacramentos',
  sanbrendan:        'brendan navegante sailor marinero mariner viaje voyage mar sea atlantico atlantic océano ocean aventura adventure irlanda ireland monje monk peregrino pilgrim explorador explorer viaje espiritual spiritual journey vida nueva new life emigrantes emigrants viajeros travelers',
  sanguillermo:      'guillermo ermitano hermit peregrino pilgrim soledad solitude contemplacion contemplation vida sencilla simple life silencio silence retiro retreat desierto desert interior conversacion con dios conversation with god vocacion religiosa religious vocation discernimiento discernment comunidad community',
  sancarlos:         'carlos borromeo sacerdotes priests seminarios seminarians formacion formation disciplina discipline iglesia church plaga plague epidemia epidemic servicio service humildad humility reforma reform concilio tridentino council of trent caridad charity pastores pastors obispos bishops',
  sanfrancisco:      'francisco asis animales animals naturaleza nature ecologia ecology medio ambiente environment pobreza poverty paz peace hermandad brotherhood estigmas stigmata laudato si fraternidad fraternity sencillez simplicity hermano sol hermana luna brother sun sister moon pajaros birds lobos wolves flores flowers creacion creation cuidado creation care',
  santamonica:       'monica madre mother conversion hijo alejado strayed child alcoholismo alcoholism adiccion addiction esposo difícil difficult husband lagrimas tears perseverancia perseverance oracion constante constant prayer hijo prodigo prodigal son agustin augustine fe perdida lost faith regreso retorno return matrimonio dificil difficult marriage espera waiting paciencia patience nunca rendirse never give up madres solteras single mothers',
  sanagustin:        'agustin conversion intellectual teologia theology filosofia philosophy sabiduria wisdom duda doubt fe faith estudios studies universidad university confesiones confessions inquieto restless corazon heart pecado sin juventud youth errores mistakes vida desordenada disordered life gracia grace libre albedrio free will maniqueos manichaeism escepticismo scepticism regreso a la fe return to faith',
  santalucia:        'lucia siracusa ojos eyes vista sight problemas oculares eye problems ceguera blindness enfermedad ocular eye disease cirugia ocular eye surgery luz light martir martyr pureza purity castidad chastity virginidad virginity valor courage fe faith noche oscura dark night oracion prayer lucha battle',
  perpetuosocorro:   'perpetuo socorro auxilio ayuda urgente urgent help esperanza hope dificultades difficulties necesidad extrema extreme need recurso de ultima hora last resort misericordia mercy consolacion consolation angustia anguish desesperacion despair proteccion protection madre protectora protective mother intercesion intercession novena',
  mariaauxiliadora:  'maria auxiliadora don bosco salesianos salesians juventud youth familia family auxilio ayuda help needs necesidades milagro miracle proteccion protection educacion education oratorios oratories jovenes en riesgo at-risk youth cholera epidemia epidemic enfermos sick sanacion healing intervencion urgente urgent intervention',
  sanexpedito:       'expedito urgente urgent rapido fast inmediato immediate causas dificiles difficult causes celeridad speed procrastinacion procrastination demora delay decision decision tiempo time plazo deadline necesidad inmediata immediate need crisis situacion critica critical situation resolucion resolution',
  sanlorenzo:        'lorenzo diacono deacon pobres poor libreros librarians archivistas archivists cocineros cooks fuego fire martir martyr tesoros de la iglesia treasures of the church caridad generosidad charity generosity servicio service',
  santaines:         'ines agnes pureza purity castidad chastity jovenes young people virgenes virgins ninas girls adolescentes teenagers tentaciones temptations lujuria lust impureza impurity presion de grupo peer pressure acoso sexual sexual harassment pornografia pornography relaciones prematrimoniales premarital sex virtud virtue fortaleza strength conviccion conviction fe faith martir martyr',
  sannicolas:        'nicolas ninos children generosidad generosity regalos gifts navidad christmas pobres poor deudas debt marineros sailors obispos bishops esperanza hope milagros miracles donacion giving santa claus papa noel presentes presents ninos necesitados needy children',
  sancristobal:      'cristobal viajeros travelers conductores drivers automoviles cars accidentes accidents carretera highway transporte transport peligro danger viaje seguro safe travel proteccion protection motos motorcycles aviones airplanes trenes trains ciclistas cyclists camioneros truck drivers uber taxi',
  santarosa:         'rosa lima peru america latina latin america patrona patron penitencia penance contemplacion contemplation sufrimiento suffering estigmas stigmata dominica dominican terciaria tertiary aridez espiritual spiritual aridity desolacion desolation purificacion purification mistica mysticism jardín garden flores flowers belleza beauty',
  santaalejandra:    'alejandra sandra alessandra alexandra nombre name patron onomastica name day roma rome martir martyr conversion valentia courage fe faith defensora defender',
  santaroxana:       'roxana roshanak persia iran martir martyr nombre name fe courage valentia valentía estrella star oriente east convertida converted',
  santagwendolina:   'gwendolina wendy gwen gwyneth gales wales celta celtic martir martyr nombre name fe faith pureza purity virginidad virginity',
  santanoemi:        'noemi naomi rut ruth biblia bible viuda widow fidelidad faithfulness familia family suegra mother-in-law esperanza hope providencia providence regreso return tierra prometida promised land',
  sanperegrino:      'peregrino laziosi cancer cancro tumor oncologia oncology quimioterapia chemotherapy quimio chemo radioterapia radiotherapy radiation leucemia leukemia linfoma lymphoma melanoma sarcoma metastasis carcinoma enfermedad grave serious illness enfermedad incurable incurable disease amputacion amputation cirugia surgery operacion operation hospitalizacion hospitalization diagnostico diagnosis biopsia biopsy estadio stage tratamiento treatment curación curacion milagro miracle sanacion healing pierna leg hueso bone siervos de maria servants of mary forli italy santo de los enfermos saint of the sick patron cancer patron esperanza hope enfermos terminales terminal patients dolor pain sufrimiento suffering miedo fear angustia anxiety fe faith confianza trust entrega surrender',
  sancamilo:          'camilo camillus lelis lellis enfermeros nurses enfermeras medicos doctors hospital hospitales clinica clinic personal sanitario healthcare workers cruz roja red cross enfermos sick patients moribundos dying agonizantes terminal abandono abandonados cuidadores caregivers servicio service caridad charity soldado soldier conversion fundador founder orden camiliana camillian ministers of the sick ministros de los enfermos cuarto voto fourth vow ambulancia ambulance italia italy napoles naples roma rome jugador gambler violencia violence gracia grace sacramentos sacraments uncion unction extremauncion anointing of the sick',
  sanblas:            'blas blaise sebaste garganta throat vias respiratorias airways pulmones lungs tos cough asma asthma bronquitis bronchitis laringitis laryngitis faringitis pharyngitis amigdalitis tonsillitis ronquera hoarseness perdida de voz loss of voice enfermedad respiratoria respiratory illness EPOC COPD fibrosis pulmonar pulmonary fibrosis apnea sleep apnea infeccion respiratoria respiratory infection gripe flu resfriado cold anginas strep throat dolor de garganta sore throat benedicion gargantas blessing of throats velas candles obispo bishop martir martyr armenia medico physician ermitano hermit febrero february cantantes singers predicadores preachers ninos children hueso pescado fishbone bone',
  sancharbel:         'charbel makhlouf libano lebanon annaya maronita maronite ermitano hermit incorrupto incorrupt cuerpo body milagro miracle sanacion healing tumor cancer paralisis paralysis ciego blind enfermedad incurable incurable disease desahuciado terminal silencio silence eucaristia eucharist oracion prayer ayuno fasting austeridad austerity contemplacion contemplation cedarwood cedro beirut oriente medio middle east cristiano oriental eastern christian mistica mysticism luz light tumba tomb sangre blood agua water inexplicable unexplained medicina medicine imposible impossible esperanza hope',
  santaana:           'ana anne esterilidad infertilidad infertility barrenness embarazo pregnancy hijo child bebe baby madre mother abuela grandmother nacimiento birth maternidad motherhood joaquin adopcion adoption fertilidad fertility parto childbirth mujeres women espera waiting novena oracion prayer sainte-anne beaupre canada milagro miracle puerta dorada golden gate nazaret nazareth maria mary jesus abuela de jesus grandmother of jesus padres de maria parents of mary consuelo consolation familia family boda wedding matrimonio marriage',
  sanjuandedios:      'juan dios john god granada portugal hospitalario hospitaller hospital corazon heart enfermo sick pobre poor caridad charity conversion conversion cargar carrying fuego fire llamas flames enfermeros nurses medicos doctors cuidadores caregivers fundador founder orden hospitalaria hospitaller order granada espana spain enfermedad cardiaca heart disease cardiopatia cardiologia cardiology cateter stent cirugia de corazon heart surgery marcapasos pacemaker',
  santaapolonia:      'apolonia apollonia diente tooth muela molar dientes teeth dolor dental toothache dentista dentist odontologo odontologist encías gums caries cavity extracción extraction cirugia oral oral surgery implante implant ortodoncia braces fobia dental dental phobia miedo al dentista fear of dentist mártir martyr alejandria alexandria egipto egypt decio decius tenazas pincers forceps boca mouth mandíbula jaw maxilar jaw febrero february',
};

// ── STATE ──────────────────────────────────────────
let currentLang = 'en';
let intercessorData = null;
let currentDay = 1;

// ── LANGUAGE DETECTION ─────────────────────────────
function detectLanguage() {
  const saved = localStorage.getItem('tup_lang');
  if (saved) return saved;
  // Detect from browser
  const browserLang = navigator.language || navigator.userLanguage || '';
  return browserLang.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tup_lang', lang);
  document.documentElement.lang = lang;

  // Update toggle button label
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'en' ? 'ES' : 'EN';

  // Apply static UI strings
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
  });

  // Toggle bilingual prayer blocks
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });

  // Re-render menu items in new language
  if (window._renderMenuItems) window._renderMenuItems();

  // Re-render quick nav labels in new language
  if (window._renderQuickNav) window._renderQuickNav();

  // Update search placeholders (bilingual)
  const _qnSearch = document.getElementById('quickNavSearch');
  if (_qnSearch) _qnSearch.placeholder = lang === 'es' ? 'Buscar por nombre, motivo o situación...' : 'Search by name, intention or situation...';
  const _cSearch = document.getElementById('cardsSearch');
  if (_cSearch) _cSearch.placeholder = lang === 'es' ? 'Buscar por nombre, motivo o situación...' : 'Search by name, intention or situation...';

  // If intercessor is loaded, refresh dynamic content
  if (intercessorData) renderIntercessorContent(intercessorData);
}

// ── SUBDOMAIN DETECTION ────────────────────────────
function getSubdomain() {
  // Primary: query param ?intercesor=padrepio (GitHub Pages compatible)
  const params = new URLSearchParams(window.location.search);
  const param = params.get('intercesor');
  if (param) return param.toLowerCase();
  // Fallback: true subdomain (e.g. padrepio.theuniversalprayer.com)
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3) return parts[0].toLowerCase();
  return null;
}

// ── PAGE DETECTION ────────────────────────────────
function isIntercessorPage() {
  return document.body.classList.contains('intercessor-page');
}

function isHistoriasPage() {
  return document.body.classList.contains('historias-page');
}

// ── FETCH INTERCESSOR DATA ─────────────────────────
async function loadIntercessorData(id) {
  const basePath = (isIntercessorPage() || isHistoriasPage()) ? '../data/' : 'data/';
  const url = `${basePath}${id}.json`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Not found: ${url}`);
  return resp.json();
}

// ── BASE PRAYERS RENDERER ────────────────────────
function renderBasePrayers() {
  const grid = document.getElementById('basePrayersGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (const prayer of BASE_PRAYERS) {
    const tile = document.createElement('div');
    tile.className = 'base-prayer-tile';
    ['es', 'en'].forEach(lang => {
      const h4 = document.createElement('h4');
      h4.className = 'bpt-title';
      h4.setAttribute('data-lang', lang);
      h4.textContent = PRAYERS[lang][prayer.titleKey];
      if (lang !== currentLang) h4.style.display = 'none';
      const p = document.createElement('p');
      p.className = 'bpt-text';
      p.setAttribute('data-lang', lang);
      p.innerHTML = PRAYERS[lang][prayer.textKey].replace(/\n/g, '<br>');
      if (lang !== currentLang) p.style.display = 'none';
      tile.appendChild(h4);
      tile.appendChild(p);
    });
    grid.appendChild(tile);
  }
}

// ── HOME PAGE ──────────────────────────────────────
async function initHomePage() {
  const grid = document.getElementById('intercessorsGrid');
  if (!grid) return;

  initFeaturedSecond(); // fire independently, no await

  const sortedIntercessors = [...INTERCESSORS].sort((a, b) =>
    a.name[currentLang].localeCompare(b.name[currentLang], currentLang === 'es' ? 'es' : 'en', { sensitivity: 'base' })
  );

  for (const meta of sortedIntercessors) {
    try {
      const data = await loadIntercessorData(meta.id);
      grid.appendChild(buildCard(data, meta));
    } catch {
      // Skip intercessors whose JSON isn't ready yet
    }
  }

  // Card entrance animations via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('card-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    grid.querySelectorAll('.intercessor-card').forEach((card, i) => {
      card.style.setProperty('--card-delay', `${Math.min(i, 8) * 55}ms`);
      card.classList.add('card-anim');
      io.observe(card);
    });
  }

  // Search quick nav icons
  const quickNavSearch = document.getElementById('quickNavSearch');
  if (quickNavSearch) {
    quickNavSearch.placeholder = currentLang === 'es' ? 'Buscar por nombre, motivo o situación...' : 'Search by name, intention or situation...';
    quickNavSearch.addEventListener('input', () => {
      const q = quickNavSearch.value.toLowerCase().trim();
      document.querySelectorAll('.quick-nav-item').forEach(item => {
        const matchesName      = (item.dataset.name      || '').includes(q);
        const matchesSpecialty = (item.dataset.specialty || '').includes(q);
        item.style.display = (q === '' || matchesName || matchesSpecialty) ? '' : 'none';
      });
    });
  }

  // Search intercessor cards
  const cardsSearch = document.getElementById('cardsSearch');
  if (cardsSearch) {
    cardsSearch.placeholder = currentLang === 'es' ? 'Buscar por nombre, motivo o situación...' : 'Search by name, intention or situation...';    cardsSearch.addEventListener('input', () => {
      const q = cardsSearch.value.toLowerCase().trim();
      grid.querySelectorAll('.intercessor-card').forEach(card => {
        const matchesText      = card.textContent.toLowerCase().includes(q);
        const matchesSpecialty = (card.dataset.specialty || '').includes(q);
        card.style.display = (q === '' || matchesText || matchesSpecialty) ? '' : 'none';
      });
    });
  }
}

// ── SEGUNDA DEVOCIÓN DEL DÍA ───────────────────────
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : '30, 140, 30';
}

function lightenColor(hex, amount = 120) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return '#a0e8a0';
  const r = Math.min(255, parseInt(m[1], 16) + amount);
  const g = Math.min(255, parseInt(m[2], 16) + amount);
  const b = Math.min(255, parseInt(m[3], 16) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function firstSentences(text, maxLen) {
  const para = (text || '').split(/\n\n/)[0] || text || '';
  if (para.length <= maxLen) return para;
  const trimmed = para.substring(0, maxLen);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '…';
}

async function initFeaturedSecond() {
  const section = document.getElementById('featuredSecond');
  if (!section) return;

  // All intercessors except the primary (misericordia)
  const candidates = INTERCESSORS.filter(i => i.id !== 'misericordia');

  // Rotate by calendar day — changes each day
  const dayIndex = Math.floor(Date.now() / 86400000);
  const meta = candidates[dayIndex % candidates.length];

  try {
    const data = await loadIntercessorData(meta.id);
    const lang = currentLang;

    // Dynamic color theming
    const rgb   = hexToRgb(meta.color);
    const light = lightenColor(meta.color, 120);
    section.style.setProperty('--sec-rgb', rgb);
    section.style.setProperty('--sec-light', light);

    const hasChaplet = meta.chaplet && data.chaplet && data.chaplet.available;
    const btnEs = hasChaplet ? '📿 Rezar la Coronilla ahora' : '🙏 Rezar la Novena ahora';
    const btnEn = hasChaplet ? '📿 Pray the Chaplet now'    : '🙏 Pray the Novena now';

    const descEs = firstSentences(data.history.es, 190);
    const descEn = firstSentences(data.history.en, 190);

    section.innerHTML = `
      <div class="featured-mercy-inner">
        <div class="featured-second-image-wrap">
          <img src="${data.image}" alt="${data.name.es}" class="featured-mercy-img" loading="eager"/>
        </div>
        <div class="featured-mercy-content">
          <span class="featured-second-badge" data-lang="es">✦ Devoción del Día</span>
          <span class="featured-second-badge" data-lang="en" style="display:none">✦ Today's Devotion</span>
          <h2 class="featured-second-title" data-lang="es">${data.name.es}</h2>
          <h2 class="featured-second-title" data-lang="en" style="display:none">${data.name.en}</h2>
          <p class="featured-mercy-quote" data-lang="es">✦ Fiesta: ${data.feast_day.es}</p>
          <p class="featured-mercy-quote" data-lang="en" style="display:none">✦ Feast: ${data.feast_day.en}</p>
          <p class="featured-mercy-text" data-lang="es">${descEs}</p>
          <p class="featured-mercy-text" data-lang="en" style="display:none">${descEn}</p>
          <a href="/intercesor/?intercesor=${meta.id}" class="featured-second-btn">
            <span data-lang="es">${btnEs}</span>
            <span data-lang="en" style="display:none">${btnEn}</span>
          </a>
        </div>
      </div>`;

    // Apply active language visibility
    section.querySelectorAll('[data-lang]').forEach(el => {
      el.style.display = el.getAttribute('data-lang') === currentLang ? '' : 'none';
    });

    section.style.display = '';
  } catch {
    // If load fails, leave section hidden
  }
}

function buildCard(data, meta) {
  const lang = currentLang;
  const card = document.createElement('a');
  card.className = 'intercessor-card';
  card.href = buildIntercessorUrl(meta.subdomain);
  if (meta.color) card.style.setProperty('--card-color', meta.color);
  // Store both-language specialty + keyword synonyms for search
  if (meta.specialty) {
    const extraTags = KEYWORD_MAP[meta.id] || '';
    card.dataset.specialty = `${meta.specialty.es || ''} ${meta.specialty.en || ''} ${extraTags}`.toLowerCase();
  }

  const imgHtml = data.image
    ? `<img src="${data.image}" alt="${data.name[lang]}" loading="lazy" />`
    : `<div class="card-image-placeholder">✝</div>`;

  const hasChaplet = data.chaplet?.available === true;
  const hasNovena  = Array.isArray(data.novena?.days) && data.novena.days.length > 0;

  const badges = [];
  if (hasNovena)  badges.push(`<span class="badge">${lang === 'en' ? 'Novena' : 'Novena'}</span>`);
  if (hasChaplet) badges.push(`<span class="badge">${lang === 'en' ? 'Chaplet' : 'Coronilla'}</span>`);

  const specialty = meta.specialty ? meta.specialty[lang] : '';

  card.innerHTML = `
    <div class="card-image-wrap">${imgHtml}</div>
    <div class="card-body">
      <div class="card-name">${data.name[lang]}</div>
      <div class="card-feast">${i18n[lang].feast_day} ${data.feast_day[lang]}</div>
      ${specialty ? `<div class="card-specialty">✦ ${specialty}</div>` : ''}
      <div class="card-badges">${badges.join('')}</div>
    </div>`;
  return card;
}

function buildIntercessorUrl(subdomain) {
  return `/intercesor/?intercesor=${subdomain}`;
}

// ── QUICK NAV ──────────────────────────────────────
function renderQuickNav() {
  const nav = document.getElementById('quickNav');
  if (!nav) return;

  const inner = document.createElement('div');
  inner.className = 'quick-nav-inner';

  const _todayCandidates = INTERCESSORS.filter(i => i.id !== 'misericordia');
  const _todayMeta = _todayCandidates[Math.floor(Date.now() / 86400000) % _todayCandidates.length];

  const sortedNav = [...INTERCESSORS].sort((a, b) =>
    a.name[currentLang].localeCompare(b.name[currentLang], currentLang === 'es' ? 'es' : 'en', { sensitivity: 'base' })
  );

  for (const m of sortedNav) {
    const item = document.createElement('a');
    item.className = 'quick-nav-item';
    if (m.id === _todayMeta.id) item.classList.add('today-saint');
    item.href = buildIntercessorUrl(m.subdomain);
    if (m.color) item.style.setProperty('--item-color', m.color);

    const circle = document.createElement('div');
    circle.className = 'quick-nav-circle';
    circle.style.backgroundImage = `url('/assets/images/${m.id}.svg')`;
    if (m.color) circle.style.backgroundColor = m.color;

    const label = document.createElement('span');
    label.className = 'quick-nav-label';
    label.textContent = (m.short && m.short[currentLang]) || m.name[currentLang];

    // data attributes for filtering
    item.dataset.name = `${m.name.es} ${m.name.en}`.toLowerCase();
    if (m.specialty) {
      const extraTags = KEYWORD_MAP[m.id] || '';
      item.dataset.specialty = `${m.specialty.es || ''} ${m.specialty.en || ''} ${extraTags}`.toLowerCase();
    }

    item.appendChild(circle);
    item.appendChild(label);
    inner.appendChild(item);
  }

  nav.innerHTML = '';
  nav.appendChild(inner);
}

// ── INTERCESSOR PAGE ───────────────────────────────
async function initIntercessorPage() {
  const subdomain = getSubdomain();

  if (!subdomain) {
    showNotFound();
    return;
  }

  const knownMeta = INTERCESSORS.find(i => i.subdomain === subdomain);
  if (!knownMeta) {
    showNotFound();
    return;
  }

  try {
    intercessorData = await loadIntercessorData(subdomain);
    renderIntercessorContent(intercessorData);
    initTabs(knownMeta);
    initNovena(intercessorData);

    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('intercessorWrapper').style.display = 'block';
  } catch {
    showNotFound();
  }
}

function renderIntercessorContent(data) {
  const lang = currentLang;

  // Page title & meta
  document.title = `${data.name[lang]} | The Universal Prayer`;
  const metaDesc = document.getElementById('pageDesc');
  if (metaDesc) metaDesc.setAttribute('content', data.prayer[lang].substring(0, 150));

  // Hero
  const nameEl = document.getElementById('intercessorName');
  if (nameEl) nameEl.textContent = data.name[lang];

  const feastEl = document.getElementById('feastDay');
  if (feastEl) feastEl.textContent = data.feast_day ? data.feast_day[lang] : '';

  const imgEl = document.getElementById('intercessorImg');
  if (imgEl && data.image) {
    imgEl.src = data.image;
    imgEl.alt = data.name[lang];
  }

  // Prayer
  const prayerEl = document.getElementById('prayerText');
  if (prayerEl) prayerEl.innerHTML = paragraphify(data.prayer[lang]);

  // History — bio paragraphs only
  const historyEl = document.getElementById('historyText');
  if (historyEl) historyEl.innerHTML = paragraphify(data.history[lang]);
  // Miracles — from independent miracles field
  const miraclesEl = document.getElementById('miraclesText');
  const miraclesText = data.miracles && data.miracles.available && data.miracles[lang];
  if (miraclesEl) miraclesEl.innerHTML = miraclesText ? miraclify(miraclesText) : '';

  // Novena
  if (data.novena && data.novena.length > 0) {
    const saved = parseInt(localStorage.getItem('novena_day_' + data.id), 10);
    if (saved >= 1 && saved <= 9) currentDay = saved;
    setNovenaDay(data, currentDay);
  }

  // Chaplet player
  initChapletPlayer(data);

  // Litany
  const litanyEl = document.getElementById('litanyText');
  const noLitanyEl = document.getElementById('noLitany');
  if (litanyEl && noLitanyEl) {
    if (data.litany && data.litany.available && data.litany[lang]) {
      litanyEl.innerHTML = paragraphify(data.litany[lang]);
      litanyEl.style.display = '';
      noLitanyEl.style.display = 'none';
    } else {
      litanyEl.style.display = 'none';
      noLitanyEl.style.display = '';
    }
  }

  // Consecration
  const consecrationEl = document.getElementById('consecrationText');
  const noConsecrationEl = document.getElementById('noConsecration');
  if (consecrationEl && noConsecrationEl) {
    if (data.consecration && data.consecration.available && data.consecration[lang]) {
      consecrationEl.innerHTML = paragraphify(data.consecration[lang]);
      consecrationEl.style.display = '';
      noConsecrationEl.style.display = 'none';
    } else {
      consecrationEl.style.display = 'none';
      noConsecrationEl.style.display = '';
    }
  }
  renderNovenaSupportPanel(data);

  // Story tab (TTS) — history + miracles
  const storyEl = document.getElementById('storyText');
  if (storyEl) {
    const miraclesAvail = data.miracles && data.miracles.available && data.miracles[lang];
    const sep = lang === 'es'
      ? '<h3 class="story-section-title">✨ Milagros y Anécdotas</h3>'
      : '<h3 class="story-section-title">✨ Miracles & Anecdotes</h3>';
    storyEl.innerHTML = paragraphify(data.history[lang])
      + (miraclesAvail ? sep + miraclify(miraclesAvail) : '');
  }

  // Wire TTS buttons (only once)
  const btnPlay = document.getElementById('ttsPlay');
  if (btnPlay && !btnPlay.dataset.wired) {
    btnPlay.dataset.wired = '1';
    btnPlay.addEventListener('click', () => {
      const mirac = data.miracles && data.miracles.available && data.miracles[currentLang];
      const text = data.history[currentLang] + (mirac ? '\n\n' + mirac : '');
      ttsSpeak(text, currentLang);
    });
    document.getElementById('ttsPause')?.addEventListener('click', ttsPauseToggle);
    document.getElementById('ttsStop')?.addEventListener('click', ttsStop);
  }
  if (!window.speechSynthesis) {
    if (btnPlay) btnPlay.style.display = 'none';
    const noSup = document.getElementById('ttsNoSupport');
    if (noSup) noSup.style.display = '';
  }
  if (btnPlay) btnPlay.textContent = lang === 'es' ? '▶ Leer en voz alta' : '▶ Read aloud';
  _ttsUpdateButtons();
}

function paragraphify(text) {
  return text
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

// Splits history text into biographical paragraphs + numbered anecdotes
function splitHistory(text) {
  const parts = text.split(/\n\n/);
  let bioEnd = parts.length;
  for (let i = 0; i < parts.length; i++) {
    if (/^\d+\.\s/.test(parts[i].trim())) {
      bioEnd = i;
      break;
    }
  }
  return {
    bio: parts.slice(0, bioEnd).join('\n\n'),
    anecdotes: parts.slice(bioEnd).join('\n\n')
  };
}

// Renders numbered anecdotes with styled header per item
function miraclify(text) {
  return text.split(/\n\n/).map(block => {
    const trimmed = block.trim();
    // Match "1. Title: body" or "1. Title\nbody"
    const m = trimmed.match(/^(\d+)\.\s+([^:\n]+)(?:[:\n]([\s\S]*))?$/);
    if (m) {
      const num = m[1];
      const title = m[2].trim();
      const body = (m[3] || '').trim();
      return `<div class="miracle-item">`
        + `<div class="miracle-header"><span class="miracle-num">${num}</span><span class="miracle-title">${title}</span></div>`
        + (body ? `<p class="miracle-body">${body.replace(/\n/g, '<br />')}</p>` : '')
        + `</div>`;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('');
}

// ── CHAPLET PLAYER ─────────────────────────────────
let chapletSteps = [];
let chapletCurrentStep = 0;

function getChapletSteps(id, lang) {
  const p = PRAYERS[lang];
  const L = lang === 'es';

  const pn    = { label: L ? 'Padre Nuestro'       : 'Our Father',        text: p.pn,    count: 1,  bead: 'large' };
  const am    = { label: L ? 'Ave María'            : 'Hail Mary',         text: p.am,    count: 1,  bead: 'small' };
  const am3   = { label: L ? 'Ave María × 3'        : 'Hail Mary × 3',     text: p.am,    count: 3,  bead: 'small' };
  const am10  = { label: L ? 'Ave María × 10'       : 'Hail Mary × 10',    text: p.am,    count: 10, bead: 'small' };
  const gloria= { label: L ? 'Gloria'               : 'Glory Be',          text: p.gloria,count: 1,  bead: 'none'  };
  const credo = { label: L ? 'Credo'                : "Apostles' Creed",   text: p.credo, count: 1,  bead: 'none'  };
  const cruz  = { label: L ? 'Señal de la Cruz'     : 'Sign of the Cross',
    text: L ? 'En el nombre del Padre, del Hijo y del Espíritu Santo. Amén.'
            : 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
    count: 1, bead: 'none' };

  // ── DIVINA MISERICORDIA ───────────────────────
  if (id === 'misericordia') {
    const large = { label: '', text: L
      ? '«Padre Eterno, Te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de Tu amadísimo Hijo, Nuestro Señor Jesucristo, en expiación de nuestros pecados y los del mundo entero.»'
      : '«Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.»', count: 1, bead: 'large' };
    const small = { label: '', text: L
      ? '«Por Su dolorosa Pasión,\nten misericordia de nosotros\ny del mundo entero.»'
      : '«For the sake of His sorrowful Passion,\nhave mercy on us\nand on the whole world.»', count: 10, bead: 'small' };
    const closing = { label: L ? 'Oración Final × 3' : 'Closing Prayer × 3', text: L
      ? '«Dios Santo, Dios Poderoso, Dios Eterno,\nten misericordia de nosotros\ny del mundo entero.»'
      : '«Holy God, Holy Mighty One, Holy Immortal One,\nhave mercy on us\nand on the whole world.»', count: 3, bead: 'none' };
    const optional = { label: L ? 'Oración Opcional' : 'Optional Prayer', text: L
      ? '«Oh Sangre y Agua que brotaste del Corazón de Jesús como fuente de misericordia para nosotros, confío en Ti.»'
      : '«O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You.»', count: 1, bead: 'none' };
    const steps = [pn, am, credo];
    for (let d = 1; d <= 5; d++) {
      steps.push({ ...large, label: L ? `Cuenta Grande · Decena ${d}` : `Large Bead · Decade ${d}` });
      steps.push({ ...small, label: L ? `Cuentas Pequeñas · Decena ${d}` : `Small Beads · Decade ${d}` });
    }
    steps.push(closing, optional);
    return steps;
  }

  // ── SAGRADO CORAZÓN ───────────────────────────
  if (id === 'sagradocorazon') {
    const opening = { label: L ? 'Oración de Apertura' : 'Opening Prayer', text: L
      ? '«Venid, adoremos y postremos ante Dios;\nlloremos ante el Señor que nos creó.»'
      : '«Come, let us adore and bow down before God;\nlet us weep before the Lord who made us.»', count: 1, bead: 'none' };
    const large = { label: '', text: L
      ? '«Sagrado Corazón de Jesús, en Ti confío.»'
      : '«Sacred Heart of Jesus, in You I trust.»', count: 1, bead: 'large' };
    const small = { label: '', text: L
      ? '«Jesús manso y humilde de Corazón,\nhaz mi corazón semejante al Tuyo.»'
      : '«Jesus, meek and humble of Heart,\nmake my heart like unto Thine.»', count: 10, bead: 'small' };
    const closing = { label: L ? 'Oración Final × 3' : 'Closing Prayer × 3', text: L
      ? '«Oh dulcísimo Corazón de Jesús,\nhaz que Te ame cada vez más.»'
      : '«O most sweet Heart of Jesus,\ngrant that I may ever love Thee more and more.»', count: 3, bead: 'none' };
    const final = { label: L ? 'Consagración' : 'Consecration', text: L
      ? '«Sagrado Corazón de Jesús, que Tú reines.»'
      : '«Sacred Heart of Jesus, may You reign.»', count: 1, bead: 'none' };
    const steps = [opening];
    for (let d = 1; d <= 6; d++) {
      steps.push({ ...large, label: L ? `Cuenta Grande ${d}` : `Large Bead ${d}` });
      steps.push({ ...small, label: L ? `Cuentas Pequeñas · Grupo ${d}` : `Small Beads · Group ${d}` });
    }
    steps.push(closing, final);
    return steps;
  }

  // ── VIRGEN DE FÁTIMA (Santo Rosario) ──────────
  if (id === 'fatima') {
    const fatimaOration = { label: L ? 'Oración de Fátima' : 'Fátima Prayer', text: L
      ? '«Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al Cielo a todas las almas, especialmente a las más necesitadas de tu Misericordia.»'
      : '«O my Jesus, forgive us our sins, save us from the fire of hell, lead all souls to Heaven, especially those most in need of Thy mercy.»', count: 1, bead: 'none' };
    const salve = { label: L ? 'Salve Regina' : 'Hail Holy Queen', text: L
      ? 'Dios te salve, Reina y Madre de misericordia,\nvida, dulzura y esperanza nuestra, Dios te salve.\nA Ti llamamos los desterrados hijos de Eva;\na Ti suspiramos gimiendo y llorando\nen este valle de lágrimas.\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos misericordiosos.\nY después de este destierro,\nmuéstranos a Jesús, fruto bendito de tu vientre.\n¡Oh clementísima, oh piadosa, oh dulce Virgen María! Amén.'
      : 'Hail, holy Queen, Mother of mercy,\nour life, our sweetness and our hope.\nTo thee do we cry, poor banished children of Eve.\nTo thee do we send up our sighs,\nmourning and weeping in this valley of tears.\nTurn then, most gracious advocate,\nthine eyes of mercy toward us.\nAnd after this our exile,\nshow unto us the blessed fruit of thy womb, Jesus.\nO clement, O loving, O sweet Virgin Mary! Amen.', count: 1, bead: 'none' };
    const mysteries = L
      ? ['La Anunciación del Ángel a María', 'La Visitación de María a Isabel', 'El Nacimiento de Jesús en Belén', 'La Presentación de Jesús en el Templo', 'El Hallazgo de Jesús en el Templo']
      : ['The Annunciation of the Angel to Mary', 'The Visitation of Mary to Elizabeth', 'The Birth of Jesus in Bethlehem', 'The Presentation of Jesus in the Temple', 'The Finding of Jesus in the Temple'];
    const ordinals = L ? ['1°', '2°', '3°', '4°', '5°'] : ['1st', '2nd', '3rd', '4th', '5th'];
    const steps = [credo, pn, am3, gloria];
    mysteries.forEach((mystery, i) => {
      steps.push({ label: L ? `${ordinals[i]} Misterio Gozoso` : `${ordinals[i]} Joyful Mystery`, text: mystery, count: 1, bead: 'none' });
      steps.push({ ...pn, label: L ? `Padre Nuestro · Misterio ${i+1}` : `Our Father · Mystery ${i+1}` });
      steps.push({ ...am10, label: L ? `Ave María × 10 · Misterio ${i+1}` : `Hail Mary × 10 · Mystery ${i+1}` });
      steps.push({ ...gloria });
      steps.push(fatimaOration);
    });
    steps.push(salve);
    return steps;
  }

  // ── PADRE PÍO ─────────────────────────────────
  if (id === 'padrepio') {
    const large = { label: '', text: L
      ? '«Por tus sagradas llagas, Padre Pío,\naleja de nosotros el dolor y la tristeza.»'
      : '«Through your sacred wounds, Padre Pio,\nkeep us from pain and sadness.»', count: 1, bead: 'large' };
    const small = { label: '', text: L
      ? '«Padre Pío, cubierto de las llagas de Cristo,\nsana nuestras almas.»'
      : '«Padre Pio, covered with the wounds of Christ,\nheal our souls.»', count: 10, bead: 'small' };
    const decadeEnd = { label: '', text: L
      ? '«Padre Pío de Pietrelcina,\nruega por nosotros que recurrimos a ti.»'
      : '«Padre Pio of Pietrelcina,\npray for us who have recourse to thee.»', count: 1, bead: 'none' };
    const closing = { label: L ? 'Oración Final × 3' : 'Closing Prayer × 3', text: L
      ? '«Gracias, Padre Pío,\npor tu intercesión y tu amor por las almas.»'
      : '«Thank you, Padre Pio,\nfor your intercession and your love for souls.»', count: 3, bead: 'none' };
    const steps = [credo];
    for (let d = 1; d <= 5; d++) {
      steps.push({ ...large, label: L ? `Cuenta Grande · Decena ${d}` : `Large Bead · Decade ${d}` });
      steps.push({ ...small, label: L ? `Cuentas Pequeñas · Decena ${d}` : `Small Beads · Decade ${d}` });
      steps.push({ ...decadeEnd, label: L ? `Final de la Decena ${d}` : `End of Decade ${d}` });
    }
    steps.push(closing);
    return steps;
  }

  // ── SAN JUDAS TADEO (13 cuentas) ─────────────
  if (id === 'sanjudas') {
    const invocation = { label: L ? 'Invocación al Espíritu Santo' : 'Invocation to the Holy Spirit', text: L
      ? '«Ven, Espíritu Santo, ilumina mi mente y enciende mi corazón.\nSan Judas Tadeo, apóstol que recibiste el fuego de Pentecostés,\nintercede por mí ante Dios Padre.»'
      : '«Come, Holy Spirit, enlighten my mind and inflame my heart.\nSaint Jude Thaddaeus, apostle who received the fire of Pentecost,\nintercede for me before God the Father.»', count: 1, bead: 'none' };
    const bead = { label: '', text: L
      ? '«San Judas Tadeo, apóstol y mártir,\npatrono de las causas imposibles: ruega por nosotros.»\n\n(Añade en silencio la petición de tu corazón.)'
      : '«Saint Jude Thaddaeus, apostle and martyr,\npatron of impossible causes: pray for us.»\n\n(Add silently the intention of your heart.)', count: 1, bead: 'small' };
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Glorioso San Judas Tadeo, tú que eres pariente de Nuestro Señor Jesucristo y que proclamaste Su Evangelio con valentía hasta dar tu propia sangre:\n\nTe presento hoy mi causa. Sé que para Dios no hay nada imposible. Intercede por mí para que, si es Su santa voluntad, me sea concedida esta gracia.\n\nAmén.»'
      : '«Glorious Saint Jude Thaddaeus, relative of Our Lord Jesus Christ, who proclaimed His Gospel with courage until shedding your own blood:\n\nI present my cause to you today. I know that for God nothing is impossible. Intercede for me so that, if it is His holy will, this grace may be granted to me.\n\nAmen.»', count: 1, bead: 'none' };
    const steps = [cruz, invocation];
    for (let i = 1; i <= 13; i++) {
      steps.push({ ...bead, label: L ? `Cuenta ${i} de 13` : `Bead ${i} of 13` });
    }
    steps.push(final, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── SAN ANTONIO DE PADUA (13 peticiones) ──────
  if (id === 'sanantonio') {
    const petitions = L ? [
      'Por el milagro de su predicación que convirtió a los más endurecidos.',
      'Por su amor a la Sagrada Escritura y su sabiduría de Doctor.',
      'Por su abandono del mundo para seguir a Cristo franciscano.',
      'Por su defensa de los pobres y los deudores injustamente encarcelados.',
      'Por los milagros que obró en vida — entre ellos el pez que escuchó su predicación.',
      'Por su amor y devoción a la Virgen María.',
      'Por la aparición del Niño Jesús sobre sus brazos.',
      'Por su paciencia en las tentaciones y tribulaciones.',
      'Por su amor ardiente a la Sagrada Eucaristía.',
      'Por su celo apostólico que encendió toda Europa.',
      'Por su muerte santa y su rápida canonización.',
      'Por los innumerables milagros obrados después de su muerte.',
      'Por su intercesión poderosa como patrono de las cosas perdidas.',
    ] : [
      'For the miracle of his preaching that converted the most hardened hearts.',
      'For his love of Sacred Scripture and his wisdom as a Doctor.',
      'For his abandonment of the world to follow Christ as a Franciscan.',
      'For his defense of the poor and those unjustly imprisoned.',
      'For the miracles he worked during his life — including the fish that heard his preaching.',
      'For his love and devotion to the Virgin Mary.',
      'For the apparition of the Child Jesus in his arms.',
      'For his patience in temptations and tribulations.',
      'For his ardent love of the Holy Eucharist.',
      'For his apostolic zeal that set all of Europe on fire.',
      'For his holy death and swift canonization.',
      'For the countless miracles worked after his death.',
      'For his powerful intercession as patron of lost things.',
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '¡Oh San Antonio, glorioso confesor y Doctor de la Iglesia!\nPor tu intercesión, que Dios me conceda lo que necesito y busco.\nAmén.'
      : 'O Saint Anthony, glorious confessor and Doctor of the Church!\nThrough your intercession, may God grant me what I need and seek.\nAmen.', count: 1, bead: 'none' };
    const steps = [cruz];
    petitions.forEach((petition, i) => {
      steps.push({ label: L ? `Petición ${i+1} · Padre Nuestro` : `Petition ${i+1} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `Petición ${i+1} · Ave María` : `Petition ${i+1} · Hail Mary`, text: p.am, count: 1, bead: 'small' });
      steps.push({ label: L ? `Petición ${i+1} · Intención` : `Petition ${i+1} · Intention`, text: petition, count: 1, bead: 'none' });
    });
    steps.push(final);
    return steps;
  }

  // ── SAN MIGUEL ARCÁNGEL (9 salutaciones) ──────
  if (id === 'sanmiguel') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Oh Dios, ven en mi auxilio.\nSeñor, date prisa en socorrerme.»'
      : '«O God, come to my assistance.\nLord, make haste to help me.»', count: 1, bead: 'none' };
    const salutations = L ? [
      { choir: 'Serafines',     text: 'Por la intercesión de San Miguel y los Serafines:\nque arda en mí el fuego de la perfecta caridad.' },
      { choir: 'Querubines',    text: 'Por la intercesión de San Miguel y los Querubines:\nque abandone el camino del pecado.' },
      { choir: 'Tronos',        text: 'Por la intercesión de San Miguel y los Tronos:\nque Dios infunda en mí el espíritu de la verdadera humildad.' },
      { choir: 'Dominaciones',  text: 'Por la intercesión de San Miguel y las Dominaciones:\nque domine mis sentidos y corrija mis malas pasiones.' },
      { choir: 'Poderes',       text: 'Por la intercesión de San Miguel y los Poderes:\nque Dios proteja mi alma contra las tentaciones del demonio.' },
      { choir: 'Virtudes',      text: 'Por la intercesión de San Miguel y las Virtudes:\nque no caiga en la tentación, sino que sea librado del mal.' },
      { choir: 'Principados',   text: 'Por la intercesión de San Miguel y los Principados:\nque Dios llene mi alma del espíritu de obediencia verdadera.' },
      { choir: 'Arcángeles',    text: 'Por la intercesión de San Miguel y los Arcángeles:\nque reciba el don de la perseverancia en la fe y en las buenas obras.' },
      { choir: 'Ángeles',       text: 'Por la intercesión de San Miguel y los Ángeles:\nque sea guardado por ellos y conducido al reino eterno.' },
    ] : [
      { choir: 'Seraphim',       text: 'Through the intercession of Saint Michael and the Seraphim:\nmay the fire of perfect charity be enkindled in me.' },
      { choir: 'Cherubim',       text: 'Through the intercession of Saint Michael and the Cherubim:\nmay I leave the path of sin.' },
      { choir: 'Thrones',        text: 'Through the intercession of Saint Michael and the Thrones:\nmay God infuse in me the spirit of true humility.' },
      { choir: 'Dominations',    text: 'Through the intercession of Saint Michael and the Dominations:\nmay I master my senses and correct my evil passions.' },
      { choir: 'Powers',         text: 'Through the intercession of Saint Michael and the Powers:\nmay God protect my soul against the snares of the devil.' },
      { choir: 'Virtues',        text: 'Through the intercession of Saint Michael and the Virtues:\nmay I not fall into temptation but be delivered from evil.' },
      { choir: 'Principalities', text: 'Through the intercession of Saint Michael and the Principalities:\nmay God fill my soul with the spirit of true obedience.' },
      { choir: 'Archangels',     text: 'Through the intercession of Saint Michael and the Archangels:\nmay I receive the gift of perseverance in faith and good works.' },
      { choir: 'Angels',         text: 'Through the intercession of Saint Michael and the Angels:\nmay they guard me on this pilgrimage and lead me to the eternal kingdom.' },
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? 'San Miguel Arcángel, ilustre príncipe y guardián del alma, ruega por nosotros.\nAmén.'
      : 'Saint Michael the Archangel, illustrious prince and guardian of souls, pray for us.\nAmen.', count: 1, bead: 'none' };
    const steps = [cruz, opening];
    salutations.forEach((s, i) => {
      steps.push({ label: L ? `Salutación ${i+1} · ${s.choir} · Padre Nuestro` : `Salutation ${i+1} · ${s.choir} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `Salutación ${i+1} · ${s.choir} · Ave Marías` : `Salutation ${i+1} · ${s.choir} · Hail Marys`, text: p.am, count: 3, bead: 'small' });
      steps.push({ label: L ? `Salutación ${i+1} · ${s.choir}` : `Salutation ${i+1} · ${s.choir}`, text: s.text, count: 1, bead: 'none' });
    });
    steps.push(final);
    return steps;
  }

  // ── VIRGEN DE GUADALUPE (4 apariciones) ──────
  if (id === 'guadalupe') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Oh Virgen de Guadalupe, Madre del verdadero Dios por quien se vive:\nte apareciste a Juan Diego en el cerro del Tepeyac para traernos a todos tu amor maternal.\nAcudo a ti con fe y te pido que intercedas por mí ante tu amado Hijo Jesús.»'
      : '«O Virgin of Guadalupe, Mother of the true God through whom one lives:\nyou appeared to Juan Diego at Tepeyac Hill to bring us all your maternal love.\nI come to you with faith and ask you to intercede for me before your beloved Son Jesus.»',
      count: 1, bead: 'none' };
    const apariciones = L ? [
      { nombre: 'Primera Aparición', desc: 'Sábado 9 de diciembre, mañana.\nMaría se aparece a Juan Diego y le pide que solicite al obispo la construcción de una ermita en el Tepeyac.', inv: '«Virgen de Guadalupe, que en tu primera aparición te revelaste como Madre del verdadero Dios:\nhaz que sintamos siempre tu presencia maternal.»' },
      { nombre: 'Segunda Aparición', desc: 'Sábado 9 de diciembre, tarde.\nAnte la negativa del obispo, la Virgen anima a Juan Diego y le pide que regrese con la misma petición.', inv: '«Virgen de Guadalupe, que persististe en tu amor con paciencia:\nenséñanos a no rendirnos y a confiar siempre en Dios.»' },
      { nombre: 'Tercera Aparición', desc: 'Domingo 10 de diciembre.\nLa Virgen consuela a Juan Diego y le asegura: "¿Acaso no estoy yo aquí que soy tu Madre?"', inv: '«Virgen de Guadalupe, que consolaste a Juan Diego en su duda:\nconsuela también nuestra debilidad y fortalece nuestra fe.»' },
      { nombre: 'Cuarta Aparición', desc: 'Martes 12 de diciembre.\nLa Virgen envía a Juan Diego a recoger rosas en el cerro. Al abrirse la tilma ante el obispo, aparece su imagen milagrosa.', inv: '«Virgen de Guadalupe, que dejaste tu imagen como señal de amor eterno:\npermanece siempre con nosotros y llévanos a tu Hijo Jesús.»' },
    ] : [
      { nombre: 'First Apparition', desc: 'Saturday, December 9, morning.\nMary appears to Juan Diego and asks him to request the bishop to build a chapel at Tepeyac.', inv: '«Virgin of Guadalupe, who revealed yourself as Mother of the true God:\nmay we always feel your maternal presence beside us.»' },
      { nombre: 'Second Apparition', desc: 'Saturday, December 9, afternoon.\nAfter the bishop refuses, the Virgin encourages Juan Diego and asks him to return the following day.', inv: '«Virgin of Guadalupe, who persisted in your love with patience:\nteach us not to give up and to always trust in God.»' },
      { nombre: 'Third Apparition', desc: 'Sunday, December 10.\nThe Virgin consoles Juan Diego and assures him: "Am I not here who am your Mother?"', inv: '«Virgin of Guadalupe, who consoled Juan Diego in his doubt:\nconsole our weakness too and strengthen our faith.»' },
      { nombre: 'Fourth Apparition', desc: 'Tuesday, December 12.\nThe Virgin sends Juan Diego to gather roses on the hill. When his tilma is opened before the bishop, the miraculous image appears.', inv: '«Virgin of Guadalupe, who left your image as a sign of eternal love:\nremain always with us and lead us to your Son Jesus.»' },
    ];
    const closing = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Oh Santísima Virgen de Guadalupe, Emperatriz de las Américas, Madre de todos los pueblos:\nTe presentamos nuestras necesidades y nuestras esperanzas.\nTú que dijiste ser la Madre del género humano,\nsé nuestra Madre también a nosotros.\nIntercede ante tu Hijo por nuestra intención.\nSanta María de Guadalupe, ruega por nosotros. Amén.»'
      : '«O Most Holy Virgin of Guadalupe, Empress of the Americas, Mother of all peoples:\nWe present to you our needs and our hopes.\nYou who declared yourself Mother of all humanity,\nbe our Mother too.\nIntercede before your Son for our intention.\nHoly Mary of Guadalupe, pray for us. Amen.»',
      count: 1, bead: 'none' };
    const steps = [cruz, opening];
    apariciones.forEach((ap, i) => {
      steps.push({ label: ap.nombre, text: ap.desc, count: 1, bead: 'none' });
      steps.push({ ...pn, label: L ? `Padre Nuestro · Aparición ${i+1}` : `Our Father · Apparition ${i+1}` });
      steps.push({ ...am, label: L ? `Ave María · Aparición ${i+1}` : `Hail Mary · Apparition ${i+1}` });
      steps.push({ label: L ? `Invocación · ${ap.nombre}` : `Invocation · ${ap.nombre}`, text: ap.inv, count: 1, bead: 'none' });
    });
    steps.push(closing, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── INMACULADO CORAZÓN DE MARÍA ───────────────
  if (id === 'inmaculadocorazon') {
    const opening = { label: L ? 'Oración de Apertura' : 'Opening Prayer', text: L
      ? '«Oh María, te ofrezco esta coronilla en reparación de las ofensas cometidas contra tu Inmaculado Corazón, y en unión con todos los actos de amor y reparación del mundo entero.»'
      : '«O Mary, I offer you this chaplet in reparation for all offenses against your Immaculate Heart, and in union with every act of love and reparation throughout the world.»',
      count: 1, bead: 'none' };
    const large = { label: '', text: L
      ? '«Oh Dios mío, Te amo sobre todas las cosas. Perdona a los que no Te aman ni creen en Ti. Lleva al Cielo a todas las almas, especialmente a las más necesitadas de Tu misericordia.»'
      : '«O my God, I love You above all things. Forgive those who do not love You or believe in You. Lead all souls to Heaven, especially those most in need of Your mercy.»',
      count: 1, bead: 'large' };
    const small = { label: '', text: L
      ? '«Inmaculado Corazón de María, ruega por nosotros y por los pobres pecadores.»'
      : '«Immaculate Heart of Mary, pray for us and for poor sinners.»',
      count: 10, bead: 'small' };
    const fatimaOration = { label: L ? 'Oración de Fátima' : 'Fátima Prayer', text: L
      ? '«Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al Cielo a todas las almas, especialmente a las más necesitadas de Tu misericordia.»'
      : '«O my Jesus, forgive us our sins, save us from the fire of hell, lead all souls to Heaven, especially those most in need of Thy mercy.»',
      count: 1, bead: 'none' };
    const closing = { label: L ? 'Oración Final × 3' : 'Closing Prayer × 3', text: L
      ? '«Virgen Purísima, que sin mancha fuiste concebida,\nruega a Dios por nosotros que recurrimos a Ti.»'
      : '«Most Pure Virgin, conceived without stain,\npray to God for us who have recourse to Thee.»',
      count: 3, bead: 'none' };
    const final = { label: L ? 'Acto de Consagración' : 'Act of Consecration', text: L
      ? '«Inmaculado Corazón de María, sé mi salvación.»'
      : '«Immaculate Heart of Mary, be my salvation.»',
      count: 1, bead: 'none' };
    const steps = [opening];
    for (let d = 1; d <= 5; d++) {
      steps.push({ ...large, label: L ? `Cuenta Grande · Decena ${d}` : `Large Bead · Decade ${d}` });
      steps.push({ ...small, label: L ? `Cuentas Pequeñas · Decena ${d}` : `Small Beads · Decade ${d}` });
      steps.push({ ...fatimaOration, label: L ? `Oración de Fátima · Decena ${d}` : `Fátima Prayer · Decade ${d}` });
    }
    steps.push(closing, final);
    return steps;
  }

  // ── SAN JOSÉ (7 Dolores y Gozos) ──────────────
  if (id === 'sanjose') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Oh San José, esposo castísimo de la Virgen María y padre adoptivo de Jesús:\ncon esta coronilla te honramos meditando tus dolores y tus gozos.\nIntercede por nosotros ante Dios Padre.»'
      : '«O Saint Joseph, most chaste spouse of the Virgin Mary and adoptive father of Jesus:\nwith this chaplet we honor you by meditating on your sorrows and joys.\nIntercede for us before God the Father.»',
      count: 1, bead: 'none' };
    const grupos = L ? [
      { nombre: '1° Dolor y Gozo', texto: 'Dolor: Tu turbación al conocer el misterioso embarazo de María.\nGozo: La revelación del ángel que te confió el misterio de la Encarnación.', inv: '«San José, que en tu turbación recibiste luz del cielo:\nilumínanos en nuestras dudas y ayúdanos a confiar en Dios.»' },
      { nombre: '2° Dolor y Gozo', texto: 'Dolor: La pobreza del nacimiento de Jesús en Belén, sin casa ni calor.\nGozo: El nacimiento del Salvador del mundo, al que pudiste tener en tus brazos.', inv: '«San José, que acogiste al Hijo de Dios con amor de padre:\nenséñanos a recibir a Jesús con humildad y gratitud.»' },
      { nombre: '3° Dolor y Gozo', texto: 'Dolor: La sangre derramada por Jesús en la Circuncisión al octavo día.\nGozo: La imposición del Santo Nombre de Jesús, que fuiste honrado en proclamar.', inv: '«San José, guardián del Santo Nombre:\nayúdanos a honrar siempre el Nombre de Jesús.»' },
      { nombre: '4° Dolor y Gozo', texto: 'Dolor: La profecía de Simeón sobre la espada que traspasaría el alma de María.\nGozo: La Presentación de Jesús en el Templo y el reconocimiento del Mesías.', inv: '«San José, que ofreciste al Hijo de Dios al Padre celestial:\nayúdanos a ofrecernos también nosotros al Señor con generosidad.»' },
      { nombre: '5° Dolor y Gozo', texto: 'Dolor: La angustiosa huida a Egipto para salvar la vida del Niño Jesús.\nGozo: Haber sido elegido por Dios para proteger al Salvador del mundo.', inv: '«San José, protector de la Sagrada Familia:\nprotégenos a nosotros y a nuestras familias.»' },
      { nombre: '6° Dolor y Gozo', texto: 'Dolor: El temor al regresar de Egipto al enterarse del reinado de Arquelao.\nGozo: Los años de vida santa y tranquila junto a Jesús y María en Nazaret.', inv: '«San José, padre del hogar de Nazaret:\nsantifica nuestros hogares y consagra nuestras familias al Señor.»' },
      { nombre: '7° Dolor y Gozo', texto: 'Dolor: La angustia de tres días buscando a Jesús perdido en Jerusalén.\nGozo: El hallazgo de Jesús en el Templo, sentado entre los doctores de la Ley.', inv: '«San José, que buscaste a Jesús con angustia y lo encontraste con gozo:\nayúdanos a buscar siempre a Jesús en nuestra vida.»' },
    ] : [
      { nombre: '1st Sorrow & Joy', texto: 'Sorrow: Your distress upon learning of Mary\'s mysterious pregnancy.\nJoy: The angel\'s revelation entrusting you with the mystery of the Incarnation.', inv: '«Saint Joseph, who received heavenly light in your distress:\nilluminate us in our doubts and help us trust in God.»' },
      { nombre: '2nd Sorrow & Joy', texto: 'Sorrow: The poverty of Jesus\'s birth in Bethlehem, without shelter or warmth.\nJoy: The birth of the Savior of the world, whom you were privileged to hold in your arms.', inv: '«Saint Joseph, who welcomed the Son of God with a father\'s love:\nteach us to receive Jesus with humility and gratitude.»' },
      { nombre: '3rd Sorrow & Joy', texto: 'Sorrow: The blood shed by Jesus at the Circumcision on the eighth day.\nJoy: The imposition of the Holy Name of Jesus, which you were honored to proclaim.', inv: '«Saint Joseph, guardian of the Holy Name:\nhelp us always to honor the Name of Jesus.»' },
      { nombre: '4th Sorrow & Joy', texto: 'Sorrow: Simeon\'s prophecy about the sword that would pierce Mary\'s soul.\nJoy: The Presentation of Jesus in the Temple and the recognition of the Messiah.', inv: '«Saint Joseph, who offered the Son of God to the heavenly Father:\nhelp us to offer ourselves to the Lord with generosity.»' },
      { nombre: '5th Sorrow & Joy', texto: 'Sorrow: The anguished flight into Egypt to save the life of the Child Jesus.\nJoy: Having been chosen by God to protect the Savior of the world.', inv: '«Saint Joseph, protector of the Holy Family:\nprotect us and our families from all danger.»' },
      { nombre: '6th Sorrow & Joy', texto: 'Sorrow: The fear upon returning from Egypt upon learning of Archelaus\' reign.\nJoy: The years of holy and peaceful life alongside Jesus and Mary in Nazareth.', inv: '«Saint Joseph, father of the home of Nazareth:\nsanctify our homes and consecrate our families to the Lord.»' },
      { nombre: '7th Sorrow & Joy', texto: 'Sorrow: The anguish of three days searching for the lost Jesus in Jerusalem.\nJoy: Finding Jesus in the Temple, seated among the doctors of the Law.', inv: '«Saint Joseph, who searched for Jesus in anguish and found him with joy:\nhelp us to always seek Jesus in our lives.»' },
    ];
    const closing = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Oh gloriosísimo San José,\ncuyas siete dolores y gozos hemos meditado:\nobtén para nosotros de tu divino Hijo\ntodas las gracias necesarias para nuestra salvación.\nSé nuestro abogado en la hora de la muerte\ny alcánzanos una muerte santa,\ncomo la tuya, en los brazos de Jesús y María.\nAmén.»'
      : '«O most glorious Saint Joseph,\nwhose seven sorrows and joys we have meditated:\nobtain for us from your divine Son\nall the graces we need for our salvation.\nBe our advocate in the hour of death\nand obtain for us a holy death,\nlike yours, in the arms of Jesus and Mary.\nAmen.»',
      count: 1, bead: 'none' };
    const steps = [cruz, opening];
    grupos.forEach((g, i) => {
      steps.push({ label: g.nombre, text: g.texto, count: 1, bead: 'none' });
      steps.push({ ...pn, label: L ? `Padre Nuestro · ${g.nombre}` : `Our Father · ${g.nombre}` });
      steps.push({ label: L ? `Ave María × 7 · ${g.nombre}` : `Hail Mary × 7 · ${g.nombre}`, text: p.am, count: 7, bead: 'small' });
      steps.push({ label: L ? `Invocación · ${g.nombre}` : `Invocation · ${g.nombre}`, text: g.inv, count: 1, bead: 'none' });
    });
    steps.push(closing, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── SANTA RITA DE CASIA (7 peticiones) ────────
  if (id === 'santarita') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Santa Rita de Casia, patrona de los casos imposibles:\nPresento ante ti mi causa y mi corazón.\nComo tú perseveraste en la fe en medio de lo imposible,\nque yo también confíe en que Dios puede hacer todo.»'
      : '«Saint Rita of Cascia, patron of impossible cases:\nI present before you my cause and my heart.\nAs you persevered in faith amid the impossible,\nmay I also trust that God can do all things.»', count: 1, bead: 'none' };
    const peticiones = L ? [
      { nombre: '1ª Petición · Su Matrimonio',   texto: 'Por tu paciencia y amor en medio de un matrimonio difícil:\nque yo también transforme mis sufrimientos en caminos de gracia.' },
      { nombre: '2ª Petición · El Perdón',        texto: 'Por el perdón sobrenatural que diste a los asesinos de tu esposo:\nque yo también pueda perdonar a quienes me han herido.' },
      { nombre: '3ª Petición · La Viudez',        texto: 'Por los años que viviste como viuda entregada a la oración:\nque en mi soledad también encuentre a Dios como compañía.' },
      { nombre: '4ª Petición · La Puerta Cerrada', texto: 'Por las tres veces que llamaste al convento sin rendirte:\nque yo también persevere en mis peticiones y en mi fe.' },
      { nombre: '5ª Petición · La Espina',        texto: 'Por la llaga de la espina que llevaste en tu frente por amor a la Pasión:\nque yo acepte mis cruces y las una a las de Cristo.' },
      { nombre: '6ª Petición · La Rosa',          texto: 'Por el milagro de la rosa que floreció en invierno a tu pedido:\nque la esperanza florezca también en mis inviernos.' },
      { nombre: '7ª Petición · Lo Imposible',     texto: 'Por tu intercesión especial en los casos imposibles:\nque Dios, para quien nada es imposible, escuche mi causa.' },
    ] : [
      { nombre: '1st Petition · Her Marriage',    texto: 'For your patience and love amid a difficult marriage:\nmay I too transform my sufferings into paths of grace.' },
      { nombre: '2nd Petition · Forgiveness',     texto: 'For the supernatural forgiveness you gave your husband\'s killers:\nmay I also be able to forgive those who have hurt me.' },
      { nombre: '3rd Petition · Widowhood',       texto: 'For the years you lived as a widow devoted to prayer:\nmay I also find God as companion in my loneliness.' },
      { nombre: '4th Petition · Perseverance',    texto: 'For the three times you knocked at the convent without giving up:\nmay I also persevere in my petitions and in my faith.' },
      { nombre: '5th Petition · The Thorn',       texto: 'For the wound of the thorn you bore on your forehead from love of the Passion:\nmay I accept my crosses and unite them to Christ\'s.' },
      { nombre: '6th Petition · The Rose',        texto: 'For the miracle of the rose that bloomed in winter at your request:\nmay hope also bloom in my winters.' },
      { nombre: '7th Petition · The Impossible',  texto: 'For your special intercession in impossible cases:\nmay God, for whom nothing is impossible, hear my cause.' },
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Oh Santa Rita, patrona de los imposibles y de los que sufren:\nTe presento hoy todo lo que en mi vida parece sin salida.\nIntercede ante Dios para que, si es Su santa voluntad,\nlo imposible se vuelva posible.\nSanta Rita de Casia, ruega por nosotros. Amén.»'
      : '«O Saint Rita, patron of the impossible and of those who suffer:\nI present to you today all that in my life seems without way out.\nIntercede before God that, if it is His holy will,\nthe impossible may become possible.\nSaint Rita of Cascia, pray for us. Amen.»', count: 1, bead: 'none' };
    const steps = [cruz, opening];
    peticiones.forEach(pet => {
      steps.push({ label: L ? `${pet.nombre} · Padre Nuestro` : `${pet.nombre} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `${pet.nombre} · Ave María` : `${pet.nombre} · Hail Mary`, text: p.am, count: 1, bead: 'small' });
      steps.push({ label: pet.nombre, text: pet.texto, count: 1, bead: 'none' });
    });
    steps.push(final, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── SAN FELIPE NERI (7 gracias del Espíritu) ──
  if (id === 'sanfelipeneri') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Felipe Neri, apóstol de Roma y maestro de la alegría:\nVen en mi auxilio con tu alegría y tu amor a Dios.\nIntercedeante el Espíritu Santo para que yo también\narda en el fuego del amor divino.»'
      : '«Saint Philip Neri, apostle of Rome and teacher of joy:\nCome to my aid with your joy and love for God.\nIntercede before the Holy Spirit that I too\nmay burn with the fire of divine love.»', count: 1, bead: 'none' };
    const gracias = L ? [
      { nombre: '1ª Gracia · La Alegría',          texto: 'Por la alegría cristiana con que viviste la fe:\nque yo también encuentre en Dios mi alegría más profunda.' },
      { nombre: '2ª Gracia · El Fuego del Espíritu', texto: 'Por el fuego del Espíritu Santo que ardió en tu corazón:\nque ese mismo fuego encienda el mío en el amor de Dios.' },
      { nombre: '3ª Gracia · La Oración',          texto: 'Por tus largas horas de oración ante el Santísimo:\nque yo también aprenda a hacer silencio y escuchar a Dios.' },
      { nombre: '4ª Gracia · La Caridad',          texto: 'Por tu servicio a los pobres, enfermos y peregrinos de Roma:\nque mi fe se traduzca siempre en obras de caridad.' },
      { nombre: '5ª Gracia · La Humildad',         texto: 'Por la humildad con que rechazaste honores y dignidades:\nque yo también sirva a Dios sin buscar reconocimiento.' },
      { nombre: '6ª Gracia · La Música Sagrada',   texto: 'Por el Oratorio que fundaste uniendo oración, música y belleza:\nque yo también busque a Dios a través de lo bello.' },
      { nombre: '7ª Gracia · Los Jóvenes',         texto: 'Por tu amor especial a los jóvenes y tu paciencia con sus errores:\nque tú intercedas por todos los jóvenes del mundo.' },
    ] : [
      { nombre: '1st Grace · Joy',                 texto: 'For the Christian joy with which you lived your faith:\nmay I too find in God my deepest joy.' },
      { nombre: '2nd Grace · Fire of the Spirit',  texto: 'For the fire of the Holy Spirit that burned in your heart:\nmay that same fire kindle mine in the love of God.' },
      { nombre: '3rd Grace · Prayer',              texto: 'For your long hours of prayer before the Blessed Sacrament:\nmay I also learn to make silence and listen to God.' },
      { nombre: '4th Grace · Charity',             texto: 'For your service to the poor, sick, and pilgrims of Rome:\nmay my faith always translate into works of charity.' },
      { nombre: '5th Grace · Humility',            texto: 'For the humility with which you refused honors and dignities:\nmay I too serve God without seeking recognition.' },
      { nombre: '6th Grace · Sacred Music',        texto: 'For the Oratory you founded uniting prayer, music, and beauty:\nmay I too seek God through the beautiful.' },
      { nombre: '7th Grace · Youth',               texto: 'For your special love for young people and your patience with their failings:\nmay you intercede for all the young people of the world.' },
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Oh glorioso San Felipe Neri,\nque la alegría del Espíritu Santo que colmó tu vida\nse derrame también en la mía.\nQue yo sirva a Dios con el corazón libre,\ncon amor sin miedo y con alegría sin fin.\nSan Felipe Neri, ruega por nosotros. Amén.»'
      : '«O glorious Saint Philip Neri,\nmay the joy of the Holy Spirit that filled your life\nspill over into mine as well.\nMay I serve God with a free heart,\nwith love without fear and with joy without end.\nSaint Philip Neri, pray for us. Amen.»', count: 1, bead: 'none' };
    const steps = [cruz, opening];
    gracias.forEach(g => {
      steps.push({ label: L ? `${g.nombre} · Padre Nuestro` : `${g.nombre} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `${g.nombre} · Ave María` : `${g.nombre} · Hail Mary`, text: p.am, count: 1, bead: 'small' });
      steps.push({ label: g.nombre, text: g.texto, count: 1, bead: 'none' });
    });
    steps.push(final, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── SAN GABRIEL ARCÁNGEL (7 mensajes) ─────────
  if (id === 'sangabriel') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Gabriel Arcángel, mensajero de Dios y heraldo de la Encarnación:\ntú que dijiste a María "no temas" y "el Señor está contigo",\ndime también a mí esas palabras de aliento\ny sé mensajero de paz para mi vida.»'
      : '«Saint Gabriel the Archangel, messenger of God and herald of the Incarnation:\nyou who said to Mary "fear not" and "the Lord is with you",\nsay also to me those words of encouragement\nand be a messenger of peace for my life.»', count: 1, bead: 'none' };
    const mensajes = L ? [
      { nombre: '1° Mensaje · La Visión de Daniel',  texto: 'San Gabriel, que apareciste a Daniel para revelar el misterio de los tiempos:\nilumina mi mente para comprender los caminos de Dios en mi vida.' },
      { nombre: '2° Mensaje · Las 70 Semanas',       texto: 'San Gabriel, que anunciaste a Daniel el tiempo de la venida del Mesías:\nayúdame a vivir en espera activa del regreso de Cristo.' },
      { nombre: '3° Mensaje · El Precursor',         texto: 'San Gabriel, que anunciaste a Zacarías el nacimiento de Juan el Bautista:\nque yo también prepare el camino del Señor en mi corazón.' },
      { nombre: '4° Mensaje · La Anunciación',       texto: 'San Gabriel, que dijiste a María "el Señor está contigo" y ella respondió "sí":\nayúdame a recibir la voluntad de Dios con la misma fe que ella.' },
      { nombre: '5° Mensaje · "No Temas"',           texto: 'San Gabriel, mensajero que traes siempre paz, diciendo "no temas":\ndisipa mis miedos y llena mi corazón de la paz que Dios da.' },
      { nombre: '6° Mensaje · Ante el Trono',        texto: 'San Gabriel, que dijiste "yo soy Gabriel, el que está ante Dios":\npresenta mis oraciones al Señor e intercede por mí.' },
      { nombre: '7° Mensaje · La Encarnación',       texto: 'San Gabriel, heraldo de la Encarnación del Verbo:\nayúdame a decir también mi "sí" a la voluntad de Dios.' },
    ] : [
      { nombre: '1st Message · Daniel\'s Vision',   texto: 'Saint Gabriel, who appeared to Daniel to reveal the mystery of the times:\nilluminate my mind to understand God\'s ways in my life.' },
      { nombre: '2nd Message · The 70 Weeks',        texto: 'Saint Gabriel, who announced to Daniel the time of the Messiah\'s coming:\nhelp me to live in active expectation of Christ\'s return.' },
      { nombre: '3rd Message · The Forerunner',      texto: 'Saint Gabriel, who announced to Zechariah the birth of John the Baptist:\nmay I also prepare the way of the Lord in my heart.' },
      { nombre: '4th Message · The Annunciation',    texto: 'Saint Gabriel, who said to Mary "the Lord is with you" and she answered "yes":\nhelp me to receive God\'s will with the same faith she had.' },
      { nombre: '5th Message · "Fear Not"',          texto: 'Saint Gabriel, messenger who always brings peace, saying "fear not":\ndispel my fears and fill my heart with the peace that God gives.' },
      { nombre: '6th Message · Before the Throne',   texto: 'Saint Gabriel, who said "I am Gabriel, who stands before God":\npresent my prayers to the Lord and intercede for me.' },
      { nombre: '7th Message · The Incarnation',     texto: 'Saint Gabriel, herald of the Incarnation of the Word:\nhelp me also to say my "yes" to the will of God.' },
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Oh San Gabriel Arcángel, mensajero del Altísimo:\ntú que llevaste el mensaje más importante de la historia,\nlleva también a Dios mis oraciones y mis necesidades.\nSé para mí mensajero de esperanza en los momentos difíciles.\nSan Gabriel Arcángel, ruega por nosotros. Amén.»'
      : '«O Saint Gabriel the Archangel, messenger of the Most High:\nyou who carried the most important message in history,\ncarry also my prayers and my needs to God.\nBe for me a messenger of hope in difficult moments.\nSaint Gabriel the Archangel, pray for us. Amen.»', count: 1, bead: 'none' };
    const steps = [cruz, opening];
    mensajes.forEach(m => {
      steps.push({ label: L ? `${m.nombre} · Padre Nuestro` : `${m.nombre} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `${m.nombre} · Ave María` : `${m.nombre} · Hail Mary`, text: p.am, count: 1, bead: 'small' });
      steps.push({ label: m.nombre, text: m.texto, count: 1, bead: 'none' });
    });
    steps.push(final, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── SAN RAFAEL ARCÁNGEL (7 dones de sanación) ─
  if (id === 'sanrafael') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Rafael Arcángel, "medicina de Dios", guía de Tobías y sanador de Tobit:\ntú que conoces el camino incluso cuando nosotros estamos perdidos,\nguíame en este camino y sana en mí lo que esté enfermo.»'
      : '«Saint Raphael the Archangel, "medicine of God", guide of Tobias and healer of Tobit:\nyou who know the way even when we are lost,\nguide me on this journey and heal in me what is sick.»', count: 1, bead: 'none' };
    const dones = L ? [
      { nombre: '1° Don · Guía del Camino',        texto: 'San Rafael, que guiaste a Tobías por el camino desconocido:\nguíame también a mí por los caminos que no conozco.' },
      { nombre: '2° Don · La Medicina de Dios',    texto: 'San Rafael, cuyo nombre significa "Dios sana":\nintercede para que Dios sane lo que en mí está enfermo, cuerpo y alma.' },
      { nombre: '3° Don · Liberación del Mal',     texto: 'San Rafael, que liberaste a Sara del demonio Asmodeo:\ndefiéndeme de las influencias malignas y de todo espíritu del mal.' },
      { nombre: '4° Don · Los Matrimonios',        texto: 'San Rafael, que uniste a Tobías y Sara en matrimonio bendecido:\nintercede por los matrimonios del mundo y por quienes buscan pareja.' },
      { nombre: '5° Don · Oración ante Dios',      texto: 'San Rafael, que dijiste "yo presentaba ante Dios la memoria de vuestras oraciones":\npresenta también mis oraciones al Señor.' },
      { nombre: '6° Don · Los Viajeros',           texto: 'San Rafael, patrono de los viajeros y peregrinos:\nacompaña a los que están de camino y protege sus viajes.' },
      { nombre: '7° Don · La Restauración',        texto: 'San Rafael, que devolviste la vista a Tobit y la alegría a toda la familia:\nque Dios restaure lo que se ha perdido en mi vida.' },
    ] : [
      { nombre: '1st Gift · Guide of the Way',     texto: 'Saint Raphael, who guided Tobias along the unknown road:\nguide me also along the ways I do not know.' },
      { nombre: '2nd Gift · God\'s Medicine',      texto: 'Saint Raphael, whose name means "God heals":\nintercede that God may heal what is sick in me, body and soul.' },
      { nombre: '3rd Gift · Freedom from Evil',    texto: 'Saint Raphael, who freed Sarah from the demon Asmodeus:\ndefend me from evil influences and from every spirit of evil.' },
      { nombre: '4th Gift · Marriage',             texto: 'Saint Raphael, who united Tobias and Sarah in blessed marriage:\nintercede for the marriages of the world and for those seeking a spouse.' },
      { nombre: '5th Gift · Prayer Before God',    texto: 'Saint Raphael, who said "I presented before God the memory of your prayers":\npresent my prayers also to the Lord.' },
      { nombre: '6th Gift · Travelers',            texto: 'Saint Raphael, patron of travelers and pilgrims:\naccompany those who are on a journey and protect their travels.' },
      { nombre: '7th Gift · Restoration',          texto: 'Saint Raphael, who restored Tobit\'s sight and joy to the whole family:\nmay God restore what has been lost in my life.' },
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Oh San Rafael Arcángel, compañero fiel de los peregrinos:\ntú que te revelaste diciendo "yo soy Rafael, uno de los siete ángeles que están ante la gloria de Dios":\npresenta mis oraciones ante el trono de Dios\ny sana lo que está roto en mi vida.\nSan Rafael Arcángel, ruega por nosotros. Amén.»'
      : '«O Saint Raphael the Archangel, faithful companion of pilgrims:\nyou who revealed yourself saying "I am Raphael, one of the seven angels who stand before the glory of God":\npresent my prayers before the throne of God\nand heal what is broken in my life.\nSaint Raphael the Archangel, pray for us. Amen.»', count: 1, bead: 'none' };
    const steps = [cruz, opening];
    dones.forEach(d => {
      steps.push({ label: L ? `${d.nombre} · Padre Nuestro` : `${d.nombre} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `${d.nombre} · Ave María` : `${d.nombre} · Hail Mary`, text: p.am, count: 1, bead: 'small' });
      steps.push({ label: d.nombre, text: d.texto, count: 1, bead: 'none' });
    });
    steps.push(final, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  // ── SANTA TERESITA DEL NIÑO JESÚS (5 rosas) ───────────
  if (id === 'santateresita') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Santa Teresita del Niño Jesús, la pequeña flor de Lisieux:\ntTú que prometiste pasar tu cielo haciendo bien en la tierra,\nrecíbeme como uno de tus hermánúsimos. Intercede hoy por mí.\nEnséñame tu camino pequeño: la confianza total en Dios como niño.\u00bb'
      : '«Saint Thérèse of the Child Jesus, the little flower of Lisieux:\nyou who promised to spend your heaven doing good on earth,\nreceive me as one of your little ones. Intercede for me today.\nTeach me your Little Way: total confidence in God as a child.\u00bb', count: 1, bead: 'none' };
    const rosas = L ? [
      { nombre: '1ª Rosa · La Pequeñez',     texto: 'Oh Teresita, que foundáste la santidad en las pequeñas cosas,\nenséñame a ofrecer cada momento ordinario a Dios con amor.' },
      { nombre: '2ª Rosa · La Confianza',     texto: 'Oh Teresita, que confiaste como niña en los brazos del Padre,\nayuda mi corazón ansioso a descansar en Dios sin miedo.' },
      { nombre: '3ª Rosa · El Sufrimiento',   texto: 'Oh Teresita, que ofreciste tu tuberculosis con amor heroico,\nuna mis dolores a los de Cristo para que tengan sentido.' },
      { nombre: '4ª Rosa · Las Misiones',     texto: 'Oh Teresita, patrona de los misioneros,\nintercéde por quienes llevan el Evangelio a los rincones del mundo.' },
      { nombre: '5ª Rosa · La Promesa',       texto: 'Oh Teresita, que prometiste una lluvia de rosas desde el cielo,\nenvía hoy tus rosas de gracia sobre todos los que te invocan.' },
    ] : [
      { nombre: '1st Rose · Littleness',        texto: 'O Thérèse, who found holiness in little things,\nteach me to offer every ordinary moment to God with love.' },
      { nombre: '2nd Rose · Trust',              texto: 'O Thérèse, who trusted like a child in the Father’s arms,\nhelp my anxious heart to rest in God without fear.' },
      { nombre: '3rd Rose · Suffering',          texto: 'O Thérèse, who offered your tuberculosis with heroic love,\nunite my pains to Christ’s so that they may have meaning.' },
      { nombre: '4th Rose · Missions',            texto: 'O Thérèse, patroness of missionaries,\nintercede for those who carry the Gospel to the ends of the earth.' },
      { nombre: '5th Rose · The Promise',        texto: 'O Thérèse, who promised a shower of roses from heaven,\nsend today your roses of grace upon all who call upon you.' },
    ];
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Dios mío, te doy gracias por haber dado a la Iglesia\na la pequeña Santa Teresita del Niño Jesús.\nQue su camino de confianza y amor me inspire a vivir\ncada día como si fuera el último,\nen la certeza de Tu amor. Amén.»'
      : '«O God, I thank You for having given to the Church\nthe little Saint Thérèse of the Child Jesus.\nMay her way of trust and love inspire me to live\neach day as if it were the last,\nin the certainty of Your love. Amen.»', count: 1, bead: 'none' };
    const steps = [cruz, opening];
    rosas.forEach(r => {
      steps.push({ label: L ? `${r.nombre} · Padre Nuestro` : `${r.nombre} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `${r.nombre} · Ave María × 10` : `${r.nombre} · Hail Mary × 10`, text: p.am, count: 10, bead: 'small' });
      steps.push({ label: r.nombre, text: r.texto, count: 1, bead: 'none' });
      steps.push({ ...gloria });
    });
    steps.push(final, { ...cruz, label: L ? 'Señal de la Cruz final' : 'Final Sign of the Cross' });
    return steps;
  }

  return [];
}

function initChapletPlayer(data) {
  const player    = document.getElementById('chapletPlayer');
  const noChaplet = document.getElementById('noChaplet');
  if (!player || !noChaplet) return;

  if (data.chaplet && data.chaplet.available) {
    chapletSteps = getChapletSteps(data.id, currentLang);
    chapletCurrentStep = 0;
    if (chapletSteps.length > 0) {
      player.style.display = '';
      noChaplet.style.display = 'none';
      renderChapletStep();
      // Clone buttons to remove old listeners before re-wiring
      ['cpPrev', 'cpNext'].forEach(id => {
        const old = document.getElementById(id);
        const clone = old.cloneNode(true);
        old.parentNode.replaceChild(clone, old);
      });
      document.getElementById('cpPrev').addEventListener('click', () => {
        if (chapletCurrentStep > 0) { chapletCurrentStep--; renderChapletStep(); }
      });
      document.getElementById('cpNext').addEventListener('click', () => {
        if (chapletCurrentStep < chapletSteps.length - 1) { chapletCurrentStep++; renderChapletStep(); }
      });
      return;
    }
  }
  player.style.display = 'none';
  noChaplet.style.display = 'block';
}

function renderChapletStep() {
  const step  = chapletSteps[chapletCurrentStep];
  const total = chapletSteps.length;
  const cur   = chapletCurrentStep + 1;
  const L     = currentLang === 'es';

  document.getElementById('cpLabel').textContent = step.label;
  document.getElementById('cpStepCount').textContent = `${cur} / ${total}`;
  document.getElementById('cpProgressFill').style.width = `${(cur / total) * 100}%`;
  document.getElementById('cpText').innerHTML = step.text.replace(/\n/g, '<br>');

  const badge = document.getElementById('cpCountBadge');
  if (step.count > 1) { badge.textContent = `× ${step.count}`; badge.style.display = ''; }
  else { badge.style.display = 'none'; }

  const prevBtn = document.getElementById('cpPrev');
  const nextBtn = document.getElementById('cpNext');
  prevBtn.disabled = chapletCurrentStep === 0;
  nextBtn.disabled = chapletCurrentStep === total - 1;

  const isLast = chapletCurrentStep === total - 1;
  nextBtn.querySelector('[data-lang="es"]').textContent = isLast ? '✓ Amén' : 'Siguiente →';
  nextBtn.querySelector('[data-lang="en"]').textContent = isLast ? '✓ Amen' : 'Next →';
  // Apply active language
  [prevBtn, nextBtn].forEach(btn => {
    btn.querySelectorAll('[data-lang]').forEach(el => {
      el.style.display = el.getAttribute('data-lang') === currentLang ? '' : 'none';
    });
  });
}

// ── NOVENA SUPPORT PANEL ───────────────────────────
function renderNovenaSupportPanel(data) {
  const panel   = document.getElementById('novenaSupportPanel');
  const toggle  = document.getElementById('novenaSupportToggle');
  const content = document.getElementById('novenaSupportContent');
  const arrow   = document.getElementById('novenaSupportArrow');
  if (!panel || !toggle || !content) return;

  const lang = currentLang;
  const p    = PRAYERS[lang];
  const t    = i18n[lang];

  // Update toggle label text
  toggle.querySelector('.support-label-es').style.display = lang === 'es' ? '' : 'none';
  toggle.querySelector('.support-label-en').style.display = lang === 'en' ? '' : 'none';

  function prayerBlock(title, text) {
    return `<div class="support-prayer">
      <div class="support-prayer-title">${title}</div>
      <div class="support-prayer-text">${text.replace(/\n/g, '<br>')}</div>
    </div>`;
  }

  // ── Oraciones específicas de la novena (novena_prayers) ──
  let html = '';
  if (data.novena_prayers && data.novena_prayers[lang]) {
    const npTitle = lang === 'es' ? '📿 Cómo rezar esta novena' : '📿 How to pray this novena';
    html += prayerBlock(npTitle, data.novena_prayers[lang])
      + '<hr class="support-prayer-divider">';
  }

  html += prayerBlock(p.pn_title, p.pn)
    + '<hr class="support-prayer-divider">'
    + prayerBlock(p.am_title, p.am)
    + '<hr class="support-prayer-divider">'
    + prayerBlock(p.gloria_title, p.gloria)
    + '<hr class="support-prayer-divider">'
    + prayerBlock(p.credo_title, p.credo);

  if (data.chaplet && data.chaplet.available && data.chaplet[lang]) {
    const chapletTitle = `${data.name[lang]} — ${t.chaplet_lbl}`;
    html += '<hr class="support-prayer-divider">'
      + `<div class="support-prayer support-chaplet">`
      + `<div class="support-prayer-title">${chapletTitle}</div>`
      + `<div class="support-prayer-text">${paragraphify(data.chaplet[lang])}</div>`
      + `</div>`;
  }

  content.innerHTML = html;

  // Wire toggle (only once — replace to avoid duplicates)
  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);
  document.getElementById('novenaSupportToggle').addEventListener('click', function() {
    const isOpen = !content.hidden;
    content.hidden = isOpen;
    this.setAttribute('aria-expanded', String(!isOpen));
    const ar = document.getElementById('novenaSupportArrow');
    if (ar) ar.style.transform = isOpen ? '' : 'rotate(180deg)';
  });
}

// ── TABS ───────────────────────────────────────────
function initTabs(meta) {
  const chapletBtn = document.querySelector('.chaplet-tab');
  if (chapletBtn && meta.chaplet) chapletBtn.classList.add('visible');

  const litanyBtn = document.querySelector('.litany-tab');
  if (litanyBtn && intercessorData && intercessorData.litany && intercessorData.litany.available)
    litanyBtn.classList.add('visible');

  const consecrationBtn = document.querySelector('.consecration-tab');
  if (consecrationBtn && intercessorData && intercessorData.consecration && intercessorData.consecration.available)
    consecrationBtn.classList.add('visible');

  const storyBtn = document.querySelector('.story-tab');
  if (storyBtn) storyBtn.classList.add('visible');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (target !== 'story') ttsStop();
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });
}

// ── NOVENA ─────────────────────────────────────────
function initNovena(data) {
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'), 10);
      setNovenaDay(data, day);
    });
  });

  document.getElementById('prevDay')?.addEventListener('click', () => {
    if (currentDay > 1) setNovenaDay(data, currentDay - 1);
  });
  document.getElementById('nextDay')?.addEventListener('click', () => {
    if (currentDay < 9) setNovenaDay(data, currentDay + 1);
  });
}

function setNovenaDay(data, day) {
  currentDay = day;
  localStorage.setItem('novena_day_' + data.id, day);
  document.querySelectorAll('.day-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.getAttribute('data-day'), 10) === day)
  );
  renderNovenaDay(data, day);
}

function renderNovenaDay(data, day) {
  const dayLabel = document.getElementById('currentDay');
  if (dayLabel) dayLabel.textContent = day;
  const dayData = data.novena.find(d => d.day === day);
  const novenaEl = document.getElementById('novenaText');
  if (novenaEl && dayData) novenaEl.innerHTML = paragraphify(dayData[currentLang]);
}

function showNotFound() {
  const loading = document.getElementById('loadingScreen');
  const notFound = document.getElementById('notFound');
  if (loading) loading.style.display = 'none';
  if (notFound) notFound.style.display = 'flex';
}

// ── TTS (WEB SPEECH API) ─────────────────────────
let _ttsState = 'stopped'; // 'stopped' | 'playing' | 'paused'
let _historiasData = null;
let _historiasMeta = null;

function ttsSpeak(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/\*[^*]+\*/g, '').replace(/#+\s/g, '');
  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang  = lang === 'es' ? 'es-MX' : 'en-US';
  utt.rate  = 0.88;
  utt.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const voice  = voices.find(v => v.lang.startsWith(lang === 'es' ? 'es-MX' : 'en-US'))
              || voices.find(v => v.lang.startsWith(lang === 'es' ? 'es'    : 'en'))
              || null;
  if (voice) utt.voice = voice;
  utt.onend = utt.onerror = () => { _ttsState = 'stopped';  _ttsUpdateButtons(); };
  utt.onpause  = () => { _ttsState = 'paused';  _ttsUpdateButtons(); };
  utt.onresume = () => { _ttsState = 'playing'; _ttsUpdateButtons(); };
  window.speechSynthesis.speak(utt);
  _ttsState = 'playing';
  _ttsUpdateButtons();
}

function ttsPauseToggle() {
  if (!window.speechSynthesis) return;
  if (_ttsState === 'playing') {
    window.speechSynthesis.pause();
    _ttsState = 'paused';
  } else if (_ttsState === 'paused') {
    window.speechSynthesis.resume();
    _ttsState = 'playing';
  }
  _ttsUpdateButtons();
}

function ttsStop() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  _ttsState = 'stopped';
  _ttsUpdateButtons();
}

function _ttsUpdateButtons() {
  const play  = document.getElementById('ttsPlay');
  const pause = document.getElementById('ttsPause');
  const stop  = document.getElementById('ttsStop');
  if (!play) return;
  const isEs = currentLang === 'es';
  if (_ttsState === 'stopped') {
    play.style.display  = '';
    if (pause) pause.style.display = 'none';
    if (stop)  stop.style.display  = 'none';
  } else if (_ttsState === 'playing') {
    play.style.display  = 'none';
    if (pause) { pause.style.display = ''; pause.textContent = isEs ? '⏸ Pausar' : '⏸ Pause'; }
    if (stop)  { stop.style.display  = ''; stop.textContent  = isEs ? '⏹ Detener' : '⏹ Stop'; }
  } else {
    play.style.display  = 'none';
    if (pause) { pause.style.display = ''; pause.textContent = isEs ? '▶ Continuar' : '▶ Continue'; }
    if (stop)  { stop.style.display  = ''; stop.textContent  = isEs ? '⏹ Detener' : '⏹ Stop'; }
  }
}

async function initHistoriasPage() {
  const params   = new URLSearchParams(window.location.search);
  const id       = params.get('santo');
  const loading  = document.getElementById('loadingScreen');
  const wrapper  = document.getElementById('historiasWrapper');
  const notFound = document.getElementById('historiasNotFound');

  if (!id) {
    if (loading)  loading.style.display  = 'none';
    if (notFound) notFound.style.display = '';
    return;
  }
  const meta = INTERCESSORS.find(i => i.id === id);
  if (!meta) {
    if (loading)  loading.style.display  = 'none';
    if (notFound) notFound.style.display = '';
    return;
  }
  try {
    const data = await loadIntercessorData(id);
    _historiasData = data;
    _historiasMeta = meta;
    if (loading)  loading.style.display  = 'none';
    if (wrapper)  wrapper.style.display  = '';
    renderHistoriasPage(data, meta);
  } catch {
    if (loading)  loading.style.display  = 'none';
    if (notFound) notFound.style.display = '';
  }
}

function renderHistoriasPage(data, meta) {
  const lang = currentLang;
  document.title = (lang === 'es' ? 'Historia de ' : 'Story of ') + data.name[lang] + ' | The Universal Prayer';

  const imgEl = document.getElementById('historiasImg');
  if (imgEl) { imgEl.src = data.image || ''; imgEl.alt = data.name[lang]; }

  const nameEl = document.getElementById('historiasName');
  if (nameEl) nameEl.textContent = data.name[lang];

  const subEl = document.getElementById('historiasSubtitle');
  if (subEl) subEl.textContent = lang === 'es' ? '📖 Historia para Niños' : '📖 Children\'s Story';

  const backHref = `/intercesor/?intercesor=${meta.id}`;
  const backLabel = lang === 'es' ? `← Volver a ${data.name[lang]}` : `← Back to ${data.name[lang]}`;
  const backEl = document.getElementById('historiasBack');
  if (backEl) { backEl.href = backHref; backEl.textContent = backLabel; }
  const backBotEl = document.getElementById('historiasBackBottom');
  if (backBotEl) { backBotEl.href = backHref; backBotEl.textContent = backLabel; }

  const textEl = document.getElementById('historiasText');
  if (textEl) textEl.innerHTML = paragraphify(data.history[lang]);

  const noSupport = document.getElementById('ttsNoSupport');
  if (!window.speechSynthesis) {
    if (noSupport) noSupport.style.display = '';
    const ttsPlayer = document.getElementById('ttsPlayer');
    if (ttsPlayer) { document.getElementById('ttsPlay').style.display = 'none'; }
  }

  // Wire up buttons (only once, use dataset flag)
  const btnPlay = document.getElementById('ttsPlay');
  if (btnPlay && !btnPlay.dataset.wired) {
    btnPlay.dataset.wired = '1';
    btnPlay.addEventListener('click', () => ttsSpeak(data.history[currentLang], currentLang));
    const btnPause = document.getElementById('ttsPause');
    if (btnPause) btnPause.addEventListener('click', ttsPauseToggle);
    const btnStop = document.getElementById('ttsStop');
    if (btnStop) btnStop.addEventListener('click', ttsStop);
  }

  // Update play button label
  if (btnPlay) btnPlay.textContent = lang === 'es' ? '▶ Leer en voz alta' : '▶ Read aloud';
  _ttsUpdateButtons();
}

// ── HAMBURGER MENU ────────────────────────────────
function initMenu() {
  const btn     = document.getElementById('hamburgerBtn');
  const nav     = document.getElementById('sideNav');
  const overlay = document.getElementById('sideNavOverlay');
  const close   = document.getElementById('sideNavClose');
  const list    = document.getElementById('sideNavList');
  if (!btn || !nav || !list) return;

  // Populate list
  function renderMenuItems() {
    const isSubPage      = isIntercessorPage() || isHistoriasPage();
    const homeHref        = isSubPage ? '/' : '#top';
    const familyHref      = isSubPage ? '/#oraciones-familia' : '#oraciones-familia';
    const intercesorsHref = isSubPage ? '/#intercessorsGrid'  : '#intercessorsGrid';

    const homeLabel       = currentLang === 'es' ? '← Inicio'              : '← Home';
    const familyLabel     = currentLang === 'es' ? '🙏 Oraciones en Familia' : '🙏 Family Prayers';
    const intercesorsLabel = currentLang === 'es' ? '✨ Intercesores'        : '✨ Intercessors';
    const adoracionLabel  = currentLang === 'es' ? '✝ Adoración'            : '✝ Adoration';
    const espirituLabel   = currentLang === 'es' ? '🕊 Espíritu Santo'       : '🕊 Holy Spirit';

    list.innerHTML = `
      <li><a class="side-nav-link side-nav-home"   href="${homeHref}">${homeLabel}</a></li>
      <li><a class="side-nav-link side-nav-family" href="${familyHref}">${familyLabel}</a></li>
      <li><a class="side-nav-link side-nav-saints" href="${intercesorsHref}">${intercesorsLabel}</a></li>
      <li><a class="side-nav-link side-nav-adoracion" href="/adoracion/">${adoracionLabel}</a></li>
      <li><a class="side-nav-link side-nav-espiritu" href="/espiritu/">${espirituLabel}</a></li>`;
  }
  renderMenuItems();

  // Re-render when language changes (called from setLanguage)
  window._renderMenuItems = renderMenuItems;

  const open  = () => { nav.classList.add('open'); overlay.classList.add('open'); };
  const close_ = () => { nav.classList.remove('open'); overlay.classList.remove('open'); };

  btn.addEventListener('click', open);
  close.addEventListener('click', close_);
  overlay.addEventListener('click', close_);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close_(); });
}

// ── BOOT ───────────────────────────────────────────
(function init() {
  currentLang = detectLanguage();
  setLanguage(currentLang);

  // Language toggle
  document.getElementById('langToggle')?.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
    if (isHistoriasPage()) {
      ttsStop();
      if (_historiasData && _historiasMeta) renderHistoriasPage(_historiasData, _historiasMeta);
    } else if (!isIntercessorPage()) {
      const grid = document.getElementById('intercessorsGrid');
      if (grid) { grid.innerHTML = ''; initHomePage(); }
      renderQuickNav();
    }
  });

  if (isHistoriasPage()) {
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    initHistoriasPage();
  } else if (isIntercessorPage()) {
    initIntercessorPage();
  } else {
    renderQuickNav();
    renderBasePrayers();
    window._renderQuickNav = renderQuickNav;
    initHomePage();
  }

  initMenu();

  // ── SCROLL PROGRESS BAR ──────────────────────────
  const _sb = document.getElementById('scrollProgress');
  if (_sb) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      _sb.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
    }, { passive: true });
  }

  // ── SCROLL TO TOP ─────────────────────────────────
  const _b2t = document.getElementById('backToTop');
  if (_b2t) {
    window.addEventListener('scroll', () => {
      _b2t.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    _b2t.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── SHARE BUTTON ──────────────────────────────────
  const _share = document.getElementById('heroShareBtn');
  if (_share) {
    if (navigator.share) {
      _share.addEventListener('click', () => {
        navigator.share({
          title: currentLang === 'es' ? 'La Oración Universal' : 'The Universal Prayer',
          text: currentLang === 'es'
            ? 'Oraciones, novenas y coronillas para cada intercesor. Gratis, siempre.'
            : 'Prayers, novenas and chaplets for every intercessor. Free, always.',
          url: window.location.href,
        }).catch(() => {});
      });
    } else {
      _share.style.display = 'none';
    }
  }

  // ── INSTALL BUTTON (PWA) ──────────────────────────
  const _installBtn = document.getElementById('heroInstallBtn');
  const _iosModal   = document.getElementById('iosInstallModal');
  const _iosClose   = document.getElementById('iosInstallClose');

  if (_installBtn) {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;

    if (!isInStandaloneMode) {
      if (isIos) {
        // iOS: show step-by-step modal (navigator.share does NOT include Add to Home Screen)
        _installBtn.style.display = '';
        _installBtn.addEventListener('click', () => {
          if (_iosModal) _iosModal.style.display = 'flex';
        });
      } else {
        // Android / desktop Chrome: wait for beforeinstallprompt
        let _deferredPrompt = null;
        window.addEventListener('beforeinstallprompt', e => {
          e.preventDefault();
          _deferredPrompt = e;
          _installBtn.style.display = '';
        });
        _installBtn.addEventListener('click', () => {
          if (_deferredPrompt) {
            _deferredPrompt.prompt();
            _deferredPrompt.userChoice.then(() => {
              _deferredPrompt = null;
              _installBtn.style.display = 'none';
            });
          }
        });
        // Hide button once installed
        window.addEventListener('appinstalled', () => {
          _installBtn.style.display = 'none';
        });
      }
    }
  }

  if (_iosClose && _iosModal) {
    _iosClose.addEventListener('click', () => { _iosModal.style.display = 'none'; });
    _iosModal.addEventListener('click', e => {
      if (e.target === _iosModal) _iosModal.style.display = 'none';
    });
  }

  // ── TODAY’S SAINT PILL ───────────────────────────
  if (!isIntercessorPage()) {
    const _pill     = document.getElementById('heroTodayPill');
    const _nameEs   = document.getElementById('heroTodayNameEs');
    const _nameEn   = document.getElementById('heroTodayNameEn');
    const _todayLnk = document.getElementById('heroTodayLink');
    if (_pill && _nameEs && _nameEn && _todayLnk) {
      const _cands = INTERCESSORS.filter(i => i.id !== 'misericordia');
      const _today = _cands[Math.floor(Date.now() / 86400000) % _cands.length];
      _nameEs.textContent = _today.name.es;
      _nameEn.textContent = _today.name.en;
      _todayLnk.href = buildIntercessorUrl(_today.subdomain);
      _pill.style.display = 'flex';
    }
  }
})();
