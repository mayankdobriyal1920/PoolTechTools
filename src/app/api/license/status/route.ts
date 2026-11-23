import { NextRequest, NextResponse, connection } from "next/server";
import { getPool } from "@/lib/server/db";


export async function GET(req: NextRequest) {
  await connection();
  // TODO: verify Bearer token (Ed25519), extract license_id, query activations count
  const pool = getPool();
  try {
    await pool.query("SELECT 1");
    return NextResponse.json({ pro: false, expiresAt: null, devicesUsed: 0, maxDevices: 3 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err?.message || "Failed" } }, { status: 500 });
  }
}
