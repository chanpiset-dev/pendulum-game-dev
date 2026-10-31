// Forces (Stages 9–16).
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null, bh = null, wind = null, gravity = 9.8;

  // Stage 9: GALE VALLEY
  if (stage === 9) {
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

  // Stage 10: WIND SURFER
  if (stage === 10) {
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

  // Stage 11: MOON BOUNCE
  if (stage === 11) {
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

  // Stage 12: METEOR DIVE
  if (stage === 12) {
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

  // Stage 13: BLACK HOLE
  if (stage === 13) {
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

  // Stage 14: TWIN VORTEX
  if (stage === 14) {
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

  // Stage 15: FORCE FIELD
  if (stage === 15) {
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

  // Stage 16: PUSH & PULL
  if (stage === 16) {
    if (sub === 1) {
      // 16-1: Side-by-side Push & Pull nodes
      bh = [
        { x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 140, coreRadius: 22, pullRadius: 155, pullStrength: -310, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: true },
        { x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 140, coreRadius: 20, pullRadius: 155, pullStrength: 290, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false }
      ];
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y + 190, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y + 190, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 16-2: Inverted polarity (Black hole on left, Repulsor on right) + bomb trigger
      bh = [
        { x: BASE_PIVOT.x - 95, y: BASE_PIVOT.y + 135, coreRadius: 20, pullRadius: 160, pullStrength: 300, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false },
        { x: BASE_PIVOT.x + 95, y: BASE_PIVOT.y + 135, coreRadius: 22, pullRadius: 160, pullStrength: -320, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: true }
      ];
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 175, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 175, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 125, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 3) {
      // 16-3: Vertical Dipole (Top Repulsor, Bottom Black Hole) + Spring Bumper
      bh = [
        { x: BASE_PIVOT.x, y: BASE_PIVOT.y + 90, coreRadius: 22, pullRadius: 150, pullStrength: -340, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: true },
        { x: BASE_PIVOT.x, y: BASE_PIVOT.y + 220, coreRadius: 20, pullRadius: 150, pullStrength: 290, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false }
      ];
      obs.push({ baseX: BASE_PIVOT.x - 80, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 80, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      // for (let i = 0; i < 5; i++) {
      //   const a = -1.2 + (2.4 * (i / 4));
      //   tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: (i===2?2:1), maxHp: (i===2?2:1) });
      // }
      // 1. Four normal targets along the bottom arc
      for (let i = 0; i < 4; i++) {
        const a = -1.2 + (2.4 * (i / 3));
        tgs.push({ 
          x: BASE_PIVOT.x + Math.sin(a) * 230, 
          y: BASE_PIVOT.y + Math.cos(a) * 230, 
          r: 18, 
          alive: true, 
          hp: 1, 
          maxHp: 1 
        });
      }

      // 2. Shielded target placed at the top (above the pivot)
      tgs.push({ 
        x: BASE_PIVOT.x, 
        y: BASE_PIVOT.y - 130, 
        r: 20, 
        alive: true, 
        hp: 2, 
        maxHp: 2 
      });

    } else if (sub === 4) {
      // 16-4: Dipole with Crosswind drift
      bh = [
        { x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 135, coreRadius: 22, pullRadius: 160, pullStrength: -330, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: true },
        { x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 135, coreRadius: 20, pullRadius: 160, pullStrength: 300, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false }
      ];
      wind = { fx: 1.9, amp: 0, speed: 0, phase: 0, currentFx: 1.9 };
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 16-5: Tri-Node Matrix (Dual Singularities + Center Repulsor Core)
      bh = [
        { x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 135, coreRadius: 20, pullRadius: 145, pullStrength: 300, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false },
        { x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 135, coreRadius: 20, pullRadius: 145, pullStrength: 300, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false },
        { x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, coreRadius: 24, pullRadius: 150, pullStrength: -360, angle: Math.PI * 0.5, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: true }
      ];
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 115, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 18, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.1 + (2.2 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, wind: wind };
  }

  return null;
}
