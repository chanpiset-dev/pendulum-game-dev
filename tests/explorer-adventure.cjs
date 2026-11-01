const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{requestAnimationFrame=()=>1;cancelAnimationFrame=()=>{};});
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='game.test')return route.abort();const file=path.join(__dirname,'..',u.pathname==='/'?'index.html':u.pathname);let body=fs.readFileSync(file,'utf8');if(u.pathname==='/src/main.js')body+='\nwindow.testRun=code=>eval(code);';return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});});
 await page.goto('http://game.test');await page.waitForFunction(()=>window.testRun);
 await page.click('#btnStartGame');await page.evaluate(()=>testRun("loadStage(5);$('stageBriefing').classList.add('hidden');draw()"));
 assert.equal(await page.locator('#skipCelebration').isVisible(),false);
 assert.match(await page.locator('#chamberPower').innerText(),/0 \/ \d+/);
 const physical=await page.evaluate(()=>testRun('JSON.stringify({systems,targets})'));
 await page.click('#btnSettings');await page.locator('#explorerBob').uncheck();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('pendulum_preferences_v1')).explorer),false);
 assert.equal(await page.evaluate(()=>testRun('JSON.stringify({systems,targets})')),physical);
 await page.locator('#explorerBob').check();await page.click('#settingsClose');
 // Exercise completion through the real scoring path, then skip only its presentation wait.
 await page.evaluate(()=>testRun("fire();timeElapsed=2;targets.forEach(t=>t.alive=false);update(0);draw()"));
 assert.equal(await page.locator('#skipCelebration').isVisible(),true);
 assert.match(await page.locator('#chamberPower').innerText(),/Heading home/);
 await page.click('#skipCelebration');await page.evaluate(()=>testRun('update(.016);draw()'));
 assert.equal(await page.evaluate(()=>testRun('gameStatus')),'end');
 assert.equal(await page.evaluate(()=>testRun('bestTimes.stage_1_sub_5')),2);
 assert.match(await page.locator('#chamberResult').innerText(),/2-1/);
 const records=await page.evaluate(()=>testRun('JSON.stringify({highScores,stageStars,bestTimes})'));
 await page.evaluate(()=>testRun('draw();draw()'));assert.equal(await page.evaluate(()=>testRun('JSON.stringify({highScores,stageStars,bestTimes})')),records);
 await page.evaluate(()=>testRun("setLanguage('ja')"));assert.match(await page.locator('#chamberResult').innerText(),/自由落下/);
 await page.click('#overlayBtn');assert.equal(await page.evaluate(()=>testRun('currentStageIndex')),6);
 await page.evaluate(()=>testRun("loadStage('sandbox');draw()"));assert.equal(await page.locator('#chamberHud').isVisible(),false);
 // Every style, small/large bob and multi-link/clone chapter render without mutating bodies.
 for(const theme of ['clean-precision','neon-arcade'])for(const index of [1,170,185,210,250])await page.evaluate(({theme,index})=>testRun(`document.documentElement.dataset.theme=${JSON.stringify(theme)};loadStage(${index});systems.forEach(s=>s.currentR=54);draw()`),{theme,index});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>testRun("loadStage(1);$('stageBriefing').classList.add('hidden');draw()"));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.reload();await page.waitForFunction(()=>window.testRun);assert.equal(await page.locator('#explorerBob').isChecked(),true);
 const drawings=await page.evaluate(async()=>{
   const {drawExplorer,setExplorerEnabled}=await import('/src/engine/explorer.js');
   const cv=document.createElement('canvas');cv.width=cv.height=160;const c=cv.getContext('2d');
   setExplorerEnabled(false);drawExplorer(c,80,80,54);const blank=cv.toDataURL();
   setExplorerEnabled(true);drawExplorer(c,80,80,54);const face=cv.toDataURL();let outside=false;
   const data=c.getImageData(0,0,160,160).data;for(let y=0;y<160;y++)for(let x=0;x<160;x++)if(Math.hypot(x-80,y-80)>55&&data[(y*160+x)*4+3])outside=true;
   return {different:blank!==face,outside};
 });assert.equal(drawings.different,true);assert.equal(drawings.outside,false);
 assert.deepEqual(errors,[]);console.log('Explorer adventure: preference persistence, physics isolation, gateway completion/skip, scoring, next-stage destination, Japanese, sandbox, styles, clones/links and mobile passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
