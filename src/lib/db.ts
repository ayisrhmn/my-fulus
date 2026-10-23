import "server-only";
import postgres from "postgres";

// Direct Postgres connection. Server-only: never import this from client code.
// There is no RLS, so every query MUST scope by `user_id` explicitly.

const DATABASE_URL = process.env.DATABASE_URL;
// Schema that holds this app's tables on the shared DB. Applied as the
// search_path so queries use plain table names.
const DB_SCHEMA = process.env.DB_SCHEMA;

if (!DATABASE_URL) {
  throw new Error("Missing database config. Set DATABASE_URL in .env");
}

// One pool per process. Cached on globalThis in every environment: dev hot
// reloads re-evaluate this module, and the production build can load it once
// per server layer (route handlers vs. pages), which would multiply the pool.
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export const sql =
  globalForDb.sql ??
  postgres(DATABASE_URL, {
    // Shared DB: keep the per-instance pool small to spare max_connections.
    max: 3,
    idle_timeout: 20,
    ...(DB_SCHEMA && { connection: { search_path: DB_SCHEMA } }),
  });

globalForDb.sql = sql;
