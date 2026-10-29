// Mouse, touch, pointer-capture, and Spacebar controls.
export function installInputHandlers({ $, canvas, wrapper, getState, indexToStageSub, PENDULUM_SCALE, BOB_MIN_R, unlockAudio, triggerPulse, triggerHaptic, fire, initVisualsOnly }) {
  let isDragging = false;
  function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
}

wrapper.addEventListener('pointerdown', e => {
  if (e.target.closest('.overlay') || e.target.closest('button') || e.target.closest('.stage-briefing')) return;
  unlockAudio();
  if (getState().gameStatus === 'playing') { triggerPulse(); return; }
  if (getState().gameStatus === 'setup' && getState().systems.length > 0) {
    const stageInfo = indexToStageSub(getState().currentStageIndex);
    if (stageInfo.stage === 7) return;

    const p = getCanvasPos(e);
    const chain = getState().systems[0]; let px = getState().PIVOT.x, py = getState().PIVOT.y;
    for (let i = 0; i < chain.N; i++) {
      px += PENDULUM_SCALE * chain.L[i] * Math.sin(chain.state[i]);
      py += PENDULUM_SCALE * chain.L[i] * Math.cos(chain.state[i]);
    }
    const grabR = Math.max(70, (chain.currentR || BOB_MIN_R) * 3);
    if (Math.hypot(p.x - px, p.y - py) < grabR) {
      isDragging = true; wrapper.setPointerCapture(e.pointerId); triggerHaptic('bounce');
    }
  }
});

wrapper.addEventListener('pointermove', e => {
  if (!isDragging || getState().gameStatus !== 'setup') return;
  const stageInfo = indexToStageSub(getState().currentStageIndex);
  if (stageInfo.stage === 7) return;

  const p = getCanvasPos(e);
  const dx = p.x - getState().PIVOT.x, dy = p.y - getState().PIVOT.y;
  let deg = Math.atan2(dx, dy) * 180 / Math.PI;
  const clamped = Math.max(-180, Math.min(180, Math.round(deg)));
  $('sliderAngle').value = clamped; $('valAngle').textContent = clamped + '°'; initVisualsOnly();
});

wrapper.addEventListener('pointerup', e => {
  if (isDragging) { wrapper.releasePointerCapture(e.pointerId); isDragging = false; fire(); }
});

window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!$('stageBriefing').classList.contains('hidden')) {
      $('btnDismissBriefing').click();
      return;
    }
    if ($('overlay').classList.contains('active')) {
      $('overlayBtn').click();
      return;
    }
    if (getState().gameStatus === 'setup') fire();
    else if (getState().gameStatus === 'playing') triggerPulse();
  }
});
}
