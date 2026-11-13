"""Gemini returns JPEG-like art on a white background. Make the white that touches the border transparent,
so tools/cut.py can find the shapes on each sheet.

usage: python3 art/prep.py            (reads gemini-raw/*.png, writes art-src/<name>.png)
"""
import glob, os
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BOOK = os.path.dirname(HERE)
FLAT = {'cover'}                       # flat textures keep their background
HOLES = {'sheet-b', 'sheet-c', 'sheet-e'}         # also clear big enclosed white areas (lattice, chains)


def cutout(rgb, holes=False):
    h, w = rgb.shape[:2]
    lum = rgb.min(axis=2).astype(np.int16)
    white = (lum > 236).astype(np.uint8)
    # background = near-white pixels connected to the border
    ff = white.copy(); mask = np.zeros((h + 2, w + 2), np.uint8)
    for x in range(0, w, 4):
        for y in (0, h - 1):
            if ff[y, x] == 1: cv2.floodFill(ff, mask, (x, y), 2)
    for y in range(0, h, 4):
        for x in (0, w - 1):
            if ff[y, x] == 1: cv2.floodFill(ff, mask, (x, y), 2)
    bg = (ff == 2).astype(np.uint8)
    bg = cv2.morphologyEx(bg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    if holes:
        inner = ((lum > 243) & (bg == 0)).astype(np.uint8)
        n, lab, stats, _ = cv2.connectedComponentsWithStats(inner, 4)
        for i in range(1, n):
            if stats[i, cv2.CC_STAT_AREA] > 700: bg[lab == i] = 1
    fg = 1 - bg
    # soften: alpha ramps over the last few light pixels next to the background
    alpha = cv2.GaussianBlur(fg.astype(np.float32), (3, 3), 0)
    return np.dstack([rgb, (alpha * 255).astype(np.uint8)])


def main():
    out = os.path.join(BOOK, 'art-src'); os.makedirs(out, exist_ok=True)
    for p in sorted(glob.glob(os.path.join(BOOK, 'gemini-raw', '*.png'))):
        name = os.path.splitext(os.path.basename(p))[0]
        rgb = np.array(Image.open(p).convert('RGB'))
        if name in FLAT:
            Image.fromarray(rgb).save(os.path.join(out, name + '.png'))
        else:
            Image.fromarray(cutout(rgb, name in HOLES), 'RGBA').save(os.path.join(out, name + '.png'))
        print(name, rgb.shape[1], 'x', rgb.shape[0])


if __name__ == '__main__':
    main()
