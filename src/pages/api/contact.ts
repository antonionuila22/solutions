export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../turso";
import { Resend } from "resend";
import { validateEmail, sanitize } from "../../lib/validation";

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const CONTACT_EMAIL = import.meta.env.CONTACT_RECIPIENT_EMAIL || "antonionuila022@gmail.com";
// Usar dominio verificado de Resend, o el de prueba si no está configurado
const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL || "Codebrand <onboarding@resend.dev>";

export const POST: APIRoute = async ({ request, redirect }) => {
    try {
        const data = await request.formData();

        // Honeypot anti-spam
        const honeypot = sanitize(data.get("honey"));
        if (honeypot) {
            return new Response("Bot detected", { status: 403 });
        }

        // Sanitización de campos
        const name = sanitize(data.get("name"));
        const email = sanitize(data.get("email"));
        const phone = sanitize(data.get("phone"));
        const industry = sanitize(data.get("industry"));
        const subject = sanitize(data.get("subject"));
        const message = sanitize(data.get("message"));
        const rawServices = data.getAll("services");
        const services = rawServices.map((s) => sanitize(s));
        const servicesString = services.length > 0 ? services.join(", ") : "No services selected";

        // Validaciones - servicios ahora es opcional
        if (!name || !email || !phone || !industry || !subject || !message) {
            return new Response("Missing required fields.", { status: 400 });
        }

        if (!validateEmail(email)) {
            return new Response("Invalid email address.", { status: 400 });
        }

        // Guardar en Turso - siempre guardar, incluso si el email ya existe (nuevo mensaje)
        try {
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, phone, industry, subject, message, services) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [name, email, phone, industry, subject, message, servicesString],
            });
            console.log("Contact saved to database successfully");
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with email even if DB fails
        }

        // Enviar correo
        try {
            console.log("Sending email with config:", {
                from: FROM_EMAIL,
                to: CONTACT_EMAIL,
                replyTo: email,
                apiKeyExists: !!import.meta.env.RESEND_API_KEY
            });

            const emailResult = await resend.emails.send({
                from: FROM_EMAIL,
                to: CONTACT_EMAIL,
                replyTo: email,
                subject: `New Contact: ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">New Contact Form Submission</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="tel:${phone}">${phone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Industry:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${industry}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${subject}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Services:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${servicesString}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                            <strong>Message:</strong>
                            <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
                            This email was sent from the contact form at codebrand.us
                        </p>
                    </div>
                `,
            });
            console.log("Email sent successfully:", emailResult);
        } catch (emailError) {
            console.error("Email error:", emailError);
            // Still redirect to thank you even if email fails (data is saved in DB)
        }

        return redirect("/thank-you", 303);

    } catch (err) {
        console.error("Contact form error:", err);
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response("Server error: " + message, { status: 500 });
    }
};

