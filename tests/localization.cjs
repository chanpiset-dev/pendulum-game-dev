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
  await page.evaluate(()=>window.testRun(`$('titleScreen').classList.add('hidden');loadStage(1);$('stageBriefing').classList.add('hidden');fire();attemptReplay.capture(.2,true);attemptReplay.finish();loadStage(246);setLanguage('ja')`));
  assert.equal(await page.locator('#btnHints').innerText(),'ヒント');
  assert.equal(await page.locator('#btnReplay').innerText(),'直前のプレイを再生');
  await page.evaluate(()=>window.testRun("$('btnReplay').click()"));
  assert.equal(await page.locator('#replayTitle').innerText(),'直前のプレイ');
  assert.equal(await page.locator('#replaySpeedLabel').innerText(),'再生速度');
  assert.equal(await page.locator('#replaySeek').getAttribute('aria-label'),'再生位置');
  assert.equal(await page.locator('#replayClose').innerText(),'閉じる');
  assert.match(await page.locator('#replayDescription').innerText(),/STAGE 1-1.*初撃必中/);
  assert.doesNotMatch(await page.locator('#replayDialog').innerText(),/Silent replay|Kept until|Replay position|音声は/);
  assert.match(await page.locator('#replayTime').innerText(),/秒/);
  assert.equal(await page.locator('#replayPlay').innerText(),'PLAY');
  await page.locator('#replayPlay').click();assert.equal(await page.locator('#replayPlay').innerText(),'PAUSE');
  await page.evaluate(()=>window.testRun("setLanguage('en')"));
  assert.match(await page.locator('#replayDescription').innerText(),/STAGE 1-1.*FIRST SWING/);
  assert.equal(await page.locator('#replayClose').innerText(),'CLOSE');
  await page.evaluate(()=>window.testRun("$('replayDialog').close();setLanguage('ja');loadStage(1);bestTimes.stage_1_sub_1=4.25;renderStageSelect();openStageSelectModal()"));
  assert.equal(await page.locator('#bestTimesNote').innerText(),'クリア毎に最速タイムを更新');
  assert.equal(await page.locator('#btnJumpFurthest').innerText(),'解放済みの最終ステージへ');
  assert.match(await page.locator('#stageButton_1').innerText(),/最速: 4.25秒/);
  assert.match(await page.locator('#stageButton_1').innerText(),/現在選択中/);
  assert.match(await page.locator('#stageButton_1').getAttribute('aria-label'),/星/);
  assert.equal(await page.locator('html').getAttribute('lang'),'ja');
  await page.evaluate(()=>window.testRun("closeStageSelectModal();showSaveStatus({kind:'error',message:'error'})"));
  assert.match(await page.locator('#saveStatus').innerText(),/進行状況を保存/);
  const labels=await page.evaluate(()=>window.testRun(`(()=>{
    loadStage(stageSubToIndex(23,1));const texts=[],original=ctx.fillText;
    ctx.fillText=function(text,...args){texts.push(text);return original.call(this,text,...args)};
    try{appearance.set('clean-precision','dark');draw()}finally{ctx.fillText=original;}
    return texts;
  })()`));assert.ok(labels.some(t=>t.includes('入口')));assert.ok(labels.some(t=>t.includes('出口')));
  assert.equal(await page.locator('#btnFire').innerText(),'▶ PLAY');
  assert.equal(await page.locator('#pauseIndicator').innerText(),'PAUSED');
  await page.evaluate(()=>window.testRun("setLanguage('en');renderStageSelect()"));
  assert.equal(await page.locator('#btnHints').innerText(),'HINTS');
  assert.equal(await page.locator('#bestTimesNote').innerText(),'Best times are recorded for new clears.');
  assert.deepEqual(errors,[]);
  console.log('Localization: Japanese/English replay, recorded stage identity, preserved English controls, removed text, exact requested wording, portal labels, save errors and accessibility passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
