// Optional artwork slots for the six existing chapters.
// IDs are visual selectors, not gameplay or stage identifiers.
export const ENVIRONMENT_WORLDS = Object.freeze({
  1: 'forest-ruins',
  2: 'wind-sanctuary',
  3: 'clockwork-hall',
  4: 'portal-temple',
  5: 'ancient-machinery',
  6: 'celestial-chamber'
});
const renderers = new Map();
export function registerEnvironmentRenderer(id, renderer) {
  if (!id || typeof renderer !== 'function') throw new TypeError('Environment ID and render function required');
  renderers.set(id,renderer);
}
export function unregisterEnvironmentRenderer(id) { return renderers.delete(id); }
export function getEnvironmentRenderer(id) { return renderers.get(id) ?? null; }
export function environmentIdForStage(index) {
  if (!Number.isInteger(index) || index < 1 || index > 250) return null;
  const stage = Math.ceil(index / 5);
  const chapter = stage <= 8 ? 1 : stage <= 16 ? 2 : stage <= 22 ? 3 : stage <= 33 ? 4 : stage <= 42 ? 5 : 6;
  return ENVIRONMENT_WORLDS[chapter];
}
