import { createMemoryStorage, createVerificationDriver } from './verification.js';
import { migrateLegacyIndex } from './data/stage-migration.js';
import { DIFFICULTIES, chapterForStage } from './data/chapters.js';
import { OBJECT_SCALE, BOB_MIN_RADIUS, BOB_MAX_RADIUS, BOB_GROWTH, BOB_SHRINK, JOINT_RADIUS, SEGMENT_HIT_RADIUS, RAIL_HIT_RADIUS } from './game-sizes.js';
import { drawLivePendulum, artworkStyleForTheme } from './engine/artwork.js';
import { installGimmickGuide } from './gimmick-guide.js';
import { installArtworkPreview } from './artwork-preview.js';
import { installCompactLayout } from './compact-layout.js';
import { createAppearance } from './appearance.js';
import { getCanvasPalette, drawThemeBackdrop } from './themes.js';
import { installMobileControls } from './mobile-controls.js';
import { setAudioPreferences, unlockAudio, suspendAudio, initWindAudio, updateWindSpeed, playSnd } from './audio.js';
import { createAttemptReplay } from './replay.js';
import { getMechanicHints } from './tutorial-hints.js';
import { calculateStageStars } from './scoring.js';
import { rk4 } from './physics.js';
import { createProgressStore, limitGhosts } from './progress.js';
import { TOTAL_STAGES, SUBSTAGES_PER_STAGE, STAGE_ORDER, STAGE_CONFIGS, indexToStageSub, stageSubToIndex, stageSubToKey } from './data/stage-configs.js';
import { generateStageData } from './data/stage-index.js';
import { I18N, createI18nController } from './i18n.js';
import { drawGenericScene, drawGameFrame } from './engine/renderer.js';
import { installInputHandlers } from './engine/input.js';
import { resolveInterBobCollisions as resolveInterBobCollisionsEngine } from './engine/collisions.js';
import { launchFirework as launchFireworkEffect, updateParticlesAndFireworks } from './engine/particles.js';

const $ = id => document.getElementById(id);
const canvas = $('canvas'), ctx = canvas.getContext('2d');
const titleCanvas = $('titleCanvas'), tCtx = titleCanvas.getContext('2d');
const tutCanvas = $('tutorialCanvas'), tutCtx = tutCanvas.getContext('2d');
const wrapper = $('canvasWrapper');
const attemptReplay = createAttemptReplay({ canvas, $, pauseGame: () => pauseGame(), getBackground: () => getCanvasPalette().canvas, language: () => currentLang });
let W = canvas.width, H = canvas.height;
let BASE_PIVOT = { x: W / 2, y: H / 2 };
let PIVOT = { x: BASE_PIVOT.x, y: BASE_PIVOT.y };

const PENDULUM_SCALE = 120;

// --- Dynamic End-Point Bob Size & Visual Settings ---
const BOB_MIN_R = BOB_MIN_RADIUS;              // Base starting radius
const BOB_MAX_R = BOB_MAX_RADIUS;              // Max bounded radius
const BOB_GROWTH_PER_HIT = BOB_GROWTH;   // Noticeable growth per target smashed
const BOB_SHRINK_ON_HAZARD = BOB_SHRINK;  // Noticeable radius lost when hitting obstacles/bumpers
const BOB_POP_FACTOR = 1.30;       // Pop scale multiplier on target hit
const BOB_PULSE_DECAY = 4.0;       // Speed of easing back to neutral scale

// --- i18n Localization Dictionary (Default: English) ---
const verificationMode = new URLSearchParams(location.search).get('verification') === '1';
const verificationStorage = verificationMode ? createMemoryStorage() : null;
const progressStore = createProgressStore({ onStatus: showSaveStatus, ...(verificationMode ? { getStorage: () => verificationStorage } : {}) });
const savedProgress = progressStore.load();
let currentLang = savedProgress.language;
setAudioPreferences(savedProgress.preferences);
let visualsReady = false;
const appearance = createAppearance(savedProgress.preferences, () => {
  if (!visualsReady) return;
  drawThemeBackdrop(tCtx, titleCanvas.width, titleCanvas.height);
  if (!['playing', 'clearing', 'blackhole_death'].includes(gameStatus)) draw();
});



const i18nController = createI18nController({
  $,
  getCurrentLang: () => currentLang,
  setCurrentLang: lang => { currentLang = lang; },
  getCurrentStageIndex: () => currentStageIndex,
  getPulsesLeft: () => pulsesLeft,
  indexToStageSub, STAGE_CONFIGS,
  showStageBriefing, renderStageSelect,
  saveLanguage: lang => progressStore.saveSetting('language', lang),
  refreshProgress: updatePersonalBest, refreshReplay: () => attemptReplay.refresh()
});
const setLanguage = lang => i18nController.setLanguage(lang);
const applyLanguage = () => i18nController.applyLanguage();

// 1. Home Screen Segmented Switcher Click Listener
document.querySelectorAll('#homeLangSwitch .lang-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setLanguage(btn.dataset.lang);
  });
});

// 2. In-Game Header Switcher Click Listener (Toggles On The Fly)
$('btnHeaderLang').addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'ja' : 'en');
});

// --- Title Screen Simulation ---
let titleAnimId = null;
const titleChain = { N: 2, L: [1.25, 1.25], m: [1, 1], state: [Math.PI * 0.75, Math.PI * 0.75, 0, 0], trail: [] };

function resizeFullScreenCanvas() {
  titleCanvas.width = window.innerWidth;
  titleCanvas.height = window.innerHeight;
  tutCanvas.width = window.innerWidth;
  tutCanvas.height = window.innerHeight;
  titleChain.trail = [];
}
window.addEventListener('resize', resizeFullScreenCanvas);
resizeFullScreenCanvas();

function loopTitle() {
  titleAnimId = null;
  if ($('titleScreen').classList.contains('hidden')) return;
  rk4(titleChain, 0.02, 0, 0, 0, 9.8, 0.04);
  const tw = titleCanvas.width, th = titleCanvas.height;
  const tpivot = { x: tw / 2, y: th * 0.48 };
  const scale = Math.min(tw, th) * 0.18;

  let px = tpivot.x, py = tpivot.y;
  for (let i = 0; i < titleChain.N; i++) {
    px += scale * titleChain.L[i] * Math.sin(titleChain.state[i]);
    py += scale * titleChain.L[i] * Math.cos(titleChain.state[i]);
  }
  titleChain.trail.push({ x: px, y: py });
  if (titleChain.trail.length > 160) titleChain.trail.shift();

  tCtx.fillStyle = getCanvasPalette().canvas + '40';
  tCtx.fillRect(0, 0, tw, th);

  if (titleChain.trail.length > 1) {
    for (let i = 1; i < titleChain.trail.length; i++) {
      tCtx.beginPath();
      tCtx.moveTo(titleChain.trail[i-1].x, titleChain.trail[i-1].y);
      tCtx.lineTo(titleChain.trail[i].x, titleChain.trail[i].y);
      const pr = i / titleChain.trail.length;
      tCtx.strokeStyle = `hsla(${180 + pr * 120}, 100%, 65%, ${pr * 0.8})`;
      tCtx.lineWidth = 3;
      tCtx.shadowBlur = 12;
      tCtx.shadowColor = '#38bdf8';
      tCtx.stroke();
      tCtx.shadowBlur = 0;
    }
  }

  drawLivePendulum(tCtx, titleChain, tpivot, scale, 10 * OBJECT_SCALE, { style: artworkStyleForTheme(getCanvasPalette().theme), palette: getCanvasPalette() });
  titleAnimId = requestAnimationFrame(loopTitle);
}
titleAnimId = requestAnimationFrame(loopTitle);

// --- Basic Tutorial Simulation ---
let tutAnimId = null;
let tutLastTime = 0;
let tutState = {};

function initTutState() {
  tutCanvas.width = window.innerWidth;
  tutCanvas.height = window.innerHeight;
  const tw = tutCanvas.width;
  const guideBottom = document.querySelector('.tutorial-guide').getBoundingClientRect().bottom;
  const buttonTop = $('btnTutorialDone').getBoundingClientRect().top;
  const top = guideBottom + 16, bottom = Math.max(top + 100, buttonTop - 16);
  const height = bottom - top;
  const reach = Math.min(300, tw * 0.40, height * 0.32);
  const tpivot = { x: tw / 2, y: top + height * 0.34 };
  const unit = reach / 300;
  
  tutState = {
    basePivot: { x: tpivot.x, y: tpivot.y },
    pivot: { x: tpivot.x, y: tpivot.y },
    timeElapsed: 0,
    chain: {
      N: 2,
      L: [1.25 * unit, 1.25 * unit],
      m: [1, 1],
      state: [120 * Math.PI / 180, 120 * Math.PI / 180, 0, 0],
      color: { outer: '#34d399', inner: '#10b981' },
      trail: [],
      alive: true,
      currentR: BOB_MIN_R * unit,
      popScale: 1.0
    },
    targets: [
      { x: tpivot.x - 70 * unit, y: tpivot.y + 220 * unit, r: 24 * OBJECT_SCALE * unit, alive: true, isBomb: false, hp: 1, maxHp: 1 },
      { x: tpivot.x + 130 * unit, y: tpivot.y + 190 * unit, r: 24 * OBJECT_SCALE * unit, alive: true, isBomb: false, hp: 1, maxHp: 1 },
      { x: tpivot.x + 230 * unit, y: tpivot.y + 120 * unit, r: 24 * OBJECT_SCALE * unit, alive: true, isBomb: true, hp: 1, maxHp: 1 }
    ],
    obstacles: [{ x: tpivot.x - 180 * unit, y: tpivot.y + 90 * unit, r: 24 * OBJECT_SCALE * unit, restitution: -0.8, pulse: 0 }],
    unit,
    bumperCooldown: 0,
    bombTriggered: false,
    bumperTriggered: false,
    particles: [],
    shockwaves: [],
    floaters: [],
    completed: false,
    resetTimer: 0,
    pulseTriggered: false
  };
}

window.addEventListener('resize', () => { if (!$('tutorialScreen').classList.contains('hidden')) initTutState(); });

function startTutorial() {
  document.getElementById('tutorialBasics').click();
  unlockAudio();
  initWindAudio();
  $('titleScreen').classList.add('hidden');
  $('tutorialScreen').classList.remove('hidden');
  if (titleAnimId) cancelAnimationFrame(titleAnimId);
  initTutState();

  $('btnTutorialDone').classList.add('hidden');
  setTimeout(() => $('btnTutorialDone').classList.remove('hidden'), 2500);
  
  tutLastTime = performance.now();
  tutAnimId = requestAnimationFrame(loopTutorial);
}

function loopTutorial(t) {
  const dt = Math.min(0.03, (t - tutLastTime) / 1000 || 0);
  tutLastTime = t;
  
  const sub = 4, sdt = dt / sub;
  const scale = PENDULUM_SCALE;
  let maxSpd = 0;

  if (tutState.chain.popScale !== 1.0) {
    if (tutState.chain.popScale > 1.0) {
      tutState.chain.popScale = Math.max(1.0, tutState.chain.popScale - dt * BOB_PULSE_DECAY);
    } else {
      tutState.chain.popScale = Math.min(1.0, tutState.chain.popScale + dt * BOB_PULSE_DECAY * 1.5);
    }
  }

  for (let step = 0; step < sub; step++) {
    rk4(tutState.chain, sdt, 0, 0, 0, 9.8, 0.04);
    tutState.bumperCooldown = Math.max(0, tutState.bumperCooldown - sdt);
    
    if (step === sub - 1) {
      let px = tutState.pivot.x, py = tutState.pivot.y;
      let vx = 0, vy = 0;
      for (let i = 0; i < tutState.chain.N; i++) {
        const th = tutState.chain.state[i], w = tutState.chain.state[tutState.chain.N + i];
        px += scale * tutState.chain.L[i] * Math.sin(th);
        py += scale * tutState.chain.L[i] * Math.cos(th);
        vx += tutState.chain.L[i] * Math.cos(th) * w;
        vy += -tutState.chain.L[i] * Math.sin(th) * w;
      }
      maxSpd = Math.hypot(vx, vy);
      tutState.chain.trail.push({ x: px, y: py, speed: maxSpd });
      if (tutState.chain.trail.length > 180) tutState.chain.trail.shift();

      if (tutState.timeElapsed > 1.4 && !tutState.pulseTriggered) {
        tutState.pulseTriggered = true;
        tutState.chain.state[tutState.chain.N + tutState.chain.N - 1] += 2.8;
        playSnd('pulse');
        tutState.shockwaves.push({ x: px, y: py, r: 12, maxR: 95, life: 1, color: '#34d399' });
      }

      const effTipR = tutState.chain.currentR || BOB_MIN_R;
      tutState.targets.forEach(tgt => {
        if (tgt.alive && Math.hypot(px - tgt.x, py - tgt.y) < (effTipR + tgt.r)) {
          tgt.alive = false;
          tutState.chain.currentR = Math.min(BOB_MAX_R * tutState.unit, (tutState.chain.currentR || BOB_MIN_R * tutState.unit) + BOB_GROWTH_PER_HIT * tutState.unit);
          tutState.chain.popScale = BOB_POP_FACTOR;
          if (tgt.isBomb) {
            tutState.bombTriggered = true;
            playSnd('bomb');
            tutState.shockwaves.push({ x: tgt.x, y: tgt.y, r: 14, maxR: 145 * tutState.unit, life: 1, color: '#fb923c' });
            for (const nearby of tutState.targets) {
              if (nearby.alive && !nearby.isBomb && Math.hypot(nearby.x-tgt.x, nearby.y-tgt.y) < 145 * tutState.unit) {
                nearby.alive = false;
                tutState.floaters.push({ x: nearby.x, y: nearby.y, text: '+100', life: 1 });
              }
            }
          } else playSnd('hit');
          tutState.shockwaves.push({ x: tgt.x, y: tgt.y, r: 16, maxR: 110, life: 1, color: '#f87171' });
          for (let p = 0; p < 16; p++) {
            const pa = Math.random() * Math.PI * 2, ps = Math.random() * 160 + 50;
            tutState.particles.push({ x: tgt.x, y: tgt.y, vx: Math.cos(pa)*ps, vy: Math.sin(pa)*ps, life: 1.0, decay: 2.2, color: '#f87171' });
          }
          tutState.floaters.push({ x: tgt.x, y: tgt.y, text: "+100", life: 1 });
        }
      });
      for (const bumper of tutState.obstacles) {
        if (tutState.bumperCooldown <= 0 && Math.hypot(px-bumper.x, py-bumper.y) < effTipR+bumper.r) {
          tutState.chain.state[3] *= bumper.restitution;
          tutState.chain.currentR = Math.max(BOB_MIN_R * tutState.unit, tutState.chain.currentR - BOB_SHRINK_ON_HAZARD * tutState.unit);
          tutState.bumperCooldown = 0.15;
          tutState.bumperTriggered = true;
          bumper.pulse = 1;
          playSnd('brake');
          tutState.shockwaves.push({ x: px, y: py, r: 8, maxR: 45 * tutState.unit, life: 1, color: '#38bdf8' });
        }
      }
    }
    tutState.timeElapsed += sdt;
  }

  updateWindSpeed(maxSpd, true);

  for (let i = tutState.particles.length - 1; i >= 0; i--) {
    let p = tutState.particles[i];
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
    if (p.life <= 0) tutState.particles.splice(i, 1);
  }
  for (let i = tutState.shockwaves.length - 1; i >= 0; i--) {
    let sw = tutState.shockwaves[i];
    sw.r += (sw.maxR - sw.r) * 12 * dt; sw.life -= 3.0 * dt;
    if (sw.life <= 0) tutState.shockwaves.splice(i, 1);
  }
  for (let i = tutState.floaters.length - 1; i >= 0; i--) {
    tutState.floaters[i].y -= dt * 40; tutState.floaters[i].life -= dt * 1.5;
    if (tutState.floaters[i].life <= 0) tutState.floaters.splice(i, 1);
  }

  if (tutState.targets.every(t => !t.alive) && tutState.bumperTriggered && !tutState.completed) {
    tutState.completed = true;
    $('btnTutorialDone').classList.remove('hidden');
    playSnd('clear');
    tutState.resetTimer = 3.5;
  }

  if (tutState.timeElapsed > 16 && !tutState.completed) { tutState.completed = true; tutState.resetTimer = 1; }
  if (tutState.completed) {
    tutState.resetTimer -= dt;
    if (tutState.resetTimer <= 0) {
      initTutState();
    }
  }

  drawThemeBackdrop(tutCtx, tutCanvas.width, tutCanvas.height);

  drawGenericScene(
    tutCtx,
    [tutState.chain],
    tutState.targets,
    tutState.obstacles,
    null,
    tutState.particles,
    tutState.shockwaves,
    tutState.floaters,
    tutState.pivot,
    null,
    [], [], [], [], [],
    { currentLang, BASE_PIVOT: tutState.basePivot, PIVOT: tutState.pivot, BOB_MIN_R: BOB_MIN_R * tutState.unit }
  );

  tutAnimId = requestAnimationFrame(loopTutorial);
}

// --- Generalized Drawing Function ---
// --- Main Game Setup & Globals ---
let unlockedStageIndex = savedProgress.unlocked;
let highScores = savedProgress.scores;
let stageGhosts = savedProgress.ghosts;
let stageStars = savedProgress.stars;
let bestTimes = savedProgress.times;
let briefedStages = savedProgress.briefed;

let currentStageIndex = 1;
let gameStatus = 'setup';
let gameAnimId = null;
let pausedStatus = null;
let launchParameters = null;
const gameTimers = new Set();
let systems = [];
let targets = [];
let obstacles = [];
let blackhole = null;
let currentRail = null;
let currentPortals = [];
let currentSwitches = [];
let currentBoostRings = [];
let currentZones = [];
let currentLasers = [];
let maxLives = 1;
let currentLives = 1;
let laserCooldown = 0;

let particles = [];
let shockwaves = [];
let floaters = [];
let fireworks = [];
let activeGhost = null;
let currentRunHistory = [];
let currentWind = null;
let currentGravity = 9.8;
let baseGravity = 9.8;
let gravityInversionTimer = 0;
let gravityInversionInterval = 0;

let timeElapsed = 0;
let timeLimit = 8;
let lastTime = 0;
let clearingTimer = 0;
let currentStageScore = 0;
let pulsesLeft = 3;
let startingPulses = 3;

let screenShake = 0;
let hitStopTimer = 0;
let timeScale = 1.0;
let sandboxRespawning = false;
let clearFlashTimer = 0;
let comboCount = 0;
let comboTimer = 0;

$('btnStartGame').addEventListener('click', () => {
  $('titleScreen').classList.add('hidden');
  if (titleAnimId) cancelAnimationFrame(titleAnimId);
  initVisualsOnly();
});
$('btnGoTutorial').addEventListener('click', startTutorial);
$('btnTutorialDone').addEventListener('click', () => {
  $('tutorialScreen').classList.add('hidden');
  if (tutAnimId) cancelAnimationFrame(tutAnimId);
  updateWindSpeed(0, false);
  loadStage(1);
});

$('btnTitle').addEventListener('click', () => {
  attemptReplay.finish();
  stopGameLoop();
  clearGameTimers();
  resetPauseControls();
  gameStatus = 'setup';
  updateWindSpeed(0, false);
  suspendAudio();
  $('titleScreen').classList.remove('hidden');
  resizeFullScreenCanvas();
  if (titleAnimId) cancelAnimationFrame(titleAnimId);
  titleAnimId = requestAnimationFrame(loopTitle);
});

$('btnDismissBriefing').addEventListener('click', () => {
  $('stageBriefing').classList.add('hidden');
});

function showSaveStatus({ kind, message }) {
  $('saveStatus').textContent = kind === 'error' ? I18N[document.documentElement.lang === 'ja' ? 'ja' : 'en'].saveError : message;
  $('saveStatus').dataset.kind = kind;
  $('saveStatus').hidden = !['warning', 'error'].includes(kind);
}

function saveData(stgIdx, score, ghostTrail, stars, completionTime = null) {
  if (stgIdx === 'sandbox') return;
  const { stage, sub } = indexToStageSub(stgIdx);
  const stageKey = stageSubToKey(stage, sub);
  let ghostChanged = false;
  if (!highScores[stageKey] || score > highScores[stageKey]) {
    highScores[stageKey] = score;
    if (ghostTrail && ghostTrail.length > 0) {
      delete stageGhosts[stageKey];
      stageGhosts[stageKey] = ghostTrail.filter((_, index) => index % 2 === 0);
      stageGhosts = limitGhosts(stageGhosts);
      ghostChanged = true;
    }
  }
  stageStars[stageKey] = Math.max(stageStars[stageKey] || 0, stars);
  if (Number.isFinite(completionTime) && completionTime >= 0) {
    bestTimes[stageKey] = Math.min(bestTimes[stageKey] ?? Infinity, completionTime);
  }
  if (stgIdx >= unlockedStageIndex && unlockedStageIndex < TOTAL_STAGES * SUBSTAGES_PER_STAGE) {
    unlockedStageIndex = stgIdx + 1;
  }
  progressStore.saveProgress({ unlocked: unlockedStageIndex, scores: highScores,
    stars: stageStars, times: bestTimes, ghosts: ghostChanged ? stageGhosts : null });
  updateTotalScoreDisplay();
  updatePersonalBest();
}

function updatePersonalBest() {
  const summary = $('personalBest');
  const t = I18N[currentLang];
  summary.setAttribute('aria-label', t.personalBests);
  summary.replaceChildren();
  summary.classList.toggle('is-sandbox', currentStageIndex === 'sandbox');
  if (currentStageIndex === 'sandbox') {
    summary.textContent = t.stageRecordsOnly;
    return;
  }
  const { stage, sub } = indexToStageSub(currentStageIndex);
  const key = stageSubToKey(stage, sub);
  const time = bestTimes[key];
  for (const [label, value] of [[t.bestScore, highScores[key] ?? '—'], [t.bestTime, time === undefined ? '—' : time.toFixed(2) + 's'], [t.bestStars, `${stageStars[key] || 0}/3`]]) {
    const item = document.createElement('span');
    const name = document.createElement('small'); name.textContent = label;
    const number = document.createElement('strong'); number.textContent = value;
    item.append(name, number); summary.append(item);
  }
}

function updateTotalScoreDisplay() {
  let sum = 0;
  for (let s in highScores) sum += highScores[s];
  $('totalScore').textContent = sum;
}

function showStageBriefing(stageNum, subNum, displayStageNum = stageNum) {
  const cfg = STAGE_CONFIGS[stageNum];
  if (!cfg) return;

  const isJa = (currentLang === 'ja');
  const localized = (isJa && cfg.ja) ? cfg.ja : cfg;

  $('starRulesBriefing').hidden = false;
  $('briefingTag').textContent = `STAGE ${displayStageNum}-${subNum} • ${(localized.element || cfg.element).toUpperCase()}`;
  $('briefingTitle').textContent = localized.name;
  $('briefingDesc').textContent = localized.desc;
  $('briefingTip').innerHTML = localized.tip;
  $('mechanicHints').replaceChildren(...getMechanicHints({ wind: currentWind, portals: currentPortals, lasers: currentLasers, rings: currentBoostRings, rail: currentRail, gravity: baseGravity, inversion: gravityInversionInterval, pulses: pulsesLeft }, isJa).map(text => {
    const item = document.createElement('li'); item.textContent = text; return item;
  }));
  $('stageBriefing').classList.remove('hidden');
}

function loadStage(stgIdx) {
  attemptReplay.finish();
  $('stageBriefing').classList.add('hidden');
  stopGameLoop();
  clearGameTimers();
  resetPauseControls();
  launchParameters = null;
  gameStatus = 'setup';
  currentStageIndex = stgIdx;
  currentStageScore = 0;
  timeElapsed = 0;
  clearingTimer = 0;
  particles = []; shockwaves = []; floaters = []; fireworks = [];
  screenShake = 0; hitStopTimer = 0; timeScale = 1.0; sandboxRespawning = false; currentRunHistory = [];
  clearFlashTimer = 0; comboCount = 0; comboTimer = 0;

  const t = I18N[currentLang];
  const isSandbox = (stgIdx === 'sandbox');
  $('btnSandbox').classList.toggle('active', isSandbox);
  $('btnSandbox').textContent = isSandbox ? t.stageMode : t.freePlay;
  $('btnReroll').style.display = isSandbox ? "inline-block" : "none";

  const data = generateStageData(stgIdx, BASE_PIVOT);
  timeLimit = data.timeLimit;
  targets = data.targets.map(t => ({ ...t, hp: t.hp || 1, maxHp: t.maxHp || (t.hp || 1) }));
  obstacles = data.obstacles.map(o => ({ ...o, restitution: o.restitution !== undefined ? o.restitution : -0.8 }));
  blackhole = data.blackhole;
  currentRail = data.rail;
  currentWind = data.wind || null;
  baseGravity = data.gravity ?? 9.8;
  currentGravity = baseGravity;
  gravityInversionInterval = data.gravityInversionInterval || 0;
  gravityInversionTimer = gravityInversionInterval;

  currentPortals = data.portals || [];
  currentSwitches = data.switches || [];
  currentBoostRings = data.boostRings || [];
  currentZones = data.zones || [];
  currentLasers = data.lasers || [];

  const stageInfo = indexToStageSub(stgIdx);
  const stage = stageInfo.stage;
  const sub = stageInfo.sub;
  const label = stageInfo.label;

  if (STAGE_CONFIGS[stage]?.shieldLives) {
    maxLives = sub <= 2 ? 2 : 3;
    currentLives = maxLives;
  } else {
    maxLives = 1;
    currentLives = 1;
  }
  laserCooldown = 0;

  if (isSandbox) {
    $('stageDisplay').innerHTML = `${t.freePlay} ▼`;
    pulsesLeft = Infinity;
  } else {
    const cfg = STAGE_CONFIGS[stage] || { name: 'STAGE' };
    const stageName = (currentLang === 'ja' && cfg.ja) ? cfg.ja.name : cfg.name;
    $('stageDisplay').innerHTML = `${label} <span style=\"font-size:0.72rem;color:var(--muted)\">[${stageName}] ▼</span>`;
    
    if (cfg.lockedParams && cfg.lockedParams.pulses !== undefined) {
      pulsesLeft = cfg.lockedParams.pulses;
    } else {
      pulsesLeft = 3;
    }

    const briefingKey = `stage_${stage}`;
    if (sub === 1 && !briefedStages[briefingKey]) {
      briefedStages[briefingKey] = true;
      progressStore.saveSetting('briefed', briefedStages);
      showStageBriefing(stage, sub, stageInfo.displayStage);
    }
  }
    
  const el = $('hudPulse');
  if (pulsesLeft === Infinity) {
    el.textContent = `${t.pulses}∞`;
  } else if (pulsesLeft === 0) {
    el.textContent = t.pulsesLocked;
  } else {
    el.textContent = `${t.pulses}${pulsesLeft}`;
  }
  el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 150);

  const currentStageKey = isSandbox ? 'sandbox' : stageSubToKey(stage, sub);
  activeGhost = (!isSandbox && stageGhosts[currentStageKey]) ? stageGhosts[currentStageKey] : null;

  const slN = $('sliderN'); 
  const lockedN = (data.lockedN !== undefined) ? data.lockedN : (STAGE_CONFIGS[stage]?.lockedN ?? null);
  if (lockedN !== null) {
    slN.min = lockedN;
    slN.max = lockedN;
    slN.value = lockedN;
    slN.disabled = true;
    $('f-N').className = 'field locked';
    $('valN').textContent = `${lockedN} ${t.lockedTag}`;
  } else {
    slN.min = 2;
    slN.max = data.maxN || 4;
    slN.disabled = false;
    const prevN = parseInt(slN.value, 10) || 2;
    slN.value = Math.max(slN.min, Math.min(slN.max, prevN));
    $('f-N').className = 'field';
    $('valN').textContent = slN.value;
  }

  const slC = $('sliderCount'); 
  const lockedC = (data.lockedClone !== undefined) ? data.lockedClone : (STAGE_CONFIGS[stage]?.lockedClone ?? null);
  if (lockedC !== null) {
    slC.min = lockedC;
    slC.max = lockedC;
    slC.value = lockedC;
    slC.disabled = true;
    $('f-Count').className = 'field locked';
    $('valCount').textContent = `${lockedC} ${t.lockedTag}`
  } else {
    slC.min = 1;
    slC.max = data.maxClone || 2;
    slC.disabled = false;
    const prevC = parseInt(slC.value, 10) || 1;
    slC.value = Math.max(slC.min, Math.min(slC.max, prevC));
    $('f-Count').className = 'field';
    $('valCount').textContent = slC.value;
  }

  $('f-N').hidden = !isSandbox;
  $('f-Count').hidden = !isSandbox;

  const isVelLocked = Boolean(STAGE_CONFIGS[stage]?.lockVelocity);
  const isAngleLocked = Boolean(STAGE_CONFIGS[stage]?.lockAngle);

  const slV = $('sliderVel');
  const slA = $('sliderAngle');

  if (isVelLocked) {
    slV.value = 0; slV.disabled = true;
    $('f-Vel').classList.add('locked');
    $('valVel').textContent = `0.0 ${t.lockedTag}`;
  } else {
    slV.disabled = false;
    $('f-Vel').classList.remove('locked');
    $('valVel').textContent = parseFloat(slV.value).toFixed(1);
  }

  if (isAngleLocked) {
    slA.value = 90; slA.disabled = true;
    $('f-Angle').classList.add('locked');
    $('valAngle').textContent = `90° ${t.lockedTag}`;
  } else {
    slA.disabled = false;
    $('f-Angle').classList.remove('locked');
    $('valAngle').textContent = slA.value + '°';
  }

  $('timerDisplay').textContent = (isSandbox || timeLimit > 90) ? '∞' : `${timeLimit}s`;
  $('timerDisplay').className = 'timer';

  $('btnFire').textContent = t.btnFire;
  $('btnFire').style.display = 'block'; 
  $('btnStop').style.display = 'none'; 
  $('btnRetry').style.display = 'none';
  $('overlay').classList.remove('active');
  document.querySelector('.panel').classList.remove('simulating');

  initVisualsOnly();
  updatePersonalBest();
}

function computePredictionTrail() {
  if (systems.length === 0) return [];
  
  const baseChain = systems[0];
  const simChain = {
    N: baseChain.N,
    L: [...baseChain.L],
    m: [...baseChain.m],
    state: [...baseChain.state]
  };

  const pts = [];
  const simDt = 0.02;
  const simSteps = 50;
  const scale = PENDULUM_SCALE;

  let currentSimDamping = 0.04;
  const windAx = currentWind ? (currentWind.currentFx || currentWind.fx || 0) : 0;

  for (let s = 0; s < simSteps; s++) {
    let pivX = BASE_PIVOT.x;
    let pivY = BASE_PIVOT.y;
    let ax_m = 0, ay_m = 0;

    if (currentRail) {
      const rx = currentRail.ampX || currentRail.amp || 0;
      const ry = currentRail.ampY || 0;
      const spdX = currentRail.speedX || currentRail.speed || 1.0;
      const spdY = currentRail.speedY || 1.0;
      const tSim = s * simDt;

      if (rx > 0) {
        pivX = BASE_PIVOT.x + rx * Math.sin(tSim * spdX);
        ax_m = (-rx * spdX * spdX * Math.sin(tSim * spdX)) / PENDULUM_SCALE;
      }
      if (ry > 0) {
        pivY = BASE_PIVOT.y + ry * Math.sin(tSim * spdY);
        ay_m = (-ry * spdY * spdY * Math.sin(tSim * spdY)) / PENDULUM_SCALE;
      }
    }

    rk4(simChain, simDt, ax_m, ay_m, windAx, currentGravity, currentSimDamping);
    
    let px = pivX, py = pivY;
    for (let k = 0; k < simChain.N; k++) {
      px += scale * simChain.L[k] * Math.sin(simChain.state[k]);
      py += scale * simChain.L[k] * Math.cos(simChain.state[k]);
    }
    pts.push({ x: px, y: py });
  }
  return pts;
}

function initVisualsOnly() {
  const N = parseInt($('sliderN').value, 10);
  const count = parseInt($('sliderCount').value, 10);
  const angle = parseFloat($('sliderAngle').value) * Math.PI / 180;
  const vel = parseFloat($('sliderVel').value) || 0;

  PIVOT.x = BASE_PIVOT.x;
  PIVOT.y = BASE_PIVOT.y;

  obstacles.forEach(ob => { ob.x = ob.baseX + (ob.ampX > 0 ? Math.sin(ob.phase) * ob.ampX : 0); });

  systems = [];
  for (let c = 0; c < count; c++) {
    const a = angle + c * 0.001;
    const st = new Array(N * 2).fill(0);
    for (let i = 0; i < N; i++) st[i] = a;
    for (let i = 0; i < N; i++) st[N + i] = vel;
    
    let colorObj = {};
    if(c===0) colorObj = {outer:'#34d399', inner:'#10b981'}; 
    else if(c===1) colorObj = {outer:'#60a5fa', inner:'#3b82f6'};
    else if(c===2) colorObj = {outer:'#fbbf24', inner:'#f59e0b'}; 
    else if(c===3) colorObj = {outer:'#f87171', inner:'#ef4444'};
    else colorObj = {outer:'#c084fc', inner:'#a855f7'};
    
    systems.push({
      N,
      L: new Array(N).fill(2.5 / N),
      m: new Array(N).fill(1),
      state: st,
      color: colorObj,
      trail: [],
      alive: true,
      currentR: BOB_MIN_R,
      popScale: 1.0,
      railCooldown: 0,
      portalCooldown: 0,
      boostCooldown: 0,
      interCooldown: 3
    });
  }
  draw();
}

function fire() {
  if (gameStatus !== 'setup') return;
  stopGameLoop();
  startingPulses = pulsesLeft;
  const replayStage = indexToStageSub(currentStageIndex);
  const replayConfig = STAGE_CONFIGS[replayStage.stage];
  attemptReplay.begin(currentStageIndex === 'sandbox' ? { en: 'FREE PLAY', ja: 'フリープレイ' } : {
    en: `${replayStage.label} [${replayConfig.name}]`,
    ja: `${replayStage.label} [${replayConfig.ja.name}]`
  });
  $('stageBriefing').classList.add('hidden');
  launchParameters = ['sliderN', 'sliderCount', 'sliderAngle', 'sliderVel'].map(id => $(id).value);
  unlockAudio(); initWindAudio();

  const N = parseInt($('sliderN').value, 10);
  const count = parseInt($('sliderCount').value, 10);
  const angle = parseFloat($('sliderAngle').value) * Math.PI / 180;
  const vel = parseFloat($('sliderVel').value);

  systems = [];
  for (let c = 0; c < count; c++) {
    const a = angle + c * 0.001;
    const st = new Array(N * 2).fill(0);
    for (let i = 0; i < N; i++) st[i] = a;
    for (let i = 0; i < N; i++) st[N + i] = vel;
    
    let colorObj = {};
    if(c===0) colorObj = {outer:'#34d399', inner:'#10b981'}; 
    else if(c===1) colorObj = {outer:'#60a5fa', inner:'#3b82f6'};
    else if(c===2) colorObj = {outer:'#fbbf24', inner:'#f59e0b'}; 
    else if(c===3) colorObj = {outer:'#f87171', inner:'#ef4444'};
    else colorObj = {outer:'#c084fc', inner:'#a855f7'};

    systems.push({
      N,
      L: new Array(N).fill(2.5 / N),
      m: new Array(N).fill(1),
      state: st,
      color: colorObj,
      trail: [],
      alive: true,
      currentR: BOB_MIN_R,
      popScale: 1.0,
      railCooldown: 0,
      portalCooldown: 0,
      boostCooldown: 0,
      interCooldown: 3
    });
  }

  timeElapsed = 0; currentStageScore = 0; clearingTimer = 0; currentRunHistory = []; gameStatus = 'playing'; lastTime = performance.now();
  $('btnFire').style.display = 'none'; 
  $('btnStop').style.display = 'block'; 
  $('btnPause').style.display = 'block';
  $('btnRestart').style.display = 'block';
  $('btnRetry').style.display = 'none';
  $('btnStop').textContent = I18N[currentLang].btnStop;
  document.querySelector('.panel').classList.add('simulating');
  gameAnimId = requestAnimationFrame(loop);
}

function triggerPulse() {
  if (gameStatus !== 'playing' || pulsesLeft <= 0) return;
  if (pulsesLeft !== Infinity) pulsesLeft--;
  const el = $('hudPulse');
  const t = I18N[currentLang];
  el.textContent = (pulsesLeft === Infinity) ? `${t.pulses}∞` : `${t.pulses}${pulsesLeft}`;
  el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 150);

  playSnd('pulse'); screenShake = 4.5;
  systems.forEach(chain => {
    if(!chain.alive) return;
    chain.state[chain.N + chain.N - 1] += (chain.state[chain.N + chain.N - 1] >= 0 ? 2.5 : -2.5);
    let px = PIVOT.x, py = PIVOT.y;
    for (let i = 0; i < chain.N; i++) {
      px += PENDULUM_SCALE * chain.L[i] * Math.sin(chain.state[i]);
      py += PENDULUM_SCALE * chain.L[i] * Math.cos(chain.state[i]);
    }
    shockwaves.push({ x: px, y: py, r: 12, maxR: 95, life: 1, color: '#34d399' });
  });
}

function explodeBomb(bx, by) {
  playSnd('bomb'); screenShake = 14; hitStopTimer = 0.08;
  shockwaves.push({ x: bx, y: by, r: 14, maxR: 145, life: 1, color: '#fb923c' });
  for (let p = 0; p < 36; p++) {
    const pa = Math.random() * Math.PI * 2, ps = Math.random() * 260 + 90;
    particles.push({ x: bx, y: by, vx: Math.cos(pa)*ps, vy: Math.sin(pa)*ps, life: 1.1, decay: 1.6, color: '#fb923c' });
  }
  targets.forEach(t => {
    if (t.alive && !t.isBomb && Math.hypot(t.x - bx, t.y - by) < 145) {
      t.alive = false; currentStageScore += 100;
      floaters.push({ x: t.x, y: t.y, text: "+100", life: 1 });
      for (let p = 0; p < 14; p++) {
        const pa = Math.random() * Math.PI * 2;
        const ps = Math.random() * 220 + 80;
        particles.push({
          x: t.x,
          y: t.y,
          vx: Math.cos(pa) * ps,
          vy: Math.sin(pa) * ps,
          isShard: true,
          shape: p % 2 === 0 ? 'tri' : 'diamond',
          size: 3.0 + Math.random() * 3.0,
          rot: Math.random() * Math.PI * 2,
          rotSpd: (Math.random() - 0.5) * 18,
          life: 0.9,
          decay: 2.0,
          color: (p % 2 === 0) ? '#fed7aa' : '#fb923c'
        });
      }
    }
  });
}

function triggerShrink(chain, contactX, contactY) {
  const prevR = chain.currentR || BOB_MIN_R;
  const isEnlarged = prevR > BOB_MIN_R;

  if (isEnlarged) {
    chain.currentR = Math.max(BOB_MIN_R, prevR - BOB_SHRINK_ON_HAZARD);
    chain.popScale = 0.75; // Squash contraction on impact
    floaters.push({ x: contactX, y: contactY - 18, text: "-CRACK!", life: 0.85 });
    screenShake = 7.0;
  }

  // Play clink audio cue
  try {
    playSnd('clink');
  } catch (e) {}

  // Spawn visible chipped splinter shards scattering outward directly from contact point
  const pColor = (chain.color && chain.color.outer) ? chain.color.outer : '#34d399';
  const shardCount = isEnlarged ? 12 : 7;
  for (let p = 0; p < shardCount; p++) {
    const pa = Math.random() * Math.PI * 2;
    const ps = Math.random() * 160 + 60;
    particles.push({
      x: contactX,
      y: contactY,
      vx: Math.cos(pa) * ps,
      vy: Math.sin(pa) * ps,
      isShard: true,
      shape: p % 2 === 0 ? 'tri' : 'diamond',
      size: 4.5 + Math.random() * 3.5,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 25,
      life: 0.85,
      decay: 1.5,
      color: (p % 3 === 0) ? '#ffffff' : ((p % 2 === 0) ? '#f87171' : pColor)
    });
  }
}

function launchFirework() {
  launchFireworkEffect({ W, H, fireworks });
}


function resolveInterBobCollisions(sdt) {
  screenShake = resolveInterBobCollisionsEngine(sdt, { systems, PIVOT, PENDULUM_SCALE, BOB_MIN_R, playSnd, shockwaves, particles, screenShake });
}

function update(rawDt) {
  if (gameStatus === 'end' || gameStatus === 'paused') return;
  if (hitStopTimer > 0) { hitStopTimer -= rawDt; return; }
  if (screenShake > 0) screenShake *= 0.88;

  const t = I18N[currentLang];

  if (comboTimer > 0) {
    comboTimer -= rawDt;
    if (comboTimer <= 0) comboCount = 0;
  }

  const dt = rawDt * timeScale;
  const sub = 4, sdt = dt / sub; const scale = PENDULUM_SCALE;
  let maxSpeed = 0;

  if (gravityInversionInterval > 0 && gameStatus === 'playing') {
    gravityInversionTimer -= dt;
    if (gravityInversionTimer <= 0) {
      gravityInversionTimer = gravityInversionInterval;
      currentGravity = -currentGravity;
      playSnd('pulse');
      screenShake = 5;
      floaters.push({ x: PIVOT.x, y: PIVOT.y - 30, text: currentGravity < 0 ? t.gravityInvert : t.gravityNormalize, life: 1.2 });
    }
  }

  currentSwitches.forEach(sw => {
    if (sw.active && sw.timer > 0) {
      sw.timer -= dt;
      if (sw.timer <= 0) sw.active = false;
    }
  });

  for (let step = 0; step < sub; step++) {
    let windAx = 0;
    if (currentWind) {
      if (currentWind.amp > 0) {
        currentWind.currentFx = currentWind.fx + currentWind.amp * Math.sin(timeElapsed * currentWind.speed + currentWind.phase);
      } else {
        currentWind.currentFx = currentWind.fx;
      }
      windAx = currentWind.currentFx;
    }

    let ax_m = 0, ay_m = 0;
    if (currentRail) {
      const rx = currentRail.ampX || currentRail.amp || 0;
      const ry = currentRail.ampY || 0;
      const spdX = currentRail.speedX || currentRail.speed || 1.0;
      const spdY = currentRail.speedY || 1.0;
      const phX = currentRail.phaseX || currentRail.phase || 0;
      const phY = currentRail.phaseY || 0;

      if (rx > 0) {
        PIVOT.x = BASE_PIVOT.x + rx * Math.sin(timeElapsed * spdX + phX);
        const ax_px = -rx * (spdX * spdX) * Math.sin(timeElapsed * spdX + phX);
        ax_m = ax_px / PENDULUM_SCALE;
      } else {
        PIVOT.x = BASE_PIVOT.x;
      }

      if (ry > 0) {
        PIVOT.y = BASE_PIVOT.y + ry * Math.sin(timeElapsed * spdY + phY);
        const ay_px = -ry * (spdY * spdY) * Math.sin(timeElapsed * spdY + phY);
        ay_m = ay_px / PENDULUM_SCALE;
      } else {
        PIVOT.y = BASE_PIVOT.y;
      }
    } else {
      PIVOT.x = BASE_PIVOT.x;
      PIVOT.y = BASE_PIVOT.y;
    }

    if (currentRail && currentRail.pulse > 0) {
      currentRail.pulse = Math.max(0, currentRail.pulse - sdt * 5);
    }
    obstacles.forEach(o => {
      if (o.pulse > 0) o.pulse = Math.max(0, o.pulse - sdt * 5);
      if (o.ampX > 0) o.x = o.baseX + Math.sin(timeElapsed * o.speed + o.phase) * o.ampX;
    });

    for (let cIdx = 0; cIdx < systems.length; cIdx++) {
      const chain = systems[cIdx];
      if (!chain.alive) continue;

      // Smoothly ease popScale back to 1.0 (both expansion & squash)
      if (chain.popScale !== 1.0) {
        if (chain.popScale > 1.0) {
          chain.popScale = Math.max(1.0, chain.popScale - rawDt * BOB_PULSE_DECAY);
        } else {
          chain.popScale = Math.min(1.0, chain.popScale + rawDt * BOB_PULSE_DECAY * 1.5);
        }
      }
      
      let currentDamping = 0.04;
      let pxEnd = PIVOT.x, pyEnd = PIVOT.y;
      for (let k = 0; k < chain.N; k++) {
        pxEnd += scale * chain.L[k] * Math.sin(chain.state[k]);
        pyEnd += scale * chain.L[k] * Math.cos(chain.state[k]);
      }
      for (let z of currentZones) {
        if (pxEnd >= z.x && pxEnd <= z.x + z.w && pyEnd >= z.y && pyEnd <= z.y + z.h) {
          currentDamping = z.damping || 0.35;
          const dragMultiplier = Math.exp(-(z.damping || 2.0) * sdt * 4.0);
          for (let k = 0; k < chain.N; k++) {
            chain.state[chain.N + k] *= dragMultiplier;
          }
      
          if (Math.random() < 0.2) {
            particles.push({
              x: pxEnd + (Math.random() - 0.5) * 10, y: pyEnd + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 20, vy: -15, life: 0.3, decay: 3,
              color: z.isResin ? '#fbbf24' : '#38bdf8'
            });
          }
          break;
        }
      }

      rk4(chain, sdt, ax_m, ay_m, windAx, currentGravity, currentDamping);

      if (step === sub - 1) {
        let px = PIVOT.x, py = PIVOT.y; let vx = 0, vy = 0;
        for (let i = 0; i < chain.N; i++) {
          const th = chain.state[i], w = chain.state[chain.N + i];
          px += scale * chain.L[i] * Math.sin(th); py += scale * chain.L[i] * Math.cos(th);
          vx += chain.L[i] * Math.cos(th) * w; vy += -chain.L[i] * Math.sin(th) * w;
        }
        const spd = Math.hypot(vx, vy); if (spd > maxSpeed) maxSpeed = spd;
        chain.trail.push({ x: px, y: py, speed: spd });
        if (chain.trail.length > (timeScale < 1 ? 380 : 180)) chain.trail.shift();
        if (cIdx === 0 && gameStatus === 'playing') currentRunHistory.push({ x: px, y: py });

        const effectiveTipR = chain.currentR || BOB_MIN_R;

        // Portals
        if (chain.portalCooldown > 0) chain.portalCooldown -= sdt;
        else {
          for (let port of currentPortals) {
            if (!port.targetId) continue;
            const effectiveHitR = (port.r || 24) * 1.55 * 0.85 + effectiveTipR;
            if (Math.hypot(px - port.x, py - port.y) < effectiveHitR) {
              chain.portalCooldown = 0.65;
              const dest = currentPortals.find(p => p.id === port.targetId) || port;

              playSnd('portal');
              screenShake = 11;

              shockwaves.push({ x: port.x, y: port.y, r: 20, maxR: 135, life: 1.3, color: port.color || '#38bdf8' });
              shockwaves.push({ x: dest.x, y: dest.y, r: 20, maxR: 150, life: 1.3, color: dest.color || '#c084fc' });
              floaters.push({ x: dest.x, y: dest.y - 20, text: t.warpedFloater, life: 1.3 });

              for (let step = 0; step <= 25; step++) {
                const ratio = step / 25;
                const lx = port.x + (dest.x - port.x) * ratio + (Math.random() - 0.5) * 22;
                const ly = port.y + (dest.y - port.y) * ratio + (Math.random() - 0.5) * 22;
                particles.push({
                  x: lx, y: ly, vx: (Math.random() - 0.5) * 45, vy: (Math.random() - 0.5) * 45,
                  life: 0.6, decay: 2.0, color: ratio > 0.5 ? '#c084fc' : '#38bdf8'
                });
              }

              for (let p = 0; p < 28; p++) {
                const pa = Math.random() * Math.PI * 2, ps = Math.random() * 190 + 60;
                particles.push({ x: port.x, y: port.y, vx: Math.cos(pa)*ps, vy: Math.sin(pa)*ps, life: 0.9, decay: 1.9, color: port.color || '#38bdf8' });
                particles.push({ x: dest.x, y: dest.y, vx: Math.cos(pa)*ps, vy: Math.sin(pa)*ps, life: 1.0, decay: 1.7, color: dest.color || '#c084fc' });
              }

              const dx = dest.x - PIVOT.x, dy = dest.y - PIVOT.y;
              let targetDist = Math.hypot(dx, dy);
              const targetAngle = Math.atan2(dx, dy);

              let totalReach = 0;
              for (let k = 0; k < chain.N; k++) totalReach += scale * chain.L[k];
              targetDist = Math.min(targetDist, totalReach * 0.985);

              if (chain.N === 2) {
                const L1 = scale * chain.L[0], L2 = scale * chain.L[1];
                let cos_beta = (L1*L1 + targetDist*targetDist - L2*L2) / (2 * L1 * targetDist);
                cos_beta = Math.max(-1.0, Math.min(1.0, cos_beta));
                const beta = Math.acos(cos_beta);

                let cos_gamma = (L1*L1 + L2*L2 - targetDist*targetDist) / (2 * L1 * L2);
                cos_gamma = Math.max(-1.0, Math.min(1.0, cos_gamma));
                const gamma = Math.acos(cos_gamma);

                const bendSide = (dest.x >= PIVOT.x) ? -1 : 1;
                chain.state[0] = targetAngle + bendSide * beta;
                chain.state[1] = chain.state[0] - bendSide * (Math.PI - gamma);
              } else {
                for (let k = 0; k < chain.N; k++) {
                  chain.state[k] = targetAngle + (k - (chain.N - 1) / 2) * 0.16;
                }
              }

              const curSpd = Math.abs(chain.state[chain.N + chain.N - 1]);
              const exitSpeed = Math.max(0.5, curSpd * 0.4);
              const outSign = (dest.x >= BASE_PIVOT.x) ? 1 : -1;
              for (let k = 0; k < chain.N; k++) {
                chain.state[chain.N + k] = outSign * (exitSpeed * (0.65 + 0.35 * (k / (chain.N - 1 || 1))));
              }

              chain.trail = [{ x: dest.x, y: dest.y, speed: exitSpeed }];
              break;
            }
          }
        }

        // Boost Rings
        if (chain.boostCooldown > 0) chain.boostCooldown -= sdt;
        else {
          for (let ring of currentBoostRings) {
            if (Math.hypot(px - ring.x, py - ring.y) < (effectiveTipR + ring.r)) {
              chain.boostCooldown = 0.4;
              playSnd('boost');
              screenShake = 5;
              const dir = Math.sign(chain.state[chain.N + chain.N - 1]) || 1;
              chain.state[chain.N + chain.N - 1] += dir * (ring.boostSpd || 3.2);
              shockwaves.push({ x: ring.x, y: ring.y, r: 10, maxR: 80, life: 1, color: '#34d399' });
              break;
            }
          }
        }
        
        // Switches
        for (let sw of currentSwitches) {
          if (!sw.active && Math.hypot(px - sw.x, py - sw.y) < (effectiveTipR + sw.r)) {
            sw.active = true;
            sw.timer = sw.duration || 4.5;
            playSnd('gate');
            screenShake = 5;
            shockwaves.push({ x: sw.x, y: sw.y, r: sw.r, maxR: 90, life: 1, color: '#10b981' });
            floaters.push({ x: sw.x, y: sw.y, text: t.gateOpen, life: 1 });
          }
        }

        // Lasers
        if (laserCooldown > 0) laserCooldown -= sdt;
        else {
          for (let lz of currentLasers) {
            if (lz.disabled) continue;
            const ldx = lz.x2 - lz.x1, ldy = lz.y2 - lz.y1;
            const lLen2 = ldx * ldx + ldy * ldy;
            const tProj = Math.max(0, Math.min(1, ((px - lz.x1) * ldx + (py - lz.y1) * ldy) / (lLen2 || 1)));
            const closestX = lz.x1 + tProj * ldx;
            const closestY = lz.y1 + tProj * ldy;
            if (Math.hypot(px - closestX, py - closestY) < (effectiveTipR + SEGMENT_HIT_RADIUS)) {
              laserCooldown = 0.55;
              currentLives--;

              triggerShrink(chain, closestX, closestY);

              playSnd('laser');
              screenShake = 13;

              shockwaves.push({ x: closestX, y: closestY, r: 12, maxR: 115, life: 1, color: '#f43f5e' });
              for (let p = 0; p < 18; p++) {
                const pa = Math.random() * Math.PI * 2, ps = Math.random() * 120 + 40;
                particles.push({
                  x: closestX, y: closestY,
                  vx: Math.cos(pa) * ps, vy: Math.sin(pa) * ps,
                  life: 0.65, decay: 2.4, color: '#f43f5e'
                });
              }

              for (let k = 0; k < chain.N; k++) {
                chain.state[chain.N + k] *= -0.85;
              }

              if (currentLives > 0) {
                floaters.push({ x: closestX, y: closestY - 20, text: t.shieldHit(currentLives, maxLives), life: 1.2 });
              } else {
                chain.alive = false;
                if (systems.every(ch => !ch.alive) && gameStatus === 'playing') {
                  gameStatus = 'end';
                  timeScale = 1.0;
                  playSnd('fail');
                  showOverlay(t.laserTrip, t.laserTripDesc, t.btnRetry, false, 0);
                }
              }
              break;
            }
          }
        }

        // Barrier Gates
        for (let sw of currentSwitches) {
          if (sw.gate && !sw.active) {
            const g = sw.gate;
            const gdx = g.x2 - g.x1, gdy = g.y2 - g.y1;
            const gLen2 = gdx * gdx + gdy * gdy;
            const tProj = Math.max(0, Math.min(1, ((px - g.x1) * gdx + (py - g.y1) * gdy) / (gLen2 || 1)));
            const cx = g.x1 + tProj * gdx;
            const cy = g.y1 + tProj * gdy;
            if (Math.hypot(px - cx, py - cy) < (effectiveTipR + SEGMENT_HIT_RADIUS)) {
              chain.state[chain.N + chain.N - 1] *= -0.8;
              triggerShrink(chain, cx, cy);
              playSnd('brake');
              screenShake = 4.5;
            }
          }
        }

        // Rail Impact
        if (currentRail) {
          const rx = currentRail.ampX || currentRail.amp || 0;
          const ry = currentRail.ampY || 0;
          let hitRail = false, hitX = px, hitY = py;
          let prevJointX = PIVOT.x, prevJointY = PIVOT.y;

          if (rx > 0) {
            const railMinX = BASE_PIVOT.x - rx - 30;
            const railMaxX = BASE_PIVOT.x + rx + 30;
            const railY = PIVOT.y;

            for (let k = 0; k < chain.N; k++) {
              const jx = prevJointX + PENDULUM_SCALE * chain.L[k] * Math.sin(chain.state[k]);
              const jy = prevJointY + PENDULUM_SCALE * chain.L[k] * Math.cos(chain.state[k]);
              const cjx = Math.max(railMinX, Math.min(railMaxX, jx));
              const hitThreshold = k === chain.N - 1 ? (effectiveTipR + RAIL_HIT_RADIUS) : RAIL_HIT_RADIUS + JOINT_RADIUS;
              if (Math.hypot(jx - cjx, jy - railY) < hitThreshold) {
                hitRail = true; hitX = cjx; hitY = railY; break;
              }
              prevJointX = jx; prevJointY = jy;
            }
          }

          if (!hitRail && ry > 0) {
            const railMinY = BASE_PIVOT.y - ry - 30;
            const railMaxY = BASE_PIVOT.y + ry + 30;
            const railX = PIVOT.x;
            prevJointX = PIVOT.x; prevJointY = PIVOT.y;

            for (let k = 0; k < chain.N; k++) {
              const jx = prevJointX + PENDULUM_SCALE * chain.L[k] * Math.sin(chain.state[k]);
              const jy = prevJointY + PENDULUM_SCALE * chain.L[k] * Math.cos(chain.state[k]);
              const cjy = Math.max(railMinY, Math.min(railMaxY, jy));
              const hitThreshold = k === chain.N - 1 ? (effectiveTipR + RAIL_HIT_RADIUS) : RAIL_HIT_RADIUS + JOINT_RADIUS;
              if (Math.hypot(jx - railX, jy - cjy) < hitThreshold && Math.hypot(jx - PIVOT.x, jy - PIVOT.y) > 28) {
                hitRail = true; hitX = railX; hitY = cjy; break;
              }
              prevJointX = jx; prevJointY = jy;
            }
          }

          if (hitRail && (chain.railCooldown || 0) <= 0) {
            for (let k = 0; k < chain.N; k++) chain.state[chain.N + k] *= -0.8;
            chain.railCooldown = 0.08;
            currentRail.pulse = 1.0;
            triggerShrink(chain, hitX, hitY);
            playSnd('brake');
            screenShake = 6.0;

            for (let p = 0; p < 14; p++) {
              const pa = Math.random() * Math.PI * 2, ps = Math.random() * 95 + 35;
              particles.push({
                x: hitX, y: hitY,
                vx: Math.cos(pa) * ps, vy: Math.sin(pa) * ps,
                life: 0.65, decay: 2.8, color: '#38bdf8'
              });
            }
          }
        }
        if (chain.railCooldown > 0) chain.railCooldown -= sdt;

        // Gravitational Wells
        if (blackhole && (gameStatus === 'playing' || gameStatus === 'clearing')) {
          const bhList = Array.isArray(blackhole) ? blackhole : [blackhole];
          for (let b of bhList) {
            let prevJx = PIVOT.x, prevJy = PIVOT.y;
            for (let k = 0; k < chain.N; k++) {
              const jx = prevJx + PENDULUM_SCALE * chain.L[k] * Math.sin(chain.state[k]);
              const jy = prevJy + PENDULUM_SCALE * chain.L[k] * Math.cos(chain.state[k]);
              prevJx = jx; prevJy = jy;

              const dx = jx - b.x; const dy = jy - b.y;
              const bDist = Math.hypot(dx, dy);

              if (bDist < b.pullRadius && bDist > 1) {
                const uX = dx / bDist; const uY = dy / bDist;
                if (b.isRepulsor) {
                  const distRatio = Math.max(0.08, (bDist - b.coreRadius) / (b.pullRadius - b.coreRadius));
                  const repelAccel = (Math.abs(b.pullStrength) * 1.8) / (distRatio * distRatio);
                  const thK = chain.state[k];
                  const tangX = Math.cos(thK); const tangY = -Math.sin(thK);
                  const torque = (uX * tangX + uY * tangY) * repelAccel * sdt * 0.07;
                  chain.state[chain.N + k] += torque;

                  if (bDist < (b.coreRadius + effectiveTipR)) {
                    chain.state[chain.N + k] *= -0.85;
                    screenShake = 6.0; playSnd('brake');
                    shockwaves.push({ x: b.x, y: b.y, r: b.coreRadius, maxR: b.pullRadius * 0.9, life: 0.8, color: '#38bdf8' });
                  }
                } else {
                  const pullFactor = (1 - bDist / b.pullRadius) * b.pullStrength * sdt;
                  const thK = chain.state[k];
                  const torque = (-uX * Math.cos(thK) + uY * Math.sin(thK)) * pullFactor * 0.15;
                  chain.state[chain.N + k] += torque;

                  const stageWon = (gameStatus === 'clearing') || targets.every(t => !t.alive);
                  if (!stageWon && k === chain.N - 1 && bDist < (b.coreRadius + effectiveTipR)) {
                    chain.alive = false; playSnd('bomb'); screenShake = 18;
                    shockwaves.push({ x: b.x, y: b.y, r: 12, maxR: 170, life: 1, color: '#a855f7' });
                    if (systems.every(ch => !ch.alive) && gameStatus !== 'blackhole_death') {
                      gameStatus = 'blackhole_death'; clearingTimer = 0; updateWindSpeed(0, false);
                    }
                  }
                }
              }
            }
          }
        }

        // Targets
        if (gameStatus === 'playing' || gameStatus === 'clearing') {
          for (let t of targets) {
            if (t.alive && Math.hypot(px - t.x, py - t.y) < (effectiveTipR + t.r)) {
              if (t.hp && t.hp > 1 && !t.isBomb) {
                t.hp--;
                playSnd('shield_hit');
                screenShake = 5;
                shockwaves.push({ x: t.x, y: t.y, r: t.r, maxR: t.r + 35, life: 0.8, color: '#38bdf8' });
                floaters.push({ x: t.x, y: t.y, text: I18N[currentLang].shieldCrack, life: 0.8 });
                chain.state[chain.N + chain.N - 1] *= -0.6;
              } else {
                t.alive = false;

                // GROW & TRIGGER POP ANIMATION
                chain.currentR = Math.min(BOB_MAX_R, (chain.currentR || BOB_MIN_R) + BOB_GROWTH_PER_HIT);
                chain.popScale = BOB_POP_FACTOR;

                if (t.isBomb) explodeBomb(t.x, t.y);
                else {
                  comboCount++;
                  comboTimer = 1.25;
                  const bonusScore = 100 + (comboCount - 1) * 50;
                  currentStageScore += bonusScore;
        
                  playSnd('hit', comboCount);
                  screenShake = 6 + Math.min(8, comboCount * 1.5);
                  hitStopTimer = 0.04;
        
                  if (comboCount > 1) {
                    floaters.push({ 
                      x: t.x, 
                      y: t.y - 12, 
                      text: `COMBO x${comboCount}! (+${bonusScore})`, 
                      life: 1.1 
                    });
                  } else {
                    floaters.push({ x: t.x, y: t.y, text: `+${bonusScore}`, life: 1.0 });
                  }

                  for (let p = 0; p < 18; p++) {
                    const pa = Math.random() * Math.PI * 2;
                    const ps = Math.random() * 180 + 60;
                    particles.push({
                      x: t.x,
                      y: t.y,
                      vx: Math.cos(pa) * ps,
                      vy: Math.sin(pa) * ps,
                      isShard: true,
                      shape: p % 2 === 0 ? 'tri' : 'diamond',
                      size: 3.5 + Math.random() * 3.5,
                      rot: Math.random() * Math.PI * 2,
                      rotSpd: (Math.random() - 0.5) * 16,
                      life: 1.0,
                      decay: 1.8 + Math.random() * 0.8,
                      color: (p % 3 === 0) ? '#fecaca' : '#f87171'
                    });
                  }
                }

                if (currentStageIndex !== 'sandbox' && targets.every(tgt => !tgt.alive)) {
                  hitStopTimer = 0.16;
                  screenShake = 16;
                  clearFlashTimer = 0.28;
                  shockwaves.push({ x: t.x, y: t.y, r: 25, maxR: 420, life: 1.4, color: '#56d364' });
                  floaters.push({ x: t.x, y: t.y - 25, text: I18N[currentLang].finish, life: 1.5 });
                }
              }
            }
          }
        }

        // Hazards Bounce & Shrink
        for (let ob of obstacles) {
          if (Math.hypot(px - ob.x, py - ob.y) < (effectiveTipR + ob.r)) {
            const rest = (ob.restitution !== undefined) ? ob.restitution : -0.8;
            chain.state[chain.N + chain.N - 1] *= rest;
            ob.pulse = 1.0;

            // Trigger splinter fragments directly at the bob tip (px, py)
            triggerShrink(chain, px, py);

            if (rest < -1.0) playSnd('spring');
            else playSnd('brake');
            screenShake = Math.abs(rest) > 1.0 ? 8.0 : 4.5;
          }
        }
      }
    }

    resolveInterBobCollisions(sdt);

    if (gameStatus === 'playing') timeElapsed += sdt;
  }

  if (blackhole) {
    const bhList = Array.isArray(blackhole) ? blackhole : [blackhole];
    bhList.forEach(b => {
      b.angle = (b.angle || 0) + dt * 3.5;
      if (gameStatus === 'playing') {
        b.instructionTimer = (b.instructionTimer || 2) - rawDt;
        if (b.instructionTimer <= 0) {
          b.instructionAlpha = Math.max(0, (b.instructionAlpha || 0) - rawDt * 1.5);
        }
      }
    });
  }

  updateWindSpeed(maxSpeed, gameStatus === 'playing');

  updateParticlesAndFireworks({
    particles, shockwaves, floaters, fireworks, dt, rawDt, currentGravity, playSnd,
    getScreenShake: () => screenShake, setScreenShake: value => { screenShake = value; }
  });

  if (currentStageIndex === 'sandbox') {
    if (!sandboxRespawning && targets.every(t => !t.alive)) {
      sandboxRespawning = true;
      scheduleGameTimer(() => {
        if (currentStageIndex === 'sandbox') {
          const freshData = generateStageData('sandbox', BASE_PIVOT);
          targets = freshData.targets; obstacles = freshData.obstacles;
          blackhole = freshData.blackhole; currentRail = freshData.rail;
          shockwaves.push({ x: PIVOT.x, y: PIVOT.y + 120, r: 10, maxR: 170, life: 1, color: '#34d399' }); playSnd('pulse');
        }
        sandboxRespawning = false;
      }, 700);
    }
    return;
  }

  const remainExact = Math.max(0, timeLimit - timeElapsed);
  const remainSec = Math.ceil(remainExact);
  const tel = $('timerDisplay');
  tel.textContent = remainSec > 90 ? '∞' : `${remainSec}s`;

  if (gameStatus === 'playing') {
    if (remainSec <= 3 && timeLimit <= 90) tel.classList.add('urgent'); else tel.classList.remove('urgent');

    const left = targets.filter(t => t.alive).length;
    if (left === 0) {
      gameStatus = 'clearing'; updateWindSpeed(0, false); playSnd('clear'); timeScale = 0.2; 
      launchFirework(); scheduleGameTimer(launchFirework, 220); scheduleGameTimer(launchFirework, 450);
    } else if (remainExact <= 0 && timeLimit <= 90) {
      gameStatus = 'end'; updateWindSpeed(0, false); playSnd('fail');
      showOverlay(t.timeUp, t.timeUpDesc, t.btnRetry, false, 0);
    }
  } else if (gameStatus === 'blackhole_death') {
    clearingTimer += rawDt;
    if (clearingTimer >= 1.6) {
      gameStatus = 'end';
      timeScale = 1.0;
      playSnd('fail');
      showOverlay(t.singularity, t.singularityDesc, t.btnRetry, false, 0);
    }
  } else if (gameStatus === 'clearing') {
    clearingTimer += rawDt;
    if (clearingTimer >= 3) {
      gameStatus = 'end'; timeScale = 1.0;
      const timeBonus = timeLimit > 90 ? 0 : Math.round(remainExact * 100);
      const finalScore = currentStageScore + timeBonus;

      const { stars, pulseBonus, speedBonus } = calculateStageStars({ startingPulses, pulsesLeft, timeRemaining: remainExact, timeLimit });

      saveData(currentStageIndex, finalScore, currentRunHistory, stars, timeElapsed);
      const { stage, sub, displayStage } = indexToStageSub(currentStageIndex);
      const isNextNewStage = (sub === SUBSTAGES_PER_STAGE);
      const nextBtnText = isNextNewStage 
        ? (displayStage >= TOTAL_STAGES ? t.allCleared : t.enterStageText(displayStage + 1)) 
        : t.nextBtnText(displayStage, sub + 1);
      showOverlay(t.stageClear, `Score: +${finalScore} (Target: ${currentStageScore} + Time: ${timeBonus})`, nextBtnText, true, stars);
      $('starResult').textContent = `${t.starClear} ✓ · ${t.starPulse} ${pulseBonus ? '✓' : '—'} · ${t.starSpeed} ${speedBonus ? '✓' : '—'}`;
    }
  }
}

function draw() {
  drawGameFrame({
    ctx,
    getState: () => ({ W, H, screenShake, clearFlashTimer, activeGhost, gameStatus, currentLang, currentWind, timeElapsed, currentLasers, maxLives, currentLives, currentGravity, systems, targets, obstacles, blackhole, particles, shockwaves, floaters, PIVOT, currentRail, currentPortals, currentSwitches, currentBoostRings, currentZones, BASE_PIVOT, laserCooldown, PENDULUM_SCALE, BOB_MIN_R, BOB_MAX_R }),
    computePredictionTrail,
    setClearFlashTimer: value => { clearFlashTimer = value; }
  });
}

function armGameTimer(timer) {
  timer.started = performance.now();
  timer.id = setTimeout(() => {
    gameTimers.delete(timer);
    timer.callback();
  }, timer.remaining);
}

function scheduleGameTimer(callback, delay) {
  const timer = { callback, remaining: delay, started: 0, id: null };
  gameTimers.add(timer);
  armGameTimer(timer);
}

function clearGameTimers() {
  for (const timer of gameTimers) clearTimeout(timer.id);
  gameTimers.clear();
}

function resetPauseControls() {
  pausedStatus = null;
  $('pauseIndicator').classList.add('hidden');
  document.body.classList.remove('game-paused');
  $('btnPause').textContent = '⏸ PAUSE';
  $('btnPause').setAttribute('aria-pressed', 'false');
  $('btnPause').style.display = 'none';
  $('btnRestart').style.display = 'none';
}

function pauseGame() {
  if (verificationMode) return; // The separate viewer owns pause/resume in verification runs.
  if (!['playing', 'clearing', 'blackhole_death'].includes(gameStatus)) return;
  pausedStatus = gameStatus;
  gameStatus = 'paused';
  stopGameLoop();
  const now = performance.now();
  for (const timer of gameTimers) {
    clearTimeout(timer.id);
    timer.remaining = Math.max(0, timer.remaining - (now - timer.started));
  }
  suspendAudio();
  $('pauseIndicator').classList.remove('hidden');
  document.body.classList.add('game-paused');
  $('btnPause').textContent = '▶ RESUME';
  $('btnPause').setAttribute('aria-pressed', 'true');
}

function togglePause() {
  if (gameStatus !== 'paused') { pauseGame(); return; }
  if ($('btnMore').getAttribute('aria-expanded') === 'true' || !$('stageBriefing').classList.contains('hidden') || document.querySelector('dialog[open]') || document.hidden || !$('titleScreen').classList.contains('hidden') ||
      !$('tutorialScreen').classList.contains('hidden') || $('mapModal').classList.contains('active')) return;
  gameStatus = pausedStatus;
  pausedStatus = null;
  $('pauseIndicator').classList.add('hidden');
  document.body.classList.remove('game-paused');
  $('btnPause').textContent = '⏸ PAUSE';
  $('btnPause').setAttribute('aria-pressed', 'false');
  unlockAudio();
  for (const timer of gameTimers) armGameTimer(timer);
  lastTime = performance.now();
  gameAnimId = requestAnimationFrame(loop);
}

function restartAttempt() {
  if (!launchParameters || !['playing', 'paused', 'clearing', 'blackhole_death'].includes(gameStatus)) return;
  const parameters = launchParameters;
  loadStage(currentStageIndex);
  ['sliderN', 'sliderCount', 'sliderAngle', 'sliderVel'].forEach((id, i) => { $(id).value = parameters[i]; });
  const lockedLabel = id => $(id).disabled ? ` ${I18N[currentLang].lockedTag}` : '';
  $('valN').textContent = $('sliderN').value + lockedLabel('sliderN');
  $('valCount').textContent = $('sliderCount').value + lockedLabel('sliderCount');
  $('valAngle').textContent = $('sliderAngle').value + '°' + lockedLabel('sliderAngle');
  $('valVel').textContent = parseFloat($('sliderVel').value).toFixed(1) + lockedLabel('sliderVel');
  $('stageBriefing').classList.add('hidden');
  initVisualsOnly();
  fire();
}

function stopGameLoop() {
  if (gameAnimId !== null) cancelAnimationFrame(gameAnimId);
  gameAnimId = null;
}

function loop(t) {
  gameAnimId = null;
  let replayDelta = 0;
  if (gameStatus === 'playing' || gameStatus === 'clearing' || gameStatus === 'blackhole_death') {
    const dt = Math.min(0.03, (t - lastTime) / 1000 || 0);
    lastTime = t;
    replayDelta = dt;
    if (dt > 0) update(dt);
  }
  draw();
  attemptReplay.capture(replayDelta);
  if (gameStatus === 'end') attemptReplay.finish();
  if (gameStatus === 'playing' || gameStatus === 'clearing' || gameStatus === 'blackhole_death') gameAnimId = requestAnimationFrame(loop);
}

function showOverlay(title, desc, btnText, isClear, stars = 0) {
  resetPauseControls();
  const o = $('overlay');
  $('overlayTitle').textContent = title;
  $('overlayTitle').className = isClear ? 'text-clear' : 'text-fail';
  $('overlayDesc').textContent = desc;

  $('starResult').textContent = '';
  const sc = $('starContainer');
  if (isClear) {
    sc.style.display = 'flex';
    const sEls = sc.children;
    for (let i = 0; i < 3; i++) {
      sEls[i].className = 'star';
      if (i < stars) sEls[i].classList.add('earned');
    }
  } else {
    sc.style.display = 'none';
  }

  const btn = $('overlayBtn');
  btn.textContent = btnText || (isClear ? I18N[currentLang].nextStage : I18N[currentLang].btnRetry);

  btn.onclick = (e) => {
    if (e) e.stopPropagation();
    $('overlay').classList.remove('active');
    if (isClear) {
      if (currentStageIndex >= TOTAL_STAGES * SUBSTAGES_PER_STAGE) {
        alert(I18N[currentLang].allClearAlert + $('totalScore').textContent);
        openStageSelectModal();
      } else {
        loadStage(currentStageIndex + 1);
      }
    } else {
      loadStage(currentStageIndex);
    }
  };
  o.classList.add('active');
}


installInputHandlers({
  $, canvas, wrapper,
  getState: () => ({ gameStatus, systems, PIVOT, currentStageIndex }),
  togglePause,
  indexToStageSub, PENDULUM_SCALE, BOB_MIN_R, unlockAudio, triggerPulse, fire, initVisualsOnly
});

function copyShareUrl() {
  const params = new URLSearchParams({
    numbering: '7', stg: currentStageIndex, n: $('sliderN').value, c: $('sliderCount').value,
    a: $('sliderAngle').value, v: $('sliderVel').value
  });
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(url).then(() => {
    const t = $('hudToast'); 
    t.textContent = I18N[currentLang].urlCopied;
    t.classList.add('active'); 
    setTimeout(() => t.classList.remove('active'), 2000);
  });
}

function restoreFromUrl() {
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.has('stg')) {
      const stg = p.get('stg');
      if (stg === 'sandbox') loadStage('sandbox');
      else {
        const requested = /^\d+$/.test(stg) ? Number(stg) : NaN;
        const index = p.get('numbering') === '7' ? requested : migrateLegacyIndex(requested);
        if (!Number.isInteger(index) || index < 1 || index > 250) return;
        loadStage(index);
      }
      
      if (p.has('n') && !$('sliderN').disabled) $('sliderN').value = p.get('n');
      if (p.has('c') && !$('sliderCount').disabled) $('sliderCount').value = p.get('c');
      if (p.has('a') && !$('sliderAngle').disabled) $('sliderAngle').value = p.get('a');
      if (p.has('v') && !$('sliderVel').disabled) $('sliderVel').value = p.get('v');
      $('valN').textContent = $('sliderN').value; $('valCount').textContent = $('sliderCount').value;
      $('valAngle').textContent = $('sliderAngle').value + '°'; $('valVel').textContent = parseFloat($('sliderVel').value).toFixed(1);
      initVisualsOnly();
    }
  } catch(e) {}
}

$('btnShare').addEventListener('click', copyShareUrl);
$('btnSandbox').addEventListener('click', () => loadStage(currentStageIndex === 'sandbox' ? unlockedStageIndex : 'sandbox'));
$('btnReroll').addEventListener('click', () => { if (currentStageIndex === 'sandbox') loadStage('sandbox'); });

function renderStageSelect() {
  const grid = $('stageGrid'); 
  grid.innerHTML = '';
  const isJa = (currentLang === 'ja');

  for (let displayStage = 1; displayStage <= TOTAL_STAGES; displayStage++) {
    const actualStage = STAGE_ORDER[displayStage - 1] || displayStage;
    const cfg = STAGE_CONFIGS[actualStage] || { name: `STAGE ${displayStage}`, element: "Mechanics" };
    const localized = (isJa && cfg.ja) ? cfg.ja : cfg;

    const chapter = chapterForStage(displayStage);
    if (displayStage === chapter.start) {
      const heading = document.createElement('h3');
      heading.className = 'chapter-heading';
      heading.textContent = `${chapter.icon} ${isJa ? 'チャプター' : 'Chapter'} ${chapter.id}: ${isJa ? chapter.ja : chapter.name} · ${chapter.start}–${chapter.end}`;
      grid.appendChild(heading);
    }
    const difficulty = DIFFICULTIES[cfg.difficulty]?.[isJa ? 1 : 0] || '';
    const card = document.createElement('div');
    card.className = 'stage-section-card';
    
    card.innerHTML = `
      <div class="stage-section-header">
        <span class="stage-section-title">STAGE ${displayStage}: ${localized.name}</span>
        <span style=\"font-size:0.75rem; color:var(--muted)\">${cfg.mechanicIcon} ${localized.element || cfg.element} · ${difficulty}</span>
      </div>
      <div class="stage-grid" id="stageGridSection_${displayStage}"></div>
    `;
    grid.appendChild(card);

    const subGrid = card.querySelector(`#stageGridSection_${displayStage}`);
    for (let sub = 1; sub <= SUBSTAGES_PER_STAGE; sub++) {
      const stgIdx = stageSubToIndex(displayStage, sub);
      const isLocked = stgIdx > unlockedStageIndex;
      const isCurrent = (stgIdx === currentStageIndex);

      const stageKey = stageSubToKey(actualStage, sub);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.disabled = isLocked;
      btn.id = `stageButton_${stgIdx}`;
      if (isCurrent) btn.setAttribute('aria-current', 'step');
      btn.className = `stage-btn ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`;
      const best = highScores[stageKey] ? `${highScores[stageKey]}pts` : (isLocked ? '' : I18N[currentLang].clearBest);
      let starsHtml = '';
      if (!isLocked) {
        const st = stageStars[stageKey] || 0;
        if (st > 0) starsHtml = `<span class="mini-stars">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span>`;
      }
      const bestTime = bestTimes[stageKey];
      const timeText = bestTime === undefined ? `${I18N[currentLang].timeLabel}: —` : `${I18N[currentLang].fastestLabel}: ${bestTime.toFixed(2)}${isJa ? '秒' : 's'}`;
      btn.innerHTML = `<span class="num">${isLocked ? '🔒 ' : ''}${displayStage}-${sub}</span><span class="best-score">${best}</span>${isLocked ? '' : `<span class="best-time">${timeText}</span>`}${starsHtml}${isCurrent ? `<span class="current-label">${I18N[currentLang].currentLabel}</span>` : ''}`;
      btn.setAttribute('aria-label', isJa
        ? `${displayStage}-${sub}${isCurrent ? '、現在選択中' : ''}${isLocked ? '、未解放' : `、最高スコア ${highScores[stageKey] ?? '記録なし'}、${timeText}、星 ${stageStars[stageKey] || 0}個`}`
        : `${displayStage}-${sub}${isCurrent ? ', current' : ''}${isLocked ? ', locked' : `, best score ${highScores[stageKey] ?? 'none'}, ${timeText}, ${stageStars[stageKey] || 0} stars`}`);
      if (!isLocked) {
        btn.addEventListener('click', () => { 
          closeStageSelectModal(); 
          loadStage(stgIdx); 
          const stageInfo = indexToStageSub(stgIdx);
          showStageBriefing(stageInfo.stage, stageInfo.sub, stageInfo.displayStage);
        });
      }
      subGrid.appendChild(btn);
    }
  }
}

function openStageSelectModal() { renderStageSelect(); $('mapModal').classList.add('active'); }
function jumpToStage(idx) {
  const button = $(`stageButton_${idx}`);
  if (button) {
    button.scrollIntoView({ block: 'center', behavior: 'instant' });
    if (!button.disabled) button.focus({ preventScroll: true });
  }
}
$('btnJumpCurrent').addEventListener('click', () => jumpToStage(currentStageIndex === 'sandbox' ? unlockedStageIndex : currentStageIndex));
$('btnJumpFurthest').addEventListener('click', () => jumpToStage(unlockedStageIndex));
function closeStageSelectModal() { $('mapModal').classList.remove('active'); }

$('btnOpenMap').addEventListener('click', openStageSelectModal);
$('stageDisplay').addEventListener('click', openStageSelectModal);
$('btnCloseMap').addEventListener('click', closeStageSelectModal);
$('overlayMapBtn').addEventListener('click', () => { $('overlay').classList.remove('active'); openStageSelectModal(); });

$('btnHints').addEventListener('click', () => {
  pauseGame();
  const info = indexToStageSub(currentStageIndex);
  if (currentStageIndex === 'sandbox') {
    $('starRulesBriefing').hidden = true;
    $('briefingTitle').textContent = currentLang === 'ja' ? 'フリープレイ' : 'Free Play';
    $('briefingTag').textContent = '';
    $('briefingDesc').textContent = currentLang === 'ja' ? '角度を調整し、先端をドラッグして放すと開始します。' : 'Adjust the angle, or drag the tip and release to launch.';
    $('briefingTip').textContent = currentLang === 'ja' ? 'プレイ中にタップするとパルスを使えます。' : 'Tap during play to use a pulse. Try different link and clone settings.';
    $('mechanicHints').replaceChildren();
    $('stageBriefing').classList.remove('hidden');
  } else showStageBriefing(info.stage, info.sub, info.displayStage);
});
$('btnFire').addEventListener('click', fire);
$('btnPause').addEventListener('click', togglePause);
$('btnRestart').addEventListener('click', restartAttempt);
window.addEventListener('blur', pauseGame);
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
$('btnStop').addEventListener('click', () => {
  attemptReplay.finish();
  stopGameLoop();
  clearGameTimers();
  resetPauseControls();
  gameStatus = 'end'; updateWindSpeed(0, false);
  $('btnStop').style.display = 'none'; $('btnRetry').style.display = 'block'; $('timerDisplay').classList.remove('urgent');
  $('btnRetry').textContent = I18N[currentLang].btnRetry;
});
$('btnRetry').addEventListener('click', () => loadStage(currentStageIndex));

const bindS = (id, vId, sfx='') => {
  $(id).addEventListener('input', e => { 
    $(vId).textContent = (id === 'sliderVel' ? parseFloat(e.target.value).toFixed(1) : e.target.value) + sfx; 
    if (gameStatus === 'setup') initVisualsOnly(); 
  });
};
bindS('sliderN', 'valN'); bindS('sliderCount', 'valCount'); bindS('sliderAngle', 'valAngle', '°'); bindS('sliderVel', 'valVel');

installGimmickGuide({ $, language: () => currentLang,
  pauseDemo: () => { if (tutAnimId) cancelAnimationFrame(tutAnimId); tutAnimId = null; suspendAudio(); },
  resumeDemo: () => {
    if ($('tutorialScreen').classList.contains('hidden')) return;
    if (tutAnimId) cancelAnimationFrame(tutAnimId);
    unlockAudio(); tutLastTime = performance.now(); tutAnimId = requestAnimationFrame(loopTutorial);
  }
});
installArtworkPreview({ $, language: () => currentLang });
installCompactLayout({ $, pauseGame });
installMobileControls({ $, appearance, preferences: savedProgress.preferences, setAudioPreferences,
  savePreferences: value => progressStore.saveSetting('preferences', value), pauseGame,
  strings: () => I18N[currentLang] });
updateTotalScoreDisplay();
setLanguage(currentLang);
loadStage(unlockedStageIndex);
restoreFromUrl();
visualsReady = true;


// The viewer/search controller is exposed only in explicit verification mode.
if (verificationMode) {
  document.body.classList.add('verification-mode');
  $('titleScreen').classList.add('hidden');
  cancelAnimationFrame(titleAnimId); titleAnimId = null;
  setAudioPreferences({volume:0,muted:true});
  const driver = createVerificationDriver({
    start(solution) {
      loadStage(solution.index);
      for(const [id,value] of [['sliderAngle',solution.angle],['sliderVel',solution.velocity]]) if(!$(id).disabled) $(id).value=value;
      $('stageBriefing').classList.add('hidden');
      initVisualsOnly(); fire(); stopGameLoop();
      return {angle:Number($('sliderAngle').value),velocity:Number($('sliderVel').value),pulses:startingPulses};
    },
    pulse:triggerPulse, update,
    draw() { draw(); },
    status() {
      const cleared = targets.every(target => !target.alive) && ['clearing','end'].includes(gameStatus);
      const confirmed = gameStatus === 'end' && $('overlayTitle').textContent === I18N[currentLang].stageClear;
      return {index:currentStageIndex,status:gameStatus,cleared,confirmed,ended:gameStatus==='end',failed:gameStatus==='blackhole_death'||(gameStatus==='end'&&!confirmed),remaining:targets.filter(target=>target.alive).length,time:timeElapsed,pulsesLeft};
    }
  });
  window.verificationAPI = driver;
}
