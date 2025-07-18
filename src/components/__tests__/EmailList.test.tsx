import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailList } from '../EmailList'
import { generateMockEmails } from '@/lib/mock-data'
import { Email } from '@/lib/types'

// Mock the hooks
jest.mock('@/hooks/useListNavigation', () => ({
  useListNavigation: jest.fn(() => ({
    selectedIndex: 0,
    setSelectedIndex: jest.fn(),
    handleSelect: jest.fn(),
    isSelected: jest.fn((index: number) => index === 0)
  }))
}))

describe('EmailList', () => {
  const mockEmails = generateMockEmails().slice(0, 3) // Use first 3 emails for testing
  const mockOnEmailSelect = jest.fn()
  const mockOnEmailOpen = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders email list with correct structure', () => {
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    // Check for table structure
    expect(screen.getByRole('grid', { name: /email list/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /from/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /subject/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument()
  })

  it('displays emails in correct order (newest first)', () => {
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const rows = screen.getAllByRole('row')
    // First row is header, so email rows start from index 1
    const emailRows = rows.slice(1)
    
    expect(emailRows).toHaveLength(mockEmails.length)
    
    // Check that emails are sorted by date (newest first)
    const sortedEmails = [...mockEmails].sort((a, b) => b.date.getTime() - a.date.getTime())
    
    emailRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedEmails[index].from)
      expect(row).toHaveTextContent(sortedEmails[index].subject)
    })
  })

  it('shows unread email indicators correctly', () => {
    const emailsWithUnread = mockEmails.map((email, index) => ({
      ...email,
      isRead: index % 2 === 0 // Make every other email unread
    }))

    render(
      <EmailList
        emails={emailsWithUnread}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const unreadEmails = emailsWithUnread.filter(email => !email.isRead)
    const unreadIndicators = screen.getAllByLabelText('Unread')
    
    expect(unreadIndicators).toHaveLength(unreadEmails.length)
  })

  it('shows flagged and attachment indicators', () => {
    const emailsWithFlags = mockEmails.map((email, index) => ({
      ...email,
      isFlagged: index === 0,
      hasAttachments: index === 1
    }))

    render(
      <EmailList
        emails={emailsWithFlags}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    expect(screen.getByLabelText('Flagged')).toBeInTheDocument()
    expect(screen.getByLabelText('Has attachments')).toBeInTheDocument()
  })

  it('calls onEmailSelect when row is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const firstEmailRow = screen.getAllByRole('row')[1] // Skip header row
    await user.click(firstEmailRow)

    expect(mockOnEmailSelect).toHaveBeenCalledTimes(1)
    expect(mockOnEmailSelect).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      from: expect.any(String),
      subject: expect.any(String)
    }))
  })

  it('calls onEmailOpen when row is double-clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const firstEmailRow = screen.getAllByRole('row')[1] // Skip header row
    await user.dblClick(firstEmailRow)

    expect(mockOnEmailOpen).toHaveBeenCalledTimes(1)
    expect(mockOnEmailOpen).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      from: expect.any(String),
      subject: expect.any(String)
    }))
  })

  it('displays empty state when no emails', () => {
    render(
      <EmailList
        emails={[]}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    expect(screen.getByText('No emails in this folder')).toBeInTheDocument()
  })

  it('shows correct email count in footer', () => {
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const emailCount = mockEmails.length
    const unreadCount = mockEmails.filter(email => !email.isRead).length
    
    expect(screen.getByText(new RegExp(`${emailCount} emails?`))).toBeInTheDocument()
    
    if (unreadCount > 0) {
      expect(screen.getByText(new RegExp(`\\(${unreadCount} unread\\)`))).toBeInTheDocument()
    }
  })

  it('truncates long email subjects and sender names', () => {
    const longEmail: Email = {
      ...mockEmails[0],
      from: 'very.long.email.address.that.should.be.truncated@company.com',
      subject: 'This is a very long email subject that should be truncated to fit in the table cell without breaking the layout'
    }

    render(
      <EmailList
        emails={[longEmail]}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    // Check that text is truncated (contains ellipsis)
    const truncatedElements = screen.getAllByText(/\.\.\.$/)
    expect(truncatedElements.length).toBeGreaterThan(0)
  })

  it('formats dates correctly', () => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const lastWeek = new Date(today.getTime() - 7 * 86400000)
    
    const emailsWithDates = [
      { ...mockEmails[0], date: today },
      { ...mockEmails[1], date: yesterday },
      { ...mockEmails[2], date: lastWeek }
    ]

    render(
      <EmailList
        emails={emailsWithDates}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    // Today should show time
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
    
    // Yesterday should show "Yesterday"
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('applies correct CSS classes for terminal styling', () => {
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const table = screen.getByRole('grid')
    expect(table).toHaveClass('terminal-border')
    
    // Find header row by its actual accessible name
    const header = screen.getByRole('row', { name: /Read status Flags and attachments From Subject Date/i })
    expect(header).toHaveClass('bg-terminal-dim')
  })

  it('provides proper accessibility attributes', () => {
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const table = screen.getByRole('grid')
    expect(table).toHaveAttribute('aria-label', 'Email list')
    expect(table).toHaveAttribute('aria-rowcount', String(mockEmails.length + 1))

    const emailRows = screen.getAllByRole('row').slice(1) // Skip header
    emailRows.forEach(row => {
      expect(row).toHaveAttribute('aria-selected')
      expect(row).toHaveAttribute('tabIndex')
    })
  })

  it('shows keyboard shortcuts in footer on desktop', () => {
    render(
      <EmailList
        emails={mockEmails}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    expect(screen.getByText(/j\/k:navigate.*Enter:open.*r:read.*f:flag.*d:delete/)).toBeInTheDocument()
  })

  it('handles selected email highlighting', () => {
    const selectedEmailId = mockEmails[0].id
    
    render(
      <EmailList
        emails={mockEmails}
        selectedEmailId={selectedEmailId}
        onEmailSelect={mockOnEmailSelect}
        onEmailOpen={mockOnEmailOpen}
      />
    )

    const selectedRow = screen.getAllByRole('row')[1] // First email row
    expect(selectedRow).toHaveClass('bg-terminal-selection')
  })
})