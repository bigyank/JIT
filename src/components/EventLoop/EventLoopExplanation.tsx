import { useState } from 'react'
import './EventLoop.css'

const EventLoopExplanation = () => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="explanation-container">
      <h2>Understanding the JavaScript Event Loop</h2>
      
      <div className="explanation-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'callstack' ? 'active' : ''}`}
          onClick={() => setActiveTab('callstack')}
        >
          Call Stack
        </button>
        <button 
          className={`tab-button ${activeTab === 'eventloop' ? 'active' : ''}`}
          onClick={() => setActiveTab('eventloop')}
        >
          Event Loop
        </button>
        <button 
          className={`tab-button ${activeTab === 'queues' ? 'active' : ''}`}
          onClick={() => setActiveTab('queues')}
        >
          Task Queues
        </button>
        <button 
          className={`tab-button ${activeTab === 'async' ? 'active' : ''}`}
          onClick={() => setActiveTab('async')}
        >
          Async Operations
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <h3>JavaScript Runtime Environment</h3>
            <div className="diagram-container">
              <div className="diagram overview-diagram">
                <div className="diagram-item call-stack">
                  <h4>Call Stack</h4>
                  <p>LIFO Queue</p>
                  <div className="stack-visual">
                    <div className="stack-frame">main()</div>
                  </div>
                </div>
                <div className="diagram-item web-apis">
                  <h4>Web APIs</h4>
                  <ul>
                    <li>DOM</li>
                    <li>setTimeout</li>
                    <li>fetch</li>
                    <li>localStorage</li>
                  </ul>
                </div>
                <div className="diagram-item queues-visual">
                  <div className="queue-container">
                    <h4>Task Queue</h4>
                    <div className="queue-visual">
                      <div className="queue-item">setTimeout</div>
                      <div className="queue-item">DOM Events</div>
                    </div>
                  </div>
                  <div className="queue-container">
                    <h4>Microtask Queue</h4>
                    <div className="queue-visual">
                      <div className="queue-item">Promise</div>
                    </div>
                  </div>
                </div>
                <div className="diagram-item event-loop-visual">
                  <div className="loop-circle">
                    <div className="loop-arrow"></div>
                    <p>Event Loop</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="explanation-text">
              <p>JavaScript's runtime environment consists of:</p>
              <ul>
                <li><strong>Call Stack</strong>: Where function calls are stacked and executed in a LIFO (Last-In-First-Out) order.</li>
                <li><strong>Web APIs</strong>: Browser-provided features like DOM, setTimeout, fetch, etc. that handle operations outside the JS engine.</li>
                <li><strong>Callback Queue (Task Queue)</strong>: Where callbacks from async operations wait to be executed.</li>
                <li><strong>Microtask Queue</strong>: Higher priority queue for Promises and similar operations.</li>
                <li><strong>Event Loop</strong>: Constantly checks if the call stack is empty, and if so, moves callbacks from queues to the stack.</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'callstack' && (
          <div className="tab-pane">
            <h3>The Call Stack</h3>
            <div className="diagram-container">
              <div className="diagram callstack-diagram">
                <div className="callstack-steps">
                  <div className="step">
                    <h4>Step 1: Function Called</h4>
                    <div className="stack-visual">
                      <div className="stack-frame">doSomething()</div>
                      <div className="stack-frame">main()</div>
                    </div>
                  </div>
                  <div className="step">
                    <h4>Step 2: Another Function Called</h4>
                    <div className="stack-visual">
                      <div className="stack-frame">calculateResult()</div>
                      <div className="stack-frame">doSomething()</div>
                      <div className="stack-frame">main()</div>
                    </div>
                  </div>
                  <div className="step">
                    <h4>Step 3: Inner Function Returns</h4>
                    <div className="stack-visual">
                      <div className="stack-frame">doSomething()</div>
                      <div className="stack-frame">main()</div>
                    </div>
                  </div>
                  <div className="step">
                    <h4>Step 4: Outer Function Returns</h4>
                    <div className="stack-visual">
                      <div className="stack-frame">main()</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="explanation-text">
              <p>The call stack works on LIFO (Last In, First Out) principle:</p>
              <ol>
                <li>When a function is called, it's pushed onto the stack.</li>
                <li>When a function calls another function, the new function is pushed on top.</li>
                <li>When a function completes, it's popped off the stack.</li>
                <li>Execution continues with the function below it in the stack.</li>
              </ol>
              <p><strong>Stack Overflow</strong>: If the call stack exceeds its maximum size (e.g., with infinite recursion), a "stack overflow" error occurs.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'eventloop' && (
          <div className="tab-pane">
            <h3>The Event Loop</h3>
            <div className="diagram-container">
              <div className="diagram eventloop-diagram">
                <div className="loop-animation">
                  <div className="loop-step">
                    <h4>1. Check Call Stack</h4>
                    <p>Is the call stack empty?</p>
                  </div>
                  <div className="loop-arrow down"></div>
                  <div className="loop-step">
                    <h4>2. Check Microtask Queue</h4>
                    <p>Process ALL microtasks</p>
                  </div>
                  <div className="loop-arrow down"></div>
                  <div className="loop-step">
                    <h4>3. Check Task Queue</h4>
                    <p>Process ONE task</p>
                  </div>
                  <div className="loop-arrow down"></div>
                  <div className="loop-step">
                    <h4>4. Rendering</h4>
                    <p>Browser rendering if needed</p>
                  </div>
                  <div className="loop-arrow up"></div>
                </div>
              </div>
            </div>
            <div className="explanation-text">
              <p>The Event Loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously:</p>
              <ol>
                <li>Checks if the Call Stack is empty</li>
                <li>If empty, processes <strong>all</strong> tasks from the Microtask Queue</li>
                <li>Then processes <strong>one</strong> task from the Task Queue</li>
                <li>Allows browser rendering if needed</li>
                <li>Repeats the process</li>
              </ol>
              <p>This cycle ensures that JavaScript can handle asynchronous operations efficiently without blocking the main thread.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'queues' && (
          <div className="tab-pane">
            <h3>Task Queue vs. Microtask Queue</h3>
            <div className="diagram-container">
              <div className="diagram queues-diagram">
                <div className="queue-comparison">
                  <div className="queue-type">
                    <h4>Task Queue</h4>
                    <div className="queue-visual">
                      <div className="queue-item">setTimeout</div>
                      <div className="queue-item">setInterval</div>
                      <div className="queue-item">I/O Events</div>
                      <div className="queue-item">UI Events</div>
                    </div>
                    <div className="queue-details">
                      <p><strong>Priority: Lower</strong></p>
                      <p><strong>Processing: One per loop iteration</strong></p>
                    </div>
                  </div>
                  <div className="queue-type">
                    <h4>Microtask Queue</h4>
                    <div className="queue-visual">
                      <div className="queue-item">Promises</div>
                      <div className="queue-item">queueMicrotask()</div>
                      <div className="queue-item">MutationObserver</div>
                      <div className="queue-item">process.nextTick (Node)</div>
                    </div>
                    <div className="queue-details">
                      <p><strong>Priority: Higher</strong></p>
                      <p><strong>Processing: All tasks processed before next task queue item</strong></p>
                    </div>
                  </div>
                </div>
                <div className="queue-processing">
                  <div className="processing-step">
                    <h4>Processing Order</h4>
                    <div className="processing-diagram">
                      <div className="order-item">
                        <span className="number">1</span>
                        <span className="text">Call Stack emptied</span>
                      </div>
                      <div className="order-arrow down"></div>
                      <div className="order-item">
                        <span className="number">2</span>
                        <span className="text">ALL Microtasks processed</span>
                      </div>
                      <div className="order-arrow down"></div>
                      <div className="order-item">
                        <span className="number">3</span>
                        <span className="text">ONE Task processed</span>
                      </div>
                      <div className="order-arrow down"></div>
                      <div className="order-item">
                        <span className="number">4</span>
                        <span className="text">Repeat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="explanation-text">
              <p>JavaScript has two main types of queues for handling async operations:</p>
              <h4>Task Queue (Macrotask Queue)</h4>
              <ul>
                <li>Handles: setTimeout, setInterval, DOM events, XHR, etc.</li>
                <li>One task processed per event loop iteration</li>
                <li>Lower priority than microtasks</li>
              </ul>
              <h4>Microtask Queue</h4>
              <ul>
                <li>Handles: Promise callbacks, queueMicrotask(), MutationObserver</li>
                <li>All microtasks are processed before the next task</li>
                <li>Higher priority - processed immediately after the current task</li>
              </ul>
              <p>This priority system ensures that Promise resolutions and similar high-priority callbacks execute before the next UI update or timer callback.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'async' && (
          <div className="tab-pane">
            <h3>Asynchronous Operations</h3>
            <div className="diagram-container">
              <div className="diagram async-diagram">
                <div className="async-comparison">
                  <div className="async-type">
                    <h4>Callbacks</h4>
                    <pre>
{`setTimeout(() => {
  console.log("Callback executed");
}, 1000);
console.log("Immediate");

// Output:
// "Immediate"
// "Callback executed" (after 1s)`}
                    </pre>
                  </div>
                  <div className="async-type">
                    <h4>Promises</h4>
                    <pre>
{`fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
  
console.log("Fetch initiated");

// Output:
// "Fetch initiated"
// [data from API] (when resolved)`}
                    </pre>
                  </div>
                  <div className="async-type">
                    <h4>Async/Await</h4>
                    <pre>
{`async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

fetchData();
console.log("Function called");

// Output:
// "Function called"
// [data from API] (when resolved)`}
                    </pre>
                  </div>
                </div>
                <div className="async-flow">
                  <h4>Async Flow Visualization</h4>
                  <div className="flow-diagram">
                    <div className="flow-step">
                      <div className="flow-code">Async operation requested</div>
                      <div className="flow-arrow down"></div>
                    </div>
                    <div className="flow-step">
                      <div className="flow-code">Browser/Node handles operation outside JS thread</div>
                      <div className="flow-arrow down"></div>
                    </div>
                    <div className="flow-step">
                      <div className="flow-code">Callback placed in appropriate queue when complete</div>
                      <div className="flow-arrow down"></div>
                    </div>
                    <div className="flow-step">
                      <div className="flow-code">Event loop processes callback when call stack is empty</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="explanation-text">
              <p>JavaScript provides several ways to handle asynchronous operations:</p>
              <h4>Callbacks</h4>
              <ul>
                <li>Traditional way to handle async operations</li>
                <li>Functions passed as arguments to be called later</li>
                <li>Can lead to "callback hell" with nested callbacks</li>
              </ul>
              <h4>Promises</h4>
              <ul>
                <li>Objects representing eventual completion or failure</li>
                <li>Enables chaining with .then() and .catch()</li>
                <li>Promise callbacks go to the microtask queue</li>
              </ul>
              <h4>Async/Await</h4>
              <ul>
                <li>Syntactic sugar over Promises for cleaner code</li>
                <li>Makes async code look synchronous</li>
                <li>await suspends function execution until Promise resolves</li>
                <li>Function resumes from microtask queue</li>
              </ul>
              <p>Understanding these patterns is crucial for writing efficient non-blocking JavaScript code.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventLoopExplanation 