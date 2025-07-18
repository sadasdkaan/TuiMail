'use client'

import React, { useState } from 'react'
import { EmailList } from './EmailList'
import { generateMockEmails } from '@/lib/mock-data'
import { Email } from '@/lib/types'

export function EmailListDemo() {
  const [emails] = useState(() => generateMockEmails())
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [openedEmail, setOpenedEmail] = useState<Email | null>(null)

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email)
    console.log('Email selected:', email.subject)
  }

  const handleEmailOpen = (email: Email) => {
    setOpenedEmail(email)
    console.log('Email opened:', email.subject)
  }

  return (
    <div className="email-list-demo h-screen bg-terminal-bg">
      <div className="terminal-container h-full flex flex-col">
        {/* Header */}
        <div className="demo-header terminal-border-b p-4">
          <h1 className="text-xl font-bold terminal-accent mb-2">
            Terminal Email Client - Email List Demo
          </h1>
          <p className="terminal-dim text-sm">
            Use keyboard navigation: j/k or arrow keys to navigate, Enter to open, Space to select
          </p>
        </div>

        {/* Main content area */}
        <div className="demo-content flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Email list */}
          <div className="email-list-section flex-1 flex flex-col">
            <div className="section-header terminal-border-b p-2 mb-2">
              <h2 className="font-bold">Inbox</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <EmailList
                emails={emails.filter(email => email.folderId === 'inbox')}
                selectedEmailId={selectedEmail?.id}
                onEmailSelect={handleEmailSelect}
                onEmailOpen={handleEmailOpen}
                className="h-full"
              />
            </div>
          </div>

          {/* Email preview */}
          <div className="email-preview-section w-96 terminal-border-l pl-4">
            <div className="section-header terminal-border-b p-2 mb-2">
              <h2 className="font-bold">Preview</h2>
            </div>
            
            {selectedEmail ? (
              <div className="email-preview space-y-4">
                <div className="email-header space-y-2">
                  <div>
                    <span className="terminal-dim">From: </span>
                    <span className="terminal-fg">{selectedEmail.from}</span>
                  </div>
                  <div>
                    <span className="terminal-dim">To: </span>
                    <span className="terminal-fg">{selectedEmail.to.join(', ')}</span>
                  </div>
                  <div>
                    <span className="terminal-dim">Subject: </span>
                    <span className="terminal-fg font-bold">{selectedEmail.subject}</span>
                  </div>
                  <div>
                    <span className="terminal-dim">Date: </span>
                    <span className="terminal-fg">{selectedEmail.date.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {!selectedEmail.isRead && (
                      <span className="terminal-accent text-sm">● Unread</span>
                    )}
                    {selectedEmail.isFlagged && (
                      <span className="terminal-warning text-sm">⚑ Flagged</span>
                    )}
                    {selectedEmail.hasAttachments && (
                      <span className="terminal-info text-sm">📎 Attachments</span>
                    )}
                  </div>
                </div>
                
                <div className="terminal-border-t pt-4">
                  <div className="terminal-dim mb-2">Message:</div>
                  <div className="email-body bg-terminal-hover p-3 rounded-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {selectedEmail.body}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 terminal-dim">
                <p>Select an email to preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="demo-status terminal-border-t p-2 bg-terminal-hover">
          <div className="flex justify-between items-center text-sm terminal-dim">
            <span>
              {selectedEmail ? `Selected: ${selectedEmail.subject}` : 'No email selected'}
            </span>
            <span>
              {openedEmail ? `Last opened: ${openedEmail.subject}` : 'No email opened'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailListDemo