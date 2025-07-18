/**
 * Theme management utilities for WebTUI themes
 * Provides comprehensive theme handling, validation, and persistence
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  variants: ThemeVariant[];
  defaultVariant: string;
  category: 'light' | 'dark' | 'auto';
  author?: string;
  homepage?: string;
}

export interface ThemeVariant {
  id: string;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  contrast?: 'soft' | 'medium' | 'hard';
  dataAttribute: string;
}

export interface ThemeMetadata {
  themes: ThemeConfig[];
  defaultTheme: string;
  systemThemeSupport: boolean;
}

export interface ThemePreferences {
  selectedTheme: string;
  selectedVariant?: string;
  followSystemTheme: boolean;
  lastUpdated: number;
}

export interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export type ThemeChangeCallback = (theme: string, variant?: string) => void;

// ============================================================================
// Constants
// ============================================================================

export const WEBTUI_THEMES: ThemeConfig[] = [
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    description: 'A soothing pastel theme for the high-spirited!',
    defaultVariant: 'catppuccin-mocha',
    category: 'dark',
    author: 'Catppuccin',
    homepage: 'https://catppuccin.com/',
    variants: [
      {
        id: 'catppuccin-latte',
        name: 'Latte',
        description: 'Light variant with warm tones',
        mode: 'light',
        dataAttribute: 'catppuccin-latte'
      },
      {
        id: 'catppuccin-frappe',
        name: 'Frappé',
        description: 'Medium dark variant',
        mode: 'dark',
        dataAttribute: 'catppuccin-frappe'
      },
      {
        id: 'catppuccin-macchiato',
        name: 'Macchiato',
        description: 'Dark variant with rich colors',
        mode: 'dark',
        dataAttribute: 'catppuccin-macchiato'
      },
      {
        id: 'catppuccin-mocha',
        name: 'Mocha',
        description: 'Darkest variant with deep tones',
        mode: 'dark',
        dataAttribute: 'catppuccin-mocha'
      }
    ]
  },
  {
    id: 'everforest',
    name: 'Everforest',
    description: 'A green based color scheme designed to be warm and soft',
    defaultVariant: 'everforest-dark-medium',
    category: 'dark',
    author: 'sainnhe',
    homepage: 'https://github.com/sainnhe/everforest',
    variants: [
      {
        id: 'everforest-light-hard',
        name: 'Light Hard',
        description: 'Light variant with high contrast',
        mode: 'light',
        contrast: 'hard',
        dataAttribute: 'everforest-light-hard'
      },
      {
        id: 'everforest-light-medium',
        name: 'Light Medium',
        description: 'Light variant with medium contrast',
        mode: 'light',
        contrast: 'medium',
        dataAttribute: 'everforest-light-medium'
      },
      {
        id: 'everforest-light-soft',
        name: 'Light Soft',
        description: 'Light variant with low contrast',
        mode: 'light',
        contrast: 'soft',
        dataAttribute: 'everforest-light-soft'
      },
      {
        id: 'everforest-dark-hard',
        name: 'Dark Hard',
        description: 'Dark variant with high contrast',
        mode: 'dark',
        contrast: 'hard',
        dataAttribute: 'everforest-dark-hard'
      },
      {
        id: 'everforest-dark-medium',
        name: 'Dark Medium',
        description: 'Dark variant with medium contrast',
        mode: 'dark',
        contrast: 'medium',
        dataAttribute: 'everforest-dark-medium'
      },
      {
        id: 'everforest-dark-soft',
        name: 'Dark Soft',
        description: 'Dark variant with low contrast',
        mode: 'dark',
        contrast: 'soft',
        dataAttribute: 'everforest-dark-soft'
      }
    ]
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    description: 'Retro groove color scheme with warm, earthy tones',
    defaultVariant: 'gruvbox-dark-medium',
    category: 'dark',
    author: 'morhetz',
    homepage: 'https://github.com/morhetz/gruvbox',
    variants: [
      {
        id: 'gruvbox-light-hard',
        name: 'Light Hard',
        description: 'Light variant with high contrast',
        mode: 'light',
        contrast: 'hard',
        dataAttribute: 'gruvbox-light-hard'
      },
      {
        id: 'gruvbox-light-medium',
        name: 'Light Medium',
        description: 'Light variant with medium contrast',
        mode: 'light',
        contrast: 'medium',
        dataAttribute: 'gruvbox-light-medium'
      },
      {
        id: 'gruvbox-light-soft',
        name: 'Light Soft',
        description: 'Light variant with low contrast',
        mode: 'light',
        contrast: 'soft',
        dataAttribute: 'gruvbox-light-soft'
      },
      {
        id: 'gruvbox-dark-hard',
        name: 'Dark Hard',
        description: 'Dark variant with high contrast',
        mode: 'dark',
        contrast: 'hard',
        dataAttribute: 'gruvbox-dark-hard'
      },
      {
        id: 'gruvbox-dark-medium',
        name: 'Dark Medium',
        description: 'Dark variant with medium contrast',
        mode: 'dark',
        contrast: 'medium',
        dataAttribute: 'gruvbox-dark-medium'
      },
      {
        id: 'gruvbox-dark-soft',
        name: 'Dark Soft',
        description: 'Dark variant with low contrast',
        mode: 'dark',
        contrast: 'soft',
        dataAttribute: 'gruvbox-dark-soft'
      }
    ]
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'An arctic, north-bluish color palette',
    defaultVariant: 'nord',
    category: 'dark',
    author: 'arcticicestudio',
    homepage: 'https://www.nordtheme.com/',
    variants: [
      {
        id: 'nord',
        name: 'Nord',
        description: 'Classic Nord theme with cool blue tones',
        mode: 'dark',
        dataAttribute: 'nord'
      },
      {
        id: 'nord-light',
        name: 'Nord Light',
        description: 'Light variant of the Nord theme',
        mode: 'light',
        dataAttribute: 'nord-light'
      }
    ]
  },
  {
    id: 'vitesse',
    name: 'Vitesse',
    description: 'A minimal, elegant theme with clean aesthetics',
    defaultVariant: 'vitesse-dark',
    category: 'dark',
    author: 'antfu',
    homepage: 'https://github.com/antfu/vscode-theme-vitesse',
    variants: [
      {
        id: 'vitesse-black',
        name: 'Black',
        description: 'Pure black variant for OLED displays',
        mode: 'dark',
        dataAttribute: 'vitesse-black'
      },
      {
        id: 'vitesse-dark',
        name: 'Dark',
        description: 'Standard dark variant',
        mode: 'dark',
        dataAttribute: 'vitesse-dark'
      },
      {
        id: 'vitesse-dark-soft',
        name: 'Dark Soft',
        description: 'Dark variant with reduced contrast',
        mode: 'dark',
        contrast: 'soft',
        dataAttribute: 'vitesse-dark-soft'
      },
      {
        id: 'vitesse-light',
        name: 'Light',
        description: 'Clean light variant',
        mode: 'light',
        dataAttribute: 'vitesse-light'
      },
      {
        id: 'vitesse-light-soft',
        name: 'Light Soft',
        description: 'Light variant with reduced contrast',
        mode: 'light',
        contrast: 'soft',
        dataAttribute: 'vitesse-light-soft'
      }
    ]
  }
];

export const DEFAULT_THEME = 'catppuccin-mocha';
export const FALLBACK_THEME = 'catppuccin-mocha';
export const THEME_STORAGE_KEY = 'webtui-theme-preferences';
export const THEME_ATTRIBUTE = 'data-webtui-theme';

// ============================================================================
// Theme Validation
// ============================================================================

export function validateTheme(themeId: string): ThemeValidationResult {
  const result: ThemeValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!themeId || typeof themeId !== 'string') {
    result.isValid = false;
    result.errors.push('Theme ID must be a non-empty string');
    return result;
  }

  const theme = findThemeById(themeId);
  if (!theme) {
    result.isValid = false;
    result.errors.push(`Theme "${themeId}" not found`);
    return result;
  }

  const variant = findVariantById(themeId);
  if (!variant) {
    result.isValid = false;
    result.errors.push(`Theme variant "${themeId}" not found`);
    return result;
  }

  return result;
}

export function validateThemeConfig(config: Partial<ThemeConfig>): ThemeValidationResult {
  const result: ThemeValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!config.id) {
    result.isValid = false;
    result.errors.push('Theme config must have an ID');
  }

  if (!config.name) {
    result.isValid = false;
    result.errors.push('Theme config must have a name');
  }

  if (!config.variants || config.variants.length === 0) {
    result.isValid = false;
    result.errors.push('Theme config must have at least one variant');
  }

  if (config.variants) {
    config.variants.forEach((variant, index) => {
      if (!variant.id) {
        result.errors.push(`Variant at index ${index} must have an ID`);
        result.isValid = false;
      }
      if (!variant.dataAttribute) {
        result.errors.push(`Variant "${variant.id}" must have a dataAttribute`);
        result.isValid = false;
      }
    });
  }

  return result;
}

// ============================================================================
// Theme Discovery and Lookup
// ============================================================================

export function findThemeById(themeId: string): ThemeConfig | null {
  // First try to find by variant ID
  for (const theme of WEBTUI_THEMES) {
    const variant = theme.variants.find(v => v.id === themeId);
    if (variant) {
      return theme;
    }
  }

  // Then try to find by theme ID
  return WEBTUI_THEMES.find(theme => theme.id === themeId) || null;
}

export function findVariantById(variantId: string): ThemeVariant | null {
  for (const theme of WEBTUI_THEMES) {
    const variant = theme.variants.find(v => v.id === variantId);
    if (variant) {
      return variant;
    }
  }
  return null;
}

export function getThemeVariants(themeId: string): ThemeVariant[] {
  const theme = WEBTUI_THEMES.find(t => t.id === themeId);
  return theme ? theme.variants : [];
}

export function getAllThemes(): ThemeConfig[] {
  return [...WEBTUI_THEMES];
}

export function getAllVariants(): ThemeVariant[] {
  return WEBTUI_THEMES.flatMap(theme => theme.variants);
}

export function getThemesByMode(mode: 'light' | 'dark'): ThemeVariant[] {
  return getAllVariants().filter(variant => variant.mode === mode);
}

export function getThemesByContrast(contrast: 'soft' | 'medium' | 'hard'): ThemeVariant[] {
  return getAllVariants().filter(variant => variant.contrast === contrast);
}

// ============================================================================
// Theme Metadata and Information
// ============================================================================

export function getThemeMetadata(): ThemeMetadata {
  return {
    themes: getAllThemes(),
    defaultTheme: DEFAULT_THEME,
    systemThemeSupport: true
  };
}

export function getThemeInfo(themeId: string): { theme: ThemeConfig; variant: ThemeVariant } | null {
  const variant = findVariantById(themeId);
  const theme = findThemeById(themeId);
  
  if (theme && variant) {
    return { theme, variant };
  }
  
  return null;
}

export function getThemeDisplayName(themeId: string): string {
  const info = getThemeInfo(themeId);
  if (info) {
    return `${info.theme.name} ${info.variant.name}`;
  }
  return themeId;
}

export function getThemeDescription(themeId: string): string {
  const info = getThemeInfo(themeId);
  if (info) {
    return info.variant.description || info.theme.description;
  }
  return '';
}

// ============================================================================
// System Theme Detection
// ============================================================================

export function detectSystemTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return null;
}

export function getSystemThemeVariant(themeId?: string): string {
  const systemMode = detectSystemTheme();
  const baseTheme = themeId ? findThemeById(themeId) : null;
  
  if (baseTheme && systemMode) {
    const variant = baseTheme.variants.find(v => v.mode === systemMode);
    if (variant) {
      return variant.id;
    }
  }

  // Fallback to default themes based on system preference
  if (systemMode === 'light') {
    return 'catppuccin-latte';
  }
  
  return DEFAULT_THEME;
}

export function createSystemThemeListener(callback: (mode: 'light' | 'dark') => void): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);
  
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}

// ============================================================================
// Theme Persistence
// ============================================================================

export function saveThemePreferences(preferences: ThemePreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serialized = JSON.stringify({
      ...preferences,
      lastUpdated: Date.now()
    });
    localStorage.setItem(THEME_STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to save theme preferences:', error);
  }
}

export function loadThemePreferences(): ThemePreferences | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as ThemePreferences;
    
    // Validate the loaded preferences
    if (parsed.selectedTheme && validateTheme(parsed.selectedTheme).isValid) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to load theme preferences:', error);
  }

  return null;
}

export function clearThemePreferences(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear theme preferences:', error);
  }
}

export function getDefaultPreferences(): ThemePreferences {
  return {
    selectedTheme: DEFAULT_THEME,
    followSystemTheme: false,
    lastUpdated: Date.now()
  };
}

// ============================================================================
// Theme Application
// ============================================================================

export function applyTheme(themeId: string, element?: HTMLElement): boolean {
  const target = element || (typeof document !== 'undefined' ? document.documentElement : null);
  
  if (!target) {
    return false;
  }

  const validation = validateTheme(themeId);
  if (!validation.isValid) {
    console.warn('Invalid theme:', validation.errors);
    return false;
  }

  const variant = findVariantById(themeId);
  if (!variant) {
    return false;
  }

  try {
    target.setAttribute(THEME_ATTRIBUTE, variant.dataAttribute);
    return true;
  } catch (error) {
    console.error('Failed to apply theme:', error);
    return false;
  }
}

export function removeTheme(element?: HTMLElement): void {
  const target = element || (typeof document !== 'undefined' ? document.documentElement : null);
  
  if (target) {
    target.removeAttribute(THEME_ATTRIBUTE);
  }
}

export function getCurrentTheme(element?: HTMLElement): string | null {
  const target = element || (typeof document !== 'undefined' ? document.documentElement : null);
  
  if (!target) {
    return null;
  }

  const dataAttribute = target.getAttribute(THEME_ATTRIBUTE);
  if (!dataAttribute) {
    return null;
  }

  // Find the variant that matches this data attribute
  const variant = getAllVariants().find(v => v.dataAttribute === dataAttribute);
  return variant ? variant.id : null;
}

// ============================================================================
// Theme Migration and Compatibility
// ============================================================================

export function migrateThemePreferences(oldPreferences: any): ThemePreferences {
  const migrated: ThemePreferences = getDefaultPreferences();

  // Handle legacy theme IDs or formats
  if (oldPreferences.theme || oldPreferences.selectedTheme) {
    const themeId = oldPreferences.theme || oldPreferences.selectedTheme;
    
    // Map legacy theme names to new format
    const legacyMapping: Record<string, string> = {
      'dark': 'catppuccin-mocha',
      'light': 'catppuccin-latte',
      'catppuccin': 'catppuccin-mocha',
      'everforest': 'everforest-dark-medium',
      'gruvbox': 'gruvbox-dark-medium',
      'nord': 'nord',
      'vitesse': 'vitesse-dark'
    };

    const mappedTheme = legacyMapping[themeId] || themeId;
    
    if (validateTheme(mappedTheme).isValid) {
      migrated.selectedTheme = mappedTheme;
    }
  }

  if (typeof oldPreferences.followSystemTheme === 'boolean') {
    migrated.followSystemTheme = oldPreferences.followSystemTheme;
  }

  if (typeof oldPreferences.lastUpdated === 'number') {
    migrated.lastUpdated = oldPreferences.lastUpdated;
  }

  return migrated;
}

export function isThemeCompatible(themeId: string, version?: string): boolean {
  // For now, all themes are compatible
  // This function can be extended to handle version-specific compatibility
  return validateTheme(themeId).isValid;
}

export function getCompatibleThemes(version?: string): string[] {
  // Return all valid theme IDs
  return getAllVariants().map(variant => variant.id);
}

// ============================================================================
// Theme Utilities
// ============================================================================

export function getRandomTheme(mode?: 'light' | 'dark'): string {
  const variants = mode ? getThemesByMode(mode) : getAllVariants();
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex].id;
}

export function getNextTheme(currentTheme: string, mode?: 'light' | 'dark'): string {
  const variants = mode ? getThemesByMode(mode) : getAllVariants();
  const currentIndex = variants.findIndex(v => v.id === currentTheme);
  
  if (currentIndex === -1) {
    return variants[0]?.id || DEFAULT_THEME;
  }
  
  const nextIndex = (currentIndex + 1) % variants.length;
  return variants[nextIndex].id;
}

export function getPreviousTheme(currentTheme: string, mode?: 'light' | 'dark'): string {
  const variants = mode ? getThemesByMode(mode) : getAllVariants();
  const currentIndex = variants.findIndex(v => v.id === currentTheme);
  
  if (currentIndex === -1) {
    return variants[variants.length - 1]?.id || DEFAULT_THEME;
  }
  
  const prevIndex = currentIndex === 0 ? variants.length - 1 : currentIndex - 1;
  return variants[prevIndex].id;
}

export function createThemeToggle(lightTheme: string, darkTheme: string) {
  return (currentTheme: string): string => {
    const variant = findVariantById(currentTheme);
    if (!variant) {
      return darkTheme;
    }
    
    return variant.mode === 'dark' ? lightTheme : darkTheme;
  };
}

// ============================================================================
// Export all utilities
// ============================================================================

export const themeUtils = {
  // Validation
  validateTheme,
  validateThemeConfig,
  
  // Discovery
  findThemeById,
  findVariantById,
  getThemeVariants,
  getAllThemes,
  getAllVariants,
  getThemesByMode,
  getThemesByContrast,
  
  // Metadata
  getThemeMetadata,
  getThemeInfo,
  getThemeDisplayName,
  getThemeDescription,
  
  // System theme
  detectSystemTheme,
  getSystemThemeVariant,
  createSystemThemeListener,
  
  // Persistence
  saveThemePreferences,
  loadThemePreferences,
  clearThemePreferences,
  getDefaultPreferences,
  
  // Application
  applyTheme,
  removeTheme,
  getCurrentTheme,
  
  // Migration
  migrateThemePreferences,
  isThemeCompatible,
  getCompatibleThemes,
  
  // Utilities
  getRandomTheme,
  getNextTheme,
  getPreviousTheme,
  createThemeToggle
};

export default themeUtils;