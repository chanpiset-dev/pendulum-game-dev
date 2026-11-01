import { generateStageData } from './data/stage-index.js';
import { STAGE_CONFIGS } from './data/stage-configs.js';

export const MECHANIC_FILTERS = [
  ['all','All mechanics','すべての仕掛け'],
  ['bomb','Bombs','爆弾'],['armored','Armored targets','装甲ターゲット'],
  ['portal','Portals','ポータル'],['boost','Boost rings','ブーストリング'],
  ['laser','Lasers','レーザー'],['bumper','Bumpers','バンパー'],
  ['spring','Spring bumpers','スプリング'],['absorber','Absorbers','吸収体'],
  ['switch','Switches / gates','スイッチ・ゲート'],
  ['anchor','Moving anchors','動く支点'],['wind','Wind / gusts','風・突風'],
  ['blackhole','Black holes','ブラックホール'],['repulsor','Repulsors','反発力場'],
  ['gravity','Gravity modes','重力モード'],['slime','Slime zones','スライム'],
  ['resin','Resin zones','レジン'],['moving','Moving obstacles','移動障害物'],
  ['multi','Multi-link','多関節'],['clones','Clones','クローン'],
];
const mechanics = new Map();
export function getStageMechanics(index) {
  if(mechanics.has(index)) return mechanics.get(index);
  const d=generateStageData(index,{x:400,y:300}),cfg=STAGE_CONFIGS[Math.ceil(index/5)];
  const holes=!d.blackhole?[]:Array.isArray(d.blackhole)?d.blackhole:[d.blackhole];
  const rest=o=>o.restitution??-0.8;
  const flags={
    bomb:d.targets.some(t=>t.isBomb),armored:d.targets.some(t=>!t.isBomb&&t.hp>1),
    portal:!!d.portals?.length,boost:!!d.boostRings?.length,laser:!!d.lasers?.length,
    bumper:!!d.obstacles.length,spring:d.obstacles.some(o=>rest(o)<-1),absorber:d.obstacles.some(o=>Math.abs(rest(o))<.2),
    switch:!!d.switches?.length,anchor:!!(d.rail&&((d.rail.ampX||d.rail.amp||0)>0||(d.rail.ampY||0)>0)),wind:!!(d.wind&&(d.wind.fx||d.wind.amp)),
    blackhole:holes.some(h=>!h.isRepulsor),repulsor:holes.some(h=>h.isRepulsor),
    gravity:(d.gravity??9.8)!==9.8||!!d.gravityInversionInterval,
    slime:!!d.zones?.some(z=>!z.isResin),resin:!!d.zones?.some(z=>z.isResin),
    moving:d.obstacles.some(o=>o.ampX>0&&(o.speed||0)!==0),
    multi:(d.lockedN??cfg.lockedN??2)>2,clones:(d.lockedClone??cfg.lockedClone??1)>1,
  };
  const result=Object.freeze(Object.keys(flags).filter(key=>flags[key]));mechanics.set(index,result);return result;
}
export function matchesProgressFilter(status,{locked,score,time,stars}){
  const cleared=score!==undefined||time!==undefined||stars>0;
  if(status==='uncleared')return !locked&&!cleared;
  if(status==='missing')return !locked&&cleared&&(stars||0)<3;
  return true;
}
