import { useState, useEffect, useCallback } from 'react'
import './JsScoping.css'
import CodeBlockComponent from '../EventLoop/CodeBlock'
import ScopeChainVisualizer from './ScopeChainVisualizer'
import FunctionExecutionVisualizer from './FunctionExecutionVisualizer'
import JitCompilationVisualizer from './JitCompilationVisualizer'
import { exampleCodes } from './exampleData'
import type { CodeLine, VisualizationState, AnimationStep, ExampleCode } from './types'

interface ScopeVisualizerProps {
  activeTab?: 'scope-chain' | 'function-execution' | 'jit-compilation';
}

const ScopeVisualizer: React.FC<ScopeVisualizerProps> = ({ activeTab }) => {
  const [selectedExample, setSelectedExample] = useState<string>(exampleCodes[0].id)
  const [activeVisualizer, setActiveVisualizer] = useState<'scope-chain' | 'function-execution' | 'jit-compilation'>(
    activeTab || 'scope-chain'
  )
  const [state, setState] = useState<VisualizationState>({
    currentCodeBlock: {
      title: '',
      code: [],
      currentLine: 0
    },
    scopeChain: {
      scopes: {},
      rootScopeId: '',
      activeScopeId: ''
    },
    description: 'Select an example and press Start to begin visualization.',
    isRunning: false,
    speed: 1000,
    currentStep: 0,
    totalSteps: 0
  })

  // Update active visualizer when activeTab prop changes
  useEffect(() => {
    if (activeTab) {
      setActiveVisualizer(activeTab);
    }
  }, [activeTab]);

  const prepareExample = useCallback((exampleId: string) => {
    const example = exampleCodes.find((ex: ExampleCode) => ex.id === exampleId) || exampleCodes[0]
    
    // Convert code string to code lines
    const codeLines: CodeLine[] = example.code.split('\n').map((line: string, index: number) => ({
      content: line,
      lineNumber: index + 1,
      isActive: false,
      isExecuted: false
    }))

    setState(prev => ({
      ...prev,
      currentCodeBlock: {
        title: example.title,
        code: codeLines,
        currentLine: 0
      },
      scopeChain: example.steps[0].scopeChain,
      description: example.description,
      currentStep: 0,
      totalSteps: example.steps.length
    }))
  }, [])

  useEffect(() => {
    prepareExample(selectedExample)
  }, [selectedExample, prepareExample])

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (state.isRunning) {
      stopVisualization()
    }
    setSelectedExample(e.target.value)
  }

  const applyAnimationStep = (step: AnimationStep) => {
    setState(prev => ({
      ...prev,
      scopeChain: step.scopeChain,
      description: step.description,
      currentCodeBlock: {
        ...prev.currentCodeBlock,
        currentLine: step.lineNumber
      }
    }))
  }

  // Animation logic
  const [animationInterval, setAnimationInterval] = useState<number | undefined>()

  const startVisualization = () => {
    setState(prev => ({ ...prev, isRunning: true }))
    
    // Clear any existing interval
    if (animationInterval) {
      clearInterval(animationInterval)
    }
    
    // Set up new interval
    const interval = window.setInterval(() => {
      setState(prev => {
        if (prev.currentStep >= prev.totalSteps - 1) {
          clearInterval(interval)
          return { ...prev, isRunning: false }
        }
        
        const nextStep = prev.currentStep + 1
        const example = exampleCodes.find((ex: ExampleCode) => ex.id === selectedExample) || exampleCodes[0]
        const step = example.steps[nextStep]
        
        applyAnimationStep(step)
        
        return {
          ...prev,
          currentStep: nextStep
        }
      })
    }, state.speed)
    
    setAnimationInterval(interval as unknown as number)
  }

  const stopVisualization = () => {
    if (animationInterval) {
      clearInterval(animationInterval)
      setAnimationInterval(undefined)
    }
    setState(prev => ({ ...prev, isRunning: false }))
  }

  const resetVisualization = () => {
    stopVisualization()
    prepareExample(selectedExample)
  }

  const stepForward = () => {
    setState(prev => {
      if (prev.currentStep >= prev.totalSteps - 1) {
        return prev
      }
      
      const nextStep = prev.currentStep + 1
      const example = exampleCodes.find((ex: ExampleCode) => ex.id === selectedExample) || exampleCodes[0]
      const step = example.steps[nextStep]
      
      applyAnimationStep(step)
      
      return {
        ...prev,
        currentStep: nextStep
      }
    })
  }

  const stepBackward = () => {
    setState(prev => {
      if (prev.currentStep <= 0) {
        return prev
      }
      
      const prevStep = prev.currentStep - 1
      const example = exampleCodes.find((ex: ExampleCode) => ex.id === selectedExample) || exampleCodes[0]
      const step = example.steps[prevStep]
      
      applyAnimationStep(step)
      
      return {
        ...prev,
        currentStep: prevStep
      }
    })
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value)
    setState(prev => ({ ...prev, speed: newSpeed }))
    
    // Update interval if running
    if (state.isRunning && animationInterval) {
      clearInterval(animationInterval)
      
      const interval = window.setInterval(() => {
        setState(prev => {
          if (prev.currentStep >= prev.totalSteps - 1) {
            clearInterval(interval)
            return { ...prev, isRunning: false }
          }
          
          const nextStep = prev.currentStep + 1
          const example = exampleCodes.find((ex: ExampleCode) => ex.id === selectedExample) || exampleCodes[0]
          const step = example.steps[nextStep]
          
          applyAnimationStep(step)
          
          return {
            ...prev,
            currentStep: nextStep
          }
        })
      }, newSpeed)
      
      setAnimationInterval(interval as unknown as number)
    }
  }

  return (
    <div className="scope-visualizer">
      <div className="visualizer-tabs">
        <button 
          className={activeVisualizer === 'scope-chain' ? 'active' : ''}
          onClick={() => setActiveVisualizer('scope-chain')}
        >
          Scope Chain Visualizer
        </button>
        <button 
          className={activeVisualizer === 'function-execution' ? 'active' : ''}
          onClick={() => setActiveVisualizer('function-execution')}
        >
          Function Execution Visualizer
        </button>
        <button 
          className={activeVisualizer === 'jit-compilation' ? 'active' : ''}
          onClick={() => setActiveVisualizer('jit-compilation')}
        >
          JIT Compilation Pipeline
        </button>
      </div>
      
      {activeVisualizer === 'scope-chain' ? (
        <>
          <div className="controls-container">
            <div className="example-selector">
              <label htmlFor="example-select">Select Example:</label>
              <select 
                id="example-select" 
                value={selectedExample} 
                onChange={handleExampleChange}
                disabled={state.isRunning}
              >
                {exampleCodes.map((example: ExampleCode) => (
                  <option key={example.id} value={example.id}>
                    {example.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="animation-controls">
              <button 
                onClick={state.isRunning ? stopVisualization : startVisualization}
                className={state.isRunning ? 'stop' : 'start'}
              >
                {state.isRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetVisualization}>Reset</button>
              <button onClick={stepBackward} disabled={state.currentStep <= 0}>
                Step Back
              </button>
              <button onClick={stepForward} disabled={state.currentStep >= state.totalSteps - 1}>
                Step Forward
              </button>
              
              <div className="speed-control">
                <label htmlFor="speed-slider">Speed:</label>
                <input 
                  id="speed-slider"
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="100" 
                  value={state.speed} 
                  onChange={handleSpeedChange}
                />
                <span>{state.speed}ms</span>
              </div>
            </div>
          </div>
          
          <div className="visualization-container">
            <div className="code-panel">
              <CodeBlockComponent codeBlock={state.currentCodeBlock} />
            </div>
            
            <div className="scope-panel">
              <ScopeChainVisualizer scopeChain={state.scopeChain} />
            </div>
          </div>
          
          <div className="description-panel">
            <h3>Explanation</h3>
            <p>{state.description}</p>
          </div>
        </>
      ) : activeVisualizer === 'function-execution' ? (
        <FunctionExecutionVisualizer />
      ) : (
        <JitCompilationVisualizer />
      )}
    </div>
  )
}

export default ScopeVisualizer 