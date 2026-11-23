// src/lib/db/types.ts
// IndexedDB entity interfaces (PoolTechTools v5.0 Section 11.2)

export interface Customer {
  id: string; // UUID v4
  name: string;
  phone?: string;
  email?: string;
  serviceAddress?: string;
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  deletedAt?: string;
  version: number;
}

export interface Pool {
  id: string;
  customerId: string;
  name: string;
  shape: 'rectangle' | 'square' | 'round' | 'oval' | 'kidney' | 'irregular';
  volumeGallons: number;
  surfaceType: 'plaster' | 'pebble' | 'vinyl' | 'fiberglass' | 'tile' | 'other';
  sanitizerType?: 'chlorine' | 'salt' | 'bromine' | 'biguanide' | 'other';
  equipmentNotes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

export interface Report {
  id: string;
  customerId?: string;
  poolId?: string;
  customerNameSnapshot: string;
  poolNameSnapshot?: string;
  reportNumber: string;
  visitDate: string;
  technician: string;
  tasks: string[];
  readings: Record<string, number>;
  chemicals: Array<{ product: string; amount: number; unit: string }>;
  customerSummary: string;
  privateNotes: string;
  photoIds: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

// Customer-facing view used by PDF/SMS/share — MUST NOT include privateNotes.
export type PublicReportView = Omit<Report, 'privateNotes'>;

export interface Attachment {
  id: string;
  reportId: string;
  blob: Blob;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface WaterTest {
  id: string;
  poolId?: string;
  recordedAt: string;
  readings: Record<string, number>;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

export interface Template {
  id: string;
  name: string;
  taskDefaults: string[];
  notesDefault: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MaintenanceTask {
  id: string;
  category: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'opening' | 'closing' | 'custom';
  title: string;
  description?: string;
  completedAt?: string;
  order: number;
  poolType?: string;
  season?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ReportDraft {
  id: string;
  payload: Partial<Report>;
  lastSavedAt: string;
  expiresAt: string;
}

export interface Snapshot {
  id?: number;
  createdAt: string;
  reason: 'startup' | 'milestone' | 'pre-import' | 'pre-migration' | 'interval';
  compressedPayload: string;
  sizeBytes: number;
  schemaVersion: number;
}

export interface MigrationRecord {
  version: number;
  appliedAt: string;
  description: string;
}
