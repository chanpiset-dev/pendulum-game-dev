// Deterministic audit of artwork envelopes and authored obstacle patrol paths.
import { pathToFileURL } from 'node:url';
import { generateStageData } from '../src/data/stage-index.js';
export function spacingObjects(data){
 const objects=[];
 for(const kind of ['targets','obstacles','portals','boostRings','switches'])for(const [index,o]of(data[kind]||[]).entries()){
  const moving=kind==='obstacles',bomb=kind==='targets'&&o.isBomb,spring=moving&&o.restitution<-1;
  objects.push({kind,index,x:moving?o.baseX:o.x,y:moving?o.baseY:o.y,r:o.r,
   artworkRadius:o.r*(bomb?1.5:spring?1.4:kind==='targets'?1.06:kind==='portals'?1.25:1),
   artworkOffset:bomb?-.5*o.r:spring?.4*o.r:0,
   amp:moving?(o.ampX||0):0,speed:moving?(o.speed||0):0,phase:moving?(o.phase||0):0});
 }
 const holes=!data.blackhole?[]:Array.isArray(data.blackhole)?data.blackhole:[data.blackhole];
 holes.forEach((o,index)=>objects.push({kind:'blackhole',index,x:o.x,y:o.y,r:o.coreRadius,artworkRadius:o.coreRadius,artworkOffset:0,amp:0,speed:0,phase:0}));
 return objects;
}
function distanceToSegment(x,y,b){const dx=b.x2-b.x1,dy=b.y2-b.y1,t=Math.max(0,Math.min(1,((x-b.x1)*dx+(y-b.y1)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-b.x1-t*dx,y-b.y1-t*dy)}
export function auditStageSpacing(data){
 const objects=spacingObjects(data),issues=[];
 for(let i=0;i<objects.length;i++)for(let j=i+1;j<objects.length;j++){
  const a=objects[i],b=objects[j];let dx=a.x-b.x;
  if(a.amp||b.amp){const relative=a.speed===b.speed?Math.hypot(a.amp*Math.cos(a.phase)-b.amp*Math.cos(b.phase),a.amp*Math.sin(a.phase)-b.amp*Math.sin(b.phase)):a.amp+b.amp;dx=Math.max(0,Math.abs(dx)-relative)}
  const gap=Math.hypot(dx,a.y+a.artworkOffset-b.y-b.artworkOffset)-a.artworkRadius-b.artworkRadius;
  if(gap<-.01)issues.push({a:`${a.kind}[${a.index}]`,b:`${b.kind}[${b.index}]`,gap});
 }
 const beams=[...(data.lasers||[]),...(data.switches||[]).filter(s=>s.gate).map(s=>s.gate)];
 for(const a of objects)for(const[index,b]of beams.entries()){
  let distance=Infinity;for(let step=0;step<=12;step++)distance=Math.min(distance,distanceToSegment(a.x+(-1+step/6)*a.amp,a.y+a.artworkOffset,b));
  const gap=distance-a.artworkRadius-3;
  if(gap<-.01)issues.push({a:`${a.kind}[${a.index}]`,b:`beam[${index}]`,gap});
 }
 return issues;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const affected=[];for(let index=1;index<=250;index++){const issues=auditStageSpacing(generateStageData(index,{x:400,y:300}));if(issues.length)affected.push({stage:Math.ceil(index/5),sub:(index-1)%5+1,issues})}
 console.log(JSON.stringify({checked:250,flagged:affected.length,affected},null,2));if(affected.length)process.exitCode=1;
}
