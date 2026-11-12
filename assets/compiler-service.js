/* GearEx Compiler — resilient remote program execution.
 * Actual code runs only in isolated remote compiler services, never in page JS.
 * Judge0 CE is primary; Wandbox is a fallback for service/network failures. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GearExCompiler=api;
})(typeof window!=='undefined'?window:null,function(){
'use strict';
const JUDGE='https://ce.judge0.com';
const WANDBOX='https://wandbox.org/api';
const JUDGE_LANG={c:103,cpp:105,py:109,js:102,java:91,cs:51,sql:82};
const WANDBOX_LANG={c:'C',cpp:'C++',py:'Python',js:'JavaScript',java:'Java',cs:'C#',sql:'SQL'};
const PREFERRED={c:/^(gcc|clang)/i,cpp:/^(gcc|clang)/i,py:/^(cpython|python)-?3/i,js:/^(nodejs|node)-?/i,java:/^(openjdk|java|jdk)/i,cs:/^(dotnet|mono|csharp)/i,sql:/^sqlite3?/i};
const INFRASTRUCTURE=/OCI runtime error|crun: clone|Resource temporarily unavailable|runc (?:create|run) failed|failed to create (?:shim|task|container)|container (?:init|create) failed|failed to start container|service (?:unavailable|temporarily)|system is overloaded/i;
let catalog=null;
const delay=ms=>new Promise(done=>setTimeout(done,ms));
class CompilerServiceError extends Error {
 constructor(message){super(message);this.name='CompilerServiceError';this.transient=true;}
}
function assertLanguage(lang){
  if(!Object.hasOwn(JUDGE_LANG,lang))throw new Error('Unsupported compiler language.');
}
async function jsonRequest(url,options={},timeout=8500){
 const ac=new AbortController();
 const timer=setTimeout(()=>ac.abort(),timeout);
 try{
   const response=await fetch(url,{...options,signal:ac.signal});
   if(!response.ok)throw new CompilerServiceError('HTTP '+response.status+' from '+new URL(url).hostname+'.');
   try{return await response.json();}
   catch{throw new CompilerServiceError('The remote compiler returned an invalid response.');}
 }catch(error){
   if(error instanceof CompilerServiceError)throw error;
   if(error?.name==='AbortError')throw new CompilerServiceError('The compiler service did not respond in time.');
   throw new CompilerServiceError('Could not contact '+new URL(url).hostname+' ('+(error?.message||'network error')+').');
 }finally{clearTimeout(timer);}
}
function normalize(raw){
 const output=String(raw.output||'').trimEnd();
 return {...raw,output:output||'(Program finished without printing output.)'};
}
function systemError(message){
 return INFRASTRUCTURE.test(String(message||''));
}
function judgeResult(result,lang){
 const status=Number(result?.status?.id??result?.status_id??0);
 const stdout=String(result?.stdout||'');
 const stderr=String(result?.stderr||'');
 const compile=String(result?.compile_output||'');
 const message=String(result?.message||'');
 const combined=[compile,stdout,stderr,message].filter(Boolean).join('\n');
 if(systemError(combined))throw new CompilerServiceError('The execution sandbox could not start.');
 if(status<=2||!status)throw new CompilerServiceError('The compiler did not finish its execution.');
 const success=status===3;
 return normalize({success,stdout,stderr,output:combined,compiler:'Judge0 CE',backend:'Judge0',lang,status});
}
async function judge0(source,lang,stdin,onStatus){
 onStatus?.('Starting the '+WANDBOX_LANG[lang]+' runtime…');
 const created=await jsonRequest(JUDGE+'/submissions?base64_encoded=false&wait=false',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({source_code:source,language_id:JUDGE_LANG[lang],stdin:stdin||''})
 },9000);
 if(!created?.token){
   throw new CompilerServiceError('The primary service did not accept this submission.');
 }
 const token=String(created.token);
 if(!/^[\w-]{8,128}$/.test(token))throw new CompilerServiceError('Invalid execution token from the compiler service.');
 for(let n=0;n<13;n++){
   // The first small delay avoids a wasted poll while the queue starts.
   await delay(n===0?380:Math.min(400+n*120,1150));
   const result=await jsonRequest(JUDGE+'/submissions/'+encodeURIComponent(token)+'?base64_encoded=false',{},5000);
   const status=Number(result?.status?.id??result?.status_id??0);
   if(status===1||status===2||status===0){
     if(n===1)onStatus?.('Your code is running…');
     continue;
   }
   return judgeResult(result,lang);
 }
 throw new CompilerServiceError('The primary service was busy for too long.');
}
function chooseWandboxCompilers(list,lang){
 const matches=list.filter(item=>item&&item.language===WANDBOX_LANG[lang]&&typeof item.name==='string');
 const score=item=>{
   const name=item.name||'';
   const version=Number(String(item.version||'').match(/\d+/)?.[0]||0);
   const stable=/head|nightly|trunk|experimental/i.test(name)?-1000:0;
   const pref=PREFERRED[lang].test(name)?500:0;
   return pref+stable+Math.min(version,99);
 };
 return matches.sort((a,b)=>score(b)-score(a));
}
async function wandbox(source,lang,stdin,onStatus){
 onStatus?.('Switching to the backup compiler…');
 if(!catalog){
   const list=await jsonRequest(WANDBOX+'/list.json',{},7500);
   if(!Array.isArray(list))throw new CompilerServiceError('The backup compiler list is unavailable.');
   catalog=list;
 }
 const available=chooseWandboxCompilers(catalog,lang);
 if(!available.length)throw new CompilerServiceError('The backup service has no '+WANDBOX_LANG[lang]+' runtime.');
 // Stable compilers are preferred over experimental HEAD builds.
 let reason='';
 for(const compiler of available.slice(0,2)){
   const raw=await jsonRequest(WANDBOX+'/compile.json',{
     method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({compiler:compiler.name,code:source,stdin:stdin||'',save:false})
   },12000);
   const stdout=String(raw?.program_stdout||'');
   const stderr=String(raw?.program_stderr||'');
   const compile=String(raw?.compiler_message||raw?.compiler_error||'');
   const run=String(raw?.program_message||'');
   const signal=raw?.signal;
   const status=Number(raw?.status??0);
   const output=[compile,run].filter(Boolean).join('\n')||[stdout,stderr].filter(Boolean).join('\n');
   if(systemError(output)){
     reason='The backup compiler sandbox is temporarily exhausted.';
     continue;
   }
   // Never treat a nonzero program status or compiler diagnostics as a service failure.
   return normalize({success:status===0&&!signal&&!raw?.compiler_error,stdout,stderr,
     output,compiler:compiler.name,backend:'Wandbox',lang,status});
 }
 throw new CompilerServiceError(reason||'The backup compiler could not start.');
}
async function compile(source,lang,stdin='',onStatus){
 assertLanguage(lang);
 const code=String(source||'');
 if(!code.trim())throw new Error('Enter source code before running it.');
 const errors=[];
 for(const backend of [judge0,wandbox]){
   try{
     return await backend(code,lang,String(stdin||''),onStatus);
   }catch(error){
     if(!error?.transient)throw error;
     errors.push(error.message);
   }
 }
 throw new CompilerServiceError('Both compiler services are currently unavailable. '+errors.join(' '));
}
return {compile,judgeResult,chooseWandboxCompilers,systemError,JUDGE_LANG,CompilerServiceError};
});
