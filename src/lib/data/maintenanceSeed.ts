import type { MaintenanceTask } from "@/lib/db/types";

export const SEED_TASKS: Omit<MaintenanceTask, "id" | "createdAt" | "updatedAt" | "version">[] = [
  { category: "daily", title: "Skim surface debris", order: 1 },
  { category: "daily", title: "Empty skimmer baskets", order: 2 },
  { category: "daily", title: "Check water level", order: 3 },
  { category: "weekly", title: "Test water chemistry (FC, pH, TA)", order: 1 },
  { category: "weekly", title: "Brush walls and floor", order: 2 },
  { category: "weekly", title: "Vacuum pool", order: 3 },
  { category: "weekly", title: "Clean pump basket", order: 4 },
  { category: "weekly", title: "Backwash filter (if needed)", order: 5 },
  { category: "monthly", title: "Inspect equipment (pump, filter, heater)", order: 1 },
  { category: "monthly", title: "Clean tile line", order: 2 },
  { category: "monthly", title: "Check salt cell (if salt pool)", order: 3 },
  { category: "seasonal", title: "Opening: remove cover, clean, balance water", order: 1 },
  { category: "seasonal", title: "Closing: winterize, lower water, cover", order: 2 },
];
