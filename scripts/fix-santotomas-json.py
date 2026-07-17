#!/usr/bin/env python3
import json
import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "data" / "santotomasdeaquino.json"
t = p.read_text(encoding="utf-8-sig")
# Fix literal newlines inside JSON strings before \n escapes
t = re.sub(r'"\s*\n\\n', '"\\n', t)
t = re.sub(r'(Magno|Great)\.\s*\n\\n', r'\1.\\n', t)
data = json.loads(t)
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Fixed santotomasdeaquino.json")
