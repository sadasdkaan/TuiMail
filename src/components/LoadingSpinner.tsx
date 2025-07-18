'use client'

import React from 'react'
import { asciiArt } from '@/lib/mock-data'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const [frame, setFrame] = React.useState(0)
  
  // Terminal-style loading animation frames
  const spinnerFrames = React.useMemo(() => ['|', '/', '-', '\\'], [])
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % spinnerFrames.length)
    }, 150)
    
    return () => clearInterval(interval)
  }, [spinnerFrames.length])

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className={`loading-spinner terminal-container text-center ${sizeClasses[size]} ${className}`}>
      <div className="loading-animation terminal-accent font-mono">
        <span className="inline-block w-4">{spinnerFrames[frame]}</span>
        <span className="ml-2">{message}</span>
      </div>
    </div>
  )
}

interface FullPageLoadingProps {
  message?: string
}

export function FullPageLoading({ message = 'Loading email client...' }: FullPageLoadingProps) {
  return (
    <div className="full-page-loading flex items-center justify-center min-h-screen bg-terminal-bg">
      <div className="text-center">
        <pre className="terminal-accent mb-4 text-sm">
          {asciiArt.logo}
        </pre>
        <LoadingSpinner size="large" message={message} />
        <div className="terminal-dim text-sm mt-4">
          Please wait while we connect to your email server...
        </div>
      </div>
    </div>
  )
}

interface InlineLoadingProps {
  message?: string
  className?: string
}

export function InlineLoading({ message = 'Loading...', className = '' }: InlineLoadingProps) {
  return (
    <div className={`inline-loading flex items-center gap-2 ${className}`}>
      <LoadingSpinner size="small" message="" />
      <span className="terminal-dim text-sm">{message}</span>
    </div>
  )
}

export default LoadingSpinner