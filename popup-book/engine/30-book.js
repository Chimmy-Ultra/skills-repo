// ---------- the book: two base pages, one turning sheet with a soft curl, page blocks ----------
const NU = 84, NV = 36;
class Book {
  constructor(scene) {
    this.group = new THREE.Group(); scene.add(this.group);
    const mk = (x) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, 1), new THREE.MeshLambertMaterial({ color: '#ffffff' })); m.position.x = x; m.receiveShadow = true; this.group.add(m); return m; };
    this.baseL = mk(-PW / 2); this.baseR = mk(PW / 2);
    // page blocks (the stack of leaves under the open pages)
    const edgeCanvas = makeCanvas(8, 64), eg = edgeCanvas.getContext('2d');
    eg.fillStyle = '#e8dcc2'; eg.fillRect(0, 0, 8, 64);
    for (let y = 0; y < 64; y += 3) { eg.fillStyle = `rgba(120,96,64,${0.12 + 0.1 * Math.random()})`; eg.fillRect(0, y, 8, 1); }
    const edgeTex = texFromCanvas(edgeCanvas);
    const blockMat = [new THREE.MeshLambertMaterial({ map: edgeTex }), new THREE.MeshLambertMaterial({ map: edgeTex }), new THREE.MeshLambertMaterial({ map: edgeTex }), new THREE.MeshLambertMaterial({ map: edgeTex }), new THREE.MeshLambertMaterial({ color: '#e8dcc2' }), new THREE.MeshLambertMaterial({ color: '#3a2c20' })];
    const BT = 0.014;
    const blk = (x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(PW - 0.004, 1 - 0.006, BT), blockMat); m.position.set(x, 0, -BT / 2 - 0.0004); m.castShadow = true; m.receiveShadow = true; this.group.add(m); return m; };
    this.blockL = blk(-PW / 2 - 0.002); this.blockR = blk(PW / 2 + 0.002);
    // turning sheet: one grid, two meshes (front face / back face)
    const g = new THREE.BufferGeometry();
    const n = (NU + 1) * (NV + 1);
    this.uv0 = new Float32Array(n * 2); this.U = new Float32Array(n); this.V = new Float32Array(n);
    for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
      const id = j * (NU + 1) + i, u = (i / NU) * PW, v = j / NV - 0.5;
      this.U[id] = u; this.V[id] = v; this.uv0[id * 2] = 1 - u / PW; this.uv0[id * 2 + 1] = v + 0.5;
    }
    const idx = [];
    for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
      const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);   // x = -u, so this winding faces +z when the sheet lies on the left
    }
    g.setIndex(idx);
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(this.uv0, 2));
    this.sheetGeo = g;
    this.frontMat = new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.FrontSide });
    this.backMat = new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.BackSide });
    this.front = new THREE.Mesh(g, this.frontMat); this.back = new THREE.Mesh(g, this.backMat);
    this.front.castShadow = true; this.front.material.shadowSide = THREE.DoubleSide;
    this.front.frustumCulled = this.back.frustumCulled = false;
    this.group.add(this.front, this.back);
    this.curl(0, 0);
    this.sheetVisible(false);
    this.backClones = new Map();
  }
  sheetVisible(v) { this.front.visible = this.back.visible = v; }
  setBase(side, tex) {
    const m = side < 0 ? this.baseL : this.baseR;
    m.visible = !!tex;
    if (tex && m.material.map !== tex) { m.material.map = tex; m.material.needsUpdate = true; }
  }
  // the back face reads the right-page canvas mirrored along u
  backTex(tex) {
    if (!this.backClones.has(tex)) { const c = tex.clone(); c.repeat.set(-1, 1); c.offset.set(1, 0); this.backClones.set(tex, c); }
    return this.backClones.get(tex);
  }
  setSheet(frontTex, backTex) {
    const bt = this.backTex(backTex);
    if (this.frontMat.map !== frontTex) { this.frontMat.map = frontTex; this.frontMat.needsUpdate = true; }
    if (this.backMat.map !== bt) { this.backMat.map = bt; this.backMat.needsUpdate = true; }
  }
  // t: 0 = sheet lies on the left page, 1 = lies on the right page. beta tilts the fold line (finger height).
  curl(t, beta) {
    const R0 = 0.115;
    const R = R0 * Math.pow(1 - t, 0.75) * smooth(0, 0.08, t) + 1e-5;
    const uf = (1 - t) * (PW + 0.22) - (Math.PI / 2) * R * t;
    const b = beta * Math.sin(Math.PI * t), cb = Math.cos(b), sb = Math.sin(b);
    const pos = this.sheetGeo.attributes.position.array, U = this.U, V = this.V, piR = Math.PI * R;
    for (let id = 0; id < U.length; id++) {
      let u = U[id], v = V[id], z = 0;
      const d = (u - uf) * cb + v * sb;
      if (d > 0) {
        let dd;
        if (d < piR) { const a = d / R; dd = R * Math.sin(a); z = R * (1 - Math.cos(a)); } else { dd = piR - d; z = 2 * R; }
        u -= (d - dd) * cb; v -= (d - dd) * sb;
      }
      pos[id * 3] = -u; pos[id * 3 + 1] = v; pos[id * 3 + 2] = z + 0.0006;
    }
    this.sheetGeo.attributes.position.needsUpdate = true;
    this.sheetGeo.computeVertexNormals();
    this.sheetGeo.computeBoundingSphere();
  }
}
