import test from 'node:test';import assert from 'node:assert/strict';
import {JOURNEY_WORLDS,journeyComposition} from '../src/journey-map-art.js';
import {CHAPTERS} from '../src/data/chapters.js';
test('Each chapter has an approved palette, landmarks and curved responsive route',()=>{
 assert.equal(JOURNEY_WORLDS.length,6);
 for(const ch of CHAPTERS)for(const mobile of [false,true]){
  const count=ch.end-ch.start+1,c=journeyComposition(count,mobile);
  assert.equal(c.points.length,count);assert.match(c.path,/ C/);
  for(const [x,y]of c.points){assert.ok(x>=10&&x<=90);assert.ok(y>=15&&y<=85);}
 }
 assert.deepEqual(journeyComposition(8).points[0],[13.75,79.17]);
 assert.equal(journeyComposition(8).path,'M110 570 C230 570 135 400 265 425 S440 560 420 380 S240 240 350 230 S540 350 550 225 S590 165 655 150');
});
