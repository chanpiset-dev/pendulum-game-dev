export const DEFAULT_THEME = 'neon-arcade';
export const DEFAULT_MODE = 'dark';
export const THEMES = [
  ['neon-arcade', 'Neon Arcade', 'retro', '#020503', '#eff9ee', '#56d364'],
  ['pocket-console', 'Pocket Console', 'retro', '#202b25', '#e8edd0', '#b8d76a'],
  ['16bit-adventure', '16-Bit Adventure', 'retro', '#101b39', '#fff1d3', '#f0c65a'],
  ['clean-precision', 'Clean Precision', 'modern', '#111b24', '#f5f8fc', '#31d0a1'],
  ['glass-orbit', 'Glass Orbit', 'modern', '#091d32', '#eaf5ff', '#2ed4ed'],
  ['soft-studio', 'Soft Studio', 'modern', '#292823', '#faf5ec', '#85c7bb'],
  ['blueprint-lab', 'Blueprint Lab', 'creative', '#071d36', '#eef7ff', '#53b9f5'],
  ['cosmic-observatory', 'Cosmic Observatory', 'creative', '#15112e', '#f6f1ff', '#bc9aff'],
  ['paper-workshop', 'Paper Workshop', 'creative', '#292116', '#faf0d9', '#e8ba59'],
].map(([id, name, group, dark, light, accent]) => ({ id, name, group, dark, light, accent }));
export const isTheme = value => THEMES.some(theme => theme.id === value);
export const isMode = value => ['system', 'dark', 'light'].includes(value);
let palette;
export function refreshCanvasPalette() {
  const style = getComputedStyle(document.documentElement);
  const token = name => style.getPropertyValue(`--${name}`).trim();
  palette = Object.fromEntries(['canvas', 'grid', 'rod', 'platform', 'accent', 'blue', 'danger', 'text', 'muted', 'bob', 'panel', 'line', 'yellow'].map(name => [name, token(name)]));
  palette.theme = document.documentElement.dataset.theme || DEFAULT_THEME;
  palette.mode = document.documentElement.dataset.mode || DEFAULT_MODE;
  return palette;
}
export function getCanvasPalette() { return palette || refreshCanvasPalette(); }
export function drawThemeBackdrop(ctx, width, height) {
  const p = getCanvasPalette();
  ctx.save();
  ctx.fillStyle = p.canvas; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = p.grid; ctx.lineWidth = 1;
  const spacing = p.theme === 'blueprint-lab' ? 20 : 40;
  for (let x = 20; x < width; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 20; y < height; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  if (p.theme === 'cosmic-observatory') {
    ctx.fillStyle = p.muted;
    for (let i = 0; i < 50; i++) { ctx.globalAlpha = 0.15 + (i % 4) * 0.1; ctx.fillRect((i * 137 + 43) % width, (i * 83 + 19) % height, i % 5 ? 1 : 2, i % 5 ? 1 : 2); }
  }
  if (p.theme === 'paper-workshop') {
    ctx.strokeStyle = p.grid;
    for (let y = 6; y < height; y += 8) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  }
  ctx.restore();
}
