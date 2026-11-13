// ======================= Chapter 1, part 1: what the metals are, and gold =======================
// Numbers: WGC Gold Demand Trends FY2025 (Table 1), WGC Central Bank Gold Reserves Survey 2026, WGC Q3 2026,
// World Silver Survey 2026, SFA/IPA palladium fact sheet 2026, USGS MCS 2026, Bank of England, LBMA. See sources.md.

const ch1a = flatSpread({
  key: 'ch1-three', title: 'Chapter 1: Three metals, three markets',
  left: [
    { kicker: 'Chapter 1 · What each metal trades on' },
    { h1: 'Three metals, three markets' },
    { p: 'Gold, silver and palladium are all called precious metals, and on a quiet day their prices often move in the same direction. On a busy day they can split three ways. The reason is that the three metals have different buyers and different sources of supply, so different variables push their prices.' },
    { p: 'This chapter takes the three metals one at a time. For each metal it asks three questions: who buys it, where new metal comes from, and which variables move its price.' },
    { figs: ['bar-gold', 'bar-silver', 'bar-pd'], h: 0.07, cap: 'Plate 1. Gold, silver and palladium bars.' },
    { h2: 'What makes a metal precious' },
    { p: 'A [[precious metal]] is rare, chemically stable and worth a lot per unit of weight. Gold does not tarnish at all. Silver does not rust; its surface only darkens as it reacts with sulphur compounds in the air. Palladium belongs to the [[platinum group metals]], which resist corrosion even at high temperature.' },
  ],
  right: [
    { h2: 'How rare they are' },
    { p: 'Annual mine output shows how scarce each metal is. Copper, an ordinary industrial metal, is listed for comparison.' },
    { table: { cols: [0.4, 0.3, 0.3], head: ['Metal', 'Mine output', 'Year'], align: ['l', 'r', 'r'], rows: [
      ['Copper', '\u2248 23,000,000 t', '2025'], ['Silver', '\u2248 26,300 t', '2025'], ['Gold', '3,672 t', '2025'], ['Palladium', '\u2248 197 t', '2025']] } },
    { p: 'Silver is mined at about seven times the tonnage of gold, yet the whole world\u2019s silver output is roughly a thousandth of copper\u2019s. Palladium is rarer than gold by a factor of almost twenty.' },
    { p: 'Scarcity alone does not decide how a metal trades. Gold and silver have served as money for thousands of years, and central banks still hold gold as a reserve asset. Palladium has never been money, and no central bank holds it. The rest of the chapter shows how these histories split the three markets apart.' },
    { note: 'Sources: World Silver Survey 2026 (846.6 Moz \u00d7 31.1 g/oz), WGC, SFA (Oxford) for IPA, USGS 2026.' },
  ],
});

const ch1b = flatSpread({
  key: 'ch1-gold-demand', title: 'Chapter 1: Who buys gold',
  left: [
    { kicker: 'Gold' },
    { h1: 'Who buys gold' },
    { p: 'The World Gold Council (WGC) publishes a full supply-and-demand table every quarter. In 2025 total demand reached a record 5,002 tonnes. The chart shows where it went.' },
    { chart: hbars([
      { label: 'Jewellery', v: 1638, tone: TONE.gold }, { label: 'Bars & coins', v: 1374, tone: TONE.gold },
      { label: 'Central banks', v: 863, tone: TONE.blue }, { label: 'ETFs (net inflow)', v: 801, tone: TONE.gold },
      { label: 'Technology', v: 323, tone: TONE.grey }], { fmt: (v) => fmtN(v) + ' t' }) },
    { note: 'Gold demand in 2025, tonnes. Jewellery is fabrication. Source: WGC Gold Demand Trends FY2025.' },
    { p: 'Technology, which includes electronics and dentistry, took only 323 tonnes, under 7% of the total. A change in industrial output therefore barely moves gold demand directly. The business cycle still reaches gold through other channels, such as investors buying gold as a hedge when the economy weakens.' },
  ],
  right: [
    { h2: 'Investment swings the most' },
    { figs: ['h-sovereign', 'bar-gold'], h: 0.06 },
    { p: 'Investment is the sum of bars and coins and [[ETF]] flows, and in 2025 it came to about 2,175 tonnes. It is also the most volatile part of demand. ETF holdings shrank by 3 tonnes in 2024 and grew by 801 tonnes in 2025: a swing of more than 800 tonnes in one year, larger than the whole technology sector.' },
    { h2: 'Jewellery falls when prices rise' },
    { p: 'Jewellery fabrication dropped from 2,027 tonnes in 2024 to 1,638 tonnes in 2025, while the price of gold rose to records. Jewellery buyers, concentrated in India and China, buy less metal when the price is high. Jewellery demand therefore tends to lean against the price rather than drive it.' },
    { h2: 'Central banks' },
    { p: 'Central banks bought 863 tonnes in 2025, about a sixth of all demand. No other precious metal has a buyer like this.' },
  ],
});

const ch1c = flatSpread({
  key: 'ch1-central-banks', title: 'Chapter 1: Central banks',
  left: [
    { h1: 'Central banks' },
    { table: { cols: [0.55, 0.45], head: ['Year', 'Net purchases'], align: ['l', 'r'], rows: [
      ['2023', '1,050 t'], ['2024', '1,092 t'], ['2025', '863 t'], ['2026, Q1\u2013Q3', '675 t']] } },
    { p: 'Central banks hold gold to diversify their foreign-exchange reserves. Buying accelerated after February 2022, when Western governments froze the Russian central bank\u2019s foreign-currency assets: a reserve asset that another government can freeze is not fully safe, while gold held at home is.' },
    { p: 'In the WGC\u2019s 2026 survey of 76 central banks, 45% expected to increase their own gold holdings over the next year, a record, and 89% expected global central-bank holdings to rise. The most common reasons were gold\u2019s performance in a crisis (90%), its role as a long-term store of value (84%) and diversification (82%).' },
    { p: 'Central banks are not trading short-term price moves, so their buying often continues when the price falls.' },
  ],
  right: [
    { h2: 'How a central bank buys gold' },
    { p: 'Most purchases happen in the [[over-the-counter]] market in London, through large bullion banks. The metal changes hands as London Good Delivery bars of about 400 ounces. The Bank for International Settlements (BIS) also trades and holds gold for central banks.' },
    { p: 'A purchase usually does not move any metal. The bars stay in a London vault and the owner changes by a book entry. The Bank of England holds about 5,800 tonnes for other central banks and the UK Treasury, some 400,000 bars and about 60% of all gold in London vaults; the Bank owns only two bars itself. Some central banks prefer to ship their gold home.' },
    { p: 'Other central banks buy directly from domestic mines. In the WGC\u2019s 2025 survey, 19 of 36 respondents bought from local small-scale miners in their own currency. Russia\u2019s central bank resumed buying from domestic producers on 28 February 2022.' },
    { fig: 'vault', w: 0.13 },
  ],
});

const ch1d = flatSpread({
  key: 'ch1-gold-supply', title: 'Chapter 1: Where gold comes from',
  left: [
    { h1: 'Where gold comes from' },
    { table: { cols: [0.6, 0.4], head: ['Gold supply, 2025', 'Tonnes'], align: ['l', 'r'], rows: [
      ['Mine production', '3,672'], ['Net producer hedging', '\u221274'], ['Recycled gold', '1,404'], ['Total supply', '5,002']] } },
    { p: 'Gold comes from two sources: mines and recycling. Mine output is slow to change, because a new mine takes many years from discovery to production. A higher price does not bring much new mine supply within a year or two.' },
    { p: 'Recycling responds faster. When the price is high, more people sell old jewellery; recycling reached 1,404 tonnes in 2025, more than a quarter of supply.' },
    { chart: vbars([
      { x: "'10", v: 2831, at: 0 }, { x: "'16", v: 3516, at: 6 }, { x: "'18", v: 3663, at: 8 }, { x: "'19", v: 3599, at: 9 }, { x: "'20", v: 3484, at: 10 },
      { x: "'21", v: 3561, at: 11 }, { x: "'22", v: 3625, at: 12 }, { x: "'23", v: 3644, at: 13 }, { x: "'24", v: 3645, at: 14 }, { x: "'25", v: 3672, at: 15, show: true }],
      { slot: 16, max: 4000, h: 0.14, ticks: [0, 2000, 4000], ref: { v: 3663, label: '2018 record' } }) },
    { note: 'World gold mine production, tonnes (WGC). 2011\u20132015 and 2017 not shown.' },
  ],
  right: [
    { h2: 'Will gold run out?' },
    { p: 'Not soon, but mine output has stopped growing. The 2025 total of 3,672 tonnes was barely above the 2018 record of 3,663 tonnes.' },
    { p: 'The US Geological Survey estimates known gold [[reserves]] at about 66,000 tonnes. At about 3,300 tonnes a year (the USGS count of output is lower than the WGC\u2019s), that is roughly twenty years of production:' },
    { eq: '66{,}000\\ \\mathrm{t} \\div 3{,}300\\ \\mathrm{t/yr} \\approx 20\\ \\mathrm{yr}', size: 0.024 },
    { p: 'Twenty years does not mean the mines close in twenty years. Reserves are defined as the gold that can be mined at a profit at today\u2019s price and technology, so a higher price or a new discovery adds to them. The real limit is that new deposits are harder to find and slower to develop.' },
    { h2: 'Why supply hardly matters for price' },
    { p: 'Almost all gold ever mined still exists: about 220,700 tonnes at the end of 2025, some sixty years of mine output. New supply adds less than 2% a year to that stock, so changes in gold\u2019s price come almost entirely from the demand side.' },
  ],
});

const ch1e = flatSpread({
  key: 'ch1-gold-price', title: 'Chapter 1: What moves the gold price',
  left: [
    { h1: 'What moves the gold price' },
    { p: 'Gold pays no interest. Holding gold therefore costs the return an investor could have earned on a safe bond. The return that matters is the one left after inflation, the [[real interest rate]].' },
    { p: 'Take $10,000 and one year. A one-year US Treasury pays 4.7%, and prices rise 3.2% over the year. The bond returns $10,470, but after inflation its buying power has grown by only about 1.5%. That 1.5% is the real rate. Gold pays nothing; even if gold rises exactly with inflation, its real return is 0%, which is 1.5% less than the bond. That gap is the [[opportunity cost]] of holding gold.' },
    { eq: 'r_{real} = i_{nominal} - \\pi^{e}' },
    { p: 'Here i is the nominal interest rate and \u03c0 with a superscript e is the inflation rate the market expects. Markets read r directly from the yield on inflation-protected Treasuries (TIPS). When r rises, holding gold costs more, and gold usually falls; when r falls, gold usually rises.' },
  ],
  right: [
    { figs: ['bar-gold', 'bonds'], h: 0.05, cap: 'Plate 2. Gold pays nothing; a bond pays interest.' },
    { h2: 'Inflation works in two directions' },
    { p: 'If the nominal rate stays put, higher expected inflation lowers the real rate and helps gold. But if the central bank raises the nominal rate faster than inflation rises, the real rate goes up and gold falls. In 2026 US inflation stayed high, the Federal Reserve started raising rates again, and gold fell from about $5,595 in late January to about $3,880 in November.' },
    { h2: 'The dollar' },
    { p: 'Gold is priced in US dollars. When the dollar strengthens, a buyer paying in euros or rupees needs more of their own currency for the same ounce, and demand falls.' },
    { h2: 'Central banks bend the rule' },
    { p: 'Central-bank buying does not depend on interest rates. After 2022 US real rates rose sharply, yet gold kept rising, and most analysts credit the central banks.' },
  ],
});
