/* GearEx Trace Engine — original, dependency-free educational interpreter.
 * No eval, Function constructor, external execution service, or network requests.
 * It intentionally supports a documented learning subset, not general programs. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GearExEngine=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const LABEL={py:'Python',js:'JavaScript',c:'C',cpp:'C++',java:'Java',cs:'C#',sql:'SQL'};
function detect(code,fallback='py'){
  const s=String(code||'');
  if(/^\s*(?:SELECT|WITH|CREATE\s+TABLE|INSERT\s+INTO|UPDATE\s+\w+|DELETE\s+FROM|DROP\s+TABLE)\b/im.test(s))return 'sql';
  if(/\b(Console\.WriteLine|using\s+System\s*;|namespace\s+\w+|static\s+void\s+Main)\b/.test(s))return 'cs';
  if(/\b(System\.out\.(?:print|println)|public\s+class\s+\w+|@Override|System\.in)\b/.test(s))return 'java';
  if(/#include\s*<(?:iostream|vector|bits\/stdc\+\+|string)>|\b(?:std::|cout\s*<<|cin\s*>>)\b/.test(s))return 'cpp';
  if(/#include\s*<\w+\.h>|\b(?:printf|scanf)\s*\(/.test(s))return 'c';
  if(/\b(?:console\.log\s*\(|\b(?:const|let)\s+[A-Za-z_$]|=>|function\s+\w+\s*\(|document\.)/.test(s))return 'js';
  if(/^\s*(?:def\s+\w+|class\s+\w+\s*:|from\s+\w+\s+import|import\s+\w+|print\s*\(|for\s+\w+\s+in\s+|if\s+.+:|while\s+.+:)/m.test(s))return 'py';
  return LABEL[fallback]?fallback:'py';
}
const ERROR=message=>{throw new Error(message)};
const copy=v=>JSON.parse(JSON.stringify(v));
function lex(s){
  let i=0,t=[];s=String(s||'').trim();
  const re=/\s*(?:(\d+(?:\.\d+)?)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([A-Za-z_$][\w$]*(?:::[A-Za-z_]\w*)*)|(===|!==|==|!=|<=|>=|\*\*|&&|\|\||\+\+|--|[+\-*/%<>=!?:.,()[\]{}]))/y;
  while(i<s.length){
    re.lastIndex=i;const m=re.exec(s);
    if(!m)ERROR('This expression uses syntax outside the learning tracer: '+s.slice(i,Math.min(i+22,s.length)));
    t.push({type:m[1]?'num':m[2]?'str':m[3]?'id':'op',value:m[1]||m[2]||m[3]||m[4]});
    i=re.lastIndex;
  }
  return t;
}
function parseExpression(source){
  const list=lex(source);let p=0;
  const peek=()=>list[p]?.value,consume=(v)=>{const t=list[p++];if(v&&t?.value!==v)ERROR('Expected '+v+' in expression');return t;};
  const level={'||':1,or:1,'&&':2,and:2,'==':3,'===':3,'!=':3,'!==':3,'<':4,'>':4,'<=':4,'>=':4,'+':5,'-':5,'*':6,'/':6,'%':6,'**':7};
  const expr=(min=0)=>{
    let a,first=consume();if(!first)ERROR('Expected an expression');
    if(first.type==='num')a={k:'lit',v:Number(first.value)};
    else if(first.type==='str'){
      let raw=first.value.slice(1,-1).replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\(["'\\])/g,'$1');
      a={k:'lit',v:raw};
    }else if(first.value==='('){a=expr(0);consume(')');}
    else if(first.value==='['){const args=[];while(peek()!==']'&&peek()!==undefined){args.push(expr(0));if(peek()!==',')break;consume(',');}consume(']');a={k:'array',items:args};}
    else if(first.value==='{'){
      const props=[];while(peek()!=='}'&&peek()!==undefined){
        const key=consume();let name=key.value;if(key.type==='str')name=name.slice(1,-1);
        consume(':');props.push([name,expr(0)]);if(peek()!==',')break;consume(',');
      }consume('}');a={k:'object',props};
    }
    else if(['-','+','!','not'].includes(first.value))a={k:'unary',op:first.value,a:expr(8)};
    else if(first.type==='id'){
      const values={true:true,false:false,True:true,False:false,None:null,null:null,undefined:null};
      a=Object.prototype.hasOwnProperty.call(values,first.value)?{k:'lit',v:values[first.value]}:{k:'name',name:first.value};
    }else ERROR('Could not understand expression near '+first.value);
    for(;;){
      if(peek()==='.'&&10>=min){consume('.');a={k:'get',a,key:{k:'lit',v:consume().value}};continue;}
      if(peek()==='['&&10>=min){consume('[');const key=expr(0);consume(']');a={k:'get',a,key};continue;}
      if(peek()==='('&&10>=min){consume('(');const args=[];while(peek()!==')'&&peek()!==undefined){args.push(expr(0));if(peek()!==',')break;consume(',');}consume(')');a={k:'call',callee:a,args};continue;}
      const op=peek(),prec=level[op];if(!prec||prec<min)break;
      consume();const b=expr(prec+(op==='**'?0:1));a={k:'binary',op,a,b};
    }
    return a;
  };
  const result=expr();
  if(p<list.length)ERROR('Cannot understand the remaining expression near '+list[p].value);
  return result;
}
function normalizedLines(code,lang){
  const lines=[];
  for(const [idx,raw] of String(code).split(/\r?\n/).entries()){
    if(lang==='py'){
      const value=raw.replace(/\t/g,'    ').trim();
      if(!value||value.startsWith('#')||value.startsWith('@'))continue;
      lines.push({line:idx+1,indent:raw.match(/^\s*/)[0].replace(/\t/g,'    ').length,value});
    }else{
      if(/^\s*(#include|#define|using\s+namespace|import\s+|package\s+)/.test(raw))continue;
      let part='',depthP=0,depthB=0,depthObj=0,quote='',escape=false;
      const flush=()=>{const v=part.trim();if(v&&!v.startsWith('//'))lines.push({line:idx+1,value:v});part='';};
      for(let i=0;i<raw.length;i++){
        const ch=raw[i];
        if(quote){part+=ch;if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch===quote)quote='';continue;}
        if(ch==='"'||ch==="'"){quote=ch;part+=ch;continue;}
        if(ch==='/'&&raw[i+1]==='/'&&depthP===0){break;}
        if(ch==='(')depthP++;if(ch===')')depthP--;
        if(ch==='[')depthB++;if(ch===']')depthB--;
        if(ch==='{'&&depthP===0&&depthB===0){
          const before=part.trim();
          if(depthObj||/=\s*$/.test(before)){depthObj++;part+=ch;continue;}
          flush();lines.push({line:idx+1,value:'{'});continue;
        }
        if(ch==='}'&&depthP===0&&depthB===0){
          if(depthObj){depthObj--;part+=ch;continue;}
          flush();lines.push({line:idx+1,value:'}'});continue;
        }
        if(ch===';'&&depthP===0&&depthB===0&&depthObj===0){flush();continue;}
        part+=ch;
      }flush();
    }
  }return lines;
}
function kindOf(line,lang){
 const s=line.trim().replace(/:\s*$/,'');
 let m;
 if((m=/^else\s+if\s*\((.*)\)$/.exec(s))||(m=/^elif\s+(.+)$/.exec(s)))return {kind:'elseif',condition:m[1]};
 if(/^else\b/.test(s))return {kind:'else'};
 if((m=/^if\s*\((.*)\)$/.exec(s))||(lang==='py'&&(m=/^if\s+(.+)$/.exec(s))))return {kind:'if',condition:m[1]};
 if((m=/^while\s*\((.*)\)$/.exec(s))||(lang==='py'&&(m=/^while\s+(.+)$/.exec(s))))return {kind:'while',condition:m[1]};
 if((m=/^for\s*\(\s*(.*)\s*\)$/.exec(s)))return {kind:'for',spec:m[1]};
 if(lang==='py'&&(m=/^for\s+(\w+)\s+in\s+(.+)$/.exec(s)))return {kind:'forin',variable:m[1],iterable:m[2]};
 if((m=/^for\s*\(\s*(?:let|const|var)\s+(\w+)\s+of\s+(.+)\)$/.exec(s)))return {kind:'forin',variable:m[1],iterable:m[2]};
 if(lang==='py'&&(m=/^def\s+(\w+)\(([^)]*)\)$/.exec(s)))return {kind:'func',name:m[1],params:m[2]};
 if((m=/^(?:(?:export|async)\s+)*function\s+(\w+)\s*\(([^)]*)\)$/.exec(s)))return {kind:'func',name:m[1],params:m[2]};
 if((m=/^(?:(?:public|private|protected|static|final|virtual|override|inline|const|async)\s+)*(?:(?:int|void|double|float|long|short|char|bool|boolean|string|String|auto|decimal|object|var|Task)\s+)?([A-Za-z_]\w*)\s*\(([^)]*)\)$/.exec(s))&&
    !/^(print|printf|println|while|for|if|switch)$/.test(m[1]))return {kind:'func',name:m[1],params:m[2]};
 if(/^(?:(?:public|private|protected|static)\s+)*(?:class|struct|namespace|interface)\s+\w+/.test(s))return {kind:'class'};
 if(/^return(?:\s|$)/.test(s))return {kind:'return',expression:s.replace(/^return\s*/,'')};
 if(/^break\s*$/.test(s))return {kind:'break'};
 if(/^continue\s*$/.test(s))return {kind:'continue'};
 return {kind:'statement',text:s};
}
function parse(code,lang){
 const lines=normalizedLines(code,lang),root={kind:'block',body:[]};
 if(lang==='py'){
  function block(start,indent){
   const body=[];let i=start;
   while(i<lines.length){
    const row=lines[i];if(row.indent<indent)break;if(row.indent>indent)ERROR('Unexpected indentation at line '+row.line);
    const data=kindOf(row.value,'py');
    if(data.kind==='else'||data.kind==='elseif')break;
    const node={...data,line:row.line,text:row.value,body:[]};i++;
    if(['if','while','forin','func'].includes(node.kind)){
      if(lines[i]&&lines[i].indent>indent){const inner=block(i,lines[i].indent);node.body=inner.body;i=inner.end;}
      if(node.kind==='if'&&lines[i]&&lines[i].indent===indent&&/^(elif|else)\b/.test(lines[i].value)){
        const e=lines[i],other=kindOf(e.value,'py');i++;
        let detail={...other,line:e.line,text:e.value,body:[]};
        if(lines[i]&&lines[i].indent>indent){const inner=block(i,lines[i].indent);detail.body=inner.body;i=inner.end;}
        node.alternate=detail;
      }
    }
    body.push(node);
   }return {body,end:i};
  }
  if(!lines.length)return root;
  root.body=block(0,lines[0].indent).body;
 }else{
  let body=root.body,stack=[],pending=null,previous=null;
  for(const row of lines){
    if(row.value==='{'){stack.push({body,owner:pending});if(pending)body=pending.body;pending=null;continue;}
    if(row.value==='}'){const prev=stack.pop();if(prev){body=prev.body;previous=prev.owner||previous;}continue;}
    const data=kindOf(row.value,lang);
    if(data.kind==='else'||data.kind==='elseif'){
      const candidate=[...body].reverse().find(x=>x.kind==='if'||x.kind==='elseif');
      if(candidate){const alternate={...data,line:row.line,text:row.value,body:[]};candidate.alternate=alternate;pending=alternate;previous=alternate;}
      continue;
    }
    const node={...data,line:row.line,text:row.value,body:[]};body.push(node);previous=node;
    pending=['func','class','if','for','forin','while'].includes(node.kind)?node:null;
  }
 }
 return root;
}
function run(code,selected='auto'){
 const lang=selected==='auto'?detect(code):LABEL[selected]?selected:detect(code);
 if(lang==='sql')return sqlWalkthrough(code);
 const warnings=[],steps=[],frames=[{name:'Global',vars:{}}],heap={},functions={},output=[];
 let alloc=0,count=0,loops=0,depth=0;
 const MAX_STEPS=550,MAX_LOOPS=160;
 function allocate(kind,value){const id=++alloc;heap[id]={kind,value};return {ref:id};}
 const display=v=>typeof v==='object'&&v&&v.ref?'#'+v.ref+' '+(heap[v.ref]?.kind||'object'):Array.isArray(v)?'['+v.map(display).join(', ')+']':v===null?'null':typeof v==='string'?v:String(v);
 const printed=(v,seen=new Set())=>{
   if(v&&v.ref){if(seen.has(v.ref))return '#'+v.ref+' ↺';seen.add(v.ref);const entry=heap[v.ref];if(!entry)return '#'+v.ref;
     return entry.kind==='array'?'['+entry.value.map(item=>printed(item,new Set(seen))).join(', ')+']':
       '{'+Object.entries(entry.value).map(([k,item])=>k+': '+printed(item,new Set(seen))).join(', ')+'}';
   }
   return v===null?'None':String(v);
 };
 const repr=v=>typeof v==='object'&&v&&v.ref?display(v):display(v);
 const snapshot=(line,note)=>{
   if(++count>MAX_STEPS)ERROR('Step limit reached. Simplify the example or reduce loop iterations.');
   steps.push({line,note,frames:copy(frames.map(f=>({name:f.name,vars:Object.fromEntries(Object.entries(f.vars).map(([k,v])=>[k,repr(v)]))}))),
     heap:copy(Object.entries(heap).map(([id,obj])=>({id:'#'+id,kind:obj.kind,items:obj.kind==='array'?obj.value.map((v,i)=>({key:String(i),value:repr(v)})):Object.entries(obj.value).map(([k,v])=>({key:k,value:repr(v)}))}))),
     output:output.join('')});
 };
 const readName=name=>{
   for(let i=frames.length-1;i>=0;i--)if(Object.prototype.hasOwnProperty.call(frames[i].vars,name))return frames[i].vars[name];
   ERROR('Variable "'+name+'" has not been defined yet.');
 };
 const assign=(name,val,declare=false)=>{
   let f=frames.at(-1);
   if(!declare){for(let i=frames.length-1;i>=0;i--)if(Object.prototype.hasOwnProperty.call(frames[i].vars,name)){f=frames[i];break;}}
   f.vars[name]=val;return val;
 };
 const truth=v=>!!v&&!(typeof v==='object'&&v&&v.ref===0);
 const toNumber=v=>{if(typeof v==='number')return v;return Number(v)||0;};
 const evaluate=text=>{
   text=String(text).trim();
   if(/^f(['"])([\s\S]*)\1$/.test(text)){
     const raw=text.slice(2,-1);return raw.replace(/\{([^{}]+)\}/g,(_,key)=>printed(evaluate(key)));
   }
   return interpret(parseExpression(text));
 };
 const splitArgs=text=>{
   let parts=[],cur='',depth=0,quote='',escaped=false;
   for(const ch of String(text)){
     if(quote){cur+=ch;if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch===quote)quote='';continue;}
     if(ch==='"'||ch==="'"){quote=ch;cur+=ch;continue;}
     if('([{'.includes(ch))depth++;
     if(')]}'.includes(ch))depth--;
     if(ch===','&&depth===0){parts.push(cur.trim());cur='';continue;}
     cur+=ch;
   }
   if(cur.trim())parts.push(cur.trim());return parts;
 };
 const argValue=(node)=>interpret(node);
 function invoke(name,args){
   const f=functions[name];if(!f)ERROR('Function "'+name+'" is outside this tracer’s supported example set.');
   if(++depth>14)ERROR('Too many nested function calls for this learning trace.');
   const vars={};f.params.forEach((p,i)=>{vars[p]=args[i]??null;});
   frames.push({name:name+'()',vars});snapshot(f.line,'Enter '+name+'(): new stack frame');
   const result=block(f.body);
   const answer=result?.kind==='return'?result.value:null;
   snapshot(f.line,'Return from '+name+'(); stack frame is about to close');
   frames.pop();depth--;
   return answer;
 }
 function interpret(n){
   if(!n) return null;
   if(n.k==='lit')return n.v;
   if(n.k==='name'){if(n.name==='endl'||n.name==='std::endl')return '\n';return readName(n.name);}
   if(n.k==='array')return allocate('array',n.items.map(interpret));
   if(n.k==='object')return allocate('object',Object.fromEntries(n.props.map(([k,v])=>[k,interpret(v)])));
   if(n.k==='unary'){const v=interpret(n.a);return n.op==='!'||n.op==='not'?!truth(v):n.op==='-'?-toNumber(v):+toNumber(v);}
   if(n.k==='binary'){
     const a=interpret(n.a);
     if((n.op==='&&'||n.op==='and')&&!truth(a))return false;
     if((n.op==='||'||n.op==='or')&&truth(a))return true;
     const b=interpret(n.b);
     switch(n.op){
       case '+':return typeof a==='string'||typeof b==='string'?String(a)+String(b):toNumber(a)+toNumber(b);
       case '-':return toNumber(a)-toNumber(b);case '*':return toNumber(a)*toNumber(b);
       case '/':if(!toNumber(b))ERROR('Division by zero.');return toNumber(a)/toNumber(b);
       case '%':return toNumber(a)%toNumber(b);case '**':return toNumber(a)**toNumber(b);
       case '<':return a<b;case '>':return a>b;case '<=':return a<=b;case '>=':return a>=b;
       case '==':case '===':return a===b;case '!=':case '!==':return a!==b;
       case 'and':case '&&':return truth(a)&&truth(b);case 'or':case '||':return truth(a)||truth(b);
     }ERROR('Operator '+n.op+' is not available in this learning trace.');
   }
   if(n.k==='get'){
     const a=interpret(n.a),key=interpret(n.key);
     if(a&&a.ref){
       const item=heap[a.ref];if(!item)ERROR('Reference is not present in heap memory.');
       if(key==='length')return item.kind==='array'?item.value.length:Object.keys(item.value).length;
       if(key==='append'||key==='push'||key==='pop')return {method:key,ref:a.ref};
       const v=item.value[key];if(v===undefined)ERROR('Property '+key+' does not exist on '+display(a));
       return v;
     }
     if(Array.isArray(a))return key==='length'?a.length:a[key];
     ERROR('Cannot access property '+key+' on a non-object value.');
   }
   if(n.k==='call'){
     const args=n.args.map(argValue);
     if(n.callee.k==='name'){
       const fn=n.callee.name;
       if(fn==='range'){const a=args.length===1?0:toNumber(args[0]),b=args.length===1?toNumber(args[0]):toNumber(args[1]),step=args[2]===undefined?1:toNumber(args[2]);if(!step)ERROR('range step cannot be zero');const v=[];for(let i=a;(step>0?i<b:i>b)&&v.length<MAX_LOOPS;i+=step)v.push(i);return v;}
       if(fn==='len')return args[0]?.ref?heap[args[0].ref]?.value?.length||Object.keys(heap[args[0].ref].value).length:String(args[0]||'').length;
       if(fn==='int')return Math.trunc(toNumber(args[0]));if(fn==='str'||fn==='String')return display(args[0]);
       if(fn==='sum')return (Array.isArray(args[0])?args[0]:heap[args[0]?.ref]?.value||[]).reduce((a,b)=>a+toNumber(b),0);
       if(fn==='print'||fn==='console.log'||fn==='System.out.println'||fn==='System.out.print'||fn==='Console.WriteLine'||fn==='printf'){
         if(fn==='printf'){let format=String(args.shift()||'');let idx=0;output.push(format.replace(/%[disfc]/g,()=>display(args[idx++])));return null;}
         output.push(args.map(a=>printed(a)).join(' ')+(fn==='System.out.print'?'':'\n'));return null;
       }
       return invoke(fn,args);
     }
     if(n.callee.k==='get'){
       const object=interpret(n.callee.a),method=interpret(n.callee.key),entry=object?.ref&&heap[object.ref];
       if(!entry)ERROR('Method calls require a supported heap array or object.');
       if(method==='append'||method==='push'){if(entry.kind!=='array')ERROR('append/push works with arrays in this tracer.');entry.value.push(args[0]);return entry.value.length;}
       if(method==='pop'){if(entry.kind!=='array')ERROR('pop works with arrays in this tracer.');return entry.value.pop();}
     }
     ERROR('This function call is not included in the learning subset.');
   }
   ERROR('Expression type '+n.k+' is not supported.');
 }
 function statement(node){
   let raw=node.text.trim().replace(/;\s*$/,'');
   if(!raw||raw==='pass'||raw==='{'||raw==='}'||raw==='using System'||raw.startsWith('//'))return;
   if(/^(?:std::cout|cout)\s*<</.test(raw)){
     const parts=raw.replace(/^(?:std::cout|cout)\s*<</,'').split(/\s*<<\s*/);
     output.push(parts.map(p=>/^(?:std::)?endl$/.test(p)?'\n':display(evaluate(p))).join(''));
     snapshot(node.line,'Write to standard output.');return;
   }
   const printf=/^(?:std::)?printf\s*\((.*)\)$/.exec(raw);
   if(printf){evaluate('printf('+printf[1]+')');snapshot(node.line,'Format and print a value.');return;}
   if(/^(?:console\.log|System\.out\.print(?:ln)?|Console\.WriteLine|print)\s*\(/.test(raw)){
     const name=raw.slice(0,raw.indexOf('('));const rawArgs=raw.slice(raw.indexOf('(')+1,-1);
     const args=splitArgs(rawArgs).map(evaluate);
     output.push(args.map(v=>printed(v)).join(' ')+(name==='System.out.print'?'':'\n'));
     snapshot(node.line,'Display an output value.');return;
   }
   if(/^return\s+/.test(raw))return {kind:'return',value:evaluate(raw.slice(7))};
   if(raw==='return')return {kind:'return',value:null};
   const change=/^(?:\+\+|--)?\s*([A-Za-z_]\w*)\s*(\+\+|--)$/.exec(raw);
   if(change){const newVal=toNumber(readName(change[1]))+(change[2]==='++'?1:-1);assign(change[1],newVal);snapshot(node.line,change[1]+' becomes '+newVal);return;}
   const aug=/^([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/.exec(raw);
   if(aug){const left=readName(aug[1]),right=evaluate(aug[3]);let result;
     if(aug[2]==='+=')result=typeof left==='string'?left+display(right):toNumber(left)+toNumber(right);
     else if(aug[2]==='-=')result=toNumber(left)-toNumber(right);
     else if(aug[2]==='*=')result=toNumber(left)*toNumber(right);
     else result=toNumber(left)/toNumber(right);
     assign(aug[1],result);snapshot(node.line,aug[1]+' is now '+display(result));return;
   }
   const assignment=/^(?:(?:const|let|var|int|float|double|long|short|char|bool|boolean|String|string|auto|decimal|object)\s+)?([A-Za-z_$]\w*(?:\[[^\]]+\]|\.[A-Za-z_]\w*)?)\s*=(?!=)\s*(.+)$/.exec(raw);
   if(assignment){
     let value=evaluate(assignment[2]),name=assignment[1];
     if(name.includes('[')){const m=/^(\w+)\[(.+)\]$/.exec(name),ref=readName(m[1]),index=evaluate(m[2]);if(!ref?.ref||!heap[ref.ref])ERROR('Array assignment requires a heap array.');heap[ref.ref].value[index]=value;}
     else if(name.includes('.')){const [object,field]=name.split('.'),ref=readName(object);if(!ref?.ref||!heap[ref.ref])ERROR('Object assignment requires a heap object.');heap[ref.ref].value[field]=value;}
     else assign(name,value);
     snapshot(node.line,'Assign '+name+' = '+display(value));return;
   }
   const declare=/^(?:int|float|double|long|short|char|bool|boolean|String|string|auto|decimal|object|let|var)\s+([A-Za-z_]\w*)$/.exec(raw);
   if(declare){assign(declare[1],null,true);snapshot(node.line,'Declare '+declare[1]+' without a value.');return;}
   if(/^\w+(?:\.\w+)?\s*\(.*\)$/.test(raw)){
     evaluate(raw);snapshot(node.line,'Call a function or update a collection.');return;
   }
   if(raw==='break')return {kind:'break'};
   if(raw==='continue')return {kind:'continue'};
   ERROR('This statement is not in the supported teaching subset: '+raw.slice(0,90));
 }
 function block(nodes){
   for(const node of nodes){
     if(count>=MAX_STEPS)ERROR('Step limit reached. Simplify your code.');
     if(node.kind==='class'){const r=block(node.body);if(r?.kind==='return')return r;continue;}
     if(node.kind==='func'){functions[node.name]={...node,params:node.params.split(',').map(x=>x.trim().split(/\s+/).at(-1).replace(/[\[\]*]/g,'')).filter(Boolean)};snapshot(node.line,'Define '+node.name+'().');continue;}
     if(node.kind==='statement'||node.kind==='return'||node.kind==='break'||node.kind==='continue'){
       const r=statement(node);if(r?.kind==='return'){snapshot(node.line,'Return '+display(r.value)+' from the current function.');return r;}
       if(r?.kind==='break'||r?.kind==='continue')return r;continue;
     }
     if(node.kind==='if'||node.kind==='elseif'){
       const yes=truth(evaluate(node.condition));snapshot(node.line,yes?'Condition is true: enter this branch.':'Condition is false: skip this branch.');
       if(yes){const r=block(node.body);if(r)return r;}
       else if(node.alternate){const a=node.alternate;if(a.kind==='else'){snapshot(a.line,'Follow the else branch.');const r=block(a.body);if(r)return r;}
         else{const r=block([a]);if(r)return r;}}
       continue;
     }
     if(node.kind==='while'){
       while(true){
         if(++loops>MAX_LOOPS)ERROR('Loop iteration limit reached (160). Reduce the range.');
         const yes=truth(evaluate(node.condition));snapshot(node.line,yes?'While condition true: enter the loop.':'While condition false: exit loop.');
         if(!yes)break;const r=block(node.body);if(r?.kind==='return')return r;if(r?.kind==='break')break;
       }continue;
     }
     if(node.kind==='forin'){
       let vals=evaluate(node.iterable);if(vals?.ref)vals=heap[vals.ref]?.value;
       if(!Array.isArray(vals))ERROR('For-in loops need an array or range() in this learning tracer.');
       for(const v of vals){if(++loops>MAX_LOOPS)ERROR('Loop iteration limit reached (160).');assign(node.variable,v);snapshot(node.line,'Next '+node.variable+' = '+display(v));
         const r=block(node.body);if(r?.kind==='return')return r;if(r?.kind==='break')break;
       }snapshot(node.line,'For loop finished.');continue;
     }
     if(node.kind==='for'){
       const items=node.spec.split(';');if(items.length!==3)ERROR('Use a three-part for loop: for (init; condition; update).');
       statement({kind:'statement',text:items[0],line:node.line});
       while(true){if(++loops>MAX_LOOPS)ERROR('Loop iteration limit reached (160).');
         const yes=truth(evaluate(items[1]));snapshot(node.line,yes?'For condition true: run the body.':'For condition false: end the loop.');
         if(!yes)break;const r=block(node.body);if(r?.kind==='return')return r;if(r?.kind==='break')break;
         statement({kind:'statement',text:items[2],line:node.line});
       }continue;
     }
   }return null;
 }
 const parsed=parse(code,lang);
 try{
   snapshot(0,'Program ready. Variables and heap objects appear as they are created.');
   block(parsed.body);
   if(['c','cpp','java','cs'].includes(lang)){if(functions.main)invoke('main',[]);else if(functions.Main)invoke('Main',[]);}
   snapshot(0,'Trace finished. This represents the supported educational subset.');
 }catch(e){warnings.push(String(e.message||e));if(steps.length)snapshotSafe();}
 function snapshotSafe(){const last=steps.at(-1);if(last)last.note+=' · Trace stopped: '+warnings.at(-1);}
 return {lang,mode:'interpreted-subset',steps,warnings,lines:String(code).split(/\r?\n/)};
}
function sqlWalkthrough(code){
 const lines=String(code).split(/\r?\n/),steps=[],parts=lines.map((text,i)=>({text:text.trim(),line:i+1})).filter(x=>x.text&&!x.text.startsWith('--'));
 const notes=[['WITH','Define reusable named query results.'],['CREATE','Define a table’s structure.'],['INSERT','Describe rows to add.'],['SELECT','Choose columns for the result.'],['FROM','Identify the source table.'],['JOIN','Combine rows with matching keys.'],['WHERE','Filter rows using a condition.'],['GROUP','Group rows before aggregates.'],['ORDER','Sort rows in the result.'],['UPDATE','Specify changes to matching rows.'],['DELETE','Specify which rows would be removed.']];
 steps.push({line:0,note:'SQL plan ready. No database is executed.',frames:[{name:'SQL statement',vars:{}}],heap:[],output:''});
 for(const p of parts){
   const match=notes.find(([key])=>new RegExp('\\b'+key+'\\b','i').test(p.text)),note=match?match[1]:'Read this SQL clause in the context of the statement.';
   steps.push({line:p.line,note,frames:[{name:'SQL query plan',vars:{clause:(match?.[0]||'expression'),status:'Conceptual model'}}],heap:[],output:''});
 }
 steps.push({line:0,note:'To see real SQL results, run the query in GearEx’s playground.',frames:[{name:'SQL query plan',vars:{status:'Plan reviewed'}}],heap:[],output:''});
 return {lang:'sql',mode:'sql-plan',steps,warnings:[],lines};
}
return {detect,run,LABEL,parseExpression,parse};
});
