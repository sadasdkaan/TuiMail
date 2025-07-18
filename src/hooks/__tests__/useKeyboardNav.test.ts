import { renderHook, act } from '@testing-library/react'
import { useKeyboardNav } from '../useKeyboardNav'

// Mock keyboard events
const createKeyboardEvent = (key: string, options: Partial<KeyboardEvent> = {}) => {
  return new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options
  })
}

describe('useKeyboardNav', () => {
  let mockCallbacks: {
    onArrowUp: jest.Mock
    onArrowDown: jest.Mock
    onArrowLeft: jest.Mock
    onArrowRight: jest.Mock
    onEnter: jest.Mock
    onEscape: jest.Mock
    onVimUp: jest.Mock
    onVimDown: jest.Mock
  }

  beforeEach(() => {
    mockCallbacks = {
      onArrowUp: jest.fn(),
      onArrowDown: jest.fn(),
      onArrowLeft: jest.fn(),
      onArrowRight: jest.fn(),
      onEnter: jest.fn(),
      onEscape: jest.fn(),
      onVimUp: jest.fn(),
      onVimDown: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle arrow key navigation', () => {
    renderHook(() => useKeyboardNav(mockCallbacks, 5))

    // Test arrow up
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowUp'))
    })
    expect(mockCallbacks.onArrowUp).toHaveBeenCalledTimes(1)

    // Test arrow down
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowDown'))
    })
    expect(mockCallbacks.onArrowDown).toHaveBeenCalledTimes(1)

    // Test arrow left
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowLeft'))
    })
    expect(mockCallbacks.onArrowLeft).toHaveBeenCalledTimes(1)

    // Test arrow right
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowRight'))
    })
    expect(mockCallbacks.onArrowRight).toHaveBeenCalledTimes(1)
  })

  it('should handle vim-style navigation', () => {
    renderHook(() => useKeyboardNav(mockCallbacks, 5))

    // Test j key (down)
    act(() => {
      document.dispatchEvent(createKeyboardEvent('j'))
    })
    expect(mockCallbacks.onArrowDown).toHaveBeenCalledTimes(1)
    expect(mockCallbacks.onVimDown).toHaveBeenCalledTimes(1)

    // Test k key (up)
    act(() => {
      document.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(mockCallbacks.onArrowUp).toHaveBeenCalledTimes(1)
    expect(mockCallbacks.onVimUp).toHaveBeenCalledTimes(1)
  })

  it('should handle action keys', () => {
    renderHook(() => useKeyboardNav(mockCallbacks, 5))

    // Test Enter key
    act(() => {
      document.dispatchEvent(createKeyboardEvent('Enter'))
    })
    expect(mockCallbacks.onEnter).toHaveBeenCalledTimes(1)

    // Test Escape key
    act(() => {
      document.dispatchEvent(createKeyboardEvent('Escape'))
    })
    expect(mockCallbacks.onEscape).toHaveBeenCalledTimes(1)
  })

  it('should respect enabled flag', () => {
    renderHook(() => useKeyboardNav({ ...mockCallbacks, enabled: false }, 5))

    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowUp'))
    })
    expect(mockCallbacks.onArrowUp).not.toHaveBeenCalled()
  })

  it('should ignore modifier keys', () => {
    renderHook(() => useKeyboardNav(mockCallbacks, 5))

    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowUp', { ctrlKey: true }))
    })
    expect(mockCallbacks.onArrowUp).not.toHaveBeenCalled()

    act(() => {
      document.dispatchEvent(createKeyboardEvent('j', { metaKey: true }))
    })
    expect(mockCallbacks.onVimDown).not.toHaveBeenCalled()
  })

  it('should manage current index correctly', () => {
    const { result } = renderHook(() => useKeyboardNav(mockCallbacks, 5))

    expect(result.current.currentIndex).toBe(0)

    act(() => {
      result.current.setCurrentIndex(2)
    })
    expect(result.current.currentIndex).toBe(2)

    // Test bounds checking
    act(() => {
      result.current.setCurrentIndex(10)
    })
    expect(result.current.currentIndex).toBe(2) // Should not change

    act(() => {
      result.current.setCurrentIndex(-1)
    })
    expect(result.current.currentIndex).toBe(2) // Should not change
  })

  it('should clean up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => useKeyboardNav(mockCallbacks, 5))

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })
})