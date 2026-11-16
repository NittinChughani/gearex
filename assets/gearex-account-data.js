/* GearEx account data format: pure functions shared by browser and tests.
   A conflict never silently discards a distinct program draft. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GearExAccountData=api;
})(typeof window!=='undefined'?window:null,function(){
'use strict';
const FIELDS=['completed','bookmarks','practiced','passed','tried','projects'];
const isObject=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const object=x=>isObject(x)?x:{};
const list=x=>Array.isArray(x)?x.filter(v=>typeof v==='string'&&v.length<150).slice(0,1200):[];
const distinct=(a,b)=>[...new Set([...list(a),...list(b)])];
const boundedNumber=(x,min,max)=>Number.isFinite(Number(x))?Math.max(min,Math.min(max,Number(x))):min;
const stableHash=s=>{
 let n=2166136261;
 for(const c of String(s)){n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;}
 return n.toString(16).padStart(8,'0');
};
function cleanCore(raw){
 const p=object(raw),result={};
 for(const f of FIELDS)result[f]=list(p[f]);
 result.theme=['none','cyberpunk','quantum','synthwave','matrix'].includes(p.theme)?p.theme:'none';
 result.mode=p.mode==='dark'?'dark':'light';
 result.quizAttempts=Math.floor(boundedNumber(p.quizAttempts,0,1000000));
 result.best=isObject(p.best)&&boundedNumber(p.best.percent,0,100)>0?
   {percent:boundedNumber(p.best.percent,0,100),lang:String(p.best.lang||'Quiz').slice(0,60)}:null;
 const drafts=object(p.drafts);
 result.drafts={};
 for(const [key,code] of Object.entries(drafts)){
   if(typeof key==='string'&&key.length<=130&&typeof code==='string'&&code.length<=100000)result.drafts[key]=code;
 }
 return result;
}
function cleanChecks(raw){
 const result={};
 for(const [key,entry] of Object.entries(object(raw))){
  if(key.length>120||!isObject(entry))continue;
  const best=Math.floor(boundedNumber(entry.best,0,5)),attempts=Math.floor(boundedNumber(entry.attempts,0,100000));
  if(attempts>0)result[key]={best,attempts,date:String(entry.date||'').slice(0,10)};
 }
 return result;
}
function cleanCertificates(raw){
 const result={};
 for(const [key,entry] of Object.entries(object(raw))){
  if(key.length>30||!isObject(entry))continue;
  const score=boundedNumber(entry.score,0,100),total=boundedNumber(entry.total,0,100);
  if(total>0)result[key]={score,total,date:String(entry.date||'').slice(0,10)};
 }
 return result;
}
function clean(raw){
 const p=object(raw);
 return {core:cleanCore(p.core),checks:cleanChecks(p.checks),
   certificates:cleanCertificates(p.certificates),certificateName:String(p.certificateName||'').slice(0,80)};
}
function merge(a,b){
 const remote=clean(a),local=clean(b);
 const core={...remote.core,...local.core};
 for(const f of FIELDS)core[f]=distinct(remote.core[f],local.core[f]);
 core.quizAttempts=Math.max(remote.core.quizAttempts,local.core.quizAttempts);
 if((remote.core.best?.percent||0)>(local.core.best?.percent||0))core.best=remote.core.best;
 core.drafts={...remote.core.drafts};
 for(const [key,code] of Object.entries(local.core.drafts)){
   if(typeof core.drafts[key]==='string'&&core.drafts[key]!==code){
     const suffix='::backup-'+stableHash(core.drafts[key]);
     const backup=(key+suffix).slice(0,130);
     if(!(backup in core.drafts))core.drafts[backup]=core.drafts[key];
   }
   core.drafts[key]=code;
 }
 const checks={...remote.checks};
 for(const [key,localCheck] of Object.entries(local.checks)){
  const r=checks[key];
  checks[key]=!r?localCheck:{best:Math.max(r.best,localCheck.best),
   attempts:Math.max(r.attempts,localCheck.attempts),
   date:localCheck.date>r.date?localCheck.date:r.date};
 }
 const certificates={...remote.certificates};
 for(const [key,entry] of Object.entries(local.certificates)){
  const r=certificates[key];
  if(!r||entry.score>r.score||(entry.score===r.score&&entry.date>=r.date))certificates[key]=entry;
 }
 return {core,checks,certificates,certificateName:local.certificateName||remote.certificateName};
}
function hasLearning(s){
 const a=clean(s);const c=a.core;
 return FIELDS.some(k=>c[k].length>0)||c.quizAttempts>0||
  !!Object.keys(a.checks).length||!!Object.keys(a.certificates).length||
  Object.values(c.drafts).some(v=>v.length>0);
}
return Object.freeze({clean,merge,hasLearning,stableHash});
});