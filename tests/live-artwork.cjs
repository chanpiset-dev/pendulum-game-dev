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
      assert.ok(result.rgba[0]>result.rgba[1]*1.3, 'Current shaded enamel pad has a red bullseye core');
      assert.equal(result.style, 'shaded', 'The current fixed visual theme ignores legacy appearance requests');
    }
    assert.deepEqual(await page.evaluate(() => window.testRun('(()=>{loadStage(196);return [baseGravity,currentGravity]})()')), [0,0], 'Zero gravity survives stage loading');
    await page.evaluate(async () => {
      const { drawGenericScene } = await import('/src/engine/renderer.js');
      const canvas = document.createElement('canvas'); canvas.width=800; canvas.height=600;
      const context=canvas.getContext('2d'), segments=[];
      const move=context.moveTo.bind(context), line=context.lineTo.bind(context);
      let start;
      context.moveTo=(x,y)=>{start=[x,y];move(x,y);};
      context.lineTo=(x,y)=>{segments.push([...start,x,y]);line(x,y);};
      // Unequal speeds/phases put this pivot inside the old ellipse, off its track.
      for (const t of [0,0.7,2,5]) {
        const pivot={x:400+60*Math.sin(t*1.3+0.4),y:300+40*Math.sin(t*0.8)};
        segments.length=0;
        drawGenericScene(context,[],[],[],null,[],[],[],pivot,{ampX:60,ampY:40,speedX:1.3,speedY:0.8,phaseX:0.4},[],[],[],[],[],{BASE_PIVOT:{x:400,y:300}});
        for(const expected of [[310,pivot.y,490,pivot.y],[pivot.x,230,pivot.x,370]]) {
          if(!segments.some(s=>s.every((v,i)=>Math.abs(v-expected[i])<1e-8))) throw new Error('Rail does not pass through moving pivot');
        }
      }
    });
    await page.evaluate(() => window.testRun("$('titleScreen').classList.remove('hidden');$('stageBriefing').classList.add('hidden');setLanguage('en')"));
    await page.click('#btnGoTutorial');
    await page.click('#tutorialGimmicks');
    assert.equal(await page.locator('#gimmickGuide').isVisible(), true);
    assert.equal(await page.locator('.gimmick-card').count(), 24);
    assert.equal(await page.locator('.gimmick-card canvas').count(), 24);
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
    console.log('Live artwork passed: all 250 substages render in both styles without changing physics or saves; bullseyes appear in real stages; 24 illustrated functions, mobile layout, Japanese guide and tutorial loop transitions pass.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
