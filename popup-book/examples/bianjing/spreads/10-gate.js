// ======================= 1. 城門晨開 =======================
const YW = 0.165;
const GATE_W = 0.36;
const spread1 = {
  key: 'gate', title: '城門晨開', seed: 5,
  light: { el: 31, az: 66, sun: '#ffe1b8', sunI: 0.66, amb: '#e3e7ee', ambI: 0.74 },
  hint: '點一下朱雀門',
  sr: '城門晨開。卯時。霧還貼著蔡河，朱雀門的門閂一落，兩扇大門吱呀推開，駝隊踩著御街出城，鈴聲比人先過了橋。朱雀門是汴京內城的正南門。《東京夢華錄》寫：「出朱雀門，直至龍津橋」，龍津橋就跨在蔡河上；「過龍津橋南去，路心又設朱漆杈子」。',
  texts: textBlocks({
    x: 0.62, y: 0.082, title: '城門晨開', time: '卯時',
    body: ['霧還貼著蔡河，', '朱雀門的門閂一落，', '兩扇大門吱呀推開，', '駝隊踩著御街出城，', '鈴聲比人先過了橋。'],
    caption: { x: -0.362, y: 0.1, cols: ['朱雀門是汴京內城的正南門。', '《東京夢華錄》寫：', '『出朱雀門，直至龍津橋』，', '龍津橋就跨在蔡河上；', '『過龍津橋南去，', '路心又設朱漆杈子』。'] },
  }),
  plan(c) {
    const { g, T, L, line, fill, water, road, label } = c;
    // inner city: a faint ground tint, lanes and ward walls
    fill([[-0.64, YW + 0.012], [0.64, YW + 0.012], [0.64, 0.47], [-0.64, 0.47]], 'rgba(176,150,104,0.07)');
    for (const y of [0.3, 0.425]) for (const s of [-1, 1]) { line([[s * 0.06, y], [s * 0.64, y]], 'rgba(42,33,25,0.28)', 0.0012); line([[s * 0.06, y + 0.013], [s * 0.64, y + 0.013]], 'rgba(42,33,25,0.28)', 0.0012); }
    for (const x of [-0.34, 0.34]) { line([[x, YW + 0.025], [x, 0.47]], 'rgba(42,33,25,0.25)', 0.0012); line([[x + 0.013, YW + 0.025], [x + 0.013, 0.47]], 'rgba(42,33,25,0.25)', 0.0012); }
    road([[0, YW + 0.02], [0, 0.47]], 0.05);
    // wall footprint
    fill([[-0.64, YW - 0.002], [0.64, YW - 0.002], [0.64, YW + 0.024], [-0.64, YW + 0.024]], 'rgba(150,118,74,0.22)');
    // the Imperial Way south of the gate
    road([[0, YW], [0, -0.47]], 0.052);
    for (const s of [-1, 1]) { const x1 = s < 0 ? -0.34 : -0.0; line([[s * 0.055, -0.11], [s < 0 ? -0.34 : 0.19, -0.11]], 'rgba(42,33,25,0.25)', 0.0012); line([[s * 0.055, -0.123], [s < 0 ? -0.34 : 0.19, -0.123]], 'rgba(42,33,25,0.25)', 0.0012); }
    // 蔡河
    const top = [], bot = [];
    for (let x = -0.7; x <= 0.701; x += 0.02) { top.push([x, -0.268 + 0.005 * Math.sin(x * 9 + 0.3)]); bot.push([x, -0.336 + 0.005 * Math.sin(x * 7 + 1.1)]); }
    const river = [...top, ...bot.slice().reverse()];
    water(river, '#dcd8c4', '#87907f', 0.36);
    line(top, 'rgba(38,44,40,0.75)', 0.0019); line(bot, 'rgba(38,44,40,0.75)', 0.0019);
    for (let x = -0.64; x < 0.64; x += 0.011) { // bank grass ticks
      const r = c.rnd();
      if (Math.abs(x) < 0.08) continue;
      line([[x, -0.268 + 0.005 * Math.sin(x * 9 + 0.3) + 0.002], [x + 0.003, -0.262 + 0.004 * r]], 'rgba(70,82,60,0.35)', 0.0009);
      line([[x, -0.336 + 0.005 * Math.sin(x * 7 + 1.1) - 0.002], [x - 0.002, -0.343 - 0.004 * r]], 'rgba(70,82,60,0.35)', 0.0009);
    }
    // 龍津橋 (plan): planked deck with railings
    const bx = 0.064, by0 = -0.258, by1 = -0.346;
    fill([[-bx, by0], [bx, by0], [bx, by1], [-bx, by1]], '#dcc69f');
    for (let y = by0 - 0.007; y > by1; y -= 0.0075) line([[-bx, y], [bx, y]], 'rgba(60,44,28,0.35)', 0.0008);
    for (const s of [-1, 1]) { line([[s * bx, by0], [s * bx, by1]], 'rgba(42,33,25,0.85)', 0.0022); line([[s * (bx - 0.007), by0], [s * (bx - 0.007), by1]], 'rgba(42,33,25,0.5)', 0.0011); for (let y = by0; y >= by1 - 0.001; y -= 0.0176) fill([[s * bx - 0.0028, y + 0.0028], [s * bx + 0.0028, y + 0.0028], [s * bx + 0.0028, y - 0.0028], [s * bx - 0.0028, y - 0.0028]], 'rgba(42,33,25,0.85)'); }
    // 朱漆杈子 down the middle of the road south of the bridge
    const fy0 = -0.356, fy1 = -0.466;
    line([[0, fy0], [0, fy1]], 'rgba(150,52,36,0.85)', 0.0032);
    for (let y = fy0; y >= fy1; y -= 0.0042) line([[-0.0035, y], [0.0035, y]], 'rgba(150,52,36,0.7)', 0.0009);
    for (let y = fy0; y >= fy1 - 0.001; y -= 0.022) fill([[-0.004, y + 0.003], [0.004, y + 0.003], [0.004, y - 0.003], [-0.004, y - 0.003]], 'rgba(110,36,24,0.95)');
    // labels
    label('朱雀門', 0.2, 0.445);
    label('御街', 0.058, 0.05);
    label('蔡河', 0.598, -0.27);
    label('龍津橋', 0.074, -0.272);
    label('朱漆杈子', 0.012, -0.36, 0.021, '#7a2c1f');
  },
  build(env) {
    const C = env.card;
    // inner city
    C({ id: 'temple', x: -0.43, y: 0.322, w: 0.25 });
    C({ id: 'elm', x: -0.565, y: 0.235, h: 0.17 });
    C({ id: 'apricot', x: -0.275, y: 0.36, h: 0.1 });
    C({ id: 'house-tile', x: -0.235, y: 0.232, w: 0.15 });
    C({ id: 'monk', x: -0.125, y: 0.415, h: 0.042 });
    C({ id: 'official', x: 0.4, y: 0.4, h: 0.045 });
    C({ id: 'shop2', x: 0.27, y: 0.236, w: 0.15 });
    C({ id: 'house-thatch', x: 0.475, y: 0.3, w: 0.145 });
    C({ id: 'willow-b', x: 0.575, y: 0.225, h: 0.16, mirror: true });
    // wall and gate
    C({ id: 'wall-l', x: -0.405, y: YW + 0.003, w: 0.47 });
    C({ id: 'wall-r', x: 0.405, y: YW + 0.003, w: 0.47 });
    const gate = C({ id: 'gate', x: 0, y: YW, w: GATE_W });
    const s = GATE_W / PIECES.gate.w, P = INFO.gate.passage_tex;
    const pl = (P[0] - PIECES.gate.w / 2) * s, pr = (P[2] - PIECES.gate.w / 2) * s;
    const ph = (PIECES.gate.h - 1 - P[1]) * s + 0.004;
    const dl = C({ id: 'door-l', x: pl - 0.0004, y: YW + 0.0045, w: (pr - pl) / 2 + 0.0012, h: ph, ax: 0, riseWith: gate });
    const dr = C({ id: 'door-r', x: pr + 0.0004, y: YW + 0.0045, w: (pr - pl) / 2 + 0.0012, h: ph, ax: 1, riseWith: gate });
    C({ id: 'guard-a', x: -0.088, y: YW - 0.014, h: 0.05 });
    C({ id: 'guard-b', x: 0.088, y: YW - 0.014, h: 0.05 });
    const camA = C({ id: 'camels-a', x: 0, y: YW + 0.03, h: 0.066, rot: 28, riseWith: gate });
    const camB = C({ id: 'camels-b', x: 0, y: YW + 0.1, h: 0.06, rot: 28, riseWith: gate });
    // south of the wall
    C({ id: 'zhengdian', x: -0.215, y: 0.022, w: 0.21 });
    C({ id: 'stall-umbrella', x: -0.08, y: -0.055, w: 0.05 });
    C({ id: 'shop', x: -0.205, y: -0.17, w: 0.16 });
    C({ id: 'woman', x: -0.068, y: -0.2, h: 0.042 });
    C({ id: 'child', x: -0.045, y: -0.208, h: 0.028 });
    C({ id: 'willow-a', x: -0.3, y: -0.238, h: 0.15 });
    C({ id: 'porter', x: 0.024, y: -0.13, h: 0.048, mirror: true });
    C({ id: 'apricot', x: 0.115, y: 0.085, h: 0.08, mirror: true });
    C({ id: 'stall-awning', x: 0.125, y: -0.005, w: 0.058 });
    C({ id: 'vendor', x: 0.078, y: -0.1, h: 0.044 });
    C({ id: 'handcart', x: 0.125, y: -0.195, w: 0.058 });
    C({ id: 'willow-a', x: 0.56, y: 0.094, h: 0.13, mirror: true });
    // south of 蔡河
    C({ id: 'willow-b', x: -0.15, y: -0.355, h: 0.12 });
    C({ id: 'teahouse', x: -0.39, y: -0.432, w: 0.17 });
    C({ id: 'donkey-rider', x: -0.03, y: -0.445, h: 0.05 });
    C({ id: 'oxcart', x: 0.26, y: -0.432, w: 0.12, mirror: true });
    C({ id: 'elm', x: 0.43, y: -0.37, h: 0.11, mirror: true });

    // ---- mechanism: tap the gate, the doors swing in, light runs down the Imperial Way, the caravan walks out ----
    const streakTex = (() => {
      const c = makeCanvas(64, 512), g = c.getContext('2d');
      const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, 'rgba(255,214,150,0.95)'); gr.addColorStop(0.35, 'rgba(255,214,150,0.45)'); gr.addColorStop(1, 'rgba(255,214,150,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 512);
      const gx = g.createLinearGradient(0, 0, 64, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.25, 'rgba(0,0,0,0)'); gx.addColorStop(0.75, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)');
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, 64, 512);
      return texFromCanvas(c, { mip: false });
    })();
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(0.085, 0.44), new THREE.MeshBasicMaterial({ map: streakTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    streak.position.set(0, YW - 0.22, 0.0012); streak.renderOrder = 2; env.add(streak);
    const mistTex = softBlob(256, 'rgba(250,250,246,0.9)');
    const mists = [[-0.45, -0.3, 0.7], [0.05, -0.31, 0.62], [0.52, -0.29, 0.6], [-0.3, 0.14, 0.6], [0.34, 0.15, 0.55], [0.0, 0.38, 0.8], [-0.2, -0.42, 0.5]].map(([x, y, w], i) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.2), new THREE.MeshBasicMaterial({ map: mistTex, transparent: true, opacity: 0.5, depthWrite: false }));
      m.position.set(x, y, 0.012 + 0.006 * (i % 3)); m.userData.x0 = x; m.userData.ph = i * 1.7; m.renderOrder = 3; env.add(m); return m;
    });
    const camPath = [{ c: camA, y0: YW + 0.03, y1: -0.205, x1: -0.006, delay: 0.55 }, { c: camB, y0: YW + 0.1, y1: -0.078, x1: 0.008, delay: 1.5 }];
    const st = { open: 0, target: 0, t: 0, walking: false, mist: 0.7 };
    gate.mesh.userData.tap = true; dl.mesh.userData.tap = true; dr.mesh.userData.tap = true;
    const mech = {
      gate, home: true,
      tap(card) {
        if (![gate, dl, dr].includes(card)) return false;
        st.target = st.target ? 0 : 1; st.t = 0; mech.home = false;
        env.sfx(st.target ? 'creak' : 'thud');
        return true;
      },
      reset() { st.open = 0; st.target = 0; st.t = 0; st.mist = 0.7; mech.home = true; mech.apply(0); },
      apply(dt) {
        const o = easeInOut(clamp(st.open));
        dl.pivot.rotation.z = 1.62 * o; dr.pivot.rotation.z = -1.62 * o;
        streak.material.opacity = 0.42 * smooth(0.3, 1, st.open) * (env.isResting() ? 1 : 0);
        for (const p of camPath) {
          let u, walking;
          if (st.target) { u = easeInOut(clamp((st.t - p.delay) / 4.6)); walking = u > 0 && u < 1; }
          else { u = (p.back || 0) * (1 - easeInOut(clamp(st.t / 1.2))); walking = u > 0 && st.t < 1.2; }
          p.k = u;
          const c = p.c, ph = st.t * 9 + p.delay * 3;
          c.root.position.y = lerp(p.y0, p.y1, u); c.root.position.x = lerp(0, p.x1, u);
          c.root.position.z = walking ? 0.0012 * Math.abs(Math.sin(ph)) : 0;
          c.lean = walking ? 0.025 * Math.sin(ph) : 0; c.setRise(c.rise);
        }
      },
      update(dt, now) {
        let moving = false;
        const prevOpen = st.open;
        if (st.target) {
          st.open = Math.min(1, st.open + dt / 1.5); st.t += dt;
        } else if (st.open > 0 || camPath.some((p) => (p.k || 0) > 0)) {
          if (st.t === 0) camPath.forEach((p) => (p.back = p.k || 0));
          st.t += dt;
          if (st.t > 1.1) st.open = Math.max(0, st.open - dt / 1.1);
          if (st.open === 0 && st.t > 1.5) { mech.home = true; }
        }
        moving = st.open !== prevOpen || (st.target && st.t < 7) || (!st.target && st.t < 2.7 && !mech.home);
        if (st.target && st.t > 0.6 && st.t < 6.5 && Math.floor((st.t - dt) * 2.3) !== Math.floor(st.t * 2.3)) env.sfx('bell', 0.6 + 0.4 * Math.random());
        st.mist = lerp(st.mist, st.target ? 0.22 : 0.7, 1 - Math.exp(-dt * 0.6));
        for (const m of mists) { m.position.x = m.userData.x0 + 0.03 * Math.sin(now * 0.07 + m.userData.ph); m.material.opacity = st.mist * (0.75 + 0.25 * Math.sin(now * 0.21 + m.userData.ph)) * env.mistFade(); }
        mech.apply(dt);
        return moving;
      },
    };
    return mech;
  },
};

