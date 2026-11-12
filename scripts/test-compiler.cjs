'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/compiler-service.js'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
function mockRunner(fetcher){
  const sandbox={
    module:{exports:{}},fetch:fetcher,
    setTimeout,clearTimeout,AbortController,URL,Promise,console
  };
  vm.runInNewContext(source,sandbox,{filename:'compiler-service.js'});
  return sandbox.module.exports;
}
const response=(data,status=200)=>({ok:status>=200&&status<300,status,json:async()=>data});
const OCI='OCI runtime error: crun: clone: Resource temporarily unavailable';
test('Judge0 language IDs cover every GearEx course language',()=>{
 const c=mockRunner(async()=>{throw Error('No network in this test');});
 assert.deepEqual(Object.keys(c.JUDGE_LANG).sort(),['c','cpp','cs','java','js','py','sql'].sort());
 assert.equal(c.JUDGE_LANG.c,103);
 assert.equal(c.JUDGE_LANG.cpp,105);
 assert.equal(c.JUDGE_LANG.sql,82);
});
test('normal successful run returns actual stdout from correct language',async()=>{
 const calls=[],c=mockRunner(async(url,options)=>{
   calls.push({url,options});
   if(url.includes('/submissions?'))return response({token:'test-12345'});
   if(url.includes('/submissions/test-12345'))return response({status:{id:3,description:'Accepted'},stdout:'Hello, GearEx!\n'});
   throw Error('Unexpected request '+url);
 });
 const result=await c.compile('print("Hello, GearEx!")','py','');
 assert.equal(result.success,true);
 assert.equal(result.backend,'Judge0');
 assert.equal(result.stdout,'Hello, GearEx!\n');
 assert.equal(JSON.parse(calls[0].options.body).language_id,109);
 assert.equal(calls.length,2,'A quick success must not invoke a backup service');
});
test('compilation error stays a compilation error; no spurious backup execution',async()=>{
 const calls=[],c=mockRunner(async(url)=>{
   calls.push(url);
   if(url.includes('submissions?'))return response({token:'compile-error-123'});
   return response({status:{id:6,description:'Compilation Error'},compile_output:'expected ; near x'});
 });
 const result=await c.compile('int main() { oops }','cpp','');
 assert.equal(result.success,false);
 assert.match(result.output,/expected ;/);
 assert.equal(result.backend,'Judge0');
 assert.equal(calls.length,2);
});
test('OCI container startup failure automatically switches to backup, preserves stdout',async()=>{
 const calls=[],c=mockRunner(async(url,options={})=>{
   calls.push(url);
   if(url.includes('submissions?'))return response({token:'resource-failed-123'});
   if(url.includes('submissions/resource-failed-123'))return response({status:{id:13,description:'Internal Error'},stderr:OCI});
   if(url.includes('list.json'))return response([
     {language:'C++',name:'gcc-head',version:'99'},
     {language:'C++',name:'gcc-14.1',version:'14.1'}
   ]);
   if(url.includes('compile.json')){
     assert.equal(JSON.parse(options.body).compiler,'gcc-14.1','Prefer stable compiler');
     return response({status:0,program_stdout:'Recovered output\n',program_message:'Recovered output\n'});
   }
   throw Error('Unknown request '+url);
 });
 const r=await c.compile('#include <iostream>\nint main(){std::cout<<"Recovered output";}','cpp','');
 assert.equal(r.success,true);assert.equal(r.backend,'Wandbox');assert.equal(r.stdout,'Recovered output\n');
 assert.ok(calls.some(url=>url.includes('list.json')));
});
test('network error on first backend triggers backup and uses stdin',async()=>{
 let requestedInput='';
 const c=mockRunner(async(url,options={})=>{
   if(url.includes('ce.judge0.com'))throw Error('Blocked or offline');
   if(url.includes('list.json'))return response([{language:'Python',name:'cpython-3.13',version:'3.13'}]);
   requestedInput=JSON.parse(options.body).stdin;
   return response({status:0,program_stdout:'Input: 42\n',program_message:'Input: 42\n'});
 });
 const r=await c.compile('print(input())','py','42');
 assert.equal(r.backend,'Wandbox');assert.equal(requestedInput,'42');assert.equal(r.success,true);
});
test('both remote services unavailable never invents successful output',async()=>{
 const c=mockRunner(async()=>{throw Error('Network offline');});
 await assert.rejects(()=>c.compile('print("Hi")','py',''),/Both compiler services are currently unavailable/);
});
test('infrastructure errors are recognized but ordinary user errors are not',()=>{
 const c=mockRunner(()=>{});
 assert.ok(c.systemError(OCI));
 assert.equal(c.systemError('error: expected semicolon before return'),false);
 assert.equal(c.systemError('TypeError: x is not defined'),false);
});
test('GearEx UI actually calls dual executor after language detection',()=>{
 assert.match(app,/GearExEngine\?\.detect\(source,lang\)/);
 assert.match(app,/GearExCompiler\.compile\(source,lang,stdin/);
 assert.match(app,/Detected /);
 assert.ok(!app.includes("https://wandbox.org/api/compile.json"));
});
