import type { AnswerMap, BriefResponse } from "../types";
import * as supabaseRepo from "./brief-repository";
import * as memoryRepo from "./memory-repository";

/**
 * Selector de almacenamiento. Toda la aplicación importa DESDE AQUÍ, nunca del
 * repositorio concreto.
 *
 * Reglas:
 *  - Producción: siempre Supabase. Si faltan las credenciales, `briefEnv()`
 *    lanza con un mensaje claro — jamás se degrada silenciosamente a memoria,
 *    que perdería respuestas reales de un cliente.
 *  - `astro dev` sin credenciales: almacén en memoria, para poder desarrollar y
 *    revisar el formulario antes de tener el proyecto de Supabase creado. Se
 *    vacía al reiniciar el servidor y lo advierte en consola.
 */

const hasSupabase = Boolean(
  (process.env.BRIEF_SUPABASE_URL ?? import.meta.env.BRIEF_SUPABASE_URL) &&
    (process.env.BRIEF_SUPABASE_SERVICE_ROLE_KEY ??
      import.meta.env.BRIEF_SUPABASE_SERVICE_ROLE_KEY)
);

const useMemory = import.meta.env.DEV && !hasSupabase;

if (useMemory) {
  console.warn(
    "\n[brief] Sin BRIEF_SUPABASE_URL / BRIEF_SUPABASE_SERVICE_ROLE_KEY.\n" +
      "[brief] Usando almacén EN MEMORIA (solo dev): las respuestas se pierden al reiniciar.\n" +
      "[brief] Para persistir: define las variables en .env y ejecuta supabase/migrations/0001_brief_responses.sql\n"
  );
}

const repo = useMemory ? memoryRepo : supabaseRepo;

export const createResponse: (organization?: string) => Promise<BriefResponse> =
  repo.createResponse;
export const getByToken: (token: string) => Promise<BriefResponse | null> = repo.getByToken;
export const saveAnswers: (
  token: string,
  incoming: AnswerMap,
  progress: number,
  contact?: { name?: string; email?: string }
) => Promise<BriefResponse> = repo.saveAnswers;
export const submitResponse: (token: string) => Promise<BriefResponse> = repo.submitResponse;
export const listResponses: () => Promise<BriefResponse[]> = repo.listResponses;

/** Verdadero cuando las respuestas NO se están persistiendo (solo dev). */
export const isEphemeralStore = useMemory;
