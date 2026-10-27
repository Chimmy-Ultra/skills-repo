// ======================= 4. 汴河虹橋（船尾視角） =======================
// The Bian River runs straight up the left page and under the rainbow bridge. The grain boat is seen from its
// stern; drag it north toward the bridge and the crew lowers the A-frame mast back over the stern.
const XR = -0.215, RHW = 0.088, YB = 0.075, BW2 = 0.44, BK2 = BW2 / 0.36;
const deckZ2 = (xl) => BK2 * Math.max(0.03, 0.076 - 1.45 * (xl / BK2) * (xl / BK2));
const spreadBridge = {
  key: 'bridge', title: '汴河虹橋', seed: 9,
  light: { el: 34, az: -58, sun: '#ffd6a2', sunI: 0.64, amb: '#efe7da', ambI: 0.74 },
  hint: '把大船往虹橋拖',
  sr: '汴河虹橋。申時。漕船一艘接一艘，大船到了虹橋下，船工七手八腳放倒了桅杆，橋上的人全探出身子。虹橋在東水門外，離城七里。《東京夢華錄》說它「其橋無柱，皆以巨木虛架」。',
  texts: textBlocks({
    x: 0.62, y: 0.03, title: '汴河虹橋', time: '申時',
    body: ['漕船一艘接一艘，', '大船到了虹橋下，', '船工七手八腳', '放倒了桅杆，', '橋上的人全探出身子。'],
    caption: { x: -0.36, y: -0.15, adv: 1.05, cols: ['虹橋在東水門外，', '離城七里。', '《東京夢華錄》', '說它『其橋無柱，', '皆以巨木虛架』。'] },
  }),
  plan(c) {
    const { line, fill, water, road, label } = c;
    const L = [], R = [];
    for (let y = -0.52; y <= 0.521; y += 0.02) { L.push([XR - RHW + 0.004 * Math.sin(y * 11), y]); R.push([XR + RHW + 0.004 * Math.sin(y * 9 + 1), y]); }
    // towpaths and streets along both banks
    road([[XR - RHW - 0.045, -0.52], [XR - RHW - 0.045, 0.52]], 0.03, { tone: 'rgba(190,164,116,0.2)', edge: 'rgba(42,33,25,0.2)', pave: 0 });
    road([[XR + RHW + 0.05, -0.52], [XR + RHW + 0.05, 0.52]], 0.035, { tone: 'rgba(190,164,116,0.2)', edge: 'rgba(42,33,25,0.2)', pave: 0 });
    water([...L, ...R.slice().reverse()], '#e7e1cc', '#b2aa8d', 0.46);
    line(L, 'rgba(46,40,30,0.8)', 0.002); line(R, 'rgba(46,40,30,0.8)', 0.002);
    for (const [side, sgn] of [[L, -1], [R, 1]]) for (let i = 0; i < side.length; i++) {   // timber revetment
      const p = side[i];
      for (let k = 0; k < 2; k++) line([[p[0], p[1] + 0.01 * k], [p[0] + 0.006 * sgn, p[1] + 0.01 * k]], 'rgba(60,46,30,0.42)', 0.0009);
    }
    label('汴河', XR + 0.04, -0.035);
    label('虹橋', XR - 0.03, YB - 0.04);
    label('腳店', -0.61, 0.15);
  },
  build(env) {
    const C = env.card;
    // west bank
    C({ id: 'elm', x: -0.575, y: 0.36, h: 0.09 });
    C({ id: 'teahouse', x: -0.47, y: 0.33, w: 0.17 });
    C({ id: 'jiaodian', x: -0.47, y: 0.16, w: 0.2 });
    C({ id: 'willow-b', x: -0.335, y: 0.25, h: 0.12 });
    C({ id: 'shop', x: -0.5, y: -0.0, w: 0.13 });
    C({ id: 'look-mother', x: -0.34, y: 0.02, h: 0.042 });
    C({ id: 'look-point', x: -0.33, y: -0.07, h: 0.044 });
    C({ id: 'willow-a', x: -0.595, y: -0.06, h: 0.12 });
    // east bank
    C({ id: 'willow-a', x: -0.08, y: 0.35, h: 0.1, mirror: true });
    C({ id: 'stall-awning', x: -0.06, y: 0.25, w: 0.055 });
    C({ id: 'look-old', x: -0.1, y: 0.15, h: 0.042, mirror: true });
    C({ id: 'stall-umbrella', x: -0.045, y: -0.04, w: 0.055 });
    C({ id: 'look-scholar', x: -0.1, y: -0.12, h: 0.044, mirror: true });
    C({ id: 'handcart', x: -0.02, y: -0.22, w: 0.055, mirror: true });
    C({ id: 'look-porter', x: -0.085, y: -0.33, h: 0.044 });
    C({ id: 'willow-b', x: 0.02, y: -0.44, h: 0.11, mirror: true });
    C({ id: 'shop2', x: 0.17, y: 0.35, w: 0.13 });
    C({ id: 'stall-fortune', x: 0.33, y: 0.3, w: 0.06 });
    C({ id: 'sedan', x: 0.47, y: 0.25, w: 0.085, mirror: true });
    C({ id: 'apricot', x: 0.6, y: 0.34, h: 0.08 });
    // other boats on the river
    // (kept out of the grain boat's path: south of where it starts, or north of where it stops)
    C({ id: 'boat-passenger', x: XR + 0.03, y: -0.46, z: -0.006, w: 0.11, mirror: true });
    C({ id: 'boat-moored', x: XR - 0.035, y: 0.285, z: -0.006, w: 0.1 });
    C({ id: 'sampan', x: XR + 0.045, y: 0.37, z: -0.005, w: 0.07, mirror: true });
    C({ id: 'boat-fishing', x: XR - 0.04, y: 0.44, z: -0.005, w: 0.055 });
    // the bridge with people on its deck
    const bridge = C({ id: 'bridge', x: XR, y: YB, w: BW2 });
    const crowd = [['look-shout', -0.12, false], ['look-lean', -0.05, true], ['look-point2', 0.02, false], ['look-woman2', 0.085, false], ['look-woman', 0.14, true]].map(([id, xl, m]) =>
      C({ id, x: xl, y: 0.011, z: deckZ2(xl) - 0.004, h: 0.04, mirror: m, parent: bridge }));
    // the grain boat, seen from the stern; mast and crew ride on it
    const S0 = -0.33, ZB = -0.026;
    const boat = C({ id: 'stern-boat', x: XR, y: S0, z: ZB, w: 0.088 });
    const mast = C({ id: 'mast2', x: 0, y: 0.012, z: 0.07, h: 0.118, parent: boat });
    mast.mesh.material = [mast.mat, mast.mat, edgeMat];   // lowered toward us, its back shows: print the same art there
    const crew = [['crew-pole-a', -0.03, 0.004, false], ['crew-pole-c', 0.03, 0.004, true], ['crew-shout', 0.004, 0.02, false]].map(([id, xl, yl, m]) =>
      C({ id, x: xl, y: yl, z: 0.078, h: 0.034, mirror: m, parent: boat }));
    [boat, mast, ...crew].forEach((c) => (c.mesh.userData.drag = true));
    // ---- mechanism: drag the boat north; near the bridge the mast is lowered back over the stern ----
    const st = { s: S0, target: S0, mast: 0, push: 0, drag: null };
    const SMIN = -0.38, SMAX = 0.18, MP = 0.012;     // the mast step sits MP north of the stern
    const mech = {
      home: true, boat,
      dragStart(card, pt) { if (!(card === boat || card === mast || crew.includes(card))) return false; st.drag = { off: pt[1] - st.s }; mech.home = false; return true; },
      dragMove(pt) { if (st.drag) st.target = clamp(pt[1] - st.drag.off, SMIN, SMAX); },
      dragEnd() { st.drag = null; },
      setS(s) { st.s = st.target = s; mech.home = false; },
      reset() { st.s = st.target = S0; st.mast = 0; st.push = 0; st.drag = null; mech.home = true; mech.apply(0); },
      apply(now) {
        boat.root.position.y = st.s; boat.root.position.z = ZB + 0.0008 * Math.sin(now * 1.3);
        mast.lean = 1.32 * easeInOut(st.mast); mast.setRise(mast.rise);
        crew.forEach((c, i) => { c.lean = -0.32 * st.push * (0.7 + 0.3 * Math.sin(now * 3.1 + i * 2)); c.setRise(c.rise); });
        const ex = smooth(0.2, 0.9, st.mast);
        crowd.forEach((c, i) => { c.lean = 0.22 * ex * (0.75 + 0.25 * Math.sin(now * 1.7 + i * 1.3)); c.setRise(c.rise); });
      },
      update(dt, now) {
        const prev = [st.s, st.mast, st.push];
        // lower the mast when the mast step comes within reach of the bridge, raise it once clear
        const d = YB - (st.s + MP);
        const want = d < 0.2 && d > -0.075 ? 1 : 0;
        st.mast = clamp(st.mast + Math.sign(want - st.mast) * dt / 1.2);
        if (want && prev[1] < 0.02 && st.mast >= 0.02) env.sfx('creak', 0.7);
        let tgt = st.target;
        if (st.mast < 0.95) {   // the standing mast cannot pass the bridge
          const stop = YB - 0.015 - MP;
          if (st.s <= stop && tgt > stop) tgt = stop;
          const back = YB + 0.03 - MP;
          if (st.s >= back && tgt < back) tgt = back;
        }
        st.s += (tgt - st.s) * (1 - Math.exp(-dt * 6));
        st.push = clamp(st.push + (Math.abs(YB - st.s - 0.03) < 0.09 ? 1 : -1) * dt / 0.4);
        mech.apply(now);
        if (Math.abs(st.s - S0) < 1e-4 && st.mast === 0 && !st.drag) mech.home = true;
        return Math.abs(st.s - prev[0]) > 1e-6 || st.mast !== prev[1] || st.push !== prev[2] || st.push > 0 || st.mast > 0;
      },
    };
    return mech;
  },
};
