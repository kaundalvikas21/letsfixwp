// Back Online Today: a LetsFixWP film in the Tabletop App Flythrough style. One take over a dotted paper mat on a light oak desk.
// A small WordPress site (Pip, a browser-window creature) goes down. The LetsFixWP team pops up, hears the problem, and walks
// the job around the desk: a fixed price, a login the owner creates, a full backup. Then they fix Pip on its own card,
// cell by cell, and it comes back online. The voice-over clock is in vo.js; every action below is cued to its words.
import * as THREE from 'three';
import { card, pill, rbox } from './world.js';
import { makeMonster } from './voxel.js';
import * as K from './cards.js';
import { clamp, lerp, seg, ss, eo, ei, eio, back, hash, V, arc, pop, beatBounce, squash, hops, yawTo } from './anim.js';
import { VO, DUR as VDUR } from './vo.js';

export const DUR = VDUR;
export const END = { credit: VDUR + 1 };   // no sign-off: this film is the client's
export { VO };
export const GLYPHS = '';
const C = K.COL, TOP = .005, YAX = V(0, 1, 0);

// ── timeline (film seconds; cued to the voice) ──
export const T = {
  pipPop: .55, slump: [1.55, 1.95],
  visIn: [[3.1, 3.45], [3.35, 3.7]], bump: [3.75, 4.0], visOut: [[4.55, 4.95], [4.8, 5.2]],
  devPop: [6.6, 6.725, 6.85], route: [9.8, 11.2],
  type: [13.1, 14.1], send: 14.2, envPop: 14.3, envFly: [14.6, 15.2], taps: [15.25, 15.4], cause: 15.3,
  hopsP: [[17.5, 17.95], [18.05, 18.45]], badge1: 18.3, stamp: 19.0,
  hopsA: [[20.95, 21.35], [21.45, 21.85]], badge2: 21.9, keyPop: 22.4, pwCross: 24.0,
  hopsT: [[25.5, 25.9], [26.0, 26.4]], badge3: 26.45, data: [26.4, 27.3], drawerOut: 27.0, copyPop: 27.15, copyIn: [27.5, 27.85], drawerIn: [27.9, 28.2], lit: 28.25,
  jump: [28.9, 29.75], fixTaps: [...Array(7)].map((_, k) => 30.1 + k * .375), repair: [30.9, 32.75], hush: [33.0, 33.8],
  alive: 34.0, online: 34.08, visBack: [[34.9, 35.3], [35.15, 35.55]],
  keyDown: 36.75, removed: 37.05, title: [39.7, 40.0], crowd: 40.3,
};

// ── the desk ──
export const MAT = [2.88, 1.68];
export const CARDS = {
  site: { c: V(-.66, 0, -.34), w: .52, h: .36, yaw: .04 },
  phone: { c: V(-1.17, 0, .2), w: .22, h: .4, yaw: .1 },
  team: { c: V(-.72, 0, .42), w: .36, h: .24, yaw: -.03 },
  price: { c: V(-.12, 0, .47), w: .34, h: .24, yaw: .03 },
  access: { c: V(.5, 0, .45), w: .34, h: .26, yaw: -.05 },
};
export const at = (n, u, v, y = TOP) => { const d = CARDS[n]; return V(u / 1000 - d.w / 2, y, v / 1000 - d.h / 2).applyAxisAngle(YAX, d.yaw).add(d.c); };
const TOWER = { c: V(.9, 0, -.16), yaw: -.12, w: .28, d: .22, slab: .05, step: .056, n: 3 };
const TW_TOP = TOWER.n * TOWER.step - .006;
const twAt = (x, y, z) => V(x, y, z).applyAxisAngle(YAX, TOWER.yaw).add(TOWER.c);
const TITLE = { w: .9, h: .38, c: V(.1, 0, .02), yaw: .02 };

// ── pixel art ──
const toArt = (rows, pal) => { const cells = []; rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== '.') cells.push([i, j, pal[ch]]); })); return { w: rows[0].length, h: rows.length, cells }; };
// Pip, the client's site: a browser window with a face. Healthy and broken share one shape; only colours differ (the repair recolours it cell by cell)
const PIP = [
  '.TTTTTTTTTTTT.', 'TdTdTdTTTTTTTT', 'TTTTTTTTTTTTTT', 'WWWWWWWWWWWWWW', 'WWWWWWWWWWWWWW', 'WWWKKWWWWKKWWW', 'WWWKKWWWWKKWWW',
  'WWCWWWWWWWWCWW', 'WWWWWabbcWWWWW', 'WWWWWghhiWWWWW', 'WWWWWWWWWWWWWW', '.LL........LL.'];
// mouth cells: row 8 = a b b c, row 9 = g h h i. Healthy = smile (row 8 wide, row 9 centre); broken = frown (row 8 centre, row 9 wide)
const PIP_OK = { T: C.teal, d: '#fdfdfc', W: C.cream, K: '#0d0d0d', C: '#f2a3b3', L: C.ink, a: C.ink, b: C.ink, c: C.ink, g: C.cream, h: C.ink, i: C.cream };
const PIP_BAD = { T: '#8c939b', d: '#b9bfc6', W: '#c9ced3', K: '#0d0d0d', C: '#c9ced3', L: C.ink, a: '#c9ced3', b: C.ink, c: '#c9ced3', g: C.ink, h: C.ink, i: C.ink };
const CRACK = new Set(['4,3', '5,4', '5,5', '6,6', '7,7', '6,7', '7,10', '8,10', '9,4', '10,3', '12,9', '11,10', '2,9', '1,10', '3,2', '4,1']);   // wine cells while broken
const pipCol = ok => { const out = []; PIP.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.') return;
  out.push([i, j, !ok && CRACK.has(i + ',' + j) && (ch === 'W' || ch === 'T') ? C.red : (ok ? PIP_OK : PIP_BAD)[ch]]); })); return out; };
const PIP_BROKEN = pipCol(false), PIP_HEALTHY = pipCol(true);
// a half-resolution copy for the backup drawer
const half = cells => { const m = new Map(); cells.forEach(([i, j, c]) => { const k = (i >> 1) + ',' + (j >> 1); if (!m.has(k) || c === '#0d0d0d') m.set(k, c); }); return { w: 7, h: 6, cells: [...m].map(([k, c]) => { const [i, j] = k.split(',').map(Number); return [i, j, c]; }) }; };
// the team: three developers (front-facing pixel people)
const DEV = (long) => [
  '...HHHH...', '..HHHHHH..', long ? '.HHSSSSHH.' : '..HSSSSH..', long ? '.HSKSSKSH.' : '..SKSSKS..', long ? '.HSSSSSSH.' : '..SSSSSS..', '...SSSS...',
  '..AAAAAA..', '.AAAZZAAA.', '.AAAZZAAA.', 'SAAAAAAAAS', '.AAAAAAAA.', '..PPPPPP..', '..PP..PP..', '..PP..PP..', '..PP..PP..', '.OOO..OOO.'];
const devPal = (hood, zip, hair = '#1d1a18', skin = '#b07a52') => ({ H: hair, S: skin, K: '#0d0d0d', A: hood, Z: zip, P: '#3b4250', O: C.ink });
const VIS = ['..HHHH..', '.HHHHHH.', '.HSSSSH.', '.SKSSKS.', '.SSSSSS.', '..SSSS..', '.BBBBBB.', 'SBBBBBBS', '.BBBBBB.', '..PPPP..', '..P..P..', '.OO..OO.'];
const KEY = ['.YYY.......', 'YY.YYYYYYYY', '.YYY...Y.Y.'];
const ENV = ['EEEEEEEEE', 'EeEEEEEeE', 'EEeEEEeEE', 'EEEeEeEEE', 'EEEEeEEEE', 'EEEEEEEEE'];

// ── card art ──
function drawSite(c, st) {
  const w = 520, h = 360;
  c.clearRect(0, 0, w, h);
  c.fillStyle = C.card; K.rr(c, 0, 0, w, h, 16); c.fill();
  c.save(); K.rr(c, 0, 0, w, h, 16); c.clip(); K.grain(c, w, h, 3.1);
  // browser chrome: three dots, address bar, status chip
  c.fillStyle = '#eef1f4'; c.fillRect(0, 0, w, 56);
  ['#e7a6a6', '#ecd59a', '#a9d8b8'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(26 + i * 20, 28, 6.5, 0, 7); c.fill(); });
  c.fillStyle = '#fdfdfc'; K.rr(c, 96, 14, 270, 28, 14); c.fill();
  K.txt(c, 'your-site', 116, 29, { size: 15, wt: 600, col: C.mute });
  const ok = st.ok;
  c.fillStyle = ok ? C.green : C.red; K.rr(c, 386, 13, 116, 30, 15); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(404, 28, 5, 0, 7); c.fill();
  K.txt(c, ok ? 'ONLINE' : 'DOWN', 418, 29, { size: 15, wt: 700, col: '#fff', ls: 2 });
  if (!ok) {
    // the error page, with a glitch that jumps on the 8ths
    K.txt(c, 'Error establishing a', 34, 128, { size: 27, wt: 800, font: K.SANS });
    K.txt(c, 'database connection', 34, 164, { size: 27, wt: 800, font: K.SANS });
    c.fillStyle = C.line; c.fillRect(34, 196, 250, 3); c.fillRect(34, 212, 200, 3); c.fillRect(34, 228, 228, 3);
    for (let k = 0; k < 3; k++) { const y = 80 + hash(st.g * 3 + k) * 250, x = 20 + hash(st.g * 7 + k) * 200; c.fillStyle = k ? 'rgba(163,36,58,.22)' : 'rgba(163,36,58,.4)'; c.fillRect(x, y, 70 + hash(k + st.g) * 160, 5); }
  } else {
    // a small shop, alive
    c.fillStyle = C.plum; K.rr(c, 30, 76, 300, 108, 12); c.fill();
    K.txt(c, 'New season', 50, 116, { size: 24, wt: 800, font: K.SANS, col: '#fff' });
    c.fillStyle = C.mustard; K.rr(c, 50, 140, 104, 28, 14); c.fill(); K.txt(c, 'Shop now', 102, 154, { size: 13, wt: 800, font: K.SANS, align: 'center' });
    [C.cream, '#d8e7ef', '#efd9e0'].forEach((col, i) => { c.fillStyle = col; K.rr(c, 30 + i * 102, 200, 92, 92, 10); c.fill(); c.fillStyle = C.line; c.fillRect(30 + i * 102, 302, 70, 6); });
  }
  c.restore();
  c.strokeStyle = C.line; c.lineWidth = 3; K.rr(c, 1.5, 1.5, w - 3, h - 3, 15); c.stroke();
}
function drawPhone(c, st) {
  const w = 220, h = 400;
  c.clearRect(0, 0, w, h);
  c.fillStyle = C.ink; K.rr(c, 0, 0, w, h, 30); c.fill();
  c.fillStyle = '#f6f7f9'; K.rr(c, 9, 9, w - 18, h - 18, 22); c.fill();
  c.fillStyle = C.ink; K.rr(c, w / 2 - 26, 17, 52, 11, 6); c.fill();
  K.txt(c, '10:42', 24, 25, { size: 13, wt: 700 });
  // header: the LetsFixWP chat
  c.fillStyle = C.accent; c.beginPath(); c.arc(38, 62, 14, 0, 7); c.fill(); K.txt(c, 'L', 38, 63, { size: 15, wt: 800, font: K.SANS, col: '#fff', align: 'center' });
  K.txt(c, 'LetsFixWP', 60, 56, { size: 16, wt: 800, font: K.SANS }); c.fillStyle = C.green; c.beginPath(); c.arc(64, 74, 4, 0, 7); c.fill(); K.txt(c, 'online', 72, 74, { size: 11, wt: 600, col: C.mute });
  c.fillStyle = C.line; c.fillRect(16, 90, w - 32, 2);
  const bub = (s, mine, y) => { c.font = `700 14px ${K.SANS}`; const tw = c.measureText(s).width + 22; const x = mine ? w - 18 - tw : 18; c.fillStyle = mine ? C.accent : '#e6e9ee'; K.rr(c, x, y, tw, 32, 13); c.fill(); K.txt(c, s, x + 11, y + 17, { size: 14, wt: 700, font: K.SANS, col: mine ? '#fff' : C.ink }); };
  bub('What are you seeing?', false, 106);
  if (st.sent) bub('My site shows an error', true, 150);
  if (st.reply) bub('On it. Checking now.', false, 194);
  // input bar, typing
  c.fillStyle = '#e9ecf0'; K.rr(c, 16, h - 62, w - 74, 38, 19); c.fill();
  const msg = 'My site shows an error', n = st.typed || 0;
  if (n > 0) K.txt(c, msg.slice(0, Math.min(n, 13)) + (n > 13 ? '…' : ''), 28, h - 43, { size: 13, wt: 600, font: K.SANS });
  else K.txt(c, 'Message', 28, h - 43, { size: 13, wt: 600, font: K.SANS, col: '#98a1ab' });
  c.fillStyle = st.press ? '#d9431f' : C.accent; K.rr(c, w - 52, h - 62, 36, 38, 19); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.moveTo(w - 41, h - 52); c.lineTo(w - 25, h - 43); c.lineTo(w - 41, h - 34); c.closePath(); c.fill();
}
function drawTeam(c) {
  K.cardBase(c, 360, 240, 'LetsFixWP', 'On call for WordPress', { headH: 92, cnSize: 19 });
  [80, 180, 280].forEach(x => { c.save(); c.setLineDash([6, 6]); c.strokeStyle = '#cbd1d8'; c.lineWidth = 2; K.rr(c, x - 38, 112, 76, 108, 12); c.stroke(); c.restore(); });
}
function drawPrice(c, st) {
  K.cardBase(c, 340, 240, 'Price', null, { headH: 62 });
  K.txt(c, 'Fixed price', 28, 102, { size: 30, wt: 800, font: K.SANS });
  K.txt(c, 'agreed before work starts', 28, 138, { size: 16, wt: 600, col: C.mute });
  c.save(); c.setLineDash([7, 6]); c.strokeStyle = '#cbd1d8'; c.lineWidth = 2; K.rr(c, 28, 162, 190, 58, 12); c.stroke(); c.restore();
  if (st.agreed) {
    c.save(); c.translate(123, 191); c.rotate(-.06);
    c.strokeStyle = C.accent; c.lineWidth = 4; K.rr(c, -90, -24, 180, 48, 9); c.stroke();
    K.txt(c, 'AGREED', 0, 1, { size: 28, wt: 800, font: K.SANS, col: C.accent, align: 'center', ls: 4 });
    c.restore();
  }
}
function drawAccess(c, st) {
  K.cardBase(c, 340, 260, 'Access', null, { headH: 62 });
  if (st.removed) {
    c.fillStyle = 'rgba(60,156,110,.12)'; K.rr(c, 20, 84, 300, 150, 14); c.fill();
    K.tick(c, 64, 158, 40, C.green, 8);
    K.txt(c, 'Access', 104, 136, { size: 28, wt: 800, font: K.SANS }); K.txt(c, 'removed', 104, 174, { size: 28, wt: 800, font: K.SANS, col: C.green });
    return;
  }
  K.tick(c, 44, 110, 26, C.green, 6);
  K.txt(c, 'Login', 72, 102, { size: 24, wt: 800, font: K.SANS }); K.txt(c, 'created by you', 72, 130, { size: 16, wt: 600, col: C.mute });
  c.fillStyle = C.line; c.fillRect(24, 156, 292, 2);
  if (st.cross) K.cross(c, 44, 196, 20, C.red, 6);
  K.txt(c, 'Password', 72, 188, { size: 24, wt: 800, font: K.SANS, col: st.cross ? C.mute : C.ink }); K.txt(c, 'never asked', 72, 216, { size: 16, wt: 600, col: C.mute });
  if (st.cross) { c.fillStyle = C.red; c.fillRect(70, 188, 112, 3); }
}

export function build(ctx) {
  const { world, ev } = ctx, scene = world.scene;
  ctx.fx = { flash: 0 };
  const mat = (col, r = .5, extra = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: r, ...extra });

  // cards (canvases at 3.4× so print stays crisp in close-ups); redraw only when the state changes
  const cv = {}, cd = {}, state = {};
  const mk = (n, draw, init, thick) => { const d = CARDS[n], [c, x] = K.canvas(d.w * 1000, d.h * 1000, 3.4); cv[n] = x; draw(x, init); state[n] = JSON.stringify(init); const g = card(world, c, d.w, d.h, thick); g.position.copy(d.c); g.rotation.y = d.yaw; scene.add(g); cd[n] = g; };
  const re = (n, draw, st) => { const k = JSON.stringify(st); if (k === state[n]) return; state[n] = k; draw(cv[n], st); cd[n].userData.redraw(); };
  mk('site', drawSite, { ok: 0, g: 0 }, .007); mk('phone', drawPhone, {}, .009); mk('team', drawTeam, {}); mk('price', drawPrice, {}); mk('access', drawAccess, {});
  const PH = .009, ST = .007;

  // the backup tower: three slabs with windows, a drawer in the middle slab, a printed top
  const tw = new THREE.Group(); tw.position.copy(TOWER.c); tw.rotation.y = TOWER.yaw; scene.add(tw);
  const win = [];
  for (let k = 0; k < TOWER.n; k++) {
    const y = TOWER.slab / 2 + k * TOWER.step;
    const slab = new THREE.Mesh(rbox(TOWER.w, TOWER.slab, TOWER.d, .008), mat(C.card, .7)); slab.position.y = y; slab.castShadow = slab.receiveShadow = true; tw.add(slab);
    const [c, x] = K.canvas(280, 50, 2), tex = world.tex(c);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(TOWER.w, TOWER.slab), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: .6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: .18 })); face.position.set(0, y, TOWER.d / 2 + .0006); tw.add(face);
    win.push({ x, tex, state: '' });
  }
  const drawer = new THREE.Group(); tw.add(drawer);
  { const tray = new THREE.Mesh(rbox(.11, .034, .1, .004), mat('#dfe3e8', .6)); tray.position.y = TOWER.slab / 2 + TOWER.step; tray.castShadow = tray.receiveShadow = true; drawer.add(tray);
    const front = new THREE.Mesh(rbox(.12, .04, .006, .003), mat(C.accent, .45)); front.position.set(0, TOWER.slab / 2 + TOWER.step, .05); front.castShadow = true; drawer.add(front); }
  { const [c, x] = K.canvas(280, 220, 3.4); K.cardBase(x, 280, 220, 'Backup', null, { headH: 62, tagSize: 20 }); K.txt(x, 'Full copy', 28, 112, { size: 32, wt: 800, font: K.SANS }); K.txt(x, 'before any change', 28, 150, { size: 17, wt: 600, col: C.mute });
    const top = new THREE.Mesh(new THREE.PlaneGeometry(TOWER.w, TOWER.d), new THREE.MeshStandardMaterial({ map: world.tex(c), transparent: true, roughness: .8 })); top.rotation.x = -Math.PI / 2; top.position.y = TOWER.n * TOWER.step - .0055; tw.add(top); }
  const drawWin = (lit, phase) => win.forEach((w, k) => {
    const key = lit + ':' + phase; if (w.state === key) return; w.state = key; w.x.clearRect(0, 0, 280, 50);
    for (let i = 0; i < 7; i++) { const on = (i * 3 + k * 5 + phase) % 7 < 2; w.x.fillStyle = lit && k === 1 && i === 5 ? C.accent : on ? '#ffe7b0' : '#cfd5dc'; K.rr(w.x, 20 + i * 36, 16, 24, 18, 4); w.x.fill(); }
    w.tex.needsUpdate = true;
  });

  // title tent card beside the team
  const tent = new THREE.Group(); scene.add(tent);
  const TENT = { w: .2, h: .07, lean: .2 };
  const tentFace = new THREE.Group();
  { const [c, x] = K.canvas(640, 224, 1); x.fillStyle = C.card; x.fillRect(0, 0, 640, 224); K.grain(x, 640, 224, 9, 3000); x.fillStyle = C.accent; x.fillRect(0, 0, 16, 224);
    K.txt(x, 'LetsFixWP', 52, 92, { size: 100, wt: 800, font: K.SANS }); K.txt(x, 'WORDPRESS REPAIR', 56, 176, { size: 36, wt: 700, col: C.accent, ls: 7 });
    const face = new THREE.MeshStandardMaterial({ map: world.tex(c), roughness: .8 }), plain = new THREE.MeshStandardMaterial({ color: C.card, roughness: .85 });
    const f = new THREE.Mesh(new THREE.BoxGeometry(TENT.w, TENT.h, .0012), [plain, plain, plain, plain, face, plain]), b = new THREE.Mesh(new THREE.BoxGeometry(TENT.w, TENT.h, .0012), plain);
    const dz = Math.sin(TENT.lean) * TENT.h / 2, hy = Math.cos(TENT.lean) * TENT.h / 2;
    f.position.set(0, hy, dz); f.rotation.x = -TENT.lean; b.position.set(0, hy, -dz); b.rotation.x = TENT.lean; f.castShadow = b.castShadow = f.receiveShadow = true; tent.add(f, b); tentFace.userData.f = f;
    tent.position.set(-1.02, 0, .66); tent.rotation.y = .28; }

  // desk props: a pen, sticky notes, a mug of chai, a small plant, an eraser
  {
    const pen = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(.0065, .0065, .15, 20), mat('#2a3042', .35)); body.rotation.z = Math.PI / 2; pen.add(body);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.0065, .02, 20), mat('#c9ccd4', .3, { metalness: .6 })); tip.rotation.z = -Math.PI / 2; tip.position.x = .085; pen.add(tip);
    pen.position.set(-.05, .0065, .74); pen.rotation.y = .5; pen.traverse(o => o.castShadow = true); scene.add(pen);
    for (let i = 0; i < 4; i++) { const n = new THREE.Mesh(rbox(.11, .0016, .11, .002), mat(i === 3 ? '#f6d98a' : C.mustard, .85)); n.position.set(-1.2, .0008 + i * .0016, -.5); n.rotation.y = .25 + i * .03; n.castShadow = n.receiveShadow = true; scene.add(n); }
    const mug = new THREE.Group(); const cup = new THREE.Mesh(new THREE.CylinderGeometry(.052, .048, .1, 40, 1, true), mat('#f3efe7', .45, { side: THREE.DoubleSide })); cup.position.y = .05; mug.add(cup);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(.048, 40), mat('#f3efe7', .45)); bottom.rotation.x = -Math.PI / 2; bottom.position.y = .002; mug.add(bottom);
    const tea = new THREE.Mesh(new THREE.CircleGeometry(.049, 40), mat('#a9774e', .25)); tea.rotation.x = -Math.PI / 2; tea.position.y = .085; mug.add(tea);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(.026, .007, 12, 24, Math.PI), mat('#f3efe7', .45)); handle.rotation.z = -Math.PI / 2; handle.position.set(.052, .05, 0); mug.add(handle);
    mug.position.set(.35, 0, -.72); mug.rotation.y = 2.4; mug.traverse(o => o.castShadow = o.receiveShadow = true); scene.add(mug);
    const plant = new THREE.Group(); const potM = new THREE.Mesh(new THREE.CylinderGeometry(.045, .036, .07, 32), mat('#d98c6a', .8)); potM.position.y = .035; plant.add(potM);
    for (let k = 0; k < 7; k++) { const leaf = new THREE.Mesh(new THREE.SphereGeometry(.03, 16, 10), mat(k % 2 ? '#5f9e6e' : '#4f8a5f', .7)); leaf.scale.set(.55, 1.5, .3); const a = k / 7 * 6.28; leaf.position.set(Math.cos(a) * .02, .1 + (k % 3) * .012, Math.sin(a) * .02); leaf.rotation.set(Math.sin(a) * .5, a, Math.cos(a) * .5); plant.add(leaf); }
    plant.position.set(1.28, 0, .55); plant.traverse(o => o.castShadow = o.receiveShadow = true); scene.add(plant);
    const er = new THREE.Mesh(rbox(.05, .014, .022, .004), mat('#f0a7b3', .7)); er.position.set(1.0, .007, .74); er.rotation.y = .5; er.castShadow = true; scene.add(er);
  }
  // soft window light on the desk
  { const [c, x] = K.canvas(512, 512, 1); x.filter = 'blur(26px)'; x.fillStyle = 'rgba(255,236,205,1)';
    for (const [a, b] of [[60, 60], [270, 60], [60, 270], [270, 270]]) x.fillRect(a, b, 180, 180); x.filter = 'none';
    const lm = new THREE.MeshBasicMaterial({ map: world.tex(c), transparent: true, opacity: .2, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    for (const [px, pz, s, r] of [[-.25, .25, 1.1, .5], [.95, -.35, .8, .5]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s * .8), lm); m.rotation.set(-Math.PI / 2, 0, r); m.position.set(px, .0003, pz); m.renderOrder = 1; scene.add(m); } }

  // the route: orange dots from the team, past every promise, round the back to the site
  const FRONT = [at('team', 360, 150, 0), V(-.42, 0, .27), V(-.12, 0, .29), V(.2, 0, .27), V(.5, 0, .27), V(.7, 0, .12), twAt(-.08, 0, .16)];
  const BACK = [twAt(-.16, 0, -.05), V(.6, 0, -.36), V(.1, 0, -.42), V(-.28, 0, -.36), at('site', 520, 200, 0)];
  const under = (x, z, pad = .014) => Object.values(CARDS).some(d => { const q = V(x - d.c.x, 0, z - d.c.z).applyAxisAngle(YAX, -d.yaw); return Math.abs(q.x) < d.w / 2 + pad && Math.abs(q.z) < d.h / 2 + pad; })
    || (() => { const q = V(x - TOWER.c.x, 0, z - TOWER.c.z).applyAxisAngle(YAX, -TOWER.yaw); return Math.abs(q.x) < TOWER.w / 2 + .012 && Math.abs(q.z) < TOWER.d / 2 + .012; })();
  const mkRoute = pts => { const cr = new THREE.CatmullRomCurve3(pts.map(p => V(p.x, .0016, p.z))); return cr; };
  const fr = mkRoute(FRONT), br = mkRoute(BACK);
  const rp = [];
  for (let k = 0; k < 70; k++) rp.push(fr.getPointAt((k + .5) / 70));
  for (let k = 0; k < 48; k++) rp.push(br.getPointAt((k + .5) / 48));
  const routeIdx = rp.map((p, k) => under(p.x, p.z) ? -1 : k).filter(k => k >= 0);
  const routeMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(.0068, .0068, .0026, 18), new THREE.MeshStandardMaterial({ color: C.accent, roughness: .45, emissive: C.accent, emissiveIntensity: 0 }), routeIdx.length); routeMesh.castShadow = true; scene.add(routeMesh);

  // impact rings
  const RIP = [{ t: T.stamp, x: at('price', 123, 191).x, z: at('price', 123, 191).z }, { t: T.alive, x: CARDS.site.c.x, z: CARDS.site.c.z, big: 1 }, { t: T.title[1], x: TITLE.c.x, z: TITLE.c.z, big: 1 }];
  const rings = RIP.map(r => { const m = new THREE.Mesh(new THREE.RingGeometry(.97, 1, 96), new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(r.x, .0009, r.z); m.renderOrder = 2; scene.add(m); return { m, r }; });

  // the stamp
  const stamp = new THREE.Group(); scene.add(stamp);
  { const base = new THREE.Mesh(rbox(.1, .018, .05, .006), mat(C.ink, .45)); base.castShadow = true; stamp.add(base);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(.009, .012, .04, 16), mat('#7a5638', .5)); neck.position.y = .028; neck.castShadow = true; stamp.add(neck);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(.02, 20, 14), mat('#7a5638', .5)); knob.position.y = .058; knob.castShadow = true; stamp.add(knob); }

  // pills: step badges and the word that lands
  const badge = (s, bg = C.accent) => { const m = pill(world, s, { h: .034, size: 44, font: K.SANS, wt: 800, bg }); m.castShadow = false; m.renderOrder = 3; return m; };
  const badges = [[badge('1  PRICE'), at('price', 300, 40, .075), T.badge1, 3.0], [badge('2  ACCESS'), at('access', 300, 40, .08), T.badge2, 3.2], [badge('3  BACKUP'), twAt(.06, TW_TOP + .07, 0), T.badge3, 2.6]];
  const causePill = badge('CAUSE FOUND', C.ink), onlinePill = badge('ONLINE', C.green);

  // cast
  const pip = makeMonster({ w: 14, h: 12, cells: PIP_BROKEN }, .0072, 'pip', .85);
  const copy = makeMonster(half(PIP_HEALTHY), .0076, 'copy', .85);
  const devs = [devPal(C.teal, '#246f8a'), devPal(C.plum, '#6d4680', '#2a1d16', '#8d5a3b'), devPal(C.mustard, '#cf9d2c', '#1d1a18', '#c48b62')].map((pal, i) => makeMonster(toArt(DEV(i === 1), pal), .0066, 'dev' + i, .8));
  const visPal = [[C.cream, '#2a1d16', '#a46d47'], ['#9ec7d8', '#1d1a18', '#c48b62'], ['#efb7a5', '#3a2a20', '#8d5a3b'], ['#c8b6dc', '#1d1a18', '#b07a52'], ['#b9d9b0', '#2a1d16', '#9a6a46'], [C.cream, '#1d1a18', '#c48b62']];
  const visitors = visPal.map(([shirt, hair, skin], i) => makeMonster(toArt(VIS, { H: hair, S: skin, K: '#0d0d0d', B: shirt, P: '#4a5262', O: C.ink }), .0066, 'vis' + i, .8));
  const key = makeMonster(toArt(KEY, { Y: C.mustard }), .009, 'key', .9), env = makeMonster(toArt(ENV, { E: C.cream, e: '#c9a35a' }), .0072, 'env', .7);
  for (const m of [pip, copy, key, env, ...devs, ...visitors]) scene.add(m.root);

  // Pip's colours: the repair flips each cell from broken to healthy, row by row
  const cellFlip = PIP_BROKEN.map(([i, j], k) => T.repair[0] + (j / 11) * (T.repair[1] - T.repair[0] - .25) + hash(k * 3.7) * .25);
  const colBad = PIP_BROKEN.map(c => new THREE.Color(c[2])), colOk = PIP_HEALTHY.map(c => new THREE.Color(c[2]));
  let flipKey = '';
  const recolor = t => {
    const fl = cellFlip.map(f => t >= f ? 1 : 0), k = fl.join('');
    if (k === flipKey) return; flipKey = k;
    fl.forEach((f, i) => pip.mesh.setColorAt(i, f ? colOk[i] : colBad[i])); pip.mesh.instanceColor.needsUpdate = true;
  };

  // places
  const PIP_AT = at('site', 412, 236, ST);
  const teamSpot = i => at('team', 80 + 100 * i, 180, TOP);
  const dx = i => V((i - 1) * .072, 0, 0);
  const SITE_SPOTS = [at('site', 330, 262, ST), at('site', 486, 232, ST), at('site', 215, 150, ST)];
  const LEG = { p1: V(-.42, 0, .27), price: V(-.12, 0, .285), a1: V(.2, 0, .27), access: V(.5, 0, .265), t1: V(.7, 0, .16), tower: V(.72, 0, .03) };
  const devHops = i => {
    const o = i * .125, D = dx(i), L = [];
    const add = (t0, t1, from, to, h = .05) => L.push({ t0: t0 + o, t1: t1 + o, from, to, h });
    add(T.hopsP[0][0], T.hopsP[0][1], teamSpot(i), LEG.p1.clone().add(D), .07); add(T.hopsP[1][0], T.hopsP[1][1], LEG.p1.clone().add(D), LEG.price.clone().add(D), .06);
    add(T.hopsA[0][0], T.hopsA[0][1], LEG.price.clone().add(D), LEG.a1.clone().add(D), .07); add(T.hopsA[1][0], T.hopsA[1][1], LEG.a1.clone().add(D), LEG.access.clone().add(D), .06);
    add(T.hopsT[0][0], T.hopsT[0][1], LEG.access.clone().add(D), LEG.t1.clone().add(D.clone().multiplyScalar(.8)), .07); add(T.hopsT[1][0], T.hopsT[1][1], LEG.t1.clone().add(D.clone().multiplyScalar(.8)), LEG.tower.clone().add(V((i - 1) * .06, 0, (1 - Math.abs(i - 1)) * .03)), .06);
    add(T.jump[0], T.jump[1], LEG.tower.clone().add(V((i - 1) * .06, 0, (1 - Math.abs(i - 1)) * .03)), SITE_SPOTS[i], .42);
    return L;
  };
  const DEVH = [0, 1, 2].map(devHops);
  // visitors: two at the start bump the error and leave; they come back after the fix; four more join for the close
  const VSPOT = [at('site', 150, 270, ST), at('site', 220, 300, ST)];
  const VOFF = [V(-1.06, 0, -.22), V(-1.08, 0, -.12)];
  const QUEUE = [...Array(6)].map((_, k) => V(-.86 + k * .085, 0, -.05 + (k % 2) * .03));
  const visHops = k => {
    if (k < 2) return [
      { t0: T.visIn[k][0], t1: T.visIn[k][1], from: VOFF[k], to: VSPOT[k], h: .08 },
      { t0: T.bump[k] , t1: T.bump[k] + .22, from: VSPOT[k], to: VSPOT[k].clone().add(V(-.035, 0, 0)), h: .025 },
      { t0: T.visOut[k][0], t1: T.visOut[k][1], from: VSPOT[k].clone().add(V(-.035, 0, 0)), to: VOFF[k], h: .08 },
      { t0: T.visBack[k][0], t1: T.visBack[k][1], from: VOFF[k], to: VSPOT[k], h: .08 },
      { t0: T.crowd + .1 + k * .25, t1: T.crowd + .5 + k * .25, from: VSPOT[k], to: QUEUE[k], h: .06 },
    ];
    const st = V(-1.3, 0, .05 + (k % 2) * .08);
    return [{ t0: T.crowd + (k - 2) * .25 + .2, t1: T.crowd + (k - 2) * .25 + .62, from: st, to: QUEUE[k], h: .09 }];
  };
  const VISH = visitors.map((_, k) => visHops(k));

  // the closing title: a large paper card dropped into the open middle of the desk
  const bigTitle = new THREE.Group(); scene.add(bigTitle);
  { const [c, x] = K.canvas(900, 380, 3); x.fillStyle = C.card; K.rr(x, 0, 0, 900, 380, 24); x.fill(); K.grain(x, 900, 380, 13, 8000);
    x.fillStyle = C.accent; x.fillRect(0, 0, 22, 380);
    K.txt(x, 'LetsFixWP', 70, 120, { size: 132, wt: 800, font: K.SANS });
    K.txt(x, 'Broken WordPress? Back online today.', 76, 228, { size: 42, wt: 800, font: K.SANS, col: C.accent });
    K.txt(x, 'LETSFIXWP.COM', 78, 306, { size: 30, wt: 700, col: C.mute, ls: 6 });
    const g = card(world, c, TITLE.w, TITLE.h, .007); bigTitle.add(g); bigTitle.position.copy(TITLE.c); bigTitle.rotation.y = TITLE.yaw; }
  const tAt = (u, v, y = .0075) => V(u / 1000 - TITLE.w / 2, y, v / 1000 - TITLE.h / 2).applyAxisAngle(YAX, TITLE.yaw).add(TITLE.c);

  // pixel debris knocked out of Pip while the team works; data cubes for the backup
  const DEB = [...Array(36)].map((_, k) => { const a = k / 36 * Math.PI * 2 + hash(k) * .5; return { dir: V(Math.cos(a), 0, Math.sin(a) * .8), sp: .1 + hash(k * 3.1) * .14, up: .25 + hash(k * 7.7) * .35, tap: k % 7, col: [C.red, '#8c939b', '#c9ced3'][k % 3] }; });
  const debris = new THREE.InstancedMesh(rbox(.0058, .0058, .0058, .0012), new THREE.MeshStandardMaterial({ roughness: .5 }), DEB.length); debris.castShadow = true; scene.add(debris);
  DEB.forEach((d, k) => debris.setColorAt(k, new THREE.Color(d.col)));
  const PK = 12, packets = new THREE.InstancedMesh(rbox(.018, .018, .018, .004), new THREE.MeshStandardMaterial({ color: C.teal, roughness: .4, emissive: C.teal, emissiveIntensity: .25 }), PK); packets.castShadow = true; scene.add(packets);

  // ── text meant to be read: [id, text, t0, t1, corners()] ──
  const uv = (n, u0, v0, u1, v1, y = TOP) => () => [at(n, u0, v0, y), at(n, u1, v0, y), at(n, u0, v1, y), at(n, u1, v1, y)];
  const tentBox = (y0, y1) => () => { const f = tentFace.userData.f; f.updateMatrixWorld(); return [[-.5, y0], [.5, y0], [-.5, y1], [.5, y1]].map(([x, y]) => V(x * TENT.w, (.5 - y) * TENT.h, .0007).applyMatrix4(f.matrixWorld)); };
  const pillBox = m => () => { m.updateMatrixWorld(); const hw = m.w / 2, hh = m.geometry.parameters.height / 2; return [[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]].map(([x, y]) => V(x, y, 0).applyMatrix4(m.matrixWorld)); };
  const twTop = () => [twAt(-.13, TW_TOP, -.1), twAt(.13, TW_TOP, -.1), twAt(-.13, TW_TOP, .06), twAt(.13, TW_TOP, .06)];
  ctx.read = [
    ['err', 'Error establishing a database connection', .5, 5.75, uv('site', 30, 108, 320, 182, ST)],
    ['tent', 'LetsFixWP WORDPRESS REPAIR', 6.3, 12.2, tentBox(.08, .92)],
    ['msg', 'My site shows an error', T.send + .1, 17.4, uv('phone', 40, 150, 204, 182, PH)],
    ['cause', 'CAUSE FOUND', T.cause + .25, 17.8, pillBox(causePill)],
    ['price', 'Fixed price', 18.5, 21.2, uv('price', 26, 84, 250, 122)],
    ['agreed', 'AGREED', T.stamp + .1, 21.2, uv('price', 30, 165, 216, 218)],
    ['login', 'Login created by you', 22.2, 25.45, uv('access', 40, 88, 240, 142)],
    ['pw', 'Password never asked', 22.2, 25.45, uv('access', 40, 170, 240, 228)],
    ['backup', 'Full copy', 26.0, 28.9, () => [twAt(-.12, TW_TOP, -.04), twAt(.06, TW_TOP, -.04), twAt(-.12, TW_TOP, .02), twAt(.06, TW_TOP, .02)]],
    ['online', 'ONLINE', T.online + .2, 37.9, pillBox(onlinePill)],
    ['removed', 'Access removed', T.removed + .05, 39.7, uv('access', 40, 110, 280, 200)],
    ['title', 'LetsFixWP', T.title[1], DUR + 1, () => [tAt(66, 60), tAt(760, 60), tAt(66, 178), tAt(760, 178)]],
    ['tagline', 'Broken WordPress? Back online today.', T.title[1], DUR + 1, () => [tAt(72, 200), tAt(850, 200), tAt(72, 256), tAt(850, 256)]],
    ['url', 'LETSFIXWP.COM', T.title[1], DUR + 1, () => [tAt(74, 284), tAt(420, 284), tAt(74, 328), tAt(420, 328)]],
  ];
  badges.forEach(([m, , t0, hold], k) => ctx.read.push(['badge' + k, ['1 PRICE', '2 ACCESS', '3 BACKUP'][k], t0 + .25, t0 + hold - .3, pillBox(m)]));

  // ── sound events ──
  ev.push({ t: T.pipPop, type: 'pop', k: 0, bad: 1 }, { t: .9, type: 'glitch' }, { t: T.slump[0], type: 'slump' }, { t: T.slump[1], type: 'land', v: .6 },
    ...T.visIn.flatMap(([a, b]) => [{ t: a, type: 'hop' }, { t: b, type: 'land', v: .35 }]), ...T.bump.map(t => ({ t: t + .1, type: 'bump' })), { t: T.bump[1] + .25, type: 'wrong' },
    ...T.visOut.flatMap(([a, b]) => [{ t: a, type: 'hop' }, { t: b, type: 'land', v: .3 }]),
    ...T.devPop.map((t, k) => ({ t, type: 'pop', k: k + 2, big: 1 })),
    ...[...Array(12)].map((_, k) => ({ t: T.route[0] + k * .125, type: 'dot', k })),
    ...[...Array(8)].map((_, k) => ({ t: T.type[0] + k * .125, type: 'key' })), { t: T.send, type: 'send' }, { t: T.envPop, type: 'pop', k: 4 }, { t: T.envFly[0], type: 'fly' }, ...T.taps.map(t => ({ t, type: 'tap' })), { t: T.cause, type: 'badge', k: 0 },
    ...[T.hopsP, T.hopsA, T.hopsT].flatMap(H => H.flatMap(([a, b]) => [0, 1, 2].flatMap(i => [{ t: a + i * .125, type: 'hop', k: i }, { t: b + i * .125, type: 'land', v: .3 }]))),
    { t: T.badge1, type: 'badge', k: 1 }, { t: T.stamp - .25, type: 'drop' }, { t: T.stamp, type: 'stamp' },
    { t: T.badge2, type: 'badge', k: 2 }, { t: T.keyPop, type: 'pop', k: 1, big: 1 }, { t: T.pwCross, type: 'nope' },
    { t: T.badge3, type: 'badge', k: 0 }, { t: T.data[0], type: 'fetch' }, { t: T.drawerOut, type: 'drawer' }, { t: T.copyPop, type: 'pop', k: 3 }, { t: T.copyIn[1], type: 'land', v: .3 }, { t: T.drawerIn[0], type: 'drawer' }, { t: T.lit, type: 'lit' },
    ...[0, 1, 2].flatMap(i => [{ t: T.jump[0] + i * .125, type: 'jump' }, { t: T.jump[1] + i * .125, type: 'land', v: .55 }]),
    ...T.fixTaps.map((t, k) => ({ t, type: 'fixtap', k })), { t: T.repair[0], type: 'repair' },
    { t: T.alive - .2, type: 'rise' }, { t: T.alive, type: 'alive' }, { t: T.online, type: 'badge', k: 2 },
    ...T.visBack.flatMap(([a, b]) => [{ t: a, type: 'hop' }, { t: b, type: 'land', v: .35 }]),
    { t: T.keyDown, type: 'unpop' }, { t: T.removed, type: 'lit' },
    { t: T.title[0], type: 'drop' }, { t: T.title[1], type: 'titleLand' },
    ...[...Array(6)].map((_, k) => ({ t: T.crowd + .5 + k * .25, type: 'land', v: .3 })), ...[...Array(10)].map((_, k) => ({ t: T.title[1] + .25 + k * .1, type: 'dot', k })));

  // subjects for the camera
  Object.assign(ctx.subj, {
    site: () => at('site', 260, 190, .02), siteHi: () => at('site', 260, 150, .02), pip: () => PIP_AT.clone().add(V(0, .035, 0)), fix: () => at('site', 380, 200, .03),
    team: () => at('team', 180, 130, .04), teamTent: () => at('team', 120, 150, .04).lerp(tent.position.clone().setY(.03), .3), teamPhone: () => at('team', 60, 120, .03).lerp(at('phone', 110, 200, .02), .5),
    phone: () => at('phone', 110, 200, .02), env: () => env.root.position.clone().add(V(0, .02, 0)),
    lead: () => devs[1].root.position.clone().add(V(0, .05, 0)),
    price: () => at('price', 170, 30, .04), access: () => at('access', 170, 40, .04), tower: () => twAt(0, .1, 0), towerTop: () => twAt(-.04, .16, .04),
    wide: () => V(-.08, 0, .03), final: () => V(-.05, 0, .05), thumb: () => { const q = (new URLSearchParams(location.search).get('thumb') || '').split(',').map(Number); return V(q[0] || 0, 0, q[1] || 0); }, backleg: () => V(.15, .05, -.3),
  });

  // ── per frame ──
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
  const hide = (M) => M.set({ vis: false });
  return t => {
    // cards
    re('site', drawSite, t < T.alive ? { ok: 0, g: Math.floor(t * 4) % 9 } : { ok: 1 });
    const typed = Math.floor(clamp((t - T.type[0]) / (T.type[1] - T.type[0])) * 22);
    re('phone', drawPhone, { typed: t < T.send ? typed : 0, press: t > T.send - .05 && t < T.send + .2 ? 1 : 0, sent: t >= T.send + .1 ? 1 : 0, reply: t >= T.taps[1] + .3 ? 1 : 0 });
    re('price', drawPrice, { agreed: t >= T.stamp ? 1 : 0 });
    re('access', drawAccess, { cross: t >= T.pwCross ? 1 : 0, removed: t >= T.removed ? 1 : 0 });

    // route: drawn in a wave while the camera is wide, lit again under the title
    routeIdx.forEach((k, j) => {
      const u = j / routeIdx.length, a = T.route[0] + u * (T.route[1] - T.route[0]);
      const s = back(seg(t, a, a + .15), 2);
      m4.compose(rp[k], q.identity(), V(1, 1, 1).multiplyScalar(Math.max(1e-4, s))); routeMesh.setMatrixAt(j, m4);
    });
    routeMesh.instanceMatrix.needsUpdate = true;
    routeMesh.material.emissiveIntensity = .5 * Math.max(0, 1 - Math.abs(t - (T.title[1] + .8)) / 1.0) + .3 * Math.max(0, 1 - Math.abs(t - (T.data[0] + T.data[1]) / 2) / .7);

    // badges and words
    for (const [m, p, t0, hold] of badges) { const s = back(seg(t, t0, t0 + .25), 2.2) * (1 - ss(seg(t, t0 + hold - .3, t0 + hold))); m.visible = t >= t0 && t < t0 + hold; m.scale.setScalar(Math.max(.001, s)); m.position.copy(p); m.face(ctx.camera); }
    { const s = back(seg(t, T.cause, T.cause + .25), 2.2) * (1 - ss(seg(t, 17.8, 18.0))); causePill.visible = t >= T.cause && t < 18.0; causePill.scale.setScalar(Math.max(.001, s)); causePill.position.copy(at('team', 180, 60, .14)); causePill.face(ctx.camera); }
    { // UI rises: the ONLINE status lifts out of the site card's chip
      const p = eo(seg(t, T.online, T.online + .5)), s = back(seg(t, T.online, T.online + .3), 2) * (1 - ss(seg(t, 37.9, 38.2)));
      onlinePill.visible = t >= T.online && t < 38.2; onlinePill.scale.setScalar(Math.max(.001, s)); onlinePill.position.copy(at('site', 444, 40, ST + .01 + .075 * p)); onlinePill.face(ctx.camera); }

    // tower: windows flicker on 8ths, the drawer slides
    drawWin(t >= T.lit ? 1 : 0, Math.floor(t * 4) % 7);
    drawer.position.z = .12 * ss(seg(t, T.drawerOut, T.drawerOut + .3)) * (1 - ss(seg(t, ...T.drawerIn)));

    // the stamp: drops on the price card on the downbeat, lifts away
    { const SP = at('price', 123, 191, TOP); const down = ei(seg(t, T.stamp - .25, T.stamp)), up = eo(seg(t, T.stamp + .3, T.stamp + .75));
      stamp.visible = t > T.stamp - .6 && t < T.stamp + .95; stamp.position.copy(SP).add(V(0, .009 + .45 * (1 - down) + .45 * up, 0)); stamp.rotation.y = CARDS.price.yaw - .06; }

    // Pip: pops up broken, slumps down; lies there until the fix; recoloured cell by cell; pops up healthy on the downbeat
    {
      recolor(t);
      const P0 = pop(t, T.pipPop, .45, .04);
      const slump = ss(seg(t, ...T.slump)), rise = back(seg(t, T.alive, T.alive + .35), 2.4);
      let hinge = Math.min(P0.hinge, 1 - .82 * slump + .82 * Math.min(1, rise));
      const shiver = t > T.slump[1] && t < T.alive ? .015 * Math.sin(t * 40) * Math.max(0, Math.sin(t * 1.3)) : 0;
      const fixShake = T.fixTaps.reduce((a, tp) => { const d = t - tp; return a + (d > 0 && d < .15 ? .03 * Math.sin(Math.PI * d / .15) : 0); }, 0);
      const jump = t >= T.alive && t < T.alive + .5 ? .06 * arc(seg(t, T.alive, T.alive + .5)) : 0;
      const bb = t > T.alive + .6 ? beatBounce(t, T.alive + .6, DUR, .01) : { y: 0, sq: 1 };
      const sqAlive = (() => { const d = t - (T.alive + .5); return d > 0 && d < .2 ? 1 - .3 * Math.sin(Math.PI * d / .2) * (1 - d / .2) : 1; })();
      pip.set({ pos: PIP_AT.clone().add(V(0, P0.y + jump + bb.y, 0)), e: P0.e, hinge: hinge + shiver - fixShake, sq: P0.sq * bb.sq * sqAlive * (t > T.slump[0] && t < T.slump[1] + .2 ? 1 - .2 * Math.sin(Math.PI * seg(t, T.slump[0], T.slump[1] + .2)) : 1), yaw: -.25, vis: t >= T.pipPop - .01 });
      pip.blink(t < T.alive ? (t % 1.7) < .5 : (t % 2.2) < .12);
      ctx.fx.flash = .12 * Math.max(0, 1 - Math.abs(t - T.alive - .05) / .25);
    }

    // the team: stickers on their card pop up; hop the route follow-the-leader; jump to the site; tap Pip; dance when it is back
    devs.forEach((M, i) => {
      const P0 = pop(t, T.devPop[i], .4, .05), h = hops(t, DEVH[i], teamSpot(i));
      let pos = h.pos.clone(); pos.y += P0.y;
      const idleSpans = [[T.devPop[i] + .5, T.hopsP[0][0] + i * .125 - .05], [T.hopsP[1][1] + i * .125 + .1, T.hopsA[0][0] + i * .125 - .05], [T.hopsA[1][1] + i * .125 + .1, T.hopsT[0][0] + i * .125 - .05], [T.hopsT[1][1] + i * .125 + .1, T.jump[0] + i * .125 - .05], [T.alive + .1, DUR]];
      let bb = { y: 0, sq: 1 }; for (const [a, b] of idleSpans) if (t > a && t < b) bb = beatBounce(t, a, b, i === 1 ? .012 : .01, i * .125);
      pos.y += bb.y;
      // working on Pip: each tap, one developer leans in
      let lean = 0; T.fixTaps.forEach((tp, k) => { if (k % 3 !== i) return; const d = t - tp + .08; if (d > 0 && d < .3) lean += .45 * Math.sin(Math.PI * d / .3); });
      const hush = t > T.hush[0] && t < T.alive ? .04 * Math.sin(Math.PI * seg(t, T.hush[0], T.alive)) : 0;   // they lean back and wait
      // envelope arrives: they bounce once, turn to read
      const env1 = t > T.taps[1] && t < T.taps[1] + .4 ? .02 * arc(seg(t, T.taps[1], T.taps[1] + .4)) : 0; pos.y += env1;
      const onSite = t > T.jump[1] + i * .125;
      const yaw = onSite ? clamp(yawTo(pos, PIP_AT) * .6, -.9, .9) * (t < T.alive + .4 ? 1 : .4) : h.dir && h.air !== null ? clamp(Math.atan2(h.dir.x, h.dir.z) * .35, -.6, .6) : (i - 1) * -.12;
      M.set({ pos, vis: true, e: P0.e, hinge: P0.hinge, sq: squash(t, h.lands, h.takeoffs, h.air) * P0.sq * bb.sq, yaw, tiltX: lean - hush });
      M.blink(((t + i * .7) % 2.3) < .12);
    });

    // visitors
    visitors.forEach((M, k) => {
      const L = VISH[k], first = L[0].t0;
      if (t < first - .01 || (k < 2 && t > T.visOut[k][1] && t < T.visBack[k][0] - .01)) { hide(M); return; }
      const h = hops(t, L, L[0].from);
      let pos = h.pos.clone();
      const out = k < 2 && t > T.visOut[k][1] - .05 && t < T.visBack[k][0];
      const bb = t > (k < 2 ? T.crowd + .7 + k * .25 : L[0].t1 + .1) ? beatBounce(t, k < 2 ? T.crowd + .7 + k * .25 : L[0].t1 + .1, DUR, .01, k * .25) : { y: 0, sq: 1 };
      pos.y += bb.y;
      const facing = t > T.bump[k] - .1 && t < T.visOut[k][0] ? -.2 : h.dir && h.air !== null ? clamp(Math.atan2(h.dir.x, h.dir.z) * .4, -.7, .7) : t > T.crowd ? -.5 : .1;
      M.set({ pos, vis: !out, e: 1, hinge: 1, sq: squash(t, h.lands, h.takeoffs, h.air) * bb.sq, yaw: facing });
      M.blink(((t + k * .9) % 2.1) < .12);
    });

    // envelope: pops off the phone, arcs to the team card, taps twice, bursts
    {
      const P0 = pop(t, T.envPop, .3, .03), from = at('phone', 150, 170, PH + .02), to = at('team', 180, 120, .07);
      let pos = from.clone(); const f = seg(t, ...T.envFly);
      if (t >= T.envFly[0]) { pos = from.clone().lerp(to, eio(f)); pos.y += .16 * arc(f); }
      for (const tp of T.taps) { const d = t - tp; if (d > 0 && d < .15) pos.y -= .025 * Math.sin(Math.PI * d / .15); }
      const gone = ss(seg(t, T.taps[1] + .1, T.taps[1] + .35));
      env.set({ pos, vis: t >= T.envPop && gone < 1, e: P0.e, hinge: P0.hinge, sq: P0.sq, scale: 1 - gone, tiltZ: f > 0 && f < 1 ? .3 * Math.sin(f * Math.PI) : 0 });
    }

    // the key: pops out of the access card; lies back down when access is removed
    {
      const P0 = pop(t, T.keyPop, .4, .05), down = ss(seg(t, T.keyDown, T.keyDown + .35));
      const bb = t > T.keyPop + .5 && t < T.keyDown ? beatBounce(t, T.keyPop + .5, T.keyDown, .006) : { y: 0, sq: 1 };
      const fade = ss(seg(t, T.removed - .1, T.removed + .15));
      key.set({ pos: at('access', 268, 150, TOP).add(V(0, P0.y + bb.y, 0)), vis: t >= T.keyPop && fade < 1, e: Math.min(P0.e, 1 - .9 * down), hinge: Math.min(P0.hinge, 1 - down), sq: P0.sq * bb.sq, scale: 1 - fade, yaw: -.15, tiltX: -.75 * (1 - down) });
    }

    // the backup copy: assembles at the tower, hops into the drawer
    {
      const base = twAt(-.02, 0, .2), into = twAt(0, TOWER.slab / 2 + TOWER.step + .018, .12);
      const P0 = pop(t, T.copyPop, .35, .04), h = hops(t, [{ t0: T.copyIn[0], t1: T.copyIn[1], from: base, to: into, h: .07 }], base);
      let pos = h.pos.clone(); pos.y += P0.y;
      if (t >= T.copyIn[1]) pos = twAt(0, TOWER.slab / 2 + TOWER.step + .018, drawer.position.z);
      copy.set({ pos, vis: t >= T.copyPop && !(t >= T.copyIn[1] && drawer.position.z < .05), e: P0.e, hinge: P0.hinge, sq: squash(t, h.lands, h.takeoffs, h.air) * P0.sq, yaw: -.1 });
      copy.blink((t % 1.9) < .12);
    }

    // data cubes run along the back route from the site to the tower; debris flies off Pip on each tap
    { for (let k = 0; k < PK; k++) {
        const a0 = T.data[0] + k * .06; let p = null, s = 0;
        if (t > a0 && t < a0 + .8) { const u = seg(t, a0, a0 + .75); p = br.getPointAt(1 - u).clone(); p.y += .012 + .018 * Math.abs(Math.sin(u * 24)); s = Math.min(seg(t, a0, a0 + .08), 1 - seg(t, a0 + .7, a0 + .8)); }
        m4.compose(p || V(0, -1, 0), q.identity(), V(1, 1, 1).multiplyScalar(Math.max(1e-4, p ? s : 0))); packets.setMatrixAt(k, m4);
      }
      packets.instanceMatrix.needsUpdate = true; }
    { DEB.forEach((d, k) => { const tp = T.fixTaps[d.tap], dt = t - tp; if (dt < 0 || dt > 1.4) { m4.compose(V(0, -1, 0), q, V(1e-4, 1e-4, 1e-4)); debris.setMatrixAt(k, m4); return; }
        const fl = Math.min(dt, .45), p = PIP_AT.clone().add(V(0, .03, 0)).addScaledVector(d.dir, d.sp * fl + .03 * Math.max(0, dt - .45) * d.sp); p.y += d.up * fl - 1.6 * fl * fl; p.y = Math.max(ST + .003, p.y);
        const sc = 1 - ss(seg(dt, 1.0, 1.4)); m4.compose(p, q.setFromEuler(new THREE.Euler(dt * 6 * hash(k), dt * 4, 0)), V(sc, sc, sc).addScalar(1e-4)); debris.setMatrixAt(k, m4); });
      debris.instanceMatrix.needsUpdate = true; }

    // the closing title drops into the middle of the desk
    { const [td, land] = T.title, p = seg(t, td, land), d = t - land;
      bigTitle.visible = t >= td; bigTitle.position.y = (1 - ei(p)) * .6 + (d > 0 && d < .35 ? .012 * Math.sin(Math.PI * d / .35) * (1 - d / .35) : 0);
      const sq = d > 0 && d < .2 ? 1 - .25 * Math.sin(Math.PI * d / .2) : 1; bigTitle.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)); }
    // the price card jolts under the stamp; the site card under the fix
    { let j = 0; const d = t - T.stamp; if (d > 0 && d < .3) j = .003 * Math.sin(d * 60) * (1 - d / .3); cd.price.position.y = j; }
    rings.forEach(({ m, r }) => { const d = t - r.t, on = d > 0 && d < 1.2; m.visible = on; if (on) { const s = (r.big ? .3 : .08) + d * (r.big ? .6 : .2); m.scale.setScalar(s); m.material.opacity = .55 * (1 - d / 1.2); } });
  };
}
