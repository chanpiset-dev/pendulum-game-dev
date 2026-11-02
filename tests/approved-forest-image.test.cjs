const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),src=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const p of ['src/graphics/forest-image.js','src/graphics/fantasy-environments.js']){
 const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:src(p),encoding:'utf8'});
 assert.equal(result.status,0,p+result.stderr);
}
assert.ok(fs.statSync(path.join(root,'forest-stair-free.png')).size>100000);
(async()=>{
 const code=src('src/graphics/forest-image.js').replace("new URL('../../forest-stair-free.png', import.meta.url).href",JSON.stringify('/forest-stair-free.png'));
 let pending;
 global.Image=class {set src(v){this.path=v;pending=this;} get naturalWidth(){return 1648;} get naturalHeight(){return 928;}};
 const mod=await import('data:text/javascript,'+encodeURIComponent(code));
 assert.equal(mod.approvedForestImageReady(),false);
 assert.equal(pending.path,'/forest-stair-free.png');
 pending.onload();
 assert.equal(mod.approvedForestImageReady(),true);
 const calls=[],ctx={drawImage(...args){calls.push(args)}};
 assert.equal(mod.drawApprovedForestImage(ctx,390,844),true);
 assert.equal(mod.drawApprovedForestImage(ctx,1440,900),true);
 assert.equal(mod.drawApprovedForestImage(ctx,0,900),false);
 assert.equal(calls.length,2);
 assert.ok(calls.every(x=>x.length===5));
 const fantasy=src('src/graphics/fantasy-environments.js');
 assert.ok(fantasy.includes("if(id==='forest-ruins' && approvedForestImageReady())"));
 console.log('M9 1C.1 image loading, responsive scaling, static parallax, fallback, canvas independence passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
