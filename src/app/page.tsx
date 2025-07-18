'use client'

import EmailClientLayout from '@/components/EmailClientLayout'

export default function Home() {
  return (
    <div className="email-client-app min-h-screen bg-terminal-bg">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Main email client layout */}
      <EmailClientLayout />
    </div>
  )
}