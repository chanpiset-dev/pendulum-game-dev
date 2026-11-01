import { setExplorerEnabled } from './engine/explorer.js';
import { THEMES } from './themes.js';
export function installMobileControls({ $, preferences, setAudioPreferences, savePreferences, pauseGame, strings, appearance }) {
  const dialog = $('settingsDialog');
  const choices = $('themeChoices');
  for (const group of ['retro', 'modern', 'creative']) {
    const heading = document.createElement('h4'); heading.dataset.themeGroup = group;
    const options = document.createElement('div'); options.className = 'theme-options';
    for (const theme of THEMES.filter(item => item.group === group)) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'theme-choice'; button.dataset.themeChoice = theme.id;
      button.setAttribute('aria-label', theme.name);
      const preview = document.createElement('span'); preview.className = 'theme-preview'; preview.setAttribute('aria-hidden', 'true');
      for (const background of [theme.dark, theme.light]) {
        const half = document.createElement('span'); half.style.background = background; half.style.setProperty('--preview-accent', theme.accent); preview.append(half);
      }
      const name = document.createElement('span'); name.textContent = theme.name;
      button.append(preview, name);
      button.addEventListener('click', () => { preferences = { ...preferences, theme: theme.id }; appearance.set(preferences.theme, preferences.mode); sync(); save(); });
      options.append(button);
    }
    choices.append(heading, options);
  }
  function sync() {
    $('appearanceMode').value = preferences.mode;
    choices.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === preferences.theme)));
  }
  sync();
  $('explorerBob').checked = preferences.explorer !== false;
  $('explorerBob').addEventListener('change', () => { preferences = {...preferences, explorer:$('explorerBob').checked}; setExplorerEnabled(preferences.explorer); appearance.set(preferences.theme,preferences.mode); save(); });
  $('appearanceMode').addEventListener('change', () => {
    preferences = { ...preferences, mode: $('appearanceMode').value };
    appearance.set(preferences.theme, preferences.mode); save();
  });
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
    $('appearanceMode').focus({ preventScroll: true });
    dialog.scrollTop = 0;
  });
  $('settingsClose').addEventListener('click', () => dialog.close());
}
