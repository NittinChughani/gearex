/* GearEx expanded curriculum: eight distinct, runnable lessons for each non-C/C++ language.
 * Existing lesson IDs and completion records are never changed.
 */
LESSONS.push(...[
  {
    "id": "py-gearex-9",
    "lang": "py",
    "title": "File reading with with",
    "level": "Intermediate",
    "description": "Use a context manager to close files reliably.",
    "intro": "Use a context manager to close files reliably. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "with open('notes.txt', 'w', encoding='utf-8') as file:\n    file.write('GearEx')\nwith open('notes.txt', encoding='utf-8') as file:\n    print(file.read())",
    "output": "GearEx",
    "challenge": "Change the written message and read it back.",
    "syntax": "with open(...) as f:",
    "points": [
      "The context manager closes the file even if an error occurs.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. The context manager closes the file even if an error occurs. The sample's expected result is GearEx.",
    "pitfalls": "The context manager closes the file even if an error occurs."
  },
  {
    "id": "py-gearex-10",
    "lang": "py",
    "title": "Handling exceptions",
    "level": "Intermediate",
    "description": "Catch expected errors without hiding unrelated bugs.",
    "intro": "Catch expected errors without hiding unrelated bugs. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "try:\n    number = int('oops')\nexcept ValueError:\n    print('Invalid number')",
    "output": "Invalid number",
    "challenge": "Handle a missing dictionary key separately.",
    "syntax": "try / except ValueError",
    "points": [
      "Catch specific exceptions instead of a broad bare except.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Catch specific exceptions instead of a broad bare except. The sample's expected result is Invalid number.",
    "pitfalls": "Catch specific exceptions instead of a broad bare except."
  },
  {
    "id": "py-gearex-11",
    "lang": "py",
    "title": "Tuples and sets",
    "level": "Intermediate",
    "description": "Use immutable sequences and unique collections.",
    "intro": "Use immutable sequences and unique collections. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "point = (3, 5)\ncolors = {'blue', 'red', 'blue'}\nprint(point[0], len(colors))",
    "output": "3 2",
    "challenge": "Try unpacking the tuple into two variables.",
    "syntax": "tuple = (a,b); set = {a,b}",
    "points": [
      "A tuple keeps its items fixed; a set removes duplicates.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A tuple keeps its items fixed; a set removes duplicates. The sample's expected result is 3 2.",
    "pitfalls": "A tuple keeps its items fixed; a set removes duplicates."
  },
  {
    "id": "py-gearex-12",
    "lang": "py",
    "title": "List comprehensions",
    "level": "Advanced",
    "description": "Build a new list from an iterable with a concise expression.",
    "intro": "Build a new list from an iterable with a concise expression. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "squares = [n * n for n in range(1, 5)]\nprint(squares)",
    "output": "[1, 4, 9, 16]",
    "challenge": "Filter the squares to only even results.",
    "syntax": "[expression for item in iterable]",
    "points": [
      "Comprehensions produce a list; a generator expression is lazy.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Comprehensions produce a list; a generator expression is lazy. The sample's expected result is [1, 4, 9, 16].",
    "pitfalls": "Comprehensions produce a list; a generator expression is lazy."
  },
  {
    "id": "py-gearex-13",
    "lang": "py",
    "title": "Classes and methods",
    "level": "Advanced",
    "description": "Model objects with instance attributes and behavior.",
    "intro": "Model objects with instance attributes and behavior. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "class Counter:\n    def __init__(self):\n        self.value = 0\n    def add(self):\n        self.value += 1\nc = Counter()\nc.add()\nprint(c.value)",
    "output": "1",
    "challenge": "Add a reset method to Counter.",
    "syntax": "class Name: def method(self):",
    "points": [
      "self refers to the instance receiving the method call.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. self refers to the instance receiving the method call. The sample's expected result is 1.",
    "pitfalls": "self refers to the instance receiving the method call."
  },
  {
    "id": "py-gearex-14",
    "lang": "py",
    "title": "Modules and imports",
    "level": "Advanced",
    "description": "Reuse standard-library functionality across files.",
    "intro": "Reuse standard-library functionality across files. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "import math\nprint(math.isqrt(81))",
    "output": "9",
    "challenge": "Try math.factorial on a small positive integer.",
    "syntax": "import module; module.function()",
    "points": [
      "A module groups reusable names and code.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A module groups reusable names and code. The sample's expected result is 9.",
    "pitfalls": "A module groups reusable names and code."
  },
  {
    "id": "py-gearex-15",
    "lang": "py",
    "title": "JSON serialization",
    "level": "Advanced",
    "description": "Exchange structured data using JSON text.",
    "intro": "Exchange structured data using JSON text. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "import json\npayload = json.dumps({'course': 'Python', 'done': True})\nprint(json.loads(payload)['course'])",
    "output": "Python",
    "challenge": "Serialize a list of two learner names.",
    "syntax": "json.dumps(value); json.loads(text)",
    "points": [
      "JSON strings are text, not Python dictionary objects.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. JSON strings are text, not Python dictionary objects. The sample's expected result is Python.",
    "pitfalls": "JSON strings are text, not Python dictionary objects."
  },
  {
    "id": "py-gearex-16",
    "lang": "py",
    "title": "Sorting with key functions",
    "level": "Advanced",
    "description": "Control sorting with custom keys and stable ordering.",
    "intro": "Control sorting with custom keys and stable ordering. This lesson builds on earlier Python fundamentals and shows the concept in a small, runnable example.",
    "code": "names = ['Zoe', 'al', 'Bea']\nprint(sorted(names, key=str.lower))",
    "output": "['al', 'Bea', 'Zoe']",
    "challenge": "Sort words by length using key=len.",
    "syntax": "sorted(items, key=callable)",
    "points": [
      "sorted returns a new list without modifying the original.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. sorted returns a new list without modifying the original. The sample's expected result is ['al', 'Bea', 'Zoe'].",
    "pitfalls": "sorted returns a new list without modifying the original."
  },
  {
    "id": "js-gearex-9",
    "lang": "js",
    "title": "Array map and filter",
    "level": "Intermediate",
    "description": "Transform and select items without manually managing indexes.",
    "intro": "Transform and select items without manually managing indexes. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "const nums = [1, 2, 3, 4];\nconsole.log(nums.filter(n => n % 2 === 0).map(n => n * 10).join(','));",
    "output": "20,40",
    "challenge": "Map all numbers to their squares.",
    "syntax": "array.filter(fn).map(fn)",
    "points": [
      "map creates a new array; filter keeps matching elements.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. map creates a new array; filter keeps matching elements. The sample's expected result is 20,40.",
    "pitfalls": "map creates a new array; filter keeps matching elements."
  },
  {
    "id": "js-gearex-10",
    "lang": "js",
    "title": "Objects and destructuring",
    "level": "Intermediate",
    "description": "Read named fields from objects using destructuring.",
    "intro": "Read named fields from objects using destructuring. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "const user = {name: 'Ada', score: 92};\nconst {name, score} = user;\nconsole.log(name, score);",
    "output": "Ada 92",
    "challenge": "Add a role field and destructure it.",
    "syntax": "const {field} = object",
    "points": [
      "Destructuring extracts properties; it does not rename the object.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Destructuring extracts properties; it does not rename the object. The sample's expected result is Ada 92.",
    "pitfalls": "Destructuring extracts properties; it does not rename the object."
  },
  {
    "id": "js-gearex-11",
    "lang": "js",
    "title": "Template literals",
    "level": "Intermediate",
    "description": "Embed expressions directly into readable strings.",
    "intro": "Embed expressions directly into readable strings. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "const lang = 'JavaScript';\nconsole.log(`Learn ${lang}!`);",
    "output": "Learn JavaScript!",
    "challenge": "Add a numeric score expression to the template.",
    "syntax": "`text ${expression}`",
    "points": [
      "Template literals use backticks rather than quotes.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Template literals use backticks rather than quotes. The sample's expected result is Learn JavaScript!.",
    "pitfalls": "Template literals use backticks rather than quotes."
  },
  {
    "id": "js-gearex-12",
    "lang": "js",
    "title": "Sets and Maps",
    "level": "Advanced",
    "description": "Store unique values and key-value pairs.",
    "intro": "Store unique values and key-value pairs. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "const tags = new Set(['web', 'web', 'code']);\nconst counts = new Map([['visits', 3]]);\nconsole.log(tags.size, counts.get('visits'));",
    "output": "2 3",
    "challenge": "Increment the visits value in the map.",
    "syntax": "new Set(items); new Map(entries)",
    "points": [
      "A Map supports keys beyond plain object property strings.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A Map supports keys beyond plain object property strings. The sample's expected result is 2 3.",
    "pitfalls": "A Map supports keys beyond plain object property strings."
  },
  {
    "id": "js-gearex-13",
    "lang": "js",
    "title": "Promises",
    "level": "Advanced",
    "description": "Represent the eventual outcome of asynchronous work.",
    "intro": "Represent the eventual outcome of asynchronous work. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "Promise.resolve(7).then(value => console.log(value * 2));",
    "output": "14",
    "challenge": "Chain another then to transform the value.",
    "syntax": "promise.then(callback)",
    "points": [
      "A Promise can be pending, fulfilled or rejected.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A Promise can be pending, fulfilled or rejected. The sample's expected result is 14.",
    "pitfalls": "A Promise can be pending, fulfilled or rejected."
  },
  {
    "id": "js-gearex-14",
    "lang": "js",
    "title": "Async and await",
    "level": "Advanced",
    "description": "Write asynchronous workflows with readable sequential syntax.",
    "intro": "Write asynchronous workflows with readable sequential syntax. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "async function score() {\n  const result = await Promise.resolve(21);\n  console.log(result * 2);\n}\nscore();",
    "output": "42",
    "challenge": "Add try/catch around a rejected promise.",
    "syntax": "async function f(){await promise;}",
    "points": [
      "await pauses the async function, not the whole JavaScript runtime.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. await pauses the async function, not the whole JavaScript runtime. The sample's expected result is 42.",
    "pitfalls": "await pauses the async function, not the whole JavaScript runtime."
  },
  {
    "id": "js-gearex-15",
    "lang": "js",
    "title": "Classes and constructors",
    "level": "Advanced",
    "description": "Create reusable objects with class syntax.",
    "intro": "Create reusable objects with class syntax. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "class Player {\n  constructor(name) { this.name = name; }\n  greet() { return `Hi ${this.name}`; }\n}\nconsole.log(new Player('Ada').greet());",
    "output": "Hi Ada",
    "challenge": "Add a score property to the constructor.",
    "syntax": "class Name { constructor(){} }",
    "points": [
      "Class methods are shared through the prototype.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Class methods are shared through the prototype. The sample's expected result is Hi Ada.",
    "pitfalls": "Class methods are shared through the prototype."
  },
  {
    "id": "js-gearex-16",
    "lang": "js",
    "title": "Error handling",
    "level": "Advanced",
    "description": "Use try/catch to handle failures at a clear boundary.",
    "intro": "Use try/catch to handle failures at a clear boundary. This lesson builds on earlier JavaScript fundamentals and shows the concept in a small, runnable example.",
    "code": "try {\n  JSON.parse('{invalid');\n} catch (error) {\n  console.log('Invalid JSON');\n}",
    "output": "Invalid JSON",
    "challenge": "Log error.message for debugging.",
    "syntax": "try { ... } catch (error) { ... }",
    "points": [
      "Do not swallow unexpected errors silently.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Do not swallow unexpected errors silently. The sample's expected result is Invalid JSON.",
    "pitfalls": "Do not swallow unexpected errors silently."
  },
  {
    "id": "java-gearex-9",
    "lang": "java",
    "title": "String operations",
    "level": "Intermediate",
    "description": "Work with immutable String values and their methods.",
    "intro": "Work with immutable String values and their methods. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "public class Main { public static void main(String[] args) { String s = \"GearEx\"; System.out.println(s.toUpperCase()); } }",
    "output": "GEAREX",
    "challenge": "Print the string length.",
    "syntax": "text.length(); text.toUpperCase()",
    "points": [
      "Strings are immutable: methods return new values.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Strings are immutable: methods return new values. The sample's expected result is GEAREX.",
    "pitfalls": "Strings are immutable: methods return new values."
  },
  {
    "id": "java-gearex-10",
    "lang": "java",
    "title": "Arrays and iteration",
    "level": "Intermediate",
    "description": "Process fixed-size arrays using an enhanced for loop.",
    "intro": "Process fixed-size arrays using an enhanced for loop. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "public class Main { public static void main(String[] args) { int[] a = {2,4,6}; int sum=0; for(int n:a) sum+=n; System.out.println(sum); } }",
    "output": "12",
    "challenge": "Find the largest array element.",
    "syntax": "for (int item : array)",
    "points": [
      "Array length is a field, not a method.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Array length is a field, not a method. The sample's expected result is 12.",
    "pitfalls": "Array length is a field, not a method."
  },
  {
    "id": "java-gearex-11",
    "lang": "java",
    "title": "ArrayList collections",
    "level": "Intermediate",
    "description": "Grow a list dynamically and access elements by index.",
    "intro": "Grow a list dynamically and access elements by index. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "import java.util.ArrayList;\npublic class Main { public static void main(String[] args) { ArrayList<String> a=new ArrayList<>(); a.add(\"Java\"); System.out.println(a.get(0)); } }",
    "output": "Java",
    "challenge": "Add two elements and print size().",
    "syntax": "list.add(item); list.get(index)",
    "points": [
      "ArrayList is resizable; arrays have fixed length.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. ArrayList is resizable; arrays have fixed length. The sample's expected result is Java.",
    "pitfalls": "ArrayList is resizable; arrays have fixed length."
  },
  {
    "id": "java-gearex-12",
    "lang": "java",
    "title": "Constructors",
    "level": "Advanced",
    "description": "Initialize object state when a new instance is created.",
    "intro": "Initialize object state when a new instance is created. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "class Book { String title; Book(String t) { title=t; } }\npublic class Main { public static void main(String[] args) { System.out.println(new Book(\"Code\").title); } }",
    "output": "Code",
    "challenge": "Add a second field initialized by the constructor.",
    "syntax": "new ClassName(argument)",
    "points": [
      "A constructor has the same name as its class and no return type.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A constructor has the same name as its class and no return type. The sample's expected result is Code.",
    "pitfalls": "A constructor has the same name as its class and no return type."
  },
  {
    "id": "java-gearex-13",
    "lang": "java",
    "title": "Inheritance and overrides",
    "level": "Advanced",
    "description": "Extend a class and specialize its behavior.",
    "intro": "Extend a class and specialize its behavior. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "class Animal { String sound(){return \"?\";} }\nclass Cat extends Animal { @Override String sound(){return \"meow\";} }\npublic class Main { public static void main(String[] args) { Animal a=new Cat(); System.out.println(a.sound()); } }",
    "output": "meow",
    "challenge": "Add a Dog subclass with a different sound.",
    "syntax": "class Child extends Parent",
    "points": [
      "Overridden methods are selected by the runtime object type.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Overridden methods are selected by the runtime object type. The sample's expected result is meow.",
    "pitfalls": "Overridden methods are selected by the runtime object type."
  },
  {
    "id": "java-gearex-14",
    "lang": "java",
    "title": "Interfaces",
    "level": "Advanced",
    "description": "Define a contract implemented by different classes.",
    "intro": "Define a contract implemented by different classes. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "interface Printable { String text(); }\nclass Report implements Printable { public String text(){return \"Ready\";} }\npublic class Main { public static void main(String[] args) { Printable p=new Report(); System.out.println(p.text()); } }",
    "output": "Ready",
    "challenge": "Implement a second class using the same interface.",
    "syntax": "class Name implements Interface",
    "points": [
      "Interface references can hold any compatible implementation.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Interface references can hold any compatible implementation. The sample's expected result is Ready.",
    "pitfalls": "Interface references can hold any compatible implementation."
  },
  {
    "id": "java-gearex-15",
    "lang": "java",
    "title": "Exceptions",
    "level": "Advanced",
    "description": "Handle an expected runtime exception precisely.",
    "intro": "Handle an expected runtime exception precisely. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "public class Main { public static void main(String[] args) { try { Integer.parseInt(\"x\"); } catch(NumberFormatException e) { System.out.println(\"Bad number\"); } } }",
    "output": "Bad number",
    "challenge": "Try parsing a valid integer.",
    "syntax": "try { } catch (ExceptionType e) { }",
    "points": [
      "Catch the narrowest exception that your code can handle.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Catch the narrowest exception that your code can handle. The sample's expected result is Bad number.",
    "pitfalls": "Catch the narrowest exception that your code can handle."
  },
  {
    "id": "java-gearex-16",
    "lang": "java",
    "title": "HashMap and generics",
    "level": "Advanced",
    "description": "Store and retrieve values by typed keys.",
    "intro": "Store and retrieve values by typed keys. This lesson builds on earlier Java fundamentals and shows the concept in a small, runnable example.",
    "code": "import java.util.HashMap;\npublic class Main { public static void main(String[] args) { HashMap<String,Integer> m=new HashMap<>(); m.put(\"A\",5); System.out.println(m.get(\"A\")); } }",
    "output": "5",
    "challenge": "Add another key and print the map size.",
    "syntax": "Map<K,V>; map.put(key,value)",
    "points": [
      "Generics help the compiler check key and value types.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Generics help the compiler check key and value types. The sample's expected result is 5.",
    "pitfalls": "Generics help the compiler check key and value types."
  },
  {
    "id": "cs-gearex-9",
    "lang": "cs",
    "title": "Arrays and foreach",
    "level": "Intermediate",
    "description": "Iterate safely through a fixed collection.",
    "intro": "Iterate safely through a fixed collection. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nclass Program { static void Main() { int[] a={2,4,6}; int total=0; foreach(int n in a) total+=n; Console.WriteLine(total); } }",
    "output": "12",
    "challenge": "Print each array value on a separate line.",
    "syntax": "foreach (var item in items)",
    "points": [
      "Arrays have fixed length; use List<T> for dynamic size.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Arrays have fixed length; use List<T> for dynamic size. The sample's expected result is 12.",
    "pitfalls": "Arrays have fixed length; use List<T> for dynamic size."
  },
  {
    "id": "cs-gearex-10",
    "lang": "cs",
    "title": "Lists and generics",
    "level": "Intermediate",
    "description": "Store typed items in a resizable list.",
    "intro": "Store typed items in a resizable list. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nusing System.Collections.Generic;\nclass Program { static void Main() { var a=new List<int>{2,3}; a.Add(5); Console.WriteLine(a.Count); } }",
    "output": "3",
    "challenge": "Remove one item and print the new count.",
    "syntax": "List<T>.Add(value)",
    "points": [
      "Generic lists enforce element types at compile time.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Generic lists enforce element types at compile time. The sample's expected result is 3.",
    "pitfalls": "Generic lists enforce element types at compile time."
  },
  {
    "id": "cs-gearex-11",
    "lang": "cs",
    "title": "Dictionaries",
    "level": "Intermediate",
    "description": "Look up values by unique keys.",
    "intro": "Look up values by unique keys. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nusing System.Collections.Generic;\nclass Program { static void Main() { var d=new Dictionary<string,int>{{\"Ada\",95}}; Console.WriteLine(d[\"Ada\"]); } }",
    "output": "95",
    "challenge": "Use TryGetValue to handle a missing key.",
    "syntax": "Dictionary<TKey,TValue>",
    "points": [
      "Indexing a missing key throws; TryGetValue avoids that.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Indexing a missing key throws; TryGetValue avoids that. The sample's expected result is 95.",
    "pitfalls": "Indexing a missing key throws; TryGetValue avoids that."
  },
  {
    "id": "cs-gearex-12",
    "lang": "cs",
    "title": "Properties and encapsulation",
    "level": "Advanced",
    "description": "Expose controlled access to object state.",
    "intro": "Expose controlled access to object state. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nclass Student { public string Name {get;set;}=\"\"; }\nclass Program { static void Main() { var s=new Student{Name=\"Ada\"}; Console.WriteLine(s.Name); } }",
    "output": "Ada",
    "challenge": "Add an integer Score property.",
    "syntax": "public Type Name { get; set; }",
    "points": [
      "Properties provide a public API without exposing fields directly.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Properties provide a public API without exposing fields directly. The sample's expected result is Ada.",
    "pitfalls": "Properties provide a public API without exposing fields directly."
  },
  {
    "id": "cs-gearex-13",
    "lang": "cs",
    "title": "Inheritance and virtual methods",
    "level": "Advanced",
    "description": "Override behavior through a base-class reference.",
    "intro": "Override behavior through a base-class reference. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nclass Animal { public virtual string Sound()=>\"?\"; }\nclass Cat:Animal { public override string Sound()=>\"meow\"; }\nclass Program { static void Main() { Animal a=new Cat(); Console.WriteLine(a.Sound()); } }",
    "output": "meow",
    "challenge": "Create a Dog override.",
    "syntax": "virtual / override",
    "points": [
      "Dynamic dispatch calls the derived override at runtime.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Dynamic dispatch calls the derived override at runtime. The sample's expected result is meow.",
    "pitfalls": "Dynamic dispatch calls the derived override at runtime."
  },
  {
    "id": "cs-gearex-14",
    "lang": "cs",
    "title": "Interfaces",
    "level": "Advanced",
    "description": "Specify capabilities that multiple types can implement.",
    "intro": "Specify capabilities that multiple types can implement. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\ninterface ILabel { string Text(); }\nclass Item:ILabel { public string Text()=>\"Ready\"; }\nclass Program { static void Main() { ILabel x=new Item(); Console.WriteLine(x.Text()); } }",
    "output": "Ready",
    "challenge": "Create another class implementing ILabel.",
    "syntax": "interface IName { ... }",
    "points": [
      "Interfaces define a contract, not an object instance.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Interfaces define a contract, not an object instance. The sample's expected result is Ready.",
    "pitfalls": "Interfaces define a contract, not an object instance."
  },
  {
    "id": "cs-gearex-15",
    "lang": "cs",
    "title": "Exception handling",
    "level": "Advanced",
    "description": "Recover from expected conversion errors.",
    "intro": "Recover from expected conversion errors. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nclass Program { static void Main() { try { int.Parse(\"oops\"); } catch(FormatException) { Console.WriteLine(\"Invalid\"); } } }",
    "output": "Invalid",
    "challenge": "Try int.TryParse for user input.",
    "syntax": "try { } catch (FormatException) { }",
    "points": [
      "Prefer TryParse for normal validation rather than exceptions.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Prefer TryParse for normal validation rather than exceptions. The sample's expected result is Invalid.",
    "pitfalls": "Prefer TryParse for normal validation rather than exceptions."
  },
  {
    "id": "cs-gearex-16",
    "lang": "cs",
    "title": "LINQ queries",
    "level": "Advanced",
    "description": "Express filtering and projections over collections.",
    "intro": "Express filtering and projections over collections. This lesson builds on earlier C# fundamentals and shows the concept in a small, runnable example.",
    "code": "using System;\nusing System.Linq;\nclass Program { static void Main() { int[] a={1,2,3,4}; Console.WriteLine(string.Join(\",\",a.Where(n=>n%2==0))); } }",
    "output": "2,4",
    "challenge": "Use Select to double each number.",
    "syntax": "items.Where(predicate).Select(mapper)",
    "points": [
      "LINQ can defer execution until the result is enumerated.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. LINQ can defer execution until the result is enumerated. The sample's expected result is 2,4.",
    "pitfalls": "LINQ can defer execution until the result is enumerated."
  },
  {
    "id": "sql-gearex-9",
    "lang": "sql",
    "title": "INNER JOIN",
    "level": "Intermediate",
    "description": "Combine rows whose keys match in two tables.",
    "intro": "Combine rows whose keys match in two tables. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "SELECT u.name, o.total FROM (SELECT 1 AS id, 'Ada' AS name) AS u INNER JOIN (SELECT 1 AS user_id, 42 AS total) AS o ON u.id = o.user_id;",
    "output": "Ada | 42",
    "challenge": "Change the join condition to see which rows match.",
    "syntax": "SELECT ... FROM a JOIN b ON a.id=b.id",
    "points": [
      "INNER JOIN excludes rows without a matching partner.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. INNER JOIN excludes rows without a matching partner. The sample's expected result is Ada | 42.",
    "pitfalls": "INNER JOIN excludes rows without a matching partner."
  },
  {
    "id": "sql-gearex-10",
    "lang": "sql",
    "title": "LEFT JOIN",
    "level": "Intermediate",
    "description": "Keep every left-side row even when no right-side match exists.",
    "intro": "Keep every left-side row even when no right-side match exists. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "SELECT u.name, o.total FROM (SELECT 1 AS id, 'Ada' AS name) AS u LEFT JOIN (SELECT 2 AS user_id, 42 AS total) AS o ON u.id=o.user_id;",
    "output": "Ada | NULL",
    "challenge": "Compare the same query with INNER JOIN.",
    "syntax": "LEFT JOIN ... ON ...",
    "points": [
      "Unmatched right-side columns become NULL.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Unmatched right-side columns become NULL. The sample's expected result is Ada | NULL.",
    "pitfalls": "Unmatched right-side columns become NULL."
  },
  {
    "id": "sql-gearex-11",
    "lang": "sql",
    "title": "GROUP BY",
    "level": "Intermediate",
    "description": "Summarize rows into groups with aggregate functions.",
    "intro": "Summarize rows into groups with aggregate functions. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "SELECT category, COUNT(*) AS items FROM (SELECT 'A' AS category UNION ALL SELECT 'A' UNION ALL SELECT 'B') AS t GROUP BY category ORDER BY category;",
    "output": "A | 2; B | 1",
    "challenge": "Use SUM on a numeric column grouped by category.",
    "syntax": "GROUP BY column",
    "points": [
      "Every selected nonaggregate expression must follow grouping rules.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Every selected nonaggregate expression must follow grouping rules. The sample's expected result is A | 2; B | 1.",
    "pitfalls": "Every selected nonaggregate expression must follow grouping rules."
  },
  {
    "id": "sql-gearex-12",
    "lang": "sql",
    "title": "HAVING",
    "level": "Advanced",
    "description": "Filter aggregate groups after grouping.",
    "intro": "Filter aggregate groups after grouping. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "SELECT category, COUNT(*) AS n FROM (SELECT 'A' AS category UNION ALL SELECT 'A' UNION ALL SELECT 'B') AS t GROUP BY category HAVING COUNT(*) > 1;",
    "output": "A | 2",
    "challenge": "Change the threshold to include all groups.",
    "syntax": "GROUP BY ... HAVING COUNT(*) > 1",
    "points": [
      "WHERE filters rows before grouping; HAVING filters groups.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. WHERE filters rows before grouping; HAVING filters groups. The sample's expected result is A | 2.",
    "pitfalls": "WHERE filters rows before grouping; HAVING filters groups."
  },
  {
    "id": "sql-gearex-13",
    "lang": "sql",
    "title": "Subqueries",
    "level": "Advanced",
    "description": "Use a query result inside another query.",
    "intro": "Use a query result inside another query. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "SELECT name FROM (SELECT 'Ada' AS name, 92 AS score UNION ALL SELECT 'Lin', 65) AS students WHERE score > (SELECT 70);",
    "output": "Ada",
    "challenge": "Use a subquery to compute a comparison threshold.",
    "syntax": "WHERE value > (SELECT ...)",
    "points": [
      "A scalar subquery must return at most one row.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A scalar subquery must return at most one row. The sample's expected result is Ada.",
    "pitfalls": "A scalar subquery must return at most one row."
  },
  {
    "id": "sql-gearex-14",
    "lang": "sql",
    "title": "Primary and foreign keys",
    "level": "Advanced",
    "description": "Protect entity identity and table relationships.",
    "intro": "Protect entity identity and table relationships. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);\nCREATE TABLE books (id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES authors(id));\nSELECT 'tables created' AS result;",
    "output": "tables created",
    "challenge": "Add a NOT NULL constraint to a required column.",
    "syntax": "PRIMARY KEY; REFERENCES table(column)",
    "points": [
      "Foreign keys refer to an existing parent key when enforcement is enabled.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Foreign keys refer to an existing parent key when enforcement is enabled. The sample's expected result is tables created.",
    "pitfalls": "Foreign keys refer to an existing parent key when enforcement is enabled."
  },
  {
    "id": "sql-gearex-15",
    "lang": "sql",
    "title": "Indexes and query plans",
    "level": "Advanced",
    "description": "Speed up selective lookups with an index.",
    "intro": "Speed up selective lookups with an index. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "CREATE TABLE catalog (id INTEGER PRIMARY KEY, title TEXT);\nCREATE INDEX idx_catalog_title ON catalog(title);\nSELECT name FROM sqlite_master WHERE type='index' AND name='idx_catalog_title';",
    "output": "idx_catalog_title",
    "challenge": "Use EXPLAIN QUERY PLAN to inspect an indexed search.",
    "syntax": "CREATE INDEX name ON table(column)",
    "points": [
      "Indexes can speed reads but add storage and write overhead.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. Indexes can speed reads but add storage and write overhead. The sample's expected result is idx_catalog_title.",
    "pitfalls": "Indexes can speed reads but add storage and write overhead."
  },
  {
    "id": "sql-gearex-16",
    "lang": "sql",
    "title": "Views and reusable queries",
    "level": "Advanced",
    "description": "Save a SELECT statement as a reusable virtual table.",
    "intro": "Save a SELECT statement as a reusable virtual table. This lesson builds on earlier SQL fundamentals and shows the concept in a small, runnable example.",
    "code": "CREATE VIEW active_courses AS SELECT 'Python' AS name, 1 AS active;\nSELECT name FROM active_courses WHERE active=1;",
    "output": "Python",
    "challenge": "Add a second column to the view.",
    "syntax": "CREATE VIEW name AS SELECT ...",
    "points": [
      "A regular view stores a query definition rather than duplicated rows.",
      "Predict the result before running the sample, then compare the output.",
      "Change the example and explain what the modification does."
    ],
    "walkthrough": "Read the code from top to bottom. A regular view stores a query definition rather than duplicated rows. The sample's expected result is Python.",
    "pitfalls": "A regular view stores a query definition rather than duplicated rows."
  }
]);
