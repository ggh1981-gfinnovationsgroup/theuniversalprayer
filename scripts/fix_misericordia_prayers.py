import json, re, os

os.chdir(r'c:\Users\ggh19\Documents\theuniversalprayer\data')

prayers = {
  'misericordia': {
    'es': (
        'Esta es la novena de la Divina Misericordia revelada a Santa Faustina.\n\n'
        'ORACIÓN DE INICIO (cada día):\n'
        '«Expiraste, Jesús, pero la fuente de vida manó para las almas y se abrió\n'
        'el océano de misericordia para todo el mundo entero. Oh fuente de la Vida,\n'
        'Misericordia Divina insondable, abraza al mundo entero y derrámate sobre nosotros.»\n\n'
        'Luego 3 veces:\n'
        '«Oh Sangre y Agua, que brotaste del Corazón de Jesús como fuente de misericordia\n'
        'para nosotros, en Ti confío.»\n\n'
        'CORONILLA DE LA DIVINA MISERICORDIA:\n'
        'Comienza con 1 Padre Nuestro, 1 Ave María y el Credo.\n'
        '— En las cuentas del Padre Nuestro: «Eterno Padre, te ofrezco el Cuerpo y la Sangre,\n'
        'el Alma y la Divinidad de Tu amadísimo Hijo, Nuestro Señor Jesucristo, en expiación\n'
        'de nuestros pecados y los del mundo entero.»\n'
        '— En las cuentas del Ave María (10 veces): «Por Su dolorosa Pasión, ten misericordia\n'
        'de nosotros y del mundo entero.»\n'
        '— Al final (3 veces): «Santo Dios, Santo Fuerte, Santo Inmortal, ten piedad de\n'
        'nosotros y del mundo entero.»\n\n'
        'ORACIÓN FINAL:\n'
        '«Eterno Dios, en quien la misericordia es infinita y el tesoro de compasión inagotable,\n'
        'mira con bondad a nosotros y aumenta Tu misericordia en nosotros para que en momentos\n'
        'difíciles no nos desesperemos ni nos desanimemos, sino que con gran confianza nos\n'
        'sometamos a Tu santa voluntad, que es el Amor y la Misericordia misma. Amén.»\n\n'
        'Luego lee la meditación del día y reza 3 veces: «Jesús, en Ti confío.»'
    ),
    'en': (
        'This is the Novena of Divine Mercy as revealed to Saint Faustina.\n\n'
        'OPENING PRAYER (each day):\n'
        '"You expired, Jesus, but the source of life gushed forth for souls,\n'
        'and the ocean of mercy opened up for the whole world. O Fount of Life,\n'
        'unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us."\n\n'
        'Then 3 times:\n'
        '"O Blood and Water, which gushed forth from the Heart of Jesus as a fount\n'
        'of mercy for us, I trust in You."\n\n'
        'CHAPLET OF DIVINE MERCY:\n'
        'Begin with 1 Our Father, 1 Hail Mary, and the Apostles\' Creed.\n'
        '— On the Our Father beads: "Eternal Father, I offer You the Body and Blood,\n'
        'Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ,\n'
        'in atonement for our sins and those of the whole world."\n'
        '— On the Hail Mary beads (10 times): "For the sake of His sorrowful Passion,\n'
        'have mercy on us and on the whole world."\n'
        '— At the end (3 times): "Holy God, Holy Mighty One, Holy Immortal One,\n'
        'have mercy on us and on the whole world."\n\n'
        'CLOSING PRAYER:\n'
        '"Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible,\n'
        'look kindly upon us and increase Your mercy in us so that in difficult moments\n'
        'we might not despair nor become despondent, but with great confidence submit\n'
        'ourselves to Your holy will, which is Love and Mercy itself. Amen."\n\n'
        'Then read the day\'s meditation and pray 3 times: "Jesus, I trust in You."'
    )
  }
}

for fname, np in prayers.items():
    path = f'{fname}.json'
    d = json.load(open(path, encoding='utf-8'))
    d['novena_prayers'] = np
    # Reorder: novena_prayers just before novena
    if 'novena' in d:
        keys = list(d.keys())
        keys.remove('novena_prayers')
        idx = keys.index('novena')
        keys.insert(idx, 'novena_prayers')
        d = {k: d[k] for k in keys}
    open(path, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2))
    print(f'Updated: {path}')
