'use client'

import React, { useState, useCallback } from 'react'
import { Email, Folder } from '@/lib/types'
import { EmailService } from '@/lib/email-service'
import ConfirmationDialog from './ConfirmationDialog'

interface EmailActionsProps {
  email: Email
  folders: Folder[]
  emailService: EmailService
  onEmailUpdate: (updatedEmail: Email) => void
  onEmailDelete: (emailId: string) => void
  onEmailMove: (emailId: string, targetFolderId: string) => void
  className?: string
}

type ActionType = 'delete' | 'move' | 'none'

interface PendingAction {
  type: ActionType
  targetFolderId?: string
}

export function EmailActions({
  email,
  folders,
  emailService,
  onEmailUpdate,
  onEmailDelete,
  onEmailMove,
  className = ''
}: EmailActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>({ type: 'none' })
  const [showMoveMenu, setShowMoveMenu] = useState(false)

  // Handle mark as read/unread toggle
  const handleToggleRead = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const newReadStatus = !email.isRead
      const result = await emailService.markAsRead(email.id, newReadStatus)
      
      if (result.success) {
        const updatedEmail = { ...email, isRead: newReadStatus }
        onEmailUpdate(updatedEmail)
      } else {
        throw new Error(result.error || 'Failed to update email status')
      }
    } catch (error) {
      console.error('Failed to toggle read status:', error)
      // Could add toast notification here
    } finally {
      setIsLoading(false)
    }
  }, [email, emailService, onEmailUpdate, isLoading])

  // Handle flag toggle
  const handleToggleFlag = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const result = await emailService.toggleFlag(email.id)
      
      if (result.success && result.data) {
        onEmailUpdate(result.data)
      } else {
        throw new Error(result.error || 'Failed to toggle flag')
      }
    } catch (error) {
      console.error('Failed to toggle flag:', error)
    } finally {
      setIsLoading(false)
    }
  }, [email.id, emailService, onEmailUpdate, isLoading])

  // Handle delete email
  const handleDelete = useCallback(() => {
    setPendingAction({ type: 'delete' })
    setShowConfirmation(true)
  }, [])

  // Handle move email
  const handleMove = useCallback((targetFolderId: string) => {
    if (targetFolderId === email.folderId) {
      setShowMoveMenu(false)
      return
    }

    setPendingAction({ type: 'move', targetFolderId })
    setShowConfirmation(true)
    setShowMoveMenu(false)
  }, [email.folderId])

  // Execute confirmed action
  const handleConfirmAction = useCallback(async () => {
    if (pendingAction.type === 'none' || isLoading) return

    setIsLoading(true)
    setShowConfirmation(false)

    try {
      if (pendingAction.type === 'delete') {
        const result = await emailService.deleteEmail(email.id)
        if (result.success) {
          onEmailDelete(email.id)
        } else {
          throw new Error(result.error || 'Failed to delete email')
        }
      } else if (pendingAction.type === 'move' && pendingAction.targetFolderId) {
        const result = await emailService.moveEmail(email.id, pendingAction.targetFolderId)
        if (result.success) {
          onEmailMove(email.id, pendingAction.targetFolderId)
        } else {
          throw new Error(result.error || 'Failed to move email')
        }
      }
    } catch (error) {
      console.error('Failed to execute action:', error)
      // Could add toast notification here
    } finally {
      setIsLoading(false)
      setPendingAction({ type: 'none' })
    }
  }, [pendingAction, email.id, emailService, onEmailDelete, onEmailMove, isLoading])

  // Cancel confirmation
  const handleCancelAction = useCallback(() => {
    setShowConfirmation(false)
    setPendingAction({ type: 'none' })
  }, [])

  // Get available folders for move operation (exclude current folder)
  const availableFolders = folders.filter(folder => folder.id !== email.folderId)

  // Get confirmation dialog content
  const getConfirmationContent = () => {
    if (pendingAction.type === 'delete') {
      const isInTrash = email.folderId === 'trash'
      return {
        title: isInTrash ? 'Permanently Delete Email' : 'Delete Email',
        message: isInTrash 
          ? 'This email will be permanently deleted and cannot be recovered. Continue?'
          : 'This email will be moved to Trash. Continue?',
        variant: isInTrash ? 'danger' as const : 'warning' as const,
        confirmText: 'Delete'
      }
    } else if (pendingAction.type === 'move') {
      const targetFolder = folders.find(f => f.id === pendingAction.targetFolderId)
      return {
        title: 'Move Email',
        message: `Move this email to ${targetFolder?.name || 'selected folder'}?`,
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

  return (
    <div className={`email-actions ${className}`}>
      {/* Action Buttons */}
      <div className="action-buttons">
        {/* Read/Unread Toggle */}
        <button
          className="action-button terminal-button terminal-button-sm"
          onClick={handleToggleRead}
          disabled={isLoading}
          title={email.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          {email.isRead ? '[Unread]' : '[Read]'}
        </button>

        {/* Flag Toggle */}
        <button
          className="action-button terminal-button terminal-button-sm"
          onClick={handleToggleFlag}
          disabled={isLoading}
          title={email.isFlagged ? 'Remove flag' : 'Add flag'}
        >
          {email.isFlagged ? '[Unflag]' : '[Flag]'}
        </button>

        {/* Move Button */}
        <div className="move-dropdown">
          <button
            className="action-button terminal-button terminal-button-sm"
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            disabled={isLoading}
            title="Move to folder"
          >
            [Move] ▼
          </button>
          
          {showMoveMenu && (
            <div className="move-menu terminal-border">
              {availableFolders.map(folder => (
                <button
                  key={folder.id}
                  className="move-option terminal-button-ghost"
                  onClick={() => handleMove(folder.id)}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button
          className="action-button terminal-button terminal-button-sm terminal-button-danger"
          onClick={handleDelete}
          disabled={isLoading}
          title={email.folderId === 'trash' ? 'Permanently delete' : 'Move to trash'}
        >
          [Delete]
        </button>
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

      <style jsx>{`
        .email-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-button {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          white-space: nowrap;
        }

        .move-dropdown {
          position: relative;
        }

        .move-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--terminal-bg);
          border: 1px solid var(--terminal-border);
          border-radius: 4px;
          min-width: 120px;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .move-option {
          display: block;
          width: 100%;
          padding: 0.5rem;
          text-align: left;
          border: none;
          background: none;
          color: var(--terminal-fg);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .move-option:hover {
          background-color: var(--terminal-hover);
        }

        .move-option:focus {
          background-color: var(--terminal-selection);
          outline: none;
        }

        /* Loading state */
        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .action-button {
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

export default EmailActions