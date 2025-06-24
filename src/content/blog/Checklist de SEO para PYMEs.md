---
title: "Checklist de SEO para PYMEs y contratistas que no tienen equipo técnico"
description: "Guía paso a paso para implementar un formulario profesional en Astro con base de datos en Turso y notificaciones automáticas usando Resend. Ideal para sitios modernos y rápidos."
author: "Ramon Nuila"
readtime: 9
img: /photos/astro-form-turso.png
imageAlt: "Formulario en Astro con base de datos y envío de correo"
date: 2024-03-28
---

## Crear un Formulario en Astro con Turso y Notificaciones por Email usando Resend

En esta guía te muestro paso a paso cómo crear un formulario de contacto usando **Astro**, almacenar los datos en **Turso** y enviar una notificación por email a una cuenta Gmail usando **Resend**. Esta solución es ideal si querés tener un sitio profesional, sin depender de herramientas externas como Netlify Forms o Google Forms.

---

## 🧩 Stack utilizado

- **Astro** (con SSR)
- **Turso** (SQLite distribuido)
- **Netlify** (hosting + serverless functions)
- **Resend** (envío de emails transaccionales)
- **TypeScript** (opcional)

---

## 1. Configurar Astro para manejar formularios con SSR

En `astro.config.mjs`, asegurate de tener el modo `server` activado:

```js
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "server",
  adapter: netlify(),
});
```

Instalá el adaptador si aún no lo tenés:

```bash
npm install @astrojs/netlify
```

Esto permite que Astro ejecute lógica del lado del servidor (como manejar formularios) en Netlify.

---

## 2. Crear tabla en Turso con verificación de email único

```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  subject TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Obtén las variables:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

Guardalas en `.env`:

```bash
TURSO_DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
```

Instalá el cliente:

```bash
npm install @libsql/client
```

Y creá `src/turso.ts`:

```ts
import { createClient } from "@libsql/client";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});
```

---

## 3. Crear el componente `ContactForm.astro`

Este componente contiene solo la estructura visual del formulario:

```astro
<form method="POST" class="...">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="text" name="subject" required />
  <textarea name="message" required></textarea>
  <button type="submit">Enviar</button>
</form>
```

No debe tener ninguna lógica del lado del servidor. Solo HTML + Tailwind CSS.

---

## 4. Manejar el formulario en `src/pages/contact/index.astro`

Dentro del frontmatter `---`, colocamos toda la lógica:

```astro
---
import ContactForm from "../../components/ContactForm.astro";
import { turso } from "../../turso";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

if (Astro.request.method === "POST") {
  try {
    const data = await Astro.request.formData();
    const name = data.get("name")?.toString();
    const email = data.get("email")?.toString();
    const subject = data.get("subject")?.toString();
    const message = data.get("message")?.toString();

    if (name && email && subject && message) {
      const { rows } = await turso.execute({
        sql: "SELECT id FROM contacts WHERE email = ?",
        args: [email],
      });

      const exists = rows.length > 0;

      if (!exists) {
        await turso.execute({
          sql: "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
          args: [name, email, subject, message],
        });

        const htmlContent = `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `;

        await resend.emails.send({
          from: "Tu Sitio <contacto@tudominio.com>",
          to: ["tu-cuenta@gmail.com"],
          subject: `Contacto: ${subject}`,
          html: htmlContent,
        });
      } else {
        console.log("Email duplicado:", email);
      }
    }
  } catch (error) {
    console.error("Error en el formulario:", error);
  }
}
---

<ContactForm />
```

---

## 5. Configurar Resend

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar un dominio o usar el temporal `onboarding@resend.dev`
3. Crear una API Key y guardarla como `RESEND_API_KEY` en `.env`

```bash
npm install resend
```

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxx"
```

---

## 6. Variables de entorno en Netlify

Desde el panel de Netlify:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `RESEND_API_KEY`

Netlify inyectará esas variables correctamente en funciones serverless.

---

## 7. Alternativas para envío de correo

### SMTP con Nodemailer

Funciona, pero es menos confiable y Gmail suele bloquearlo si detecta comportamiento automatizado.

### API de Gmail

Compleja de integrar. Necesita OAuth2. No es la mejor opción para casos simples.

### Servicios como Resend / Postmark / SendGrid

✅ Simples, confiables y con mejor entregabilidad. Ideales para producción.

---

## 8. Buenas prácticas

- Validar también en el servidor.
- No guardar credenciales en el cliente.
- Usar `try/catch` para manejar errores.
- Evitar duplicados desde la lógica y desde la base de datos.
- Mostrar feedback al usuario (mensaje de éxito/error).

---

## 🚀 Conclusión

Con este stack podés tener un formulario profesional, seguro y moderno:

- 🌐 Totalmente integrado a tu sitio
- 🧠 Sin dependencias innecesarias
- 🛠️ Con base de datos real y notificaciones automatizadas

Ideal para freelancers, agencias, SaaS y cualquier proyecto serio en producción.

¿Te sirvió esta guía? Compartila con otros desarrolladores o añadila a tus recursos favoritos 💛
