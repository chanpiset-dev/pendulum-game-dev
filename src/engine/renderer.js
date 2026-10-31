import { OBJECT_SCALE, RAIL_HIT_RADIUS, SEGMENT_HIT_RADIUS } from '../game-sizes.js';
import { windFlowOffset } from './wind-flow.js';
import { getCanvasPalette, drawThemeBackdrop } from '../themes.js';
import { artworkStyleForTheme, drawArtwork, drawLivePendulum } from './artwork.js';
import { I18N } from '../i18n.js';

let pixelLayer;
let windMotionPreference;
// Render the new artwork at the real simulation coordinates. Never change state.
export function drawGenericScene(ctx, chainOrSystems, targets, obstacles, blackhole, particles, shockwaves, floaters, pivot, rail, portals = [], switches = [], boostRings = [], zones = [], lasers = [], renderOptions = {}) {
  const { currentLang = 'en', BASE_PIVOT = pivot, PENDULUM_SCALE = 120, BOB_MIN_R = 14, laserCooldown = 0, timeElapsed = 0 } = renderOptions;
  const palette = getCanvasPalette(), style = artworkStyleForTheme(palette.theme);
  const output = ctx;
  if (style === 'pixel') {
    pixelLayer ||= document.createElement('canvas');
    const w = Math.ceil(output.canvas.width / 2), h = Math.ceil(output.canvas.height / 2);
    if (pixelLayer.width !== w || pixelLayer.height !== h) { pixelLayer.width = w; pixelLayer.height = h; }
    ctx = pixelLayer.getContext('2d'); ctx.clearRect(0, 0, w, h); ctx.save(); ctx.scale(0.5, 0.5);
  } else ctx.save();
  const sprite = (kind, x, y, size, time = 0, hits = 4) => drawArtwork(ctx, kind, x, y, size, { style, palette, time, hits });
  const line = (x1, y1, x2, y2, color, width = 2) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  };
  const segment = (beam, open = false, laser = false) => {
    const color = laser ? '#ed4057' : '#efb02e';
    ctx.save();
    if (open) { ctx.setLineDash([5, 6]); line(beam.x1, beam.y1, beam.x2, beam.y2, palette.muted, 2); }
    else {
      line(beam.x1, beam.y1, beam.x2, beam.y2, '#102238', laser ? 7 : 8);
      line(beam.x1, beam.y1, beam.x2, beam.y2, color, SEGMENT_HIT_RADIUS * 2);
      if (laser) line(beam.x1, beam.y1, beam.x2, beam.y2, '#fff5f5', 2);
    }
    ctx.setLineDash([]);
    for (const [x, y] of [[beam.x1, beam.y1], [beam.x2, beam.y2]]) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(beam.y2 - beam.y1, beam.x2 - beam.x1));
      ctx.fillStyle = palette.platform; ctx.fillRect(-4 * OBJECT_SCALE, -9 * OBJECT_SCALE, 8 * OBJECT_SCALE, 18 * OBJECT_SCALE); ctx.strokeStyle = palette.rod; ctx.lineWidth = 1; ctx.strokeRect(-4 * OBJECT_SCALE, -9 * OBJECT_SCALE, 8 * OBJECT_SCALE, 18 * OBJECT_SCALE); ctx.restore();
    }
    ctx.restore();
  };
  for (const z of zones) {
    ctx.save(); ctx.beginPath(); ctx.rect(z.x, z.y, z.w, z.h); ctx.clip();
    ctx.translate(z.x + z.w / 2, z.y + z.h / 2); ctx.scale(z.w / 70, z.h / 56);
    sprite(z.isResin ? 'resin' : 'slime', 0, 0, 48);
    ctx.restore(); ctx.strokeStyle = z.isResin ? '#c38b16' : '#159bb6'; ctx.lineWidth = 1.5; ctx.strokeRect(z.x, z.y, z.w, z.h);
  }
  if (rail) {
    const rx = rail.ampX || rail.amp || 0, ry = rail.ampY || 0;
    ctx.strokeStyle = palette.rod; ctx.lineWidth = RAIL_HIT_RADIUS * 2;
    // Both axes move independently; these tracks match the rail collision geometry.
    // An ellipse is incorrect when axis speeds or phases differ.
    if (rx > 0) line(BASE_PIVOT.x - rx - 30, pivot.y, BASE_PIVOT.x + rx + 30, pivot.y, palette.rod, RAIL_HIT_RADIUS * 2);
    if (ry > 0) line(pivot.x, BASE_PIVOT.y - ry - 30, pivot.x, BASE_PIVOT.y + ry + 30, palette.rod, RAIL_HIT_RADIUS * 2);
    ctx.fillStyle = palette.platform; ctx.fillRect(pivot.x - 22.5, pivot.y - 18, 45, 36); ctx.strokeStyle = palette.rod; ctx.lineWidth = 2; ctx.strokeRect(pivot.x - 22.5, pivot.y - 18, 45, 36);
  }
  for (const port of portals) {
    sprite('portal', port.x, port.y, (port.r || 24) * 1.55 * 0.85 * 48 / 34);
    ctx.fillStyle = palette.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(port.label || (port.targetId ? 'IN' : 'OUT'), port.x, port.y + (port.r || 24) * 1.7 + 14);
  }
  for (const ring of boostRings) { ctx.save(); ctx.translate(ring.x, ring.y); ctx.rotate(ring.angle || 0); sprite('boost', 0, 0, ring.r * 48 / 34); ctx.restore(); }
  for (const laser of lasers) if (!laser.disabled) segment(laser, false, true);
  for (const sw of switches) {
    ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2); ctx.strokeStyle = palette.line; ctx.lineWidth = 1; ctx.stroke();
    sprite('switch', sw.x, sw.y, sw.r * 1.12);
    ctx.beginPath(); ctx.arc(sw.x + sw.r * 0.65, sw.y + sw.r * 0.4, 3, 0, Math.PI * 2); ctx.fillStyle = sw.active ? '#23c878' : '#6b7280'; ctx.fill();
    if (sw.gate) segment(sw.gate, sw.active);
  }
  for (const ob of obstacles) {
    if (ob.ampX > 0) { ctx.save(); ctx.setLineDash([4, 5]); line(ob.baseX - ob.ampX, ob.baseY, ob.baseX + ob.ampX, ob.baseY, palette.muted); ctx.restore(); }
    const spring = ob.restitution < -1, kind = spring ? 'spring' : Math.abs(ob.restitution) < 0.2 ? 'absorber' : ob.ampX > 0 ? 'moving' : 'bumper';
    // Decorative spring sits behind the circular pad; pad remains at its hit center.
    const size = ob.r * 48 / 27; sprite(kind, ob.x, ob.y + (spring ? 8 * size / 48 : 0), size);
    if (ob.pulse > 0) { ctx.beginPath(); ctx.arc(ob.x, ob.y, ob.r, 0, Math.PI * 2); ctx.strokeStyle = palette.text; ctx.lineWidth = 2; ctx.stroke(); }
  }
  for (const b of (blackhole ? Array.isArray(blackhole) ? blackhole : [blackhole] : [])) {
    const color = b.isRepulsor ? '#27cceb' : '#ab64ee';
    const aura = ctx.createRadialGradient(b.x, b.y, b.coreRadius, b.x, b.y, Math.max(b.coreRadius + 1, b.pullRadius));
    aura.addColorStop(0, color + '40'); aura.addColorStop(1, color + '00');
    ctx.beginPath(); ctx.arc(b.x, b.y, b.pullRadius, 0, Math.PI * 2); ctx.fillStyle = aura; ctx.fill();
    sprite(b.isRepulsor ? 'repulsor' : 'blackhole', b.x, b.y, b.coreRadius * 48 / 25.5, timeElapsed);
  }
  for (const target of targets) {
    if (!target.alive) continue;
    const kind = target.isBomb ? 'bomb' : target.hp > 1 ? 'armored' : 'target';
    const size = target.r * (kind === 'armored' ? 48 / 36 : kind === 'bomb' ? 48 / 27.5 : 48 / 31);
    sprite(kind, target.x, target.y - (kind === 'bomb' ? 7 * size / 48 : 0), size, 0, target.hp);
    if (kind === 'armored') { ctx.fillStyle = palette.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(String(target.hp), target.x, target.y - target.r - 5); }
  }
  const systems = Array.isArray(chainOrSystems) ? chainOrSystems : [chainOrSystems];
  systems.forEach((chain, index) => {
    if (chain.alive === false) return;
    if (chain.trail?.length > 1) {
      ctx.save(); ctx.globalAlpha = 0.25; ctx.strokeStyle = index ? chain.color.outer : palette.bob; ctx.lineWidth = 2;
      ctx.beginPath(); chain.trail.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)); ctx.stroke(); ctx.restore();
    }
    ctx.save(); if (laserCooldown > 0 && Math.floor(timeElapsed * 16) % 2 === 0) ctx.globalAlpha = 0.35;
    drawLivePendulum(ctx, chain, pivot, PENDULUM_SCALE, BOB_MIN_R, { style, palette, color: index ? chain.color.outer : '#23c878' }); ctx.restore();
  });
  // FX Layers
  shockwaves.forEach(sw => {
    ctx.save(); ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
    ctx.strokeStyle = sw.color || '#34d399'; ctx.lineWidth = 3.5 * sw.life; ctx.globalAlpha = Math.max(0, sw.life);
    ctx.shadowColor = sw.color || '#34d399'; ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
  });
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;

    if (p.isShard) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot || 0);
      ctx.beginPath();
      const sz = p.size || 4.5;
      if (p.shape === 'tri') {
        ctx.moveTo(0, -sz * 1.3);
        ctx.lineTo(sz * 0.9, sz * 0.8);
        ctx.lineTo(-sz * 0.9, sz * 0.8);
      } else {
        ctx.moveTo(0, -sz * 1.2);
        ctx.lineTo(sz * 0.7, 0);
        ctx.lineTo(0, sz * 1.2);
        ctx.lineTo(-sz * 0.7, 0);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  floaters.forEach(f => {
    ctx.save(); ctx.globalAlpha = Math.max(0, f.life); ctx.fillStyle = palette.yellow;
    ctx.font = 'bold 20px system-ui, sans-serif'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 5;
    ctx.fillText(f.text, f.x - 20, f.y - 15); ctx.restore();
  });
  ctx.restore();
  if (style === 'pixel') { output.save(); output.imageSmoothingEnabled = false; output.drawImage(pixelLayer, 0, 0, pixelLayer.width * 2, pixelLayer.height * 2); output.restore(); }
}

// Main game frame: trails, HUD, overlays, and the full scene.
export function drawGameFrame({ ctx, getState, computePredictionTrail, setClearFlashTimer }) {
  const { W, H, screenShake, clearFlashTimer, activeGhost, gameStatus, currentLang, currentWind, timeElapsed, currentLasers, maxLives, currentLives, currentGravity, systems, targets, obstacles, blackhole, particles, shockwaves, floaters, PIVOT, currentRail, currentPortals, currentSwitches, currentBoostRings, currentZones, BASE_PIVOT, laserCooldown, PENDULUM_SCALE, BOB_MIN_R, BOB_MAX_R } = getState();
  const palette = getCanvasPalette();
  ctx.clearRect(0, 0, W, H);
  drawThemeBackdrop(ctx, W, H);
  ctx.save();
  if (screenShake > 0.4) { ctx.translate((Math.random() - 0.5) * screenShake * 1.5, (Math.random() - 0.5) * screenShake * 1.5); }

  if (clearFlashTimer > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(86, 211, 100, ${Math.min(0.45, clearFlashTimer * 1.6)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    setClearFlashTimer(Math.max(0, clearFlashTimer - 0.016));
  }

  if (activeGhost && activeGhost.length > 1) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(activeGhost[0].x, activeGhost[0].y);
    for (let i = 1; i < activeGhost.length; i++) ctx.lineTo(activeGhost[i].x, activeGhost[i].y);
    ctx.strokeStyle = palette.muted + '60'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]); ctx.stroke(); ctx.restore();
  }

  if (gameStatus === 'setup') {
    const predPts = computePredictionTrail();
    if (predPts.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(predPts[0].x, predPts[0].y);
      for (let i = 1; i < predPts.length; i++) {
        ctx.lineTo(predPts[i].x, predPts[i].y);
      }
      ctx.strokeStyle = palette.accent + '99';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([4, 6]);
      ctx.shadowColor = palette.accent;
      ctx.shadowBlur = 8;
      ctx.stroke();

      const lastPt = predPts[predPts.length - 1];
      ctx.beginPath();
      ctx.arc(lastPt.x, lastPt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = palette.accent;
      ctx.fill();
      ctx.restore();
    }
  }

  const t = I18N[currentLang];

  const wFx = currentWind ? (currentWind.currentFx ?? currentWind.fx ?? 0) : 0;
  if (currentWind && Math.abs(wFx) > 0.05) {
    windMotionPreference ||= matchMedia('(prefers-reduced-motion: reduce)');
    const spacing = 240;
    const travel = windMotionPreference.matches ? 0 : windFlowOffset(currentWind, timeElapsed);
    ctx.save();
    ctx.globalAlpha = 0.45;
    let rowIndex = 0;
    for (let row = 110; row < H; row += 150, rowIndex++) {
      const shift = ((travel + rowIndex * 60) % spacing + spacing) % spacing;
      for (let column = -160; column < W + spacing; column += spacing) {
        ctx.save(); ctx.translate(column + shift, row); if (wFx < 0) ctx.scale(-1, 1);
        drawArtwork(ctx, 'wind', 0, 0, (30 + Math.min(10, Math.abs(wFx) * 2)) * OBJECT_SCALE, { style: artworkStyleForTheme(palette.theme), palette }); ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = wFx > 0 ? palette.blue : palette.danger;
    const dirSym = wFx > 0 ? '→' : '←';
    const spdVal = (Math.abs(wFx) * 3).toFixed(1);
    ctx.fillText(t.wind(dirSym, spdVal), W / 2, 30);
    ctx.restore();
  }

  if (currentLasers.length > 0 && maxLives > 1 && gameStatus === 'playing') {
    ctx.save();
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = currentLives > 1 ? palette.blue : palette.danger;
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 6;
    const hudY = currentWind ? (Math.abs(currentGravity - 9.8) > 0.5 ? 64 : 48) : 48;
    ctx.fillText(`${t.lives}${'♥ '.repeat(Math.max(0, currentLives))}${'♡ '.repeat(Math.max(0, maxLives - currentLives))}`, W / 2, hudY);
    ctx.restore();
  }

  if (Math.abs(currentGravity - 9.8) > 0.5) {
    ctx.save();
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    let gLabel = t.tagLowG;
    if (currentGravity < 0) gLabel = t.tagInvG;
    else if (currentGravity > 12) gLabel = t.tagHighG;
    ctx.fillStyle = currentGravity < 0 ? palette.danger : palette.text;
    ctx.fillText(t.gravHud(currentGravity.toFixed(1), gLabel), W / 2, currentWind ? 48 : 30);
    ctx.restore();
  }

  drawGenericScene(ctx, systems, targets, obstacles, blackhole, particles, shockwaves, floaters, PIVOT, currentRail, currentPortals, currentSwitches, currentBoostRings, currentZones, currentLasers, { currentLang, BASE_PIVOT, PIVOT, timeElapsed, laserCooldown, PENDULUM_SCALE, BOB_MIN_R, BOB_MAX_R });
  ctx.restore();

}
