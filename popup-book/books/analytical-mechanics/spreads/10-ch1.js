// ======================= Chapter 1: Newton's way and where it hurts =======================
// Inline maths: $...$ (TeX). Display maths: { eq }.

const ch1_a = flatSpread({
  key: 'c1-ball', title: 'Chapter 1: A ball thrown upward',
  left: [
    { fig: 'c1', w: 0.53, maxH: 0.36 },
    { kicker: 'Chapter 1' },
    { h1: 'Newton’s way and where it hurts' },
    { p: 'Newton’s second law says that the force on a body equals its mass times its acceleration. You give it the forces, and it gives you the motion, one instant at a time. For simple problems this works beautifully.' },
    { p: 'This chapter solves two such problems with Newton’s method. Then it shows the places where the method becomes hard work.' },
  ],
  right: [
    { h2: 'A ball thrown upward' },
    { p: 'A ball of mass $m$ leaves the ground at time $t = 0$ with upward speed $v_0$. The only force on it is gravity, $-mg$. Newton’s law for the height $y$ reads:' },
    { eq: 'm\\,\\ddot y = -m g' },
    { p: 'Divide both sides by $m$ and integrate once over time. The constant of integration is the starting speed:' },
    { eq: '\\dot y = v_0 - g\\,t' },
    { p: 'Integrate once more. The ball starts at $y = 0$, so the new constant is zero:' },
    { eq: 'y = v_0\\,t - \\frac{1}{2}\\,g\\,t^{2}' },
    { p: 'Take $v_0 = 9.8$ m/s and $g = 9.8$ m/s². The speed $\\dot y$ is zero at $t = 1$ s, when the ball is 4.9 m high. At $t = 2$ s the ball is back on the ground.' },
    { fig: 'ball-arc', w: 0.2, tape: true },
  ],
});

const ch1_b = flatSpread({
  key: 'c1-pendulum', title: 'Chapter 1: The pendulum',
  left: [
    { h1: 'The pendulum, the Newton way' },
    { p: 'A bob of mass $m$ hangs on a light string of length $\\ell$. The angle $\\theta$ is measured from the vertical. Two forces act on the bob: gravity $mg$, straight down, and the tension $F_T$ of the string, along the string.' },
    { p: 'The bob moves on a circle, so we split each force into a part along the circle and a part along the string. Along the circle, only gravity has a component, $-mg\\sin\\theta$, and the acceleration along the circle is $\\ell\\ddot\\theta$. Newton’s law along the circle is therefore:' },
    { eq: 'm\\,\\ell\\,\\ddot\\theta = -m g \\sin\\theta' },
    { p: 'Along the string, the bob has the centripetal acceleration $\\ell\\dot\\theta^{2}$ towards the pivot. Newton’s law along the string gives the tension:' },
    { eq: 'F_T - m g\\cos\\theta = m\\,\\ell\\,\\dot\\theta^{2}' },
    { fig: 'pend', w: 0.15, tape: true },
  ],
  right: [
    { h2: 'What we had to do' },
    { p: 'The first equation is the equation of motion. Divide it by $m\\ell$:' },
    { eq: '\\ddot\\theta = -\\frac{g}{\\ell}\\,\\sin\\theta' },
    { p: 'For small swings, $\\sin\\theta \\approx \\theta$, and the bob oscillates with angular frequency $\\sqrt{g/\\ell}$. The period of one full swing is:' },
    { eq: 'T_{\\text{swing}} = 2\\pi\\sqrt{\\frac{\\ell}{g}}' },
    { p: 'For $\\ell = 1$ m this is 2.01 s.' },
    { p: 'Notice what we needed to get here. We had to choose directions, split each force into components, and carry the tension $F_T$, which we did not know in advance. The tension does no work and never changes the swing, yet it sits in our equations.' },
  ],
});

const ch1_c = flatSpread({
  key: 'c1-hurts', title: 'Chapter 1: Where it hurts',
  left: [
    { h1: 'Where it hurts' },
    { p: 'Many problems are easier in [[polar coordinates]] $r$ and $\\varphi$. However, Newton’s law is written for the acceleration, and the acceleration in polar coordinates is not simply $\\ddot r$ and $\\ddot\\varphi$, because the unit vectors turn as the body moves.' },
    { p: 'Write the position as $r\\,\\hat r$. As $\\varphi$ changes, the two unit vectors turn:' },
    { eq: '\\frac{d\\hat r}{dt} = \\dot\\varphi\\,\\hat\\varphi, \\qquad \\frac{d\\hat\\varphi}{dt} = -\\dot\\varphi\\,\\hat r' },
    { p: 'Differentiate the position once with the product rule:' },
    { eq: '\\vec v = \\dot r\\,\\hat r + r\\,\\dot\\varphi\\,\\hat\\varphi' },
    { p: 'Differentiate again. Each product gives two terms, and each turning unit vector gives one more:' },
    { eq: '\\vec a = \\ddot r\\,\\hat r + \\dot r\\dot\\varphi\\,\\hat\\varphi + \\dot r\\dot\\varphi\\,\\hat\\varphi + r\\ddot\\varphi\\,\\hat\\varphi - r\\dot\\varphi^{2}\\,\\hat r', size: 0.023 },
    { p: 'Collect the radial and the angular parts:' },
    { eq: '\\vec a = \\bigl(\\ddot r - r\\dot\\varphi^{2}\\bigr)\\,\\hat r + \\bigl(r\\ddot\\varphi + 2\\dot r\\dot\\varphi\\bigr)\\,\\hat\\varphi', size: 0.025 },
  ],
  right: [
    { p: 'The terms $-r\\dot\\varphi^{2}$ and $2\\dot r\\dot\\varphi$ come only from the turning unit vectors. Newton’s method makes us derive such terms again for every new set of coordinates.' },
    { h2: 'Forces we do not want' },
    { p: 'A bead that slides on a curved wire is worse. The wire pushes on the bead with a [[constraint force]] that keeps the bead on the wire. We do not know this force, it changes direction along the wire, and it does no work. Still, Newton’s method needs it in every equation.' },
    { fig: 'bead-wire', w: 0.24, tape: true },
    { h2: 'A different question' },
    { p: 'Newton asks: what is the force at this instant, and what acceleration does it cause? There is another question we can ask. A body starts at one place at one time and ends at another place at a later time. Of all the paths it could take between these two events, which one does it take?' },
  ],
});
