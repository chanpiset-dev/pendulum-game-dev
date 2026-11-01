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

## Appearance themes

Open **SETTINGS → Appearance** to choose a theme and **System**, **Dark**, or **Light** mode. The nine themes are Neon Arcade, Pocket Console, 16-Bit Adventure, Clean Precision, Glass Orbit, Soft Studio, Blueprint Lab, Cosmic Observatory, and Paper Workshop. Each has dark and light palettes. Existing players default to **Neon Arcade + Dark**.

Theme and mode are saved alongside volume and mute without replacing sound preferences or game progress. System mode follows device appearance changes; explicit Dark/Light modes stay fixed. If storage is unavailable, appearance still applies for the session.

Shared palette tokens live in `src/themes.css`; `src/themes.js` describes the catalog and exposes cached canvas colors. `src/appearance.js` applies the selection and system changes. The small `src/appearance-boot.js` restores appearance before the first CSS paint. Theme differences include typography, corners, borders, shadows, grids, and restrained decorative textures. Stage geometry, physics and scoring stay the same. Replay records retain the palette used during the attempt even after the interface theme changes.

Run `node tests/themes.cjs` for all 18 variants, text contrast, canvas backgrounds, system changes, persistence, mobile layout, Japanese labels and replay color retention.

## Compact navigation and controls

On screens up to 820px wide, the header keeps **STAGES**, **SETTINGS**, and **MORE** visible. More contains Home, Free Play, Hints, Replay, Share, language switching, and Reroll when available. Opening More pauses an active attempt; dismiss it with Escape, an outside action, or by choosing an item, then use Resume to continue. Desktop navigation remains directly accessible.

Pause/Resume and Restart share a row; Stop is a secondary full-width action. **Launch settings** contains the existing angle, velocity, link, and clone controls. It starts collapsed on mobile and expanded on desktop, and can be toggled with touch or keyboard.

Personal-best score, time, and stars appear in a compact three-column row. Routine save confirmations are hidden in the gameplay panel; storage warnings and failures remain visible. Explicit Settings changes still show their save confirmation inside Settings.

Run `node tests/compact-layout.cjs` for mobile header sizing in every theme/mode, disclosure focus and dismissal, input isolation, control grouping, records and save messages.

## Artwork preview

Use **SETTINGS → PREVIEW ARTWORK** to inspect and compare the artwork used in live stages. The separate demonstration scene and 25 specimen cards cover the pendulum, multi-link chains, clones, targets, bombs and stage mechanics. Retro themes automatically use **Pixel Arcade**; the other six themes use **Clean Vector**. The preview style selector allows a direct comparison without saving an override.

Playable stages now use this artwork automatically: Pixel Arcade for the three retro themes and Clean Vector for the other six. The separate preview never runs gameplay physics or records progress. Opening Settings pauses the attempt; Back to Settings returns there, and normal Resume continues the attempt. Reduced-motion preferences disable the demonstration animation. Pixel artwork is drawn at low resolution and scaled with smoothing disabled; vector artwork uses procedural Canvas 2D paths. The shared procedural drawing functions are used by gameplay, tutorial illustrations and the preview.

Verify with `node tests/artwork-preview.cjs` for style mapping and specimen rendering across all 18 theme/mode combinations, mobile sizing, localization and save isolation.

## Live artwork and gimmick guide

The old object renderer has been replaced. Targets have red/white bullseyes, armored targets show shield segments and remaining hits, bombs show a fuse and warning symbol, and pendulums draw the actual articulated positions with smaller joints and a distinct tip. Rails, portals, boosts, lasers, switches, gates, bumpers, force fields, wind and viscous zones use the new art. Retro object layers render at half resolution and scale without smoothing; other themes use smooth vectors. Simulation coordinates, target health, forces, timers, scoring and saves are preserved. Circle and contact dimensions now use the larger shared sizes described below.

On the Home screen choose **TUTORIAL → GIMMICK GUIDE** for 25 illustrated objects with their actual functions. Both images and text follow the current theme/language. The guide stops the background tutorial simulation while open; **BACK TO HOW TO PLAY** resumes it. Bomb fuses and bumper springs are decorative, and round contact surfaces remain the hit areas. Reflector illustrations show angled arrangements of circular bumpers to match the stage geometry.

Verify with `node tests/live-artwork.cjs`: both styles render all 250 substages without mutating physics or saved progress, and the illustrated mobile guide supports English/Japanese and safe tutorial transitions.

## Larger gameplay objects

Gameplay circles now use **1.5×** their authored radius: targets, bombs, bumpers, portals, boost rings, switches and force-field cores. The starting bob radius is **21** (previously 14), with growth/shrink steps and the maximum radius scaled consistently. Rods and joints are thicker, and rail/beam visuals and contact widths share the same dimensions. The enlargement applies consistently on phones and computers.

Stage coordinates, pendulum lengths, timers, wind strength, force-field influence ranges, scoring rules and saved records stay intact. Larger contact areas intentionally change difficulty. All 250 authored layouts are checked for clipped target/bumper circles and targets completely hidden inside bumpers; this does not establish that every stage has the same difficulty or solution as before.

The centralized dimensions are in `src/game-sizes.js`. Stage builders remain authored at their original dimensions; the generator applies enlargement exactly once. Verify with `node --test tests/object-sizes.test.mjs` and `node tests/larger-objects.cjs`.

### Stage balance pass

Stage identities and ordering remain unchanged, preserving existing unlocks and records.
`src/data/stage-balance.js` applies targeted adjustments before object scaling:
flagged stationary passages fit the fully grown bob with clearance; the first twin/long-chain
exercises use fewer targets and no bumpers; sharp armor increases are reduced with extra time.
Two-axis rails begin at Carousel, Warp Metronome includes portals throughout, and the finale
opening has a distinct vault layout. Zero Gravity uses actual zero gravity. English/Japanese tips
reflect repeatable launch phases and the real circular bumper geometry.

Verification covers all 250 generated layouts and selected progression invariants. These checks
do not establish that every stage has an equally difficult solution; mobile playtesting remains
necessary, especially for moving hazards and the rebalanced armor challenges (see STAGE-MAP.md for current numbering).


### Chapter progression and saved-game migration

The six chapters use sequential IDs 1–50 (250 substages). Display numbers, metadata
and the actual builder conditions agree; there is no runtime shuffle in STAGE_ORDER.
See [STAGE-MAP.md](STAGE-MAP.md) for the complete previous → current numbering table.
Stage Select shows bilingual chapter headings, mechanic symbols with text labels,
and chapter-relative challenge labels. These labels are guidance, not measured ratings.

Progress now uses v7 storage keys. On first load, a single migration snapshot maps
v6 scores, stars, best times, optional ghost paths and briefing flags to the same
content at its new number. The original v6 keys remain untouched. Subsequent v7
saves override the snapshot, so reloads and interrupted writes never remap new
records a second time. Existing sound and appearance preferences are unchanged.

The single unlock frontier expands enough to retain access to every previously
accessible stage; this can unlock intervening content without awarding clears or
records. Old unversioned share URLs retain their original content; new share URLs
include numbering=7 and refer directly to current stage numbers.

### Automated stage verification

A separate [verification viewer](verification/) plays saved successful solutions
without writing player progress. See [verification/README.md](verification/README.md)
for the search command, scope, fixed-frame timing model and limitations. All 250 substages now have saved repeatable clears, including a user-guided
solution for 44-2. No stage layouts were changed.

### Physics guide

Read the [illustrated physics guide (PDF)](docs/physics/pendulum-physics.pdf) for a
beginner-friendly explanation of the v0.1.0 simulation, including multi-link motion,
numerical integration and gameplay gimmicks. The [LaTeX source and build instructions](docs/physics/README.md)
and [complete source ZIP](docs/physics/pendulum-physics-latex.zip) are included.


## Shaded Canvas artwork

On `dev/shaded-canvas-artwork`, the six modern/creative themes use procedural
Shaded Canvas artwork: enamel impact targets, oval animated cyan IN / violet OUT
portals, violet-infall black holes, rounded gimmicks and cylindrical links.
The three retro themes retain Pixel Arcade. Artwork Review also offers the
original Clean Vector style for comparison. The shared gallery and gimmick guide
show 24 entries; Reflector remains an arrangement of bumpers, not a separate object.

The initial approved spacing proposals covered substages 33-5, 48-5 and 50-5, retaining
object counts, contact radii and the 800 × 600 arena. The subsequent full review is documented below; both passes use checked-in
positions, not a runtime spreading algorithm. Portal/field animation respects reduced-motion
preferences. Gameplay, tutorial, Home animation and artwork specimens share the
same drawing entry points; rendering does not modify the physics or player saves.


New installations default to Modern → Clean Precision in Dark mode; saved theme
and mode selections remain respected. The Artwork Review scene uses one carriage
pivot shared by the real articulated drawing. Each successful target hit now grows
the bob radius by 2.25px (half the previous 4.5px); the initial 21px and maximum
54px radii are unchanged. Fixed-frame solutions are refreshed for this model.


## Full spacing review

The full 250-substage audit adds deterministic local spacing corrections to 193
substages; 57 layouts remain unchanged. Object counts, radii, target HP and motion
parameters are preserved. The review covers artwork rims/fuses/springs, full pad
patrol paths and beam/body intersections. Portal labels relocate outside neighboring
artwork. See [the exact affected substages and audit rules](docs/stage-spacing-review.md).
Run `node scripts/audit-stage-spacing.mjs` to check the corrected layouts.


## Stage Select filters

Stage Select combines All / Uncleared / Missing stars with chapter and mechanic
filters. Counts reflect the selected chapter and mechanic. Uncleared excludes
locked substages; Missing stars includes playable clear records with fewer than
three stars, including legacy records without a star entry. Scores, best times or
stars each provide evidence of a clear. Locked stages remain disabled in All.

Mechanic tags come from the generated substage data; chain and clone categories
use prescribed configurations rather than slider maxima. Stage numbers and chapter
order remain sequential. Empty results offer a reset; jump-to-current and
furthest-unlocked clear filters only when needed to reveal the destination.
Filters are session-only UI state and do not modify player saves or gameplay.

## Explorer bob and chamber restoration

The explorer face and scarf follow each live tip bob in every artwork style, including multi-link and clone stages. Expressions reflect setup, launch, target impact, and stage clear. Decorations stay within the visible bob silhouette and never change its contact radius. Turn off **Explorer bob** under Settings → Appearance to restore the classic bob; this preference persists independently of theme and sound.

In stage mode, the HUD shows cleared non-bomb targets charging a decorative gateway. Bombs retain their existing role and completion rules. On clear, the gateway opens and the existing celebration remains skippable with **Skip celebration**. The clear screen reveals the actual next stage/substage; stage 50-5 shows the final completion message. Skipping advances the presentation wait without changing scoring time, stars, or unlocking rules. Free Play has no gateway objective. English and Japanese are supported; reduced-motion mode disables the added gateway transition. Replay remains a recording of the canvas and does not record DOM HUD elements.

Verify with `node tests/explorer-adventure.cjs`, `node --test tests/*.test.mjs`, and `node scripts/verify-solutions.cjs` (browser checks require Playwright and Chromium).

## Journey map

**STAGES** now opens a chapter journey route by default. All six existing chapters and all 250 substages retain their numbering. Choose a stage node, then one of its five substages and **PLAY** to load the chamber briefing. Locked nodes can be inspected; their locked substages cannot be launched. Map stars sum all five substages (maximum 15), while the picker shows each substage's three stars. Legacy score/time-only clears still count as completed.

The explorer marks the earliest unlocked, uncleared substage; it stays in place while you browse. **Find explorer** selects it. Underlined stage names indicate the current stage, and the selection ring indicates the stage being inspected. Completed campaigns keep the explorer at the last stage. Chapter titles and landmark names support English and Japanese.

**Stage grid** retains the progress, mechanic, and chapter filters. Switching views preserves those session-only filters. Current/furthest jump controls select the relevant chapter and stage in map view and keep their original scroll-and-focus behavior in grid view. Browsing the map never writes progress, changes an attempt, or affects replay. The route uses native buttons, keyboard focus, and a tall winding mobile layout. The existing grid remains available in every theme.

Verify with `node tests/journey-map.cjs` and `node --test tests/journey-map.test.mjs` (browser checks require Playwright and Chromium).

### Approved journey-map art

The route now uses the approved visual design: layered SVG terrain, broad winding dotted paths, inset chapter headings, decorative landmarks, round shadowed nodes, dark nameplates, and warm gold selection/star colors. Chapter 1 uses the exact approved desktop and responsive path coordinates. The other five maps use their approved identity palettes and landmark illustrations, with curved routes sized for their existing stage counts. These map palettes are intentionally independent of the selected gameplay theme. Gameplay backgrounds are unchanged. Original artwork lives in `src/assets/journey/`; styling is scoped in `src/journey-map.css`, loaded after theme CSS so it retains its approved colors.
