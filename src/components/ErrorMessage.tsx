'use client'

import React from 'react'
import { asciiArt } from '@/lib/mock-data'

interface ErrorMessageProps {
  title?: string
  message: string
  details?: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
  variant?: 'error' | 'warning' | 'info'
}

export function ErrorMessage({
  title = 'Error',
  message,
  details,
  onRetry,
  onDismiss,
  className = '',
  variant = 'error'
}: ErrorMessageProps) {
  const variantClasses = {
    error: 'border-terminal-error text-terminal-error',
    warning: 'border-terminal-warning text-terminal-warning',
    info: 'border-terminal-info text-terminal-info'
  }

  const variantIcons = {
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`error-message terminal-border ${variantClasses[variant]} p-4 ${className}`}>
      <div className="error-header flex items-start gap-2 mb-2">
        <span className="error-icon text-lg" aria-hidden="true">
          {variantIcons[variant]}
        </span>
        <div className="error-content flex-1">
          <h3 className="error-title font-bold text-base mb-1">
            {title}
          </h3>
          <p className="error-message text-sm">
            {message}
          </p>
          {details && (
            <details className="error-details mt-2">
              <summary className="cursor-pointer text-xs terminal-dim hover:terminal-accent">
                Show details
              </summary>
              <pre className="error-details-content text-xs terminal-dim mt-1 whitespace-pre-wrap font-mono">
                {details}
              </pre>
            </details>
          )}
        </div>
      </div>
      
      {(onRetry || onDismiss) && (
        <div className="error-actions flex gap-2 mt-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="terminal-info hover:bg-terminal-info hover:text-terminal-bg px-3 py-1 text-sm"
            >
              ▶ Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="terminal-dim hover:terminal-accent px-3 py-1 text-sm"
            >
              ▶ Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface NetworkErrorProps {
  onRetry?: () => void
  className?: string
}

export function NetworkError({ onRetry, className = '' }: NetworkErrorProps) {
  return (
    <ErrorMessage
      title="Connection Error"
      message="Unable to connect to email server"
      details="Please check your internet connection and try again. If the problem persists, the email server may be temporarily unavailable."
      onRetry={onRetry}
      className={className}
      variant="error"
    />
  )
}

interface EmailOperationErrorProps {
  operation: string
  error: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function EmailOperationError({
  operation,
  error,
  onRetry,
  onDismiss,
  className = ''
}: EmailOperationErrorProps) {
  return (
    <ErrorMessage
      title={`Failed to ${operation}`}
      message={error}
      onRetry={onRetry}
      onDismiss={onDismiss}
      className={className}
      variant="error"
    />
  )
}

interface FullPageErrorProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function FullPageError({
  title = 'Application Error',
  message,
  onRetry,
  className = ''
}: FullPageErrorProps) {
  return (
    <div className={`full-page-error flex items-center justify-center min-h-screen bg-terminal-bg ${className}`}>
      <div className="text-center max-w-md">
        <pre className="terminal-error mb-4 text-sm">
          {asciiArt.errorBox}
        </pre>
        <ErrorMessage
          title={title}
          message={message}
          onRetry={onRetry}
          variant="error"
        />
        <div className="terminal-dim text-sm mt-4">
          If this problem continues, please contact support.
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage