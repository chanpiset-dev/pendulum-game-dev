# Stage verification

Open `/verification/` on the same deployed site as the game. Choose a saved verified
substage, press PLAY, or use PLAY ALL. PAUSE and REPLAY control the same fixed-frame
simulation; speed changes playback pacing, never physics. The page also lists all
250 substages, clearly distinguishing verified, unresolved and not searched.

The first full pass searched all 250 substages with a maximum of 150 candidates
per substage. It found 249 repeatable clears in 1,096 total candidate attempts.
The final unresolved stage, **44-2 (Vortex Boost)**, was subsequently solved using
the player-provided launch settings: -105° angle, -1.2 initial angular velocity,
with automated pulses at frames 36 and 100 (0.60s and 1.67s playback time).
It clears in 3.40 seconds of game time. All **250 substages** now have saved
repeatable clears under the fixed-frame model.
An unresolved search is not evidence of impossibility. That initial pass did not change layouts or difficulty settings.
The shaded-artwork branch subsequently applies the approved spacing review to
33-5, 48-5 and 50-5. All 250 solutions were regenerated against its current
fingerprint and independently replayed through STAGE CLEAR; 48-5 uses a new
launch candidate. Artwork changes retain 2D movement, collision radii and scoring. A portal-stage clear does not establish that portal use is
mandatory, and a successful solution does not measure human difficulty.

## Find solutions

Requirements: Node.js, Playwright and Chromium. The existing repository browser
tests use the same dependencies. Set CHROMIUM_PATH if Chromium is not installed
at `/usr/bin/chromium`.

```sh
node scripts/search-solutions.cjs --indices=all --budget=150
```

Use `--indices=217` to search only 44-2, or a comma-separated list for selected
substages. `verification/seeds.json` preserves the user-guided candidate and is
tried first; use `--seeds=path/to/seeds.json` for another seed list.
Indices run from 1 to 250: `(stage - 1) * 5 + substage`. The script serves local
files through Playwright routing and requires no live Netlify deployment. It tries
integer angles, launch velocities, and selected fixed-frame pulse schedules within
each stage's normal restrictions. It uses the actual `loadStage`, `fire`, `update`
and clear-overlay path, and confirms each successful candidate in a fresh rerun.

Results are saved in `verification/solutions.json`, with settings, pulse frame
numbers, clear time and confirmation frame count. Search budgets are bounded;
**unresolved means no solution was found, not that the stage is impossible**.
This search uses coarse candidates, not exhaustive optimization. More precise
angles/velocities and better pulse schedules can be added as needed.

A fingerprint of simulation sources accompanies the report. The viewer refuses
playback when those sources change; rerun the search to generate current results.
Results from other simulation versions are not merged into a current report.

## Isolation and interpretation

The iframe uses `?verification=1`, which installs a session-only storage adapter.
Player saves, settings and migration backups are never written by verification.
Normal gameplay does not expose the verification API. This is a development tool,
not a player-facing auto-win feature or a replacement for mobile playtesting.

Fixed 1/60-second frames make solutions repeatable in search and viewing. Regular
gameplay uses variable frame durations, so a verified fixed-frame solution is
specific evidence under that timing model, not proof of identical behavior on
every device. Pulse times in the viewer are playback times; in-game time briefly
stops for hit effects. Random particles/fireworks may look different between runs.

Run regression checks:

```sh
node scripts/verify-solutions.cjs
node tests/verification.cjs
```

The batch verifier independently replays every saved success through the actual
clear overlay and checks the confirmation frame count. The browser smoke test
uses four representative solutions to check viewer controls, mobile sizing,
source-version rejection, and preservation of real saves without requiring a
complete real-time PLAY ALL run.
