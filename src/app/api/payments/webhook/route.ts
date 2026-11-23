import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { getPool } from "@/lib/server/db";
import { Webhooks } from "@paddle/paddle-node-sdk";
import { generateLicenseKey, hashLicenseKey } from "@/lib/server/license";

export async function POST(req: NextRequest) {
  await connection();
  const rawBody = await req.text();
  const sig = req.headers.get("paddle-signature") || "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET || "";

  let event: any;
  try {
    event = await new Webhooks().unmarshal(rawBody, secret, sig);
  } catch (err: any) {
    return NextResponse.json({ error: { code: "INVALID_SIGNATURE", message: err?.message || "Bad signature" } }, { status: 400 });
  }

  const eventId = event?.eventId || event?.id;
  const eventType = event?.eventType || event?.type;
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
      const currency = txn?.currencyCode || txn?.currency;
      const total = txn?.details?.totals?.total || txn?.total;
      const transactionId = txn?.id;
      const customerId = txn?.customerId;
      const customerEmail = txn?.customer?.email;
      const productId = items?.[0]?.productId || items?.[0]?.priceId;
      const priceId = items?.[0]?.priceId;

      if (status !== "completed") throw new Error("Transaction not completed");
      if (currency && currency !== "USD") throw new Error("Invalid currency");

      const existing = await client.query("SELECT license_id FROM licenses WHERE paddle_transaction_id = $1", [transactionId]);
      if (existing.rowCount === 0) {
        const key = generateLicenseKey();
        const hash = hashLicenseKey(key);
        await client.query(
          `INSERT INTO licenses (license_key_hash, customer_email, paddle_transaction_id, paddle_customer_id, product_id, price_id, amount_cents, currency, status, email_delivery_status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active','pending')`,
          [hash, customerEmail || "unknown", transactionId, customerId, productId, priceId, parseInt(total || "2900", 10), currency || "USD"]
        );
        // TODO: send purchase email with key (retry-safe). Store key in a secure way? Key is only in email now.
        console.log("License created for", customerEmail, "key:", key);
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
