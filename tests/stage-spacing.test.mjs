import test from 'node:test';import assert from 'node:assert/strict';
import {generateStageData}from'../src/data/stage-index.js';
import {STAGE_SPACING,applyStageSpacing}from'../src/data/stage-spacing.js';
import {auditStageSpacing}from'../scripts/audit-stage-spacing.mjs';
import {placePortalLabels}from'../src/engine/portal-labels.js';
test('All 250 layouts clear the audited artwork envelopes, patrol paths and beams',()=>{
 for(let i=1;i<=250;i++)assert.deepEqual(auditStageSpacing(generateStageData(i,{x:400,y:300})),[],`Substage ${Math.ceil(i/5)}-${(i-1)%5+1}`);
});
test('Spacing overrides preserve non-position data and follow the supplied pivot',()=>{
 const strip=value=>Array.isArray(value)?value.map(strip):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>!['x','y','baseX','baseY','x1','x2','y1','y2'].includes(key)).map(([k,v])=>[k,strip(v)])):value;
 for(const key of Object.keys(STAGE_SPACING)){const[stage,sub]=key.split('-').map(Number),data=generateStageData((stage-1)*5+sub,{x:400,y:300}),snapshot=strip(data);applyStageSpacing(data,stage,sub,{x:500,y:350});assert.deepEqual(strip(data),snapshot);assert.ok(data.targets.every(t=>t.r>0));}
});
test('Portal labels move away from another portal and keep Japanese identifiers',()=>{
 const ports=[{x:100,y:100,r:30,label:'IN 1'},{x:100,y:170,r:30,label:'OUT 1'}];
 const ctx={measureText:t=>({width:t.length*6})},circles=ports.map(p=>({...p,r:p.r*1.25,source:p}));
 const labels=placePortalLabels(ctx,ports,circles,[],300,300,true);
 assert.equal(labels[0].text,'入口 1');assert.equal(labels[1].text,'出口 1');assert.notEqual(labels[0].candidate,0);
 for(let i=0;i<labels.length;i++)for(let j=0;j<ports.length;j++)if(i!==j){const b=labels[i].box,p=ports[j];assert.ok(Math.hypot(p.x-Math.max(b.x,Math.min(b.x+b.w,p.x)),p.y-Math.max(b.y,Math.min(b.y+b.h,p.y)))>=37.5)}
});
