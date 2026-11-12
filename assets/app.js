/* GearEx — plain JavaScript, GitHub Pages compatible.
   User content is inserted with textContent, never interpreted as HTML.
   Multi-language compilation is OPTIONAL and runs on the third-party Wandbox service. */
'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const STORE_KEY = 'codelab-academy-complete-v2';
const LEGACY_KEY = 'codelab-academy-v1';
const lessonIds = new Set(LESSONS.map(x => x.id));
const challengeIds = new Set(CHALLENGES.map(x => x.id));
const projectIds = new Set(PROJECTS.map(x => x.id));
const safeRead = key => { try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value && typeof value === 'object' && !Array.isArray(value) ? value : null; } catch { return null; } };
const legacy = safeRead(LEGACY_KEY) || {};
const stored = safeRead(STORE_KEY) || {};
const restoreList = (value, allowed) => new Set((Array.isArray(value) ? value : []).filter(id => typeof id === 'string' && allowed.has(id)));
let previousPractice = [];
try { previousPractice = JSON.parse(localStorage.getItem('codelab-practiced') || '[]'); } catch { previousPractice = []; }
const state = {
  theme: ['none','cyberpunk','quantum','synthwave','matrix'].includes(stored.theme) ? stored.theme : 'none',
  mode: stored.mode==='dark'?'dark':'light',
  completed: restoreList(stored.completed || legacy.completed, lessonIds),
  bookmarks: restoreList(stored.bookmarks || legacy.bookmarks, lessonIds),
  practiced: restoreList(stored.practiced || previousPractice, lessonIds),
  passed: restoreList(stored.passed, challengeIds),
  tried: restoreList(stored.tried, challengeIds),
  projects: restoreList(stored.projects, projectIds),
  best: stored.best || legacy.best || null,
  quizAttempts: Math.max(0, Number(stored.quizAttempts) || 0),
  drafts: stored.drafts && typeof stored.drafts === 'object' && !Array.isArray(stored.drafts) ? stored.drafts : {},
  roadmap: 'c', lessonFilter: 'all', lessonSearch: '', challengeFilter: 'all', challengeDifficulty: 'all', challengeSearch: '', challengeLimit: 12,
  currentChallenge: null, visual: 'loops', loopStep: 0, arrayIndex: 0, pointerValue: 12,
  quiz: [], quizIndex: 0, quizScore: 0, quizSelected: null, quizMissed: [], quizRetry: false
};
function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify({theme:state.theme,mode:state.mode,completed:[...state.completed],bookmarks:[...state.bookmarks],practiced:[...state.practiced],passed:[...state.passed],tried:[...state.tried],projects:[...state.projects],best:state.best,quizAttempts:state.quizAttempts,drafts:state.drafts})); } catch { /* Browser storage may be disabled. */ } }
const make = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
const text = (selector, value) => { const node = $(selector); if (node) node.textContent = String(value); };
const normal = value => String(value || '').trim().replace(/\s+/g, ' ');
const clamp = (n, low, high) => Math.min(high, Math.max(low, Number.isFinite(Number(n)) ? Number(n) : low));
function updateStats() {
  text('#lessonCount', LESSONS.length); text('#challengeCount', CHALLENGES.length); text('#quizCount', QUESTIONS.length); text('#completedCount', state.completed.size);
  text('#dashboardLessons', `${state.completed.size}/${LESSONS.length}`); text('#dashboardChallenges', `${state.passed.size}/${CHALLENGES.length}`);
  text('#dashboardBookmarks', state.bookmarks.size); text('#dashboardProjects', `${state.projects.size}/${PROJECTS.length}`); text('#dashboardQuizRuns', state.quizAttempts);
  text('#dashboardBest', state.best && typeof state.best.percent === 'number' ? `${state.best.percent}%` : '—');
  const lp = Math.round(state.completed.size / LESSONS.length * 100), cp = Math.round(state.passed.size / CHALLENGES.length * 100);
  text('#lessonProgressLabel', `${lp}%`);text('#challengeProgressLabel', `${cp}%`);
  $('#lessonProgressBar').style.width = lp + '%'; $('#challengeProgressBar').style.width = cp + '%';
}
function setTheme() {
  const mode=state.mode==='dark'?'dark':'light';
  document.body.dataset.theme=state.theme;
  document.body.dataset.mode=mode;
  document.body.classList.toggle('light',mode==='light');
  document.documentElement.style.colorScheme=mode;
  const toggle=$('#modeSwitch');
  if(toggle){toggle.checked=mode==='dark';toggle.setAttribute('aria-checked',String(toggle.checked));}
  text('#modeLabel',mode==='dark'?'Dark mode':'Light mode');
  $$('[data-palette]').forEach(button=>{
    const active=button.dataset.palette===state.theme;
    button.classList.toggle('is-selected',active);
    button.setAttribute('aria-pressed',String(active));
  });
  const meta=$('meta[name="theme-color"]');
  if(meta)meta.content=mode==='light'?'#f6f8f7':({none:'#0e151a',cyberpunk:'#0e151b',quantum:'#08191b',synthwave:'#191526',matrix:'#10191c'}[state.theme]||'#0e151a');
}
function setActiveButtons(selector, attr, value) { $$(selector).forEach(button => {const active = button.dataset[attr] === value; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));}); }
function linkButton(label, href, className='button secondary compact') {const a=make('a',className,label);a.href=href;return a;}
function addList(parent, items, className='') { const ul=make('ul',className); items.forEach(item=>ul.append(make('li','',item))); parent.append(ul); return ul; }
async function copyContent(value, button) { try { await navigator.clipboard.writeText(value); button.textContent='✓ Copied'; } catch { button.textContent='Copy unavailable — select the text instead'; } window.setTimeout(()=>{ if(button.isConnected)button.textContent=button.dataset.original || 'Copy'; },1900); }
function plainCodeBlock(source) {const pre=make('pre','code-sample'); pre.append(make('code','',source));return pre;}
function renderRoadmap() {
  const all = LESSONS.filter(l=>l.lang===state.roadmap);
  const completed = all.filter(l=>state.completed.has(l.id)).length;
  text('#roadmapProgress',`${completed} / ${all.length} lessons completed`);$('#roadmapBar').style.width=`${Math.round(completed/all.length*100)}%`;
  setActiveButtons('[data-roadmap]', 'roadmap', state.roadmap);
  const grid=$('#roadmapGrid');grid.replaceChildren();
  const next=all.find(l=>!state.completed.has(l.id));
  all.forEach((l,i)=>{const done=state.completed.has(l.id);const card=make('a',`roadmap-step ${done?'is-done':''} ${next&&next.id===l.id?'is-next':''}`);card.href='#lesson/'+l.id;
    const idx=make('span','step-num',done?'✓':String(i+1).padStart(2,'0'));const info=make('span','step-copy');info.append(make('strong','',l.title),make('small','',`${l.level}${next&&next.id===l.id?' · Up next':''}`));card.append(idx,info,make('span','roadmap-arrow','↗'));grid.append(card);});
}
function renderLessons() {
  const q=state.lessonSearch.toLowerCase();const matched=LESSONS.filter(l=>(state.lessonFilter==='all'||l.lang===state.lessonFilter||(state.lessonFilter==='bookmarks'&&state.bookmarks.has(l.id)))&&[l.title,l.description,l.level,...l.points].join(' ').toLowerCase().includes(q));
  const grid=$('#lessonGrid');grid.replaceChildren();$('#emptyState').hidden=matched.length!==0;
  for(const l of matched){const card=make('article','lesson-card');const top=make('div','card-top');top.append(make('span',`tag ${l.lang}`,l.lang==='c'?'C':l.lang==='cpp'?'C++':GEAREX_LANGUAGES[l.lang]),make('span','check',state.completed.has(l.id)?'✓ Completed':l.level));card.append(top,make('h3','',l.title),make('p','',l.description));const actions=make('div','card-actions');actions.append(linkButton('Open lesson →','#lesson/'+l.id,'card-link'));const saved=state.bookmarks.has(l.id);const bookmark=make('button','bookmark-button',saved?'★ Saved':'☆ Save');bookmark.type='button';bookmark.setAttribute('aria-label',`${saved?'Remove bookmark':'Save lesson'}: ${l.title}`);bookmark.addEventListener('click',()=>{saved?state.bookmarks.delete(l.id):state.bookmarks.add(l.id);persist();updateStats();renderLessons();});actions.append(bookmark);card.append(actions);grid.append(card);}
}
function renderLessonDetail(id) {
  const lesson=LESSONS.find(l=>l.id===id);if(!lesson)return false;
  const root=$('#lessonContent');root.replaceChildren();const article=make('article','lesson-body');article.append(make('span','eyebrow',`${lesson.lang==='c'?'C LANGUAGE':lesson.lang==='cpp'?'C++':GEAREX_LANGUAGES[lesson.lang]} • ${lesson.level}`),make('h2','',lesson.title),make('p','lede',lesson.intro));
  const goals=make('div','lesson-info');goals.append(make('h3','','What you will learn'));addList(goals,lesson.points);article.append(goals);
  article.append(make('h3','','Syntax essentials'),make('p','',lesson.syntax||lesson.points[0]));article.append(make('h3','','Example source code'),plainCodeBlock(lesson.code));
  const actions=make('div','lesson-actions');const copy=make('button','button secondary compact','Copy example');copy.type='button';copy.dataset.original='Copy example';copy.addEventListener('click',()=>copyContent(lesson.code,copy));const tryIt=make('button','button primary compact','▶ Try in compiler');tryIt.type='button';tryIt.addEventListener('click',()=>{loadIntoEditor(lesson.code,lesson.lang,`Lesson: ${lesson.title}`,null);location.hash='playground';});const trace=make('button','button secondary compact','◎ Visualize step by step');trace.type='button';trace.addEventListener('click',()=>{window.gearexTraceLesson(lesson.code,lesson.lang);location.hash='trace';});actions.append(copy,tryIt,trace);article.append(actions);
  if(lesson.output){const out=make('div','example-output');out.append(make('strong','','Example output'));if(typeof INPUT_EXAMPLES!=='undefined'&&INPUT_EXAMPLES[id])out.append(make('p','muted-small','Example input: '+INPUT_EXAMPLES[id]));out.append(make('pre','',lesson.output));article.append(out);}
  const walkthrough=make('div','lesson-info');walkthrough.append(make('h3','','Walkthrough'),make('p','',lesson.walkthrough||'Read the code from top to bottom, tracing how each value changes.'));article.append(walkthrough);
  const mistake=make('div','tips');mistake.append(make('strong','','⚠ Common mistake'),make('p','',lesson.pitfalls||'Watch for types and boundary conditions.'));article.append(mistake);
  const challenge=make('div','challenge');challenge.append(make('h3','','Practice it yourself'),make('p','',lesson.challenge));
  const practice=make('label','practice-check');const box=make('input');box.type='checkbox';box.checked=state.practiced.has(id);box.addEventListener('change',()=>{box.checked?state.practiced.add(id):state.practiced.delete(id);persist();});practice.append(box,document.createTextNode(' I practiced this exercise'));challenge.append(practice);article.append(challenge);
  const completed=make('button','button primary lesson-complete-action',window.gearexLessonPassed?.(id)?'✓ Lesson check passed · Retake':'Take 5-question lesson check →');completed.type='button';completed.addEventListener('click',()=>window.gearexOpenLessonCheck(lesson));article.append(completed);
  const siblings=LESSONS.filter(l=>l.lang===lesson.lang),index=siblings.indexOf(lesson),links=make('div','lesson-nav');if(index>0)links.append(linkButton('← Previous lesson','#lesson/'+siblings[index-1].id));if(index<siblings.length-1)links.append(linkButton('Next lesson →','#lesson/'+siblings[index+1].id));article.append(links);root.append(article);return true;
}
function getFilteredChallenges() {return CHALLENGES.filter(c=> (state.challengeFilter==='all'||c.lang===state.challengeFilter||(state.challengeFilter==='passed'&&state.passed.has(c.id))) && (state.challengeDifficulty==='all'||c.level===state.challengeDifficulty) && [c.title,c.description,c.topic,c.level].join(' ').toLowerCase().includes(state.challengeSearch.toLowerCase()));}
function renderChallenges(){const all=getFilteredChallenges();const shown=all.slice(0,state.challengeLimit);const grid=$('#challengeGrid');grid.replaceChildren();text('#challengeResults',`Showing ${shown.length} of ${all.length} challenges · ${state.passed.size} sample-tested successfully`);$('#challengeEmpty').hidden=all.length!==0;$('#loadMoreChallenges').hidden=shown.length>=all.length;
  for(const c of shown){const card=make('article','lesson-card challenge-card');const top=make('div','card-top');top.append(make('span',`tag ${c.lang}`,c.lang==='c'?'C':'C++'),make('span','check',state.passed.has(c.id)?'✓ Sample passed':c.level));card.append(top,make('span','topic-label',c.topic),make('h3','',c.title),make('p','',c.description));const a=linkButton('Solve challenge →','#challenge/'+c.id,'card-link');card.append(a);grid.append(card);}
}
function starterFor(c){const note=`// ${c.title}: ${c.description}\n// TODO: read input, compute the answer, and print the result.\n`;
 if(c.lang==='c')return '#include <stdio.h>\n\n'+note+'int main(void) {\n    // Write your solution here.\n    return 0;\n}\n';
 return '#include <iostream>\n\n'+note+'int main() {\n    // Write your solution here.\n    return 0;\n}\n';}
function renderChallengeDetail(id){const c=CHALLENGES.find(x=>x.id===id);if(!c)return false;
 const root=$('#challengeContent');root.replaceChildren();const article=make('article','lesson-body');article.append(make('span','eyebrow',`${c.lang==='c'?'C':'C++'} • ${c.level} • ${c.topic}`),make('h2','',c.title),make('p','lede',c.description),make('p','',c.inputGuide));
 const samples=make('div','samples');samples.append(make('h3','','Sample input and output'));for(const [i,s] of c.samples.entries()){const panel=make('div','sample-card');panel.append(make('strong','',`Sample ${i+1}`));const pair=make('div','sample-grid');for(const [name,val] of [['Input',s.input],['Expected output',s.output]]){const col=make('div');col.append(make('span','',name),make('pre','',val));pair.append(col)}panel.append(pair);samples.append(panel);}article.append(samples);
 const actions=make('div','lesson-actions');const start=make('button','button primary','▶ Solve in compiler');start.type='button';start.addEventListener('click',()=>{const key='challenge:'+id;const draft=typeof state.drafts[key]==='string'?state.drafts[key]:starterFor(c);loadIntoEditor(draft,c.lang,`Challenge: ${c.title}`,id);$('#stdinInput').value=c.samples[0].input;location.hash='playground';});actions.append(start);const passed=make('span','status-inline',state.passed.has(id)?'✓ First sample passed previously':'Not sample-tested yet');actions.append(passed);article.append(actions);
 const hint=make('details','reveal');hint.append(make('summary','','Show a hint'),make('p','',c.hint));article.append(hint);
 const solution=make('details','reveal');solution.append(make('summary','','Reveal reference solution'),make('p','muted-small','Try your own approach first. This is one correct solution, not the only solution.'),plainCodeBlock(c.solution));const solutionCopy=make('button','button secondary compact','Copy reference');solutionCopy.dataset.original='Copy reference';solutionCopy.addEventListener('click',()=>copyContent(c.solution,solutionCopy));solution.append(solutionCopy);article.append(solution);
 const next=CHALLENGES.find(x=>x.lang===c.lang&&x.id!==id&&Number(x.id.split('-').at(-1))===Number(id.split('-').at(-1))+1);if(next)article.append(linkButton('Next challenge →','#challenge/'+next.id));root.append(article);return true;
}
function renderProjects(){const root=$('#projectsGrid');root.replaceChildren();for(const p of PROJECTS){const card=make('article','lesson-card');const top=make('div','card-top');top.append(make('span',`tag ${p.lang}`,p.lang==='c'?'C':'C++'),make('span','check',state.projects.has(p.id)?'✓ Completed':p.level));card.append(top,make('h3','',p.title),make('p','',p.description),make('small','topic-label',p.skills.join(' · ')),linkButton('View project brief →','#project/'+p.id,'card-link'));root.append(card);}}
function renderProjectDetail(id){const p=PROJECTS.find(p=>p.id===id);if(!p)return false;const root=$('#projectContent');root.replaceChildren();const body=make('article','lesson-body');body.append(make('span','eyebrow',`${p.lang==='c'?'C':'C++'} • ${p.level} PROJECT`),make('h2','',p.title),make('p','lede',p.description),make('h3','','What you will practice'));addList(body,p.skills);body.append(make('h3','','Build milestones'));const ol=make('ol','milestone-list');p.steps.forEach(s=>ol.append(make('li','',s)));body.append(ol);body.append(make('h3','','Definition of done'));addList(body,p.acceptance);body.append(make('h3','','Starter code'),plainCodeBlock(p.starter));const tip=make('details','reveal');tip.append(make('summary','','Show build tip'),make('p','',p.tip));body.append(tip);const actions=make('div','lesson-actions');const load=make('button','button primary','Start in compiler');load.addEventListener('click',()=>{loadIntoEditor(p.starter,p.lang,`Project: ${p.title}`,null);location.hash='playground';});const done=make('button','button secondary',state.projects.has(id)?'✓ Completed — undo':'I completed this project');done.addEventListener('click',()=>{state.projects.has(id)?state.projects.delete(id):state.projects.add(id);persist();updateStats();renderProjects();renderProjectDetail(id);});actions.append(load,done);body.append(actions);root.append(body);return true;}
function shuffle(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function newQuiz(){const lang=$('#quizLanguage').value;const size=$('#quizLength').value;const all=shuffle(QUESTIONS.filter(q=>lang==='all'||q.lang===lang));state.quiz=size==='all'?all:all.slice(0,Number(size));state.quizIndex=0;state.quizScore=0;state.quizSelected=null;state.quizMissed=[];state.quizRetry=false;renderQuiz();}
function renderQuiz(){const root=$('#quizContent');root.replaceChildren();const total=state.quiz.length;const idx=state.quizIndex;text('#quizProgress',idx>=total?'Finished':`Question ${idx+1} of ${total}`);$('#quizBar').style.width=`${total?idx/total*100:0}%`;
 if(!total){root.append(make('p','', 'No quiz questions are available for this selection.'));return;}
 if(idx>=total){$('#quizBar').style.width='100%';const percent=Math.round(state.quizScore/total*100);if(!state.quizRetry){state.quizAttempts++;if(!state.best||typeof state.best.percent!=='number'||percent>state.best.percent)state.best={percent,lang:$('#quizLanguage').selectedOptions[0].textContent};persist();updateStats();}
  root.append(make('span','eyebrow','QUIZ COMPLETED'),make('h3','quiz-result',`You scored ${state.quizScore} / ${total}`),make('p','',`${percent}% correct. ${percent===100?'Excellent work!': 'Read the explanations, then retry to build confidence.'}`));const actions=make('div','lesson-actions');const again=make('button','button primary','Start a new quiz');again.addEventListener('click',newQuiz);actions.append(again);
  if(state.quizMissed.length&&!state.quizRetry){const review=make('button','button secondary','Retry incorrect questions');review.addEventListener('click',()=>{state.quiz=shuffle(state.quizMissed);state.quizIndex=0;state.quizScore=0;state.quizSelected=null;state.quizRetry=true;renderQuiz();});actions.append(review);}
  root.append(actions);return;}
 const question=state.quiz[idx];root.append(make('span','quiz-context',question.lang==='c'?'C Programming':question.lang==='cpp'?'C++ Programming':GEAREX_LANGUAGES[question.lang]),make('h3','',question.question));
 question.options.forEach((option,i)=>{const btn=make('button','option',`${String.fromCharCode(65+i)}. ${option}`);btn.type='button';btn.disabled=state.quizSelected!==null;if(state.quizSelected!==null){if(i===question.answer)btn.classList.add('correct');else if(i===state.quizSelected)btn.classList.add('incorrect');}
 btn.addEventListener('click',()=>{if(state.quizSelected!==null)return;state.quizSelected=i;if(i===question.answer)state.quizScore++;else state.quizMissed.push(question);renderQuiz();});root.append(btn);});
 if(state.quizSelected!==null){const response=make('div','feedback');response.append(make('strong','',state.quizSelected===question.answer?'✓ Correct!':'Not quite — review this explanation.'));response.append(make('p','',question.explanation));root.append(response);const next=make('button','button primary quiz-next',idx===total-1?'View results →':'Next question →');next.addEventListener('click',()=>{state.quizIndex++;state.quizSelected=null;renderQuiz();});root.append(next);}
}
const examples={
 c:{hello:'#include <stdio.h>\n\nint main(void) {\n    printf("Hello, GearEx!\\n");\n    return 0;\n}\n',input:'#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    if (scanf("%d %d", &a, &b) == 2) {\n        printf("Sum = %d\\n", a + b);\n    }\n    return 0;\n}\n',loop:'#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d ", i);\n    }\n    printf("\\n");\n    return 0;\n}\n'},
 cpp:{hello:'#include <iostream>\n\nint main() {\n    std::cout << "Hello, GearEx!\\n";\n    return 0;\n}\n',input:'#include <iostream>\n\nint main() {\n    int a, b;\n    if (std::cin >> a >> b) {\n        std::cout << "Sum = " << a + b << "\\n";\n    }\n    return 0;\n}\n',loop:'#include <iostream>\n\nint main() {\n    for (int i = 1; i <= 5; ++i) {\n        std::cout << i << " ";\n    }\n    std::cout << "\\n";\n}\n'}
};
Object.assign(examples,GEAREX_STARTERS);
let editorSaveTimer=null;
function loadIntoEditor(code,lang,label,challengeId=null){const select=$('#editorLanguage');select.value=lang;$('#codeEditor').value=code;$('#stdinInput').value='';state.currentChallenge=challengeId;text('#editorStatus',label);$('#runResult').replaceChildren();text('#compilerOutput','Your program output appears here after you press Run code.');updateEditorView();}
function updateEditorView(){const source=$('#codeEditor').value,code=$('#editorHighlight code');code.replaceChildren();const tokens=/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|^\s*#\s*\w+|\b(?:alignas|auto|bool|break|case|catch|char|class|const|constexpr|continue|default|delete|do|double|else|enum|explicit|extern|false|float|for|friend|if|inline|int|long|namespace|new|nullptr|operator|override|private|protected|public|return|short|signed|sizeof|static|struct|switch|template|this|throw|true|try|typedef|typename|unsigned|using|virtual|void|volatile|while)\b|\b\d+(?:\.\d+)?\b/gm;let position=0,match;while((match=tokens.exec(source))){if(match.index>position)code.append(document.createTextNode(source.slice(position,match.index)));let style='token-keyword';if(match[0].startsWith('//')||match[0].startsWith('/*'))style='token-comment';else if(match[0].includes('#')&&match[0].trimStart().startsWith('#'))style='token-directive';else if(match[0][0]==='"'||match[0][0]==="'")style='token-string';else if(/^\d/.test(match[0]))style='token-number';code.append(make('span',style,match[0]));position=tokens.lastIndex;}code.append(document.createTextNode(source.slice(position)));if(source.endsWith('\n'))code.append(document.createTextNode(' '));const lineCount=Math.min(1200,source.split('\n').length);$('#editorLines').textContent=Array.from({length:lineCount},(_,i)=>i+1).join('\n');}
function saveEditorSoon(){if(editorSaveTimer)clearTimeout(editorSaveTimer);editorSaveTimer=setTimeout(()=>{const key=state.currentChallenge?'challenge:'+state.currentChallenge:'scratch:'+$('#editorLanguage').value;state.drafts[key]=$('#codeEditor').value.slice(0,24000);persist();},500);}
function editorSync(){const e=$('#codeEditor');$('#editorHighlight').scrollTop=e.scrollTop;$('#editorHighlight').scrollLeft=e.scrollLeft;$('#editorLines').scrollTop=e.scrollTop;}
async function runEditor(){
 const button=$('#runCode'),source=$('#codeEditor').value,stdin=$('#stdinInput').value;
 let lang=$('#editorLanguage').value;
 if(!source.trim()){text('#compilerOutput','Write some code before running it.');return;}
 if(source.length>24000||stdin.length>4000){text('#compilerOutput','Please keep code below 24,000 characters and input below 4,000 characters.');return;}
 const inferred=window.GearExEngine?.detect(source,lang)||lang;
 const names={c:'C',cpp:'C++',py:'Python',js:'JavaScript',java:'Java',cs:'C#',sql:'SQL'};
 if(Object.hasOwn(names,inferred)&&inferred!==lang){
   lang=inferred;
   $('#editorLanguage').value=lang;
   text('#editorStatus','Detected '+names[lang]+' from your code');
 }
 button.disabled=true;button.textContent='▶ Running…';
 const resultBox=$('#runResult');resultBox.replaceChildren();
 const info=make('p','section-note','Detected '+names[lang]+' · Preparing execution…');
 resultBox.append(info);
 text('#compilerOutput','Starting '+names[lang]+' runtime…');
 const startTime=performance.now();
 try{
   const result=await window.GearExCompiler.compile(source,lang,stdin,message=>{
     text('#compilerOutput',message);
     info.textContent='Detected '+names[lang]+' · '+message;
   });
   text('#compilerOutput',result.output.slice(0,20000));
   const seconds=((performance.now()-startTime)/1000).toFixed(1);
   info.textContent=names[lang]+' · '+result.backend+' · '+seconds+'s';
   resultBox.append(make('p',result.success?'run-success':'run-error',
     result.success?'✓ Program finished successfully.':'The compiler reported a program error. Check the output above.'));
   if(state.currentChallenge){
     const c=CHALLENGES.find(item=>item.id===state.currentChallenge);
     if(c&&c.lang===lang){
       state.tried.add(c.id);
       const sample=c.samples[0];
       if(normal(sample.input)===normal(stdin)){
         if(result.success&&normal(result.stdout)===normal(sample.output)){
           state.passed.add(c.id);
           resultBox.append(make('p','run-success','✓ First sample passed! This is not a full correctness guarantee.'));
         }else if(result.success){
           resultBox.append(make('p','run-error',
             'Sample mismatch. Expected: '+normal(sample.output)+' · Got: '+(normal(result.stdout)||'(empty)')));
         }
       }else resultBox.append(make('p','section-note','This input differs from the first sample; the attempt was not counted as a sample test.'));
       persist();updateStats();renderChallenges();
     }else if(c)resultBox.append(make('p','section-note','The detected language differs from the challenge language, so this run was not graded.'));
   }
 }catch(error){
   text('#compilerOutput','Execution service unavailable.\n'+(error?.message||'Please try again later.')+'\n\nThe code has not been executed. Try again when a compiler service is available.');
   info.textContent='Remote compiler services are temporarily unavailable.';
   resultBox.append(make('p','run-error','The error comes from the remote execution service, not necessarily from your code.'));
 }finally{button.disabled=false;button.textContent='▶ Run code';}
}
function visualTabs(){setActiveButtons('[data-visual]','visual',state.visual);const root=$('#visualContent');root.replaceChildren();
 if(state.visual==='loops'){
  const config=make('div','visual-top');const label=make('label','field-label','Loop count ');const input=make('input');input.type='number';input.min='1';input.max='12';input.value=$('#visualCount')?.value||'5';input.id='visualCount';label.append(input);config.append(label);root.append(config);const wrap=make('div','visual-loop');root.append(wrap);const explanation=make('p','visual-explanation');root.append(explanation);
  const update=()=>{const count=clamp(parseInt(input.value,10)||5,1,12);state.loopStep=Math.min(state.loopStep,count);wrap.replaceChildren();for(let i=1;i<=count;i++){const cell=make('div',`visual-cell ${i<=state.loopStep?'visited':''} ${i===state.loopStep?'current':''}`,String(i));wrap.append(cell);}explanation.textContent=state.loopStep?`Iteration ${state.loopStep}: i = ${state.loopStep}. The loop body executes, then i increases.`:`Before the first iteration: initialize i = 1, check i <= ${count}.`;};input.addEventListener('change',()=>{state.loopStep=0;update()});const controls=make('div','lesson-actions');const next=make('button','button primary compact','Next step →');next.addEventListener('click',()=>{const n=clamp(parseInt(input.value,10)||5,1,12);state.loopStep=(state.loopStep+1)%(n+1);update()});const reset=make('button','button secondary compact','Reset');reset.addEventListener('click',()=>{state.loopStep=0;update()});controls.append(next,reset);const snippet=plainCodeBlock('');root.append(controls,snippet);input.addEventListener('input',()=>{snippet.querySelector('code').textContent='for (int i = 1; i <= '+clamp(Number(input.value),1,12)+'; ++i) {\n    // Run one step\n}';});snippet.querySelector('code').textContent='for (int i = 1; i <= '+clamp(Number(input.value),1,12)+'; ++i) {\n    // Run one step\n}';update();
 }else if(state.visual==='arrays'){
  const label=make('label','field-label','Array values (comma-separated) ');const input=make('input');input.type='text';input.value='12, 24, 36, 48, 60';input.maxLength=100;label.append(input);root.append(label);const cells=make('div','visual-loop');root.append(cells);const info=make('p','visual-explanation');root.append(info);const update=()=>{const values=input.value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,10);state.arrayIndex=Math.min(state.arrayIndex,Math.max(0,values.length-1));cells.replaceChildren();values.forEach((v,i)=>{const c=make('button',`array-cell ${i===state.arrayIndex?'current':''}`);c.type='button';c.append(make('span','',v),make('small','',`[${i}]`));c.addEventListener('click',()=>{state.arrayIndex=i;update()});cells.append(c)});info.textContent=values.length?`array[${state.arrayIndex}] = ${values[state.arrayIndex]}. Arrays start at index 0; this array has ${values.length} elements.`:'Enter one or more comma-separated values.';};input.addEventListener('input',update);update();
 }else{
  const card=make('div','pointer-model');const name=make('div','pointer-block');name.append(make('small','','Variable: score'),make('strong','',state.pointerValue));const pointer=make('div','pointer-arrow','ptr → &score');const value=make('div','pointer-block');value.append(make('small','','Dereference: *ptr'),make('strong','',state.pointerValue));card.append(name,pointer,value);root.append(card);const info=make('p','visual-explanation','ptr refers to score. Writing through *ptr changes the original score too.');root.append(info);const inc=make('button','button primary compact','*ptr += 1');inc.addEventListener('click',()=>{state.pointerValue++;visualTabs()});const reset=make('button','button secondary compact','Reset');reset.addEventListener('click',()=>{state.pointerValue=12;visualTabs()});const actions=make('div','lesson-actions');actions.append(inc,reset);root.append(actions,plainCodeBlock('int score = 12;\nint *ptr = &score;\n*ptr += 1; // updates score'));}
}
function dashboardStatus(message){text('#dashboardMessage',message);}
function exportProgress(){const payload={app:'GearEx',version:2,exportedAt:new Date().toISOString(),progress:{theme:state.theme,mode:state.mode,completed:[...state.completed],bookmarks:[...state.bookmarks],practiced:[...state.practiced],passed:[...state.passed],tried:[...state.tried],projects:[...state.projects],best:state.best,quizAttempts:state.quizAttempts}};payload.certificates=window.gearexExportCertificates?window.gearexExportCertificates():{};payload.lessonChecks=window.gearexExportLessonChecks?window.gearexExportLessonChecks():{};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=make('a');a.href=url;a.download='gearex-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);dashboardStatus('Your progress file was prepared for download.');}
async function importProgress(file){if(!file)return;if(file.size>1024*1024){dashboardStatus('Import rejected: file is too large.');return;}try{const data=JSON.parse(await file.text());if(!['CodeLab Academy','GearEx'].includes(data.app)||!data.progress||typeof data.progress!=='object')throw new Error('Not a GearEx progress export.');const p=data.progress;state.completed=restoreList(p.completed,lessonIds);if(window.gearexImportLessonChecks)window.gearexImportLessonChecks(data.lessonChecks||{});state.completed=new Set([...state.completed].filter(id=>window.gearexLessonPassed?.(id)));state.bookmarks=restoreList(p.bookmarks,lessonIds);state.practiced=restoreList(p.practiced,lessonIds);state.passed=restoreList(p.passed,challengeIds);state.tried=restoreList(p.tried,challengeIds);state.projects=restoreList(p.projects,projectIds);state.quizAttempts=Math.floor(clamp(p.quizAttempts||0,0,1000000));state.best=p.best&&Number.isFinite(Number(p.best.percent))&&Number(p.best.percent)>=0&&Number(p.best.percent)<=100?{percent:Number(p.best.percent),lang:String(p.best.lang||'Quiz').slice(0,60)}:null;state.theme=['none','cyberpunk','quantum','synthwave','matrix'].includes(p.theme)?p.theme:'none';state.mode=p.mode==='dark'?'dark':'light';persist();if(window.gearexImportCertificates)window.gearexImportCertificates(data.certificates);setTheme();updateStats();renderLessons();renderRoadmap();renderChallenges();renderProjects();dashboardStatus('Progress imported successfully.');}catch(err){dashboardStatus('Import failed: '+err.message);}finally{$('#importFile').value='';}}
const GEAR_VIEWS=new Set(['home','path','learn','lessonDetail','practice','challengeDetail','playground','quiz','visualize','projects','projectDetail','dashboard','trace','certificate','about']);
function closeThemeMenu(refocus=false){
  const menu=$('#themeMenu'),launcher=$('#themeLauncher');
  if(!menu||!launcher)return;
  menu.hidden=true;launcher.setAttribute('aria-expanded','false');
  if(refocus)launcher.focus();
}
function route(){
  let hash='home';
  try{hash=decodeURIComponent(location.hash.slice(1))||'home';}catch{hash='home';}
  let target=null;
  if(hash.startsWith('lesson/')){
    if(renderLessonDetail(hash.slice(7)))target=$('#lessonDetail');
  }else if(hash.startsWith('challenge/')){
    if(renderChallengeDetail(hash.slice(10)))target=$('#challengeDetail');
  }else if(hash.startsWith('project/')){
    if(renderProjectDetail(hash.slice(8)))target=$('#projectDetail');
  }else if(GEAR_VIEWS.has(hash)){
    target=document.getElementById(hash);
  }
  if(!target)target=$('#home');
  const current=target.id;
  $$('main > [data-view]').forEach(panel=>{
    const visible=panel===target||(current==='home'&&panel.dataset.view==='home');
    panel.hidden=!visible;
    if(visible)panel.setAttribute('data-active','true');
    else panel.removeAttribute('data-active');
  });
  const navId=current==='lessonDetail'?'learn':current==='challengeDetail'?'practice':current==='projectDetail'?'projects':current;
  $$('.topbar nav a[href^="#"]').forEach(link=>{
    const active=link.getAttribute('href')==='#'+navId;
    link.classList.toggle('is-current',active);
    if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
  closeThemeMenu();
  window.scrollTo(0,0);
  window.dispatchEvent(new CustomEvent('gearex:viewchange',{detail:{view:current}}));
}
function init(){text('#year',new Date().getFullYear());setTheme();updateStats();renderLessons();renderRoadmap();renderChallenges();renderProjects();newQuiz();visualTabs();
 const scratch=state.drafts['scratch:cpp'];loadIntoEditor(typeof scratch==='string'?scratch:examples.cpp.hello,'cpp','Scratchpad',null);
 $$('[data-roadmap]').forEach(b=>b.addEventListener('click',()=>{state.roadmap=b.dataset.roadmap;renderRoadmap();}));
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.lessonFilter=b.dataset.filter;setActiveButtons('[data-filter]','filter',state.lessonFilter);renderLessons();}));
 $('#search').addEventListener('input',e=>{state.lessonSearch=e.target.value.trim().toLowerCase();renderLessons();});
 $$('[data-cfilter]').forEach(b=>b.addEventListener('click',()=>{state.challengeFilter=b.dataset.cfilter;state.challengeLimit=12;setActiveButtons('[data-cfilter]','cfilter',state.challengeFilter);renderChallenges();}));
 $('#challengeDifficulty').addEventListener('change',e=>{state.challengeDifficulty=e.target.value;state.challengeLimit=12;renderChallenges();});
 $('#challengeSearch').addEventListener('input',e=>{state.challengeSearch=e.target.value.trim().toLowerCase();state.challengeLimit=12;renderChallenges();});
 $('#loadMoreChallenges').addEventListener('click',()=>{state.challengeLimit+=12;renderChallenges();});
 $('#quizLanguage').addEventListener('change',newQuiz);$('#quizLength').addEventListener('change',newQuiz);$('#restartQuiz').addEventListener('click',newQuiz);
 $('#modeSwitch').addEventListener('change',event=>{
    state.mode=event.target.checked?'dark':'light';setTheme();persist();
  });
  $('#themeLauncher').addEventListener('click',()=>{
    const menu=$('#themeMenu'),open=menu.hidden;
    menu.hidden=!open;$('#themeLauncher').setAttribute('aria-expanded',String(open));
  });
  $$('[data-palette]').forEach(button=>button.addEventListener('click',()=>{
    state.theme=button.dataset.palette;setTheme();persist();closeThemeMenu(true);
  }));
  document.addEventListener('pointerdown',event=>{
    if(!event.target.closest('.palette-launcher'))closeThemeMenu();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!$('#themeMenu').hidden)closeThemeMenu(true);
  });
 $('#backLessons').addEventListener('click',()=>{location.hash='learn';});$('#backChallenges').addEventListener('click',()=>{location.hash='practice';});$('#backProjects').addEventListener('click',()=>{location.hash='projects';});
 $('#showBookmarks').addEventListener('click',()=>{state.lessonFilter='bookmarks';state.lessonSearch='';$('#search').value='';setActiveButtons('[data-filter]','filter',state.lessonFilter);renderLessons();location.hash='learn';});
 $('#exportProgress').addEventListener('click',exportProgress);$('#importProgress').addEventListener('click',()=>$('#importFile').click());$('#importFile').addEventListener('change',e=>importProgress(e.target.files[0]));
 $('#resetProgress').addEventListener('click',()=>{if(!confirm('Clear lessons, bookmarks, quiz scores, challenge and project progress on this device? This cannot be undone unless you exported a backup.'))return;state.completed.clear();state.bookmarks.clear();state.practiced.clear();state.passed.clear();state.tried.clear();state.projects.clear();state.best=null;state.quizAttempts=0;if(window.gearexResetLessonChecks)window.gearexResetLessonChecks();if(window.gearexResetCertificates)window.gearexResetCertificates();persist();updateStats();renderRoadmap();renderLessons();renderChallenges();renderProjects();dashboardStatus('Saved progress cleared.');});
 $$('[data-visual]').forEach(b=>b.addEventListener('click',()=>{state.visual=b.dataset.visual;visualTabs();}));
 const editor=$('#codeEditor');editor.addEventListener('input',()=>{updateEditorView();saveEditorSoon();});editor.addEventListener('scroll',editorSync);editor.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();editor.setRangeText('    ',editor.selectionStart,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input'));}else if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runEditor();}});
 $('#editorLanguage').addEventListener('change',e=>{const lang=e.target.value;const draft=state.drafts['scratch:'+lang];loadIntoEditor(typeof draft==='string'?draft:examples[lang][$('#starterExample').value],lang,'Scratchpad',null);});
 $('#starterExample').addEventListener('change',()=>{const lang=$('#editorLanguage').value;loadIntoEditor(examples[lang][$('#starterExample').value],lang,'Example: '+$('#starterExample').selectedOptions[0].textContent,null);});
 $('#resetEditor').addEventListener('click',()=>{const lang=$('#editorLanguage').value;loadIntoEditor(examples[lang][$('#starterExample').value],lang,'Scratchpad',null);saveEditorSoon();});
 $('#copyEditor').addEventListener('click',()=>{const btn=$('#copyEditor');btn.dataset.original='Copy code';copyContent($('#codeEditor').value,btn);});
 $('#clearOutput').addEventListener('click',()=>{text('#compilerOutput','Output cleared.');$('#runResult').replaceChildren();});
 $('#runCode').addEventListener('click',runEditor);window.addEventListener('hashchange',route);route();
}
init();
