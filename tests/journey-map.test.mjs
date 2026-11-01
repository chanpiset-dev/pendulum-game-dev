import test from 'node:test';
import assert from 'node:assert/strict';
import {journeyRecord,explorerIndex} from '../src/journey-map.js';
const state=()=>({unlocked:7,scores:{stage_1_sub_1:0},times:{stage_1_sub_2:0},stars:{stage_1_sub_3:2}});
test('Journey recognizes score/time-only legacy clears and distinguishes locks from stars',()=>{
 const s=state();for(const i of [1,2,3])assert.equal(journeyRecord(i,s).cleared,true);
 assert.equal(journeyRecord(4,s).cleared,false);assert.equal(journeyRecord(7,s).locked,false);assert.equal(journeyRecord(8,s).locked,true);
 assert.equal(explorerIndex(s),4);assert.equal(journeyRecord(250,s).stage,50);
});
test('Explorer stays within unlocked stages and handles completed campaign',()=>{
 const s={unlocked:250,scores:{},times:{},stars:{}};
 for(let stage=1;stage<=50;stage++)for(let sub=1;sub<=5;sub++)s.stars[`stage_${stage}_sub_${sub}`]=3;
 assert.equal(explorerIndex(s),250);s.unlocked=5;assert.equal(explorerIndex(s),5);
});
