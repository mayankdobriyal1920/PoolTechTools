import { Suspense } from "react";
import ReportClient from "./ReportClient";

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <ReportClient />
    </Suspense>
  );
}
