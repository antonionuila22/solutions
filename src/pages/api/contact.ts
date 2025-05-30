export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../turso";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, redirect }) => {
    try {
        const data = await request.formData();

        // Honeypot anti-spam
        const honeypot = sanitize(data.get("honey"));
        if (honeypot) {
            console.warn("Bot detectado por honeypot.");
            return new Response("Bot detectado", { status: 403 });
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
                sql: `INSERT INTO contacts (name, email, subject, message, services, phone) VALUES (?, ?, ?, ?, ?)`,
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

        // ✅ Redirección tras envío exitoso
        return redirect("/thank-you", 303);

    } catch (err) {
        console.error("Error al procesar el formulario:", err);
        return new Response("Error del servidor", { status: 500 });
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
