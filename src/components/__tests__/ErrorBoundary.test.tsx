import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorBoundary, useErrorHandler, withErrorBoundary } from '../ErrorBoundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Mock component for testing HOC
const TestComponent = () => <div>Test component</div>

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error message when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Component Error')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('renders full page error when level is page', () => {
    render(
      <ErrorBoundary level="page">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const mockOnError = jest.fn()
    
    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    )
  })

  it('renders custom fallback when provided', () => {
    const CustomFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
      <div>
        <span>Custom error: {error.message}</span>
        <button onClick={retry}>Custom retry</button>
      </div>
    )
    
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument()
    expect(screen.getByText('Custom retry')).toBeInTheDocument()
  })

  it('resets error state when retry is clicked', () => {
    // Create a component that can toggle error state
    let shouldThrow = true
    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>No error</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Component Error')).toBeInTheDocument()
    
    const retryButton = screen.getByText('▶ Retry')
    
    // Change the error condition before clicking retry
    shouldThrow = false
    fireEvent.click(retryButton)
    
    // The error boundary should reset and re-render the component
    expect(screen.getByText('No error')).toBeInTheDocument()
  })
})

describe('useErrorHandler', () => {
  it('returns a function that handles errors', () => {
    let errorHandler: (error: Error) => void
    
    function TestComponent() {
      errorHandler = useErrorHandler()
      return <div>Test</div>
    }
    
    render(<TestComponent />)
    
    expect(typeof errorHandler!).toBe('function')
    
    // Should not throw when called
    expect(() => {
      errorHandler!(new Error('Test error'))
    }).not.toThrow()
  })
})

describe('withErrorBoundary', () => {
  it('wraps component with error boundary', () => {
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent />)
    
    expect(screen.getByText('Test component')).toBeInTheDocument()
  })

  it('handles errors in wrapped component', () => {
    const WrappedThrowError = withErrorBoundary(ThrowError)
    
    render(<WrappedThrowError shouldThrow={true} />)
    
    expect(screen.getByText('Component Error')).toBeInTheDocument()
  })

  it('passes error boundary props', () => {
    const mockOnError = jest.fn()
    const WrappedComponent = withErrorBoundary(ThrowError, {
      onError: mockOnError,
      level: 'page'
    })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(mockOnError).toHaveBeenCalled()
  })
})