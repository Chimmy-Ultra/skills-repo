# Sources — The Beauty of Analytical Mechanics

Every number in the book is computed by `tools/figs.py` (writes `spreads/05-data.js`); the derivations were checked
symbolically with SymPy (hoop, double pendulum T, V and both Euler–Lagrange equations, Kepler radial equation,
the energy function of the hoop, the harmonic-oscillator change of action).

## Numbers (tools/figs.py)
- Ball, m = 0.2 kg, g = 9.8 m/s², up and down in 2 s: actions −6.403, −6.156 (±1 m sine bump), −4.803 (triangle), 0, 0 J·s;
  quadratic coefficient 0.2467 = mπ²/(4T).
- Fermat, n = 1.33, A 1 m above, B 1 m below, 2 m apart: crossing at 1.268 m, θ₁ = 51.75°, θ₂ = 36.19°,
  sin θ₁ / sin θ₂ = 1.330; 10.88 ns against 10.99 ns for the straight line.
- Harmonic oscillator, m = k = 1: ΔS/ε² = (j²π² − T²)/(4T): +0.734, +4.435 (T = 2), −0.383, +1.467 (T = 4).
- Hoop: cos θ* = (ω_c/ω)²; 46.0°, 63.6°, 75.5° at 1.2, 1.5, 2 ω_c.
- Double pendulum, ℓ = 1 m, m = 1 kg, g = 9.81, both at 120°: RK4, dt = 2 ms, energy drift 1e-6 over 20 s;
  twin with θ₁ + 0.001 rad differs by 10° in θ₂ after 5.78 s.
- Kepler, m = k = p_φ = 1, E = −0.3: r from 0.613 to 2.721; e = 0.632; sectors over one tenth of the period:
  0.676 and 0.677 (expected 0.676).
- Pendulum H = p²/2 − cos q; Liouville square q ∈ [−0.3, 0.3], p ∈ [1.3, 1.9]: area 0.360 at t = 0, 4, 16 (2,000 boundary points, RK4).
- Hénon–Heiles, E = 1/8: 25 orbits, section x = 0, p_x > 0; 2,207 points; energy error 2e-10.

## History (standard facts, from general references)
- Fermat's principle: letter of 1662. Kepler's second law: Astronomia nova, 1609.
- E. Noether, "Invariante Variationsprobleme", Göttingen 1918.
- W. R. Hamilton, "On a General Method in Dynamics", 1834 and 1835.
- J. Liouville, 1838. M. Hénon and C. Heiles, Astronomical Journal 69 (1964). P. A. M. Dirac, 1925.

## Art
- Gemini (gemini.google.com), November 2026: cover (watercolour journal), three pastel plate sheets, a washi-tape sheet,
  chapter openers 1, 2, 5, 6; openers 3–4 are crops of the night-sky style sample.
