#!/usr/bin/env python3
"""
Regenerate every optimised image of the site from tools/originals/.

  1. Replace the files in tools/originals/ with your own photos (keep the names):
       hero.jpg   mount.jpg   lake.jpg   snow.jpg
       meet.jpg   why.jpg     band.jpg   flag.jpg
     (4K = 3840 px wide is perfect; JPG or PNG with the same base name works.)
  2. Run:  pip install pillow   then   python tools/make_images.py
  3. Commit + push. The script rewrites images/*.webp AND the srcset in index.html.
"""
import os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "tools", "originals")
OUT = os.path.join(ROOT, "images")
HTML = os.path.join(ROOT, "index.html")
STEPS = (480, 960, 1440, 1920, 2560, 3840)
MAX_W = 3840
NAMES = ("hero", "meet", "mount", "lake", "snow", "why", "band", "flag")

os.makedirs(OUT, exist_ok=True)
html = open(HTML, encoding="utf-8").read()

for name in NAMES:
    path = next((os.path.join(SRC, name + e) for e in (".jpg", ".jpeg", ".png", ".webp")
                 if os.path.exists(os.path.join(SRC, name + e))), None)
    if not path:
        print("skip", name, "(no file in tools/originals)"); continue
    im = Image.open(path).convert("RGB")
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    W, H = im.size
    widths = [w for w in STEPS if w < W] + [W]
    for f in os.listdir(OUT):                       # remove old sizes of this image
        if re.fullmatch(name + r"-\d+\.webp", f):
            os.remove(os.path.join(OUT, f))
    for w in widths:
        r = im if w == W else im.resize((w, round(H * w / W)), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=84, method=6)
    srcset = ", ".join(f"images/{name}-{w}.webp {w}w" for w in widths)
    fallback = widths[-2] if len(widths) > 1 else widths[0]

    def fix(m):
        tag = m.group(0)
        tag = re.sub(r'src="images/[a-z]+-\d+\.webp"', f'src="images/{name}-{fallback}.webp"', tag, count=1)
        tag = re.sub(r'srcset="[^"]*"', f'srcset="{srcset}"', tag, count=1)
        tag = re.sub(r'width="\d+"', f'width="{W}"', tag, count=1)
        tag = re.sub(r'height="\d+"', f'height="{H}"', tag, count=1)
        return tag
    html = re.sub(r'<img[^>]*images/%s-\d+\.webp[^>]*>' % name, fix, html)
    # preload tag of the hero
    if name == "hero":
        html = re.sub(r'(<link rel="preload" as="image" href=")[^"]*(" imagesrcset=")[^"]*(")',
                      lambda m: f'{m.group(1)}images/hero-{fallback}.webp{m.group(2)}{srcset}{m.group(3)}', html)
    print(f"{name}: {W}x{H} -> {len(widths)} sizes")

open(HTML, "w", encoding="utf-8").write(html)
print("done")
