"""Compute every number and curve the book prints. Writes spreads/05-data.js and prints the numbers quoted in the text.
usage: python3 tools/figs.py   (from the book folder)"""
import json, math, os
import numpy as np

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = {}
def r(a, d=3): return [round(float(v), d) for v in a]
def rk4(f, y, dt):
    k1 = f(y); k2 = f(y + dt / 2 * k1); k3 = f(y + dt / 2 * k2); k4 = f(y + dt * k3)
    return y + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
def integ(f, y0, dt, n):
    ys = [np.array(y0, float)]
    for _ in range(n): ys.append(rk4(f, ys[-1], dt))
    return np.array(ys)
def trap(y, x): return float(np.trapezoid(y, x))

# ---------- Ch1: ball thrown up, caught at the same height after T = 2 s ----------
g, m, T = 9.8, 0.2, 2.0
t = np.linspace(0, T, 4001)
v0 = g * T / 2
print('Ch1/2 ball: v0 =', v0, 'm/s, top =', v0**2 / (2 * g), 'm at t =', T / 2)

# ---------- Ch2: action of candidate paths, y(0) = y(T) = 0 ----------
def action(y):
    v = np.gradient(y, t)
    return trap(0.5 * m * v**2 - m * g * y, t)
ytrue = v0 * t - 0.5 * g * t**2
eta = np.sin(np.pi * t / T)
paths = {
    'true path (parabola)': ytrue,
    'parabola + 1 m bump': ytrue + 1.0 * eta,
    'parabola - 1 m dip': ytrue - 1.0 * eta,
    'twice as high': 2 * ytrue,
    'stays on the ground': 0 * t,
    'straight up, straight down': np.where(t < T / 2, 4.9 * t, 4.9 * (T - t)),
}
S = {k: action(v) for k, v in paths.items()}
for k, v in S.items(): print(f'  S[{k}] = {v:.4f} J s')
# S(eps) = S0 + c eps^2 with c = (m/2) * int eta_dot^2 dt
c_eps = 0.5 * m * trap(np.gradient(eta, t)**2, t)
print('  quadratic coefficient c =', c_eps, ' exact m*pi^2/(4T) =', m * np.pi**2 / (4 * T))
eps = np.linspace(-1.5, 1.5, 61)
out['actionEps'] = [[round(e, 3), round(action(ytrue + e * eta), 4)] for e in eps]
out['actionPaths'] = {k: r(v[::100], 3) for k, v in paths.items()}
out['actionT'] = r(t[::100], 3)
out['actionTable'] = {k: round(v, 3) for k, v in S.items()}

# ---------- Ch2: Fermat, light from A (air) to B (water) ----------
a, b, d, n = 1.0, 1.0, 2.0, 1.33      # A is 1 m above the surface, B 1 m below, 2 m apart horizontally
cl = 1.0                               # time in units of 1/c (metres of light path in air)
xs = np.linspace(0, 2, 401)
tt = np.sqrt(a**2 + xs**2) + n * np.sqrt(b**2 + (d - xs)**2)
i = int(np.argmin(tt)); x0 = xs[i]
# refine
from math import sqrt, atan, sin, degrees
lo, hi = 0, 2
for _ in range(200):
    mid = (lo + hi) / 2
    der = mid / sqrt(a**2 + mid**2) - n * (d - mid) / sqrt(b**2 + (d - mid)**2)
    lo, hi = (mid, hi) if der < 0 else (lo, mid)
xm = (lo + hi) / 2
th1, th2 = atan(xm / a), atan((d - xm) / b)
print(f'Fermat: crossing x = {xm:.4f} m, theta1 = {degrees(th1):.2f} deg, theta2 = {degrees(th2):.2f} deg, sin1/sin2 = {sin(th1)/sin(th2):.4f}')
print(f'  time (in m/c): min {sqrt(a*a+xm*xm)+n*sqrt(b*b+(d-xm)**2):.4f}, straight line x=1: {sqrt(2)+n*sqrt(2):.4f}')
out['fermat'] = {'x': r(xs[::8]), 't': r(tt[::8], 4), 'xm': round(xm, 3), 'tm': round(sqrt(a*a+xm*xm)+n*sqrt(b*b+(d-xm)**2), 4)}

# ---------- Ch2: harmonic oscillator, stationary but not least ----------
# m = k = 1 (omega = 1). Delta S = eps^2/2 * int (eta_dot^2 - eta^2) dt for eta = sin(j pi t / T)
for TT in (2.0, 4.0):
    for j in (1, 2):
        val = 0.5 * TT / 2 * ((j * np.pi / TT)**2 - 1)
        print(f'HO: T = {TT}, eta = sin({j} pi t/T): Delta S / eps^2 = {val:.4f}')

# ---------- Ch3: bead on a rotating hoop ----------
# theta from the bottom; equilibria sin(theta) (omega^2 cos(theta) - g/R) = 0
wr = np.linspace(0, 2.5, 251)    # omega / omega_c
branch = [[round(w, 3), round(degrees(math.acos(1 / w**2)), 2)] for w in wr if w > 1]
out['hoopBranch'] = [[1.0, 0.0]] + branch
for w in (1.2, 1.5, 2.0): print(f'hoop: omega/omega_c = {w}: theta* = {degrees(math.acos(1/w**2)):.1f} deg')
th = np.linspace(-np.pi, np.pi, 241)
def ueff(w): return -np.cos(th) - 0.5 * w**2 * np.sin(th)**2     # in units of m g R
out['hoopU'] = {'th': r(np.degrees(th), 1), 'u08': r(ueff(0.8)), 'u15': r(ueff(1.5))}

# ---------- Ch3: double pendulum (m1 = m2 = 1 kg, l1 = l2 = 1 m) ----------
G = 9.81
def dp(y):
    t1, t2, w1, w2 = y; dl = t1 - t2
    den = 3 - math.cos(2 * dl)
    a1 = (-G * 3 * math.sin(t1) - G * math.sin(t1 - 2 * t2) - 2 * math.sin(dl) * (w2**2 + w1**2 * math.cos(dl))) / den
    a2 = (2 * math.sin(dl) * (2 * w1**2 + 2 * G * math.cos(t1) + w2**2 * math.cos(dl))) / den
    return np.array([w1, w2, a1, a2])
def dpE(y):
    t1, t2, w1, w2 = y
    Tk = w1**2 + 0.5 * w2**2 + w1 * w2 * math.cos(t1 - t2)
    V = -2 * G * math.cos(t1) - G * math.cos(t2)
    return Tk + V
y0 = [math.radians(120), math.radians(120), 0, 0]
Y = integ(dp, y0, 0.002, 10000)       # 20 s
x2 = np.sin(Y[:, 0]) + np.sin(Y[:, 1]); y2 = -np.cos(Y[:, 0]) - np.cos(Y[:, 1])
print('double pendulum energy drift over 20 s:', dpE(Y[-1]) - dpE(Y[0]))
out['dpTrace'] = [[round(a, 3), round(b, 3)] for a, b in zip(x2[::5], y2[::5])]
Y2 = integ(dp, [y0[0] + 1e-3, y0[1], 0, 0], 0.002, 10000)
tt2 = np.arange(len(Y)) * 0.002
out['dpTwin'] = {'t': r(tt2[::20], 2), 'a': r(np.degrees(Y[::20, 1]), 1), 'b': r(np.degrees(Y2[::20, 1]), 1)}
k_sep = next(k for k in range(len(Y)) if abs(Y[k, 1] - Y2[k, 1]) > math.radians(10))
print(f'double pendulum: twins differ by 10 deg in theta2 after {tt2[k_sep]:.2f} s')

# ---------- Ch3: Kepler effective potential, units with k = m = 1, L = 1 ----------
rr = np.linspace(0.3, 6, 300)
out['kepler'] = {'r': r(rr), 'u': r(1 / (2 * rr**2) - 1 / rr)}
E = -0.3
disc = 1 + 2 * E   # roots of E r^2 + r - 1/2 = 0
rmin, rmax = (-1 + math.sqrt(disc)) / (2 * E), (-1 - math.sqrt(disc)) / (2 * E)
print(f'Kepler: E = {E}: r between {min(rmin,rmax):.3f} and {max(rmin,rmax):.3f}; circular orbit r = 1, U = -0.5')
out['keplerE'] = [E, round(min(rmin, rmax), 3), round(max(rmin, rmax), 3)]

# ---------- Ch4: equal areas on the same orbit (r = 1 / (1 + e cos phi), p_phi = m = k = 1) ----------
ecc = math.sqrt(1 + 2 * E)
def rad(f): return 1 / (1 + ecc * math.cos(f))
phis = np.linspace(-np.pi, np.pi, 361)
out['orbit'] = [[round(rad(f) * math.cos(f), 3), round(rad(f) * math.sin(f), 3)] for f in phis]
sma = 0.5 * (rad(0) + rad(math.pi)); period = 2 * math.pi * sma**1.5; dts = period / 10
def advance(f0, tt_):   # integrate dphi/dt = 1 / r^2 for a time tt_
    f, h = f0, tt_ / 4000
    for _ in range(4000):
        k1 = 1 / rad(f)**2; k2 = 1 / rad(f + h / 2 * k1)**2; k3 = 1 / rad(f + h / 2 * k2)**2; k4 = 1 / rad(f + h * k3)**2
        f += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    return f
def sector(fc):
    f0 = advance(fc, -dts / 2); f1 = advance(fc, dts / 2)
    fs = np.linspace(f0, f1, 60)
    poly = [[0.0, 0.0]] + [[round(rad(f) * math.cos(f), 3), round(rad(f) * math.sin(f), 3)] for f in fs] + [[0.0, 0.0]]
    P = np.array(poly); A = 0.5 * abs(np.dot(P[:, 0], np.roll(P[:, 1], -1)) - np.dot(P[:, 1], np.roll(P[:, 0], -1)))
    return poly, A, math.degrees(f1 - f0)
out['sectorA'], A1, d1 = sector(0.0)
out['sectorB'], A2, d2 = sector(math.pi)
print(f'Kepler areas: e = {ecc:.3f}, period = {period:.3f}, dt = {dts:.3f}; near sun {A1:.4f} (spans {d1:.1f} deg), far {A2:.4f} (spans {d2:.1f} deg), expected {0.5*dts:.4f}')

# ---------- Ch5: harmonic oscillator ellipses, m = 1, omega = 1.5 ----------
om = 1.5; ph = np.linspace(0, 2 * np.pi, 121)
out['hoEll'] = [{'E': E, 'x': r(np.sqrt(2 * E) / om * np.cos(ph)), 'p': r(-np.sqrt(2 * E) * np.sin(ph))} for E in (0.5, 1.0, 2.0)]

# ---------- Ch6: pendulum phase portrait, H = p^2/2 - cos q ----------
q = np.linspace(-np.pi, np.pi, 241)
curves = []
for E in (-0.8, -0.5, 0.0, 0.5, 0.98):
    ok = E + np.cos(q) >= 0
    qq = q[ok]; pp = np.sqrt(2 * (E + np.cos(qq)))
    curves.append({'E': E, 'kind': 'lib', 'q': r(np.concatenate([qq, qq[::-1], qq[:1]])), 'p': r(np.concatenate([pp, -pp[::-1], pp[:1]]))})
for E in (1.0,):
    pp = np.sqrt(2 * (E + np.cos(q)))
    curves.append({'E': E, 'kind': 'sep', 'q': r(q), 'p': r(pp)}); curves.append({'E': E, 'kind': 'sep', 'q': r(q), 'p': r(-pp)})
for E in (1.5, 2.5):
    pp = np.sqrt(2 * (E + np.cos(q)))
    curves.append({'E': E, 'kind': 'rot', 'q': r(q), 'p': r(pp)}); curves.append({'E': E, 'kind': 'rot', 'q': r(q), 'p': r(-pp)})
out['pend'] = curves

# ---------- Ch6: Liouville, a square of initial conditions under the pendulum ----------
def rk4v(Y, dt):   # one step for many points at once, Y = [q array, p array]
    f = lambda Z: np.array([Z[1], -np.sin(Z[0])])
    k1 = f(Y); k2 = f(Y + dt / 2 * k1); k3 = f(Y + dt / 2 * k2); k4 = f(Y + dt * k3)
    return Y + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
q0, p0, s = -0.3, 1.3, 0.6
nb = 2000; u = np.linspace(0, 1, nb // 4, endpoint=False)
Yb = np.array([np.concatenate([q0 + s * u, np.full_like(u, q0 + s), q0 + s * (1 - u), np.full_like(u, q0)]),
               np.concatenate([np.full_like(u, p0), p0 + s * u, np.full_like(u, p0 + s), p0 + s * (1 - u)])])
def area(x, y): return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))
blobs = []; tcur = 0.0; dtl = 0.002
for tf in (0.0, 4.0, 16.0):
    while tcur < tf - 1e-9: Yb = rk4v(Yb, dtl); tcur += dtl
    blobs.append({'t': tf, 'q': r(Yb[0][::4]), 'p': r(Yb[1][::4]), 'area': round(area(Yb[0], Yb[1]), 4)})
    print(f'Liouville: t = {tf}: area = {area(Yb[0], Yb[1]):.4f} (start {s*s:.4f}), q from {Yb[0].min():.2f} to {Yb[0].max():.2f}')
out['blobs'] = blobs
E0 = Yb  # unused
print('  energies in the square: from', round(float(min(p0**2/2 - math.cos(q) for q in (q0, q0+s, 0))), 3), 'to', round((p0+s)**2/2 - math.cos(q0+s), 3))

# ---------- Ch6: Henon-Heiles Poincare section at E = 1/8 (x = 0, px > 0) ----------
def hh(y):
    x, yy, px, py = y
    return np.array([px, py, -x - 2 * x * yy, -yy - x * x + yy * yy])
def hhE(y): x, yy, px, py = y; return 0.5 * (px * px + py * py) + 0.5 * (x * x + yy * yy) + x * x * yy - yy**3 / 3
En = 1 / 8; pts = []
rng = np.random.default_rng(3)
for k in range(26):
    yy0 = -0.35 + 0.7 * rng.random(); py0 = -0.45 + 0.9 * rng.random()
    rest = 2 * En - py0**2 - yy0**2 + 2 * yy0**3 / 3
    if rest <= 0: continue
    yv = np.array([0.0, yy0, math.sqrt(rest), py0]); hits = []; dt = 0.01
    for _ in range(60000):
        yn = rk4(hh, yv, dt)
        if yv[0] < 0 <= yn[0] and yn[2] > 0:
            f = -yv[0] / (yn[0] - yv[0]); hp = yv + f * (yn - yv); hits.append((round(hp[1], 3), round(hp[3], 3)))
        yv = yn
        if len(hits) >= 220: break
    pts.append(hits)
print('Henon-Heiles: orbits', len(pts), 'points', sum(len(h) for h in pts), 'energy check', hhE(yv) - En)
out['hh'] = pts

with open(os.path.join(HERE, 'spreads', '05-data.js'), 'w') as f:
    f.write('// computed by tools/figs.py — do not edit by hand\nconst FIG = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('wrote 05-data.js', os.path.getsize(os.path.join(HERE, 'spreads', '05-data.js')), 'bytes')
