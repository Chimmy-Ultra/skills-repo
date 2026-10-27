// ======================= 多益 Part 1：一個場景跨頁 =======================
// Left page: the setting, the grammar point, six key phrases each with an example sentence; at the bottom the
// 「考我」 sign and answer cards A–D.
// Right page: the scene. Four mechanisms on every spread:
//   1. tap a person or an object: the book says its Part 1 sentence and shows it on a paper tag
//   2. tap the person at work: "... are being arranged" -> the worker leaves -> "... have been arranged"
//   3. tap a key phrase on the left page: it lights up and the book says its example sentence
//   4. tap 考我: one person or object lights up, four statements are read as in the test, tap A–D,
//      the panel explains why each wrong one is wrong; tap 考我 again for the next of the three questions
const TX = -0.61, TW = 0.52;                              // text column on the left page
const OPT_X = [-0.43, -0.33, -0.23, -0.13], OPT_Y = -0.355, QUIZ_AT = [-0.56, -0.345];
const PANEL = { x: -0.345, y: -0.06, w: 0.585, h: 0.45 };
const PH_Y0 = 0.143, PH_STEP = 0.063;                      // key phrases: top of the first entry, entry height
const LETTERS = ['A', 'B', 'C', 'D'];
const OPT_IDS = ['ui-a', 'ui-b', 'ui-c', 'ui-d'];   // spelled out so the build ships them

function partOneTexts(d) {
  const out = [
    { x: TX, y: 0.445, w: TW, size: 0.017, lh: 1.4, paras: [d.kicker], color: VERMIL },
    { x: TX, y: null, space: 0.004, w: TW, size: 0.04, lh: 1.2, paras: [d.heading], color: INK },
    { x: TX, y: null, space: 0.016, w: TW, size: 0.02, lh: 1.58, pgap: 0.3, paras: d.intro, color: INK },
    { x: TX, y: PH_Y0 + 0.034, w: TW, size: 0.016, lh: 1.3, paras: ['KEY PHRASES　常考片語　·　點片語聽例句'], color: VERMIL },
  ];
  d.phrases.forEach(([en, zh, ex], i) => {
    const y = PH_Y0 - i * PH_STEP;
    out.push({ x: TX, y, w: TW, size: 0.0192, lh: 1.35, paras: [`[[${en}]]　${zh}`], color: INK, accent: '#2d5f73' });
    out.push({ x: TX + 0.014, y: null, space: 0.002, w: TW - 0.014, size: 0.0172, lh: 1.35, italic: true, paras: [ex], color: '#6a5a4c' });
  });
  return out;
}

// cards without w / h are sized from their source pixels at one common scale (d.scale page units per source px)
function sized(k, d) {
  if (k.w || k.h) return k;
  const p = PIECES[k.id];
  return { ...k, h: (p.h / (p.s || 1)) * (d.scale || 0.0002) * (k.k || 1) };
}
function makeScene(d) {
  d.cards = d.cards.map((k) => sized(k, d));
  const Q = d.quizzes;
  for (const part of ['worker', 'before', 'after']) d.swap[part] = sized(d.swap[part], d);
  return {
    key: d.key, title: d.title, seed: d.seed || 3,
    light: d.light || { el: 50, az: -30, sun: '#fff4e2', sunI: 0.62, amb: '#ecebe6', ambI: 0.74 },
    hint: '點人、東西或片語聽英文，點「考我」做題',
    sr: (`${d.heading}。${d.intro.join('')} ` + d.phrases.map((p) => `${p[0]}，${p[1]}：${p[2]}`).join(' ') + ' ' + d.cards.map((c) => c.say).join(' ')).replace(/\[\[|\]\]/g, ''),
    texts: partOneTexts(d),
    plan(c) {
      const { fill, line, rnd } = c;
      // the floor of the scene on the right page
      fill([[0.03, -0.47], [0.637, -0.47], [0.637, 0.205], [0.03, 0.205]], d.floor || 'rgba(200,192,176,0.35)');
      if (d.floorLines) d.floorLines(c);
      line([[0.03, 0.205], [0.637, 0.205]], 'rgba(60,50,40,0.45)', 0.0016);
      // a small rule under the answer cards
      line([[-0.47, -0.37], [-0.09, -0.37]], 'rgba(60,50,40,0.25)', 0.001);
    },
    build(env) {
      const C = env.card;
      C({ ...d.wall });
      // ---- tappable people and objects ----
      const said = new Map();
      for (const k of d.cards) { const card = C(k); card.mesh.userData.tap = true; said.set(card, k.say); k.card = card; }
      // ---- before / after ----
      const sw = d.swap;
      const worker = C(sw.worker), before = C(sw.before), after = C(sw.after);
      after.held = true;
      [worker, before, after].forEach((c) => (c.mesh.userData.tap = true));
      const grow = (c, s) => c.root.scale.setScalar(Math.max(1e-4, s));
      const wx0 = sw.worker.x;
      // ---- quiz ----
      const sign = C({ id: 'ui-quiz', x: QUIZ_AT[0], y: QUIZ_AT[1], h: 0.1 });
      const opts = OPT_IDS.map((id, i) => C({ id, x: OPT_X[i], y: OPT_Y, h: 0.06 }));
      [sign, ...opts].forEach((c) => (c.mesh.userData.tap = true));
      const optGlow = opts.map((c) => { const p = cardPoint(c, 0.5, 0.5); const m = glowMesh(0.12); m.rotation.x = Math.PI / 2; m.position.set(p[0], p[1] - 0.006, p[2]); env.add(m); return m; });
      // where the spotlight goes for each question
      const spotAt = Q.map((qz) => { const k = d.cards.find((c) => c.id === qz.target); if (!k) throw new Error('quiz target ' + qz.target); return cardPoint(k.card, 0.5, 0.45); });
      const spot = glowMesh(0.34); spot.renderOrder = 2; spot.material.color.set('#fff2b0'); env.add(spot);
      // ---- key phrases: tap a phrase to hear its example sentence ----
      const zones = d.phrases.map((ph, i) => env.zone({ x: TX + TW / 2, y: PH_Y0 - i * PH_STEP - PH_STEP / 2 + 0.006, w: TW + 0.02, h: PH_STEP, i, ex: ph[2] }));
      const hl = new THREE.Mesh(new THREE.PlaneGeometry(TW + 0.03, PH_STEP - 0.004), new THREE.MeshBasicMaterial({ color: '#f2c55c', transparent: true, opacity: 0, depthWrite: false }));
      hl.renderOrder = 3; env.add(hl);
      const lit = { zone: null, t: 0 };
      const panel = panelMesh(PANEL.w, PANEL.h); panel.mesh.position.set(PANEL.x, PANEL.y, 0.003); env.add(panel.mesh);
      // ---- one sentence tag at a time ----
      const tags = new Map();
      const tagFor = (text) => { if (!tags.has(text)) { const m = tagMesh(text, null, 0.042); m.renderOrder = 9; env.add(m); tags.set(text, m); } return tags.get(text); };
      const showing = { tag: null, t: 0 };
      function speak(card, text) {
        env.say(text);
        const m = tagFor(text), w = m.geometry.parameters.width;
        const x = clamp(card.def.x, 0.07 + w / 2, 0.59 - w / 2);   // raised tags flare outward in the view: keep them well inside
        m.position.set(x, card.def.y - 0.004, (card.def.z || 0) + card.height + 0.012);
        showing.tag = m; showing.t = 0;
      }
      const st = { swap: 'before', sw: 0, swT: 0, quiz: null, qi: 0 };
      const head = (qi) => ({ x: 0.03, y: PANEL.h - 0.025, w: PANEL.w - 0.06, size: 0.017, lh: 1.4, paras: [`PART 1 · PHOTOGRAPHS　第 ${qi + 1}／${Q.length} 題`], color: VERMIL });
      function quizStart() {
        const qz = Q[st.qi], order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        // statements are read one after another: the next starts when the voice has finished (or, with no voice,
        // after a reading time), with a short pause between them as in the test
        const q = { qz, order, t: 0, phase: 'reading', pick: null, next: 0, at: 1.4, active: -1 };
        st.quiz = q; mech.home = false;
        const p = spotAt[st.qi]; spot.position.set(p[0], p[1] - 0.02, 0.002);
        panel.draw([
          head(st.qi),
          { x: 0.03, y: null, space: 0.01, w: PANEL.w - 0.06, size: 0.024, lh: 1.5, paras: [`看右頁發亮的${qz.targetZh}。`, '聽四句描述，選出最符合的一句。'], color: INK },
          { x: 0.03, y: null, space: 0.014, w: PANEL.w - 0.06, size: 0.019, lh: 1.5, paras: ['正式考試裡選項不會印出來，只念一次。'], color: '#5a4c40' },
        ]);
        env.say('Look at the picture.');
      }
      function showAnswerPrompt() {
        panel.draw([
          head(st.qi),
          { x: 0.03, y: null, space: 0.01, w: PANEL.w - 0.06, size: 0.026, lh: 1.5, paras: ['選一個：點 A、B、C 或 D。'], color: INK },
          { x: 0.03, y: null, space: 0.014, w: PANEL.w - 0.06, size: 0.019, lh: 1.5, paras: ['想再聽一次，就點「考我」重來（選項順序會換）。'], color: '#5a4c40' },
        ]);
      }
      function quizAnswer(i) {
        const q = st.quiz, qz = q.qz, oi = q.order[i], opt = qz.options[oi], right = q.order.findIndex((o) => qz.options[o].ok);
        q.phase = 'done'; q.pick = i; q.right = right;
        const lines = q.order.map((o, j) => { const op = qz.options[o]; return `${LETTERS[j]}　${op.ok ? '✓' : '✗'}　${op.t}${op.ok ? '' : '　— ' + op.why}`; });
        const last = st.qi === Q.length - 1;
        panel.draw([
          head(st.qi),
          { x: 0.03, y: null, space: 0.006, w: PANEL.w - 0.06, size: 0.026, lh: 1.3, paras: [opt.ok ? `答對了：${LETTERS[i]}` : `答案是 ${LETTERS[right]}，不是 ${LETTERS[i]}`], color: opt.ok ? '#2d6a4a' : VERMIL },
          { x: 0.03, y: null, space: 0.01, w: PANEL.w - 0.06, size: 0.0186, lh: 1.4, pgap: 0.3, paras: lines, color: INK },
          { x: 0.03, y: null, space: 0.01, w: PANEL.w - 0.06, size: 0.0186, lh: 1.4, paras: [qz.okWhy], color: '#2d6a4a' },
          { x: 0.03, y: null, space: 0.01, w: PANEL.w - 0.06, size: 0.017, lh: 1.4, paras: [(last ? '三題都做完了，點「考我」從第 1 題再來' : `點「考我」做下一題（第 ${st.qi + 2}／${Q.length} 題）`) + '；點這張紙收起來。'], color: '#5a4c40' },
        ]);
        env.say(`The answer is ${LETTERS[right]}. ${qz.options[q.order[right]].t}`);
        env.sfx(opt.ok ? 'bell' : 'thud', 0.6);
      }
      function sayPhrase(z) {
        env.say(z.def.ex);
        hl.position.set(z.def.x, z.def.y, 0.0025); lit.zone = z; lit.t = 0;
      }
      const mech = {
        home: true,
        tap(card) {
          if (card.zone) {
            // the quiz panel lies over the phrases: while it is up, a tap there closes a finished question
            if (!st.quiz) sayPhrase(card);
            else if (st.quiz.phase === 'done') { st.quiz = null; st.qi = (st.qi + 1) % Q.length; mech.home = st.swap === 'before'; }
            return true;
          }
          if (card === sign) { if (st.quiz && st.quiz.phase === 'done') st.qi = (st.qi + 1) % Q.length; quizStart(); return true; }
          const oi = opts.indexOf(card);
          if (oi >= 0) { if (st.quiz && st.quiz.phase !== 'done') quizAnswer(oi); else if (!st.quiz) quizStart(); return true; }
          if (card === worker || card === before) { if (st.swap === 'before') { st.swap = 'working'; st.swT = 0; mech.home = false; speak(before, sw.sayBefore); } return true; }
          if (card === after) { if (st.swap === 'after') { st.swap = 'undo'; st.swT = 0; speak(before, sw.sayBefore); } return true; }
          if (said.has(card)) { speak(card, said.get(card)); return true; }
          return false;
        },
        reset() {
          st.swap = 'before'; st.swT = 0; st.quiz = null; st.qi = 0; mech.home = true;
          hl.material.opacity = 0; lit.zone = null;
          worker.root.position.x = wx0; worker.lean = 0; worker.setRise(1); grow(worker, 1);
          grow(before, 1); before.setRise(1); after.held = true; grow(after, 0); after.setRise(0);
          panel.mesh.material.opacity = 0; spot.material.opacity = 0; optGlow.forEach((m) => (m.material.opacity = 0));
          for (const m of tags.values()) m.material.opacity = 0; showing.tag = null;
          opts.forEach((c) => { c.lean = 0; c.setRise(1); });
        },
        update(dt, now) {
          let moved = false;
          // tag fade
          for (const m of tags.values()) {
            const on = m === showing.tag && showing.t < 4.5;
            m.material.opacity += ((on ? 0.96 : 0) - m.material.opacity) * Math.min(1, dt * 8);
          }
          showing.t += dt;
          // phrase highlight: on while the example is being said (at least 1.5 s)
          if (lit.zone) { lit.t += dt; if (lit.t > 1.5 && !env.speaking()) lit.zone = null; }
          hl.material.opacity += ((lit.zone ? 0.26 : 0) - hl.material.opacity) * Math.min(1, dt * 8);
          // before / after
          if (st.swap === 'working' || st.swap === 'leaving') {
            st.swT += dt; const t = st.swT;
            if (t < 2.4) { worker.lean = 0.06 * Math.sin(t * 7); worker.setRise(1); }
            else {
              st.swap = 'leaving';
              const u = clamp((t - 2.4) / 1.3);
              worker.lean = 0; worker.root.position.x = wx0 + (sw.exit ?? 0.5) * easeInOut(u); grow(worker, 1 - smooth(0.55, 1, u));
              grow(before, 1 - smooth(0.2, 0.7, u)); after.held = false; grow(after, easeOutBack(smooth(0.35, 1, u))); after.setRise(easeOutBack(smooth(0.35, 1, u)));
              if (u >= 1) { st.swap = 'after'; speak(after, sw.sayAfter); }
            }
            moved = true;
          } else if (st.swap === 'undo') {
            st.swT += dt; const u = clamp(st.swT / 0.7);
            grow(after, 1 - u); after.setRise(1 - u); grow(before, u); before.setRise(u);
            worker.root.position.x = wx0; grow(worker, u); worker.setRise(u);
            if (u >= 1) { st.swap = 'before'; after.held = true; if (!st.quiz) mech.home = true; }
            moved = true;
          }
          // quiz
          const q = st.quiz;
          panel.mesh.material.opacity += ((q ? 0.98 : 0) - panel.mesh.material.opacity) * Math.min(1, dt * 6);
          spot.material.opacity = q ? 0.55 + 0.25 * Math.sin(now * 4) : Math.max(0, spot.material.opacity - dt * 2);
          if (q) {
            q.t += dt;
            if (q.phase === 'reading' && q.t >= q.at && !env.speaking()) {
              if (q.next < 4) {
                const text = q.qz.options[q.order[q.next]].t;
                env.say(`${LETTERS[q.next]}. ${text}`);
                q.active = q.next++; q.at = q.t + 0.9 + 0.055 * text.length;
              } else { q.active = -1; q.phase = 'answer'; showAnswerPrompt(); }
            }
            opts.forEach((card, j) => {
              const active = q.phase === 'reading' && j === q.active;
              opts[j].lean = active ? 0.35 : 0; opts[j].setRise(1);
              let g = active ? 0.5 : 0; optGlow[j].material.color.set('#ffc46a');
              if (q.phase === 'done') { if (j === q.right) { g = 0.7; optGlow[j].material.color.set('#7ee08a'); } else if (j === q.pick) { g = 0.6; optGlow[j].material.color.set('#ff7a6a'); } }
              optGlow[j].material.opacity += (g - optGlow[j].material.opacity) * Math.min(1, dt * 8);
            });
            moved = true;
          } else if (optGlow.some((m) => m.material.opacity > 0.002) || opts.some((c) => c.lean)) {
            // the panel was closed: let the answer glows go out and stand the cards up again
            optGlow.forEach((m) => (m.material.opacity *= Math.max(0, 1 - dt * 8)));
            opts.forEach((c) => { c.lean = 0; c.setRise(1); });
            moved = true;
          }
          return moved;
        },
      };
      return mech;
    },
  };
}
