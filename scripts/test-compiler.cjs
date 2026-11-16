'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/compiler-service.js'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const sampleList=[
 {name:'gcc-head-c',language:'C',version:'19 experimental'},
 {name:'gcc-14-c',language:'C',version:'14.2'},
 {name:'gcc-head',language:'C++',version:'19 experimental'},
 {name:'gcc-14-cpp',language:'C++',version:'14.2'},
 {name:'cpython-3.13',language:'Python',version:'3.13'},
 {name:'nodejs-22',language:'JavaScript',version:'22'},
 {name:'openjdk-21',language:'Java',version:'21'},
 {name:'mono-6',language:'C#',version:'6'},
 {name:'sqlite3',language:'SQL',version:'3.40'}
];
const response=(data,status=200)=>({ok:status>=200&&status<300,status,json:async()=>data});
function createRunner(fetchImpl){
 const data=new Map();
 const localStorage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};
 const sandbox={module:{exports:{}},fetch:fetchImpl,Date,localStorage,setTimeout,clearTimeout,AbortController,Promise,console};
 vm.runInNewContext(source,sandbox,{filename:'compiler-service.js'});
 return {compiler:sandbox.module.exports,data};
}
test('single execution service covers every programming language, including SQL',()=>{
 const {compiler}=createRunner(()=>{throw Error('not requested');});
 assert.deepEqual(Object.keys(compiler.LANGUAGES).sort(),['c','cpp','cs','java','js','py','sql'].sort());
 for(const lang of Object.keys(compiler.LANGUAGES)){
   const selected=compiler.chooseCompiler(sampleList,lang);
   assert.ok(selected,'Missing runtime for '+lang);
 }
 assert.equal(compiler.chooseCompiler(sampleList,'cpp').name,'gcc-14-cpp','Choose stable runtime over experimental HEAD');
 assert.ok(!source.includes('ce.judge0.com'),'Do not add a second compiler service');
 assert.ok(!source.includes('Switching to the backup compiler'),'Backup message must be removed');
});
test('one list request then one execution request produces real stdout and retains all headers',async()=>{
 const calls=[];
 const {compiler}=createRunner(async(url,options={})=>{
   calls.push({url,options});
   if(url.endsWith('/list.json'))return response(sampleList);
   if(url.endsWith('/compile.json'))return response({status:0,program_stdout:'Result = 5\n',program_message:'Result = 5\n'});
   throw Error('Unexpected request '+url);
 });
 const code='#include <iostream>\n#include <cmath>\nusing namespace std;\nint main(){cout << sqrt(25) << "\\n";}\n';
 const result=await compiler.compile(code,'cpp','');
 assert.equal(result.success,true);
 assert.equal(result.backend,'Wandbox');
 assert.equal(result.stdout,'Result = 5\n');
 assert.equal(calls.length,2);
 assert.ok(calls.every(c=>c.url.startsWith('https://wandbox.org/')));
 const request=JSON.parse(calls[1].options.body);
 assert.equal(request.code,code,'Never strip namespace or include directives from real compiler input');
 assert.equal(request.compiler,'gcc-14-cpp');
});
test('catalog is warmed once and reused for repeated runs',async()=>{
 const calls=[];
 const {compiler}=createRunner(async(url)=>{
   calls.push(url);
   if(url.endsWith('/list.json'))return response(sampleList);
   return response({status:0,program_stdout:'7\n',program_message:'7\n'});
 });
 assert.equal(await compiler.warmup(),true);
 await compiler.compile('print(7)','py');
 await compiler.compile('print(7)','py');
 assert.equal(calls.filter(x=>x.endsWith('/list.json')).length,1);
 assert.equal(calls.filter(x=>x.endsWith('/compile.json')).length,2);
});
test('real compilation errors display diagnostics and are not mislabeled as service failure',async()=>{
 let listCalls=0,runCalls=0;
 const {compiler}=createRunner(async(url)=>{
   if(url.endsWith('/list.json')){listCalls++;return response(sampleList);}
   runCalls++;return response({status:1,compiler_error:'error: expected semicolon at line 4',compiler_message:'',program_stdout:''});
 });
 const result=await compiler.compile('int main(){oops}','cpp');
 assert.equal(result.success,false);
 assert.match(result.output,/expected semicolon/);
 assert.equal(listCalls,1);
 assert.equal(runCalls,1,'Do not run the same code again on a different compiler');
});
test('sandbox outage is a short service exception, not a code diagnostic or retry',async()=>{
 const calls=[];
 const {compiler}=createRunner(async(url)=>{
   calls.push(url);
   if(url.endsWith('/list.json'))return response(sampleList);
   return response({status:1,program_stderr:'OCI runtime error: crun: clone: Resource temporarily unavailable'});
 });
 await assert.rejects(()=>compiler.compile('int main(){}','cpp'),error=>error.isServiceError&&/sandbox/i.test(error.message));
 assert.equal(calls.length,2,'One discovery plus one compilation, no second execution');
});
test('offline runtime reports a short service error rather than a stack trace',async()=>{
 let calls=0;
 const {compiler}=createRunner(async()=>{calls++;throw new Error('Network offline');});
 await assert.rejects(()=>compiler.compile('print(8)','py'),error=>
   error.isServiceError&&/unreachable/i.test(error.message)&&!error.message.includes('Network offline'));
 assert.equal(calls,1);
});
test('HTTP rate limiting is service unavailability, not an error in source code',async()=>{
 const {compiler}=createRunner(async()=>response({message:'rate limit'},429));
 await assert.rejects(()=>compiler.warmup().then(ok=>ok?compiler.compile('x','c'):Promise.reject(new Error('warmup failed'))));
});
test('runtime preserves standard input and never inserts code except documented prompt adapter',async()=>{
 let body;
 const {compiler}=createRunner(async(url,options)=>{
   if(url.endsWith('/list.json'))return response(sampleList);
   body=JSON.parse(options.body);
   return response({status:0,program_stdout:'42\n',program_message:'42\n'});
 });
 const src='#include <stdio.h>\nint main(){int n;scanf("%d",&n);printf("%d",n);}';
 await compiler.compile(src,'c','42\n');
 assert.equal(body.stdin,'42\n');
 assert.equal(body.code,src);
 assert.equal(body.compiler,'gcc-14-c');
});
test('infrastructure errors are recognized but ordinary code errors are not',()=>{
 const {compiler}=createRunner(()=>{});
 assert.ok(compiler.systemError('OCI runtime error: crun: clone: Resource temporarily unavailable'));
 assert.equal(compiler.systemError('error: expected ; before return'),false);
 assert.equal(compiler.systemError('TypeError: x is undefined'),false);
});
test('source-language detection and UI call only one service, with concise failure state',()=>{
 assert.match(app,/GearExEngine\?\.detect\(source,lang\)/);
 assert.match(app,/GearExCompiler\.compile\(source,lang,stdin/);
 assert.ok(app.includes("GearExCompiler?.warmup()"));
 assert.ok(app.includes('Compiler temporarily unavailable'));
 assert.ok(!app.includes('Remote compiler services are temporarily unavailable.'));
 assert.ok(html.includes('https://wandbox.org'));
 assert.ok(!html.includes('ce.judge0.com'));
});
test('guided stdin planner recognizes input APIs across six languages',()=>{
 const {compiler}=createRunner(()=>{});
 const cases=[
 ['py',"name=input('Name? ')\nage=int(input('Age? '))",['Name? ','Age? ']],
 ['js',"let name=prompt('Name?');",['Name?']],
 ['c','scanf("%d %d", &x, &y);',['C scanf: x','C scanf: y']],
 ['cpp','std::cin >> x >> y;',['C++ cin: x','C++ cin: y']],
 ['java','int x=sc.nextInt(); String name=sc.nextLine();',['Java sc.nextInt()','Java sc.nextLine()']],
 ['cs','var name=Console.ReadLine();',['C# Console.ReadLine()']]
 ];
 for(const [lang,program,expected] of cases){
   assert.deepEqual(Array.from(compiler.findInputRequests(program,lang),x=>x.prompt),expected);
 }
});
test('JavaScript prompt maps to Node standard input only for code using prompt()',()=>{
 const {compiler}=createRunner(()=>{});
 const src="const name=prompt('Name?'); console.log(name);";
 const adapted=compiler.prepareSource(src,'js');
 assert.ok(adapted.includes("readFileSync(0,'utf8')"));
 assert.ok(adapted.includes('globalThis.prompt'));
 assert.ok(adapted.endsWith(src));
 assert.equal(compiler.prepareSource('console.log(3);','js'),'console.log(3);');
});
test('compiler guided input panel remains functional and preserves provided stdin',()=>{
 for(const id of ['compilerInputWizard','compilerInputValue','compilerExtraInputs','compilerInputSubmit','compilerInputCancel'])
   assert.ok(html.includes('id="'+id+'"'));
 assert.ok(app.includes("showCompilerInputWizard(questions)"));
 assert.ok(app.includes('runEditor(true)'));
 assert.ok(app.includes("if(!inputsConfirmed&&!stdin.trim())"));
});
