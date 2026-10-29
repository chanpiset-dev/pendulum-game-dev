export const I18N = {
  en: {
    titleSubtitle: "Pure chaos ahead! Aim, launch, and boost mid-flight!",
    startBtn: "START GAME",
    tutorialBtn: "TUTORIAL",
    headerLangBtn: "日本語",
    tutIntro: "<strong>Mission: </strong> Line up your shot and launch the pendulum to <strong>smash every target (<span style=\"color: var(--danger);\">Red</span>) before time runs out</strong>!",
    tut1: "<strong>Aim & Launch:</strong> Adjust the sliders or drag the bob directly, then hit <strong>Spacebar</strong> to FIRE!",
    tut2: "<strong>Mid-Air Boost:</strong> Tap the screen or press <strong>Spacebar</strong> mid-flight to trigger shockwaves and master the chaos!",
    tut3: "<strong>Stage Clear:</strong> Shatter all red targets before the clock hits zero to advance!",
    tut4: "<strong>Wild Hazards:</strong> Watch out for Bombs, Black Holes, and Winds. Always check the stage briefings!",
    tutDone: "START GAME",
    home: "HOME",
    freePlay: "FREE PLAY",
    stageMode: "STAGE MODE",
    reroll: "REROLL",
    stages: "STAGES",
    share: "SHARE URL",
    score: "SCORE:",
    panelHint: "Press Space, tap Play, or drag tip to fire.",
    lblN: "Pendulum Links",
    lblCount: "Clones",
    lblAngle: "Initial Angle",
    lblVel: "Initial Angular Velocity",
    btnFire: "▶ PLAY",
    btnStop: "⏹ STOP",
    btnRetry: "↺ RETRY",
    pulses: "PULSES: ",
    pulsesLocked: "PULSES: 0 (LOCKED)",
    lockedTag: "(LOCKED)",
    urlCopied: "Parameter URL copied to clipboard!",
    briefingGotIt: "GOT IT",
    modalTitle: "Stage Select (50 Stages × 5 Substages)",
    stageClear: "STAGE CLEAR",
    allClearAlert: "🎉 All 50 Stages & Substages Conquered!\nTOTAL SCORE: ",
    timeUp: "TIME UP",
    timeUpDesc: "Adjust your initial parameters and retry!",
    singularity: "SINGULARITY COLLAPSE",
    singularityDesc: "The Black Hole swallowed your pendulums!",
    laserTrip: "LASER TRIPPED",
    laserTripDesc: "You ran out of energy shield lives!",
    nextStage: "NEXT STAGE",
    allCleared: "ALL CLEARED",
    nextBtnText: (stg, sub) => `NEXT (${stg}-${sub})`,
    enterStageText: (stg) => `ENTER STAGE ${stg}`,
    gravityInvert: "GRAVITY INVERTED!",
    gravityNormalize: "GRAVITY NORMALIZED!",
    gateOpen: "GATE OPEN!",
    shieldCrack: "SHIELD CRACK!",
    shieldHit: (c, m) => `⚡ SHIELD HIT! ${c}/${m} LIVES`,
    finish: "FINISH!",
    wind: (dir, spd) => `WIND: ${dir} ${spd} m/s`,
    lives: "LIVES: ",
    gravHud: (g, tag) => `GRAVITY: ${g} m/s² ${tag}`,
    tagLowG: "(LOW-G)",
    tagHighG: "(HIGH-G)",
    tagInvG: "(INVERTED-G)",
    clearBest: "CLEAR",
    warpedFloater: "✦ WARPED (0.6x) ✦"
  },
  ja: {
    titleSubtitle: "放てばカオス！ 狙いを定めて、空中でブースト！",
    startBtn: "START GAME",
    tutorialBtn: "TUTORIAL",
    headerLangBtn: "English",
    tutIntro: "<strong>ミッション: </strong> 狙いを定めて振り子を発射し、<strong>タイムアップまでにすべてのターゲット（<span style=\"color: var(--danger);\">赤</span>）を撃破せよ！</strong>",
    tut1: "<strong>狙って発射:</strong> スライダー調整や先端ドラッグで狙いをつけて、<strong>Spaceキー</strong>で発射！",
    tut2: "<strong>空中ブースト:</strong> 飛行中に画面タップか<strong>Spaceキー</strong>！ 衝撃波でカオスな軌道を強引にねじ曲げろ！",
    tut3: "<strong>ステージ突破:</strong> タイマーがゼロになる前にすべての赤い標的を破壊すればクリア！",
    tut4: "<strong>多彩なギミック:</strong> ボムの連鎖、ブラックホール、強風など、各ステージの作戦ブリーフィングを見逃すな！",
    tutDone: "START GAME",
    home: "ホーム",
    freePlay: "フリープレイ",
    stageMode: "ステージモード",
    reroll: "再生成",
    stages: "ステージ一覧",
    share: "URL共有",
    score: "スコア:",
    panelHint: "Spaceキー、発射ボタン、または先端ドラッグで射出",
    lblN: "振り子の関節数",
    lblCount: "クローン数",
    lblAngle: "発射角度",
    lblVel: "初角速度",
    btnFire: "▶ PLAY",
    btnStop: "⏹ STOP",
    btnRetry: "↺ RETRY",
    pulses: "パルス残数: ",
    pulsesLocked: "パルス: 0 (ロック)",
    lockedTag: "(ロック)",
    urlCopied: "パラメータURLをクリップボードにコピーしました！",
    briefingGotIt: "了解！",
    modalTitle: "ステージセレクト (全50ステージ × 各5エリア)",
    stageClear: "ステージ突破！",
    allClearAlert: "🎉 全50ステージ完全制覇達成！\nトータルスコア: ",
    timeUp: "タイムアップ",
    timeUpDesc: "初期設定（角度・速度）を見直して再挑戦しよう！",
    singularity: "特異点に呑み込まれた！",
    singularityDesc: "ブラックホールの重力に振り子が捕まってしまった！",
    laserTrip: "迎撃レーザー被弾！",
    laserTripDesc: "エネルギーシールドの残機が尽きてしまった！",
    nextStage: "次のステージへ",
    allCleared: "完全制覇おめでとう！",
    nextBtnText: (stg, sub) => `次へ (${stg}-${sub})`,
    enterStageText: (stg) => `STAGE ${stg} へ進む`,
    gravityInvert: "重力反転発動！",
    gravityNormalize: "重力正常化！",
    gateOpen: "ゲート開放！",
    shieldCrack: "シールド破壊！",
    shieldHit: (c, m) => `⚡ シールド被弾！ 残機 ${c}/${m}`,
    finish: "クリア！",
    wind: (dir, spd) => `風速: ${dir} ${spd} m/s`,
    lives: "シールド残機: ",
    gravHud: (g, tag) => `重力加速度: ${g} m/s² ${tag}`,
    tagLowG: "(低重力)",
    tagHighG: "(高重力)",
    tagInvG: "(反転重力)",
    clearBest: "クリア済",
    warpedFloater: "✦ 空間転送 (減速0.6x) ✦"
  }
};

export function createI18nController({
  $, getCurrentLang, setCurrentLang, getCurrentStageIndex, getPulsesLeft,
  indexToStageSub, STAGE_CONFIGS, showStageBriefing, renderStageSelect
}) {
  function setLanguage(lang) {
  setCurrentLang(lang);
  localStorage.setItem('pendulum_lang', getCurrentLang());

  // Synchronize Home Screen Top-Left Segmented Buttons
  const pillBtns = document.querySelectorAll('#homeLangSwitch .lang-btn');
  pillBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === getCurrentLang());
  });

  applyLanguage();

  // If Stage Briefing or Stage Select Modal is currently open, refresh immediately
  if (!$('stageBriefing').classList.contains('hidden')) {
    const stageInfo = indexToStageSub(getCurrentStageIndex());
    showStageBriefing(stageInfo.stage, stageInfo.sub, stageInfo.displayStage);
  }
  if ($('mapModal').classList.contains('active')) {
    renderStageSelect();
  }

  }

  function applyLanguage() {
  const t = I18N[getCurrentLang()];
  $('titleSubtitle').textContent = t.titleSubtitle;
  $('btnStartGame').textContent = t.startBtn;
  $('btnGoTutorial').textContent = t.tutorialBtn;
  $('btnHeaderLang').textContent = t.headerLangBtn;

  $('tutIntro').innerHTML = t.tutIntro;
  $('tutStep1').innerHTML = t.tut1;
  $('tutStep2').innerHTML = t.tut2;
  $('tutStep3').innerHTML = t.tut3;
  $('tutStep4').innerHTML = t.tut4;
  $('btnTutorialDone').textContent = t.tutDone;

  $('btnTitle').textContent = t.home;
  const isSandbox = (getCurrentStageIndex() === 'sandbox');
  $('btnSandbox').textContent = isSandbox ? t.stageMode : t.freePlay;
  $('btnOpenMap').textContent = t.stages;
  if ($('overlayMapBtn')) $('overlayMapBtn').textContent = t.stages;
  $('btnShare').textContent = t.share;
  $('lblScore').textContent = t.score;

  $('uiPanelHint').textContent = t.panelHint;
  $('lblN').textContent = t.lblN;
  $('lblCount').textContent = t.lblCount;
  $('lblAngle').textContent = t.lblAngle;
  $('lblVel').textContent = t.lblVel;

  if ($('btnFire').style.display !== 'none') $('btnFire').textContent = t.btnFire;
  if ($('btnStop').style.display !== 'none') $('btnStop').textContent = t.btnStop;
  if ($('btnRetry').style.display !== 'none') $('btnRetry').textContent = t.btnRetry;

  $('btnDismissBriefing').textContent = t.briefingGotIt;
  $('uiModalTitle').textContent = t.modalTitle;

  const el = $('hudPulse');
  if (el) {
    if (getPulsesLeft() === Infinity) {
      el.textContent = `${t.pulses}∞`;
    } else if (getPulsesLeft() === 0) {
      el.textContent = t.pulsesLocked;
    } else {
      el.textContent = `${t.pulses}${getPulsesLeft()}`;
    }
  }

  if (!isSandbox) {
    const stageInfo = indexToStageSub(getCurrentStageIndex());
    const cfg = STAGE_CONFIGS[stageInfo.stage] || { name: 'STAGE' };
    const stageName = (getCurrentLang() === 'ja' && cfg.ja) ? cfg.ja.name : cfg.name;
    $('stageDisplay').innerHTML = `${stageInfo.label} <span style=\"font-size:0.72rem;color:var(--muted)\">[${stageName}] ▼</span>`;
  }

  const slN = $('sliderN');
  const slC = $('sliderCount');
  const slV = $('sliderVel');
  const slA = $('sliderAngle');

  if (slN && slN.disabled) {
    $('valN').textContent = `${slN.value} ${t.lockedTag}`;
  }
  if (slC && slC.disabled) {
    $('valCount').textContent = `${slC.value} ${t.lockedTag}`;
  }
  if (slV && slV.disabled) {
    $('valVel').textContent = `${parseFloat(slV.value).toFixed(1)} ${t.lockedTag}`;
  }
  if (slA && slA.disabled) {
    $('valAngle').textContent = `${slA.value}° ${t.lockedTag}`;
  }

  }

  return { setLanguage, applyLanguage };
}
