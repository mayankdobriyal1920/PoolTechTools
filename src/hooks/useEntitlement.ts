"use client";

import { useEffect, useState } from "react";

export interface Entitlement {
  isPro: boolean;
  loading: boolean;
  token: string | null;
  expiresAt: string | null;
}

// Reads entitlement from local settings. Full Ed25519 verification is performed
// when a token is present; until the crypto module is wired, presence + expiry
// is used as a best-effort gate (UI only — not a security boundary).
export function useEntitlement(): Entitlement {
  const [state, setState] = useState<Entitlement>({ isPro: false, loading: true, token: null, expiresAt: null });

  useEffect(() => {
    (async () => {
      try {
        const { getDB } = await import("@/lib/db");
        const db = await getDB();
        const rec = await db.get("settings", "app_settings");
        const val = (rec?.value as any) || {};
        const token = val?.proEntitlementCache?.token ?? null;
        const expiresAt = val?.proEntitlementCache?.expiresAt ?? null;
        const valid = !!token && (!expiresAt || new Date(expiresAt) > new Date());
        setState({ isPro: valid, loading: false, token, expiresAt });
      } catch {
        setState({ isPro: false, loading: false, token: null, expiresAt: null });
      }
    })();
  }, []);

  return state;
}
