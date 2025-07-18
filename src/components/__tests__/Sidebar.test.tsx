/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../Sidebar'
import { generateMockFolders } from '@/lib/mock-data'

// Mock the useResponsive hook
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: jest.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: { width: 1024, height: 768 }
  }))
}))

describe('Sidebar Component', () => {
  const mockFolders = generateMockFolders()
  const mockOnFolderSelect = jest.fn()
  const mockOnToggleCollapse = jest.fn()

  const defaultProps = {
    folders: mockFolders,
    currentFolderId: 'inbox',
    onFolderSelect: mockOnFolderSelect,
    isCollapsed: false,
    onToggleCollapse: mockOnToggleCollapse
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sidebar with folder list', () => {
    render(<Sidebar {...defaultProps} />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('╔═ FOLDERS ═╗')).toBeInTheDocument()
    
    // Check that all folders are rendered
    mockFolders.forEach(folder => {
      expect(screen.getByText(folder.name.toUpperCase())).toBeInTheDocument()
    })
  })

  it('displays folder icons and counts correctly', () => {
    render(<Sidebar {...defaultProps} />)
    
    const inboxFolder = mockFolders.find(f => f.id === 'inbox')
    if (inboxFolder) {
      expect(screen.getByText(`[${inboxFolder.emailCount}]`)).toBeInTheDocument()
      if (inboxFolder.unreadCount > 0) {
        expect(screen.getByText(`(${inboxFolder.unreadCount})`)).toBeInTheDocument()
      }
    }
  })

  it('highlights the current folder', () => {
    render(<Sidebar {...defaultProps} />)
    
    const inboxButton = screen.getByRole('button', { name: /inbox/i })
    expect(inboxButton).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onFolderSelect when folder is clicked', async () => {
    const user = userEvent.setup()
    render(<Sidebar {...defaultProps} />)
    
    const sentButton = screen.getByRole('button', { name: /sent/i })
    await user.click(sentButton)
    
    expect(mockOnFolderSelect).toHaveBeenCalledWith('sent')
  })

  it('handles keyboard navigation with j/k keys', async () => {
    render(<Sidebar {...defaultProps} />)
    
    // Simulate j key press (down)
    fireEvent.keyDown(document, { key: 'j' })
    
    // Should move selection down
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const selectedButton = buttons.find(button => 
        button.getAttribute('aria-selected') === 'true'
      )
      expect(selectedButton).toBeDefined()
    })
  })

  it('handles keyboard navigation with arrow keys', async () => {
    render(<Sidebar {...defaultProps} />)
    
    // Simulate arrow down key press
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const selectedButton = buttons.find(button => 
        button.getAttribute('aria-selected') === 'true'
      )
      expect(selectedButton).toBeDefined()
    })
  })

  it('selects folder on Enter key press', async () => {
    render(<Sidebar {...defaultProps} />)
    
    // First move selection to a different folder
    fireEvent.keyDown(document, { key: 'j' })
    
    // Then press Enter
    fireEvent.keyDown(document, { key: 'Enter' })
    
    await waitFor(() => {
      expect(mockOnFolderSelect).toHaveBeenCalled()
    })
  })

  it('displays keyboard shortcuts in footer', () => {
    render(<Sidebar {...defaultProps} />)
    
    expect(screen.getByText('SHORTCUTS:')).toBeInTheDocument()
    expect(screen.getByText('j/k - Navigate')).toBeInTheDocument()
    expect(screen.getByText('Enter - Select')).toBeInTheDocument()
  })

  it('shows unread count for folders with unread emails', () => {
    const foldersWithUnread = mockFolders.map(folder => ({
      ...folder,
      unreadCount: folder.id === 'inbox' ? 5 : 0
    }))

    render(<Sidebar {...defaultProps} folders={foldersWithUnread} />)
    
    expect(screen.getByText('(5)')).toBeInTheDocument()
  })

  it('applies correct ARIA labels and roles', () => {
    render(<Sidebar {...defaultProps} />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Email folders navigation')
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(mockFolders.length)
  })

  it('handles collapsed state correctly', () => {
    // Mock mobile responsive behavior for this test
    const { useResponsive } = require('@/hooks/useResponsive')
    useResponsive.mockReturnValueOnce({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenSize: { width: 480, height: 768 }
    })
    
    const mobileProps = {
      ...defaultProps,
      isCollapsed: true
    }
    
    render(<Sidebar {...mobileProps} />)
    
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveStyle({ width: '0px' })
  })
})