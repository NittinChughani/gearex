'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const EventEmitter=require('node:events');
const src=fs.readFileSync(path.join(__dirname,'../assets/compiler-service.js'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const widgetConfigSrc=fs.readFileSync(path.join(__dirname,'../assets/compiler-config.js'),'utf8');
class MockSocket extends EventEmitter{
 constructor(onRun){
  super();this.connected=false;this.onRun=onRun;this.runs=[];this.disconnects=0;
 }
 connect(){
  this.connected=true;queueMicrotask(()=>super.emit('connect'));return this;
 }
 disconnect(){
  this.disconnects++;this.connected=false;super.emit('disconnect');return this;
 }
 emit(event,payload){
  if(event==='runcode'){
   this.runs.push(payload);
   queueMicrotask(()=>this.onRun?.(payload,result=>super.emit('codeoutput',result)));
   return true;
  }
  return super.emit(event,payload);
 }
}
function runner(onRun,{key='widget-domain-key',connectionError=false}={}){
 const sockets=[],io=(url,opts)=>{
  assert.equal(url,'https://api.onlinecompiler.io');
  assert.equal(opts.auth.token,key);
  assert.equal(opts.reconnection,false,'Avoid automatic provider changes or repeated runs');
  const sock=new MockSocket(onRun);
  if(connectionError)sock.connect=()=>{queueMicrotask(()=>sock.emit('connect_error',new Error('bad key')));return sock;};
  sockets.push(sock);return sock;
 };
 const window={GearExCompilerConfig:{widgetKey:key},io};
 const sandbox={window,module:{exports:{}},Date,Promise,setTimeout,clearTimeout,console};
 vm.runInNewContext(src,sandbox,{filename:'compiler-service.js'});
 return {compiler:sandbox.module.exports,sockets,window};
}
const response=(output,error='',exit_code=0)=>({output,error,exit_code,status:exit_code?'error':'success',time:'0.12'});
test('single browser execution engine maps all seven languages to installed runtimes',()=>{
 const {compiler}=runner();
 assert.deepEqual(Object.keys(compiler.RUNTIMES).sort(),['c','cpp','py','js','java','cs','sql'].sort());
 const ids={c:'gcc-15',cpp:'g++-15',py:'python-3.14',js:'nodejs-24',java:'openjdk-25',cs:'dotnet-csharp-10',sql:'sqlite-3'};
 for(const [lang,id] of Object.entries(ids))assert.equal(compiler.RUNTIMES[lang],id);
 assert.equal(compiler.RESPONSE_BUDGET_MS,7000);
 assert.ok(!src.includes('wandbox.org')&&!src.includes('ce.judge0.com'),'Remove unreliable open guest compiler endpoints');
});

test('production origins select their own widget keys and unknown origins fail closed',()=>{
 const configFor=origin=>{
  const sandbox={window:{location:{origin}}};
  vm.runInNewContext(widgetConfigSrc,sandbox,{filename:'compiler-config.js'});
  return sandbox.window.GearExCompilerConfig;
 };
 const vercel=configFor('https://gearex.vercel.app');
 const github=configFor('https://nittinchughani.github.io');
 const unknown=configFor('https://unexpected-domain.example');
 const local=configFor('http://localhost:8000');
 assert.equal(typeof vercel.widgetKey,'string');
 assert.match(vercel.widgetKey,/^[a-f0-9]{32}$/);
 assert.match(github.widgetKey,/^[a-f0-9]{32}$/);
 assert.notEqual(vercel.widgetKey,github.widgetKey,'Each domain requires a distinct public widget key');
 assert.equal(unknown.widgetKey,'','Unknown sites must not borrow a production widget key');
 assert.equal(local.widgetKey,'','Localhost must not send requests using production widget keys');
 assert.deepEqual(Object.keys(vercel.widgetKeys).sort(),[
  'https://gearex.vercel.app','https://nittinchughani.github.io'
 ].sort());
 const mockVercel=runner(()=>{}, {key:vercel.widgetKey});
 const mockGithub=runner(()=>{}, {key:github.widgetKey});
 assert.equal(mockVercel.compiler.getWidgetKey(),vercel.widgetKey);
 assert.equal(mockGithub.compiler.getWidgetKey(),github.widgetKey);
});

test('C++ standard library code and input are transmitted unchanged and real stdout appears',async()=>{
 const {compiler,sockets}=runner((payload,reply)=>reply(response('5\n')));
 const program='#include <iostream>\n#include <cmath>\nusing namespace std;\nint main(){int n;cin>>n;cout<<sqrt(n)<<endl;}';
 const result=await compiler.compile(program,'cpp','25\n');
 assert.equal(result.success,true);assert.equal(result.stdout,'5\n');
 assert.equal(result.backend,'OnlineCompiler.io');
 assert.equal(sockets.length,1);
 assert.equal(sockets[0].runs.length,1);
 assert.equal(sockets[0].runs[0].compiler,'g++-15');
 assert.equal(sockets[0].runs[0].code,program);
 assert.equal(sockets[0].runs[0].input,'25\n');
});
test('warmup connects once and subsequent executions reuse same socket',async()=>{
 const {compiler,sockets}=runner((payload,reply)=>reply(response('done\n')));
 assert.equal(await compiler.warmup(),true);
 const a=await compiler.compile('print(1)','py');
 const b=await compiler.compile('print(2)','py');
 assert.equal(a.success,true);assert.equal(b.success,true);
 assert.equal(sockets.length,1);
 assert.equal(sockets[0].runs.length,2);
});
test('a C++ syntax error is shown as code error rather than a service outage',async()=>{
 const {compiler,sockets}=runner((payload,reply)=>reply(response('','main.cpp:3: error: expected ;',1)));
 const r=await compiler.compile('int main(){oops}','cpp');
 assert.equal(r.success,false);
 assert.match(r.output,/expected ;/);
 assert.equal(r.stderr,'main.cpp:3: error: expected ;');
 assert.equal(sockets[0].runs.length,1,'Do not retry bad code');
});
test('provider account limits are service errors, not mistakes in the source',async()=>{
 const {compiler}=runner((payload,reply)=>reply({code:'account_limit',error:'site reached run limit'}));
 await assert.rejects(()=>compiler.compile('print(5)','py'),e=>e.isServiceError&&e.code==='usage_limit');
});
test('refused run is a service issue and must not be treated as successful output',async()=>{
 const {compiler}=runner((payload,reply)=>reply({error:'execution queue unavailable'}));
 await assert.rejects(()=>compiler.compile('print(5)','py'),e=>e.isServiceError&&e.code==='run_rejected');
});
test('missing public widget key refuses to run without pretending to compile',async()=>{
 const {compiler,sockets}=runner(()=>{}, {key:''});
 assert.equal(compiler.isConfigured(),false);
 assert.equal(await compiler.warmup(),false);
 await assert.rejects(()=>compiler.compile('print(1)','py'),e=>e.isServiceError&&e.code==='setup_required');
 assert.equal(sockets.length,0);
});
test('bad widget key reports connection rejection instead of a source error',async()=>{
 const {compiler}=runner(()=>{}, {key:'widget-domain-key',connectionError:true});
 await assert.rejects(()=>compiler.compile('print(1)','py'),e=>e.isServiceError&&e.code==='connection_rejected');
});
test('JavaScript prompt receives input through the Node adapter',async()=>{
 const {compiler,sockets}=runner((payload,reply)=>reply(response('Ada\n')));
 const source="const name=prompt('Name? ');console.log(name);";
 const r=await compiler.compile(source,'js','Ada\n');
 assert.equal(r.stdout,'Ada\n');
 assert.ok(sockets[0].runs[0].code.includes("readFileSync(0,'utf8')"));
 assert.ok(sockets[0].runs[0].code.endsWith(source));
});
test('input prompt planner keeps six language input modes working',()=>{
 const {compiler}=runner(()=>{});
 const cases=[
  ['py',"name=input('Name? ')",['Name? ']],
  ['js',"x=prompt('X?')",['X?']],
  ['c','scanf("%d", &x);',['C scanf: x']],
  ['cpp','std::cin >> x;',['C++ cin: x']],
  ['java','int x=sc.nextInt();',['Java sc.nextInt()']],
  ['cs','var x=Console.ReadLine();',['C# Console.ReadLine()']]
 ];
 for(const [lang,code,expected] of cases)
  assert.deepEqual(Array.from(compiler.findInputRequests(code,lang),i=>i.prompt),expected);
});
test('service budget, original GearEx UI, and explicit provider setup are wired correctly',()=>{
 assert.ok(src.includes('RESPONSE_BUDGET_MS=7000'));
 assert.ok(src.includes("conn.emit('runcode'"));
 assert.ok(src.includes("'codeoutput'"));
 assert.ok(src.includes('socket.disconnect()'));
 assert.ok(!src.includes('fetch('));
 assert.ok(html.includes('assets/compiler-config.js'));
 assert.ok(html.indexOf('assets/compiler-config.js')<html.indexOf('assets/compiler-service.js'));
 assert.ok(html.includes('onlinecompiler.io')&&!html.includes('wandbox.org'));
 assert.ok(app.includes('GearExCompiler.compile(source,lang,stdin'));
 assert.ok(app.includes('Compiler setup pending'));
 assert.ok(app.includes('Compiler response timed out'));
 assert.ok(app.includes('focusCompilerOutput()'),'Compiler should auto-scroll to execution output');
 assert.ok(app.includes("pane:$('#compilerInputWizard')"),'Compiler input wizard should auto-scroll into view');
 assert.ok(src.includes('COLD_RESPONSE_BUDGET_MS=18000'),'First connection must allow cold startup');
 assert.ok(src.includes('tryAllTransports:true'),'Transport fallback must be enabled');
 assert.ok(src.includes('First connection delayed. Trying an alternate connection'),'Only connection retries should be described');
});
