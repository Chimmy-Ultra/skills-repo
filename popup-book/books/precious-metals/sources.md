# Sources — Gold, Silver, Palladium (chapters 1–3)

Checked 2026-11-14. "Computed" = calculated for this book from the data files in `data/`.

## Chapter 1
- WGC, Gold Demand Trends Q4 & FY2025, Table 1 (demand by sector, supply, mine 3,671.6 t, recycling 1,404.3 t): https://www.gold.org/goldhub/research/gold-demand-trends/gold-demand-trends-full-year-2025
- WGC, Gold Demand Trends Q3 2026, central banks (675 t Q1–Q3): https://www.gold.org/goldhub/research/gold-demand-trends/gold-demand-trends-q3-2026/central-banks
- WGC, Central Bank Gold Reserves Survey 2026 (76 respondents; 45% / 89%; reasons 90/84/82%): https://www.gold.org/news-and-events/press-releases/central-banks-set-step-gold-buying-over-next-year
- CNBC citing WGC 2025 survey (19 of 36 buy from domestic ASM): https://www.nbcwashington.com/news/business/money-report/central-banks-are-increasingly-buying-gold-from-local-mines-as-prices-surge/3957374/
- BIS gold services: https://www.bis.org/about/banking/services
- Bank of Russia, 27 Feb 2022, domestic purchases resume 28 Feb: https://cbr.ru/eng/press/pr/?id=36015
- Bank of England gold statistics (185,893k oz on 30 Sep 2026 ≈ 5,782 t) and Bank Insights 23 Sep 2026 (≈400,000 bars, ≈60% of London gold): https://www.bankofengland.co.uk/statistics/gold ; https://www.bankofengland.co.uk/bank-insights/2026/banking-services-for-central-bank-customers ; owns two bars: https://www.bankofengland.co.uk/gold
- LBMA London vault data (end-Oct 2026: 9,850 t gold, 28,889 t silver): https://www.lbma.org.uk/prices-and-data/london-vault-data
- WGC Gold Market Primer, market size (≈220,700 t above ground, end-2025): https://www.gold.org/goldhub/research/market-primer/gold-market-primer-market-size-and-structure
- WGC mine production series 2010–2025 (from the course doc; WGC GDT annual reports, Metals Focus).
- USGS: reserves ≈66,000 t, production ≈3,300 t (from the course doc); copper ≈23 Mt.
- Silver Institute / Metals Focus, World Silver Survey 2026 (demand by use, supply 1,090.4 Moz, mine 846.6, recycling 197.6, deficit −40.3, 5th year, 762.1 Moz cumulative 2021–26F, mine output by source metal): https://silverinstitute.org/wp-content/uploads/2026/04/World-Silver-Survey-2026.pdf
- PV silver use 2024/25/26F (198/187/151 Moz): Mercom — https://www.mercomindia.com/silver-demand-forecast-to-drop-19-in-2026-on-lower-solar-cell-loadings
- WGC, "Gold the safe haven versus silver the wildcard" (Mar 2026; volumes, spreads): https://www.gold.org/goldhub/research/gold-safe-haven-versus-silver-wildcard
- Goldman Sachs "one-ninth" via investingLive (Oct 2025): https://investinglive.com/commodities/silver-hits-record-above-5270-as-squeeze-intensifies-goldman-warns-of-volatility-20251014
- StoneX (silver volatility 2–2.5× gold): https://www.stonex.com/en/insights/silver-amplifies-gold-in-both-directions-and-this-time-it-cut-deeper/
- CME, gold–silver correlation ≈0.8: https://www.cmegroup.com/insights/economic-research/2025/four-major-drivers-of-the-gold-silver-price-ratio.html
- LBMA Alchemist 99 (ratio >123 on 19 Mar 2020; ≈16 in 1980; 31 in Apr 2011): https://www.lbma.org.uk/alchemist/issue-99/will-the-true-gold-silver-ratio-please-stand-up
- Johnson Matthey PGM Market Report, May 2026 (palladium demand/supply/balance, BEV shares, Russia lowest in two decades, Euro 7 substitution): https://matthey.com/documents/161599/509428/pgm-market-report-26.pdf
- SFA (Oxford) for IPA, PGM Fact Sheet Palladium 2026 (81% autocatalyst; Russia 43%, South Africa 35%; ≈197 t mined 2025): https://ipa-news.com/assets/pdfs/factsheets/2026-05-ipa-palladium-factsheet.pdf
- WPIC (Jan 2024), platinum-for-palladium substitution 620/700 koz: https://platinuminvestment.com/investment-research/perspectives/platinum-for-palladium-substitution-is-embedded-into-automotive-demand-and-unlikely-to-reverse-swiftly
- Palladium record $3,440 on 7 Mar 2022 (CNBC/Reuters): https://www.cnbc.com/amp/2022/03/07/gold-markets-palladium-russia-ukraine-crisis.html ; Jan 2001 ≈$1,090 (Coin World); 2026 levels: Trading Economics palladium/platinum pages.

## Chapter 2
- Daily closes GC=F, SI=F from Yahoo Finance chart API, 2023-11 to 2026-11-13. Computed: β, ρ, σ for both windows; cumulative residual with β = 1.201. See `data/ch2_beta.md`.

## Chapter 3
- FRED DFII10, T10YIE, DGS10, DGS2, DTWEXBGS (quarterly averages in `data/fred_quarterly.csv`; daily extremes: −1.19% on 2021-08-03, 2.95% on 2026-10-05, 2.86% on 2026-11-12).
- Gold quarterly averages: Yahoo Finance GC=F. Computed correlations and the −0.14 regression slope.
- Erb & Harvey, "The Golden Dilemma", FAJ 2013: https://people.duke.edu/~charvey/Research/Published_Papers/P113_The_golden_dilemma.pdf
- Chicago Fed Letter 464 (2021): https://www.chicagofed.org/publications/chicago-fed-letter/2021/464
- WGC, May 2022 (model 21% below): https://www.gold.org/goldhub/gold-focus/2022/05/you-asked-we-answered-explaining-golds-recent-performance
- ECB, The international role of the euro, June 2025, box on gold: https://www.ecb.europa.eu/press/other-publications/ire/focus/html/ecb.irebox202506_01~f93400a4aa.en.html
- RBC Wealth Management, "Gold's regime change?" (June 2025): https://www.rbcwealthmanagement.com/en-us/insights/golds-regime-change
- CME OpenMarkets, gold and the dollar (May 2025): https://www.cmegroup.com/openmarkets/metals/2025/Gold-and-the-US-Dollar-An-Evolving-Relationship.html
- CME FedWatch methodology: https://www.cmegroup.com/articles/2023/understanding-the-cme-group-fedwatch-tool-methodology.html
- Hanson & Stein, "Monetary Policy and Long-Term Real Rates": https://www.federalreserve.gov/econres/feds/monetary-policy-and-long-term-real-rates.htm
- Elder, Miao & Ramchander (2012), J. Banking & Finance 36(1): https://ideas.repec.org/a/eee/jbfina/v36y2012i1p51-65.html
- BLS schedules (CPI, PPI, Employment Situation, 8:30 ET); BEA schedule (PCE).
- 2026 events: Reuters via Kitco (29 Jan records; 6 Feb margins), Reuters via Pakistan Today (30 Jan), Bloomberg via BNN (24 Jun), Al Jazeera (16 Sep hike), stockanalysis.com (28 Oct hold), Nation Thailand (30 Oct low), Trading Economics (12–13 Nov CPI and FedWatch odds).

## Chapter 4 (history)
- Lydian electrum lion coins under Alyattes (c. 610–560 BC); Croesus's separate gold and silver coins (c. 550 BC): World History Encyclopedia (worldhistory.org/article/797); CoinWeek; rjohara.net; British Museum via Willamette.
- Laurion silver strike 483 BC, Themistocles' 200 triremes, Salamis 480 BC: Britannica (Themistocles); Livius; HistoryOfWar.
- Uluburun wreck c. 1300 BC, ~10 t copper (354 ingots, mostly oxhide), ~1 t tin, Cypriot copper: Pulak 2008 (Penn State reading); Biblical Archaeology Society; Wikipedia "Oxhide ingot".
- Potosí 1545, mita, mercury; Manila galleons (annual from 1571, route 1565–1815); Ming single-whip silver taxes: Flynn & Giráldez "Born with a silver spoon"; Kris Lane, "Potosí" (review); 15-Minute History ep. 81.
- Newton 1717 guinea = 21 shillings; Coinage Act 1816, sovereign 1817, formal gold standard 1821: World Finance; Baldwin's; MoneyWeek.
- Executive Order 6102 (5 Apr 1933); Gold Reserve Act (30 Jan 1934), $20.67 → $35: Wikipedia/EBSCO summaries of EO 6102 and the Gold Reserve Act.
- UK sales: 395 t in 17 auctions, Jul 1999–Mar 2002, average ≈$275: HM Treasury FOI release (gov.uk); Washington Agreement 26 Sep 1999, 15 European central banks, 400 t/yr: Telegraph via Yahoo; Numismatic News.
- Hunt brothers: COMEX position limits 7 Jan 1980, liquidation-only 21 Jan 1980, peak $49.45 on 17 Jan 1980, $10.80 on 27 Mar 1980: Wikipedia "Silver Thursday" (citing SEC report and Minpeco v. Hunt); Money Metals; Fortune (1980).
- Silver 2011: five CME margin increases in about eight trading days from 25 Apr 2011, high $49.51 on 28 Apr: InvestmentNews/Bloomberg; WSJ via blog; Market Oracle.
- Chuquicamata large-scale operations from 1915: Britannica; Codelco annual report 2015. Chile largest producer since 1983.
- EV ≈3× copper of a combustion car: Deutsches Kupferinstitut; International Copper Association (IDTechEx: BEV 83 kg vs ICE up to 23 kg).
- La Tolita platinum–gold work: Banco de la República (Boletín Museo del Oro); Scott & Bray (1980). Ulloa 1748: Johnson Matthey Technology Review 36(1); Gervilla et al. (Mineralogical Magazine 2020); platina thrown into rivers: Gervilla, "Edad del platino en España".
- Russian platinum coins 1828–1845 (3, 6, 12 roubles): Platinum Metals Review 50(3) (Rehren 2006); Wikipedia.
- Merensky Reef 1924: Cawthorn, S. Afr. J. Geol. 1999. Catalytic converters for 1975 model cars: Science History Institute, "Clean Machine".
- Wollaston and palladium: Chemistry World, "Two men, two centuries, four metals"; Encyclopedia.com (DSB); Dictionary of National Biography; Chenevix, Phil. Trans. 1803.
- Palladium record London fix $1,094 on 26 Jan 2001; Ford ≈$1 bn write-down announced Jan 2002: WardsAuto; USGS Mineral Industry Surveys Jan 2002; Northern Miner.
- Plates: Gemini engravings made for this book; the standard weight in Plate is generic, not the platinum–iridium prototype.
