import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './JsScoping.css';

// Types for our function execution visualizer
interface ExecutionContext {
  id: string;
  name: string;
  variables: {
    name: string;
    value: string;
    type: string;
  }[];
  isActive: boolean;
}

interface ExecutionStep {
  callStack: ExecutionContext[];
  currentLine: number;
  description: string;
}

interface ExecutionExample {
  id: string;
  name: string;
  code: string;
  steps: ExecutionStep[];
}

// Example data
const executionExamples: ExecutionExample[] = [
  {
    id: 'basic-function-calls',
    name: 'Basic Function Calls',
    code: `// Global scope
let globalVar = "I'm global";

function firstFunction(param) {
  // New execution context created
  let localVar = "I'm local";
  console.log(param);
  secondFunction(localVar);
  return "Done!";
}

function secondFunction(param) {
  // Another execution context created
  let anotherVar = "Another variable";
  console.log(param);
  console.log(globalVar);
  return param + " processed";
}

const result = firstFunction("Hello");
console.log(result);`,
    steps: [
      {
        callStack: [
          {
            id: 'global-1',
            name: 'Global Execution Context',
            variables: [
              { name: 'globalVar', value: '"I\'m global"', type: 'let' },
              { name: 'firstFunction', value: 'function', type: 'function' },
              { name: 'secondFunction', value: 'function', type: 'function' },
            ],
            isActive: true
          }
        ],
        currentLine: 1,
        description: 'Program starts in the global execution context.'
      },
      {
        callStack: [
          {
            id: 'global-1',
            name: 'Global Execution Context',
            variables: [
              { name: 'globalVar', value: '"I\'m global"', type: 'let' },
              { name: 'firstFunction', value: 'function', type: 'function' },
              { name: 'secondFunction', value: 'function', type: 'function' },
            ],
            isActive: false
          },
          {
            id: 'first-1',
            name: 'firstFunction Execution Context',
            variables: [
              { name: 'param', value: '"Hello"', type: 'parameter' },
              { name: 'localVar', value: '"I\'m local"', type: 'let' },
            ],
            isActive: true
          }
        ],
        currentLine: 6,
        description: 'firstFunction is called with "Hello" as argument. A new execution context is created and pushed onto the call stack.'
      },
      {
        callStack: [
          {
            id: 'global-1',
            name: 'Global Execution Context',
            variables: [
              { name: 'globalVar', value: '"I\'m global"', type: 'let' },
              { name: 'firstFunction', value: 'function', type: 'function' },
              { name: 'secondFunction', value: 'function', type: 'function' },
            ],
            isActive: false
          },
          {
            id: 'first-1',
            name: 'firstFunction Execution Context',
            variables: [
              { name: 'param', value: '"Hello"', type: 'parameter' },
              { name: 'localVar', value: '"I\'m local"', type: 'let' },
            ],
            isActive: false
          },
          {
            id: 'second-1',
            name: 'secondFunction Execution Context',
            variables: [
              { name: 'param', value: '"I\'m local"', type: 'parameter' },
              { name: 'anotherVar', value: '"Another variable"', type: 'let' },
            ],
            isActive: true
          }
        ],
        currentLine: 13,
        description: 'secondFunction is called with localVar as argument. Another execution context is created and pushed onto the call stack.'
      },
      {
        callStack: [
          {
            id: 'global-1',
            name: 'Global Execution Context',
            variables: [
              { name: 'globalVar', value: '"I\'m global"', type: 'let' },
              { name: 'firstFunction', value: 'function', type: 'function' },
              { name: 'secondFunction', value: 'function', type: 'function' },
            ],
            isActive: false
          },
          {
            id: 'first-1',
            name: 'firstFunction Execution Context',
            variables: [
              { name: 'param', value: '"Hello"', type: 'parameter' },
              { name: 'localVar', value: '"I\'m local"', type: 'let' },
            ],
            isActive: true
          }
        ],
        currentLine: 8,
        description: 'secondFunction returns "I\'m local processed" and its execution context is popped from the call stack.'
      },
      {
        callStack: [
          {
            id: 'global-1',
            name: 'Global Execution Context',
            variables: [
              { name: 'globalVar', value: '"I\'m global"', type: 'let' },
              { name: 'firstFunction', value: 'function', type: 'function' },
              { name: 'secondFunction', value: 'function', type: 'function' },
              { name: 'result', value: '"Done!"', type: 'const' },
            ],
            isActive: true
          }
        ],
        currentLine: 18,
        description: 'firstFunction returns "Done!" and its execution context is popped from the call stack. The return value is stored in the "result" variable.'
      }
    ]
  },
  {
    id: 'closures',
    name: 'Closures & Scope Chain',
    code: `function createCounter() {
  let count = 0;  // This variable is enclosed in the closure
  
  return function increment() {
    count++;  // Accessing variable from parent scope
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2`,
    steps: [
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
            ],
            isActive: true
          }
        ],
        currentLine: 1,
        description: 'Program starts in the global execution context with createCounter function defined.'
      },
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
            ],
            isActive: false
          },
          {
            id: 'create-counter-1',
            name: 'createCounter Execution Context',
            variables: [
              { name: 'count', value: '0', type: 'let' },
            ],
            isActive: true
          }
        ],
        currentLine: 2,
        description: 'createCounter is called. A new execution context is created with a local "count" variable.'
      },
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
              { name: 'counter', value: 'function increment + closure', type: 'const' },
            ],
            isActive: true
          }
        ],
        currentLine: 9,
        description: 'createCounter returns the increment function which forms a closure with the count variable. The execution context is popped but the closure retains access to count.'
      },
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
              { name: 'counter', value: 'function increment + closure', type: 'const' },
            ],
            isActive: false
          },
          {
            id: 'increment-1',
            name: 'increment Execution Context',
            variables: [
              { name: 'count (from closure)', value: '0 → 1', type: 'let' },
            ],
            isActive: true
          }
        ],
        currentLine: 5,
        description: 'counter() is called, which executes the increment function. It accesses and updates the count variable from its closure.'
      },
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
              { name: 'counter', value: 'function increment + closure', type: 'const' },
            ],
            isActive: true
          }
        ],
        currentLine: 10,
        description: 'increment returns 1 and its execution context is popped. The console logs the return value.'
      },
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
              { name: 'counter', value: 'function increment + closure', type: 'const' },
            ],
            isActive: false
          },
          {
            id: 'increment-2',
            name: 'increment Execution Context',
            variables: [
              { name: 'count (from closure)', value: '1 → 2', type: 'let' },
            ],
            isActive: true
          }
        ],
        currentLine: 5,
        description: 'counter() is called again. The count variable in the closure is still 1 from the previous call, and gets incremented to 2.'
      },
      {
        callStack: [
          {
            id: 'global-2',
            name: 'Global Execution Context',
            variables: [
              { name: 'createCounter', value: 'function', type: 'function' },
              { name: 'counter', value: 'function increment + closure', type: 'const' },
            ],
            isActive: true
          }
        ],
        currentLine: 11,
        description: 'increment returns 2 and its execution context is popped. The console logs the return value.'
      }
    ]
  },
  {
    id: 'async-execution',
    name: 'Async Function Execution',
    code: `console.log("Start");

setTimeout(function timeout() {
  console.log("Timeout callback");
}, 1000);

Promise.resolve().then(function promise() {
  console.log("Promise resolved");
});

console.log("End");`,
    steps: [
      {
        callStack: [
          {
            id: 'global-3',
            name: 'Global Execution Context',
            variables: [],
            isActive: true
          }
        ],
        currentLine: 1,
        description: 'Program starts in the global execution context.'
      },
      {
        callStack: [
          {
            id: 'global-3',
            name: 'Global Execution Context',
            variables: [],
            isActive: true
          }
        ],
        currentLine: 3,
        description: '"Start" is logged to the console. The setTimeout function is called, which schedules the timeout callback to run after 1000ms.'
      },
      {
        callStack: [
          {
            id: 'global-3',
            name: 'Global Execution Context',
            variables: [],
            isActive: true
          }
        ],
        currentLine: 7,
        description: 'A Promise is created and resolved immediately. The promise callback is scheduled in the microtask queue.'
      },
      {
        callStack: [
          {
            id: 'global-3',
            name: 'Global Execution Context',
            variables: [],
            isActive: true
          }
        ],
        currentLine: 11,
        description: '"End" is logged to the console. The global execution context is about to finish.'
      },
      {
        callStack: [
          {
            id: 'global-3',
            name: 'Global Execution Context',
            variables: [],
            isActive: false
          },
          {
            id: 'promise-1',
            name: 'Promise Callback Execution Context',
            variables: [],
            isActive: true
          }
        ],
        currentLine: 8,
        description: 'After the call stack is empty, the microtask queue is processed. The promise callback runs and logs "Promise resolved".'
      },
      {
        callStack: [
          {
            id: 'global-3',
            name: 'Global Execution Context',
            variables: [],
            isActive: false
          },
          {
            id: 'timeout-1',
            name: 'Timeout Callback Execution Context',
            variables: [],
            isActive: true
          }
        ],
        currentLine: 4,
        description: 'After at least 1000ms, the timeout callback is moved from the task queue to the call stack and executed. It logs "Timeout callback".'
      }
    ]
  }
];

const FunctionExecutionVisualizer = () => {
  const [selectedExample, setSelectedExample] = useState<string>(executionExamples[0].id);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);

  // Get the current example
  const example = executionExamples.find(ex => ex.id === selectedExample) || executionExamples[0];
  const steps = example.steps;
  const currentStepData = steps[currentStep];

  // Handle example change
  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExample(e.target.value);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle playback
  useEffect(() => {
    let timer: number;
    
    if (isPlaying && currentStep < steps.length - 1) {
      timer = window.setTimeout(() => {
        goToNextStep();
      }, playbackSpeed);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep, steps.length, playbackSpeed]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackSpeed(2000 - parseInt(e.target.value, 10));
  };

  return (
    <div className="function-execution-visualizer">
      <div className="controls-container">
        <div className="example-selector">
          <label htmlFor="example-select">Select Example:</label>
          <select 
            id="example-select" 
            value={selectedExample} 
            onChange={handleExampleChange}
          >
            {executionExamples.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>
        
        <div className="animation-controls">
          <button 
            onClick={goToPrevStep} 
            disabled={currentStep === 0 || isPlaying}
          >
            Previous
          </button>
          <button 
            onClick={togglePlayback} 
            className={isPlaying ? 'stop' : 'start'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={goToNextStep} 
            disabled={currentStep === steps.length - 1 || isPlaying}
          >
            Next
          </button>
          <div className="speed-control">
            <span>Speed:</span>
            <input 
              type="range" 
              min="500" 
              max="1900" 
              value={2000 - playbackSpeed} 
              onChange={handleSpeedChange}
            />
          </div>
        </div>
      </div>
      
      <div className="visualization-container">
        <div className="code-panel">
          <h3>Code</h3>
          <div className="code-with-highlight">
            <SyntaxHighlighter 
              language="javascript" 
              style={vscDarkPlus}
              wrapLines={true}
              lineProps={(lineNumber: number) => {
                const style = { display: 'block' };
                if (lineNumber === currentStepData.currentLine) {
                  return { style: { ...style, backgroundColor: 'rgba(255, 255, 0, 0.2)' } };
                }
                return { style };
              }}
            >
              {example.code}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div className="execution-panel">
          <h3>Call Stack & Execution Context</h3>
          <div className="call-stack-visualization">
            {currentStepData.callStack.map((context, index) => (
              <div 
                key={context.id} 
                className={`stack-context ${context.isActive ? 'active-context' : ''}`}
              >
                <div className="context-header">
                  <h4>{context.name}</h4>
                  {index === currentStepData.callStack.length - 1 && (
                    <span className="active-indicator">Active</span>
                  )}
                </div>
                <div className="context-variables">
                  {context.variables.length > 0 ? (
                    <table className="variables-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {context.variables.map((variable, i) => (
                          <tr key={i} className={`variable-row variable-type-${variable.type}`}>
                            <td className="variable-type">{variable.type}</td>
                            <td className="variable-name">{variable.name}</td>
                            <td className="variable-value">{variable.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-scope">No variables in this context</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="description-panel">
        <h3>Step Explanation</h3>
        <p>{currentStepData.description}</p>
        <div className="step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
};

export default FunctionExecutionVisualizer; 