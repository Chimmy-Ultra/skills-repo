// ---------- helpers for spreads ----------
// the standard text set of a right-bound (vertical) spread: title, time/subtitle, body columns, a caption with sources.
// x, y: right edge and top of the title column (plan coordinates)
const bodyStyle = { size: 0.0314, adv: 1.12, gap: 1.85, color: INK };
const capStyle = { size: 0.0235, adv: 1.1, gap: 1.8, color: '#3a2e23' };
function textBlocks({ x, y, title, time, body, caption }) {
  const out = [];
  out.push({ x, y, size: 0.058, adv: 1.14, gap: 1.5, cols: [title], color: INK });
  const tx = x - 0.058 * 1.5;
  if (time) out.push({ x: tx, y: y - 0.004, size: 0.026, adv: 1.2, gap: 1.75, cols: [time], color: VERMIL });
  out.push({ ...bodyStyle, x: time ? tx - 0.026 * 1.75 : tx, y, cols: body });
  if (caption) out.push({ ...capStyle, ...caption });
  return out;
}
// the standard text set of a left-bound (horizontal) spread: kicker, title, body, an optional caption.
// x, y: left edge and top; w: wrap width. body items are paragraphs (strings) or equations ({eq, size, align});
// everything after the first block flows down from the block above it (y: null).
function hTextBlocks({ x, y, w, kicker, title, body, caption, size = 0.024 }) {
  const out = [];
  if (kicker) out.push({ x, y, w, size: 0.017, lh: 1.4, paras: [kicker], color: VERMIL });
  out.push({ x, y: kicker ? null : y, space: 0.004, w, size: 0.042, lh: 1.2, paras: [title], color: INK });
  let run = [], first = true, afterEq = false;
  const flush = () => { if (run.length) out.push({ x, y: null, space: first ? 0.016 : afterEq ? 0.014 : 0.008, w, size, lh: 1.6, paras: run, color: INK }); run = []; first = false; afterEq = false; };
  for (const b of body) {
    if (typeof b === 'string') { run.push(b); continue; }
    flush();
    const al = b.align || 'center';
    out.push({ x: al === 'center' ? x + w / 2 : al === 'right' ? x + w : x, y: null, space: b.space ?? 0.012, size: b.size || 0.03, align: al, eq: b.eq, color: b.color });
    first = false; afterEq = true;
  }
  flush();
  if (caption) out.push({ size: 0.017, lh: 1.55, color: '#4a3d30', ...caption });
  return out;
}
function softBlob(size = 256, inner = 'rgba(255,255,255,1)') {
  const c = makeCanvas(size, size), g = c.getContext('2d'), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, inner); gr.addColorStop(0.55, inner.replace(/[\d.]+\)$/, '0.45)')); gr.addColorStop(1, inner.replace(/[\d.]+\)$/, '0)'));
  g.fillStyle = gr; g.fillRect(0, 0, size, size); return texFromCanvas(c, { mip: false });
}
// a flat sprite (RGBA art without card stock): a plane in the page's xy plane, or standing if rotated
function spritePlane(id, h, { color = '#f4eee3', order = 4, depthWrite = false, alphaTest = 0.02 } = {}) {
  const sp = SPRITES[id];
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite, alphaTest });
  pieceTex(id).then((t) => { mat.map = t; mat.needsUpdate = true; });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  m.scale.set(h * sp.w / sp.h, h, 1);
  m.renderOrder = order; m.userData.aspect = sp.w / sp.h;
  return m;
}
const _glowTex = { tex: null };
function glowTex() { return _glowTex.tex || (_glowTex.tex = softBlob(256, 'rgba(255,196,120,1)')); }
function glowMesh(size) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.renderOrder = 6; return m;
}
// a paper tag with a short brush-script label, lying parallel to the page.
// w: fixed width (the tag is 640 x 150 px); or w = null and h: height, the tag sized to its text
function tagMesh(text, w = 0.17, h = 0.034) {
  const probe = makeCanvas(8, 8).getContext('2d'); probe.font = `74px ${fontStack()}`;
  const CW = w ? 640 : Math.ceil(probe.measureText(text).width + 96), c = makeCanvas(CW, 150), g = c.getContext('2d');
  g.fillStyle = 'rgba(246,238,220,0.94)'; g.strokeStyle = 'rgba(120,40,28,0.9)'; g.lineWidth = 5;
  g.beginPath(); g.roundRect(6, 6, CW - 12, 138, 10); g.fill(); g.stroke();
  g.lineWidth = 1.6; g.beginPath(); g.roundRect(16, 16, CW - 32, 118, 6); g.stroke();
  g.fillStyle = '#2a2119'; g.font = `74px ${fontStack()}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, CW / 2, 80, CW - 50);
  const W = w || h * CW / 150, H = W * 150 / CW;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: texFromCanvas(c), transparent: true, opacity: 0, depthWrite: false }));
  m.renderOrder = 7; return m;
}
// a paper panel lying on the page whose text can be redrawn (quiz feedback, notes). w, h: page units.
// draw(blocks): blocks in panel coordinates (x from the left edge, y from the bottom; y: null flows below the
// previous block), any kind drawBlock prints. Fade it in and out with mesh.material.opacity.
function panelMesh(w, h, { px = 1400, paper = 'rgba(250,246,236,0.97)', border = VERMIL } = {}) {
  const k = px / w, c = makeCanvas(px, Math.round(h * k)), g = c.getContext('2d'), tex = texFromCanvas(c, { mip: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false }));
  mesh.renderOrder = 8;
  const T = (x, y) => [x * k, (h - y) * k];
  function draw(blocks) {
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = paper; g.beginPath(); g.roundRect(4, 4, c.width - 8, c.height - 8, 0.012 * k); g.fill();
    g.strokeStyle = border; g.lineWidth = 0.003 * k; g.stroke();
    let last = null;
    for (const b0 of blocks) {
      const b = b0.y == null ? { ...b0, y: last ? last.y0 - (b0.space ?? 0.008) : h - 0.02 } : b0;
      const r = drawBlock(g, T, k, b); if (r) last = r;
    }
    tex.needsUpdate = true;
  }
  return { mesh, draw, w, h };
}
// world position of a point on a standing card, given as fractions of its texture (u from left, v from the foot)
function cardPoint(card, u, v) {
  const d = card.def, w = card.width, h = card.height, m = card.mirror;
  const lx = m * (u - card.ax) * w;
  const r = ((d.rot || 0) * Math.PI) / 180;
  return [d.x + lx * Math.cos(r), d.y + lx * Math.sin(r), (d.z || 0) + v * h];
}
