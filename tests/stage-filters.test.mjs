import test from'node:test';import assert from'node:assert/strict';
import{getStageMechanics,matchesProgressFilter,MECHANIC_FILTERS}from'../src/stage-filters.js';
test('Progress filters distinguish locks, absent records, zero scores and legacy clears',()=>{
 assert.equal(matchesProgressFilter('uncleared',{locked:false,stars:0}),true);
 assert.equal(matchesProgressFilter('uncleared',{locked:true,stars:0}),false);
 for(const record of [{score:0},{time:0},{stars:1}]){assert.equal(matchesProgressFilter('uncleared',{locked:false,...record}),false);assert.equal(matchesProgressFilter('missing',{locked:false,...record}),true)}
 assert.equal(matchesProgressFilter('missing',{locked:false,score:100,stars:3}),false);
 assert.equal(matchesProgressFilter('missing',{locked:true,score:100,stars:1}),false);
 assert.equal(matchesProgressFilter('missing',{locked:false,stars:0}),false);
 assert.equal(matchesProgressFilter('all',{locked:true}),true);
});
test('Mechanic categories follow actual substage data and prescribed chain configurations',()=>{
 for(const[index,tag]of[[13,'bomb'],[31,'armored'],[111,'portal'],[116,'boost'],[126,'laser'],[81,'anchor'],[61,'blackhole'],[71,'repulsor'],[196,'gravity'],[156,'slime'],[159,'resin'],[39,'absorber'],[176,'multi'],[166,'clones']])assert.ok(getStageMechanics(index).includes(tag),`${index} ${tag}`);
 assert.ok(!getStageMechanics(1).includes('portal'));assert.ok(!getStageMechanics(1).includes('multi'));assert.ok(!getStageMechanics(1).includes('clones'));
 const ids=new Set(MECHANIC_FILTERS.map(r=>r[0]));for(let i=1;i<=250;i++){assert.ok(Object.isFrozen(getStageMechanics(i)));assert.ok(getStageMechanics(i).every(id=>ids.has(id)))}
});
