// ======================= Chapter 6: Phase space =======================

// the pendulum's phase portrait, drawn faintly behind other plots or strongly on its own
const PEND_TONE = { lib: TONE.rose, sep: TONE.lav, rot: TONE.mint };
const pendCurves = (faint) => FIG.pend.map((c) => ({ pts: c.q.map((q, i) => [q, c.p[i]]), tone: faint ? 'rgba(138,118,184,0.28)' : PEND_TONE[c.kind], w: faint ? 0.0012 : c.kind === 'sep' ? 0.003 : 0.0022, dash: c.kind === 'sep' && !faint ? [0.007, 0.004] : null }));
const PI_TICKS = { xt: [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI], xf: (v) => ['−π', '−π/2', '0', 'π/2', 'π'][Math.round(v / (Math.PI / 2)) + 2] };

const ch6_a = flatSpread({
  key: 'c6-portrait', title: 'Chapter 6: The pendulum in phase space',
  left: [
    { fig: 'c6', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 6' },
    { h1: 'Phase space' },
    { p: 'A point in phase space is a complete state: where the system is and how it moves. Hamilton’s equations move each point along its own curve. If we draw many of these curves at once, we see every possible motion of the system in one picture, the [[phase portrait]].' },
  ],
  right: [
    { h2: 'The pendulum, all at once' },
    { p: 'For the pendulum, $q$ is the angle and $p = m\\ell^{2}\\dot q$. Choose units in which $m\\ell^{2} = 1$ and $g/\\ell = 1$. Then:' },
    { eq: 'H = \\frac{p^{2}}{2} - \\cos q' },
    { p: 'The energy is conserved, so each motion stays on one curve $H = E$. Solve for $p$:' },
    { eq: 'p = \\pm\\sqrt{2\\,\\bigl(E + \\cos q\\bigr)}' },
    { chart: xyPlot({ curves: pendCurves(false), ...PI_TICKS, xr: [-Math.PI, Math.PI], yr: [-2.8, 2.8], yt: [-2, -1, 0, 1, 2], xlab: '$q$', ylab: '$p$', h: 0.15, zero: true }) },
    { p: 'For $E < 1$ the curves are closed: the pendulum swings back and forth ([[libration]]). For $E > 1$ they run across the whole picture: it goes over the top ([[rotation]]). The dashed curve $E = 1$, the [[separatrix]], divides the two kinds of motion.' },
  ],
});

const ch6_b = flatSpread({
  key: 'c6-liouville', title: 'Chapter 6: Liouville’s theorem',
  left: [
    { h1: 'Liouville’s theorem' },
    { p: 'Start not one pendulum but a whole square of them: angles from $-0.3$ to $0.3$, momenta from $1.3$ to $1.9$. Every point of the square is a separate pendulum, and each one moves along its own curve. Their energies run from $-0.16$ to $0.85$, close to the separatrix at $E = 1$.' },
    { p: 'Near the separatrix a pendulum with more energy takes much longer to come back, so the square is pulled out of shape. After 16 time units it is a long, thin, curved strip. Its area, however, does not change. Computed for a boundary of 2,000 points:' },
    { table: { cols: [0.5, 0.5], head: ['time', 'area of the region'], align: ['l', 'r'], rows: [['0', '0.360'], ['4', '0.360'], ['16', '0.360']] } },
    { p: 'This is [[Liouville’s theorem]] (1838): the flow of Hamilton’s equations keeps phase-space areas, and in more dimensions volumes, the same.' },
  ],
  right: [
    { chart: xyPlot({
      curves: pendCurves(true).concat(FIG.blobs.map((b, k) => ({ pts: b.q.map((q, i) => [q, b.p[i]]).concat([[b.q[0], b.p[0]]]), tone: [TONE.rose, TONE.lav, TONE.mint][k], w: 0.0022, fill: ['rgba(192,98,127,0.3)', 'rgba(138,118,184,0.3)', 'rgba(79,154,130,0.3)'][k] }))),
      ...PI_TICKS, xr: [-Math.PI, Math.PI], yr: [-2.2, 2.2], yt: [-2, -1, 0, 1, 2], xlab: '$q$', ylab: '$p$', h: 0.2, zero: true }) },
    { note: 'Rose: the square at $t = 0$. Lavender: $t = 4$. Green: $t = 16$. Faint curves: the phase portrait.' },
    { h2: 'Why the area cannot change' },
    { p: 'The velocity of a point in phase space is $(\\dot q, \\dot p)$. A region grows or shrinks according to the [[divergence]] of this velocity. Use Hamilton’s equations:' },
    { eq: '\\frac{\\partial \\dot q}{\\partial q} + \\frac{\\partial \\dot p}{\\partial p} = \\frac{\\partial}{\\partial q}\\frac{\\partial H}{\\partial p} - \\frac{\\partial}{\\partial p}\\frac{\\partial H}{\\partial q} = 0', size: 0.024 },
    { p: 'The two mixed second derivatives of $H$ are equal, so they cancel. The flow has no sources and no sinks: what enters a region on one side leaves on the other.' },
  ],
});

// Henon-Heiles section: alternate colours by orbit
const HH_TONES = ['rgba(192,98,127,0.85)', 'rgba(138,118,184,0.85)', 'rgba(79,154,130,0.85)', 'rgba(192,154,82,0.9)', 'rgba(95,127,174,0.85)'];

const ch6_c = flatSpread({
  key: 'c6-poincare', title: 'Chapter 6: A glimpse of chaos',
  left: [
    { h1: 'A glimpse of chaos' },
    { p: 'In 1964 the astronomers Michel Hénon and Carl Heiles asked whether a star moving in a galaxy has a third conserved quantity, besides the two already known. Their simplified model is a particle in a plane, where only the energy is known to be conserved:' },
    { eq: 'H = \\frac{1}{2}\\bigl(p_x^{2} + p_y^{2}\\bigr) + \\frac{1}{2}\\bigl(x^{2} + y^{2}\\bigr) + x^{2}y - \\frac{1}{3}\\,y^{3}', size: 0.023 },
    { p: 'Phase space now has four dimensions, $(x, y, p_x, p_y)$, too many to draw. The energy fixes one of them. To see the rest, Henri Poincaré’s trick is to mark the point $(y, p_y)$ each time the orbit crosses $x = 0$ moving to the right. This is a [[Poincaré section]].' },
    { fig: 'galaxy', w: 0.2, tape: true },
  ],
  right: [
    { chart: xyPlot({ dots: FIG.hh.map((o, k) => ({ pts: o, tone: HH_TONES[k % HH_TONES.length], r: 0.0013 })), xr: [-0.5, 0.75], yr: [-0.55, 0.55], xt: [-0.4, -0.2, 0, 0.2, 0.4, 0.6], yt: [-0.4, -0.2, 0, 0.2, 0.4], yf: (v) => v.toFixed(1), xf: (v) => v.toFixed(1), xlab: '$y$', ylab: '$p_y$', h: 0.25, aspect: 1 }) },
    { note: '25 orbits at energy $E = 1/8$, each a different colour; about 2,200 crossings in all.' },
    { p: 'An orbit with a hidden conserved quantity is confined to a curve, so its marks line up into a closed loop. An orbit without one scatters its marks over a whole area. At this energy both kinds appear: loops inside islands, and a dusty sea between them.' },
    { p: 'The scattered orbits are chaotic in the same sense as the double pendulum of Chapter 3: two nearby starts separate quickly.' },
  ],
});

const ch6_d = flatSpread({
  key: 'c6-onwards', title: 'Chapter 6: Where these ideas lead',
  left: [
    { h1: 'Where these ideas lead' },
    { h2: 'Statistical mechanics' },
    { p: 'A gas has about $10^{23}$ molecules, so its phase space has about $6\\times 10^{23}$ dimensions. Nobody can follow one point there. Statistical mechanics follows a [[distribution]] of points instead.' },
    { p: 'Liouville’s theorem says the density of points does not change as we move along with them. A distribution spread evenly over the thin shell between $H = E$ and $H = E + \\delta E$ therefore stays even forever. This stationary distribution is the starting point of statistical mechanics: the [[microcanonical ensemble]].' },
    { fig: 'gasbox', w: 0.2, tape: true },
  ],
  right: [
    { h2: 'Quantum mechanics' },
    { p: 'For two functions $f$ and $g$ on phase space, define the [[Poisson bracket]]:' },
    { eq: '\\{f, g\\} = \\frac{\\partial f}{\\partial q}\\frac{\\partial g}{\\partial p} - \\frac{\\partial f}{\\partial p}\\frac{\\partial g}{\\partial q}' },
    { p: 'For any $f(q, p)$, the chain rule and Hamilton’s equations give its rate of change:' },
    { eq: '\\dot f = \\frac{\\partial f}{\\partial q}\\,\\dot q + \\frac{\\partial f}{\\partial p}\\,\\dot p = \\frac{\\partial f}{\\partial q}\\frac{\\partial H}{\\partial p} - \\frac{\\partial f}{\\partial p}\\frac{\\partial H}{\\partial q} = \\{f, H\\}', size: 0.0205 },
    { p: 'The most basic bracket is $\\{q, p\\} = 1$. In 1925 Paul Dirac saw that quantum mechanics has the same structure, with the bracket replaced by a commutator divided by $i\\hbar$:' },
    { eq: '\\{q, p\\} = 1 \\quad\\longrightarrow\\quad [\\hat x, \\hat p] = i\\hbar' },
    { p: 'The road from Newton’s forces to the action, to Hamilton’s phase space, ends at the door of quantum theory.' },
    { fig: 'orrery', w: 0.2, tape: true },
  ],
});
