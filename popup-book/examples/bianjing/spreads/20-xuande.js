// ======================= 2. 宣德樓前 =======================
// The palace gate at the head of the Imperial Way. The way itself is drawn on the page as in the
// Dongjing Meng Hua Lu: the emperor's road in the middle, two brick water channels with young lotus,
// red-lacquered barriers, the walking lanes, black-lacquered barriers and the covered corridors.
// Tap the gate: a flock of cranes circles the tower, two settle on the roof-ridge ornaments, then all fly off north-west.
const X0X = -0.08, YG = 0.19, YS = 0.058;   // YG: the gate; YS: the south edge of the square in front of it
const spreadXuande = {
  key: 'xuande', title: '宣德樓前', seed: 13,
  light: { el: 42, az: 50, sun: '#fff0d8', sunI: 0.66, amb: '#e8eaee', ambI: 0.74 },
  hint: '點一下宣德樓',
  planImages: ['lotus'],
  sr: '宣德樓前。辰時。早朝散了，紫緋綠袍魚貫出宮，御溝的荷葉才冒頭，岸上梨花一片白，中間的御道沒人敢踏。宣德樓是皇宮正門，《東京夢華錄》說它「列五門，門皆金釘朱漆」，門前御道「不得人馬行往」。政和二年上元次夕，群鶴飛鳴於宣德門上，徽宗畫下《瑞鶴圖》。',
  texts: textBlocks({
    x: 0.62, y: -0.01, title: '宣德樓前', time: '辰時',
    body: ['早朝散了，', '紫緋綠袍魚貫出宮，', '御溝的荷葉才冒頭，', '岸上梨花一片白，', '中間的御道沒人敢踏。'],
    caption: { x: -0.33, y: -0.005, cols: ['宣德樓是皇宮正門，', '《東京夢華錄》說它', '『列五門，門皆金釘朱漆』，', '門前御道『不得人馬行往』。', '政和二年上元次夕，', '群鶴飛鳴於宣德門上，', '徽宗畫下《瑞鶴圖》。'] },
  }),
  plan(c) {
    const { g, T, L, line, fill, water, road, label } = c;
    // palace precinct behind the gate
    fill([[-0.7, YG + 0.026], [0.7, YG + 0.026], [0.7, 0.52], [-0.7, 0.52]], 'rgba(176,150,104,0.08)');
    fill([[-0.7, YG - 0.004], [0.7, YG - 0.004], [0.7, YG + 0.026], [-0.7, YG + 0.026]], 'rgba(150,118,74,0.24)');
    // the street in front of the gate
    fill([[-0.7, YS], [0.7, YS], [0.7, YG - 0.004], [-0.7, YG - 0.004]], 'rgba(196,168,118,0.24)');
    line([[-0.7, YS], [0.7, YS]], 'rgba(42,33,25,0.4)', 0.0014);
    for (let x = -0.68; x < 0.7; x += 0.024) line([[x, YS + 0.002], [x, YG - 0.006]], 'rgba(42,33,25,0.05)', 0.0008);
    const y0 = YS, y1 = -0.52;
    const seg = (x, col, w) => line([[x, y0], [x, y1]], col, w);
    for (const s of [-1, 1]) {
      const X = (d) => X0X + s * d;
      // covered corridor (roof in plan): grey tiles, ridge along the street
      fill([[X(0.168), y0], [X(0.218), y0], [X(0.218), y1], [X(0.168), y1]], 'rgba(150,146,134,0.55)');
      for (let y = y0 - 0.004; y > y1; y -= 0.0055) line([[X(0.17), y], [X(0.216), y]], 'rgba(60,56,48,0.22)', 0.0008);
      seg(X(0.193), 'rgba(50,46,40,0.55)', 0.0016); seg(X(0.168), 'rgba(42,33,25,0.7)', 0.0014); seg(X(0.218), 'rgba(42,33,25,0.7)', 0.0014);
      // black-lacquered barrier in front of the corridor
      seg(X(0.163), 'rgba(28,24,22,0.85)', 0.0026);
      for (let y = y0; y > y1; y -= 0.0042) line([[X(0.159), y], [X(0.167), y]], 'rgba(28,24,22,0.55)', 0.0008);
      // walking lane
      fill([[X(0.082), y0], [X(0.159), y0], [X(0.159), y1], [X(0.082), y1]], 'rgba(196,168,118,0.26)');
      // red-lacquered barrier, two rows down the middle
      seg(X(0.08), 'rgba(150,52,36,0.85)', 0.003);
      for (let y = y0; y > y1; y -= 0.0042) line([[X(0.0765), y], [X(0.0835), y]], 'rgba(150,52,36,0.6)', 0.0009);
      for (let y = y0; y > y1; y -= 0.022) fill([[X(0.076), y + 0.003], [X(0.084), y + 0.003], [X(0.084), y - 0.003], [X(0.076), y - 0.003]], 'rgba(110,36,24,0.95)');
      // brick water channel inside the red barrier
      const ch = [[X(0.046), y0], [X(0.072), y0], [X(0.072), y1], [X(0.046), y1]];
      water(ch, '#dfe0cf', '#7f907c', 0.3);
      seg(X(0.046), 'rgba(120,70,50,0.75)', 0.0018); seg(X(0.072), 'rgba(120,70,50,0.75)', 0.0018);
      // young lotus leaves floating in the channel
      if (PLAN_IMG.lotus) {
        const r = mulberry32(s > 0 ? 71 : 37);
        for (let y = y0 - 0.01; y > y1; y -= 0.009 + r() * 0.014) {
          const b = ATLAS.lotus[Math.floor(r() * ATLAS.lotus.length)], sz = 0.007 + r() * 0.007;
          const cx = X(0.059) + (r() - 0.5) * 0.012, [Xp, Yp] = T(cx, y), wpx = L(sz), hpx = wpx * b[3] / b[2];
          g.save(); g.translate(Xp, Yp); g.rotate(r() * 6.28); g.globalAlpha = 0.92;
          g.drawImage(PLAN_IMG.lotus, b[0], b[1], b[2], b[3], -wpx / 2, -hpx / 2, wpx, hpx); g.restore();
        }
      }
    }
    // the emperor's road: pale paving, nobody walks here
    fill([[X0X - 0.046, y0], [X0X + 0.046, y0], [X0X + 0.046, y1], [X0X - 0.046, y1]], 'rgba(222,206,170,0.5)');
    for (let y = y0 - 0.01; y > y1; y -= 0.02) line([[X0X - 0.046, y], [X0X + 0.046, y]], 'rgba(42,33,25,0.08)', 0.0008);
    label('宣德樓', X0X + 0.225, 0.465);
    label('御道', X0X - 0.013, -0.02);
    label('御溝', X0X + 0.048, -0.36, 0.021, '#3e4a40');
    label('朱漆杈子', X0X + 0.086, -0.355, 0.02, '#7a2c1f');
    label('黑漆杈子', X0X - 0.205, -0.35, 0.02);
    label('御廊', X0X - 0.226, -0.04);
    label('闕亭', X0X - 0.2, 0.092, 0.02);
  },
  build(env) {
    const C = env.card;
    // the gate and its flanking towers
    const gate = C({ id: 'xuande', x: X0X, y: YG, w: 0.36 });
    C({ id: 'duolou', x: X0X - 0.29, y: YG + 0.012, w: 0.2 });
    C({ id: 'duolou', x: X0X + 0.29, y: YG + 0.012, w: 0.2, mirror: true });
    C({ id: 'guard-halberd-a', x: X0X - 0.045, y: YG - 0.024, h: 0.044 });
    C({ id: 'guard-halberd-b', x: X0X + 0.045, y: YG - 0.024, h: 0.044, mirror: true });
    C({ id: 'queting', x: X0X - 0.2, y: YS + 0.042, w: 0.115 });
    C({ id: 'queting', x: X0X + 0.2, y: YS + 0.042, w: 0.115, mirror: true });
    C({ id: 'yulang', x: -0.468, y: YS - 0.006, w: 0.34 });
    C({ id: 'yulang', x: 0.42, y: YS - 0.006, w: 0.42, mirror: true });
    // trees on the channel banks, inside the red barriers
    [[-1, 0.01, 'pear'], [1, -0.04, 'peach'], [-1, -0.13, 'peach'], [1, -0.19, 'pear'], [-1, -0.28, 'pear'], [1, -0.34, 'peach'], [-1, -0.43, 'peach']].forEach(([s, y, id], i) =>
      C({ id, x: X0X + s * 0.077, y, h: 0.085, mirror: i % 3 === 1 }));
    // officials leaving court along the walking lanes
    C({ id: 'off-purple', x: X0X - 0.122, y: 0.0, h: 0.05 });
    C({ id: 'off-green', x: X0X + 0.122, y: -0.02, h: 0.05, mirror: true });
    C({ id: 'off-red', x: X0X - 0.12, y: -0.14, h: 0.05 });
    C({ id: 'off-purple2', x: X0X + 0.124, y: -0.17, h: 0.05, mirror: true });
    C({ id: 'off-rider', x: X0X - 0.122, y: -0.3, h: 0.066 });
    C({ id: 'off-retinue', x: X0X + 0.122, y: -0.32, h: 0.06, mirror: true });
    C({ id: 'page-box', x: X0X + 0.12, y: -0.45, h: 0.044, mirror: true });
    // outside the corridors
    C({ id: 'house-thatch', x: -0.5, y: -0.43, w: 0.14 });
    C({ id: 'willow-a', x: -0.6, y: -0.42, h: 0.1 });
    C({ id: 'house-tile', x: 0.34, y: -0.44, w: 0.14 });
    C({ id: 'elm', x: 0.58, y: -0.37, h: 0.11, mirror: true });

    // ---- the cranes of Huizong's painting ----
    const CYCLES = [[1, 6, 2, 3, 2, 6], [5, 6, 7, 8, 7, 6], [9, 6, 2, 3, 2, 6], [0, 6, 7, 8, 7, 6]];
    const SPAN = 0.062;
    const NC = 10;
    const flyTex = []; for (let i = 0; i < 10; i++) pieceTex('crane' + i).then((t) => (flyTex[i] = t));
    const ridge = [cardPoint(gate, 384 / 1300, 1.0), cardPoint(gate, 912 / 1300, 1.0)];
    const rnd = mulberry32(5);
    // the spread shows and hides its extras as a whole; the birds inside the flock are shown one by one
    const flock = new THREE.Group(); env.add(flock);
    const cranes = [];
    for (let i = 0; i < NC; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#f6f0e4', transparent: true, depthWrite: false, alphaTest: 0.02 }));
      m.renderOrder = 5; m.visible = false; flock.add(m);
      cranes.push({ m, cyc: CYCLES[i % 4], ph: rnd() * 6, th0: (i / NC) * Math.PI * 2 + rnd() * 0.3, z: 0.14 + rnd() * 0.05, rr: 0.9 + rnd() * 0.2,
        from: [0.8 + rnd() * 0.2, 0.3 + rnd() * 0.08, 0.26], to: [-0.95 - rnd() * 0.15, 0.4 + rnd() * 0.1, 0.3], delay: i * 0.13 });
    }
    const perched = ['crane-stand-a', 'crane-stand-b'].map((id, k) => {
      const m = spritePlane(id, 0.046, { order: 5, depthWrite: true, alphaTest: 0.35 });
      m.rotation.x = Math.PI / 2; m.visible = false; flock.add(m);
      // the sprites' feet are off-centre (a: right of centre, b: left); stand them on the ornament tips
      const p = ridge[k]; m.position.set(p[0] + (k ? 0.0044 : -0.0042), p[1] - 0.003, p[2] + 0.023 - 0.002);
      return m;
    });
    const CA = { u: [0.826, 0.819, 0.841, 0.839, 0.743, 0.82, 0.851, 0.828, 0.85, 0.821], v: [0.515, 0.39, 0.833, 0.864, 0.773, 0.487, 0.362, 0.923, 0.907, 0.509], asp: [300 / 225, 300 / 230, 300 / 127, 300 / 177, 300 / 258, 300 / 222, 300 / 208, 300 / 121, 300 / 150, 300 / 272] };
    const cx = X0X, cy = YG - 0.05, RX = 0.3, RY = 0.055, OM = 0.85;
    const orbit = (c, t) => { const th = c.th0 + OM * t; return [cx + RX * c.rr * Math.cos(th), cy + RY * c.rr * Math.sin(th), c.z + 0.012 * Math.sin(2 * th + c.ph)]; };
    // place one crane: head point p, heading sign dir (+1 = flying right), sprite frame k
    function pose(c, p, dir, k) {
      const t = flyTex[k]; if (!t) { c.m.visible = false; return; }
      if (c.m.material.map !== t) { const had = !!c.m.material.map; c.m.material.map = t; if (!had) c.m.material.needsUpdate = true; }
      const w = SPAN, h = SPAN / CA.asp[k];
      c.m.scale.set(w * dir, h, 1);
      c.m.position.set(p[0] - dir * (CA.u[k] - 0.5) * w, p[1] - (CA.v[k] - 0.5) * h, p[2]);
      c.m.visible = true;
    }
    const st = { t: -1 };
    gate.mesh.userData.tap = true;
    const T_LAND = [3.2, 3.9], T_LEAVE = 9.6, T_END = 14;
    const mech = {
      home: true, perched, ridge,
      tap(card) {
        if (card !== gate || st.t >= 0) return false;
        st.t = 0; mech.home = false; env.sfx('crane'); return true;
      },
      reset() { st.t = -1; mech.home = true; cranes.forEach((c) => (c.m.visible = false)); perched.forEach((m) => (m.visible = false)); },
      update(dt, now) {
        if (st.t < 0) return false;
        st.t += dt; const t = st.t;
        if (Math.floor((t - dt) / 2.6) !== Math.floor(t / 2.6) && t < T_LEAVE + 2) env.sfx('crane', 0.7);
        cranes.forEach((c, i) => {
          const tl = t - c.delay;
          if (tl < 0) { c.m.visible = false; return; }
          const k = c.cyc[Math.floor((tl * 9 + c.ph) % c.cyc.length)];
          let p = orbit(c, tl), q = orbit(c, tl + 0.05);
          if (tl < 1.7) { const e = easeInOut(tl / 1.7); p = [lerp(c.from[0], p[0], e), lerp(c.from[1], p[1], e), lerp(c.from[2], p[2], e)]; q = [p[0] - 0.01, p[1], p[2]]; }
          // the first two settle on the ridge ends, facing each other
          if (i < 2) {
            const land = T_LAND[i], r = ridge[i];
            const perch = [r[0] + (i ? -0.004 : 0.004), r[1] - 0.003, r[2] + 0.04];
            if (t >= land && t < T_LEAVE + 0.4) {
              const e = clamp((t - land) / 1.4);
              if (e < 1) { p = [lerp(p[0], perch[0], easeInOut(e)), lerp(p[1], perch[1], easeInOut(e)), lerp(p[2], perch[2], easeInOut(e))]; q = [p[0] + (i ? -0.01 : 0.01), p[1], p[2]]; perched[i].visible = false; }
              else { c.m.visible = false; perched[i].visible = true; return; }
            } else if (t >= T_LEAVE + 0.4) perched[i].visible = false;
          }
          if (t >= T_LEAVE) {
            const e = easeIn(clamp((t - T_LEAVE - i * 0.08) / 3.4));
            const start = i < 2 ? [ridge[i][0] + (i ? -0.004 : 0.004), ridge[i][1] - 0.003, ridge[i][2] + 0.04] : orbit(c, T_LEAVE - c.delay);
            p = [lerp(start[0], c.to[0], e), lerp(start[1], c.to[1], e), lerp(start[2], c.to[2], e)]; q = [p[0] - 0.01, p[1], p[2]];
          }
          pose(c, p, q[0] >= p[0] ? 1 : -1, k);
        });
        if (t > T_END) mech.reset();
        return false;   // the cranes cast no shadow
      },
    };
    return mech;
  },
};
