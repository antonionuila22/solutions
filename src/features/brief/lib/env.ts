import { z } from "zod";

/** import.meta.env tipado localmente: evita depender de los tipos de Vite en
 *  herramientas que corren fuera del build de Astro (tsc suelto, tests). */
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

/**
 * Variables de entorno del brief, validadas con Zod al primer uso en servidor.
 * Equivalente al `server-only` de Next en este repo Astro: si este módulo se
 * evalúa en un navegador, lanza antes de tocar nada.
 *
 * Fallar al arrancar con un mensaje claro es preferible a fallar al enviar.
 */

if (typeof window !== "undefined") {
  throw new Error(
    "features/brief/lib/env.ts es solo-servidor y se importó en el cliente. " +
      "Ninguna isla React debe importar la capa de datos del brief."
  );
}

const EnvSchema = z.object({
  BRIEF_SUPABASE_URL: z.url(
    "BRIEF_SUPABASE_URL debe ser la URL https del proyecto Supabase."
  ),
  BRIEF_SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(30, "BRIEF_SUPABASE_SERVICE_ROLE_KEY no parece una service key válida."),
});

export type BriefEnv = z.infer<typeof EnvSchema>;

let cached: BriefEnv | null = null;

/** Lee y valida el entorno una sola vez. Lanza con detalle si falta algo. */
export function briefEnv(): BriefEnv {
  if (cached) return cached;
  const raw = {
    BRIEF_SUPABASE_URL:
      process.env.BRIEF_SUPABASE_URL ?? metaEnv.BRIEF_SUPABASE_URL,
    BRIEF_SUPABASE_SERVICE_ROLE_KEY:
      process.env.BRIEF_SUPABASE_SERVICE_ROLE_KEY ??
      metaEnv.BRIEF_SUPABASE_SERVICE_ROLE_KEY,
  };
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Entorno del brief incompleto. Define estas variables en .env / Netlify:\n${issues}`
    );
  }
  cached = parsed.data;
  return cached;
}
