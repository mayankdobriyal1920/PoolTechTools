"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateVolume, displayGallons, type PoolShape } from "@/lib/calc/volume";
import { toFeet } from "@/lib/utils/units";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

type Units = "imperial" | "metric";

export default function PoolVolumePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [shape, setShape] = useState<PoolShape>("rectangle");
  const [units, setUnits] = useState<Units>("imperial");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [side, setSide] = useState("");
  const [diameter, setDiameter] = useState("");
  const [shallow, setShallow] = useState("");
  const [deep, setDeep] = useState("");
  const [avgOverride, setAvgOverride] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof calculateVolume> | null>(null);

  const u = units === "imperial" ? "ft" : "m";
  const dU = units === "imperial" ? "ft" : "m";

  function parseNum(s: string): number | undefined {
    const n = parseFloat(s);
    return isNaN(n) ? undefined : n;
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    const req = (key: string, val: string, label: string) => {
      if (!val.trim()) e[key] = `${label} is required`;
      else if (isNaN(parseFloat(val)) || parseFloat(val) <= 0) e[key] = `${label} must be a positive number`;
    };
    if (shape === "rectangle") { req("length", length, "Length"); req("width", width, "Width"); }
    if (shape === "square") { req("side", side, "Side"); }
    if (shape === "round") { req("diameter", diameter, "Diameter"); }
    if (shape === "oval") { req("length", length, "Length"); req("width", width, "Width"); }
    if (shape === "irregular") { req("surfaceArea", surfaceArea, "Surface area"); }
    if (!avgOverride.trim() && (!shallow.trim() || !deep.trim())) {
      if (!shallow.trim()) e.shallow = "Shallow depth required (or average depth override)";
      if (!deep.trim() && !shallow.trim()) e.deep = "Deep depth required";
    }
    if (avgOverride.trim() && (isNaN(parseFloat(avgOverride)) || parseFloat(avgOverride) <= 0)) {
      e.avgOverride = "Average depth must be positive";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCalculate() {
    if (!validate()) return;
    const L = (v: string) => (v.trim() ? toFeet(parseFloat(v), units === "imperial" ? "ft" : "m") : undefined);
    const input = {
      shape,
      lengthFt: (shape === "rectangle" || shape === "oval") ? L(length) : undefined,
      widthFt: (shape === "rectangle" || shape === "oval") ? L(width) : undefined,
      sideFt: shape === "square" ? L(side) : undefined,
      diameterFt: shape === "round" ? L(diameter) : undefined,
      shallowDepthFt: shallow.trim() ? L(shallow) : undefined,
      deepDepthFt: deep.trim() ? L(deep) : undefined,
      averageDepthOverrideFt: avgOverride.trim() ? L(avgOverride) : undefined,
      estimatedSurfaceAreaSqFt: shape === "irregular" && surfaceArea.trim() ? parseFloat(surfaceArea) * (units === "metric" ? 10.7639 : 1) : undefined,
    };
    try {
      const r = calculateVolume(input as any);
      setResult(r);
    } catch (err: any) {
      setErrors({ _form: err.message || "Calculation failed" });
    }
  }

  function handleUseInChemical() {
    if (!result) return;
    router.push(`/tools/chemical-calculator?vol=${result.gallons}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/" }, { label: "Pool Volume Calculator" }]} />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Pool Volume Calculator</h1>
        <p className="mt-2 text-brand-800">Estimate U.S. gallons for any pool shape.</p>
      </div>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Pool shape"
            value={shape}
            onChange={(e) => setShape(e.target.value as PoolShape)}
            options={[
              { value: "rectangle", label: "Rectangle" },
              { value: "square", label: "Square" },
              { value: "round", label: "Round" },
              { value: "oval", label: "Oval" },
              { value: "kidney", label: "Kidney" },
              { value: "irregular", label: "Irregular / Custom" },
            ]}
          />
          <Select
            label="Units"
            value={units}
            onChange={(e) => setUnits(e.target.value as Units)}
            options={[
              { value: "imperial", label: "Feet / Inches" },
              { value: "metric", label: "Meters / CM" },
            ]}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(shape === "rectangle" || shape === "oval") && (
            <>
              <Input label={`Length (${u})`} value={length} onChange={(e) => setLength(e.target.value)} error={errors.length} />
              <Input label={`Width (${u})`} value={width} onChange={(e) => setWidth(e.target.value)} error={errors.width} />
            </>
          )}
          {shape === "square" && (
            <Input label={`Side (${u})`} value={side} onChange={(e) => setSide(e.target.value)} error={errors.side} />
          )}
          {shape === "round" && (
            <Input label={`Diameter (${u})`} value={diameter} onChange={(e) => setDiameter(e.target.value)} error={errors.diameter} />
          )}
          {shape === "irregular" && (
            <Input label={`Estimated surface area (${units === "imperial" ? "sq ft" : "sq m"})`} value={surfaceArea} onChange={(e) => setSurfaceArea(e.target.value)} error={errors.surfaceArea} />
          )}
          <Input label={`Shallow depth (${dU})`} value={shallow} onChange={(e) => setShallow(e.target.value)} error={errors.shallow} />
          <Input label={`Deep depth (${dU})`} value={deep} onChange={(e) => setDeep(e.target.value)} error={errors.deep} />
          <Input label={`Average depth override (${dU})`} value={avgOverride} onChange={(e) => setAvgOverride(e.target.value)} error={errors.avgOverride} hint="If provided, overrides shallow/deep average." />
        </div>

        {errors._form && <p className="mt-3 text-sm text-red-600">{errors._form}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={handleCalculate}>Calculate Volume</Button>
          {result && <Button variant="ghost" onClick={handleUseInChemical}>Use Volume in Chemical Calculator</Button>}
        </div>
      </Card>

      {result && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-800">Result</h2>
            <Badge tone="info">{shape}</Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-brand-800">U.S. Gallons</div>
              <div className="text-3xl font-extrabold text-brand-700">{displayGallons(result.gallons)}</div>
              <div className="text-xs text-brand-700">exact: {result.gallons.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-brand-800">Liters</div>
              <div className="text-3xl font-extrabold text-brand-700">{Math.round(result.liters).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-brand-800">Cubic Feet</div>
              <div className="text-3xl font-extrabold text-brand-700">{result.cubicFeet.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-brand-50/60 p-3 text-xs text-brand-800">
            <div className="font-semibold">Formula</div>
            <div className="mt-1 font-mono">{result.formula}</div>
            {result.warnings.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-amber-700">
                {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </div>
          <p className="mt-4 text-xs text-brand-700">
            Pool volume results are mathematical calculations based on the dimensions you entered. Real-world water capacity depends on construction tolerances, floor contours, steps, benches, and water level. For chemical dosing, verify against the pool&apos;s actual fill line and product label.
          </p>
        </Card>
      )}
      <AdSlot slot="tool-result-banner" className="mt-6" />
    </div>
  );
}
