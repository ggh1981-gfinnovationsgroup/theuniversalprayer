/* =====================================================
   THE UNIVERSAL PRAYER — main.js
   Subdomain detection · Language toggle · Content loader
   ===================================================== */

'use strict';

const APP_VERSION = 'v2026.07.11-1';

function withAssetVersion(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(APP_VERSION)}`;
}

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
    image_zoom:         'Expand image',
    image_zoom_close:   'Close image',
    image_share:        'Share image',
    image_share_copied: 'Link copied',
    footer_text:             'A free Catholic devotional resource. No ads. No tracking.',
    universal_prayer_title:  'The Universal and Definitive Prayer',
    universal_prayer_dedication: 'For every person who prays it — alone, as a couple, as a family or in a group',
    menu_title:              'Intercessors',
    search_placeholder:      'Search by saint name, intention or situation (min. 3 letters)...',
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
    image_zoom:         'Ampliar imagen',
    image_zoom_close:   'Cerrar imagen',
    image_share:        'Compartir imagen',
    image_share_copied: 'Enlace copiado',
    footer_text:             'Un recurso devocional católico gratuito. Sin anuncios. Sin rastreo.',
    universal_prayer_title:  'La Oración Universal y Definitiva',
    universal_prayer_dedication: 'Para toda persona que la rece — solo, en pareja, en familia o en grupo',
    menu_title:              'Intercesores',
    search_placeholder:      'Busca por nombre del santo/intercesor, motivo o situación (mínimo 3 letras)...',
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
  { id: 'sanjuanbosco',      subdomain: 'sanjuanbosco',      chaplet: false, novena: true,  color: '#1f3f8f', short: { es: 'S. Juan Bosco',    en: 'St. John Bosco'   }, name: { en: 'Saint John Bosco',                      es: 'San Juan Bosco'                           }, specialty: { es: 'Juventud y educacion',        en: 'Youth & education'           } },
  { id: 'sanantonio',        subdomain: 'sanantonio',        chaplet: true,  novena: true,  color: '#6a3018', short: { es: 'San Antonio',      en: 'St. Anthony'      }, name: { en: 'Saint Anthony of Padua',                es: 'San Antonio de Padua'                     }, specialty: { es: 'Lo perdido y los pobres',     en: 'Lost things & the poor'      } },
  { id: 'teresacalcuta',     subdomain: 'teresacalcuta',     chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'Sta. Teresa',      en: 'St. Teresa'       }, name: { en: 'Saint Teresa of Calcutta',              es: 'Santa Teresa de Calcuta'                  }, specialty: { es: 'Los más pobres',              en: 'The poorest of the poor'     } },
  { id: 'sanmiguel',         subdomain: 'sanmiguel',         chaplet: true,  novena: true,  color: '#253070', short: { es: 'San Miguel',       en: 'St. Michael'      }, name: { en: 'Saint Michael the Archangel',           es: 'San Miguel Arcángel'                      }, specialty: { es: 'Protección espiritual',       en: 'Spiritual protection'        } },
  { id: 'sangabriel',        subdomain: 'sangabriel',        chaplet: true,  novena: true,  color: '#1a3a6b', short: { es: 'San Gabriel',      en: 'St. Gabriel'      }, name: { en: 'Saint Gabriel the Archangel',           es: 'San Gabriel Arcángel'                     }, specialty: { es: 'Mensajes divinos',            en: 'Divine messages'             } },
  { id: 'sanrafael',         subdomain: 'sanrafael',         chaplet: true,  novena: true,  color: '#1a5c3a', short: { es: 'San Rafael',       en: 'St. Raphael'      }, name: { en: 'Saint Raphael the Archangel',           es: 'San Rafael Arcángel'                      }, specialty: { es: 'Sanación y viajeros',         en: 'Healing & travelers'         } },
  { id: 'angelguarda',       subdomain: 'angelguarda',       chaplet: true,  novena: true,  color: '#4a4a70', short: { es: 'Ángel Custodio',   en: 'Guardian Angel'   }, name: { en: 'Guardian Angel',                        es: 'Ángel de la Guarda'                       }, specialty: { es: 'Custodia personal',           en: 'Personal guardian'           } },
  { id: 'lourdes',           subdomain: 'lourdes',           chaplet: false, novena: true,  color: '#2f5f86', short: { es: 'V. de Lourdes',   en: 'Our Lady Lourdes' }, name: { en: 'Our Lady of Lourdes',                  es: 'Nuestra Señora de Lourdes'                }, specialty: { es: 'Sanación, conversión y esperanza', en: 'Healing, conversion and hope' } },
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
  { id: 'sanfranciscodesales', subdomain: 'sanfranciscodesales', chaplet: false, novena: true,  color: '#3f4f6f', short: { es: 'S. Fco. de Sales', en: 'St. Francis de Sales' }, name: { en: 'Saint Francis de Sales',               es: 'San Francisco de Sales'                   }, specialty: { es: 'Discernimiento y vida interior', en: 'Discernment & interior life' } },
  { id: 'santotomasdeaquino', subdomain: 'santotomasdeaquino', chaplet: false, novena: true,  color: '#3a2f5f', short: { es: 'Sto. Tomas Aq.',  en: 'St. Thomas Aq.'   }, name: { en: 'Saint Thomas Aquinas',                es: 'Santo Tomas de Aquino'                   }, specialty: { es: 'Teologia, estudio y claridad', en: 'Theology, study and clarity' } },
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
  { id: 'sanperegrino',      subdomain: 'sanperegrino',      chaplet: true,  novena: true,  color: '#8a1a3a', short: { es: 'San Peregrino',   en: 'St. Peregrine'    }, name: { en: 'Saint Peregrine Laziosi',               es: 'San Peregrino Laziosi'                    }, specialty: { es: 'Enfermos de cáncer',          en: 'Cancer patients'             } },
  { id: 'sancamilo',          subdomain: 'sancamilo',          chaplet: false, novena: true,  color: '#8a0010', short: { es: 'San Camilo',      en: 'St. Camillus'     }, name: { en: 'Saint Camillus de Lellis',              es: 'San Camilo de Lelis'                      }, specialty: { es: 'Enfermos y personal sanitario', en: 'Sick & healthcare workers'   } },
  { id: 'sanblas',            subdomain: 'sanblas',            chaplet: false, novena: true,  color: '#1828a0', short: { es: 'San Blas',        en: 'St. Blaise'       }, name: { en: 'Saint Blaise of Sebaste',              es: 'San Blas de Sebaste'                      }, specialty: { es: 'Garganta y vías respiratorias', en: 'Throat & airways'            } },
  { id: 'sancharbel',         subdomain: 'sancharbel',         chaplet: false, novena: true,  color: '#1a2a5a', short: { es: 'San Charbel',     en: 'St. Charbel'      }, name: { en: 'Saint Charbel Makhlouf',               es: 'San Charbel Makhlouf'                     }, specialty: { es: 'Sanación y milagros',         en: 'Healing & miracles'          } },
  { id: 'santaana',            subdomain: 'santaana',            chaplet: true,  novena: true,  color: '#8a5a00', short: { es: 'Santa Ana',       en: 'St. Anne'         }, name: { en: 'Saint Anne',                           es: 'Santa Ana'                                }, specialty: { es: 'Infertilidad y maternidad',      en: 'Infertility & motherhood'    } },
  { id: 'sanjuandedios',       subdomain: 'sanjuandedios',       chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'San Juan de Dios', en: 'St. John of God'  }, name: { en: 'Saint John of God',                    es: 'San Juan de Dios'                         }, specialty: { es: 'Corazón y hospitales',         en: 'Heart & hospitals'           } },
  { id: 'santaapolonia',       subdomain: 'santaapolonia',       chaplet: false, novena: true,  color: '#a03060', short: { es: 'Santa Apolonia',  en: 'St. Apollonia'    }, name: { en: 'Saint Apollonia of Alexandria',        es: 'Santa Apolonia de Alejandría'             }, specialty: { es: 'Dolores dentales',                en: 'Dental pain'                 } },
  { id: 'santagema',           subdomain: 'santagema',           chaplet: false, novena: true,  color: '#7a1a5a', short: { es: 'Santa Gema',      en: 'St. Gemma'        }, name: { en: 'Saint Gemma Galgani',                  es: 'Santa Gema Galgani'                       }, specialty: { es: 'Dolor crónico y espalda',       en: 'Chronic pain & back'         } },
  { id: 'sangerardo',          subdomain: 'sangerardo',          chaplet: false, novena: true,  color: '#1a6a3a', short: { es: 'San Gerardo',     en: 'St. Gerard'       }, name: { en: 'Saint Gerard Majella',                 es: 'San Gerardo Majella'                      }, specialty: { es: 'Embarazo y madres',                en: 'Pregnancy & mothers'         } },
  { id: 'santagianna',         subdomain: 'santagianna',         chaplet: false, novena: true,  color: '#c03060', short: { es: 'Sta. Gianna',     en: 'St. Gianna'       }, name: { en: 'Saint Gianna Beretta Molla',           es: 'Santa Gianna Beretta Molla'               }, specialty: { es: 'Médicos y vida del bebé',      en: 'Doctors & unborn life'       } },
  { id: 'sandavidgales',       subdomain: 'sandavidgales',       chaplet: false, novena: true,  color: '#2a5a1a', short: { es: 'San David',       en: 'St. David'        }, name: { en: 'Saint David of Wales',                 es: 'San David de Gales'                       }, specialty: { es: 'Pequeñas cosas y Gales',      en: 'Little things & Wales'       } },
  { id: 'reydavid',            subdomain: 'reydavid',            chaplet: false, novena: true,  color: '#c8a020', short: { es: 'Rey David',       en: 'King David'       }, name: { en: 'King David, Prophet and Psalmist',     es: 'Rey David, Profeta y Salmista'            }, specialty: { es: 'Salmos y alabanza',            en: 'Psalms & praise'             } },
  { id: 'santaemma',           subdomain: 'santaemma',           chaplet: false, novena: true,  color: '#8a2a5a', short: { es: 'Sta. Emma',        en: 'St. Emma'         }, name: { en: 'Saint Emma of Gurk',                   es: 'Santa Emma de Gurk'                       }, specialty: { es: 'Duelo y pérdida de hijos',  en: 'Grief & loss of children'    } },
  { id: 'sanismael',           subdomain: 'sanismael',           chaplet: false, novena: true,  color: '#1a3a6a', short: { es: 'San Ismael',       en: 'St. Ishmael'      }, name: { en: 'Saint Ishmael of Wales',                es: 'San Ismael de Gales'                      }, specialty: { es: 'Fe celta y Bretaña',         en: 'Celtic faith & Brittany'     } },
  { id: 'santadelia',          subdomain: 'santadelia',          chaplet: false, novena: true,  color: '#a03070', short: { es: 'Sta. Delia',      en: 'St. Delia'        }, name: { en: 'Saint Delia, Martyr',                   es: 'Santa Delia, Mártir'                      }, specialty: { es: 'Fe bajo persecución',        en: 'Faith under persecution'     } },
  { id: 'sanjorge',            subdomain: 'sanjorge',            chaplet: false, novena: true,  color: '#8a1a1a', short: { es: 'San Jorge',       en: 'St. George'       }, name: { en: 'Saint George, Martyr',                  es: 'San Jorge, Mártir'                        }, specialty: { es: 'Soldados y protección',       en: 'Soldiers & protection'       } },
  { id: 'santaisabel',         subdomain: 'santaisabel',         chaplet: false, novena: true,  color: '#8a4010', short: { es: 'Sta. Isabel',     en: 'St. Elizabeth'    }, name: { en: 'Saint Elizabeth of Hungary',            es: 'Santa Isabel de Hungría'                  }, specialty: { es: 'Pobres y enfermos',          en: 'Poor & sick'                 } },
  { id: 'sandaniel',           subdomain: 'sandaniel',           chaplet: false, novena: true,  color: '#8a7020', short: { es: 'San Daniel',      en: 'St. Daniel'       }, name: { en: 'Saint Daniel the Prophet',              es: 'San Daniel, Profeta'                      }, specialty: { es: 'Profetas y perseverancia',   en: 'Prophets & perseverance'     } },
  { id: 'santaelena',          subdomain: 'santaelena',          chaplet: false, novena: true,  color: '#8a5a10', short: { es: 'Sta. Elena',      en: 'St. Helena'       }, name: { en: 'Saint Helena',                          es: 'Santa Elena'                             }, specialty: { es: 'La Santa Cruz y conversos',  en: 'Holy Cross & converts'       } },
  { id: 'sanjuandiego',        subdomain: 'sanjuandiego',        chaplet: false, novena: true,  color: '#8a1a2a', short: { es: 'San Juan Diego',  en: 'St. Juan Diego'   }, name: { en: 'Saint Juan Diego Cuauhtlatoatzin',      es: 'San Juan Diego Cuauhtlatoatzin'          }, specialty: { es: 'Pueblos indígenas de América',  en: 'Indigenous peoples of Americas' } },
  { id: 'sanalejandro',        subdomain: 'sanalejandro',        chaplet: false, novena: true,  color: '#2a4a8a', short: { es: 'San Alejandro',  en: 'St. Alexander'    }, name: { en: 'Saint Alexander of Bergamo',            es: 'San Alejandro de Bérgamo'                }, specialty: { es: 'Soldados y mártires',       en: 'Soldiers & martyrs'          } },
  { id: 'sanoliverplunkett',   subdomain: 'sanoliverplunkett',   chaplet: false, novena: true,  color: '#1a5a28', short: { es: 'S. Oliver Plunkett', en: 'St. Oliver Plunkett' }, name: { en: 'Saint Oliver Plunkett',              es: 'San Oliver Plunkett'                     }, specialty: { es: 'Paz en Irlanda y mártires', en: 'Peace in Ireland & martyrs'  } },
  { id: 'santasilvia',         subdomain: 'santasilvia',         chaplet: false, novena: true,  color: '#5a3a7a', short: { es: 'Sta. Silvia',     en: 'St. Sylvia'       }, name: { en: 'Saint Sylvia of Rome',               es: 'Santa Silvia de Roma'                    }, specialty: { es: 'Madres y familias',         en: 'Mothers & families'          } },
  { id: 'santaleticia',        subdomain: 'santaleticia',        chaplet: false, novena: true,  color: '#8a2a5a', short: { es: 'Sta. Leticia',    en: 'St. Laetitia'     }, name: { en: 'Saint Laetitia (Leticia)',            es: 'Santa Leticia (Laetitia)'                }, specialty: { es: 'Alegría y fe en pruebas',   en: 'Joy & faith in trials'       } },
  { id: 'sanpedro',            subdomain: 'sanpedro',            chaplet: false, novena: true,  color: '#1a3a7a', short: { es: 'San Pedro',       en: 'St. Peter'        }, name: { en: 'Saint Peter the Apostle',            es: 'San Pedro Apóstol'                       }, specialty: { es: 'La Iglesia y el Papado',    en: 'The Church & the Papacy'     } },
  { id: 'sanfranciscojavier',  subdomain: 'sanfranciscojavier',  chaplet: true,  novena: true,  color: '#1a3a6a', short: { es: 'S. Francisco Javier', en: 'St. Francis Xavier' }, name: { en: 'Saint Francis Xavier',             es: 'San Francisco Javier'                    }, specialty: { es: 'Misiones y Asia',           en: 'Missions & Asia'             } },
  { id: 'sancarloslwanga',     subdomain: 'sancarloslwanga',     chaplet: false, novena: true,  color: '#4a1a08', short: { es: 'S. Carlos Lwanga',  en: 'St. Charles Lwanga' }, name: { en: 'Saint Charles Lwanga',             es: 'San Carlos Lwanga'                       }, specialty: { es: 'Jóvenes y mártires de África', en: 'Youth & Martyrs of Africa'  } },
  { id: 'sanbonifacio',         subdomain: 'sanbonifacio',         chaplet: false, novena: true,  color: '#3a1060', short: { es: 'S. Bonifacio',     en: 'St. Boniface'     }, name: { en: 'Saint Boniface of Mainz',           es: 'San Bonifacio de Maguncia'               }, specialty: { es: 'Evangelización de Europa',  en: 'Evangelization of Europe'    } },
  { id: 'sanefren',             subdomain: 'sanefren',             chaplet: false, novena: true,  color: '#0a2a2a', short: { es: 'San Efrén',       en: 'St. Ephrem'       }, name: { en: 'Saint Ephrem of Syria',             es: 'San Efrén de Siria'                      }, specialty: { es: 'Poesía y liturgia oriental', en: 'Poetry & Eastern Liturgy'    } },
  { id: 'sanbarnabes',          subdomain: 'sanbarnabes',          chaplet: false, novena: true,  color: '#142808', short: { es: 'San Bernabé',    en: 'St. Barnabas'     }, name: { en: 'Saint Barnabas the Apostle',        es: 'San Bernabé Apóstol'                     }, specialty: { es: 'Aliento y segundas oportunidades', en: 'Encouragement & Second Chances' } },
  { id: 'sanluisgonzaga',       subdomain: 'sanluisgonzaga',       chaplet: false, novena: true,  color: '#08081c', short: { es: 'S. Luis Gonzaga', en: 'St. Aloysius'     }, name: { en: 'Saint Aloysius Gonzaga',            es: 'San Luis Gonzaga'                        }, specialty: { es: 'Juventud y pureza',         en: 'Youth & Purity'              } },
  { id: 'santomamoro',          subdomain: 'santomamoro',          chaplet: false, novena: true,  color: '#0a0808', short: { es: 'S. Tomás Moro',   en: 'St. Thomas More'  }, name: { en: 'Saint Thomas More',                es: 'San Tomás Moro'                          }, specialty: { es: 'Conciencia y gobierno',     en: 'Conscience & Government'     } },
  { id: 'sanjuanbautista',      subdomain: 'sanjuanbautista',      chaplet: true,  novena: true,  color: '#180e02', short: { es: 'S. Juan Bautista', en: 'St. John Baptist' }, name: { en: 'Saint John the Baptist',            es: 'San Juan Bautista'                       }, specialty: { es: 'Precursor y conversión',  en: 'Forerunner & Conversion'     } },
  { id: 'sanireneolyon',        subdomain: 'sanireneolyon',        chaplet: false, novena: true,  color: '#080410', short: { es: 'S. Ireneo',        en: 'St. Irenaeus'      }, name: { en: 'Saint Irenaeus of Lyon',            es: 'San Ireneo de Lyon'                      }, specialty: { es: 'Unidad y doctrina',       en: 'Unity & Doctrine'            } },
  { id: 'santomasapostol',      subdomain: 'santomasapostol',      chaplet: false, novena: true,  color: '#150800', short: { es: 'Sto. Tomás',      en: 'St. Thomas'        }, name: { en: 'Saint Thomas the Apostle',          es: 'Santo Tomás Apóstol'                     }, specialty: { es: 'Fe y testimonio',         en: 'Faith & Witness'             } },
  { id: 'sancarlosacutis',      subdomain: 'sancarlosacutis',      chaplet: false, novena: true,  color: '#001030', short: { es: 'S. Carlos Acutis', en: 'St. Carlo Acutis'  }, name: { en: 'Saint Carlo Acutis',               es: 'San Carlos Acutis'                       }, specialty: { es: 'Juventud e internet',     en: 'Youth & Internet'            } },
  { id: 'sanbenito',            subdomain: 'sanbenito',            chaplet: true,  novena: true,  color: '#060c04', short: { es: 'S. Benito',        en: 'St. Benedict'      }, name: { en: 'Saint Benedict of Nursia',          es: 'San Benito de Nursia'                    }, specialty: { es: 'Orden y monacato',        en: 'Order & Monasticism'         } },
  { id: 'nuestrasenoracarmen',  subdomain: 'nuestrasenoracarmen',  chaplet: true,  novena: true,  color: '#020610', short: { es: 'V. del Carmen',   en: 'Our Lady Carmen'   }, name: { en: 'Our Lady of Mount Carmel',          es: 'Nuestra Señora del Carmen'                }, specialty: { es: 'Protección y contemplación', en: 'Protection & Prayer'         } },
  { id: 'divinonino',           subdomain: 'divinonino',           chaplet: false, novena: true,  color: '#020510', short: { es: 'Divino Niño',   en: 'Divine Child'      }, name: { en: 'Divine Child Jesus',                es: 'Divino Niño Jesús'                          }, specialty: { es: 'Ternura y confianza',     en: 'Tenderness & Trust'          } },
  { id: 'santamariagoretti',    subdomain: 'santamariagoretti',    chaplet: false, novena: true,  color: '#a11b28', short: { es: 'Sta. Goretti',  en: 'St. Goretti'       }, name: { en: 'Saint Maria Goretti',               es: 'Santa Maria Goretti'                      }, specialty: { es: 'Pureza y perdón',          en: 'Purity & forgiveness'        } },
  { id: 'preciosisimasangre',   subdomain: 'preciosisimasangre',   chaplet: true,  novena: true,  color: '#7a1010', short: { es: 'Prec. Sangre',  en: 'Precious Blood'    }, name: { en: 'Most Precious Blood of Christ',       es: 'Preciosísima Sangre de Cristo'            }, specialty: { es: 'Redención y protección',   en: 'Redemption & protection'     } },
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
  lourdes:           'lourdes nuestra senora our lady virgen maria mary bernadette gruta grotto agua water manantial spring sanacion healing salud health enfermedad illness enfermos sick milagros miracles conversion conversion penitencia penance misericordia mercy esperanza hope fe faith paz peace consuelo comfort sufrimiento suffering dolor pain ansiedad anxiety depresion depression trauma reconciliacion reconciliation alma soul cuerpo body mente mind inmaculada conception',
  sanrafael:         'rafael arcangel sanacion curacion healing enfermedad illness salud health medicina medicine hospital medicos doctors enfermeros nurses operacion surgery cirugia surgery recuperacion recovery cancer tumor oncologia oncology enfermedad grave serious illness terminal illness viaje travel Tobias Tobiah matrimonio marriage amor love encuentro de pareja finding a partner depresion depression mental health salud mental problemas digestivos digestive problems artritis arthritis diabetes enfermedades cronicas chronic diseases rehabilitacion rehabilitation fisioterapia physical therapy',
  padrepio:          'padre pio pio pietrelcina estigmas stigmata sanacion curacion healing confesion confession direction espiritual spiritual direction enfermedad illness cancer tumor oncologia oncology enfermedad grave serious illness milagros miracles bilocation bilocacion rosas roses olor fragancia perfume supernatural aroma culpa guilt conversion conversion sacerdote confesor confessor priest alma soul purgatorio purgatory intercesion intercession sanacion espiritual spiritual healing adiccion addiction alcoholismo alcoholism',
  santafabiola:      'fabiola roma divorciados divorced enfermos sick hospital enfermedad illness sanacion healing fundadora hospitales founder of hospitals viudas widows reconciliacion reconciliation segunda oportunidad second chance errores pasados past mistakes conversion comeback regreso a la fe returning to faith vida nueva new life pecado sin arrepentimiento repentance cancer tumor oncologia oncology enfermedad grave serious illness terminal illness cuidado de enfermos care of the sick',
  fatima:            'fatima portugal rosario rosary paz peace guerra war conflicto conflict conversion del mundo world conversion rusia russia consagracion consecration corazon inmaculado immaculate heart mensaje message tres pastores three shepherds lucia jacinta francisco vision apparition aparicion nuestra señora our lady virgen virgin profecia prophecy primera sabado first saturday cinco primeros sabados five first saturdays oracion prayer penitencia penance reparacion reparation fin de guerra end of war familia en peligro family in danger mundo en caos world in chaos',
  guadalupe:         'guadalupe juan diego mexico tilma manto aparicion apparition virgen morena brown virgin america latina latin america hispanos hispanics inmigrantes immigrants indocumentados undocumented naciones nations pueblo people humildes humble tonatzin azteca aztec ninos no nacidos unborn abortion aborto mujer woman dignidad dignity embarazo pregnancy refugio shelter esperanza hope marginados marginalized cultura culture identidad identity patria homeland',
  sanantonio:        'antonio padova padua perdido lost objetos objects cosas things encontrar find misplaced keys llaves billetera wallet documentos documents milagros miracles pobres poor pan bread matrimonio marriage pareja partner novio novio boyfriend girlfriend amor love predicador preacher doctor iglesia church milagros de antonio miracles franciscano franciscan',
  teresacalcuta:     'teresa calcula madre teresa pobres poor abandono abandonment soledad loneliness pobreza poverty marginados marginalized moribundos dying desechados discarded misioneras de la caridad missionaries of charity calcuta calcutta india servicio service caridad charity generosidad generosity dar giving voluntariado volunteering indigentes homeless hambre hunger miseria misery dignidad dignity amor incondicional unconditional love oracion prayer accion action fe activa active faith',
  juanpablo:         'juan pablo ii karol wojtyla jovenes youth universitarios university adolescentes teenagers vocacion vocation juventud world youth day jornada mundial sacerdocio priesthood matrimonio marriage familia family trabajo work filosofia philosophy teologia theology fenomenologia phenomenology evangelizacion evangelization nueva evangelizacion new evangelization solidaridad solidarity Polonia Poland',
  sanjuanbosco:      'juan bosco don bosco salesiano salesian oratorio juventud youth adolescentes teens educacion education escuela school colegio vocation vocacion pureza joy alegria confession confesion eucaristia mary auxiliadora maria auxiliadora jovenes en riesgo at-risk youth catequesis catechesis familia family padres parents',
  sanmaximiliano:    'maximiliano kolbe kolbe immaculata inmaculada pureza purity mariano mary consecration consecracion evangelizacion media prensa internet juventud martyrdom holocaust auschwitz caridad charity sacrifice entrega total total self-gift',
  santaangeladefoligno: 'angela foligno conversion conversion arrepentimiento repentance penitencia penance confesion confession humildad humility pobreza poverty contemplacion contemplation crucificado crucified mystic mystica',
  santacoleta:       'coleta corbie colette pobreza poverty reforma reform clarisas poor clares franciscan franciscana austeridad austerity obediencia obedience silencio silence reforma franciscana franciscan reform',
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
  sanfranciscodesales: 'francisco de sales francis de sales obispo bishop doctor church doctor iglesia caridad charity mansedumbre gentleness pensamientos thoughts tentaciones temptations nido nest pureza corazon purity heart vida interior interior life discernimiento discernment ansiedad anxiety escrupulos scruples periodistas journalists escritores writers comunicadores communicators introduccion vida devota introduction to the devout life oracion prayer direccion espiritual spiritual direction',
  santotomasdeaquino: 'tomas de aquino thomas aquinas doctor angelico angelic doctor teologia theology filosofia philosophy razon reason fe faith suma teologica summa theologiae eucaristia eucharist adoracion adoration estudiantes students universidad university estudio study verdad truth claridad doctrinal doctrinal clarity herejias heresies virtud prudencia prudence templanza temperance fortaleza fortitude justicia justice ley natural natural law bien comun common good sacramento sacraments predicadores preachers dominico dominican orden de predicadores order of preachers',
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
  santagema:          'gema gemma galgani lucca toscana tuscany italia italy estigmas stigmata llagas wounds dolor cronico chronic pain espalda back columna spine tuberculosis fibromialgia fibromyalgia mistica mystic pasionistas passionists paralisis paralysis curacion milagrosa miraculous healing joven young muerte death jesus cartas letters sufrimiento suffering dolor sin diagnosis unexplained pain heridas wounds que no cierran non-healing wounds',
  sangerardo:         'gerardo gerard majella redentorista redemptorist embarazo pregnancy madres mothers bebe baby parto childbirth delivery bebes babies recien nacido newborn prematuro premature aborto miscarriage perder bebe losing baby nacimiento birth gestacion gestation alto riesgo high risk patuno hankerchief bilocacion bilocation taumaturgo thaumaturge milagros miracles muro lucano campania materdomini nonproduccion infertility fertilidad fertility parto cesarea c-section',
  santagianna:        'gianna beretta molla medica doctor pediatra pediatrician medico medicina medicine embarazo pregnancy vida nonata unborn life aborto abortion decision sacrifice sacrificio madre mother bebe baby fibroma fibroid utero uterus parto childbirth lombardia lombardy magenta italia italy laica laywoman canonizacion canonization juan pablo john paul bioética bioethics dilema dilemma conciencia conscience carrera vocation sacrificio supremo ultimate sacrifice gianna emanuela jesus amor love',
  sandavidgales:      'david dewi sant gales wales galés welsh celta celtic monje monk obispo bishop arzobispo archbishop pequenas cosas little things simplicidad simplicity austeridad austerity sencillez simpleness agua water pan bread trabajo manual manual work monasterio monastery mynyw st davids pembrokeshire sínodo brevi sinodo brevi gwendolina patrono patron marzo march primero march first canonizado canonized',
  reydavid:           'david rey king profeta prophet salmos psalms salmista psalmist alabanza praise musica music arpa harp belen bethlehem israel juda judah goliat goliath honda sling pastor shepherd ungido anointed samuel natan nathan betsabe bathsheba urias uriah miserere culpa guilt arrepentimiento repentance conversion penitencia penance perdon forgiveness absalon absalom juda judah jerusalen jerusalem arca alliance ark antepasado ancestor jesus hijo de david son of david mesias mesiah biblia bible antiguo testamento old testament salmo 23 salmo 51 salmo 22 liderazgo leadership lider leader fallo failure vuelta retorno regreso a dios return to god corazon heart conforme al corazon de dios man after god own heart',
  santaemma:          'emma gurk carintia carinthia austria duelo grief luto mourning perdida de hijo loss of child hijo muerto dead son madre en duelo grieving mother viuda widow muerte de hijos children death noblewoman noble mujer aristocrata fundadora foundress monasterio monastery catedral cathedral romanico romanesque patrimonio heritage pobres poor generosidad generosity riqueza wealth entregada given away dolor transformado transformed pain acumulacion de perdidas accumulated losses',
  sanismael:          'ismael ishmael gales wales celta celtic obispo bishop monje monk misionero missionary pembrokeshire pembroke dyfed carmarthenshire ferryside st davids mynyw david sobrino nephew discipulo disciple evangelizacion evangelization bretana brittany mar sea atlantico atlantic misionero itinerante itinerant missionary fe celta celtic faith cruz celtica celtic cross trabajo apostolico apostolic work ministerio pequeno small ministry anonimato anonymity fidelidad faithfulness',
  santadelia:         'delia martir martyr cristiana christian primitiva early church fe faith nombre name onomastica name day persecucion persecution anonimato anonymity fidelidad faithfulness iglesia primitiva early church mujer woman luz light roma rome romana roman testimonio testimony comunidad community silencio silence vocacion vocation discreta hidden forgotten olvidada remembered recordada fe invisible invisible faith',
  sanjorge:           'jorge george martir martyr soldado soldier caballero knight dragon england inglaterra cataluna georgia portugal escudo shield cruz roja red cross lanza lance capadocia cappadocia diocleciano diocletian lida lydda roman romano valentia courage justicia justice proteccion protection inocentes innocent perseguidos persecuted scouts fuerzas armadas armed forces batallon battalion guerra war conflicto conflict injusticia injustice',
  santaisabel:        'isabel elizabeth hungria hungary reina queen pobres poor enfermos sick hospital caridad charity franciscana franciscan terciaria tertiary rosas roses pan bread corona crown marburgo marburg andres andrew turingia thuringia wartburg viuda widow canonizacion canonization milagro miracle hambrientos hungry alimentar feed servicio service voluntaria volunteer obras caritativas charitable works trabajadora social social worker enfermera nurse',
  sandaniel:          'daniel profeta prophet babilonia babylon nabucodonosor nebuchadnezzar exilio exile foso leones lions den angel angeles guardian perseverancia perseverance escritura escritos scripture visions visiones sueno dream interpretacion interpretation fe courage valentia mane tekel parsin writing wall escritura pared belsasar belshazzar dario darius hijo hombre son of man mesianico messianic juicio judgment apocalipsis apocalyptic hebreo hebrew joven youth sabiduria wisdom discernimiento discernment',
  sangabriel:         'gabriel arcangel archangel anunciacion annunciation ave maria hail mary mensajero messenger comunicacion communication telecomunicaciones telecommunications periodista journalist misionero missionary evangelizador evangelizer daniel profeta prophet zacariad zechariah encarnacion incarnation virgen maria virgin mary embajador ambassador diplomatico diplomat mensajes messages vocacion vocation fuerza strength gavriel gabriel name nombre arcangeles archangels',
  santaelena:         'elena helena selene emperatriz empress vera cruz true cross santa cruz holy cross tierra santa holy land peregrino pilgrimage jerusalen jerusalem belen bethlehem calvario calvary arqueologia archaeology convertido convert divorcio divorce abandonado abandoned madre madre de un emperador madre del rey reina queen augusto augusto historia history roma rome constantinopla constantinople reliquias relics pasion passion',
  sanjuandiego:       'juan diego cuauhtlatoatzin nahuatl azteca aztec indigena indigenous guadalupe virgen de guadalupe nuestra senora tilma ayate rosas roses tepeyac mexico ciudad de mexico bautismo baptism primer santo americano first american saint pueblo originario native people inculturacion inculturation humildad humility mensajero messenger aparicion apparition juan zumárraga obispo bishop diciembre december axayacatl nombre nahuatl nahuatl name',
  sanalejandro:       'alejandro alexander bergamo bérgamo legion tebana theban legion soldado soldier martir martyr roma rome romano roman diocleciano diocletian mauricio maurice legionario legionary prisionero prisoner angel milagro miracle cadenas chains palma de martir palm of martyr patron patrono defensor del pueblo defender italia italy lombardia lombardy prision prison escapar escape proclamar evangelio proclaim gospel fe faith valor courage fidelidad faithfulness alejandro nombre alexander name',
  sanoliverplunkett:  'oliver plunkett irlanda ireland armagh martir martyr arzobispo archbishop mártires de irlanda ireland martyrs persecucion persecution titus oates tyburn london decapitado hanged drawn quartered papa pope iglesia church paz peace unidad unity primo primate irlanda del norte northern ireland canonizado canonized 1975 pablo vi paul vi oliver nombre oliver name',
  santasilvia:        'silvia sylvia madre mother gregorio gregory el grande the great papa pope doctor iglesia church roma rome romana roman noble viuda widow contemplativa contemplative asceta ascetic san pablo fuori le mura san pablo extramuros familia family santidad holiness crianza rearing educacion education silvia nombre sylvia name',
  santaleticia:       'leticia laetitia alegria joy felicidad happiness virgen virgin martir martyr primitiva iglesia early church persecucion persecution martirologio romano roman martyrology diocleciano diocletian siglo tercero third century nombre leticia laetitia name pascua pasqua easter resurrection',
  sanpedro:           'pedro peter simon simon cefas cephas apostol apostle primer papa first pope pescador fisherman llaves keys reino heaven galilea galilee roma rome crucificado crucified invertida inverted upside down vaticano vatican basilica pescador fisherman pentecostes pentecost milagros miracles tabita tabitha eneas aeneas sombra shadow sanacion healing vicario vicar mision mission unidad unity iglesia church',
  sanfranciscojavier: 'francisco javier francis xavier jesuita jesuit ignacio loyola loyola misionero missionary apostol apostle indias indies japon japan asia goa india bautismo baptism evangelizacion evangelization navarra navarre espana spain canonizado canonized cuerpo incorrupto incorrupt body misiones missions vocacion vocation francisco javier nombre name',
  sanireneolyon:     'ireneo irenaeus lyon lyons obispo bishop doctor iglesia doctor church herejia heresy gnosis gnostico gnostic adversus haereses contra herejias smyrna esmirna policarpo polycarp juan apostol john apostle discipulo disciple galia gaul roma rome mártir martyr 177 persecucion persecution apologeta apologist teologia theology recapitulacion recapitulation anakephalaiosis gloria dei vivens homo gloria dios hombre vivo tradition apostolica apostolic succession unidad unity oriente occidente east west 202 valentino valentinus marcion marcionism encarnacion incarnation creacion creation redencion redemption humanidad humanity cristo christology doctor 2022 francisco francis canonizado padre teologia father theology sistema sistematico systematic',
  sanjuanbautista:   'juan bautista john baptist precursor forerunner cordero lamb ecce agnus dei voz desierto voice wilderness jordan jordán bautismo baptism conversion conversion arrepentimiento repentance desierto desert asceta ascetic pelo camello camel hair langosta locust miel honey zacarías zechariah isabel elizabeth maria visitation visitacion magnificat benedictus nazaret nazareth herodes herod salome herodias maqueron machaerus decapitado beheaded martirio martyrdom cabeza head bandeja platter profeta prophet elias elijah elia elijah juan evangelio gospel niño nacimiento birth natividad nativity seis meses six months jesus cristo christ cordero dios lamb god señalar pointing anuncio annunciation mensaje message bautizar baptize rio river aguas waters espiritu santo holy spirit paloma dove voz cielo voice heaven discipulos disciples andres andrew simon pedro peter mayor nacidos mujer greatest born women mayor que todos greater than all',
  santomamoro:       'tomas moro thomas more tomas morus tudor canciller chancellor lord canciller lord chancellor abogado lawyer derecho law politico politician gobierno government conciencia conscience juramento oath supremacia supremacy enrique viii henry viii iglesia england inglaterra catedral church acta act renuncia resignation torre tower prision prison margaret roper hija daughter humanista humanist erasmo erasmus utopia letrado learned scholar mártir martyr decapitado beheaded cabeza head cadalso scaffold ejecucion execution testimonio falso false testimony richard rich familia family esposo husband padre father laico layman fiel faith integridad integrity rectitud rectitude honradez honesty valentia courage ultimo words ultimas palabras primero dios god first sirviente servant canonizado canonized pio xi pius patrono patron juan pablo ii john paul londoner london chelsea 1535',
  sanluisgonzaga:    'luis gonzaga luigi aloysius jesuita jesuit ignacio loyola juventud youth joven young pureza purity castidad chastity nobleza nobility marques marquis marquesado marquisate renuncia renunciation votos vows hermano brother rodolfo rodolph hereditario heir estudiante student roma rome roberto belarmino robert bellarmine director espiritual spiritual director plaga plague peste epidemic enfermedad disease hospital sick moribundos dying contagio contagion muerte death 23 anos years canonizado canonized patrono patron castiglione mantovano italia italy escolastico scholastic noviciado novitiate azucena lily flor flower penance penitencia virtud virtue contempl contemplation oracion prayer eucaristia eucharist misa mass corte court madrid felipe philip espana spain lombardia lombardy gonzaga familia family titulo title jesuitas jesuits sociedad jesus society of jesus profecia prophecy corpus christi olor santidad odor sanctity',
  sanbarnabes:       'barnabas barnabes barnabe jose joseph chipre cyprus levita levite consolacion consolation aliento encouragement pablo paul saulo saul marcos mark juan evangelista evangelist apostol apostle gentiles gentils antioquía antioch jerusalem damasco damascus primer viaje missionary journey campo field bienes goods comunidad community segunda oportunidad second chance mediador mediator confianza trust conversion misionero mission misericordia mercy acompanamiento accompaniment discipulo disciple pedro peter iglesia primitiva early church salamina salamis reliquias relics evangelio gospel apostolado apostleship diocesis diocese chipriota cypriot',
  sanefren:          'efren efrem ephrem siria syria siriaco syriac arameo aramaic nisibis edessa mesopotamia oriente oriente cristiano christian east doctor iglesia doctor church arpa harp espiritu santo holy spirit himnos hymns poesia poetry poeta poet liturgia liturgy canto singing musica music heresia heresy gnostico gnostic marcion manicheismo manichaeism diacono deacon monje monk asceta ascetic cueva cave exilio exile refugiado refugee peste plague enfermedad disease enfermos sick pobres poor caridad charity misterio mystery encarnacion incarnation navidad christmas resurreccion resurrection bautismo baptism eucaristia eucharist virgen maria virgin mary contemplacion contemplation teologia theology simbolo symbol bello beauty benedictoxv benedict cithara spiritus doctor oriente',
  sanbonifacio:       'bonifacio boniface winfrido winfrid alemania germany germania frisia friesland apostol apostle europa europe evangelizacion evangelization misionero missionary obispo bishop martir martyr encina roble oak thor geismar fulda maguncia mainz anglosajon anglo-saxon monje monk benedicto benedictine nursling devon england inglaterra reforma iglesia reform church carolingios carolingians pipino pepin fracos franks diocesis diocese concilio council primado primate miedo fear valentia courage palabra de dios word of god evangelio gospel martirio martyrdom dokkum bordne paganos pagans conversion conversos convertidos converts mision mission paciencia patience fracaso failure perseverancia perseverance europa cristiana christian europe edad media middle ages breviario breviary escritura scripture liturgia liturgy',
  sancarloslwanga:    'carlos lwanga charles uganda martires martyrs africa jovenes youth valentía courage pureza purity fe bajo presion faith under pressure mwanga fuego fire hoguera stake pajes pages corte real royal court conversion convertidos converts catequista catechist bautismo baptism namugongo padres blancos white fathers buganda kampala canonizados canonized pablo VI paul VI kizito companeros companions africa subsahariana sub-saharan africa presion pressure resistencia resistance dignidad dignity identidad cristiana christian identity',
  santomasapostol:   'tomas thomas didymo didymus gemelo twin apostol apostle duda doubt incredulidad unbelief fe faith señor mio dios mio my lord my god llagas wounds costado side clavos nails resurreccion resurrection resucitado risen juan john evangelio gospel india india kerala malabar cristiano thomas christian misionero missionary evangelizacion evangelization mision mission gondofares gondophares palacio palace pobres poor escuadra carpenter square arquitecto architect constructor builder agrimensor surveyor lanza spear martirio martyrdom mylapore madras chennai reliquia relics edesa edessa ortona testimonio witness india siglo primero first century apostolado apostolate apocrifo apocryphal hechos acts tradicion tradition presencia presence',
  sancarlosacutis:   'carlos acutis carlo acutis joven youth millennial milenio millennium internet eucaristia eucharist hostia host eucaristico eucharistic primera comunion first communion milán milan jesus web website pagina web programacion programming informatica computing tecnologia technology digital redes sociales social media leucemia leukemia cancer enfermedad illness martirio martyrdom ofrecimiento offering canonizado canonized beatificado beatified francisco francis asis assisi cuerpo incorrupto incorrupt body milagro miracle mathaeus rios valentina fidelis costa rica brasil brazil pancreas corazon heart rosario rosary misa mass confesion confession caridad charity pobres poor mendigos homeless bullying acoso patrono patron jovenes young people originales originals fotocopias photocopies puntos points dios god 2025 2020 primer santo primer milenio first saint digital generation generacion digital cielo heaven autopista highway',
  sanbenito:         'benito benedict nursia norcia umbria italia italy ora et labora pray work regla rule monacato monasticism monje monk abad abbot monte cassino montecassino subiaco europa europe patrono patron ermita ermitano hermit silencio silence oracion prayer trabajo work contemplacion contemplation habito habit negro black tonsura tonsure escuadra scholastica escolastica twin gemela corvino raven cuervo caliz calice cup veneno poison medalla medal crux sancti patris maleficios evil protection hospitalidad hospitality huesped guest familia family comunidad community occidente western civilizacion civilization pablo vi paul vi escritura scripture lectio divina liturgia liturgy horas hours opus dei fundador founder hospital escuela school universidad university codex preservacion preservation siglo sexto sixth century 547 480 gregorio gregory magno great dialogos dialogues resurreccion resurrection fuente spring agua water milagro miracle',
  nuestrasenoracarmen: 'virgen carmen carmel carmelo mount carmel monte carmelo escapulario scapular marron brown simon stock prior carmelita carmelite orden order elias elijah nube cloud lluvia rain stella maris estrella del mar star sea marineros sailors proteccion protection manto mantle azul blue contemplacion contemplation silencio silence desierto desert ermitano hermit teresa avila teresa jesus juan de la cruz john of the cross noche oscura dark night alma soul mistica mystic mysticism privilegio sabatino sabbatine purgatorio purgatory muerte death moribundos dying novena procesion procession 16 julio july chile bolivia colombia latinoamerica latin america patrona patroness reina queen madre mother pureza purity amor love consagracion consecration edith stein teresita therese lisieux reforma reform descalzos discalced',
  divinonino:        'divino niño jesus divine child niño dios god child bebe baby manitas manos hands levantadas raised ternura tenderness confianza trust yo reino i reign bogota colombia salesiano salesian padre rizzo juan del rizzo veinte de julio 20 july barrio neighborhood santuario sanctuary peregrinacion pilgrimage colombia latinoamerica exvoto exvote milagro miracle confianza trust fe faith pobres poor humildes humble familias families niños children oracion prayer peticion petition navidad christmas belen bethlehem pesebre manger esperanza hope alegria joy acudir come cerca close pequeno small sencillo simple accesible accessible',
  santamariagoretti:  'maria goretti santa maria goretti saint maria goretti pureza purity castidad chastity juventud youth jovenes adolescents perdon forgiveness reconciliacion reconciliation violencia violence dignidad dignity defensa self defense martir martyr italia italy nettuno corinaldo alessandro serenelli conversion mercy misericordia heridas interiores inner wounds sanacion healing mujeres women ninos children proteccion protection 6 julio july 6',
  preciosisimasangre: 'preciosisima sangre de cristo precious blood of christ sangre blood redencion redemption rescate ransom alianza covenant cordero pascual paschal lamb cruz cross calvario calvary pasion passion misericordia mercy perdon forgiveness pecado sin conversion conversion purificacion purification expiacion atonement reparacion reparation proteccion protection batalla espiritual spiritual warfare tentacion temptation liberacion deliverance san gaspar del bufalo julio july mes de julio month of july adoracion adoration eucaristia eucharist salvacion salvation',
};

// ── FAVORITES (localStorage) ───────────────────────
function getFavs() {
  try { return JSON.parse(localStorage.getItem('tup_favs') || '[]'); } catch { return []; }
}
function toggleFav(id) {
  const favs = getFavs();
  const idx = favs.indexOf(id);
  if (idx === -1) favs.push(id); else favs.splice(idx, 1);
  localStorage.setItem('tup_favs', JSON.stringify(favs));
}

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

  updateFooterVersion();

  // Toggle bilingual prayer blocks
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });

  // Re-render menu items in new language (menu.js listens for this)
  window.dispatchEvent(new CustomEvent('tup:langchange', { detail: lang }));

  // Re-render quick nav labels in new language
  if (window._renderQuickNav) window._renderQuickNav();

  // Update search placeholders (bilingual)
  const _qnSearch = document.getElementById('quickNavSearch');
  if (_qnSearch) _qnSearch.placeholder = i18n[lang].search_placeholder;
  const _cSearch = document.getElementById('cardsSearch');
  if (_cSearch) _cSearch.placeholder = i18n[lang].search_placeholder;

  // If intercessor is loaded, refresh dynamic content
  if (intercessorData) renderIntercessorContent(intercessorData);
}

function updateFooterVersion() {
  document.querySelectorAll('.site-footer p[data-i18n="footer_text"]').forEach(el => {
    const footerText = (i18n[currentLang] && i18n[currentLang].footer_text) || el.textContent || '';
    el.innerHTML = `<span class="footer-copy">${footerText}</span><span class="footer-version">${APP_VERSION}</span>`;
  });
}

// ── FEAST DAY MAP (MM-DD → intercessor IDs) ──────────
const FEAST_DAYS = {
  '01-18': ['santagwendolina'],
  '01-21': ['santaines'],
  '01-24': ['sanfranciscodesales'],
  '01-28': ['santotomasdeaquino'],
  '02-03': ['sanblas'],
  '02-11': ['lourdes'],
  '02-09': ['santaapolonia'],
  '03-01': ['sandavidgales'],
  '03-08': ['sanjuandedios'],
  '03-13': ['santaroxana'],
  '03-19': ['sanjose'],
  '03-22': ['santaleticia'],
  '04-11': ['santagema'],
  '04-19': ['sanexpedito'],
  '04-21': ['santaalejandra'],
  '04-23': ['sanjorge'],
  '04-28': ['santagianna'],
  '04-29': ['santacatalina'],
  '05-01': ['sanperegrino'],
  '05-13': ['fatima'],
  '05-15': ['santadymphna'],
  '05-16': ['sanbrendan'],
  '05-22': ['santarita'],
  '05-24': ['mariaauxiliadora'],
  '05-26': ['sanfelipeneri'],
  '06-03': ['sancarloslwanga'],
  '06-05': ['sanbonifacio'],
  '06-09': ['sanefren'],
  '06-11': ['sanbarnabes'],
  '06-13': ['sanantonio'],
  '06-16': ['sanismael'],
  '06-21': ['sanluisgonzaga'],
  '06-22': ['santomamoro'],
  '06-24': ['sanjuanbautista'],
  '06-25': ['sanguillermo'],
  '06-27': ['perpetuosocorro', 'santaemma'],
  '06-28': ['sanireneolyon'],
  '06-29': ['sanpedro'],
  '07-01': ['preciosisimasangre', 'sanoliverplunkett'],
  '07-03': ['santomasapostol'],
  '07-06': ['santamariagoretti'],
  '07-11': ['sanbenito'],
  '07-16': ['nuestrasenoracarmen'],
  '07-18': ['sancamilo'],
  '07-20': ['divinonino'],
  '07-21': ['sandaniel'],
  '07-24': ['sancharbel'],
  '07-25': ['sancristobal'],
  '07-26': ['santaana'],
  '08-10': ['sanlorenzo'],
  '08-11': ['santaclara'],
  '08-18': ['santaelena'],
  '08-23': ['santarosa'],
  '08-26': ['sanalejandro'],
  '08-27': ['santamonica'],
  '08-28': ['sanagustin'],
  '08-30': ['santadelia'],
  '09-05': ['teresacalcuta'],
  '09-23': ['padrepio'],
  '09-27': ['sanvicente'],
  '09-29': ['sanmiguel', 'sangabriel', 'sanrafael'],
  '10-01': ['santateresita'],
  '10-02': ['angelguarda'],
  '10-04': ['sanfrancisco'],
  '10-12': ['sancarlosacutis'],
  '10-16': ['sangerardo'],
  '10-18': ['schoenstatt'],
  '10-21': ['santacelina'],
  '10-22': ['juanpablo'],
  '10-28': ['sanjudas'],
  '11-02': ['santanoemi'],
  '11-03': ['santasilvia'],
  '11-04': ['sancarlos'],
  '11-17': ['santaisabel'],
  '11-19': ['divinaprovidencia'],
  '12-03': ['sanfranciscojavier'],
  '12-04': ['santabarbara'],
  '12-06': ['sannicolas'],
  '12-09': ['sanjuandiego'],
  '12-12': ['guadalupe'],
  '12-13': ['santalucia'],
  '12-27': ['sanjuanapostol', 'santafabiola'],
  '12-29': ['reydavid'],
};

function normalizeIntercessorSlug(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function resolveIntercessorSlug(rawValue) {
  const normalized = normalizeIntercessorSlug(rawValue);
  if (!normalized) return null;

  const aliasMap = {
    // Most Precious Blood of Christ: common spellings/typos
    preciosisimasangre: 'preciosisimasangre',
    preciosimasangre: 'preciosisimasangre',
    preciosisimasangredecristo: 'preciosisimasangre',
    sangredecristo: 'preciosisimasangre',
    preciosisimasangrecristo: 'preciosisimasangre',
  };

  if (aliasMap[normalized]) return aliasMap[normalized];

  // Defensive fuzzy fallback for Precious Blood URLs/typos
  if (
    normalized.includes('sangre') ||
    normalized.includes('blood') ||
    normalized.includes('precios') ||
    normalized.includes('preciosis') ||
    normalized.includes('preciousblood')
  ) {
    return 'preciosisimasangre';
  }

  const direct = INTERCESSORS.find(i =>
    normalizeIntercessorSlug(i.id) === normalized ||
    normalizeIntercessorSlug(i.subdomain) === normalized
  );

  return direct ? direct.subdomain : normalized;
}

// ── SUBDOMAIN DETECTION ────────────────────────────
function getSubdomain() {
  // Primary: query param ?intercesor=padrepio (GitHub Pages compatible)
  const params = new URLSearchParams(window.location.search);
  const param = params.get('intercesor');
  if (param) return resolveIntercessorSlug(param);

  // Secondary: path format /intercesor/<slug>
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length >= 2 && pathParts[0].toLowerCase() === 'intercesor') {
    return resolveIntercessorSlug(pathParts[1]);
  }

  // Fallback: true subdomain (e.g. padrepio.theuniversalprayer.com)
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3) return resolveIntercessorSlug(parts[0]);
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
  const DATA_VER = '20260708-2';
  const url = `${basePath}${id}.json?v=${DATA_VER}`;
  const resp = await fetch(url, { cache: 'no-store' });
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

  const favs = getFavs();
  const sortedIntercessors = [...INTERCESSORS].sort((a, b) => {
    const aFav = favs.includes(a.id);
    const bFav = favs.includes(b.id);
    if (aFav !== bFav) return aFav ? -1 : 1;
    return a.name[currentLang].localeCompare(b.name[currentLang], currentLang === 'es' ? 'es' : 'en', { sensitivity: 'base' });
  });

  // Fav toggle delegation (before the loop so it's ready when cards render)
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.card-fav-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    toggleFav(btn.dataset.favId);
    btn.classList.toggle('is-fav');
  });

  // Prepare card entrance animation upfront so cards can be appended progressively.
  let io = null;
  let cardAnimIndex = 0;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('card-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
  }

  function decorateCard(card) {
    if (!card) return;
    if (io) {
      card.style.setProperty('--card-delay', `${Math.min(cardAnimIndex, 8) * 55}ms`);
      card.classList.add('card-anim');
      io.observe(card);
      cardAnimIndex += 1;
    }
  }

  function loadAndAppendCard(meta) {
    return loadIntercessorData(meta.id)
      .then(data => {
        const card = buildCard(data, meta);
        decorateCard(card);
        grid.appendChild(card);
      })
      .catch(() => {
        // Skip intercessors whose JSON isn't ready yet
      });
  }

  // Load large intercessor cards only when user scrolls near this section.
  let cardsLoadStarted = false;
  function startCardsLoad() {
    if (cardsLoadStarted) return;
    cardsLoadStarted = true;
    sortedIntercessors.forEach(meta => { loadAndAppendCard(meta); });
  }

  if ('IntersectionObserver' in window) {
    const loadObserver = new IntersectionObserver((entries) => {
      const shouldLoad = entries.some(e => e.isIntersecting);
      if (!shouldLoad) return;
      startCardsLoad();
      loadObserver.disconnect();
    }, { root: null, rootMargin: '240px 0px', threshold: 0.01 });
    loadObserver.observe(grid);
  } else {
    const onScrollLoad = () => {
      const rect = grid.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 240) {
        startCardsLoad();
        window.removeEventListener('scroll', onScrollLoad);
      }
    };
    window.addEventListener('scroll', onScrollLoad, { passive: true });
    onScrollLoad();
  }

  // Normalize removes accents so búsqueda matches busqueda, etc.
  function normalize(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  // Search intercessor cards
  const cardsSearch = document.getElementById('cardsSearch');
  const secretSearchResult = document.getElementById('secretSearchResult');
  const quickSecretSearchResult = document.getElementById('quickSecretSearchResult');

  function normalizeKey(s) {
    return normalize(s).replace(/[^a-z0-9]/g, '');
  }

  const MENU_THEME_RELATIONS = [
    { keywords: ['adoracion', 'adoration', 'eucaristia', 'eucharist'], ids: ['sagradocorazon', 'misericordia', 'fatima', 'santaclara', 'santotomasdeaquino'] },
    { keywords: ['desierto', 'silencio', 'escucha', 'wilderness', 'silence', 'listening'], ids: ['sanjuanbautista', 'sancharbel', 'sanguillermo', 'sanefren', 'sanismael'] },
    { keywords: ['difuntos', 'departed', 'dead', 'souls', 'purgatorio', 'purgatory'], ids: ['preciosisimasangre', 'misericordia', 'sanperegrino', 'sancamilo', 'nuestrasenoracarmen'] },
    { keywords: ['discernimiento', 'discernment', 'call altar', 'llamados', 'vocacion', 'vocation'], ids: ['sanfranciscodesales', 'santotomasdeaquino', 'sangabriel', 'sanagustin', 'santomamoro', 'guadalupe'] },
    { keywords: ['enemigos', 'enemies', 'enemy'], ids: ['sanmiguel', 'sanbenito', 'misericordia', 'santaclara', 'sanoliverplunkett', 'reydavid'] },
    { keywords: ['espiritu santo', 'espiritu', 'holy spirit', 'spirit'], ids: ['espiritu', 'sangabriel', 'sanmiguel', 'sanrafael', 'fatima'] },
    { keywords: ['familia', 'family', 'home', 'hogar'], ids: ['sanjose', 'santamonica', 'santacelina', 'schoenstatt', 'mariaauxiliadora', 'santaana'] },
    { keywords: ['jovenes', 'young', 'youth', 'teen', 'adolescents'], ids: ['sancarlosacutis', 'sanjuanbosco', 'sanluisgonzaga', 'santaines', 'santamariagoretti', 'juanpablo'] },
    { keywords: ['matrimonio', 'marriage', 'pareja', 'couple'], ids: ['sanjose', 'santarita', 'santamonica', 'santacelina', 'santagianna', 'schoenstatt'] },
    { keywords: ['meses', 'devotional months', 'mes devocional'], ids: ['fatima', 'sagradocorazon', 'nuestrasenoracarmen', 'preciosisimasangre', 'guadalupe', 'mariaauxiliadora'] },
    { keywords: ['misericordia', 'mercy', 'forgiveness', 'perdon'], ids: ['misericordia', 'padrepio', 'santafabiola', 'santamonica', 'sanagustin'] },
    { keywords: ['oraciones', 'basic prayers', 'prayers'], ids: ['sanjose', 'angelguarda', 'sanmiguel', 'guadalupe', 'misericordia'] },
    { keywords: ['reconciliacion', 'reconciliation', 'confession', 'confesion'], ids: ['misericordia', 'santamonica', 'sanagustin', 'santarita', 'padrepio', 'providencia'] },
    { keywords: ['rosario', 'rosary'], ids: ['fatima', 'guadalupe', 'perpetuosocorro', 'nuestrasenoracarmen', 'inmaculadocorazon'] },
    { keywords: ['salud', 'health', 'healing', 'sanacion'], ids: ['lourdes', 'sanrafael', 'sanperegrino', 'sancamilo', 'padrepio', 'sancharbel', 'sanblas', 'santaapolonia'] },
  ];

  function getThemeMatchedIds(query) {
    const q = normalize(query || '');
    const matchedIds = new Set();
    if (!q) return matchedIds;

    for (const relation of MENU_THEME_RELATIONS) {
      const matchesTheme = relation.keywords.some(keyword => q.includes(normalize(keyword)));
      if (!matchesTheme) continue;
      relation.ids.forEach(id => matchedIds.add(id));
    }

    return matchedIds;
  }

  const PRIVATE_SEARCH_ENTRIES = [
    {
      key: 'ggh1981',
      href: '/discernimiento/?clave=ggh1981#suenos-privados',
      icon: '/assets/images/private-search/dreams.svg?v=20260710',
      text: {
        es: 'Acceso privado: tus sueños y discernimiento en la gracia de Dios',
        en: 'Private access: your dreams and discernment in God\'s grace',
      },
    },
    {
      key: 'barbarascarlettgomezmichel',
      href: '/privado/barbara/?clave=barbarascarlettgomezmichel',
      icon: '/assets/images/private-search/barbara.svg?v=20260710',
      text: {
        es: 'Mensaje privado para Barbara: amor de papa y caminos buenos',
        en: 'Private message for Barbara: dad\'s love and good paths',
      },
    },
    {
      key: 'fabiolamichellopez',
      href: '/privado/fabiola/?clave=fabiolamichellopez',
      icon: '/assets/images/private-search/fabiola.svg?v=20260710',
      text: {
        es: 'Mensaje privado para Fabiola: amor, oración y gracia matrimonial',
        en: 'Private message for Fabiola: love, prayer and marital grace',
      },
    },
    {
      key: 'brandondavidgomezmichel',
      href: '/privado/brandon/?clave=brandondavidgomezmichel',
      icon: '/assets/images/private-search/brandon.svg?v=20260710',
      text: {
        es: 'Mensaje privado para Brandon: fortaleza, fe y propósito',
        en: 'Private message for Brandon: strength, faith, and purpose',
      },
    },
    {
      key: 'katherinemariannegomezmichel',
      href: '/privado/katherine/?clave=katherinemariannegomezmichel',
      icon: '/assets/images/private-search/katherine.svg?v=20260710',
      text: {
        es: 'Mensaje privado para Katherine: ternura, sabiduría y alegría',
        en: 'Private message for Katherine: tenderness, wisdom, and joy',
      },
    },
    {
      key: 'clarissadahianagomezmichel',
      href: '/privado/clarissa/?clave=clarissadahianagomezmichel',
      icon: '/assets/images/private-search/clarissa.svg?v=20260710',
      text: {
        es: 'Mensaje privado para Clarissa: pureza, bondad y luz',
        en: 'Private message for Clarissa: purity, kindness, and light',
      },
    },
    {
      key: 'ianisaacgomezmichel',
      href: '/privado/ian/?clave=ianisaacgomezmichel',
      icon: '/assets/images/private-search/ian.svg?v=20260710',
      text: {
        es: 'Mensaje privado para Ian: protección, alegría y confianza',
        en: 'Private message for Ian: protection, joy, and trust',
      },
    },
  ].map(entry => ({ ...entry, keyNorm: normalizeKey(entry.key) }));

  function getSecretMatches(q) {
    const qNorm = normalizeKey(q);
    if (!qNorm) return [];
    return PRIVATE_SEARCH_ENTRIES.filter(entry => qNorm.includes(entry.keyNorm));
  }

  function hideAllSaintResults() {
    document.querySelectorAll('.quick-nav-item').forEach(item => { item.style.display = 'none'; });
    grid.querySelectorAll('.intercessor-card').forEach(card => { card.style.display = 'none'; });
  }

  function renderIconHtml(iconPath) {
    return '<img class="secret-result-icon" src="' + iconPath + '" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low">';
  }

  function renderSecretResult(q) {
    const targets = [secretSearchResult, quickSecretSearchResult].filter(Boolean);
    if (!targets.length) return;

    const matches = getSecretMatches(q);
    if (!matches.length) {
      targets.forEach(el => {
        el.style.display = 'none';
        el.innerHTML = '';
      });
      return;
    }

    const html = matches
      .map(entry => '<a href="' + entry.href + '">' + renderIconHtml(entry.icon) + '<span>' + entry.text[currentLang] + '</span></a>')
      .join('<br>');
    targets.forEach(el => {
      el.innerHTML = html;
      el.style.display = '';
    });
  }

  // Search quick nav icons
  const quickNavSearch = document.getElementById('quickNavSearch');
  const MIN_SEARCH_CHARS = 3;

  function shouldRunSearch(query) {
    return query.length >= MIN_SEARCH_CHARS;
  }

  function hideQuickNavResults() {
    document.querySelectorAll('.quick-nav-item').forEach(item => {
      item.style.display = 'none';
    });
  }

  function resetCardResults() {
    grid.querySelectorAll('.intercessor-card').forEach(card => {
      card.style.display = '';
    });
  }

  if (quickNavSearch) {
    quickNavSearch.placeholder = i18n[currentLang].search_placeholder;
    quickNavSearch.addEventListener('input', () => {
      const q = normalize(quickNavSearch.value.trim());
      const themeMatchedIds = getThemeMatchedIds(q);

      if (!shouldRunSearch(q)) {
        hideQuickNavResults();
        renderSecretResult('');
        return;
      }

      document.querySelectorAll('.quick-nav-item').forEach(item => {
        const matchesName = normalize(item.dataset.name).includes(q);
        const matchesSpecialty = normalize(item.dataset.specialty).includes(q);
        const matchesTheme = themeMatchedIds.has(item.dataset.intercessorId);
        item.style.display = (matchesName || matchesSpecialty || matchesTheme) ? '' : 'none';
      });

      if (getSecretMatches(q).length) hideAllSaintResults();
      renderSecretResult(q);
    });

    const initialQ = normalize(quickNavSearch.value.trim());
    if (!shouldRunSearch(initialQ)) {
      hideQuickNavResults();
      renderSecretResult('');
    } else {
      const themeMatchedIds = getThemeMatchedIds(initialQ);
      document.querySelectorAll('.quick-nav-item').forEach(item => {
        const matchesName = normalize(item.dataset.name).includes(initialQ);
        const matchesSpecialty = normalize(item.dataset.specialty).includes(initialQ);
        const matchesTheme = themeMatchedIds.has(item.dataset.intercessorId);
        item.style.display = (matchesName || matchesSpecialty || matchesTheme) ? '' : 'none';
      });
      if (getSecretMatches(initialQ).length) hideAllSaintResults();
      renderSecretResult(initialQ);
    }
  }

  if (cardsSearch) {
    cardsSearch.placeholder = i18n[currentLang].search_placeholder;
    cardsSearch.addEventListener('input', () => {
      const q = normalize(cardsSearch.value.trim());
      const themeMatchedIds = getThemeMatchedIds(q);

      if (!shouldRunSearch(q)) {
        resetCardResults();
        renderSecretResult('');
        return;
      }

      grid.querySelectorAll('.intercessor-card').forEach(card => {
        const matchesText      = normalize(card.textContent).includes(q);
        const matchesSpecialty = normalize(card.dataset.specialty).includes(q);
        const matchesTheme = themeMatchedIds.has(card.dataset.intercessorId);
        card.style.display = (matchesText || matchesSpecialty || matchesTheme) ? '' : 'none';
      });

      if (getSecretMatches(q).length) hideAllSaintResults();
      renderSecretResult(q);
    });

    renderSecretResult(normalize(cardsSearch.value.trim()));
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

    const hasChaplet = hasUsableChaplet(data);
    const btnEs = hasChaplet ? '📿 Rezar la Coronilla ahora' : '🙏 Rezar la Novena ahora';
    const btnEn = hasChaplet ? '📿 Pray the Chaplet now'    : '🙏 Pray the Novena now';

    const descEs = firstSentences(data.history.es, 190);
    const descEn = firstSentences(data.history.en, 190);

    section.innerHTML = `
      <div class="featured-mercy-inner">
        <div class="featured-second-image-wrap">
          <img src="${withAssetVersion(data.image)}" alt="${data.name.es}" class="featured-mercy-img" loading="eager"/>
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
  card.dataset.intercessorId = meta.id;
  if (meta.color) card.style.setProperty('--card-color', meta.color);
  // Store both-language specialty + keyword synonyms for search
  if (meta.specialty) {
    const extraTags = KEYWORD_MAP[meta.id] || '';
    card.dataset.specialty = `${meta.specialty.es || ''} ${meta.specialty.en || ''} ${extraTags}`.toLowerCase();
  }

  const imgHtml = data.image
    ? `<img src="${withAssetVersion(data.image)}" alt="${data.name[lang]}" loading="lazy" />`
    : `<div class="card-image-placeholder">✝</div>`;

  const hasChaplet = hasUsableChaplet(data);
  const hasNovena  = Array.isArray(data.novena?.days) && data.novena.days.length > 0;

  const badges = [];
  if (hasNovena)  badges.push(`<span class="badge">${lang === 'en' ? 'Novena' : 'Novena'}</span>`);
  if (hasChaplet) badges.push(`<span class="badge">${lang === 'en' ? 'Chaplet' : 'Coronilla'}</span>`);

  const specialty = meta.specialty ? meta.specialty[lang] : '';

  const isFav = getFavs().includes(meta.id);
  card.innerHTML = `
    <div class="card-image-wrap">
      ${imgHtml}
      <button class="card-fav-btn${isFav ? ' is-fav' : ''}" data-fav-id="${meta.id}" aria-label="${lang === 'es' ? 'Favorito' : 'Favorite'}">★</button>
    </div>
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

function openIntercessorImageModal() {
  const modal = document.getElementById('intercessorImageModal');
  const modalImg = document.getElementById('intercessorImageModalImg');
  const heroImg = document.getElementById('intercessorImg');
  const shareBtn = document.getElementById('intercessorImageModalShare');
  if (!modal || !modalImg || !heroImg || !heroImg.src) return;

  modalImg.src = heroImg.src;
  modalImg.alt = heroImg.alt || '';
  if (shareBtn) shareBtn.textContent = i18n[currentLang].image_share;
  modal.style.display = 'flex';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

async function shareIntercessorImage() {
  const modal = document.getElementById('intercessorImageModal');
  const modalImg = document.getElementById('intercessorImageModalImg');
  const shareBtn = document.getElementById('intercessorImageModalShare');
  const heroImg = document.getElementById('intercessorImg');
  const intercessorName = document.getElementById('intercessorName');
  if (!modal || !modalImg || !heroImg) return;

  const pageUrl = window.location.href;
  const imageUrl = modalImg.src || heroImg.src;

  async function svgBlobToPngFile(blob, filenameBase) {
    const objectUrl = URL.createObjectURL(blob);
    try {
      const image = new Image();
      image.decoding = 'async';
      image.src = objectUrl;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const width = image.naturalWidth || 1024;
      const height = image.naturalHeight || 1024;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(image, 0, 0, width, height);

      const pngBlob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('PNG conversion failed'));
        }, 'image/png');
      });

      return new File([pngBlob], `${filenameBase}.png`, { type: 'image/png' });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function copyPageUrl() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(pageUrl);
      return;
    }

    const ta = document.createElement('textarea');
    ta.value = pageUrl;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  async function getShareFile(url) {
    const response = await fetch(url, { credentials: 'same-origin' });
    const blob = await response.blob();
    const mimeType = blob.type || 'image/png';
    if (mimeType.includes('svg')) {
      return await svgBlobToPngFile(blob, 'intercessor');
    }

    const extension = mimeType.includes('jpeg') ? 'jpg' : mimeType.split('/').pop() || 'png';
    return new File([blob], `intercessor.${extension}`, { type: mimeType });
  }

  try {
    let shared = false;
    try {
      const shareFile = await getShareFile(imageUrl);
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [shareFile] }))) {
        await navigator.share({ files: [shareFile], title: intercessorName?.textContent || heroImg.alt || document.title, url: pageUrl });
        shared = true;
      }
    } catch {
      // fall through to the page-link fallback below
    }

    if (!shared) {
      await copyPageUrl();
      if (shareBtn) {
        const previous = shareBtn.textContent;
        shareBtn.textContent = i18n[currentLang].image_share_copied;
        setTimeout(() => { shareBtn.textContent = previous || i18n[currentLang].image_share; }, 1400);
      }
    }
  } catch {
    // Ignore cancelled share sheets and copy failures.
  }
}

function closeIntercessorImageModal() {
  const modal = document.getElementById('intercessorImageModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initIntercessorImageZoom() {
  const imgEl = document.getElementById('intercessorImg');
  const modal = document.getElementById('intercessorImageModal');
  const closeBtn = document.getElementById('intercessorImageModalClose');
  const shareBtn = document.getElementById('intercessorImageModalShare');
  if (!imgEl || !modal || !closeBtn || !shareBtn) return;

  imgEl.classList.add('is-zoomable');
  imgEl.setAttribute('role', 'button');
  imgEl.setAttribute('tabindex', '0');
  imgEl.setAttribute('aria-label', i18n[currentLang].image_zoom);
  closeBtn.setAttribute('aria-label', i18n[currentLang].image_zoom_close);
  shareBtn.setAttribute('aria-label', i18n[currentLang].image_share);

  if (imgEl.dataset.zoomWired === '1') return;
  imgEl.dataset.zoomWired = '1';

  imgEl.addEventListener('click', openIntercessorImageModal);
  imgEl.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openIntercessorImageModal();
    }
  });

  shareBtn.addEventListener('click', shareIntercessorImage);
  closeBtn.addEventListener('click', closeIntercessorImageModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeIntercessorImageModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeIntercessorImageModal();
    }
  });
}

// ── QUICK NAV ──────────────────────────────────────
function renderQuickNav() {
  const nav = document.getElementById('quickNav');
  if (!nav) return;
  const hideByDefault = !!document.getElementById('quickNavSearch');

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
    item.dataset.intercessorId = m.id;
    if (hideByDefault) item.style.display = 'none';
    if (m.id === _todayMeta.id) item.classList.add('today-saint');
    item.href = buildIntercessorUrl(m.subdomain);
    if (m.color) item.style.setProperty('--item-color', m.color);

    const circle = document.createElement('div');
    circle.className = 'quick-nav-circle';
    if (m.color) circle.style.backgroundColor = m.color;

    const icon = document.createElement('img');
    icon.className = 'quick-nav-circle-img';
    icon.src = withAssetVersion(`/assets/images/${m.id}.svg`);
    icon.alt = '';
    icon.loading = 'lazy';
    icon.decoding = 'async';
    circle.appendChild(icon);

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
    renderIntercessorContent(intercessorData, knownMeta);
    initTabs(knownMeta);
    initNovena(intercessorData);

    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('intercessorWrapper').style.display = 'block';
  } catch {
    showNotFound();
  }
}

function renderIntercessorContent(data, meta) {
  const lang = currentLang;

  // Page title & meta
  const pageTitle = `${data.name[lang]} | The Universal Prayer`;
  document.title = pageTitle;

  const baseUrl = 'https://www.theuniversalprayer.com';
  const imgUrl  = data.image ? `${baseUrl}${withAssetVersion(data.image)}` : `${baseUrl}${withAssetVersion('/assets/images/misericordia.svg')}`;
  const desc    = data.prayer[lang].substring(0, 150);
  const pageUrl = `${baseUrl}/intercesor/?intercesor=${meta ? meta.subdomain : ''}`;

  const _setMeta = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };
  _setMeta('pageDesc',  'content', desc);
  _setMeta('ogTitle',   'content', pageTitle);
  _setMeta('ogDesc',    'content', desc);
  _setMeta('ogUrl',     'content', pageUrl);
  _setMeta('ogImage',   'content', imgUrl);
  _setMeta('twTitle',   'content', pageTitle);
  _setMeta('twDesc',    'content', desc);
  _setMeta('twImage',   'content', imgUrl);
  _setMeta('canonicalUrl', 'href', pageUrl);
  setIntercessorStructuredData(data, pageUrl, imgUrl, desc, lang);

  // Hero
  const nameEl = document.getElementById('intercessorName');
  if (nameEl) nameEl.textContent = data.name[lang];

  const feastEl = document.getElementById('feastDay');
  if (feastEl) feastEl.textContent = data.feast_day ? data.feast_day[lang] : '';

  const imgEl = document.getElementById('intercessorImg');
  if (imgEl && data.image) {
    imgEl.src = withAssetVersion(data.image);
    imgEl.alt = data.name[lang];
  }
  initIntercessorImageZoom();

  // Optional featured notice shown above tabs
  const noticeWrap = document.getElementById('intercessorNotice');
  const noticeTitleEl = document.getElementById('intercessorNoticeTitle');
  const noticeTextEl = document.getElementById('intercessorNoticeText');
  const noticeMeta = data.special_notice || {};
  const notice = noticeMeta[lang];
  if (noticeWrap) {
    noticeWrap.classList.toggle('is-celebration', !!noticeMeta.celebration);
  }
  if (noticeWrap && noticeTitleEl && noticeTextEl && notice) {
    noticeTitleEl.textContent = notice.title || '';
    noticeTextEl.innerHTML = paragraphify(notice.text || '');
    noticeWrap.style.display = '';
  } else if (noticeWrap) {
    noticeWrap.classList.remove('is-celebration');
    noticeWrap.style.display = 'none';
  }

  // Prayer (shows jaculatoria first when available)
  const prayerEl = document.getElementById('prayerText');
  if (prayerEl) {
    let prayerHtml = '';
    if (data.jaculatoria && data.jaculatoria[lang]) {
      const jacTitle = lang === 'es' ? 'Jaculatoria' : 'Short Prayer';
      const jacText = data.jaculatoria[lang].replace(/\n/g, '<br />');
      const shareLabel = lang === 'es' ? 'Compartir jaculatoria' : 'Share short prayer';
      prayerHtml += `
        <div class="jaculatoria-block">
          <h3>${jacTitle}</h3>
          <p class="short-prayer-text">${jacText}</p>
          <button type="button" class="jaculatoria-share-btn" aria-label="${shareLabel}">${shareLabel}</button>
        </div>
      `;
    }
    prayerHtml += paragraphify(data.prayer[lang]);
    prayerEl.innerHTML = prayerHtml;

    const jacBtn = prayerEl.querySelector('.jaculatoria-share-btn');
    if (jacBtn && data.jaculatoria && data.jaculatoria[lang]) {
      const jacTextPlain = data.jaculatoria[lang];
      jacBtn.addEventListener('click', async () => {
        const shareTitle = lang === 'es' ? `Jaculatoria - ${data.name[lang]}` : `Short Prayer - ${data.name[lang]}`;
        const shareText = `${shareTitle}\n\n${jacTextPlain}`;
        const shareUrl = window.location.href;

        if (navigator.share) {
          try {
            await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
            return;
          } catch {
            // If user cancels native share, do nothing.
            return;
          }
        }

        try {
          const copyText = `${shareText}\n\n${shareUrl}`;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(copyText);
          } else {
            const tmp = document.createElement('textarea');
            tmp.value = copyText;
            tmp.setAttribute('readonly', '');
            tmp.style.position = 'fixed';
            tmp.style.opacity = '0';
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            document.body.removeChild(tmp);
          }

          const previous = jacBtn.textContent;
          jacBtn.textContent = lang === 'es' ? 'Copiado' : 'Copied';
          setTimeout(() => { jacBtn.textContent = previous; }, 1400);
        } catch {
          // Final fallback for restricted environments.
          alert(lang === 'es' ? 'No se pudo compartir la jaculatoria.' : 'Could not share the short prayer.');
        }
      });
    }
  }

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

function setIntercessorStructuredData(data, pageUrl, imgUrl, desc, lang) {
  const scriptEl = document.getElementById('intercessorJsonLd');
  if (!scriptEl || !data || !data.name) return;

  const saint = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: data.name[lang] || data.name.es || data.name.en || 'Intercessor',
      alternateName: [data.name.es, data.name.en].filter(Boolean),
      description: desc,
      image: imgUrl,
      sameAs: [pageUrl]
    },
    name: `${data.name[lang] || data.name.es || data.name.en} | The Universal Prayer`,
    inLanguage: lang,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'The Universal Prayer',
      url: 'https://www.theuniversalprayer.com/'
    }
  };

  scriptEl.textContent = JSON.stringify(saint);
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

  // ── SAN JUDAS TADEO (9 cuentas) ─────────────
  if (id === 'sanjudas') {
    const invocation = { label: L ? 'Invocación al Espíritu Santo' : 'Invocation to the Holy Spirit', text: L
      ? '«Ven, Espíritu Santo, ilumina mi mente y enciende mi corazón.\nSan Judas Tadeo, apóstol que recibiste el fuego de Pentecostés,\nintercede por mí ante Dios Padre.»'
      : '«Come, Holy Spirit, enlighten my mind and inflame my heart.\nSaint Jude Thaddaeus, apostle who received the fire of Pentecost,\nintercede for me before God the Father.»', count: 1, bead: 'none' };
    const bead = { label: '', text: L
      ? 'Reza en esta cuenta:\n\n«San Judas Tadeo, apóstol y mártir,\npatrono de las causas difíciles e imposibles, ruega por mí.»\n\nLuego di: «Jesús, en Ti confío.»\n\n(Añade en silencio tu intención.)'
      : 'Pray on this bead:\n\n«Saint Jude Thaddaeus, apostle and martyr,\npatron of difficult and impossible causes, pray for me.»\n\nThen say: «Jesus, I trust in You.»\n\n(Add your intention in silence.)', count: 1, bead: 'small' };
    const final = { label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Glorioso San Judas Tadeo, tú que eres pariente de Nuestro Señor Jesucristo y que proclamaste Su Evangelio con valentía hasta dar tu propia sangre:\n\nTe presento hoy mi causa. Sé que para Dios no hay nada imposible. Intercede por mí para que, si es Su santa voluntad, me sea concedida esta gracia.\n\nAmén.»'
      : '«Glorious Saint Jude Thaddaeus, relative of Our Lord Jesus Christ, who proclaimed His Gospel with courage until shedding your own blood:\n\nI present my cause to you today. I know that for God nothing is impossible. Intercede for me so that, if it is His holy will, this grace may be granted to me.\n\nAmen.»', count: 1, bead: 'none' };
    const steps = [cruz, invocation];
    for (let i = 1; i <= 9; i++) {
      steps.push({ ...bead, label: L ? `Cuenta ${i} de 9` : `Bead ${i} of 9` });
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

  // ── SAN BENITO (Medalla/Coronilla) ───────────
  if (id === 'sanbenito') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Benito, Padre del monacato occidental y Patrono de Europa:\nPor la señal de tu Santa Medalla y la fuerza de la Santa Cruz,\ndefiéndenos de todo mal, guíanos en la oración y el trabajo,\ny llévanos a la vida eterna. Amén.»'
      : '«Saint Benedict, Father of Western monasticism and Patron of Europe:\nThrough the sign of your Holy Medal and the power of the Holy Cross,\ndefend us from all evil, guide us in prayer and work,\nand lead us to eternal life. Amen.»', count: 1, bead: 'none' };
    const cross = { label: L ? 'Cruz de San Benito' : 'Cross of Saint Benedict', text: L
      ? '«Cruz Santa, sé mi luz.\nNo sea el dragón mi guía.\nVete, Satanás, no me persuadas de cosas vanas.\nMalo es lo que me ofreces; bebe tú mismo el veneno.»\n(C·S·P·B — Cruz del Santo Padre Benito)'
      : '«Holy Cross, be my light.\nLet not the dragon be my guide.\nBegone, Satan, persuade me not with vain things.\nEvil is what you offer; drink that poison yourself.»\n(C·S·P·B — Cross of Holy Father Benedict)', count: 1, bead: 'none' };
    const virtu = L
      ? ['Prudencia', 'Justicia', 'Fortaleza', 'Templanza']
      : ['Prudence', 'Justice', 'Fortitude', 'Temperance'];
    const steps = [cross, opening];
    virtu.forEach(v => {
      steps.push({ label: L ? `${v} · Padre Nuestro` : `${v} · Our Father`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `${v} · Ave Marías` : `${v} · Hail Marys`, text: p.am, count: 10, bead: 'small' });
      steps.push({ label: L ? `${v} · Jaculatoria` : `${v} · Short Prayer`, text: L
        ? `«San Benito, guíame en la virtud de la ${v}. Ruega por nosotros.»`
        : `«Saint Benedict, guide me in the virtue of ${v}. Pray for us.»`, count: 1, bead: 'none' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«San Benito, por la virtud de la Santa Medalla,\ncubre nuestros hogares con la Cruz de Cristo,\naléjanos del maligno y guíanos al descanso eterno de Dios.\nAmén.»'
      : '«Saint Benedict, through the virtue of the Holy Medal,\ncover our homes with the Cross of Christ,\ndrive away the evil one and guide us to the eternal rest of God.\nAmen.»', count: 1, bead: 'none' });
    return steps;
  }

  // ── NUESTRA SEÑORA DEL CARMEN ─────────────────
  if (id === 'nuestrasenoracarmen') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Virgen del Carmen, Estrella del Mar y Reina del Carmelo:\ntú que cubriste con tu Santo Escapulario a los que te buscan,\ncúbrenos también a nosotros con tu manto de protección\ny condúcenos al Corazón de tu Hijo Jesús.»'
      : '«Virgin of Carmel, Star of the Sea and Queen of Carmel:\nyou who covered those who seek you with your Holy Scapular,\ncover us also with your mantle of protection\nand lead us to the Heart of your Son Jesus.»', count: 1, bead: 'none' };
    const misterios = L ? [
      { n: '1°', t: 'La aparición de Nuestra Señora a San Simón Stock y la entrega del Escapulario.' },
      { n: '2°', t: 'El privilegio sabatino: la promesa de liberación del purgatorio el primer sábado.' },
      { n: '3°', t: 'Elías en el Monte Carmelo — la nube pequeña, signo de María y de la lluvia de gracia.' },
      { n: '4°', t: 'La consagración total a María como camino al Corazón de Cristo.' },
    ] : [
      { n: '1st', t: 'The apparition of Our Lady to Saint Simon Stock and the giving of the Scapular.' },
      { n: '2nd', t: 'The Sabbatine Privilege: the promise of liberation from purgatory on the first Saturday.' },
      { n: '3rd', t: 'Elijah on Mount Carmel — the small cloud as a sign of Mary and of grace.' },
      { n: '4th', t: 'Total consecration to Mary as the path to the Heart of Christ.' },
    ];
    const steps = [opening];
    misterios.forEach(m => {
      steps.push({ label: L ? `${m.n} Misterio` : `${m.n} Mystery`, text: m.t, count: 1, bead: 'none' });
      steps.push({ label: L ? `Padre Nuestro · ${m.n}` : `Our Father · ${m.n}`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `Ave María × 10 · ${m.n}` : `Hail Mary × 10 · ${m.n}`, text: p.am, count: 10, bead: 'small' });
      steps.push({ label: L ? `Invocación · ${m.n}` : `Invocation · ${m.n}`, text: L
        ? '«Virgen del Carmen, ruega por nosotros ahora y en la hora de nuestra muerte.»'
        : '«Virgin of Carmel, pray for us now and at the hour of our death.»', count: 1, bead: 'none' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Nuestra Señora del Carmelo:\nQue el Santo Escapulario sea señal de alianza contigo\ny promesa de la vida eterna. Amén.»'
      : '«Our Lady of Carmel:\nMay the Holy Scapular be a sign of covenant with you\nand promise of eternal life. Amen.»', count: 1, bead: 'none' });
    return steps;
  }

  // ── SAN JUAN BAUTISTA (7 Gozos) ───────────────
  if (id === 'sanjuanbautista') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Juan Bautista, voz que clama en el desierto:\ntú que señalaste con el dedo al Cordero de Dios\ny dijiste "es necesario que Él crezca y que yo disminuya",\nenséñame a poner a Cristo en el centro de mi vida.»'
      : '«Saint John the Baptist, voice crying in the desert:\nyou who pointed with your finger to the Lamb of God\nand said "He must increase and I must decrease",\nteach me to place Christ at the center of my life.»', count: 1, bead: 'none' };
    const gozos = L ? [
      { g: '1° Gozo', t: 'Tu concepción milagrosa anunciada al anciano Zacarías.', inv: '«San Juan, gozo de tu padre:\ntrae el gozo de Dios a los que han perdido la esperanza.»' },
      { g: '2° Gozo', t: 'Tu salto de alegría en el vientre de Isabel al escuchar la voz de María.', inv: '«San Juan, que reconociste al Señor antes de nacer:\nayúdanos a reconocerlo en cada momento.»' },
      { g: '3° Gozo', t: 'Tu nacimiento y la recuperación de la voz de tu padre.', inv: '«San Juan, cuya llegada hizo hablar a los mudos:\nque la gracia de Dios abra nuestras bocas para alabarle.»' },
      { g: '4° Gozo', t: 'Tu vida en el desierto como preparación para tu misión.', inv: '«San Juan, hombre del desierto y la oración:\nque yo también aprenda a buscar a Dios en el silencio.»' },
      { g: '5° Gozo', t: 'El bautismo de Jesús en el Jordán y la voz del Padre desde el cielo.', inv: '«San Juan, que viste al Espíritu Santo descender:\nque ese mismo Espíritu renueve mi vida.»' },
      { g: '6° Gozo', t: 'Tu señalamiento del Cordero de Dios que quita el pecado del mundo.', inv: '«San Juan, voz y dedo que señalas a Cristo:\nque yo también lo señale con mi vida entera.»' },
      { g: '7° Gozo', t: 'Tu martirio y tu corona de gloria en el cielo.', inv: '«San Juan, mártir de la verdad:\nda fortaleza a los que sufren por la justicia.»' },
    ] : [
      { g: '1st Joy', t: 'Your miraculous conception announced to the aged Zechariah.', inv: '«Saint John, joy of your father:\nbring the joy of God to those who have lost hope.»' },
      { g: '2nd Joy', t: 'Your leap of joy in Elizabeth\'s womb at the sound of Mary\'s voice.', inv: '«Saint John, who recognized the Lord before birth:\nhelp us to recognize Him in every moment.»' },
      { g: '3rd Joy', t: 'Your birth and the restoration of your father\'s speech.', inv: '«Saint John, whose arrival made the mute speak:\nmay grace open our mouths to praise God.»' },
      { g: '4th Joy', t: 'Your life in the desert as preparation for your mission.', inv: '«Saint John, man of the desert and prayer:\nmay I also learn to seek God in silence.»' },
      { g: '5th Joy', t: 'The baptism of Jesus in the Jordan and the voice of the Father from heaven.', inv: '«Saint John, who saw the Holy Spirit descend:\nmay that same Spirit renew my life.»' },
      { g: '6th Joy', t: 'Your pointing to the Lamb of God who takes away the sin of the world.', inv: '«Saint John, voice and finger pointing to Christ:\nmay I point to Him with my entire life.»' },
      { g: '7th Joy', t: 'Your martyrdom and your crown of glory in heaven.', inv: '«Saint John, martyr of truth:\ngive strength to all who suffer for justice.»' },
    ];
    const steps = [opening];
    gozos.forEach(g => {
      steps.push({ label: g.g, text: g.t, count: 1, bead: 'none' });
      steps.push({ label: L ? `Padre Nuestro · ${g.g}` : `Our Father · ${g.g}`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `Ave María × 7 · ${g.g}` : `Hail Mary × 7 · ${g.g}`, text: p.am, count: 7, bead: 'small' });
      steps.push({ label: L ? `Invocación · ${g.g}` : `Invocation · ${g.g}`, text: g.inv, count: 1, bead: 'none' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«San Juan Bautista, precursor del Señor:\nprepara también nuestros corazones para la venida de Cristo. Amén.»'
      : '«Saint John the Baptist, forerunner of the Lord:\nprepare our hearts also for the coming of Christ. Amen.»', count: 1, bead: 'none' });
    return steps;
  }

  // ── SAN PEREGRINO (9 cuentas para sanación) ───
  if (id === 'sanperegrino') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Peregrino Laziosi, patrono de los enfermos de cáncer y de toda enfermedad grave:\ntú que sufriste la amenaza de la amputación y recibiste sanación milagrosa de Cristo crucificado:\npresenta ante Dios mi enfermedad y mi fe.»'
      : '«Saint Peregrine Laziosi, patron of cancer patients and all who suffer serious illness:\nyou who faced the threat of amputation and received miraculous healing from the crucified Christ:\npresent before God my illness and my faith.»', count: 1, bead: 'none' };
    const petitions = L ? [
      'Por la sanación de mi cuerpo, si es la voluntad de Dios.',
      'Por la paz en mi mente cuando el miedo quiere apoderarse de mí.',
      'Por los médicos, enfermeros y cuidadores que me atienden.',
      'Por mi familia, que también sufre al verme enfermo.',
      'Por los enfermos que no tienen quien ore por ellos.',
      'Por la fortaleza para aceptar el sufrimiento cuando no hay sanación.',
      'Por la gracia de encontrar a Cristo en el hospital, en la cama, en el dolor.',
      'Por una muerte santa cuando llegue la hora, si Dios lo permite.',
      'Por la resurrección gloriosa en la que todo dolor quedará atrás.',
    ] : [
      'For the healing of my body, if it is the will of God.',
      'For peace of mind when fear tries to take hold of me.',
      'For the doctors, nurses, and caregivers who attend to me.',
      'For my family, who also suffers seeing me ill.',
      'For the sick who have no one to pray for them.',
      'For strength to accept suffering when there is no healing.',
      'For the grace to find Christ in the hospital, in bed, in pain.',
      'For a holy death when the hour comes, if God permits.',
      'For the glorious resurrection in which all pain will be left behind.',
    ];
    const steps = [opening];
    petitions.forEach((pet, i) => {
      steps.push({ label: L ? `Petición ${i+1} de 9` : `Petition ${i+1} of 9`, text: pet, count: 1, bead: 'small' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«San Peregrino, que viste el tumor deshacerse en la noche:\nque Cristo, que sanó tu cuerpo, sane también lo que en mí necesita sanar.\nSi no es su voluntad sanar mi cuerpo,\nque sane mi alma y me dé la paz que el mundo no puede dar. Amén.»'
      : '«Saint Peregrine, who saw the tumor disappear overnight:\nmay Christ, who healed your body, heal what in me needs healing.\nIf it is not His will to heal my body,\nmay He heal my soul and grant me the peace the world cannot give. Amen.»', count: 1, bead: 'none' });
    return steps;
  }

  // ── ÁNGEL DE LA GUARDA (9 coros angélicos) ────
  if (id === 'angelguarda') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Ángel de Dios, que eres mi custodio:\npor la gracia del cielo que te fue confiada a ti,\nguárdame, ilumíname, dirígeme y gobiérname. Amén.»'
      : '«Angel of God, my guardian dear:\nto whom God\'s love commits me here,\never this day be at my side,\nto light and guard, to rule and guide. Amen.»', count: 1, bead: 'none' };
    const coros = L ? [
      { c: 'Serafines', inv: '«Por la intercesión de los Serafines y de mi Ángel Custodio:\nque arda en mí el amor de Dios.»' },
      { c: 'Querubines', inv: '«Por la intercesión de los Querubines y de mi Ángel Custodio:\nque conozca y ame la verdad de Dios.»' },
      { c: 'Tronos', inv: '«Por la intercesión de los Tronos y de mi Ángel Custodio:\nque encuentre descanso en la voluntad de Dios.»' },
      { c: 'Dominaciones', inv: '«Por la intercesión de las Dominaciones y de mi Ángel Custodio:\nque ordene toda mi vida según la voluntad de Dios.»' },
      { c: 'Poderes', inv: '«Por la intercesión de los Poderes y de mi Ángel Custodio:\nque sea guardado de todo mal espiritual y corporal.»' },
      { c: 'Virtudes', inv: '«Por la intercesión de las Virtudes y de mi Ángel Custodio:\nque Dios obre en mi vida sus maravillas.»' },
      { c: 'Principados', inv: '«Por la intercesión de los Principados y de mi Ángel Custodio:\nque Dios guíe a mi familia y a mi pueblo.»' },
      { c: 'Arcángeles', inv: '«Por la intercesión de los Arcángeles y de mi Ángel Custodio:\nque Dios me envíe su mensaje de paz y dirección.»' },
      { c: 'Ángeles', inv: '«Ángel Santo de Dios, mi custodio:\nguárdame hoy en el camino y en el sueño,\nen el peligro y en la tentación. Amén.»' },
    ] : [
      { c: 'Seraphim', inv: '«Through the intercession of the Seraphim and my Guardian Angel:\nmay the love of God burn in me.»' },
      { c: 'Cherubim', inv: '«Through the intercession of the Cherubim and my Guardian Angel:\nmay I know and love the truth of God.»' },
      { c: 'Thrones', inv: '«Through the intercession of the Thrones and my Guardian Angel:\nmay I find rest in the will of God.»' },
      { c: 'Dominations', inv: '«Through the intercession of the Dominations and my Guardian Angel:\nmay I order all my life according to the will of God.»' },
      { c: 'Powers', inv: '«Through the intercession of the Powers and my Guardian Angel:\nmay I be guarded from all spiritual and bodily harm.»' },
      { c: 'Virtues', inv: '«Through the intercession of the Virtues and my Guardian Angel:\nmay God work His wonders in my life.»' },
      { c: 'Principalities', inv: '«Through the intercession of the Principalities and my Guardian Angel:\nmay God guide my family and my people.»' },
      { c: 'Archangels', inv: '«Through the intercession of the Archangels and my Guardian Angel:\nmay God send me His message of peace and direction.»' },
      { c: 'Angels', inv: '«Holy Angel of God, my guardian:\nwatch over me today on the road and in sleep,\nin danger and in temptation. Amen.»' },
    ];
    const steps = [opening];
    coros.forEach(c => {
      steps.push({ label: c.c, text: c.inv, count: 1, bead: 'small' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Dios mío, que en tu admirable providencia envías a tus ángeles para que me guarden:\nhaz que yo me apoye siempre en su compañía\ny alcance la alegría de su presencia eterna. Amén.»'
      : '«O God, who in your admirable providence send your angels to guard me:\ngrant that I may always rely on their companionship\nand attain the joy of their eternal presence. Amen.»', count: 1, bead: 'none' });
    return steps;
  }

  // ── SANTA ANA (7 Gozos) ───────────────────────
  if (id === 'santaana') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«Santa Ana, madre de la Virgen María y abuela de Jesucristo:\ntú que esperaste con fe durante años la llegada de un hijo\ny recibiste a la más bendita de las mujeres:\nintercede por todas las madres y mujeres que esperan.»'
      : '«Saint Anne, mother of the Virgin Mary and grandmother of Jesus Christ:\nyou who waited in faith for years for the coming of a child\nand received the most blessed of women:\nintercede for all mothers and women who wait.»', count: 1, bead: 'none' };
    const gozos = L ? [
      { g: '1° Gozo', t: 'Tu matrimonio santo con Joaquín, lleno de amor y fidelidad.', inv: '«Santa Ana, modelo de esposa y madre:\nbendice los matrimonios y familias del mundo.»' },
      { g: '2° Gozo', t: 'El anuncio milagroso de la concepción de María en tu vejez.', inv: '«Santa Ana, que recibiste la promesa de Dios cuando ya no esperabas:\nayuda a los que esperan lo imposible.»' },
      { g: '3° Gozo', t: 'El nacimiento de la Virgen María, llena de gracia desde el primer instante.', inv: '«Santa Ana, madre de la Inmaculada:\nruega por todas las madres en el momento del parto.»' },
      { g: '4° Gozo', t: 'La presentación de María niña en el Templo, consagrada a Dios.', inv: '«Santa Ana, que ofreciste tu hija al Señor:\nque también nosotros sepamos entregar nuestros hijos a Dios.»' },
      { g: '5° Gozo', t: 'La Anunciación, por la que tu hija se convirtió en Madre de Dios.', inv: '«Santa Ana, abuela del Hijo de Dios:\nayúdanos a decir también nuestro "sí" a Dios.»' },
      { g: '6° Gozo', t: 'La Visitación de María a Isabel, fruto de la fe de toda vuestra familia.', inv: '«Santa Ana, raíz de esta gracia:\nhaz que la alegría del Señor rebase también por nuestra familia.»' },
      { g: '7° Gozo', t: 'El nacimiento de Jesús, tu nieto, el Hijo de Dios hecho carne.', inv: '«Santa Ana, que tuviste en tus brazos al Niño Dios:\nruega por todos los niños del mundo y los que aún no han nacido.»' },
    ] : [
      { g: '1st Joy', t: 'Your holy marriage to Joachim, full of love and faithfulness.', inv: '«Saint Anne, model of wife and mother:\nbless the marriages and families of the world.»' },
      { g: '2nd Joy', t: 'The miraculous announcement of Mary\'s conception in your old age.', inv: '«Saint Anne, who received God\'s promise when you no longer hoped:\nhelp those who wait for the impossible.»' },
      { g: '3rd Joy', t: 'The birth of the Virgin Mary, full of grace from the very first instant.', inv: '«Saint Anne, mother of the Immaculate One:\npray for all mothers at the moment of childbirth.»' },
      { g: '4th Joy', t: 'The presentation of the child Mary in the Temple, consecrated to God.', inv: '«Saint Anne, who offered your daughter to the Lord:\nmay we know how to entrust our children to God.»' },
      { g: '5th Joy', t: 'The Annunciation, by which your daughter became Mother of God.', inv: '«Saint Anne, grandmother of the Son of God:\nmay we also say our yes to God.»' },
      { g: '6th Joy', t: 'The Visitation of Mary to Elizabeth, fruit of the faith of your family.', inv: '«Saint Anne, root of all this grace:\nmay the joy of the Lord overflow in our family as well.»' },
      { g: '7th Joy', t: 'The birth of Jesus, your grandson, the Son of God made flesh.', inv: '«Saint Anne, who held the God-Child in your arms:\npray for all children in the world and for those not yet born.»' },
    ];
    const steps = [opening];
    gozos.forEach(g => {
      steps.push({ label: g.g, text: g.t, count: 1, bead: 'none' });
      steps.push({ label: L ? `Padre Nuestro · ${g.g}` : `Our Father · ${g.g}`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `Ave María × 7 · ${g.g}` : `Hail Mary × 7 · ${g.g}`, text: p.am, count: 7, bead: 'small' });
      steps.push({ label: L ? `Invocación · ${g.g}` : `Invocation · ${g.g}`, text: g.inv, count: 1, bead: 'none' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«Santa Ana, abuela de Dios:\nque tu intercesión alcance para nosotros una familia santa\ny la alegría del Cielo donde ya contemplas a tu nieto Jesús. Amén.»'
      : '«Saint Anne, grandmother of God:\nmay your intercession obtain for us a holy family\nand the joy of Heaven where you already behold your grandson Jesus. Amen.»', count: 1, bead: 'none' });
    return steps;
  }

  // ── SAN FRANCISCO JAVIER (5 continentes) ──────
  if (id === 'sanfranciscojavier') {
    const opening = { label: L ? 'Oración Inicial' : 'Opening Prayer', text: L
      ? '«San Francisco Javier, Apóstol de las Indias y Patrono de las Misiones:\ntú que bautizaste a más de un millón de personas en doce años\ny moriste señalando hacia China con el nombre de Jesús en los labios:\nenciende en nosotros el fuego misionero que ardía en ti.»'
      : '«Saint Francis Xavier, Apostle of the Indies and Patron of Missions:\nyou who baptized more than one million people in twelve years\nand died pointing toward China with the name of Jesus on your lips:\nkindly kindle in us the missionary fire that burned in you.»', count: 1, bead: 'none' };
    const continentes = L ? [
      { c: 'Europa', inv: '«San Francisco Javier, que saliste de Navarra para cambiar el mundo:\nque los bautizados de Europa no olviden su misión.»' },
      { c: 'África', inv: '«San Francisco Javier, que pasaste por Mozambique:\nque el Evangelio siga llegando a toda África.»' },
      { c: 'Asia', inv: '«San Francisco Javier, que evangelizaste India y Japón y soñaste con China:\nruega por todos los misioneros que hoy trabajan en Asia.»' },
      { c: 'América', inv: '«San Francisco Javier, compañero de Ignacio de Loyola:\nque la fe de América Latina siga ardiendo en el mundo.»' },
      { c: L ? 'El mundo entero' : 'The whole world', inv: L ? '«San Francisco Javier, apóstol universal:\nruega para que toda la humanidad llegue a conocer a Cristo.»' : '«Saint Francis Xavier, universal apostle:\npray that all humanity may come to know Christ.»' },
    ] : [
      { c: 'Europe', inv: '«Saint Francis Xavier, who left Navarre to change the world:\nmay the baptized of Europe not forget their mission.»' },
      { c: 'Africa', inv: '«Saint Francis Xavier, who passed through Mozambique:\nmay the Gospel continue reaching all of Africa.»' },
      { c: 'Asia', inv: '«Saint Francis Xavier, who evangelized India and Japan and dreamed of China:\npray for all missionaries working in Asia today.»' },
      { c: 'America', inv: '«Saint Francis Xavier, companion of Ignatius of Loyola:\nmay the faith of Latin America continue burning in the world.»' },
      { c: 'The whole world', inv: '«Saint Francis Xavier, universal apostle:\npray that all humanity may come to know Christ.»' },
    ];
    const steps = [opening];
    continentes.forEach(c => {
      steps.push({ label: L ? `Misiones en ${c.c}` : `Missions in ${c.c}`, text: L ? `Oramos por las misiones en ${c.c}` : `We pray for missions in ${c.c}`, count: 1, bead: 'none' });
      steps.push({ label: L ? `Padre Nuestro · ${c.c}` : `Our Father · ${c.c}`, text: p.pn, count: 1, bead: 'large' });
      steps.push({ label: L ? `Ave María × 10 · ${c.c}` : `Hail Mary × 10 · ${c.c}`, text: p.am, count: 10, bead: 'small' });
      steps.push({ label: L ? `Invocación · ${c.c}` : `Invocation · ${c.c}`, text: c.inv, count: 1, bead: 'none' });
    });
    steps.push({ label: L ? 'Oración Final' : 'Closing Prayer', text: L
      ? '«San Francisco Javier, que moriste mirando hacia China con el nombre de Jesús en los labios:\nque todos los misioneros de hoy tengan tu valentía,\ntu amor por las almas y tu confianza absoluta en Dios. Amén.»'
      : '«Saint Francis Xavier, who died gazing toward China with the name of Jesus on your lips:\nmay all missionaries today have your courage,\nyour love for souls, and your absolute trust in God. Amen.»', count: 1, bead: 'none' });
    return steps;
  }

  return [];
}

function getChapletTextForLang(data, lang) {
  if (!data || !data.chaplet) return '';
  const value = data.chaplet[lang];
  if (typeof value !== 'string') return '';
  return value.trim();
}

function hasUsableChaplet(data) {
  if (!data) return false;
  if (getChapletTextForLang(data, 'es') || getChapletTextForLang(data, 'en')) return true;
  return getChapletSteps(data.id, 'es').length > 0 || getChapletSteps(data.id, 'en').length > 0;
}

function initChapletPlayer(data) {
  const player    = document.getElementById('chapletPlayer');
  const noChaplet = document.getElementById('noChaplet');
  if (!player || !noChaplet) return;

  const inlineText = getChapletTextForLang(data, currentLang)
    || getChapletTextForLang(data, currentLang === 'es' ? 'en' : 'es');

  chapletSteps = getChapletSteps(data.id, currentLang);
  if (chapletSteps.length === 0 && inlineText) {
    chapletSteps = [{
      label: currentLang === 'es' ? 'Coronilla' : 'Chaplet',
      text: inlineText,
      count: 1,
      bead: 'none',
    }];
  }

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

  const chapletText = getChapletTextForLang(data, lang);
  if (chapletText) {
    const chapletTitle = `${data.name[lang]} — ${t.chaplet_lbl}`;
    html += '<hr class="support-prayer-divider">'
      + `<div class="support-prayer support-chaplet">`
      + `<div class="support-prayer-title">${chapletTitle}</div>`
      + `<div class="support-prayer-text">${paragraphify(chapletText)}</div>`
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
  if (chapletBtn && hasUsableChaplet(intercessorData))
    chapletBtn.classList.add('visible');

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
  if (imgEl) { imgEl.src = withAssetVersion(data.image) || ''; imgEl.alt = data.name[lang]; }

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
  // Delegate to shared menu.js if loaded, otherwise fall back to inline init
  if (window.initSiteMenu) { window.initSiteMenu(); return; }
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
    const _fWrap    = document.getElementById('featuredTodayWrap');
    const _fEs      = document.getElementById('featuredTodayNameEs');
    const _fEn      = document.getElementById('featuredTodayNameEn');
    const _fLink    = document.getElementById('featuredTodayLink');
    const _labelEs  = _pill ? _pill.querySelector('.htp-label[data-lang="es"]') : null;
    const _labelEn  = _pill ? _pill.querySelector('.htp-label[data-lang="en"]') : null;
    if (_pill && _nameEs && _nameEn && _todayLnk) {
      const _now = new Date();
      const _key = `${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;
      const _ids = FEAST_DAYS[_key];
      if (_ids && _ids.length) {
        const _feast = INTERCESSORS.find(i => i.id === _ids[0]);
        if (_feast) {
          let _extraEs = '', _extraEn = '';
          if (_ids.length > 1) {
            const _extras = _ids.slice(1).map(id => INTERCESSORS.find(i => i.id === id)).filter(Boolean);
            _extraEs = ' · ' + _extras.map(i => i.short.es).join(' · ');
            _extraEn = ' · ' + _extras.map(i => i.short.en).join(' · ');
          }
          if (_labelEs) _labelEs.textContent = '✦ Fiesta de hoy:';
          if (_labelEn) _labelEn.textContent = '✦ Feast day:';
          _nameEs.textContent = _feast.name.es + _extraEs;
          _nameEn.textContent = _feast.name.en + _extraEn;
          _todayLnk.href = buildIntercessorUrl(_feast.subdomain);
          _pill.style.display = 'flex';
          _pill.classList.add('htp-feast');
          if (_fWrap && _fEs && _fEn && _fLink) {
            _fEs.textContent = _feast.name.es + _extraEs;
            _fEn.textContent = _feast.name.en + _extraEn;
            _fLink.href = buildIntercessorUrl(_feast.subdomain);
            _fWrap.style.display = '';
          }
        }
      } else {
        const _cands = INTERCESSORS.filter(i => i.id !== 'misericordia');
        const _today = _cands[Math.floor(Date.now() / 86400000) % _cands.length];
        _nameEs.textContent = _today.name.es;
        _nameEn.textContent = _today.name.en;
        _todayLnk.href = buildIntercessorUrl(_today.subdomain);
        _pill.style.display = 'flex';
        if (_fWrap && _fEs && _fEn && _fLink) {
          _fEs.textContent = _today.name.es;
          _fEn.textContent = _today.name.en;
          _fLink.href = buildIntercessorUrl(_today.subdomain);
          _fWrap.style.display = '';
        }
      }
    }
  }
})();
