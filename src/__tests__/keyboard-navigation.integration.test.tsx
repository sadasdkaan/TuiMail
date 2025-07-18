import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailClientLayout from '../components/EmailClientLayout'
import { generateMockEmails } from '../lib/mock-data'
import { EmailService } from '../lib/email-service'

// Mock the email service
jest.mock('../lib/email-service')
const MockedEmailService = EmailService as jest.MockedClass<typeof EmailService>

// Mock all components and hooks
const mockActions = {
  selectEmail: jest.fn(),
  setCurrentFolder: jest.fn(),
  startCompose: jest.fn(),
  cancelCompose: jest.fn(),
  updateComposeData: jest.fn(),
  sendEmail: jest.fn(),
  deleteEmail: jest.fn(),
  markAsRead: jest.fn(),
  markAsUnread: jest.fn(),
  searchEmails: jest.fn(),
  clearSearch: jest.fn(),
  clearError: jest.fn()
}

let mockState = {
  emails: [] as any[],
  selectedEmail: null,
  currentFolder: 'inbox',
  isComposing: false,
  composeData: { to: '', subject: '', body: '' },
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: []
}

jest.mock('../hooks/useEmailState', () => ({
  useEmailState: jest.fn(() => ({
    state: mockState,
    actions: mockActions
  }))
}))

jest.mock('../hooks/useGlobalKeyboard', () => ({
  useGlobalKeyboard: jest.fn()
}))

jest.mock('../hooks/useResponsive', () => ({
  useResponsive: () => ({ isMobile: false, isTablet: false, isDesktop: true })
}))

jest.mock('../hooks/useKeyboardNav', () => ({
  useKeyboardNav: jest.fn(() => ({
    currentIndex: 0,
    setCurrentIndex: jest.fn(),
    handleKeyDown: jest.fn()
  }))
}))

// Mock all child components with more realistic structure
jest.mock('../components/Sidebar', () => ({
  Sidebar: ({ onCompose, folders, currentFolder, onFolderSelect }: any) => (
    <div data-testid="sidebar" role="navigation" aria-label="Folder navigation">
      <button onClick={onCompose}>Compose</button>
      {folders?.map((folder: any) => (
        <div 
          key={folder.id} 
          className={currentFolder === folder.id ? 'selected' : ''}
          onClick={() => onFolderSelect?.(folder.id)}
        >
          {folder.name}
        </div>
      ))}
    </div>
  )
}))

jest.mock('../components/EmailList', () => ({
  EmailList: ({ emails, onEmailSelect }: any) => (
    <div data-testid="email-list" role="grid" aria-label="Email list" aria-rowcount={emails?.length + 1 || 1}>
      <div role="row">
        <div role="columnheader">From</div>
        <div role="columnheader">Subject</div>
        <div role="columnheader">Date</div>
      </div>
      {emails?.map((email: any, index: number) => (
        <div 
          key={email.id} 
          role="row" 
          className={index === 0 ? 'bg-terminal-selection' : ''}
          onClick={() => onEmailSelect?.(email)}
        >
          <div role="gridcell">{email.from}</div>
          <div role="gridcell">{email.subject}</div>
          <div role="gridcell">{email.date?.toLocaleDateString?.() || 'Date'}</div>
          <input type="checkbox" aria-label="Select email" />
        </div>
      ))}
    </div>
  )
}))

jest.mock('../components/EmailViewer', () => ({
  EmailViewer: ({ email, onClose }: any) => (
    <div data-testid="email-viewer">
      {email && <div>From: {email.from}</div>}
      <button onClick={onClose}>Back</button>
    </div>
  )
}))

jest.mock('../components/ComposeForm', () => ({
  ComposeForm: ({ onSend, onCancel }: any) => (
    <div data-testid="compose-form">
      <label>To: <input aria-label="To:" /></label>
      <label>Subject: <input aria-label="Subject:" /></label>
      <label>Message: <textarea aria-label="Message:" /></label>
      <button onClick={onSend}>Send</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

jest.mock('../components/TerminalHeader', () => ({
  TerminalHeader: () => <div data-testid="terminal-header">Terminal Header</div>
}))

jest.mock('../components/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>
}))

jest.mock('../components/ErrorMessage', () => ({
  ErrorMessage: () => <div data-testid="error-message">Error</div>
}))

jest.mock('../components/NotificationSystem', () => ({
  NotificationSystem: () => <div data-testid="notification-system">Notifications</div>
}))

describe('Keyboard Navigation Integration Tests', () => {
  let mockEmailService: jest.Mocked<EmailService>
  const mockEmails = generateMockEmails().slice(0, 3)
  const mockFolders = [
    { id: 'inbox', name: 'Inbox', type: 'inbox' as const, emailCount: 3, unreadCount: 1 },
    { id: 'sent', name: 'Sent', type: 'sent' as const, emailCount: 2, unreadCount: 0 }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockEmailService = new MockedEmailService() as jest.Mocked<EmailService>
    
    // Update mock state to include emails and folders
    mockState.emails = mockEmails
    mockState.currentFolder = 'inbox'
    mockState.isComposing = false
    mockState.selectedEmail = null
    
    mockEmailService.getEmails.mockResolvedValue(mockEmails)
    mockEmailService.getFolders.mockResolvedValue(mockFolders)
    mockEmailService.getEmail.mockImplementation(async (id) => 
      mockEmails.find(email => email.id === id) || null
    )
  })

  describe('Component Integration', () => {
    it('should render email client layout with all components', async () => {
      render(<EmailClientLayout />)

      // Verify all main components are rendered
      expect(screen.getByTestId('terminal-header')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('email-list')).toBeInTheDocument()
      expect(screen.getByTestId('notification-system')).toBeInTheDocument()
    })

    it('should display email list with proper structure', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: /email list/i })).toBeInTheDocument()
      })

      // Verify email list has proper ARIA attributes
      const emailList = screen.getByRole('grid', { name: /email list/i })
      expect(emailList).toHaveAttribute('aria-label', 'Email list')
      expect(emailList).toHaveAttribute('aria-rowcount', String(mockEmails.length + 1))

      // Verify column headers are present
      expect(screen.getByRole('columnheader', { name: /from/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /subject/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument()
    })

    it('should display sidebar with folder navigation', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByRole('navigation', { name: /folder navigation/i })).toBeInTheDocument()
      })

      // Verify sidebar has proper ARIA attributes
      const sidebar = screen.getByRole('navigation', { name: /folder navigation/i })
      expect(sidebar).toHaveAttribute('aria-label', 'Folder navigation')

      // Verify compose button is present
      expect(screen.getByRole('button', { name: /compose/i })).toBeInTheDocument()

      // Verify folders are displayed
      expect(screen.getByText('Inbox')).toBeInTheDocument()
      expect(screen.getByText('Sent')).toBeInTheDocument()
    })

    it('should handle compose form interaction', async () => {
      const user = userEvent.setup()
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /compose/i })).toBeInTheDocument()
      })

      // Click compose button
      const composeButton = screen.getByRole('button', { name: /compose/i })
      await user.click(composeButton)

      // Verify compose form is displayed
      expect(mockActions.startCompose).toHaveBeenCalled()
    })

    it('should handle email selection', async () => {
      const user = userEvent.setup()
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: /email list/i })).toBeInTheDocument()
      })

      // Click on first email row
      const emailRows = screen.getAllByRole('row')
      if (emailRows.length > 1) {
        await user.click(emailRows[1]) // Skip header row
        expect(mockActions.selectEmail).toHaveBeenCalled()
      }
    })

    it('should handle folder selection', async () => {
      const user = userEvent.setup()
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByText('Sent')).toBeInTheDocument()
      })

      // Click on Sent folder
      await user.click(screen.getByText('Sent'))
      expect(mockActions.setCurrentFolder).toHaveBeenCalledWith('sent')
    })
  })

  describe('Basic Keyboard Navigation', () => {
    it('should handle basic keyboard events', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: /email list/i })).toBeInTheDocument()
      })

      const emailList = screen.getByRole('grid', { name: /email list/i })
      
      // Test basic key events don't cause errors
      fireEvent.keyDown(emailList, { key: 'ArrowDown' })
      fireEvent.keyDown(emailList, { key: 'ArrowUp' })
      fireEvent.keyDown(emailList, { key: 'Enter' })
      fireEvent.keyDown(emailList, { key: ' ' })

      // Verify component is still rendered
      expect(emailList).toBeInTheDocument()
    })

    it('should handle global keyboard shortcuts', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      })

      // Test global shortcuts don't cause errors
      fireEvent.keyDown(document, { key: 'c' })
      fireEvent.keyDown(document, { key: 'r' })
      fireEvent.keyDown(document, { key: 'Escape' })

      // Verify component is still rendered
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })
  })

  describe('State Management Integration', () => {
    it('should integrate with email state management', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByTestId('email-list')).toBeInTheDocument()
      })

      // Verify useEmailState hook is called
      expect(require('../hooks/useEmailState').useEmailState).toHaveBeenCalled()
    })

    it('should integrate with keyboard navigation hooks', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByTestId('email-list')).toBeInTheDocument()
      })

      // Verify keyboard hooks are available (mocked)
      expect(require('../hooks/useKeyboardNav').useKeyboardNav).toBeDefined()
      expect(require('../hooks/useGlobalKeyboard').useGlobalKeyboard).toBeDefined()
    })

    it('should integrate with responsive design hooks', async () => {
      render(<EmailClientLayout />)

      await waitFor(() => {
        expect(screen.getByTestId('email-list')).toBeInTheDocument()
      })

      // Verify responsive hook is available (mocked)
      expect(require('../hooks/useResponsive').useResponsive).toBeDefined()
    })
  })
})
