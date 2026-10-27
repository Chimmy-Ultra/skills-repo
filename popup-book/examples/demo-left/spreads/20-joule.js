// ======================= 2. 焦耳熱 =======================
const spreadJoule = {
  key: 'joule', title: '焦耳熱', seed: 4,
  light: { el: 38, az: 40, sun: '#ffe9cc', sunI: 0.62, amb: '#e9e6df', ambI: 0.72 },
  hint: '點一下電阻',
  sr: '焦耳熱。電流流過電阻時，電能變成熱，功率 P 等於 I 平方乘 R。點一下電阻，看它發熱。',
  texts: hTextBlocks({
    x: -0.6, y: 0.43, w: 0.5,
    kicker: 'Lesson 2 · Energy',
    title: '焦耳熱 Joule heating',
    body: [
      '電流流過電阻時，電荷一路碰撞，[[electrical energy]] 變成熱。單位時間放出的熱就是功率 P：',
      { eq: 'P = I^2 R = \\frac{V^2}{R}', size: 0.034 },
      '電流加倍，發熱變成四倍。點一下右頁的電阻，看它發熱。',
    ],
  }),
  plan(c) {
    const { line } = c;
    line([[0.04, 0.05], [0.18, 0.05]], 'rgba(60,46,34,0.85)', 0.003);
    line([[0.5, 0.05], [0.64, 0.05]], 'rgba(60,46,34,0.85)', 0.003);
  },
  build(env) {
    const C = env.card;
    const res = C({ id: 'resistor', x: 0.34, y: 0.05, w: 0.44 });
    C({ id: 'student', x: 0.14, y: -0.2, h: 0.13, mirror: true });
    res.mesh.userData.tap = true;
    const p = cardPoint(res, 0.5, 0.4);
    const glow = glowMesh(0.32); glow.rotation.x = Math.PI / 2; glow.position.set(p[0], p[1] - 0.006, p[2]); glow.material.color.set('#ff7a40'); env.add(glow);
    const st = { on: false, h: 0 };
    const mech = {
      home: true,
      tap(card) { if (card !== res) return false; st.on = !st.on; mech.home = !st.on; env.sfx(st.on ? 'fire' : 'pop', 0.6); return true; },
      reset() { st.on = false; st.h = 0; glow.material.opacity = 0; mech.home = true; },
      update(dt, now) { st.h = clamp(st.h + (st.on ? 1 : -1) * dt / 1.2); glow.material.opacity = 0.85 * st.h * (0.9 + 0.1 * Math.sin(now * 7)); return false; },
    };
    return mech;
  },
};
