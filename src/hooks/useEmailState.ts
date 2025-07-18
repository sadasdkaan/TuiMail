import { useState, useEffect, useCallback } from 'react'
import { Email } from '../lib/types'
import { EmailService } from '../lib/email-service'

export interface EmailClientState {
  emails: Email[]
  selectedEmail: Email | null
  currentFolder: string
  loading: boolean
  error: string | null
  searchQuery: string
  searchResults: Email[]
  isComposing: boolean
  composeData: {
    to: string
    subject: string
    body: string
    isDraft: boolean
  }
}

export interface EmailActions {
  selectEmail: (email: Email | null) => void
  setCurrentFolder: (folder: string) => void
  searchEmails: (query: string) => void
  clearSearch: () => void
  startCompose: () => void
  cancelCompose: () => void
  updateComposeData: (data: Partial<EmailClientState['composeData']>) => void
  sendEmail: () => Promise<void>
  deleteEmail: (emailId: string) => Promise<void>
  markAsRead: (emailId: string) => Promise<void>
  markAsUnread: (emailId: string) => Promise<void>
  refreshEmails: () => Promise<void>
  clearError: () => void
}

const initialState: EmailClientState = {
  emails: [],
  selectedEmail: null,
  currentFolder: 'inbox',
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
  isComposing: false,
  composeData: {
    to: '',
    subject: '',
    body: '',
    isDraft: false
  }
}

export function useEmailState(emailService?: EmailService): { state: EmailClientState; actions: EmailActions } {
  const [state, setState] = useState<EmailClientState>(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      // Restore from localStorage if available
      const savedFolder = localStorage.getItem('emailClient.currentFolder')
      if (savedFolder) {
        return {
          ...initialState,
          currentFolder: savedFolder
        }
      }
    }
    
    return initialState
  })

  const loadEmails = useCallback(async (folder: string) => {
    if (!emailService) return

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const emails = await emailService.getEmails(folder)
      setState(prev => ({ 
        ...prev, 
        emails, 
        loading: false,
        // Clear selected email if it's not in the new folder
        selectedEmail: prev.selectedEmail && emails.find(e => e.id === prev.selectedEmail?.id) 
          ? prev.selectedEmail 
          : null
      }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load emails' 
      }))
    }
  }, [emailService])

  // Load emails when folder changes
  useEffect(() => {
    if (emailService) {
      loadEmails(state.currentFolder)
    }
  }, [state.currentFolder, emailService, loadEmails])

  // Persist current folder to localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailClient.currentFolder', state.currentFolder)
    }
  }, [state.currentFolder])

  const actions: EmailActions = {
    selectEmail: (email) => {
      setState(prev => ({ 
        ...prev, 
        selectedEmail: email,
        isComposing: false // Clear compose when selecting email
      }))
    },

    setCurrentFolder: (folder) => {
      setState(prev => ({ 
        ...prev, 
        currentFolder: folder,
        selectedEmail: null, // Clear selection when changing folders
        searchQuery: '',
        searchResults: [],
        error: null
      }))
    },

    searchEmails: async (query) => {
      if (!emailService) return

      setState(prev => ({ ...prev, searchQuery: query, loading: true, error: null }))
      
      try {
        if (query.trim()) {
          const results = await emailService.searchEmails(query)
          setState(prev => ({ ...prev, searchResults: results, loading: false }))
        } else {
          setState(prev => ({ ...prev, searchResults: [], loading: false }))
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Search failed' 
        }))
      }
    },

    clearSearch: () => {
      setState(prev => ({ ...prev, searchQuery: '', searchResults: [] }))
    },

    startCompose: () => {
      setState(prev => ({ 
        ...prev, 
        isComposing: true,
        selectedEmail: null, // Clear selected email when composing
        composeData: { to: '', subject: '', body: '', isDraft: true }
      }))
    },

    cancelCompose: () => {
      setState(prev => ({ 
        ...prev, 
        isComposing: false,
        composeData: { to: '', subject: '', body: '', isDraft: false }
      }))
    },

    updateComposeData: (data) => {
      setState(prev => ({ 
        ...prev, 
        composeData: { ...prev.composeData, ...data }
      }))
    },

    sendEmail: async () => {
      if (!emailService) return

      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        await emailService.sendEmail({
          ...state.composeData,
          isDraft: false
        })
        setState(prev => ({ 
          ...prev, 
          loading: false,
          isComposing: false,
          composeData: { to: '', subject: '', body: '', isDraft: false }
        }))
        // Refresh emails after sending
        await loadEmails(state.currentFolder)
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to send email' 
        }))
      }
    },

    deleteEmail: async (emailId) => {
      if (!emailService) return

      // Optimistic update
      const emailToDelete = state.emails.find(e => e.id === emailId)
      setState(prev => ({ 
        ...prev, 
        emails: prev.emails.filter(e => e.id !== emailId),
        selectedEmail: prev.selectedEmail?.id === emailId ? null : prev.selectedEmail
      }))

      try {
        await emailService.deleteEmail(emailId)
      } catch (error) {
        // Revert optimistic update on error
        if (emailToDelete) {
          setState(prev => ({ 
            ...prev, 
            emails: [...prev.emails, emailToDelete].sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
            error: error instanceof Error ? error.message : 'Failed to delete email'
          }))
        }
      }
    },

    markAsRead: async (emailId) => {
      if (!emailService) return

      // Optimistic update
      setState(prev => ({ 
        ...prev, 
        emails: prev.emails.map(email => 
          email.id === emailId ? { ...email, read: true } : email
        ),
        selectedEmail: prev.selectedEmail?.id === emailId 
          ? { ...prev.selectedEmail, read: true }
          : prev.selectedEmail
      }))

      try {
        await emailService.markAsRead(emailId, true)
      } catch (error) {
        // Revert optimistic update on error
        setState(prev => ({ 
          ...prev, 
          emails: prev.emails.map(email => 
            email.id === emailId ? { ...email, read: false } : email
          ),
          selectedEmail: prev.selectedEmail?.id === emailId 
            ? { ...prev.selectedEmail, read: false }
            : prev.selectedEmail,
          error: error instanceof Error ? error.message : 'Failed to mark as read'
        }))
      }
    },

    markAsUnread: async (emailId) => {
      if (!emailService) return

      // Optimistic update
      setState(prev => ({ 
        ...prev, 
        emails: prev.emails.map(email => 
          email.id === emailId ? { ...email, read: false } : email
        ),
        selectedEmail: prev.selectedEmail?.id === emailId 
          ? { ...prev.selectedEmail, read: false }
          : prev.selectedEmail
      }))

      try {
        await emailService.markAsRead(emailId, false)
      } catch (error) {
        // Revert optimistic update on error
        setState(prev => ({ 
          ...prev, 
          emails: prev.emails.map(email => 
            email.id === emailId ? { ...email, read: true } : email
          ),
          selectedEmail: prev.selectedEmail?.id === emailId 
            ? { ...prev.selectedEmail, read: true }
            : prev.selectedEmail,
          error: error instanceof Error ? error.message : 'Failed to mark as unread'
        }))
      }
    },

    refreshEmails: async () => {
      await loadEmails(state.currentFolder)
    },

    clearError: () => {
      setState(prev => ({ ...prev, error: null }))
    }
  }

  return { state, actions }
}