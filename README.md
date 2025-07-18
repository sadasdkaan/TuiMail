# Terminal Email Client

A modern, terminal-inspired email client built with Next.js, React, and TypeScript. This project provides a unique terminal aesthetic while maintaining full accessibility and responsive design.

## Features

- 🖥️ **Terminal Aesthetic**: Retro terminal look with modern functionality
- 📧 **Email Management**: View, compose, and manage emails
- ⌨️ **Keyboard Navigation**: Full keyboard support for power users
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ♿ **Accessibility**: WCAG compliant with screen reader support
- 🎨 **Theme Support**: Multiple terminal color schemes
- 🧪 **Comprehensive Testing**: Unit, integration, and accessibility tests

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules with terminal aesthetics
- **Testing**: Jest + React Testing Library
- **State Management**: React hooks with custom state management
- **Accessibility**: ARIA compliant components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd terminal-email-client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
└── __tests__/          # Test files
```

## Key Components

- **EmailList**: Terminal-style email listing with keyboard navigation
- **EmailViewer**: Email content viewer with HTML-to-text conversion
- **ComposeForm**: Email composition with terminal aesthetics
- **Sidebar**: Navigation sidebar with folder management
- **TerminalAesthetics**: Core terminal styling components

## Testing

The project includes comprehensive testing:

- Unit tests for all components and utilities
- Integration tests for email workflows
- Accessibility tests for WCAG compliance
- Keyboard navigation tests

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by classic terminal interfaces
- Built with modern web accessibility standards
- Designed for keyboard-first navigation