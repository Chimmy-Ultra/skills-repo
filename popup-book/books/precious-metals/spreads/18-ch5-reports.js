// ======================= Chapter 5: reading the reports =======================
// Facts: sources.md, Chapter 5. COT: CFTC disaggregated futures-only, gold (088691), managed money net, every 4th week (data/cot_gold_mm.txt).
// [months after January 2016, thousand contracts]
const COT_MM = [[0.16,-16],[1.06,29],[2.03,104],[2.94,154],[3.84,172],[4.77,156],[5.68,250],[6.61,252],[7.52,243],[8.42,243],[9.35,149],[10.26,174],[11.19,82],[12.10,37],[13.00,70],[13.90,114],[14.90,91],[15.81,160],[16.74,111],[17.65,99],[18.58,29],[19.48,177],[20.39,254],[21.32,171],[22.23,171],[23.16,135],[24.06,148],[24.97,208],[25.87,150],[26.87,162],[27.77,100],[28.71,17],[29.61,11],[30.55,-26],[31.45,-83],[32.35,-75],[33.29,-109],[34.19,-47],[35.13,-10],[36.00,50],[36.94,32],[37.84,79],[38.84,58],[39.74,-34],[40.68,16],[41.58,151],[42.52,180],[43.42,224],[44.32,206],[45.26,201],[46.16,197],[47.10,208],[48.00,233],[48.90,220],[49.81,231],[50.77,157],[51.68,146],[52.61,127],[53.52,105],[54.45,135],[55.35,98],[56.26,104],[57.19,95],[58.10,91],[59.03,86],[59.94,109],[60.84,96],[61.74,69],[62.74,44],[63.65,56],[64.58,92],[65.48,97],[66.42,86],[67.32,35],[68.23,68],[69.16,54],[70.06,85],[70.97,92],[71.90,84],[72.81,101],[73.71,139],[74.71,115],[75.61,101],[76.55,43],[77.45,37],[78.39,-6],[79.29,41],[80.19,-7],[81.13,-7],[82.03,-41],[82.94,15],[83.87,51],[84.77,80],[85.68,37],[86.68,81],[87.58,103],[88.52,104],[89.42,75],[90.35,82],[91.26,59],[92.16,50],[93.10,-8],[94.00,75],[94.90,115],[95.84,106],[96.74,61],[97.65,50],[98.61,143],[99.52,135],[100.45,130],[101.35,153],[102.29,157],[103.19,151],[104.10,192],[105.03,214],[105.94,195],[106.84,179],[107.77,165],[108.68,216],[109.58,185],[110.58,184],[111.48,125],[112.42,101],[113.32,124],[114.26,129],[115.16,154],[116.06,162],[116.97,145],[117.90,104],[118.81,109],[119.74,136],[120.65,137],[121.55,96],[122.55,102],[123.45,95],[124.39,98],[125.29,106],[126.23,116],[127.13,131],[128.03,137],[128.94,120],[129.87,106],[130.10,104]];

const ch5r_a = flatSpread({
  key: 'rp-calendar', title: 'Chapter 5: The calendar',
  left: [
    { kicker: 'Chapter 5 · Reading the reports' },
    { h1: 'The calendar' },
    { p: 'Most market news about metals is a report someone has just published, retold in one sentence. Reading the report itself takes a few minutes and often tells a different story. This chapter covers the seven reports behind most headlines: what each measures, when it comes out, and how people misread it.' },
    { figs: ['n-wallcal', 'n-formsdesk'], h: 0.12 },
    { p: 'They come at very different speeds. Warehouse and fund data change every day. Positions of traders arrive weekly, with a delay. The big surveys of supply and demand come once a quarter or once a year, and are revised later.' },
  ],
  right: [
    { table: { cols: [0.3, 0.22, 0.48], head: ['Report', 'Publisher', 'When'], align: ['l', 'l', 'l'], size: 0.0175, pad: 0.0075, rows: [
      ['COMEX warehouse stocks', 'CME Group', 'every business day, for the day before'],
      ['ETF holdings', 'each fund', 'every business day'],
      ['Commitments of Traders', 'CFTC', 'Fridays 3:30 pm New York time, positions as of Tuesday'],
      ['London vault data', 'LBMA', 'monthly, 5th business day, for the previous month-end'],
      ['Gold Demand Trends', 'World Gold Council', 'quarterly; Q3 2026 came out on 3 November'],
      ['World Silver Survey', 'Silver Institute', 'yearly in April; 2026 edition on 15 April'],
      ['PGM Market Report', 'Johnson Matthey', 'yearly in May, before London Platinum Week']] } },
    { p: 'The rest of the chapter takes them one at a time, with the latest numbers available in November 2026.' },
    { fig: 'n-reports', w: 0.22 },
  ],
});

const ch5r_b = flatSpread({
  key: 'rp-cot1', title: 'Chapter 5: Commitments of Traders',
  left: [
    { h1: 'Who holds the futures' },
    { p: 'Every large trader in US futures must report its positions to the Commodity Futures Trading Commission. Each week the CFTC adds them up by type of trader and publishes the totals as the [[Commitments of Traders]] report, or COT.' },
    { p: 'The disaggregated report sorts traders into four groups, based on their main business:' },
    { p: '[[Producers and merchants]] handle the metal itself (miners, refiners, fabricators) and use futures to hedge. [[Swap dealers]] sell swaps and other private contracts to clients and hedge them with futures. [[Managed money]] is hedge funds and commodity trading advisers. [[Other reportables]] are all other large traders. Positions too small to report are counted together as non-reportable.' },
    { figs: ['n-fund', 'n-handshake'], h: 0.1, cap: 'A fund manager; a miner hedging with a bank.' },
  ],
  right: [
    { h2: 'Gold, 3 November 2026' },
    { table: { cols: [0.37, 0.21, 0.21, 0.21], head: ['Thousand contracts', 'Long', 'Short', 'Net'], align: ['l', 'r', 'r', 'r'], rows: [
      ['Producers, merchants', '19', '28', '−9'], ['Swap dealers', '19', '215', '−196'], ['Managed money', '122', '19', '+103'], ['Other reportables', '98', '22', '+76'], ['Non-reportable', '46', '21', '+25']] } },
    { note: 'COMEX gold, futures only; spread positions left out. Open interest 399,000 contracts. Source: CFTC.' },
    { p: 'The net column adds up to zero, apart from rounding: every contract has one buyer and one seller. So the question is never whether traders are long or short in total, but which group holds which side.' },
    { p: 'Here managed money held a net long of 103,000 contracts, 10.3 million ounces or about 320 tonnes, and swap dealers held most of the other side.' },
    { fig: 'bar-gold', w: 0.17 },
  ],
});

const ch5r_c = flatSpread({
  key: 'rp-cot2', title: 'Chapter 5: Reading the COT',
  left: [
    { h2: 'Managed money in gold, ten years' },
    { chart: lineChart({ pts: COT_MM, n: 131, ymin: -150, ymax: 300, ticks: [-100, 0, 100, 200, 300], h: 0.19, zero: true, tone: TONE.blue,
      xl: [[0, '2016'], [24, '2018'], [48, '2020'], [72, '2022'], [96, '2024'], [120, '2026']], fmt: (v) => fmtN(v), title: 'Net long, thousand contracts' }) },
    { note: 'Every fourth weekly report, January 2016 to November 2026. Source: CFTC.' },
    { p: 'Funds were net long gold in almost every report of the decade. Their position swung between about 110,000 contracts short in October 2018 and about 250,000 long at the peaks of 2016 and 2017.' },
    { p: 'The line moves with the price because funds that follow trends buy as the price rises and sell as it falls. A big change in the line is a sign of where recent buying or selling came from.' },
  ],
  right: [
    { h2: 'Three common misreadings' },
    { p: '[[“The banks are betting on a fall.”]] The large swap-dealer short is mostly the other side of client business. For years bullion banks have sold New York futures against gold they hold in London and earned the gap between the two (the EFP trade of Chapter 3). The short leg shows in the COT; the long leg, in London, does not.' },
    { p: '[[“Funds are record long, so the price must fall.”]] A crowded position can unwind fast, but it can also stay crowded for months. The COT shows who could sell, not when.' },
    { p: '[[“This is today’s positioning.”]] The data are as of Tuesday and published on Friday, three days later.' },
    { fig: 'n-pit', w: 0.2 },
  ],
});

const ch5r_d = flatSpread({
  key: 'rp-comex', title: 'Chapter 5: COMEX warehouse stocks',
  left: [
    { h1: 'COMEX warehouse stocks' },
    { p: 'Each afternoon CME publishes a report for each metal listing the stocks in every approved New York vault (Brink’s, Loomis, JPMorgan, HSBC and others) for the previous business day. Each line shows deposits, withdrawals, and the split into [[registered]] and [[eligible]] metal, the two categories of Chapter 2.' },
    { figs: ['n-counter', 'vault'], h: 0.11 },
    { p: 'Headlines love this report: “COMEX gold stocks plunge!” Most such stories mix up the two kinds of change it shows.' },
  ],
  right: [
    { h2: 'Two kinds of change' },
    { p: 'A change in the [[total]] means metal entered or left the vaults: bars delivered by truck or plane, or taken away. That is a real physical flow.' },
    { p: 'A move between registered and eligible means a warrant was issued or cancelled. The bars stay on the same shelf. Large one-day jumps in registered stocks are usually this kind of paperwork.' },
    { table: { cols: [0.34, 0.22, 0.22, 0.22], head: ['Total, million oz', '2 Oct 2026', '12 Nov 2026', 'Change'], align: ['l', 'r', 'r', 'r'], rows: [
      ['Gold', '23.5', '22.9', '−0.6'], ['Silver', '337.6', '332.2', '−5.4']] } },
    { note: 'Registered plus eligible. Sources: CME depository reports via MetalCharts.' },
    { p: 'Over those six weeks about 18 tonnes of gold and 170 tonnes of silver left the COMEX vaults, small amounts beside the 2025 inflows. Watch the total over weeks rather than the registered line from day to day.' },
    { fig: 't-van', w: 0.26 },
  ],
});

const ch5r_e = flatSpread({
  key: 'rp-etf', title: 'Chapter 5: ETF holdings',
  left: [
    { h1: 'ETF holdings' },
    { p: 'A physically backed ETF holds bars for its shareholders. New shares are created when a large dealer, an [[authorised participant]], delivers metal into the fund’s account at its custodian bank. Shares are redeemed the other way round: the dealer hands back shares and takes the metal out.' },
    { p: 'So when investors buy more shares than they sell, bars move into the fund’s vault. The biggest gold fund, SPDR Gold Shares (GLD), keeps its bars with HSBC and JPMorgan; HSBC runs the custody business from London.' },
    { figs: ['n-certs', 'n-vaultdoor'], h: 0.11 },
  ],
  right: [
    { h2: 'What the numbers say' },
    { p: 'Each fund publishes the metal it holds every business day, and the World Gold Council adds them up. In the third quarter of 2026 gold ETFs worldwide took in 211 tonnes, and their holdings reached a record 4,256 tonnes.' },
    { p: 'ETF holdings are the most visible piece of investment demand, so they are quoted often. Two cautions:' },
    { p: 'They are only one channel. Investors also buy bars and coins, futures and unallocated metal, none of which show here.' },
    { p: 'They lock metal away. ETF bars cannot be lent or used to settle trades. In silver this matters a great deal: at the end of September 2025 products of this kind held 83% of the silver in London’s vaults (Chapter 4).' },
    { fig: 'r-gold400', w: 0.2 },
  ],
});

const ch5r_f = flatSpread({
  key: 'rp-lbma', title: 'Chapter 5: London vault data',
  left: [
    { h1: 'London vault data' },
    { p: 'Once a month, on the fifth business day, the LBMA publishes how much gold and silver was held in London’s vaults at the end of the previous month. The figure includes the commercial vaults and the gold at the Bank of England, which holds no silver.' },
    { table: { cols: [0.5, 0.25, 0.25], head: ['End of October 2026', 'Gold', 'Silver'], align: ['l', 'r', 'r'], rows: [
      ['Tonnes', '9,850', '28,889'], ['Million ounces', '317', '929']] } },
    { figs: ['v-shelves', 'r-silverbars'], h: 0.1 },
  ],
  right: [
    { h2: 'From vault data to free float' },
    { p: 'The vault total is not what the market can use. To estimate the free float, take the total and subtract the metal that is committed elsewhere:' },
    { eq: '\\text{free float} \\approx \\text{total} - \\text{ETPs} - \\text{other}', size: 0.022 },
    { p: 'ETP holdings come from the funds’ daily reports. The last term is harder to know, so analysts such as Metals Focus publish their own estimates. Theirs for silver: 28% of the 884 million ounces in London at the end of March 2026 was free to support trading.' },
    { p: 'The data arrive a month late, so they confirm a trend rather than warn of a single day. A free float that shrinks month after month is the slow warning Chapter 4 described.' },
    { fig: 'n-magnifier', w: 0.2 },
  ],
});

const ch5r_g = flatSpread({
  key: 'rp-wgc', title: 'Chapter 5: Gold Demand Trends',
  left: [
    { h1: 'Gold Demand Trends' },
    { p: 'Every quarter the World Gold Council, with data from Metals Focus, publishes a full balance of gold supply and demand. It is the standard source for statements like “central banks bought 321 tonnes”.' },
    { chart: hbars([
      { label: 'Jewellery', v: 340 }, { label: 'Technology', v: 85 }, { label: 'Bars and coins', v: 268 }, { label: 'ETFs', v: 211 }, { label: 'Central banks', v: 321 }, { label: 'OTC and other', v: 143, tone: TONE.grey }],
      { max: 360, labelW: 0.34 }) },
    { note: 'Gold demand in Q3 2026, tonnes; total 1,369. Jewellery is fabrication: consumption of 313 t plus 27 t added to inventories. Source: WGC.' },
  ],
  right: [
    { h2: 'How to read it' },
    { p: 'The price averaged $4,262 an ounce in the quarter. Jewellery consumption fell 17% from a year earlier, to the weakest third quarter in the WGC’s data back to 2000, while central banks bought 42% more. At high prices, the buyers who care least about price take a bigger share.' },
    { p: 'Read the last row with care. The WGC says “OTC and other” covers less visible investment, such as bars traded between banks and funds, and also any statistical residual. It is not observed directly. When it is large, a big part of the quarter’s demand is an estimate.' },
    { figs: ['n-shopwindow', 'coins'], h: 0.09 },
    { p: 'Compare changes over a year, not a quarter: jewellery and bar demand are seasonal.' },
  ],
});

const ch5r_h = flatSpread({
  key: 'rp-silverpgm', title: 'Chapter 5: Silver and palladium surveys',
  left: [
    { h1: 'Silver and palladium surveys' },
    { p: 'The [[World Silver Survey]], produced by Metals Focus for the Silver Institute, comes out each April. The 2026 edition found a 2025 deficit of 40.3 million ounces, the fifth in a row, and forecast 46.3 million for 2026.' },
    { table: { cols: [0.52, 0.48], head: ['World Silver Survey 2026', 'Million oz'], align: ['l', 'r'], rows: [
      ['Mine supply, 2025', '846.6'], ['Solar panels, 2025', '186.6'], ['Solar panels, 2026 forecast', 'about 151'], ['Drawn from stocks, 2021–2025', '762']] } },
    { p: 'Read forecasts as forecasts. In April 2025 the survey expected a 2025 deficit of 117.6 million ounces; the measured figure a year later was 40.3. A deficit forecast is a starting point, not a fact.' },
    { fig: 'n-solarfield', w: 0.2 },
  ],
  right: [
    { h2: 'Two sources, one year' },
    { p: 'For platinum and palladium the main annual reports come from Johnson Matthey, in May, and from Metals Focus. They do not always agree:' },
    { table: { cols: [0.36, 0.32, 0.32], head: ['2025 balance, thousand oz', 'Johnson Matthey', 'Metals Focus'], align: ['l', 'r', 'r'], rows: [
      ['Platinum', '−951', '−461'], ['Palladium', '−416', '−433']] } },
    { p: 'The palladium figures are close. The platinum deficits differ by a factor of two. A balance is a small difference between two large estimates, supply and demand, so small differences in either move it a lot. A third source, the World Platinum Investment Council, put it at 1.44 million ounces. When a headline says “the market is in deficit”, check whose balance it is.' },
    { p: 'Johnson Matthey expects palladium to turn to a small surplus of 214,000 ounces in 2026, its first since 2011, as demand falls and recycling of old catalytic converters recovers.' },
  ],
});

const ch5r_i = flatSpread({
  key: 'rp-example', title: 'Chapter 5: Checking a headline',
  left: [
    { h1: 'Checking a headline' },
    { p: 'Suppose a headline in November 2026 reads: “Hedge funds slash their gold bets.” Five steps turn it into something you can judge.' },
    { p: '[[1. Which report?]] “Hedge funds” and “bets” mean the COT, managed-money category.' },
    { p: '[[2. Which dates?]] The report of 3 November, published on Friday 6 November. Compare it with an earlier report, for example 1 September.' },
    { p: '[[3. How big?]] Managed money’s net long fell from 137,000 to 104,000 contracts:' },
    { eq: '33{,}000 \\times 100\\ \\text{oz} = 3.3\\ \\text{Moz} \\approx 103\\ \\text{t}', size: 0.024 },
    { figs: ['n-newsboy', 'n-ribbons'], h: 0.09 },
  ],
  right: [
    { p: '[[4. Is it unusual?]] Over the last ten years the net position ranged from about −110,000 to +250,000 contracts. At 104,000, funds were still clearly long, near the middle of their range.' },
    { p: '[[5. What else happened?]] For scale, in the third quarter of 2026 ETFs added 211 tonnes and central banks 321 tonnes. A 103-tonne cut by futures funds matters, but other buyers were taking much more.' },
    { p: 'The verdict: the headline is true but incomplete. Futures funds sold, from a long position, while slower investors kept buying.' },
    { fig: 'n-ledger', w: 0.22 },
    { p: 'Every report in this chapter can be checked this way: name the source, the dates, the size in tonnes, and the comparison.' },
  ],
});
