#!/usr/bin/env python3
"""Audit and fix intercessor JSON: miracles, consecration."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MAIN = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")
start = MAIN.index("const INTERCESSORS = [")
end = MAIN.index("];", start) + 2
block = MAIN[start:end]
INTER = re.findall(r"id: '([^']+)'", block)

# Only these have official Church-promoted consecration formulas (not personal devotions to saints)
OFFICIAL_CONSECRATION = {
    "sagradocorazon",
    "inmaculadocorazon",
    "fatima",
}

MIRACLE_TEMPLATE_ES = """1. INTERCESIÓN EN LA VIDA DE LOS FIELES
A lo largo de los siglos, muchos creyentes han acudido a {name_es} en momentos de prueba. En oración silenciosa, en novenas y en peregrinaciones, han experimentado consuelo, conversión y auxilio inesperado. La Iglesia recuerda que la santidad no siempre se manifiesta con prodigios espectaculares, sino con obras de amor fieles al Evangelio.

2. TESTIMONIOS DE GRACIA Y CONVERSIÓN
En distintas épocas y lugares, se han relatado favores espirituales: reconciliaciones familiares, fortaleza en la enfermedad, claridad en decisiones difíciles y regreso a la fe. Estos frutos, aunque humildes, son signos de que Dios escucha la oración de quienes confían en sus santos.

3. UN MODELO PARA HOY
{name_es} nos enseña que la vida cristiana se construye con pasos pequeños y fieles. Su ejemplo invita a los niños y a los adultos a imitar una virtud concreta cada día, confiando en que el Señor acompaña a quienes le buscan con corazón sincero."""

MIRACLE_TEMPLATE_EN = """1. INTERCESSION IN THE LIVES OF THE FAITHFUL
Through the centuries, many believers have turned to {name_en} in times of trial. In silent prayer, novenas, and pilgrimages, they have experienced consolation, conversion, and unexpected help. The Church recalls that holiness is not always shown through spectacular wonders, but through works of love faithful to the Gospel.

2. TESTIMONIES OF GRACE AND CONVERSION
In different times and places, spiritual favors have been reported: family reconciliations, strength in illness, clarity in hard decisions, and return to faith. These humble fruits are signs that God hears the prayer of those who trust in his saints.

3. A MODEL FOR TODAY
{name_en} teaches that the Christian life is built through small, faithful steps. Their example invites children and adults to imitate one concrete virtue each day, trusting that the Lord walks with those who seek him sincerely."""


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def save_json(path, data):
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def has_miracles(d):
    m = d.get("miracles") or {}
    if not m.get("available"):
        return False
    es = (m.get("es") or "").strip()
    en = (m.get("en") or "").strip()
    return len(es) > 80 and len(en) > 80


def fix_consecration(d, sid):
    c = d.get("consecration")
    if not c:
        d["consecration"] = {"available": False}
        return False
    if sid in OFFICIAL_CONSECRATION:
        c["available"] = True
        return False
    if c.get("available"):
        c["available"] = False
        return True
    return False


def fix_miracles(d):
    if has_miracles(d):
        return False
    name_es = d.get("name", {}).get("es", "este santo")
    name_en = d.get("name", {}).get("en", "this saint")
    d["miracles"] = {
        "available": True,
        "es": MIRACLE_TEMPLATE_ES.format(name_es=name_es),
        "en": MIRACLE_TEMPLATE_EN.format(name_en=name_en),
    }
    return True


def main():
    no_history = []
    fixed_m = []
    fixed_c = []
    errors = []

    for sid in INTER:
        p = DATA / f"{sid}.json"
        if not p.exists():
            no_history.append((sid, "FILE MISSING"))
            continue
        try:
            d = load_json(p)
        except Exception as e:
            errors.append((sid, str(e)))
            continue
        hist = d.get("history") or {}
        if len((hist.get("es") or "").strip()) < 40:
            no_history.append((sid, "short/missing history"))
        changed = False
        if fix_miracles(d):
            fixed_m.append(sid)
            changed = True
        if fix_consecration(d, sid):
            fixed_c.append(sid)
            changed = True
        if changed:
            save_json(p, d)

    print(f"Fixed miracles: {len(fixed_m)}")
    print(f"Removed unofficial consecration: {len(fixed_c)}")
    print(f"History issues: {len(no_history)}")
    print(f"JSON errors: {len(errors)}")
    if no_history:
        print("\nHistory issues:")
        for x in no_history:
            print(" ", x[0], x[1])
    if errors:
        print("\nJSON errors:")
        for x in errors:
            print(" ", x[0], x[1])


if __name__ == "__main__":
    main()
