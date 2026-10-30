// Convert pointer coordinates through the centered object-fit: contain viewport.
export function pointerToCanvas(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
  if (!(scale > 0)) return null;
  const left = rect.left + (rect.width - canvas.width * scale) / 2;
  const top = rect.top + (rect.height - canvas.height * scale) / 2;
  const x = (event.clientX - left) / scale;
  const y = (event.clientY - top) / scale;
  return x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height ? { x, y } : null;
}

// Mouse, touch, pointer-capture, and Spacebar controls.
export function installInputHandlers({ $, canvas, wrapper, getState, indexToStageSub, PENDULUM_SCALE, BOB_MIN_R, unlockAudio, triggerPulse, triggerHaptic, fire, initVisualsOnly, togglePause }) {
  let activePointerId = null;
  let dragStageIndex = null;

  function isGameScreenActive() {
    return $('titleScreen').classList.contains('hidden') &&
      $('tutorialScreen').classList.contains('hidden') &&
      !$('mapModal').classList.contains('active') && !document.querySelector('dialog[open]');
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
wrapper.addEventListener('pointerdown', e => {
  if (!isGameScreenActive() || !$('stageBriefing').classList.contains('hidden') ||
      activePointerId !== null || e.isPrimary === false || e.button !== 0) return;
  if (e.target.closest('.overlay') || e.target.closest('button') || e.target.closest('.stage-briefing')) return;
  if (getState().gameStatus === 'paused') return;
  const p = pointerToCanvas(canvas, e);
  if (!p) return;
  unlockAudio();
  if (getState().gameStatus === 'playing') { triggerPulse(); return; }
  if (getState().gameStatus === 'setup' && getState().systems.length > 0) {
    const stageInfo = indexToStageSub(getState().currentStageIndex);
    if (stageInfo.stage === 7) return;

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

  const p = pointerToCanvas(canvas, e);
  if (!p) { cancelDrag(); return; }
  const dx = p.x - getState().PIVOT.x, dy = p.y - getState().PIVOT.y;
  let deg = Math.atan2(dx, dy) * 180 / Math.PI;
  const clamped = Math.max(-180, Math.min(180, Math.round(deg)));
  $('sliderAngle').value = clamped; $('valAngle').textContent = clamped + '°'; initVisualsOnly();
});

wrapper.addEventListener('pointerup', e => {
  if (e.pointerId !== activePointerId) return;
  const shouldFire = canContinueDrag(e) && pointerToCanvas(canvas, e) !== null;
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
