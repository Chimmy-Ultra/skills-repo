// ======================= Chapter 2: The principle of least action =======================
// Numbers: tools/figs.py (FIG in 05-data.js).

const C_LIGHT = 0.299792458;   // metres per nanosecond

const ch2_a = flatSpread({
  key: 'c2-fermat', title: 'Chapter 2: Light takes the quickest path',
  left: [
    { fig: 'c2', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 2' },
    { h1: 'The principle of least action' },
    { p: 'In 1662 Pierre de Fermat answered a question about light with a question about paths. Light goes from a point A to a point B. Of all the paths between them, it takes the one that needs the least time. This is [[Fermat’s principle]].' },
    { p: 'Light travels more slowly in water than in air, by the factor $n = 1.33$. So the quickest path from a point in air to a point under water is not a straight line.' },
  ],
  right: [
    { h2: 'From air into water' },
    { p: 'Put A 1 m above the water surface and B 1 m below it, 2 m further along. The light crosses the surface at a distance $x$ along. Its travel time is the length in air divided by $c$, plus the length in water divided by $c/n$:' },
    { eq: 't(x) = \\frac{\\sqrt{a^{2} + x^{2}}}{c} + \\frac{n\\sqrt{b^{2} + (d - x)^{2}}}{c}', size: 0.025 },
    { chart: xyPlot({
      curves: [{ pts: FIG.fermat.x.map((x, i) => [x, FIG.fermat.t[i] / C_LIGHT]), tone: TONE.rose }],
      marks: [{ x: FIG.fermat.xm, y: FIG.fermat.tm / C_LIGHT, dot: true, label: 'quickest', tone: TONE.red, dx: -0.03, dy: 0.03 },
        { x: 1, y: (Math.SQRT2 * 2.33) / C_LIGHT, dot: true, label: 'straight line', tone: TONE.lav, dx: -0.115, dy: 0.012 }],
      xr: [0, 2], yr: [10.8, 11.6], xt: [0, 0.5, 1, 1.5, 2], yt: [10.8, 11.0, 11.2, 11.4, 11.6], yf: (v) => v.toFixed(1),
      xlab: '$x$ (m)', ylab: 'travel time (ns)', h: 0.125 }) },
    { p: 'The quickest path crosses at $x = 1.27$ m and takes 10.88 ns. The straight line from A to B takes 10.99 ns. Set the slope to zero to find the minimum:' },
    { eq: '\\frac{dt}{dx} = \\frac{1}{c}\\left[\\frac{x}{\\sqrt{a^{2}+x^{2}}} - \\frac{n\\,(d-x)}{\\sqrt{b^{2}+(d-x)^{2}}}\\right] = 0', size: 0.023 },
    { p: 'The first fraction is $\\sin\\theta_1$, the second is $\\sin\\theta_2$, with the angles measured from the vertical. So $\\sin\\theta_1 = n\\sin\\theta_2$: the law of refraction comes out of a minimum.' },
  ],
});

const ch2_b = flatSpread({
  key: 'c2-action', title: 'Chapter 2: The action of a path',
  left: [
    { h1: 'The action of a path' },
    { p: 'Can a moving ball follow a rule like Fermat’s? For a body with kinetic energy $T$ and potential energy $V$, define the [[Lagrangian]] $L = T - V$. The [[action]] of a path is the integral of $L$ along it, from the start time to the end time:' },
    { eq: 'S = \\int_{t_1}^{t_2} \\bigl(T - V\\bigr)\\,dt' },
    { p: 'Every path between the same two events has its own action. Take the ball of Chapter 1 with mass $m = 0.2$ kg. It leaves the ground at $t = 0$ and is back on the ground at $t = 2$ s. For a height $y(t)$:' },
    { eq: 'S = \\int_{0}^{2\\,\\mathrm{s}} \\Bigl(\\frac{1}{2}\\,m\\,\\dot y^{2} - m g\\,y\\Bigr)\\,dt', size: 0.026 },
    { p: 'The table compares the true parabola with five other paths that start and end at the same events. Each action was computed numerically.' },
    { fig: 'apple', w: 0.15, tape: true },
  ],
  right: [
    { chart: xyPlot({
      curves: [
        { pts: FIG.actionT.map((t, i) => [t, FIG.actionPaths['stays on the ground'][i]]), tone: TONE.grey, w: 0.0022 },
        { pts: FIG.actionT.map((t, i) => [t, FIG.actionPaths['twice as high'][i]]), tone: TONE.grey, w: 0.0022, dash: [0.006, 0.004] },
        { pts: FIG.actionT.map((t, i) => [t, FIG.actionPaths['straight up, straight down'][i]]), tone: TONE.lav, w: 0.0022 },
        { pts: FIG.actionT.map((t, i) => [t, FIG.actionPaths['parabola + 1 m bump'][i]]), tone: TONE.mint, w: 0.0022 },
        { pts: FIG.actionT.map((t, i) => [t, FIG.actionPaths['parabola - 1 m dip'][i]]), tone: TONE.mint, w: 0.0022, dash: [0.006, 0.004] },
        { pts: FIG.actionT.map((t, i) => [t, FIG.actionPaths['true path (parabola)'][i]]), tone: TONE.rose, w: 0.0034 }],
      xr: [0, 2], yr: [0, 10], xt: [0, 0.5, 1, 1.5, 2], yt: [0, 5, 10], xlab: '$t$ (s)', ylab: 'height $y$ (m)', h: 0.14 }) },
    { table: { cols: [0.66, 0.34], head: ['Path from (0 s, 0 m) to (2 s, 0 m)', 'Action S (J·s)'], align: ['l', 'r'], rows: [
      ['True path: the parabola of Chapter 1', '−6.40'],
      ['Parabola with a 1 m bump added', '−6.16'],
      ['Parabola with a 1 m dip added', '−6.16'],
      ['Straight up to 4.9 m, straight down', '−4.80'],
      ['A parabola twice as high', '0.00'],
      ['Stays on the ground', '0.00']] } },
    { p: 'The true path has the smallest action of all six. Any other path we try also has a larger action. This is the [[principle of least action]].' },
  ],
});

const ch2_c = flatSpread({
  key: 'c2-euler', title: 'Chapter 2: The Euler–Lagrange equation',
  left: [
    { h1: 'From the action to an equation' },
    { p: 'We want the condition that picks out the true path $q(t)$. Change the path a little: add $\\varepsilon\\,\\eta(t)$, where $\\eta$ is any smooth function that is zero at both ends, so the new path starts and ends at the same events.' },
    { eq: 'q(t) \\;\\to\\; q(t) + \\varepsilon\\,\\eta(t), \\qquad \\eta(t_1) = \\eta(t_2) = 0', size: 0.025 },
    { p: 'The action becomes a function of the number $\\varepsilon$. On the true path the action is smallest, so its slope at $\\varepsilon = 0$ must be zero. Differentiate under the integral with the chain rule:' },
    { eq: '\\frac{dS}{d\\varepsilon}\\Big|_{\\varepsilon = 0} = \\int_{t_1}^{t_2}\\Bigl(\\frac{\\partial L}{\\partial q}\\,\\eta + \\frac{\\partial L}{\\partial \\dot q}\\,\\dot\\eta\\Bigr)\\,dt', size: 0.025 },
    { p: 'The second term contains $\\dot\\eta$. Integrate it by parts to move the time derivative onto $\\partial L/\\partial\\dot q$:' },
    { eq: '\\int_{t_1}^{t_2}\\frac{\\partial L}{\\partial \\dot q}\\,\\dot\\eta\\,dt = \\Bigl[\\frac{\\partial L}{\\partial \\dot q}\\,\\eta\\Bigr]_{t_1}^{t_2} - \\int_{t_1}^{t_2}\\frac{d}{dt}\\Bigl(\\frac{\\partial L}{\\partial \\dot q}\\Bigr)\\,\\eta\\,dt', size: 0.022 },
    { p: 'The bracket is zero, because $\\eta$ is zero at both ends.' },
  ],
  right: [
    { p: 'Put the remaining integral back. Both terms now multiply $\\eta$:' },
    { eq: '\\frac{dS}{d\\varepsilon}\\Big|_{\\varepsilon = 0} = \\int_{t_1}^{t_2}\\Bigl(\\frac{\\partial L}{\\partial q} - \\frac{d}{dt}\\frac{\\partial L}{\\partial \\dot q}\\Bigr)\\,\\eta\\,dt = 0', size: 0.024 },
    { p: 'This must hold for every $\\eta$. If the bracket were not zero at some moment, an $\\eta$ that is positive only near that moment would make the integral non-zero. So the bracket is zero at every moment: the [[Euler–Lagrange equation]].' },
    { eq: '\\frac{d}{dt}\\,\\frac{\\partial L}{\\partial \\dot q} - \\frac{\\partial L}{\\partial q} = 0', size: 0.03 },
    { p: 'Check with the ball, $L = \\frac{1}{2}m\\dot y^{2} - mgy$: $\\partial L/\\partial\\dot y = m\\dot y$, and $\\partial L/\\partial y = -mg$. The equation gives $m\\ddot y + mg = 0$, which is Newton’s law, with no forces split into components.' },
    { chart: xyPlot({ curves: [{ pts: FIG.actionEps, tone: TONE.rose }], marks: [{ x: 0, y: -6.403, dot: true, label: 'true path', tone: TONE.red, dx: 0.008, dy: 0.026 }],
      xr: [-1.5, 1.5], yr: [-6.5, -5.8], xt: [-1.5, -1, -0.5, 0, 0.5, 1, 1.5], yt: [-6.4, -6.2, -6.0, -5.8], yf: (v) => v.toFixed(1), xlab: 'size of the bump $\\varepsilon$ (m)', ylab: 'action $S$ (J·s)', h: 0.085 }) },
    { note: 'For the ball with $\\eta = \\sin(\\pi t/2\\,\\mathrm{s})$, the action grows as $0.247\\,\\varepsilon^{2}$ on both sides of the true path.' },
  ],
});

const ch2_d = flatSpread({
  key: 'c2-stationary', title: 'Chapter 2: Stationary, not least',
  left: [
    { h1: 'Stationary, not always least' },
    { p: 'Our derivation used only one fact: the slope $dS/d\\varepsilon$ is zero on the true path. It never used that the action is smallest. A zero slope can also belong to a maximum or a saddle. The careful name is the [[principle of stationary action]].' },
    { p: 'A mass on a spring shows when “least” fails. Take $m = 1$ kg and spring constant $k = 1$ N/m, so the angular frequency is $\\omega = 1$ rad/s and one full oscillation takes $2\\pi$ s.' },
    { eq: 'L = \\frac{1}{2}\\,m\\,\\dot x^{2} - \\frac{1}{2}\\,k\\,x^{2}' },
    { p: 'Put $x + \\varepsilon\\eta$ into $L$ and expand the squares:' },
    { eq: 'L(x + \\varepsilon\\eta) = L(x) + \\varepsilon\\,\\bigl(m\\dot x\\dot\\eta - k x\\eta\\bigr) + \\frac{\\varepsilon^{2}}{2}\\bigl(m\\dot\\eta^{2} - k\\eta^{2}\\bigr)', size: 0.021 },
    { p: 'On the true path the middle term integrates to zero; that is exactly the Euler–Lagrange equation. So the change of the action is:' },
    { eq: 'S(\\varepsilon) - S(0) = \\frac{\\varepsilon^{2}}{2}\\int_{0}^{T}\\bigl(m\\dot\\eta^{2} - k\\eta^{2}\\bigr)\\,dt', size: 0.025 },
  ],
  right: [
    { p: 'Try $\\eta = \\sin(j\\pi t/T)$ with $j = 1$ or 2. Both integrals are simple: $\\int\\dot\\eta^{2}dt = (j\\pi/T)^{2}\\,T/2$ and $\\int\\eta^{2}dt = T/2$. With $m = k = 1$:' },
    { eq: 'S(\\varepsilon) - S(0) = \\frac{\\varepsilon^{2}\\,T}{4}\\Bigl[\\Bigl(\\frac{j\\pi}{T}\\Bigr)^{2} - 1\\Bigr]', size: 0.027 },
    { table: { cols: [0.34, 0.33, 0.33], head: ['Change of S / ε²', 'T = 2 s', 'T = 4 s'], align: ['l', 'r', 'r'], rows: [
      ['$j = 1$', '+0.734', '−0.383'], ['$j = 2$', '+4.435', '+1.467']] } },
    { p: 'For $T = 2$ s every change raises the action: the true path is a minimum. For $T = 4$ s the $j = 1$ change lowers it and the $j = 2$ change raises it. The true path is a saddle.' },
    { p: 'The switch happens at $T = \\pi$ s, half of one oscillation, where $(\\pi/T)^{2} = 1$. For longer times the action is stationary but no longer least. The motion is the same in both cases, because the Euler–Lagrange equation only asks for a zero slope.' },
    { fig: 'spring', w: 0.2, tape: true },
  ],
});
