// Mastery (Stages 43–50).
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null, bh = null, wind = null, gravity = 9.8;

  // Stage 43: BUMPER BANKS
  if (stage === 43) {
    if (sub === 1) {
      // 43-1: Symmetrical Dual High-Restitution Bouncers
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 130, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.6 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 130, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.6 });
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 180, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 180, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 240, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 43-2: Diamond Bouncer Formation (Center deflector + side cushions)
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 140, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x - 90, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x + 90, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 43-3: Moving Prism Patrol Bumper + Armored Perimeter
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 22, pulse: 0, ampX: 55, speed: 1.8, phase: 0, restitution: -1.65 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:2), maxHp: (i===2?1:2) });
      }

    } else if (sub === 4) {
      // 43-4: Opposing Restitution (Left is Gold +1.65x, Right is Soft Drag 0.05x)
      obs.push({ baseX: BASE_PIVOT.x - 75, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x - 75, y: BASE_PIVOT.y + 145, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x + 75, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 145, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -0.05 });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 43-5: Master Pinball Prism Grid (4 Bouncers, 3HP Core Citadel)
      obs.push({ baseX: BASE_PIVOT.x - 85, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 22, pulse: 0, ampX: 45, speed: 2.0, phase: 0, restitution: -1.65 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.1 + (2.2 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, wind: wind };
  }

  // Stage 44: VORTEX BOOST
  if (stage === 44) {
    const boostRings = [];
    bh = [
      { x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 130, coreRadius: 20, pullRadius: 155, pullStrength: 290, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false },
      { x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 130, coreRadius: 20, pullRadius: 155, pullStrength: 290, angle: Math.PI, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: false }
    ];

    if (sub === 1) {
      // Boost ring positioned directly in the zero-G corridor between the black holes
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 130, r: 24, angle: 0, boostSpd: 4.8 });
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 160, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 160, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 24, angle: 0, boostSpd: 5.0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 145, y: BASE_PIVOT.y + 145, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 145, y: BASE_PIVOT.y + 145, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 225, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 225, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      boostRings.push({ x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 130, r: 22, angle: 0.35, boostSpd: 4.8 });
      boostRings.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 130, r: 22, angle: -0.35, boostSpd: 4.8 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 1, maxHp: 1 });
      }
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 4) {
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 125, r: 24, angle: 0, boostSpd: 5.2 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 5) {
      // 44-5: Binary singularities with repulsion core in center + dual boost rings
      bh.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, coreRadius: 22, pullRadius: 140, pullStrength: -310, angle: 0, instructionAlpha: 1.5, instructionTimer: 2, isRepulsor: true });
      boostRings.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 115, r: 22, angle: 0.35, boostSpd: 5.5 });
      boostRings.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 115, r: 22, angle: -0.35, boostSpd: 5.5 });
      tgs.push({ x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 24, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: bh, rail: null, wind: wind, boostRings: boostRings };
  }

  // Stage 45: PINBALL MANIA
  if (stage === 45) {
    let boostRings = [];

    if (sub === 1) {
      // 45-1: Single Center Boost Ring + Dual Side Bouncers
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 130, r: 24, angle: 0, boostSpd: 5.0 });
      obs.push({ baseX: BASE_PIVOT.x - 80, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.6 });
      obs.push({ baseX: BASE_PIVOT.x + 80, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.6 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 45-2: Dual Boost Rings Channelling into Center Super Bumper
      boostRings.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 125, r: 22, angle: 0.35, boostSpd: 4.8 });
      boostRings.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 125, r: 22, angle: -0.35, boostSpd: 4.8 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 180, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 190, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 190, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 45-3: Moving Super Bumper + Overhead Accelerator Loop
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 110, r: 24, angle: 0, boostSpd: 5.2 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 55, speed: 1.8, phase: 0, restitution: -1.6 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 45-4: Pinball Accelerator Alley + Crosswind
      boostRings.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 120, r: 22, angle: 0.3, boostSpd: 5.0 });
      boostRings.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 120, r: 22, angle: -0.3, boostSpd: 5.0 });
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 180, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 180, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      wind = { fx: 1.9, amp: 0, speed: 0, phase: 0, currentFx: 1.9 };
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 45-5: Hyper Pinball Apex - 3 Boost Rings, Dual Super Bumpers & 3HP Citadel
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 110, r: 24, angle: 0, boostSpd: 5.5 });
      boostRings.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 115, r: 22, angle: 0.35, boostSpd: 5.2 });
      boostRings.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 115, r: 22, angle: -0.35, boostSpd: 5.2 });
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 30, speed: 1.8, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI, restitution: -1.65 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, boostRings: boostRings, wind: wind };
  }

  // Stage 46: THE GAUNTLET
  if (stage === 46) {
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

  // Stage 47: CYBER HORIZON
  if (stage === 47) {
    let boostRings = [];
    let lasers = [];
    let portals = [];
    let zones = [];

    if (sub === 1) {
      // 47-1: "Orbital Launchpad"
      rail = { ampX: 45, ampY: 0, speedX: 1.25, speedY: 0, phaseX: 0, phaseY: 0, pulse: 0 };
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 24, angle: 0, boostSpd: 4.8 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 195, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 195, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.35 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 120, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 120, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 47-2: "Vertical Trench"
      rail = { ampX: 0, ampY: 50, speedX: 0, speedY: 1.35, phaseX: 0, phaseY: 0, pulse: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 90, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x - 90, y2: BASE_PIVOT.y + 225, color: '#f43f5e' });
      boostRings.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 140, r: 22, angle: -0.35, boostSpd: 4.5 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 18, pulse: 0, ampX: 25, speed: 2.0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 115, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 115, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 47-3: "The Crosswind Citadel"
      rail = { ampX: 40, ampY: 35, speedX: 1.3, speedY: 1.3, phaseX: 0, phaseY: 0, pulse: 0 };
      wind = { fx: 1.9, amp: 0, speed: 0, phase: 0, currentFx: 1.9 };
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      boostRings.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 180, r: 24, angle: 0.2, boostSpd: 4.8 });
      obs.push({ baseX: BASE_PIVOT.x + 100, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 170, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 24, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });

    } else if (sub === 4) {
      // 47-4: "Warp Matrix Siege" (Sequential fix)
      rail = { ampX: 45, ampY: 40, speedX: 1.4, speedY: 1.4, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.2, speed: 1.5, phase: 0, currentFx: 0 };
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 155, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y - 130, r: 24, color: '#c084fc', label: 'OUT 1' });
      lasers.push({ x1: BASE_PIVOT.x - 100, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 90, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 50, y1: BASE_PIVOT.y - 50, x2: BASE_PIVOT.x + 180, y2: BASE_PIVOT.y - 50, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 205, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 205, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y - 125, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 125, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y + 105, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y + 105, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });

    } else if (sub === 5) {
      // 47-5: "Chaos Horizon (Apex Climax)"
      rail = { ampX: 52, ampY: 48, speedX: 1.45, speedY: 1.35, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.6, speed: 1.6, phase: 0, currentFx: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x + 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 200, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 200, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 200, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 200, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 140, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 145, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 145, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    }

    return { maxN: 3, lockedN: 2, maxClone: 1, timeLimit: 18 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: rail, wind: wind, boostRings: boostRings, lasers: lasers, portals: portals, zones: zones };
  }

  // Stage 48: WARP METRONOME
  if (stage === 48) {
    const invInterval = 3.5 - sub * 0.15; // Periodic gravity flip!
    let boostRings = [];
    let lasers = [];
    let portals = [];

    if (sub === 1) {
      // 48-1: Gravity Inversion + Horizontal Rail + Vault
      rail = { ampX: 45, ampY: 0, speedX: 1.3, speedY: 0, phaseX: 0, phaseY: 0, pulse: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 135, x2: BASE_PIVOT.x + 140, y2: BASE_PIVOT.y + 135, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 22, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 48-2: Gravity Flip + Vertical Elevator + Dual Boost Rings
      rail = { ampX: 0, ampY: 48, speedX: 0, speedY: 1.35, phaseX: 0, phaseY: 0, pulse: 0 };
      boostRings.push({ x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 135, r: 22, angle: 0.35, boostSpd: 4.8 });
      boostRings.push({ x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 135, r: 22, angle: -0.35, boostSpd: 4.8 });
      lasers.push({ x1: BASE_PIVOT.x - 85, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x - 85, y2: BASE_PIVOT.y + 230, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 85, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x + 85, y2: BASE_PIVOT.y + 230, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 125, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 125, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });

    } else if (sub === 3) {
      // 48-3: 2D Orbital Rail + One-Way Wormhole + Crosswind
      rail = { ampX: 42, ampY: 38, speedX: 1.35, speedY: 1.35, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 155, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 130, r: 24, color: '#c084fc', label: 'OUT 1' });
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 24, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });

    } else if (sub === 4) {
      // 48-4: Gravity Flip + Dual Boost Rings + Moving Spring Bumper
      rail = { ampX: 48, ampY: 42, speedX: 1.4, speedY: 1.4, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.2, speed: 1.5, phase: 0, currentFx: 0 };
      boostRings.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 125, r: 22, angle: 0.35, boostSpd: 5.0 });
      boostRings.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 125, r: 22, angle: -0.35, boostSpd: 5.0 });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 130, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 130, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 20, pulse: 0, ampX: 50, speed: 1.8, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 4; i++) {
        const a = -0.9 + (1.8 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 165, y: BASE_PIVOT.y - Math.cos(a) * 165, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
      for (let i = 0; i < 5; i++) {
        const a = -1.35 + (2.7 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:3), maxHp: (i===2?1:3) });
      }

    } else if (sub === 5) {
      // 48-5: "SINGULARITY OMEGA (Final Apex)" - 2D Rail + Periodic Gravity Inversion + Laser Net + Dual Bouncers + Citadel Core
      rail = { ampX: 55, ampY: 50, speedX: 1.45, speedY: 1.35, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.6, speed: 1.6, phase: 0, currentFx: 0 };
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 105, r: 24, angle: 0, boostSpd: 5.2 });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x + 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x - 90, y1: BASE_PIVOT.y + 145, x2: BASE_PIVOT.x + 90, y2: BASE_PIVOT.y + 145, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 165, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 165, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI, restitution: -1.45 });

      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 22, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 145, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 145, y: BASE_PIVOT.y + 160, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    }

    return { maxN: 3, lockedN: 3, maxClone: 1, timeLimit: 20 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: rail, wind: wind, boostRings: boostRings, lasers: lasers, portals: portals, gravityInversionInterval: invInterval };
  }

  // Stage 49: 5-LINK INVERSION
  if (stage === 49) {
    const invInterval = 3.4 - sub * 0.15; // Rhythm speeds up from 3.25s down to 2.65s

    if (sub === 1) {
      // 49-1: Dual Crescent (Ceiling & Floor Waves)
      for (let i = 0; i < 4; i++) {
        const a = -1.0 + (2.0 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 1, maxHp: 1 });
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 165, y: BASE_PIVOT.y - Math.cos(a) * 165, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 49-2: Center Bouncers Absorbing / Deflecting Chaos
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.35 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.35 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.1 + (2.2 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 1, maxHp: 1 });
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 165, y: BASE_PIVOT.y - Math.cos(a) * 165, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 3) {
      // 49-3: Moving Barrier Oscillating Through the Flip Window
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 50, speed: 1.8, phase: 0 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: (i===2), hp: (i===2?1:2), maxHp: (i===2?1:2) });
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 170, y: BASE_PIVOT.y - Math.cos(a) * 170, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 4) {
      // 49-4: Shifting Crosswind Coupled with Gravity Metronome
      wind = { fx: 0, amp: 2.4, speed: 1.6, phase: 0, currentFx: 0 };
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.4 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.4 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 165, y: BASE_PIVOT.y - Math.cos(a) * 165, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 49-5: 5-Link Metronome Climax - Moving Rail, Rapid Flips & Armored Fortress
      rail = { ampX: 45, ampY: 0, speedX: 1.4, speedY: 0, phaseX: 0, phaseY: 0, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 40, speed: 2.0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 22, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.35 + (2.7 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 170, y: BASE_PIVOT.y - Math.cos(a) * 170, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 5, lockedN: 5, maxClone: 1, timeLimit: 20 + sub * 2, targets: tgs, obstacles: obs, rail: rail, wind: wind, gravityInversionInterval: invInterval };
  }

  // Stage 50: COSMIC APEX
  if (stage === 50) {
    const invInterval = 3.5 - sub * 0.15; // Rhythm speeds up towards sub 5
    let boostRings = [];
    let lasers = [];
    let portals = [];

    if (sub === 1) {
      // 50-1: Genesis Awakening - Gravity Inversion + Horizontal Rail + Vault
      rail = { ampX: 45, ampY: 0, speedX: 1.3, speedY: 0, phaseX: 0, phaseY: 0, pulse: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 135, x2: BASE_PIVOT.x + 140, y2: BASE_PIVOT.y + 135, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 215, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 215, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 22, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 50-2: Singularity Elevator - Vertical Carriage + Dual Turbo Rings + Lasers
      rail = { ampX: 0, ampY: 48, speedX: 0, speedY: 1.35, phaseX: 0, phaseY: 0, pulse: 0 };
      boostRings.push({ x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 135, r: 22, angle: 0.35, boostSpd: 5.0 });
      boostRings.push({ x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 135, r: 22, angle: -0.35, boostSpd: 5.0 });
      lasers.push({ x1: BASE_PIVOT.x - 85, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x - 85, y2: BASE_PIVOT.y + 230, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 85, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x + 85, y2: BASE_PIVOT.y + 230, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 18, alive: true, hp: 3, maxHp: 3 });

    } else if (sub === 3) {
      // 50-3: 2D Orbital Carousel + Wormhole Transit + Crosswind
      rail = { ampX: 42, ampY: 38, speedX: 1.35, speedY: 1.35, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 155, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 130, r: 24, color: '#c084fc', label: 'OUT 1' });
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 24, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 18, alive: true, hp: 3, maxHp: 3 });

    } else if (sub === 4) {
      // 50-4: Event Horizon Crossfire - 2D Orbital Carriage, Dual Boosters, Moving Spring & Storm
      rail = { ampX: 48, ampY: 42, speedX: 1.4, speedY: 1.4, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.2, speed: 1.5, phase: 0, currentFx: 0 };
      boostRings.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 125, r: 22, angle: 0.35, boostSpd: 5.2 });
      boostRings.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 125, r: 22, angle: -0.35, boostSpd: 5.2 });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 130, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 130, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 20, pulse: 0, ampX: 50, speed: 1.8, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 4; i++) {
        const a = -0.9 + (1.8 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 165, y: BASE_PIVOT.y - Math.cos(a) * 165, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
      for (let i = 0; i < 5; i++) {
        const a = -1.35 + (2.7 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:3), maxHp: (i===2?1:3) });
      }

    } else if (sub === 5) {
      // 50-5: "COSMIC APEX: GENESIS (The Ultimate Climax)" - All 15+ System Mechanics Converged
      rail = { ampX: 55, ampY: 50, speedX: 1.45, speedY: 1.35, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.6, speed: 1.6, phase: 0, currentFx: 0 };
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 105, r: 24, angle: 0, boostSpd: 5.5 });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x + 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x - 90, y1: BASE_PIVOT.y + 145, x2: BASE_PIVOT.x + 90, y2: BASE_PIVOT.y + 145, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 165, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 165, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI, restitution: -1.45 });
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 180, r: 22, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 180, r: 22, color: '#c084fc', label: 'OUT' });

      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 26, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 22, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y - 125, r: 20, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y - 125, r: 20, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 145, y: BASE_PIVOT.y + 160, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 145, y: BASE_PIVOT.y + 160, r: 18, alive: true, hp: 2, maxHp: 2 });
    }
    return { maxN: 3, lockedN: 3, maxClone: 1, timeLimit: 22 + sub * 2, targets: tgs, obstacles: obs, rail: rail, wind: wind, boostRings: boostRings, lasers: lasers, portals: portals, gravityInversionInterval: invInterval };
  }

  return null;
}
