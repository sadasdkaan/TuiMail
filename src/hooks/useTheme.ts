'use client'

import { useContext } from 'react'

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

interface UseThemeReturn extends ThemeContextType {
  // Additional utility functions
  getCurrentThemeConfig: () => ThemeConfig | undefined
  getThemesByCategory: (category: 'light' | 'dark') => ThemeConfig[]
  getThemeFamily: (familyName: string) => ThemeConfig[]
  isValidTheme: (themeId: string) => boolean
  resetTheme: () => void
  toggleThemeCategory: () => void
  getSystemPreference: () => 'light' | 'dark'
  getRecommendedTheme: () => string
  clearError: () => void
}

// Available WebTUI themes with their configurations
export const AVAILABLE_THEMES: ThemeConfig[] = [
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
export const DEFAULT_THEME = 'catppuccin-mocha'
export const THEME_STORAGE_KEY = 'terminal-email-theme'

// Create a mock context for when ThemeProvider is not available
const createMockContext = (): ThemeContextType => ({
  currentTheme: DEFAULT_THEME,
  availableThemes: AVAILABLE_THEMES,
  setTheme: () => console.warn('ThemeProvider not found. Please wrap your app with ThemeProvider.'),
  isLoading: false,
  error: 'ThemeProvider not found'
})

// Import ThemeContext dynamically to avoid circular dependencies
let ThemeContext: React.Context<ThemeContextType | undefined> | null = null

try {
  // Try to import ThemeContext from ThemeProvider
  const themeProviderModule = require('../components/ThemeProvider')
  ThemeContext = themeProviderModule.ThemeContext
} catch (error) {
  console.warn('ThemeProvider not available, using mock context')
}

/**
 * Custom hook for theme management
 * Provides a clean API for components to interact with the theme system
 */
export function useTheme(): UseThemeReturn {
  let context: ThemeContextType | undefined

  try {
    if (ThemeContext) {
      context = useContext(ThemeContext)
    }
  } catch (error) {
    console.warn('Failed to use ThemeContext:', error)
  }

  // Fallback to mock context if ThemeProvider is not available
  if (!context) {
    context = createMockContext()
  }

  const {
    currentTheme,
    availableThemes,
    setTheme: contextSetTheme,
    isLoading,
    error
  } = context

  /**
   * Get the current theme configuration
   */
  const getCurrentThemeConfig = (): ThemeConfig | undefined => {
    return availableThemes.find(theme => theme.id === currentTheme)
  }

  /**
   * Get themes by category (light/dark)
   */
  const getThemesByCategory = (category: 'light' | 'dark'): ThemeConfig[] => {
    return availableThemes.filter(theme => theme.category === category)
  }

  /**
   * Get theme family (e.g., all catppuccin variants)
   */
  const getThemeFamily = (familyName: string): ThemeConfig[] => {
    return availableThemes.filter(theme => theme.id.startsWith(familyName))
  }

  /**
   * Validate theme ID
   */
  const isValidTheme = (themeId: string): boolean => {
    return availableThemes.some(theme => theme.id === themeId)
  }

  /**
   * Enhanced theme setter with validation
   */
  const setTheme = (themeId: string): void => {
    if (!isValidTheme(themeId)) {
      console.error(`Invalid theme ID: ${themeId}`)
      return
    }
    contextSetTheme(themeId)
  }

  /**
   * Reset theme to default
   */
  const resetTheme = (): void => {
    setTheme(DEFAULT_THEME)
  }

  /**
   * Toggle between light and dark theme categories
   */
  const toggleThemeCategory = (): void => {
    const currentConfig = getCurrentThemeConfig()
    if (!currentConfig) return

    const targetCategory = currentConfig.category === 'light' ? 'dark' : 'light'
    const themesInCategory = getThemesByCategory(targetCategory)
    
    if (themesInCategory.length > 0) {
      // Try to find a similar theme in the opposite category
      const currentFamily = currentConfig.id.split('-')[0]
      const similarTheme = themesInCategory.find(theme => 
        theme.id.startsWith(currentFamily)
      )
      
      setTheme(similarTheme?.id || themesInCategory[0].id)
    }
  }

  /**
   * Get system color scheme preference
   */
  const getSystemPreference = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark' // Default to dark for terminal aesthetic
  }

  /**
   * Get recommended theme based on system preference
   */
  const getRecommendedTheme = (): string => {
    const systemPreference = getSystemPreference()
    return systemPreference === 'light' ? 'catppuccin-latte' : 'catppuccin-mocha'
  }

  /**
   * Clear any theme-related errors
   */
  const clearError = (): void => {
    // This would typically call a context method to clear errors
    // For now, we'll just log that the error should be cleared
    if (error) {
      console.log('Clearing theme error:', error)
    }
  }

  return {
    // Core theme state
    currentTheme,
    availableThemes,
    setTheme,
    isLoading,
    error,
    
    // Utility functions
    getCurrentThemeConfig,
    getThemesByCategory,
    getThemeFamily,
    isValidTheme,
    resetTheme,
    toggleThemeCategory,
    getSystemPreference,
    getRecommendedTheme,
    clearError
  }
}

/**
 * Theme utility functions that don't require React context
 */
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
  },

  // Load theme from localStorage
  loadThemeFromStorage: (): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(THEME_STORAGE_KEY)
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
    return null
  },

  // Save theme to localStorage
  saveThemeToStorage: (themeId: string): boolean => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, themeId)
        return true
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
    return false
  },

  // Clear theme from localStorage
  clearThemeFromStorage: (): boolean => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(THEME_STORAGE_KEY)
        return true
      }
    } catch (error) {
      console.warn('Failed to clear theme from localStorage:', error)
    }
    return false
  },

  // Get theme metadata
  getThemeMetadata: (themeId: string) => {
    const theme = themeUtils.getTheme(themeId)
    if (!theme) return null

    return {
      ...theme,
      family: theme.id.split('-')[0],
      isLight: theme.category === 'light',
      isDark: theme.category === 'dark',
      hasVariant: Boolean(theme.variant)
    }
  },

  // Get all theme families
  getThemeFamilies: (): string[] => {
    const families = new Set<string>()
    AVAILABLE_THEMES.forEach(theme => {
      families.add(theme.id.split('-')[0])
    })
    return Array.from(families)
  },

  // Validate and sanitize theme ID
  sanitizeThemeId: (themeId: string): string => {
    if (themeUtils.isValidTheme(themeId)) {
      return themeId
    }
    return DEFAULT_THEME
  }
}

// Export types
export type { UseThemeReturn }