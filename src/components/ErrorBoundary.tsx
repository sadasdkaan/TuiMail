'use client'

import React from 'react'
import { ErrorMessage, FullPageError } from './ErrorMessage'
import { asciiArt } from '@/lib/mock-data'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: 'page' | 'component'
  className?: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo)

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: Fallback, level = 'component', className = '' } = this.props

      // Use custom fallback if provided
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />
      }

      // Full page error for page-level boundaries
      if (level === 'page') {
        return (
          <FullPageError
            title="Application Error"
            message={this.state.error.message || 'An unexpected error occurred'}
            onRetry={this.handleRetry}
            className={className}
          />
        )
      }

      // Component-level error display
      return (
        <div className={`error-boundary-fallback ${className}`}>
          <ErrorMessage
            title="Component Error"
            message={this.state.error.message || 'This component encountered an error'}
            details={process.env.NODE_ENV === 'development' ? this.state.error.stack : undefined}
            onRetry={this.handleRetry}
            variant="error"
          />
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by useErrorHandler:', error, errorInfo)
    }
    
    // In production, send to error reporting service
    // Example: Sentry.captureException(error)
  }, [])
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Specialized error boundaries for different parts of the app
export function EmailListErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      onError={(error, errorInfo) => {
        console.error('Email list error:', error, errorInfo)
      }}
      fallback={({ error, retry }) => (
        <div className="email-list-error terminal-container p-4">
          <div className="text-center">
            <pre className="terminal-error text-sm mb-4">
              {asciiArt.errorBox}
            </pre>
            <ErrorMessage
              title="Email List Error"
              message="Unable to display email list"
              details={error.message}
              onRetry={retry}
              variant="error"
            />
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export function EmailViewerErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      onError={(error, errorInfo) => {
        console.error('Email viewer error:', error, errorInfo)
      }}
      fallback={({ error, retry }) => (
        <div className="email-viewer-error terminal-container p-4">
          <ErrorMessage
            title="Email Viewer Error"
            message="Unable to display email content"
            details={error.message}
            onRetry={retry}
            variant="error"
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export function ComposeFormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      onError={(error, errorInfo) => {
        console.error('Compose form error:', error, errorInfo)
      }}
      fallback={({ error, retry }) => (
        <div className="compose-form-error terminal-container p-4">
          <ErrorMessage
            title="Compose Form Error"
            message="Unable to display compose form"
            details={error.message}
            onRetry={retry}
            variant="error"
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary