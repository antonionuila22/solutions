export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../turso";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, redirect }) => {
    try {
        const data = await request.formData();

        console.log("📨 Form data recibido:");
        for (const pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Honeypot anti-spam
        const honeypot = sanitize(data.get("honey"));
        if (honeypot) {
            console.warn("Bot detectado por honeypot.");
            return new Response("Bot detectado", { status: 403 });
        }

        // Verificar reCAPTCHA v2
        const token = data.get("g-recaptcha-response")?.toString();
        if (!token) {
            return new Response("Token reCAPTCHA faltante.", { status: 400 });
        }

        const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: import.meta.env.RECAPTCHA_SECRET_KEY,
                response: token,
            }).toString(),
        });

        const recaptchaData = await recaptchaRes.json();
        if (!recaptchaData.success) {
            console.warn("Fallo reCAPTCHA:", recaptchaData);
            return new Response("Fallo en la verificación de reCAPTCHA.", { status: 403 });
        }

        // Sanitización de campos
        const name = sanitize(data.get("name"));
        const email = sanitize(data.get("email"));
        const phone = sanitize(data.get("phone"));
        const subject = sanitize(data.get("subject"));
        const message = sanitize(data.get("message"));
        const rawServices = data.getAll("services");
        const services = rawServices.map((s) => sanitize(s));
        const servicesString = services.join(", ");

        // Validaciones
        if (!name || !email || !phone || !subject || !message || services.length === 0) {
            return new Response("Faltan campos obligatorios.", { status: 400 });
        }

        if (!validateEmail(email)) {
            return new Response("Correo electrónico inválido.", { status: 400 });
        }

        // Verificar duplicados
        const { rows } = await turso.execute({
            sql: "SELECT id FROM contacts WHERE email = ?",
            args: [email],
        });

        if (rows.length === 0) {
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, phone, subject, message, services) VALUES (?, ?, ?, ?, ?, ?)`,
                args: [name, email, phone, subject, message, servicesString],
            });
        }

        // Enviar correo
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "antonionuila022@gmail.com",
            subject: `Contacto: ${subject}`,
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <p><strong>Servicios seleccionados:</strong> ${servicesString}</p>
                <p><strong>Mensaje:</strong><br>${message}</p>
            `,
        });

        return redirect("/thank-you", 303);

    } catch (err: any) {
        console.error("Error al procesar el formulario:", err.message, err.stack);
        return new Response("Error del servidor: " + err.message, { status: 500 });
    }
};

function sanitize(input: FormDataEntryValue | null): string {
    if (!input) return "";
    return input.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
