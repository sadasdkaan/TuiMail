/**
 * Tests for EmailService mock implementation
 * Verifies that all email operations work correctly with mock data
 */

import { EmailService } from '../email-service'
import { ComposeData } from '../types'

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(() => {
    // Disable network simulation for consistent test results
    emailService = new EmailService(false)
  })

  describe('getEmails', () => {
    it('should return emails for inbox folder', async () => {
      const emails = await emailService.getEmails('inbox')
      
      expect(emails).toBeDefined()
      expect(emails.length).toBeGreaterThan(0)
      expect(emails.every(email => email.folderId === 'inbox')).toBe(true)
    })

    it('should return emails for sent folder', async () => {
      const emails = await emailService.getEmails('sent')
      
      expect(emails).toBeDefined()
      expect(emails.every(email => email.folderId === 'sent')).toBe(true)
    })

    it('should return emails for drafts folder', async () => {
      const emails = await emailService.getEmails('drafts')
      
      expect(emails).toBeDefined()
      expect(emails.every(email => email.folderId === 'drafts')).toBe(true)
    })

    it('should return emails for trash folder', async () => {
      const emails = await emailService.getEmails('trash')
      
      expect(emails).toBeDefined()
      expect(emails.every(email => email.folderId === 'trash')).toBe(true)
    })

    it('should filter emails by read status', async () => {
      const unreadEmails = await emailService.getEmails('inbox', { isRead: false })
      
      expect(unreadEmails.every(email => !email.isRead)).toBe(true)
    })

    it('should filter emails by flagged status', async () => {
      const flaggedEmails = await emailService.getEmails('inbox', { isFlagged: true })
      
      expect(flaggedEmails.every(email => email.isFlagged)).toBe(true)
    })

    it('should sort emails by date', async () => {
      const emails = await emailService.getEmails('inbox', undefined, { field: 'date', direction: 'desc' })
      
      for (let i = 1; i < emails.length; i++) {
        expect(new Date(emails[i-1].date).getTime()).toBeGreaterThanOrEqual(new Date(emails[i].date).getTime())
      }
    })
  })

  describe('getEmail', () => {
    it('should return a specific email by ID', async () => {
      const allEmails = await emailService.getEmails('inbox')
      const firstEmail = allEmails[0]
      
      const email = await emailService.getEmail(firstEmail.id)
      
      expect(email).toBeDefined()
      expect(email?.id).toBe(firstEmail.id)
    })

    it('should return null for non-existent email', async () => {
      const email = await emailService.getEmail('non-existent-id')
      
      expect(email).toBeNull()
    })
  })

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const composeData: ComposeData = {
        to: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email',
        isDraft: false
      }

      const result = await emailService.sendEmail(composeData)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.subject).toBe('Test Email')
      expect(result.data.folderId).toBe('sent')
    })

    it('should handle multiple recipients', async () => {
      const composeData: ComposeData = {
        to: 'test1@example.com, test2@example.com',
        cc: 'cc@example.com',
        subject: 'Test Email',
        body: 'This is a test email',
        isDraft: false
      }

      const result = await emailService.sendEmail(composeData)
      
      expect(result.success).toBe(true)
      expect(result.data.to).toEqual(['test1@example.com', 'test2@example.com'])
      expect(result.data.cc).toEqual(['cc@example.com'])
    })
  })

  describe('markAsRead', () => {
    it('should mark email as read', async () => {
      const emails = await emailService.getEmails('inbox')
      const unreadEmail = emails.find(email => !email.isRead)
      
      if (unreadEmail) {
        const result = await emailService.markAsRead(unreadEmail.id, true)
        expect(result.success).toBe(true)
        
        const updatedEmail = await emailService.getEmail(unreadEmail.id)
        expect(updatedEmail?.isRead).toBe(true)
      }
    })

    it('should mark email as unread', async () => {
      const emails = await emailService.getEmails('inbox')
      const readEmail = emails.find(email => email.isRead)
      
      if (readEmail) {
        const result = await emailService.markAsRead(readEmail.id, false)
        expect(result.success).toBe(true)
        
        const updatedEmail = await emailService.getEmail(readEmail.id)
        expect(updatedEmail?.isRead).toBe(false)
      }
    })
  })

  describe('deleteEmail', () => {
    it('should move email to trash', async () => {
      const emails = await emailService.getEmails('inbox')
      const emailToDelete = emails[0]
      
      const result = await emailService.deleteEmail(emailToDelete.id)
      expect(result.success).toBe(true)
      
      const deletedEmail = await emailService.getEmail(emailToDelete.id)
      expect(deletedEmail?.folderId).toBe('trash')
    })

    it('should permanently delete email from trash', async () => {
      const trashEmails = await emailService.getEmails('trash')
      const emailToDelete = trashEmails[0]
      
      if (emailToDelete) {
        const result = await emailService.deleteEmail(emailToDelete.id)
        expect(result.success).toBe(true)
        
        const deletedEmail = await emailService.getEmail(emailToDelete.id)
        expect(deletedEmail).toBeNull()
      }
    })
  })

  describe('searchEmails', () => {
    it('should search emails by subject', async () => {
      const results = await emailService.searchEmails('standup')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(email => email.subject.toLowerCase().includes('standup'))).toBe(true)
    })

    it('should search emails by sender', async () => {
      const results = await emailService.searchEmails('john.doe')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(email => email.from.includes('john.doe'))).toBe(true)
    })

    it('should return empty array for empty query', async () => {
      const results = await emailService.searchEmails('')
      
      expect(results).toEqual([])
    })
  })

  describe('getFolders', () => {
    it('should return all folders with correct counts', async () => {
      const folders = await emailService.getFolders()
      
      expect(folders).toBeDefined()
      expect(folders.length).toBe(4)
      
      const inbox = folders.find(f => f.id === 'inbox')
      expect(inbox).toBeDefined()
      expect(inbox?.emailCount).toBeGreaterThan(0)
    })
  })

  describe('saveDraft', () => {
    it('should save draft email', async () => {
      const composeData: ComposeData = {
        to: 'draft@example.com',
        subject: 'Draft Email',
        body: 'This is a draft',
        isDraft: true
      }

      const result = await emailService.saveDraft(composeData)
      
      expect(result.success).toBe(true)
      expect(result.data.folderId).toBe('drafts')
      expect(result.data.subject).toBe('Draft Email')
    })
  })

  describe('toggleFlag', () => {
    it('should toggle email flag status', async () => {
      const emails = await emailService.getEmails('inbox')
      const email = emails[0]
      const originalFlagStatus = email.isFlagged
      
      const result = await emailService.toggleFlag(email.id)
      expect(result.success).toBe(true)
      
      const updatedEmail = await emailService.getEmail(email.id)
      expect(updatedEmail?.isFlagged).toBe(!originalFlagStatus)
    })
  })

  describe('getEmailStats', () => {
    it('should return email statistics', async () => {
      const stats = await emailService.getEmailStats()
      
      expect(stats).toBeDefined()
      expect(stats.totalEmails).toBeGreaterThan(0)
      expect(stats.unreadEmails).toBeGreaterThanOrEqual(0)
      expect(stats.flaggedEmails).toBeGreaterThanOrEqual(0)
      expect(stats.todayEmails).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getRecentActivity', () => {
    it('should return recent activity logs', async () => {
      const activity = await emailService.getRecentActivity()
      
      expect(activity).toBeDefined()
      expect(Array.isArray(activity)).toBe(true)
      expect(activity.length).toBeGreaterThan(0)
      expect(activity.every(log => typeof log === 'string')).toBe(true)
    })
  })

  describe('moveEmail', () => {
    it('should move email between folders', async () => {
      const inboxEmails = await emailService.getEmails('inbox')
      const emailToMove = inboxEmails[0]
      
      const result = await emailService.moveEmail(emailToMove.id, 'drafts')
      expect(result.success).toBe(true)
      
      const movedEmail = await emailService.getEmail(emailToMove.id)
      expect(movedEmail?.folderId).toBe('drafts')
    })
  })
})