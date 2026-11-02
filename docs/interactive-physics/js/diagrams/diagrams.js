/* Inline textbook figures. No modules, network requests or external resources. */
(function(root){'use strict';
const P=root.PendulumPhysics,R=root.GameRules,TAU=2*Math.PI;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const line=(x1,y1,x2,y2,cls='annotation',color='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" ${color?`stroke="${color}"`:''}/>`;
const text=(x,y,s,cls='',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`;
const circle=(x,y,r,cls='bob',attrs='')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cls}" ${attrs}/>`;
const rect=(x,y,w,h,fill='#eff6f7',stroke='#8aa8b2')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}"/>`;
function arrow(x,y,dx,dy,color='#147a88'){const d=Math.hypot(dx,dy);if(d<.02)return '';const ux=dx/d,uy=dy/d;return line(x,y,x+dx,y+dy,'arrow',color)+`<path d="M ${x+dx-7*ux+3*uy} ${y+dy-7*uy-3*ux} L ${x+dx} ${y+dy} L ${x+dx-7*ux-3*uy} ${y+dy-7*uy+3*ux}" fill="none" stroke="${color}" stroke-width="2"/>`;}
const path=(pts,color='#147a88',width=2)=>`<path d="${pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(3)+' '+p[1].toFixed(3)).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
function chain(c,p={x:195,y:195},s=48,color='',numbers=true){let x=p.x,y=p.y;const ps=[];let svg='';for(let i=0;i<c.N;i++){const xx=x+s*c.L[i]*Math.sin(c.state[i]),yy=y+s*c.L[i]*Math.cos(c.state[i]);svg+=line(x,y,xx,yy,'rod',color);const radius=i===c.N-1?(c.currentR||21)*s/120:7.5*s/120;svg+=circle(xx,yy,Math.max(radius,i===c.N-1?7:4),'bob',color?`style="stroke:${color};fill:${color}22"`:'');if(numbers&&c.N<=2)svg+=text(xx,yy+5,i+1,'small','middle');ps.push({x:xx,y:yy});x=xx;y=yy;}svg+=circle(p.x,p.y,3.5,'',`fill="#19354a"`);return {svg,ps,tip:ps.at(-1)};}
function axes(x,y,w,h,xlabel,ylabel){return line(x,y,x+w,y)+line(x,y-h,x,y)+text(x+w/2,y+34,xlabel,'small','middle')+text(x,y-h-15,ylabel,'small');}
function note(lines,x=415,y=75){return lines.map((s,i)=>text(x,y+i*28,s)).join('');}
function guide(p={x:195,y:195},r=120){return circle(p.x,p.y,r,'guide')+line(p.x,p.y-r,p.x,p.y+r,'guide');}
function leader(p,x,y,s){return line(p.x,p.y,x-12,y-5)+text(x,y,s);}
const fixedKinds=new Set(['rk4','pipeline','fields','bomb','portal','circles','segment','sampling','clocks','verification']);
class Diagram{
 constructor(el){this.el=el;this.kind=el.dataset.kind;this.id=el.dataset.diagramId;this.paused=matchMedia('(prefers-reduced-motion: reduce)').matches;this.visible=false;this.speed=1;this.g=9.8;this.drag=0;this.angle=60;this.choice='';this.N=2;this.h=.04;this.t=0;this.accumulator=0;this.setupControls();this.reset();}
 setupControls(){this.svg=document.createElementNS('http://www.w3.org/2000/svg','svg');this.svg.setAttribute('viewBox','0 0 760 420');this.svg.setAttribute('role','img');this.svg.setAttribute('aria-label',this.el.closest('figure')?.querySelector('figcaption')?.textContent||'Animated two-link pendulum on the title page');this.svg.setAttribute('tabindex','0');this.svg.style.cursor='pointer';this.el.append(this.svg);
 const controls=document.createElement('div');controls.className='diagram-controls';this.el.append(controls);this.controls=controls;
 const button=(s,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=s;b.onclick=fn;controls.append(b);return b;};
 this.play=button(this.paused?'Play':'Pause',()=>this.toggle());this.play.setAttribute('aria-label','Pause or resume this figure');button('Reset',()=>this.reset());
 const speeds=document.createElement('select');speeds.setAttribute('aria-label','Simulation speed');for(const v of [.5,1,2]){const o=new Option(v+'× speed',v);speeds.add(o);}speeds.value=1;speeds.onchange=()=>{this.speed=+speeds.value;};controls.append(speeds);
 this.status=document.createElement('span');this.status.className='diagram-status';this.status.setAttribute('aria-live','off');controls.append(this.status);
 const select=(label,options,fn)=>{const lab=document.createElement('label');lab.append(label+' ');const sel=document.createElement('select');for(const [v,t] of options)sel.add(new Option(t,v));sel.onchange=()=>{fn(sel.value);this.reset();};lab.append(sel);controls.insertBefore(lab,this.status);this.choice=options[0][0];};
 const slider=(label,min,max,step,value,fn)=>{const lab=document.createElement('label'),inp=document.createElement('input'),out=document.createElement('output');lab.append(label+' ');inp.type='range';Object.assign(inp,{min,max,step,value});inp.setAttribute('aria-label',label);out.textContent=value;inp.oninput=()=>{out.textContent=inp.value;fn(+inp.value);this.reset();};lab.append(inp,out);controls.insertBefore(lab,this.status);};
 if(this.kind==='gravity')select('Schedule',[['fixed','Constant comparison'],['flip','Flip first panel every 3 s']],v=>this.choice=v);
 if(this.kind==='multi')select('Links',[[2,'2'],[3,'3'],[4,'4'],[5,'5']],v=>this.N=+v);
 if(this.kind==='bumper')select('Pad',[[-.8,'Normal q = −0.8'],[-1.45,'Spring q = −1.45'],[-.05,'Absorber q = −0.05']],v=>this.choice=v);
 if(this.kind==='field-motion')select('Field',[['attract','Attractor'],['repel','Repulsor']],v=>this.choice=v);
 if(this.kind==='zone')select('Zone',[[.8,'Slime D = 0.8'],[2,'Resin D = 2']],v=>this.choice=v);
 if(this.kind==='clocks')select('Clock',[['normal','Ordinary'],['stop','Hit-stop 0.3 s'],['slow','Stage clear ×0.2'],['pause','Pause']],v=>this.choice=v);
 if(this.kind==='integration')slider('Step h',.01,.08,.01,.04,v=>this.h=v);
 if(this.kind==='experiment'){slider('Angle °',-175,175,5,60,v=>this.angle=v);slider('Gravity',-15,15,.5,9.8,v=>this.g=v);slider('Drag',0,1,.05,0,v=>this.drag=v);}
 if(this.kind==='pulse')button('Pulse ±2.5',()=>{R.pulse(this.a);this.message='Pulse: last-link angular speed changed';this.draw();});
 this.svg.addEventListener('click',()=>this.toggle());this.svg.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();this.toggle();}});
 }
 toggle(){this.paused=!this.paused;this.sync();if(!this.paused)document.dispatchEvent(new Event('textbook-figure-play'));}
 sync(){this.play.textContent=this.paused?'Play':'Pause';this.play.setAttribute('aria-pressed',String(this.paused));this.el.classList.toggle('is-paused',this.paused);}
 reset(){this.t=0;this.steps=0;this.accumulator=0;this.plotAcc=0;this.eventCount=0;this.message='';this.trace=[];this.traces=[];this.life=3;this.hp=3;this.targetAlive=true;this.gateTimer=0;this.swActive=false;this.laserCooldown=0;this.pulsed=false;this.clock=0;this.reward=0;this.railHit=false;
 const one=['coordinates','forces','energy','vectors','damping','wind','pivot','orbit','experiment','visual-physics','integration','zone','armor','switch','laser'].includes(this.kind);
 const high=['cover','sensitivity','sensitivity-plot','clone-contact','coupled','matrix','field-motion'].includes(this.kind);
 this.a=R.make(this.kind==='multi'?this.N:one?1:2,high?2*Math.PI/3:this.angle*Math.PI/180,0);
 this.b=R.make(this.a.N,high?2*Math.PI/3+.001:this.angle*Math.PI/180,0);
 this.a.E0=R.energy(this.a).E;this.b.E0=R.energy(this.b).E;
 if(['boost','bumper','portal-motion','rail-contact'].includes(this.kind)){this.a.state.fill(0);this.a.state[0]=this.a.state[1]=1.05;this.a.state[2]=this.a.state[3]=-1;}
 this.one=R.make(1,Math.PI/3,0);
 if(this.kind==='rail-contact'){this.a.state=[2.1,2.1,3,3];}
 this.gravities=[9.8,-9.8,0].map(g=>({g,c:R.make(1,Math.PI/3,g===0?1:0)}));
 this.events=[];this.sync();this.draw();
 }
 pivot(t=this.t){if(['pivot','rail-contact'].includes(this.kind))return {x:400+60*Math.sin(1.6*t),y:300,ax:-.5*1.6**2*Math.sin(1.6*t),ay:0};if(this.kind==='orbit')return {x:400+60*Math.sin(1.6*t),y:300+36*Math.cos(1.6*t),ax:-.5*1.6**2*Math.sin(1.6*t),ay:-.3*1.6**2*Math.cos(1.6*t)};return {x:400,y:300,ax:0,ay:0};}
 tip(c=this.a){return R.points(c,this.pivot()).at(-1);}
 record(message){this.eventCount++;this.message=message;this.events.push({t:this.t,message});}
 event(h){const c=this.a,tip=this.tip(),r=c.currentR,pivot=this.pivot();const overlap=o=>Math.hypot(tip.x-o.x,tip.y-o.y)<r+o.r;
 if(this.kind==='boost'){if(c.boostCooldown>0)c.boostCooldown-=h;else if(overlap({x:440,y:560,r:35})){c.boostCooldown=.4;R.pulse(c,3.2);this.record('Ring: ±3.2 rad/s added');}}
 if(this.kind==='bumper'){const o={x:455+40*Math.sin(this.t*1.8),y:550,r:33};if(overlap(o)){R.bumper(c,+this.choice);this.record('Contact: ω tip × '+this.choice);}}
 if(this.kind==='armor'&&this.targetAlive&&overlap({x:460,y:590,r:27})){if(this.hp>1){this.hp--;c.state[2*c.N-1]*=-.6;this.record('Armor hit: HP '+this.hp);}else{this.hp=0;this.targetAlive=false;c.currentR=Math.min(54,r+4.5);this.record('Target cleared; radius grew');}}
 if(this.kind==='switch'){if(!this.swActive&&overlap({x:460,y:580,r:27})){this.swActive=true;this.gateTimer=4.5;this.record('Switch touched: gate opened');}if(!this.swActive&&R.segment(tip,{x:310,y:520},{x:360,y:620}).d<r+3){R.bumper(c);this.record('Closed gate: ω tip × −0.8');}}
 if(this.kind==='laser'){if(this.laserCooldown>0)this.laserCooldown-=h;else if(R.segment(tip,{x:330,y:570},{x:500,y:570}).d<r+3){this.laserCooldown=.55;this.life--;c.currentR=Math.max(21,c.currentR-4.5);for(let k=0;k<c.N;k++)c.state[c.N+k]*=-.85;if(this.life===0)c.alive=false;this.record('Laser contact: '+this.life+' lives');}}
 if(this.kind==='portal-motion'){if(c.portalCooldown>0)c.portalCooldown-=h;else if(Math.hypot(tip.x-470,tip.y-560)<36*1.55*.85+r){R.portal(c,{x:210,y:410},pivot);this.record('Portal: angles and speeds reassigned');}}
 if(this.kind==='field-motion'){R.field(c,{x:480,y:470,pullRadius:210,coreRadius:24,pullStrength:90,isRepulsor:this.choice==='repel'},h,pivot);if(!c.alive&&this.message!=='Core contact: chain ended')this.record('Core contact: chain ended');}
 if(this.kind==='rail-contact'){const ps=R.points(c,pivot);const hit=ps.some((p,k)=>R.segment(p,{x:310,y:pivot.y},{x:490,y:pivot.y}).d<(k===c.N-1?r:7.5)+18);if(hit&&c.railCooldown<=0){for(let k=0;k<c.N;k++)c.state[c.N+k]*=-.8;c.currentR=Math.max(21,r-4.5);c.railCooldown=.08;this.railHit=true;this.record('Rail: all angular speeds × −0.8');}if(c.railCooldown>0)c.railCooldown-=h;}
 }
 advance(dt){const h=1/240;this.accumulator+=dt;let count=0;while(this.accumulator>=h&&count++<240){this.accumulator-=h;const pivot=this.pivot();
 if(this.steps%4===0&&this.kind==='switch'&&this.swActive){this.gateTimer-=1/60;if(this.gateTimer<=0){this.swActive=false;this.gateTimer=0;}}
 if(this.a.alive){let damp=['damping','sensitivity','sensitivity-plot','energy','integration','vectors','forces'].includes(this.kind)?0:this.kind==='experiment'?this.drag:.04;
 if(this.kind==='zone'){const q=this.tip();if(q.x>=280&&q.x<=520&&q.y>=510&&q.y<=625){const D=+this.choice;for(let k=0;k<this.a.N;k++)this.a.state[this.a.N+k]*=Math.exp(-4*D*h);damp=D;this.message='Tip inside: both damping rules active';}else this.message='Tip outside: baseline damping 0.04';}
 const wind=this.kind==='wind'?2.4*Math.sin(1.6*this.t):0;
 if(this.kind!=='integration')P.rk4(this.a,h,pivot.ax,pivot.ay,wind,this.g,damp);
 if(['sensitivity','damping','clone-contact'].includes(this.kind))P.rk4(this.b,h,0,0,0,9.8,this.kind==='damping'?.35:this.kind==='clone-contact'?.04:0);
 if(this.kind==='integration'){this.plotAcc+=h;if(this.plotAcc>=this.h-1e-12){this.plotAcc-=this.h;const old=this.b.state.slice(),d=P.getDerivs(1,old,this.b.L,this.b.m,0,0,0,9.8,0);this.b.state=old.map((x,i)=>x+this.h*d[i]);P.rk4(this.a,this.h,0,0,0,9.8,0);}}
 if(this.steps%4===3)this.event(h);
 if(this.kind==='clone-contact'&&R.clones(this.a,this.b,h))this.record('Tip overlap: source clone exchange');
 }
 if(this.kind==='objects')P.rk4(this.one,h,0,0,0,9.8,0);
 if(this.kind==='gravity')for(const s of this.gravities)P.rk4(s.c,h,0,0,0,s.g*(this.choice==='flip'&&s===this.gravities[0]&&Math.floor(this.t/3)%2?-1:1),.04);
 if(this.kind==='pulse'&&!this.pulsed&&this.t>=1.5){R.pulse(this.a);this.pulsed=true;this.record('Example pulse applied at 1.5 s');}
 if(this.kind==='visual-physics')this.reward=Math.floor(this.t/2)*100;
 if(this.kind==='clocks')this.clock+=this.choice==='pause'?0:this.choice==='slow'?h*.2:this.choice==='stop'&&this.t%2<.3?0:h;
 this.t+=h;this.steps++;
 if(this.steps%4===0){const q=this.tip();this.trace.push([(q.x-400)*.4+195,(q.y-300)*.4+195]);if(this.trace.length>180)this.trace.shift();}
 // Leave terminal event states visible until Reset; no hidden scripted replay.
 if(!this.a.state.every(Number.isFinite)){this.paused=true;this.message='Numerical state invalid — reset';break;}
 }
 this.draw();}
 draw(){let s='';const kind=this.kind,c=this.a,t=this.t;const pivot=this.pivot(),screen={x:195+(pivot.x-400)*.4,y:195+(pivot.y-300)*.4},a=chain(c,screen),b=chain(this.b,screen,48,'#b95c24',false);const mapped=q=>({x:195+(q.x-400)*.4,y:195+(q.y-300)*.4});
 if(kind==='objects'){
 const left=chain(c,{x:170,y:175},42),right=chain(this.one,{x:565,y:145},34);
 s=guide({x:170,y:175},105)+left.svg+circle(565,145,85,'guide')+right.svg;
 s+=leader({x:170,y:175},310,45,'pivot')+leader(left.ps[0],310,95,'mass 1')+leader(left.tip,310,145,'tip 2');
 s+=leader({x:(170+left.ps[0].x)/2,y:(175+left.ps[0].y)/2},310,195,'link 1')+leader({x:(left.ps[0].x+left.tip.x)/2,y:(left.ps[0].y+left.tip.y)/2},310,245,'link 2')+text(170,345,'Two links: not one circle','small','middle')+text(565,270,'One link: circular path','small','middle')+text(565,310,'Rigid links; point masses','small','middle');
 }else if(kind==='gravity'){
 s=this.gravities.map(({c,g},i)=>{if(i===0&&this.choice==='flip'&&Math.floor(this.t/3)%2)g=-g;const p={x:125+i*250,y:190},ch=chain(c,p,32);return guide(p,80)+ch.svg+text(p.x,50,g>0?'Normal: g = 9.8':g<0?'Inverted: g = −9.8':'Zero: g = 0','','middle')+arrow(ch.tip.x,ch.tip.y,0,Math.sign(g)*40,'#b95c24')+text(p.x,335,g===0?'Initial ω = 1 rad/s':'Released at 60°','small','middle');}).join('');
 }else if(kind==='oscillation'||kind==='sensitivity-plot'||kind==='wind-plot')s=this.plot();
 else if(kind==='rk4'){
 s=note(['One coupled vector state','Four matrix solves per RK4 step'],35,40);const names=['Current state zₙ','Four derivative estimates','Weighted average','Next state zₙ₊₁'];names.forEach((name,i)=>{const x=25+i*187;s+=rect(x,145,166,80)+text(x+83,191,name,'small','middle');if(i<3)s+=arrow(x+168,185,17,0);});const active=Math.floor(t*1.5)%4;s+=rect(25+active*187,235,166,4,'#147a88','#147a88')+text(380,295,'k₁ + 2k₂ + 2k₃ + k₄, multiplied by h/6','','middle')+text(380,340,'Highlighted blocks show algorithm order, not physical bobs.','small','middle');
 }else if(kind==='pipeline'){
 const stages=['Frame clock / hit-stop / scaled time','Gravity flip and gate countdowns','Wind, moving pivot and obstacle positions','Zone decay → coupled RK4 (four substeps)','Last substep: sampled contacts and arcade rules','Every substep: clone contacts, game clock','Effects, timer, results and rendering'];stages.forEach((v,i)=>{const y=12+i*56;s+=rect(70,y,620,42,Math.floor(t*1.5)%7===i?'#cfe6e9':'#f5f9fa')+text(380,y+27,v,'','middle');if(i<6)s+=arrow(380,y+43,0,10);});
 }else if(kind==='circles'){
 const x=330+85*Math.cos(t);s=circle(235,185,62,'bob')+circle(x,185,47,'bob','style="fill:#f8ded9;stroke:#b95c24"')+line(235,95,x,95)+text((235+x)/2,80,'d = '+(x-235).toFixed(1),'','middle')+line(235,185,173,185)+text(175,217,'rᵦ = 62','small')+text(x+10,250,'rₒ = 47','small')+note(['Circle overlap test',x-235<109?'d < rᵦ + rₒ: contact':'d ≥ rᵦ + rₒ: clear','Geometry test; prescribed centers.'],460,130);
 }else if(kind==='segment'){
 const px=110+(t%6)/6*530,py=145+45*Math.sin(t),A={x:140,y:240},B={x:560,y:240},C=R.segment({x:px,y:py},A,B);s=line(A.x,A.y,B.x,B.y,'rod','#b95c24')+circle(px,py,20)+line(px,py,C.x,C.y,'guide')+circle(C.x,C.y,4,'','fill="#147a88"')+text(140,275,'A')+text(560,275,'B')+text(C.x,300,'closest C','small','middle')+text(px,py-32,'P','','middle')+note(['Clamp projection to the segment','u = '+C.u.toFixed(2)+'; distance = '+C.d.toFixed(1),'Contact threshold: rᵦ + rₛ','Prescribed geometry; no dynamics.'],60,315);
 }else if(kind==='bomb'){
 const bomb={x:230,y:200};s=circle(230,200,115,'guide')+circle(230,200,22,'bob','style="fill:#f4d6ba;stroke:#b95c24"')+text(230,206,'B','','middle');const active=t%4>1.2;for(const [x,y] of [[290,160],[170,250],[390,190]]){const inside=Math.hypot(x-230,y-200)<115;s+=circle(x,y,16,'bob',`style="fill:${active&&inside?'#eee':'#f1caca'};opacity:${active&&inside?.3:1}"`)+text(x,y+5,'T','small','middle');}if(active)s+=circle(230,200,Math.min(115,(t%4-1.2)*130),'','fill="none" stroke="#b95c24"');s+=note(['145 px center-distance rule','Inside: non-bomb targets cleared','Outside: remains alive','Other bombs are not detonated','No mechanical blast impulse','Schematic trigger repeats every 4 s.'],440,105);
 }else if(kind==='fields'){
 for(const [x,rep] of [[190,false],[555,true]]){s+=circle(x,185,105,'guide')+circle(x,185,24,'bob')+text(x,45,rep?'Repulsor':'Attractor','','middle');for(let j=0;j<8;j++){const angle=j*TAU/8,rr=rep?55:92,delta=rep?38:-38;s+=arrow(x+rr*Math.cos(angle),185+rr*Math.sin(angle),delta*Math.cos(angle),delta*Math.sin(angle),rep?'#147a88':'#b95c24');}s+=text(x,340,rep?'Outward angular kick':'Inward angular kick','small','middle')+text(x,370,rep?'Core bounces joints':'Tip core can end chain','small','middle');}
 }else if(kind==='portal'){
 const phi=.55+Math.sin(t*.5)*.6,dist=210;const tmp=R.make(2);R.portal(tmp,{x:400+dist*Math.sin(phi),y:300+dist*Math.cos(phi)});const ch=chain(tmp,{x:200,y:170});s=guide({x:200,y:170})+ch.svg+line(200,170,ch.tip.x,ch.tip.y,'guide')+circle(ch.tip.x,ch.tip.y,18,'guide')+leader(ch.ps[0],450,115,'intermediate joint')+leader(ch.tip,450,175,'desired reachable exit')+note(['Lengths remain fixed','Cosine rule finds both angles','Exit sweep is prescribed here','Live portal contact appears below.'],450,250);
 }else if(kind==='sampling'){
 const u=(t%4)/4,x=80+540*u;s=line(80,220,620,220,'guide')+line(350,90,350,320,'rod','#b95c24')+circle(290,220,16,'guide')+circle(410,220,16,'guide')+circle(x,220,16)+text(290,350,'Sample n','small','middle')+text(410,350,'Sample n+1','small','middle')+text(380,55,'A fast path can cross between sampled positions','','middle')+text(380,390,'Prescribed straight-line motion, not a free pendulum.','small','middle');
 }else if(kind==='clocks'){
 s=note(['Wall clock: '+t.toFixed(2)+' s','Simulation clock: '+this.clock.toFixed(2)+' s'],55,75)+rect(55,150,630,36)+rect(55,150,Math.min(630,t%10*63),36,'#c5dce3')+rect(55,245,630,36)+rect(55,245,Math.min(630,this.clock%10*63),36,'#d5e9d9')+text(55,135,'Wall time')+text(55,230,'Simulated time')+text(55,340,'The controls pause both illustration clocks.');
 }else if(kind==='verification'){
 const x=v=>75+v/210*620,pos=Math.min(210,t*60);s=line(75,210,695,210,'rod');for(const f of [0,36,100,204])s+=line(x(f),195,x(f),225)+text(x(f),250,'f '+f,'small','middle');s+=arrow(x(36),130,0,55)+arrow(x(100),130,0,55)+text(x(36),110,'Pulse 1','small','middle')+text(x(100),110,'Pulse 2','small','middle')+circle(x(pos),210,7)+note(['60 Hz fixed-frame input timeline','Frame 36 = 0.60 s; frame 100 ≈ 1.67 s','About 3.40 s: documented clear time, not a new verification.'],45,320);
 }else{
 s=guide(screen)+path(this.trace,'#147a8840',1.2);
 if(['pivot','rail-contact','orbit'].includes(kind)){
 s+=line(159,screen.y,231,screen.y,'rod','#93a6af');if(kind==='orbit'){const pts=Array.from({length:101},(_,i)=>[195+24*Math.sin(i*TAU/100),195+14.4*Math.cos(i*TAU/100)]);s+=path(pts,'#b7c5ca',1);}s+=rect(screen.x-8,screen.y-5,16,10,'#cfe6e9');}
 if(['boost','bumper','armor','switch','laser','portal-motion','field-motion','zone'].includes(kind))s+=this.objects(mapped);
 s+=a.svg;
 if(kind==='cover'){s+=leader(screen,420,100,'fixed or moving pivot')+arrow(a.tip.x,a.tip.y,0,38,'#b95c24')+leader(a.tip,420,220,'tip bob; gravity acts down');}
 else if(kind==='coordinates'){
 const th=c.state[0],thn=Math.atan2(Math.sin(th),Math.cos(th));s+=`<path d="M ${screen.x} ${screen.y+35} A 35 35 0 0 ${thn>=0?0:1} ${screen.x+35*Math.sin(thn)} ${screen.y+35*Math.cos(thn)}" fill="none" stroke="#147a88"/>`+line(screen.x,screen.y,a.tip.x,screen.y,'guide')+line(a.tip.x,screen.y,a.tip.x,a.tip.y,'guide')+arrow(35,40,75,0)+arrow(35,40,0,75)+text(115,45,'+x')+text(20,140,'+y, down')+note(['θ = '+(th*180/Math.PI).toFixed(1)+'°','x − xₚ = ℓ sin θ','y − yₚ = ℓ cos θ','Angles are absolute from down.']);
 }else if(kind==='forces'||kind==='vectors'){
 const th=c.state[0],w=c.state[1],g=this.g,L=c.L[0],thdot=-g/L*Math.sin(th),vx=L*w*Math.cos(th),vy=-L*w*Math.sin(th),ax=L*(thdot*Math.cos(th)-w*w*Math.sin(th)),ay=-L*(thdot*Math.sin(th)+w*w*Math.cos(th));
 if(kind==='forces'){s+=arrow(a.tip.x,a.tip.y,0,37,'#b95c24')+arrow(a.tip.x,a.tip.y,-25*Math.sin(th)*Math.cos(th),25*Math.sin(th)**2)+arrow(a.tip.x,a.tip.y,-25*Math.sin(th),-25*Math.cos(th),'#64758a')+note(['Downward arrow: gravity mg','Teal: tangential gravity','Along rod: constraint direction','α = −(g/ℓ) sin θ']);}
 else s+=arrow(a.tip.x,a.tip.y,vx*8,vy*8)+arrow(a.tip.x,a.tip.y,ax*2,ay*2,'#b95c24')+note(['Teal: velocity, tangent to path','Orange: total acceleration','v = '+Math.hypot(vx,vy).toFixed(2)+' model m/s','|a| = '+Math.hypot(ax,ay).toFixed(2)+' model m/s²','Arrows use different scale factors.']);
 }else if(kind==='energy'){
 const e=R.energy(c),max=c.E0;const height=170;s+=note(['Energy relative to the bottom','K + U = '+e.E.toFixed(4)],415,65);for(const [i,key,color] of [[0,'K','#147a88'],[1,'U','#b95c24']]){const x=455+i*135,ht=Math.max(0,e[key]/max*height);s+=rect(x,145,65,height,'#f7f9fa','#c5cdd0')+rect(x,315-ht,65,ht,color,color)+text(x+32,345,key+' = '+e[key].toFixed(2),'small','middle');}}
 else if(kind==='damping'||kind==='sensitivity'||kind==='clone-contact'){
 s+=b.svg;const dist=Math.hypot(a.tip.x-b.tip.x,a.tip.y-b.tip.y)/48;
 s+=note(kind==='damping'?['Teal: c = 0','Orange: c = 0.35 s⁻¹','Both solve the nonlinear equation','No imposed amplitude envelope.']:kind==='sensitivity'?['Teal: original initial state','Orange: each angle +0.001 rad','Tip separation: '+dist.toFixed(4)+' m','No clone contacts in this experiment.']:['Shared pivot; both tips are tested','Initial cooldown: 3 s','Events: '+this.eventCount,'Contact cooldown: 0.06 s']);
 }else if(kind==='integration'){
 s+=b.svg;const ea=R.energy(c),eb=R.energy(this.b);s+=note(['Teal: RK4; orange: Euler','h = '+this.h.toFixed(2)+' s','RK4 relative ΔE: '+((ea.E-c.E0)/c.E0).toExponential(2),'Euler relative ΔE: '+((eb.E-this.b.E0)/this.b.E0).toExponential(2),'Identical nonlinear model and start.']);
 }else if(kind==='matrix'){
 s+=note(['M α = B; changing geometry',...Array.from({length:c.N},(_,i)=>Array.from({length:c.N},(_,j)=>{let mu=0;for(let k=Math.max(i,j);k<c.N;k++)mu+=c.m[k];return (mu*c.L[i]*c.L[j]*Math.cos(c.state[i]-c.state[j])).toFixed(3);}).join('      '))]);
 }else if(kind==='visual-physics'){
 s+=note(['Physical state:','ω = '+c.state[1].toFixed(3)+' rad/s','K = '+R.energy(c).K.toFixed(3),'Separate illustrative reward: '+this.reward,'Reward counter is excluded from f(z).']);
 }else if(kind==='multi')s+=note([c.N+' links; '+c.N+' unit point masses','Σℓ = 2.5 model m','Every length is enforced geometrically','The entire reach disk stays visible.']);
 else if(kind==='wind')s+=arrow(480,230,35*2.4*Math.sin(t*1.6),0)+note(['a_w = 2.4 sin(1.6t)','a_w = '+(2.4*Math.sin(t*1.6)).toFixed(3)+' m/s²','Horizontal acceleration input','Not a fluid-velocity simulation.']);
 else if(['pivot','orbit'].includes(kind))s+=note(['Prescribed anchor acceleration','aₓ = '+pivot.ax.toFixed(3)+' m/s²','aᵧ = '+pivot.ay.toFixed(3)+' m/s²','Continuous coupled RK4 response','Contacts omitted in this force example.']);
 else if(kind==='coupled')s+=leader(a.ps[0],430,100,'m₁; link 1 carries both masses')+leader(a.tip,430,165,'m₂; link 2 carries tip mass')+note(['Both θ₁ and θ₂ are absolute angles','The matrix couples accelerations.'],430,280);
 else if(kind==='pulse')s+=note(['Last-link speed: '+c.state[2*c.N-1].toFixed(3)+' rad/s','Example automatic pulse at 1.5 s','Use “Pulse ±2.5” to add another','The joint positions stay continuous.']);
 else if(kind==='experiment')s+=note(['Nonlinear single-link equation','ℓ = 2.5 m; m = 1','g = '+this.g+'; c = '+this.drag,'θ = '+(c.state[0]*180/Math.PI).toFixed(2)+'°','ω = '+c.state[1].toFixed(3)+' rad/s']);
 else s+=this.eventNotes();
 }
 if(!fixedKinds.has(kind)&&!['oscillation','sensitivity-plot','wind-plot','objects','gravity'].includes(kind))s+=text(415,385,this.message.length>41?this.message.slice(0,41)+'…':this.message,'small');
 this.svg.innerHTML=s;
 const portrait=!window.TextbookLayoutMeasuring&&matchMedia('(max-width: 600px)').matches;
 const wide=new Set(['objects','gravity','oscillation','sensitivity-plot','wind-plot',...fixedKinds]);
 if(portrait&&(fixedKinds.has(kind)||['oscillation','sensitivity-plot','wind-plot'].includes(kind))){this.portrait();}
 else if(portrait&&!wide.has(kind)){
  this.svg.setAttribute('viewBox','0 0 390 790');this.svg.style.aspectRatio='390 / 790';
  for(const el of [...this.svg.children]){const bb=el.getBBox();if(bb.x>=390)el.setAttribute('transform','translate(-390 360)');else if(el.tagName==='line'&&+el.getAttribute('x2')>=390)el.remove();}
 }else if(portrait&&kind==='objects'){
  const leftLabel=(p,y,label)=>line(p.x,p.y,90,y-5)+text(15,y,label);const ch=chain(c,{x:195,y:190},48),one=chain(this.one,{x:195,y:560},34);
  this.svg.setAttribute('viewBox','0 0 390 740');this.svg.style.aspectRatio='390 / 740';
  this.svg.innerHTML=guide({x:195,y:190})+ch.svg+leftLabel({x:195,y:190},30,'pivot')+leftLabel(ch.ps[0],60,'mass 1')+leftLabel(ch.tip,90,'tip 2')+leftLabel({x:(195+ch.ps[0].x)/2,y:(190+ch.ps[0].y)/2},120,'link 1')+leftLabel({x:(ch.ps[0].x+ch.tip.x)/2,y:(ch.ps[0].y+ch.tip.y)/2},150,'link 2')+text(195,365,'Two links: not one circle','small','middle')+circle(195,560,85,'guide')+one.svg+text(195,690,'One link: circular path','small','middle');
 }else if(portrait&&kind==='gravity'){
  this.svg.setAttribute('viewBox','0 0 390 900');this.svg.style.aspectRatio='390 / 900';
  this.svg.innerHTML=this.gravities.map(({c,g},i)=>{if(i===0&&this.choice==='flip'&&Math.floor(this.t/3)%2)g=-g;const p={x:195,y:150+i*295},ch=chain(c,p,34);return guide(p,85)+ch.svg+text(195,30+i*295,g>0?'Normal: g = 9.8':g<0?'Inverted: g = −9.8':'Zero: g = 0','','middle')+arrow(ch.tip.x,ch.tip.y,0,Math.sign(g)*35,'#b95c24')+text(195,275+i*295,g===0?'Initial ω = 1 rad/s':'Released at 60°','small','middle');}).join('');
 }else{this.svg.setAttribute('viewBox','0 0 760 420');this.svg.style.aspectRatio='760 / 420';}
 this.status.textContent=(this.paused?'Paused · ':'')+'t = '+this.t.toFixed(2)+' s';
 }
 objects(map){let s='';const circ=(x,y,r,color,label)=>{const p=map({x,y});return circle(p.x,p.y,r*.4,'bob',`style="fill:${color}22;stroke:${color}"`)+(label?text(p.x,p.y+4,label,'small','middle'):'');};
 if(this.kind==='boost')s+=circ(440,560,35,'#147a88','+');
 if(this.kind==='bumper')s+=circ(455+40*Math.sin(this.t*1.8),550,33,'#b95c24','q');
 if(this.kind==='armor'&&this.targetAlive)s+=circ(460,590,27,'#b95c24',this.hp);
 if(this.kind==='switch'){s+=circ(460,580,27,this.swActive?'#147a88':'#b95c24','S');const A=map({x:310,y:520}),B=map({x:360,y:620});s+=line(A.x,A.y,B.x,B.y,this.swActive?'guide':'rod','#b95c24');}
 if(this.kind==='laser'){const A=map({x:330,y:570}),B=map({x:500,y:570});s+=line(A.x,A.y,B.x,B.y,'rod','#b74e53');}
 if(this.kind==='portal-motion')s+=circ(470,560,36,'#147a88','I')+circ(210,410,36,'#8b468f','O');
 if(this.kind==='field-motion'){const p=map({x:480,y:470});s+=circle(p.x,p.y,210*.4,'guide')+circ(480,470,24,this.choice==='repel'?'#147a88':'#8b468f','');}
 if(this.kind==='zone'){const p=map({x:280,y:510});s+=rect(p.x,p.y,240*.4,115*.4,+this.choice===2?'#faeddb':'#e3f2f6');}
 return s;}
 eventNotes(){const counts='Recorded contact events: '+this.eventCount;const lines={boost:['Tip circle overlaps the ring','ω_N += sign(ω_N) × 3.2','Geometry: green ring, pale bob',counts],bumper:['Moving circular pad','ω_N ← qω_N','q = '+this.choice,counts,'Only final angular velocity changes.'],armor:['Target hit points: '+this.hp,'Target '+(this.targetAlive?'alive':'cleared'),'Bob contact radius: '+this.a.currentR+' px',counts],switch:['Switch: '+(this.swActive?'active':'inactive'),'Gate: '+(this.swActive?'open':'closed'),'Remaining open: '+this.gateTimer.toFixed(2)+' s',counts],laser:['Shared shield lives: '+this.life,'Chain: '+(this.a.alive?'alive':'ended'),'Line hit: all angular speeds × −0.85',counts],zone:['Rectangle tests tip center','D = '+this.choice,'Exponential decay before RK4','RK4 also receives zone damping'], 'field-motion':['Field: '+(this.choice==='repel'?'repulsor':'attractor'),'Each joint receives angular kick','Core rule can bounce or end motion','Chain: '+(this.a.alive?'alive':'ended')], 'portal-motion':['IN and OUT are paired','Two-link inverse kinematics','Speed: max(0.5, 0.4|ω_N|)',counts], 'rail-contact':['Carriage carries the support','Track contacts test every joint','All angular speeds scaled on impact',counts]};return note(lines[this.kind]||['Coupled matrix dynamics','Fixed link lengths']);}

 portrait(){const kind=this.kind,t=this.t;let s='',height=500;
 const wrap=(str,x,y,max=38)=>{let lines=[],current='';for(const word of str.split(' ')){if((current+' '+word).trim().length>max){lines.push(current);current=word;}else current+=(current?' ':'')+word;}if(current)lines.push(current);return lines.map((v,i)=>text(x,y+i*23,v,'small')).join('');};
 if(['oscillation','wind-plot','sensitivity-plot'].includes(kind)){
 const D=root.TextbookData;
 if(kind==='sensitivity-plot'){
 height=790;s+=text(25,30,'Source data, RK4 h = 1/240 s','small');
 for(let panel=0;panel<2;panel++){const x=80,y=300+panel*370,w=280,h=190,vals=D.chaos.map(r=>panel?r[2]:Math.log10(Math.max(r[1],1e-9)));let lo=Math.min(...vals),hi=Math.max(...vals);const pad=(hi-lo)*.05;lo-=pad;hi+=pad;const map=(tt,v)=>[x+tt/20*w,y-(v-lo)/(hi-lo)*h];s+=axes(x,y,w,h,'Time (s)',panel?'Relative energy change':'Tip separation (m, log scale)')+path(D.chaos.map((r,i)=>map(r[0],vals[i])),panel?'#8b468f':'#147a88');for(let j=0;j<3;j++){const val=lo+(hi-lo)*j/2;s+=text(x-8,y-j*h/2+4,panel?val.toExponential(1):'10^'+val.toFixed(1),'small','end');}for(const tt of [0,10,20])s+=text(x+tt/20*w,y+20,tt,'small','middle');const row=D.chaos[Math.round(t%20*60)],v=panel?row[2]:Math.log10(Math.max(row[1],1e-9));s+=circle(...map(t%20,v),4,'','fill="#b95c24"');}
 }else{
 height=440;const wind=kind==='wind-plot',x=55,y=315,w=310,h=205,end=wind?8:12,map=(tt,v)=>[x+tt/end*w,y-(v+(wind?2.6:1.1))/(wind?5.2:2.2)*h];s+=text(20,30,wind?'f = 0, A = 2.4, Ω = 1.6, φ = 0':'10°: teal · 60°: orange','small')+text(20,55,wind?'Wind acceleration (model m/s²)':'Gray: small-angle formula','small')+axes(x,y,w,h,'Time (s)',wind?'a_w':'Angle / release angle');for(const v of wind?[-2,0,2]:[-1,0,1])s+=line(x,map(0,v)[1],x+w,map(0,v)[1],'guide')+text(x-8,map(0,v)[1]+4,v,'small','end');for(const tt of wind?[0,2,4,6,8]:[0,3,6,9,12])s+=text(x+tt/end*w,y+20,tt,'small','middle');if(wind){s+=path(Array.from({length:401},(_,i)=>map(i*.02,2.4*Math.sin(1.6*i*.02))));s+=circle(...map(t%8,2.4*Math.sin(1.6*(t%8))),5,'','fill="#b95c24"');}else{for(const [col,idx,n] of [['#147a88',1,10],['#b95c24',2,60]])s+=path(D.osc.filter(r=>r[0]<=12).map(r=>map(r[0],r[idx]/n)),col);s+=path(Array.from({length:301},(_,i)=>map(i*.04,Math.cos(Math.sqrt(9.8/2.5)*i*.04))),'#8e969b',1);const row=D.osc[Math.round(t%12*60)];s+=circle(...map(t%12,row[1]/10),4,'','fill="#147a88"')+circle(...map(t%12,row[2]/60),4,'','fill="#b95c24"');}}
 }else if(kind==='pipeline'||kind==='rk4'){
 const stages=kind==='pipeline'?['Frame clock, hit-stop and scaled time','Gravity flip and gate countdowns','Wind, moving pivot and obstacle positions','Zone decay → coupled RK4, four substeps','Last substep: contacts and arcade rules','Each substep: clone contacts and clock','Effects, timer, result and rendering']:['Current coupled vector state zₙ','Four tentative derivative estimates; each solves the mass matrix','Weighted average: (k₁ + 2k₂ + 2k₃ + k₄) h/6','Next coupled vector state zₙ₊₁'];height=stages.length*100+25;stages.forEach((v,i)=>{const y=10+i*100;s+=rect(15,y,360,75,Math.floor(t*1.5)%stages.length===i?'#cfe6e9':'#f5f9fa')+wrap(v,30,y+27,37);if(i<stages.length-1)s+=arrow(195,y+76,0,20);});
 }else if(kind==='circles'){
 height=510;const x=215+55*Math.cos(t),dist=x-130;s=circle(130,160,50)+circle(x,160,40,'bob','style="fill:#f8ded9;stroke:#b95c24"')+line(130,70,x,70)+text(195,40,'d = '+dist.toFixed(1),'','middle')+text(90,235,'rᵦ = 50','small')+text(235,235,'rₒ = 40','small')+note(['Circle overlap test',dist<90?'d < rᵦ + rₒ: contact':'d ≥ rᵦ + rₒ: clear','Prescribed centers; not dynamics.'],25,335);
 }else if(kind==='segment'){
 height=520;const p={x:25+(t%6)/6*340,y:135+35*Math.sin(t)},A={x:65,y:245},B={x:310,y:245},C=R.segment(p,A,B);s=line(A.x,A.y,B.x,B.y,'rod','#b95c24')+circle(p.x,p.y,16)+line(p.x,p.y,C.x,C.y,'guide')+circle(C.x,C.y,3,'','fill="#147a88"')+text(p.x,p.y-25,'P','','middle')+text(A.x,275,'A')+text(B.x,275,'B')+text(C.x,305,'closest C','small','middle')+note(['Clamp projection to the segment','u = '+C.u.toFixed(2),'Contact threshold: rᵦ + rₛ','Prescribed geometry; no dynamics.'],25,365);
 }else if(kind==='sampling'){
 height=460;const x=30+(t%4)/4*330;s=line(30,170,360,170,'guide')+line(195,65,195,270,'rod','#b95c24')+circle(135,170,16,'guide')+circle(255,170,16,'guide')+circle(x,170,16)+text(135,310,'Sample n','small','middle')+text(255,310,'Sample n+1','small','middle')+wrap('A fast path crosses between sampled positions. Prescribed motion, not a pendulum.',20,365);
 }else if(kind==='clocks'){
 height=490;s=note(['Wall clock: '+t.toFixed(2)+' s','Simulation clock: '+this.clock.toFixed(2)+' s'],25,45)+text(25,155,'Wall time')+rect(25,175,335,36)+rect(25,175,t%10*33.5,36,'#c5dce3')+text(25,265,'Simulated time')+rect(25,285,335,36)+rect(25,285,this.clock%10*33.5,36,'#d5e9d9')+wrap('The controls pause both illustration clocks.',25,405);
 }else if(kind==='verification'){
 height=460;const x=f=>35+f/210*320;s=line(35,170,355,170,'rod');for(const f of [0,36,100,204])s+=line(x(f),160,x(f),185)+text(x(f),210,'f '+f,'small','middle');s+=arrow(x(36),80,0,70)+arrow(x(100),80,0,70)+text(x(36),60,'Pulse 1','small','middle')+text(x(100),60,'Pulse 2','small','middle')+circle(x(Math.min(210,t*60)),170,6)+wrap('60 Hz input timeline. Frame 36 = 0.60 s; frame 100 ≈ 1.67 s. Documented clear: about 3.40 s. This is not a new stage verification.',25,290);
 }else if(kind==='fields'){
 height=800;for(const [i,rep] of [[0,false],[1,true]]){const y=165+i*390;s+=circle(195,y,105,'guide')+circle(195,y,24)+text(195,y-135,rep?'Repulsor':'Attractor','','middle');for(let j=0;j<8;j++){const a=j*TAU/8,r=rep?55:92,d=rep?38:-38;s+=arrow(195+r*Math.cos(a),y+r*Math.sin(a),d*Math.cos(a),d*Math.sin(a),rep?'#147a88':'#b95c24');}s+=text(195,y+145,rep?'Outward kick; core bounce':'Inward kick; dangerous tip core','small','middle');}
 }else if(kind==='bomb'){
 height=600;const active=t%4>1.2;s=circle(170,180,110,'guide')+circle(170,180,22,'bob','style="fill:#f4d6ba;stroke:#b95c24"')+text(170,186,'B','','middle');for(const [x,y]of [[220,140],[115,225],[325,180]]){const inside=Math.hypot(x-170,y-180)<110;s+=circle(x,y,16,'bob',`style="fill:#f1caca;opacity:${active&&inside?.3:1}"`)+text(x,y+5,'T','small','middle');}if(active)s+=circle(170,180,Math.min(110,(t%4-1.2)*130),'','fill="none" stroke="#b95c24"');s+=note(['145 px center-distance rule','Inside: non-bomb targets cleared','Outside: remains alive','Other bombs do not detonate','No mechanical blast impulse','Repeats every four seconds.'],25,365);
 }else if(kind==='portal'){
 height=800;for(const el of [...this.svg.children]){const bb=el.getBBox();if(bb.x>=390)el.setAttribute('transform','translate(-420 360)');else if(el.tagName==='line'&&+el.getAttribute('x2')>=390)el.remove();}this.svg.setAttribute('viewBox','0 0 390 800');this.svg.style.aspectRatio='390 / 800';return;
 }
 this.svg.innerHTML=s;this.svg.setAttribute('viewBox',`0 0 390 ${height}`);this.svg.style.aspectRatio=`390 / ${height}`;
 }
 plot(){const kind=this.kind,D=root.TextbookData;let s='';
 if(kind==='oscillation'){
 const x=70,y=310,w=640,h=220,map=(t,v)=>[x+t/12*w,y-(v+1.1)/2.2*h];s+=axes(x,y,w,h,'Time (s)','Angle / release angle');for(const v of [-1,0,1]){const yy=map(0,v)[1];s+=line(x,yy,x+w,yy,'guide')+text(55,yy+5,v,'small','end');}for(const tt of [0,3,6,9,12])s+=text(map(tt,0)[0],y+20,tt,'small','middle');for(const [idx,n,col] of [[1,10,'#147a88'],[2,60,'#b95c24']])s+=path(D.osc.filter(r=>r[0]<=12).map(r=>map(r[0],r[idx]/n)),col);s+=path(Array.from({length:301},(_,i)=>map(i*.04,Math.cos(Math.sqrt(9.8/2.5)*i*.04))),'#8e969b',1);const t=this.t%12,r=D.osc[Math.round(t*60)];s+=line(map(t,0)[0],y-h,map(t,0)[0],y,'guide')+circle(...map(t,r[1]/10),4,'','fill="#147a88"')+circle(...map(t,r[2]/60),4,'','fill="#b95c24"')+text(75,45,'10° normalized (teal) · 60° normalized (orange) · small-angle formula (gray)','small');
 }else if(kind==='wind-plot'){
 const x=75,y=310,w=620,h=210,map=(t,v)=>[x+t/8*w,y-(v+2.6)/5.2*h];s+=axes(x,y,w,h,'Game time (s)','Wind acceleration (model m/s²)');for(const v of [-2,0,2]){const yy=map(0,v)[1];s+=line(x,yy,x+w,yy,'guide')+text(60,yy+5,v,'small','end');}for(const tt of [0,2,4,6,8])s+=text(map(tt,0)[0],y+20,tt,'small','middle');s+=path(Array.from({length:401},(_,i)=>map(i*.02,2.4*Math.sin(1.6*i*.02))));const t=this.t%8;s+=circle(...map(t,2.4*Math.sin(1.6*t)),5,'','fill="#b95c24"')+line(map(t,0)[0],y-h,map(t,0)[0],y,'guide')+text(75,45,'f = 0, A = 2.4, Ω = 1.6, φ = 0');
 }else{
 const data=D.chaos,t=this.t%20,row=data[Math.min(data.length-1,Math.round(t*60))];
 for(let panel=0;panel<2;panel++){const x=75+panel*380,y=305,w=270,h=195;const vals=data.map(r=>panel?r[2]:Math.log10(Math.max(r[1],1e-9)));let min=Math.min(...vals),max=Math.max(...vals);const pad=(max-min)*.05||1e-10;min-=pad;max+=pad;const map=(tt,v)=>[x+tt/20*w,y-(v-min)/(max-min)*h];s+=axes(x,y,w,h,'Time (s)',panel?'Relative energy change':'Tip separation (model m, log)')+path(data.map((r,i)=>map(r[0],vals[i])),panel?'#8b468f':'#147a88');for(const tt of [0,10,20])s+=text(x+tt/20*w,y+20,tt,'small','middle');for(let j=0;j<3;j++){const val=min+(max-min)*j/2;s+=text(x-8,y-j*h/2+4,panel?val.toExponential(1):'10^'+val.toFixed(1),'small','end');}const v=panel?row[2]:Math.log10(Math.max(row[1],1e-9));s+=circle(...map(t,v),4,'','fill="#b95c24"')+line(map(t,v)[0],y-h,map(t,v)[0],y,'guide');}s+=text(75,45,'Original source data, h = 1/240 s, no stage contacts','small');
 }
 return s;}
}
root.TextbookDiagrams={Diagram,chain,guide,arrow};
})(globalThis);
