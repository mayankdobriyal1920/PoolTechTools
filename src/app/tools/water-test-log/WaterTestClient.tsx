"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import type { WaterTest } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const FIELDS = ["freeChlorine", "totalChlorine", "ph", "totalAlkalinity", "calciumHardness", "cya", "salt", "temperature"] as const;

const RANGE_THRESHOLDS: Record<string, { low: number; high: number }> = {
  freeChlorine: { low: 1, high: 3 },
  totalChlorine: { low: 1, high: 3 },
  ph: { low: 7.2, high: 7.8 },
  totalAlkalinity: { low: 80, high: 120 },
  calciumHardness: { low: 200, high: 400 },
  cya: { low: 30, high: 50 },
  salt: { low: 2700, high: 3400 },
  temperature: { low: 70, high: 85 },
};

function badgeTone(key: string, val: number): "info" | "success" | "warning" | "error" {
  const t = RANGE_THRESHOLDS[key];
  if (!t) return "info";
  if (val < t.low || val > t.high) return "warning";
  return "success";
}

export default function WaterTestClient() {
  const [tests, setTests] = useState<WaterTest[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const db = await getDB();
    const all = await db.getAll("water_tests");
    setTests(all.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)));
  }
  useEffect(() => { load(); }, []);

  const fc = parseFloat(form.freeChlorine || "0");
  const tc = parseFloat(form.totalChlorine || "0");
  const cc = !isNaN(fc) && !isNaN(tc) ? (tc >= fc ? (tc - fc).toFixed(2) : "variance") : "—";

  async function save() {
    const db = await getDB();
    const now = new Date().toISOString();
    const readings: Record<string, number> = {};
    for (const f of FIELDS) {
      if (form[f]?.trim()) readings[f] = parseFloat(form[f]);
    }
    if (form.freeChlorine && form.totalChlorine) readings.combinedChlorine = tc >= fc ? tc - fc : NaN;
    const t: WaterTest = {
      id: editingId ?? crypto.randomUUID(),
      poolId: form.poolId || undefined,
      recordedAt: form.recordedAt || now,
      readings,
      notes: form.notes || "",
      createdAt: editingId ? (tests.find((x) => x.id === editingId)?.createdAt ?? now) : now,
      updatedAt: now,
      version: (tests.find((x) => x.id === editingId)?.version ?? 0) + 1,
    };
    await db.put("water_tests", t);
    setForm({});
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    const db = await getDB();
    await db.delete("water_tests", id);
    load();
  }

  function edit(t: WaterTest) {
    const f: Record<string, string> = { recordedAt: t.recordedAt, notes: t.notes };
    for (const k of FIELDS) if (t.readings[k] != null) f[k] = String(t.readings[k]);
    setForm(f);
    setEditingId(t.id);
  }

  function exportCSV() {
    const header = ["recordedAt", ...FIELDS, "combinedChlorine", "notes"].join(",");
    const rows = tests.map((t) => [t.recordedAt, ...FIELDS.map((f) => t.readings[f] ?? ""), t.readings.combinedChlorine ?? "", `"${(t.notes || "").replace(/"/g, '""')}"`].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "water-tests.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-brand-800">Water Test Log</h1>
          <p className="mt-1 text-brand-800">Record and track water chemistry readings.</p>
        </div>
        <Button variant="ghost" onClick={exportCSV}>Export CSV</Button>
      </div>

      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Input label="Date/Time" type="datetime-local" value={form.recordedAt || ""} onChange={(e) => setForm({ ...form, recordedAt: e.target.value })} />
          <Input label="Pool ID (optional)" value={form.poolId || ""} onChange={(e) => setForm({ ...form, poolId: e.target.value })} />
          {FIELDS.map((f) => (
            <Input key={f} label={f.replace(/([A-Z])/g, " $1").trim()} type="number" step="0.01" value={form[f] || ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          ))}
          <Input label="Notes" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm text-brand-800">Combined Chlorine: <strong>{cc}</strong> ppm</span>
          <Button onClick={save}>{editingId ? "Update" : "Add Reading"}</Button>
          {editingId && <Button variant="ghost" onClick={() => { setForm({}); setEditingId(null); }}>Cancel</Button>}
        </div>
      </Card>

      <div className="space-y-3">
        {tests.map((t) => (
          <Card key={t.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-brand-800">{new Date(t.recordedAt).toLocaleString()}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  {Object.entries(t.readings).map(([k, v]) => (
                    <Badge key={k} tone={Number.isFinite(v) ? badgeTone(k, v) : "info"}>{k}: {Number.isFinite(v) ? v.toFixed(2) : "—"}{k === "temperature" ? "°" : ""}</Badge>
                  ))}
                </div>
                {t.notes && <p className="mt-2 text-sm text-brand-800">{t.notes}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => edit(t)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this reading?")) remove(t.id); }}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        {tests.length === 0 && <p className="text-center text-sm text-brand-700">No readings yet.</p>}
      </div>
    </div>
  );
}
