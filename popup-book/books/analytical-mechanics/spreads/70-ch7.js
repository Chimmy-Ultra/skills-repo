// ======================= Chapter 7: Two problems, two ways =======================
// Numbers (M = 2 kg, m = 1 kg, α = 30°, g = 9.8 m/s²) checked with SymPy: see sources.md.

function arrow(c, [x1, y1], [x2, y2], col, w = 0.0024, dash = null) {
  c.line([[x1, y1], [x2, y2]], col, w, dash);
  const ang = Math.atan2(y2 - y1, x2 - x1), h = 0.009;
  c.fill([[x2, y2], [x2 - h * Math.cos(ang - 0.38), y2 - h * Math.sin(ang - 0.38)], [x2 - h * Math.cos(ang + 0.38), y2 - h * Math.sin(ang + 0.38)]], col);
}

// a wedge with a block on its slope. movable: the floor is smooth and the wedge can slide (X marked);
// forces: draw the forces on the block and, for a movable wedge, on the wedge.
function wedgeDiagram({ movable = true, forces = true, friction = false, W = 0.24, h = 0.2, showS = true } = {}) {
  const AL = Math.PI / 6, TEX = { N: '$N$', mg: '$mg$', Mg: '$Mg$', Nf: '$N_f$', a: '$\\alpha$', X: '$X$', s: '$s$', M: '$M$', m: '$m$', f: '$\\mu N$', mN: '$-N$' };
  const fn = (c, x, y, w) => {
    const x0 = x + (w - W) / 2 + 0.01, y0 = y - h + 0.035, H = W * Math.tan(AL);
    const A = [x0, y0], B = [x0, y0 + H], C = [x0 + W, y0];
    const u = [Math.cos(AL), -Math.sin(AL)], n = [Math.sin(AL), Math.cos(AL)];
    const lab = (k, xx, yy, col, size = 0.017) => c.text({ x: xx, y: yy, w: 0.1, size, lh: 1.2, paras: [TEX[k]], color: col || INK });
    // floor
    c.line([[x0 - 0.04, y0], [x0 + W + 0.04, y0]], 'rgba(58,44,54,0.75)', 0.0022);
    for (let i = 0; i < 16; i++) { const xx = x0 - 0.035 + i * ((W + 0.07) / 16); c.line([[xx, y0], [xx - 0.008, y0 - 0.009]], 'rgba(58,44,54,0.4)', 0.001); }
    if (!movable) { c.fill([[x0 - 0.012, y0], [x0, y0], [x0, y0 + H * 0.35], [x0 - 0.012, y0 + H * 0.35]], 'rgba(58,44,54,0.35)'); }
    // wedge
    c.fill([A, B, C], 'rgba(192,154,82,0.28)');
    c.line([A, B, C, A], TONE.gold, 0.0022);
    // angle at C
    c.line([...Array(9)].map((_, i) => { const t = Math.PI - (AL * i) / 8; return [C[0] + 0.04 * Math.cos(t), C[1] + 0.04 * Math.sin(t)]; }), TONE.red, 0.0014);
    lab('a', C[0] - 0.068, C[1] + 0.028, TONE.red);
    // block on the slope, a little below the top
    const d = 0.35 * Math.hypot(W, H), b = 0.04;
    const P = [B[0] + d * u[0], B[1] + d * u[1]];
    const sq = [P, [P[0] + b * u[0], P[1] + b * u[1]], [P[0] + b * (u[0] + n[0]), P[1] + b * (u[1] + n[1])], [P[0] + b * n[0], P[1] + b * n[1]]];
    c.fill(sq, 'rgba(192,98,127,0.55)'); c.line([...sq, sq[0]], TONE.rose, 0.0016);
    const ctr = [P[0] + (b / 2) * (u[0] + n[0]), P[1] + (b / 2) * (u[1] + n[1])];
    lab('m', ctr[0] - 0.007, ctr[1] + 0.009, '#fff', 0.016);
    lab('M', x0 + 0.012, y0 + H * 0.86, INK);
    // the coordinate s, along the slope above the block's path
    const s0 = [B[0] + 0.03 * n[0], B[1] + 0.03 * n[1]], s1 = [s0[0] + (d - 0.006) * u[0], s0[1] + (d - 0.006) * u[1]];
    if (showS) { arrow(c, s0, s1, TONE.lav, 0.0016); lab('s', (s0[0] + s1[0]) / 2 + 0.004, (s0[1] + s1[1]) / 2 + 0.03, TONE.lav); }
    if (movable) { arrow(c, [x0 + W * 0.55, y0 - 0.024], [x0 + W * 0.2, y0 - 0.024], TONE.lav, 0.0016); lab('X', x0 + W * 0.35, y0 - 0.03, TONE.lav); }
    if (!forces) return y - (y0 - 0.06);
    // forces on the block
    arrow(c, ctr, [ctr[0], ctr[1] - 0.065], TONE.blue);
    lab('mg', ctr[0] + 0.006, ctr[1] - 0.045, TONE.blue);
    arrow(c, ctr, [ctr[0] + 0.06 * n[0], ctr[1] + 0.06 * n[1]], TONE.mint);
    lab('N', ctr[0] + 0.06 * n[0] + 0.004, ctr[1] + 0.06 * n[1] + 0.022, TONE.mint);
    if (friction) { arrow(c, ctr, [ctr[0] - 0.06 * u[0], ctr[1] - 0.06 * u[1]], TONE.red); lab('f', ctr[0] - 0.06 * u[0] - 0.04, ctr[1] - 0.06 * u[1] + 0.03, TONE.red); }
    if (movable) {
      // the block pushes back on the wedge with -N; the floor pushes up with N_f
      const cp = [P[0] + (b / 2) * u[0], P[1] + (b / 2) * u[1]];
      arrow(c, cp, [cp[0] - 0.055 * n[0], cp[1] - 0.055 * n[1]], TONE.mint, 0.0022, [0.005, 0.003]);
      lab('mN', cp[0] - 0.055 * n[0] - 0.034, cp[1] - 0.055 * n[1] - 0.006, TONE.mint, 0.015);
      const gx = x0 + 0.02, gy = y0 + H * 0.58;
      arrow(c, [gx, gy], [gx, gy - 0.045], TONE.blue, 0.0018);
      lab('Mg', gx + 0.005, gy - 0.012, TONE.blue, 0.015);
      arrow(c, [x0 + W * 0.75, y0 - 0.045], [x0 + W * 0.75, y0 - 0.001], TONE.mint, 0.0018);
      lab('Nf', x0 + W * 0.75 + 0.006, y0 - 0.012, TONE.mint, 0.015);
    }
    return y - (y0 - 0.07);
  };
  fn.texs = Object.values(TEX);
  return fn;
}

const ch7_a = flatSpread({
  key: 'c7-wedge', title: 'Chapter 7: A block on a sliding wedge',
  left: [
    { fig: 'c7', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 7' },
    { h1: 'Two problems, two ways' },
    { p: 'This chapter solves two problems with both methods. In the first, Lagrange’s method is much easier. In the second, Newton’s method is easier, and the reason is worth knowing.' },
  ],
  right: [
    { h2: 'Problem 1: a block on a sliding wedge' },
    { p: 'A wedge of mass $M$ rests on a smooth floor. Its slope makes an angle $\\alpha$ with the floor. A block of mass $m$ is released from rest on the slope. Nothing has friction, so as the block slides down, it pushes the wedge the other way. Find both accelerations.' },
    { chart: wedgeDiagram({ movable: true, forces: true, W: 0.3, h: 0.24 }) },
    { p: 'Two numbers fix everything: the position $X$ of the wedge, and the distance $s$ the block has slid along the slope. The block is at $(X + s\\cos\\alpha,\\; -s\\sin\\alpha)$.' },
  ],
});

const ch7_b = flatSpread({
  key: 'c7-newton', title: 'Chapter 7: The wedge, Newton’s way',
  left: [
    { h1: 'Newton’s way' },
    { p: 'First difficulty: the block’s acceleration is not along the slope, because the slope itself accelerates. Differentiate the block’s position twice:' },
    { eq: '\\vec a_{\\text{block}} = \\bigl(\\ddot X + \\ddot s\\cos\\alpha,\\; -\\ddot s\\sin\\alpha\\bigr)' },
    { p: 'Second difficulty: the push $N$ between block and wedge is unknown, and it is not $mg\\cos\\alpha$. It acts on the block along the normal $(\\sin\\alpha, \\cos\\alpha)$, and on the wedge in the opposite direction. The floor pushes the wedge up with another unknown, $N_f$.' },
    { p: 'Newton’s law for the block, horizontal and vertical:' },
    { eq: 'm\\bigl(\\ddot X + \\ddot s\\cos\\alpha\\bigr) = N\\sin\\alpha' },
    { eq: '-m\\,\\ddot s\\sin\\alpha = N\\cos\\alpha - m g' },
    { p: 'Newton’s law for the wedge, horizontal and vertical:' },
    { eq: 'M\\ddot X = -N\\sin\\alpha, \\qquad 0 = N_f - M g - N\\cos\\alpha', size: 0.025 },
    { p: 'Four equations, four unknowns: $\\ddot X$, $\\ddot s$, $N$ and $N_f$.' },
  ],
  right: [
    { h2: 'Solving them' },
    { p: 'Step 1. Add the first equation to the wedge’s horizontal equation. $N$ cancels:' },
    { eq: '(M + m)\\,\\ddot X + m\\,\\ddot s\\cos\\alpha = 0' },
    { p: 'Step 2. Multiply the block’s first equation by $\\cos\\alpha$, the second by $\\sin\\alpha$, and subtract. $N$ cancels again, and $\\cos^{2}\\alpha + \\sin^{2}\\alpha = 1$:' },
    { eq: '\\ddot s + \\ddot X\\cos\\alpha = g\\sin\\alpha' },
    { p: 'Step 3. Step 1 gives $\\ddot X = -m\\cos\\alpha\\,\\ddot s/(M+m)$. Put it into Step 2:' },
    { eq: '\\ddot s\\,\\Bigl(1 - \\frac{m\\cos^{2}\\alpha}{M + m}\\Bigr) = g\\sin\\alpha' },
    { p: 'The bracket is $(M + m\\sin^{2}\\alpha)/(M + m)$. So:' },
    { eq: '\\ddot s = \\frac{(M + m)\\,g\\sin\\alpha}{M + m\\sin^{2}\\alpha}, \\qquad \\ddot X = -\\frac{m\\,g\\sin\\alpha\\cos\\alpha}{M + m\\sin^{2}\\alpha}', size: 0.022 },
    { p: 'From the wedge’s equation, $N = -M\\ddot X/\\sin\\alpha$:' },
    { eq: 'N = \\frac{M m g\\cos\\alpha}{M + m\\sin^{2}\\alpha}' },
  ],
});

const ch7_c = flatSpread({
  key: 'c7-lagrange', title: 'Chapter 7: The wedge, Lagrange’s way',
  left: [
    { h1: 'Lagrange’s way' },
    { p: 'The block’s velocity is $(\\dot X + \\dot s\\cos\\alpha,\\; -\\dot s\\sin\\alpha)$. Square it; the $\\dot s^{2}$ terms combine because $\\cos^{2}\\alpha + \\sin^{2}\\alpha = 1$:' },
    { eq: 'v^{2} = \\dot X^{2} + 2\\dot X\\dot s\\cos\\alpha + \\dot s^{2}' },
    { p: 'Add the wedge’s kinetic energy $\\frac{1}{2}M\\dot X^{2}$. Only the block changes height, so $V = -mg\\,s\\sin\\alpha$:' },
    { eq: '\\begin{aligned} L = {} & \\frac{1}{2}(M + m)\\,\\dot X^{2} + m\\,\\dot X\\dot s\\cos\\alpha \\\\ & + \\frac{1}{2}\\,m\\,\\dot s^{2} + m g\\,s\\sin\\alpha \\end{aligned}', size: 0.024 },
    { p: 'The position $X$ does not appear in $L$; it is cyclic. So its momentum is conserved, and it is zero because everything starts at rest:' },
    { eq: 'p_X = (M + m)\\,\\dot X + m\\,\\dot s\\cos\\alpha = 0' },
    { p: 'For $s$: $\\partial L/\\partial\\dot s = m\\dot s + m\\dot X\\cos\\alpha$ and $\\partial L/\\partial s = mg\\sin\\alpha$. Divide by $m$:' },
    { eq: '\\ddot s + \\ddot X\\cos\\alpha = g\\sin\\alpha' },
  ],
  right: [
    { p: 'These are exactly the two equations Newton reached in Steps 1 and 2, but they came out directly. $N$ and $N_f$ never appeared, so there was nothing to eliminate. From here, Step 3 gives the same answers.' },
    { h2: 'With numbers' },
    { p: 'Take $M = 2$ kg, $m = 1$ kg and $\\alpha = 30°$:' },
    { table: { cols: [0.62, 0.38], head: ['', 'sliding wedge'], align: ['l', 'r'], rows: [
      ['block along the slope, $\\ddot s$', '6.53 m/s²'], ['wedge, $\\ddot X$', '−1.89 m/s²'], ['push between them, $N$', '7.54 N'], ['floor on the wedge, $N_f$', '26.1 N']] } },
    { p: 'Relative to the wedge, the block slides faster than on a fixed slope, where $g\\sin\\alpha = 4.9$ m/s², because the slope moves out from under it. Seen from the floor, the block falls along a line 40.9° below the horizontal, steeper than the slope.' },
    { p: 'The floor pushes with 26.1 N, less than the total weight of 29.4 N, because the block is accelerating downward.' },
    { p: 'Check: as $M \\to \\infty$, $\\ddot s \\to g\\sin\\alpha$, $\\ddot X \\to 0$ and $N \\to mg\\cos\\alpha$, the fixed slope.' },
  ],
});

const ch7_d = flatSpread({
  key: 'c7-sword', title: 'Chapter 7: A sword too large',
  left: [
    { h1: 'Problem 2: a block on a fixed slope' },
    { p: 'Now fix the wedge to the floor. Newton needs two lines, one along the slope and one across it:' },
    { eq: 'm\\,\\ddot s = m g\\sin\\alpha, \\qquad N - m g\\cos\\alpha = 0' },
    { p: 'So $\\ddot s = g\\sin\\alpha$ and $N = mg\\cos\\alpha$. Now bring in all the tools of this book.' },
    { chart: wedgeDiagram({ movable: false, forces: true }) },
  ],
  right: [
    { p: '[[Lagrangian.]] One coordinate $s$. $T = \\frac{1}{2}m\\dot s^{2}$ and $V = -mg\\,s\\sin\\alpha$:' },
    { eq: 'L = \\frac{1}{2}\\,m\\,\\dot s^{2} + m g\\,s\\sin\\alpha \\;\\Rightarrow\\; m\\ddot s - m g\\sin\\alpha = 0', size: 0.024 },
    { p: '[[Hamiltonian.]] $p = m\\dot s$, so $\\dot s = p/m$ and:' },
    { eq: 'H = p\\,\\dot s - L = \\frac{p^{2}}{2m} - m g\\,s\\sin\\alpha' },
    { p: '[[Hamilton’s equations.]] $\\dot s = \\partial H/\\partial p = p/m$ and $\\dot p = -\\partial H/\\partial s = mg\\sin\\alpha$.' },
    { p: '[[Phase space.]] $H$ has no $t$, so $H = E$ is constant and each motion lies on a parabola $s = (p^{2}/2m - E)/(mg\\sin\\alpha)$:' },
    { chart: xyPlot({ curves: [-4.9, 0, 4.9].map((E, k) => ({ pts: [...Array(81)].map((_, i) => { const p = -6 + (12 * i) / 80; return [(p * p / 2 - E) / 4.9, p]; }), tone: [TONE.mint, TONE.rose, TONE.lav][k], w: k === 1 ? 0.003 : 0.0022 })),
      xr: [-1.2, 3.5], yr: [-6, 6], xt: [-1, 0, 1, 2, 3], yt: [-6, -3, 0, 3, 6], xlab: '$s$ (m)', ylab: '$p$ (kg·m/s)', h: 0.11, zero: true }) },
    { note: 'With $m = 1$ kg and $\\alpha = 30°$. Rose: released from rest at $s = 0$ ($E = 0$).' },
    { p: 'Four tools for what Newton wrote in one line, and the answer is the same.' },
  ],
});

const ch7_e = flatSpread({
  key: 'c7-friction', title: 'Chapter 7: Where Newton wins',
  left: [
    { h1: 'Add friction' },
    { p: 'Give the fixed slope a coefficient of friction $\\mu$. The friction force points up the slope and its size is $\\mu N$. Newton’s two lines become:' },
    { eq: 'm\\,\\ddot s = m g\\sin\\alpha - \\mu N, \\qquad N = m g\\cos\\alpha' },
    { p: 'Substitute the second into the first:' },
    { eq: '\\ddot s = g\\,\\bigl(\\sin\\alpha - \\mu\\cos\\alpha\\bigr)' },
    { p: 'With $\\mu = 0.3$ and $\\alpha = 30°$ this is 2.35 m/s². The block slides only if $\\tan\\alpha > \\mu$; here $\\tan 30° = 0.577$.' },
    { chart: wedgeDiagram({ movable: false, forces: true, friction: true, showS: false }) },
  ],
  right: [
    { h2: 'Why Lagrange struggles' },
    { p: 'Friction is not the slope of any potential energy, so it cannot go into $L = T - V$. It can be added as a force on the right side of the Euler–Lagrange equation:' },
    { eq: '\\frac{d}{dt}\\frac{\\partial L}{\\partial \\dot s} - \\frac{\\partial L}{\\partial s} = -\\mu N' },
    { p: 'But $N$ is exactly the force we removed by choosing the coordinate $s$. To get it back, we must add the distance from the slope as a second coordinate, hold it at zero with a constraint, and solve for the force that holds it. That is Newton’s work again.' },
    { table: { cols: [0.3, 0.35, 0.35], head: ['', 'Newton', 'Lagrange'], align: ['l', 'l', 'l'], size: 0.0158, rows: [
      ['constraint forces', 'must be found', 'never appear'], ['best when', 'you need a force: friction, tension, lift-off', 'many bodies or odd coordinates; only the motion is wanted'], ['problem 1', 'four equations, two unknown forces', 'two equations'], ['problem 2 with friction', 'two lines', 'needs $N$ from elsewhere']] } },
    { p: 'Lagrange hides the forces of constraint: a gift in Problem 1, a loss in Problem 2.' },
  ],
});
