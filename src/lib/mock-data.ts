/**
 * Mock data structures for development and testing
 * Provides realistic sample data for the terminal email client
 */

import { Email, Folder } from './types'

/**
 * Generate mock emails with realistic content
 * Includes various types: read/unread, with/without attachments, different folders
 */
export function generateMockEmails(): Email[] {
  const mockEmails: Email[] = [
    {
      id: 'email-001',
      from: 'john.doe@company.com',
      to: ['user@example.com'],
      subject: 'Weekly Team Standup - Action Items',
      body: `Hi team,

Here are the action items from today's standup:

1. Complete the API documentation by Friday
2. Review the new authentication flow
3. Update the deployment scripts

Let me know if you have any questions.

Best regards,
John`,
      date: new Date('2024-01-15T09:30:00'),
      isRead: false,
      isFlagged: true,
      hasAttachments: false,
      folderId: 'inbox'
    },
    {
      id: 'email-002',
      from: 'notifications@github.com',
      to: ['user@example.com'],
      subject: '[terminal-email-client] New pull request opened',
      body: `A new pull request has been opened in your repository.

Title: Add keyboard navigation support
Author: @contributor
Branch: feature/keyboard-nav

Review the changes at: https://github.com/user/terminal-email-client/pull/42

This is an automated message from GitHub.`,
      date: new Date('2024-01-15T08:45:00'),
      isRead: false,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'inbox'
    },
    {
      id: 'email-003',
      from: 'sarah.wilson@design.com',
      to: ['user@example.com'],
      cc: ['team@company.com'],
      subject: 'UI/UX Feedback on Terminal Client',
      body: `Hello,

I've reviewed the terminal email client mockups and have some feedback:

Positive:
- Love the authentic terminal aesthetic
- Keyboard navigation is intuitive
- Color scheme is easy on the eyes

Suggestions:
- Consider adding more visual hierarchy
- Maybe include some ASCII art elements
- The compose form could use better spacing

Overall, great work! The nostalgic feel is perfect.

Cheers,
Sarah`,
      date: new Date('2024-01-14T16:20:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: true,
      folderId: 'inbox',
      attachments: [
        {
          id: 'att-001',
          filename: 'ui-feedback.pdf',
          size: 245760,
          mimeType: 'application/pdf'
        }
      ]
    },
    {
      id: 'email-004',
      from: 'security@company.com',
      to: ['user@example.com'],
      subject: 'Security Alert: New Login Detected',
      body: `We detected a new login to your account:

Location: San Francisco, CA
Device: Chrome on macOS
Time: January 14, 2024 at 2:15 PM PST

If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.

Security Team`,
      date: new Date('2024-01-14T14:15:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'inbox'
    },
    {
      id: 'email-005',
      from: 'user@example.com',
      to: ['client@business.com'],
      subject: 'Project Update - Terminal Email Client',
      body: `Dear Client,

I wanted to provide you with an update on the terminal email client project:

Progress:
✓ Requirements gathering complete
✓ Design document finalized
✓ Core interfaces implemented
⏳ UI components in development
⏳ Email service integration

Timeline:
- Beta version: End of January
- Final release: Mid February

The project is on track and looking great!

Best regards,
Developer`,
      date: new Date('2024-01-13T11:30:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'sent'
    },
    {
      id: 'email-006',
      from: 'user@example.com',
      to: ['team@company.com'],
      subject: 'Draft: Meeting Notes Template',
      body: `Meeting Notes Template

Date: 
Attendees:
Agenda:

Discussion Points:
1. 
2. 
3. 

Action Items:
- [ ] 
- [ ] 
- [ ] 

Next Meeting: `,
      date: new Date('2024-01-12T15:45:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'drafts'
    },
    {
      id: 'email-007',
      from: 'spam@suspicious.com',
      to: ['user@example.com'],
      subject: 'URGENT: Claim Your Prize Now!!!',
      body: `Congratulations! You've won $1,000,000!

Click here to claim your prize: [suspicious-link]

This offer expires in 24 hours!

*This is obviously spam and should be deleted*`,
      date: new Date('2024-01-10T09:15:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'trash'
    },
    {
      id: 'email-008',
      from: 'newsletter@techblog.com',
      to: ['user@example.com'],
      subject: 'Weekly Tech Digest - Terminal Applications Making a Comeback',
      body: `This Week in Tech

🔥 Trending Topics:
- Terminal applications are having a renaissance
- New CSS frameworks for terminal-style UIs
- Keyboard-first interfaces gaining popularity

📚 Featured Articles:
1. "Why Developers Love Terminal UIs"
2. "Building Modern CLI Applications"
3. "The Art of ASCII Interfaces"

💡 Tool of the Week:
WebTUI - A CSS library for terminal-style web interfaces

Happy coding!
Tech Blog Team`,
      date: new Date('2024-01-11T07:00:00'),
      isRead: false,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'inbox'
    },
    {
      id: 'email-009',
      from: 'hr@company.com',
      to: ['user@example.com'],
      cc: ['all-staff@company.com'],
      subject: 'Company Holiday Schedule 2024',
      body: `Dear Team,

Please find attached the official company holiday schedule for 2024.

Key dates to remember:
- Memorial Day: May 27, 2024
- Independence Day: July 4, 2024
- Labor Day: September 2, 2024
- Thanksgiving: November 28-29, 2024
- Winter Break: December 23, 2024 - January 2, 2025

Please plan your projects and time off accordingly.

Best regards,
HR Department`,
      date: new Date('2024-01-16T10:15:00'),
      isRead: false,
      isFlagged: false,
      hasAttachments: true,
      folderId: 'inbox',
      attachments: [
        {
          id: 'att-002',
          filename: 'holiday-schedule-2024.pdf',
          size: 156432,
          mimeType: 'application/pdf'
        }
      ]
    },
    {
      id: 'email-010',
      from: 'support@cloudservice.com',
      to: ['user@example.com'],
      subject: 'Service Maintenance Notification',
      body: `Dear Customer,

We will be performing scheduled maintenance on our servers:

Date: January 20, 2024
Time: 2:00 AM - 4:00 AM EST
Expected Downtime: 2 hours

Services affected:
- API endpoints
- Dashboard access
- Email notifications

We apologize for any inconvenience.

Support Team`,
      date: new Date('2024-01-16T14:30:00'),
      isRead: true,
      isFlagged: true,
      hasAttachments: false,
      folderId: 'inbox'
    },
    {
      id: 'email-011',
      from: 'user@example.com',
      to: ['manager@company.com'],
      subject: 'Weekly Status Report - Week of Jan 15',
      body: `Hi Manager,

Here's my weekly status report:

Completed:
✓ Implemented email list component
✓ Added keyboard navigation support
✓ Created mock data service
✓ Updated project documentation

In Progress:
⏳ Email viewer component
⏳ Compose form validation
⏳ Responsive design improvements

Blockers:
None at this time

Next Week:
- Complete email viewer
- Implement state management
- Add error handling

Best regards,
Developer`,
      date: new Date('2024-01-15T17:00:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'sent'
    },
    {
      id: 'email-012',
      from: 'user@example.com',
      to: ['friend@personal.com'],
      subject: 'Re: Weekend Plans',
      body: `Hey!

Sounds great! I'm free Saturday afternoon. 

How about we meet at the coffee shop around 2 PM? We can catch up and maybe check out that new bookstore afterwards.

Let me know if that works for you!

Talk soon,
Me`,
      date: new Date('2024-01-14T19:45:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'sent'
    },
    {
      id: 'email-013',
      from: 'user@example.com',
      to: ['team@company.com'],
      subject: 'Draft: Code Review Guidelines',
      body: `Code Review Guidelines - DRAFT

Purpose:
Establish consistent code review practices across the team.

Guidelines:
1. Review within 24 hours of request
2. Focus on logic, readability, and maintainability
3. Be constructive and specific in feedback
4. Test the changes locally when possible

Checklist:
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No obvious bugs or security issues
- [ ] Performance considerations addressed

Please review and provide feedback.`,
      date: new Date('2024-01-16T11:20:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'drafts'
    },
    {
      id: 'email-014',
      from: 'user@example.com',
      to: ['client@startup.com'],
      subject: 'Draft: Proposal for Terminal UI Project',
      body: `Project Proposal: Terminal-Style Email Client

Overview:
Development of a web-based email client with authentic terminal aesthetics.

Scope:
- Modern Next.js application
- WebTUI CSS framework integration
- Keyboard-first navigation
- Responsive design
- Email management features

Timeline: 6-8 weeks
Budget: TBD

Next Steps:
- Schedule discovery call
- Finalize requirements
- Create detailed project plan

Looking forward to discussing this opportunity.

Best regards,
Developer`,
      date: new Date('2024-01-15T16:30:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'drafts'
    },
    {
      id: 'email-015',
      from: 'old-colleague@previousjob.com',
      to: ['user@example.com'],
      subject: 'Catching up and job opportunity',
      body: `Hey there!

Hope you're doing well! I heard through the grapevine that you're working on some cool terminal UI projects.

We have an opening on our team that might interest you - it's focused on developer tools and CLI applications. The role involves a lot of what you're already passionate about.

Would you be interested in a quick call to catch up and discuss?

Best,
Former Colleague`,
      date: new Date('2024-01-09T13:20:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'trash'
    },
    {
      id: 'email-016',
      from: 'marketing@software.com',
      to: ['user@example.com'],
      subject: 'Exclusive Developer Tools Sale - 50% Off!',
      body: `Limited Time Offer!

Get 50% off our premium developer tools suite:
- Advanced code editor
- Debugging tools
- Performance profilers
- Team collaboration features

Use code: DEV50
Expires: January 31, 2024

This email was moved to trash as it's promotional content.`,
      date: new Date('2024-01-08T09:00:00'),
      isRead: true,
      isFlagged: false,
      hasAttachments: false,
      folderId: 'trash'
    }
  ]

  return mockEmails
}

/**
 * Generate mock folders with realistic counts
 * Counts will be updated dynamically by EmailService
 */
export function generateMockFolders(): Folder[] {
  return [
    {
      id: 'inbox',
      name: 'Inbox',
      type: 'inbox',
      emailCount: 7, // Updated to match actual inbox emails
      unreadCount: 4, // Updated to match unread emails in inbox
      icon: '📥'
    },
    {
      id: 'sent',
      name: 'Sent',
      type: 'sent',
      emailCount: 3, // Updated to match actual sent emails
      unreadCount: 0,
      icon: '📤'
    },
    {
      id: 'drafts',
      name: 'Drafts',
      type: 'drafts',
      emailCount: 3, // Updated to match actual draft emails
      unreadCount: 0,
      icon: '📝'
    },
    {
      id: 'trash',
      name: 'Trash',
      type: 'trash',
      emailCount: 3, // Updated to match actual trash emails
      unreadCount: 0,
      icon: '🗑️'
    }
  ]
}

/**
 * Sample compose data for testing
 */
export const mockComposeData = {
  to: 'colleague@company.com',
  cc: '',
  bcc: '',
  subject: 'Test Email from Terminal Client',
  body: `Hello,

This is a test email sent from the terminal email client.

The interface feels very nostalgic and functional!

Best regards,
Terminal User`,
  isDraft: false
}

/**
 * Sample search queries for testing
 */
export const mockSearchQueries = [
  'team standup',
  'github notification',
  'security alert',
  'project update',
  'from:john.doe@company.com',
  'subject:urgent',
  'has:attachment'
]

/**
 * Sample keyboard shortcuts for testing
 */
export const mockKeyboardShortcuts = [
  { key: 'j', description: 'Next email' },
  { key: 'k', description: 'Previous email' },
  { key: 'Enter', description: 'Open email' },
  { key: 'c', description: 'Compose new email' },
  { key: 'r', description: 'Reply to email' },
  { key: 'd', description: 'Delete email' },
  { key: 'u', description: 'Mark as unread' },
  { key: 'f', description: 'Flag email' },
  { key: '/', description: 'Search emails' },
  { key: 'Escape', description: 'Cancel/Close' }
]

/**
 * Terminal color scheme constants
 */
export const terminalColors = {
  background: '#000000',
  foreground: '#00ff00',
  accent: '#ffff00',
  error: '#ff0000',
  warning: '#ffa500',
  info: '#00ffff',
  muted: '#808080',
  border: '#333333',
  selection: '#333333'
} as const

/**
 * ASCII art elements for terminal aesthetic
 */
export const asciiArt = {
  logo: `
 _____ _____ ____  __  __ ___ _   _    _    _     
|_   _| ____|  _ \\|  \\/  |_ _| \\ | |  / \\  | |    
  | | |  _| | |_) | |\\/| || ||  \\| | / _ \\ | |    
  | | | |___|  _ <| |  | || || |\\  |/ ___ \\| |___ 
  |_| |_____|_| \\_\\_|  |_|___|_| \\_/_/   \\_\\_____|
                                                  
 _____ __  __    _    ___ _     
| ____|  \\/  |  / \\  |_ _| |    
|  _| | |\\/| | / _ \\  | || |    
| |___| |  | |/ ___ \\ | || |___ 
|_____|_|  |_/_/   \\_\\___|_____|
`,

  miniLogo: `
┌─ TERMINAL MAIL ─┐
│   ▄▄▄▄▄▄▄▄▄    │
│   █ @ █ @ █    │
│   ▀▀▀▀▀▀▀▀▀    │
└─────────────────┘
`,
  
  separator: '═'.repeat(80),
  thinSeparator: '─'.repeat(80),
  doubleSeparator: '╬'.repeat(80),
  
  bullet: '▶',
  arrow: '→',
  checkmark: '✓',
  cross: '✗',
  
  spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  
  statusIcons: {
    unread: '●',
    read: '○',
    flagged: '⚑',
    attachment: '📎',
    draft: '✎',
    sent: '↗',
    received: '↙',
    important: '!',
    star: '★',
    reply: '↩',
    forward: '↪'
  },

  borders: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    cross: '┼',
    teeUp: '┴',
    teeDown: '┬',
    teeLeft: '┤',
    teeRight: '├'
  },

  boxes: {
    simple: {
      topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘',
      horizontal: '─', vertical: '│'
    },
    double: {
      topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝',
      horizontal: '═', vertical: '║'
    },
    rounded: {
      topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯',
      horizontal: '─', vertical: '│'
    }
  },

  cursors: {
    block: '█',
    line: '│',
    underscore: '_',
    arrow: '▶',
    triangle: '▲'
  },
  
  errorBox: `
┌─────────────────────────────────────┐
│                                     │
│    ✗ ERROR                          │
│                                     │
│    Something went wrong...          │
│                                     │
└─────────────────────────────────────┘
`,

  successBox: `
┌─────────────────────────────────────┐
│                                     │
│    ✓ SUCCESS                        │
│                                     │
│    Operation completed!             │
│                                     │
└─────────────────────────────────────┘
`,

  warningBox: `
┌─────────────────────────────────────┐
│                                     │
│    ! WARNING                        │
│                                     │
│    Please confirm action...         │
│                                     │
└─────────────────────────────────────┘
`,

  loadingBox: `
┌─────────────────────────────────────┐
│                                     │
│    ⠋ LOADING                        │
│                                     │
│    Please wait...                   │
│                                     │
└─────────────────────────────────────┘
`,

  emptyInbox: `
    ┌─────────────────────────┐
    │                         │
    │    📭 INBOX EMPTY       │
    │                         │
    │    No new messages      │
    │                         │
    └─────────────────────────┘
`,

  welcomeBanner: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗               ║
║  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║               ║
║     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║               ║
║     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║               ║
║     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗          ║
║     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝          ║
║                                                                              ║
║                    ███████╗███╗   ███╗ █████╗ ██╗██╗                        ║
║                    ██╔════╝████╗ ████║██╔══██╗██║██║                        ║
║                    █████╗  ██╔████╔██║███████║██║██║                        ║
║                    ██╔══╝  ██║╚██╔╝██║██╔══██║██║██║                        ║
║                    ███████╗██║ ╚═╝ ██║██║  ██║██║███████╗                   ║
║                    ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝                   ║
║                                                                              ║
║                          Welcome to Terminal Email Client                   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,

  progressBar: {
    empty: '░',
    filled: '█',
    partial: ['▏', '▎', '▍', '▌', '▋', '▊', '▉']
  },

  networkStatus: {
    connected: '🟢 ONLINE',
    disconnected: '🔴 OFFLINE',
    connecting: '🟡 CONNECTING'
  }
} as const