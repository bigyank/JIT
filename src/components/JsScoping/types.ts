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

export type ScopeVariable = {
  id: string
  name: string
  value: string
  type: 'let' | 'const' | 'var' | 'function' | 'parameter' | 'object' | 'array'
}

export type Scope = {
  id: string
  name: string
  variables: ScopeVariable[]
  parent?: string // Parent scope ID
  children?: string[] // Child scope IDs
  isActive?: boolean
}

export type ScopeChain = {
  scopes: Record<string, Scope>
  rootScopeId: string
  activeScopeId: string
}

export type VisualizationState = {
  currentCodeBlock: CodeBlock
  scopeChain: ScopeChain
  description: string
  isRunning: boolean
  speed: number
  currentStep: number
  totalSteps: number
}

// Define scoping features as string constants
export const ScopingFeature = {
  LEXICAL_SCOPE: 'Lexical Scope',
  CLOSURES: 'Closures',
  HOISTING: 'Hoisting',
  THIS_BINDING: 'This Binding',
  MODULE_SCOPE: 'Module Scope'
} as const

export type ScopingFeature = typeof ScopingFeature[keyof typeof ScopingFeature]

export type AnimationStep = {
  lineNumber: number
  scopeChain: ScopeChain
  description: string
  feature: ScopingFeature
}

export type ExampleCode = {
  id: string
  title: string
  description: string
  code: string
  feature: ScopingFeature
  steps: AnimationStep[]
} 

// JIT Compilation Types
export type AstNode = {
  id: string
  type: string
  value?: string
  children?: string[] // IDs of child nodes
}

export type CompilationStage = 
  | 'parsing'
  | 'baseline-compilation' 
  | 'optimization' 
  | 'execution' 
  | 'deoptimization'
  | 'garbage-collection'

export type CompilationState = {
  stage: CompilationStage
  ast: Record<string, AstNode>
  rootNodeId: string
  optimizedFunctions: string[] // Names of functions that have been optimized
  deoptimizedFunctions: string[] // Names of functions that have been deoptimized
  profiledHotspots: Array<{
    functionName: string
    executionCount: number
  }>
}

export type JitExampleStep = {
  lineNumber: number
  compilationState: CompilationState
  callStack?: Array<{name: string, isOptimized: boolean}>
  scopeChain?: ScopeChain
  eventLoop?: {
    taskQueue: string[]
    microtaskQueue: string[]
  }
  description: string
}

export type JitExample = {
  id: string
  title: string
  description: string
  code: string
  steps: JitExampleStep[]
} 