import { Suspense } from "react";
import ChemicalClient from "./ChemicalClient";

export default function ChemicalPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-700">Loading…</div>}>
      <ChemicalClient />
    </Suspense>
  );
}
