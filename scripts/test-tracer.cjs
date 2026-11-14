'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const engine=require('../assets/gearex-engine.js');
const read=pathName=>fs.readFileSync(path.join(__dirname,'..',pathName),'utf8');
const trace=(lang,source)=>engine.run(source,lang);
const resultOutput=result=>result.steps.at(-1)?.output||'';

test('automatic detection picks seven supported language families',()=>{
 const cases=[
  ['py',"for n in range(3):\n    print(n)"],
  ['js',"const a = 4;\nconsole.log(a);"],
  ['c','#include <stdio.h>\nint main(){ printf("ok"); return 0; }'],
  ['cpp','#include <iostream>\nint main(){ std::cout << 4; }'],
  ['java','public class Main { public static void main(String[] args) { System.out.println(5); } }'],
  ['cs','using System;\nclass Program { static void Main() { Console.WriteLine(5); } }'],
  ['sql','SELECT id FROM students WHERE id > 2;']
 ];
 for(const [lang,code] of cases)assert.equal(engine.detect(code),lang,'Misidentified '+lang);
});
test('Python arrays share a real heap reference and update together',()=>{
 const r=trace('auto',"numbers = [1, 2, 3]\nalias = numbers\nalias.append(4)\nprint(numbers)");
 assert.deepEqual(r.warnings,[]);
 assert.equal(resultOutput(r),'[1, 2, 3, 4]\n');
 const last=r.steps.at(-1);
 assert.equal(last.heap[0].items.at(-1).value,'4');
 const globals=last.frames[0].vars;
 assert.equal(globals.numbers,globals.alias,'Both names must refer to the same allocation');
});
test('Python loops really repeat with changed values and output',()=>{
 const r=trace('auto',"total = 0\nfor n in range(1, 4):\n    total += n\nprint(total)");
 assert.deepEqual(r.warnings,[]);
 assert.equal(resultOutput(r),'6\n');
 assert.ok(r.steps.some(x=>x.note.includes('Next n = 3')));
});
test('function call exposes a separate stack frame',()=>{
 const r=trace('py',"def add(a, b):\n    result = a + b\n    return result\n\nx = add(4, 5)\nprint(x)");
 assert.deepEqual(r.warnings,[]);
 assert.equal(resultOutput(r),'9\n');
 assert.ok(r.steps.some(x=>x.frames.some(f=>f.name==='add()'&&f.vars.a==='4'&&f.vars.b==='5')));
});
test('JavaScript updates arrays and iterates a counting loop',()=>{
 const r=trace('auto',"const vals = [2, 4];\nconst ref = vals;\nref.push(6);\nlet n = 0;\nfor(let i=0;i<3;i++) {\n  n += vals[i];\n}\nconsole.log(n);");
 assert.deepEqual(r.warnings,[]);
 assert.equal(resultOutput(r),'12\n');
});
test('C arrays, pointers and formatted output show current memory',()=>{
 const r=trace('c','#include <stdio.h>\nint main(void) {\n int score = 42;\n int *ptr = &score;\n *ptr += 8;\n int nums[] = {1, 2, 3};\n printf("%d %d\\n",score,nums[1]);\n return 0;\n}');
 assert.deepEqual(r.warnings,[]);
 assert.equal(resultOutput(r),'50 2\n');
 assert.ok(r.steps.some(x=>x.frames.some(f=>f.vars.ptr==='&score (stack)')));
 assert.ok(r.steps.some(x=>x.heap.length>0));
});
test('C++ for-loop with prefix increment and cout',()=>{
 const r=trace('cpp','#include <iostream>\nint main(){\n int total=0;\n for(int i=1;i<=3;++i){\n total+=i;\n }\n std::cout << total << std::endl;\n return 0;\n}');
 assert.deepEqual(r.warnings,[]);
 assert.equal(resultOutput(r),'6\n');
});
test('Java and C# trace main methods and their output',()=>{
 const java=trace('auto','public class Main {\n public static void main(String[] args) {\n int x=4;\n if(x<5) System.out.println("yes");\n else System.out.println("no");\n }\n}');
 const cs=trace('auto','using System;\nclass Program {\n static void Main() {\n int x=4;\n Console.WriteLine(x);\n }\n}');
 assert.deepEqual(java.warnings,[]);
 assert.deepEqual(cs.warnings,[]);
 assert.equal(resultOutput(java),'yes\n');
 assert.equal(resultOutput(cs),'4\n');
});
test('SQL mode explains clauses but never claims to run a database',()=>{
 const r=trace('auto','SELECT name FROM students WHERE score >= 80;');
 assert.equal(r.mode,'sql-plan');
 assert.equal(resultOutput(r),'');
 assert.ok(r.steps.some(x=>x.note.includes('Choose columns')));
});
test('unsupported syntax reports coverage rather than fabricating results',()=>{
 const r=trace('js',"const x = require('fs').readFileSync('/etc/passwd');");
 assert.ok(r.warnings.length>0);
 assert.equal(resultOutput(r),'');
});
test('infinite loops stop under the educational runtime limit',()=>{
 const r=trace('py','x = 0\nwhile True:\n    x += 1');
 assert.ok(r.warnings.length>0);
 assert.ok(r.steps.length<=551);
});
test('the site uses only its native trace engine and local controls',()=>{
 const html=read('index.html'),ui=read('assets/gearex-trace-ui.js');
 assert.ok(html.includes('assets/gearex-engine.js'));
 assert.ok(html.includes('assets/gearex-trace-ui.js'));
 assert.ok(html.includes('assets/studio.css'));
 assert.ok(html.includes('id="tracePlay"'));
 assert.ok(ui.includes('GearExEngine'));
 assert.ok(!html.includes('<iframe'));
 assert.ok(!/<iframe\b/i.test(ui),'Trace UI must be fully local');
});

test('Python input waits for each value and resumes with a numeric conversion',()=>{
 const src="name = input('Name? ')\nage = int(input('Age? '))\nprint(name, age)";
 const first=engine.run(src,'py');
 assert.equal(first.pendingInput.prompt,'Name? ');
 assert.deepEqual(first.warnings,[]);
 const second=engine.run(src,'py',{inputs:['Sam']});
 assert.equal(second.pendingInput.prompt,'Age? ');
 assert.equal(second.pendingInput.index,1);
 const done=engine.run(src,'py',{inputs:['Sam','17']});
 assert.equal(done.pendingInput,null);
 assert.deepEqual(done.warnings,[]);
 assert.equal(resultOutput(done),'Sam 17\n');
});
test('Input inside a Python loop pauses once for every iteration',()=>{
 const src="total = 0\nfor i in range(3):\n    total += int(input('Number? '))\nprint(total)";
 for(let n=0;n<3;n++){
   const part=engine.run(src,'py',{inputs:['2','3','4'].slice(0,n)});
   assert.equal(part.pendingInput?.index,n);
   assert.deepEqual(part.warnings,[]);
 }
 const done=engine.run(src,'py',{inputs:['2','3','4']});
 assert.equal(resultOutput(done),'9\n');
});
test('JavaScript prompt pauses and resumes with actual user text',()=>{
 const src="const name=prompt('Your name?');\nconsole.log('Hello '+name);";
 const part=engine.run(src,'js');
 assert.equal(part.pendingInput.prompt,'Your name?');
 const done=engine.run(src,'js',{inputs:['Ava']});
 assert.deepEqual(done.warnings,[]);
 assert.equal(resultOutput(done),'Hello Ava\n');
});
test('C scanf prompts for both numeric variables and then computes correctly',()=>{
 const src='#include <stdio.h>\nint main(){\nint x;\nint y;\nprintf("Enter values: ");\nscanf("%d %d", &x, &y);\nprintf("%d\\n",x+y);\nreturn 0;\n}';
 assert.equal(engine.run(src,'c').pendingInput.prompt,'Enter x (scanf)');
 assert.equal(engine.run(src,'c',{inputs:['10']}).pendingInput.prompt,'Enter y (scanf)');
 const done=engine.run(src,'c',{inputs:['10','20']});
 assert.deepEqual(done.warnings,[]);
 assert.equal(resultOutput(done),'Enter values: 30\n');
});
test('C++ cin reads multiple typed values in one expression',()=>{
 const src='#include <iostream>\nint main(){\nint a;\nint b;\nstd::cin >> a >> b;\nstd::cout << a + b << std::endl;\nreturn 0;\n}';
 assert.equal(engine.run(src,'cpp').pendingInput.prompt,'Enter a (cin)');
 const done=engine.run(src,'cpp',{inputs:['4','6']});
 assert.deepEqual(done.warnings,[]);
 assert.equal(resultOutput(done),'10\n');
});
test('C# and Java input APIs continue trace after user supplies values',()=>{
 const cs='using System;\nclass Program {\nstatic void Main(){\nint value = Convert.ToInt32(Console.ReadLine());\nConsole.WriteLine(value+3);\n}\n}';
 assert.equal(engine.run(cs,'cs').pendingInput.prompt,'C# Console.ReadLine()');
 assert.equal(resultOutput(engine.run(cs,'cs',{inputs:['12']})),'15\n');
 const java='import java.util.Scanner;\nclass Main {\npublic static void main(String[] args){\nScanner sc = new Scanner(System.in);\nint value = sc.nextInt();\nSystem.out.println(value+2);\n}\n}';
 assert.equal(engine.run(java,'java').pendingInput.prompt,'Java sc.nextInt()');
 assert.equal(resultOutput(engine.run(java,'java',{inputs:['8']})),'10\n');
});
test('Malformed numeric input returns a coverage warning, not fabricated output',()=>{
 const src="age = int(input('Age? '))\nprint(age)";
 const result=engine.run(src,'py',{inputs:['banana']});
 assert.ok(result.warnings.length>0,'Invalid numeric input must not silently count as zero');
});
test('Manual and auto trace controls and input form are wired up',()=>{
 const html=read('index.html'),ui=read('assets/gearex-trace-ui.js');
 for(const id of ['traceModeChooser','traceManualMode','traceAutoMode'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(ui.includes("mode='manual'"),'Manual must be the default');
 assert.ok(ui.includes("manual.addEventListener('click'"));
 assert.ok(ui.includes("automatic.addEventListener('click'"));
 assert.ok(ui.includes("result.pendingInput"));
 assert.ok(ui.includes("inputs.push(input.value)"));
});

test('C++ getline reads a complete name including spaces',()=>{
 const src='#include <iostream>\nint main(){\nstd::string name;\nstd::getline(std::cin, name);\nstd::cout << name << std::endl;\nreturn 0;\n}';
 assert.equal(engine.run(src,'cpp').pendingInput.prompt,'Enter name (getline)');
 const result=engine.run(src,'cpp',{inputs:['Ada Lovelace']});
 assert.deepEqual(result.warnings,[]);
 assert.equal(resultOutput(result),'Ada Lovelace\n');
});
test('Plain input-only programs are detected without a print statement',()=>{
 assert.equal(engine.detect("name = input('Name?')"),'py');
 assert.equal(engine.detect("value = prompt('Value?')"),'js');
 assert.equal(engine.detect("x = Console.ReadLine()"),'cs');
});

test('Grouped C declarations are traced as separate variables rather than unsupported syntax',()=>{
 const code='#include <stdio.h>\nint main(){\n int a,b;\n scanf("%d %d",&a,&b);\n printf("%d\\n",a+b);\n return 0;\n}';
 const checked=engine.validate(code,'c');
 assert.equal(checked.ok,true,JSON.stringify(checked.issues));
 assert.equal(engine.run(code,'c').pendingInput.prompt,'Enter a (scanf)');
 const traced=engine.run(code,'c',{inputs:['3','4']});
 assert.deepEqual(traced.warnings,[]);
 assert.equal(resultOutput(traced),'7\n');
 assert.ok(traced.steps.some(s=>s.frames.some(f=>f.vars.a==='3'&&f.vars.b==='4')));
});
test('Grouped declarations with independent initializers work in C/C++/Java/C#',()=>{
 const examples=[
 ['c','#include <stdio.h>\nint main(){int a=3, b=5;\nprintf("%d\\n",a+b);\nreturn 0;}'],
 ['cpp','#include <iostream>\nint main(){int a=3, b=5;\nstd::cout << a+b << std::endl;\nreturn 0;}'],
 ['java','public class Main {\npublic static void main(String[] args){int a=3, b=5;\nSystem.out.println(a+b);\n}}'],
 ['cs','using System;\nclass Program {static void Main(){int a=3, b=5;\nConsole.WriteLine(a+b);\n}}']
 ];
 for(const [lang,code] of examples){
   assert.equal(engine.validate(code,lang).ok,true,lang+' preflight should allow grouped declarations');
   const result=engine.run(code,lang);
   assert.deepEqual(result.warnings,[],lang);
   assert.equal(resultOutput(result),'8\n',lang);
 }
});
test('Preflight catches missing semicolon and reports original source line',()=>{
 const checked=engine.validate('#include <stdio.h>\nint main(){\nint a,b\nreturn 0;\n}','c');
 assert.equal(checked.ok,false);
 assert.ok(checked.issues.some(i=>i.line===3&&i.message.includes('Missing ";"')));
});
test('Preflight catches invalid initializers even on unreachable lines',()=>{
 const src='int main(){\nint a = 1;\nif (a == 2) {\nint b = (3 + );\n}\nreturn 0;\n}';
 const checked=engine.validate(src,'c');
 assert.equal(checked.ok,false);
 assert.ok(checked.issues.some(i=>i.line===4&&i.message.includes('Invalid initializer')));
});
test('Preflight reports unmatched braces and unterminated string literals with line',()=>{
 const unmatched=engine.validate('int main(){\nint a=3;\n','c');
 assert.ok(unmatched.issues.some(i=>i.line===1&&i.message.includes('matching closing')));
 const unterminated=engine.validate('int main(){\nprintf("hello);\nreturn 0;\n}','c');
 assert.ok(unterminated.issues.some(i=>i.line===2&&i.message.includes('Unclosed string')));
});
test('Preflight spots Python missing colon and missing indentation',()=>{
 const colon=engine.validate('if True\n    print(1)','py');
 assert.equal(colon.ok,false);
 assert.ok(colon.issues.some(i=>i.line===1&&i.message.includes('Expected ":"')));
 const indent=engine.validate('if True:\nprint(1)','py');
 assert.equal(indent.ok,false);
 assert.ok(indent.issues.some(i=>i.line===2&&i.message.includes('indented block')));
});
test('Waiting for stdin passes preflight and is not mistaken for a syntax problem',()=>{
 const code="a = int(input('Value? '))\nprint(a+1)";
 const checked=engine.validate(code,'py');
 assert.equal(checked.ok,true,JSON.stringify(checked.issues));
 const pending=engine.run(code,'py');
 assert.deepEqual(pending.warnings,[]);
 assert.equal(pending.pendingInput.line,1);
});
test('Runtime errors expose the original execution source line',()=>{
 const code='int main(){\nint a=4;\nint b=0;\nint answer=a/b;\nreturn 0;\n}';
 const checked=engine.validate(code,'c');
 assert.equal(checked.ok,true);
 const result=engine.run(code,'c');
 assert.ok(result.warnings.length>0);
 assert.ok(result.errors.some(e=>e.line===4&&e.message.includes('Division by zero')));
});
test('SQL preflight clearly remains conceptual rather than full database validation',()=>{
 const result=engine.validate('SELECT name FROM people','sql');
 assert.equal(result.scope,'sql-outline');
 assert.equal(result.ok,true);
});
test('Visualizer checks code before building and lets users inspect diagnostic lines',()=>{
 const ui=read('assets/gearex-trace-ui.js');
 assert.ok(ui.includes('E.validate(text,language)'),'Validation must happen before starting the trace');
 assert.ok(ui.includes('if(!check.ok){showDiagnostics'),'Do not start tracing on a failed syntax check');
 assert.ok(ui.includes('traceErrors(candidate,language)'),'Dynamic errors must be shown before tracing');
 assert.ok(ui.includes('setSelectionRange(start,end)'),'Diagnostic line buttons must select the source line');
 assert.ok(ui.includes('trace-preflight-status'),'Users need a validation result');
});
