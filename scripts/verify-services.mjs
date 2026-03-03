#!/usr/bin/env node
/**
 * Run with: npm run verify (dev server must be running first)
 */
const url = 'http://localhost:3000/api/verify-services';
fetch(url)
  .then((r) => r.json())
  .then((d) => {
    console.log(JSON.stringify(d, null, 2));
    process.exit(d.ok ? 0 : 1);
  })
  .catch((e) => {
    console.error('Start the dev server first: npm run dev');
    console.error('Then run: npm run verify');
    console.error('Or visit:', url);
    process.exit(1);
  });
