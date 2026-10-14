/**
 * CodeQuest - Core Static Data Store
 * Contains verified curriculum for Python & C tracks, quizzes, challenges,
 * achievements, demo leaderboard profiles, and motivational quotes.
 */

const CQ_DATA = {
  // Motivational Quotes for Dashboard
  quotes: [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" }
  ],

  // Level Progression Thresholds
  levels: [
    { level: 1, title: "Novice Coder", minXP: 0, maxXP: 99 },
    { level: 2, title: "Syntax Apprentice", minXP: 100, maxXP: 249 },
    { level: 3, title: "Logic Crafter", minXP: 250, maxXP: 449 },
    { level: 4, title: "Algorithm Explorer", minXP: 450, maxXP: 699 },
    { level: 5, title: "Code Knight", minXP: 700, maxXP: 999 },
    { level: 6, title: "Master Hacker", minXP: 1000, maxXP: 99999 }
  ],

  // Daily Quests Definition
  dailyQuests: [
    {
      id: "quest_lesson",
      title: "Daily Study Sprint",
      description: "Complete at least 1 lesson in either Python or C track.",
      target: 1,
      rewardXP: 10,
      icon: "book"
    },
    {
      id: "quest_quiz",
      title: "Knowledge Duel",
      description: "Finish at least 1 interactive quiz with 60% or higher.",
      target: 1,
      rewardXP: 10,
      icon: "quiz"
    },
    {
      id: "quest_challenge",
      title: "Problem Solver",
      description: "Study and solve 1 programming challenge today.",
      target: 1,
      rewardXP: 10,
      icon: "code"
    }
  ],

  // ==========================================
  // LESSONS: PYTHON (8 Detailed Lessons)
  // ==========================================
  pythonLessons: [
    {
      id: "py-01",
      track: "python",
      order: 1,
      title: "1. Introduction to Python",
      difficulty: "Beginner",
      estimatedTime: "10 mins",
      xpReward: 20,
      objective: "Understand what Python is, why it is popular, and how to execute your first print statement.",
      explanation: `Python is a high-level, interpreted, general-purpose programming language created by Guido van Rossum and first released in 1991. 
      
Python emphasizes readability through its clean syntax and reliance on significant whitespace indentation rather than curly braces or semicolons.

Key characteristics of Python:
• Interpreted: Code is executed line by line, making debugging interactive and straightforward.
• Dynamically Typed: You do not need to declare variable types explicitly before using them.
• Multi-paradigm: Supports procedural, object-oriented, and functional programming patterns.
• Batteries Included: Comes with a vast standard library covering everything from math to networking.

The simplest program in Python is outputting text to the screen using the built-in \`print()\` function.`,
      syntaxExample: `# Syntax:
print(object, ... , sep=' ', end='\\n')`,
      codeExample: `# First Python Program
# Comments start with a hash symbol (#)

message = "Welcome to CodeQuest!"
player_name = "Cadet"

print(message)
print("Hero:", player_name)
print("Ready to start coding?", True)`,
      codeExplanation: `1. The \`#\` symbol designates single-line comments which are ignored by the Python interpreter.
2. \`message\` and \`player_name\` are variables that store string data.
3. The \`print()\` function outputs text to the standard output console. Passing multiple arguments separated by commas automatically inserts a space between them.`,
      knowledgeCheck: [
        {
          question: "How does Python define blocks of code (like loops or functions)?",
          options: ["Using curly braces { }", "Using indentation (whitespace)", "Using BEGIN and END tags", "Using semicolons ;"],
          answerIndex: 1,
          explanation: "Unlike C or Java, Python uses indentation (consistent spaces or tabs) to delimit code blocks."
        },
        {
          question: "Which built-in function is used to print output to the console?",
          options: ["echo()", "printf()", "print()", "System.out.println()"],
          answerIndex: 2,
          explanation: "The print() function is the standard Python built-in for displaying output."
        }
      ]
    },
    {
      id: "py-02",
      track: "python",
      order: 2,
      title: "2. Variables and Data Types",
      difficulty: "Beginner",
      estimatedTime: "12 mins",
      xpReward: 20,
      objective: "Learn Python's core primitive data types: integers, floats, strings, and booleans, plus type conversion.",
      explanation: `In Python, variables are created when you assign a value to them using the assignment operator (\`=\`). You do not need to specify a type keyword like \`int\` or \`float\`.

Python has four primary scalar data types:
1. int: Whole numbers, positive or negative (e.g., 42, -7).
2. float: Numbers with decimal points (e.g., 3.14159, -0.5).
3. str: Sequence of unicode characters surrounded by single or double quotes (e.g., "Python", 'CodeQuest').
4. bool: Logical values, either \`True\` or \`False\` (case-sensitive).

You can check any variable's data type using \`type()\` and convert between types using constructor functions like \`int()\`, \`float()\`, and \`str()\`.`,
      syntaxExample: `variable_name = value
current_type = type(variable_name)
converted_value = int("123")`,
      codeExample: `# Primitive Types and Type Conversion in Python
level = 1                # int
xp_multiplier = 1.5      # float
player_tag = "ShadowDev" # str
is_active = True         # bool

# Type conversion
score_input = "250"
score_number = int(score_input)

total_score = score_number * xp_multiplier

print("Player:", player_tag)
print("Type of level:", type(level).__name__)
print("Calculated Score:", total_score)
print("Is Active?", is_active)`,
      codeExplanation: `1. \`level\` is inferred as an integer, \`xp_multiplier\` as a float, and \`player_tag\` as a string.
2. \`int(score_input)\` safely casts the string \`"250"\` into an actual numerical integer so arithmetic can be performed.
3. Multiplying an integer by a float results in a float (\`total_score = 375.0\`).`,
      knowledgeCheck: [
        {
          question: "What is the result of type(3.14)?",
          options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"],
          answerIndex: 1,
          explanation: "In Python, decimal floating-point numbers belong to the 'float' class."
        },
        {
          question: "Which of the following is a valid boolean value in Python?",
          options: ["true", "TRUE", "True", "1_bool"],
          answerIndex: 2,
          explanation: "Python boolean literals are strictly capitalized: True and False."
        }
      ]
    },
    {
      id: "py-03",
      track: "python",
      order: 3,
      title: "3. Operators and Expressions",
      difficulty: "Beginner",
      estimatedTime: "12 mins",
      xpReward: 20,
      objective: "Master arithmetic, comparison, and logical operators in Python.",
      explanation: `Operators are special symbols that perform operations on operands (variables and values).

1. Arithmetic Operators:
• Addition (\`+\`), Subtraction (\`-\`), Multiplication (\`*\`)
• True Division (\`/\`): Returns float (e.g. 7 / 2 = 3.5)
• Floor Division (\`//\`): Discards fractional part (e.g. 7 // 2 = 3)
• Modulus (\`%\`): Remainder after division (e.g. 7 % 2 = 1)
• Exponentiation (\`**\`): Power calculation (e.g. 2 ** 3 = 8)

2. Comparison Operators (Return boolean):
• Equal (\`==\`), Not Equal (\`!=\`)
• Greater than (\`>\`), Less than (\`<\`), Greater/Equal (\`>=\`), Less/Equal (\`<=\`)

3. Logical Operators:
• \`and\`: True only if both sides are True
• \`or\`: True if at least one side is True
• \`not\`: Inverts the boolean truth value`,
      syntaxExample: `result = 10 % 3        # Remainder is 1
power = 2 ** 4         # 16
is_valid = (x > 0) and (y < 10)`,
      codeExample: `# Python Operators in Action
health = 100
shield = 50
damage = 35

# Arithmetic
effective_hp = health + shield
remaining_hp = effective_hp - damage

# Integer vs Float Division
items = 17
bag_size = 5
bags_needed = items // bag_size
leftover_items = items % bag_size

# Logical Comparisons
is_alive = remaining_hp > 0
has_shield = shield > 0
can_fight = is_alive and (has_shield or remaining_hp >= 20)

print(f"Remaining HP: {remaining_hp}")
print(f"Full Bags: {bags_needed}, Leftovers: {leftover_items}")
print(f"Combat Ready: {can_fight}")`,
      codeExplanation: `1. \`items // bag_size\` produces 3 (integer division).
2. \`items % bag_size\` produces 2 (modulus remainder).
3. The f-string format \`f"..."\` interpolates expressions directly into the output string.
4. Logical \`and\` and \`or\` evaluate conditions according to standard boolean algebra.`,
      knowledgeCheck: [
        {
          question: "What is the output of 15 // 4 in Python?",
          options: ["3.75", "3", "4", "3.0"],
          answerIndex: 1,
          explanation: "// performs floor division and truncates toward negative infinity, yielding the integer 3."
        },
        {
          question: "Which operator raises a number to the power of another in Python?",
          options: ["^", "**", "pow", "exp"],
          answerIndex: 1,
          explanation: "In Python, the ** operator calculates powers (e.g., 2 ** 3 == 8). The ^ operator is bitwise XOR."
        }
      ]
    },
    {
      id: "py-04",
      track: "python",
      order: 4,
      title: "4. Conditional Statements",
      difficulty: "Beginner",
      estimatedTime: "15 mins",
      xpReward: 20,
      objective: "Control program flow using if, elif, and else branching constructs.",
      explanation: `Conditional statements allow your program to make decisions and execute specific blocks of code based on whether a condition evaluates to True or False.

In Python:
• The \`if\` statement tests the initial condition followed by a colon \`:\`.
• \`elif\` (short for 'else if') provides secondary conditions if the previous condition was false.
• \`else\` provides a fallback block if none of the preceding conditions met the criteria.
• Indentation determines the body of each branch.

Python also treats non-boolean values as truthy or falsy:
• Falsy: \`0\`, \`0.0\`, \`""\` (empty string), \`[]\` (empty list), \`None\`, \`False\`.
• Truthy: Any non-zero number, non-empty collection or string.`,
      syntaxExample: `if condition1:
    # executed if condition1 is True
elif condition2:
    # executed if condition2 is True
else:
    # executed if all conditions are False`,
      codeExample: `# Grading and Rank Evaluator in Python
score = 85

if score >= 90:
    rank = "Grandmaster"
    badge = "Gold"
elif score >= 75:
    rank = "Expert"
    badge = "Silver"
elif score >= 50:
    rank = "Apprentice"
    badge = "Bronze"
else:
    rank = "Novice"
    badge = "Wood"

print(f"Score: {score} | Rank: {rank} | Badge: {badge}")

# Nested Condition check
bonus_eligible = score > 80 and badge == "Silver"
if bonus_eligible:
    print("Bonus 50 XP awarded for fast progression!")`,
      codeExplanation: `1. The \`if-elif-else\` chain checks conditions sequentially from top to bottom.
2. Since \`score = 85\`, the first condition (\`>= 90\`) is False. The second condition (\`>= 75\`) is True.
3. Once a branch matches, its body runs and Python skips the rest of the chain.`,
      knowledgeCheck: [
        {
          question: "What keyword is used in Python for 'else if'?",
          options: ["elseif", "else if", "elif", "case"],
          answerIndex: 2,
          explanation: "Python specifically uses 'elif' as the keyword for subsequent conditional branches."
        },
        {
          question: "Which of the following values is evaluated as Falsy in Python?",
          options: ["1", "\"0\"", "[]", "[0]"],
          answerIndex: 2,
          explanation: "An empty list [] is falsy in Python. Non-empty string \"0\" and list with item [0] are truthy."
        }
      ]
    },
    {
      id: "py-05",
      track: "python",
      order: 5,
      title: "5. Loops and Iterations",
      difficulty: "Beginner",
      estimatedTime: "15 mins",
      xpReward: 20,
      objective: "Repeat tasks using while loops, for loops with range(), and loop controls break and continue.",
      explanation: `Loops let you repeat code efficiently without duplicating instructions.

Python offers two types of loops:
1. \`for\` loop: Iterates over a sequence (such as a list, string, or a \`range()\`).
2. \`while\` loop: Repeats as long as a specified condition remains \`True\`.

The \`range(start, stop, step)\` function generates a sequence of numbers:
• \`range(5)\` produces 0, 1, 2, 3, 4 (stop is exclusive).
• \`range(2, 10, 2)\` produces 2, 4, 6, 8.

Loop Control Statements:
• \`break\`: Immediately terminates the innermost loop.
• \`continue\`: Skips the remainder of the current iteration and jumps to the next iteration.`,
      syntaxExample: `for i in range(1, 6):
    print(i)

while count > 0:
    count -= 1`,
      codeExample: `# Demonstrating for and while loops
print("--- For Loop with range ---")
total_sum = 0
for num in range(1, 6):
    total_sum += num
    print(f"Adding {num}, Running Total = {total_sum}")

print("\\n--- While Loop with break/continue ---")
countdown = 10
while countdown > 0:
    countdown -= 1
    if countdown == 5:
        print("Skipping checkpoint 5 (continue)")
        continue
    if countdown == 2:
        print("Emergency stop at 2 (break)")
        break
    print(f"T-minus: {countdown}")`,
      codeExplanation: `1. The \`for\` loop iterates from 1 to 5 (\`range(1, 6)\` excludes 6), accumulating the sum.
2. The \`while\` loop decrements countdown each cycle.
3. When \`countdown == 5\`, \`continue\` skips printing and immediately loops again.
4. When \`countdown == 2\`, \`break\` exits the loop completely.`,
      knowledgeCheck: [
        {
          question: "How many times will a loop with 'for i in range(3):' execute?",
          options: ["2 times", "3 times", "4 times", "Infinite times"],
          answerIndex: 1,
          explanation: "range(3) produces numbers 0, 1, 2, which is exactly 3 iterations."
        },
        {
          question: "What does the 'continue' statement do inside a loop?",
          options: ["Stops the entire loop", "Skips the rest of the current iteration", "Restarts the program", "Pauses execution for 1 second"],
          answerIndex: 1,
          explanation: "continue aborts the current cycle's remaining code and advances to the next iteration."
        }
      ]
    },
    {
      id: "py-06",
      track: "python",
      order: 6,
      title: "6. Functions and Scope",
      difficulty: "Intermediate",
      estimatedTime: "15 mins",
      xpReward: 20,
      objective: "Define modular, reusable functions with parameters, return statements, and default arguments.",
      explanation: `A function is a named, organized block of reusable code that performs a single related action. Functions help make your programs modular, maintainable, and readable (adhering to DRY: Don't Repeat Yourself).

Key concepts:
• Defined with the \`def\` keyword, followed by the function name and parentheses \`()\`.
• Parameters are variables declared inside the function's parentheses.
• Arguments are the actual values passed into the function when called.
• The \`return\` statement sends a computed value back to the caller. If omitted, Python returns \`None\`.
• Default parameters allow arguments to be optional.
• Variables defined inside a function have local scope and cannot be accessed outside.`,
      syntaxExample: `def greet(name, role="Adventurer"):
    return f"Welcome, {name} the {role}!"

msg = greet("Aria")`,
      codeExample: `# Functions and Scope Example
def calculate_xp(base_xp, streak_bonus=1.0, is_boss=False):
    """Calculate total XP awarded for completing an action."""
    multiplier = streak_bonus
    if is_boss:
        multiplier += 0.5
    
    total = int(base_xp * multiplier)
    return total

# Calling functions with positional and keyword arguments
xp1 = calculate_xp(100)                     # uses default streak_bonus=1.0, is_boss=False
xp2 = calculate_xp(100, streak_bonus=1.2)   # 100 * 1.2 = 120
xp3 = calculate_xp(200, 1.2, is_boss=True)  # 200 * (1.2 + 0.5) = 340

print("Quest XP:", xp1)
print("Streak Boosted XP:", xp2)
print("Boss Defeated XP:", xp3)`,
      codeExplanation: `1. The function \`calculate_xp\` specifies three parameters, two of which have default values.
2. The docstring \`"""..."""\` documents the purpose of the function.
3. The calculation uses local variables which are destroyed once the function returns.`,
      knowledgeCheck: [
        {
          question: "Which keyword is used to declare a function in Python?",
          options: ["function", "func", "def", "declare"],
          answerIndex: 2,
          explanation: "Python uses 'def' (short for define) to declare functions."
        },
        {
          question: "What is returned by a Python function that has no explicit return statement?",
          options: ["0", "False", "None", "undefined"],
          answerIndex: 2,
          explanation: "If no return statement is specified, Python functions implicitly return None."
        }
      ]
    },
    {
      id: "py-07",
      track: "python",
      order: 7,
      title: "7. Lists and Dictionaries",
      difficulty: "Intermediate",
      estimatedTime: "18 mins",
      xpReward: 20,
      objective: "Master Python's most essential data structures: indexed mutable lists and key-value dictionaries.",
      explanation: `Lists and Dictionaries are fundamental collections for storing structured data.

1. Lists (\`list\`):
• Ordered, mutable collection of items.
• Defined with square brackets \`[item1, item2, ...]\`.
• Zero-indexed: first item is at index 0, last item is at \`-1\`.
• Methods: \`.append()\`, \`.pop()\`, \`.remove()\`, \`.insert()\`, \`.sort()\`.
• Slicing: \`list[start:stop]\`.

2. Dictionaries (\`dict\`):
• Unordered (Python 3.7+ preserves insertion order) mapping of unique keys to values.
• Defined with curly braces \`{key: value}\`.
• Access values using bracket syntax \`d[key]\` or safe retrieval with \`d.get(key, default)\`.
• Methods: \`.keys()\`, \`.values()\`, \`.items()\`.`,
      syntaxExample: `inventory = ["potion", "shield", "map"]
inventory.append("sword")

stats = {"hp": 100, "mana": 50}
stats["mana"] += 10`,
      codeExample: `# Working with Lists and Dictionaries
# Lists
skills = ["Python", "Algorithms", "Debugging"]
skills.append("Git")
print(f"First skill: {skills[0]}")
print(f"Total skills: {len(skills)}")

# Dictionaries
user_profile = {
    "username": "CodeMaster",
    "level": 3,
    "xp": 340,
    "achievements": ["First Steps", "Fast Thinker"]
}

# Update dictionary
user_profile["xp"] += 60
user_profile["guild"] = "Binary Knights"

print(f"Profile: {user_profile['username']} (Level {user_profile['level']})")
print(f"Current XP: {user_profile['xp']}")
print(f"Achievements: {', '.join(user_profile['achievements'])}")`,
      codeExplanation: `1. \`skills.append("Git")\` adds an element to the end of the list.
2. \`skills[0]\` accesses the element at index 0 ('Python').
3. \`user_profile['xp'] += 60\` modifies the value associated with the key 'xp'.
4. \`', '.join(...)\` creates a single comma-separated string from a list of strings.`,
      knowledgeCheck: [
        {
          question: "How do you access the last item of a Python list named 'items'?",
          options: ["items[last]", "items[len(items)]", "items[-1]", "items.last()"],
          answerIndex: 2,
          explanation: "Negative indexing in Python starts from the end; items[-1] accesses the last element."
        },
        {
          question: "Which dictionary method safely returns a default value if the key does not exist?",
          options: [".fetch()", ".get()", ".find()", ".lookup()"],
          answerIndex: 1,
          explanation: "dict.get(key, default) returns the key's value, or a default fallback without raising a KeyError."
        }
      ]
    },
    {
      id: "py-08",
      track: "python",
      order: 8,
      title: "8. Basic Problem Solving & String Manipulation",
      difficulty: "Intermediate",
      estimatedTime: "20 mins",
      xpReward: 20,
      objective: "Combine loops, conditionals, and string operations to solve algorithmic beginner problems.",
      explanation: `Problem solving in programming involves breaking down a larger task into small, sequential logical steps.

Common algorithmic patterns:
• Accumulator Pattern: Initializing a variable (like sum=0 or count=0) and updating it inside an iteration loop.
• Filtering Pattern: Evaluating each item in a collection against a condition and retaining matching items.
• Two-pointer / Reversal: Working through strings or arrays from boundaries.
• String Methods:
  - \`.lower()\`, \`.upper()\`: Case transformations.
  - \`.strip()\`: Trim whitespace.
  - \`.replace(old, new)\`: Substitute substrings.
  - \`.split(delimiter)\`: Break a string into a list.
  - \`string[::-1]\`: Pythonic idiom for string reversal using slicing.`,
      syntaxExample: `text = "CodeQuest"
reversed_text = text[::-1]
words = "apple,banana,cherry".split(",")`,
      codeExample: `# Algorithmic Problem: Palindrome and Vowel Counter
def analyze_phrase(phrase):
    cleaned = phrase.strip().lower()
    
    # 1. Check Palindrome (reads same forwards and backwards)
    is_palindrome = cleaned == cleaned[::-1]
    
    # 2. Count vowels using accumulator pattern
    vowels = "aeiou"
    vowel_count = 0
    for char in cleaned:
        if char in vowels:
            vowel_count += 1
            
    return {
        "original": phrase,
        "is_palindrome": is_palindrome,
        "vowel_count": vowel_count
    }

test_word = "racecar"
result = analyze_phrase(test_word)
print(f"Word: '{test_word}'")
print(f"Is Palindrome? {result['is_palindrome']}")
print(f"Vowel Count: {result['vowel_count']}")`,
      codeExplanation: `1. \`.strip().lower()\` standardizes user input to avoid false mismatches due to capitalization or spaces.
2. \`cleaned[::-1]\` reverses the string using slice step \`-1\`.
3. The loop checks \`char in vowels\` and increments \`vowel_count\` whenever a match is found.`,
      knowledgeCheck: [
        {
          question: "What does the slice expression 'word[::-1]' accomplish in Python?",
          options: ["Deletes the first character", "Reverses the entire string", "Capitalizes the string", "Doubles each character"],
          answerIndex: 1,
          explanation: "The slice [start:stop:step] with step=-1 traverses backwards, effectively reversing the string."
        },
        {
          question: "Which string method splits a sentence into a list of words by whitespace?",
          options: [".divide()", ".split()", ".explode()", ".slice()"],
          answerIndex: 1,
          explanation: "string.split() without arguments splits by consecutive whitespace characters into a list of words."
        }
      ]
    }
  ],

  // ==========================================
  // LESSONS: C (8 Detailed Lessons)
  // ==========================================
  cLessons: [
    {
      id: "c-01",
      track: "c",
      order: 1,
      title: "1. Introduction to C",
      difficulty: "Beginner",
      estimatedTime: "12 mins",
      xpReward: 20,
      objective: "Understand the structure of a C program, header files, the main() entry point, and printf().",
      explanation: `C is a procedural, compiled, low-level programming language developed by Dennis Ritchie in 1972 at Bell Labs. 
      
It forms the foundation of modern computing: major operating systems (Linux, Windows, macOS kernels), database engines, and language runtimes (including Python's CPython) are implemented in C.

Structure of a C Program:
1. Preprocessor Directives: Lines starting with \`#\`, such as \`#include <stdio.h>\`. This tells the preprocessor to include standard input/output declarations.
2. The \`main()\` Function: The mandatory entry point where program execution begins. It returns an integer status code (\`0\` indicates successful completion).
3. Statements: Semicolons \`;\` terminate every statement in C. Omitting a semicolon causes a compiler syntax error.
4. Compilation: C source code (.c) is converted by a compiler (like GCC or Clang) into machine code binaries (.exe or ELF) before execution.`,
      syntaxExample: `#include <stdio.h>

int main(void) {
    // Statements terminated with semicolon
    return 0;
}`,
      codeExample: `/* First C Program - CodeQuest */
#include <stdio.h>

int main(void) {
    // printf prints formatted output to the console
    printf("Welcome to CodeQuest C Track!\\n");
    printf("Mission: Master systems programming.\\n");
    
    // Return 0 signifies successful execution to OS
    return 0;
}`,
      codeExplanation: `1. \`#include <stdio.h>\` includes header declarations for \`printf()\`.
2. \`int main(void)\` declares the main function that takes no parameters and returns an integer.
3. \`\\n\` represents the newline escape sequence.
4. \`return 0;\` informs the operating system that the program terminated cleanly.`,
      knowledgeCheck: [
        {
          question: "Which function is the starting entry point of every executable C program?",
          options: ["start()", "run()", "main()", "init()"],
          answerIndex: 2,
          explanation: "Every standard executable C program begins execution in the main() function."
        },
        {
          question: "What punctuation character must terminate every statement in C?",
          options: [": (colon)", "; (semicolon)", ". (period)", "} (closing brace)"],
          answerIndex: 1,
          explanation: "In C, semicolons ';' are mandatory statement terminators."
        }
      ]
    },
    {
      id: "c-02",
      track: "c",
      order: 2,
      title: "2. Variables and Data Types",
      difficulty: "Beginner",
      estimatedTime: "14 mins",
      xpReward: 20,
      objective: "Learn static typing, primary data types (int, float, double, char), and printf format specifiers.",
      explanation: `Unlike Python, C is statically and strictly typed. You must declare the type of a variable before storing values in it.

Primary C Data Types:
• \`int\`: Integer numbers (typically 4 bytes, e.g., -2147483648 to 2147483647).
• \`float\`: Single-precision floating point (4 bytes, ~6-7 decimal digits of precision).
• \`double\`: Double-precision floating point (8 bytes, ~15-17 decimal digits of precision).
• \`char\`: Single character (1 byte, stored internally as an ASCII integer from -128 to 127).

Format Specifiers in \`printf()\`:
• \`%d\` or \`%i\`: int
• \`%f\`: float / double
• \`%.2f\`: float rounded to 2 decimal places
• \`%c\`: char
• \`%s\`: string (array of characters)`,
      syntaxExample: `int score = 100;
float ratio = 3.14f;
char grade = 'A';
printf("Score: %d, Grade: %c\\n", score, grade);`,
      codeExample: `#include <stdio.h>

int main(void) {
    int quest_level = 2;
    float xp_rate = 1.25f;
    double high_precision_score = 9845.6789;
    char hero_rank = 'S';

    printf("Quest Level : %d\\n", quest_level);
    printf("XP Rate     : %.2f\\n", xp_rate);
    printf("High Score  : %.4lf\\n", high_precision_score);
    printf("Hero Rank   : %c (ASCII code: %d)\\n", hero_rank, hero_rank);

    return 0;
}`,
      codeExplanation: `1. Each variable declaration specifies the type first, followed by the identifier and initial value.
2. \`%.2f\` restricts floating point output to exactly 2 decimal places.
3. In C, \`char hero_rank = 'S'\` uses single quotes. Notice that printing it with \`%c\` gives the character 'S', while \`%d\` gives its ASCII decimal code (83).`,
      knowledgeCheck: [
        {
          question: "Which format specifier is used in printf() to print an integer?",
          options: ["%s", "%f", "%d", "%c"],
          answerIndex: 2,
          explanation: "%d (or %i) is the standard format specifier for signed decimal integers in C."
        },
        {
          question: "How are character literals enclosed in C?",
          options: ["In double quotes \"A\"", "In single quotes 'A'", "In backticks `A`", "In angle brackets <A>"],
          answerIndex: 1,
          explanation: "Character literals in C are enclosed in single quotes 'A'. Double quotes \"A\" denote a null-terminated string literal."
        }
      ]
    },
    {
      id: "c-03",
      track: "c",
      order: 3,
      title: "3. Operators and Expressions",
      difficulty: "Beginner",
      estimatedTime: "14 mins",
      xpReward: 20,
      objective: "Master arithmetic, relational, logical, and unary increment/decrement operators.",
      explanation: `C operators manipulate data at both mathematical and bitwise levels.

Key Operator Categories:
1. Arithmetic Operators: \`+\`, \`-\`, \`*\`, \`/\`, \`%\`.
   *Caution with division*: When both operands are integers (e.g. \`5 / 2\`), C performs integer division and discards fractions, resulting in \`2\`. To get \`2.5\`, at least one operand must be a float (\`5.0 / 2\`).
2. Relational Operators: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`.
   In classic C (C89), there was no built-in boolean type: \`0\` represents False, and any non-zero value represents True.
3. Logical Operators:
   • \`&&\`: Logical AND (short-circuiting).
   • \`||\`: Logical OR (short-circuiting).
   • \`!\`: Logical NOT.
4. Unary Operators:
   • \`++count\` (pre-increment): Increments first, then evaluates.
   • \`count++\` (post-increment): Evaluates current value first, then increments.`,
      syntaxExample: `int a = 10;
int b = ++a; // a is 11, b is 11
int c = a++; // c is 11, a is 12`,
      codeExample: `#include <stdio.h>

int main(void) {
    int total_gold = 100;
    int players = 3;

    // Integer vs Floating division
    int share = total_gold / players;       // 100 / 3 = 33
    int leftover = total_gold % players;    // 100 % 3 = 1
    float exact = (float)total_gold / players; // 33.333332

    printf("Each gets : %d gold\\n", share);
    printf("Leftover  : %d gold\\n", leftover);
    printf("Exact avg : %.2f gold\\n", exact);

    // Increment demo
    int potions = 5;
    printf("Post-increment: %d\\n", potions++); // prints 5, then becomes 6
    printf("Now potions is: %d\\n", potions);   // prints 6

    return 0;
}`,
      codeExplanation: `1. \`total_gold / players\` performs integer division because both variables are integers.
2. \`(float)total_gold\` uses explicit type casting to convert \`total_gold\` to float before division, ensuring a floating-point result.
3. Post-increment \`potions++\` prints 5 and then updates the variable in memory to 6.`,
      knowledgeCheck: [
        {
          question: "What is the result of 7 / 2 in C when both operands are integers?",
          options: ["3.5", "3", "4", "3.0"],
          answerIndex: 1,
          explanation: "In C, integer division truncates any fractional portion, producing 3."
        },
        {
          question: "What does the expression '!(5 > 2)' evaluate to in C?",
          options: ["1 (True)", "0 (False)", "-1", "Syntax error"],
          answerIndex: 1,
          explanation: "5 > 2 is True (1). Applying the logical NOT operator !1 produces 0 (False)."
        }
      ]
    },
    {
      id: "c-04",
      track: "c",
      order: 4,
      title: "4. Conditional Statements",
      difficulty: "Beginner",
      estimatedTime: "15 mins",
      xpReward: 20,
      objective: "Master conditional decision-making using if, else if, else, and switch-case statements.",
      explanation: `Conditional statements allow your C code to branch along different paths based on conditions.

1. \`if - else if - else\` hierarchy:
Tests boolean expressions enclosed in parentheses \`(...)\`. If a branch contains multiple statements, it must be enclosed in braces \`{ ... }\`.

2. The \`switch\` statement:
A clean, efficient construct for testing an expression against multiple constant integral values (\`int\` or \`char\`).
• Each branch begins with \`case VALUE:\`.
• The \`break;\` statement prevents fall-through into subsequent cases.
• The optional \`default:\` case acts like the final \`else\` fallback.`,
      syntaxExample: `switch(choice) {
    case 1:
        // action 1
        break;
    case 2:
        // action 2
        break;
    default:
        // fallback
}`,
      codeExample: `#include <stdio.h>

int main(void) {
    int difficulty = 2;

    // if-else if-else
    if (difficulty == 1) {
        printf("Mode: Easy (Beginner friendly)\\n");
    } else if (difficulty == 2) {
        printf("Mode: Medium (Balanced challenge)\\n");
    } else if (difficulty == 3) {
        printf("Mode: Hard (Expert coder)\\n");
    } else {
        printf("Mode: Unknown level\\n");
    }

    // switch-case statement
    char grade = 'B';
    switch (grade) {
        case 'A':
            printf("XP Bonus: +50 XP! Perfect grade.\\n");
            break;
        case 'B':
            printf("XP Bonus: +30 XP! Great job.\\n");
            break;
        case 'C':
            printf("XP Bonus: +15 XP! Good effort.\\n");
            break;
        default:
            printf("Keep practicing to earn bonus XP!\\n");
            break;
    }

    return 0;
}`,
      codeExplanation: `1. The \`if-else\` ladder checks conditions sequentially and executes the matching block.
2. In the \`switch\` construct, C jumps directly to \`case 'B':\`.
3. The \`break\` keyword is critical; without it, execution falls through into case 'C' and default.`,
      knowledgeCheck: [
        {
          question: "What happens in a C switch statement if you forget the 'break' statement?",
          options: ["The program crashes immediately", "Execution falls through to the next case", "The compiler issues an error", "The switch statement repeats in a loop"],
          answerIndex: 1,
          explanation: "Omitting break causes case fall-through, executing subsequent case blocks regardless of their match."
        },
        {
          question: "Which of the following data types CANNOT be used in a switch condition in C?",
          options: ["int", "char", "float", "short"],
          answerIndex: 2,
          explanation: "The switch condition in C requires an integral type (int, char, enum). Floats and doubles cannot be used."
        }
      ]
    },
    {
      id: "c-05",
      track: "c",
      order: 5,
      title: "5. Loops (for, while, do-while)",
      difficulty: "Beginner",
      estimatedTime: "15 mins",
      xpReward: 20,
      objective: "Implement repetition using for loops, entry-controlled while loops, and exit-controlled do-while loops.",
      explanation: `C provides three distinct loop structures for repeated execution.

1. The \`for\` Loop:
Ideal when the number of iterations is known in advance.
\`for (initialization; condition; update)\`
All three components are grouped cleanly in the loop header.

2. The \`while\` Loop:
Entry-controlled loop. Evaluates the condition first before running the loop body. If the condition is false initially, the body executes zero times.

3. The \`do-while\` Loop:
Exit-controlled loop. The body always executes at least once because the condition is evaluated at the end:
\`do { ... } while (condition);\``,
      syntaxExample: `for (int i = 0; i < 5; i++) { ... }
while (count > 0) { ... }
do { ... } while (attempts < 3);`,
      codeExample: `#include <stdio.h>

int main(void) {
    // 1. For loop: multiplication table for 3
    printf("Table of 3:\\n");
    for (int i = 1; i <= 5; i++) {
        printf("3 x %d = %d\\n", i, 3 * i);
    }

    // 2. While loop: power of 2 generator
    printf("\\nPowers of 2 up to 32:\\n");
    int val = 1;
    while (val <= 32) {
        printf("%d ", val);
        val *= 2;
    }
    printf("\\n");

    // 3. Do-While loop: guaranteed at least 1 iteration
    int stamina = 0;
    do {
        printf("\\nRunning warmup lap! Stamina is: %d\\n", stamina);
    } while (stamina > 0);

    return 0;
}`,
      codeExplanation: `1. The \`for\` loop initializes \`int i = 1\`, runs while \`i <= 5\`, and increments \`i++\` each cycle.
2. The \`while\` loop tests \`val <= 32\` before each iteration and doubles \`val\`.
3. The \`do-while\` loop prints the warmup lap once even though \`stamina > 0\` is immediately false.`,
      knowledgeCheck: [
        {
          question: "Which C loop is guaranteed to execute its body at least once?",
          options: ["for loop", "while loop", "do-while loop", "nested loop"],
          answerIndex: 2,
          explanation: "do-while is an exit-controlled loop; condition is tested after the body runs, guaranteeing at least one run."
        },
        {
          question: "In 'for (int i = 0; i < 10; i += 2)', how many times does the loop execute?",
          options: ["10 times", "5 times", "4 times", "9 times"],
          answerIndex: 1,
          explanation: "i takes values 0, 2, 4, 6, 8, which is exactly 5 iterations."
        }
      ]
    },
    {
      id: "c-06",
      track: "c",
      order: 6,
      title: "6. Functions and Prototypes",
      difficulty: "Intermediate",
      estimatedTime: "18 mins",
      xpReward: 20,
      objective: "Structure C programs with function prototypes, return types, and understand pass-by-value semantics.",
      explanation: `Functions break programs into modular blocks. In C, if you call a function before its full definition appears in the file, you must declare a Function Prototype at the top.

Function Anatomy:
\`return_type function_name(parameter_type param1, ...);\`

Key concepts:
• Function Prototype: Tells the compiler about the function's name, return type, and parameter list before its body is defined.
• Pass-by-Value: By default, C copies argument values into function parameters. Modifying a parameter inside the function does not change the caller's variable in main().
• Void functions: If a function does not return a value, its return type is \`void\`.`,
      syntaxExample: `// Prototype
int square(int x);

// Definition
int square(int x) {
    return x * x;
}`,
      codeExample: `#include <stdio.h>

// 1. Function Prototypes
int calculate_damage(int base_attack, int defense);
void display_banner(void);

int main(void) {
    display_banner();

    int attack = 45;
    int armor = 15;
    int dealt = calculate_damage(attack, armor);

    printf("Attack: %d vs Armor: %d -> Damage Dealt: %d\\n", attack, armor, dealt);
    return 0;
}

// 2. Function Definitions
void display_banner(void) {
    printf("=== CODEQUEST COMBAT ARENA ===\\n");
}

int calculate_damage(int base_attack, int defense) {
    int effective = base_attack - defense;
    if (effective < 1) {
        effective = 1; // Minimum 1 damage
    }
    return effective;
}`,
      codeExplanation: `1. Prototypes at the top tell the compiler the signatures of \`calculate_damage\` and \`display_banner\`.
2. \`display_banner\` has return type \`void\` and accepts \`void\` (no parameters).
3. \`calculate_damage\` takes two integer arguments by value, computes the effective difference, and returns an integer.`,
      knowledgeCheck: [
        {
          question: "Why do we use function prototypes in C?",
          options: ["To reserve heap memory", "To inform the compiler of a function's signature before its definition", "To make functions private", "To automatically execute them on launch"],
          answerIndex: 1,
          explanation: "Prototypes notify the compiler of a function's name, parameters, and return type so calls can be validated."
        },
        {
          question: "What does 'pass-by-value' mean in C?",
          options: ["The function receives the memory address directly", "A copy of the argument's value is passed to the function", "The original variable is always overwritten", "Values are shared globally"],
          answerIndex: 1,
          explanation: "In C, pass-by-value copies the value into the parameter; changing the parameter does not alter the caller's variable."
        }
      ]
    },
    {
      id: "c-07",
      track: "c",
      order: 7,
      title: "7. Arrays and Strings",
      difficulty: "Intermediate",
      estimatedTime: "20 mins",
      xpReward: 20,
      objective: "Understand 1D contiguous arrays, bounds, indexing, and null-terminated strings.",
      explanation: `Arrays store multiple elements of the same data type in contiguous memory locations.

1. Arrays in C:
• Declared with fixed size: \`int scores[5];\`
• Zero-indexed: valid indices for size 5 are \`0\` through \`4\`.
• *Important*: C does NOT perform array bounds checking. Accessing \`scores[10]\` reads arbitrary memory (undefined behavior / buffer overflow risk).

2. Strings in C:
• C does not have a native string primitive type!
• A string in C is simply an array of characters terminated by the null character \`'\\0'\` (ASCII 0).
• Example: \`"Quest"\` occupies 6 bytes in memory (\`'Q'\`, \`'u'\`, \`'e'\`, \`'s'\`, \`'t'\`, \`'\\0'\`).
• Header \`<string.h>\` provides utility functions: \`strlen()\`, \`strcpy()\`, \`strcmp()\`.`,
      syntaxExample: `int nums[3] = {10, 20, 30};
char name[] = "CodeQuest"; // compiler adds '\\0' automatically`,
      codeExample: `#include <stdio.h>
#include <string.h>

int main(void) {
    // 1D Array of integers
    int quest_scores[5] = {85, 92, 78, 95, 88};
    int total = 0;

    for (int i = 0; i < 5; i++) {
        total += quest_scores[i];
    }
    float average = total / 5.0f;
    printf("Total XP: %d, Average Score: %.1f\\n", total, average);

    // C Strings (Null-terminated character arrays)
    char greeting[20] = "Hello";
    char platform[] = "CodeQuest";

    printf("Greeting: %s\\n", greeting);
    printf("Length of '%s' is %lu characters\\n", platform, strlen(platform));

    return 0;
}`,
      codeExplanation: `1. \`quest_scores[5]\` stores 5 integers in contiguous memory.
2. The \`for\` loop sums all elements using indices \`0\` to \`4\`.
3. \`strlen(platform)\` counts characters up to (but not including) the trailing null terminator \`'\\0'\`.`,
      knowledgeCheck: [
        {
          question: "What special character marks the end of a string in C?",
          options: ["\\n (newline)", "\\0 (null character)", "\\t (tab)", "; (semicolon)"],
          answerIndex: 1,
          explanation: "Strings in C are character arrays terminated by the null character '\\0'."
        },
        {
          question: "If an array is declared as 'int arr[8];', what is the index of the last element?",
          options: ["8", "7", "9", "-1"],
          answerIndex: 1,
          explanation: "C uses 0-based indexing; an array of size 8 has valid indices 0 through 7."
        }
      ]
    },
    {
      id: "c-08",
      track: "c",
      order: 8,
      title: "8. Pointers: Introduction",
      difficulty: "Intermediate",
      estimatedTime: "22 mins",
      xpReward: 20,
      objective: "Understand memory addresses, the address-of operator (&), and dereference operator (*).",
      explanation: `Pointers are one of C's most powerful and distinguishing features. A pointer is a variable that stores the memory address of another variable.

Why pointers matter:
• Enable pass-by-reference (modifying caller variables inside functions).
• Dynamic memory management (heap allocation via \`malloc\` and \`free\`).
• Efficient handling of large data structures without copying overhead.

Key Operators:
1. Address-of Operator (\`&\`): Returns the hexadecimal memory address of a variable.
2. Dereference Operator (\`*\`):
   • In declarations (\`int *ptr;\`): Declares a pointer to an integer.
   • In expressions (\`*ptr = 50;\`): Accesses or modifies the value at the address stored in the pointer.`,
      syntaxExample: `int num = 42;
int *ptr = &num; // ptr holds address of num
*ptr = 99;       // num is now 99!`,
      codeExample: `#include <stdio.h>

// Function that modifies original values using pointers
void level_up(int *xp_ptr, int *lvl_ptr) {
    *xp_ptr += 100; // dereference and add
    if (*xp_ptr >= 200) {
        *lvl_ptr += 1;
    }
}

int main(void) {
    int player_xp = 150;
    int player_level = 1;

    printf("Before: XP=%d, Level=%d\\n", player_xp, player_level);

    // Pass memory addresses using &
    level_up(&player_xp, &player_level);

    printf("After : XP=%d, Level=%d\\n", player_xp, player_level);

    // Direct pointer demonstration
    int secret = 777;
    int *p_secret = &secret;

    printf("\\nSecret Value     : %d\\n", secret);
    printf("Secret Address   : %p\\n", (void*)p_secret);
    printf("Dereferenced Val : %d\\n", *p_secret);

    return 0;
}`,
      codeExplanation: `1. In \`level_up(&player_xp, &player_level)\`, the \`&\` operator passes the memory addresses of the variables.
2. Inside \`level_up\`, \`*xp_ptr\` directly accesses and modifies the memory location in \`main()\`.
3. \`%p\` is the format specifier for printing pointer memory addresses in hexadecimal notation.`,
      knowledgeCheck: [
        {
          question: "Which operator is used to get the memory address of a variable in C?",
          options: ["* (asterisk)", "& (ampersand)", "-> (arrow)", "# (hash)"],
          answerIndex: 1,
          explanation: "The address-of operator '&' retrieves the memory address of a variable."
        },
        {
          question: "What does '*ptr' do when used in an executable statement where ptr is a pointer?",
          options: ["Multiplies ptr by itself", "Deletes the pointer", "Dereferences ptr to access the value at that address", "Declares a new pointer"],
          answerIndex: 2,
          explanation: "Dereferencing '*ptr' reads or writes the value stored at the memory address pointed to by ptr."
        }
      ]
    }
  ],

  // ==========================================
  // QUIZZES: PYTHON (15 Verified Questions)
  // ==========================================
  pythonQuizzes: [
    {
      id: "pq-01",
      question: "What is the output of print(type([]) is list)?",
      options: ["False", "True", "SyntaxError", "None"],
      answerIndex: 1,
      explanation: "[] creates a list literal, so type([]) is indeed list, evaluating to True."
    },
    {
      id: "pq-02",
      question: "Which of the following is an immutable data type in Python?",
      options: ["list", "dict", "tuple", "set"],
      answerIndex: 2,
      explanation: "Tuples cannot be modified after creation; lists, dicts, and sets are mutable."
    },
    {
      id: "pq-03",
      question: "What will print(2 ** 3 ** 2) output in Python?",
      options: ["64", "512", "36", "256"],
      answerIndex: 1,
      explanation: "Exponentiation is right-associative: 3 ** 2 is 9, then 2 ** 9 is 512."
    },
    {
      id: "pq-04",
      question: "What is the output of bool(\"\")?",
      options: ["True", "False", "None", "Error"],
      answerIndex: 1,
      explanation: "An empty string is a falsy value in Python, returning False."
    },
    {
      id: "pq-05",
      question: "Which keyword is used to define an anonymous (one-line) function?",
      options: ["def", "anonymous", "lambda", "inline"],
      answerIndex: 2,
      explanation: "lambda creates anonymous inline function expressions in Python."
    },
    {
      id: "pq-06",
      question: "What does the expression [1, 2] * 2 produce?",
      options: ["[2, 4]", "[1, 2, 1, 2]", "[[1, 2], [1, 2]]", "TypeError"],
      answerIndex: 1,
      explanation: "Multiplying a list by an integer repeats its elements, resulting in [1, 2, 1, 2]."
    },
    {
      id: "pq-07",
      question: "What will print('CodeQuest'[-5:]) output?",
      options: ["CodeQ", "Quest", "odeQu", "uest"],
      answerIndex: 1,
      explanation: "Negative index -5 corresponds to 'Q', so [-5:] slices from 'Q' to the end: 'Quest'."
    },
    {
      id: "pq-08",
      question: "How do you start a block of code inside an if statement?",
      options: ["With a {", "With a : (colon)", "With a ->", "With the 'then' keyword"],
      answerIndex: 1,
      explanation: "In Python, compound statements like if, for, while, and def require a colon ':' at the end of the header line."
    },
    {
      id: "pq-09",
      question: "What will range(1, 10, 3) generate when converted to a list?",
      options: ["[1, 4, 7, 10]", "[1, 4, 7]", "[3, 6, 9]", "[1, 3, 6, 9]"],
      answerIndex: 1,
      explanation: "Starts at 1, steps by 3 (1, 4, 7). 10 is the exclusive upper bound, so it stops at 7."
    },
    {
      id: "pq-10",
      question: "Which method removes and returns the last element of a list?",
      options: [".delete()", ".remove()", ".pop()", ".shift()"],
      answerIndex: 2,
      explanation: ".pop() removes and returns the item at the specified index (defaulting to the last item)."
    },
    {
      id: "pq-11",
      question: "What is the output of print(True + True + False)?",
      options: ["True", "2", "1", "TypeError"],
      answerIndex: 1,
      explanation: "In Python, bool is a subclass of int. True evaluates to 1 and False evaluates to 0, giving 1 + 1 + 0 = 2."
    },
    {
      id: "pq-12",
      question: "What will the dictionary operation {'a': 1}.get('b', 99) return?",
      options: ["None", "KeyError", "99", "0"],
      answerIndex: 2,
      explanation: "dict.get(key, default) returns the specified default value (99) when the key does not exist."
    },
    {
      id: "pq-13",
      question: "What is the purpose of the 'pass' statement in Python?",
      options: ["Passes control to the parent function", "Acts as a null placeholder where syntax requires a statement", "Skips to the next loop iteration", "Exits the program"],
      answerIndex: 1,
      explanation: "'pass' is a null operation; nothing happens when it executes. It acts as a syntactic placeholder."
    },
    {
      id: "pq-14",
      question: "What will 'hello'.capitalize() return?",
      options: ["HELLO", "Hello", "hELLO", "hello"],
      answerIndex: 1,
      explanation: "The capitalize() method capitalizes only the first character and turns the rest lowercase."
    },
    {
      id: "pq-15",
      question: "What does the expression len(set([1, 2, 2, 3, 3, 3])) evaluate to?",
      options: ["6", "3", "1", "TypeError"],
      answerIndex: 1,
      explanation: "A set stores only unique items. The set contains {1, 2, 3}, so its length is 3."
    }
  ],

  // ==========================================
  // QUIZZES: C (15 Verified Questions)
  // ==========================================
  cQuizzes: [
    {
      id: "cq-01",
      question: "Which of the following is NOT a valid variable name in C?",
      options: ["_playerScore", "quest_1", "2ndHero", "MAX_XP"],
      answerIndex: 2,
      explanation: "Identifiers in C cannot start with a digit. '2ndHero' is invalid."
    },
    {
      id: "cq-02",
      question: "What is the size of 'char' in standard C?",
      options: ["1 byte", "2 bytes", "4 bytes", "Depends on OS"],
      answerIndex: 0,
      explanation: "The C standard guarantees that sizeof(char) is always exactly 1 byte."
    },
    {
      id: "cq-03",
      question: "What is the output of printf(\"%d\", 5 > 3 && 2 < 1); in C?",
      options: ["1", "0", "True", "False"],
      answerIndex: 1,
      explanation: "5 > 3 is true (1), but 2 < 1 is false (0). 1 && 0 evaluates to 0."
    },
    {
      id: "cq-04",
      question: "Which operator is used to access members of a structure through a pointer?",
      options: [". (dot)", "-> (arrow)", ":: (scope)", "& (address)"],
      answerIndex: 1,
      explanation: "The arrow operator '->' dereferences and accesses a struct field from a pointer (ptr->member)."
    },
    {
      id: "cq-05",
      question: "What value does uninitialized local variables (automatic storage) contain in C?",
      options: ["0", "NULL", "Garbage / indeterminate value", "-1"],
      answerIndex: 2,
      explanation: "Local variables on the stack are not automatically zeroed; they contain arbitrary garbage memory."
    },
    {
      id: "cq-06",
      question: "What is the format specifier for printing a memory address pointer in printf?",
      options: ["%x", "%a", "%p", "%m"],
      answerIndex: 2,
      explanation: "%p is the standard format specifier used to print pointer memory addresses in hexadecimal."
    },
    {
      id: "cq-07",
      question: "What will be printed by: int x = 5; printf(\"%d\", x++); ?",
      options: ["5", "6", "4", "Garbage"],
      answerIndex: 0,
      explanation: "Post-increment returns the value *before* incrementing. 5 is printed, and x becomes 6 afterwards."
    },
    {
      id: "cq-08",
      question: "Which header file is required to use strcmp() and strlen()?",
      options: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<ctype.h>"],
      answerIndex: 2,
      explanation: "<string.h> contains declarations for standard C string handling functions."
    },
    {
      id: "cq-09",
      question: "What does the 'break' statement do inside a loop in C?",
      options: ["Pauses the loop for 1 second", "Terminates the loop immediately", "Skips to the next iteration", "Restarts the loop from 0"],
      answerIndex: 1,
      explanation: "'break' immediately terminates the innermost enclosing loop or switch construct."
    },
    {
      id: "cq-10",
      question: "What is the result of sizeof(\"Code\") in C?",
      options: ["4", "5", "8", "1"],
      answerIndex: 1,
      explanation: "The string literal \"Code\" has 4 characters plus the implicit trailing null character '\\0', making 5 bytes total."
    },
    {
      id: "cq-11",
      question: "In C, if ptr is a pointer to an int, what does 'ptr + 1' point to?",
      options: ["The very next single byte in memory", "The memory location of the next integer (offset by sizeof(int))", "The value of ptr incremented by 1", "A random address"],
      answerIndex: 1,
      explanation: "Pointer arithmetic scales automatically by the size of the referenced type (sizeof(int))."
    },
    {
      id: "cq-12",
      question: "What will 10 % -3 evaluate to in C99 and later?",
      options: ["-1", "1", "-3", "3"],
      answerIndex: 1,
      explanation: "In C99+, the sign of the modulus result always matches the dividend (numerator), so 10 % -3 is 1."
    },
    {
      id: "cq-13",
      question: "Which function allocates uninitialized dynamic memory on the heap?",
      options: ["calloc()", "malloc()", "realloc()", "alloc()"],
      answerIndex: 1,
      explanation: "malloc() allocates raw uninitialized memory bytes. (calloc initializes memory to zero)."
    },
    {
      id: "cq-14",
      question: "What happens if you declare 'const int MAX = 100;' and then do 'MAX = 200;'?",
      options: ["MAX changes to 200", "Warning is printed but compiles", "Compiler error: assignment of read-only variable", "Runtime segmentation fault"],
      answerIndex: 2,
      explanation: "'const' marks the variable as read-only; attempting to assign to it causes a compilation error."
    },
    {
      id: "cq-15",
      question: "What does a return value of 0 from main() indicate to the operating system?",
      options: ["Error occurred", "Program ran out of memory", "Successful termination", "Program is still waiting for input"],
      answerIndex: 2,
      explanation: "Returning 0 from main() is the universal convention signaling normal, error-free program exit."
    }
  ],

  // ==========================================
  // CODING CHALLENGES (10 Verified Problems)
  // ==========================================
  challenges: [
    {
      id: "ch-01",
      title: "1. Print a Message (Hello World)",
      difficulty: "Easy",
      category: "Basics",
      xpReward: 30,
      problemStatement: "Write a program that takes a user's name as input and outputs a friendly greeting in the exact format: 'Hello, <name>! Welcome to CodeQuest.'",
      inputFormat: "A single line containing a string representing the name.",
      outputFormat: "A single line printing 'Hello, <name>! Welcome to CodeQuest.'",
      sampleCases: [
        { input: "Aria", output: "Hello, Aria! Welcome to CodeQuest.", explanation: "The name 'Aria' is interpolated into the greeting." },
        { input: "CodeMaster", output: "Hello, CodeMaster! Welcome to CodeQuest.", explanation: "The greeting template is preserved with the input name." }
      ],
      hint: "Read input as a string and use string formatting or concatenation to output the message.",
      algorithmExplanation: "This problem tests standard I/O and string output. In Python, use f-strings or print(). In C, read string input with fgets() or scanf(), remove newline characters, and format using printf().",
      pythonSolution: `# Python Solution
def greet_coder(name):
    # Strip any extra whitespace
    clean_name = name.strip()
    return f"Hello, {clean_name}! Welcome to CodeQuest."

# Example execution:
user_input = "Aria"
print(greet_coder(user_input))`,
      cSolution: `/* C Solution */
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[100];
    
    // Read input name safely
    if (fgets(name, sizeof(name), stdin) != NULL) {
        // Strip trailing newline character
        name[strcspn(name, "\\n")] = '\\0';
        printf("Hello, %s! Welcome to CodeQuest.\\n", name);
    }
    return 0;
}`
    },
    {
      id: "ch-02",
      title: "2. Sum of Two Numbers",
      difficulty: "Easy",
      category: "Arithmetic",
      xpReward: 30,
      problemStatement: "Given two integers A and B, calculate and return their arithmetic sum.",
      inputFormat: "Two integers A and B separated by space or on separate lines.",
      outputFormat: "Print the integer sum of A and B.",
      sampleCases: [
        { input: "15 25", output: "40", explanation: "15 + 25 = 40" },
        { input: "-8 12", output: "4", explanation: "-8 + 12 = 4" }
      ],
      hint: "Convert your inputs to integer types before applying the addition operator (+).",
      algorithmExplanation: "Take two numerical inputs, parse them into numeric primitives (int), perform addition using the + operator, and print the resulting sum.",
      pythonSolution: `# Python Solution
def add_two_numbers(a, b):
    return a + b

# Example execution:
num1, num2 = 15, 25
print(add_two_numbers(num1, num2)) # Output: 40`,
      cSolution: `/* C Solution */
#include <stdio.h>

int add_two_numbers(int a, int b) {
    return a + b;
}

int main(void) {
    int a = 15, b = 25;
    printf("%d\\n", add_two_numbers(a, b)); // Output: 40
    return 0;
}`
    },
    {
      id: "ch-03",
      title: "3. Even or Odd Checker",
      difficulty: "Easy",
      category: "Conditionals",
      xpReward: 30,
      problemStatement: "Given an integer N, determine whether the number is 'Even' or 'Odd'.",
      inputFormat: "A single integer N.",
      outputFormat: "Print 'Even' if N is divisible by 2 with no remainder; otherwise print 'Odd'.",
      sampleCases: [
        { input: "42", output: "Even", explanation: "42 % 2 == 0, so 42 is Even." },
        { input: "17", output: "Odd", explanation: "17 % 2 == 1, so 17 is Odd." }
      ],
      hint: "Use the modulus operator (%) to check the remainder when divided by 2.",
      algorithmExplanation: "Any integer divisible by 2 with remainder 0 is even. If N % 2 == 0, it is Even; otherwise, it is Odd.",
      pythonSolution: `# Python Solution
def check_even_or_odd(n):
    if n % 2 == 0:
        return "Even"
    else:
        return "Odd"

# Example execution:
print(check_even_or_odd(42)) # Output: Even
print(check_even_or_odd(17)) # Output: Odd`,
      cSolution: `/* C Solution */
#include <stdio.h>

const char* check_even_or_odd(int n) {
    if (n % 2 == 0) {
        return "Even";
    } else {
        return "Odd";
    }
}

int main(void) {
    printf("%s\\n", check_even_or_odd(42)); // Even
    printf("%s\\n", check_even_or_odd(17)); // Odd
    return 0;
}`
    },
    {
      id: "ch-04",
      title: "4. Find the Largest of Two Numbers",
      difficulty: "Easy",
      category: "Conditionals",
      xpReward: 30,
      problemStatement: "Given two numbers X and Y, determine and print the larger value. If both are equal, print either.",
      inputFormat: "Two integers X and Y.",
      outputFormat: "Print the larger number.",
      sampleCases: [
        { input: "10 25", output: "25", explanation: "25 is greater than 10." },
        { input: "-5 -15", output: "-5", explanation: "-5 is greater than -15." }
      ],
      hint: "Use a simple conditional if statement (X > Y) or built-in ternary / max operations.",
      algorithmExplanation: "Compare X and Y using the greater-than relational operator. If X > Y, the answer is X; otherwise the answer is Y.",
      pythonSolution: `# Python Solution
def find_largest(x, y):
    if x > y:
        return x
    return y

# Or using Python built-in:
# return max(x, y)

print(find_largest(10, 25))   # Output: 25
print(find_largest(-5, -15))  # Output: -5`,
      cSolution: `/* C Solution */
#include <stdio.h>

int find_largest(int x, int y) {
    if (x > y) {
        return x;
    }
    return y;
}

int main(void) {
    printf("%d\\n", find_largest(10, 25));  // 25
    printf("%d\\n", find_largest(-5, -15)); // -5
    return 0;
}`
    },
    {
      id: "ch-05",
      title: "5. Calculate Factorial of a Number",
      difficulty: "Medium",
      category: "Loops & Math",
      xpReward: 30,
      problemStatement: "Given a non-negative integer N, calculate its factorial (N!). Note that 0! = 1.",
      inputFormat: "A single non-negative integer N (0 <= N <= 12).",
      outputFormat: "Print the factorial value N!.",
      sampleCases: [
        { input: "5", output: "120", explanation: "5! = 5 * 4 * 3 * 2 * 1 = 120" },
        { input: "0", output: "1", explanation: "By mathematical definition, 0! = 1" }
      ],
      hint: "Initialize a product variable to 1, then multiply it sequentially by every number from 1 to N in a loop.",
      algorithmExplanation: "Factorial of N is the product of all positive integers less than or equal to N. Use an accumulator variable initialized to 1. Loop from 1 up to N, multiplying the accumulator by each integer. Return the accumulated product.",
      pythonSolution: `# Python Solution
def calculate_factorial(n):
    if n < 0:
        raise ValueError("Factorial undefined for negative numbers.")
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(calculate_factorial(5)) # Output: 120
print(calculate_factorial(0)) # Output: 1`,
      cSolution: `/* C Solution */
#include <stdio.h>

long long calculate_factorial(int n) {
    if (n < 0) return -1; // Error condition
    long long result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main(void) {
    printf("%lld\\n", calculate_factorial(5)); // 120
    printf("%lld\\n", calculate_factorial(0)); // 1
    return 0;
}`
    },
    {
      id: "ch-06",
      title: "6. Reverse a String",
      difficulty: "Medium",
      category: "Strings",
      xpReward: 30,
      problemStatement: "Given an input string S, return the string in reverse order.",
      inputFormat: "A single line containing string S.",
      outputFormat: "Print the reversed string.",
      sampleCases: [
        { input: "CodeQuest", output: "tseuQedoC", explanation: "Characters are reversed from end to start." },
        { input: "level", output: "level", explanation: "'level' is a palindrome, so its reverse is identical." }
      ],
      hint: "In Python you can use string slicing [::-1]. In C, swap characters from both ends toward the middle using two pointers/indices.",
      algorithmExplanation: "Two-pointer approach: Set pointer L at index 0 and R at index length-1. Swap characters at L and R, increment L, and decrement R until L >= R.",
      pythonSolution: `# Python Solution
def reverse_string(s):
    # Slice idiom: [start:stop:step]
    return s[::-1]

print(reverse_string("CodeQuest")) # Output: tseuQedoC
print(reverse_string("level"))     # Output: level`,
      cSolution: `/* C Solution */
#include <stdio.h>
#include <string.h>

void reverse_string(char str[]) {
    int left = 0;
    int right = strlen(str) - 1;
    
    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}

int main(void) {
    char word[] = "CodeQuest";
    reverse_string(word);
    printf("%s\\n", word); // tseuQedoC
    return 0;
}`
    },
    {
      id: "ch-07",
      title: "7. Sum of Digits of a Number",
      difficulty: "Medium",
      category: "Math & Loops",
      xpReward: 30,
      problemStatement: "Given a positive integer N, calculate the sum of all its decimal digits.",
      inputFormat: "A single positive integer N.",
      outputFormat: "Print the sum of all digits in N.",
      sampleCases: [
        { input: "1234", output: "10", explanation: "1 + 2 + 3 + 4 = 10" },
        { input: "905", output: "14", explanation: "9 + 0 + 5 = 14" }
      ],
      hint: "Extract the last digit using N % 10, then remove it using integer division N // 10 (or N / 10 in C) in a loop until N becomes 0.",
      algorithmExplanation: "While N > 0: extract the lowest digit (N % 10) and add to sum. Update N = N / 10 to discard the extracted digit. Repeat until N is zero.",
      pythonSolution: `# Python Solution
def sum_of_digits(n):
    total = 0
    num = abs(n)
    while num > 0:
        total += num % 10
        num //= 10
    return total

print(sum_of_digits(1234)) # Output: 10
print(sum_of_digits(905))  # Output: 14`,
      cSolution: `/* C Solution */
#include <stdio.h>
#include <stdlib.h>

int sum_of_digits(int n) {
    int total = 0;
    int num = abs(n);
    while (num > 0) {
        total += num % 10;
        num /= 10;
    }
    return total;
}

int main(void) {
    printf("%d\\n", sum_of_digits(1234)); // 10
    printf("%d\\n", sum_of_digits(905));  // 14
    return 0;
}`
    },
    {
      id: "ch-08",
      title: "8. Check Prime Number",
      difficulty: "Medium",
      category: "Algorithms",
      xpReward: 30,
      problemStatement: "Given an integer N > 1, determine whether N is a Prime number (divisible only by 1 and itself).",
      inputFormat: "A single integer N.",
      outputFormat: "Print 'True' (or 'Prime') if N is prime; otherwise print 'False' (or 'Not Prime').",
      sampleCases: [
        { input: "29", output: "Prime", explanation: "29 has no divisors other than 1 and 29." },
        { input: "15", output: "Not Prime", explanation: "15 is divisible by 3 and 5." }
      ],
      hint: "Numbers less than or equal to 1 are not prime. Test divisors from 2 up to the square root of N.",
      algorithmExplanation: "If N <= 1, return False. 2 is prime. If N is even, return False. For odd numbers, check if any divisor d from 3 up to sqrt(N) divides N evenly. If none do, N is prime.",
      pythonSolution: `# Python Solution
import math

def is_prime(n):
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # Check odd divisors up to sqrt(n)
    limit = int(math.isqrt(n))
    for d in range(3, limit + 1, 2):
        if n % d == 0:
            return False
    return True

print("29 is:", "Prime" if is_prime(29) else "Not Prime")
print("15 is:", "Prime" if is_prime(15) else "Not Prime")`,
      cSolution: `/* C Solution */
#include <stdio.h>
#include <stdbool.h>

bool is_prime(int n) {
    if (n <= 1) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;

    for (int d = 3; d * d <= n; d += 2) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

int main(void) {
    printf("29: %s\\n", is_prime(29) ? "Prime" : "Not Prime");
    printf("15: %s\\n", is_prime(15) ? "Prime" : "Not Prime");
    return 0;
}`
    },
    {
      id: "ch-09",
      title: "9. Multiplication Table Generator",
      difficulty: "Easy",
      category: "Loops",
      xpReward: 30,
      problemStatement: "Given an integer N and a range count K, print the first K multiples of N formatted as 'N x i = Result'.",
      inputFormat: "Two integers N and K.",
      outputFormat: "K lines showing each multiplication step from 1 to K.",
      sampleCases: [
        { input: "7 3", output: "7 x 1 = 7\\n7 x 2 = 14\\n7 x 3 = 21", explanation: "First 3 multiples of 7." }
      ],
      hint: "Use a simple for loop from 1 through K.",
      algorithmExplanation: "Loop variable i from 1 to K. In each iteration, multiply N by i and print the formatted string.",
      pythonSolution: `# Python Solution
def generate_table(n, k):
    lines = []
    for i in range(1, k + 1):
        lines.append(f"{n} x {i} = {n * i}")
    return "\\n".join(lines)

print(generate_table(7, 3))`,
      cSolution: `/* C Solution */
#include <stdio.h>

void generate_table(int n, int k) {
    for (int i = 1; i <= k; i++) {
        printf("%d x %d = %d\\n", n, i, n * i);
    }
}

int main(void) {
    generate_table(7, 3);
    return 0;
}`
    },
    {
      id: "ch-10",
      title: "10. Maximum Element in an Array / List",
      difficulty: "Medium",
      category: "Arrays",
      xpReward: 30,
      problemStatement: "Given a non-empty list/array of numbers, iterate through the collection and find the maximum value without using built-in max functions.",
      inputFormat: "An array of integers.",
      outputFormat: "Print the maximum integer value.",
      sampleCases: [
        { input: "[14, 28, 5, 92, 43]", output: "92", explanation: "92 is the largest value in the collection." },
        { input: "[-10, -50, -3, -8]", output: "-3", explanation: "-3 is greater than the other negative numbers." }
      ],
      hint: "Initialize max_val with the first element arr[0]. Traverse from index 1 to the end, updating max_val whenever an element is greater.",
      algorithmExplanation: "Linear Scan Algorithm: Set max_val = arr[0]. Iterate each subsequent element x in arr. If x > max_val, update max_val = x. After traversing all elements, max_val is guaranteed to be the maximum.",
      pythonSolution: `# Python Solution
def find_maximum(nums):
    if not nums:
        raise ValueError("List cannot be empty.")
    
    max_val = nums[0]
    for num in nums[1:]:
        if num > max_val:
            max_val = num
    return max_val

print(find_maximum([14, 28, 5, 92, 43])) # Output: 92
print(find_maximum([-10, -50, -3, -8]))   # Output: -3`,
      cSolution: `/* C Solution */
#include <stdio.h>

int find_maximum(const int arr[], int size) {
    int max_val = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max_val) {
            max_val = arr[i];
        }
    }
    return max_val;
}

int main(void) {
    int numbers[] = {14, 28, 5, 92, 43};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    printf("Maximum: %d\\n", find_maximum(numbers, size)); // 92
    return 0;
}`
    }
  ],

  // ==========================================
  // ACHIEVEMENTS (Badges with Criteria)
  // ==========================================
  achievements: [
    {
      id: "first_steps",
      title: "First Steps",
      description: "Complete your first programming lesson.",
      icon: "footsteps",
      criteriaType: "lessons_count",
      threshold: 1
    },
    {
      id: "quiz_starter",
      title: "Quiz Starter",
      description: "Finish your first interactive knowledge quiz.",
      icon: "trophy",
      criteriaType: "quizzes_count",
      threshold: 1
    },
    {
      id: "perfect_score",
      title: "Perfect Score",
      description: "Achieve 100% on any interactive quiz.",
      icon: "star",
      criteriaType: "quiz_perfect",
      threshold: 1
    },
    {
      id: "problem_solver",
      title: "Problem Solver",
      description: "Solve your first coding challenge.",
      icon: "puzzle",
      criteriaType: "challenges_count",
      threshold: 1
    },
    {
      id: "knowledge_seeker",
      title: "Knowledge Seeker",
      description: "Complete five programming lessons across any track.",
      icon: "book-open",
      criteriaType: "lessons_count",
      threshold: 5
    },
    {
      id: "dedicated_learner",
      title: "Dedicated Learner",
      description: "Complete ten programming lessons.",
      icon: "crown",
      criteriaType: "lessons_count",
      threshold: 10
    },
    {
      id: "week_explorer",
      title: "Week Explorer",
      description: "Log active learning on 7 distinct calendar dates.",
      icon: "calendar",
      criteriaType: "distinct_dates",
      threshold: 7
    },
    {
      id: "xp_collector",
      title: "XP Collector",
      description: "Earn 250 total lifetime Experience Points (XP).",
      icon: "zap",
      criteriaType: "total_xp",
      threshold: 250
    },
    {
      id: "python_pioneer",
      title: "Python Pioneer",
      description: "Complete at least 4 Python curriculum lessons.",
      icon: "code",
      criteriaType: "python_lessons_count",
      threshold: 4
    },
    {
      id: "c_vanguard",
      title: "C Vanguard",
      description: "Complete at least 4 C curriculum lessons.",
      icon: "shield",
      criteriaType: "c_lessons_count",
      threshold: 4
    }
  ],

  // ==========================================
  // DEMO LEADERBOARD PROFILES
  // ==========================================
  leaderboardProfiles: [
    { id: "peer_1", name: "Sarah Chen", avatar: "SC", xp: 520, level: 4, title: "Algorithm Explorer", badge: "Gold" },
    { id: "peer_2", name: "Alex Rivera", avatar: "AR", xp: 380, level: 3, title: "Logic Crafter", badge: "Silver" },
    { id: "peer_3", name: "Priya Patel", avatar: "PP", xp: 260, level: 3, title: "Logic Crafter", badge: "Silver" },
    { id: "peer_4", name: "Marcus Vance", avatar: "MV", xp: 190, level: 2, title: "Syntax Apprentice", badge: "Bronze" },
    { id: "peer_5", name: "Liam O'Connor", avatar: "LO", xp: 130, level: 2, title: "Syntax Apprentice", badge: "Bronze" },
    { id: "peer_6", name: "Maya Lin", avatar: "ML", xp: 80, level: 1, title: "Novice Coder", badge: "Iron" }
  ]
};

// Export to window for browser access
if (typeof window !== "undefined") {
  window.CQ_DATA = CQ_DATA;
}
