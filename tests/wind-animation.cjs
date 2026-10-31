const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
  const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.requestAnimationFrame=()=>1;window.cancelAnimationFrame=()=>{};});
  await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname!=='game.test')return route.abort();const file=path.join(__dirname,'..',url.pathname==='/'?'index.html':url.pathname);let body=fs.readFileSync(file,'utf8');if(url.pathname==='/src/main.js')body+='\nwindow.testRun=code=>eval(code);';return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});});
  await page.goto('http://game.test');await page.waitForFunction(()=>window.testRun);
  for(const theme of ['neon-arcade','clean-precision']){
    const result=await page.evaluate(theme=>window.testRun(`(()=>{
      appearance.set(${JSON.stringify(theme)},'dark');loadStage(stageSubToIndex(9,5));
      const snapshot=()=>JSON.stringify({systems,targets,currentWind,pulsesLeft,highScores,stageStars});
      const pixels=()=>Array.from(ctx.getImageData(0,85,800,45).data).join(',');
      timeElapsed=0;draw();const first=pixels(), state=snapshot();timeElapsed=0.5;draw();const second=pixels();
      const unchanged=state===snapshot();gameStatus='paused';const frozen=pixels();update(1);draw();
      return {moving:first!==second,paused:frozen===pixels(),unchanged};
    })()`),theme);
    assert.equal(result.moving,true,theme+': wind changes pixels during play');
    assert.equal(result.paused,true,theme+': paused wind stays frozen');
    assert.equal(result.unchanged,true,'Rendering must not change forces, physics or progress');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches,null,{polling:50});
  assert.equal(await page.evaluate(()=>window.testRun(`(()=>{const pixels=()=>Array.from(ctx.getImageData(0,85,800,45).data).join(',');timeElapsed=0;draw();const first=pixels();timeElapsed=0.5;draw();return first===pixels();})()`)),true,'Reduced motion keeps wind arrows stationary');
  await page.evaluate(()=>window.testRun('currentWind.currentFx=0;currentWind.fx=3;draw()'));
  assert.deepEqual(errors,[]);
  console.log('Wind animation passed in both art styles: visible flow, pause freeze, reduced-motion fallback, zero-force rendering and unchanged physics/saves.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
