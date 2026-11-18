"""Build the Hope Theory Labs brand kit: logos, icons, social, GitHub, web icons.

Run from the repo root:  python3 brand/_source/build_assets.py
Needs: fonttools, uharfbuzz, Pillow, and rsvg-convert on PATH (for PNG exports).
"""
import os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from brandlib import *  # noqa

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
B = os.path.join(ROOT, "brand")


def out(rel, content):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as fh:
        fh.write(content)
    return p


def png(svg_path, png_rel, w=None, h=None):
    p = os.path.join(ROOT, png_rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    cmd = ["rsvg-convert", svg_path, "-o", p]
    if w: cmd += ["-w", str(w)]
    if h: cmd += ["-h", str(h)]
    subprocess.run(cmd, check=True)
    return p


def wrap(txt, family, weight, size, maxw, tracking=0.0):
    words, lines, cur = txt.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if width(t, family, weight, size, tracking) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur); cur = wd
    lines.append(cur)
    return lines


def label(txt, x, y, size=15, fill=MUTED, anchor="start"):
    return text(txt, x, y, "mono", 500, size, fill, 0.1, anchor, upper=True)

# ---------------------------------------------------------------- logos
INKS = {"light": (INK, BRASS), "dark": (NIGHT, BRASS_DEEP), "mono-black": ("#000000", "#000000"), "mono-white": ("#FFFFFF", "#FFFFFF")}
for k, (ink, tip) in INKS.items():
    out(f"brand/logo/htl-monogram-{k}.svg", svg(120, 120, mark(0, 0, 120, ink, tip), "Hope Theory Labs"))
    body, w = lockup(0, 0, 120, ink, tip)
    out(f"brand/logo/htl-lockup-horizontal-{k}.svg", svg(round(w, 2), 120, body, "Hope Theory Labs"))
    # stacked: mark centred, wordmark cap 22 units, gap 36
    cap = 22; size = cap / cap_height("sans", 600); ww = width(WORDMARK, "sans", 600, size, WM_TRACK)
    W = max(ww, 120); base = 120 + 36 + cap
    body = mark((W - 120) / 2, 0, 120, ink, tip) + text(WORDMARK, (W - ww) / 2, base, "sans", 600, size, ink, WM_TRACK)
    out(f"brand/logo/htl-lockup-stacked-{k}.svg", svg(round(W, 2), base + 1, body, "Hope Theory Labs"))
    size = 40 / cap_height("sans", 600); ww = width(WORDMARK, "sans", 600, size, WM_TRACK)
    out(f"brand/logo/htl-wordmark-{k}.svg", svg(round(ww, 2), 40, text(WORDMARK, 0, 40, "sans", 600, size, ink, WM_TRACK), "Hope Theory Labs"))

# App icon (1024, rounded tile) and full-bleed avatar art (for circle crops)
APP = svg(1024, 1024, f'<rect width="1024" height="1024" rx="224" fill="{DEEP_INK}"/>' + mark(232, 232, 560), "Hope Theory Labs")
app_svg = out("brand/logo/htl-app-icon.svg", APP)
AVATAR = svg(1080, 1080, f'<rect width="1080" height="1080" fill="{DEEP_INK}"/>' + mark(290, 290, 500), "Hope Theory Labs")
avatar_svg = out("brand/social/htl-avatar.svg", AVATAR)

# Favicons: pixel-fitted cuts (docs/BRAND.md, Logo)
def rects(rs, fill, ox, oy):
    return "".join(f'<rect x="{ox + x}" y="{oy + y}" width="{w}" height="{h}" fill="{fill}"/>' for x, y, w, h in rs)
F24 = [(0, 3, 3, 18), (0, 10, 12, 3), (9, 0, 3, 24), (6, 0, 9, 3), (15, 8, 3, 16), (15, 21, 6, 3)]
F12 = [(0, 2, 2, 8), (0, 5, 6, 2), (4, 0, 2, 12), (3, 0, 4, 2), (8, 4, 2, 8), (8, 10, 2, 2)]
FAV32 = svg(32, 32, f'<rect width="32" height="32" rx="6" fill="{DEEP_INK}"/>' + rects(F24, INK, 4, 4) + rects([(21, 21, 3, 3)], BRASS, 4, 4), "Hope Theory Labs")
FAV16 = svg(16, 16, f'<rect width="16" height="16" rx="3" fill="{DEEP_INK}"/>' + rects(F12, INK, 2, 2) + rects([(10, 10, 2, 2)], BRASS, 2, 2), "Hope Theory Labs")
fav32 = out("brand/logo/htl-favicon.svg", FAV32)
fav16 = out("brand/logo/htl-favicon-16.svg", FAV16)

# PNG exports of logos
for k in INKS:
    png(os.path.join(B, f"logo/htl-monogram-{k}.svg"), f"brand/logo/png/htl-monogram-{k}-1024.png", 1024, 1024)
    png(os.path.join(B, f"logo/htl-lockup-horizontal-{k}.svg"), f"brand/logo/png/htl-lockup-horizontal-{k}-1600w.png", 1600)
    png(os.path.join(B, f"logo/htl-lockup-stacked-{k}.svg"), f"brand/logo/png/htl-lockup-stacked-{k}-1200w.png", 1200)
png(app_svg, "brand/logo/png/htl-app-icon-1024.png", 1024, 1024)

# ---------------------------------------------------------------- site icons
shutil.copy(fav32, os.path.join(ROOT, "app/icon.svg"))
# Full-bleed square for the apple-touch icon: iOS rounds the corners itself.
SQUARE = svg(1024, 1024, f'<rect width="1024" height="1024" fill="{DEEP_INK}"/>' + mark(232, 232, 560), "Hope Theory Labs")
sq_svg = out("brand/logo/htl-app-icon-square.svg", SQUARE)
png(sq_svg, "app/apple-icon.png", 180, 180)
png(app_svg, "public/icons/icon-192.png", 192, 192)
png(app_svg, "public/icons/icon-512.png", 512, 512)
# Maskable: mark inside the central 80% safe zone on a full-bleed tile
MASK = svg(512, 512, f'<rect width="512" height="512" fill="{DEEP_INK}"/>' + mark(156, 156, 200), "Hope Theory Labs")
mask_svg = out("brand/logo/htl-maskable.svg", MASK)
png(mask_svg, "public/icons/icon-maskable-512.png", 512, 512)
# favicon.ico with pixel-fitted 16 and 32 + 48
from PIL import Image
tmp = "/tmp/htl-ico"; os.makedirs(tmp, exist_ok=True)
subprocess.run(["rsvg-convert", fav16, "-w", "16", "-h", "16", "-o", f"{tmp}/16.png"], check=True)
subprocess.run(["rsvg-convert", fav32, "-w", "32", "-h", "32", "-o", f"{tmp}/32.png"], check=True)
subprocess.run(["rsvg-convert", fav32, "-w", "48", "-h", "48", "-o", f"{tmp}/48.png"], check=True)
ims = [Image.open(f"{tmp}/{s}.png").convert("RGBA") for s in (16, 32, 48)]
ims[2].save(os.path.join(ROOT, "app/favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=ims[:2])

# ---------------------------------------------------------------- Open Graph 1200x630
HERO = "We engineer software that makes businesses smarter."
EYEBROW = "AI engineering · Custom software · Dhaka"
def og():
    W, H, m = 1200, 630, 80
    body, _ = lockup(m, 72, 40)
    b = [body, label(EYEBROW, m, 250)]
    lines = wrap(HERO, "serif", 500, 68, W - 2 * m)
    for i, ln in enumerate(lines):
        b.append(text(ln, m, 330 + i * 76, "serif", 500, 68, INK, opsz=72))
    b.append(label("hopetheorylabs.vercel.app", m, 520, 15, MUTED))
    b.append(ticks(m, 568, W - 2 * m, accent_at=60))
    return svg(W, H, "".join(b), "Hope Theory Labs — We engineer software that makes businesses smarter.", NIGHT)
og_svg = out("brand/social/htl-og-1200x630.svg", og())
png(og_svg, "public/og.png", 1200, 630)

# ---------------------------------------------------------------- social covers
def x_header():
    W, H, r = 1500, 500, 1420
    b = [label(EYEBROW, r, 170, 16, MUTED, "end")]
    for i, ln in enumerate(["We engineer software", "that makes businesses smarter."]):
        b.append(text(ln, r, 250 + i * 66, "serif", 500, 58, INK, anchor="end", opsz=72))
    b.append(ticks(620, 420, 800, accent_at=42))
    return svg(W, H, "".join(b), "Hope Theory Labs header", NIGHT)

def linkedin_cover():
    W, H, r = 1128, 191, 1088
    b = [label(EYEBROW, r, 62, 12, MUTED, "end"), text(HERO, r, 112, "serif", 500, 32, INK, anchor="end", opsz=36),
         ticks(400, 156, 688, pitch=12, short=4, tall=9, accent_at=50)]
    return svg(W, H, "".join(b), "Hope Theory Labs cover", NIGHT)

def facebook_cover():
    W, H, c = 1640, 624, 820
    b = [label(EYEBROW, c, 228, 18, MUTED, "middle")]
    for i, ln in enumerate(["We engineer software", "that makes businesses smarter."]):
        b.append(text(ln, c, 320 + i * 74, "serif", 500, 64, INK, anchor="middle", opsz=72))
    b.append(ticks(420, 520, 800, accent_at=48))
    return svg(W, H, "".join(b), "Hope Theory Labs cover", NIGHT)

for name, fn, w, h in [("htl-x-header-1500x500", x_header, 1500, 500), ("htl-linkedin-cover-1128x191", linkedin_cover, 1128, 191),
                       ("htl-facebook-cover-1640x624", facebook_cover, 1640, 624)]:
    p = out(f"brand/social/{name}.svg", fn())
    png(p, f"brand/social/png/{name}.png", w, h)
png(avatar_svg, "brand/social/png/htl-avatar-1080.png", 1080, 1080)
png(avatar_svg, "brand/social/png/htl-avatar-400.png", 400, 400)

# Post templates (real site copy only)
def post_note():
    W = H = 1080; m = 96
    b = [label("HTL / Field note", m, 140, 22)]
    lines = wrap("Engineers work alongside your team, inside your workflow, from discovery to production and handoff.", "serif", 500, 76, W - 2 * m)
    for i, ln in enumerate(lines):
        b.append(text(ln, m, 300 + i * 88, "serif", 500, 76, INK, opsz=72))
    b.append(label("Forward-deployed engineering", m, 300 + len(lines) * 88 + 40, 22, BRASS))
    lb, _ = lockup(m, 900, 44)
    b.append(lb)
    b.append(ticks(m, 1000, W - 2 * m, accent_at=52))
    return svg(W, H, "".join(b), "Hope Theory Labs field note", NIGHT)

def post_steps():
    W, H, m = 1080, 1350, 96
    steps = [("Discover", "We map the workflow with your team."), ("Scope", "We agree what to build first, in writing."),
             ("Prototype", "A working version on your real tools and data."), ("Deploy", "Live in production, with your team approving."),
             ("Improve", "We watch how it is used and improve it.")]
    for _, d in steps:
        assert width(d, "sans", 400, 31) <= W - 2 * m - 104, d
    b = [label("HTL / How we work", m, 150, 22), text("Five steps, in plain order.", m, 260, "serif", 500, 72, INK, opsz=72)]
    y = 380
    for i, (t, d) in enumerate(steps):
        b.append(f'<rect x="{m}" y="{y}" width="{W - 2*m}" height="1" fill="{LINE}"/>')
        b.append(label(f"0{i+1}", m, y + 62, 24, BRASS if i == 4 else MUTED))
        b.append(text(t, m + 104, y + 64, "serif", 500, 52, INK, opsz=60))
        b.append(text(d, m + 104, y + 116, "sans", 400, 31, MUTED))
        y += 160
    lb, _ = lockup(m, 1210, 40)
    b.append(lb)
    return svg(W, H, "".join(b), "Hope Theory Labs: how we work", NIGHT)

for name, fn, w, h in [("htl-post-field-note-1080", post_note, 1080, 1080), ("htl-post-how-we-work-1080x1350", post_steps, 1080, 1350)]:
    p = out(f"brand/social/{name}.svg", fn())
    png(p, f"brand/social/png/{name}.png", w, h)

# ---------------------------------------------------------------- GitHub
def gh_preview():
    W, H, m = 1280, 640, 96
    body, _ = lockup(m, 96, 48)
    b = [body, label("FahadIbrahim93 / hopetheorylabs-site", m, 300, 18),
         text("The Hope Theory Labs website.", m, 380, "serif", 500, 60, INK, opsz=72),
         text("Next.js · static export · no tracking", m, 440, "sans", 400, 26, MUTED),
         ticks(m, 560, W - 2 * m, accent_at=60)]
    return svg(W, H, "".join(b), "hopetheorylabs-site", NIGHT)

def gh_banner():
    W, H, m = 1280, 320, 64
    body, w = lockup(m, 112, 64)
    b = [body, label("AI engineering · Custom software · Dhaka", W - m, 152, 16, MUTED, "end"),
         ticks(m, 268, W - 2 * m, accent_at=64)]
    return svg(W, H, "".join(b), "Hope Theory Labs", NIGHT)

p = out("brand/github/htl-github-social-preview-1280x640.svg", gh_preview()); png(p, "brand/github/png/htl-github-social-preview-1280x640.png", 1280, 640)
p = out("brand/github/htl-readme-banner-1280x320.svg", gh_banner()); png(p, "brand/github/png/htl-readme-banner-1280x320.png", 1280, 320)
png(avatar_svg, "brand/github/png/htl-github-org-avatar-500.png", 500, 500)

# ---------------------------------------------------------------- email signature logo (hosted on the site)
_sig, _w = lockup(0, 0, 60, NIGHT, BRASS_DEEP)
EMAIL = svg(round(_w, 2), 60, _sig, "Hope Theory Labs")
p = out("brand/email-signature/htl-signature-logo.svg", EMAIL)
png(p, "public/brand/htl-signature-logo.png", round(_w * 2))  # shown at half size (retina)
print("signature logo css width", round(_w / 2.5), "x 24")
print("built")
