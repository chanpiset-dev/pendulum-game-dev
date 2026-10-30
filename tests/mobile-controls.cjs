const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const errors = [];
    async function newPage(unsupported = false) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(unsupported => {
        window.requestAnimationFrame = () => 1;
        window.cancelAnimationFrame = () => {};
        window.vibrations = [];
        Object.defineProperty(navigator, 'vibrate', { value: unsupported ? undefined : value => { window.vibrations.push(value); return true; } });
        if (unsupported) {
          Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });
        }
        const createGain = AudioContext.prototype.createGain;
        window.gainNodes = [];
        AudioContext.prototype.createGain = function() {
          const gain = createGain.call(this);
          const connect = gain.connect.bind(gain);
          gain.destinations = [];
          gain.connect = destination => { gain.destinations.push(destination); return connect(destination); };
          window.gainNodes.push(gain);
          return gain;
        };
      }, unsupported);
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'game.test') return route.abort();
        const file = path.join(__dirname, '..', url.pathname === '/' ? 'index.html' : url.pathname);
        let body = fs.readFileSync(file, 'utf8');
        if (url.pathname === '/src/main.js') body += '\nwindow.testRun = code => eval(code);';
        await route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
      });
      await page.goto('http://game.test');
      await page.waitForFunction(() => window.testRun);
      await page.click('#btnStartGame');
      await page.evaluate(() => document.getElementById('stageBriefing').classList.add('hidden'));
      return page;
    }
    const page = await newPage();
    for (const selector of ['#btnFire', '#btnSettings']) {
      const bounds = await page.locator(selector).boundingBox();
      assert.ok(bounds.height >= 44 && bounds.width >= 44, selector + ' has a touch-sized target');
    }
    // Real mouse events on the touch layout exercise the same pointer handlers.
    const positions = async () => page.locator('#canvas').evaluate(canvas => {
      const r = canvas.getBoundingClientRect(), scale = Math.min(r.width / 800, r.height / 600);
      const left = r.left + (r.width - 800 * scale) / 2, top = r.top + (r.height - 600 * scale) / 2;
      const tip = window.testRun('(()=>{const c=systems[0];let x=PIVOT.x,y=PIVOT.y;for(let i=0;i<c.N;i++){x+=PENDULUM_SCALE*c.L[i]*Math.sin(c.state[i]);y+=PENDULUM_SCALE*c.L[i]*Math.cos(c.state[i]);}return {x,y};})()');
      return { tip: { x: left + tip.x * scale, y: top + tip.y * scale },
        destination: { x: left + 600 * scale, y: top + 300 * scale }, margin: { x: r.left + r.width / 2, y: r.top + 5 } };
    });
    await page.locator('#canvas').scrollIntoViewIfNeeded();
    let points = await positions();
    await page.touchscreen.tap(points.margin.x, points.margin.y);
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'setup', 'Letterbox margin cannot launch');
    await page.mouse.move(points.tip.x, points.tip.y); await page.mouse.down();
    await page.mouse.move(points.destination.x, points.destination.y);
    assert.equal(await page.locator('#sliderAngle').inputValue(), '90', 'Visible tip drag maps to actual angle');
    await page.mouse.move(points.margin.x, points.margin.y); await page.mouse.up();
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'setup', 'Leaving visible canvas cancels launch');
    await page.evaluate(() => window.testRun('loadStage(1)'));
    await page.locator('#canvas').scrollIntoViewIfNeeded(); points = await positions();
    await page.mouse.move(points.tip.x, points.tip.y); await page.mouse.down();
    await page.mouse.move(points.destination.x, points.destination.y); await page.mouse.up();
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'playing');
    const pulses = await page.evaluate(() => window.testRun('pulsesLeft'));
    await page.touchscreen.tap(points.margin.x, points.margin.y);
    assert.equal(await page.evaluate(() => window.testRun('pulsesLeft')), pulses, 'Margins do not use pulses');
    await page.click('#btnSettings');
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'paused');
    await page.locator('#soundVolume').fill('35');
    await page.locator('#soundMuted').check();
    assert.equal(await page.evaluate(() => gainNodes[0].gain.value), 0, 'Master mute reaches the audio output');
    assert.equal(await page.locator('#hapticsEnabled').count(), 0);
    assert.equal(await page.evaluate(() => vibrations.length), 0, 'Gameplay never requests vibration');
    assert.match(await page.locator('#settingsSaveStatus').innerText(), /saved/);
    await page.locator('#settingsDialog').focus(); await page.keyboard.press('Space');
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'paused');
    await page.keyboard.press('Escape');
    await page.reload(); await page.waitForFunction(() => window.testRun);
    await page.click('#btnStartGame');
    await page.evaluate(() => document.getElementById('stageBriefing').classList.add('hidden'));
    await page.click('#btnSettings');
    assert.equal(await page.locator('#soundVolume').inputValue(), '35');
    assert.equal(await page.locator('#soundMuted').isChecked(), true);
    await page.locator('#soundMuted').uncheck(); await page.click('#settingsClose');
    await page.click('#btnFire');
    assert.ok(Math.abs(await page.evaluate(() => gainNodes[0].gain.value) - 0.35) < 0.001);
    assert.equal(await page.evaluate(() => gainNodes.slice(1).every(gain => gain.destinations.includes(gainNodes[0]))), true, 'All sound gains feed master volume');
    assert.equal(await page.locator('#btnFullscreen').count(), 0);
    await page.evaluate(() => window.testRun("setLanguage('ja')"));
    assert.equal(await page.locator('#btnSettings').innerText(), '設定');
    const unsupported = await newPage(true);
    assert.equal(await unsupported.locator('#btnFullscreen').count(), 0);
    await unsupported.click('#btnSettings');
    assert.equal(await unsupported.locator('#hapticsEnabled').count(), 0);
    await unsupported.locator('#soundVolume').fill('20');
    assert.match(await unsupported.locator('#settingsSaveStatus').innerText(), /could not be saved/);
    assert.deepEqual(errors, []);
    console.log('Mobile checks passed: accurate visible-canvas drag, ignored margins, cancellation, touch target sizes, master volume/mute, no vibration requests, persistence, modal input isolation, and unavailable storage.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
