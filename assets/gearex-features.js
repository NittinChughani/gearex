/* GearEx achievement records and appearance settings. */
'use strict';
(() => {
  const LANG={c:'C',cpp:'C++',py:'Python',js:'JavaScript',java:'Java',cs:'C#',sql:'SQL'};
  const $=s=>document.querySelector(s);
  const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n;};
  const btn=(text,fn,cls='button secondary compact')=>{const b=el('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;};
  const read=key=>{try{const d=JSON.parse(localStorage.getItem(key)||'{}');return d&&typeof d==='object'&&!Array.isArray(d)?d:{};}catch{return {};}};
  $('#themeSelect').value=state.theme;
  $('#themeSelect').addEventListener('change',e=>{state.theme=e.target.value;setTheme();persist();});
  /* Completion and credentials: 70 marks lesson checks + 30 final assessment. */
  const certKey='gearex-certificates-v2',nameKey='gearex-certificate-name-v1';
  const final=read(certKey);
  const save=()=>{try{localStorage.setItem(certKey,JSON.stringify(final));}catch{}};
  const getName=()=>{try{return String(localStorage.getItem(nameKey)||'').trim();}catch{return '';}};
  const lessons=lang=>LESSONS.filter(l=>l.lang===lang);
  const snapshot=lang=>{
    const ls=lessons(lang);
    const completed=ls.filter(l=>window.gearexLessonPassed?.(l.id)).length;
    const earned=ls.reduce((n,l)=>n+(Number(window.gearexLessonScores?.[l.id]?.best)||0),0);
    const possible=ls.length*5;
    const record=final[lang],valid=record&&Number.isInteger(record.score)&&Number.isInteger(record.total)&&record.total>0&&record.score>=0&&record.score<=record.total;
    const lessonMarks=Math.round(earned/possible*700)/10;
    const examMarks=valid?Math.round(record.score/record.total*300)/10:0;
    return {ls,completed,earned,possible,record:valid?record:null,lessonMarks,examMarks,total:Math.round(lessonMarks+examMarks)};
  };
  const performance=n=>n>=90?'Outstanding':n>=80?'Excellent':n>=70?'Proficient':'Developing';
  const eligible=lang=>{
    const s=snapshot(lang);
    return s.ls.length>0&&s.completed===s.ls.length&&s.record&&s.record.score/s.record.total>=0.7;
  };
  function drawCards(){
    const root=$('#certificateGrid');root.replaceChildren();
    for(const [lang,label] of Object.entries(LANG)){
      const s=snapshot(lang),canExam=s.ls.length&&s.completed===s.ls.length;
      const card=el('article','certificate-tile');
      card.append(el('span','eyebrow',label+' / '+s.completed+' of '+s.ls.length+' lessons verified'));
      card.append(el('h3','',eligible(lang)?'Certificate available':canExam?'Final assessment unlocked':'Learning in progress'));
      const track=el('div','progress-track'),fill=el('div','progress-fill');fill.style.width=s.ls.length?Math.round(s.completed/s.ls.length*100)+'%':'0%';track.append(fill);card.append(track);
      card.append(el('p','',s.earned+' / '+s.possible+' lesson-check points · '+s.lessonMarks+' / 70 weighted marks'));
      if(s.record)card.append(el('p','','Final assessment: '+s.record.score+' / '+s.record.total+' · '+s.examMarks+' / 30 weighted'));
      if(eligible(lang))card.append(btn('View certificate',()=>showCertificate(lang),'button primary compact'));
      else if(canExam)card.append(btn('Take final assessment',()=>startExam(lang),'button primary compact'));
      else card.append(btn('Continue '+label+' lessons',()=>{state.roadmap=lang;renderRoadmap();location.hash='path';}));
      root.append(card);
    }
  }
  window.gearexRenderCertificates=drawCards;
  window.gearexExportCertificates=()=>JSON.parse(JSON.stringify(final));
  window.gearexImportCertificates=rows=>{
    if(!rows||typeof rows!=='object'||Array.isArray(rows))return;
    for(const lang of Object.keys(LANG)){
      const r=rows[lang];
      if(r&&Number.isInteger(r.score)&&Number.isInteger(r.total)&&r.total>0&&r.total<=100&&r.score>=0&&r.score<=r.total&&typeof r.date==='string'){
        if(!final[lang]||r.score/r.total>final[lang].score/final[lang].total)
          final[lang]={score:r.score,total:r.total,date:r.date.slice(0,10)};
      }
    }
    save();drawCards();
  };
  window.gearexResetCertificates=()=>{for(const k of Object.keys(final))delete final[k];save();drawCards();};
  function startExam(lang){
    const s=snapshot(lang);if(s.completed!==s.ls.length)return;
    const questions=QUESTIONS.filter(q=>q.lang===lang);
    const count=Math.min(20,questions.length);
    if(!count)return;
    const chosen=Array.from({length:count},(_,i)=>questions[Math.floor(i*questions.length/count)]);
    const root=$('#certificateExam');root.hidden=false;root.replaceChildren();
    root.append(el('h3','','Final '+LANG[lang]+' assessment'),el('p','','Answer '+count+' questions. At least 70% is required. The exam contributes 30 marks to the 100-mark certificate.'));
    const form=el('form','certificate-form');
    chosen.forEach((q,i)=>{
      const field=el('fieldset','certificate-question');field.append(el('legend','',(i+1)+'. '+q.question));
      q.options.forEach((answer,j)=>{const label=el('label');const input=document.createElement('input');input.type='radio';input.name='question-'+i;input.value=j;input.required=true;label.append(input,document.createTextNode(answer));field.append(label);});form.append(field);
    });
    const submit=el('button','button primary','Submit assessment');submit.type='submit';form.append(submit);
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form),earned=chosen.reduce((n,q,i)=>n+(Number(data.get('question-'+i))===q.answer?1:0),0),pct=Math.round(earned/count*100);
      root.replaceChildren(el('h3','',pct>=70?'Assessment passed':'Assessment not yet passed'),el('p','','Secured '+earned+' of '+count+' final-assessment marks ('+pct+'%).'));
      if(pct>=70){
        if(!final[lang]||earned/count>final[lang].score/final[lang].total){
          final[lang]={score:earned,total:count,date:new Date().toISOString().slice(0,10)};save();
        }
        root.append(btn('Open certificate',()=>showCertificate(lang),'button primary compact'));
      }else root.append(el('p','','Review the course material and retake the assessment.'));
      root.append(btn('Retake assessment',()=>startExam(lang)));
      drawCards();
      root.scrollIntoView({behavior:'smooth',block:'start'});
    });
    root.append(form);root.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function paper(s,lang,name){
    const root=el('article','certificate-paper');
    root.append(el('p','cert-kicker','GEAREX / LEARNING RECORD'),el('h2','','Certificate of Course Completion'),el('p','','Awarded to'));
    root.append(el('div','cert-name',name));
    root.append(el('p','','For finishing the '+LANG[lang]+' learning path and successfully completing the final assessment.'));
    const meta=el('div','cert-meta');
    for(const t of [
      'Language · '+LANG[lang],
      'Lesson checks · '+s.earned+'/'+s.possible+' ('+s.lessonMarks+'/70)',
      'Final assessment · '+s.record.score+'/'+s.record.total+' ('+s.examMarks+'/30)',
      'Secured marks · '+s.total+'/100',
      'Overall performance · '+performance(s.total)
    ])meta.append(el('span','',t));
    root.append(meta,el('div','cert-sign','Certified by creator: Nittin Chughani'),
      el('p','','Issued '+s.record.date+' · Creator-issued course achievement · Not an accredited or identity-verified credential'));
    return root;
  }
  function showCertificate(lang){
    if(!eligible(lang))return;
    $('#certificateExam').hidden=true;
    const root=$('#certificateView');root.hidden=false;root.replaceChildren();
    const name=getName();
    if(!name){
      const form=el('div','certificate-fields');
      const label=el('label','','Your name (one-time confirmation)');const input=document.createElement('input');
      input.type='text';input.maxLength=60;input.placeholder='Enter your full name';input.autocomplete='name';label.append(input);form.append(label);
      form.append(btn('Confirm name permanently',()=>{
        const value=input.value.trim().replace(/\s+/g,' ');
        if(value.length<2||!/[A-Za-z\u00c0-\u024f\u0600-\u06ff]/u.test(value)){input.setCustomValidity('Enter your full name.');input.reportValidity();return;}
        input.setCustomValidity('');
        if(!confirm('Confirm certificate name as "'+value+'"? You will not be able to change it within GearEx after confirmation.'))return;
        try{localStorage.setItem(nameKey,value);}catch{alert('This browser is not allowing local certificate storage. Enable local storage and try again.');return;}
        showCertificate(lang);
      },'button primary compact'));
      root.append(el('h3','','Confirm your certificate name'),el('p','','You may enter the recipient name only once. After confirmation, GearEx does not offer an edit action for this browser.'),form);
    }else{
      const s=snapshot(lang);
      root.append(el('p','section-note','Recipient locked for this browser: '+name));
      root.append(paper(s,lang,name));
      root.append(btn('Print / Save as PDF',()=>window.print(),'button primary compact'));
    }
    root.scrollIntoView({behavior:'smooth',block:'start'});
  }
  drawCards();
  document.addEventListener('click',e=>{
    if(e.target.closest('#lessonContent button,#resetProgress,#importProgress'))setTimeout(drawCards,0);
  });
  window.addEventListener('hashchange',()=>{if(location.hash==='#certificate')drawCards();});
})();