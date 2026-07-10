import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
  connPool: Pool | undefined;
};

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  const isNeon = connectionString?.includes("neon.tech");

  return new Pool({
    connectionString,
    ssl: isNeon ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
}

export const pool = globalForDb.connPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.connPool = pool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows as T[];
}
