// Keyboard event utilities and constants

export const KEYBOARD_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace'
} as const

export const VIM_KEYS = {
  UP: 'k',
  DOWN: 'j',
  LEFT: 'h',
  RIGHT: 'l',
  FIRST: 'g',
  LAST: 'G'
} as const

export interface KeyboardEvent {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  preventDefault: () => void
  stopPropagation: () => void
}

export function isModifierPressed(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey
}

export function isNavigationKey(key: string): boolean {
  const navigationKeys = [
    KEYBOARD_KEYS.ARROW_UP,
    KEYBOARD_KEYS.ARROW_DOWN,
    KEYBOARD_KEYS.ARROW_LEFT,
    KEYBOARD_KEYS.ARROW_RIGHT,
    VIM_KEYS.UP,
    VIM_KEYS.DOWN,
    VIM_KEYS.LEFT,
    VIM_KEYS.RIGHT,
    KEYBOARD_KEYS.HOME,
    KEYBOARD_KEYS.END,
    KEYBOARD_KEYS.PAGE_UP,
    KEYBOARD_KEYS.PAGE_DOWN
  ] as string[]
  return navigationKeys.includes(key)
}

export function isActionKey(key: string): boolean {
  const actionKeys = [
    KEYBOARD_KEYS.ENTER,
    KEYBOARD_KEYS.SPACE,
    KEYBOARD_KEYS.ESCAPE,
    KEYBOARD_KEYS.DELETE,
    KEYBOARD_KEYS.BACKSPACE
  ] as string[]
  return actionKeys.includes(key)
}

export function buildShortcutString(event: KeyboardEvent): string {
  let shortcut = ''
  
  if (event.ctrlKey || event.metaKey) shortcut += 'ctrl+'
  if (event.shiftKey) shortcut += 'shift+'
  if (event.altKey) shortcut += 'alt+'
  
  shortcut += event.key.toLowerCase()
  
  return shortcut
}

export function createKeyboardHandler(
  handlers: Record<string, () => void>,
  options: {
    preventDefault?: boolean
    stopPropagation?: boolean
    enabled?: boolean
  } = {}
) {
  const { preventDefault = true, stopPropagation = true, enabled = true } = options

  return (event: KeyboardEvent) => {
    if (!enabled) return

    const shortcut = buildShortcutString(event)
    const handler = handlers[shortcut] || handlers[event.key]

    if (handler) {
      if (preventDefault) event.preventDefault()
      if (stopPropagation) event.stopPropagation()
      handler()
    }
  }
}

// Email client specific keyboard shortcuts
export const EMAIL_SHORTCUTS = {
  // Navigation
  INBOX: 'ctrl+1',
  SENT: 'ctrl+2',
  DRAFTS: 'ctrl+3',
  TRASH: 'ctrl+4',
  
  // Actions
  NEW_EMAIL: 'ctrl+n',
  REPLY: 'ctrl+r',
  REPLY_ALL: 'ctrl+shift+r',
  FORWARD: 'ctrl+f',
  DELETE: 'ctrl+d',
  ARCHIVE: 'ctrl+e',
  
  // Compose
  SEND: 'ctrl+enter',
  SAVE_DRAFT: 'ctrl+s',
  
  // General
  SEARCH: 'ctrl+k',
  HELP: 'ctrl+/',
  REFRESH: 'ctrl+shift+r',
  
  // Gmail-style
  GO_INBOX: 'g+i',
  GO_SENT: 'g+s',
  GO_DRAFTS: 'g+d',
  GO_TRASH: 'g+t'
} as const

export type EmailShortcut = typeof EMAIL_SHORTCUTS[keyof typeof EMAIL_SHORTCUTS]