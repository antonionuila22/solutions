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
 * Characters that are never accepted in a free text field.
 *
 * Free text is validated with a denylist, not a whitelist. A whitelist rejected
 * real people: accented industries like Construccion, inverted Spanish question
 * marks, the curly apostrophe iOS types, and any URL or email address pasted
 * into the message. Nothing is gained by it, because output is escaped when it
 * is rendered (escapeHtml in the contact API) and the database write is
 * parameterized. What is rejected here is what is actually dangerous: angle
 * brackets, so no value can look like markup, and control characters, so no
 * value can smuggle in a null byte or a terminal escape. Tabs, newlines and
 * carriage returns stay allowed.
 */
export const UNSAFE_CHARS = /[<>\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

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
 * Cleans raw input: trims whitespace and removes dangerous control characters.
 * Does NOT escape HTML — escaping must happen at output time (email, HTML rendering).
 */
export function sanitize(input: FormDataEntryValue | null): string {
    if (!input) return "";

    let value = input.toString().trim();

    // Remove null bytes and other control characters (except newlines/tabs)
    value = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return value;
}

/**
 * Sanitizes input specifically for use in HTML attributes.
 * Escapes HTML and removes dangerous URL schemes.
 */
export function sanitizeForAttribute(input: string): string {
    if (!input) return "";

    let value = escapeHtml(input);

    // Remove dangerous URL schemes
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
 * Validates a name field (length bounds, no markup or control characters)
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
    if (UNSAFE_CHARS.test(name)) {
        return { valid: false, error: "Name cannot contain the characters < or >" };
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
    if (UNSAFE_CHARS.test(subject)) {
        return { valid: false, error: "Subject cannot contain the characters < or >" };
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
    if (UNSAFE_CHARS.test(message)) {
        return { valid: false, error: "Message cannot contain the characters < or >" };
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
    if (UNSAFE_CHARS.test(industry)) {
        return { valid: false, error: "Industry cannot contain the characters < or >" };
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
 * Validates all contact form fields.
 * Name, email, industry, subject and message are required. Phone is optional.
 */
export function validateContactForm(data: {
    name: string;
    email: string;
    phone: string;
    industry: string;
    subject: string;
    message: string;
}): { valid: boolean; error?: string } {
    // Validate name
    const nameResult = validateName(data.name);
    if (!nameResult.valid) return nameResult;

    // Validate email
    if (!isNotEmpty(data.email)) return { valid: false, error: "Email is required" };
    if (!validateLength(data.email, MAX_LENGTHS.email))
        return { valid: false, error: `Email must be ${MAX_LENGTHS.email} characters or less` };
    if (!validateEmail(data.email)) return { valid: false, error: "Invalid email address" };

    // Validate phone: optional, because the Honduras form labels it optional.
    // When one IS supplied it still has to be a real number.
    if (isNotEmpty(data.phone) && !validatePhone(data.phone)) {
        return { valid: false, error: "Invalid phone number" };
    }

    // Validate industry
    const industryResult = validateIndustry(data.industry);
    if (!industryResult.valid) return industryResult;

    // Validate subject
    const subjectResult = validateSubject(data.subject);
    if (!subjectResult.valid) return subjectResult;

    // Validate message
    const messageResult = validateMessage(data.message);
    if (!messageResult.valid) return messageResult;

    return { valid: true };
}
