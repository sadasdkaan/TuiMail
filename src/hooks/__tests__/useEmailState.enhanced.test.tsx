import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useEmailState } from '../useEmailState'
import { generateMockEmails } from '@/lib/mock-data'
import { EmailService } from '@/lib/email-service'

// Mock the email service
jest.mock('@/lib/email-service')
const MockedEmailService = EmailService as jest.MockedClass<typeof EmailService>

describe('useEmailState Enhanced Tests', () => {
  let mockEmailService: jest.Mocked<EmailService>
  const mockEmails = generateMockEmails().slice(0, 5)

  beforeEach(() => {
    jest.clearAllMocks()
    mockEmailService = new MockedEmailService() as jest.Mocked<EmailService>
    
    mockEmailService.getEmails.mockResolvedValue(mockEmails)
    mockEmailService.getEmail.mockImplementation(async (id) => 
      mockEmails.find(email => email.id === id) || null
    )
    mockEmailService.sendEmail.mockResolvedValue({ success: true })
    mockEmailService.deleteEmail.mockResolvedValue({ success: true })
    mockEmailService.markAsRead.mockResolvedValue({ success: true })
    mockEmailService.searchEmails.mockResolvedValue([])
    
    // Clear localStorage before each test
    localStorage.clear()
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )

  describe('Initial State', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper: TestWrapper })

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

    it('should load initial data on mount', async () => {
      const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper: TestWrapper })

      // Wait for initial load to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      expect(result.current.state.emails).toEqual(mockEmails)
      expect(mockEmailService.getEmails).toHaveBeenCalledWith('inbox')
    })
  })

  describe('Email Selection', () => {
    it('should select and deselect emails', async () => {
      const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper: TestWrapper })

      // Wait for initial load to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      // Select email
      act(() => {
        result.current.actions.selectEmail(mockEmails[0])
      })

      expect(result.current.state.selectedEmail).toEqual(mockEmails[0])

      // Deselect email
      act(() => {
        result.current.actions.selectEmail(null)
      })

      expect(result.current.state.selectedEmail).toBeNull()
    })
  })

  describe('Compose Mode', () => {
    it('should toggle compose mode', async () => {
      const { result } = renderHook(() => useEmailState(mockEmailService), { wrapper: TestWrapper })

      // Wait for initial load to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      // Start composing
      act(() => {
        result.current.actions.startCompose()
      })

      expect(result.current.state.isComposing).toBe(true)

      // Stop composing
      act(() => {
        result.current.actions.cancelCompose()
      })

      expect(result.current.state.isComposing).toBe(false)
    })
  })
})