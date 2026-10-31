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
  return data;
}
