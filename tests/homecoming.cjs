const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{requestAnimationFrame=()=>1;cancelAnimationFrame=()=>{};});
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='game.test')return r.abort();const f=path.join(__dirname,'..',u.pathname==='/'?'index.html':u.pathname);let body=fs.readFileSync(f,'utf8');if(u.pathname==='/src/main.js')body+='\nwindow.homeQA=code=>eval(code);';return r.fulfill({body,contentType:f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':'text/html'});});
 await page.goto('http://game.test');await page.waitForFunction(()=>window.homeQA);await page.click('#btnStartGame');
 for(const index of [1,90,170,210,250]){
  await page.evaluate(index=>homeQA(`loadStage(${index});$('stageBriefing').classList.add('hidden');fire();targets.forEach(t=>t.alive=false);hitStopTimer=0;update(0);draw();`),index);
  const physical=await page.evaluate(()=>homeQA('JSON.stringify({systems,PIVOT,targets,obstacles,currentRail,timeElapsed,currentStageScore,pulsesLeft})'));
  assert.equal(await page.evaluate(()=>homeQA('homecoming.length>0')),true);
  await page.evaluate(()=>homeQA('update(.7);draw()'));
  assert.equal(await page.evaluate(()=>homeQA('JSON.stringify({systems,PIVOT,targets,obstacles,currentRail,timeElapsed,currentStageScore,pulsesLeft})')),physical);
  await page.evaluate(()=>homeQA('pauseGame();update(1)'));assert.equal(await page.evaluate(()=>homeQA('clearingTimer')),.7);
  await page.evaluate(()=>homeQA('togglePause();stopGameLoop();update(1.15);draw()'));
  assert.equal(await page.locator('#chamberPower').innerText(),'Home, sweet home!');
  if(index===1&&process.env.CAPTURE_HOME)await page.screenshot({path:'/workspace/output/pendulum-homecoming-game.png',fullPage:true});
  await page.click('#skipCelebration');await page.evaluate(()=>homeQA('update(.016);draw()'));
  assert.equal(await page.evaluate(()=>homeQA('gameStatus')),'end');
  if(index===1){await page.evaluate(()=>homeQA('openStageSelectModal()'));await page.click('#journeyFind');assert.match(await page.locator('#journeyPlay').innerText(),/1-2/);await page.click('#btnCloseMap');}
  const records=await page.evaluate(()=>homeQA('JSON.stringify({highScores,stageStars,bestTimes,unlockedStageIndex})'));await page.evaluate(()=>homeQA('update(1);draw()'));assert.equal(await page.evaluate(()=>homeQA('JSON.stringify({highScores,stageStars,bestTimes,unlockedStageIndex})')),records);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>homeQA("setEnvironmentsEnabled(false);loadStage(1);$('stageBriefing').classList.add('hidden');fire();targets.forEach(t=>t.alive=false);hitStopTimer=0;update(0);update(2);draw();setLanguage('ja')"));assert.equal(await page.locator('#chamberPower').innerText(),'おかえりなさい！');
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>homeQA('draw()'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.evaluate(()=>homeQA("loadStage('sandbox');draw()"));assert.equal(await page.evaluate(()=>homeQA('homecoming')),null);
 assert.deepEqual(errors,[]);console.log('Homecoming: frozen successful state, moving anchor, clones, entry/arrival, pause, skip, single awards, final stage, reduced motion, environment-off, Japanese and mobile passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
