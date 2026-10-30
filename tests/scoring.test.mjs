import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStageStars } from '../src/scoring.js';
const score = overrides => calculateStageStars({ startingPulses: 3, pulsesLeft: 1, timeRemaining: 3.5, timeLimit: 10, ...overrides });
test('Locked-pulse stages can earn three stars at the speed threshold', () => {
  assert.deepEqual(score({ startingPulses: 0, pulsesLeft: 0 }), { stars: 3, pulseBonus: true, speedBonus: true });
  assert.equal(score({ startingPulses: 0, pulsesLeft: 0, timeRemaining: 3.49 }).stars, 2);
});
test('Available pulses must be conserved for the pulse bonus', () => {
  assert.equal(score({ pulsesLeft: 0 }).stars, 2);
  assert.equal(score({ pulsesLeft: 0, timeRemaining: 0 }).stars, 1);
  assert.equal(score({ timeRemaining: 0 }).stars, 2);
  assert.equal(score({}).stars, 3);
});
