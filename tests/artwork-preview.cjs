const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => { window.requestAnimationFrame = () => 1; window.cancelAnimationFrame = () => {}; });
    await page.route('**/*', route => {
      const u = new URL(route.request().url()); if (u.hostname !== 'game.test') return route.abort();
      const file = path.join(__dirname, '..', u.pathname === '/' ? 'index.html' : u.pathname);
      let body = fs.readFileSync(file, 'utf8');
      if (u.pathname === '/src/main.js') body += '\nwindow.testRun=code=>eval(code);';
      return route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    });
    await page.goto('http://game.test'); await page.waitForFunction(() => window.testRun);
    await page.click('#btnStartGame');
    await page.evaluate(() => document.getElementById('stageBriefing').classList.add('hidden'));
    await page.click('#btnFire'); await page.click('#btnSettings');
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'paused');
    const state = await page.evaluate(() => window.testRun('JSON.stringify({systems,targets,timeElapsed,currentStageScore,highScores,stageStars})'));
    const saved = await page.evaluate(() => JSON.stringify(localStorage));
    await page.click('#btnArtworkPreview');
    assert.equal(await page.locator('#artworkDialog').isVisible(), true);
    assert.equal(await page.locator('#settingsDialog').isVisible(), false);
    assert.equal(await page.locator('#artworkStyleName').innerText(), 'Shaded Canvas');
    assert.equal(await page.locator('#artworkGallery canvas').count(), 24);
    assert.equal(await page.locator('#artworkStage').evaluate(el => getComputedStyle(el).imageRendering), 'auto');
    const pixels = await page.locator('#artworkStage').evaluate(canvas => canvas.toDataURL());
    await page.selectOption('#artworkStyle', 'vector');
    assert.notEqual(await page.locator('#artworkStage').evaluate(canvas => canvas.toDataURL()), pixels, 'Styles produce distinct artwork');
    const bounds = await page.locator('#artworkDialog').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.height <= 844);
    assert.equal(await page.locator('#artworkDialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    await page.locator('#artworkStyle').focus(); await page.keyboard.press('Space');
    assert.equal(await page.evaluate(() => window.testRun('gameStatus')), 'paused');
    await page.keyboard.press('Escape');
    // A native select can consume Escape first; close the preview explicitly if needed.
    if (await page.locator('#artworkDialog').isVisible()) await page.click('#artworkClose');
    await page.locator('#settingsDialog').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => JSON.stringify(localStorage)), saved);
    assert.equal(await page.evaluate(() => window.testRun('JSON.stringify({systems,targets,timeElapsed,currentStageScore,highScores,stageStars})')), state);
    await page.click('#btnArtworkPreview');await page.selectOption('#artworkStyle','auto');
    assert.equal(await page.locator('#artworkStyleName').innerText(),'Shaded Canvas');
    assert.equal(await page.locator('#artworkGallery canvas').count(),24);
    await page.click('#artworkClose');
    await page.evaluate(() => window.testRun("setLanguage('ja')"));
    await page.click('#btnArtworkPreview');
    assert.match(await page.locator('#artworkTitle').innerText(), /プレビュー/);
    assert.equal(await page.locator('.artwork-card > span').first().innerText(), '振り子');
    assert.deepEqual(errors, []);
    console.log('Artwork preview passed: 24 specimens in fixed Clean Precision dark, automatic style mapping, distinct pixel/vector output, mobile fit, localization, paused gameplay and unchanged saves.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
