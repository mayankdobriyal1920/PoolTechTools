"use client";

import { useEffect } from "react";
import { getDB } from "@/lib/db";

export function TokenRefresh() {
  useEffect(() => {
    const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
    let timer: ReturnType<typeof setInterval>;

    async function refresh() {
      if (!navigator.onLine) return;
      try {
        const db = await getDB();
        const rec = await db.get("settings", "app_settings");
        const val = (rec?.value as any) || {};
        const token = val?.proEntitlementCache?.token;
        if (!token) return;
        const res = await fetch("/api/license/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signedToken: token }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.valid && data.signedToken) {
          await db.put("settings", {
            id: "app_settings",
            value: { ...val, proEntitlementCache: { token: data.signedToken, expiresAt: data.expiresAt, lastSeenAt: new Date().toISOString() } },
            updatedAt: new Date().toISOString(),
          });
        }
      } catch {
        // silently fail — will retry later
      }
    }

    // initial refresh after 30s
    const initial = setTimeout(refresh, 30000);
    timer = setInterval(refresh, REFRESH_INTERVAL);

    return () => { clearTimeout(initial); clearInterval(timer); };
  }, []);

  return null;
}
