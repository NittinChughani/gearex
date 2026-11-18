/* GearEx interaction feedback: accessible toasts, blocking progress state and guided focus. */
(function(){
'use strict';
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let toastTimer=null,highlightTimer=null,overlay=null;
function ensure(){
 let region=document.getElementById('gearexToast');
 if(!region){
  region=document.createElement('div');region.id='gearexToast';region.className='gearex-toast';
  region.setAttribute('role','status');region.setAttribute('aria-live','polite');
  region.setAttribute('aria-atomic','true');region.hidden=true;
  document.body.append(region);
 }
 if(!overlay){
  overlay=document.createElement('div');overlay.id='gearexBusy';overlay.className='gearex-busy';overlay.hidden=true;
  overlay.innerHTML='<div class="gearex-busy-card" role="status" aria-live="polite"><span class="gearex-spinner" aria-hidden="true"></span><strong id="gearexBusyTitle">Working…</strong><span id="gearexBusyDetail">Please keep this page open.</span></div>';
  document.body.append(overlay);
 }
 return region;
}
function toast(message,type='success',duration=3800){
 if(!document.body)return;
 const region=ensure();
 clearTimeout(toastTimer);
 region.replaceChildren();
 const mark=document.createElement('span');mark.className='gearex-toast-icon';
 mark.textContent=type==='error'?'!':type==='info'?'i':'✓';
 const text=document.createElement('span');text.textContent=String(message||'');
 region.append(mark,text);
 region.dataset.type=type;region.hidden=false;
 toastTimer=setTimeout(()=>{region.hidden=true;},Math.max(1900,duration));
}
function busy(message,detail='Please keep this page open.'){
 if(!document.body)return;
 ensure();overlay.hidden=false;
 document.getElementById('gearexBusyTitle').textContent=String(message||'Working…');
 document.getElementById('gearexBusyDetail').textContent=String(detail);
}
function idle(){if(overlay)overlay.hidden=true;}
function focus(target,options={}){
 const element=typeof target==='string'?document.querySelector(target):target;
 if(!element||element.hidden||!element.isConnected)return;
 const pane=options.pane||element;
 if(!pane.isConnected)return;
 const doFocus=()=>{
  if(!pane.isConnected)return;
  pane.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center',inline:'nearest'});
  const previous=document.querySelector('.gearex-spotlight');
  if(previous&&previous!==pane)previous.classList.remove('gearex-spotlight');
  pane.classList.remove('gearex-spotlight');
  // Trigger the accent even when focusing the same output in consecutive runs.
  void pane.offsetWidth;
  pane.classList.add('gearex-spotlight');
  clearTimeout(highlightTimer);
  highlightTimer=setTimeout(()=>pane.classList.remove('gearex-spotlight'),2400);
  if(options.input&&typeof element.focus==='function'){
   try{element.focus({preventScroll:true});}catch{element.focus();}
  }
 };
 requestAnimationFrame(doFocus);
}
function flash(message,type='success'){
 try{sessionStorage.setItem('gearex:one-time-feedback',JSON.stringify({message,type,at:Date.now()}));}catch{}
}
function restore(){
 let data;
 try{data=JSON.parse(sessionStorage.getItem('gearex:one-time-feedback')||'null');sessionStorage.removeItem('gearex:one-time-feedback');}catch{}
 if(data&&Date.now()-data.at<25000)toast(data.message,data.type,5400);
}
window.GearExFeedback=Object.freeze({toast,busy,idle,focus,flash});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});
else restore();
})();
