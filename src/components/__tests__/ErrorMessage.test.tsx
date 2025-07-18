import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { 
  ErrorMessage, 
  NetworkError, 
  EmailOperationError, 
  FullPageError 
} from '../ErrorMessage'

describe('ErrorMessage', () => {
  it('renders with required props', () => {
    render(<ErrorMessage message="Test error message" />)
    
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders with custom title', () => {
    render(<ErrorMessage title="Custom Error" message="Test message" />)
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })

  it('shows details when provided', () => {
    render(<ErrorMessage message="Test message" details="Detailed error info" />)
    
    const detailsButton = screen.getByText('Show details')
    expect(detailsButton).toBeInTheDocument()
    
    fireEvent.click(detailsButton)
    expect(screen.getByText('Detailed error info')).toBeInTheDocument()
  })

  it('renders retry button when onRetry provided', () => {
    const mockRetry = jest.fn()
    render(<ErrorMessage message="Test message" onRetry={mockRetry} />)
    
    const retryButton = screen.getByText('▶ Retry')
    expect(retryButton).toBeInTheDocument()
    
    fireEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders dismiss button when onDismiss provided', () => {
    const mockDismiss = jest.fn()
    render(<ErrorMessage message="Test message" onDismiss={mockDismiss} />)
    
    const dismissButton = screen.getByText('▶ Dismiss')
    expect(dismissButton).toBeInTheDocument()
    
    fireEvent.click(dismissButton)
    expect(mockDismiss).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<ErrorMessage message="Test" variant="error" />)
    expect(screen.getByText('✗')).toBeInTheDocument()

    rerender(<ErrorMessage message="Test" variant="warning" />)
    expect(screen.getByText('⚠')).toBeInTheDocument()

    rerender(<ErrorMessage message="Test" variant="info" />)
    expect(screen.getByText('ℹ')).toBeInTheDocument()
  })
})

describe('NetworkError', () => {
  it('renders network error with default message', () => {
    render(<NetworkError />)
    
    expect(screen.getByText('Connection Error')).toBeInTheDocument()
    expect(screen.getByText('Unable to connect to email server')).toBeInTheDocument()
  })

  it('renders retry button when onRetry provided', () => {
    const mockRetry = jest.fn()
    render(<NetworkError onRetry={mockRetry} />)
    
    const retryButton = screen.getByText('▶ Retry')
    fireEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })
})

describe('EmailOperationError', () => {
  it('renders email operation error', () => {
    render(
      <EmailOperationError 
        operation="send email" 
        error="SMTP server unavailable" 
      />
    )
    
    expect(screen.getByText('Failed to send email')).toBeInTheDocument()
    expect(screen.getByText('SMTP server unavailable')).toBeInTheDocument()
  })

  it('renders action buttons when provided', () => {
    const mockRetry = jest.fn()
    const mockDismiss = jest.fn()
    
    render(
      <EmailOperationError 
        operation="send email" 
        error="Test error"
        onRetry={mockRetry}
        onDismiss={mockDismiss}
      />
    )
    
    expect(screen.getByText('▶ Retry')).toBeInTheDocument()
    expect(screen.getByText('▶ Dismiss')).toBeInTheDocument()
  })
})

describe('FullPageError', () => {
  it('renders full page error', () => {
    render(<FullPageError message="Application crashed" />)
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(screen.getByText('Application crashed')).toBeInTheDocument()
    expect(screen.getByText('If this problem continues, please contact support.')).toBeInTheDocument()
  })

  it('renders with custom title', () => {
    render(<FullPageError title="Custom Error" message="Test message" />)
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })

  it('renders retry button when provided', () => {
    const mockRetry = jest.fn()
    render(<FullPageError message="Test message" onRetry={mockRetry} />)
    
    const retryButton = screen.getByText('▶ Retry')
    fireEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })
})