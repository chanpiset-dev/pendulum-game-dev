import { drawCharacter, getCharacterSkin } from '../graphics/character-renderer.js';
import { drawLivePendulum } from './artwork.js';
import { JOURNEY_WORLDS } from '../journey-map-art.js';
export const HOME_DURATION=1.8;
export const HOME_FIREWORK_DELAY=2;
export const HOME_TOTAL_DURATION=HOME_FIREWORK_DELAY+HOME_DURATION;
export function captureHomecoming(systems,pivot,scale,minRadius){
  const entries=systems.map((chain,index)=>({chain,index})),survivors=entries.filter(({chain})=>chain.alive!==false);
  return (survivors.length?survivors:entries.slice(-1)).map(({chain:s,index})=>{
    let x=pivot.x,y=pivot.y;for(let i=0;i<s.N;i++){x+=scale*s.L[i]*Math.sin(s.state[i]);y+=scale*s.L[i]*Math.cos(s.state[i]);}
    return {x,y,radius:(s.currentR||minRadius)*(s.popScale||1),color:index?s.color?.outer||'#a679df':'#23c878'};
  });
}
export function homePose(start,width,height,age,reduced=false,delay=0){
  const t=Math.max(0,age-delay),f=Math.max(0,Math.min(1,(t-.25)/.85)),u=f*f*(3-2*f),end={x:1048/1280*width,y:548/720*height};
  const entry=Math.max(0,Math.min(1,(t-1.35)/.25));
  if(reduced)return {x:start.x,y:start.y,alpha:Math.max(0,1-t/.45),scale:1};
  return {x:(1-u)**2*start.x+2*(1-u)*u*(end.x-width*.09)+u*u*end.x,
    y:(1-u)**2*start.y+2*(1-u)*u*Math.min(start.y,end.y-height*.4)+u*u*end.y-(t>1.1&&t<1.35?Math.sin((t-1.1)/.25*Math.PI)*height*.032:0),alpha:1-entry,scale:1-entry*.65};
}
export function drawShelter(c,w,h,{chapter=1,charge=0,age=null,reduced=false}={}){
  const world=JOURNEY_WORLDS[chapter-1],open=age===null?0:reduced?1:Math.min(1,age/.25),arrived=age!==null&&age>=1.5;
  c.save();c.scale(w/1280,h/720);
  const rect=(x,y,width,height,r,fill,stroke)=>{c.beginPath();c.roundRect(x,y,width,height,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}};
  rect(928,253,235,363,24,world.colors[1],'#8f9c70');c.beginPath();c.moveTo(910,270);c.lineTo(1045,175);c.lineTo(1180,270);c.closePath();c.fillStyle=world.colors[0];c.fill();c.strokeStyle=world.colors[2];c.lineWidth=5;c.stroke();
  for(const x of [945,1111]){c.save();if(arrived){c.shadowColor='#f7d68a';c.shadowBlur=20;}rect(x,320,35,48,6,arrived?'#f4d694':'#253e40','#9aab7d');c.restore();}
  rect(989,387,118,218,53,'#193a3b','#a9b484');c.save();c.beginPath();c.roundRect(995,393,106,207,48);c.clip();rect(995,393,106,207,48,open?'#d7c28a':'#243c42');c.fillStyle='#30494a';c.fillRect(995-open*54,393,54,207);c.fillRect(1048+open*54,393,54,207);c.restore();
  for(let i=0;i<3;i++){c.beginPath();c.arc(1018+i*29,294,7,0,Math.PI*2);c.fillStyle=charge>=(i+1)/3?'#f5d581':'#455b57';c.fill();c.strokeStyle='#a9b484';c.lineWidth=1.5;c.stroke();}
  c.beginPath();c.moveTo(1160,205);c.lineTo(1160,130);c.strokeStyle='#c9d3b0';c.lineWidth=4;c.stroke();
  const flag=age===null?0:reduced?(age>=1.5?1:0):Math.max(0,Math.min(1,(age-1.5)/.3));if(flag){c.fillStyle='#e8c577';c.beginPath();c.moveTo(1161,205-70*flag);c.lineTo(1210,218-70*flag);c.lineTo(1161,233-70*flag);c.fill();}
  c.restore();
}
export function drawHomecoming(c,{snapshot,age,width,height,systems,pivot,scale,minRadius,palette,reduced}){
  c.save();c.globalAlpha=reduced?0:Math.max(0,1-age/.35);
  for(const chain of systems)if(chain.alive!==false)drawLivePendulum(c,chain,pivot,scale,minRadius,{style:'shaded',palette,hideTip:true});
  c.restore();
  snapshot.forEach((start,i)=>{
    const delay=Math.min(i*.04,.16),pose=homePose(start,width,height,age,reduced,delay);
    if(!reduced&&age<1.6){c.save();c.strokeStyle='#e8dba75a';c.lineWidth=2;c.setLineDash([2,8]);c.beginPath();c.moveTo(start.x,start.y);c.quadraticCurveTo(1048/1280*width-width*.09,Math.min(start.y,548/720*height-height*.4),1048/1280*width,548/720*height);c.stroke();c.restore();}
    c.save();c.globalAlpha=pose.alpha;c.translate(pose.x,pose.y);c.scale(pose.scale,pose.scale);const r=start.radius;
    if(getCharacterSkin()!=='fantasy-explorer'){const fill=c.createRadialGradient(-r/3,-r/3,1,0,0,r);fill.addColorStop(0,'#f3fbff');fill.addColorStop(.35,start.color);fill.addColorStop(1,'#102238');c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fillStyle=fill;c.fill();c.strokeStyle='#102238';c.lineWidth=2;c.stroke();}drawCharacter(c,{x:0,y:0,radius:r+1,angle:0,isTip:true,linkIndex:0},{mood:'happy',homecoming:true,reducedMotion:reduced,time:age});c.restore();
  });
}
