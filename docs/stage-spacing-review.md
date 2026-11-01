# Full stage spacing review

Baseline: `34faedf` on `dev/shaded-canvas-artwork` (after halving bob growth).
All 250 substages were audited in their 800 × 600 gameplay coordinates.

## Findings and implemented scope

- **193 substages across stages 3–50** had at least one issue under the artwork/path audit below. Their exact substage numbers are listed in the table.
- **57 substages keep their previous layout**, including all of stages 1 and 2.
- Corrections retain object counts, contact radii, target HP, link/clone settings,
  time limits, gravity, wind, field strengths, patrol amplitudes/speeds/phases and
  moving-anchor settings. Only local object positions and nine stages’ beam
  positions change. Fields and zones retain their intended gameplay roles.
- Targets remain within the previous radial envelope or 295px from the stationary
  base pivot. This is a reference envelope, not a substitute for gameplay verification.
- Checked-in coordinate overrides in `src/data/stage-spacing.js` make layouts
  deterministic. There is no random or runtime layout relaxation.
- Portal identifiers choose a clear nearby position, with a short leader when
  relocated. This avoids labels being covered by another portal or a beam.

## Audit definition

The audit checks all primary circular objects against each other, including black-hole
and repulsor cores. It accounts for the full horizontal patrol envelope; equal-speed
moving pairs use their relative sinusoidal phase, while different speeds use a
conservative independent-envelope bound. It also checks bodies/patrols against
laser and closed-gate segments (13 samples along each horizontal patrol).

Visual envelopes allow for target rims (1.06× contact radius), tall oval portals
(1.25×), bomb casing/fuse (1.5× radius, offset upward by 0.5×), and spring artwork
(1.4× radius, offset downward by 0.4×). These are practical spacing aids, not new hit areas or pixel-perfect
bounds for every decorative shadow. New layouts aim for 8px of additional separation and use 0.001px
coordinate rounding; the regression audit allows 0.01px numerical tolerance.

The audit intentionally permits translucent force-field auras, zone coverage,
trails, particles, pendulum motion through gimmicks, and designed laser-to-laser
crossings. Moving anchor rails remain at their authored positions. It does not
claim that every arbitrary grown-bob passage is traversable or that difficulty is
identical to the previous layouts. Saved solutions must be independently replayed
through STAGE CLEAR before release.

## Exact affected substages

| Stage | Name | Substages corrected | Issues found before correction |
| --- | --- | --- | --- |
| 3 | FULL THROTTLE | 3 | pads / patrols |
| 4 | BOMB CARNIVAL | 1, 2, 3, 4, 5 | target cluster |
| 5 | BANK SHOT | 3, 4 | pads / patrols, target cluster |
| 6 | BEAT THE PATROL | 2, 3, 5 | pads / patrols, target cluster |
| 7 | ARMORED TARGETS | 2, 3, 4, 5 | pads / patrols, target cluster |
| 8 | SUPER BOUNCER | 2, 3, 4, 5 | pads / patrols, target cluster |
| 9 | GALE VALLEY | 3, 4, 5 | pads / patrols |
| 10 | WIND SURFER | 2, 3, 4, 5 | pads / patrols |
| 11 | MOON BOUNCE | 1, 2, 3, 4, 5 | pads / patrols, target cluster |
| 12 | METEOR DIVE | 1, 2, 3, 4, 5 | pads / patrols |
| 13 | BLACK HOLE | 1, 2, 3, 4 | field cores, target cluster |
| 14 | TWIN VORTEX | 1, 3, 4, 5 | field cores, pads / patrols, target cluster |
| 15 | FORCE FIELD | 5 | field cores |
| 16 | PUSH & PULL | 1, 2, 3, 4, 5 | field cores, pads / patrols, target cluster |
| 17 | ROLLER TRACK | 1, 2, 3, 4 | pads / patrols, target cluster |
| 18 | SKY LIFT | 1, 2, 3, 5 | pads / patrols, target cluster |
| 19 | CAROUSEL | 2, 4, 5 | pads / patrols, target cluster |
| 20 | STORM RUNNER | 1, 2, 3, 4, 5 | pads / patrols, target cluster |
| 21 | CYCLONE ELEVATOR | 2, 4, 5 | pads / patrols, target cluster |
| 22 | ABYSS RUNNER | 1, 3, 4 | target cluster |
| 23 | WARP GATES | 1, 2, 3, 4, 5 | pads / patrols, portals, target cluster |
| 24 | DASH RINGS | 2, 3, 5 | boost rings, pads / patrols, target cluster |
| 25 | SECURITY KEY | 1, 2, 3, 4, 5 | gates, pads / patrols, switches, target cluster |
| 26 | LASER TRIPWIRE | 1, 2, 3, 5 | lasers, pads / patrols, target cluster |
| 27 | WARP HYPERCUBE | 1, 2, 3, 4, 5 | pads / patrols, portals, target cluster |
| 28 | SECURITY MAZE | 1, 2, 3, 4, 5 | boost rings, gates, lasers, pads / patrols, switches, target cluster |
| 29 | LASER PORTAL | 1, 2, 3, 4, 5 | lasers, pads / patrols, portals, target cluster |
| 30 | THE VAULT HEIST | 1, 2, 3, 4, 5 | gates, lasers, pads / patrols, switches, target cluster |
| 31 | SOLAR STORM | 2, 3, 4, 5 | lasers, pads / patrols, target cluster |
| 32 | SLIME SLOUGH | 2, 3, 4, 5 | pads / patrols, target cluster |
| 33 | BRAKE & BOOST | 2, 3, 4, 5 | boost rings, pads / patrols, target cluster |
| 34 | TWIN LAUNCH | 2, 3, 4, 5 | pads / patrols |
| 35 | TWIN STORM | 1, 2, 3, 4, 5 | pads / patrols, target cluster |
| 36 | TRIPLE WHIP | 2, 3, 4, 5 | pads / patrols |
| 37 | QUAD CHAOS | 2, 3, 4, 5 | pads / patrols |
| 38 | FIVE-LINK FRENZY | 2, 3, 4, 5 | pads / patrols |
| 39 | CEILING RUSH | 3, 5 | target cluster |
| 40 | ZERO GRAVITY | 1, 2, 3, 4, 5 | pads / patrols, target cluster |
| 41 | GRAVITY METRONOME | 2, 4, 5 | pads / patrols |
| 42 | MIRROR SHADOWS | 1, 2, 3, 4, 5 | pads / patrols, target cluster |
| 43 | BUMPER BANKS | 2, 3, 4, 5 | pads / patrols, target cluster |
| 44 | VORTEX BOOST | 1, 2, 3, 4, 5 | boost rings, field cores, pads / patrols, target cluster |
| 45 | PINBALL MANIA | 1, 2, 3, 4, 5 | boost rings, pads / patrols, target cluster |
| 46 | THE GAUNTLET | 1, 2, 3, 4, 5 | field cores, pads / patrols, target cluster |
| 47 | CYBER HORIZON | 1, 2, 3, 4, 5 | boost rings, lasers, pads / patrols, portals, target cluster |
| 48 | WARP METRONOME | 2, 3, 4, 5 | boost rings, lasers, pads / patrols, portals, target cluster |
| 49 | 5-LINK INVERSION | 2, 3, 4, 5 | pads / patrols, target cluster |
| 50 | COSMIC APEX | 2, 3, 4, 5 | boost rings, lasers, pads / patrols, portals, target cluster |

## Beam placement adjustments

In addition to circular-object positions, these laser/gate layouts shift locally
to avoid faces, fuses or pad patrols: **28-4, 29-5, 30-2, 31-4, 47-5, 48-3, 48-4,
50-3 and 50-4**. Beam counts and lengths are retained; switch gates retain their
linked switch, timer and closed/open behavior.

## Reproduce

```sh
node scripts/audit-stage-spacing.mjs
node --test tests/*.test.mjs
node scripts/verify-solutions.cjs
node tests/verification.cjs
```

The geometric audit reports zero remaining issues under the stated rules. The
verification report fingerprints the new spacing source as part of the simulation.


## Validation completed

All 250 updated saved solutions independently reached the real STAGE CLEAR result
with the fixed 1/60-second verification model and four integration substeps.
The geometry audit reports no remaining intersections under the definition above;
unit, artwork, save, replay, localization and mobile browser checks cover the update.
This establishes repeatability for that model, not identical variable-frame behavior
on every device or unchanged human difficulty.
