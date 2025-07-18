/**
 * Core TypeScript interfaces and types for the terminal email client
 */

// Email interface representing individual email messages
export interface Email {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  htmlBody?: string
  date: Date
  isRead: boolean
  isFlagged: boolean
  hasAttachments: boolean
  folderId: string
  attachments?: EmailAttachment[]
}

// Email attachment interface
export interface EmailAttachment {
  id: string
  filename: string
  size: number
  mimeType: string
  url?: string
}

// Folder interface for email organization
export interface Folder {
  id: string
  name: string
  type: 'inbox' | 'sent' | 'drafts' | 'trash' | 'custom'
  emailCount: number
  unreadCount: number
  icon?: string
}

// Application state interface
export interface EmailState {
  currentFolder: string
  selectedEmail: string | null
  emails: Email[]
  folders: Folder[]
  isComposing: boolean
  searchQuery: string
  isLoading: boolean
  error: string | null
  composeData: ComposeData | null
}

// Compose form data interface
export interface ComposeData {
  to: string
  cc?: string
  bcc?: string
  subject: string
  body: string
  isDraft: boolean
}

// Email action types for state management
export type EmailAction =
  | { type: 'SET_FOLDER'; payload: string }
  | { type: 'SELECT_EMAIL'; payload: string | null }
  | { type: 'SET_EMAILS'; payload: Email[] }
  | { type: 'UPDATE_EMAIL'; payload: Email }
  | { type: 'DELETE_EMAIL'; payload: string }
  | { type: 'TOGGLE_COMPOSE'; payload?: ComposeData }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MARK_AS_READ'; payload: { emailId: string; isRead: boolean } }

// Keyboard navigation types
export type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

// Email service operation results
export interface EmailOperationResult {
  success: boolean
  error?: string
  data?: any
}

// Search filters and sorting
export interface EmailFilters {
  isRead?: boolean
  isFlagged?: boolean
  hasAttachments?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  sender?: string
}

export type EmailSortField = 'date' | 'from' | 'subject' | 'isRead'
export type SortDirection = 'asc' | 'desc'

export interface EmailSort {
  field: EmailSortField
  direction: SortDirection
}