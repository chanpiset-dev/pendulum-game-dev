import { paintShaded } from './shaded-artwork.js';
import { OBJECT_SCALE, JOINT_RADIUS, ROD_WIDTH } from '../game-sizes.js';
// Reusable Canvas 2D concept artwork. These functions never read or mutate physics.
export const ARTWORK_ITEMS = [
  ['pendulum', 'Pendulum', '振り子'], ['multi', 'Multi-link', '多関節'], ['clones', 'Twin clones', 'クローン'],
  ['target', 'Target', 'ターゲット'], ['armored', 'Armored target', '装甲ターゲット'], ['bomb', 'Bomb', '爆弾'],
  ['portal', 'Portal', 'ポータル'], ['boost', 'Boost ring', 'ブーストリング'], ['laser', 'Laser', 'レーザー'],
  ['bumper', 'Bumper', 'バンパー'], ['spring', 'Spring bumper', 'スプリング'], ['absorber', 'Absorber', '吸収体'],
  ['switch', 'Switch', 'スイッチ'], ['gate', 'Switch gate', 'ゲート'], ['rail', 'Horizontal rail', '水平レール'],
  ['lift', 'Vertical lift', '昇降レール'], ['orbit', 'Orbiting anchor', '公転支点'], ['wind', 'Wind / gusts', '風・突風'],
  ['blackhole', 'Black hole', 'ブラックホール'], ['repulsor', 'Repulsor', '反発力場'], ['gravity', 'Gravity modes', '重力モード'],
  ['slime', 'Slime zone', 'スライム'], ['resin', 'Resin zone', 'レジン'], ['moving', 'Moving obstacle', '移動障害物'],
];
export const artworkStyleForTheme = theme => ['neon-arcade', 'pocket-console', '16bit-adventure'].includes(theme) ? 'pixel' : 'shaded';
let pixelCanvas;
function paint(ctx, kind, p, time, pixel, hits = 4) {
  const ink = '#102238', white = '#f3fbff', red = '#ed4057', blue = '#159fe3', cyan = '#27cceb', green = '#23c878', amber = '#efb02e', purple = '#ab64ee';
  ctx.lineCap = pixel ? 'square' : 'round'; ctx.lineJoin = pixel ? 'miter' : 'round';
  const path = (points, color, width = 3, close = false, fill) => {
    ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    if (close) ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  };
  const disk = (x, y, r, fill, stroke = ink, width = 2) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke();
  };
  const panel = (x, y, w, h, fill, stroke = ink) => {
    ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  };
  const arrow = (x, y, dx, dy, color) => {
    path([[x, y], [x + dx, y + dy]], color, 3);
    const angle = Math.atan2(dy, dx), size = 6;
    path([[x + dx - size * Math.cos(angle - 0.6), y + dy - size * Math.sin(angle - 0.6)], [x + dx, y + dy], [x + dx - size * Math.cos(angle + 0.6), y + dy - size * Math.sin(angle + 0.6)]], color, 3);
  };
  const orb = (x, y, r, color) => {
    let fill = color;
    if (!pixel) { fill = ctx.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r); fill.addColorStop(0, white); fill.addColorStop(0.35, color); fill.addColorStop(1, ink); }
    disk(x, y, r, fill); if (pixel) panel(x - r / 2, y - r / 2, r / 3, r / 3, white, white);
  };
  const chain = (points, color = green) => {
    path(points, ink, 7); path(points, p.rod, 3);
    points.forEach(([x, y], i) => i === points.length - 1 ? orb(x, y, 8, color) : disk(x, y, 4, p.rod));
  };
  const ring = (r, color, start = 0, end = Math.PI * 2) => {
    ctx.beginPath(); ctx.arc(0, 0, r, start, end); ctx.strokeStyle = ink; ctx.lineWidth = 10; ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.stroke();
  };
  if (kind === 'pendulum') { chain([[-20, -32], [-6, -3], [24 + Math.sin(time) * 3, 27]]); return; }
  if (kind === 'multi') { chain([[-28, -34], [-28, -12], [-10, 0], [10, 8], [28, 28]]); return; }
  if (kind === 'clones') { chain([[0, -32], [-18, -4], [-29, 26]], green); chain([[0, -32], [19, -2], [29, 27]], purple); return; }
  if (kind === 'target' || kind === 'armored') {
    if (kind === 'armored') { const count = Math.min(8, Math.max(2, hits)); for (let i = 0; i < count; i++) ring(31, blue, i * Math.PI * 2 / count + 0.1, (i + 1) * Math.PI * 2 / count - 0.1); }
    disk(0, 0, kind === 'armored' ? 23 : 30, red); disk(0, 0, 20, white, white, 1); disk(0, 0, 13, red, red, 1); disk(0, 0, 5, white, white, 1); return;
  }
  if (kind === 'bomb') {
    disk(0, 7, 26, '#263244', amber, 3); panel(-5, -25, 12, 10, ink);
    path([[2, -26], [9, -35], [18, -33]], amber, 4);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; path([[18 + Math.cos(a) * 3, -33 + Math.sin(a) * 3], [18 + Math.cos(a) * 8, -33 + Math.sin(a) * 8]], amber, 2); }
    path([[0, -7], [-13, 16], [13, 16]], amber, 2, true, amber); path([[0, -1], [0, 7]], ink, 3); disk(0, 12, 1.2, ink); return;
  }
  if (kind === 'portal') { ring(29, cyan, 0.57 * Math.PI, 1.43 * Math.PI); ring(29, purple, -0.43 * Math.PI, 0.43 * Math.PI); arrow(-15, 0, 10, 0, cyan); arrow(15, 0, -10, 0, purple); return; }
  if (kind === 'boost') { ring(29, green); path([[-10, -12], [2, 0], [-10, 12]], green, 5); path([[3, -12], [15, 0], [3, 12]], green, 5); return; }
  if (kind === 'laser') { path([[-28, 0], [28, 0]], red, 10); path([[-28, 0], [28, 0]], white, 3); panel(-36, -16, 9, 32, p.platform); panel(27, -16, 9, 32, p.platform); return; }
  if (['bumper', 'spring', 'absorber', 'moving'].includes(kind)) {
    const color = kind === 'spring' ? amber : kind === 'absorber' ? '#64748b' : blue;
    if (kind === 'spring') path([[-14, 15], [12, 20], [-12, 26], [12, 31], [-14, 36]], p.rod, 4);
    if (kind === 'moving') { arrow(-34, 0, -7, 0, cyan); arrow(34, 0, 7, 0, cyan); }
    disk(0, kind === 'spring' ? -8 : 0, 26, color); disk(0, kind === 'spring' ? -8 : 0, 20, color, white, 2);
    if (kind === 'absorber') path([[-8, 0], [8, 0]], white, 4);
    else path([[-10, 4], [0, -7], [10, 4]], white, 4);
    return;
  }
  if (kind === 'switch' || kind === 'gate') {
    if (kind === 'gate') { panel(12, -32, 15, 62, p.platform); for (let y = -25; y < 25; y += 14) path([[14, y + 8], [24, y]], amber, 5); panel(-32, 13, 25, 13, p.platform); panel(-29, 8, 19, 9, amber); path([[-6, 18], [6, 18]], amber, 2); disk(20, -38, 4, green); }
    else { panel(-30, 10, 60, 18, p.platform); panel(-23, -1, 42, 16, amber); panel(-8, -23, 16, 28, amber); disk(20, 19, 4, '#64748b'); }
    return;
  }
  if (['rail', 'lift', 'orbit'].includes(kind)) {
    if (kind === 'lift') { panel(-5, -38, 10, 76, p.platform); panel(-12, -12, 24, 24, p.rod); chain([[0, 0], [18, 14], [27, 33]]); arrow(-26, 20, 0, -40, cyan); }
    else if (kind === 'rail') { panel(-38, -19, 76, 10, p.platform); panel(-12, -25, 24, 24, p.rod); chain([[0, -12], [5, 7], [16, 32]]); arrow(-23, -33, 45, 0, cyan); }
    else { ctx.beginPath(); ctx.ellipse(0, -7, 34, 19, 0, 0, Math.PI * 2); ctx.setLineDash([4, 4]); ctx.strokeStyle = p.rod; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); panel(10, -32, 17, 15, amber); chain([[18, -25], [12, 2], [4, 30]]); arrow(-32, 12, 18, 9, cyan); }
    return;
  }
  if (kind === 'wind') { for (let row = 0; row < 3; row++) { const y = -22 + row * 22; path([[-36, y], [-18, y + 4], [-2, y - 3], [14, y]], cyan, 3); arrow(14, y, 18 - row * 3, 0, cyan); } return; }
  if (kind === 'blackhole' || kind === 'repulsor') {
    const push = kind === 'repulsor', color = push ? cyan : purple;
    disk(0, 0, 24, push ? '#0d5976' : '#080716', color, 3);
    if (push) orb(0, 0, 14, cyan);
    else for (let arm = 0; arm < 3; arm++) { const points = []; for (let j = 0; j < 24; j++) { const a = arm * 2.094 + j / 10 + time * 0.2, r = 8 + j * 0.9; points.push([Math.cos(a) * r, Math.sin(a) * r]); } path(points, color, 2); }
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2, start = push ? 29 : 40, step = push ? 10 : -10; arrow(Math.cos(a) * start, Math.sin(a) * start, Math.cos(a) * step, Math.sin(a) * step, color); }
    return;
  }
  if (kind === 'gravity') { for (let i = 0; i < 3; i++) { const x = -26 + i * 26; orb(x, 9, 7, i === 2 ? green : p.rod); arrow(x, i === 2 ? -7 : -30, 0, i === 2 ? -23 : 23, i === 2 ? green : cyan); } return; }
  if (kind === 'slime' || kind === 'resin') {
    const color = kind === 'slime' ? cyan : amber;
    ctx.fillStyle = color + '30'; ctx.fillRect(-35, -28, 70, 56);
    for (const y of [-28, 28]) { const points = []; for (let x = -35; x <= 35; x += 5) points.push([x, y + Math.sin(x * 0.25) * 3]); path(points, color, 3); }
    for (let i = 0; i < 4; i++) { const x = -25 + i * 17, y = Math.sin(i * 4) * 16; if (kind === 'resin') path([[x, -27], [x, y]], color, 2); disk(x, y, 3 + i % 2, color, color, 1); }
    return;
  }
  if (kind === 'reflector') { for (const [x,y] of [[-24,22],[-4,2],[16,-18]]) disk(x,y,10,blue); arrow(-32,-25,21,23,cyan); arrow(-7,-5,30,-2,amber); }
}
export function drawArtwork(ctx, kind, x, y, radius, { style = 'vector', palette, time = 0, hits = 4 }) {
  ctx.save();
  if (style === 'shaded') { ctx.translate(x,y); ctx.scale(radius/48,radius/48); paintShaded(ctx,kind,palette,time,hits); ctx.restore(); return; }
  if (kind === 'portal-in' || kind === 'portal-out') kind = 'portal';
  if (style === 'pixel') {
    pixelCanvas ||= document.createElement('canvas'); pixelCanvas.width = 64; pixelCanvas.height = 64;
    const small = pixelCanvas.getContext('2d'); small.save(); small.translate(32, 32); small.scale(0.65, 0.65); paint(small, kind, palette, time, true, hits); small.restore();
    ctx.imageSmoothingEnabled = false; ctx.drawImage(pixelCanvas, x - radius, y - radius, radius * 2, radius * 2);
  } else { ctx.translate(x, y); ctx.scale(radius / 48, radius / 48); paint(ctx, kind, palette, time, false, hits); }
  ctx.restore();
}

// Draw real articulated geometry; lengths, angles and hit radii are supplied by physics.
export function drawLivePendulum(ctx, chain, pivot, scale, minRadius, { style, palette, color = '#23c878' }) {
  ctx.save(); ctx.lineCap = style === 'pixel' ? 'square' : 'round';
  let x = pivot.x, y = pivot.y;
  ctx.beginPath(); ctx.arc(x, y, 7 * OBJECT_SCALE, 0, Math.PI * 2); ctx.fillStyle = palette.rod; ctx.fill(); ctx.strokeStyle = '#102238'; ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i < chain.N; i++) {
    const nx = x + scale * chain.L[i] * Math.sin(chain.state[i]), ny = y + scale * chain.L[i] * Math.cos(chain.state[i]);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.strokeStyle = '#102238'; ctx.lineWidth = ROD_WIDTH * 2; ctx.stroke();
    if (style === 'shaded') { const length=Math.hypot(nx-x,ny-y)||1, ox=-(ny-y)/length*ROD_WIDTH/2, oy=(nx-x)/length*ROD_WIDTH/2; const g=ctx.createLinearGradient(x-ox,y-oy,x+ox,y+oy); g.addColorStop(0,'#556f85'); g.addColorStop(.35,'#eef8ff'); g.addColorStop(.7,'#a9bfcd'); g.addColorStop(1,'#3a5167'); ctx.strokeStyle=g; } else ctx.strokeStyle = palette.rod; ctx.lineWidth = ROD_WIDTH; ctx.stroke();
    const tip = i === chain.N - 1, radius = tip ? (chain.currentR || minRadius) * (chain.popScale || 1) : JOINT_RADIUS;
    let fill = tip ? color : palette.rod;
    if (!tip && style === 'shaded') {fill=ctx.createLinearGradient(nx-radius,ny-radius,nx+radius,ny+radius);fill.addColorStop(0,'#e7f4fc');fill.addColorStop(.5,'#97afc1');fill.addColorStop(1,'#3a536b');}
    if (tip && style !== 'pixel') {
      fill = ctx.createRadialGradient(nx - radius / 3, ny - radius / 3, 1, nx, ny, radius);
      fill.addColorStop(0, '#f3fbff'); fill.addColorStop(0.35, color); fill.addColorStop(1, '#102238');
    }
    ctx.beginPath(); ctx.arc(nx, ny, Math.max(1, radius - 1), 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = '#102238'; ctx.lineWidth = 2; ctx.stroke();
    if (tip && style === 'pixel') { ctx.fillStyle = '#f3fbff'; ctx.fillRect(nx - radius / 2, ny - radius / 2, Math.max(2, radius / 3), Math.max(2, radius / 3)); }
    x = nx; y = ny;
  }
  ctx.restore();
}
