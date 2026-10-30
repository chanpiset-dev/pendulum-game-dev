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
    assert.equal(await page.locator('#artworkStyleName').innerText(), 'Pixel Arcade');
    assert.equal(await page.locator('#artworkGallery canvas').count(), 25);
    assert.equal(await page.locator('#artworkStage').evaluate(el => getComputedStyle(el).imageRendering), 'pixelated');
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
    for (const theme of ['neon-arcade','pocket-console','16bit-adventure','clean-precision','glass-orbit','soft-studio','blueprint-lab','cosmic-observatory','paper-workshop']) {
      await page.click(`[data-theme-choice="${theme}"]`);
      for (const mode of ['dark', 'light']) {
        await page.selectOption('#appearanceMode', mode); await page.click('#btnArtworkPreview');
        assert.equal(await page.locator('#artworkStyleName').innerText(), ['neon-arcade','pocket-console','16bit-adventure'].includes(theme) ? 'Pixel Arcade' : 'Clean Vector');
        assert.equal(await page.locator('#artworkGallery canvas').evaluateAll(nodes => nodes.every(canvas => {
          const data = canvas.getContext('2d').getImageData(0,0,160,128).data;
          let count=0; for(let i=0;i<data.length;i+=4) if(data[i]!==data[0] || data[i+1]!==data[1] || data[i+2]!==data[2]) count++;
          return count > 100;
        })), true, 'Every specimen contains visible artwork');
        await page.click('#artworkClose'); await page.locator('#settingsDialog').waitFor({state:'visible'});
      }
    }
    await page.evaluate(() => window.testRun("setLanguage('ja')"));
    await page.click('#btnArtworkPreview');
    assert.match(await page.locator('#artworkTitle').innerText(), /プレビュー/);
    assert.equal(await page.locator('.artwork-card > span').first().innerText(), '振り子');
    assert.deepEqual(errors, []);
    console.log('Artwork preview passed: 25 visible specimens in 18 themes, automatic style mapping, distinct pixel/vector output, mobile fit, localization, paused gameplay and unchanged saves.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
