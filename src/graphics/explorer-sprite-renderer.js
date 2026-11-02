import { getExplorerSheet } from './explorer-assets.js';
import { explorerSpriteFrame } from './explorer-animation.js';
// Returns false until the asset is ready, allowing the existing Canvas skin fallback.
export function drawExplorerSprite(ctx,attachment,{animation={},radius=12,reducedMotion=false,homecoming=false}={}){
 if(!attachment?.isTip)return false;
 const sheet=getExplorerSheet();
 if(!sheet)return false;
 const frame=explorerSpriteFrame({expression:animation.expression,time:animation.time,reducedMotion,homecoming});
 const r=Math.max(1,Number.isFinite(radius)?radius:12);
 ctx.save();
 try {
  ctx.translate(attachment.x,attachment.y+frame.bob*r/18);
  ctx.rotate(frame.sway);
  // Keep the artwork centered on the original collision-tip anchor.
  // Source artwork is 128px high, with transparent margins for the hood and cloak.
  const size=r*3.25;
  ctx.drawImage(sheet,frame.index*128,0,128,128,-size/2,-size*.56,size,size);
 }finally{ctx.restore();}
 return true;
}
