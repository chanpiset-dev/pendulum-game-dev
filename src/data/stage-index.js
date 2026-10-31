import { balanceStage } from './stage-balance.js';
import { enlargeStageObjects } from '../game-sizes.js';
// Aggregates stage builders and keeps the public generateStageData API stable.
import { indexToStageSub } from './stage-configs.js';

import { buildWorld as buildChapter1 } from './stage-builders/chapter1-basics.js';
import { buildWorld as buildChapter2 } from './stage-builders/chapter2-forces.js';
import { buildWorld as buildChapter3 } from './stage-builders/chapter3-anchors.js';
import { buildWorld as buildChapter4 } from './stage-builders/chapter4-gadgets.js';
import { buildWorld as buildChapter5 } from './stage-builders/chapter5-dynamics.js';
import { buildWorld as buildChapter6 } from './stage-builders/chapter6-mastery.js';

export function buildAuthoredStageData(stgIdx, BASE_PIVOT) {
  if (stgIdx === 'sandbox') {
    const hasRail = Math.random() < 0.5;
    const rail = hasRail ? { amp: 55 + Math.random() * 30, speed: 1.2 + Math.random() * 0.8, phase: 0, pulse: 0 } : null;
    const obs = [];
    const obsCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < obsCount; i++) {
      const a = -1.25 + (2.5 * (i / (obsCount - 1 || 1)));
      const d = 110 + (i % 3) * 55;
      const bx = BASE_PIVOT.x + Math.sin(a) * d;
      const by = BASE_PIVOT.y + Math.cos(a) * d;
      const moving = (i % 2 === 0);
      obs.push({
        baseX: bx, baseY: by, x: bx, y: by, r: 22, pulse: 0,
        ampX: moving ? 30 : 0, speed: 1.1 + (i % 3) * 0.35, phase: i * 1.1
      });
    }
    const tgs = [];
    const targetCount = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < targetCount; i++) {
      const a = -1.45 + (2.9 * (i / (targetCount - 1 || 1)));
      const d = 115 + (i % 4) * 40;
      const isBomb = Math.random() < 0.25;
      tgs.push({
        x: BASE_PIVOT.x + Math.sin(a) * d,
        y: BASE_PIVOT.y + Math.cos(a) * d,
        r: isBomb ? 24 : 18,
        alive: true,
        isBomb: isBomb
      });
    }
    return { maxN: 5, maxClone: 3, timeLimit: 9999, targets: tgs, obstacles: obs, blackhole: null, rail: rail };
  }

  const { stage, sub } = indexToStageSub(stgIdx);
  let result = null;
  if (stage >= 1 && stage <= 8) result = buildChapter1(stage, sub, BASE_PIVOT);
  else if (stage >= 9 && stage <= 16) result = buildChapter2(stage, sub, BASE_PIVOT);
  else if (stage >= 17 && stage <= 22) result = buildChapter3(stage, sub, BASE_PIVOT);
  else if (stage >= 23 && stage <= 33) result = buildChapter4(stage, sub, BASE_PIVOT);
  else if (stage >= 34 && stage <= 42) result = buildChapter5(stage, sub, BASE_PIVOT);
  else if (stage >= 43 && stage <= 50) result = buildChapter6(stage, sub, BASE_PIVOT);

  if (result) return balanceStage(result, stage, sub, BASE_PIVOT);
  return { maxN: 2, maxClone: 1, timeLimit: 14, targets: [], obstacles: [], blackhole: null, rail: null };
}

export function generateStageData(stgIdx, BASE_PIVOT) {
  return enlargeStageObjects(buildAuthoredStageData(stgIdx, BASE_PIVOT));
}
