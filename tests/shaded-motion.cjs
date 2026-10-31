// Nonessential shading animation follows playback time and reduced-motion changes.
const assert=require('node:assert/strict');
const {openVerification}=require('../scripts/verification-browser.cjs');
(async()=>{const {browser,page}=await openVerification();try{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const compare=()=>page.evaluate(async()=>{
  const {drawGenericScene}=await import('/src/engine/renderer.js');
  const {refreshCanvasPalette}=await import('/src/themes.js');
  document.documentElement.dataset.theme='clean-precision';refreshCanvasPalette();
  const canvas=document.createElement('canvas');canvas.width=500;canvas.height=350;const c=canvas.getContext('2d');
  const portal={x:130,y:170,r:33,targetId:2,label:'IN'};
  const hole={x:340,y:170,coreRadius:30,pullRadius:70};
  const render=time=>{c.clearRect(0,0,500,350);drawGenericScene(c,[],[],[],hole,[],[],[],{x:250,y:50},null,[portal],[],[],[],[],{timeElapsed:time});return canvas.toDataURL()};
  return [render(0),render(2)];
 });
 await page.emulateMedia({reducedMotion:'no-preference'});let images=await compare();assert.notEqual(images[0],images[1],'Portal interiors and infall animate with game time');
 await page.emulateMedia({reducedMotion:'reduce'});images=await compare();assert.equal(images[0],images[1],'Reduced motion freezes decorative animation');
 assert.deepEqual(errors,[]);console.log('Shaded animation: game-time motion and live reduced-motion preference passed.');
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});
