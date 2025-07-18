'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEmailState } from '@/hooks/useEmailState'
import { Folder } from '@/lib/types'
import { useResponsiveLayout, useTouchFriendly } from '@/hooks/useResponsive'

interface SidebarWithStateProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export default function SidebarWithState({
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}: SidebarWithStateProps) {
  const { state, actions } = useEmailState()
  
  // Mock folders for demo purposes
  const folders: Folder[] = [
    { id: 'inbox', name: 'Inbox', type: 'inbox', emailCount: 5, unreadCount: 2 },
    { id: 'sent', name: 'Sent', type: 'sent', emailCount: 12, unreadCount: 0 },
    { id: 'drafts', name: 'Drafts', type: 'drafts', emailCount: 3, unreadCount: 1 },
    { id: 'trash', name: 'Trash', type: 'trash', emailCount: 8, unreadCount: 0 }
  ]
  
  const currentFolderId = state.currentFolder
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  // Use responsive hooks
  const { shouldUseMobileLayout, isTouchDevice, getResponsivePadding, getResponsiveTransition } = useResponsiveLayout()
  const { minTouchTarget, touchSpacing } = useTouchFriendly()

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
    // Only handle keyboard events when sidebar is focused or visible
    if (isCollapsed && shouldUseMobileLayout) return

    switch (event.key) {
      case 'j':
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = prev < folders.length - 1 ? prev + 1 : 0
          return newIndex
        })
        break
      
      case 'k':
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : folders.length - 1
          return newIndex
        })
        break
      
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (folders[selectedIndex]) {
          actions.setCurrentFolder(folders[selectedIndex].id)
        }
        break
      
      case 'Escape':
        if (shouldUseMobileLayout && onToggleCollapse) {
          event.preventDefault()
          onToggleCollapse()
        }
        break
    }
  }, [folders, selectedIndex, actions.setCurrentFolder, isCollapsed, shouldUseMobileLayout, onToggleCollapse])

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle folder click
  const handleFolderClick = (folderId: string, index: number) => {
    setSelectedIndex(index)
    actions.setCurrentFolder(folderId)
    
    // Auto-collapse on mobile after selection
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
  const formatFolderName = (folder: Folder): string => {
    return folder.name.toUpperCase()
  }

  // Get unread count display
  const getUnreadDisplay = (folder: Folder): string => {
    if (folder.unreadCount > 0) {
      return `(${folder.unreadCount})`
    }
    return ''
  }

  const sidebarClasses = `
    terminal-border bg-terminal-bg text-terminal-fg
    ${isCollapsed && shouldUseMobileLayout ? 'terminal-hide-mobile' : ''}
    ${className}
  `.trim()

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && shouldUseMobileLayout && (
        <div 
          className="fixed inset-0 bg-terminal-bg bg-opacity-75 z-40 terminal-show-mobile"
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
          height: shouldUseMobileLayout ? '100vh' : 'auto'
        }}
      >
        {/* Sidebar header */}
        <div className="terminal-border-b p-3">
          <div className="terminal-flex items-center justify-between">
            <h2 className="terminal-accent font-bold text-lg">
              FOLDERS
            </h2>
            {shouldUseMobileLayout && onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="terminal-dim hover:terminal-accent p-1"
                aria-label="Close sidebar"
                type="button"
                style={{ minHeight: `${minTouchTarget}px`, minWidth: `${minTouchTarget}px` }}
              >
                ✕
              </button>
            )}
          </div>
          <div className="terminal-dim text-sm mt-1">
            Use j/k or ↑/↓ to navigate
          </div>
        </div>

        {/* Folder list */}
        <nav className="p-2">
          <ul role="list" className="space-y-1">
            {folders.map((folder, index) => {
              // Only calculate these states on client side to avoid hydration mismatch
              const isSelected = isClient ? index === selectedIndex : false
              const isActive = isClient ? folder.id === currentFolderId : false
              
              return (
                <li key={folder.id} role="listitem">
                  <button
                    onClick={() => handleFolderClick(folder.id, index)}
                    className={`
                      w-full text-left terminal-border rounded-none
                      transition-all ease-in-out
                      terminal-flex items-center justify-between
                      cursor-pointer
                      ${isSelected ? 'terminal-highlight' : ''}
                      ${isActive ? 'terminal-accent font-bold' : ''}
                      hover:bg-terminal-hover
                      focus:outline-none focus:ring-2 focus:ring-terminal-accent
                    `.trim()}
                    style={{
                      minHeight: `${minTouchTarget}px`,
                      padding: touchSpacing,
                      transitionDuration: getResponsiveTransition()
                    }}

                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    type="button"
                  >
                    <div className="terminal-flex items-center gap-2 flex-1">
                      <span 
                        className="text-lg"
                        aria-hidden="true"
                      >
                        {getFolderIcon(folder)}
                      </span>
                      <span className="font-mono">
                        {formatFolderName(folder)}
                      </span>
                    </div>
                    
                    <div className="terminal-flex items-center gap-2 text-sm">
                      {folder.unreadCount > 0 && (
                        <span 
                          className="terminal-warning font-bold"
                          aria-label={`${folder.unreadCount} unread messages`}
                        >
                          {getUnreadDisplay(folder)}
                        </span>
                      )}
                      <span 
                        className="terminal-dim"
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
        </nav>

        {/* Sidebar footer with keyboard shortcuts */}
        <div className="terminal-border-t p-3 mt-auto">
          <div className="terminal-dim text-xs space-y-1">
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