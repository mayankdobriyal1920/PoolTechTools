"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import type { Template } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function TemplatesManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [taskDefaults, setTaskDefaults] = useState("");
  const [notesDefault, setNotesDefault] = useState("");

  async function load() {
    const db = await getDB();
    const all = await db.getAll("templates");
    setTemplates(all.sort((a, b) => a.name.localeCompare(b.name)));
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!name.trim()) return;
    const db = await getDB();
    const now = new Date().toISOString();
    const t: Template = {
      id: crypto.randomUUID(),
      name: name.trim(),
      taskDefaults: taskDefaults.split(",").map((s) => s.trim()).filter(Boolean),
      notesDefault: notesDefault.trim(),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    await db.put("templates", t);
    setName(""); setTaskDefaults(""); setNotesDefault("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this template?")) return;
    const db = await getDB();
    await db.delete("templates", id);
    load();
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-brand-800">Report Templates (Pro)</h2>
      <p className="mt-1 text-xs text-brand-700">Reusable pre-filled templates for specialized visits.</p>
      <div className="mt-4 space-y-3">
        <Input label="Template name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Green-to-Clean" />
        <Input label="Default tasks (comma-separated)" value={taskDefaults} onChange={(e) => setTaskDefaults(e.target.value)} placeholder="Skimmed surface, Brushed walls, Vacuumed" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-800">Default notes</label>
          <textarea className="input min-h-[60px]" value={notesDefault} onChange={(e) => setNotesDefault(e.target.value)} />
        </div>
        <Button size="sm" onClick={save}>Save Template</Button>
      </div>
      <div className="mt-4 space-y-2">
        {templates.map((t) => (
          <div key={t.id} className="glass flex items-center justify-between rounded-lg p-3">
            <div>
              <div className="font-medium text-brand-800">{t.name}</div>
              <div className="text-xs text-brand-700">{t.taskDefaults.length} tasks</div>
            </div>
            <div className="flex gap-2">
              <Badge tone="info">{t.taskDefaults.length} tasks</Badge>
              <button className="text-xs text-red-500" onClick={() => remove(t.id)}>Delete</button>
            </div>
          </div>
        ))}
        {templates.length === 0 && <p className="text-sm text-brand-700">No templates yet.</p>}
      </div>
    </Card>
  );
}
