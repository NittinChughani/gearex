/* GearEx lesson checks — five material-specific MCQs per lesson. */
'use strict';
(() => {
  const key='gearex-lesson-checks-v1';
  const $=s=>document.querySelector(s);
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const read=()=>{try{const d=JSON.parse(localStorage.getItem(key)||'{}');return d&&typeof d==='object'&&!Array.isArray(d)?d:{};}catch{return {};}};
  const scores=read();
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(scores));}catch{}};
  const sampleLine=l=>String(l.code||'').split(/\r?\n/).map(x=>x.trim()).find(x=>x.length>=12&&!/^(\/\/|#include|using namespace|int main|public class Main|class prog|static void Main|\{|\}|\/\/)/.test(x))||String(l.code||'').split('\n').find(x=>x.trim().length>3)||'';
  const hash=s=>Array.from(String(s)).reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
  const collect=(lesson,field)=>{
    const peers=LESSONS.filter(x=>x.lang===lesson.lang&&x.id!==lesson.id);
    const other=LESSONS.filter(x=>x.lang!==lesson.lang);
    const rotated=(arr,salt)=>{const at=hash(lesson.id+salt)%arr.length;return [...arr.slice(at),...arr.slice(0,at)]};
    return rotated(peers,'local').concat(rotated(other,'global')).map(field).map(clean).filter(Boolean);
  };
  function question(lesson,i,prompt,correct,field){
    correct=clean(correct);
    let options=[correct];
    for(const possible of collect(lesson,field))if(possible!==correct&&!options.includes(possible)){options.push(possible);if(options.length===4)break;}
    if(options.length<4)throw Error('Not enough distinct choices in '+lesson.id);
    const answer=hash(lesson.id+':'+i)%4;
    options.splice(answer,0,options.shift());
    return {prompt,options,answer,explain:correct};
  }
  function questions(lesson){
    if(!lesson||!lesson.id)throw Error('Unknown lesson');
    return [
      question(lesson,0,'Which concept is the focus of this lesson?',lesson.title,l=>l.title),
      question(lesson,1,'Which statement best summarizes the concept explained here?',lesson.description,l=>l.description),
      question(lesson,2,'Which is an important point from this lesson?',lesson.points?.[0]||lesson.intro,l=>l.points?.[0]||l.intro),
      question(lesson,3,'Which statement appears in this lesson’s worked code example?',sampleLine(lesson),sampleLine),
      question(lesson,4,'Which exercise is the intended follow-up practice?',lesson.challenge,l=>l.challenge)
    ];
  }
  const passed=id=>Number(scores[id]?.best)>=4&&Number(scores[id]?.best)<=5;
  const el=(t,c,v)=>{const x=document.createElement(t);if(c)x.className=c;if(v!==undefined)x.textContent=v;return x;};
  const makeButton=(label,fn)=>{const b=el('button','button primary',label);b.type='button';b.addEventListener('click',fn);return b;};
  function open(lesson){
    const root=$('#lessonContent'),area=el('div','lesson-test');
    const old=$('#lessonCheck');if(old)old.remove();
    area.id='lessonCheck';
    area.append(el('span','eyebrow','LESSON KNOWLEDGE CHECK'),el('h3','',lesson.title+' · 5 questions'),el('p','','Answer all five questions. Score at least 4/5 to verify this lesson. Your best score contributes to the 100-mark certificate.'));
    const form=el('form','lesson-test-form');
    const bank=questions(lesson);
    bank.forEach((q,i)=>{
      const field=el('fieldset','lesson-test-question'),legend=el('legend','',(i+1)+'. '+q.prompt);field.append(legend);
      q.options.forEach((choice,j)=>{const label=el('label','lesson-test-choice');const input=document.createElement('input');input.type='radio';input.name='lesson-q-'+i;input.value=String(j);input.required=true;label.append(input,document.createTextNode(choice));field.append(label);});form.append(field);
    });
    const submit=makeButton('Grade my answers',()=>{
      if(!form.reportValidity())return;
      const answers=new FormData(form);
      const correct=bank.reduce((acc,q,i)=>acc+(Number(answers.get('lesson-q-'+i))===q.answer?1:0),0);
      const prev=scores[lesson.id];scores[lesson.id]={best:Math.max(correct,Number(prev?.best)||0),attempts:(Number(prev?.attempts)||0)+1,date:new Date().toISOString().slice(0,10)};
      save();
      if(passed(lesson.id)){state.completed.add(lesson.id);persist();}
      const feedback=el('div','lesson-test-feedback');
      feedback.append(el('h4','',correct>=4?'Lesson verified':'Review and try again'),
        el('p','','This attempt: '+correct+'/5. Best: '+scores[lesson.id].best+'/5. '+(correct>=4?'You can continue learning.':'4/5 needed to finish the lesson.')));
      bank.forEach((q,i)=>{if(Number(answers.get('lesson-q-'+i))!==q.answer){feedback.append(el('p','','Question '+(i+1)+': '+q.explain));}});
      form.replaceWith(feedback);
      feedback.append(makeButton('Retake five-question check',()=>open(lesson)));
      updateStats();renderRoadmap();renderLessons();
      if(window.gearexRenderCertificates)window.gearexRenderCertificates();
      const action=root.querySelector('.lesson-complete-action');if(action)action.textContent=passed(lesson.id)?'✓ Passed — retake to improve score':'Take 5-question lesson check →';
      feedback.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    form.append(submit);area.append(form);root.append(area);area.scrollIntoView({behavior:'smooth',block:'start'});
  }
  window.gearexLessonQuestions=questions;
  window.gearexLessonPassed=passed;
  window.gearexLessonScores=scores;
  window.gearexOpenLessonCheck=open;
  window.gearexExportLessonChecks=()=>JSON.parse(JSON.stringify(scores));
  window.gearexImportLessonChecks=rows=>{
    if(!rows||typeof rows!=='object'||Array.isArray(rows))return;
    for(const lesson of LESSONS){const r=rows[lesson.id];
      if(r&&Number.isInteger(r.best)&&r.best>=0&&r.best<=5&&Number.isInteger(r.attempts)&&r.attempts>0)
        scores[lesson.id]={best:r.best,attempts:Math.min(r.attempts,100000),date:String(r.date||'').slice(0,10)};
    }
    for(const lesson of LESSONS){if(passed(lesson.id))state.completed.add(lesson.id);else state.completed.delete(lesson.id);}
    save();persist();updateStats();renderRoadmap();renderLessons();
  };
  window.gearexResetLessonChecks=()=>{for(const id of Object.keys(scores))delete scores[id];save();};
  // Older versions permitted unverified completion ticks. Keep an archival list.
  const unverified=[...state.completed].filter(id=>!passed(id));
  if(unverified.length){try{
    const historic=JSON.parse(localStorage.getItem('gearex-legacy-completed-v1')||'[]');
    localStorage.setItem('gearex-legacy-completed-v1',JSON.stringify([...new Set([...(Array.isArray(historic)?historic:[]),...unverified])]));
  }catch{}}
  for(const id of unverified)state.completed.delete(id);
  for(const lesson of LESSONS)if(passed(lesson.id))state.completed.add(lesson.id);
  if(unverified.length){persist();updateStats();renderRoadmap();renderLessons();}
})();
