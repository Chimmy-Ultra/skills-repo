import * as THREE from 'three';
/*%%DATA%%*/
// The build replaces the line above with the book's data:
//   BOOK    the book's settings (book.json): title, binding, colours, fonts, cover, UI strings
//   PIECES  die-cut card outlines {id: {w, h, rings: [{hole, pts}]}} (texture pixels, y down)
//   SPRITES free sprites (no card stock) {id: {w, h}}
//   INFO    per-piece measurements a book's cutting hooks recorded (e.g. a gate's passage)
//   ATLAS   named lists of boxes inside one image (e.g. scattered leaves) {name: [[x, y, w, h], ...]}

// ---------- constants ----------
const PW = 2 / 3;                 // page width (page height = 1); a spread is 2*PW x 1, spine at x = 0
const TEST = window.__TEST__ || null;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
// right-bound (vertical Chinese text, pages turn left-to-right) or left-bound (horizontal text, pages turn right-to-left).
// A left-bound book is the right-bound book seen in a mirror: the page geometry is mirrored, the cards and
// effects sit in a group that mirrors back, and the pages are printed mirrored, so spreads are always
// written in the reader's coordinates.
const LEFT = BOOK.binding === 'left';
const MX = LEFT ? -1 : 1;
const STOCK = BOOK.stock || '#f2ead8';      // card stock (back of the die-cut pieces)
const PAPER = BOOK.paper || '#efe5cf';      // page paper
const INK = BOOK.ink || '#2a2119';
const VERMIL = BOOK.accent || '#a83f2c';
const FONT = 'HWXing';                       // 王漢宗中行書, embedded by the build
const LATIN = BOOK.latinFont || null;        // e.g. 'EB Garamond' for English or physics books
const fontStack = () => (LATIN ? `"${LATIN}", ${FONT}, "Kaiti TC", serif` : `${FONT}, "Kaiti TC", serif`);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t) => t * t * t;
const easeOutBack = (t) => { const c = 1.15; const u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; };
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// critically damped spring step toward target (returns [x, v])
function spring(x, v, target, omega, dt) {
  const f = 1 + 2 * dt * omega, oo = omega * omega, hoo = dt * oo, hhoo = dt * hoo, det = 1 / (f + hhoo);
  const x2 = (f * x + dt * v + hhoo * target) * det;
  const v2 = (v + hoo * (target - x)) * det;
  return [x2, v2];
}
function pointInPoly(pt, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 60));

// ---------- canvas helpers ----------
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
function texFromCanvas(c, { mip = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (!mip) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; }
  return t;
}
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }

// paper fibre tile, drawn once and reused as a pattern on every page
let PAPER_TILE = null;
function paperTile() {
  if (PAPER_TILE) return PAPER_TILE;
  const S = 512, c = makeCanvas(S, S), g = c.getContext('2d'), r = mulberry32(11);
  g.fillStyle = PAPER; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 90; i++) {
    const x = r() * S, y = r() * S, rad = 20 + r() * 110, a = 0.025 * r();
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad);
      gr.addColorStop(0, r() < 0.55 ? `rgba(120,92,52,${a})` : `rgba(255,252,240,${a * 1.6})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x + ox - rad, y + oy - rad, rad * 2, rad * 2);
    }
  }
  g.lineCap = 'round';
  for (let i = 0; i < 2600; i++) {
    const x = r() * S, y = r() * S, l = 2 + r() * 9, an = r() * Math.PI;
    g.strokeStyle = `rgba(${r() < 0.5 ? '96,74,44' : '255,250,236'},${0.05 + r() * 0.08})`; g.lineWidth = 0.5 + r() * 0.7;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); g.stroke();
  }
  PAPER_TILE = c; return c;
}

// ---------- vertical text (columns right-to-left) ----------
const VERT_MAP = { '「': '﹁', '」': '﹂', '『': '﹃', '』': '﹄', '《': '︽', '》': '︾', '（': '︵', '）': '︶' };
const CENTER_PUNCT = new Set(['，', '。', '、', '：', '；', '！', '？']);
// draw a text block. b: {x (right edge of first column), y (top), size, adv (char advance / size), gap (column pitch / size), cols, color, halo}
function drawVText(g, T, k, b) {
  const px = b.size * k, adv = (b.adv || 1.08) * b.size, gap = (b.gap || 1.75) * b.size;
  g.save();
  g.font = `${px.toFixed(1)}px ${fontStack()}`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  b.cols.forEach((col, i) => {
    const cx = b.x - (i + 0.5) * gap - (b.colOffsets ? b.colOffsets[i] || 0 : 0);
    let j = 0;
    for (const ch0 of col) {
      if (ch0 === ' ') { j += 0.5; continue; }
      const ch = VERT_MAP[ch0] || ch0;
      const cy = b.y - (j + 0.5) * adv - (b.yOffsets ? b.yOffsets[i] || 0 : 0);
      let [X, Y] = T(cx, cy);
      if (CENTER_PUNCT.has(ch)) {
        const m = g.measureText(ch);
        X += (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2;
        Y += (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      }
      if (b.halo) { g.lineJoin = 'round'; g.strokeStyle = b.halo; g.lineWidth = px * 0.32; g.strokeText(ch, X, Y); }
      g.fillStyle = b.color || INK; g.fillText(ch, X, Y);
      j += 1;
    }
  });
  g.restore();
  // the block's box, and one box per column (what the layout audit checks against cards)
  const lens = b.cols.map((c) => [...c].reduce((a, ch) => a + (ch === ' ' ? 0.5 : 1), 0));
  const parts = b.cols.map((c, i) => { const cx = b.x - (i + 0.5) * gap; return { x0: cx - b.size * 0.55, x1: cx + b.size * 0.55, y0: b.y - lens[i] * adv, y1: b.y }; });
  return { x0: b.x - b.cols.length * gap, x1: b.x, y0: b.y - Math.max(...lens) * adv, y1: b.y, parts };
}

// ---------- horizontal text ----------
// b: {x, y (top), w (wrap width), size, lh (line height / size), pgap (paragraph gap / size), paras: [string],
//     color, accent, align ('left' | 'center' | 'right'; x is the left edge, centre or right edge), weight, italic}
// [[...]] in a paragraph marks words drawn in the accent colour. CJK breaks anywhere, Latin at spaces;
// closing punctuation never starts a line.
const NO_START = new Set([...'，。、；：！？）」』》〉,.;:!?)]\'"…—']);
function tokenize(text) {
  const out = []; let acc = false, word = '';
  const push = (t) => { if (t) out.push({ t, acc }); };
  for (let i = 0; i < text.length; i++) {
    if (text.startsWith('[[', i)) { push(word); word = ''; acc = true; i++; continue; }
    if (text.startsWith(']]', i)) { push(word); word = ''; acc = false; i++; continue; }
    const ch = text[i], cjk = ch.charCodeAt(0) > 0x2e7f;
    if (cjk) { push(word); word = ''; push(ch); }
    else if (ch === ' ') { word += ' '; push(word); word = ''; }
    else word += ch;
  }
  push(word);
  return out;
}
function layoutHText(g, k, b) {
  const W = b.w * k, lines = [];
  for (const para of b.paras) {
    let line = [], lw = 0;
    for (const tk of tokenize(para)) {
      const w = g.measureText(tk.t).width;
      if (lw + w > W && line.length && !NO_START.has(tk.t[0])) {
        while (line.length && line[line.length - 1].t.endsWith(' ') && line[line.length - 1].t.trim() === '') line.pop();
        lines.push({ toks: line, w: lw }); line = []; lw = 0;
        if (tk.t.trim() === '') continue;
      }
      line.push({ ...tk, w }); lw += w;
    }
    lines.push({ toks: line, w: lw, end: true });
  }
  return lines;
}
function drawHText(g, T, k, b) {
  const px = b.size * k, lh = (b.lh || 1.55) * b.size, pg = (b.pgap ?? 0.45) * b.size;
  g.save();
  g.font = `${b.italic ? 'italic ' : ''}${b.weight || 400} ${px.toFixed(1)}px ${fontStack()}`;
  g.textBaseline = 'middle'; g.textAlign = 'left';
  const lines = layoutHText(g, k, b);
  let y = b.y, maxw = 0;
  const parts = [];
  for (const L of lines) {
    const [X0, Y] = T(b.x, y - lh / 2);
    const lw = L.toks.reduce((a, t) => a + t.w, 0); maxw = Math.max(maxw, lw);
    let X = b.align === 'center' ? X0 - lw / 2 : b.align === 'right' ? X0 - lw : X0;
    if (lw) parts.push({ x0: X / k - PW, x1: (X + lw) / k - PW, y0: y - lh / 2 - b.size * 0.5, y1: y - lh / 2 + b.size * 0.5 });
    for (const t of L.toks) {
      if (b.halo) { g.lineJoin = 'round'; g.strokeStyle = b.halo; g.lineWidth = px * 0.3; g.strokeText(t.t, X, Y); }
      g.fillStyle = t.acc ? (b.accent || VERMIL) : (b.color || INK); g.fillText(t.t, X, Y); X += t.w;
    }
    y -= lh + (L.end ? pg : 0);
  }
  g.restore();
  const w = maxw / k, x0 = b.align === 'center' ? b.x - w / 2 : b.align === 'right' ? b.x - w : b.x;
  return { x0, x1: x0 + w, y0: y + pg, y1: b.y, parts };
}

// ---------- equations (TeX, typeset by MathJax into SVG before the pages are printed) ----------
const EQ = new Map();   // key -> {img, w, h} (w, h in em)
const eqKey = (b) => `${b.eq}|${b.color || INK}`;
async function prepareEquations(blocks) {
  if (!blocks.length) return;
  if (!window.MathJax || !window.MathJax.tex2svg) {
    window.MathJax = { svg: { fontCache: 'none', exFactor: 0.5 }, startup: { typeset: false } };
    await new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js'; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
    await window.MathJax.startup.promise;
  }
  await Promise.all(blocks.map(async (b) => {
    const key = eqKey(b); if (EQ.has(key)) return;
    const svg = window.MathJax.tex2svg(b.eq, { display: true }).querySelector('svg');
    const wEm = parseFloat(svg.getAttribute('width')) * 0.5, hEm = parseFloat(svg.getAttribute('height')) * 0.5;
    const PX = 160;   // rasterise at 160 px per em: sharp at the largest page scale
    svg.setAttribute('width', (wEm * PX).toFixed(1)); svg.setAttribute('height', (hEm * PX).toFixed(1));
    const src = new XMLSerializer().serializeToString(svg).replaceAll('currentColor', b.color || INK);
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src); });
    EQ.set(key, { img, w: wEm, h: hEm });
  }));
}
// b: {eq, x, y (top), size (em, page units), align, color}
function drawEq(g, T, k, b) {
  const e = EQ.get(eqKey(b));
  if (!e) return null;
  const w = e.w * b.size, h = e.h * b.size;
  const x0 = b.align === 'center' ? b.x - w / 2 : b.align === 'right' ? b.x - w : b.x;
  const [X, Y] = T(x0, b.y);
  g.drawImage(e.img, X, Y, w * k, h * k);
  return { x0, x1: x0 + w, y0: b.y - h, y1: b.y };
}
// one printed text block of any kind
function drawBlock(g, T, k, b) { return b.eq ? drawEq(g, T, k, b) : b.paras ? drawHText(g, T, k, b) : drawVText(g, T, k, b); }
