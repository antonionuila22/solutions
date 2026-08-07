/**
 * Límite de creación de briefs por IP. Reutiliza la tabla `rate_limits` que ya
 * existe en Turso para el formulario de contacto, con un prefijo propio en la
 * columna `ip` — no se toca ni se importa contact.ts.
 *
 * FALLA ABIERTO a propósito: si Turso no está configurado (entorno local sin
 * credenciales) o no responde, se permite la operación. Esto solo frena
 * automatismos; el control real es que /brief va noindex y sin enlaces.
 */

const WINDOW_SEC = 60 * 60; // 1 hora
const MAX_PER_WINDOW = 5;

export async function allowBriefCreation(ip: string): Promise<boolean> {
  const key = `brief:${ip}`;
  try {
    const { turso } = await import("../../../turso");
    await turso.execute(
      `CREATE TABLE IF NOT EXISTS rate_limits (ip TEXT NOT NULL, ts INTEGER NOT NULL)`
    );
    const nowSec = Math.floor(Date.now() / 1000);
    const windowStart = nowSec - WINDOW_SEC;
    await turso.execute({
      sql: `DELETE FROM rate_limits WHERE ip = ? AND ts < ?`,
      args: [key, windowStart],
    });
    const { rows } = await turso.execute({
      sql: `SELECT COUNT(*) AS n FROM rate_limits WHERE ip = ?`,
      args: [key],
    });
    const used = Number(rows[0]?.n ?? 0);
    if (used >= MAX_PER_WINDOW) return false;
    await turso.execute({
      sql: `INSERT INTO rate_limits (ip, ts) VALUES (?, ?)`,
      args: [key, nowSec],
    });
    return true;
  } catch (err) {
    console.warn(
      "[brief] Límite por IP no aplicado (Turso no disponible):",
      err instanceof Error ? err.message : "error desconocido"
    );
    return true;
  }
}

/** IP del cliente detrás de Netlify. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "desconocida";
}
