import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { QUESTIONS } from "../features/brief/config/questions";
import { draftSchemaFor } from "../features/brief/lib/draft-schema";
import { allowBriefCreation, clientIp } from "../features/brief/lib/rate-limit";
import {
  computeProgress,
  getBlockingQuestions,
  getVisibleAnswerable,
} from "../features/brief/lib/visible-questions";
import {
  createResponse,
  getByToken,
  saveAnswers,
  submitResponse,
} from "../features/brief/services/brief-store";
import { renderBriefHtml, renderBriefMarkdown } from "../features/brief/services/render-answers";
import { isAnswerable, type AnswerMap, type AnswerValue } from "../features/brief/types";

/**
 * Astro Actions del brief. Es la ÚNICA vía de escritura: la service key de
 * Supabase no sale nunca del servidor y toda respuesta se valida aquí con el
 * mismo Zod que declara la pregunta en config/questions.ts.
 *
 * Dos niveles de validación, a propósito:
 *  - `save` usa reglas de BORRADOR (draft-schema): acepta lo que está a medio
 *    escribir, pero no basura ni valores fuera de catálogo.
 *  - `submit` aplica la regla definitiva sobre las preguntas VISIBLES y
 *    obligatorias. El cliente ya lo comprueba, pero el cliente no es confiable.
 */

const TOKEN = z.string().trim().min(20).max(64);

/** Índice id → pregunta, construido una vez por proceso. */
const BY_ID = new Map(QUESTIONS.filter(isAnswerable).map((q) => [q.id, q]));

const contactFromAnswers = (answers: AnswerMap) => {
  const name = answers["p-nombre"];
  const email = answers["p-correo"];
  return {
    name: typeof name === "string" && name.trim() ? name.trim().slice(0, 200) : undefined,
    email: typeof email === "string" && email.trim() ? email.trim().slice(0, 200) : undefined,
  };
};

async function notifySubmission(token: string): Promise<void> {
  const to = process.env.CONTACT_RECIPIENT_EMAIL || import.meta.env.CONTACT_RECIPIENT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ||
    import.meta.env.RESEND_FROM_EMAIL ||
    "Codebrand <onboarding@resend.dev>";
  if (!to || !apiKey) {
    console.warn("[brief] Envío guardado pero sin correo: falta RESEND_API_KEY o destinatario.");
    return;
  }
  const response = await getByToken(token);
  if (!response) return;
  const { Resend } = await import("resend");
  await new Resend(apiKey).emails.send({
    from,
    to,
    subject: `Brief completado — ${response.organization}`,
    html: renderBriefHtml(response),
    text: renderBriefMarkdown(response),
  });
}

export const server = {
  brief: {
    /** Crea una respuesta vacía y devuelve su token (la URL para compartir). */
    start: defineAction({
      input: z.object({
        organization: z
          .string()
          .trim()
          .min(2, "Escribe el nombre de la organización.")
          .max(120)
          // El nombre va al asunto del correo y al <title>: sin saltos de línea
          // ni caracteres de control (inyección de cabeceras / texto invisible).
          .transform((s) => s.replace(/[\r\n\t\p{Cc}]/gu, " ").replace(/\s{2,}/g, " ").trim())
          .refine((s) => s.length >= 2, "Escribe el nombre de la organización."),
        /** Trampa para automatismos: un humano nunca la rellena. */
        website: z.string().max(0).optional(),
      }),
      handler: async ({ organization, website }, ctx) => {
        if (website) throw new ActionError({ code: "BAD_REQUEST", message: "Solicitud inválida." });
        const allowed = await allowBriefCreation(clientIp(ctx.request));
        if (!allowed) {
          throw new ActionError({
            code: "TOO_MANY_REQUESTS",
            message: "Se abrieron demasiados formularios desde esta conexión. Intenta más tarde.",
          });
        }
        const created = await createResponse(organization);
        return { token: created.token };
      },
    }),

    /** Autosave. Devuelve el progreso recalculado en el servidor. */
    save: defineAction({
      input: z.object({
        token: TOKEN,
        answers: z.record(z.string().max(80), z.unknown()),
      }),
      handler: async ({ token, answers }) => {
        const entries = Object.entries(answers);
        if (entries.length > QUESTIONS.length) {
          throw new ActionError({ code: "BAD_REQUEST", message: "Lote de respuestas inválido." });
        }

        const clean: AnswerMap = {};
        for (const [id, value] of entries) {
          const question = BY_ID.get(id);
          if (!question) {
            throw new ActionError({ code: "BAD_REQUEST", message: `Pregunta desconocida: ${id}` });
          }
          const parsed = draftSchemaFor(question).safeParse(value);
          if (!parsed.success) {
            throw new ActionError({
              code: "BAD_REQUEST",
              message: `Valor inválido en "${question.title}".`,
            });
          }
          clean[id] = parsed.data as AnswerValue;
        }

        // El progreso se calcula sobre el estado COMPLETO (lo guardado más este
        // lote), no sobre el lote: el cliente podría enviar una sola pregunta.
        const stored = (await getByToken(token))?.answers ?? {};
        const merged: AnswerMap = { ...stored, ...clean };
        const progress = computeProgress(merged);

        try {
          const row = await saveAnswers(token, clean, progress, contactFromAnswers(merged));
          return { progress: row.progress, savedAt: row.updated_at };
        } catch (err) {
          // Una respuesta ya enviada es un conflicto de estado, no un fallo del
          // servidor: el cliente debe mostrarlo, no reintentar.
          const message = err instanceof Error ? err.message : "No se pudo guardar.";
          if (message.includes("ya fue enviada")) {
            throw new ActionError({ code: "CONFLICT", message });
          }
          throw err;
        }
      },
    }),

    /** Envío final: valida sobre lo GUARDADO, bloquea la edición y notifica. */
    submit: defineAction({
      input: z.object({ token: TOKEN }),
      handler: async ({ token }) => {
        const current = await getByToken(token);
        if (!current) {
          throw new ActionError({ code: "NOT_FOUND", message: "Este enlace no existe." });
        }
        if (current.status === "completed") {
          return { alreadySubmitted: true as const, missing: [] as string[] };
        }

        const blocking = getBlockingQuestions(current.answers);
        if (blocking.length > 0) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: `Faltan ${blocking.length} respuestas indispensables: ${blocking
              .slice(0, 3)
              .map((q) => `«${q.title}»`)
              .join(", ")}${blocking.length > 3 ? "…" : ""}`,
          });
        }

        await submitResponse(token);

        // El correo no puede tumbar el envío: la respuesta ya está guardada y
        // es recuperable desde Supabase aunque Resend falle.
        try {
          await notifySubmission(token);
        } catch (err) {
          console.error(
            "[brief] Envío guardado pero el correo falló:",
            err instanceof Error ? err.message : "error desconocido"
          );
        }

        return { alreadySubmitted: false as const, missing: [] as string[] };
      },
    }),

    /** Ids de las preguntas visibles obligatorias sin responder (para el resumen). */
    validate: defineAction({
      input: z.object({ token: TOKEN }),
      handler: async ({ token }) => {
        const current = await getByToken(token);
        if (!current) {
          throw new ActionError({ code: "NOT_FOUND", message: "Este enlace no existe." });
        }
        return {
          missing: getBlockingQuestions(current.answers).map((q) => q.id),
          total: getVisibleAnswerable(current.answers).length,
          progress: current.progress,
        };
      },
    }),
  },
};
