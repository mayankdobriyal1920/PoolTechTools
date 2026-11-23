# Key Rotation Runbook

## Ed25519 Signing Key Rotation

1. Generate new keypair (raw 32-byte seed + public key).
2. Set `ED25519_PRIVATE_KEY` to new private key in Vercel (production).
3. Add new public key to `NEXT_PUBLIC_ED25519_PUBLIC_KEYS` JSON map with new kid (e.g., "key-2026-02"), keeping old key.
4. Deploy. Server now signs with new key; client accepts both old and new keys.
5. After 30 days (overlap window), remove old key from `NEXT_PUBLIC_ED25519_PUBLIC_KEYS`.
6. Redeploy.

## License Key HMAC Secret Rotation

1. Generate new secret: `openssl rand -hex 32`.
2. **Warning:** Rotating `LICENSE_KEY_HMAC_SECRET` invalidates all existing license key hashes.
3. To avoid breaking existing users, support dual-secret verification during rotation window:
   - Store both old and new secrets in env vars.
   - Verify against both; re-hash with new secret on successful match.
4. After all licenses re-hashed, remove old secret.
5. Alternatively, issue new license keys to all users (support process).

## Paddle Webhook Secret Rotation

1. Generate new webhook secret in Paddle dashboard.
2. Update `PADDLE_WEBHOOK_SECRET` in Vercel.
3. Update webhook endpoint in Paddle dashboard with new secret.
4. Redeploy.
