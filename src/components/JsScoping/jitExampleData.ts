import { v4 as uuidv4 } from 'uuid';
import type { JitExample, AstNode } from './types';

// Helper to create a simple AST structure
function createAst(code: string): { ast: Record<string, AstNode>, rootNodeId: string } {
  // This is a very simplified AST builder for visualization purposes
  const programId = uuidv4();
  const ast: Record<string, AstNode> = {};
  
  // Create program node (root)
  ast[programId] = {
    id: programId,
    type: 'Program',
    children: []
  };
  
  // Split the code into lines for simplified parsing
  const lines = code.split('\n').filter(line => line.trim() !== '');
  
  // Process each line
  lines.forEach(line => {
    const nodeId = uuidv4();
    let type = 'Expression';
    let value = line.trim();
    
    // Very simple detection of common node types
    if (line.includes('function')) {
      type = 'FunctionDeclaration';
      // Extract function name
      const match = line.match(/function\s+([a-zA-Z0-9_]+)/);
      value = match ? match[1] : 'anonymous';
    } else if (line.includes('var ') || line.includes('let ') || line.includes('const ')) {
      type = 'VariableDeclaration';
      // Extract variable name
      const match = line.match(/(var|let|const)\s+([a-zA-Z0-9_]+)/);
      value = match ? match[2] : 'unknown';
    } else if (line.includes('if ')) {
      type = 'IfStatement';
    } else if (line.includes('for ')) {
      type = 'ForStatement';
    } else if (line.includes('while ')) {
      type = 'WhileStatement';
    } else if (line.includes('return ')) {
      type = 'ReturnStatement';
    }
    
    // Create node and add to the AST
    ast[nodeId] = {
      id: nodeId,
      type,
      value,
    };
    
    // Add as child to program node
    if (ast[programId].children) {
      ast[programId].children.push(nodeId);
    }
  });
  
  return { ast, rootNodeId: programId };
}

// JIT Compilation Examples
export const jitExamples: JitExample[] = [
  {
    id: 'simple-function-jit',
    title: 'Simple Function JIT',
    description: 'Shows how a simple function gets JIT compiled through various stages.',
    code: `// A function that calculates factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// First call - interpreted
console.log(factorial(5));

// Multiple calls - triggers compilation
for (let i = 0; i < 10000; i++) {
  factorial(10);
}

// Using with different types - may cause deoptimization
console.log(factorial("20"));`,
    steps: [
      // Parsing step
      {
        lineNumber: 1,
        compilationState: {
          stage: 'parsing',
          ...createAst(`function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: [],
          profiledHotspots: []
        },
        description: 'JavaScript engine parses the code into an Abstract Syntax Tree (AST). This is the first step in the compilation pipeline.'
      },
      // First execution - interpreted
      {
        lineNumber: 7,
        compilationState: {
          stage: 'execution',
          ...createAst(`function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'factorial', executionCount: 1 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false }
        ],
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                { id: 'v1', name: 'factorial', value: 'function', type: 'function' }
              ],
              isActive: true
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        },
        description: 'First function call is executed in the interpreter. The JavaScript engine evaluates the code without compilation.'
      },
      // Many calls - profiling
      {
        lineNumber: 10,
        compilationState: {
          stage: 'baseline-compilation',
          ...createAst(`function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'factorial', executionCount: 25 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'factorial(10)', isOptimized: false }
        ],
        description: 'After multiple calls, the function is identified as "hot" and sent for baseline compilation. The JIT compiler generates unoptimized machine code.'
      },
      // Optimization
      {
        lineNumber: 11,
        compilationState: {
          stage: 'optimization',
          ...createAst(`function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
          }`),
          optimizedFunctions: ['factorial'],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'factorial', executionCount: 5000 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'factorial(10)', isOptimized: true }
        ],
        description: 'After many iterations, the function is optimized. The JIT compiler makes assumptions (e.g., n is always a number) and generates highly optimized machine code.'
      },
      // Deoptimization
      {
        lineNumber: 14,
        compilationState: {
          stage: 'deoptimization',
          ...createAst(`function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: ['factorial'],
          profiledHotspots: [
            { functionName: 'factorial', executionCount: 10001 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'factorial("20")', isOptimized: false }
        ],
        description: 'When factorial is called with a string instead of a number, the optimization assumptions are invalidated. The function is "deoptimized" and falls back to slower code.'
      }
    ]
  },
  {
    id: 'integrated-execution',
    title: 'Full Pipeline Visualization',
    description: 'Shows the complete execution pipeline with event loop, scope chain, and JIT compilation.',
    code: `// Define a function that will be optimized
function processData(data) {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result += data[i];
  }
  return result;
}

// Event loop demonstration with setTimeout
console.log("Start");

// This will be compiled after multiple calls
const data = [1, 2, 3, 4, 5];
for (let i = 0; i < 1000; i++) {
  processData(data);
}

// Add a task to the event queue
setTimeout(() => {
  console.log("Timeout callback");
  // Using different data type causes deoptimization
  processData("12345");
}, 0);

// Add a microtask
Promise.resolve().then(() => {
  console.log("Promise resolved");
});

console.log("End");`,
    steps: [
      // Initial parsing
      {
        lineNumber: 1,
        compilationState: {
          stage: 'parsing',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: [],
          profiledHotspots: []
        },
        description: 'The JavaScript engine parses the entire program and creates an AST representation.'
      },
      // Start execution
      {
        lineNumber: 10,
        compilationState: {
          stage: 'execution',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: [],
          profiledHotspots: []
        },
        callStack: [
          { name: 'Global Context', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: [],
          microtaskQueue: []
        },
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                { id: 'v1', name: 'processData', value: 'function', type: 'function' }
              ],
              isActive: true
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        },
        description: 'Execution begins in the global context. The console.log("Start") statement is executed.'
      },
      // Multiple calls trigger baseline compilation
      {
        lineNumber: 14,
        compilationState: {
          stage: 'baseline-compilation',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 50 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'processData([1,2,3,4,5])', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: [],
          microtaskQueue: []
        },
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                { id: 'v1', name: 'processData', value: 'function', type: 'function' },
                { id: 'v2', name: 'data', value: '[1,2,3,4,5]', type: 'const' },
                { id: 'v3', name: 'i', value: '50', type: 'let' }
              ],
              isActive: true
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        },
        description: 'After multiple calls, the processData function is identified as "hot" and sent to the baseline compiler.'
      },
      // Optimization
      {
        lineNumber: 14,
        compilationState: {
          stage: 'optimization',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: ['processData'],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 500 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'processData([1,2,3,4,5])', isOptimized: true }
        ],
        eventLoop: {
          taskQueue: [],
          microtaskQueue: []
        },
        description: 'The JIT compiler optimizes the processData function with type specialization assuming data is always an array of numbers.'
      },
      // setTimeout registers a callback
      {
        lineNumber: 18,
        compilationState: {
          stage: 'execution',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: ['processData'],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 1000 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: ['setTimeout callback'],
          microtaskQueue: []
        },
        description: 'setTimeout registers a callback that will be executed later. The callback is placed in the task queue.'
      },
      // Promise creates a microtask
      {
        lineNumber: 24,
        compilationState: {
          stage: 'execution',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: ['processData'],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 1000 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: ['setTimeout callback'],
          microtaskQueue: ['Promise.then callback']
        },
        description: 'Promise.resolve().then() creates a microtask that will run after the current synchronous code but before the next task.'
      },
      // Main code finishes
      {
        lineNumber: 28,
        compilationState: {
          stage: 'execution',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: ['processData'],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 1000 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: ['setTimeout callback'],
          microtaskQueue: ['Promise.then callback']
        },
        description: 'Main synchronous code finishes with console.log("End"). Now the event loop will check for microtasks before moving to the task queue.'
      },
      // Process microtask
      {
        lineNumber: 25,
        compilationState: {
          stage: 'execution',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: ['processData'],
          deoptimizedFunctions: [],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 1000 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'Promise.then callback', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: ['setTimeout callback'],
          microtaskQueue: []
        },
        description: 'The event loop processes the microtask queue first. The Promise.then callback executes, logging "Promise resolved".'
      },
      // Process task queue (setTimeout) and cause deoptimization
      {
        lineNumber: 20,
        compilationState: {
          stage: 'deoptimization',
          ...createAst(`function processData(data) {
            let result = 0;
            for (let i = 0; i < data.length; i++) {
              result += data[i];
            }
            return result;
          }`),
          optimizedFunctions: [],
          deoptimizedFunctions: ['processData'],
          profiledHotspots: [
            { functionName: 'processData', executionCount: 1001 }
          ]
        },
        callStack: [
          { name: 'Global Context', isOptimized: false },
          { name: 'setTimeout callback', isOptimized: false },
          { name: 'processData("12345")', isOptimized: false }
        ],
        eventLoop: {
          taskQueue: [],
          microtaskQueue: []
        },
        description: 'The setTimeout callback runs and calls processData with a string instead of an array. This violates the optimization assumptions and triggers deoptimization.'
      }
    ]
  }
]; 