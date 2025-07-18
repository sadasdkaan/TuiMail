import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmailActions from '../EmailActions'
import { EmailService } from '@/lib/email-service'
import { Email, Folder } from '@/lib/types'

// Mock the EmailService
jest.mock('@/lib/email-service')

const mockEmail: Email = {
  id: 'test-email-1',
  from: 'sender@example.com',
  to: ['recipient@example.com'],
  subject: 'Test Email',
  body: 'Test email body',
  date: new Date('2024-01-01'),
  isRead: false,
  isFlagged: false,
  hasAttachments: false,
  folderId: 'inbox'
}

const mockFolders: Folder[] = [
  { id: 'inbox', name: 'Inbox', type: 'inbox', emailCount: 5, unreadCount: 2 },
  { id: 'sent', name: 'Sent', type: 'sent', emailCount: 3, unreadCount: 0 },
  { id: 'trash', name: 'Trash', type: 'trash', emailCount: 1, unreadCount: 0 }
]

const mockEmailService = new EmailService() as jest.Mocked<EmailService>

const defaultProps = {
  email: mockEmail,
  folders: mockFolders,
  emailService: mockEmailService,
  onEmailUpdate: jest.fn(),
  onEmailDelete: jest.fn(),
  onEmailMove: jest.fn()
}

describe('EmailActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEmailService.markAsRead.mockResolvedValue({ success: true })
    mockEmailService.toggleFlag.mockResolvedValue({ success: true, data: { ...mockEmail, isFlagged: true } })
    mockEmailService.deleteEmail.mockResolvedValue({ success: true })
    mockEmailService.moveEmail.mockResolvedValue({ success: true })
  })

  it('renders all action buttons', () => {
    render(<EmailActions {...defaultProps} />)
    
    expect(screen.getByText('[Read]')).toBeInTheDocument()
    expect(screen.getByText('[Flag]')).toBeInTheDocument()
    expect(screen.getByText('[Move] ▼')).toBeInTheDocument()
    expect(screen.getByText('[Delete]')).toBeInTheDocument()
  })

  it('shows correct read/unread button text', () => {
    const { rerender } = render(<EmailActions {...defaultProps} />)
    
    // Unread email should show "Read" button
    expect(screen.getByText('[Read]')).toBeInTheDocument()
    
    // Read email should show "Unread" button
    const readEmail = { ...mockEmail, isRead: true }
    rerender(<EmailActions {...defaultProps} email={readEmail} />)
    expect(screen.getByText('[Unread]')).toBeInTheDocument()
  })

  it('shows correct flag/unflag button text', () => {
    const { rerender } = render(<EmailActions {...defaultProps} />)
    
    // Unflagged email should show "Flag" button
    expect(screen.getByText('[Flag]')).toBeInTheDocument()
    
    // Flagged email should show "Unflag" button
    const flaggedEmail = { ...mockEmail, isFlagged: true }
    rerender(<EmailActions {...defaultProps} email={flaggedEmail} />)
    expect(screen.getByText('[Unflag]')).toBeInTheDocument()
  })

  it('calls markAsRead when read/unread button is clicked', async () => {
    render(<EmailActions {...defaultProps} />)
    
    const readButton = screen.getByText('[Read]')
    fireEvent.click(readButton)
    
    await waitFor(() => {
      expect(mockEmailService.markAsRead).toHaveBeenCalledWith('test-email-1', true)
      expect(defaultProps.onEmailUpdate).toHaveBeenCalledWith({
        ...mockEmail,
        isRead: true
      })
    })
  })

  it('calls toggleFlag when flag button is clicked', async () => {
    render(<EmailActions {...defaultProps} />)
    
    const flagButton = screen.getByText('[Flag]')
    fireEvent.click(flagButton)
    
    await waitFor(() => {
      expect(mockEmailService.toggleFlag).toHaveBeenCalledWith('test-email-1')
      expect(defaultProps.onEmailUpdate).toHaveBeenCalledWith({
        ...mockEmail,
        isFlagged: true
      })
    })
  })

  it('shows confirmation dialog when delete button is clicked', async () => {
    render(<EmailActions {...defaultProps} />)
    
    const deleteButton = screen.getByText('[Delete]')
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Delete Email/)).toBeInTheDocument()
      expect(screen.getByText(/moved to Trash/)).toBeInTheDocument()
    })
  })

  it('shows move menu when move button is clicked', async () => {
    render(<EmailActions {...defaultProps} />)
    
    const moveButton = screen.getByText('[Move] ▼')
    fireEvent.click(moveButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sent')).toBeInTheDocument()
      expect(screen.getByText('Trash')).toBeInTheDocument()
      // Should not show current folder (Inbox)
      expect(screen.queryByText('Inbox')).not.toBeInTheDocument()
    })
  })

  it('calls deleteEmail when delete is confirmed', async () => {
    render(<EmailActions {...defaultProps} />)
    
    // Click delete button
    const deleteButton = screen.getByText('[Delete]')
    fireEvent.click(deleteButton)
    
    // Confirm deletion - get the confirmation button specifically
    await waitFor(() => {
      const confirmButtons = screen.getAllByText(/Delete/)
      const confirmButton = confirmButtons.find(button => 
        button.className.includes('terminal-button-warning')
      )
      fireEvent.click(confirmButton!)
    })
    
    await waitFor(() => {
      expect(mockEmailService.deleteEmail).toHaveBeenCalledWith('test-email-1')
      expect(defaultProps.onEmailDelete).toHaveBeenCalledWith('test-email-1')
    })
  })

  it('calls moveEmail when move is confirmed', async () => {
    render(<EmailActions {...defaultProps} />)
    
    // Click move button
    const moveButton = screen.getByText('[Move] ▼')
    fireEvent.click(moveButton)
    
    // Click on Sent folder
    await waitFor(() => {
      const sentOption = screen.getByText('Sent')
      fireEvent.click(sentOption)
    })
    
    // Confirm move
    await waitFor(() => {
      const confirmButton = screen.getByText('[Move]')
      fireEvent.click(confirmButton)
    })
    
    await waitFor(() => {
      expect(mockEmailService.moveEmail).toHaveBeenCalledWith('test-email-1', 'sent')
      expect(defaultProps.onEmailMove).toHaveBeenCalledWith('test-email-1', 'sent')
    })
  })

  it('shows permanent delete confirmation for emails in trash', async () => {
    const trashEmail = { ...mockEmail, folderId: 'trash' }
    render(<EmailActions {...defaultProps} email={trashEmail} />)
    
    const deleteButton = screen.getByText('[Delete]')
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Permanently Delete Email/)).toBeInTheDocument()
      expect(screen.getByText(/permanently deleted and cannot be recovered/)).toBeInTheDocument()
    })
  })
})