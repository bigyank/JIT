import type { StackItem, QueueItem } from './types'
import { EventLoopPhase } from './types'

interface MemoryModelProps {
  callStack: StackItem[]
  callbackQueue: QueueItem[]
  microtaskQueue: QueueItem[]
  currentPhase: EventLoopPhase
}

const MemoryModel = ({ callStack, callbackQueue, microtaskQueue, currentPhase }: MemoryModelProps) => {
  return (
    <div className="memory-model">
      <div className="model-section">
        <div className="section-header">Call Stack</div>
        <div className="section-content">
          {callStack.length === 0 ? (
            <div className="empty-state">Stack is empty</div>
          ) : (
            [...callStack].reverse().map((item) => (
              <div key={item.id} className="stack-item fade-in">
                <div>{item.name}</div>
                {item.lineNumber && (
                  <small>Line: {item.lineNumber}</small>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="model-section">
        <div className="section-header">Task Queue</div>
        <div className="section-content">
          <div className="queue-container">
            {callbackQueue.length === 0 ? (
              <div className="empty-state">Queue is empty</div>
            ) : (
              callbackQueue.map((item) => (
                <div key={item.id} className="queue-item fade-in">
                  <div>{item.name}</div>
                  {item.lineNumber && (
                    <small>Line: {item.lineNumber}</small>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="model-section">
        <div className="section-header">Microtask Queue</div>
        <div className="section-content">
          {microtaskQueue.length === 0 ? (
            <div className="empty-state">Queue is empty</div>
          ) : (
            microtaskQueue.map((item) => (
              <div key={item.id} className="microtask-item fade-in">
                <div>{item.name}</div>
                {item.lineNumber && (
                  <small>Line: {item.lineNumber}</small>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="model-section">
        <div className="section-header">Current Phase</div>
        <div className="section-content">
          <div className="phase-display">
            <div className={`phase-indicator ${currentPhase.toLowerCase()}`}>
              {currentPhase}
            </div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color legend-call-stack"></div>
              <span>Call Stack</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-callback-queue"></div>
              <span>Task Queue</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-microtasks"></div>
              <span>Microtasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryModel 