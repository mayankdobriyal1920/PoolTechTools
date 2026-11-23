"use client";

import { Logo } from "@/components/layout/Logo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/AdSlot";
import { UpgradeButton } from "@/components/UpgradeButton";
import { useEntitlement } from "@/hooks/useEntitlement";

const features = [
  { icon: "📐", title: "Pool Volume Calculator", desc: "Rectangular, round, oval, kidney & irregular shapes in ft/in or m/cm." },
  { icon: "⚗️", title: "Label-Rate Chemicals", desc: "Scale any product label dose to your pool volume — with strict unit safety." },
  { icon: "🧼", title: "Chlorine Calculator", desc: "FC, TC, combined chlorine with test-variance warnings." },
  { icon: "📅", title: "Maintenance Schedule", desc: "Daily, weekly, monthly & seasonal checklists with completion tracking." },
  { icon: "🧪", title: "Water Test Log", desc: "9 parameters, history, CSV export, configurable range badges." },
  { icon: "📄", title: "Service Reports", desc: "Pro-grade PDFs with tasks, readings, chemicals & photos — shared in seconds." },
];

const faqs = [
  { q: "Is PoolTechTools free to use?", a: "Yes — all calculators, water logs, maintenance schedules, and basic service reports with PDF export are free forever. Pro ($29 one-time) unlocks customer/pool profiles, history, templates, branding, and ad-free use." },
  { q: "Does it work offline?", a: "Yes. After your first visit, calculators, logs, reports, and PDF generation all work without internet — perfect for backyards with weak signal." },
  { q: "Where is my data stored?", a: "Entirely in your browser (IndexedDB). Nothing is sent to a server. You own 100% of your data and can export a full JSON + ZIP backup anytime." },
  { q: "Is the chemical calculator a dosing recommendation?", a: "No. It mathematically scales a dosage you enter from a product label. Always verify against the physical label and consult a pool professional." },
  { q: "How does the $29 Pro license work?", a: "One-time payment via Paddle. You receive a license key by email, activate on up to 3 devices, and Pro features unlock offline for 14 days at a time." },
];

export default function Home() {
  const { isPro, loading } = useEntitlement();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PoolTechTools",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Pool volume calculator, chemical scaling, maintenance schedules, water test logs, and service reports.",
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-aqua-400/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col items-center text-center">
            <div className="animate-float mb-6">
              <Logo size={104} />
            </div>
            <h1 className="animate-fadeup text-4xl font-extrabold tracking-tight sm:text-6xl">
              <span className="text-gradient">Pool care,</span> simplified.
            </h1>
            <p className="animate-fadeup mt-5 max-w-2xl text-lg text-brand-800 sm:text-xl">
              Volume math, label-rate chemical scaling, maintenance checklists, water test logs, and pro-grade service reports —
              fast, mobile-first, and fully offline-capable.
            </p>
            <div className="animate-fadeup mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/tools/pool-volume" className="btn-primary">Open Calculators</a>
              <a href="/tools/service-report" className="btn-ghost">Create Service Report</a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-brand-800">
              <span className="inline-block h-2 w-2 rounded-full bg-poolgreen-500" />
              Works offline · No account required · Free to start
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6"><AdSlot slot="6070930694" /></div>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand-800">Everything you need, in your pocket</h2>
          <p className="mt-3 text-brand-800">Built for pool owners and independent technicians.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6">
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-semibold text-brand-800">{f.title}</h3>
              <p className="mt-2 text-sm text-brand-800">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand-800">Simple, honest pricing</h2>
          <p className="mt-3 text-brand-800">Free forever for essentials. Pro is a one-time $29 lifetime license.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-brand-800">Free</h3>
            <div className="mt-2 text-4xl font-extrabold text-brand-700">$0</div>
            <p className="mt-1 text-sm text-brand-800">Forever</p>
            <ul className="mt-6 space-y-2 text-sm text-brand-800">
              <li>✓ All calculators (volume, chemical, chlorine)</li>
              <li>✓ Maintenance schedules</li>
              <li>✓ Water test logs + CSV export</li>
              <li>✓ Service reports + PDF export &amp; sharing</li>
              <li>✓ Manual JSON + ZIP backup/restore</li>
              <li className="text-brand-700">✗ Ads shown (AdSense)</li>
            </ul>
            <a href="/tools/pool-volume" className="btn-ghost mt-8 w-full text-center">Get Started Free</a>
          </div>
          <div className="glass-strong relative overflow-hidden p-8 ring-2 ring-brand-500">
            <span className="absolute right-4 top-4 rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">Best Value</span>
            <h3 className="text-xl font-bold text-brand-800">Pro</h3>
            <div className="mt-2 text-4xl font-extrabold text-brand-700">$29</div>
            <p className="mt-1 text-sm text-brand-800">One-time · Lifetime</p>
            <ul className="mt-6 space-y-2 text-sm text-brand-800">
              <li>✓ Everything in Free</li>
              <li>✓ Saved customer &amp; pool profiles</li>
              <li>✓ Service history &amp; 1-tap cloning</li>
              <li>✓ Reusable report templates</li>
              <li>✓ Business logo &amp; brand colors</li>
              <li>✓ Automated recovery snapshots</li>
              <li>✓ 100% ad-free</li>
            </ul>
            <div className="mt-8 w-full">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="rounded-full bg-brand-500/20 border border-brand-500/30 px-4 py-2 text-sm font-semibold text-brand-800">
                  Pro Active ✓
                </div>
              </div>
            </div>
            </div>
        </div>
      </section>
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand-800">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="glass-card group p-5">
              <summary className="cursor-pointer list-none font-semibold text-brand-800">
                {f.q}
                <span className="float-right text-brand-700 transition group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-3 text-sm text-brand-800">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
