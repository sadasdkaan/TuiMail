'use client'

import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { Email, Folder } from '@/lib/types'
import { EmailService } from '@/lib/email-service'
import { useListNavigation } from '@/hooks/useListNavigation'
import { asciiArt } from '@/lib/mock-data'
import { useResponsiveLayout, useTouchFriendly } from '@/hooks/useResponsive'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { EmailListErrorBoundary } from './ErrorBoundary'
import ConfirmationDialog from './ConfirmationDialog'

interface EmailListProps {
  emails: Email[]
  selectedEmailId?: string | null
  onEmailSelect?: (email: Email) => void
  onEmailOpen?: (email: Email) => void
  className?: string
  enabled?: boolean
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  folders?: Folder[]
  emailService?: EmailService
  onEmailUpdate?: (updatedEmail: Email) => void
  onEmailDelete?: (emailId: string) => void
  onEmailMove?: (emailId: string, targetFolderId: string) => void
}

interface EmailRowProps {
  email: Email
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
  onDoubleClick: () => void
}

function EmailRow({ 
  email, 
  isSelected, 
  isHighlighted, 
  onClick, 
  onDoubleClick 
}: EmailRowProps) {
  const { shouldUseMobileLayout, getResponsiveTransition } = useResponsiveLayout()
  const { minTouchTarget, touchSpacing } = useTouchFriendly()

  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const emailDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (emailDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } else if (emailDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday'
    } else if (now.getTime() - emailDate.getTime() < 7 * 86400000) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    // Adjust truncation length based on screen size
    const adjustedLength = shouldUseMobileLayout ? Math.floor(maxLength * 0.6) : maxLength
    if (text.length <= adjustedLength) return text
    return text.substring(0, adjustedLength - 3) + '...'
  }

  const rowClasses = [
    'email-row',
    'cursor-pointer',
    'transition-colors',
    isHighlighted && 'terminal-highlight',
    isSelected && 'bg-terminal-selection'
  ].filter(Boolean).join(' ')

  return (
    <tr 
      className={rowClasses}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      role="row"
      aria-selected={isHighlighted}
      tabIndex={isHighlighted ? 0 : -1}
      style={{
        minHeight: `${minTouchTarget}px`,
        transitionDuration: getResponsiveTransition()
      }}
    >
      <td className="email-status text-center" style={{ padding: touchSpacing, width: shouldUseMobileLayout ? '32px' : '40px' }}>
        <span 
          className={email.isRead ? 'terminal-dim' : 'terminal-accent'}
          aria-label={email.isRead ? 'Read' : 'Unread'}
        >
          {email.isRead ? asciiArt.statusIcons.read : asciiArt.statusIcons.unread}
        </span>
      </td>
      {!shouldUseMobileLayout && (
        <td className="email-flags text-center" style={{ padding: touchSpacing, width: '48px' }}>
          <span className="inline-flex gap-1">
            {email.isFlagged && (
              <span 
                className="terminal-warning" 
                aria-label="Flagged"
                title="Flagged"
              >
                {asciiArt.statusIcons.flagged}
              </span>
            )}
            {email.hasAttachments && (
              <span 
                className="terminal-info" 
                aria-label="Has attachments"
                title="Has attachments"
              >
                {asciiArt.statusIcons.attachment}
              </span>
            )}
          </span>
        </td>
      )}
      <td className="email-from" style={{ padding: touchSpacing, width: shouldUseMobileLayout ? '80px' : '192px' }}>
        <div className="flex flex-col">
          <span 
            className={`font-mono ${!email.isRead ? 'font-bold' : ''}`}
            title={email.from}
          >
            {truncateText(email.from, shouldUseMobileLayout ? 12 : 30)}
          </span>
          {shouldUseMobileLayout && (email.isFlagged || email.hasAttachments) && (
            <span className="inline-flex gap-1 text-xs mt-1">
              {email.isFlagged && (
                <span className="terminal-warning" title="Flagged">
                  {asciiArt.statusIcons.flagged}
                </span>
              )}
              {email.hasAttachments && (
                <span className="terminal-info" title="Has attachments">
                  {asciiArt.statusIcons.attachment}
                </span>
              )}
            </span>
          )}
        </div>
      </td>
      <td className="email-subject flex-1" style={{ padding: touchSpacing }}>
        <div className="flex flex-col">
          <span 
            className={`font-mono ${!email.isRead ? 'font-bold' : ''}`}
            title={email.subject}
          >
            {truncateText(email.subject, shouldUseMobileLayout ? 25 : 60)}
          </span>
          {shouldUseMobileLayout && (
            <span 
              className="font-mono text-xs terminal-dim mt-1"
              title={email.date.toLocaleString()}
            >
              {formatDate(email.date)}
            </span>
          )}
        </div>
      </td>
      {!shouldUseMobileLayout && (
        <td className="email-date text-right" style={{ padding: touchSpacing, width: '96px' }}>
          <span 
            className="font-mono text-sm terminal-dim"
            title={email.date.toLocaleString()}
          >
            {formatDate(email.date)}
          </span>
        </td>
      )}
    </tr>
  )
}

export function EmailList({ 
  emails, 
  selectedEmailId, 
  onEmailSelect, 
  onEmailOpen,
  className = '',
  enabled = true,
  loading = false,
  error = null,
  onRetry,
  folders = [],
  emailService,
  onEmailUpdate,
  onEmailDelete,
  onEmailMove
}: EmailListProps) {
  const { shouldUseMobileLayout } = useResponsiveLayout()
  
  // State for email management actions
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    type: 'delete' | 'move' | 'none'
    emailId?: string
    targetFolderId?: string
  }>({ type: 'none' })
  const [isActionLoading, setIsActionLoading] = useState(false)
  
  const sortedEmails = useMemo(() => {
    return [...emails].sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [emails])

  const handleEmailSelect = useCallback((index: number) => {
    const email = sortedEmails[index]
    if (email && onEmailSelect) {
      onEmailSelect(email)
    }
  }, [sortedEmails, onEmailSelect])

  const handleEmailOpen = useCallback((index: number) => {
    const email = sortedEmails[index]
    if (email && onEmailOpen) {
      onEmailOpen(email)
    }
  }, [sortedEmails, onEmailOpen])

  const {
    selectedIndex,
    setSelectedIndex,
    isSelected: isHighlighted
  } = useListNavigation({
    itemCount: sortedEmails.length,
    onSelect: handleEmailOpen,
    enabled,
    loop: false,
    initialIndex: 0
  })

  const handleRowClick = useCallback((index: number) => {
    setSelectedIndex(index)
    handleEmailSelect(index)
  }, [setSelectedIndex, handleEmailSelect])

  const handleRowDoubleClick = useCallback((index: number) => {
    setSelectedIndex(index)
    handleEmailOpen(index)
  }, [setSelectedIndex, handleEmailOpen])

  // Email management action handlers
  const handleToggleRead = useCallback(async (emailId: string) => {
    if (!emailService || !onEmailUpdate || isActionLoading) return

    setIsActionLoading(true)
    try {
      const email = sortedEmails.find(e => e.id === emailId)
      if (!email) return

      const result = await emailService.markAsRead(emailId, !email.isRead)
      if (result.success) {
        const updatedEmail = { ...email, isRead: !email.isRead }
        onEmailUpdate(updatedEmail)
      }
    } catch (error) {
      console.error('Failed to toggle read status:', error)
    } finally {
      setIsActionLoading(false)
    }
  }, [emailService, onEmailUpdate, sortedEmails, isActionLoading])

  const handleToggleFlag = useCallback(async (emailId: string) => {
    if (!emailService || !onEmailUpdate || isActionLoading) return

    setIsActionLoading(true)
    try {
      const result = await emailService.toggleFlag(emailId)
      if (result.success && result.data) {
        onEmailUpdate(result.data)
      }
    } catch (error) {
      console.error('Failed to toggle flag:', error)
    } finally {
      setIsActionLoading(false)
    }
  }, [emailService, onEmailUpdate, isActionLoading])

  const handleDeleteEmail = useCallback((emailId: string) => {
    const email = sortedEmails.find(e => e.id === emailId)
    if (!email) return

    setPendingAction({ type: 'delete', emailId })
    setShowConfirmation(true)
  }, [sortedEmails])



  // Execute confirmed action
  const handleConfirmAction = useCallback(async () => {
    if (pendingAction.type === 'none' || !pendingAction.emailId || isActionLoading) return

    setIsActionLoading(true)
    setShowConfirmation(false)

    try {
      if (pendingAction.type === 'delete' && emailService && onEmailDelete) {
        const result = await emailService.deleteEmail(pendingAction.emailId)
        if (result.success) {
          onEmailDelete(pendingAction.emailId)
        }
      } else if (pendingAction.type === 'move' && pendingAction.targetFolderId && emailService && onEmailMove) {
        const result = await emailService.moveEmail(pendingAction.emailId, pendingAction.targetFolderId)
        if (result.success) {
          onEmailMove(pendingAction.emailId, pendingAction.targetFolderId)
        }
      }
    } catch (error) {
      console.error('Failed to execute action:', error)
    } finally {
      setIsActionLoading(false)
      setPendingAction({ type: 'none' })
    }
  }, [pendingAction, emailService, onEmailDelete, onEmailMove, isActionLoading])

  const handleCancelAction = useCallback(() => {
    setShowConfirmation(false)
    setPendingAction({ type: 'none' })
  }, [])

  // Keyboard shortcuts for email management
  useEffect(() => {
    if (!enabled || showConfirmation) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if no modifier keys are pressed
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return

      const currentEmail = sortedEmails[selectedIndex]
      if (!currentEmail) return

      switch (event.key.toLowerCase()) {
        case 'r':
          event.preventDefault()
          handleToggleRead(currentEmail.id)
          break
        case 'f':
          event.preventDefault()
          handleToggleFlag(currentEmail.id)
          break
        case 'd':
        case 'delete':
          event.preventDefault()
          handleDeleteEmail(currentEmail.id)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, showConfirmation, sortedEmails, selectedIndex, handleToggleRead, handleToggleFlag, handleDeleteEmail])

  // Get confirmation dialog content
  const getConfirmationContent = () => {
    const email = pendingAction.emailId ? sortedEmails.find(e => e.id === pendingAction.emailId) : null
    
    if (pendingAction.type === 'delete' && email) {
      const isInTrash = email.folderId === 'trash'
      return {
        title: isInTrash ? 'Permanently Delete Email' : 'Delete Email',
        message: isInTrash 
          ? `Permanently delete "${email.subject}"? This cannot be undone.`
          : `Move "${email.subject}" to Trash?`,
        variant: isInTrash ? 'danger' as const : 'warning' as const,
        confirmText: 'Delete'
      }
    } else if (pendingAction.type === 'move' && email) {
      const targetFolder = folders.find(f => f.id === pendingAction.targetFolderId)
      return {
        title: 'Move Email',
        message: `Move "${email.subject}" to ${targetFolder?.name || 'selected folder'}?`,
        variant: 'default' as const,
        confirmText: 'Move'
      }
    }
    return {
      title: '',
      message: '',
      variant: 'default' as const,
      confirmText: 'OK'
    }
  }

  const confirmationContent = getConfirmationContent()

  // Show loading state
  if (loading) {
    return (
      <div className={`email-list-loading terminal-container ${className}`}>
        <div className="text-center p-8">
          <LoadingSpinner size="large" message="Loading emails..." />
          <div className="terminal-dim text-sm mt-4">
            Fetching your messages from the server...
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`email-list-error terminal-container ${className}`}>
        <div className="p-4">
          <ErrorMessage
            title="Failed to Load Emails"
            message={error.message || 'Unable to fetch emails from server'}
            onRetry={onRetry}
            variant="error"
          />
        </div>
      </div>
    )
  }

  // Show empty state
  if (sortedEmails.length === 0) {
    return (
      <div className={`email-list-empty terminal-container ${className}`}>
        <div className="text-center p-8">
          <pre className="terminal-dim text-xs mb-4">
            {asciiArt.emptyInbox}
          </pre>
          <p className="terminal-dim font-mono">No emails in this folder</p>
          <div className="terminal-dim text-sm mt-2">
            ▶ Check your connection or try refreshing
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`email-list-container ${className}`}>
      {/* Screen reader instructions */}
      <div className="sr-only">
        <p>Email list. Use arrow keys or j/k to navigate, Enter to open email, Space to select.</p>
      </div>
      
      <div className="email-list-wrapper overflow-auto">
        <table 
          className="email-list-table w-full terminal-border"
          role="grid"
          aria-label="Email list"
          aria-rowcount={sortedEmails.length + 1}
        >
          <thead>
            <tr 
              className="email-list-header bg-terminal-dim text-terminal-bg"
              role="row"
            >
              <th 
                className="text-center" 
                style={{ padding: '0.5rem', width: shouldUseMobileLayout ? '32px' : '40px' }}
                scope="col"
                aria-label="Read status"
              >
                <span className="sr-only">Status</span>
                <span aria-hidden="true">●</span>
              </th>
              {!shouldUseMobileLayout && (
                <th 
                  className="text-center" 
                  style={{ padding: '0.5rem', width: '48px' }}
                  scope="col"
                  aria-label="Flags and attachments"
                >
                  <span className="sr-only">Flags</span>
                  <span aria-hidden="true">⚑</span>
                </th>
              )}
              <th 
                className="text-left" 
                style={{ padding: '0.5rem', width: shouldUseMobileLayout ? '80px' : '192px' }}
                scope="col"
              >
                From
              </th>
              <th 
                className="text-left flex-1" 
                style={{ padding: '0.5rem' }}
                scope="col"
              >
                Subject{shouldUseMobileLayout ? ' / Date' : ''}
              </th>
              {!shouldUseMobileLayout && (
                <th 
                  className="text-right" 
                  style={{ padding: '0.5rem', width: '96px' }}
                  scope="col"
                >
                  Date
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedEmails.map((email, index) => (
              <EmailRow
                key={email.id}
                email={email}
                isSelected={email.id === selectedEmailId}
                isHighlighted={isHighlighted(index)}
                onClick={() => handleRowClick(index)}
                onDoubleClick={() => handleRowDoubleClick(index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Email count and keyboard shortcuts */}
      <div className="email-list-footer terminal-border-t p-2 bg-terminal-hover">
        <div className="flex justify-between items-center text-sm terminal-dim font-mono">
          <span>
            ▶ {sortedEmails.length} email{sortedEmails.length !== 1 ? 's' : ''} 
            {sortedEmails.filter(e => !e.isRead).length > 0 && (
              <span className="ml-2 terminal-accent terminal-glow">
                ({sortedEmails.filter(e => !e.isRead).length} unread)
              </span>
            )}
          </span>
          <span className="terminal-hide-mobile">
            j/k:navigate • Enter:open • r:read • f:flag • d:delete
          </span>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        variant={confirmationContent.variant}
        confirmText={confirmationContent.confirmText}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  )
}

// Wrap with error boundary for additional protection
function EmailListWithErrorBoundary(props: EmailListProps) {
  return (
    <EmailListErrorBoundary>
      <EmailList {...props} />
    </EmailListErrorBoundary>
  )
}

export default EmailListWithErrorBoundary