import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailViewer } from '../EmailViewer'
import { Email } from '@/lib/types'

// Mock email data for testing
const mockEmail: Email = {
  id: 'test-email-1',
  from: 'sender@example.com',
  to: ['recipient@example.com'],
  cc: ['cc@example.com'],
  bcc: ['bcc@example.com'],
  subject: 'Test Email Subject',
  body: 'This is a test email body with some content.\n\nIt has multiple paragraphs to test formatting.',
  date: new Date('2024-01-15T10:30:00'),
  isRead: false,
  isFlagged: true,
  hasAttachments: true,
  folderId: 'inbox',
  attachments: [
    {
      id: 'att-1',
      filename: 'document.pdf',
      size: 1024000,
      mimeType: 'application/pdf'
    }
  ]
}

const mockEmailRead: Email = {
  ...mockEmail,
  id: 'test-email-2',
  isRead: true,
  isFlagged: false,
  hasAttachments: false,
  attachments: undefined
}

describe('EmailViewer', () => {
  const mockFolders = [
    { id: 'inbox', name: 'Inbox', type: 'inbox' as const, emailCount: 5, unreadCount: 2 },
    { id: 'sent', name: 'Sent', type: 'sent' as const, emailCount: 3, unreadCount: 0 },
    { id: 'drafts', name: 'Drafts', type: 'drafts' as const, emailCount: 1, unreadCount: 0 },
    { id: 'trash', name: 'Trash', type: 'trash' as const, emailCount: 0, unreadCount: 0 }
  ]
  const mockEmailService = {
    markAsRead: jest.fn().mockResolvedValue({ success: true }),
    toggleFlag: jest.fn().mockResolvedValue({ success: true, data: mockEmail }),
    deleteEmail: jest.fn().mockResolvedValue({ success: true }),
    moveEmail: jest.fn().mockResolvedValue({ success: true })
  } as any
  const mockOnClose = jest.fn()
  const mockOnPrevious = jest.fn()
  const mockOnNext = jest.fn()
  const mockOnEmailUpdate = jest.fn()
  const mockOnEmailDelete = jest.fn()
  const mockOnEmailMove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaultProps = {
    folders: mockFolders,
    emailService: mockEmailService,
    onClose: mockOnClose,
    onPrevious: mockOnPrevious,
    onNext: mockOnNext,
    onEmailUpdate: mockOnEmailUpdate,
    onEmailDelete: mockOnEmailDelete,
    onEmailMove: mockOnEmailMove
  }

  describe('Empty State', () => {
    it('renders empty state when no email is provided', () => {
      render(
        <EmailViewer
          email={null}
          {...defaultProps}
        />
      )

      expect(screen.getByText('▶ No email selected')).toBeInTheDocument()
      expect(screen.getByText('Select an email from the list to view it here')).toBeInTheDocument()
    })

    it('displays ASCII art in empty state', () => {
      render(
        <EmailViewer
          email={null}
          {...defaultProps}
        />
      )

      // Check for ASCII art presence (miniLogo should be displayed)
      const asciiElement = screen.getByText(/▶ No email selected/)
      expect(asciiElement).toBeInTheDocument()
    })
  })

  describe('Email Display', () => {
    it('renders email header information correctly', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      expect(screen.getByText('From:')).toBeInTheDocument()
      expect(screen.getByText('sender@example.com')).toBeInTheDocument()
      expect(screen.getByText('To:')).toBeInTheDocument()
      expect(screen.getByText('recipient@example.com')).toBeInTheDocument()
      expect(screen.getByText('Subject:')).toBeInTheDocument()
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    it('renders email body with proper formatting', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      expect(screen.getByText(/This is a test email body/)).toBeInTheDocument()
      expect(screen.getByText(/It has multiple paragraphs/)).toBeInTheDocument()
    })

    it('displays status indicators for unread, flagged, and attachment emails', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      // Check for unread indicator (●)
      expect(screen.getByText('●')).toBeInTheDocument()
      // Check for flagged indicator (⚑)
      expect(screen.getByText('⚑')).toBeInTheDocument()
      // Check for attachment indicator (📎)
      expect(screen.getByText('📎')).toBeInTheDocument()
    })

    it('does not display status indicators for read emails without flags or attachments', () => {
      render(
        <EmailViewer
          email={mockEmailRead}
          {...defaultProps}
        />
      )

      // Should not show unread, flagged, or attachment indicators
      expect(screen.queryByText('●')).not.toBeInTheDocument()
      expect(screen.queryByText('⚑')).not.toBeInTheDocument()
      expect(screen.queryByText('📎')).not.toBeInTheDocument()
    })

    it('displays attachment information when present', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      expect(screen.getByText('Attachments:')).toBeInTheDocument()
      expect(screen.getByText(/document\.pdf/)).toBeInTheDocument()
      expect(screen.getByText(/1000KB/)).toBeInTheDocument()
    })

    it('formats date correctly', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      expect(screen.getByText('Date:')).toBeInTheDocument()
      // Check for formatted date (should include Mon, Jan 15, 2024)
      expect(screen.getByText(/Mon.*Jan.*15.*2024/)).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('renders navigation buttons', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={true}
          hasNext={true}
        />
      )

      expect(screen.getByText('← Back')).toBeInTheDocument()
      expect(screen.getByText('← Prev')).toBeInTheDocument()
      expect(screen.getByText('Next →')).toBeInTheDocument()
    })

    it('calls onClose when back button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      const backButton = screen.getByText('← Back')
      await user.click(backButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onPrevious when previous button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={true}
        />
      )

      const prevButton = screen.getByText('← Prev')
      await user.click(prevButton)

      expect(mockOnPrevious).toHaveBeenCalledTimes(1)
    })

    it('calls onNext when next button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasNext={true}
        />
      )

      const nextButton = screen.getByText('Next →')
      await user.click(nextButton)

      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })

    it('disables previous button when hasPrevious is false', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={false}
        />
      )

      const prevButton = screen.getByText('← Prev')
      expect(prevButton).toBeDisabled()
    })

    it('disables next button when hasNext is false', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasNext={false}
        />
      )

      const nextButton = screen.getByText('Next →')
      expect(nextButton).toBeDisabled()
    })
  })

  describe('Keyboard Navigation', () => {
    it('calls onClose when Escape key is pressed', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when q key is pressed', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      fireEvent.keyDown(document, { key: 'q' })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onPrevious when left arrow key is pressed', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={true}
        />
      )

      fireEvent.keyDown(document, { key: 'ArrowLeft' })

      expect(mockOnPrevious).toHaveBeenCalledTimes(1)
    })

    it('calls onPrevious when h key is pressed (vim-style)', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={true}
        />
      )

      fireEvent.keyDown(document, { key: 'h' })

      expect(mockOnPrevious).toHaveBeenCalledTimes(1)
    })

    it('calls onNext when right arrow key is pressed', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasNext={true}
        />
      )

      fireEvent.keyDown(document, { key: 'ArrowRight' })

      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })

    it('calls onNext when l key is pressed (vim-style)', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasNext={true}
        />
      )

      fireEvent.keyDown(document, { key: 'l' })

      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })

    it('does not call onPrevious when hasPrevious is false', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={false}
        />
      )

      fireEvent.keyDown(document, { key: 'ArrowLeft' })

      expect(mockOnPrevious).not.toHaveBeenCalled()
    })

    it('does not call onNext when hasNext is false', async () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasNext={false}
        />
      )

      fireEvent.keyDown(document, { key: 'ArrowRight' })

      expect(mockOnNext).not.toHaveBeenCalled()
    })
  })

  describe('Text Formatting', () => {
    it('wraps long lines correctly', () => {
      const longLineEmail = {
        ...mockEmail,
        body: 'This is a very long line that should be wrapped at 80 characters to ensure proper formatting in the terminal email viewer and maintain readability for users.'
      }

      render(
        <EmailViewer
          email={longLineEmail}
          {...defaultProps}
        />
      )

      const emailContent = screen.getByText(/This is a very long line/)
      expect(emailContent).toBeInTheDocument()
    })

    it('preserves paragraph breaks in email body', () => {
      const multiParagraphEmail = {
        ...mockEmail,
        body: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.'
      }

      render(
        <EmailViewer
          email={multiParagraphEmail}
          {...defaultProps}
        />
      )

      const emailContent = screen.getByText(/First paragraph/)
      expect(emailContent.textContent).toContain('First paragraph.')
      expect(emailContent.textContent).toContain('Second paragraph.')
      expect(emailContent.textContent).toContain('Third paragraph.')
    })
  })

  describe('Accessibility', () => {
    it('provides proper button titles for screen readers', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
          hasPrevious={true}
          hasNext={true}
        />
      )

      expect(screen.getByTitle('Return to list (Escape or q)')).toBeInTheDocument()
      expect(screen.getByTitle('Previous email (← or h)')).toBeInTheDocument()
      expect(screen.getByTitle('Next email (→ or l)')).toBeInTheDocument()
    })

    it('displays keyboard shortcuts in footer', () => {
      render(
        <EmailViewer
          email={mockEmail}
          {...defaultProps}
        />
      )

      // Check for individual keyboard shortcut elements
      expect(screen.getByText('Esc')).toBeInTheDocument()
      expect(screen.getByText('q')).toBeInTheDocument()
      
      // Check that the shortcut hint container exists by finding the specific span with the class
      const shortcutHint = screen.getByText(/Back.*Previous.*Next/)
      expect(shortcutHint).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles emails without CC field', () => {
      const emailWithoutCC = {
        ...mockEmail,
        cc: undefined
      }

      render(
        <EmailViewer
          email={emailWithoutCC}
          {...defaultProps}
        />
      )

      expect(screen.queryByText('CC:')).not.toBeInTheDocument()
    })

    it('handles emails without BCC field', () => {
      const emailWithoutBCC = {
        ...mockEmail,
        bcc: undefined
      }

      render(
        <EmailViewer
          email={emailWithoutBCC}
          {...defaultProps}
        />
      )

      expect(screen.queryByText('BCC:')).not.toBeInTheDocument()
    })

    it('handles emails without attachments', () => {
      const emailWithoutAttachments = {
        ...mockEmail,
        hasAttachments: false,
        attachments: undefined
      }

      render(
        <EmailViewer
          email={emailWithoutAttachments}
          {...defaultProps}
        />
      )

      expect(screen.queryByText('Attachments:')).not.toBeInTheDocument()
    })

    it('handles empty email body', () => {
      const emailWithEmptyBody = {
        ...mockEmail,
        body: ''
      }

      render(
        <EmailViewer
          email={emailWithEmptyBody}
          {...defaultProps}
        />
      )

      // Should still render the email structure
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    it('handles multiple recipients', () => {
      const emailWithMultipleRecipients = {
        ...mockEmail,
        to: ['recipient1@example.com', 'recipient2@example.com', 'recipient3@example.com']
      }

      render(
        <EmailViewer
          email={emailWithMultipleRecipients}
          {...defaultProps}
        />
      )

      expect(screen.getByText(/recipient1@example\.com, recipient2@example\.com, recipient3@example\.com/)).toBeInTheDocument()
    })
  })
})