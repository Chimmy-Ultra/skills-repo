// ======================= Chapter 2 (short): beta and residuals =======================
// Data: Yahoo Finance front-month futures GC=F / SI=F, daily closes, computed 2026-11-14 (see data/ch2_beta.md).
const CH2_CUM = '25-11-21:-1.0,25-11-28:6.6,25-12-05:10.5,25-12-12:13.3,25-12-19:20.5,25-12-26:29.9,26-01-02:29.1,26-01-09:36.3,26-01-16:45.3,26-01-23:49.6,26-01-30:36.9,26-02-06:29.6,26-02-13:30.2,26-02-20:35.4,26-02-27:43.8,26-03-06:36.1,26-03-13:35.1,26-03-20:32.0,26-03-27:34.6,26-04-10:36.4,26-04-17:41.2,26-04-24:38.0,26-05-01:40.0,26-05-08:43.7,26-05-15:44.8,26-05-22:44.2,26-05-29:42.0,26-06-05:39.0,26-06-12:41.1,26-06-26:32.0,26-07-10:32.7,26-07-17:29.1,26-07-24:32.2,26-07-31:29.4,26-08-07:30.7,26-08-14:32.3,26-08-21:32.6,26-08-28:33.0,26-09-04:33.0,26-09-11:32.7,26-09-18:35.3,26-09-25:34.7,26-10-02:32.4,26-10-09:32.0,26-10-16:27.0,26-10-23:26.2,26-10-30:20.7,26-11-06:20.9,26-11-13:20.6';
const CH2_T0 = Date.UTC(2025, 10, 14);
const ch2Day = (s) => (Date.UTC(2000 + +s.slice(0, 2), +s.slice(3, 5) - 1, +s.slice(6, 8)) - CH2_T0) / 864e5;
const CH2_PTS = [[0, 0]].concat(CH2_CUM.split(',').map((e) => { const [d, v] = e.split(':'); return [ch2Day(d), +v]; }));

// cumulative residual with a ±2σ√T noise band (σ = 2.7 % a day, T = trading days ≈ calendar days × 250/365)
function ch2Chart(c, x, y, w) {
  const h = 0.2, size = 0.0158, x0 = x + 0.065, x1 = x + w - 0.012, n = 365, ymin = -40, ymax = 60;
  let top = y;
  const r = c.text({ x, y: top, w, size: size * 1.08, lh: 1.3, italic: true, paras: ['Cumulative residual of silver against gold, %'], color: INK }); if (r) top = r.y0 - 0.006;
  const base = top - h, X = (d) => x0 + (d / n) * (x1 - x0), Y = (v) => base + ((v - ymin) / (ymax - ymin)) * h;
  [-40, -20, 0, 20, 40, 60].forEach((t) => { c.line([[x0, Y(t)], [x1, Y(t)]], t ? 'rgba(42,33,25,0.13)' : 'rgba(42,33,25,0.6)', t ? 0.0009 : 0.0012); c.text({ x: x0 - 0.008, y: Y(t) + size * 0.62, w: 0.06, size, lh: 1.2, align: 'right', paras: [(t > 0 ? '+' : '') + t], color: '#5a4b3d' }); });
  const band = (s) => { const P = []; for (let d = 0; d <= n; d += 3) { const v = s * 2 * 2.7 * Math.sqrt((d * 250) / 365); if (v > ymax || v < ymin) break; P.push([X(d), Y(v)]); } return P; };
  c.line(band(1), 'rgba(45,95,115,0.7)', 0.0012, [0.006, 0.005]); c.line(band(-1), 'rgba(45,95,115,0.7)', 0.0012, [0.006, 0.005]);
  c.line(CH2_PTS.map(([d, v]) => [X(d), Y(v)]), TONE.silver, 0.003);
  c.line(CH2_PTS.map(([d, v]) => [X(d), Y(v)]), 'rgba(60,66,72,0.9)', 0.0012);
  [['Dec', 17], ['Feb', 79], ['Apr', 138], ['Jun', 199], ['Aug', 260], ['Oct', 321]].forEach(([l, d]) => c.text({ x: X(d), y: Y(ymin) - 0.005, w: 0.08, size, lh: 1.2, align: 'center', paras: [l], color: '#4a3d30' }));
  c.text({ x: X(150), y: Y(-22) + size, w: 0.3, size, lh: 1.2, paras: ['dashed lines: ±2σ(ε)√T, the range of pure noise'], color: TONE.blue });
  return y - base + size * 1.6;
}

const ch2a = flatSpread({
  key: 'ch2-model', title: 'Chapter 2: One move, two parts',
  left: [
    { kicker: 'Chapter 2 · Beta and residuals' },
    { h1: 'One move, two parts' },
    { p: 'When silver falls 2% on a day gold barely moves, the natural reaction is to look for a silver headline. A faster first step is to ask how much of silver’s move gold already explains. The part gold explains comes from the shared macro drivers of Chapter 1: real rates and the dollar. Only the part left over needs a silver-specific reason.' },
    { h2: 'Returns, not prices' },
    { p: 'Gold trades near $3,900 an ounce and silver near $49, so a one-dollar move means very different things for the two metals. The comparison is made with percentage changes, called [[returns]]. The return on day t uses the closing prices of day t and the day before:' },
    { eq: 'r_t = \\frac{P_t}{P_{t-1}} - 1' },
    { p: 'A return of −2% means the same thing for both metals: the price fell by 2% of its own level.' },
  ],
  right: [
    { h2: 'The model' },
    { p: 'The model writes silver’s daily return as a part that moves with gold’s return plus a remainder:' },
    { eq: 'r_{S,t} = \\alpha + \\beta\\, r_{G,t} + \\varepsilon_t' },
    { p: 'The coefficient [[beta]] (β) says how many percent silver moves for each 1% move in gold. The term ε is the [[residual]]: the part of silver’s return that gold does not explain. Ordinary least squares picks the β that makes the residuals as small as possible, and the answer is' },
    { eq: '\\beta = \\frac{\\mathrm{Cov}(r_S, r_G)}{\\mathrm{Var}(r_G)} = \\rho\\,\\frac{\\sigma_S}{\\sigma_G}' },
    { p: 'Here ρ is the correlation of the two returns and σ is the standard deviation of each. So β combines two separate facts: how closely the metals move together (ρ) and how much larger silver’s moves are (the ratio σ(S)/σ(G)). The share of silver’s daily variance that gold explains is' },
    { eq: 'R^2 = \\rho^2' },
    { note: 'Say it: “Beta is the correlation times the ratio of the two volatilities.”' },
    { fig: 'glass', w: 0.05 },
  ],
});

const ch2b = flatSpread({
  key: 'ch2-numbers', title: 'Chapter 2: The numbers, and why one day says little',
  left: [
    { h2: 'Real numbers' },
    { p: 'The table uses daily closes of the front-month gold and silver futures in two windows. The second window covers the London silver squeeze and the crash that followed.' },
    { table: { cols: [0.28, 0.36, 0.36], head: ['', 'Nov 2023 – Nov 2025', 'Nov 2025 – Nov 2026'], align: ['l', 'r', 'r'], rows: [
      ['σ gold, per day', '1.14%', '1.77%'], ['σ silver, per day', '1.94%', '4.18%'], ['ρ', '0.70', '0.82'], ['β', '1.20', '1.94'], ['R²', '0.49', '0.67']] } },
    { p: 'In the calmer window silver moved about 1.2% for every 1% in gold, and gold explained about half of silver’s daily variance. In the squeeze year β rose to about 1.9, mainly because silver’s own volatility more than doubled. A β measured in calm months therefore understates how far silver moves in a stressed market.' },
    { note: 'Data: Yahoo Finance, GC=F and SI=F daily closes; computed for this book.' },
  ],
  right: [
    { h2: 'Why one day says little' },
    { p: 'On 13 November 2026 gold fell 0.13% and silver fell 2.28%. With the calm-window β of 1.2, gold explains a silver move of 1.2 × (−0.13%) ≈ −0.16%, so the residual that day was about −2.1%.' },
    { p: 'The size of a typical residual is its standard deviation σ(ε). Over the past year, with β = 1.2, σ(ε) comes to about 2.7% a day. A residual of −2.1% is smaller than one standard deviation, and residuals at least that large occur on more than four days in ten. A single day’s residual is therefore almost always noise, and it does not justify a story.' },
    { h2: 'Add the residuals up' },
    { p: 'Information shows up when residuals keep pointing the same way. The [[cumulative residual]] adds them day by day:' },
    { eq: 'E_T = \\sum_{t=1}^{T} \\varepsilon_t' },
    { p: 'If the residuals were pure noise, E(T) would wander around zero, and its spread would grow only in proportion to σ(ε)\u221aT, the residual\u2019s daily standard deviation times the square root of the number of days.' },
  ],
});

const ch2c = flatSpread({
  key: 'ch2-cumulative', title: 'Chapter 2: Reading a cumulative residual',
  left: [
    { h2: 'A year of silver against gold' },
    { chart: ch2Chart },
    { p: 'The chart uses β = 1.20 from the earlier window and adds up silver’s residuals from 14 November 2025. Between mid-November and 23 January the sum climbed to about +50%. Over those ten weeks (48 trading days) noise alone would give a spread of only' },
    { eq: '\\sigma_\\varepsilon \\sqrt{T} \\approx 2.7\\% \\times \\sqrt{48} \\approx 19\\%', size: 0.024 },
    { p: 'so +50% is about 2.6 times that and well outside the dashed band. Silver rose far more than gold explains: this was the run-up that followed the October 2025 London squeeze, driven by buying aimed at silver itself. On 30 January a single day took away about 18 points.' },
  ],
  right: [
    { h2: 'Where residuals come from' },
    { p: 'A residual that keeps growing needs a cause that belongs to silver and not to gold. The causes fall into three groups. Industrial demand: copper prices, solar installations and the business cycle move silver’s industrial half. Positioning: a squeeze, forced selling or a margin hike moves silver more than gold. Silver’s own supply and stocks: by-product mine output, recycling and the metal available in London.' },
    { h2: 'When the method misleads' },
    { p: 'First, β changes over time, as the table showed, so an old β can turn a change in volatility into a false residual. Second, β should be estimated on an earlier window: least squares with an intercept makes the residuals of its own window add up to exactly zero, so the cumulative residual always returns to zero at the end of that window. Third, continuous futures series jump when the front contract rolls, and those jumps appear as residuals.' },
  ],
});
