"use client";

import { useState, useEffect } from "react";
import { getDB } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Device {
  activation_id: string;
  device_name: string;
  activated_at: string;
  last_validated_at: string;
  status: string;
}

export default function ActivateClient() {
  const [licenseKey, setLicenseKey] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [maxDevices, setMaxDevices] = useState(3);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState("");

  async function handleActivate() {
    if (!licenseKey.trim() || !deviceName.trim()) { setStatus("License key and device name required."); return; }
    setLoading(true);
    setStatus("");
    try {
      let deviceHash = localStorage.getItem("ptt_device_hash");
      if (!deviceHash) { deviceHash = crypto.randomUUID(); localStorage.setItem("ptt_device_hash", deviceHash); }
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim(), deviceName: deviceName.trim(), deviceHash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Activation failed");
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
      await loadDevices();
    } catch (err: any) {
      setStatus("Error: " + (err.message || "unknown"));
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadDevices() {
    if (!licenseKey.trim()) return;
    try {
      const res = await fetch("/api/license/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setDevices(data.devices || []);
      setMaxDevices(data.maxActivations || 3);
    } catch {}
  }

  async function deactivate(deviceHash: string, devName: string) {
    if (!confirm(`Deactivate "${devName}"?`)) return;
    try {
      const res = await fetch("/api/license/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim(), deviceHash }),
      });
      const data = await res.json();
      if (res.ok) { setStatus("Device deactivated."); await loadDevices(); }
      else setStatus("Error: " + (data?.error?.message || "failed"));
    } catch (err: any) {
      setStatus("Error: " + (err.message || "unknown"));
    }
  }

  async function requestRecovery() {
    if (!recoveryEmail.trim()) { setRecoveryStatus("Enter your email."); return; }
    try {
      const res = await fetch("/api/license/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok) setRecoveryStatus("If an account exists, recovery instructions have been sent.");
      else setRecoveryStatus("Error: " + (data?.error?.message || "failed"));
    } catch (err: any) {
      setRecoveryStatus("Error: " + (err.message || "unknown"));
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const db = await getDB();
        const rec = await db.get("settings", "app_settings");
        const val = (rec?.value as any) || {};
        setIsPro(!!val?.proEntitlementCache?.token);
      } catch { setIsPro(false); }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800">Activate Pro</h1>
        <p className="mt-2 text-brand-700/70">Enter your license key to unlock Pro features.</p>
        {isPro && <Badge tone="success">Pro active</Badge>}
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <Input label="License key" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} placeholder="PTT-XXXX-XXXX-XXXX-XXXX" />
          <Input label="Device name" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="e.g. Sam's iPhone" />
          <Button onClick={handleActivate} loading={loading}>Activate</Button>
          {status && <p className="text-sm text-brand-700/80">{status}</p>}
        </div>
      </Card>

      {licenseKey.trim() && (
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-brand-800">Activated Devices ({devices.length}/{maxDevices})</h2>
          <Button variant="ghost" size="sm" onClick={loadDevices} className="mt-2">Load Devices</Button>
          <div className="mt-4 space-y-2">
            {devices.map((d) => (
              <div key={d.activation_id} className="glass flex items-center justify-between rounded-lg p-3">
                <div>
                  <div className="font-medium text-brand-800">{d.device_name}</div>
                  <div className="text-xs text-brand-700/60">{d.status} · activated {new Date(d.activated_at).toLocaleDateString()}</div>
                </div>
                {d.status === "active" && (
                  <button className="text-xs text-red-500 hover:text-red-700" onClick={() => deactivate(d.activation_id, d.device_name)}>
                    Deactivate
                  </button>
                )}
              </div>
            ))}
            {devices.length === 0 && <p className="text-sm text-brand-700/60">No devices loaded. Click "Load Devices".</p>}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-bold text-brand-800">Lost Your License Key?</h2>
        <p className="mt-2 text-sm text-brand-700/70">Enter your purchase email to receive recovery instructions.</p>
        <div className="mt-4 space-y-3">
          <Input label="Email" type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="you@example.com" />
          <Button variant="ghost" onClick={requestRecovery}>Send Recovery Email</Button>
          {recoveryStatus && <p className="text-sm text-brand-700/80">{recoveryStatus}</p>}
        </div>
      </Card>
    </div>
  );
}
