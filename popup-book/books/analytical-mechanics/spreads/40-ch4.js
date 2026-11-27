// ======================= Chapter 4: Symmetry and conservation =======================

const ch4_a = flatSpread({
  key: 'c4-cyclic', title: 'Chapter 4: Coordinates that do not appear',
  left: [
    { fig: 'c4', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 4' },
    { h1: 'Symmetry and conservation' },
    { p: 'For each coordinate $q$, define its [[generalized momentum]]:' },
    { eq: 'p = \\frac{\\partial L}{\\partial \\dot q}' },
    { p: 'With this name, the Euler–Lagrange equation reads $\\dot p = \\partial L/\\partial q$: the momentum changes only as fast as $L$ changes with $q$.' },
  ],
  right: [
    { h2: 'Coordinates that do not appear' },
    { p: 'Sometimes a coordinate does not appear in $L$ at all; only its velocity does. Such a coordinate is called [[cyclic]]. Then $\\partial L/\\partial q = 0$, and the equation says:' },
    { eq: '\\dot p = 0 \\quad\\Rightarrow\\quad p = \\text{const}' },
    { p: 'Two examples. A free particle has $L = \\frac{1}{2}m\\dot x^{2}$. The position $x$ does not appear, so $p_x = m\\dot x$ is constant: this is the ordinary momentum.' },
    { fig: 'cart', w: 0.2, tape: true },
    { p: 'The planet of Chapter 3 has $L = \\frac{1}{2}m(\\dot r^{2} + r^{2}\\dot\\varphi^{2}) + k/r$. The angle $\\varphi$ does not appear, so $p_\\varphi = mr^{2}\\dot\\varphi$ is constant: this is the angular momentum.' },
    { p: 'In both cases the conserved quantity came from something $L$ does not care about: where the particle is, or which way the planet points.' },
  ],
});

const ch4_b = flatSpread({
  key: 'c4-energy', title: 'Chapter 4: Energy from time',
  left: [
    { h1: 'Energy from time' },
    { p: 'Suppose $L$ does not depend on time directly: $\\partial L/\\partial t = 0$. Take the total time derivative of $L$ along the motion, using the chain rule:' },
    { eq: '\\frac{dL}{dt} = \\frac{\\partial L}{\\partial q}\\,\\dot q + \\frac{\\partial L}{\\partial \\dot q}\\,\\ddot q' },
    { p: 'The Euler–Lagrange equation lets us replace $\\partial L/\\partial q$ with $\\frac{d}{dt}\\,\\partial L/\\partial\\dot q$:' },
    { eq: '\\frac{dL}{dt} = \\Bigl(\\frac{d}{dt}\\frac{\\partial L}{\\partial \\dot q}\\Bigr)\\dot q + \\frac{\\partial L}{\\partial \\dot q}\\,\\ddot q = \\frac{d}{dt}\\Bigl(\\frac{\\partial L}{\\partial \\dot q}\\,\\dot q\\Bigr)', size: 0.023 },
    { p: 'The right side is the product rule backwards. Move everything to one side:' },
    { eq: '\\frac{d}{dt}\\Bigl(\\dot q\\,\\frac{\\partial L}{\\partial \\dot q} - L\\Bigr) = 0' },
    { p: 'So the [[energy function]] $h = \\dot q\\,\\partial L/\\partial\\dot q - L$ is conserved. For the pendulum, $\\dot\\theta\\,\\partial L/\\partial\\dot\\theta = m\\ell^{2}\\dot\\theta^{2}$, and:' },
    { eq: '\\begin{aligned} h &= m\\ell^{2}\\dot\\theta^{2} - \\Bigl(\\frac{1}{2}m\\ell^{2}\\dot\\theta^{2} + mg\\ell\\cos\\theta\\Bigr) \\\\ &= \\frac{1}{2}m\\ell^{2}\\dot\\theta^{2} - mg\\ell\\cos\\theta \\end{aligned}', size: 0.022 },
    { p: 'This is $T + V$, the familiar energy.' },
  ],
  right: [
    { h2: 'When h is not T + V' },
    { p: 'The bead on the spinning hoop also has an $L$ without $t$, so its $h$ is conserved too. Use $\\dot\\theta\\,\\partial L/\\partial\\dot\\theta = mR^{2}\\dot\\theta^{2}$:' },
    { eq: 'h = \\frac{1}{2}mR^{2}\\dot\\theta^{2} - \\frac{1}{2}mR^{2}\\omega^{2}\\sin^{2}\\theta - mgR\\cos\\theta', size: 0.023 },
    { p: 'Compare with the energy $T + V = \\frac{1}{2}mR^{2}(\\dot\\theta^{2} + \\omega^{2}\\sin^{2}\\theta) - mgR\\cos\\theta$. The sign of the $\\omega^{2}$ term is different, so $h \\neq T + V$. The motor that keeps the hoop at a constant $\\omega$ does work on the bead, so $T + V$ changes, while $h$ stays fixed.' },
    { fig: 'hourglass', w: 0.11, tape: true },
    { p: 'The rule: $h$ equals $T + V$ when the coordinates are fixed to the room and do not move with time. The hoop’s coordinate $\\theta$ turns with the hoop, so the rule does not apply.' },
  ],
});

const ch4_c = flatSpread({
  key: 'c4-noether', title: 'Chapter 4: Noether’s theorem',
  left: [
    { h1: 'Noether’s theorem' },
    { p: 'The pattern of this chapter has a name. In 1918 Emmy Noether proved that every continuous [[symmetry]] of the action gives a conserved quantity. A symmetry here means a change of the coordinates, such as a shift or a turn, that leaves the action unchanged.' },
    { table: { cols: [0.5, 0.5], head: ['If L does not change under…', 'then this is conserved'], align: ['l', 'l'], rows: [
      ['a shift in time', 'energy'], ['a shift in position', 'linear momentum'], ['a turn about an axis', 'angular momentum about that axis']] } },
    { p: 'Noether worked in Göttingen with David Hilbert and Felix Klein, who were asking how energy conservation works in general relativity. Her paper, Invariante Variationsprobleme, answered it for every theory written with an action.' },
    { fig: 'top', w: 0.14, tape: true },
  ],
  right: [
    { h2: 'Equal areas in equal times' },
    { p: 'Kepler found in 1609 that a planet sweeps out equal areas in equal times. Noether’s theorem explains why. In a short time $dt$ the line from the Sun to the planet turns by $d\\varphi$ and sweeps a thin triangle of area $\\frac{1}{2}r^{2}d\\varphi$. Divide by $dt$:' },
    { eq: '\\frac{dA}{dt} = \\frac{1}{2}\\,r^{2}\\dot\\varphi = \\frac{p_\\varphi}{2m}' },
    { p: 'The pull of the Sun does not depend on the direction, so $L$ does not change when the orbit is turned. Therefore $p_\\varphi$ is constant, and so is the rate of sweeping.' },
    { chart: xyPlot({
      curves: [{ pts: FIG.orbit, tone: TONE.lav, w: 0.0022 }, { pts: FIG.sectorA, tone: TONE.rose, w: 0.0012, fill: 'rgba(192,98,127,0.25)' }, { pts: FIG.sectorB, tone: TONE.mint, w: 0.0012, fill: 'rgba(79,154,130,0.25)' }],
      marks: [{ x: 0, y: 0, dot: true, tone: TONE.gold }],
      xr: [-3.0, 1.0], yr: [-1.6, 1.6], h: 0.17, aspect: 1, axes: false }) },
    { note: 'The orbit with $E = -0.3$ from Chapter 3. Each shaded area is swept in one tenth of the period, one near the Sun and one far from it. Computed areas: 0.676 and 0.677.' },
  ],
});
