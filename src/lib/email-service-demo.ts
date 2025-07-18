/**
 * Demo script showing EmailService usage
 * This demonstrates the mock email service functionality
 */

import { EmailService } from './email-service'
import { ComposeData } from './types'

/**
 * Demo function showing basic EmailService operations
 */
export async function demoEmailService() {
  console.log('🚀 Starting EmailService Demo...\n')
  
  // Initialize the service with network simulation enabled
  const emailService = new EmailService(true)
  
  try {
    // 1. Get email statistics
    console.log('📊 Getting email statistics...')
    const stats = await emailService.getEmailStats()
    console.log(`Total emails: ${stats.totalEmails}`)
    console.log(`Unread emails: ${stats.unreadEmails}`)
    console.log(`Flagged emails: ${stats.flaggedEmails}`)
    console.log(`Today's emails: ${stats.todayEmails}\n`)
    
    // 2. Get all folders
    console.log('📁 Getting folders...')
    const folders = await emailService.getFolders()
    folders.forEach(folder => {
      console.log(`${folder.icon} ${folder.name}: ${folder.emailCount} emails (${folder.unreadCount} unread)`)
    })
    console.log()
    
    // 3. Get inbox emails
    console.log('📥 Getting inbox emails...')
    const inboxEmails = await emailService.getEmails('inbox')
    console.log(`Found ${inboxEmails.length} emails in inbox:`)
    inboxEmails.forEach(email => {
      const status = email.isRead ? '📖' : '📩'
      const flag = email.isFlagged ? '⚑' : ''
      const attachment = email.hasAttachments ? '📎' : ''
      console.log(`  ${status} ${flag} ${attachment} ${email.subject} - ${email.from}`)
    })
    console.log()
    
    // 4. Search emails
    console.log('🔍 Searching for emails containing "standup"...')
    const searchResults = await emailService.searchEmails('standup')
    console.log(`Found ${searchResults.length} matching emails:`)
    searchResults.forEach(email => {
      console.log(`  📧 ${email.subject} - ${email.from}`)
    })
    console.log()
    
    // 5. Send a new email
    console.log('📤 Sending a new email...')
    const composeData: ComposeData = {
      to: 'demo@example.com',
      subject: 'Demo Email from Terminal Client',
      body: `Hello!

This is a demo email sent from the terminal email client.

Features demonstrated:
- Mock email service
- Realistic API delays
- Email management operations
- Search functionality

Best regards,
Terminal Email Client`,
      isDraft: false
    }
    
    const sendResult = await emailService.sendEmail(composeData)
    if (sendResult.success) {
      console.log('✅ Email sent successfully!')
      console.log(`Email ID: ${sendResult.data.id}`)
    } else {
      console.log('❌ Failed to send email:', sendResult.error)
    }
    console.log()
    
    // 6. Save a draft
    console.log('📝 Saving a draft email...')
    const draftData: ComposeData = {
      to: 'draft-recipient@example.com',
      subject: 'Draft: Important Meeting Notes',
      body: 'This is a draft email that will be saved for later...',
      isDraft: true
    }
    
    const draftResult = await emailService.saveDraft(draftData)
    if (draftResult.success) {
      console.log('✅ Draft saved successfully!')
      console.log(`Draft ID: ${draftResult.data.id}`)
    }
    console.log()
    
    // 7. Mark an email as read
    if (inboxEmails.length > 0) {
      const firstEmail = inboxEmails[0]
      console.log(`📖 Marking email "${firstEmail.subject}" as read...`)
      const markResult = await emailService.markAsRead(firstEmail.id, true)
      if (markResult.success) {
        console.log('✅ Email marked as read!')
      }
      console.log()
    }
    
    // 8. Get recent activity
    console.log('📋 Getting recent activity...')
    const activity = await emailService.getRecentActivity()
    activity.forEach(log => console.log(`  ${log}`))
    console.log()
    
    console.log('🎉 EmailService demo completed successfully!')
    
  } catch (error) {
    console.error('❌ Demo failed with error:', error)
  }
}

/**
 * Demo function showing error handling
 */
export async function demoErrorHandling() {
  console.log('⚠️  Testing error handling...\n')
  
  const emailService = new EmailService(true) // Enable network simulation
  
  // Try operations multiple times to trigger network errors
  for (let i = 0; i < 10; i++) {
    try {
      await emailService.getEmails('inbox')
      console.log(`✅ Attempt ${i + 1}: Success`)
    } catch (error) {
      console.log(`❌ Attempt ${i + 1}: ${error}`)
    }
  }
}

// Export for use in other files
export { EmailService }