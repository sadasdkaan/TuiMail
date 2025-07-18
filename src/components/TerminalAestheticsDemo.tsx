'use client'

import { useState, useEffect } from 'react'
import { asciiArt } from '@/lib/mock-data'
import TerminalAesthetics, { AsciiBox, TerminalNotification } from './TerminalAesthetics'

export default function TerminalAestheticsDemo() {
  const [showDemo, setShowDemo] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<string | null>(null)
  const [scanlineEffect, setScanlineEffect] = useState(false)
  const [crtEffect, setCrtEffect] = useState(false)

  // Demo notifications
  const notifications = [
    { type: 'success' as const, message: 'Email sent successfully!' },
    { type: 'error' as const, message: 'Failed to connect to server' },
    { type: 'warning' as const, message: 'Draft auto-saved' },
    { type: 'info' as const, message: 'New email received' }
  ]

  const [notificationIndex, setNotificationIndex] = useState(0)

  const showNextNotification = () => {
    const notification = notifications[notificationIndex]
    setCurrentNotification(`${notification.type}:${notification.message}`)
    setNotificationIndex((prev) => (prev + 1) % notifications.length)
  }

  return (
    <div className="terminal-aesthetics-demo-container p-4 space-y-6">
      {/* Demo Controls */}
      <div className="demo-controls terminal-border p-4">
        <h2 className="terminal-accent font-bold text-lg mb-4 terminal-glow">
          ╔═══ TERMINAL AESTHETICS DEMO ═══╗
        </h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className={`terminal-border px-4 py-2 ${showDemo ? 'terminal-success' : 'terminal-dim'} hover:terminal-accent transition-colors`}
          >
            {showDemo ? '▶ Hide Demo' : '▶ Show Demo'}
          </button>
          
          <button
            onClick={showNextNotification}
            className="terminal-border px-4 py-2 terminal-info hover:terminal-accent transition-colors"
          >
            ▶ Show Notification
          </button>
          
          <button
            onClick={() => setScanlineEffect(!scanlineEffect)}
            className={`terminal-border px-4 py-2 ${scanlineEffect ? 'terminal-success' : 'terminal-dim'} hover:terminal-accent transition-colors`}
          >
            {scanlineEffect ? '▶ Disable Scanlines' : '▶ Enable Scanlines'}
          </button>
          
          <button
            onClick={() => setCrtEffect(!crtEffect)}
            className={`terminal-border px-4 py-2 ${crtEffect ? 'terminal-success' : 'terminal-dim'} hover:terminal-accent transition-colors`}
          >
            {crtEffect ? '▶ Disable CRT Effect' : '▶ Enable CRT Effect'}
          </button>
        </div>

        <div className="terminal-dim text-sm font-mono">
          ▶ Toggle various terminal aesthetic features to see the enhancements
        </div>
      </div>

      {/* Notifications */}
      {currentNotification && (
        <TerminalNotification
          type={currentNotification.split(':')[0] as any}
          message={currentNotification.split(':')[1]}
          onClose={() => setCurrentNotification(null)}
          autoClose={true}
          duration={3000}
        />
      )}

      {/* Main Demo Container with Effects */}
      <div 
        className={`demo-main relative ${scanlineEffect ? 'terminal-scanlines' : ''} ${crtEffect ? 'terminal-crt' : ''}`}
      >
        {/* Welcome Banner */}
        <div className="terminal-border p-4 mb-6 bg-terminal-bg">
          <pre className="terminal-accent text-xs leading-tight terminal-glow overflow-x-auto">
            {asciiArt.welcomeBanner}
          </pre>
        </div>

        {/* Enhanced Terminal Features Demo */}
        <TerminalAesthetics showDemo={showDemo} />

        {/* ASCII Box Examples */}
        {showDemo && (
          <div className="ascii-boxes-demo space-y-4">
            <h3 className="terminal-accent font-bold text-lg mb-4">ASCII Box Components:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AsciiBox style="simple" title="Simple Box">
                <div className="terminal-fg text-sm">
                  This is a simple ASCII box<br/>
                  with clean borders and<br/>
                  terminal styling.
                </div>
              </AsciiBox>

              <AsciiBox style="double" title="Double Box">
                <div className="terminal-accent text-sm">
                  This is a double-line<br/>
                  ASCII box for important<br/>
                  content and headers.
                </div>
              </AsciiBox>

              <AsciiBox style="rounded" title="Rounded Box">
                <div className="terminal-success text-sm">
                  This is a rounded ASCII<br/>
                  box for softer visual<br/>
                  elements and content.
                </div>
              </AsciiBox>
            </div>
          </div>
        )}

        {/* Enhanced Typography Demo */}
        {showDemo && (
          <div className="typography-demo terminal-border p-4 mt-6">
            <h3 className="terminal-accent font-bold text-lg mb-4 terminal-glow">Enhanced Typography:</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="terminal-dim text-sm mb-2">Glowing Text:</h4>
                <p className="terminal-accent terminal-glow font-mono">
                  ▶ This text has a subtle glow effect for emphasis
                </p>
              </div>

              <div>
                <h4 className="terminal-dim text-sm mb-2">Typewriter Effect:</h4>
                <p className="terminal-success font-mono terminal-typewriter">
                  ▶ This text appears with a typewriter animation
                </p>
              </div>

              <div>
                <h4 className="terminal-dim text-sm mb-2">Status Messages:</h4>
                <div className="space-y-1 font-mono text-sm">
                  <p className="terminal-success">✓ Operation completed successfully</p>
                  <p className="terminal-error">✗ Connection failed - retrying...</p>
                  <p className="terminal-warning">! Warning: Low disk space</p>
                  <p className="terminal-info">→ Processing 15 of 20 items</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicators Demo */}
        {showDemo && (
          <div className="progress-demo terminal-border p-4 mt-6">
            <h3 className="terminal-accent font-bold text-lg mb-4">Progress Indicators:</h3>
            
            <div className="space-y-4 font-mono">
              <div>
                <div className="terminal-dim text-sm mb-1">Email Sync: 85%</div>
                <div className="flex text-lg">
                  <span className="terminal-success">
                    {asciiArt.progressBar.filled.repeat(17)}
                  </span>
                  <span className="terminal-dim">
                    {asciiArt.progressBar.empty.repeat(3)}
                  </span>
                </div>
              </div>

              <div>
                <div className="terminal-dim text-sm mb-1">Upload Progress: 60%</div>
                <div className="flex text-lg">
                  <span className="terminal-warning">
                    {asciiArt.progressBar.filled.repeat(12)}
                  </span>
                  <span className="terminal-dim">
                    {asciiArt.progressBar.empty.repeat(8)}
                  </span>
                </div>
              </div>

              <div>
                <div className="terminal-dim text-sm mb-1">Processing: 25%</div>
                <div className="flex text-lg">
                  <span className="terminal-info">
                    {asciiArt.progressBar.filled.repeat(5)}
                  </span>
                  <span className="terminal-dim">
                    {asciiArt.progressBar.empty.repeat(15)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Network Status Demo */}
        {showDemo && (
          <div className="network-status-demo terminal-border p-4 mt-6">
            <h3 className="terminal-accent font-bold text-lg mb-4">Network Status Indicators:</h3>
            
            <div className="space-y-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="terminal-success text-lg">●</span>
                <span className="terminal-success">{asciiArt.networkStatus.connected}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="terminal-error text-lg">●</span>
                <span className="terminal-error">{asciiArt.networkStatus.disconnected}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="terminal-warning text-lg">●</span>
                <span className="terminal-warning">{asciiArt.networkStatus.connecting}</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Borders Demo */}
        {showDemo && (
          <div className="borders-demo terminal-border p-4 mt-6">
            <h3 className="terminal-accent font-bold text-lg mb-4">Enhanced Border Styles:</h3>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="terminal-border p-3 bg-terminal-hover">
                <div className="terminal-accent font-bold mb-2">Standard Terminal Border</div>
                <div className="terminal-dim">Regular border with terminal styling</div>
              </div>

              <div className="border-2 border-terminal-accent p-3 bg-terminal-hover">
                <div className="terminal-accent font-bold mb-2">Accent Border</div>
                <div className="terminal-dim">Highlighted border for important content</div>
              </div>

              <div className="border-2 border-dashed border-terminal-dim p-3 bg-terminal-hover">
                <div className="terminal-dim font-bold mb-2">Dashed Border</div>
                <div className="terminal-dim">Subtle dashed border for secondary content</div>
              </div>
            </div>
          </div>
        )}

        {/* Cursor Variations Demo */}
        {showDemo && (
          <div className="cursor-demo terminal-border p-4 mt-6">
            <h3 className="terminal-accent font-bold text-lg mb-4">Cursor Variations:</h3>
            
            <div className="space-y-3 font-mono">
              <div className="flex items-center gap-4">
                <span className="w-32">Block Cursor:</span>
                <span>user@terminal</span>
                <span className="terminal-cursor terminal-glow"></span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="w-32">Line Cursor:</span>
                <span>user@terminal</span>
                <span className="terminal-cursor-line terminal-glow"></span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="w-32">Block Cursor:</span>
                <span>user@terminal</span>
                <span className="terminal-cursor-block terminal-glow"></span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="demo-footer terminal-border-t p-4 mt-6">
          <div className="text-center terminal-dim font-mono text-sm">
            <div className="mb-2">{asciiArt.thinSeparator.substring(0, 60)}</div>
            <div>Terminal Email Client - Enhanced Aesthetics Demo</div>
            <div className="mt-2">{asciiArt.thinSeparator.substring(0, 60)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}