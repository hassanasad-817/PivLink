-- Run once in Supabase SQL Editor if you had "duplicate key" on vault_address.
-- Fixes any existing invoices that still have empty vault (from before the off-chain fix).
UPDATE invoices
SET vault_address = 'off-chain-' || id::text || '-legacy'
WHERE vault_address = '' OR vault_address IS NULL;
