// ======================= 3. Travel 機場 =======================
const sceneAirport = makeScene({
  key: 'airport', title: '機場', seed: 13,
  kicker: 'PART 1 · TRAVEL', heading: 'At the Airport　機場',
  intro: ['人和東西在哪裡，Part 1 很愛考：[[in line]]（排成一列）、[[next to]]（在旁邊）、[[onto]]（放到…上面）。',
    '沒有人坐的椅子叫 [[unoccupied]]；照片看不出來的事（要去哪、要不要登機）都不能選。'],
  phrases: [['wait in line', '排隊'], ['pull a suitcase', '拉行李箱'], ['look up at a screen', '抬頭看螢幕'], ['be unoccupied', '沒有人坐'], ['load luggage onto a cart', '把行李裝上推車']],
  floor: 'rgba(214,214,206,0.45)',
  floorLines(c) { for (let x = 0.03; x < 0.64; x += 0.1) c.line([[x, -0.47], [x, 0.2]], 'rgba(120,124,128,0.1)', 0.001); c.line([[0.03, -0.12], [0.637, -0.12]], 'rgba(120,124,128,0.12)', 0.002); },
  wall: { id: 'ap-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 'ap-agent', x: 0.2, y: 0.1, say: "She's examining a passport." },
    { id: 'ap-lookup', x: 0.55, y: 0.105, say: 'A man is looking up at a screen.' },
    { id: 'ap-line', x: 0.22, y: -0.12, say: 'Some people are waiting in line.' },
    { id: 'ap-seats', x: 0.5, y: -0.115, say: 'Some seats are unoccupied.' },
    { id: 'ap-suitcase', x: 0.12, y: -0.33, say: 'A woman is pulling a suitcase.' },
  ],
  swap: {
    worker: { id: 'ap-handler', x: 0.31, y: -0.345 }, before: { id: 'ap-cart-before', x: 0.51, y: -0.35 }, after: { id: 'ap-cart-after', x: 0.51, y: -0.35 },
    sayBefore: 'Some luggage is being loaded onto a cart.', sayAfter: 'Some luggage has been loaded onto a cart.', exit: -0.3,
  },
  quiz: { target: 'ap-line', targetZh: '排成一列的三個人', okWhy: '三個人一個接一個站著：waiting in line。', options: [
    { t: 'Some people are boarding a plane.', why: '推測：照片看不出他們要登機。' },
    { t: 'Some people are waiting in line.', ok: true },
    { t: 'Some people are sitting in a waiting area.', why: '位置錯：他們站著，等候區的椅子是空的。' },
    { t: 'Some people are unpacking their bags.', why: '東西對、動作錯：他們提著包包，沒有在打開。' },
  ] },
});
