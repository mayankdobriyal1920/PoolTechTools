import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PoolTechTools",
  description: "Terms of use for PoolTechTools.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-800">Terms of Service</h1>
      <p className="mt-4 text-brand-700/80">Last updated: 2026.</p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Use of the service</h2>
      <p className="mt-2 text-brand-700/80">
        PoolTechTools provides pool care calculators, maintenance tracking, water test logs, and service report generation. It is a tool, not professional advice.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Chemical calculations disclaimer</h2>
      <p className="mt-2 text-brand-700/80">
        The chemical and chlorine calculators mathematically scale a dosage you enter from a product label. They are not chemical treatment recommendations.
        Always verify against the physical product label and consult a pool professional. PoolTechTools is not responsible for chemical application outcomes.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Pool volume disclaimer</h2>
      <p className="mt-2 text-brand-700/80">
        Pool volume results are mathematical calculations based on the dimensions you enter. Real-world water capacity depends on construction tolerances, floor contours, steps, benches, and water level.
        Irregular and kidney shapes are estimates.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">License</h2>
      <p className="mt-2 text-brand-700/80">
        Pro is a one-time $29 lifetime license for personal/business use on up to 3 devices. Refunds are handled per Paddle&apos;s policy. License keys are not transferable.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Data ownership</h2>
      <p className="mt-2 text-brand-700/80">
        You own your data. It is stored locally in your browser. We are not responsible for data loss due to browser storage eviction; back up regularly.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Limitation of liability</h2>
      <p className="mt-2 text-brand-700/80">
        PoolTechTools is provided &quot;as is&quot; without warranties. We are not liable for damages arising from use of the service, including chemical application or data loss.
      </p>
    </article>
  );
}
