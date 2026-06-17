import json, os

os.chdir(r'c:\Users\ggh19\Documents\theuniversalprayer\data')

updates = {
  'sanjuanapostol': {
    'es': (
        'Cada día de la novena:\n'
        '1. Reza 3 Padre Nuestros, 3 Ave Marías y 3 Glorias.\n'
        '2. Lee la meditación del día.\n'
        '3. Reza la Oración a San Juan Apóstol y Evangelista:\n'
        '«Oh glorioso San Juan, apóstol amado de Jesucristo, que reclinaste tu cabeza\n'
        'sobre el pecho del Salvador en la Última Cena y recibiste a María como madre\n'
        'al pie de la Cruz, intercede por nosotros ante el Dios de amor que tú anunciaste.\n'
        'Enséñanos a amar como Jesús amó: sin medida, sin condición y hasta el extremo.\n'
        'Que tu Evangelio alumbre nuestra mente y tu ejemplo encienda nuestro corazón. Amén.»\n'
        '4. Formula tu intención personal.'
    ),
    'en': (
        'Each day of the novena:\n'
        '1. Pray 3 Our Fathers, 3 Hail Marys, and 3 Glorias.\n'
        '2. Read the day\'s meditation.\n'
        '3. Pray the Prayer to Saint John the Apostle and Evangelist:\n'
        '"O glorious Saint John, beloved apostle of Jesus Christ, who rested your head\n'
        'upon the Savior\'s breast at the Last Supper and received Mary as your mother\n'
        'at the foot of the Cross, intercede for us before the God of love you proclaimed.\n'
        'Teach us to love as Jesus loved — without measure, without condition, and to the end.\n'
        'May your Gospel enlighten our minds and your example set our hearts on fire. Amen."\n'
        '4. State your personal intention.'
    )
  },
  'sagradocorazon': {
    'es': (
        'Esta novena sigue la tradición de las Doce Promesas reveladas por Jesús\n'
        'a Santa Margarita María Alacoque. Cada día:\n\n'
        '1. Reza 1 Padre Nuestro, 1 Ave María y 1 Gloria.\n'
        '2. Lee la meditación del día.\n'
        '3. Reza el Acto de Consagración al Sagrado Corazón de Jesús:\n'
        '«Oh dulcísimo Jesús, que derramaste Tu Sangre Preciosa en la Cruz por amor a nosotros\n'
        'y cuyo Corazón arde en llamas de amor por los hombres, yo N.N. me consagro y entrego\n'
        'totalmente a Tu Sagrado Corazón. Acepta este acto de consagración y haz que cada latido\n'
        'de mi corazón repita para siempre: "Sagrado Corazón de Jesús, en Vos confío." Amén.»\n\n'
        '4. Concluye con la jaculatoria 3 veces:\n'
        '«Sagrado Corazón de Jesús, en Vos confío.»\n\n'
        'PROMESAS DEL SAGRADO CORAZÓN (recuerda la del día correspondiente):\n'
        'Jesús prometió a Santa Margarita: paz en sus familias, consuelo en sus penas,\n'
        'refugio en la vida y en la agonía, fervor para los tibios, conversión para los pecadores,\n'
        'y —para quien comulgue nueve primeros viernes consecutivos— la gracia de la perseverancia\n'
        'final y no morir sin los sacramentos.'
    ),
    'en': (
        'This novena follows the tradition of the Twelve Promises revealed by Jesus\n'
        'to Saint Margaret Mary Alacoque. Each day:\n\n'
        '1. Pray 1 Our Father, 1 Hail Mary, and 1 Gloria.\n'
        '2. Read the day\'s meditation.\n'
        '3. Pray the Act of Consecration to the Sacred Heart of Jesus:\n'
        '"O most sweet Jesus, who shed Your Precious Blood on the Cross for love of us\n'
        'and whose Heart burns with love for mankind, I N.N. consecrate and surrender\n'
        'myself entirely to Your Sacred Heart. Accept this act of consecration and let\n'
        'every beat of my heart repeat forever: \'Sacred Heart of Jesus, in You I trust.\' Amen."\n\n'
        '4. Close with the aspiration 3 times:\n'
        '"Sacred Heart of Jesus, in You I trust."\n\n'
        'PROMISES OF THE SACRED HEART (recall the one for the day):\n'
        'Jesus promised Saint Margaret Mary: peace in their families, consolation in troubles,\n'
        'refuge in life and in agony, fervor for the lukewarm, conversion for sinners,\n'
        'and — for those who receive Communion on nine consecutive First Fridays — the grace\n'
        'of final perseverance and not dying without the sacraments.'
    )
  }
}

for fname, np in updates.items():
    path = f'{fname}.json'
    d = json.load(open(path, encoding='utf-8'))
    d['novena_prayers'] = np
    # Keep novena_prayers just before novena key
    if 'novena' in d:
        keys = list(d.keys())
        keys.remove('novena_prayers')
        idx = keys.index('novena')
        keys.insert(idx, 'novena_prayers')
        d = {k: d[k] for k in keys}
    open(path, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2))
    print(f'Updated: {path}')
