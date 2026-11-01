const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{let i=0;window.requestAnimationFrame=()=>++i;window.cancelAnimationFrame=()=>{};});
  await page.route('**/*',route=>{
   const url=new URL(route.request().url());if(url.hostname!=='game.test')return route.abort();
   const file=path.join(__dirname,'..',url.pathname==='/'?'index.html':url.pathname);
   let body=fs.readFileSync(file,'utf8');if(url.pathname==='/src/main.js')body+='\nwindow.testRun=code=>eval(code);';
   return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});
  });
  await page.goto('http://game.test');await page.waitForFunction(()=>window.testRun);
  const checks=await page.evaluate(()=>window.testRun(`(()=>{
   for(let s=1;s<=50;s++){
    loadStage(stageSubToIndex(s,1));const cfg=STAGE_CONFIGS[s];
    if(!document.getElementById('stageDisplay').textContent.includes('STAGE '+s+'-1'))throw new Error('Wrong label '+s);
    if(getComputedStyle($('f-N')).display!=='none'||getComputedStyle($('f-Count')).display!=='none')throw new Error('Stage configuration controls visible '+s);
    if(pulsesLeft!==(cfg.lockedParams?.pulses??3))throw new Error('Wrong pulse rules '+s);
    if(Boolean(document.getElementById('sliderVel').disabled)!==Boolean(cfg.lockVelocity))throw new Error('Wrong velocity lock '+s);
    if(Boolean(document.getElementById('sliderAngle').disabled)!==Boolean(cfg.lockAngle))throw new Error('Wrong angle lock '+s);
    if(cfg.lockedN&&Number(document.getElementById('sliderN').value)!==cfg.lockedN)throw new Error('Wrong chain lock '+s);
    if(cfg.lockedClone&&Number(document.getElementById('sliderCount').value)!==cfg.lockedClone)throw new Error('Wrong clone lock '+s);
    if(currentLives!==(cfg.shieldLives?2:1))throw new Error('Wrong shield rules '+s);
   }
   loadStage('sandbox');
   if($('f-N').hidden||$('f-Count').hidden||$('sliderN').disabled||$('sliderCount').disabled)throw new Error('Free Play controls unavailable');
   $('sliderN').value=4;$('sliderCount').value=3;initVisualsOnly();fire();
   if(systems.length!==3||systems.some(c=>c.N!==4))throw new Error('Free Play choices not applied');
   loadStage(stageSubToIndex(34,1));
   if(!$('f-N').hidden||!$('f-Count').hidden||systems.length!==2||systems[0].N!==2)throw new Error('Fixed stage rules not restored');
   loadStage(1);unlockedStageIndex=250;renderStageSelect();return true;
  })()`));assert.ok(checks);
  await page.addStyleTag({content:'* { transition: none !important; animation: none !important; }'});
  await page.evaluate(()=>window.testRun("$('titleScreen').classList.add('hidden');$('stageBriefing').classList.add('hidden');openStageSelectModal();$('journeyGridButton').click()"));
  assert.equal(await page.locator('.chapter-heading').count(),6);
  assert.equal(await page.locator('.stage-section-card').count(),50);
  assert.equal(await page.locator('.stage-btn').count(),250);
  assert.match(await page.locator('.chapter-heading').first().innerText(),/Basics & Collisions/);
  assert.match(await page.locator('.stage-section-header').first().innerText(),/Introductory/);
  const overflow=await page.locator('#stageGrid').evaluate(el=>el.scrollWidth>el.clientWidth+1);assert.equal(overflow,false);
  await page.screenshot({path:'/tmp/pendulum-chapters-mobile.png'});
  await page.evaluate(()=>window.testRun("setLanguage('ja');renderStageSelect()"));
  assert.match(await page.locator('.chapter-heading').first().innerText(),/基本と反射/);
  assert.match(await page.locator('.stage-section-header').first().innerText(),/入門/);
  await page.setViewportSize({width:1440,height:1000});
  assert.equal(await page.locator('#stageGrid').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
  await page.evaluate(()=>window.testRun('closeStageSelectModal()'));
  for(const [stage,expected] of [[3,'setup'],[7,'playing']]){
   const tip=await page.evaluate(stage=>window.testRun(`(()=>{
    loadStage(stageSubToIndex(${stage},1));$('stageBriefing').classList.add('hidden');
    const c=systems[0];let x=PIVOT.x,y=PIVOT.y;
    for(let k=0;k<c.N;k++){x+=120*c.L[k]*Math.sin(c.state[k]);y+=120*c.L[k]*Math.cos(c.state[k]);}
    const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/800,r.height/600);
    return {x:r.left+(r.width-800*scale)/2+x*scale,y:r.top+(r.height-600*scale)/2+y*scale};
   })()`),stage);
   await page.mouse.move(tip.x,tip.y);await page.mouse.down();await page.mouse.move(tip.x-10,tip.y+10);await page.mouse.up();
   assert.equal(await page.evaluate(()=>window.testRun('gameStatus')),expected,'Drag follows angle lock at new stage '+stage);
  }
  // New links use current numbering; unversioned links preserve legacy content.
  await page.goto('http://game.test/?stg=26&numbering=7');await page.waitForFunction(()=>window.testRun);
  assert.equal(await page.evaluate(()=>window.testRun('currentStageIndex')),26);
  await page.goto('http://game.test/?stg=26');await page.waitForFunction(()=>window.testRun);
  assert.equal(await page.evaluate(()=>window.testRun('currentStageIndex')),61);
  await page.goto('http://game.test/?stg=11&numbering=7&a=25&v=2');await page.waitForFunction(()=>window.testRun);
  assert.equal(await page.locator('#sliderAngle').inputValue(),'90','Shared parameters respect locked angles');
  assert.deepEqual(errors,[]);
  console.log('Chapter progression: all 50 labels/control rules, six chapters, 250 buttons, mobile/desktop, Japanese and legacy/current share links passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
