import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStageData, buildAuthoredStageData } from '../src/data/stage-index.js';
import { OBJECT_SCALE, BOB_MIN_RADIUS, BOB_MAX_RADIUS, BOB_GROWTH, enlargeStageObjects } from '../src/game-sizes.js';
const pivot = { x: 400, y: 300 };
test('All 250 stages enlarge circles without moving authored geometry or changing settings', () => {
  for (let stage = 1; stage <= 250; stage++) {
    const before = buildAuthoredStageData(stage, pivot), after = generateStageData(stage, pivot);
    for (const key of ['targets', 'obstacles', 'portals', 'switches', 'boostRings']) {
      assert.equal(after[key]?.length, before[key]?.length);
      for (let i=0;i<(before[key]?.length || 0);i++) {
        const source=before[key][i], enlarged=after[key][i];
        assert.equal(enlarged.r, source.r * OBJECT_SCALE);
        assert.deepEqual({...enlarged,r:source.r}, source);
        if (key==='targets'||key==='obstacles') assert.ok(enlarged.x-enlarged.r>=0 && enlarged.x+enlarged.r<=800 && enlarged.y-enlarged.r>=0 && enlarged.y+enlarged.r<=600, `Stage ${stage}: circle fits playfield`);
      }
    }
    for(const target of after.targets) for(const obstacle of after.obstacles) assert.ok(Math.hypot(target.x-obstacle.x,target.y-obstacle.y)+target.r>obstacle.r,`Stage ${stage}: target is not fully covered by bumper`);
    for(const key of ['wind','gravity','gravityInversionInterval','timeLimit','rail','zones','lasers']) assert.deepEqual(after[key],before[key]);
    const cores = value => !value ? [] : Array.isArray(value) ? value : [value];
    cores(after.blackhole).forEach((core,i)=>{const old=cores(before.blackhole)[i];assert.equal(core.coreRadius,old.coreRadius*OBJECT_SCALE);assert.equal(core.pullRadius,old.pullRadius);assert.ok(core.coreRadius+BOB_MIN_RADIUS<core.pullRadius);});
  }
});
test('Scaling leaves source data intact and does not accumulate on restart', () => {
  const source=buildAuthoredStageData(1,pivot), snapshot=JSON.stringify(source);
  enlargeStageObjects(source); assert.equal(JSON.stringify(source),snapshot);
  assert.deepEqual(generateStageData(1,pivot),generateStageData(1,pivot));
  assert.equal(BOB_MIN_RADIUS,21); assert.equal(BOB_MAX_RADIUS,54);
});

test("Bob growth per hit is half the original increment",()=>{assert.equal(BOB_GROWTH,2.25);assert.equal(BOB_MIN_RADIUS+6*BOB_GROWTH,34.5);});
