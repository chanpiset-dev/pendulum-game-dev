// Inter-pendulum tip collision resolution.
export function resolveInterBobCollisions(sdt, { systems, PIVOT, PENDULUM_SCALE, BOB_MIN_R, playSnd, triggerHaptic, shockwaves, particles, screenShake: initialScreenShake }) {
  let screenShake = initialScreenShake;
  if (systems.length < 2) return screenShake;

  const scale = PENDULUM_SCALE;

  // Decrease cooldown timers
  for (let c = 0; c < systems.length; c++) {
    if (systems[c].interCooldown > 0) {
      systems[c].interCooldown -= sdt;
    }
  }

  for (let i = 0; i < systems.length; i++) {
    const chainA = systems[i];
    if (!chainA.alive) continue;

    // Compute tip position of chain A
    let ax = PIVOT.x, ay = PIVOT.y;
    for (let k = 0; k < chainA.N; k++) {
      ax += scale * chainA.L[k] * Math.sin(chainA.state[k]);
      ay += scale * chainA.L[k] * Math.cos(chainA.state[k]);
    }
    const rA = chainA.currentR || BOB_MIN_R;

    for (let j = i + 1; j < systems.length; j++) {
      const chainB = systems[j];
      if (!chainB.alive) continue;

      if (chainA.interCooldown > 0 || chainB.interCooldown > 0) continue;

      // Compute tip position of chain B
      let bx = PIVOT.x, by = PIVOT.y;
      for (let k = 0; k < chainB.N; k++) {
        bx += scale * chainB.L[k] * Math.sin(chainB.state[k]);
        by += scale * chainB.L[k] * Math.cos(chainB.state[k]);
      }
      const rB = chainB.currentR || BOB_MIN_R;

      const dx = bx - ax;
      const dy = by - ay;
      const dist = Math.hypot(dx, dy);
      const minDist = rA + rB;

      // Check collision
      if (dist < minDist && dist > 0.001) {
        // Normal vector from A to B
        const nx = dx / dist;
        const ny = dy / dist;

        // Tangent vector of chain A's tip
        const thA = chainA.state[chainA.N - 1];
        const txA = Math.cos(thA);
        const tyA = -Math.sin(thA);

        // Tangent vector of chain B's tip
        const thB = chainB.state[chainB.N - 1];
        const txB = Math.cos(thB);
        const tyB = -Math.sin(thB);

        // Current tip angular velocities
        const wA = chainA.state[chainA.N + chainA.N - 1];
        const wB = chainB.state[chainB.N + chainB.N - 1];

        // 1D elastic momentum exchange with restitution along the collision normal
        const restitution = 0.85; // 0.85 = realistic bouncy clack
        
        // Exchange or invert velocities
        chainA.state[chainA.N + chainA.N - 1] = -wA * restitution + (wB * 0.3);
        chainB.state[chainB.N + chainB.N - 1] = -wB * restitution + (wA * 0.3);

        // Set short debouncing cooldown
        chainA.interCooldown = 0.06;
        chainB.interCooldown = 0.06;

        // Midpoint coordinates for visual & audio FX
        const midX = (ax + bx) / 2;
        const midY = (ay + by) / 2;

        playSnd('clink');
        triggerHaptic('bounce');
        screenShake = Math.max(screenShake, 5.0);

        shockwaves.push({
          x: midX,
          y: midY,
          r: 10,
          maxR: 65,
          life: 0.8,
          color: '#ffffff'
        });

        // Spawn contact sparks
        for (let p = 0; p < 8; p++) {
          const pa = Math.random() * Math.PI * 2;
          const ps = Math.random() * 120 + 40;
          particles.push({
            x: midX,
            y: midY,
            vx: Math.cos(pa) * ps,
            vy: Math.sin(pa) * ps,
            isShard: true,
            shape: 'tri',
            size: 3.0,
            rot: Math.random() * Math.PI * 2,
            rotSpd: (Math.random() - 0.5) * 20,
            life: 0.5,
            decay: 2.0,
            color: '#e2e8f0'
          });
        }
      }
    }
  }
  return screenShake;
}

