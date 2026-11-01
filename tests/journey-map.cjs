const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{requestAnimationFrame=()=>1;cancelAnimationFrame=()=>{};if(!sessionStorage.seeded){localStorage.setItem('pendulum_sub_unlocked_v7','18');localStorage.setItem('pendulum_stage_scores_v7',JSON.stringify(Object.fromEntries(Array.from({length:17},(_,i)=>[`stage_${Math.floor(i/5)+1}_sub_${i%5+1}`,0]))));localStorage.setItem('pendulum_stage_stars_v7','{"stage_1_sub_1":2}');sessionStorage.seeded='1';}});
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='game.test')return route.abort();const f=path.join(__dirname,'..',u.pathname==='/'?'index.html':u.pathname);let body=fs.readFileSync(f,'utf8');if(u.pathname==='/src/main.js')body+='\nwindow.mapQA=code=>eval(code);';return route.fulfill({body,contentType:f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':'text/html'});});
 await page.goto('http://game.test');await page.waitForFunction(()=>window.mapQA);await page.click('#btnStartGame');await page.evaluate(()=>mapQA("$('stageBriefing').classList.add('hidden');openStageSelectModal()"));
 const saved=await page.evaluate(()=>JSON.stringify(localStorage)),physics=await page.evaluate(()=>mapQA('JSON.stringify({systems,targets,PIVOT,currentStageIndex,gameStatus,timeElapsed})'));
 const artwork=await page.evaluate(async()=>{
   const results=[];for(let chapter=1;chapter<=6;chapter++){const image=new Image();image.src=`/src/assets/journey/chapter-${chapter}.svg`;await image.decode();results.push(image.naturalWidth>0);}return results;
 });assert.deepEqual(artwork,[true,true,true,true,true,true]);
 const approvedColors=await page.locator('.journey-disc').first().evaluate(el=>({border:getComputedStyle(el).borderTopColor,bg:getComputedStyle(el).backgroundColor}));
 assert.equal(approvedColors.border,'rgb(174, 188, 141)');assert.equal(approvedColors.bg,'rgb(62, 96, 83)');
 assert.equal(await page.locator('#journeyContent').isVisible(),true);assert.equal(await page.locator('[data-journey-stage]').count(),8);
 assert.equal(await page.locator('[data-journey-stage="4"] .journey-explorer').count(),1);
 assert.equal(await page.locator('#journeySubs button').count(),5);
 await page.locator('[data-journey-stage="1"]').click();assert.match(await page.locator('[data-journey-stage="1"]').innerText(),/2 \/ 15/);
 await page.locator('[data-journey-sub="1"]').click();assert.match(await page.locator('#journeyHint').innerText(),/missing stars/);
 for(const [i,count] of [8,8,6,11,9,8].entries()){await page.locator('#journeyChapters button').nth(i).click();assert.equal(await page.locator('[data-journey-stage]').count(),count);}
 const accessible=await page.evaluate(()=>{const found=new Set();for(let chapter=0;chapter<6;chapter++){document.querySelectorAll('#journeyChapters button')[chapter].click();const stages=[...document.querySelectorAll('[data-journey-stage]')].map(b=>b.dataset.journeyStage);for(const stage of stages){document.querySelector(`[data-journey-stage="${stage}"]`).click();for(const index of [...document.querySelectorAll('[data-journey-sub]')].map(b=>b.dataset.journeySub)){document.querySelector(`[data-journey-sub="${index}"]`).click();found.add(+index);}}}return found.size;});assert.equal(accessible,250);
 await page.locator('[data-journey-stage="50"]').click();assert.equal(await page.locator('#journeyPlay').isDisabled(),true);
 await page.click('#journeyFind');assert.match(await page.locator('#journeyPlay').innerText(),/4-3/);
 await page.click('#journeyGridButton');assert.equal(await page.locator('#stageGrid').isVisible(),true);await page.click('#filterMissing');assert.equal(await page.locator('.stage-btn').count(),17);
 await page.click('#journeyMapButton');assert.equal(await page.locator('#stageGrid').isVisible(),false);await page.click('#journeyGridButton');assert.equal(await page.locator('#filterMissing').getAttribute('aria-pressed'),'true');
 await page.click('#journeyMapButton');await page.click('#btnJumpCurrent');assert.equal(await page.locator('#journeyPlay').isDisabled(),false);
 await page.evaluate(()=>mapQA("setLanguage('ja')"));assert.equal(await page.locator('#journeyMapButton').innerText(),'冒険マップ');
 await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('.modal-body').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 // Native keyboard selection and focus survive rerendering.
 await page.locator('[data-journey-stage="4"]').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'journeyStageTitle');
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),saved.replace('"pendulum_lang":"en"','"pendulum_lang":"ja"'));
 assert.equal(await page.evaluate(()=>mapQA('JSON.stringify({systems,targets,PIVOT,currentStageIndex,gameStatus,timeElapsed})')),physics);
 await page.locator('[data-journey-sub="18"]').click();await page.click('#journeyPlay');assert.equal(await page.evaluate(()=>mapQA('currentStageIndex')),18);await page.waitForSelector('#stageBriefing',{state:'visible'});assert.equal(await page.locator('#mapModal').evaluate(e=>e.classList.contains('active')),false);
 assert.deepEqual(errors,[]);console.log('Journey map: six chapters, 250 substage access, legacy records, stars, locks, explorer, grid filters, Japanese, keyboard, mobile, unchanged state until PLAY passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
