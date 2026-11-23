import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "How to Read Pool Water Test Results — PoolTechTools",
  description: "Interpret pool water test readings: free chlorine, pH, alkalinity, calcium hardness, CYA, and salt.",
};

export default function ReadingTestResultsGuide() {
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Guides", href: "/" }, { label: "Reading Test Results", href: "/guides/reading-test-results" }];
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader title="How to Read Pool Water Test Results" subtitle="Interpret pool water test readings: free chlorine, pH, alkalinity, calcium hardness, CYA, and salt." breadcrumbs={breadcrumbs} />
      <p className="mt-3 text-brand-800">Understanding your test results is the first step to proper pool care.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Key Parameters</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800">
        <li><strong>Free Chlorine (FC):</strong> Active sanitizer. Low = under-sanitized.</li>
        <li><strong>Total Chlorine (TC):</strong> FC + combined chlorine.</li>
        <li><strong>Combined Chlorine (CC):</strong> Used-up chlorine. High = needs shocking.</li>
        <li><strong>pH:</strong> 7.2–7.8 ideal. Affects chlorine effectiveness.</li>
        <li><strong>Total Alkalinity (TA):</strong> Buffers pH. 80–120 ppm typical.</li>
        <li><strong>Calcium Hardness (CH):</strong> 200–400 ppm. Low = corrosive; high = scaling.</li>
        <li><strong>CYA (Stabilizer):</strong> Protects chlorine from UV. 30–50 ppm typical.</li>
        <li><strong>Salt:</strong> For salt pools. Check manufacturer range.</li>
      </ul>
      <p className="mt-4 text-sm text-brand-800">Ranges are informational defaults. Follow product labels and professional advice.</p>
      <div className="my-6"><AdSlot slot="9592081145" /></div>

      <div className="mt-8"><a href="/tools/water-test-log" className="btn-primary">Open Water Test Log</a></div>
    </article>
  );
}
