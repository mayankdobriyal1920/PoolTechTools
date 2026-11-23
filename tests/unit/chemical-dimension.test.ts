import { describe, it, expect } from "vitest";
import { scaleDose } from "@/lib/calc/chemical";

describe("Chemical dimension enforcement", () => {
  it("mass unit (oz) scales correctly in mass dimension", () => {
    const r = scaleDose({ poolVolumeGal: 20000, labelDoseAmount: 16, labelDoseUnit: "oz", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.amount).toBeCloseTo(32, 5);
    expect(r.unit).toBe("oz");
  });
  it("fluid unit (floz) scales correctly in fluid dimension", () => {
    const r = scaleDose({ poolVolumeGal: 20000, labelDoseAmount: 8, labelDoseUnit: "floz", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.amount).toBeCloseTo(16, 5);
  });
  it("reference volume in liters converts to gallons", () => {
    const r = scaleDose({ poolVolumeGal: 3785.41, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 1000, labelRefUnit: "L" });
    // 1000 L = 264.17 gal; 3785.41/264.17 ≈ 14.33
    expect(r.amount).toBeGreaterThan(10);
  });
  it("large dose produces warning", () => {
    const r = scaleDose({ poolVolumeGal: 1100000, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("small dose produces warning", () => {
    const r = scaleDose({ poolVolumeGal: 5, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("throws on zero pool volume", () => {
    expect(() => scaleDose({ poolVolumeGal: 0, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 10000, labelRefUnit: "gal" })).toThrow();
  });
  it("equivalents provided for mass units", () => {
    const r = scaleDose({ poolVolumeGal: 15000, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.equivalents.length).toBeGreaterThan(0);
  });
});
