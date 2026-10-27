// ======================= 6. Outdoors 公園 =======================
const scenePark = makeScene({
  key: 'park', title: '公園', seed: 16,
  light: { el: 56, az: 30, sun: '#fff6e6', sunI: 0.64, amb: '#e8ece4', ambI: 0.74 },
  kicker: 'PART 1 · OUTDOORS', heading: 'In a Park　公園',
  intro: ['最後把陷阱整理一次：發音很像的字、名詞對但動詞錯、沒有人卻用 being、加了照片裡沒有的人、猜心情或目的。',
    '每聽一個選項都核對三件事：[[主詞在不在、動作對不對、東西在哪裡]]。'],
  phrases: [['shovel some soil', '鏟土'], ['water some plants', '澆花'], ['walk a dog', '遛狗'], ['be parked', '停放著'], ['rake leaves into a pile', '把落葉耙成一堆']],
  floor: 'rgba(150,182,120,0.4)',
  floorLines(c) { c.fill([[0.03, -0.16], [0.637, -0.12], [0.637, -0.06], [0.03, -0.1]], 'rgba(214,200,170,0.6)'); const r = c.rnd; for (let i = 0; i < 220; i++) { const x = 0.04 + r() * 0.59, y = -0.46 + r() * 0.65; c.line([[x, y], [x + 0.002, y + 0.008]], 'rgba(70,110,60,0.3)', 0.001); } },
  wall: { id: 'pk-wall', x: 0.33, y: 0.205, w: 0.54 },
  cards: [
    { id: 'pk-bench', x: 0.22, y: 0.1, say: 'A man is reading a newspaper on a bench.' },
    { id: 'pk-bike', x: 0.53, y: 0.105, say: 'A bicycle has been parked next to a lamppost.' },
    { id: 'pk-dog', x: 0.15, y: -0.12, say: 'A woman is walking a dog.' },
    { id: 'pk-water', x: 0.45, y: -0.115, say: "She's watering some plants." },
    { id: 'pk-shovel', x: 0.16, y: -0.31, say: "He's shoveling some soil." },
  ],
  swap: {
    worker: { id: 'pk-raker', x: 0.36, y: -0.36 }, before: { id: 'pk-leaves-before', x: 0.54, y: -0.35, k: 0.85 }, after: { id: 'pk-leaves-after', x: 0.54, y: -0.35, k: 0.85 },
    sayBefore: 'Some leaves are being raked into a pile.', sayAfter: 'Some leaves have been raked into a pile.', exit: -0.3,
  },
  quiz: { target: 'pk-bike', targetZh: '路燈旁的腳踏車', okWhy: '沒有人在騎、也沒有人在修：腳踏車就停在那裡，has been parked。', options: [
    { t: 'A man is riding a bicycle.', why: '名詞對、動詞錯：腳踏車在，但沒有人騎。' },
    { t: 'A bicycle has been parked next to a lamppost.', ok: true },
    { t: 'A bicycle is being repaired.', why: 'being + p.p. 要有人：沒有人在修。' },
    { t: 'Some bicycles are lined up in a rack.', why: '數量和位置都錯：只有一台，停在路燈旁。' },
  ] },
});
