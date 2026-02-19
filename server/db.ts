import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use a default database URL for development if not set
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/scamguard";

console.log("Attempting to connect to database...");

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  // Add connection timeout and retry logic
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const db = drizzle(pool, { schema });
