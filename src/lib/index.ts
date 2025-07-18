/**
 * Main exports for the lib directory
 * Provides centralized access to all types, services, and utilities
 */

// Core types and interfaces
export * from './types'

// WebTUI types and terminal styling
export * from './webtui-types'

// Email service
export { EmailService } from './email-service'

// Mock data for development and testing
export * from './mock-data'

// Re-export commonly used types for convenience
export type {
  Email,
  Folder,
  EmailState,
  ComposeData,
  EmailAction,
  KeyboardShortcut,
  EmailOperationResult
} from './types'

export type {
  TerminalColorScheme,
  TerminalThemeConfig,
  WebTUIComponentProps,
  KeyboardNavigationConfig
} from './webtui-types'