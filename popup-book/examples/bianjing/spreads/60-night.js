// ======================= 6. 州橋夜市 =======================
// The Bian River runs across the top of the spread; Zhou Bridge (Tianhan Bridge), low and flat on stone piers,
// carries the Imperial Way south over it. The bridge itself is drawn in plan; its elevation is printed as a
// small framed inset. South of the bridge the night market lines both sides of the street, in the order of the
// Dongjing Meng Hua Lu. Tap a lantern: the lanterns are lit one by one from the bridge southward.
const X0N = -0.1, YR0 = 0.235, YR1 = 0.335;
const spreadNight = {
  key: 'night', title: '州橋夜市', seed: 29,
  light: { el: 40, az: -22, sun: '#a3b4e2', sunI: 0.26, amb: '#97a3c4', ambI: 0.56 },
  hint: '點一下燈籠',
  planImages: ['zhouqiao'],
  sr: '州橋夜市。戌時。天黑了，州橋南邊一盞盞點起燈，水飯、爊肉、乾脯，一攤挨著一攤，要一直熱鬧到三更。州橋正名天漢橋，低平，「不通舟船」；「近橋兩岸，皆石壁，雕鐫海馬水獸飛雲之狀」。夜市從州橋往南擺到龍津橋，「謂之雜嚼，直至三更」。',
  texts: textBlocks({
    x: 0.62, y: 0.08, title: '州橋夜市', time: '戌時',
    body: ['天黑了，', '州橋南邊一盞盞點起燈，', '水飯、爊肉、乾脯，', '一攤挨著一攤，', '要一直熱鬧到三更。'],
    caption: { x: -0.37, y: 0.19, cols: ['州橋正名天漢橋，低平，', '『不通舟船』；', '『近橋兩岸，皆石壁，', '雕鐫海馬水獸飛雲之狀』。', '夜市從州橋往南擺到龍津橋，', '『謂之雜嚼，直至三更』。'] },
  }),
  plan(c) {
    const { g, T, L, line, fill, water, road, label, hlabel } = c;
    // the Imperial Way, north and south of the river
    road([[X0N, 0.47], [X0N, YR1 + 0.012]], 0.06, { tone: 'rgba(190,164,116,0.24)', edge: 'rgba(42,33,25,0.4)' });
    road([[X0N, YR0 - 0.012], [X0N, -0.47]], 0.06, { tone: 'rgba(190,164,116,0.24)', edge: 'rgba(42,33,25,0.4)' });
    // the market ground along both sides of the street
    for (const s of [-1, 1]) fill([[X0N + s * 0.062, YR0 - 0.016], [X0N + s * 0.19, YR0 - 0.016], [X0N + s * 0.19, -0.47], [X0N + s * 0.062, -0.47]], 'rgba(176,146,100,0.1)');
    // 汴河
    const top = [], bot = [];
    for (let x = -0.7; x <= 0.701; x += 0.02) { top.push([x, YR1 + 0.004 * Math.sin(x * 8 + 0.4)]); bot.push([x, YR0 + 0.004 * Math.sin(x * 7 + 1.3)]); }
    water([...top, ...bot.slice().reverse()], '#d6d6c8', '#6f7b84', 0.4);
    line(top, 'rgba(38,40,44,0.8)', 0.0019); line(bot, 'rgba(38,40,44,0.8)', 0.0019);
    // stone revetment of the south bank, seen from above: dressed blocks along the edge
    const sb = bot.map(([x, y]) => [x, y - 0.012]);
    fill([...bot, ...sb.slice().reverse()], 'rgba(168,160,140,0.55)');
    line(sb, 'rgba(42,33,25,0.55)', 0.0012);
    for (let x = -0.68; x < 0.68; x += 0.022) { const y = YR0 + 0.004 * Math.sin(x * 7 + 1.3); line([[x, y], [x, y - 0.012]], 'rgba(42,33,25,0.28)', 0.0008); }
    // 州橋 in plan: stone slabs, stone balustrades with posts
    const bx = 0.056, by0 = YR0 - 0.02, by1 = YR1 + 0.02;
    fill([[X0N - bx, by0], [X0N + bx, by0], [X0N + bx, by1], [X0N - bx, by1]], '#d2cbb8');
    for (let y = by0 + 0.009; y < by1; y += 0.009) line([[X0N - bx, y], [X0N + bx, y]], 'rgba(60,54,44,0.3)', 0.0008);
    for (let i = 0; i < 4; i++) { const x = X0N - bx + (2 * bx) * (i + 0.5) / 4; for (let y = by0 + (i % 2 ? 0.0045 : 0); y < by1; y += 0.018) line([[x, y], [x, y + 0.009]], 'rgba(60,54,44,0.18)', 0.0007); }
    for (const s of [-1, 1]) {
      line([[X0N + s * bx, by0], [X0N + s * bx, by1]], 'rgba(42,33,25,0.85)', 0.0024);
      line([[X0N + s * (bx - 0.007), by0], [X0N + s * (bx - 0.007), by1]], 'rgba(42,33,25,0.45)', 0.0011);
      for (let y = by0; y <= by1 + 0.001; y += 0.017) fill([[X0N + s * bx - 0.003, y + 0.003], [X0N + s * bx + 0.003, y + 0.003], [X0N + s * bx + 0.003, y - 0.003], [X0N + s * bx - 0.003, y - 0.003]], 'rgba(90,84,72,0.95)');
    }
    // the elevation of the bridge, as a framed inset
    const im = PLAN_IMG.zhouqiao;
    const fx0 = 0.205, fx1 = 0.625, fy0 = -0.358, fy1 = -0.462;
    fill([[fx0, fy0], [fx1, fy0], [fx1, fy1], [fx0, fy1]], 'rgba(239,229,207,0.9)');
    line([[fx0, fy0], [fx1, fy0], [fx1, fy1], [fx0, fy1], [fx0, fy0]], 'rgba(42,33,25,0.7)', 0.0016);
    line([[fx0 + 0.005, fy0 - 0.005], [fx1 - 0.005, fy0 - 0.005], [fx1 - 0.005, fy1 + 0.005], [fx0 + 0.005, fy1 + 0.005], [fx0 + 0.005, fy0 - 0.005]], 'rgba(42,33,25,0.4)', 0.0008);
    if (im) {
      const w = 0.39, h = w * im.height / im.width, cx = (fx0 + fx1) / 2, cy = fy1 + 0.012 + h / 2;
      const [X, Y] = T(cx - w / 2, cy + h / 2);
      g.drawImage(im, X, Y, L(w), L(h));
      line([[fx0 + 0.008, fy1 + 0.012], [fx1 - 0.008, fy1 + 0.012]], 'rgba(60,70,80,0.5)', 0.001);
    }
    label('州橋立面', fx0 - 0.03, fy0 - 0.002, 0.019);
    // labels
    label('汴河', 0.5, YR1 - 0.014, 0.024, '#2c3640');
    label('州橋', X0N - 0.032, YR1 - 0.004, 0.024);
    label('御街', X0N - 0.013, YR0 - 0.03, 0.022);
    label('南至龍津橋', X0N - 0.012, -0.335, 0.02);
  },
  build(env) {
    const C = env.card;
    // north bank: stone walls carved with sea horses, water beasts and clouds, behind them the inner city
    C({ id: 'willow-a', x: -0.6, y: 0.39, h: 0.075 });
    C({ id: 'house-tile', x: -0.36, y: 0.415, w: 0.11 });
    C({ id: 'house-tile', x: 0.2, y: 0.415, w: 0.11, mirror: true });
    C({ id: 'willow-b', x: 0.6, y: 0.385, h: 0.075, mirror: true });
    C({ id: 'stonewall', x: -0.4, y: YR1 + 0.007, w: 0.48, h: 0.064 });
    C({ id: 'stonewall', x: 0.23, y: YR1 + 0.007, w: 0.54, h: 0.064, mirror: true });
    C({ id: 'np-porter', x: X0N + 0.015, y: 0.3, h: 0.046, mirror: true });
    // lantern posts at the south end of the bridge
    const poleW = C({ id: 'ln-pole-a', x: X0N - 0.07, y: YR0 - 0.03, h: 0.095 });
    const poleE = C({ id: 'ln-pole-b', x: X0N + 0.07, y: YR0 - 0.03, h: 0.095, mirror: true });
    // the stalls, north to south, as the Dongjing Meng Hua Lu lists the food
    const K = 0.105 / 480, XW = X0N - 0.125, XE = X0N + 0.125;
    const ST = [
      ['ns-noodle', XW, 0.15, true, [0.045, 0.642], '水飯', [0.52, 0.56]],
      ['ns-stew', XE, 0.15, true, [0.937, 0.78], '爊肉', [0.22, 0.5]],
      ['ns-dried', XW, 0.03, true, [0.052, 0.669], '乾脯', null],
      ['ns-tea', XE, 0.03, false, [0.067, 0.634], null, [0.25, 0.5]],
      ['ns-poultry', XW, -0.09, true, [0.065, 0.686], '鵝鴨雞兔', null],
      ['ns-buns', XE, -0.09, true, [0.926, 0.787], '包子', [0.38, 0.56]],
      ['ns-grill', XW, -0.33, false, [0.924, 0.77], '旋煎羊　白腸', [0.55, 0.6]],
      ['ns-pickle', XE, -0.33, true, [0.925, 0.771], '薑辣蘿蔔', null],
      ['ns-fruit', XW, -0.45, true, [0.052, 0.664], null, null],
      ['ns-sugar', XE, -0.45, true, [0.9, 0.78], null, null],
    ];
    const stalls = ST.map(([id, x, y, m, lamp, tag, steam]) => ({ card: C({ id, x, y, w: PIECES[id].w * K, mirror: m }), lamp, tag, steam }));
    // diners, passers-by and the watch
    C({ id: 'np-scholar', x: XW - 0.083, y: 0.12, h: 0.042 });
    C({ id: 'np-vendor', x: X0N - 0.028, y: 0.09, h: 0.05 });
    const family = C({ id: 'np-family', x: X0N + 0.022, y: -0.02, h: 0.052 });
    C({ id: 'np-friends', x: 0.12, y: -0.1, h: 0.046 });
    C({ id: 'np-diners', x: XW, y: -0.21, h: 0.044 });
    C({ id: 'np-sweets', x: XE - 0.005, y: -0.21, h: 0.054 });
    const watch = C({ id: 'np-watch', x: X0N + 0.026, y: -0.25, h: 0.052, mirror: true });
    const poleS = C({ id: 'ln-pole-c', x: X0N + 0.068, y: -0.2, h: 0.09, mirror: true });
    const frame = C({ id: 'ln-frame', x: -0.335, y: -0.29, h: 0.08 });
    // a two-storey shop north-east of the street and an inn to the south-west, with lanterns under their eaves
    const shop = C({ id: 'shop2', x: 0.42, y: 0.12, w: 0.2 });
    const inn = C({ id: 'jiaodian', x: -0.52, y: -0.42, w: 0.24 });
    const hang = (host, id, u, vTop, h) => C({ id, x: host.def.x + (u - 0.5) * host.width, y: host.def.y - 0.006, z: vTop * host.height - h, h, riseWith: host });
    const hung = [hang(shop, 'ln-round-b', 0.322, 0.33, 0.027), hang(shop, 'ln-round-c', 0.678, 0.33, 0.025), hang(shop, 'ln-square-a', 0.14, 0.75, 0.03), hang(shop, 'ln-square-b', 0.86, 0.75, 0.03),
      hang(inn, 'ln-round-a', 0.245, 0.54, 0.028), hang(inn, 'ln-round-e', 0.755, 0.54, 0.032)];
    C({ id: 'willow-a', x: 0.6, y: 0.15, h: 0.1, mirror: true });

    // ---- lanterns: a lit core on the lantern, a pool of light on the ground ----
    const lamps = [];
    const addLamp = (card, u, v, size = 0.04) => lamps.push({ card, u, v, size });
    stalls.forEach((s) => addLamp(s.card, s.lamp[0], s.lamp[1], 0.034));
    addLamp(poleW, 0.741, 0.745); addLamp(poleE, 0.748, 0.737); addLamp(poleS, 0.65, 0.72);
    addLamp(frame, 0.312, 0.632); addLamp(frame, 0.666, 0.633);
    hung.forEach((c) => addLamp(c, 0.5, 0.56, 0.042));
    addLamp(watch, 0.195, 0.337, 0.03); addLamp(family, 0.9, 0.29, 0.026);
    const rnd = mulberry32(17);
    for (const L0 of lamps) {
      const p = cardPoint(L0.card, L0.u, L0.v);
      L0.p = p; L0.ph = rnd() * 6; L0.level = 0;
      L0.core = glowMesh(L0.size); L0.core.rotation.x = Math.PI / 2; L0.core.position.set(p[0], p[1] - 0.005, p[2]); env.add(L0.core);
      L0.pool = glowMesh(0.15); L0.pool.position.set(p[0], p[1] - 0.025, 0.0012); L0.pool.renderOrder = 2; env.add(L0.pool);
    }
    lamps.sort((a, b) => b.p[1] - a.p[1] || a.p[0] - b.p[0]);
    lamps.forEach((L0, i) => { L0.delay = 0.25 + i * 0.17; L0.off = (lamps.length - 1 - i) * 0.035; L0.card.mesh.userData.tap = true; });
    // food names from the book, shown as each stall is lit
    const tags = stalls.filter((s) => s.tag).map((s) => {
      const m = tagMesh(s.tag, null, 0.03), c = s.card;
      m.position.set(c.def.x, c.def.y - 0.012, c.height + 0.016); env.add(m);
      return { m, lamp: lamps.find((L0) => L0.card === c) };
    });
    // steam over the pots
    const puffTex = softBlob(128, 'rgba(255,252,246,0.9)');
    const puffs = [];
    stalls.filter((s) => s.steam).forEach((s, k) => {
      const p = cardPoint(s.card, s.steam[0], s.steam[1]);
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.024), new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, opacity: 0, depthWrite: false }));
        m.rotation.x = Math.PI / 2; m.renderOrder = 4; env.add(m);
        puffs.push({ m, p, ph: i / 3 + k * 0.17 });
      }
    });
    // warm point lights over the street and the shop: they stay in the scene so materials never recompile
    const PL = [[X0N, 0.13, 0.1], [X0N, -0.12, 0.1], [X0N, -0.38, 0.1], [0.42, 0.06, 0.09], [-0.5, -0.36, 0.09]].map(([x, y, z]) => {
      const l = new THREE.PointLight('#ffb35c', 0, 0.42, 1.6); l.position.set(x, y, z); env.light(l);
      return { l, near: [] };
    });
    lamps.forEach((L0) => { let best = 0, bd = 9; PL.forEach((q, i) => { const d = Math.hypot(q.l.position.x - L0.p[0], q.l.position.y - L0.p[1]); if (d < bd) { bd = d; best = i; } }); PL[best].near.push(L0); });
    const PI0 = 0.05;

    const st = { on: false, t: 0, active: false };
    const mech = {
      home: true,
      tap(card) {
        if (!lamps.some((L0) => L0.card === card)) return false;
        st.on = !st.on; st.t = 0; st.active = true; mech.home = false;
        env.sfx(st.on ? 'fire' : 'page', 0.7);
        return true;
      },
      leave() { PL.forEach((q) => (q.l.intensity = 0)); },
      reset() {
        st.on = false; st.t = 0; st.active = false; mech.home = true;
        lamps.forEach((L0) => { L0.level = 0; L0.core.material.opacity = 0; L0.pool.material.opacity = 0; });
        tags.forEach((g) => (g.m.material.opacity = 0));
        PL.forEach((q) => (q.l.intensity = 0));
      },
      update(dt, now) {
        if (st.active) {
          st.t += dt;
          let busy = false;
          for (const L0 of lamps) {
            const prev = L0.level;
            if (st.on) { if (st.t > L0.delay) L0.level = Math.min(1, L0.level + dt / 0.35); }
            else if (st.t > L0.off) L0.level = Math.max(0, L0.level - dt / 0.3);
            if (st.on && prev === 0 && L0.level > 0 && lamps.indexOf(L0) % 3 === 0) env.sfx('fire', 0.35);
            if (L0.level !== (st.on ? 1 : 0)) busy = true;
          }
          for (const g of tags) {
            const a = st.t - g.lamp.delay;
            g.m.material.opacity = st.on ? 0.95 * smooth(0.1, 0.45, a) * (1 - smooth(3.4, 4.2, a)) : 0;
            if (st.on && a < 4.2) busy = true;
          }
          if (!busy) { st.active = false; if (!st.on) mech.home = true; }
        }
        for (const L0 of lamps) {
          const f = 0.9 + 0.06 * Math.sin(now * 11 + L0.ph) + 0.04 * Math.sin(now * 23.7 + L0.ph * 2);
          L0.core.material.opacity = 0.95 * L0.level * f;
          L0.pool.material.opacity = 0.3 * L0.level * f;
        }
        for (const q of PL) {
          const lv = q.near.reduce((a, L0) => Math.max(a, L0.level), 0);
          q.l.intensity = PI0 * lv * (0.94 + 0.06 * Math.sin(now * 9 + q.l.position.y * 20));
        }
        for (const pf of puffs) {
          const u = (now * 0.42 + pf.ph) % 1;
          pf.m.position.set(pf.p[0] + 0.006 * Math.sin(u * 5 + pf.ph * 9), pf.p[1] - 0.004, pf.p[2] + 0.055 * u);
          const s = 0.7 + 1.6 * u; pf.m.scale.set(s, s, 1);
          pf.m.material.opacity = 0.32 * Math.sin(Math.PI * u);
        }
        return false;
      },
    };
    return mech;
  },
};
