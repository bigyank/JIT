import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './JsScoping.css';
import { jitExamples } from './jitExampleData';
import type { AstNode, CompilationStage, JitExampleStep } from './types';
import ScopeChainVisualizer from './ScopeChainVisualizer';
import React from 'react';

const JitCompilationVisualizer: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string>(jitExamples[0].id);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [currentLineNumber, setCurrentLineNumber] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  const [code, setCode] = useState<string>('');
  const [currentDescription, setCurrentDescription] = useState<string>('');
  const [astData, setAstData] = useState<{ast: Record<string, AstNode>, rootNodeId: string}>({
    ast: {},
    rootNodeId: ''
  });
  const [compilationStage, setCompilationStage] = useState<CompilationStage>('parsing');
  const [optimizedFunctions, setOptimizedFunctions] = useState<string[]>([]);
  const [deoptimizedFunctions, setDeoptimizedFunctions] = useState<string[]>([]);
  const [profiledHotspots, setProfiledHotspots] = useState<Array<{functionName: string, executionCount: number}>>([]);
  const [callStack, setCallStack] = useState<Array<{name: string, isOptimized: boolean}>>([]);
  const [eventLoop, setEventLoop] = useState<{taskQueue: string[], microtaskQueue: string[]}>({
    taskQueue: [],
    microtaskQueue: []
  });
  const [scopeChain, setScopeChain] = useState<any>(null);
  
  // Initialize with first example
  useEffect(() => {
    const example = jitExamples.find(ex => ex.id === selectedExample) || jitExamples[0];
    setCode(example.code);
    setTotalSteps(example.steps.length);
    applyStep(example.steps[0]);
  }, [selectedExample]);
  
  // Apply a specific step of the animation
  const applyStep = (step: JitExampleStep) => {
    setCurrentLineNumber(step.lineNumber);
    setCurrentDescription(step.description);
    setCompilationStage(step.compilationState.stage);
    setAstData({
      ast: step.compilationState.ast,
      rootNodeId: step.compilationState.rootNodeId
    });
    setOptimizedFunctions(step.compilationState.optimizedFunctions);
    setDeoptimizedFunctions(step.compilationState.deoptimizedFunctions);
    setProfiledHotspots(step.compilationState.profiledHotspots);
    
    if (step.callStack) {
      setCallStack(step.callStack);
    } else {
      setCallStack([]);
    }
    
    if (step.eventLoop) {
      setEventLoop(step.eventLoop);
    } else {
      setEventLoop({ taskQueue: [], microtaskQueue: [] });
    }
    
    if (step.scopeChain) {
      setScopeChain(step.scopeChain);
    } else {
      setScopeChain(null);
    }
  };
  
  // Animation interval handler
  const [animationInterval, setAnimationInterval] = useState<number | undefined>();
  
  // Start the animation
  const startAnimation = () => {
    setIsRunning(true);
    
    if (animationInterval) {
      clearInterval(animationInterval);
    }
    
    const interval = window.setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps - 1) {
          clearInterval(interval);
          setIsRunning(false);
          return prev;
        }
        
        const nextStep = prev + 1;
        const example = jitExamples.find(ex => ex.id === selectedExample) || jitExamples[0];
        applyStep(example.steps[nextStep]);
        
        return nextStep;
      });
    }, speed);
    
    setAnimationInterval(interval as unknown as number);
  };
  
  // Stop the animation
  const stopAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(undefined);
    }
    setIsRunning(false);
  };
  
  // Reset the animation
  const resetAnimation = () => {
    stopAnimation();
    setCurrentStep(0);
    const example = jitExamples.find(ex => ex.id === selectedExample) || jitExamples[0];
    applyStep(example.steps[0]);
  };
  
  // Step forward
  const stepForward = () => {
    if (currentStep >= totalSteps - 1) return;
    
    const nextStep = currentStep + 1;
    const example = jitExamples.find(ex => ex.id === selectedExample) || jitExamples[0];
    applyStep(example.steps[nextStep]);
    setCurrentStep(nextStep);
  };
  
  // Step backward
  const stepBackward = () => {
    if (currentStep <= 0) return;
    
    const prevStep = currentStep - 1;
    const example = jitExamples.find(ex => ex.id === selectedExample) || jitExamples[0];
    applyStep(example.steps[prevStep]);
    setCurrentStep(prevStep);
  };
  
  // Handle example selection change
  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isRunning) {
      stopAnimation();
    }
    setSelectedExample(e.target.value);
    setCurrentStep(0);
  };
  
  // Handle speed change
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    
    if (isRunning && animationInterval) {
      clearInterval(animationInterval);
      
      const interval = window.setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) {
            clearInterval(interval);
            setIsRunning(false);
            return prev;
          }
          
          const nextStep = prev + 1;
          const example = jitExamples.find(ex => ex.id === selectedExample) || jitExamples[0];
          applyStep(example.steps[nextStep]);
          
          return nextStep;
        });
      }, newSpeed);
      
      setAnimationInterval(interval as unknown as number);
    }
  };
  
  // Get a color for the compilation stage
  const getStageColor = (stage: CompilationStage): string => {
    switch(stage) {
      case 'parsing': return '#64B5F6'; // Light Blue
      case 'baseline-compilation': return '#81C784'; // Light Green
      case 'optimization': return '#FFD54F'; // Light Yellow
      case 'execution': return '#7986CB'; // Light Indigo
      case 'deoptimization': return '#E57373'; // Light Red
      case 'garbage-collection': return '#BA68C8'; // Light Purple
      default: return '#A1A1A1'; // Gray
    }
  };
  
  // Render AST node visualization recursively
  const renderAstNode = (nodeId: string, level = 0): React.ReactElement => {
    const node = astData.ast[nodeId];
    if (!node) return <></>;
    
    return (
      <div key={nodeId} className="ast-node" style={{ marginLeft: `${level * 20}px` }}>
        <div className="ast-node-content">
          <span className="ast-node-type">{node.type}</span>
          {node.value && <span className="ast-node-value">{node.value}</span>}
        </div>
        {node.children && node.children.map(childId => renderAstNode(childId, level + 1))}
      </div>
    );
  };
  
  return (
    <div className="jit-compilation-visualizer">
      <div className="controls-container">
        <div className="example-selector">
          <label htmlFor="jit-example-select">Select Example:</label>
          <select 
            id="jit-example-select" 
            value={selectedExample} 
            onChange={handleExampleChange}
            disabled={isRunning}
          >
            {jitExamples.map(example => (
              <option key={example.id} value={example.id}>
                {example.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="animation-controls">
          <button 
            onClick={isRunning ? stopAnimation : startAnimation}
            className={isRunning ? 'stop' : 'start'}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetAnimation}>Reset</button>
          <button onClick={stepBackward} disabled={currentStep <= 0}>
            Step Back
          </button>
          <button onClick={stepForward} disabled={currentStep >= totalSteps - 1}>
            Step Forward
          </button>
          
          <div className="speed-control">
            <label htmlFor="jit-speed-slider">Speed:</label>
            <input 
              id="jit-speed-slider"
              type="range" 
              min="100" 
              max="2000" 
              step="100" 
              value={speed} 
              onChange={handleSpeedChange}
            />
            <span>{speed}ms</span>
          </div>
        </div>
      </div>
      
      <div className="jit-visualization-container">
        <div className="jit-panel jit-code-panel">
          <h3>Source Code</h3>
          <div className="code-container">
            <SyntaxHighlighter 
              language="javascript" 
              style={vscDarkPlus}
              wrapLines={true}
              showLineNumbers={true}
              lineProps={lineNumber => {
                const style: React.CSSProperties = { display: 'block' };
                if (lineNumber === currentLineNumber) {
                  style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
                  style.borderLeft = '3px solid yellow';
                }
                return { style };
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div className="jit-panel jit-pipeline-panel">
          <h3>JIT Compilation Pipeline</h3>
          <div className="pipeline-container">
            <div className="pipeline-stages">
              {(['parsing', 'baseline-compilation', 'optimization', 'execution', 'deoptimization'] as CompilationStage[]).map(stage => (
                <div 
                  key={stage}
                  className={`pipeline-stage ${stage === compilationStage ? 'active' : ''}`}
                  style={{
                    backgroundColor: stage === compilationStage ? getStageColor(stage) : 'transparent',
                    border: `2px solid ${getStageColor(stage)}`
                  }}
                >
                  {stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
              ))}
            </div>
            
            {/* AST Visualization */}
            {compilationStage === 'parsing' && (
              <div className="ast-container">
                <h4>Abstract Syntax Tree (AST)</h4>
                <div className="ast-tree">
                  {astData.rootNodeId && renderAstNode(astData.rootNodeId)}
                </div>
              </div>
            )}
            
            {/* Profiled Hotspots */}
            {(compilationStage === 'baseline-compilation' || compilationStage === 'optimization') && (
              <div className="hotspots-container">
                <h4>Function Profile</h4>
                {profiledHotspots.length > 0 ? (
                  <table className="hotspots-table">
                    <thead>
                      <tr>
                        <th>Function</th>
                        <th>Execution Count</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiledHotspots.map((hotspot, index) => (
                        <tr key={index}>
                          <td>{hotspot.functionName}</td>
                          <td>{hotspot.executionCount}</td>
                          <td>
                            {optimizedFunctions.includes(hotspot.functionName) ? (
                              <span className="optimized">Optimized</span>
                            ) : deoptimizedFunctions.includes(hotspot.functionName) ? (
                              <span className="deoptimized">Deoptimized</span>
                            ) : hotspot.executionCount > 100 ? (
                              <span className="hot">Hot</span>
                            ) : (
                              <span className="cold">Cold</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No functions profiled yet.</p>
                )}
              </div>
            )}
            
            {/* Call Stack Visualization */}
            <div className="call-stack-container">
              <h4>Call Stack</h4>
              <div className="call-stack">
                {callStack.length > 0 ? (
                  <div className="stack-frames">
                    {[...callStack].reverse().map((frame, index) => (
                      <div 
                        key={index} 
                        className={`stack-frame ${frame.isOptimized ? 'optimized' : ''}`}
                        title={frame.isOptimized ? 'Optimized execution' : 'Interpreted execution'}
                      >
                        {frame.name}
                        {frame.isOptimized && (
                          <span className="optimized-badge" title="JIT Optimized">⚡</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Call stack is empty</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Loop and Scope Chain Visualization */}
      {eventLoop && (eventLoop.taskQueue.length > 0 || eventLoop.microtaskQueue.length > 0) && (
        <div className="jit-panel jit-event-loop-panel">
          <h3>Event Loop</h3>
          <div className="event-loop-container">
            <div className="queue microtask-queue">
              <h4>Microtask Queue</h4>
              <div className="queue-items">
                {eventLoop.microtaskQueue.length > 0 ? (
                  eventLoop.microtaskQueue.map((task, index) => (
                    <div key={index} className="queue-item">{task}</div>
                  ))
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </div>
            <div className="queue task-queue">
              <h4>Task Queue</h4>
              <div className="queue-items">
                {eventLoop.taskQueue.length > 0 ? (
                  eventLoop.taskQueue.map((task, index) => (
                    <div key={index} className="queue-item">{task}</div>
                  ))
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Scope Chain Visualization */}
      {scopeChain && (
        <div className="jit-panel jit-scope-panel">
          <h3>Scope Chain</h3>
          <ScopeChainVisualizer scopeChain={scopeChain} />
        </div>
      )}
      
      <div className="description-panel">
        <h3>Step {currentStep + 1} of {totalSteps}: {compilationStage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Stage</h3>
        <p>{currentDescription}</p>
      </div>
    </div>
  );
};

export default JitCompilationVisualizer; 