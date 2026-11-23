import { Suspense } from "react";
import PoolVolumeClient from "./PoolVolumeClient";

export default function PoolVolumePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <PoolVolumeClient />
    </Suspense>
  );
}
