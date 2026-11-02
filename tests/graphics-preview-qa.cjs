const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 try{
  for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const u=new URL(route.request().url());if(u.hostname!=='game.test')return route.abort();
    const file=path.join(root,u.pathname==='/'?'index.html':u.pathname);
    if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html'))return route.abort();
    return route.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});
   });
   await page.goto('http://game.test');
   await page.waitForFunction(()=>document.querySelector('#gimmickArtworkSkin')!==null);
   assert.equal(await page.locator('#fantasyGimmicksGameplay').isChecked(),false);
   await page.evaluate(()=>document.querySelector('#settingsDialog').showModal());
   await page.locator('#btnArtworkPreview').click();
   await page.waitForFunction(()=>document.querySelectorAll('.fantasy-comparison').length>10);
   assert.ok(await page.locator('.fantasy-comparison canvas').count()>25);
   await page.selectOption('#gimmickPreviewMode','fantasy');
   assert.ok(await page.locator('.fantasy-comparison canvas').count()>10);
   await page.selectOption('#gimmickPreviewMode','legacy');
   await page.locator('#artworkClose').click();
   await page.locator('#fantasyGimmicksGameplay').check();
   assert.equal(await page.locator('#fantasyGimmicksGameplay').isChecked(),true);
   await page.reload();await page.waitForFunction(()=>document.querySelector('#fantasyGimmicksGameplay')!==null);
   assert.equal(await page.locator('#fantasyGimmicksGameplay').isChecked(),false,'temporary only');
   assert.deepEqual(errors,[],name+' runtime errors');
   await context.close();
  }
  console.log('M7 graphics QA desktop/mobile comparison, preview mode, persistent gameplay selector and reload restoration passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
