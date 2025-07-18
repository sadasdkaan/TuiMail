'use client'

import React, { useState } from 'react'

export default function TerminalEmailClientDemo() {
  const [currentView, setCurrentView] = useState<'inbox' | 'compose' | 'read'>('inbox')
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)

  const mockEmails = [
    {
      id: 1,
      from: 'john.doe@example.com',
      subject: 'Project Update - Q4 Planning',
      date: '2024-01-15 14:30',
      isRead: false,
      hasAttachment: true,
      preview: 'Hi team, I wanted to share the latest updates on our Q4 planning initiative...'
    },
    {
      id: 2,
      from: 'sarah.wilson@company.org',
      subject: 'Meeting Notes - Architecture Review',
      date: '2024-01-15 11:45',
      isRead: true,
      hasAttachment: false,
      preview: 'Following up on our architecture review meeting yesterday...'
    },
    {
      id: 3,
      from: 'notifications@github.com',
      subject: '[GitHub] New pull request opened',
      date: '2024-01-15 09:15',
      isRead: false,
      hasAttachment: false,
      preview: 'A new pull request has been opened in your repository...'
    },
    {
      id: 4,
      from: 'admin@terminal-mail.dev',
      subject: 'Welcome to Terminal Mail Client',
      date: '2024-01-14 16:20',
      isRead: true,
      hasAttachment: true,
      preview: 'Welcome to the terminal-style email client! This is a demo message...'
    }
  ]

  const folders = [
    { name: 'Inbox', count: 4, unread: 2, active: true },
    { name: 'Sent', count: 12, unread: 0, active: false },
    { name: 'Drafts', count: 3, unread: 0, active: false },
    { name: 'Trash', count: 8, unread: 0, active: false }
  ]

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg font-mono">
      {/* Terminal Header */}
      <header className="terminal-border-b p-2 bg-terminal-hover">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="terminal-accent font-bold">TERMINAL-MAIL v2.1.0</span>
            <span className="terminal-dim">|</span>
            <span className="text-sm">Connected to mail.example.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm terminal-dim">
              {new Date().toLocaleString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="terminal-success">●</span>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 terminal-border-r bg-terminal-bg">
          {/* Navigation Menu */}
          <nav className="p-4">
            <h2 className="terminal-accent font-bold mb-4 text-lg">FOLDERS</h2>
            <ul className="space-y-1">
              {folders.map((folder, index) => (
                <li key={index}>
                  <button 
                    className={`w-full text-left p-2 rounded-none transition-colors ${
                      folder.active 
                        ? 'bg-terminal-selection terminal-accent' 
                        : 'hover:bg-terminal-hover'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="terminal-prompt"></span>
                        {folder.name}
                      </span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="terminal-dim">{folder.count}</span>
                        {folder.unread > 0 && (
                          <span className="terminal-warning font-bold">({folder.unread})</span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Actions */}
          <div className="p-4 terminal-border-t">
            <h3 className="terminal-accent font-bold mb-2">ACTIONS</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setCurrentView('compose')}
                className="w-full terminal-button-primary p-2 text-sm"
              >
                [C] Compose New
              </button>
              <button className="w-full terminal-button-secondary p-2 text-sm">
                [R] Refresh
              </button>
              <button className="w-full terminal-button-secondary p-2 text-sm">
                [S] Search
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="absolute bottom-0 left-0 right-0 w-64 terminal-status-bar">
            <div className="text-xs">
              Status: Online | Quota: 2.1GB/5GB | Last sync: 14:30
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {currentView === 'inbox' && (
            <>
              {/* Email List Header */}
              <div className="terminal-border-b p-4 bg-terminal-hover">
                <div className="flex justify-between items-center">
                  <h1 className="terminal-accent font-bold text-xl">INBOX</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="terminal-dim">4 messages, 2 unread</span>
                    <div className="flex gap-2">
                      <span className="terminal-info">[↑↓] Navigate</span>
                      <span className="terminal-info">[Enter] Open</span>
                      <span className="terminal-info">[D] Delete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email List */}
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="terminal-border-b bg-terminal-dim text-terminal-bg">
                    <tr>
                      <th className="p-3 text-left w-8">#</th>
                      <th className="p-3 text-left">FROM</th>
                      <th className="p-3 text-left">SUBJECT</th>
                      <th className="p-3 text-left w-32">DATE</th>
                      <th className="p-3 text-left w-16">ATT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEmails.map((email, index) => (
                      <tr 
                        key={email.id}
                        className={`terminal-border-b cursor-pointer transition-colors ${
                          selectedEmail === email.id 
                            ? 'bg-terminal-selection' 
                            : 'hover:bg-terminal-hover'
                        } ${!email.isRead ? 'font-bold terminal-accent' : ''}`}
                        onClick={() => {
                          setSelectedEmail(email.id)
                          setCurrentView('read')
                        }}
                      >
                        <td className="p-3">
                          <span className="terminal-dim">{index + 1}</span>
                          {!email.isRead && <span className="terminal-warning ml-1">●</span>}
                        </td>
                        <td className="p-3 truncate max-w-48">{email.from}</td>
                        <td className="p-3 truncate">{email.subject}</td>
                        <td className="p-3 text-sm terminal-dim">{email.date}</td>
                        <td className="p-3 text-center">
                          {email.hasAttachment && <span className="terminal-info">📎</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {currentView === 'read' && selectedEmail && (
            <>
              {/* Email Header */}
              <div className="terminal-border-b p-4 bg-terminal-hover">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setCurrentView('inbox')}
                    className="terminal-button-secondary px-4 py-2"
                  >
                    ← Back to Inbox
                  </button>
                  <div className="flex gap-2">
                    <button className="terminal-button-secondary px-3 py-2">Reply</button>
                    <button className="terminal-button-secondary px-3 py-2">Forward</button>
                    <button className="terminal-button-danger px-3 py-2">Delete</button>
                  </div>
                </div>
                
                {(() => {
                  const email = mockEmails.find(e => e.id === selectedEmail)
                  return email ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                        <span className="terminal-accent font-bold">FROM:</span>
                        <span>{email.from}</span>
                        <span className="terminal-accent font-bold">SUBJECT:</span>
                        <span>{email.subject}</span>
                        <span className="terminal-accent font-bold">DATE:</span>
                        <span>{email.date}</span>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>

              {/* Email Content */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="terminal-box-simple max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
{`Hi team,

I wanted to share the latest updates on our Q4 planning initiative and get everyone aligned on our upcoming milestones.

## Key Updates:

1. **Architecture Review**: We've completed the initial architecture review for the new terminal email client. The feedback has been overwhelmingly positive, and we're ready to move forward with the implementation phase.

2. **Timeline Adjustments**: Based on the complexity analysis, we're adjusting our timeline slightly to ensure quality delivery:
   - Phase 1 (Core Features): January 30th
   - Phase 2 (Advanced Features): February 15th
   - Phase 3 (Polish & Testing): February 28th

3. **Resource Allocation**: We've secured additional development resources to support the terminal UI implementation. Sarah will be leading the WebTUI integration efforts.

## Next Steps:

- [ ] Finalize component specifications
- [ ] Set up development environment
- [ ] Begin core feature implementation
- [ ] Schedule weekly progress reviews

Please review the attached technical specifications and let me know if you have any questions or concerns.

Looking forward to building something amazing together!

Best regards,
John Doe
Senior Software Engineer
john.doe@example.com

---
This message was sent from Terminal Mail Client v2.1.0
Encrypted with TLS 1.3 | Message ID: msg_20240115_143052_abc123`}
                  </pre>
                </div>
              </div>
            </>
          )}

          {currentView === 'compose' && (
            <>
              {/* Compose Header */}
              <div className="terminal-border-b p-4 bg-terminal-hover">
                <div className="flex justify-between items-center">
                  <h1 className="terminal-accent font-bold text-xl">COMPOSE MESSAGE</h1>
                  <div className="flex gap-2">
                    <button className="terminal-button-primary px-4 py-2">
                      [Ctrl+Enter] Send
                    </button>
                    <button 
                      onClick={() => setCurrentView('inbox')}
                      className="terminal-button-secondary px-4 py-2"
                    >
                      [Esc] Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Compose Form */}
              <div className="flex-1 p-6 overflow-auto">
                <form className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                    <label className="terminal-accent font-bold">TO:</label>
                    <input 
                      type="email" 
                      className="terminal-input-focus bg-terminal-bg border terminal-border p-2"
                      placeholder="recipient@example.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                    <label className="terminal-accent font-bold">CC:</label>
                    <input 
                      type="email" 
                      className="terminal-input-focus bg-terminal-bg border terminal-border p-2"
                      placeholder="cc@example.com (optional)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                    <label className="terminal-accent font-bold">SUBJECT:</label>
                    <input 
                      type="text" 
                      className="terminal-input-focus bg-terminal-bg border terminal-border p-2"
                      placeholder="Enter subject line"
                    />
                  </div>

                  <div className="terminal-border-t pt-4">
                    <label className="terminal-accent font-bold block mb-2">MESSAGE:</label>
                    <textarea 
                      className="w-full h-96 terminal-input-focus bg-terminal-bg border terminal-border p-4 font-mono text-sm resize-none"
                      placeholder="Type your message here...

Use plain text formatting for best compatibility with terminal email clients.

Keyboard shortcuts:
- Ctrl+Enter: Send message
- Esc: Cancel composition
- Tab: Move between fields"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 terminal-border-t">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="terminal-accent" />
                        <span className="text-sm">Request read receipt</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="terminal-accent" />
                        <span className="text-sm">High priority</span>
                      </label>
                    </div>
                    <div className="text-sm terminal-dim">
                      Draft auto-saved at 14:32
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Status Bar */}
      <footer className="terminal-status-bar">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <span>Terminal Mail Client v2.1.0</span>
            <span>|</span>
            <span>User: developer@terminal-mail.dev</span>
            <span>|</span>
            <span>Server: mail.example.com:993 (SSL)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Memory: 45MB</span>
            <span>|</span>
            <span>Uptime: 2h 15m</span>
            <span>|</span>
            <span className="terminal-success">Connected</span>
          </div>
        </div>
      </footer>
    </div>
  )
}