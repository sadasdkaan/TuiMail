import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailService } from '@/lib/email-service'
// EmailStateProvider not needed for basic testing
import { generateMockEmails } from '@/lib/mock-data'

// Mock email service for testing
export const createMockEmailService = (): jest.Mocked<EmailService> => {
  const mockEmails = generateMockEmails().slice(0, 5)
  const mockFolders = [
    { id: 'inbox', name: 'Inbox', type: 'inbox' as const, emailCount: 5, unreadCount: 2 },
    { id: 'sent', name: 'Sent', type: 'sent' as const, emailCount: 3, unreadCount: 0 },
    { id: 'drafts', name: 'Drafts', type: 'drafts' as const, emailCount: 1, unreadCount: 0 },
    { id: 'trash', name: 'Trash', type: 'trash' as const, emailCount: 0, unreadCount: 0 }
  ]

  const mockService = {
    getEmails: jest.fn().mockResolvedValue(mockEmails),
    getFolders: jest.fn().mockResolvedValue(mockFolders),
    getEmail: jest.fn().mockImplementation(async (id: string) => 
      mockEmails.find(email => email.id === id) || null
    ),
    sendEmail: jest.fn().mockResolvedValue(undefined),
    deleteEmail: jest.fn().mockResolvedValue(undefined),
    markAsRead: jest.fn().mockResolvedValue(undefined),
    moveEmail: jest.fn().mockResolvedValue(undefined),
    saveDraft: jest.fn().mockResolvedValue(undefined),
    searchEmails: jest.fn().mockResolvedValue([]),
    toggleFlag: jest.fn().mockResolvedValue(undefined),
    getEmailStats: jest.fn().mockResolvedValue({
      totalEmails: 5,
      unreadEmails: 2,
      flaggedEmails: 1,
      todayEmails: 3
    }),
    getRecentActivity: jest.fn().mockResolvedValue([])
  } as any

  return mockService
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  emailService?: jest.Mocked<EmailService>
  initialState?: any
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { emailService = createMockEmailService(), ...renderOptions } = options

  // Simple wrapper without EmailStateProvider for now
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>
  }

  return {
    user: userEvent.setup(),
    emailService,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Keyboard event helpers
export const createKeyboardEvent = (key: string, options: Partial<KeyboardEvent> = {}) => {
  return new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options
  })
}

export const simulateKeyPress = (element: Element | Document, key: string, options?: Partial<KeyboardEvent>) => {
  const event = createKeyboardEvent(key, options)
  element.dispatchEvent(event)
  return event
}

// Accessibility testing helpers
export const getByAriaLabel = (container: HTMLElement, label: string) => {
  return container.querySelector(`[aria-label="${label}"]`)
}

export const getAllByAriaLabel = (container: HTMLElement, label: string) => {
  return Array.from(container.querySelectorAll(`[aria-label="${label}"]`))
}

export const hasAriaAttribute = (element: Element, attribute: string, value?: string) => {
  const attrValue = element.getAttribute(attribute)
  if (value === undefined) {
    return attrValue !== null
  }
  return attrValue === value
}

// Focus management helpers
export const getFocusedElement = () => document.activeElement

export const isFocusable = (element: Element) => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ]
  
  return focusableSelectors.some(selector => element.matches(selector))
}

export const getAllFocusableElements = (container: HTMLElement) => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')
  
  return Array.from(container.querySelectorAll(focusableSelectors))
}

// Email testing helpers
export const createMockEmail = (overrides = {}) => {
  return {
    id: 'test-email-1',
    from: 'test@example.com',
    to: ['recipient@example.com'],
    subject: 'Test Email Subject',
    body: 'This is a test email body.',
    date: new Date(),
    isRead: false,
    isFlagged: false,
    hasAttachments: false,
    folderId: 'inbox',
    ...overrides
  }
}

export const createMockFolder = (overrides = {}) => {
  return {
    id: 'test-folder',
    name: 'Test Folder',
    type: 'inbox' as const,
    emailCount: 0,
    unreadCount: 0,
    ...overrides
  }
}

// Wait helpers for async operations
export const waitForLoadingToFinish = async () => {
  const { waitFor } = await import('@testing-library/react')
  await waitFor(() => {
    const loadingElements = document.querySelectorAll('[aria-label*="loading"], [role="status"]')
    expect(loadingElements).toHaveLength(0)
  }, { timeout: 5000 })
}

export const waitForErrorToAppear = async (errorText?: string) => {
  const { waitFor, screen } = await import('@testing-library/react')
  await waitFor(() => {
    const errorElement = errorText 
      ? screen.getByText(new RegExp(errorText, 'i'))
      : screen.getByRole('alert')
    expect(errorElement).toBeInTheDocument()
  })
}

// Mock implementations for common hooks
export const mockUseResponsive = (overrides = {}) => {
  return {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    ...overrides
  }
}

export const mockUseKeyboardNav = (overrides = {}) => {
  return {
    currentIndex: 0,
    setCurrentIndex: jest.fn(),
    handleKeyDown: jest.fn(),
    ...overrides
  }
}

// Performance testing helpers
export const measurePerformance = async (fn: () => Promise<void> | void) => {
  const start = performance.now()
  await fn()
  const end = performance.now()
  return end - start
}

export const expectPerformance = (duration: number, maxDuration: number) => {
  expect(duration).toBeLessThan(maxDuration)
}

// Snapshot testing helpers
export const createSnapshot = (component: ReactElement, options?: CustomRenderOptions) => {
  const { container } = renderWithProviders(component, options)
  return container.firstChild
}

// Error boundary testing helpers
export const ThrowError = ({ shouldThrow = false, message = 'Test error' }: { 
  shouldThrow?: boolean
  message?: string 
}) => {
  if (shouldThrow) {
    throw new Error(message)
  }
  return <div>No error</div>
}

// Console suppression for error boundary tests
export const suppressConsoleError = () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })
}

// Local storage mocking
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  })

  return localStorageMock
}

// Media query mocking
export const mockMediaQuery = (query: string, matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(q => ({
      matches: q === query ? matches : false,
      media: q,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Cleanup helpers
export const cleanupAfterEach = () => {
  afterEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })
}

export const cleanupAfterAll = () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })
}

// Re-export commonly used testing utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Add a dummy test to prevent Jest from complaining about no tests
describe('test-utils', () => {
  it('should export testing utilities', () => {
    expect(typeof renderWithProviders).toBe('function')
    expect(typeof createMockEmailService).toBe('function')
  })
})