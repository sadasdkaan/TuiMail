'use client'

import React, { useState } from 'react'
import { useTheme } from './ThemeProvider'

interface ThemeSelectorProps {
  className?: string
  compact?: boolean
}

export function ThemeSelector({ className = '', compact = false }: ThemeSelectorProps) {
  const { currentTheme, availableThemes, setTheme, isLoading, error } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentThemeObj = availableThemes.find(t => t.id === currentTheme)
  
  // Group themes by their base family name
  const groupedThemes = availableThemes.reduce((acc, theme) => {
    const family = theme.id.split('-')[0]
    const familyName = family.charAt(0).toUpperCase() + family.slice(1)
    
    if (!acc[familyName]) {
      acc[familyName] = []
    }
    acc[familyName].push(theme)
    return acc
  }, {} as Record<string, typeof availableThemes>)

  if (compact) {
    return (
      <div className={`theme-selector-compact ${className}`}>
        <select
          value={currentTheme}
          onChange={(e) => setTheme(e.target.value)}
          className="text-sm bg-terminal-bg border terminal-border p-1 terminal-fg"
          title="Select Theme"
          disabled={isLoading}
        >
          {Object.entries(groupedThemes).map(([family, familyThemes]) => (
            <optgroup key={family} label={family}>
              {familyThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {error && (
          <div className="text-xs terminal-error mt-1" title={error}>
            ⚠ Theme Error
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`theme-selector relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 terminal-border bg-terminal-bg hover:bg-terminal-hover transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        disabled={isLoading}
      >
        <span className="terminal-accent">🎨</span>
        <span className="text-sm">
          {isLoading ? 'Loading...' : (currentThemeObj?.name || 'Select Theme')}
        </span>
        <span className={`terminal-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-terminal-error text-terminal-bg text-xs rounded z-50">
          {error}
        </div>
      )}

      {isOpen && !isLoading && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-80 bg-terminal-bg terminal-border shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2 terminal-border-b">
              <h3 className="font-bold terminal-accent text-sm">Select Theme</h3>
              <p className="text-xs terminal-dim mt-1">
                Choose from {availableThemes.length} available themes
              </p>
            </div>
            
            {Object.entries(groupedThemes).map(([family, familyThemes]) => (
              <div key={family} className="p-2">
                <h4 className="text-xs terminal-dim font-bold mb-2 uppercase tracking-wide flex items-center gap-2">
                  <span>{family}</span>
                  <span className="terminal-border-b flex-1 h-px"></span>
                </h4>
                <div className="space-y-1">
                  {familyThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id)
                        setIsOpen(false)
                      }}
                      className={`w-full text-left p-2 text-sm transition-colors rounded-none ${
                        currentTheme === theme.id
                          ? 'bg-terminal-selection terminal-accent'
                          : 'hover:bg-terminal-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-xs terminal-dim">{theme.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1 ${
                            theme.category === 'light' 
                              ? 'terminal-warning' 
                              : 'terminal-info'
                          }`}>
                            {theme.category}
                          </span>
                          {currentTheme === theme.id && (
                            <span className="terminal-success">●</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="p-2 terminal-border-t">
              <div className="text-xs terminal-dim">
                <p>• Themes are applied instantly</p>
                <p>• Your selection is saved automatically</p>
                <p>• Some themes may require a page refresh</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSelector