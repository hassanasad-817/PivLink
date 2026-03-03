#!/usr/bin/env node
import { rmSync } from 'fs';
import { spawn } from 'child_process';

try {
  rmSync('.next', { recursive: true, force: true });
  console.log('Cleared .next cache');
} catch (_) {}

spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });
