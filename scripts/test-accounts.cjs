'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Account=require('../assets/gearex-account-data.js');
const at=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');

test('guest progress is detected but an untouched new workspace is not',()=>{
 assert.equal(Account.hasLearning({}),false);
 assert.equal(Account.hasLearning({core:{completed:['c-variables']}}),true);
 assert.equal(Account.hasLearning({checks:{'c-variables':{best:4,attempts:1}}}),true);
 assert.equal(Account.hasLearning({core:{drafts:{'scratch:cpp':'int main(){}'}}}),true);
});
test('merge keeps all completed lessons, quizzes, challenges, projects and certificates',()=>{
 const remote={
  core:{completed:['c-intro'],passed:['ch-1'],projects:['proj-1'],quizAttempts:3,
   best:{percent:82,lang:'C'},drafts:{'scratch:c':'printf("hi");'}},
  checks:{'c-intro':{best:5,attempts:2,date:'2026-11-01'}},
  certificates:{c:{score:88,total:20,date:'2026-11-01'}},certificateName:'Alex'
 };
 const local={
  core:{completed:['cpp-intro'],passed:['ch-2'],projects:['proj-2'],quizAttempts:4,
   best:{percent:90,lang:'C++'},drafts:{'scratch:cpp':'int main(){}'}},
  checks:{'c-intro':{best:4,attempts:3,date:'2026-11-05'},
   'cpp-intro':{best:5,attempts:1,date:'2026-11-05'}},
  certificates:{c:{score:89,total:20,date:'2026-11-05'}}};
 const m=Account.merge(remote,local);
 assert.deepEqual(m.core.completed,['c-intro','cpp-intro']);
 assert.deepEqual(m.core.passed,['ch-1','ch-2']);
 assert.deepEqual(m.core.projects,['proj-1','proj-2']);
 assert.equal(m.core.best.percent,90);
 assert.equal(m.core.quizAttempts,4);
 assert.equal(m.checks['c-intro'].best,5);
 assert.equal(m.checks['c-intro'].attempts,3);
 assert.equal(m.certificates.c.score,89);
 assert.equal(m.certificateName,'Alex');
 assert.equal(m.core.drafts['scratch:c'],'printf("hi");');
 assert.equal(m.core.drafts['scratch:cpp'],'int main(){}');
});
test('different versions of a draft are kept, not silently overwritten',()=>{
 const m=Account.merge({core:{drafts:{'saved:cpp:hello':'REMOTE CODE'}}},
                       {core:{drafts:{'saved:cpp:hello':'LOCAL CODE'}}});
 assert.equal(m.core.drafts['saved:cpp:hello'],'LOCAL CODE');
 const backups=Object.keys(m.core.drafts).filter(k=>k.includes('::backup-'));
 assert.equal(backups.length,1);
 assert.equal(m.core.drafts[backups[0]],'REMOTE CODE');
 assert.deepEqual(Account.merge(m,m).core.drafts,m.core.drafts);
});
test('untrusted progress fields are normalized and oversized code is rejected from sync data',()=>{
 const a=Account.clean({core:{
  theme:'javascript:alert(1)',mode:'invalid',completed:['ok',true,'ok'],
  quizAttempts:-20,drafts:{'safe':'hello','bad':17,'long':'a'.repeat(100001)}},
  checks:{'item':{best:999,attempts:3}}});
 assert.equal(a.core.theme,'none');
 assert.equal(a.core.mode,'light');
 assert.deepEqual(a.core.completed,['ok','ok']);
 assert.equal(a.core.quizAttempts,0);
 assert.equal('bad' in a.core.drafts,false);
 assert.equal('long' in a.core.drafts,false);
 assert.equal(a.checks.item.best,5);
});
test('static frontend contains no Supabase secret keys',()=>{
 const config=at('assets/supabase-config.js');
 assert.match(config,/publishableKey:/);
 assert.match(config,/url:/);
 assert.doesNotMatch(config,/service_role\s*:/);
 assert.doesNotMatch(config,/sb_secret_[A-Za-z0-9]{12,}/);
});
test('profile, login, save-code and privacy view are present in markup',()=>{
 const html=at('index.html');
 for(const id of ['accountLaunch','profileAvatarButton','profileAvatarInput','profileName',
  'authDialog','authEmailForm','authGoogle','accountDelete','nextLesson','savedProgramsList',
  'saveCurrentProgram','privacy'])
   assert.match(html,new RegExp('id="'+id+'"'),id+' missing');
 assert.match(html,/gearex-account-data\.js/);
 assert.match(html,/gearex-accounts\.js/);
});
