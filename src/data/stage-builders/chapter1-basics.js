// Basics & Collisions (Stages 1–8).
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null, bh = null, wind = null, gravity = 9.8;

  // Stage 1: FIRST SWING
  if (stage === 1) {
    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 190, r: 28, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 75, y: BASE_PIVOT.y + 230, r: 28, alive: true, isBomb: false });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 180, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 180, r: 24, alive: true, isBomb: false });
    } else if (sub === 3) {
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 140, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 140, r: 22, alive: true, isBomb: false });
    } else if (sub === 4) {
      for (let i = 0; i < 5; i++) {
        const a = -1.3 + (2.6 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 210, y: BASE_PIVOT.y + Math.cos(a) * 210, r: 20, alive: true, isBomb: false });
      }
    } else if (sub === 5) {
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        const d = 160 + (i % 2 === 0 ? 55 : 25);
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * d, y: BASE_PIVOT.y + Math.cos(a) * d, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 10 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 2: FREE FALL
  if (stage === 2) {
    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: false });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 175, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 175, r: 22, alive: true, isBomb: false });
    } else if (sub === 3) {
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 140, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 225, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 225, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 140, r: 20, alive: true, isBomb: false });
    } else if (sub === 4) {
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        const d = 180 + (i % 2 === 0 ? 40 : 15);
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * d, y: BASE_PIVOT.y + Math.cos(a) * d, r: 18, alive: true, isBomb: false });
      }
    } else if (sub === 5) {
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 210, y: BASE_PIVOT.y + Math.cos(a) * 210, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 12 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 3: FULL THROTTLE
  if (stage === 3) {
    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y - 120, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y - 120, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: false });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 140, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 110, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 110, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 180, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 130, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 130, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false });
    } else if (sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 140, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 120, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 120, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
    } else if (sub === 5) {
      for (let i = 0; i < 4; i++) {
        const a = -0.9 + (1.8 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 160, y: BASE_PIVOT.y - Math.cos(a) * 160, r: 18, alive: true, isBomb: false });
      }
      for (let i = 0; i < 3; i++) {
        const a = -1.2 + (2.4 * (i / 2));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 12 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 4: BOMB CARNIVAL
  if (stage === 4) {
    if (sub === 1) {
      const bx = BASE_PIVOT.x + 50, by = BASE_PIVOT.y + 200;
      tgs.push({ x: bx, y: by, r: 26, alive: true, isBomb: true });
      tgs.push({ x: bx - 75, y: by + 20, r: 20, alive: true, isBomb: false });
      tgs.push({ x: bx + 70, y: by + 15, r: 20, alive: true, isBomb: false });
    } else if (sub === 2) {
      const bx = BASE_PIVOT.x - 60, by = BASE_PIVOT.y + 215;
      tgs.push({ x: bx, y: by, r: 26, alive: true, isBomb: true });
      tgs.push({ x: bx - 60, y: by - 30, r: 18, alive: true, isBomb: false });
      tgs.push({ x: bx + 65, y: by - 25, r: 18, alive: true, isBomb: false });
      tgs.push({ x: bx + 5, y: by + 45, r: 18, alive: true, isBomb: false });
    } else if (sub === 3) {
      const b1x = BASE_PIVOT.x - 90, b1y = BASE_PIVOT.y + 190;
      const b2x = BASE_PIVOT.x + 90, b2y = BASE_PIVOT.y + 190;
      tgs.push({ x: b1x, y: b1y, r: 24, alive: true, isBomb: true });
      tgs.push({ x: b1x - 45, y: b1y + 35, r: 18, alive: true, isBomb: false });
      tgs.push({ x: b2x, y: b2y, r: 24, alive: true, isBomb: true });
      tgs.push({ x: b2x + 45, y: b2y + 35, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false });
    } else if (sub === 4) {
      const bx = BASE_PIVOT.x, by = BASE_PIVOT.y + 235;
      tgs.push({ x: bx, y: by, r: 24, alive: true, isBomb: true });
      tgs.push({ x: bx - 90, y: by - 40, r: 22, alive: true, isBomb: true });
      tgs.push({ x: bx - 130, y: by - 60, r: 18, alive: true, isBomb: false });
      tgs.push({ x: bx - 50, y: by - 70, r: 18, alive: true, isBomb: false });
      tgs.push({ x: bx + 95, y: by - 45, r: 18, alive: true, isBomb: false });
      tgs.push({ x: bx + 130, y: by - 70, r: 18, alive: true, isBomb: false });
    } else if (sub === 5) {
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 205, r: 25, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 205, r: 25, alive: true, isBomb: true });
      for (let i = 0; i < 5; i++) {
        const a = -1.4 + (2.8 * (i / 4));
        const d = 175 + (i % 2 === 0 ? 40 : 15);
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * d, y: BASE_PIVOT.y + Math.cos(a) * d, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 12 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 5: BANK SHOT
  if (stage === 5) {
    if (sub === 1) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 180, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 180, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 40, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 40, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
    } else if (sub === 2) {
      obs.push({ baseX: BASE_PIVOT.x - 60, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 150, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 60, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 150, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 40, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 40, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x - 80, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 80, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 170, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 170, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 20, alive: true, isBomb: false });
    } else if (sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 120, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 120, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 120, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 120, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 200, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 200, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false });
    } else if (sub === 5) {
      for (let i = 0; i < 4; i++) {
        const a = -1.2 + (2.4 * (i / 3));
        obs.push({ baseX: BASE_PIVOT.x + Math.sin(a) * 135, baseY: BASE_PIVOT.y + Math.cos(a) * 135, x: BASE_PIVOT.x + Math.sin(a) * 135, y: BASE_PIVOT.y + Math.cos(a) * 135, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      }
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 12 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 6: BEAT THE PATROL
  if (stage === 6) {
    if (sub === 1) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 22, pulse: 0, ampX: 55, speed: 1.4, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 40, y: BASE_PIVOT.y + 235, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 40, y: BASE_PIVOT.y + 235, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
    } else if (sub === 2) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 125, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 125, r: 20, pulse: 0, ampX: 50, speed: 1.6, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 20, pulse: 0, ampX: 50, speed: 1.6, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 235, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 235, r: 20, alive: true, isBomb: false });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 24, pulse: 0, ampX: 75, speed: 2.0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 180, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 180, r: 18, alive: true, isBomb: false });
    } else if (sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 145, r: 20, pulse: 0, ampX: 35, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 145, r: 20, pulse: 0, ampX: 35, speed: 1.8, phase: Math.PI });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 200, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 200, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false });
      }
    } else if (sub === 5) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 115, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 18, pulse: 0, ampX: 60, speed: 1.5, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 45, speed: 2.2, phase: 1.2 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 205, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 205, r: 18, pulse: 0, ampX: 60, speed: 1.8, phase: 2.5 });
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 7: ARMORED TARGETS
  if (stage === 7) {
    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 235, r: 25, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 22, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 22, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x - 60, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 60, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 185, r: 22, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 185, r: 22, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 25, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 230, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 230, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 55, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 215, r: 22, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y + 175, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y + 175, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 5) {
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 40, speed: 1.6, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 40, speed: 1.6, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        const hpVal = (i === 2 || i === 3) ? 3 : 2;
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false, hp: hpVal, maxHp: hpVal });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 8: SUPER BOUNCER
  if (stage === 8) {
    if (sub === 1) {
      // 8-1: 1 Center gold spring bouncer (restitution = -1.42) catapulting to high crest targets
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      // 8-2: Dual spring bouncers on flanks catapulting across
      obs.push({ baseX: BASE_PIVOT.x - 85, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.38 });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.38 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 24, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 180, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 180, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      // 8-3: Moving kinetic bouncer with high-G drop
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 24, pulse: 0, ampX: 60, speed: 1.8, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.3 + (2.6 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i===2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      // 8-4: Spring bouncer combo + soft dampener obstacle (-0.05)
      obs.push({ baseX: BASE_PIVOT.x - 75, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 75, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 75, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -0.05 }); // Soft trap
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 140, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      // 8-5: Super Pinball Matrix (3 Spring Bouncers + Armored Targets)
      obs.push({ baseX: BASE_PIVOT.x - 85, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 145, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 145, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 205, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 205, r: 22, pulse: 0, ampX: 45, speed: 2.0, phase: 0, restitution: -1.48 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i===1||i===5), hp: 1, maxHp: 1 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  return null;
}
