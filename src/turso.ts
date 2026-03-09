// src/turso.ts
import { createClient } from "@libsql/client"; // o "@libsql/client/web" según tu entorno

const dbUrl = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
    console.warn('[Turso] Missing database configuration. Database features will not work.');
}

export const turso = createClient({
    url: dbUrl || '',
    authToken: authToken || '',
});
