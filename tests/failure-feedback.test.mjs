import test from 'node:test';import assert from 'node:assert/strict';
import {getFailureFeedback}from'../src/failure-feedback.js';
test('Approved failure wording and dynamic counts in English and Japanese',()=>{
 assert.deepEqual(getFailureFeedback('time',2,'en'),{title:'Time ran out.',description:'2 targets remaining.'});
 assert.equal(getFailureFeedback('time',1,'en').description,'1 target remaining.');
 assert.equal(getFailureFeedback('time',2,'ja').description,'残りターゲットは2個です。');
 assert.equal(getFailureFeedback('laser',3,'en').title,'No shield lives left.');
 assert.equal(getFailureFeedback('laser',3,'ja').description,'球がレーザーに触れ、最後のシールドライフを失いました。\n残りターゲットは3個です。');
 assert.equal(getFailureFeedback('blackhole',1,'en').description,'Your last active bob entered the black-hole core.\n1 target remaining.');
 assert.equal(getFailureFeedback('blackhole',1,'ja').description,'最後に残った球がブラックホールに入りました。\n残りターゲットは1個です。');
 for(const cause of ['time','laser','blackhole'])for(const lang of ['en','ja']){const f=getFailureFeedback(cause,2,lang);assert.doesNotMatch(f.description,/RETRY|開始設定|中心/);}
});
