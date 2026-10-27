// ---------- die-cut cards ----------
// PIECES is injected by the build: {id: {w, h, rings: [{hole, pts}]}} (texture pixels, y down)
const CARD_T = 0.0022;
const RISE_TAN = Math.tan((46 * Math.PI) / 180);                       // card thickness (world)
const texLoader = new THREE.TextureLoader();
const TEX = new Map();
function pieceTex(id) {
  if (!TEX.has(id)) {
    const p = texLoader.loadAsync(`a/${id}.webp`).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; });
    TEX.set(id, p);
  }
  return TEX.get(id);
}
const stockMat = new THREE.MeshLambertMaterial({ color: STOCK });
const edgeMat = new THREE.MeshLambertMaterial({ color: '#e3d6bb' });

function cardGeometry(p, s, mirror, ax, sy = s) {
  const toV = ([px, py]) => new THREE.Vector2(mirror * (px - ax * p.w) * s, (p.h - 1 - py) * sy);
  const outers = p.rings.filter((r) => !r.hole), holes = p.rings.filter((r) => r.hole);
  const shapes = outers.map((o) => new THREE.Shape(o.pts.map(toV)));
  for (const h of holes) {
    const k = outers.findIndex((o) => pointInPoly(h.pts[0], o.pts));
    if (k >= 0) shapes[k].holes.push(new THREE.Path(h.pts.map(toV)));
  }
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: CARD_T, bevelEnabled: false, curveSegments: 1, steps: 1 });
  geo.translate(0, 0, -CARD_T);
  const pos = geo.attributes.position, nrm = geo.attributes.normal, uv = geo.attributes.uv;
  const front = [], back = [], side = [];
  for (let i = 0; i < pos.count; i += 3) { const nz = nrm.getZ(i); (nz > 0.5 ? front : nz < -0.5 ? back : side).push(i, i + 1, i + 2); }
  geo.setIndex([...front, ...back, ...side]);
  geo.clearGroups(); geo.addGroup(0, front.length, 0); geo.addGroup(front.length, back.length, 1); geo.addGroup(front.length + back.length, side.length, 2);
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (mirror * pos.getX(i) / s + ax * p.w) / p.w, (pos.getY(i) / sy + 0.5) / p.h);
  return geo;
}

// A card stands on the page at (x, y), hinged along its foot.
// rise = 1: standing; rise = 0: folded flat face-up, lying back toward north, so the print stays visible on the page.
class Card {
  constructor(def) {
    this.def = def;
    const p = PIECES[def.id];
    if (!p) throw new Error('missing piece ' + def.id);
    this.p = p;
    this.s = def.h ? def.h / p.h : def.w / p.w;
    this.sy = def.h && def.w ? def.h / p.h : this.s; if (def.h && def.w) this.s = def.w / p.w;
    this.mirror = def.mirror ? -1 : 1;
    this.ax = def.ax ?? 0.5;
    this.root = new THREE.Group(); this.pivot = new THREE.Group(); this.hinge = new THREE.Group();
    this.root.add(this.pivot); this.pivot.add(this.hinge);
    this.root.position.set(def.x, def.y, def.z || 0);
    this.root.rotation.z = ((def.rot || 0) * Math.PI) / 180;
    this.geo = cardGeometry(p, this.s, this.mirror, this.ax, this.sy);
    this.mat = new THREE.MeshLambertMaterial({ color: '#ffffff' });
    this.mesh = new THREE.Mesh(this.geo, [this.mat, stockMat, edgeMat]);
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.mesh.userData.card = this;
    this.mesh.position.z = CARD_T + 0.0003;
    this.hinge.add(this.mesh);
    this.ready = pieceTex(def.id).then((t) => { this.mat.map = t; this.mat.needsUpdate = true; });
    this.rise = 1; this.lean = 0; this.setRise(1);
    this.width = p.w * this.s; this.height = p.h * this.sy;
  }
  setRise(r) {
    this.rise = r; const phi = (Math.PI / 2) * r;
    this.hinge.rotation.x = phi + this.lean;
    // seen from the oblique eye a rising card would stretch ~1.4x half-way up; ease most of that out
    const f = Math.cos(phi) + Math.sin(phi) * RISE_TAN, target = 1 + (RISE_TAN - 1) * Math.sin(phi);
    this.mesh.scale.y = lerp(1, target / f, 0.65);
  }
  // affine map texture px -> book-local plan (x, y) when the card lies folded flat
  foldedAffine(bookGroup) {
    const keep = this.rise;
    this.setRise(0); this.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(bookGroup.matrixWorld).invert();
    const M = new THREE.Matrix4().multiplyMatrices(inv, this.mesh.matrixWorld);
    const p = this.p, s = this.s, sy = this.sy, m = this.mirror, ax = this.ax;
    const L = (px, py) => V3(m * (px - ax * p.w) * s, (p.h - 1 - py) * sy, 0).applyMatrix4(M);
    const P0 = L(0, 0), P1 = L(1, 0), P2 = L(0, 1);
    this.setRise(keep); this.root.updateMatrixWorld(true);
    return [P1.x - P0.x, P1.y - P0.y, P2.x - P0.x, P2.y - P0.y, P0.x, P0.y];
  }
}
