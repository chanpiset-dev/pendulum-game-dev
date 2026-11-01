import { applyStageSpacing } from './stage-spacing.js';
// Targeted balance adjustments to fresh authored data, before visual/contact scaling.
// IDs here follow the sequential chapter numbering.
export function balanceStage(data, stage, sub, pivot) {
  const key = `${stage}-${sub}`;
  const passageStages = ['5-3', '5-4', '9-4', '9-5', '14-5', '43-2', '42-4'];
  if (passageStages.includes(key)) {
    // Leave room for the fully grown bob (108px diameter), plus clearance.
    const spread = stage === 14 ? 2 : 2.3;
    for (const obstacle of data.obstacles) {
      obstacle.x = obstacle.baseX = pivot.x + (obstacle.baseX - pivot.x) * spread;
    }
  }
  const armorBudgets = { '24-5': 9, '25-5': 9, '41-5': 13, '42-4': 10, '50-4': 16 };
  if (armorBudgets[key]) {
    let total = data.targets.filter(t => !t.isBomb).reduce((n,t) => n + (t.hp || 1), 0);
    while (total > armorBudgets[key]) {
      const target = data.targets.filter(t => !t.isBomb && t.hp > 1).sort((a,b) => b.hp-a.hp)[0];
      if (!target) break;
      target.maxHp = --target.hp;
      total--;
    }
    data.timeLimit += 2;
  }
  // Teach the new chain/clone configuration in an uncluttered opening exercise.
  if ([34, 36, 37, 38].includes(stage) && sub === 1) {
    data.targets = data.targets.filter((t,i) => i % 2 === 0);
    data.obstacles = [];
    data.timeLimit += 4;
  }
  // Keep the lift chapter vertical. Teach two-axis movement in Carousel (19).
  if ([18, 47, 48].includes(stage) && data.rail?.ampX > 0 && data.rail?.ampY > 0) {
    data.rail.ampX = 0;
  }
  // Warp Metronome should practise portals throughout, not only in substage 3.
  if (stage === 48 && !data.portals.length) {
    data.portals.push(
      { id: 1, targetId: 2, x: pivot.x-180, y: pivot.y+100, r: 22, label: 'IN' },
      { id: 2, targetId: null, x: pivot.x+180, y: pivot.y-80, r: 22, label: 'OUT' }
    );
  }
  if (stage === 40) data.gravity = 0;
  // A distinct finale opening: offset vault targets and a lower two-part laser gate.
  if (stage === 50 && sub === 1) {
    data.rail.ampX = 55;
    for (const target of data.targets) target.x += target.x < pivot.x ? -25 : 25;
    data.lasers = [
      { x1:pivot.x-170,y1:pivot.y+155,x2:pivot.x-60,y2:pivot.y+155 },
      { x1:pivot.x+60,y1:pivot.y+155,x2:pivot.x+170,y2:pivot.y+155 }
    ];
  }
  applyApprovedSpacing(data, stage, sub, pivot);
  applyStageSpacing(data, stage, sub, pivot);
  return data;
}

// Approved before/after layout review: only these three substages change.
function applyApprovedSpacing(data, stage, sub, pivot) {
  if (sub !== 5 || ![33,48,50].includes(stage)) return;
  const move=(item,x,y)=>{item.x=pivot.x+x-400;item.y=pivot.y+y-300;};
  if(stage===48 || stage===50){
    const points=[[244,524],[556,524],[400,550],[400,92],[313,550],[487,550],[315,175],[485,175],[196,449],[604,449]];
    data.targets.forEach((target,i)=>move(target,...points[i]));
    move(data.boostRings[0],400,172);
    if(stage===50){move(data.portals[0],183,342);move(data.portals[1],617,342);}
    else move(data.portals[0],184,350);
    [[250,383,350,420],[550,383,450,420],[310,408,490,408]].forEach(([x1,y1,x2,y2],i)=>Object.assign(data.lasers[i],{x1:pivot.x+x1-400,y1:pivot.y+y1-300,x2:pivot.x+x2-400,y2:pivot.y+y2-300}));
  }else{
    const points=[[400,550],[244,524],[556,524],[199.47834398617704,402.0591273207549],[310,555],[490,555],[600.521656013823,402.0591273207549]];
    data.targets.forEach((target,i)=>move(target,...points[i]));
    move(data.boostRings[1],270,395);move(data.boostRings[2],530,395);
    data.zones.forEach(zone=>zone.h=95);
  }
}
