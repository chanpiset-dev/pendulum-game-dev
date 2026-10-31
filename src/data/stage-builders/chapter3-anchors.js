// Moving Anchors (Stages 17–22).
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null, bh = null, wind = null, gravity = 9.8;

  // Stage 17: ROLLER TRACK
  if (stage === 17) {
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

  // Stage 18: SKY LIFT
  if (stage === 18) {
    rail = { ampX: 0, ampY: 45 + sub * 6, speedX: 0, speedY: 1.2 + sub * 0.15, phaseX: 0, phaseY: 0, pulse: 0 };
    if (sub === 1) {
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 40, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 40, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      // 18-5: 2D Elevator Rail (both X and Y oscillation!)
      rail = { ampX: 45, ampY: 45, speedX: 1.4, speedY: 1.4, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 200, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 200, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 7; i++) {
        const a = -1.45 + (2.9 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false, hp: (i%2===0?2:1), maxHp: (i%2===0?2:1) });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: rail, wind: wind };
  }

  // Stage 19: CAROUSEL
  if (stage === 19) {
    if (sub === 1) {
      // 19-1: Moderate 2D Orbital Carriage Loop
      rail = { ampX: 40, ampY: 35, speedX: 1.3, speedY: 1.3, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 19-2: Faster Orbit + Center Obstacle + High Crest Targets
      rail = { ampX: 45, ampY: 45, speedX: 1.4, speedY: 1.4, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 19-3: Elliptical Carriage with Crosswind
      rail = { ampX: 55, ampY: 35, speedX: 1.5, speedY: 1.5, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 19-4: High Velocity Centrifuge with Bouncer Cushions
      rail = { ampX: 50, ampY: 50, speedX: 1.6, speedY: 1.6, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 19-5: Centrifuge Vortex Apex - Max 2D Amplitude, Moving Bumper, 3HP Core
      rail = { ampX: 55, ampY: 50, speedX: 1.7, speedY: 1.7, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 18 + sub * 2, targets: tgs, obstacles: obs, rail: rail, wind: wind };
  }

  // Stage 20: STORM RUNNER
  if (stage === 20) {
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

  // Stage 21: CYCLONE ELEVATOR
  if (stage === 21) {
    if (sub === 1) {
      // 21-1: Vertical Elevator + Gentle Alternating Gusts
      rail = { ampX: 0, ampY: 40, speedX: 0, speedY: 1.2, phaseX: 0, phaseY: 0, pulse: 0 };
      wind = { fx: 0, amp: 2.0, speed: 1.4, phase: 0, currentFx: 0 };
      for (let i = 0; i < 5; i++) {
        const a = -1.1 + (2.2 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 21-2: Faster Lift + Stronger Gusts + Central Obstacle
      rail = { ampX: 0, ampY: 45, speedX: 0, speedY: 1.35, phaseX: 0, phaseY: 0, pulse: 0 };
      wind = { fx: 0, amp: 2.4, speed: 1.6, phase: 0, currentFx: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 3) {
      // 21-3: 2D Carriage Drift + Shifting Storm
      rail = { ampX: 35, ampY: 45, speedX: 1.3, speedY: 1.3, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.6, speed: 1.8, phase: 0, currentFx: 0 };
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 21-4: Extreme Gusts + Kinetic Bouncers
      rail = { ampX: 0, ampY: 50, speedX: 0, speedY: 1.45, phaseX: 0, phaseY: 0, pulse: 0 };
      wind = { fx: 0, amp: 2.8, speed: 2.0, phase: 0, currentFx: 0 };
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 21-5: Coriolis Vortex Apex - 2D Carriage, Storm Wind, Moving Barrier & 3HP Core
      rail = { ampX: 45, ampY: 48, speedX: 1.45, speedY: 1.45, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 3.0, speed: 2.0, phase: 0, currentFx: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, rail: rail, wind: wind };
  }

  // Stage 22: ABYSS RUNNER
  if (stage === 22) {
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

  return null;
}
