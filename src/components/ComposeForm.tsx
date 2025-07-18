'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { ComposeData } from '@/lib/types'
import { useGlobalKeyboard } from '@/hooks/useGlobalKeyboard'
import { useResponsiveLayout, useTouchFriendly } from '@/hooks/useResponsive'
import { InlineLoading } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { ComposeFormErrorBoundary } from './ErrorBoundary'

interface ComposeFormProps {
  initialData?: Partial<ComposeData>
  onSend?: (data: ComposeData) => Promise<void>
  onCancel?: () => void
  onSaveDraft?: (data: ComposeData) => Promise<void>
  className?: string
  autoFocus?: boolean
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

interface FormErrors {
  to?: string
  subject?: string
  body?: string
}

export function ComposeForm({
  initialData = {},
  onSend,
  onCancel,
  onSaveDraft,
  className = '',
  autoFocus = true,
  loading = false,
  error = null,
  onRetry
}: ComposeFormProps) {
  // Responsive hooks
  const { shouldUseMobileLayout, getResponsivePadding, getResponsiveTransition } = useResponsiveLayout()
  const { minTouchTarget, touchSpacing } = useTouchFriendly()

  // Form state
  const [formData, setFormData] = useState<ComposeData>({
    to: initialData.to || '',
    cc: initialData.cc || '',
    bcc: initialData.bcc || '',
    subject: initialData.subject || '',
    body: initialData.body || '',
    isDraft: initialData.isDraft || false
  })

  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCcBcc, setShowCcBcc] = useState(false)

  // Refs for form elements
  const toInputRef = useRef<HTMLInputElement>(null)
  const subjectInputRef = useRef<HTMLInputElement>(null)
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus the first empty field
  useEffect(() => {
    if (autoFocus) {
      if (!formData.to) {
        toInputRef.current?.focus()
      } else if (!formData.subject) {
        subjectInputRef.current?.focus()
      } else {
        bodyTextareaRef.current?.focus()
      }
    }
  }, [autoFocus, formData.to, formData.subject])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Validate To field
    if (!formData.to.trim()) {
      newErrors.to = 'Recipient is required'
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const emails = formData.to.split(',').map(email => email.trim())
      const invalidEmails = emails.filter(email => !emailRegex.test(email))
      
      if (invalidEmails.length > 0) {
        newErrors.to = `Invalid email address${invalidEmails.length > 1 ? 'es' : ''}: ${invalidEmails.join(', ')}`
      }
    }

    // Validate Subject field
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    // Validate Body field
    if (!formData.body.trim()) {
      newErrors.body = 'Message body is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Handle form submission
  const handleSend = useCallback(async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSend?.(formData)
    } catch (error) {
      console.error('Failed to send email:', error)
      // Handle error - could set an error state here
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, onSend])

  // Handle cancel
  const handleCancel = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  // Handle save draft
  const handleSaveDraft = useCallback(async () => {
    const draftData = { ...formData, isDraft: true }
    try {
      await onSaveDraft?.(draftData)
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }, [formData, onSaveDraft])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof ComposeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  // Keyboard shortcuts
  useGlobalKeyboard({
    'ctrl+enter': handleSend,
    'ctrl+s': handleSaveDraft
  })

  // Handle Escape key for cancel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleCancel])

  return (
    <div className={`compose-form terminal-container ${className}`}>
      {/* Screen reader instructions */}
      <div className="sr-only">
        <p>Email composition form. Use Ctrl+Enter to send, Ctrl+S to save draft, Escape to cancel.</p>
      </div>

      {/* Form header */}
      <div className="compose-header terminal-border-b p-2 mb-4">
        <h2 className="text-lg font-bold terminal-accent terminal-glow">
          ╔═══ COMPOSE EMAIL ═══╗
        </h2>
        <div className="text-sm terminal-dim mt-1 font-mono">
          Ctrl+Enter: Send • Ctrl+S: Save Draft • Escape: Cancel
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="compose-error mb-4">
          <ErrorMessage
            title="Compose Error"
            message={error.message || 'An error occurred while composing the email'}
            onRetry={onRetry}
            variant="error"
          />
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="compose-loading-overlay absolute inset-0 bg-terminal-bg bg-opacity-75 flex items-center justify-center z-10">
          <InlineLoading message="Processing..." />
        </div>
      )}

      <form 
        className="compose-form-fields space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        {/* To field */}
        <div className="form-field">
          <label 
            htmlFor="compose-to" 
            className="block text-sm font-bold mb-1 terminal-accent"
          >
            To: *
          </label>
          <input
            ref={toInputRef}
            id="compose-to"
            type="text"
            value={formData.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
            placeholder="recipient@example.com, another@example.com"
            className={`w-full ${errors.to ? 'border-terminal-error' : ''}`}
            aria-describedby={errors.to ? 'to-error' : undefined}
            aria-invalid={!!errors.to}
          />
          {errors.to && (
            <div id="to-error" className="text-sm terminal-error mt-1" role="alert">
              ▶ {errors.to}
            </div>
          )}
        </div>

        {/* CC/BCC toggle */}
        <div className="form-field">
          <button
            type="button"
            onClick={() => setShowCcBcc(!showCcBcc)}
            className="text-sm terminal-info hover:terminal-accent transition-colors"
            style={{
              minHeight: `${minTouchTarget}px`,
              padding: touchSpacing,
              transitionDuration: getResponsiveTransition()
            }}
          >
            {showCcBcc ? '▼' : '▶'} {showCcBcc ? 'Hide' : 'Show'} CC/BCC
          </button>
        </div>

        {/* CC/BCC fields */}
        {showCcBcc && (
          <>
            <div className="form-field">
              <label 
                htmlFor="compose-cc" 
                className="block text-sm font-bold mb-1 terminal-dim"
              >
                CC:
              </label>
              <input
                id="compose-cc"
                type="text"
                value={formData.cc || ''}
                onChange={(e) => handleInputChange('cc', e.target.value)}
                placeholder="cc@example.com"
                className="w-full"
              />
            </div>

            <div className="form-field">
              <label 
                htmlFor="compose-bcc" 
                className="block text-sm font-bold mb-1 terminal-dim"
              >
                BCC:
              </label>
              <input
                id="compose-bcc"
                type="text"
                value={formData.bcc || ''}
                onChange={(e) => handleInputChange('bcc', e.target.value)}
                placeholder="bcc@example.com"
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Subject field */}
        <div className="form-field">
          <label 
            htmlFor="compose-subject" 
            className="block text-sm font-bold mb-1 terminal-accent"
          >
            Subject: *
          </label>
          <input
            ref={subjectInputRef}
            id="compose-subject"
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Enter email subject"
            className={`w-full ${errors.subject ? 'border-terminal-error' : ''}`}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            aria-invalid={!!errors.subject}
          />
          {errors.subject && (
            <div id="subject-error" className="text-sm terminal-error mt-1" role="alert">
              ▶ {errors.subject}
            </div>
          )}
        </div>

        {/* Body field */}
        <div className="form-field">
          <label 
            htmlFor="compose-body" 
            className="block text-sm font-bold mb-1 terminal-accent"
          >
            Message: *
          </label>
          <textarea
            ref={bodyTextareaRef}
            id="compose-body"
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Type your message here..."
            rows={12}
            className={`w-full resize-y ${errors.body ? 'border-terminal-error' : ''}`}
            aria-describedby={errors.body ? 'body-error' : undefined}
            aria-invalid={!!errors.body}
          />
          {errors.body && (
            <div id="body-error" className="text-sm terminal-error mt-1" role="alert">
              ▶ {errors.body}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="form-actions terminal-border-t pt-4 mt-6">
          <div className={`flex gap-2 ${shouldUseMobileLayout ? 'flex-col' : 'justify-between items-center'}`}>
            <div className={`flex gap-2 ${shouldUseMobileLayout ? 'flex-col' : ''}`}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="terminal-success hover:bg-terminal-success hover:text-terminal-bg font-bold"
                style={{
                  minHeight: `${minTouchTarget}px`,
                  padding: touchSpacing,
                  transitionDuration: getResponsiveTransition()
                }}
                aria-describedby="send-shortcut"
              >
                {isSubmitting ? '▶ Sending...' : '▶ Send'}
              </button>
              
              <button
                type="button"
                onClick={handleSaveDraft}
                className="terminal-info hover:bg-terminal-info hover:text-terminal-bg"
                style={{
                  minHeight: `${minTouchTarget}px`,
                  padding: touchSpacing,
                  transitionDuration: getResponsiveTransition()
                }}
                aria-describedby="draft-shortcut"
              >
                ▶ Save Draft
              </button>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="terminal-error hover:bg-terminal-error hover:text-terminal-bg"
              style={{
                minHeight: `${minTouchTarget}px`,
                padding: touchSpacing,
                transitionDuration: getResponsiveTransition()
              }}
              aria-describedby="cancel-shortcut"
            >
              ▶ Cancel
            </button>
          </div>

          {/* Keyboard shortcut hints */}
          <div className="text-xs terminal-dim mt-2 terminal-hide-mobile">
            <span id="send-shortcut">Ctrl+Enter</span> • 
            <span id="draft-shortcut" className="ml-1">Ctrl+S</span> • 
            <span id="cancel-shortcut" className="ml-1">Escape</span>
          </div>
        </div>
      </form>

      {/* Character count for body */}
      <div className="compose-footer text-xs terminal-dim text-right mt-2">
        {formData.body.length} characters
      </div>
    </div>
  )
}

// Wrap with error boundary for additional protection
function ComposeFormWithErrorBoundary(props: ComposeFormProps) {
  return (
    <ComposeFormErrorBoundary>
      <ComposeForm {...props} />
    </ComposeFormErrorBoundary>
  )
}

export default ComposeFormWithErrorBoundary