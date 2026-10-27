// ======================= 5. Purchasing 商店 =======================
const sceneStore = makeScene({
  key: 'store', title: '商店', seed: 15,
  kicker: 'PART 1 · PURCHASING', heading: 'At a Store　商店',
  intro: ['being + p.p. 通常要有人，但 [[display]] 是例外：Some fruit is being displayed 沒有人也對。',
    '考試也愛用總稱：蔬果叫 [[produce]]，商品叫 [[merchandise]] 或 [[items]]。'],
  phrases: [['try on a jacket', '試穿外套'], ['hand a bag to a customer', '把袋子遞給客人'], ['push a shopping cart', '推購物車'], ['be (being) displayed', '陳列著'], ['stock shelves', '把貨補上架']],
  floor: 'rgba(206,200,188,0.38)',
  floorLines(c) { for (let x = 0.03; x < 0.64; x += 0.05) for (let y = -0.47; y < 0.2; y += 0.05) if (Math.round((x + y) / 0.05) % 2 === 0) c.fill([[x, y], [x + 0.05, y], [x + 0.05, y + 0.05], [x, y + 0.05]], 'rgba(120,110,96,0.06)'); },
  wall: { id: 'st-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 'st-jacket', x: 0.15, y: 0.1, say: "She's trying on a jacket." },
    { id: 'st-rack', x: 0.52, y: 0.1, say: 'Some shirts are hanging on a rack.' },
    { id: 'st-cart', x: 0.13, y: -0.12, say: 'A man is pushing a shopping cart.' },
    { id: 'st-fruit', x: 0.47, y: -0.115, say: 'Some fruit is being displayed.' },
    { id: 'st-cashier', x: 0.16, y: -0.33, say: 'A cashier is handing a bag to a customer.' },
  ],
  swap: {
    worker: { id: 'st-clerk', x: 0.36, y: -0.345 }, before: { id: 'st-shelf-before', x: 0.53, y: -0.35, k: 0.9 }, after: { id: 'st-shelf-after', x: 0.53, y: -0.35, k: 0.9 },
    sayBefore: 'Some shelves are being stocked.', sayAfter: 'Some shelves have been stocked.', exit: -0.3,
  },
  quiz: { target: 'st-fruit', targetZh: '水果攤', okWhy: 'display 是例外：沒有人，也可以說 is being displayed。', options: [
    { t: 'Some fruit is being displayed.', ok: true },
    { t: 'Some fruit is being picked.', why: 'being + p.p. 要有人：沒有人在摘。' },
    { t: 'A woman is buying some fruit.', why: '加了人：水果攤旁邊沒有人。' },
    { t: 'Some flowers have been put in baskets.', why: '東西錯：籃子裡是水果，不是花。' },
  ] },
});
