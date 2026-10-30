// Run with: node tests/game-controls.cjs (requires Playwright and Chromium).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      let id = 0;
      window.testFrames = new Map();
      window.requestAnimationFrame = callback => {
        window.testFrames.set(++id, callback);
        return id;
      };
      window.cancelAnimationFrame = frame => window.testFrames.delete(frame);
    });
    const serveGame = async (route, instrument = false) => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'game.test') return route.abort();
      const file = path.join(__dirname, '..', url.pathname === '/' ? 'index.html' : url.pathname);
      let body = fs.readFileSync(file, 'utf8');
      // Expose existing functions only in the test response; source stays unchanged.
      if (instrument && url.pathname === '/src/main.js') body += '\nwindow.testRun = code => eval(code);';
      await route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    };
    await page.route('**/*', route => serveGame(route, true));
    await page.goto('http://game.test');
    await page.waitForFunction(() => window.testRun);
    const checks = await page.evaluate(() => {
      const run = window.testRun;
      const passed = [];
      const check = (condition, name) => {
        if (!condition) throw new Error(name);
        passed.push(name);
      };
      const el = id => document.getElementById(id);
      const space = (target = document.body, repeat = false) => target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', repeat, bubbles: true, cancelable: true }));
      const setup = () => {
        run('loadStage(1)');
        el('titleScreen').classList.add('hidden');
        el('tutorialScreen').classList.add('hidden');
        el('stageBriefing').classList.add('hidden');
        el('mapModal').classList.remove('active');
      };
      el('stageBriefing').classList.add('hidden');
      space();
      check(run('gameStatus') === 'setup', 'Space on title does not launch');
      setup();
      el('tutorialScreen').classList.remove('hidden');
      space();
      check(run('gameStatus') === 'setup', 'Space on tutorial does not launch');
      setup();
      el('mapModal').classList.add('active');
      space();
      check(run('gameStatus') === 'setup', 'Space in stage selection does not launch');
      setup();
      space(el('btnHeaderLang'));
      space(el('sliderAngle'));
      check(run('gameStatus') === 'setup', 'Focused controls retain their Space behavior');
      space(document.body, true);
      check(run('gameStatus') === 'setup', 'Repeated Space does not launch');
      el('stageBriefing').classList.remove('hidden');
      space();
      check(el('stageBriefing').classList.contains('hidden') && run('gameStatus') === 'setup', 'Space dismisses briefing without launching');
      space();
      check(run('gameStatus') === 'playing', 'Space launches active game');
      const pulses = run('pulsesLeft');
      space(document.body, true);
      check(run('pulsesLeft') === pulses, 'Held Space does not consume pulses');
      space();
      check(run('pulsesLeft') === pulses - 1, 'Fresh Space triggers one pulse');
      window.testFrames.clear();
      setup();
      run('fire();fire()');
      check(window.testFrames.size === 1, 'Repeated fire owns one frame');
      for (let i = 0; i < 10; i++) {
        el('btnStop').click();
        check(window.testFrames.size === 0, 'Stop cancels frame ' + i);
        el('btnRetry').click();
        el('btnFire').click();
        check(window.testFrames.size === 1, 'Rapid retry owns one frame ' + i);
      }
      const [frameId, callback] = [...window.testFrames][0];
      window.testFrames.delete(frameId);
      callback(performance.now() + 16);
      check(window.testFrames.size === 1, 'Animation tick schedules one successor');
      run('loadStage(6)');
      check(window.testFrames.size === 0, 'Stage transition cancels previous frame');
      run('fire()');
      el('btnTitle').click();
      check(window.testFrames.size === 1, 'Home retains title frame only');
      window.testFrames.clear();
      setup();
      run("showOverlay('Retry', '', 'Retry', false)");
      space();
      check(!el('overlay').classList.contains('active') && run('gameStatus') === 'setup', 'Space retries result overlay');
      // Controlled pointer IDs reproduce interruptions and unrelated fingers.
      const wrapper = el('canvasWrapper');
      const captured = new Set();
      wrapper.setPointerCapture = id => captured.add(id);
      wrapper.hasPointerCapture = id => captured.has(id);
      wrapper.releasePointerCapture = id => captured.delete(id);
      const point = () => {
        const tip = run(`(()=>{const c=systems[0];let x=PIVOT.x,y=PIVOT.y;for(let i=0;i<c.N;i++){x+=PENDULUM_SCALE*c.L[i]*Math.sin(c.state[i]);y+=PENDULUM_SCALE*c.L[i]*Math.cos(c.state[i]);}return {x,y}})()`);
        const rect = el('canvas').getBoundingClientRect();
        const scale = Math.min(rect.width / 800, rect.height / 600);
        return { clientX: rect.left + (rect.width - 800 * scale) / 2 + tip.x * scale,
          clientY: rect.top + (rect.height - 600 * scale) / 2 + tip.y * scale };
      };
      const pointer = (type, id, primary = true) => wrapper.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', isPrimary: primary, button: 0, bubbles: true, ...point() }));
      setup();
      pointer('pointerdown', 1);
      check(captured.has(1), 'Primary pointer captures drag');
      pointer('pointerdown', 2, false);
      pointer('pointerup', 2, false);
      check(run('gameStatus') === 'setup' && captured.has(1), 'Second finger cannot release drag');
      pointer('pointercancel', 1);
      pointer('pointerup', 1);
      check(run('gameStatus') === 'setup' && captured.size === 0, 'Cancelled drag does not launch');
      pointer('pointerdown', 3);
      pointer('lostpointercapture', 3);
      pointer('pointerup', 3);
      check(run('gameStatus') === 'setup', 'Lost capture does not launch');
      pointer('pointerdown', 4);
      window.dispatchEvent(new Event('blur'));
      pointer('pointerup', 4);
      check(run('gameStatus') === 'setup', 'Window blur cancels drag');
      pointer('pointerdown', 5);
      el('btnSandbox').click();
      pointer('pointerup', 5);
      check(run('gameStatus') === 'setup', 'Stage change cancels drag');
      setup();
      pointer('pointerdown', 6);
      pointer('pointermove', 6);
      pointer('pointerup', 6);
      check(run('gameStatus') === 'playing', 'Matching drag release launches normally');
      const beforeTap = run('pulsesLeft');
      pointer('pointerdown', 7);
      check(run('pulsesLeft') === beforeTap - 1, 'Canvas tap still triggers pulse');
      setup();
      run('loadStage(31);fire();targets.forEach(t=>t.alive=false);update(.016)');
      check(run("gameStatus === 'clearing'"), 'Completion enters clearing');
      run('update(3.1);draw()');
      check(el('overlay').classList.contains('active'), 'Completion renders result overlay');
      setup();
      run('fire();update(.02)');
      const snapshot = () => run('JSON.stringify({systems,targets,particles,shockwaves,floaters,fireworks,timeElapsed,clearingTimer,pulsesLeft,currentLives,currentStageScore,laserCooldown,currentGravity,gravityInversionTimer})');
      el('btnPause').click();
      check(run("gameStatus === 'paused'") && window.testFrames.size === 0, 'Pause cancels simulation frame');
      check(!el('pauseIndicator').classList.contains('hidden') && el('btnPause').textContent.includes('RESUME'), 'Paused indicator and Resume button appear');
      const pausedSnapshot = snapshot();
      run('update(2);triggerPulse();fire()');
      space();
      pointer('pointerdown', 20);
      pointer('pointermove', 20);
      pointer('pointerup', 20);
      check(snapshot() === pausedSnapshot, 'Paused state blocks physics, timers, pulses, fire and drag');
      el('btnPause').click();
      check(run("gameStatus === 'playing'") && window.testFrames.size === 1, 'Resume restores one simulation loop');
      check(run('Math.abs(performance.now()-lastTime)<100'), 'Resume resets frame timestamp');
      const pressP = (target = document.body, repeat = false) => target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyP', repeat, bubbles: true, cancelable: true }));
      document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyP', ctrlKey: true, bubbles: true, cancelable: true }));
      check(run("gameStatus === 'playing'"), 'Browser Ctrl+P shortcut does not pause');
      pressP();
      check(run("gameStatus === 'paused'"), 'P pauses gameplay');
      pressP(document.body, true);
      check(run("gameStatus === 'paused'"), 'Held P does not repeatedly toggle');
      pressP(el('sliderAngle'));
      pressP(el('btnRestart'));
      el('mapModal').classList.add('active');
      pressP();
      check(run("gameStatus === 'paused'"), 'P respects focused controls and stage modal');
      el('mapModal').classList.remove('active');
      pressP();
      window.dispatchEvent(new Event('blur'));
      check(run("gameStatus === 'paused'"), 'Leaving window automatically pauses');
      window.dispatchEvent(new Event('focus'));
      check(run("gameStatus === 'paused'"), 'Returning does not automatically resume');
      pressP();
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
      check(run("gameStatus === 'paused'"), 'Hidden tab automatically pauses');
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
      check(run("gameStatus === 'paused'"), 'Visible tab requires explicit Resume');
      setup();
      el('sliderAngle').value = '135';
      el('sliderVel').value = '2.5';
      run('fire();targets[0].alive=false;pulsesLeft=0;currentLives=0;currentStageScore=500;update(.02)');
      el('btnPause').click();
      el('sliderAngle').value = '25';
      el('btnRestart').click();
      check(run("gameStatus === 'playing' && timeElapsed === 0 && targets.every(t=>t.alive) && pulsesLeft === 3 && currentLives === maxLives && currentStageScore === 0"), 'Restart from pause resets attempt');
      check(el('sliderAngle').value === '135' && el('sliderVel').value === '2.5', 'Restart preserves original launch parameters');
      check(window.testFrames.size === 1 && el('pauseIndicator').classList.contains('hidden'), 'Restart leaves one loop and clears paused indicator');
      el('btnRestart').click();
      check(run("gameStatus === 'playing' && timeElapsed === 0") && window.testFrames.size === 1, 'Restart works during play');
      run('loadStage(201);fire()');
      el('btnPause').click();
      el('btnRestart').click();
      check(run('currentGravity === -9.8 && systems[0].N === 4 && pulsesLeft === 0'), 'Restart preserves Stage 41 rules');
      el('btnPause').click();
      el('btnStop').click();
      check(run("gameStatus === 'end'") && el('pauseIndicator').classList.contains('hidden') && el('btnPause').style.display === 'none', 'Stop clears pause controls');
      return passed;
    });
    assert.deepEqual(errors, []);
    console.log(`${checks.length} control/lifecycle checks passed; no browser page errors.`);
    await page.evaluate(() => {
      window.testRun('loadStage(1);fire();fireworks=[];scheduleGameTimer(launchFirework,100);pauseGame()');
    });
    await page.waitForTimeout(160);
    assert.equal(await page.evaluate(() => window.testRun('fireworks.length')), 0);
    await page.evaluate(() => window.testRun('togglePause()'));
    await page.waitForTimeout(160);
    assert.equal(await page.evaluate(() => window.testRun('fireworks.length')), 1);
    await page.evaluate(() => window.testRun('clearGameTimers();loadStage(1)'));
    console.log('Delayed game effect remains frozen while paused and runs after explicit Resume.');
    await page.close();

    // Also exercise uninstrumented source with native animation and mouse events.
    const live = await browser.newPage();
    const liveErrors = [];
    live.on('pageerror', error => liveErrors.push(error.message));
    await live.route('**/*', route => serveGame(route));
    await live.addInitScript(() => {
      window.AudioContext = new Proxy(window.AudioContext, {
        construct(target, args) {
          window.testAudioContext = Reflect.construct(target, args);
          return window.testAudioContext;
        },
      });
    });
    await live.goto('http://game.test');
    assert.equal(await live.locator('#pauseIndicator').isVisible(), false);
    await live.click('#btnStartGame');
    if (await live.locator('#stageBriefing').isVisible()) await live.click('#btnDismissBriefing');
    const initialTimer = await live.locator('#timerDisplay').innerText();
    await live.click('#btnFire');
    await live.waitForTimeout(1200);
    assert.notEqual(await live.locator('#timerDisplay').innerText(), initialTimer);
    await live.click('#btnPause');
    await live.waitForFunction(() => window.testAudioContext.state === 'suspended');
    const frozenTimer = await live.locator('#timerDisplay').innerText();
    const frozenPixels = await live.locator('#canvas').evaluate(canvas => canvas.toDataURL());
    await live.waitForTimeout(1100);
    assert.equal(await live.locator('#timerDisplay').innerText(), frozenTimer);
    assert.equal(await live.locator('#canvas').evaluate(canvas => canvas.toDataURL()), frozenPixels);
    assert.equal(await live.locator('#pauseIndicator').isVisible(), true);
    await live.click('#btnPause');
    await live.waitForFunction(() => window.testAudioContext.state === 'running');
    assert.equal(await live.locator('#pauseIndicator').isVisible(), false);
    await live.waitForTimeout(1100);
    assert.notEqual(await live.locator('#timerDisplay').innerText(), frozenTimer);
    await live.click('#btnStop');
    const stoppedTimer = await live.locator('#timerDisplay').innerText();
    await live.waitForTimeout(200);
    assert.equal(await live.locator('#timerDisplay').innerText(), stoppedTimer);
    await live.click('#btnRetry');
    await live.click('#btnFire');
    await live.waitForTimeout(200);
    await live.click('#btnStop');
    await live.click('#btnRetry');
    // Default Stage 1 tip at 120 degrees, mapped through the visible canvas.
    const tip = await live.locator('#canvas').evaluate(canvas => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(rect.width / 800, rect.height / 600);
      return { x: rect.left + (rect.width - 800 * scale) / 2 + (400 + 300 * Math.sin(2 * Math.PI / 3)) * scale,
        y: rect.top + (rect.height - 600 * scale) / 2 + 150 * scale };
    });
    await live.mouse.move(tip.x, tip.y);
    await live.mouse.down();
    await live.mouse.move(tip.x - 10, tip.y + 10);
    await live.mouse.up();
    assert.equal(await live.locator('#btnStop').isVisible(), true);
    assert.deepEqual(liveErrors, []);
    console.log('Native browser checks passed: pause freezes timer/canvas/audio, resume continues, stop/retry and mouse drag work.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
