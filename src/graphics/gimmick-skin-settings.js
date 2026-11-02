import { installFantasyGimmickSkins } from './fantasy-gimmicks.js';
export const GIMMICK_SKIN_STORAGE_KEY = 'pendulum.gimmick.skin.v1';
export const normalizeGimmickSkin = value => value === 'fantasy' ? 'fantasy' : 'legacy';
export function installGimmickSkinSettings({ $, storage } = {}) {
  const select = $('gimmickArtworkSkin');
  if (!select) return () => {};
  let store=storage;
  if (!store) { try { store=window.localStorage; } catch { store=null; } }
  let saved=null;
  try { saved=store?.getItem(GIMMICK_SKIN_STORAGE_KEY); } catch { /* storage denied */ }
  let undo=null;
  function activate(value) {
    if (undo) { undo(); undo=null; }
    select.value=normalizeGimmickSkin(value);
    if (select.value==='fantasy') undo=installFantasyGimmickSkins();
  }
  activate(saved);
  function change() {
    activate(select.value);
    try { store?.setItem(GIMMICK_SKIN_STORAGE_KEY,select.value); } catch { /* storage denied */ }
  }
  select.addEventListener('change',change);
  return () => { select.removeEventListener('change',change);if(undo)undo(); };
}
