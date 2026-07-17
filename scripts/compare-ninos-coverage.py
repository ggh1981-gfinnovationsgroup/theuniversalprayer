#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
main = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")
start = main.index("const INTERCESSORS = [")
end = main.index("];", start) + 2
block = main[start:end]
inter = re.findall(r"id: '([^']+)'", block)
names = {}
for m in re.finditer(
    r"id: '([^']+)'[^}]+name: \{ en: '([^']+)',[^}]+es: '([^']+)'", block
):
    names[m.group(1)] = {"en": m.group(2), "es": m.group(3)}

cuentos = json.loads((ROOT / "data/ninos-cuentos.json").read_text(encoding="utf-8"))["cuentos"]
covered = {c["saintId"] for c in cuentos}
missing = [i for i in inter if i not in covered]
extra = sorted(covered - set(inter))

print(f"Intercesores en sitio: {len(inter)}")
print(f"Cuentos en /ninos/: {len(cuentos)}")
print(f"Intercesores CON cuento: {len(inter) - len(missing)}")
print(f"Intercesores SIN cuento: {len(missing)}")
print()
for i in missing:
    n = names.get(i, {})
    print(f"  - {n.get('es', i)} ({i})")
if extra:
    print()
    print("Cuentos con saintId no listado en INTERCESSORS:")
    for e in extra:
        print(f"  - {e}")
