/**
 * EmailService class for handling email operations
 * Provides a clean API for email management with mock implementation for development
 */

import {
  Email,
  Folder,
  EmailOperationResult,
  EmailFilters,
  EmailSort,
  ComposeData
} from './types'
import { generateMockEmails, generateMockFolders } from './mock-data'

export class EmailService {
  private mockEmails: Email[] = []
  private mockFolders: Folder[] = []
  private enableNetworkSimulation: boolean

  constructor(enableNetworkSimulation: boolean = true) {
    this.enableNetworkSimulation = enableNetworkSimulation
    this.initializeMockData()
  }

  /**
   * Fetch emails for a specific folder with optional filtering and sorting
   */
  async getEmails(
    folderId: string,
    filters?: EmailFilters,
    sort?: EmailSort
  ): Promise<Email[]> {
    // Simulate API delay
    await this.delay(300)

    // Occasionally simulate network errors for testing
    this.simulateNetworkError()

    let emails = this.mockEmails.filter(email => email.folderId === folderId)

    // Apply filters
    if (filters) {
      emails = this.applyFilters(emails, filters)
    }

    // Apply sorting
    if (sort) {
      emails = this.applySorting(emails, sort)
    }

    return emails
  }

  /**
   * Get single email with full content
   */
  async getEmail(emailId: string): Promise<Email | null> {
    await this.delay(200)

    const email = this.mockEmails.find(email => email.id === emailId)
    return email || null
  }

  /**
   * Send new email
   */
  async sendEmail(composeData: ComposeData): Promise<EmailOperationResult> {
    await this.delay(500)

    try {
      const newEmail: Email = {
        id: this.generateId(),
        from: 'user@example.com', // In real implementation, this would come from auth
        to: composeData.to.split(',').map(email => email.trim()),
        cc: composeData.cc ? composeData.cc.split(',').map(email => email.trim()) : undefined,
        bcc: composeData.bcc ? composeData.bcc.split(',').map(email => email.trim()) : undefined,
        subject: composeData.subject,
        body: composeData.body,
        date: new Date(),
        isRead: true,
        isFlagged: false,
        hasAttachments: false,
        folderId: 'sent'
      }

      this.mockEmails.push(newEmail)
      this.updateFolderCounts()

      return { success: true, data: newEmail }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }
    }
  }

  /**
   * Move email between folders
   */
  async moveEmail(emailId: string, targetFolderId: string): Promise<EmailOperationResult> {
    await this.delay(200)

    const emailIndex = this.mockEmails.findIndex(email => email.id === emailId)
    if (emailIndex === -1) {
      return { success: false, error: 'Email not found' }
    }

    this.mockEmails[emailIndex].folderId = targetFolderId
    this.updateFolderCounts()

    return { success: true }
  }

  /**
   * Mark email as read/unread
   */
  async markAsRead(emailId: string, isRead: boolean): Promise<EmailOperationResult> {
    await this.delay(100)

    const emailIndex = this.mockEmails.findIndex(email => email.id === emailId)
    if (emailIndex === -1) {
      return { success: false, error: 'Email not found' }
    }

    this.mockEmails[emailIndex].isRead = isRead
    this.updateFolderCounts()

    return { success: true }
  }

  /**
   * Delete email (move to trash)
   */
  async deleteEmail(emailId: string): Promise<EmailOperationResult> {
    await this.delay(200)

    const email = this.mockEmails.find(email => email.id === emailId)
    if (!email) {
      return { success: false, error: 'Email not found' }
    }

    if (email.folderId === 'trash') {
      // Permanently delete if already in trash
      const emailIndex = this.mockEmails.findIndex(email => email.id === emailId)
      this.mockEmails.splice(emailIndex, 1)
    } else {
      // Move to trash
      email.folderId = 'trash'
    }

    this.updateFolderCounts()
    return { success: true }
  }

  /**
   * Search emails across all folders
   */
  async searchEmails(query: string): Promise<Email[]> {
    await this.delay(300)

    if (!query.trim()) {
      return []
    }

    const searchTerm = query.toLowerCase()
    return this.mockEmails.filter(email =>
      email.subject.toLowerCase().includes(searchTerm) ||
      email.body.toLowerCase().includes(searchTerm) ||
      email.from.toLowerCase().includes(searchTerm) ||
      email.to.some(recipient => recipient.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * Get all folders with current counts
   */
  async getFolders(): Promise<Folder[]> {
    await this.delay(100)
    this.updateFolderCounts()
    return [...this.mockFolders]
  }

  /**
   * Save draft email
   */
  async saveDraft(composeData: ComposeData): Promise<EmailOperationResult> {
    await this.delay(200)

    try {
      const draftEmail: Email = {
        id: this.generateId(),
        from: 'user@example.com',
        to: composeData.to ? composeData.to.split(',').map(email => email.trim()) : [],
        cc: composeData.cc ? composeData.cc.split(',').map(email => email.trim()) : undefined,
        bcc: composeData.bcc ? composeData.bcc.split(',').map(email => email.trim()) : undefined,
        subject: composeData.subject || '(No Subject)',
        body: composeData.body,
        date: new Date(),
        isRead: true,
        isFlagged: false,
        hasAttachments: false,
        folderId: 'drafts'
      }

      this.mockEmails.push(draftEmail)
      this.updateFolderCounts()

      return { success: true, data: draftEmail }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save draft'
      }
    }
  }

  // Private helper methods
  private initializeMockData(): void {
    // Initialize mock data from mock-data.ts
    this.mockEmails = generateMockEmails()
    this.mockFolders = generateMockFolders()
    this.updateFolderCounts()
  }

  private applyFilters(emails: Email[], filters: EmailFilters): Email[] {
    return emails.filter(email => {
      if (filters.isRead !== undefined && email.isRead !== filters.isRead) return false
      if (filters.isFlagged !== undefined && email.isFlagged !== filters.isFlagged) return false
      if (filters.hasAttachments !== undefined && email.hasAttachments !== filters.hasAttachments) return false
      if (filters.sender && !email.from.toLowerCase().includes(filters.sender.toLowerCase())) return false
      if (filters.dateRange) {
        const emailDate = new Date(email.date)
        if (emailDate < filters.dateRange.start || emailDate > filters.dateRange.end) return false
      }
      return true
    })
  }

  private applySorting(emails: Email[], sort: EmailSort): Email[] {
    return emails.sort((a, b) => {
      let comparison = 0

      switch (sort.field) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'from':
          comparison = a.from.localeCompare(b.from)
          break
        case 'subject':
          comparison = a.subject.localeCompare(b.subject)
          break
        case 'isRead':
          comparison = Number(a.isRead) - Number(b.isRead)
          break
      }

      return sort.direction === 'desc' ? -comparison : comparison
    })
  }

  private updateFolderCounts(): void {
    this.mockFolders.forEach(folder => {
      const folderEmails = this.mockEmails.filter(email => email.folderId === folder.id)
      folder.emailCount = folderEmails.length
      folder.unreadCount = folderEmails.filter(email => !email.isRead).length
    })
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private delay(ms: number): Promise<void> {
    // Add some randomness to simulate real network conditions
    const randomDelay = ms + Math.random() * 200 - 100
    return new Promise(resolve => setTimeout(resolve, Math.max(50, randomDelay)))
  }

  /**
   * Simulate network errors occasionally for testing error handling
   */
  private simulateNetworkError(): void {
    // Only simulate errors if enabled (disabled for tests)
    if (this.enableNetworkSimulation && Math.random() < 0.05) {
      const errorTypes = [
        'Network error: Unable to connect to email server',
        'Timeout error: Request timed out after 30 seconds',
        'Connection error: Lost connection to server',
        'Server error: Internal server error (500)',
        'Service unavailable: Email service is temporarily down'
      ]
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)]
      throw new Error(randomError)
    }
  }

  /**
   * Get email statistics for dashboard/header display
   */
  async getEmailStats(): Promise<{
    totalEmails: number
    unreadEmails: number
    flaggedEmails: number
    todayEmails: number
  }> {
    await this.delay(100)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return {
      totalEmails: this.mockEmails.length,
      unreadEmails: this.mockEmails.filter(email => !email.isRead).length,
      flaggedEmails: this.mockEmails.filter(email => email.isFlagged).length,
      todayEmails: this.mockEmails.filter(email => {
        const emailDate = new Date(email.date)
        emailDate.setHours(0, 0, 0, 0)
        return emailDate.getTime() === today.getTime()
      }).length
    }
  }

  /**
   * Toggle flag status of an email
   */
  async toggleFlag(emailId: string): Promise<EmailOperationResult> {
    await this.delay(100)

    const emailIndex = this.mockEmails.findIndex(email => email.id === emailId)
    if (emailIndex === -1) {
      return { success: false, error: 'Email not found' }
    }

    this.mockEmails[emailIndex].isFlagged = !this.mockEmails[emailIndex].isFlagged

    return { success: true, data: this.mockEmails[emailIndex] }
  }

  /**
   * Get recent activity for debugging/monitoring
   */
  async getRecentActivity(): Promise<string[]> {
    await this.delay(150)

    return [
      `${new Date().toISOString()}: Email service initialized`,
      `${new Date().toISOString()}: Loaded ${this.mockEmails.length} emails`,
      `${new Date().toISOString()}: ${this.mockFolders.length} folders available`,
      `${new Date().toISOString()}: Mock delays: 50-500ms`,
      `${new Date().toISOString()}: Error simulation: 5% chance`
    ]
  }
}