'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const source = ['data.js', 'gearex-courses.js', 'gearex-courses-advanced.js', 'challenges.js', 'projects.js'].map(name => fs.readFileSync(path.join(root, 'assets', name), 'utf8')).join('\n');
const data = vm.runInNewContext(source + '\n({LESSONS,QUESTIONS,CHALLENGES,PROJECTS})');
const {LESSONS, QUESTIONS, CHALLENGES, PROJECTS} = data;
function checkUnique(name, list) {
  const seen = new Set();
  for (const row of list) {
    assert.equal(typeof row.id,'string',`${name}: id should be a string`);
    assert.ok(!seen.has(row.id), `${name}: duplicate ID ${row.id}`);
    seen.add(row.id);
    assert.ok(['c','cpp','py','js','java','cs','sql'].includes(row.lang),`${name}: invalid language in ${row.id}`);
    const label = name==='Questions' ? row.question : row.title;
    assert.ok(typeof label==='string'&&label.length>3,`${name}: missing text in ${row.id}`);
  }
}
checkUnique('Lessons',LESSONS);checkUnique('Questions',QUESTIONS);checkUnique('Challenges',CHALLENGES);checkUnique('Projects',PROJECTS);
for (const l of LESSONS) {
  assert.ok(Array.isArray(l.points)&&l.points.length>=2,`${l.id}: missing teaching points`);
  for(const key of ['intro','description','code','challenge'])assert.ok(typeof l[key]==='string'&&l[key].length>10,`${l.id}: missing ${key}`);
}
for(const q of QUESTIONS) {
  assert.ok(Array.isArray(q.options)&&q.options.length===4,`${q.id}: quiz needs 4 answers`);
  assert.ok(new Set(q.options).size===4,`${q.id}: duplicate quiz choices`);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`${q.id}: invalid correct answer`);
  assert.ok(q.explanation.length>15,`${q.id}: explanation too short`);
}
for (const c of CHALLENGES) {
  assert.ok(['Easy','Medium','Hard'].includes(c.level),`${c.id}: invalid difficulty`);
  assert.ok(Array.isArray(c.samples)&&c.samples.length>=2,`${c.id}: need two sample cases`);
  for(const s of c.samples)assert.ok(typeof s.input==='string'&&typeof s.output==='string',`${c.id}: invalid sample`);
  assert.ok(c.solution.includes('main('),`${c.id}: no complete source solution`);
  assert.ok(typeof c.hint==='string'&&c.hint.length>10,`${c.id}: missing hint`);
}
for(const p of PROJECTS){assert.ok(p.steps.length>=3&&p.acceptance.length>=2&&p.starter.length>30,`${p.id}: missing project guidance`);}
assert.equal(LESSONS.length,131);assert.equal(QUESTIONS.length,113);assert.equal(CHALLENGES.length,138);assert.equal(PROJECTS.length,12);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const selector of ['lessonGrid','challengeGrid','quizContent','codeEditor','compilerOutput','visualContent','dashboardLessons','projectContent','modeSwitch','themeLauncher','themeMenu','traceSource','traceSteps','certificateGrid','certificateExam','certificateView'])assert.ok(html.includes(`id="${selector}"`),`Missing DOM node ${selector}`);
for (const filename of ['data.js','gearex-courses.js','gearex-courses-advanced.js','challenges.js','projects.js','lesson-guides.js','app.js','compiler-service.js','lesson-assessments.js','gearex-engine.js','gearex-trace-ui.js','gearex-features.js','studio-motion.js'])assert.ok(html.includes(`assets/${filename}`),`Missing script tag ${filename}`);
console.log(`Content OK: ${LESSONS.length} lessons, ${QUESTIONS.length} quiz questions, ${CHALLENGES.length} challenges, ${PROJECTS.length} projects.`);

const languages=['c','cpp','py','js','java','cs','sql'];
for(const lang of languages){
 const course=LESSONS.filter(x=>x.lang===lang),bank=QUESTIONS.filter(x=>x.lang===lang);
 assert.ok(course.length >= (lang==='c'?25:lang==='cpp'?26:16),lang+': curriculum lesson count is too low');
 assert.ok(bank.length>=8,lang+': assessment requires at least eight questions');
}
for(const file of ['data.js','gearex-courses.js','gearex-courses-advanced.js','challenges.js','projects.js','lesson-guides.js','app.js','compiler-service.js','lesson-assessments.js','gearex-features.js']){
 new vm.Script(fs.readFileSync(path.join(root,'assets',file),'utf8'),{filename:file});
}
for(const theme of ['none','cyberpunk','quantum','synthwave','matrix']) {
 assert.ok(html.includes('data-palette="'+theme+'"'),'Theme button missing: '+theme);
}
for(const theme of ['cyberpunk','quantum','synthwave','matrix']) {
 assert.ok(fs.readFileSync(path.join(root,'assets','studio.css'),'utf8').includes('data-theme="'+theme+'"'),'Dark-mode palette missing: '+theme);
}
const app=fs.readFileSync(path.join(root,'assets','app.js'),'utf8');
assert.ok(!app.includes("'-std=c++17 -Wall -Wextra'"),'Do not reintroduce the combined compiler flag error');
assert.ok(app.includes('Object.assign(examples,GEAREX_STARTERS)'),'Extra language starter templates missing');
console.log('GearEx validation OK: seven courses, four palettes + neutral, light/dark, compiler, visualizer and certificates present.');

const checks=fs.readFileSync(path.join(root,'assets','lesson-assessments.js'),'utf8');
const sandbox={
 window:{},
 localStorage:{getItem(){return null},setItem(){}},
 document:{querySelector(){return null}},
 state:{completed:new Set()},
 persist(){},updateStats(){},renderRoadmap(){},renderLessons(){}
};
const verified=vm.runInNewContext(source+'\n'+checks+'\nLESSONS.map(lesson=>({id:lesson.id,items:window.gearexLessonQuestions(lesson)}))',sandbox);
assert.equal(verified.length,131,'Must generate lesson checks for all 131 lessons');
for(const lesson of verified){
 assert.equal(lesson.items.length,5,lesson.id+': exactly five questions required');
 for(const question of lesson.items){
  assert.equal(question.options.length,4,lesson.id+': each MCQ needs four options');
  assert.equal(new Set(question.options).size,4,lesson.id+': duplicate choices');
  assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<4,lesson.id+': bad answer index');
  assert.equal(question.options[question.answer],question.explain,lesson.id+': answer mismatch');
 }
}

const engine=fs.readFileSync(path.join(root,'assets','gearex-engine.js'),'utf8');
const traceUI=fs.readFileSync(path.join(root,'assets','gearex-trace-ui.js'),'utf8');
for(const lang of ['c','cpp','py','js','java','cs','sql'])
 assert.ok(engine.includes(lang+':')||engine.includes(lang+': '),'Missing native language support: '+lang);
assert.ok(engine.includes('function run('),'Native execution engine is missing');
assert.ok(engine.includes('frames:copy('),'Stack snapshots are missing');
assert.ok(engine.includes('heap:copy('),'Heap snapshots are missing');
assert.ok(traceUI.includes('GearExEngine'),'Trace UI must use the local engine');
assert.ok(html.includes('<title>GearEx — Free Programming Lessons, Online Compiler & Code Visualizer</title>'),'Browser tab title outdated');
for(const pathName of ['assets/studio.css','assets/navigation-shell.css','assets/studio-motion.js','assets/gearex-engine.js','assets/gearex-trace-ui.js'])
 assert.ok(fs.existsSync(path.join(root,pathName)),pathName+' missing');
assert.ok(html.includes('assets/studio.css'),'Missing GearEx studio styles');
assert.ok(html.includes('value="auto"'),'Missing automatic visualizer language detection');
for(const id of ['tracePlay','traceSample','traceBack','traceNext','traceReset','traceSteps'])
 assert.ok(html.includes('id="'+id+'"'),'Trace control missing: '+id);
const publicFiles=['index.html','README.md','docs/DEVELOPMENT.md','docs/CURRICULUM.md','assets/gearex-features.js','assets/gearex-trace-ui.js','assets/gearex-engine.js','assets/studio.css','assets/studio-motion.js'];
for(const file of publicFiles){
 const contents=fs.readFileSync(path.join(root,file),'utf8');
 assert.ok(!/<iframe\b/i.test(contents),'Embedded third-party visualizer detected in '+file);
}
assert.ok(!html.includes('<iframe'),'An embedded third-party visualizer must not be present');
console.log('GearEx validation OK: 7 language tracks, 655 lesson checks, original trace engine, local controls, and new design.');

const css=fs.readFileSync(path.join(root,'assets','navigation-shell.css'),'utf8');
const studio=fs.readFileSync(path.join(root,'assets','studio.css'),'utf8');
const motion=fs.readFileSync(path.join(root,'assets','studio-motion.js'),'utf8');
const readme=fs.readFileSync(path.join(root,'README.md'),'utf8');
assert.ok(html.includes('assets/navigation-shell.css'),'Appearance shell stylesheet not linked');
assert.ok(!html.includes('id="themeSelect"'),'Retired theme select still present');
assert.ok(html.includes('value="auto"'),'Code Visualizer must retain automatic language detection');
assert.ok(html.includes('href="#playground">Compiler</a>'),'Compiler nav text missing');
assert.ok(html.includes('href="#trace">Code Visualizer</a>'),'Code Visualizer nav text missing');
assert.ok(html.includes('id="modeSwitch"')&&html.includes('role="switch"'),'Accessible light/dark switch missing');
assert.ok(html.includes('id="themeLauncher"')&&html.includes('aria-expanded="false"'),'Waffle launcher needs menu accessibility');
assert.ok(html.includes('id="themeMenu"')&&html.includes('hidden>'),'Theme menu must start closed');
assert.ok(css.includes('body[data-mode="light"]')&&css.includes('body[data-mode="dark"]'),'Missing light/dark scheme CSS');
assert.ok(css.includes('main > [data-view][hidden]'),'Non-active views must remain hidden');
assert.ok(app.includes("mode:state.mode")&&app.includes("theme:state.theme"),'Appearance preferences must persist in saved progress');
assert.ok(app.includes("document.body.dataset.mode=mode"),'Appearance mode not applied to body');
assert.ok(app.includes("if(!target)target=$('#home');"),'Invalid routes must fall back to Home');
assert.ok(app.includes("window.addEventListener('hashchange',route);")&&app.includes('  route();'),'Hash route must run at initial load and navigation');
assert.ok(!motion.includes('scroll reveals'),'Scroll-only navigation animations are obsolete');
assert.ok(!/Hologram Haze|data-theme="hologram"|data-palette="hologram"/i.test([html,css,studio,readme].join('\n')),'Retired theme still included');
const expectedViews=['home','path','learn','lessonDetail','practice','challengeDetail','playground','quiz','visualize','projects','projectDetail','dashboard','trace','certificate','about'];
for(const id of expectedViews){
 const re=new RegExp('<section\\s+id="'+id+'"[^>]*data-view="'+id+'"[^>]*>');
 assert.ok(re.test(html),'A single-view section is missing: '+id);
}
assert.ok(html.includes('class="benefits-strip" data-view="home"'),'The home feature strip must be part of the Home view');
for(const pathName of ['assets/readme/visualizer-preview.svg','assets/readme/learning-journey.svg']){
 assert.ok(fs.existsSync(path.join(root,pathName)),'Missing README graphics: '+pathName);
 assert.ok(readme.includes(pathName),'README must display original graphic: '+pathName);
}
assert.ok(readme.includes('built-in **Code Visualizer**'),'README must explain GearEx visualizer');
console.log('Shell and README checks OK: independent theme/mode persistence, accessible waffle launcher and route panels.');

const compilerModule=fs.readFileSync(path.join(root,'assets/compiler-service.js'),'utf8');
assert.ok(html.includes('assets/compiler-service.js'),'Compiler service is not loaded');
assert.ok(compilerModule.includes('api.onlinecompiler.io'),'New fast browser execution endpoint is missing');
assert.ok(!compilerModule.includes('wandbox.org'),'Old unresponsive runtime must not be used');
assert.ok(!compilerModule.includes('ce.judge0.com'),'A second compiler service must not be reintroduced');
assert.ok(compilerModule.includes('RESPONSE_BUDGET_MS=7000'),'Run must have a 7-second UI response budget');
assert.ok(compilerModule.includes("'runcode'")&&compilerModule.includes("'codeoutput'"),'WebSocket result events missing');
assert.ok(html.includes('assets/compiler-config.js'),'Public widget-key config script is missing');
assert.ok(fs.existsSync(path.join(root,'assets','compiler-config.js')),'Widget key config file missing');
assert.ok(!readme.includes('Wandbox'),'README must document current compiler service');
assert.ok(fs.existsSync(path.join(root,'scripts','test-compiler.cjs')),'Compiler unit tests missing');
console.log('Compiler checks OK: single WebSocket service, source preservation, activation and 7-second UI deadline.');

const feedbackJs=fs.readFileSync(path.join(root,'assets','gearex-feedback.js'),'utf8');
const feedbackCss=fs.readFileSync(path.join(root,'assets','gearex-feedback.css'),'utf8');
const accountUi=fs.readFileSync(path.join(root,'assets','gearex-accounts.js'),'utf8');
assert.ok(html.includes('assets/gearex-feedback.js')&&html.includes('assets/gearex-feedback.css'),'Feedback JS/CSS must be loaded');
assert.ok(html.indexOf('assets/gearex-feedback.js')<html.indexOf('assets/app.js'),'Feedback must initialize before app and accounts');
new vm.Script(feedbackJs,{filename:'gearex-feedback.js'});
assert.ok(feedbackJs.includes('aria-live')&&feedbackJs.includes('scrollIntoView'),'Accessible feedback and scroll guidance required');
assert.ok(feedbackCss.includes('.gearex-spotlight')&&feedbackCss.includes('.gearex-busy'),'Focus and loading styles missing');
assert.ok(app.includes('focusCompilerOutput()')&&app.includes("pane:$('#compilerInputWizard')"),'Compiler input/output guidance missing');
assert.ok(traceUI.includes("querySelector('#traceInputForm')")&&traceUI.includes("querySelector('.runtime-console')"),'Visualizer input/output guidance missing');
assert.ok(accountUi.includes("GearExFeedback?.busy('Deleting your GearEx account")&&accountUi.includes('GearExFeedback?.flash('),'Account deletion needs loading and persistent success feedback');
console.log('Feedback checks OK: responsive alerts, account progress UI and guided input/output navigation.');

const guideContent=fs.readFileSync(path.join(root,'assets','lesson-guides.js'),'utf8');
const guides=vm.runInNewContext(guideContent+'\nGEAR_LESSON_GUIDES;');
const guideIds=Object.keys(guides);
assert.equal(guideIds.length,131,'Every lesson needs a topic-specific detailed guide');
for(const lesson of LESSONS){
 const guide=guides[lesson.id];
 assert.ok(Array.isArray(guide)&&guide.length===4,lesson.id+': each lesson needs four explained stages');
 guide.forEach((part,i)=>assert.ok(typeof part==='string'&&part.length>=35,lesson.id+': stage '+i+' too short'));
}
assert.ok(html.includes('assets/lesson-guides.js'),'Teaching guides are not loaded');
assert.ok(app.includes('GEAR_LESSON_GUIDES[id]'),'Lesson renderer does not show teaching guides');
assert.ok(app.includes('Understand the concept, not just the syntax'),'Beginner teaching layout missing');
assert.ok(traceUI.includes('Program ended')&&traceUI.includes('traceRunAgain'),'Visualizer completion/restart UI missing');
assert.ok(css.includes('height:420px'),'Visualizer editor must be enlarged');
assert.ok(engine.includes('Using namespace')&&engine.includes('Header '),'Header and namespace trace stage missing');
assert.ok(!readme.includes('Judge0 CE'),'README has outdated compiler setup');
console.log('Lesson depth OK: 131 beginner-friendly guides, four teaching sections each, updated visualization and compiler.');
