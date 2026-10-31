// Advanced Dynamics (Stages 34–42).
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null, bh = null, wind = null, gravity = 9.8;

  // Stage 34: TWIN LAUNCH
  if (stage === 34) {
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

  // Stage 35: TWIN STORM
  if (stage === 35) {
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

  // Stage 36: TRIPLE WHIP
  if (stage === 36) {
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

  // Stage 37: QUAD CHAOS
  if (stage === 37) {
    const tgtCount = 5 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.4 + (2.8 * (i / (tgtCount - 1)));
      const d = 195 + (i % 2 === 0 ? 35 : -15);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2)),
        hp: 1, maxHp: 1
      });
    }

    if (sub >= 2 && sub <= 3) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    } else if (sub >= 4) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 45, speed: 1.6, phase: 0 });
    }

    return { maxN: 4, lockedN: 4, maxClone: 1, timeLimit: 14 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 38: FIVE-LINK FRENZY
  if (stage === 38) {
    const tgtCount = 6 + (sub - 1);
    for (let i = 0; i < tgtCount; i++) {
      const a = -1.45 + (2.9 * (i / (tgtCount - 1)));
      const d = 195 + (i % 2 === 0 ? 35 : -20);
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: 18,
        alive: true,
        isBomb: (sub >= 3 && i === Math.floor(tgtCount / 2)),
        hp: (sub >= 4 && i % 2 === 0) ? 2 : 1,
        maxHp: (sub >= 4 && i % 2 === 0) ? 2 : 1
      });
    }

    if (sub >= 2 && sub <= 3) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
    } else if (sub >= 4) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 20, pulse: 0, ampX: 45, speed: 1.6, phase: 0 });
    }

    return { maxN: 5, lockedN: 5, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null };
  }

  // Stage 39: CEILING RUSH
  if (stage === 39) {
    gravity = -9.8; // Constant upward gravity; no periodic inversion.

    if (sub === 1) {
      // 39-1: Clean Inverted Ceiling Arc
      for (let i = 0; i < 5; i++) {
        const a = -1.15 + (2.3 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 205, y: BASE_PIVOT.y - Math.cos(a) * 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 39-2: Dual Bouncers Redirecting Inverted Snaps
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y - 120, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 120, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y - 120, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 120, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 220, y: BASE_PIVOT.y - Math.cos(a) * 220, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 3) {
      // 39-3: Central Inverted Bomb + Two-Tier Ceiling Targets
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y - 150, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y - 150, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y - 235, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y - 235, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y - 100, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y - 100, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 4) {
      // 39-4: Moving Patrol Obstacle Patrolling the Inverted Ceiling
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y - 145, x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 20, pulse: 0, ampX: 50, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.3 + (2.6 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y - Math.cos(a) * 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 5) {
      // 39-5: The Inverted Climax (Armored Targets + High Inverted Crosswind + Moving Bumper)
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y - 140, x: BASE_PIVOT.x, y: BASE_PIVOT.y - 140, r: 18, pulse: 0, ampX: 40, speed: 2.0, phase: 0, restitution: -1.4 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 235, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        const isArmored = (i === 1 || i === 4);
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y - Math.cos(a) * 230, r: 18, alive: true, hp: isArmored ? 2 : 1, maxHp: isArmored ? 2 : 1 });
      }
    }
    return { maxN: 4, lockedN: 4, maxClone: 1, timeLimit: 18 + sub * 2, targets: tgs, obstacles: obs, wind: wind, gravity: gravity };
  }

  // Stage 40: ZERO GRAVITY
  if (stage === 40) {
    gravity = 0.05; // Pure weightlessness

    if (sub === 1) {
      // 40-1: Clean Bank Cushion Bounds in Weightlessness
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 135, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 135, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.4 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 135, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 135, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.4 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 40-2: 360-Degree Circular Target Perimeter
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y - 100, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y - 100, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 180, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 180, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 40-3: Moving Obstacle Patrol in Zero-G
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 60, speed: 1.6, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 40-4: Quad Corner Bouncers + Armored Drifters
      obs.push({ baseX: BASE_PIVOT.x - 85, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 195, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 195, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.1 + (2.2 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 40-5: Zero-G Deep Space Climax - Dual Moving Bumpers, 3HP Core & Perimeter Orbit
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 150, r: 18, pulse: 0, ampX: 35, speed: 1.8, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 150, r: 18, pulse: 0, ampX: 35, speed: 1.8, phase: Math.PI, restitution: -1.5 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 20 + sub * 2, targets: tgs, obstacles: obs, gravity: gravity };
  }

  // Stage 41: GRAVITY METRONOME
  if (stage === 41) {
    const invInterval = 3.6 - sub * 0.2; // 3.4s down to 2.6s
    if (sub === 1) {
      // 41-1: Ceiling crest + floor arc targets alternating
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 125, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 125, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.6, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 135, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 135, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 150, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.2 + (2.4 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      for (let i = 0; i < 4; i++) {
        const a = -0.9 + (1.8 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 165, y: BASE_PIVOT.y - Math.cos(a) * 165, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
      for (let i = 0; i < 4; i++) {
        const a = -1.2 + (2.4 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 1 || i === 2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      rail = { ampX: 45, ampY: 0, speedX: 1.4, speedY: 0, phaseX: 0, phaseY: 0, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 40, speed: 1.8, phase: 0 });
      for (let i = 0; i < 5; i++) {
        const a = -1.0 + (2.0 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 170, y: BASE_PIVOT.y - Math.cos(a) * 170, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
      for (let i = 0; i < 5; i++) {
        const a = -1.35 + (2.7 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:2), maxHp: (i===2?1:2) });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: rail, wind: wind, gravityInversionInterval: invInterval };
  }

  // Stage 42: MIRROR SHADOWS
  if (stage === 42) {
    if (sub === 1) {
      // 42-1: Clean Divider Bumper - Splits Twins Left & Right
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.2 });
      for (let i = 0; i < 3; i++) {
        tgs.push({ x: BASE_PIVOT.x - 120 + i * 25, y: BASE_PIVOT.y + 200 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
        tgs.push({ x: BASE_PIVOT.x + 120 - i * 25, y: BASE_PIVOT.y + 200 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 42-2: Twin Moving Bumpers + Center Bomb
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 30, speed: 1.6, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 30, speed: 1.6, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 3; i++) {
        tgs.push({ x: BASE_PIVOT.x - 130 + i * 25, y: BASE_PIVOT.y + 195 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
        tgs.push({ x: BASE_PIVOT.x + 130 - i * 25, y: BASE_PIVOT.y + 195 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 3) {
      // 42-3: Twin Clones with Steady Crosswind
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.35 });
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 3), hp: 1, maxHp: 1 });
      }

    } else if (sub === 4) {
      // 42-4: High Bounce Gold Divider + Armored Flank Targets
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x - 90, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 130, r: 18, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 90, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 130, r: 18, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      for (let i = 0; i < 4; i++) {
        tgs.push({ x: BASE_PIVOT.x - 135 + i * 22, y: BASE_PIVOT.y + 190 + i * 15, r: 18, alive: true, hp: 2, maxHp: 2 });
        tgs.push({ x: BASE_PIVOT.x + 135 - i * 22, y: BASE_PIVOT.y + 190 + i * 15, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 42-5: Twin Clones Storm Gauntlet - Shifting Winds, Dual Moving Obstacles & Core Citadel
      wind = { fx: 0, amp: 2.5, speed: 1.8, phase: 0, currentFx: 0 };
      obs.push({ baseX: BASE_PIVOT.x - 60, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 155, r: 20, pulse: 0, ampX: 35, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 60, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 155, r: 20, pulse: 0, ampX: 35, speed: 1.8, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 8; i++) {
        const a = -1.45 + (2.9 * (i / 7));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: (i%2===0?2:1), maxHp: (i%2===0?2:1) });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 2, lockedClone: 2, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, wind: wind };
  }

  return null;
}
