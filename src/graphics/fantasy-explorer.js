// Optional vector fantasy explorer. Never reads or changes gameplay state.
export const FANTASY_EXPLORER_ID = 'fantasy-explorer';
export function fantasyExplorerFrame({ animation = {}, radius = 12 } = {}) {
  const expression=animation.expression || 'ready';
  const state=expression==='happy'||expression==='celebrate'?'celebration':expression==='impact'?'impact':expression==='swinging'||expression==='focused'?'swinging':'idle';
  const t=Number.isFinite(animation.time)?animation.time:0;
  const motion=state==='swinging'?Math.sin(t*8)*0.09:state==='celebration'?Math.sin(t*10)*0.13:0;
  return Object.freeze({state,motion,blink:state==='impact',radius:Math.max(1,Number.isFinite(radius)?radius:12)});
}
export function drawFantasyExplorer(ctx,attachment,{animation,radius}={}) {
  if(!attachment?.isTip)return false;
  const frame=fantasyExplorerFrame({animation,radius});
  const r=frame.radius;
  ctx.save();
  try {
    ctx.translate(attachment.x,attachment.y);
    ctx.rotate(frame.motion);
    ctx.scale(r/16,r/16);
    // Rounded cloak, brass clasp, cap and readable face at small radii.
    ctx.fillStyle='#284b6a';ctx.strokeStyle='#102b3b';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-11,3);ctx.quadraticCurveTo(-15,15,-8,17);ctx.lineTo(8,17);ctx.quadraticCurveTo(15,15,11,3);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#6ec4a5';ctx.beginPath();ctx.arc(0,-2,11,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#183c52';ctx.beginPath();ctx.moveTo(-12,-8);ctx.quadraticCurveTo(-9,-18,0,-17);ctx.quadraticCurveTo(10,-18,12,-8);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#e5c66a';ctx.fillRect(-4,9,8,3);
    ctx.strokeStyle='#153747';ctx.lineWidth=1.7;ctx.lineCap='round';
    if(frame.blink){ctx.beginPath();ctx.moveTo(-6,-2);ctx.lineTo(-2,-2);ctx.moveTo(3,-2);ctx.lineTo(7,-2);ctx.stroke();}
    else {ctx.fillStyle='#153747';ctx.beginPath();ctx.arc(-4,-2,1.8,0,Math.PI*2);ctx.arc(5,-2,1.8,0,Math.PI*2);ctx.fill();}
    ctx.beginPath();
    if(frame.state==='celebration')ctx.arc(0,2,3,0,Math.PI);
    else {ctx.moveTo(-2,3);ctx.quadraticCurveTo(0,5,3,3);}
    ctx.stroke();
    if(frame.state==='celebration'){
      ctx.fillStyle='#f5d878';
      for(const x of [-14,14]){ctx.beginPath();ctx.arc(x,-13,2,0,Math.PI*2);ctx.fill();}
    }
  }finally{ctx.restore();}
  return true;
}
