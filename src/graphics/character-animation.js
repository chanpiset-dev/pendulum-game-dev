// Animation state is presentation-only and deterministic for a given frame.
// M2's legacy fallback intentionally retains the existing expressions and timing.
export function resolveCharacterAnimation({ mood = 'ready', popScale = 1, time = 0 } = {}) {
  const expression = mood === 'happy' ? 'happy' : popScale > 1.05 ? 'impact' : mood;
  return Object.freeze({ expression, time });
}
