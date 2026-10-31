const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const ids = ['neon-arcade', 'pocket-console', '16bit-adventure', 'clean-precision', 'glass-orbit', 'soft-studio', 'blueprint-lab', 'cosmic-observatory', 'paper-workshop'];
const rgb = hex => hex.match(/[\da-f]{2}/gi).slice(0, 3).map(value => parseInt(value, 16));
const luminance = hex => rgb(hex).map(value => { value /= 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4; }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => { window.requestAnimationFrame = () => 1; window.cancelAnimationFrame = () => {}; });
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'game.test') return route.abort();
      const file = path.join(__dirname, '..', url.pathname === '/' ? 'index.html' : url.pathname);
      let body = fs.readFileSync(file, 'utf8');
      if (url.pathname === '/src/main.js') body += '\nwindow.testRun = code => eval(code);';
      return route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    });
    await page.goto('http://game.test');
    await page.waitForFunction(() => window.testRun, null, { polling: 50 });
    assert.deepEqual(await page.evaluate(() => ({ ...document.documentElement.dataset })), { theme: 'clean-precision', mode: 'dark' });
    await page.click('#btnStartGame');
    await page.evaluate(() => document.getElementById('stageBriefing').classList.add('hidden'));
    await page.click('#btnSettings');
    assert.equal(await page.locator('[data-theme-choice]').count(), 9);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'appearanceMode');
    assert.equal(await page.locator('#settingsDialog').evaluate(el => el.scrollTop), 0);
    const state = await page.evaluate(() => window.testRun('JSON.stringify({systems,targets,currentStageIndex,highScores,stageStars,gameStatus,timeElapsed})'));
    const backgrounds = new Set();
    for (const id of ids) {
      await page.locator(`[data-theme-choice="${id}"]`).click();
      for (const mode of ['dark', 'light']) {
        await page.selectOption('#appearanceMode', mode);
        const palette = await page.evaluate(() => window.testRun('getCanvasPalette()'));
        assert.equal(palette.theme, id); assert.equal(palette.mode, mode);
        assert.ok(contrast(palette.text, palette.panel) >= 4.5, `${id}/${mode} body text contrast`);
        assert.ok(contrast(palette.muted, palette.panel) >= 4.5, `${id}/${mode} secondary text contrast`);
        const pixel = await page.evaluate(() => Array.from(document.getElementById('canvas').getContext('2d').getImageData(5, 2, 1, 1).data));
        assert.deepEqual(pixel.slice(0, 3), rgb(palette.canvas), `${id}/${mode} canvas uses active background`);
        assert.equal(pixel[3], 255);
        backgrounds.add(palette.canvas);
        assert.equal(await page.locator(`[data-theme-choice="${id}"]`).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.evaluate(() => window.testRun('JSON.stringify({systems,targets,currentStageIndex,highScores,stageStars,gameStatus,timeElapsed})')), state, 'Appearance must not mutate gameplay or progress');
      }
    }
    assert.equal(backgrounds.size, 18, 'Every theme/mode has its own canvas palette');
    await page.selectOption('#appearanceMode', 'system');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.dataset.mode === 'dark', null, { polling: 50 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(() => document.documentElement.dataset.mode === 'light', null, { polling: 50 });
    await page.locator('#soundVolume').fill('40'); await page.locator('#soundMuted').check();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('pendulum_preferences_v1')));
    assert.deepEqual(saved, { volume: 0.4, muted: true, theme: 'paper-workshop', mode: 'system' });
    await page.reload(); await page.waitForFunction(() => window.testRun, null, { polling: 50 });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'paper-workshop');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.mode), 'light');
    await page.click('#btnStartGame');
    await page.evaluate(() => document.getElementById('stageBriefing').classList.add('hidden'));
    await page.click('#btnSettings');
    await page.selectOption('#appearanceMode', 'light'); await page.emulateMedia({ colorScheme: 'dark' });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.mode), 'light', 'Explicit mode ignores system changes');
    await page.setViewportSize({ width: 390, height: 844 });
    const bounds = await page.locator('#settingsDialog').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.height <= 844);
    assert.equal(await page.locator('#settingsDialog').evaluate(el => el.scrollWidth <= el.clientWidth), true, 'Mobile picker has no horizontal overflow');
    await page.evaluate(() => window.testRun("setLanguage('ja')"));
    assert.equal(await page.locator('#appearanceTitle').innerText(), '外観');
    assert.equal(await page.locator('[data-theme-group="retro"]').innerText(), 'レトロ');
    await page.click('#settingsClose');
    // A light-theme recording keeps its original pixels after changing to dark.
    await page.evaluate(() => window.testRun('fire();stopGameLoop();draw();attemptReplay.capture(0);attemptReplay.finish()'));
    await page.click('#btnSettings');
    await page.locator('[data-theme-choice="neon-arcade"]').click(); await page.selectOption('#appearanceMode', 'dark');
    await page.click('#settingsClose'); await page.click('#btnMore'); await page.click('#btnReplay');
    await page.waitForFunction(() => document.getElementById('replayCanvas').getContext('2d').getImageData(5, 2, 1, 1).data[0] > 200, null, { polling: 50 });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.mode), 'dark');
    await page.click('#replayClose');
    await page.evaluate(() => localStorage.setItem('pendulum_preferences_v1', '{"theme":"bad","mode":"bad","volume":0.3,"muted":true}'));
    await page.reload(); await page.waitForFunction(() => window.testRun, null, { polling: 50 });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'clean-precision');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.mode), 'dark');
    assert.equal(await page.evaluate(() => window.testRun('savedProgress.preferences.volume')), 0.3);
    assert.deepEqual(errors, []);
    console.log('Theme matrix passed: 18 palettes, text contrast, canvas colors, no gameplay mutation, system following, persistence with sound, mobile layout, localization, replay appearance retention and corrupt-preference recovery.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
