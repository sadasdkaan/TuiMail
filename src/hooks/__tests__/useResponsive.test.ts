import { renderHook, act } from '@testing-library/react'
import { useResponsive, useSidebarCollapse, useTouchFriendly, useResponsiveLayout } from '../useResponsive'

// Mock window.innerWidth and window.innerHeight
const mockWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

// Mock window.addEventListener and removeEventListener
const mockEventListeners: { [key: string]: EventListener[] } = {}
const mockAddEventListener = jest.fn((event: string, listener: EventListener) => {
  if (!mockEventListeners[event]) {
    mockEventListeners[event] = []
  }
  mockEventListeners[event].push(listener)
})
const mockRemoveEventListener = jest.fn((event: string, listener: EventListener) => {
  if (mockEventListeners[event]) {
    const index = mockEventListeners[event].indexOf(listener)
    if (index > -1) {
      mockEventListeners[event].splice(index, 1)
    }
  }
})

// Helper to trigger resize event
const triggerResize = () => {
  if (mockEventListeners.resize) {
    mockEventListeners.resize.forEach(listener => {
      listener(new Event('resize'))
    })
  }
}

describe('useResponsive', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(mockEventListeners).forEach(key => {
      mockEventListeners[key] = []
    })
    
    // Mock window methods
    window.addEventListener = mockAddEventListener as any
    window.removeEventListener = mockRemoveEventListener as any
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('useResponsive hook', () => {
    it('should detect mobile breakpoint correctly', () => {
      mockWindowSize(400, 800)
      
      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.isMobile).toBe(true)
      expect(result.current.isTablet).toBe(false)
      expect(result.current.isDesktop).toBe(false)
      expect(result.current.currentBreakpoint).toBe('mobile')
    })

    it('should detect tablet breakpoint correctly', () => {
      mockWindowSize(600, 800)
      
      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(true)
      expect(result.current.isDesktop).toBe(false)
      expect(result.current.currentBreakpoint).toBe('tablet')
    })

    it('should detect desktop breakpoint correctly', () => {
      mockWindowSize(900, 800)
      
      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(false)
      expect(result.current.isDesktop).toBe(true)
      expect(result.current.currentBreakpoint).toBe('desktop')
    })

    it('should detect wide breakpoint correctly', () => {
      mockWindowSize(1300, 800)
      
      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(false)
      expect(result.current.isDesktop).toBe(false)
      expect(result.current.isWide).toBe(true)
      expect(result.current.currentBreakpoint).toBe('wide')
    })

    it('should update breakpoint on window resize', () => {
      mockWindowSize(400, 800)
      
      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.currentBreakpoint).toBe('mobile')
      
      // Change window size and trigger resize
      mockWindowSize(900, 800)
      act(() => {
        triggerResize()
      })
      
      expect(result.current.currentBreakpoint).toBe('desktop')
    })

    it('should provide utility functions', () => {
      mockWindowSize(900, 800)
      
      const { result } = renderHook(() => useResponsive())
      
      expect(result.current.isAtLeast('tablet')).toBe(true)
      expect(result.current.isAtMost('desktop')).toBe(true)
      expect(result.current.isBetween('tablet', 'wide')).toBe(true)
    })
  })

  describe('useSidebarCollapse hook', () => {
    it('should auto-collapse on mobile', () => {
      mockWindowSize(400, 800)
      
      const { result } = renderHook(() => useSidebarCollapse())
      
      expect(result.current.isCollapsed).toBe(true)
      expect(result.current.isMobile).toBe(true)
    })

    it('should not auto-collapse on desktop', () => {
      mockWindowSize(1000, 800)
      
      const { result } = renderHook(() => useSidebarCollapse())
      
      expect(result.current.isCollapsed).toBe(false)
      expect(result.current.isMobile).toBe(false)
    })

    it('should provide toggle functionality', () => {
      mockWindowSize(1000, 800)
      
      const { result } = renderHook(() => useSidebarCollapse())
      
      expect(result.current.isCollapsed).toBe(false)
      
      act(() => {
        result.current.toggleCollapse()
      })
      
      expect(result.current.isCollapsed).toBe(true)
    })
  })

  describe('useTouchFriendly hook', () => {
    it('should detect touch capability', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: null,
      })
      
      const { result } = renderHook(() => useTouchFriendly())
      
      expect(result.current.isTouchDevice).toBe(true)
      expect(result.current.minTouchTarget).toBe(44)
    })

    it('should provide appropriate spacing for touch devices', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: null,
      })
      
      const { result } = renderHook(() => useTouchFriendly())
      
      expect(result.current.touchSpacing).toBe('0.75rem')
    })
  })

  describe('useResponsiveLayout hook', () => {
    it('should determine mobile layout correctly', () => {
      mockWindowSize(400, 800)
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: null,
      })
      
      const { result } = renderHook(() => useResponsiveLayout())
      
      expect(result.current.shouldUseMobileLayout).toBe(true)
    })

    it('should provide responsive styling functions', () => {
      mockWindowSize(400, 800)
      
      const { result } = renderHook(() => useResponsiveLayout())
      
      expect(result.current.getResponsivePadding(16)).toBe('12px')
      expect(result.current.getResponsiveMargin(8)).toBe('4px')
      expect(result.current.getResponsiveTransition()).toBe('0.2s')
    })

    it('should adjust styling for desktop', () => {
      mockWindowSize(1000, 800)
      
      const { result } = renderHook(() => useResponsiveLayout())
      
      expect(result.current.getResponsivePadding(16)).toBe('16px')
      expect(result.current.getResponsiveMargin(8)).toBe('8px')
      expect(result.current.getResponsiveTransition()).toBe('0.15s')
    })
  })
})