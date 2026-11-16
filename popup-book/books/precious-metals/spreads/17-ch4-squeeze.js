// ======================= Chapter 4: the 2025 London silver squeeze =======================
// Facts: sources.md, Chapter 4. Prices: Yahoo Finance SI=F daily closes (data/si_daily_2025.txt).

const SI_25 = [36.79,37.19,37.69,37.77,38.16,38.42,37.66,37.9,38.5,37.98,37.89,37.95,37.26,37.71,38.03,39.0,38.68,38.58,38.69,39.19,40.2,41.07,41.54,40.91,41.07,41.43,40.88,41.13,41.7,42.39,42.52,42.47,41.72,41.71,42.54,43.8,44.19,43.78,44.7,46.22,46.61,46.25,47.29,46.0,47.6,48.08,47.18,48.66,46.85,46.94,50.13,50.31,51.07,53.02,49.86,51.12,47.45,47.46,48.48,48.38,46.56,47.13,47.72,48.43,47.99,47.89,47.13,47.86,47.79,48.02,50.18,50.62,53.33,53.07,50.59,50.63,50.45,50.79,50.25,49.87,50.29,50.93,52.92,56.45,58.42];   // COMEX silver front month, daily close, 1 Aug - 1 Dec 2025 (Yahoo SI=F)

// stacked horizontal bars, committed vs free: rows [{ label, total, free }] (free in %)
function sqFloat(rows, { size = 0.0168, barH = 0.032, gap = 0.026, labelW = 0.24 } = {}) {
  return (c, x, y, w) => {
    const x0 = x + labelW * w, bw = w * (1 - labelW) - 0.01;
    rows.forEach((r, i) => {
      const top = y - i * (barH + gap) - 0.004, bot = top - barH, xf = x0 + bw * (1 - r.free / 100);
      c.text({ x: x0 - 0.01, y: top - (barH - size * 1.2) / 2 + 0.002, w: labelW * w, size, lh: 1.15, align: 'right', paras: [r.label], color: INK });
      c.fill([[x0, top], [xf, top], [xf, bot], [x0, bot]], TONE.grey);
      c.fill([[xf, top], [x0 + bw, top], [x0 + bw, bot], [xf, bot]], TONE.silver);
      c.line([[xf, top + 0.004], [xf, bot - 0.004]], INK, 0.0012);
      c.text({ x: (x0 + xf) / 2, y: top - (barH - size * 1.2) / 2 + 0.002, w: xf - x0, size, lh: 1.15, align: 'center', paras: [r.held], color: INK });
      c.text({ x: (xf + x0 + bw) / 2, y: top - (barH - size * 1.2) / 2 + 0.002, w: x0 + bw - xf + 0.04, size, lh: 1.15, align: 'center', paras: [r.free + '%'], color: INK, weight: 600 });
    });
    return rows.length * (barH + gap);
  };
}

const ch4s_a = flatSpread({
  key: 'sq-setting', title: 'Chapter 4: A full vault with little to spare',
  left: [
    { kicker: 'Chapter 4 · The 2025 London silver squeeze' },
    { h1: 'A full vault with little to spare' },
    { p: 'In October 2025 the London silver market nearly stopped working. Silver set a record, borrowing it cost more than in any normal year, and London traded far above New York. This chapter follows the event step by step with the tools of Chapter 3.' },
    { p: 'It began with a puzzle. London’s vaults held hundreds of millions of ounces of silver, yet traders could not find metal to deliver. The answer is that most of the silver in London was spoken for.' },
    { figs: ['n-warehouse', 'n-emptyvault'], h: 0.12, cap: 'A full warehouse, and the empty shelves traders saw.' },
  ],
  right: [
    { h2: 'The free float' },
    { p: 'A large share of London silver backs exchange-traded products, or ETPs: funds whose shares stand for bars held in a vault. That metal belongs to the funds’ investors and stays allocated to them, so it is not available for lending or for settling trades. What is left is the [[free float]], the silver the market can actually use.' },
    { chart: sqFloat([{ label: 'end-Sept 2025', held: 'ETPs and other holders', free: 17 }, { label: 'end-March 2026', held: 'ETPs and other holders', free: 28 }]) },
    { note: 'Share of silver in London vaults that was free to support trading. Source: World Silver Survey 2026 (Metals Focus).' },
    { p: 'At the end of September 2025 the free float was about 136 million ounces, roughly 4,200 tonnes. That sounds like a lot, but it was less than one-third of an average day’s trading turnover in London. The market had almost no buffer.' },
  ],
});

const ch4s_b = flatSpread({
  key: 'sq-tariffs', title: 'Chapter 4: Step 1, the metal leaves',
  left: [
    { h1: 'Step 1: the metal leaves' },
    { p: 'The first drain came from the United States. From late 2024, traders feared that the US would put tariffs on imported silver, the same fear that moved gold in Chapter 2. A tariff would raise the price of silver inside the US, so New York futures traded above London, and the EFP gap opened.' },
    { p: 'The trade that closes such a gap is simple: buy silver in London, ship it to New York, and deliver it into a COMEX vault. Between December 2024 and early October 2025 about 225 million ounces moved from London into CME vaults, roughly 7,000 tonnes.' },
    { figs: ['n-pallet', 'n-crane'], h: 0.12, cap: 'Silver is bulky: a 1,000-oz bar weighs about 31 kg, and most of it crosses the Atlantic by ship.' },
  ],
  right: [
    { h2: 'Why it mattered later' },
    { p: 'Each shipment made sense on its own. Together they moved London’s spare silver to a vault on the other side of the Atlantic, where it sat in warehouses as eligible or registered COMEX metal.' },
    { p: 'At the same time, investors kept buying silver ETPs, and each new share needs bars locked away in the fund’s vault. The silver market had also been in deficit for several years: demand larger than mine supply and recycling, met by drawing down stocks.' },
    { p: 'By September 2025 these three forces had shrunk London’s free float to a record low. The market was now in a state where one extra buyer could break it.' },
    { fig: 'n-sack', w: 0.1 },
  ],
});

const ch4s_c = flatSpread({
  key: 'sq-india', title: 'Chapter 4: Step 2, India buys',
  left: [
    { h1: 'Step 2: India buys' },
    { p: 'The extra buyer was India. With gold at record prices, many Indian buyers turned to silver instead. Demand peaked before the Diwali festival season in October, when buying precious metal is a tradition, and social media campaigns urged people to choose silver over gold.' },
    { fig: 'n-diwali', w: 0.25, cap: 'Festival buying in an Indian silver market.' },
    { p: 'That demand reached London, the world’s main wholesale market for silver, at the moment London had the least to give.' },
  ],
  right: [
    { h2: 'Signs of strain' },
    { p: 'The shortage showed up in India first. India’s largest precious-metals refiner said that, for the first time, it had run out of silver. Kotak Mahindra Asset Management stopped taking new money into its silver fund-of-funds from 10 October 2025, citing a shortage of physical silver in India and a sharp rise in premiums.' },
    { figs: ['n-shopwindow', 'n-scrapheap'], h: 0.1 },
    { p: 'When buyers in one country pay a premium for metal, dealers everywhere try to send them some. That pulled even more silver out of London, at the very moment London had least.' },
  ],
});

const ch4s_d = flatSpread({
  key: 'sq-break', title: 'Chapter 4: 9 October 2025',
  left: [
    { h1: '9 October 2025' },
    { p: 'On 9 October London spot silver rose above $50 and touched $51.22, its first move above the January 1980 peak. The record was not the strangest number that day.' },
    { table: { cols: [0.46, 0.24, 0.3], head: ['', 'Normal', '9 Oct 2025'], align: ['l', 'r', 'r'], rows: [
      ['London spot over New York futures', 'a few cents', 'over $2.50'], ['One-month lease rate, a year', 'about 0.35%', '39%'], ['Overnight borrowing, a year', '', 'over 100%']] } },
    { p: 'Every number in the table is a Chapter 3 alarm. London cost more than New York, so the curve was in backwardation. Lease rates had risen to more than a hundred times their normal level. In New York, futures lagged far behind London spot.' },
    { fig: 'n-panicdesk', w: 0.2 },
  ],
  right: [
    { chart: lineChart({ pts: SI_25.map((v, i) => [i, v]), n: SI_25.length, ymin: 35, ymax: 60, ticks: [40, 50, 60], h: 0.19, tone: TONE.pd,
      xl: [[0, 'Aug'], [21, 'Sep'], [42, 'Oct'], [65, 'Nov'], [84, 'Dec']], marks: [[48, '9 Oct'], [56, '']], fmt: (v) => '$' + v,
      title: 'COMEX silver, front month, daily close, 2025, US$/oz', tags: [[57, 43.2, '21 Oct', TONE.red]] }) },
    { note: 'Source: Yahoo Finance (SI=F). London spot traded above these New York prices through mid-October.' },
    { p: 'New York shows the same story with a delay. The COMEX front month rose from $41 at the start of September to a close of $53.02 on 16 October, then fell 10.5% in three trading days to $47.45 on 21 October.' },
    { p: 'A move of 10% in three days is large even for silver. It came as the shortage in London began to ease, which the next pages explain.' },
  ],
});

const ch4s_e = flatSpread({
  key: 'sq-trap', title: 'Chapter 4: Why the shorts were trapped',
  left: [
    { h1: 'Why the shorts were trapped' },
    { p: 'Many London traders are short silver as part of normal business: a dealer sells metal to a client for later delivery and plans to borrow it or buy it nearer the date. In a market with plenty of free float that is safe. In October 2025 the time to deliver arrived and the metal was not there.' },
    { p: 'A short who must deliver has three choices. All three became expensive at once.' },
    { p: '[[Borrow it.]] At a 39% lease rate, borrowing one ounce of $51 silver for a month costs' },
    { eq: '\\$51 \\times 0.39 \\times \\tfrac{1}{12} \\approx \\$1.66', size: 0.024 },
    { p: 'about 3% of the metal’s value in a single month. Overnight borrowing at over 100% a year was worse.' },
    { fig: 'v-warrant', w: 0.15 },
  ],
  right: [
    { p: '[[Buy it back.]] Shorts who give up and buy silver in London push the spot price higher, which makes the remaining shorts’ losses bigger and pushes more of them to buy. This is the [[squeeze]].' },
    { p: '[[Bring it in.]] The silver existed, mostly in New York. But moving it takes days or weeks, and a short who must deliver now cannot wait.' },
    { figs: ['n-tug', 'n-balloon'], h: 0.1, cap: 'A tug-of-war over too little metal; a price straining at its ropes.' },
    { p: 'This is why a squeeze shows up first in lease rates and spreads rather than in the headline price. Spot silver rose by roughly a tenth in the first nine days of October; the cost of borrowing it for a month rose more than a hundredfold.' },
  ],
});

const ch4s_f = flatSpread({
  key: 'sq-fix', title: 'Chapter 4: The fix',
  left: [
    { h1: 'The fix: move the metal' },
    { p: 'High lease rates and a London premium of $2.50 an ounce paid anyone who could deliver silver to London quickly. Traders booked cargo space on transatlantic flights, an expensive way to move a metal this heavy, and loaded ships. One logistics executive said traders were trying to move 15 to 30 million ounces from New York’s COMEX vaults to London.' },
    { figs: ['n-plane', 'n-crane'], h: 0.11, cap: 'Silver came back by air and by sea.' },
    { p: 'By about 20 October shipments from the United States and China had started to arrive in London. The London premium over New York narrowed and the cost of borrowing silver came down.' },
  ],
  right: [
    { h2: 'Afterwards' },
    { p: 'The acute shortage lasted a few weeks. By March 2026, 28% of the silver in London vaults was again free to support trading, up from 17% in September 2025.' },
    { p: 'The price did not calm down with it. Silver kept rising into early 2026 and traded above $120 an ounce at the end of January, then fell back. By mid-November 2026 it was near $47.' },
    { fig: 'n-teller', w: 0.17 },
    { p: 'The squeeze was not caused by silver being used up. It was caused by silver being in the wrong place, owned by the wrong people, at the wrong moment.' },
  ],
});

const ch4s_g = flatSpread({
  key: 'sq-watch', title: 'Chapter 4: What to watch next time',
  left: [
    { h1: 'What to watch next time' },
    { p: 'A squeeze builds for months before the day it breaks, and the warnings are public. Three numbers carry most of the signal:' },
    { table: { cols: [0.36, 0.3, 0.34], head: ['Signal', 'Normal', 'Warning'], align: ['l', 'l', 'l'], size: 0.0185, rows: [
      ['London free float', 'large and steady', 'falling for months'], ['Lease rate', 'under 1% a year', 'rising; 1-month above 1-year'], ['London minus New York', 'a few cents', 'London above New York']] } },
    { p: 'The free float comes from LBMA vault data and ETP holdings. Lease rates and the London–New York gap come from dealers and from the futures curve. Chapter 5 shows where each number is published.' },
    { figs: ['n-binoculars', 'n-vane'], h: 0.1 },
  ],
  right: [
    { h2: 'Two squeezes, 45 years apart' },
    { p: 'Chapter 8 tells the story of 1980, when the Hunt brothers bought huge amounts of silver and silver futures until the exchange changed its rules. That squeeze had owners: two brothers with a plan.' },
    { p: 'The 2025 squeeze had none. Tariff fears moved metal west, investors locked bars in funds, India bought for a festival, and several years of deficits had already used up the spare. Each step was reasonable on its own. Together they emptied the one market that needed the metal most.' },
    { fig: 'n-newsboy', w: 0.13 },
    { p: 'That is the lesson of this chapter: read the plumbing, not only the price.' },
  ],
});
