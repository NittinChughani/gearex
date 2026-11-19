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


Object.assign(GEAR_LESSON_GUIDES,{
'java-gearex-1':[
'Java programs group methods and data into classes. A Java program is compiled into bytecode and can run on a compatible Java Virtual Machine. To start a basic command-line application, Java looks for a main method with a specific signature. The class gives the method an owner, while the statements inside main describe what to do.',
'The example defines a class named prog, then public static void main(String[] args). The System.out.println call displays Hello, GearEx! with a newline. The braces mark which statements belong to the class and which belong to the method; semicolons end ordinary statements.',
'This structure appears in introductory Java programs and in the entry points of many command-line applications.',
'Change the greeting, then find the class, main method, print statement, and closing braces in the source.'
],
'java-gearex-2':[
'Java is statically typed: a variable is declared with a type that determines what kind of value can be stored there. An int stores whole-number values, including negative numbers and zero; it does not directly store fractions. A String represents text such as a name. Using the correct type helps Java detect mistakes before execution.',
'The example creates int score = 95 and String name = "Ada". The + operator joins text when one operand is a string, so name + ": " + score becomes Ada: 95. Java converts the numeric score to text as part of that concatenation, but the score variable itself remains an integer.',
'Typed variables help structure records, calculations, and parameters in large applications.',
'Change score to 87 and print score+5 separately. Why does adding two integers differ from joining a String with an integer?'
],
'java-gearex-3':[
'An if statement controls which piece of code runs. Its condition must evaluate to a boolean, true or false. else supplies a path when the condition is false. Braces allow you to group more than one statement into a branch; omitting braces permits only a single following statement.',
'The sample assigns 76 to score, then tests score >= 50. Since the condition is true, Java prints Pass and skips the else branch. If score were 49 it would print Retry. Notice that >= includes equality, while == compares values for equality.',
'Conditionals are used for validating user input, checking grades, and choosing which screen or message to display.',
'Try scores 49, 50, and 76. Which one enters the else branch?'
],
'java-gearex-4':[
'A for loop repeats a block while its condition remains true. Its three sections specify the starting counter, a test, and an update after each iteration. This pattern is ideal when you want to count from one number to another.',
'for (int i = 1; i <= 3; i++) first creates i with value 1. Java prints i, adds one, and checks again. It prints 1, 2, and 3, then stops when i becomes 4 because the condition fails.',
'For loops are useful for arrays, repetitive tasks, and scheduled calculations.',
'Change the upper limit from 3 to 5. Why does the program still stop even though you never write a break statement?'
],
'java-gearex-5':[
'A method is a named operation inside a Java class. Parameters receive arguments from callers, and a return statement supplies a result to the caller. The static keyword allows a method to be called through its class without first creating an object of that class.',
'The example defines static int add(int a,int b). It promises to return an integer and calculates a+b. main calls add(3,5), receives 8, then System.out.println displays that result. The add method does not print by itself; it returns a value that another statement uses.',
'Methods are how Java applications organize calculations, validations, and reusable business rules.',
'Call add(9,4). What is the difference between returning a value and printing it?'
],
'java-gearex-6':[
'An array stores a fixed number of elements of the same type. Each element has a numeric index starting at 0, so a three-item array has indices 0, 1, and 2. The array length does not change after creation, unlike many dynamic collection classes.',
'int[] a = {3,5,8} creates an array holding three integers. System.out.println(a[1]) reads the second value, 5. The brackets in int[] tell Java the variable refers to an array, while brackets after a name select a particular element.',
'Arrays are useful when several related measurements or scores must be processed together.',
'Predict a[0], a[2], and a.length. Why is a[3] not a valid element?'
],
'java-gearex-7':[
'A class defines the data and behavior its objects can have. A constructor is invoked when an object is created and commonly initializes its fields. The new keyword creates an instance. Every separate instance can hold its own data even though the objects follow the same class blueprint.',
'Learner declares a String field called name. Its constructor receives a value and stores it in that field. The statement new Learner("Ada") creates a learner whose name is Ada, and the following .name reads the stored field. The example prints Ada.',
'Objects make it practical to represent students, products, contacts, or other records with related behavior.',
'Create another Learner with a different name. Explain why its name field need not match the first object.'
],
'java-gearex-8':[
'Inheritance means that one class can extend another class and reuse its accessible members. The parent describes shared behavior, while the child may add new behavior or override an existing method. Overriding means supplying a replacement implementation with a compatible method signature.',
'Dog extends Animal, so Dog has the shared interface of Animal. The Dog version of speak returns woof rather than the parent implementation sound. @Override asks the compiler to verify that the method really replaces a parent method. Calling new Dog().speak() therefore prints woof.',
'Inheritance is useful when related objects share an interface, though not every shared feature requires inheritance.',
'Remove the Dog override. Which version of speak should the new Dog object use then?'
],
'cs-gearex-1':[
'C# is a modern language commonly used with .NET. Code can be organized inside classes and methods. A console application prints text to a terminal, which makes it a good starting point for learning statements and program structure.',
'using System; makes the System namespace convenient to use. The Program class contains a static Main method where this example starts. Console.WriteLine prints Hello, GearEx! and moves to the next line. Semicolons terminate ordinary statements; braces define the class and method bodies.',
'C# console programs are useful for small tools, scripts, learning exercises, and the logic behind larger applications.',
'Change the message and identify which line imports a namespace versus which line actually writes output.'
],
'cs-gearex-2':[
'C# is statically typed, meaning that a variable has a defined type. string is used for text, while int stores whole numbers. C# also supports type inference through var: the compiler determines the variable type from its initializer, but the type still remains fixed afterward.',
'The sample creates string name = "Ada" and int score = 95. The $ before the quoted text starts an interpolated string, so {name} and {score} are replaced with their values. Console.WriteLine produces Ada: 95 without changing either variable.',
'These typed values are the building blocks of forms, records, services, and application state.',
'Change score to 100 and predict the printed message. Why would assigning a text value to score be a type error?'
],
'cs-gearex-3':[
'An if statement asks a true/false question and chooses which statement to execute. The condition appears in parentheses, and braces can group multiple statements into a branch. An else branch runs only if the if condition fails.',
'The example stores score = 76 and tests score >= 50. The test is true, so Console.WriteLine("Pass") runs and the Retry branch is skipped. If the score were 49, the condition would be false and Retry would be printed. The >= operator includes equality.',
'Conditionals are useful for validation, grading, and adapting a program to different situations.',
'Test values 49, 50, and 51. For each, explain why exactly one message should print.'
],
'cs-gearex-4':[
'A for loop performs repeated work using a counter. The initializer runs once, the condition runs before each iteration, and the update runs after the body. A loop can therefore count a known number of repetitions without copying the body multiple times.',
'The header for (int i = 1; i <= 3; i++) starts i at 1. Console.WriteLine prints 1, then i increments to 2. The program prints 2 and 3 and stops when i becomes 4. The braces and indentation make the repeated statement easy to see.',
'Loops are important for arrays, reporting, and processing a group of similar items.',
'Change the test to i < 3. How many values will now be printed?'
],
'cs-gearex-5':[
'A method encapsulates a calculation or action behind a name. Parameters receive inputs, and return transfers a computed value back to the calling expression. Static methods can be called without creating an instance of the containing class.',
'The example defines static int Add(int a,int b), which returns the sum of its two integer parameters. Main calls Add(3,5) and receives 8. Console.WriteLine prints that returned result. The method itself performs the calculation but is not responsible for the output.',
'Methods make programs easier to test because each operation can have a small, clear purpose.',
'Try Add(10,4). Why does Console.WriteLine not need to know how Add calculates its result?'
],
'cs-gearex-6':[
'An array stores a fixed sequence of values with one declared element type. Each item has an index starting at zero. A three-item array can be pictured as three labeled boxes: index 0, index 1, and index 2.',
'int[] numbers = {3,5,8} creates the array. Console.WriteLine(numbers[1]) reads the item at position 1, which is 5. The int[] type means the variable holds an array of integers rather than one integer.',
'Arrays are useful for storing measurements, game scores, and other ordered collections whose size is known.',
'Predict numbers[0], numbers[2], and numbers.Length. Why would numbers[3] be outside the array?'
],
'cs-gearex-7':[
'A class describes objects, and a property provides a controlled way to read or change part of an object’s state. A property using get and set behaves like a field from the caller’s perspective but can later add validation or computed behavior.',
'The example defines a Learner class with a public Name property, initialized to Ada. new Learner() creates an instance. The expression .Name reads that property, so Console.WriteLine displays Ada. The braces on get; set; define accessors rather than an ordinary method body.',
'Properties are common in application models, data binding, configuration, and API response objects.',
'Create a learner, assign a different Name, then read it. How does using a property differ from defining a method GetName()?'
],
'cs-gearex-8':[
'LINQ stands for Language Integrated Query. It provides operators that ask questions of collections, such as “keep elements matching this condition” or “transform each element.” The Where operation filters a collection based on a predicate: a function that returns true or false.',
'The example stores 2, 5, and 8 in an array. scores.Where(x => x > 3) visits each value and retains only 5 and 8 because they satisfy the condition. string.Join(",", ...) combines those numbers into the text 5,8 for display.',
'LINQ is useful for searching, filtering, summarizing, and reshaping collection data without writing repetitive loops.',
'Change the predicate to x >= 5. Which elements remain? What changes if you use x > 5 instead?'
],
'sql-gearex-1':[
'SQL is a language for asking questions about data stored in tables. A table has columns, which describe fields, and rows, which are individual records. SELECT chooses which columns to return, while FROM identifies where to find those records.',
'The example creates temporary learner data with names and scores using WITH and VALUES. The SELECT name FROM learners part asks for the name column from each row. The result is a table containing Ada and Sam, rather than the original score values.',
'SELECT queries are the foundation of reporting, dashboards, and finding relevant records in databases.',
'Change SELECT name to SELECT name, score. Predict how many columns appear in the result.'
],
'sql-gearex-2':[
'WHERE filters which rows of a table belong in the result. It uses a condition, often comparing a column to a value. Rows satisfying the condition are included; rows that do not satisfy it are excluded.',
'The sample has two learners: Ada with score 95 and Sam with score 72. WHERE score >= 80 keeps Ada’s row and removes Sam’s row before the displayed name column is returned. This does not change the original data; it only changes the query result.',
'Filtering is useful for search, selecting passing students, date ranges, and many database reports.',
'Change the threshold from 80 to 70. Which names should be returned?'
],
'sql-gearex-3':[
'ORDER BY arranges returned rows by one or more columns. ASC means ascending order, usually smallest to largest or alphabetically A to Z; DESC means descending order. Sorting changes the order of the result, not the underlying stored rows.',
'The sample data has Ada with score 95 and Sam with score 72. ORDER BY score DESC places the higher score first, so Ada appears before Sam. The SELECT still chooses name as the output column even though the ordering uses score.',
'Sorting is useful for leaderboards, newest-first feeds, ranked reports, and alphabetical lists.',
'Change DESC to ASC. Which learner appears first, and why?'
],
'sql-gearex-4':[
'An aggregate function summarizes several rows into a single result. SUM adds numbers, AVG calculates a mean, COUNT counts rows or values, and MIN or MAX finds an extreme value. These functions are designed for reporting rather than listing every record.',
'The example builds a temporary scores table containing 10, 20, and 30. SELECT SUM(score) asks the database to add those three values, so the answer is 60. The query returns one aggregate result rather than three separate rows.',
'Aggregates are used for financial totals, class averages, attendance, and performance dashboards.',
'Replace SUM with AVG. Calculate the expected answer before running the query.'
],
'sql-gearex-5':[
'GROUP BY collects rows with matching key values into groups. You can then use an aggregate such as COUNT to summarize each group independently. Without grouping, COUNT(*) summarizes all rows together.',
'The sample data contains two rows with language C and one with Python. GROUP BY lang forms one C group and one Python group. COUNT(*) counts the rows in each group, yielding C: 2 and Python: 1.',
'Grouping is useful for counting users per country, orders per month, or students per course.',
'Add another Python row. Predict how the two group counts change.'
],
'sql-gearex-6':[
'A JOIN combines rows from two tables using a relationship between them. Tables often store related information separately to avoid repetition. A JOIN condition describes how to match them, usually by an ID stored in both tables.',
'The example has a students table with IDs and names and a marks table with matching IDs and scores. JOIN marks ON students.id = marks.id pairs each student with the score belonging to the same ID. SELECT then displays the combined name and score columns.',
'Joins are essential when a database stores customers and orders, students and grades, or products and categories separately.',
'Imagine a marks row whose student ID does not appear in students. Would an ordinary inner JOIN include it?'
],
'sql-gearex-7':[
'CREATE TABLE defines the structure of a new database table, including its columns and their types. INSERT INTO adds rows to that table. SQL can therefore both define where information belongs and populate the structure with records.',
'The example creates learners with an INTEGER id column and TEXT name column. INSERT INTO adds one row containing ID 1 and name Ada. SELECT name FROM learners then retrieves Ada from the stored row.',
'Creating and inserting data are basic tasks in applications that store accounts, inventory, or form submissions.',
'Add a second row with a different ID and name. Predict what the final SELECT returns.'
],
'sql-gearex-8':[
'UPDATE changes values in existing rows. DELETE removes rows. A WHERE condition is especially important because it selects which records are affected. Forgetting WHERE in an UPDATE or DELETE can change or remove every row of a table.',
'The example creates a learners table, inserts a row with score 50, then runs UPDATE learners SET score = 95 WHERE id = 1. Only the row with ID 1 is changed. The final SELECT returns the updated score, 95.',
'Updates and deletes are used when correcting records, changing application state, or cleaning stored data.',
'Predict what would happen if the UPDATE statement had no WHERE clause and the table contained many learners.'
]
});

/* Complete teaching guides for the expanded non-C/C++ curriculum. */
Object.assign(GEAR_LESSON_GUIDES,{
  "py-gearex-9": [
    "File reading with with is an important skill because use a context manager to close files reliably.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. The context manager closes the file even if an error occurs.",
    "Walk through the example one statement at a time. The syntax pattern is with open(...) as f:. Read the code from top to bottom. The context manager closes the file even if an error occurs. The sample's expected result is GearEx. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, file reading with with helps keep logic organized and easier to maintain. The context manager closes the file even if an error occurs. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Change the written message and read it back. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-10": [
    "Handling exceptions is an important skill because catch expected errors without hiding unrelated bugs.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Catch specific exceptions instead of a broad bare except.",
    "Walk through the example one statement at a time. The syntax pattern is try / except ValueError. Read the code from top to bottom. Catch specific exceptions instead of a broad bare except. The sample's expected result is Invalid number. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, handling exceptions helps keep logic organized and easier to maintain. Catch specific exceptions instead of a broad bare except. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Handle a missing dictionary key separately. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-11": [
    "Tuples and sets is an important skill because use immutable sequences and unique collections.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A tuple keeps its items fixed; a set removes duplicates.",
    "Walk through the example one statement at a time. The syntax pattern is tuple = (a,b); set = {a,b}. Read the code from top to bottom. A tuple keeps its items fixed; a set removes duplicates. The sample's expected result is 3 2. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, tuples and sets helps keep logic organized and easier to maintain. A tuple keeps its items fixed; a set removes duplicates. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Try unpacking the tuple into two variables. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-12": [
    "List comprehensions is an important skill because build a new list from an iterable with a concise expression.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Comprehensions produce a list; a generator expression is lazy.",
    "Walk through the example one statement at a time. The syntax pattern is [expression for item in iterable]. Read the code from top to bottom. Comprehensions produce a list; a generator expression is lazy. The sample's expected result is [1, 4, 9, 16]. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, list comprehensions helps keep logic organized and easier to maintain. Comprehensions produce a list; a generator expression is lazy. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Filter the squares to only even results. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-13": [
    "Classes and methods is an important skill because model objects with instance attributes and behavior.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. self refers to the instance receiving the method call.",
    "Walk through the example one statement at a time. The syntax pattern is class Name: def method(self):. Read the code from top to bottom. self refers to the instance receiving the method call. The sample's expected result is 1. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, classes and methods helps keep logic organized and easier to maintain. self refers to the instance receiving the method call. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a reset method to Counter. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-14": [
    "Modules and imports is an important skill because reuse standard-library functionality across files.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A module groups reusable names and code.",
    "Walk through the example one statement at a time. The syntax pattern is import module; module.function(). Read the code from top to bottom. A module groups reusable names and code. The sample's expected result is 9. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, modules and imports helps keep logic organized and easier to maintain. A module groups reusable names and code. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Try math.factorial on a small positive integer. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-15": [
    "JSON serialization is an important skill because exchange structured data using JSON text.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. JSON strings are text, not Python dictionary objects.",
    "Walk through the example one statement at a time. The syntax pattern is json.dumps(value); json.loads(text). Read the code from top to bottom. JSON strings are text, not Python dictionary objects. The sample's expected result is Python. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, json serialization helps keep logic organized and easier to maintain. JSON strings are text, not Python dictionary objects. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Serialize a list of two learner names. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "py-gearex-16": [
    "Sorting with key functions is an important skill because control sorting with custom keys and stable ordering.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. sorted returns a new list without modifying the original.",
    "Walk through the example one statement at a time. The syntax pattern is sorted(items, key=callable). Read the code from top to bottom. sorted returns a new list without modifying the original. The sample's expected result is ['al', 'Bea', 'Zoe']. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, sorting with key functions helps keep logic organized and easier to maintain. sorted returns a new list without modifying the original. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Sort words by length using key=len. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-9": [
    "Array map and filter is an important skill because transform and select items without manually managing indexes.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. map creates a new array; filter keeps matching elements.",
    "Walk through the example one statement at a time. The syntax pattern is array.filter(fn).map(fn). Read the code from top to bottom. map creates a new array; filter keeps matching elements. The sample's expected result is 20,40. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, array map and filter helps keep logic organized and easier to maintain. map creates a new array; filter keeps matching elements. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Map all numbers to their squares. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-10": [
    "Objects and destructuring is an important skill because read named fields from objects using destructuring.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Destructuring extracts properties; it does not rename the object.",
    "Walk through the example one statement at a time. The syntax pattern is const {field} = object. Read the code from top to bottom. Destructuring extracts properties; it does not rename the object. The sample's expected result is Ada 92. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, objects and destructuring helps keep logic organized and easier to maintain. Destructuring extracts properties; it does not rename the object. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a role field and destructure it. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-11": [
    "Template literals is an important skill because embed expressions directly into readable strings.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Template literals use backticks rather than quotes.",
    "Walk through the example one statement at a time. The syntax pattern is `text ${expression}`. Read the code from top to bottom. Template literals use backticks rather than quotes. The sample's expected result is Learn JavaScript!. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, template literals helps keep logic organized and easier to maintain. Template literals use backticks rather than quotes. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a numeric score expression to the template. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-12": [
    "Sets and Maps is an important skill because store unique values and key-value pairs.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A Map supports keys beyond plain object property strings.",
    "Walk through the example one statement at a time. The syntax pattern is new Set(items); new Map(entries). Read the code from top to bottom. A Map supports keys beyond plain object property strings. The sample's expected result is 2 3. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, sets and maps helps keep logic organized and easier to maintain. A Map supports keys beyond plain object property strings. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Increment the visits value in the map. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-13": [
    "Promises is an important skill because represent the eventual outcome of asynchronous work.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A Promise can be pending, fulfilled or rejected.",
    "Walk through the example one statement at a time. The syntax pattern is promise.then(callback). Read the code from top to bottom. A Promise can be pending, fulfilled or rejected. The sample's expected result is 14. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, promises helps keep logic organized and easier to maintain. A Promise can be pending, fulfilled or rejected. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Chain another then to transform the value. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-14": [
    "Async and await is an important skill because write asynchronous workflows with readable sequential syntax.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. await pauses the async function, not the whole JavaScript runtime.",
    "Walk through the example one statement at a time. The syntax pattern is async function f(){await promise;}. Read the code from top to bottom. await pauses the async function, not the whole JavaScript runtime. The sample's expected result is 42. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, async and await helps keep logic organized and easier to maintain. await pauses the async function, not the whole JavaScript runtime. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add try/catch around a rejected promise. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-15": [
    "Classes and constructors is an important skill because create reusable objects with class syntax.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Class methods are shared through the prototype.",
    "Walk through the example one statement at a time. The syntax pattern is class Name { constructor(){} }. Read the code from top to bottom. Class methods are shared through the prototype. The sample's expected result is Hi Ada. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, classes and constructors helps keep logic organized and easier to maintain. Class methods are shared through the prototype. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a score property to the constructor. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "js-gearex-16": [
    "Error handling is an important skill because use try/catch to handle failures at a clear boundary.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Do not swallow unexpected errors silently.",
    "Walk through the example one statement at a time. The syntax pattern is try { ... } catch (error) { ... }. Read the code from top to bottom. Do not swallow unexpected errors silently. The sample's expected result is Invalid JSON. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, error handling helps keep logic organized and easier to maintain. Do not swallow unexpected errors silently. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Log error.message for debugging. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-9": [
    "String operations is an important skill because work with immutable String values and their methods.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Strings are immutable: methods return new values.",
    "Walk through the example one statement at a time. The syntax pattern is text.length(); text.toUpperCase(). Read the code from top to bottom. Strings are immutable: methods return new values. The sample's expected result is GEAREX. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, string operations helps keep logic organized and easier to maintain. Strings are immutable: methods return new values. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Print the string length. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-10": [
    "Arrays and iteration is an important skill because process fixed-size arrays using an enhanced for loop.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Array length is a field, not a method.",
    "Walk through the example one statement at a time. The syntax pattern is for (int item : array). Read the code from top to bottom. Array length is a field, not a method. The sample's expected result is 12. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, arrays and iteration helps keep logic organized and easier to maintain. Array length is a field, not a method. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Find the largest array element. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-11": [
    "ArrayList collections is an important skill because grow a list dynamically and access elements by index.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. ArrayList is resizable; arrays have fixed length.",
    "Walk through the example one statement at a time. The syntax pattern is list.add(item); list.get(index). Read the code from top to bottom. ArrayList is resizable; arrays have fixed length. The sample's expected result is Java. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, arraylist collections helps keep logic organized and easier to maintain. ArrayList is resizable; arrays have fixed length. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add two elements and print size(). First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-12": [
    "Constructors is an important skill because initialize object state when a new instance is created.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A constructor has the same name as its class and no return type.",
    "Walk through the example one statement at a time. The syntax pattern is new ClassName(argument). Read the code from top to bottom. A constructor has the same name as its class and no return type. The sample's expected result is Code. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, constructors helps keep logic organized and easier to maintain. A constructor has the same name as its class and no return type. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a second field initialized by the constructor. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-13": [
    "Inheritance and overrides is an important skill because extend a class and specialize its behavior.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Overridden methods are selected by the runtime object type.",
    "Walk through the example one statement at a time. The syntax pattern is class Child extends Parent. Read the code from top to bottom. Overridden methods are selected by the runtime object type. The sample's expected result is meow. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, inheritance and overrides helps keep logic organized and easier to maintain. Overridden methods are selected by the runtime object type. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a Dog subclass with a different sound. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-14": [
    "Interfaces is an important skill because define a contract implemented by different classes.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Interface references can hold any compatible implementation.",
    "Walk through the example one statement at a time. The syntax pattern is class Name implements Interface. Read the code from top to bottom. Interface references can hold any compatible implementation. The sample's expected result is Ready. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, interfaces helps keep logic organized and easier to maintain. Interface references can hold any compatible implementation. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Implement a second class using the same interface. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-15": [
    "Exceptions is an important skill because handle an expected runtime exception precisely.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Catch the narrowest exception that your code can handle.",
    "Walk through the example one statement at a time. The syntax pattern is try { } catch (ExceptionType e) { }. Read the code from top to bottom. Catch the narrowest exception that your code can handle. The sample's expected result is Bad number. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, exceptions helps keep logic organized and easier to maintain. Catch the narrowest exception that your code can handle. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Try parsing a valid integer. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "java-gearex-16": [
    "HashMap and generics is an important skill because store and retrieve values by typed keys.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Generics help the compiler check key and value types.",
    "Walk through the example one statement at a time. The syntax pattern is Map<K,V>; map.put(key,value). Read the code from top to bottom. Generics help the compiler check key and value types. The sample's expected result is 5. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, hashmap and generics helps keep logic organized and easier to maintain. Generics help the compiler check key and value types. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add another key and print the map size. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-9": [
    "Arrays and foreach is an important skill because iterate safely through a fixed collection.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Arrays have fixed length; use List<T> for dynamic size.",
    "Walk through the example one statement at a time. The syntax pattern is foreach (var item in items). Read the code from top to bottom. Arrays have fixed length; use List<T> for dynamic size. The sample's expected result is 12. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, arrays and foreach helps keep logic organized and easier to maintain. Arrays have fixed length; use List<T> for dynamic size. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Print each array value on a separate line. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-10": [
    "Lists and generics is an important skill because store typed items in a resizable list.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Generic lists enforce element types at compile time.",
    "Walk through the example one statement at a time. The syntax pattern is List<T>.Add(value). Read the code from top to bottom. Generic lists enforce element types at compile time. The sample's expected result is 3. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, lists and generics helps keep logic organized and easier to maintain. Generic lists enforce element types at compile time. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Remove one item and print the new count. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-11": [
    "Dictionaries is an important skill because look up values by unique keys.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Indexing a missing key throws; TryGetValue avoids that.",
    "Walk through the example one statement at a time. The syntax pattern is Dictionary<TKey,TValue>. Read the code from top to bottom. Indexing a missing key throws; TryGetValue avoids that. The sample's expected result is 95. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, dictionaries helps keep logic organized and easier to maintain. Indexing a missing key throws; TryGetValue avoids that. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Use TryGetValue to handle a missing key. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-12": [
    "Properties and encapsulation is an important skill because expose controlled access to object state.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Properties provide a public API without exposing fields directly.",
    "Walk through the example one statement at a time. The syntax pattern is public Type Name { get; set; }. Read the code from top to bottom. Properties provide a public API without exposing fields directly. The sample's expected result is Ada. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, properties and encapsulation helps keep logic organized and easier to maintain. Properties provide a public API without exposing fields directly. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add an integer Score property. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-13": [
    "Inheritance and virtual methods is an important skill because override behavior through a base-class reference.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Dynamic dispatch calls the derived override at runtime.",
    "Walk through the example one statement at a time. The syntax pattern is virtual / override. Read the code from top to bottom. Dynamic dispatch calls the derived override at runtime. The sample's expected result is meow. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, inheritance and virtual methods helps keep logic organized and easier to maintain. Dynamic dispatch calls the derived override at runtime. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Create a Dog override. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-14": [
    "Interfaces is an important skill because specify capabilities that multiple types can implement.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Interfaces define a contract, not an object instance.",
    "Walk through the example one statement at a time. The syntax pattern is interface IName { ... }. Read the code from top to bottom. Interfaces define a contract, not an object instance. The sample's expected result is Ready. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, interfaces helps keep logic organized and easier to maintain. Interfaces define a contract, not an object instance. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Create another class implementing ILabel. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-15": [
    "Exception handling is an important skill because recover from expected conversion errors.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Prefer TryParse for normal validation rather than exceptions.",
    "Walk through the example one statement at a time. The syntax pattern is try { } catch (FormatException) { }. Read the code from top to bottom. Prefer TryParse for normal validation rather than exceptions. The sample's expected result is Invalid. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, exception handling helps keep logic organized and easier to maintain. Prefer TryParse for normal validation rather than exceptions. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Try int.TryParse for user input. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "cs-gearex-16": [
    "LINQ queries is an important skill because express filtering and projections over collections.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. LINQ can defer execution until the result is enumerated.",
    "Walk through the example one statement at a time. The syntax pattern is items.Where(predicate).Select(mapper). Read the code from top to bottom. LINQ can defer execution until the result is enumerated. The sample's expected result is 2,4. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, linq queries helps keep logic organized and easier to maintain. LINQ can defer execution until the result is enumerated. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Use Select to double each number. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-9": [
    "INNER JOIN is an important skill because combine rows whose keys match in two tables.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. INNER JOIN excludes rows without a matching partner.",
    "Walk through the example one statement at a time. The syntax pattern is SELECT ... FROM a JOIN b ON a.id=b.id. Read the code from top to bottom. INNER JOIN excludes rows without a matching partner. The sample's expected result is Ada | 42. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, inner join helps keep logic organized and easier to maintain. INNER JOIN excludes rows without a matching partner. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Change the join condition to see which rows match. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-10": [
    "LEFT JOIN is an important skill because keep every left-side row even when no right-side match exists.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Unmatched right-side columns become NULL.",
    "Walk through the example one statement at a time. The syntax pattern is LEFT JOIN ... ON .... Read the code from top to bottom. Unmatched right-side columns become NULL. The sample's expected result is Ada | NULL. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, left join helps keep logic organized and easier to maintain. Unmatched right-side columns become NULL. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Compare the same query with INNER JOIN. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-11": [
    "GROUP BY is an important skill because summarize rows into groups with aggregate functions.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Every selected nonaggregate expression must follow grouping rules.",
    "Walk through the example one statement at a time. The syntax pattern is GROUP BY column. Read the code from top to bottom. Every selected nonaggregate expression must follow grouping rules. The sample's expected result is A | 2; B | 1. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, group by helps keep logic organized and easier to maintain. Every selected nonaggregate expression must follow grouping rules. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Use SUM on a numeric column grouped by category. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-12": [
    "HAVING is an important skill because filter aggregate groups after grouping.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. WHERE filters rows before grouping; HAVING filters groups.",
    "Walk through the example one statement at a time. The syntax pattern is GROUP BY ... HAVING COUNT(*) > 1. Read the code from top to bottom. WHERE filters rows before grouping; HAVING filters groups. The sample's expected result is A | 2. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, having helps keep logic organized and easier to maintain. WHERE filters rows before grouping; HAVING filters groups. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Change the threshold to include all groups. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-13": [
    "Subqueries is an important skill because use a query result inside another query.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A scalar subquery must return at most one row.",
    "Walk through the example one statement at a time. The syntax pattern is WHERE value > (SELECT ...). Read the code from top to bottom. A scalar subquery must return at most one row. The sample's expected result is Ada. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, subqueries helps keep logic organized and easier to maintain. A scalar subquery must return at most one row. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Use a subquery to compute a comparison threshold. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-14": [
    "Primary and foreign keys is an important skill because protect entity identity and table relationships.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Foreign keys refer to an existing parent key when enforcement is enabled.",
    "Walk through the example one statement at a time. The syntax pattern is PRIMARY KEY; REFERENCES table(column). Read the code from top to bottom. Foreign keys refer to an existing parent key when enforcement is enabled. The sample's expected result is tables created. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, primary and foreign keys helps keep logic organized and easier to maintain. Foreign keys refer to an existing parent key when enforcement is enabled. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a NOT NULL constraint to a required column. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-15": [
    "Indexes and query plans is an important skill because speed up selective lookups with an index.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. Indexes can speed reads but add storage and write overhead.",
    "Walk through the example one statement at a time. The syntax pattern is CREATE INDEX name ON table(column). Read the code from top to bottom. Indexes can speed reads but add storage and write overhead. The sample's expected result is idx_catalog_title. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, indexes and query plans helps keep logic organized and easier to maintain. Indexes can speed reads but add storage and write overhead. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Use EXPLAIN QUERY PLAN to inspect an indexed search. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ],
  "sql-gearex-16": [
    "Views and reusable queries is an important skill because save a SELECT statement as a reusable virtual table.. Before trying the code, identify the input values, the operations performed, and the data returned or displayed. A regular view stores a query definition rather than duplicated rows.",
    "Walk through the example one statement at a time. The syntax pattern is CREATE VIEW name AS SELECT .... Read the code from top to bottom. A regular view stores a query definition rather than duplicated rows. The sample's expected result is Python. Confirm the output using the compiler, then repeat the calculation or reasoning manually.",
    "In a larger application, views and reusable queries helps keep logic organized and easier to maintain. A regular view stores a query definition rather than duplicated rows. When using this technique in a real project, test ordinary inputs and edge cases before relying on the result.",
    "Practice task: Add a second column to the view. First predict what will happen, then run your edited code and explain the difference. If an error occurs, inspect the error message and compare your code with the syntax reference."
  ]
});

Object.freeze(GEAR_LESSON_GUIDES);
