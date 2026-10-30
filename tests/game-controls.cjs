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
        return { clientX: rect.left + tip.x * rect.width / 800, clientY: rect.top + tip.y * rect.height / 600 };
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
      return passed;
    });
    assert.deepEqual(errors, []);
    console.log(`${checks.length} control/lifecycle checks passed; no browser page errors.`);
    await page.close();

    // Also exercise uninstrumented source with native animation and mouse events.
    const live = await browser.newPage();
    const liveErrors = [];
    live.on('pageerror', error => liveErrors.push(error.message));
    await live.route('**/*', route => serveGame(route));
    await live.goto('http://game.test');
    await live.click('#btnStartGame');
    if (await live.locator('#stageBriefing').isVisible()) await live.click('#btnDismissBriefing');
    const initialTimer = await live.locator('#timerDisplay').innerText();
    await live.click('#btnFire');
    await live.waitForTimeout(1200);
    assert.notEqual(await live.locator('#timerDisplay').innerText(), initialTimer);
    await live.click('#btnStop');
    const stoppedTimer = await live.locator('#timerDisplay').innerText();
    await live.waitForTimeout(200);
    assert.equal(await live.locator('#timerDisplay').innerText(), stoppedTimer);
    await live.click('#btnRetry');
    await live.click('#btnFire');
    await live.waitForTimeout(200);
    await live.click('#btnStop');
    await live.click('#btnRetry');
    // Default Stage 1 tip at 120 degrees, using the existing input conversion.
    const tip = await live.locator('#canvas').evaluate(canvas => {
      const rect = canvas.getBoundingClientRect();
      return { x: rect.left + (400 + 300 * Math.sin(2 * Math.PI / 3)) * rect.width / 800,
        y: rect.top + 150 * rect.height / 600 };
    });
    await live.mouse.move(tip.x, tip.y);
    await live.mouse.down();
    await live.mouse.move(tip.x - 10, tip.y + 10);
    await live.mouse.up();
    assert.equal(await live.locator('#btnStop').isVisible(), true);
    assert.deepEqual(liveErrors, []);
    console.log('Native browser checks passed: timer advances, stop freezes, retry works, mouse drag launches.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
