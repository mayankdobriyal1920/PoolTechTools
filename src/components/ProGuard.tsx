"use client";

import { useEntitlement } from "@/hooks/useEntitlement";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function ProGuard({ children }: { children: React.ReactNode }) {
  const { isPro, loading } = useEntitlement();

  if (loading) {
    return <div className="p-10 text-center text-brand-700">Loading…</div>;
  }

  if (!isPro) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <Card>
          <h2 className="text-2xl font-bold text-brand-800">Pro Feature</h2>
          <p className="mt-3 text-brand-700/80">
            Customer &amp; pool management, service history, templates, and branding require a Pro license.
          </p>
          <div className="mt-6">
            <Link href="/#pricing" className="btn-primary inline-block">Upgrade to Pro ($29)</Link>
          </div>
          <p className="mt-4 text-xs text-brand-700/60">
            Your data is safe and exportable even without Pro.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
