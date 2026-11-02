// M9 explorer sprite animation is visual-only and deterministic.
export function explorerSpriteFrame({expression='ready',time=0,reducedMotion=false,homecoming=false}={}){
 const state=homecoming||expression==='homecoming'?'homecoming':expression==='happy'||expression==='celebrate'?'celebration':expression==='impact'?'impact':expression==='swinging'||expression==='focused'?'swinging':'idle';
 const index={idle:0,swinging:1,impact:2,celebration:3,homecoming:4}[state];
 const t=Number.isFinite(time)?time:0;
 const bob=reducedMotion?0:state==='celebration'?Math.sin(t*9)*1.3:state==='idle'?Math.sin(t*2)*.55:state==='homecoming'?Math.sin(t*7)*.9:0;
 const sway=reducedMotion?0:state==='swinging'?Math.sin(t*7)*.045:state==='celebration'?Math.sin(t*9)*.07:0;
 return Object.freeze({state,index,bob,sway});
}
