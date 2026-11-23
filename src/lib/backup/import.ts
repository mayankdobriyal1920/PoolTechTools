// src/lib/backup/import.ts
import { getDB } from "@/lib/db";
import { z } from "zod";
import JSZip from "jszip";

export interface ImportPreview {
  counts: Record<string, number>;
  missingAttachments: string[];
  manifest: any;
}


const BackupDataSchema = z.object({
  settings: z.array(z.any()).optional().default([]),
  customers: z.array(z.any()).optional().default([]),
  pools: z.array(z.any()).optional().default([]),
  reports: z.array(z.any()).optional().default([]),
  waterTests: z.array(z.any()).optional().default([]),
  templates: z.array(z.any()).optional().default([]),
  maintenanceTasks: z.array(z.any()).optional().default([]),
});

const ManifestSchema = z.object({
  format: z.literal("PoolTechBackupV1"),
  schemaVersion: z.number().int().positive(),
  appVersion: z.string(),
  createdAt: z.string(),
  counts: z.record(z.string(), z.number()).optional(),
  totalSizeBytes: z.number().optional(),
  files: z.array(z.object({ path: z.string(), sha256: z.string(), sizeBytes: z.number() })).optional(),
});

export async function previewImport(file: File): Promise<ImportPreview> {
  if (file.name.endsWith(".json")) {
    const text = await file.text();
    const data = JSON.parse(text);
    return { counts: { reports: (data.reports || []).length, customers: (data.customers || []).length }, missingAttachments: [], manifest: null };
  }
  const zip = await JSZip.loadAsync(file);
  // safety checks
  const entries = Object.keys(zip.files);
  if (entries.length > 10000) throw new Error("Too many entries");
  for (const name of entries) {
    if (name.includes("..") || name.startsWith("/") || name.includes("\\")) throw new Error("Unsafe path: " + name);
  }
  if (file.size > 500 * 1024 * 1024) throw new Error("Archive too large");
  const manifestText = await zip.file("manifest.json")?.async("string");
  const manifest = manifestText ? JSON.parse(manifestText) : null;
  const dataText = await zip.file("data.json")?.async("string");
  if (!dataText) throw new Error("data.json missing");
  const data = JSON.parse(dataText);
  // missing attachments
  const missing: string[] = [];
  const atts = await (await getDB()).getAll("attachments");
  for (const a of (data.reports || [])) {
    // check photoIds
  }
  return {
    counts: manifest?.counts ?? { reports: (data.reports || []).length, customers: (data.customers || []).length },
    missingAttachments: missing,
    manifest,
  };
}

export async function performImport(file: File, mode: "merge" | "replace"): Promise<void> {
  const db = await getDB();
  let data: any;
  const attachmentBlobs: Map<string, Blob> = new Map();

  if (file.name.endsWith(".json")) {
    data = JSON.parse(await file.text());
  } else {
    const zip = await JSZip.loadAsync(file);
    const dataText = await zip.file("data.json")!.async("string");
    data = JSON.parse(dataText);
    // extract attachments
    for (const path of Object.keys(zip.files)) {
      if (path.startsWith("attachments/") && !zip.files[path].dir) {
        const parts = path.split("/");
        const attId = parts[parts.length - 1].replace(".jpg", "");
        const blob = await zip.files[path].async("blob");
        attachmentBlobs.set(attId, blob);
      }
    }
  }

  // validate in memory first
  if (!data || typeof data !== "object") throw new Error("Invalid backup data");
  const parsed = BackupDataSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid backup data: " + parsed.error.issues.map((i) => i.message).join(", "));
  data = parsed.data;

  // version check
  if (file.name.endsWith(".zip")) {
    const zip = await JSZip.loadAsync(file);
    const manifestText = await zip.file("manifest.json")?.async("string");
    if (manifestText) {
      const manifestParsed = ManifestSchema.safeParse(JSON.parse(manifestText));
      if (!manifestParsed.success) throw new Error("Invalid manifest");
      if (manifestParsed.data.schemaVersion > 1) throw new Error("Unsupported backup version: " + manifestParsed.data.schemaVersion);
    }
  }

  // staged commit
  const tx = db.transaction(
    ["customers", "pools", "reports", "water_tests", "templates", "maintenance_tasks", "attachments", "settings"],
    "readwrite"
  );
  try {
    if (mode === "replace") {
      // clear stores
      for (const store of ["customers", "pools", "reports", "water_tests", "templates", "maintenance_tasks", "attachments"]) {
        await tx.objectStore(store as any).clear();
      }
    }
    for (const c of data.customers || []) await tx.objectStore("customers").put(c);
    for (const p of data.pools || []) await tx.objectStore("pools").put(p);
    for (const r of data.reports || []) await tx.objectStore("reports").put(r);
    for (const w of data.waterTests || []) await tx.objectStore("water_tests").put(w);
    for (const t of data.templates || []) await tx.objectStore("templates").put(t);
    for (const m of data.maintenanceTasks || []) await tx.objectStore("maintenance_tasks").put(m);
    for (const [id, blob] of attachmentBlobs) {
      await tx.objectStore("attachments").put({ id, reportId: "", blob, filename: id + ".jpg", mimeType: "image/jpeg", sizeBytes: blob.size, createdAt: new Date().toISOString() });
    }
    await tx.done;

    // post-import verification: check counts
    const reportCount = await db.count("reports");
    if (reportCount < (data.reports || []).length && mode === "replace") {
      console.warn("Import count mismatch");
    }
  } catch (e) {
    tx.abort();
    throw e;
  }
}
