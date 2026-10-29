# Stage Map (Stages 1–50)

Display stage IDs now match the actual stage-builder IDs. The `STAGE_ORDER` array is sequential, so Stage N loads builder Stage N.

| Stage ID / Display ID | Configuration name | Builder section | Builder file |
|---:|---|---|---|
| 1 | FIRST SWING | BALLISTIC BASICS | `src/data/stage-builders/world1-basics.js` |
| 2 | FREE FALL | ANGLE TUNING TRIALS | `src/data/stage-builders/world1-basics.js` |
| 3 | BOMB CARNIVAL | EXPLOSIVE CHAIN REACTIONS | `src/data/stage-builders/world1-basics.js` |
| 4 | BANK SHOT | HAZARD BARRIERS | `src/data/stage-builders/world1-basics.js` |
| 5 | BEAT THE PATROL | PATROLLING OBSTACLES | `src/data/stage-builders/world1-basics.js` |
| 6 | BLACK HOLE | THE SINGULARITY EVENT | `src/data/stage-builders/world1-basics.js` |
| 7 | FULL THROTTLE | SPEED TUNING TRIALS | `src/data/stage-builders/world2-force.js` |
| 8 | ROLLER TRACK | SLIDING PIVOT RAILS | `src/data/stage-builders/world2-force.js` |
| 9 | TWIN LAUNCH | CHAOTIC DIVERGENCE | `src/data/stage-builders/world2-force.js` |
| 10 | ABYSS RUNNER | SINGULARITY CORRIDOR | `src/data/stage-builders/world2-force.js` |
| 11 | GALE VALLEY | ATMOSPHERIC CROSSWIND | `src/data/stage-builders/world2-force.js` |
| 12 | WIND SURFER | GUSTING WIND SHEAR | `src/data/stage-builders/world2-force.js` |
| 13 | MOON BOUNCE | LUNAR DRIFT | `src/data/stage-builders/world2-force.js` |
| 14 | METEOR DIVE | HYPER-GRAVITY ABYSS | `src/data/stage-builders/world2-force.js` |
| 15 | TRIPLE WHIP | TRIPLE PENDULUM CHAOS | `src/data/stage-builders/world2-force.js` |
| 16 | TWIN VORTEX | BINARY SINGULARITY | `src/data/stage-builders/world2-force.js` |
| 17 | FORCE FIELD | REPULSOR FIELD | `src/data/stage-builders/world2-force.js` |
| 18 | STORM RUNNER | INERTIAL WIND CORRIDOR | `src/data/stage-builders/world2-force.js` |
| 19 | TWIN STORM | ATMOSPHERIC CHAOS CHAMBER | `src/data/stage-builders/world2-force.js` |
| 20 | THE GAUNTLET | SINGULARITY CORE MATRIX | `src/data/stage-builders/world2-force.js` |
| 21 | WARP GATES | WORMHOLE RELAY (One-Way Warp Portals) | `src/data/stage-builders/world3-gadgets.js` |
| 22 | ARMORED TARGETS | CRUMBLING CITADEL (Armored Multi-Hit Shields) | `src/data/stage-builders/world3-gadgets.js` |
| 23 | SLIME SLOUGH | VISCOUS DAMPING (Liquid Drag Zones) | `src/data/stage-builders/world3-gadgets.js` |
| 24 | SUPER BOUNCER | KINETIC SPRINGS (Force Bouncers with Restitution > 1.3x) | `src/data/stage-builders/world3-gadgets.js` |
| 25 | SKY LIFT | VERTICAL ELEVATOR (Vertical Moving Anchor Rail) | `src/data/stage-builders/world3-gadgets.js` |
| 26 | QUAD CHAOS | QUADRUPLE CHAOS (N = 4 Locked, Pulses = 0) | `src/data/stage-builders/world3-gadgets.js` |
| 27 | DASH RINGS | ACCELERATOR GATES (Directional Boost Rings) | `src/data/stage-builders/world3-gadgets.js` |
| 28 | SECURITY KEY | SECURITY MAZE (Pressure Switches & Gateways) | `src/data/stage-builders/world3-gadgets.js` |
| 29 | LASER TRIPWIRE | LASER GRID (Lethal Laser Tripwires) | `src/data/stage-builders/world3-gadgets.js` |
| 30 | CYBER HORIZON | CHAOS HORIZON (The Apex Gauntlet) | `src/data/stage-builders/world3-gadgets.js` |
| 31 | GRAVITY METRONOME | GRAVITATIONAL METRONOME (Periodic Gravity Inversion) | `src/data/stage-builders/world4-apex.js` |
| 32 | WARP ESCAPE | BINARY VORTEX (Dual Singularities + Boost Rings) | `src/data/stage-builders/world4-apex.js` |
| 33 | THE VAULT HEIST | SECURITY LABYRINTH (Lasers + Timed Gates + Armored Vaults) | `src/data/stage-builders/world4-apex.js` |
| 34 | FIVE-LINK FRENZY | QUINTUPLE WHIP (N = 5 Locked, Pulses = 0) | `src/data/stage-builders/world4-apex.js` |
| 35 | WARP METRONOME | SINGULARITY OMEGA (The Phase 6 Apex Climax) | `src/data/stage-builders/world4-apex.js` |
| 36 | BRAKE & BOOST | TIME DILATION FIELD (Viscous Zones + Boost Rings) | `src/data/stage-builders/world4-apex.js` |
| 37 | PUSH & PULL | MAGNETIC POLARITY (Repulsor + Black Hole Dipole) | `src/data/stage-builders/world4-apex.js` |
| 38 | PRISM BOUNCE | PRISM REFLECTOR (Kinetic Reflector Bouncers) | `src/data/stage-builders/world4-apex.js` |
| 39 | CAROUSEL | ORBITAL CENTRIFUGE (2D Carousel Anchor Carriage) | `src/data/stage-builders/world4-apex.js` |
| 40 | SOLAR STORM | SOLAR FLARE (Lasers + High Crosswind) | `src/data/stage-builders/world4-apex.js` |
| 41 | CEILING RUSH | CHAOS CASCADE / INVERTED WHIP (4-Link Inverted Gravity) | `src/data/stage-builders/world4-apex.js` |
| 42 | WARP HYPERCUBE | THE HYPERCUBE (Dual Paired Wormhole Loops) | `src/data/stage-builders/world4-apex.js` |
| 43 | CYCLONE ELEVATOR | CORIOLIS STORM (Vertical Elevator + Gusting Gale) | `src/data/stage-builders/world4-apex.js` |
| 44 | SECURITY MAZE | PRESSURE LOCKDOWN (Sequential Switch Maze) | `src/data/stage-builders/world4-apex.js` |
| 45 | PINBALL MANIA | ELASTIC SLINGSHOT (Boost Rings + Super Bouncers) | `src/data/stage-builders/world4-apex.js` |
| 46 | MIRROR SHADOWS | ECHO PENDULUMS (Twin Clones / Dual Launch, 0 Pulses) | `src/data/stage-builders/world4-apex.js` |
| 47 | ZERO GRAVITY | ZERO-G DRIFT (Weightless Inertial Space, g = 0.05) | `src/data/stage-builders/world4-apex.js` |
| 48 | LASER PORTAL | QUANTUM TUNNEL (Portals Guarded by Lasers) | `src/data/stage-builders/world4-apex.js` |
| 49 | 5-LINK INVERSION | THE FIVE-LINK METRONOME (5-Link Chaos + Gravity Inversion) | `src/data/stage-builders/world4-apex.js` |
| 50 | COSMIC APEX | COSMIC APEX: GENESIS (The Grand Finale Gauntlet) | `src/data/stage-builders/world4-apex.js` |
