import { installFantasyEnvironments } from './fantasy-environments.js';
import { ENVIRONMENT_WORLDS, getEnvironmentRenderer, registerEnvironmentRenderer, unregisterEnvironmentRenderer } from './environment-registry.js';
import { drawEnvironment } from '../engine/environments.js';

export const ENVIRONMENT_SKIN_STORAGE_KEY = 'pendulum.environment.skin.v1';
export const normalizeEnvironmentSkin = value => value === 'fantasy' ? 'fantasy' : 'legacy';
const SAMPLES = Object.freeze([
  [1,'Enchanted Forest Ruins'],[41,'Wind Sanctuary'],[81,'Clockwork Hall'],
  [111,'Portal Temple'],[166,'Ancient Machinery'],[211,'Celestial Chamber']
]);

export function installEnvironmentSkinSettings({ $, storage } = {}) {
  const select=$('environmentArtworkSkin'),dialog=$('environmentPreviewDialog');
  const gallery=$('environmentPreviewGallery'),mode=$('environmentPreviewMode');
  if(!select||!dialog||!gallery||!mode)return ()=>{};
  let store=storage;
  if(!store){try{store=window.localStorage;}catch{store=null;}}
  let saved=null;
  try{saved=store?.getItem(ENVIRONMENT_SKIN_STORAGE_KEY);}catch{/* private mode */}
  let uninstall=null;
  function activate(value){
    if(uninstall){uninstall();uninstall=null;}
    select.value=normalizeEnvironmentSkin(value);
    if(select.value==='fantasy')uninstall=installFantasyEnvironments();
  }
  activate(saved);
  function change(){
    activate(select.value);
    try{store?.setItem(ENVIRONMENT_SKIN_STORAGE_KEY,select.value);}catch{/* private mode */}
  }
  select.addEventListener('change',change);
  function withWorld(index,fantasy,draw){
    const chapter=Math.ceil(index/5);
    const id=ENVIRONMENT_WORLDS[chapter<=8?1:chapter<=16?2:chapter<=22?3:chapter<=33?4:chapter<=42?5:6];
    const prior=getEnvironmentRenderer(id);
    if(fantasy){
      const undo=installFantasyEnvironments();
      try{return draw();}finally{undo();}
    }
    if(prior)unregisterEnvironmentRenderer(id);
    try{return draw();}finally{if(prior)registerEnvironmentRenderer(id,prior);}
  }
  function paint(){
    gallery.replaceChildren();
    for(const [index,name] of SAMPLES){
      const section=document.createElement('section');
      section.className='environment-preview-world';
      const title=document.createElement('h3');title.textContent=name;
      const pair=document.createElement('div');pair.className='environment-preview-pair';
      for(const fantasy of [false,true]){
        if(mode.value==='legacy'&&fantasy||mode.value==='fantasy'&&!fantasy)continue;
        const item=document.createElement('figure'),canvas=document.createElement('canvas');
        canvas.width=480;canvas.height=270;
        canvas.setAttribute('role','img');
        canvas.setAttribute('aria-label',name+' '+(fantasy?'Fantasy':'Original'));
        const caption=document.createElement('figcaption');
        caption.textContent=fantasy?'Fantasy':'Original';
        const ctx=canvas.getContext('2d');
        withWorld(index,fantasy,()=>drawEnvironment(ctx,canvas.width,canvas.height,{index,targets:[],reduced:true}));
        item.append(canvas,caption);pair.append(item);
      }
      section.append(title,pair);gallery.append(section);
    }
  }
  function open(){
    paint();
    $('settingsDialog')?.close();
    dialog.showModal();
  }
  function close(){
    dialog.close();
    $('settingsDialog')?.showModal();
  }
  const openBtn=$('btnEnvironmentPreview'),closeBtn=$('environmentPreviewClose');
  openBtn.addEventListener('click',open);
  closeBtn.addEventListener('click',close);
  mode.addEventListener('change',paint);
  return ()=>{
    select.removeEventListener('change',change);
    openBtn.removeEventListener('click',open);
    closeBtn.removeEventListener('click',close);
    mode.removeEventListener('change',paint);
    if(uninstall)uninstall();
  };
}
