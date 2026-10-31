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
  await page.addStyleTag({content:'* {transition:none!important;animation:none!important}'});
  for(const [width,height,language,theme] of [[1440,1000,'en','neon-arcade'],[390,844,'en','clean-precision'],[844,390,'en','clean-precision'],[390,844,'ja','clean-precision']]){
   await page.setViewportSize({width,height});
   await page.evaluate(({language,theme})=>window.testRun(`setLanguage('${language}');appearance.set('${theme}','dark')`),{language,theme});
   const result=await page.evaluate(()=>window.testRun(`(()=>{
    startTutorial(); const initial={pivot:{...tutState.pivot},width:tutCanvas.width,bottom:$('btnTutorialDone').getBoundingClientRect().top,reach:tutState.chain.L.reduce((a,b)=>a+b)*120,bombs:tutState.targets.filter(t=>t.isBomb).length,bumpers:tutState.obstacles.length};
    const before=JSON.stringify(localStorage);let bomb=false,bumper=false,resets=0,prev=0;
    for(let i=0;i<1100;i++){
     loopTutorial(tutLastTime+16);
     bomb ||= tutState.bombTriggered;bumper ||= tutState.bumperTriggered;
     if(tutState.timeElapsed<prev)resets++;prev=tutState.timeElapsed;
    }
    return {...initial,bomb,bumper,resets,unchanged:before===JSON.stringify(localStorage),guideBottom:document.querySelector('.tutorial-guide').getBoundingClientRect().bottom};
   })()`));
   console.log(width,height,language,{bomb:result.bomb,bumper:result.bumper,resets:result.resets});
   assert.equal(result.bombs,1);assert.equal(result.bumpers,1);assert.ok(result.bomb,'Bomb detonates');assert.ok(result.bumper,'Bumper is contacted');assert.ok(result.resets>0,'Demo loops');assert.ok(result.unchanged);assert.ok(result.pivot.y-result.reach>result.guideBottom);assert.ok(result.pivot.y+result.reach<result.bottom);assert.equal(result.width,width);
  }
  await page.screenshot({path:'/tmp/tutorial-demo-landscape.png'});
  assert.deepEqual(errors,[]);
  console.log('Tutorial layout and live bomb/bumper demonstration pass across desktop, phone and landscape.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
