// Opt-in verification runs use the real game, with session-only storage and fixed frames.
export const VERIFICATION_STEP = 1 / 60;
export function createMemoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key,value) => data.set(key,String(value)), removeItem: key => data.delete(key) };
}
export function createVerificationDriver(hooks) {
  let frame = 0, solution = null;
  function start(input) {
    if (!Number.isInteger(input.index) || input.index < 1 || input.index > 250) throw new Error('Invalid stage');
    if (!Number.isInteger(input.angle) || input.angle < -180 || input.angle > 180 || !Number.isFinite(input.velocity) || input.velocity < -15 || input.velocity > 15) throw new Error('Invalid launch settings');
    const pulses = input.pulses || [];
    if (!Array.isArray(pulses) || pulses.some((n,i) => !Number.isInteger(n) || n < 0 || (i && n <= pulses[i-1]))) throw new Error('Invalid pulse frames');
    solution = {...input,pulses:[...pulses]}; frame = 0;
    const actual = hooks.start(solution);
    if (actual.angle !== input.angle || actual.velocity !== input.velocity || pulses.length > actual.pulses) throw new Error('Solution violates stage restrictions');
    return status();
  }
  function status() { return {frame, wallTime: frame*VERIFICATION_STEP,...hooks.status()}; }
  function step(count=1, render=true) {
    if (!solution) throw new Error('Choose a solution first');
    if (!Number.isInteger(count) || count < 1 || count > 10000) throw new Error('Invalid frame count');
    for(let i=0;i<count;i++) {
      const state=hooks.status();
      if (state.ended || state.failed) break;
      if (solution.pulses.includes(frame)) hooks.pulse();
      hooks.update(VERIFICATION_STEP);frame++;
    }
    if(render)hooks.draw();
    return status();
  }
  return {start,step,status,draw:hooks.draw};
}
