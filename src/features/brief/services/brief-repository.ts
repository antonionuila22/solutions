import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { briefEnv } from "../lib/env";
import type { AnswerMap, BriefResponse } from "../types";

/**
 * Acceso a brief_responses. SOLO servidor (env.ts lanza en cliente).
 * Toda escritura llega aquí desde una Astro Action que ya validó con Zod;
 * este módulo no re-valida contenido, solo garantiza invariantes de estado
 * (p. ej. una respuesta completada no se edita).
 */

let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (client) return client;
  const env = briefEnv();
  client = createClient(env.BRIEF_SUPABASE_URL, env.BRIEF_SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

const TABLE = "brief_responses";

/** Token criptográficamente aleatorio, 43 chars base64url (32 bytes). Es la
 *  única credencial de acceso a la respuesta: no recortar. */
export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

export async function createResponse(organization = "Sin especificar"): Promise<BriefResponse> {
  const token = generateToken();
  const { data, error } = await db()
    .from(TABLE)
    .insert({ token, organization })
    .select()
    .single();
  if (error) throw new Error(`No se pudo crear la respuesta: ${error.message}`);
  return data as BriefResponse;
}

export async function getByToken(token: string): Promise<BriefResponse | null> {
  const { data, error } = await db()
    .from(TABLE)
    .select()
    .eq("token", token)
    .maybeSingle();
  if (error) throw new Error(`No se pudo leer la respuesta: ${error.message}`);
  return (data as BriefResponse) ?? null;
}

/**
 * Guarda un lote de respuestas y el progreso mediante el RPC
 * brief_save_answers, que hace el merge EN Postgres (answers || patch) en un
 * solo UPDATE atómico. Motivo: el formulario lo llenan 3-4 personas a la vez
 * desde el mismo enlace; un read-modify-write en JS perdería claves cuando
 * dos autosaves se solapan. Con el merge en la base, cada lote concurrente
 * se aplica completo y la última escritura gana solo POR CLAVE.
 */
export async function saveAnswers(
  token: string,
  incoming: AnswerMap,
  progress: number,
  contact?: { name?: string; email?: string }
): Promise<BriefResponse> {
  const { data, error } = await db().rpc("brief_save_answers", {
    p_token: token,
    p_answers: incoming,
    p_progress: Math.max(0, Math.min(100, Math.round(progress))),
    p_contact_name: contact?.name ?? null,
    p_contact_email: contact?.email ?? null,
  });
  if (error) throw new Error(`No se pudo guardar: ${error.message}`);
  const row = Array.isArray(data) ? (data[0] as BriefResponse | undefined) : undefined;
  if (row) return row;
  // El RPC no tocó filas: o la respuesta ya se envió, o el token no existe.
  const existing = await getByToken(token);
  if (!existing) throw new Error("Respuesta no encontrada.");
  if (existing.status === "completed") {
    throw new Error("Esta respuesta ya fue enviada y no puede editarse.");
  }
  return existing;
}

/** Marca como completada y bloquea la edición. Idempotente frente a dobles
 *  envíos. updated_at lo mantiene el trigger moddatetime de la migración. */
export async function submitResponse(token: string): Promise<BriefResponse> {
  const { data, error } = await db()
    .from(TABLE)
    .update({
      status: "completed",
      progress: 100,
      completed_at: new Date().toISOString(),
    })
    .eq("token", token)
    .eq("status", "in_progress")
    .select()
    .maybeSingle();
  if (error) throw new Error(`No se pudo enviar: ${error.message}`);
  if (data) return data as BriefResponse;
  // Ya estaba completada (doble clic, doble pestaña): devolver el estado real.
  const existing = await getByToken(token);
  if (!existing) throw new Error("Respuesta no encontrada.");
  return existing;
}

export async function listResponses(): Promise<BriefResponse[]> {
  const { data, error } = await db()
    .from(TABLE)
    .select()
    .order("created_at", { ascending: false });
  if (error) throw new Error(`No se pudo listar: ${error.message}`);
  return (data ?? []) as BriefResponse[];
}
