"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { scaleDose, type Unit, type MassUnit, type FluidUnit, type VolumeUnit } from "@/lib/calc/chemical";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { AdSlot } from "@/components/AdSlot";
import { PageHeader } from "@/components/layout/PageHeader";

const MASS_UNITS: MassUnit[] = ["oz", "lbs", "g", "kg"];
const FLUID_UNITS: FluidUnit[] = ["floz", "cups", "qt", "gal", "mL", "L"];

export default function ChemicalClient() {
  const params = useSearchParams();
  const [volume, setVolume] = useState("");
  const [productName, setProductName] = useState("");
  const [doseAmount, setDoseAmount] = useState("");
  const [doseUnit, setDoseUnit] = useState<Unit>("oz");
  const [refVolume, setRefVolume] = useState("");
  const [refUnit, setRefUnit] = useState<VolumeUnit>("gal");
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof scaleDose> | null>(null);

  useEffect(() => {
    const v = params.get("vol");
    if (v) setVolume(v);
  }, [params]);

  const isMass = MASS_UNITS.includes(doseUnit as MassUnit);

  function handleCalculate() {
    const e: Record<string, string> = {};
    const v = parseFloat(volume);
    const da = parseFloat(doseAmount);
    const rv = parseFloat(refVolume);
    if (!volume.trim() || isNaN(v) || v <= 0) e.volume = "Pool volume must be positive";
    if (!doseAmount.trim() || isNaN(da) || da <= 0) e.doseAmount = "Dose amount must be positive";
    if (!refVolume.trim() || isNaN(rv) || rv <= 0) e.refVolume = "Reference volume must be positive";
    if (!verified) e.verified = "You must verify against the product label";
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const r = scaleDose({
        poolVolumeGal: v,
        labelDoseAmount: da,
        labelDoseUnit: doseUnit,
        labelRefVolume: rv,
        labelRefUnit: refUnit,
      });
      setResult(r);
    } catch (err: any) {
      setErrors({ _form: err.message });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Chemical Calculator</h1>
        <p className="mt-2 text-brand-800">Label-rate scaling — mathematically scale a product label dose to your pool.</p>
      </div>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Pool volume (gal)" value={volume} onChange={(e) => setVolume(e.target.value)} error={errors.volume} />
          <Input label="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Label dose amount" value={doseAmount} onChange={(e) => setDoseAmount(e.target.value)} error={errors.doseAmount} />
          <Select label="Dose unit" value={doseUnit} onChange={(e) => setDoseUnit(e.target.value as Unit)}
            options={[...MASS_UNITS, ...FLUID_UNITS].map((u) => ({ value: u, label: u }))} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Label reference volume" value={refVolume} onChange={(e) => setRefVolume(e.target.value)} error={errors.refVolume} hint="e.g. 10000 for 'per 10,000 gal'" />
          <Select label="Reference unit" value={refUnit} onChange={(e) => setRefUnit(e.target.value as VolumeUnit)}
            options={[{ value: "gal", label: "gal" }, { value: "L", label: "L" }]} />
        </div>

        <div className="mt-4">
          <Checkbox label="I have verified this calculation against the physical product label." checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          {errors.verified && <p className="mt-1 text-xs text-red-600">{errors.verified}</p>}
        </div>

        {errors._form && <p className="mt-3 text-sm text-red-600">{errors._form}</p>}

        <div className="mt-6">
          <Button onClick={handleCalculate}>Calculate Dose</Button>
        </div>
      </Card>

      <div className="mt-6"><AdSlot slot="9214687527" /></div>

      {result && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-800">Result</h2>
            <Badge tone="info">{isMass ? "mass" : "fluid"}</Badge>
          </div>
          <div className="mt-4">
            <div className="text-sm text-brand-800">Required dose</div>
            <div className="text-3xl font-extrabold text-brand-700">{result.amount.toFixed(4)} {result.unit}</div>
          </div>
          <div className="mt-3 text-xs font-mono text-brand-800">{result.formula}</div>
          {result.equivalents.length > 0 && (
            <div className="mt-3 text-sm text-brand-800">
              <span className="font-semibold">Equivalents:</span> {result.equivalents.join(" · ")}
            </div>
          )}
          {result.warnings.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-amber-700">
              {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          )}
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50/70 p-3 text-xs text-amber-800">
            ⚠ This tool mathematically scales a dosage you entered from a product label. It is not a chemical treatment recommendation. Always verify against the physical product label and consult a pool professional.
          </div>
        </Card>
      )}
    </div>
  );
}
