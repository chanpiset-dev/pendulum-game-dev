const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const {performance}=require('node:perf_hooks');
const roots={base:path.resolve(__dirname,'../.m5-baseline'),feature:path.resolve(__dirname,'..')};
const cases=[1,41,81,111,166,211,250];
const browserPath=process.env.CHROMIUM_PATH||'/usr/bin/chromium';
(async()=>{
 const browser=await chromium.launch({executablePath:browserPath,args:['--no-sandbox']});
 try {
  const snapshots={};
  for(const [variant,root] of Object.entries(roots)){
   snapshots[variant]={};
   for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{requestAnimationFrame=()=>1;cancelAnimationFrame=()=>{};});
    await page.route('**/*',route=>{
     const u=new URL(route.request().url());if(u.hostname!=='game.test')return route.abort();
     const file=path.join(root,u.pathname==='/'?'index.html':u.pathname);
     if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html'))return route.abort();
     let body=fs.readFileSync(file,'utf8');
     if(u.pathname==='/src/main.js')body+='\nwindow.m5Run=code=>eval(code);';
     return route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});
    });
    await page.goto('http://game.test');await page.waitForFunction(()=>window.m5Run);
    const measurements=await page.evaluate(async({cases})=>{
     const out={stages:[],frames:{},state:{},dimensions:{}};
     const state=()=>JSON.stringify({systems,targets,obstacles,blackhole,currentPortals,currentSwitches,currentBoostRings,currentZones,currentLasers,currentRail,PIVOT,timeElapsed,pulsesLeft,highScores,stageStars});
     const canvasEl=document.getElementById('canvas');
     for(let i=1;i<=250;i++){
      loadStage(i);const before=state();draw();if(state()!==before)throw new Error('Drawing changed simulation at '+i);
      out.stages.push({i,N:systems.map(s=>s.N),targets:targets.length,obstacles:obstacles.length});
     }
     for(const index of cases){
      loadStage(index);$('stageBriefing').classList.add('hidden');$('titleScreen').classList.add('hidden');
      const before=state(),start=performance.now();for(let k=0;k<3;k++)draw();
      const elapsed=performance.now()-start;
      if(state()!==before)throw new Error('Simulation mutation at '+index);
      out.state[index]=before;out.frames[index]=canvasEl.toDataURL('image/png');
      out.dimensions[index]=[canvasEl.width,canvasEl.height];
      out['elapsed'+index]=elapsed;
     }
     return out;
    },{cases});
    assert.deepEqual(errors,[],variant+' '+label+' page errors');
    snapshots[variant][label]=measurements;
    await page.close();
   }
  }
  for(const label of ['desktop','mobile']){
   const a=snapshots.base[label],b=snapshots.feature[label];
   assert.deepEqual(b.stages,a.stages,'250 stage layouts '+label);
   assert.deepEqual(b.state,a.state,'physics/gameplay state '+label);
   assert.deepEqual(b.dimensions,a.dimensions,'canvas dimensions '+label);
   for(const index of cases){
    assert.equal(b.frames[index],a.frames[index],'pixel-identical screenshot '+label+' stage '+index);
   }
  }
  console.log('M5: 250 stage layouts, simulation snapshots and 14 pixel-identical canvas captures across desktop/mobile passed.');
  console.log('Representative draw timing (3 frames, milliseconds):',JSON.stringify(Object.fromEntries(['desktop','mobile'].map(label=>[label,cases.map(i=>({stage:i,base:snapshots.base[label]['elapsed'+i],feature:snapshots.feature[label]['elapsed'+i]}))]))));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
