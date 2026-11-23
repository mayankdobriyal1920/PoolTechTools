import { NextRequest, NextResponse, connection } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";
import { rateLimit, getClientIP } from "@/lib/server/rateLimit";
import { hashLicenseKey, timingSafeEqual } from "@/lib/server/license";

const Body = z.object({
  licenseKey: z.string().min(10),
  deviceName: z.string().min(1).max(100),
  deviceHash: z.string().min(1).max(256),
});


export async function POST(req: NextRequest) {
  await connection();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Invalid request", details: parsed.error.flatten() } }, { status: 400 });

  const { licenseKey, deviceName, deviceHash } = parsed.data;
  const ip = getClientIP(req);
  const rl = rateLimit(`activate:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const hash = hashLicenseKey(licenseKey);
    const lic = await client.query("SELECT license_id, status, max_activations FROM licenses WHERE license_key_hash = $1", [hash]);
    if (lic.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: { code: "LICENSE_NOT_FOUND", message: "License not found" } }, { status: 404 });
    }
    const license = lic.rows[0];
    if (license.status !== "active") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: { code: "LICENSE_INACTIVE", message: "License is not active" } }, { status: 403 });
    }
    // lock row
    await client.query("SELECT license_id FROM licenses WHERE license_id = $1 FOR UPDATE", [license.license_id]);

    // existing activation?
    const existing = await client.query(
      "SELECT activation_id FROM license_activations WHERE license_id = $1 AND activation_identifier_hash = $2 AND status='active'",
      [license.license_id, deviceHash]
    );
    let activationId: string;
    if (existing.rowCount && existing.rowCount > 0) {
      activationId = existing.rows[0].activation_id;
      await client.query("UPDATE license_activations SET last_validated_at = NOW(), device_name = $2 WHERE activation_id = $1", [activationId, deviceName]);
    } else {
      const count = await client.query("SELECT COUNT(*)::int AS c FROM license_activations WHERE license_id = $1 AND status='active'", [license.license_id]);
      if (count.rows[0].c >= license.max_activations) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: { code: "DEVICE_LIMIT_REACHED", message: "Device limit reached (max 3)" } }, { status: 409 });
      }
      const ins = await client.query(
        "INSERT INTO license_activations (license_id, activation_identifier_hash, device_name) VALUES ($1,$2,$3) RETURNING activation_id",
        [license.license_id, deviceHash, deviceName]
      );
      activationId = ins.rows[0].activation_id;
    }

    await client.query("COMMIT");
    const { signEntitlementToken } = await import("@/lib/server/license");
    const now = Math.floor(Date.now() / 1000);
    const token = await signEntitlementToken({
      sub: license.license_id,
      iss: process.env.NEXT_PUBLIC_APP_URL || "pooltechtools",
      aud: "ptt-client",
      pro: true,
      iat: now,
      exp: now + 14 * 86400,
      ver: 1,
      kid: "key-1",
      dev: deviceHash,
      act: activationId,
      pid: "pooltechtools-pro",
    });
    return NextResponse.json({ success: true, signedToken: token, expiresAt: new Date((now + 14 * 86400) * 1000).toISOString(), activationId });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err?.message || "Failed" } }, { status: 500 });
  } finally {
    client.release();
  }
}
