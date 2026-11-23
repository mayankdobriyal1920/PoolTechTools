"use client";

import { useState, useEffect } from "react";
import { getDB } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ActivateClient() {
  const [licenseKey, setLicenseKey] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  async function handleActivate() {
    if (!licenseKey.trim() || !deviceName.trim()) { setStatus("License key and device name required."); return; }
    setLoading(true);
    setStatus("");
    try {
      // best-effort device hash
      let deviceHash = localStorage.getItem("ptt_device_hash");
      if (!deviceHash) { deviceHash = crypto.randomUUID(); localStorage.setItem("ptt_device_hash", deviceHash); }
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim(), deviceName: deviceName.trim(), deviceHash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Activation failed");
      // store token in IndexedDB
      const db = await getDB();
      const rec = await db.get("settings", "app_settings");
      const val = (rec?.value as any) || {};
      await db.put("settings", {
        id: "app_settings",
        value: { ...val, proEntitlementCache: { token: data.signedToken, expiresAt: data.expiresAt, lastSeenAt: new Date().toISOString() } },
        updatedAt: new Date().toISOString(),
      });
      setStatus("Activated! Pro features unlocked.");
      setIsPro(true);
    } catch (err: any) {
      setStatus("Error: " + (err.message || "unknown"));
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  }

  async function checkStatus() {
    const db = await getDB();
    const rec = await db.get("settings", "app_settings");
    const val = (rec?.value as any) || {};
    setIsPro(!!val?.proEntitlementCache?.token);
  }
  // check on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkStatus(); }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Activate Pro</h1>
        <p className="mt-2 text-brand-700/70">Enter your license key to unlock Pro features.</p>
        {isPro && <Badge tone="success">Pro active</Badge>}
      </div>

      <Card>
        <div className="space-y-4">
          <Input label="License key" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} placeholder="PTT-XXXX-XXXX-XXXX-XXXX" />
          <Input label="Device name" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="e.g. Sam's iPhone" />
          <Button onClick={handleActivate} loading={loading}>Activate</Button>
          {status && <p className="text-sm text-brand-700/80">{status}</p>}
        </div>
      </Card>

      <div className="mt-6 text-center text-sm text-brand-700/60">
        Lost your key? Use the recovery link sent to your email, or contact support.
      </div>
    </div>
  );
}
