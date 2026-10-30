export function installMobileControls({ $, preferences, setAudioPreferences, savePreferences, pauseGame, strings }) {
  const dialog = $('settingsDialog');
  const fullscreen = $('btnFullscreen');
  $('soundVolume').value = preferences.volume * 100;
  $('volumeValue').textContent = `${Math.round(preferences.volume * 100)}%`;
  $('soundMuted').checked = preferences.muted;
  $('hapticsEnabled').checked = preferences.haptics;
  $('hapticsEnabled').disabled = !navigator.vibrate;
  function apply() {
    preferences = { volume: Number($('soundVolume').value) / 100,
      muted: $('soundMuted').checked, haptics: $('hapticsEnabled').checked };
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
  $('hapticsEnabled').addEventListener('change', save);
  $('btnSettings').addEventListener('click', () => {
    pauseGame();
    $('settingsSaveStatus').textContent = '';
    dialog.showModal();
    $('soundVolume').focus();
  });
  $('settingsClose').addEventListener('click', () => dialog.close());
  fullscreen.disabled = !document.fullscreenEnabled || !document.documentElement.requestFullscreen;
  fullscreen.addEventListener('click', async () => {
    pauseGame();
    $('fullscreenStatus').textContent = '';
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { $('fullscreenStatus').textContent = strings().fullscreenFailed; }
  });
  document.addEventListener('fullscreenchange', () => {
    pauseGame();
    fullscreen.textContent = document.fullscreenElement ? strings().exitFullscreen : strings().fullscreen;
  });
}
