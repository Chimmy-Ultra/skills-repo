// ======================= 1. 歐姆定律 =======================
// Left-bound test spread: text on the left page, a circuit on the right page. Drag the knob along its track:
// the current I changes, the charge dots run faster or slower, the lamp gets brighter or dimmer.
const LOOP = [[0.12, -0.02], [0.12, 0.3], [0.56, 0.3], [0.56, -0.02], [0.12, -0.02]];
function alongPath(pts, u) {   // point at fraction u of a polyline's length
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let d = ((u % 1) + 1) % 1 * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const t = d / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]; } d -= seg[i]; }
  return pts[pts.length - 1];
}
const spreadOhm = {
  key: 'ohm', title: '歐姆定律', seed: 3,
  light: { el: 50, az: -30, sun: '#fff4e2', sunI: 0.62, amb: '#ecebe6', ambI: 0.74 },
  hint: '拖動下面的滑桿',
  sr: '歐姆定律。電池維持電壓 V，電流 I 等於 V 除以 R。拖動滑桿改變電流，燈泡跟著變亮或變暗。',
  texts: hTextBlocks({
    x: -0.6, y: 0.43, w: 0.5,
    kicker: 'Lesson 1 · Circuits',
    title: "歐姆定律 Ohm's law",
    body: [
      '電池在兩端維持固定的 [[voltage]] V。電路接通後，電荷沿著導線流動，形成 [[current]] I。',
      { eq: 'V = I\\,R', size: 0.034 },
      '電阻 R 固定時，電流和電壓成正比。把滑桿往右推，電流變大，燈泡變亮；往左推，電流變小。',
    ],
    caption: { x: -0.6, y: -0.38, w: 0.5, paras: ['測試書：這本只用來驗證左翻、橫書、公式和拖曳，圖是程式畫的佔位圖。'] },
  }),
  plan(c) {
    const { line, fill, label, hlabel } = c;
    line(LOOP, 'rgba(60,46,34,0.85)', 0.003);
    // the slider's track
    line([[0.16, -0.36], [0.52, -0.36]], 'rgba(60,46,34,0.7)', 0.004);
    for (let i = 0; i <= 8; i++) { const x = 0.16 + i * 0.045; line([[x, -0.372], [x, -0.348]], 'rgba(60,46,34,0.6)', 0.0012); }
    hlabel('I 小', 0.16, -0.405, 0.02); hlabel('I 大', 0.52, -0.405, 0.02);
    hlabel('battery', 0.12, -0.06, 0.02); hlabel('resistor R', 0.34, 0.25, 0.02); hlabel('lamp', 0.56, -0.06, 0.02);
  },
  build(env) {
    const C = env.card;
    const bat = C({ id: 'battery', x: 0.12, y: 0.06, h: 0.12 });
    C({ id: 'resistor', x: 0.34, y: 0.3, w: 0.2 });
    const lamp = C({ id: 'lamp', x: 0.56, y: 0.06, h: 0.12 });
    C({ id: 'student', x: 0.3, y: -0.16, h: 0.12 });
    const knob = C({ id: 'knob', x: 0.25, y: -0.36, h: 0.06 });
    knob.mesh.userData.drag = true;
    const dots = [];
    for (let i = 0; i < 16; i++) { const m = glowMesh(0.03); m.position.z = 0.002; m.renderOrder = 3; env.add(m); dots.push(m); }
    const lampP = cardPoint(lamp, 0.5, 0.75);
    const halo = glowMesh(0.2); halo.rotation.x = Math.PI / 2; halo.position.set(lampP[0], lampP[1] - 0.006, lampP[2]); env.add(halo);
    const st = { I: 0.25, ph: 0, drag: null };
    const X0 = 0.16, X1 = 0.52;
    const mech = {
      home: true, knob,
      dragStart(card, pt) { if (card !== knob) return false; st.drag = { off: pt[0] - knob.root.position.x }; mech.home = false; return true; },
      dragMove(pt) { if (!st.drag) return; const x = clamp(pt[0] - st.drag.off, X0, X1); knob.root.position.x = x; st.I = (x - X0) / (X1 - X0); },
      dragEnd() { st.drag = null; },
      reset() { st.I = 0.25; knob.root.position.x = lerp(X0, X1, 0.25); st.drag = null; mech.home = true; },
      update(dt, now) {
        st.ph += dt * (0.02 + 0.22 * st.I);
        dots.forEach((m, i) => { const p = alongPath(LOOP, st.ph + i / dots.length); m.position.x = p[0]; m.position.y = p[1]; m.material.opacity = 0.25 + 0.6 * st.I; });
        halo.material.opacity = 0.9 * st.I * st.I;
        return !!st.drag;   // the knob casts a shadow: refresh it while it moves
      },
    };
    return mech;
  },
};
