const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),source=p=>fs.readFileSync(path.join(root,p),'utf8');
const file='src/graphics/fantasy-environments.js';
const check=spawnSync(process.execPath,['--check','--input-type=module'],{input:source(file),encoding:'utf8'});assert.equal(check.status,0,check.stderr);
(async()=>{
 const regUrl='data:text/javascript,'+encodeURIComponent(source('src/graphics/environment-registry.js'));
 const parUrl='data:text/javascript,'+encodeURIComponent(source('src/graphics/parallax-system.js'));
 const reg=await import(regUrl),par=await import(parUrl);
 const worldUrl='data:text/javascript,'+encodeURIComponent(source(file).replace("'./environment-registry.js'",JSON.stringify(regUrl)).replace("'./parallax-system.js'",JSON.stringify(parUrl)));
 const worlds=await import(worldUrl);
 const rendererUrl='data:text/javascript,'+encodeURIComponent(source('src/graphics/environment-renderer.js').replace("'./environment-registry.js'",JSON.stringify(regUrl)).replace("'./parallax-system.js'",JSON.stringify(parUrl)));
 const {renderEnvironment}=await import(rendererUrl);
 assert.equal(worlds.FANTASY_ENVIRONMENT_IDS.length,6);
 assert.equal(worlds.createFantasyEnvironment('not-a-world'),null);
 for(const id of worlds.FANTASY_ENVIRONMENT_IDS)assert.equal(reg.getEnvironmentRenderer(id),null,'original remains default');
 const calls=[],ctx=new Proxy({
  save(){calls.push('save')},restore(){calls.push('restore')},scale(){},translate(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},arc(){},ellipse(){},fillRect(){},createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}
 },{set(t,k,v){t[k]=v;return true}});
 let legacy=0;const original=()=>{legacy++;return true};
 assert.equal(renderEnvironment(ctx,1280,720,{index:1},original),true);
 assert.equal(legacy,1);
 const undo=worlds.installFantasyEnvironments();
 for(let i=1;i<=250;i++){
  const id=reg.environmentIdForStage(i);assert.equal(typeof reg.getEnvironmentRenderer(id),'function');
  for(const [width,height] of [[1440,900],[390,844]]){
   for(const reduced of [true,false]){
    const opts=Object.freeze({index:i,reduced,cameraX:17,cameraY:-8,time:2.5});
    const before=JSON.stringify(opts),oldLegacy=legacy;
    assert.equal(renderEnvironment(ctx,width,height,opts,original),true);
    assert.equal(legacy,oldLegacy,'fantasy renderer used');
    assert.equal(JSON.stringify(opts),before,'scene options unchanged');
   }
  }
 }
 assert.equal(calls.filter(x=>x==='save').length,calls.filter(x=>x==='restore').length,'canvas state balanced');
 for(const id of worlds.FANTASY_ENVIRONMENT_IDS){
  const scene=Object.freeze({width:390,height:844,index:1,reduced:true,options:Object.freeze({cameraX:10,cameraY:10})});
  const w=worlds.createFantasyEnvironment(id)(scene);
  assert.equal(w.layers.length,3);assert.ok(Object.isFrozen(w.layers));assert.equal(w.cameraX,0);assert.equal(w.cameraY,0);
  const motion=worlds.createFantasyEnvironment(id)({...scene,reduced:false});
  assert.equal(motion.cameraX,10);assert.equal(motion.cameraY,10);
  assert.equal(worlds.createFantasyEnvironment(id)({...scene,width:0}),false);
 }
 const custom=()=>({});reg.registerEnvironmentRenderer('forest-ruins',custom);
 undo();
 assert.equal(reg.getEnvironmentRenderer('forest-ruins'),custom,'do not overwrite newer registrations');
 for(const id of worlds.FANTASY_ENVIRONMENT_IDS.filter(x=>x!=='forest-ruins'))assert.equal(reg.getEnvironmentRenderer(id),null,'legacy fallback restored');
 reg.unregisterEnvironmentRenderer('forest-ruins');
 assert.equal(renderEnvironment(ctx,1280,720,{index:1},original),true);
 assert.equal(legacy,2);
 console.log('M8 six opt-in worlds, all 250 layouts, desktop/mobile, parallax, reduced motion, lighting, isolation and fallback passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
