import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Pool Service Reports — PoolTechTools",
  description: "Create branded PDF service reports with tasks, water readings, chemicals, and photos.",
};

export default function ServiceReportsGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-800">Professional Pool Service Reports</h1>
      <p className="mt-3 text-brand-800">Create customer-ready PDF service reports in under 60 seconds on your phone.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Features</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800">
        <li>Quick-tap task chips (skim, brush, vacuum, etc.)</li>
        <li>Water readings grid (FC, TC, pH, TA, CH, CYA, salt, PSI)</li>
        <li>Chemicals added with units</li>
        <li>Customer-visible notes + private technician notes (never shown to customer)</li>
        <li>Up to 2 compressed photos</li>
        <li>PDF export, print, and native mobile sharing</li>
        <li>SMS summary copy</li>
      </ul>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Pro features</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800">
        <li>Business logo and brand colors on reports</li>
        <li>Saved customer/pool profiles</li>
        <li>Service history and 1-tap report cloning</li>
        <li>Reusable report templates</li>
      </ul>
      <div className="mt-8"><a href="/tools/service-report" className="btn-primary">Create Service Report</a></div>
    </article>
  );
}
