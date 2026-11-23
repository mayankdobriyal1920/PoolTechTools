// Unit conversion utilities (PoolTechTools v5.0 Section 7.4 / 8.1)

export type LengthUnit = "ft" | "in" | "m" | "cm";
export type MassUnit = "oz" | "lbs" | "g" | "kg";
export type FluidUnit = "floz" | "cups" | "qt" | "gal" | "mL" | "L";
export type PoolVolumeUnit = "gal" | "L";

export const FT_PER: Record<LengthUnit, number> = { ft: 1, in: 1 / 12, m: 3.280839895, cm: 0.032808399 };
export function toFeet(value: number, unit: LengthUnit): number { return value * FT_PER[unit]; }
export function fromFeet(feet: number, unit: LengthUnit): number { return feet / FT_PER[unit]; }

export const GAL_PER: Record<PoolVolumeUnit, number> = { gal: 1, L: 1 / 3.78541 };
export function toGallons(value: number, unit: PoolVolumeUnit): number { return value * (unit === "L" ? 1 / 3.78541 : 1); }
export function fromGallons(gal: number, unit: PoolVolumeUnit): number { return unit === "L" ? gal * 3.78541 : gal; }

export const MASS_FACTORS: Record<MassUnit, number> = { oz: 1, lbs: 16, g: 1 / 28.3495, kg: 1000 / 28.3495 };
export function convertMass(value: number, from: MassUnit, to: MassUnit): number {
  return value * (MASS_FACTORS[from] / MASS_FACTORS[to]);
}

export const FLUID_FACTORS: Record<FluidUnit, number> = {
  floz: 1, cups: 8, qt: 32, gal: 128, mL: 1 / 29.5735, L: 1000 / 29.5735,
};
export function convertFluid(value: number, from: FluidUnit, to: FluidUnit): number {
  return value * (FLUID_FACTORS[from] / FLUID_FACTORS[to]);
}

export function formatNumber(n: number, decimals = 4): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}
