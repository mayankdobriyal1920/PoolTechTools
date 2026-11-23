import { describe, it, expect } from "vitest";
import { scaleDose, combinedChlorine } from "@/lib/calc/chemical";

describe("Chemical label-rate scaling", () => {
  it("10 oz per 10000 gal -> 15000 gal = 15 oz", () => {
    const r = scaleDose({ poolVolumeGal: 15000, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.amount).toBeCloseTo(15, 5);
  });
  it("1 lb per 10000 gal -> 25000 gal = 2.5 lb", () => {
    const r = scaleDose({ poolVolumeGal: 25000, labelDoseAmount: 1, labelDoseUnit: "lbs", labelRefVolume: 10000, labelRefUnit: "gal" });
    expect(r.amount).toBeCloseTo(2.5, 5);
  });
  it("throws on zero reference volume", () => {
    expect(() => scaleDose({ poolVolumeGal: 15000, labelDoseAmount: 10, labelDoseUnit: "oz", labelRefVolume: 0, labelRefUnit: "gal" })).toThrow();
  });
});

describe("Chlorine combined chlorine", () => {
  it("CC = TC - FC when TC >= FC", () => {
    expect(combinedChlorine(2, 3)).toEqual({ value: 1, invalid: false });
  });
  it("TC < FC -> invalid, preserve readings", () => {
    expect(combinedChlorine(3, 2.5)).toEqual({ value: null, invalid: true });
  });
  it("equal -> 0", () => {
    expect(combinedChlorine(1.5, 1.5)).toEqual({ value: 0, invalid: false });
  });
});
