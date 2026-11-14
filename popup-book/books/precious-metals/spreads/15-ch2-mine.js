// ======================= Chapter 2: from mine to market =======================
// Facts checked against the sources listed in sources.md (Chapter 2). Plates: Gemini engravings, sheets l–r.

// ---- small drawing helpers for this chapter ----
const MM_BOX = 'rgba(45,95,115,0.1)', MM_GOLDBOX = 'rgba(184,140,58,0.22)', MM_EDGE = 'rgba(42,33,25,0.6)';
function mmArrow(c, x0, y0, x1, y1, color = INK, wid = 0.0016, head = 0.008) {
  const d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d, uy = (y1 - y0) / d;
  c.line([[x0, y0], [x1 - ux * head * 0.8, y1 - uy * head * 0.8]], color, wid);
  c.fill([[x1, y1], [x1 - ux * head - uy * head * 0.55, y1 - uy * head + ux * head * 0.55], [x1 - ux * head + uy * head * 0.55, y1 - uy * head - ux * head * 0.55]], color);
}
function mmBox(c, cx, top, bw, bh, label, fill = MM_BOX, size = 0.0168) {
  const x0 = cx - bw / 2, x1 = cx + bw / 2, bot = top - bh;
  c.fill([[x0, top], [x1, top], [x1, bot], [x0, bot]], fill);
  c.line([[x0, top], [x1, top], [x1, bot], [x0, bot], [x0, top]], MM_EDGE, 0.0011);
  c.text({ x: cx, y: top - (bh - size * 1.25) / 2 + 0.001, w: bw - 0.014, size, lh: 1.22, align: 'center', paras: [label], color: INK });
  return bot;
}
// the whole road as a column of stations, with recycling looping back to the refinery
function mmRoad(st, { rowH = 0.13, imgW = 0.15, size = 0.0172, back = 2 } = {}) {
  return (c, x, y, w) => {
    const ix = x + 0.01, tx = ix + imgW + 0.028, rx = x + w - 0.02, tw = rx - tx - 0.03, bh = rowH - 0.03, mid = [];
    st.forEach((s, i) => {
      const top = y - i * rowH, im = PLAN_IMG[s.img];
      let iw = imgW, ih = (iw * im.height) / im.width; if (ih > bh) { ih = bh; iw = (ih * im.width) / im.height; }
      c.img(s.img, ix + (imgW - iw) / 2, top - (bh - ih) / 2, iw);
      const r = c.text({ x: tx, y: top - 0.012, w: tw, size: size * 1.18, lh: 1.2, paras: [s.name], color: INK, weight: 600 });
      c.text({ x: tx, y: (r ? r.y0 : top - 0.04) - 0.004, w: tw, size, lh: 1.3, paras: [s.what], color: '#4a3d30' });
      mid.push(top - bh / 2);
      if (i < st.length - 1) mmArrow(c, ix + imgW / 2, top - bh - 0.002, ix + imgW / 2, top - rowH + 0.004);
    });
    // recycling: from the last station back up to station `back`
    const yb = mid[mid.length - 1], yt = mid[back], dash = [0.007, 0.005], red = 'rgba(155,59,42,0.85)';
    c.line([[rx - 0.03, yb], [rx, yb], [rx, yt]], red, 0.0016, dash);
    mmArrow(c, rx, yt, rx - 0.03, yt, red);
    c.text({ x: rx - 0.008, y: (yb + yt) / 2 + 0.01, w: 0.12, size, lh: 1.2, align: 'right', paras: ['recycling'], color: TONE.red, italic: true });
    return st.length * rowH - 0.02;
  };
}
// slurry splits into the two routes
function mmFork({ size = 0.0165 } = {}) {
  return (c, x, y, w) => {
    const cx = x + w / 2, lx = x + w * 0.25, rx = x + w * 0.75, bw = w * 0.44, bh = 0.044;
    let b = mmBox(c, cx, y, w * 0.6, bh, 'Ground ore + water (slurry)', MM_BOX, size);
    const t2 = b - 0.05;
    mmArrow(c, cx - 0.04, b - 0.003, lx, t2 + 0.003); mmArrow(c, cx + 0.04, b - 0.003, rx, t2 + 0.003);
    const bl = mmBox(c, lx, t2, bw, bh, 'Leaching', MM_BOX, size), br = mmBox(c, rx, t2, bw, bh, 'Flotation', MM_BOX, size);
    const s1 = c.text({ x: lx, y: bl - 0.008, w: bw, size: size * 0.95, lh: 1.3, align: 'center', italic: true, paras: ['cyanide dissolves the gold and silver'], color: '#4a3d30' });
    const s2 = c.text({ x: rx, y: br - 0.008, w: bw, size: size * 0.95, lh: 1.3, align: 'center', italic: true, paras: ['bubbles lift the metal-bearing grains'], color: '#4a3d30' });
    const low = Math.min(s1 ? s1.y0 : bl, s2 ? s2.y0 : br) - 0.008, t3 = low - 0.036;
    mmArrow(c, lx, low, lx, t3 + 0.003); mmArrow(c, rx, low, rx, t3 + 0.003);
    const e1 = mmBox(c, lx, t3, bw, bh * 1.35, 'Doré bar, poured at the mine', MM_GOLDBOX, size);
    const e2 = mmBox(c, rx, t3, bw, bh * 1.35, 'Concentrate, sold to a smelter', MM_GOLDBOX, size);
    const f1 = c.text({ x: lx, y: e1 - 0.008, w: bw, size: size * 0.95, lh: 1.3, align: 'center', paras: ['most gold mines'], color: TONE.red });
    const f2 = c.text({ x: rx, y: e2 - 0.008, w: bw, size: size * 0.95, lh: 1.3, align: 'center', paras: ['lead, zinc, copper, nickel and platinum mines'], color: TONE.red });
    return y - Math.min(f1 ? f1.y0 : e1, f2 ? f2.y0 : e2);
  };
}
// a row of numbered steps with arrows between them
function mmSteps(steps, { size = 0.0152 } = {}) {
  return (c, x, y, w) => {
    const n = steps.length, sw = w / n, r = 0.013;
    let low = y;
    steps.forEach((s, i) => {
      const cx = x + sw * (i + 0.5), cy = y - r;
      const pts = []; for (let a = 0; a < 24; a++) pts.push([cx + r * Math.cos((a / 24) * 2 * Math.PI), cy + r * Math.sin((a / 24) * 2 * Math.PI)]);
      c.fill(pts, i === n - 1 ? TONE.gold : TONE.blue);
      c.text({ x: cx, y: cy + size * 0.62, w: 0.03, size, lh: 1.2, align: 'center', paras: [String(i + 1)], color: '#fff', weight: 600 });
      if (i < n - 1) mmArrow(c, cx + r + 0.006, cy, cx + sw - r - 0.006, cy, '#5a4b3d', 0.0013, 0.007);
      const t = c.text({ x: cx, y: cy - r - 0.008, w: sw - 0.008, size, lh: 1.25, align: 'center', paras: [s], color: INK });
      if (t) low = Math.min(low, t.y0);
    });
    return y - low;
  };
}
// the top face of a Good Delivery gold bar with its marks labelled
function mmBar({ size = 0.017 } = {}) {
  return (c, x, y, w) => {
    const bw = 0.36, bh = 0.15, x0 = x + 0.07, top = y - 0.075, x1 = x0 + bw, bot = top - bh, ins = 0.02;
    const rect = (a, b, cc, d) => [[a, b], [cc, b], [cc, d], [a, d]];
    c.fill(rect(x0, top, x1, bot), '#c99a3e');
    c.fill(rect(x0 + ins, top - ins, x1 - ins, bot + ins), '#e4c070');
    c.line(rect(x0, top, x1, bot).concat([[x0, top]]), '#7a5a22', 0.0015);
    c.line(rect(x0 + ins, top - ins, x1 - ins, bot + ins).concat([[x0 + ins, top - ins]]), 'rgba(122,90,34,0.6)', 0.001);
    // the marks
    const sx = x0 + 0.075, sy = top - bh / 2, rr = 0.03, ring = [];
    for (let a = 0; a <= 36; a++) ring.push([sx + rr * Math.cos((a / 36) * 2 * Math.PI), sy + rr * Math.sin((a / 36) * 2 * Math.PI)]);
    c.line(ring, '#6b4c1a', 0.0018);
    c.text({ x: sx, y: sy + 0.009, w: 0.05, size: 0.0145, lh: 1.1, align: 'center', paras: ['REF'], color: '#6b4c1a', weight: 600 });
    const mk = (t, mx, my) => c.text({ x: mx, y: my, w: 0.14, size: 0.019, lh: 1.1, align: 'center', paras: [t], color: '#5b4115', weight: 600 });
    const serial = [x0 + 0.225, top - 0.042], fine = [x0 + 0.225, top - 0.08], date = [x0 + 0.29, top - 0.112];
    mk('AB 012345', serial[0], serial[1] + 0.012); mk('999.9', fine[0], fine[1] + 0.012); mk('0126', date[0], date[1] + 0.012);
    // labels with leader lines
    const lead = 'rgba(42,33,25,0.55)';
    const lab = (t, tx, ty, al, from, to) => { c.line([from, to], lead, 0.0009); c.text({ x: tx, y: ty, w: 0.24, size, lh: 1.2, align: al, paras: [t], color: INK, italic: true }); };
    lab('refiner’s stamp', x0 - 0.04, top + 0.055, 'left', [x0 + 0.02, top + 0.03], [sx - 0.012, sy + rr - 0.004]);
    lab('serial number', x1 + 0.03, top + 0.055, 'right', [x1 - 0.06, top + 0.03], [serial[0] + 0.05, serial[1] + 0.004]);
    lab('fineness', x1 + 0.012, fine[1] + 0.01, 'left', [x1 + 0.008, fine[1]], [fine[0] + 0.035, fine[1]]);
    lab('month and year (MMYY)', x0 + 0.13, bot - 0.028, 'left', [x0 + 0.26, bot - 0.026], [date[0], date[1] - 0.012]);
    return y - (bot - 0.03 - size * 1.4);
  };
}
// paired horizontal bars: rows [{ label, a, b }]
function mmPairs(rows, { max, labelW = 0.26, barH = 0.018, gap = 0.022, size = 0.0165, la = '', lb = '', ta = TONE.grey, tb = TONE.gold, fmt = (v) => fmtN(v, 1) } = {}) {
  return (c, x, y, w) => {
    const vmax = max || Math.max(...rows.flatMap((r) => [r.a, r.b])), x0 = x + labelW * w, bw = w * (1 - labelW) - 0.08;
    // legend
    const key = (t, col, kx) => { c.fill([[kx, y], [kx + 0.02, y], [kx + 0.02, y - 0.012], [kx, y - 0.012]], col); c.text({ x: kx + 0.026, y: y + 0.002, w: 0.2, size, lh: 1.2, paras: [t], color: INK }); };
    key(la, ta, x0); key(lb, tb, x0 + 0.17);
    const y1 = y - 0.03;
    rows.forEach((r, i) => {
      const yy = y1 - i * (2 * barH + gap);
      c.text({ x: x0 - 0.008, y: yy - barH + size * 0.62, w: labelW * w, size, lh: 1.2, align: 'right', paras: [r.label], color: INK });
      [[r.a, ta, 0], [r.b, tb, 1]].forEach(([v, col, k]) => {
        const t = yy - k * barH, len = Math.max(0.0015, (v / vmax) * bw);
        c.fill([[x0, t], [x0 + len, t], [x0 + len, t - barH + 0.002], [x0, t - barH + 0.002]], col);
        c.text({ x: x0 + len + 0.006, y: t + 0.002, w: 0.1, size: size * 0.9, lh: 1.15, paras: [fmt(v)], color: '#4a3d30' });
      });
    });
    return 0.03 + rows.length * (2 * barH + gap);
  };
}
// London -> Switzerland -> New York
function mmRoute({ size = 0.0158 } = {}) {
  return (c, x, y, w) => {
    const pts = [['London', '400-oz bars leave the vault'], ['Switzerland', 'melted and recast as kilobars'], ['New York', 'delivered into COMEX vaults']];
    const sw = w / 3, cy = y - 0.03; let low = y;
    pts.forEach(([city, what], i) => {
      const cx = x + sw * (i + 0.5), r = 0.011, ring = [];
      for (let a = 0; a < 24; a++) ring.push([cx + r * Math.cos((a / 24) * 2 * Math.PI), cy + r * Math.sin((a / 24) * 2 * Math.PI)]);
      c.fill(ring, i === 1 ? TONE.red : TONE.gold);
      c.text({ x: cx, y: cy + 0.035, w: sw, size: size * 1.12, lh: 1.2, align: 'center', paras: [city], color: INK, weight: 600 });
      const t = c.text({ x: cx, y: cy - 0.02, w: sw - 0.01, size, lh: 1.3, align: 'center', italic: true, paras: [what], color: '#4a3d30' });
      if (t) low = Math.min(low, t.y0);
      if (i < 2) mmArrow(c, cx + r + 0.008, cy, cx + sw - r - 0.008, cy, '#5a4b3d', 0.0016, 0.009);
    });
    return y - low + 0.035;
  };
}

// ---- the spreads ----
const ch2m_a = flatSpread({
  key: 'mm-road', title: 'Chapter 2: From mine to market',
  left: [
    { kicker: 'Chapter 2 · From mine to market' },
    { h1: 'Following the metal' },
    { p: 'Chapter 1 asked who buys each metal and where new metal comes from. This chapter follows the metal itself, step by step, from rock in the ground to a ring, a coin or a car part.' },
    { p: 'The three metals start in different places. Most gold comes from mines that dig for gold. Most silver comes out of lead, zinc and copper ores, and most palladium out of nickel and platinum ores. Each kind of ore needs its own plant.' },
    { p: 'After the refinery the routes join. Every metal ends as a standard bar that is stored, traded and shipped in the same way, and is finally made into something.' },
    { figs: ['m-pit', 'r-gold400', 'e-smith'], h: 0.1, cap: 'A mine, refined bars and a goldsmith.' },
    { p: 'Very little of the metal is ever used up. Old jewellery, catalytic converters and electronics go back to the refinery, so the road is really a loop.' },
  ],
  right: [
    { chart: mmRoad([
      { img: 'm-pit', name: 'Mine', what: 'rock holding a few grams of metal per tonne' },
      { img: 'm-mill', name: 'Plant at the mine', what: 'the rock is crushed and ground, and the metal pulled out' },
      { img: 'r-cells', name: 'Refinery', what: 'pure metal, cast into standard bars' },
      { img: 'v-shelves', name: 'Vault', what: 'the bars sit still while their owners change' },
      { img: 'e-smith', name: 'Maker', what: 'jewellery, coins, solar cells, catalysts' },
      { img: 'c-cats', name: 'User', what: 'worn, used up or scrapped' }]) },
  ],
});

const ch2m_b = flatSpread({
  key: 'mm-dig', title: 'Chapter 2: Finding and digging',
  left: [
    { h1: 'Finding the ore' },
    { p: 'A mine starts with a drill. Geologists drill holes hundreds of metres into the ground and pull up long cylinders of rock called [[drill core]]. Laboratories measure how much metal each piece of core contains. Only when many holes find enough metal in a large enough body of rock does the company have an [[ore body]] worth mining.' },
    { figs: ['m-rig', 'm-core'], h: 0.11, cap: 'A drill rig and a tray of drill core.' },
    { p: 'The search takes a long time. S&P Global studied when mines were discovered and when they started producing. Gold mines took 15.2 years on average, the fastest of the metals in the study. A higher gold price today cannot bring a new mine into production for many years.' },
  ],
  right: [
    { h2: 'How much gold is in the rock' },
    { p: 'Ore grade is measured in grams of metal per tonne of rock (g/t). At the end of 2022 the average grade of Newmont’s gold reserves was 1.09 g/t. To produce one troy ounce, 31.1 grams, the mine has to dig and grind about' },
    { eq: '31.1\\ \\mathrm{g} \\div 1.09\\ \\mathrm{g/t} \\approx 29\\ \\mathrm{t}', size: 0.024 },
    { p: 'of ore, and more in practice, because the plant never recovers all the gold.' },
    { h2: 'Open pit or underground' },
    { p: 'Ore near the surface is mined in an [[open pit]]: the rock is blasted in steps called benches and hauled out by giant trucks. Deep ore, or ore in narrow veins, is reached through shafts and tunnels. Underground mining costs more per tonne, so it needs richer ore.' },
    { figs: ['m-pit', 'm-truck', 'm-stope'], h: 0.08, cap: 'An open pit, a haul truck, and miners drilling underground.' },
  ],
});

const ch2m_c = flatSpread({
  key: 'mm-mill', title: 'Chapter 2: From rock to powder',
  left: [
    { h1: 'From rock to powder' },
    { p: 'Precious metals sit in ore as tiny grains, often too small to see. To reach them the plant first breaks the rock. Crushers turn blasted boulders into stones. Then large rotating mills, steel drums loaded with steel balls, tumble the stones with water until they become a fine wet powder.' },
    { figs: ['m-crusher', 'm-mill'], h: 0.12, cap: 'A jaw crusher and a grinding mill.' },
    { p: 'The mixture of ground rock and water is called [[slurry]], or pulp. Grinding rock this fine takes a great deal of electricity.' },
    { h2: 'Heap leaching' },
    { p: 'Some ore is too poor to be worth grinding. Mines pile it, crushed, on a plastic liner and drip cyanide solution through the heap; the liquid that drains out carries the gold to the plant.' },
    { fig: 'm-heap', w: 0.22 },
  ],
  right: [
    { h2: 'Two ways to pull the metal out' },
    { chart: mmFork() },
    { p: '[[Leaching]] dissolves the gold out of the rock. It is the usual route at gold mines and ends at the mine with a rough bar.' },
    { p: '[[Flotation]] dissolves nothing. Chemicals make the metal-bearing grains cling to air bubbles, which carry them up as a froth while the waste sinks. Dried, the froth is a [[concentrate]], far richer than the ore, which the mine sells to a smelter. Most silver and palladium go this way.' },
    { fig: 'm-float', w: 0.2, cap: 'Flotation cells: the froth carries the valuable grains.' },
  ],
});

const ch2m_d = flatSpread({
  key: 'mm-gold', title: 'Chapter 2: Gold, from slurry to doré',
  left: [
    { kicker: 'Gold' },
    { h1: 'Dissolving gold' },
    { p: 'At most gold mines the slurry flows through a row of large stirred tanks. Lime keeps it alkaline, which stops poisonous hydrogen cyanide gas from forming. Then a weak solution of sodium cyanide is added. With oxygen from the air, the cyanide dissolves the gold:' },
    { eq: '4\\,\\mathrm{Au} + 8\\,\\mathrm{NaCN} + \\mathrm{O_2} + 2\\,\\mathrm{H_2O} \\rightarrow 4\\,\\mathrm{NaAu(CN)_2} + 4\\,\\mathrm{NaOH}', size: 0.019 },
    { fig: 'm-tanks', w: 0.28, cap: 'Leach tanks with their stirring motors.' },
    { p: 'Granules of [[activated carbon]], usually made from coconut shells, are stirred into the tanks, and the dissolved gold sticks to them. Screens hold the carbon back while the slurry flows on. The loaded carbon is then washed with a hot solution that strips the gold off again into a small volume of rich liquid.' },
  ],
  right: [
    { h2: 'From liquid to a rough bar' },
    { p: 'The rich liquid flows through [[electrowinning]] cells, where an electric current plates the gold and silver onto steel cathodes. The metal sludge is dried, mixed with fluxes and melted. Impurities float to the top as slag, and the metal is poured into moulds.' },
    { figs: ['m-pour', 'm-dore'], h: 0.12, cap: 'Pouring doré, and finished doré bars.' },
    { p: 'The result is [[doré]], a rough bar of gold mixed with silver. The mix depends on the ore. The LBMA notes that doré from most South African mines contains about 10% silver. At New Zealand’s Waihi mine each bar held 75–90% silver and only 10–25% gold.' },
    { p: 'Doré is not yet a market product. Every bar is shipped to a refinery.' },
  ],
});

const ch2m_e = flatSpread({
  key: 'mm-silver', title: 'Chapter 2: Silver, a by-product',
  left: [
    { kicker: 'Silver' },
    { h1: 'Silver rides with other metals' },
    { p: 'Chapter 1 showed that about three-quarters of mined silver comes from mines run for lead and zinc, copper or gold. At these mines nobody handles silver as silver until near the end. The flotation plant makes a lead, zinc or copper concentrate, and the silver travels inside it.' },
    { p: 'The mine sells its concentrate to a smelter, often in another country, and is paid for the metals it contains, minus the smelter’s charges.' },
    { fig: 'm-ship', w: 0.25, cap: 'Concentrate being loaded for a smelter.' },
    { h2: 'Out of copper' },
    { p: 'A copper refinery hangs plates of impure copper in an acid bath. An electric current carries pure copper across to the opposite plates. Silver and gold do not dissolve; they fall to the bottom of the tank as [[anode slime]], which is collected and refined for its silver, gold and other metals.' },
  ],
  right: [
    { fig: 'm-tankhouse', w: 0.24, cap: 'A copper refinery tank house.' },
    { h2: 'Out of lead' },
    { p: 'A lead smelter melts lead concentrate into [[lead bullion]]: lead that still carries the silver and some gold. To separate them, refiners stir zinc into the molten lead. Silver dissolves far more readily in zinc than in lead, so it collects in a zinc-rich crust that floats on top and is skimmed off. This is the [[Parkes process]], patented in 1850 and still in use.' },
    { fig: 'm-kettle', w: 0.2, cap: 'Skimming the silver-rich crust off molten lead.' },
    { p: 'Because silver arrives mixed into other metals, the amount of silver mined depends on how much lead, zinc and copper the world digs. This is why silver mine output barely responds to the silver price.' },
  ],
});

const ch2m_f = flatSpread({
  key: 'mm-pd', title: 'Chapter 2: Palladium from two places',
  left: [
    { kicker: 'Palladium' },
    { h1: 'Palladium from two places' },
    { p: 'Russia and South Africa mine almost four-fifths of the world’s palladium, and each country has its own route.' },
    { h2: 'Norilsk, in the Russian Arctic' },
    { p: 'Nornickel mines copper–nickel sulphide ore around Norilsk, on the Taimyr Peninsula north of the Arctic Circle. The area is linked to the rest of Russia by the Yenisey River, the Northern Sea Route and air.' },
    { fig: 'm-arctic', w: 0.24, cap: 'A smelter in the Arctic.' },
    { p: 'Concentrators turn the ore into concentrate, which is pumped through slurry pipelines to the Nadezhda smelter. The smelter makes [[matte]], a mix of nickel, copper and sulphur that carries the precious metals. As the nickel and copper are refined, palladium and platinum collect in a precious-metal concentrate, which refiners such as Krastsvetmet in Krasnoyarsk turn into pure metal.' },
  ],
  right: [
    { h2: 'South Africa: thin layers, deep down' },
    { p: 'In South Africa palladium comes out of the same rock as platinum, in the Bushveld Complex. The metals sit in thin layers called reefs, the Merensky Reef and the UG2, often only one or two metres thick or less. Mined ore holds about 2–6 grams of platinum-group metals per tonne.' },
    { figs: ['m-reef', 'ptmine'], h: 0.1, cap: 'Mining along a thin reef, and a platinum mine shaft.' },
    { p: 'Valterra Platinum, formerly Anglo American Platinum, processes the ore in five steps:' },
    { chart: mmSteps(['Concentrator', 'Smelter', 'Converter', 'Base metals refinery', 'Precious metals refinery']) },
    { p: 'The smelter and converter make matte. The base metals refinery takes out nickel, copper and cobalt, and the precious metals refinery separates platinum, palladium, rhodium and the rest.' },
  ],
});

const ch2m_g = flatSpread({
  key: 'mm-refinery', title: 'Chapter 2: The refinery',
  left: [
    { h1: 'The refinery' },
    { p: 'Doré, anode slime, precious-metal concentrate and scrap all end up at a refinery. The first job is to find out exactly what has arrived, because that decides what the owner is paid. Each lot is melted, mixed and sampled.' },
    { p: 'The classic test is the [[fire assay]]. The sample is melted with lead oxide and fluxes, and the lead collects the gold and silver. The lead is then heated in a small porous cup called a [[cupel]], which soaks it up and leaves a tiny bead of gold and silver. Boiling the bead in nitric acid removes the silver, and the gold left behind is weighed.' },
    { fig: 'r-assay', w: 0.24, cap: 'Cupels in an assay furnace.' },
  ],
  right: [
    { h2: 'Two steps to pure gold' },
    { p: 'In the [[Miller process]], patented in 1867, chlorine gas is bubbled through molten gold. Almost every other metal reacts with the chlorine and floats off as a chloride slag, leaving gold about 99.5% pure. The process is fast and cheap.' },
    { p: 'For higher purity the gold is cast into plates for the [[Wohlwill process]], invented in 1874. In a bath of hydrochloric acid and gold chloride, an electric current dissolves the plate and deposits gold of 99.99% purity on the opposite electrode. This is slower and ties up a lot of gold in the bath.' },
    { figs: ['r-miller', 'r-cells'], h: 0.11, cap: 'Chlorine refining, and electrolytic cells.' },
  ],
});

const ch2m_h = flatSpread({
  key: 'mm-gooddelivery', title: 'Chapter 2: Good Delivery bars',
  left: [
    { h1: 'A bar every dealer accepts' },
    { p: 'A wholesale buyer in London does not test every bar. Instead the London Bullion Market Association (LBMA) keeps the [[Good Delivery List]] of approved refiners, monitors them, and sets rules for the bars they cast. A bar that meets the rules is accepted by every dealer in the market. The London Platinum and Palladium Market (LPPM) does the same for platinum and palladium.' },
    { chart: mmBar() },
    { note: 'Marks on a Good Delivery gold bar: the refiner’s stamp, a serial number, the fineness to four figures, and the month and year of casting, required since 2019.' },
    { figs: ['r-gold400', 'r-silverbars', 'r-pdplates'], h: 0.1, cap: 'Gold bars, a pallet of silver bars, and palladium plates.' },
  ],
  right: [
    { table: { cols: [0.31, 0.23, 0.23, 0.23], head: ['', 'Gold', 'Silver', 'Palladium'], align: ['l', 'r', 'r', 'r'], size: 0.0195, pad: 0.008, rows: [
      ['Form', 'bar', 'bar', 'plate or ingot'], ['Metal content', '350–430 oz', '750–1,100 oz', '1–6 kg'], ['Minimum fineness', '995.0', '999.0', '999.5']] } },
    { p: 'Fineness is written in parts per thousand: 995.0 means at least 99.5% gold. A typical gold bar holds about 400 troy ounces, roughly 12.4 kg.' },
    { p: 'The list covers most of the world’s metal: the LBMA says its accredited refiners account for about 90% of annual gold production.' },
    { p: 'The system works because the bars never leave trusted hands. They move only between approved refiners, vaults and carriers. The LBMA states that a bar taken out of the vaults’ custody stops being Good Delivery until a vault manager checks it and accepts it back.' },
  ],
});

const ch2m_i = flatSpread({
  key: 'mm-move', title: 'Chapter 2: Moving bullion',
  left: [
    { h1: 'Moving bullion' },
    { p: 'Bullion travels by armoured truck on land and by air between countries. Gold is commonly flown between the main hubs, London, New York, Zurich, Hong Kong and Shanghai, in the cargo holds of planes, packed in sealed wooden boxes. Silver is bulkier and worth far less per kilogram, so it usually goes by ship.' },
    { figs: ['t-van', 't-crate'], h: 0.1 },
    { p: 'The work is done by a few specialist security firms, such as Brink’s, Loomis and Malca-Amit, which link mines, refiners, vaults and buyers around the world.' },
    { figs: ['t-hold', 't-ship'], h: 0.1, cap: 'An armoured van, a sealed crate, a cargo hold and a container ship.' },
  ],
  right: [
    { h2: 'Early 2025: the rush to New York' },
    { p: 'Moving metal takes time, and early 2025 showed why that matters. Traders feared that the United States would put tariffs on imported bullion, and the COMEX gold price in New York rose above London’s: on 31 January the April futures contract traded $64 above the London spot price.' },
    { p: 'Shipping gold from London to New York captured the gap, but the bars did not fit. London trades 400-ounce bars; COMEX takes 100-ounce bars and kilobars. So the bars took a detour:' },
    { chart: mmRoute() },
    { p: 'Between the US election in November 2024 and late January 2025, traders moved 393 tonnes of gold into COMEX vaults. In London the wait to withdraw gold from the Bank of England grew from a few days to four to eight weeks.' },
  ],
});

const ch2m_j = flatSpread({
  key: 'mm-vault', title: 'Chapter 2: Vaults and paper',
  left: [
    { h1: 'Most bars stay put' },
    { p: 'Once a bar reaches a vault, it may sit on the same shelf for years while its owner changes many times. At the end of October 2026 London’s vaults held 9,850 tonnes of gold, about 788,000 bars, and 28,889 tonnes of silver. The Bank of England stores gold for central banks and other customers; the rest sits in commercial vaults run by banks and security firms.' },
    { fig: 'v-shelves', w: 0.22 },
    { p: 'Most London trading clears over [[unallocated]] accounts: the buyer owns a claim on a bank’s pool of metal, and a trade is settled by changing account balances, without touching a bar. The LBMA puts this at probably more than 90% of wholesale trading. An [[allocated]] account holds specific bars, listed by serial number, for one owner.' },
  ],
  right: [
    { h2: 'New York: registered and eligible' },
    { p: 'COMEX futures are settled with metal in exchange-approved vaults in and around New York. A bar that meets COMEX rules and sits in such a vault is [[eligible]]. When the owner asks the vault to issue a [[warrant]], a document of title to those specific bars, the metal becomes [[registered]] and can be delivered against a futures contract. Delivery passes the warrant from seller to buyer; the bars do not move.' },
    { fig: 'v-warrant', w: 0.13 },
    { table: { cols: [0.46, 0.27, 0.27], head: ['COMEX stocks, 2 Oct 2026', 'Registered', 'Eligible'], align: ['l', 'r', 'r'], rows: [
      ['Gold, million oz', '15.1', '8.4'], ['Silver, million oz', '101.1', '236.5']] } },
    { p: 'A fall in registered stocks with an equal rise in eligible stocks is only paperwork: warrants were cancelled, and the metal is still in the vault.' },
  ],
});

const ch2m_k = flatSpread({
  key: 'mm-asia', title: 'Chapter 2: Recasting for Asia',
  left: [
    { h1: 'Big bars in, small bars out' },
    { p: 'Buyers in Asia want smaller bars than London trades. The main contract of the Shanghai Gold Exchange delivers one-kilogram bars of 99.99% gold, and gold imported into mainland China must be sold first through that exchange.' },
    { p: 'Switzerland, home to some of the world’s largest gold refineries, sits in between. Its refiners melt doré, scrap and 400-ounce bars and recast them into kilobars for Asia, and into whatever else the buyers want.' },
    { fig: 'k-moulds', w: 0.3 },
    { fig: 'k-kilos', w: 0.42, cap: 'Casting kilobars, and a row of finished one-kilogram bars.' },
  ],
  right: [
    { h2: 'Switzerland sends gold where it pays' },
    { p: 'Swiss customs figures show where the metal goes and how quickly the flows change. In January 2024 Swiss gold went mainly to China, Hong Kong and India. A year later, during the rush to New York, almost all of it went to the United States.' },
    { chart: mmPairs([
      { label: 'China', a: 77.8, b: 0.2 }, { label: 'Hong Kong', a: 44.6, b: 1.7 }, { label: 'India', a: 14.0, b: 1.6 },
      { label: 'UK', a: 7.9, b: 9.3 }, { label: 'USA', a: 1.6, b: 192.9 }], { la: 'Jan 2024', lb: 'Jan 2025' }) },
    { note: 'Swiss gold exports by destination, tonnes. Source: Swiss customs, via Reuters.' },
    { p: 'In August 2025 a US customs ruling put kilobars under the import tariffs (an exemption followed in September). Swiss exports to the US fell to 0.3 tonnes that month, while exports to China rose to 35 tonnes.' },
  ],
});

const ch2m_l = flatSpread({
  key: 'mm-use', title: 'Chapter 2: Where the metal ends up',
  left: [
    { h1: 'Where the metal ends up' },
    { p: 'Pure gold is too soft for most jewellery, so goldsmiths mix it with other metals. In India most gold jewellery is 22 carat, 91.6% gold. Buyers in China have traditionally preferred 24-carat pure gold.' },
    { fig: 'e-smith', w: 0.2 },
    { p: 'Coins and small bars are made by mints and refiners: blanks are cut from refined metal and struck in a press. Central banks and big investors buy whole Good Delivery bars and leave them in a vault.' },
    { figs: ['e-press', 'coins'], h: 0.09, cap: 'A goldsmith, a coin press and finished coins.' },
  ],
  right: [
    { h2: 'Silver in a solar cell' },
    { p: 'Silver paste is printed onto each silicon cell in very thin lines called fingers, which collect the current, and wider strips called busbars, which carry it away. Manufacturers keep cutting the silver per cell: from about 400 mg in 2007 to 130 mg in 2016, according to a study for the Silver Institute.' },
    { fig: 'e-solar', w: 0.25, cap: 'Printing silver paste onto a solar cell.' },
    { h2: 'Palladium in a catalytic converter' },
    { p: 'Palladium, platinum and rhodium are coated onto a ceramic honeycomb with thousands of fine channels. As exhaust gas flows through, the metals turn carbon monoxide, unburnt fuel and nitrogen oxides into carbon dioxide, water and nitrogen.' },
    { fig: 'e-honey', w: 0.24, cap: 'A catalyst honeycomb and its steel can.' },
  ],
});

const ch2m_m = flatSpread({
  key: 'mm-recycle', title: 'Chapter 2: Back to the start',
  left: [
    { h1: 'Back to the start' },
    { p: 'Precious metals are rarely used up, so the road ends where the metal was last made pure: at the refinery. Old jewellery is the biggest source of recycled gold, and people sell more of it when the price is high. In 2025 recycling supplied 1,404 tonnes of gold, more than a quarter of all supply.' },
    { figs: ['c-jewel', 'c-melt'], h: 0.11, cap: 'Scrap jewellery, melted down before refining.' },
    { p: 'Electronics hold small amounts of gold, silver and palladium in their circuit boards and contacts, which specialist smelters recover.' },
    { fig: 'c-ewaste', w: 0.18 },
  ],
  right: [
    { h2: 'Catalytic converters' },
    { p: 'Scrapped catalytic converters are the main source of recycled palladium. Collectors buy them from scrapyards. Processors cut them open, take out the ceramic, mill it to powder, and sample and assay each batch. Smelters and refiners then recover the metals.' },
    { figs: ['c-cats', 'c-mill'], h: 0.1, cap: 'Old converters, and a mill grinding the ceramic.' },
    { p: 'The ceramic is far richer than any ore. It holds about 2,000 grams of platinum-group metals per tonne, against 2–6 g/t in mined ore, and modern plants recover up to 95% of the metal.' },
    { p: 'The catch is time. A converter comes back only when its car is scrapped, on average about 13 years after the metal went into it. Recycling today reflects car sales from more than a decade ago.' },
  ],
});
