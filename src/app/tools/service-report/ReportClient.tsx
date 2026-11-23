"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import type { Report, ReportDraft } from "@/lib/db/types";
import { compressPhoto, validatePhotoFile, MAX_PHOTOS } from "@/lib/photo/compress";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";

const STANDARD_TASKS = [
  "Skimmed surface", "Brushed walls", "Brushed floor", "Vacuumed",
  "Emptied skimmer baskets", "Emptied pump basket", "Checked water level",
  "Backwashed filter", "Checked equipment", "Tested water chemistry",
];

const SERVICE_TYPES = ["Regular service", "Green-to-clean", "Filter backwash", "Pool opening", "Pool closing", "Repair visit", "Other"];

export default function ReportClient() {
  const [reportNumber, setReportNumber] = useState("");
  const [technician, setTechnician] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 16));
  const [serviceType, setServiceType] = useState("Regular service");
  const [waterTemp, setWaterTemp] = useState("");
  const [weather, setWeather] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [customTask, setCustomTask] = useState("");
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [chemicals, setChemicals] = useState<Array<{ product: string; amount: string; unit: string }>>([]);
  const [customerSummary, setCustomerSummary] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [photos, setPhotos] = useState<Array<{ id: string; url: string; name: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);

  const READING_FIELDS = ["FC", "TC", "pH", "TA", "CH", "CYA", "Salt", "PSI"];

  async function loadReports() {
    const db = await getDB();
    const all = await db.getAll("reports");
    setReports(all.sort((a, b) => b.visitDate.localeCompare(a.visitDate)));
  }
  useEffect(() => { loadReports(); }, []);

  // Auto-save draft (debounced 2s)
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!technician && !customerName && tasks.length === 0) return;
      const db = await getDB();
      const id = draftId ?? crypto.randomUUID();
      if (!draftId) setDraftId(id);
      const draft: ReportDraft = {
        id,
        payload: {
          id,
          customerNameSnapshot: customerName,
          reportNumber: reportNumber || `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-0001`,
          visitDate: new Date(visitDate).toISOString(),
          technician,
          tasks,
          readings: (() => {
            const r: Record<string, number> = {};
            for (const [k, v] of Object.entries(readings)) {
              const n = parseFloat(v);
              if (!isNaN(n)) r[k] = n;
            }
            return r;
          })(),
          chemicals: chemicals.map((c) => ({ product: c.product, amount: parseFloat(c.amount) || 0, unit: c.unit })),
          customerSummary,
          privateNotes,
          photoIds: photos.map((p) => p.id),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        } as any,
        lastSavedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      };
      await db.put("report_drafts", draft);
    }, 2000);
    return () => clearTimeout(handle);
  }, [technician, customerName, tasks, readings, chemicals, customerSummary, privateNotes, photos, visitDate, reportNumber, draftId]);

  function toggleTask(t: string) {
    setTasks((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  function addCustomTask() {
    if (customTask.trim()) { setTasks((prev) => [...prev, customTask.trim()]); setCustomTask(""); }
  }
  function addChemical() {
    setChemicals((prev) => [...prev, { product: "", amount: "", unit: "oz" }]);
  }
  function updateChemical(i: number, field: string, val: string) {
    setChemicals((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));
  }
  function removeChemical(i: number) {
    setChemicals((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > MAX_PHOTOS) {
      alert(`Max ${MAX_PHOTOS} photos per report.`);
      return;
    }
    for (const file of files) {
      const err = validatePhotoFile(file);
      if (err) { alert(err); continue; }
      try {
        const c = await compressPhoto(file);
        const id = crypto.randomUUID();
        const url = URL.createObjectURL(c.blob);
        // persist attachment
        const db = await getDB();
        await db.put("attachments", { id, reportId: savedId ?? "draft", blob: c.blob, filename: file.name, mimeType: "image/jpeg", sizeBytes: c.sizeBytes, createdAt: new Date().toISOString() });
        setPhotos((prev) => [...prev, { id, url, name: file.name }]);
      } catch (err: any) {
        alert(err.message || "Compression failed");
      }
    }
    e.target.value = "";
  }

  async function handleSave() {
    setSaving(true);
    try {
      const db = await getDB();
      const id = savedId ?? crypto.randomUUID();
      const rn = reportNumber || `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
      const report: Report = {
        id,
        customerNameSnapshot: customerName || "Walk-in",
        reportNumber: rn,
        visitDate: new Date(visitDate).toISOString(),
        technician: technician || "Technician",
        tasks,
        readings: Object.fromEntries(Object.entries(readings).map(([k, v]) => [k, parseFloat(v)]).filter(([, v]) => !isNaN(v as number))),
        chemicals: chemicals.filter((c) => c.product.trim()).map((c) => ({ product: c.product, amount: parseFloat(c.amount) || 0, unit: c.unit })),
        customerSummary,
        privateNotes,
        photoIds: photos.map((p) => p.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };
      await db.put("reports", report);
      // link attachments
      for (const ph of photos) {
        const att = await db.get("attachments", ph.id);
        if (att) { await db.put("attachments", { ...att, reportId: id }); }
      }
      // remove draft
      if (draftId) await db.delete("report_drafts", draftId);
      setSavedId(id);
      setReportNumber(rn);
      setDraftId(null);
      await loadReports();
      alert("Report saved: " + rn);
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this report?")) return;
    const db = await getDB();
    await db.delete("reports", id);
    // cascade attachments
    const atts = await db.getAllFromIndex("attachments", "by-reportId", id);
    for (const a of atts) await db.delete("attachments", a.id);
    await loadReports();
    if (savedId === id) resetForm();
  }

  async function handleDownloadPDF() {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { ReportPDF } = await import("@/lib/pdf/ReportPDF");
      // build PublicReportView (excludes privateNotes)
      const { privateNotes: _pn, ...publicReport } = (await (async () => {
        const db = await getDB();
        const r = await db.get("reports", savedId ?? "");
        return r ?? {
          id: "draft", customerNameSnapshot: customerName || "Walk-in", reportNumber: reportNumber || "DRAFT",
          visitDate: new Date(visitDate).toISOString(), technician: technician || "Technician", tasks,
          readings: Object.fromEntries(Object.entries(readings).map(([k,v])=>[k,parseFloat(v)]).filter(([,v])=>!isNaN(v as number))),
          chemicals: chemicals.filter(c=>c.product.trim()).map(c=>({product:c.product,amount:parseFloat(c.amount)||0,unit:c.unit})),
          customerSummary, privateNotes, photoIds: photos.map(p=>p.id),
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
        };
      })()) as any;
      const photoDataUrls: string[] = [];
      for (const ph of photos) {
        photoDataUrls.push(ph.url);
      }
      const blob = await pdf(<ReportPDF report={publicReport} businessName="PoolTechTools" photoDataUrls={photoDataUrls} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${publicReport.reportNumber || "report"}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("PDF generation failed: " + (err.message || "unknown"));
    }
  }

  async function handleSharePDF() {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { ReportPDF } = await import("@/lib/pdf/ReportPDF");
      const db = await getDB();
      const r = savedId ? await db.get("reports", savedId) : null;
      const publicReport = r ? (({ privateNotes: _pn, ...rest }) => rest)(r) : {
        id: "draft", customerNameSnapshot: customerName || "Walk-in", reportNumber: reportNumber || "DRAFT",
        visitDate: new Date(visitDate).toISOString(), technician: technician || "Technician", tasks,
        readings: Object.fromEntries(Object.entries(readings).map(([k, v]) => [k, parseFloat(v)]).filter(([, v]) => !isNaN(v as number))),
        chemicals: chemicals.filter((c) => c.product.trim()).map((c) => ({ product: c.product, amount: parseFloat(c.amount) || 0, unit: c.unit })),
        customerSummary, photoIds: photos.map((p) => p.id),
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
      };
      const photoDataUrls = photos.map((p) => p.url);
      const blob = await pdf(<ReportPDF report={publicReport as any} businessName="PoolTechTools" photoDataUrls={photoDataUrls} />).toBlob();
      const file = new File([blob], `${publicReport.reportNumber || "report"}.pdf`, { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: publicReport.reportNumber, text: "Pool service report" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${publicReport.reportNumber || "report"}.pdf`; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") alert("Share failed: " + (err.message || "unknown"));
    }
  }

  function handleCopySMS() {
    const lines = [
      `PoolTechTools Service Report`,
      customerName ? `Customer: ${customerName}` : "",
      `Date: ${new Date(visitDate).toLocaleDateString()}`,
      tasks.length ? `Tasks: ${tasks.join(", ")}` : "",
      Object.keys(readings).length ? `Readings: ${Object.entries(readings).map(([k, v]) => `${k}=${v}`).join(", ")}` : "",
      chemicals.length ? `Chemicals: ${chemicals.filter((c) => c.product.trim()).map((c) => `${c.product} ${c.amount}${c.unit}`).join(", ")}` : "",
      customerSummary ? `Notes: ${customerSummary}` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines).then(() => alert("SMS summary copied to clipboard.")).catch(() => alert("Copy failed."));
  }

  function resetForm() {
    setReportNumber(""); setTechnician(""); setCustomerName(""); setServiceAddress("");
    setVisitDate(new Date().toISOString().slice(0, 16)); setServiceType("Regular service");
    setWaterTemp(""); setWeather(""); setTasks([]); setCustomTask("");
    setReadings({}); setChemicals([]); setCustomerSummary(""); setPrivateNotes("");
    setPhotos([]); setSavedId(null); setDraftId(null);
  }

  async function loadReport(r: Report) {
    setReportNumber(r.reportNumber); setTechnician(r.technician);
    setCustomerName(r.customerNameSnapshot); setServiceAddress("");
    setVisitDate(r.visitDate.slice(0, 16)); setTasks(r.tasks);
    setReadings(Object.fromEntries(Object.entries(r.readings).map(([k, v]) => [k, String(v)])));
    setChemicals(r.chemicals.map((c) => ({ product: c.product, amount: String(c.amount), unit: c.unit })));
    setCustomerSummary(r.customerSummary); setPrivateNotes(r.privateNotes);
    setSavedId(r.id);
    // load photos
    const db = await getDB();
    const atts = await db.getAllFromIndex("attachments", "by-reportId", r.id);
    setPhotos(atts.map((a) => ({ id: a.id, url: URL.createObjectURL(a.blob), name: a.filename })));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Service Report Maker</h1>
        <p className="mt-2 text-brand-700/70">Build a professional service report in seconds.</p>
      </div>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-brand-800">Business &amp; Visit</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Technician" value={technician} onChange={(e) => setTechnician(e.target.value)} />
          <Input label="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <Input label="Service address" value={serviceAddress} onChange={(e) => setServiceAddress(e.target.value)} />
          <Input label="Visit date/time" type="datetime-local" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-800">Service type</label>
            <select className="input" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Water temp (°F)" value={waterTemp} onChange={(e) => setWaterTemp(e.target.value)} />
          <Input label="Weather" value={weather} onChange={(e) => setWeather(e.target.value)} />
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-brand-800">Tasks</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STANDARD_TASKS.map((t) => (
            <button key={t} type="button" onClick={() => toggleTask(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${tasks.includes(t) ? "bg-brand-500 text-white" : "bg-white/60 text-brand-700 hover:bg-brand-100"}`}>
              {tasks.includes(t) ? "✓ " : ""}{t}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input placeholder="Custom task" value={customTask} onChange={(e) => setCustomTask(e.target.value)} />
          <Button variant="ghost" onClick={addCustomTask}>Add</Button>
        </div>
        {tasks.filter((t) => !STANDARD_TASKS.includes(t)).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tasks.filter((t) => !STANDARD_TASKS.includes(t)).map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-700">
                {t} <button onClick={() => setTasks((p) => p.filter((x) => x !== t))} className="text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-brand-800">Water Readings</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {READING_FIELDS.map((f) => (
            <Input key={f} label={f} type="number" step="0.01" value={readings[f] || ""} onChange={(e) => setReadings({ ...readings, [f]: e.target.value })} />
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-800">Chemicals Added</h2>
          <Button variant="ghost" size="sm" onClick={addChemical}>+ Add</Button>
        </div>
        <div className="mt-4 space-y-3">
          {chemicals.map((c, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-4">
              <Input placeholder="Product" value={c.product} onChange={(e) => updateChemical(i, "product", e.target.value)} />
              <Input placeholder="Amount" type="number" value={c.amount} onChange={(e) => updateChemical(i, "amount", e.target.value)} />
              <select className="input" value={c.unit} onChange={(e) => updateChemical(i, "unit", e.target.value)}>
                {["oz", "lbs", "g", "kg", "floz", "cups", "qt", "gal", "mL", "L"].map((u) => <option key={u}>{u}</option>)}
              </select>
              <Button variant="ghost" size="sm" onClick={() => removeChemical(i)}>Remove</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-brand-800">Notes &amp; Photos</h2>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-800">Customer summary</label>
            <textarea className="input min-h-[80px]" value={customerSummary} onChange={(e) => setCustomerSummary(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-brand-800">
              <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">🔒 Private</span>
              Private technician notes (never shown to customer)
            </label>
            <textarea className="input min-h-[80px]" value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-800">Photos (max {MAX_PHOTOS})</label>
            <input type="file" accept="image/*" multiple className="mt-2 block w-full text-sm" onChange={handlePhotoUpload} />
            <div className="mt-3 flex flex-wrap gap-3">
              {photos.map((p) => (
                <div key={p.id} className="relative">
                  <img src={p.url} alt={p.name} className="h-24 w-24 rounded-lg object-cover" />
                  <button onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))} className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-xs text-white">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} loading={saving}>{savedId ? "Update Report" : "Save Report"}</Button>
        <Button variant="ghost" onClick={handleDownloadPDF}>Download PDF</Button>
        <Button variant="ghost" onClick={handleSharePDF}>Share PDF</Button>
        <Button variant="ghost" onClick={handleCopySMS}>Copy SMS Summary</Button>
        <Button variant="ghost" onClick={resetForm}>New Report</Button>
      </div>

      {/* Saved reports list */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-brand-800">Saved Reports</h2>
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-brand-800">{r.reportNumber} — {r.customerNameSnapshot}</div>
                  <div className="text-xs text-brand-700/60">{new Date(r.visitDate).toLocaleString()} · {r.tasks.length} tasks</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => loadReport(r)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
          {reports.length === 0 && <p className="text-center text-sm text-brand-700/60">No saved reports yet.</p>}
        </div>
      </div>
    </div>
  );
}
