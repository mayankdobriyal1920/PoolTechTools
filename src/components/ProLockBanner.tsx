"use client";

import { useEntitlement } from "@/hooks/useEntitlement";
import Link from "next/link";

export function ProLockBanner() {
  const { isPro, loading, reason, expiresAt } = useEntitlement();

  if (loading || isPro) return null;

  const expired = reason === "expired" || reason === "clock rollback";

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-medium text-white shadow-lg">
      <div className="flex items-center gap-3">
        <span>🔒</span>
        <div>
          <div className="font-semibold">{expired ? "Pro verification required" : "Pro features locked"}</div>
          <div className="text-xs opacity-90">
            {expired
              ? "Your offline grace period expired. Connect to the internet to restore Pro features."
              : "A valid Pro license is required. Your data is safe and exportable."}
          </div>
        </div>
        <Link href="/pro/activate" className="ml-2 rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30">
          Activate
        </Link>
      </div>
    </div>
  );
}
