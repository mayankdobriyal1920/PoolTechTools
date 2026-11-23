"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import type { Customer, Pool } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", serviceAddress: "", notes: "" });
  const [poolForm, setPoolForm] = useState({ name: "", shape: "rectangle", volumeGallons: "", surfaceType: "plaster", sanitizerType: "chlorine", equipmentNotes: "" });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  async function load() {
    const db = await getDB();
    const cs = await db.getAll("customers");
    const ps = await db.getAll("pools");
    setCustomers(cs.filter((c) => !c.deletedAt).sort((a, b) => a.name.localeCompare(b.name)));
    setPools(ps.filter((p) => !p.deletedAt));
  }
  useEffect(() => { load(); }, []);

  async function saveCustomer() {
    if (!form.name.trim()) return;
    const db = await getDB();
    const now = new Date().toISOString();
    const existing = editingCustomerId ? customers.find((c) => c.id === editingCustomerId) : null;
    const c: Customer = {
      id: editingCustomerId ?? crypto.randomUUID(),
      name: form.name.trim(),
      phone: form.phone || undefined,
      email: form.email || undefined,
      serviceAddress: form.serviceAddress || undefined,
      notes: form.notes || undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      version: (existing?.version ?? 0) + 1,
    };
    await db.put("customers", c);
    setForm({ name: "", phone: "", email: "", serviceAddress: "", notes: "" });
    setEditingCustomerId(null);
    load();
  }

  async function deleteCustomer(id: string) {
    if (!confirm("Archive this customer? Reports are preserved.")) return;
    const db = await getDB();
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    await db.put("customers", { ...c, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: c.version + 1 });
    load();
  }

  async function savePool() {
    if (!selectedCustomer || !poolForm.name.trim()) return;
    const db = await getDB();
    const now = new Date().toISOString();
    const p: Pool = {
      id: crypto.randomUUID(),
      customerId: selectedCustomer,
      name: poolForm.name.trim(),
      shape: poolForm.shape as Pool["shape"],
      volumeGallons: parseFloat(poolForm.volumeGallons) || 0,
      surfaceType: poolForm.surfaceType as Pool["surfaceType"],
      sanitizerType: poolForm.sanitizerType as Pool["sanitizerType"],
      equipmentNotes: poolForm.equipmentNotes || undefined,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    await db.put("pools", p);
    setPoolForm({ name: "", shape: "rectangle", volumeGallons: "", surfaceType: "plaster", sanitizerType: "chlorine", equipmentNotes: "" });
    load();
  }

  async function deletePool(id: string) {
    if (!confirm("Archive this pool? Reports are preserved.")) return;
    const db = await getDB();
    const p = pools.find((x) => x.id === id);
    if (!p) return;
    await db.put("pools", { ...p, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: p.version + 1 });
    load();
  }

  const customerPools = pools.filter((p) => p.customerId === selectedCustomer);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Customers &amp; Pools</h1>
        <p className="mt-2 text-brand-700/70">Pro feature — manage client records and pool profiles locally.</p>
        <Badge tone="warning">Pro</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customers */}
        <Card>
          <h2 className="text-lg font-bold text-brand-800">{editingCustomerId ? "Edit Customer" : "New Customer"}</h2>
          <div className="mt-4 space-y-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Service address" value={form.serviceAddress} onChange={(e) => setForm({ ...form, serviceAddress: e.target.value })} />
            <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={saveCustomer}>{editingCustomerId ? "Update" : "Add Customer"}</Button>
              {editingCustomerId && <Button variant="ghost" onClick={() => { setForm({ name: "", phone: "", email: "", serviceAddress: "", notes: "" }); setEditingCustomerId(null); }}>Cancel</Button>}
            </div>
          </div>
        </Card>

        {/* Customer list */}
        <Card>
          <h2 className="text-lg font-bold text-brand-800">Customers ({customers.length})</h2>
          <div className="mt-4 space-y-2">
            {customers.map((c) => (
              <div key={c.id} className={`glass flex cursor-pointer items-center justify-between rounded-lg p-3 ${selectedCustomer === c.id ? "ring-2 ring-brand-500" : ""}`} onClick={() => setSelectedCustomer(c.id)}>
                <div>
                  <div className="font-medium text-brand-800">{c.name}</div>
                  <div className="text-xs text-brand-700/60">{c.serviceAddress || c.phone || c.email || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-brand-600" onClick={(e) => { e.stopPropagation(); setForm({ name: c.name, phone: c.phone || "", email: c.email || "", serviceAddress: c.serviceAddress || "", notes: c.notes || "" }); setEditingCustomerId(c.id); }}>Edit</button>
                  <button className="text-xs text-red-500" onClick={(e) => { e.stopPropagation(); deleteCustomer(c.id); }}>Archive</button>
                </div>
              </div>
            ))}
            {customers.length === 0 && <p className="text-sm text-brand-700/60">No customers yet.</p>}
          </div>
        </Card>
      </div>

      {/* Pools for selected customer */}
      {selectedCustomer && (
        <Card className="mt-6">
          <h2 className="text-lg font-bold text-brand-800">Pools for {customers.find((c) => c.id === selectedCustomer)?.name}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="Pool name" value={poolForm.name} onChange={(e) => setPoolForm({ ...poolForm, name: e.target.value })} />
            <Input label="Volume (gal)" type="number" value={poolForm.volumeGallons} onChange={(e) => setPoolForm({ ...poolForm, volumeGallons: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-800">Shape</label>
              <select className="input" value={poolForm.shape} onChange={(e) => setPoolForm({ ...poolForm, shape: e.target.value })}>
                {["rectangle", "square", "round", "oval", "kidney", "irregular"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-800">Surface</label>
              <select className="input" value={poolForm.surfaceType} onChange={(e) => setPoolForm({ ...poolForm, surfaceType: e.target.value })}>
                {["plaster", "pebble", "vinyl", "fiberglass", "tile", "other"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-800">Sanitizer</label>
              <select className="input" value={poolForm.sanitizerType} onChange={(e) => setPoolForm({ ...poolForm, sanitizerType: e.target.value })}>
                {["chlorine", "salt", "bromine", "biguanide", "other"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Equipment notes" value={poolForm.equipmentNotes} onChange={(e) => setPoolForm({ ...poolForm, equipmentNotes: e.target.value })} />
          </div>
          <div className="mt-4"><Button onClick={savePool}>Add Pool</Button></div>

          <div className="mt-6 space-y-2">
            {customerPools.map((p) => (
              <div key={p.id} className="glass flex items-center justify-between rounded-lg p-3">
                <div>
                  <div className="font-medium text-brand-800">{p.name}</div>
                  <div className="text-xs text-brand-700/60">{p.shape} · {p.volumeGallons.toLocaleString()} gal · {p.surfaceType}</div>
                </div>
                <button className="text-xs text-red-500" onClick={() => deletePool(p.id)}>Archive</button>
              </div>
            ))}
            {customerPools.length === 0 && <p className="text-sm text-brand-700/60">No pools yet.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}
