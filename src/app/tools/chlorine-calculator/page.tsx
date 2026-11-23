import { Suspense } from "react";
import ChlorineClient from "./ChlorineClient";

export default function ChlorinePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <ChlorineClient />
    </Suspense>
  );
}
