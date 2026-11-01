const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{requestAnimationFrame=()=>1;cancelAnimationFrame=()=>{}});await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='game.test')return r.abort();const f=path.join(__dirname,'..',u.pathname==='/'?'index.html':u.pathname);let body=fs.readFileSync(f,'utf8');if(u.pathname==='/src/main.js')body+='\nwindow.feedbackQA=code=>eval(code);';r.fulfill({body,contentType:f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html'})});await p.goto('http://game.test');await p.waitForFunction(()=>window.feedbackQA);
for(const lang of ['en','ja'])for(const cause of ['time','laser','blackhole']){
 const result=await p.evaluate(({lang,cause})=>feedbackQA(`(()=>{
 loadStage(1);$('titleScreen').classList.add('hidden');$('stageBriefing').classList.add('hidden');$('overlay').classList.remove('active');setLanguage(${JSON.stringify(lang)});
 obstacles=[];currentRail=null;currentWind=null;currentZones=[];currentPortals=[];currentSwitches=[];currentBoostRings=[];currentLasers=[];blackhole=null;
 const n=${JSON.stringify(cause)}==='time'?2:${JSON.stringify(cause)}==='laser'?3:1;
 targets=Array.from({length:n},()=>({x:10,y:10,r:3,hp:1,alive:true}));
 systems=[{N:1,L:[1],m:[1],state:[0,0],alive:true,currentR:BOB_MIN_R,popScale:1,trail:[],color:{outer:'#23c878'},railCooldown:0,portalCooldown:0,boostCooldown:0,interCooldown:0}];gameStatus='playing';timeElapsed=0;timeScale=1;
 if(${JSON.stringify(cause)}==='time'){systems=[];timeElapsed=timeLimit;update(0)}
 if(${JSON.stringify(cause)}==='laser'){currentLives=1;maxLives=1;laserCooldown=0;currentLasers=[{x1:PIVOT.x-50,y1:PIVOT.y+120,x2:PIVOT.x+50,y2:PIVOT.y+120}];update(0)}
 if(${JSON.stringify(cause)}==='blackhole'){blackhole={x:PIVOT.x+10,y:PIVOT.y+120,coreRadius:25,pullRadius:100,pullStrength:1};update(0);for(let i=0;i<110;i++)update(1/60)}
 return {cause:$('overlay').dataset.failureCause,title:$('overlayTitle').textContent,description:$('overlayDesc').textContent,status:gameStatus,retry:$('overlayBtn').textContent};
})()`),{lang,cause});
 assert.equal(result.cause,cause);assert.equal(result.status,'end');assert.match(result.retry,/RETRY/);assert.match(result.description,lang==='en'?/targets? remaining\./:/残りターゲットは[123]個です。/);assert.doesNotMatch(result.description,/開始設定|Launch settings|中心/);
 await p.evaluate(()=>feedbackQA("setLanguage(currentLang==='en'?'ja':'en')"));assert.match(await p.locator('#overlayDesc').textContent(),lang==='en'?/残りターゲット/:/remaining/);
 await p.evaluate(()=>feedbackQA("loadStage(1);$('stageBriefing').classList.add('hidden');showOverlay(I18N[currentLang].stageClear,'Score: +1','NEXT STAGE',true,3)"));assert.equal(await p.locator('#overlay').getAttribute('data-failure-cause'),null);
}
assert.deepEqual(errors,[]);console.log('Failure feedback: real timeout, laser and final-bob capture paths; bilingual counts, live language refresh and clean success overlays passed.');}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
