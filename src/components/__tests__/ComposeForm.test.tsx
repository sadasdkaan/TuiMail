import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComposeForm } from '../ComposeForm'
import { ComposeData } from '@/lib/types'

// Mock the hooks
jest.mock('@/hooks/useGlobalKeyboard', () => ({
  useGlobalKeyboard: jest.fn()
}))

jest.mock('@/hooks/useResponsive', () => ({
  useResponsiveLayout: jest.fn(() => ({
    shouldUseMobileLayout: false,
    getResponsivePadding: jest.fn(() => '16px'),
    getResponsiveTransition: jest.fn(() => '0.15s')
  })),
  useTouchFriendly: jest.fn(() => ({
    minTouchTarget: 44,
    touchSpacing: '0.5rem'
  }))
}))

describe('ComposeForm', () => {
  const mockOnSend = jest.fn()
  const mockOnCancel = jest.fn()
  const mockOnSaveDraft = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    onSend: mockOnSend,
    onCancel: mockOnCancel,
    onSaveDraft: mockOnSaveDraft
  }

  describe('Rendering', () => {
    it('renders the compose form with all required fields', () => {
      render(<ComposeForm {...defaultProps} />)

      expect(screen.getByLabelText(/to:/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/subject:/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message:/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('renders with initial data when provided', () => {
      const initialData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test message body'
      }

      render(<ComposeForm {...defaultProps} initialData={initialData} />)

      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Subject')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test message body')).toBeInTheDocument()
    })

    it('shows CC/BCC fields when toggle is clicked', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const toggleButton = screen.getByRole('button', { name: /show cc\/bcc/i })
      await user.click(toggleButton)

      expect(screen.getByLabelText(/^cc:/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^bcc:/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /hide cc\/bcc/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/recipient is required/i)).toBeInTheDocument()
        expect(screen.getByText(/subject is required/i)).toBeInTheDocument()
        expect(screen.getByText(/message body is required/i)).toBeInTheDocument()
      })

      expect(mockOnSend).not.toHaveBeenCalled()
    })

    it('validates email format in To field', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const toInput = screen.getByLabelText(/to:/i)
      await user.type(toInput, 'invalid-email')

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      })
    })

    it('accepts multiple valid email addresses', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const toInput = screen.getByLabelText(/to:/i)
      const subjectInput = screen.getByLabelText(/subject:/i)
      const bodyInput = screen.getByLabelText(/message:/i)

      // Use fireEvent to directly change the values
      fireEvent.change(toInput, { target: { value: 'test1@example.com, test2@example.com' } })
      fireEvent.change(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.change(bodyInput, { target: { value: 'Test message' } })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledWith({
          to: 'test1@example.com, test2@example.com',
          cc: '',
          bcc: '',
          subject: 'Test Subject',
          body: 'Test message',
          isDraft: false
        })
      })
    })

    it('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      // Trigger validation errors
      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/recipient is required/i)).toBeInTheDocument()
      })

      // Start typing in To field
      const toInput = screen.getByLabelText(/to:/i)
      await user.type(toInput, 'test@example.com')

      await waitFor(() => {
        expect(screen.queryByText(/recipient is required/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('calls onSend with form data when form is valid', async () => {
      const user = userEvent.setup()
      render(
        <ComposeForm 
          {...defaultProps} 
          initialData={{
            to: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test message'
          }}
        />
      )

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledWith({
          to: 'test@example.com',
          cc: '',
          bcc: '',
          subject: 'Test Subject',
          body: 'Test message',
          isDraft: false
        })
      })
    })

    it('includes CC and BCC when provided', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      // Show CC/BCC fields
      await user.click(screen.getByRole('button', { name: /show cc\/bcc/i }))

      const toInput = screen.getByLabelText(/to:/i)
      const ccInput = screen.getByLabelText(/^cc:/i)
      const bccInput = screen.getByLabelText(/^bcc:/i)
      const subjectInput = screen.getByLabelText(/subject:/i)
      const bodyInput = screen.getByLabelText(/message:/i)

      // Use fireEvent to directly change the values
      fireEvent.change(toInput, { target: { value: 'test@example.com' } })
      fireEvent.change(ccInput, { target: { value: 'cc@example.com' } })
      fireEvent.change(bccInput, { target: { value: 'bcc@example.com' } })
      fireEvent.change(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.change(bodyInput, { target: { value: 'Test message' } })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledWith({
          to: 'test@example.com',
          cc: 'cc@example.com',
          bcc: 'bcc@example.com',
          subject: 'Test Subject',
          body: 'Test message',
          isDraft: false
        })
      })
    })

    it('shows loading state during submission', async () => {
      // Test with loading prop set to true
      render(<ComposeForm {...defaultProps} loading={true} />)
      
      // Check if loading overlay is shown
      expect(screen.getByText(/processing/i)).toBeInTheDocument()
    })
  })

  describe('Draft Functionality', () => {
    it('calls onSaveDraft when save draft button is clicked', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const toInput = screen.getByLabelText(/to:/i)
      const subjectInput = screen.getByLabelText(/subject:/i)
      const bodyInput = screen.getByLabelText(/message:/i)

      // Use fireEvent to directly change the values
      fireEvent.change(toInput, { target: { value: 'test@example.com' } })
      fireEvent.change(subjectInput, { target: { value: 'Draft Subject' } })
      fireEvent.change(bodyInput, { target: { value: 'Draft message' } })

      const draftButton = screen.getByRole('button', { name: /save draft/i })
      await user.click(draftButton)

      expect(mockOnSaveDraft).toHaveBeenCalledWith({
        to: 'test@example.com',
        cc: '',
        bcc: '',
        subject: 'Draft Subject',
        body: 'Draft message',
        isDraft: true
      })
    })
  })

  describe('Cancel Functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('handles Escape key for cancel', () => {
      render(<ComposeForm {...defaultProps} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('does not handle Escape when modifier keys are pressed', () => {
      render(<ComposeForm {...defaultProps} />)

      fireEvent.keyDown(document, { key: 'Escape', ctrlKey: true })

      expect(mockOnCancel).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<ComposeForm {...defaultProps} />)

      expect(screen.getByLabelText(/to:/i)).toHaveAttribute('aria-invalid', 'false')
      expect(screen.getByLabelText(/subject:/i)).toHaveAttribute('aria-invalid', 'false')
      expect(screen.getByLabelText(/message:/i)).toHaveAttribute('aria-invalid', 'false')
    })

    it('sets aria-invalid to true for fields with errors', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByLabelText(/to:/i)).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByLabelText(/subject:/i)).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByLabelText(/message:/i)).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('associates error messages with form fields', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      await waitFor(() => {
        const toInput = screen.getByLabelText(/to:/i)
        const errorId = toInput.getAttribute('aria-describedby')
        expect(errorId).toBeTruthy()
        expect(screen.getAllByRole('alert')[0]).toHaveAttribute('id', errorId)
      })
    })

    it('provides screen reader instructions', () => {
      render(<ComposeForm {...defaultProps} />)

      expect(screen.getByText(/ctrl\+enter to send/i)).toBeInTheDocument()
    })
  })

  describe('Character Count', () => {
    it('displays character count for message body', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const bodyInput = screen.getByLabelText(/message:/i)
      await user.type(bodyInput, 'Hello world')

      expect(screen.getByText('11 characters')).toBeInTheDocument()
    })

    it('updates character count as user types', async () => {
      const user = userEvent.setup()
      render(<ComposeForm {...defaultProps} />)

      const bodyInput = screen.getByLabelText(/message:/i)
      
      await user.type(bodyInput, 'Hello')
      expect(screen.getByText('5 characters')).toBeInTheDocument()

      await user.type(bodyInput, ' world!')
      expect(screen.getByText('12 characters')).toBeInTheDocument()
    })
  })

  describe('Auto Focus', () => {
    it('focuses the first empty field by default', () => {
      render(<ComposeForm {...defaultProps} autoFocus={true} />)

      expect(screen.getByLabelText(/to:/i)).toHaveFocus()
    })

    it('focuses subject field when To is pre-filled', () => {
      render(
        <ComposeForm 
          {...defaultProps} 
          initialData={{ to: 'test@example.com' }}
          autoFocus={true} 
        />
      )

      expect(screen.getByLabelText(/subject:/i)).toHaveFocus()
    })

    it('focuses body field when To and Subject are pre-filled', () => {
      render(
        <ComposeForm 
          {...defaultProps} 
          initialData={{ 
            to: 'test@example.com',
            subject: 'Test Subject'
          }}
          autoFocus={true} 
        />
      )

      expect(screen.getByLabelText(/message:/i)).toHaveFocus()
    })

    it('does not auto-focus when autoFocus is false', () => {
      render(<ComposeForm {...defaultProps} autoFocus={false} />)

      expect(screen.getByLabelText(/to:/i)).not.toHaveFocus()
    })
  })
})