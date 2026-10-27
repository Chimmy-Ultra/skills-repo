# Special cases for 汴京一日 that the manifest cannot express. Runs after the manifest items; T is the Cutter.
def run(T):
    # ---- 朱雀門: patch the see-through centre bay with a lattice bay, cut the gate passage through ----
    g = T.load('01-zhuque-gate')
    win = g[335:402, 940:1042].copy()                     # a lattice bay from the right side of the tower
    patch = cv2.resize(win, (130, 96), interpolation=cv2.INTER_CUBIC)
    y0, x0 = 329, 703
    reg = g[y0:y0 + 96, x0:x0 + 130]
    holeA = reg[..., 3] < 128
    reg[holeA] = patch[holeA]; reg[..., 3] = 255
    blk = ((g[..., :3].max(axis=2) < 40) & (g[..., 3] > 128)).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(blk)
    big = 1 + int(np.argmax(st[1:, 4]))
    passage = (lab == big).astype(np.uint8)
    passage = cv2.morphologyEx(passage, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    ys, xs = np.nonzero(passage)
    gate = T.cut('gate', g, cap=1100, hole_mask=passage)
    # the passage in the gate's texture pixels: the doors are fitted into it (INFO.gate.passage_tex)
    px0, py0, ps = gate['src']
    b = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
    T.info['gate'] = {'passage_src': b, 'passage_tex': [round((b[0] - px0) * ps, 1), round((b[1] - py0) * ps, 1), round((b[2] - px0) * ps, 1), round((b[3] - py0) * ps, 1)]}

    # ---- the gate doors: split the pair into two leaves at the centre seam ----
    d = T.load('02-zhuque-doors')
    ys, xs = np.nonzero(d[..., 3] > 128)
    mid = (xs.min() + xs.max()) // 2
    L = np.zeros(d.shape[:2], np.uint8); L[:, :mid] = 1
    T.cut('door-l', d, mask=L, cap=520, margin=0)
    T.cut('door-r', d, mask=1 - L, cap=520, margin=0)

    # ---- the city wall, and two long stretches of it either side of the gate ----
    wl = T.load('03-city-wall')
    T.cut('wall', wl, cap=1536, margin=0)
    long = np.concatenate([wl, wl[:, ::-1], wl], axis=1)
    ys, xs = np.nonzero(long[..., 3] > 128)
    hh = ys.max() - ys.min() + 12
    need = int(hh * 0.47 / 0.085)
    T.cut('wall-l', long[:, 40:40 + need].copy(), cap=1900, margin=0)
    T.cut('wall-r', long[:, 1500:1500 + need].copy(), cap=1900, margin=0)
