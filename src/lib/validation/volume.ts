import { z } from "zod";

export const VolumeInputSchema = z.object({
  shape: z.enum(["rectangle", "square", "round", "oval", "kidney", "irregular"]),
  units: z.enum(["imperial", "metric"]),
  length: z.number().finite().positive().max(500).optional(),
  width: z.number().finite().positive().max(500).optional(),
  side: z.number().finite().positive().max(500).optional(),
  diameter: z.number().finite().positive().max(500).optional(),
  shallowDepth: z.number().finite().positive().max(30).optional(),
  deepDepth: z.number().finite().positive().max(30).optional(),
  averageDepthOverride: z.number().finite().positive().max(30).optional(),
  estimatedSurfaceArea: z.number().finite().positive().max(100000).optional(),
}).superRefine((d, ctx) => {
  const add = (path: string, msg: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: msg });
  if (d.shape === "rectangle") {
    if (d.length == null) add("length", "Length is required");
    if (d.width == null) add("width", "Width is required");
    if (d.averageDepthOverride == null && (d.shallowDepth == null || d.deepDepth == null)) {
      add("shallowDepth", "Shallow and deep depth (or average depth override) required");
    }
  }
  if (d.shape === "square") {
    if (d.side == null) add("side", "Side length is required");
    if (d.averageDepthOverride == null && (d.shallowDepth == null || d.deepDepth == null)) {
      add("shallowDepth", "Depth required");
    }
  }
  if (d.shape === "round") {
    if (d.diameter == null) add("diameter", "Diameter is required");
    if (d.averageDepthOverride == null && (d.shallowDepth == null || d.deepDepth == null)) {
      add("shallowDepth", "Depth required");
    }
  }
  if (d.shape === "oval") {
    if (d.length == null) add("length", "Length is required");
    if (d.width == null) add("width", "Width is required");
    if (d.averageDepthOverride == null && (d.shallowDepth == null || d.deepDepth == null)) {
      add("shallowDepth", "Depth required");
    }
  }
  if (d.shape === "irregular") {
    if (d.estimatedSurfaceArea == null) add("estimatedSurfaceArea", "Estimated surface area required");
    if (d.averageDepthOverride == null && (d.shallowDepth == null || d.deepDepth == null)) {
      add("shallowDepth", "Depth required");
    }
  }
});

export type VolumeFormValues = z.infer<typeof VolumeInputSchema>;
