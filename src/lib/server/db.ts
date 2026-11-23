// src/lib/server/db.ts — PostgreSQL client (Neon/Supabase)
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not set");
    pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 10 });
  }
  return pool;
}
