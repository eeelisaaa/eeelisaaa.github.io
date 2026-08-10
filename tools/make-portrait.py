#!/usr/bin/env python3
"""Build the hero portrait: crop, grade, and feather the edges into real alpha.

Baking the fade into the image (rather than a CSS mask + page-coloured vignette)
means it composites correctly over ANY backdrop — including the hero's purple
glow, which is what the CSS approach got wrong.
"""
import os
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Point SRC at the full-resolution original; it is deliberately not in the repo.
SRC = os.environ.get("PORTRAIT_SRC", os.path.expanduser("~/Pictures/Profile/Elisa professional.jpg"))
OUT_DIR = os.path.join(REPO, "assets", "img")

# ── crop ────────────────────────────────────────────────────────────────────
# Looser than a tight head-and-shoulders crop on purpose: the feather needs
# margin to fade through, and that margin should be wall, not her.
CROP_W, CROP_H = 3200, 4800
OUT_W, OUT_H = 700, 1050

img = Image.open(SRC).convert("RGB")
W, H = img.size
left, top = (W - CROP_W) // 2, (H - CROP_H) // 2
img = img.crop((left, top, left + CROP_W, top + CROP_H)).resize((OUT_W, OUT_H), Image.LANCZOS)

# ── grade (CSS filter maths, applied for real) ──────────────────────────────
SATURATE, CONTRAST, BRIGHTNESS = 0.70, 1.13, 0.68

# saturate: gray + (v - gray) * s
img = Image.blend(img.convert("L").convert("RGB"), img, SATURATE)

# contrast then brightness as one lookup table
def lut(v):
    x = v / 255.0
    x = (x - 0.5) * CONTRAST + 0.5
    x = x * BRIGHTNESS
    return max(0, min(255, round(x * 255)))

img = img.point([lut(v) for v in range(256)] * 3)

# ── soft key light over the face, screen-blended ───────────────────────────
LIGHT = dict(cx=0.50, cy=0.30, rx=0.30, ry=0.24, intensity=0.17)
TINT = (255, 250, 245)

px = img.load()
for y in range(OUT_H):
    ny = (y / OUT_H - LIGHT["cy"]) / LIGHT["ry"]
    for x in range(OUT_W):
        nx = (x / OUT_W - LIGHT["cx"]) / LIGHT["rx"]
        d = (nx * nx + ny * ny) ** 0.5
        if d >= 1.0:
            continue
        t = 1.0 - d
        a = LIGHT["intensity"] * t * t * (3 - 2 * t)   # smoothstep falloff
        r, g, b = px[x, y]
        px[x, y] = (
            round(255 - (255 - r) * (1 - a * TINT[0] / 255)),
            round(255 - (255 - g) * (1 - a * TINT[1] / 255)),
            round(255 - (255 - b) * (1 - a * TINT[2] / 255)),
        )

# ── feather: real alpha, zero at every edge ────────────────────────────────
# Ellipse sized so alpha reaches 0 exactly at the frame edges, centred slightly
# above middle to sit on her face. Corners and shoulders dissolve into the page.
CX, CY, RX, RY = 0.50, 0.40, 0.50, 0.42
FADE_START, FADE_END = 0.50, 0.95

# Radial darkening, multiplied into RGB rather than painted in the page colour:
# it kills the bright studio wall around her head without assuming what is
# behind the image. DARK_* is how far the edges are pulled toward black.
DARK_IN, DARK_OUT, DARK_FLOOR = 0.26, 0.60, 0.16

apx = bytearray(OUT_W * OUT_H)
px = img.load()
for y in range(OUT_H):
    ny = (y / OUT_H - CY) / RY
    row = y * OUT_W
    for x in range(OUT_W):
        nx = (x / OUT_W - CX) / RX
        d = (nx * nx + ny * ny) ** 0.5

        # alpha feather
        if d <= FADE_START:
            a = 255
        elif d >= FADE_END:
            a = 0
        else:
            t = (d - FADE_START) / (FADE_END - FADE_START)
            a = round(255 * (1 - t * t * (3 - 2 * t)))   # smoothstep
        apx[row + x] = a

        # radial darkening
        if d > DARK_IN and a:
            if d >= DARK_OUT:
                k = DARK_FLOOR
            else:
                t = (d - DARK_IN) / (DARK_OUT - DARK_IN)
                s_ = t * t * (3 - 2 * t)
                k = 1.0 - (1.0 - DARK_FLOOR) * s_
            r, g, b = px[x, y]
            px[x, y] = (round(r * k), round(g * k), round(b * k))

alpha = Image.frombytes("L", (OUT_W, OUT_H), bytes(apx))
out = img.convert("RGBA")
out.putalpha(alpha)

os.makedirs(OUT_DIR, exist_ok=True)
webp = os.path.join(OUT_DIR, "portrait.webp")
out.save(webp, "WEBP", quality=88, method=6)

print(f"webp {os.path.getsize(webp)//1024} KB   {out.size}")

edges = [alpha.getpixel(p) for p in [
    (0, 0), (OUT_W - 1, 0), (0, OUT_H - 1), (OUT_W - 1, OUT_H - 1),
    (OUT_W // 2, 0), (OUT_W // 2, OUT_H - 1), (0, OUT_H // 2), (OUT_W - 1, OUT_H // 2)]]
print("edge alphas:", edges, "-> max", max(edges), "(must be 0)")
print("alpha on face:", alpha.getpixel((OUT_W // 2, int(OUT_H * 0.30))))
print("alpha top-of-head:", alpha.getpixel((OUT_W // 2, int(OUT_H * 0.15))))
