"""Helpers for building Hope Theory Labs brand assets.

Every text run is shaped with HarfBuzz and converted to outlines, so the SVGs
render the same everywhere without the fonts installed.
Fonts (SIL OFL, from github.com/google/fonts) are expected in $HTL_FONTS:
  instrument.ttf (Instrument Sans [wdth,wght]), newsreader.ttf (Newsreader
  [opsz,wght]), jbmono.ttf (JetBrains Mono [wght]).
"""
import io, os
from functools import lru_cache
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONTS = os.environ.get("HTL_FONTS", os.path.expanduser("~/.fonts"))
FILES = {"sans": "instrument.ttf", "serif": "newsreader.ttf", "mono": "jbmono.ttf"}

# Brand palette (docs/BRAND.md)
NIGHT, DEEP_INK, BRASS, BRASS_DEEP = "#07090C", "#0F1B2D", "#B8892F", "#8A6420"
PAPER, SLATE, INK, MUTED, LINE, LINE_CTRL = "#F8F6F1", "#475569", "#EEF0F2", "#A3ACB8", "#2A323D", "#6B7685"


@lru_cache(maxsize=None)
def _font(family, weight, opsz=None):
    f = TTFont(os.path.join(FONTS, FILES[family]))
    axes = {a.axisTag: (a.minValue, a.maxValue) for a in f["fvar"].axes}
    loc = {"wght": weight}
    if "wdth" in axes:
        loc["wdth"] = 100
    if "opsz" in axes:
        lo, hi = axes["opsz"]
        loc["opsz"] = max(lo, min(hi, opsz or 12))
    f = instantiateVariableFont(f, loc)
    buf = io.BytesIO(); f.save(buf); data = buf.getvalue()
    f = TTFont(io.BytesIO(data))
    hbfont = hb.Font(hb.Face(hb.Blob(data)))
    return f, hbfont


def shape(txt, family, weight, size, tracking=0.0, opsz=None):
    """Return (list of (glyphname, x), advance width) in px."""
    f, hbf = _font(family, weight, round(opsz or size * 0.75))
    upm = f["head"].unitsPerEm
    buf = hb.Buffer(); buf.add_str(txt); buf.guess_segment_properties()
    hb.shape(hbf, buf, {"kern": True, "liga": True})
    order = f.getGlyphOrder(); s = size / upm; x = 0; out = []
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        out.append((order[info.codepoint], x + pos.x_offset * s, pos.y_offset * s))
        x += pos.x_advance * s
        if i < n - 1:
            x += tracking * size
    return out, x


def width(txt, family, weight, size, tracking=0.0, opsz=None):
    return shape(txt, family, weight, size, tracking, opsz)[1]


def text(txt, x, y, family="sans", weight=400, size=16, fill=INK, tracking=0.0, anchor="start", opsz=None, upper=False):
    """SVG <path> for one line of text; (x, y) is the baseline start."""
    if upper:
        txt = txt.upper()
    glyphs, w = shape(txt, family, weight, size, tracking, opsz)
    if anchor == "middle":
        x -= w / 2
    elif anchor == "end":
        x -= w
    f, _ = _font(family, weight, round(opsz or size * 0.75))
    gs = f.getGlyphSet(); s = size / f["head"].unitsPerEm
    d = []
    for name, gx, gy in glyphs:
        pen = SVGPathPen(gs, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
        gs[name].draw(TransformPen(pen, (s, 0, 0, -s, x + gx, y - gy)))
        d.append(pen.getCommands())
    return f'<path fill="{fill}" d="{"".join(d)}"/>'


def cap_height(family, weight=400):
    f, _ = _font(family, weight, 12)
    return f["OS/2"].sCapHeight / f["head"].unitsPerEm


# The H-T-L monogram on its 120-unit grid (docs/BRAND.md, Logo).
MARK = [(0, 16, 16, 88), (0, 52, 60, 16), (44, 0, 16, 120), (28, 0, 48, 16), (76, 40, 16, 80), (76, 104, 28, 16)]
TIP = (104, 104, 16, 16)


def mark(x, y, size, ink=INK, tip=BRASS):
    k = size / 120
    r = lambda a, fill: f'<rect x="{x + a[0]*k:.3f}" y="{y + a[1]*k:.3f}" width="{a[2]*k:.3f}" height="{a[3]*k:.3f}" fill="{fill}"/>'
    return "".join(r(a, ink) for a in MARK) + r(TIP, tip)


WORDMARK = "HOPE THEORY LABS"
WM_TRACK = 0.22


def lockup(x, y, mark_size, ink=INK, tip=BRASS):
    """Horizontal lockup: mark, gap 0.4 × mark, caps wordmark with cap height 0.3667 × mark."""
    cap = mark_size * 44 / 120
    size = cap / cap_height("sans", 600)
    gap = mark_size * 48 / 120
    base = y + mark_size / 2 + cap / 2
    t = text(WORDMARK, x + mark_size + gap, base, "sans", 600, size, ink, WM_TRACK)
    w = mark_size + gap + width(WORDMARK, "sans", 600, size, WM_TRACK)
    return mark(x, y, mark_size, ink, tip) + t, w


def ticks(x, y, length, pitch=16, short=6, tall=12, ink=MUTED, accent_at=None, accent=BRASS, rule=LINE_CTRL):
    """Calibration ticks along a hairline. Every fourth tick is tall; one may be accented."""
    out = [f'<rect x="{x}" y="{y}" width="{length}" height="1" fill="{rule}"/>']
    n = int(length // pitch) + 1
    for i in range(n):
        tx = x + i * pitch
        if tx > x + length:
            break
        h = tall if i % 4 == 0 else short
        if accent_at is not None and i == accent_at:
            out.append(f'<rect x="{tx - 0.5:.1f}" y="{y - tall - 4}" width="2" height="{tall + 4}" fill="{accent}"/>')
        else:
            out.append(f'<rect x="{tx:.1f}" y="{y - h}" width="1" height="{h}" fill="{ink}"/>')
    return "".join(out)


def svg(w, h, body, title="Hope Theory Labs", bg=None):
    bgr = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{bgr}{body}</svg>\n')
