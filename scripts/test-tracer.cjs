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
