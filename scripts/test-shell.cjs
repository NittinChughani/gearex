'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'assets','app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const views=['home','path','learn','lessonDetail','practice','challengeDetail','playground','quiz','visualize','projects','projectDetail','dashboard','trace','certificate','about'];
function makeNode(id,view=id){
  const attrs={},classes=new Set();
  return {id,dataset:{view},hidden:id!=='home',attrs,classes,
    setAttribute(k,v){attrs[k]=v;},removeAttribute(k){delete attrs[k];},
    focus(){this.focused=true;},
    getAttribute(k){return attrs[k];},
    classList:{add(k){classes.add(k);},remove(k){classes.delete(k);},toggle(k,v){if(v===undefined){if(classes.has(k)){classes.delete(k);return false;}classes.add(k);return true;}if(v)classes.add(k);else classes.delete(k);return v;},contains(k){return classes.has(k);}}
  };
}
function createTestRouter(){
  const panels=Object.fromEntries(views.map(id=>[id,makeNode(id)]));
  panels.benefits=makeNode('benefits','home');
  const menu=makeNode('themeMenu');menu.hidden=false;
  const launcher=makeNode('themeLauncher');
  const allViews=[...Object.values(panels).filter(x=>x.dataset.view),panels.benefits].filter((v,i,a)=>a.indexOf(v)===i);
  const links=['home','path','learn','practice','playground','quiz','visualize','projects','dashboard','trace','certificate','about'].map(id=>{
    const node=makeNode('nav-'+id);node.getAttribute=k=>k==='href'?'#'+id:node.attrs[k];return node;
  });
  const nodes={...panels,themeMenu:menu,themeLauncher:launcher};
  let scroll=0,events=[];
  const document={getElementById:id=>nodes[id]||null};
  const location={hash:''};
  const window={scrollTo(){scroll++;},dispatchEvent(e){events.push(e.detail.view);}};
  class CustomEvent{constructor(type,opts){this.type=type;this.detail=opts.detail;}}
  const $=selector=>nodes[selector.slice(1)];
  const $$=selector=>{
    if(selector==='main > [data-view]')return allViews;
    if(selector==='.topbar nav a[href^="#"]')return links;
    throw Error('Unexpected selector: '+selector);
  };
  const from=source.indexOf('const GEAR_VIEWS='),to=source.indexOf('function init(){',from);
  assert.ok(from>=0&&to>from,'Cannot find route implementation');
  const factory=new Function('document','location','window','CustomEvent','$','$$','renderLessonDetail','renderChallengeDetail','renderProjectDetail',
    source.slice(from,to)+'\nreturn route;');
  const route=factory(document,location,window,CustomEvent,$,$$,
    id=>id==='valid-lesson',id=>id==='valid-challenge',id=>id==='valid-project');
  return {route,panels,links,location,menu,launcher,get scrolls(){return scroll;},events,allViews};
}
test('all top-level route panels are declared exactly once',()=>{
  for(const id of views){
    const matches=[...html.matchAll(new RegExp('<section[^>]*id="'+id+'"[^>]*data-view="'+id+'"','g'))];
    assert.equal(matches.length,1,id+' should be a single view');
  }
  assert.ok(html.includes('class="benefits-strip" data-view="home"'));
});
test('home route shows its hero and feature strip and nothing else',()=>{
  const r=createTestRouter();r.location.hash='';r.route();
  assert.equal(r.panels.home.hidden,false);
  assert.equal(r.panels.benefits.hidden,false);
  assert.equal(r.allViews.filter(x=>!x.hidden).length,2);
  assert.equal(r.links.find(x=>x.id==='nav-home').getAttribute('aria-current'),'page');
});
test('nav routes replace the active panel without scrolling to hidden content',()=>{
  const r=createTestRouter();
  for(const id of ['path','learn','practice','playground','quiz','visualize','projects','dashboard','trace','certificate','about']){
    r.location.hash='#'+id;r.route();
    assert.equal(r.panels[id].hidden,false,'The selected panel must be visible: '+id);
    assert.deepEqual(r.allViews.filter(x=>!x.hidden).map(x=>x.id),[id],'Only the selected view should remain');
    assert.equal(r.links.find(x=>x.id==='nav-'+id).getAttribute('aria-current'),'page');
  }
  assert.equal(r.scrolls,11,'Navigation should reset the viewport, not scroll to hidden anchors');
});
test('lesson, challenge and project details have separate view routes',()=>{
  const r=createTestRouter();
  for(const [hash,id,parent] of [['lesson/valid-lesson','lessonDetail','learn'],['challenge/valid-challenge','challengeDetail','practice'],['project/valid-project','projectDetail','projects']]){
    r.location.hash='#'+hash;r.route();
    assert.deepEqual(r.allViews.filter(x=>!x.hidden).map(x=>x.id),[id]);
    assert.equal(r.links.find(x=>x.id==='nav-'+parent).getAttribute('aria-current'),'page');
  }
  r.location.hash='#missing';r.route();
  assert.deepEqual(r.allViews.filter(x=>!x.hidden).map(x=>x.id).sort(),['benefits','home']);
});
test('routing closes the appearance menu',()=>{
  const r=createTestRouter();r.menu.hidden=false;r.location.hash='#learn';r.route();
  assert.equal(r.menu.hidden,true);
  assert.equal(r.launcher.getAttribute('aria-expanded'),'false');
});
test('light and dark mode update the switch, active swatch and page colors',()=>{
  const from=source.indexOf('function setTheme()'),to=source.indexOf('function setActiveButtons',from);
  assert.ok(from>=0&&to>from);
  const menu=['none','cyberpunk','quantum','synthwave','matrix'].map(x=>makeNode(x));
  menu.forEach((node,i)=>node.dataset.palette=['none','cyberpunk','quantum','synthwave','matrix'][i]);
  const checkbox=makeNode('modeSwitch'),labels={},meta={content:''},body=makeNode('body'),document={
    body,
    documentElement:{style:{colorScheme:''}},
    querySelector:()=>null
  };
  const state={theme:'none',mode:'light'};
  const $=selector=>selector==='#modeSwitch'?checkbox:selector==='meta[name="theme-color"]'?meta:null;
  const $$=selector=>selector==='[data-palette]'?menu:[];
  const text=(selector,value)=>labels[selector]=value;
  const fn=new Function('document','state','$','$$','text',source.slice(from,to)+'\nreturn setTheme;')(document,state,$,$$,text);
  fn();
  assert.equal(body.dataset.mode,'light');assert.equal(document.documentElement.style.colorScheme,'light');
  assert.equal(checkbox.checked,false);assert.equal(labels['#modeLabel'],'Light mode');
  assert.equal(meta.content,'#f6f8f7');
  assert.equal(menu[0].getAttribute('aria-pressed'),'true');
  state.mode='dark';state.theme='matrix';fn();
  assert.equal(checkbox.checked,true);assert.equal(checkbox.getAttribute('aria-checked'),'true');
  assert.equal(meta.content,'#10191c');
  assert.equal(menu[4].getAttribute('aria-pressed'),'true');
});
test('new visitors get light + neutral and old removed palettes have no options',()=>{
  assert.match(source,/mode: stored\.mode==='dark'\?'dark':'light'/);
  assert.match(source,/includes\(stored\.theme\) \? stored\.theme : 'none'/);
  assert.ok(!/Hologram Haze|data-palette="hologram"/.test(html));
  assert.equal([...html.matchAll(/data-palette="([^"]+)"/g)].length,5);
});
