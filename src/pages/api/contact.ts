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
const RATE_LIMIT_MAX = 3; // Max 3 requests per window per IP
const RATE_LIMIT_DAY_MAX = 10; // Max 10 requests per day per IP, stops slow drip spam

// reCAPTCHA v3. The keys already live in the Netlify environment. When the
// secret is absent (local dev, or a misconfigured deploy) the check is skipped
// rather than locking every visitor out, and the skip is logged.
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || import.meta.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_MIN_SCORE = 0.5; // v3 returns 0.0 (bot) to 1.0 (human)

// "monitor" records what the captcha thinks and blocks nobody. "enforce" blocks.
// Monitor is the default on purpose: nobody has confirmed these keys are valid
// and registered for codebrand.us, and a wrong key in enforce mode would turn
// away every real customer. Read the spam report first, then flip this to
// enforce in Netlify. No redeploy needed.
const RECAPTCHA_MODE = (process.env.RECAPTCHA_MODE || import.meta.env.RECAPTCHA_MODE || "monitor").toLowerCase();

// Error codes that mean OUR configuration is wrong, not that the visitor is a bot.
// These must never block a customer, whatever the mode.
const RECAPTCHA_CONFIG_ERRORS = ["invalid-input-secret", "missing-input-secret", "bad-request", "invalid-keys"];

// Manual block lists, set in Netlify without a redeploy.
// BLOCKED_IPS=1.2.3.4,5.6.7.8   BLOCKED_COUNTRIES=RU,CN
// Leave them unset to block nothing. Use them only after the report shows a
// repeat offender: a country block turns away real people too.
const BLOCKED_IPS = new Set(
    (process.env.BLOCKED_IPS || import.meta.env.BLOCKED_IPS || "")
        .split(",").map((x: string) => x.trim()).filter(Boolean)
);
const BLOCKED_COUNTRIES = new Set(
    (process.env.BLOCKED_COUNTRIES || import.meta.env.BLOCKED_COUNTRIES || "")
        .split(",").map((x: string) => x.trim().toUpperCase()).filter(Boolean)
);

let rateLimitTableReady = false;
let contactsColumnsReady = false;

type Forensics = {
    ip: string;
    country: string;
    city: string;
    userAgent: string;
    referer: string;
    score: number | null;
};

/** Netlify puts the visitor's approximate location in x-nf-geo as base64 JSON. */
function readGeo(request: Request): { country: string; city: string } {
    const raw = request.headers.get("x-nf-geo");
    if (!raw) {
        return { country: request.headers.get("x-country") || "", city: "" };
    }
    try {
        const geo = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
        const country = geo?.country?.code || geo?.country?.name || "";
        const sub = geo?.subdivision?.code ? `/${geo.subdivision.code}` : "";
        return { country, city: (geo?.city || "") + sub };
    } catch {
        return { country: request.headers.get("x-country") || "", city: "" };
    }
}

/** Verifies a reCAPTCHA v3 token. Returns the score, or null when unavailable. */
async function verifyRecaptcha(token: string, ip: string): Promise<{ ok: boolean; score: number | null; reason: string }> {
    if (!RECAPTCHA_SECRET) {
        console.warn("[Contact] RECAPTCHA_SECRET_KEY is not set, captcha check skipped");
        return { ok: true, score: null, reason: "not-configured" };
    }
    if (!token) return { ok: false, score: null, reason: "missing-token" };
    try {
        const body = new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token });
        if (ip && ip !== "unknown") body.set("remoteip", ip);
        const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
            signal: AbortSignal.timeout(5000),
        });
        const data = await res.json() as { success?: boolean; score?: number; action?: string; "error-codes"?: string[] };
        if (!data.success) {
            const codes = data["error-codes"] || ["verify-failed"];
            // A broken key is our problem. Let the visitor through and shout in the logs.
            if (codes.some((c) => RECAPTCHA_CONFIG_ERRORS.includes(c))) {
                console.error(`[Contact] reCAPTCHA IS MISCONFIGURED (${codes.join(",")}). Allowing the submission. Fix the keys in Netlify.`);
                return { ok: true, score: null, reason: `misconfigured:${codes.join(",")}` };
            }
            return { ok: false, score: null, reason: codes.join(",") };
        }
        const score = typeof data.score === "number" ? data.score : null;
        if (score !== null && score < RECAPTCHA_MIN_SCORE) {
            return { ok: false, score, reason: `low-score-${score}` };
        }
        return { ok: true, score, reason: "ok" };
    } catch (err) {
        // Google unreachable: let the submission through rather than lose a lead,
        // but record that the check did not run.
        console.error("[Contact] reCAPTCHA verify failed:", err instanceof Error ? err.message : "Unknown");
        return { ok: true, score: null, reason: "verify-unreachable" };
    }
}

/** Adds the forensic columns to contacts once per cold start. Safe to re-run. */
async function ensureContactsColumns(): Promise<void> {
    if (contactsColumnsReady) return;
    const columns = [
        ["ip", "TEXT"],
        ["country", "TEXT"],
        ["city", "TEXT"],
        ["user_agent", "TEXT"],
        ["referer", "TEXT"],
        ["recaptcha_score", "REAL"],
    ];
    for (const [name, type] of columns) {
        try {
            await turso.execute(`ALTER TABLE contacts ADD COLUMN ${name} ${type}`);
        } catch {
            // Column already exists. SQLite has no ADD COLUMN IF NOT EXISTS.
        }
    }
    try {
        await turso.execute(
            `CREATE TABLE IF NOT EXISTS blocked_submissions (
                ts TEXT NOT NULL, ip TEXT, country TEXT, city TEXT,
                reason TEXT, user_agent TEXT, referer TEXT,
                email TEXT, subject TEXT, snippet TEXT
            )`
        );
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_blocked_ip ON blocked_submissions (ip)`);
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_blocked_ts ON blocked_submissions (ts)`);
    } catch (err) {
        console.error("[Contact] Could not prepare blocked_submissions:", err instanceof Error ? err.message : "Unknown");
    }
    contactsColumnsReady = true;
}

/** Records a rejected submission so the owner can see who is attacking and from where. */
async function recordBlocked(f: Forensics, reason: string, email = "", subject = "", snippet = ""): Promise<void> {
    console.warn(`[Contact] BLOCKED ${reason} ip=${f.ip} geo=${f.country}/${f.city} ua=${f.userAgent.slice(0, 60)}`);
    try {
        await ensureContactsColumns();
        await turso.execute({
            sql: `INSERT INTO blocked_submissions (ts, ip, country, city, reason, user_agent, referer, email, subject, snippet)
                  VALUES (datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [f.ip, f.country, f.city, reason, f.userAgent.slice(0, 300), f.referer.slice(0, 300),
                   email.slice(0, 200), subject.slice(0, 200), snippet.slice(0, 500)],
        });
    } catch (err) {
        console.error("[Contact] Could not log blocked submission:", err instanceof Error ? err.message : "Unknown");
    }
}

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
            { sql: `DELETE FROM rate_limits WHERE ts < ?`, args: [nowSec - 86400] },
            { sql: `INSERT INTO rate_limits (ip, ts) VALUES (?, ?)`, args: [ip, nowSec] },
        ]);

        // Count requests in the current window
        const result = await turso.execute({
            sql: `SELECT COUNT(*) AS cnt FROM rate_limits WHERE ip = ? AND ts >= ?`,
            args: [ip, windowStart],
        });

        const count = Number(result.rows[0]?.cnt ?? 0);
        if (count > RATE_LIMIT_MAX) return true;

        // Daily cap. Catches the slow drip that stays under the per-minute limit.
        const dayStart = nowSec - 86400;
        const daily = await turso.execute({
            sql: `SELECT COUNT(*) AS cnt FROM rate_limits WHERE ip = ? AND ts >= ?`,
            args: [ip, dayStart],
        });
        return Number(daily.rows[0]?.cnt ?? 0) > RATE_LIMIT_DAY_MAX;
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

        // Who is submitting, and from where. Captured before any rejection so the
        // owner can see the attack in blocked_submissions, not just the leads.
        const ip = clientAddress
            || (request.headers.get("x-nf-client-connection-ip") || "").trim()
            || (request.headers.get("x-forwarded-for") || "").split(",")[0].trim()
            || "unknown";
        const geo = readGeo(request);
        const forensics: Forensics = {
            ip,
            country: geo.country,
            city: geo.city,
            userAgent: request.headers.get("user-agent") || "",
            referer: request.headers.get("referer") || "",
            score: null,
        };

        // Manual block list, checked before anything expensive runs.
        if (BLOCKED_IPS.has(ip) || (forensics.country && BLOCKED_COUNTRIES.has(forensics.country.toUpperCase()))) {
            await recordBlocked(forensics, "blocklist");
            return new Response(JSON.stringify({ error: "Forbidden." }), {
                status: 403,
                headers: SECURITY_HEADERS,
            });
        }

        // Rate limiting check
        if (await isRateLimited(ip)) {
            await recordBlocked(forensics, "rate-limited");
            return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
                status: 429,
                headers: { ...SECURITY_HEADERS, 'Retry-After': '60' },
            });
        }

        const data = await request.formData();

        // Honeypot anti-spam check
        const honeypot = data.get("honey");
        if (honeypot && honeypot.toString().trim() !== "") {
            // Silent fail for bots, the response looks identical to a success.
            await recordBlocked(forensics, "honeypot", sanitize(data.get("email")), sanitize(data.get("subject")));
            return redirect("/thank-you", 303);
        }

        // reCAPTCHA v3
        const captcha = await verifyRecaptcha(String(data.get("recaptchaToken") || ""), ip);
        forensics.score = captcha.score;
        if (!captcha.ok) {
            // Always recorded, so the report shows what the captcha is catching.
            await recordBlocked(
                forensics,
                `captcha:${captcha.reason}${RECAPTCHA_MODE === "enforce" ? "" : " (monitor, allowed)"}`,
                sanitize(data.get("email")),
                sanitize(data.get("subject")),
                sanitize(data.get("message")),
            );
            if (RECAPTCHA_MODE === "enforce") {
                return new Response(JSON.stringify({ error: "We could not verify this submission. Please reload the page and try again." }), {
                    status: 403,
                    headers: SECURITY_HEADERS,
                });
            }
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
            await ensureContactsColumns();
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, phone, industry, subject, message, services, created_at,
                                            ip, country, city, user_agent, referer, recaptcha_score)
                      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?)`,
                args: [name, safeEmail, safePhone, industry, subject, message, servicesString,
                       forensics.ip, forensics.country, forensics.city,
                       forensics.userAgent.slice(0, 300), forensics.referer.slice(0, 300), forensics.score],
            });
        } catch (dbError) {
            console.error("Database error:", dbError instanceof Error ? dbError.message : "Unknown");
        }

        // Origin line for the notification email, so the owner sees at a glance
        // where a lead came from without opening the database.
        const originLine = `IP ${escapeHtml(forensics.ip)} | ${escapeHtml(forensics.country || "?")}${forensics.city ? " " + escapeHtml(forensics.city) : ""} | captcha ${forensics.score === null ? "n/a" : forensics.score}`;

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
                    origin: originLine,
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
    origin?: string;
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
            ${data.origin ? `<p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">Origin: ${data.origin}</p>` : ""}
        </div>
    </div>
</body>
</html>`;
}
