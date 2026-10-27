// ======================= 4. Dining out 餐廳 =======================
const sceneRestaurant = makeScene({
  key: 'restaurant', title: '餐廳', seed: 14,
  light: { el: 46, az: -40, sun: '#ffe9cc', sunI: 0.62, amb: '#ece4d8', ambI: 0.74 },
  kicker: 'PART 1 · DINING OUT', heading: 'At a Restaurant　餐廳',
  intro: ['[[is being + p.p.]] 表示有人正在做，照片裡一定要看得到那個人。事情做完、人走了，就換成 [[has been + p.p.]]。',
    '掛著、靠著這種狀態，用主動的進行式：Some coats are hanging on a rack.'],
  phrases: [['pour water into a glass', '把水倒進杯子'], ['look at a menu', '看菜單'], ['set a table', '擺好餐具'], ['hang on a rack', '掛在架子上'], ['for two', '兩人份']],
  floor: 'rgba(186,150,110,0.32)',
  floorLines(c) { for (let y = -0.46; y < 0.2; y += 0.035) c.line([[0.03, y], [0.637, y]], 'rgba(110,80,50,0.12)', 0.001); },
  wall: { id: 're-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 're-chef', x: 0.36, y: 0.1, say: 'A chef is holding a pan.' },
    { id: 're-coats', x: 0.57, y: 0.1, say: 'Some coats are hanging on a rack.' },
    { id: 're-menus', x: 0.2, y: -0.12, say: "They're looking at menus." },
    { id: 're-pour', x: 0.48, y: -0.115, say: "She's pouring some water into a glass." },
  ],
  swap: {
    worker: { id: 're-server', x: 0.2, y: -0.345 }, before: { id: 're-table-before', x: 0.45, y: -0.35 }, after: { id: 're-table-after', x: 0.45, y: -0.35 },
    sayBefore: 'A table is being set for two.', sayAfter: 'A table has been set for two.', exit: -0.3,
  },
  quiz: { target: 're-coats', targetZh: '衣帽架', okWhy: '沒有人在掛；外套就是掛在那裡的狀態：are hanging。', options: [
    { t: 'Some coats are being hung on a rack.', why: 'being + p.p. 要有人正在掛，照片裡沒有人。' },
    { t: 'Some coats are hanging on a rack.', ok: true },
    { t: 'A man is taking off his coat.', why: '加了人：衣帽架旁邊沒有人。' },
    { t: 'Some coats are folded on a chair.', why: '位置錯：外套是掛著，不是摺好放在椅子上。' },
  ] },
});
