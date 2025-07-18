'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// TypeScript interfaces for theme configuration
export interface ThemeConfig {
  id: string
  name: string
  description: string
  variant?: string
  category: 'light' | 'dark' | 'auto'
}

export interface ThemeContextType {
  currentTheme: string
  availableThemes: ThemeConfig[]
  setTheme: (themeId: string) => void
  isLoading: boolean
  error: string | null
}

// Available WebTUI themes with their configurations
const AVAILABLE_THEMES: ThemeConfig[] = [
  // Catppuccin variants
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    description: 'Light, warm theme with pastel colors',
    variant: 'latte',
    category: 'light'
  },
  {
    id: 'catppuccin-frappe',
    name: 'Catppuccin Frappé',
    description: 'Medium contrast theme with cool tones',
    variant: 'frappe',
    category: 'dark'
  },
  {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    description: 'Dark theme with warm undertones',
    variant: 'macchiato',
    category: 'dark'
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    description: 'Darkest variant with high contrast',
    variant: 'mocha',
    category: 'dark'
  },
  // Everforest variants
  {
    id: 'everforest-light-soft',
    name: 'Everforest Light Soft',
    description: 'Soft light theme inspired by nature',
    variant: 'light-soft',
    category: 'light'
  },
  {
    id: 'everforest-light-medium',
    name: 'Everforest Light Medium',
    description: 'Medium contrast light theme',
    variant: 'light-medium',
    category: 'light'
  },
  {
    id: 'everforest-light-hard',
    name: 'Everforest Light Hard',
    description: 'High contrast light theme',
    variant: 'light-hard',
    category: 'light'
  },
  {
    id: 'everforest-dark-soft',
    name: 'Everforest Dark Soft',
    description: 'Soft dark theme with natural colors',
    variant: 'dark-soft',
    category: 'dark'
  },
  {
    id: 'everforest-dark-medium',
    name: 'Everforest Dark Medium',
    description: 'Medium contrast dark theme',
    variant: 'dark-medium',
    category: 'dark'
  },
  {
    id: 'everforest-dark-hard',
    name: 'Everforest Dark Hard',
    description: 'High contrast dark theme',
    variant: 'dark-hard',
    category: 'dark'
  },
  // Gruvbox variants
  {
    id: 'gruvbox-light-soft',
    name: 'Gruvbox Light Soft',
    description: 'Retro groove light theme',
    variant: 'light-soft',
    category: 'light'
  },
  {
    id: 'gruvbox-light-medium',
    name: 'Gruvbox Light Medium',
    description: 'Medium contrast retro light theme',
    variant: 'light-medium',
    category: 'light'
  },
  {
    id: 'gruvbox-light-hard',
    name: 'Gruvbox Light Hard',
    description: 'High contrast retro light theme',
    variant: 'light-hard',
    category: 'light'
  },
  {
    id: 'gruvbox-dark-soft',
    name: 'Gruvbox Dark Soft',
    description: 'Retro groove dark theme',
    variant: 'dark-soft',
    category: 'dark'
  },
  {
    id: 'gruvbox-dark-medium',
    name: 'Gruvbox Dark Medium',
    description: 'Medium contrast retro dark theme',
    variant: 'dark-medium',
    category: 'dark'
  },
  {
    id: 'gruvbox-dark-hard',
    name: 'Gruvbox Dark Hard',
    description: 'High contrast retro dark theme',
    variant: 'dark-hard',
    category: 'dark'
  },
  // Nord theme
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic, north-bluish color palette',
    category: 'dark'
  },
  // Vitesse variants
  {
    id: 'vitesse-light',
    name: 'Vitesse Light',
    description: 'Clean and minimal light theme',
    variant: 'light',
    category: 'light'
  },
  {
    id: 'vitesse-dark',
    name: 'Vitesse Dark',
    description: 'Clean and minimal dark theme',
    variant: 'dark',
    category: 'dark'
  }
]

// Default theme - fallback to a reliable dark theme
const DEFAULT_THEME = 'catppuccin-mocha'
const THEME_STORAGE_KEY = 'terminal-email-theme'

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme provider component
export interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: string
}

export function ThemeProvider({ children, defaultTheme = DEFAULT_THEME }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme && AVAILABLE_THEMES.some(theme => theme.id === savedTheme)) {
        setCurrentTheme(savedTheme)
      }
    } catch (err) {
      console.warn('Failed to load theme from localStorage:', err)
      setError('Failed to load saved theme preferences')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Apply theme to HTML element and handle theme changes
  useEffect(() => {
    const applyTheme = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get the HTML element
        const htmlElement = document.documentElement

        if (!htmlElement) {
          throw new Error('HTML element not found')
        }

        // Remove any existing theme attributes
        const existingThemeAttr = htmlElement.getAttribute('data-webtui-theme')
        if (existingThemeAttr) {
          htmlElement.removeAttribute('data-webtui-theme')
        }

        // Remove existing theme classes
        htmlElement.classList.remove('theme-light', 'theme-dark')

        // Find the theme configuration
        const themeConfig = AVAILABLE_THEMES.find(theme => theme.id === currentTheme)
        if (!themeConfig) {
          throw new Error(`Theme configuration not found for: ${currentTheme}`)
        }

        // Set the WebTUI theme attribute
        htmlElement.setAttribute('data-webtui-theme', currentTheme)

        // Add theme category class for adaptive styling
        htmlElement.classList.add(`theme-${themeConfig.category}`)

        // Update CSS custom properties for fallback compatibility
        const rootStyle = htmlElement.style

        // Ensure WebTUI variables have fallbacks to terminal variables
        if (themeConfig.category === 'light') {
          rootStyle.setProperty('--foreground0', 'var(--foreground0, var(--terminal-fg, #1a1a1a))')
          rootStyle.setProperty('--background0', 'var(--background0, var(--terminal-bg, #ffffff))')
          rootStyle.setProperty('--background1', 'var(--background1, var(--terminal-hover, #f0f0f0))')
          rootStyle.setProperty('--background2', 'var(--background2, var(--terminal-border, #e0e0e0))')
        } else {
          rootStyle.setProperty('--foreground0', 'var(--foreground0, var(--terminal-fg, #e0e0e0))')
          rootStyle.setProperty('--background0', 'var(--background0, var(--terminal-bg, #000000))')
          rootStyle.setProperty('--background1', 'var(--background1, var(--terminal-hover, #111111))')
          rootStyle.setProperty('--background2', 'var(--background2, var(--terminal-border, #333333))')
        }

        // Save theme to localStorage
        try {
          localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
        } catch (storageErr) {
          console.warn('Failed to save theme to localStorage:', storageErr)
        }

        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themeChanged', {
          detail: { theme: currentTheme, config: themeConfig }
        }))

      } catch (err) {
        console.error('Failed to apply theme:', err)
        setError(err instanceof Error ? err.message : 'Failed to apply theme')
        
        // Fallback to default theme if current theme fails
        if (currentTheme !== DEFAULT_THEME) {
          console.warn(`Falling back to default theme: ${DEFAULT_THEME}`)
          setCurrentTheme(DEFAULT_THEME)
          return
        }
        
        // If even default theme fails, ensure basic styling
        const htmlElement = document.documentElement
        if (htmlElement) {
          htmlElement.setAttribute('data-webtui-theme', DEFAULT_THEME)
          htmlElement.classList.add('theme-dark')
        }
      } finally {
        setIsLoading(false)
      }
    }

    applyTheme()
  }, [currentTheme])

  // Theme switching function
  const setTheme = (themeId: string) => {
    if (!AVAILABLE_THEMES.some(theme => theme.id === themeId)) {
      console.error(`Invalid theme ID: ${themeId}`)
      setError(`Invalid theme: ${themeId}`)
      return
    }

    setCurrentTheme(themeId)
  }

  // Context value
  const contextValue: ThemeContextType = {
    currentTheme,
    availableThemes: AVAILABLE_THEMES,
    setTheme,
    isLoading,
    error
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility functions for theme management
export const themeUtils = {
  // Get theme by ID
  getTheme: (themeId: string): ThemeConfig | undefined => {
    return AVAILABLE_THEMES.find(theme => theme.id === themeId)
  },

  // Get themes by category
  getThemesByCategory: (category: 'light' | 'dark'): ThemeConfig[] => {
    return AVAILABLE_THEMES.filter(theme => theme.category === category)
  },

  // Get theme family (e.g., all catppuccin variants)
  getThemeFamily: (familyName: string): ThemeConfig[] => {
    return AVAILABLE_THEMES.filter(theme => theme.id.startsWith(familyName))
  },

  // Validate theme ID
  isValidTheme: (themeId: string): boolean => {
    return AVAILABLE_THEMES.some(theme => theme.id === themeId)
  },

  // Get system preference
  getSystemPreference: (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark' // Default to dark for terminal aesthetic
  },

  // Get recommended theme based on system preference
  getRecommendedTheme: (): string => {
    const systemPreference = themeUtils.getSystemPreference()
    return systemPreference === 'light' ? 'catppuccin-latte' : 'catppuccin-mocha'
  }
}

// Export types and constants
export type { ThemeConfig, ThemeContextType }
export { AVAILABLE_THEMES, DEFAULT_THEME }