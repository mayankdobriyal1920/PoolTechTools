// src/lib/license/verify.ts — client-side Ed25519 token verification
import { verifyAsync } from "@noble/ed25519";

export interface EntitlementPayload {
  sub: string;
  iss: string;
  aud: string;
  pro: boolean;
  iat: number;
  exp: number;
  ver: number;
  kid: string;
  dev: string;
  act: string;
  pid: string;
}

export async function verifyToken(token: string): Promise<{ valid: boolean; payload: EntitlementPayload | null; reason?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, payload: null, reason: "malformed" };
    const [h, b, s] = parts;
    // Support multiple public keys by kid (for key rotation)
    let pubB64 = process.env.NEXT_PUBLIC_ED25519_PUBLIC_KEY || "";
    const multiKeys = process.env.NEXT_PUBLIC_ED25519_PUBLIC_KEYS;
    if (multiKeys) {
      try {
        const map = JSON.parse(multiKeys);
        const header = JSON.parse(atob(h.replace(/-/g, "+").replace(/_/g, "/")));
        if (map[header.kid]) pubB64 = map[header.kid];
      } catch {}
    }
    if (!pubB64) return { valid: false, payload: null, reason: "no public key" };
    const pubBytes = Uint8Array.from(atob(pubB64), (c) => c.charCodeAt(0));
    const sigBytes = Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    const msgBytes = new TextEncoder().encode(`${h}.${b}`);
    const ok = await verifyAsync(sigBytes, msgBytes, pubBytes);
    if (!ok) return { valid: false, payload: null, reason: "bad signature" };
    const payload = JSON.parse(atob(b.replace(/-/g, "+").replace(/_/g, "/"))) as EntitlementPayload;
    if (payload.aud !== "ptt-client") return { valid: false, payload, reason: "bad audience" };
    if (payload.pid !== "pooltechtools-pro") return { valid: false, payload, reason: "bad product" };
    if (!payload.pro) return { valid: false, payload, reason: "not pro" };
    if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false, payload, reason: "expired" };
    return { valid: true, payload };
  } catch (e: any) {
    return { valid: false, payload: null, reason: e?.message || "error" };
  }
}
