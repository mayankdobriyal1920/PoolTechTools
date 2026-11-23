import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { getPool } from "@/lib/server/db";
import crypto from "node:crypto";
import { generateLicenseKey, hashLicenseKey } from "@/lib/server/license";

function verifyPaddleSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const trimmedSecret = secret.trim();
  const parts = signatureHeader.split(";").map((p) => p.trim());
  const tsPart = parts.find((p) => p.startsWith("ts="));
  const h1Part = parts.find((p) => p.startsWith("h1="));
  if (!tsPart || !h1Part) return false;
  const ts = tsPart.slice(3);
  const h1 = h1Part.slice(3);
  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto.createHmac("sha256", trimmedSecret).update(signedPayload).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const h1Buf = Buffer.from(h1, "hex");
  if (expectedBuf.length !== h1Buf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, h1Buf);
}

export async function POST(req: NextRequest) {
  await connection();
  const rawBody = await req.text();
  const sig = req.headers.get("paddle-signature") || "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET || "";

  console.log("[WEBHOOK DEBUG] Received request", {
    method: req.method,
    url: req.url,
    hasSignature: !!sig,
    signaturePrefix: sig ? sig.slice(0, 20) + "..." + sig.slice(-20) : "none",
    signatureLength: sig.length,
    hasSecret: !!secret,
    secretPrefix: secret ? secret.slice(0, 20) + "..." + secret.slice(-20) : "none",
    secretLength: secret.length,
    trimmedSecretLength: secret.trim().length,
    hasPaddleApiKey: !!process.env.PADDLE_API_KEY,
    paddleApiKeyPrefix: process.env.PADDLE_API_KEY ? process.env.PADDLE_API_KEY.slice(0, 10) + "..." : "none",
  });

  if (!secret) {
    console.error("[WEBHOOK] PADDLE_WEBHOOK_SECRET environment variable is not set");
    return NextResponse.json({ error: { code: "CONFIG_ERROR", message: "Webhook secret not configured" } }, { status: 500 });
  }

  const isValid = verifyPaddleSignature(rawBody, sig, secret);
  console.log("[WEBHOOK] Signature verification result:", isValid);

  if (!isValid) {
    console.error("[WEBHOOK] Signature verification failed");
    return NextResponse.json({ error: { code: "INVALID_SIGNATURE", message: "Paddle webhook signature verification failed" } }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: { code: "INVALID_JSON", message: "Invalid JSON body" } }, { status: 400 });
  }

  const eventId = event?.event_id;
  const eventType = event?.event_type;
  if (!eventId || !eventType) return NextResponse.json({ error: { code: "INVALID_EVENT", message: "Missing event id/type" } }, { status: 400 });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const ins = await client.query(
      "INSERT INTO processed_webhook_events (event_id, event_type, processing_status) VALUES ($1,$2,'received') ON CONFLICT (event_id) DO NOTHING RETURNING event_id",
      [eventId, eventType]
    );
    if (ins.rowCount === 0) {
      await client.query("COMMIT");
      return NextResponse.json({ received: true });
    }

    if (eventType === "transaction.completed") {
      const txn: any = event?.data || {};
      const status = txn?.status;
      const items = txn?.items || [];
      const currency = txn?.currency_code || txn?.currency;
      const total = txn?.details?.totals?.total || txn?.total;
      const transactionId = txn?.id;
      const customerId = txn?.customer_id;
      const customerEmail = txn?.customer?.email;
      const priceId = items?.[0]?.price?.id || items?.[0]?.price_id;

      if (status !== "completed") throw new Error("Transaction not completed");
      if (currency && currency !== "USD") throw new Error("Invalid currency");

      const existing = await client.query("SELECT license_id FROM licenses WHERE paddle_transaction_id = $1", [transactionId]);
      if (existing.rowCount === 0) {
        const key = generateLicenseKey();
        const hash = hashLicenseKey(key);
        await client.query(
          `INSERT INTO licenses (license_key_hash, customer_email, paddle_transaction_id, paddle_customer_id, price_id, amount_cents, currency, status, email_delivery_status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active','pending')`,
          [hash, customerEmail || "unknown", transactionId, customerId, priceId, parseInt(total || "2900", 10), currency || "USD"]
        );
        try {
          const { getEmailService } = await import("@/lib/server/email");
          const emailSvc = getEmailService();
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "";
          const res = await emailSvc.sendPurchaseConfirmation(customerEmail || "unknown", { licenseKey: key, activationUrl: `${appUrl}/pro/activate` });
          await client.query("UPDATE licenses SET email_delivery_status=$2, email_sent_at=NOW(), email_attempts=email_attempts+1 WHERE paddle_transaction_id=$1",
            [transactionId, res.success ? "sent" : "failed"]);
        } catch (e: any) {
          await client.query("UPDATE licenses SET email_delivery_status='failed', email_attempts=email_attempts+1 WHERE paddle_transaction_id=$1", [transactionId]).catch(() => {});
        }
      }
    }

    if (eventType === "transaction.refunded") {
      const txn: any = event?.data || {};
      const transactionId = txn?.id;
      await client.query("UPDATE licenses SET status='refunded', revoked_at=NOW(), revocation_reason='refund' WHERE paddle_transaction_id=$1", [transactionId]);
    }

    await client.query("UPDATE processed_webhook_events SET processing_status='processed', processed_at=NOW() WHERE event_id=$1", [eventId]);
    await client.query("COMMIT");
    return NextResponse.json({ received: true });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});
    await pool.query("UPDATE processed_webhook_events SET processing_status='failed', error_classification=$2, processed_at=NOW() WHERE event_id=$1", [eventId, err?.message || "unknown"]).catch(() => {});
    return NextResponse.json({ error: { code: "PROCESSING_FAILED", message: err?.message || "Failed" } }, { status: 500 });
  } finally {
    client.release();
  }
}