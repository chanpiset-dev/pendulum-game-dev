# Stage verification pilot

Open `/verification/` on the same deployed site as the game. Choose a saved verified
substage, press PLAY, or use PLAY ALL. PAUSE and REPLAY control the same fixed-frame
simulation; speed changes playback pacing, never physics. The page also lists all
250 substages, clearly distinguishing verified, unresolved and not searched.

The initial pilot covers 1-1 (basics), 23-1 (portals), 26-1 (lasers) and 36-1
(three-link chain). Four successful examples do **not** establish that all 250
substages are completable, nor that portal use is mandatory in a portal stage.

## Find solutions

Requirements: Node.js, Playwright and Chromium. The existing repository browser
tests use the same dependencies. Set CHROMIUM_PATH if Chromium is not installed
at `/usr/bin/chromium`.

```sh
node scripts/search-solutions.cjs --indices=1,111,126,176 --budget=150
```

Indices run from 1 to 250: `(stage - 1) * 5 + substage`. The script serves local
files through Playwright routing and requires no live Netlify deployment. It tries
integer angles, launch velocities, and selected fixed-frame pulse schedules within
each stage's normal restrictions. It uses the actual `loadStage`, `fire`, `update`
and clear-overlay path, and confirms each successful candidate in a fresh rerun.

Results are saved in `verification/solutions.json`, with settings, pulse frame
numbers, clear time and confirmation frame count. Search budgets are bounded;
**unresolved means no solution was found, not that the stage is impossible**.
This first search uses coarse candidates, not exhaustive optimization. More precise
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
node tests/verification.cjs
```

The checks exercise every pilot solution through the actual clear overlay, viewer
controls, mobile sizing, source-version rejection, and preservation of real saves.
