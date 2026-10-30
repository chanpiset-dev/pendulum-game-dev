// Run with: node tests/progress-browser.cjs (requires Playwright and Chromium).
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const errors = [];
    async function pageFor(seed, denyStorage = false) {
      const page = await browser.newPage();
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(({ seed, denyStorage }) => {
        if (denyStorage) {
          Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });
        } else if (!sessionStorage.getItem('seeded')) {
          for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
          sessionStorage.setItem('seeded', 'true');
        }
        window.requestAnimationFrame = () => 1;
        window.cancelAnimationFrame = () => {};
      }, { seed, denyStorage });
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'game.test') return route.abort();
        const file = path.join(__dirname, '..', url.pathname === '/' ? 'index.html' : url.pathname);
        let body = fs.readFileSync(file, 'utf8');
        if (url.pathname === '/src/main.js') body += '\nwindow.testRun=code=>eval(code);';
        await route.fulfill({ body, contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
      });
      await page.goto('http://game.test');
      await page.waitForFunction(() => window.testRun);
      return page;
    }
    const legacy = await pageFor({
      pendulum_sub_unlocked_v6: '80', pendulum_stage_scores_v6: '{"stage_1_sub_1":1500}',
      pendulum_stage_stars_v6: '{"stage_1_sub_1":3}',
    });
    assert.equal(await legacy.evaluate(() => window.testRun('unlockedStageIndex')), 80);
    await legacy.click('#btnStartGame');
    if (await legacy.locator('#stageBriefing').isVisible()) await legacy.click('#btnDismissBriefing');
    await legacy.click('#btnOpenMap');
    assert.equal(await legacy.locator('#stageGrid .stage-btn').count(), 250);
    assert.match(await legacy.locator('#stageButton_1').innerText(), /1500pts/);
    assert.match(await legacy.locator('#stageButton_1').innerText(), /Time: —/);
    await legacy.click('#btnJumpCurrent');
    assert.equal(await legacy.evaluate(() => document.activeElement.id), 'stageButton_80');
    assert.equal(await legacy.locator('#stageButton_80').getAttribute('aria-current'), 'step');
    await legacy.click('#btnCloseMap');
    await legacy.evaluate(() => window.testRun('loadStage(1);saveData(1,2000,[],3,4.25);saveData(1,1000,[],1,7.5)'));
    assert.match(await legacy.locator('#personalBest').innerText(), /Score: 2000.*Time: 4.25s.*Stars: 3\/3/);
    await legacy.reload();
    await legacy.waitForFunction(() => window.testRun);
    assert.deepEqual(await legacy.evaluate(() => window.testRun('({score:highScores.stage_1_sub_1,time:bestTimes.stage_1_sub_1,stars:stageStars.stage_1_sub_1,unlocked:unlockedStageIndex})')), { score: 2000, time: 4.25, stars: 3, unlocked: 80 });
    await legacy.evaluate(() => window.testRun('loadStage(2);fire();timeElapsed=3.75;targets.forEach(t=>t.alive=false);update(0);update(3.1)'));
    assert.equal(await legacy.evaluate(() => window.testRun('bestTimes.stage_1_sub_2')), 3.75, 'A real completion records elapsed attempt time, excluding the clear animation');
    await legacy.evaluate(() => window.testRun('loadStage(1);saveData(1,1800,[],2,3.5)'));
    assert.equal(await legacy.evaluate(() => window.testRun('bestTimes.stage_1_sub_1')), 3.5);
    await legacy.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'pendulum_stage_ghosts_v6') throw new DOMException('Full', 'QuotaExceededError');
        original.call(this, key, value);
      };
      window.testRun('saveData(80,99999,[{x:1,y:2}],3,5)');
    });
    assert.match(await legacy.locator('#saveStatus').innerText(), /optional replay/);
    assert.equal(await legacy.evaluate(() => localStorage.getItem('pendulum_sub_unlocked_v6')), '81');
    await legacy.reload();
    await legacy.waitForFunction(() => window.testRun);
    assert.equal(await legacy.evaluate(() => window.testRun('unlockedStageIndex')), 81);

    const damaged = await pageFor({ pendulum_lang: 'xx', pendulum_sub_unlocked_v6: 'NaN',
      pendulum_stage_scores_v6: '{"stage_1_sub_1":500,"stage_1_sub_2":"bad"}',
      pendulum_stage_stars_v6: 'null', pendulum_stage_ghosts_v6: '{broken' });
    assert.equal(await damaged.evaluate(() => window.testRun('unlockedStageIndex')), 2);
    assert.equal(await damaged.evaluate(() => window.testRun('highScores.stage_1_sub_1')), 500);
    assert.equal(await damaged.locator('#saveStatus').getAttribute('data-kind'), 'warning');
    await damaged.click('#btnStartGame');
    if (await damaged.locator('#stageBriefing').isVisible()) await damaged.click('#btnDismissBriefing');
    await damaged.click('#btnFire');
    assert.equal(await damaged.locator('#btnPause').isVisible(), true);

    const denied = await pageFor({}, true);
    await denied.click('#btnStartGame');
    if (await denied.locator('#stageBriefing').isVisible()) await denied.click('#btnDismissBriefing');
    await denied.evaluate(() => window.testRun('saveData(1,500,[],2,6)'));
    assert.equal(await denied.evaluate(() => window.testRun('unlockedStageIndex')), 2);
    assert.equal(await denied.locator('#saveStatus').getAttribute('data-kind'), 'error');
    await denied.click('#btnFire');
    assert.equal(await denied.locator('#btnPause').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log('Progress browser checks passed: legacy saves, 250 tiles, jump/focus, independent bests, reload persistence, replay failure, corrupted data and denied storage.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
