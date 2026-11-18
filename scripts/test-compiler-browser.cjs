'use strict';
// Deployed-site browser smoke test. Executes actual programs through GearEx's own UI.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.GEAREX_BROWSER_URL||'https://gearex.vercel.app/#playground';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const browser=await chromium.launch({headless:true});
 const errors=[];
 const page=await browser.newPage({viewport:{width:1280,height:900},locale:'en-US'});
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
  await page.locator('#codeEditor').waitFor({timeout:12000});
  assert.equal(await page.locator('#runCode').isVisible(),true,'Compiler Run button not visible');
  assert.equal(await page.evaluate(()=>window.GearExCompiler?.isConfigured()),true,'Public widget key not loaded');

  const run=async({label,lang,code,input='',wantSuccess,expectedOutput})=>{
   await page.locator('#editorLanguage').selectOption(lang);
   await page.locator('#codeEditor').fill(code);
   await page.locator('#stdinInput').fill(input);
   const started=Date.now();
   await page.locator('#runCode').click();
   await page.locator('#runResult '+(wantSuccess?'.run-success':'.run-error'))
     .waitFor({state:'visible',timeout:22000});
   const elapsed=Date.now()-started;
   const out=await page.locator('#compilerOutput').innerText();
   assert.ok(expectedOutput.test(out),label+' output incorrect: '+out.slice(0,750));
   assert.ok(!/temporarily unavailable|setup pending|service delay/i.test(out),
     label+' resulted in service error: '+out.slice(0,750));
   assert.ok(elapsed<=20000,label+' took longer than cold-start limit: '+elapsed+'ms');
   console.log(label+' browser check: '+elapsed+'ms, '+(wantSuccess?'output':'expected compiler error')+
     ', excerpt='+JSON.stringify(out.slice(0,120)));
  };

  await run({label:'C++ includes, namespace and stdin',lang:'cpp',
   code:'#include <iostream>\n#include <cmath>\nusing namespace std;\nint main(){int n;cin>>n;cout<<sqrt(n)<<endl;}',
   input:'25\n',wantSuccess:true,expectedOutput:/5/});
  await sleep(1250);
  await run({label:'C++ syntax diagnostics',lang:'cpp',
   code:'#include <iostream>\nint main(){int x = ; std::cout<<x;}',
   wantSuccess:false,expectedOutput:/error|expected/i});
  await sleep(1250);
  await run({label:'Python output',lang:'py',
   code:'print(42)',wantSuccess:true,expectedOutput:/42/});

  // Guided input appears on-demand and is highlighted instead of staying below the fold.
  await page.locator('#editorLanguage').selectOption('cpp');
  await page.locator('#codeEditor').fill('#include <iostream>\nint main(){int n;std::cin>>n;std::cout<<n;}');
  await page.locator('#stdinInput').fill('');
  await page.locator('#runCode').click();
  await page.locator('#compilerInputWizard').waitFor({state:'visible',timeout:4000});
  await page.waitForFunction(()=>document.getElementById('compilerInputWizard')?.classList.contains('gearex-spotlight'));
  await page.locator('#compilerInputValue').fill('17');
  await page.locator('#compilerInputWizard button[type="submit"]').click();
  await page.locator('#runResult .run-success').waitFor({state:'visible',timeout:22000});
  assert.match(await page.locator('#compilerOutput').innerText(),/17/);
  assert.deepEqual(errors,[],'Unexpected JS errors: '+errors.join('; '));
  await page.screenshot({path:'gear-compiler-browser.png'});
  console.log('Deployed GearEx browser smoke tests PASS');
 }catch(err){
  console.error('Deployed GearEx browser smoke tests FAILED:',err.message);
  await page.screenshot({path:'gear-compiler-browser-failure.png'}).catch(()=>{});
  process.exitCode=1;
 }finally{await browser.close();}
})();
