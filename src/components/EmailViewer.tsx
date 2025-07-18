'use client'

import React from 'react'
import { Email, Folder } from '@/lib/types'
import { EmailService } from '@/lib/email-service'
import { asciiArt } from '@/lib/mock-data'
import styles from './EmailViewer.module.css'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { EmailViewerErrorBoundary } from './ErrorBoundary'
import EmailActions from './EmailActions'

interface EmailViewerProps {
  email: Email | null
  folders: Folder[]
  emailService: EmailService
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  onEmailUpdate: (updatedEmail: Email) => void
  onEmailDelete: (emailId: string) => void
  onEmailMove: (emailId: string, targetFolderId: string) => void
}

function EmailViewer({
  email,
  folders,
  emailService,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  loading = false,
  error = null,
  onRetry,
  onEmailUpdate,
  onEmailDelete,
  onEmailMove
}: EmailViewerProps) {
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
        case 'h':
          if (hasPrevious && onPrevious) {
            onPrevious()
          }
          break
        case 'ArrowRight':
        case 'l':
          if (hasNext && onNext) {
            onNext()
          }
          break
        case 'q':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext])

  // Show loading state
  if (loading) {
    return (
      <div className={`${styles.emailViewer} ${styles['emailViewer--loading']}`}>
        <div className={styles.emailViewer__loadingState}>
          <LoadingSpinner size="large" message="Loading email..." />
          <p className="terminal-dim text-sm mt-4">
            Fetching email content from server...
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`${styles.emailViewer} ${styles['emailViewer--error']}`}>
        <div className={styles.emailViewer__errorState}>
          <ErrorMessage
            title="Failed to Load Email"
            message={error.message || 'Unable to fetch email content'}
            onRetry={onRetry}
            variant="error"
          />
        </div>
      </div>
    )
  }

  // Show empty state
  if (!email) {
    return (
      <div className={`${styles.emailViewer} ${styles['emailViewer--empty']}`}>
        <div className={styles.emailViewer__emptyState}>
          <pre className={`${styles.asciiArt} terminal-glow`}>{asciiArt.miniLogo}</pre>
          <p className={`${styles.emptyMessage} terminal-accent`}>▶ No email selected</p>
          <p className={`${styles.emptyHint} terminal-dim`}>Select an email from the list to view it here</p>
          <div className="terminal-dim text-xs mt-4">
            ┌─ KEYBOARD SHORTCUTS ─┐<br/>
            │ j/k - Navigate list   │<br/>
            │ Enter - Open email    │<br/>
            │ Esc - Close viewer    │<br/>
            └───────────────────────┘
          </div>
        </div>
      </div>
    )
  }

  // Format date for terminal display
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // Format email addresses for display
  const formatAddresses = (addresses: string[]) => {
    return addresses.join(', ')
  }

  // Format email body with proper line wrapping
  const formatBody = (body: string) => {
    // Split into paragraphs and wrap long lines
    const paragraphs = body.split('\n\n')
    return paragraphs.map(paragraph => {
      // Wrap lines at 80 characters while preserving word boundaries
      const words = paragraph.split(' ')
      const lines: string[] = []
      let currentLine = ''

      words.forEach(word => {
        if ((currentLine + word).length > 78) {
          if (currentLine) {
            lines.push(currentLine.trim())
            currentLine = word + ' '
          } else {
            lines.push(word)
            currentLine = ''
          }
        } else {
          currentLine += word + ' '
        }
      })

      if (currentLine.trim()) {
        lines.push(currentLine.trim())
      }

      return lines.join('\n')
    }).join('\n\n')
  }

  return (
    <div className={styles.emailViewer}>
      {/* Navigation Controls */}
      <div className={styles.emailViewer__controls}>
        <div className={styles.controlsLeft}>
          <button
            className={`${styles.btn} ${styles['btn--ghost']} ${styles['btn--small']}`}
            onClick={onClose}
            title="Return to list (Escape or q)"
          >
            ← Back
          </button>
        </div>
        
        <div className={styles.controlsCenter}>
          <span className={styles.emailStatus}>
            {!email.isRead && <span className={`${styles.statusIndicator} ${styles['statusIndicator--unread']}`}>●</span>}
            {email.isFlagged && <span className={`${styles.statusIndicator} ${styles['statusIndicator--flagged']}`}>⚑</span>}
            {email.hasAttachments && <span className={`${styles.statusIndicator} ${styles['statusIndicator--attachment']}`}>📎</span>}
          </span>
        </div>

        <div className={styles.controlsRight}>
          <button
            className={`${styles.btn} ${styles['btn--ghost']} ${styles['btn--small']} ${!hasPrevious ? styles['btn--disabled'] : ''}`}
            onClick={onPrevious}
            disabled={!hasPrevious}
            title="Previous email (← or h)"
          >
            ← Prev
          </button>
          <button
            className={`${styles.btn} ${styles['btn--ghost']} ${styles['btn--small']} ${!hasNext ? styles['btn--disabled'] : ''}`}
            onClick={onNext}
            disabled={!hasNext}
            title="Next email (→ or l)"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Email Header */}
      <div className={styles.emailViewer__header}>
        <div className={styles.headerSeparator}>
          {asciiArt.separator}
        </div>
        
        <div className={styles.headerFields}>
          <div className={styles.headerField}>
            <span className={styles.fieldLabel}>From:</span>
            <span className={styles.fieldValue}>{email.from}</span>
          </div>
          
          <div className={styles.headerField}>
            <span className={styles.fieldLabel}>To:</span>
            <span className={styles.fieldValue}>{formatAddresses(email.to)}</span>
          </div>
          
          {email.cc && email.cc.length > 0 && (
            <div className={styles.headerField}>
              <span className={styles.fieldLabel}>CC:</span>
              <span className={styles.fieldValue}>{formatAddresses(email.cc)}</span>
            </div>
          )}
          
          {email.bcc && email.bcc.length > 0 && (
            <div className={styles.headerField}>
              <span className={styles.fieldLabel}>BCC:</span>
              <span className={styles.fieldValue}>{formatAddresses(email.bcc)}</span>
            </div>
          )}
          
          <div className={styles.headerField}>
            <span className={styles.fieldLabel}>Subject:</span>
            <span className={`${styles.fieldValue} ${styles['fieldValue--subject']}`}>{email.subject}</span>
          </div>
          
          <div className={styles.headerField}>
            <span className={styles.fieldLabel}>Date:</span>
            <span className={styles.fieldValue}>{formatDate(email.date)}</span>
          </div>
          
          {email.hasAttachments && email.attachments && (
            <div className={styles.headerField}>
              <span className={styles.fieldLabel}>Attachments:</span>
              <span className={styles.fieldValue}>
                {email.attachments.map((attachment, index) => (
                  <span key={attachment.id} className={styles.attachmentItem}>
                    📎 {attachment.filename} ({Math.round(attachment.size / 1024)}KB)
                    {index < email.attachments!.length - 1 && ', '}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
        
        <div className={styles.headerSeparator}>
          {asciiArt.separator}
        </div>
      </div>

      {/* Email Actions */}
      <div className={styles.emailViewer__actions}>
        <EmailActions
          email={email}
          folders={folders}
          emailService={emailService}
          onEmailUpdate={onEmailUpdate}
          onEmailDelete={onEmailDelete}
          onEmailMove={onEmailMove}
          className={styles.emailActions}
        />
      </div>

      {/* Email Body */}
      <div className={styles.emailViewer__body}>
        <pre className={styles.emailContent}>{formatBody(email.body)}</pre>
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className={styles.emailViewer__footer}>
        <div className={styles.footerSeparator}>
          {'─'.repeat(80)}
        </div>
        <div className={styles.keyboardShortcuts}>
          <span className={styles.shortcutHint}>
            <kbd>Esc</kbd> or <kbd>q</kbd> Back | 
            <kbd>←</kbd> or <kbd>h</kbd> Previous | 
            <kbd>→</kbd> or <kbd>l</kbd> Next
          </span>
        </div>
      </div>
    </div>
  )
}

// Wrap with error boundary for additional protection
function EmailViewerWithErrorBoundary(props: EmailViewerProps) {
  return (
    <EmailViewerErrorBoundary>
      <EmailViewer {...props} />
    </EmailViewerErrorBoundary>
  )
}

export { EmailViewerWithErrorBoundary as EmailViewer }
export default EmailViewerWithErrorBoundary