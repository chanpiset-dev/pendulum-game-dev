// Basic pendulum mechanics (Stages 1–6).
// Stage mechanics are preserved from the original stage builder.
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null;
  let bh = null;
  let wind = null;
  let gravity = 9.8;


  // STAGE 1: BALLISTIC BASICS
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


  // STAGE 2: ANGLE TUNING TRIALS
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


  // STAGE 3: EXPLOSIVE CHAIN REACTIONS
  if (stage === 3) {
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


  // STAGE 4: HAZARD BARRIERS
  if (stage === 4) {
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


  // STAGE 5: PATROLLING OBSTACLES
  if (stage === 5) {
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


  // STAGE 6: THE SINGULARITY EVENT
  if (stage === 6) {
    bh = {
      x: BASE_PIVOT.x + (sub % 2 === 0 ? 80 : -80),
      y: BASE_PIVOT.y + 120,
      coreRadius: 22,
      pullRadius: 180,
      pullStrength: 300 + sub * 10,
      angle: 0,
      instructionAlpha: 1.5,
      instructionTimer: 2,
      isRepulsor: false
    };

    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 160, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 24, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 175, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 235, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 175, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x + 50, baseY: BASE_PIVOT.y + 170, x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 170, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 30, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 205, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 160, r: 20, alive: true, isBomb: false });
    } else if (sub === 4) {
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 190, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 220, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 165, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 18, alive: true, isBomb: false });
    } else if (sub === 5) {
      bh.x = BASE_PIVOT.x;
      bh.y = BASE_PIVOT.y + 125;
      for (let i = 0; i < 7; i++) {
        const a = -1.35 + (2.7 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 220, y: BASE_PIVOT.y + Math.cos(a) * 220, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, rail: null };
  }

  return null; // This world does not define the requested stage.
}
