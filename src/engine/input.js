// Mouse, touch, pointer-capture, and Spacebar controls.
export function installInputHandlers({ $, canvas, wrapper, getState, indexToStageSub, PENDULUM_SCALE, BOB_MIN_R, unlockAudio, triggerPulse, triggerHaptic, fire, initVisualsOnly, togglePause }) {
  let activePointerId = null;
  let dragStageIndex = null;

  function isGameScreenActive() {
    return $('titleScreen').classList.contains('hidden') &&
      $('tutorialScreen').classList.contains('hidden') &&
      !$('mapModal').classList.contains('active');
  }

  function cancelDrag() {
    const pointerId = activePointerId;
    activePointerId = null;
    dragStageIndex = null;
    if (pointerId !== null && wrapper.hasPointerCapture(pointerId)) {
      wrapper.releasePointerCapture(pointerId);
    }
  }

  function canContinueDrag(e) {
    return e.pointerId === activePointerId && isGameScreenActive() &&
      $('stageBriefing').classList.contains('hidden') &&
      getState().gameStatus === 'setup' &&
      getState().currentStageIndex === dragStageIndex;
  }

  wrapper.addEventListener('pointercancel', e => {
    if (e.pointerId === activePointerId) cancelDrag();
  });
  wrapper.addEventListener('lostpointercapture', e => {
    if (e.pointerId === activePointerId) cancelDrag();
  });
  window.addEventListener('blur', cancelDrag);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelDrag();
  });
  document.addEventListener('click', e => {
    if (e.target.closest('button, .stage-btn')) cancelDrag();
  }, true);
  function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
}

wrapper.addEventListener('pointerdown', e => {
  if (!isGameScreenActive() || !$('stageBriefing').classList.contains('hidden') ||
      activePointerId !== null || e.isPrimary === false || e.button !== 0) return;
  if (e.target.closest('.overlay') || e.target.closest('button') || e.target.closest('.stage-briefing')) return;
  if (getState().gameStatus === 'paused') return;
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
      activePointerId = e.pointerId; dragStageIndex = getState().currentStageIndex;
      wrapper.setPointerCapture(e.pointerId); triggerHaptic('bounce');
    }
  }
});

wrapper.addEventListener('pointermove', e => {
  if (e.pointerId !== activePointerId) return;
  if (!canContinueDrag(e)) { cancelDrag(); return; }
  const stageInfo = indexToStageSub(getState().currentStageIndex);
  if (stageInfo.stage === 7) return;

  const p = getCanvasPos(e);
  const dx = p.x - getState().PIVOT.x, dy = p.y - getState().PIVOT.y;
  let deg = Math.atan2(dx, dy) * 180 / Math.PI;
  const clamped = Math.max(-180, Math.min(180, Math.round(deg)));
  $('sliderAngle').value = clamped; $('valAngle').textContent = clamped + '°'; initVisualsOnly();
});

wrapper.addEventListener('pointerup', e => {
  if (e.pointerId !== activePointerId) return;
  const shouldFire = canContinueDrag(e);
  cancelDrag();
  if (shouldFire) fire();
});

window.addEventListener('keydown', e => {
  if (e.code === 'KeyP') {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || !isGameScreenActive() ||
        !$('stageBriefing').classList.contains('hidden') || $('overlay').classList.contains('active') ||
        e.target.closest('button, input, select, textarea, a[href], [contenteditable]:not([contenteditable="false"])')) return;
    if (!['playing', 'paused', 'clearing', 'blackhole_death'].includes(getState().gameStatus)) return;
    e.preventDefault();
    if (e.repeat) return;
    cancelDrag();
    togglePause();
    return;
  }
  if (e.code === 'Space') {
    if (e.defaultPrevented || !isGameScreenActive() ||
        e.target.closest('button, input, select, textarea, a[href], [contenteditable]:not([contenteditable="false"])')) return;
    e.preventDefault();
    if (e.repeat) return;
    cancelDrag();
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
