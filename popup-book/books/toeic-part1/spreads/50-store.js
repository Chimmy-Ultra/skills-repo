// ======================= 5. Purchasing 商店 =======================
const sceneStore = makeScene({
  key: 'store', title: '商店', seed: 15,
  kicker: 'PART 1 · PURCHASING', heading: 'At a Store　商店',
  intro: ['being + p.p. 通常要有人，但 [[display]] 是例外：Some fruit is being displayed 沒有人也對，意思跟 [[on display]] 一樣。',
    '考試也愛用總稱：蔬果叫 [[produce]]，商品叫 [[merchandise]] 或 [[items]]。'],
  phrases: [
    ['try on', '試穿', 'A man is trying on a pair of shoes.'],
    ['be displayed / be on display', '陳列著', 'Some hats are being displayed on a shelf.'],
    ['push a cart', '推推車', 'A woman is pushing a cart down an aisle.'],
    ['hand … to …', '把…遞給…', 'A clerk is handing a receipt to a customer.'],
    ['stock', '補貨上架', 'A worker is stocking some shelves.'],
    ['be lined up', '排成一排', 'Some bottles are lined up on a counter.'],
  ],
  floor: 'rgba(206,200,188,0.38)',
  floorLines(c) { for (let x = 0.03; x < 0.64; x += 0.05) for (let y = -0.47; y < 0.2; y += 0.05) if (Math.round((x + y) / 0.05) % 2 === 0) c.fill([[x, y], [x + 0.05, y], [x + 0.05, y + 0.05], [x, y + 0.05]], 'rgba(120,110,96,0.06)'); },
  wall: { id: 'st-wall', x: 0.333, y: 0.212, h: 0.2 },
  cards: [
    { id: 'st-rack', x: 0.13, y: 0.1, h: 0.15, say: 'Some shirts are hanging on a rack.' },
    { id: 'st-dress', x: 0.28, y: 0.105, h: 0.18, say: 'A dress is on display.' },
    { id: 'st-shoes', x: 0.4, y: 0.1, h: 0.085, say: 'Some shoes are lined up on a shelf.' },
    { id: 'st-fruit', x: 0.545, y: 0.1, h: 0.13, say: 'Some fruit is being displayed.' },
    { id: 'st-jacket', x: 0.11, y: -0.12, h: 0.19, say: "She's trying on a jacket." },
    { id: 'st-basket', x: 0.25, y: -0.115, h: 0.185, say: 'A woman is carrying a basket.' },
    { id: 'st-label', x: 0.37, y: -0.115, h: 0.195, say: "He's reading a label." },
    { id: 'st-cart', x: 0.53, y: -0.12, h: 0.19, say: 'A man is pushing a shopping cart.' },
    { id: 'st-cashier', x: 0.13, y: -0.335, h: 0.195, say: 'A cashier is handing a bag to a customer.' },
  ],
  swap: {
    worker: { id: 'st-clerk', x: 0.33, y: -0.345, h: 0.215 }, before: { id: 'st-shelf-before', x: 0.51, y: -0.35, h: 0.15 }, after: { id: 'st-shelf-after', x: 0.51, y: -0.35, h: 0.15 },
    sayBefore: 'Some shelves are being stocked.', sayAfter: 'Some shelves have been stocked.', exit: -0.3,
  },
  quizzes: [
    { target: 'st-fruit', targetZh: '水果攤', okWhy: 'display 是例外：沒有人，也可以說 is being displayed。', options: [
      { t: 'Some fruit is being displayed.', ok: true },
      { t: 'Some fruit is being picked.', why: 'being + p.p. 要有人：沒有人在摘。' },
      { t: 'A woman is buying some fruit.', why: '加了人：水果攤旁邊沒有人。' },
      { t: 'Some flowers have been put in baskets.', why: '東西錯：籃子裡是水果，不是花。' },
    ] },
    { target: 'st-cart', targetZh: '推車的男人', okWhy: '先看手：兩手握著把手、身體往前推，就是 pushing。', options: [
      { t: "He's pulling a cart.", why: 'push 是推、pull 是拉；他在推車後面往前推。' },
      { t: "He's pushing a shopping cart.", ok: true },
      { t: "He's parking a car.", why: '音近字：cart 和 car。' },
      { t: "He's putting some items on a shelf.", why: '他的手握著推車把手，沒有在上架。' },
    ] },
    { target: 'st-cashier', targetZh: '收銀台', okWhy: 'hand A to B = 把 A 遞給 B；袋子正從收銀員手上交到客人手上。', options: [
      { t: 'A customer is paying for some groceries.', why: '推測：之前可能付過錢，但照片裡沒有正在付錢的動作。' },
      { t: 'A cashier is stocking a shelf.', why: '動作錯：她在櫃台後遞袋子，不是在上架。' },
      { t: 'A cashier is handing a bag to a customer.', ok: true },
      { t: 'A cashier is closing a cash register.', why: '東西對、動作錯：收銀機在，但她在遞袋子。' },
    ] },
  ],
});
