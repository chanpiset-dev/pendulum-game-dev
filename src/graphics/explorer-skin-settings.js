import { drawCharacter, getCharacterSkin, setCharacterSkin } from './character-renderer.js';

export const EXPLORER_SKIN_STORAGE_KEY = 'pendulum.explorer.skin.v1';
const allowed = new Set(['legacy','fantasy-explorer']);
export function normalizeExplorerSkin(value) { return allowed.has(value) ? value : 'legacy'; }

export function installExplorerSkinSettings({ $, storage = null } = {}) {
  const select = $('explorerSkin');
  const stateSelect = $('explorerPreviewState');
  const canvas = $('explorerSkinPreview');
  if (!select || !stateSelect || !canvas) return () => {};
  let store = storage;
  if (!store) {
    try { store = window.localStorage; } catch { store = null; }
  }
  let saved = null;
  try { saved = store?.getItem(EXPLORER_SKIN_STORAGE_KEY); } catch { /* blocked storage */ }
  select.value = normalizeExplorerSkin(saved);
  setCharacterSkin(select.value);
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let frameId = null;
  let running = false;
  let startTime = 0;
  function paint(time = 0) {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#12212b';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = '#6a8590';ctx.lineWidth=3;
    const pivot={x:w/2,y:24}, reach=Math.min(66,h*0.45);
    const seconds = (time-startTime)/1000;
    const motion = stateSelect.value === 'swinging' && !reduce?.matches ? Math.sin(seconds*2)*0.7 : 0.32;
    const tip={x:pivot.x+Math.sin(motion)*reach,y:pivot.y+Math.cos(motion)*reach};
    ctx.beginPath();ctx.moveTo(pivot.x,pivot.y);ctx.lineTo(tip.x,tip.y);ctx.stroke();
    ctx.fillStyle='#42b8ad';ctx.beginPath();ctx.arc(tip.x,tip.y,21,0,Math.PI*2);ctx.fill();
    const mood={idle:'ready',swinging:'focused',impact:'impact',celebration:'happy'}[stateSelect.value] || 'ready';
    drawCharacter(ctx,{...tip,radius:21,isTip:true},{skin:select.value,mood,time:reduce?.matches?0:seconds});
    if(running && !reduce?.matches) frameId=requestAnimationFrame(paint);
  }
  function start() { if(running)return;running=true;startTime=performance.now();paint(startTime); }
  function stop() { running=false;if(frameId!==null)cancelAnimationFrame(frameId);frameId=null; }
  function refresh() { if(!running)paint(performance.now()); }
  select.addEventListener('change',()=>{
    const id=normalizeExplorerSkin(select.value);
    select.value=id;setCharacterSkin(id);
    try { store?.setItem(EXPLORER_SKIN_STORAGE_KEY,id); } catch { /* blocked storage */ }
    refresh();
  });
  stateSelect.addEventListener('change',refresh);
  const dialog=$('settingsDialog');
  dialog?.addEventListener('close',stop);
  const observer = new MutationObserver(()=>{ if(dialog?.open)start();else stop(); });
  if(dialog)observer.observe(dialog,{attributes:true,attributeFilter:['open']});
  if(dialog?.open)start();
  return ()=>{stop();observer.disconnect();};
}
