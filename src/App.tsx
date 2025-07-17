import { useState } from 'react'
import './App.css'
import EventLoopVisualizer from './components/EventLoop/EventLoopVisualizer'
import EventLoopExplanation from './components/EventLoop/EventLoopExplanation'
import ScopeVisualizer from './components/JsScoping/ScopeVisualizer'
import JsScopingExplanation from './components/JsScoping/JsScopingExplanation'

function App() {
  const [currentTool, setCurrentTool] = useState<'event-loop' | 'js-scoping' | 'jit-compilation'>('event-loop')
  const [currentView, setCurrentView] = useState<'visualizer' | 'explanation'>('visualizer')

  const toggleView = () => {
    setCurrentView(currentView === 'visualizer' ? 'explanation' : 'visualizer')
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-title">
          <h1>JavaScript Visualizers</h1>
          <div className="tool-selector">
            <button 
              className={currentTool === 'event-loop' ? 'active' : ''}
              onClick={() => setCurrentTool('event-loop')}
            >
              Event Loop
            </button>
            <button 
              className={currentTool === 'js-scoping' ? 'active' : ''}
              onClick={() => setCurrentTool('js-scoping')}
            >
              Scoping & Features
            </button>
            <button 
              className={currentTool === 'jit-compilation' ? 'active' : ''}
              onClick={() => setCurrentTool('jit-compilation')}
            >
              JIT Compilation
            </button>
          </div>
      </div>
        <button className="view-toggle-button" onClick={toggleView}>
          {currentView === 'visualizer' ? 'View Explanation' : 'Back to Visualizer'}
        </button>
      </header>

      <div className="app-content">
        {currentTool === 'event-loop' ? (
          currentView === 'visualizer' ? (
            <EventLoopVisualizer />
          ) : (
            <EventLoopExplanation />
          )
        ) : currentTool === 'js-scoping' ? (
          currentView === 'visualizer' ? (
            <ScopeVisualizer />
          ) : (
            <JsScopingExplanation />
          )
        ) : (
          // JIT compilation - automatically shows the JIT tab in scope visualizer
          <ScopeVisualizer activeTab="jit-compilation" />
        )}
      </div>
    </div>
  )
}

export default App
