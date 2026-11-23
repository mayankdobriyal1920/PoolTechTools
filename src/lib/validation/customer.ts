import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).trim(),
  phone: z.string().regex(/^[0-9+\-() ]{0,30}$/).optional().or(z.literal("")),
  email: z.string().email().max(254).optional().or(z.literal("")),
  serviceAddress: z.string().max(500).optional(),
  notes: z.string().max(5000).optional(),
});

export const PoolSchema = z.object({
  id: z.string().uuid().optional(),
  customerId: z.string().uuid(),
  name: z.string().min(1).max(100).trim(),
  shape: z.enum(["rectangle", "square", "round", "oval", "kidney", "irregular"]),
  volumeGallons: z.number().finite().min(0).max(1000000),
  surfaceType: z.enum(["plaster", "pebble", "vinyl", "fiberglass", "tile", "other"]),
  sanitizerType: z.enum(["chlorine", "salt", "bromine", "biguanide", "other"]).optional(),
  equipmentNotes: z.string().max(5000).optional(),
});

export const ReportSchema = z.object({
  id: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  poolId: z.string().uuid().optional(),
  customerNameSnapshot: z.string().min(1).max(100),
  poolNameSnapshot: z.string().max(100).optional(),
  reportNumber: z.string().min(1).max(50),
  visitDate: z.string().datetime(),
  technician: z.string().min(1).max(100),
  tasks: z.array(z.string().max(200)).max(50),
  readings: z.record(z.string(), z.number().finite()),
  chemicals: z.array(z.object({ product: z.string().max(100), amount: z.number().finite(), unit: z.string().max(10) })).max(20),
  customerSummary: z.string().max(5000),
  privateNotes: z.string().max(5000),
  photoIds: z.array(z.string().uuid()).max(2),
});

export const WaterTestSchema = z.object({
  id: z.string().uuid().optional(),
  poolId: z.string().uuid().optional(),
  recordedAt: z.string().datetime(),
  readings: z.record(z.string(), z.number().finite()),
  notes: z.string().max(5000),
});

export const TemplateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).trim(),
  taskDefaults: z.array(z.string().max(200)).max(50),
  notesDefault: z.string().max(5000),
});

export const MaintenanceTaskSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.enum(["daily", "weekly", "monthly", "seasonal", "opening", "closing", "custom"]),
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(1000).optional(),
  completedAt: z.string().datetime().optional(),
  order: z.number().int().min(0),
  poolType: z.string().max(50).optional(),
  season: z.string().max(50).optional(),
});

export const FilePhotoSchema = z.object({
  file: z.any(),
  maxSizeBytes: z.number().default(10 * 1024 * 1024),
  allowedMimeTypes: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp", "image/heic"]),
});
