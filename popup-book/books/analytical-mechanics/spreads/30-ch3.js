// ======================= Chapter 3: Lagrangian mechanics at work =======================

// a clean diagram of the double pendulum: pivot, two rods of length l, two bobs, angles from the vertical
function dpDiagram({ t1 = 32, t2 = 62, L = 0.082 } = {}) {
  const fn = (c, x, y, w) => {
    const px = x + w * 0.42, py = y - 0.012, rad = (d) => (d * Math.PI) / 180;
    const b1 = [px + L * Math.sin(rad(t1)), py - L * Math.cos(rad(t1))], b2 = [b1[0] + L * Math.sin(rad(t2)), b1[1] - L * Math.cos(rad(t2))];
    const disc = ([cx, cy], r, col) => c.fill([...Array(24)].map((_, i) => [cx + r * Math.cos((i / 24) * 2 * Math.PI), cy + r * Math.sin((i / 24) * 2 * Math.PI)]), col);
    const arc = ([cx, cy], r, a0, a1, col) => c.line([...Array(17)].map((_, i) => { const a = rad(a0 + ((a1 - a0) * i) / 16); return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }), col, 0.0014);
    c.line([[px - 0.035, py], [px + 0.035, py]], 'rgba(58,44,54,0.8)', 0.0022);
    for (let i = 0; i < 6; i++) c.line([[px - 0.03 + i * 0.012, py], [px - 0.022 + i * 0.012, py + 0.008]], 'rgba(58,44,54,0.5)', 0.0011);
    c.line([[px, py], [px, py - L * 1.05]], 'rgba(58,44,54,0.45)', 0.0011, [0.005, 0.004]);
    c.line([b1, [b1[0], b1[1] - L * 1.0]], 'rgba(58,44,54,0.45)', 0.0011, [0.005, 0.004]);
    c.line([[px, py], b1], TONE.gold, 0.0032); c.line([b1, b2], TONE.gold, 0.0032);
    arc([px, py], L * 0.45, 0, t1, TONE.red); arc(b1, L * 0.45, 0, t2, TONE.red);
    disc(b1, 0.0085, TONE.rose); disc(b2, 0.0085, TONE.lav);
    const lab = (s, xx, yy, col) => c.text({ x: xx, y: yy, w: 0.12, size: 0.018, lh: 1.2, paras: [s], color: col || INK });
    lab('$\\theta_1$', px + 0.006, py - L * 0.5, TONE.red); lab('$\\theta_2$', b1[0] + 0.006, b1[1] - L * 0.5, TONE.red);
    lab('$\\ell$', (px + b1[0]) / 2 + 0.012, (py + b1[1]) / 2 + 0.012); lab('$\\ell$', (b1[0] + b2[0]) / 2 + 0.014, (b1[1] + b2[1]) / 2 + 0.01);
    lab('$m$', b1[0] + 0.014, b1[1] + 0.008); lab('$m$', b2[0] + 0.014, b2[1] + 0.008);
    return y - (b2[1] - 0.02);
  };
  fn.texs = ['$\\theta_1$', '$\\theta_2$', '$\\ell$', '$m$'];
  return fn;
}

const ch3_a = flatSpread({
  key: 'c3-recipe', title: 'Chapter 3: The pendulum again',
  left: [
    { fig: 'c3', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 3' },
    { h1: 'Lagrangian mechanics at work' },
    { p: 'The Euler–Lagrange equation turns every problem into the same four steps:' },
    { p: '1. Choose [[generalized coordinates]] $q_1, q_2, \\dots$: any numbers that fix the position of the system.' },
    { p: '2. Write the kinetic energy $T$ and the potential energy $V$ in these coordinates.' },
    { p: '3. Form $L = T - V$.' },
    { p: '4. Write one Euler–Lagrange equation for each coordinate.' },
  ],
  right: [
    { h2: 'The pendulum in four steps' },
    { p: 'Step 1: one coordinate, the angle $\\theta$. The bob is at $x = \\ell\\sin\\theta$, $y = -\\ell\\cos\\theta$.' },
    { p: 'Step 2: differentiate the position, $\\dot x = \\ell\\cos\\theta\\,\\dot\\theta$ and $\\dot y = \\ell\\sin\\theta\\,\\dot\\theta$. Add the squares, and use $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$:' },
    { eq: 'T = \\frac{1}{2}\\,m\\bigl(\\dot x^{2} + \\dot y^{2}\\bigr) = \\frac{1}{2}\\,m\\,\\ell^{2}\\,\\dot\\theta^{2}' },
    { eq: 'V = m g y = -m g \\ell\\cos\\theta' },
    { p: 'Step 3:' },
    { eq: 'L = \\frac{1}{2}\\,m\\,\\ell^{2}\\,\\dot\\theta^{2} + m g \\ell\\cos\\theta' },
    { p: 'Step 4: the two derivatives are $\\partial L/\\partial\\dot\\theta = m\\ell^{2}\\dot\\theta$ and $\\partial L/\\partial\\theta = -mg\\ell\\sin\\theta$. The Euler–Lagrange equation gives:' },
    { eq: 'm\\,\\ell^{2}\\,\\ddot\\theta + m g \\ell\\sin\\theta = 0' },
    { p: 'Divide by $m\\ell^{2}$, and this is the equation of Chapter 1. The tension $F_T$ never appeared, because the coordinate $\\theta$ already keeps the bob on its circle.' },
  ],
});

const ch3_b = flatSpread({
  key: 'c3-hoop', title: 'Chapter 3: A bead on a spinning hoop',
  left: [
    { h1: 'A bead on a spinning hoop' },
    { p: 'A circular hoop of radius $R$ turns about its vertical diameter at a fixed angular speed $\\omega$. A bead slides on it without friction. The angle $\\theta$ is measured from the bottom of the hoop.' },
    { fig: 'hoop', w: 0.12, tape: true },
    { p: 'The bead moves along the hoop with speed $R\\dot\\theta$, and the hoop carries it around the axis with speed $\\omega R\\sin\\theta$. These two velocities are perpendicular, so the squares add:' },
    { eq: 'T = \\frac{1}{2}\\,m R^{2}\\bigl(\\dot\\theta^{2} + \\omega^{2}\\sin^{2}\\theta\\bigr), \\qquad V = -m g R\\cos\\theta', size: 0.023 },
    { p: 'Take the derivatives of $L = T - V$:' },
    { eq: '\\frac{\\partial L}{\\partial\\dot\\theta} = m R^{2}\\,\\dot\\theta' },
    { eq: '\\frac{\\partial L}{\\partial\\theta} = m R^{2}\\omega^{2}\\sin\\theta\\cos\\theta - m g R\\sin\\theta', size: 0.025 },
  ],
  right: [
    { p: 'The Euler–Lagrange equation, divided by $mR^{2}$:' },
    { eq: '\\ddot\\theta = \\sin\\theta\\,\\Bigl(\\omega^{2}\\cos\\theta - \\frac{g}{R}\\Bigr)' },
    { h2: 'Where the bead can rest' },
    { p: 'The bead rests where $\\ddot\\theta = 0$: at the bottom or the top, where $\\sin\\theta = 0$, or where $\\cos\\theta = g/(R\\omega^{2})$. The last one exists only above the critical speed $\\omega_c = \\sqrt{g/R}$.' },
    { chart: xyPlot({
      curves: [{ pts: [[0, 0], [1, 0]], tone: TONE.rose, w: 0.0032 }, { pts: [[1, 0], [2.5, 0]], tone: TONE.rose, w: 0.0022, dash: [0.006, 0.004] }, { pts: FIG.hoopBranch, tone: TONE.rose, w: 0.0032 }],
      marks: [{ x: 1.5, y: 63.6, dot: true, label: '63.6° at $1.5\\,\\omega_c$', tone: TONE.red, dx: 0.008, dy: -0.006 }],
      xr: [0, 2.5], yr: [0, 90], xt: [0, 0.5, 1, 1.5, 2, 2.5], yt: [0, 30, 60, 90], yf: (v) => v + '°', xlab: '$\\omega/\\omega_c$', ylab: 'resting angle $\\theta$', h: 0.08 }) },
    { p: 'Below $\\omega_c$ the bead rests at the bottom. Above it, the bottom (dashed) becomes unstable and the bead moves up to $\\cos\\theta = (\\omega_c/\\omega)^{2}$. The [[effective potential]] $U$, in units of $mgR$, shows why:' },
    { chart: xyPlot({
      curves: [{ pts: FIG.hoopU.th.map((t, i) => [t, FIG.hoopU.u08[i]]), tone: TONE.lav }, { pts: FIG.hoopU.th.map((t, i) => [t, FIG.hoopU.u15[i]]), tone: TONE.rose }],
      xr: [-180, 180], yr: [-1.6, 1.2], xt: [-180, -90, 0, 90, 180], yt: [-1.5, -1, -0.5, 0, 0.5, 1], yf: (v) => v.toFixed(1), xf: (v) => v + '°', xlab: '$\\theta$', ylab: '$U/mgR$', h: 0.08 }) },
    { note: '$U = -\\cos\\theta - \\frac{1}{2}(\\omega/\\omega_c)^{2}\\sin^{2}\\theta$. Lavender, $\\omega = 0.8\\,\\omega_c$: one well. Rose, $\\omega = 1.5\\,\\omega_c$: two wells.' },
  ],
});

const ch3_c = flatSpread({
  key: 'c3-double1', title: 'Chapter 3: The double pendulum',
  left: [
    { h1: 'The double pendulum' },
    { p: 'Hang a second pendulum from the bob of the first. Both rods have length $\\ell$ and both bobs have mass $m$. The angles $\\theta_1$ and $\\theta_2$, measured from the vertical, fix the position.' },
    { chart: dpDiagram() },
    { p: 'Positions of the two bobs:' },
    { eq: '\\begin{aligned} x_1 &= \\ell\\sin\\theta_1, & y_1 &= -\\ell\\cos\\theta_1 \\\\ x_2 &= x_1 + \\ell\\sin\\theta_2, & y_2 &= y_1 - \\ell\\cos\\theta_2 \\end{aligned}', size: 0.024 },
    { p: 'The first bob moves like a single pendulum, so $v_1^{2} = \\ell^{2}\\dot\\theta_1^{2}$. For the second bob, differentiate:' },
    { eq: '\\begin{aligned} \\dot x_2 &= \\ell\\bigl(\\cos\\theta_1\\,\\dot\\theta_1 + \\cos\\theta_2\\,\\dot\\theta_2\\bigr) \\\\ \\dot y_2 &= \\ell\\bigl(\\sin\\theta_1\\,\\dot\\theta_1 + \\sin\\theta_2\\,\\dot\\theta_2\\bigr) \\end{aligned}', size: 0.024 },
    { p: 'Square and add. The squared terms give $\\dot\\theta_1^{2}$ and $\\dot\\theta_2^{2}$. The cross terms give $2\\dot\\theta_1\\dot\\theta_2(\\cos\\theta_1\\cos\\theta_2 + \\sin\\theta_1\\sin\\theta_2)$, and the bracket is $\\cos(\\theta_1 - \\theta_2)$:' },
    { eq: 'v_2^{2} = \\ell^{2}\\bigl[\\dot\\theta_1^{2} + \\dot\\theta_2^{2} + 2\\,\\dot\\theta_1\\dot\\theta_2\\cos(\\theta_1 - \\theta_2)\\bigr]', size: 0.024 },
  ],
  right: [
    { p: 'Add the two kinetic energies, $\\frac{1}{2}mv_1^{2} + \\frac{1}{2}mv_2^{2}$, and the two potential energies, $mgy_1 + mgy_2$. Write $\\Delta = \\theta_1 - \\theta_2$:' },
    { eq: 'T = \\frac{1}{2}\\,m\\ell^{2}\\bigl[2\\dot\\theta_1^{2} + \\dot\\theta_2^{2} + 2\\,\\dot\\theta_1\\dot\\theta_2\\cos\\Delta\\bigr]', size: 0.025 },
    { eq: 'V = -m g \\ell\\,\\bigl(2\\cos\\theta_1 + \\cos\\theta_2\\bigr)', size: 0.025 },
    { p: 'This is the whole physics of the problem: $L = T - V$. With Newton’s method we would have needed the force in each rod, and those forces change all the time.' },
    { fig: 'compass', w: 0.11, tape: true },
  ],
});

const ch3_d = flatSpread({
  key: 'c3-double2', title: 'Chapter 3: Chaos in two lines',
  left: [
    { h1: 'Two equations, then chaos' },
    { p: 'For $\\theta_1$: $\\partial L/\\partial\\dot\\theta_1 = m\\ell^{2}(2\\dot\\theta_1 + \\dot\\theta_2\\cos\\Delta)$. Its time derivative contains $\\dot\\Delta = \\dot\\theta_1 - \\dot\\theta_2$:' },
    { eq: '\\frac{d}{dt}\\frac{\\partial L}{\\partial\\dot\\theta_1} = m\\ell^{2}\\bigl[2\\ddot\\theta_1 + \\ddot\\theta_2\\cos\\Delta - \\dot\\theta_2\\,(\\dot\\theta_1 - \\dot\\theta_2)\\sin\\Delta\\bigr]', size: 0.021 },
    { eq: '\\frac{\\partial L}{\\partial\\theta_1} = -m\\ell^{2}\\,\\dot\\theta_1\\dot\\theta_2\\sin\\Delta - 2 m g\\ell\\sin\\theta_1', size: 0.023 },
    { p: 'Subtract and divide by $m\\ell^{2}$. The two $\\dot\\theta_1\\dot\\theta_2\\sin\\Delta$ terms cancel:' },
    { eq: '2\\ddot\\theta_1 + \\ddot\\theta_2\\cos\\Delta + \\dot\\theta_2^{2}\\sin\\Delta + \\frac{2g}{\\ell}\\sin\\theta_1 = 0', size: 0.024 },
    { p: 'The same steps for $\\theta_2$, where $\\partial\\cos\\Delta/\\partial\\theta_2 = +\\sin\\Delta$, give:' },
    { eq: '\\ddot\\theta_2 + \\ddot\\theta_1\\cos\\Delta - \\dot\\theta_1^{2}\\sin\\Delta + \\frac{g}{\\ell}\\sin\\theta_2 = 0', size: 0.024 },
  ],
  right: [
    { p: 'A computer solves these two equations easily. Start both rods at 120°, at rest, with $\\ell = 1$ m. The path of the lower bob over 20 s:' },
    { chart: xyPlot({ curves: [{ pts: FIG.dpTrace, tone: TONE.lav, w: 0.0012 }], xr: [-2.1, 2.1], yr: [-2.1, 2.1], xt: [-2, -1, 0, 1, 2], yt: [-2, -1, 0, 1, 2], xlab: '$x$ (m)', ylab: '$y$ (m)', h: 0.21, aspect: 1 }) },
    { p: 'Now start a twin with $\\theta_1$ larger by 0.001 rad. The two lower rods agree at first, then differ by more than 10° after 5.8 s:' },
    { chart: xyPlot({ curves: [{ pts: FIG.dpTwin.t.map((t, i) => [t, FIG.dpTwin.a[i]]), tone: TONE.rose, w: 0.0018 }, { pts: FIG.dpTwin.t.map((t, i) => [t, FIG.dpTwin.b[i]]), tone: TONE.mint, w: 0.0018 }],
      xr: [0, 20], yr: [-1200, 1200], xt: [0, 5, 10, 15, 20], yt: [-1000, 0, 1000], yf: (v) => v + '°', xlab: '$t$ (s)', ylab: '$\\theta_2$ of the two twins', h: 0.11 }) },
    { note: 'The angle $\\theta_2$ keeps counting when the lower rod goes over the top, so it can pass 360°.' },
  ],
});

const ch3_e = flatSpread({
  key: 'c3-kepler', title: 'Chapter 3: A planet around the Sun',
  left: [
    { h1: 'A planet around the Sun' },
    { p: 'A planet of mass $m$ moves in the plane of its orbit. The Sun pulls it with potential energy $V = -k/r$. Use polar coordinates. The velocity of Chapter 1 gives $T = \\frac{1}{2}m(\\dot r^{2} + r^{2}\\dot\\varphi^{2})$, so:' },
    { eq: 'L = \\frac{1}{2}\\,m\\bigl(\\dot r^{2} + r^{2}\\dot\\varphi^{2}\\bigr) + \\frac{k}{r}' },
    { p: 'For $r$: $\\partial L/\\partial\\dot r = m\\dot r$ and $\\partial L/\\partial r = mr\\dot\\varphi^{2} - k/r^{2}$. The equation is:' },
    { eq: 'm\\ddot r - m r\\dot\\varphi^{2} + \\frac{k}{r^{2}} = 0' },
    { p: 'The term $-mr\\dot\\varphi^{2}$, which Newton’s method had to derive from turning unit vectors, came out of $\\partial L/\\partial r$ by itself.' },
    { p: 'For $\\varphi$: $L$ contains $\\dot\\varphi$ but not $\\varphi$, so $\\partial L/\\partial\\varphi = 0$, and the equation says:' },
    { eq: '\\frac{d}{dt}\\bigl(m r^{2}\\dot\\varphi\\bigr) = 0 \\quad\\Rightarrow\\quad p_\\varphi = m r^{2}\\dot\\varphi = \\text{const}', size: 0.025 },
  ],
  right: [
    { h2: 'The orbit in one dimension' },
    { p: 'Put $\\dot\\varphi = p_\\varphi/(mr^{2})$ into the equation for $r$:' },
    { eq: 'm\\ddot r = \\frac{p_\\varphi^{2}}{m r^{3}} - \\frac{k}{r^{2}} = -\\frac{dU}{dr}, \\qquad U(r) = \\frac{p_\\varphi^{2}}{2 m r^{2}} - \\frac{k}{r}', size: 0.022 },
    { p: 'Now $r$ moves like a ball in the effective potential $U$. With $m = k = p_\\varphi = 1$, $U$ has its lowest point at $r = 1$, a circular orbit. A planet with energy $E = -0.3$ swings between $r = 0.613$ and $r = 2.72$: an ellipse.' },
    { chart: xyPlot({ curves: [{ pts: FIG.kepler.r.map((r, i) => [r, FIG.kepler.u[i]]), tone: TONE.rose }, { pts: [[FIG.keplerE[1], -0.3], [FIG.keplerE[2], -0.3]], tone: TONE.lav, w: 0.0022, dash: [0.006, 0.004] }],
      marks: [{ x: 2.8, y: -0.3, label: '$E = -0.3$', tone: TONE.lav, dx: 0.006, dy: 0.022 }, { x: 1, y: -0.5, dot: true, label: 'circular orbit', tone: TONE.red, dx: 0.008, dy: -0.004 }],
      xr: [0, 5], yr: [-0.6, 0.6], xt: [0, 1, 2, 3, 4, 5], yt: [-0.5, -0.25, 0, 0.25, 0.5], yf: (v) => v.toFixed(2), xlab: '$r$', ylab: '$U(r)$', h: 0.15, zero: true }) },
    { note: 'Substitute $p_\\varphi$ into the equation of motion, not into $L$. Put into $L$, it flips the sign of the $p_\\varphi^{2}$ term and gives the wrong motion.' },
    { fig: 'kepler', w: 0.24, tape: true },
  ],
});
