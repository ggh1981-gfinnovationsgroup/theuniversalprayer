#!/usr/bin/env python3
"""Audit intercessor JSON files for history, miracles, consecration."""
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

SKIP = {"diospadre", "diospadre-deep", "ninos-cuentos"}

def ok_text(d, key, sub=None):
    if not d:
        return False
    v = d.get(key)
    if not v:
        return False
    if sub:
        if isinstance(v, dict):
            if not v.get("available", True):
                return False
            es = (v.get("es") or "").strip()
            en = (v.get("en") or "").strip()
            return len(es) > 40 and len(en) > 40
        return False
    if isinstance(v, dict):
        es = (v.get("es") or "").strip()
        en = (v.get("en") or "").strip()
        return len(es) > 40 and len(en) > 40
    return len(str(v).strip()) > 40

issues = {"no_history": [], "no_miracles": [], "has_consecration": []}

for sid in INTER:
    p = DATA / f"{sid}.json"
    if not p.exists():
        issues["no_history"].append((sid, "FILE MISSING"))
        continue
    d = json.loads(p.read_text(encoding="utf-8-sig"))
    if not ok_text(d, "history"):
        issues["no_history"].append((sid, "missing/short history"))
    if not ok_text(d, "miracles", sub=True):
        issues["no_miracles"].append((sid, "missing/short miracles"))
    c = d.get("consecration")
    if c and c.get("available"):
        issues["has_consecration"].append(sid)

print("=== NO HISTORY ===")
for x in issues["no_history"]:
    print(x[0], "-", x[1])
print(f"Total: {len(issues['no_history'])}\n")

print("=== NO MIRACLES ===")
for x in issues["no_miracles"]:
    print(x[0], "-", x[1])
print(f"Total: {len(issues['no_miracles'])}\n")

print("=== HAS CONSECRATION (available) ===")
for x in issues["has_consecration"]:
    print(x)
print(f"Total: {len(issues['has_consecration'])}")
