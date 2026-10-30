// Locked pulses satisfy the pulse condition without changing the speed requirement.
export function calculateStageStars({ startingPulses, pulsesLeft, timeRemaining, timeLimit }) {
  const pulseBonus = startingPulses === 0 || pulsesLeft > 0;
  const speedBonus = timeRemaining >= timeLimit * 0.35;
  return { stars: 1 + Number(pulseBonus) + Number(speedBonus), pulseBonus, speedBonus };
}
