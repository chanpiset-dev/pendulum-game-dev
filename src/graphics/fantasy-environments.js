// M8 Phase 1: opt-in decorative fantasy world artwork.
// All geometry is normalized to 1280x720; no physics or stage state is accessed.
import { ENVIRONMENT_WORLDS, getEnvironmentRenderer, registerEnvironmentRenderer, unregisterEnvironmentRenderer } from './environment-registry.js';
import { createParallaxLayers } from './parallax-system.js';

export const FANTASY_ENVIRONMENT_IDS = Object.freeze(Object.values(ENVIRONMENT_WORLDS));
const TAU = Math.PI * 2;
const THEMES = Object.freeze({
 'forest-ruins': {sky:['#193f3b','#081f2c'],glow:'#7eeac1',stone:'#526d69',accent:'#b9e7b1'},
 'wind-sanctuary': {sky:['#42738d','#1b3d65'],glow:'#c9e7fa',stone:'#789aaf',accent:'#f3dfab'},
 'clockwork-hall': {sky:['#594f46','#252638'],glow:'#f5cb81',stone:'#766d60',accent:'#c9a979'},
 'portal-temple': {sky:['#4a416e','#211c42'],glow:'#c49bff',stone:'#6c638e',accent:'#86e8eb'},
 'ancient-machinery': {sky:['#254d55','#122a3d'],glow:'#75eddf',stone:'#466d74',accent:'#f1cf89'},
 'celestial-chamber': {sky:['#313d7a','#101c3b'],glow:'#b9b8ff',stone:'#596a9d',accent:'#f7e7bd'}
});
function disk(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill();}
function path(c,pts,fill,stroke){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=3;c.stroke();}}
function line(c,pts,color,width=3){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function ring(c,x,y,rx,ry,color,width=5){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function gear(c,x,y,r,color,phase=0){c.save();c.translate(x,y);c.rotate(phase);ring(c,0,0,r,r,color,10);ring(c,0,0,r*.38,r*.38,color,4);for(let i=0;i<12;i++){const a=i*TAU/12;line(c,[[Math.cos(a)*r*.78,Math.sin(a)*r*.78],[Math.cos(a)*r*1.2,Math.sin(a)*r*1.2]],color,9);}c.restore();}
function spire(c,x,y,h,color){path(c,[[x-46,y],[x-35,y-h*.7],[x,y-h],[x+35,y-h*.7],[x+46,y]],color);}
function background(c,t){const g=c.createLinearGradient(0,0,0,720);g.addColorStop(0,t.sky[0]);g.addColorStop(1,t.sky[1]);c.fillStyle=g;c.fillRect(0,0,1280,720);}
function farLayer(c,id,t){
 if(id==='forest-ruins'){
  for(let i=0;i<10;i++){const x=i*154-60;spire(c,x,610,310+(i%3)*45,'#173b39');disk(c,x,290+(i%3)*40,95,'#22534b');}
 }else if(id==='wind-sanctuary'){
  for(let i=0;i<7;i++){const x=i*230-60,y=220+(i%3)*100;path(c,[[x-120,y],[x+85,y-25],[x+160,y],[x+75,y+35],[x-70,y+35]],'#608da780');}
 }else if(id==='clockwork-hall'){
  for(let i=0;i<7;i++)gear(c,80+i*205,270+(i%2)*190,80+(i%3)*18,'#bd95664a');
 }else if(id==='portal-temple'){
  for(let i=0;i<6;i++)spire(c,80+i*240,650,370+(i%2)*100,'#3b355f');
 }else if(id==='ancient-machinery'){
  for(let i=0;i<7;i++){const x=i*200;line(c,[[x,0],[x+50,160],[x+50,420]],'#8bc9be50',15);gear(c,x+50,420,45,'#73c7ba55');}
 }else{
  for(let i=0;i<110;i++){const x=(i*173)%1280,y=(i*239)%610;disk(c,x,y,i%7===0?2.4:1.1,'#e4e5ff9a');}
  ring(c,640,260,440,150,'#9dace35c',7);
 }
}
function architecture(c,id,t){
 for(const x of [58,1190]){c.fillStyle=t.stone;c.fillRect(x,110,32,570);disk(c,x+16,110,26,t.accent);}
 if(id==='forest-ruins'){
  for(let i=0;i<8;i++){const x=100+i*150;line(c,[[x,0],[x+12,120],[x-5,220+i%2*50]],'#4d9069',6);for(let j=0;j<4;j++)disk(c,x+(j%2?10:-6),60+j*42,8,'#71b47b');}
  for(const x of [190,1040]){ring(c,x,460,95,155,'#7ebc9c66',12);}
 }else if(id==='wind-sanctuary'){
  for(const x of [210,1060]){ring(c,x,360,85,165,'#c9e7fa80',9);for(let i=0;i<4;i++)line(c,[[x-100,220+i*70],[x,195+i*70],[x+100,220+i*70]],'#c3e8f66b',4);}
 }else if(id==='clockwork-hall'){
  for(const x of [200,1080]){gear(c,x,350,105,'#f1cf8980');line(c,[[x,100],[x,650]],'#8c735e88',12);}
 }else if(id==='portal-temple'){
  for(const x of [200,1080]){ring(c,x,380,105,200,'#a18be6a0',14);ring(c,x,380,76,164,'#85e8e9a0',5);for(let i=0;i<8;i++){const a=i*TAU/8;disk(c,x+105*Math.cos(a),380+200*Math.sin(a),6,t.accent);}}
 }else if(id==='ancient-machinery'){
  for(const x of [210,1070]){gear(c,x,360,108,'#75eddf88');disk(c,x,360,42,'#79ead455');line(c,[[x,50],[x,230]],'#f1cf8999',14);}
 }else{
  for(const x of [200,1080]){ring(c,x,390,115,200,'#b9b8ff7a',10);disk(c,x,390,50,'#b9b8ff33');}
  ring(c,640,150,350,90,'#f7e7bd77',6);
 }
 c.fillStyle=t.stone;c.fillRect(70,670,1140,50);
 c.fillStyle=t.accent;c.fillRect(70,670,1140,7);
}
function atmosphere(c,id,t,scene){
 const seed=Number.isInteger(scene.index)?scene.index:1;
 const time=scene.reduced?0:(Number.isFinite(scene.options.time)?scene.options.time:0);
 const glow=c.createRadialGradient(640,230,40,640,230,560);
 glow.addColorStop(0,t.glow+'24');glow.addColorStop(1,t.glow+'00');
 c.fillStyle=glow;c.fillRect(0,0,1280,720);
 for(let i=0;i<24;i++){
  const x=(i*197+seed*17)%1280,y=(i*127+seed*31)%610;
  const offset=scene.reduced?0:Math.sin(time*.6+i)*5;
  disk(c,x,y+offset,i%5===0?3:1.5,t.glow+'99');
 }
}
export function createFantasyEnvironment(id){
 const theme=THEMES[id];
 if(!theme)return null;
 return scene=>{
  const w=scene.width,h=scene.height;
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return false;
  const layers=createParallaxLayers([
   {depth:0,draw(c){c.save();try{c.scale(w/1280,h/720);background(c,theme);}finally{c.restore();}}},
   {depth:.12,draw(c){c.save();try{c.scale(w/1280,h/720);farLayer(c,id,theme);}finally{c.restore();}}},
   {depth:.3,draw(c){c.save();try{c.scale(w/1280,h/720);architecture(c,id,theme);}finally{c.restore();}}}
  ]);
  return {
   layers,
   cameraX:scene.reduced?0:(Number.isFinite(scene.options.cameraX)?scene.options.cameraX:0),
   cameraY:scene.reduced?0:(Number.isFinite(scene.options.cameraY)?scene.options.cameraY:0),
   lighting(c){c.save();try{c.scale(w/1280,h/720);atmosphere(c,id,theme,scene);}finally{c.restore();}}
  };
 };
}
export function installFantasyEnvironments(){
 const previous=new Map(FANTASY_ENVIRONMENT_IDS.map(id=>[id,getEnvironmentRenderer(id)]));
 const installed=new Map();
 for(const id of FANTASY_ENVIRONMENT_IDS){const fn=createFantasyEnvironment(id);installed.set(id,fn);registerEnvironmentRenderer(id,fn);}
 return ()=>{
  for(const [id,old] of previous){
   if(getEnvironmentRenderer(id)!==installed.get(id))continue;
   if(old)registerEnvironmentRenderer(id,old);else unregisterEnvironmentRenderer(id);
  }
 };
}
