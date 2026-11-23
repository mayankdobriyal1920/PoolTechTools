import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Chemical Calculator Guide — PoolTechTools",
  description: "How to use label-rate proportional scaling for pool chemicals safely.",
};

export default function ChemicalGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-800">Pool Chemical Calculator Guide</h1>
      <p className="mt-3 text-brand-700/80">PoolTechTools uses label-rate proportional scaling — not automatic dosing recommendations.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">How it works</h2>
      <p className="mt-2 text-brand-700/80">Required Dose = Label Dose × (Actual Pool Volume / Label Reference Volume)</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Safety rules</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-700/80">
        <li>Weight units (oz, lbs, g, kg) and fluid units (fl oz, qt, gal) are strictly separated.</li>
        <li>No mass-to-fluid conversion without product-specific density.</li>
        <li>You must verify against the physical product label before results show.</li>
        <li>The tool does not recommend chemical treatment — it scales your entered label instruction.</li>
      </ul>
      <div className="mt-8"><a href="/tools/chemical-calculator" className="btn-primary">Open Chemical Calculator</a></div>
      <p className="mt-8 text-xs text-brand-700/60">Always verify against the physical product label and consult a pool professional.</p>
    </article>
  );
}
