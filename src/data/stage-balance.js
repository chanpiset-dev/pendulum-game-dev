// Targeted balance adjustments to fresh authored data, before visual/contact scaling.
// Keep stage identities stable so existing progress continues to refer to the same stages.
export function balanceStage(data, stage, sub, pivot) {
  const key = `${stage}-${sub}`;
  const passageStages = ['4-3', '4-4', '11-4', '11-5', '16-5', '38-2', '46-4'];
  if (passageStages.includes(key)) {
    // Leave room for the fully grown bob (108px diameter), plus clearance.
    const spread = stage === 16 ? 2 : 2.3;
    for (const obstacle of data.obstacles) {
      obstacle.x = obstacle.baseX = pivot.x + (obstacle.baseX - pivot.x) * spread;
    }
  }
  const armorBudgets = { '27-5': 9, '28-5': 9, '31-5': 13, '46-4': 10, '50-4': 16 };
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
  if ([9,15,26,34].includes(stage) && sub === 1) {
    data.targets = data.targets.filter((t,i) => i % 2 === 0);
    data.obstacles = [];
    data.timeLimit += 4;
  }
  // Keep the lift chapter vertical. Teach two-axis movement in Carousel (39).
  if (stage < 39 && data.rail?.ampX > 0 && data.rail?.ampY > 0) {
    data.rail.ampX = 0;
  }
  // Warp Metronome should practise portals throughout, not only in substage 3.
  if (stage === 35 && !data.portals.length) {
    data.portals.push(
      { id: 1, targetId: 2, x: pivot.x-180, y: pivot.y+100, r: 22, label: 'IN' },
      { id: 2, targetId: null, x: pivot.x+180, y: pivot.y-80, r: 22, label: 'OUT' }
    );
  }
  if (stage === 47) data.gravity = 0;
  // A distinct finale opening: offset vault targets and a lower two-part laser gate.
  if (stage === 50 && sub === 1) {
    data.rail.ampX = 55;
    for (const target of data.targets) target.x += target.x < pivot.x ? -25 : 25;
    data.lasers = [
      { x1:pivot.x-170,y1:pivot.y+155,x2:pivot.x-60,y2:pivot.y+155 },
      { x1:pivot.x+60,y1:pivot.y+155,x2:pivot.x+170,y2:pivot.y+155 }
    ];
  }
  return data;
}
