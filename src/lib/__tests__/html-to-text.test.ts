import { 
  htmlToPlainText, 
  convertEmailHtml, 
  convertEmailPreview,
  ConversionOptions 
} from '../html-to-text';

describe('htmlToPlainText', () => {
  it('should handle empty or invalid input', () => {
    expect(htmlToPlainText('')).toBe('');
    expect(htmlToPlainText(null as any)).toBe('');
    expect(htmlToPlainText(undefined as any)).toBe('');
  });

  it('should remove script and style tags completely', () => {
    const html = `
      <div>Content</div>
      <script>alert('test');</script>
      <style>body { color: red; }</style>
      <div>More content</div>
    `;
    const result = htmlToPlainText(html);
    expect(result).not.toContain('alert');
    expect(result).not.toContain('color: red');
    expect(result).toContain('Content');
    expect(result).toContain('More content');
  });

  it('should convert basic HTML elements to plain text', () => {
    const html = '<p>Hello <strong>world</strong>!</p>';
    const result = htmlToPlainText(html);
    expect(result).toBe('Hello **world**!');
  });

  it('should handle paragraphs and line breaks', () => {
    const html = '<p>First paragraph</p><p>Second paragraph</p><br>After break';
    const result = htmlToPlainText(html);
    expect(result).toContain('First paragraph');
    expect(result).toContain('Second paragraph');
    expect(result).toContain('After break');
    expect(result.split('\n').length).toBeGreaterThan(1);
  });

  it('should convert headings with underlines', () => {
    const html = '<h1>Main Title</h1><h2>Subtitle</h2>';
    const result = htmlToPlainText(html);
    expect(result).toContain('Main Title');
    expect(result).toContain('=========='); // Underline for h1
    expect(result).toContain('Subtitle');
  });

  it('should handle unordered lists', () => {
    const html = `
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
    `;
    const result = htmlToPlainText(html);
    expect(result).toContain('• First item');
    expect(result).toContain('• Second item');
    expect(result).toContain('• Third item');
  });

  it('should handle ordered lists', () => {
    const html = `
      <ol>
        <li>First item</li>
        <li>Second item</li>
      </ol>
    `;
    const result = htmlToPlainText(html);
    expect(result).toContain('• First item');
    expect(result).toContain('• Second item');
  });

  it('should handle blockquotes', () => {
    const html = '<blockquote>This is a quote</blockquote>';
    const result = htmlToPlainText(html);
    expect(result).toContain('> This is a quote');
  });

  it('should handle preformatted text', () => {
    const html = '<pre>  Code block\n  with spacing</pre>';
    const result = htmlToPlainText(html);
    expect(result).toContain('Code block');
    expect(result).toContain('with spacing');
  });

  it('should preserve links with URLs by default', () => {
    const html = '<a href="https://example.com">Click here</a>';
    const result = htmlToPlainText(html);
    expect(result).toBe('Click here [https://example.com]');
  });

  it('should not duplicate URLs when link text equals href', () => {
    const html = '<a href="https://example.com">https://example.com</a>';
    const result = htmlToPlainText(html);
    expect(result).toBe('https://example.com');
  });

  it('should handle links without preserving URLs when disabled', () => {
    const html = '<a href="https://example.com">Click here</a>';
    const result = htmlToPlainText(html, { preserveLinks: false });
    expect(result).toBe('Click here');
  });

  it('should handle emphasis tags', () => {
    const html = '<strong>Bold</strong> <em>Italic</em> <u>Underlined</u>';
    const result = htmlToPlainText(html);
    expect(result).toBe('**Bold** *Italic* _Underlined_');
  });

  it('should decode HTML entities', () => {
    const html = 'AT&amp;T &lt;test&gt; &quot;quotes&quot; &nbsp;space';
    const result = htmlToPlainText(html);
    expect(result).toBe('AT&T <test> "quotes" space');
  });

  it('should decode numeric HTML entities', () => {
    const html = '&#65;&#66;&#67; &#x41;&#x42;&#x43;';
    const result = htmlToPlainText(html);
    expect(result).toBe('ABC ABC');
  });

  it('should wrap long lines when maxLineWidth is set', () => {
    const html = '<p>This is a very long line that should be wrapped when the maximum line width is exceeded</p>';
    const result = htmlToPlainText(html, { maxLineWidth: 20 });
    const lines = result.split('\n');
    expect(lines.some(line => line.length <= 20)).toBe(true);
  });

  it('should preserve quote prefixes when wrapping', () => {
    const html = '<blockquote>This is a very long quoted line that should be wrapped while preserving the quote prefix</blockquote>';
    const result = htmlToPlainText(html, { maxLineWidth: 30 });
    const lines = result.split('\n');
    expect(lines.every(line => line.startsWith('> ') || line.trim() === '')).toBe(true);
  });

  it('should handle complex nested HTML', () => {
    const html = `
      <div>
        <h2>Email Subject</h2>
        <p>Dear <strong>John</strong>,</p>
        <p>Please review the following items:</p>
        <ul>
          <li>Item 1 with <em>emphasis</em></li>
          <li>Item 2 with <a href="https://example.com">link</a></li>
        </ul>
        <blockquote>
          This is an important note that should be quoted.
        </blockquote>
        <p>Best regards,<br>Jane</p>
      </div>
    `;
    const result = htmlToPlainText(html);
    
    expect(result).toContain('Email Subject');
    expect(result).toContain('Dear **John**,');
    expect(result).toContain('*emphasis*');
    expect(result).toContain('• Item 2 with link [https://example.com]');
    expect(result).toContain('This is an important note');
    expect(result).toContain('Best regards');
    expect(result).toContain('Jane');
  });
});
describe('convertEmailHtml', () => {
  it('should use default terminal-friendly settings', () => {
    const html = '<p>Hello <strong>world</strong>!</p><a href="https://example.com">Link</a>';
    const result = convertEmailHtml(html);
    expect(result).toContain('**world**');
    expect(result).toContain('[https://example.com]');
  });

  it('should handle typical email HTML structure', () => {
    const html = `
      <html>
        <body>
          <div style="font-family: Arial;">
            <h1>Newsletter</h1>
            <p>Welcome to our newsletter!</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
            </ul>
            <p>Visit our <a href="https://website.com">website</a> for more info.</p>
          </div>
        </body>
      </html>
    `;
    const result = convertEmailHtml(html);
    
    expect(result).toContain('Newsletter');
    expect(result).toContain('Welcome to our newsletter!');
    expect(result).toContain('• Feature 1');
    expect(result).toContain('• Feature 2');
    expect(result).toContain('website [https://website.com]');
  });
});

describe('convertEmailPreview', () => {
  it('should create short preview without links', () => {
    const html = '<p>This is a long email with <a href="https://example.com">links</a> and <strong>formatting</strong>.</p>';
    const result = convertEmailPreview(html, 50);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result).not.toContain('[https://example.com]');
    expect(result).toContain('links');
  });

  it('should truncate with ellipsis when content is too long', () => {
    const html = '<p>This is a very long email content that should be truncated when it exceeds the maximum length specified for the preview.</p>';
    const result = convertEmailPreview(html, 50);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBe(50);
  });

  it('should not truncate short content', () => {
    const html = '<p>Short email</p>';
    const result = convertEmailPreview(html, 50);
    expect(result).toBe('Short email');
    expect(result.endsWith('...')).toBe(false);
  });

  it('should remove extra whitespace in previews', () => {
    const html = '<p>Text   with\n\n   extra    whitespace</p>';
    const result = convertEmailPreview(html);
    expect(result).toBe('Text with extra whitespace');
  });
});

describe('Edge cases and real-world scenarios', () => {
  it('should handle malformed HTML gracefully', () => {
    const html = '<p>Unclosed paragraph<div>Mixed tags</p></div>';
    const result = htmlToPlainText(html);
    expect(result).toContain('Unclosed paragraph');
    expect(result).toContain('Mixed tags');
  });

  it('should handle HTML with no content', () => {
    const html = '<div></div><p></p><span></span>';
    const result = htmlToPlainText(html);
    expect(result.trim()).toBe('');
  });

  it('should handle deeply nested HTML', () => {
    const html = '<div><div><div><p><span><strong>Deep content</strong></span></p></div></div></div>';
    const result = htmlToPlainText(html);
    expect(result).toBe('**Deep content**');
  });

  it('should handle mixed content types', () => {
    const html = `
      Plain text before
      <p>Paragraph content</p>
      More plain text
      <ul><li>List item</li></ul>
      Final plain text
    `;
    const result = htmlToPlainText(html);
    expect(result).toContain('Plain text before');
    expect(result).toContain('Paragraph content');
    expect(result).toContain('More plain text');
    expect(result).toContain('• List item');
    expect(result).toContain('Final plain text');
  });

  it('should handle email signatures', () => {
    const html = `
      <p>Email body content</p>
      <hr>
      <div>
        <strong>John Doe</strong><br>
        Software Engineer<br>
        <a href="mailto:john@example.com">john@example.com</a><br>
        Phone: (555) 123-4567
      </div>
    `;
    const result = htmlToPlainText(html);
    expect(result).toContain('Email body content');
    expect(result).toContain('**John Doe**');
    expect(result).toContain('Software Engineer');
    expect(result).toContain('john@example.com');
    expect(result).toContain('(555) 123-4567');
  });

  it('should handle tables (basic conversion)', () => {
    const html = `
      <table>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
        <tr><td>Cell 3</td><td>Cell 4</td></tr>
      </table>
    `;
    const result = htmlToPlainText(html);
    expect(result).toContain('Cell 1');
    expect(result).toContain('Cell 2');
    expect(result).toContain('Cell 3');
    expect(result).toContain('Cell 4');
  });
});