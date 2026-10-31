import { STAGE_CONFIGS } from '../src/data/stage-configs.js';
const $=id=>document.getElementById(id);
let report,api,active=null,running=false,all=false,frameId=null,last=0,accumulator=0,ready=false;
const results=()=>report.results.filter(r=>r.status==='verified'&&r.solution);
function stop(){running=false;cancelAnimationFrame(frameId);frameId=null;}
function entry(){return report.results.find(r=>r.index===Number($('stage').value));}
function select(){
 stop();all=false;active=entry();
 const verified=active?.status==='verified'&&active.solution;
 $('play').disabled=$('replay').disabled=!verified;
 $('pause').disabled=true;
 $('status').textContent=verified?'Ready to play a verified solution.':active?'No successful solution found within the search budget.':'Not searched yet.';
 $('details').textContent=verified?`Angle: ${active.solution.angle}° · Initial angular velocity: ${active.solution.velocity} · Pulses: ${active.solution.pulses.length?active.solution.pulses.map(n=>(n*report.step).toFixed(2)+'s').join(', '):'none'} · Clear time: ${active.solution.clearTime.toFixed(2)}s`:'No saved solution for this substage.';
 if(verified){api.start(active.solution);api.draw();}else $('game').style.visibility='hidden';
 if(verified)$('game').style.visibility='visible';
}
function play(reset=false){
 if(!ready||!active?.solution)return;
 if(reset||api.status().ended||api.status().failed)api.start(active.solution);
 stop();running=true;last=performance.now();accumulator=0;$('pause').disabled=false;
 frameId=requestAnimationFrame(tick);
}
function tick(now){
 if(!running)return;
 accumulator+=Math.min(.1,(now-last)/1000)*Number($('speed').value);last=now;
 let state=api.status();
 while(accumulator>=report.step&&!state.ended&&!state.failed){state=api.step(1,false);accumulator-=report.step;}
 api.draw();$('status').textContent=`${state.confirmed?'STAGE CLEAR':state.cleared?'Stage cleared — confirming result…':state.failed?'Verification failed': 'Playing'} · ${state.wallTime.toFixed(1)}s · ${state.remaining} targets remaining`;
 if(state.ended||state.failed){
  stop();$('pause').disabled=true;
  if(!state.confirmed){all=false;$('status').textContent='Saved solution did not reproduce a clear. Run the search again for this game version.';return;}
  if(all){const list=results(),next=list[list.findIndex(r=>r.index===active.index)+1];if(next){$('stage').value=next.index;select();all=true;play(true);return;}all=false;$('status').textContent='PLAY ALL complete — every saved solution reached STAGE CLEAR.';}
 }else frameId=requestAnimationFrame(tick);
}
async function verifyEngine(){
 const chunks=[];
 for(const file of report.engineFiles){const response=await fetch('../'+file,{cache:'no-store'});if(!response.ok)throw new Error('Cannot verify game source');chunks.push(file,await response.text());}
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(chunks.join('')));
 if([...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('')!==report.engine)throw new Error('Saved solutions belong to a different game version. Rerun the search before playback.');
}
async function init(){
 const response=await fetch('solutions.json',{cache:'no-store'});if(!response.ok)throw new Error('No saved solution report yet.');report=await response.json();
 if(report.schema!==1||report.step!==1/60||!Array.isArray(report.engineFiles))throw new Error('Unsupported solution report');
 await verifyEngine();
 api=await new Promise((resolve,reject)=>{let tries=0;const timer=setInterval(()=>{const candidate=$('game').contentWindow?.verificationAPI;if(candidate){clearInterval(timer);resolve(candidate);}else if(++tries>200){clearInterval(timer);reject(new Error('Game did not finish loading.'));}},50);});
 const count=results().length;$('summary').textContent=`${count} / 250 substages verified · ${report.results.length-count} unresolved · ${250-report.results.length} not searched`;
 for(let index=1;index<=250;index++){const row=report.results.find(r=>r.index===index),option=document.createElement('option');option.value=index;option.textContent=`${Math.ceil(index/5)}-${(index-1)%5+1} · ${STAGE_CONFIGS[Math.ceil(index/5)].name} · ${row?.status||'not searched'}`;$('stage').appendChild(option);}
 const table=document.createElement('table'),head=table.createTHead().insertRow();for(const label of ['Substage','Result','Attempts']){const th=document.createElement('th');th.textContent=label;head.appendChild(th);}
 for(const row of report.results){const tr=table.insertRow();for(const value of [`${row.stage}-${row.sub}`,row.status,row.attempts])tr.insertCell().textContent=value;}$('coverage').appendChild(table);
 ready=true;$('stage').disabled=false;$('all').disabled=!count;$('stage').value=results()[0]?.index||1;select();
}
$('stage').addEventListener('change',select);
$('play').addEventListener('click',()=>play());$('replay').addEventListener('click',()=>{all=false;play(true);});
$('pause').addEventListener('click',()=>{stop();$('status').textContent='PAUSED';});
$('all').addEventListener('click',()=>{if(!ready||!results().length)return;$('stage').value=results()[0].index;select();all=true;play(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();$('status').textContent='PAUSED — press PLAY to continue.';}});
init().catch(error=>{$('summary').textContent=error.message;$('status').textContent='Playback unavailable.';});
