"""Render brand/guidelines/src/*.md into brand/guidelines/HTL-Brand-Guidelines.pdf.

Run from the repo root after build_assets.py: python3 brand/_source/build_guidelines.py
Needs Python `markdown`, Google Chrome (or Chromium) on PATH as `google-chrome`, and the
brand fonts installed locally (Newsreader, Instrument Sans, JetBrains Mono).
"""
import base64, glob, json, os, subprocess, tempfile
import markdown

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
B = os.path.join(ROOT, "brand")
CHROME = os.environ.get("CHROME", "google-chrome")


def data_uri(path):
    mime = "image/svg+xml" if path.endswith(".svg") else "image/png"
    return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()


def img(rel, alt, style=""):
    return f'<img src="{data_uri(os.path.join(B, rel))}" alt="{alt}" style="{style}">'


tokens = json.load(open(os.path.join(B, "tokens/tokens.json")))
sections = []
for path in sorted(glob.glob(os.path.join(B, "guidelines/src/*.md"))):
    html = markdown.markdown(open(path).read(), extensions=["tables", "fenced_code"])
    sections.append(f'<section class="chapter">{html}</section>')

swatches = "".join(
    f'<div class="sw"><div class="chip" style="background:{t["value"]}"></div><b>{t["name"]}</b><code>{t["value"]}</code><p>{t["usage"]}</p></div>'
    for t in tokens["color"]["tokens"] if isinstance(t["value"], str) and t["value"].startswith("#"))

appendix = f'''
<section class="chapter"><h1>Appendix A · Logo files</h1>
<div class="grid2">
<figure class="night">{img("logo/htl-lockup-horizontal-light.svg", "Horizontal lockup, light", "width:100%")}<figcaption>htl-lockup-horizontal-light · on Night and Deep Ink</figcaption></figure>
<figure class="paperbox">{img("logo/htl-lockup-horizontal-dark.svg", "Horizontal lockup, dark", "width:100%")}<figcaption>htl-lockup-horizontal-dark · on Paper and white</figcaption></figure>
<figure class="deep">{img("logo/htl-lockup-stacked-light.svg", "Stacked lockup", "height:120px")}<figcaption>htl-lockup-stacked-light</figcaption></figure>
<figure class="whitebox">{img("logo/htl-monogram-mono-black.svg", "One-colour monogram", "height:120px")}<figcaption>htl-monogram-mono-black · one-colour print</figcaption></figure>
</div>
<h2>Construction</h2>
<figure class="whitebox construction">{img("logo/htl-monogram-dark.svg", "Monogram on its grid", "width:240px;height:240px")}<figcaption>120-unit grid · one 16-unit stroke · 16 × 16 Brass tip · clear space two strokes on every side</figcaption></figure>
<h2>Small sizes</h2>
<div class="row">{img("logo/htl-favicon.svg", "Favicon 32", "width:64px;height:64px;image-rendering:pixelated")}{img("logo/htl-favicon-16.svg", "Favicon 16", "width:64px;height:64px;image-rendering:pixelated")}{img("logo/htl-app-icon.svg", "App icon", "width:96px;height:96px")}<p>32 px cut, pixel-fitted 16 px cut (shown at 4× and 2×) and the app icon.</p></div>
</section>
<section class="chapter"><h1>Appendix B · Brand colours</h1><div class="swatches">{swatches}</div></section>
<section class="chapter"><h1>Appendix C · Applications</h1>
<figure>{img("social/htl-og-1200x630.svg", "Open Graph image", "width:100%")}<figcaption>Open Graph image (public/og.png)</figcaption></figure>
<div class="grid2">
<figure>{img("social/htl-post-field-note-1080.svg", "Field note post", "width:100%")}<figcaption>Post template · field note</figcaption></figure>
<figure>{img("social/htl-post-how-we-work-1080x1350.svg", "How we work post", "width:100%")}<figcaption>Post template · how we work</figcaption></figure>
</div>
<div class="grid2">
<figure>{img("business-card/htl-card-front.svg", "Business card front", "width:100%")}<figcaption>Business card front (3.5 × 2 in, with bleed)</figcaption></figure>
<figure>{img("business-card/htl-card-back-fahad-ibrahim.svg", "Business card back", "width:100%")}<figcaption>Business card back</figcaption></figure>
</div>
</section>'''

cover = f'''<section class="cover">{img("logo/htl-lockup-horizontal-light.svg", "Hope Theory Labs", "height:56px")}
<div><p class="label">Brand guidelines · Instrument · v1.0 · November 2026</p><h1 class="ct">Measured,<br>not decorated.</h1>
<p class="sub">How Hope Theory Labs looks, sounds and ships.</p></div></section>'''

css = """
@page { size: A4; margin: 20mm 18mm 22mm; @bottom-left { content: "Hope Theory Labs · Brand guidelines"; font: 8pt 'JetBrains Mono', monospace; color: #475569; } @bottom-right { content: counter(page); font: 8pt 'JetBrains Mono', monospace; color: #475569; } }
@page :first { margin: 0; @bottom-left { content: none } @bottom-right { content: none } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Instrument Sans', Arial, sans-serif; font-size: 10.5pt; line-height: 1.55; color: #07090C; background: #fff; }
.cover { height: 297mm; box-sizing: border-box; padding: 24mm 20mm; background: #07090C; color: #EEF0F2; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; }
.cover .label { font-family: 'JetBrains Mono', monospace; font-size: 9pt; letter-spacing: .1em; text-transform: uppercase; color: #A3ACB8; }
.cover .ct { font-family: 'Newsreader', Georgia, serif; font-weight: 500; font-size: 64pt; line-height: 1; margin: 8mm 0 6mm; letter-spacing: -.02em; border: 0; }
.cover .sub { font-size: 14pt; color: #A3ACB8; margin: 0; }
.chapter { page-break-before: always; }
h1 { font-family: 'Newsreader', Georgia, serif; font-weight: 500; font-size: 28pt; line-height: 1.1; margin: 0 0 6mm; padding-bottom: 4mm; border-bottom: 1px solid #DDD8CC; }
h2 { font-family: 'Newsreader', Georgia, serif; font-weight: 500; font-size: 16pt; margin: 8mm 0 3mm; page-break-after: avoid; }
h3 { font-size: 11pt; margin: 5mm 0 2mm; }
p, li { orphans: 3; widows: 3; }
code { font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; background: #F3EFE7; padding: 0 3px; border-radius: 2px; }
pre { background: #F3EFE7; padding: 3mm; font-size: 8pt; white-space: pre-wrap; word-break: break-all; border-radius: 4px; }
pre code { background: none; }
table { width: 100%; border-collapse: collapse; margin: 3mm 0 5mm; font-size: 9pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th { text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; color: #475569; border-bottom: 1px solid #857F72; padding: 2mm 3mm 2mm 0; }
td { border-bottom: 1px solid #DDD8CC; padding: 2mm 3mm 2mm 0; vertical-align: top; }
a { color: #8A6420; }
figure { margin: 0 0 6mm; }
figcaption { font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: #475569; margin-top: 2mm; letter-spacing: .04em; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.night, .deep, .paperbox, .whitebox { padding: 8mm; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; }
.night { background: #07090C; } .night figcaption, .deep figcaption { color: #A3ACB8; }
.deep { background: #0F1B2D; align-items: center; } .paperbox { background: #F8F6F1; } .whitebox { background: #fff; border: 1px solid #DDD8CC; align-items: center; }
.construction img { background-image: linear-gradient(#E9E4D8 1px, transparent 1px), linear-gradient(90deg, #E9E4D8 1px, transparent 1px); background-size: 16px 16px; }
.row { display: flex; align-items: center; gap: 8mm; }
.swatches { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5mm; }
.sw { font-size: 8.5pt; } .sw .chip { height: 22mm; border-radius: 3px; border: 1px solid #DDD8CC; margin-bottom: 2mm; } .sw code { display: block; margin: 1mm 0; } .sw p { margin: 0; color: #475569; }
"""
doc = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Hope Theory Labs — Brand guidelines</title><style>{css}</style></head><body>{cover}{"".join(sections)}{appendix}</body></html>'
out_html = os.path.join(tempfile.gettempdir(), "htl-guidelines.html")
open(out_html, "w").write(doc)
pdf = os.path.join(B, "guidelines/HTL-Brand-Guidelines.pdf")
subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                f"--print-to-pdf={pdf}", "file://" + out_html], check=True, capture_output=True)
print("guidelines pdf", os.path.getsize(pdf))
