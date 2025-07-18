import { useState, useCallback, useEffect, useRef } from 'react'

export interface ListNavigationOptions {
  itemCount: number
  onSelect?: (index: number) => void
  onCancel?: () => void
  enabled?: boolean
  loop?: boolean // Whether to loop from end to beginning
  initialIndex?: number
}

export interface ListNavigation {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  selectNext: () => void
  selectPrevious: () => void
  selectFirst: () => void
  selectLast: () => void
  handleSelect: () => void
  handleCancel: () => void
  isSelected: (index: number) => boolean
}

export function useListNavigation({
  itemCount,
  onSelect,
  onCancel,
  enabled = true,
  loop = false,
  initialIndex = 0
}: ListNavigationOptions): ListNavigation {
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(initialIndex, Math.max(0, itemCount - 1))
  )
  const enabledRef = useRef(enabled)

  // Update enabled ref when prop changes
  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  // Reset selected index when item count changes
  useEffect(() => {
    if (itemCount === 0) {
      setSelectedIndex(-1)
    } else if (selectedIndex >= itemCount) {
      setSelectedIndex(Math.max(0, itemCount - 1))
    } else if (selectedIndex < 0 && itemCount > 0) {
      setSelectedIndex(0)
    }
  }, [itemCount, selectedIndex])

  const selectNext = useCallback(() => {
    if (itemCount === 0) return

    setSelectedIndex(current => {
      if (current >= itemCount - 1) {
        return loop ? 0 : current
      }
      return current + 1
    })
  }, [itemCount, loop])

  const selectPrevious = useCallback(() => {
    if (itemCount === 0) return

    setSelectedIndex(current => {
      if (current <= 0) {
        return loop ? itemCount - 1 : current
      }
      return current - 1
    })
  }, [itemCount, loop])

  const selectFirst = useCallback(() => {
    if (itemCount > 0) {
      setSelectedIndex(0)
    }
  }, [itemCount])

  const selectLast = useCallback(() => {
    if (itemCount > 0) {
      setSelectedIndex(itemCount - 1)
    }
  }, [itemCount])

  const handleSelect = useCallback(() => {
    if (selectedIndex >= 0 && selectedIndex < itemCount) {
      onSelect?.(selectedIndex)
    }
  }, [selectedIndex, itemCount, onSelect])

  const handleCancel = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  const isSelected = useCallback(
    (index: number) => index === selectedIndex,
    [selectedIndex]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabledRef.current || itemCount === 0) return

      const { key, ctrlKey, metaKey, altKey } = event

      // Ignore if modifier keys are pressed
      if (ctrlKey || metaKey || altKey) return

      let handled = false

      switch (key) {
        case 'ArrowUp':
        case 'k':
        case 'K':
          selectPrevious()
          handled = true
          break
        case 'ArrowDown':
        case 'j':
        case 'J':
          selectNext()
          handled = true
          break
        case 'Home':
        case 'g':
          if (event.shiftKey) break // Allow Shift+G for end
          selectFirst()
          handled = true
          break
        case 'End':
        case 'G':
          selectLast()
          handled = true
          break
        case 'Enter':
        case ' ': // Space bar
          handleSelect()
          handled = true
          break
        case 'Escape':
          handleCancel()
          handled = true
          break
      }

      if (handled) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [
      itemCount,
      selectNext,
      selectPrevious,
      selectFirst,
      selectLast,
      handleSelect,
      handleCancel
    ]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  return {
    selectedIndex,
    setSelectedIndex,
    selectNext,
    selectPrevious,
    selectFirst,
    selectLast,
    handleSelect,
    handleCancel,
    isSelected
  }
}