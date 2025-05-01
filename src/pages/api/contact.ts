export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../turso";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.formData();
        const name = data.get("name")?.toString();
        const email = data.get("email")?.toString();
        const subject = data.get("subject")?.toString();
        const message = data.get("message")?.toString();

        // Obtener múltiples servicios
        const services = data.getAll("services").map((s) => s.toString());
        const servicesString = services.join(", ");

        if (!name || !email || !subject || !message || services.length === 0) {
            return new Response("Faltan campos", { status: 400 });
        }

        const { rows } = await turso.execute({
            sql: "SELECT id FROM contacts WHERE email = ?",
            args: [email],
        });

        const exists = rows.length > 0;

        if (!exists) {
            await turso.execute({
                sql: `INSERT INTO contacts (name, email, subject, message, services) 
					  VALUES (?, ?, ?, ?, ?)`,
                args: [name, email, subject, message, servicesString],
            });

            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: "antonionuila022@gmail.com",
                subject: `Contacto: ${subject}`,
                html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Servicios seleccionados:</strong> ${servicesString}</p>
          <p><strong>Mensaje:</strong><br>${message}</p>
        `,
            });
        }

        return new Response("OK", { status: 200 });
    } catch (err) {
        console.error("Error:", err);
        return new Response("Error del servidor", { status: 500 });
    }
};
