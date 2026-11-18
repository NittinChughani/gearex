/* GearEx optional accounts. The whole learning website remains guest-first.
   Public Supabase publishable key only. RLS + private storage are mandatory.
   Never replace guest records without consent; account and guest caches are isolated. */
(function(){
'use strict';
const cfg=window.GearExSupabaseConfig||{};
const Data=window.GearExAccountData;
const CORE='codelab-academy-complete-v2';
const CHECKS='gearex-lesson-checks-v1';
const CERTS='gearex-certificates-v2';
const CERTNAME='gearex-certificate-name-v1';
const OWNER='gearex-active-progress-owner-v1';
const GUEST='gearex-guest-snapshot-v1';
const GUEST_NAME='gearex-guest-display-name-v1';
const GUEST_PHOTO='gearex-guest-avatar-v1';
const SUPABASE_SDK='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.48.1/dist/umd/supabase.min.js';
const $=id=>document.getElementById(id);
const available=!!Data&&/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(cfg.url||''))&&
  /^(sb_publishable_|eyJ)/.test(String(cfg.publishableKey||''));
const parse=(s,fallback)=>{try{return JSON.parse(s||'null')||fallback;}catch{return fallback;}};
const get=(key,fallback='')=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const put=(key,value)=>{try{localStorage.setItem(key,value);return true;}catch{return false;}};
const owner=()=>get(OWNER,'guest');
const blank=()=>Data.clean({});
const snapshot=()=>Data.clean({
 core:parse(get(CORE),{}),checks:parse(get(CHECKS),{}),
 certificates:parse(get(CERTS),{}),certificateName:get(CERTNAME)
});
function writeSnapshot(data){
 const s=Data.clean(data);
 if(!put(CORE,JSON.stringify(s.core))||!put(CHECKS,JSON.stringify(s.checks))||
    !put(CERTS,JSON.stringify(s.certificates))||!put(CERTNAME,s.certificateName))
   throw new Error('Local storage is full or blocked. Export your progress before continuing.');
}
function avatarLetter(name){
 const clean=String(name||'Learner').trim();
 return clean.charAt(0).toUpperCase()||'G';
}
function announce(msg,type){
 if($('cloudStatus'))$('cloudStatus').textContent=msg;
 if($('authMessage'))$('authMessage').textContent=msg;
 if(type)window.GearExFeedback?.toast(msg,type);
}
let client=null,user=null,profile=null,transitioning=false,avatarUrl=null;
let dirty=false,reset=false,uploadTimer=null,syncing=false,authReady=false;
let deletingAccount=false;
function displayName(){
 if(user)return String(profile?.display_name||user.user_metadata?.full_name||user.email?.split('@')[0]||'Learner').slice(0,60);
 return get(GUEST_NAME,'Guest learner');
}
function updateAvatar(src){
 if(user)avatarUrl=src||null;
 const initials=avatarLetter(displayName());
 for(const name of ['profileAvatar','navAccountAvatar']){
  const image=$(name);
  if(!image)continue;
  if(src){
   image.hidden=false;image.src=src;image.alt='Your profile photo';
  }else{image.hidden=true;image.removeAttribute('src');image.alt='';}
 }
 for(const id of ['profileInitials','navAccountInitials'])if($(id))$(id).textContent=initials;
}
function refreshIdentity(){
 const name=displayName();
 if($('profileName')&&document.activeElement!==$('profileName'))$('profileName').value=name;
 if($('welcomeName'))$('welcomeName').textContent=user?'Welcome back, '+name:name==='Guest learner'?'Your learning journey, your pace':'Welcome, '+name;
 if($('accountLaunch')){
  $('accountLaunch').setAttribute('aria-label',user?'Open account settings':'Sign in to GearEx');
  $('accountLaunch').title=user?'Account · '+name:'Sign in (optional)';
 }
 if($('accountState'))$('accountState').textContent=user?'Signed in · '+(user.email||'Cloud account'):'Guest mode · No account required';
 if($('accountLogout'))$('accountLogout').hidden=!user;
 if($('accountDelete'))$('accountDelete').hidden=!user;
 if($('accountSignIn'))$('accountSignIn').hidden=!!user;
 if($('accountSignIn'))$('accountSignIn').textContent=available?'Sign in to sync':'Cloud sign-in setup pending';
 if($('accountPhotoHint'))$('accountPhotoHint').textContent=user?
  'Private photo · stored securely with your account':'Photo stays on this device until you sign in';
 if($('clearAvatar'))$('clearAvatar').hidden=!!(!user&&!get(GUEST_PHOTO))||!!(user&&!profile?.avatar_path);
 updateAvatar(user?avatarUrl:get(GUEST_PHOTO));
}
function setDialog(open){
 const dialog=$('authDialog');
 if(!dialog)return;
 if(open){
  if(!available)announce('Cloud accounts are not yet connected. You can keep learning as a guest.');
  if(!dialog.open)dialog.showModal();
  if($('authEmail'))$('authEmail').focus();
 }else if(dialog.open)dialog.close();
}
function loadSdk(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 return new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src=SUPABASE_SDK;s.async=true;
  const timer=setTimeout(()=>{s.remove();reject(new Error('Account library timed out. Guest mode still works.'));},6500);
  s.onload=()=>{clearTimeout(timer);window.supabase?.createClient?resolve(window.supabase):reject(new Error('Account library could not start.'));};
  s.onerror=()=>{clearTimeout(timer);reject(new Error('Account library is unavailable. Guest mode still works.'));};
  document.head.append(s);
 });
}
async function fetchCloud(id){
 const {data,error}=await client.from('gearex_progress').select('payload').eq('user_id',id).maybeSingle();
 if(error)throw error;
 return data?.payload?Data.clean(data.payload):null;
}
async function saveCloud(id,payload){
 const encoded=JSON.stringify(Data.clean(payload));
 if(new Blob([encoded]).size>500000)
   throw new Error('Saved programs exceed the cloud limit. Export a backup and shorten large drafts; local copies remain intact.');
 const {error}=await client.from('gearex_progress').upsert({
  user_id:id,payload:JSON.parse(encoded),updated_at:new Date().toISOString()
 },{onConflict:'user_id'});
 if(error)throw error;
}
async function syncNow(){
 if(!user||!authReady||syncing)return;
 syncing=true;clearTimeout(uploadTimer);
 try{
  do{
   const replacing=reset;reset=false;dirty=false;
   const local=snapshot();
   const remote=replacing?null:await fetchCloud(user.id);
   // Union merges completed work; a deliberate reset is a replacement.
   const combined=replacing?local:remote?Data.merge(remote,local):local;
   await saveCloud(user.id,combined);
   put('gearex-account-cache:'+user.id,JSON.stringify(combined));
   announce('All changes saved to your account');
  }while(dirty||reset);
 }catch(err){
  dirty=true;
  announce('Saved on this device · Cloud sync unavailable: '+String(err.message||'Please retry').slice(0,130));
 }finally{syncing=false;}
}
function scheduleSync(){
 if(!user)return;
 dirty=true;
 if(!authReady)return;
 clearTimeout(uploadTimer);
 uploadTimer=setTimeout(syncNow,1600);
 announce('Saving securely…');
}
async function refreshAvatar(){
 if(!user||!profile?.avatar_path){updateAvatar(null);return;}
 const {data,error}=await client.storage.from('gearex-avatars').createSignedUrl(profile.avatar_path,1800);
 if(error)announce('Profile photo could not be loaded: '+error.message);
 updateAvatar(data?.signedUrl||null);
}
async function loadProfile(){
 if(!user)return;
 const {data,error}=await client.from('gearex_profiles')
   .select('display_name,avatar_path').eq('user_id',user.id).maybeSingle();
 if(error){announce('Profile not available: '+error.message);return;}
 profile=data||{display_name:'',avatar_path:null};
 refreshIdentity();await refreshAvatar();
}
async function startUser(account){
 if(transitioning)return;
 if(user?.id===account.id&&authReady)return;
 transitioning=true;
 try{
  const ownerBefore=owner(),guestCopy=snapshot();
  // Do not erase existing guest work during a sign-in transition.
  if(ownerBefore==='guest')put(GUEST,JSON.stringify(guestCopy));
  user=account;
  const cloud=await fetchCloud(account.id);
  const cache=parse(get('gearex-account-cache:'+account.id),null);
  const previous=ownerBefore==='user:'+account.id?guestCopy:cache;
  let next=cloud||previous||blank(),shouldPush=!cloud;
  if(ownerBefore==='guest'&&Data.hasLearning(guestCopy)){
   const importGuest=window.confirm(
     'You have learning progress saved on this device. Add this guest progress to your account?\n\nOK: securely merge lessons, scores and code drafts.\nCancel: keep guest progress separately on this device.'
   );
   if(importGuest){next=Data.merge(next,guestCopy);shouldPush=true;}
  }else if(ownerBefore==='user:'+account.id&&previous){
   const merged=cloud?Data.merge(cloud,previous):previous;
   shouldPush=JSON.stringify(merged)!==JSON.stringify(cloud);
   next=merged;
  }
  // Upload before switching local workspace so a failed setup never destroys guest data.
  if(shouldPush)await saveCloud(account.id,next);
  const oldOwner=owner();
  const needsReload=oldOwner!=='user:'+account.id||
    JSON.stringify(snapshot())!==JSON.stringify(Data.clean(next));
  if(needsReload){
   writeSnapshot(next);put(OWNER,'user:'+account.id);
   put('gearex-account-cache:'+account.id,JSON.stringify(next));
   location.hash='dashboard';location.reload();return;
  }
  authReady=true;await loadProfile();
  if(dirty) scheduleSync();
  else announce('All changes saved to your account');
  setDialog(false);
 }catch(err){
  // The visible guest workspace remains untouched when the provider isn't ready.
  user=null;authReady=false;
  announce('Cloud account setup needs attention: '+String(err.message||err).slice(0,190));
 }finally{transitioning=false;}
}
function restoreGuest(){
 if(owner().startsWith('user:')){
  const id=owner().slice(5);
  put('gearex-account-cache:'+id,JSON.stringify(snapshot()));
  writeSnapshot(parse(get(GUEST),blank()));
  put(OWNER,'guest');location.hash='dashboard';location.reload();
  return;
 }
 user=null;profile=null;avatarUrl=null;authReady=false;refreshIdentity();
 announce(available?'Guest mode · Progress saved on this device':'Guest mode · Cloud account setup pending');
}
async function signOut(){
 if(!client||!user)return;
 if(dirty||syncing)await syncNow();
 const {error}=await client.auth.signOut();
 if(error){announce('Could not sign out: '+error.message);return;}
 restoreGuest();
}
function onChange(event,session){
 if(event==='INITIAL_SESSION')return;
 if(session?.user&&['SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event)){
  if(!user||user.id!==session.user.id)startUser(session.user);
 }else if(event==='SIGNED_OUT'&&!deletingAccount)restoreGuest();
}
async function startAuth(){
 if(!available){if(owner().startsWith('user:')){restoreGuest();return;}announce('Cloud accounts are not yet connected. Guest learning and local profiles work now.');return;}
 announce('Connecting account services…');
 try{
  const sdk=await loadSdk();
  client=sdk.createClient(cfg.url.replace(/\/$/,''),cfg.publishableKey,{
   auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}
  });
  client.auth.onAuthStateChange((event,session)=>{setTimeout(()=>onChange(event,session),0);});
  const {data,error}=await client.auth.getSession();
  if(error)throw error;
  if(data.session?.user)await startUser(data.session.user);
  else if(owner().startsWith('user:'))restoreGuest();
  else{announce('Guest mode · Sign in anytime to sync progress');refreshIdentity();}
 }catch(err){if(owner().startsWith('user:')){restoreGuest();return;}announce('Account connection unavailable · Guest mode works: '+String(err.message||err).slice(0,130));}
}
function transformPhoto(file){
 return new Promise((resolve,reject)=>{
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))return reject(new Error('Choose a JPG, PNG or WebP image.'));
  if(file.size>4*1024*1024)return reject(new Error('Please choose an image under 4 MB.'));
  const url=URL.createObjectURL(file),image=new Image();
  const cleanup=()=>URL.revokeObjectURL(url);
  image.onerror=()=>{cleanup();reject(new Error('Could not open this image.'));};
  image.onload=()=>{
   try{
    const canvas=document.createElement('canvas');canvas.width=320;canvas.height=320;
    const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image editor unavailable.');
    const edge=Math.min(image.naturalWidth,image.naturalHeight);
    ctx.drawImage(image,(image.naturalWidth-edge)/2,(image.naturalHeight-edge)/2,edge,edge,0,0,320,320);
    canvas.toBlob(blob=>{
     cleanup();
     if(!blob||blob.type!=='image/webp')reject(new Error('Your browser cannot save a WebP avatar.'));
     else resolve({blob,preview:canvas.toDataURL('image/webp',.8)});
    },'image/webp',.8);
   }catch(err){cleanup();reject(err);}
  };
  image.src=url;
 });
}
async function changePhoto(file){
 if(!file)return;
 announce('Preparing your new profile picture…');
 window.GearExFeedback?.busy('Saving profile picture…','Preparing and uploading your photo securely.');
 try{
  const {blob,preview}=await transformPhoto(file);
  if(!user){
   if(!put(GUEST_PHOTO,preview))throw Error('Device storage is full. Use a smaller image.');
   updateAvatar(preview);refreshIdentity();announce('Profile picture saved successfully on this device.','success');
  }else{
   const path=user.id+'/avatar.webp';
   const {error}=await client.storage.from('gearex-avatars').upload(path,blob,
    {upsert:true,contentType:'image/webp',cacheControl:'60'});
   if(error)throw error;
   profile={...(profile||{}),avatar_path:path};
   const saved=await client.from('gearex_profiles').upsert({
    user_id:user.id,display_name:String(profile.display_name||'').slice(0,60),
    avatar_path:path,updated_at:new Date().toISOString()
   },{onConflict:'user_id'});
   if(saved.error)throw saved.error;
   await refreshAvatar();refreshIdentity();announce('Profile picture changed successfully.','success');
  }
 }catch(err){announce('Could not update photo: '+String(err.message||err).slice(0,150),'error');}
 finally{window.GearExFeedback?.idle();if($('profileAvatarInput'))$('profileAvatarInput').value='';}
}
async function removePhoto(){
 window.GearExFeedback?.busy('Removing profile picture…','Updating your private profile.');
 try{
  if(user){
   if(!profile?.avatar_path)return;
   const {error}=await client.storage.from('gearex-avatars').remove([profile.avatar_path]);
   if(error)throw error;
   profile.avatar_path=null;
   const saved=await client.from('gearex_profiles').upsert({
    user_id:user.id,display_name:profile.display_name||'',avatar_path:null,
    updated_at:new Date().toISOString()
   },{onConflict:'user_id'});
   if(saved.error)throw saved.error;
  }else put(GUEST_PHOTO,'');
  updateAvatar(null);refreshIdentity();announce('Profile picture removed successfully.','success');
 }catch(error){announce('Could not remove profile picture: '+String(error.message||error).slice(0,140),'error');}
 finally{window.GearExFeedback?.idle();}
}
async function saveName(){
 const name=String($('profileName')?.value||'').trim().replace(/\s+/g,' ').slice(0,60);
 if(!name){announce('Enter a display name first.','error');return;}
 if(!user){
  put(GUEST_NAME,name);refreshIdentity();announce('Profile name changed successfully on this device.','success');return;
 }
 const button=$('saveProfile');if(button)button.disabled=true;
 window.GearExFeedback?.busy('Saving profile name…','Syncing this change to your account.');
 try{
  const saved=await client.from('gearex_profiles').upsert({
   user_id:user.id,display_name:name,avatar_path:profile?.avatar_path||null,
   updated_at:new Date().toISOString()
  },{onConflict:'user_id'});
  if(saved.error)throw saved.error;
  profile={...(profile||{}),display_name:name};refreshIdentity();
  announce('Profile name changed successfully.','success');
 }catch(error){announce('Profile name could not be saved: '+String(error.message||error).slice(0,150),'error');}
 finally{window.GearExFeedback?.idle();if(button)button.disabled=false;}
}
async function requestMagicLink(event){
 event.preventDefault();
 if(!client){announce('Sign-in service is not configured yet.');return;}
 const email=String($('authEmail')?.value||'').trim();
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){announce('Enter a valid email address.');return;}
 const {error}=await client.auth.signInWithOtp({
  email,options:{emailRedirectTo:location.origin+location.pathname}
 });
 announce(error?'Email sign-in failed: '+error.message:'Check your email for a secure GearEx sign-in link.');
}
async function googleSignIn(){
 if(!client){announce('Google sign-in needs the Supabase project configured first.');return;}
 const {error}=await client.auth.signInWithOAuth({
  provider:'google',options:{redirectTo:location.origin+location.pathname}
 });
 if(error)announce('Google sign-in failed: '+error.message);
}
async function deleteAccount(){
 if(!client||!user||deletingAccount)return;
 if(window.prompt('Permanently delete your GearEx account, cloud progress and photo? Type DELETE to confirm:')!=='DELETE')return;
 deletingAccount=true;
 const accountId=user.id;
 const button=$('accountDelete');
 if(button)button.disabled=true;
 announce('Deleting account and private data…');
 let deleted=false;
 try{
  const {data,error}=await client.functions.invoke('delete-account',{body:{confirmation:'DELETE'}});
  if(error){
   let reason=String(error.message||'The request failed');
   try{
    const payload=await error.context?.json?.();
    if(typeof payload?.error==='string')reason=payload.error;
   }catch{}
   if(/failed to send a request|failed to fetch|networkerror/i.test(reason))
    reason='The deletion service could not be reached. Its deployment or browser access needs attention';
   announce('Account deletion unavailable: '+reason+'. Your account remains active.');
   return;
  }
  if(data?.ok!==true){
   announce('Deletion was not confirmed by the server. Your account has not been marked as deleted.');
   return;
  }
  deleted=true;
  // A deleted account must not leave its private progress in an account cache.
  // Preserve ONLY the separate guest workspace, not the deleted account data.
  clearTimeout(uploadTimer);
  dirty=false;reset=false;authReady=false;
  try{await client.auth.signOut({scope:'local'});}catch{}
  try{localStorage.removeItem('gearex-account-cache:'+accountId);}catch{}
  user=null;profile=null;avatarUrl=null;
  try{writeSnapshot(parse(get(GUEST),blank()));put(OWNER,'guest');}
  catch{try{localStorage.removeItem(OWNER);}catch{}}
  announce('Account deleted. Returning to guest mode…');
  location.hash='dashboard';
  location.reload();
 }catch(err){
  if(!deleted)announce('Account deletion unavailable: '+String(err.message||err).slice(0,160)+'. Your account remains active.');
  else announce('Your account was deleted, but local cleanup needs a page refresh.');
 }finally{
  if(!deleted){deletingAccount=false;if(button)button.disabled=false;}
 }
}
function initialize(){
 refreshIdentity();
 $('accountLaunch')?.addEventListener('click',()=>user?(location.hash='dashboard'):setDialog(true));
 $('accountSignIn')?.addEventListener('click',()=>setDialog(true));
 $('authClose')?.addEventListener('click',()=>setDialog(false));
 $('authDialog')?.addEventListener('click',e=>{if(e.target===$('authDialog'))setDialog(false);});
 $('authGoogle')?.addEventListener('click',googleSignIn);
 $('authEmailForm')?.addEventListener('submit',requestMagicLink);
 $('saveProfile')?.addEventListener('click',saveName);
 $('profileAvatarButton')?.addEventListener('click',()=>$('profileAvatarInput')?.click());
 $('profileAvatarInput')?.addEventListener('change',e=>changePhoto(e.target.files?.[0]));
 $('clearAvatar')?.addEventListener('click',removePhoto);
 $('accountLogout')?.addEventListener('click',signOut);
 $('accountDelete')?.addEventListener('click',deleteAccount);
 window.addEventListener('gearex:progresschange',scheduleSync);
 window.addEventListener('gearex:reset-progress',()=>{reset=true;scheduleSync();});
 window.addEventListener('online',()=>{if(dirty)scheduleSync();});
 window.addEventListener('beforeunload',()=>{if(user)put('gearex-account-cache:'+user.id,JSON.stringify(snapshot()));});
 startAuth();
}
window.GearExAccounts=Object.freeze({isConfigured:()=>available,getUser:()=>user,
 sync:()=>{scheduleSync();},snapshot,saveName,changePhoto});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
})();