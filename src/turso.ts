// src/turso.ts
import { createClient } from "@libsql/client"; // o "@libsql/client/web" seg\u00fan tu entorno

export const turso = createClient({
    url: import.meta.env.TURSO_DATABASE_URL,
    authToken: import.meta.env.TURSO_AUTH_TOKEN
});
