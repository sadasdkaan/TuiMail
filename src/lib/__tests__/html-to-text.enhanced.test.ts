import { htmlToText, stripHtmlTags, preserveFormatting, convertLinks, convertLists } from '../html-to-text'

describe('HTML to Text Conversion - Enhanced Tests', () => {
  describe('htmlToText - Main Function', () => {
    it('should handle empty and null inputs', () => {
      expect(htmlToText('')).toBe('')
      expect(htmlToText(null as any)).toBe('')
      expect(htmlToText(undefined as any)).toBe('')
    })

    it('should convert basic HTML elements', () => {
      const html = '<p>Hello <strong>world</strong>!</p>'
      const result = htmlToText(html)
      expect(result).toBe('Hello **world**!')
    })

    it('should handle nested HTML elements', () => {
      const html = '<div><p>Paragraph 1</p><p>Paragraph 2</p></div>'
      const result = htmlToText(html)
      expect(result).toBe('Paragraph 1\n\nParagraph 2')
    })

    it('should preserve line breaks and spacing', () => {
      const html = '<p>Line 1</p><br><p>Line 2</p>'
      const result = htmlToText(html)
      expect(result).toBe('Line 1\n\nLine 2')
    })

    it('should handle complex email HTML structure', () => {
      const html = `
        <html>
          <body>
            <div>
              <h1>Email Subject</h1>
              <p>Dear <em>John</em>,</p>
              <p>This is a <strong>test</strong> email with:</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
              <p>Best regards,<br>Team</p>
            </div>
          </body>
        </html>
      `
      const result = htmlToText(html)
      expect(result).toContain('# Email Subject')
      expect(result).toContain('Dear *John*,')
      expect(result).toContain('**test**')
      expect(result).toContain('• Item 1')
      expect(result).toContain('• Item 2')
    })

    it('should handle malformed HTML gracefully', () => {
      const html = '<p>Unclosed paragraph<div>Nested without closing</p>'
      const result = htmlToText(html)
      expect(result).toBe('Unclosed paragraph\n\nNested without closing')
    })

    it('should remove script and style tags completely', () => {
      const html = `
        <p>Visible text</p>
        <script>alert('malicious')</script>
        <style>body { color: red; }</style>
        <p>More visible text</p>
      `
      const result = htmlToText(html)
      expect(result).toBe('Visible text\n\nMore visible text')
      expect(result).not.toContain('alert')
      expect(result).not.toContain('color: red')
    })
  })

  describe('stripHtmlTags', () => {
    it('should remove all HTML tags', () => {
      const html = '<p>Hello <strong>world</strong>!</p>'
      const result = stripHtmlTags(html)
      expect(result).toBe('Hello world!')
    })

    it('should handle self-closing tags', () => {
      const html = 'Line 1<br/>Line 2<hr/>Line 3'
      const result = stripHtmlTags(html)
      expect(result).toBe('Line 1Line 2Line 3')
    })

    it('should handle tags with attributes', () => {
      const html = '<a href="https://example.com" class="link">Click here</a>'
      const result = stripHtmlTags(html)
      expect(result).toBe('Click here')
    })

    it('should handle malformed tags', () => {
      const html = '<p>Text with <unclosed tag and >weird< formatting'
      const result = stripHtmlTags(html)
      expect(result).toBe('Text with  formatting')
    })
  })

  describe('preserveFormatting', () => {
    it('should convert headings to markdown-style', () => {
      const html = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>'
      const result = preserveFormatting(html)
      expect(result).toContain('# Title')
      expect(result).toContain('## Subtitle')
      expect(result).toContain('### Section')
    })

    it('should convert emphasis tags', () => {
      const html = '<strong>Bold</strong> and <em>italic</em> and <b>bold2</b> and <i>italic2</i>'
      const result = preserveFormatting(html)
      expect(result).toContain('**Bold**')
      expect(result).toContain('*italic*')
      expect(result).toContain('**bold2**')
      expect(result).toContain('*italic2*')
    })

    it('should handle code elements', () => {
      const html = 'Use <code>console.log()</code> for debugging'
      const result = preserveFormatting(html)
      expect(result).toContain('`console.log()`')
    })

    it('should handle preformatted text', () => {
      const html = '<pre>function test() {\n  return true;\n}</pre>'
      const result = preserveFormatting(html)
      expect(result).toContain('```\nfunction test() {\n  return true;\n}\n```')
    })

    it('should handle blockquotes', () => {
      const html = '<blockquote>This is a quote</blockquote>'
      const result = preserveFormatting(html)
      expect(result).toContain('> This is a quote')
    })

    it('should handle nested formatting', () => {
      const html = '<strong>Bold with <em>italic</em> inside</strong>'
      const result = preserveFormatting(html)
      expect(result).toBe('**Bold with *italic* inside**')
    })
  })

  describe('convertLinks', () => {
    it('should convert simple links', () => {
      const html = '<a href="https://example.com">Example</a>'
      const result = convertLinks(html)
      expect(result).toBe('Example (https://example.com)')
    })

    it('should handle links without text', () => {
      const html = '<a href="https://example.com"></a>'
      const result = convertLinks(html)
      expect(result).toBe('https://example.com')
    })

    it('should handle links with same text as URL', () => {
      const html = '<a href="https://example.com">https://example.com</a>'
      const result = convertLinks(html)
      expect(result).toBe('https://example.com')
    })

    it('should handle multiple links', () => {
      const html = 'Visit <a href="https://example.com">Example</a> or <a href="https://test.com">Test</a>'
      const result = convertLinks(html)
      expect(result).toBe('Visit Example (https://example.com) or Test (https://test.com)')
    })

    it('should handle email links', () => {
      const html = '<a href="mailto:test@example.com">Contact us</a>'
      const result = convertLinks(html)
      expect(result).toBe('Contact us (test@example.com)')
    })

    it('should handle relative URLs', () => {
      const html = '<a href="/path/to/page">Internal link</a>'
      const result = convertLinks(html)
      expect(result).toBe('Internal link (/path/to/page)')
    })

    it('should handle links with complex attributes', () => {
      const html = '<a href="https://example.com" target="_blank" class="external">Example</a>'
      const result = convertLinks(html)
      expect(result).toBe('Example (https://example.com)')
    })
  })

  describe('convertLists', () => {
    it('should convert unordered lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>'
      const result = convertLists(html)
      expect(result).toBe('• Item 1\n• Item 2\n• Item 3')
    })

    it('should convert ordered lists', () => {
      const html = '<ol><li>First</li><li>Second</li><li>Third</li></ol>'
      const result = convertLists(html)
      expect(result).toBe('1. First\n2. Second\n3. Third')
    })

    it('should handle nested lists', () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2
            <ul>
              <li>Sub item 1</li>
              <li>Sub item 2</li>
            </ul>
          </li>
          <li>Item 3</li>
        </ul>
      `
      const result = convertLists(html)
      expect(result).toContain('• Item 1')
      expect(result).toContain('• Item 2')
      expect(result).toContain('  • Sub item 1')
      expect(result).toContain('  • Sub item 2')
      expect(result).toContain('• Item 3')
    })

    it('should handle mixed list types', () => {
      const html = `
        <ol>
          <li>Ordered item 1</li>
          <li>Ordered item 2
            <ul>
              <li>Unordered sub item</li>
            </ul>
          </li>
        </ol>
      `
      const result = convertLists(html)
      expect(result).toContain('1. Ordered item 1')
      expect(result).toContain('2. Ordered item 2')
      expect(result).toContain('  • Unordered sub item')
    })

    it('should handle empty list items', () => {
      const html = '<ul><li>Item 1</li><li></li><li>Item 3</li></ul>'
      const result = convertLists(html)
      expect(result).toBe('• Item 1\n• \n• Item 3')
    })

    it('should handle lists with complex content', () => {
      const html = `
        <ul>
          <li><strong>Bold item</strong></li>
          <li>Item with <a href="https://example.com">link</a></li>
          <li>Item with <code>code</code></li>
        </ul>
      `
      const result = convertLists(html)
      expect(result).toContain('• **Bold item**')
      expect(result).toContain('• Item with link (https://example.com)')
      expect(result).toContain('• Item with `code`')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle very large HTML documents', () => {
      const largeHtml = '<p>' + 'A'.repeat(10000) + '</p>'
      const result = htmlToText(largeHtml)
      expect(result).toBe('A'.repeat(10000))
    })

    it('should handle HTML with special characters', () => {
      const html = '<p>&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;</p>'
      const result = htmlToText(html)
      expect(result).toBe('<script>alert("test")</script>')
    })

    it('should handle HTML entities', () => {
      const html = '<p>&amp; &lt; &gt; &quot; &#39; &nbsp;</p>'
      const result = htmlToText(html)
      expect(result).toBe('& < > " \' \u00A0')
    })

    it('should handle Unicode characters', () => {
      const html = '<p>Hello 世界 🌍 café naïve résumé</p>'
      const result = htmlToText(html)
      expect(result).toBe('Hello 世界 🌍 café naïve résumé')
    })

    it('should handle deeply nested HTML', () => {
      let html = 'Text'
      for (let i = 0; i < 100; i++) {
        html = `<div>${html}</div>`
      }
      const result = htmlToText(html)
      expect(result).toBe('Text')
    })

    it('should handle HTML with comments', () => {
      const html = '<p>Before<!-- This is a comment -->After</p>'
      const result = htmlToText(html)
      expect(result).toBe('BeforeAfter')
    })

    it('should handle CDATA sections', () => {
      const html = '<p>Before<![CDATA[This is CDATA]]>After</p>'
      const result = htmlToText(html)
      expect(result).toBe('BeforeThis is CDATAAfter')
    })

    it('should handle HTML with DOCTYPE', () => {
      const html = '<!DOCTYPE html><html><body><p>Content</p></body></html>'
      const result = htmlToText(html)
      expect(result).toBe('Content')
    })
  })

  describe('Performance Tests', () => {
    it('should process HTML efficiently', () => {
      const html = '<p>' + 'Test content '.repeat(1000) + '</p>'
      const startTime = performance.now()
      const result = htmlToText(html)
      const endTime = performance.now()
      
      expect(result).toContain('Test content')
      expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
    })

    it('should handle repeated conversions efficiently', () => {
      const html = '<p><strong>Bold</strong> and <em>italic</em> text</p>'
      const startTime = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        htmlToText(html)
      }
      
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(1000) // Should complete 1000 conversions in under 1s
    })
  })

  describe('Real-world Email Examples', () => {
    it('should handle Gmail-style HTML emails', () => {
      const html = `
        <div dir="ltr">
          <div>Hello,</div>
          <div><br></div>
          <div>This is a test email from Gmail.</div>
          <div><br></div>
          <div>Best regards,</div>
          <div>John Doe</div>
        </div>
      `
      const result = htmlToText(html)
      expect(result).toContain('Hello,')
      expect(result).toContain('This is a test email from Gmail.')
      expect(result).toContain('Best regards,')
      expect(result).toContain('John Doe')
    })

    it('should handle Outlook-style HTML emails', () => {
      const html = `
        <div class="WordSection1">
          <p class="MsoNormal">Dear Customer,<o:p></o:p></p>
          <p class="MsoNormal"><o:p>&nbsp;</o:p></p>
          <p class="MsoNormal">Thank you for your inquiry.<o:p></o:p></p>
          <p class="MsoNormal"><o:p>&nbsp;</o:p></p>
          <p class="MsoNormal">Sincerely,<br>Support Team<o:p></o:p></p>
        </div>
      `
      const result = htmlToText(html)
      expect(result).toContain('Dear Customer,')
      expect(result).toContain('Thank you for your inquiry.')
      expect(result).toContain('Sincerely,')
      expect(result).toContain('Support Team')
    })

    it('should handle newsletter-style HTML emails', () => {
      const html = `
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <h1>Newsletter Title</h1>
              <p>Welcome to our monthly newsletter!</p>
              <h2>Article 1</h2>
              <p>This is the first article content...</p>
              <a href="https://example.com/article1">Read more</a>
              <h2>Article 2</h2>
              <p>This is the second article content...</p>
              <a href="https://example.com/article2">Read more</a>
            </td>
          </tr>
        </table>
      `
      const result = htmlToText(html)
      expect(result).toContain('# Newsletter Title')
      expect(result).toContain('## Article 1')
      expect(result).toContain('## Article 2')
      expect(result).toContain('Read more (https://example.com/article1)')
      expect(result).toContain('Read more (https://example.com/article2)')
    })

    it('should handle HTML emails with inline styles', () => {
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p style="font-size: 16px; margin-bottom: 10px;">Styled paragraph</p>
          <div style="background-color: #f0f0f0; padding: 10px;">
            <strong style="color: red;">Important notice</strong>
          </div>
        </div>
      `
      const result = htmlToText(html)
      expect(result).toContain('Styled paragraph')
      expect(result).toContain('**Important notice**')
    })
  })
})