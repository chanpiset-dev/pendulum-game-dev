import test from 'node:test';
import assert from 'node:assert/strict';
import { windFlowOffset } from '../src/engine/wind-flow.js';
test('Steady wind flows in its force direction and stronger winds travel faster', () => {
  assert.equal(windFlowOffset({fx: 2}, 1), 64);
  assert.equal(windFlowOffset({fx: -2}, 1), -64);
  assert.equal(windFlowOffset({fx: 4}, 1), 128);
  assert.equal(windFlowOffset({fx: 0}, 100), 0);
});
test('Gust flow reverses smoothly with the wind curve', () => {
  const wind = { fx: 0, amp: 2, speed: 1, phase: 0 };
  assert.equal(windFlowOffset(wind, 0), 0);
  assert.ok(windFlowOffset(wind, 2) > windFlowOffset(wind, 1));
  assert.ok(windFlowOffset(wind, 5) < windFlowOffset(wind, 4));
  assert.ok(Math.abs(windFlowOffset(wind, Math.PI*2)) < 1e-8);
  assert.equal(windFlowOffset({fx: 1, amp: 2, speed: 0, phase: Math.PI/2}, 1), 96);
});
