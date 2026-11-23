import { Suspense } from "react";
import ActivateClient from "./ActivateClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <PageHeader title="Activate Pro" subtitle="Enter your license key to unlock Pro features." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pro", href: "/pro/activate" }]} />
        <ActivateClient />
      </div>
    </Suspense>
  );
}
