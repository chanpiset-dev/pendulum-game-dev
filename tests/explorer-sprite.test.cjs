const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const p of ['src/graphics/explorer-assets.js','src/graphics/explorer-animation.js','src/graphics/explorer-sprite-renderer.js','src/graphics/character-renderer.js']){const r=spawnSync(process.execPath,['--check','--input-type=module'],{input:read(p),encoding:'utf8'});assert.equal(r.status,0,p+r.stderr);}
const svg=read('assets/explorer/fantasy-explorer-sprites.svg');assert.equal((svg.match(/translate\(/g)||[]).length,5);
(async()=>{
 const animation=await import('data:text/javascript,'+encodeURIComponent(read('src/graphics/explorer-animation.js')));
 for(const [expression,state] of [['ready','idle'],['focused','swinging'],['impact','impact'],['happy','celebration'],['homecoming','homecoming']]){
  const f=animation.explorerSpriteFrame({expression,time:1.2});assert.equal(f.state,state);assert.ok(Object.isFrozen(f));
  const reduced=animation.explorerSpriteFrame({expression,time:1.2,reducedMotion:true});assert.equal(reduced.bob,0);assert.equal(reduced.sway,0);
 }
 const spriteUrl='data:text/javascript,'+encodeURIComponent(read('src/graphics/explorer-sprite-renderer.js').replace("'./explorer-assets.js'",JSON.stringify('data:text/javascript,'+encodeURIComponent('export function getExplorerSheet(){return {width:640,height:128}}'))).replace("'./explorer-animation.js'",JSON.stringify('data:text/javascript,'+encodeURIComponent(read('src/graphics/explorer-animation.js')))));
 const sprite=await import(spriteUrl);
 const calls=[],ctx={save(){calls.push('save')},restore(){calls.push('restore')},translate(){},rotate(){},drawImage(...args){calls.push(args)}};
 for(let i=1;i<=250;i++)for(const [w,h] of [[1440,900],[390,844]]){
  const a=Object.freeze({x:w/2,y:h/2,radius:Math.min(w,h)/40,isTip:true,linkIndex:2});
  const before=JSON.stringify(a);assert.equal(sprite.drawExplorerSprite(ctx,a,{radius:a.radius,animation:{expression:'focused',time:i}}),true);assert.equal(JSON.stringify(a),before);
  assert.equal(sprite.drawExplorerSprite(ctx,{...a,isTip:false}),false);
 }
 assert.equal(calls.filter(x=>x==='save').length,calls.filter(x=>x==='restore').length);
 console.log('M9 1B: 5 states, 250 layouts, desktop/mobile, immutable attachment, reduced motion, clone-tip and canvas isolation passed');
})().catch(e=>{console.error(e);process.exitCode=1});
