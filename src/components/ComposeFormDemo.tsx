'use client'

import React, { useState } from 'react'
import { ComposeForm } from './ComposeForm'
import { ComposeData } from '@/lib/types'

export function ComposeFormDemo() {
  const [isComposing, setIsComposing] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')
  const [sentEmails, setSentEmails] = useState<ComposeData[]>([])

  const handleSend = async (data: ComposeData) => {
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSentEmails(prev => [...prev, { ...data, isDraft: false }])
    setLastAction(`Email sent to: ${data.to}`)
    setIsComposing(false)
  }

  const handleCancel = () => {
    setLastAction('Compose cancelled')
    setIsComposing(false)
  }

  const handleSaveDraft = async (data: ComposeData) => {
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setLastAction('Draft saved successfully')
  }

  const startCompose = () => {
    setIsComposing(true)
    setLastAction('')
  }

  const startReply = () => {
    setIsComposing(true)
    setLastAction('')
  }

  if (isComposing) {
    return (
      <div className="compose-demo h-screen overflow-auto">
        <ComposeForm
          initialData={{
            to: '',
            subject: '',
            body: ''
          }}
          onSend={handleSend}
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          autoFocus={true}
        />
      </div>
    )
  }

  return (
    <div className="compose-demo terminal-container p-4">
      {/* Demo header */}
      <div className="demo-header terminal-border-b pb-4 mb-6">
        <h1 className="text-xl font-bold terminal-accent mb-2">
          ┌─ COMPOSE FORM DEMO ─┐
        </h1>
        <p className="terminal-dim">
          Demonstration of the terminal-style email composition form with WebTUI styling.
        </p>
      </div>

      {/* Action buttons */}
      <div className="demo-actions space-y-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={startCompose}
            className="terminal-success hover:bg-terminal-success hover:text-terminal-bg font-bold px-4 py-2"
          >
            ▶ New Email
          </button>
          
          <button
            onClick={startReply}
            className="terminal-info hover:bg-terminal-info hover:text-terminal-bg px-4 py-2"
          >
            ▶ Reply to Email
          </button>
        </div>

        {/* Keyboard shortcuts info */}
        <div className="terminal-border p-3 bg-terminal-hover">
          <h3 className="font-bold terminal-accent mb-2">Keyboard Shortcuts:</h3>
          <div className="text-sm terminal-dim space-y-1">
            <div><kbd className="terminal-accent">Ctrl+Enter</kbd> - Send email</div>
            <div><kbd className="terminal-accent">Ctrl+S</kbd> - Save draft</div>
            <div><kbd className="terminal-accent">Escape</kbd> - Cancel composition</div>
            <div><kbd className="terminal-accent">Tab</kbd> - Navigate between fields</div>
          </div>
        </div>
      </div>

      {/* Last action feedback */}
      {lastAction && (
        <div className="demo-feedback terminal-border p-3 mb-6 bg-terminal-hover">
          <h3 className="font-bold terminal-success mb-1">Last Action:</h3>
          <p className="terminal-dim">{lastAction}</p>
        </div>
      )}

      {/* Sent emails list */}
      {sentEmails.length > 0 && (
        <div className="demo-sent-emails terminal-border p-3">
          <h3 className="font-bold terminal-accent mb-3">Sent Emails ({sentEmails.length}):</h3>
          <div className="space-y-3">
            {sentEmails.map((email, index) => (
              <div key={index} className="terminal-border-l pl-3 border-l-2">
                <div className="text-sm">
                  <div><span className="terminal-dim">To:</span> {email.to}</div>
                  <div><span className="terminal-dim">Subject:</span> {email.subject}</div>
                  <div className="terminal-dim mt-1">
                    {email.body.substring(0, 100)}
                    {email.body.length > 100 ? '...' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature showcase */}
      <div className="demo-features mt-8 terminal-border-t pt-6">
        <h3 className="font-bold terminal-accent mb-3">ComposeForm Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="terminal-border p-3">
            <h4 className="font-bold terminal-info mb-2">Form Validation</h4>
            <ul className="terminal-dim space-y-1">
              <li>• Required field validation</li>
              <li>• Email format validation</li>
              <li>• Real-time error display</li>
              <li>• Terminal-style error messages</li>
            </ul>
          </div>

          <div className="terminal-border p-3">
            <h4 className="font-bold terminal-info mb-2">Keyboard Navigation</h4>
            <ul className="terminal-dim space-y-1">
              <li>• Global keyboard shortcuts</li>
              <li>• Tab navigation support</li>
              <li>• Auto-focus management</li>
              <li>• Escape key handling</li>
            </ul>
          </div>

          <div className="terminal-border p-3">
            <h4 className="font-bold terminal-info mb-2">Terminal Styling</h4>
            <ul className="terminal-dim space-y-1">
              <li>• WebTUI component integration</li>
              <li>• Monospace font consistency</li>
              <li>• Terminal color scheme</li>
              <li>• ASCII art elements</li>
            </ul>
          </div>

          <div className="terminal-border p-3">
            <h4 className="font-bold terminal-info mb-2">Accessibility</h4>
            <ul className="terminal-dim space-y-1">
              <li>• Screen reader support</li>
              <li>• ARIA labels and roles</li>
              <li>• Keyboard-only navigation</li>
              <li>• High contrast support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComposeFormDemo