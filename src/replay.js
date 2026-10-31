// A visual recording, isolated from physics and progress saving. No audio or storage writes.
export function createAttemptReplay({ canvas, $, pauseGame, getBackground = () => '#020503', language = () => 'en' }) {
  const buffer = document.createElement('canvas');
  buffer.width = 640; buffer.height = 480;
  const context = buffer.getContext('2d');
  const view = $('replayCanvas').getContext('2d');
  const dialog = $('replayDialog');
  let frames = [], recording = false, elapsed = 0, interval = 0.1, nextCapture = 0;
  let label = '', position = 0, playing = false, animation = null, previous = 0, renderVersion = 0;
  const format = value => `${value.toFixed(1)}${language() === 'ja' ? '秒' : 's'}`;
  function stop() {
    playing = false;
    cancelAnimationFrame(animation);
    animation = null;
    $('replayPlay').textContent = 'PLAY';
  }
  function render() {
    $('replayDescription').textContent = typeof label === 'object' ? label[language()] : label;
    $('replaySeek').value = position;
    $('replayTime').textContent = `${format(position)} / ${format(elapsed)}`;
    $('replaySeek').setAttribute('aria-valuetext', `${format(position)} / ${format(elapsed)}`);
    let frame = frames[0];
    for (const candidate of frames) {
      if (candidate.time > position) break;
      frame = candidate;
    }
    if (!frame) return;
    const version = ++renderVersion;
    const image = new Image();
    image.onload = () => {
      if (version === renderVersion && dialog.open) view.drawImage(image, 0, 0, 800, 600);
    };
    image.src = frame.image;
  }
  function tick(now) {
    if (!playing) return;
    position = Math.min(elapsed, position + (now - previous) / 1000 * Number($('replaySpeed').value));
    previous = now;
    render();
    if (position >= elapsed) stop();
    else animation = requestAnimationFrame(tick);
  }
  $('btnReplay').addEventListener('click', () => {
    if (recording || !frames.length) return;
    pauseGame();
    stop(); position = 0;
    $('replaySeek').max = elapsed;
    view.clearRect(0, 0, view.canvas.width, view.canvas.height);
    dialog.showModal(); render(); $('replayPlay').focus();
  });
  $('replayPlay').addEventListener('click', () => {
    if (playing) { stop(); return; }
    if (position >= elapsed) position = 0;
    playing = true; previous = performance.now();
    $('replayPlay').textContent = 'PAUSE';
    animation = requestAnimationFrame(tick);
  });
  $('replaySeek').addEventListener('input', () => { position = Number($('replaySeek').value); render(); });
  $('replayClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', stop);
  dialog.addEventListener('cancel', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('blur', stop);
  return {
    refresh() { if (dialog.open) render(); },
    begin(stageLabel) {
      stop(); frames = []; elapsed = 0; interval = 0.1; nextCapture = 0;
      label = stageLabel; recording = true; $('btnReplay').disabled = true;
    },
    capture(delta, force = false) {
      if (!recording) return;
      elapsed += delta;
      if (!force && elapsed < nextCapture) return;
      try {
        // The live canvas is transparent. Replace the previous capture with the
        // same opaque backdrop as the game before compositing this frame.
        context.fillStyle = getBackground();
        context.fillRect(0, 0, buffer.width, buffer.height);
        context.drawImage(canvas, 0, 0, buffer.width, buffer.height);
        frames.push({ time: elapsed, image: buffer.toDataURL('image/jpeg', 0.65) });
        // Bound memory while retaining the entire attempt, at lower sampling rates for long runs.
        if (frames.length >= 600) { frames = frames.filter((_, index) => index % 2 === 0); interval *= 2; }
        nextCapture = elapsed + interval;
      } catch { recording = false; }
    },
    finish() {
      if (recording) this.capture(0, true);
      recording = false; $('btnReplay').disabled = frames.length === 0;
    },
  };
}
