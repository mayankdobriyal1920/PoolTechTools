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

export function signEntitlementToken(payload: Record<string, unknown>): string {
  const privB64 = process.env.ED25519_PRIVATE_KEY || "";
  const privDer = Buffer.from(privB64, "base64");
  const key = crypto.createPrivateKey({ key: privDer, format: "der", type: "pkcs8" });
  const header = Buffer.from(JSON.stringify({ alg: "EdDSA", typ: "JWT", kid: (payload.kid as string) || "key-1" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingInput = `${header}.${body}`;
  const sig = crypto.sign(null, Buffer.from(signingInput), key);
  return `${signingInput}.${sig.toString("base64url")}`;
}
