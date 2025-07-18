'use client'

import React, { useEffect, useRef } from 'react'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      // Focus cancel button by default for safety
      cancelButtonRef.current.focus()
    }
  }, [isOpen])

  // Keyboard navigation within dialog
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onCancel()
          break
        case 'Enter':
          event.preventDefault()
          // Enter confirms only if confirm button is focused
          if (document.activeElement === confirmButtonRef.current) {
            onConfirm()
          } else {
            onCancel()
          }
          break
        case 'Tab':
          event.preventDefault()
          // Toggle between buttons
          if (document.activeElement === confirmButtonRef.current) {
            cancelButtonRef.current?.focus()
          } else {
            confirmButtonRef.current?.focus()
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          cancelButtonRef.current?.focus()
          break
        case 'ArrowRight':
          event.preventDefault()
          confirmButtonRef.current?.focus()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onConfirm, onCancel])

  if (!isOpen) return null

  const variantClasses = {
    default: 'terminal-border',
    danger: 'terminal-border-error',
    warning: 'terminal-border-warning'
  }

  const confirmButtonClasses = {
    default: 'terminal-button terminal-button-primary',
    danger: 'terminal-button terminal-button-danger',
    warning: 'terminal-button terminal-button-warning'
  }

  return (
    <div className="confirmation-dialog-overlay">
      <div 
        ref={dialogRef}
        className={`confirmation-dialog ${variantClasses[variant]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        {/* Dialog Header */}
        <div className="dialog-header terminal-border-b">
          <h2 id="dialog-title" className="dialog-title font-mono font-bold">
            ┌─ {title} ─┐
          </h2>
        </div>

        {/* Dialog Content */}
        <div className="dialog-content">
          <p id="dialog-message" className="dialog-message font-mono">
            {message}
          </p>
        </div>

        {/* Dialog Actions */}
        <div className="dialog-actions terminal-border-t">
          <div className="button-group">
            <button
              ref={cancelButtonRef}
              className="terminal-button terminal-button-secondary"
              onClick={onCancel}
              type="button"
            >
              [{cancelText}]
            </button>
            <button
              ref={confirmButtonRef}
              className={confirmButtonClasses[variant]}
              onClick={onConfirm}
              type="button"
            >
              [{confirmText}]
            </button>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="dialog-hints terminal-dim text-xs">
          Tab/←→: Navigate • Enter: Confirm • Esc: Cancel
        </div>
      </div>

      <style jsx>{`
        .confirmation-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }

        .confirmation-dialog {
          background-color: var(--terminal-bg);
          border: 2px solid var(--terminal-border);
          border-radius: 4px;
          min-width: 400px;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .dialog-header {
          padding: 1rem;
          background-color: var(--terminal-hover);
        }

        .dialog-title {
          margin: 0;
          color: var(--terminal-fg);
          text-align: center;
        }

        .dialog-content {
          padding: 1.5rem;
        }

        .dialog-message {
          margin: 0;
          color: var(--terminal-fg);
          line-height: 1.5;
          text-align: center;
        }

        .dialog-actions {
          padding: 1rem;
          background-color: var(--terminal-hover);
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .dialog-hints {
          padding: 0.5rem 1rem;
          text-align: center;
          background-color: var(--terminal-dim-bg);
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .confirmation-dialog {
            min-width: 320px;
            max-width: 90vw;
            margin: 1rem;
          }

          .button-group {
            flex-direction: column;
          }
        }

        /* Focus styles */
        .terminal-button:focus {
          outline: 2px solid var(--terminal-accent);
          outline-offset: 2px;
        }

        /* Animation */
        .confirmation-dialog {
          animation: dialogSlideIn 0.2s ease-out;
        }

        @keyframes dialogSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ConfirmationDialog