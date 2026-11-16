// ======================= Chapter 3: how the price is made =======================
// Prices: Barchart futures-prices pages, 16 Nov 2026 (data/curves_2026-11-16.txt). Facts: sources.md, Chapter 3.

// COMEX gold futures, 16 Nov 2026: [months after November 2026, price]
const GC_CURVE = [[1, 3865.4], [3, 3896.8], [5, 3929.5], [7, 3949.4], [9, 3987.7], [11, 4049.0], [13, 4075.0], [15, 4108.3], [17, 4160.3], [19, 4170.6], [25, 4290.4]];
const GC_RATE = (m) => 3865.4 * (1 + 0.0465 * (m - 1) / 12);   // Dec 2026 price grown at the one-year Treasury yield, 4.65%

// two small curves side by side: contango (rising) and backwardation (falling)
function pcShapes({ size = 0.0162 } = {}) {
  return (c, x, y, w) => {
    const pw = w * 0.42, ph = 0.12, gap = w - 2 * pw;
    [['Contango', 'later costs more', 1, TONE.gold], ['Backwardation', 'now costs more', -1, TONE.red]].forEach(([name, sub, dir, col], k) => {
      const x0 = x + k * (pw + gap), top = y - 0.035, base = top - ph;
      c.text({ x: x0 + pw / 2, y: y, w: pw, size: size * 1.1, lh: 1.2, align: 'center', paras: [name], color: INK, weight: 600 });
      c.line([[x0, top], [x0, base], [x0 + pw, base]], 'rgba(42,33,25,0.7)', 0.0013);
      const P = []; for (let i = 0; i <= 12; i++) { const t = i / 12; P.push([x0 + 0.012 + t * (pw - 0.024), base + ph * (dir > 0 ? 0.2 + 0.6 * Math.sqrt(t) : 0.8 - 0.6 * Math.sqrt(t))]); }
      c.line(P, col, 0.0028);
      c.fill([[P[0][0] - 0.005, P[0][1] - 0.005], [P[0][0] + 0.005, P[0][1] - 0.005], [P[0][0] + 0.005, P[0][1] + 0.005], [P[0][0] - 0.005, P[0][1] + 0.005]], INK);
      c.text({ x: P[0][0] + 0.008, y: P[0][1] + (dir > 0 ? -0.007 : size * 1.5 + 0.004), w: 0.1, size: size * 0.92, lh: 1.2, paras: ['spot'], color: INK, italic: true });
      c.text({ x: x0 + pw / 2, y: base - 0.006, w: pw, size: size * 0.92, lh: 1.2, align: 'center', paras: ['delivery date →'], color: '#5a4b3d' });
      c.text({ x: x0 + pw / 2, y: base - 0.006 - size * 1.4, w: pw, size, lh: 1.2, align: 'center', italic: true, paras: [sub], color: col });
    });
    return 0.035 + 0.12 + 0.012 + size * 2.9;
  };
}

const ch3p_a = flatSpread({
  key: 'pc-two', title: 'Chapter 3: One metal, two prices',
  left: [
    { kicker: 'Chapter 3 · How the price is made' },
    { h1: 'One metal, two prices' },
    { p: 'Chapter 2 followed the metal. This chapter follows the price. A news report that says “gold rose $20” is usually quoting one of two markets, and the two work in different ways.' },
    { p: 'In [[London]], banks trade metal directly with each other and with their clients, by phone and on screens, at any hour. Nothing is traded on an exchange. The usual trade is for [[spot]] settlement, two working days later, in unallocated metal held in London vaults. This is called “loco London” metal.' },
    { p: 'In [[New York]], COMEX, part of CME Group, lists [[futures]]: standard contracts for delivery on a fixed future date, traded on one public order book almost 24 hours a day. Funds, dealers and speculators trade there.' },
    { figs: ['n-london', 'n-nyc'], h: 0.1, cap: 'The City of London and Lower Manhattan.' },
  ],
  right: [
    { h2: 'A price set by auction' },
    { p: 'Contracts all over the world need one agreed price per day. LBMA provides it with electronic auctions run by ICE Benchmark Administration:' },
    { table: { cols: [0.4, 0.6], head: ['Metal', 'Auctions, London time'], align: ['l', 'l'], rows: [
      ['Gold', '10:30 and 15:00'], ['Silver', '12:00'], ['Platinum and palladium', '9:45 and 14:00']] } },
    { p: 'The auction runs in rounds of 30 seconds. If buyers want more metal than sellers offer, the price is raised for the next round, and the other way round, until the two sides roughly balance. The final price is published as the LBMA Gold Price, the LBMA Silver Price, and so on.' },
    { fig: 'n-clocks', w: 0.16 },
    { p: 'Most of the time the London price and the New York futures price stay within a few dollars of each other. The rest of this chapter explains why, and what it means when they come apart.' },
  ],
});

const ch3p_b = flatSpread({
  key: 'pc-contract', title: 'Chapter 3: What a futures contract is',
  left: [
    { h1: 'What a futures contract is' },
    { p: 'A futures contract is a promise to buy or sell a fixed amount of metal at a fixed price on a fixed future date. The exchange writes the rules, so every contract of the same kind is identical and can be traded with anyone.' },
    { table: { cols: [0.36, 0.32, 0.32], head: ['', 'Gold (GC)', 'Silver (SI)'], align: ['l', 'r', 'r'], size: 0.0192, rows: [
      ['Size', '100 oz', '5,000 oz'], ['Minimum fineness', '995', '999'], ['Smallest price step', '$0.10', '$0.005'], ['Value of one step', '$10', '$25'], ['Value of one contract, 16 Nov 2026', '$386,540', '$234,975']] } },
    { note: 'Values use the December 2026 prices, $3,865.40 and $46.995 an ounce. COMEX also lists smaller contracts: 10-oz gold (MGC) and 1,000-oz silver (SIL).' },
    { fig: 'n-contract', w: 0.13 },
  ],
  right: [
    { h2: 'Margin and daily settlement' },
    { p: 'Neither side pays the full value when the trade is made. Each puts up a deposit called [[margin]], a few percent of the contract’s value, which the exchange sets and changes often.' },
    { p: 'Every evening the exchange sets a settlement price, and money moves between the two sides according to that day’s change. Suppose a trader buys one gold contract at $3,865.40 and margin is $22,000, about 6% of the value:' },
    { table: { cols: [0.25, 0.3, 0.45], head: ['Day', 'Settlement', 'Cash to the buyer'], align: ['l', 'r', 'r'], rows: [
      ['1', '$3,845.40', '−$20 × 100 = −$2,000'], ['2', '$3,875.40', '+$30 × 100 = +$3,000']] } },
    { p: 'Losses are paid every day, so a losing position cannot grow unpaid. A $220 fall, under 6%, would use up the whole $22,000 deposit, which is why futures traders are asked for more margin quickly when prices move fast.' },
    { figs: ['n-ledger', 'n-balance'], h: 0.085 },
  ],
});

const ch3p_c = flatSpread({
  key: 'pc-roll', title: 'Chapter 3: Rolling and delivery',
  left: [
    { h1: 'Rolling and delivery' },
    { p: 'Gold futures are listed for many months ahead, but trading gathers in a few of them. On 16 November 2026 almost all open contracts were in December, February, April and June:' },
    { chart: vbars([
      { x: 'Nov', v: 0.07 }, { x: 'Dec', v: 213.5, show: true }, { x: 'Jan', v: 1.3 }, { x: 'Feb', v: 128.7, show: true }, { x: 'Apr', v: 24.5, show: true }, { x: 'Jun', v: 21.4, show: true }, { x: 'Aug', v: 4.6 }, { x: 'Oct', v: 2.0 }, { x: 'Dec 27', v: 4.2 }],
      { h: 0.15, max: 220, ticks: [100, 200], fmt: (v) => fmtN(v, v < 10 ? 1 : 0) }) },
    { note: 'Open interest in COMEX gold futures by delivery month, thousand contracts, 16 Nov 2026. Source: Barchart.' },
    { p: 'A trader who wants to keep a position without taking delivery sells the December contract and buys February in one trade. This is called [[rolling]]. On 16 November February cost $31.40 more than December, so a buyer who rolls pays about 0.8% for two more months. The next pages explain where that gap comes from.' },
  ],
  right: [
    { h2: 'If nobody rolls' },
    { p: 'The [[first notice day]] is the last business day of the month before delivery; for December 2026 it was Monday 30 November. From that day a seller may announce that it will deliver. The exchange then matches the notice to a buyer who still holds the contract.' },
    { p: 'Delivery itself is paperwork. As Chapter 2 showed, the seller hands over warrants for bars already sitting in a COMEX vault, and the buyer pays the settlement price. The bars do not move. Trading in the December contract ends on the third-last business day of December.' },
    { figs: ['n-calendar', 'n-hourglass'], h: 0.1 },
    { p: 'Most futures traders never deliver or receive. The delivery right still matters: it is what ties the futures price to real metal.' },
  ],
});

const ch3p_d = flatSpread({
  key: 'pc-carry', title: 'Chapter 3: Why later costs more',
  left: [
    { h1: 'Why later costs more' },
    { p: 'Imagine a dealer is asked for a price to deliver gold in one year. The dealer can buy gold today at the spot price S, store it, and deliver it in a year. To do that, the dealer borrows the money at interest rate r. A fair futures price F must repay that cost:' },
    { eq: 'F \\approx S\\,(1 + r\\,t)' },
    { p: 'where t is the time to delivery in years. This is the [[cost of carry]]: futures cost more than spot by the interest on the money tied up. Storage and insurance add a little; for gold they are small.' },
    { p: 'If the futures price were higher, dealers would buy spot and sell futures until the gap closed. If it were lower, holders of gold would sell spot and buy futures. Either trade pulls F back towards the formula.' },
    { figs: ['n-strongbox', 'n-teller'], h: 0.1 },
  ],
  right: [
    { h2: 'The real curve' },
    { chart: lineChart({ pts: GC_CURVE, n: 26, ymin: 3800, ymax: 4350, ticks: [3800, 4000, 4200], h: 0.17, xl: [[1, 'Dec 26'], [7, 'Jun 27'], [13, 'Dec 27'], [19, 'Jun 28'], [25, 'Dec 28']], tone: TONE.gold, fmt: (v) => '$' + fmtN(v),
      title: 'COMEX gold futures by delivery month, 16 Nov 2026, US$/oz', more: [{ pts: [[1, GC_RATE(1)], [25, GC_RATE(25)]], tone: TONE.blue, dash: [0.007, 0.005] }], tags: [[17, GC_RATE(17) - 95, 'grown at 4.65% a year', TONE.blue]] }) },
    { p: 'The December 2027 contract cost 5.4% more than December 2026, and December 2028 another 5.3% more. That is close to the dollar interest rate: a one-year Treasury bill paid 4.65% that week. The dashed line shows December’s price grown at that rate.' },
    { p: 'This is what a calm market looks like. Each later month costs a little more, by about the interest a holder of gold gives up.' },
    { fig: 'n-barsrow', w: 0.36 },
  ],
});

const ch3p_e = flatSpread({
  key: 'pc-lease', title: 'Chapter 3: Borrowing metal',
  left: [
    { h1: 'Borrowing metal' },
    { p: 'Metal can be lent like money. A bank or another large holder lends bars for a period, and the borrower returns the same amount of metal later, plus a fee. The fee, quoted as a yearly percentage of the metal’s value, is the [[lease rate]].' },
    { p: 'Who borrows? A jeweller or a refiner needs metal to work with every day. Borrowing it costs less than buying it, and the borrowed metal is returned from future sales. A trader who has sold metal it does not own also borrows, to make delivery.' },
    { figs: ['n-lend', 'n-jeweller'], h: 0.12, cap: 'A bank lends a bar; a jeweller works with borrowed metal.' },
  ],
  right: [
    { h2: 'Lease rates and the curve' },
    { p: 'A holder of metal who lends it earns the lease rate l. That return lowers the cost of holding metal, so the carry formula becomes' },
    { eq: 'F \\approx S\\,\\bigl(1 + (r - l)\\,t\\bigr)' },
    { p: 'Turned around, the curve tells you the lease rate the market is charging:' },
    { eq: 'l \\approx r - \\frac{F/S - 1}{t}' },
    { p: 'Until January 2015 the LBMA published the gold and silver forward rates needed for this sum. Since then lease rates have been worked out from futures and forward prices, or quoted by dealers.' },
    { p: 'Normally the lease rate is small. One-month silver in London usually costs around 0.35% a year. It jumps when metal is hard to find, because borrowers must pay whatever lenders ask.' },
    { fig: 'n-phonedesk', w: 0.17 },
  ],
});

const ch3p_f = flatSpread({
  key: 'pc-backwardation', title: 'Chapter 3: Backwardation',
  left: [
    { h1: 'When now costs more' },
    { p: 'Usually the curve rises: [[contango]]. Sometimes the nearest delivery costs more than later ones. This is [[backwardation]], and in precious metals it is rare.' },
    { chart: pcShapes() },
    { p: 'The formula on the previous page shows when it happens. If the lease rate l rises above the interest rate r, then r − l turns negative and the futures price falls below spot. In other words, metal for delivery today has become so scarce that people pay extra to get it now rather than later.' },
    { fig: 'n-crowbar', w: 0.17 },
  ],
  right: [
    { h2: 'Why it rarely lasts' },
    { p: 'Backwardation offers anyone who owns metal an easy profit: sell it today at the high spot price, buy it back for later delivery at the lower futures price, and keep the difference. As holders do this, more metal reaches the spot market and the gap closes.' },
    { p: 'So backwardation survives only while the metal cannot get to where it is needed: when it is locked in funds, sitting in the wrong city, or stuck in transit. That makes the curve a useful alarm. A rising curve says supply is fine. A curve that bends down at the front says someone is short of metal right now.' },
    { figs: ['n-thermo', 'n-binoculars'], h: 0.1 },
    { p: 'Chapter 4 is a full example: London silver in October 2025.' },
  ],
});

const ch3p_g = flatSpread({
  key: 'pc-efp', title: 'Chapter 3: The bridge between London and New York',
  left: [
    { h1: 'The bridge: EFP' },
    { p: 'Banks often hold metal in London and futures in New York at the same time. They swap one for the other with an [[exchange for physical]], or EFP: a private trade in which one side gives up a COMEX futures position and the other gives up an equal amount of London metal. The price of the swap is quoted as a gap in dollars per ounce.' },
    { p: 'The gap should cover only the cost of carry to the futures date plus the cost of turning London metal into New York metal: flights, insurance, recasting 400-oz bars into 100-oz bars or kilobars, and vault fees. In normal times that is about $1.50 an ounce for gold.' },
    { fig: 'n-swap', w: 0.17 },
    { fig: 'n-plane', w: 0.3 },
  ],
  right: [
    { h2: 'When the bridge breaks' },
    { p: 'In March 2020 the pandemic closed Swiss refineries and grounded most passenger flights, which normally carry gold in their holds. New York futures traded more than $70 above London spot, the widest gap in four decades. Banks that were short New York futures against London metal could not move bars fast enough to close it.' },
    { chart: hbars([{ label: 'Normal', v: 1.5, tone: TONE.blue }, { label: 'March 2020', v: 70, tone: TONE.red }], { max: 75, fmt: (v) => '$' + v, labelW: 0.3 }) },
    { note: 'New York gold futures minus London spot, US$/oz. Sources: SBMA; Bloomberg via Mining Weekly.' },
    { p: 'Early 2025 repeated the story for a different reason, the fear of US tariffs (Chapter 2). Each time the gap closed only when enough metal had been physically moved.' },
    { fig: 'n-crates', w: 0.24 },
  ],
});

const ch3p_h = flatSpread({
  key: 'pc-read', title: 'Chapter 3: Reading a futures curve',
  left: [
    { h1: 'Reading a futures curve' },
    { p: 'Put the pieces together and a quote screen of futures prices becomes a picture of the physical market. Three questions are enough.' },
    { p: '[[1. Which way does it slope?]] Rising by about the interest rate is normal. Rising much less than the interest rate means lease rates are high and metal is getting tight. Falling at the front is backwardation: a shortage now.' },
    { p: '[[2. Where are the contracts?]] Prices of months with almost no open interest are only estimates. Read the slope from the active months.' },
    { p: '[[3. Does it agree with London?]] Compare the nearest futures with London spot. A gap of more than a few dollars for gold, or more than a few cents for silver, means metal is not moving freely between the two cities.' },
    { figs: ['n-chart', 'n-adder'], h: 0.1 },
  ],
  right: [
    { h2: 'Silver, 16 November 2026' },
    { table: { cols: [0.34, 0.33, 0.33], head: ['Contract', 'Price, $/oz', 'Open interest'], align: ['l', 'r', 'r'], rows: [
      ['Dec 2026', '46.995', '57,852'], ['Mar 2027', '47.505', '47,690'], ['May 2027', '48.110', '6,907'], ['Jul 2027', '48.250', '6,315'], ['Dec 2027', '49.500', '849']] } },
    { p: 'The curve rises 5.3% from December 2026 to December 2027, about as much as gold’s. Open interest sits in December and March. So in November 2026 the silver curve showed a calm market with no sign of the squeeze that had broken it a year earlier.' },
    { p: 'The next chapter shows what the same tools looked like when it did break.' },
    { fig: 'n-ticker', w: 0.16 },
  ],
});
