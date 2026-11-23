import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connection } from "next/server";
import { getPool } from "@/lib/server/db";
import { hashLicenseKey } from "@/lib/server/license";

const Body = z.object({ licenseKey: z.string().min(10) });

export async function POST(req: NextRequest) {
  await connection();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Invalid request" } }, { status: 400 });

  const pool = getPool();
  try {
    const hash = hashLicenseKey(parsed.data.licenseKey);
    const lic = await pool.query("SELECT license_id, status, max_activations FROM licenses WHERE license_key_hash = $1", [hash]);
    if (lic.rowCount === 0) return NextResponse.json({ error: { code: "LICENSE_NOT_FOUND", message: "Not found" } }, { status: 404 });
    const license = lic.rows[0];
    const acts = await pool.query(
      "SELECT activation_id, device_name, activated_at, last_validated_at, status FROM license_activations WHERE license_id = $1 ORDER BY activated_at",
      [license.license_id]
    );
    return NextResponse.json({ devices: acts.rows, maxActivations: license.max_activations, licenseStatus: license.status });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err?.message || "Failed" } }, { status: 500 });
  }
}
