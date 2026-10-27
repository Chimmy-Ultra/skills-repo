// ======================= 5. 瓦子勾欄 =======================
// A pleasure quarter at dusk: a goulan stage, entertainers of the 'Capital Entertainers' list, the crowd,
// a tea house and the entrance of a big shed. Tap the shadow-play booth: the screen is lit from behind and a
// short play runs with coloured leather puppets.
const spreadWazi = {
  key: 'wazi', title: '瓦子勾欄', seed: 21,
  light: { el: 15, az: -72, sun: '#ffb070', sunI: 0.72, amb: '#dccabf', ambI: 0.62 },
  hint: '點一下影戲棚',
  sr: '瓦子勾欄。酉時。天色將晚，瓦子裡鑼鼓正響，勾欄裡雜劇剛開場，影戲棚後點上了燈，看的人捨不得回家。《東京夢華錄》：桑家瓦子、中瓦、裡瓦，「其中大小勾欄五十餘座」；「裡瓦子夜叉棚、象棚最大，可容數千人」；看客「終日居此，不覺抵暮」。',
  texts: textBlocks({
    x: 0.62, y: 0.08, title: '瓦子勾欄', time: '酉時',
    body: ['天色將晚，', '瓦子裡鑼鼓正響，', '勾欄裡雜劇剛開場，', '影戲棚後點上了燈，', '看的人捨不得回家。'],
    caption: { x: -0.36, y: -0.11, cols: ['《東京夢華錄》：桑家瓦子、', '中瓦、裡瓦，『其中大小', '勾欄五十餘座』；', '『裡瓦子夜叉棚、象棚最大，', '可容數千人』；看客', '『終日居此，不覺抵暮』。'] },
  }),
  plan(c) {
    const { line, fill, road, label } = c;
    // the trampled ground of the quarter, a fence round the goulan, the lane outside
    fill([[-0.67, -0.12], [0.67, -0.12], [0.67, 0.5], [-0.67, 0.5]], 'rgba(190,160,112,0.16)');
    road([[-0.7, -0.4], [0.7, -0.4]], 0.04, { tone: 'rgba(196,168,118,0.2)', edge: 'rgba(42,33,25,0.25)', pave: 0 });
    // the goulan: a railed enclosure; the stage at the back, benches for the audience in front of it
    const fx0 = -0.43, fx1 = 0.03, fy0 = 0.035, fy1 = 0.29;
    fill([[fx0, fy0], [fx1, fy0], [fx1, fy1], [fx0, fy1]], 'rgba(160,120,80,0.1)');
    line([[-0.24, fy0], [fx0, fy0], [fx0, fy1], [fx1, fy1], [fx1, fy0], [-0.16, fy0]], 'rgba(120,56,40,0.7)', 0.0022);
    for (const [a, b] of [[[fx0, fy0], [fx0, fy1]], [[fx1, fy0], [fx1, fy1]], [[fx0, fy1], [fx1, fy1]], [[fx0, fy0], [-0.24, fy0]], [[-0.16, fy0], [fx1, fy0]]]) {
      const n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.012);
      for (let i = 0; i <= n; i++) { const x = lerp(a[0], b[0], i / n), y = lerp(a[1], b[1], i / n); fill([[x - 0.0022, y - 0.0022], [x + 0.0022, y - 0.0022], [x + 0.0022, y + 0.0022], [x - 0.0022, y + 0.0022]], 'rgba(110,44,30,0.75)'); }
    }
    for (let y = fy0 + 0.016; y < 0.105; y += 0.016) for (const [a, b] of [[fx0 + 0.02, -0.235], [-0.165, fx1 - 0.02]]) {
      fill([[a, y - 0.003], [b, y - 0.003], [b, y + 0.003], [a, y + 0.003]], 'rgba(120,84,50,0.32)');
      line([[a, y - 0.003], [b, y - 0.003]], 'rgba(60,40,24,0.35)', 0.0007);
    }
    // scattered straw and footprints of the crowd
    const r = c.rnd;
    for (let i = 0; i < 260; i++) { const x = -0.65 + r() * 1.3, y = -0.12 + r() * 0.6, a = r() * 3.14; line([[x, y], [x + 0.006 * Math.cos(a), y + 0.006 * Math.sin(a)]], 'rgba(120,96,60,0.18)', 0.0008); }
    label('勾欄', 0.05, 0.31, 0.022);
    label('影戲', 0.0, -0.06, 0.022);
    label('象棚', -0.6, 0.265, 0.022);
  },
  build(env) {
    const C = env.card;
    C({ id: 'wz-shed', x: -0.5, y: 0.29, w: 0.23 });
    C({ id: 'wz-teahouse', x: 0.4, y: 0.29, w: 0.25 });
    C({ id: 'goulan', x: -0.2, y: 0.2, w: 0.37 });
    C({ id: 'perf-zaju', x: -0.255, y: 0.125, h: 0.058 });
    C({ id: 'perf-singer', x: -0.145, y: 0.13, h: 0.056 });
    C({ id: 'perf-wrestle', x: 0.085, y: 0.18, w: 0.075 });
    C({ id: 'perf-pole', x: 0.17, y: 0.235, h: 0.085 });
    C({ id: 'perf-cuju', x: 0.06, y: 0.07, h: 0.06 });
    C({ id: 'perf-birds', x: 0.15, y: 0.13, h: 0.055, mirror: true });
    C({ id: 'perf-story', x: 0.31, y: 0.18, h: 0.052, mirror: true });
    C({ id: 'perf-rod', x: -0.5, y: 0.17, h: 0.066 });
    C({ id: 'perf-marionette', x: -0.585, y: 0.05, h: 0.066 });
    C({ id: 'wz-snack', x: -0.36, y: 0.03, h: 0.05 });
    C({ id: 'wz-medicine', x: 0.0, y: 0.005, h: 0.052, mirror: true });
    C({ id: 'wz-pictures', x: -0.32, y: -0.06, h: 0.05 });
    C({ id: 'wz-barber', x: -0.5, y: -0.08, h: 0.046 });
    C({ id: 'apricot', x: 0.6, y: 0.18, h: 0.09, mirror: true });
    // the shadow-play booth and its audience
    const booth = C({ id: 'sp-booth', x: -0.1, y: -0.17, w: 0.17 });
    C({ id: 'wz-laugh-a', x: -0.2, y: -0.26, h: 0.047 });
    C({ id: 'wz-father', x: -0.115, y: -0.31, h: 0.052 });
    C({ id: 'wz-laugh-b', x: -0.01, y: -0.27, h: 0.043, mirror: true });
    C({ id: 'wz-woman', x: 0.06, y: -0.22, h: 0.046, mirror: true });
    C({ id: 'wz-clothes', x: 0.12, y: -0.4, h: 0.048 });
    C({ id: 'wz-fortune', x: 0.06, y: -0.47, h: 0.046 });

    // ---- the screen, drawn into a canvas on the booth card ----
    const SW = 512, SH = 384, cnv = makeCanvas(SW, SH), sg = cnv.getContext('2d');
    const scrTex = texFromCanvas(cnv, { mip: false });
    const bw = booth.width, bh = booth.height;
    const u0 = 0.28, u1 = 0.735, v0 = 1 - 0.70, v1 = 1 - 0.35;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry((u1 - u0) * bw, (v1 - v0) * bh), new THREE.MeshBasicMaterial({ map: scrTex, transparent: true, opacity: 0 }));
    screen.position.set(((u0 + u1) / 2 - 0.5) * bw, ((v0 + v1) / 2) * bh, 0.0004);
    screen.renderOrder = 7;   // over the halo, which only spills around the booth
    booth.mesh.add(screen);
    const hp = cardPoint(booth, (u0 + u1) / 2, (v0 + v1) / 2);
    const halo = glowMesh(0.2); halo.rotation.x = Math.PI / 2; halo.position.set(hp[0], hp[1] - 0.006, hp[2]); env.add(halo);
    const imgs = {};
    ['sp-general', 'sp-scholar', 'sp-lady', 'sp-demon'].forEach((id) => env.loadImage(`a/${id}.webp`).then((im) => (imgs[id] = im)));
    booth.mesh.userData.tap = true;
    const st = { t: -1 };
    const PLAY = 11.2;
    function puppet(id, x, y, h, flip, rot = 0) {
      const im = imgs[id]; if (!im) return;
      const w = h * im.width / im.height;
      sg.save(); sg.translate(x, y); sg.rotate(rot); if (flip) sg.scale(-1, 1);
      // coloured leather in front of a lamp: the light passes through it, so the colours multiply
      sg.globalCompositeOperation = 'multiply'; sg.drawImage(im, -w / 2, -h, w, h);
      sg.globalCompositeOperation = 'source-over'; sg.globalAlpha = 0.25; sg.drawImage(im, -w / 2, -h, w, h); sg.restore();
    }
    function drawScreen(t, lit) {
      sg.clearRect(0, 0, SW, SH);
      const gr = sg.createRadialGradient(SW / 2, SH * 0.55, 20, SW / 2, SH * 0.55, SW * 0.7);
      gr.addColorStop(0, `rgba(255,214,150,${lit})`); gr.addColorStop(1, `rgba(214,150,80,${lit * 0.9})`);
      sg.fillStyle = gr; sg.fillRect(0, 0, SW, SH);
      if (lit < 0.05 || t < 0) return;
      const bob = (k, a = 5) => a * Math.sin(t * 9 + k);
      const ground = SH + 40;   // the rods run down past the bottom edge of the screen
      // the puppets face: general, scholar, demon, horse -> left; lady -> right. flip = true mirrors.
      // 1. a general rides across, left to right
      if (t < 4.2) puppet('sp-general', lerp(-180, 700, t / 4.2), ground + bob(0, 7), 300, true, 0.04 * Math.sin(t * 9));
      // 2. a scholar and a lady come in from either side, meet and bow
      if (t > 3.0) {
        const e = easeInOut(clamp((t - 3.0) / 2)), back = easeInOut(clamp((t - 6.2) / 0.6));
        const bow = t > 5.1 && t < 6.1 ? 0.2 * Math.sin((t - 5.1) * Math.PI) : 0;
        const walk = t < 5.0 ? 1 : 0.25;
        puppet('sp-scholar', lerp(-100, 175, e) - 70 * back, ground + bob(1, 5 * walk), 290, true, bow);
        puppet('sp-lady', lerp(620, 345, e) + 70 * back, ground + bob(2, 5 * walk), 290, true, -bow);
      }
      // 3. a demon leaps in from the right and lands between them
      if (t > 5.8 && t < 10) {
        const j = clamp((t - 5.8) / 0.9), flee = easeIn(clamp((t - 7.8) / 1.5));
        const x = lerp(600, 262, j) - 480 * flee, y = ground - 130 * Math.sin(Math.PI * j) + bob(3, 6);
        puppet('sp-demon', x, y, 280, false, 0.2 * Math.sin(t * 7));
      }
      // 4. the general rides back from the right and chases it off to the left
      if (t > 7.4) puppet('sp-general', lerp(740, -260, easeInOut(clamp((t - 7.4) / 2.8))), ground + bob(4, 7), 300, false, 0.05 * Math.sin(t * 10));
    }
    const mech = {
      home: true,
      tap(card) { if (card !== booth || st.t >= 0) return false; st.t = 0; mech.home = false; env.sfx('gong'); return true; },
      reset() { st.t = -1; mech.home = true; screen.material.opacity = 0; halo.material.opacity = 0; },
      update(dt, now) {
        if (st.t < 0) return false;
        const t0 = st.t; st.t += dt; const t = st.t;
        const lit = smooth(0, 0.8, t) * (1 - smooth(PLAY - 0.8, PLAY, t));
        screen.material.opacity = lit;
        halo.material.opacity = 0.5 * lit * (0.92 + 0.08 * Math.sin(now * 13));
        drawScreen(t - 0.6, lit); scrTex.needsUpdate = true;
        for (const b of [1.0, 1.5, 3.6, 6.4, 6.6, 8.0, 8.3, 8.6]) if (t0 < b && t >= b) env.sfx('drum', b === 6.4 ? 1 : 0.6);
        if (t0 < 5.7 && t >= 5.7) env.sfx('gong', 0.8);
        if (t > PLAY) mech.reset();
        return false;   // nothing that casts a shadow moves
      },
    };
    return mech;
  },
};
