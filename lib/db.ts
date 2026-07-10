import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
  connPool: Pool | undefined;
};

export const pool =
  globalForDb.connPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connPool = pool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows as T[];
}
