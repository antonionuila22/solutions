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

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const CONTACT_EMAIL = import.meta.env.CONTACT_RECIPIENT_EMAIL;
const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL || "Codebrand <onboarding@resend.dev>";

// Simple in-memory rate limiting (resets on server restart)
// For production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return false;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return true;
    }

    record.count++;
    return false;
}

// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(ip);
        }
    }
}, 60 * 1000);

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
    try {
        // Rate limiting check
        const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
        if (isRateLimited(ip)) {
            return new Response("Too many requests. Please try again later.", {
                status: 429,
                headers: { 'Retry-After': '60' }
            });
        }

        const data = await request.formData();

        // Honeypot anti-spam check
        const honeypot = data.get("honey");
        if (honeypot && honeypot.toString().trim() !== "") {
            // Silent fail for bots - don't reveal detection
            return redirect("/thank-you", 303);
        }

        // Extract and sanitize all fields
        const name = sanitize(data.get("name"));
        const email = sanitize(data.get("email"));
        const phone = sanitize(data.get("phone"));
        const industry = sanitize(data.get("industry"));
        const subject = sanitize(data.get("subject"));
        const message = sanitize(data.get("message"));

        // Validate all fields
        const validation = validateContactForm({
            name, email, phone, industry, subject, message
        });

        if (!validation.valid) {
            return new Response(validation.error || "Invalid form data.", { status: 400 });
        }

        // Sanitize for specific contexts
        const safeEmail = sanitizeEmail(email);
        const safePhone = sanitizePhone(phone);

        // Process services (optional field)
        const rawServices = data.getAll("services");
        const services = rawServices
            .map((s) => sanitize(s))
            .filter((s) => s.length > 0 && s.length <= 50); // Limit service name length
        const servicesString = services.length > 0 ? services.join(", ") : "No services selected";

        // Save to database
        try {
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, phone, industry, subject, message, services, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                args: [name, safeEmail, safePhone, industry, subject, message, servicesString],
            });
        } catch (dbError) {
            // Log error internally but continue with email
            console.error("Database error:", dbError instanceof Error ? dbError.message : "Unknown");
        }

        // Send email notification
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: CONTACT_EMAIL,
                replyTo: safeEmail,
                subject: `New Contact: ${escapeHtml(subject.substring(0, 100))}`,
                html: generateEmailHtml({
                    name,
                    email: safeEmail,
                    phone: safePhone,
                    industry,
                    subject,
                    message,
                    services: servicesString,
                }),
            });
        } catch (emailError) {
            // Log error internally but don't expose to client
            console.error("Email error:", emailError instanceof Error ? emailError.message : "Unknown");
        }

        return redirect("/thank-you", 303);

    } catch (err) {
        // Log the actual error for debugging
        console.error("Contact form error:", err instanceof Error ? err.message : "Unknown");

        // Return generic error to client (don't expose internal details)
        return new Response("An error occurred. Please try again later.", { status: 500 });
    }
};

/**
 * Generates safe HTML email template
 * All dynamic content is already escaped via sanitize()
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
