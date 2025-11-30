/**
 * Shared validation utilities
 */

/**
 * Validates an email address format
 */
export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Sanitizes input to prevent XSS attacks
 */
export function sanitize(input: FormDataEntryValue | null): string {
    if (!input) return "";
    return input.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

/**
 * Validates a phone number (basic validation)
 */
export function validatePhone(phone: string): boolean {
    const regex = /^[\d\s\-\+\(\)]{7,20}$/;
    return regex.test(phone);
}

/**
 * Validates required string fields
 */
export function isNotEmpty(value: string | null | undefined): boolean {
    return typeof value === "string" && value.trim().length > 0;
}
