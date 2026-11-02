const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const file of ['src/engine/homecoming.js','src/graphics/character-renderer.js']){
 const r=spawnSync(process.execPath,['--check','--input-type=module'],{input:read(file),encoding:'utf8'});assert.equal(r.status,0,r.stderr);
}
(async()=>{
 const explorer='data:text/javascript,'+encodeURIComponent('export function drawExplorer(ctx,x,y,r,opts){globalThis.__homeCalls.push({skin:"legacy",x,y,r,mood:opts.mood});}');
 const fantasy='data:text/javascript,'+encodeURIComponent('export const FANTASY_EXPLORER_ID="fantasy-explorer";export function drawFantasyExplorer(ctx,a,opts){globalThis.__homeCalls.push({skin:"fantasy",a,expression:opts.animation.expression,time:opts.animation.time});return true;}');
 const sprite='data:text/javascript,'+encodeURIComponent('export function drawExplorerSprite(){return false}');
 const animation='data:text/javascript,'+encodeURIComponent(read('src/graphics/character-animation.js'));
 const character='data:text/javascript,'+encodeURIComponent(read('src/graphics/character-renderer.js').replace("'./explorer-sprite-renderer.js'",JSON.stringify(sprite)).replace("'./fantasy-explorer.js'",JSON.stringify(fantasy)).replace("'../engine/explorer.js'",JSON.stringify(explorer)).replace("'./character-animation.js'",JSON.stringify(animation)));
 const artwork='data:text/javascript,'+encodeURIComponent('export function drawLivePendulum(){}');
 const journey='data:text/javascript,'+encodeURIComponent('export const JOURNEY_WORLDS=Array.from({length:6},()=>({colors:["#123","#456","#789"]}));');
 const moduleUrl='data:text/javascript,'+encodeURIComponent(read('src/engine/homecoming.js').replace("'../graphics/character-renderer.js'",JSON.stringify(character)).replace("'./artwork.js'",JSON.stringify(artwork)).replace("'../journey-map-art.js'",JSON.stringify(journey)));
 const {setCharacterSkin}=await import(character),{captureHomecoming,drawHomecoming,homePose}=await import(moduleUrl);
 globalThis.__homeCalls=[];
 const c=new Proxy({save(){},restore(){},translate(){},scale(){},beginPath(){},moveTo(){},quadraticCurveTo(){},stroke(){},arc(){},fill(){},createRadialGradient(){return{addColorStop(){}}},setLineDash(){}},{set(t,k,v){t[k]=v;return true;}});
 for(let stage=1;stage<=250;stage++){
  for(const N of [1,2,3]){
   const chain=Object.freeze({N,L:Object.freeze(Array(N).fill(.6)),state:Object.freeze(Array(N).fill(.4)),currentR:12,popScale:1,alive:true});
   const systems=Object.freeze([chain,chain]);const before=JSON.stringify(systems);
   const snapshot=captureHomecoming(systems,{x:180,y:160},100,10);
   assert.equal(snapshot.length,2);assert.equal(JSON.stringify(systems),before);
   for(const skin of ['legacy','fantasy-explorer']){
    setCharacterSkin(skin);
    for(const [width,height] of [[1440,900],[390,844]]){
     for(const reduced of [false,true]){
      globalThis.__homeCalls=[];
      drawHomecoming(c,{snapshot,age:reduced?.2:.7,width,height,systems,pivot:{x:180,y:160},scale:100,minRadius:10,palette:{rod:'#aaa'},reduced});
      assert.equal(globalThis.__homeCalls.length,2);
      assert.ok(globalThis.__homeCalls.every(v=>v.skin===(skin==='legacy'?'legacy':'fantasy')));
      assert.ok(globalThis.__homeCalls.every(v=>skin==='legacy'?v.mood==='happy':v.expression==='happy'));
     }
    }
   }
  }
 }
 setCharacterSkin('missing-skin');
 globalThis.__homeCalls=[];
 const snapshot=[{x:100,y:200,radius:12,color:'#23c878'}];
 drawHomecoming(c,{snapshot,age:.6,width:390,height:844,systems:[],pivot:{x:0,y:0},scale:1,minRadius:10,palette:{rod:'#aaa'},reduced:false});
 assert.equal(globalThis.__homeCalls[0].skin,'legacy','unknown skin falls back');
 setCharacterSkin('legacy');
 for(const age of [0,.2,.7,1.8])assert.deepEqual(homePose(snapshot[0],390,844,age),homePose(snapshot[0],390,844,age),'homecoming trajectory deterministic');
 console.log('M8 Phase 3A: 250 layouts, clones, multi-link, mobile/desktop, reduced motion, both skins, fallback, immutable physics and homecoming states passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
