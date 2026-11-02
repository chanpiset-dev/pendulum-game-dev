// M8 3B.2 — deterministic, forest-only layered illustration. 1280 × 720 logical canvas.
// Decorative rendering only: never reads game state or uses randomness.
const TAU=Math.PI*2;
const rand=n=>{const v=Math.sin(n*127.1+43.77)*43758.5453;return v-Math.floor(v)};
function path(c,pts,color){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=color;c.fill()}
function line(c,pts,color,w=2){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=w;c.stroke()}
function ellipse(c,x,y,rx,ry,color,angle=0){c.beginPath();c.ellipse(x,y,rx,ry,angle,0,TAU);c.fillStyle=color;c.fill()}
function disc(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill()}
function gradient(c,x,y,r,inner,outer){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,inner);g.addColorStop(1,outer);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function vine(c,x,y,seed,len=160){
 const pts=[];for(let i=0;i<=16;i++){const t=i/16;pts.push([x+Math.sin(t*8+seed)*12*t,y+len*t])}
 line(c,pts,'#376a52',2.5);
 for(let i=2;i<15;i+=2){const [vx,vy]=pts[i],dir=i%4===0?1:-1;ellipse(c,vx+dir*11,vy,15,5,'#5c9e70',dir*.45);ellipse(c,vx-dir*4,vy+6,9,3,'#3f815c',-dir*.5)}
}
function canopy(c,x,y,size,seed,base,lit){
 // Interlocking irregular leaf clusters, not regular disks.
 for(let i=0;i<27;i++){
  const a=rand(seed+i*3)*TAU,r=Math.sqrt(rand(seed+i*3+1))*size;
  const xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*.56;
  const rr=size*(.18+rand(seed+i*3+2)*.15);
  ellipse(c,xx,yy,rr,rr*(.65+rand(seed+i+70)*.25),i%5===0?lit:base,a*.1);
 }
 for(let i=0;i<24;i++){
  const a=rand(seed+i+200)*TAU,r=rand(seed+i+280)*size*.83;
  const xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*.55;
  ellipse(c,xx,yy,4+rand(i+seed)*8,2+rand(i+seed+30)*3,lit,a);
 }
}
function tree(c,x,baseY,height,seed,far=false){
 const w=far?19:33,top=baseY-height;
 path(c,[[x-w,baseY],[x-w*.65,baseY-110],[x-w*.28,top+70],[x+5,top],[x+w*.45,top+65],[x+w*.6,baseY-100],[x+w,baseY]],far?'#244a43':'#284c43');
 path(c,[[x-w*.3,baseY],[x-w*.1,top+80],[x+5,top],[x+w*.12,top+100],[x+w*.2,baseY]],far?'#32594c':'#496b53');
 for(let i=0;i<5;i++){const yy=top+70+i*height*.12,side=i%2?1:-1;line(c,[[x,yy+30],[x+side*(75+i*11),yy-35]],far?'#254c43':'#355846',far?9:13)}
 canopy(c,x,top+70,height*(far?.25:.28),seed,far?'#315a50':'#2e5b4b',far?'#3b6d5b':'#46745b');
 if(!far){for(let i=0;i<4;i++)vine(c,x-70+i*40,top+65,i+seed,75+i*15)}
}
function stone(c,x,y,w,h,seed){
 path(c,[[x+8,y-10],[x+w*.75,y-15],[x+w,y+4],[x+w-5,y+h],[x+3,y+h]],'#4a625c');
 path(c,[[x+8,y-10],[x+w*.75,y-15],[x+w-9,y+6],[x+15,y+9]],'#87978a');
 path(c,[[x+w-9,y+6],[x+w,y+4],[x+w-5,y+h],[x+w-13,y+h]],'#304e4a');
 for(let i=0;i<9;i++){const xx=x+13+rand(seed+i)*Math.max(4,w-26),yy=y+15+rand(seed+i+40)*(h-30);line(c,[[xx,yy],[xx+rand(seed+i+90)*8,yy+7],[xx+4,yy+14]],'#344f49',.7+rand(i+seed))}
 for(let i=0;i<7;i++){const xx=x+rand(seed+i+110)*w;ellipse(c,xx,y-10+rand(seed+i+200)*6,5+rand(seed+i+210)*9,3,'#4b805c')}
}
function ruinArch(c,x,y,scale,seed){
 c.save();c.translate(x,y);c.scale(scale,scale);
 stone(c,-105,-10,40,235,seed);stone(c,65,-10,40,235,seed+20);
 c.beginPath();c.arc(0,0,85,Math.PI,TAU);c.strokeStyle='#405e57';c.lineWidth=39;c.stroke();
 c.beginPath();c.arc(0,0,86,Math.PI,TAU);c.strokeStyle='#8fa394';c.lineWidth=4;c.stroke();
 for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8;line(c,[[Math.cos(a)*66,Math.sin(a)*66],[Math.cos(a)*107,Math.sin(a)*107]],'#304c46',2)}
 for(let i=0;i<13;i++){const a=Math.PI+i*Math.PI/12;ellipse(c,Math.cos(a)*87,Math.sin(a)*87,4+rand(seed+i)*7,2.5,'#638b6c',a)}
 for(let i=0;i<6;i++){const a=Math.PI+i*Math.PI/5;disc(c,Math.cos(a)*87,Math.sin(a)*87,2,'#a8dcb0')}
 vine(c,-100,-45,seed,155);vine(c,92,-52,seed+3,130);
 c.restore();
}
function mushroom(c,x,y,s){
 line(c,[[x,y],[x,y-13*s]],'#b5d6a5',2*s);
 ellipse(c,x,y-13*s,9*s,5*s,'#79b9a0');
 ellipse(c,x,y-15*s,7*s,3*s,'#b7f4c8');
 gradient(c,x,y-15*s,17*s,'#9fe9bf50','#9fe9bf00');
}
export function drawForestDistance(c){
 // Multiple depth bands, varied winding tree trunks and a quiet central clearing.
 const g=c.createLinearGradient(0,170,0,720);g.addColorStop(0,'#173f3e');g.addColorStop(1,'#0a2930');c.fillStyle=g;c.fillRect(0,170,1280,550);
 path(c,[[0,440],[130,360],[230,390],[340,300],[460,350],[620,310],[780,365],[910,295],[1050,365],[1170,330],[1280,420],[1280,720],[0,720]],'#1b4541');
 for(let i=0;i<9;i++){const x=i*164-40;tree(c,x,670,315+rand(i+7)*175,i+30,true)}
 for(let i=0;i<4;i++){const x=50+i*400;gradient(c,x,460,210,'#80bfa115','#80bfa100')}
}
export function drawForestArchitecture(c){
 // Main focal architecture sits toward the margins, avoiding gameplay objects.
 for(const [x,h,s] of [[-60,410,4],[160,440,8],[1120,420,12],[1350,400,15]])tree(c,x,730,h,s,false);
 ruinArch(c,165,428,.88,21);ruinArch(c,1115,425,.86,47);
 stone(c,50,260,54,405,60);stone(c,1180,245,55,420,90);
 for(const [x,y] of [[50,258],[1180,243]]){
  path(c,[[x-18,y],[x+72,y-5],[x+66,y+13],[x-14,y+14]],'#7d9583');
  path(c,[[x-10,y+13],[x+62,y+13],[x+54,y+21],[x-4,y+22]],'#344f49');
 }
 // Cracked stone foundation and climbing moss.
 path(c,[[65,671],[1215,671],[1215,720],[65,720]],'#3c5853');
 path(c,[[65,666],[1215,666],[1215,679],[65,679]],'#8aa18b');
 for(let i=0;i<37;i++){
  const x=78+i*31,yy=668+rand(i+40)*7;
  line(c,[[x,yy],[x+6,yy+rand(i+50)*10],[x+3,yy+16]],'#2c4a45',.7);
  if(i%3===0)ellipse(c,x,666,17,4,'#507a57');
 }
 for(const x of [92,120,250,300,950,1040,1140,1170]){for(let j=0;j<3;j++)mushroom(c,x+j*8,659-j*4,.65+j*.16)}
 // Distinctive rune stones and textured fragments.
 for(const [x,y] of [[140,640],[1120,615],[225,600],[1060,650]]){
  path(c,[[x-13,y],[x-10,y-30],[x+5,y-38],[x+18,y-4]],'#526c62');
  line(c,[[x-4,y-23],[x+2,y-16],[x+6,y-25]],'#9cd9b1',1.5);
 }
}
export function drawForestAtmosphere(c,{reduced=false,time=0,index=1}={}){
 const t=reduced?0:Number.isFinite(time)?time:0;
 c.save();c.globalAlpha=.10;
 for(let i=0;i<4;i++){const x=115+i*340;path(c,[[x,-20],[x+65,-20],[x+210,600],[x+130,600]],'#b9f4c8')}
 c.restore();
 for(let i=0;i<4;i++){
  const x=130+i*320+(!reduced?Math.sin(t*.15+i)*8:0),y=505+i%2*52;
  gradient(c,x,y,190,'#a8e2b91a','#a8e2b900');
 }
 for(let i=0;i<44;i++){
  const x=(i*199+index*13)%1280,y=(i*113+index*7)%640;
  const drift=reduced?0:Math.sin(t*.55+i)*5;
  const r=1+rand(i+88)*1.6;
  disc(c,x+drift,y,r,i%4===0?'#e3f3bbad':'#91d8ad87');
 }
 // Small lights are decorative, not gameplay cues.
 for(const [x,y] of [[125,620],[1120,620],[175,355],[1090,350]]){
  gradient(c,x,y,30,'#a8edac36','#a8edac00');
 }
}
