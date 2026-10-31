// Previous stage ID → new sequential ID. Used only for legacy save migration.
export const LEGACY_STAGE_IDS = {
  "1": 1,
  "2": 2,
  "7": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "24": 8,
  "22": 7,
  "11": 9,
  "12": 10,
  "13": 11,
  "14": 12,
  "6": 13,
  "16": 14,
  "17": 15,
  "37": 16,
  "8": 17,
  "25": 18,
  "39": 19,
  "18": 20,
  "43": 21,
  "10": 22,
  "21": 23,
  "27": 24,
  "28": 25,
  "29": 26,
  "42": 27,
  "44": 28,
  "48": 29,
  "33": 30,
  "40": 31,
  "23": 32,
  "36": 33,
  "9": 34,
  "19": 35,
  "15": 36,
  "26": 37,
  "34": 38,
  "41": 39,
  "47": 40,
  "31": 41,
  "46": 42,
  "38": 43,
  "32": 44,
  "45": 45,
  "20": 46,
  "30": 47,
  "35": 48,
  "49": 49,
  "50": 50
};

export const MIGRATION_KEY = 'pendulum_stage_migration_v7';
const fields = ['unlocked', 'scores', 'stars', 'times', 'ghosts', 'briefed'];
export const LEGACY_PROGRESS_KEYS = {
  unlocked: 'pendulum_sub_unlocked_v6', scores: 'pendulum_stage_scores_v6',
  stars: 'pendulum_stage_stars_v6', times: 'pendulum_stage_times_v6',
  ghosts: 'pendulum_stage_ghosts_v6', briefed: 'pendulum_briefed_stages_v6',
};
// Preserve every previously accessible stage. With a single unlock frontier this
// may also unlock intervening stages; never manufacture clears, scores or stars.
export function migrateLegacyProgress(read) {
  const result = {};
  let found = false;
  for (const field of fields) {
    const raw = read(LEGACY_PROGRESS_KEYS[field]);
    if (raw === null) continue;
    found = true;
    if (field === 'unlocked') {
      const frontier = Number(raw);
      let unlocked = 1;
      if (Number.isInteger(frontier) && frontier >= 1 && frontier <= 250) {
        for (let index = 1; index <= frontier; index++) {
          const oldStage = Math.ceil(index / 5), sub = (index - 1) % 5 + 1;
          unlocked = Math.max(unlocked, (LEGACY_STAGE_IDS[oldStage] - 1) * 5 + sub);
        }
      }
      result[field] = String(unlocked);
      continue;
    }
    let record;
    try { record = JSON.parse(raw); } catch { continue; }
    if (!record || typeof record !== 'object' || Array.isArray(record)) continue;
    const migrated = {};
    for (const [key, value] of Object.entries(record)) {
      const match = (field === 'briefed' ? /^stage_(\d+)$/ : /^stage_(\d+)_sub_([1-5])$/).exec(key);
      if (!match || !LEGACY_STAGE_IDS[match[1]]) continue;
      migrated[`stage_${LEGACY_STAGE_IDS[match[1]]}${field === 'briefed' ? '' : `_sub_${match[2]}`}`] = value;
    }
    result[field] = JSON.stringify(migrated);
  }
  return found ? result : null;
}

export function migrateLegacyIndex(index) {
  if (!Number.isInteger(index) || index < 1 || index > 250) return null;
  return (LEGACY_STAGE_IDS[Math.ceil(index / 5)] - 1) * 5 + (index - 1) % 5 + 1;
}
