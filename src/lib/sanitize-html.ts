/**
 * HTML Sanitization utilities for dynamic content
 * Use this for any content from CMS or external sources that will be rendered with set:html
 */

// Allowed HTML tags for rich content (markdown-like content)
const ALLOWED_TAGS = new Set([
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'mark',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
]);

// Allowed attributes per tag
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
    'a': new Set(['href', 'title', 'target', 'rel']),
    'img': new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
    'td': new Set(['colspan', 'rowspan']),
    'th': new Set(['colspan', 'rowspan', 'scope']),
    '*': new Set(['class', 'id']), // Allowed on all tags
};

// Dangerous URL protocols
const DANGEROUS_PROTOCOLS = ['javascript:', 'vbscript:', 'data:text/html', 'data:application/'];

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows safe HTML tags while removing dangerous elements and attributes
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    // Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove style tags and their content
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Remove event handlers (onclick, onerror, onload, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');

    // Remove dangerous URL protocols from href and src
    sanitized = sanitized.replace(
        /(href|src)\s*=\s*["']?\s*(javascript:|vbscript:|data:text\/html|data:application\/)[^"'\s>]*/gi,
        '$1=""'
    );

    // Remove iframe, object, embed, form tags
    const dangerousTags = ['iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select'];
    for (const tag of dangerousTags) {
        const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
        sanitized = sanitized.replace(regex, '');
        // Also remove self-closing versions
        sanitized = sanitized.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi'), '');
    }

    // Remove base tag (can hijack links)
    sanitized = sanitized.replace(/<base\b[^>]*>/gi, '');

    // Remove meta refresh
    sanitized = sanitized.replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh[^>]*>/gi, '');

    // Ensure links open safely
    sanitized = sanitized.replace(
        /<a\s+([^>]*?)>/gi,
        (match, attrs) => {
            // Add rel="noopener noreferrer" to external links
            if (!attrs.includes('rel=')) {
                return `<a ${attrs} rel="noopener noreferrer">`;
            }
            return match;
        }
    );

    return sanitized;
}

/**
 * Strips all HTML tags, leaving only text content
 * Use this when you need plain text from HTML
 */
export function stripHtml(html: string): string {
    if (!html) return '';

    return html
        .replace(/<[^>]*>/g, '') // Remove all tags
        .replace(/&nbsp;/g, ' ') // Replace nbsp with space
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
}

/**
 * Sanitizes a URL to prevent javascript: and other dangerous protocols
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '';

    const trimmed = url.trim().toLowerCase();

    // Check for dangerous protocols
    for (const protocol of DANGEROUS_PROTOCOLS) {
        if (trimmed.startsWith(protocol)) {
            return '';
        }
    }

    // Allow http, https, mailto, tel, and relative URLs
    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('#') ||
        !trimmed.includes(':') // Relative URL without protocol
    ) {
        return url;
    }

    return '';
}

/**
 * Escapes HTML entities for safe display
 * Use when you want to show HTML code as text
 */
export function escapeHtmlEntities(text: string): string {
    if (!text) return '';

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
