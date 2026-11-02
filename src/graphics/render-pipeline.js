// M1 compatibility pipeline: a single dispatch point for future render passes.
// The legacy renderer remains the sole drawing implementation, preserving order,
// Canvas transforms, appearance and behavior until later milestones.
export function renderScene(ctx, scene, legacyDraw) {
  return legacyDraw(
    ctx, scene.systems, scene.targets, scene.obstacles, scene.blackhole,
    scene.particles, scene.shockwaves, scene.floaters, scene.pivot,
    scene.rail, scene.portals, scene.switches, scene.boostRings,
    scene.zones, scene.lasers, scene.renderOptions
  );
}
