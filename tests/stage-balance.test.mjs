import { LEGACY_STAGE_IDS } from '../src/data/stage-migration.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStageData } from '../src/data/stage-index.js';
import { STAGE_ORDER } from '../src/data/stage-configs.js';
import { BOB_MAX_RADIUS } from '../src/game-sizes.js';
const get=(s,u)=>generateStageData((LEGACY_STAGE_IDS[s]-1)*5+u,{x:400,y:300});
const hp=d=>d.targets.filter(t=>!t.isBomb).reduce((n,t)=>n+(t.hp||1),0);
test('Flagged stationary passages fit the fully grown bob with clearance',()=>{
 for(const [s,u] of [[4,3],[4,4],[11,4],[11,5],[16,5],[38,2],[46,4]]){
  const {obstacles}=get(s,u);
  for(let a=0;a<obstacles.length;a++)for(let b=a+1;b<obstacles.length;b++){
   const x=obstacles[a],y=obstacles[b];
   assert.ok(Math.hypot(x.x-y.x,x.y-y.y)-x.r-y.r>=2*BOB_MAX_RADIUS+4,`${s}-${u}`);
  }
 }
});
test('Rebalanced challenge workloads increase gradually at flagged transitions',()=>{
 for(const [s,u] of [[27,5],[28,5],[31,5],[46,4],[50,4]]){
  assert.ok(hp(get(s,u))<=hp(get(s,u-1))+6);
  assert.ok(get(s,u).timeLimit>=get(s,u-1).timeLimit+4);
 }
 assert.ok(hp(get(46,4))<=hp(get(46,5)));
});
test('Introductions are uncluttered and orbit teaching precedes orbital combinations',()=>{
 for(const s of [9,15,26,34]){assert.equal(get(s,1).obstacles.length,0);assert.ok(get(s,1).targets.length<=3);}
 for(let s=1;s<39;s++)for(let u=1;u<=5;u++){const r=get(s,u).rail;assert.ok(!(r?.ampX>0&&r?.ampY>0));}
 for(let u=1;u<=5;u++)assert.equal(get(35,u).portals.length,2);
 assert.equal(get(47,1).gravity,0);
 assert.notDeepEqual(get(50,1).targets,get(35,1).targets);
 assert.deepEqual(STAGE_ORDER,Array.from({length:50},(_,i)=>i+1));
});
test('Every substage has valid targets, portal destinations and repeatable fresh data',()=>{
 for(let s=1;s<=50;s++)for(let u=1;u<=5;u++){
  const d=get(s,u);assert.ok(d.targets.some(t=>!t.isBomb));assert.ok(d.timeLimit>0);
  for(const p of d.portals||[])if(p.targetId)assert.ok(d.portals.some(q=>q.id===p.targetId));
  assert.deepEqual(d,get(s,u));
 }
});
