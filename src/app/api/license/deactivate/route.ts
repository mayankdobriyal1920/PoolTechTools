import { NextRequest, NextResponse, connection } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";
import { hashLicenseKey } from "@/lib/server/license";

const Body = z.object({ licenseKey: z.string().min(10), deviceHash: z.string().min(1) });


export async function POST(req: NextRequest) {
  await connection();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Invalid request" } }, { status: 400 });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const hash = hashLicenseKey(parsed.data.licenseKey);
    const lic = await client.query("SELECT license_id FROM licenses WHERE license_key_hash = $1", [hash]);
    if (lic.rowCount === 0) { await client.query("ROLLBACK"); return NextResponse.json({ error: { code: "LICENSE_NOT_FOUND", message: "Not found" } }, { status: 404 }); }
    const upd = await client.query(
      "UPDATE license_activations SET status='deactivated', deactivated_at=NOW() WHERE license_id=$1 AND activation_identifier_hash=$2 AND status='active' RETURNING activation_id",
      [lic.rows[0].license_id, parsed.data.deviceHash]
    );
    const remaining = await client.query("SELECT COUNT(*)::int AS c FROM license_activations WHERE license_id=$1 AND status='active'", [lic.rows[0].license_id]);
    await client.query("COMMIT");
    return NextResponse.json({ success: true, deactivated: (upd.rowCount ?? 0) > 0, remainingActivations: remaining.rows[0].c });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err?.message || "Failed" } }, { status: 500 });
  } finally {
    client.release();
  }
}
