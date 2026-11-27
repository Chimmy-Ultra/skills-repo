// the order of the spreads
const SPREADS = [
  ch1_a, ch1_b, ch1_c,
  ch2_a, ch2_b, ch2_c, ch2_d,
  ch3_a, ch3_b, ch3_c, ch3_d, ch3_e,
  ch4_a, ch4_b, ch4_c,
  ch5_a, ch5_b, ch5_c,
  ch6_a, ch6_b, ch6_c, ch6_d,
];

// spread k (counting from 1) holds pages 2k−1 and 2k; the HUD page box uses the same numbers (book.json pageJump)
SPREADS.forEach((s, i) => {
  const plan = s.plan;
  s.plan = function (c) { plan.call(this, c); pageNo(c, 2 * i + 1, 2 * i + 2); };
});
