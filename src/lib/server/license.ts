// src/lib/server/license.ts — helpers for license key hashing & token signing (skeleton)
import crypto from "crypto";

export function generateLicenseKey(): string {
  const bytes = crypto.randomBytes(16);
  const hex = bytes.toString("hex").toUpperCase();
  const groups = hex.match(/.{1,6}/g) || [];
  return "PTT-" + groups.slice(0, 4).join("-");
}

export function hashLicenseKey(key: string): string {
  const secret = process.env.LICENSE_KEY_HMAC_SECRET || "dev-secret";
  return crypto.createHmac("sha256", secret).update(key.toUpperCase().replace(/[\s-]/g, "")).digest("hex");
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}


export async function signEntitlementToken(payload: Record<string, unknown>): Promise<string> {
  const { signAsync, getPublicKeyAsync } = await import("@noble/ed25519");
  const privB64 = process.env.ED25519_PRIVATE_KEY || "";
  const privBytes = Buffer.from(privB64, "base64");
  if (privBytes.length !== 32) throw new Error("ED25519_PRIVATE_KEY must be base64 of 32 raw bytes");
  const header = Buffer.from(JSON.stringify({ alg: "EdDSA", typ: "JWT", kid: (payload.kid as string) || "key-1" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingInput = `${header}.${body}`;
  const sig = await signAsync(new TextEncoder().encode(signingInput), privBytes);
  return `${signingInput}.${Buffer.from(sig).toString("base64url")}`;
}

export function getPublicKeyBase64(): string {
  // Derive public key from private seed at runtime (server only)
  const { getPublicKey } = require("@noble/ed25519");
  const privB64 = process.env.ED25519_PRIVATE_KEY || "";
  const privBytes = Buffer.from(privB64, "base64");
  const pub = getPublicKey(privBytes);
  return Buffer.from(pub).toString("base64");
}
