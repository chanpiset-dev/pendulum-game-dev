# Test report — 2 November 2026

## Result and scope

The implementation contains the complete supplied textbook as selectable HTML with local math typesetting and 42 inline SVG figures: 18 original locations (including the cover) and 24 added educational figures. Desktop layout has 48 A4 pages, including the unnumbered cover. Mobile preserves the same numbering while allowing taller, reflowed pages and portrait figures.

Executed checks passed, subject to the browser limitations below. This report does not claim Safari, branded Google Chrome, physical-device, or direct-file browser verification.

## Content and layout

- Reviewed the supplied 28-page PDF and complete LaTeX, all original TikZ locations and source plot generation/data.
- Audited 155 converted source paragraphs: no missing paragraph text. Compared all 211 mathematical spans in order: unchanged. Checked all 17 original captions and six numbered equations; retained original section order (23 main sections, appendices A–C), code names, tables, derivation and glossary.
- Rendered all equations with bundled KaTeX: zero typesetting exceptions. Plain conversion failures for the custom code macro and equation references were corrected in the build.
- Desktop Chromium at 1100 × 1200: no page-content overflow, no clipped SVG element bounds in the sampled run, and no JavaScript errors.
- Mobile viewport 390 × 844: no document horizontal overflow. All 42 portrait figures checked at 0.25-second intervals over five simulated seconds; no SVG bounds violations. Equation lines can scroll internally when necessary.
- Desktop HTML and print contact sheets were visually reviewed across all 48 pages. All 42 figure screenshots were visually reviewed. Geometry, captions, label spacing and page boundaries were checked; updated Figure 1 separates the one-link circular path from the two-link chain and labels both rods and masses.
- Generated the book's A4 print PDF in Chromium: 48 physical pages. The document reflows around added diagrams; page breaks and figure sizes intentionally differ from the 28-page source.

## Numerical and full-envelope checks

`node tests/physics.cjs` — nine checks passed:

1. One-link derivative agrees with the nonlinear equation including gravity, anchor acceleration, wind and drag.
2. The textbook's worked two-link accelerations agree within rounding tolerance.
3. Undamped one- and two-link RK4 runs conserve energy to relative error below 10⁻⁵ over 20 simulated seconds at h = 1/240 s.
4. Positive generalized damping decreases coupled-chain energy in the tested three-link run.
5. All 1,360 extreme-angle combinations for N = 2–5 (left, right, upward and downward for each link) fit the full reachable envelope, including the maximum game bob radius.
6. The bound also includes ±60 game pixels of horizontal pivot movement and ±36 pixels vertically.
7. The two-link portal transform preserves fixed lengths and reaches the tested reachable exit, with the source exit-speed assignment.
8. Pulse/bumper state updates and segment/end-point/zero-length geometry agree with the formulas.
9. Attractor and repulsor kicks agree with the implemented source equations.

The original matrix and RK4 solver were copied without mathematical changes; only export packaging changed to ordinary browser scripts. Rod lengths are never shortened and angles are never restricted to prevent clipping. Every drawing position is calculated by summing link displacements. Viewports reserve the complete reach, bob radius, pivot travel and extra margin.

## Animation and controls

- All 42 default figures advanced through 20 simulated seconds; element bounds sampled every 0.25 s. Zero non-finite states, SVG clipping or browser exceptions in that run.
- All 42 pause/resume/reset methods checked; actual SVG click and button interactions also tested. Reset restored initial states and local time.
- Offscreen figure did not advance during the visibility test. Hidden documents are gated in the frame scheduler; no separate background-tab automation claim is made.
- Reduced-motion context: all figures remained stopped initially; explicit individual Play successfully opted in.
- Tested every select option: N = 2–5; constant/periodic gravity schedule; normal, spring and absorber pads; attractor/repulsor; slime/resin; normal, hit-stop, slow and paused clocks.
- Tested both endpoints of every numerical slider: comparison h = 0.01 and 0.08; release angle ±175°; gravity ±15; drag 0 and 1. All tested states remained finite.
- Default event examples triggered ring boosts, bumper responses, rail impacts, clone contacts, three armored hits, switch activation/gate contacts, shield depletion, attractor core death and portal transitions. Parameter branches exercised their alternative formulas.
- The code uses a fixed h = 1/240 s and an illustrative 60-Hz event schedule, with event cooldown decrements placed as in the source. It does not claim exact variable-refresh-rate equivalence to every live game run.

## Offline / browser execution

- Served and loaded the book from an actual local HTTP server at 127.0.0.1:8123. Scripts, CSS, fonts and data loaded successfully.
- A second HTTP fixture allowed only local book resources and blocked other destinations. Zero external resource requests were attempted; all figures and equations initialized.
- Four authored JavaScript files passed `node --check`.
- No modules, fetch calls, CDN assets, API dependencies or runtime build steps are required. The archive contains every referenced runtime resource.
- **Direct file opening is implemented but execution remains unverified here.** The managed Chromium browser returned `ERR_BLOCKED_BY_ADMINISTRATOR` for `file:///workspace/work/book/index.html`. The policy was not bypassed. This prevents a claim that a direct-file test passed. The ordinary-script/no-fetch design is intended to work when the user's browser permits local files.
- Tested engine: system Chromium 154 via Playwright. Branded Google Chrome and desktop Safari were not available. Mobile testing used a resized browser viewport and reduced-motion emulation, not a physical mobile device or Safari/WebKit.

## Game regression and source integrity

- Instantiated all 250 stage layouts through the actual stage-builder/index/balance/scaling pipeline. Feature inventory and parameters are included in `tests/evidence/stage-audit.json`.
- Ran the repository's eight `*.test.mjs` test files with `node --test`: all eight files passed.
- Ran the existing `scripts/verify-solutions.cjs` harness in the real browser game. All 250 saved solutions independently reproduced STAGE CLEAR and the expected frame counts; zero unresolved.
- Compared all 83 original archive files with their extracted counterparts by SHA-256: zero changed files. The interactive book is added only under `docs/interactive-physics/` in the working repository. Its standalone distribution is named `pendulum-interactive-physics/`.

## Remaining practical limitations

- The HTML is faithful in academic style, full content, section order and mathematical meaning, rather than a pixel-identical reconstruction of the original PDF. Added figures increase pagination.
- Source event rules remain arcade rules: no invented conservative impulse solver, collision sweep, overlap correction, fluid dynamics or general N-link exact portal IK. Their original caveats remain in the text.
- Discrete-rule figures use isolated illustrative layouts, not complete authored stages. The verification timeline illustrates saved input times; the separate regression harness performs the actual game verification.
- For print, use a desktop-width viewport. A narrow-screen view favors readable portrait figures and natural scrolling rather than fixed-height printed pages.
- Browser policies or blocked JavaScript can prevent an interactive local file from executing. The unchanged original PDF is included as an offline reference, not used as the HTML's page-image content.

Machine-readable checks and regression logs are in `tests/evidence/`. Development-only test scripts can be rerun with Node; Node is not needed to read the book.

## Repository import check — 2 November 2026

This book was prepared from the previously supplied `dev/game-improvements` archive and its physics textbook. It is being added under `docs/interactive-physics/` on `dev/explorer-homecoming`, whose checked starting head is `60e6b6f4546ead1bdf1cbe6bc9fb6c7857936a25`. The earlier 250-stage replay results describe the supplied source snapshot, not a new regression run against the explorer branch. The import reran the nine book physics tests, checked all four authored JavaScript files for syntax errors and checked all local HTML/CSS resource paths. No pre-existing repository files are included in the change.
