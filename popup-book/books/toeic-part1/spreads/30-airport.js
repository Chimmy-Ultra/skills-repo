// ======================= 3. Travel 機場 =======================
const sceneAirport = makeScene({
  key: 'airport', title: '機場', seed: 13,
  kicker: 'PART 1 · TRAVEL', heading: 'At the Airport　機場',
  intro: ['人和東西在哪裡，Part 1 很愛考：[[in line]]（排成一列）、[[next to]]（在旁邊）、[[onto]]（放到…上面）。',
    '沒有人坐的椅子叫 [[unoccupied]]；照片看不出來的事（要去哪、要不要登機）都不能選。'],
  phrases: [
    ['wait in line', '排隊', 'Some passengers are waiting in line at a counter.'],
    ['examine', '仔細檢查', 'An officer is examining a document.'],
    ['look up at', '抬頭看', 'Some travelers are looking up at a board.'],
    ['be unoccupied', '沒有人坐', 'Some tables are unoccupied.'],
    ['wear', '穿戴著（狀態）', 'A traveler is wearing a hat.'],
    ['load … onto …', '把…裝上…', 'Some boxes are being loaded onto a truck.'],
  ],
  floor: 'rgba(214,214,206,0.45)',
  floorLines(c) { for (let x = 0.03; x < 0.64; x += 0.1) c.line([[x, -0.47], [x, 0.2]], 'rgba(120,124,128,0.1)', 0.001); c.line([[0.03, -0.12], [0.637, -0.12]], 'rgba(120,124,128,0.12)', 0.002); },
  wall: { id: 'ap-wall', x: 0.33, y: 0.212, w: 0.52 },
  cards: [
    { id: 'ap-agent', x: 0.13, y: 0.1, say: "She's examining a passport." },
    { id: 'ap-lookup', x: 0.29, y: 0.105, say: 'A man is looking up at a screen.' },
    { id: 'ap-seats', x: 0.45, y: 0.1, say: 'Some seats are unoccupied.' },
    { id: 'ap-backpack', x: 0.575, y: 0.105, say: 'A man is wearing a backpack.' },
    { id: 'ap-line', x: 0.15, y: -0.12, say: 'Some people are waiting in line.' },
    { id: 'ap-map', x: 0.33, y: -0.115, say: 'A woman is studying a map.' },
    { id: 'ap-suitcase', x: 0.5, y: -0.12, say: 'A woman is pulling a suitcase.' },
    { id: 'ap-mop', x: 0.12, y: -0.34, say: 'A worker is mopping the floor.' },
  ],
  swap: {
    worker: { id: 'ap-handler', x: 0.31, y: -0.345 }, before: { id: 'ap-cart-before', x: 0.51, y: -0.35 }, after: { id: 'ap-cart-after', x: 0.51, y: -0.35 },
    sayBefore: 'Some luggage is being loaded onto a cart.', sayAfter: 'Some luggage has been loaded onto a cart.', exit: -0.3,
  },
  quizzes: [
    { target: 'ap-line', targetZh: '排成一列的三個人', okWhy: '三個人一個接一個站著：waiting in line。', options: [
      { t: 'Some people are boarding a plane.', why: '推測：照片看不出他們要登機。' },
      { t: 'Some people are waiting in line.', ok: true },
      { t: 'Some people are sitting in a waiting area.', why: '位置錯：他們站著，沒有坐。' },
      { t: 'Some people are unpacking their bags.', why: '東西對、動作錯：他們提著包包，沒有在打開。' },
    ] },
    { target: 'ap-seats', targetZh: '一排椅子', okWhy: 'unoccupied = 沒有人坐，也常說 empty 或 vacant。', options: [
      { t: 'Some seats are being cleaned.', why: 'being + p.p. 要有人正在擦，照片裡沒有人。' },
      { t: 'Some seats are unoccupied.', ok: true },
      { t: 'All the seats are taken.', why: '意思相反：taken 是「有人坐」，這排都是空的。' },
      { t: 'Some passengers are sitting in a row.', why: '加了人：椅子上沒有人。' },
    ] },
    { target: 'ap-backpack', targetZh: '背著背包的男人', okWhy: 'wear 不只用在衣服：背包、眼鏡、帽子、手錶都用 wear。', options: [
      { t: "He's putting on a backpack.", why: '背包已經在背上，是 wearing 的狀態，不是正在背上的動作。' },
      { t: "He's wearing a backpack.", ok: true },
      { t: "He's packing a suitcase.", why: '音近：backpack 裡有 pack；而且照片沒有行李箱。' },
      { t: "He's buying a ticket.", why: '推測：機場常見的事，但照片看不出來。' },
    ] },
  ],
});
