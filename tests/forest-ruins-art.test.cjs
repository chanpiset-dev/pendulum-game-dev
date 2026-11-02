const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const p of ['src/graphics/forest-ruins-art.js','src/graphics/fantasy-environments.js']){const r=spawnSync(process.execPath,['--check','--input-type=module'],{input:read(p),encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
(async()=>{
 const forest=await import('data:text/javascript,'+encodeURIComponent(read('src/graphics/forest-ruins-art.js')));
 const ctx=new Proxy({save(){this.depth++},restore(){this.depth--},depth:0,translate(){},scale(){},beginPath(){},arc(){},ellipse(){},lineTo(){},moveTo(){},closePath(){},fill(){},stroke(){},fillRect(){},createLinearGradient(){return{addColorStop(){}}},createRadialGradient(){return{addColorStop(){}}}},{set(t,k,v){t[k]=v;return true;}});
 for(let index=1;index<=250;index++)for(const [w,h] of [[1440,900],[390,844]])for(const reduced of [true,false]){
  const scene=Object.freeze({index,reduced,time:2.2,width:w,height:h}),before=JSON.stringify(scene);
  ctx.save();ctx.scale(w/1280,h/720);
  forest.drawForestDistance(ctx);forest.drawForestArchitecture(ctx);forest.drawForestAtmosphere(ctx,scene);
  ctx.restore();assert.equal(ctx.depth,0);assert.equal(JSON.stringify(scene),before);
 }
 const src=read('src/graphics/fantasy-environments.js');
 assert.ok(src.includes("if(id==='forest-ruins'){drawForestAtmosphere"));
 assert.ok(src.includes("if(id!=='forest-ruins')"));
 assert.ok(src.includes('drawForestDistance(c)')&&src.includes('drawForestArchitecture(c)'));
 console.log('M8 3B forest art: 250 layouts, mobile/desktop, reduced motion, balanced Canvas and isolation passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
