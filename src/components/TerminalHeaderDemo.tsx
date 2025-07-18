'use client'

import { useState } from 'react'
import { TerminalHeader } from './TerminalHeader'

export default function TerminalHeaderDemo() {
  const [demoState, setDemoState] = useState({
    currentFolder: 'INBOX',
    emailCount: 42,
    unreadCount: 7,
    isConnected: true
  })

  const demoStates = [
    {
      name: 'Default Inbox',
      state: { currentFolder: 'INBOX', emailCount: 42, unreadCount: 7, isConnected: true }
    },
    {
      name: 'Sent Folder',
      state: { currentFolder: 'SENT', emailCount: 156, unreadCount: 0, isConnected: true }
    },
    {
      name: 'Drafts Folder',
      state: { currentFolder: 'DRAFTS', emailCount: 3, unreadCount: 3, isConnected: true }
    },
    {
      name: 'Empty Trash',
      state: { currentFolder: 'TRASH', emailCount: 0, unreadCount: 0, isConnected: true }
    },
    {
      name: 'Offline State',
      state: { currentFolder: 'INBOX', emailCount: 42, unreadCount: 7, isConnected: false }
    },
    {
      name: 'Single Message',
      state: { currentFolder: 'INBOX', emailCount: 1, unreadCount: 1, isConnected: true }
    }
  ]

  return (
    <div className="space-y-4">
      <div className="terminal-border p-4">
        <h2 className="terminal-accent text-lg mb-4">TerminalHeader Component Demo</h2>
        
        <div className="mb-4">
          <h3 className="terminal-info mb-2">Current State:</h3>
          <div className="terminal-border">
            <TerminalHeader {...demoState} />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="terminal-info mb-2">Demo States:</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {demoStates.map((demo, index) => (
              <button
                key={index}
                onClick={() => setDemoState(demo.state)}
                className="terminal-border p-2 text-left hover:bg-terminal-hover transition-colors"
              >
                <div className="terminal-accent text-sm font-bold">{demo.name}</div>
                <div className="terminal-dim text-xs">
                  {demo.state.currentFolder} • {demo.state.emailCount} msgs
                  {demo.state.unreadCount > 0 && ` • ${demo.state.unreadCount} unread`}
                  {!demo.state.isConnected && ' • OFFLINE'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="terminal-dim text-sm">
          <h3 className="terminal-info mb-2">Features Demonstrated:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>✓ Current folder display with terminal-style brackets</li>
            <li>✓ Email count with proper singular/plural handling</li>
            <li>✓ Unread count highlighting (only shown when &gt; 0)</li>
            <li>✓ Connection status indicator with color coding</li>
            <li>✓ Real-time clock display in terminal format</li>
            <li>✓ Terminal prompt simulation (user@terminal-mail:~$)</li>
            <li>✓ Responsive design (mobile-friendly layout)</li>
            <li>✓ WebTUI styling with authentic terminal appearance</li>
            <li>✓ Accessibility features (ARIA labels, semantic HTML)</li>
            <li>✓ Blinking cursor animation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}