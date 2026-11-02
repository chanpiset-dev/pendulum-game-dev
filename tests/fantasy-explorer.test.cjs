const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),src=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const p of ['src/graphics/fantasy-explorer.js','src/graphics/character-renderer.js']){
 const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:src(p),encoding:'utf8'});
 assert.equal(result.status,0,p+result.stderr);
}
(async()=>{
 const fantasyUrl='data:text/javascript,'+encodeURIComponent(src('src/graphics/fantasy-explorer.js'));
 const {fantasyExplorerFrame,drawFantasyExplorer}=await import(fantasyUrl);
 for(const [expression,state] of [['ready','idle'],['focused','swinging'],['impact','impact'],['happy','celebration']]){
  const frame=fantasyExplorerFrame({animation:{expression,time:0.5},radius:4});
  assert.equal(frame.state,state);assert.equal(frame.radius,4);assert.ok(Object.isFrozen(frame));
 }
 const events=[],ctx={save(){events.push('save')},restore(){events.push('restore')},translate(){},rotate(){},scale(){},beginPath(){},moveTo(){},quadraticCurveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},arc(){},fillRect(){}};
 const attachment=Object.freeze({x:10,y:15,radius:4,isTip:true});
 assert.equal(drawFantasyExplorer(ctx,attachment,{animation:{expression:'happy',time:2},radius:3}),true);
 assert.deepEqual(events,['save','restore']);assert.equal(drawFantasyExplorer(ctx,{...attachment,isTip:false}),false);
 // Resolve module imports as data URLs so Node can execute browser ESM files.
 const animationUrl='data:text/javascript,'+encodeURIComponent(src('src/graphics/character-animation.js'));
 const explorerUrl='data:text/javascript,'+encodeURIComponent('export function drawExplorer(ctx,x,y,r,o){globalThis.__legacy?.(x,y,r,o)}');
 const spriteUrl='data:text/javascript,'+encodeURIComponent('export function drawExplorerSprite(){return false}');
 const code=src('src/graphics/character-renderer.js').replace("'./fantasy-explorer.js'",JSON.stringify(fantasyUrl)).replace("'./explorer-sprite-renderer.js'",JSON.stringify(spriteUrl)).replace("'./character-animation.js'",JSON.stringify(animationUrl)).replace("'../engine/explorer.js'",JSON.stringify(explorerUrl));
 const mod=await import('data:text/javascript,'+encodeURIComponent(code));
 let legacy=0;globalThis.__legacy=()=>legacy++;
 assert.equal(mod.getCharacterSkin(),'legacy');
 mod.drawCharacter(ctx,attachment,{mood:'ready'});assert.equal(legacy,1);
 mod.setCharacterSkin('fantasy-explorer');
 mod.drawCharacter(ctx,attachment,{mood:'happy'});assert.equal(legacy,1);
 const chain=[{...attachment,isTip:false},{...attachment,isTip:true}];
 for(const link of chain)mod.drawCharacter(ctx,link,{mood:'focused'});
 assert.equal(legacy,1);
 const clone=Object.freeze({...attachment,x:60});mod.drawCharacter(ctx,clone,{mood:'impact',popScale:1.2});
 assert.equal(legacy,1);
 mod.setCharacterSkin('missing-skin');mod.drawCharacter(ctx,attachment);assert.equal(legacy,2);
 mod.registerCharacterSkin('fallback',()=>false);mod.setCharacterSkin('fallback');mod.drawCharacter(ctx,attachment);assert.equal(legacy,3);
 mod.setCharacterSkin('legacy');assert.equal(mod.getCharacterSkin(),'legacy');
 assert.equal(attachment.x,10);
 console.log('M6 animation states, small-scale drawing, clones, multi-link tips, canvas isolation and legacy fallback passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
