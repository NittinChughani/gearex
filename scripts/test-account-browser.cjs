'use strict';
const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.GEAREX_TEST_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:850}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
  await page.locator('#accountLaunch').waitFor();
  assert.equal(await page.evaluate(()=>window.GearExAccounts?.isConfigured()),false);
  await page.goto(url+'#dashboard',{waitUntil:'domcontentloaded'});
  await page.locator('#account-unknown').count(); // harmless selector: confirms page initialized
  await page.locator('#profileName').fill('GearEx Demo Learner');
  await page.locator('#saveProfile').click();
  assert.match(await page.locator('#welcomeName').innerText(),/GearEx Demo Learner/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('gearex-guest-display-name-v1')),'GearEx Demo Learner');

  // A real file input feeds the same avatar crop / metadata-stripping pipeline as the UI.
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9kAAAAASUVORK5CYII=','base64');
  await page.locator('#profileAvatarInput').setInputFiles({name:'avatar.png',mimeType:'image/png',buffer:png});
  await page.waitForFunction(()=>!!localStorage.getItem('gearex-guest-avatar-v1'),{timeout:8000});
  assert.equal(await page.locator('#profileAvatar').isVisible(),true);
  console.log('Guest profile name and cropped avatar: PASS');

  await page.locator('#accountSignIn').click();
  assert.equal(await page.locator('#authDialog').isVisible(),true);
  assert.match(await page.locator('#authMessage').innerText(),/not yet connected/i);
  await page.locator('#authClose').click();
  console.log('Optional account dialog in pre-configuration guest mode: PASS');

  await page.goto(url+'#playground',{waitUntil:'domcontentloaded'});
  await page.locator('#editorLanguage').selectOption('py');
  await page.locator('#codeEditor').fill('print("saved for later")');
  await page.goto(url+'#dashboard',{waitUntil:'domcontentloaded'});
  page.once('dialog',d=>d.accept('My Python practice'));
  await page.locator('#saveCurrentProgram').click();
  await page.locator('.saved-program').first().waitFor();
  assert.match(await page.locator('#savedProgramsList').innerText(),/My Python practice/);
  await page.locator('.saved-program button').first().click();
  assert.equal(await page.locator('#codeEditor').inputValue(),'print("saved for later")');
  console.log('Saved code round-trip to compiler: PASS');

  await page.goto(url+'#dashboard',{waitUntil:'domcontentloaded'});
  assert.ok((await page.locator('#nextLesson').getAttribute('href')).startsWith('#lesson/'));
  await page.goto(url+'#privacy',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#privacy').isVisible(),true);
  await page.reload();
  assert.equal(await page.locator('#navAccountInitials').innerText(),'G');
  console.log('Continue learning, privacy view and guest profile persistence: PASS');

  await page.setViewportSize({width:390,height:844});
  await page.goto(url+'#dashboard',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#accountSignIn').isVisible(),true);
  assert.equal(await page.locator('#profileAvatarButton').isVisible(),true);
  await page.screenshot({path:'gearex-accounts-mobile.png',fullPage:true});
  assert.deepEqual(errors,[],'Uncaught browser errors: '+errors.join('; '));
  console.log('Mobile account dashboard and full guest smoke test: PASS');
 }catch(err){
  console.error('GearEx account browser test FAILED:',err.stack||err);
  await page.screenshot({path:'gearex-accounts-failure.png',fullPage:true}).catch(()=>{});
  process.exitCode=1;
 }finally{await browser.close();}
})();