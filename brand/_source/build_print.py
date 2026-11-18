"""Business cards (print PDFs) for Hope Theory Labs.

Run from the repo root: python3 brand/_source/build_print.py
Card: 3.5 × 2 in trim, 0.125 in bleed (3.75 × 2.25 in artwork), 0.125 in safe margin.
Units below are points (1/72 in). Output PDFs are RGB vector files: the printer
converts to CMYK. Proof the Brass and Deep Ink colours on paper first.
"""
import os, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from brandlib import *  # noqa

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "brand/business-card")
os.makedirs(OUT, exist_ok=True)
BLEED, TW, TH = 9, 252, 144          # 0.125 in bleed, 3.5 × 2 in trim
W, H = TW + 2 * BLEED, TH + 2 * BLEED  # 270 × 162 pt
SAFE = BLEED + 9                       # safe area starts 0.125 in inside trim

CARDS = {
    "fahad-ibrahim": {"name": "Fahad Ibrahim", "role": "Founder · Engineering and technical delivery"},
    "template": {"name": "[Full name]", "role": "[Role]"},
}
CONTACT = [("Phone", "+880 1718 463471"), ("Email", "hopetheorylabs@gmail.com"), ("Web", "hopetheorylabs.vercel.app")]


def card_svg(w_in, h_in, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w_in}in" height="{h_in}in" viewBox="0 0 {W} {H}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')


def front():
    b = [f'<rect width="{W}" height="{H}" fill="{NIGHT}"/>']
    m = 40; cap = m * 22 / 120 * 0.62
    size = cap / cap_height("sans", 600); ww = width(WORDMARK, "sans", 600, size, WM_TRACK)
    total = m + 14 + cap
    y0 = (H - total) / 2
    b.append(mark((W - m) / 2, y0, m))
    b.append(text(WORDMARK, (W - ww) / 2, y0 + m + 14 + cap, "sans", 600, size, INK, WM_TRACK))
    return "".join(b)


def back(name, role):
    b = [f'<rect width="{W}" height="{H}" fill="{PAPER}"/>']
    x = SAFE + 4
    b.append(text(name, x, SAFE + 22, "serif", 500, 15, NIGHT, opsz=16))
    b.append(text(role, x, SAFE + 35, "sans", 400, 7.5, SLATE))
    y = SAFE + 74
    for lbl, v in CONTACT:
        b.append(text(lbl, x, y, "mono", 500, 5.5, SLATE, 0.1, upper=True))
        b.append(text(v, x + 34, y, "sans", 500, 7.5, NIGHT))
        y += 13
    m = 24  # 8.5 mm: above the 8 mm print minimum
    b.append(mark(W - SAFE - 4 - m, H - SAFE - 4 - m, m, NIGHT, BRASS_DEEP))
    return "".join(b)


ENV = dict(os.environ, SOURCE_DATE_EPOCH="1795046400")  # fixed date: rebuilds are byte-identical


def pdf(svg_path, pdf_path):
    subprocess.run(["rsvg-convert", "-f", "pdf", svg_path, "-o", pdf_path], check=True, env=ENV)


def proof(art, title):
    """Art placed on a 5 × 3.5 in sheet with crop marks and a trim/safe guide."""
    PW, PH = 360, 252; ox, oy = (PW - W) / 2, (PH - H) / 2
    g = [f'<rect width="{PW}" height="{PH}" fill="#FFFFFF"/>', f'<g transform="translate({ox},{oy})">{art}</g>']
    tx0, ty0, tx1, ty1 = ox + BLEED, oy + BLEED, ox + BLEED + TW, oy + BLEED + TH
    k = "#000000"
    for x in (tx0, tx1):
        g.append(f'<line x1="{x}" y1="{oy - 18}" x2="{x}" y2="{oy - 3}" stroke="{k}" stroke-width="0.25"/>')
        g.append(f'<line x1="{x}" y1="{oy + H + 3}" x2="{x}" y2="{oy + H + 18}" stroke="{k}" stroke-width="0.25"/>')
    for y in (ty0, ty1):
        g.append(f'<line x1="{ox - 18}" y1="{y}" x2="{ox - 3}" y2="{y}" stroke="{k}" stroke-width="0.25"/>')
        g.append(f'<line x1="{ox + W + 3}" y1="{y}" x2="{ox + W + 18}" y2="{y}" stroke="{k}" stroke-width="0.25"/>')
    g.append(f'<rect x="{tx0}" y="{ty0}" width="{TW}" height="{TH}" fill="none" stroke="#E5484D" stroke-width="0.3" stroke-dasharray="2 2"/>')
    g.append(f'<rect x="{ox + SAFE}" y="{oy + SAFE}" width="{W - 2 * SAFE}" height="{H - 2 * SAFE}" fill="none" stroke="#3E63DD" stroke-width="0.3" stroke-dasharray="1 2"/>')
    g.append(text(title + " · trim 3.5 × 2 in (red) · safe area (blue) · bleed 0.125 in", 18, PH - 10, "sans", 400, 6, "#333333"))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="5in" height="3.5in" viewBox="0 0 {PW} {PH}">{"".join(g)}</svg>\n')


f_art = front()
p = os.path.join(OUT, "htl-card-front.svg"); open(p, "w").write(card_svg(3.75, 2.25, f_art, "Hope Theory Labs card, front"))
pdf(p, os.path.join(OUT, "htl-card-front-print.pdf"))
for key, c in CARDS.items():
    art = back(c["name"], c["role"])
    p = os.path.join(OUT, f"htl-card-back-{key}.svg"); open(p, "w").write(card_svg(3.75, 2.25, art, f"Hope Theory Labs card, back: {c['name']}"))
    pdf(p, os.path.join(OUT, f"htl-card-back-{key}-print.pdf"))
    pp = f"/tmp/htl-proof-{key}.svg"
    open(pp, "w").write(proof(art, f"Back: {c['name']}"))
    pdf(pp, f"/tmp/htl-proof-back-{key}.pdf")
pp = "/tmp/htl-proof-front.svg"; open(pp, "w").write(proof(f_art, "Front")); pdf(pp, "/tmp/htl-proof-front.pdf")
subprocess.run(["qpdf", "--deterministic-id", "--empty", "--pages", "/tmp/htl-proof-front.pdf", "/tmp/htl-proof-back-fahad-ibrahim.pdf",
                "/tmp/htl-proof-back-template.pdf", "--", os.path.join(OUT, "htl-card-proof-with-crop-marks.pdf")], check=True)
print("cards built")
