/* GearEx achievement records, weighted final assessments and certificates. */
'use strict';
(() => {
  const LANG={c:'C',cpp:'C++',py:'Python',js:'JavaScript',java:'Java',cs:'C#',sql:'SQL'};
  const CERT_STYLES={
    c:{accent:'#2e5f82',soft:'#dceaf1',motif:'circuit',symbol:'C',subtitle:'Foundations of systems programming'},
    cpp:{accent:'#254b9a',soft:'#e1e9fa',motif:'geometry',symbol:'C++',subtitle:'Engineering with modern C++'},
    py:{accent:'#366c9a',soft:'#f3e9c4',motif:'flow',symbol:'Py',subtitle:'Problem solving with Python'},
    js:{accent:'#806b13',soft:'#fff3bf',motif:'web',symbol:'JS',subtitle:'Building for the modern web'},
    java:{accent:'#9b4739',soft:'#f4e4dd',motif:'architecture',symbol:'J',subtitle:'Object-oriented software development'},
    cs:{accent:'#67419d',soft:'#ebe2f7',motif:'framework',symbol:'C#',subtitle:'Application development with C#'},
    sql:{accent:'#157e7b',soft:'#d9f1ec',motif:'data',symbol:'SQL',subtitle:'Data management and querying'}
  };
  const $=s=>document.querySelector(s);
  const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n;};
  const btn=(text,fn,cls='button secondary compact')=>{const b=el('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;};
  const read=key=>{try{const d=JSON.parse(localStorage.getItem(key)||'{}');return d&&typeof d==='object'&&!Array.isArray(d)?d:{};}catch{return {};}};
  /* Completion and credentials: 70 marks lesson checks + 30 final assessment. */
  const certKey='gearex-certificates-v2',nameKey='gearex-certificate-name-v1';
  const final=read(certKey);
  const save=()=>{try{localStorage.setItem(certKey,JSON.stringify(final));window.dispatchEvent(new CustomEvent('gearex:progresschange'));}catch{}};
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
  /* Each credential has its own composition, not merely a shared recolored template.
   * All content is generated with textContent; the original logo file remains unchanged.
   * Visual-only decorations never carry score or identity information. */
  const gx=(tag,cls,...children)=>{
    const n=el(tag,cls);
    for(const child of children){
      if(child!==undefined&&child!==null)n.append(typeof child==='string'?document.createTextNode(child):child);
    }
    return n;
  };
  const gxBrand=()=>{
    const logo=el('img','gx-logo');
    logo.src='assets/favicon.svg';logo.alt='';logo.width=44;logo.height=44;
    logo.setAttribute('aria-hidden','true');
    return gx('div','gx-brand',logo,el('span','gx-wordmark','GEAREX'));
  };
  const gxTitle=()=>el('h2','gx-title','Certificate of Course Completion');
  const gxRecipient=name=>gx('div','gx-recipient',el('span','gx-overline','Presented to'),el('div','gx-recipient-name',name));
  const gxStatement=lang=>el('p','gx-statement','For completing the '+LANG[lang]+' learning path and successfully passing the final assessment.');
  const gxMetric=(label,value,cls='')=>gx('div','gx-metric '+cls,el('span','gx-metric-label',label),el('strong','gx-metric-value',String(value)));
  const gxScores=(s,lang,cls='')=>gx('div','gx-scores '+cls,
    gxMetric('Learning path',LANG[lang]),
    gxMetric('Lesson checks',s.earned+'/'+s.possible+' · '+s.lessonMarks+'/70'),
    gxMetric('Final assessment',s.record.score+'/'+s.record.total+' · '+s.examMarks+'/30'),
    gxMetric('Overall result',s.total+'/100 · '+performance(s.total))
  );
  const gxResult=s=>gx('div','gx-score-mark',el('span','gx-score-caption','OVERALL SCORE'),gx('div','gx-score-figure',el('strong','',String(s.total)),el('small','','/ 100')),el('span','gx-score-performance',performance(s.total)));
  const gxFooter=s=>gx('footer','gx-footer',
    gx('div','gx-issuer',el('span','gx-footer-label','ISSUED BY'),el('strong','','Nittin Chughani · GearEx creator')),
    gx('div','gx-issued',el('span','gx-footer-label','DATE OF ISSUE'),el('strong','',s.record.date)),
    el('p','gx-disclaimer','Creator-issued course achievement · Not an accredited or identity-verified credential')
  );
  const gxDecor=(cls,count)=>gx('div',cls,...Array.from({length:count},()=>gx('span','')));
  function paper(s,lang,name){
    const theme=CERT_STYLES[lang];
    const root=el('article','certificate-paper gx-cert gx-cert-'+lang);
    root.style.setProperty('--gx-accent',theme.accent);
    root.style.setProperty('--gx-soft',theme.soft);
    root.dataset.course=lang;
    root.setAttribute('aria-label',LANG[lang]+' course completion certificate for '+name);

    if(lang==='c'){
      /* Midnight blueprint: broad technical grid, engineer's diagram and horizontal data rail. */
      root.append(
        gx('header','gx-c-header',gxBrand(),el('span','gx-c-docket','FOUNDATIONS / 01    •    SYSTEMS PROGRAMMING')),
        gx('div','gx-c-body',
          gx('div','gx-c-message',el('span','gx-overline','GEAREX · PROGRAMMING FOUNDATIONS'),gxTitle(),gxRecipient(name),gxStatement(lang)),
          gx('div','gx-c-illustration',gxDecor('gx-c-traces',5),el('span','gx-c-glyph','C'),el('span','gx-c-orbit','{  }'),el('span','gx-c-diagram-label','SOURCE  →  EXECUTION'))
        ),
        gxScores(s,lang,'gx-c-scores'),
        gxFooter(s)
      );
    }else if(lang==='cpp'){
      /* Split editorial: saturated engineering spine and separate ivory award panel. */
      root.append(
        gx('div','gx-cpp-spine',
          gxBrand(),
          el('span','gx-cpp-edition','ADVANCED ENGINEERING'),
          el('span','gx-cpp-symbol','C++'),
          gxDecor('gx-cpp-prisms',3),
          el('span','gx-cpp-number','TRACK 02 / 07')
        ),
        gx('div','gx-cpp-article',
          el('span','gx-overline','A DISTINCTION IN SOFTWARE ENGINEERING'),
          gxTitle(),
          gxRecipient(name),
          gxStatement(lang),
          gxScores(s,lang,'gx-cpp-scores'),
          gxFooter(s)
        )
      );
    }else if(lang==='py'){
      /* Airy asymmetrical flowing ribbon with a golden achievement medallion. */
      root.append(
        gx('header','gx-py-header',gxBrand(),el('span','gx-py-track','THE PYTHON PATH · 03')),
        gx('div','gx-py-layout',
          gx('div','gx-py-art',gxDecor('gx-py-loop-art',3),el('span','gx-py-letter','Py'),el('span','gx-py-art-label','LEARN · BUILD · EXPLORE')),
          gx('div','gx-py-content',el('span','gx-overline','A JOURNEY IN PROBLEM SOLVING'),gxTitle(),gxRecipient(name),gxStatement(lang),gxScores(s,lang,'gx-py-scores'))
        ),
        gx('div','gx-py-closing',gxResult(s),gxFooter(s))
      );
    }else if(lang==='js'){
      /* High-contrast product-studio composition with a browser-window motif. */
      root.append(
        gx('header','gx-js-header',gxBrand(),el('span','gx-js-edition','WEB DEVELOPMENT / 04'),el('div','gx-js-symbol','JS.')),
        gx('div','gx-js-content',
          gx('section','gx-js-main',
            el('span','gx-overline','THE INTERACTIVE WEB'),
            gxTitle(),
            gxRecipient(name),
            gxStatement(lang),
            gx('div','gx-js-window',gxDecor('gx-js-window-dots',3),el('code','','const milestone = "earned";'))
          ),
          gx('aside','gx-js-score',gxResult(s),el('span','gx-js-score-note','PROGRESS COMMITTED'))
        ),
        gxScores(s,lang,'gx-js-scores'),
        gxFooter(s)
      );
    }else if(lang==='java'){
      /* Formal academic arch, ceremonial frame and symmetric typography. */
      root.append(
        gx('div','gx-java-arch',gxDecor('gx-java-keystone',3),
          gx('header','gx-java-header',gxBrand(),el('span','gx-java-line','SOFTWARE CRAFT · JAVA')),
          el('span','gx-java-emblem','J'),
          el('span','gx-overline','GEAREX · PROFESSIONAL LEARNING PATH'),
          gxTitle(),
          gxRecipient(name),
          gxStatement(lang),
          gxScores(s,lang,'gx-java-scores'),
          gxFooter(s)
        )
      );
    }else if(lang==='cs'){
      /* Modern purple architectural layout with offset typography and feature blocks. */
      root.append(
        gx('header','gx-cs-header',el('span','gx-cs-index','06 — APPLICATION ENGINEERING'),gxBrand()),
        gx('div','gx-cs-top',
          gx('div','gx-cs-editorial',el('span','gx-overline','C# DEVELOPMENT TRACK'),gxTitle(),gxRecipient(name),gxStatement(lang)),
          gx('aside','gx-cs-mark',gxDecor('gx-cs-bars',4),el('span','gx-cs-monogram','C#'),el('span','gx-cs-caption','BUILD WITH PRECISION'))
        ),
        gxScores(s,lang,'gx-cs-scores'),
        gxFooter(s)
      );
    }else{
      /* SQL: analytical report with query header, evidence table and score dial. */
      root.append(
        gx('header','gx-sql-toolbar',gxDecor('gx-sql-dots',3),el('span','gx-sql-path','achievement / sql / verified'),gxBrand()),
        gx('div','gx-sql-main',
          gx('section','gx-sql-left',el('span','gx-overline','QUERY COMPLETE · DATA TRACK 07'),gxTitle(),gxRecipient(name),gxStatement(lang)),
          gx('aside','gx-sql-result',gxResult(s),el('span','gx-sql-verification','ASSESSMENT RESULT / RECORDED'))
        ),
        gx('div','gx-sql-table',
          gx('div','gx-sql-table-head',el('span','','COURSE EVIDENCE'),el('span','','RESULT')),
          gx('div','gx-sql-row',el('span','','Language'),el('strong','',LANG[lang])),
          gx('div','gx-sql-row',el('span','','Lesson checks · 70% weight'),el('strong','',s.earned+'/'+s.possible+'  ·  '+s.lessonMarks+'/70')),
          gx('div','gx-sql-row',el('span','','Final assessment · 30% weight'),el('strong','',s.record.score+'/'+s.record.total+'  ·  '+s.examMarks+'/30')),
          gx('div','gx-sql-row',el('span','','Secured marks'),el('strong','',s.total+'/100')),
          gx('div','gx-sql-row',el('span','','Overall performance'),el('strong','',performance(s.total)))
        ),
        gxFooter(s)
      );
    }
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
        try{localStorage.setItem(nameKey,value);window.dispatchEvent(new CustomEvent('gearex:progresschange'));}catch{alert('This browser is not allowing local certificate storage. Enable local storage and try again.');return;}
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