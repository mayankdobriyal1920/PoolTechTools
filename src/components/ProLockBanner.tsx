"use client";

import { useState } from "react";
import { useEntitlement } from "@/hooks/useEntitlement";
import Link from "next/link";

export function ProLockBanner() {
  const { isPro, loading, reason } = useEntitlement();
  const [dismissed, setDismissed] = useState(false);

  if (loading || isPro || dismissed) return null;

  const expired = reason === "expired" || reason === "clock rollback";

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl bg-amber-700 px-4 py-3 text-sm font-medium text-white shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:px-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5">🔒</span>
        <div className="flex-1">
          <div className="font-semibold">{expired ? "Pro verification required" : "Pro features locked"}</div>
          <div className="text-xs opacity-90">
            {expired
              ? "Your offline grace period expired. Connect to the internet to restore Pro features."
              : "A valid Pro license is required. Your data is safe and exportable."}
          </div>
        </div>
        <Link href="/pro/activate" className="shrink-0 rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30">
          Activate
        </Link>
        <button onClick={() => setDismissed(true)} className="shrink-0 text-xs opacity-70 hover:opacity-100" aria-label="Dismiss">✕</button>
      </div>
    </div>
  );
}
