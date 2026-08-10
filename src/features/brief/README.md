# Formulario de arranque (tipo Typeform)

Formulario conversacional de una pregunta por pantalla, en `codebrand.us/brief`.
Se crea un enlace por cliente (`/brief/{token}`) y ese enlace es el formulario:
se comparte, se cierra y se retoma; el avance se guarda solo.

## Qué es hoy

**10 preguntas para arrancar un rediseño de website** (redacción del cliente,
agosto 2026): la acción número uno, el beneficio que convence, las 6 secciones
que sí importan (elegidas EN ORDEN de prioridad), las 6 piezas fijas del
inicio, lo que se elimina, una referencia, quién aprueba, cuántos accesos de
administración, funciones nuevas y autoservicio.

Decisiones vigentes:

- **Sin bloque de contacto**: el enlace se envía a un contacto ya conocido.
- **Sin rayas ni guiones en texto visible** (regla del cliente); una invariante
  en `config/questions.ts` rompe el build si aparece alguno.
- La pregunta de secciones usa `multiChoice` con `ordered: true`: el orden de
  los clics es la prioridad y la casilla muestra el número.
- Obligatorias: 8 (invariante con lista explícita en `config/questions.ts`).
- Tras enviar, la página redirige a `/brief/gracias` (URL sin token) y el
  enlace queda bloqueado contra ediciones.

El formulario largo de descubrimiento (bloques A–I del documento CCIC, 47
preguntas) vivió aquí hasta agosto 2026; está íntegro en el historial de git
por si un proyecto futuro lo necesita.

## Arquitectura (sin cambios)

- `config/questions.ts` es la FUENTE ÚNICA: agregar, quitar o reordenar
  preguntas es editar solo ese archivo. Ningún componente conoce una pregunta.
- Cada pregunta declara su Zod; la isla lo usa para UX y la Astro Action lo
  reaplica en servidor (`src/actions/index.ts`). El autosave valida con reglas
  de borrador (`lib/draft-schema.ts`) que aceptan estados parciales pero no
  valores fuera de catálogo.
- Persistencia en Supabase (`brief_responses`, jsonb) con merge atómico por
  clave vía RPC `brief_save_answers`: varias personas pueden responder a la
  vez desde el mismo enlace. En `astro dev` sin credenciales se usa un almacén
  en memoria (`services/brief-store.ts` decide; jamás en producción).
- El envío es idempotente, bloquea la respuesta y manda el correo interno
  (Resend) con HTML y Markdown generados por `services/render-answers.ts`.
- `/brief/*` va noindex, fuera del sitemap, con Cache-Control no-store y
  referrer no-referrer (el token de la URL es la credencial).

## Entorno

`BRIEF_SUPABASE_URL` y `BRIEF_SUPABASE_SERVICE_ROLE_KEY` (la clave secreta,
no la publishable) en `.env` local y en Netlify. Migración:
`supabase/migrations/0001_brief_responses.sql`, ya ejecutada en producción.
