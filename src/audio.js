// --- Web Audio System ---
let audioCtx = null;
let masterGain = null;
let preferences = { volume: 1, muted: false };

export function setAudioPreferences(next) {
  preferences = { ...preferences, ...next };
  if (masterGain) masterGain.gain.value = preferences.muted ? 0 : preferences.volume;
}
let noiseSource = null, noiseFilter = null, noiseGain = null;

export function unlockAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = preferences.muted ? 0 : preferences.volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

export function suspendAudio() {
  if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
}

export function initWindAudio() {
  unlockAudio();
  if (!noiseSource && audioCtx) {
    const bufSize = Math.floor(audioCtx.sampleRate * 1.5);
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buf;
    noiseSource.loop = true;

    noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
  }
}

export function updateWindSpeed(speed, isPlaying = true) {
  if (!audioCtx || !isPlaying) {
    if (noiseGain && audioCtx) noiseGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    return;
  }
  const now = audioCtx.currentTime;
  const freq = 380 + Math.min(2200, speed * 120);
  const gain = Math.min(0.24, Math.max(0, (speed - 0.4) * 0.02));
  noiseFilter.frequency.setTargetAtTime(freq, now, 0.04);
  noiseGain.gain.setTargetAtTime(gain, now, 0.04);
}

export function playSnd(type, combo = 0) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const now = audioCtx.currentTime;
  if (type === 'hit') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    const pitchFactor = Math.pow(1.05946, Math.min(8, combo));
    o.frequency.setValueAtTime(980 * pitchFactor, now);
    o.frequency.setValueAtTime(1400 * pitchFactor, now + 0.04);
    g.gain.setValueAtTime(0.35, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.21);
  } else if (type === 'brake') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, now);
    o.frequency.exponentialRampToValueAtTime(70, now + 0.25);
    g.gain.setValueAtTime(0.4, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.26);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.27);
  } else if (type === 'clink') {
    // Subtle, low-pitched ceramic/metallic "clink" when chipping/shrinking
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(320, now);
    o.frequency.exponentialRampToValueAtTime(140, now + 0.12);
    g.gain.setValueAtTime(0.28, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.14);
  } else if (type === 'bomb') {
    const bufSize = Math.floor(audioCtx.sampleRate * 0.4);
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const f = audioCtx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 450;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.6, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(now);
  } else if (type === 'pulse') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(320, now);
    o.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    g.gain.setValueAtTime(0.35, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.16);
  } else if (type === 'clear') {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now + i * 0.09);
      g.gain.setValueAtTime(0.25, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);
      o.connect(g); g.connect(masterGain);
      o.start(now + i*0.09); o.stop(now + i*0.09 + 0.45);
    });
  } else if (type === 'fail') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(150, now);
    o.frequency.exponentialRampToValueAtTime(45, now + 0.4);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.42);
  } else if (type === 'firework') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(400 + Math.random()*200, now);
    o.frequency.exponentialRampToValueAtTime(80, now + 0.18);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.2);
  } else if (type === 'portal') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(600, now);
    o.frequency.exponentialRampToValueAtTime(150, now + 0.35);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.36);
  } else if (type === 'laser') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(880, now);
    o.frequency.exponentialRampToValueAtTime(120, now + 0.2);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.21);
  } else if (type === 'boost') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(260, now);
    o.frequency.exponentialRampToValueAtTime(920, now + 0.2);
    g.gain.setValueAtTime(0.35, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.23);
  } else if (type === 'gate') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(440, now);
    o.frequency.setValueAtTime(660, now + 0.08);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.26);
  } else if (type === 'spring') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(180, now);
    o.frequency.exponentialRampToValueAtTime(680, now + 0.15);
    g.gain.setValueAtTime(0.4, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.21);
  } else if (type === 'shield_hit') {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(750, now);
    o.frequency.exponentialRampToValueAtTime(320, now + 0.09);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    o.connect(g); g.connect(masterGain);
    o.start(now); o.stop(now + 0.12);
  }
}
