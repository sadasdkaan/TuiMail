'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { asciiArt } from '@/lib/mock-data'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: 'primary' | 'secondary'
}

interface NotificationState {
  notifications: Notification[]
}

type NotificationAction_Type = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }

const NotificationContext = createContext<{
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
} | null>(null)

function notificationReducer(state: NotificationState, action: NotificationAction_Type): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      }
    default:
      return state
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] })

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.persistent ? undefined : 5000)
    }

    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification })

    // Auto-remove non-persistent notifications
    if (!notification.persistent && fullNotification.duration) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
      }, fullNotification.duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }, [])

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications: state.notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const context = useContext(NotificationContext)
  if (!context) return null

  const { notifications, removeNotification } = context

  if (notifications.length === 0) return null

  return (
    <div className="notification-container fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onClose: () => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isExiting, setIsExiting] = React.useState(false)

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(onClose, 200) // Match animation duration
  }, [onClose])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const typeConfig = {
    success: {
      icon: '✓',
      className: 'border-terminal-success text-terminal-success bg-terminal-bg'
    },
    error: {
      icon: '✗',
      className: 'border-terminal-error text-terminal-error bg-terminal-bg'
    },
    warning: {
      icon: '⚠',
      className: 'border-terminal-warning text-terminal-warning bg-terminal-bg'
    },
    info: {
      icon: 'ℹ',
      className: 'border-terminal-info text-terminal-info bg-terminal-bg'
    }
  }

  const config = typeConfig[notification.type]

  return (
    <div
      className={`
        notification-item terminal-border p-3 font-mono text-sm
        transform transition-all duration-200 ease-in-out
        ${config.className}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <span className="notification-icon text-lg flex-shrink-0" aria-hidden="true">
          {config.icon}
        </span>
        
        <div className="notification-content flex-1 min-w-0">
          <div className="notification-title font-bold text-sm mb-1">
            {notification.title}
          </div>
          <div className="notification-message text-xs terminal-dim">
            {notification.message}
          </div>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="notification-actions flex gap-2 mt-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action()
                    handleClose()
                  }}
                  className={`
                    text-xs px-2 py-1 border transition-colors
                    ${action.variant === 'primary' 
                      ? 'border-current hover:bg-current hover:text-terminal-bg' 
                      : 'border-terminal-dim hover:border-current'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="notification-close text-terminal-dim hover:text-current text-lg leading-none flex-shrink-0"
          aria-label="Close notification"
          title="Close (Escape)"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// Hook for using notifications
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Convenience hooks for different notification types
export function useNotificationHelpers() {
  const { addNotification } = useNotifications()

  const showSuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options })
  }, [addNotification])

  const showError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, persistent: true, ...options })
  }, [addNotification])

  const showWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }, [addNotification])

  const showInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options })
  }, [addNotification])

  const showEmailOperationResult = useCallback((
    operation: string,
    success: boolean,
    message?: string
  ) => {
    if (success) {
      showSuccess(
        `${operation} successful`,
        message || `${operation} completed successfully`
      )
    } else {
      showError(
        `${operation} failed`,
        message || `Failed to ${operation.toLowerCase()}. Please try again.`,
        {
          actions: [
            {
              label: 'Retry',
              action: () => {
                // This would be handled by the calling component
                console.log('Retry action triggered')
              },
              variant: 'primary'
            }
          ]
        }
      )
    }
  }, [showSuccess, showError])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showEmailOperationResult
  }
}

export { NotificationProvider as NotificationSystem }