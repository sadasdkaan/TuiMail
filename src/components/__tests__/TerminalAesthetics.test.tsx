import { render, screen, fireEvent } from '@testing-library/react'
import TerminalAesthetics, { AsciiBox, TerminalNotification } from '../TerminalAesthetics'
import { asciiArt } from '@/lib/mock-data'

describe('TerminalAesthetics', () => {
  it('renders demo when showDemo is true', () => {
    render(<TerminalAesthetics showDemo={true} />)
    
    expect(screen.getByText(/Cursor Styles:/)).toBeInTheDocument()
    expect(screen.getByText(/Typewriter Effect:/)).toBeInTheDocument()
    expect(screen.getByText(/Loading Animation:/)).toBeInTheDocument()
  })

  it('does not render demo when showDemo is false', () => {
    render(<TerminalAesthetics showDemo={false} />)
    
    expect(screen.queryByText(/Cursor Styles:/)).not.toBeInTheDocument()
  })

  it('displays ASCII art elements', () => {
    render(<TerminalAesthetics showDemo={true} />)
    
    // Check for ASCII art elements
    expect(screen.getByText(/TERMINAL MAIL/)).toBeInTheDocument()
  })
})

describe('AsciiBox', () => {
  it('renders with simple style by default', () => {
    render(
      <AsciiBox title="Test Box">
        <div>Test content</div>
      </AsciiBox>
    )
    
    expect(screen.getByText('Test Box')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders with different box styles', () => {
    const { rerender } = render(
      <AsciiBox style="double" title="Double Box">
        <div>Double content</div>
      </AsciiBox>
    )
    
    expect(screen.getByText('Double Box')).toBeInTheDocument()
    
    rerender(
      <AsciiBox style="rounded" title="Rounded Box">
        <div>Rounded content</div>
      </AsciiBox>
    )
    
    expect(screen.getByText('Rounded Box')).toBeInTheDocument()
  })
})

describe('TerminalNotification', () => {
  it('renders notification with correct type and message', () => {
    render(
      <TerminalNotification
        type="success"
        message="Test success message"
      />
    )
    
    expect(screen.getByText('Test success message')).toBeInTheDocument()
    expect(screen.getByText(asciiArt.checkmark)).toBeInTheDocument()
  })

  it('renders close button when onClose is provided', () => {
    const mockOnClose = jest.fn()
    
    render(
      <TerminalNotification
        type="info"
        message="Test message"
        onClose={mockOnClose}
      />
    )
    
    const closeButton = screen.getByLabelText('Close notification')
    expect(closeButton).toBeInTheDocument()
    
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('auto-closes when autoClose is enabled', (done) => {
    const mockOnClose = jest.fn()
    
    render(
      <TerminalNotification
        type="info"
        message="Test message"
        onClose={mockOnClose}
        autoClose={true}
        duration={100}
      />
    )
    
    setTimeout(() => {
      expect(mockOnClose).toHaveBeenCalled()
      done()
    }, 150)
  })

  it('renders different notification types with correct icons', () => {
    const { rerender } = render(
      <TerminalNotification type="success" message="Success" />
    )
    expect(screen.getByText(asciiArt.checkmark)).toBeInTheDocument()
    
    rerender(<TerminalNotification type="error" message="Error" />)
    expect(screen.getByText(asciiArt.cross)).toBeInTheDocument()
    
    rerender(<TerminalNotification type="warning" message="Warning" />)
    expect(screen.getByText(asciiArt.statusIcons.important)).toBeInTheDocument()
    
    rerender(<TerminalNotification type="info" message="Info" />)
    expect(screen.getByText(asciiArt.statusIcons.star)).toBeInTheDocument()
  })
})

describe('ASCII Art Elements', () => {
  it('contains all required ASCII art elements', () => {
    expect(asciiArt.miniLogo).toBeDefined()
    expect(asciiArt.welcomeBanner).toBeDefined()
    expect(asciiArt.boxes.simple).toBeDefined()
    expect(asciiArt.boxes.double).toBeDefined()
    expect(asciiArt.boxes.rounded).toBeDefined()
    expect(asciiArt.cursors).toBeDefined()
    expect(asciiArt.progressBar).toBeDefined()
    expect(asciiArt.networkStatus).toBeDefined()
  })

  it('has enhanced status icons', () => {
    expect(asciiArt.statusIcons.important).toBeDefined()
    expect(asciiArt.statusIcons.star).toBeDefined()
    expect(asciiArt.statusIcons.reply).toBeDefined()
    expect(asciiArt.statusIcons.forward).toBeDefined()
  })

  it('has border elements', () => {
    expect(asciiArt.borders.topLeft).toBeDefined()
    expect(asciiArt.borders.topRight).toBeDefined()
    expect(asciiArt.borders.bottomLeft).toBeDefined()
    expect(asciiArt.borders.bottomRight).toBeDefined()
    expect(asciiArt.borders.horizontal).toBeDefined()
    expect(asciiArt.borders.vertical).toBeDefined()
  })
})