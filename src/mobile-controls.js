import { setExplorerEnabled } from './engine/explorer.js';
import { setEnvironmentsEnabled } from './engine/environments.js';
export function installMobileControls({ $, preferences, setAudioPreferences, savePreferences, pauseGame, strings, appearance }) {
  const dialog = $('settingsDialog');
  $('explorerBob').checked = preferences.explorer !== false;
  $('explorerBob').addEventListener('change', () => { preferences = {...preferences, explorer:$('explorerBob').checked}; setExplorerEnabled(preferences.explorer); appearance.set(preferences.theme,preferences.mode); save(); });
  $('environmentBackgrounds').checked=preferences.environments !== false;
  $('environmentBackgrounds').addEventListener('change',()=>{ preferences={...preferences,environments:$('environmentBackgrounds').checked};setEnvironmentsEnabled(preferences.environments);appearance.set();save(); });
  $('soundVolume').value = preferences.volume * 100;
  $('volumeValue').textContent = `${Math.round(preferences.volume * 100)}%`;
  $('soundMuted').checked = preferences.muted;
  function apply() {
    preferences = { ...preferences, volume: Number($('soundVolume').value) / 100,
      muted: $('soundMuted').checked };
    $('volumeValue').textContent = `${Math.round(preferences.volume * 100)}%`;
    setAudioPreferences(preferences);
  }
  function save() {
    apply();
    $('settingsSaveStatus').textContent = savePreferences(preferences) ? strings().settingsSaved : strings().settingsUnsaved;
  }
  $('soundVolume').addEventListener('input', apply);
  $('soundVolume').addEventListener('change', save);
  $('soundMuted').addEventListener('change', save);
  $('btnSettings').addEventListener('click', () => {
    pauseGame();
    $('settingsSaveStatus').textContent = '';
    dialog.showModal();
    $('environmentBackgrounds').focus({ preventScroll: true });
    dialog.scrollTop = 0;
  });
  $('settingsClose').addEventListener('click', () => dialog.close());
}
