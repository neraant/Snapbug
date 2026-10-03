import { env } from "@workspace/database/env/env.schema";
import { relations } from "@workspace/database/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const createDb = (pool: Pool) => drizzle({ client: pool, relations });

const globalForDb = globalThis as unknown as {
  pool?: Pool;
  db?: ReturnType<typeof createDb>;
};

export const pool = globalForDb.pool ?? new Pool({ connectionString: env.DATABASE_URL });

export const db = globalForDb.db ?? createDb(pool);

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
  globalForDb.db = db;
}

export type Database = typeof db;
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type DbClient = Database | Transaction;
