// Read-only scene boundary. The view retains references to simulation objects;
// renderers must not modify them. We deliberately avoid copying physics state.
export function createSceneView({ systems, targets, obstacles, blackhole, particles, shockwaves, floaters, pivot, rail, portals, switches, boostRings, zones, lasers, renderOptions }) {
  return Object.freeze({
    systems, targets, obstacles, blackhole, particles, shockwaves, floaters,
    pivot, rail, portals, switches, boostRings, zones, lasers, renderOptions
  });
}
