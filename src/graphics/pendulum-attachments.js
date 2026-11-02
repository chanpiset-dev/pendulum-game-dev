// Pure presentation coordinates derived from existing simulation state.
// No physics integration, collision updates or mutation of chain objects.
export function getPendulumAttachments(chain, pivot, scale, minRadius) {
  const result = [];
  let x = pivot.x, y = pivot.y;
  for (let i = 0; i < chain.N; i++) {
    const angle = chain.state[i];
    const nx = x + scale * chain.L[i] * Math.sin(angle);
    const ny = y + scale * chain.L[i] * Math.cos(angle);
    const tip = i === chain.N - 1;
    result.push(Object.freeze({
      x: nx, y: ny, angle,
      radius: tip ? (chain.currentR || minRadius) * (chain.popScale || 1) : undefined,
      isTip: tip, linkIndex: i
    }));
    x = nx; y = ny;
  }
  return result;
}
