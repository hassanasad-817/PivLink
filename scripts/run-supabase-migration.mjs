#!/usr/bin/env node
/**
 * Run Supabase migrations via direct Postgres connection.
 * Requires DATABASE_URL in .env (from Supabase Dashboard → Settings → Database → Connection string URI)
 *
 * Usage: npm run db:migrate
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env if not already loaded (e.g. by node --env-file=.env)
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.DATABASE_URL && !process.env.SUPABASE_DB_URL) {
  for (const f of ['.env', '.env.local']) {
    try {
      const content = readFileSync(join(projectRoot, f), 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eq = trimmed.indexOf('=');
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
            process.env[key] = val;
          }
        }
      }
      break;
    } catch (_) {}
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const isPlaceholder = !dbUrl || dbUrl.includes('your_') || dbUrl.includes('YOUR_') || dbUrl.includes('[YOUR-PASSWORD]');
if (isPlaceholder) {
  console.error('DATABASE_URL is missing or still has [YOUR-PASSWORD].');
  console.error('');
  console.error('1. Go to: https://supabase.com/dashboard/project/aqzlhuhncovzdqtquort/settings/database');
  console.error('2. Under "Database password" → click "Reset database password" → copy the new password');
  console.error('3. Open your .env file and on line 9 replace [YOUR-PASSWORD] with that password');
  console.error('   Example: DATABASE_URL=postgresql://postgres:myNewPassword123@db.aqzlhuhncovzdqtquort.supabase.co:5432/postgres');
  process.exit(1);
}

const sql = readFileSync(migrationPath, 'utf8');
const client = new pg.Client({ connectionString: dbUrl });

client.connect()
  .then(() => client.query(sql))
  .then(() => {
    console.log('Migration completed.');
  })
  .catch((err) => {
    if (err.code === '42P07') {
      console.log('Tables already exist. Migration skipped.');
    } else {
      console.error('Migration failed:', err.message);
      process.exit(1);
    }
  })
  .finally(() => client.end());
