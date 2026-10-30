// Integrate the authored wind curve so gusts reverse smoothly without phase jumps.
// This is a visual position only; it never changes forces or simulation state.
export function windFlowOffset(wind, elapsed) {
  const base = wind.fx ?? 0, amplitude = wind.amp ?? 0, speed = wind.speed ?? 0, phase = wind.phase ?? 0;
  const gust = amplitude > 0 ? speed !== 0
    ? amplitude * (Math.cos(phase) - Math.cos(speed * elapsed + phase)) / speed
    : amplitude * Math.sin(phase) * elapsed : 0;
  return 32 * (base * elapsed + gust);
}
