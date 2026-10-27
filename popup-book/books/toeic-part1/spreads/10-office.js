// ======================= 1. Offices 辦公室 =======================
const sceneOffice = makeScene({
  key: 'office', title: '辦公室', seed: 11,
  kicker: 'PART 1 · OFFICES', heading: 'At the Office　辦公室',
  intro: ['Part 1 的人物照片，答案幾乎都是現在進行式：主詞 + [[is / are + V-ing]]。',
    '聽選項之前先看兩件事：人的手在碰什麼、眼睛在看哪裡。'],
  phrases: [
    ['make copies', '影印', 'A woman is making copies of a document.'],
    ['talk on the phone', '講電話', 'A man is talking on the phone at his desk.'],
    ['point at', '指著', 'A presenter is pointing at a screen.'],
    ['be left open', '開著沒關', 'A window has been left open.'],
    ['be stacked', '疊起來', 'Some folders have been stacked on a desk.'],
    ['be arranged', '排好、擺好', 'Some chairs have been arranged in rows.'],
  ],
  floor: 'rgba(176,182,186,0.32)',
  floorLines(c) { for (let x = 0.05; x < 0.64; x += 0.06) c.line([[x, -0.47], [x, 0.2]], 'rgba(90,96,104,0.08)', 0.0008); for (let y = -0.45; y < 0.2; y += 0.06) c.line([[0.03, y], [0.637, y]], 'rgba(90,96,104,0.08)', 0.0008); },
  wall: { id: 'of-wall', x: 0.333, y: 0.212, h: 0.2 },
  cards: [
    { id: 'of-pointing', x: 0.31, y: 0.1, h: 0.185, say: "She's pointing at a bookshelf." },
    { id: 'of-reading', x: 0.09, y: 0.1, h: 0.2, say: 'A man is looking at some documents.' },
    { id: 'of-mug', x: 0.45, y: 0.1, h: 0.185, say: 'A woman is drinking from a mug.' },
    { id: 'of-plant', x: 0.585, y: 0.1, h: 0.115, say: 'A potted plant has been placed in the corner.' },
    { id: 'of-typing', x: 0.12, y: -0.12, h: 0.15, say: "She's typing on a keyboard." },
    { id: 'of-phone', x: 0.29, y: -0.115, h: 0.2, say: "He's talking on the phone." },
    { id: 'of-boxes', x: 0.43, y: -0.12, h: 0.1, say: 'Some boxes have been stacked on the floor.' },
    { id: 'of-cabinet', x: 0.57, y: -0.12, h: 0.135, say: 'A drawer has been left open.' },
    { id: 'of-copier', x: 0.12, y: -0.34, h: 0.195, say: "He's making some copies." },
  ],
  swap: {
    worker: { id: 'of-chair-carrier', x: 0.32, y: -0.345, h: 0.195 }, before: { id: 'of-table-before', x: 0.51, y: -0.35, h: 0.11 }, after: { id: 'of-table-after', x: 0.51, y: -0.35, h: 0.11 },
    sayBefore: 'Some chairs are being arranged around a table.', sayAfter: 'Some chairs have been arranged around a table.', exit: -0.3,
  },
  quizzes: [
    { target: 'of-copier', targetZh: '影印機旁的男人', okWhy: '人在做事就用現在進行式；先看他的手：按著影印機，紙正在出來。', options: [
      { t: "He's drinking some coffee.", why: '音近字：copy 和 coffee 聽起來很像。' },
      { t: "He's repairing the machine.", why: '東西對、動作錯：影印機在，但他在印，不是在修。' },
      { t: "He's making some copies.", ok: true },
      { t: "He's opening a window.", why: '房間裡有窗戶，但不是他正在做的事。' },
    ] },
    { target: 'of-cabinet', targetZh: '檔案櫃', okWhy: '沒有人的物品照片，用 has been + p.p. 描述現在的狀態；left open 是「開著沒關」。', options: [
      { t: 'A drawer is being pulled out.', why: 'being + p.p. 要有人正在拉，照片裡沒有人。' },
      { t: 'A drawer has been left open.', ok: true },
      { t: 'A door has been left open.', why: '音近字：door 和 drawer；開著的是抽屜，不是門。' },
      { t: 'Some papers have fallen on the floor.', why: '照片裡看不到地上有紙。' },
    ] },
    { target: 'of-phone', targetZh: '拿著手機的男人', okWhy: '手機貼在耳邊，就是正在講：talking on the phone。', options: [
      { t: "He's hanging up the phone.", why: 'hang up 是「掛斷」；他還拿在耳邊講。' },
      { t: "He's talking on the phone.", ok: true },
      { t: "He's folding his arms.", why: 'fold one\'s arms 是雙手交叉在胸前；他一隻手拿著手機。' },
      { t: "He's writing a note.", why: '手上沒有筆也沒有紙。' },
    ] },
  ],
});
