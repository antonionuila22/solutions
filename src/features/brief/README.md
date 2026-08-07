# Brief de descubrimiento (tipo Typeform)

Formulario conversacional de una pregunta por pantalla para el brief de
descubrimiento de clientes (primer cliente: CCIC). Vive dentro del sitio de la
agencia y se sirve en `codebrand.us/brief/{token}`.

## Adaptación del prompt original (Next.js → este repo Astro)

| Prompt (Next.js) | Aquí (Astro 7 SSR + Netlify) |
|---|---|
| Server Actions | Astro Actions (`src/actions/`) con el mismo `safeParse` server-side |
| RSC + hidratación | Página SSR + una isla React (`client:load`) para el orquestador |
| `server-only` | Guard en `lib/env.ts` (lanza si se importa en cliente) |
| Motion | `motion` — ya instalado en el repo |
| Resend | Ya configurado (formulario de contacto) — se reutiliza en Fase 5 |
| Vercel | Netlify (adapter ya presente) |

La arquitectura del prompt se conserva íntegra: preguntas data-driven en
`config/questions.ts`, validación Zod única, `jsonb` en Supabase, token
compartible, progreso sobre preguntas visibles.

## Estado por fases

- [x] **Fase 1** — tipos, bloques, preguntas, migración SQL, repositorio
      server-only, validación de entorno.
- [x] **Fase 2** — motor de navegación (`visible-questions.ts`), autosave con
      parches por clave, reanudación por token, `/brief` y `/brief/[token]`,
      exclusión del sitemap.
- [x] **Fase 3** — los 9 tipos de pregunta con su validación (borrador en
      `draft-schema.ts`, definitiva en el envío).
- [x] **Fase 4** — capa visual (una pregunta por pantalla, motion, teclas
      A/B/C…, matriz como tarjeta por módulo en móvil), portada y resumen.
- [x] **Fase 5** — envío idempotente, correo interno (Resend) con HTML +
      Markdown desde `render-answers.ts`.
- [ ] Fase 6 — panel `/admin/respuestas` (recortable: leer desde Supabase
      directamente mientras el volumen sea bajo). Exportación PDF pendiente.

**Rediseño posterior a Fase 1** (decisión de producto): las preguntas dejaron
de ser la redacción literal del documento CCIC — ahora son GENÉRICAS (sirven
para cualquier organización, no solo cámaras) y con RESPUESTAS PREHECHAS
(opción única/múltiple con catálogos cerrados; texto libre solo donde la
respuesta es realmente abierta, y un campo «-otro» condicional tras cada
«Otro»). Ver el encabezado de `config/questions.ts`.

## Pendiente del usuario

1. **Credenciales de Supabase** en `.env` (y en Netlify para producción):
   `BRIEF_SUPABASE_URL` y `BRIEF_SUPABASE_SERVICE_ROLE_KEY`.
2. **Ejecutar la migración** `supabase/migrations/0001_brief_responses.sql`
   en el SQL Editor del proyecto Supabase.

## Adaptaciones estructurales documentadas (docx → conversacional)

- P17 dividida en gate sí/no + pasarela condicional (**ambas required**: el
  asterisco del doc cubre la pregunta completa); P27 estructurada sí/no.
- **f-27b (construcción de identidad) es una pregunta AÑADIDA**, no del
  documento: la exige la condicional #3 del spec. Redacción propia.
- **Gate del Bloque I añadido** ("¿El proyecto incluye el frente de redes
  sociales?"): materializa la instrucción literal "Completar solo si…".
- **La matriz es required por adaptación** (el doc no la asterisca, pero "define
  directamente el alcance y el costo"); su exhaustividad (todos los módulos con
  nivel) la exige `isAnswered` en el motor — el autosave acepta parciales
  (`z.partialRecord`, semántica exhaustiva de `z.record` en Zod 4).
- P32 referencias: las columnas "Qué les gusta"/"Qué no les gusta" se fusionan
  en un campo por fila; la regla "tres que gusten y uno a evitar" se hace
  cumplir en el schema (refine + minRows 4).
- Los 3 campos de contacto (nombre, cargo, correo) son required aunque la
  tabla del doc no marca asteriscos: sin ellos no hay a quién responder.
- La portada re-redacta Propósito+Instrucciones al formato conversacional y
  omite "Devolver el archivo completo" (ya no hay archivo que devolver).
- El título de la matriz omite "con una X" (no hay X en digital).
- "Fecha de llenado" la registra el sistema (`created_at`); la "Confirmación
  de entrega" la sustituye la pantalla de resumen + envío.
- "Comentarios adicionales" vive en un bloque de cierre propio (Z), como en el
  documento va fuera de A–I.
- Niveles reales de la matriz: Indispensable / Deseable / No aplica / Ya existe.
- El checklist de accesos es su propio tipo (`accessChecklist`): por acceso,
  disponibilidad + responsable — en móvil, una tarjeta por acceso.

## Notas de implementación validadas contra el toolchain instalado

- **Astro Actions acepta las schemas Zod 4 del proyecto como `input`**
  (Astro 7 tipa `z.$ZodType` de zod/v4/core y ambos zod resuelven a la misma
  instancia pnpm). Fase 2: sobre de la Action validado con `input` (token,
  progress, answers como record laxo) + validación por-pregunta dentro del
  handler con `ActionError`. `astro:schema` está deprecado — usar `astro/zod`
  o el zod propio.
- **Sitemap**: las rutas dinámicas SSR (`/brief/[token]`) quedan fuera solas,
  pero `/brief` (índice, pathname estático) SÍ entraría — en Fase 2 hay que
  añadir la exclusión al `filter` del sitemap en astro.config.mjs, además del
  `noindex`.
- **El guardado es atómico en Postgres** (RPC `brief_save_answers`,
  `answers || patch`): obligatorio porque el enlace se comparte y hay
  autosaves concurrentes. El trigger moddatetime mantiene `updated_at`.
- **Regla dura**: `questions.ts` (y su Zod, 64 KB gzip) jamás se importa desde
  islas de páginas de marketing — solo desde la isla del brief y el servidor.
- Se evaluó `astro:env` vs `lib/env.ts`: se mantiene env.ts por consistencia
  con el precedente del repo (turso.ts, contact.ts) y porque funciona fuera
  del toolchain de Astro; si el repo migra a `astro:env`, migrar todo junto.

## Reglas que no se negocian

- Agregar/quitar/reordenar preguntas = editar solo `config/questions.ts`.
- Ningún componente de UI conoce una pregunta específica ni la persistencia.
- Ids de pregunta y de módulo son claves de `jsonb`: **nunca se renombran**.
- La service key jamás cruza al cliente; toda escritura pasa por una Action
  que valida con la misma regla Zod declarada en la pregunta.
- Las páginas `/brief/*` van `noindex` y fuera del sitemap: son una
  herramienta, no contenido del sitio.
