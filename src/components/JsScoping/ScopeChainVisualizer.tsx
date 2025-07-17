import React from 'react'
import type { ScopeChain, Scope, ScopeVariable } from './types'

interface ScopeChainVisualizerProps {
  scopeChain: ScopeChain
}

const ScopeChainVisualizer: React.FC<ScopeChainVisualizerProps> = ({ scopeChain }) => {
  // Function to render a single scope
  const renderScope = (scopeId: string, depth: number = 0) => {
    const scope = scopeChain.scopes[scopeId]
    if (!scope) return null

    const isActive = scopeId === scopeChain.activeScopeId
    
    return (
      <div 
        key={scope.id} 
        className={`scope-box ${isActive ? 'active-scope' : ''}`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="scope-header">
          <h4>{scope.name}</h4>
        </div>
        <div className="scope-variables">
          {scope.variables.length > 0 ? (
            <table className="variables-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {scope.variables.map(variable => renderVariable(variable))}
              </tbody>
            </table>
          ) : (
            <p className="empty-scope">No variables in this scope</p>
          )}
        </div>
        
        {/* Render child scopes if any */}
        {scope.children && scope.children.length > 0 && (
          <div className="child-scopes">
            {scope.children.map(childId => renderScope(childId, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  // Function to render a single variable
  const renderVariable = (variable: ScopeVariable) => {
    return (
      <tr key={variable.id} className={`variable-row variable-type-${variable.type}`}>
        <td className="variable-type">{variable.type}</td>
        <td className="variable-name">{variable.name}</td>
        <td className="variable-value">{variable.value}</td>
      </tr>
    )
  }
  
  // If no scopes are defined yet, show a placeholder
  if (!scopeChain.rootScopeId || Object.keys(scopeChain.scopes).length === 0) {
    return (
      <div className="scope-chain-container empty">
        <p>No scope information available yet. Start the visualization to see scopes.</p>
      </div>
    )
  }
  
  return (
    <div className="scope-chain-container">
      <h3>Scope Chain</h3>
      <div className="scope-tree">
        {renderScope(scopeChain.rootScopeId)}
      </div>
    </div>
  )
}

export default ScopeChainVisualizer 