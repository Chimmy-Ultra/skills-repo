// ======================= 6. Outdoors 公園 =======================
const scenePark = makeScene({
  key: 'park', title: '公園', seed: 16,
  light: { el: 56, az: 30, sun: '#fff6e6', sunI: 0.64, amb: '#e8ece4', ambI: 0.74 },
  kicker: 'PART 1 · OUTDOORS', heading: 'In a Park　公園',
  intro: ['最後把陷阱整理一次：發音很像的字、名詞對但動詞錯、沒有人卻用 being、加了照片裡沒有的人、猜心情或目的。',
    '每聽一個選項都核對三件事：[[主詞在不在、動作對不對、東西在哪裡]]。'],
  phrases: [
    ['sit on a bench', '坐在長椅上', 'Two people are sitting on a bench.'],
    ['be parked next to …', '停在…旁邊', 'A car has been parked next to a tree.'],
    ['walk a dog', '遛狗', 'A man is walking two dogs.'],
    ['water', '澆水（動詞）', 'A gardener is watering some flowers.'],
    ['rake', '耙', 'A man is raking the lawn.'],
    ['be spread out', '攤開、鋪開', 'A map has been spread out on a table.'],
  ],
  floor: 'rgba(150,182,120,0.4)',
  floorLines(c) { c.fill([[0.03, -0.16], [0.637, -0.12], [0.637, -0.06], [0.03, -0.1]], 'rgba(214,200,170,0.6)'); const r = c.rnd; for (let i = 0; i < 220; i++) { const x = 0.04 + r() * 0.59, y = -0.46 + r() * 0.65; c.line([[x, y], [x + 0.002, y + 0.008]], 'rgba(70,110,60,0.3)', 0.001); } },
  wall: { id: 'pk-wall', x: 0.33, y: 0.205, w: 0.54 },
  cards: [
    { id: 'pk-bike', x: 0.1, y: 0.105, h: 0.26, say: 'A bicycle has been parked next to a lamppost.' },
    { id: 'pk-bench', x: 0.27, y: 0.1, h: 0.14, say: 'A man is reading a newspaper on a bench.' },
    { id: 'pk-photo', x: 0.42, y: 0.105, h: 0.18, say: 'A woman is taking a picture.' },
    { id: 'pk-blanket', x: 0.56, y: 0.1, h: 0.07, say: 'A blanket has been spread out on the grass.' },
    { id: 'pk-dog', x: 0.145, y: -0.11, h: 0.18, say: 'A woman is walking a dog.' },
    { id: 'pk-jog', x: 0.33, y: -0.1, h: 0.19, say: 'A man is jogging along a path.' },
    { id: 'pk-water', x: 0.53, y: -0.12, h: 0.18, say: "She's watering some plants." },
    { id: 'pk-shovel', x: 0.145, y: -0.34, h: 0.18, say: "He's shoveling some soil." },
  ],
  swap: {
    worker: { id: 'pk-raker', x: 0.36, y: -0.355, h: 0.18 }, before: { id: 'pk-leaves-before', x: 0.55, y: -0.35, h: 0.06 }, after: { id: 'pk-leaves-after', x: 0.55, y: -0.35, h: 0.06 },
    sayBefore: 'Some leaves are being raked into a pile.', sayAfter: 'Some leaves have been raked into a pile.', exit: -0.3,
  },
  quizzes: [
    { target: 'pk-bike', targetZh: '路燈旁的腳踏車', okWhy: '沒有人在騎、也沒有人在修：腳踏車就停在那裡，has been parked。', options: [
      { t: 'A man is riding a bicycle.', why: '名詞對、動詞錯：腳踏車在，但沒有人騎。' },
      { t: 'A bicycle has been parked next to a lamppost.', ok: true },
      { t: 'A bicycle is being repaired.', why: 'being + p.p. 要有人：沒有人在修。' },
      { t: 'Some bicycles are lined up in a rack.', why: '數量和位置都錯：只有一台，停在路燈旁。' },
    ] },
    { target: 'pk-bench', targetZh: '長椅上的男人', okWhy: 'Part 1 只描述照片裡看得到的事：他坐著、攤開報紙在讀。', options: [
      { t: "He's folding a newspaper.", why: '報紙是攤開在讀，不是在摺。' },
      { t: "He's painting a bench.", why: '名詞對、動詞錯：長椅在，但他坐在上面。' },
      { t: "He's waiting for a bus.", why: '推測：坐在長椅上不代表在等公車，照片看不出來。' },
      { t: 'A man is reading a newspaper.', ok: true },
    ] },
    { target: 'pk-water', targetZh: '拿著澆水壺的女人', okWhy: 'water 當動詞是「澆水」：water the plants。', options: [
      { t: "She's waiting for some friends.", why: '音近字：watering 和 waiting；照片也看不出她在等人。' },
      { t: "She's watering some plants.", ok: true },
      { t: "She's planting some flowers.", why: '名詞對、動詞錯：花已經種好了，她在澆水。' },
      { t: "She's drinking some water.", why: 'water 有出現，但她是在澆水，不是在喝。' },
    ] },
  ],
});
