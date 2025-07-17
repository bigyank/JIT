export type CodeLine = {
  content: string
  lineNumber: number
  isActive?: boolean
  isExecuted?: boolean
}

export type CodeBlock = {
  title: string
  code: CodeLine[]
  currentLine: number
}

export type StackItem = {
  id: string
  name: string
  source?: string
  lineNumber?: number
}

export type QueueItem = {
  id: string
  name: string
  source?: string
  lineNumber?: number
  type: 'macro' | 'micro'
}

export type VisualizationState = {
  callStack: StackItem[]
  callbackQueue: QueueItem[]
  microtaskQueue: QueueItem[]
  currentCodeBlock: CodeBlock
  phase: EventLoopPhase
  description: string
  isRunning: boolean
  speed: number
  currentStep: number
  totalSteps: number
}

export enum EventLoopPhase {
  IDLE = 'Idle',
  EXECUTING_SYNC = 'Executing Synchronous Code',
  EXECUTING_MICROTASKS = 'Processing Microtask Queue',
  EXECUTING_TASKS = 'Processing Task Queue',
  RENDERING = 'Rendering',
  COMPLETED = 'Execution Complete'
}

export type ExampleCode = {
  id: string
  title: string
  description: string
  code: string
  steps: AnimationStep[]
}

export type AnimationStep = {
  lineNumber: number
  callStack: StackItem[]
  callbackQueue: QueueItem[]
  microtaskQueue: QueueItem[]
  description: string
  phase: EventLoopPhase
} 