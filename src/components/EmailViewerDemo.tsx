'use client'

import React, { useState } from 'react'
import { EmailViewer } from './EmailViewer'
import { generateMockEmails } from '@/lib/mock-data'
import { Email } from '@/lib/types'

export default function EmailViewerDemo() {
  const [emails] = useState<Email[]>(generateMockEmails())
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null)

  const selectedEmail = selectedEmailIndex !== null ? emails[selectedEmailIndex] : null

  const handleClose = () => {
    setSelectedEmailIndex(null)
  }

  const handlePrevious = () => {
    if (selectedEmailIndex !== null && selectedEmailIndex > 0) {
      setSelectedEmailIndex(selectedEmailIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedEmailIndex !== null && selectedEmailIndex < emails.length - 1) {
      setSelectedEmailIndex(selectedEmailIndex + 1)
    }
  }

  const hasPrevious = selectedEmailIndex !== null && selectedEmailIndex > 0
  const hasNext = selectedEmailIndex !== null && selectedEmailIndex < emails.length - 1

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
      background: '#000',
      color: '#00ff00'
    }}>
      {/* Email List Sidebar */}
      <div style={{ 
        width: '300px', 
        borderRight: '1px solid #333', 
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          color: '#ffff00', 
          marginBottom: '1rem',
          fontSize: '16px'
        }}>
          Email List Demo
        </h3>
        <div>
          {emails.map((email, index) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmailIndex(index)}
              style={{
                padding: '0.5rem',
                marginBottom: '0.25rem',
                border: selectedEmailIndex === index ? '1px solid #ffff00' : '1px solid #333',
                cursor: 'pointer',
                background: selectedEmailIndex === index ? 'rgba(255, 255, 0, 0.1)' : 'transparent',
                fontSize: '12px'
              }}
            >
              <div style={{ 
                fontWeight: email.isRead ? 'normal' : 'bold',
                color: email.isRead ? '#00ff00' : '#ffff00'
              }}>
                {email.from}
              </div>
              <div style={{ 
                color: '#808080',
                fontSize: '11px',
                marginTop: '0.25rem'
              }}>
                {email.subject}
              </div>
              <div style={{ 
                color: '#666',
                fontSize: '10px',
                marginTop: '0.25rem'
              }}>
                {email.date.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Viewer */}
      <div style={{ flex: 1 }}>
        <EmailViewer
          email={selectedEmail}
          folders={[]}
          emailService={new (require('@/lib/email-service').EmailService)()}
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onEmailUpdate={() => {}}
          onEmailDelete={() => {}}
          onEmailMove={() => {}}
        />
      </div>
    </div>
  )
}