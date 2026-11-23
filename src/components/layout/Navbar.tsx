"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { useEntitlement } from "@/hooks/useEntitlement";

export function Navbar() {
  const { isPro, loading } = useEntitlement();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={36} />
          <span className="text-lg font-bold text-white">PoolTechTools</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/tools/pool-volume" className="text-sm font-medium text-white/90 hover:text-white">Calculators</Link>
          <Link href="/tools/service-report" className="text-sm font-medium text-white/90 hover:text-white">Service Reports</Link>
          <Link href="#pricing" className="text-sm font-medium text-white/90 hover:text-white">Pricing</Link>
          <Link href="#faq" className="text-sm font-medium text-white/90 hover:text-white">FAQ</Link>
          {loading || !isPro ? (
            <Link href="/pro/activate" className="text-sm font-medium text-white/90 hover:text-white">Activate Pro</Link>
          ) : (
            <span className="text-sm font-medium text-white/90 px-4 py-2 rounded-full bg-brand-500/20 border border-brand-500/30">Pro User</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="md:hidden flex items-center rounded-md bg-white/15 px-3 py-2 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
          <div className="hidden md:flex items-center gap-2">
            {isPro ? (
              <div className="flex items-center gap-2">
                <Link href="/tools/service-report" className="flex items-center rounded-[10px] border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25">Create Report</Link>
                <span className="flex items-center rounded-full bg-brand-500/20 border border-brand-500/30 px-4 py-2 text-sm font-semibold text-white">Pro User</span>
              </div>
            ) : (
              <>
                <Link href="/tools/service-report" className="hidden sm:inline-flex items-center rounded-[10px] border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25">Create Report</Link>
                <Link href="/pro/activate" className="hidden sm:inline-flex items-center rounded-[10px] border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25">Activate Pro</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex flex-col items-center gap-4 text-center">
            <Link href="/" className="text-white text-lg font-bold">PoolTechTools</Link>
            <nav className="flex flex-col items-center gap-4 mt-4">
              <Link href="/tools/pool-volume" className="text-white text-lg font-medium">Calculators</Link>
              <Link href="/tools/service-report" className="text-white text-lg font-medium">Service Reports</Link>
              <Link href="#pricing" className="text-white text-lg font-medium">Pricing</Link>
              <Link href="#faq" className="text-white text-lg font-medium">FAQ</Link>
              <hr className="w-full border-white/20 my-4" />
              <Link href="/pro/activate" className="text-brand-500 text-lg font-bold">Upgrade to Pro</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}