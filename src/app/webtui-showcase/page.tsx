'use client'

import React, { useState, useEffect } from 'react'

export default function WebTUIShowcase() {
    const [activeTab, setActiveTab] = useState('themes')
    const [switchChecked, setSwitchChecked] = useState(false)
    const [rangeValue, setRangeValue] = useState(50)
    const [radioValue, setRadioValue] = useState('option1')
    const [currentTheme, setCurrentTheme] = useState('dark')

    const tabs = [
        { id: 'themes', label: 'Themes' },
        { id: 'typography', label: 'Typography' },
        { id: 'forms', label: 'Forms' },
        { id: 'buttons', label: 'Buttons & Badges' },
        { id: 'tables', label: 'Tables' },
        { id: 'interactive', label: 'Interactive' },
        { id: 'layout', label: 'Layout' }
    ]

    const themes = [
        { id: 'dark', label: 'Default Dark', import: null },
        { id: 'light', label: 'Default Light', import: null },
        { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', import: '@webtui/theme-catppuccin' },
        { id: 'catppuccin-macchiato', label: 'Catppuccin Macchiato', import: '@webtui/theme-catppuccin' },
        { id: 'catppuccin-frappe', label: 'Catppuccin Frappe', import: '@webtui/theme-catppuccin' },
        { id: 'catppuccin-latte', label: 'Catppuccin Latte', import: '@webtui/theme-catppuccin' },
        { id: 'everforest-dark-medium', label: 'Everforest Dark', import: '@webtui/theme-everforest' },
        { id: 'everforest-light-medium', label: 'Everforest Light', import: '@webtui/theme-everforest' },
        { id: 'gruvbox-dark-medium', label: 'Gruvbox Dark', import: '@webtui/theme-gruvbox' },
        { id: 'gruvbox-light-medium', label: 'Gruvbox Light', import: '@webtui/theme-gruvbox' },
        { id: 'nord', label: 'Nord', import: '@webtui/theme-nord' },
        { id: 'vitesse-dark', label: 'Vitesse Dark', import: '@webtui/theme-vitesse' },
        { id: 'vitesse-light', label: 'Vitesse Light', import: '@webtui/theme-vitesse' }
    ]

    // Apply theme to document
    useEffect(() => {
        const html = document.documentElement
        
        // Remove existing theme classes
        html.classList.remove('theme-light', 'theme-dark')
        
        // Set WebTUI theme attribute
        html.setAttribute('data-webtui-theme', currentTheme)
        
        // Add appropriate theme class for our terminal system
        if (currentTheme.includes('light') || currentTheme === 'catppuccin-latte') {
            html.classList.add('theme-light')
        } else {
            html.classList.add('theme-dark')
        }
        
        // Force a repaint to ensure theme changes are applied
        html.style.display = 'none'
        html.offsetHeight // Trigger reflow
        html.style.display = ''
    }, [currentTheme])

    return (
        <div className="min-h-screen" style={{ fontFamily: 'monospace' }}>
            {/* Import WebTUI CSS */}
            <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/base.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/typography.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/badge.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/button.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/checkbox.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/input.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/radio.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/range.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/switch.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/textarea.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/table.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/pre.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/separator.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/spinner.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/dialog.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/popover.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/components/tooltip.css');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/css@latest/utils/box.css');
        
        /* Theme imports - these should be loaded after base components */
        @import url('https://cdn.jsdelivr.net/npm/@webtui/theme-catppuccin@latest');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/theme-everforest@latest');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/theme-gruvbox@latest');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/theme-nord@latest');
        @import url('https://cdn.jsdelivr.net/npm/@webtui/theme-vitesse@latest');
      `}</style>

            {/* Header */}
            <header style={{ padding: '1rem', borderBottom: '1px solid var(--foreground2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>WebTUI Components Showcase</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--foreground1)' }}>Theme:</label>
                            <select
                                value={currentTheme}
                                onChange={(e) => setCurrentTheme(e.target.value)}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: 'var(--background1)',
                                    color: 'var(--foreground0)',
                                    border: '1px solid var(--foreground2)',
                                    fontFamily: 'inherit',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {themes.map((theme) => (
                                    <option key={theme.id} value={theme.id}>
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--foreground1)' }}>
                            Terminal Email Client • Component Library Demo
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
                {/* Navigation Sidebar */}
                <nav style={{
                    width: '16rem',
                    borderRight: '1px solid var(--foreground2)',
                    padding: '1rem',
                    backgroundColor: 'var(--background1)'
                }}>
                    <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>COMPONENTS</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {tabs.map((tab) => (
                            <li key={tab.id} style={{ marginBottom: '0.25rem' }}>
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.5rem',
                                        border: 'none',
                                        backgroundColor: activeTab === tab.id ? 'var(--background2)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--foreground0)' : 'var(--foreground1)',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.target.style.backgroundColor = 'var(--background2)'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.target.style.backgroundColor = 'transparent'
                                        }
                                    }}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
                    {activeTab === 'themes' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>WebTUI Themes</h2>
                                <p style={{ marginBottom: '2rem', color: 'var(--foreground1)' }}>
                                    WebTUI supports multiple themes to customize the appearance of your terminal-style interfaces.
                                    Select a theme from the dropdown in the header to see how it affects all components.
                                </p>

                                {/* Theme Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {/* Default Themes */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Default Themes</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setCurrentTheme('dark')}
                                                style={{
                                                    padding: '0.5rem',
                                                    textAlign: 'left',
                                                    backgroundColor: currentTheme === 'dark' ? 'var(--background2)' : 'transparent',
                                                    border: '1px solid var(--foreground2)',
                                                    color: 'var(--foreground0)',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit'
                                                }}
                                            >
                                                Dark Theme
                                            </button>
                                            <button
                                                onClick={() => setCurrentTheme('light')}
                                                style={{
                                                    padding: '0.5rem',
                                                    textAlign: 'left',
                                                    backgroundColor: currentTheme === 'light' ? 'var(--background2)' : 'transparent',
                                                    border: '1px solid var(--foreground2)',
                                                    color: 'var(--foreground0)',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit'
                                                }}
                                            >
                                                Light Theme
                                            </button>
                                        </div>
                                    </div>

                                    {/* Catppuccin Themes */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Catppuccin</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground1)', marginBottom: '1rem' }}>
                                            Soothing pastel theme with multiple flavors
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {['catppuccin-mocha', 'catppuccin-macchiato', 'catppuccin-frappe', 'catppuccin-latte'].map(theme => (
                                                <button
                                                    key={theme}
                                                    onClick={() => setCurrentTheme(theme)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        textAlign: 'left',
                                                        backgroundColor: currentTheme === theme ? 'var(--background2)' : 'transparent',
                                                        border: '1px solid var(--foreground2)',
                                                        color: 'var(--foreground0)',
                                                        cursor: 'pointer',
                                                        fontFamily: 'inherit'
                                                    }}
                                                >
                                                    {theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Everforest Themes */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Everforest</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground1)', marginBottom: '1rem' }}>
                                            Green-tinted theme inspired by forests
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {['everforest-dark-medium', 'everforest-light-medium'].map(theme => (
                                                <button
                                                    key={theme}
                                                    onClick={() => setCurrentTheme(theme)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        textAlign: 'left',
                                                        backgroundColor: currentTheme === theme ? 'var(--background2)' : 'transparent',
                                                        border: '1px solid var(--foreground2)',
                                                        color: 'var(--foreground0)',
                                                        cursor: 'pointer',
                                                        fontFamily: 'inherit'
                                                    }}
                                                >
                                                    {theme.includes('dark') ? 'Everforest Dark' : 'Everforest Light'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gruvbox Themes */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Gruvbox</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground1)', marginBottom: '1rem' }}>
                                            Retro groove colors with warm contrast
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {['gruvbox-dark-medium', 'gruvbox-light-medium'].map(theme => (
                                                <button
                                                    key={theme}
                                                    onClick={() => setCurrentTheme(theme)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        textAlign: 'left',
                                                        backgroundColor: currentTheme === theme ? 'var(--background2)' : 'transparent',
                                                        border: '1px solid var(--foreground2)',
                                                        color: 'var(--foreground0)',
                                                        cursor: 'pointer',
                                                        fontFamily: 'inherit'
                                                    }}
                                                >
                                                    {theme.includes('dark') ? 'Gruvbox Dark' : 'Gruvbox Light'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nord Theme */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Nord</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground1)', marginBottom: '1rem' }}>
                                            Arctic, north-bluish color palette
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setCurrentTheme('nord')}
                                                style={{
                                                    padding: '0.5rem',
                                                    textAlign: 'left',
                                                    backgroundColor: currentTheme === 'nord' ? 'var(--background2)' : 'transparent',
                                                    border: '1px solid var(--foreground2)',
                                                    color: 'var(--foreground0)',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit'
                                                }}
                                            >
                                                Nord
                                            </button>
                                        </div>
                                    </div>

                                    {/* Vitesse Themes */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Vitesse</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground1)', marginBottom: '1rem' }}>
                                            Modern theme with clean aesthetics
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {['vitesse-dark', 'vitesse-light'].map(theme => (
                                                <button
                                                    key={theme}
                                                    onClick={() => setCurrentTheme(theme)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        textAlign: 'left',
                                                        backgroundColor: currentTheme === theme ? 'var(--background2)' : 'transparent',
                                                        border: '1px solid var(--foreground2)',
                                                        color: 'var(--foreground0)',
                                                        cursor: 'pointer',
                                                        fontFamily: 'inherit'
                                                    }}
                                                >
                                                    {theme.includes('dark') ? 'Vitesse Dark' : 'Vitesse Light'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Theme Preview Section */}
                                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Current Theme Preview</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Typography</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <h1 style={{ fontSize: '1.5rem' }}>Heading 1</h1>
                                                <h2 style={{ fontSize: '1.25rem' }}>Heading 2</h2>
                                                <p>Regular text with <strong>bold</strong>, <em>italic</em>, and <code>code</code> elements.</p>
                                                <p><a href="#">This is a link</a> in the current theme.</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Components</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                                                <button>Button</button>
                                                <button variant-="background1">Variant</button>
                                                <span is-="badge">Badge</span>
                                                <span is-="badge" variant-="background1">Badge Variant</span>
                                                <span is-="spinner"></span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Form Elements</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                                <input type="text" placeholder="Input field" style={{ width: '150px' }} />
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input type="checkbox" />
                                                    Checkbox
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input type="radio" name="theme-preview" />
                                                    Radio
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Installation Instructions */}
                                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--foreground2)', borderRadius: '4px' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Installation</h3>
                                    <p style={{ marginBottom: '1rem', color: 'var(--foreground1)' }}>
                                        To use these themes in your project, install the theme packages and import them after your base WebTUI CSS:
                                    </p>
                                    <pre style={{ padding: '1rem', backgroundColor: 'var(--background1)', overflow: 'auto', fontSize: '0.875rem' }}>
                                        {`# Install theme packages
npm install @webtui/theme-catppuccin
npm install @webtui/theme-everforest
npm install @webtui/theme-gruvbox
npm install @webtui/theme-nord
npm install @webtui/theme-vitesse

# In your CSS
@import "@webtui/css/base.css";
@import "@webtui/css/components/typography.css";
/* ... other components ... */

/* Import themes after base styles */
@import "@webtui/theme-catppuccin";
@import "@webtui/theme-everforest";
/* ... other themes ... */`}
                                    </pre>
                                    <p style={{ marginTop: '1rem', color: 'var(--foreground1)' }}>
                                        Then set the <code>data-webtui-theme</code> attribute on your HTML element:
                                    </p>
                                    <pre style={{ padding: '1rem', backgroundColor: 'var(--background1)', overflow: 'auto', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        {`<html data-webtui-theme="catppuccin-mocha">
  <!-- Your content -->
</html>`}
                                    </pre>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'typography' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Typography Components</h2>

                                {/* Headings */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Headings</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <h1>H1 - Main Email Subject</h1>
                                        <h2>H2 - Email Thread Title</h2>
                                        <h3>H3 - Section Header</h3>
                                        <h4>H4 - Subsection</h4>
                                        <h5>H5 - Minor Header</h5>
                                        <h6>H6 - Tiny Header</h6>
                                    </div>
                                </div>

                                {/* Text Elements */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Text Elements</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <p>
                                            This is a regular paragraph with <strong>bold text</strong>, <em>italic text</em>,
                                            and <code>inline code</code>. You can also have <a href="#">links</a>
                                            that follow the terminal color scheme.
                                        </p>

                                        <blockquote style={{ borderLeft: '4px solid var(--foreground2)', paddingLeft: '1rem', fontStyle: 'italic', color: 'var(--foreground1)' }}>
                                            "This is a blockquote that might be used for email signatures or quoted text
                                            from previous messages in a thread."
                                        </blockquote>

                                        <pre style={{ padding: '1rem', backgroundColor: 'var(--background1)', overflow: 'auto' }}>
                                            {`// Code block example
function sendEmail(recipient, subject, body) {
  return fetch('/api/send', {
    method: 'POST',
    body: JSON.stringify({ recipient, subject, body })
  });
}`}
                                        </pre>

                                        {/* Lists */}
                                        <div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Unordered List</h4>
                                            <ul>
                                                <li>Inbox (42)</li>
                                                <li>Sent Messages</li>
                                                <li>Drafts (3)</li>
                                                <li>Spam</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Ordered List</h4>
                                            <ol>
                                                <li>Compose new email</li>
                                                <li>Add recipients</li>
                                                <li>Write subject and body</li>
                                                <li>Send message</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'forms' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Form Components</h2>

                                {/* Input Fields */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Input Fields</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address:</label>
                                            <input type="email" placeholder="user@example.com" style={{ width: '100%' }} />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subject:</label>
                                            <input type="text" placeholder="Enter email subject" style={{ width: '100%' }} />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Search:</label>
                                            <input type="search" placeholder="Search emails..." style={{ width: '100%' }} />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
                                            <input type="password" placeholder="Enter password" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Textarea */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Textarea</h3>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Body:</label>
                                        <textarea
                                            rows={6}
                                            placeholder="Type your email message here..."
                                            style={{ width: '100%', resize: 'vertical' }}
                                        />
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Checkboxes</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input type="checkbox" defaultChecked />
                                            Mark as important
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input type="checkbox" />
                                            Send read receipt
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input type="checkbox" disabled />
                                            Archive after sending (disabled)
                                        </label>
                                    </div>
                                </div>

                                {/* Radio Buttons */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Radio Buttons</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="low"
                                                checked={radioValue === 'low'}
                                                onChange={(e) => setRadioValue(e.target.value)}
                                            />
                                            Low Priority
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="normal"
                                                checked={radioValue === 'normal'}
                                                onChange={(e) => setRadioValue(e.target.value)}
                                            />
                                            Normal Priority
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="radio"
                                                name="priority"
                                                value="high"
                                                checked={radioValue === 'high'}
                                                onChange={(e) => setRadioValue(e.target.value)}
                                            />
                                            High Priority
                                        </label>
                                    </div>
                                </div>

                                {/* Switch */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Switch</h3>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            is-="switch"
                                            checked={switchChecked}
                                            onChange={(e) => setSwitchChecked(e.target.checked)}
                                        />
                                        Enable notifications
                                    </label>
                                </div>

                                {/* Range */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Range Slider</h3>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                            Font Size: {rangeValue}px
                                        </label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="24"
                                            value={rangeValue}
                                            onChange={(e) => setRangeValue(e.target.value)}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'buttons' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Buttons & Badges</h2>

                                {/* Buttons */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Buttons</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <button>Default</button>
                                        <button variant-="background1">Background1</button>
                                        <button variant-="background2">Background2</button>
                                        <button variant-="foreground0">Foreground0</button>
                                        <button variant-="foreground1">Foreground1</button>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <button size-="small">Small</button>
                                        <button>Default Size</button>
                                        <button size-="large">Large</button>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <button disabled>Disabled</button>
                                        <button box-="round">Rounded</button>
                                        <button box-="square">Square</button>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Badges</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <span is-="badge">Default</span>
                                        <span is-="badge" variant-="background0">Background0</span>
                                        <span is-="badge" variant-="background1">Background1</span>
                                        <span is-="badge" variant-="background2">Background2</span>
                                        <span is-="badge" variant-="foreground0">Foreground0</span>
                                        <span is-="badge" variant-="foreground1">Foreground1</span>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <span is-="badge" cap-="square">Square</span>
                                        <span is-="badge" cap-="round">Round</span>
                                        <span is-="badge" cap-="triangle">Triangle</span>
                                        <span is-="badge" cap-="ribbon">Ribbon</span>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <span is-="badge" cap-="square round">Mixed Caps</span>
                                        <span is-="badge" cap-="triangle ribbon">Triangle Ribbon</span>
                                    </div>
                                </div>

                                {/* Spinners */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Spinners</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span is-="spinner"></span>
                                            <span>Default</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span is-="spinner" variant-="dots"></span>
                                            <span>Dots</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span is-="spinner" variant-="arrows"></span>
                                            <span>Arrows</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span is-="spinner" variant-="cross"></span>
                                            <span>Cross</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'tables' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Table Components</h2>

                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Email List Table</h3>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>From</th>
                                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Subject</th>
                                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
                                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '0.5rem' }}>john@example.com</td>
                                                <td style={{ padding: '0.5rem' }}>Project Update</td>
                                                <td style={{ padding: '0.5rem' }}>2025-01-18</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <span is-="badge" variant-="background1">Unread</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem' }}>sarah@company.com</td>
                                                <td style={{ padding: '0.5rem' }}>Meeting Tomorrow</td>
                                                <td style={{ padding: '0.5rem' }}>2025-01-17</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <span is-="badge" variant-="foreground1">Read</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem' }}>noreply@service.com</td>
                                                <td style={{ padding: '0.5rem' }}>Account Verification</td>
                                                <td style={{ padding: '0.5rem' }}>2025-01-16</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <span is-="badge" variant-="background2">Important</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Interactive Components</h2>

                                {/* Dialog */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Dialog</h3>
                                    <button popovertarget="demo-dialog">Open Dialog</button>
                                    <dialog id="demo-dialog" popover style={{ padding: '1rem', backgroundColor: 'var(--background1)', border: '1px solid var(--foreground2)' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '1rem' }}>Confirm Delete</h4>
                                            <p style={{ marginBottom: '1rem' }}>Are you sure you want to delete this email?</p>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button>Cancel</button>
                                                <button variant-="background2">Delete</button>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>

                                {/* Popover */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Popover</h3>
                                    <details is-="popover">
                                        <summary>Click for Options</summary>
                                        <div style={{ padding: '1rem', backgroundColor: 'var(--background1)', border: '1px solid var(--foreground2)' }}>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                <li><button style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem' }}>Reply</button></li>
                                                <li><button style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem' }}>Forward</button></li>
                                                <li><button style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem' }}>Archive</button></li>
                                                <li><button style={{ width: '100%', textAlign: 'left' }}>Delete</button></li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>

                                {/* Tooltip */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Tooltip</h3>
                                    <div is-="tooltip">
                                        <span is-="tooltip-trigger badge" variant-="background2">Hover me</span>
                                        <div is-="tooltip-content" style={{ padding: '0.5rem', backgroundColor: 'var(--background1)', border: '1px solid var(--foreground2)' }}>
                                            This is a helpful tooltip!
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <section>
                                <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Layout Components</h2>

                                {/* Separators */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Separators</h3>
                                    <div>
                                        <p>Content above separator</p>
                                        <div is-="separator" style={{ margin: '1rem 0' }}></div>
                                        <p>Content below separator</p>
                                    </div>

                                    <div style={{ display: 'flex', height: '4rem', marginTop: '1rem' }}>
                                        <div style={{ flex: 1, padding: '1rem' }}>Left content</div>
                                        <div is-="separator" direction-="vertical"></div>
                                        <div style={{ flex: 1, padding: '1rem' }}>Right content</div>
                                    </div>
                                </div>

                                {/* Pre-formatted text */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Pre-formatted Text</h3>
                                    <pre style={{ padding: '1rem', backgroundColor: 'var(--background1)' }}>
                                        {`Email Headers:
From: user@example.com
To: recipient@domain.com
Subject: Terminal Email Client Demo
Date: Sat, 18 Jan 2025 10:30:00 +0000
Message-ID: <abc123@example.com>`}
                                    </pre>
                                </div>

                                {/* Email Client Layout Demo */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--foreground2)' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Email Client Layout Demo</h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '200px 1fr 300px',
                                        gridTemplateRows: '40px 1fr',
                                        gap: '1px',
                                        height: '400px',
                                        backgroundColor: 'var(--foreground2)'
                                    }}>
                                        {/* Header */}
                                        <div style={{
                                            gridColumn: '1 / -1',
                                            backgroundColor: 'var(--background1)',
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>Terminal Email Client</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span is-="spinner" variant-="dots"></span>
                                                <span style={{ fontSize: '0.875rem' }}>Syncing...</span>
                                            </div>
                                        </div>

                                        {/* Sidebar */}
                                        <div style={{ backgroundColor: 'var(--background0)', padding: '1rem' }}>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Folders</h4>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                                                <li style={{ marginBottom: '0.25rem' }}>📥 Inbox (12)</li>
                                                <li style={{ marginBottom: '0.25rem' }}>📤 Sent</li>
                                                <li style={{ marginBottom: '0.25rem' }}>📝 Drafts (2)</li>
                                                <li style={{ marginBottom: '0.25rem' }}>🗑️ Trash</li>
                                            </ul>
                                        </div>

                                        {/* Email List */}
                                        <div style={{ backgroundColor: 'var(--background1)', padding: '1rem', overflow: 'auto' }}>
                                            <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--foreground2)' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>John Doe</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--foreground1)' }}>Project Update - Let's discuss the latest changes...</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--foreground2)' }}>2 hours ago</div>
                                            </div>
                                            <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--foreground2)' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Sarah Wilson</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--foreground1)' }}>Meeting Tomorrow - Don't forget about our 2pm meeting...</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--foreground2)' }}>1 day ago</div>
                                            </div>
                                        </div>

                                        {/* Email Preview */}
                                        <div style={{ backgroundColor: 'var(--background0)', padding: '1rem', overflow: 'auto' }}>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h4 style={{ marginBottom: '0.5rem' }}>Project Update</h4>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--foreground1)', marginBottom: '0.5rem' }}>
                                                    From: john@example.com<br />
                                                    To: me@company.com<br />
                                                    Date: Jan 18, 2025 10:30 AM
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                                                <p>Hi there,</p>
                                                <p>I wanted to update you on the latest project developments...</p>
                                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                    <button size-="small">Reply</button>
                                                    <button size-="small">Forward</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
