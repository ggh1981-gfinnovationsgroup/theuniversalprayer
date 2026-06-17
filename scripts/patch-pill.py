import pathlib

p = pathlib.Path('assets/js/main.js')
txt = p.read_text(encoding='utf-8')

OLD = (
    "  if (!isIntercessorPage()) {\n"
    "    const _pill     = document.getElementById('heroTodayPill');\n"
    "    const _nameEs   = document.getElementById('heroTodayNameEs');\n"
    "    const _nameEn   = document.getElementById('heroTodayNameEn');\n"
    "    const _todayLnk = document.getElementById('heroTodayLink');\n"
    "    if (_pill && _nameEs && _nameEn && _todayLnk) {\n"
    "      const _cands = INTERCESSORS.filter(i => i.id !== 'misericordia');\n"
    "      const _today = _cands[Math.floor(Date.now() / 86400000) % _cands.length];\n"
    "      _nameEs.textContent = _today.name.es;\n"
    "      _nameEn.textContent = _today.name.en;\n"
    "      _todayLnk.href = buildIntercessorUrl(_today.subdomain);\n"
    "      _pill.style.display = 'flex';\n"
    "    }\n"
    "  }"
)

NEW = (
    "  if (!isIntercessorPage()) {\n"
    "    const _pill     = document.getElementById('heroTodayPill');\n"
    "    const _nameEs   = document.getElementById('heroTodayNameEs');\n"
    "    const _nameEn   = document.getElementById('heroTodayNameEn');\n"
    "    const _todayLnk = document.getElementById('heroTodayLink');\n"
    "    const _labelEs  = _pill ? _pill.querySelector('.htp-label[data-lang=\"es\"]') : null;\n"
    "    const _labelEn  = _pill ? _pill.querySelector('.htp-label[data-lang=\"en\"]') : null;\n"
    "    if (_pill && _nameEs && _nameEn && _todayLnk) {\n"
    "      const _now = new Date();\n"
    "      const _key = `${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;\n"
    "      const _ids = FEAST_DAYS[_key];\n"
    "      if (_ids && _ids.length) {\n"
    "        const _feast = INTERCESSORS.find(i => i.id === _ids[0]);\n"
    "        if (_feast) {\n"
    "          let _extraEs = '', _extraEn = '';\n"
    "          if (_ids.length > 1) {\n"
    "            const _extras = _ids.slice(1).map(id => INTERCESSORS.find(i => i.id === id)).filter(Boolean);\n"
    "            _extraEs = ' \u00b7 ' + _extras.map(i => i.short.es).join(' \u00b7 ');\n"
    "            _extraEn = ' \u00b7 ' + _extras.map(i => i.short.en).join(' \u00b7 ');\n"
    "          }\n"
    "          if (_labelEs) _labelEs.textContent = '\u2726 Fiesta de hoy:';\n"
    "          if (_labelEn) _labelEn.textContent = '\u2726 Feast day:';\n"
    "          _nameEs.textContent = _feast.name.es + _extraEs;\n"
    "          _nameEn.textContent = _feast.name.en + _extraEn;\n"
    "          _todayLnk.href = buildIntercessorUrl(_feast.subdomain);\n"
    "          _pill.style.display = 'flex';\n"
    "          _pill.classList.add('htp-feast');\n"
    "        }\n"
    "      } else {\n"
    "        const _cands = INTERCESSORS.filter(i => i.id !== 'misericordia');\n"
    "        const _today = _cands[Math.floor(Date.now() / 86400000) % _cands.length];\n"
    "        _nameEs.textContent = _today.name.es;\n"
    "        _nameEn.textContent = _today.name.en;\n"
    "        _todayLnk.href = buildIntercessorUrl(_today.subdomain);\n"
    "        _pill.style.display = 'flex';\n"
    "      }\n"
    "    }\n"
    "  }"
)

if OLD in txt:
    p.write_text(txt.replace(OLD, NEW, 1), encoding='utf-8')
    print('OK replaced')
else:
    print('NOT FOUND')
    idx = txt.find('heroTodayPill')
    print(repr(txt[idx-60:idx+300]))
