#!/usr/bin/env python3
"""Generate missing ninos cuento entries from intercessor JSON data."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MAIN = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")
start = MAIN.index("const INTERCESSORS = [")
end = MAIN.index("];", start) + 2
INTER = re.findall(r"id: '([^']+)'", MAIN[start:end])

existing = {
    c["saintId"]
    for c in json.loads((ROOT / "data/ninos-cuentos.json").read_text(encoding="utf-8"))["cuentos"]
}
missing = [i for i in INTER if i not in existing]

ACCENTS = {
    "inmaculadocorazon": "#1a5fa0",
    "providencia": "#6b4800",
    "divinaprovidencia": "#7a5a00",
    "perpetuosocorro": "#1a3a7a",
    "mariaauxiliadora": "#1a3a7a",
    "nuestrasenoracarmen": "#020610",
    "preciosisimasangre": "#7a1010",
    "sanagustin": "#5a3010",
}


def load(sid):
    p = DATA / f"{sid}.json"
    if not p.exists():
        return None
    return json.loads(p.read_text(encoding="utf-8-sig"))


def first_paras(text, n=3):
    parts = [p.strip() for p in re.split(r"\n\n+", text) if p.strip()]
    return parts[:n]


def child_story(name_es, paras_es, name_en, paras_en):
    intro_es = f"Esta es la historia de {name_es}, un amigo de Dios que nos enseña a confiar en Él."
    intro_en = f"This is the story of {name_en}, a friend of God who teaches us to trust Him."
    body_es = "\n\n".join(paras_es) if paras_es else f"{name_es} amó a Dios con todo el corazón."
    body_en = "\n\n".join(paras_en) if paras_en else f"{name_en} loved God with all their heart."
    close_es = f"Podemos pedirle a {name_es} que nos ayude a ser más parecidos a Jesús cada día."
    close_en = f"We can ask {name_en} to help us become more like Jesus each day."
    return f"{intro_es}\n\n{body_es}\n\n{close_es}", f"{intro_en}\n\n{body_en}\n\n{close_en}"


def moral_from_specialty(d, lang):
    sp = (d.get("specialty") or {}).get(lang, "")
    if lang == "es":
        return f"Dios nos llama a vivir con amor y confianza, como enseña {d['name']['es']}."
    return f"God calls us to live with love and trust, as {d['name']['en']} teaches."


def activity_generic(lang):
    if lang == "es":
        return "Reza una Ave María pidiendo ayuda para imitar a este santo hoy."
    return "Pray a Hail Mary asking help to imitate this saint today."


def S(id_, saint, icon, accent, title_es, title_en, hook_es, hook_en, story_es, story_en, moral_es, moral_en, act_es, act_en):
    return {
        "id": id_,
        "saintId": saint,
        "icon": f"/assets/images/{icon}",
        "accent": accent,
        "title": {"es": title_es, "en": title_en},
        "hook": {"es": hook_es, "en": hook_en},
        "story": {"es": story_es, "en": story_en},
        "moral": {"es": moral_es, "en": moral_en},
        "activity": {"es": act_es, "en": act_en},
    }


def icon_for(d, sid):
    img = d.get("image", "")
    if img:
        return img.split("/")[-1]
    return f"{sid}.svg"


def main():
    out = []
    for sid in missing:
        d = load(sid)
        if not d:
            print("skip missing file", sid)
            continue
        name_es = d["name"]["es"]
        name_en = d["name"]["en"]
        sp_es = (d.get("specialty") or {}).get("es", "")
        sp_en = (d.get("specialty") or {}).get("en", "")
        hist = d.get("history") or {}
        paras_es = first_paras(hist.get("es", ""), 2)
        paras_en = first_paras(hist.get("en", ""), 2)
        story_es, story_en = child_story(name_es, paras_es, name_en, paras_en)
        title_es = name_es.split(",")[0].strip()
        title_en = name_en.split(",")[0].strip()
        if len(title_es) > 42:
            title_es = title_es.replace("Nuestra Señora de ", "Virgen de ")
        hook_es = sp_es[:70] if sp_es else f"Un cuento para dormir sobre {title_es}"
        hook_en = sp_en[:70] if sp_en else f"A bedtime story about {title_en}"
        out.append(
            S(
                sid,
                sid,
                icon_for(d, sid),
                ACCENTS.get(sid, "#5a6a8a"),
                title_es,
                title_en,
                hook_es,
                hook_en,
                story_es,
                story_en,
                moral_from_specialty(d, "es"),
                moral_from_specialty(d, "en"),
                activity_generic("es"),
                activity_generic("en"),
            )
        )
    print(f"Generated {len(out)} extra cuentos for: {', '.join(missing)}")
    path = ROOT / "scripts" / "ninos_extra_cuentos_data.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {path}")


if __name__ == "__main__":
    main()
