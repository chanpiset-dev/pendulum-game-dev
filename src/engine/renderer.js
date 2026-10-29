import { I18N } from '../i18n.js';

// Canvas scene renderer. Visual drawing logic is preserved from the original game.
export function drawGenericScene(ctx, chainOrSystems, targets, obstacles, blackhole, particles, shockwaves, floaters, pivot, rail, portals = [], switches = [], boostRings = [], zones = [], lasers = [], renderOptions = {}) {
  const { currentLang = 'en', BASE_PIVOT = { x: 0, y: 0 }, PIVOT = pivot, timeElapsed = 0, laserCooldown = 0, PENDULUM_SCALE = 120, BOB_MIN_R = 14, BOB_MAX_R = 36 } = renderOptions;
  // 1. Viscous Zones
  zones.forEach(z => {
    ctx.save();
    ctx.fillStyle = z.isResin ? 'rgba(245, 158, 11, 0.22)' : 'rgba(56, 189, 248, 0.16)';
    ctx.strokeStyle = z.isResin ? 'rgba(245, 158, 11, 0.6)' : 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(z.x, z.y, z.w, z.h);
    ctx.fillRect(z.x, z.y, z.w, z.h);
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = z.isResin ? '#fbbf24' : '#38bdf8';
    ctx.fillText(z.isResin ? (currentLang === 'ja' ? '高粘性レジン' : 'STICKY RESIN') : (currentLang === 'ja' ? '粘性スライム' : 'VISCOUS DRAG'), z.x + 8, z.y + 16);
    ctx.restore();
  });

  // 2. Sliding Rail
  if (rail) {
    ctx.save();
    const hasX = (rail.ampX || rail.amp || 0) > 0;
    const hasY = (rail.ampY || 0) > 0;
    const isPulsing = (rail.pulse || 0) > 0;

    if (hasX) {
      const rx = rail.ampX || rail.amp;
      const minX = BASE_PIVOT.x - rx - 30;
      const maxX = BASE_PIVOT.x + rx + 30;
      const rY = PIVOT.y;
      ctx.beginPath();
      ctx.rect(minX, rY - 8, maxX - minX, 16);
      ctx.fillStyle = isPulsing ? '#38bdf8' : '#0f172a';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isPulsing ? 22 : 8;
      ctx.fill();
      ctx.strokeStyle = isPulsing ? '#ffffff' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    if (hasY) {
      const ry = rail.ampY;
      const minY = BASE_PIVOT.y - ry - 30;
      const maxY = BASE_PIVOT.y + ry + 30;
      const rX = PIVOT.x;
      ctx.beginPath();
      ctx.rect(rX - 8, minY, 16, maxY - minY);
      ctx.fillStyle = isPulsing ? '#38bdf8' : '#0f172a';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isPulsing ? 22 : 8;
      ctx.fill();
      ctx.strokeStyle = isPulsing ? '#ffffff' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(pivot.x - 18, pivot.y - 12, 36, 24);
    ctx.strokeRect(pivot.x - 18, pivot.y - 12, 36, 24);
    ctx.restore();
  }

  // 3. Portals
  const drawnConduits = new Set();
  portals.forEach(port => {
    const dest = portals.find(p => p.id === port.targetId);
    if (dest) {
      const pairKey = `${Math.min(port.id, dest.id)}-${Math.max(port.id, dest.id)}`;
      if (!drawnConduits.has(pairKey)) {
        drawnConduits.add(pairKey);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(port.x, port.y);
        ctx.quadraticCurveTo(BASE_PIVOT.x, BASE_PIVOT.y + 60, dest.x, dest.y);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 12]);
        ctx.lineDashOffset = -(timeElapsed * 35) % 20;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }
    }
  });

  portals.forEach(port => {
    ctx.save();
    const baseR = (port.r || 24) * 1.55;
    const pColor = port.color || '#38bdf8';

    const pulseScale = 1.0 + Math.sin(timeElapsed * 4.5 + port.id) * 0.08;
    const effR = baseR * pulseScale;
    const gradField = ctx.createRadialGradient(port.x, port.y, effR * 0.25, port.x, port.y, effR * 2.2);
    gradField.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradField.addColorStop(0.3, pColor);
    gradField.addColorStop(0.65, 'rgba(168, 85, 247, 0.25)');
    gradField.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradField;
    ctx.beginPath();
    ctx.arc(port.x, port.y, effR * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(port.x, port.y);
    const spinRate = (port.id % 2 === 1 ? 1 : -1) * (timeElapsed * 4.0);
    ctx.rotate(spinRate);
    const numArms = 5;
    for (let arm = 0; arm < numArms; arm++) {
      ctx.rotate((Math.PI * 2) / numArms);
      ctx.beginPath();
      ctx.arc(0, 0, effR * 1.15, 0, Math.PI * 0.65);
      ctx.strokeStyle = (arm % 2 === 0) ? '#ffffff' : pColor;
      ctx.lineWidth = 4;
      ctx.shadowColor = pColor;
      ctx.shadowBlur = 18;
      ctx.stroke();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(port.x, port.y, effR * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(port.x, port.y, effR * 0.88, 0, Math.PI * 2);
    ctx.strokeStyle = pColor;
    ctx.lineWidth = 2.0;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(port.x, port.y, effR * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = '#020308';
    ctx.shadowBlur = 0;
    ctx.fill();

    ctx.font = '900 13px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.95)';
    ctx.shadowBlur = 8;
    ctx.fillText(port.label || 'WARP', port.x, port.y + effR + 18);
    ctx.restore();
  });

  // 4. Boost Rings
  boostRings.forEach(ring => {
    ctx.save();
    ctx.translate(ring.x, ring.y);
    ctx.rotate(ring.angle || 0);
    ctx.beginPath();
    ctx.ellipse(0, 0, ring.r, ring.r * 0.55, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
    ctx.lineTo(4, -5); ctx.moveTo(10, 0); ctx.lineTo(4, 5);
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });

  // 5. Lasers
  lasers.forEach(lz => {
    if (lz.disabled) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lz.x1, lz.y1);
    ctx.lineTo(lz.x2, lz.y2);
    ctx.strokeStyle = lz.color || '#f43f5e';
    ctx.lineWidth = 3;
    ctx.shadowColor = lz.color || '#f43f5e';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();
  });

  // 6. Switches & Gates
  switches.forEach(sw => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
    ctx.fillStyle = sw.active ? '#10b981' : '#1e293b';
    ctx.shadowColor = sw.active ? '#34d399' : '#64748b';
    ctx.shadowBlur = sw.active ? 20 : 6;
    ctx.fill();
    ctx.strokeStyle = sw.active ? '#6ee7b7' : '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (sw.gate) {
      if (!sw.active) {
        ctx.beginPath();
        ctx.moveTo(sw.gate.x1, sw.gate.y1);
        ctx.lineTo(sw.gate.x2, sw.gate.y2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(sw.gate.x1, sw.gate.y1);
        ctx.lineTo(sw.gate.x2, sw.gate.y2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    ctx.restore();
  });

  // 7. Hazard Obstacles
  obstacles.forEach(ob => {
    ctx.save();
    if (ob.ampX > 0) {
      ctx.beginPath(); ctx.moveTo(ob.baseX - ob.ampX, ob.baseY); ctx.lineTo(ob.baseX + ob.ampX, ob.baseY);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)'; ctx.lineWidth = 2.5; ctx.setLineDash([4, 4]); ctx.stroke();
    }
    const isSpring = ob.restitution && ob.restitution < -1.0;
    const isAbsorber = ob.restitution && Math.abs(ob.restitution) < 0.2;

    ctx.beginPath(); ctx.arc(ob.x, ob.y, ob.r, 0, Math.PI * 2);
    ctx.fillStyle = ob.pulse > 0 ? (isSpring ? '#fbbf24' : '#38bdf8') : (isAbsorber ? '#334155' : '#0f172a');
    ctx.shadowColor = isSpring ? '#fbbf24' : (isAbsorber ? '#475569' : '#38bdf8');
    ctx.shadowBlur = ob.pulse > 0 ? 24 : 8; ctx.fill();
    ctx.strokeStyle = ob.pulse > 0 ? '#fff' : (isSpring ? '#f59e0b' : (isAbsorber ? '#64748b' : '#38bdf8'));
    ctx.lineWidth = 3 + ob.pulse * 3; ctx.stroke();

    if (isSpring) {
      ctx.font = 'bold 9px system-ui, sans-serif';
      ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'center';
      ctx.fillText(currentLang === 'ja' ? '跳弾' : 'BOUNCE', ob.x, ob.y + 3);
    }
    ctx.restore();
  });

  // 8. Singularities & Repulsors
  if (blackhole) {
    const bhList = Array.isArray(blackhole) ? blackhole : [blackhole];
    bhList.forEach(b => {
      ctx.save();
      const bx = b.x, by = b.y;
      const gradAura = ctx.createRadialGradient(bx, by, b.coreRadius * 0.7, bx, by, b.pullRadius);
      if (b.isRepulsor) {
        gradAura.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        gradAura.addColorStop(0.4, 'rgba(14, 165, 233, 0.15)');
        gradAura.addColorStop(1, 'rgba(56, 189, 248, 0)');
      } else {
        gradAura.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
        gradAura.addColorStop(0.4, 'rgba(126, 34, 206, 0.15)');
        gradAura.addColorStop(1, 'rgba(147, 51, 234, 0)');
      }
      ctx.fillStyle = gradAura;
      ctx.beginPath();
      ctx.arc(bx, by, b.pullRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(b.angle || 0);
      for (let arm = 0; arm < 3; arm++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.arc(0, 0, b.coreRadius + 14, 0, Math.PI * 0.75);
        ctx.strokeStyle = b.isRepulsor ? '#38bdf8' : (arm === 0 ? '#f43f5e' : (arm === 1 ? '#a855f7' : '#38bdf8'));
        ctx.lineWidth = 3.5;
        ctx.shadowColor = b.isRepulsor ? '#38bdf8' : '#c084fc';
        ctx.shadowBlur = 12;
        ctx.stroke();
      }
      ctx.restore();

      ctx.beginPath();
      ctx.arc(bx, by, b.coreRadius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = b.isRepulsor ? '#38bdf8' : '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(bx, by, b.coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = b.isRepulsor ? '#082f49' : '#000000';
      ctx.fill();
      ctx.restore();
    });
  }

  // 9. Targets
  targets.forEach(t => {
    if (!t.alive) return;
    ctx.save();
    ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    if (t.isBomb) {
      ctx.fillStyle = '#451a03'; ctx.fill();
      ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 3.5;
      ctx.shadowColor = '#fb923c'; ctx.shadowBlur = 18; ctx.stroke();
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 0.45, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
    } else {
      ctx.fillStyle = '#1f2937'; ctx.fill();
      ctx.strokeStyle = (t.hp && t.hp > 1) ? '#38bdf8' : '#f87171'; ctx.lineWidth = 2.5;
      ctx.shadowColor = (t.hp && t.hp > 1) ? '#38bdf8' : '#f87171'; ctx.shadowBlur = 15; ctx.stroke();
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = (t.hp && t.hp > 1) ? '#0284c7' : '#f87171'; ctx.fill();

      if (t.hp && t.hp > 1) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r + 5, 0, Math.PI * (2 * (t.hp / t.maxHp)));
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  });

  // 10. Pivot
  ctx.beginPath(); ctx.arc(pivot.x, pivot.y, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#111827'; ctx.fill();
  ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 4; ctx.stroke();

  // 11. Pendulum Arms & Bobs
  let arr = Array.isArray(chainOrSystems) ? chainOrSystems : [chainOrSystems];
  arr.forEach(ch => {
    if (ch.alive === false) return;
    if (ch.trail.length > 1) {
      for (let i = 1; i < ch.trail.length; i++) {
        ctx.beginPath(); ctx.moveTo(ch.trail[i-1].x, ch.trail[i-1].y); ctx.lineTo(ch.trail[i].x, ch.trail[i].y);
        const spd = ch.trail[i].speed || 0;
        const hue = Math.max(0, 200 - spd * 11);
        const lum = Math.min(85, 45 + spd * 2.2);
        ctx.strokeStyle = `hsl(${hue}, 100%, ${lum}%)`;
        ctx.globalAlpha = (i / ch.trail.length) * 0.7; ctx.lineWidth = 4; ctx.stroke();
      }
    }

    const isInvulnerable = (laserCooldown > 0 && Math.floor(Date.now() / 60) % 2 === 0);
    ctx.globalAlpha = isInvulnerable ? 0.35 : 1.0;
    
    let px = pivot.x, py = pivot.y;
    for (let i = 0; i < ch.N; i++) {
      const nx = px + PENDULUM_SCALE * ch.L[i] * Math.sin(ch.state[i]);
      const ny = py + PENDULUM_SCALE * ch.L[i] * Math.cos(ch.state[i]);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 9; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4.5; ctx.stroke();

      const isTip = (i === ch.N - 1);
      const baseR = isTip ? (ch.currentR || BOB_MIN_R) : 12;
      const r = isTip ? baseR * (ch.popScale || 1.0) : baseR;

      const radGrad = ctx.createRadialGradient(nx - r * 0.3, ny - r * 0.3, r * 0.1, nx, ny, r * 1.2);
      radGrad.addColorStop(0, ch.color.outer);
      radGrad.addColorStop(0.6, ch.color.inner);
      radGrad.addColorStop(1, '#000000');

      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;

      if (isTip) {
        const growthRatio = Math.max(0, Math.min(1, ((ch.currentR || BOB_MIN_R) - BOB_MIN_R) / (BOB_MAX_R - BOB_MIN_R)));
        ctx.shadowColor = ch.color.outer;
        ctx.shadowBlur = 14 + growthRatio * 16 + ((ch.popScale || 1.0) - 1.0) * 22;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(nx, ny, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      px = nx; py = ny;
    }
  });

  ctx.beginPath(); ctx.arc(pivot.x, pivot.y, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#f8fafc'; ctx.fill();

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
    ctx.save(); ctx.globalAlpha = Math.max(0, f.life); ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px system-ui, sans-serif'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 5;
    ctx.fillText(f.text, f.x - 20, f.y - 15); ctx.restore();
  });
}


// Main game frame: trails, HUD, overlays, and the full scene.
export function drawGameFrame({ ctx, getState, computePredictionTrail, setClearFlashTimer }) {
  const { W, H, screenShake, clearFlashTimer, activeGhost, gameStatus, currentLang, currentWind, timeElapsed, currentLasers, maxLives, currentLives, currentGravity, systems, targets, obstacles, blackhole, particles, shockwaves, floaters, PIVOT, currentRail, currentPortals, currentSwitches, currentBoostRings, currentZones, BASE_PIVOT, laserCooldown, PENDULUM_SCALE, BOB_MIN_R, BOB_MAX_R } = getState();
  ctx.save();
  if (screenShake > 0.4) { ctx.translate((Math.random() - 0.5) * screenShake * 1.5, (Math.random() - 0.5) * screenShake * 1.5); }
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 1;
  for (let x = 20; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 20; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]); ctx.stroke(); ctx.restore();
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
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([4, 6]);
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;
      ctx.stroke();

      const lastPt = predPts[predPts.length - 1];
      ctx.beginPath();
      ctx.arc(lastPt.x, lastPt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6ee7b7';
      ctx.fill();
      ctx.restore();
    }
  }

  const t = I18N[currentLang];

  if (currentWind && Math.abs(currentWind.currentFx || currentWind.fx) > 0.05) {
    const wFx = currentWind.currentFx || currentWind.fx;
    ctx.save();
    ctx.strokeStyle = wFx > 0 ? 'rgba(56, 189, 248, 0.22)' : 'rgba(244, 63, 94, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([14, 22]);
    const flowShift = (timeElapsed * wFx * 40) % 36;
    for (let row = 60; row < H; row += 85) {
      ctx.beginPath();
      ctx.moveTo(0, row);
      ctx.lineTo(W, row);
      ctx.lineDashOffset = -flowShift;
      ctx.stroke();
    }
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = wFx > 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(244, 63, 94, 0.7)';
    const dirSym = wFx > 0 ? '→' : '←';
    const spdVal = (Math.abs(wFx) * 3).toFixed(1);
    ctx.fillText(t.wind(dirSym, spdVal), W / 2, 30);
    ctx.restore();
  }

  if (currentLasers.length > 0 && maxLives > 1 && gameStatus === 'playing') {
    ctx.save();
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = currentLives > 1 ? '#38bdf8' : '#f43f5e';
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
    ctx.fillStyle = currentGravity < 0 ? '#f43f5e' : (currentGravity < 9.8 ? '#a7f3d0' : '#fca5a5');
    ctx.fillText(t.gravHud(currentGravity.toFixed(1), gLabel), W / 2, currentWind ? 48 : 30);
    ctx.restore();
  }

  drawGenericScene(ctx, systems, targets, obstacles, blackhole, particles, shockwaves, floaters, PIVOT, currentRail, currentPortals, currentSwitches, currentBoostRings, currentZones, currentLasers, { currentLang, BASE_PIVOT, PIVOT, timeElapsed, laserCooldown, PENDULUM_SCALE, BOB_MIN_R, BOB_MAX_R });
  ctx.restore();

}
