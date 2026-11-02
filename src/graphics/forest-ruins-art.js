// M8 Phase 3B: handcrafted, deterministic forest-only decorative Canvas artwork.
// 1280x720 coordinates; does not inspect or mutate gameplay objects.
const TAU=Math.PI*2;
function polygon(c,points,fill){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();}
function stroke(c,points,color,width=3){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function circle(c,x,y,r,fill){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=fill;c.fill();}
function oval(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();}
function branch(c,x,y,len,angle,width,depth,tone){
 if(depth<0)return;
 const nx=x+Math.cos(angle)*len,ny=y+Math.sin(angle)*len;
 stroke(c,[[x,y],[nx,ny]],tone,width);
 if(depth){branch(c,nx,ny,len*.73,angle-.53,width*.66,depth-1,tone);branch(c,nx,ny,len*.7,angle+.48,width*.64,depth-1,tone);}
 else for(let j=0;j<3;j++)oval(c,nx+Math.cos(j*2.1)*14,ny+Math.sin(j*2.1)*12,24,12,tone==='#173c38'?'#26574d':'#35705c');
}
function stone(c,x,y,w,h){
 polygon(c,[[x,y],[x+w*.13,y-10],[x+w*.86,y-7],[x+w,y],[x+w-4,y+h],[x+3,y+h]],'#536e69');
 polygon(c,[[x+w*.13,y-10],[x+w*.86,y-7],[x+w-10,y+9],[x+11,y+9]],'#80968b');
 stroke(c,[[x+w*.25,y+18],[x+w*.28,y+h*.45],[x+w*.15,y+h*.6]],'#354e4c',3);
 stroke(c,[[x+w*.7,y+h*.2],[x+w*.61,y+h*.39],[x+w*.72,y+h*.55]],'#354e4c',2);
 for(let i=0;i<5;i++)oval(c,x+i*w/5,y+4,13,5,'#46775b');
}
function arch(c,x,y,s){
 c.save();c.translate(x,y);c.scale(s,s);
 stone(c,-105,-10,35,230);stone(c,70,-10,35,230);
 c.beginPath();c.arc(0,0,90,Math.PI,TAU);c.strokeStyle='#627e72';c.lineWidth=35;c.stroke();
 c.beginPath();c.arc(0,0,90,Math.PI,TAU);c.strokeStyle='#9aab92';c.lineWidth=4;c.stroke();
 for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;stroke(c,[[Math.cos(a)*72,Math.sin(a)*72],[Math.cos(a)*108,Math.sin(a)*108]],'#354e4c',2);}
 for(let i=0;i<8;i++){const a=Math.PI+i*Math.PI/7;circle(c,Math.cos(a)*89,Math.sin(a)*89,2.4,'#a6edba');}
 c.restore();
}
function foliage(c,x,y,r,tone){
 for(let i=0;i<9;i++){const a=i*2.399;oval(c,x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.36,r*(.46+(i%3)*.08),r*.32,tone);}
}
export function drawForestDistance(c){
 // Far canopy has a varied silhouette, not repeated identical circles.
 const hills=[[0,470],[100,390],[225,430],[350,340],[500,420],[640,325],[790,410],[940,320],[1080,390],[1200,350],[1280,430]];
 polygon(c,[[0,720],...hills,[1280,720]],'#163e3d');
 for(let i=0;i<12;i++){
  const x=i*123-55,h=170+(i*47)%160;
  polygon(c,[[x-35,630],[x-20,460],[x-15,460-h],[x+14,460-h],[x+29,630]],'#1b4540');
  branch(c,x,470-h,92,-Math.PI/2,13,2,'#173c38');
  foliage(c,x,455-h,74,i%2?'#24554c':'#2b5f51');
 }
 for(let i=0;i<6;i++){const x=i*260+40;oval(c,x,490,180,38,'#76b9a41b');}
}
export function drawForestArchitecture(c){
 // Off-center ruins leave the central playfield clear.
 arch(c,180,425,.9);arch(c,1090,415,.85);
 stone(c,60,275,54,390);stone(c,1170,255,58,410);
 for(const x of [60,1170]){
  polygon(c,[[x-14,270],[x+68,270],[x+58,286],[x-8,286]],'#9eaa90');
  for(let i=0;i<6;i++)stroke(c,[[x+12,290+i*55],[x+38,300+i*55]],'#415e56',2);
 }
 for(let i=0;i<5;i++){
  const x=80+i*270;
  const top=-20+(i%2)*25;
  stroke(c,[[x,top],[x+8,90],[x-13,185+(i%3)*30]],'#356f58',5);
  for(let j=0;j<6;j++){
   const yy=30+j*29,xx=x+Math.sin(j*2.1)*12;
   oval(c,xx,yy,18,6,j%2?'#559e75':'#76b38a');
  }
 }
 // Ruined steps, moss, and sparse magical flora.
 polygon(c,[[70,670],[1210,670],[1210,720],[70,720]],'#445f59');
 polygon(c,[[70,665],[1210,665],[1210,678],[70,678]],'#839f88');
 for(const x of [105,280,960,1140]){
  polygon(c,[[x,663],[x+35,656],[x+49,666]],'#456c54');
  for(let i=0;i<3;i++){
   stroke(c,[[x+i*12,663],[x+i*12-4,647]],'#62a879',2);
   circle(c,x+i*12-4,646,4,'#8ed8ab');
  }
 }
 for(const x of [130,1140]){
  for(let i=0;i<5;i++){
   const yy=565+i*18;circle(c,x+(i%2)*12,yy,3,'#a9f5c9');
   stroke(c,[[x+(i%2)*12,yy+4],[x+(i%2)*12-5,yy+11]],'#5f9d74',1.5);
  }
 }
}
export function drawForestAtmosphere(c,{reduced=false,time=0,index=1}={}){
 // Soft shafts and mist are confined to the background; no heavy opaque overlays.
 c.save();
 c.globalAlpha=.12;
 for(let i=0;i<5;i++){
  const x=180+i*230;
  polygon(c,[[x,-10],[x+75,-10],[x+230,590],[x+130,590]],'#b5efcb');
 }
 c.restore();
 for(let i=0;i<5;i++){
  const x=100+i*280,y=530+(i%2)*50;
  const mist=c.createRadialGradient(x,y,10,x,y,180);
  mist.addColorStop(0,'#83b5a526');mist.addColorStop(1,'#83b5a500');
  c.fillStyle=mist;c.fillRect(x-180,y-180,360,360);
 }
 const t=reduced?0:Number.isFinite(time)?time:0;
 for(let i=0;i<35;i++){
  const x=(i*199+index*13)%1280,y=(i*113+index*7)%620;
  const drift=reduced?0:Math.sin(t*.5+i)*5;
  circle(c,x+drift,y,1.2+(i%4)*.5,i%3?'#a1e6b67a':'#e3f7b5ad');
 }
}
