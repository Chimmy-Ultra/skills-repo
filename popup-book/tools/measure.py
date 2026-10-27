"""Measure anchor points on cut pieces, so mechanisms can attach things to the right spot of a card.

Anchors are given as (u, v): u = fraction of the piece's width from its left edge, v = fraction of its
height from its FOOT (v = 1 is the top). cardPoint(card, u, v) turns them into world positions
(mirroring is handled there).

usage: python3 tools/measure.py <book> <command> ...
  grid  <piece>                    write build/measure/<piece>.png with u/v gridlines every 0.1 (look at it)
  top   <piece> [u0 u1]            the topmost outline points (e.g. ridge ornaments) inside u0..u1
  color <piece> <u> <v> [tol]      the box of the region whose colour matches the pixel at (u, v)
                                   (e.g. a blank screen, a window, a sign): prints u0 u1 v0 v1
  sheet <image>                    write build/measure/sheet-<image>.png with the shapes cut.py will find,
                                   numbered in manifest order (to fix split / merge / id order)
  contact                          write build/measure/contact.png: every cut piece and sprite with its id
"""
import json, os, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def main():
    book, cmd = os.path.abspath(sys.argv[1]), sys.argv[2]
    out = f'{book}/build/measure'; os.makedirs(out, exist_ok=True)
    if cmd == 'sheet':
        from cut import Cutter
        T = Cutter(book); im = T.load(sys.argv[3]); comps = T.components(im)
        vis = Image.fromarray(im).convert('RGBA'); bg = Image.new('RGBA', vis.size, (255, 255, 255, 255)); bg.alpha_composite(vis)
        d = ImageDraw.Draw(bg)
        for i, (mask, (x, y, w, h)) in enumerate(comps):
            d.rectangle([x, y, x + w, y + h], outline=(200, 30, 30, 255), width=4)
            d.text((x + 8, y + 6), str(i), fill=(200, 30, 30, 255), font_size=48)
        p = f'{out}/sheet-{sys.argv[3]}.png'; bg.convert('RGB').save(p); print(len(comps), 'shapes ->', p); return
    P = json.load(open(f'{book}/build/pieces.json'))
    if cmd == 'contact':
        ids = sorted(P['pieces']) + sorted(P['sprites'])
        S, cols = 220, 8; rows = (len(ids) + cols - 1) // cols
        sheet = Image.new('RGB', (S * cols, (S + 20) * rows), '#8a8a8a'); d = ImageDraw.Draw(sheet)
        for i, k in enumerate(ids):
            im = Image.open(f'{book}/build/a/{k}.webp').convert('RGBA'); im.thumbnail((S - 6, S - 6))
            x, y = (i % cols) * S, (i // cols) * (S + 20)
            sheet.paste(im, (x + 3, y + 3), im); d.text((x + 3, y + S), k, fill='black')
        p = f'{out}/contact.png'; sheet.save(p); print(len(ids), 'pieces ->', p); return
    pid = sys.argv[3]
    info = P['pieces'].get(pid) or P['sprites'].get(pid)
    if info is None: sys.exit('no piece ' + pid)
    W, H = info['w'], info['h']
    im = np.array(Image.open(f'{book}/build/a/{pid}.webp').convert('RGB'))
    if cmd == 'grid':
        vis = Image.fromarray(im); d = ImageDraw.Draw(vis)
        for i in range(1, 10):
            x, y = int(W * i / 10), int(H * (1 - i / 10))
            d.line([x, 0, x, H], fill=(0, 120, 255), width=1); d.line([0, y, W, y], fill=(255, 60, 0), width=1)
            d.text((x + 2, 2), f'u{i / 10:.1f}', fill=(0, 90, 220)); d.text((2, y - 12), f'v{i / 10:.1f}', fill=(220, 50, 0))
        p = f'{out}/{pid}.png'; vis.save(p); print(f'{W}x{H} ->', p)
    elif cmd == 'top':
        u0, u1 = (float(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (0, 1)
        pts = [p for r in info.get('rings', []) if not r['hole'] for p in r['pts'] if u0 * W <= p[0] <= u1 * W]
        pts.sort(key=lambda p: p[1])
        for x, y in pts[:5]: print(f'u {x / W:.4f}  v {(H - 1 - y) / (H - 1):.4f}   (px {x}, {y})')
    elif cmd == 'color':
        u, v = float(sys.argv[4]), float(sys.argv[5]); tol = float(sys.argv[6]) if len(sys.argv) > 6 else 28
        x, y = int(u * (W - 1)), int((1 - v) * (H - 1))
        ref = im[y, x].astype(np.float32)
        m = (np.abs(im.astype(np.float32) - ref).max(axis=2) < tol).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(m, connectivity=4)
        bx, by, bw, bh, ar = st[lab[y, x]]
        print(f'u {bx / W:.3f} .. {(bx + bw) / W:.3f}   v {(H - by - bh) / H:.3f} .. {(H - by) / H:.3f}   ({ar} px of {bw}x{bh})')


if __name__ == '__main__':
    main()
