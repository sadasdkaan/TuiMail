import { renderHook, act } from '@testing-library/react'
import { useListNavigation } from '../useListNavigation'

const createKeyboardEvent = (key: string, options: Partial<KeyboardEvent> = {}) => {
  return new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options
  })
}

describe('useListNavigation', () => {
  const mockOnSelect = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct selected index', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        initialIndex: 2
      })
    )

    expect(result.current.selectedIndex).toBe(2)
    expect(result.current.isSelected(2)).toBe(true)
    expect(result.current.isSelected(1)).toBe(false)
  })

  it('should handle navigation with arrow keys', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel
      })
    )

    expect(result.current.selectedIndex).toBe(0)

    // Move down
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowDown'))
    })
    expect(result.current.selectedIndex).toBe(1)

    // Move up
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowUp'))
    })
    expect(result.current.selectedIndex).toBe(0)
  })

  it('should handle vim-style navigation', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel
      })
    )

    // Move down with j
    act(() => {
      document.dispatchEvent(createKeyboardEvent('j'))
    })
    expect(result.current.selectedIndex).toBe(1)

    // Move up with k
    act(() => {
      document.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(result.current.selectedIndex).toBe(0)
  })

  it('should handle boundary conditions without loop', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 3,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        loop: false
      })
    )

    // Try to move up from first item
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowUp'))
    })
    expect(result.current.selectedIndex).toBe(0) // Should stay at 0

    // Move to last item
    act(() => {
      result.current.setSelectedIndex(2)
    })
    expect(result.current.selectedIndex).toBe(2)

    // Try to move down from last item
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowDown'))
    })
    expect(result.current.selectedIndex).toBe(2) // Should stay at 2
  })

  it('should handle boundary conditions with loop', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 3,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        loop: true
      })
    )

    // Move up from first item should go to last
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowUp'))
    })
    expect(result.current.selectedIndex).toBe(2)

    // Move down from last item should go to first
    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowDown'))
    })
    expect(result.current.selectedIndex).toBe(0)
  })

  it('should handle Home and End keys', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        initialIndex: 2
      })
    )

    expect(result.current.selectedIndex).toBe(2)

    // Go to first
    act(() => {
      document.dispatchEvent(createKeyboardEvent('Home'))
    })
    expect(result.current.selectedIndex).toBe(0)

    // Go to last
    act(() => {
      document.dispatchEvent(createKeyboardEvent('End'))
    })
    expect(result.current.selectedIndex).toBe(4)
  })

  it('should handle vim-style first/last navigation', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        initialIndex: 2
      })
    )

    // Go to first with g
    act(() => {
      document.dispatchEvent(createKeyboardEvent('g'))
    })
    expect(result.current.selectedIndex).toBe(0)

    // Go to last with G
    act(() => {
      document.dispatchEvent(createKeyboardEvent('G'))
    })
    expect(result.current.selectedIndex).toBe(4)
  })

  it('should call onSelect when Enter or Space is pressed', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        initialIndex: 2
      })
    )

    act(() => {
      document.dispatchEvent(createKeyboardEvent('Enter'))
    })
    expect(mockOnSelect).toHaveBeenCalledWith(2)

    act(() => {
      document.dispatchEvent(createKeyboardEvent(' '))
    })
    expect(mockOnSelect).toHaveBeenCalledWith(2)
    expect(mockOnSelect).toHaveBeenCalledTimes(2)
  })

  it('should call onCancel when Escape is pressed', () => {
    renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel
      })
    )

    act(() => {
      document.dispatchEvent(createKeyboardEvent('Escape'))
    })
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('should respect enabled flag', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 5,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel,
        enabled: false
      })
    )

    const initialIndex = result.current.selectedIndex

    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowDown'))
    })
    expect(result.current.selectedIndex).toBe(initialIndex)
    expect(mockOnSelect).not.toHaveBeenCalled()
  })

  it('should handle empty list', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        itemCount: 0,
        onSelect: mockOnSelect,
        onCancel: mockOnCancel
      })
    )

    expect(result.current.selectedIndex).toBe(-1)

    act(() => {
      document.dispatchEvent(createKeyboardEvent('ArrowDown'))
    })
    expect(result.current.selectedIndex).toBe(-1)

    act(() => {
      document.dispatchEvent(createKeyboardEvent('Enter'))
    })
    expect(mockOnSelect).not.toHaveBeenCalled()
  })

  it('should adjust selected index when item count changes', () => {
    const { result, rerender } = renderHook(
      ({ itemCount }) =>
        useListNavigation({
          itemCount,
          onSelect: mockOnSelect,
          onCancel: mockOnCancel,
          initialIndex: 4
        }),
      { initialProps: { itemCount: 5 } }
    )

    expect(result.current.selectedIndex).toBe(4)

    // Reduce item count
    rerender({ itemCount: 3 })
    expect(result.current.selectedIndex).toBe(2) // Should adjust to last valid index

    // Increase item count
    rerender({ itemCount: 10 })
    expect(result.current.selectedIndex).toBe(2) // Should stay the same
  })
})