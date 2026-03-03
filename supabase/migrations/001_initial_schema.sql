-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    wallet_address TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('freelancer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table (Off-chain Mirror)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    freelancer_wallet TEXT NOT NULL REFERENCES users(wallet_address),
    client_name TEXT,
    amount_usdc NUMERIC NOT NULL CHECK (amount_usdc > 0),
    vault_address TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'created' CHECK (
        status IN ('created', 'funded', 'released', 'disputed')
    ),
    mode TEXT NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'ai')),
    release_password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_invoices_freelancer ON invoices(freelancer_wallet);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_vault ON invoices(vault_address);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
