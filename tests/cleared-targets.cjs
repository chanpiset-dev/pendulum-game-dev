// A dead target must never be reintroduced by the hit effect, including replay's final frame.
const assert=require('node:assert/strict');
const {openVerification}=require('../scripts/verification-browser.cjs');
(async()=>{const {browser,page}=await openVerification();try{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const result=await page.evaluate(async()=>{
  const {drawGenericScene}=await import('/src/engine/renderer.js');
  const {refreshCanvasPalette}=await import('/src/themes.js');
  const canvas=document.createElement('canvas');canvas.width=300;canvas.height=250;const c=canvas.getContext('2d');
  document.documentElement.dataset.theme='clean-precision';refreshCanvasPalette();
  const render=targets=>{c.clearRect(0,0,300,250);drawGenericScene(c,[],targets,[],null,[],[],[],{x:150,y:20},null,[],[],[],[],[],{timeElapsed:10});return canvas.toDataURL()};
  const empty=render([]),target={x:150,y:130,r:30,hp:1,alive:false,artworkHitTime:10};
  return {empty,dead:render([target]),alive:render([{...target,alive:true}])};
 });
 assert.ok(result.dead===result.empty,'Recently cleared target is absent even when game time freezes at the hit');
 assert.ok(result.alive!==result.empty,'An unbroken target still renders');
 const report=require('../verification/solutions.json');
 for(const index of [64,250]){
  const solution=report.results.find(row=>row.index===index).solution;
  const state=await page.evaluate(solution=>{verificationAPI.start(solution);return verificationAPI.step(6000,true)},solution);
  assert.equal(state.confirmed,true);assert.equal(state.remaining,0);
 }
 assert.deepEqual(errors,[]);console.log('Cleared targets: frozen hit timestamp renders no ghost; 13-4 and 50-5 still reach STAGE CLEAR.');
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});
