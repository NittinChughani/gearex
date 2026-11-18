/* GearEx original compiler client.
 * Uses the OnlineCompiler.io WebSocket API with a site-scoped public widget key.
 * Never embed a REST API secret. The code editor and UI belong to GearEx.
 * The deadline is a UI response budget, not a guarantee of upstream execution.
 */
(function(root,factory){
 const api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.GearExCompiler=api;
})(typeof window!=='undefined'?window:null,function(root){
'use strict';
const ENDPOINT='https://api.onlinecompiler.io';
const SOCKET_IO_CDN='https://cdn.socket.io/4.8.4/socket.io.min.js';
const SOCKET_IO_INTEGRITY='sha384-fBrXvbDtHoeKWJ/hcA6M+YGueiDW+h45I7V6F2kD1S8bOkrF9rZYPLVkCR6BLR/1';
const LANGUAGES={c:'C',cpp:'C++',py:'Python',js:'JavaScript',java:'Java',cs:'C#',sql:'SQL'};
const RUNTIMES={c:'gcc-15',cpp:'g++-15',py:'python-3.14',js:'nodejs-24',java:'openjdk-25',cs:'dotnet-csharp-10',sql:'sqlite-3'};
const RESPONSE_BUDGET_MS=7000; // warm connection: fast execution feedback
const COLD_RESPONSE_BUDGET_MS=18000; // first visit: allow socket library + network startup
const SOCKET_CONNECT_BUDGET_MS=7200;
let clientPromise=null,socket=null,busy=false,connecting=null;
class CompilerServiceError extends Error{
 constructor(message,code='service_unavailable'){
  super(message);this.name='CompilerServiceError';this.isServiceError=true;this.code=code;
 }
}
function getWidgetKey(){
 const key=root?.GearExCompilerConfig?.widgetKey;
 return typeof key==='string'?key.trim():'';
}
function isConfigured(){return !!getWidgetKey()&&!/^(YOUR_|PASTE_|REPLACE_|EXAMPLE)/i.test(getWidgetKey());}
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
 if(!Object.hasOwn(RUNTIMES,lang))throw new Error('Unsupported compiler language.');
}
function makeTimeout(message,code='response_budget'){
 return new CompilerServiceError(message,code);
}
function loadSocketClient(){
 if(typeof root?.io==='function')return Promise.resolve(root.io);
 if(clientPromise)return clientPromise;
 if(!root?.document)throw new CompilerServiceError('Browser runtime client is unavailable.','client_unavailable');
 clientPromise=new Promise((resolve,reject)=>{
  const script=root.document.createElement('script');
  let settled=false;
  const done=(error,client)=>{
   if(settled)return;settled=true;clearTimeout(timer);
   if(error){script.remove();reject(error);}else resolve(client);
  };
  const timer=setTimeout(()=>done(new CompilerServiceError('Compiler connection library loading took too long.','client_unavailable')),6000);
  script.src=SOCKET_IO_CDN;
  script.async=true;
  script.integrity=SOCKET_IO_INTEGRITY;
  script.crossOrigin='anonymous';
  script.onload=()=>{
   if(typeof root.io==='function')done(null,root.io);
   else done(new CompilerServiceError('Compiler connection library failed to initialize.','client_unavailable'));
  };
  script.onerror=()=>done(new CompilerServiceError('Compiler connection library could not be loaded.','client_unavailable'));
  root.document.head.appendChild(script);
 }).catch(error=>{clientPromise=null;throw error;});
 return clientPromise;
}
function disconnect(){
 if(socket){socket.disconnect();socket=null;}
}
async function ensureSocket(maxWait=SOCKET_CONNECT_BUDGET_MS){
 if(!isConfigured())throw new CompilerServiceError(
  'The site owner has not activated the new compiler yet. Code execution requires a site-scoped WebSocket key.','setup_required');
 if(socket?.connected)return socket;
 const io=await loadSocketClient();
 if(!socket){
  socket=io(ENDPOINT,{
   autoConnect:false,reconnection:false,transports:['websocket','polling'],tryAllTransports:true,
   auth:{token:getWidgetKey()},timeout:maxWait
  });
 }
 const active=socket;
 if(active.connected)return active;
 if(connecting)return connecting;
 connecting=new Promise((resolve,reject)=>{
  let finished=false;
  const cleanup=()=>{clearTimeout(timer);active.off('connect',connected);active.off('connect_error',failed);active.off('disconnect',closed);};
  const done=(error)=>{
   if(finished)return;finished=true;cleanup();
   if(error){disconnect();reject(error);}else resolve(active);
  };
  const connected=()=>done(null);
  const failed=error=>{
   const detail=String(error?.message||'');
   const rejected=/origin|domain|api.?key|invalid|forbidden|unauthori[sz]ed|bad key|authentication/i.test(detail);
   done(new CompilerServiceError(rejected?
     'The compiler provider rejected this site or widget key. The site owner must allow https://gearex.vercel.app in OnlineCompiler.io widget-key settings.':
     'Could not establish a compiler connection. Please check your network and retry.',
     rejected?'connection_rejected':'connection_lost'));
  };
  const closed=()=>done(new CompilerServiceError('Compiler connection closed before execution.','connection_lost'));
  const timer=setTimeout(()=>done(makeTimeout('Unable to connect to the compiler within the time limit.','connect_timeout')),maxWait);
  active.once('connect',connected);
  active.once('connect_error',failed);
  active.once('disconnect',closed);
  active.connect();
 }).finally(()=>{connecting=null;});
 return connecting;
}
async function warmup(){
 if(!isConfigured())return false;
 try{await ensureSocket();return true;}catch{return false;}
}
function parseExecution(result,lang){
 if(!result||typeof result!=='object')throw new CompilerServiceError('Compiler returned an unreadable response.','invalid_result');
 if(result.code==='account_limit')throw new CompilerServiceError('The compiler site has reached its run limit.','usage_limit');
 if(result.exit_code===undefined||result.exit_code===null){
  throw new CompilerServiceError('Compiler did not accept this run. '+String(result.error||'Try again later.').slice(0,160),'run_rejected');
 }
 const stdout=String(result.output||'');
 const stderr=String(result.error||'');
 const exitCode=Number(result.exit_code);
 const output=[stdout,stderr].filter(Boolean).join(stdout&&stderr&&!stdout.endsWith('\n')?'\n':'')||'(Program finished without printing output.)';
 return {success:exitCode===0,stdout,stderr,output:output.slice(0,20000),
  backend:'OnlineCompiler.io',compiler:RUNTIMES[lang],lang,status:exitCode};
}
async function compile(source,lang,stdin='',onStatus){
 assertLanguage(lang);
 const original=String(source||'');
 if(!original.trim())throw new Error('Enter source code before running it.');
 if(original.length>24000||String(stdin||'').length>4000)throw new Error('Source or stdin is too long.');
 if(busy)throw new CompilerServiceError('A program is already running.','run_in_progress');
 if(!isConfigured())throw new CompilerServiceError(
  'Compiler activation pending. The site owner needs to add the public, domain-restricted widget key.','setup_required');
 busy=true;
 const started=Date.now(),wasWarm=!!socket?.connected,deadline=started+(wasWarm?RESPONSE_BUDGET_MS:COLD_RESPONSE_BUDGET_MS);
 try{
  onStatus?.('Connecting to the code runner…');
  let conn;
  for(let attempt=0;attempt<2;attempt++){
   try{
    conn=await ensureSocket(Math.min(SOCKET_CONNECT_BUDGET_MS,Math.max(1,deadline-Date.now()-1000)));
    break;
   }catch(error){
    // Retry only the handshake, never an already-submitted program: no duplicate runs.
    const transient=error?.code==='connect_timeout'||error?.code==='connection_lost';
    if(!transient||attempt===1||deadline-Date.now()<4000)throw error;
    onStatus?.('First connection delayed. Trying an alternate connection…');
   }
  }
  const remaining=Math.min(RESPONSE_BUDGET_MS,deadline-Date.now());
  if(!conn||remaining<=0)throw makeTimeout('Compiler connection took too long. Please try again.');
  onStatus?.('Running '+LANGUAGES[lang]+'…');
  return await new Promise((resolve,reject)=>{
   let settled=false;
   const clean=()=>{clearTimeout(timer);conn.off('codeoutput',onResult);conn.off('disconnect',onDisconnect);conn.off('connect_error',onDisconnect);};
   const done=(error,value)=>{if(settled)return;settled=true;clean();if(error)reject(error);else resolve(value);};
   const onResult=result=>{
    try{done(null,parseExecution(result,lang));}catch(error){done(error);}
   };
   const onDisconnect=()=>done(new CompilerServiceError('Connection to the compiler was interrupted.','connection_lost'));
   const timer=setTimeout(()=>{
    disconnect();done(makeTimeout('The compiler did not return a result in time. The execution provider may be busy; your code has not been judged.'));
   },remaining);
   conn.once('codeoutput',onResult);
   conn.once('disconnect',onDisconnect);
   conn.once('connect_error',onDisconnect);
   try{conn.emit('runcode',{compiler:RUNTIMES[lang],code:prepareSource(original,lang),input:String(stdin||'')});}
   catch(error){done(new CompilerServiceError('Could not submit this program to the compiler.','submission_error'));}
  });
 }finally{busy=false;}
}
// Open the connection quietly after page load so a learner's first Run is usually warm.
if(root?.addEventListener)root.addEventListener('load',()=>{
 setTimeout(()=>{if(isConfigured()&&!busy)warmup();},850);
},{once:true});
return {compile,warmup,disconnect,getWidgetKey,isConfigured,parseExecution,
 findInputRequests,prepareSource,RUNTIMES,LANGUAGES,RESPONSE_BUDGET_MS,CompilerServiceError};
});
