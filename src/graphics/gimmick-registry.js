// Gameplay identifiers remain unchanged. These names describe optional artwork only.
export const GIMMICK_VISUALS = Object.freeze({
  target: 'magic-diamond',
  armored: 'shielded-diamond',
  bomb: 'chain-crystal',
  'portal-in': 'ancient-portal',
  'portal-out': 'ancient-portal',
  portal: 'ancient-portal',
  spring: 'enchanted-spring',
  bumper: 'enchanted-bumper',
  absorber: 'enchanted-absorber',
  moving: 'moving-mechanism',
  boost: 'acceleration-rune',
  switch: 'rune-switch',
  gate: 'rune-gate',
  laser: 'energy-beam',
  blackhole: 'gravity-orb',
  repulsor: 'repulsor-orb',
  slime: 'slime-zone',
  resin: 'resin-zone',
  wind: 'wind-glyph',
  rail: 'mechanical-rail',
  lift: 'mechanical-lift',
  orbit: 'orbiting-anchor',
  gravity: 'gravity-glyph'
});
const skins = new Map();
export function registerGimmickSkin(visualId, draw) {
  if (!visualId || typeof draw !== 'function') throw new TypeError('Visual ID and drawing function required');
  skins.set(visualId, draw);
}
export function unregisterGimmickSkin(visualId) { return skins.delete(visualId); }
export function getGimmickSkin(visualId) { return skins.get(visualId) ?? null; }
export function visualIdForGimmick(kind) { return GIMMICK_VISUALS[kind] ?? kind; }
