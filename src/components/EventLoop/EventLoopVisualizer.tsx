import { useState, useEffect, useCallback } from 'react'
import './EventLoop.css'
import CodeBlock from './CodeBlock'
import MemoryModel from './MemoryModel'
import { exampleCodes } from './exampleData'
import type { CodeLine, VisualizationState, AnimationStep, ExampleCode } from './types'
import { EventLoopPhase } from './types'

const EventLoopVisualizer = () => {
  const [selectedExample, setSelectedExample] = useState<string>(exampleCodes[0].id)
  const [state, setState] = useState<VisualizationState>({
    callStack: [],
    callbackQueue: [],
    microtaskQueue: [],
    currentCodeBlock: {
      title: '',
      code: [],
      currentLine: 0
    },
    phase: EventLoopPhase.IDLE,
    description: 'Select an example and press Start to begin visualization.',
    isRunning: false,
    speed: 1000,
    currentStep: 0,
    totalSteps: 0
  })

  const prepareExample = useCallback((exampleId: string) => {
    const example = exampleCodes.find(ex => ex.id === exampleId) || exampleCodes[0]
    
    // Convert code string to code lines
    const codeLines: CodeLine[] = example.code.split('\n').map((line, index) => ({
      content: line,
      lineNumber: index + 1,
      isActive: false,
      isExecuted: false
    }))

    setState(prev => ({
      ...prev,
      callStack: [],
      callbackQueue: [],
      microtaskQueue: [],
      currentCodeBlock: {
        title: example.title,
        code: codeLines,
        currentLine: 0
      },
      description: example.description,
      currentStep: 0,
      totalSteps: example.steps.length,
      phase: EventLoopPhase.IDLE
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
      callStack: step.callStack,
      callbackQueue: step.callbackQueue,
      microtaskQueue: step.microtaskQueue,
      description: step.description,
      phase: step.phase,
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
        const example = exampleCodes.find(ex => ex.id === selectedExample) || exampleCodes[0]
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
      const example = exampleCodes.find(ex => ex.id === selectedExample) || exampleCodes[0]
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
      const example = exampleCodes.find(ex => ex.id === selectedExample) || exampleCodes[0]
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
          const example = exampleCodes.find(ex => ex.id === selectedExample) || exampleCodes[0]
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
    <div className="event-loop-container">
      <div className="example-picker">
        <h3>Choose an Example:</h3>
        <select 
          className="example-select"
          value={selectedExample}
          onChange={handleExampleChange}
          disabled={state.isRunning}
        >
          {exampleCodes.map(example => (
            <option key={example.id} value={example.id}>
              {example.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-panel">
        <button 
          className="control-button"
          onClick={startVisualization}
          disabled={state.isRunning || state.currentStep >= state.totalSteps - 1}
        >
          Start
        </button>
        <button 
          className="control-button"
          onClick={stopVisualization}
          disabled={!state.isRunning}
        >
          Pause
        </button>
        <button 
          className="control-button"
          onClick={resetVisualization}
        >
          Reset
        </button>
        <button 
          className="control-button"
          onClick={stepBackward}
          disabled={state.isRunning || state.currentStep <= 0}
        >
          Step Back
        </button>
        <button 
          className="control-button"
          onClick={stepForward}
          disabled={state.isRunning || state.currentStep >= state.totalSteps - 1}
        >
          Step Forward
        </button>
        
        <div className="speed-control">
          <label>Speed:</label>
          <input
            type="range"
            min="200"
            max="3000"
            step="100"
            value={state.speed}
            onChange={handleSpeedChange}
            disabled={state.isRunning}
          />
          <span>{state.speed}ms</span>
        </div>
      </div>

      <div className="model-section">
        <div className="section-header">Execution Progress</div>
        <div className="section-content">
          <div className="description-panel">
            <div className="description-title">
              Step {state.currentStep + 1} of {state.totalSteps}
              <div className="current-phase">Current Phase: {state.phase}</div>
            </div>
            <p>{state.description}</p>
          </div>
        </div>
      </div>

      <div className="visualization-container">
        <CodeBlock codeBlock={state.currentCodeBlock} />
        
        <div className="visualization">
          <MemoryModel
            callStack={state.callStack}
            callbackQueue={state.callbackQueue}
            microtaskQueue={state.microtaskQueue}
            currentPhase={state.phase}
          />
        </div>
      </div>
    </div>
  )
}

export default EventLoopVisualizer 