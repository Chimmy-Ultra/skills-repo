// ======================= Chapter 4: how macro reaches metal prices =======================
// Data: FRED (DFII10, T10YIE, DTWEXBGS) quarterly averages 2006Q1–2026Q3; Yahoo GC=F quarterly averages
// (data/fred_quarterly.csv). Studies: Erb & Harvey (2013), Chicago Fed Letter 464 (2021), WGC (May 2022), ECB (June 2025),
// Hanson & Stein (2015), Elder, Miao & Ramchander (2012), CME FedWatch methodology. Dated 2026 events: Reuters, Al Jazeera,
// Bloomberg/BNN, Trading Economics. See sources.md.
const Q_TIPS = '2.09,2.46,2.37,2.32,2.32,2.44,2.45,1.93,1.32,1.48,1.70,2.59,1.79,1.72,1.75,1.38,1.44,1.36,1.06,0.75,1.08,0.80,0.27,0.05,-0.17,-0.35,-0.63,-0.76,-0.59,-0.27,0.56,0.57,0.58,0.43,0.32,0.45,0.27,0.30,0.57,0.66,0.48,0.19,0.08,0.33,0.44,0.44,0.45,0.50,0.68,0.79,0.81,1.06,0.79,0.52,0.15,0.15,-0.06,-0.48,-0.94,-0.92,-0.85,-0.79,-1.02,-1.00,-0.65,0.21,0.68,1.49,1.36,1.37,1.82,2.15,1.87,2.12,1.79,1.97,2.07,2.08,1.88,1.83,1.88,2.05,2.46'.split(',').map(Number);
const Q_BE = '2.49,2.61,2.52,2.31,2.36,2.41,2.29,2.34,2.34,2.40,2.17,0.65,0.95,1.60,1.77,2.09,2.28,2.14,1.73,2.12,2.38,2.40,2.15,2.00,2.21,2.18,2.27,2.47,2.54,2.25,2.15,2.17,2.18,2.19,2.18,1.83,1.70,1.86,1.65,1.53,1.43,1.56,1.48,1.81,2.01,1.82,1.79,1.87,2.08,2.13,2.11,1.98,1.86,1.82,1.64,1.64,1.43,1.17,1.59,1.78,2.19,2.38,2.34,2.53,2.60,2.73,2.42,2.34,2.29,2.23,2.33,2.29,2.29,2.33,2.17,2.30,2.39,2.28,2.38,2.27,2.32,2.37,2.29'.split(',').map(Number);
const Q_GOLD = '572,636,620,641,661,655,708,803,937,875,872,806,927,932,971,1067,1105,1213,1245,1388,1394,1529,1692,1679,1690,1583,1728,1701,1611,1363,1354,1287,1282,1271,1259,1177,1279,1181,1114,1101,1195,1304,1323,1197,1250,1260,1288,1290,1326,1276,1196,1237,1309,1333,1473,1489,1574,1745,1946,1888,1763,1814,1785,1795,1882,1860,1720,1738,1903,1964,1934,2055,2107,2322,2477,2703,2928,3304,3561,4198,4745,4420,4258,3899'.split(',').map(Number);
const Q_USD = '100.22,98.60,98.03,97.55,97.44,94.93,93.17,89.83,88.33,86.81,88.85,99.43,102.31,98.12,94.58,92.12,93.11,94.72,93.63,90.65,89.29,86.94,87.64,91.37,90.70,92.40,92.35,91.04,91.58,92.60,93.69,93.11,94.51,93.83,94.75,99.31,105.47,106.00,109.63,111.47,113.61,110.92,112.05,115.86,116.46,113.90,109.94,110.97,108.00,110.62,113.65,115.70,114.55,115.43,116.47,116.41,117.76,121.83,117.35,113.92,112.36,111.83,113.30,114.97,115.49,118.96,123.53,124.81,120.31,119.40,119.85,121.55,120.64,122.52,122.65,125.78,127.64,122.42,120.24,120.75,119.07,119.30,119.57'.split(',').map(Number);
const QX = [[0, '2006'], [16, '2010'], [32, '2014'], [48, '2018'], [64, '2022'], [80, '2026']];
const pts = (a) => a.map((v, i) => [i, v]);

// a vertical chain of boxes joined by arrows
function chain(steps, { bh = 0.044, gap = 0.024, size = 0.0185 } = {}) {
  return (c, x, y, w) => {
    const bw = w * 0.8, bx = x + (w - bw) / 2;
    steps.forEach((t, i) => {
      const top = y - i * (bh + gap), bot = top - bh;
      c.fill([[bx, top], [bx + bw, top], [bx + bw, bot], [bx, bot]], i === steps.length - 1 ? 'rgba(184,140,58,0.22)' : 'rgba(45,95,115,0.1)');
      c.line([[bx, top], [bx + bw, top], [bx + bw, bot], [bx, bot], [bx, top]], 'rgba(42,33,25,0.6)', 0.0011);
      c.text({ x: x + w / 2, y: top - (bh - size * 1.2) / 2 + 0.002, w: bw - 0.02, size, lh: 1.2, align: 'center', paras: [t], color: INK });
      if (i < steps.length - 1) { const ax = x + w / 2; c.line([[ax, bot - 0.002], [ax, bot - gap + 0.004]], INK, 0.0016); c.fill([[ax - 0.006, bot - gap + 0.01], [ax + 0.006, bot - gap + 0.01], [ax, bot - gap + 0.002]], INK); }
    });
    return steps.length * (bh + gap) - gap;
  };
}

const ch3a = flatSpread({
  key: 'ch3-rates', title: 'Chapter 4: Three interest rates',
  left: [
    { kicker: 'Chapter 4 · How macro reaches metal prices' },
    { h1: 'Three interest rates' },
    { p: 'Chapter 1 showed that gold competes with a safe bond, and that the bond’s return after inflation, the real rate, sets the cost of holding gold. This chapter follows how economic news changes that rate and how the change reaches gold and silver.' },
    { p: 'Three rates belong together. The [[nominal yield]] is what a Treasury bond pays. The [[real yield]] is what an inflation-protected Treasury (TIPS) pays above inflation. The difference between them is the [[breakeven inflation rate]], the average inflation at which the two bonds would pay the same:' },
    { eq: '\\text{breakeven} = i_{nominal} - r_{real}' },
    { p: 'Breakeven is the market’s estimate of future inflation, the π with superscript e from Chapter 1. All three are published every day for the ten-year maturity.' },
  ],
  right: [
    { table: { cols: [0.5, 0.25, 0.25], head: ['10-year, %', 'Aug 2021', '12 Nov 2026'], align: ['l', 'r', 'r'], rows: [
      ['Nominal Treasury', '1.19', '5.10'], ['TIPS real yield', '−1.19', '2.86'], ['Breakeven inflation', '2.38', '2.24']] } },
    { chart: lineChart({ pts: pts(Q_TIPS), n: 84, ymin: -1.5, ymax: 3, ticks: [-1, 0, 1, 2, 3], h: 0.15, xl: QX, zero: true, tone: TONE.blue, fmt: (v) => v.toFixed(0) + '%',
      more: [{ pts: pts(Q_BE), tone: TONE.red, dash: [0.006, 0.004] }], tags: [[70, 2.2, 'TIPS yield', TONE.blue], [2, 2.75, 'breakeven', TONE.red]],
      title: '10-year TIPS yield and breakeven inflation, quarterly average' }) },
    { p: 'In August 2021 the real yield touched −1.19%: a TIPS buyer was paid less than inflation. By October 2026 it reached 2.95%, the highest since 2008. Breakeven barely moved over the same years. Almost all of the rise in nominal yields was a rise in the real yield, which is exactly the part that matters for gold.' },
    { note: 'Source: FRED, series DGS10, DFII10, T10YIE. Breakeven = DGS10 − DFII10.' },
  ],
});

const ch3b = flatSpread({
  key: 'ch3-gold-tips', title: 'Chapter 4: Gold and the real yield',
  left: [
    { h1: 'Gold and the real yield' },
    { chart: lineChart({ pts: pts(Q_GOLD), n: 84, ymin: 0, ymax: 5000, ticks: [1000, 3000, 5000], h: 0.12, xl: QX, marks: [[64, 'Feb 2022']], tone: TONE.gold, fmt: (v) => '$' + fmtN(v), title: 'Gold, US$/oz' }) },
    { chart: lineChart({ pts: pts(Q_TIPS), n: 84, ymin: -1.5, ymax: 3, ticks: [-1, 1, 3], h: 0.1, xl: QX, marks: [[64, '']], zero: true, tone: TONE.blue, fmt: (v) => v + '%', title: '10-year TIPS yield' }) },
    { note: 'Quarterly averages. Gold: front-month futures (Yahoo Finance). TIPS: FRED.' },
    { p: 'Before 2022 the two lines are close to mirror images. From 2006 to 2021 the correlation between the two levels was −0.94 in these quarterly data.' },
  ],
  right: [
    { h2: 'How strong the link was' },
    { p: 'Several studies measured it. Erb and Harvey (2013) found a correlation of −0.82 between the ten-year TIPS yield and the inflation-adjusted gold price from 1997 to 2012. A Chicago Fed study (2021) estimated that a one-percentage-point rise in the long-term real rate lowered the real gold price by about 13%. A regression on the quarterly data above gives a similar number:' },
    { eq: '\\Delta \\ln(\\text{gold}) \\approx -0.14 \\times \\Delta r_{real}', size: 0.025 },
    { p: 'in which Δr is measured in percentage points: one point higher on the real yield, about 14% lower on gold.' },
    { p: 'Erb and Harvey also warned against reading too much into a correlation of levels. Two series that each trend for years will show a large correlation even if neither drives the other. Changes from one quarter to the next are the stricter test, and they still show a clear negative link: −0.63 from 2006 to 2021.' },
  ],
});

const ch3c = flatSpread({
  key: 'ch3-break', title: 'Chapter 4: The break after 2022',
  left: [
    { h1: 'The break after 2022' },
    { p: 'From the end of 2021 to the end of 2023 the ten-year real yield rose by about 3.2 percentage points, from −1.0% to +2.2%. The pre-2022 relationship says gold should have fallen by about a third:' },
    { eq: 'e^{-0.14 \\times 3.15} - 1 \\approx -36\\%', size: 0.025 },
    { p: 'Gold actually rose by about 14%, from $1,795 to $2,055 (quarterly averages). In May 2022 the World Gold Council noted that a model using only the dollar and real rates put gold about 21% below where it was trading.' },
    { table: { cols: [0.5, 0.25, 0.25], head: ['Correlation, gold vs TIPS', '2006–21', '2022–26'], align: ['l', 'r', 'r'], rows: [
      ['Levels', '−0.94', '+0.51'], ['Quarterly changes', '−0.63', '−0.51']] } },
    { note: 'Computed for this book from quarterly averages (gold: Yahoo Finance GC=F; TIPS: FRED DFII10).' },
  ],
  right: [
    { h2: 'What broke and what did not' },
    { p: 'The table separates two things. The link between the levels broke: gold climbed to records while the real yield stayed high. The link between changes held: in a quarter when the real yield rose, gold still tended to fall. The real yield still pushes gold, but something else has been lifting gold underneath that push.' },
    { h2: 'The usual explanation' },
    { p: 'The European Central Bank dates the break to Russia’s full-scale invasion of Ukraine in February 2022 and the freezing of Russia’s reserves. Central banks bought on average 473 tonnes a year from 2010 to 2021 and more than 1,000 tonnes in each of 2022, 2023 and 2024. By the ECB’s count central banks took more than a fifth of global gold demand in 2024, against about a tenth in the 2010s. Their buying does not depend on the real yield, so it lifts gold whatever the bond market does.' },
    { note: 'Sources: WGC (May 2022); ECB, The international role of the euro (June 2025); RBC Wealth Management (June 2025).' },
  ],
});

const ch3d = flatSpread({
  key: 'ch3-dollar', title: 'Chapter 4: The dollar',
  left: [
    { h1: 'The dollar' },
    { p: 'Gold is quoted in US dollars everywhere. When the dollar strengthens, a buyer who pays in euros, yen or rupees needs more of their own currency for each ounce, so demand outside the US falls and the dollar price of gold tends to fall. The same applies to silver.' },
    { chart: lineChart({ pts: pts(Q_USD), n: 84, ymin: 80, ymax: 130, ticks: [90, 110, 130], h: 0.12, xl: QX, tone: TONE.pd, fmt: (v) => fmtN(v), title: 'Broad US dollar index (Jan 2006 = 100), quarterly average' }) },
    { note: 'Source: FRED, DTWEXBGS, a trade-weighted index against a broad set of currencies.' },
    { p: 'The link is weaker than the real-yield link. Quarterly changes in gold and in the broad dollar index had a correlation of about −0.31 from 2006 to 2021 and −0.43 from 2022 to 2026.' },
  ],
  right: [
    { h2: 'Why the two often move together' },
    { p: 'The dollar and the real yield are not independent. A rise in US real yields attracts money into dollar assets, which lifts the dollar. On a day of hawkish US news, gold can be hit through both channels at once.' },
    { p: 'The link can also fail. In 2023 and 2024 gold and the dollar rose together, a pattern CME Group called unusual; the central-bank buying described earlier is the likeliest reason.' },
    { h2: 'A large example' },
    { p: 'On 30 January 2026, the day after gold and silver set their records, the dollar index rose 0.7%. Reuters reported spot gold down 9.5%, its steepest daily fall since 1983, and spot silver down 27.7%. A 0.7% move in the dollar cannot explain falls of that size on its own; most of that day\u2019s move had other causes.' },
    { note: 'Sources: CME Group OpenMarkets (May 2025); Reuters (30 Jan 2026). Correlations computed for this book.' },
  ],
});

const ch3e = flatSpread({
  key: 'ch3-fed', title: 'Chapter 4: Reading the Fed’s next move',
  left: [
    { h1: 'Reading the Fed’s next move' },
    { p: 'Gold reacts to what the Federal Reserve is expected to do, not only to what it has done. By the time the Fed raises its rate, markets have usually priced the move in. Two market numbers show the expected path.' },
    { h2: 'Fed funds futures and FedWatch' },
    { p: 'A 30-day [[fed funds future]] settles on the average effective federal funds rate (EFFR) in its month, and its price is quoted as 100 minus that rate:' },
    { eq: '\\text{implied EFFR} = 100 - \\text{price}', size: 0.026 },
    { p: 'CME’s [[FedWatch]] tool turns these prices into meeting-by-meeting probabilities. It assumes the Fed moves in steps of 0.25 percentage points. For a month that contains a meeting, it backs out the rate before and after the meeting, and then' },
    { eq: 'P(\\text{hike}) = \\frac{EFFR_{end} - EFFR_{start}}{0.25}', size: 0.026 },
    { note: 'Source: CME Group, “Understanding the CME Group FedWatch Tool methodology”.' },
  ],
  right: [
    { h2: 'The two-year Treasury yield' },
    { p: 'The two-year yield is roughly the average policy rate expected over the next two years plus a small premium, so it moves when the expected path of the Fed changes. Hanson and Stein (2015) used it as their measure of policy news and found that a one-point rise in the two-year yield on Fed announcement days came with about a 0.42-point rise in long-term real forward rates. Policy news therefore reaches the real yield that gold competes with.' },
    { h2: 'Where things stood in November 2026' },
    { p: 'The Fed raised its target range by 0.25 points to 3.75–4.00% on 16 September 2026, its first increase since 2023, and held it on 28 October. After the October CPI report, FedWatch showed roughly a 90% chance of another 0.25-point increase in December. The two-year yield was 4.73% on 10 November.' },
    { note: 'Sources: Hanson & Stein, J. Financial Economics (2015); Al Jazeera (16 Sep 2026); Trading Economics (12–13 Nov 2026); FRED DGS2.' },
  ],
});

const ch3f = flatSpread({
  key: 'ch3-data-days', title: 'Chapter 4: Data release days',
  left: [
    { h1: 'Data release days' },
    { table: { cols: [0.48, 0.26, 0.26], size: 0.0192, head: ['Release', 'Agency', 'Time (ET)'], align: ['l', 'l', 'r'], rows: [
      ['Consumer prices (CPI)', 'BLS', '8:30'], ['Producer prices (PPI)', 'BLS', '8:30'], ['Payrolls (Employment Situation)', 'BLS', '8:30'], ['PCE prices', 'BEA', '8:30']] } },
    { p: 'Markets move on the [[surprise]], the gap between the number and what economists expected, not on the number itself. A CPI print of 0.3% is bad news if 0.2% was expected and good news if 0.4% was expected. Researchers measure the surprise in standard units:' },
    { eq: 'S = \\frac{\\text{actual} - \\text{consensus}}{\\sigma(\\text{past surprises})}', size: 0.025 },
    { p: 'Elder, Miao and Ramchander (2012) studied gold, silver and copper futures around 19 US releases from 2002 to 2008. The 8:30 releases mattered most, above all payrolls. Better-than-expected economic news lowered gold and silver and raised copper. Payroll surprises explained about 35% of gold’s move and 23% of silver’s in the five minutes after the release, and the effects faded within about an hour.' },
  ],
  right: [
    { h2: 'The chain on a release day' },
    { chart: chain(['data surprise vs consensus', 'expected Fed path (FedWatch, 2-year yield)', 'real yield and the dollar', 'gold', 'silver: gold’s move × β, plus its own residual']) },
    { p: 'Each link can weaken. A surprise that changes the inflation outlook without changing the Fed outlook may lift breakeven rather than the real yield. A surprise the Fed is expected to ignore may move nothing.' },
    { p: 'In November 2026 the chain ran in the expected direction: October CPI came in at 0.4% against 0.3% expected, odds of a December hike rose, and gold fell more than 2.5% to about $3,870 on 12 November.' },
    { figs: ['watch', 'ticker'], h: 0.09, cap: 'Plate 6. Release days run on the clock.' },
  ],
});

const ch3g = flatSpread({
  key: 'ch3-2026', title: 'Chapter 4: 2026, the year rates turned',
  left: [
    { h1: '2026: the year rates turned' },
    { table: { cols: [0.25, 0.75], size: 0.0185, head: ['Date', 'Event'], align: ['l', 'l'], rows: [
      ['29 Jan', 'Records: spot gold $5,594.82, silver $121.64.'],
      ['30 Jan', 'Kevin Warsh named as next Fed chair; gold −9.5%, silver −27.7%.'],
      ['Jan–Feb', 'CME raises gold and silver margins several times.'],
      ['24 Jun', 'Gold below $4,000; markets price a hike by September.'],
      ['16 Sep', 'Fed raises rates 0.25 points, first hike since 2023.'],
      ['5 Oct', '10-year TIPS yield 2.95%, highest since 2008.'],
      ['30 Oct', 'Gold low of $3,869.85, lowest in a year.']] } },
    { note: 'Sources: Reuters via Kitco and Pakistan Today; Bloomberg via BNN; Al Jazeera; Nation Thailand; FRED.' },
  ],
  right: [
    { h2: 'How much did real rates explain?' },
    { p: 'From its 2026 low of 1.72% on 27 February to 2.95% on 5 October, the ten-year real yield rose by about 1.2 points. The pre-2022 relationship turns that into a fall in gold of about 16%:' },
    { eq: 'e^{-0.14 \\times 1.23} - 1 \\approx -16\\%', size: 0.025 },
    { p: 'Gold fell about 31% from its January record to its October low. Rates explain roughly half of the fall. Much of the rest happened before real yields started to rise, in the January collapse that followed the Warsh nomination and the margin increases.' },
    { p: 'This is the method of the chapter in one example. Ask first what rates and the dollar explain, using numbers. Only what remains needs another explanation, and that explanation needs its own evidence, such as positioning or the physical market.' },
  ],
});
