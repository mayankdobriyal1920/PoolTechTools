// src/lib/backup/export.ts
import { getDB } from "@/lib/db";
import JSZip from "jszip";

export interface BackupManifest {
  format: "PoolTechBackupV1";
  schemaVersion: number;
  appVersion: string;
  createdAt: string;
  counts: Record<string, number>;
  totalSizeBytes: number;
  files: Array<{ path: string; sha256: string; sizeBytes: number }>;
}

async function sha256Blob(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256String(s: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function exportJSON(): Promise<void> {
  const db = await getDB();
  const data = {
    settings: await db.getAll("settings"),
    customers: await db.getAll("customers"),
    pools: await db.getAll("pools"),
    reports: await db.getAll("reports"),
    waterTests: await db.getAll("water_tests"),
    templates: await db.getAll("templates"),
    maintenanceTasks: await db.getAll("maintenance_tasks"),
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pooltechtools-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportZIP(): Promise<void> {
  const db = await getDB();
  const zip = new JSZip();
  const now = new Date().toISOString();
  const data = {
    settings: await db.getAll("settings"),
    customers: await db.getAll("customers"),
    pools: await db.getAll("pools"),
    reports: await db.getAll("reports"),
    waterTests: await db.getAll("water_tests"),
    templates: await db.getAll("templates"),
    maintenanceTasks: await db.getAll("maintenance_tasks"),
  };
  const dataJson = JSON.stringify(data, null, 2);
  zip.file("data.json", dataJson);

  // attachments
  const attachments = await db.getAll("attachments");
  const fileEntries: Array<{ path: string; sha256: string; sizeBytes: number }> = [];
  const dataHash = await sha256String(dataJson);
  fileEntries.push({ path: "data.json", sha256: dataHash, sizeBytes: dataJson.length });

  let totalSize = dataJson.length;
  for (const a of attachments) {
    const path = `attachments/${a.reportId}/${a.id}.jpg`;
    const buf = await a.blob.arrayBuffer();
    zip.file(path, buf);
    const h = await sha256Blob(a.blob);
    fileEntries.push({ path, sha256: h, sizeBytes: a.sizeBytes });
    totalSize += a.sizeBytes;
  }

  const manifest: BackupManifest = {
    format: "PoolTechBackupV1",
    schemaVersion: 1,
    appVersion: "5.0.0",
    createdAt: now,
    counts: {
      customers: data.customers.length,
      pools: data.pools.length,
      reports: data.reports.length,
      waterTests: data.waterTests.length,
      templates: data.templates.length,
      maintenanceTasks: data.maintenanceTasks.length,
      attachments: attachments.length,
    },
    totalSizeBytes: totalSize,
    files: fileEntries,
  };
  const manifestJson = JSON.stringify(manifest, null, 2);
  zip.file("manifest.json", manifestJson);

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pooltechtools-backup-${now.slice(0, 19).replace(/[:T]/g, "-")}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
