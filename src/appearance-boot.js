// Apply saved appearance before CSS paints; storage is optional and never blocks startup.
(() => {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('pendulum_preferences_v1')) || {}; } catch {}
  document.documentElement.dataset.theme = typeof saved.theme === 'string' ? saved.theme : 'neon-arcade';
  const mode = ['dark', 'light', 'system'].includes(saved.mode) ? saved.mode : 'dark';
  document.documentElement.dataset.mode = mode === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
})();
