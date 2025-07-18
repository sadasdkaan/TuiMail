import { useEffect, useCallback } from 'react'

export interface GlobalKeyboardShortcuts {
  // Navigation shortcuts
  'ctrl+1'?: () => void // Go to Inbox
  'ctrl+2'?: () => void // Go to Sent
  'ctrl+3'?: () => void // Go to Drafts
  'ctrl+4'?: () => void // Go to Trash
  
  // Email actions
  'ctrl+n'?: () => void // New email
  'ctrl+r'?: () => void // Reply
  'ctrl+shift+r'?: () => void // Reply all
  'ctrl+f'?: () => void // Forward
  'ctrl+d'?: () => void // Delete
  
  // Compose shortcuts
  'ctrl+enter'?: () => void // Send email
  'ctrl+s'?: () => void // Save draft
  
  // General shortcuts
  'ctrl+/'?: () => void // Show help
  'ctrl+k'?: () => void // Quick search
  'escape'?: () => void // Cancel/close
  
  // Navigation
  'g+i'?: () => void // Go to inbox (Gmail style)
  'g+s'?: () => void // Go to sent (Gmail style)
  'g+d'?: () => void // Go to drafts (Gmail style)
  'g+t'?: () => void // Go to trash (Gmail style)
}

export function useGlobalKeyboard(shortcuts: GlobalKeyboardShortcuts = {}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event
      
      // Use metaKey for Mac, ctrlKey for others
      const cmdOrCtrl = metaKey || ctrlKey
      
      // Build shortcut string
      let shortcut = ''
      if (cmdOrCtrl) shortcut += 'ctrl+'
      if (shiftKey) shortcut += 'shift+'
      if (altKey) shortcut += 'alt+'
      shortcut += key.toLowerCase()
      
      // Handle Gmail-style shortcuts (g+key combinations)
      if (key === 'g' && !cmdOrCtrl && !shiftKey && !altKey) {
        // Set a flag to listen for the next key
        const handleGShortcut = (nextEvent: KeyboardEvent) => {
          const gShortcut = `g+${nextEvent.key.toLowerCase()}`
          const handler = shortcuts[gShortcut as keyof GlobalKeyboardShortcuts]
          
          if (handler) {
            nextEvent.preventDefault()
            nextEvent.stopPropagation()
            handler()
          }
          
          document.removeEventListener('keydown', handleGShortcut)
        }
        
        document.addEventListener('keydown', handleGShortcut)
        
        // Remove listener after 2 seconds if no second key is pressed
        setTimeout(() => {
          document.removeEventListener('keydown', handleGShortcut)
        }, 2000)
        
        return
      }
      
      const handler = shortcuts[shortcut as keyof GlobalKeyboardShortcuts]
      
      if (handler) {
        event.preventDefault()
        event.stopPropagation()
        handler()
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}