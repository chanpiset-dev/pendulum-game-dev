const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process'),root=path.resolve(__dirname,'..');
const source=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const file of ['src/engine/environments.js','src/graphics/environment-registry.js','src/graphics/environment-renderer.js','src/graphics/parallax-system.js']){
 const r=spawnSync(process.execPath,['--check','--input-type=module'],{input:source(file),encoding:'utf8'});
 assert.equal(r.status,0,file+': '+r.stderr);
}
(async()=>{
 const url=p=>'data:text/javascript,'+encodeURIComponent(source(p));
 const regUrl=url('src/graphics/environment-registry.js'),parUrl=url('src/graphics/parallax-system.js');
 const registry=await import(regUrl),parallax=await import(parUrl);
 const code=source('src/graphics/environment-renderer.js').replace("'./environment-registry.js'",JSON.stringify(regUrl)).replace("'./parallax-system.js'",JSON.stringify(parUrl));
 const {renderEnvironment}=await import('data:text/javascript,'+encodeURIComponent(code));
 const chapters=[[1,40,'forest-ruins'],[41,80,'wind-sanctuary'],[81,110,'clockwork-hall'],[111,165,'portal-temple'],[166,210,'ancient-machinery'],[211,250,'celestial-chamber']];
 for(const [start,end,id] of chapters){assert.equal(registry.environmentIdForStage(start),id);assert.equal(registry.environmentIdForStage(end),id);}
 assert.equal(registry.environmentIdForStage('sandbox'),null);
 assert.equal(registry.environmentIdForStage(251),null);
 const calls=[],ctx={save(){calls.push('save')},restore(){calls.push('restore')},translate(x,y){calls.push(['translate',x,y])}};
 const options={index:1,reduced:true,targets:[{alive:true}],status:'playing'};
 const snapshot=JSON.stringify(options);
 const legacy=(c,w,h,o)=>{assert.equal(o,options);calls.push('legacy');return true;};
 assert.equal(renderEnvironment(ctx,1280,720,options,legacy),true);
 assert.deepEqual(calls,['legacy']);
 registry.registerEnvironmentRenderer('forest-ruins',()=>false);
 assert.equal(renderEnvironment(ctx,390,844,options,legacy),true);
 assert.deepEqual(calls.slice(-3),['save','restore','legacy']);
 let seen;
 registry.registerEnvironmentRenderer('forest-ruins',scene=>{seen=scene;return {layers:[{depth:0.5,offsetX:3,draw:()=>calls.push('layer')}],draw:()=>calls.push('world'),lighting:()=>calls.push('light'),effects:()=>calls.push('effect'),cameraX:20};});
 assert.equal(renderEnvironment(ctx,390,844,options,legacy),true);
 assert.deepEqual(calls.slice(-7),['save','save',['translate',3,0],'layer','restore','world','light'].concat(['effect','restore']).slice(-7)); 
 assert.equal(seen.width,390);assert.equal(seen.height,844);assert.equal(seen.reduced,true);
 assert.ok(Object.isFrozen(seen));assert.equal(JSON.stringify(options),snapshot);
 const layers=parallax.createParallaxLayers([{depth:0.5,draw:()=>{}}]);assert.ok(Object.isFrozen(layers));assert.ok(Object.isFrozen(layers[0]));
 registry.unregisterEnvironmentRenderer('forest-ruins');
 assert.equal(renderEnvironment(ctx,1280,720,options,legacy),true);
 console.log('M4 chapter switching, fallback, layers, reduced motion, resizing, mobile and isolation passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
