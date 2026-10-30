const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => { let id=0; window.testFrames=new Map(); window.requestAnimationFrame=fn=>{window.testFrames.set(++id,fn);return id;}; window.cancelAnimationFrame=id=>window.testFrames.delete(id); });
    await page.route('**/*', route => {
      const u = new URL(route.request().url()); if (u.hostname !== 'game.test') return route.abort();
      const file = path.join(__dirname, '..', u.pathname === '/' ? 'index.html' : u.pathname);
      let body = fs.readFileSync(file, 'utf8'); if (u.pathname === '/src/main.js') body += '\nwindow.testRun=code=>eval(code);';
      return route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    });
    await page.goto('http://game.test'); await page.waitForFunction(() => window.testRun);
    for (const theme of ['neon-arcade', 'clean-precision']) {
      const result = await page.evaluate(theme => window.testRun(`(()=>{
        appearance.set(${JSON.stringify(theme)}, 'dark');
        const snapshot=()=>JSON.stringify({systems,targets,obstacles,blackhole,currentPortals,currentSwitches,currentBoostRings,currentZones,currentLasers,currentRail,PIVOT,timeElapsed,pulsesLeft,highScores,stageStars});
        for(let stage=1;stage<=250;stage++){
          loadStage(stage); const before=snapshot(), saved=JSON.stringify(localStorage); draw();
          if(snapshot()!==before || JSON.stringify(localStorage)!==saved) throw new Error('Drawing mutated stage '+stage);
        }
        loadStage(1); draw();
        const target=targets.find(t=>!t.isBomb), rgba=Array.from(ctx.getImageData(Math.round(target.x),Math.round(target.y),1,1).data);
        return {rgba,style:artworkStyleForTheme(getCanvasPalette().theme)};
      })()`), theme);
      assert.ok(result.rgba.slice(0,3).every(v=>v>190), 'Live targets now have white bullseye centers');
      assert.equal(result.style, theme === 'neon-arcade' ? 'pixel' : 'vector');
    }
    await page.evaluate(() => window.testRun("$('titleScreen').classList.remove('hidden');$('stageBriefing').classList.add('hidden');setLanguage('en')"));
    await page.click('#btnGoTutorial');
    await page.click('#tutorialGimmicks');
    assert.equal(await page.locator('#gimmickGuide').isVisible(), true);
    assert.equal(await page.locator('.gimmick-card').count(), 25);
    assert.equal(await page.locator('.gimmick-card canvas').count(), 25);
    assert.equal(await page.locator('.gimmick-card p').evaluateAll(nodes => nodes.every(n=>n.textContent.length>30)), true);
    assert.match(await page.locator('[data-gimmick="bomb"] p').innerText(), /clears nearby targets/);
    assert.match(await page.locator('[data-gimmick="switch"] p').innerText(), /temporarily/);
    assert.equal(await page.evaluate(() => window.testRun('tutAnimId')), null, 'Guide pauses the animated tutorial');
    assert.equal(await page.locator('#gimmickGuide').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    const guideBounds = await page.locator('#gimmickGuide').boundingBox();
    assert.ok(guideBounds.x >= 0 && guideBounds.x + guideBounds.width <= 390);
    await page.click('#gimmickBack');
    assert.equal(await page.locator('#gimmickGuide').isVisible(), false);
    assert.notEqual(await page.evaluate(() => window.testRun('tutAnimId')), null, 'Returning restarts one tutorial loop');
    await page.evaluate(() => window.testRun("setLanguage('ja')"));
    await page.click('#tutorialGimmicks');
    assert.equal(await page.locator('#gimmickGuideTitle').innerText(), '仕掛けガイド');
    assert.match(await page.locator('[data-gimmick="blackhole"] p').innerText(), /引力/);
    assert.equal(await page.locator('.gimmick-card canvas').first().getAttribute('aria-label'), '振り子');
    assert.deepEqual(errors, []);
    console.log('Live artwork passed: all 250 substages render in both styles without changing physics or saves; bullseyes appear in real stages; 25 illustrated functions, mobile layout, Japanese guide and tutorial loop transitions pass.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
