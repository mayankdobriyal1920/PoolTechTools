import { describe, it, expect } from "vitest";
import { calculateVolume, displayGallons } from "@/lib/calc/volume";

describe("Pool volume calculator", () => {
  it("rectangular: 20x10, 3-5ft deep", () => {
    const r = calculateVolume({ shape: "rectangle", lengthFt: 20, widthFt: 10, shallowDepthFt: 3, deepDepthFt: 5 });
    expect(r.gallons).toBeCloseTo(5984.416, 2);
  });
  it("round: 12ft diameter, 4ft deep", () => {
    const r = calculateVolume({ shape: "round", diameterFt: 12, shallowDepthFt: 4, deepDepthFt: 4 });
    expect(r.gallons).toBeCloseTo(3384.11, 1);
  });
  it("oval: 20x10, 4ft deep", () => {
    const r = calculateVolume({ shape: "oval", lengthFt: 20, widthFt: 10, shallowDepthFt: 4, deepDepthFt: 4 });
    expect(r.gallons).toBeCloseTo(4700.0, 0);
  });
  it("square: 15x15, 4ft deep", () => {
    const r = calculateVolume({ shape: "square", sideFt: 15, shallowDepthFt: 4, deepDepthFt: 4 });
    expect(r.gallons).toBeCloseTo(6732.468, 2);
  });
  it("irregular: 200 sqft, 4ft deep", () => {
    const r = calculateVolume({ shape: "irregular", estimatedSurfaceAreaSqFt: 200, shallowDepthFt: 4, deepDepthFt: 4 });
    expect(r.gallons).toBeCloseTo(5984.416, 2);
  });
  it("average depth override takes precedence", () => {
    const r = calculateVolume({ shape: "rectangle", lengthFt: 10, widthFt: 10, shallowDepthFt: 1, deepDepthFt: 9, averageDepthOverrideFt: 5 });
    expect(r.gallons).toBeCloseTo(10 * 10 * 5 * 7.48052, 2);
  });
  it("kidney trapezoidal", () => {
    const r = calculateVolume({
      shape: "kidney", lengthFt: 20, shallowDepthFt: 4, deepDepthFt: 4,
      kidneyCrossSections: [
        { positionFt: 0, widthFt: 8 },
        { positionFt: 5, widthFt: 9 },
        { positionFt: 10, widthFt: 10 },
        { positionFt: 15, widthFt: 9 },
        { positionFt: 20, widthFt: 8 },
      ],
    });
    expect(r.gallons).toBeCloseTo(5385.97, 0);
  });
  it("kidney rejects <3 cross-sections", () => {
    expect(() => calculateVolume({
      shape: "kidney", lengthFt: 20, shallowDepthFt: 4, deepDepthFt: 4,
      kidneyCrossSections: [{ positionFt: 0, widthFt: 8 }, { positionFt: 20, widthFt: 8 }],
    })).toThrow();
  });
  it("displayGallons rounds to nearest 10 for >=100", () => {
    expect(displayGallons(5984.416)).toBe("5,980 gal");
  });
});
