# Diagram and section map

Original numbering is preserved: figures 1–17 plus the unnumbered cover. Added figures A1–A24 are placed after the indicated explanation, before the next heading. There are no simulation galleries or companion simulation pages.

## Illustration inventory

| Location | Figure / ID | Treatment | Model or meaning |
|---|---|---|---|
| The Physics Behind Pendulum Game | Cover (`original-0`, cover) | Original location → inline SVG | Two-link cover; actual coupled RK4 motion. |
| 1 Start with the objects you see | Figure 1 (`original-1`, objects) | Original location → inline SVG | Figure 1: The support, links and masses. The code models massless rigid links and point masses for the equations of motion. Visible bob radii are used separately for contact tests. |
| 3 Coordinates: why the game uses sine for horizontal position | Figure 2 (`original-2`, coordinates) | Original location → inline SVG | Figure 2: The screen convention. The vertical component is positive downward, unlike many textbook diagrams. |
| 4.1 Gravity pulls down, but the link changes the direction of motion | Figure 3 (`original-3`, forces) | Original location → inline SVG | Figure 3: A force diagram for a single mass on a rigid link. Tension/constraint force is not a separate integrated state in this game. |
| 6 Two or more links: why they influence each other | Figure 5 (`original-4`, coupled) | Original location → inline SVG | Figure 5: Absolute angles and downstream loading in a two-link pendulum. |
| 9.2 The fourth-order Runge–Kutta method (RK4) | Figure 7 (`original-5`, rk4) | Original location → inline SVG | Figure 7: RK4 takes several tentative looks ahead. These temporary states are not extra visible bobs and do not represent simultaneously existing objects. |
| 10 Gravity: normal, low, heavy, inverted and zero | Figure 8 (`original-6`, gravity) | Original location → inline SVG | Figure 8: Changing the sign or magnitude of gravity changes the restoring tendency. Zero gravity does not remove rod constraints or damping. The schedule selector also demonstrates sign inversion every three simulated seconds, with no instantaneous velocity reversal. |
| 11.1 An accelerating support changes the apparent force | Figure 9 (`original-7`, pivot) | Original location → inline SVG | Figure 9: The reference frame attached to the pivot is accelerating. |
| 13.1 A pulse is an instantaneous state change | Figure 11 (`original-8`, pulse) | Original location → inline SVG | Figure 11: A pulse adds angular velocity to the tip link, after which the coupled solver redistributes motion through the chain. |
| 14.1 Two circular hit areas | Figure 12 (`original-9`, circles) | Original location → inline SVG | Figure 12: Collision geometry uses the sum of the radii. Glow, sparks and trails do not enlarge the physical hit area. |
| 14.2 A circle near a laser or gate segment | Figure 13 (`original-10`, segment) | Original location → inline SVG | Figure 13: Closest-point distance handles contacts near the middle and at either endpoint. |
| 16.2 Bombs | Figure 14 (`original-11`, bomb) | Original location → inline SVG | Figure 14: The bomb’s clearance radius is a gameplay rule. Its shockwave picture is not a simulated pressure field. |
| 17 Black holes and repulsor fields | Figure 15 (`original-12`, fields) | Original location → inline SVG | Figure 15: Influence region and core are distinct. The formulas below are the implemented arcade field rules. |
| 18.1 Entry and reach limits | Figure 16 (`original-13`, portal) | Original location → inline SVG | Figure 16: Two-link inverse kinematics: find angles that place a tip at a desired reachable point. |
| 20 One frame in the release: an implementation map | Figure 17 (`original-14`, pipeline) | Original location → inline SVG | Figure 17: High-level update order. The actual source is the final reference for detailed branch conditions. |
| 5 Small swings, large swings and damping | Figure 4 (`original-oscillation`, oscillation) | Original location → inline SVG | Figure 4: Numerical one-link experiments using the game’s rk4 solver, with damping set to zero. Angles are normalized by their own release angles so timing differences are visible. The 60-degree trajectory lags the small-angle formula. |
| 8.3 Sensitivity is not randomness | Figure 6 (`original-sensitivity-plot`, sensitivity-plot) | Original location → inline SVG | Figure 6: Two isolated two-link chains released at 120 degrees, differing by 0.001 rad in each angle. Left: their tip separation. Right: relative energy error for one chain with no damping. Data come from the game’s solver at a step of 1/240 s, without stage collisions. Growth of separation illustrates sensitivity; this plot alone is not a formal proof of chaos or a measured Lyapunov exponent. |
| 12 Wind: a horizontal acceleration, not a fluid simulation | Figure 10 (`original-wind-plot`, wind-plot) | Original location → inline SVG | Figure 10: Example authored gust parameters: \(f=0\) , \(A=2.4\) , \(\Omega=1.6\) , \(\phi=0\) . Positive acceleration pushes right; negative pushes left. This is an illustrative input curve, not a universal stage setting. |
| 2.3 Vectors, sine and cosine | Figure A1 (`added-1`, vectors) | Added inline SVG | Position, velocity and acceleration on a constrained circular path. The velocity arrow is tangent; acceleration includes both tangential and centripetal components. |
| 4.2 Energy explains release height | Figure A2 (`added-2`, energy) | Added inline SVG | Live one-link energy exchange, relative to the bottom. Gravity 9.8, length 2.5, mass 1, no damping. Kinetic and potential energy are computed from the numerical state. |
| 5 Small swings, large swings and damping | Figure A3 (`added-3`, damping) | Added inline SVG | A nonlinear undamped swing compared with angular drag c = 0.35 s⁻¹. Both begin at 60 degrees with zero speed. The amplitude decrease comes from the solver, not an imposed envelope. |
| 6.3 A worked two-link calculation | Figure A4 (`added-4`, multi) | Added inline SVG | Two through five links share the same total reach of 2.5 model metres. Changing the link count adds degrees of freedom and unit point masses. |
| 7.2 Use a compact mechanics rule | Figure A5 (`added-5`, matrix) | Added inline SVG | The evolving coupled mass matrix. The displayed entries are recomputed from the chain angles, lengths and downstream masses; off-diagonal coefficients connect the links. |
| 8.2 Clones begin almost, but not exactly, together | Figure A6 (`added-6`, sensitivity) | Added inline SVG | Two isolated chains start 0.001 rad apart at 120 degrees. They share the original equations and differ only in their starting angles; clone contacts are disabled here. |
| 9.4 Frames and substeps are different | Figure A7 (`added-7`, integration) | Added inline SVG | RK4 versus forward Euler for the nonlinear one-link equation. Both use the displayed step h. Energy error exposes the difference; Euler is included as an explicitly less accurate comparison. |
| 11.2 The prescribed rail motion | Figure A8 (`added-8`, orbit) | Added inline SVG | A prescribed two-axis anchor path: x = 0.5 sin(1.6t), y = 0.3 cos(1.6t), in model metres. The solver receives the corresponding acceleration; rail contacts are omitted to isolate anchor forcing. |
| 12 Wind: a horizontal acceleration, not a fluid simulation | Figure A9 (`added-9`, wind) | Added inline SVG | A one-link response to the authored example a_w = 2.4 sin(1.6t). Arrow direction and magnitude show horizontal acceleration, not air velocity. |
| 13.2 Boost rings use a similar rule | Figure A10 (`added-10`, boost) | Added inline SVG | The ring checks tip-circle overlap and adds ±3.2 rad/s to the last link. The 0.4 cooldown is decremented only in the last-substep event block, as in the source. |
| 14.4 A frame can miss a fast crossing | Figure A11 (`added-11`, sampling) | Added inline SVG | A prescribed straight crossing illustrates discrete contact sampling: only the endpoint circles are tested. This is a geometry example, not a pendulum trajectory. |
| 15.2 What the release actually does | Figure A12 (`added-12`, bumper) | Added inline SVG | Contact with a circular pad multiplies only the last angular velocity by q. Choose normal, spring or absorber. The original sampled overlap rule has no bumper cooldown or positional correction. |
| 15.3 Rails and gates | Figure A13 (`added-13`, rail-contact) | Added inline SVG | A prescribed horizontal carriage with actual joint-to-track contact checks. A rail hit multiplies all angular velocities by −0.8 and starts the source cooldown. |
| 15.4 Clone–clone contacts | Figure A14 (`added-14`, clone-contact) | Added inline SVG | Two chains share a pivot; after the initial 3-second suppression, overlapping tips apply the source velocity exchange and a 0.06-second cooldown. |
| 16.1 Targets and armor | Figure A15 (`added-15`, armor) | Added inline SVG | An armored target starts at three hit points. Each sampled overlap above one HP applies ω_N ← −0.6ω_N; the final hit clears the target and grows the collision radius. |
| 16.3 Switches and timed gates | Figure A16 (`added-16`, switch) | Added inline SVG | Tip overlap activates the switch for 4.5 seconds. The gate has a discrete open state; when closed, segment contact multiplies the final angular velocity by −0.8. |
| 16.4 Lasers and shields | Figure A17 (`added-17`, laser) | Added inline SVG | Tip-to-segment contact consumes one of three shared shield lives, shrinks the bob if possible and scales every angular velocity by −0.85. The last life ends this demonstration. |
| 17.2 Repulsor | Figure A18 (`added-18`, field-motion) | Added inline SVG | Choose attraction or repulsion to inspect joint-wise angular kicks. Both use the exact source distance falloff and final-substep weighting; this is an isolated illustrative layout, not a full stage. |
| 18.2 Exit speed is a new assignment | Figure A19 (`added-19`, portal-motion) | Added inline SVG | Tip overlap at IN triggers two-link inverse kinematics toward OUT, then assigns exit angular velocities. This reproduces the source state transformation, rather than translating an unconstrained bob. |
| 19.1 Zones damp angular motion | Figure A20 (`added-20`, zone) | Added inline SVG | The tip-center rectangle test activates both exponential angular-velocity decay and increased coupled-solver damping. Choose slime (D = 0.8) or resin (D = 2). |
| 19.3 Why timing changes outcomes | Figure A21 (`added-21`, clocks) | Added inline SVG | Wall time and simulated time are different clocks. Compare ordinary flow, hit-stop, stage-clear scale 0.2 and pause. This is a timing schematic, not a mechanical trajectory. |
| 21.2 Rewards are not conservation laws | Figure A22 (`added-22`, visual-physics) | Added inline SVG | One evolving state, two kinds of quantities: angular speed and kinetic energy on the left; a separate illustrative reward counter on the right. A score does not enter the equations. |
| 22 Reading the 250-stage verification correctly | Figure A23 (`added-23`, verification) | Added inline SVG | A fixed-frame timeline for the documented Stage 44-2 pulse schedule: frames 36 and 100 at 60 Hz. This illustrates recorded inputs; it does not claim to rerun or verify that stage. |
| 23 Experiments a beginner can try | Figure A24 (`added-24`, experiment) | Added inline SVG | A controlled nonlinear pendulum experiment. Change release angle, gravity or drag, then reset. Only these chosen parameters vary; the mass and link length stay fixed. |

## Review of every section and subsection

Reference appendices use their original tables and glossary; additional animation would not materially improve those definitions. Related figures are cited below for subsections that share a parent topic.

| Heading | Illustration coverage / decision |
|---|---|
| 1 Start with the objects you see | `original-1` |
| 1.1 The model’s assumptions | `original-1` |
| 2 A short mathematical toolkit | `added-1` |
| 2.1 Position, velocity and acceleration | `added-1` |
| 2.2 Degrees and radians | `added-1` |
| 2.3 Vectors, sine and cosine | `added-1` |
| 3 Coordinates: why the game uses sine for horizontal position | `original-2` |
| 4 One link: gravity, torque and energy | `original-3`, `added-2` |
| 4.1 Gravity pulls down, but the link changes the direction of motion | `original-3` |
| 4.2 Energy explains release height | `added-2` |
| 5 Small swings, large swings and damping | `original-oscillation`, `added-3` |
| 6 Two or more links: why they influence each other | `original-4` |
| 6.1 A matrix is a compact set of simultaneous equations | `original-4`, `added-4` |
| 6.2 The exact equations used by the code | `original-4`, `added-4` |
| 6.3 A worked two-link calculation | `added-4` |
| 7 Where the coupled equations come from | `added-5` |
| 7.1 Write the energies | `added-5` |
| 7.2 Use a compact mechanics rule | `added-5` |
| 8 Launch settings, clones and sensitivity | `original-sensitivity-plot`, `added-6` |
| 8.1 What the starting sliders actually set | `original-sensitivity-plot`, `added-6` |
| 8.2 Clones begin almost, but not exactly, together | `added-6` |
| 8.3 Sensitivity is not randomness | `original-sensitivity-plot` |
| 9 How the computer advances time | `original-5`, `added-7` |
| 9.1 A simulation uses small steps | `original-5`, `added-7` |
| 9.2 The fourth-order Runge–Kutta method (RK4) | `original-5` |
| 9.3 Solving the matrix | `original-5`, `added-7` |
| 9.4 Frames and substeps are different | `added-7` |
| 10 Gravity: normal, low, heavy, inverted and zero | `original-6` |
| 11 Moving pivots and rails | `original-7`, `added-8` |
| 11.1 An accelerating support changes the apparent force | `original-7` |
| 11.2 The prescribed rail motion | `added-8` |
| 12 Wind: a horizontal acceleration, not a fluid simulation | `original-wind-plot`, `added-9` |
| 13 Pulses and boost rings add angular velocity | `original-8`, `added-10` |
| 13.1 A pulse is an instantaneous state change | `original-8` |
| 13.2 Boost rings use a similar rule | `added-10` |
| 14 Detecting contact | `original-9`, `original-10`, `added-11` |
| 14.1 Two circular hit areas | `original-9` |
| 14.2 A circle near a laser or gate segment | `original-10` |
| 14.3 Which part of the chain can touch what? | `original-9`, `original-10`, `added-11` |
| 14.4 A frame can miss a fast crossing | `added-11` |
| 15 Bumpers, springs, absorbers, rails and clones | `added-12`, `added-13`, `added-14` |
| 15.1 What a physically complete bounce would do | `added-12`, `added-13`, `added-14` |
| 15.2 What the release actually does | `added-12` |
| 15.3 Rails and gates | `added-13` |
| 15.4 Clone–clone contacts | `added-14` |
| 16 Targets, armor, bombs, switches and lasers | `original-11`, `added-15`, `added-16`, `added-17` |
| 16.1 Targets and armor | `added-15` |
| 16.2 Bombs | `original-11` |
| 16.3 Switches and timed gates | `added-16` |
| 16.4 Lasers and shields | `added-17` |
| 17 Black holes and repulsor fields | `original-12` |
| 17.1 Attractor (black hole) | `original-12`, `added-18` |
| 17.2 Repulsor | `added-18` |
| 18 Portals: rebuilding a chain near an exit | `original-13`, `added-19` |
| 18.1 Entry and reach limits | `original-13` |
| 18.2 Exit speed is a new assignment | `added-19` |
| 19 Slime, resin and timing effects | `added-20`, `added-21` |
| 19.1 Zones damp angular motion | `added-20` |
| 19.2 Hit-stop, slow motion and pause | `added-20`, `added-21` |
| 19.3 Why timing changes outcomes | `added-21` |
| 20 One frame in the release: an implementation map | `original-14` |
| 21 What is visual, what changes physics, and what affects score | `added-22` |
| 21.1 Prediction is deliberately incomplete | `added-22` |
| 21.2 Rewards are not conservation laws | `added-22` |
| 22 Reading the 250-stage verification correctly | `added-23` |
| 23 Experiments a beginner can try | `added-24` |
| A Symbols and useful release constants | Original reference table / definitions retained; static text is appropriate. |
| B Source map and numerical-figure provenance | Original reference table / definitions retained; static text is appropriate. |
| C Glossary | Original reference table / definitions retained; static text is appropriate. |

## Source-to-model decisions

- `src/physics.js`: solver copied verbatim apart from exports/IIFE; all coupled motion uses it. There is no independent sinusoidal multi-link animation.
- `src/main.js`: launch state, wind/pivot acceleration, zone decay, pulses, contact sampling, boost, armor, gate, laser, fields, portal and rail formulas inspected and adapted in `js/physics/rules.js` / `js/diagrams/diagrams.js`.
- `src/engine/collisions.js`: old last-link velocities are used together for the source clone exchange. No momentum-conservation claim is made.
- `src/engine/renderer.js`, `game-sizes.js`, `gimmick-guide.js`: separated art, contact radii and mechanical state.
- All six stage builders, stage configuration/index, balance/scaling and all 250 generated layouts were inspected for mechanics and parameter families. Their inventory is in `tests/evidence/stage-audit.json`.
- The wind HUD unit mismatch, portal display-factor mismatch, final-substep field weighting, signed bumper multiplier and sampled collision limitations are retained explicitly in the original prose.
- Plot data come from the supplied `model-data.json`. The sensitivity figure retains both tip separation and relative-energy-error panels.
- RK4/pipeline highlights, circle/segment geometry, the bomb clearing schematic, desired-exit sweep, sampling schematic, clocks and input timeline are explanatory schematics. They are labeled as such; their prescribed motion is not presented as mechanical dynamics.
- The matrix figure uses the current coupled angles, not fixed example coefficients. Energy and vector figures calculate their displayed values from the same live nonlinear state.
- The new game-rule examples are isolated illustrative layouts, not exact replays of authored stages. The source game itself remains available unchanged in the repository.
