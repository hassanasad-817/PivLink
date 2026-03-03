export interface User {
  wallet_address: string;
  name: string;
  email?: string;
  role: 'freelancer';
  created_at: string;
}

export interface Invoice {
  id: string;
  freelancer_wallet: string;
  client_name?: string;
  amount_usdc: number;
  vault_address: string;
  status: 'created' | 'funded' | 'released' | 'disputed';
  mode: 'manual' | 'ai';
  release_password_hash?: string;
  created_at: string;
  updated_at: string;
}
