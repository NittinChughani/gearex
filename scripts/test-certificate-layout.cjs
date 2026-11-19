'use strict';
/* GearEx certificate renderer regression tests: content, layout distinctness,
 * original logo, print rules, and non-destructive credential eligibility. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const asset=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const source=['data.js','gearex-courses.js','gearex-courses-advanced.js'].map(asset).join('\n');
const lessons=vm.runInNewContext(source+'\nLESSONS.map(({id,lang})=>({id,lang}))');
const langs=['c','cpp','py','js','java','cs','sql'];
const expected={c:25,cpp:26,py:16,js:16,java:16,cs:16,sql:16};

class Element {
  constructor(tag){
    this.tagName=tag;this.className='';this.children=[];this._text='';
    this.dataset={};this.attributes={};this.listeners={};this.hidden=false;
    this.style={properties:{},setProperty(k,v){this.properties[k]=v;}};
  }
  set textContent(value){this._text=String(value);this.children=[];}
  get textContent(){return this._text+this.children.map(x=>x.textContent||'').join('');}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=children;}
  addEventListener(event,callback){this.listeners[event]=callback;}
  setAttribute(key,value){this.attributes[key]=value;}
  scrollIntoView(){}
}
const findAll=(node,fn)=>[...(fn(node)?[node]:[]),...(node.children||[]).flatMap(child=>findAll(child,fn))];
function fixture({complete=true}={}){
  const nodes={
    '#certificateGrid':new Element('div'),
    '#certificateView':new Element('div'),
    '#certificateExam':new Element('div')
  };
  const checks=Object.fromEntries(lessons.map(l=>[l.id,{best:5,attempts:1,date:'2026-11-19'}]));
  const certificates=Object.fromEntries(langs.map(lang=>[lang,{score:lang==='c'||lang==='cpp'?20:8,total:lang==='c'||lang==='cpp'?20:8,date:'2026-11-19'}]));
  const storage={
    'gearex-certificates-v2':JSON.stringify(certificates),
    'gearex-certificate-name-v1':'Design Review Learner'
  };
  const window={
    gearexLessonPassed:id=>complete||id!=='c-hello',
    gearexLessonScores:checks,
    addEventListener(){},
    dispatchEvent(){}
  };
  const document={
    querySelector:selector=>nodes[selector]||null,
    createElement:tag=>new Element(tag),
    createTextNode:value=>({tagName:'#text',textContent:String(value),children:[]}),
    addEventListener(){}
  };
  const localStorage={
    getItem:key=>storage[key]??null,
    setItem:(key,value)=>{storage[key]=String(value);}
  };
  vm.runInNewContext(asset('gearex-features.js'),{window,document,localStorage,LESSONS:lessons,QUESTIONS:[],state:{},location:{hash:'#certificate'},setTimeout});
  const cards=nodes['#certificateGrid'].children;
  return {nodes,cards,window};
}

test('all seven courses have the intended lesson counts',()=>{
  assert.equal(lessons.length,131);
  for(const lang of langs)assert.equal(lessons.filter(l=>l.lang===lang).length,expected[lang],lang);
});

test('each certificate has a distinct document structure and original GearEx logo',()=>{
  const {nodes,cards}=fixture();
  assert.equal(cards.length,7);
  const signatures=[];
  langs.forEach((lang,i)=>{
    const open=findAll(cards[i],n=>n.tagName==='button'&&n.textContent==='View certificate');
    assert.equal(open.length,1,lang+' not unlocked with all checks passed');
    open[0].listeners.click();
    const certificate=findAll(nodes['#certificateView'],n=>n.tagName==='article'&&String(n.className).includes('gx-cert'));
    assert.equal(certificate.length,1,lang);
    const paper=certificate[0];
    assert.ok(paper.className.includes('gx-cert-'+lang),lang);
    const allText=paper.textContent;
    for(const required of ['GEAREX','Certificate of Course Completion','Design Review Learner','100/100','Nittin Chughani','2026-11-19','Not an accredited'])assert.ok(allText.includes(required),lang+': missing '+required);
    assert.ok(!allText.includes('GEAREX / LEARNING RECORD'),lang+': legacy heading');
    const images=findAll(paper,n=>n.tagName==='img');
    assert.equal(images.length,1,lang+': exactly one integrated brand emblem');
    assert.equal(images[0].src,'assets/favicon.svg',lang+': logo source must remain original');
    const topLevel=paper.children.map(n=>n.className).join('|');
    signatures.push(topLevel);
  });
  assert.equal(new Set(signatures).size,7,'Every language must have its own composition; recoloring identical layouts is not enough');
});

test('certificate eligibility still requires all verified lesson checks',()=>{
  const {cards}=fixture({complete:false});
  const firstActions=findAll(cards[0],n=>n.tagName==='button');
  assert.ok(firstActions.some(x=>x.textContent==='Continue C lessons'));
  assert.ok(!firstActions.some(x=>x.textContent==='View certificate'));
});

test('styles load last, include responsive and print rules for every design',()=>{
  const css=asset('certificate-themes.css');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const styles=[...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(x=>x[1]);
  assert.ok(styles.at(-1).startsWith('assets/certificate-themes.css'), 'certificate CSS must load after navigation theme overrides');
  for(const lang of langs)assert.ok(css.includes('.gx-cert-'+lang),lang+': missing styles');
  for(const token of ['@media print','@page{size:A4 landscape','@media(max-width:590px)','body[data-mode="light"] .certificate-paper.gx-cert'])assert.ok(css.includes(token),'missing CSS '+token);
});
