// ---------- printed pages ----------
// Each spread is printed into two page canvases (left / right). The "rest" canvas holds the plan, labels and text;
// the "fold" canvas adds the folded die-cut pieces so that they curl together with the page during a turn.
const PLAN_IMG = {};          // images printed in plans (spread.planImages, BOOK.planImages), loaded before the pages are drawn
const waterTiles = new Map();
// a grey ripple tile: the book's 'water' image if it has one, else a drawn one
function waterSource() {
  if (PLAN_IMG.water) return PLAN_IMG.water;
  if (waterSource.c) return waterSource.c;
  const S = 512, c = makeCanvas(S, S), g = c.getContext('2d'), r = mulberry32(3);
  g.fillStyle = '#7f7f7f'; g.fillRect(0, 0, S, S); g.lineCap = 'round';
  for (let i = 0; i < 900; i++) {
    const x = r() * S, y = r() * S, l = 8 + r() * 30, a = 0.08 + r() * 0.16;
    g.strokeStyle = r() < 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`; g.lineWidth = 1 + r() * 2;
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { g.beginPath(); g.moveTo(x + ox, y + oy); g.quadraticCurveTo(x + ox + l / 2, y + oy - 3, x + ox + l, y + oy); g.stroke(); }
  }
  return (waterSource.c = c);
}
function waterTile(light, dark) {
  const key = light + dark;
  if (waterTiles.has(key)) return waterTiles.get(key);
  const src = waterSource(), S = src.width, c = makeCanvas(S, S), g = c.getContext('2d');
  g.drawImage(src, 0, 0);
  const d = g.getImageData(0, 0, S, S), a = d.data;
  const L = new THREE.Color(light), Dk = new THREE.Color(dark);
  const lr = L.r * 255, lg = L.g * 255, lb = L.b * 255, dr = Dk.r * 255, dg = Dk.g * 255, db = Dk.b * 255;
  for (let i = 0; i < a.length; i += 4) {
    const t = Math.pow(a[i] / 255, 1.6);
    a[i] = lr + (dr - lr) * t; a[i + 1] = lg + (dg - lg) * t; a[i + 2] = lb + (db - lb) * t; a[i + 3] = 255;
  }
  g.putImageData(d, 0, 0);
  waterTiles.set(key, c); return c;
}

// drawing context handed to each spread's plan(): world coordinates in, canvas pixels out
function planCtx(g, k) {
  const T = (x, y) => [(x + PW) * k, (0.5 - y) * k];
  const L = (v) => v * k;
  const path = (pts, close = true) => { g.beginPath(); pts.forEach((p, i) => { const [X, Y] = T(p[0], p[1]); i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); if (close) g.closePath(); };
  // a band of half-width hw around a polyline, returned as a polygon
  const band = (pts, hw) => {
    const left = [], right = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      left.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]); right.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
    }
    return { poly: [...left, ...right.reverse()], left, right: right.reverse() };
  };
  const line = (pts, color, w, dash) => { g.save(); path(pts, false); g.strokeStyle = color; g.lineWidth = L(w); g.lineCap = 'round'; g.lineJoin = 'round'; if (dash) g.setLineDash(dash.map(L)); g.stroke(); g.restore(); };
  const fill = (pts, color) => { path(pts); g.fillStyle = color; g.fill(); };
  const water = (poly, light, dark, scale = 0.42, ripple = true) => {
    g.save(); path(poly); g.clip();
    const pat = g.createPattern(waterTile(light, dark), 'repeat');
    const sc = (scale * k) / waterSource().width; pat.setTransform(new DOMMatrix([sc, 0, 0, sc, 0, 0]));
    g.fillStyle = pat; g.globalAlpha = 0.9; g.fillRect(0, 0, g.canvas.width, g.canvas.height); g.restore();
  };
  const road = (pts, hw, { tone = 'rgba(196,168,118,0.30)', edge = 'rgba(42,33,25,0.55)', pave = 0.024 } = {}) => {
    const b = band(pts, hw);
    fill(b.poly, tone);
    line(b.left, edge, 0.0016); line(b.right, edge, 0.0016);
    if (pave) {  // faint paving joints across the road
      let acc = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], c = pts[i], seg = Math.hypot(c[0] - a[0], c[1] - a[1]);
        const dx = (c[0] - a[0]) / seg, dy = (c[1] - a[1]) / seg;
        for (let s = pave - (acc % pave); s < seg; s += pave) {
          const px = a[0] + dx * s, py = a[1] + dy * s;
          line([[px - dy * hw, py + dx * hw], [px + dy * hw, py - dx * hw]], 'rgba(42,33,25,0.07)', 0.0009);
        }
        acc += seg;
      }
    }
    return b;
  };
  // printed text is recorded (rects, plan coordinates) so the audit can tell when a card hides it
  const rects = [];
  const note = (r, kind, text) => { if (r) for (const q of r.parts || [r]) rects.push({ x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, kind, text }); return r; };
  // label: a short vertical label, its column centred on x; hlabel: horizontal, centred on (x, y)
  const label = (text, x, y, size = 0.0245, color = INK) => note(drawVText(g, T, k, { x: x + size * 0.9, y, size, cols: [text], color, halo: hexA(PAPER, 0.92), gap: 1.8 }), 'label', text);
  const hlabel = (text, x, y, size = 0.0245, color = INK) => note(drawHText(g, T, k, { x, y: y + size * 0.78, w: 2, size, lh: 1.56, paras: [text], color, align: 'center', halo: hexA(PAPER, 0.92) }), 'label', text);
  const wash = (pts, color, blur = 0.01) => { g.save(); g.filter = `blur(${(blur * k).toFixed(1)}px)`; fill(pts, color); g.restore(); };
  // an image from PLAN_IMG (or a box of it) printed flat on the page: x, y = top-left corner, w = width
  const img = (id, x, y, w, box = null) => {
    const im = PLAN_IMG[id]; if (!im) return;
    const [sx, sy, sw, sh] = box || [0, 0, im.width, im.height], h = (w * sh) / sw, [X, Y] = T(x, y);
    g.drawImage(im, sx, sy, sw, sh, X, Y, L(w), L(h));
  };
  const rnd = mulberry32(7);
  // text(b): print a block; a block with y: null flows below the previous block (gap: b.space)
  let last = null;
  const text = (b) => {
    if (b.y == null) b = { ...b, y: last ? last.y0 - (b.space ?? 0.012) : 0.4 };
    const r = drawBlock(g, T, k, b); if (r) last = r;
    return note(r, 'text', b.cols ? b.cols.join('') : b.paras ? b.paras.join(' ') : b.eq || '');
  };
  return { g, k, T, L, path, band, line, fill, water, road, label, hlabel, wash, img, rnd, rects, text };
}

class PageArt {
  constructor(spread, k) {
    this.spread = spread; this.k = k;
    const w = Math.round(PW * k), h = Math.round(k);
    this.w = w; this.h = h;
    this.rest = [makeCanvas(w, h), makeCanvas(w, h)];
    this.fold = [makeCanvas(w, h), makeCanvas(w, h)];
    this.restTex = this.rest.map((c) => texFromCanvas(c, { mip: false }));   // shown 1:1 at rest: no mip blending
    this.foldTex = this.fold.map((c) => texFromCanvas(c));
    this.foldKey = '';
  }
  draw() {
    const k = this.k, W = this.w * 2, H = this.h;
    const c = makeCanvas(W, H), g = c.getContext('2d');
    // paper
    g.fillStyle = g.createPattern(paperTile(), 'repeat'); g.fillRect(0, 0, W, H);
    const r = mulberry32(this.spread.seed || 3);
    for (let i = 0; i < 60; i++) {
      const x = r() * W, y = r() * H, rad = (0.05 + r() * 0.25) * k, a = 0.03 * r();
      const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, r() < 0.6 ? `rgba(130,96,50,${a})` : `rgba(255,250,235,${a * 1.5})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    const ctx = planCtx(g, k);
    this.spread.plan && this.spread.plan(ctx);
    for (const t of this.spread.texts || []) ctx.text(t);
    this.rects = ctx.rects;
    // frame (版框) on each page
    const fm = 0.03;
    g.strokeStyle = 'rgba(42,33,25,0.78)';
    for (const side of [-1, 1]) {
      const xa = side < 0 ? -PW + fm : fm * 0.55, xb = side < 0 ? -fm * 0.55 : PW - fm;
      const [X0, Y0] = ctx.T(xa, 0.5 - fm), [X1, Y1] = ctx.T(xb, -0.5 + fm);
      g.lineWidth = 0.0036 * k; g.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
      const i = 0.0075, [x0, y0] = ctx.T(xa + i, 0.5 - fm - i), [x1, y1] = ctx.T(xb - i, -0.5 + fm + i);
      g.lineWidth = 0.0011 * k; g.strokeRect(x0, y0, x1 - x0, y1 - y0);
    }
    // gutter: the paper dips into the spine
    const gx = this.w, gw = 0.07 * k;
    let gr = g.createLinearGradient(gx - gw, 0, gx, 0);
    gr.addColorStop(0, 'rgba(70,48,24,0)'); gr.addColorStop(0.7, 'rgba(70,48,24,0.07)'); gr.addColorStop(1, 'rgba(70,48,24,0.22)');
    g.fillStyle = gr; g.fillRect(gx - gw, 0, gw, H);
    gr = g.createLinearGradient(gx, 0, gx + gw, 0);
    gr.addColorStop(0, 'rgba(70,48,24,0.20)'); gr.addColorStop(0.3, 'rgba(70,48,24,0.06)'); gr.addColorStop(1, 'rgba(70,48,24,0)');
    g.fillStyle = gr; g.fillRect(gx, 0, gw, H);
    // split into the two page canvases (a left-bound book is printed mirrored: see LEFT)
    for (let s = 0; s < 2; s++) {
      const pg = this.rest[s].getContext('2d'); pg.clearRect(0, 0, this.w, H);
      if (LEFT) { pg.setTransform(-1, 0, 0, 1, this.w, 0); pg.drawImage(c, -(1 - s) * this.w, 0); pg.setTransform(1, 0, 0, 1, 0, 0); }
      else pg.drawImage(c, -s * this.w, 0);
      this.restTex[s].needsUpdate = true;
    }
    this.foldKey = '';
  }
  // print the folded pieces (art face-up) onto the fold canvases, far pieces first
  bakeFold(cards, bookGroup) {
    const k = this.k, H = this.h, wp = V3();
    const items = cards.filter((c) => !c.def.noBake && c.root.scale.x > 0.01 && c.mat.map && c.mat.map.image).map((c) => { c.root.getWorldPosition(wp); return { c, y: wp.y, A: c.foldedAffine(bookGroup) }; });
    items.sort((a, b) => b.y - a.y);
    for (let s = 0; s < 2; s++) {
      const g = this.fold[s].getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, this.w, H); g.drawImage(this.rest[s], 0, 0);
      const ox = s === 0 ? PW : 0;
      for (const { c, A } of items) {
        const [a, b, cc, d, e, f] = A, p = c.p;
        // cull pieces that do not touch this page
        const xs = [e, e + a * p.w, e + cc * p.h, e + a * p.w + cc * p.h];
        if (Math.max(...xs) + ox < -0.01 || Math.min(...xs) + ox > PW + 0.01) continue;
        g.setTransform(k * a, -k * b, k * cc, -k * d, k * (e + ox), k * (0.5 - f));
        g.beginPath();
        for (const r of p.rings) { r.pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }
        g.save();
        g.shadowColor = 'rgba(48,32,16,0.28)'; g.shadowBlur = 0.0035 * k; g.shadowOffsetX = 0.0012 * k; g.shadowOffsetY = 0.0014 * k;
        g.fillStyle = STOCK; g.fill('evenodd');
        g.restore();
        g.save(); g.clip('evenodd'); g.drawImage(c.mat.map.image, 0, 0); g.restore();
        g.strokeStyle = 'rgba(90,66,40,0.3)'; g.lineWidth = 0.0008 / Math.hypot(a, b); g.stroke();
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      this.foldTex[s].needsUpdate = true;
    }
  }
}
