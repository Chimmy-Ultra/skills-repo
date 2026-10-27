// ======================= 3. 大相國寺萬姓交易 =======================
// The monthly fair inside Daxiangguo Temple, laid out along the temple axis in the order of the
// Dongjing Meng Hua Lu: birds and pets at the great gate, awnings in the courtyard, preserves and ink by the
// Buddha hall, nuns' embroidery in the side corridors, books and incense before the Zisheng Gate,
// fortune tellers and portrait painters in the rear corridor. The stalls lie folded until the gate is tapped.
const X0T = -0.15;
const spreadTemple = {
  key: 'temple', title: '大相國寺', seed: 17,
  light: { el: 52, az: 30, sun: '#fff5e6', sunI: 0.66, amb: '#ece9e2', ambI: 0.74 },
  hint: '點一下大三門，開市',
  sr: '大相國寺萬姓交易。巳時。每月五回，相國寺的大門一開，鳥籠、簟席、弓劍、蜜煎，從山門一路擺到後廊，萬姓都來趕這一場。大相國寺是汴京最大的寺院。《東京夢華錄》：「相國寺每月五次開放萬姓交易」，「大三門上皆是飛禽貓犬之類，珍禽奇獸，無所不有」；「後廊皆日者貨術傳神之類」。',
  texts: textBlocks({
    x: 0.62, y: 0.045, title: '大相國寺', time: '巳時',
    body: ['每月五回，', '相國寺的大門一開，', '鳥籠、簟席、弓劍、蜜煎，', '從山門一路擺到後廊，', '萬姓都來趕這一場。'],
    caption: { x: 0.62, y: 0.43, cols: ['大相國寺是汴京最大的寺院。', '《東京夢華錄》：『相國寺', '每月五次開放萬姓交易』，', '『大三門上皆是飛禽貓犬之類，', '珍禽奇獸，無所不有』；', '『後廊皆日者貨術傳神之類』。'] },
  }),
  plan(c) {
    const { line, fill, road, label } = c;
    const xa = X0T - 0.335, xb = X0T + 0.335, ya = -0.305, yb = 0.455;
    // street outside the gate
    road([[-0.7, -0.36], [0.7, -0.36]], 0.035, { tone: 'rgba(196,168,118,0.22)', edge: 'rgba(42,33,25,0.25)', pave: 0 });
    // temple ground and its wall
    fill([[xa, ya], [xb, ya], [xb, yb], [xa, yb]], 'rgba(214,196,156,0.25)');
    line([[xa, ya], [xa, yb], [xb, yb], [xb, ya]], 'rgba(120,70,50,0.55)', 0.004);
    line([[xa, ya], [X0T - 0.15, ya]], 'rgba(120,70,50,0.55)', 0.004); line([[X0T + 0.15, ya], [xb, ya]], 'rgba(120,70,50,0.55)', 0.004);
    // side corridors in plan
    for (const s of [-1, 1]) {
      const x1 = X0T + s * 0.27, x2 = X0T + s * 0.318;
      fill([[x1, -0.27], [x2, -0.27], [x2, 0.36], [x1, 0.36]], 'rgba(150,146,134,0.55)');
      for (let y = -0.266; y < 0.36; y += 0.0055) line([[x1, y], [x2, y]], 'rgba(60,56,48,0.22)', 0.0008);
      line([[(x1 + x2) / 2, -0.27], [(x1 + x2) / 2, 0.36]], 'rgba(50,46,40,0.55)', 0.0016);
      line([[x1, -0.27], [x1, 0.36]], 'rgba(42,33,25,0.7)', 0.0014); line([[x2, -0.27], [x2, 0.36]], 'rgba(42,33,25,0.7)', 0.0014);
    }
    // the stone path along the axis
    fill([[X0T - 0.028, -0.3], [X0T + 0.028, -0.3], [X0T + 0.028, 0.4], [X0T - 0.028, 0.4]], 'rgba(222,206,170,0.55)');
    for (let y = -0.29; y < 0.4; y += 0.016) line([[X0T - 0.028, y], [X0T + 0.028, y]], 'rgba(42,33,25,0.1)', 0.0008);
    label('大三門', X0T + 0.2, -0.24, 0.022);
    label('庭中', X0T - 0.075, -0.09, 0.022);
    label('佛殿', X0T - 0.17, 0.0, 0.022);
    label('兩廊', X0T - 0.302, 0.0, 0.022);
    label('資聖閣', X0T + 0.168, 0.33, 0.022);
    label('後廊', X0T + 0.345, 0.455, 0.022);
  },
  build(env) {
    const C = env.card;
    const gate = C({ id: 'xg-gate', x: X0T, y: -0.3, w: 0.3 });
    C({ id: 'temple', x: X0T, y: 0.03, w: 0.28 });
    C({ id: 'xg-pavilion', x: X0T, y: 0.26, w: 0.22 });
    C({ id: 'xg-corridor', x: X0T, y: 0.37, w: 0.64 });
    C({ id: 'elm', x: X0T - 0.23, y: -0.2, h: 0.11 });
    C({ id: 'apricot', x: X0T + 0.235, y: -0.22, h: 0.09, mirror: true });
    C({ id: 'elm', x: -0.56, y: -0.44, h: 0.1 });
    C({ id: 'shop', x: 0.49, y: -0.45, w: 0.12 });
    C({ id: 'willow-b', x: 0.58, y: -0.38, h: 0.1, mirror: true });
    // fair goers
    C({ id: 'fair-cageman', x: X0T + 0.1, y: -0.395, h: 0.046 });
    C({ id: 'fair-porter', x: X0T - 0.03, y: -0.45, h: 0.046 });
    C({ id: 'fair-couple', x: X0T + 0.04, y: -0.16, h: 0.046 });
    C({ id: 'fair-child', x: X0T + 0.065, y: -0.245, h: 0.034 });
    C({ id: 'fair-monk-a', x: X0T + 0.045, y: -0.005, h: 0.047 });
    C({ id: 'fair-nun', x: X0T - 0.2, y: 0.075, h: 0.046 });
    C({ id: 'fair-woman', x: X0T - 0.165, y: 0.105, h: 0.045, mirror: true });
    C({ id: 'fair-scholar', x: X0T - 0.04, y: 0.175, h: 0.046 });
    C({ id: 'fair-monk-b', x: X0T + 0.05, y: 0.235, h: 0.047, mirror: true });
    C({ id: 'fair-oldwoman', x: X0T + 0.22, y: 0.165, h: 0.044, mirror: true });
    // the stalls, zone by zone, held folded until the fair opens
    const S = (id, x, y, w, m) => { const c = C({ id, x: X0T + x, y, w, mirror: !!m }); c.held = true; return c; };
    const grow = (c, s) => c.root.scale.setScalar(Math.max(1e-4, s));   // a closed stall is not there at all
    const zones = [
      { tag: '大三門　飛禽貓犬', at: [X0T - 0.1, -0.43], cards: [S('fair-birds', -0.105, -0.375, 0.075)] },
      { tag: '庭中　彩幕露屋義鋪', at: [X0T, -0.27], cards: [S('fair-mats', -0.12, -0.21, 0.075), S('fair-saddles', 0.12, -0.2, 0.075, true), S('fair-fruit', -0.13, -0.1, 0.075)] },
      { tag: '佛殿旁　蜜煎　筆墨', at: [X0T + 0.17, -0.12], cards: [S('fair-honey', 0.125, -0.085, 0.07, true), S('fair-brush', 0.21, -0.035, 0.07)] },
      { tag: '兩廊　師姑繡作', at: [X0T - 0.2, 0.05], cards: [S('fair-nuns', -0.235, 0.125, 0.075)] },
      { tag: '資聖門前　書籍香藥', at: [X0T, 0.135], cards: [S('fair-books', -0.11, 0.2, 0.075), S('fair-incense', 0.11, 0.2, 0.075, true)] },
      { tag: '後廊　日者傳神', at: [X0T + 0.21, 0.29], cards: [S('fair-fortune', 0.215, 0.335, 0.07)] },
    ];
    zones.forEach((z) => { z.mesh = tagMesh(z.tag, 0.19); z.mesh.position.set(z.at[0], z.at[1], 0.075); env.add(z.mesh); });
    gate.mesh.userData.tap = true;
    const st = { open: 0, t: 0, dir: 0 };
    const STEP = 0.85, RISE = 0.55;
    const mech = {
      home: true,
      tap(card) {
        if (card !== gate) return false;
        if (st.dir) return true;   // let the stalls finish rising or folding first
        st.dir = st.open ? -1 : 1; st.t = 0; mech.home = false;
        if (st.dir > 0) zones.forEach((z) => z.cards.forEach((c) => (c.held = false)));
        if (st.dir > 0) env.sfx('bell', 0.8); else env.sfx('page', 0.6);
        return true;
      },
      reset() { st.open = 0; st.t = 0; st.dir = 0; mech.home = true; zones.forEach((z) => { z.cards.forEach((c) => { c.held = true; c.setRise(0); grow(c, 0); }); z.mesh.material.opacity = 0; }); },
      update(dt) {
        if (!st.dir) return false;
        st.t += dt; const t = st.t;
        let done = true;
        zones.forEach((z, i) => {
          if (st.dir > 0) {
            const u = clamp((t - i * STEP) / RISE);
            z.cards.forEach((c, k) => { const uk = clamp((u - k * 0.15) / 0.85); c.setRise(REDUCED ? uk : easeOutBack(uk)); grow(c, REDUCED ? (uk > 0 ? 1 : 0) : easeOutBack(clamp(uk * 1.4))); });
            if (u > 0 && u < 1 && Math.floor((t - dt - i * STEP) / RISE * 3) !== Math.floor((t - i * STEP) / RISE * 3)) env.sfx('pop', 0.5);
            const a = t - i * STEP;
            z.mesh.material.opacity = 0.95 * smooth(0, 0.3, a) * (1 - smooth(2.4, 3.0, a));
            if (a < 3.0) done = false;
          } else {
            const u = 1 - clamp((t - (zones.length - 1 - i) * 0.12) / 0.4);
            z.cards.forEach((c) => { c.setRise(easeInOut(u)); grow(c, clamp(u * 2.2)); });
            z.mesh.material.opacity = 0;
            if (u > 0) done = false;
          }
        });
        if (done) { st.open = st.dir > 0 ? 1 : 0; st.dir = 0; if (!st.open) { mech.home = true; zones.forEach((z) => z.cards.forEach((c) => (c.held = true))); } }
        return true;
      },
    };
    return mech;
  },
};
