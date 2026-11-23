import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy — PoolTechTools",
  description: "How PoolTechTools handles your data. Local-first: your pool data stays in your browser.",
};

export default function PrivacyPage() {
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }];
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-brand">
      <PageHeader title="Privacy Policy" subtitle="How PoolTechTools handles your data." breadcrumbs={breadcrumbs} />
      <p className="mt-4 text-brand-800">Last updated: 2026.</p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Local-first data</h2>
      <p className="mt-2 text-brand-800">
        PoolTechTools stores all customer, pool, water test, service report, photo, and business profile data in your browser's IndexedDB storage.
        This data is not transmitted to any server. We do not have access to it.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">What we do collect</h2>
      <p className="mt-2 text-brand-800">
        Only license and payment administration data is stored on our servers (PostgreSQL): license keys (hashed), customer email, Paddle transaction IDs,
        device activation records, and webhook processing logs. No pool care data, notes, or photos are stored server-side.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Analytics &amp; Ads</h2>
      <p className="mt-2 text-brand-800">
        We use Google Analytics and Google AdSense (free tier only). Analytics events never contain customer data, pool addresses, report content, license keys, or private notes.
        AdSense is not loaded for Pro users.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Browser storage limitations</h2>
      <p className="mt-2 text-brand-800">
        Browser storage is origin-scoped and can be cleared by you or the browser under storage pressure. Safari may evict storage after inactivity.
        We request persistent storage, but it is not guaranteed. Back up your data regularly using the built-in JSON + ZIP export.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Data export &amp; deletion</h2>
      <p className="mt-2 text-brand-800">
        You can export all your data at any time (Settings → Export) and delete all local data (Settings → Delete all data). Backups contain private notes and customer data — store them securely.
      </p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Contact</h2>
      <p className="mt-2 text-brand-800">For privacy questions, contact support via the in-app support link.</p>
    </article>
  );
}
