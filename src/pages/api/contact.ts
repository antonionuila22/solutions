export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../turso";
import { Resend } from "resend";
import { validateEmail, sanitize } from "../../lib/validation";

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const CONTACT_EMAIL = import.meta.env.CONTACT_RECIPIENT_EMAIL || "info@codebrand.es";

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
        const servicesString = services.join(", ");

        // Validaciones
        if (!name || !email || !phone || !industry || !subject || !message || services.length === 0) {
            return new Response("Missing required fields.", { status: 400 });
        }

        if (!validateEmail(email)) {
            return new Response("Invalid email address.", { status: 400 });
        }

        // Verificar duplicados
        const { rows } = await turso.execute({
            sql: "SELECT id FROM contacts WHERE email = ?",
            args: [email],
        });

        if (rows.length === 0) {
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, phone, industry, subject, message, services) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [name, email, phone, industry, subject, message, servicesString],
            });
        }

        // Enviar correo
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: CONTACT_EMAIL,
            subject: `Contacto: ${subject}`,
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Industria:</strong> ${industry}</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <p><strong>Servicios seleccionados:</strong> ${servicesString}</p>
                <p><strong>Mensaje:</strong><br>${message}</p>
            `,
        });

        return redirect("/thank-you", 303);

    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response("Error del servidor: " + message, { status: 500 });
    }
};

