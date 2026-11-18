"""Compile brand/tokens/tokens.json into brand/tokens/tokens.css.

Run from the repo root: python3 brand/_source/build_tokens.py
The first theme (night) is the default on :root; [data-theme="paper"] switches.
"""
import json, os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
T = json.load(open(os.path.join(ROOT, "brand/tokens/tokens.json")))
themes = [t["id"] for t in T["color"]["themes"]]

def val(v):
    m = re.fullmatch(r"\{([A-Za-z0-9_.-]+)\}", v)
    return f"var(--{m.group(1)})" if m else v

def per_theme(tok, th):
    v = tok["value"]
    if isinstance(v, str):
        return val(v)
    return val(v.get(th, v[themes[0]]))

lines = ["/* Hope Theory Labs — generated from tokens.json by brand/_source/build_tokens.py. Do not edit by hand. */", ""]
for i, th in enumerate(themes):
    sel = f':root, [data-theme="{th}"]' if i == 0 else f'[data-theme="{th}"]'
    lines.append(sel + " {")
    for fam in ("color", "shadow"):
        for tok in T[fam]["tokens"]:
            if i > 0 and isinstance(tok["value"], str):
                continue
            lines.append(f"  --{tok['name']}: {per_theme(tok, th)};")
    lines.append(f"  color-scheme: {'dark' if th == 'night' else 'light'};")
    lines.append("}")
    lines.append("")
lines.append(":root {")
for fam in ("spacing", "radius", "borderWidth", "duration", "easing", "layout"):
    for tok in T[fam]["tokens"]:
        lines.append(f"  --{tok['name']}: {tok['value']};")
for key, stack in T["type"]["families"].items():
    lines.append(f"  --font-{key}: {stack};")
lines.append("}")
lines.append("")
for g in T["type"]["groups"]:
    for s in g["styles"]:
        fam = s.get("family", g["family"])
        decl = [f"font-family: var(--font-{fam})", f"font-size: {s['fontSize']}", f"line-height: {s['lineHeight']}", f"font-weight: {s['fontWeight']}"]
        if "letterSpacing" in s:
            decl.append(f"letter-spacing: {s['letterSpacing']}")
        if s["name"] in ("label", "wordmark"):
            decl.append("text-transform: uppercase")
        lines.append(f".{s['name']} {{ " + "; ".join(decl) + "; }")
open(os.path.join(ROOT, "brand/tokens/tokens.css"), "w").write("\n".join(lines) + "\n")
print("tokens.css written")
