// ---------- runtime ----------
const stage = document.getElementById('stage');
const loader = document.getElementById('loader');
const hintEl = document.getElementById('hint');
const dotsEl = document.getElementById('dots');
const srEl = document.getElementById('sr');
const N = SPREADS.length;
// interface strings: Traditional Chinese by default, worded for the binding; a book can override any of them (BOOK.ui)
const UI = Object.assign({
  cover: '封面', back: '封底',
  open: LEFT ? '往左拖動封面，翻開這本書' : '往右拖動封面，翻開這本書',
  reopen: LEFT ? '往右拖動封底，回到書裡' : '往左拖動封底，回到書裡',
  next: LEFT ? '把右頁往左拖，翻到下一頁' : '把左頁往右拖，翻到下一頁',
  close: LEFT ? '把右頁往左拖，闔上書' : '把左頁往右拖，闔上書',
  full: '全螢幕', unfull: '離開全螢幕', soundOn: '聲音開', soundOff: '聲音關',
  noFull: '這個畫面不讓網頁全螢幕。請用 Chrome 開這本書的連結，再按一次全螢幕。', failed: '載入失敗：',
}, BOOK.ui || {});

const renderer = new THREE.WebGLRenderer({ antialias: (window.devicePixelRatio || 1) < 2, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#15100c');
const camera = new THREE.PerspectiveCamera();
const amb = new THREE.AmbientLight('#ffffff', 1);
const sun = new THREE.DirectionalLight('#ffffff', 1);
sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -1.08, right: 1.08, top: 0.66, bottom: -0.66, near: 0.5, far: 9 });
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.0015; sun.shadow.radius = 3;
scene.add(amb, sun, sun.target);
// desk under the book
const deskCanvas = (() => { const c = makeCanvas(512, 512), g = c.getContext('2d'), r = mulberry32(4); g.fillStyle = '#2a1f17'; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 400; i++) { g.strokeStyle = `rgba(${r() < 0.5 ? '0,0,0' : '120,90,60'},${0.05 + r() * 0.08})`; g.lineWidth = 0.5 + r() * 2; const y = r() * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + (r() - 0.5) * 20, 340, y + (r() - 0.5) * 20, 512, y + (r() - 0.5) * 10); g.stroke(); } return c; })();
const deskTex = texFromCanvas(deskCanvas); deskTex.wrapS = deskTex.wrapT = THREE.RepeatWrapping; deskTex.repeat.set(4, 3);
const desk = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), new THREE.MeshLambertMaterial({ map: deskTex }));
desk.position.z = -0.0152; desk.receiveShadow = true; scene.add(desk);
const book = new Book(scene);
book.group.scale.x = MX;                    // left-bound: the right-bound book seen in a mirror
book.content = new THREE.Group();           // cards and effects, in the reader's coordinates
book.content.scale.x = MX; book.group.add(book.content);

// ---------- view: off-axis window camera, the page plane maps exactly onto the screen ----------
const view = { s: 1, sd: 1024, hw: 1, hh: 0.5, ox: 0, oy: 0, k: 1024 };
const EYE = { th: (46 * Math.PI) / 180, D: 3.2 };
function layout() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px';
  // device pixels per world unit, a multiple of 3 so a page (2/3 wide) is a whole number of pixels
  const Wd = renderer.domElement.width, Hd = renderer.domElement.height;
  const sd = Math.max(3, Math.floor(Math.min(Wd / (2 * PW), Hd) / 3) * 3);
  view.sd = sd; view.s = sd * (w / Wd);
  view.hw = Wd / (2 * sd); view.hh = Hd / (2 * sd);
  // shift the window by a sub-pixel so the page edges sit exactly on pixel boundaries
  const ex = Wd / 2 - PW * sd, ey = Hd / 2 - 0.5 * sd;
  view.ox = (ex - Math.floor(ex)) / sd; view.oy = -(ey - Math.floor(ey)) / sd;
}
function pageK() { return Math.min(view.sd || 1024, 2048); }
const eye = V3();
function updateCamera(now) {
  let th = EYE.th, ph = 0;
  if (!TEST && !REDUCED) { th += 0.016 * Math.sin(now * 0.43) + 0.008 * Math.sin(now * 0.17 + 1); ph = 0.03 * Math.sin(now * 0.29 + 0.6) + 0.012 * Math.sin(now * 0.11); }
  eye.set(EYE.D * Math.sin(th) * Math.sin(ph), -EYE.D * Math.sin(th) * Math.cos(ph), EYE.D * Math.cos(th));
  camera.position.copy(eye); camera.rotation.set(0, 0, 0); camera.updateMatrixWorld();
  const n = 0.05, f = 12, q = n / eye.z;
  const L = -view.hw + view.ox, R = view.hw + view.ox, B = -view.hh + view.oy, T = view.hh + view.oy;
  camera.projectionMatrix.makePerspective((L - eye.x) * q, (R - eye.x) * q, (T - eye.y) * q, (B - eye.y) * q, n, f);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}

// ---------- light ----------
const COVER_LIGHT = { el: 52, az: -24, sun: '#fff1de', sunI: 0.62, amb: '#efe9e0', ambI: 0.72 };
const _ca = new THREE.Color(), _cb = new THREE.Color();
let lightKey = '';
function applyLight(P) {
  const Ls = [COVER_LIGHT, ...SPREADS.map((s) => s.light), COVER_LIGHT];
  const i = clamp(Math.floor(P), 0, N), t = clamp(P - i), A = Ls[i], B = Ls[Math.min(i + 1, N + 1)];
  const key = P.toFixed(3);
  if (key === lightKey) return false;
  lightKey = key;
  const el = (lerp(A.el, B.el, t) * Math.PI) / 180, az = (lerp(A.az, B.az, t) * Math.PI) / 180;
  sun.position.set(Math.cos(el) * Math.sin(az), -Math.cos(el) * Math.cos(az), Math.sin(el)).multiplyScalar(4);
  sun.color.copy(_ca.set(A.sun).lerp(_cb.set(B.sun), t)); sun.intensity = lerp(A.sunI, B.sunI, t) * Math.PI;
  amb.color.copy(_ca.set(A.amb).lerp(_cb.set(B.amb), t)); amb.intensity = lerp(A.ambI, B.ambI, t) * Math.PI;
  return true;
}

// ---------- audio (synthesized) ----------
const audio = { ctx: null, on: true };
function ensureAudio() { if (!audio.ctx) { try { audio.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio.on = false; } } if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume(); }
function noiseBuf(sec) { const c = audio.ctx, b = c.createBuffer(1, Math.floor(c.sampleRate * sec), c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
function sfx(type, amt = 1) {
  if (!audio.on || !audio.ctx || TEST) return;
  const c = audio.ctx, t0 = c.currentTime, out = c.createGain(); out.connect(c.destination);
  if (type === 'page') {
    const s = c.createBufferSource(); s.buffer = noiseBuf(0.5); const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(2400, t0); f.frequency.exponentialRampToValueAtTime(900, t0 + 0.45); f.Q.value = 0.7;
    out.gain.setValueAtTime(0.0001, t0); out.gain.exponentialRampToValueAtTime(0.16 * amt, t0 + 0.06); out.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.48);
    s.connect(f); f.connect(out); s.start(t0); s.stop(t0 + 0.5);
  } else if (type === 'creak') {
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(92, t0); o.frequency.linearRampToValueAtTime(70, t0 + 1.1);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = 6;
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 23; lg.gain.value = 18; lfo.connect(lg); lg.connect(o.frequency);
    out.gain.setValueAtTime(0.0001, t0); out.gain.exponentialRampToValueAtTime(0.07 * amt, t0 + 0.12); out.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
    o.connect(f); f.connect(out); o.start(t0); lfo.start(t0); o.stop(t0 + 1.25); lfo.stop(t0 + 1.25);
  } else if (type === 'thud') {
    const o = c.createOscillator(); o.frequency.setValueAtTime(110, t0); o.frequency.exponentialRampToValueAtTime(48, t0 + 0.3);
    out.gain.setValueAtTime(0.25 * amt, t0); out.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4); o.connect(out); o.start(t0); o.stop(t0 + 0.42);
  } else if (type === 'bell') {
    for (const [fq, a] of [[1580, 1], [2390, 0.5], [3720, 0.25]]) { const o = c.createOscillator(); o.frequency.value = fq * (0.97 + Math.random() * 0.06); const g = c.createGain(); g.gain.setValueAtTime(0.035 * a * amt, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9); o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + 0.95); }
  } else if (type === 'pop') {
    const s = c.createBufferSource(); s.buffer = noiseBuf(0.06); const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2800;
    out.gain.setValueAtTime(0.05 * amt, t0); out.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05); s.connect(f); f.connect(out); s.start(t0);
  } else if (type === 'crane') {
    // a red-crowned crane's bugle: two rising, rough-edged notes
    for (const [d, f0, f1] of [[0, 780, 1150], [0.3, 860, 1240]]) {
      const o = c.createOscillator(), m = c.createOscillator(), mg = c.createGain(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = 'triangle'; o.frequency.setValueAtTime(f0, t0 + d); o.frequency.exponentialRampToValueAtTime(f1, t0 + d + 0.07); o.frequency.exponentialRampToValueAtTime(f1 * 0.88, t0 + d + 0.24);
      m.frequency.value = 180; mg.gain.value = 120; m.connect(mg); mg.connect(o.frequency);
      f.type = 'bandpass'; f.frequency.value = 1300; f.Q.value = 1.2;
      g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.06 * amt, t0 + d + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.26);
      o.connect(f); f.connect(g); g.connect(out); o.start(t0 + d); m.start(t0 + d); o.stop(t0 + d + 0.28); m.stop(t0 + d + 0.28);
    }
  } else if (type === 'drum') {
    const o = c.createOscillator(); o.frequency.setValueAtTime(150, t0); o.frequency.exponentialRampToValueAtTime(60, t0 + 0.2);
    const g = c.createGain(); g.gain.setValueAtTime(0.3 * amt, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38); o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + 0.4);
    const s = c.createBufferSource(); s.buffer = noiseBuf(0.04); const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.5;
    const h = c.createGain(); h.gain.setValueAtTime(0.08 * amt, t0); h.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04); s.connect(f); f.connect(h); h.connect(out); s.start(t0);
  } else if (type === 'gong') {
    for (const [fq, a, dec] of [[392, 1, 1.6], [588, 0.6, 1.2], [1046, 0.35, 0.8], [1490, 0.2, 0.5]]) {
      const o = c.createOscillator(); o.frequency.setValueAtTime(fq * 1.02, t0); o.frequency.exponentialRampToValueAtTime(fq, t0 + 0.4);
      const g = c.createGain(); g.gain.setValueAtTime(0.045 * a * amt, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dec); o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dec + 0.05);
    }
  } else if (type === 'fire') {
    const s = c.createBufferSource(); s.buffer = noiseBuf(0.4); const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(1600, t0 + 0.18);
    out.gain.setValueAtTime(0.0001, t0); out.gain.exponentialRampToValueAtTime(0.09 * amt, t0 + 0.06); out.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);
    s.connect(f); f.connect(out); s.start(t0); s.stop(t0 + 0.4);
  }
}

// spoken words (English books): the browser's own voices
// a natural-sounding voice for the language when the device has one (Google, Apple's enhanced voices, ...)
const voices = { list: [], pick: {} };
function voiceFor(lang) {
  if (voices.pick[lang] !== undefined) return voices.pick[lang];
  const all = speechSynthesis.getVoices(); if (!all.length) return null;
  const same = all.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang.toLowerCase()));
  const base = same.length ? same : all.filter((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  return (voices.pick[lang] = base.find((v) => /natural|premium|enhanced|google|samantha|siri/i.test(v.name)) || base[0] || null);
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => (voices.pick = {});
function say(text, lang = BOOK.lang || 'en-US', rate = 0.9) {
  if (TEST || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate;
    const v = voiceFor(lang); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { /* no voice on this device */ }
}

// ---------- build ----------
const arts = [];            // arts[i] for spread i+1
let coverTex, backCoverTex;
function loadImage(src) { return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; }); }
// covers: the cover image with the title. BOOK.cover: {image, style: 'slip' (a vertical title slip, right-bound books) |
// 'label' (a horizontal paper label), seal (one character in a red square), subtitle}
function coverCanvas(img, front) {
  const W = img.width, H = img.height, c = makeCanvas(W, H), g = c.getContext('2d'), cv = BOOK.cover || {};
  if (front) {
    g.drawImage(img, 0, 0);
    const style = cv.style || (LEFT ? 'label' : 'slip');
    if (style === 'slip') {
      const k = H, sx = 0.118 * W / k, top = 0.5 - 0.06, T = (x, y) => [x * k, (0.5 - y) * k];
      drawVText(g, T, k, { x: sx + 0.042, y: top, size: 0.068, adv: 1.18, gap: 1.2, cols: [BOOK.title], color: '#2b2118' });
      if (cv.seal) seal(g, ...T(sx, top - 0.08 - 0.08 * [...BOOK.title].length), 0.03 * k, cv.seal);
    } else if (style === 'label') {
      const bw = W * 0.62, bh = H * (cv.subtitle ? 0.2 : 0.15), bx = (W - bw) / 2, by = H * 0.2;
      g.fillStyle = 'rgba(240,231,210,0.96)'; g.fillRect(bx, by, bw, bh);
      g.strokeStyle = 'rgba(60,44,30,0.8)'; g.lineWidth = H * 0.003; g.strokeRect(bx + H * 0.008, by + H * 0.008, bw - H * 0.016, bh - H * 0.016);
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#2b2118';
      g.font = `${(H * 0.058).toFixed(0)}px ${fontStack()}`; g.fillText(BOOK.title, W / 2, by + bh * (cv.subtitle ? 0.4 : 0.5), bw * 0.9);
      if (cv.subtitle) { g.font = `${(H * 0.026).toFixed(0)}px ${fontStack()}`; g.fillStyle = '#4a3a2a'; g.fillText(cv.subtitle, W / 2, by + bh * 0.74, bw * 0.9); }
      if (cv.seal) seal(g, bx + bw - H * 0.05, by + bh + H * 0.02, H * 0.034, cv.seal);
    }
  } else {
    // back board: the cover art without the title
    g.save(); g.translate(W, 0); g.scale(-1, 1); g.drawImage(img, W * 0.24, 0, W * 0.76, H, 0, 0, W, H); g.restore();
  }
  if (!LEFT) return texFromCanvas(c);
  const m = makeCanvas(W, H), mg = m.getContext('2d'); mg.setTransform(-1, 0, 0, 1, W, 0); mg.drawImage(c, 0, 0);
  return texFromCanvas(m);
}
// a red seal square with one character, its top-left corner at (X, Y) canvas pixels
function seal(g, X, Y, sz, ch) {
  g.fillStyle = VERMIL; g.fillRect(X - sz / 2, Y, sz, sz);
  g.font = `${(sz * 0.62).toFixed(1)}px ${FONT}, serif`; g.fillStyle = '#f2e6d0'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, X, Y + sz / 2);
}
const spreadState = SPREADS.map(() => ({ cards: [], extras: [], mech: null }));
function buildSpreads() {
  SPREADS.forEach((sp, i) => {
    const ss = spreadState[i];
    const env = {
      card(def) { const c = new Card(def); (def.parent ? def.parent.root : book.content).add(c.root); ss.cards.push(c); return c; },
      add(obj) { book.content.add(obj); ss.extras.push(obj); },
      light(obj) { book.content.add(obj); },   // always in the scene, so the light count (and every shader) stays fixed
      loadImage, say, speaking: () => !TEST && 'speechSynthesis' in window && speechSynthesis.speaking,
      sfx, isResting: () => S.mode === 'rest' && S.P === i + 1, mistFade: () => (S.P === i + 1 && !S.turn ? 1 : 0),
    };
    ss.mech = sp.build(env);
    ss.mech.reset && ss.mech.reset();
    showSpread(i + 1, false);
  });
}
function drawArts() {
  view.k = pageK();
  SPREADS.forEach((sp, i) => { const a = arts[i] || (arts[i] = new PageArt(sp, view.k)); a.draw(); a.homeBaked = false; });
}
function showSpread(n, vis) {
  const ss = spreadState[n - 1]; if (!ss) return;
  for (const c of ss.cards) c.root.visible = vis;
  for (const o of ss.extras) o.visible = vis;
}
function bake(n) { const a = arts[n - 1]; if (!a) return; book.group.updateMatrixWorld(true); a.bakeFold(spreadState[n - 1].cards, book.group); }

// ---------- state ----------
const S = { P: 0, mode: 'rest', turn: null, rise: null, interacted: false };
const isOpen = (P) => P >= 1 && P <= N;
function bookShift(P) { if (P < 1) return (PW / 2) * (1 - easeInOut(clamp(P))); if (P > N) return -(PW / 2) * easeInOut(clamp(P - N)); return 0; }
function setRestView(P) {
  book.group.position.x = MX * bookShift(P);
  book.blockL.visible = P <= N; book.blockR.visible = P >= 1;
  if (P === 0) { book.setBase(-1, null); book.setBase(1, null); book.sheetVisible(true); book.setSheet(coverTex, arts[0].restTex[1]); book.curl(0, 0); }
  else if (P === N + 1) { book.setBase(-1, null); book.setBase(1, null); book.sheetVisible(true); book.setSheet(arts[N - 1].restTex[0], backCoverTex); book.curl(1, 0); }
  else { book.sheetVisible(false); book.setBase(-1, arts[P - 1].restTex[0]); book.setBase(1, arts[P - 1].restTex[1]); }
}
function setTurnTextures(j) {
  // sheet j turns: front = left page of spread j (or the cover), back = right page of spread j+1 (or the back cover)
  book.setSheet(j === 0 ? coverTex : arts[j - 1].foldTex[0], j === N ? backCoverTex : arts[j].foldTex[1]);
  book.setBase(-1, j + 1 <= N ? arts[j].foldTex[0] : null);
  book.setBase(1, j >= 1 ? arts[j - 1].foldTex[1] : null);
  book.sheetVisible(true);
}
function ensureHomeBake(n) { const a = arts[n - 1]; if (a && !a.homeBaked) { bake(n); a.homeBaked = true; } }

function startTurn(dir, drag) {
  if (S.turn) return false;
  const k = S.P;
  if (dir > 0 && k > N) return false;
  if (dir < 0 && k < 1) return false;
  const j = dir > 0 ? k : k - 1;
  const t0 = dir > 0 ? 0 : 1;
  S.turn = { j, dir, t: t0, tv: t0, v: 0, t0, target: null, drag, phase: isOpen(k) ? 'fold' : 'curl', fold: 0, beta: 0, from: k };
  S.rise = null; S.mode = 'turn';
  if (S.turn.phase === 'fold') { const ss = spreadState[k - 1]; ss.cards.forEach((c) => (c.foldFrom = c.rise)); ss.extras.forEach((o) => (o.visible = false)); ss.mech.leave && ss.mech.leave(); }
  else beginCurl();
  sfx('page', 0.8);
  S.interacted = true; updateHud();
  return true;
}
function beginCurl() {
  const T = S.turn, k = T.from;
  // the spread we leave is printed with its pieces folded where they are now; the other spread at home
  if (isOpen(k)) { bake(k); arts[k - 1].homeBaked = spreadState[k - 1].mech.home; showSpread(k, false); }
  const other = T.dir > 0 ? T.j + 1 : T.j;
  if (isOpen(other)) ensureHomeBake(other);
  setTurnTextures(T.j);
  T.phase = 'curl';
}
function stepTurn(dt) {
  const T = S.turn;
  if (T.phase === 'fold') {
    T.fold = Math.min(1, T.fold + dt / (REDUCED ? 0.12 : 0.2));
    const e = easeIn(T.fold);
    for (const c of spreadState[T.from - 1].cards) c.setRise(c.foldFrom * (1 - e));
    if (T.fold >= 1) beginCurl();
    return true;
  }
  if (T.drag) {
    T.tv += (T.t - T.tv) * (1 - Math.exp(-dt * 22));
    T.v = 0;
  } else {
    [T.tv, T.v] = spring(T.tv, T.v, T.target, REDUCED ? 16 : 9.5, dt);
    if (Math.abs(T.tv - T.target) < 0.0015 && Math.abs(T.v) < 0.02) { finishTurn(T.target); return true; }
  }
  const tv = clamp(T.tv);
  book.curl(tv, T.beta);
  const P = T.j + tv;
  book.group.position.x = MX * bookShift(P);
  book.blockL.visible = T.j < N; book.blockR.visible = T.j > 0;
  applyLight(P);
  return true;
}
function release(T, velT) {
  const progress = Math.max(T.tv - T.t0, T.t - T.t0) * T.dir;
  const complete = progress > 0.33 || velT * T.dir > 1.6;
  T.target = complete ? (T.dir > 0 ? 1 : 0) : T.t0;
  T.drag = null;
}
function finishTurn(end) {
  const T = S.turn, P = T.j + end;
  S.turn = null; S.P = P;
  if (T.from !== P && isOpen(T.from)) { const m = spreadState[T.from - 1].mech; m.reset && m.reset(); arts[T.from - 1].homeBaked = false; }
  setRestView(P);
  applyLight(P);
  if (isOpen(P)) startRise(P);
  else S.mode = 'rest';
  updateHud();
  renderer.shadowMap.needsUpdate = true;
}
function startRise(n) {
  const ss = spreadState[n - 1];
  showSpread(n, true);
  book.group.updateMatrixWorld(true);
  const wp = V3();
  // cards a mechanism holds folded (c.held) stay down; the mechanism raises them itself
  ss.cards.forEach((c) => c.held && c.setRise(0));
  const list = ss.cards.filter((c) => !c.held).map((c) => { c.root.getWorldPosition(wp); return { c, y: wp.y, x: wp.x }; });
  list.sort((a, b) => b.y - a.y || a.x - b.x);
  const step = Math.min(0.024, 0.9 / list.length);
  list.forEach((e, i) => { e.delay = i * step; e.c.setRise(0); });
  for (const e of list) if (e.c.def.riseWith) { const lead = list.find((o) => o.c === e.c.def.riseWith); if (lead) e.delay = lead.delay; }
  S.rise = { t: 0, list, popped: 0 };
  S.mode = 'rise';
}
function stepRise(dt) {
  const R = S.rise; R.t += dt;
  let done = true;
  const D = REDUCED ? 0.25 : 0.5;
  for (const e of R.list) {
    const u = clamp((R.t - e.delay) / D);
    e.c.setRise(REDUCED ? u : easeOutBack(u));
    if (u < 1) done = false;
  }
  const popped = R.list.filter((e) => R.t > e.delay).length;
  if (Math.floor(popped / 6) > Math.floor(R.popped / 6)) sfx('pop', 0.6);
  R.popped = popped;
  if (done) { S.rise = null; S.mode = 'rest'; updateHud(); }
  return true;
}
function goNext() { if (!S.turn && S.P <= N) { if (startTurn(1, null)) S.turn.target = 1; } }
function goPrev() { if (!S.turn && S.P >= 1) { if (startTurn(-1, null)) S.turn.target = 0; } }
let queued = null;
function goTo(P) { queued = P; }

// ---------- input ----------
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
// pointer -> reader coordinates (what spreads and mechanisms use). The turning logic works in engine
// coordinates, which a left-bound book mirrors: engine x = MX * reader x.
function toReader(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  const x = ((ev.clientX - r.left) / r.width * 2 - 1) * view.hw + view.ox, y = (1 - (ev.clientY - r.top) / r.height * 2) * view.hh + view.oy;
  return [x - book.group.position.x, y];
}
function pick(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  if (!isOpen(S.P)) return null;
  const ss = spreadState[S.P - 1];
  const meshes = ss.cards.filter((c) => c.root.visible && (c.mesh.userData.tap || c.mesh.userData.drag)).map((c) => c.mesh);
  const hit = ray.intersectObjects(meshes, false)[0];
  return hit ? hit.object.userData.card : null;
}
const ptr = { id: null };
renderer.domElement.addEventListener('pointerdown', (ev) => {
  ensureAudio();
  if (ptr.id !== null) return;
  const [x, y] = toReader(ev);
  Object.assign(ptr, { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, wx0: MX * x, wy0: y, mode: 'pending', card: null, hist: [] });
  if (S.mode === 'rest' || S.mode === 'rise') {
    const c = pick(ev);
    if (c) {
      const mech = spreadState[S.P - 1].mech;
      if (c.mesh.userData.drag && mech.dragStart && mech.dragStart(c, [x, y])) { ptr.mode = 'mech'; S.interacted = true; updateHud(); }   // reader coordinates
      else ptr.card = c;
    }
  }
  renderer.domElement.setPointerCapture(ev.pointerId);
});
renderer.domElement.addEventListener('pointermove', (ev) => {
  if (ev.pointerId !== ptr.id) return;
  const [rx, y] = toReader(ev), x = MX * rx;
  if (ptr.mode === 'mech') { spreadState[S.P - 1].mech.dragMove([rx, y]); return; }
  const dx = MX * (ev.clientX - ptr.x0);           // in the engine's direction
  if (ptr.mode === 'pending' && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(ev.clientY - ptr.y0) * 0.8 && !S.turn) {
    const dir = dx > 0 ? 1 : -1;
    // engine (right-bound): pull the left page to the right to go on, the right page to the left to go back.
    // A left-bound reader sees this mirrored: pull the right page to the left to go on.
    const okSide = S.P === 0 || S.P === N + 1 || (dir > 0 ? ptr.wx0 < 0.04 : ptr.wx0 > -0.04);
    if (okSide && startTurn(dir, { x0: x, y0: ptr.wy0 })) { ptr.mode = 'turn'; S.turn.beta = clamp(ptr.wy0 * 0.75, -0.32, 0.32) * dir; }
    else ptr.mode = 'none';
  }
  if (ptr.mode === 'turn' && S.turn && S.turn.drag) {
    const T = S.turn;
    T.t = clamp(T.t0 + (x - T.drag.x0) / (2 * PW * 0.82));
    ptr.hist.push([performance.now(), T.t]); if (ptr.hist.length > 6) ptr.hist.shift();
  }
});
function endPointer(ev, cancel) {
  if (ev.pointerId !== ptr.id) return;
  const moved = Math.hypot(ev.clientX - ptr.x0, ev.clientY - ptr.y0);
  if (ptr.mode === 'mech') spreadState[S.P - 1].mech.dragEnd();
  else if (ptr.mode === 'turn' && S.turn && S.turn.drag) {
    const h = ptr.hist; let v = 0;
    if (h.length > 1) { const a = h[0], b = h[h.length - 1]; v = (b[1] - a[1]) / Math.max(0.016, (b[0] - a[0]) / 1000); }
    release(S.turn, cancel ? 0 : v);
    if (cancel) S.turn.target = S.turn.t0;
  } else if (ptr.mode === 'pending' && moved < 10 && !cancel) {
    const mech = isOpen(S.P) ? spreadState[S.P - 1].mech : null;
    if (ptr.card && mech && mech.tap && mech.tap(ptr.card)) { S.interacted = true; updateHud(); }
    else if (S.P === 0 || ptr.wx0 < -PW * 0.6) goNext();
    else if (S.P === N + 1 || ptr.wx0 > PW * 0.6) goPrev();
  }
  ptr.id = null;
}
renderer.domElement.addEventListener('pointerup', (ev) => endPointer(ev, false));
renderer.domElement.addEventListener('pointercancel', (ev) => endPointer(ev, true));
addEventListener('keydown', (ev) => {
  const fwd = LEFT ? 'ArrowRight' : 'ArrowLeft', back = LEFT ? 'ArrowLeft' : 'ArrowRight';
  if (ev.key === fwd || ev.key === ' ' || ev.key === 'PageDown') { ev.preventDefault(); ensureAudio(); goNext(); }
  if (ev.key === back || ev.key === 'PageUp') { ev.preventDefault(); ensureAudio(); goPrev(); }
  if (ev.key === 'f' || ev.key === 'F') toggleFullscreen();
});

// ---------- HUD ----------
const STOPS = [UI.cover, ...SPREADS.map((s) => s.title), UI.back];
STOPS.forEach((name, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', name); b.title = name; b.addEventListener('click', () => { ensureAudio(); goTo(i); }); dotsEl.appendChild(b); });
function updateHud() {
  [...dotsEl.children].forEach((b, i) => { b.classList.toggle('on', i === S.P); b.setAttribute('aria-current', i === S.P ? 'step' : 'false'); });
  let h = '';
  if (!S.turn) {
    if (S.P === 0) h = UI.open;
    else if (S.P === N + 1) h = UI.reopen;
    else { const m = spreadState[S.P - 1].mech; h = m.home && SPREADS[S.P - 1].hint ? SPREADS[S.P - 1].hint : (S.P < N ? UI.next : UI.close); }
  }
  if (h !== hintEl.textContent || !h) { hintEl.textContent = h; hintShown = now; }
  hintEl.classList.toggle('gone', !h);
  srEl.textContent = S.P === 0 ? `${UI.cover}：${BOOK.title}` : S.P === N + 1 ? UI.back : SPREADS[S.P - 1].sr || SPREADS[S.P - 1].title;
}
// fullscreen: works where the page's frame allows it (Chrome, desktop browsers); otherwise say how to get it
const btnFull = document.getElementById('btnFull');
const docEl = document.documentElement;
const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
function toast(msg, sec = 5) { hintEl.textContent = msg; hintEl.classList.remove('gone'); hintShown = now - 7 + sec; }
async function toggleFullscreen() {
  try {
    if (fsElement()) { await (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
    const enabled = document.fullscreenEnabled ?? document.webkitFullscreenEnabled ?? !!req;
    if (!req || !enabled) throw new Error('blocked');
    await req.call(docEl, { navigationUI: 'hide' });
    try { await screen.orientation.lock('landscape'); } catch (e) { /* not every device lets a page lock rotation */ }
  } catch (e) {
    toast(UI.noFull, 7);
  }
}
btnFull.addEventListener('click', () => { ensureAudio(); toggleFullscreen(); });
function onFsChange() { const on = !!fsElement(); btnFull.setAttribute('aria-pressed', String(on)); btnFull.querySelector('span').textContent = on ? UI.unfull : UI.full; layout(); maybeReprint(); }
document.addEventListener('fullscreenchange', onFsChange); document.addEventListener('webkitfullscreenchange', onFsChange);
const btnSound = document.getElementById('btnSound');
btnSound.addEventListener('click', () => { ensureAudio(); audio.on = !audio.on; btnSound.setAttribute('aria-pressed', String(audio.on)); btnSound.querySelector('span').textContent = audio.on ? UI.soundOn : UI.soundOff; });
btnFull.querySelector('span').textContent = UI.full; btnSound.querySelector('span').textContent = UI.soundOn;

// ---------- adaptive resolution ----------
const MAXDPR = Math.min(window.devicePixelRatio || 1, 3);
const perf = { ema: 8, slow: 0, fast: 0, last: performance.now() };
function adapt(dt) {
  if (TEST) return;
  const t = performance.now(), ms = t - perf.last; perf.last = t;
  if (ms > 100) return;   // tab was hidden
  perf.ema += (ms - perf.ema) * 0.05;
  const r = renderer.getPixelRatio(), floor = Math.max(1.5, MAXDPR * 0.75);
  // below ~42 fps for two seconds: give up some resolution; a steady 60 fps is fine
  if (perf.ema > 24) { perf.slow += dt; perf.fast = 0; } else if (perf.ema < 18) { perf.fast += dt; perf.slow = 0; } else { perf.slow = perf.fast = 0; }
  if (perf.slow > 2 && r > floor) { renderer.setPixelRatio(Math.max(floor, r * 0.88)); layout(); maybeReprint(); perf.slow = 0; }
  if (perf.fast > 4 && r < MAXDPR) { renderer.setPixelRatio(MAXDPR); layout(); maybeReprint(); perf.fast = 0; }
}
let reprintTimer = 0;
function maybeReprint() {
  clearTimeout(reprintTimer);
  reprintTimer = setTimeout(() => {
    if (S.turn) { maybeReprint(); return; }
    if (Math.abs(pageK() - view.k) < 2) return;
    arts.length = 0; drawArts(); setRestView(S.P); renderer.shadowMap.needsUpdate = true;
  }, 400);
}

// ---------- loop ----------
const clock = new THREE.Clock();
let now = 0, hintShown = 0;
function frame(dtIn, noRender) {
  const dt = dtIn ?? Math.min(0.05, clock.getDelta());
  now += dt;
  let dirty = false;
  if (S.turn) dirty = stepTurn(dt) || dirty;
  else if (queued !== null) {
    if (queued === S.P) queued = null;
    else if (S.mode === 'rest' || S.mode === 'rise') { const dir = queued > S.P ? 1 : -1; dir > 0 ? goNext() : goPrev(); if (S.turn) S.turn.target = dir > 0 ? 1 : 0; }
  }
  if (S.rise) dirty = stepRise(dt) || dirty;
  if (isOpen(S.P) && !S.turn) {
    const m = spreadState[S.P - 1].mech;
    if (m.update(dt, now)) dirty = true;
    if (m.home !== mHome) { mHome = m.home; updateHud(); }
  }
  if (hintEl.textContent && !hintEl.classList.contains('gone') && now - hintShown > 7) hintEl.classList.add('gone');
  adapt(dt);
  updateCamera(now);
  if (dirty) renderer.shadowMap.needsUpdate = true;
  if (!noRender) renderer.render(scene, camera);
}
let mHome = true;

// ---------- start ----------
async function start() {
  layout();
  const texts = SPREADS.flatMap((s) => s.texts || []);
  const fontText = BOOK.title + SPREADS.map((s) => s.title).join('') + texts.map((t) => (t.cols || t.paras || []).join('')).join('');
  const loads = [document.fonts.load(`40px ${FONT}`, fontText).catch(() => {}), document.fonts.ready];
  if (LATIN) for (const st of ['', 'italic ', 'bold ']) loads.push(document.fonts.load(`${st}40px "${LATIN}"`, 'Aa').catch(() => {}));
  await Promise.all(loads);
  // images printed in plans, the cover, and equations: all ready before any page is printed
  const planIds = [...new Set([...(BOOK.planImages || []), ...SPREADS.flatMap((s) => s.planImages || [])])];
  const coverId = (BOOK.cover && BOOK.cover.image) || 'cover';
  const [cover, ...plans] = await Promise.all([loadImage(`a/${coverId}.webp`), ...planIds.map((id) => loadImage(`a/${id}.webp`))]);
  planIds.forEach((id, i) => (PLAN_IMG[id] = plans[i]));
  await prepareEquations(texts.filter((t) => t.eq));
  coverTex = coverCanvas(cover, true); backCoverTex = coverCanvas(cover, false);
  drawArts();
  buildSpreads();
  await Promise.all(spreadState.flatMap((ss) => ss.cards.map((c) => c.ready)));
  setRestView(S.P); applyLight(S.P);
  if (TEST && TEST.P !== undefined) jump(TEST.P);
  updateCamera(0);
  renderer.shadowMap.needsUpdate = true;
  updateHud();
  // upload page textures before the first turn
  for (const a of arts) for (const t of [...a.restTex, ...a.foldTex]) renderer.initTexture(t);
  loader.classList.add('done'); if (TEST) loader.style.display = 'none';
  window.__ready = true;
  if (!TEST) renderer.setAnimationLoop(() => frame());
  else frame(0.016);
}
function jump(P) {
  if (isOpen(S.P)) showSpread(S.P, false);
  S.turn = null; S.rise = null; S.P = P; S.mode = 'rest';
  setRestView(P); applyLight(P);
  if (isOpen(P)) { showSpread(P, true); spreadState[P - 1].cards.forEach((c) => c.setRise(c.held ? 0 : 1)); }
  renderer.shadowMap.needsUpdate = true; updateHud();
}
addEventListener('resize', () => { layout(); maybeReprint(); updateOrient(); });
function updateOrient() { document.body.classList.toggle('portrait', innerHeight > innerWidth * 1.05); }
updateOrient();
// test hooks
window.__app = {
  jump, frame: (dt = 0.016, n = 1) => { for (let i = 0; i < n; i++) frame(dt, i < n - 1); renderer.shadowMap.needsUpdate = true; frame(0); },
  info: () => ({ P: S.P, mode: S.mode, k: view.k, dpr: renderer.getPixelRatio(), calls: renderer.info.render.calls, tris: renderer.info.render.triangles }),
  turnAt(dir, t, beta = 0) { // freeze a mid-turn frame
    startTurn(dir, { x0: 0, y0: 0 }); const T = S.turn; T.beta = beta;
    for (let i = 0; i < 30 && T.phase === 'fold'; i++) stepTurn(0.02);
    T.t = T.tv = t; stepTurn(0); renderer.shadowMap.needsUpdate = true; frame(0);
  },
  foldAt(r) { if (isOpen(S.P)) spreadState[S.P - 1].cards.forEach((c) => c.setRise(r)); renderer.shadowMap.needsUpdate = true; frame(0); },
  n: N, title: (i) => SPREADS[i - 1].title,
  mech: (n) => spreadState[n - 1].mech,
  cardPoint, V3, say,
  // layout audit of spread n at rest: cards that leave the page, and printed text or labels a card covers
  audit(n) {
    jump(n); frame(0); book.group.updateMatrixWorld(true);
    const out = [], art = arts[n - 1], v = V3(), px = book.group.position.x;
    const toPage = (p) => { v.copy(p).project(camera); return [v.x * view.hw + view.ox - px, v.y * view.hh + view.oy]; };
    for (const c of spreadState[n - 1].cards) {
      if (!c.root.visible || c.held || c.root.scale.x < 0.01) continue;
      c.mesh.updateMatrixWorld(true);
      const p = c.p, polys = p.rings.filter((r) => !r.hole).map((r) => r.pts.filter((_, i) => i % 2 === 0).map(([tx, ty]) =>
        toPage(V3(c.mirror * (tx - c.ax * p.w) * c.s, (p.h - 1 - ty) * c.sy, 0).applyMatrix4(c.mesh.matrixWorld))));
      const all = polys.flat(), top = Math.max(...all.map((q) => q[1])), bot = Math.min(...all.map((q) => q[1]));
      const xl = Math.min(...all.map((q) => q[0])), xr = Math.max(...all.map((q) => q[0]));
      const id = c.def.id + ' @(' + c.def.x.toFixed(3) + ', ' + c.def.y.toFixed(3) + ')';
      if (top > 0.5 - 0.008) out.push({ card: id, issue: 'top cut off', by: +(top - 0.492).toFixed(3) });
      if (bot < -0.5 + 0.008 || xl < -PW + 0.004 || xr > PW - 0.004) out.push({ card: id, issue: 'leaves the page', bot: +bot.toFixed(3), xl: +xl.toFixed(3), xr: +xr.toFixed(3) });
      for (const r of art.rects || []) {
        let hit = 0, tot = 0;
        for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
          const q = [lerp(r.x0, r.x1, i / 6), lerp(r.y0, r.y1, j / 6)]; tot++;
          if (polys.some((poly) => pointInPoly(q, poly))) hit++;
        }
        if (hit) out.push({ card: id, issue: `covers ${r.kind}`, text: (r.text || '').slice(0, 14), share: +(hit / tot).toFixed(2) });
      }
    }
    // printed text that runs off the page or out of the frame
    for (const r of art.rects || []) if (r.y0 < -0.5 + 0.03 || r.y1 > 0.5 - 0.03 || r.x0 < -PW + 0.03 || r.x1 > PW - 0.03) out.push({ text: (r.text || '').slice(0, 14), issue: 'text outside the frame', rect: [r.x0, r.y0, r.x1, r.y1].map((u) => +u.toFixed(3)) });
    return out;
  },
  card: (n, id, k = 0) => spreadState[n - 1].cards.filter((c) => c.def.id === id)[k],
  tapCard(n, id, k = 0) { const c = spreadState[n - 1].cards.filter((c) => c.def.id === id)[k]; return spreadState[n - 1].mech.tap(c); },
  cardScreen(n, id, k = 0, v = 0.5) { const c = spreadState[n - 1].cards.filter((c) => c.def.id === id)[k]; const w = V3(); c.mesh.getWorldPosition(w); const p = cardPoint(c, 0.5, v); return this.toScreen(p[0], p[1], p[2]); },
  toScreen(x, y, z = 0) { const v = V3(x + book.group.position.x, y, z).project(camera); const r = renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; },
  riseAt(n, t) { jump(n); startRise(n); frame(t, true); for (let i = 0; i < 0; i++); renderer.shadowMap.needsUpdate = true; frame(0); },
  state: S,
};
start().catch((e) => { console.error(e); loader.querySelector('.msg').textContent = UI.failed + e.message; window.__ready = 'error'; });
