// Portals & Gates (Stages 23–33).
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null, bh = null, wind = null, gravity = 9.8;

  // Stage 23: WARP GATES
  if (stage === 23) {
    const portals = [];
    if (sub === 1) {
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 160, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 130, r: 24, color: '#c084fc', label: 'OUT 1' });
      obs.push({ baseX: BASE_PIVOT.x + 70, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 215, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 150, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 120, r: 24, color: '#c084fc', label: 'OUT 1' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 45, speed: 1.6, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 135, y: BASE_PIVOT.y + 190, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 235, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 235, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 135, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 140, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 140, r: 24, color: '#c084fc', label: 'OUT 1' });
      obs.push({ baseX: BASE_PIVOT.x - 60, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x - 60, y: BASE_PIVOT.y + 175, r: 18, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 60, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 175, r: 18, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 240, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 205, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 205, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 4) {
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 155, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 120, r: 24, color: '#c084fc', label: 'OUT 1' });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 180, r: 22, pulse: 0, ampX: 50, speed: 1.5, phase: 0 });
      for (let i = 0; i < 7; i++) {
        const a = -1.35 + (2.7 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 3), hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 135, r: 24, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 135, r: 24, color: '#c084fc', label: 'OUT 1' });
      portals.push({ id: 3, targetId: 4, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 105, r: 22, color: '#34d399', label: 'IN 2' });
      portals.push({ id: 4, targetId: null, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, color: '#f59e0b', label: 'OUT 2' });
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 180, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 180, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 180, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI });
      for (let i = 0; i < 8; i++) {
        const a = -1.45 + (2.9 * (i / 7));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 1 || i === 6), hp: 1, maxHp: 1 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind, portals: portals };
  }

  // Stage 24: DASH RINGS
  if (stage === 24) {
    const boostRings = [];
    if (sub === 1) {
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 130, r: 24, angle: 0, boostSpd: 5.0 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      boostRings.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 140, r: 22, angle: 0.3, boostSpd: 3.6 });
      boostRings.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 140, r: 22, angle: -0.3, boostSpd: 3.6 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 190, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 190, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 140, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      boostRings.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 140, r: 24, angle: 0.25, boostSpd: 3.8 });
      obs.push({ baseX: BASE_PIVOT.x + 80, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      boostRings.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 135, r: 22, angle: 0, boostSpd: 3.5 });
      boostRings.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y + 135, r: 22, angle: 0, boostSpd: 3.5 });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 3), hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      boostRings.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 135, r: 22, angle: 0.3, boostSpd: 4.0 });
      boostRings.push({ x: BASE_PIVOT.x + 100, y: BASE_PIVOT.y + 135, r: 22, angle: -0.3, boostSpd: 4.0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind, boostRings: boostRings };
  }

  // Stage 25: SECURITY KEY
  if (stage === 25) {
    const switches = [];
    if (sub === 1) {
      // 1 switch at left, opening a barrier gate on the right
      switches.push({
        x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 150, r: 20, active: false, timer: 0, duration: 4.5,
        gate: { x1: BASE_PIVOT.x + 50, y1: BASE_PIVOT.y + 160, x2: BASE_PIVOT.x + 140, y2: BASE_PIVOT.y + 160 }
      });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 215, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      // Shielded vault targets behind gate
      tgs.push({ x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 200, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 95, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      switches.push({
        x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 140, r: 20, active: false, timer: 0, duration: 4.2,
        gate: { x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 170, x2: BASE_PIVOT.x - 50, y2: BASE_PIVOT.y + 170 }
      });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 20, pulse: 0, ampX: 45, speed: 1.6, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 210, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y + 210, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 195, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y + 235, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      // Dual switches for dual vault corridors
      switches.push({
        x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 130, r: 20, active: false, timer: 0, duration: 4.5,
        gate: { x1: BASE_PIVOT.x + 45, y1: BASE_PIVOT.y + 170, x2: BASE_PIVOT.x + 135, y2: BASE_PIVOT.y + 170 }
      });
      switches.push({
        x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 130, r: 20, active: false, timer: 0, duration: 4.5,
        gate: { x1: BASE_PIVOT.x - 135, y1: BASE_PIVOT.y + 170, x2: BASE_PIVOT.x - 45, y2: BASE_PIVOT.y + 170 }
      });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y + 215, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 4) {
      switches.push({
        x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 140, r: 20, active: false, timer: 0, duration: 4.2,
        gate: { x1: BASE_PIVOT.x - 60, y1: BASE_PIVOT.y + 185, x2: BASE_PIVOT.x + 60, y2: BASE_PIVOT.y + 185 }
      });
      wind = { fx: 1.6, amp: 0, speed: 0, phase: 0, currentFx: 1.6 };
      for (let i = 0; i < 7; i++) {
        const a = -1.35 + (2.7 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 3), hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      // Grand Security Matrix: 2 switches + 2 moving obstacles + armored targets inside vault
      switches.push({
        x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 130, r: 20, active: false, timer: 0, duration: 4.5,
        gate: { x1: BASE_PIVOT.x - 60, y1: BASE_PIVOT.y + 180, x2: BASE_PIVOT.x + 60, y2: BASE_PIVOT.y + 180 }
      });
      obs.push({ baseX: BASE_PIVOT.x - 65, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x - 65, y: BASE_PIVOT.y + 145, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 65, baseY: BASE_PIVOT.y + 145, x: BASE_PIVOT.x + 65, y: BASE_PIVOT.y + 145, r: 18, pulse: 0, ampX: 30, speed: 1.8, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind, switches: switches };
  }

  // Stage 26: LASER TRIPWIRE
  if (stage === 26) {
    const lasers = [];
    if (sub === 1) {
      // 1 horizontal laser line across upper corridor
      lasers.push({ x1: BASE_PIVOT.x - 160, y1: BASE_PIVOT.y + 140, x2: BASE_PIVOT.x + 160, y2: BASE_PIVOT.y + 140, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 250, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      // 2 angled laser beams forming a precision safety funnel
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 45, y2: BASE_PIVOT.y + 180, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 45, y2: BASE_PIVOT.y + 180, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.25 + (2.5 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      }
    } else if (sub === 3) {
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 150, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 150, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 210, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 210, r: 22, pulse: 0, ampX: 50, speed: 1.8, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y - 120, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 80, y: BASE_PIVOT.y - 120, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.3 + (2.6 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 120, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 185, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 120, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 185, color: '#f43f5e' });
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      for (let i = 0; i < 7; i++) {
        const a = -1.4 + (2.8 * (i / 6));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 1 || i === 5), hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      // Grand Laser Gauntlet: 3 criss-crossing beams
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 40, y2: BASE_PIVOT.y + 190, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 150, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 40, y2: BASE_PIVOT.y + 190, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x - 120, y1: BASE_PIVOT.y + 150, x2: BASE_PIVOT.x + 120, y2: BASE_PIVOT.y + 150, color: '#f43f5e' });
      for (let i = 0; i < 8; i++) {
        const a = -1.45 + (2.9 * (i / 7));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: (i === 2 || i === 5), hp: 1, maxHp: 1 });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 16 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind, lasers: lasers };
  }

  // Stage 27: WARP HYPERCUBE
  if (stage === 27) {
    let portals = [];

    if (sub === 1) {
      // 27-1: Basic 2-Pair Quadrant Relay
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 115, y: BASE_PIVOT.y + 140, r: 22, color: '#38bdf8', label: 'IN 1' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 115, y: BASE_PIVOT.y + 120, r: 22, color: '#c084fc', label: 'OUT 1' });
      tgs.push({ x: BASE_PIVOT.x + 125, y: BASE_PIVOT.y + 195, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 125, y: BASE_PIVOT.y + 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 55, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 55, y: BASE_PIVOT.y + 235, r: 18, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 27-2: Full 4-Way Cross-Quadrant Portal Network
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
      // 27-3: 4-Way Wormholes + Moving Center Guard
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
      // 27-4: 4-Way Wormholes + Steady Crosswind
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
      // 27-5: The Hypercube Apex - 4 Wormholes + Dual Patrol Obstacles + Armored Fortress
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

  // Stage 28: SECURITY MAZE
  if (stage === 28) {
    let switches = [];
    let lasers = [];
    let boostRings = [];

    if (sub === 1) {
      // 28-1: Entry Vault - Angled Bank into Switch
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
      // 28-2: Dual Air-Locks - Twin Switches & Moving Guard
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
      // 28-3: Turbine Chute - Switch Opens Path to Turbo Boost Ring
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
      // 28-4: Hazard Lockdown - Switch + Laser Tripwire Net
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
      // 28-5: Maximum Security Matrix - Dual Switches, Lasers, Moving Guard & 3HP Citadel
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

  // Stage 29: LASER PORTAL
  if (stage === 29) {
    let portals = [];
    let lasers = [];

    if (sub === 1) {
      // 29-1: Single Portal with Flank Laser Gate
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 135, r: 24, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 135, r: 24, color: '#c084fc', label: 'OUT' });
      lasers.push({ x1: BASE_PIVOT.x - 50, y1: BASE_PIVOT.y + 90, x2: BASE_PIVOT.x - 50, y2: BASE_PIVOT.y + 240, color: '#f43f5e' });
      for (let i = 0; i < 5; i++) {
        const a = -1.1 + (2.2 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 29-2: Dual Lasers Creating Portal Funnel + Center Bomb
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
      // 29-3: Horizontal Laser Fence Above Portals + Moving Guard
      portals.push({ id: 1, targetId: 2, x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 145, r: 24, color: '#38bdf8', label: 'IN' });
      portals.push({ id: 2, targetId: null, x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 130, r: 24, color: '#c084fc', label: 'OUT' });
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 115, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 115, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 20, pulse: 0, ampX: 45, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 29-4: Crosswind Drift + Criss-Cross Lasers
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
      // 29-5: Quantum Laser Fortress - 3 Lasers, 2 Wormhole Pairs & 3HP Citadel
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

  // Stage 30: THE VAULT HEIST
  if (stage === 30) {
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
      // 30-5: The Obsidian Vault (2 timed switches + 2 criss-cross lasers + 3 HP citadel)
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

  // Stage 31: SOLAR STORM
  if (stage === 31) {
    let lasers = [];

    if (sub === 1) {
      // 31-1: Single horizontal laser sweep + steady wind
      wind = { fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8 };
      lasers.push({ x1: BASE_PIVOT.x - 150, y1: BASE_PIVOT.y + 130, x2: BASE_PIVOT.x + 150, y2: BASE_PIVOT.y + 130, color: '#f43f5e' });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 220, y: BASE_PIVOT.y + Math.cos(a) * 220, r: 18, alive: true, hp: 1, maxHp: 1 });
      }

    } else if (sub === 2) {
      // 31-2: Dual angled laser beams + stronger wind + bomb
      wind = { fx: 2.0, amp: 0, speed: 0, phase: 0, currentFx: 2.0 };
      lasers.push({ x1: BASE_PIVOT.x - 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x - 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      lasers.push({ x1: BASE_PIVOT.x + 140, y1: BASE_PIVOT.y + 110, x2: BASE_PIVOT.x + 30, y2: BASE_PIVOT.y + 175, color: '#f43f5e' });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.2 + (2.4 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, hp: (i===2?2:1), maxHp: (i===2?2:1) });
      }

    } else if (sub === 3) {
      // 31-3: Alternating Wind Gusts with Laser Grid
      wind = { fx: 0, amp: 2.4, speed: 1.6, phase: 0, currentFx: 0 };
      lasers.push({ x1: BASE_PIVOT.x - 160, y1: BASE_PIVOT.y + 140, x2: BASE_PIVOT.x + 160, y2: BASE_PIVOT.y + 140, color: '#f43f5e' });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 185, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 185, r: 20, pulse: 0, ampX: 50, speed: 1.8, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: (i === 2), hp: 2, maxHp: 2 });
      }

    } else if (sub === 4) {
      // 31-4: Dual Laser Funnel + Armored Targets + Moving Spring
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
      // 31-5: Solar Flare Apex (3 Lasers + Strong Gale + 3HP Citadel Core)
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

  // Stage 32: SLIME SLOUGH
  if (stage === 32) {
    const zones = [];
    if (sub === 1) {
      // 32-1: Central viscous pool slowing downward drop
      zones.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 120, w: 180, h: 100, damping: 0.8, isResin: false });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      // 32-2: Split viscous barriers on flanks
      zones.push({ x: BASE_PIVOT.x - 150, y: BASE_PIVOT.y + 130, w: 90, h: 110, damping: 0.8, isResin: false });
      zones.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 130, w: 90, h: 110, damping: 0.8, isResin: false });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      // 32-3: Deep viscous abyss with moving obstacle
      zones.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 150, w: 260, h: 90, damping: 0.8, isResin: false });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 55, speed: 1.6, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      // 32-4: Sticky Resin zone + Wind shear
      zones.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 110, w: 160, h: 120, damping: 1.2, isResin: true });
      wind = { fx: 1.6, amp: 0, speed: 0, phase: 0, currentFx: 1.6 };
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 185, r: 22, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 185, r: 22, alive: true, isBomb: false, hp: 2, maxHp: 2 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 4; i++) {
        const a = -1.2 + (2.4 * (i / 3));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 235, y: BASE_PIVOT.y + Math.cos(a) * 235, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      // 32-5: The Tar Pit Matrix
      zones.push({ x: BASE_PIVOT.x - 100, y: BASE_PIVOT.y + 140, w: 200, h: 100, damping: 1.2, isResin: true });
      obs.push({ baseX: BASE_PIVOT.x - 55, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x - 55, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 35, speed: 1.8, phase: 0 });
      obs.push({ baseX: BASE_PIVOT.x + 55, baseY: BASE_PIVOT.y + 155, x: BASE_PIVOT.x + 55, y: BASE_PIVOT.y + 155, r: 18, pulse: 0, ampX: 35, speed: 1.8, phase: Math.PI });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.4 + (2.8 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 230, y: BASE_PIVOT.y + Math.cos(a) * 230, r: 18, alive: true, isBomb: false, hp: (i%2===0?2:1), maxHp: (i%2===0?2:1) });
      }
    }
    return { maxN: 2, maxClone: 1, timeLimit: 15 + sub * 2, targets: tgs, obstacles: obs, blackhole: null, rail: null, wind: wind, zones: zones };
  }

  // Stage 33: BRAKE & BOOST
  if (stage === 33) {
    let boostRings = [];
    let zones = [];

    if (sub === 1) {
      // 33-1: Central Slime Pool + Overhead Boost Ring
      zones.push({ x: BASE_PIVOT.x - 80, y: BASE_PIVOT.y + 110, w: 160, h: 90, damping: 0.8, isResin: false });
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 110, r: 24, angle: 0, boostSpd: 4.8 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 125, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 125, r: 22, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 205, r: 20, alive: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 20, alive: true, hp: 1, maxHp: 1 });

    } else if (sub === 2) {
      // 33-2: Twin Flank Slime Pods + Dual Slanted Boosters
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
      // 33-3: Sticky Resin Floor + Moving Patrol Obstacle + Upper Boosters
      zones.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 160, w: 260, h: 80, damping: 1.2, isResin: true });
      boostRings.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 115, r: 24, angle: 0, boostSpd: 5.0 });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 55, speed: 1.6, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: (i===2?1:2), maxHp: (i===2?1:2) });
      }

    } else if (sub === 4) {
      // 33-4: Deep Sludge Funnel + Steady Wind + Dual Boost Rings
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
      // 33-5: Slime Arena Matrix - Dual Moving Patrols, Dual Resins, 3 Boost Rings & Citadel
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

  return null;
}
