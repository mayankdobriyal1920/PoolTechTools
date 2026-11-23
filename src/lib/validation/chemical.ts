import { z } from "zod";

export const ChemicalInputSchema = z.object({
  poolVolume: z.number().finite().positive().max(1000000),
  productName: z.string().max(100).optional(),
  labelDoseAmount: z.number().finite().positive().max(1000000),
  labelDoseUnit: z.enum(["oz", "lbs", "g", "kg", "floz", "cups", "qt", "gal", "mL", "L"]),
  labelRefVolume: z.number().finite().positive().max(1000000),
  labelRefUnit: z.enum(["gal", "L"]),
  verified: z.boolean().refine((v) => v === true, "You must verify against the product label"),
});

export type ChemicalFormValues = z.infer<typeof ChemicalInputSchema>;

export const ChlorineInputSchema = z.object({
  freeChlorine: z.number().finite().min(0).max(10000),
  totalChlorine: z.number().finite().min(0).max(10000),
  poolVolume: z.number().finite().positive().max(1000000).optional(),
  labelDoseAmount: z.number().finite().positive().max(1000000).optional(),
  labelDoseUnit: z.enum(["oz", "lbs", "g", "kg", "floz", "cups", "qt", "gal", "mL", "L"]).optional(),
  labelRefVolume: z.number().finite().positive().max(1000000).optional(),
  labelRefUnit: z.enum(["gal", "L"]).optional(),
  targetFC: z.number().finite().min(0).max(10000).optional(),
  verified: z.boolean().optional(),
});

export type ChlorineFormValues = z.infer<typeof ChlorineInputSchema>;
