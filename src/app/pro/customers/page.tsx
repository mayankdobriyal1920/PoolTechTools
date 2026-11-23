import { Suspense } from "react";
import { ProGuard } from "@/components/ProGuard";
import CustomersClient from "./CustomersClient";

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <ProGuard>
        <CustomersClient />
      </ProGuard>
    </Suspense>
  );
}
