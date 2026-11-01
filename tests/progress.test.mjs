import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressStore, PROGRESS_KEYS as keys, limitGhosts } from '../src/progress.js';

function fixture(entries = {}) {
  const data = new Map(Object.entries(entries));
  const statuses = [];
  const storage = { getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  return { data, storage, statuses, store: createProgressStore({ getStorage: () => storage, onStatus: status => statuses.push(status) }) };
}
const progress = () => ({ unlocked: 2, scores: { stage_1_sub_1: 1250 },
  stars: { stage_1_sub_1: 3 }, times: { stage_1_sub_1: 4.2 }, ghosts: { stage_1_sub_1: [{ x: 1, y: 2 }] } });

test('Current progress loads without inventing old completion times', () => {
  const f = fixture({ [keys.unlocked]: '80', [keys.scores]: '{"stage_1_sub_1":1500}', [keys.stars]: '{"stage_1_sub_1":3}', [keys.language]: 'ja' });
  const loaded = f.store.load();
  assert.equal(loaded.unlocked, 80);
  assert.equal(loaded.scores.stage_1_sub_1, 1500);
  assert.equal(loaded.stars.stage_1_sub_1, 3);
  assert.equal(loaded.language, 'ja');
  assert.deepEqual(loaded.times, {});
});

test('Corrupt records recover independently and retain valid entries', () => {
  const f = fixture({ [keys.unlocked]: 'NaN', [keys.language]: 'xx', [keys.ghosts]: 'null',
    [keys.scores]: '{"stage_1_sub_1":500,"stage_1_sub_2":"bad","stage_90_sub_1":100}',
    [keys.stars]: '{"stage_1_sub_1":3,"stage_1_sub_2":7}', [keys.times]: '[]', [keys.briefed]: '{broken' });
  const loaded = f.store.load();
  assert.deepEqual(loaded.scores, { stage_1_sub_1: 500 });
  assert.deepEqual(loaded.stars, { stage_1_sub_1: 3 });
  assert.equal(loaded.language, 'en');
  assert.equal(loaded.unlocked, 2, 'Earned clears recover the damaged unlock counter');
  assert.deepEqual(loaded.times, {});
  assert.equal(f.statuses.at(-1).kind, 'ok');
});

test('Unavailable storage yields playable defaults and a visible error status', () => {
  const statuses = [];
  const store = createProgressStore({ getStorage: () => { throw new Error('Access denied'); }, onStatus: s => statuses.push(s) });
  assert.equal(store.load().unlocked, 1);
  store.saveProgress(progress());
  assert.equal(statuses.at(-1).kind, 'error');
});

test('Optional ghost-write failure does not block any essential progress', () => {
  const f = fixture();
  const write = f.storage.setItem;
  f.storage.setItem = (key, value) => { if (key === keys.ghosts) throw new Error('Replay denied'); write(key, value); };
  f.store.saveProgress(progress());
  assert.equal(f.data.get(keys.unlocked), '2');
  assert.deepEqual(JSON.parse(f.data.get(keys.scores)), progress().scores);
  assert.deepEqual(JSON.parse(f.data.get(keys.stars)), progress().stars);
  assert.deepEqual(JSON.parse(f.data.get(keys.times)), progress().times);
  assert.equal(f.statuses.at(-1).kind, 'ok');
  assert.equal(f.statuses.at(-1).message, 'Progress saved.');
});

test('A failing score write does not stop unlock, star or time writes', () => {
  const f = fixture(); const write = f.storage.setItem;
  f.storage.setItem = (key, value) => { if (key === keys.scores) throw new Error('Denied'); write(key, value); };
  f.store.saveProgress(progress());
  assert.equal(f.data.get(keys.unlocked), '2');
  assert.ok(f.data.has(keys.stars) && f.data.has(keys.times));
  assert.equal(f.statuses.at(-1).kind, 'error');
  f.store.saveSetting('language', 'en');
  assert.equal(f.statuses.at(-1).kind, 'error', 'An unrelated successful write must not hide the failure');
});

test('Quota recovery frees optional ghosts before retrying essential progress', () => {
  const f = fixture({ [keys.ghosts]: 'large optional history' }); const write = f.storage.setItem;
  f.storage.setItem = (key, value) => {
    if (key !== keys.ghosts && f.data.has(keys.ghosts)) throw Object.assign(new Error('Full'), { name: 'QuotaExceededError' });
    write(key, value);
  };
  f.store.saveProgress({ ...progress(), ghosts: null });
  assert.equal(f.data.get(keys.unlocked), '2');
  assert.equal(f.data.has(keys.ghosts), false);
  assert.equal(f.statuses.at(-1).kind, 'ok');
});

test('Saving and reloading retains new best-time records', () => {
  const f = fixture(); f.store.saveProgress(progress());
  const loaded = f.store.load();
  assert.deepEqual(loaded.times, progress().times);
  assert.equal(loaded.unlocked, 2);
});

test('Replay storage has bounded points and prefers recently updated stages', () => {
  const ghosts = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`stage_${i + 1}_sub_1`, Array.from({ length: 2000 }, (_, x) => ({ x, y: 2 }))]));
  const bounded = limitGhosts(ghosts);
  assert.ok(Object.values(bounded).flat().length <= 20000);
  assert.ok(Object.values(bounded).every(points => points.length <= 900));
  assert.ok(bounded.stage_50_sub_1);
});

test('Successful retry clears a genuine save failure', () => {
  const f = fixture();
  const write = f.storage.setItem;
  f.storage.setItem = () => { throw new Error('Denied'); };
  f.store.saveProgress(progress());
  assert.equal(f.statuses.at(-1).kind, 'error');
  f.storage.setItem = write;
  f.store.saveProgress(progress());
  assert.equal(f.statuses.at(-1).kind, 'ok');
});

test('Sound preferences persist and legacy vibration values do not affect recovery', () => {
  const f = fixture({ [keys.preferences]: '{"volume":2,"muted":true,"haptics":"bad"}' });
  assert.deepEqual(f.store.load().preferences, { volume: 1, muted: true, explorer: true, theme: 'clean-precision', mode: 'dark' });
  assert.equal(f.store.saveSetting('preferences', { volume: 0.35, muted: false }), true);
  assert.deepEqual(f.store.load().preferences, { volume: 0.35, muted: false, explorer: true, theme: 'clean-precision', mode: 'dark' });
  assert.equal(f.statuses.at(-1).kind, 'ok');
});

test('Appearance preferences recover independently and preserve sound settings', () => {
  const f = fixture({ [keys.preferences]: '{"theme":"unknown","mode":"broken","volume":0.25,"muted":true}' });
  assert.deepEqual(f.store.load().preferences, { theme: 'clean-precision', mode: 'dark', volume: 0.25, muted: true, explorer: true });
  f.store.saveSetting('preferences', { theme: 'paper-workshop', mode: 'system', volume: 0.25, muted: true });
  assert.deepEqual(f.store.load().preferences, { theme: 'paper-workshop', mode: 'system', volume: 0.25, muted: true, explorer: true });
});

test('Classic bob preference persists and invalid values recover', () => {
  const f=fixture({[keys.preferences]:'{"explorer":"no"}'});
  assert.equal(f.store.load().preferences.explorer,true);
  f.store.saveSetting('preferences',{explorer:false});
  assert.equal(f.store.load().preferences.explorer,false);
});
