# Design Document

## Overview

The terminal-style email client will be built as a Next.js 15 application using the App Router architecture, styled with the WebTUI CSS library to achieve an authentic terminal user interface aesthetic. The application will simulate a classic terminal email client experience while providing modern web functionality including responsive design, keyboard navigation, and email management capabilities.

The design emphasizes the WebTUI library's modular approach and CSS layer system to create terminal-style components without requiring extensive custom CSS or !important declarations. The application will leverage Next.js App Router features for optimal performance and developer experience.

## Architecture

### Application Structure
```
app/
├── layout.tsx                 # Root layout with WebTUI global styles
├── page.tsx                   # Main email client interface
├── globals.css                # WebTUI imports and custom terminal styles
├── components/
│   ├── EmailList.tsx          # Inbox/folder email listing
│   ├── EmailViewer.tsx        # Individual email display
│   ├── ComposeForm.tsx        # Email composition interface
│   ├── Sidebar.tsx            # Folder navigation
│   ├── TerminalHeader.tsx     # Terminal-style header bar
│   └── KeyboardShortcuts.tsx  # Keyboard navigation handler
├── lib/
│   ├── email-service.ts       # Email data management
│   ├── keyboard-handler.ts    # Keyboard event management
│   └── types.ts               # TypeScript interfaces
└── hooks/
    ├── useKeyboardNav.ts      # Keyboard navigation hook
    ├── useEmailState.ts       # Email state management
    └── useResponsive.ts       # Responsive behavior hook
```

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: WebTUI CSS library with CSS Modules for component-specific styles
- **State Management**: React hooks (useState, useReducer, useContext)
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: CSS Grid and Flexbox with WebTUI responsive utilities

## Components and Interfaces

### Core Components

#### 1. Root Layout (`app/layout.tsx`)
- Imports WebTUI global styles and custom terminal CSS
- Sets up monospace font family for terminal aesthetic
- Provides dark terminal color scheme as default
- Implements responsive viewport meta tags

#### 2. Main Email Interface (`app/page.tsx`)
- Server Component that orchestrates the email client layout
- Implements CSS Grid layout: sidebar + main content area
- Handles initial email data fetching
- Manages overall application state context

#### 3. Sidebar Component (`components/Sidebar.tsx`)
- Client Component for folder navigation
- Uses WebTUI navigation components for terminal-style menu
- Implements keyboard navigation (j/k for up/down, Enter to select)
- Displays folder counts and unread indicators
- Responsive: collapsible on mobile devices

#### 4. EmailList Component (`components/EmailList.tsx`)
- Client Component displaying email list in table format
- Uses WebTUI table components with terminal styling
- Implements virtual scrolling for performance with large email lists
- Keyboard navigation: arrow keys, vim-style (j/k), Enter to open
- Email status indicators: unread (bold), flagged, attachments
- Sortable columns: Date, From, Subject

#### 5. EmailViewer Component (`components/EmailViewer.tsx`)
- Client Component for displaying individual emails
- Uses WebTUI typography components for consistent text styling
- Header section: From, To, Subject, Date in terminal format
- Body section: Plain text rendering with proper line wrapping
- HTML email conversion to readable plain text
- Navigation controls: Previous/Next email, Return to list

#### 6. ComposeForm Component (`components/ComposeForm.tsx`)
- Client Component for email composition
- Uses WebTUI form components (input, textarea, button)
- Fields: To, CC, BCC, Subject, Body
- Terminal-style form validation and error display
- Keyboard shortcuts: Ctrl+Enter to send, Escape to cancel
- Auto-save draft functionality

#### 7. TerminalHeader Component (`components/TerminalHeader.tsx`)
- Displays terminal-style header bar
- Shows current folder, email count, connection status
- Clock display in terminal format
- WebTUI styling for authentic terminal appearance

### Data Interfaces

```typescript
interface Email {
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
}

interface Folder {
  id: string
  name: string
  type: 'inbox' | 'sent' | 'drafts' | 'trash' | 'custom'
  emailCount: number
  unreadCount: number
}

interface EmailState {
  currentFolder: string
  selectedEmail: string | null
  emails: Email[]
  folders: Folder[]
  isComposing: boolean
  searchQuery: string
}
```

## Data Models

### Email Service Layer
The email service will provide a clean API for email operations:

```typescript
class EmailService {
  // Fetch emails for a specific folder
  async getEmails(folderId: string): Promise<Email[]>
  
  // Get single email with full content
  async getEmail(emailId: string): Promise<Email>
  
  // Send new email
  async sendEmail(email: Partial<Email>): Promise<void>
  
  // Move email between folders
  async moveEmail(emailId: string, targetFolderId: string): Promise<void>
  
  // Mark email as read/unread
  async markAsRead(emailId: string, isRead: boolean): Promise<void>
  
  // Delete email (move to trash)
  async deleteEmail(emailId: string): Promise<void>
  
  // Search emails
  async searchEmails(query: string): Promise<Email[]>
}
```

### State Management
Using React Context and useReducer for complex state management:

```typescript
interface EmailAction {
  type: 'SET_FOLDER' | 'SELECT_EMAIL' | 'TOGGLE_COMPOSE' | 'UPDATE_EMAILS'
  payload: any
}

const emailReducer = (state: EmailState, action: EmailAction): EmailState => {
  // Handle state transitions
}
```

## Error Handling

### Client-Side Error Boundaries
- Implement React Error Boundaries for component-level error handling
- Terminal-style error messages using WebTUI alert components
- Graceful degradation when email service is unavailable

### Network Error Handling
- Retry logic for failed email operations
- Offline state detection and user notification
- Connection status indicator in terminal header

### Validation and User Feedback
- Form validation with terminal-style error messages
- Loading states using WebTUI spinner components
- Success/failure notifications in terminal format

## Testing Strategy

### Unit Testing
- Jest and React Testing Library for component testing
- Mock email service for isolated component testing
- Keyboard navigation testing with user event simulation
- WebTUI component integration testing

### Integration Testing
- Email workflow testing (compose, send, read, delete)
- Keyboard shortcut functionality testing
- Responsive behavior testing across device sizes
- Cross-browser compatibility testing

### E2E Testing
- Cypress tests for complete user workflows
- Email client functionality from user perspective
- Keyboard navigation end-to-end testing
- Performance testing with large email datasets

### Accessibility Testing
- Screen reader compatibility testing
- Keyboard-only navigation testing
- Color contrast validation for terminal theme
- ARIA labels and semantic HTML structure

## WebTUI Integration Strategy

### CSS Layer Implementation
- Leverage WebTUI's CSS layer system for predictable styling
- Custom terminal theme layer for color scheme overrides
- Component-specific layers for fine-tuned styling

### Modular Component Usage
- Import only required WebTUI components to minimize bundle size
- Use WebTUI's purist approach with minimal markup
- Extend WebTUI components with custom terminal behaviors

### Terminal Aesthetic Implementation
- Monospace font family (Fira Code, Consolas, Monaco fallbacks)
- Dark terminal color scheme (green on black, amber highlights)
- ASCII art elements for enhanced terminal feel
- Cursor simulation for active elements
- Terminal-style borders and spacing

### Responsive Design with WebTUI
- Utilize WebTUI's responsive utilities
- Mobile-first approach with progressive enhancement
- Collapsible sidebar for mobile devices
- Touch-friendly targets while maintaining keyboard focus
- Adaptive font sizes for readability across devices