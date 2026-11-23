import { NextRequest, NextResponse, connection } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";
import { rateLimit, getClientIP } from "@/lib/server/rateLimit";

const Body = z.object({ email: z.string().email() });


export async function POST(req: NextRequest) {
  await connection();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Invalid email" } }, { status: 400 });

  // Always return received:true to prevent enumeration
  const ip = getClientIP(req);
  const rl = rateLimit(`recover:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts." } }, { status: 429 });
  const pool = getPool();
  try {
    // TODO: rate limit per email/IP; if licenses exist for email, create single-use recovery token (15 min) and send email
    await pool.query("SELECT 1");
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err?.message || "Failed" } }, { status: 500 });
  }
}
