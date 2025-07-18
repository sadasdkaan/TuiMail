'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { useSidebarCollapse } from '@/hooks/useResponsive'
import { generateMockFolders } from '@/lib/mock-data'

export default function SidebarDemo() {
  const [currentFolderId, setCurrentFolderId] = useState('inbox')
  const { isCollapsed, toggleCollapse, isMobile } = useSidebarCollapse()
  const folders = generateMockFolders()

  const handleFolderSelect = (folderId: string) => {
    setCurrentFolderId(folderId)
    console.log('Selected folder:', folderId)
  }

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg">
      {/* Mobile toggle button */}
      {isMobile && (
        <div className="terminal-border-b p-3 terminal-show-mobile">
          <button
            onClick={toggleCollapse}
            className="terminal-accent hover:terminal-warning p-2"
            aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
            type="button"
          >
            {isCollapsed ? '☰ FOLDERS' : '✕ CLOSE'}
          </button>
        </div>
      )}

      <div className="terminal-flex h-screen">
        {/* Sidebar */}
        <Sidebar
          folders={folders}
          currentFolderId={currentFolderId}
          onFolderSelect={handleFolderSelect}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Main content area */}
        <main className="flex-1 p-4 terminal-border-l">
          <div className="terminal-border p-4">
            <h1 className="terminal-accent text-xl font-bold mb-4">
              SIDEBAR DEMO
            </h1>
            
            <div className="space-y-4">
              <div>
                <span className="terminal-dim">Current Folder: </span>
                <span className="terminal-success font-bold">
                  {folders.find(f => f.id === currentFolderId)?.name || 'Unknown'}
                </span>
              </div>
              
              <div className="terminal-border p-3">
                <h2 className="terminal-warning font-bold mb-2">
                  KEYBOARD NAVIGATION:
                </h2>
                <ul className="terminal-dim space-y-1 text-sm">
                  <li>• j or ↓ - Move down</li>
                  <li>• k or ↑ - Move up</li>
                  <li>• Enter or Space - Select folder</li>
                  <li>• Escape - Close sidebar (mobile)</li>
                </ul>
              </div>

              <div className="terminal-border p-3">
                <h2 className="terminal-info font-bold mb-2">
                  RESPONSIVE FEATURES:
                </h2>
                <ul className="terminal-dim space-y-1 text-sm">
                  <li>• Auto-collapse on mobile devices</li>
                  <li>• Touch-friendly targets (44px minimum)</li>
                  <li>• Overlay background on mobile</li>
                  <li>• Keyboard shortcuts work on all devices</li>
                </ul>
              </div>

              <div className="terminal-border p-3">
                <h2 className="terminal-accent font-bold mb-2">
                  FOLDER INFORMATION:
                </h2>
                <div className="space-y-2">
                  {folders.map(folder => (
                    <div 
                      key={folder.id}
                      className={`terminal-flex items-center justify-between p-2 ${
                        folder.id === currentFolderId ? 'terminal-highlight' : ''
                      }`}
                    >
                      <span>
                        {folder.icon} {folder.name}
                      </span>
                      <span className="terminal-dim text-sm">
                        {folder.emailCount} total, {folder.unreadCount} unread
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}