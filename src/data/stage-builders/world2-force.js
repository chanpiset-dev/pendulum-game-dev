// Forces, gravity, environmental effects, and advanced pendulum dynamics (Stages 7–20).
// Stage mechanics are preserved from the original stage builder.
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null;
  let bh = null;
  let wind = null;
  let gravity = 9.8;


  // STAGE 7: SPEED TUNING TRIALS
  if (stage === 7) {
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


  // STAGE 8: SLIDING PIVOT RAILS
  if (stage === 8) {
    rail = { amp: 45 + sub * 7, speed: 1.1 + sub * 0.2, phase: 0, pulse: 0 };
    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 30, y: BASE_PIVOT.y + 235, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 30, y: BASE_PIVOT.y + 235, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 185, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 185, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 55, y: BASE_PIVOT.y + 235, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 55, y: BASE_PIVOT.y + 235, r: 20, alive: true, isBomb: false });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 175, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 175, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false });
    } else if (sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 45, speed: 1.5, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2) });
      }
    } else if (sub === 5) {
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: rail };
  }


  // STAGE 9: CHAOTIC DIVERGENCE
  if (stage === 9) {
    const obsCount = 3 + Math.floor((sub - 1) * 0.55);
    for (let i = 0; i < obsCount; i++) {
      const a = -1.1 + (2.2 * (i / (obsCount - 1 || 1)));
      const d = 145 + (i % 2 === 0 ? 25 : 0);
      obs.push({
        baseX: BASE_PIVOT.x + Math.sin(a) * d,
        baseY: BASE_PIVOT.y + Math.cos(a) * d,
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 20,
        pulse: 0,
        ampX: (sub >= 3 && i % 2 === 1) ? 35 : 0,
        speed: 1.6,
        phase: i * 1.2
      });
    }

    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.45 + (2.9 * (i / (tgtCount - 1)));
      const d = 210 + (i % 2 === 0 ? 25 : 0);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2))
      });
    }

    return { maxN: 2, maxClone: 2, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }


  // STAGE 10: SINGULARITY CORRIDOR
  if (stage === 10) {
    rail = { amp: 55, speed: 1.3, phase: 0, pulse: 0 };
    bh = {
      x: BASE_PIVOT.x,
      y: BASE_PIVOT.y + 120,
      coreRadius: 22,
      pullRadius: 175,
      pullStrength: 310 + sub * 10,
      angle: 0,
      instructionAlpha: 1.5,
      instructionTimer: 2,
      isRepulsor: false
    };

    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 20, alive: true, isBomb: false });
    } else if (sub === 2) {
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 220, y: BASE_PIVOT.y + Math.cos(a) * 220, r: 18, alive: true, isBomb: false });
      }
    } else if (sub === 3) {
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 185, r: 24, alive: true, isBomb: true });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: false });
      }
    } else if (sub === 4) {
      tgs.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 190, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 190, r: 24, alive: true, isBomb: true });
      for (let i = 0; i < 5; i++) {
        const a = -1.3 + (2.6 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false });
      }
    } else if (sub === 5) {
      for (let i = 0; i < 8; i++) {
        const a = -1.45 + (2.9 * (i / 7));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, rail: rail };
  }


  // STAGE 11: ATMOSPHERIC CROSSWIND
  if (stage === 11) {
    const windForce = (sub % 2 === 1 ? 1 : -1) * (1.6 + sub * 0.3);
    wind = { fx: windForce, amp: 0, speed: 0, phase: 0, currentFx: windForce };

    const tgtCount = 5 + Math.floor((sub - 1) * 0.75);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.35 + (2.7 * (i / (tgtCount - 1)));
      const d = 195 + (i % 2 === 0 ? 35 : 0);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d + (windForce > 0 ? 30 : -30),
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2))
      });
    }

    if (sub >= 2) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 170, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 170, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    }
    if (sub >= 4) {
      obs.push({ baseX: BASE_PIVOT.x - 90, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 140, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 90, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 140, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    }

    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind };
  }


  // STAGE 12: GUSTING WIND SHEAR
  if (stage === 12) {
    wind = { fx: 0, amp: 2.2 + sub * 0.35, speed: 1.4 + sub * 0.2, phase: 0, currentFx: 0 };

    const tgtCount = 5 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.4 + (2.8 * (i / (tgtCount - 1)));
      const d = 210 + (i % 2 === 0 ? 25 : -15);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && (i === 1 || i === tgtCount - 2))
      });
    }

    obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 22, pulse: 0, ampX: 55, speed: wind.speed, phase: 0 });
    if (sub >= 3) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 200, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 200, r: 20, pulse: 0, ampX: 45, speed: wind.speed, phase: Math.PI });
    }

    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind };
  }


  // STAGE 13: LUNAR DRIFT
  if (stage === 13) {
    gravity = 3.2;
    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.4 + (2.8 * (i / (tgtCount - 1)));
      const d = 190 + (i % 2 === 0 ? 30 : -10);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && (i === 1 || i === tgtCount - 2))
      });
    }

    const obsCount = 2 + Math.floor((sub - 1) * 0.55);
    for (let i = 0; i < obsCount; i++) {
      const a = -1.1 + (2.2 * (i / (obsCount - 1 || 1)));
      obs.push({
        baseX: BASE_PIVOT.x + Math.sin(a) * 145,
        baseY: BASE_PIVOT.y + Math.cos(a) * 145,
        x: BASE_PIVOT.x + Math.sin(a) * 145,
        y: BASE_PIVOT.y + Math.cos(a) * 145,
        r: 20,
        pulse: 0,
        ampX: (sub >= 3 && i % 2 === 1) ? 30 : 0,
        speed: 1.2,
        phase: i * 1.4
      });
    }

    return { maxN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, gravity: gravity };
  }


  // STAGE 14: HYPER-GRAVITY ABYSS
  if (stage === 14) {
    gravity = 22.0;
    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.35 + (2.7 * (i / (tgtCount - 1)));
      const d = 210 + (i % 2 === 0 ? 25 : 0);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (i === 0 || i === tgtCount - 1 || (sub >= 4 && i === Math.floor(tgtCount / 2)))
      });
    }

    const obsCount = 2 + Math.floor((sub - 1) * 0.6);
    for (let i = 0; i < obsCount; i++) {
      const a = -1.0 + (2.0 * (i / (obsCount - 1 || 1)));
      obs.push({
        baseX: BASE_PIVOT.x + Math.sin(a) * 150,
        baseY: BASE_PIVOT.y + Math.cos(a) * 150,
        x: BASE_PIVOT.x + Math.sin(a) * 150,
        y: BASE_PIVOT.y + Math.cos(a) * 150,
        r: 22,
        pulse: 0,
        ampX: 40,
        speed: 2.0,
        phase: i * Math.PI * 0.5
      });
    }

    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, gravity: gravity };
  }


  // STAGE 15: TRIPLE PENDULUM CHAOS
  if (stage === 15) {
    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.4 + (2.8 * (i / (tgtCount - 1)));
      const d = 195 + (i % 2 === 0 ? 35 : -15);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2))
      });
    }

    if (sub >= 2) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    }
    if (sub >= 4) {
      obs.push({ baseX: BASE_PIVOT.x - 85, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 140, r: 20, pulse: 0, ampX: 35, speed: 1.5, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 140, r: 20, pulse: 0, ampX: 35, speed: 1.5, phase: Math.PI });
    }

    return { maxN: 3, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }


  // STAGE 16: BINARY SINGULARITY
  if (stage === 16) {
    bh = [
      { x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 130, coreRadius: 20, pullRadius: 150, pullStrength: 280, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false },
      { x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 130, coreRadius: 20, pullRadius: 150, pullStrength: 280, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false }
    ];

    if (sub === 3 || sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 180, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    } else if (sub === 5) {
      obs.push({ baseX: BASE_PIVOT.x - 45, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 45, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    }

    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 130, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 145, y: BASE_PIVOT.y + 130, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 145, y: BASE_PIVOT.y + 130, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 215, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 215, r: 20, alive: true, isBomb: false });
    } else if (sub === 2) {
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 80, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 20, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 235, r: 22, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 150, y: BASE_PIVOT.y + 175, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 150, y: BASE_PIVOT.y + 175, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false });
    } else if (sub === 3) {
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 230, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 230, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 230, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y + 115, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y + 115, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false });
    } else if (sub === 4) {
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 120, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 18, alive: true, isBomb: false });
    } else if (sub === 5) {
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 24, alive: true, isBomb: true });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 18, alive: true, isBomb: false });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false });
      for (let i = 0; i < 5; i++) {
        const a = -1.4 + (2.8 * (i / 4));
        const d = 230;
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * d, y: BASE_PIVOT.y + Math.cos(a) * d, r: 18, alive: true, isBomb: false });
      }
    }

    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, rail: null };
  }


  // STAGE 17: REPULSOR FIELD
  if (stage === 17) {
    bh = {
      x: BASE_PIVOT.x,
      y: BASE_PIVOT.y + 140,
      coreRadius: 24,
      pullRadius: 170,
      pullStrength: -340 - sub * 15,
      angle: 0,
      instructionAlpha: 1.5,
      instructionTimer: 2,
      isRepulsor: true
    };

    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.35 + (2.7 * (i / (tgtCount - 1)));
      const d = 215 + (i % 2 === 0 ? 30 : -10);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2))
      });
    }

    return { maxN: 2, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, rail: null };
  }


  // STAGE 18: INERTIAL WIND CORRIDOR
  if (stage === 18) {
    rail = { amp: 50 + sub * 5, speed: 1.2 + sub * 0.15, phase: 0, pulse: 0 };
    const windForce = (sub % 2 === 1 ? 1 : -1) * (1.8 + sub * 0.25);
    wind = { fx: windForce, amp: 0, speed: 0, phase: 0, currentFx: windForce };

    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.4 + (2.8 * (i / (tgtCount - 1)));
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * 225 + (windForce > 0 ? 30 : -30),
        y: BASE_PIVOT.y + Math.cos(a) * 225,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && (i === 1 || i === tgtCount - 2))
      });
    }

    obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });

    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: rail, wind: wind };
  }


  // STAGE 19: ATMOSPHERIC CHAOS CHAMBER
  if (stage === 19) {
    wind = { fx: 0, amp: 2.6 + sub * 0.3, speed: 1.5 + sub * 0.2, phase: 0, currentFx: 0 };

    const tgtCount = 7 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.45 + (2.9 * (i / (tgtCount - 1)));
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * (185 + (i % 2) * 45),
        y: BASE_PIVOT.y + Math.cos(a) * (185 + (i % 2) * 45),
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2))
      });
    }

    const obsCount = 3 + Math.floor((sub - 1) * 0.5);
    for (let i = 0; i < obsCount; i++) {
      const a = -1.1 + (2.2 * (i / (obsCount - 1 || 1)));
      obs.push({
        baseX: BASE_PIVOT.x + Math.sin(a) * 145,
        baseY: BASE_PIVOT.y + Math.cos(a) * 145,
        x: BASE_PIVOT.x + Math.sin(a) * 145,
        y: BASE_PIVOT.y + Math.cos(a) * 145,
        r: 20,
        pulse: 0,
        ampX: 40,
        speed: wind.speed,
        phase: i * 1.1
      });
    }

    return { maxN: 2, maxClone: 2, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind };
  }


  // STAGE 20: SINGULARITY CORE MATRIX
  if (stage === 20) {
    rail = { amp: 55, speed: 1.35, phase: 0, pulse: 0 };

    bh = [
      { 
        x: BASE_PIVOT.x - 110, 
        y: BASE_PIVOT.y + 130, 
        coreRadius: 20, 
        pullRadius: 145, 
        pullStrength: 290 + sub * 10, 
        angle: 0, 
        instructionAlpha: 1.5, 
        instructionTimer: 2, 
        isRepulsor: false 
      },
      { 
        x: BASE_PIVOT.x, 
        y: BASE_PIVOT.y - 100, 
        coreRadius: 20, 
        pullRadius: 145, 
        pullStrength: 290 + sub * 10, 
        angle: Math.PI, 
        instructionAlpha: 1.5, 
        instructionTimer: 2, 
        isRepulsor: false 
      },
      { 
        x: BASE_PIVOT.x + 110, 
        y: BASE_PIVOT.y + 130, 
        coreRadius: 22, 
        pullRadius: 155, 
        pullStrength: -320 - sub * 15,
        angle: Math.PI * 0.5, 
        instructionAlpha: 1.5, 
        instructionTimer: 2, 
        isRepulsor: true 
      }
    ];

    wind = { fx: 0, amp: 2.4 + sub * 0.3, speed: 1.4 + sub * 0.2, phase: 0, currentFx: 0 };

    obs.push({ 
      baseX: BASE_PIVOT.x, 
      baseY: BASE_PIVOT.y + 205, 
      x: BASE_PIVOT.x, 
      y: BASE_PIVOT.y + 205, 
      r: 20, 
      pulse: 0, 
      ampX: 45, 
      speed: wind.speed, 
      phase: 0 
    });
    if (sub >= 3) {
      obs.push({ 
        baseX: BASE_PIVOT.x - 65, 
        baseY: BASE_PIVOT.y + 175, 
        x: BASE_PIVOT.x - 65, 
        y: BASE_PIVOT.y + 175, 
        r: 18, 
        pulse: 0, 
        ampX: 0, 
        speed: 0, 
        phase: 0 
      });
      obs.push({ 
        baseX: BASE_PIVOT.x + 65, 
        baseY: BASE_PIVOT.y + 175, 
        x: BASE_PIVOT.x + 65, 
        y: BASE_PIVOT.y + 175, 
        r: 18, 
        pulse: 0, 
        ampX: 0, 
        speed: 0, 
        phase: 0 
      });
    }

    const tgtCount = 7 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.45 + (2.9 * (i / (tgtCount - 1)));
      const d = 230 + (i % 2 === 0 ? 15 : -10);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 2 && (i === 1 || i === tgtCount - 2))
      });
    }

    return { maxN: 3, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, rail: rail, wind: wind };
  }

  return null; // This world does not define the requested stage.
}
