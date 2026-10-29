// Portals, rails, lasers, boosters, and other interactive gadgets (Stages 21–30).
// Stage mechanics are preserved from the original stage builder.
export function buildWorld(stage, sub, BASE_PIVOT) {
  const tgs = [];
  const obs = [];
  let rail = null;
  let bh = null;
  let wind = null;
  let gravity = 9.8;



  // --- STAGE 21: WORMHOLE RELAY (One-Way Warp Portals) ---
  if (stage === 21) {
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

  // --- STAGE 22: CRUMBLING CITADEL (Armored Multi-Hit Shields) ---
  if (stage === 22) {
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

  // --- STAGE 23: VISCOUS DAMPING (Liquid Drag Zones) ---
  if (stage === 23) {
    const zones = [];
    if (sub === 1) {
      // 23-1: Central viscous pool slowing downward drop
      zones.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y + 120, w: 180, h: 100, damping: 0.8, isResin: false });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 200, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 245, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      // 23-2: Split viscous barriers on flanks
      zones.push({ x: BASE_PIVOT.x - 150, y: BASE_PIVOT.y + 130, w: 90, h: 110, damping: 0.8, isResin: false });
      zones.push({ x: BASE_PIVOT.x + 60, y: BASE_PIVOT.y + 130, w: 90, h: 110, damping: 0.8, isResin: false });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 240, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 110, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 110, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 50, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      // 23-3: Deep viscous abyss with moving obstacle
      zones.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 150, w: 260, h: 90, damping: 0.8, isResin: false });
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 150, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 150, r: 20, pulse: 0, ampX: 55, speed: 1.6, phase: 0 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i === 2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      // 23-4: Sticky Resin zone + Wind shear
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
      // 23-5: The Tar Pit Matrix
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


  // --- STAGE 24: KINETIC SPRINGS (Force Bouncers with Restitution > 1.3x) ---
  if (stage === 24) {
    if (sub === 1) {
      // 24-1: 1 Center gold spring bouncer (restitution = -1.42) catapulting to high crest targets
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 175, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 175, r: 24, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.42 });
      tgs.push({ x: BASE_PIVOT.x - 90, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 90, y: BASE_PIVOT.y - 120, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 120, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 120, y: BASE_PIVOT.y + 195, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 2) {
      // 24-2: Dual spring bouncers on flanks catapulting across
      obs.push({ baseX: BASE_PIVOT.x - 85, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x - 85, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.38 });
      obs.push({ baseX: BASE_PIVOT.x + 85, baseY: BASE_PIVOT.y + 160, x: BASE_PIVOT.x + 85, y: BASE_PIVOT.y + 160, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.38 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 135, r: 24, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 22, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 130, y: BASE_PIVOT.y + 180, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 130, y: BASE_PIVOT.y + 180, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x - 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 45, y: BASE_PIVOT.y + 240, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
    } else if (sub === 3) {
      // 24-3: Moving kinetic bouncer with high-G drop
      obs.push({ baseX: BASE_PIVOT.x, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x, y: BASE_PIVOT.y + 165, r: 24, pulse: 0, ampX: 60, speed: 1.8, phase: 0, restitution: -1.45 });
      tgs.push({ x: BASE_PIVOT.x - 70, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x + 70, y: BASE_PIVOT.y - 125, r: 20, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      for (let i = 0; i < 5; i++) {
        const a = -1.3 + (2.6 * (i / 4));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: (i===2), hp: 1, maxHp: 1 });
      }
    } else if (sub === 4) {
      // 24-4: Spring bouncer combo + soft dampener obstacle (-0.05)
      obs.push({ baseX: BASE_PIVOT.x - 75, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x - 75, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -1.45 });
      obs.push({ baseX: BASE_PIVOT.x + 75, baseY: BASE_PIVOT.y + 165, x: BASE_PIVOT.x + 75, y: BASE_PIVOT.y + 165, r: 22, pulse: 0, ampX: 0, speed: 0, phase: 0, restitution: -0.05 }); // Soft trap
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y - 140, r: 22, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      tgs.push({ x: BASE_PIVOT.x, y: BASE_PIVOT.y + 245, r: 24, alive: true, isBomb: true, hp: 1, maxHp: 1 });
      for (let i = 0; i < 6; i++) {
        const a = -1.35 + (2.7 * (i / 5));
        tgs.push({ x: BASE_PIVOT.x + Math.sin(a) * 225, y: BASE_PIVOT.y + Math.cos(a) * 225, r: 18, alive: true, isBomb: false, hp: 1, maxHp: 1 });
      }
    } else if (sub === 5) {
      // 24-5: Super Pinball Matrix (3 Spring Bouncers + Armored Targets)
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


  // --- STAGE 25: VERTICAL ELEVATOR (Vertical Moving Anchor Rail) ---
  if (stage === 25) {
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
      // 25-5: 2D Elevator Rail (both X and Y oscillation!)
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



  // --- STAGE 26: QUADRUPLE CHAOS (N = 4 Locked, Pulses = 0) ---
  if (stage === 26) {
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


  // --- STAGE 27: ACCELERATOR GATES (Directional Boost Rings) ---
  if (stage === 27) {
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


  // --- STAGE 28: SECURITY MAZE (Pressure Switches & Gateways) ---
  if (stage === 28) {
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


  // --- STAGE 29: LASER GRID (Lethal Laser Tripwires) ---
  if (stage === 29) {
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


  // --- STAGE 30: CHAOS HORIZON (The Apex Gauntlet) ---
  if (stage === 30) {
    let boostRings = [];
    let lasers = [];
    let portals = [];
    let zones = [];

    if (sub === 1) {
      // 30-1: "Orbital Launchpad"
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
      // 30-2: "Vertical Trench"
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
      // 30-3: "The Crosswind Citadel"
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
      // 30-4: "Warp Matrix Siege" (Sequential fix)
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
      // 30-5: "Chaos Horizon (Apex Climax)"
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

  return null; // This world does not define the requested stage.
}
