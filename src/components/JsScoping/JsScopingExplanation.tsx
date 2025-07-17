import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './JsScoping.css'
import { ScopingFeature } from './types'

const JsScopingExplanation = () => {
  const [activeSection, setActiveSection] = useState<ScopingFeature | 'jit-compilation'>(ScopingFeature.LEXICAL_SCOPE)

  return (
    <div className="js-scoping-explanation">
      <div className="section-tabs">
        <button 
          className={activeSection === ScopingFeature.LEXICAL_SCOPE ? 'active' : ''}
          onClick={() => setActiveSection(ScopingFeature.LEXICAL_SCOPE)}
        >
          Lexical Scope
        </button>
        <button 
          className={activeSection === ScopingFeature.CLOSURES ? 'active' : ''}
          onClick={() => setActiveSection(ScopingFeature.CLOSURES)}
        >
          Closures
        </button>
        <button 
          className={activeSection === ScopingFeature.HOISTING ? 'active' : ''}
          onClick={() => setActiveSection(ScopingFeature.HOISTING)}
        >
          Hoisting
        </button>
        <button 
          className={activeSection === ScopingFeature.THIS_BINDING ? 'active' : ''}
          onClick={() => setActiveSection(ScopingFeature.THIS_BINDING)}
        >
          This Binding
        </button>
        <button 
          className={activeSection === ScopingFeature.MODULE_SCOPE ? 'active' : ''}
          onClick={() => setActiveSection(ScopingFeature.MODULE_SCOPE)}
        >
          Module Scope
        </button>
        <button 
          className={activeSection === 'jit-compilation' ? 'active' : ''}
          onClick={() => setActiveSection('jit-compilation')}
        >
          JIT Compilation
        </button>
      </div>

      <div className="section-content">
        {activeSection === ScopingFeature.LEXICAL_SCOPE && (
          <div className="section">
            <h2>Lexical Scope</h2>
            <p>
              Lexical scope (also called static scope) refers to how variable access is determined by the position of variables in the source code. In JavaScript, 
              inner functions have access to variables in their outer scope.
            </p>
            <div className="code-example">
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// Global scope
const globalVar = "I'm global";

function outerFunction() {
  // outerFunction scope
  const outerVar = "I'm from outer";
  
  function innerFunction() {
    // innerFunction scope
    const innerVar = "I'm from inner";
    
    console.log(innerVar);  // Own scope
    console.log(outerVar);  // Parent scope
    console.log(globalVar); // Global scope
  }
  
  innerFunction();
  
  console.log(outerVar);   // Own scope
  console.log(globalVar);  // Global scope
  // console.log(innerVar); // Error: innerVar is not defined
}`}
              </SyntaxHighlighter>
            </div>
            <div className="key-points">
              <h3>Key Points</h3>
              <ul>
                <li>Inner functions have access to variables in their outer scopes.</li>
                <li>Outer functions do not have access to variables in their inner scopes.</li>
                <li>When a variable is referenced, JavaScript looks for it in the current scope, then in the outer scope, and so on until it reaches the global scope.</li>
                <li>This is called the "scope chain" - a series of nested scopes that are searched when looking up variables.</li>
                <li>The scope chain is determined statically (at "compile" time) based on where functions and blocks are defined in the code.</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeSection === ScopingFeature.CLOSURES && (
          <div className="section">
            <h2>Closures</h2>
            <p>
              Closures are a powerful feature in JavaScript that allows functions to retain access to variables from their containing (enclosing) scope 
              even after the parent function has finished execution.
            </p>
            <div className="code-example">
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`function createCounter() {
  let count = 0;  // This variable is enclosed in the closure
  
  return function increment() {
    count++;  // Accessing variable from parent scope
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each call to createCounter creates a new closure with its own count variable
const counter2 = createCounter();
console.log(counter2()); // 1
console.log(counter()); // 4 (this is using the first counter)`}
              </SyntaxHighlighter>
            </div>
            <div className="key-points">
              <h3>Key Points</h3>
              <ul>
                <li>A closure is created when a function is defined within another function and the inner function references variables from the outer function.</li>
                <li>When the inner function is returned and later executed outside of its original scope, it still maintains access to the variables it closed over.</li>
                <li>Each closure has its own "snapshot" of the variables it references from outer scopes.</li>
                <li>Common use cases for closures include data privacy, function factories, and maintaining state in async operations.</li>
                <li>Closures are widely used in JavaScript patterns like module pattern, currying, and memoization.</li>
              </ul>
            </div>
            <div className="code-example">
              <h3>Practical Example: Data Privacy</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`function createBankAccount(initialBalance) {
  // Private variable - not accessible directly from outside
  let balance = initialBalance;
  
  // Return an object with methods that have access to the private variable
  return {
    deposit: function(amount) {
      if (amount > 0) {
        balance += amount;
        return \`Deposited \${amount}. New balance: \${balance}\`;
      }
      return "Invalid deposit amount";
    },
    withdraw: function(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return \`Withdrew \${amount}. New balance: \${balance}\`;
      }
      return "Invalid withdrawal amount or insufficient funds";
    },
    getBalance: function() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
console.log(account.deposit(50));  // Deposited 50. New balance: 150
console.log(account.withdraw(25)); // Withdrew 25. New balance: 125

// The 'balance' variable is not directly accessible
// console.log(account.balance); // undefined`}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
        
        {activeSection === ScopingFeature.HOISTING && (
          <div className="section">
            <h2>Hoisting</h2>
            <p>
              Hoisting is JavaScript's default behavior of moving declarations to the top of their scope during the compilation phase, 
              before code execution. This means that variables and functions can be referenced before they are declared in the code.
            </p>
            <div className="code-example">
              <h3>Variable Hoisting</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`console.log(varVariable); // undefined (declaration is hoisted, but not the assignment)
console.log(letVariable); // ReferenceError: Cannot access 'letVariable' before initialization
console.log(constVariable); // ReferenceError: Cannot access 'constVariable' before initialization

var varVariable = "I'm a var";
let letVariable = "I'm a let";
const constVariable = "I'm a const";`}
              </SyntaxHighlighter>
            </div>
            <div className="code-example">
              <h3>Function Hoisting</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// Function declaration - fully hoisted
console.log(functionDeclaration()); // "I'm a function declaration"

// Function expression - only the variable declaration is hoisted, not the assignment
console.log(functionExpression()); // TypeError: functionExpression is not a function

function functionDeclaration() {
  return "I'm a function declaration";
}

var functionExpression = function() {
  return "I'm a function expression";
};`}
              </SyntaxHighlighter>
            </div>
            <div className="key-points">
              <h3>Key Points</h3>
              <ul>
                <li><code>var</code> declarations are hoisted and initialized with <code>undefined</code></li>
                <li><code>let</code> and <code>const</code> declarations are hoisted but not initialized (they're in the "temporal dead zone" until the actual declaration line)</li>
                <li>Function declarations are fully hoisted with their implementation</li>
                <li>Function expressions and arrow functions are not hoisted (or only their variable declaration is hoisted if using <code>var</code>)</li>
                <li>Class declarations and expressions are not hoisted</li>
                <li>Understanding hoisting is essential for avoiding unexpected behavior in your code</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeSection === ScopingFeature.THIS_BINDING && (
          <div className="section">
            <h2>This Binding</h2>
            <p>
              In JavaScript, <code>this</code> is a special keyword that refers to the context within which a function is executed. 
              Unlike other programming languages, the value of <code>this</code> is not determined by how a function is defined, but 
              by how it is called.
            </p>
            <div className="code-example">
              <h3>Global Context</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`console.log(this); // Window object (in browser) or global object (in Node.js)

function globalFunction() {
  console.log(this);
}

globalFunction(); // Window object (in browser) or global object (in Node.js)`}
              </SyntaxHighlighter>
            </div>
            <div className="code-example">
              <h3>Object Method Context</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`const user = {
  name: "Alice",
  greet: function() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
};

user.greet(); // "Hello, I'm Alice" - 'this' refers to the user object`}
              </SyntaxHighlighter>
            </div>
            <div className="code-example">
              <h3>Constructor Context</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`function User(name) {
  this.name = name;
  this.sayHello = function() {
    console.log(\`Hello, I'm \${this.name}\`);
  };
}

const alice = new User("Alice");
alice.sayHello(); // "Hello, I'm Alice" - 'this' refers to the alice instance`}
              </SyntaxHighlighter>
            </div>
            <div className="code-example">
              <h3>Event Handler Context</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`const button = document.querySelector('button');

button.addEventListener('click', function() {
  console.log(this); // The button element that was clicked
});`}
              </SyntaxHighlighter>
            </div>
            <div className="code-example">
              <h3>Arrow Functions</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`const user = {
  name: "Alice",
  // Regular function - 'this' is determined by how the function is called
  greetRegular: function() {
    console.log(\`Regular function: \${this.name}\`);
    
    setTimeout(function() {
      // 'this' refers to the window/global object, not the user object
      console.log(\`Regular function in setTimeout: \${this.name}\`);
    }, 100);
  },
  
  // Arrow function - 'this' is lexically bound to the surrounding scope
  greetArrow: function() {
    console.log(\`Outer function: \${this.name}\`);
    
    setTimeout(() => {
      // 'this' still refers to the user object
      console.log(\`Arrow function in setTimeout: \${this.name}\`);
    }, 100);
  }
};

user.greetRegular();
// "Regular function: Alice"
// "Regular function in setTimeout: " (empty because window.name is empty)

user.greetArrow();
// "Outer function: Alice"
// "Arrow function in setTimeout: Alice"`}
              </SyntaxHighlighter>
            </div>
            <div className="key-points">
              <h3>Key Points</h3>
              <ul>
                <li>The value of <code>this</code> depends on how a function is called, not where it is defined</li>
                <li>In the global context or a regular function call, <code>this</code> refers to the global object (window in browsers)</li>
                <li>In strict mode, <code>this</code> is <code>undefined</code> in regular function calls</li>
                <li>When a function is called as an object method, <code>this</code> refers to the object</li>
                <li>In constructors (functions called with <code>new</code>), <code>this</code> refers to the newly created instance</li>
                <li>Arrow functions do not have their own <code>this</code> binding; they inherit <code>this</code> from the enclosing scope</li>
                <li>The <code>call()</code>, <code>apply()</code>, and <code>bind()</code> methods can be used to explicitly set the value of <code>this</code></li>
              </ul>
            </div>
            <div className="code-example">
              <h3>Changing 'this' Context</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`function introduce(greeting, punctuation) {
  console.log(\`\${greeting}, I'm \${this.name}\${punctuation}\`);
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

// call() - passes arguments individually
introduce.call(alice, "Hello", "!");  // "Hello, I'm Alice!"

// apply() - passes arguments as an array
introduce.apply(bob, ["Hi", "."]);   // "Hi, I'm Bob."

// bind() - creates a new function with 'this' permanently bound
const greetAlice = introduce.bind(alice);
greetAlice("Hey", "..."); // "Hey, I'm Alice..."`}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
        
        {activeSection === ScopingFeature.MODULE_SCOPE && (
          <div className="section">
            <h2>Module Scope</h2>
            <p>
              ES6 modules provide a way to encapsulate code into reusable, self-contained units with their own scope. 
              Variables, functions, and classes defined in a module are not automatically available in other modules unless 
              explicitly exported and imported.
            </p>
            <div className="code-example">
              <h3>Exporting from a Module</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// math.js
// Private to the module (not exported)
const PI = 3.14159;

// Named exports
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Default export
export default function calculate(operation, a, b) {
  switch(operation) {
    case 'add': return add(a, b);
    case 'multiply': return multiply(a, b);
    default: throw new Error('Unknown operation');
  }
}`}
              </SyntaxHighlighter>
            </div>
            <div className="code-example">
              <h3>Importing into a Module</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// app.js
// Import default export
import calculate from './math.js';

// Import named exports
import { add, multiply } from './math.js';

// Import default and named exports
import calc, { add as addition } from './math.js';

console.log(add(2, 3));         // 5
console.log(multiply(4, 5));    // 20
console.log(calculate('add', 5, 7)); // 12
console.log(addition(10, 20));  // 30

// PI is not accessible
// console.log(PI); // ReferenceError: PI is not defined`}
              </SyntaxHighlighter>
            </div>
            <div className="key-points">
              <h3>Key Points</h3>
              <ul>
                <li>Each module has its own scope, independent from other modules</li>
                <li>Variables defined in a module are local to that module by default</li>
                <li>To share code between modules, you must explicitly export and import</li>
                <li>Modules use lexical scope for their top-level declarations</li>
                <li>Modules are executed in strict mode by default</li>
                <li>Modules are executed only once, when they are first imported</li>
                <li>Cyclic dependencies between modules are supported</li>
              </ul>
            </div>
            <div className="code-example">
              <h3>Module Patterns</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// Revealing Module Pattern (pre-ES6)
const counterModule = (function() {
  // Private variables
  let count = 0;
  
  // Private function
  function reset() {
    count = 0;
    return count;
  }
  
  // Public API
  return {
    increment: function() {
      return ++count;
    },
    decrement: function() {
      return --count;
    },
    getValue: function() {
      return count;
    },
    reset: reset
  };
})();

console.log(counterModule.increment()); // 1
console.log(counterModule.increment()); // 2
console.log(counterModule.getValue());  // 2
console.log(counterModule.reset());     // 0
// console.log(count); // ReferenceError: count is not defined`}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
        
        {activeSection === 'jit-compilation' && (
          <div className="section">
            <h2>JavaScript JIT Compilation</h2>
            <p>
              Just-In-Time (JIT) compilation is a technique used by modern JavaScript engines to improve performance. Unlike traditional interpreters 
              that execute code line-by-line or traditional compilers that compile all code ahead of time, JIT compilers use a hybrid approach to 
              dynamically optimize code during execution.
            </p>
            
            <div className="key-points">
              <h3>Key Components of the JIT Process</h3>
              <ul>
                <li><strong>Parser</strong>: Converts JavaScript source code into an Abstract Syntax Tree (AST)</li>
                <li><strong>Interpreter</strong>: Executes code directly from the AST for quick startup</li>
                <li><strong>Profiler</strong>: Monitors code execution to identify "hot" code paths that run frequently</li>
                <li><strong>Baseline Compiler</strong>: Compiles frequently executed code into somewhat optimized machine code</li>
                <li><strong>Optimizing Compiler</strong>: Aggressively optimizes "hot" code with type specialization and other optimizations</li>
                <li><strong>Deoptimizer</strong>: Reverts to less-optimized code when assumptions are invalidated</li>
              </ul>
            </div>
            
            <div className="code-example">
              <h3>The JIT Compilation Process</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// This function will go through the JIT compilation process
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// First execution - interpreted
calculateSum([1, 2, 3]); // Interpreted execution

// Multiple calls with similar data - becomes "hot", triggers baseline compilation
for (let i = 0; i < 100; i++) {
  calculateSum([i, i+1, i+2]); // Eventually compiled
}

// More calls with consistent types - triggers optimization
for (let i = 0; i < 10000; i++) {
  calculateSum([5, 10, 15]); // Optimized execution (assumes array of numbers)
}

// Call with different data type - triggers deoptimization
calculateSum(["1", "2", "3"]); // Deoptimized (assumption about number types invalidated)`}
              </SyntaxHighlighter>
            </div>
            
            <h3>The JIT Compilation Pipeline</h3>
            
            <div className="stage-description">
              <h4>1. Parsing</h4>
              <p>
                JavaScript source code is parsed into an Abstract Syntax Tree (AST), which is a tree representation 
                of the code's syntactic structure. This AST makes it easier for the engine to analyze and work with the code.
              </p>
            </div>
            
            <div className="stage-description">
              <h4>2. Baseline Interpretation</h4>
              <p>
                Code is first executed by an interpreter for quick startup. The interpreter walks through the AST and executes 
                the code without any compilation. This allows the program to start running immediately without waiting for compilation.
              </p>
            </div>
            
            <div className="stage-description">
              <h4>3. Profiling and Baseline Compilation</h4>
              <p>
                As the code runs, the engine's profiler monitors execution to identify "hot" functions or loops that are executed frequently.
                These hot code paths are then compiled by the baseline compiler into somewhat optimized machine code, which runs faster than interpreted code.
              </p>
            </div>
            
            <div className="stage-description">
              <h4>4. Optimization</h4>
              <p>
                For code that is executed very frequently, the optimizing compiler kicks in to create highly optimized machine code.
                This optimization makes assumptions based on observed patterns, such as:
              </p>
              <ul>
                <li>Type specialization (assuming variables always hold the same type)</li>
                <li>Inlining function calls</li>
                <li>Loop unrolling</li>
                <li>Dead code elimination</li>
                <li>Constant folding</li>
              </ul>
            </div>
            
            <div className="stage-description">
              <h4>5. Deoptimization</h4>
              <p>
                If any of the assumptions made during optimization turn out to be invalid (e.g., a function previously only called with numbers 
                is now called with strings), the optimized code is abandoned, and execution falls back to the baseline compiled code or the interpreter.
                This process is called deoptimization.
              </p>
            </div>
            
            <div className="code-example">
              <h3>JIT in Action - Hidden Classes and Inline Caching</h3>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {`// Example of code that works well with JIT optimization
function Point(x, y) {
  this.x = x;
  this.y = y;
}

// These objects will share the same hidden class
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

// Functions using these objects can be highly optimized
function distance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx*dx + dy*dy);
}

// After multiple calls, this function will be optimized
for (let i = 0; i < 1000; i++) {
  distance(p1, p2);
}

// Example of code that breaks JIT optimization
function BadPoint(x, y) {
  // Different property initialization order creates different hidden classes
  if (x > 0) {
    this.x = x;
    this.y = y;
  } else {
    this.y = y;
    this.x = x;
  }
}

const p3 = new BadPoint(1, 2);  // One hidden class
const p4 = new BadPoint(-1, 2); // Different hidden class

// This will be harder to optimize due to different hidden classes
function badDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx*dx + dy*dy);
}

// Less optimization will happen here
for (let i = 0; i < 1000; i++) {
  badDistance(p3, p4);
}`}
              </SyntaxHighlighter>
            </div>
            
            <div className="key-points">
              <h3>JIT Optimization Tips</h3>
              <ul>
                <li>Keep object structures consistent (always add properties in the same order)</li>
                <li>Avoid changing the types of variables during execution</li>
                <li>Reuse functions for similar operations instead of creating new ones</li>
                <li>Use classes or constructor functions to create objects with consistent shapes</li>
                <li>Be aware that dynamically adding or removing object properties can deoptimize code</li>
                <li>Consider that very large functions may not be optimized as aggressively</li>
                <li>Remember that eval() and with() statements generally prevent optimization</li>
              </ul>
            </div>
            
            <div className="section-note">
              <h3>Integration with Other JavaScript Concepts</h3>
              <p>
                JIT compilation works alongside JavaScript's other execution mechanisms:
              </p>
              <ul>
                <li><strong>Lexical Scoping</strong>: JIT compilers use the lexical structure to optimize variable lookups in the scope chain</li>
                <li><strong>Closures</strong>: Modern JIT engines optimize closures to minimize the performance impact of capturing variables</li>
                <li><strong>Event Loop</strong>: JIT optimization happens in parallel with the event loop execution</li>
                <li><strong>Garbage Collection</strong>: JIT compilers work with the GC to track object lifetimes and optimize memory usage</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JsScopingExplanation 