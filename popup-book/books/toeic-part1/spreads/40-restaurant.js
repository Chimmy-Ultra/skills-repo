// ======================= 4. Dining out 餐廳 =======================
const sceneRestaurant = makeScene({
  key: 'restaurant', title: '餐廳', seed: 14,
  light: { el: 46, az: -40, sun: '#ffe9cc', sunI: 0.62, amb: '#ece4d8', ambI: 0.74 },
  kicker: 'PART 1 · DINING OUT', heading: 'At a Restaurant　餐廳',
  intro: ['[[is being + p.p.]] 表示有人正在做，照片裡一定要看得到那個人。事情做完、人走了，就換成 [[has been + p.p.]]。',
    '掛著、靠著這種狀態，用主動的進行式：Some coats are hanging on a rack.'],
  phrases: [
    ['pour … into …', '把…倒進…', 'A man is pouring some coffee into a cup.'],
    ['hang', '掛著（狀態）', 'Some jackets are hanging on hooks.'],
    ['set a table', '擺好餐具', 'A table has been set for dinner.'],
    ['wipe', '擦', 'A worker is wiping a counter.'],
    ['take an order', '（服務生）幫客人點餐', 'A server is taking an order.'],
    ['carry a tray', '端托盤', 'A server is carrying a tray of drinks.'],
  ],
  floor: 'rgba(186,150,110,0.32)',
  floorLines(c) { for (let y = -0.46; y < 0.2; y += 0.035) c.line([[0.03, y], [0.637, y]], 'rgba(110,80,50,0.12)', 0.001); },
  wall: { id: 're-wall', x: 0.333, y: 0.212, h: 0.2 },
  cards: [
    { id: 're-chef', x: 0.1, y: 0.1, h: 0.195, say: 'A chef is holding a pan.' },
    { id: 're-tray', x: 0.25, y: 0.1, h: 0.195, say: 'A waiter is carrying a tray.' },
    { id: 're-chairs', x: 0.4, y: 0.1, h: 0.14, say: 'Some chairs have been stacked on top of each other.' },
    { id: 're-coats', x: 0.56, y: 0.1, h: 0.185, say: 'Some coats are hanging on a rack.' },
    { id: 're-menus', x: 0.13, y: -0.12, h: 0.14, say: "They're looking at menus." },
    { id: 're-pour', x: 0.3, y: -0.115, h: 0.18, say: "She's pouring some water into a glass." },
    { id: 're-notepad', x: 0.43, y: -0.12, h: 0.195, say: "He's writing on a notepad." },
    { id: 're-wipe', x: 0.12, y: -0.34, h: 0.173, say: "She's wiping a table." },
  ],
  swap: {
    worker: { id: 're-server', x: 0.33, y: -0.345, h: 0.19 }, before: { id: 're-table-before', x: 0.5, y: -0.35, h: 0.105 }, after: { id: 're-table-after', x: 0.5, y: -0.35, h: 0.105 },
    sayBefore: 'A table is being set for two.', sayAfter: 'A table has been set for two.', exit: -0.3,
  },
  quizzes: [
    { target: 're-coats', targetZh: '衣帽架', okWhy: '沒有人在掛；外套就是掛在那裡的狀態：are hanging。', options: [
      { t: 'Some coats are being hung on a rack.', why: 'being + p.p. 要有人正在掛，照片裡沒有人。' },
      { t: 'Some coats are hanging on a rack.', ok: true },
      { t: 'A man is taking off his coat.', why: '加了人：衣帽架旁邊沒有人。' },
      { t: 'Some coats are folded on a chair.', why: '位置錯：外套是掛著，不是摺好放在椅子上。' },
    ] },
    { target: 're-pour', targetZh: '拿著水壺的服務生', okWhy: 'pour A into B = 把 A 倒進 B；先看手上拿的東西、朝哪裡倒。', options: [
      { t: "She's drinking a glass of water.", why: '東西對、動作錯：她在倒水，不是在喝。' },
      { t: "She's filling out a form.", why: '陷阱：fill a glass 是倒滿杯子，但 fill out a form 是填表格。' },
      { t: "She's pouring some water into a glass.", ok: true },
      { t: "She's pouring some soup into a bowl.", why: '動作對、東西錯：倒的是水、倒進杯子。' },
    ] },
    { target: 're-chairs', targetZh: '疊起來的椅子', okWhy: 'stack = 疊起來；have been stacked 是已經疊好的狀態。', options: [
      { t: 'Some chairs are being stacked.', why: 'being + p.p. 要有人正在疊，照片裡沒有人。' },
      { t: 'Some chairs are occupied.', why: 'occupied 是「有人坐」；這些椅子沒有人坐。' },
      { t: 'Some chairs have been knocked over.', why: 'knock over 是撞倒；椅子是整齊疊好，不是倒在地上。' },
      { t: 'Some chairs have been stacked on top of each other.', ok: true },
    ] },
  ],
});
