// Pixel regression for transparent canvas recordings: frames and attempts must stay isolated.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/replay.js') return route.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(__dirname, '../src/replay.js'), 'utf8') });
      return route.fulfill({ contentType: 'text/html', body: `
        <canvas id="source" width="800" height="600"></canvas>
        <button id="btnReplay">Replay</button>
        <dialog id="replayDialog"><p id="replayDescription"></p>
          <canvas id="replayCanvas" width="800" height="600"></canvas>
          <input id="replaySeek" type="range" min="0" step="0.01"><output id="replayTime"></output>
          <button id="replayPlay">Play</button><select id="replaySpeed"><option value="1">1</option></select>
          <button id="replayClose">Close</button>
        </dialog>
        <script type="module">
          import { createAttemptReplay } from './replay.js';
          const $ = id => document.getElementById(id);
          const source = $('source'), ctx = source.getContext('2d');
          window.recorder = createAttemptReplay({ canvas: source, $, pauseGame() {} });
          window.frame = (color, x) => { ctx.clearRect(0, 0, 800, 600); ctx.fillStyle = color; ctx.fillRect(x - 30, 270, 60, 60); };
          window.pixel = x => Array.from($('replayCanvas').getContext('2d').getImageData(x, 300, 1, 1).data);
        </script>` });
    });
    await page.goto('http://game.test/');
    await page.waitForFunction(() => window.recorder);
    await page.evaluate(() => {
      recorder.begin('First attempt');
      frame('red', 100); recorder.capture(0);
      frame('blue', 300); recorder.capture(1);
      recorder.finish();
    });
    await page.locator('#btnReplay').click();
    await page.waitForFunction(() => pixel(100)[0] > 180);
    const dark = channels => channels.slice(0, 3).every(value => value < 25);
    assert.ok(dark(await page.evaluate(() => pixel(300))), 'No future bob or effect in the first frame');
    await page.locator('#replaySeek').fill('1');
    await page.waitForFunction(() => pixel(300)[2] > 180);
    assert.ok(dark(await page.evaluate(() => pixel(100))), 'Previous bob must disappear from later frames');
    await page.locator('#replaySeek').fill('0');
    await page.waitForFunction(() => pixel(100)[0] > 180);
    assert.ok(dark(await page.evaluate(() => pixel(300))), 'Seeking backwards must not retain future content');
    await page.locator('#replayClose').click();
    await page.evaluate(() => {
      recorder.begin('Second attempt');
      frame('lime', 500); recorder.capture(0); recorder.finish();
    });
    await page.locator('#btnReplay').click();
    await page.waitForFunction(() => pixel(500)[1] > 180);
    assert.ok(dark(await page.evaluate(() => pixel(100))), 'Previous attempt red bob must be absent');
    assert.ok(dark(await page.evaluate(() => pixel(300))), 'Previous attempt blue bob must be absent');
    console.log('Replay pixel regression passed: no accumulated bobs/effects, no future content after seeking, and no previous-attempt contamination.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
