// ======================= 2. Construction site 工地 =======================
const sceneSite = makeScene({
  key: 'site', title: '工地', seed: 12,
  light: { el: 48, az: 40, sun: '#fff2dc', sunI: 0.66, amb: '#ebe7df', ambI: 0.72 },
  kicker: 'PART 1 · HOUSING / CONSTRUCTION', heading: 'At a Building Site　工地',
  intro: ['[[wearing]] 是「穿戴著」的狀態，[[putting on]] 是「正在穿戴上」的動作。',
    '照片裡安全帽已經戴在頭上，只能說 wearing a hard hat；說 putting on 就錯了。'],
  phrases: [['wear a hard hat', '戴著安全帽（狀態）'], ['put on a hard hat', '戴上安全帽（動作）'], ['climb a ladder', '爬梯子'], ['push a wheelbarrow', '推獨輪手推車'], ['be stacked on a pallet', '堆在棧板上']],
  floor: 'rgba(206,186,150,0.4)',
  floorLines(c) { const r = c.rnd; for (let i = 0; i < 160; i++) { const x = 0.04 + r() * 0.59, y = -0.46 + r() * 0.65; c.line([[x, y], [x + 0.008, y + 0.002]], 'rgba(120,96,60,0.25)', 0.0012); } c.line([[0.05, -0.3], [0.62, -0.18]], 'rgba(120,96,60,0.15)', 0.01); },
  wall: { id: 'si-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 'si-cones', x: 0.14, y: 0.1, say: 'Some cones have been placed in a row.' },
    { id: 'si-ladder', x: 0.5, y: 0.105, say: 'A man is climbing a ladder.' },
    { id: 'si-boards', x: 0.14, y: -0.12, say: "He's carrying some boards on his shoulder." },
    { id: 'si-bricks', x: 0.54, y: -0.12, say: 'Some bricks have been stacked on a pallet.' },
    { id: 'si-helmet', x: 0.36, y: -0.115, say: "He's putting on a hard hat." },
    { id: 'si-barrow', x: 0.13, y: -0.34, say: 'A man is pushing a wheelbarrow.' },
  ],
  swap: {
    worker: { id: 'si-painter', x: 0.33, y: -0.345 }, before: { id: 'si-wall-before', x: 0.52, y: -0.35 }, after: { id: 'si-wall-after', x: 0.52, y: -0.35 },
    sayBefore: 'A wall is being painted.', sayAfter: 'A wall has been painted.', exit: -0.32,
  },
  quiz: { target: 'si-ladder', targetZh: '梯子上的工人', okWhy: '他正在往上爬；安全帽早就戴好了，是 wearing。', options: [
    { t: "He's putting on a hard hat.", why: '帽子已經戴好：那是 wearing（狀態），不是 putting on（動作）。' },
    { t: "He's writing a letter.", why: '音近字：ladder 和 letter 聽起來很像。' },
    { t: "He's climbing a ladder.", ok: true },
    { t: "He's carrying a ladder.", why: '東西對、動作錯：梯子靠在牆上，他在爬，不是在搬。' },
  ] },
});
