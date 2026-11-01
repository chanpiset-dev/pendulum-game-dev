import test from 'node:test';import assert from 'node:assert/strict';
import {captureHomecoming,homePose} from '../src/engine/homecoming.js';
test('Snapshot preserves bodies, clone colors and the final surviving tip',()=>{
 const systems=[{N:1,L:[1],state:[0,0],alive:false},{N:2,L:[1,1],state:[Math.PI/2,0,0,0],alive:true,currentR:25,color:{outer:'#aabbcc'}}];const before=JSON.stringify(systems);
 const snap=captureHomecoming(systems,{x:10,y:20},100,21);assert.equal(snap.length,1);assert.equal(snap[0].color,'#aabbcc');assert.equal(snap[0].x,110);assert.equal(snap[0].y,120);assert.equal(JSON.stringify(systems),before);
 systems[1].alive=false;assert.equal(captureHomecoming(systems,{x:0,y:0},100,21).length,1);
});
test('Home pose starts at the frozen tip and ends invisibly inside the shelter',()=>{
 const start={x:100,y:200};assert.deepEqual(homePose(start,1280,720,0),{x:100,y:200,alpha:1,scale:1});
 const end=homePose(start,1280,720,1.8);assert.equal(end.x,1048);assert.equal(end.y,548);assert.equal(end.alpha,0);
 const reduced=homePose(start,1280,720,.5,true);assert.equal(reduced.x,100);assert.equal(reduced.y,200);assert.equal(reduced.alpha,0);
});
