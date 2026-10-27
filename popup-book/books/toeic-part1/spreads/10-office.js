// ======================= 1. Offices 辦公室 =======================
const sceneOffice = makeScene({
  key: 'office', title: '辦公室', seed: 11,
  kicker: 'PART 1 · OFFICES', heading: 'At the Office　辦公室',
  intro: ['Part 1 的人物照片，答案幾乎都是現在進行式：主詞 + [[is / are + V-ing]]。',
    '聽選項之前先看兩件事：人的手在碰什麼、眼睛在看哪裡。'],
  phrases: [['make some copies', '影印'], ['talk on the phone', '講電話'], ['point at a chart', '指著圖表'], ['be left open', '開著沒關'], ['arrange chairs around a table', '把椅子圍著桌子排好']],
  floor: 'rgba(176,182,186,0.32)',
  floorLines(c) { for (let x = 0.05; x < 0.64; x += 0.06) c.line([[x, -0.47], [x, 0.2]], 'rgba(90,96,104,0.08)', 0.0008); for (let y = -0.45; y < 0.2; y += 0.06) c.line([[0.03, y], [0.637, y]], 'rgba(90,96,104,0.08)', 0.0008); },
  wall: { id: 'of-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 'of-pointing', x: 0.2, y: 0.1, say: "She's pointing at a chart." },
    { id: 'of-plant', x: 0.57, y: 0.1, say: 'A potted plant has been placed in the corner.' },
    { id: 'of-typing', x: 0.14, y: -0.12, say: "She's typing on a keyboard." },
    { id: 'of-phone', x: 0.37, y: -0.115, say: "He's talking on the phone." },
    { id: 'of-cabinet', x: 0.56, y: -0.12, say: 'A drawer has been left open.' },
    { id: 'of-copier', x: 0.13, y: -0.34, say: "He's making some copies." },
  ],
  swap: {
    worker: { id: 'of-chair-carrier', x: 0.33, y: -0.345 }, before: { id: 'of-table-before', x: 0.515, y: -0.35 }, after: { id: 'of-table-after', x: 0.515, y: -0.35 },
    sayBefore: 'Some chairs are being arranged around a table.', sayAfter: 'Some chairs have been arranged around a table.', exit: -0.3,
  },
  quiz: { target: 'of-copier', targetZh: '影印機旁的男人', okWhy: '人在做事就用現在進行式；先看他的手：按著影印機，紙正在出來。', options: [
    { t: "He's drinking some coffee.", why: '音近字：copy 和 coffee 聽起來很像。' },
    { t: "He's repairing the machine.", why: '東西對、動作錯：影印機在，但他在印，不是在修。' },
    { t: "He's making some copies.", ok: true },
    { t: "He's opening a window.", why: '房間裡有窗戶，但不是他正在做的事。' },
  ] },
});
