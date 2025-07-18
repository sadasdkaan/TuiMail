'use client'

import React from 'react'
import { useResponsive, useResponsiveLayout, useTouchFriendly, useSidebarCollapse } from '@/hooks/useResponsive'

export default function ResponsiveDemo() {
  const responsive = useResponsive()
  const layout = useResponsiveLayout()
  const touch = useTouchFriendly()
  const sidebar = useSidebarCollapse()

  return (
    <div className="terminal-container">
      <div className="terminal-border p-4 mb-4">
        <h2 className="terminal-accent font-bold text-lg mb-4">
          ┌─ RESPONSIVE DESIGN DEMO ─┐
        </h2>
        
        {/* Screen Size Information */}
        <div className="mb-6">
          <h3 className="terminal-info font-bold mb-2">Screen Information:</h3>
          <div className="terminal-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Screen Size:</div>
              <div className="font-mono">
                {responsive.screenSize.width} × {responsive.screenSize.height}
              </div>
            </div>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Current Breakpoint:</div>
              <div className="font-mono terminal-accent">
                {responsive.currentBreakpoint.toUpperCase()}
              </div>
            </div>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Device Type:</div>
              <div className="font-mono">
                {responsive.isMobile && '📱 Mobile'}
                {responsive.isTablet && '📱 Tablet'}
                {responsive.isDesktop && '💻 Desktop'}
                {responsive.isWide && '🖥️ Wide Screen'}
              </div>
            </div>
          </div>
        </div>

        {/* Touch Information */}
        <div className="mb-6">
          <h3 className="terminal-info font-bold mb-2">Touch Support:</h3>
          <div className="terminal-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Touch Device:</div>
              <div className="font-mono">
                {touch.isTouchDevice ? '✅ Yes' : '❌ No'}
              </div>
            </div>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Min Touch Target:</div>
              <div className="font-mono">
                {touch.minTouchTarget}px
              </div>
            </div>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Touch Spacing:</div>
              <div className="font-mono">
                {touch.touchSpacing}
              </div>
            </div>
          </div>
        </div>

        {/* Layout Information */}
        <div className="mb-6">
          <h3 className="terminal-info font-bold mb-2">Layout Behavior:</h3>
          <div className="terminal-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Mobile Layout:</div>
              <div className="font-mono">
                {layout.shouldUseMobileLayout ? '✅ Active' : '❌ Inactive'}
              </div>
            </div>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Sidebar Collapsed:</div>
              <div className="font-mono">
                {sidebar.isCollapsed ? '✅ Yes' : '❌ No'}
              </div>
            </div>
            <div className="terminal-border p-2">
              <div className="text-sm terminal-dim">Responsive Padding:</div>
              <div className="font-mono">
                {layout.getResponsivePadding(16)}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements Demo */}
        <div className="mb-6">
          <h3 className="terminal-info font-bold mb-2">Touch-Friendly Elements:</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              className="terminal-success hover:bg-terminal-success hover:text-terminal-bg"
              style={{
                minHeight: `${touch.minTouchTarget}px`,
                padding: touch.touchSpacing,
                transitionDuration: layout.getResponsiveTransition()
              }}
            >
              ▶ Touch Button
            </button>
            
            <button
              onClick={sidebar.toggleCollapse}
              className="terminal-warning hover:bg-terminal-warning hover:text-terminal-bg"
              style={{
                minHeight: `${touch.minTouchTarget}px`,
                padding: touch.touchSpacing,
                transitionDuration: layout.getResponsiveTransition()
              }}
            >
              {sidebar.isCollapsed ? '▶ Expand' : '▼ Collapse'} Sidebar
            </button>
          </div>
        </div>

        {/* Responsive Visibility Demo */}
        <div className="mb-6">
          <h3 className="terminal-info font-bold mb-2">Responsive Visibility:</h3>
          <div className="space-y-2">
            <div className="terminal-hide-mobile terminal-border p-2">
              <span className="terminal-dim">Hidden on Mobile:</span> This content is only visible on tablet and desktop
            </div>
            <div className="terminal-show-mobile terminal-border p-2">
              <span className="terminal-dim">Mobile Only:</span> This content is only visible on mobile devices
            </div>
            <div className="terminal-hide-tablet terminal-border p-2">
              <span className="terminal-dim">Hidden on Tablet:</span> This content is hidden on tablet-sized screens
            </div>
          </div>
        </div>

        {/* Breakpoint Utilities Demo */}
        <div className="mb-6">
          <h3 className="terminal-info font-bold mb-2">Breakpoint Utilities:</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="terminal-dim">At least tablet:</span> 
              <span className="font-mono ml-2">
                {responsive.isAtLeast('tablet') ? '✅' : '❌'}
              </span>
            </div>
            <div>
              <span className="terminal-dim">At most desktop:</span> 
              <span className="font-mono ml-2">
                {responsive.isAtMost('desktop') ? '✅' : '❌'}
              </span>
            </div>
            <div>
              <span className="terminal-dim">Between tablet and wide:</span> 
              <span className="font-mono ml-2">
                {responsive.isBetween('tablet', 'wide') ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="terminal-border-t pt-4">
          <div className="text-sm terminal-dim">
            <div className="font-bold mb-2">Instructions:</div>
            <div>• Resize your browser window to see responsive behavior</div>
            <div>• Try the demo on different devices (mobile, tablet, desktop)</div>
            <div>• Toggle the sidebar to see collapsible behavior</div>
            <div>• Notice how touch targets adjust for touch devices</div>
          </div>
        </div>
      </div>
    </div>
  )
}