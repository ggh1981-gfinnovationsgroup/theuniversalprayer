import glob, os

os.chdir(r'c:\Users\ggh19\Documents\theuniversalprayer\data')

found_files = []
for f in glob.glob('*.json'):
    raw = open(f, 'rb').read()
    text_latin1 = raw.decode('latin-1')
    if 'â€' in text_latin1:
        found_files.append(f)
        idx = text_latin1.find('â€')
        print(f'{f}: â€ at pos {idx}: ...{text_latin1[max(0,idx-30):idx+30]}...')

if not found_files:
    print('No double-encoded characters found in any JSON.')
