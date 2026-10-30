import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStageData } from '../src/data/stage-index.js';
import {
  TOTAL_STAGES, SUBSTAGES_PER_STAGE, STAGE_ORDER, STAGE_CONFIGS,
  indexToStageSub, stageSubToIndex,
} from '../src/data/stage-configs.js';

const pivot = { x: 400, y: 300 };
const stageData = (stage, sub) => generateStageData(stageSubToIndex(stage, sub), pivot);

test('Stage 41 has constant upward gravity in all five substages', () => {
  for (let sub = 1; sub <= 5; sub++) {
    const data = stageData(41, sub);
    assert.equal(data.gravity, -9.8);
    assert.equal(data.gravityInversionInterval ?? 0, 0);
    assert.equal(data.lockedN, 4);
    assert.equal(STAGE_CONFIGS[41].lockedParams.pulses, 0);
  }
});

test('Stage 50 exposes the authored wind only in substages 3–5', () => {
  for (const sub of [1, 2]) assert.equal(stageData(50, sub).wind, null);
  assert.deepEqual(stageData(50, 3).wind, {
    fx: 1.8, amp: 0, speed: 0, phase: 0, currentFx: 1.8,
  });
  assert.deepEqual(stageData(50, 4).wind, {
    fx: 0, amp: 2.2, speed: 1.5, phase: 0, currentFx: 0,
  });
  assert.deepEqual(stageData(50, 5).wind, {
    fx: 0, amp: 2.6, speed: 1.6, phase: 0, currentFx: 0,
  });
});

test('Stage 31 retains its periodic gravity inversion', () => {
  for (let sub = 1; sub <= 5; sub++) {
    const data = stageData(31, sub);
    assert.equal(data.gravity ?? 9.8, 9.8);
    assert.equal(data.gravityInversionInterval, 3.6 - sub * 0.2);
  }
});

test('All 50 stages and 250 substages retain valid, sequential layouts', () => {
  assert.equal(TOTAL_STAGES, 50);
  assert.equal(SUBSTAGES_PER_STAGE, 5);
  assert.deepEqual(STAGE_ORDER, Array.from({ length: 50 }, (_, i) => i + 1));
  for (let stage = 1; stage <= TOTAL_STAGES; stage++) {
    assert.ok(STAGE_CONFIGS[stage]);
    for (let sub = 1; sub <= SUBSTAGES_PER_STAGE; sub++) {
      const info = indexToStageSub(stageSubToIndex(stage, sub));
      assert.equal(info.stage, stage);
      assert.equal(info.sub, sub);
      const data = stageData(stage, sub);
      assert.ok(Number.isFinite(data.timeLimit) && data.timeLimit > 0);
      assert.ok(data.targets.length > 0);
      for (const target of data.targets) {
        assert.ok(Number.isFinite(target.x) && Number.isFinite(target.y));
        assert.ok(Number.isFinite(target.r) && target.r > 0);
        assert.equal(target.alive, true);
      }
    }
  }
});
