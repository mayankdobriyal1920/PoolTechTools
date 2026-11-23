// src/lib/backup/snapshot.ts — rolling recovery snapshots (Pro)
import { getDB } from "@/lib/db";
import type { Snapshot } from "@/lib/db/types";

const MAX_SNAPSHOTS = 5;

export async function createSnapshot(reason: Snapshot["reason"]): Promise<void> {
  const db = await getDB();

  // quota check
  if (navigator.storage?.estimate) {
    const est = await navigator.storage.estimate();
    const used = est.usage || 0;
    const quota = est.quota || 0;
    if (used / quota > 0.9) {
      console.warn("Storage quota too high, skipping snapshot");
      return;
    }
  }

  // gather all records EXCEPT photo blobs (metadata only)
  const data = {
    settings: await db.getAll("settings"),
    customers: await db.getAll("customers"),
    pools: await db.getAll("pools"),
    reports: await db.getAll("reports"),
    waterTests: await db.getAll("water_tests"),
    templates: await db.getAll("templates"),
    maintenanceTasks: await db.getAll("maintenance_tasks"),
    // attachments: metadata only (no blobs)
    attachments: (await db.getAll("attachments")).map((a) => ({ id: a.id, reportId: a.reportId, filename: a.filename, mimeType: a.mimeType, sizeBytes: a.sizeBytes, createdAt: a.createdAt })),
  };

  const json = JSON.stringify(data);
  // compress (simple: store as-is; in production use pako or CompressionStream)
  const compressed = json;

  const snapshot: Omit<Snapshot, "id"> = {
    createdAt: new Date().toISOString(),
    reason,
    compressedPayload: compressed,
    sizeBytes: json.length,
    schemaVersion: 1,
  };

  await db.add("snapshots", snapshot as any);

  // evict oldest if > MAX
  const all = await db.getAll("snapshots");
  if (all.length > MAX_SNAPSHOTS) {
    const sorted = all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const toDelete = sorted.slice(0, all.length - MAX_SNAPSHOTS);
    for (const s of toDelete) {
      if (s.id != null) await db.delete("snapshots", s.id);
    }
  }
}

export async function listSnapshots(): Promise<Snapshot[]> {
  const db = await getDB();
  const all = await db.getAll("snapshots");
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function restoreSnapshot(id: number): Promise<void> {
  const db = await getDB();
  const snap = await db.get("snapshots", id);
  if (!snap) throw new Error("Snapshot not found");
  const data = JSON.parse(snap.compressedPayload);

  const tx = db.transaction(
    ["settings", "customers", "pools", "reports", "water_tests", "templates", "maintenance_tasks"],
    "readwrite"
  );
  try {
    for (const store of ["customers", "pools", "reports", "water_tests", "templates", "maintenance_tasks"]) {
      await tx.objectStore(store as any).clear();
    }
    for (const c of data.customers || []) await tx.objectStore("customers").put(c);
    for (const p of data.pools || []) await tx.objectStore("pools").put(p);
    for (const r of data.reports || []) await tx.objectStore("reports").put(r);
    for (const w of data.waterTests || []) await tx.objectStore("water_tests").put(w);
    for (const t of data.templates || []) await tx.objectStore("templates").put(t);
    for (const m of data.maintenanceTasks || []) await tx.objectStore("maintenance_tasks").put(m);
    await tx.done;
  } catch (e) {
    tx.abort();
    throw e;
  }
}

export async function deleteSnapshot(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("snapshots", id);
}
