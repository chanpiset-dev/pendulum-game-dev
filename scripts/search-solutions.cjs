// Run: node scripts/search-solutions.cjs --indices=all --budget=150
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const {openVerification,root}=require('./verification-browser.cjs');
const arg=(name,fallback)=>process.argv.find(s=>s.startsWith(`--${name}=`))?.split('=')[1]??fallback;
(async()=>{
 const requested=arg('indices','1,111,126,176');
 const indices=requested==='all'?Array.from({length:250},(_,i)=>i+1):requested.split(',').map(Number),budget=Number(arg('budget','150'));
 if(indices.some(n=>!Number.isInteger(n)||n<1||n>250)||!Number.isInteger(budget)||budget<1)throw new Error('Invalid search arguments');
 const {STAGE_CONFIGS}=await import('../src/data/stage-configs.js');
 const files=['src/main.js','src/physics.js','src/game-sizes.js','src/data/stage-balance.js','src/data/stage-configs.js','src/data/stage-index.js','src/engine/collisions.js','src/verification.js',...fs.readdirSync(path.join(root,'src/data/stage-builders')).map(n=>'src/data/stage-builders/'+n)];
 const fingerprint=crypto.createHash('sha256');for(const file of files.sort())fingerprint.update(file).update(fs.readFileSync(path.join(root,file)));
 const engine=fingerprint.digest('hex');
 const output=path.join(root,'verification/solutions.json');
 let previous={results:[]};if(fs.existsSync(output))previous=JSON.parse(fs.readFileSync(output));
 const report={schema:1,engine,engineFiles:files.sort(),step:1/60,generatedAt:new Date().toISOString(),scope:'Bounded search; unresolved means no repeatable clear found within the search budget, not impossible.',results:previous.engine===engine?previous.results:[]};
 const seedPath=path.resolve(root,arg('seeds','verification/seeds.json'));
 const seeds=fs.existsSync(seedPath)?JSON.parse(fs.readFileSync(seedPath,'utf8')):[];
 if(!Array.isArray(seeds))throw new Error('Seed file must contain an array of solutions');
 const {browser,page}=await openVerification();
 try{
  for(const index of indices){
   const cfg=STAGE_CONFIGS[Math.ceil(index/5)];
   const candidates=[];
   for(const pulseFrames of [[],[60,150,270],[30,100,210],[120,240,420]])for(const velocity of [0,2,4,-2,6,-4,10,-10])for(const angle of [120,-120,90,-90,150,-150,60,-60,180,30,-30,0]){
    if(cfg.lockAngle&&angle!==90||cfg.lockVelocity&&velocity!==0||pulseFrames.length>(cfg.lockedParams?.pulses??3))continue;
    candidates.push({index,angle,velocity,pulses:pulseFrames});
   }
   // Interleave pulse schedules so a bounded pilot includes assisted attempts.
   const schedules=[[],[60],[60,150,270]];
   for(let i=0;i<candidates.length;i++) if(i%3&&!(cfg.lockedParams?.pulses===0))candidates[i].pulses=schedules[i%3];
   candidates.unshift(...seeds.filter(seed=>seed.index===index));
   let best=null,solution=null,attempts=0;
   for(const candidate of candidates.slice(0,budget)){
    const result=await page.evaluate(candidate=>{const api=window.verificationAPI;api.start(candidate);return api.step(6000,false);},candidate);
    attempts++;if(!best||result.remaining<best.remaining)best=result;
    if(result.confirmed){
     // Require an independent rerun through the same real clear overlay.
     const repeated=await page.evaluate(candidate=>{const api=window.verificationAPI;api.start(candidate);return api.step(6000,false);},candidate);
     if(repeated.confirmed&&repeated.frame===result.frame){solution={...candidate,frames:result.frame,clearTime:result.time};break;}
    }
    if(attempts%25===0)console.log(`${index}: ${attempts} attempts; best ${best.remaining} targets left`);
   }
   const entry={index,stage:Math.ceil(index/5),sub:(index-1)%5+1,name:cfg.name,status:solution?'verified':'unresolved',attempts,bestRemaining:best?.remaining,solution};
   report.results=report.results.filter(r=>r.index!==index).concat(entry).sort((a,b)=>a.index-b.index);
   fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(`${entry.stage}-${entry.sub}: ${entry.status} (${attempts} attempts)`);
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
