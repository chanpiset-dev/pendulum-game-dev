const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const file of ['src/engine/artwork.js','src/graphics/gimmick-registry.js','src/graphics/gimmick-renderer.js','src/graphics/gimmick-animation.js']){
  const r=spawnSync(process.execPath,['--check','--input-type=module'],{input:fs.readFileSync(path.join(root,file),'utf8'),encoding:'utf8'});
  assert.equal(r.status,0,file+': '+r.stderr);
}
(async()=>{
  const source=file=>fs.readFileSync(path.join(root,file),'utf8');
  const registry=await import('data:text/javascript,'+encodeURIComponent(source('src/graphics/gimmick-registry.js')));
  const animation=await import('data:text/javascript,'+encodeURIComponent(source('src/graphics/gimmick-animation.js')));
  // Load the renderer through a data URL with its relative imports rewritten.
  const regUrl='data:text/javascript,'+encodeURIComponent(source('src/graphics/gimmick-registry.js'));
  const animUrl='data:text/javascript,'+encodeURIComponent(source('src/graphics/gimmick-animation.js'));
  const rendererCode=source('src/graphics/gimmick-renderer.js')
    .replace("'./gimmick-registry.js'",JSON.stringify(regUrl))
    .replace("'./gimmick-animation.js'",JSON.stringify(animUrl));
  const renderModule=await import('data:text/javascript,'+encodeURIComponent(rendererCode));
  // Use the renderer's registry instance to verify registration and fallback.
  const registration=await import(regUrl);
  assert.equal(registry.visualIdForGimmick('bomb'),'chain-crystal');
  assert.equal(registry.visualIdForGimmick('target'),'magic-diamond');
  assert.equal(registry.visualIdForGimmick('armored'),'shielded-diamond');
  assert.equal(registry.visualIdForGimmick('portal-in'),'ancient-portal');
  assert.equal(registry.visualIdForGimmick('spring'),'enchanted-spring');
  assert.equal(registry.visualIdForGimmick('bumper'),'enchanted-bumper');
  assert.equal(registry.visualIdForGimmick('unknown'),'unknown');
  const props={kind:'bomb',x:12,y:13,radius:22,style:'shaded',time:4,hits:2};
  const snapshot=JSON.stringify(props);
  const calls=[],ctx={save(){calls.push('save')},restore(){calls.push('restore')}};
  const legacy=(_,p)=>{calls.push('legacy');assert.equal(p,props);return 'legacy'};
  assert.equal(renderModule.renderGimmick(ctx,props,legacy),'legacy');
  assert.deepEqual(calls,['legacy']);
  let seen;
  registration.registerGimmickSkin('chain-crystal',(_,p)=>{seen=p;calls.push('skin');});
  assert.equal(renderModule.renderGimmick(ctx,props,legacy),undefined);
  assert.deepEqual(calls,['legacy','save','skin','restore']);
  assert.equal(seen.visualId,'chain-crystal');
  assert.equal(seen.animation.phase,4);
  assert.ok(Object.isFrozen(seen));
  assert.equal(JSON.stringify(props),snapshot);
  registration.registerGimmickSkin('chain-crystal',()=>false);
  assert.equal(renderModule.renderGimmick(ctx,props,legacy),'legacy');
  assert.equal(registration.unregisterGimmickSkin('chain-crystal'),true);
  assert.equal(renderModule.renderGimmick(ctx,props,legacy),'legacy');
  assert.equal(animation.resolveGimmickAnimation({kind:'bomb',time:2}).phase,2);
  assert.match(source('src/engine/artwork.js'),/renderGimmick\(ctx, \{ kind, x, y, radius, style, palette, time, hits \}, drawLegacyArtwork\)/);
  console.log('M3 visual identities, custom skins, fallback, animation and simulation isolation passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
