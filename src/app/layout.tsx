import type { Metadata, Viewport } from 'next'
import './globals.css'
import './webtui.css'
import { ThemeProvider, DEFAULT_THEME } from '../components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Terminal Email Client',
  description: 'A terminal-style email client built with Next.js and WebTUI',
  keywords: ['email', 'terminal', 'client', 'webtui', 'nextjs'],
  authors: [{ name: 'Terminal Email Client' }],
  creator: 'Terminal Email Client',
  publisher: 'Terminal Email Client',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-webtui-theme={DEFAULT_THEME} className="dark">
      <head>
        <meta name="theme-color" content={viewport.themeColor} />
        <meta name="color-scheme" content={viewport.colorScheme} />
        {/* Load critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Fallback for browsers that don't support CSS custom properties */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Fallback styles for older browsers */
            @supports not (color: var(--terminal-bg)) {
              body {
                background-color: #000000;
                color: #00ff00;
                font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
              }
            }
          `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme={DEFAULT_THEME}>
          {/* Terminal-style application container */}
          <div id="terminal-root" className="min-h-screen bg-terminal-bg text-terminal-fg">
            {children}
          </div>
        </ThemeProvider>
        {/* Screen reader accessibility improvements */}
        <div id="sr-only-announcements" className="sr-only" aria-live="polite" aria-atomic="true"></div>
      </body>
    </html>
  )
}