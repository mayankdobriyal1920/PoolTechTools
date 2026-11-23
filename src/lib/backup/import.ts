// src/lib/backup/import.ts
import { getDB } from "@/lib/db";
import JSZip from "jszip";

export interface ImportPreview {
  counts: Record<string, number>;
  missingAttachments: string[];
  manifest: any;
}

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

  // validate in memory first (basic)
  if (!data || typeof data !== "object") throw new Error("Invalid backup data");

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
  } catch (e) {
    tx.abort();
    throw e;
  }
}
