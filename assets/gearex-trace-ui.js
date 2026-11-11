/* GearEx Studio trace interface — all controls and illustrations are native to this site. */
'use strict';
(() => {
  const E=window.GearExEngine,$=s=>document.querySelector(s);
  const create=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=String(value);return el;};
  const button=(text,fn,cls='button secondary compact')=>{const el=create('button',cls,text);el.type='button';el.addEventListener('click',fn);return el;};
  const code=$('#traceSource'),picker=$('#traceLanguage'),target=$('#traceSteps'),
    status=$('#traceProgress'),prev=$('#traceBack'),next=$('#traceNext'),reset=$('#traceReset'),go=$('#traceStart');
  const play=$('#tracePlay'),sample=$('#traceSample'),hint=$('#traceMismatch');
  let result=null,index=0,clock=null,sourceHint='py';
  const demos={
    py:"numbers = [2, 4, 6]\nshared = numbers\nshared.append(8)\nfor n in numbers:\n    print(n)",
    js:"const values = [10, 20];\nconst shared = values;\nshared.push(30);\nfor (let i = 0; i < 3; i++) {\n  console.log(values[i]);\n}",
    c:"#include <stdio.h>\nint add(int a, int b) {\n  int total = a + b;\n  return total;\n}\nint main(void) {\n  int value = add(4, 5);\n  printf(\"%d\\n\", value);\n  return 0;\n}",
    cpp:"#include <iostream>\nint main() {\n  int total = 0;\n  for (int i = 1; i <= 3; i++) {\n    total += i;\n  }\n  std::cout << total << std::endl;\n  return 0;\n}",
    java:"public class Main {\n  public static void main(String[] args) {\n    int score = 8;\n    score += 4;\n    System.out.println(score);\n  }\n}",
    cs:"using System;\nclass Program {\n  static void Main() {\n    int score = 8;\n    score += 4;\n    Console.WriteLine(score);\n  }\n}",
    sql:"SELECT name, score\nFROM learners\nWHERE score >= 80\nORDER BY score DESC;"
  };
  function stop(){if(clock)clearInterval(clock);clock=null;play.textContent='Play trace';play.setAttribute('aria-pressed','false');}
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
  function load(codeText,lang='auto'){
    stop();code.value=String(codeText||'');picker.value='auto';
    sourceHint=E.LABEL[lang]?lang:'py';
    result=null;index=0;updateLanguageInfo();
    target.replaceChildren(create('div','trace-empty','Ready to trace. Select “Build execution trace” to inspect the stack, heap, variables and output.'));
    status.textContent='Editor ready';
    prev.disabled=true;next.disabled=true;
    location.hash='trace';
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
    const active=target.querySelector('.trace-code-row.active');
    if(active)active.scrollIntoView({block:'nearest',behavior:'auto'});
  }
  function prepare(){
    stop();
    const text=code.value;
    if(!text.trim()){target.replaceChildren(create('p','trace-coverage-note','Enter code to visualize.'));return;}
    if(text.length>9000){target.replaceChildren(create('p','trace-coverage-note','Use an example under 9,000 characters for this educational trace.'));return;}
    const language=actualLanguage();
    try{
      result=E.run(text,language);index=0;
      if(!result.steps.length)throw Error('No traceable statements were found.');
      updateLanguageInfo();render();
    }catch(e){
      result=null;target.replaceChildren(create('p','trace-coverage-note','This example uses syntax beyond the current visualizer: '+String(e.message||e)));
      status.textContent='Could not prepare this example';
    }
  }
  go.addEventListener('click',prepare);
  prev.addEventListener('click',()=>{if(result&&index>0){stop();index--;render();}});
  next.addEventListener('click',()=>{if(result&&index<result.steps.length-1){stop();index++;render();}});
  reset.addEventListener('click',()=>{stop();index=0;render();});
  play.addEventListener('click',()=>{
    if(clock){stop();return;}
    if(!result)prepare();if(!result)return;
    if(index>=result.steps.length-1)index=0;
    play.textContent='Pause trace';play.setAttribute('aria-pressed','true');
    clock=setInterval(()=>{if(!result||index>=result.steps.length-1){stop();return;}index++;render();},850);
  });
  const order=['py','js','c','cpp','java','cs','sql'];let n=0;
  sample.addEventListener('click',()=>{const lang=order[(n++)%order.length];load(demos[lang],lang);prepare();});
  $('#traceFromEditor').addEventListener('click',()=>load($('#codeEditor').value,$('#editorLanguage').value));
  picker.addEventListener('change',()=>{sourceHint=picker.value==='auto'?sourceHint:picker.value;updateLanguageInfo();stop();result=null;target.replaceChildren(create('p','trace-empty','Language updated. Build the trace for this source.'));});
  code.addEventListener('input',()=>{stop();result=null;updateLanguageInfo();status.textContent='Source modified';target.replaceChildren(create('p','trace-empty','Code changed. Build a new execution trace to inspect the latest version.'));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  const direct=button('Trace my code',()=>load($('#codeEditor').value,$('#editorLanguage').value));
  direct.id='sendToVisualizer';$('#runCode').before(direct);
  load(demos.py,'py');
})();
