import { NextRequest, NextResponse, connection } from "next/server";
import { getPool } from "@/lib/server/db";


export async function POST(req: NextRequest) {
  await connection();
  const rawBody = await req.text();
  const sig = req.headers.get("paddle-signature") || "";

  // TODO: verify signature using official Paddle Node SDK before parsing.
  // Do not trust frontend success redirects. Only verified webhooks create licenses.

  let event: any;
  try { event = JSON.parse(rawBody); } catch { return NextResponse.json({ error: { code: "INVALID_JSON", message: "Bad payload" } }, { status: 400 }); }

  const eventId = event?.event_id || event?.id;
  const eventType = event?.event_type;
  if (!eventId || !eventType) return NextResponse.json({ error: { code: "INVALID_EVENT", message: "Missing event id/type" } }, { status: 400 });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // idempotency
    const ins = await client.query(
      "INSERT INTO processed_webhook_events (event_id, event_type, processing_status) VALUES ($1,$2,'received') ON CONFLICT (event_id) DO NOTHING RETURNING event_id",
      [eventId, eventType]
    );
    if (ins.rowCount === 0) {
      await client.query("COMMIT");
      return NextResponse.json({ received: true }); // duplicate
    }

    // Only process transaction.completed (verify exact event name via Paddle docs)
    if (eventType === "transaction.completed") {
      const txn = event?.data || {};
      const status = txn?.status;
      const items = txn?.items || [];
      const currency = txn?.currency_code || txn?.currency;
      const total = txn?.details?.totals?.total || txn?.total;
      const transactionId = txn?.id;
      const customerId = txn?.customer_id;
      const productId = items?.[0]?.product_id || items?.[0]?.price_id;
      const priceId = items?.[0]?.price_id;

      if (status !== "completed") throw new Error("Transaction not completed");
      if (currency !== "USD") throw new Error("Invalid currency");
      if (String(total) !== "2900") throw new Error("Invalid amount");

      // idempotent license creation
      const existing = await client.query("SELECT license_id FROM licenses WHERE paddle_transaction_id = $1", [transactionId]);
      if (existing.rowCount === 0) {
        const key = (await import("@/lib/server/license")).generateLicenseKey();
        const hash = (await import("@/lib/server/license")).hashLicenseKey(key);
        await client.query(
          `INSERT INTO licenses (license_key_hash, customer_email, paddle_transaction_id, paddle_customer_id, product_id, price_id, amount_cents, currency, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active')`,
          [hash, txn?.customer?.email || "unknown", transactionId, customerId, productId, priceId, 2900, currency]
        );
        // TODO: enqueue purchase email with key (retry-safe, separate delivery tracking)
      }
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
