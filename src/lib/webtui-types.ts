/**
 * Type definitions for WebTUI components and terminal styling
 * Provides TypeScript support for WebTUI CSS library integration
 */

// WebTUI Component Props and Styling Types
export interface WebTUIComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  'data-testid'?: string
}

// Terminal Color Scheme Types
export interface TerminalColorScheme {
  background: string
  foreground: string
  accent: string
  error: string
  warning: string
  info: string
  muted: string
  border: string
  selection: string
  cursor: string
}

// WebTUI CSS Layer Types
export type WebTUILayer = 
  | 'reset'
  | 'base' 
  | 'components'
  | 'utilities'
  | 'custom'

// Terminal Typography Types
export interface TerminalTypography {
  fontFamily: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
  fontWeight: 'normal' | 'bold'
}

// WebTUI Table Component Types
export interface WebTUITableProps extends WebTUIComponentProps {
  headers: string[]
  rows: (string | React.ReactNode)[][]
  sortable?: boolean
  selectable?: boolean
  striped?: boolean
  bordered?: boolean
}

// WebTUI Form Component Types
export interface WebTUIInputProps extends WebTUIComponentProps {
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  autoFocus?: boolean
}

export interface WebTUITextareaProps extends WebTUIComponentProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  rows?: number
  cols?: number
  disabled?: boolean
  required?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export interface WebTUIButtonProps extends WebTUIComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// WebTUI Navigation Component Types
export interface WebTUINavItem {
  id: string
  label: string
  icon?: string
  active?: boolean
  disabled?: boolean
  badge?: string | number
  onClick?: () => void
}

export interface WebTUINavProps extends WebTUIComponentProps {
  items: WebTUINavItem[]
  orientation?: 'horizontal' | 'vertical'
  collapsible?: boolean
  collapsed?: boolean
}

// WebTUI Layout Component Types
export interface WebTUIGridProps extends WebTUIComponentProps {
  columns?: number | string
  rows?: number | string
  gap?: string
  areas?: string
  responsive?: boolean
}

export interface WebTUIFlexProps extends WebTUIComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: string
}

// WebTUI Modal/Dialog Component Types
export interface WebTUIModalProps extends WebTUIComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closable?: boolean
  backdrop?: boolean
}

// WebTUI Alert/Notification Component Types
export interface WebTUIAlertProps extends WebTUIComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: string
}

// Terminal-specific styling utilities
export interface TerminalStyleUtils {
  // ASCII art and decorative elements
  ascii: {
    horizontalLine: (length: number, char?: string) => string
    verticalLine: (height: number, char?: string) => string
    box: (width: number, height: number, char?: string) => string
    bullet: string
    arrow: string
    separator: string
  }
  
  // Color utilities for terminal themes
  colors: {
    primary: (text: string) => string
    secondary: (text: string) => string
    accent: (text: string) => string
    error: (text: string) => string
    warning: (text: string) => string
    info: (text: string) => string
    muted: (text: string) => string
    success: (text: string) => string
  }
  
  // Text formatting utilities
  format: {
    bold: (text: string) => string
    italic: (text: string) => string
    underline: (text: string) => string
    strikethrough: (text: string) => string
    monospace: (text: string) => string
  }
}

// Keyboard navigation types
export interface KeyboardNavigationConfig {
  enabled: boolean
  keys: {
    up: string[]
    down: string[]
    left: string[]
    right: string[]
    select: string[]
    back: string[]
    search: string[]
    compose: string[]
    delete: string[]
    flag: string[]
    markRead: string[]
  }
  preventDefault: boolean
  stopPropagation: boolean
}

// Responsive breakpoints for terminal UI
export interface TerminalBreakpoints {
  mobile: string
  tablet: string
  desktop: string
  wide: string
}

// Animation and transition types for terminal effects
export interface TerminalAnimations {
  cursor: {
    blink: string
    duration: string
  }
  typing: {
    speed: string
    delay: string
  }
  fade: {
    in: string
    out: string
  }
  slide: {
    up: string
    down: string
    left: string
    right: string
  }
}

// WebTUI CSS custom properties interface
export interface WebTUICustomProperties {
  '--webtui-font-family': string
  '--webtui-font-size': string
  '--webtui-line-height': string
  '--webtui-color-bg': string
  '--webtui-color-fg': string
  '--webtui-color-accent': string
  '--webtui-color-border': string
  '--webtui-color-selection': string
  '--webtui-spacing-xs': string
  '--webtui-spacing-sm': string
  '--webtui-spacing-md': string
  '--webtui-spacing-lg': string
  '--webtui-spacing-xl': string
  '--webtui-border-radius': string
  '--webtui-border-width': string
  '--webtui-transition-duration': string
  '--webtui-transition-timing': string
}

// Terminal theme configuration
export interface TerminalThemeConfig {
  name: string
  colors: TerminalColorScheme
  typography: TerminalTypography
  animations: TerminalAnimations
  breakpoints: TerminalBreakpoints
  customProperties: Partial<WebTUICustomProperties>
}

// Default terminal themes
export const terminalThemes: Record<string, TerminalThemeConfig> = {
  classic: {
    name: 'Classic Green',
    colors: {
      background: '#000000',
      foreground: '#00ff00',
      accent: '#ffff00',
      error: '#ff0000',
      warning: '#ffa500',
      info: '#00ffff',
      muted: '#808080',
      border: '#333333',
      selection: '#333333',
      cursor: '#00ff00'
    },
    typography: {
      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
      fontSize: '14px',
      lineHeight: '1.4',
      letterSpacing: '0',
      fontWeight: 'normal'
    },
    animations: {
      cursor: {
        blink: '1s infinite',
        duration: '0.5s'
      },
      typing: {
        speed: '0.05s',
        delay: '0.1s'
      },
      fade: {
        in: '0.3s ease-in',
        out: '0.2s ease-out'
      },
      slide: {
        up: '0.3s ease-out',
        down: '0.3s ease-out',
        left: '0.2s ease-out',
        right: '0.2s ease-out'
      }
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1200px'
    },
    customProperties: {
      '--webtui-font-family': '"Fira Code", "Consolas", "Monaco", monospace',
      '--webtui-color-bg': '#000000',
      '--webtui-color-fg': '#00ff00',
      '--webtui-color-accent': '#ffff00'
    }
  },
  
  amber: {
    name: 'Amber Terminal',
    colors: {
      background: '#1a0f00',
      foreground: '#ffb000',
      accent: '#ffd700',
      error: '#ff4444',
      warning: '#ff8800',
      info: '#44ddff',
      muted: '#996600',
      border: '#443300',
      selection: '#443300',
      cursor: '#ffb000'
    },
    typography: {
      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
      fontSize: '14px',
      lineHeight: '1.4',
      letterSpacing: '0',
      fontWeight: 'normal'
    },
    animations: {
      cursor: {
        blink: '1s infinite',
        duration: '0.5s'
      },
      typing: {
        speed: '0.05s',
        delay: '0.1s'
      },
      fade: {
        in: '0.3s ease-in',
        out: '0.2s ease-out'
      },
      slide: {
        up: '0.3s ease-out',
        down: '0.3s ease-out',
        left: '0.2s ease-out',
        right: '0.2s ease-out'
      }
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1200px'
    },
    customProperties: {
      '--webtui-font-family': '"Fira Code", "Consolas", "Monaco", monospace',
      '--webtui-color-bg': '#1a0f00',
      '--webtui-color-fg': '#ffb000',
      '--webtui-color-accent': '#ffd700'
    }
  }
}

// Export utility type for component refs
export type WebTUIComponentRef<T = HTMLElement> = React.RefObject<T>

// Export utility type for event handlers
export type WebTUIEventHandler<T = Event> = (event: T) => void