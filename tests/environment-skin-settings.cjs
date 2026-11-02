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
   await page.waitForFunction(()=>document.querySelector('#environmentArtworkSkin')!==null);
   assert.equal(await page.locator('#environmentArtworkSkin').inputValue(),'legacy');
   await page.evaluate(()=>document.querySelector('#settingsDialog').showModal());
   await page.locator('#btnEnvironmentPreview').click();
   await page.waitForFunction(()=>document.querySelectorAll('#environmentPreviewGallery canvas').length===12);
   const canvases=page.locator('#environmentPreviewGallery canvas');
   assert.equal(await canvases.count(),12);
   const snapshots=await page.evaluate(()=>[...document.querySelectorAll('#environmentPreviewGallery canvas')].map(c=>c.toDataURL()));
   for(let i=0;i<6;i++)assert.notEqual(snapshots[2*i],snapshots[2*i+1],'original and fantasy differ '+i);
   await page.selectOption('#environmentPreviewMode','fantasy');
   assert.equal(await canvases.count(),6);
   await page.selectOption('#environmentPreviewMode','legacy');
   assert.equal(await canvases.count(),6);
   await page.locator('#environmentPreviewClose').click();
   await page.selectOption('#environmentArtworkSkin','fantasy');
   assert.equal(await page.evaluate(()=>localStorage.getItem('pendulum.environment.skin.v1')),'fantasy');
   await page.reload();
   await page.waitForFunction(()=>document.querySelector('#environmentArtworkSkin')!==null);
   assert.equal(await page.locator('#environmentArtworkSkin').inputValue(),'fantasy');
   await page.evaluate(()=>document.querySelector('#settingsDialog').showModal());
   await page.selectOption('#environmentArtworkSkin','legacy');
   assert.equal(await page.evaluate(()=>localStorage.getItem('pendulum.environment.skin.v1')),'legacy');
   assert.deepEqual(errors,[],name+' page errors');
   await context.close();
  }
  console.log('M8 Phase 2 six-world actual-renderer comparison, mobile/desktop, pixel differences, preference persistence and fallback passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
