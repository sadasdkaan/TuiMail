'use client'

import { useState, useEffect } from 'react'
import ThemeSelector from './ThemeSelector'

interface TerminalHeaderProps {
  currentFolder?: string
  emailCount?: number
  unreadCount?: number
  isConnected?: boolean
  onCompose?: () => void
  onToggleSidebar?: () => void
  showSidebarToggle?: boolean
  onShowDemo?: () => void
}

export function TerminalHeader({
  currentFolder = 'INBOX',
  emailCount = 0,
  unreadCount = 0,
  isConnected = true,
  onCompose,
  onToggleSidebar,
  showSidebarToggle = false
}: TerminalHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDateTime, setCurrentDateTime] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  // Initialize client-side state after mounting
  useEffect(() => {
    setIsMounted(true)

    const updateClock = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      setCurrentTime(timeString)
      setCurrentDateTime(now.toISOString())
    }

    // Update immediately
    updateClock()

    // Set up interval for updates
    const interval = setInterval(updateClock, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle compose keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return

      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (event.key.toLowerCase() === 'c' && onCompose) {
        event.preventDefault()
        onCompose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCompose])

  const connectionStatus = isConnected ? 'ONLINE' : 'OFFLINE'

  return (
    <header
      className="p-2 font-mono"
      style={{
        backgroundColor: 'var(--background0, var(--terminal-bg))',
        color: 'var(--foreground0, var(--terminal-fg))',
        border: '1px solid var(--foreground2, var(--terminal-border))'
      }}
      role="banner"
      aria-label="Terminal email client header"
    >
      <div className="flex items-center justify-between">
        {/* Left section: Sidebar toggle (mobile) and folder info */}
        <div className="flex items-center gap-4">
          {showSidebarToggle && onToggleSidebar && (
            <button
              variant-="background1"
              onClick={onToggleSidebar}
              className="terminal-show-mobile p-1 transition-colors"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              ☰
            </button>
          )}
          <div className="flex items-center gap-2">
            <span
              className="font-bold"
              style={{ color: 'var(--foreground0, var(--terminal-accent))' }}
              aria-label="Current folder"
            >
              [{isMounted ? currentFolder : 'INBOX'}]
            </span>
            <span style={{ color: 'var(--foreground1, var(--terminal-dim))' }}>
              {emailCount} message{emailCount !== 1 ? 's' : ''}
            </span>
            {unreadCount > 0 && (
              <span
                className="font-bold"
                style={{ color: 'var(--red, var(--terminal-warning))' }}
              >
                ({unreadCount} unread)
              </span>
            )}
          </div>
        </div>

        {/* Center section: Terminal prompt style and compose button */}
        <div className="flex items-center gap-4">
          <div className="terminal-hide-mobile">
            <span style={{ color: 'var(--foreground1, var(--terminal-dim))' }}>
              user@terminal-mail:~$
            </span>
            <span
              className="terminal-cursor ml-1 terminal-glow"
              aria-hidden="true"
            ></span>
          </div>
          {onCompose && (
            <button
              variant-="foreground2"
              onClick={onCompose}
              className="font-bold px-3 py-1 transition-colors"
              aria-label="Compose new email"
              title="Compose new email (C)"
            >
              ✉ COMPOSE
            </button>
          )}
        </div>

        {/* Right section: Theme selector, connection status and clock */}
        <div className="flex items-center gap-4">
          {/* Theme Selector */}
          <ThemeSelector compact className="text-sm" />

          <div className="flex items-center gap-2">
            <span
              className="font-bold"
              style={{
                color: isConnected
                  ? 'var(--green, var(--terminal-success))'
                  : 'var(--red, var(--terminal-error))'
              }}
              aria-label={`Connection status: ${connectionStatus}`}
            >
              ● {connectionStatus}
            </span>
          </div>
          <div
            className="px-2 py-1"
            style={{
              border: '1px solid var(--foreground2, var(--terminal-border))'
            }}
          >
            {isMounted ? (
              <time
                dateTime={currentDateTime}
                className="font-mono"
                style={{ color: 'var(--foreground0, var(--terminal-accent))' }}
                aria-label={`Current time: ${currentTime}`}
              >
                {currentTime}
              </time>
            ) : (
              <span
                className="font-mono"
                style={{ color: 'var(--foreground0, var(--terminal-accent))' }}
              >
                --:--:--
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-specific layout */}
      <div className="terminal-show-mobile mt-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--foreground1, var(--terminal-dim))' }}>
            user@terminal-mail
          </span>
          <span className="terminal-cursor" aria-hidden="true"></span>
        </div>
        {onCompose && (
          <button
            variant-="foreground2"
            onClick={onCompose}
            className="font-bold px-2 py-1 text-xs transition-colors"
            aria-label="Compose new email"
            title="Compose new email"
          >
            ✉ NEW
          </button>
        )}
      </div>
    </header>
  )
}