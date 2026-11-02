const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),source=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const p of ['src/graphics/fantasy-gimmicks.js','src/graphics/gimmick-registry.js']){
 const r=spawnSync(process.execPath,['--check','--input-type=module'],{input:source(p),encoding:'utf8'});assert.equal(r.status,0,p+': '+r.stderr);
}
(async()=>{
 const regUrl='data:text/javascript,'+encodeURIComponent(source('src/graphics/gimmick-registry.js'));
 const mod=await import('data:text/javascript,'+encodeURIComponent(source('src/graphics/fantasy-gimmicks.js').replace("'./gimmick-registry.js'",JSON.stringify(regUrl))));
 const registry=await import(regUrl);
 assert.equal(mod.FANTASY_GIMMICK_IDS.length,new Set(Object.values(registry.GIMMICK_VISUALS)).size);
 for(const id of mod.FANTASY_GIMMICK_IDS)assert.equal(registry.getGimmickSkin(id),null,'legacy remains default '+id);
 const undo=mod.installFantasyGimmickSkins();
 const events=[],ctx=new Proxy({save(){events.push('save')},restore(){events.push('restore')},translate(){},scale(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},arc(){},fillRect(){}},{set(t,k,v){t[k]=v;return true}});
 const props=Object.freeze({kind:'armored',visualId:'shielded-diamond',x:5,y:6,radius:8,hits:2,animation:Object.freeze({phase:2})});
 const snapshot=JSON.stringify(props);
 for(const id of mod.FANTASY_GIMMICK_IDS) {
   const fn=registry.getGimmickSkin(id);assert.equal(typeof fn,'function',id);
   for(const radius of [3,8,24,48,120]){
     const p={...props,visualId:id,radius};
     assert.equal(fn(ctx,p),true,id+' '+radius);
   }
 }
 for(const hits of [0,1,2,4,8])assert.equal(mod.fantasyGimmickFrame({...props,hits}).hits,hits);
 assert.equal(mod.fantasyGimmickFrame({time:Infinity,radius:0}).radius,1);
 assert.ok(Object.isFrozen(mod.fantasyGimmickFrame(props)));
 assert.equal(mod.drawFantasyGimmick(ctx,{...props,visualId:'unknown'}),false);
 assert.equal(JSON.stringify(props),snapshot);
 assert.equal(events.filter(x=>x==='save').length,events.filter(x=>x==='restore').length,'balanced canvas state');
 // Multi-object scenes and clone locations must not change original inputs.
 for(const x of [10,20,30])mod.drawFantasyGimmick(ctx,Object.freeze({...props,x}));
 const custom=()=>true;registry.registerGimmickSkin('magic-diamond',custom);
 undo();
 assert.equal(registry.getGimmickSkin('magic-diamond'),custom,'uninstall must not clobber later skin');
 for(const id of mod.FANTASY_GIMMICK_IDS.filter(id=>id!=='magic-diamond'))assert.equal(registry.getGimmickSkin(id),null);
 registry.unregisterGimmickSkin('magic-diamond');
 console.log('M7 all mapped gimmicks, animation/hit states, 5 scales, multi-object isolation, opt-in and safe fallback passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
