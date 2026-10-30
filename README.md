# Pendulum Game

Browser-based N-pendulum game, reorganized into native JavaScript ES modules.

## Run locally

Because the project uses ES modules, open it through a local static HTTP server rather than `file://`. For example, from this directory run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Project structure

- `index.html`, `style.css`: page shell and styling.
- `src/main.js`: game initialization, state transitions, animation loop, and gameplay orchestration.
- `src/physics.js`, `src/audio.js`: existing physics and audio engines.
- `src/i18n.js`: English/Japanese dictionary and language controller.
- `src/engine/`: renderer, collisions, particles/fireworks, and input controls.
- `src/data/stage-configs.js`: stage metadata and sequential stage order.
- `src/data/stage-index.js`: stage aggregation and `generateStageData()` entry point.
- `src/data/stage-builders/`: stage mechanics grouped by category (Stages 1–6, 7–20, 21–30, and 31–50).
- `STAGE-MAP.md`: quick reference matching each stage ID to its configuration name, builder section, and source file.

## Stage numbering

Displayed stage numbers now map directly to the same numbered stage definition (1–50). Stage order is explicitly sequential. Existing stage layouts and mechanics were carried over; no new stages were added.

## Hints and last-attempt replay

Use **HINTS** to reopen the current stage briefing and tips for its mechanics. First-visit briefings include these tips automatically. Opening hints during an attempt pauses it; dismiss the hints, then choose **RESUME** to continue. Mechanic tips support English and Japanese.

After a clear, failure, or Stop, use **REPLAY LAST ATTEMPT** in the header. The silent viewer supports play/pause, seeking, and 0.5× / 1× / 2× playback. Escape or Close returns to the game. Playback never changes scores, progress, or physics. The replay remains available across stage selection until the next launch or page refresh.

Replay captures the canvas at up to 10 frames per second at 640×480. It retains at most 600 compressed frames, reducing the sampling rate for long attempts. It is a visual recording, not a full-resolution video or a saved download. Paused time is excluded.

Verify with `node tests/hints-replay.cjs` (requires Playwright and Chromium).

## Progress navigation and stars

In **STAGES**, **JUMP TO CURRENT** scrolls to the selected stage, while **JUMP TO FURTHEST UNLOCKED** scrolls to your furthest available stage without changing your selection.

Star rules are available in briefings and under **How stars work** in stage selection. A clear earns one star, keeping at least one pulse earns another (automatically awarded when pulses are locked), and finishing with at least 35% time remaining earns the third. The clear screen shows which bonuses were earned. Existing best star records are preserved; replay a stage to improve them.

Saved-data recovery and optional replay-storage failures are handled quietly. Actual storage-access failures still show a warning so players know their latest progress may not persist.

## Mobile controls and sound settings

Drag the visible tip to aim and release to launch. Touches in canvas letterbox margins are ignored; moving a drag outside the visible game cancels it. On mobile or touch devices, action controls have larger targets and stage cards wrap to fit the available width.

Use **SETTINGS** to adjust sound volume or mute all game audio. Preferences are validated and remembered in this browser. If storage is unavailable, changes still apply for the session and Settings explains that they could not be saved. Opening Settings pauses an active attempt; close it and choose **RESUME** to continue.


Mobile verification: `node --test tests/input-coordinates.test.mjs` and `node tests/mobile-controls.cjs` (the browser test requires Playwright and Chromium).
