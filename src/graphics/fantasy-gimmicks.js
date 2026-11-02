// M7 Phase 1: optional presentation-only fantasy artwork. No gameplay imports.
import { GIMMICK_VISUALS, registerGimmickSkin, unregisterGimmickSkin, getGimmickSkin } from './gimmick-registry.js';

export const FANTASY_GIMMICK_IDS = Object.freeze([...new Set(Object.values(GIMMICK_VISUALS))]);
const TAU = Math.PI * 2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const finite = (v, fallback) => Number.isFinite(v) ? v : fallback;
export function fantasyGimmickFrame(props = {}) {
  const phase = finite(props.animation?.phase ?? props.time, 0);
  const hits = clamp(Math.round(finite(props.hits, 4)), 0, 8);
  const radius = clamp(finite(props.radius, 24), 1, 1000);
  return Object.freeze({ phase, hits, radius, pulse: 1 + 0.045 * Math.sin(phase * 3), rotation: phase * 0.15 });
}
function polygon(ctx, points, fill, stroke = '#17263a', width = 2) {
  ctx.beginPath(); points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();
}
function circle(ctx,x,y,r,fill,stroke='#17263a',width=2) {
  ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=fill;ctx.fill();
  ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();
}
function line(ctx,points,color='#c7f9ee',width=3) {
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function diamond(ctx,color) {
  polygon(ctx,[[0,-29],[22,-6],[16,19],[0,30],[-16,19],[-22,-6]],color);
  polygon(ctx,[[0,-24],[12,-5],[0,19],[-12,-5]],'#d5fff8',color,1);
}
function rune(ctx,color) {
  circle(ctx,0,0,27,'#203044',color,4);
  for(let i=0;i<6;i++){const a=i*TAU/6;circle(ctx,Math.cos(a)*22,Math.sin(a)*22,2.4,color,color,1);}
}
function drawFantasy(ctx,p) {
  const f=fantasyGimmickFrame(p),id=p.visualId;
  if(!FANTASY_GIMMICK_IDS.includes(id))return false;
  ctx.save();
  try {
    ctx.translate(finite(p.x,0),finite(p.y,0));
    ctx.scale(f.radius/48,f.radius/48);
    ctx.lineJoin='round';ctx.lineCap='round';
    if(id==='magic-diamond'||id==='shielded-diamond'){
      if(id==='shielded-diamond') {
        rune(ctx,'#74b5f4');
        for(let i=0;i<f.hits;i++){
          const a=i*TAU/Math.max(1,f.hits);
          circle(ctx,Math.cos(a)*33,Math.sin(a)*33,3.5,'#f4d88c');
        }
      }
      ctx.scale(f.pulse,f.pulse);diamond(ctx,id==='shielded-diamond'?'#8aaef6':'#69d8bb');
    } else if(id==='chain-crystal'){
      circle(ctx,0,0,30,'#352c49','#e6ac68',4);
      ctx.rotate(f.rotation);
      polygon(ctx,[[0,-26],[18,-9],[13,22],[-12,22],[-19,-9]],'#ffae69','#6c3151',3);
      line(ctx,[[-9,5],[2,-10],[4,4],[13,0]],'#fff0be',3);
    } else if(id==='ancient-portal'){
      ctx.rotate(f.rotation*0.25);
      rune(ctx,'#70d7f5');circle(ctx,0,0,19,'#273457','#a986ff',4);
      circle(ctx,0,0,11,'#304e79','#b5eaf5',2);
      line(ctx,[[-5,0],[5,0]],'#d8ffff',3);
    } else if(id==='enchanted-spring'||id==='enchanted-bumper'||id==='enchanted-absorber'||id==='moving-mechanism'){
      const color=id==='enchanted-spring'?'#eec66f':id==='enchanted-absorber'?'#9ba6c6':'#6dc7ef';
      circle(ctx,0,0,29,'#2e4355',color,5);circle(ctx,0,0,19,color,'#e5f8ff',2);
      if(id==='enchanted-spring')line(ctx,[[-12,8],[-5,-8],[2,8],[9,-8],[15,6]],'#254153',4);
      else if(id==='enchanted-absorber')line(ctx,[[-10,0],[10,0]],'#254153',4);
      else if(id==='moving-mechanism')line(ctx,[[-12,0],[12,0], [6,-6]],'#254153',4);
      else polygon(ctx,[[-11,7],[0,-9],[11,7]],'#d7fff9','#254153',2);
    } else if(id==='energy-beam'||id==='mechanical-rail'||id==='mechanical-lift'||id==='rune-gate'){
      const vertical=id==='mechanical-lift'||id==='rune-gate';
      ctx.save();if(vertical)ctx.rotate(Math.PI/2);
      polygon(ctx,[[-38,-10],[38,-10],[38,10],[-38,10]],'#40576a','#7ac9df',3);
      line(ctx,[[-32,0],[32,0]],id==='energy-beam'?'#fa7287':'#e7d394',4);
      ctx.restore();
    } else if(id==='slime-zone'||id==='resin-zone'||id==='wind-glyph'||id==='gravity-glyph'){
      const color=id==='resin-zone'?'#edb967':'#72d3d7';
      ctx.fillStyle=id==='resin-zone'?'#86623855':'#267c8c55';
      ctx.fillRect(-38,-28,76,56);
      for(let i=0;i<3;i++)line(ctx,[[-34,-18+i*18],[-8,-22+i*18],[15,-13+i*18],[34,-18+i*18]],color,3);
    } else {
      const color=id==='gravity-orb'?'#ad83ec':id==='repulsor-orb'?'#6de3ec':'#8cddac';
      rune(ctx,color);
      ctx.rotate(f.rotation);
      polygon(ctx,[[0,-16],[14,0],[0,16],[-14,0]],color,'#d5fff8',2);
    }
  } finally {ctx.restore();}
  return true;
}
export const drawFantasyGimmick = drawFantasy;
// Explicit opt-in. Importing this file never changes default rendering.
export function installFantasyGimmickSkins() {
  const previous = new Map(FANTASY_GIMMICK_IDS.map(id=>[id,getGimmickSkin(id)]));
  for(const id of FANTASY_GIMMICK_IDS)registerGimmickSkin(id,drawFantasy);
  return () => {
    for(const [id,old] of previous) {
      // Avoid overriding skins installed by other features after this installer.
      if(getGimmickSkin(id)!==drawFantasy)continue;
      if(old)registerGimmickSkin(id,old);else unregisterGimmickSkin(id);
    }
  };
}
