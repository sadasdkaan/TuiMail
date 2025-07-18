'use client'

import { useEffect } from 'react'
import { useEmailState } from '@/hooks/useEmailState'
import { Email, Folder } from '@/lib/types'

// Mock data for demonstration
const mockFolders: Folder[] = [
  { id: 'inbox', name: 'Inbox', type: 'inbox', emailCount: 5, unreadCount: 2 },
  { id: 'sent', name: 'Sent', type: 'sent', emailCount: 12, unreadCount: 0 },
  { id: 'drafts', name: 'Drafts', type: 'drafts', emailCount: 3, unreadCount: 1 },
  { id: 'trash', name: 'Trash', type: 'trash', emailCount: 8, unreadCount: 0 },
]

const mockEmails: Email[] = [
  {
    id: 'email-1',
    from: 'john@example.com',
    to: ['user@example.com'],
    subject: 'Welcome to Terminal Email Client',
    body: 'This is a test email to demonstrate the terminal email client functionality.',
    date: new Date('2024-01-15T10:30:00'),
    isRead: false,
    isFlagged: false,
    hasAttachments: false,
    folderId: 'inbox',
  },
  {
    id: 'email-2',
    from: 'support@example.com',
    to: ['user@example.com'],
    subject: 'System Maintenance Notice',
    body: 'We will be performing scheduled maintenance on our servers.',
    date: new Date('2024-01-14T15:45:00'),
    isRead: true,
    isFlagged: true,
    hasAttachments: false,
    folderId: 'inbox',
  },
  {
    id: 'email-3',
    from: 'user@example.com',
    to: ['colleague@example.com'],
    subject: 'Project Update',
    body: 'Here is the latest update on our project progress.',
    date: new Date('2024-01-13T09:15:00'),
    isRead: true,
    isFlagged: false,
    hasAttachments: true,
    folderId: 'sent',
  },
]

export default function EmailStateDemo() {
  const { state, actions } = useEmailState()

  const currentFolder = state.currentFolder
  const selectedEmail = state.selectedEmail
  const emails = state.emails
  const isComposing = state.isComposing
  const composeData = state.composeData
  const isLoading = state.loading
  const error = state.error

  // Initialize with mock data
  useEffect(() => {
    // This would be handled by the actual useEmailState hook
    // For demo purposes, we'll just show the current state
  }, [])

  // Get current folder emails
  const currentFolderEmails = emails.filter(email => email.folderId === currentFolder)
  const selectedEmailData = selectedEmail

  return (
    <div className="p-6 space-y-6 bg-terminal-bg text-terminal-fg font-mono">
      <div className="terminal-border p-4">
        <h1 className="text-xl font-bold terminal-accent mb-4">
          EMAIL STATE MANAGEMENT DEMO
        </h1>
        
        {/* Current State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="terminal-border p-3">
            <h3 className="font-bold terminal-warning mb-2">CURRENT STATE</h3>
            <div className="space-y-1 text-sm">
              <div>Folder: <span className="terminal-accent">{currentFolder}</span></div>
              <div>Selected: <span className="terminal-accent">{selectedEmail?.id || 'None'}</span></div>
              <div>Composing: <span className="terminal-accent">{isComposing ? 'Yes' : 'No'}</span></div>
              <div>Loading: <span className="terminal-accent">{isLoading ? 'Yes' : 'No'}</span></div>
              <div>Search: <span className="terminal-accent">"{state.searchQuery}"</span></div>
              {error && <div>Error: <span className="terminal-error">{error}</span></div>}
            </div>
          </div>

          <div className="terminal-border p-3">
            <h3 className="font-bold terminal-warning mb-2">STATISTICS</h3>
            <div className="space-y-1 text-sm">
              <div>Total Emails: <span className="terminal-accent">{emails.length}</span></div>
              <div>Current Folder: <span className="terminal-accent">{currentFolderEmails.length}</span></div>
              <div>Unread: <span className="terminal-accent">{emails.filter(e => !e.isRead).length}</span></div>
              <div>Flagged: <span className="terminal-accent">{emails.filter(e => e.isFlagged).length}</span></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold terminal-warning mb-2">FOLDER ACTIONS</h3>
            <div className="flex flex-wrap gap-2">
              {mockFolders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => actions.setCurrentFolder(folder.id)}
                  className={`px-3 py-1 terminal-border hover:terminal-highlight ${
                    currentFolder === folder.id ? 'terminal-accent font-bold' : ''
                  }`}
                >
                  {folder.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold terminal-warning mb-2">EMAIL ACTIONS</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => actions.selectEmail(currentFolderEmails[0] || null)}
                disabled={currentFolderEmails.length === 0}
                className="px-3 py-1 terminal-border hover:terminal-highlight disabled:terminal-dim"
              >
                SELECT FIRST
              </button>
              <button
                onClick={() => actions.selectEmail(null)}
                className="px-3 py-1 terminal-border hover:terminal-highlight"
              >
                CLEAR SELECTION
              </button>
              <button
                onClick={() => isComposing ? actions.cancelCompose() : actions.startCompose()}
                className="px-3 py-1 terminal-border hover:terminal-highlight"
              >
                {isComposing ? 'CLOSE COMPOSE' : 'COMPOSE'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold terminal-warning mb-2">UTILITY ACTIONS</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => actions.searchEmails('test')}
                className="px-3 py-1 terminal-border hover:terminal-highlight"
              >
                SEARCH "test"
              </button>
              <button
                onClick={() => actions.clearSearch()}
                className="px-3 py-1 terminal-border hover:terminal-highlight"
              >
                CLEAR SEARCH
              </button>
            </div>
          </div>
        </div>

        {/* Current Folder Emails */}
        <div className="mt-6">
          <h3 className="font-bold terminal-warning mb-2">
            EMAILS IN {currentFolder.toUpperCase()} ({currentFolderEmails.length})
          </h3>
          {isLoading ? (
            <div className="terminal-dim">Loading emails...</div>
          ) : currentFolderEmails.length > 0 ? (
            <div className="space-y-2">
              {currentFolderEmails.map(email => (
                <div
                  key={email.id}
                  className={`terminal-border p-2 cursor-pointer hover:terminal-highlight ${
                    selectedEmail?.id === email.id ? 'terminal-accent' : ''
                  } ${!email.isRead ? 'font-bold' : 'terminal-dim'}`}
                  onClick={() => actions.selectEmail(email)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm">
                        From: {email.from}
                      </div>
                      <div className="font-bold">
                        {email.subject}
                      </div>
                    </div>
                    <div className="text-xs terminal-dim">
                      {email.date.toLocaleDateString()}
                      {email.isFlagged && ' 🚩'}
                      {email.hasAttachments && ' 📎'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="terminal-dim">No emails in this folder</div>
          )}
        </div>

        {/* Selected Email Details */}
        {selectedEmailData && (
          <div className="mt-6">
            <h3 className="font-bold terminal-warning mb-2">SELECTED EMAIL</h3>
            <div className="terminal-border p-3 space-y-2">
              <div><strong>ID:</strong> {selectedEmailData.id}</div>
              <div><strong>From:</strong> {selectedEmailData.from}</div>
              <div><strong>Subject:</strong> {selectedEmailData.subject}</div>
              <div><strong>Date:</strong> {selectedEmailData.date.toLocaleString()}</div>
              <div><strong>Status:</strong> {selectedEmailData.isRead ? 'Read' : 'Unread'}</div>
              <div><strong>Body:</strong></div>
              <div className="terminal-border p-2 terminal-dim text-sm">
                {selectedEmailData.body}
              </div>
            </div>
          </div>
        )}

        {/* Compose State */}
        {isComposing && (
          <div className="mt-6">
            <h3 className="font-bold terminal-warning mb-2">COMPOSE MODE</h3>
            <div className="terminal-border p-3">
              <div>Compose mode is active</div>
              {composeData && (
                <div className="mt-2 space-y-1 text-sm">
                  <div>To: {composeData.to}</div>
                  <div>Subject: {composeData.subject}</div>
                  <div>Body Length: {composeData.body.length} chars</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}