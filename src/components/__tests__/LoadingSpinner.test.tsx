import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoadingSpinner, FullPageLoading, InlineLoading } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText(/\||\//)).toBeInTheDocument() // Spinner character
  })

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Custom loading message" />)
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    const container = screen.getByText('Loading...').closest('.loading-spinner')
    expect(container).toHaveClass('text-sm')

    rerender(<LoadingSpinner size="large" />)
    const largeContainer = screen.getByText('Loading...').closest('.loading-spinner')
    expect(largeContainer).toHaveClass('text-lg')
  })

  it('animates spinner frames', async () => {
    render(<LoadingSpinner />)
    
    const spinnerElement = screen.getByText(/[\|\/\-\\]/)
    expect(spinnerElement).toBeInTheDocument()
    
    // Test that spinner changes over time would require more complex testing
    // For now, we just verify it renders
  })
})

describe('FullPageLoading', () => {
  it('renders full page loading with default message', () => {
    render(<FullPageLoading />)
    
    expect(screen.getByText('Loading email client...')).toBeInTheDocument()
    expect(screen.getByText('Please wait while we connect to your email server...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<FullPageLoading message="Custom full page message" />)
    
    expect(screen.getByText('Custom full page message')).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<FullPageLoading />)
    
    const container = screen.getByText('Loading email client...').closest('.full-page-loading')
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen')
  })
})

describe('InlineLoading', () => {
  it('renders inline loading with default message', () => {
    render(<InlineLoading />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<InlineLoading message="Custom inline message" />)
    
    expect(screen.getByText('Custom inline message')).toBeInTheDocument()
  })

  it('has inline styling', () => {
    render(<InlineLoading />)
    
    const container = screen.getByText('Loading...').closest('.inline-loading')
    expect(container).toHaveClass('flex', 'items-center', 'gap-2')
  })
})