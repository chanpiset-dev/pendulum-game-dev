// Advanced combinations and apex challenges (Stages 31–50).
// Stage mechanics are preserved from the original stage builder.
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null;
  let bh = null;
  let wind = null;
  let gravity = 9.8;



  // --- STAGE 31: GRAVITATIONAL METRONOME (Periodic Gravity Inversion) ---
  if (stage === 31) {
    const invInterval = 3.6 - sub * 0.2; // 3.4s down to 2.6s
    if (sub === 1) {
      // 31-1: Ceiling crest + floor arc targets alternating
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


  // --- STAGE 32: BINARY VORTEX (Dual Singularities + Boost Rings) ---
  if (stage === 32) {
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
      // 32-5: Binary singularities with repulsion core in center + dual boost rings
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


  // --- STAGE 33: SECURITY LABYRINTH (Lasers + Timed Gates + Armored Vaults) ---
  if (stage === 33) {
    const switches = [];
    const lasers = [];
    if (sub === 1) {
      // 1 switch drops barrier across laser corridor
      switches.push({
        x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 140, r: 20, active: false, timer: 0, duration: 3.5,
        gate: { x1: BASE_PIVOT.x + 45, y1: BASE_PIVOT.y + 165, x2: BASE_PIVOT.x + 140, y2: BASE_PIVOT.y + 165 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 215, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 205, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 205, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      switches.push({
        x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 130, r: 20, active: false, timer: 0, duration: 3.2,
        gate: { x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 160, x2: BASE_PIVOT.x - 45, y2: BASE_PIVOT.y + 160 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 135, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 135, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.6, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 205, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 235, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y - 120, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      // Dual switches and dual laser barriers
      switches.push({
        x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 125, r: 20, active: false, timer: 0, duration: 3.5,
        gate: { x1: BASE_PIVOT.x + 45, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x + 135, y2: BASE_PIVOT.y + 175 }
      });
      switches.push({
        x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 125, r: 20, active: false, timer: 0, duration: 3.5,
        gate: { x1: BASE_PIVOT.x - 135, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x - 45, y2: BASE_PIVOT.y + 175 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 130, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 40, y2: BASE_PIVOT.y + 160, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 130, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x + 40, y2: BASE_PIVOT.y + 160, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 18, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 4) {
      switches.push({
        x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 135, r: 20, active: false, timer: 0, duration: 3.2,
        gate: { x1: BASE_PIVOT.x - 55, y1: BASE_PIVOT.y + 185, x2: BASE_PIVOT.x + 55, y2: BASE_PIVOT.y + 185 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 120, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 120, color: '#f43f5e' });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 1 || i === 5), hp: (i===1||i===5?1:2), maxHp: (i===1||i===5?1:2) });
      }
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
    } else if (sub === 5) {
      // 33-5: The Obsidian Vault (2 timed switches + 2 criss-cross lasers + 3 HP citadel)
      switches.push({
        x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 130, r: 20, active: false, timer: 0, duration: 3.0,
        gate: { x1: BASE_PIVOT.x - 60, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x + 60, y2: BASE_PIVOT.y + 175 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 145, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 185, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 145, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 185, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 25, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind, switches: switches, lasers: lasers };
  }


  // --- STAGE 34: QUINTUPLE WHIP (N = 5 Locked, Pulses = 0) ---
  if (stage === 34) {
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


  // --- STAGE 35: SINGULARITY OMEGA (The Phase 6 Apex Climax) ---
  if (stage === 35) {
    const invInterval = 3.5 - sub * 0.15; // Periodic gravity flip!
    let boostRings = [];
    let lasers = [];
    let portals = [];

    if (sub === 1) {
      // 35-1: Gravity Inversion + Horizontal Rail + Vault
      rail = { ampX: 45, ampY: 0, speedX: 1.3, speedY: 0, phaseX: 0, phaseY: 0, pulse: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 135, x2: BASE_PIVOT.x + 140, y2: BASE_PIVOT.y + 135, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 22, alive: true, isBomb: false, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 35-2: Gravity Flip + Vertical Elevator + Dual Boost Rings
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
      // 35-3: 2D Orbital Rail + One-Way Wormhole + Crosswind
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
      // 35-4: Gravity Flip + Dual Boost Rings + Moving Spring Bumper
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
      // 35-5: "SINGULARITY OMEGA (Final Apex)" - 2D Rail + Periodic Gravity Inversion + Laser Net + Dual Bouncers + Citadel Core
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


  // --- STAGE 36: TIME DILATION FIELD (Viscous Zones + Boost Rings) ---
  if (stage === 36) {
    let boostRings = [];
    let zones = [];

    if (sub === 1) {
      // 36-1: Central Slime Pool + Overhead Boost Ring
      zones.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 110, w: 160, h: 90, damping: 0.8, isResin: false });
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 110, r: 24, angle: 0, boostSpd: 4.8 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 125, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 125, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 36-2: Twin Flank Slime Pods + Dual Slanted Boosters
      zones.push({ x: BASE_PIVOT.x - 145, y: BASE_PIVOT.y + 120, w: 75, h: 100, damping: 0.8, isResin: false });
      zones.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 120, w: 75, h: 100, damping: 0.8, isResin: false });
      boostRings.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 130, r: 22, angle: 0.3, boostSpd: 4.8 });
      boostRings.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 130, r: 22, angle: -0.3, boostSpd: 4.8 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 205, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 205, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 3) {
      // 36-3: Sticky Resin Floor + Moving Patrol Obstacle + Upper Boosters
      zones.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 160, w: 260, h: 80, damping: 1.2, isResin: true });
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 24, angle: 0, boostSpd: 5.0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 55, speed: 1.6, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:2), maxHp: (i===2?1:2) });
      }

    } else if (sub === 4) {
      // 36-4: Deep Sludge Funnel + Steady Wind + Dual Boost Rings
      zones.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 100, w: 180, h: 120, damping: 1.2, isResin: true });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      boostRings.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 130, r: 22, angle: 0.35, boostSpd: 5.2 });
      boostRings.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 130, r: 22, angle: -0.35, boostSpd: 5.2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 36-5: Slime Arena Matrix - Dual Moving Patrols, Dual Resins, 3 Boost Rings & Citadel
      zones.push({ x: BASE_PIVOT.x - 150, y: BASE_PIVOT.y + 120, w: 90, h: 110, damping: 1.2, isResin: true });
      zones.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 120, w: 90, h: 110, damping: 1.2, isResin: true });
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 110, r: 24, angle: 0, boostSpd: 5.2 });
      boostRings.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 130, r: 22, angle: 0.35, boostSpd: 5.0 });
      boostRings.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 130, r: 22, angle: -0.35, boostSpd: 5.0 });
      obs.push({ baseX: BASE_PIVOT.x - 55, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 55, y: BASE_PIVOT.y + 165, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 55, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 55, y: BASE_PIVOT.y + 165, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.1 + (2.2 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, boostRings: boostRings, zones: zones, wind: wind };
  }


  // --- STAGE 37: MAGNETIC POLARITY (Repulsor + Black Hole Dipole) ---
  if (stage === 37) {
    if (sub === 1) {
      // 37-1: Side-by-side Push & Pull nodes
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
      // 37-2: Inverted polarity (Black hole on left, Repulsor on right) + bomb trigger
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
      // 37-3: Vertical Dipole (Top Repulsor, Bottom Black Hole) + Spring Bumper
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
      // 37-4: Dipole with Crosswind drift
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
      // 37-5: Tri-Node Matrix (Dual Singularities + Center Repulsor Core)
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


  // --- STAGE 38: PRISM REFLECTOR (Kinetic Reflector Bouncers) ---
  if (stage === 38) {
    if (sub === 1) {
      // 38-1: Symmetrical Dual High-Restitution Bouncers
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 130, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.6 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 130, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.6 });
      tgs.push({ x: BASE_PIVOT.x - 140, y: BASE_PIVOT.y + 180, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 140, y: BASE_PIVOT.y + 180, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 240, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 120, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 38-2: Diamond Bouncer Formation (Center deflector + side cushions)
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 140, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 140, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x - 90, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x + 90, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 130, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 38-3: Moving Prism Patrol Bumper + Armored Perimeter
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 22, pulse: 0, ampX: 55, speed: 1.8, phase: 0, restitution: -1.65 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:2), maxHp: (i===2?1:2) });
      }

    } else if (sub === 4) {
      // 38-4: Opposing Restitution (Left is Gold +1.65x, Right is Soft Drag 0.05x)
      obs.push({ baseX: BASE_PIVOT.x - 75, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x - 75, y: BASE_PIVOT.y + 145, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.65 });
      obs.push({ baseX: BASE_PIVOT.x + 75, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 145, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -0.05 });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 38-5: Master Pinball Prism Grid (4 Bouncers, 3HP Core Citadel)
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


  // --- STAGE 39: ORBITAL CENTRIFUGE (2D Carousel Anchor Carriage) ---
  if (stage === 39) {
    if (sub === 1) {
      // 39-1: Moderate 2D Orbital Carriage Loop
      rail = { ampX: 40, ampY: 35, speedX: 1.3, speedY: 1.3, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 39-2: Faster Orbit + Center Obstacle + High Crest Targets
      rail = { ampX: 45, ampY: 45, speedX: 1.4, speedY: 1.4, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 39-3: Elliptical Carriage with Crosswind
      rail = { ampX: 55, ampY: 35, speedX: 1.5, speedY: 1.5, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 39-4: High Velocity Centrifuge with Bouncer Cushions
      rail = { ampX: 50, ampY: 50, speedX: 1.6, speedY: 1.6, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 160, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 39-5: Centrifuge Vortex Apex - Max 2D Amplitude, Moving Bumper, 3HP Core
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


  // --- STAGE 40: SOLAR FLARE (Lasers + High Crosswind) ---
  if (stage === 40) {
    let lasers = [];

    if (sub === 1) {
      // 40-1: Single horizontal laser sweep + steady wind
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 130, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 130, color: '#f43f5e' });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 220, y: BASE_PIVOT.y + Math.cos(a) * 220, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 40-2: Dual angled laser beams + stronger wind + bomb
      wind = { fx: 2.0, amp: 0, speed: 0, phase: 0, currentFx: 2.0 };
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: (i===2?2:1), maxHp: (i===2?2:1) });
      }

    } else if (sub === 3) {
      // 40-3: Alternating Wind Gusts with Laser Grid
      wind = { fx: 0, amp: 2.4, speed: 1.6, phase: 0, currentFx: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 160, y1: BASE_PIVOT.y + 140, x2: BASE_PIVOT.x + 160, y2: BASE_PIVOT.y + 140, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 20, pulse: 0, ampX: 50, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 40-4: Dual Laser Funnel + Armored Targets + Moving Spring
      wind = { fx: 2.2, amp: 0, speed: 0, phase: 0, currentFx: 2.2 };
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 115, x2: BASE_PIVOT.x - 40, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 115, x2: BASE_PIVOT.x + 40, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 40-5: Solar Flare Apex (3 Lasers + Strong Gale + 3HP Citadel Core)
      wind = { fx: 2.4, amp: 0, speed: 0, phase: 0, currentFx: 2.4 };
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x + 40, y2: BASE_PIVOT.y + 185, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 40, y2: BASE_PIVOT.y + 185, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x - 100, y1: BASE_PIVOT.y + 145, x2: BASE_PIVOT.x + 100, y2: BASE_PIVOT.y + 145, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, lasers: lasers, wind: wind };
  }


  // --- STAGE 41: CHAOS CASCADE / INVERTED WHIP (4-Link Inverted Gravity) ---
  if (stage === 41) {
    gravity = -9.8; // Constant upward gravity; no periodic inversion.

    if (sub === 1) {
      // 41-1: Clean Inverted Ceiling Arc
      for (let i = 0; i < 5; i++) {
        const a = -1.15 + (2.3 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 205, y: BASE_PIVOT.y - Math.cos(a) * 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 41-2: Dual Bouncers Redirecting Inverted Snaps
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y - 120, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 120, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y - 120, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 120, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 220, y: BASE_PIVOT.y - Math.cos(a) * 220, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 3) {
      // 41-3: Central Inverted Bomb + Two-Tier Ceiling Targets
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y - 150, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y - 150, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y - 235, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y - 235, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y - 100, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y - 100, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 4) {
      // 41-4: Moving Patrol Obstacle Patrolling the Inverted Ceiling
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y - 145, x: BASE_PIVOT.x, y: BASE_PIVOT.y - 145, r: 20, pulse: 0, ampX: 50, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.3 + (2.6 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y - Math.cos(a) * 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 5) {
      // 41-5: The Inverted Climax (Armored Targets + High Inverted Crosswind + Moving Bumper)
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


  // --- STAGE 42: THE HYPERCUBE (Dual Paired Wormhole Loops) ---
  if (stage === 42) {
    let portals = [];

    if (sub === 1) {
      // 42-1: Basic 2-Pair Quadrant Relay
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 140, r: 22, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 120, r: 22, color: '#c084fc', label: 'OUT 1' });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 195, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 55, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 55, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 42-2: Full 4-Way Cross-Quadrant Portal Network
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 140, r: 22, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 120, r: 22, color: '#c084fc', label: 'OUT 1' });
      portals.push({ id: 3, targetId: 4, x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 180, r: 22, color: '#f59e0b', label: 'IN 2' });
      portals.push({ id: 4, targetId: null, x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 200, r: 22, color: '#10b981', label: 'OUT 2' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 3) {
      // 42-3: 4-Way Wormholes + Moving Center Guard
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 130, r: 22, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 110, r: 22, color: '#c084fc', label: 'OUT 1' });
      portals.push({ id: 3, targetId: 4, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 175, r: 22, color: '#f59e0b', label: 'IN 2' });
      portals.push({ id: 4, targetId: null, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 195, r: 22, color: '#10b981', label: 'OUT 2' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 42-4: 4-Way Wormholes + Steady Crosswind
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 135, r: 22, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 115, r: 22, color: '#c084fc', label: 'OUT 1' });
      portals.push({ id: 3, targetId: 4, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 180, r: 22, color: '#f59e0b', label: 'IN 2' });
      portals.push({ id: 4, targetId: null, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 195, r: 22, color: '#10b981', label: 'OUT 2' });
      wind = { fx: 1.9, amp: 0, speed: 0, phase: 0, currentFx: 1.9 };
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 215, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 42-5: The Hypercube Apex - 4 Wormholes + Dual Patrol Obstacles + Armored Fortress
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 130, r: 22, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 110, r: 22, color: '#c084fc', label: 'OUT 1' });
      portals.push({ id: 3, targetId: 4, x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 175, r: 22, color: '#f59e0b', label: 'IN 2' });
      portals.push({ id: 4, targetId: null, x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 195, r: 22, color: '#10b981', label: 'OUT 2' });
      obs.push({ baseX: BASE_PIVOT.x - 60, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 160, r: 18, pulse: 0, ampX: 30, speed: 2.0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 60, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 160, r: 18, pulse: 0, ampX: 30, speed: 2.0, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 18 + sub * 2, targets: tgs, obstacles: obs, portals: portals, wind: wind };
  }


  // --- STAGE 43: CORIOLIS STORM (Vertical Elevator + Gusting Gale) ---
  if (stage === 43) {
    if (sub === 1) {
      // 43-1: Vertical Elevator + Gentle Alternating Gusts
      rail = { ampX: 0, ampY: 40, speedX: 0, speedY: 1.2, phaseX: 0, phaseY: 0, pulse: 0 };
      wind = { fx: 0, amp: 2.0, speed: 1.4, phase: 0, currentFx: 0 };
      for (let i = 0; i < 5; i++) {
        const a = -1.1 + (2.2 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 43-2: Faster Lift + Stronger Gusts + Central Obstacle
      rail = { ampX: 0, ampY: 45, speedX: 0, speedY: 1.35, phaseX: 0, phaseY: 0, pulse: 0 };
      wind = { fx: 0, amp: 2.4, speed: 1.6, phase: 0, currentFx: 0 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 3) {
      // 43-3: 2D Carriage Drift + Shifting Storm
      rail = { ampX: 35, ampY: 45, speedX: 1.3, speedY: 1.3, phaseX: 0, phaseY: Math.PI * 0.5, pulse: 0 };
      wind = { fx: 0, amp: 2.6, speed: 1.8, phase: 0, currentFx: 0 };
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 43-4: Extreme Gusts + Kinetic Bouncers
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
      // 43-5: Coriolis Vortex Apex - 2D Carriage, Storm Wind, Moving Barrier & 3HP Core
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


  // --- STAGE 44: PRESSURE LOCKDOWN (Sequential Switch Maze) ---
  if (stage === 44) {
    let switches = [];
    let lasers = [];
    let boostRings = [];

    if (sub === 1) {
      // 44-1: Entry Vault - Angled Bank into Switch
      switches.push({
        id: 1,
        x: BASE_PIVOT.x - 105,
        y: BASE_PIVOT.y + 130,
        r: 18,
        active: false,
        timer: 0,
        duration: 4.8,
        gate: { x1: BASE_PIVOT.x - 15, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x + 130, y2: BASE_PIVOT.y + 175 }
      });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 130, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.35 });
      tgs.push({ x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 225, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 205, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 44-2: Dual Air-Locks - Twin Switches & Moving Guard
      switches.push({
        id: 1,
        x: BASE_PIVOT.x - 120,
        y: BASE_PIVOT.y + 120,
        r: 18,
        active: false,
        timer: 0,
        duration: 4.2,
        gate: { x1: BASE_PIVOT.x + 40, y1: BASE_PIVOT.y + 165, x2: BASE_PIVOT.x + 135, y2: BASE_PIVOT.y + 165 }
      });
      switches.push({
        id: 2,
        x: BASE_PIVOT.x + 120,
        y: BASE_PIVOT.y + 120,
        r: 18,
        active: false,
        timer: 0,
        duration: 4.2,
        gate: { x1: BASE_PIVOT.x - 135, y1: BASE_PIVOT.y + 165, x2: BASE_PIVOT.x - 40, y2: BASE_PIVOT.y + 165 }
      });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 215, r: 20, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 215, r: 20, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 3) {
      // 44-3: Turbine Chute - Switch Opens Path to Turbo Boost Ring
      switches.push({
        id: 1,
        x: BASE_PIVOT.x + 115,
        y: BASE_PIVOT.y + 135,
        r: 18,
        active: false,
        timer: 0,
        duration: 4.0,
        gate: { x1: BASE_PIVOT.x - 80, y1: BASE_PIVOT.y + 145, x2: BASE_PIVOT.x - 5, y2: BASE_PIVOT.y + 145 }
      });
      boostRings.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 175, r: 22, angle: 0.35, boostSpd: 4.6 });
      obs.push({ baseX: BASE_PIVOT.x + 55, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x + 55, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 205, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 245, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 245, r: 22, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });

    } else if (sub === 4) {
      // 44-4: Hazard Lockdown - Switch + Laser Tripwire Net
      switches.push({
        id: 1,
        x: BASE_PIVOT.x - 110,
        y: BASE_PIVOT.y + 125,
        r: 18,
        active: false,
        timer: 0,
        duration: 3.8,
        gate: { x1: BASE_PIVOT.x - 50, y1: BASE_PIVOT.y + 185, x2: BASE_PIVOT.x + 50, y2: BASE_PIVOT.y + 185 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 105, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 60, y1: BASE_PIVOT.y + 115, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 165, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 215, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 215, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 35, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 35, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 5) {
      // 44-5: Maximum Security Matrix - Dual Switches, Lasers, Moving Guard & 3HP Citadel
      switches.push({
        id: 1,
        x: BASE_PIVOT.x - 125,
        y: BASE_PIVOT.y + 125,
        r: 18,
        active: false,
        timer: 0,
        duration: 3.5,
        gate: { x1: BASE_PIVOT.x - 70, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x, y2: BASE_PIVOT.y + 175 }
      });
      switches.push({
        id: 2,
        x: BASE_PIVOT.x + 125,
        y: BASE_PIVOT.y + 125,
        r: 18,
        active: false,
        timer: 0,
        duration: 3.5,
        gate: { x1: BASE_PIVOT.x, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x + 70, y2: BASE_PIVOT.y + 175 }
      });
      lasers.push({ x1: BASE_PIVOT.x - 145, y1: BASE_PIVOT.y + 95, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 155, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 145, y1: BASE_PIVOT.y + 95, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 155, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 18, pulse: 0, ampX: 40, speed: 2.0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 125, r: 18, alive: true, hp: 1, maxHp: 1 });
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 17 + sub * 2, targets: tgs, obstacles: obs, switches: switches, lasers: lasers, boostRings: boostRings };
  }


  // --- STAGE 45: ELASTIC SLINGSHOT (Boost Rings + Super Bouncers) ---
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


  // --- STAGE 46: ECHO PENDULUMS (Twin Clones / Dual Launch, 0 Pulses) ---
  if (stage === 46) {
    if (sub === 1) {
      // 46-1: Clean Divider Bumper - Splits Twins Left & Right
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.2 });
      for (let i = 0; i < 3; i++) {
        tgs.push({ x: BASE_PIVOT.x - 120 + i * 25, y: BASE_PIVOT.y + 200 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
        tgs.push({ x: BASE_PIVOT.x + 120 - i * 25, y: BASE_PIVOT.y + 200 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 46-2: Twin Moving Bumpers + Center Bomb
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 30, speed: 1.6, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 30, speed: 1.6, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 3; i++) {
        tgs.push({ x: BASE_PIVOT.x - 130 + i * 25, y: BASE_PIVOT.y + 195 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
        tgs.push({ x: BASE_PIVOT.x + 130 - i * 25, y: BASE_PIVOT.y + 195 + i * 15, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 3) {
      // 46-3: Twin Clones with Steady Crosswind
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 155, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.35 });
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 3), hp: 1, maxHp: 1 });
      }

    } else if (sub === 4) {
      // 46-4: High Bounce Gold Divider + Armored Flank Targets
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      obs.push({ baseX: BASE_PIVOT.x - 90, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 130, r: 18, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 90, baseY: BASE_PIVOT.y + 130, x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 130, r: 18, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      for (let i = 0; i < 4; i++) {
        tgs.push({ x: BASE_PIVOT.x - 135 + i * 22, y: BASE_PIVOT.y + 190 + i * 15, r: 18, alive: true, hp: 2, maxHp: 2 });
        tgs.push({ x: BASE_PIVOT.x + 135 - i * 22, y: BASE_PIVOT.y + 190 + i * 15, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 46-5: Twin Clones Storm Gauntlet - Shifting Winds, Dual Moving Obstacles & Core Citadel
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


  // --- STAGE 47: ZERO-G DRIFT (Weightless Inertial Space, g = 0.05) ---
  if (stage === 47) {
    gravity = 0.05; // Pure weightlessness

    if (sub === 1) {
      // 47-1: Clean Bank Cushion Bounds in Weightlessness
      obs.push({ baseX: BASE_PIVOT.x - 70, baseY: BASE_PIVOT.y + 135, x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 135, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.4 });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 135, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 135, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.4 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 215, y: BASE_PIVOT.y + Math.cos(a) * 215, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 47-2: 360-Degree Circular Target Perimeter
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.5 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y - 100, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y - 100, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 180, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 180, r: 18, alive: true, hp: 2, maxHp: 2 });

    } else if (sub === 3) {
      // 47-3: Moving Obstacle Patrol in Zero-G
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 60, speed: 1.6, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 47-4: Quad Corner Bouncers + Armored Drifters
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
      // 47-5: Zero-G Deep Space Climax - Dual Moving Bumpers, 3HP Core & Perimeter Orbit
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


  // --- STAGE 48: QUANTUM TUNNEL (Portals Guarded by Lasers) ---
  if (stage === 48) {
    let portals = [];
    let lasers = [];

    if (sub === 1) {
      // 48-1: Single Portal with Flank Laser Gate
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 135, r: 24, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 135, r: 24, color: '#c084fc', label: 'OUT' });
      lasers.push({ x1: BASE_PIVOT.x - 50, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x - 50, y2: BASE_PIVOT.y + 240, color: '#f43f5e' });
      for (let i = 0; i < 5; i++) {
        const a = -1.1 + (2.2 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 48-2: Dual Lasers Creating Portal Funnel + Center Bomb
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 150, r: 24, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 120, r: 24, color: '#c084fc', label: 'OUT' });
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 105, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 40, y1: BASE_PIVOT.y + 175, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 105, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 195, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 205, r: 18, alive: true, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 3) {
      // 48-3: Horizontal Laser Fence Above Portals + Moving Guard
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 145, r: 24, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 130, r: 24, color: '#c084fc', label: 'OUT' });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 115, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 115, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 48-4: Crosswind Drift + Criss-Cross Lasers
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 140, r: 24, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 120, r: 24, color: '#c084fc', label: 'OUT' });
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }

    } else if (sub === 5) {
      // 48-5: Quantum Laser Fortress - 3 Lasers, 2 Wormhole Pairs & 3HP Citadel
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 140, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 120, r: 24, color: '#c084fc', label: 'OUT 1' });
      portals.push({ id: 3, targetId: 4, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 105, r: 22, color: '#34d399', label: 'IN 2' });
      portals.push({ id: 4, targetId: null, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, color: '#f59e0b', label: 'OUT 2' });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 35, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 40, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 25, alive: true, hp: 3, maxHp: 3 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 210, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, lockedN: 2, maxClone: 1, timeLimit: 18 + sub * 2, targets: tgs, obstacles: obs, portals: portals, lasers: lasers, wind: wind };
  }


  // --- STAGE 49: THE FIVE-LINK METRONOME (5-Link Chaos + Gravity Inversion) ---
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


  // --- STAGE 50: COSMIC APEX: GENESIS (The Grand Finale Gauntlet) ---
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

  return null; // This world does not define the requested stage.
}
