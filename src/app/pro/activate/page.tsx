import { Suspense } from "react";
import ActivateClient from "./ActivateClient";

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <ActivateClient />
    </Suspense>
  );
}
