// Particle, shockwave, floating-text, and firework lifecycle helpers.
export function launchFirework({ W, H, fireworks }) {
  const sx = W * 0.15 + Math.random() * (W * 0.7); const targetY = H * 0.15 + Math.random() * (H * 0.45);
  fireworks.push({ x: sx, y: H, vx: (Math.random() - 0.5) * 70, vy: -(330 + Math.random() * 90), targetY: targetY, hue: Math.floor(Math.random() * 360), exploded: false });
}


export function updateParticlesAndFireworks({ particles, shockwaves, floaters, fireworks, dt, rawDt, currentGravity, playSnd, getScreenShake, setScreenShake }) {
  let screenShake = getScreenShake();
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    if (pt.isShard) {
      pt.rot = (pt.rot || 0) + (pt.rotSpd || 3) * dt;
      pt.vy += (currentGravity * 12) * dt;
    }
    pt.life -= pt.decay * dt;
    if (pt.life <= 0) particles.splice(i, 1);
  }
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].r += (shockwaves[i].maxR - shockwaves[i].r) * 12 * dt;
    shockwaves[i].life -= 3.0 * dt;
    if (shockwaves[i].life <= 0) shockwaves.splice(i, 1);
  }
  for (let i = floaters.length - 1; i >= 0; i--) {
    floaters[i].y -= rawDt * 40;
    floaters[i].life -= rawDt * 1.5;
    if (floaters[i].life <= 0) floaters.splice(i, 1);
  }
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    if (!fw.exploded) {
      fw.x += fw.vx * rawDt; fw.y += fw.vy * rawDt;
      if (Math.random() < 0.3) particles.push({ x: fw.x, y: fw.y, vx: (Math.random()-0.5)*20, vy: 30, life: 0.4, decay: 2.5, color: '#fbbf24' });
      if (fw.y <= fw.targetY || fw.vy >= 0) {
        fw.exploded = true; playSnd('firework'); screenShake = 6;
        for (let p = 0; p < 45; p++) {
          const pa = Math.random() * Math.PI * 2, ps = Math.random() * 240 + 50;
          particles.push({ x: fw.x, y: fw.y, vx: Math.cos(pa)*ps, vy: Math.sin(pa)*ps, life: 1.2, decay: 0.9 + Math.random()*0.5, color: `hsl(${fw.hue + Math.random()*30}, 100%, 65%)` });
        }
        fireworks.splice(i, 1);
      }
    }
  }
  setScreenShake(screenShake);
}
