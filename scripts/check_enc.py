import json, os

os.chdir(r'c:\Users\ggh19\Documents\theuniversalprayer\data')

files = ['schoenstatt.json', 'santafabiola.json', 'santaclara.json']
for f in files:
    raw = open(f, 'rb').read()
    bom = 'BOM' if raw[:3] == b'\xef\xbb\xbf' else 'no-BOM'
    bad = 'DOUBLE-ENC' if b'\xc3\xa2' in raw else 'OK'
    print(f, bom, bad)
