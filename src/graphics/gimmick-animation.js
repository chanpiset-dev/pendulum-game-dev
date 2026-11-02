// Deterministic presentation-only animation inputs. The legacy artwork path
// still receives the original time and hits, with no animation changes in M3.
export function resolveGimmickAnimation({ kind, time = 0, hits = 4 } = {}) {
  return Object.freeze({ kind, time, hits, phase: Number.isFinite(time) ? time : 0 });
}
