// ======================= 2. Construction site 工地 =======================
const sceneSite = makeScene({
  key: 'site', title: '工地', seed: 12,
  light: { el: 48, az: 40, sun: '#fff2dc', sunI: 0.66, amb: '#ebe7df', ambI: 0.72 },
  kicker: 'PART 1 · HOUSING / CONSTRUCTION', heading: 'At a Building Site　工地',
  intro: ['[[wearing]] 是「穿戴著」的狀態，[[putting on]] 是「正在穿戴上」的動作。',
    '安全帽已經戴在頭上，只能說 wearing a hard hat；還拿在手上往頭上戴，才是 putting on。'],
  phrases: [
    ['climb', '爬（梯子、樓梯）', 'A man is climbing some stairs.'],
    ['put on', '穿上、戴上（動作）', 'A woman is putting on a pair of gloves.'],
    ['carry … on one\'s shoulder', '扛在肩上', 'A worker is carrying a bag on his shoulder.'],
    ['be placed in a row', '排成一排', 'Some buckets have been placed in a row.'],
    ['lie on the ground', '平放在地上', 'Some tools are lying on the ground.'],
    ['wheelbarrow', '獨輪手推車', 'A wheelbarrow has been left next to a fence.'],
  ],
  floor: 'rgba(206,186,150,0.4)',
  floorLines(c) { const r = c.rnd; for (let i = 0; i < 160; i++) { const x = 0.04 + r() * 0.59, y = -0.46 + r() * 0.65; c.line([[x, y], [x + 0.008, y + 0.002]], 'rgba(120,96,60,0.25)', 0.0012); } c.line([[0.05, -0.3], [0.62, -0.18]], 'rgba(120,96,60,0.15)', 0.01); },
  wall: { id: 'si-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 'si-cones', x: 0.12, y: 0.1, say: 'Some cones have been placed in a row.' },
    { id: 'si-ladder', x: 0.3, y: 0.105, say: 'A man is climbing a ladder.' },
    { id: 'si-pipes', x: 0.455, y: 0.1, say: 'Some pipes are lying on the ground.' },
    { id: 'si-bricks', x: 0.575, y: 0.1, say: 'Some bricks have been stacked on a pallet.' },
    { id: 'si-boards', x: 0.13, y: -0.12, say: "He's carrying some boards on his shoulder." },
    { id: 'si-helmet', x: 0.31, y: -0.115, say: "He's putting on a hard hat." },
    { id: 'si-sweep', x: 0.47, y: -0.12, say: 'A worker is sweeping the ground.' },
    { id: 'si-barrow', x: 0.12, y: -0.34, say: 'A man is pushing a wheelbarrow.' },
  ],
  swap: {
    worker: { id: 'si-painter', x: 0.33, y: -0.345 }, before: { id: 'si-wall-before', x: 0.52, y: -0.35 }, after: { id: 'si-wall-after', x: 0.52, y: -0.35 },
    sayBefore: 'A wall is being painted.', sayAfter: 'A wall has been painted.', exit: -0.32,
  },
  quizzes: [
    { target: 'si-ladder', targetZh: '梯子上的工人', okWhy: '他正在往上爬；安全帽早就戴好了，是 wearing。', options: [
      { t: "He's putting on a hard hat.", why: '帽子已經戴好：那是 wearing（狀態），不是 putting on（動作）。' },
      { t: "He's writing a letter.", why: '音近字：ladder 和 letter 聽起來很像。' },
      { t: "He's climbing a ladder.", ok: true },
      { t: "He's carrying a ladder.", why: '東西對、動作錯：他在爬梯子，不是在搬。' },
    ] },
    { target: 'si-bricks', targetZh: '棧板上的磚', okWhy: 'has been stacked = 已經堆好了；照片裡沒有人，所以是完成的狀態。', options: [
      { t: 'Some bricks are being stacked.', why: 'being + p.p. 要有人正在疊，照片裡沒有人。' },
      { t: 'Some bricks have been stacked on a pallet.', ok: true },
      { t: 'A worker is laying some bricks.', why: '加了人：照片裡沒有人在砌磚（lay bricks）。' },
      { t: 'A pallet is leaning against a wall.', why: '棧板平放在地上，上面堆著磚，沒有靠在牆上。' },
    ] },
    { target: 'si-helmet', targetZh: '拿著安全帽的工人', okWhy: 'putting on 是正在戴的動作；帽子還在手上、往頭上戴，所以不能說 wearing。', options: [
      { t: "He's wearing a hard hat.", why: 'wearing 是已經戴著的狀態；他的帽子還拿在手上。' },
      { t: "He's putting on a hard hat.", ok: true },
      { t: "He's taking off his vest.", why: 'take off 是「脫下」；背心穿得好好的。' },
      { t: "He's handing a hat to a coworker.", why: '加了人：照片裡沒有同事。' },
    ] },
  ],
});
