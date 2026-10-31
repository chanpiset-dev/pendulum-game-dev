// Independently replay every saved successful solution through the real clear overlay.
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const {openVerification,root}=require('./verification-browser.cjs');
(async()=>{
 const report=JSON.parse(fs.readFileSync(path.join(root,'verification/solutions.json'),'utf8'));
 assert.equal(report.schema,1);assert.equal(report.step,1/60);
 const fingerprint=crypto.createHash('sha256');for(const file of report.engineFiles){assert.ok(file.startsWith('src/')&&!file.includes('..'));fingerprint.update(file).update(fs.readFileSync(path.join(root,file)));}
 assert.equal(fingerprint.digest('hex'),report.engine,'Solutions must match current simulation sources');
 const seen=new Set();for(const row of report.results){assert.ok(!seen.has(row.index));seen.add(row.index);assert.ok(row.index>=1&&row.index<=250);assert.equal(row.stage,Math.ceil(row.index/5));assert.equal(row.sub,(row.index-1)%5+1);if(row.status!=='verified')assert.equal(row.solution,null);}
 const {browser,page}=await openVerification();
 try{
  let count=0;
  for(const row of report.results.filter(r=>r.status==='verified')){
   const state=await page.evaluate(solution=>{const api=window.verificationAPI;api.start(solution);return api.step(6000,false);},row.solution);
   assert.equal(state.confirmed,true,`${row.stage}-${row.sub} must reach STAGE CLEAR`);
   assert.equal(state.frame,row.solution.frames,`${row.stage}-${row.sub} timing must reproduce`);
   assert.equal(state.remaining,0);assert.equal(state.index,row.index);
   if(++count%25===0)console.log(`${count} saved solutions independently replayed`);
  }
  console.log(`Passed: ${count} verified solutions replayed; ${report.results.length-count} unresolved; ${250-report.results.length} not searched.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
