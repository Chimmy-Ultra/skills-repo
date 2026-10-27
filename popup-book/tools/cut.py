"""Cut a book's generated art into die-cut card pieces, sprites and flat textures.

usage: python3 tools/cut.py examples/bianjing

Reads <book>/art/manifest.json and the images in its source folders; writes <book>/build/a/<id>.webp and
<book>/build/pieces.json = {pieces, sprites, info, atlas, flats}.

A card piece: the print composited on card stock (WebP) + its silhouette polygon with a paper margin, in
texture pixels (y down), its foot cut flat so it stands on the page.
A sprite: trimmed RGBA, no card stock (birds, puppets, anything that floats).

manifest items (one per line of work):
  {"piece": id, "from": image, cap, margin, keep_holes, close_k, boost, repeat}
        one subject on its own image. repeat: tile a strip n times (alternate tiles mirrored) to make it longer
  {"sheet": [id, ...], "from": image, cap, margin, grow, split: {"k": [lo, hi]}, merge: {"src": dst}, sprite: bool, cards: {id: cap}}
        several subjects on one image, found as connected shapes and ordered row by row, left to right.
        null ids are skipped. split: cut shape k at the emptiest column between lo..hi of its width;
        merge: join shape src into shape dst (a ball that came loose from its player).
        sprite: true makes them sprites; cards lists ids that stay cards (with their own cap)
  {"sprite": id, "from": image, cap}
  {"flat": id, "from": image, quality}          a plain texture (cover, backgrounds), RGB WebP
  {"water": id, "from": image}                  a seamless grey ripple tile for planCtx.water()
  {"atlas": name, "from": image, scale}         one image of scattered small things (leaves) + their boxes
"hooks": "hooks.py" runs a book's own Python for special cases (see examples/bianjing/art/hooks.py).
"""
import json, os, sys
import cv2
import numpy as np
from PIL import Image


class Cutter:
    def __init__(self, book_dir):
        self.book = os.path.abspath(book_dir)
        self.man = json.load(open(f'{self.book}/art/manifest.json', encoding='utf-8'))
        self.src = [os.path.join(self.book, 'art', d) for d in self.man.get('src', ['../art-src'])]
        self.out = f'{self.book}/build'
        os.makedirs(f'{self.out}/a', exist_ok=True)
        self.stock = np.array(self.hex(self.man.get('stock', '#f2ead8')), np.float32)
        self.pieces, self.sprites, self.info, self.atlas, self.flats = {}, {}, {}, {}, {}

    @staticmethod
    def hex(h):
        n = int(h[1:], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]

    def path(self, name):
        for d in self.src:
            for ext in ('.png', '.webp', '.jpg'):
                p = os.path.join(d, name + ext)
                if os.path.exists(p): return p
        raise FileNotFoundError(name + ' in ' + ', '.join(self.src))

    def load(self, name):
        return np.array(Image.open(self.path(name)).convert('RGBA'))

    # ---- shapes on a sheet ----
    @staticmethod
    def components(rgba, min_area=1500, grow=9):
        m = (rgba[..., 3] > 40).astype(np.uint8)
        grp = cv2.dilate(m, np.ones((grow, grow), np.uint8))
        n, lab, st, _ = cv2.connectedComponentsWithStats(grp)
        comps = [(i, st[i]) for i in range(1, n) if st[i][4] > min_area]
        comps.sort(key=lambda c: (round((c[1][1] + c[1][3] / 2) / 300), c[1][0]))
        return [(((lab == i) & (m > 0)).astype(np.uint8), tuple(int(v) for v in s[:4])) for i, s in comps]

    # ---- a card piece ----
    def cut(self, pid, rgba, mask=None, cap=900, margin=6, keep_holes=0, hole_mask=None, flat_foot=True, close_k=5, boost=1.0):
        """rgba: full source; mask: which pixels belong to this piece (else alpha > 128).
        keep_holes: holes in the silhouette larger than this many pixels stay open (0: fill them all);
        hole_mask: pixels to cut through (e.g. a gate passage), kept dark in the print."""
        a = rgba[..., 3]
        own = (a > 128).astype(np.uint8) if mask is None else (mask & (a > 128)).astype(np.uint8)
        if hole_mask is not None:
            own = own & (1 - hole_mask)
        ys, xs = np.nonzero(own)
        pad = margin + 4
        x0, y0 = max(0, xs.min() - pad), max(0, ys.min() - pad)
        x1, y1 = min(rgba.shape[1], xs.max() + pad + 1), min(rgba.shape[0], ys.max() + pad + 1)
        own = own[y0:y1, x0:x1]
        src = rgba[y0:y1, x0:x1].astype(np.float32)
        hm = None if hole_mask is None else hole_mask[y0:y1, x0:x1]
        foot = int(np.nonzero(own.any(axis=1))[0].max())
        # silhouette: close tiny gaps, add a paper margin, fill small holes
        m = cv2.morphologyEx(own, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (close_k, close_k)))
        m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * margin + 1, 2 * margin + 1)))
        inv = (1 - m).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
        for i in range(1, n):
            bx, by, bw, bh, ar = st[i]
            edge = bx == 0 or by == 0 or bx + bw == m.shape[1] or by + bh == m.shape[0]
            if not edge and (ar < keep_holes or keep_holes == 0):
                m[lab == i] = 1
        if hm is not None:   # cut-through holes stay open, with a thin margin of paper kept around
            hole = cv2.erode(hm, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
            m = m & (1 - hole)
        if flat_foot:
            m[foot + 1:, :] = 0
        m = (cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.4) > 0.5).astype(np.uint8)
        if flat_foot:
            m[foot + 1:, :] = 0
        # texture: print composited on card stock; outside the print = card stock
        al = np.clip(src[..., 3:4] / 255.0 * boost, 0, 1)
        rgb = src[..., :3] * al + self.stock * (1 - al)
        if hm is not None:
            rgb[hm > 0] = rgb[hm > 0] * 0.15 + np.array([20, 16, 12]) * 0.85
        ys, xs = np.nonzero(m)
        cx0, cy0, cx1, cy1 = xs.min(), ys.min(), xs.max() + 1, foot + 1 if flat_foot else ys.max() + 1
        m = m[cy0:cy1, cx0:cx1]; rgb = rgb[cy0:cy1, cx0:cx1]
        h, w = m.shape
        s = min(1.0, cap / max(w, h))
        W, H = max(2, round(w * s)), max(2, round(h * s))
        rgb_s = cv2.resize(rgb, (W, H), interpolation=cv2.INTER_AREA)
        m_s = (cv2.resize(m.astype(np.float32), (W, H), interpolation=cv2.INTER_AREA) > 0.5).astype(np.uint8)
        m_s[-1:, :] = m_s[-2:-1, :]   # keep the foot row
        Image.fromarray(np.clip(rgb_s, 0, 255).astype(np.uint8)).save(f'{self.out}/a/{pid}.webp', quality=86, method=6)
        cs, hier = cv2.findContours(m_s, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        rings = []
        for i, c in enumerate(cs):
            if cv2.contourArea(c) < 12:
                continue
            c = cv2.approxPolyDP(c, 0.65, True)[:, 0, :]
            if len(c) < 3:
                continue
            rings.append({'hole': bool(hier[0][i][3] >= 0), 'pts': c.astype(int).tolist()})
        self.pieces[pid] = {'w': W, 'h': H, 'rings': rings, 'src': [int(x0 + cx0), int(y0 + cy0), round(s, 5)]}
        print(f'card   {pid:16s} {W:5d}x{H:<5d} rings {len(rings):2d} holes {sum(r["hole"] for r in rings)}')
        return self.pieces[pid]

    # ---- a free sprite ----
    def sprite(self, pid, rgba, mask=None, cap=400, margin=0):
        a = rgba[..., 3]
        own = (a > 20) if mask is None else (mask.astype(bool) & (a > 20))
        ys, xs = np.nonzero(own)
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        im = rgba[y0:y1, x0:x1].copy()
        im[..., 3] = np.where(own[y0:y1, x0:x1], im[..., 3], 0)
        h, w = im.shape[:2]; s = min(1.0, cap / max(w, h))
        W, H = max(2, round(w * s)), max(2, round(h * s))
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        Image.fromarray(im).save(f'{self.out}/a/{pid}.webp', quality=88, method=6)
        self.sprites[pid] = {'w': W, 'h': H}
        print(f'sprite {pid:16s} {W}x{H}')

    def strip(self, name, reps):
        im = self.load(name)
        return np.concatenate([im if i % 2 == 0 else im[:, ::-1] for i in range(reps)], axis=1)

    def sheet(self, name, ids, cap, split=None, margin=6, grow=9, merge=None, sprite=False, cards=None):
        im = self.load(name)
        comps = self.components(im, grow=grow)
        if merge:
            merge = {int(k): int(v) for k, v in merge.items()}
            for s_i, d_i in merge.items():
                comps[d_i] = (comps[d_i][0] | comps[s_i][0], comps[d_i][1])
            comps = [c for i, c in enumerate(comps) if i not in merge]
        split = {int(k): v for k, v in (split or {}).items()}
        out = []
        for k, (mask, box) in enumerate(comps):
            if k in split:   # split a merged shape at the emptiest column inside the given range
                lo, hi = split[k]; x, y, w, h = box
                col = (mask * (im[..., 3] > 128))[:, x + int(w * lo): x + int(w * hi)].sum(axis=0)
                cx = x + int(w * lo) + int(np.argmin(col))
                left = mask.copy(); left[:, cx:] = 0
                right = mask.copy(); right[:, :cx] = 0
                out += [left, right]
            else:
                out.append(mask)
        if len(out) != len(ids):
            raise SystemExit(f'{name}: found {len(out)} shapes, manifest names {len(ids)}. Adjust grow/split/merge, or the ids.')
        for mask, pid in zip(out, ids):
            if not pid: continue
            if sprite and not (cards and pid in cards): self.sprite(pid, im, mask=mask, cap=cap)
            else: self.cut(pid, im, mask=mask, cap=(cards or {}).get(pid, cap), margin=margin)

    def flat(self, pid, name, quality=88):
        Image.open(self.path(name)).convert('RGB').save(f'{self.out}/a/{pid}.webp', quality=quality, method=6)
        self.flats[pid] = True; print(f'flat   {pid}')

    def water(self, pid, name):
        w = np.array(Image.open(self.path(name)).convert('RGB')).astype(np.float32)
        lum = (w @ np.array([0.299, 0.587, 0.114], np.float32)) / 255.0
        lum = (lum - lum.mean()) / (lum.std() + 1e-6)
        tile = np.concatenate([np.concatenate([lum, lum[:, ::-1]], 1), np.concatenate([lum[::-1], lum[::-1, ::-1]], 1)], 0)  # mirrored 2x2: seamless
        tile = cv2.resize(tile, (1024, 1024), interpolation=cv2.INTER_AREA)
        ink = np.clip(0.5 + 0.5 * tile * 0.5, 0, 1)
        Image.fromarray((ink * 255).astype(np.uint8), 'L').save(f'{self.out}/a/{pid}.webp', quality=85, method=6)
        self.flats[pid] = True; print(f'water  {pid}')

    def atlas_of(self, pid, name, scale=0.5):
        im = self.load(name)
        im_s = cv2.resize(im, (int(im.shape[1] * scale), int(im.shape[0] * scale)), interpolation=cv2.INTER_AREA)
        Image.fromarray(im_s).save(f'{self.out}/a/{pid}.webp', quality=86, method=6)
        m = (im[..., 3] > 40).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(m, np.ones((9, 9), np.uint8)))
        self.atlas[pid] = [[int(st[i][0] * scale), int(st[i][1] * scale), int(st[i][2] * scale), int(st[i][3] * scale)] for i in range(1, n) if st[i][4] > 1500]
        self.flats[pid] = True; print(f'atlas  {pid}: {len(self.atlas[pid])} boxes')

    def run(self):
        opts = lambda it, keys: {k: it[k] for k in keys if k in it}
        for it in self.man['items']:
            if 'piece' in it:
                im = self.strip(it['from'], it['repeat']) if it.get('repeat') else self.load(it['from'])
                self.cut(it['piece'], im, **opts(it, ['cap', 'margin', 'keep_holes', 'close_k', 'boost', 'flat_foot']))
            elif 'sheet' in it:
                self.sheet(it['from'], it['sheet'], it.get('cap', 400), **opts(it, ['split', 'margin', 'grow', 'merge', 'sprite', 'cards']))
            elif 'sprite' in it:
                self.sprite(it['sprite'], self.load(it['from']), cap=it.get('cap', 400))
            elif 'flat' in it:
                self.flat(it['flat'], it['from'], it.get('quality', 88))
            elif 'water' in it:
                self.water(it['water'], it['from'])
            elif 'atlas' in it:
                self.atlas_of(it['atlas'], it['from'], it.get('scale', 0.5))
        if self.man.get('hooks'):
            env = {'T': self, 'np': np, 'cv2': cv2, 'Image': Image}
            exec(open(f'{self.book}/art/{self.man["hooks"]}', encoding='utf-8').read(), env)
            env['run'](self)
        json.dump({'pieces': self.pieces, 'sprites': self.sprites, 'info': self.info, 'atlas': self.atlas, 'flats': self.flats},
                  open(f'{self.out}/pieces.json', 'w'))
        tot = sum(os.path.getsize(f'{self.out}/a/{f}') for f in os.listdir(f'{self.out}/a'))
        print(f'{len(self.pieces)} cards, {len(self.sprites)} sprites, {len(self.flats)} flats; webp {tot / 1e6:.1f} MB')


if __name__ == '__main__':
    Cutter(sys.argv[1] if len(sys.argv) > 1 else '.').run()
