// ======================= a flat text book =======================
// No pop-up cards: every spread is two printed pages. Each page is a list of items that flow from the top:
//   { kicker }  small red line above a title          { h1 }  page title          { h2 }  section heading
//   { p }       paragraph ([[...]] = accent colour)   { eq, size }  display equation (TeX)
//   { fig, w, cap }  a Gemini plate printed flat      { table: { cols, head, rows, align } }
//   { chart: (c, x, yTop, w) => height }               { note }  small grey text      { gap }
const PG = { L: -0.6, R: 0.072, W: 0.53, TOP: 0.448 };
const TXT = { body: 0.0238, lh: 1.5, h1: 0.04, h2: 0.027, note: 0.0178 };
const TONE = { gold: '#b88c3a', silver: '#98a2ab', pd: '#7f858c', blue: '#2d5f73', grey: '#b9b2a4', red: '#9b3b2a' };
const fmtN = (v, d = 0) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

function flow(c, x, items, w = PG.W, y0 = PG.TOP, k = 1) {
  let y = y0;
  const imgH = [];   // heights of the plates as printed (for fitPlates)
  const put = (b) => { const r = c.text({ x, w, ...b, y }); if (r) y = r.y0; return r; };
  for (const it of items) {
    if (it.kicker) { put({ size: 0.0165, lh: 1.4, paras: [it.kicker], color: VERMIL }); y -= 0.006; }
    else if (it.h1) { put({ size: TXT.h1, lh: 1.18, paras: [it.h1], color: INK }); y -= 0.016; }
    else if (it.h2) { y -= 0.006; put({ size: TXT.h2, lh: 1.25, paras: [it.h2], color: INK, italic: true }); y -= 0.008; }
    else if (it.p) { put({ size: TXT.body, lh: TXT.lh, paras: [it.p], color: INK }); y -= 0.011; }
    else if (it.note) { put({ size: TXT.note, lh: 1.45, paras: [it.note], color: '#5a4b3d' }); y -= 0.008; }
    else if (it.eq) {
      const r = c.text({ x: x + w / 2, y: y - 0.002, size: it.size || 0.028, align: 'center', eq: it.eq });
      if (r) y = r.y0 - 0.014;
    }
    else if (it.fig) {
      const im = PLAN_IMG[it.fig]; if (!im) continue;
      const fw0 = it.w || 0.24, fw = Math.min(w, fw0 * k, (0.3 * im.width) / im.height), fh = (fw * im.height) / im.width, fx = x + (it.align === 'left' ? 0 : (w - fw) / 2);
      imgH.push(fh / (fw / fw0));
      c.img(it.fig, fx, y, fw); y -= fh + 0.008;
      if (it.cap) { const r = c.text({ x: x + w / 2, y, w, size: TXT.note, lh: 1.4, italic: true, align: 'center', paras: [it.cap], color: '#5a4b3d' }); if (r) y = r.y0; }
      y -= 0.012;
    }
    else if (it.figs) {   // several plates in a row, all the same height
      const ims = it.figs.map((id) => PLAN_IMG[id]).filter(Boolean), gap = 0.02, h0 = it.h || 0.08;
      const w1 = ims.reduce((a, im) => a + (h0 * im.width) / im.height, 0);
      const fh = Math.min(h0 * k, 0.3, (h0 * (w - gap * (ims.length - 1))) / w1);
      const ws = ims.map((im) => (fh * im.width) / im.height), tot = ws.reduce((a, b) => a + b, 0) + gap * (ims.length - 1);
      imgH.push(h0);
      let fx = x + (w - tot) / 2;
      ims.forEach((im, i) => { c.img(it.figs[i], fx, y, ws[i]); fx += ws[i] + gap; });
      y -= fh + 0.008;
      if (it.cap) { const r = c.text({ x: x + w / 2, y, w, size: TXT.note, lh: 1.4, italic: true, align: 'center', paras: [it.cap], color: '#5a4b3d' }); if (r) y = r.y0; }
      y -= 0.012;
    }
    else if (it.table) y = table(c, x, y, w, it.table) - 0.016;
    else if (it.chart) y -= it.chart(c, x, y, w) + 0.014;
    else if (it.gap) y -= it.gap;
  }
  flow.imgH = imgH;
  return y;
}

// print a page with its plates enlarged to use the empty space at the bottom (a dry run measures first)
const PG_BOTTOM = -0.405;
function fitFlow(c, x, items, w, y0) {
  c.g.save(); c.g.beginPath(); c.g.rect(0, 0, 0, 0); c.g.clip();
  const n0 = c.rects.length, end = flow(c, x, items, w, y0, 1), H = flow.imgH.reduce((a, b) => a + b, 0);
  c.rects.length = n0;
  c.g.restore();
  const k = H > 0 ? Math.max(0.45, Math.min(2.4, 1 + (end - PG_BOTTOM) / H)) : 1;   // shrink plates if the text runs too low
  const end2 = flow(c, x, items, w, y0, k);
  if (end2 < PG_BOTTOM - 0.004) console.warn('page runs under the hint bar: ' + ((items.find((it) => it.h1 || it.h2) || {}).h1 || (items.find((it) => it.h2) || {}).h2) + ' end=' + end2.toFixed(3));
  return end2;
}

// a ruled table; cols: column widths as fractions of w; align: 'l' | 'r' per column
function table(c, x, y, w, t) {
  const size = t.size || 0.0205, pad = t.pad || 0.0065, rule = 'rgba(42,33,25,0.75)', hair = 'rgba(42,33,25,0.18)';
  const stub = t.stub !== false && t.head[0] === '';   // a first column of row labels
  const xs = []; let acc = 0; t.cols.forEach((f) => { xs.push(x + acc * w); acc += f; });
  const box = (y0, y1, fill) => c.fill([[x, y0], [x + w, y0], [x + w, y1], [x, y1]], fill);
  // measure a row on a clipped dry run, then paint its background and print it
  const row = (cells, kind, band) => {
    const print = () => {
      let low = y;
      cells.forEach((txt, i) => {
        const cw = t.cols[i] * w - pad * 2, right = (t.align || [])[i] === 'r';
        const label = kind === 'head' || (stub && i === 0);
        const r = c.text({ x: right ? xs[i] + t.cols[i] * w - pad : xs[i] + pad, y: y - pad, w: cw, size: kind === 'head' ? size * 1.02 : size, lh: 1.32,
          align: right ? 'right' : 'left', paras: [String(txt)], color: label ? '#2a2119' : '#3a2f25', weight: label ? 600 : 400 });
        if (r) low = Math.min(low, r.y0);
      });
      return low - pad;
    };
    c.g.save(); c.g.beginPath(); c.g.rect(0, 0, 0, 0); c.g.clip();
    const n0 = c.rects.length, low = print(); c.rects.length = n0;
    c.g.restore();
    if (kind === 'head') box(y, low, 'rgba(120,92,52,0.13)');
    else if (band) box(y, low, 'rgba(120,92,52,0.05)');
    y = print();
  };
  c.line([[x, y], [x + w, y]], rule, 0.0018);
  row(t.head, 'head');
  c.line([[x, y], [x + w, y]], rule, 0.0011);
  t.rows.forEach((r, k) => {
    if (k) c.line([[x, y], [x + w, y]], hair, 0.0008);
    row(r, 'body', k % 2 === 1);
  });
  c.line([[x, y], [x + w, y]], rule, 0.0018);
  return y;
}

// horizontal bars: rows [{ label, v, tone }]; returns the height used
function hbars(rows, { max, fmt = (v) => fmtN(v), labelW = 0.36, barH = 0.022, gap = 0.012, size = 0.0185 } = {}) {
  return (c, x, y, w) => {
    const vmax = max || Math.max(...rows.map((r) => r.v)), x0 = x + labelW * w, bw = w * (1 - labelW) - 0.075;
    rows.forEach((r, i) => {
      const yy = y - i * (barH + gap) - 0.004, len = (r.v / vmax) * bw;
      c.text({ x: x0 - 0.008, y: yy + 0.001, w: labelW * w, size, lh: 1.2, align: 'right', paras: [r.label], color: INK });
      c.fill([[x0, yy], [x0 + len, yy], [x0 + len, yy - barH], [x0, yy - barH]], r.tone || TONE.gold);
      c.text({ x: x0 + len + 0.007, y: yy + 0.001, w: 0.1, size, lh: 1.2, paras: [fmt(r.v)], color: '#4a3d30' });
    });
    return rows.length * (barH + gap);
  };
}

// vertical bars over a labelled x axis: rows [{ x: label, v, tone }]; ref: { v, label } dashed line
function vbars(rows, { max, h = 0.2, ticks = [], fmt = (v) => fmtN(v), ref = null, size = 0.016, slot = null } = {}) {
  return (c, x, y, w) => {
    const vmax = max || Math.max(...rows.map((r) => r.v)), x0 = x + 0.06, x1 = x + w - 0.01, base = y - h - 0.012;
    const n = slot || rows.length, sw = (x1 - x0) / n, bw = sw * 0.62, Y = (v) => base + (v / vmax) * h;
    ticks.forEach((t) => { c.line([[x0, Y(t)], [x1, Y(t)]], 'rgba(42,33,25,0.14)', 0.0009); c.text({ x: x0 - 0.008, y: Y(t) + size * 0.6, w: 0.06, size, lh: 1.2, align: 'right', paras: [fmt(t)], color: '#5a4b3d' }); });
    rows.forEach((r, i) => {
      const k = r.at ?? i, cx = x0 + sw * (k + 0.5);
      c.fill([[cx - bw / 2, base], [cx + bw / 2, base], [cx + bw / 2, Y(r.v)], [cx - bw / 2, Y(r.v)]], r.tone || TONE.gold);
      c.text({ x: cx, y: base - 0.006, w: sw * 1.6, size, lh: 1.2, align: 'center', paras: [r.x], color: '#4a3d30' });
      if (r.show) c.text({ x: cx, y: Y(r.v) + size * 1.35, w: sw * 2, size, lh: 1.2, align: 'center', paras: [fmt(r.v)], color: INK });
    });
    c.line([[x0, base], [x1, base]], 'rgba(42,33,25,0.75)', 0.0016);
    if (ref) { c.line([[x0, Y(ref.v)], [x1, Y(ref.v)]], 'rgba(155,59,42,0.75)', 0.0012, [0.007, 0.005]); c.text({ x: x0 + 0.005, y: Y(ref.v) + size * 1.3, w: 0.3, size, lh: 1.2, paras: [ref.label], color: TONE.red }); }
    return h + 0.012 + size * 1.6;
  };
}

// every plate a spread prints (so the engine loads it before printing)
function platesOf(images, items) { return [...new Set(images.concat(items.flatMap((it) => it.figs || (it.fig ? [it.fig] : []))))]; }

// one flat spread from two item lists
function flatSpread({ key, title, left, right, images = [] }) {
  const all = left.concat(right);
  const words = all.map((it) => it.h1 || it.h2 || it.p || it.note || it.cap || '').filter(Boolean).join(' ');
  return {
    key, title, seed: key.length * 7 + 3,
    light: { el: 60, az: -20, sun: '#fff4e2', sunI: 0.6, amb: '#ecebe6', ambI: 0.78 },
    hint: '',
    sr: words.replace(/\[\[|\]\]/g, ''),
    planImages: platesOf(images, all),
    eqs: all.filter((it) => it.eq).map((it) => ({ eq: it.eq })),
    texts: [],
    plan(c) { fitFlow(c, PG.L, left, PG.W, PG.TOP); fitFlow(c, PG.R, right, PG.W, PG.TOP - 0.035); },   // the right page starts below the screen buttons
    build() { return { home: false, reset() {}, update() { return false; } }; },
  };
}

// a line chart: pts [[i, v], ...] on n slots; ticks: y values with labels; xl: [[i, label]]; marks: [[i, label]] vertical guides
function lineChart({ pts, n, ymin, ymax, ticks = [], xl = [], marks = [], h = 0.17, tone = TONE.gold, fmt = (v) => fmtN(v), title = '', zero = false, size = 0.0158, fill = false, more = [], tags = [] }) {
  return (c, x, y, w) => {
    let top = y;
    if (title) { const r = c.text({ x, y: top, w, size: size * 1.08, lh: 1.3, paras: [title], color: INK, italic: true }); if (r) top = r.y0 - 0.006; }
    const x0 = x + 0.065, x1 = x + w - 0.012, base = top - h, X = (i) => x0 + (i / (n - 1)) * (x1 - x0), Y = (v) => base + ((v - ymin) / (ymax - ymin)) * h;
    ticks.forEach((t) => { c.line([[x0, Y(t)], [x1, Y(t)]], 'rgba(42,33,25,0.13)', 0.0009); c.text({ x: x0 - 0.008, y: Y(t) + size * 0.62, w: 0.065, size, lh: 1.2, align: 'right', paras: [fmt(t)], color: '#5a4b3d' }); });
    if (zero) c.line([[x0, Y(0)], [x1, Y(0)]], 'rgba(42,33,25,0.6)', 0.0012);
    marks.forEach(([i, lab]) => { c.line([[X(i), base], [X(i), top]], 'rgba(155,59,42,0.55)', 0.001, [0.006, 0.005]); if (lab) c.text({ x: X(i) + 0.005, y: top - 0.002, w: 0.25, size, lh: 1.2, paras: [lab], color: TONE.red }); });
    const P = pts.map(([i, v]) => [X(i), Y(v)]);
    if (fill) c.fill([[P[0][0], Y(zero ? 0 : ymin)], ...P, [P[P.length - 1][0], Y(zero ? 0 : ymin)]], 'rgba(184,140,58,0.16)');
    c.line(P, tone, 0.0028);
    more.forEach((m) => c.line(m.pts.map(([i, v]) => [X(i), Y(v)]), m.tone, 0.0022, m.dash));
    tags.forEach(([i, v, lab, col]) => c.text({ x: X(i), y: Y(v) + size * 1.4, w: 0.25, size, lh: 1.2, paras: [lab], color: col || INK }));
    c.line([[x0, base], [x1, base]], 'rgba(42,33,25,0.75)', 0.0014);
    xl.forEach(([i, lab]) => c.text({ x: X(i), y: base - 0.005, w: 0.1, size, lh: 1.2, align: 'center', paras: [lab], color: '#4a3d30' }));
    return y - base + size * 1.6;
  };
}
