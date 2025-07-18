'use client'

import React, { useMemo } from 'react'
import { Email } from '../lib/types'
import { EmailService } from '../lib/email-service'
import { useEmailState } from '../hooks/useEmailState'
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard'
import { Sidebar } from './Sidebar'
import { EmailList } from './EmailList'
import { EmailViewer } from './EmailViewer'
import { ComposeForm } from './ComposeForm'
import { TerminalHeader } from './TerminalHeader'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { NotificationSystem } from './NotificationSystem'

interface EmailClientLayoutProps {
  // No props needed - EmailService will be created internally
}

function EmailClientLayout({}: EmailClientLayoutProps = {}) {
  // Create EmailService instance on the client side
  const emailService = useMemo(() => new EmailService(), [])
  const { state, actions } = useEmailState(emailService)

  // Memoize folders to prevent infinite re-renders
  const sidebarFolders = useMemo(() => [
    { id: 'inbox', name: 'Inbox', type: 'inbox' as const, emailCount: state.emails.length, unreadCount: state.emails.filter(e => !e.isRead).length },
    { id: 'sent', name: 'Sent', type: 'sent' as const, emailCount: 3, unreadCount: 0 },
    { id: 'drafts', name: 'Drafts', type: 'drafts' as const, emailCount: 2, unreadCount: 1 },
    { id: 'trash', name: 'Trash', type: 'trash' as const, emailCount: 5, unreadCount: 0 }
  ], [state.emails.length, state.emails])

  const viewerFolders = useMemo(() => [
    { id: 'inbox', name: 'Inbox', type: 'inbox' as const, emailCount: 0, unreadCount: 0 },
    { id: 'sent', name: 'Sent', type: 'sent' as const, emailCount: 0, unreadCount: 0 },
    { id: 'drafts', name: 'Drafts', type: 'drafts' as const, emailCount: 0, unreadCount: 0 },
    { id: 'trash', name: 'Trash', type: 'trash' as const, emailCount: 0, unreadCount: 0 }
  ], [])

  // Global keyboard shortcuts
  useGlobalKeyboard({
    'ctrl+n': () => actions.startCompose(),
    'ctrl+r': () => state.selectedEmail && actions.markAsRead(state.selectedEmail.id),
    'ctrl+d': () => state.selectedEmail && actions.deleteEmail(state.selectedEmail.id),
  })

  return (
    <NotificationSystem>
      <div 
        className="terminal-email-client"
        style={{
          backgroundColor: 'var(--background0, var(--terminal-bg))',
          color: 'var(--foreground0, var(--terminal-fg))',
          minHeight: '100vh'
        }}
      >
        <TerminalHeader 
          currentFolder={state.currentFolder.toUpperCase()}
          emailCount={state.emails.length}
          unreadCount={state.emails.filter(e => !e.isRead).length}
          isConnected={!state.error}
          onCompose={actions.startCompose}
        />
        
        <div className="email-client-layout" style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
          {/* Sidebar */}
          <div style={{ 
            width: '250px', 
            borderRight: '1px solid var(--foreground2, #333)',
            backgroundColor: 'var(--background0, transparent)'
          }}>
            <Sidebar
              folders={sidebarFolders}
              currentFolderId={state.currentFolder}
              onFolderSelect={actions.setCurrentFolder}
            />
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {state.error && (
              <ErrorMessage 
                message={state.error} 
                onDismiss={actions.clearError}
              />
            )}

            {state.loading && <LoadingSpinner />}

            {state.isComposing ? (
              <ComposeForm
                initialData={state.composeData}
                onSend={actions.sendEmail}
                onCancel={actions.cancelCompose}
                loading={state.loading}
              />
            ) : state.selectedEmail ? (
              <EmailViewer
                email={state.selectedEmail}
                folders={viewerFolders}
                emailService={emailService}
                onClose={() => actions.selectEmail(null)}
                onEmailUpdate={(updatedEmail) => {
                  // Handle email update
                  console.log('Email updated:', updatedEmail)
                }}
                onEmailDelete={(emailId) => actions.deleteEmail(emailId)}
                onEmailMove={(emailId, targetFolderId) => {
                  // Handle email move
                  console.log('Move email:', emailId, 'to:', targetFolderId)
                }}
              />
            ) : (
              <EmailList
                emails={state.searchQuery ? state.searchResults : state.emails}
                selectedEmailId={state.selectedEmail ? (state.selectedEmail as Email).id : null}
                onEmailSelect={actions.selectEmail}
                onEmailDelete={actions.deleteEmail}
                loading={state.loading}
              />
            )}
          </div>
        </div>
      </div>
    </NotificationSystem>
  )
}

export default EmailClientLayout