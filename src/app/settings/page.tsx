"use client";

import { useState, useEffect } from "react";
import { exportJSON, exportZIP } from "@/lib/backup/export";
import { previewImport, performImport } from "@/lib/backup/import";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [status, setStatus] = useState("");
  const [quota, setQuota] = useState<{ used: number; total: number } | null>(null);
  useEffect(() => {
    (async () => {
      if (navigator.storage?.estimate) {
        const est = await navigator.storage.estimate();
        setQuota({ used: est.usage || 0, total: est.quota || 0 });
      }
    })();
  }, []);
  const [preview, setPreview] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");

  async function handleExportJSON() { setStatus("Exporting JSON…"); await exportJSON(); setStatus("JSON exported."); }
  async function handleExportZIP() { setStatus("Exporting ZIP…"); await exportZIP(); setStatus("ZIP exported."); }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    try {
      const p = await previewImport(f);
      setPreview(p);
      setStatus("Preview ready.");
    } catch (err: any) {
      setStatus("Error: " + (err.message || "invalid file"));
      setPreview(null);
    }
  }

  async function handleImport() {
    if (!file) return;
    setStatus("Importing…");
    try {
      await performImport(file, mode);
      setStatus("Import complete.");
      setPreview(null);
      setFile(null);
    } catch (err: any) {
      setStatus("Import failed: " + (err.message || "unknown"));
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-brand-800">Settings &amp; Backup</h1>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-brand-800">Storage Usage</h2>
        {quota ? (
          <div className="mt-3">
            <div className="text-sm text-brand-700/80">{(quota.used / 1024 / 1024).toFixed(2)} MB used of {(quota.total / 1024 / 1024).toFixed(0)} MB</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div className="h-full bg-brand-500" style={{ width: `${Math.min(100, (quota.used / quota.total) * 100)}%` }} />
            </div>
            {(quota.used / quota.total) > 0.8 && <p className="mt-2 text-xs text-amber-700">Storage is over 80% full. Consider exporting and cleaning up.</p>}
          </div>
        ) : <p className="mt-2 text-sm text-brand-700/60">Storage estimate unavailable.</p>}
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-brand-800">Export Data</h2>
        <p className="mt-2 text-sm text-brand-700/70">Backup files contain private notes and customer data — store securely.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleExportJSON}>Export JSON (no photos)</Button>
          <Button variant="ghost" onClick={handleExportZIP}>Export ZIP (with photos)</Button>
        </div>
        {status && <p className="mt-3 text-sm text-brand-700/80">{status}</p>}
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-brand-800">Import Data</h2>
        <p className="mt-2 text-sm text-brand-700/70">Restore from a JSON or ZIP backup. Preview before importing.</p>
        <div className="mt-4">
          <input type="file" accept=".json,.zip" onChange={handleFileChange} className="block w-full text-sm" />
        </div>
        {preview && (
          <div className="mt-4 rounded-lg bg-brand-50/60 p-3 text-sm">
            <div className="font-semibold">Preview</div>
            <pre className="mt-2 text-xs">{JSON.stringify(preview.counts, null, 2)}</pre>
            <div className="mt-3 flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={mode === "merge"} onChange={() => setMode("merge")} /> Merge (skip duplicates)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={mode === "replace"} onChange={() => setMode("replace")} /> Replace (overwrite)
              </label>
            </div>
            <Button className="mt-3" onClick={handleImport}>Confirm Import</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
