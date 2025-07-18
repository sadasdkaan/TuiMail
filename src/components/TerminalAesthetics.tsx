'use client'

import { useState, useEffect } from 'react'
import { asciiArt } from '@/lib/mock-data'

interface TerminalAestheticsProps {
  showDemo?: boolean
  className?: string
}

export default function TerminalAesthetics({ 
  showDemo = false, 
  className = '' 
}: TerminalAestheticsProps) {
  const [currentSpinner, setCurrentSpinner] = useState(0)
  const [typewriterText, setTypewriterText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  
  const demoText = 'Welcome to Terminal Email Client...'

  // Spinner animation
  useEffect(() => {
    if (!showDemo) return
    
    const interval = setInterval(() => {
      setCurrentSpinner(prev => (prev + 1) % asciiArt.spinner.length)
    }, 100)
    
    return () => clearInterval(interval)
  }, [showDemo])

  // Typewriter effect
  useEffect(() => {
    if (!showDemo) return
    
    let index = 0
    const interval = setInterval(() => {
      if (index <= demoText.length) {
        setTypewriterText(demoText.substring(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [showDemo, demoText])

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  if (!showDemo) {
    return null
  }

  return (
    <div className={`terminal-aesthetics-demo ${className}`}>
      {/* ASCII Art Banner */}
      <div className="terminal-border p-4 mb-4 bg-terminal-bg">
        <pre className="terminal-accent text-center text-xs leading-tight">
          {asciiArt.miniLogo}
        </pre>
      </div>

      {/* Cursor Variations Demo */}
      <div className="terminal-border p-4 mb-4">
        <h3 className="terminal-accent font-bold mb-2">Cursor Styles:</h3>
        <div className="space-y-2 font-mono">
          <div className="flex items-center gap-4">
            <span>Block cursor:</span>
            <span className="terminal-cursor"></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Line cursor:</span>
            <span className="terminal-cursor-line"></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Block cursor:</span>
            <span className="terminal-cursor-block"></span>
          </div>
        </div>
      </div>

      {/* Typewriter Effect Demo */}
      <div className="terminal-border p-4 mb-4">
        <h3 className="terminal-accent font-bold mb-2">Typewriter Effect:</h3>
        <div className="font-mono terminal-glow">
          {typewriterText}
          {showCursor && <span className="terminal-accent">█</span>}
        </div>
      </div>

      {/* Loading Spinner Demo */}
      <div className="terminal-border p-4 mb-4">
        <h3 className="terminal-accent font-bold mb-2">Loading Animation:</h3>
        <div className="flex items-center gap-2 font-mono">
          <span className="terminal-info text-lg">
            {asciiArt.spinner[currentSpinner]}
          </span>
          <span>Processing...</span>
        </div>
      </div>

      {/* ASCII Borders Demo */}
      <div className="terminal-border p-4 mb-4">
        <h3 className="terminal-accent font-bold mb-2">ASCII Borders:</h3>
        <div className="space-y-3 font-mono text-sm">
          {/* Simple Box */}
          <div>
            <div className="terminal-dim">Simple:</div>
            <div className="terminal-fg">
              {asciiArt.boxes.simple.topLeft}{asciiArt.boxes.simple.horizontal.repeat(20)}{asciiArt.boxes.simple.topRight}
              <br />
              {asciiArt.boxes.simple.vertical}{' '.repeat(20)}{asciiArt.boxes.simple.vertical}
              <br />
              {asciiArt.boxes.simple.bottomLeft}{asciiArt.boxes.simple.horizontal.repeat(20)}{asciiArt.boxes.simple.bottomRight}
            </div>
          </div>

          {/* Double Box */}
          <div>
            <div className="terminal-dim">Double:</div>
            <div className="terminal-accent">
              {asciiArt.boxes.double.topLeft}{asciiArt.boxes.double.horizontal.repeat(20)}{asciiArt.boxes.double.topRight}
              <br />
              {asciiArt.boxes.double.vertical}{' '.repeat(20)}{asciiArt.boxes.double.vertical}
              <br />
              {asciiArt.boxes.double.bottomLeft}{asciiArt.boxes.double.horizontal.repeat(20)}{asciiArt.boxes.double.bottomRight}
            </div>
          </div>

          {/* Rounded Box */}
          <div>
            <div className="terminal-dim">Rounded:</div>
            <div className="terminal-success">
              {asciiArt.boxes.rounded.topLeft}{asciiArt.boxes.rounded.horizontal.repeat(20)}{asciiArt.boxes.rounded.topRight}
              <br />
              {asciiArt.boxes.rounded.vertical}{' '.repeat(20)}{asciiArt.boxes.rounded.vertical}
              <br />
              {asciiArt.boxes.rounded.bottomLeft}{asciiArt.boxes.rounded.horizontal.repeat(20)}{asciiArt.boxes.rounded.bottomRight}
            </div>
          </div>
        </div>
      </div>

      {/* Status Icons Demo */}
      <div className="terminal-border p-4 mb-4">
        <h3 className="terminal-accent font-bold mb-2">Status Icons:</h3>
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="terminal-accent">{asciiArt.statusIcons.unread}</span>
            <span>Unread</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="terminal-dim">{asciiArt.statusIcons.read}</span>
            <span>Read</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="terminal-warning">{asciiArt.statusIcons.flagged}</span>
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="terminal-info">{asciiArt.statusIcons.attachment}</span>
            <span>Attachment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="terminal-success">{asciiArt.statusIcons.star}</span>
            <span>Important</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="terminal-dim">{asciiArt.statusIcons.draft}</span>
            <span>Draft</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Demo */}
      <div className="terminal-border p-4 mb-4">
        <h3 className="terminal-accent font-bold mb-2">Progress Indicators:</h3>
        <div className="space-y-2 font-mono">
          <div>
            <div className="terminal-dim text-sm mb-1">Loading: 75%</div>
            <div className="flex">
              <span className="terminal-success">
                {asciiArt.progressBar.filled.repeat(15)}
              </span>
              <span className="terminal-dim">
                {asciiArt.progressBar.empty.repeat(5)}
              </span>
            </div>
          </div>
          <div>
            <div className="terminal-dim text-sm mb-1">Processing: 40%</div>
            <div className="flex">
              <span className="terminal-warning">
                {asciiArt.progressBar.filled.repeat(8)}
              </span>
              <span className="terminal-dim">
                {asciiArt.progressBar.empty.repeat(12)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Separators Demo */}
      <div className="terminal-border p-4">
        <h3 className="terminal-accent font-bold mb-2">Separators:</h3>
        <div className="space-y-2 font-mono text-xs">
          <div>
            <div className="terminal-dim mb-1">Thin:</div>
            <div className="terminal-fg">{asciiArt.thinSeparator.substring(0, 40)}</div>
          </div>
          <div>
            <div className="terminal-dim mb-1">Double:</div>
            <div className="terminal-accent">{asciiArt.separator.substring(0, 40)}</div>
          </div>
          <div>
            <div className="terminal-dim mb-1">Decorative:</div>
            <div className="terminal-success">{asciiArt.doubleSeparator.substring(0, 40)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility component for creating ASCII boxes
export function AsciiBox({ 
  children, 
  style = 'simple', 
  className = '',
  title 
}: {
  children: React.ReactNode
  style?: 'simple' | 'double' | 'rounded'
  className?: string
  title?: string
}) {
  const box = asciiArt.boxes[style]
  
  return (
    <div className={`ascii-box font-mono ${className}`}>
      {title && (
        <div className="terminal-accent font-bold mb-1">{title}</div>
      )}
      <div className="terminal-border bg-terminal-hover p-2">
        <pre className="whitespace-pre-wrap text-sm">
          {box.topLeft}{box.horizontal.repeat(30)}{box.topRight}
          {'\n'}
          {box.vertical}{' '.repeat(30)}{box.vertical}
          {'\n'}
          <span className="terminal-fg">{children}</span>
          {'\n'}
          {box.vertical}{' '.repeat(30)}{box.vertical}
          {'\n'}
          {box.bottomLeft}{box.horizontal.repeat(30)}{box.bottomRight}
        </pre>
      </div>
    </div>
  )
}

// Utility component for terminal-style notifications
export function TerminalNotification({ 
  type = 'info', 
  message, 
  onClose,
  autoClose = false,
  duration = 3000 
}: {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  if (!visible) return null

  const getIcon = () => {
    switch (type) {
      case 'success': return asciiArt.checkmark
      case 'error': return asciiArt.cross
      case 'warning': return asciiArt.statusIcons.important
      default: return asciiArt.statusIcons.star
    }
  }

  const getColorClass = () => {
    switch (type) {
      case 'success': return 'terminal-success'
      case 'error': return 'terminal-error'
      case 'warning': return 'terminal-warning'
      default: return 'terminal-info'
    }
  }

  return (
    <div className={`terminal-notification terminal-border p-3 mb-2 bg-terminal-hover ${getColorClass()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-lg">{getIcon()}</span>
          <span>{message}</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false)
              onClose()
            }}
            className="terminal-dim hover:terminal-accent ml-4"
            aria-label="Close notification"
          >
            {asciiArt.cross}
          </button>
        )}
      </div>
    </div>
  )
}