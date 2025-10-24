import type { Handler, HandlerEvent } from "@netlify/functions";
import { turso } from "../../src/turso";

/**
 * Netlify Function para guardar submissions del formulario en Turso DB
 * Esta función se ejecuta automáticamente cuando Netlify recibe un formulario
 *
 * CONFIGURACIÓN NECESARIA:
 * 1. En Netlify Dashboard > Site Settings > Forms > Form notifications
 * 2. Agregar "Outgoing webhook" con URL: https://tu-sitio.netlify.app/.netlify/functions/contact-submission
 * 3. O usar el evento "submission-created" si usas Netlify Functions integradas
 */

export const handler: Handler = async (event: HandlerEvent) => {
  // Solo aceptar POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse el body del webhook de Netlify
    const payload = JSON.parse(event.body || "{}");

    // Los datos del formulario vienen en payload.data (formato de Netlify Forms)
    const formData = payload.data || payload;

    console.log("📨 Netlify Form submission received:", formData);

    // Sanitizar los datos
    const name = sanitize(formData.name);
    const email = sanitize(formData.email);
    const phone = sanitize(formData.phone);
    const subject = sanitize(formData.subject);
    const message = sanitize(formData.message);
    const industry = sanitize(formData.industry);

    // Los servicios pueden venir como array o string separado por comas
    let servicesString = "";
    if (Array.isArray(formData.services)) {
      servicesString = formData.services.map((s: string) => sanitize(s)).join(", ");
    } else if (typeof formData.services === "string") {
      servicesString = sanitize(formData.services);
    }

    // Validaciones básicas
    if (!name || !email || !phone || !subject || !message || !industry) {
      console.error("❌ Faltan campos obligatorios");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    if (!validateEmail(email)) {
      console.error("❌ Email inválido:", email);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email" }),
      };
    }

    // Verificar si la tabla existe, si no crearla
    try {
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          industry TEXT,
          services TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (err) {
      console.log("Tabla ya existe o error creando:", err);
    }

    // Verificar duplicados por email
    const { rows } = await turso.execute({
      sql: "SELECT id FROM contacts WHERE email = ? AND created_at > datetime('now', '-1 hour')",
      args: [email],
    });

    if (rows.length > 0) {
      console.log("⚠️  Email duplicado en la última hora:", email);
      // No devolver error, solo logear
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Duplicate submission detected (same email within 1 hour)",
          saved: false
        }),
      };
    }

    // Guardar en Turso DB
    await turso.execute({
      sql: `INSERT INTO contacts (name, email, phone, subject, message, industry, services)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [name, email, phone, subject, message, industry, servicesString],
    });

    console.log("✅ Contacto guardado en Turso DB:", email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact saved successfully",
        saved: true
      }),
    };

  } catch (err: any) {
    console.error("❌ Error procesando la submission:", err.message, err.stack);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: err.message
      }),
    };
  }
};

/**
 * Sanitiza strings para prevenir XSS
 */
function sanitize(input: any): string {
  if (!input) return "";
  return String(input)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Valida formato de email
 */
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
