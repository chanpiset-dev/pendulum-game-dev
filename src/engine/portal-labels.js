// Place portal identifiers outside nearby artwork. Layout is visual only.
export function placePortalLabels(ctx, portals, circles, beams, width, height, japanese=false) {
  const placed=[];
  ctx.font='bold 11px system-ui';
  const intersects=(a,b)=>a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
  const touches=(rect,circle)=>Math.hypot(circle.x-Math.max(rect.x,Math.min(rect.x+rect.w,circle.x)),circle.y-Math.max(rect.y,Math.min(rect.y+rect.h,circle.y)))<circle.r+3;
  for(const portal of portals){
    const text=japanese?(portal.label||(portal.targetId?'IN':'OUT')).replace(/IN/g,'入口').replace(/OUT/g,'出口'):(portal.label||(portal.targetId?'IN':'OUT'));
    const w=ctx.measureText(text).width+10,h=17,r=portal.r||24;
    const candidates=[
      [portal.x,portal.y+r*1.7+14],
      [portal.x,portal.y-r*1.3-8],
      [portal.x+r*1.1+w/2+7,portal.y+4],
      [portal.x-r*1.1-w/2-7,portal.y+4],
      [portal.x+r+w/2+12,portal.y-r*.8],
      [portal.x-r-w/2-12,portal.y-r*.8],
      [portal.x+r+w/2+12,portal.y+r*.8],
      [portal.x-r-w/2-12,portal.y+r*.8],
    ];
    let best=null;
    for(let i=0;i<candidates.length;i++){
      const [x,y]=candidates[i],rect={x:x-w/2,y:y-12,w,h};let score=i*.01;
      if(rect.x<3 || rect.y<3 || rect.x+w>width-3 || rect.y+h>height-3)score+=1000;
      score+=circles.filter(c=>c.source!==portal&&touches(rect,c)).length*100;
      score+=placed.filter(p=>intersects(rect,p.box)).length*200;
      for(const beam of beams)for(let t=0;t<=1;t+=.125){const bx=beam.x1+(beam.x2-beam.x1)*t,by=beam.y1+(beam.y2-beam.y1)*t;if(intersects(rect,{x:bx-3,y:by-3,w:6,h:6})){score+=30;break}}
      if(!best||score<best.score)best={text,x,y,box:rect,score,portal,candidate:i};
    }
    placed.push(best);
  }
  return placed;
}
