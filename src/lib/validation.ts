/**
 * Shared validation and sanitization utilities
 * Security-focused implementations for form handling
 */

/**
 * Maximum field lengths to prevent DoS attacks
 */
export const MAX_LENGTHS = {
    name: 60,
    email: 254, // RFC 5321 max email length
    phone: 20,
    subject: 100,
    message: 2000,
    industry: 50,
} as const;

/**
 * Allowed characters patterns
 */
export const PATTERNS = {
    // Names: letters, spaces, hyphens, apostrophes (for names like O'Brien, Mary-Jane)
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/,
    // Subject: letters, numbers, spaces, basic punctuation
    subject: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-,.!?']+$/,
    // Message: letters, numbers, spaces, common punctuation (no code/scripts)
    message: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-,.!?;:'"()\n\r]+$/,
    // Industry: letters, spaces, hyphens
    industry: /^[a-zA-Z\s\-&]+$/,
} as const;

/**
 * Validates an email address format with stricter regex
 * Based on RFC 5322 simplified pattern
 */
export function validateEmail(email: string): boolean {
    if (!email || email.length > MAX_LENGTHS.email) return false;

    // Stricter email regex that checks for:
    // - Valid local part (letters, numbers, some special chars)
    // - Single @ symbol
    // - Valid domain with at least one dot
    // - TLD of 2-10 characters
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,10})+$/;
    return regex.test(email);
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * Handles all contexts: HTML content, attributes, and URLs
 */
export function escapeHtml(input: string): string {
    const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };

    return input.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Sanitizes and escapes input for safe HTML rendering
 * Use this for any user-provided content displayed in HTML
 */
export function sanitize(input: FormDataEntryValue | null): string {
    if (!input) return "";

    let value = input.toString().trim();

    // Remove null bytes and other control characters (except newlines/tabs)
    value = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Escape HTML special characters
    return escapeHtml(value);
}

/**
 * Sanitizes input specifically for use in HTML attributes
 * More aggressive escaping for attribute context
 */
export function sanitizeForAttribute(input: string): string {
    if (!input) return "";

    // First do standard sanitization
    let value = sanitize(input);

    // Additional escaping for attribute context
    // Remove any javascript: or data: URLs
    value = value.replace(/javascript:/gi, '');
    value = value.replace(/data:/gi, '');
    value = value.replace(/vbscript:/gi, '');

    return value;
}

/**
 * Sanitizes email for use in mailto: links
 */
export function sanitizeEmail(email: string): string {
    if (!email) return "";

    // Only allow valid email characters
    const sanitized = email.replace(/[^a-zA-Z0-9.@_+-]/g, '');

    // Validate the result
    if (!validateEmail(sanitized)) return "";

    return sanitized;
}

/**
 * Sanitizes phone number for use in tel: links
 */
export function sanitizePhone(phone: string): string {
    if (!phone) return "";

    // Only allow digits, spaces, hyphens, parentheses, and plus
    return phone.replace(/[^\d\s\-\+\(\)]/g, '').trim();
}

/**
 * Validates a phone number format
 */
export function validatePhone(phone: string): boolean {
    if (!phone || phone.length > MAX_LENGTHS.phone) return false;

    // Must contain at least 7 digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) return false;

    // Only allow valid phone characters
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone);
}

/**
 * Validates a name field (only letters, spaces, hyphens, apostrophes)
 */
export function validateName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: "Name is required" };
    }
    if (name.length < 2) {
        return { valid: false, error: "Name must be at least 2 characters" };
    }
    if (name.length > MAX_LENGTHS.name) {
        return { valid: false, error: `Name must be ${MAX_LENGTHS.name} characters or less` };
    }
    if (!PATTERNS.name.test(name)) {
        return { valid: false, error: "Name can only contain letters, spaces, and hyphens" };
    }
    return { valid: true };
}

/**
 * Validates a subject field
 */
export function validateSubject(subject: string): { valid: boolean; error?: string } {
    if (!subject || subject.trim().length === 0) {
        return { valid: false, error: "Subject is required" };
    }
    if (subject.length < 3) {
        return { valid: false, error: "Subject must be at least 3 characters" };
    }
    if (subject.length > MAX_LENGTHS.subject) {
        return { valid: false, error: `Subject must be ${MAX_LENGTHS.subject} characters or less` };
    }
    if (!PATTERNS.subject.test(subject)) {
        return { valid: false, error: "Subject contains invalid characters" };
    }
    return { valid: true };
}

/**
 * Validates a message field
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
        return { valid: false, error: "Message is required" };
    }
    if (message.length < 10) {
        return { valid: false, error: "Message must be at least 10 characters" };
    }
    if (message.length > MAX_LENGTHS.message) {
        return { valid: false, error: `Message must be ${MAX_LENGTHS.message} characters or less` };
    }
    if (!PATTERNS.message.test(message)) {
        return { valid: false, error: "Message contains invalid characters. Please use only letters, numbers, and basic punctuation." };
    }
    return { valid: true };
}

/**
 * Validates industry field
 */
export function validateIndustry(industry: string): { valid: boolean; error?: string } {
    if (!industry || industry.trim().length === 0) {
        return { valid: false, error: "Industry is required" };
    }
    if (industry.length > MAX_LENGTHS.industry) {
        return { valid: false, error: `Industry must be ${MAX_LENGTHS.industry} characters or less` };
    }
    if (!PATTERNS.industry.test(industry)) {
        return { valid: false, error: "Industry contains invalid characters" };
    }
    return { valid: true };
}

/**
 * Validates required string fields
 */
export function isNotEmpty(value: string | null | undefined): boolean {
    return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates field length against maximum
 */
export function validateLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
}

/**
 * Validates all required contact form fields
 * Uses individual validators for strict character validation
 */
export function validateContactForm(data: {
    name: string;
    email: string;
    phone: string;
    industry: string;
    subject: string;
    message: string;
}): { valid: boolean; error?: string } {
    // Validate name (letters, spaces, hyphens, apostrophes only)
    const nameResult = validateName(data.name);
    if (!nameResult.valid) return nameResult;

    // Validate email
    if (!isNotEmpty(data.email)) return { valid: false, error: "Email is required" };
    if (!validateLength(data.email, MAX_LENGTHS.email))
        return { valid: false, error: `Email must be ${MAX_LENGTHS.email} characters or less` };
    if (!validateEmail(data.email)) return { valid: false, error: "Invalid email address" };

    // Validate phone
    if (!isNotEmpty(data.phone)) return { valid: false, error: "Phone is required" };
    if (!validatePhone(data.phone)) return { valid: false, error: "Invalid phone number" };

    // Validate industry (letters, spaces, hyphens only)
    const industryResult = validateIndustry(data.industry);
    if (!industryResult.valid) return industryResult;

    // Validate subject (letters, numbers, basic punctuation)
    const subjectResult = validateSubject(data.subject);
    if (!subjectResult.valid) return subjectResult;

    // Validate message (letters, numbers, common punctuation)
    const messageResult = validateMessage(data.message);
    if (!messageResult.valid) return messageResult;

    return { valid: true };
}
