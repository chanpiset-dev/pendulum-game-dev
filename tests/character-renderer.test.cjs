const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const files = ['src/engine/artwork.js','src/graphics/pendulum-attachments.js','src/graphics/character-renderer.js','src/graphics/character-animation.js'];
for (const file of files) {
  const p = spawnSync(process.execPath, ['--check','--input-type=module'], {input:fs.readFileSync(path.join(root,file),'utf8'),encoding:'utf8'});
  assert.equal(p.status,0,file+': '+p.stderr);
}
(async () => {
  const load = async file => import('data:text/javascript,'+encodeURIComponent(fs.readFileSync(path.join(root,file),'utf8')));
  const {getPendulumAttachments} = await load('src/graphics/pendulum-attachments.js');
  const {resolveCharacterAnimation} = await load('src/graphics/character-animation.js');
  const pivot={x:100,y:90}, chain={N:3,L:[1,0.5,0.8],state:[0,Math.PI/2,-Math.PI/2],currentR:20,popScale:1.2};
  const snapshot=JSON.stringify({pivot,chain});
  const points=getPendulumAttachments(chain,pivot,100,14);
  assert.equal(points.length,3);
  assert.deepEqual(points.map(p=>p.linkIndex),[0,1,2]);
  assert.equal(points[0].x,100);assert.equal(points[0].y,190);
  assert.equal(points[1].x,150);assert.equal(points[1].y,190);
  assert.equal(points[2].x,70);assert.ok(Math.abs(points[2].y-190)<1e-8);
  assert.equal(points[2].radius,24);
  assert.equal(points[2].isTip,true);assert.equal(points[1].isTip,false);
  assert.ok(Object.isFrozen(points[2]));
  assert.equal(JSON.stringify({pivot,chain}),snapshot);
  const clone={...chain,state:[0,0,0]};
  const other=getPendulumAttachments(clone,pivot,100,14);
  assert.notDeepEqual(other,points);
  assert.equal(JSON.stringify({pivot,chain}),snapshot);
  assert.equal(resolveCharacterAnimation({mood:'happy',popScale:2}).expression,'happy');
  assert.equal(resolveCharacterAnimation({mood:'ready',popScale:1.1}).expression,'impact');
  assert.equal(resolveCharacterAnimation({mood:'focused',popScale:1}).expression,'focused');
  const renderer=fs.readFileSync(path.join(root,'src/graphics/character-renderer.js'),'utf8');
  assert.match(renderer,/skins\.get\(skin\)/);
  assert.match(renderer,/drawExplorer\(ctx, attachment\.x, attachment\.y, radius/);
  assert.match(renderer,/if \(!attachment\?\.isTip\) return/);
  console.log('M2 attachment, clones, multi-link, animation, isolation and legacy fallback checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
