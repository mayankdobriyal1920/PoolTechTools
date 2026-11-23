import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "How to Calculate Pool Volume (Gallons) — PoolTechTools",
  description: "Step-by-step guide to calculating pool volume in U.S. gallons for rectangular, round, oval, kidney, and irregular pools.",
  alternates: { canonical: "/guides/pool-volume-calculation" },
};

export default function PoolVolumeGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-brand-800">How to Calculate Pool Volume</h1>
      <p className="mt-3 text-brand-800">
        Knowing your pool&apos;s volume in U.S. gallons is the foundation of safe chemical dosing. This guide explains the math for every common pool shape.
      </p>

      <h2 className="mt-8 text-xl font-bold text-brand-800">Rectangular / Square (sloped floor)</h2>
      <p className="mt-2 text-brand-800">Average depth = (shallow + deep) / 2. Volume (gal) = length × width × average depth × 7.48052.</p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Round</h2>
      <p className="mt-2 text-brand-800">Volume (gal) = π × radius² × average depth × 7.48052, where radius = diameter / 2.</p>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Oval</h2>
      <p className="mt-2 text-brand-800">Volume (gal) = (π / 4) × length × width × average depth × 7.48052.</p>

      <div className="my-6"><AdSlot slot="9592081145" /></div>

      <h2 className="mt-6 text-xl font-bold text-brand-800">Kidney / Irregular</h2>
      <p className="mt-2 text-brand-800">
        Use measured cross-sections with trapezoidal integration, or an estimated surface area × average depth. These are estimates — actual capacity varies with construction.
      </p>

      <div className="mt-8">
        <a href="/tools/pool-volume" className="btn-primary">Try the Pool Volume Calculator</a>
      </div>

      <p className="mt-8 text-xs text-brand-700">
        Disclaimer: Pool volume results are mathematical calculations based on the dimensions you enter. Real-world water capacity depends on construction tolerances, floor contours, steps, benches, and water level. Always verify against the pool&apos;s actual fill line and product label.
      </p>
    </article>
  );
}
