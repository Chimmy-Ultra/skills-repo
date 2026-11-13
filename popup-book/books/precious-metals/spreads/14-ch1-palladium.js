// ======================= Chapter 1, part 3: palladium, and the three side by side =======================
// Numbers: Johnson Matthey PGM Market Report, May 2026 (2025 actual, 2026 forecast, koz); SFA (Oxford) for IPA,
// PGM Fact Sheet Palladium 2026; WPIC (Jan 2024); price levels from Reuters/CNBC and Trading Economics.

const ch1i = flatSpread({
  key: 'ch1-pd-demand', title: 'Chapter 1: Palladium, a metal for cars',
  left: [
    { kicker: 'Palladium' },
    { h1: 'A precious metal for cars' },
    { p: 'Most palladium goes into the [[catalytic converter]] of petrol cars, where it turns carbon monoxide and unburnt fuel into less harmful gases. Cars took about 81% of palladium demand in 2025. Central banks do not hold palladium, and investment demand is small, so palladium demand follows global car production and emission rules.' },
    { figs: ['car', 'converter'], h: 0.06, cap: 'Plate 4. A petrol car and a cut-open catalytic converter.' },
    { table: { cols: [0.52, 0.24, 0.24], head: ['Palladium demand, koz', '2025', '2026F'], align: ['l', 'r', 'r'], rows: [
      ['Automotive', '8,227', '7,829'], ['Investment', '382', '−115'], ['Total demand', '10,140', '9,245']] } },
    { note: '1,000 koz ≈ 31 tonnes. Source: Johnson Matthey PGM Market Report, May 2026.' },
  ],
  right: [
    { h2: 'The electric-car problem' },
    { p: 'A battery-electric car has no exhaust and needs no catalytic converter. Hybrids still need one. Johnson Matthey expects battery-electric cars to reach 37% of light-vehicle production in China in 2026, up from 32%, and about 20% in Europe. It forecasts petrol-car output to fall 4% and total palladium demand to fall 9% in 2026.' },
    { p: 'This is a slow, one-directional pressure on demand. It does not decide any single day’s price, but it sets the background: a metal whose main customer is shrinking has to find its price with fewer natural buyers.' },
    { h2: 'Why palladium is still “precious”' },
    { p: 'Palladium is a platinum group metal: it is rarer than gold, about 197 tonnes mined in 2025, and it does not corrode. It is precious by the same definition as gold. What it lacks is gold’s monetary history. No central bank holds it, so its price depends much more on its own supply and demand than gold’s does.' },
  ],
});

const ch1j = flatSpread({
  key: 'ch1-pd-supply', title: 'Chapter 1: Where palladium comes from',
  left: [
    { h1: 'Where palladium comes from' },
    { chart: hbars([{ label: 'Russia', v: 43, tone: TONE.red }, { label: 'South Africa', v: 35, tone: TONE.gold }, { label: 'Everyone else', v: 22, tone: TONE.grey }], { labelW: 0.36, fmt: (v) => v + '%' }) },
    { note: 'Share of world palladium mine output. Source: SFA (Oxford) for IPA, 2026.' },
    { p: 'Two countries mine almost four-fifths of the world’s palladium. In Russia, Nornickel produces it as a by-product of nickel and copper mining. In South Africa it comes out of the same ore as platinum. In both cases the mine plan is set by other metals, so palladium output does not respond much to the palladium price.' },
    { figs: ['smelter', 'ptmine'], h: 0.09, cap: 'Plate 5. A nickel smelter and a platinum mine headframe.' },
  ],
  right: [
    { table: { cols: [0.52, 0.24, 0.24], head: ['Palladium supply, koz', '2025', '2026F'], align: ['l', 'r', 'r'], rows: [
      ['Mine supply', '6,589', '6,032'], ['  of which Russia', '2,950', '2,450'], ['Recycling', '3,135', '3,427'], ['Market balance', '−416', '+214']] } },
    { p: 'Recycling, mostly from scrapped catalytic converters, supplied about a third of palladium in 2025. After a long run of deficits from 2012 to 2025, Johnson Matthey expects a small surplus of 214 koz in 2026, because demand is falling faster than supply.' },
    { h2: 'Russia as a risk' },
    { p: 'Russian output is forecast at its lowest level for at least two decades in 2026. Because Russia supplies so much, sanctions or export trouble can move the price on their own: when Russia invaded Ukraine, palladium briefly hit a record $3,440 on 7 March 2022, on fears that Russian metal would stop reaching the market.' },
  ],
});

const ch1k = flatSpread({
  key: 'ch1-pd-platinum', title: 'Chapter 1: Palladium and platinum',
  left: [
    { h1: 'Palladium and platinum' },
    { p: 'Palladium and platinum can partly replace each other in catalytic converters. When palladium is much more expensive than platinum, carmakers redesign catalysts to use more platinum, and palladium demand falls. The World Platinum Investment Council estimated that platinum replaced about 620 koz of palladium in 2023 and 700 koz in 2024.' },
    { p: 'The switch works both ways, with a delay of years, because each catalyst design is fixed for a car model. Johnson Matthey notes that some new European models chose platinum-rich catalysts when palladium was dearer, and it expects that to reverse as later designs are thrifted. Traders of palladium therefore watch the palladium–platinum price gap, not just palladium’s own price.' },
    { p: 'In mid-November 2026 platinum traded near $1,486 an ounce and palladium near $1,000, so platinum was the dearer metal by about $480.' },
  ],
  right: [
    { h2: 'A short price history' },
    { table: { cols: [0.6, 0.4], head: ['Palladium, US$/oz', 'Price'], align: ['l', 'r'], rows: [
      ['Jan 2001 peak', '≈ 1,090'], ['7 Mar 2022, record', '3,440'], ['Late Jan 2026', '> 2,100'], ['4 Nov 2026', '≈ 935'], ['13 Nov 2026', '≈ 1,000']] } },
    { p: 'Palladium is a small market, so its price can travel a long way. It more than tripled from its 2001 peak to its 2022 record, then lost more than two-thirds of its value by November 2026.' },
    { p: 'Palladium futures trade on NYMEX under the symbol PA; platinum trades as PL.' },
  ],
});

const ch1l = flatSpread({
  key: 'ch1-summary', title: 'Chapter 1: The three side by side',
  left: [
    { h1: 'The three side by side' },
    { table: { cols: [0.25, 0.25, 0.25, 0.25], size: 0.0178, head: ['', 'Gold', 'Silver', 'Palladium'], align: ['l', 'l', 'l', 'l'], rows: [
      ['Main buyers', 'jewellery, investors, central banks', 'industry 58%, investors, jewellery', 'car catalysts, about 81%'],
      ['Central banks', 'yes, 863–1,092 t a year, 2023–25', 'no', 'no'],
      ['Supply', 'mines plus recycling; slow to respond', 'mostly a by-product of lead, zinc, copper, gold', 'Russia and South Africa; by-product'],
      ['Main price drivers', 'real rate, dollar, central banks', 'real rate, dollar, plus copper, solar, risk appetite', 'car output, Russian supply, platinum gap'],
      ['In a crisis', 'usually holds up', 'falls with industrial commodities', 'follows the car industry']] } },
  ],
  right: [
    { h2: 'What to take from this chapter' },
    { p: 'Gold is close to a pure monetary asset. Its new supply is small next to its stock, its industrial use is minor, and central banks buy it regardless of price. Its main variables are the real interest rate and the dollar.' },
    { p: 'Silver is a hybrid. Its monetary half follows gold, its industrial half follows the business cycle, and its small market enlarges both. In a crisis the industrial half usually wins.' },
    { p: 'Palladium is precious by definition but industrial by behaviour. Its price depends mostly on car production, the shift to electric cars, Russian supply and its price gap with platinum.' },
    { note: 'Sources for this chapter: World Gold Council (Gold Demand Trends FY2025 and Q3 2026; Central Bank Gold Reserves Survey 2026; Gold Market Primer), Silver Institute / Metals Focus (World Silver Survey 2026), Johnson Matthey (PGM Market Report 2026), SFA (Oxford) for the International Platinum Group Metals Association (2026), WPIC, USGS Mineral Commodity Summaries 2026, Bank of England, LBMA, CME Group, StoneX, Goldman Sachs via news reports, Reuters, Yahoo Finance price data.' },
  ],
});
