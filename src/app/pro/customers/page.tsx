import { Suspense } from "react";
import { ProGuard } from "@/components/ProGuard";
import CustomersClient from "./CustomersClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <PageHeader title="Customers &amp; Pools" subtitle="Manage client records and pool profiles locally." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Customers", href: "/pro/customers" }]} />
        <ProGuard>
          <CustomersClient />
        </ProGuard>
      </div>
    </Suspense>
  );
}
