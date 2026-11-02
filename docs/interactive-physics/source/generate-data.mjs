// Optional reproduction of the numerical figure data using the actual release solver.
// Usage: node generate-data.mjs /path/to/pendulum-game-dev
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';
const root=path.resolve(process.argv[2]||'../pendulum-game-dev');
const {rk4,getDerivs}=await import(pathToFileURL(path.join(root,'src/physics.js')));
const data={osc:[],chaos:[],example:getDerivs(2,[Math.PI/6,-Math.PI/9,0,0],[1.25,1.25],[1,1],0,0,0,9.8,0)};
const one=a=>({N:1,L:[2.5],m:[1],state:[a,0]});
const small=one(Math.PI/18),large=one(Math.PI/3),a={N:2,L:[1.25,1.25],m:[1,1],state:[2*Math.PI/3,2*Math.PI/3,0,0]},b=structuredClone(a);
b.state[0]+=.001;b.state[1]+=.001;
const energy=c=>{let vx=0,vy=0,y=0,T=0,U=0;for(let i=0;i<c.N;i++){vx+=c.L[i]*Math.cos(c.state[i])*c.state[c.N+i];vy-=c.L[i]*Math.sin(c.state[i])*c.state[c.N+i];y+=c.L[i]*Math.cos(c.state[i]);T+=.5*c.m[i]*(vx*vx+vy*vy);U-=c.m[i]*9.8*y;}return T+U};
const pos=c=>[c.L.reduce((s,L,i)=>s+L*Math.sin(c.state[i]),0),c.L.reduce((s,L,i)=>s+L*Math.cos(c.state[i]),0)],E=energy(a);
for(let i=0;i<=4800;i++){
 const t=i/240;if(i%4===0){data.osc.push([t,small.state[0]*180/Math.PI,large.state[0]*180/Math.PI]);const p=pos(a),q=pos(b);data.chaos.push([t,Math.hypot(p[0]-q[0],p[1]-q[1]),(energy(a)-E)/Math.abs(E),...p,...q]);}
 for(const c of [small,large,a,b])rk4(c,1/240,0,0,0,9.8,0);
}
fs.writeFileSync(new URL('figures/model-data.json',import.meta.url),JSON.stringify(data));
console.log('Generated numerical data from',root);
