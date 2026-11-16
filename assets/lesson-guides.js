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
