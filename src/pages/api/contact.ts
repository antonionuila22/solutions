export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../turso";
import { Resend } from "resend";
import {
    sanitize,
    sanitizeEmail,
    sanitizePhone,
    validateContactForm,
    escapeHtml,
} from "../../lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || import.meta.env.CONTACT_RECIPIENT_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || import.meta.env.RESEND_FROM_EMAIL || "Codebrand <onboarding@resend.dev>";

// Allowed origins for CSRF protection
const ALLOWED_ORIGINS = [
    "https://codebrand.us",
    "https://www.codebrand.us",
];
if (import.meta.env.DEV) {
    ALLOWED_ORIGINS.push("http://localhost:4321", "http://localhost:3000");
}

// Rate limiting backed by Turso (works in serverless/Netlify Functions).
// Requires a table: CREATE TABLE IF NOT EXISTS rate_limits (ip TEXT NOT NULL, ts INTEGER NOT NULL);
// The table and old entries are managed automatically below.
const RATE_LIMIT_WINDOW_SEC = 60; // 1 minute window
const RATE_LIMIT_MAX = 5; // Max 5 requests per window per IP

let rateLimitTableReady = false;

const SECURITY_HEADERS = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
};

async function ensureRateLimitTable(): Promise<void> {
    if (rateLimitTableReady) return;
    try {
        await turso.execute(
            `CREATE TABLE IF NOT EXISTS rate_limits (ip TEXT NOT NULL, ts INTEGER NOT NULL)`
        );
        rateLimitTableReady = true;
    } catch (err) {
        console.error('[RateLimit] Failed to ensure rate_limits table:', err instanceof Error ? err.message : 'Unknown');
    }
}

async function isRateLimited(ip: string): Promise<boolean> {
    try {
        await ensureRateLimitTable();

        const nowSec = Math.floor(Date.now() / 1000);
        const windowStart = nowSec - RATE_LIMIT_WINDOW_SEC;

        // Clean up expired entries for this IP and record the new request in one batch
        await turso.batch([
            { sql: `DELETE FROM rate_limits WHERE ts < ?`, args: [windowStart] },
            { sql: `INSERT INTO rate_limits (ip, ts) VALUES (?, ?)`, args: [ip, nowSec] },
        ]);

        // Count requests in the current window
        const result = await turso.execute({
            sql: `SELECT COUNT(*) AS cnt FROM rate_limits WHERE ip = ? AND ts >= ?`,
            args: [ip, windowStart],
        });

        const count = Number(result.rows[0]?.cnt ?? 0);
        return count > RATE_LIMIT_MAX;
    } catch (err) {
        // If the database is unavailable, allow the request (fail-open) and log
        console.error('[RateLimit] Check failed, allowing request:', err instanceof Error ? err.message : 'Unknown');
        return false;
    }
}

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
    try {
        // CSRF protection: verify Origin header
        const origin = request.headers.get("origin");
        if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
            return new Response(JSON.stringify({ error: "Forbidden." }), {
                status: 403,
                headers: SECURITY_HEADERS,
            });
        }

        // Content-Type validation
        const contentType = request.headers.get("content-type") || "";
        if (
            !contentType.includes("multipart/form-data") &&
            !contentType.includes("application/x-www-form-urlencoded")
        ) {
            return new Response(JSON.stringify({ error: "Invalid content type." }), {
                status: 415,
                headers: SECURITY_HEADERS,
            });
        }

        // Rate limiting check
        const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
        if (await isRateLimited(ip)) {
            return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
                status: 429,
                headers: { ...SECURITY_HEADERS, 'Retry-After': '60' },
            });
        }

        const data = await request.formData();

        // Honeypot anti-spam check
        const honeypot = data.get("honey");
        if (honeypot && honeypot.toString().trim() !== "") {
            // Silent fail for bots - don't reveal detection
            return redirect("/thank-you", 303);
        }

        // Extract and clean all fields (no HTML escaping yet)
        const name = sanitize(data.get("name"));
        const email = sanitize(data.get("email"));
        const phone = sanitize(data.get("phone"));
        const industry = sanitize(data.get("industry"));
        const subject = sanitize(data.get("subject"));
        const message = sanitize(data.get("message"));

        // Validate all fields (against clean, unescaped input)
        const validation = validateContactForm({
            name, email, phone, industry, subject, message
        });

        if (!validation.valid) {
            return new Response(JSON.stringify({ error: validation.error || "Invalid form data." }), {
                status: 400,
                headers: SECURITY_HEADERS,
            });
        }

        // Sanitize for specific contexts (email/phone safe formats)
        const safeEmail = sanitizeEmail(email);
        const safePhone = sanitizePhone(phone);

        // Process services (optional field)
        const rawServices = data.getAll("services");
        const services = rawServices
            .map((s) => sanitize(s))
            .filter((s) => s.length > 0 && s.length <= 50);
        const servicesString = services.length > 0 ? services.join(", ") : "No services selected";

        // Save to database (parameterized query — safe from SQL injection)
        try {
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, phone, industry, subject, message, services, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                args: [name, safeEmail, safePhone, industry, subject, message, servicesString],
            });
        } catch (dbError) {
            console.error("Database error:", dbError instanceof Error ? dbError.message : "Unknown");
        }

        // Send email notification (escapeHtml at output time)
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: CONTACT_EMAIL,
                replyTo: safeEmail,
                subject: `New Contact: ${escapeHtml(subject.substring(0, 100))}`,
                html: generateEmailHtml({
                    name: escapeHtml(name),
                    email: escapeHtml(safeEmail),
                    phone: escapeHtml(safePhone),
                    industry: escapeHtml(industry),
                    subject: escapeHtml(subject),
                    message: escapeHtml(message),
                    services: escapeHtml(servicesString),
                }),
            });
        } catch (emailError) {
            console.error("Email error:", emailError instanceof Error ? emailError.message : "Unknown");
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: SECURITY_HEADERS,
        });

    } catch (err) {
        console.error("Contact form error:", err instanceof Error ? err.message : "Unknown");
        return new Response(JSON.stringify({ error: "An error occurred. Please try again later." }), {
            status: 500,
            headers: SECURITY_HEADERS,
        });
    }
};

/**
 * Generates safe HTML email template.
 * All dynamic content MUST be pre-escaped with escapeHtml() before passing here.
 */
function generateEmailHtml(data: {
    name: string;
    email: string;
    phone: string;
    industry: string;
    subject: string;
    message: string;
    services: string;
}): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; width: 30%; color: #6b7280; font-weight: 600;">Name</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.name}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Email</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                        <a href="mailto:${data.email}" style="color: #0891b2; text-decoration: none;">${data.email}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Phone</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                        <a href="tel:${data.phone}" style="color: #0891b2; text-decoration: none;">${data.phone}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Industry</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.industry}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Subject</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.subject}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Services</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.services}</td>
                </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #0891b2;">
                <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">Message</h3>
                <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
            </div>
        </div>
        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This email was sent from the contact form at codebrand.us
            </p>
        </div>
    </div>
</body>
</html>`;
}
