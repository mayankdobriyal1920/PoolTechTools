"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function BrandingManager() {
  const [businessName, setBusinessName] = useState("");
  const [brandColor, setBrandColor] = useState("#2b7bbd");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const db = await getDB();
      const rec = await db.get("settings", "business_profile");
      const v = (rec?.value as any) || {};
      setBusinessName(v.name || "");
      setBrandColor(v.brandColor || "#2b7bbd");
      if (v.logoDataUrl) setLogoUrl(v.logoDataUrl);
    })();
  }, []);

  async function save() {
    const db = await getDB();
    await db.put("settings", {
      id: "business_profile",
      value: { name: businessName, brandColor, logoDataUrl: logoUrl },
      updatedAt: new Date().toISOString(),
    });
    alert("Branding saved.");
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-brand-800">Business Branding (Pro)</h2>
      <div className="mt-4 space-y-4">
        <Input label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-800">Brand color</label>
          <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="h-10 w-20 cursor-pointer rounded border" aria-label="Brand color" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-800">Logo (PNG/JPG)</label>
          <input type="file" accept="image/*" onChange={handleLogo} className="text-sm" />
          {logoUrl && <img src={logoUrl} alt="Logo preview" className="mt-2 h-16 w-auto rounded" />}
        </div>
        <Button size="sm" onClick={save}>Save Branding</Button>
      </div>
    </Card>
  );
}
