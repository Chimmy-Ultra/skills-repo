// ======================= Chapter 5: Hamilton's view =======================

const ch5_a = flatSpread({
  key: 'c5-legendre', title: 'Chapter 5: From velocity to momentum',
  left: [
    { fig: 'c5', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 5' },
    { h1: 'Hamilton’s view' },
    { p: 'Lagrange describes a system by its positions $q$ and velocities $\\dot q$, and gives one second-order equation for each coordinate. In 1834 and 1835 William Rowan Hamilton rewrote the same mechanics with positions $q$ and momenta $p$. Each second-order equation becomes two first-order equations, one for $q$ and one for $p$, and position and momentum take equal places.' },
  ],
  right: [
    { h2: 'From velocity to momentum' },
    { p: 'The tool is the [[Legendre transform]]. Start from the momentum $p = \\partial L/\\partial\\dot q$, solve it for $\\dot q$ as a function of $q$ and $p$, and define the [[Hamiltonian]]:' },
    { eq: 'H(q, p) = p\\,\\dot q - L(q, \\dot q)' },
    { p: 'On the right, every $\\dot q$ is replaced by its expression in $q$ and $p$. This is the energy function $h$ of Chapter 4, written in new variables.' },
    { h2: 'Example' },
    { p: 'For one particle, $L = \\frac{1}{2}m\\dot q^{2} - V(q)$. The momentum is $p = m\\dot q$, so $\\dot q = p/m$. Substitute:' },
    { eq: 'H = p\\cdot\\frac{p}{m} - \\Bigl[\\frac{1}{2}\\,m\\Bigl(\\frac{p}{m}\\Bigr)^{2} - V(q)\\Bigr]' },
    { p: 'The first term is $p^{2}/m$ and the bracket starts with $p^{2}/(2m)$. Subtract:' },
    { eq: 'H = \\frac{p^{2}}{2m} + V(q)' },
    { p: 'The Hamiltonian is the kinetic energy written with momentum, plus the potential energy.' },
  ],
});

const ch5_b = flatSpread({
  key: 'c5-equations', title: 'Chapter 5: Hamilton’s equations',
  left: [
    { h1: 'Hamilton’s equations' },
    { p: 'Take the change of $H = p\\dot q - L$ when $q$, $p$ and $t$ all change a little. The product $p\\dot q$ gives two terms, and $L(q, \\dot q, t)$ gives three:' },
    { eq: 'dH = \\dot q\\,dp + p\\,d\\dot q - \\frac{\\partial L}{\\partial q}\\,dq - \\frac{\\partial L}{\\partial \\dot q}\\,d\\dot q - \\frac{\\partial L}{\\partial t}\\,dt', size: 0.022 },
    { p: 'Since $p = \\partial L/\\partial\\dot q$, the two $d\\dot q$ terms cancel. By the Euler–Lagrange equation, $\\partial L/\\partial q = \\dot p$:' },
    { eq: 'dH = \\dot q\\,dp - \\dot p\\,dq - \\frac{\\partial L}{\\partial t}\\,dt' },
    { p: 'On the other hand, $H$ is a function of $q$, $p$ and $t$, so its change is also:' },
    { eq: 'dH = \\frac{\\partial H}{\\partial q}\\,dq + \\frac{\\partial H}{\\partial p}\\,dp + \\frac{\\partial H}{\\partial t}\\,dt' },
    { fig: 'quill', w: 0.1, tape: true },
  ],
  right: [
    { p: 'The two expressions must agree for every small change, so the coefficients of $dq$, $dp$ and $dt$ agree. These are [[Hamilton’s equations]]:' },
    { eq: '\\dot q = \\frac{\\partial H}{\\partial p}, \\qquad \\dot p = -\\frac{\\partial H}{\\partial q}', size: 0.032 },
    { p: 'and $\\partial H/\\partial t = -\\partial L/\\partial t$. Along the motion, $dH/dt = \\partial H/\\partial t$: when $H$ does not contain $t$, it is conserved.' },
    { h2: 'Check' },
    { p: 'For $H = p^{2}/(2m) + V(q)$, the first equation gives $\\dot q = p/m$, the definition of momentum. The second gives $\\dot p = -V\'(q)$, which is Newton’s law. Put together, $m\\ddot q = -V\'(q)$.' },
    { p: 'Nothing new about the motion has been found. What has changed is the point of view: the state of the system is now one point $(q, p)$, and Hamilton’s equations tell that point how to move.' },
  ],
});

const ch5_c = flatSpread({
  key: 'c5-oscillator', title: 'Chapter 5: The oscillator in phase space',
  left: [
    { h1: 'The oscillator in phase space' },
    { p: 'The space of all points $(q, p)$ is called [[phase space]]. Take the mass on a spring with $H = p^{2}/(2m) + \\frac{1}{2}m\\omega^{2}q^{2}$. Hamilton’s equations:' },
    { eq: '\\dot q = \\frac{p}{m}, \\qquad \\dot p = -m\\,\\omega^{2}\\,q' },
    { p: 'The solution that starts at $q = A$, $p = 0$ is:' },
    { eq: 'q = A\\cos\\omega t, \\qquad p = -m\\,\\omega A\\sin\\omega t' },
    { p: 'Divide $q$ by $A$ and $p$ by $m\\omega A$, square and add. Because $\\cos^{2} + \\sin^{2} = 1$:' },
    { eq: '\\frac{q^{2}}{A^{2}} + \\frac{p^{2}}{(m\\,\\omega A)^{2}} = 1' },
    { p: 'The state moves around an ellipse, clockwise, once per period. The energy is $E = \\frac{1}{2}m\\omega^{2}A^{2}$.' },
    { fig: 'spring', w: 0.18, tape: true },
  ],
  right: [
    { chart: xyPlot({
      curves: FIG.hoEll.map((e, k) => ({ pts: e.x.map((x, i) => [x, e.p[i]]), tone: [TONE.mint, TONE.lav, TONE.rose][k], w: 0.0026 })),
      xr: [-1.6, 1.6], yr: [-2.4, 2.4], xt: [-1.5, -1, -0.5, 0, 0.5, 1, 1.5], yt: [-2, -1, 0, 1, 2], xlab: '$q$', ylab: '$p$', h: 0.24, zero: true, aspect: 1 }) },
    { note: 'With $m = 1$ and $\\omega = 1.5$: green $E = 0.5$, lavender $E = 1$, rose $E = 2$.' },
    { h2: 'The area of an ellipse' },
    { p: 'An ellipse with half-axes $a$ and $b$ has area $\\pi ab$. Here $a = A$ and $b = m\\omega A$:' },
    { eq: '\\text{area} = \\pi\\,m\\,\\omega A^{2} = \\frac{2\\pi E}{\\omega}' },
    { p: 'The area enclosed by the orbit is the energy divided by the frequency, times $2\\pi$.' },
  ],
});
