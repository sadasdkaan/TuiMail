/**
 * Unit tests for email state management hook
 */

import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { useEmailState } from '../useEmailState'
import { Email } from '@/lib/types'
import { EmailService } from '@/lib/email-service'

// Mock the email service
jest.mock('@/lib/email-service')
const MockedEmailService = EmailService as jest.MockedClass<typeof EmailService>

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
)

// Mock email data
const mockEmail: Email = {
  id: 'test-email-1',
  from: 'sender@example.com',
  to: ['recipient@example.com'],
  subject: 'Test Email',
  body: 'This is a test email body',
  date: new Date('2024-01-01'),
  isRead: false,
  isFlagged: false,
  hasAttachments: false,
  folderId: 'inbox',
  attachments: [],
}

const mockEmails: Email[] = [
  mockEmail,
  {
    ...mockEmail,
    id: 'test-email-2',
    subject: 'Second Test Email',
    isRead: true,
  },
]

describe('useEmailState', () => {
  let mockEmailService: jest.Mocked<EmailService>

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    
    mockEmailService = new MockedEmailService() as jest.Mocked<EmailService>
    mockEmailService.getEmails.mockResolvedValue(mockEmails)
    mockEmailService.sendEmail.mockResolvedValue({ success: true })
    mockEmailService.deleteEmail.mockResolvedValue({ success: true })
    mockEmailService.markAsRead.mockResolvedValue({ success: true })
    mockEmailService.searchEmails.mockResolvedValue([])
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    expect(result.current.state.currentFolder).toBe('inbox')
    expect(result.current.state.selectedEmail).toBeNull()
    expect(result.current.state.emails).toEqual([])
    expect(result.current.state.isComposing).toBe(false)
    expect(result.current.state.searchQuery).toBe('')
    expect(result.current.state.loading).toBe(true) // Initially loading
    expect(result.current.state.error).toBeNull()

    // Wait for initial load to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(result.current.state.loading).toBe(false)
    expect(result.current.state.emails).toEqual(mockEmails)
  })

  it('should load persisted state from localStorage', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      switch (key) {
        case 'emailClient.currentFolder':
          return 'sent'
        default:
          return null
      }
    })

    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    expect(result.current.state.currentFolder).toBe('sent')
  })

  it('should set folder and clear selection', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // Select an email first
    act(() => {
      result.current.actions.selectEmail(mockEmails[0])
    })

    expect(result.current.state.selectedEmail).toEqual(mockEmails[0])

    // Change folder
    act(() => {
      result.current.actions.setCurrentFolder('sent')
    })

    expect(result.current.state.currentFolder).toBe('sent')
    expect(result.current.state.selectedEmail).toBeNull()
    expect(result.current.state.searchQuery).toBe('')
  })

  it('should select and deselect emails', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    act(() => {
      result.current.actions.selectEmail(mockEmails[0])
    })

    expect(result.current.state.selectedEmail).toEqual(mockEmails[0])
    expect(result.current.state.isComposing).toBe(false)

    act(() => {
      result.current.actions.selectEmail(null)
    })

    expect(result.current.state.selectedEmail).toBeNull()
  })

  it('should delete emails', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await act(async () => {
      await result.current.actions.deleteEmail('test-email-1')
    })

    expect(mockEmailService.deleteEmail).toHaveBeenCalledWith('test-email-1')
  })

  it('should toggle compose mode', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    act(() => {
      result.current.actions.startCompose()
    })

    expect(result.current.state.isComposing).toBe(true)

    act(() => {
      result.current.actions.cancelCompose()
    })

    expect(result.current.state.isComposing).toBe(false)
  })

  it('should handle search queries', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await act(async () => {
      await result.current.actions.searchEmails('test query')
    })

    expect(result.current.state.searchQuery).toBe('test query')
    expect(mockEmailService.searchEmails).toHaveBeenCalledWith('test query')
  })

  it('should handle loading states', async () => {
    // Make the service call take some time
    mockEmailService.getEmails.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockEmails), 100))
    )

    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Should be loading initially
    expect(result.current.state.loading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })

    // Should not be loading after completion
    expect(result.current.state.loading).toBe(false)
  })

  it('should handle error states', async () => {
    mockEmailService.getEmails.mockRejectedValue(new Error('Test error'))

    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load to complete (with error)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(result.current.state.error).toBe('Test error')
    expect(result.current.state.loading).toBe(false)

    act(() => {
      result.current.actions.clearError()
    })

    expect(result.current.state.error).toBeNull()
  })

  it('should mark emails as read/unread', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await act(async () => {
      await result.current.actions.markAsRead('test-email-1')
    })

    expect(mockEmailService.markAsRead).toHaveBeenCalledWith('test-email-1', true)

    await act(async () => {
      await result.current.actions.markAsUnread('test-email-1')
    })

    expect(mockEmailService.markAsRead).toHaveBeenCalledWith('test-email-1', false)
  })

  it('should send emails', async () => {
    const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // Start composing
    act(() => {
      result.current.actions.startCompose()
    })

    // Update compose data
    act(() => {
      result.current.actions.updateComposeData({
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body'
      })
    })

    await act(async () => {
      await result.current.actions.sendEmail()
    })

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body'
    })
    expect(result.current.state.isComposing).toBe(false)
  })

  it('should work without email service', () => {
    const { result } = renderHook(() => useEmailState(), { wrapper })

    expect(result.current.state.currentFolder).toBe('inbox')
    expect(result.current.state.selectedEmail).toBeNull()
    expect(result.current.state.emails).toEqual([])
    expect(result.current.state.isComposing).toBe(false)
    expect(result.current.state.searchQuery).toBe('')
    expect(result.current.state.loading).toBe(false)
    expect(result.current.state.error).toBeNull()
  })
})