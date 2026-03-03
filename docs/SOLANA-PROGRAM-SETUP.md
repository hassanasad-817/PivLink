# Getting NEXT_PUBLIC_PROGRAM_ID and NEXT_PUBLIC_USDC_MINT

## NEXT_PUBLIC_USDC_MINT (you already have this)

Your `.env` already has the correct value for **devnet**:

- **Devnet:** `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **Mainnet:** `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

No change needed unless you switch to mainnet.

---

## NEXT_PUBLIC_PROGRAM_ID (you need to generate this)

The program ID is the public key of your escrow program. You get it by building and (optionally) deploying your Anchor program.

### Option A: Install Anchor CLI and build locally (recommended)

1. **Install Anchor** (if not installed):
   - https://www.anchor-lang.com/docs/installation
   - Windows: use WSL or follow the official install steps for your OS.

2. **Build the program** (from the PivLink repo root):
   ```bash
   anchor build
   ```

3. **Get the program ID**:
   ```bash
   anchor keys list
   ```
   You’ll see something like:
   ```
   pivlink: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
   ```

4. **Put it in `.env`**:
   ```env
   NEXT_PUBLIC_PROGRAM_ID=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
   ```
   (Use the value from your `anchor keys list` output.)

5. **Update the program source** so it matches:
   - In `programs/pivlink/src/lib.rs`, set:
     `declare_id!("YOUR_PROGRAM_ID_FROM_KEYS_LIST");`
   - In `Anchor.toml`, set the same ID under `[programs.devnet]` and `[programs.mainnet]`.

6. **Rebuild** (so the binary matches the ID):
   ```bash
   anchor build
   ```

### Option B: Read the keypair file after a build

If you’ve already run `anchor build` once:

1. Open `target/deploy/pivlink-keypair.json` (array of numbers).
2. Convert that keypair to a base58 public key using any “keypair bytes to Solana address” tool, **or**
3. Run `anchor keys list` (Option A, step 3) and use that program ID.

---

## Summary: what to put in `.env`

| Variable | Where to get it |
|----------|------------------|
| `NEXT_PUBLIC_USDC_MINT` | Already set for devnet. Use mainnet value above if you switch. |
| `NEXT_PUBLIC_PROGRAM_ID` | Run `anchor build` then `anchor keys list`; copy the `pivlink:` value. |
| `NEXT_PUBLIC_TREASURY_WALLET` | Your Solana wallet address (e.g. from Phantom or `solana address`). |

After setting `NEXT_PUBLIC_PROGRAM_ID` (and `NEXT_PUBLIC_TREASURY_WALLET` if needed), restart the dev server and try creating an invoice again.
