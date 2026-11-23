import { NextRequest, NextResponse, connection } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";
import { hashLicenseKey } from "@/lib/server/license";

const Body = z.object({ recoveryToken: z.string().min(1) });


export async function POST(req: NextRequest) {
  await connection();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Invalid token" } }, { status: 400 });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // TODO: verify recovery token (hash, single-use, not expired) against licenses.recovery_verification_token_hash
    // On success: invalidate token, generate new license key, hash, update license, email new key
    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});
    return NextResponse.json({ error: { code: "INVALID_TOKEN", message: "Invalid or expired token" } }, { status: 400 });
  } finally {
    client.release();
  }
}
