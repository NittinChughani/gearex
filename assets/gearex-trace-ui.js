/* GearEx Studio trace interface — all controls and illustrations are native to this site. */
'use strict';
(() => {
  const E=window.GearExEngine,$=s=>document.querySelector(s);
  const create=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=String(value);return el;};
  const button=(text,fn,cls='button secondary compact')=>{const el=create('button',cls,text);el.type='button';el.addEventListener('click',fn);return el;};
  const code=$('#traceSource'),picker=$('#traceLanguage'),target=$('#traceSteps'),
    status=$('#traceProgress'),prev=$('#traceBack'),next=$('#traceNext'),reset=$('#traceReset'),go=$('#traceStart');
  const play=$('#tracePlay'),sample=$('#traceSample'),hint=$('#traceMismatch'),chooser=$('#traceModeChooser'),manual=$('#traceManualMode'),automatic=$('#traceAutoMode');
  const mirror=$('#traceMirrorLines'),feedback=$('#traceCheckFeedback');
  let result=null,index=0,clock=null,sourceHint='py',inputs=[],mode='manual';
  const demos={
    py:"numbers = [2, 4, 6]\nshared = numbers\nshared.append(8)\nfor n in numbers:\n    print(n)",
    js:"const values = [10, 20];\nconst shared = values;\nshared.push(30);\nfor (let i = 0; i < 3; i++) {\n  console.log(values[i]);\n}",
    c:"#include <stdio.h>\nint add(int a, int b) {\n  int total = a + b;\n  return total;\n}\nint main(void) {\n  int value = add(4, 5);\n  printf(\"%d\\n\", value);\n  return 0;\n}",
    cpp:"#include <iostream>\nint main() {\n  int total = 0;\n  for (int i = 1; i <= 3; i++) {\n    total += i;\n  }\n  std::cout << total << std::endl;\n  return 0;\n}",
    java:"public class Main {\n  public static void main(String[] args) {\n    int score = 8;\n    score += 4;\n    System.out.println(score);\n  }\n}",
    cs:"using System;\nclass Program {\n  static void Main() {\n    int score = 8;\n    score += 4;\n    Console.WriteLine(score);\n  }\n}",
    sql:"SELECT name, score\nFROM learners\nWHERE score >= 80\nORDER BY score DESC;"
  };
  function syncEditorMirror(){
    mirror.style.transform='translate('+(-code.scrollLeft)+'px,'+(-code.scrollTop)+'px)';
  }
  function renderEditorLines(errors=[]){
    const highlighted=new Set(errors.map(e=>Number(e.line)));
    mirror.replaceChildren();
    code.value.split(/\r?\n/).forEach((line,index)=>{
      const row=create('div','trace-source-mirror-line'+(highlighted.has(index+1)?' has-error':''),line||' ');
      row.dataset.line=String(index+1);
      mirror.append(row);
    });
    syncEditorMirror();
  }
  function focusSourceLine(line){
    const rows=code.value.split(/\r?\n/),index=Math.min(rows.length,Math.max(1,Number(line)||1))-1;
    const start=rows.slice(0,index).reduce((n,item)=>n+item.length+1,0);
    code.focus();
    code.setSelectionRange(start,start+rows[index].length);
    const height=Number.parseFloat(getComputedStyle(code).lineHeight)||23;
    code.scrollTop=Math.max(0,(index-2)*height);
    syncEditorMirror();
  }
  function showCheckFeedback(issues=[],ready=false,language=''){
    if(issues.length){
      feedback.hidden=false;
      feedback.className='trace-check-feedback has-errors';
      feedback.replaceChildren();
      for(const issue of issues){
        const row=create('div','trace-check-error');
        const jump=create('button','trace-check-line','Line '+issue.line);
        jump.type='button';jump.addEventListener('click',()=>focusSourceLine(issue.line));
        row.append(jump,create('span','trace-check-message',issue.message));
        feedback.append(row);
      }
      renderEditorLines(issues);
      return;
    }
    renderEditorLines();
    if(ready){
      feedback.hidden=false;
      feedback.className='trace-check-feedback is-ready';
      feedback.replaceChildren(create('span','trace-check-ready-icon','✓'),
        create('strong','',language==='sql'?'SQL outline ready (query not executed)':'Code is Ready for Tracing'));
    }else{
      feedback.hidden=true;
      feedback.replaceChildren();
      feedback.className='trace-check-feedback';
    }
  }
  function stop(){
    if(clock)clearInterval(clock);
    clock=null;
    play.textContent='Play trace';
    play.setAttribute('aria-pressed','false');
  }
  function closeChooser(){chooser.hidden=true;}
  function startAuto(){
    if(!result)return;
    if(index===result.steps.length-1){
      if(result.pendingInput){render();return;}
      index=0;render();
    }
    stop();
    play.textContent='Pause auto run';
    play.setAttribute('aria-pressed','true');
    clock=setInterval(()=>{
      if(!result){stop();return;}
      if(index>=result.steps.length-1){stop();return;}
      index++;render();
      if(index>=result.steps.length-1)stop();
    },1250);
  }
  function actualLanguage(){
    const fallback=picker.value!=='auto'?picker.value:sourceHint;
    return E.detect(code.value,fallback);
  }
  function updateLanguageInfo(){
    const detected=actualLanguage();
    hint.replaceChildren();
    hint.append(create('span','language-indicator','Detected: '+E.LABEL[detected]));
    if(picker.value!=='auto'&&picker.value!==detected){
      hint.append(create('span','','The source looks like '+E.LABEL[detected]+'. GearEx will trace the detected language automatically.'));
    }else{
      hint.append(create('span','trace-hint','Automatic language recognition · no configuration needed'));
    }
  }
  function load(codeText,lang='auto',navigate=true){
    stop();closeChooser();inputs=[];mode='manual';code.value=String(codeText||'');picker.value='auto';
    showCheckFeedback();
    sourceHint=E.LABEL[lang]?lang:'py';
    result=null;index=0;updateLanguageInfo();
    target.replaceChildren(create('div','trace-empty','Ready to trace. Select “Check code & build trace” to inspect the stack, heap, variables and output.'));
    status.classList.remove('trace-status-error');
    status.textContent='Editor ready';
    prev.disabled=true;next.disabled=true;
    if(navigate)location.hash='trace';
  }
  window.gearexTraceLesson=load;
  function variableRow(key,value){
    const row=create('div','memory-row');
    row.append(create('span','memory-key',key));
    const box=create('code','memory-value',value);
    if(String(value).startsWith('#'))box.classList.add('is-reference');
    row.append(box);return row;
  }
  function memoryPanel(title,sub){
    const panel=create('section','memory-panel');
    const top=create('div','memory-panel-head');
    top.append(create('strong','',title),create('span','memory-count',sub));
    panel.append(top);return panel;
  }
  function render(){
    if(!result||!result.steps.length){status.textContent='No steps';return;}
    const step=result.steps[index],last=result.steps.length-1;
    status.textContent='Step '+index+' / '+last+' · '+E.LABEL[result.lang];
    prev.disabled=index===0;next.disabled=index===last;
    target.replaceChildren();
    const head=create('div','trace-live-heading');
    head.append(create('span','trace-live-badge',result.mode==='sql-plan'?'Query outline':'Native execution · teaching subset'),
      create('span','trace-live-counter','Step '+String(index).padStart(2,'0')+' / '+String(last).padStart(2,'0')));
    target.append(head);
    const explanation=create('div','trace-explanation');
    explanation.append(create('span','trace-explanation-index','WHAT HAPPENS HERE'),
      create('p','',step.note));
    target.append(explanation);
    const layout=create('div','gear-runtime-grid');
    const sourcePane=memoryPanel('Source timeline','highlighted step');
    const sourceRows=create('div','trace-code-lines');
    for(const [i,line] of result.lines.entries()){
      if(i>200)break;
      const row=create('div','trace-code-row'+(i+1===step.line?' active':''));
      row.append(create('span','trace-code-gutter',String(i+1).padStart(2,'0')),
        create('code','trace-code-text',line||' '));
      if(i+1===step.line)row.setAttribute('aria-current','step');
      sourceRows.append(row);
    }
    sourcePane.append(sourceRows);layout.append(sourcePane);
    const memoryArea=create('div','runtime-memory');
    const stack=memoryPanel('Call stack',step.frames.length+' frame'+(step.frames.length===1?'':'s'));
    if(!step.frames.length)stack.append(create('p','memory-empty','No active frames.'));
    for(const frame of [...step.frames].reverse()){
      const card=create('div','stack-card');card.append(create('div','stack-card-title',frame.name));
      const entries=Object.entries(frame.vars||{});
      if(!entries.length)card.append(create('p','memory-empty','No variables yet'));
      else for(const [key,value] of entries)card.append(variableRow(key,value));
      stack.append(card);
    }
    const heap=memoryPanel('Heap memory',step.heap.length+' allocation'+(step.heap.length===1?'':'s'));
    if(!step.heap.length)heap.append(create('p','memory-empty','Arrays and objects will appear here as they are allocated.'));
    for(const slot of step.heap){
      const card=create('div','heap-card');
      const label=create('div','stack-card-title');
      label.append(create('span','',slot.id),create('small','',slot.kind));
      card.append(label);
      for(const item of slot.items.slice(0,32))card.append(variableRow('['+item.key+']',item.value));
      if(slot.items.length>32)card.append(create('p','memory-empty','… '+(slot.items.length-32)+' more entries'));
      heap.append(card);
    }
    const output=memoryPanel('Standard output','program output');
    output.append(create('pre','runtime-console',step.output||'No output yet.'));
    memoryArea.append(stack,heap,output);
    layout.append(memoryArea);target.append(layout);
    if(result.warnings.length){
      const warning=create('div','trace-coverage-note');
      warning.append(create('strong','','Trace coverage note'),create('p','',result.warnings.join(' ')));
      target.append(warning);
    }else if(result.mode==='sql-plan'){
      target.append(create('p','trace-coverage-note','SQL view explains query stages only. It does not execute SQL or invent results.'));
    }else{
      target.append(create('p','trace-coverage-note','This is a local teaching interpreter for common statements, loops, functions, arrays and objects—not a complete compiler or debugger. Some library calls, classes and advanced syntax are outside its scope.'));
    }
    if(index===last&&!result.pendingInput&&!result.warnings?.length){
      stop();
      const sql=result.mode==='sql-plan';
      const finished=create('section','trace-finished');
      finished.setAttribute('role','status');
      const head=create('div','trace-finished-heading');
      head.append(create('span','trace-finished-check','✓'),
        create('strong','',sql?'Query outline complete':'Program ended'));
      finished.append(head,
        create('p','',sql?
          'The conceptual SQL walkthrough is complete. For a real query result, use the Compiler.':
          'You reached the end of execution. Review the output and memory state, or start the visualizer again.'));
      const restart=button(sql?'↻ Review outline again':'↻ Run visualizer again',()=>{prepare();index=0;render();},'button primary compact');
      restart.id='traceRunAgain';
      finished.append(restart);
      target.append(finished);
      status.textContent=(sql?'Query outline complete':'Program ended')+' · '+E.LABEL[result.lang];
    }
    if(result.pendingInput&&index===last){
      stop();
      const prompt=result.pendingInput;
      const form=create('form','trace-interactive-input');
      form.id='traceInputForm';
      form.append(create('span','eyebrow','INPUT REQUEST · PAUSED'));
      form.append(create('h3','','The program is waiting for input'));
      const label=create('label','',prompt.prompt);
      label.htmlFor='traceInputValue';
      const input=document.createElement('input');
      input.id='traceInputValue';input.type='text';input.autocomplete='off';input.spellcheck=false;
      input.placeholder=prompt.type==='number'?'Enter a number':'Enter input here';
      input.setAttribute('aria-label',prompt.prompt);
      const submit=create('button','button primary compact','Submit input & continue');submit.type='submit';
      form.append(label,input,submit);
      form.append(create('p','trace-input-help','Step-by-step execution pauses here until you provide a value. It will never skip this input.'));
      form.addEventListener('submit',event=>{
        event.preventDefault();
        if(prompt.type==='number'&&(!input.value.trim()||!Number.isFinite(Number(input.value)))){
          input.setCustomValidity('Please enter a valid number.');
          input.reportValidity();
          return;
        }
        input.setCustomValidity('');
        const oldIndex=index;
        const resumeAuto=mode==='auto';
        const candidate=E.run(code.value,actualLanguage(),{inputs:[...inputs,input.value]});
        if(candidate.warnings.some(w=>/Expected a valid (?:integer|number)|A numeric value is required/.test(w))){
          input.setCustomValidity('Please provide a valid number for this input.');
          input.reportValidity();
          return;
        }
        if(traceErrors(candidate,actualLanguage()))return;
        inputs.push(input.value);
        result=candidate;
        index=Math.min(oldIndex+1,result.steps.length-1);
        render();
        if(resumeAuto && !(result.pendingInput&&index===result.steps.length-1))startAuto();
      });
      target.append(form);
      input.focus({preventScroll:true});
      status.textContent='Waiting for input '+(prompt.index+1)+' · '+E.LABEL[result.lang];
    }
    const active=target.querySelector('.trace-code-row.active');
    if(active)active.scrollIntoView({block:'nearest',behavior:'auto'});
  }
  function showDiagnostics(issues,language){
    stop();closeChooser();result=null;
    prev.disabled=true;next.disabled=true;
    target.replaceChildren();
    showCheckFeedback(issues);
    const first=issues[0];
    status.textContent=first?'Line '+first.line+': '+first.message:'Code could not be traced';
    status.classList.add('trace-status-error');
    if(first)focusSourceLine(first.line);
  }
  function traceErrors(candidate,language){
    if(!candidate.warnings?.length)return false;
    const issues=(candidate.errors?.length?candidate.errors:candidate.warnings.map(message=>({line:1,message,kind:'runtime'})));
    showDiagnostics(issues,language);
    return true;
  }
  function prepare(){
    stop();closeChooser();inputs=[];mode='manual';
    status.classList.remove('trace-status-error');
    showCheckFeedback();
    const text=code.value;
    if(!text.trim()){showDiagnostics([{line:1,message:'Enter code to visualize.',kind:'syntax'}],actualLanguage());return;}
    if(text.length>9000){showDiagnostics([{line:1,message:'Use an example under 9,000 characters for this educational trace.',kind:'syntax'}],actualLanguage());return;}
    const language=actualLanguage();
    try{
      status.textContent='Checking code before trace…';
      const check=E.validate(text,language);
      if(!check.ok){showDiagnostics(check.issues,language);return;}
      const candidate=E.run(text,language,{inputs});
      if(traceErrors(candidate,language))return;
      if(!candidate.steps.length)throw Error('No traceable statements were found.');
      result=candidate;index=0;
      updateLanguageInfo();
      showCheckFeedback([],true,language);
      render();
    }catch(e){
      showDiagnostics([{line:1,kind:'unsupported',message:String(e.message||e)}],language);
    }
  }
  go.addEventListener('click',prepare);
  prev.addEventListener('click',()=>{
    if(result&&index>0){stop();closeChooser();mode='manual';index--;render();}
  });
  next.addEventListener('click',()=>{
    if(result&&index<result.steps.length-1){stop();closeChooser();mode='manual';index++;render();}
  });
  reset.addEventListener('click',()=>{stop();closeChooser();mode='manual';index=0;render();});
  play.addEventListener('click',()=>{
    if(clock){stop();return;}
    if(!result)prepare();
    if(!result)return;
    chooser.hidden=false;
    manual.focus();
  });
  manual.addEventListener('click',()=>{
    closeChooser();stop();mode='manual';
    status.textContent='Manual mode · use Next step to continue';
    if(result.pendingInput&&index===result.steps.length-1)render();
    else next.focus();
  });
  automatic.addEventListener('click',()=>{
    closeChooser();mode='auto';startAuto();
  });
  const order=['py','js','c','cpp','java','cs','sql'];let n=0;
  sample.addEventListener('click',()=>{const lang=order[(n++)%order.length];load(demos[lang],lang);prepare();});
  $('#traceFromEditor').addEventListener('click',()=>load($('#codeEditor').value,$('#editorLanguage').value));
  picker.addEventListener('change',()=>{sourceHint=picker.value==='auto'?sourceHint:picker.value;updateLanguageInfo();stop();closeChooser();inputs=[];mode='manual';result=null;showCheckFeedback();status.classList.remove('trace-status-error');status.textContent='Language changed · check code again';prev.disabled=true;next.disabled=true;target.replaceChildren(create('p','trace-empty','Language updated. Check the source before tracing.'));});
  code.addEventListener('input',()=>{stop();closeChooser();inputs=[];mode='manual';result=null;updateLanguageInfo();showCheckFeedback();status.classList.remove('trace-status-error');status.textContent='Source modified · check again';prev.disabled=true;next.disabled=true;target.replaceChildren(create('p','trace-empty','Code changed. Check the source again to rebuild the trace.'));});
  code.addEventListener('scroll',syncEditorMirror);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  const direct=button('Trace my code',()=>load($('#codeEditor').value,$('#editorLanguage').value));
  direct.id='sendToVisualizer';$('#runCode').before(direct);
  load(demos.py,'py',false);
})();
