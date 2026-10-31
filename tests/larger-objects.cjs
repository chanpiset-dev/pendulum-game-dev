const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>1;window.cancelAnimationFrame=()=>{};});
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='game.test')return route.abort();const file=path.join(__dirname,'..',u.pathname==='/'?'index.html':u.pathname);let body=fs.readFileSync(file,'utf8');if(u.pathname==='/src/main.js')body+='\nwindow.testRun=code=>eval(code);';return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});});
 await page.goto('http://game.test');await page.waitForFunction(()=>window.testRun);
 const size=await page.evaluate(()=>window.testRun('({bob:BOB_MIN_R,target:targets[0].r})'));
 assert.equal(size.bob,21);assert.equal(size.target,42);
 for(const distance of [50,52]){
  const result=await page.evaluate(distance=>window.testRun(`(()=>{loadStage(1);gameStatus='playing';systems=[{N:1,L:[1],m:[1],state:[0,0],alive:true,currentR:BOB_MIN_R,trail:[],color:{outer:'#23c878',inner:'#23c878'},railCooldown:0,portalCooldown:0,boostCooldown:0,interCooldown:0}];targets=[{x:PIVOT.x+${distance},y:PIVOT.y+PENDULUM_SCALE,r:30,alive:true,hp:1,maxHp:1}];obstacles=[];blackhole=null;currentWind=null;currentRail=null;currentPortals=[];currentSwitches=[];currentBoostRings=[];currentZones=[];currentLasers=[];update(0);return targets[0].alive;})()`),distance);
  assert.equal(result,distance===52,'Collision uses the enlarged bob and target radii');
 }
 for(const theme of ['neon-arcade','clean-precision']){
  await page.evaluate(theme=>window.testRun(`appearance.set(${JSON.stringify(theme)},'dark');loadStage(1);draw();`),theme);
  const center=await page.evaluate(()=>window.testRun('(()=>{const t=targets[0];return Array.from(ctx.getImageData(Math.round(t.x),Math.round(t.y),1,1).data).slice(0,3);})()'));
  if(theme==='neon-arcade') assert.ok(center.every(v=>v>190)); else assert.ok(center[0]>center[1]*1.3,'Enlarged enamel target has a red bullseye center');
 }
 assert.deepEqual(errors,[]);console.log('Larger objects passed: mobile bob/target sizes, matching new hit boundary and both artwork styles.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
