"use client";

import { useState } from "react";
import { combinedChlorine } from "@/lib/calc/chemical";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdSlot } from "@/components/AdSlot";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ChlorineClient() {
  const [fc, setFc] = useState("");
  const [tc, setTc] = useState("");
  const [targetFc, setTargetFc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fcN = parseFloat(fc);
  const tcN = parseFloat(tc);
  const hasReadings = !isNaN(fcN) && !isNaN(tcN) && fc.trim() && tc.trim();
  const cc = hasReadings ? combinedChlorine(fcN, tcN) : null;

  function validate() {
    const e: Record<string, string> = {};
    if (!fc.trim() || isNaN(fcN) || fcN < 0) e.fc = "Free chlorine must be ≥ 0";
    if (!tc.trim() || isNaN(tcN) || tcN < 0) e.tc = "Total chlorine must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Chlorine Calculator</h1>
        <p className="mt-2 text-brand-800">Combined chlorine from free &amp; total chlorine readings.</p>
      </div>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Free Chlorine (ppm)" value={fc} onChange={(e) => setFc(e.target.value)} error={errors.fc} />
          <Input label="Total Chlorine (ppm)" value={tc} onChange={(e) => setTc(e.target.value)} error={errors.tc} />
        </div>
        <div className="mt-4">
          <Input label="Target Free Chlorine (ppm, optional)" value={targetFc} onChange={(e) => setTargetFc(e.target.value)} hint="Informational only — not a treatment recommendation." />
        </div>
        <div className="mt-6">
          <Button onClick={validate}>Evaluate</Button>
        </div>
      </Card>

      {cc && (
        <Card className="mt-6">
          <h2 className="text-xl font-bold text-brand-800">Readings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-brand-800">Free Chlorine</div>
              <div className="text-2xl font-extrabold text-brand-700">{fcN.toFixed(2)} ppm</div>
            </div>
            <div>
              <div className="text-sm text-brand-800">Total Chlorine</div>
              <div className="text-2xl font-extrabold text-brand-700">{tcN.toFixed(2)} ppm</div>
            </div>
            <div>
              <div className="text-sm text-brand-800">Combined Chlorine</div>
              {cc.invalid ? (
                <div className="text-2xl font-extrabold text-red-600">—</div>
              ) : (
                <div className="text-2xl font-extrabold text-brand-700">{cc.value!.toFixed(2)} ppm</div>
              )}
            </div>
          </div>
          {cc.invalid && (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-50/70 p-3 text-sm text-red-700">
              <Badge tone="error">Test variance</Badge>
              <p className="mt-2">Total chlorine is less than free chlorine. Original readings preserved. Repeat the test — do not use this result for dosing.</p>
            </div>
          )}
          {targetFc.trim() && !isNaN(parseFloat(targetFc)) && (
            <div className="mt-4 text-sm text-brand-800">
              Target FC: {parseFloat(targetFc).toFixed(2)} ppm — current is{" "}
              {fcN < parseFloat(targetFc) ? "below" : fcN > parseFloat(targetFc) ? "above" : "at"} target (informational only).
            </div>
          )}
          <p className="mt-4 text-xs text-brand-700">
            Chlorine calculations do not replace product labels or professional water testing. Follow product labels and consult a pool professional.
          </p>
        </Card>
      )}
      <AdSlot slot="tool-result-banner" className="mt-6" />
    </div>
  );
}
