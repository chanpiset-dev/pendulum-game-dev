// Approved map composition. Coordinates are percentages of the decorative map, never gameplay positions.
export const JOURNEY_WORLDS = [
  { colors:['#203f38','#3e6053','#aebc8d','#efd08a'], landmarks:[['⌂','ENTRANCE','入口',5,39],['≋','OLD AQUEDUCT','古い水路',62,62],['◉','OBSERVATORY','天文台',83,4]] },
  { colors:['#1b3446','#395e72','#a3cad3','#e5ce99'], landmarks:[['≋','WIND TERRACES','風のテラス',4,35],['◎','VORTEX WELLS','渦の観測井',60,65],['◯','FORCE OBSERVATORY','力の観測所',76,4]] },
  { colors:['#343d37','#626953','#c6bd8a','#efcf8a'], landmarks:[['↔','RAIL DEPOT','レール基地',4,38],['⚙','ROTARY GALLERY','回転回廊',62,65],['♜','CLOCKWORK TOWER','時計仕掛けの塔',76,4]] },
  { colors:['#302d48','#555270','#b7abd9','#e6ca91'], landmarks:[['◇','TRANSIT ATRIUM','転移の広間',4,37],['▱','FOLDED VAULTS','折り重なる宝庫',60,66],['◈','GATE SANCTUARY','転移の聖域',77,3]] },
  { colors:['#193c3d','#396363','#abd0bc','#e9ce95'], landmarks:[['⛓','ASSEMBLY HALL','組立工房',4,38],['⌁','MIRROR LAB','鏡の研究室',61,65],['⋈','DYNAMICS CORE','振り子の中枢',77,4]] },
  { colors:['#222b45','#414b6a','#bcb9dc','#edd399'], landmarks:[['▵','OUTER DEFENSES','外縁防衛区',4,36],['✧','WARP SPIRE','転移の尖塔',60,65],['◎','RIFT CROWN','裂け目の頂',80,3]] },
];
const eight=[[13.75,79.17],[22,66],[33.13,59.03],[49,66],[52.5,52.78],[43.75,31.94],[68.75,31.25],[81.88,20.83]];
export function journeyComposition(count, mobile=false) {
  if(mobile){
    // Preserve the tall winding composition approved in the responsive demo.
    const points=count===8?[[20,83],[49,75],[77,65],[50,55],[22,45],[49,35],[77,25],[50,15]]:
      Array.from({length:count},(_,i)=>[[20,49,77,50,22,49,77,50][i%8],84-i*69/(count-1)]);
    return {points,path:count===8?'M160 598 C250 598 280 540 392 540 S616 530 616 468 S400 420 400 396 S176 380 176 324 S392 300 392 252 S616 235 616 180 S450 145 400 108':smoothRoute(points)};
  }
  const positions={6:[[14,80],[35,64],[55,68],[45,43],[70,36],[82,20]],9:[[14,80],[33,72],[52,78],[75,64],[52,53],[30,43],[47,29],[70,36],[82,19]],11:[[14,82],[35,76],[57,80],[78,67],[55,57],[30,59],[17,42],[39,31],[62,39],[79,28],[83,15]]};
  const points=count===8?eight:positions[count];
  return {points,path:count===8?'M110 570 C230 570 135 400 265 425 S440 560 420 380 S240 240 350 230 S540 350 550 225 S590 165 655 150':smoothRoute(points)};
}
function smoothRoute(points){
  const p=points.map(([x,y])=>[x*8,y*7.2]);let d=`M${p[0].join(' ')}`;
  for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],middle=(a[1]+b[1])/2;d+=` C${a[0]} ${middle} ${b[0]} ${middle} ${b.join(' ')}`;}
  return d;
}
