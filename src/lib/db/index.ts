// src/lib/db/index.ts
// IndexedDB setup using idb (PoolTechTools v5.0 Sections 9-10)

import { openDB, type IDBPDatabase } from "idb";
import type { Customer, Pool, Report, Attachment, WaterTest, Template, MaintenanceTask, ReportDraft, Snapshot, MigrationRecord } from "./types";

const DB_NAME = "pooltechtools_db";
const DB_VERSION = 1;

export type PTTDBSchema = {
  settings: { key: string; value: { id: string; value: unknown; updatedAt: string } };
  customers: { key: string; value: Customer; indexes: { "by-name": string; "by-updatedAt": string } };
  pools: { key: string; value: Pool; indexes: { "by-customerId": string; "by-name": string } };
  reports: { key: string; value: Report; indexes: { "by-customerId": string; "by-poolId": string; "by-visitDate": string; "by-reportNumber": string } };
  report_drafts: { key: string; value: ReportDraft; indexes: { "by-lastSavedAt": string } };
  attachments: { key: string; value: Attachment; indexes: { "by-reportId": string } };
  water_tests: { key: string; value: WaterTest; indexes: { "by-poolId": string; "by-recordedAt": string } };
  templates: { key: string; value: Template; indexes: { "by-name": string } };
  maintenance_tasks: { key: string; value: MaintenanceTask; indexes: { "by-category": string; "by-poolType": string } };
  snapshots: { key: number; value: Snapshot; indexes: { "by-createdAt": string } };
  migrations: { key: number; value: MigrationRecord };
};
export type PTTDatabase = IDBPDatabase<PTTDBSchema>;

let dbPromise: Promise<PTTDatabase> | null = null;

export function getDB(): Promise<PTTDatabase> {
  if (!dbPromise) {
    dbPromise = openDB<PTTDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // settings
        if (!(db.objectStoreNames as any).contains("settings")) db.createObjectStore("settings", { keyPath: "id" });
        // customers
        if (!(db.objectStoreNames as any).contains("customers")) {
          const s = db.createObjectStore("customers", { keyPath: "id" });
          s.createIndex("by-name", "name");
          s.createIndex("by-updatedAt", "updatedAt");
        }
        // pools
        if (!(db.objectStoreNames as any).contains("pools")) {
          const s = db.createObjectStore("pools", { keyPath: "id" });
          s.createIndex("by-customerId", "customerId");
          s.createIndex("by-name", "name");
        }
        // reports
        if (!(db.objectStoreNames as any).contains("reports")) {
          const s = db.createObjectStore("reports", { keyPath: "id" });
          s.createIndex("by-customerId", "customerId");
          s.createIndex("by-poolId", "poolId");
          s.createIndex("by-visitDate", "visitDate");
          s.createIndex("by-reportNumber", "reportNumber");
        }
        // report_drafts
        if (!(db.objectStoreNames as any).contains("report_drafts")) {
          const s = db.createObjectStore("report_drafts", { keyPath: "id" });
          s.createIndex("by-lastSavedAt", "lastSavedAt");
        }
        // attachments
        if (!(db.objectStoreNames as any).contains("attachments")) {
          const s = db.createObjectStore("attachments", { keyPath: "id" });
          s.createIndex("by-reportId", "reportId");
        }
        // water_tests
        if (!(db.objectStoreNames as any).contains("water_tests")) {
          const s = db.createObjectStore("water_tests", { keyPath: "id" });
          s.createIndex("by-poolId", "poolId");
          s.createIndex("by-recordedAt", "recordedAt");
        }
        // templates
        if (!(db.objectStoreNames as any).contains("templates")) {
          const s = db.createObjectStore("templates", { keyPath: "id" });
          s.createIndex("by-name", "name");
        }
        // maintenance_tasks
        if (!(db.objectStoreNames as any).contains("maintenance_tasks")) {
          const s = db.createObjectStore("maintenance_tasks", { keyPath: "id" });
          s.createIndex("by-category", "category");
          s.createIndex("by-poolType", "poolType");
        }
        // snapshots
        if (!(db.objectStoreNames as any).contains("snapshots")) {
          const s = db.createObjectStore("snapshots", { keyPath: "id", autoIncrement: true });
          s.createIndex("by-createdAt", "createdAt");
        }
        // migrations
        if (!(db.objectStoreNames as any).contains("migrations")) {
          db.createObjectStore("migrations", { keyPath: "version" });
        }
      },
    });
  }
  return dbPromise as Promise<PTTDatabase>;
}

export async function resetDB() {
  // close and delete
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}
