// src/lib/calc/chemical.ts
// Label-rate scaling + dimension enforcement (PoolTechTools v5.0 Section 8)

export type Dimension = "mass" | "fluidVolume" | "poolVolume" | "dimensionless";

export type MassUnit = "oz" | "lbs" | "g" | "kg";
export type FluidUnit = "floz" | "cups" | "qt" | "gal" | "mL" | "L";
export type VolumeUnit = "gal" | "L";
export type Unit = MassUnit | FluidUnit | VolumeUnit;

export const UNIT_DIMENSION: Record<Unit, Dimension> = {
  oz: "mass", lbs: "mass", g: "mass", kg: "mass",
  floz: "fluidVolume", cups: "fluidVolume", qt: "fluidVolume", gal: "fluidVolume", mL: "fluidVolume", L: "fluidVolume",
};

export function isMass(u: Unit): u is MassUnit { return UNIT_DIMENSION[u] === "mass"; }
export function isFluid(u: Unit): u is FluidUnit { return UNIT_DIMENSION[u] === "fluidVolume"; }

export interface ChemicalInput {
  poolVolumeGal: number;
  labelDoseAmount: number;
  labelDoseUnit: Unit;
  labelRefVolume: number;
  labelRefUnit: VolumeUnit; // gal or L (pool volume)
  productDensity?: number; // mass per fluid volume, for cross-dim conversion
}

export interface ChemicalResult {
  amount: number;
  unit: Unit;
  formula: string;
  equivalents: string[];
  warnings: string[];
}

const MASS_TO: Record<MassUnit, number> = { oz: 1, lbs: 16, g: 1 / 28.3495, kg: 1000 / 28.3495 };
const FLUID_TO: Record<FluidUnit, number> = { floz: 1, cups: 8, qt: 32, gal: 128, mL: 1 / 29.5735, L: 1000 / 29.5735 };

export function scaleDose(input: ChemicalInput): ChemicalResult {
  const warnings: string[] = [];
  const { poolVolumeGal, labelDoseAmount, labelDoseUnit, labelRefVolume, labelRefUnit } = input;

  // normalize ref volume to gallons
  const refGal = labelRefUnit === "L" ? labelRefVolume / 3.78541 : labelRefVolume;
  if (refGal <= 0) throw new Error("Reference volume must be greater than zero");
  if (poolVolumeGal <= 0) throw new Error("Pool volume must be greater than zero");

  const scaled = labelDoseAmount * (poolVolumeGal / refGal);

  const equivalents: string[] = [];
  // same-dimension equivalents
  if (isMass(labelDoseUnit)) {
    const baseOz = scaled * MASS_TO[labelDoseUnit as MassUnit];
    for (const u of ["oz", "lbs", "g", "kg"] as MassUnit[]) {
      if (u !== labelDoseUnit) {
        const v = baseOz / MASS_TO[u];
        if (v >= 0.001) equivalents.push(`${v.toFixed(3)} ${u}`);
      }
    }
  } else {
    const baseFloz = scaled * FLUID_TO[labelDoseUnit as FluidUnit];
    for (const u of ["floz", "cups", "qt", "gal"] as FluidUnit[]) {
      if (u !== labelDoseUnit) {
        const v = baseFloz / FLUID_TO[u];
        if (v >= 0.001) equivalents.push(`${v.toFixed(3)} ${u}`);
      }
    }
  }

  if (scaled > 1000) warnings.push("Large dose — double-check label and pool volume.");
  if (scaled < 0.01) warnings.push("Very small dose — verify measurements.");

  return {
    amount: scaled,
    unit: labelDoseUnit,
    formula: `Dose = ${labelDoseAmount} ${labelDoseUnit} × (${poolVolumeGal.toFixed(0)} gal / ${refGal.toFixed(0)} gal) = ${scaled.toFixed(4)} ${labelDoseUnit}`,
    equivalents: equivalents.slice(0, 4),
    warnings,
  };
}

export function combinedChlorine(fc: number, tc: number): { value: number | null; invalid: boolean } {
  if (tc < fc) return { value: null, invalid: true };
  return { value: tc - fc, invalid: false };
}
