'use strict';
// Live provider smoke test for GearEx's public OnlineCompiler.io widget key.
// Run only with the permission of the site owner; never log the widget token.
const {io}=require('socket.io-client');
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const origin=process.env.GEAREX_TEST_ORIGIN||'https://gearex.vercel.app';
assert.ok(/^https:\/\/[^/]+$/.test(origin),'Use an HTTPS origin, without a path');
const config=fs.readFileSync('assets/compiler-config.js','utf8');
const sandbox={window:{location:{origin}}};
vm.runInNewContext(config,sandbox,{filename:'compiler-config.js'});
const key=sandbox.window.GearExCompilerConfig?.widgetKey;
assert.ok(key&&key.length>20,'No public widget key configured for '+origin);
const socket=io('https://api.onlinecompiler.io',{
 transports:['websocket','polling'],tryAllTransports:true,auth:{token:key},reconnection:false,timeout:9000,
 extraHeaders:{Origin:origin}
});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function connect(){
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('connect exceeded 10 seconds for '+origin)),10000);
  socket.once('connect',()=>{clearTimeout(timer);resolve()});
  socket.once('connect_error',err=>{clearTimeout(timer);reject(new Error('connection refused: '+err.message))});
 });
}
function run(label,compiler,code,input,expectedSuccess,pattern){
 return new Promise((resolve,reject)=>{
  const start=Date.now();
  let done=false;
  const finish=(err,value)=>{
   if(done)return;done=true;clearTimeout(timer);socket.off('codeoutput',receive);
   err?reject(err):resolve(value);
  };
  const timer=setTimeout(()=>finish(new Error(label+' exceeded seven-second budget')),7000);
  const receive=result=>{
   const ms=Date.now()-start;
   const output=String(result?.output||'')+'\n'+String(result?.error||'');
   if(result?.code==='account_limit')return finish(new Error(label+': site account run limit'));
   if(result?.exit_code===null||result?.exit_code===undefined)
    return finish(new Error(label+': no execution result '+JSON.stringify({code:result?.code,error:result?.error})));
   const success=Number(result.exit_code)===0;
   if(success!==expectedSuccess||!pattern.test(output))
    return finish(new Error(label+': unexpected result '+JSON.stringify({success,output:output.slice(0,700)})));
   finish(null,{label,ms,success,stdout:String(result.output||'').slice(0,90)});
  };
  socket.once('codeoutput',receive);
  socket.emit('runcode',{compiler,code,input});
 });
}
(async()=>{
 try{
  await connect();
  console.log('WebSocket connected: widget key accepted for '+origin);
  const cases=[
   ['C++ headers + stdin','g++-15','#include <iostream>\n#include <cmath>\nusing namespace std;\nint main(){int n;cin>>n;cout<<sqrt(n)<<endl;}','25\n',true,/5/],
   ['C++ compiler error','g++-15','#include <iostream>\nint main(){int value = ; cout << value;}','',false,/error|expected/i],
   ['Python output','python-3.14','print(42)','',true,/42/],
   ['C stdio header','gcc-15','#include <stdio.h>\nint main(){printf("42\\n");return 0;}','',true,/42/],
   ['JavaScript output','nodejs-24','console.log(42)','',true,/42/],
   ['Java output','openjdk-25','public class Main { public static void main(String[] args){System.out.println(42);} }','',true,/42/],
   ['C# output','dotnet-csharp-10','using System; class Program {static void Main(){Console.WriteLine(42);}}','',true,/42/],
   ['SQLite output','sqlite-3','SELECT 42;','',true,/42/],
  ];
  for(let i=0;i<cases.length;i++){
   if(i)await pause(1250);
   const r=await run(...cases[i]);
   console.log(r.label+': '+r.ms+'ms, '+(r.success?'success':'expected diagnostic')+(r.stdout?', output='+JSON.stringify(r.stdout):''));
  }
  console.log('Live compiler smoke tests PASS');
 }catch(err){console.error('Live compiler smoke tests FAILED:',err.message);process.exitCode=1}
 finally{socket.disconnect()}
})();
