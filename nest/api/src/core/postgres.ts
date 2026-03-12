import { Pool } from 'pg';
import { Envs } from '../config/config.module';

export let db: Pool;

export function initializePg() {
  if (db) {
    return db;
  }

  const connectionString = Envs.DATABASE_URL;

  db = new Pool({
    connectionString,
    max: 20,
    allowExitOnIdle: true,
    ssl: Envs.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

  return db;
}
