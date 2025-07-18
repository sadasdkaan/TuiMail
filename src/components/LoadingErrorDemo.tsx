'use client'

import React, { useState } from 'react'
import { LoadingSpinner, FullPageLoading, InlineLoading } from './LoadingSpinner'
import { ErrorMessage, NetworkError, EmailOperationError, FullPageError } from './ErrorMessage'
import { ErrorBoundary } from './ErrorBoundary'
import { useAsyncOperation, useEmailOperation } from '@/hooks/useAsyncOperation'
import { NotificationProvider, useNotificationHelpers } from './NotificationSystem'

// Mock async operations for demonstration
const mockSuccessOperation = () => new Promise<string>(resolve => 
  setTimeout(() => resolve('Operation completed successfully!'), 2000)
)

const mockFailureOperation = () => new Promise<string>((_, reject) => 
  setTimeout(() => reject(new Error('Network error: Unable to connect to server')), 1500)
)

const mockRetryOperation = () => {
  let attempts = 0
  return () => new Promise<string>((resolve, reject) => {
    attempts++
    setTimeout(() => {
      if (attempts < 3) {
        reject(new Error(`Attempt ${attempts} failed`))
      } else {
        resolve('Success after retries!')
      }
    }, 1000)
  })
}

// Component that throws an error for testing error boundaries
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Intentional error for testing error boundary')
  }
  return <div className="terminal-success p-4">Component rendered successfully!</div>
}

function LoadingErrorDemoContent() {
  const [showFullPageLoading, setShowFullPageLoading] = useState(false)
  const [showFullPageError, setShowFullPageError] = useState(false)
  const [throwError, setThrowError] = useState(false)
  const { showSuccess, showError, showWarning, showInfo } = useNotificationHelpers()

  // Async operation hooks
  const successOperation = useAsyncOperation(mockSuccessOperation, {
    showSuccessNotification: true,
    successMessage: 'Async operation completed!'
  })

  const failureOperation = useAsyncOperation(mockFailureOperation, {
    showErrorNotification: true,
    errorMessage: 'Async operation failed!'
  })

  const retryOperationFn = mockRetryOperation()
  const retryOperation = useEmailOperation(retryOperationFn, 'retry test')

  const handleNotificationTest = (type: string) => {
    switch (type) {
      case 'success':
        showSuccess('Success!', 'This is a success notification')
        break
      case 'error':
        showError('Error!', 'This is an error notification')
        break
      case 'warning':
        showWarning('Warning!', 'This is a warning notification')
        break
      case 'info':
        showInfo('Info!', 'This is an info notification')
        break
    }
  }

  if (showFullPageLoading) {
    return <FullPageLoading message="Demo loading state..." />
  }

  if (showFullPageError) {
    return (
      <FullPageError
        title="Demo Error"
        message="This is a demonstration of the full page error component"
        onRetry={() => setShowFullPageError(false)}
      />
    )
  }

  return (
    <div className="loading-error-demo terminal-container p-6 space-y-8">
      <div className="demo-header">
        <h1 className="text-2xl font-bold terminal-accent mb-2">
          ┌─ LOADING STATES & ERROR HANDLING DEMO ─┐
        </h1>
        <p className="terminal-dim">
          Demonstration of loading spinners, error messages, notifications, and retry logic
        </p>
      </div>

      {/* Loading Spinners Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Loading Spinners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="demo-card terminal-border p-4">
            <h3 className="font-bold mb-2">Small Spinner</h3>
            <LoadingSpinner size="small" message="Loading..." />
          </div>
          <div className="demo-card terminal-border p-4">
            <h3 className="font-bold mb-2">Medium Spinner</h3>
            <LoadingSpinner size="medium" message="Processing..." />
          </div>
          <div className="demo-card terminal-border p-4">
            <h3 className="font-bold mb-2">Large Spinner</h3>
            <LoadingSpinner size="large" message="Please wait..." />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Inline Loading</h3>
          <InlineLoading message="Fetching data..." />
        </div>
      </section>

      {/* Error Messages Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Error Messages</h2>
        <div className="space-y-4">
          <ErrorMessage
            title="General Error"
            message="This is a general error message"
            details="Stack trace or additional error details would go here"
            onRetry={() => console.log('Retry clicked')}
            onDismiss={() => console.log('Dismiss clicked')}
            variant="error"
          />
          <NetworkError onRetry={() => console.log('Network retry clicked')} />
          <EmailOperationError
            operation="send email"
            error="SMTP server is temporarily unavailable"
            onRetry={() => console.log('Email retry clicked')}
            onDismiss={() => console.log('Email dismiss clicked')}
          />
        </div>
      </section>

      {/* Async Operations Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Async Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="demo-card terminal-border p-4">
            <h3 className="font-bold mb-2">Success Operation</h3>
            <button
              onClick={() => successOperation.execute()}
              disabled={successOperation.loading}
              className="terminal-success hover:bg-terminal-success hover:text-terminal-bg mb-2"
            >
              {successOperation.loading ? 'Running...' : 'Start Success Op'}
            </button>
            {successOperation.loading && <InlineLoading message="Running success operation..." />}
            {successOperation.data && (
              <div className="terminal-success text-sm">{successOperation.data}</div>
            )}
          </div>

          <div className="demo-card terminal-border p-4">
            <h3 className="font-bold mb-2">Failure Operation</h3>
            <button
              onClick={() => failureOperation.execute()}
              disabled={failureOperation.loading}
              className="terminal-error hover:bg-terminal-error hover:text-terminal-bg mb-2"
            >
              {failureOperation.loading ? 'Running...' : 'Start Failure Op'}
            </button>
            {failureOperation.loading && <InlineLoading message="Running failure operation..." />}
            {failureOperation.error && (
              <div className="terminal-error text-sm">{failureOperation.error.message}</div>
            )}
          </div>

          <div className="demo-card terminal-border p-4">
            <h3 className="font-bold mb-2">Retry Operation</h3>
            <button
              onClick={() => retryOperation.execute()}
              disabled={retryOperation.loading}
              className="terminal-info hover:bg-terminal-info hover:text-terminal-bg mb-2"
            >
              {retryOperation.loading ? 'Retrying...' : 'Start Retry Op'}
            </button>
            {retryOperation.loading && <InlineLoading message="Attempting with retries..." />}
            {retryOperation.data && (
              <div className="terminal-success text-sm">{retryOperation.data}</div>
            )}
            {retryOperation.error && (
              <div className="terminal-error text-sm">{retryOperation.error.message}</div>
            )}
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Notifications</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleNotificationTest('success')}
            className="terminal-success hover:bg-terminal-success hover:text-terminal-bg"
          >
            Show Success
          </button>
          <button
            onClick={() => handleNotificationTest('error')}
            className="terminal-error hover:bg-terminal-error hover:text-terminal-bg"
          >
            Show Error
          </button>
          <button
            onClick={() => handleNotificationTest('warning')}
            className="terminal-warning hover:bg-terminal-warning hover:text-terminal-bg"
          >
            Show Warning
          </button>
          <button
            onClick={() => handleNotificationTest('info')}
            className="terminal-info hover:bg-terminal-info hover:text-terminal-bg"
          >
            Show Info
          </button>
        </div>
      </section>

      {/* Error Boundary Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Error Boundary</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setThrowError(!throwError)}
              className="terminal-warning hover:bg-terminal-warning hover:text-terminal-bg"
            >
              {throwError ? 'Fix Component' : 'Break Component'}
            </button>
          </div>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={throwError} />
          </ErrorBoundary>
        </div>
      </section>

      {/* Full Page States Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Full Page States</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFullPageLoading(true)}
            className="terminal-info hover:bg-terminal-info hover:text-terminal-bg"
          >
            Show Full Page Loading
          </button>
          <button
            onClick={() => setShowFullPageError(true)}
            className="terminal-error hover:bg-terminal-error hover:text-terminal-bg"
          >
            Show Full Page Error
          </button>
        </div>
      </section>

      {/* Reset Section */}
      <section className="demo-section">
        <h2 className="text-lg font-bold terminal-accent mb-4">Reset</h2>
        <button
          onClick={() => {
            successOperation.reset()
            failureOperation.reset()
            retryOperation.reset()
            setThrowError(false)
          }}
          className="terminal-dim hover:terminal-accent"
        >
          Reset All Operations
        </button>
      </section>
    </div>
  )
}

export function LoadingErrorDemo() {
  return (
    <NotificationProvider>
      <LoadingErrorDemoContent />
    </NotificationProvider>
  )
}

export default LoadingErrorDemo