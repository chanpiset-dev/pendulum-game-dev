// Shared visual and collision dimensions. Stage coordinates and link lengths stay authored.
export const OBJECT_SCALE = 1.5;
export const BOB_MIN_RADIUS = 14 * OBJECT_SCALE;
export const BOB_MAX_RADIUS = 36 * OBJECT_SCALE;
export const BOB_GROWTH = 3 * OBJECT_SCALE;
export const BOB_SHRINK = 3 * OBJECT_SCALE;
export const JOINT_RADIUS = 5 * OBJECT_SCALE;
export const ROD_WIDTH = 4 * OBJECT_SCALE;
export const SEGMENT_HIT_RADIUS = 2 * OBJECT_SCALE;
export const RAIL_HIT_RADIUS = 12 * OBJECT_SCALE;

export function enlargeStageObjects(data) {
  const circles = items => items?.map(item => ({ ...item, r: item.r * OBJECT_SCALE }));
  const core = item => ({ ...item, coreRadius: item.coreRadius * OBJECT_SCALE });
  return {
    ...data,
    targets: circles(data.targets), obstacles: circles(data.obstacles),
    ...(data.portals && { portals: circles(data.portals) }),
    ...(data.boostRings && { boostRings: circles(data.boostRings) }),
    ...(data.switches && { switches: circles(data.switches) }),
    blackhole: data.blackhole ? (Array.isArray(data.blackhole) ? data.blackhole.map(core) : core(data.blackhole)) : data.blackhole,
  };
}
