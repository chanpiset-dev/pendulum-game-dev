const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      const request = window.requestAnimationFrame.bind(window), cancel = window.cancelAnimationFrame.bind(window);
      window.pendingFrames = new Map();
      window.requestAnimationFrame = callback => {
        const id = request(now => { pendingFrames.delete(id); callback(now); });
        pendingFrames.set(id, callback.name); return id;
      };
      window.cancelAnimationFrame = id => { pendingFrames.delete(id); cancel(id); };
    });
    await page.route('**/*', route => {
      const url = new URL(route.request().url()); if (url.hostname !== 'game.test') return route.abort();
      const file = path.join(__dirname, '..', url.pathname === '/' ? 'index.html' : url.pathname);
      let body = fs.readFileSync(file, 'utf8'); if (url.pathname === '/src/main.js') body += '\nwindow.testRun=code=>eval(code);';
      return route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    });
    await page.goto('http://game.test'); await page.waitForFunction(() => window.testRun);
    const state = () => page.evaluate(() => window.testRun('JSON.stringify(titleChain.state)'));
    const count = () => page.evaluate(() => [...pendingFrames.values()].filter(name => name === 'loopTitle').length);
    const before = await state(), image = await page.locator('#titleCanvas').evaluate(canvas => canvas.toDataURL());
    await page.waitForTimeout(350);
    assert.notEqual(await state(), before, 'Home physics continues after the first frame');
    assert.notEqual(await page.locator('#titleCanvas').evaluate(canvas => canvas.toDataURL()), image, 'Home canvas visibly changes');
    assert.equal(await count(), 1, 'One Home frame remains scheduled');
    await page.click('#btnStartGame'); const stopped = await state();
    await page.waitForTimeout(200); assert.equal(await state(), stopped); assert.equal(await count(), 0);
    await page.click('#btnTitle');
    await page.waitForTimeout(150); assert.notEqual(await state(), stopped); assert.equal(await count(), 1);
    await page.evaluate(() => { document.getElementById('btnTitle').click(); document.getElementById('btnTitle').click(); });
    assert.equal(await count(), 1, 'Repeated Home navigation does not duplicate loops');
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => window.testRun('(()=>{const scale=Math.min(titleCanvas.width,titleCanvas.height)*0.18;const pivot={x:titleCanvas.width/2,y:titleCanvas.height*0.48};const reach=titleChain.L.reduce((a,b)=>a+b,0)*scale+10*OBJECT_SCALE;return pivot.x-reach>=0&&pivot.x+reach<=titleCanvas.width&&pivot.y-reach>=0&&pivot.y+reach<=titleCanvas.height;})()')), true, 'Pendulum fits portrait viewport');
    await page.click('#btnGoTutorial'); const tutorialState = await state();
    await page.waitForTimeout(150); assert.equal(await state(), tutorialState); assert.equal(await count(), 0);
    assert.deepEqual(errors, []);
    console.log('Home animation passed: continuous visible motion, stops outside Home, resumes on return, one loop only, and portrait bounds fit.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
