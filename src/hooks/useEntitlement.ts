"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/license/verify";

export interface Entitlement {
  isPro: boolean;
  loading: boolean;
  token: string | null;
  expiresAt: string | null;
  reason?: string;
}

export function useEntitlement(): Entitlement {
  const [state, setState] = useState<Entitlement>({ isPro: false, loading: true, token: null, expiresAt: null });

  useEffect(() => {
    (async () => {
      try {
        const db = await getDB();
        const rec = await db.get("settings", "app_settings");
        const val = (rec?.value as any) || {};
        const token = val?.proEntitlementCache?.token ?? null;
        if (!token) { setState({ isPro: false, loading: false, token: null, expiresAt: null }); return; }
        const { valid, payload, reason } = await verifyToken(token);
        // clock manipulation check
        const lastSeen = val?.proEntitlementCache?.lastSeenAt;
        const now = Date.now();
        if (lastSeen && now < new Date(lastSeen).getTime()) {
          setState({ isPro: false, loading: false, token, expiresAt: payload?.exp ? new Date(payload.exp * 1000).toISOString() : null, reason: "clock rollback" });
          return;
        }
        // update lastSeen
        await db.put("settings", { id: "app_settings", value: { ...val, proEntitlementCache: { ...val.proEntitlementCache, lastSeenAt: new Date().toISOString() } }, updatedAt: new Date().toISOString() });
        setState({ isPro: valid, loading: false, token, expiresAt: payload?.exp ? new Date(payload.exp * 1000).toISOString() : null, reason });
      } catch {
        setState({ isPro: false, loading: false, token: null, expiresAt: null });
      }
    })();
  }, []);

  return state;
}
