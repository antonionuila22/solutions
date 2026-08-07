import { generateToken } from "./brief-repository";
import type { AnswerMap, BriefResponse } from "../types";

/**
 * Almacén en memoria para `astro dev` sin credenciales de Supabase. Réplica
 * exacta de la API del repositorio real, incluidas sus invariantes de estado
 * (una respuesta enviada no se edita) — así lo que se prueba en local es el
 * mismo comportamiento que en producción, salvo la persistencia.
 *
 * NO se usa nunca en producción: brief-store.ts solo lo elige en DEV.
 */

const rows = new Map<string, BriefResponse>();

const now = () => new Date().toISOString();

export async function createResponse(organization = "Sin especificar"): Promise<BriefResponse> {
  const token = generateToken();
  const row: BriefResponse = {
    id: crypto.randomUUID(),
    token,
    status: "in_progress",
    contact_name: null,
    contact_email: null,
    organization,
    answers: {},
    progress: 0,
    completed_at: null,
    created_at: now(),
    updated_at: now(),
  };
  rows.set(token, row);
  return row;
}

export async function getByToken(token: string): Promise<BriefResponse | null> {
  return rows.get(token) ?? null;
}

export async function saveAnswers(
  token: string,
  incoming: AnswerMap,
  progress: number,
  contact?: { name?: string; email?: string }
): Promise<BriefResponse> {
  const row = rows.get(token);
  if (!row) throw new Error("Respuesta no encontrada.");
  if (row.status === "completed") {
    throw new Error("Esta respuesta ya fue enviada y no puede editarse.");
  }
  // Mismo merge por clave que hace `answers || patch` en Postgres.
  const next: BriefResponse = {
    ...row,
    answers: { ...row.answers, ...incoming },
    progress: Math.max(0, Math.min(100, Math.round(progress))),
    contact_name: contact?.name ?? row.contact_name,
    contact_email: contact?.email ?? row.contact_email,
    updated_at: now(),
  };
  rows.set(token, next);
  return next;
}

export async function submitResponse(token: string): Promise<BriefResponse> {
  const row = rows.get(token);
  if (!row) throw new Error("Respuesta no encontrada.");
  if (row.status === "completed") return row;
  const next: BriefResponse = {
    ...row,
    status: "completed",
    progress: 100,
    completed_at: now(),
    updated_at: now(),
  };
  rows.set(token, next);
  return next;
}

export async function listResponses(): Promise<BriefResponse[]> {
  return [...rows.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
