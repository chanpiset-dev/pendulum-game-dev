import { DEFAULT_THEME, DEFAULT_MODE, refreshCanvasPalette } from './themes.js';
export function createAppearance(preferences, onChange = () => {}) {
  function apply() {
    document.documentElement.dataset.theme = DEFAULT_THEME;
    document.documentElement.dataset.mode = DEFAULT_MODE;
    const palette=refreshCanvasPalette();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',palette.panel);
    onChange(palette);
  }
  apply();
  return {set:apply};
}
