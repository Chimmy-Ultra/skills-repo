// ======================= Chapter 1, part 2: silver =======================
// Numbers: Silver Institute / Metals Focus, World Silver Survey 2026 (2025 data); WGC "Gold the safe haven versus
// silver the wildcard" (Mar 2026); LBMA vault data; LBMA Alchemist 99; quarterly ratio from Yahoo GC=F / SI=F.
const GSR_Q = '54,52,52,48,48,51,55,56,52,53,60,78,74,67,64,65,66,65,63,50,42,37,45,53,50,57,52,53,55,62,63,62,64,67,67,75,74,73,76,75,80,72,68,72,68,74,76,77,80,79,82,85,84,90,85,85,92,101,77,76,68,68,75,77,79,86,91,81,85,83,81,84,90,81,86,85,90,101,87,72,61,64,69,79'.split(',').map(Number);

const ch1f = flatSpread({
  key: 'ch1-silver-demand', title: 'Chapter 1: Silver, half industrial',
  left: [
    { kicker: 'Silver' },
    { h1: 'Half industrial, half money' },
    { p: 'Silver’s price answers to two sets of variables. One set is the same as gold’s: real rates and the dollar. The other is the industrial economy. Silver’s market is also small, so both sets of forces move it further than they move gold.' },
    { p: 'In 2025 silver demand totalled 1,131 million ounces (Moz). Industrial uses took 657 Moz, about 58%.' },
    { chart: hbars([
      { label: 'Electrical & electronics', v: 262.9, tone: TONE.blue }, { label: 'Bars & coins', v: 217.7, tone: TONE.silver },
      { label: 'Jewellery', v: 189.3, tone: TONE.silver }, { label: 'Solar panels (PV)', v: 186.6, tone: TONE.blue },
      { label: 'Other industrial', v: 157.4, tone: TONE.blue }, { label: 'Brazing alloys', v: 50.5, tone: TONE.blue },
      { label: 'Silverware', v: 42.1, tone: TONE.silver }, { label: 'Photography', v: 24.2, tone: TONE.silver }],
      { labelW: 0.42, barH: 0.019, gap: 0.009, size: 0.0172, fmt: (v) => fmtN(v) + ' Moz' }) },
    { note: 'Silver demand in 2025. Blue: industrial uses. ETP inflows of 68.3 Moz are not counted in total demand. Source: World Silver Survey 2026.' },
  ],
  right: [
    { figs: ['pcb', 'pv', 'retort', 'coins', 'teapot'], h: 0.05, cap: 'Plate 3. Where silver goes.' },
    { p: 'The largest single use is electrical and electronics outside solar: conductors, switches, car electronics and data-centre equipment. Silver conducts electricity and heat better than any other metal, so a small amount goes into almost every circuit. “Other industrial” includes the silver catalyst used to make ethylene oxide, a basic chemical.' },
    { h2: 'Solar panels use less silver each year' },
    { p: 'Solar panels became a large source of demand in the early 2020s, but manufacturers keep cutting the silver in each cell, a process called [[thrifting]]:' },
    { table: { cols: [0.55, 0.45], head: ['Year', 'Silver used in PV'], align: ['l', 'r'], rows: [['2024', '198 Moz'], ['2025', '187 Moz'], ['2026 (forecast)', '151 Moz']] } },
    { p: 'Solar installations can keep growing while silver use in solar falls, so the number of panels installed is not a reliable guide to silver demand.' },
  ],
});

const ch1g = flatSpread({
  key: 'ch1-silver-supply', title: 'Chapter 1: Where silver comes from',
  left: [
    { h1: 'Where silver comes from' },
    { p: 'Only about a quarter of mined silver comes from mines that exist for silver. The rest is a [[by-product]]: it comes out of the ground with lead, zinc, copper or gold.' },
    { chart: hbars([
      { label: 'Lead / zinc mines', v: 29.4, tone: TONE.grey }, { label: 'Copper mines', v: 28.0, tone: TONE.grey },
      { label: 'Primary silver mines', v: 26.1, tone: TONE.silver }, { label: 'Gold mines', v: 15.9, tone: TONE.gold }],
      { labelW: 0.4, fmt: (v) => v.toFixed(1) + '%' }) },
    { note: 'Share of 2025 silver mine output by the mine’s main metal. Source: World Silver Survey 2026.' },
    { p: 'A copper miner decides how much to produce by looking at the copper price, not the silver price. So when silver rises, mine output barely responds. Mine production was 846.6 Moz in 2025 and is forecast at 844.1 Moz in 2026.' },
  ],
  right: [
    { h2: 'Five years of deficit' },
    { table: { cols: [0.6, 0.4], head: ['Silver balance, 2025', 'Moz'], align: ['l', 'r'], rows: [
      ['Mine production', '846.6'], ['Recycling', '197.6'], ['Other supply', '46.2'], ['Total supply', '1,090.4'], ['Total demand', '1,130.6'], ['Deficit', '−40.3']] } },
    { p: 'Demand has exceeded supply every year since 2021, and 2026 is forecast to be the sixth deficit year. The shortfall is met from existing stocks; the six years together, including the 2026 forecast, add up to about 762 Moz. When stocks that can actually be delivered run low, the price can jump, as it did in London in October 2025.' },
    { p: 'London vaults held 28,889 tonnes of silver at the end of October 2026, but most of it belongs to exchange-traded products and is not for sale. In September 2025 the metal free to trade in London was estimated at only about 136 Moz.' },
    { fig: 'crucible', w: 0.15 },
  ],
});

const ch1h = flatSpread({
  key: 'ch1-silver-behaviour', title: 'Chapter 1: How silver behaves',
  left: [
    { h1: 'How silver behaves' },
    { h2: 'A smaller market' },
    { p: 'Goldman Sachs estimates the silver market at about one-ninth the size of gold’s. Trading volumes show the same picture:' },
    { table: { cols: [0.46, 0.27, 0.27], head: ['Average daily volume', 'Gold', 'Silver'], align: ['l', 'r', 'r'], rows: [
      ['London OTC market', '$97 bn', '$13 bn'], ['COMEX futures', '$55 bn', '$11 bn'], ['Bid–ask spread', '2 bp', '9 bp']] } },
    { note: 'Five-year averages. Source: WGC, “Gold the safe haven versus silver the wildcard”, March 2026.' },
    { p: 'The same amount of money entering both markets is a much larger share of silver’s market, so it usually moves silver’s price further. Silver also has no central bank buying on dips, and speculators make up a bigger share of its holders.' },
    { p: 'In data, silver’s daily moves are typically 2 to 2.5 times the size of gold’s, and their daily returns have a correlation of about 0.8.' },
    { note: 'Volatility: StoneX. Correlation: CME Group, rolling one-year correlation of daily returns since 2004.' },
  ],
  right: [
    { h2: 'The gold/silver ratio' },
    { chart: lineChart({ pts: GSR_Q.map((v, i) => [i, v]), n: GSR_Q.length, ymin: 30, ymax: 110, ticks: [40, 60, 80, 100], h: 0.15,
      xl: [[0, '2006'], [20, '2011'], [40, '2016'], [56, '2020'], [76, '2025']], marks: [[56, 'Mar 2020']], tone: TONE.pd,
      title: 'Gold price ÷ silver price, quarterly average' }) },
    { p: 'The ratio counts how many ounces of silver buy one ounce of gold. In a crisis silver’s industrial half takes over: in March 2020 silver fell with industrial commodities while gold held, and the ratio set a record above 123 on 19 March (daily; the quarterly average in the chart is lower). The ratio fell to about 16 in 1980 and 31 in April 2011, when speculative buying pushed silver up faster than gold. In April 2025 the ratio was 107; by December 2025 it was below 55; in mid-November 2026 it is about 79.' },
    { note: 'Ratio records: LBMA Alchemist 99; World Silver Survey 2026. Chart: Yahoo Finance front-month futures.' },
  ],
});
