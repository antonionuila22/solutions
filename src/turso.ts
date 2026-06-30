// src/turso.ts
import { createClient, type Client } from "@libsql/client"; // o "@libsql/client/web" según tu entorno

const dbUrl = process.env.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN || import.meta.env.TURSO_AUTH_TOKEN;

/**
 * Cuando faltan las credenciales (p. ej. en local sin `.env`), NO creamos el
 * cliente real — `createClient({ url: '' })` lanza `URL_INVALID` al cargar el
 * módulo y tumba toda la API. En su lugar devolvemos un stub cuyos métodos
 * lanzan un error normal, que los `try/catch` de los endpoints ya capturan
 * (fail-open): el formulario sigue enviando el correo, solo se omite la DB.
 */
function createTursoStub(): Client {
    const fail = () => {
        throw new Error(
            "[Turso] Database not configured (missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN).",
        );
    };
    return new Proxy({} as Client, { get: () => fail });
}

if (!dbUrl || !authToken) {
    console.warn('[Turso] Missing database configuration. Database features are disabled.');
}

export const turso: Client =
    dbUrl && authToken
        ? createClient({ url: dbUrl, authToken })
        : createTursoStub();
