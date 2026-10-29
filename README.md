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
