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
