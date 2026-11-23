import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Pool Opening & Closing Checklist — PoolTechTools",
  description: "Step-by-step pool opening and closing procedures for seasonal maintenance.",
};

export default function PoolOpeningClosingGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-800">Pool Opening &amp; Closing Checklist</h1>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Opening (Spring)</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800">
        <li>Remove and clean cover</li><li>Reconnect equipment</li><li>Fill to proper level</li>
        <li>Run filter 24h</li><li>Test and balance water (FC, pH, TA, CH, CYA)</li><li>Shock if needed</li>
        <li>Inspect equipment for leaks</li>
      </ul>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Closing (Fall/Winter)</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800">
        <li>Balance water chemistry</li><li>Clean pool thoroughly</li><li>Lower water level below skimmer</li>
        <li>Drain equipment and blow out lines</li><li>Add winterizing chemicals</li><li>Install cover securely</li>
      </ul>
      <div className="my-6"><AdSlot slot="9592081145" /></div>

      <div className="mt-8"><a href="/tools/maintenance-schedule" className="btn-primary">Open Maintenance Schedule</a></div>
    </article>
  );
}
