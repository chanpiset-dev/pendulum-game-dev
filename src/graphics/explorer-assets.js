// Reusable M9 Phase 1B sprite sheet. Image loading never changes gameplay.
export const EXPLORER_STATES=Object.freeze(['idle','swinging','impact','celebration','homecoming']);
export const EXPLORER_SHEET_URL=new URL('../../assets/explorer/fantasy-explorer-sprites.svg',import.meta.url).href;
let image=null,status='unloaded';
export function explorerAssetStatus(){return status;}
export function getExplorerSheet(){
 if(status==='ready')return image;
 if(status==='failed'||status==='loading'||typeof Image==='undefined')return null;
 status='loading';
 try {
  const next=new Image();
  next.onload=()=>{if(next.naturalWidth>=640&&next.naturalHeight>=128){image=next;status='ready';}else status='failed';};
  next.onerror=()=>{status='failed';};
  next.src=EXPLORER_SHEET_URL;
 }catch{status='failed';}
 return null;
}
