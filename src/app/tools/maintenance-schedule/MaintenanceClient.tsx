"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { SEED_TASKS } from "@/lib/data/maintenanceSeed";
import type { MaintenanceTask } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { AdSlot } from "@/components/AdSlot";
import { PageHeader } from "@/components/layout/PageHeader";
import { Select } from "@/components/ui/Select";

const CATEGORIES = ["daily", "weekly", "monthly", "seasonal", "opening", "closing", "custom"] as const;

export default function MaintenanceClient() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<(typeof CATEGORIES)[number]>("custom");
  const [filter, setFilter] = useState<string>("all");
  const [poolType, setPoolType] = useState("chlorine");
  const [season, setSeason] = useState("summer");

  async function load() {
    const db = await getDB();
    let all = await db.getAll("maintenance_tasks");
    if (all.length === 0) {
      // seed
      const now = new Date().toISOString();
      for (const t of SEED_TASKS) {
        const task: MaintenanceTask = { ...t, id: crypto.randomUUID(), createdAt: now, updatedAt: now, version: 1 } as MaintenanceTask;
        await db.put("maintenance_tasks", task);
      }
      all = await db.getAll("maintenance_tasks");
    }
    setTasks(all.sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order));
  }

  useEffect(() => { load(); }, []);

  async function toggle(t: MaintenanceTask) {
    const db = await getDB();
    const updated: MaintenanceTask = { ...t, completedAt: t.completedAt ? undefined : new Date().toISOString(), updatedAt: new Date().toISOString(), version: t.version + 1 };
    await db.put("maintenance_tasks", updated);
    setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
  }

  async function addTask() {
    if (!newTitle.trim()) return;
    const db = await getDB();
    const now = new Date().toISOString();
    const task: MaintenanceTask = {
      id: crypto.randomUUID(),
      category: newCategory,
      title: newTitle.trim(),
      order: tasks.filter((t) => t.category === newCategory).length + 1,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    await db.put("maintenance_tasks", task);
    setTasks((prev) => [...prev, task].sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order));
    setNewTitle("");
  }

  async function remove(t: MaintenanceTask) {
    const db = await getDB();
    await db.delete("maintenance_tasks", t.id);
    setTasks((prev) => prev.filter((x) => x.id !== t.id));
  }

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Maintenance Schedule</h1>
        <p className="mt-2 text-brand-800">Track daily, weekly, monthly &amp; seasonal tasks.</p>
      </div>

      <Card className="mb-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-800">Pool type</label>
            <select className="input w-auto" value={poolType} onChange={(e) => setPoolType(e.target.value)}>
              <option value="chlorine">Chlorine</option>
              <option value="salt">Salt</option>
              <option value="bromine">Bromine</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-800">Season</label>
            <select className="input w-auto" value={season} onChange={(e) => setSeason(e.target.value)}>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <Button variant="ghost" size="sm" onClick={async () => {
            if (!confirm("Reset all completion?")) return;
            const db = await getDB();
            for (const t of tasks) {
              await db.put("maintenance_tasks", { ...t, completedAt: undefined, updatedAt: new Date().toISOString(), version: t.version + 1 });
            }
            load();
          }}>Reset All</Button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="New task" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Clean filter" />
          </div>
          <Select label="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <Button onClick={addTask}>Add</Button>
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "all" ? "bg-brand-700 text-white" : "bg-white/60 text-brand-700"}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${filter === c ? "bg-brand-700 text-white" : "bg-white/60 text-brand-700"}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="glass-card flex items-center gap-3 p-4">
            <input type="checkbox" checked={!!t.completedAt} onChange={() => toggle(t)} className="h-5 w-5 rounded border-brand-400 text-brand-600" aria-label={t.title} />
            <div className="flex-1">
              <div className={`font-medium ${t.completedAt ? "line-through text-brand-700" : "text-brand-800"}`}>{t.title}</div>
              <Badge tone="info">{t.category}</Badge>
            </div>
            <button onClick={() => remove(t)} className="text-xs text-red-700 hover:text-red-800">Delete</button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-brand-700">No tasks in this category.</p>}
      </div>

      <div className="my-6"><AdSlot slot="9214687527" /></div>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={() => window.print()}>Print Schedule</Button>
      </div>
    </div>
  );
}
