'use client'

import { useState, useEffect, useCallback } from 'react'
import { Folder } from '@/lib/types'
import { useResponsive } from '@/hooks/useResponsive'

interface SidebarProps {
  folders: Folder[]
  currentFolderId: string
  onFolderSelect: (folderId: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function Sidebar({
  folders,
  currentFolderId,
  onFolderSelect,
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}: SidebarProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  // Use responsive hooks
  const { isMobile, isTablet } = useResponsive()
  const shouldUseMobileLayout = isMobile || isTablet
  const getResponsiveTransition = () => '0.3s'

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update selected index when current folder changes
  useEffect(() => {
    const index = folders.findIndex(folder => folder.id === currentFolderId)
    if (index !== -1) {
      setSelectedIndex(index)
    }
  }, [currentFolderId, folders])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isCollapsed && shouldUseMobileLayout) return

    switch (event.key) {
      case 'j':
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => (prev < folders.length - 1 ? prev + 1 : 0))
        break
      case 'k':
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : folders.length - 1))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (folders[selectedIndex]) {
          onFolderSelect(folders[selectedIndex].id)
        }
        break
      case 'Escape':
        if (shouldUseMobileLayout && onToggleCollapse) {
          event.preventDefault()
          onToggleCollapse()
        }
        break
    }
  }, [folders, selectedIndex, onFolderSelect, isCollapsed, shouldUseMobileLayout, onToggleCollapse])

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle folder click
  const handleFolderClick = (folderId: string, index: number) => {
    setSelectedIndex(index)
    onFolderSelect(folderId)
    if (shouldUseMobileLayout && onToggleCollapse) {
      onToggleCollapse()
    }
  }

  // Get folder icon based on type
  const getFolderIcon = (folder: Folder): string => {
    if (folder.icon) return folder.icon
    switch (folder.type) {
      case 'inbox': return '📥'
      case 'sent': return '📤'
      case 'drafts': return '📝'
      case 'trash': return '🗑️'
      default: return '📁'
    }
  }

  // Format folder display name
  const formatFolderName = (folder: Folder): string => folder.name.toUpperCase()

  // Get unread count display
  const getUnreadDisplay = (folder: Folder): string =>
    folder.unreadCount > 0 ? `(${folder.unreadCount})` : ''

  const sidebarClasses = `
    ${isCollapsed && shouldUseMobileLayout ? 'terminal-hide-mobile' : ''}
    ${className}
  `.trim()

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && shouldUseMobileLayout && (
        <div
          className="fixed inset-0 z-40 terminal-show-mobile"
          style={{
            backgroundColor: 'var(--background0, var(--terminal-bg))',
            opacity: 0.75
          }}
          onClick={onToggleCollapse}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={sidebarClasses}
        role="navigation"
        aria-label="Email folders navigation"
        style={{
          width: isCollapsed && shouldUseMobileLayout ? '0' : '250px',
          minWidth: isCollapsed && shouldUseMobileLayout ? '0' : '200px',
          maxWidth: '300px',
          transition: `width ${getResponsiveTransition()}`,
          overflow: isCollapsed && shouldUseMobileLayout ? 'hidden' : 'visible',
          zIndex: shouldUseMobileLayout ? 50 : 'auto',
          position: shouldUseMobileLayout ? 'fixed' : 'relative',
          top: shouldUseMobileLayout ? '0' : 'auto',
          left: shouldUseMobileLayout ? '0' : 'auto',
          height: shouldUseMobileLayout ? '100vh' : 'auto',
          backgroundColor: 'var(--background0, var(--terminal-bg))',
          color: 'var(--foreground0, var(--terminal-fg))',
          border: '1px solid var(--foreground2, var(--terminal-border))'
        }}
      >
        {/* Sidebar header */}
        <div
          className="p-3"
          style={{ borderBottom: '1px solid var(--foreground2, var(--terminal-border))' }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="font-bold text-lg terminal-glow"
              style={{ color: 'var(--foreground0, var(--terminal-accent))' }}
            >
              ╔═ FOLDERS ═╗
            </h2>
            {shouldUseMobileLayout && onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                variant-="background1"
                size-="small"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            )}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: 'var(--foreground1, var(--terminal-dim))' }}
          >
            ▶ Use j/k or ↑/↓ to navigate
          </div>
        </div>

        {/* Folder list */}
        <div className="p-2">
          <ul role="list" className="space-y-1">
            {folders.map((folder, index) => {
              const isSelected = isClient ? index === selectedIndex : false
              const isActive = isClient ? folder.id === currentFolderId : false
              const variant = isSelected
                ? 'background2'
                : isActive
                ? 'background1'
                : 'background0'

              return (
                <li key={folder.id} role="listitem">
                  <button
                    variant-={variant}
                    size-="large"
                    className="w-full text-left flex items-center justify-between"
                    aria-pressed={isSelected}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleFolderClick(folder.id, index)
                    }}
                    type="button"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg" aria-hidden="true">
                        {getFolderIcon(folder)}
                      </span>
                      <span className="font-mono">{formatFolderName(folder)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {folder.unreadCount > 0 && (
                        <span
                          className="font-bold"
                          style={{ color: 'var(--red, var(--terminal-warning))' }}
                          aria-label={`${folder.unreadCount} unread messages`}
                        >
                          {getUnreadDisplay(folder)}
                        </span>
                      )}
                      <span
                        style={{ color: 'var(--foreground1, var(--terminal-dim))' }}
                        aria-label={`${folder.emailCount} total messages`}
                      >
                        [{folder.emailCount}]
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Sidebar footer with keyboard shortcuts */}
        <div
          className="p-3 mt-auto"
          style={{ borderTop: '1px solid var(--foreground2, var(--terminal-border))' }}
        >
          <div
            className="text-xs space-y-1"
            style={{ color: 'var(--foreground1, var(--terminal-dim))' }}
          >
            <div>SHORTCUTS:</div>
            <div>j/k - Navigate</div>
            <div>Enter - Select</div>
            <div>Esc - Close (mobile)</div>
          </div>
        </div>
      </aside>
    </>
  )
}