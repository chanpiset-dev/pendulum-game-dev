# Changelog

## Offline interactive edition — 2 November 2026

- Reconstructed all 23 main sections and appendices A–C from the supplied LaTeX, including 211 math spans, six numbered equations, 17 original captions, reference tables, code names, derivation and glossary.
- Replaced all 15 TikZ locations (including the cover) and three original numerical plot locations with inline SVG. Flowcharts and field geometry retain their schematic meaning; numerical plots retain their source data and add moving cursors.
- Added 24 contextual figures covering vector quantities, energy, damping, multi-link geometry, mass matrices, sensitivity, integration error, two-axis anchors, wind response, boosts, sampled contacts, bumper variants, rail impacts, clone contacts, armor, gates, lasers, fields, portals, zones, clocks, reward separation, input verification and controlled experiments.
- Reused the original matrix/RK4 solver with only browser export packaging changed. Adapted isolated arcade formulas from the supplied game update and clone-collision code. No game sources were changed.
- Sized reach envelopes for all link angles using total link length, bob radius, pivot excursions and margin; kept full rotations and original physical link lengths. Fixed Figure 1 labels and preserved its distinct one-link circular example with its own nonlinear solver.
- Added automatic visible-figure animation, pause/resume, keyboard control, reset, time scaling, focused parameter controls, reduced-motion support and document visibility handling.
- Added consistent A4 pagination and print styles; added portrait SVG layouts and text reflow for phones.
- Bundled KaTeX, fonts, dependencies, numerical data, original reference sources and test evidence locally.

This edition keeps the original baseline statements as historical source text. Figure layouts are educational isolated examples, not replacements for full game stages. Schematic animation is explicitly identified where motion is prescribed rather than obtained from the pendulum solver.
