// Presentation only. Decorations stay inside the bob's circular contact silhouette.
let enabled = true;
export function setExplorerEnabled(value) { enabled = value !== false; }
export function drawExplorer(ctx, x, y, radius, { pixel = false, mood = 'ready' } = {}) {
  if (!enabled || radius < 8) return;
  ctx.save(); ctx.translate(x,y); ctx.scale(radius,radius);
  ctx.fillStyle = '#142e30'; ctx.strokeStyle = '#142e30'; ctx.lineWidth = .085;
  if (mood === 'happy') {
    for (const eye of [-.28,.28]) { ctx.beginPath();ctx.arc(eye,-.12,.13,Math.PI,Math.PI*2);ctx.stroke(); }
  } else if (mood === 'impact') {
    for (const eye of [-.28,.28]) { ctx.beginPath();ctx.moveTo(eye-.1,-.22);ctx.lineTo(eye+.1,-.06);ctx.moveTo(eye+.1,-.22);ctx.lineTo(eye-.1,-.06);ctx.stroke(); }
  } else {
    for (const eye of [-.28,.28]) { if(pixel)ctx.fillRect(eye-.06,-.27,.12,.2);else{ctx.beginPath();ctx.ellipse(eye,-.17,.065,.105,0,0,Math.PI*2);ctx.fill();} }
    if(mood === 'focused'){ctx.beginPath();ctx.moveTo(-.4,-.4);ctx.lineTo(-.17,-.34);ctx.moveTo(.4,-.4);ctx.lineTo(.17,-.34);ctx.stroke();}
  }
  ctx.beginPath();ctx.arc(0,.1,.22,.15,Math.PI-.15);ctx.stroke();
  // Scarf sits on the lower hemisphere rather than extending into nearby hazards.
  ctx.strokeStyle='#efbd6e';ctx.lineWidth=.15;ctx.beginPath();ctx.moveTo(-.55,.56);ctx.quadraticCurveTo(0,.78,.53,.56);ctx.stroke();
  ctx.fillStyle='#efbd6e';ctx.beginPath();ctx.moveTo(.32,.61);ctx.lineTo(.63,.57);ctx.lineTo(.48,.83);ctx.closePath();ctx.fill();ctx.restore();
}
