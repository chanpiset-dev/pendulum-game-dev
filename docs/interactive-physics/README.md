# The Physics Behind Pendulum Game — interactive offline edition

Extract the entire `pendulum-interactive-physics` folder, then open `index.html` in a current browser. Keep the `js`, `assets` and `vendor` folders alongside it. No build, installation, internet connection or account is required by the book.

All document content is local HTML. KaTeX 0.16.22, its fonts, scripts, CSS and numerical source data are bundled. Scripts are ordinary browser scripts; there are no JavaScript modules, fetch requests, service workers or remote dependencies.

## Reading and controls

- Contents links jump to the original sections and appendices.
- Figures animate when visible. Click the illustration, press Enter/Space on it, or use Pause/Play. Reset repeats the initial experiment. The small speed selector changes simulated seconds per wall second.
- Added figures use A1–A24. Original figures retain numbers 1–17; the animated cover is unnumbered.
- Relevant figures have compact controls for link count, bumper rule, field type, zone type, gravity schedule, RK4 comparison step or the final experiment parameters.
- Reduced-motion preferences suppress automatic motion. Explicitly play one figure or use Play all to opt in. Offscreen figures and hidden documents do not advance; returning continues their local experimental time.
- Dead chains and cleared targets remain in their final state until Reset. Repeated bumper/gate contacts can strongly attenuate motion; that behavior follows the source's sampled rules, without invented overlap correction.
- On narrow screens, figures stack their explanatory notes and multi-panel comparisons. Text, equations, tables and captions remain selectable. Equations too wide for a phone can scroll within the equation line.
- Print uses A4 pages. For reliable print pagination, use a desktop-width browser. Printed figures are static snapshots of their current states; use Reset and Pause all first if you want matching initial states.

## Optional local server

From this folder, run `python -m http.server 8000`, then open `http://localhost:8000/`. If placing the folder in the repository, use `docs/interactive-physics/` and navigate to that directory from the repository server.

## Included material

- `index.html`, `style.css`, `js/`: complete interactive book.
- `assets/model-data.js`: the original solver-generated figure data, packaged for direct-file use.
- `vendor/katex/`: local math typesetting and fonts, including license.
- `source/`: unchanged original PDF, LaTeX, plot data and plot scripts, plus an extracted TikZ reference. These are reference sources, not displayed PDF-page images.
- `DIAGRAM-MAP.md`: complete section and illustration mapping.
- `CHANGELOG.md`: implemented changes and scope.
- `TEST-REPORT.md` and `tests/evidence/`: executed checks and limitations.
- `tests/physics.cjs`: nine numerical/geometry checks, optional for developers; run `node tests/physics.cjs`.

The complete original prose and mathematical content are preserved. Pagination has expanded from 28 PDF pages to 48 interactive desktop pages (cover plus 47 numbered pages). It reproduces the source's A4 proportions, 23 mm margins, serif typography, running headings and colored explanation boxes, with natural reflow rather than pixel-identical page breaks.

See TEST-REPORT.md before interpreting browser coverage: the managed browser refused file:// navigation by policy, and Safari/branded Chrome were unavailable. Direct-file compatibility is implemented but could not be executed in that browser.
