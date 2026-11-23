import { Suspense } from "react";
import WaterTestClient from "./WaterTestClient";

export default function WaterTestPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <WaterTestClient />
    </Suspense>
  );
}
