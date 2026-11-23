import { NextRequest, NextResponse, connection } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";

const Body = z.object({ signedToken: z.string().min(1) });


export async function POST(req: NextRequest) {
  await connection();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Invalid request" } }, { status: 400 });

  // TODO: verify Ed25519 signature with public key, check iss/aud/pid/exp, extract license_id + activation_id
  // TODO: DB lookup license active, refresh last_validated_at, issue refreshed token
  const pool = getPool();
  try {
    await pool.query("SELECT 1");
    return NextResponse.json({ valid: true, signedToken: "TODO_REFRESHED_TOKEN", expiresAt: new Date(Date.now() + 14 * 86400000).toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err?.message || "Failed" } }, { status: 500 });
  }
}
