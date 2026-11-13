// ======================= Chapter 4 helper: a five-lane timeline on a broken time axis =======================
// x axis in three equal segments: 9000 BC – AD 0, AD 0 – 1800, 1800 – 2030 (each segment linear).
function tlX(year, x0, x1) {
  const seg = (x1 - x0) / 3;
  if (year < 0) return x0 + ((year + 9000) / 9000) * seg;
  if (year < 1800) return x0 + seg + (year / 1800) * seg;
  return x0 + 2 * seg + ((year - 1800) / 230) * seg;
}
function timeline(lanes, { laneH = 0.072, size = 0.0152 } = {}) {
  return (c, x, y, w) => {
    const lx = x + 0.085, x0 = lx + 0.004, x1 = x + w - 0.004, seg = (x1 - x0) / 3;
    lanes.forEach((L, i) => {
      const yy = y - 0.045 - i * laneH;
      c.text({ x: x, y: yy + size * 0.65, w: 0.085, size: size * 1.12, lh: 1.2, paras: [L.name], color: INK, italic: true });
      c.line([[x0, yy], [x1, yy]], 'rgba(42,33,25,0.3)', 0.0012);
      L.ev.forEach(([yr, lab], k) => {
        const px = tlX(yr, x0, x1);
        c.fill([[px - 0.006, yy], [px, yy + 0.006], [px + 0.006, yy], [px, yy - 0.006]], L.tone);
        const ly = yy + 0.008 + (k % 2 ? size * 1.5 : 0) + size * 1.1;   // labels above the lane, odd ones one line higher
        if (k % 2) c.line([[px, yy + 0.006], [px, ly - size * 1.15]], 'rgba(42,33,25,0.35)', 0.0008);
        c.text({ x: px, y: ly, w: 0.16, size, lh: 1.15, align: 'center', paras: [lab], color: '#3d3127' });
      });
    });
    const yb = y - 0.045 - (lanes.length - 1) * laneH - 0.022;
    c.line([[x0, yb], [x1, yb]], 'rgba(42,33,25,0.75)', 0.0014);
    [[x0, '9000 BC'], [x0 + seg, 'AD 1'], [x0 + 2 * seg, '1800'], [x1, '2026']].forEach(([px, lab]) => {
      c.line([[px, yb], [px, yb - 0.008]], 'rgba(42,33,25,0.75)', 0.0012);
      c.text({ x: px, y: yb - 0.011, w: 0.1, size, lh: 1.2, align: 'center', paras: [lab], color: '#4a3d30' });
    });
    [x0 + seg, x0 + 2 * seg].forEach((px) => c.line([[px - 0.004, yb + 0.006], [px + 0.004, yb - 0.006]], INK, 0.0016));
    return y - yb + size * 2;
  };
}
