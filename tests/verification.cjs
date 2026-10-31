const assert=require('node:assert/strict');
const {openVerification}=require('../scripts/verification-browser.cjs');
(async()=>{
 const {browser,page}=await openVerification();
 try{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('pendulum_sub_unlocked_v7','40');
   localStorage.setItem('pendulum_stage_scores_v7','{"stage_1_sub_1":9876}');
   window.storageBefore=JSON.stringify(localStorage);
  });
  // Keep the interactive smoke test short; the batch verifier replays the full report.
  const fs=require('node:fs'),path=require('node:path');
  const report=JSON.parse(fs.readFileSync(path.join(__dirname,'../verification/solutions.json'),'utf8'));
  let sample={...report,results:report.results.filter(row=>[1,111,126,176].includes(row.index))};
  assert.equal(sample.results.filter(row=>row.status==='verified').length,4);
  await page.route('**/verification/solutions.json',route=>route.fulfill({body:JSON.stringify(sample),contentType:'application/json'}));
  await page.goto('https://game.test/verification/');await page.waitForFunction(()=>!document.getElementById('play').disabled);
  assert.match(await page.locator('#summary').innerText(),/4 \/ 250 substages verified/);
  assert.equal(await page.locator('#stage option').count(),250);
  await page.selectOption('#speed','4');await page.click('#play');
  await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Playing'));
  await page.click('#pause');
  const paused=await page.evaluate(()=>document.getElementById('game').contentWindow.verificationAPI.status().frame);
  await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,150)));
  assert.equal(await page.evaluate(()=>document.getElementById('game').contentWindow.verificationAPI.status().frame),paused);
  await page.click('#replay');
  await page.waitForFunction(()=>document.getElementById('game').contentWindow.verificationAPI.status().confirmed,null,{timeout:20000});
  await page.click('#all');
  await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('PLAY ALL complete'),null,{timeout:30000});
  const retained=await page.evaluate(()=>JSON.stringify(localStorage)===window.storageBefore);assert.ok(retained,'Verification cannot change real saves');
  await page.selectOption('#stage','2');assert.equal(await page.locator('#play').isDisabled(),true);
  assert.match(await page.locator('#status').innerText(),/Not searched yet/);
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  sample=report;
  await page.reload();await page.waitForFunction(()=>!document.getElementById('play').disabled);
  assert.match(await page.locator('#summary').innerText(),new RegExp(`${report.results.filter(r=>r.status==='verified').length} / 250 substages verified`));
  const unresolved=report.results.find(row=>row.status==='unresolved');
  if(unresolved){
   await page.selectOption('#stage',String(unresolved.index));
   assert.equal(await page.locator('#play').isDisabled(),true);
   assert.match(await page.locator('#status').innerText(),/No successful solution/);
  }
  // Stale solution reports must not play on changed physics.
  await page.route('**/src/physics.js',async route=>{const fs=require('node:fs');const body=fs.readFileSync(require('node:path').join(__dirname,'../src/physics.js'),'utf8')+'\n// changed';await route.fulfill({body,contentType:'text/javascript'});});
  await page.reload();await page.waitForFunction(()=>document.getElementById('summary').textContent.includes('different game version'));
  assert.equal(await page.locator('#play').isDisabled(),true);
  await page.unroute('**/src/physics.js');
  await page.goto('https://game.test/');
  await page.waitForFunction(()=>document.getElementById('btnStartGame'));
  assert.equal(await page.evaluate(()=>typeof window.verificationAPI),'undefined');
  assert.deepEqual(errors,[]);
  console.log('Verification viewer passed: full coverage report, four real clears, PLAY/PAUSE/REPLAY/PLAY ALL, untested labels, mobile sizing, untouched saves, stale-version blocking and no normal-game API.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
