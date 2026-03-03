#!/usr/bin/env node
/**
 * Print migration SQL for manual run in Supabase SQL Editor.
 * Use when DATABASE_URL is not set.
 *
 * 1. Run: npm run db:migrate:manual
 * 2. Copy the output
 * 3. Supabase Dashboard → SQL Editor → paste and run
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql'), 'utf8');
console.log('Copy the SQL below and run it in Supabase Dashboard → SQL Editor:\n');
console.log('---');
console.log(sql);
console.log('---');
