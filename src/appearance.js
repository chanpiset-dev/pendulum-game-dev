import { DEFAULT_THEME, DEFAULT_MODE, isTheme, isMode, refreshCanvasPalette } from './themes.js';
export function createAppearance(preferences, onChange = () => {}) {
  const system = matchMedia('(prefers-color-scheme: dark)');
  let theme = isTheme(preferences.theme) ? preferences.theme : DEFAULT_THEME;
  let mode = isMode(preferences.mode) ? preferences.mode : DEFAULT_MODE;
  function apply() {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.mode = mode === 'system' ? (system.matches ? 'dark' : 'light') : mode;
    const palette = refreshCanvasPalette();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.panel);
    onChange(palette);
  }
  system.addEventListener('change', () => { if (mode === 'system') apply(); });
  apply();
  return { set(nextTheme, nextMode) {
    theme = isTheme(nextTheme) ? nextTheme : DEFAULT_THEME;
    mode = isMode(nextMode) ? nextMode : DEFAULT_MODE;
    apply();
  } };
}
