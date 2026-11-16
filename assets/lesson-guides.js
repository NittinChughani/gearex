/* GearEx teaching guides: original, source-specific beginner explanations.
 * Each entry: concept, worked-example explanation, when to use it, try-it task.
 * Educational additions do not modify assessment IDs or completion records. */
const GEAR_LESSON_GUIDES = {};
Object.assign(GEAR_LESSON_GUIDES,{
'c-hello':[
'A C program is a set of instructions that a compiler turns into a program your computer can run. You write instructions in a source file, compile them, and then run the result. It is normal to begin with a small program that prints a message: this lets you verify the entire workflow before learning complicated logic.',
'In the example, #include <stdio.h> makes the standard input/output declarations available. Execution begins in main(), not at the include line. printf writes the greeting. The special characters \\n move the cursor to the next line. The final return 0 tells the environment the program finished successfully.',
'Almost every larger C program still has the same basic structure: required header files, a main function, statements, and an exit status.',
'Change the message, run the program again, then remove the semicolon after printf and compare the compiler response.'
],
'c-variables':[
'Think of a variable as a labeled place where a program keeps a value. Before you use a variable in C, you declare its type and its name. An int is used for whole numbers such as 0, 12, and -7; it does not represent a fractional value like 3.5. A double stores many fractional values, while a char stores a single character such as A. Choosing the right type helps the computer interpret the stored bits correctly.',
'The statement int age = 18 creates a whole-number variable called age and starts it at 18. double score = 92.5 keeps the decimal part, and char grade = \'A\' stores one character. printf uses %d for an int, %.1f for a decimal formatted to one digit after the point, and %c for a character. Each placeholder reads the matching argument in order.',
'Variables are how programs remember prices, scores, positions, counts, measurements, and user input. Later statements can use or change those named values.',
'Change age to 21 and score to 87.25. Predict exactly which three values the final printf will display.'
],
'c-conditionals':[
'Programs often need to make decisions. An if statement asks a question whose result is true or false, then runs only the matching branch. else gives an alternative when the condition is false. The code inside the braces belongs to that particular branch, so you should not expect both messages to print.',
'The example starts with score = 76. The condition score >= 50 means “is the score at least 50?” Because 76 meets that requirement, the program prints Pass and skips the else block. The operator == tests equality; the single = sign assigns a value. Confusing them can silently change program behavior.',
'The same pattern can check whether a password is long enough, an item is in stock, or a student reaches a passing mark.',
'Set score to 49, then to exactly 50. For each value, predict which branch runs before you execute it.'
],
'c-loops':[
'A loop repeats instructions so you do not have to write the same statement many times. A for loop is especially useful when you know the starting counter, a stopping condition, and how the counter should change. Without a reliable stopping condition, a loop may continue longer than intended.',
'In for (int i = 1; i <= 5; i++), i starts at 1. The condition checks whether i is still at most 5. The body prints the current value; then i++ adds one. This produces 1, 2, 3, 4, 5, one value per line. When i becomes 6, the condition fails and the loop ends.',
'Loops are useful for processing arrays, calculating totals, and repeating a task for every item in a collection.',
'Change the upper limit to 3. Then change i++ to i += 2 and work out how many times the body runs.'
],
'c-functions':[
'A function gives a reusable name to a piece of logic. Rather than copying the same calculation everywhere, you define a function once and call it with different arguments. A parameter is a named input inside the function; a return value carries the answer back to the caller.',
'square(int n) promises to accept an integer and return an integer. When main calls square(6), the parameter n becomes 6 inside that call. The expression n * n produces 36, and return passes it back to printf. Notice that the function definition describes how to calculate an answer, while the call actually requests the calculation.',
'Functions make a large program easier to test, understand, and change because each small part has a clear responsibility.',
'Call square(4) and square(9). Predict both results and explain what happens to n during each call.'
],
'c-arrays':[
'An array holds several values of the same type under one variable name. Each value occupies a numbered position called an index. In C the first index is 0, not 1: an array of three items has valid positions 0, 1, and 2. Going beyond those bounds can lead to undefined behavior, so array limits matter.',
'The example stores 4, 8, and 12 in values. values[0] is 4, values[1] is 8, and values[2] is 12. The loop uses i as the index, printing each entry in order. When i reaches 3, the condition i < 3 becomes false before an invalid element is read.',
'Arrays are a basic way to represent lists of scores, sensor samples, daily temperatures, and other related values.',
'Replace 8 with 20. Predict the new output, then explain why values[3] is not a valid element here.'
],
'c-operators':[
'Operators tell a program to calculate or compare. Addition and multiplication are familiar, but division behaves differently depending on the types involved. When both operands are integers, C integer division discards the fractional part; % returns the remainder. Understanding the types is as important as understanding the mathematical symbol.',
'The example sets a to 9 and b to 4. a + b evaluates to 13. a / b is 2 because the values are both int, so the .25 part is discarded. a % b is 1 because 9 = 4 × 2 + 1. printf displays the three results in the order they are supplied.',
'These operations appear in timers, pagination, checks for even numbers, counters, and nearly every numerical algorithm.',
'Predict the results when a is 11 and b is 3. Then change a variable to double and investigate the division result.'
],
'c-input':[
'Input allows a program to work with values that are not known in advance. scanf reads text from standard input and tries to convert it to the requested types. Conversion can fail, so safe code checks the number of successfully read values before using them. The & operator tells scanf where a variable is stored so it can write the answer there.',
'The example declares two integers, a and b. scanf("%d %d", &a, &b) requests two whole numbers. If both conversions succeed, scanf returns 2 and the if branch prints their sum. Otherwise the program prints Invalid input instead of pretending that unread numbers are safe to use.',
'This is the foundation of interactive menus, calculators, and programs that respond to numbers entered by a person.',
'Enter 7 and 8 and predict the sum. Then enter text where a number is expected and observe the error-handling branch.'
],
'c-switch':[
'A switch chooses among several fixed choices based on one expression. It can be easier to read than a very long chain of if/else statements for menu numbers or named states. Each case describes one matching value; default handles anything not listed. break prevents execution from falling into the following case.',
'The example stores option = 2. The switch compares this value with the case labels. It skips case 1, enters case 2, prints Edit, then stops at break. If option were 99, default would print Unknown. A case label must be a value known at compile time.',
'Switch statements are common in command menus, simple parsers, and state machines with a small collection of discrete options.',
'Add case 3 for Delete. Predict what happens if you remove the break after case 2.'
],
'c-nested-loops':[
'A nested loop means one loop runs inside another. Think of drawing a grid: the outer loop chooses a row, and the inner loop visits positions within that row. Each time the outer loop advances, the inner loop starts again from its own initial value.',
'In the example row starts at 1. For each row, col begins at 1 and prints a star while col <= row. Row 1 prints one star, row 2 prints two, and row 3 prints three. The separate printf("\\n") finishes each row, turning one long stream of stars into a triangle.',
'Nested loops are used with tables, matrices, image pixels, board games, and comparisons between pairs of items.',
'Change the outer loop limit to 4. Sketch the expected four lines of stars before running the code.'
],
'c-strings':[
'A C string is an array of char values with a special ending byte called the null terminator, written \\0. Functions know where the text ends by finding that byte. If you reserve too little space, text operations can access invalid memory; the terminator needs room as well as the visible characters.',
'The string "Code" contains four visible letters, but its char array takes five bytes including \\0. strlen counts the four letters and stops before the terminator. The loop walks through word one character at a time until it finds \\0, and putchar prints each character.',
'Understanding null-terminated strings helps when working with text files, command-line arguments, and standard C libraries.',
'Replace Code with Hello. Predict strlen and the number of bytes needed for the complete stored string.'
],
'c-pointers':[
'A pointer is a variable that stores the address of another object. & asks for an object’s address, while * applied to a pointer accesses the object at that address. The pointer and the pointed-to value are different things: one tells you where data lives, and the other is the data itself.',
'The example creates score with value 42, then int *ptr = &score stores its address in ptr. The statement *ptr += 8 follows the pointer and adds eight to score itself. When printf prints score, the result is 50 even though the update used the name ptr.',
'Pointers help C functions modify caller data and build linked structures, dynamic arrays, and low-level interfaces.',
'Change score to 10 and the increment to 3. Draw arrows from ptr to score and predict the printed number.'
],
'c-structures':[
'A struct collects related fields into one value. Imagine a student record: an ID and GPA describe the same student but use different types. A structure lets you express that relationship instead of keeping disconnected variables and hoping they stay in sync.',
'struct Student describes two fields, id and gpa. The example creates s with id = 7 and gpa = 3.5. The dot operator accesses a field inside that particular value: s.id refers to the ID while s.gpa refers to the decimal GPA. The matching printf specifiers format each correctly.',
'Structures are useful for records such as students, products, game characters, points, and device readings.',
'Add an age field to the structure and initialize it. What other line must change if you want the age printed?'
],
'c-recursion':[
'Recursion happens when a function solves a problem by calling itself on a smaller version of the same problem. Every call gets its own parameter values and stack frame. To stop, a recursive function needs a base case that returns a result without making another recursive call.',
'factorial(n) returns 1 when n <= 1. Otherwise it returns n * factorial(n - 1). Calling factorial(5) leads to calls with 5, 4, 3, 2, and 1. The call at 1 returns first; the other calls multiply their results while returning, giving 120.',
'Recursion can naturally describe folder trees, nested data, divide-and-conquer algorithms, and some mathematical sequences.',
'Trace factorial(3) on paper and write down the stack order as calls enter and return.'
],
'c-dynamic-memory':[
'Automatic local variables usually disappear when their function finishes. Dynamic memory is different: a program explicitly requests space while it runs, then must release that space when finished. malloc allocates bytes and returns a pointer; free releases the allocation. Forgetting free can cause memory leaks.',
'The example requests enough bytes for three int values using malloc(3 * sizeof *items). It checks whether the pointer is null before using the storage. A loop fills the three positions with 10, 20, and 30. After printing the third value, free(items) releases the allocation.',
'Dynamic allocation is useful when the number of elements is only known at runtime or when data must outlive a small scope.',
'Explain why the null check matters. What should happen to an allocated block when you no longer need it?'
],
'c-files':[
'A program can save data beyond a single run by writing it to a file. Standard C represents an open file with a FILE pointer. File operations can fail because of permissions, paths, or unavailable storage, so every important step needs its return value checked.',
'fopen("notes.txt","w") asks to open a text file for writing. If it fails, the code reports an error. If it succeeds, fputs writes a line, then fclose flushes and closes the stream. Only after the file work succeeds does puts print Saved.',
'Files make programs useful for logs, exported reports, small datasets, and saved user settings.',
'Change the line being written. Predict what is saved if the program is run twice with mode "w" instead of append mode.'
],
'c-enums':[
'An enum gives readable names to related integral constants. Instead of remembering that 0 means red and 1 means green, you use the names RED and GREEN. typedef can give a longer type description a shorter alias that is easier to use in variable declarations.',
'The example creates an enumeration with RED, GREEN, BLUE. Because no numbers are specified, their values start at 0 and increment by one. typedef makes Color an alias for the enum type. Color selected = GREEN therefore stores the numeric value 1, which printf displays.',
'Enums make code easier to read for states such as a player direction, account status, or menu selection.',
'Set BLUE = 10 explicitly. Predict what numeric values follow for later members added after BLUE.'
],
'c-bitwise':[
'Every integer is stored as bits, each either 0 or 1. Bitwise operators work on those bits directly rather than treating the number as a single quantity. & preserves a bit only when both operands have it set; << shifts bits toward higher positions.',
'The example uses flags = 5, whose low four bits are 0101. flags & 1u keeps only the final bit, producing 1. flags << 1 moves those bits left one position, producing binary 1010, or decimal 10. The u suffix says the literal is unsigned.',
'Bitwise operations are useful for permission flags, hardware registers, compact status fields, and binary formats.',
'Try flags = 6 (binary 0110). Predict flags & 1u and flags << 1 before running.'
],
'c-binary-search':[
'Binary search is a fast way to find a value in an already sorted collection. Instead of checking every element from the beginning, it looks at the middle and discards the half that cannot contain the answer. Without sorted data, that reasoning breaks and the result is unreliable.',
'The example keeps a low index and a high index around the remaining search range. It calculates mid between them, compares a[mid] with the target, then moves either lo or hi. When it finds 10, it stores index 3 and exits. When the range becomes empty, the value was not found.',
'Binary search is common in sorted directories, lookup tables, and algorithms where repeated searching must be efficient.',
'Write the values of lo, hi, and mid for a search for 15. Why must the array be sorted first?'
],
'c-sorting':[
'Sorting rearranges values into an order, such as smallest to largest. Bubble sort works by comparing adjacent items and swapping those in the wrong order. Each pass moves a larger value farther toward the end. It is simple to understand but not the most efficient algorithm for large datasets.',
'The example begins with 4, 1, 3. Comparing 4 and 1 swaps them to make 1, 4, 3. Comparing 4 and 3 swaps again to make 1, 3, 4. Later passes check that no remaining pair is out of order.',
'Sorting helps when displaying ranked results, preparing data for binary search, or finding minimum and maximum items.',
'Trace the comparisons for the array 3, 2, 1. Write every swap and the array state after each pass.'
],
'c-preprocessor':[
'The preprocessor runs before the C compiler interprets the program itself. A #include directive asks it to bring in declarations from a header. A #define macro performs text substitution. Macros can be useful, but unlike ordinary functions, their arguments may be repeated or evaluated unexpectedly.',
'#include <stdio.h> makes printf available. The SQUARE(x) macro is defined as ((x) * (x)), with parentheses to preserve the intended order. When SQUARE(n + 1) is expanded for n = 5, the multiplication becomes (5 + 1) * (5 + 1), giving 36.',
'Headers and macros appear in real C programs when importing library functions and defining simple reusable constants.',
'Remove the parentheses around x in the macro and predict why SQUARE(n + 1) may no longer produce the intended result.'
],
'c-linked-lists':[
'A linked list stores elements in separate nodes, with each node holding data and a pointer to the next node. Unlike an array, the nodes do not need to sit next to each other in memory. The last node points to NULL, which is how traversal knows it has reached the end.',
'The example creates three nodes holding 10, 20, and 30. first.next points to second, and second.next points to third. A pointer named p starts at the first node, prints its value, then follows p->next. When p becomes NULL, the loop ends.',
'Linked structures are useful for understanding dynamic data structures such as queues, stacks, and graphs.',
'Draw three boxes with arrows for this list. What would change if second.next pointed directly to NULL?'
],
'c-error-handling':[
'A reliable program does not assume every operation succeeds. C library functions often return a value that tells you whether they worked. Checking those results before using the data prevents confusing output and some serious errors. Different functions use different conventions, such as NULL, EOF, or a status code.',
'strtol converts a string to a long integer and leaves a pointer showing where it stopped reading. The example parses "123", then checks that the entire string was consumed. If extra characters remain, it reports invalid input. Otherwise it prints the number.',
'Input parsing, file access, allocation, and network operations all benefit from explicit checks and useful error messages.',
'Try parsing "123abc". Where should the end pointer stop, and why should the program treat that input differently?'
],
'c-multidimensional':[
'A two-dimensional array can be pictured as a table of rows and columns. Each value is reached by giving two indices: first the row number, then the column number. Both indices start at zero in C, so a 2-by-2 matrix uses row 0 or 1 and column 0 or 1.',
'The example creates a matrix with rows [1,2] and [3,4]. The outer loop selects a row, and the inner loop visits its two columns. sum starts at zero and accumulates 1 + 2 + 3 + 4 to give 10. matrix[1][0] refers to 3.',
'Two-dimensional arrays are helpful for game boards, image grids, matrices, and tabular measurements.',
'Change matrix[1][1] from 4 to 9. Predict the new total and identify the row and column of the changed value.'
],
'c-scope':[
'Scope is the part of a program where a name is visible. A variable declared inside a function is normally local to that function call. Storage duration is a separate idea: it describes how long the underlying object exists. A static local variable keeps its stored value between calls even though its name is still local.',
'Inside counter, static int calls = 0 initializes once. Each call increments the same stored value, so the first call prints 1 and the next prints 2. If calls were an ordinary local variable initialized to zero on each call, each call would start again from zero.',
'Scope and storage duration matter whenever functions communicate through data or keep counters and cached state.',
'Replace static int calls with int calls. Predict the output of calling counter twice and explain why it changes.'
]
});


Object.assign(GEAR_LESSON_GUIDES,{
'cpp-hello':[
'C++ is a language that turns source code into an executable program. Its syntax includes statements ending in semicolons and blocks enclosed by braces. You can write small procedural programs or build larger designs with classes. A first program is a useful way to learn where execution begins and how to display a result.',
'#include <iostream> makes stream input/output tools available. int main() is where the program starts. std::cout is the standard output stream; the << operator sends the greeting to it. The \n inside the string creates a new line. The return 0 signals a successful finish.',
'Stream output is useful for showing results, debugging values, and building text-based interfaces.',
'Change the greeting to two different lines. What does adding another \n do?'
],
'cpp-input':[
'An interactive program reads values that the user enters. C++ commonly uses std::cin for input and std::cout for output. The type of the destination variable tells cin how to interpret the incoming characters. Because users can enter unexpected text, a program should check that the conversion succeeded.',
'int number{} creates an integer starting at zero. cout prints a prompt, then if (std::cin >> number) tries to read an integer and checks the stream state. On success the example prints number * 2. On failure it prints Invalid input instead of using a failed conversion.',
'This is the foundation of calculators, menus, and programs that accept configuration from the keyboard.',
'Enter 8 and predict the result. Then enter letters and explain why the else branch is necessary.'
],
'cpp-loops':[
'A loop runs the same body repeatedly while a condition permits it. The three parts of a traditional for loop are the starting state, the condition, and the update. You can read them as “start here; keep going while this remains true; change this after every repetition.”',
'for (int i = 1; i <= 5; ++i) starts at 1, prints the number, then increments i. It repeats with 2, 3, 4, and 5. When i becomes 6, the condition fails. std::cout << " " puts a space after each number so the output appears on one line.',
'Counting loops are useful for generating reports, filling collections, and performing a calculation a fixed number of times.',
'Change the starting counter to 3. Then use i += 2 and predict the numbers before compiling.'
],
'cpp-vectors':[
'A std::vector is a container that stores an ordered collection of elements and grows when needed. Unlike a plain fixed-length array, you do not have to know its final size when the program starts. You still use zero-based indexing, but the vector manages the storage needed for its elements.',
'The example starts nums with 2, 4, and 6. nums.push_back(8) adds a fourth element. The range-based for loop says “for each n in nums,” so n takes each value in order and cout prints it. The vector is responsible for managing the underlying memory as it grows.',
'Vectors are practical for storing student scores, search results, dynamic game objects, and many other collections.',
'Add 10 with push_back. Predict how many loop iterations run and explain why you did not have to allocate another array.'
],
'cpp-functions':[
'A function names a reusable operation. Arguments provide values for its parameters. C++ can accept a parameter by value (copying it) or by reference (using the caller’s object). A const reference lets code read a value without making an unnecessary copy while promising not to modify it.',
'greet(const std::string& name) takes a reference to text and does not return a value because its return type is void. When main calls greet("Ada"), name refers to the supplied text and cout combines it with a greeting. You can call the same function again with a different name.',
'Functions and references are useful for organizing reusable logic without copying potentially large strings or containers.',
'Call greet twice with different names. What difference would there be if the parameter were std::string name instead?'
],
'cpp-classes':[
'A class combines information and operations that work with that information. An object is one instance of a class. Encapsulation means keeping internal data protected and offering controlled operations to the outside world; private members cannot be accessed directly from ordinary external code.',
'Counter has a private integer named value, initially zero. Its public increment method adds one, while get returns the current value. The main function creates counter, calls increment, then prints counter.get(). The printed value comes from the method rather than direct access to value.',
'Classes are useful when modeling accounts, timers, players, shapes, and other things with both data and behavior.',
'Call increment twice. Explain why changing counter.value directly from main would not be allowed.'
],
'cpp-conditionals':[
'Conditional statements let a program make choices. Each condition evaluates to true or false. In an if / else if / else chain, conditions are examined in order, and the first matching branch runs. Remaining branches are skipped, even if their conditions would also be true.',
'The example has temperature = 24. It is not greater than 30, so the first branch is skipped. It is at least 18, so the second branch prints Mild. The else branch does not run. If the value were below 18, neither test would match and Cold would print.',
'This is useful for grading thresholds, categorizing measurements, and deciding which message or action to show.',
'Try 31, 18, and 17. Write which branch should run for each before executing.'
],
'cpp-strings':[
'std::string represents text as a managed C++ object. Unlike a raw C character array, it can resize itself and provides convenient operations such as adding text or asking for its length. A string is still a sequence of characters, but the class handles much of the underlying memory management.',
'The example starts name with "GearEx" and then uses += to append " Platform". name.size() counts the characters in the combined text, including the space. cout displays both the length and the combined string so you can connect the stored text to the result.',
'Strings are important for names, messages, filenames, user input, and practically every text-based application.',
'Append an exclamation mark and calculate the new size. Does the space contribute to the character count?'
],
'cpp-arrays':[
'std::array stores a fixed number of elements whose size is known when the program is compiled. It behaves like a regular container but keeps the storage size fixed. Its template arguments specify the element type and the number of elements, such as std::array<int, 3>.',
'The example initializes three integers: 3, 5, and 7. A range-based loop visits each value as n. For every item the program multiplies n by 2 and prints the result. The original elements remain unchanged because the loop variable n is a copy here.',
'Fixed-size arrays are useful when the number of fields or sensor readings is known and does not need to grow.',
'Predict the output, then change the range-based loop to use int& n and ask what changes if you update n.'
],
'cpp-references':[
'A reference gives an existing object an additional name. A pointer stores an address; a reference acts as an alias for the referred object. When you pass an argument by non-const reference, the function can change the original value rather than a temporary copy.',
'addFive(int& value) receives a reference to an integer. In main, score starts at 10. Calling addFive(score) binds value to that same score, and value += 5 updates it. The final cout therefore prints 15, even though the assignment happened inside the function.',
'References are especially useful for function parameters that need to modify an existing variable or avoid expensive copies.',
'Change score to 20. Would the result be the same if addFive accepted int value without the &? Explain.'
],
'cpp-constructors':[
'A constructor is a special class member that runs when a new object is created. It gives the object a valid starting state. Constructors share the class name, have no return type, and can initialize fields using an initializer list before the constructor body executes.',
'Point contains two integers x and y. The constructor Point(int a,int b) : x(a), y(b) sets those fields from its arguments. When the example creates Point p(4,7), x becomes 4 and y becomes 7. Calling p.sum() adds the two stored fields and returns 11.',
'Constructors matter whenever an object must start with meaningful values, such as a point, date, account, or connection settings.',
'Create a Point with 3 and 9. Predict p.sum() and identify where the two constructor arguments are stored.'
],
'cpp-inheritance':[
'Inheritance lets a derived class reuse accessible behavior from a base class. The relationship should make conceptual sense: a Triangle is a kind of Shape. Public inheritance allows a derived object to use the base class interface while adding its own methods.',
'The example defines Shape with a sides() method and Triangle that publicly inherits from Shape. Triangle adds corners(). A Triangle object t can call t.sides() because it inherited that member, and t.corners() because its own class defines it. These are two distinct method calls.',
'Inheritance is useful when related objects share a common interface, though composition is often preferable when the relationship is not truly “is a.”',
'Add another method to Shape and predict whether the Triangle instance can call it.'
],
'cpp-polymorphism':[
'Runtime polymorphism allows a base-class interface to call behavior that depends on the actual derived object. A virtual member function tells C++ to choose the overriding function based on the object’s dynamic type instead of always using the base implementation.',
'The example has a base Animal with a virtual sound() method. A derived animal defines its own version. When the program accesses the object through a base-class pointer or reference, the virtual call still finds the derived behavior. The virtual destructor also makes deleting through a base pointer safe when appropriate.',
'This pattern is valuable in games, GUI systems, and other designs where many different object types share the same operations.',
'Imagine adding a Cat with its own sound(). Which implementation should a base-class reference call when it refers to a Cat object?'
],
'cpp-templates':[
'A template is a recipe the compiler can use to create functions or classes for multiple types. Instead of writing nearly identical versions for int, double, and other compatible types, you express the shared logic with a type parameter. The compiler produces an appropriate version when the template is used.',
'The larger template accepts two values of the same inferred type and compares them. Calling larger(4,9) uses integers and returns 9. Calling it with decimal values creates a suitable floating-point version. The comparison logic stays the same, but the types are chosen at compile time.',
'Templates power much of the standard library, including vector, array, algorithms, and many reusable components.',
'Try larger(3,7) and larger(2.5,1.5). Why does a template avoid two separate function definitions?'
],
'cpp-algorithms':[
'The C++ standard library includes algorithms that operate on ranges instead of requiring you to write every loop yourself. A range is often represented by a begin iterator and an end iterator. Many algorithms work with vectors, arrays, and other containers because they share iterator conventions.',
'The example includes <algorithm> and <vector>. The vector provides the input values; the algorithm operates on a range of those values. The exact algorithm call determines whether the collection is sorted, searched, transformed, or counted. Check the expression after the algorithm name to see which range it processes.',
'Library algorithms make programs shorter and reduce the chance of mistakes in commonly used operations.',
'Find the algorithm call in the example. Identify its input range and predict how the vector changes or which result it returns.'
],
'cpp-maps':[
'A map associates each key with a value. Imagine a dictionary: a student name is the key and the score is the value. std::map keeps keys ordered and does not allow duplicate keys. You retrieve values by key rather than remembering a numeric position in an array.',
'The example starts with two entries, one for Ada and one for Lin. Accessing scores["Ada"] finds Ada’s associated integer. Inserting or updating an entry uses the same key/value relationship. A map is different from a vector: you ask for a named key, not “element 0.”',
'Maps are useful for word counts, user settings, keyed records, and lookup tables.',
'Add a score for a third student. Predict what happens if you assign another value to the existing key "Ada".'
],
'cpp-sets':[
'A set stores unique values. Adding the same value repeatedly does not create duplicates. std::set also keeps its elements in sorted order, so iterating over it is different from iterating over a vector that preserves insertion order.',
'The example constructs a set from 3, 1, 3, and 2. The repeated 3 appears only once. Because std::set is ordered, a loop prints 1, 2, and 3 rather than the original input sequence. This illustrates both uniqueness and ordering.',
'Sets help track unique tags, prevent duplicate IDs, and determine which values occur in a dataset.',
'Insert 2 again and add 4. Predict how many elements are in the set and their iteration order.'
],
'cpp-lambdas':[
'A lambda is a function you can write directly at the place where it is needed. It is useful when an algorithm expects an operation or condition but that operation does not need a permanent function name. A capture list can give the lambda access to values from its surrounding scope.',
'The example uses an algorithm together with a lambda expression. The lambda’s parameter represents the element being examined, and its body returns or computes a result for that element. If you see a condition such as x > 5, it is deciding whether that particular element passes the test.',
'Lambdas make filtering, sorting with custom rules, and short callback functions easier to express.',
'Find the lambda’s parameter and condition. Change the comparison threshold and predict which elements the algorithm will select.'
],
'cpp-exceptions':[
'An exception reports a problem that normal return values may not describe conveniently. Code can throw an exception when an operation cannot complete, and another part of the program can catch it. This separates the normal path from the error path, but exceptions should not replace ordinary checks everywhere.',
'The divide function checks whether the divisor is zero. If so, it throws std::invalid_argument rather than dividing. If the divisor is valid, it returns the integer quotient. A try/catch block at the call site can handle the exception and show an appropriate message without continuing an invalid calculation.',
'Exceptions are useful when libraries must report failures across several layers of function calls.',
'Call divide with a divisor of zero. Which path runs, and why is a successful numeric answer impossible?'
],
'cpp-files':[
'C++ file streams let programs read from or write to filesystem data. An ofstream represents an output file. Opening a file can fail if the path is wrong or permission is denied, so a real application should check the stream before writing.',
'The example creates an ofstream for scores.txt. If opening fails, the error branch prints a message and exits. Otherwise the stream receives text through <<, just like cout sends text to standard output. The stream closes when its object is destroyed at the end of its scope.',
'File streams support saved reports, configuration files, exported results, and persistent notes.',
'Change the filename and the written message. Where would the resulting file be created when the program runs?'
],
'cpp-smart-pointers':[
'A smart pointer is an object that manages ownership of dynamically allocated resources. Instead of remembering to call delete manually, a unique_ptr releases the owned object when it goes out of scope. This is an example of RAII: resource lifetime is tied to an ordinary C++ object lifetime.',
'The example uses std::make_unique<int>(42), which allocates an integer initialized to 42 and returns a unique_ptr owning it. Dereferencing with *number reads the stored integer. When main ends, the unique_ptr automatically releases its allocation.',
'Smart pointers are useful when working with dynamic objects because they clarify ownership and help prevent leaks.',
'Explain why manually calling delete on the object owned by a unique_ptr would be unsafe.'
],
'cpp-iterators':[
'An iterator is an object that identifies a position in a container. It behaves somewhat like a pointer: you can read the current element and advance to the next one. Iterators give library algorithms a common way to work with many different kinds of containers.',
'The example creates a vector and calls values.begin() to obtain an iterator at the first element. Dereferencing it gives the current value. Advancing the iterator moves it toward the next element. values.end() marks the position just past the last element and should not be dereferenced.',
'Iterators connect container types with standard algorithms for searching, sorting, and transforming data.',
'Predict the first two values seen when advancing an iterator through 10, 20, 30. What does end() represent?'
],
'cpp-namespaces':[
'Namespaces group names to prevent collisions. Two libraries may both define a function called square; placing each inside its own namespace keeps their meanings separate. The :: operator identifies which namespace owns a name. You can use a using declaration or using namespace directive for convenience, but naming things explicitly often makes large programs clearer.',
'The example defines math_tools::square. main calls math_tools::square(6), meaning “use the square function from math_tools.” That function multiplies 6 by itself and returns 36. std::cout uses the same :: idea: cout is in the standard namespace std.',
'Namespaces are essential in projects that combine several libraries or code written by different teams.',
'Try calling square(6) without math_tools::. Why might the compiler need a using declaration or the namespace qualifier?'
],
'cpp-const':[
'const means the code should not change a particular value through that name. It is a promise that the compiler can help enforce. Const-qualified parameters also tell readers that a function is meant to read data rather than modify it. This makes code easier to reason about.',
'The example declares const int base = 12, so base cannot later be assigned a new value. doubleIt accepts const int number and returns number * 2 without changing its input. main prints the result of applying the function to base.',
'Const correctness is useful for preventing accidental modifications and documenting how functions use their arguments.',
'Attempt to assign base = 20 after its declaration. Predict the compiler’s response and explain why the restriction helps.'
],
'cpp-move-semantics':[
'Moving is a way for C++ objects to transfer resources instead of duplicating all their data. A copy creates another independent value; a move may reuse storage already owned by the original object. The moved-from object remains valid but its exact content often should not be assumed.',
'The example includes <utility> for std::move and uses string objects. When the resource of one string is moved into another, the receiving string acquires the value or underlying storage. Afterward, the original string is still a valid object, but its contents are not something your code should depend on unless the type documents them.',
'Move semantics are valuable for containers and resource-managing objects where copying a large amount of data would be expensive.',
'Explain the difference between copying a long string and moving it. Why is it unsafe to assume the moved-from string still contains its original text?'
],
'cpp-file-project':[
'A mini project combines concepts that were previously practiced one by one. Instead of just memorizing syntax, you decide how information should flow through functions, containers, loops, and output. Building a complete task is where individual programming features start to feel useful.',
'The student-grade example stores scores in a vector, calculates their sum by visiting the elements, and divides by the count to obtain an average. It also handles an empty vector so it does not divide by zero. main provides data, calls the calculation function, and prints the result.',
'The same structure can support a small gradebook, spending summary, or sensor dashboard.',
'Add another grade and predict the new average. Then test the empty-vector case and explain why that guard is essential.'
]
});


Object.assign(GEAR_LESSON_GUIDES,{
'py-gearex-1':[
'Python is a programming language designed to make many common tasks readable. You write instructions in a .py file and an interpreter executes them. You do not need a main function for a simple script. Python uses new lines and indentation to organize instructions, so spacing is part of how code is structured.',
'The example has one statement: print("Hello, GearEx!") displays the text inside its parentheses. The quotes tell Python the content is text rather than a variable name; print sends it to standard output. You can use either single or double quotes for a simple string.',
'Printing is the first step toward showing calculated answers, verifying program state, and communicating with users.',
'Replace the message with your own sentence. What happens if you remove one quote or mistype print?'
],
'py-gearex-2':[
'A Python variable is a name that refers to a value. You do not have to declare int or string in the assignment: Python determines the current type of the value. The = sign means assignment, not “is mathematically equal.” Values can have different types, such as integers and text.',
'The example assigns the text Ada to name and the number 95 to score. In print(f"{name}: {score}"), the f prefix lets the string contain expressions inside braces. Python replaces {name} and {score} with their current values, producing Ada: 95.',
'Variables let programs remember measurements, names, scores, and intermediate results in a form you can reuse.',
'Change score to 100 and add a second numeric variable. Predict the message if you include both values inside an f-string.'
],
'py-gearex-3':[
'An if statement chooses whether a section of code should run. Its condition produces a Boolean answer: True or False. A colon ends the header, and indentation tells Python which instructions belong to the branch. The optional else branch handles the opposite case.',
'The example stores 76 in score, then checks score >= 50. Since 76 is at least 50, the first indented print runs and displays Pass. The else block is skipped. If score were 49, the first branch would not run, and Retry would be printed instead.',
'Conditionals are useful for grades, access checks, minimum ages, and any feature that responds to different circumstances.',
'Test scores of 49, 50, and 51. Which of the three should pass, and why?'
],
'py-gearex-4':[
'A for loop visits values from a sequence one at a time. range is useful when you want counting numbers rather than a list you wrote by hand. In Python, the ending number in range(start, stop) is excluded, so range(1,4) produces 1, 2, and 3.',
'Each iteration assigns the next range value to i, then runs the indented body. In the example, print(i) executes three times. The first pass shows 1, the second 2, and the third 3. After that range has no more values and execution continues after the loop.',
'Counting loops are useful for repetitive calculations, processing records, and generating simple patterns.',
'Change range(1,4) to range(2,8,2). Predict the values before you run the example.'
],
'py-gearex-5':[
'A function groups steps into one reusable operation. The def keyword introduces its name and parameters. Parameters receive the values supplied by the caller, and return sends a result back to the expression that called the function. Defining a function does not automatically execute it.',
'def add(a,b) describes how to add two inputs. When print(add(3,5)) is reached, Python calls add with a=3 and b=5. The return statement produces 8, which is passed into print. The same function can be reused with different numbers without rewriting its body.',
'Functions help separate a large problem into smaller steps that are easier to test and understand.',
'Call add(10,7). Then create a second call and predict both outputs without running them first.'
],
'py-gearex-6':[
'A Python list stores several values in an ordered, changeable collection. Each element has an index, beginning at 0. A list can grow with append, so you do not need to know its final length beforehand. Many useful operations work directly on the list object.',
'The example starts numbers as [3,5,8]. numbers.append(13) adds a fourth item at the end. print(numbers[1]) asks for the element at index 1, which is 5, not 3. Appending does not move the earlier values to new indices.',
'Lists are useful for scores, shopping items, search results, and data that a program needs to process together.',
'Predict numbers[3] after append. What happens if you request an index larger than the last available position?'
],
'py-gearex-7':[
'A dictionary connects keys to values. Instead of finding a learner by numeric position, you can ask for a field by its key, such as name or score. Dictionaries are especially useful for representing labeled information, and different fields may hold different kinds of values.',
'The example creates learner with two key/value pairs: name maps to Ada, and score maps to 95. learner["name"] looks up the value associated with the name key and returns Ada. Notice that the square brackets use a string key, not a numbered list index.',
'Dictionaries are useful for settings, API responses, small records, and collections of values with meaningful labels.',
'Add a city key and print it. Predict what happens if you try to read a key that does not exist.'
],
'py-gearex-8':[
'A class is a blueprint for objects that share a kind of data and behavior. Each object has its own attributes, while methods describe actions an object can perform. The special __init__ method runs when the object is created, and self refers to that particular instance.',
'Learner.__init__ stores the supplied name in self.name. The greet method builds a message using the name stored in the object. When Learner("Ada").greet() runs, a new learner is created with name Ada, then its greet method returns Hi, Ada. The object keeps its data between those method calls.',
'Classes make it easier to model people, products, game objects, or other related data with associated actions.',
'Create two Learner objects with different names. Why should their greetings be different?'
],
'js-gearex-1':[
'JavaScript is used to add logic and interactivity to websites, and it can also run outside browsers in environments such as Node.js. A program consists of expressions and statements, and the runtime executes them in order. A first console message is a simple way to see that your code works.',
'console.log("Hello, GearEx!") sends text to the JavaScript console. The text is a string because it is enclosed in quotes. The period in console.log selects a function called log from the console object. In GearEx, that output appears in the Compiler output area.',
'Console output is useful for inspecting values while developing a website or script.',
'Change the greeting, then try logging a number without quotes. How does the displayed result compare with a string?'
],
'js-gearex-2':[
'Variables give names to values. In modern JavaScript, const prevents you from assigning a different value to the same variable name, while let allows reassignment. That does not mean a const object can never be modified; it means the variable binding itself cannot be replaced.',
'The example uses const name = "Ada" for text that should not be reassigned. let score = 90 creates a score that may change. score += 5 means score = score + 5, so it becomes 95. console.log then displays the name and the new number.',
'Choosing const by default and let when reassignment is needed helps prevent accidental changes.',
'Try changing score += 5 to score += 10. What would happen if you wrote name = "Sam" after a const declaration?'
],
'js-gearex-3':[
'Conditionals choose which instructions execute based on a true/false question. JavaScript uses parentheses around the condition and often braces around each branch. In a simple if/else statement, exactly one branch runs when the program reaches it.',
'The example sets score to 76 and asks whether it is at least 50. That is true, so the first console.log prints Pass. The else branch is skipped. If score were lower than 50, the else message would run instead. The >= operator includes equality with 50.',
'Conditional logic is useful for form checks, access rules, and showing different page states.',
'Try scores 49 and 50. Predict the console message for each and explain the difference between = and ===.'
],
'js-gearex-4':[
'A for loop repeats code using a counter. The loop header has three parts: the starting value, the condition tested before each iteration, and the update performed afterward. This keeps the repeated work in one block instead of duplicating statements.',
'for (let i = 1; i <= 3; i++) begins with 1, prints it, increments to 2, and repeats. It prints 1, 2, and 3, then stops because 4 is not <= 3. The let declaration makes i a variable that is allowed to change.',
'Loops are a common way to walk through array elements, repeat animation steps, and process batches of data.',
'Change the stopping condition to i < 3. How many console.log calls should execute now?'
],
'js-gearex-5':[
'A function gives a name to a set of operations that can be called more than once. Parameters are names for the values supplied at a call, and return gives a result back. A function can compute a value without printing anything itself.',
'The example defines add(a,b), which returns a+b. It then calls add(3,5) inside console.log. The function evaluates 3+5 to 8 and returns it; console.log displays 8. You can change the input arguments without editing the function definition.',
'Functions make UI handlers, data transformations, and calculations reusable instead of scattered through code.',
'Call add(7,4). Then try calling it twice with different arguments and predict each result.'
],
'js-gearex-6':[
'An array is an ordered collection whose elements have numbered positions starting at zero. JavaScript arrays can grow and shrink while the program runs. push adds an element to the end and returns the new length of the array.',
'numbers begins as [3,5,8]. numbers.push(13) extends it to [3,5,8,13]. Then numbers[1] accesses the second element, 5. Pushing onto the end does not change the index of the existing elements.',
'Arrays are useful for lists of tasks, players, messages, search suggestions, and many other ordered datasets.',
'Predict the value of numbers.length and numbers[3] after the push. What is numbers[0]?'
],
'js-gearex-7':[
'Objects group related values under named properties. An object literal uses braces to list property names and their values. Properties are accessed with dot notation when their names are known, or with square brackets when the key comes from a variable.',
'The example creates learner with name Ada and score 95. learner.name reads the name property and produces Ada. learner.score would read the numeric score. This differs from an array, where you normally reach items using positions like array[0].',
'Objects are useful for representing user profiles, configuration, products, and structured data from APIs.',
'Add a course property to the learner and print it. How would you access the score if its name came from a variable?'
],
'js-gearex-8':[
'Some operations take time, such as fetching data from a network. A Promise represents a result that may become available later. An async function returns a Promise, and await lets that function continue only after the awaited result is ready. This keeps asynchronous code readable.',
'main is declared async. Promise.resolve(42) creates an already-successful Promise containing 42. await extracts that eventual result into value, then console.log prints 42. The call to main starts this asynchronous function, and its return value is itself a Promise.',
'Promises and async/await are essential for network requests, saving data, loading files, and coordinating asynchronous tasks.',
'Replace 42 with a different number. What changes if you omit await and log the Promise object instead?'
]
});
