import type { ExampleCode } from './types'
import { EventLoopPhase } from './types'
import { v4 as uuidv4 } from 'uuid'

export const exampleCodes: ExampleCode[] = [
  {
    id: 'simple-timeout',
    title: 'Simple setTimeout Example',
    description: 'A basic example showing how setTimeout works with the event loop',
    code: `console.log("Start");

setTimeout(() => {
  console.log("Timeout callback executed");
}, 0);

console.log("End");`,
    steps: [
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Code execution starts with the main function on the call stack.',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("Start")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Start")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Start" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 3,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'setTimeout()' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'setTimeout is called and pushed to the call stack',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 5,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout callback executed"); }',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'setTimeout registers the callback in the callback queue and exits the call stack',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 7,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("End")' }
        ],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout callback executed"); }',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Executing console.log("End")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 7,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout callback executed"); }',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: '"End" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 7,
        callStack: [],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout callback executed"); }',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Main function execution completes, call stack is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 3,
        callStack: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout callback executed"); }',
          lineNumber: 3 
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop moves the callback from the callback queue to the call stack',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 4,
        callStack: [
          { id: uuidv4(), name: '() => { console.log("Timeout callback executed"); }', lineNumber: 3 },
          { id: uuidv4(), name: 'console.log("Timeout callback executed")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log inside the callback',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 4,
        callStack: [{ id: uuidv4(), name: '() => { console.log("Timeout callback executed"); }', lineNumber: 3 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Timeout callback executed" is printed to the console',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 5,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Callback execution completes, call stack is empty, program execution ends',
        phase: EventLoopPhase.COMPLETED
      }
    ]
  },
  {
    id: 'promise-microtask',
    title: 'Promises and Microtasks',
    description: 'How promises work with the microtask queue in the event loop',
    code: `console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise resolved");
});

setTimeout(() => {
  console.log("Timeout executed");
}, 0);

console.log("End");`,
    steps: [
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Code execution starts with the main function on the call stack.',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("Start")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Start")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Start" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 3,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'Promise.resolve().then()' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Promise.resolve().then() is called',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 5,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3,
          type: 'micro'
        }],
        description: 'Promise callback is registered in the microtask queue',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 7,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'setTimeout()' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3,
          type: 'micro'
        }],
        description: 'setTimeout is called and pushed to the call stack',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 9,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3,
          type: 'micro'
        }],
        description: 'setTimeout registers the callback in the callback queue',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 11,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("End")' }
        ],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3,
          type: 'micro'
        }],
        description: 'Executing console.log("End")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 11,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3,
          type: 'micro'
        }],
        description: '"End" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 11,
        callStack: [],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3,
          type: 'micro'
        }],
        description: 'Main function execution completes, call stack is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 3,
        callStack: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Promise resolved"); }',
          lineNumber: 3 
        }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Event loop processes the microtask queue before the callback queue',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 4,
        callStack: [
          { id: uuidv4(), name: '() => { console.log("Promise resolved"); }', lineNumber: 3 },
          { id: uuidv4(), name: 'console.log("Promise resolved")' }
        ],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Executing console.log inside the promise callback',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 4,
        callStack: [{ id: uuidv4(), name: '() => { console.log("Promise resolved"); }', lineNumber: 3 }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: '"Promise resolved" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 5,
        callStack: [],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Promise callback execution completes, microtask queue is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 7,
        callStack: [{ 
          id: uuidv4(), 
          name: '() => { console.log("Timeout executed"); }',
          lineNumber: 7 
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop moves the setTimeout callback from the callback queue to the call stack',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 8,
        callStack: [
          { id: uuidv4(), name: '() => { console.log("Timeout executed"); }', lineNumber: 7 },
          { id: uuidv4(), name: 'console.log("Timeout executed")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log inside the setTimeout callback',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 8,
        callStack: [{ id: uuidv4(), name: '() => { console.log("Timeout executed"); }', lineNumber: 7 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Timeout executed" is printed to the console',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 9,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'setTimeout callback execution completes, call stack is empty, program execution ends',
        phase: EventLoopPhase.COMPLETED
      }
    ]
  },
  {
    id: 'async-await',
    title: 'Async/Await Example',
    description: 'How async/await works with the event loop',
    code: `console.log("Start");

async function fetchData() {
  console.log("Inside fetchData function");
  const data = await Promise.resolve("Data fetched");
  console.log(data);
  return "Done";
}

fetchData().then(result => {
  console.log(result);
});

console.log("End");`,
    steps: [
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Code execution starts with the main function on the call stack.',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("Start")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Start")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Start" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 3,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'fetchData function is defined',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 10,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'fetchData function is called',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 4,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' },
          { id: uuidv4(), name: 'console.log("Inside fetchData function")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Inside fetchData function")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 4,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Inside fetchData function" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 5,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' },
          { id: uuidv4(), name: 'Promise.resolve("Data fetched")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Creating a resolved promise with "Data fetched"',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 5,
        callStack: [
          { id: uuidv4(), name: 'main()' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'fetchData() continuation',
          lineNumber: 5,
          type: 'micro'
        }],
        description: 'await suspends fetchData execution and returns control to caller',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 12,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("End")' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'fetchData() continuation',
          lineNumber: 5,
          type: 'micro'
        }],
        description: 'Executing console.log("End")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 12,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'fetchData() continuation',
          lineNumber: 5,
          type: 'micro'
        }],
        description: '"End" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 12,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'fetchData() continuation',
          lineNumber: 5,
          type: 'micro'
        }],
        description: 'Main function execution completes, call stack is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 6,
        callStack: [{ 
          id: uuidv4(), 
          name: 'fetchData() continuation',
          lineNumber: 5
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop processes the microtask queue, resuming fetchData after await',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 6,
        callStack: [
          { id: uuidv4(), name: 'fetchData() continuation', lineNumber: 5 },
          { id: uuidv4(), name: 'console.log("Data fetched")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log(data) with "Data fetched"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 6,
        callStack: [{ id: uuidv4(), name: 'fetchData() continuation', lineNumber: 5 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Data fetched" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 7,
        callStack: [{ id: uuidv4(), name: 'fetchData() continuation', lineNumber: 5 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'fetchData function returns "Done"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 10,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); }',
          lineNumber: 10,
          type: 'micro'
        }],
        description: 'fetchData completes, its .then callback is added to microtask queue',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 10,
        callStack: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); }',
          lineNumber: 10
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop processes the microtask queue with the .then callback',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 11,
        callStack: [
          { id: uuidv4(), name: 'result => { console.log(result); }', lineNumber: 10 },
          { id: uuidv4(), name: 'console.log("Done")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log(result) with "Done"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 11,
        callStack: [{ id: uuidv4(), name: 'result => { console.log(result); }', lineNumber: 10 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Done" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 12,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Promise callback execution completes, call stack is empty, program execution ends',
        phase: EventLoopPhase.COMPLETED
      }
    ]
  },
  {
    id: 'promise-chain',
    title: 'Promise Chain',
    description: 'Demonstrates how promise chains work in the event loop',
    code: `console.log("Start");

Promise.resolve("First")
  .then(result => {
    console.log(result);
    return "Second";
  })
  .then(result => {
    console.log(result);
    return Promise.resolve("Third");
  })
  .then(result => {
    console.log(result);
  });

console.log("End");`,
    steps: [
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Code execution starts with the main function on the call stack.',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("Start")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Start")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Start" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 3,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'Promise.resolve("First")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Creating a resolved promise with "First"',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 4,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return "Second"; }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'First .then handler added to microtask queue',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 14,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("End")' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return "Second"; }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Executing console.log("End")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 14,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return "Second"; }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: '"End" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 14,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return "Second"; }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Main function execution completes, call stack is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 4,
        callStack: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return "Second"; }',
          lineNumber: 4
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop processes the microtask queue, executing first .then handler',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 5,
        callStack: [
          { id: uuidv4(), name: 'result => { console.log(result); return "Second"; }', lineNumber: 4 },
          { id: uuidv4(), name: 'console.log("First")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log(result) with "First"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 5,
        callStack: [{ id: uuidv4(), name: 'result => { console.log(result); return "Second"; }', lineNumber: 4 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"First" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 6,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return Promise.resolve("Third"); }',
          lineNumber: 8,
          type: 'micro'
        }],
        description: 'First .then completes and returns "Second", next .then added to microtask queue',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 8,
        callStack: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); return Promise.resolve("Third"); }',
          lineNumber: 8
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop processes microtask queue, executing second .then handler',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 9,
        callStack: [
          { id: uuidv4(), name: 'result => { console.log(result); return Promise.resolve("Third"); }', lineNumber: 8 },
          { id: uuidv4(), name: 'console.log("Second")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log(result) with "Second"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 9,
        callStack: [{ id: uuidv4(), name: 'result => { console.log(result); return Promise.resolve("Third"); }', lineNumber: 8 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Second" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 10,
        callStack: [
          { id: uuidv4(), name: 'result => { console.log(result); return Promise.resolve("Third"); }', lineNumber: 8 },
          { id: uuidv4(), name: 'Promise.resolve("Third")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Creating a resolved promise with "Third"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 10,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); }',
          lineNumber: 12,
          type: 'micro'
        }],
        description: 'Second .then completes and returns a promise, third .then added to microtask queue',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 12,
        callStack: [{ 
          id: uuidv4(), 
          name: 'result => { console.log(result); }',
          lineNumber: 12
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop processes microtask queue, executing third .then handler',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 13,
        callStack: [
          { id: uuidv4(), name: 'result => { console.log(result); }', lineNumber: 12 },
          { id: uuidv4(), name: 'console.log("Third")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log(result) with "Third"',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 13,
        callStack: [{ id: uuidv4(), name: 'result => { console.log(result); }', lineNumber: 12 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Third" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 13,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Third .then completes, all promises resolved, program execution ends',
        phase: EventLoopPhase.COMPLETED
      }
    ]
  },
  {
    id: 'nested-timeout',
    title: 'Nested SetTimeouts',
    description: 'Shows how nested setTimeout callbacks are processed in the event loop',
    code: `console.log("Start");

setTimeout(() => {
  console.log("First timeout");
  
  setTimeout(() => {
    console.log("Nested timeout");
  }, 0);
  
  console.log("After nested timeout setup");
}, 0);

console.log("End");`,
    steps: [
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Code execution starts with the main function on the call stack.',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("Start")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Start")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Start" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 3,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'setTimeout()' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'setTimeout is called and pushed to the call stack',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 11,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'First timeout callback',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'setTimeout registers the callback in the callback queue',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 13,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("End")' }
        ],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'First timeout callback',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Executing console.log("End")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 13,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'First timeout callback',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: '"End" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 13,
        callStack: [],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'First timeout callback',
          lineNumber: 3,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Main function execution completes, call stack is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 3,
        callStack: [{ 
          id: uuidv4(), 
          name: 'First timeout callback',
          lineNumber: 3
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop moves the first setTimeout callback to the call stack',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 4,
        callStack: [
          { id: uuidv4(), name: 'First timeout callback', lineNumber: 3 },
          { id: uuidv4(), name: 'console.log("First timeout")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("First timeout")',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 4,
        callStack: [{ id: uuidv4(), name: 'First timeout callback', lineNumber: 3 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"First timeout" is printed to the console',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 6,
        callStack: [
          { id: uuidv4(), name: 'First timeout callback', lineNumber: 3 },
          { id: uuidv4(), name: 'setTimeout()' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Nested setTimeout is called and pushed to the call stack',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 8,
        callStack: [{ id: uuidv4(), name: 'First timeout callback', lineNumber: 3 }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'Nested timeout callback',
          lineNumber: 6,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Nested setTimeout registers its callback in the callback queue',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 10,
        callStack: [
          { id: uuidv4(), name: 'First timeout callback', lineNumber: 3 },
          { id: uuidv4(), name: 'console.log("After nested timeout setup")' }
        ],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'Nested timeout callback',
          lineNumber: 6,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'Executing console.log("After nested timeout setup")',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 10,
        callStack: [{ id: uuidv4(), name: 'First timeout callback', lineNumber: 3 }],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'Nested timeout callback',
          lineNumber: 6,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: '"After nested timeout setup" is printed to the console',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 11,
        callStack: [],
        callbackQueue: [{ 
          id: uuidv4(), 
          name: 'Nested timeout callback',
          lineNumber: 6,
          type: 'macro'
        }],
        microtaskQueue: [],
        description: 'First timeout callback execution completes, returning to event loop',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 6,
        callStack: [{ 
          id: uuidv4(), 
          name: 'Nested timeout callback',
          lineNumber: 6
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop moves the nested setTimeout callback to the call stack',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 7,
        callStack: [
          { id: uuidv4(), name: 'Nested timeout callback', lineNumber: 6 },
          { id: uuidv4(), name: 'console.log("Nested timeout")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Nested timeout")',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 7,
        callStack: [{ id: uuidv4(), name: 'Nested timeout callback', lineNumber: 6 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Nested timeout" is printed to the console',
        phase: EventLoopPhase.EXECUTING_TASKS
      },
      {
        lineNumber: 8,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Nested timeout callback completes, call stack is empty, program execution ends',
        phase: EventLoopPhase.COMPLETED
      }
    ]
  },
  {
    id: 'async-error-handling',
    title: 'Async Error Handling',
    description: 'Demonstrates error handling in promises and async/await',
    code: `console.log("Start");

// Promise error handling
Promise.reject("Error!")
  .catch(error => {
    console.log("Caught promise error:", error);
  });

// Async/await error handling
async function fetchData() {
  try {
    console.log("Fetching data...");
    throw new Error("Fetch failed");
  } catch (error) {
    console.log("Caught async error:", error.message);
  }
}

fetchData();

console.log("End");`,
    steps: [
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Code execution starts with the main function on the call stack.',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("Start")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log("Start")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 1,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Start" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 4,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'Promise.reject("Error!")' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Creating a rejected promise with "Error!"',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 4,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'catch handler added to microtask queue',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 9,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'fetchData function is defined',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 18,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'fetchData function is called',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 11,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' },
          { id: uuidv4(), name: 'console.log("Fetching data...")' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Executing console.log("Fetching data...")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 11,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: '"Fetching data..." is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 12,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' },
          { id: uuidv4(), name: 'throw new Error("Fetch failed")' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Throwing an error in fetchData',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 14,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' },
          { id: uuidv4(), name: 'console.log("Caught async error:", error.message)' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Error caught in try/catch block, executing console.log',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 14,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'fetchData()' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: '"Caught async error: Fetch failed" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 18,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'fetchData function completes execution',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 20,
        callStack: [
          { id: uuidv4(), name: 'main()' },
          { id: uuidv4(), name: 'console.log("End")' }
        ],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Executing console.log("End")',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 20,
        callStack: [{ id: uuidv4(), name: 'main()' }],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: '"End" is printed to the console',
        phase: EventLoopPhase.EXECUTING_SYNC
      },
      {
        lineNumber: 20,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4,
          type: 'micro'
        }],
        description: 'Main function execution completes, call stack is empty',
        phase: EventLoopPhase.IDLE
      },
      {
        lineNumber: 4,
        callStack: [{ 
          id: uuidv4(), 
          name: 'error => { console.log("Caught promise error:", error); }',
          lineNumber: 4
        }],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Event loop processes the microtask queue, executing catch handler',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 5,
        callStack: [
          { id: uuidv4(), name: 'error => { console.log("Caught promise error:", error); }', lineNumber: 4 },
          { id: uuidv4(), name: 'console.log("Caught promise error:", error)' }
        ],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Executing console.log in catch handler',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 5,
        callStack: [{ id: uuidv4(), name: 'error => { console.log("Caught promise error:", error); }', lineNumber: 4 }],
        callbackQueue: [],
        microtaskQueue: [],
        description: '"Caught promise error: Error!" is printed to the console',
        phase: EventLoopPhase.EXECUTING_MICROTASKS
      },
      {
        lineNumber: 6,
        callStack: [],
        callbackQueue: [],
        microtaskQueue: [],
        description: 'Catch handler completes, microtask queue is empty, program execution ends',
        phase: EventLoopPhase.COMPLETED
      }
    ]
  }
] 