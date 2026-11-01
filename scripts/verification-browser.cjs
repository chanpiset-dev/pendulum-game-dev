const fs=require('node:fs');const path=require('node:path');const {chromium}=require('playwright');
const root=path.join(__dirname,'..');
async function openVerification(){
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage();
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());if(url.hostname!=='game.test')return route.abort();
  const file=path.resolve(root,'.'+(url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname));
  if(!file.startsWith(root+path.sep))return route.abort();
  return route.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html'});
 });
 await page.goto('http://game.test/?verification=1');await page.waitForFunction(()=>window.verificationAPI);
 return {browser,page};
}
module.exports={openVerification,root};
