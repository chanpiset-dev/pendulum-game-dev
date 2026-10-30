import { DEFAULT_THEME, DEFAULT_MODE, isTheme, isMode } from './themes.js';
// Keep the existing v6 keys so previously earned progress remains compatible.
export const PROGRESS_KEYS = {
  unlocked: 'pendulum_sub_unlocked_v6', scores: 'pendulum_stage_scores_v6',
  stars: 'pendulum_stage_stars_v6', ghosts: 'pendulum_stage_ghosts_v6',
  briefed: 'pendulum_briefed_stages_v6', times: 'pendulum_stage_times_v6',
  language: 'pendulum_lang', preferences: 'pendulum_preferences_v1',
};
const validStageKey = key => /^stage_([1-9]|[1-4]\d|50)_sub_[1-5]$/.test(key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonnegative = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const point = value => record(value) && Number.isFinite(value.x) && Number.isFinite(value.y);

export function createProgressStore({ getStorage = () => globalThis.localStorage, onStatus = () => {} } = {}) {
  const problems = new Map();
  function report(success = 'Progress loaded.') {
    const values = [...problems.values()];
    const failed = values.some(value => value === 'failed');
    // Recovery and optional replay failures must not worry players when essential
    // progress remains usable. Keep reporting genuine storage-access failures.
    onStatus({ kind: failed ? 'error' : 'ok', message: failed
      ? 'Progress could not be fully saved or loaded. You can keep playing; changes may last only for this session.'
      : success });
  }
  function read(key) {
    try { return getStorage().getItem(key); }
    catch { problems.set(key, 'failed'); return null; }
  }
  function readRecord(key, validKey, validValue) {
    const raw = read(key);
    if (raw === null) return {};
    try {
      const data = JSON.parse(raw);
      if (!record(data)) throw new Error('Invalid record');
      const result = {};
      for (const [entry, value] of Object.entries(data)) {
        if (validKey(entry) && validValue(value, entry)) result[entry] = value;
        else problems.set(key, 'invalid');
      }
      return result;
    } catch { problems.set(key, 'invalid'); return {}; }
  }
  function load() {
    const rawUnlocked = read(PROGRESS_KEYS.unlocked);
    let unlocked = rawUnlocked === null ? 1 : Number(rawUnlocked);
    if (!Number.isInteger(unlocked) || unlocked < 1 || unlocked > 250) {
      unlocked = 1;
      problems.set(PROGRESS_KEYS.unlocked, 'invalid');
    }
    const rawLanguage = read(PROGRESS_KEYS.language);
    const language = rawLanguage === 'ja' ? 'ja' : 'en';
    if (rawLanguage !== null && !['en', 'ja'].includes(rawLanguage)) problems.set(PROGRESS_KEYS.language, 'invalid');
    const data = {
      unlocked, language,
      preferences: { volume: 1, muted: false, theme: DEFAULT_THEME, mode: DEFAULT_MODE, ...readRecord(PROGRESS_KEYS.preferences,
        key => ['volume', 'muted', 'theme', 'mode'].includes(key),
        (value, key) => key === 'volume' ? nonnegative(value) && value <= 1 : key === 'theme' ? isTheme(value) : key === 'mode' ? isMode(value) : typeof value === 'boolean') },
      scores: readRecord(PROGRESS_KEYS.scores, validStageKey, value => Number.isInteger(value) && nonnegative(value)),
      stars: readRecord(PROGRESS_KEYS.stars, validStageKey, value => Number.isInteger(value) && value >= 0 && value <= 3),
      times: readRecord(PROGRESS_KEYS.times, validStageKey, nonnegative),
      ghosts: readRecord(PROGRESS_KEYS.ghosts, validStageKey, value => Array.isArray(value) && value.every(point)),
      briefed: readRecord(PROGRESS_KEYS.briefed, key => /^stage_([1-9]|[1-4]\d|50)$/.test(key), value => typeof value === 'boolean'),
    };
    // A damaged or partially saved unlock counter must not hide earned clears.
    for (const key of new Set([...Object.keys(data.scores), ...Object.keys(data.stars), ...Object.keys(data.times)])) {
      const [, stage, sub] = /^stage_(\d+)_sub_(\d+)$/.exec(key);
      const next = (Number(stage) - 1) * 5 + Number(sub) + 1;
      data.unlocked = Math.max(data.unlocked, Math.min(250, next));
    }
    report();
    return data;
  }
  function write(key, value, optional = false) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      const storage = getStorage();
      try { storage.setItem(key, serialized); }
      catch (error) {
        if (optional || error.name !== 'QuotaExceededError') throw error;
        // Optional ghosts must never crowd out essential progress.
        storage.removeItem(PROGRESS_KEYS.ghosts);
        problems.set('replay-eviction', 'evicted');
        storage.setItem(key, serialized);
      }
      problems.delete(key);
      return true;
    } catch { problems.set(key, optional ? 'optional' : 'failed'); return false; }
  }
  function saveProgress({ unlocked, scores, stars, times, ghosts }) {
    // Attempt every essential record, even when a different record fails.
    write(PROGRESS_KEYS.unlocked, String(unlocked));
    write(PROGRESS_KEYS.scores, scores);
    write(PROGRESS_KEYS.stars, stars);
    write(PROGRESS_KEYS.times, times);
    if (ghosts) write(PROGRESS_KEYS.ghosts, ghosts, true);
    report('Progress saved.');
  }
  function saveSetting(name, value) {
    const ok = write(PROGRESS_KEYS[name], value);
    report('Settings saved.');
    return ok;
  }
  return { load, saveProgress, saveSetting };
}

export function limitGhosts(ghosts) {
  const result = {};
  let remaining = 20000;
  // Most recently updated entries are retained first.
  for (const [key, points] of Object.entries(ghosts).reverse()) {
    if (remaining <= 0) break;
    const stride = Math.max(1, Math.ceil(points.length / Math.min(900, remaining)));
    result[key] = points.filter((_, index) => index % stride === 0).slice(0, remaining);
    remaining -= result[key].length;
  }
  // Store oldest first so the next insertion can still identify the newest data.
  return Object.fromEntries(Object.entries(result).reverse());
}
