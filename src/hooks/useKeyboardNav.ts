import { useEffect, useCallback, useState } from 'react'

export interface KeyboardNavOptions {
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onEscape?: () => void
  onVimUp?: () => void // k key
  onVimDown?: () => void // j key
  enabled?: boolean
  preventDefault?: boolean
}

export interface KeyboardNavigation {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  moveUp: () => void
  moveDown: () => void
  moveLeft: () => void
  moveRight: () => void
  select: () => void
  cancel: () => void
}

export function useKeyboardNav(
  options: KeyboardNavOptions = {},
  itemCount: number = 0
): KeyboardNavigation {
  const {
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onVimUp,
    onVimDown,
    enabled = true,
    preventDefault = true
  } = options

  const [currentIndex, setCurrentIndexState] = useState(0)

  // Reset index when item count changes
  useEffect(() => {
    if (itemCount === 0) {
      setCurrentIndexState(0)
    } else if (currentIndex >= itemCount) {
      setCurrentIndexState(Math.max(0, itemCount - 1))
    }
  }, [itemCount, currentIndex])

  const moveUp = useCallback(() => {
    if (itemCount > 0) {
      setCurrentIndexState(prev => Math.max(0, prev - 1))
      onArrowUp?.()
      onVimUp?.()
    }
  }, [itemCount, onArrowUp, onVimUp])

  const moveDown = useCallback(() => {
    if (itemCount > 0) {
      setCurrentIndexState(prev => Math.min(itemCount - 1, prev + 1))
      onArrowDown?.()
      onVimDown?.()
    }
  }, [itemCount, onArrowDown, onVimDown])

  const moveLeft = useCallback(() => {
    onArrowLeft?.()
  }, [onArrowLeft])

  const moveRight = useCallback(() => {
    onArrowRight?.()
  }, [onArrowRight])

  const select = useCallback(() => {
    onEnter?.()
  }, [onEnter])

  const cancel = useCallback(() => {
    onEscape?.()
  }, [onEscape])

  const setCurrentIndex = useCallback((index: number) => {
    if (index >= 0 && index < itemCount) {
      setCurrentIndexState(index)
    }
  }, [itemCount])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      const { key, ctrlKey, metaKey, altKey } = event

      // Ignore if modifier keys are pressed (except for specific shortcuts)
      if (ctrlKey || metaKey || altKey) return

      let handled = false

      switch (key) {
        case 'ArrowUp':
          moveUp()
          handled = true
          break
        case 'ArrowDown':
          moveDown()
          handled = true
          break
        case 'ArrowLeft':
          moveLeft()
          handled = true
          break
        case 'ArrowRight':
          moveRight()
          handled = true
          break
        case 'k':
        case 'K':
          moveUp()
          handled = true
          break
        case 'j':
        case 'J':
          moveDown()
          handled = true
          break
        case 'Enter':
          select()
          handled = true
          break
        case 'Escape':
          cancel()
          handled = true
          break
      }

      if (handled && preventDefault) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [
      enabled,
      preventDefault,
      moveUp,
      moveDown,
      moveLeft,
      moveRight,
      select,
      cancel
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
    currentIndex,
    setCurrentIndex,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    select,
    cancel
  }
}