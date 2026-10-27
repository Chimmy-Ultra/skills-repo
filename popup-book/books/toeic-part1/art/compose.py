"""Back walls the Codex art drew as separate things (office: window, chart, clock, shelf; store: a lamp floating
above the shelves): paint a wall behind them so each becomes one standing card.
Run: python3 art/compose.py  -> art-comp/*.png (read by the manifest next to art-src)."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = os.path.join(HERE, '..', 'art-src'), os.path.join(HERE, '..', 'art-comp')
INK = (58, 52, 48, 255)


def wall(src, out, box, fill, skirting=None):
    im = Image.open(f'{SRC}/{src}.webp').convert('RGBA')
    W, H = im.size; x0, y0, x1, y1 = box
    rng = np.random.default_rng(7)
    base = np.zeros((H, W, 4), np.uint8); base[y0:y1, x0:x1] = fill + (255,)
    # a faint paper grain, like the gouache in the art
    grain = (rng.normal(0, 4.0, (H, W)) ).astype(np.int16)
    base[..., :3] = np.clip(base[..., :3].astype(np.int16) + grain[..., None], 0, 255).astype(np.uint8)
    base[..., 3] = 0; base[y0:y1, x0:x1, 3] = 255
    bg = Image.fromarray(base, 'RGBA').filter(ImageFilter.GaussianBlur(0.6))
    d = ImageDraw.Draw(bg)
    if skirting: d.rectangle([x0, y1 - skirting[0], x1, y1], fill=skirting[1])
    d.rectangle([x0, y0, x1, y1], outline=INK, width=5)
    bg.alpha_composite(im)
    os.makedirs(OUT, exist_ok=True); bg.save(f'{OUT}/{out}.png')
    print(out, bg.size)


wall('02-office-wall', 'of-wall-comp', (6, 120, 1530, 880), (222, 218, 208), skirting=(26, (176, 168, 156, 255)))
wall('14-store-wall', 'st-wall-comp', (24, 60, 1514, 916), (232, 222, 200))
