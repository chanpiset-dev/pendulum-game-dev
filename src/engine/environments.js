import { drawShelter } from './homecoming.js';
import { chapterForStage } from '../data/chapters.js';
import { JOURNEY_WORLDS } from '../journey-map-art.js';
let enabled=true;
let forestMotion='normal';
export function setForestMotion(mode){ forestMotion=['off','normal','strong'].includes(mode)?mode:'normal'; }
export function getForestMotion(){ return forestMotion; }
export function setEnvironmentsEnabled(value){enabled=value!==false;}
// Decorative architecture only: never reads or writes simulation bodies.
export function drawEnvironment(c,w,h,{index,targets=[],status,homeAge=null,reduced=false}={}){
  if(!enabled||index==='sandbox'||!Number.isInteger(index))return false;
  const stage=Math.ceil(index/5),sub=(index-1)%5+1,ch=chapterForStage(stage),world=JOURNEY_WORLDS[ch.id-1];
  const palettes=[['#74978c','#203f38'],['#67899a','#1b3446'],['#85846b','#343d37'],['#817799','#302d48'],['#6d9790','#193c3d'],['#696f98','#222b45']];
  c.save();c.scale(w/1280,h/720);
  let g=c.createLinearGradient(0,0,0,720);g.addColorStop(0,palettes[ch.id-1][0]);g.addColorStop(1,palettes[ch.id-1][1]);c.fillStyle=g;c.fillRect(0,0,1280,720);
  const rect=(x,y,width,height,color,r=8)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,width,height,r);c.fill();};
  const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
  const line=(points,color,width=3)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();};
  // Quiet layers and framing shared with the approved explorer demonstration.
  for(let i=0;i<4;i++)ellipse(180+i*350,135+i%2*70,230,50,'#d4e1d017');
  for(let i=0;i<8;i++){const x=i*195-40;c.fillStyle='#172c3438';c.beginPath();c.moveTo(x,650);c.lineTo(x+85,250+i%3*55);c.lineTo(x+180,670);c.fill();}
  const frame=ch.id===1?'#394f4c':world.colors[0];
  for(const x of [40,1190]){rect(x,70,52,650,frame,14);rect(x-12,105,76,24,'#65756a');}
  c.strokeStyle=frame;c.lineWidth=50;c.beginPath();c.arc(640,380,540,Math.PI,Math.PI*2);c.stroke();
  c.strokeStyle=world.colors[2]+'30';c.lineWidth=6;c.beginPath();c.arc(640,380,510,Math.PI,Math.PI*2);c.stroke();
  if(ch.id===1){
    const motion = !reduced && stage===1 && forestMotion!=='off' ? (forestMotion==='strong'?2.6:1) : 0;
    const time = performance.now()*0.001;
    for(let i=0;i<9;i++){
      const x=80+i*140,y=210+i%2*50, sway=motion*Math.sin(time*1.05+i*.72)*15;
      line([[x,0],[x+10+sway*.45,120+i%3*35],[x-5+sway,y]],'#365f43',4);
      for(let j=0;j<5;j++)ellipse(x+(j%2?9:-5)+sway*(j/5),35+j*35,13,5,'#63865c');
    }
    for(const x of [170,780])rect(x,635,250,35,'#4a6551');
  }else if(ch.id===2){
    for(let j=0;j<3;j++){const y=110+j*90;line([[70,y],[170,y-12],[270,y]],'#b7dce333',3);}
    for(const x of [180,1080]){c.strokeStyle='#adccd044';c.lineWidth=9;c.beginPath();c.ellipse(x,250,70,135,-.2,0,Math.PI*2);c.stroke();}
  }else if(ch.id===3){
    for(const x of [120,1120]){rect(x,140,18,490,'#acaa7933');for(let y=180;y<650;y+=80)line([[x-25,y],[x+45,y]],'#b8ae7533',8);}
    for(const x of [160,1100]){c.strokeStyle='#c4bd8944';c.lineWidth=17;c.beginPath();c.arc(x,260,85,0,Math.PI*2);c.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[x+Math.cos(a)*68,260+Math.sin(a)*68],[x+Math.cos(a)*100,260+Math.sin(a)*100]],'#c4bd8944',10);}}
  }else if(ch.id===4){
    for(const [x,color]of [[160,'#84ced444'],[1080,'#b7a0de44']]){c.strokeStyle=color;c.lineWidth=10;c.beginPath();c.ellipse(x,300,55,145,0,0,Math.PI*2);c.stroke();}
    for(let i=0;i<6;i++)line([[90+i*210,0],[90+i*210,105],[120+i*210,125]],'#b5a0d133',5);
  }else if(ch.id===5){
    for(const x of [160,1080]){line([[x-65,130],[x+65,130]],'#a6d0be55',12);line([[x,130],[x-35,230],[x+10,320]],'#a6d0be44',8);ellipse(x+10,320,28,28,'#a6d0be33');}
    for(const x of [125,1110])rect(x,410,45,160,'#87b8ab22');
  }else{
    for(let i=0;i<70;i++)ellipse((i*197)%1280,(i*113)%500,i%5?1:2,i%5?1:2,'#dddafa66');
    ellipse(1030,160,130,130,'#8285b244');ellipse(1065,147,125,125,'#222b4588');
    c.strokeStyle='#c0bce044';c.lineWidth=8;c.beginPath();c.ellipse(640,200,440,120,-.13,0,Math.PI*2);c.stroke();
  }
  // Visual-only ambient motion. No simulation objects or gameplay state are touched.
  // performance.now keeps the scenery alive while the player adjusts launch settings.
  // Reduced-motion users retain the original static background.
  if (!reduced && !(ch.id===1 && stage===1)) {
    const t = performance.now() * 0.001;
    c.save();
    // Slow drifting mist, clipped to the distant sky above the playfield.
    c.beginPath(); c.rect(65, 85, 1150, 445); c.clip();
    for (let i = 0; i < 5; i++) {
      const x = ((i * 310 + t * (7 + i % 3 * 3)) % 1680) - 200;
      const y = 150 + (i % 3) * 108 + Math.sin(t * 0.24 + i) * 9;
      const mist = c.createRadialGradient(x, y, 5, x, y, 185);
      mist.addColorStop(0, '#e6f5ed0e');
      mist.addColorStop(1, '#e6f5ed00');
      c.fillStyle = mist; c.beginPath(); c.ellipse(x, y, 190, 47, 0, 0, Math.PI * 2); c.fill();
    }
    c.restore();
    // Sparse atmospheric glints: deterministic placement, no random flicker.
    c.save();
    for (let i = 0; i < 16; i++) {
      const x = 105 + ((i * 197 + 31) % 1060);
      const y = 115 + ((i * 113 + 47) % 420);
      const a = 0.07 + 0.13 * (0.5 + 0.5 * Math.sin(t * (0.45 + (i % 4) * 0.09) + i * 2.3));
      c.globalAlpha = a;
      c.fillStyle = ch.id === 4 ? '#d4baff' : ch.id === 2 ? '#b7e7f5' : '#c2f5d7';
      c.beginPath(); c.arc(x + Math.sin(t * 0.3 + i) * 5, y - Math.sin(t * 0.24 + i) * 4, 1.4 + i % 3 * 0.45, 0, Math.PI * 2); c.fill();
    }
    c.restore();
    // Foreground foliage sways around its fixed root; it is decorative only.
    if (ch.id === 1 || ch.id === 5) {
      c.save();
      for (let i = 0; i < 12; i++) {
        const x = 110 + i * 96, y = 661;
        c.save(); c.translate(x, y);
        c.rotate(Math.sin(t * 0.85 + i * 0.63) * 0.075);
        c.strokeStyle = '#6c96704d'; c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-7, -18, -3, -33); c.stroke();
        c.fillStyle = '#87b68a55';
        c.beginPath(); c.ellipse(-8, -26, 11, 4, -0.55, 0, Math.PI * 2); c.fill();
        c.restore();
      }
      c.restore();
    }
  }
  // Stage 1 visual test: existing vines plus visible drifting mist and leaves.
  // All coordinates remain decorative; no collision or physics state is changed.
  if(ch.id===1 && stage===1 && !reduced && forestMotion!=='off'){
    const t=performance.now()*0.001, strength=forestMotion==='strong'?2.6:1;
    c.save(); c.beginPath(); c.rect(95,105,1090,490); c.clip();
    for(let i=0;i<4;i++){
      const x=((i*375+t*(28+5*i)*strength)%1660)-200;
      const y=205+(i%3)*115+Math.sin(t*.48+i)*13*strength;
      const haze=c.createRadialGradient(x,y,8,x,y,245);
      haze.addColorStop(0,'rgba(220,246,233,0.22)');
      haze.addColorStop(.6,'rgba(220,246,233,0.10)');
      haze.addColorStop(1,'rgba(220,246,233,0)');
      c.fillStyle=haze;c.beginPath();c.ellipse(x,y,245,75,0,0,Math.PI*2);c.fill();
    }
    for(let i=0;i<18;i++){
      const x=95+((i*157+t*(13+i%5*3)*strength)%1090);
      const y=115+((i*97+t*(19+i%3*6)*strength)%485);
      c.save();c.translate(x+Math.sin(t*.9+i)*15*strength,y);
      c.rotate(.45+Math.sin(t*1.2+i)*.65);
      c.fillStyle=i%3===0?'#c2d5a477':'#80b78c99';
      c.beginPath();c.ellipse(0,0,5+i%3*2,2.5,0,0,Math.PI*2);c.fill();c.restore();
    }
    c.restore();
  }
  // A fixed decoration behind the puzzle, not an exit the player must physically hit.
  const pads=targets.filter(t=>!t.isBomb),charge=pads.length?pads.filter(t=>!t.alive).length/pads.length:0;
  c.save();c.scale(1280/w,720/h);drawShelter(c,w,h,{chapter:ch.id,charge,age:homeAge,reduced});c.restore();
  rect(90,660,1100,48,'#354d49',12);rect(90,660,1100,9,'#8e9d79',4);for(let i=0;i<14;i++)ellipse(110+i*83,659,18,5,'#64845d');
  // Per-stage light variation, deterministic so replay and screenshots stay stable.
  const light=c.createLinearGradient((stage+sub)%2?0:1280,0,640,720);light.addColorStop(0,(stage+sub)%2?'#f0d6a411':'#a7cbe911');light.addColorStop(1,'#0000');c.fillStyle=light;c.fillRect(0,0,1280,720);
  const shade=c.createRadialGradient(620,430,100,620,430,660);shade.addColorStop(0,'#132e3833');shade.addColorStop(1,'#142d3530');c.fillStyle=shade;c.fillRect(0,0,1280,720);
  c.restore();return true;
}
