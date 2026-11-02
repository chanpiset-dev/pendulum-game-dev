const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 try {
  for(const [label,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const context=await browser.newContext({viewport:{width,height}});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const u=new URL(route.request().url());if(u.hostname!=='game.test')return route.abort();
    const file=path.join(root,u.pathname==='/'?'index.html':u.pathname);
    if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html'))return route.abort();
    return route.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});
   });
   await page.goto('http://game.test');await page.waitForFunction(()=>document.querySelector('#explorerSkin')?.value==='legacy');
   const initial=await page.evaluate(()=>localStorage.getItem('pendulum.explorer.skin.v1'));
   assert.equal(initial,null);
   await page.evaluate(()=>document.querySelector('#settingsDialog').showModal());
   await page.selectOption('#explorerSkin','fantasy-explorer');
   await page.selectOption('#explorerPreviewState','celebration');
   await page.waitForTimeout(80);
   assert.equal(await page.evaluate(()=>localStorage.getItem('pendulum.explorer.skin.v1')),'fantasy-explorer');
   assert.ok(await page.evaluate(()=>document.querySelector('#explorerSkinPreview').getContext('2d').getImageData(160,60,1,1).data[3]>0));
   await page.evaluate(()=>document.querySelector('#settingsDialog').close());
   await page.reload();await page.waitForFunction(()=>document.querySelector('#explorerSkin')?.value==='fantasy-explorer');
   assert.equal(await page.locator('#explorerSkin').inputValue(),'fantasy-explorer');
   await page.evaluate(()=>document.querySelector('#settingsDialog').showModal());
   for(const state of ['idle','swinging','impact','celebration'])await page.selectOption('#explorerPreviewState',state);
   await page.selectOption('#explorerSkin','legacy');
   assert.equal(await page.evaluate(()=>localStorage.getItem('pendulum.explorer.skin.v1')),'legacy');
   assert.deepEqual(errors,[],label+' runtime errors');
   await context.close();
  }
  console.log('M6 Phase 2 desktop/mobile preview, four states, persistent selection and legacy default passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
