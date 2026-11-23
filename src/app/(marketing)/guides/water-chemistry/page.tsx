import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Pool Water Chemistry Basics — PoolTechTools",
  description: "Understanding free chlorine, total chlorine, pH, alkalinity, and other pool water parameters.",
};

export default function WaterChemistryGuide() {
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Guides", href: "/" }, { label: "Water Chemistry", href: "/guides/water-chemistry" }];
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader title="Pool Water Chemistry Basics" subtitle="Understanding free chlorine, total chlorine, pH, alkalinity, and other pool water parameters." breadcrumbs={breadcrumbs} />
      <p className="mt-3 text-brand-800">Understanding key water parameters helps you maintain a safe, clear pool.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Free Chlorine (FC)</h2>
      <p className="mt-2 text-brand-800">The active sanitizer available to kill bacteria and algae.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Total Chlorine (TC)</h2>
      <p className="mt-2 text-brand-800">FC + combined chlorine. Measures all chlorine in the water.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Combined Chlorine (CC)</h2>
      <p className="mt-2 text-brand-800">TC − FC. High CC indicates chloramines (used-up chlorine) — shock the pool.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">pH</h2>
      <p className="mt-2 text-brand-800">Acidity/alkalinity. Ideal range is typically 7.2–7.8. Low pH is corrosive; high pH reduces chlorine effectiveness.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Total Alkalinity (TA)</h2>
      <p className="mt-2 text-brand-800">Buffers pH changes. Typically 80–120 ppm.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Cyanuric Acid (CYA)</h2>
      <p className="mt-2 text-brand-800">Stabilizer that protects chlorine from UV. Too high reduces chlorine effectiveness.</p>
      <div className="my-6"><AdSlot slot="9592081145" /></div>

      <div className="mt-8"><a href="/tools/water-test-log" className="btn-primary">Open Water Test Log</a></div>
      <p className="mt-8 text-xs text-brand-700">Ranges are informational defaults and vary by pool type and conditions. Follow product labels and professional advice.</p>
    </article>
  );
}
