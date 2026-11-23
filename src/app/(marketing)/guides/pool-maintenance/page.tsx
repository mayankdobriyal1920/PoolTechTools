import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Maintenance Schedule Guide — PoolTechTools",
  description: "Daily, weekly, monthly, and seasonal pool maintenance tasks for residential pools.",
};

export default function PoolMaintenanceGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-800">Pool Maintenance Schedule</h1>
      <p className="mt-3 text-brand-800">A consistent routine keeps your pool clean and safe. Here's a practical schedule.</p>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Daily</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800"><li>Skim surface debris</li><li>Empty skimmer baskets</li><li>Check water level</li></ul>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Weekly</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800"><li>Test water chemistry (FC, pH, TA)</li><li>Brush walls and floor</li><li>Vacuum pool</li><li>Clean pump basket</li><li>Backwash filter if needed</li></ul>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Monthly</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800"><li>Inspect equipment (pump, filter, heater)</li><li>Clean tile line</li><li>Check salt cell (if salt pool)</li></ul>
      <h2 className="mt-6 text-xl font-bold text-brand-800">Seasonal</h2>
      <ul className="mt-2 list-disc pl-5 text-brand-800"><li>Opening: remove cover, clean, balance water</li><li>Closing: winterize, lower water, cover</li></ul>
      <div className="mt-8"><a href="/tools/maintenance-schedule" className="btn-primary">Open Maintenance Schedule</a></div>
    </article>
  );
}
