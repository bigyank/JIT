import { useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CodeBlock as CodeBlockType } from './types'

interface CodeBlockProps {
  codeBlock: CodeBlockType
}

const CodeBlock = ({ codeBlock }: CodeBlockProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to the active line when it changes
  useEffect(() => {
    if (containerRef.current && codeBlock.currentLine > 0) {
      // Find the line element by its line number
      const lineElement = containerRef.current.querySelector(`[data-line-number="${codeBlock.currentLine}"]`)
      
      if (lineElement) {
        // Get the container's scrollable content area
        const contentArea = containerRef.current.querySelector('.code-content')
        if (contentArea) {
          // Calculate scroll position to center the line
          const lineTop = lineElement.getBoundingClientRect().top
          const containerTop = contentArea.getBoundingClientRect().top
          const relativeTop = lineTop - containerTop
          
          // Scroll to position
          contentArea.scrollTop = contentArea.scrollTop + relativeTop - contentArea.clientHeight / 2
        }
      }
    }
  }, [codeBlock.currentLine])

  // Create raw code string from code lines
  const rawCode = codeBlock.code.map(line => line.content).join('\n')

  // Create line props for highlighting the current line
  const lineProps = (lineNumber: number) => {
    const isHighlighted = lineNumber + 1 === codeBlock.currentLine
    const isExecuted = codeBlock.code.find(line => line.lineNumber === lineNumber + 1)?.isExecuted
    
    return {
      style: {
        display: 'block',
        backgroundColor: isHighlighted ? 'rgba(62, 68, 81, 0.6)' : undefined,
        borderLeft: isHighlighted ? '3px solid #61afef' : undefined,
        paddingLeft: isHighlighted ? '13px' : '16px',
        color: isExecuted ? '#98c379' : undefined
      },
      'data-line-number': lineNumber + 1
    }
  }

  return (
    <div className="code-container" ref={containerRef}>
      <div className="code-header">
        <span className="code-title">{codeBlock.title}</span>
      </div>
      <div className="code-content">
        <SyntaxHighlighter
          language="javascript"
          style={vscDarkPlus}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            textAlign: 'right',
            color: '#636d83'
          }}
          lineProps={lineProps}
          customStyle={{
            margin: 0,
            padding: '16px 0',
            backgroundColor: 'transparent',
            fontSize: '14px',
            lineHeight: '24px'
          }}
          wrapLines={true}
        >
          {rawCode}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default CodeBlock 