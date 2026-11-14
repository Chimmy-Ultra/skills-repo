// ======================= Chapter 5: a short history of five metals (plain English) =======================
// Facts checked against the sources listed in sources.md (Chapter 5). Plates: Gemini engravings, sheets g–k.

const CH4_LANES = [
  { name: 'Copper', tone: '#b4643c', ev: [[-8000, 'first tools'], [-3300, 'Bronze Age'], [1866, 'Atlantic cable']] },
  { name: 'Gold', tone: TONE.gold, ev: [[-600, 'first coins'], [1848, 'California'], [1971, 'dollar leaves gold']] },
  { name: 'Silver', tone: TONE.silver, ev: [[-483, 'Laurion'], [1545, 'Potos\u00ed'], [1980, 'Hunt squeeze']] },
  { name: 'Platinum', tone: '#8f969c', ev: [[1748, '\u201clittle silver\u201d'], [1889, 'the kilogram'], [1975, 'car catalysts']] },
  { name: 'Palladium', tone: TONE.pd, ev: [[1802, 'discovered'], [2022, 'record price']] },
];

const ch4a = flatSpread({
  key: 'ch4-intro', title: 'Chapter 5: A short history of five metals',
  left: [
    { kicker: 'Chapter 5 · A short history of five metals' },
    { h1: 'Ten thousand years in one page' },
    { p: 'The first four chapters looked at the markets of today. This chapter steps back and tells the stories behind five metals: copper, gold, silver, platinum and palladium.' },
    { p: 'The stories explain things that still matter. They show why gold and silver became money and copper did not, why central banks hold gold but not silver, and why platinum and palladium became metals for cars.' },
    { figs: ['h-oxhide', 'h-lion', 'h-owl'], h: 0.1, cap: 'A copper ingot, an early gold-and-silver coin, an Athenian silver coin.' },
  ],
  right: [
    { chart: timeline(CH4_LANES) },
    { note: 'The time line has three parts with different scales: 9000 BC to AD 1, AD 1 to 1800, and 1800 to today.' },
    { p: 'Copper and gold are the old metals: people used them thousands of years ago. Platinum and palladium are new: scientists in Europe only described them in the 1700s and 1800s. Silver sits in between, with a long history as money and a short one as an industrial metal.' },
  ],
});

const ch4b = flatSpread({
  key: 'ch4-copper-old', title: 'Chapter 5: Copper, the first metal',
  left: [
    { kicker: 'Copper' },
    { h1: 'The first metal' },
    { p: 'Copper was probably the first metal people worked. Small copper beads and pins from the Middle East and Anatolia (today’s Turkey) are around ten thousand years old. Pure copper sometimes lies in the ground as a metal, so early people could hammer it into shape without smelting it.' },
    { p: 'Copper alone is soft. Mixed with a little tin, it becomes bronze, which is much harder. Bronze tools and weapons were so important that historians named a whole age after them. The Bronze Age began in the Near East around 3300 BC.' },
    { figs: ['h-axe'], h: 0.11, cap: 'A bronze axe head.' },
  ],
  right: [
    { h2: 'The island of copper' },
    { p: 'In the ancient Mediterranean the great source of copper was the island of Cyprus. The Romans called the metal aes Cyprium, “metal of Cyprus”. Over time this became cuprum, which is where the English word copper and the chemical symbol Cu come from.' },
    { fig: 'h-oxhide', w: 0.2, cap: 'An “oxhide” ingot: copper cast with four handles for carrying.' },
    { h2: 'A shipwreck full of metal' },
    { p: 'Around 1300 BC a ship sank off Uluburun, on the south coast of Turkey. Divers found about ten tonnes of copper in oxhide ingots and about one tonne of tin: the exact recipe for bronze. It shows that copper was already traded in bulk across the sea more than three thousand years ago.' },
  ],
});

const ch4c = flatSpread({
  key: 'ch4-first-coins', title: 'Chapter 5: Gold and silver become money',
  left: [
    { kicker: 'Gold and silver' },
    { h1: 'The first coins' },
    { p: 'For a long time people traded gold and silver by weight. Every payment needed scales, and nobody could be sure how pure the metal was.' },
    { p: 'In the kingdom of Lydia, in western Turkey, someone had a better idea. Around 600 BC, Lydian rulers stamped small lumps of electrum, a natural mix of gold and silver, with a royal sign: a lion’s head. The stamp promised the weight. People could now count coins instead of weighing metal.' },
    { fig: 'h-lion', w: 0.13, cap: 'A Lydian coin with a lion’s head.' },
    { p: 'King Croesus of Lydia then made separate coins of pure gold and pure silver. His wealth became a saying: “rich as Croesus”.' },
  ],
  right: [
    { h2: 'Silver that won a war' },
    { p: 'In 483 BC miners at Laurion, near Athens, struck a rich new vein of silver. Some Athenians wanted to share the money among the citizens. The leader Themistocles argued instead for building a fleet of about two hundred warships, called triremes.' },
    { figs: ['h-owl', 'h-trireme'], h: 0.1, cap: 'An Athenian silver “owl” and a trireme.' },
    { p: 'Three years later, in 480 BC, that fleet beat the Persian navy at the battle of Salamis. Athens paid for its ships with silver and stamped its coins with an owl, the bird of the goddess Athena. The “owls” were trusted across the Mediterranean.' },
  ],
});

const ch4d = flatSpread({
  key: 'ch4-potosi', title: 'Chapter 5: The silver mountain',
  left: [
    { h1: 'The silver mountain' },
    { p: 'In 1545 Spanish colonists found a mountain of silver in the Andes, in today’s Bolivia. They called it Cerro Rico, the “rich hill”, and built the town of Potosí at its foot. Within a few decades Potosí was one of the largest cities in the Americas.' },
    { fig: 'h-potosi', w: 0.22, cap: 'Cerro Rico and the town of Potosí.' },
    { p: 'The silver came at a terrible cost. Spain forced Indigenous men to work in the mines under a labour system called the mita, and many died from accidents, cold and mercury poisoning.' },
  ],
  right: [
    { h2: 'Money for the whole world' },
    { p: 'Spain minted the silver into coins worth eight reales, the “pieces of eight”. They were so common that traders from Europe to Asia accepted them. The US dollar was later modelled on the Spanish dollar.' },
    { figs: ['h-eights', 'h-galleon'], h: 0.09, cap: 'Pieces of eight and a Spanish galleon.' },
    { p: 'From 1571, Spanish galleons sailed each year from Acapulco in Mexico to Manila in the Philippines. They carried American silver west and came back with Chinese silk and porcelain. China needed the silver: the Ming government had started to collect taxes in silver. For the first time, one metal tied together Europe, the Americas and Asia.' },
  ],
});

const ch4e = flatSpread({
  key: 'ch4-gold-standard', title: 'Chapter 5: The gold standard and the gold rushes',
  left: [
    { kicker: 'Gold' },
    { h1: 'Britain chooses gold' },
    { p: 'For centuries most countries used silver as their main money. Britain moved to gold almost by accident. In 1717 Isaac Newton, then Master of the Royal Mint, set the gold guinea at 21 shillings. The rate made gold slightly too cheap compared with silver, so silver coins left the country and gold stayed.' },
    { p: 'After the Napoleonic Wars Britain made gold its official standard, and the gold sovereign became its main coin. A pound note could be swapped for a fixed amount of gold at the Bank of England.' },
    { fig: 'h-sovereign', w: 0.1, cap: 'A gold sovereign.' },
    { p: 'In the 1870s Germany, the United States and others followed. Under this [[gold standard]], each currency was a fixed weight of gold, so exchange rates between them hardly moved. It lasted until the First World War in 1914.' },
  ],
  right: [
    { h2: 'Gold rushes' },
    { p: 'A gold standard needs gold, and the 1800s found a lot of it. On 24 January 1848 a carpenter found gold flakes at Sutter’s Mill in California. Within a few years hundreds of thousands of people arrived to dig.' },
    { figs: ['h-panner', 'h-sluice'], h: 0.1, cap: 'A gold panner and a sluice box.' },
    { p: 'Rushes followed in Australia in 1851 and in the Klondike in Canada in 1896. The biggest find came in 1886 on the Witwatersrand in South Africa. Johannesburg grew up on top of it, and for most of the 1900s South Africa mined more gold than any other country.' },
  ],
});

const ch4f = flatSpread({
  key: 'ch4-gold-20c', title: 'Chapter 5: Gold in the twentieth century',
  left: [
    { h1: 'Gold in the twentieth century' },
    { p: 'In 1933, in the middle of the Great Depression, President Franklin Roosevelt ordered Americans to hand in most of their gold coins and bars to the Federal Reserve. In January 1934 the government raised the price of gold from $20.67 to $35 an ounce. Overnight the dollar was worth less gold.' },
    { fig: 'h-safe', w: 0.15, cap: 'Gold coins in a safe-deposit drawer.' },
    { p: 'In July 1944, near the end of the Second World War, 44 countries met at a hotel in Bretton Woods, New Hampshire. They tied their currencies to the US dollar, and the United States promised foreign governments it would swap dollars for gold at $35 an ounce.' },
    { fig: 'h-hotel', w: 0.16 },
  ],
  right: [
    { h2: 'The window closes' },
    { p: 'By the late 1960s other countries held far more dollars than the US had gold to pay for. On 15 August 1971 President Richard Nixon “closed the gold window”: foreign governments could no longer swap dollars for gold. Since then the price of gold has been set by the market.' },
    { fig: 'h-note', w: 0.17, cap: 'Paper money that could once be swapped for gold.' },
    { p: 'Americans were allowed to own gold again from 31 December 1974. Gold jumped to about $850 in January 1980, when inflation was high and the Soviet Union had invaded Afghanistan, and then fell for twenty years.' },
    { p: 'Near the bottom, Britain sold 395 tonnes, about half its gold, in 17 auctions between 1999 and 2002, at an average price of about $275 an ounce. On 26 September 1999 fifteen European central banks agreed to limit their combined gold sales to 400 tonnes a year. After the Ukraine war began in 2022, central banks became big buyers instead, and gold reached a record of about $5,595 on 29 January 2026.' },
  ],
});

const ch4g = flatSpread({
  key: 'ch4-silver-modern', title: 'Chapter 5: Silver loses its job as money',
  left: [
    { kicker: 'Silver' },
    { h1: 'Silver loses its job as money' },
    { p: 'In 1873 the United States stopped minting silver dollars as standard money. Farmers and silver miners called the law the “Crime of ’73”, because a gold-only dollar made money scarce and pushed prices down. In 1896 the politician William Jennings Bryan attacked the gold standard in his famous “Cross of Gold” speech, but gold won.' },
    { p: 'For most of the 1900s silver found a new job in photography. Camera film and X-ray film used silver salts that darken in light, and for decades photography was one of the biggest uses of silver. Digital cameras ended that job after 2000.' },
    { fig: 'h-film', w: 0.1 },
    { p: 'In 1965 the United States removed silver from its dimes and quarters. The metal had become worth more than the coins.' },
  ],
  right: [
    { h2: 'The Hunt brothers' },
    { p: 'In the late 1970s two Texas oil heirs, Nelson Bunker Hunt and William Herbert Hunt, bought huge amounts of silver and silver futures. The price went from under $10 an ounce in mid-1979 to a record of about $49 on 17 January 1980.' },
    { figs: ['h-silverstack', 'h-pit-traders'], h: 0.1, cap: 'A stack of silver bars and a trading pit.' },
    { p: 'Then the exchange changed the rules. On 7 January 1980 COMEX limited how many contracts one trader could hold, and on 21 January it allowed only trades that closed positions. With no new buyers allowed, the price collapsed. On 27 March 1980, “Silver Thursday”, silver fell to about $11 and the Hunts could not meet their margin calls.' },
  ],
});

const ch4h = flatSpread({
  key: 'ch4-copper-modern', title: 'Chapter 5: Copper wires the world',
  left: [
    { kicker: 'Copper' },
    { h1: 'Copper wires the world' },
    { p: 'Copper carries electricity better than any metal except silver, and it is far cheaper than silver. When the world started to send messages and power through wires, it chose copper.' },
    { fig: 'h-cable', w: 0.2, cap: 'An undersea telegraph cable: copper inside, insulation and iron wire outside.' },
    { p: 'The first telegraph cable across the Atlantic worked in 1858 for only a few weeks. A stronger cable laid in 1866 worked for good. A message between London and New York now took minutes instead of ten days by ship.' },
  ],
  right: [
    { p: 'Electric light, motors, telephones and power grids followed, all built on copper wire. Today copper goes into buildings, grids, cars and electronics, and a battery-electric car uses about three times as much copper as a petrol car.' },
    { figs: ['h-coil', 'h-pit'], h: 0.1, cap: 'A coil of copper wire and an open-pit copper mine.' },
    { p: 'To meet demand, miners dug some of the largest holes on Earth. Chuquicamata in Chile’s Atacama Desert has been mined on a large scale since 1915. Chile is still the world’s largest copper producer.' },
    { h2: '“Dr Copper”' },
    { p: 'Because copper goes into almost everything that is built, traders say copper has a PhD in economics: its price tends to rise when the world economy is growing and fall when it slows. Copper has traded on the London Metal Exchange since 1877.' },
  ],
});

const ch4i = flatSpread({
  key: 'ch4-platinum', title: 'Chapter 5: Platinum, the unwanted silver',
  left: [
    { kicker: 'Platinum' },
    { h1: 'The unwanted “little silver”' },
    { p: 'Long before Europeans arrived, goldsmiths of the La Tolita culture, on the coast of today’s Ecuador and Colombia, made small objects from platinum mixed with gold. They had found a way to work a metal that melts at about 1,770 °C, far hotter than their furnaces.' },
    { fig: 'h-mask', w: 0.11 },
    { p: 'Spanish miners in Colombia met the same grey grains in their gold. They called it platina, “little silver”, and treated it as a nuisance: it was hard to separate from gold, and crooks mixed it into gold to fake it. Colonial officials ordered the separated platina thrown into rivers. In 1748 the Spanish scientist Antonio de Ulloa published one of the first European descriptions of it.' },
  ],
  right: [
    { h2: 'From coins to the kilogram' },
    { p: 'In the 1820s large deposits of platinum were found in Russia’s Ural Mountains. From 1828 to 1845 Russia even made platinum coins of 3, 6 and 12 roubles.' },
    { figs: ['h-rouble', 'h-kilo'], h: 0.09, cap: 'A platinum coin, and a standard weight kept under glass.' },
    { p: 'Platinum does not rust or wear, so scientists used it for measuring standards. From 1889 to 2019 the kilogram itself was defined as the mass of one cylinder of platinum and iridium, kept under glass near Paris. In 2019 it was replaced by a definition based on a constant of physics.' },
    { p: 'In 1924 the geologist Hans Merensky found the Merensky Reef in South Africa, the world’s richest platinum deposit. Fifty years later, US clean-air rules put platinum and palladium into catalytic converters, starting with 1975 model cars.' },
  ],
});

const ch4j = flatSpread({
  key: 'ch4-palladium', title: 'Chapter 5: Palladium, the metal sold in a shop',
  left: [
    { kicker: 'Palladium' },
    { h1: 'The metal sold in a shop' },
    { p: 'In 1802 the English chemist William Hyde Wollaston was purifying platinum when he found a new metal in the leftovers. He named it palladium, after the asteroid Pallas, which had been discovered that same year.' },
    { fig: 'h-lab', w: 0.17, cap: 'A chemist’s bench of the early 1800s.' },
    { p: 'Then he did something strange. Instead of announcing his discovery, in April 1803 he put samples on sale anonymously at Mrs Forster’s shop in Gerrard Street, Soho, as “Palladium, or new silver”. The chemist Richard Chenevix bought the stock, tested it and told the Royal Society it was a fake: a mix of platinum and mercury. The anonymous seller replied by offering £20 to anyone who could make palladium that way. Nobody could. In 1805 Wollaston admitted he was the discoverer and explained how he had found it.' },
  ],
  right: [
    { h2: 'From telephones to tailpipes' },
    { p: 'For most of the 1900s palladium was a small metal used in dentistry, electrical contacts and electronics. In the 1990s carmakers started to use more of it in petrol-car catalysts, and the car industry became its biggest customer.' },
    { figs: ['h-car70', 'converter'], h: 0.06, cap: 'A 1970s car and a catalytic converter.' },
    { p: 'Most palladium came from Russia, and Russian shipments were sometimes held up. Delays in 2000 helped push the price above $1,000 in January 2001. Carmakers had stocked up at high prices, and when the price fell back, Ford took a loss of about $1 billion on its palladium.' },
    { p: 'The pattern came back in 2022. When Russia invaded Ukraine, buyers feared Russian palladium would stop arriving, and the price reached a record of about $3,440 on 7 March 2022.' },
  ],
});

const ch4k = flatSpread({
  key: 'ch4-lessons', title: 'Chapter 5: What history keeps repeating',
  left: [
    { h1: 'What history keeps repeating' },
    { h2: 'Exchanges change the rules' },
    { p: 'When a price runs out of control, the exchange can change the rules in the middle of the game. COMEX did it to silver in January 1980. In 2011 the CME raised silver margins several times within about two weeks, and silver fell from close to $50. In January and February 2026 it raised gold and silver margins again, as both metals fell from record highs.' },
    { h2: 'Squeezes come back' },
    { p: 'A squeeze happens when people who must deliver metal cannot find enough of it. The Hunts tried to create one in 1980. In October 2025 the London silver market ran short of metal and the cost of borrowing silver shot up. The details change; the mechanism is the same.' },
    { fig: 'h-weigh', w: 0.1 },
  ],
  right: [
    { h2: 'Money comes and goes' },
    { p: 'Silver was money for two thousand years and lost that role in the late 1800s. Gold was the base of the money system until 1971 and then became, officially, just a commodity. Yet central banks never sold all their gold, and since 2022 they have been buying more of it than at any time in decades.' },
    { h2: 'Supply sets the background' },
    { p: 'Every new metal age began with a supply shock: Laurion paid for a navy, Potosí flooded the world with silver, California and the Witwatersrand made the gold standard possible, Russia and South Africa made the car catalyst possible. When reading today’s markets, it helps to ask where the next tonne will come from.' },
    { figs: ['h-trireme', 'h-galleon'], h: 0.08, cap: 'Silver paid for both ships: a trireme of Athens and a galleon of Spain.' },
  ],
});
