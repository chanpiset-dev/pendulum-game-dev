export function installMobileControls({ $, preferences, setAudioPreferences, savePreferences, pauseGame, strings }) {
  const dialog = $('settingsDialog');
  $('soundVolume').value = preferences.volume * 100;
  $('volumeValue').textContent = `${Math.round(preferences.volume * 100)}%`;
  $('soundMuted').checked = preferences.muted;
  function apply() {
    preferences = { volume: Number($('soundVolume').value) / 100,
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
    $('soundVolume').focus();
  });
  $('settingsClose').addEventListener('click', () => dialog.close());
}
