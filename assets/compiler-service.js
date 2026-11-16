/* GearEx Compiler — one remote Wandbox execution service.
 * Source is compiled remotely; provider errors are not learner code errors. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GearExCompiler=api;
})(typeof window!=='undefined'?window:null,function(){
'use strict';
const ENDPOINT='https://wandbox.org/api';
const LANGUAGES={c:'C',cpp:'C++',py:'Python',js:'JavaScript',java:'Java',cs:'C#',sql:'SQL'};
const PREF={c:/^(?:gcc|clang)/i,cpp:/^(?:gcc|clang)/i,py:/^(?:cpython|python)-?3/i,js:/^(?:nodejs|node)/i,java:/^(?:openjdk|java|jdk)/i,cs:/^(?:dotnet|mono|csharp)/i,sql:/^sqlite3?/i};
const RUNTIME_ERROR=/OCI runtime error|crun: clone|Resource temporarily unavailable|runc (?:create|run) failed|failed to create (?:shim|task|container)|container (?:init|create) failed|failed to start container|service unavailable|service temporarily unavailable|system is overloaded/i;
const CACHE_KEY='gearex-runtime-catalog-v1';
const CACHE_TTL=24*60*60*1000;
const CATALOG_TIMEOUT_MS=12000;
const EXECUTION_TIMEOUT_MS=45000;
let catalog=null,selection=null,pendingCatalog=null;
class CompilerServiceError extends Error{
 constructor(message){super(message);this.name='CompilerServiceError';this.isServiceError=true;}
}
function findInputRequests(code,lang){
 const src=String(code||''),found=[];
 const push=(index,prompt)=>{
   found.push({index,prompt:String(prompt||'Enter input value').slice(0,100)});
 };
 const scan=(regex,handler)=>{let m;while((m=regex.exec(src))!==null){handler(m);if(found.length>=40)break;}};
 if(lang==='py')scan(/\binput\s*\(\s*(?:"([^"]*)"|'([^']*)')?\s*\)/g,m=>push(m.index,m[1]||m[2]||'Python input()'));
 if(lang==='js')scan(/\bprompt\s*\(\s*(?:"([^"]*)"|'([^']*)')?/g,m=>push(m.index,m[1]||m[2]||'JavaScript prompt()'));
 if(lang==='cs')scan(/\bConsole\.ReadLine\s*\(\s*\)/g,m=>push(m.index,'C# Console.ReadLine()'));
 if(lang==='java')scan(/\b(\w+)\.(nextInt|nextDouble|nextFloat|nextLine|next)\s*\(\s*\)/g,m=>push(m.index,'Java '+m[1]+'.'+m[2]+'()'));
 if(lang==='cpp')scan(/\b(?:std::)?getline\s*\(\s*(?:std::)?cin\s*,\s*(\w+)\s*\)/g,m=>push(m.index,'C++ getline: '+m[1]));
 if(lang==='cpp')scan(/\b(?:std::)?cin\s*>>\s*(\w+(?:\s*>>\s*\w+)*)/g,m=>{
   const names=m[1].split(/\s*>>\s*/);
   names.forEach((name,i)=>push(m.index+i/100,'C++ cin: '+name));
 });
 if(lang==='c')scan(/\bgetchar\s*\(\s*\)/g,m=>push(m.index,'C getchar()'));
 if(lang==='c')scan(/\bscanf\s*\(\s*["']([^"']*)["']\s*,\s*([^)]*)\)/g,m=>{
   const names=m[2].split(',').map(s=>s.trim().replace(/^&/,'')).filter(Boolean);
   names.forEach((name,i)=>push(m.index+i/100,'C scanf: '+name));
 });
 return found.sort((a,b)=>a.index-b.index).slice(0,30).map(({prompt})=>({prompt}));
}
function prepareSource(source,lang){
 const code=String(source||'');
 if(lang!=='js'||!/(\bprompt\s*\()/.test(code))return code;
 // Node-based JavaScript sandboxes have no browser prompt(). Supply a tiny stdin bridge.
 const bridge=String.raw`const __gearexInputLines = require('fs').readFileSync(0,'utf8').split(/\r?\n/);
let __gearexInputIndex = 0;
globalThis.prompt = function(question) {
  if (question != null && String(question)) process.stdout.write(String(question));
  return __gearexInputLines[__gearexInputIndex++] ?? '';
};
`;
 return bridge+'\n'+code;
}
function assertLanguage(lang){
 if(!Object.hasOwn(LANGUAGES,lang))throw new Error('Unsupported compiler language.');
}
function normalize(raw){
 const output=String(raw.output||'').trimEnd();
 return {...raw,output:output||'(Program finished without printing output.)'};
}
function systemError(value){return RUNTIME_ERROR.test(String(value||''));}
async function jsonRequest(url,options={},timeout=CATALOG_TIMEOUT_MS){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{
   const response=await fetch(url,{...options,signal:controller.signal});
   if(!response.ok){
     if(response.status===429)return Promise.reject(new CompilerServiceError('The compiler is busy right now (rate limit).'));
     if(response.status>=500)return Promise.reject(new CompilerServiceError('The compiler server is temporarily unavailable.'));
     throw new CompilerServiceError('The compiler request could not be accepted (HTTP '+response.status+').');
   }
   try{return await response.json();}
   catch{throw new CompilerServiceError('The compiler returned an unreadable response.');}
 }catch(err){
   if(err instanceof CompilerServiceError)throw err;
   if(err?.name==='AbortError')throw new CompilerServiceError('The remote compiler did not respond within '+Math.round(timeout/1000)+' seconds. This is a service timeout, not a code error.');
   throw new CompilerServiceError('The compiler service is unreachable. Check your connection and try again.');
 }finally{clearTimeout(timer);}
}
function chooseCompiler(list,lang){
 const matches=list.filter(item=>item&&item.language===LANGUAGES[lang]&&typeof item.name==='string');
 const score=item=>{
   const name=String(item.name),version=String(item.version||'');
   const stable=/head|nightly|trunk|experimental|snapshot/i.test(name+' '+version)?-1000:0;
   const preferred=PREF[lang].test(name)?500:0;
   const ver=Number(version.match(/\d{1,3}/)?.[0]||0);
   return stable+preferred+Math.min(ver,99);
 };
 return matches.sort((a,b)=>score(b)-score(a))[0]||null;
}
function cachedChoices(){
 if(selection)return selection;
 try{
   const value=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');
   if(value&&Date.now()-Number(value.saved)<CACHE_TTL&&value.names&&typeof value.names==='object'){
     selection=value.names;return selection;
   }
 }catch{/* Storage may be disabled. */}
 return null;
}
function cacheChoices(names){
 selection=names;
 try{localStorage.setItem(CACHE_KEY,JSON.stringify({saved:Date.now(),names}));}
 catch{/* Disabled or full local storage must not break compilation. */}
}
async function discover(){
 if(cachedChoices())return selection;
 if(pendingCatalog)return pendingCatalog;
 pendingCatalog=(async()=>{
   const data=await jsonRequest(ENDPOINT+'/list.json',{},CATALOG_TIMEOUT_MS);
   if(!Array.isArray(data))throw new CompilerServiceError('Compiler language catalog is unavailable.');
   catalog=data;
   const names={};
   for(const lang of Object.keys(LANGUAGES)){
     const chosen=chooseCompiler(data,lang);
     if(chosen)names[lang]=chosen.name;
   }
   cacheChoices(names);
   return names;
 })();
 try{return await pendingCatalog;}
 finally{pendingCatalog=null;}
}
async function warmup(){
 try{await discover();return true;}catch{return false;}
}
async function compile(source,lang,stdin='',onStatus){
 assertLanguage(lang);
 const original=String(source||'');
 if(!original.trim())throw new Error('Enter source code before running it.');
 const prepared=prepareSource(original,lang);
 onStatus?.('Preparing '+LANGUAGES[lang]+'…');
 const names=await discover();
 const compiler=names[lang];
 if(!compiler)throw new CompilerServiceError('This language is not available from the compiler service right now.');
 onStatus?.('Running '+LANGUAGES[lang]+' on Wandbox… First runs may take longer while the remote sandbox starts.');
 const raw=await jsonRequest(ENDPOINT+'/compile.json',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({compiler,code:prepared,stdin:String(stdin||''),save:false})
 },EXECUTION_TIMEOUT_MS);
 if(!raw||typeof raw!=='object')throw new CompilerServiceError('The compiler returned an invalid result.');
 const stdout=String(raw.program_stdout||'');
 const runtimeStderr=String(raw.program_stderr||'');
 const compilerError=String(raw.compiler_error||'');
 const compileNotes=String(raw.compiler_message||'');
 const programNotes=String(raw.program_message||'');
 const status=Number(raw.status??0);
 const signal=String(raw.signal||'');
 const material=[compilerError,compileNotes,programNotes,stdout,runtimeStderr].filter(Boolean).join('\n');
 if(systemError(material)||raw.status===null&&!!raw.error)throw new CompilerServiceError('The compiler sandbox is temporarily unavailable. Your code was not judged.');
 if(raw.error&&typeof raw.error==='string')throw new CompilerServiceError('The compiler server did not complete the request.');
 const printed=programNotes||[stdout,runtimeStderr].filter(Boolean).join('\n');
 const output=[compilerError||compileNotes,printed].filter(Boolean).join('\n');
 const success=status===0&&!signal&&!compilerError;
 return normalize({success,stdout:stdout||(!runtimeStderr?programNotes:''),stderr:runtimeStderr,
   output,compiler,backend:'Wandbox',lang,status});
}
return {compile,warmup,chooseCompiler,systemError,findInputRequests,prepareSource,LANGUAGES,CompilerServiceError};
});
